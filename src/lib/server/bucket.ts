// Build-time inlined: CF_WORKER_* live in the build env (like the auth handoff
// routes), NOT the Worker's runtime bindings, so they must come from static/private.
// Reading them via $env/dynamic/private would resolve to undefined at runtime and
// silently skip the token-bucket reseed on every plan change.
import { CF_WORKER_URL, CF_WORKER_TOKEN } from '$env/static/private';

export async function sha256Hex(input: string): Promise<string> {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Reset a user's token bucket on the worker to a plan's allowance. Shared by the
 * Polar webhook (plan changes) and the Day Pass grant, which also runs from the
 * signup hook when a first-time buyer activates their pass.
 */
export async function reseedBucket(
	userId: string,
	plan: string,
	opsLimit: number,
	quotaPeriodEnd: number | null
): Promise<void> {
	if (!CF_WORKER_URL || !CF_WORKER_TOKEN) return;
	const identifier = await sha256Hex(userId);
	let ttl = 30 * 24 * 60 * 60;
	if (quotaPeriodEnd) {
		const now = Date.now();
		if (quotaPeriodEnd > now) ttl = Math.floor((quotaPeriodEnd - now) / 1000);
	}
	await fetch(`${CF_WORKER_URL}/seed/${identifier}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-Worker-Token': CF_WORKER_TOKEN },
		body: JSON.stringify({
			remaining: opsLimit,
			quota: opsLimit,
			plan,
			ttl,
			userId,
			// Sent so the worker's usage mirror can tell a lapsed Day Pass
			// from a live one without going back to D1.
			periodEnd: quotaPeriodEnd
		})
	})
		.then(async (r) => {
			if (!r.ok)
				console.error(
					`[webhook] reseedBucket failed: ${r.status} ${await r.text().catch(() => '')}`
				);
		})
		.catch((e) => console.error('[webhook] reseedBucket fetch error:', e));
}
