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

    // Fetch profile for quota + plan — source of truth is Supabase.
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: profile } = await supabase
        .from('profiles')
        .select('plan, ops_limit')
        .eq('user_id', user.id)
        .single()

    const quota: number = profile?.ops_limit ?? 30
    const plan: string = profile?.plan ?? 'free'

    // Read the token count written by mochify-core after each squish.
    // Key is the plain user UUID; namespace is USAGE_KV.
    const kv = platform?.env?.USAGE_KV
    let remaining: number | null = null
    let updatedAt: string | null = null

    if (kv) {
        const raw = await kv.get(user.id)
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as { remaining?: number; updatedAt?: string }
                if (typeof parsed.remaining === 'number') remaining = parsed.remaining
                if (parsed.updatedAt) updatedAt = parsed.updatedAt
            } catch {
                // Malformed entry — fall through
            }
        }
    }

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
                const coreQuota = body.quota ?? quota
                remaining = Math.max(0, coreQuota - coreUsed)
                updatedAt = new Date().toISOString()

                // Warm KV so future loads are fast.
                if (kv) {
                    kv.put(user.id, JSON.stringify({ remaining, updatedAt })).catch(() => {})
                }
            }
        } catch {
            // Core unreachable — fall back to assuming no usage yet.
        }
    }

    // Final fallback: assume no usage (new user, core unreachable).
    if (remaining === null) remaining = quota

    const used = Math.max(0, quota - remaining)

    return new Response(
        JSON.stringify({ used, remaining, quota, plan, updatedAt }),
        { headers: { 'Content-Type': 'application/json' } }
    )
}
