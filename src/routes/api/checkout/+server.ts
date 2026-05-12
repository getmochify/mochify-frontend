import { Polar } from '@polar-sh/sdk';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostHogClient } from '$lib/server/posthog';

export const GET: RequestHandler = async ({ locals, url }) => {
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
		const loginUrl = new URL('/auth/login', url.origin);
		loginUrl.searchParams.set('redirectTo', url.pathname + url.search);
		throw redirect(303, loginUrl.toString());
	}

	const polar = new Polar({
		accessToken: env.POLAR_ACCESS_TOKEN,
		...(env.POLAR_SANDBOX === 'true' ? { server: 'sandbox' } : {})
	});

	let checkoutUrl: string;
	try {
		const checkout = await polar.checkouts.create({
			products: [productId],
			successUrl: `${url.origin}/dashboard?upgraded=true`,
			externalCustomerId: user.id,
			customerEmail: user.email ?? undefined
		});
		checkoutUrl = checkout.url;
	} catch (err) {
		console.error('Polar checkout error:', err);
		throw redirect(303, '/pricing?checkout_error=1');
	}

	const posthog = getPostHogClient();
	posthog.capture({
		distinctId: user.id,
		event: 'checkout_initiated',
		properties: { plan, billing, $set: { email: user.email } }
	});
	await posthog.flush();

	throw redirect(302, checkoutUrl);
};
