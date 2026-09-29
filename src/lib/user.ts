import { authClient } from '$lib/auth-client'

// Anonymous callers get a 3-op/month bucket keyed on hashed IP, seeded by
// mochify-core's TokenLimiter (`anonQuota` in filters/TokenLimiter.cc). Keep in
// step with that constant and with ANON_QUOTA in mochify-worker.
export const GUEST_QUOTA = 3

/** Shape of the /v1/usage response we care about. */
export type UsageResponse = { remaining?: number; available?: boolean }

/**
 * Resolve the remaining-operations count from a /v1/usage payload.
 *
 * Two corrections live here so every caller gets them:
 *
 * 1. An unseeded bucket reports no `remaining` at all. That resolves to Infinity
 *    so a first-time user is never walled by a count we don't actually have —
 *    server 429s stay the source of truth.
 * 2. Guests are clamped to GUEST_QUOTA. /v1/usage used to resolve an unseeded
 *    anonymous IP to the free *plan's* quota (25), so a first-time visitor was
 *    shown "25 tokens available" by the endpoint that reports quota while the
 *    endpoint that enforces it cut them off at 3. The worker now reports 3, and
 *    this clamp keeps the UI honest against any deploy that doesn't — it's a
 *    no-op when the server is right, since min(n, 3) === n for a real guest count.
 */
export function resolveRemaining(data: UsageResponse, isGuest: boolean): number {
    const reported = data.remaining ?? (data.available !== false ? Infinity : 0)
    return isGuest ? Math.min(reported, GUEST_QUOTA) : reported
}

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

export type Plan = 'free' | 'seller' | 'pro' | 'day' | 'growth'

/**
 * The plan and the monthly operation allowance that goes with it.
 *
 * `quota` is the server's number, not a copy of the pricing table. /api/usage
 * already returns it beside `plan` (see lib/server/usage.ts), sourced from the
 * tokens worker, which reads `profile.ops_limit` before falling back to its own
 * PLAN_LIMITS. Mirroring that ladder on the client meant two things: it drifted
 * from pricing whenever a tier changed, and it could not see a per-account
 * override at all — an account on a custom limit was shown the stock number for
 * its plan. Read it from the response instead.
 */
export type PlanSnapshot = { plan: Plan; quota: number }

/** Only for a response that arrives without a usable quota; the server owns this number. */
const FALLBACK_QUOTA = 25

// Deduplicate concurrent calls and cache for 5 minutes — /api/usage doesn't
// change mid-session and components call getPlan() on every mount.
let _planRequest: Promise<PlanSnapshot> | null = null
let _planCache: { value: PlanSnapshot; expires: number } | null = null
const PLAN_TTL = 5 * 60 * 1000

export function getPlanSnapshot(): Promise<PlanSnapshot> {
    if (_planCache && Date.now() < _planCache.expires) return Promise.resolve(_planCache.value)
    if (!_planRequest) {
        _planRequest = fetch('/api/usage')
            .then(res => res.ok ? res.json() as Promise<{ plan?: string; quota?: number }> : {})
            .then(data => {
                const raw = (data as { plan?: string; quota?: number })
                const plan: Plan =
                    raw.plan === 'pro' ? 'pro' : raw.plan === 'seller' ? 'seller' : raw.plan === 'day' ? 'day' : raw.plan === 'growth' ? 'growth' : 'free'
                const quota =
                    typeof raw.quota === 'number' && Number.isFinite(raw.quota) && raw.quota > 0
                        ? raw.quota
                        : FALLBACK_QUOTA
                const value: PlanSnapshot = { plan, quota }
                _planCache = { value, expires: Date.now() + PLAN_TTL }
                return value
            })
            // Deliberately not cached: a failed lookup should be retried by the
            // next caller rather than pinning everyone to free for the TTL.
            .catch(() => ({ plan: 'free', quota: FALLBACK_QUOTA }) as PlanSnapshot)
            .finally(() => { _planRequest = null })
    }
    return _planRequest
}

export function getPlan(): Promise<Plan> {
    return getPlanSnapshot().then(snapshot => snapshot.plan)
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

// Google Drive connection state. Same dedupe-and-cache shape as the bucket,
// for the same reason: the compose bar asks on every mount and the answer
// changes about once in the life of an account.
export type DriveState = {
    connected: boolean
    email: string | null
    folderName: string
    status: 'unverified' | 'ok' | 'error'
}

const DRIVE_DISCONNECTED: DriveState = {
    connected: false,
    email: null,
    folderName: 'Mochify',
    status: 'unverified',
}

let _driveRequest: Promise<DriveState> | null = null
let _driveCache: { value: DriveState; expires: number } | null = null
const DRIVE_TTL = 5 * 60 * 1000

export function getDriveConnection(): Promise<DriveState> {
    if (_driveCache && Date.now() < _driveCache.expires) return Promise.resolve(_driveCache.value)
    if (!_driveRequest) {
        _driveRequest = fetch('/api/drive')
            .then(res => res.ok ? res.json() as Promise<Partial<DriveState>> : {} as Partial<DriveState>)
            .then(data => {
                const value: DriveState = {
                    connected: data.connected === true,
                    email: data.email ?? null,
                    folderName: data.folderName ?? 'Mochify',
                    status: data.status === 'ok' ? 'ok' : data.status === 'error' ? 'error' : 'unverified',
                }
                _driveCache = { value, expires: Date.now() + DRIVE_TTL }
                return value
            })
            .catch(() => DRIVE_DISCONNECTED)
            .finally(() => { _driveRequest = null })
    }
    return _driveRequest
}

export function invalidateDriveCache() {
    _driveCache = null
}

/**
 * Drop every per-user cache above. Call this whenever the signed-in identity
 * changes WITHOUT a full page load.
 *
 * These caches live in module scope, so a real navigation re-evaluates the
 * module and clears them for free — which is why sign-out (window.location),
 * Google sign-in and registration (both callbackURL) never needed this. Email
 * sign-in is the one transition that stays in the SPA: it calls invalidateAll()
 * and goto(), and invalidateAll only re-runs SvelteKit `load` functions, which
 * these caches are not. Without this call, a visitor who browsed signed-out
 * seeded _planCache with 'free' and then kept free-tier limits for the rest of
 * the 5-minute TTL: ImageUpload showed "batches up to 3" and a usage badge
 * reading the real paid remaining over the free quota ("300 / 25"), until a
 * manual refresh.
 */
export function resetUserCaches() {
    invalidatePlanCache()
    invalidateBucketCache()
    invalidateDriveCache()
}

