import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';

// Storage destinations (bring your own bucket, save to Google Drive) are a
// *subscription* feature, which is narrower than "paid": a Day Pass is a
// 24-hour unlock, and a connection that outlives the pass by months is not what
// someone bought for $2. Deliberately not named PAID_PLANS — `day` is a paid
// plan, it just is not entitled to this.
//
// A lapsed Day Pass needs no special handling here because `day` is absent in
// either state. See $lib/planExpiry for the plans that do expire.
//
// Keep in step with BUCKET_PLANS in ../mochify-worker/src/index.ts, which is
// the gate that actually stops writes after a downgrade — this one stops a
// connection being created in the first place.
export const STORAGE_PLANS = new Set(['seller', 'pro', 'growth']);

/**
 * Whether this user may create or modify a storage connection.
 *
 * The dashboard hides the cards for everyone else, but that is cosmetic: every
 * mutating action re-checks here, because a form POST does not care what the
 * client rendered. Disconnecting is deliberately NOT gated on this — someone
 * who downgrades must always be able to remove their own credentials.
 */
export async function assertStoragePlan(
	platform: App.Platform | undefined,
	userId: string
): Promise<boolean> {
	const db = platform?.env?.DB;
	if (!db) return false;
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) });
		const row = await kysely
			.selectFrom('profile')
			.select(['plan'])
			.where('user_id', '=', userId)
			.executeTakeFirst();
		return STORAGE_PLANS.has(row?.plan ?? 'free');
	} catch (e) {
		console.error('[storagePlan] plan check failed:', e);
		return false;
	}
}
