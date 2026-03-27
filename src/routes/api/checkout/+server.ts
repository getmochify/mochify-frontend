import { Polar } from '@polar-sh/sdk';
import {
    POLAR_ACCESS_TOKEN,
    POLAR_PRODUCT_ID_SELLER_MONTHLY,
    POLAR_PRODUCT_ID_SELLER_YEARLY,
    POLAR_PRODUCT_ID_PRO_MONTHLY,
    POLAR_PRODUCT_ID_PRO_YEARLY,
} from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const PRODUCTS: Record<string, Record<string, string>> = {
    seller: { monthly: POLAR_PRODUCT_ID_SELLER_MONTHLY, yearly: POLAR_PRODUCT_ID_SELLER_YEARLY },
    pro:    { monthly: POLAR_PRODUCT_ID_PRO_MONTHLY,    yearly: POLAR_PRODUCT_ID_PRO_YEARLY },
}

export const GET: RequestHandler = async ({ locals, url }) => {
    const plan = url.searchParams.get('plan') ?? 'pro';
    const billing = url.searchParams.get('billing') ?? 'monthly';
    const productId = PRODUCTS[plan]?.[billing];

    if (!productId) {
        return new Response('Invalid plan or billing cycle', { status: 400 });
    }

    const { user } = locals;

    if (!user) {
        const loginUrl = new URL('/auth/login', url.origin);
        loginUrl.searchParams.set('redirectTo', url.pathname + url.search);
        throw redirect(303, loginUrl.toString());
    }

    const polar = new Polar({ accessToken: POLAR_ACCESS_TOKEN });

    let checkoutUrl: string;
    try {
        const checkout = await polar.checkouts.create({
            products: [productId],
            successUrl: `${url.origin}/dashboard?upgraded=true`,
            externalCustomerId: user.id,
            customerEmail: user.email ?? undefined,
        });
        checkoutUrl = checkout.url;
    } catch (err) {
        console.error('Polar checkout error:', err);
        throw redirect(303, '/pricing?checkout_error=1');
    }

    throw redirect(302, checkoutUrl);
};
