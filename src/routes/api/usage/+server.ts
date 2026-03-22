import { PUBLIC_API_URL } from '$env/static/public'
import type { RequestHandler } from './$types'

const API_URL = PUBLIC_API_URL || 'https://api.mochify.xyz'
const PLAN_LIMITS: Record<string, number> = { free: 25, pro: 1000 }

export const GET: RequestHandler = async ({ locals, platform }) => {
    if (!locals.user || !locals.session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        })
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

    // TODO: read plan from D1 profiles table once migrated from Supabase.
    const resolvedPlan  = plan  ?? 'free'
    const resolvedQuota = quota ?? PLAN_LIMITS[resolvedPlan]

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
