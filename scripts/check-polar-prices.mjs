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

const PLANS = {
	sellerMonthly: 'POLAR_PRODUCT_ID_SELLER_MONTHLY',
	sellerYearly: 'POLAR_PRODUCT_ID_SELLER_YEARLY',
	proMonthly: 'POLAR_PRODUCT_ID_PRO_MONTHLY',
	proYearly: 'POLAR_PRODUCT_ID_PRO_YEARLY',
	dayPass: 'POLAR_PRODUCT_ID_DAY_PASS'
};

// A sample of the countries the country map routes somewhere interesting.
const SAMPLE_COUNTRIES = { US: 'usd', GB: 'gbp', IN: 'inr', DE: 'eur', CA: 'cad', JP: 'jpy' };

const env = { ...readDotEnv(), ...process.env };
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
		.map(([c, a]) => `${c} ${(a / 100).toFixed(2)}`)
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
