import { redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
// Static, matching $lib/auth.ts — see the note in ../connect/+server.ts.
import { BETTER_AUTH_SECRET } from '$env/static/private'
import { verifyState } from '$lib/server/driveState'
import type { RequestHandler } from './$types'

const WORKER_URL = env.CF_WORKER_URL || 'https://id.mochify.app'

// Where Google sends the user back.
//
// The code that arrives here is a one-time credential, and this handler's whole
// job is to get it to the tokens worker without the refresh token it becomes
// ever existing on this side. The code transits in memory, is forwarded over the
// service binding, and is never logged — the same handling the bucket's secret
// access key gets on its way through.
export const GET: RequestHandler = async ({ locals, url, platform }) => {
    const back = (params: Record<string, string>) => {
        const target = new URL('/dashboard', url.origin)
        for (const [k, v] of Object.entries(params)) target.searchParams.set(k, v)
        return target.toString()
    }

    if (!locals.user) throw redirect(303, '/auth/login?next=/dashboard')

    // The user pressed Cancel on the consent screen, or Google refused. Not an
    // error worth a scary message — they simply did not connect.
    const denied = url.searchParams.get('error')
    if (denied) throw redirect(303, back({ drive: 'cancelled' }))

    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    if (!code || !state) throw redirect(303, back({ drive_error: 'incomplete' }))

    if (!BETTER_AUTH_SECRET) {
        console.error('[drive/callback] BETTER_AUTH_SECRET is not set')
        throw redirect(303, back({ drive_error: 'unavailable' }))
    }

    // Two checks, not one. A valid signature proves we minted this state; the
    // comparison against the live session proves it was minted for *this* user.
    // Dropping the second turns a stolen callback URL into a way of pointing
    // someone else's account at an attacker's Drive.
    const stateUser = await verifyState(BETTER_AUTH_SECRET, state)
    if (!stateUser || stateUser !== locals.user.id) {
        console.error('[drive/callback] state rejected')
        throw redirect(303, back({ drive_error: 'state' }))
    }

    // Must be byte-identical to the value sent to Google in /connect, which is
    // why both derive it from the request origin rather than from config.
    const redirectUri = `${url.origin}/api/drive/callback`

    try {
        const req = new Request(`${WORKER_URL}/user/${locals.user.id}/drive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Worker-Token': env.CF_WORKER_TOKEN ?? ''
            },
            body: JSON.stringify({ code, redirectUri })
        })
        // Prefer the in-network service binding over a public round trip, same
        // reasoning as /api/bucket and /api/usage.
        const res = platform?.env?.TOKENS
            ? await platform.env.TOKENS.fetch(req)
            : await fetch(req)

        if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { error?: string }
            // The worker's messages are already written for people ("Your Google
            // Drive is full", "that authorization link had already been used"),
            // so carry them to the dashboard rather than flattening them into a
            // status code the user cannot act on.
            throw redirect(303, back({ drive_error: body.error ?? 'failed' }))
        }
    } catch (e) {
        // SvelteKit signals redirects by throwing, so a redirect thrown above
        // must not be swallowed by this catch.
        if (e && typeof e === 'object' && 'status' in e && 'location' in e) throw e
        console.error('[drive/callback] connection failed:', e)
        throw redirect(303, back({ drive_error: 'failed' }))
    }

    throw redirect(303, back({ drive: 'connected' }))
}
