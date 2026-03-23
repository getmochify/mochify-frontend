import { authClient } from '$lib/auth-client'

export async function getSessionToken(): Promise<string | null> {
    const { data } = await authClient.getSession()
    return data?.session?.token ?? null
}

// Deduplicate concurrent calls — components calling getPlan() and getIsPro()
// in the same onMount would otherwise fire two requests to /api/usage.
let _planRequest: Promise<'free' | 'lite' | 'pro'> | null = null

export function getPlan(): Promise<'free' | 'lite' | 'pro'> {
    if (!_planRequest) {
        _planRequest = fetch('/api/usage')
            .then(res => res.ok ? res.json() as Promise<{ plan?: string }> : {})
            .then(data => {
                if ((data as { plan?: string }).plan === 'pro') return 'pro'
                if ((data as { plan?: string }).plan === 'lite') return 'lite'
                return 'free'
            })
            .catch(() => 'free' as const)
            .finally(() => { _planRequest = null })
    }
    return _planRequest
}

export async function getIsPro(): Promise<boolean> {
    return (await getPlan()) === 'pro'
}
