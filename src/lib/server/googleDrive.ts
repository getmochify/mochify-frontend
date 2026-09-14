// The consent-URL half of the Google Drive OAuth flow.
//
// A deliberate mirror of `authorizationUrl` / `DRIVE_SCOPES` in
// ../mochify-worker/src/drive.ts. The two repos cannot share a module, and the
// alternative — a worker route that redirects to Google on this app's behalf —
// would add a public redirector and a hop to build a URL. Duplicating fifteen
// lines is the cheaper trade.
//
// If these drift, it fails loudly rather than subtly: a scope requested here but
// not granted means every Drive call 403s at the moment a user tries to save,
// and the worker's own tests pin the scope list on that side.

/**
 * `drive.file` is per-file access: Mochify can only touch files it created.
 * Non-sensitive, so basic OAuth verification and no third-party security
 * assessment — unlike full `drive`, which is restricted and pulls in an annual
 * paid audit for capabilities this feature does not want.
 *
 * `openid email` rides along so the token response names the account, which is
 * what the dashboard card shows. Both are already granted by the Google sign-in
 * this same OAuth client serves.
 */
export const DRIVE_SCOPES = ['openid', 'email', 'https://www.googleapis.com/auth/drive.file'];

export function authorizationUrl(opts: {
	clientId: string;
	redirectUri: string;
	state: string;
}): string {
	const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	url.searchParams.set('client_id', opts.clientId);
	url.searchParams.set('redirect_uri', opts.redirectUri);
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('scope', DRIVE_SCOPES.join(' '));
	// Without BOTH of these there is no refresh token. Google declines to
	// reissue one for an account that already granted the scope — and since this
	// is also the sign-in client, every Google-sign-in user is already in that
	// state. The connection would then work for an hour and die.
	url.searchParams.set('access_type', 'offline');
	url.searchParams.set('prompt', 'consent');
	url.searchParams.set('include_granted_scopes', 'true');
	url.searchParams.set('state', opts.state);
	return url.toString();
}
