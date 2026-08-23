import type { Polar } from '@polar-sh/sdk';
import { env } from '$env/dynamic/private';
import { DEFAULT_CURRENCY, currencyForCountry, type Currency } from './currency';

/** Amounts are minor units (cents/pence), keyed by lowercase currency code. */
export type ProductPrices = Record<string, number>;
/** Every priced product we sell, keyed by Polar product id. */
export type PriceTable = Record<string, ProductPrices>;

/** The plans the pricing page renders, in the order it renders them. */
export const PLAN_PRODUCT_IDS = (): Record<string, string> => ({
	sellerMonthly: env.POLAR_PRODUCT_ID_SELLER_MONTHLY,
	sellerYearly: env.POLAR_PRODUCT_ID_SELLER_YEARLY,
	proMonthly: env.POLAR_PRODUCT_ID_PRO_MONTHLY,
	proYearly: env.POLAR_PRODUCT_ID_PRO_YEARLY,
	dayPass: env.POLAR_PRODUCT_ID_DAY_PASS
});

const KV_KEY = 'polar:prices:v1';
const KV_TTL_SECONDS = 3600;
// Shorter than the KV TTL so a price edit in Polar reaches buyers within the
// hour even on an isolate that never gets recycled.
const MEMORY_TTL_MS = 5 * 60 * 1000;
// A failed lookup is remembered too, briefly. Without this, a Polar outage
// would put a fresh 3s timeout in front of every non-USD page render.
const FAILURE_TTL_MS = 60 * 1000;
// This lookup is an enhancement on both call sites. A slow Polar should cost a
// localised price, never the page render or the checkout redirect.
const POLAR_TIMEOUT_MS = 3000;

let memoryCache: { table: PriceTable | null; expires: number } | null = null;

async function fetchFromPolar(polar: Polar): Promise<PriceTable> {
	const ids = [...new Set(Object.values(PLAN_PRODUCT_IDS()).filter(Boolean))];
	const products = await Promise.all(
		ids.map((id) => polar.products.get({ id }, { timeoutMs: POLAR_TIMEOUT_MS }))
	);

	const table: PriceTable = {};
	for (const product of products) {
		const prices: ProductPrices = {};
		for (const entry of product.prices ?? []) {
			const price = entry as {
				priceCurrency?: string;
				priceAmount?: number;
				isArchived?: boolean;
			};
			// Archived prices still come back on the product; they are what
			// existing subscribers pay, not what a new buyer would be charged.
			if (price.isArchived) continue;
			if (price.priceCurrency && typeof price.priceAmount === 'number') {
				prices[price.priceCurrency.toLowerCase()] = price.priceAmount;
			}
		}
		table[product.id] = prices;
	}
	return table;
}

/**
 * Currencies and amounts for every product, straight from Polar.
 *
 * Cached in the isolate and in KV, because the two callers (the pricing page
 * and the checkout redirect) both sit on a path where a buyer is waiting.
 * Returns `null` if Polar can't be reached and nothing is cached — callers are
 * expected to fall back to USD rather than fail.
 */
export async function getPriceTable(polar: Polar, kv?: KVNamespace): Promise<PriceTable | null> {
	if (memoryCache && memoryCache.expires > Date.now()) return memoryCache.table;

	if (kv) {
		try {
			const cached = (await kv.get(KV_KEY, 'json')) as PriceTable | null;
			if (cached) {
				memoryCache = { table: cached, expires: Date.now() + MEMORY_TTL_MS };
				return cached;
			}
		} catch {
			/* ignore cache errors */
		}
	}

	let table: PriceTable;
	try {
		table = await fetchFromPolar(polar);
	} catch (err) {
		console.error('[prices] Polar price lookup failed:', err);
		memoryCache = { table: null, expires: Date.now() + FAILURE_TTL_MS };
		return null;
	}

	memoryCache = { table, expires: Date.now() + MEMORY_TTL_MS };
	if (kv) {
		await kv.put(KV_KEY, JSON.stringify(table), { expirationTtl: KV_TTL_SECONDS }).catch(() => {});
	}
	return table;
}

/**
 * Every plan's price in the visitor's own currency, or `null` to leave the
 * caller on its hardcoded USD copy.
 *
 * Two rules, both about not lying to the buyer:
 *
 * 1. Only ever show an amount Polar actually holds. No FX conversion here — a
 *    converted "approximately £19" next to a USD charge is worse than showing
 *    USD throughout.
 * 2. All or nothing. A surface mixing £6.99 against $249.99 is unreadable, so
 *    a plan missing a local price drops the whole thing back to USD.
 */
export async function localisedPlanPrices(
	polar: Polar,
	kv: KVNamespace | undefined,
	country: string | null
): Promise<{ currency: Currency; prices: Record<string, number> } | null> {
	const currency = currencyForCountry(country);
	if (currency === DEFAULT_CURRENCY) return null;

	const table = await getPriceTable(polar, kv);
	if (!table) return null;

	const prices: Record<string, number> = {};
	for (const [plan, productId] of Object.entries(PLAN_PRODUCT_IDS())) {
		// An unset product id is a plan we don't sell yet (Day Pass on a
		// deployment without it configured), not a reason to drop to USD.
		if (!productId) continue;
		const amount = table[productId]?.[currency];
		if (amount === undefined) return null;
		prices[plan] = amount;
	}

	return { currency, prices };
}

/**
 * The currency to open a checkout in for one product.
 *
 * Local currency when Polar has a catalog price in it, USD otherwise. Returns
 * `null` when we know nothing about the product's prices, which means "send no
 * currency and let Polar decide" rather than "guess".
 *
 * A USD buyer never triggers the price lookup: there is nothing to check,
 * since USD is what an unqualified checkout would use anyway.
 */
export async function currencyForCheckout(
	polar: Polar,
	kv: KVNamespace | undefined,
	productId: string,
	country: string | null
): Promise<Currency | null> {
	const candidate = currencyForCountry(country);
	if (candidate === DEFAULT_CURRENCY) return DEFAULT_CURRENCY;

	const prices = (await getPriceTable(polar, kv))?.[productId];
	if (!prices) return null;
	if (prices[candidate] !== undefined) return candidate;
	return prices[DEFAULT_CURRENCY] !== undefined ? DEFAULT_CURRENCY : null;
}
