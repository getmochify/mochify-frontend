import { redirect, fail } from '@sveltejs/kit'
import { CF_WORKER_TOKEN } from '$env/static/private'
import type { Actions, PageServerLoad } from './$types'

const TOKEN_WORKER_URL = 'https://tokens.mochify.app'

const STATE_RE = /^[a-f0-9]{64}$/

export const load: PageServerLoad = async ({ locals, url }) => {
    const state = url.searchParams.get('state') ?? ''

    if (!STATE_RE.test(state)) redirect(302, '/')

    if (!locals.user || !locals.session) {
        redirect(302, `/auth/login?next=${encodeURIComponent('/auth/cli?state=' + state)}`)
    }

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

        if (!STATE_RE.test(state)) return fail(400, { error: 'Invalid state parameter' })

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

        const depositRes = await fetch(`${TOKEN_WORKER_URL}/v1/cli/session/${state}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: key }),
        })

        if (!depositRes.ok) return fail(502, { error: 'Failed to complete authorization. Try again.' })

        return { success: true }
    },
}
