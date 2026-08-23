import { Polar } from '@polar-sh/sdk';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostHogClient } from '$lib/server/posthog';
import { discountIdForCode } from '$lib/server/abandonedCart';

const POLAR_TIMEOUT_MS = 8000;

export const GET: RequestHandler = async ({ locals, url, platform }) => {
	const plan = url.searchParams.get('plan') ?? 'pro';
	const billing = url.searchParams.get('billing') ?? 'monthly';

	const PRODUCTS: Record<string, Record<string, string>> = {
		seller: { monthly: env.POLAR_PRODUCT_ID_SELLER_MONTHLY, yearly: env.POLAR_PRODUCT_ID_SELLER_YEARLY },
		pro: { monthly: env.POLAR_PRODUCT_ID_PRO_MONTHLY, yearly: env.POLAR_PRODUCT_ID_PRO_YEARLY }
	};

	const productId = PRODUCTS[plan]?.[billing];

	if (!productId) {
		console.error(`[checkout] No product ID for plan=${plan} billing=${billing}. Check POLAR_PRODUCT_ID_* env vars.`);
		return new Response('Invalid plan or billing cycle', { status: 400 });
	}

	const { user } = locals;

	if (!user) {
		const signupUrl = new URL('/auth/register', url.origin);
		signupUrl.searchParams.set('next', url.pathname + url.search);
		throw redirect(303, signupUrl.toString());
	}

	const polar = new Polar({
		accessToken: env.POLAR_ACCESS_TOKEN,
		...(env.POLAR_SANDBOX === 'true' ? { server: 'sandbox' } : {})
	});

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

	let checkoutUrl: string;
	try {
		const timeout = new Promise<never>((_, reject) =>
			setTimeout(() => reject(new Error('Polar API timeout')), POLAR_TIMEOUT_MS)
		);
		const checkout = await Promise.race([
			polar.checkouts.create({
				products: [productId],
				successUrl: `${url.origin}/dashboard?upgraded=true`,
				externalCustomerId: user.id,
				customerEmail: user.email ?? undefined,
				...(discountId ? { discountId } : {})
			}),
			timeout
		]);
		checkoutUrl = checkout.url;
	} catch (err) {
		console.error('Polar checkout error:', err);
		throw redirect(303, '/pricing?checkout_error=1');
	}

	const posthog = getPostHogClient();
	posthog.capture({
		distinctId: user.id,
		event: 'checkout_initiated',
		properties: { plan, billing, recovered: discountId !== null, $set: { email: user.email } }
	});
	// Fire-and-forget — don't block the redirect waiting for PostHog.
	const flushPromise = posthog.flush().catch(() => {});
	platform?.context?.waitUntil?.(flushPromise);

	throw redirect(302, checkoutUrl);
};
