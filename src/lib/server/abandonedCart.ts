import { cancelFollowup } from '$lib/server/emails/abandonedCart';

// Plans we are willing to send a "new customer" offer to.
//
// Day pass buyers (plan 'day') are deliberately excluded for now. They have paid
// something in the last 24 hours, and following that with a discount offer reads
// badly. They are still the warmest non-subscriber segment, so widening this to
// include 'day' is a one-word change if the volume from 'free' proves thin.
const ELIGIBLE_PLANS = new Set(['free']);

/** Don't email the same person about this more than once a month. */
const SUPPRESSION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export type Qualification = { ok: true } | { ok: false; reason: string };

/**
 * Decide whether a user counts as a new customer worth emailing.
 *
 * Polar has no new-customer rule of its own, so this is the whole of the
 * enforcement. Every caller must run it before minting.
 */
export async function qualifyForRecovery(db: D1Database, userId: string): Promise<Qualification> {
	const profile = await db
		.prepare(
			'SELECT plan, polar_subscription_id, marketing_opt_out FROM profile WHERE user_id = ? LIMIT 1'
		)
		.bind(userId)
		.first<{
			plan: string | null;
			polar_subscription_id: string | null;
			marketing_opt_out: number | null;
		}>();

	// A missing profile row means a free user who has never transacted, which is
	// exactly the target. Treating "no row" as ineligible would silence the
	// campaign for most of the people it exists to reach.
	if (profile) {
		if (profile.marketing_opt_out) return { ok: false, reason: 'opted_out' };
		if (profile.polar_subscription_id) return { ok: false, reason: 'has_subscription' };
		if (!ELIGIBLE_PLANS.has(profile.plan ?? 'free')) {
			return { ok: false, reason: `plan_${profile.plan}` };
		}
	}

	const recent = await db
		.prepare('SELECT id FROM abandoned_checkout WHERE user_id = ? AND created_at > ? LIMIT 1')
		.bind(userId, Date.now() - SUPPRESSION_WINDOW_MS)
		.first<{ id: string }>();
	if (recent) return { ok: false, reason: 'recently_emailed' };

	return { ok: true };
}

/**
 * Claim this checkout id, returning false if it was already claimed.
 *
 * This runs BEFORE minting and sending, and that ordering is the point. Polar
 * retries checkout.expired on any non-2xx, and it can redeliver even after a
 * 200. Claiming first means a redelivery loses the race and exits, instead of
 * minting a second live discount code and sending a second email.
 */
export async function claimCheckout(
	db: D1Database,
	row: {
		id: string;
		userId: string;
		email: string;
		productId: string | null;
		plan: string;
		billing: string;
	}
): Promise<boolean> {
	const res = await db
		.prepare(
			`INSERT OR IGNORE INTO abandoned_checkout
			 (id, user_id, email, product_id, plan, billing, created_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`
		)
		.bind(row.id, row.userId, row.email, row.productId, row.plan, row.billing, Date.now())
		.run();
	return (res.meta?.changes ?? 0) > 0;
}

export async function attachDiscount(
	db: D1Database,
	checkoutId: string,
	discount: { id: string; code: string },
	emails: { firstId: string | null; followupId: string | null }
): Promise<void> {
	await db
		.prepare(
			`UPDATE abandoned_checkout
			 SET discount_id = ?, discount_code = ?, first_email_id = ?, followup_email_id = ?
			 WHERE id = ?`
		)
		.bind(discount.id, discount.code, emails.firstId, emails.followupId, checkoutId)
		.run();
}

/** Look up a minted code so /api/checkout can auto-apply it from an email link. */
export async function discountIdForCode(
	db: D1Database,
	userId: string,
	code: string
): Promise<string | null> {
	const row = await db
		.prepare(
			'SELECT discount_id FROM abandoned_checkout WHERE user_id = ? AND discount_code = ? LIMIT 1'
		)
		.bind(userId, code)
		.first<{ discount_id: string | null }>();
	return row?.discount_id ?? null;
}

/**
 * Mark a recovery converted and cancel the pending follow-up.
 *
 * Called from the shared subscription.created/active/updated case rather than
 * from subscription.active alone. The cancel is a bare network call with no
 * retry behind it, and if it fails the follow-up ships to someone who has just
 * paid. Polar generally delivers more than one of those three events on an
 * upgrade, so sitting on the shared path buys two or three independent attempts
 * for free. Clearing followup_email_id on success keeps it idempotent.
 */
export async function settleConversion(
	db: D1Database,
	resendKey: string | undefined,
	userId: string,
	discountId: string | null
): Promise<void> {
	// Prefer an exact match on the discount actually redeemed. Subscription
	// carries discountId, so an attributed recovery is provable rather than
	// inferred. Fall back to the user's most recent open row for people who
	// came back and subscribed without using the code.
	const row = discountId
		? await db
				.prepare(
					'SELECT id, followup_email_id FROM abandoned_checkout WHERE discount_id = ? LIMIT 1'
				)
				.bind(discountId)
				.first<{ id: string; followup_email_id: string | null }>()
		: await db
				.prepare(
					`SELECT id, followup_email_id FROM abandoned_checkout
					 WHERE user_id = ? AND converted_at IS NULL
					 ORDER BY created_at DESC LIMIT 1`
				)
				.bind(userId)
				.first<{ id: string; followup_email_id: string | null }>();

	if (!row) return;

	if (row.followup_email_id) {
		const cancelled = await cancelFollowup(resendKey, row.followup_email_id);
		if (cancelled) {
			await db
				.prepare('UPDATE abandoned_checkout SET followup_email_id = NULL WHERE id = ?')
				.bind(row.id)
				.run();
		}
	}

	await db
		.prepare('UPDATE abandoned_checkout SET converted_at = ? WHERE id = ? AND converted_at IS NULL')
		.bind(Date.now(), row.id)
		.run();
}

/** Was this conversion attributable to a minted code? Used for the PostHog event. */
export async function recoveryForDiscount(
	db: D1Database,
	discountId: string
): Promise<{ id: string; discount_code: string | null; plan: string | null } | null> {
	return await db
		.prepare('SELECT id, discount_code, plan FROM abandoned_checkout WHERE discount_id = ? LIMIT 1')
		.bind(discountId)
		.first<{ id: string; discount_code: string | null; plan: string | null }>();
}
