import { authClient } from '$lib/auth-client'

export async function getSessionToken(): Promise<string | null> {
    const { data } = await authClient.getSession()
    return data?.session?.token ?? null
}

// Deduplicate concurrent calls — components calling getPlan() and getIsPro()
// in the same onMount would otherwise fire two requests to /api/usage.
let _planRequest: Promise<'free' | 'seller' | 'pro' | 'day'> | null = null

export function getPlan(): Promise<'free' | 'seller' | 'pro' | 'day'> {
    if (!_planRequest) {
        _planRequest = fetch('/api/usage')
            .then(res => res.ok ? res.json() as Promise<{ plan?: string }> : {})
            .then(data => {
                const plan = (data as { plan?: string }).plan
                if (plan === 'pro') return 'pro'
                if (plan === 'seller') return 'seller'
                if (plan === 'day') return 'day'
                return 'free'
            })
            .catch(() => 'free' as const)
            .finally(() => { _planRequest = null })
    }
    return _planRequest
}

