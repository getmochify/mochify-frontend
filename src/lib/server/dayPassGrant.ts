import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { Resend } from 'resend';
import { getPostHogClient } from '$lib/server/posthog';
import { mirrorPlan } from '$lib/server/resendContacts';
import { reseedBucket } from '$lib/server/bucket';

const DAY_PASS_OPS = 100;
const DAY_PASS_MS = 24 * 60 * 60 * 1000;

/**
 * Starts the Resend Automation that follows a Day Pass (the "keep going with
 * Seller" email before it runs out). Like ONBOARDING_EVENT, it MUST match the
 * trigger's `eventName` in the Resend dashboard, where the steps and copy live.
 */
export const DAY_PASS_EVENT = 'day_pass.activated';

/**
 * Put a user on a 24-hour Day Pass, starting now. Used by order.created for a
 * buyer who already has an account, and by the user-create hook for one whose
 * account was only just created by the activation link (`claimPendingDayPass`).
 */
export async function grantDayPass(
	db: D1Database,
	resendKey: string | undefined,
	user: { id: string; email: string },
	orderId: string
): Promise<void> {
	const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) }); // eslint-disable-line @typescript-eslint/no-explicit-any
	// Epoch-ms numbers, matching every other profile writer (subscription cases,
	// admin upgrade).
	const now = Date.now();
	const quotaPeriodEnd = now + DAY_PASS_MS;

	await kysely
		.insertInto('profile')
		.values({
			user_id: user.id,
			plan: 'day',
			ops_limit: DAY_PASS_OPS,
			quota_period_end: quotaPeriodEnd,
			created_at: now,
			updated_at: now
		})
		.onConflict((oc) =>
			oc.column('user_id').doUpdateSet({
				plan: 'day',
				ops_limit: DAY_PASS_OPS,
				quota_period_end: quotaPeriodEnd,
				updated_at: now
			})
		)
		.execute();

	await reseedBucket(user.id, 'day', DAY_PASS_OPS, quotaPeriodEnd);
	// Declines for an unverified address; the user-create hook syncs the contact
	// for a magic-link signup before calling here, so the event below finds it.
	await mirrorPlan(db, resendKey, user.id);
	await startDayPassFollowUp(db, resendKey, user);

	const posthog = getPostHogClient();
	posthog.capture({
		distinctId: user.id,
		event: 'day_pass_activated',
		properties: { polar_order_id: orderId }
	});
	await posthog.flush();
}

/**
 * Fire DAY_PASS_EVENT for the follow-up sequence. Gated on marketing consent the
 * same way startOnboarding is; an address Resend has no contact for (an
 * unverified one) silently starts nothing, which is the right outcome.
 */
async function startDayPassFollowUp(
	db: D1Database,
	resendKey: string | undefined,
	user: { id: string; email: string }
): Promise<void> {
	if (!resendKey) return;
	try {
		const profile = await db
			.prepare('SELECT marketing_opt_out FROM profile WHERE user_id = ? LIMIT 1')
			.bind(user.id)
			.first<{ marketing_opt_out: number | null }>();
		if (profile?.marketing_opt_out) return;
		const { error } = await new Resend(resendKey).events.send({
			event: DAY_PASS_EVENT,
			email: user.email
		});
		if (error) console.error('[daypass] follow-up event failed:', error);
	} catch (e) {
		// Never fail an activation over a marketing email.
		console.error('[daypass] follow-up trigger failed:', e);
	}
}

/** Hold a paid pass for an email with no account yet (see migration 0005). */
export async function parkDayPass(db: D1Database, email: string, orderId: string): Promise<void> {
	await db
		.prepare(
			'INSERT INTO pending_day_pass (email, order_id, created_at) VALUES (?, ?, ?) ' +
				'ON CONFLICT(email) DO UPDATE SET order_id = excluded.order_id, created_at = excluded.created_at'
		)
		.bind(email.toLowerCase(), orderId, Date.now())
		.run();
}

/**
 * Grant a parked pass to a newly created account, if its email has one. The row
 * is removed only after the grant succeeds, so a failure leaves it for a retry
 * by hand rather than losing a paid pass. Errors are logged, never thrown: this
 * runs inside account creation.
 */
export async function claimPendingDayPass(
	db: D1Database,
	resendKey: string | undefined,
	user: { id: string; email: string }
): Promise<void> {
	try {
		const email = user.email.toLowerCase();
		const row = await db
			.prepare('SELECT order_id FROM pending_day_pass WHERE email = ?')
			.bind(email)
			.first<{ order_id: string }>();
		if (!row) return;
		await grantDayPass(db, resendKey, user, row.order_id);
		await db.prepare('DELETE FROM pending_day_pass WHERE email = ?').bind(email).run();
	} catch (e) {
		console.error('[daypass] pending grant failed:', e);
	}
}
