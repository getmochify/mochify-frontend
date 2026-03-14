import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals, platform }) => {
    const { user } = await locals.safeGetSession()
    if (!user) {
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
    let remaining = quota // default: assume unused
    let updatedAt: string | null = null

    const kv = platform?.env?.USAGE_KV
    if (kv) {
        const raw = await kv.get(user.id)
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as { remaining?: number; updatedAt?: string }
                if (typeof parsed.remaining === 'number') remaining = parsed.remaining
                if (parsed.updatedAt) updatedAt = parsed.updatedAt
            } catch {
                // Malformed entry — fall through to defaults
            }
        }
    }

    const used = Math.max(0, quota - remaining)

    return new Response(
        JSON.stringify({ used, remaining, quota, plan, updatedAt }),
        { headers: { 'Content-Type': 'application/json' } }
    )
}
