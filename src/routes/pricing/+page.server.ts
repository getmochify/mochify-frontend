import type { PageServerLoad } from './$types';
import { createPolarClient } from '$lib/server/discounts';
import { DEFAULT_CURRENCY, countryFromRequest, currencyForCountry } from '$lib/server/currency';
import { PLAN_PRODUCT_IDS, getPriceTable } from '$lib/server/prices';

/**
 * Prices for the visitor's own currency, or `null` to leave the page on its
 * hardcoded USD copy.
 *
 * Two rules, both about not lying to the buyer:
 *
 * 1. Only ever show an amount Polar actually holds. No FX conversion here —
 *    a converted "approximately £19" next to a USD charge is worse than
 *    showing USD throughout.
 * 2. All or nothing. A page mixing £6.99 against $249.99 is unreadable, so a
 *    plan missing a local price drops the whole page back to USD.
 */
export const load: PageServerLoad = async ({ platform, request }) => {
	const currency = currencyForCountry(countryFromRequest(request, platform));
	if (currency === DEFAULT_CURRENCY) return { pricing: null };

	const table = await getPriceTable(createPolarClient(), platform?.env?.USAGE_KV);
	if (!table) return { pricing: null };

	const prices: Record<string, number> = {};
	for (const [plan, productId] of Object.entries(PLAN_PRODUCT_IDS())) {
		// An unset product id is a plan we don't sell yet (Day Pass on a
		// deployment without it configured), not a reason to drop to USD.
		if (!productId) continue;
		const amount = table[productId]?.[currency];
		if (amount === undefined) return { pricing: null };
		prices[plan] = amount;
	}

	return { pricing: { currency, prices } };
};
