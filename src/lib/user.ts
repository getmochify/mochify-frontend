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

// Deduplicate concurrent calls and cache for 5 minutes — /api/usage doesn't
// change mid-session and components call getPlan() on every mount.
let _planRequest: Promise<'free' | 'seller' | 'pro' | 'day'> | null = null
let _planCache: { value: 'free' | 'seller' | 'pro' | 'day'; expires: number } | null = null
const PLAN_TTL = 5 * 60 * 1000

export function getPlan(): Promise<'free' | 'seller' | 'pro' | 'day'> {
    if (_planCache && Date.now() < _planCache.expires) return Promise.resolve(_planCache.value)
    if (!_planRequest) {
        _planRequest = fetch('/api/usage')
            .then(res => res.ok ? res.json() as Promise<{ plan?: string }> : {})
            .then(data => {
                const plan = (data as { plan?: string }).plan
                const value: 'free' | 'seller' | 'pro' | 'day' =
                    plan === 'pro' ? 'pro' : plan === 'seller' ? 'seller' : plan === 'day' ? 'day' : 'free'
                _planCache = { value, expires: Date.now() + PLAN_TTL }
                return value
            })
            .catch(() => 'free' as const)
            .finally(() => { _planRequest = null })
    }
    return _planRequest
}

export function invalidatePlanCache() {
    _planCache = null
}

