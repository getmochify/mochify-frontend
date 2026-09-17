import { Resend } from 'resend';

/**
 * Onboarding sequence trigger.
 *
 * The sequence itself lives in Resend as an Automation — its steps (delay,
 * send_email, condition) and all of its copy are managed in their dashboard, not
 * here. The only thing this repo owns is the moment the sequence STARTS, which
 * Resend models as a named event: an Automation's first step is
 * `{ type: 'trigger', config: { eventName } }`, and `events.send` is what
 * satisfies it for one contact.
 *
 * So the whole integration is "tell Resend this person just signed up". Nothing
 * about timing or content is encoded here on purpose; changing the sequence
 * should never require a deploy.
 */

/**
 * MUST match the `eventName` on the Automation's trigger step in Resend. They
 * are matched by string, so a mismatch fails silently — the event is accepted
 * and simply starts nothing, with no error on either side.
 *
 * As configured: trigger `user.created` -> send "Welcome series 1 - What
 * Mochify" -> wait 2 days -> ... If the trigger is ever renamed in the Resend
 * dashboard, this constant is the only thing in the codebase that has to follow
 * it; nothing else here knows about the sequence.
 */
export const ONBOARDING_EVENT = 'user.created';

type OnboardingContext = {
	/** Used only to gate on consent; the send itself addresses the contact. */
	userId: string;
	email: string;
};

/**
 * Start the onboarding sequence for a newly verified account.
 *
 * MUST be called AFTER `syncContactFromProfile`. The event addresses the contact
 * by email, so the contact has to exist in Resend first; firing it against an
 * address Resend has never seen starts nothing and reports no error.
 *
 * Gated on `profile.marketing_opt_out` rather than on the contact's
 * `unsubscribed` flag, because D1 is what decides whether we send anything —
 * the Resend list is a mirror (see resendContacts.ts). A missing profile row
 * means a free account that has never transacted, which is the common case for
 * a brand-new signup and is eligible; that matches how qualifyForRecovery reads
 * the same column.
 */
export async function startOnboarding(
	db: D1Database,
	resendKey: string | undefined,
	{ userId, email }: OnboardingContext
): Promise<void> {
	if (!resendKey) return;

	try {
		const profile = await db
			.prepare('SELECT marketing_opt_out FROM profile WHERE user_id = ? LIMIT 1')
			.bind(userId)
			.first<{ marketing_opt_out: number | null }>();

		if (profile?.marketing_opt_out) return;

		const { error } = await new Resend(resendKey).events.send({
			event: ONBOARDING_EVENT,
			email
		});

		if (error) console.error('[onboarding] event send failed:', error);
	} catch (e) {
		// Never fail a signup or a verification over this. The cost of a dropped
		// event is one person missing the sequence, which is recoverable by hand;
		// the cost of throwing here is an account that does not get created.
		console.error('[onboarding] trigger failed:', e);
	}
}
