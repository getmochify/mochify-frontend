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
//
// Two contact properties are mirrored alongside consent so segments can be built
// on them without exporting anything: `tier` (profile.plan) and `signup_date`
// (user.createdAt). Both are read from D1 on every sync rather than tracked
// separately, which is why a stale mirror always repairs itself on the next
// write instead of needing a reconciliation pass.

/**
 * Custom contact properties, defined in the Resend dashboard. Resend only types
 * a property as `string` or `number`, so `signup_date` is a `YYYY-MM-DD` string
 * — readable in the contact view and still ordered correctly by a segment
 * filter, which an ISO timestamp with a time component would not be.
 */
type ContactProperties = {
	/** profile.plan: free | day | seller | pro | growth. */
	tier: string;
	/** Omitted rather than guessed when user.createdAt is missing or unparseable. */
	signup_date?: string;
};

type ContactState = {
	email: string;
	unsubscribed: boolean;
	/** Only applied when the contact is created; never overwrites a curated name. */
	firstName?: string;
	properties?: ContactProperties;
};

/** The one row every sync in this file is derived from. */
type ContactRow = {
	email: string;
	name: string | null;
	created_at: number | string | null;
	email_verified: number | null;
	deleted_at: number | null;
	opt_out: number | null;
	plan: string | null;
};

const CONTACT_ROW_SQL = `
	SELECT u.email AS email,
	       u.name AS name,
	       u.createdAt AS created_at,
	       u.emailVerified AS email_verified,
	       u.deleted_at AS deleted_at,
	       p.marketing_opt_out AS opt_out,
	       p.plan AS plan
	FROM user u LEFT JOIN profile p ON p.user_id = u.id
	WHERE u.id = ? LIMIT 1
`;

function loadContactRow(db: D1Database, userId: string): Promise<ContactRow | null> {
	return db.prepare(CONTACT_ROW_SQL).bind(userId).first<ContactRow>();
}

/**
 * user.createdAt as `YYYY-MM-DD`. Better Auth declares that column INTEGER and
 * writes epoch milliseconds; the string branch is there because SQLite types are
 * per-value, not per-column, so one hand-written row is all it takes. Anything
 * that does not parse yields undefined and the property is left off entirely —
 * a wrong signup date would quietly mis-target every segment built on it, where
 * a missing one is visible.
 */
function signupDate(value: number | string | null | undefined): string | undefined {
	if (value === null || value === undefined || value === '') return undefined;
	const ms = typeof value === 'number' ? value : /^\d+$/.test(value) ? Number(value) : value;
	const date = new Date(ms);
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

/**
 * `optOut` overrides what the row says. Callers that own the D1 write pass the
 * value they just wrote, so the mirror is right even if the read raced it.
 */
function contactStateFrom(row: ContactRow, optOut?: boolean): ContactState {
	const signedUp = signupDate(row.created_at);
	return {
		email: row.email,
		unsubscribed: optOut ?? row.opt_out === 1,
		firstName: firstNameOf(row.name),
		properties: {
			// No profile row means a free account that has never had one written —
			// the same assumption the missing marketing_opt_out makes just above.
			tier: row.plan ?? 'free',
			...(signedUp ? { signup_date: signedUp } : {})
		}
	};
}

/** Resend returns properties as `{ key: { type, value } }`; we hold plain values. */
function propertiesMatch(
	existing: Record<string, { value: string | number }> | undefined,
	desired: ContactProperties | undefined
): boolean {
	if (!desired) return true;
	return Object.entries(desired).every(([key, value]) => existing?.[key]?.value === value);
}

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
			if (
				existing.data.unsubscribed === state.unsubscribed &&
				propertiesMatch(existing.data.properties, state.properties)
			) {
				return true;
			}

			const { error } = await resend.contacts.update({
				email: state.email,
				unsubscribed: state.unsubscribed,
				// Only the keys we own are sent, so anything curated in the Resend
				// dashboard under another key survives the write.
				...(state.properties ? { properties: state.properties } : {})
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
			...(state.firstName ? { firstName: state.firstName } : {}),
			...(state.properties ? { properties: state.properties } : {})
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
		const row = await loadContactRow(db, userId);
		if (!row?.email) return;
		await syncContact(resendKey, contactStateFrom(row));
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
		const row = await loadContactRow(db, userId);
		if (!row?.email) return;
		await syncContact(resendKey, contactStateFrom(row, optOut));
	} catch (e) {
		console.error('[contacts] consent mirror failed:', e);
	}
}

/**
 * Push a plan change out to the `tier` property, for the Polar webhook and the
 * admin upgrade route. Without this the property is only ever as fresh as the
 * last consent change, so anyone who upgrades tomorrow would sit in Resend as
 * `free` indefinitely — which is exactly the segment they should have left.
 *
 * Unlike the consent mirror, this refuses to CREATE a contact for an unproven or
 * deleted address: a plan change must not be the thing that puts someone on the
 * marketing list. Verified users are picked up here; the rest are picked up by
 * afterEmailVerification, which is the moment the list is allowed to grow.
 */
export async function mirrorPlan(
	db: D1Database,
	resendKey: string | undefined,
	userId: string
): Promise<void> {
	if (!resendKey) return;
	try {
		const row = await loadContactRow(db, userId);
		if (!row?.email) return;
		if (row.email_verified !== 1 || row.deleted_at !== null) return;
		await syncContact(resendKey, contactStateFrom(row));
	} catch (e) {
		console.error('[contacts] plan mirror failed:', e);
	}
}

/** Resend stores first/last separately; Better Auth stores one display name. */
export function firstNameOf(name: string | null | undefined): string | undefined {
	const first = name?.trim().split(/\s+/)[0];
	return first || undefined;
}
