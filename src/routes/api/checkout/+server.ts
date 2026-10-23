import { Polar } from '@polar-sh/sdk';
import { AddressInputCountryAlpha2Input } from '@polar-sh/sdk/models/components/addressinput.js';
import { env } from '$env/dynamic/private';
import { PUBLIC_POSTHOG_PROJECT_TOKEN } from '$env/static/public';
import { json, redirect, type Cookies } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostHogClient } from '$lib/server/posthog';
import { discountIdForCode } from '$lib/server/abandonedCart';
import { countryFromRequest, type Currency } from '$lib/server/currency';
import { currencyForCheckout } from '$lib/server/prices';

const POLAR_TIMEOUT_MS = 8000;

function polarClient(): Polar {
	return new Polar({
		accessToken: env.POLAR_ACCESS_TOKEN,
		...(env.POLAR_SANDBOX === 'true' ? { server: 'sandbox' } : {})
	});
}

const BILLING_COUNTRIES = new Set<string>(Object.values(AddressInputCountryAlpha2Input));

/**
 * The visitor's country as a billing-address prefill, or null when Polar would
 * not accept it. Cloudflare sends `XX` for an unplaceable IP and `T1` for Tor,
 * and the SDK rejects anything outside its country enum before the request is
 * even sent, which would fail the whole checkout over a convenience.
 */
function billingCountry(country: string | null): AddressInputCountryAlpha2Input | null {
	const code = country?.toUpperCase() ?? '';
	return BILLING_COUNTRIES.has(code) ? (code as AddressInputCountryAlpha2Input) : null;
}

/** Create a checkout, capped so a slow Polar can't hold the request open. */
async function createCheckout(
	polar: Polar,
	params: {
		productId: string;
		successUrl: string;
		currency: Currency | null;
		userId?: string;
		email?: string;
		discountId?: string | null;
		metadata?: Record<string, string>;
		/** Origin allowed to host the checkout in an iframe (Polar's embedded checkout). */
		embedOrigin?: string;
		/** Prefills the billing country; the buyer can still change it. */
		country?: string | null;
	}
): Promise<string> {
	const country = billingCountry(params.country ?? null);
	const create = (withCountry: boolean) => {
		const timeout = new Promise<never>((_, reject) =>
			setTimeout(() => reject(new Error('Polar API timeout')), POLAR_TIMEOUT_MS)
		);
		return Promise.race([
			polar.checkouts.create({
				products: [params.productId],
				successUrl: params.successUrl,
				...(params.userId ? { externalCustomerId: params.userId } : {}),
				...(params.email ? { customerEmail: params.email } : {}),
				...(params.currency ? { currency: params.currency } : {}),
				...(params.discountId ? { discountId: params.discountId } : {}),
				...(params.metadata ? { metadata: params.metadata } : {}),
				...(params.embedOrigin ? { embedOrigin: params.embedOrigin } : {}),
				...(withCountry && country ? { customerBillingAddress: { country } } : {})
			}),
			timeout
		]);
	};
	let checkout;
	try {
		checkout = await create(true);
	} catch (err) {
		// A timeout is not a refusal, and Polar may still create that checkout.
		if (!country || (err instanceof Error && err.message === 'Polar API timeout')) throw err;
		// A prefill must never cost the sale: if Polar refuses the country (a
		// market it does not sell to), offer the checkout without it.
		console.error(`[checkout] retrying without billing country ${country}:`, err);
		checkout = await create(false);
	}
	return checkout.url;
}

/**
 * Where a Day Pass buyer lands after paying.
 *
 * `next` is whatever page the CTA was clicked on, so someone who bought the
 * pass from a converter page comes back to it rather than the homepage. It is
 * attacker-controlled markup in the form body, hence the same-origin check: a
 * `//evil.com` or absolute URL resolves to a foreign origin and is discarded.
 * `day_pass_success=1` is appended here rather than trusted from the client,
 * so the flag that fires the magic-link toast can only come from a real
 * checkout.
 */
