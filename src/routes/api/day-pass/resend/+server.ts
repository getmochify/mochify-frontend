import { Polar } from '@polar-sh/sdk';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendDayPassLink } from '$lib/server/dayPassLink';

const MAX_SENDS = 3;
const MIN_GAP_MS = 60_000;

/**
 * Resend the Day Pass activation link for a checkout this browser paid for.
 *
 * The buyer is identified by the checkout's client secret (the last segment of
 * the URL the overlay opened), which only the browser that started the
 * checkout has. The email comes from Polar, never from the request, so this
 * can only ever mail the address the pass was bought with, and only for a
 * paid Day Pass checkout. A few sends per checkout, a minute apart, is plenty
 * for "it went to spam" and caps what a leaked URL could do.
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	const body = (await request.json().catch(() => null)) as { checkoutUrl?: unknown } | null;
	const raw = typeof body?.checkoutUrl === 'string' ? body.checkoutUrl : '';
	const secret = /^https:\/\/(?:sandbox\.)?polar\.sh\/checkout\/(polar_c_[A-Za-z0-9]+)/.exec(
		raw
	)?.[1];
	if (!secret) return json({ error: 'invalid_checkout' }, { status: 400 });

	const db = platform?.env?.DB;
	if (!db) return json({ error: 'unavailable' }, { status: 503 });

	const polar = new Polar({
		accessToken: env.POLAR_ACCESS_TOKEN,
		...(env.POLAR_SANDBOX === 'true' ? { server: 'sandbox' } : {})
	});

	let checkout;
	try {
		const pub = await polar.checkouts.clientGet({ clientSecret: secret });
		checkout = await polar.checkouts.get({ id: pub.id });
	} catch (err) {
		console.error('[daypass-resend] checkout lookup failed:', err);
		return json({ error: 'not_found' }, { status: 404 });
	}

	if (
		checkout.status !== 'succeeded' ||
		checkout.productId !== env.POLAR_PRODUCT_ID_DAY_PASS ||
		!checkout.customerEmail
	) {
		return json({ error: 'not_paid' }, { status: 409 });
	}

	const kv = platform?.env?.USAGE_KV;
	const key = `daypass-resend:${checkout.id}`;
	const now = Date.now();
	const sent = kv
		? ((await kv.get<{ n: number; at: number }>(key, 'json')) ?? { n: 0, at: 0 })
		: null;
	if (sent && (sent.n >= MAX_SENDS || now - sent.at < MIN_GAP_MS)) {
		return json({ error: 'rate_limited' }, { status: 429 });
	}

	try {
		await sendDayPassLink(
			db,
			platform?.env?.RESEND_API_KEY,
			checkout.customerEmail,
			checkout.metadata?.return_path
		);
	} catch (err) {
		console.error('[daypass-resend] send failed:', err);
		return json({ error: 'send_failed' }, { status: 502 });
	}

	if (kv && sent) {
		await kv.put(key, JSON.stringify({ n: sent.n + 1, at: now }), { expirationTtl: 2 * 86400 });
	}
	return json({ ok: true });
};
