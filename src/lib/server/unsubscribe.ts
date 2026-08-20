import { BETTER_AUTH_SECRET } from '$env/static/private';
import { mirrorMarketingConsent } from './resendContacts';

// One-click unsubscribe for marketing email. The token is self-contained and
// HMAC-signed so the link works with no session: requiring a login to opt out is
// the classic dark pattern, and CAN-SPAM/PECR both expect the link to just work.
//
// Signed with BETTER_AUTH_SECRET rather than a new secret so there is one fewer
// value to rotate. The `unsubscribe:` prefix domain-separates these signatures
// from anything else that secret ever signs.

const enc = new TextEncoder();

function base64urlEncode(bytes: ArrayBuffer | Uint8Array): string {
	const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
	let binary = '';
	for (const b of view) binary += String.fromCharCode(b);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(input: string): string {
	const padded = input.replace(/-/g, '+').replace(/_/g, '/');
	return atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
}

async function sign(userId: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		enc.encode(BETTER_AUTH_SECRET),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`unsubscribe:${userId}`));
	return base64urlEncode(sig);
}

export async function signUnsubscribeToken(userId: string): Promise<string> {
	return `${base64urlEncode(enc.encode(userId))}.${await sign(userId)}`;
}

/** Returns the user id the token was minted for, or null if it does not verify. */
export async function verifyUnsubscribeToken(token: string): Promise<string | null> {
	const [encodedId, providedSig] = token.split('.');
	if (!encodedId || !providedSig) return null;

	let userId: string;
	try {
		userId = base64urlDecode(encodedId);
	} catch {
		return null;
	}
	if (!userId) return null;

	const expectedSig = await sign(userId);
	// Length check first, then a constant-time compare. Comparing with === would
	// leak the signature a byte at a time to anyone willing to time the endpoint.
	if (expectedSig.length !== providedSig.length) return null;
	let diff = 0;
	for (let i = 0; i < expectedSig.length; i++) {
		diff |= expectedSig.charCodeAt(i) ^ providedSig.charCodeAt(i);
	}
	return diff === 0 ? userId : null;
}

export function unsubscribeUrl(appUrl: string, token: string): string {
	return `${appUrl}/unsubscribe?token=${encodeURIComponent(token)}`;
}

/**
 * Record the opt-out. Upserts because free users may not have a profile row yet
 * (the same reason /dashboard upserts) — a bare UPDATE would silently affect
 * zero rows and we would keep emailing someone who asked us not to.
 *
 * Pass `resendKey` to mirror the change onto the Resend contact. The D1 write
 * happens first and is what gates sending, so a Resend failure downgrades to a
 * stale mirror rather than a lost opt-out.
 */
export async function setMarketingOptOut(
	db: D1Database,
	userId: string,
	resendKey?: string
): Promise<void> {
	await setMarketingPreference(db, userId, true);
	if (resendKey) await mirrorMarketingConsent(db, resendKey, userId, true);
}

/**
 * The D1 half on its own, in both directions. Separate from the above because
 * the Resend webhook needs to write consent back *without* mirroring it out
 * again — the change already came from Resend, and echoing it would have the two
 * systems talking past each other over an unsubscribe neither of them owns.
 */
export async function setMarketingPreference(
	db: D1Database,
	userId: string,
	optOut: boolean
): Promise<void> {
	const now = Date.now();
	const flag = optOut ? 1 : 0;
	// ops_limit 25 matches the free tier on /pricing and the seed the dashboard's
	// own upserts use. The Polar webhook seeds 30 on downgrade, a pre-existing
	// inconsistency; copying 30 here would quietly hand a free user 5 extra ops
	// for the sin of unsubscribing.
	await db
		.prepare(
			`INSERT INTO profile (user_id, plan, ops_limit, marketing_opt_out, created_at, updated_at)
			 VALUES (?, 'free', 25, ?, ?, ?)
			 ON CONFLICT(user_id) DO UPDATE SET marketing_opt_out = ?, updated_at = ?`
		)
		.bind(userId, flag, now, now, flag, now)
		.run();
}