function dayPassSuccessUrl(origin: string, next: FormDataEntryValue | null | undefined): string {
	let target = new URL('/', origin);
	if (typeof next === 'string' && next.startsWith('/')) {
		try {
			const candidate = new URL(next, origin);
			if (candidate.origin === origin) target = candidate;
		} catch {
			/* keep the homepage */
		}
	}
	target.searchParams.set('day_pass_success', '1');
	return target.toString();
}

/**
 * The same page as a path, for the activation magic link. An anonymous buyer
 * finishes on the success page in the checkout tab, then activates from the
 * email, and that link used to land on the homepage: three steps away from the
 * converter with their files on it. Carried on the checkout's metadata, which
 * Polar copies onto the order the webhook receives. Polar caps a metadata
 * value at 500 characters, so a longer path is dropped rather than truncated.
 */
function dayPassReturnPath(successUrl: string): Record<string, string> | undefined {
	const target = new URL(successUrl);
	target.searchParams.delete('day_pass_success');
	const path = target.pathname + target.search;
	return path.length <= 500 ? { return_path: path } : undefined;
}

/**
 * The browser's PostHog id, so an anonymous Day Pass purchase stitches onto the
 * session that led to it. posthog-js keeps it in its own cookie; reading it is
 * the only way to attribute a server-side event for a caller with no account.
 * Falls back to `anonymous`, matching the webhook's own unresolved-buyer events.
 */
function posthogDistinctId(cookies: Cookies, userId?: string): string {
	if (userId) return userId;
	const raw = cookies.get(`ph_${PUBLIC_POSTHOG_PROJECT_TOKEN}_posthog`);
	if (raw) {
		try {
			const id = (JSON.parse(raw) as { distinct_id?: string }).distinct_id;
			if (id) return id;
		} catch {
			/* fall through */
		}
	}
	return 'anonymous';
}

type SubscriptionCheckout =
	| { kind: 'checkout'; url: string; successUrl: string }
	| { kind: 'signup'; url: string }
	| { kind: 'invalid' }
	| { kind: 'failed' };

/**
 * Create a subscription checkout for the plan in the query string. Shared by the
 * GET link (hosted checkout, full-page redirect) and the JSON POST that opens
 * the same checkout as an on-page overlay (`startPlanCheckout`); `embed` is
 * the only difference between them.
 */
