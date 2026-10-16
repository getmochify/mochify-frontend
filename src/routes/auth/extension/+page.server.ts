import { redirect, fail } from '@sveltejs/kit'
import { CF_WORKER_TOKEN } from '$env/static/private'
import { env } from '$env/dynamic/private'
import { tokensFetch } from '$lib/server/tokensWorker'
import type { Actions, PageServerLoad } from './$types'

// The page hands a fresh API key to whichever extension `?ext=` names, via
// chrome.runtime.sendMessage. Any extension declaring externally_connectable
// for mochify.app can receive it, so a link carrying another extension's ID
// gave that extension the user's key. Only ours may be named.
//
// The Web Store ID is fixed and public. Unpacked builds get an ID per machine;
// list those in EXTRA_EXTENSION_IDS (comma-separated) for local development,
// never in production.
const STORE_EXTENSION_ID = 'pgegchhkcjdcnnppeahkdcalclpaamcj'

function isOurExtension(extId: string): boolean {
    if (extId === STORE_EXTENSION_ID) return true
    const extra = (env.EXTRA_EXTENSION_IDS ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    return /^[a-p]{32}$/.test(extId) && extra.includes(extId)
}

export const load: PageServerLoad = async ({ locals, url, platform }) => {
    const extId = url.searchParams.get('ext') ?? ''

    if (!isOurExtension(extId)) redirect(302, '/')

    if (!locals.user || !locals.session) {
        redirect(302, `/auth/login?next=${encodeURIComponent('/auth/extension?ext=' + extId)}`)
    }

    // The worker answers 200 either way; has_key is the answer.
    let hasKey = false
    try {
        const res = await tokensFetch(platform, `/user/${locals.user.id}/apikey`, {
            headers: { 'X-Worker-Token': CF_WORKER_TOKEN },
        })
        if (res.ok) hasKey = ((await res.json()) as { has_key?: boolean }).has_key === true
    } catch { /* proceed */ }

    return { extId, hasKey, user: locals.user }
}

export const actions: Actions = {
    authorize: async ({ request, locals, platform }) => {
        if (!locals.user || !locals.session) return fail(401, { error: 'Not authenticated' })

        const data = await request.formData()
        const extId = data.get('extId') as string

        if (!isOurExtension(extId)) return fail(400, { error: 'Invalid extension ID' })

        const userId = locals.user.id

        // Revoke existing key then issue a fresh one.
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

        return { success: true, apiKey: key, email: locals.user.email }
    },
}
