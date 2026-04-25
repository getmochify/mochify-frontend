import { redirect, fail } from '@sveltejs/kit'
import { CF_WORKER_TOKEN } from '$env/static/private'
import type { Actions, PageServerLoad } from './$types'

const API_URL = 'https://api.mochify.xyz'
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
        const res = await fetch(`${API_URL}/v1/user/apikey`, {
            headers: { Authorization: `Bearer ${locals.session.token}` },
        })
        if (res.ok) {
            const body = await res.json() as { has_key: boolean }
            hasKey = body.has_key
        }
    } catch { /* proceed without key status */ }

    return { state, hasKey, user: locals.user }
}

export const actions: Actions = {
    authorize: async ({ request, locals }) => {
        if (!locals.user || !locals.session) return fail(401, { error: 'Not authenticated' })

        const data = await request.formData()
        const state = data.get('state') as string

        if (!state || state.length > 512) return fail(400, { error: 'Invalid state parameter' })

        const sessionToken = locals.session.token
        const userId = locals.user.id

        // Rotate API key
        await fetch(`${API_URL}/v1/user/apikey`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${sessionToken}` },
        }).catch(() => {})

        const keyRes = await fetch(`${API_URL}/v1/user/apikey`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${sessionToken}` },
        })

        if (!keyRes.ok) {
            const detail = await keyRes.text().catch(() => '')
            return fail(502, { error: `Failed to generate API key (${keyRes.status})${detail ? ': ' + detail : ''}` })
        }

        const { key } = await keyRes.json() as { key: string }

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