async function subscriptionCheckout(
	{ locals, url, platform, request }: Parameters<RequestHandler>[0],
	embed: boolean
): Promise<SubscriptionCheckout> {
	const plan = url.searchParams.get('plan') ?? 'pro';
	const billing = url.searchParams.get('billing') ?? 'monthly';

	const PRODUCTS: Record<string, Record<string, string>> = {
		seller: {
			monthly: env.POLAR_PRODUCT_ID_SELLER_MONTHLY,
			yearly: env.POLAR_PRODUCT_ID_SELLER_YEARLY
		},
		pro: { monthly: env.POLAR_PRODUCT_ID_PRO_MONTHLY, yearly: env.POLAR_PRODUCT_ID_PRO_YEARLY },
		// Unset until the Growth products are configured; the `!productId` guard
		// below then returns a 400 with a log naming the missing var, rather than
		// sending someone to Polar with an empty product id.
		growth: {
			monthly: env.POLAR_PRODUCT_ID_GROWTH_MONTHLY ?? '',
			yearly: env.POLAR_PRODUCT_ID_GROWTH_YEARLY ?? ''
		}
	};

	const productId = PRODUCTS[plan]?.[billing];

	if (!productId) {
		console.error(
			`[checkout] No product ID for plan=${plan} billing=${billing}. Check POLAR_PRODUCT_ID_* env vars.`
		);
		return { kind: 'invalid' };
	}

	const { user } = locals;

	if (!user) {
		// `next` is always the GET link, so after signing up the buyer lands on
		// the hosted checkout whichever way they started.
		const signupUrl = new URL('/auth/register', url.origin);
		signupUrl.searchParams.set('next', url.pathname + url.search);
		return { kind: 'signup', url: signupUrl.toString() };
	}

	const polar = polarClient();

	// Recovery links from the abandoned cart email carry the minted code. Resolving
	// it to a discount id here means the customer never has to copy and paste
	// anything, which is the single biggest drop-off in a code-redemption flow.
	//
	// The lookup is scoped to the logged-in user's own rows, so a leaked code is
	// useless to anyone else even before Polar's maxRedemptions cap applies.
	let discountId: string | null = null;
	const code = url.searchParams.get('code');
	if (code && platform?.env?.DB) {
		discountId = await discountIdForCode(platform.env.DB, user.id, code).catch((e) => {
			console.error('[checkout] discount lookup failed:', e);
			return null;
		});
	}

	// Polar's hosted day-pass link picks the buyer's local currency on its own.
	// A checkout created over the API does not, so it always rendered in the
	// product's base currency (USD). Resolve the presentment currency here so
	// subscriptions match: local currency when the product is priced in it,
	// USD otherwise.
	const currency = await currencyForCheckout(
		polar,
		platform?.env?.USAGE_KV,
		productId,
		countryFromRequest(request, platform)
	);

	const successUrl = `${url.origin}/dashboard?upgraded=true`;
	let checkoutUrl: string;
	try {
		checkoutUrl = await createCheckout(polar, {
			productId,
			successUrl,
			currency,
			country: countryFromRequest(request, platform),
			userId: user.id,
			email: user.email ?? undefined,
			discountId,
			embedOrigin: embed ? url.origin : undefined
		});
	} catch (err) {
		console.error('Polar checkout error:', err);
		return { kind: 'failed' };
	}

	const posthog = getPostHogClient();
	posthog.capture({
		distinctId: user.id,
		event: 'checkout_initiated',
		properties: {
			plan,
			billing,
			currency: currency ?? 'default',
			recovered: discountId !== null,
			embed,
			$set: { email: user.email }
		}
	});
	// Fire-and-forget — don't block the redirect waiting for PostHog.
	const flushPromise = posthog.flush().catch(() => {});
	platform?.context?.waitUntil?.(flushPromise);

	return { kind: 'checkout', url: checkoutUrl, successUrl };
}

export const GET: RequestHandler = async (event) => {
	// The Day Pass is POST-only, deliberately — see the POST handler below.
	if (event.url.searchParams.get('plan') === 'day') {
		return new Response('The Day Pass checkout is POST-only', { status: 405 });
	}

	const result = await subscriptionCheckout(event, false);
	switch (result.kind) {
		case 'invalid':
			return new Response('Invalid plan or billing cycle', { status: 400 });
		case 'signup':
			throw redirect(303, result.url);
		case 'failed':
			throw redirect(303, '/pricing?checkout_error=1');
		case 'checkout':
			throw redirect(302, result.url);
	}
};

/**
 * Day Pass checkout. POST-only, and that is the whole point of the handler.
 *
 * The pass used to be a bare `buy.polar.sh` href inlined into public HTML.
 * Loading one of those links creates a real Polar checkout session, so every
 * crawler, link unfurler, security scanner and speculative prefetch that
 * followed the anchor minted a session that later expired as an abandoned
 * cart. Nothing crawls a POST, and the hosted URL no longer appears in the
 * markup at all, so the only way to reach Polar now is a submitted form.
 *
 * Unlike the subscription path above this must work for a signed-out caller:
 * the pass is bought anonymously and activated by the magic link that
 * `order.created` sends (see api/webhooks/polar). A session is used when one
 * happens to exist, purely to link the Polar customer to the account.
 *
 * Two body shapes, same work. A form-encoded body is the no-JS submit and gets
 * a 303 to Polar. A JSON body is what the CTA sends when JS is available, and
 * gets `{ url }` back to navigate to: SvelteKit's CSRF guard rejects a
 * form-encoded POST that arrives without an `Origin` header (webviews, privacy
 * extensions and filtering proxies all strip it) before this handler ever runs,
 * and JSON is not a form content type, so it is never subject to that check.
 * See `startDayPassCheckout` in `$lib/dayPass`.
 */
