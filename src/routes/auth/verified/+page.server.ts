import { redirect } from '@sveltejs/kit'
import { sanitiseNext } from '$lib/server/next'

// Where every verification link lands (the callbackURL set by register and
// login). Better Auth redirects here in three different states, and before this
// page existed all three went straight to `next`, usually /dashboard, which
// bounced a signed-out visitor to the login page with no word on why:
//
// - Verified and signed in (autoSignInAfterVerification): carry on to `next`.
// - `?error=TOKEN_EXPIRED` / `INVALID_TOKEN` / `USER_NOT_FOUND`: the link did
//   nothing, and the reader needs to be told how to get a working one.
// - No error and no session: the account was ALREADY verified, so Better Auth
//   redirects without creating a session. This is the link opened a second
//   time, or opened first by a mail scanner (Outlook Safe Links and corporate
//   gateways fetch links before the reader does). The account is fine and only
//   needs a sign-in, which is exactly what the bare login page never said.
export const load = async ({ locals, url }) => {
    const next = sanitiseNext(url.searchParams.get('next'))
    const error = url.searchParams.get('error')
    if (!error && locals.session) throw redirect(303, next)
    return { next, error }
}
