// The `state` parameter for the Google Drive OAuth hop.
//
// State is the only thing tying the request that left for Google to the
// callback that comes back, and it crosses a boundary we do not control. Two
// jobs, and the second is the one worth stating plainly:
//
//   1. CSRF. A callback whose state we did not mint is not our flow.
//   2. Account binding. The state names the user it was issued to, and the
//      callback checks that against the live session. Without that check, an
//      attacker who completes a Drive consent on their own Google account can
//      hand the resulting callback URL to a signed-in victim and have *their*
//      account connected to the attacker's Drive — every image the victim
//      processes then lands in storage the attacker controls.
//
// Signed rather than stored: an HMAC over a payload needs no KV round trip on
// either leg, and there is nothing here worth the durability of a stored nonce.

const encoder = new TextEncoder();

// Long enough for a real person to read a Google consent screen and decide,
// short enough that a leaked callback URL is not useful later.
const TTL_MS = 10 * 60 * 1000;

function b64url(bytes: Uint8Array): string {
	let s = '';
	for (const b of bytes) s += String.fromCharCode(b);
	return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function unb64url(value: string): Uint8Array {
	const padded = value.replace(/-/g, '+').replace(/_/g, '/');
	const bin = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}

function importKey(secret: string): Promise<CryptoKey> {
	return crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify']
	);
}

/** `<base64url payload>.<base64url hmac>` — opaque to Google, meaningful to us. */
export async function signState(secret: string, userId: string): Promise<string> {
	const payload = b64url(
		encoder.encode(
			JSON.stringify({
				uid: userId,
				exp: Date.now() + TTL_MS,
				// Makes two states issued in the same millisecond differ, so a
				// state is never a stable identifier for a user.
				n: crypto.randomUUID()
			})
		)
	);
	const key = await importKey(secret);
	const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
	return `${payload}.${b64url(new Uint8Array(sig))}`;
}

/**
 * The user id a state was issued to, or null if it is not ours, is expired, or
 * has been tampered with.
 *
 * Uses crypto.subtle.verify rather than comparing strings, so the comparison is
 * not a byte-at-a-time early exit.
 */
export async function verifyState(secret: string, state: string): Promise<string | null> {
	try {
		const [payload, sig] = state.split('.');
		if (!payload || !sig) return null;

		const key = await importKey(secret);
		const ok = await crypto.subtle.verify(
			'HMAC',
			key,
			unb64url(sig) as BufferSource,
			encoder.encode(payload)
		);
		if (!ok) return null;

		const claims = JSON.parse(new TextDecoder().decode(unb64url(payload))) as {
			uid?: string;
			exp?: number;
		};
		if (!claims.uid || typeof claims.exp !== 'number') return null;
		if (claims.exp <= Date.now()) return null;
		return claims.uid;
	} catch {
		return null;
	}
}
