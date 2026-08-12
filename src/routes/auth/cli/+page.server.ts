import { redirect, fail } from '@sveltejs/kit'
import { CF_WORKER_TOKEN } from '$env/static/private'
import { tokensFetch } from '$lib/server/tokensWorker'
import type { Actions, PageServerLoad } from './$types'

const STATE_RE = /^[a-f0-9]{64}$/

export const load: PageServerLoad = async ({ locals, url, platform }) => {
    const state = url.searchParams.get('state') ?? ''

    if (!STATE_RE.test(state)) redirect(302, '/')

    if (!locals.user || !locals.session) {
        redirect(302, `/auth/login?next=${encodeURIComponent('/auth/cli?state=' + state)}`)
    }

    let hasKey = false
    try {
        const res = await tokensFetch(platform, `/user/${locals.user.id}/apikey`, {
            headers: { 'X-Worker-Token': CF_WORKER_TOKEN },
        })
        if (res.ok) hasKey = true
    } catch { /* proceed without key status */ }

    return { state, hasKey, user: locals.user }
}

export const actions: Actions = {
    authorize: async ({ request, locals, platform }) => {
        if (!locals.user || !locals.session) return fail(401, { error: 'Not authenticated' })

        const data = await request.formData()
        const state = data.get('state') as string

        if (!STATE_RE.test(state)) return fail(400, { error: 'Invalid state parameter' })

        const userId = locals.user.id

        // Delete any existing key, then generate a fresh one directly via worker.
        // This action makes three sequential calls to the tokens worker; over a
        // public fetch that was three full edge round-trips on the critical path
        // of a user waiting at an auth prompt.
        await tokensFetch(platform, `/user/${userId}/apikey`, {
            method: 'DELETE',
            headers: { 'X-Worker-Token': CF_WORKER_TOKEN },
        }).catch(() => {})

        const rawBytes = crypto.getRandomValues(new Uint8Array(32))
        const key = Array.from(rawBytes).map(b => b.toString(16).padStart(2, '0')).join('')
        const hashBuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
        const keyHash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('')

        const storeRes = await tokensFetch(platform, `/apikey/${keyHash}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Worker-Token': CF_WORKER_TOKEN },
            body: JSON.stringify({ userId }),
        })

        if (!storeRes.ok) return fail(502, { error: 'Failed to generate API key. Try again.' })

        // No X-Worker-Token: this route is public on the worker, gated by the
        // 64-char state value acting as its own capability token.
        const depositRes = await tokensFetch(platform, `/v1/cli/session/${state}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: key }),
        })

        if (!depositRes.ok) return fail(502, { error: 'Failed to complete authorization. Try again.' })

        return { success: true }
    },
}
