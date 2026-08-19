import { Polar } from '@polar-sh/sdk';
import { env } from '$env/dynamic/private';

const POLAR_TIMEOUT_MS = 8000;

/** Percentage off, in basis points. 5000 = 50%. */
export const NEW50_BASIS_POINTS = 5000;

/** How long a minted code stays redeemable. Also the deadline the email quotes. */
export const CODE_TTL_DAYS = 7;

// Crockford-style alphabet: I, L, O and U removed so a code read off a phone
// screen cannot be mistyped as 1/0. Alphanumeric throughout, which Polar
// requires: "Must be between 3 and 256 characters long and contain only
// alphanumeric characters." A hyphenated NEW50-XXXXXX is rejected by the API.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function mintCode(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(6));
	let suffix = '';
	for (const b of bytes) suffix += ALPHABET[b % ALPHABET.length];
	return `NEW50${suffix}`;
}

export function createPolarClient(): Polar {
	return new Polar({
		accessToken: env.POLAR_ACCESS_TOKEN,
		...(env.POLAR_SANDBOX === 'true' ? { server: 'sandbox' } : {})
	});
}

/**
 * The monthly products the discount is allowed against.
 *
 * Scoping matters: "50% off the first month" applied to an annual plan would
 * take $125 off Pro annual. Leaving `products` unset would permit exactly that.
 */
export function discountableProductIds(): string[] {
	return [env.POLAR_PRODUCT_ID_SELLER_MONTHLY, env.POLAR_PRODUCT_ID_PRO_MONTHLY].filter(Boolean);
}

/** Reverse map of product id to the /api/checkout params that rebuild it. */
export function planForProduct(productId: string | null): { plan: string; billing: string } | null {
	if (!productId) return null;
	const map: Record<string, { plan: string; billing: string }> = {
		[env.POLAR_PRODUCT_ID_SELLER_MONTHLY]: { plan: 'seller', billing: 'monthly' },
		[env.POLAR_PRODUCT_ID_SELLER_YEARLY]: { plan: 'seller', billing: 'yearly' },
		[env.POLAR_PRODUCT_ID_PRO_MONTHLY]: { plan: 'pro', billing: 'monthly' },
		[env.POLAR_PRODUCT_ID_PRO_YEARLY]: { plan: 'pro', billing: 'yearly' }
	};
	return map[productId] ?? null;
}

export type MintedDiscount = { id: string; code: string; expiresAt: Date };

/**
 * Mint a single-use 50% discount for one user.
 *
 * `maxRedemptions: 1` is a GLOBAL cap in Polar, not a per-customer one — there is
 * no per-customer or new-customer rule in the API at all. That is precisely why
 * this mints a fresh code per person instead of sharing one: the recipient is the
 * only human who ever sees their code, so a global cap of 1 behaves as
 * "single use by this person". A shared code at maxRedemptions 1 would be burned
 * by whoever redeemed first and silently dead for everyone after.
 */
export async function mintAbandonedCartDiscount(userId: string): Promise<MintedDiscount | null> {
	const products = discountableProductIds();
	if (products.length === 0) {
		console.error(
			'[discounts] No monthly product ids configured — refusing to mint an unscoped discount'
		);
		return null;
	}

	const polar = createPolarClient();
	const code = mintCode();
	const expiresAt = new Date(Date.now() + CODE_TTL_DAYS * 24 * 60 * 60 * 1000);

	try {
		const timeout = new Promise<never>((_, reject) =>
			setTimeout(() => reject(new Error('Polar API timeout')), POLAR_TIMEOUT_MS)
		);
		const discount = await Promise.race([
			polar.discounts.create({
				name: `NEW50 abandoned cart (${userId})`,
				code,
				type: 'percentage',
				basisPoints: NEW50_BASIS_POINTS,
				duration: 'once',
				maxRedemptions: 1,
				products,
				endsAt: expiresAt,
				metadata: { user_id: userId, campaign: 'abandoned_cart' }
			}),
			timeout
		]);
		return { id: discount.id, code, expiresAt };
	} catch (e) {
		// Swallow. The caller is a webhook that must still return 200: a non-2xx
		// makes Polar retry, and a retry that succeeds after a transient failure
		// would mint a second live code for the same person.
		console.error('[discounts] mint failed:', e);
		return null;
	}
}
