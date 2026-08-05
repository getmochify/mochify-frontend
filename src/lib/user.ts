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
let _planRequest: Promise<'free' | 'seller' | 'pro' | 'day' | 'growth'> | null = null
let _planCache: { value: 'free' | 'seller' | 'pro' | 'day' | 'growth'; expires: number } | null = null
const PLAN_TTL = 5 * 60 * 1000

export function getPlan(): Promise<'free' | 'seller' | 'pro' | 'day' | 'growth'> {
    if (_planCache && Date.now() < _planCache.expires) return Promise.resolve(_planCache.value)
    if (!_planRequest) {
        _planRequest = fetch('/api/usage')
            .then(res => res.ok ? res.json() as Promise<{ plan?: string }> : {})
            .then(data => {
                const plan = (data as { plan?: string }).plan
                const value: 'free' | 'seller' | 'pro' | 'day' | 'growth' =
                    plan === 'pro' ? 'pro' : plan === 'seller' ? 'seller' : plan === 'day' ? 'day' : plan === 'growth' ? 'growth' : 'free'
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

// Bucket connection state for the app surface. Same dedupe-and-cache shape as
// getPlan(): components ask on every mount, and the answer changes roughly
// never — a user connects a bucket once and then forgets about it.
export type BucketState = {
    connected: boolean
    bucket: string | null
    prefix: string
    status: 'unverified' | 'ok' | 'error'
}

const DISCONNECTED: BucketState = { connected: false, bucket: null, prefix: '', status: 'unverified' }

let _bucketRequest: Promise<BucketState> | null = null
let _bucketCache: { value: BucketState; expires: number } | null = null
const BUCKET_TTL = 5 * 60 * 1000

export function getBucketConnection(): Promise<BucketState> {
    if (_bucketCache && Date.now() < _bucketCache.expires) return Promise.resolve(_bucketCache.value)
    if (!_bucketRequest) {
        _bucketRequest = fetch('/api/bucket')
            .then(res => res.ok ? res.json() as Promise<Partial<BucketState>> : {} as Partial<BucketState>)
            .then(data => {
                const value: BucketState = {
                    connected: data.connected === true,
                    bucket: data.bucket ?? null,
                    prefix: data.prefix ?? '',
                    status: data.status === 'ok' ? 'ok' : data.status === 'error' ? 'error' : 'unverified',
                }
                _bucketCache = { value, expires: Date.now() + BUCKET_TTL }
                return value
            })
            .catch(() => DISCONNECTED)
            .finally(() => { _bucketRequest = null })
    }
    return _bucketRequest
}

export function invalidateBucketCache() {
    _bucketCache = null
}

