import { Resend } from 'resend';

// The Resend contact list is a MIRROR of profile.marketing_opt_out, never a
// second source of truth. D1 is what gates every send (see abandonedCart.ts), so
// anything that flips consent in Resend has to flip it here too: the webhook at
// /api/webhooks/resend closes that loop for unsubscribes that happen inside a
// broadcast, where the unsubscribe link is Resend's own and never reaches us.
//
// Every function here swallows its own errors. A Resend outage must not fail a
// signup, an unsubscribe or an account deletion, and the failure mode is mild:
// the contact drifts until the next consent change, while D1 — the side that
// actually decides whether we send — stays correct throughout.
//
// No audience id. Resend deprecated audiences in favour of one contact list plus
// segments, and segment membership is managed in their dashboard, so a contact
// only needs to exist and carry the right `unsubscribed` flag.

type ContactState = {
	email: string;
	unsubscribed: boolean;
	/** Only applied when the contact is created; never overwrites a curated name. */
	firstName?: string;
};

/**
 * Create the contact, or bring an existing one into line.
 *
 * Reads first because `contacts.create` against an address already on the list
 * does not reliably overwrite `unsubscribed` — it can succeed while changing
 * nothing, which would report a resubscribe we never actually made. Two calls,
 * both cheap, and the read also absorbs the emails already bulk-imported.
 */
export async function syncContact(
	resendKey: string | undefined,
	state: ContactState
): Promise<boolean> {
	if (!resendKey) {
		console.warn('[contacts] RESEND_API_KEY is not set — skipping contact sync');
		return false;
	}

	const resend = new Resend(resendKey);

	try {
		const existing = await resend.contacts.get({ email: state.email });

		if (existing.data) {
			// Already in the desired state. Skipping the write also stops us
			// bouncing a contact.updated webhook back at ourselves for nothing.
			if (existing.data.unsubscribed === state.unsubscribed) return true;

			const { error } = await resend.contacts.update({
				email: state.email,
				unsubscribed: state.unsubscribed
			});
			if (error) {
				console.error('[contacts] update failed:', error);
				return false;
			}
			return true;
		}

		const { error } = await resend.contacts.create({
			email: state.email,
			unsubscribed: state.unsubscribed,
			...(state.firstName ? { firstName: state.firstName } : {})
		});
		if (error) {
			console.error('[contacts] create failed:', error);
			return false;
		}
		return true;
	} catch (e) {
		console.error('[contacts] sync threw:', e);
		return false;
	}
}

/**
 * Drop the contact entirely. Used on account deletion: the account is only soft
 * deleted here (14-day grace), but leaving the address sitting in a third party's
 * marketing list after someone has asked us to delete them is not the promise
 * /privacy makes. Signing back in during the grace window re-adds it.
 */
export async function removeContact(
	resendKey: string | undefined,
	email: string
): Promise<boolean> {
	if (!resendKey) return false;
	try {
		const { error } = await new Resend(resendKey).contacts.remove({ email });
		// A contact that was never there is the outcome we wanted anyway.
		if (error && error.name !== 'not_found') {
			console.error('[contacts] remove failed:', error);
			return false;
		}
		return true;
	} catch (e) {
		console.error('[contacts] remove threw:', e);
		return false;
	}
}

/**
 * Sync from whatever D1 currently says, for callers that hold a user id but no
 * consent value — signup, email verification, account reactivation. It reads the
 * profile row instead of assuming subscribed: someone who unsubscribed, deleted
 * their account and later signed back in must not be resubscribed by the act of
 * returning. A missing profile row (every brand new free account) means consent
 * is the column default, which is the PECR soft opt-in: subscribed.
 */
export async function syncContactFromProfile(
	db: D1Database,
	resendKey: string | undefined,
	userId: string
): Promise<void> {
	if (!resendKey) return;
	try {
		const row = await db
			.prepare(
				`SELECT u.email AS email, u.name AS name, p.marketing_opt_out AS opt_out
				 FROM user u LEFT JOIN profile p ON p.user_id = u.id
				 WHERE u.id = ? LIMIT 1`
			)
			.bind(userId)
			.first<{ email: string; name: string | null; opt_out: number | null }>();
		if (!row?.email) return;
		await syncContact(resendKey, {
			email: row.email,
			unsubscribed: row.opt_out === 1,
			firstName: firstNameOf(row.name)
		});
	} catch (e) {
		console.error('[contacts] profile sync failed:', e);
	}
}

/**
 * Push a consent change out to Resend, given only the user id the D1 write used.
 * Callers own the D1 write and call this straight after it, so a Resend failure
 * can never leave us with consent recorded in the mirror but not in the truth.
 */
export async function mirrorMarketingConsent(
	db: D1Database,
	resendKey: string | undefined,
	userId: string,
	optOut: boolean
): Promise<void> {
	if (!resendKey) return;
	try {
		const user = await db
			.prepare('SELECT email, name FROM user WHERE id = ? LIMIT 1')
			.bind(userId)
			.first<{ email: string; name: string | null }>();
		if (!user?.email) return;
		await syncContact(resendKey, {
			email: user.email,
			unsubscribed: optOut,
			firstName: firstNameOf(user.name)
		});
	} catch (e) {
		console.error('[contacts] consent mirror failed:', e);
	}
}

/** Resend stores first/last separately; Better Auth stores one display name. */
export function firstNameOf(name: string | null | undefined): string | undefined {
	const first = name?.trim().split(/\s+/)[0];
	return first || undefined;
}
