import { Polar } from '@polar-sh/sdk';
import { POLAR_ACCESS_TOKEN, POLAR_PRODUCT_ID } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const { user } = await locals.safeGetSession();
    if (!user) throw redirect(303, '/auth/login');

    const polar = new Polar({ accessToken: POLAR_ACCESS_TOKEN });

    let checkout;
    try {
        checkout = await polar.checkouts.create({
            products: [POLAR_PRODUCT_ID],
            successUrl: `${url.origin}/dashboard?upgraded=true`,
            externalCustomerId: user.id,
            customerEmail: user.email ?? undefined,
        });
    } catch (err) {
        console.error('Polar checkout error:', err);
        return new Response(JSON.stringify({ error: String(err) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    throw redirect(302, checkout.url);
};
