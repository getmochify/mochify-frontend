import type { PageServerLoad } from './$types';
import { createPolarClient } from '$lib/server/discounts';
import { countryFromRequest } from '$lib/server/currency';
import { localisedPlanPrices } from '$lib/server/prices';

export const load: PageServerLoad = async ({ platform, request }) => {
	const pricing = await localisedPlanPrices(
		createPolarClient(),
		platform?.env?.USAGE_KV,
		countryFromRequest(request, platform)
	);

	return { pricing };
};
