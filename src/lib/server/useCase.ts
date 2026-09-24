import { isUseCase } from '$lib/useCases';

/**
 * Record what the account is for, from the register form's optional select.
 *
 * Upserts, because a free signup has no `profile` row yet and the rest of the
 * code treats a missing row as an ordinary free user on purpose. The seed values
 * match setMarketingPreference's: plan `free` and ops_limit 25, which is the free
 * tier on /pricing. The Polar webhook seeds 30 on downgrade, a pre-existing
 * inconsistency not worth copying here.
 *
 * Returns false for anything that is not a known slug, so a hand-crafted request
 * body cannot write junk into the column the migration left unconstrained.
 */
export async function setUseCase(
	db: D1Database,
	userId: string,
	value: unknown
): Promise<boolean> {
	if (!isUseCase(value)) return false;
	const now = Date.now();
	await db
		.prepare(
			`INSERT INTO profile (user_id, plan, ops_limit, use_case, created_at, updated_at)
			 VALUES (?, 'free', 25, ?, ?, ?)
			 ON CONFLICT(user_id) DO UPDATE SET use_case = ?, updated_at = ?`
		)
		.bind(userId, value, now, now, value, now)
		.run();
	return true;
}
