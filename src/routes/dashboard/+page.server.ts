import { fail, redirect } from '@sveltejs/kit'
import { Polar } from '@polar-sh/sdk'
import { env } from '$env/dynamic/private'
import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'

export const actions = {
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
