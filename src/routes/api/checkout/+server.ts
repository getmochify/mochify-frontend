import { Polar } from '@polar-sh/sdk';
import { env } from '$env/dynamic/private';
import { PUBLIC_POSTHOG_PROJECT_TOKEN } from '$env/static/public';
import { redirect, type Cookies } from '@sveltejs/kit';
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
	}
): Promise<string> {
	const timeout = new Promise<never>((_, reject) =>
		setTimeout(() => reject(new Error('Polar API timeout')), POLAR_TIMEOUT_MS)
	);
	const checkout = await Promise.race([
		polar.checkouts.create({
			products: [params.productId],
			successUrl: params.successUrl,
			...(params.userId ? { externalCustomerId: params.userId } : {}),
			...(params.email ? { customerEmail: params.email } : {}),
			...(params.currency ? { currency: params.currency } : {}),
			...(params.discountId ? { discountId: params.discountId } : {})
		}),
		timeout
	]);
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

export const GET: RequestHandler = async ({ locals, url, platform, request }) => {
	const plan = url.searchParams.get('plan') ?? 'pro';
	const billing = url.searchParams.get('billing') ?? 'monthly';

	// The Day Pass is POST-only, deliberately — see the POST handler below.
	if (plan === 'day') {
		return new Response('The Day Pass checkout is POST-only', { status: 405 });
	}

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
		return new Response('Invalid plan or billing cycle', { status: 400 });
	}

	const { user } = locals;

	if (!user) {
		const signupUrl = new URL('/auth/register', url.origin);
		signupUrl.searchParams.set('next', url.pathname + url.search);
		throw redirect(303, signupUrl.toString());
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

	let checkoutUrl: string;
	try {
		checkoutUrl = await createCheckout(polar, {
			productId,
			successUrl: `${url.origin}/dashboard?upgraded=true`,
			currency,
			userId: user.id,
			email: user.email ?? undefined,
			discountId
		});
	} catch (err) {
		console.error('Polar checkout error:', err);
		throw redirect(303, '/pricing?checkout_error=1');
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
			$set: { email: user.email }
		}
	});
	// Fire-and-forget — don't block the redirect waiting for PostHog.
	const flushPromise = posthog.flush().catch(() => {});
	platform?.context?.waitUntil?.(flushPromise);

	throw redirect(302, checkoutUrl);
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
 */
export const POST: RequestHandler = async ({ locals, url, platform, request, cookies }) => {
	const plan = url.searchParams.get('plan') ?? 'day';
	if (plan !== 'day') {
		return new Response('POST checkout is Day Pass only', { status: 400 });
	}

	const productId = env.POLAR_PRODUCT_ID_DAY_PASS;
	if (!productId) {
		console.error('[checkout] No POLAR_PRODUCT_ID_DAY_PASS set.');
		return new Response('Day Pass is not configured', { status: 400 });
	}

	const form = await request.formData().catch(() => null);
	const successUrl = dayPassSuccessUrl(url.origin, form?.get('next'));

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
			userId: user?.id,
			email: user?.email ?? undefined
		});
	} catch (err) {
		console.error('Polar day pass checkout error:', err);
		throw redirect(303, '/pricing?checkout_error=1');
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
			trigger: typeof form?.get('trigger') === 'string' ? form.get('trigger') : null,
			...(user?.email ? { $set: { email: user.email } } : {})
		}
	});
	const flushPromise = posthog.flush().catch(() => {});
	platform?.context?.waitUntil?.(flushPromise);

	throw redirect(303, checkoutUrl);
};
