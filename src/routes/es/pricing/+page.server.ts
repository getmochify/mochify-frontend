import type { PageServerLoad } from './$types';
import { createPolarClient } from '$lib/server/discounts';
import { countryFromRequest } from '$lib/server/currency';
import { localisedPlanPrices } from '$lib/server/prices';
import { formatLocaleFor } from '$lib/currency';

export const load: PageServerLoad = async ({ platform, request }) => {
	const country = countryFromRequest(request, platform);
	const pricing = await localisedPlanPrices(
		createPolarClient(),
		platform?.env?.USAGE_KV,
		country
	);

	// Resolved here, not in the component, and NOT inside localisedPlanPrices:
	// that returns null for a USD visitor, and a USD price still has to be
	// written the way its reader writes it. Server-side so the price renders
	// right the first time rather than reflowing after hydration.
	return { pricing, formatLocale: formatLocaleFor('es', country) };
};
