import { authClient } from '$lib/auth-client'

export async function getSessionToken(): Promise<string | null> {
    const { data } = await authClient.getSession()
    return data?.session?.token ?? null
}

export async function getPlan(): Promise<'free' | 'lite' | 'pro'> {
    try {
        const res = await fetch('/api/usage')
        if (res.ok) {
            const data = await res.json() as { plan?: string }
            if (data.plan === 'pro') return 'pro'
            if (data.plan === 'lite') return 'lite'
        }
    } catch { /* core unreachable */ }
    return 'free'
}

export async function getIsPro(): Promise<boolean> {
    return (await getPlan()) === 'pro'
}
