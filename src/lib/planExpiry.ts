// ---------------------------------------------------------------------------
// Day Pass expiry
// ---------------------------------------------------------------------------
//
// A Day Pass is the only plan with an end date, and nothing ever took it away:
// `profile.plan` stayed 'day' and `ops_limit` stayed 100 indefinitely, while
// `quota_period_end` only shortened the token bucket's TTL. Once it lapsed the
// bucket reseeded at the stored 100 ops on the 30-day default, so a $2 one-time
// purchase quietly became 100 images a month in perpetuity.
//
// Enforced at read time rather than by a cron: every reader applies the same
// rule, existing rows heal without a backfill, and there is no scheduled job to
// fall behind. Mirrored in ../mochify-worker/src/index.ts, which is what
// actually gates spending — this copy is what the dashboard renders from, since
// it reads D1 directly rather than going through the worker.

const EXPIRING_PLANS = new Set(['day']);

/**
 * `quota_period_end` is epoch-ms today, but older day-pass rows hold ISO
 * strings from before that was standardised, and D1 returns whatever was
 * stored. Accept both rather than reading NaN and treating a lapsed pass as
 * live forever.
 */
export function parsePeriodEnd(value: unknown): number | null {
	if (typeof value === 'number') return Number.isFinite(value) ? value : null;
	if (typeof value === 'string' && value.trim() !== '') {
		const asNumber = Number(value);
		if (Number.isFinite(asNumber)) return asNumber;
		const asDate = Date.parse(value);
		if (Number.isFinite(asDate)) return asDate;
	}
	return null;
}

/**
 * Whether a time-limited plan's window has closed.
 *
 * An absent or unreadable end date counts as NOT expired — cutting off someone
 * who paid is worse than briefly honouring a pass we cannot date.
 */
export function planExpired(plan: string, quotaPeriodEnd: unknown, now = Date.now()): boolean {
	if (!EXPIRING_PLANS.has(plan)) return false;
	const end = parsePeriodEnd(quotaPeriodEnd);
	return end !== null && end <= now;
}
