import { Polar } from '@polar-sh/sdk';
import { env } from '$env/dynamic/private';

export type PaidDayPassCheckout = {
	id: string;
	email: string;
	returnPath: unknown;
};

/**
 * Resolve the checkout this browser paid for, from the URL the overlay opened.
 *
 * The client secret (its last segment) is only ever held by the browser that
 * started the checkout, which is what makes it usable as proof of purchase by
 * `api/day-pass/resend` and the in-tab activation (`dayPassActivation`). The
 * email always comes from Polar, never from the request.
 *
 * Answers `invalid` for a URL that is not a Polar checkout, `not_found` when
 * Polar does not know it, and `not_paid` until it has succeeded for the Day
 * Pass product.
 */
export async function paidDayPassCheckout(
	checkoutUrl: unknown
): Promise<PaidDayPassCheckout | 'invalid' | 'not_found' | 'not_paid'> {
	const raw = typeof checkoutUrl === 'string' ? checkoutUrl : '';
	const secret = /^https:\/\/(?:sandbox\.)?polar\.sh\/checkout\/(polar_c_[A-Za-z0-9]+)/.exec(
		raw
	)?.[1];
	if (!secret) return 'invalid';

	const polar = new Polar({
		accessToken: env.POLAR_ACCESS_TOKEN,
		...(env.POLAR_SANDBOX === 'true' ? { server: 'sandbox' } : {})
	});

	let checkout;
	try {
		const pub = await polar.checkouts.clientGet({ clientSecret: secret });
		checkout = await polar.checkouts.get({ id: pub.id });
	} catch (err) {
		console.error('[daypass] checkout lookup failed:', err);
		return 'not_found';
	}

	if (
		checkout.status !== 'succeeded' ||
		checkout.productId !== env.POLAR_PRODUCT_ID_DAY_PASS ||
		!checkout.customerEmail
	) {
		return 'not_paid';
	}
	return {
		id: checkout.id,
		email: checkout.customerEmail,
		returnPath: checkout.metadata?.return_path
	};
}
