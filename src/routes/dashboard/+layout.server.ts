import { redirect } from '@sveltejs/kit'
import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'

const PLAN_LIMITS: Record<string, number> = { free: 25, lite: 300, pro: 1000 }

export const load = async ({ locals, platform }) => {
    if (!locals.session || !locals.user) throw redirect(303, '/auth/login')

    let profile: { plan: string; ops_limit: number; quota_period_end: string | null } = {
        plan: 'free',
        ops_limit: PLAN_LIMITS.free,
        quota_period_end: null,
    }

    const db = platform?.env?.DB
    if (db) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) })
            const row = await kysely
                .selectFrom('profile')
                .select(['plan', 'ops_limit', 'quota_period_end'])
                .where('user_id', '=', locals.user.id)
                .executeTakeFirst()

            if (row) {
                profile = {
                    plan: row.plan ?? 'free',
                    ops_limit: row.ops_limit ?? PLAN_LIMITS[row.plan ?? 'free'] ?? PLAN_LIMITS.free,
                    quota_period_end: row.quota_period_end ?? null,
                }
            }
        } catch (e) {
            console.error('[dashboard] profile load failed:', e)
        }
    }

    return { session: locals.session, user: locals.user, profile }
}
