import { fail, redirect } from '@sveltejs/kit'
import { Polar } from '@polar-sh/sdk'
import { env } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'
import type { PageServerLoad } from './$types'

// API-key status server-side, so the card renders with the page instead of the
// old client waterfall (getSession round-trip + up to 3×500ms retries + a
// cross-origin call to core). We already hold locals.session.token here, and the
// edge->core hop is ~90ms, so this replaces seconds of mobile latency with one
// fast call that runs in parallel with the layout's profile query. Core stays
// the source of truth (it returns created_at); only the *timing* moves.
export const load: PageServerLoad = async ({ locals, fetch }) => {
    if (!locals.session) return { hasKey: false, keyCreatedAt: null }

    const API_URL = publicEnv.PUBLIC_API_URL || 'https://api.mochify.app'
    try {
        const res = await fetch(`${API_URL}/v1/user/apikey`, {
            headers: { Authorization: `Bearer ${locals.session.token}` },
        })
        if (res.ok) {
            const body = (await res.json()) as { has_key?: boolean; created_at?: string | null }
            return { hasKey: body.has_key ?? false, keyCreatedAt: body.created_at ?? null }
        }
    } catch (e) {
        console.error('[dashboard] apikey status load failed:', e)
    }
    return { hasKey: false, keyCreatedAt: null }
}

export const actions = {
    // Third-party AI consent toggle. Privacy-first: stored explicitly per user,
    // default off. Upserts because free users may not have a profile row yet —
    // a new row seeds free defaults, an existing row only touches the consent
    // columns so a paid user's plan/limits are never disturbed.
    setAiOptin: async ({ request, locals, platform }) => {
        if (!locals.user) return fail(401, { error: 'Not authenticated' })

        const db = platform?.env?.DB
        if (!db) return fail(500, { error: 'Database unavailable' })

        const form = await request.formData()
        const optin = form.get('optin') === '1' ? 1 : 0
        const now = Date.now()
        const at = new Date().toISOString()

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) })
            await kysely
                .insertInto('profile')
                .values({
                    user_id: locals.user.id,
                    plan: 'free',
                    polar_subscription_id: null,
                    polar_customer_id: null,
                    quota_period_end: null,
                    ops_limit: 25,
                    ai_thirdparty_optin: optin,
                    ai_thirdparty_optin_at: at,
                    created_at: now,
                    updated_at: now,
                })
                .onConflict((oc) =>
                    oc.column('user_id').doUpdateSet({
                        ai_thirdparty_optin: optin,
                        ai_thirdparty_optin_at: at,
                        updated_at: now,
                    })
                )
                .execute()
        } catch (e) {
            console.error('[dashboard] setAiOptin failed:', e)
            return fail(500, { error: 'Could not save your preference' })
        }

        return { success: true, optin }
    },

    // Soft delete with a 14-day grace period. The user row (and its email) is
    // kept so re-registering with the same address can't reset usage limits;
    // logging in again within the window cancels the deletion (see the session
    // databaseHook in $lib/auth.ts). The daily cron in mochify-worker purges
    // rows once deleted_at is older than 14 days.
    deleteAccount: async ({ locals, platform }) => {
        if (!locals.user) return fail(401, { error: 'Not authenticated' })

        const polar = new Polar({
            accessToken: env.POLAR_ACCESS_TOKEN,
            ...(env.POLAR_SANDBOX === 'true' ? { server: 'sandbox' } : {})
        })

        // Billing stops at the moment of the delete click, not at purge time.
        try {
            const subs = await polar.subscriptions.list({ customerId: locals.user.id, limit: 1 })
            const sub = subs.result.items[0]
            if (sub) await polar.subscriptions.revoke({ id: sub.id })
        } catch {
            // Not subscribed or Polar unreachable — proceed with deletion.
        }

        const db = platform?.env?.DB
        if (!db) return fail(500, { error: 'Database unavailable' })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) })
        await kysely
            .updateTable('user')
            .set({ deleted_at: Date.now() })
            .where('id', '=', locals.user.id)
            .execute()
        // The hard delete revoked sessions via cascade; the soft delete must do
        // it explicitly so the user is signed out everywhere.
        await kysely.deleteFrom('session').where('userId', '=', locals.user.id).execute()

        // Purge KV session cache so the cookie is immediately invalid.
        const kv = platform?.env?.USAGE_KV
        const sessionToken = locals.session?.token
        if (kv && sessionToken) await kv.delete(`sc:${sessionToken}`).catch(() => {})

        throw redirect(303, '/?deleted=true')
    }
}
