import type { CheckoutCreate } from '@polar-sh/sdk/models/components/checkoutcreate.js';

/** The currencies Polar will accept as a checkout presentment currency. */
export type Currency = NonNullable<CheckoutCreate['currency']>;

/**
 * Country (ISO 3166-1 alpha-2) to currency (ISO 4217, lowercased for Polar).
 *
 * This is the *candidate* currency only. Nothing here is charged unless the
 * Polar product actually carries a price in that currency — see
 * `resolveCheckoutCurrency`.
 */
const COUNTRY_CURRENCY: Record<string, Currency> = {
	// Eurozone (plus the microstates and unilateral users of the euro)
	AD: 'eur',
	AT: 'eur',
	BE: 'eur',
	BG: 'eur', // adopted the euro in January 2026
	CY: 'eur',
	DE: 'eur',
	EE: 'eur',
	ES: 'eur',
	FI: 'eur',
	FR: 'eur',
	GR: 'eur',
	HR: 'eur',
	IE: 'eur',
	IT: 'eur',
	LT: 'eur',
	LU: 'eur',
	LV: 'eur',
	MC: 'eur',
	ME: 'eur',
	MT: 'eur',
	NL: 'eur',
	PT: 'eur',
	SI: 'eur',
	SK: 'eur',
	SM: 'eur',
	VA: 'eur',
	XK: 'eur',

	// Sterling zone
	GB: 'gbp',
	GG: 'gbp',
	IM: 'gbp',
	JE: 'gbp',

	// Everywhere else we might plausibly price in
	AE: 'aed',
	AR: 'ars',
	AU: 'aud',
	BR: 'brl',
	CA: 'cad',
	CH: 'chf',
	CL: 'clp',
	CN: 'cny',
	CO: 'cop',
	CZ: 'czk',
	DK: 'dkk',
	HK: 'hkd',
	HU: 'huf',
	ID: 'idr',
	IL: 'ils',
	IN: 'inr',
	IS: 'isk',
	JP: 'jpy',
	KE: 'kes',
	KR: 'krw',
	LI: 'chf',
	MX: 'mxn',
	MY: 'myr',
	NG: 'ngn',
	NO: 'nok',
	NZ: 'nzd',
	PE: 'pen',
	PH: 'php',
	PK: 'pkr',
	PL: 'pln',
	RO: 'ron',
	SA: 'sar',
	SE: 'sek',
	SG: 'sgd',
	TH: 'thb',
	TR: 'try',
	TW: 'twd',
	UA: 'uah',
	VN: 'vnd',
	ZA: 'zar'
};

/** What we fall back to when we can't geolocate, or can't price locally. */
export const DEFAULT_CURRENCY: Currency = 'usd';

/**
 * Cloudflare gives us the visitor's country on every request. `platform.cf`
 * is the richer source but is absent under `vite dev`, so fall back to the
 * header (also absent locally, in which case we default to USD).
 */
export function countryFromRequest(
	request: Request,
	platform: App.Platform | undefined
): string | null {
	return platform?.cf?.country ?? request.headers.get('cf-ipcountry') ?? null;
}

export function currencyForCountry(country: string | null): Currency {
	if (!country) return DEFAULT_CURRENCY;
	// Cloudflare sends T1 for Tor exits and XX when it can't place the IP.
	return COUNTRY_CURRENCY[country.toUpperCase()] ?? DEFAULT_CURRENCY;
}
