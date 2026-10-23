import { PUBLIC_APP_URL } from '$env/static/public';
import { createAuth } from '$lib/auth';

/**
 * Where the Day Pass activation link lands: the page the pass was bought from
 * (see dayPassReturnPath in api/checkout), so the buyer is put back next to
 * their files rather than on the homepage. Metadata is set by our own checkout
 * call, but resolved against our origin anyway, and anything that leaves it
 * (`//host`, `/\host`, an absolute URL) falls back to the homepage.
 */
export function magicLinkReturn(raw: unknown): string {
	if (typeof raw !== 'string' || !raw.startsWith('/')) return '/';
	try {
		const base = new URL(PUBLIC_APP_URL);
		const target = new URL(raw, base);
		return target.origin === base.origin ? target.pathname + target.search : '/';
	} catch {
		return '/';
	}
}

/**
 * Email the Day Pass activation link (the magic link; it also creates the user
 * in D1 if they don't exist yet). Sent by the `order.created` webhook and again
 * on request from `api/day-pass/resend`.
 */
export async function sendDayPassLink(
	db: D1Database,
	resendKey: string | undefined,
	email: string,
	returnPath: unknown
): Promise<void> {
	const auth = createAuth(db, resendKey);
	await auth.api.signInMagicLink({
		body: { email, callbackURL: magicLinkReturn(returnPath) },
		headers: new Headers({ origin: PUBLIC_APP_URL })
	});
}
