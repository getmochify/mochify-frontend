import { fail, redirect } from '@sveltejs/kit'
import { Polar } from '@polar-sh/sdk'
import { env } from '$env/dynamic/private'
import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'

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

    deleteAccount: async ({ locals, platform }) => {
        if (!locals.user) return fail(401, { error: 'Not authenticated' })

        const polar = new Polar({
            accessToken: env.POLAR_ACCESS_TOKEN,
            ...(env.POLAR_SANDBOX === 'true' ? { server: 'sandbox' } : {})
        })

        // TODO: cancel Polar subscription once profiles table is in D1.
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
        await kysely.deleteFrom('user').where('id', '=', locals.user.id).execute()

        // Purge KV session cache so the cookie is immediately invalid.
        const kv = platform?.env?.USAGE_KV
        const sessionToken = locals.session?.token
        if (kv && sessionToken) await kv.delete(`sc:${sessionToken}`).catch(() => {})

        throw redirect(303, '/?deleted=true')
    }
}
