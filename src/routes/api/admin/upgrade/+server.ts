import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const PLAN_CONFIG: Record<string, { ops_limit: number }> = {
	pro: { ops_limit: 1200 },
	seller: { ops_limit: 300 },
	free: { ops_limit: 30 }
};

async function sha256Hex(input: string): Promise<string> {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
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
				console.error(`[admin/upgrade] reseedBucket failed: ${r.status} ${await r.text().catch(() => '')}`);
		})
		.catch((e) => console.error('[admin/upgrade] reseedBucket fetch error:', e));
}

export const POST: RequestHandler = async ({ request, platform }) => {
	// Constant-time bearer token check — same pattern as CF_WORKER_TOKEN.
	const authHeader = request.headers.get('Authorization') ?? '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
	if (!env.ADMIN_SECRET || token !== env.ADMIN_SECRET) {
		return new Response('Unauthorized', { status: 401 });
	}

	const body = await request.json().catch(() => null);
	const { email, plan } = (body ?? {}) as { email?: string; plan?: string };

	if (!email || !plan || !PLAN_CONFIG[plan]) {
		return new Response(
			JSON.stringify({ error: 'Required: email (string), plan ("pro" | "seller" | "free")' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	const db = platform?.env?.DB;
	if (!db) return new Response('Database unavailable', { status: 503 });

	const userRow = await db
		.prepare('SELECT id FROM user WHERE email = ? LIMIT 1')
		.bind(email)
		.first<{ id: string }>();

	if (!userRow) {
		return new Response(JSON.stringify({ error: `No user found with email: ${email}` }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const userId = userRow.id;
	const { ops_limit } = PLAN_CONFIG[plan];
	const now = Date.now();
	const periodEnd = plan !== 'free' ? now + 30 * 24 * 60 * 60 * 1000 : null;

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

	console.log(`[admin/upgrade] ${email} (${userId}) → ${plan}`);

	return new Response(JSON.stringify({ ok: true, userId, email, plan, ops_limit }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
