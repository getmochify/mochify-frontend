import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const PLAN_CONFIG: Record<string, { ops_limit: number }> = {
	pro: { ops_limit: 1200 },
	seller: { ops_limit: 300 }
};

async function sha256Hex(input: string): Promise<string> {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

async function verifySignature(secret: string, body: string, signature: string): Promise<boolean> {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['verify']
	);
	const sigBytes = new Uint8Array(signature.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
	return crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(body));
}

async function updateUsageKv(
	kv: KVNamespace | undefined,
	userId: string,
	plan: string,
	opsLimit: number
): Promise<void> {
	if (!kv) return;
	const raw = await kv.get(userId).catch(() => null);
	const existing = raw ? (JSON.parse(raw) as { remaining?: number; quota?: number }) : null;
	const usedSoFar =
		existing?.remaining !== undefined
			? Math.max(0, existing.quota ?? opsLimit) - existing.remaining
			: 0;
	await kv
		.put(
			userId,
			JSON.stringify({
				remaining: Math.max(0, opsLimit - usedSoFar),
				quota: opsLimit,
				plan,
				updatedAt: new Date().toISOString()
			})
		)
		.catch(() => {});
}

async function reseedBucket(
	userId: string,
	plan: string,
	opsLimit: number,
	quotaPeriodEnd: number | null
): Promise<void> {
	if (!env.CF_WORKER_URL || !env.CF_WORKER_TOKEN) return;
	const identifier = await sha256Hex(userId);
	let ttl = 30 * 24 * 60 * 60;
	if (quotaPeriodEnd) {
		const now = Date.now();
		if (quotaPeriodEnd > now) ttl = Math.floor((quotaPeriodEnd - now) / 1000);
	}
	await fetch(`${env.CF_WORKER_URL}/seed/${identifier}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-Worker-Token': env.CF_WORKER_TOKEN },
		body: JSON.stringify({ remaining: opsLimit, quota: opsLimit, plan, ttl, userId })
	})
		.then(async (r) => {
			if (!r.ok)
				console.error(
					`[depay/webhook] reseedBucket failed: ${r.status} ${await r.text().catch(() => '')}`
				);
		})
		.catch((e) => console.error('[depay/webhook] reseedBucket fetch error:', e));
}

export const POST: RequestHandler = async ({ request, platform }) => {
	const body = await request.text();

	// Verify Depay signature — header is x-depay-signature, HMAC-SHA256 hex over raw body.
	// Confirm the exact header name in your Depay admin → Integration → Callback settings.
	if (env.DEPAY_WEBHOOK_SECRET) {
		const signature = request.headers.get('x-depay-signature') ?? '';
		const valid = await verifySignature(env.DEPAY_WEBHOOK_SECRET, body, signature).catch(
			() => false
		);
		if (!valid) {
			console.error('[depay/webhook] Invalid signature');
			return new Response('Invalid signature', { status: 403 });
		}
	} else {
		console.warn('[depay/webhook] DEPAY_WEBHOOK_SECRET not set — skipping signature check');
	}

	let payload: Record<string, unknown>;
	try {
		payload = JSON.parse(body);
	} catch {
		return new Response('Invalid JSON', { status: 400 });
	}

	// track is JSON-stringified on the button: { id: userId, plan: 'pro' | 'seller' }
	let track: { id?: string; plan?: string } = {};
	try {
		const raw = payload.track;
		track = typeof raw === 'string' ? JSON.parse(raw) : (raw as typeof track) ?? {};
	} catch {
		console.error('[depay/webhook] Failed to parse track:', payload.track);
	}

	const userId = track.id;
	const plan = track.plan;

	if (!userId || !plan || !PLAN_CONFIG[plan]) {
		console.error('[depay/webhook] Missing or invalid track data:', track);
		// Return 200 so Depay does not retry — this is a configuration issue, not a transient one.
		return new Response(null, { status: 200 });
	}

	const db = platform?.env?.DB;
	if (!db) return new Response('Database unavailable', { status: 503 });

	const { ops_limit } = PLAN_CONFIG[plan];
	const now = Date.now();
	// One-time crypto payment — no recurring billing, so give a long bucket TTL.
	// Use admin endpoint to manually reseed or revoke if needed.
	const periodEnd = now + 365 * 24 * 60 * 60 * 1000;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) });
	await kysely
		.insertInto('profile')
		.values({
			user_id: userId,
			plan,
			ops_limit,
			quota_period_end: periodEnd,
			updated_at: now,
			created_at: now
		})
		.onConflict((oc) =>
			oc.column('user_id').doUpdateSet({ plan, ops_limit, quota_period_end: periodEnd, updated_at: now })
		)
		.execute();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const kv = (platform?.env as any)?.USAGE_KV as KVNamespace | undefined;
	await updateUsageKv(kv, userId, plan, ops_limit);
	await reseedBucket(userId, plan, ops_limit, periodEnd);

	console.log(
		`[depay/webhook] Upgraded user=${userId} plan=${plan} tx=${payload.transaction ?? 'unknown'}`
	);

	return new Response(null, { status: 200 });
};
