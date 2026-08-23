import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPolarClient } from '$lib/server/discounts';
import { countryFromRequest } from '$lib/server/currency';
import { localisedPlanPrices } from '$lib/server/prices';

/**
 * Plan prices in the caller's own currency, for surfaces that can't ask the
 * server at render time.
 *
 * The pricing page gets this from its own load function. `ImageUpload` cannot:
 * it lives on prerendered pages (`/solutions/*` and the converter routes),
 * whose HTML is built long before anyone's country is known. It calls this once
 * a visitor actually stages files, so the price is resolved before any upgrade
 * wall can render, and bounce traffic never triggers the request at all.
 *
 * `{ pricing: null }` means "stay on USD" — the answer for most of the world,
 * and the answer whenever Polar is unreachable.
 */
export const GET: RequestHandler = async ({ platform, request, setHeaders }) => {
	const pricing = await localisedPlanPrices(
		createPolarClient(),
		platform?.env?.USAGE_KV,
		countryFromRequest(request, platform)
	);

	// Private, because the response is geolocated: a shared cache in front of
	// this would hand one country's prices to another. The browser's own cache
	// is per-visitor, so a few minutes there is safe and covers the common case
	// of someone working through several converter pages in one session.
	setHeaders({ 'cache-control': 'private, max-age=300' });

	return json({ pricing });
};
