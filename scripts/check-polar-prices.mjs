// Prints what each country's buyer will actually see and be charged.
//
//   POLAR_ACCESS_TOKEN=polar_... POLAR_PRODUCT_ID_PRO_MONTHLY=... node scripts/check-polar-prices.mjs
//
// Reads the same env vars the app does, falling back to .env, then asks Polar
// for every product's catalog prices. Use it after changing prices in Polar to
// confirm the app will pick them up: the site only ever shows a currency the
// product genuinely holds (see src/lib/server/prices.ts), so a currency missing
// from one product silently drops that whole page back to USD.

import { readFileSync } from 'node:fs';

// Must stay in step with PLAN_PRODUCT_IDS() in src/lib/server/prices.ts: a plan
// this list forgets is a plan whose missing currency the check reports as fine
// while the live site drops that country to USD over it. Growth was exactly that
// for a while, because it arrived after this script did.
const PLANS = {
	sellerMonthly: 'POLAR_PRODUCT_ID_SELLER_MONTHLY',
	sellerYearly: 'POLAR_PRODUCT_ID_SELLER_YEARLY',
	proMonthly: 'POLAR_PRODUCT_ID_PRO_MONTHLY',
	proYearly: 'POLAR_PRODUCT_ID_PRO_YEARLY',
	growthMonthly: 'POLAR_PRODUCT_ID_GROWTH_MONTHLY',
	growthYearly: 'POLAR_PRODUCT_ID_GROWTH_YEARLY',
	dayPass: 'POLAR_PRODUCT_ID_DAY_PASS'
};

// Currencies Stripe and Polar quote in whole units, so an amount of 1000 is
// 1,000 yen and not 10.00. Same list as src/lib/currency.ts; without it this
// script prints a yen price 100x too small, in the one output you would use to
// check a newly added yen price.
const ZERO_DECIMAL = new Set([
	'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga',
	'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'
]);
const major = (amount, currency) =>
	ZERO_DECIMAL.has(currency.toLowerCase()) ? String(amount) : (amount / 100).toFixed(2);

// A sample of the countries the country map routes somewhere interesting.
const SAMPLE_COUNTRIES = { US: 'usd', GB: 'gbp', IN: 'inr', DE: 'eur', CA: 'cad', JP: 'jpy' };

// Growth's product ids live in wrangler.jsonc rather than .env, so without this
// fallback the two plans most recently added are the two silently skipped.
const env = { ...readWranglerVars(), ...readDotEnv(), ...process.env };
const token = env.POLAR_ACCESS_TOKEN;
if (!token || token.startsWith('your-')) {
	console.error('No POLAR_ACCESS_TOKEN. Pass it in the environment or put it in .env.');
	process.exit(1);
}
const api = env.POLAR_SANDBOX === 'true' ? 'https://sandbox-api.polar.sh' : 'https://api.polar.sh';

const table = {};
for (const [plan, varName] of Object.entries(PLANS)) {
	const id = env[varName];
	if (!id || id.startsWith('your-')) {
		console.log(`${plan.padEnd(14)} ${varName} not set, skipping`);
		continue;
	}
	const res = await fetch(`${api}/v1/products/${id}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	if (!res.ok) {
		console.log(`${plan.padEnd(14)} HTTP ${res.status} ${await res.text()}`);
		continue;
	}
	const product = await res.json();
	const prices = {};
	for (const price of product.prices ?? []) {
		if (price.is_archived) continue;
		prices[price.price_currency] = price.price_amount;
	}
	table[plan] = prices;
	const shown = Object.entries(prices)
		.map(([c, a]) => `${c} ${major(a, c)}`)
		.join('  ');
	console.log(`${plan.padEnd(14)} ${product.name.padEnd(24)} ${shown}`);
}

console.log('\nWhat each visitor gets (page currency, and why):');
for (const [country, candidate] of Object.entries(SAMPLE_COUNTRIES)) {
	const missing = Object.entries(table)
		.filter(([, prices]) => prices[candidate] === undefined)
		.map(([plan]) => plan);
	const verdict = missing.length
		? `usd  (no ${candidate} price on: ${missing.join(', ')})`
		: `${candidate}`;
	console.log(`  ${country} -> ${verdict}`);
}

function readWranglerVars() {
	try {
		const raw = readFileSync('wrangler.jsonc', 'utf8').replace(/^\s*\/\/.*$/gm, '');
		return JSON.parse(raw).vars ?? {};
	} catch {
		return {};
	}
}

function readDotEnv() {
	try {
		return Object.fromEntries(
			readFileSync('.env', 'utf8')
				.split('\n')
				.map((line) => line.trim())
				.filter((line) => line && !line.startsWith('#') && line.includes('='))
				.map((line) => {
					const [key, ...rest] = line.split('=');
					return [key, rest.join('=').replace(/^["']|["']$/g, '')];
				})
		);
	} catch {
		return {};
	}
}
