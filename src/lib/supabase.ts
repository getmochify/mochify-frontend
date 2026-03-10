import { createBrowserClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export function createClient() {
    return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
}

export async function getAccessToken(): Promise<string | null> {
    const { data } = await createClient().auth.getSession()
    return data.session?.access_token ?? null
}

function decodeJwtPayload(token: string): Record<string, unknown> {
    try {
        return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    } catch {
        return {}
    }
}

export async function getIsPro(): Promise<boolean> {
    const token = await getAccessToken()
    if (!token) return false
    const payload = decodeJwtPayload(token)
    return (payload?.app_metadata as Record<string, unknown>)?.plan === 'pro'
}

export async function getPlan(): Promise<'free' | 'lite' | 'pro'> {
    const token = await getAccessToken()
    if (!token) return 'free'
    const payload = decodeJwtPayload(token)
    const plan = (payload?.app_metadata as Record<string, unknown>)?.plan
    if (plan === 'pro') return 'pro'
    if (plan === 'lite') return 'lite'
    return 'free'
}
