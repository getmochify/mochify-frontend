import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_API_URL } from '$env/static/public'
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import type { RequestHandler } from './$types'

const API_URL = PUBLIC_API_URL || 'https://api.mochify.xyz'

export const GET: RequestHandler = async ({ locals, platform }) => {
    const { session, user } = await locals.safeGetSession()
    if (!user || !session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    // Try KV first — populated by mochify-core after each squish, or warmed below on first visit.
    const kv = platform?.env?.USAGE_KV
    let remaining: number | null = null
    let updatedAt: string | null = null
    let quota: number | null = null
    let plan: string | null = null

    if (kv) {
        const raw = await kv.get(user.id)
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

    // KV hit with full data — skip Supabase entirely.
    if (remaining !== null && quota !== null && plan !== null) {
        const used = Math.max(0, quota - remaining)
        return new Response(
            JSON.stringify({ used, remaining, quota, plan, updatedAt }),
            { headers: { 'Content-Type': 'application/json' } }
        )
    }

    // KV miss or partial — fetch profile from Supabase for quota + plan.
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: profile } = await supabase
        .from('profiles')
        .select('plan, ops_limit')
        .eq('user_id', user.id)
        .single()

    const resolvedQuota: number = profile?.ops_limit ?? 30
    const resolvedPlan: string  = profile?.plan ?? 'free'
    quota = resolvedQuota
    plan  = resolvedPlan

    // KV miss (cold start or new user): fall back to mochify-core which reads Redis directly.
    // Write the result to KV so subsequent dashboard loads skip this round-trip.
    if (remaining === null) {
        try {
            const coreRes = await fetch(`${API_URL}/v1/user/usage`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            })
            if (coreRes.ok) {
                const body = await coreRes.json() as { used?: number; quota?: number }
                const coreUsed = body.used ?? 0
                remaining = Math.max(0, (body.quota ?? resolvedQuota) - coreUsed)
                updatedAt = new Date().toISOString()

                // Warm KV so future loads are fast (include plan + quota to skip Supabase next time).
                if (kv) {
                    await kv.put(user.id, JSON.stringify({ remaining, quota: resolvedQuota, plan: resolvedPlan, updatedAt }))
                }
            }
        } catch {
            // Core unreachable — fall back to assuming no usage yet.
        }
    }

    // Final fallback: assume no usage (new user, core unreachable).
    const finalRemaining = remaining ?? resolvedQuota
    const used = Math.max(0, resolvedQuota - finalRemaining)

    return new Response(
        JSON.stringify({ used, remaining: finalRemaining, quota: resolvedQuota, plan: resolvedPlan, updatedAt }),
        { headers: { 'Content-Type': 'application/json' } }
    )
}