export const POST: RequestHandler = async (event) => {
	const { locals, url, platform, request, cookies } = event;
	const plan = url.searchParams.get('plan') ?? 'day';
	if (plan !== 'day') {
		// A subscription plan arrives here only as the JSON request behind the
		// on-page overlay (`startPlanCheckout`); its links are plain GETs.
		if (!request.headers.get('content-type')?.includes('application/json')) {
			return new Response('POST checkout is Day Pass or JSON only', { status: 400 });
		}
		const result = await subscriptionCheckout(event, true);
		switch (result.kind) {
			case 'invalid':
				return new Response('Invalid plan or billing cycle', { status: 400 });
			case 'signup':
				return json({ redirect: result.url });
			case 'failed':
				return json({ error: 'checkout_failed' }, { status: 502 });
			case 'checkout':
				return json({ url: result.url, successUrl: result.successUrl });
		}
	}

	const productId = env.POLAR_PRODUCT_ID_DAY_PASS;
	if (!productId) {
		console.error('[checkout] No POLAR_PRODUCT_ID_DAY_PASS set.');
		return new Response('Day Pass is not configured', { status: 400 });
	}

	const wantsJson = request.headers.get('content-type')?.includes('application/json') ?? false;

	let next: string | null = null;
	let trigger: string | null = null;
	// The CTA asks for an embeddable checkout when it will open Polar as an
	// overlay on this page (see `startDayPassCheckout`). The no-JS form never
	// does: it lands on the hosted page in a new tab, as before.
	let embed = false;
	if (wantsJson) {
		const body = (await request.json().catch(() => null)) as {
			next?: unknown;
			trigger?: unknown;
			embed?: unknown;
		} | null;
		next = typeof body?.next === 'string' ? body.next : null;
		trigger = typeof body?.trigger === 'string' ? body.trigger : null;
		embed = body?.embed === true;
	} else {
		const form = await request.formData().catch(() => null);
		const rawNext = form?.get('next');
		const rawTrigger = form?.get('trigger');
		next = typeof rawNext === 'string' ? rawNext : null;
		trigger = typeof rawTrigger === 'string' ? rawTrigger : null;
	}

	const successUrl = dayPassSuccessUrl(url.origin, next);

	const { user } = locals;
	const polar = polarClient();

	const currency = await currencyForCheckout(
		polar,
		platform?.env?.USAGE_KV,
		productId,
		countryFromRequest(request, platform)
	);

	let checkoutUrl: string;
	try {
		checkoutUrl = await createCheckout(polar, {
			productId,
			successUrl,
			currency,
			country: countryFromRequest(request, platform),
			userId: user?.id,
			email: user?.email ?? undefined,
			metadata: dayPassReturnPath(successUrl),
			embedOrigin: embed ? url.origin : undefined
		});
	} catch (err) {
		console.error('Polar day pass checkout error:', err);
		// An overlay cannot show our error page, and navigating away would drop
		// whatever the buyer had on the page; the caller says so in place.
		if (embed) return json({ error: 'checkout_failed' }, { status: 502 });
		// Absolute, because the caller may be navigating a freshly opened tab
		// whose document has no base URL to resolve a path against.
		const errorUrl = new URL('/pricing?checkout_error=1', url.origin).toString();
		if (wantsJson) return json({ url: errorUrl });
		throw redirect(303, errorUrl);
	}

	const posthog = getPostHogClient();
	posthog.capture({
		distinctId: posthogDistinctId(cookies, user?.id),
		event: 'checkout_initiated',
		properties: {
			plan: 'day',
			billing: 'one_time',
			currency: currency ?? 'default',
			authed: !!user,
			trigger,
			embed,
			...(user?.email ? { $set: { email: user.email } } : {})
		}
	});
	const flushPromise = posthog.flush().catch(() => {});
	platform?.context?.waitUntil?.(flushPromise);

	if (wantsJson) return json({ url: checkoutUrl });
	throw redirect(303, checkoutUrl);
};
