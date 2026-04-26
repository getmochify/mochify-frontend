import { PUBLIC_API_URL } from '$env/static/public'
import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'
import type { RequestHandler } from './$types'

const API_URL = PUBLIC_API_URL || 'https://api.mochify.app'
const PLAN_LIMITS: Record<string, number> = { free: 25, seller: 300, pro: 1200 }

export const GET: RequestHandler = async ({ locals, platform, request }) => {
    if (!locals.user || !locals.session) {
        // Unauthenticated — proxy to core's IP-based free tier check.
        try {
            const coreRes = await fetch(`${API_URL}/v1/checkTokens`, {
                headers: { 'X-Forwarded-For': request.headers.get('CF-Connecting-IP') ?? '' },
            })
            if (coreRes.ok) {
                const body = await coreRes.json() as { remaining?: number; available?: number }
                const quota = PLAN_LIMITS.free
                const remaining = body.remaining ?? body.available ?? quota
                const used = Math.max(0, quota - remaining)
                return new Response(
                    JSON.stringify({ used, remaining, quota, plan: 'free', updatedAt: null }),
                    { headers: { 'Content-Type': 'application/json' } }
                )
            }
        } catch {
            // Core unreachable — return zeroed free tier.
        }
        const quota = PLAN_LIMITS.free
        return new Response(
            JSON.stringify({ used: 0, remaining: quota, quota, plan: 'free', updatedAt: null }),
            { headers: { 'Content-Type': 'application/json' } }
        )
    }

    // Try KV first — populated by mochify-core after each squish.
    const kv = platform?.env?.USAGE_KV
    let remaining: number | null = null
    let updatedAt: string | null = null
    let quota: number | null = null
    let plan: string | null = null

    if (kv) {
        const raw = await kv.get(locals.user.id)
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as {
                    remaining?: number; updatedAt?: string
                    quota?: number; plan?: string
                }
                if (typeof parsed.remaining === 'number') remaining = parsed.remaining
                if (typeof parsed.quota    === 'number') quota     = parsed.quota
                if (parsed.updatedAt) updatedAt = parsed.updatedAt
                if (parsed.plan)      plan      = parsed.plan
            } catch {
                // Malformed entry — fall through
            }
        }
    }

    // KV hit with full data — skip core fetch.
    if (remaining !== null && quota !== null && plan !== null) {
        const used = Math.max(0, quota - remaining)
        return new Response(
            JSON.stringify({ used, remaining, quota, plan, updatedAt }),
            { headers: { 'Content-Type': 'application/json' } }
        )
    }

    // KV miss for plan — query D1 profile table.
    if (!plan) {
        const db = platform?.env?.DB
        if (db) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) })
                const row = await kysely
                    .selectFrom('profile')
                    .select(['plan', 'ops_limit'])
                    .where('user_id', '=', locals.user.id)
                    .executeTakeFirst()
                if (row) {
                    plan  = row.plan ?? 'free'
                    quota = row.ops_limit ?? PLAN_LIMITS[plan ?? 'free'] ?? PLAN_LIMITS.free
                }
            } catch {
                // D1 unavailable — fall through to free defaults
            }
        }
    }

    const resolvedPlan  = plan  ?? 'free'
    const resolvedQuota = quota ?? PLAN_LIMITS[resolvedPlan] ?? PLAN_LIMITS.free

    // KV miss — fetch live usage from mochify-core.
    if (remaining === null) {
        try {
            const coreRes = await fetch(`${API_URL}/v1/user/usage`, {
                headers: { Authorization: `Bearer ${locals.session.token}` },
            })
            if (coreRes.ok) {
                const body = await coreRes.json() as { used?: number; quota?: number }
                const coreUsed = body.used ?? 0
                remaining = Math.max(0, (body.quota ?? resolvedQuota) - coreUsed)
                updatedAt = new Date().toISOString()

                if (kv) {
                    await kv.put(locals.user.id, JSON.stringify({
                        remaining, quota: resolvedQuota, plan: resolvedPlan, updatedAt
                    }))
                }
            }
        } catch {
            // Core unreachable — fall back to assuming no usage yet.
        }
    }

    const finalRemaining = remaining ?? resolvedQuota
    const used = Math.max(0, resolvedQuota - finalRemaining)

    return new Response(
        JSON.stringify({ used, remaining: finalRemaining, quota: resolvedQuota, plan: resolvedPlan, updatedAt }),
        { headers: { 'Content-Type': 'application/json' } }
    )
}
