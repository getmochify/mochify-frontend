import { createBrowserClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export function createClient() {
    return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
}

export async function getAccessToken(): Promise<string | null> {
    const { data } = await createClient().auth.getSession()
    return data.session?.access_token ?? null
}
