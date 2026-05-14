import { authClient } from '$lib/auth-client'

// Deduplicate concurrent calls — multiple components often call getSessionToken()
// in the same tick; without this each call fires a separate /api/auth/get-session request.
let _sessionRequest: Promise<string | null> | null = null

export function getSessionToken(): Promise<string | null> {
    if (!_sessionRequest) {
        _sessionRequest = authClient.getSession()
            .then(({ data }) => data?.session?.token ?? null)
            .finally(() => { _sessionRequest = null })
    }
    return _sessionRequest
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

