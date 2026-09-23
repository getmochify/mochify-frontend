// Shared by the server (price lookup) and the pricing page (display). Keep it
// free of server-only imports.

// Currencies Stripe (and therefore Polar) quotes in whole units, so an amount
// of 1000 is ¥1,000 and not ¥10.00.
const ZERO_DECIMAL = new Set([
	'bif',
	'clp',
	'djf',
	'gnf',
	'jpy',
	'kmf',
	'krw',
	'mga',
	'pyg',
	'rwf',
	'ugx',
	'vnd',
	'vuv',
	'xaf',
	'xof',
	'xpf'
]);

// Number *grouping* is a property of the currency's home market, not of the
// page language: an Indian buyer expects lakh grouping (1,99,999), not
// 199,999. Everything else reads fine with English grouping, and the page copy
// around the price is English regardless.
// Per-currency grouping overrides, used when the caller does not name a locale.
// A page that knows its own locale passes it instead: EUR formatted as `en` is
// "€7.99", and a French visitor should be reading "7,99 €". The currency alone
// cannot decide that, because the euro is spelled differently in every euro
// market, which is why this stays a fallback rather than gaining a `eur` row.
const GROUPING_LOCALE: Record<string, string> = {
	inr: 'en-IN'
};

/**
 * What every visitor sees unless Polar holds a price in their own currency.
 * Amounts are minor units, matching Polar. Shared by every surface that quotes
 * a plan price so a repricing can't leave one of them stale, and the last line
 * of defence when Polar is unreachable: render real prices, never blanks.
 */
export const USD_PRICES: Record<string, number> = {
	sellerMonthly: 799,
	sellerYearly: 7999,
	proMonthly: 2499,
	proYearly: 24999,
	// Growth sits on the same curve the other steps do: Seller -> Pro is 4x the
	// volume for ~3.1x the price, and Pro -> Growth (1,200 -> 5,000 ops) applies
	// the same multiplier. 1.60c/op, ~23% under Pro's 2.08c, so "4x the images
	// for ~3x the price" stays true at every rung rather than only Pro's.
	growthMonthly: 7999,
	growthYearly: 79999,
	dayPass: 200
};

/** Minor units (or whole units for zero-decimal currencies) to a real number. */
export function toMajorUnits(amount: number, currency: string): number {
	return ZERO_DECIMAL.has(currency.toLowerCase()) ? amount : amount / 100;
}

/**
 * "$7.99", "£6.99", "₹1,499", "¥1,000".
 *
 * Round amounts lose their decimals, so the Day Pass reads "$2" the way it
 * always has rather than "$2.00". Falls back to a plain code-prefixed number
 * if the runtime can't format the currency.
 */
export function formatPrice(amount: number, currency: string, locale?: string): string {
	const value = toMajorUnits(amount, currency);
	const fractionDigits = Number.isInteger(value) ? 0 : 2;
	try {
		return new Intl.NumberFormat(locale ?? GROUPING_LOCALE[currency.toLowerCase()] ?? 'en', {
			style: 'currency',
			currency: currency.toUpperCase(),
			currencyDisplay: 'narrowSymbol',
			minimumFractionDigits: fractionDigits,
			maximumFractionDigits: fractionDigits
		}).format(value);
	} catch {
		return `${currency.toUpperCase()} ${value.toFixed(fractionDigits)}`;
	}
}

/** The "$6.67 / mo, billed annually" line under an annual plan. */
export function formatMonthlyEquivalent(
	yearlyAmount: number,
	currency: string,
	locale?: string
): string {
	return formatPrice(Math.round(yearlyAmount / 12), currency, locale);
}

/** "Save 17%" — derived so a repriced plan can't leave a stale claim on the page. */
export function savingsPercent(monthlyAmount: number, yearlyAmount: number): number {
	const fullYear = monthlyAmount * 12;
	if (fullYear <= 0) return 0;
	return Math.round(((fullYear - yearlyAmount) / fullYear) * 100);
}
