import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

const API_URL = 'https://api.mochify.xyz'
const WORKER_URL = 'https://tokens.mochify.xyz'

const STATE_RE = /^[a-f0-9]{64}$/

export const load: PageServerLoad = async ({ locals, url }) => {
    const state = url.searchParams.get('state') ?? ''

    if (!STATE_RE.test(state)) redirect(302, '/')

    if (!locals.user || !locals.session) {
        redirect(302, `/auth/login?next=${encodeURIComponent('/auth/cli?state=' + state)}`)
    }

    let hasKey = false
    try {
        const res = await fetch(`${API_URL}/v1/user/apikey`, {
            headers: { Authorization: `Bearer ${locals.session.token}` },
        })
        if (res.ok) {
            const body = await res.json() as { has_key: boolean }
            hasKey = body.has_key
        }
    } catch { /* core not reachable — proceed without key status */ }

    return { state, hasKey, user: locals.user }
}

export const actions: Actions = {
    authorize: async ({ request, locals }) => {
        if (!locals.user || !locals.session) return fail(401, { error: 'Not authenticated' })

        const data = await request.formData()
        const state = data.get('state') as string

        if (!STATE_RE.test(state)) return fail(400, { error: 'Invalid state parameter' })

        const sessionToken = locals.session.token

        // Revoke any existing key, then generate a fresh one.
        await fetch(`${API_URL}/v1/user/apikey`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${sessionToken}` },
        }).catch(() => {})

        const keyRes = await fetch(`${API_URL}/v1/user/apikey`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${sessionToken}` },
        })

        if (!keyRes.ok) return fail(502, { error: 'Failed to generate API key. Try again.' })

        const { key } = await keyRes.json() as { key: string }

        const depositRes = await fetch(`${WORKER_URL}/v1/cli/session/${state}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: key }),
        })

        if (!depositRes.ok) return fail(502, { error: 'Failed to complete authorization. Try again.' })

        return { success: true }
    },
}
