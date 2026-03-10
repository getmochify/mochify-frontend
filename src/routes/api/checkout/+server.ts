import { Polar } from '@polar-sh/sdk';
import {
    POLAR_ACCESS_TOKEN,
    POLAR_PRODUCT_ID_LITE_MONTHLY,
    POLAR_PRODUCT_ID_LITE_YEARLY,
    POLAR_PRODUCT_ID_PRO_MONTHLY,
    POLAR_PRODUCT_ID_PRO_YEARLY,
} from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const PRODUCTS: Record<string, Record<string, string>> = {
    lite: { monthly: POLAR_PRODUCT_ID_LITE_MONTHLY, yearly: POLAR_PRODUCT_ID_LITE_YEARLY },
    pro:  { monthly: POLAR_PRODUCT_ID_PRO_MONTHLY,  yearly: POLAR_PRODUCT_ID_PRO_YEARLY },
}

export const GET: RequestHandler = async ({ locals, url }) => {
    const { user } = await locals.safeGetSession();
    if (!user) throw redirect(303, '/auth/login');

    const plan = url.searchParams.get('plan') ?? 'pro';
    const billing = url.searchParams.get('billing') ?? 'monthly';
    const productId = PRODUCTS[plan]?.[billing];

    if (!productId) {
        return new Response('Invalid plan or billing cycle', { status: 400 });
    }

    const polar = new Polar({ accessToken: POLAR_ACCESS_TOKEN });

    const checkout = await polar.checkouts.create({
        products: [productId],
        successUrl: `${url.origin}/dashboard?upgraded=true`,
        externalCustomerId: user.id,
        customerEmail: user.email ?? undefined,
    });

    throw redirect(302, checkout.url);
};
