import { redirect, fail } from '@sveltejs/kit'
import { CF_WORKER_TOKEN } from '$env/static/private'
import type { Actions, PageServerLoad } from './$types'

const TOKEN_WORKER_URL = 'https://tokens.mochify.app'
const EXT_ID_RE = /^[a-z]{32}$/

export const load: PageServerLoad = async ({ locals, url }) => {
    const extId = url.searchParams.get('ext') ?? ''

    if (!EXT_ID_RE.test(extId)) redirect(302, '/')

    if (!locals.user || !locals.session) {
        redirect(302, `/auth/login?next=${encodeURIComponent('/auth/extension?ext=' + extId)}`)
    }

    let hasKey = false
    try {
        const res = await fetch(`${TOKEN_WORKER_URL}/user/${locals.user.id}/apikey`, {
            headers: { 'X-Worker-Token': CF_WORKER_TOKEN },
        })
        if (res.ok) hasKey = true
    } catch { /* proceed */ }

    return { extId, hasKey, user: locals.user }
}

export const actions: Actions = {
    authorize: async ({ request, locals }) => {
        if (!locals.user || !locals.session) return fail(401, { error: 'Not authenticated' })

        const data = await request.formData()
        const extId = data.get('extId') as string

        if (!EXT_ID_RE.test(extId)) return fail(400, { error: 'Invalid extension ID' })

        const userId = locals.user.id

        // Revoke existing key then issue a fresh one.
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

        return { success: true, apiKey: key, email: locals.user.email }
    },
}
