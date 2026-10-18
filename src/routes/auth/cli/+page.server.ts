import { redirect, fail } from '@sveltejs/kit'
import { CF_WORKER_TOKEN } from '$env/static/private'
import { tokensFetch } from '$lib/server/tokensWorker'
import type { Actions, PageServerLoad } from './$types'

// `mochify auth login` lands here in one of three ways (the worker's
// src/cliAuth.ts has the whole flow):
//
//   loopback  ?port=&challenge=&state= — the CLI is listening on 127.0.0.1.
//             Approving sends the browser back to it with a one-time code that
//             only that CLI, holding the verifier, can redeem.
//   device    no parameters — the user types the code their terminal shows.
//   legacy    ?state= alone — a CLI from before this flow. That handoff gave the
//             key to whoever chose the state, which is exactly what a phishing
//             link does, so it is refused with upgrade instructions.

const PORT_RE = /^\d{4,5}$/
const CHALLENGE_RE = /^[A-Za-z0-9_-]{43}$/
const STATE_RE = /^[A-Za-z0-9_-]{16,128}$/
const LEGACY_STATE_RE = /^[a-f0-9]{64}$/

interface Loopback { port: number; challenge: string; state: string }

function parseLoopback(params: URLSearchParams): Loopback | null {
    const port = params.get('port') ?? ''
    const challenge = params.get('challenge') ?? ''
    const state = params.get('state') ?? ''
    if (!PORT_RE.test(port) || !CHALLENGE_RE.test(challenge) || !STATE_RE.test(state)) return null
    const n = Number(port)
    if (n < 1024 || n > 65535) return null
    return { port: n, challenge, state }
}

export const load: PageServerLoad = async ({ locals, url, platform }) => {
    const loopback = parseLoopback(url.searchParams)
    const legacy = !loopback && LEGACY_STATE_RE.test(url.searchParams.get('state') ?? '')
    // A device code in the link only pre-fills the box; the user still sees it
    // and presses Approve.
    const prefill = (url.searchParams.get('code') ?? '').replace(/[^A-Za-z-]/g, '').slice(0, 9)

    if (!locals.user || !locals.session) {
        redirect(302, `/auth/login?next=${encodeURIComponent('/auth/cli' + url.search)}`)
    }

    // The worker answers 200 either way; has_key is the answer. Reading only
    // res.ok told every user their key would be replaced, key or not.
    let hasKey = false
    try {
        const res = await tokensFetch(platform, `/user/${locals.user.id}/apikey?client=cli`, {
            headers: { 'X-Worker-Token': CF_WORKER_TOKEN },
        })
        if (res.ok) hasKey = ((await res.json()) as { has_key?: boolean }).has_key === true
    } catch { /* proceed without key status */ }

    return {
        mode: loopback ? 'loopback' : legacy ? 'legacy' : 'device',
        loopback,
        prefill,
        hasKey,
        user: locals.user,
    } as const
}

export const actions: Actions = {
    // Loopback: record the approval, then hand the browser back to the CLI.
    approve: async ({ request, locals, platform }) => {
        if (!locals.user || !locals.session) return fail(401, { error: 'Not authenticated' })

        const form = await request.formData()
        const loopback = parseLoopback(new URLSearchParams({
            port: String(form.get('port') ?? ''),
            challenge: String(form.get('challenge') ?? ''),
            state: String(form.get('state') ?? ''),
        }))
        if (!loopback) return fail(400, { error: 'This login link is not valid. Run `mochify auth login` again.' })

        const res = await tokensFetch(platform, '/cli/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Worker-Token': CF_WORKER_TOKEN },
            body: JSON.stringify({ userId: locals.user.id, challenge: loopback.challenge }),
        })
        if (!res.ok) return fail(502, { error: 'Failed to complete authorization. Try again.' })
        const { code } = (await res.json()) as { code: string }

        // Always 127.0.0.1, never a host from the request: the one thing this
        // redirect must not be is somewhere other than the user's own machine.
        const back = new URL(`http://127.0.0.1:${loopback.port}/callback`)
        back.searchParams.set('code', code)
        back.searchParams.set('state', loopback.state)
        redirect(303, back.toString())
    },

    // Device: the user typed the code their terminal shows.
    device: async ({ request, locals, platform }) => {
        if (!locals.user || !locals.session) return fail(401, { error: 'Not authenticated' })

        const userCode = String((await request.formData()).get('code') ?? '')
        const res = await tokensFetch(platform, '/cli/device/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Worker-Token': CF_WORKER_TOKEN },
            body: JSON.stringify({ userId: locals.user.id, userCode }),
        })
        if (res.ok) return { success: true }

        const { error } = (await res.json().catch(() => ({}))) as { error?: string }
        return fail(400, {
            code: userCode,
            error: error === 'unknown_code' || error === 'already_approved'
                ? "That code doesn't match a login in progress. Check your terminal, or run `mochify auth login` again."
                : 'Failed to complete authorization. Try again.',
        })
    },
}
