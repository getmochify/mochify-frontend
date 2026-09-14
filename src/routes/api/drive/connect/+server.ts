import { redirect } from '@sveltejs/kit'
// Static rather than dynamic for these two, matching how $lib/auth.ts reads
// them: they are build-time values there, and a runtime lookup would quietly
// resolve to undefined if they are not also bound as worker secrets.
import { GOOGLE_CLIENT_ID, BETTER_AUTH_SECRET } from '$env/static/private'
import { authorizationUrl } from '$lib/server/googleDrive'
import { signState } from '$lib/server/driveState'
import { assertStoragePlan } from '$lib/server/storagePlan'
import type { RequestHandler } from './$types'

// Start of the "save to Google Drive" consent hop.
//
// This half lives on the Pages app because it is the only place that knows who
// is signed in. The half that matters — swapping the code for a refresh token —
// happens in the tokens worker, so the long-lived credential is created and
// sealed without ever existing here. Same split the bucket uses for a secret
// access key.
export const GET: RequestHandler = async ({ locals, url, platform }) => {
    if (!locals.user) {
        const login = new URL('/auth/login', url.origin)
        login.searchParams.set('next', '/dashboard')
        throw redirect(303, login.toString())
    }

    // Re-checked server-side rather than trusted from the card that rendered the
    // button. Sending a free user to Google would get them through a real
    // consent screen before anything refused them, which is a poor way to learn
    // the feature is not on your plan.
    if (!(await assertStoragePlan(platform, locals.user.id))) {
        throw redirect(303, '/pricing')
    }

    if (!GOOGLE_CLIENT_ID || !BETTER_AUTH_SECRET) {
        console.error('[drive/connect] GOOGLE_CLIENT_ID or BETTER_AUTH_SECRET is not set')
        throw redirect(303, '/dashboard?drive_error=unavailable')
    }

    // Derived from the request rather than configured, so dev and production are
    // each correct without a second copy of the string to keep in step. The
    // exchange in the worker is sent this same value; Google requires the two to
    // match byte for byte.
    const redirectUri = `${url.origin}/api/drive/callback`

    throw redirect(
        303,
        authorizationUrl({
            clientId: GOOGLE_CLIENT_ID,
            redirectUri,
            state: await signState(BETTER_AUTH_SECRET, locals.user.id)
        })
    )
}
