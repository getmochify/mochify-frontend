import { redirect } from '@sveltejs/kit'
import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'

const PLAN_LIMITS: Record<string, number> = { free: 25, seller: 300, pro: 1200 }

export const load = async ({ locals, platform }) => {
    if (!locals.session || !locals.user) throw redirect(303, '/auth/login')

    let profile: {
        plan: string
        ops_limit: number
        quota_period_end: string | null
        ai_thirdparty_optin: number
        marketing_opt_out: number
    } = {
        plan: 'free',
        ops_limit: PLAN_LIMITS.free,
        quota_period_end: null,
        ai_thirdparty_optin: 0,
        // Opposite polarity to ai_thirdparty_optin on purpose. Sending images to a
        // third party needs affirmative consent, so that one defaults off. Marketing
        // to someone who abandoned a checkout runs on PECR reg 22 soft opt-in, which
        // is a right to refuse rather than a duty to obtain consent, so this defaults
        // to 0 (they receive it) and the toggle below is how they refuse.
        marketing_opt_out: 0,
    }

    const db = platform?.env?.DB
    if (db) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) })
            const row = await kysely
                .selectFrom('profile')
                .select([
                    'plan',
                    'ops_limit',
                    'quota_period_end',
                    'ai_thirdparty_optin',
                    'marketing_opt_out',
                ])
                .where('user_id', '=', locals.user.id)
                .executeTakeFirst()

            if (row) {
                profile = {
                    plan: row.plan ?? 'free',
                    ops_limit: row.ops_limit ?? PLAN_LIMITS[row.plan ?? 'free'] ?? PLAN_LIMITS.free,
                    quota_period_end: row.quota_period_end ?? null,
                    ai_thirdparty_optin: row.ai_thirdparty_optin ?? 0,
                    marketing_opt_out: row.marketing_opt_out ?? 0,
                }
            }
        } catch (e) {
            console.error('[dashboard] profile load failed:', e)
        }
    }

    return { session: locals.session, user: locals.user, profile }
}
