import { redirect, fail } from '@sveltejs/kit'
import { CF_WORKER_TOKEN } from '$env/static/private'
import type { Actions, PageServerLoad } from './$types'

const MCP_WORKER_URL = 'https://mcp.mochify.app'

export const load: PageServerLoad = async ({ locals, url }) => {
    const state = url.searchParams.get('state') ?? ''

    if (!state || state.length > 512) redirect(302, '/')

    if (!locals.user || !locals.session) {
        redirect(302, `/auth/login?next=${encodeURIComponent('/auth/mcp?state=' + state)}`)
    }

    // Confirm this state is a live pending OAuth request in the MCP worker
    const check = await fetch(`${MCP_WORKER_URL}/oauth/authorize/state/${encodeURIComponent(state)}`, {
        headers: { 'X-Worker-Token': CF_WORKER_TOKEN },
    }).catch(() => null)

    if (!check?.ok) redirect(302, '/')

    // Who is asking, so the user can see where the code goes before approving.
    // An older worker answers a bare "OK", which leaves both fields null.
    const info = (await check.json().catch(() => null)) as {
        clientName?: unknown
        redirectScheme?: unknown
        redirectHost?: unknown
    } | null

    return {
        state,
        user: locals.user,
        clientName: cleanClientName(info?.clientName),
        returnsTo: describeReturn(info?.redirectScheme, info?.redirectHost),
    }
}

// Self-registered by the client, so shown as a claim; kept to printable text.
function cleanClientName(value: unknown): string | null {
    if (typeof value !== 'string') return null
    const name = value.replace(/[\p{C}]/gu, '').trim().slice(0, 60)
    return name || null
}

// The redirect host is the trustworthy part: the worker only accepts redirect
// URIs on its allowlist.
function describeReturn(scheme: unknown, host: unknown): string | null {
    if (typeof scheme !== 'string') return null
    if (scheme === 'https' && typeof host === 'string' && host) return host
    if (scheme === 'http') return 'an app on this computer'
    return `the ${scheme} app on this computer`
}

export const actions: Actions = {
    authorize: async ({ request, locals }) => {
        if (!locals.user || !locals.session) return fail(401, { error: 'Not authenticated' })

        const data = await request.formData()
        const state = data.get('state') as string

        if (!state || state.length > 512) return fail(400, { error: 'Invalid state parameter' })

        // Hand userId to the MCP worker — it issues the access token and registers
        // it directly in the shared APIKEY_KV so the C++ backend can resolve it.
        const callbackRes = await fetch(`${MCP_WORKER_URL}/oauth/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Worker-Token': CF_WORKER_TOKEN,
            },
            body: JSON.stringify({ state, userId: locals.user.id }),
        })

        if (!callbackRes.ok) return fail(502, { error: 'Authorization failed. The request may have expired — please try again.' })

        const { code, redirectUri } = await callbackRes.json() as { code: string; redirectUri: string }

        let parsedUri: URL
        try {
            parsedUri = new URL(redirectUri)
        } catch {
            return fail(502, { error: 'Invalid redirect URI returned by auth worker.' })
        }
        if (parsedUri.protocol !== 'https:') {
            return fail(502, { error: 'Redirect URI must use HTTPS.' })
        }

        // Added to whatever query the client registered rather than appended as
        // `?code=…`, which turned `/cb?client=x` into `/cb?client=x?code=…`.
        // set() also replaces a code or state the registered URI already carried.
        parsedUri.searchParams.set('code', code)
        parsedUri.searchParams.set('state', state)
        redirect(302, parsedUri.toString())
    },
}
