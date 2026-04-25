import { redirect, fail } from '@sveltejs/kit'
import { CF_WORKER_TOKEN } from '$env/static/private'
import type { Actions, PageServerLoad } from './$types'

const TOKEN_WORKER_URL = 'https://tokens.mochify.app'
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

    let hasKey = false
    try {
        const res = await fetch(`${TOKEN_WORKER_URL}/user/${locals.user.id}/apikey`, {
            headers: { 'X-Worker-Token': CF_WORKER_TOKEN },
        })
        if (res.ok) hasKey = true
    } catch { /* proceed without key status */ }

    return { state, hasKey, user: locals.user }
}

export const actions: Actions = {
    authorize: async ({ request, locals }) => {
        if (!locals.user || !locals.session) return fail(401, { error: 'Not authenticated' })

        const data = await request.formData()
        const state = data.get('state') as string

        if (!state || state.length > 512) return fail(400, { error: 'Invalid state parameter' })

        const userId = locals.user.id

        // Delete any existing key, then generate a fresh one directly via worker
        await fetch(`${TOKEN_WORKER_URL}/user/${userId}/apikey`, {
            method: 'DELETE',
            headers: { 'X-Worker-Token': CF_WORKER_TOKEN },
        }).catch(() => {})

        const rawBytes = crypto.getRandomValues(new Uint8Array(32))
        const key = Array.from(rawBytes).map(b => b.toString(16).padStart(2, '0')).join('')
        const hashBuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
        const keyHash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('')

        const storeRes = await fetch(`${TOKEN_WORKER_URL}/apikey/${keyHash}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Worker-Token': CF_WORKER_TOKEN },
            body: JSON.stringify({ userId }),
        })

        if (!storeRes.ok) return fail(502, { error: 'Failed to generate API key. Try again.' })

        // Hand the API key + userId to the MCP worker, get back the OAuth auth code
        const callbackRes = await fetch(`${MCP_WORKER_URL}/oauth/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Worker-Token': CF_WORKER_TOKEN,
            },
            body: JSON.stringify({ state, apiKey: key, userId }),
        })

        if (!callbackRes.ok) return fail(502, { error: 'Authorization failed. The request may have expired — please try again.' })

        const { code, redirectUri } = await callbackRes.json() as { code: string; redirectUri: string }

        // Complete the OAuth redirect back to the client (e.g. Claude.ai)
        redirect(302, `${redirectUri}?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`)
    },
}
