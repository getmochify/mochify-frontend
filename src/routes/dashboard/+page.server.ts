import { fail, redirect } from '@sveltejs/kit'
import { Polar } from '@polar-sh/sdk'
import { env } from '$env/dynamic/private'
import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'
import { mirrorMarketingConsent, removeContact } from '$lib/server/resendContacts'
import type { PageServerLoad } from './$types'

const WORKER_URL = env.CF_WORKER_URL || 'https://id.mochify.app'

// All key CRUD (status read + generate/regenerate) goes to the tokens worker, not
// core (Frankfurt). We already hold locals.user.id here and vouch for it with
// X-Worker-Token — the same trust model the extension/CLI key flows use — so there
// is no need to round-trip a Bearer session out to Frankfurt. Core only ever
// proxied these to the same worker anyway. Prefer the in-network TOKENS service
// binding (RPC, no public hop) and fall back to a public fetch until it's bound.
function callWorker(platform: App.Platform | undefined, path: string, init: RequestInit = {}) {
    const headers = {
        ...(init.headers as Record<string, string> | undefined),
        'X-Worker-Token': env.CF_WORKER_TOKEN ?? '',
    }
    const req = new Request(`${WORKER_URL}${path}`, { ...init, headers })
    return platform?.env?.TOKENS ? platform.env.TOKENS.fetch(req) : fetch(req)
}

// Generate "mchy_" + hex(24 random bytes) = 53-char opaque key, matching core's
// historical format and the public docs. The stored hash is SHA-256 over the full
// string (prefix included) — exactly what the squish hot path hashes to validate.
// Only the hash reaches the worker; the plaintext is returned to the caller once.
async function issueKey(platform: App.Platform | undefined, userId: string): Promise<string | null> {
    const rawBytes = crypto.getRandomValues(new Uint8Array(24))
    const key = 'mchy_' + Array.from(rawBytes).map((b) => b.toString(16).padStart(2, '0')).join('')
    const hashBuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
    const keyHash = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('')
    const res = await callWorker(platform, `/apikey/${keyHash}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    })
    return res.ok ? key : null
}

// Shape the worker returns for a bucket connection. The secret is never part
// of this — only a masked hint of the access key id.
export interface BucketConnection {
    connected: boolean
    label?: string
    provider?: 's3' | 'r2' | 'compatible'
    endpoint?: string | null
    bucket?: string
    region?: string
    prefix?: string
    forcePathStyle?: boolean
    accessKeyIdMasked?: string
    status?: 'unverified' | 'ok' | 'error'
    statusDetail?: string | null
    lastVerifiedAt?: string | null
}

const PAID_PLANS = new Set(['seller', 'pro', 'day', 'growth'])

// Bucket connections are a paid feature. The dashboard hides the card for free
// users, but that is cosmetic — every mutating action re-checks the plan here,
// because a form POST does not care what the client rendered.
async function assertPaid(platform: App.Platform | undefined, userId: string): Promise<boolean> {
    const db = platform?.env?.DB
    if (!db) return false
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) })
        const row = await kysely
            .selectFrom('profile')
            .select(['plan'])
            .where('user_id', '=', userId)
            .executeTakeFirst()
        return PAID_PLANS.has(row?.plan ?? 'free')
    } catch (e) {
        console.error('[dashboard] plan check failed:', e)
        return false
    }
}

// The worker answers some failures with plain text — 'Unauthorized' on a token
// mismatch, 'Not found' on an unrouted path, and a bare message when a handler
// throws. Calling res.json() on those raises a SyntaxError, which the callers'
// catch blocks then report as "could not reach the storage service", hiding a
// service that was reached and had something useful to say. Read text first.
async function workerJson(
    res: Response,
): Promise<{ data: Record<string, unknown>; raw: string | null }> {
    const raw = await res.text()
    try {
        return { data: JSON.parse(raw) as Record<string, unknown>, raw: null }
    } catch {
        return { data: {}, raw: raw.slice(0, 120) }
    }
}

// Keep the HTTP status in the message. It is the difference between "the route
// is not deployed" (404), "the tokens are mismatched" (401), and "the handler
// blew up" (500) — three very different fixes that otherwise look identical.
function workerError(res: Response, data: Record<string, unknown>, raw: string | null): string {
    if (typeof data.error === 'string') return data.error
    return `Storage service error (HTTP ${res.status})${raw ? `: ${raw}` : ''}`
}

async function loadBucket(
    platform: App.Platform | undefined,
    userId: string,
): Promise<BucketConnection> {
    try {
        const res = await callWorker(platform, `/user/${userId}/bucket`)
        const { data, raw } = await workerJson(res)
        if (res.ok) return data as unknown as BucketConnection
        // Degrade to "not connected" so the dashboard still renders, but say
        // why in the logs — a silent 404 here means the routes are not deployed.
        console.error('[dashboard] bucket status load rejected:', res.status, raw ?? data)
    } catch (e) {
        console.error('[dashboard] bucket status load failed:', e)
    }
    return { connected: false }
}

// API-key status: the worker returns the same { has_key, created_at } core proxied,
// so the card renders from server data with no client round-trip. The bucket
// connection is fetched alongside it — two independent worker calls, so they run
// concurrently rather than stacking their latency.
export const load: PageServerLoad = async ({ locals, platform }) => {
    if (!locals.user) return { hasKey: false, keyCreatedAt: null, bucket: { connected: false } }

    const userId = locals.user.id
    const [keyResult, bucket] = await Promise.all([
        (async () => {
            try {
                const res = await callWorker(platform, `/user/${userId}/apikey`)
                if (res.ok) {
                    const body = (await res.json()) as { has_key?: boolean; created_at?: string | null }
                    return { hasKey: body.has_key ?? false, keyCreatedAt: body.created_at ?? null }
                }
            } catch (e) {
                console.error('[dashboard] apikey status load failed:', e)
            }
            return { hasKey: false, keyCreatedAt: null }
        })(),
        loadBucket(platform, userId),
    ])

    return { ...keyResult, bucket }
}

export const actions = {
    // Issue a new API key. Refuses if one already exists (mirrors core's old 409)
    // so the caller regenerates instead — a bare re-PUT would orphan the previous
    // key's KV entry, leaving it valid until its cache TTL expires.
    generateKey: async ({ locals, platform }) => {
        if (!locals.user) return fail(401, { error: 'Not authenticated' })

        const statusRes = await callWorker(platform, `/user/${locals.user.id}/apikey`)
        if (statusRes.ok) {
            const s = (await statusRes.json()) as { has_key?: boolean; created_at?: string | null }
            if (s.has_key) {
                return fail(409, { error: 'A key already exists. Regenerate to replace it.' })
            }
        }

        const key = await issueKey(platform, locals.user.id)
        if (!key) return fail(502, { error: 'Could not generate a key. Try again.' })
        return { apiKey: key, createdAt: new Date().toISOString() }
    },

    // Revoke-then-issue. The DELETE evicts the old key's KV entry (a bare re-PUT
    // would leave it valid for up to the worker's 24h cache TTL); then a fresh key
    // is minted. D1's INSERT OR REPLACE keeps it one-key-per-user.
    regenerateKey: async ({ locals, platform }) => {
        if (!locals.user) return fail(401, { error: 'Not authenticated' })

        await callWorker(platform, `/user/${locals.user.id}/apikey`, { method: 'DELETE' }).catch(() => {})

        const key = await issueKey(platform, locals.user.id)
        if (!key) return fail(502, { error: 'Could not regenerate the key. Try again.' })
        return { apiKey: key, createdAt: new Date().toISOString() }
    },

    // Third-party AI consent toggle. Privacy-first: stored explicitly per user,
    // default off. Upserts because free users may not have a profile row yet —
    // a new row seeds free defaults, an existing row only touches the consent
    // columns so a paid user's plan/limits are never disturbed.
    setAiOptin: async ({ request, locals, platform }) => {
        if (!locals.user) return fail(401, { error: 'Not authenticated' })

        const db = platform?.env?.DB
        if (!db) return fail(500, { error: 'Database unavailable' })

        const form = await request.formData()
        const optin = form.get('optin') === '1' ? 1 : 0
        const now = Date.now()
        const at = new Date().toISOString()

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) })
            await kysely
                .insertInto('profile')
                .values({
                    user_id: locals.user.id,
                    plan: 'free',
                    polar_subscription_id: null,
                    polar_customer_id: null,
                    quota_period_end: null,
                    ops_limit: 25,
                    ai_thirdparty_optin: optin,
                    ai_thirdparty_optin_at: at,
                    created_at: now,
                    updated_at: now,
                })
                .onConflict((oc) =>
                    oc.column('user_id').doUpdateSet({
                        ai_thirdparty_optin: optin,
                        ai_thirdparty_optin_at: at,
                        updated_at: now,
                    })
                )
                .execute()
        } catch (e) {
            console.error('[dashboard] setAiOptin failed:', e)
            return fail(500, { error: 'Could not save your preference' })
        }

        return { success: true, optin }
    },

    // Marketing email preference. Note the inverted polarity against setAiOptin:
    // the AI consent is opt-IN (default off, because sending images to a third
    // party needs affirmative consent), while this is opt-OUT (default on, under
    // PECR reg 22 soft opt-in, which grants a right to refuse rather than
    // requiring consent up front). Same upsert reasoning as above: free users may
    // have no profile row, and an existing row must only have the one column
    // touched so a paid user's plan and limits are never disturbed.
    setMarketingOptOut: async ({ request, locals, platform }) => {
        if (!locals.user) return fail(401, { error: 'Not authenticated' })

        const db = platform?.env?.DB
        if (!db) return fail(500, { error: 'Database unavailable' })

        const form = await request.formData()
        const optOut = form.get('opt_out') === '1' ? 1 : 0
        const now = Date.now()

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) })
            await kysely
                .insertInto('profile')
                .values({
                    user_id: locals.user.id,
                    plan: 'free',
                    polar_subscription_id: null,
                    polar_customer_id: null,
                    quota_period_end: null,
                    ops_limit: 25,
                    marketing_opt_out: optOut,
                    created_at: now,
                    updated_at: now,
                })
                .onConflict((oc) =>
                    oc.column('user_id').doUpdateSet({
                        marketing_opt_out: optOut,
                        updated_at: now,
                    })
                )
                .execute()
        } catch (e) {
            console.error('[dashboard] setMarketingOptOut failed:', e)
            return fail(500, { error: 'Could not save your preference' })
        }

        // Mirror onto the Resend contact so a broadcast honours the toggle that
        // was just flipped here. Deliberately after the D1 write and not part of
        // its try: D1 is the source of truth and already gates our own sending,
        // so a Resend failure logs and leaves the mirror to the next change.
        await mirrorMarketingConsent(db, platform?.env?.RESEND_API_KEY, locals.user.id, optOut === 1)

        return { success: true, optOut }
    },

    // Save (create or update) the bucket connection. The plaintext secret passes
    // through this worker in memory on its way to the tokens worker, which owns
    // the encryption key — it is never written to D1 from here and never logged.
    // A blank secret on an update means "keep the existing one", so editing a
    // prefix does not force the user to re-enter their key.
    saveBucket: async ({ request, locals, platform }) => {
        if (!locals.user) return fail(401, { error: 'Not authenticated' })
        if (!(await assertPaid(platform, locals.user.id))) {
            return fail(403, { error: 'Bucket connections are available on paid plans.' })
        }

        const form = await request.formData()
        const payload = {
            label: String(form.get('label') ?? ''),
            provider: String(form.get('provider') ?? ''),
            endpoint: String(form.get('endpoint') ?? ''),
            region: String(form.get('region') ?? ''),
            bucket: String(form.get('bucket') ?? ''),
            prefix: String(form.get('prefix') ?? ''),
            forcePathStyle: form.get('forcePathStyle') === 'on',
            accessKeyId: String(form.get('accessKeyId') ?? ''),
            secretAccessKey: String(form.get('secretAccessKey') ?? ''),
        }

        try {
            const res = await callWorker(platform, `/user/${locals.user.id}/bucket`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const { data, raw } = await workerJson(res)
            if (!res.ok) {
                console.error('[dashboard] saveBucket rejected:', res.status, raw ?? data)
                return fail(res.status === 400 ? 400 : 502, { error: workerError(res, data, raw) })
            }
            return { bucket: data as unknown as BucketConnection }
        } catch (e) {
            console.error('[dashboard] saveBucket failed:', e)
            return fail(502, { error: 'Could not reach the storage service. Try again.' })
        }
    },

    // Re-run the probes against the stored credentials.
    verifyBucket: async ({ locals, platform }) => {
        if (!locals.user) return fail(401, { error: 'Not authenticated' })
        if (!(await assertPaid(platform, locals.user.id))) {
            return fail(403, { error: 'Bucket connections are available on paid plans.' })
        }

        try {
            const res = await callWorker(platform, `/user/${locals.user.id}/bucket/verify`, {
                method: 'POST',
            })
            const { data, raw } = await workerJson(res)
            if (!res.ok) {
                console.error('[dashboard] verifyBucket rejected:', res.status, raw ?? data)
                return fail(502, { error: workerError(res, data, raw) })
            }
            return { bucket: data as unknown as BucketConnection }
        } catch (e) {
            console.error('[dashboard] verifyBucket failed:', e)
            return fail(502, { error: 'Could not reach the storage service. Try again.' })
        }
    },

    // Disconnect. No plan check: a downgraded user must always be able to
    // remove credentials we hold for them.
    disconnectBucket: async ({ locals, platform }) => {
        if (!locals.user) return fail(401, { error: 'Not authenticated' })
        try {
            await callWorker(platform, `/user/${locals.user.id}/bucket`, { method: 'DELETE' })
        } catch (e) {
            console.error('[dashboard] disconnectBucket failed:', e)
            return fail(502, { error: 'Could not disconnect. Try again.' })
        }
        return { bucket: { connected: false } as BucketConnection }
    },

    // Soft delete with a 14-day grace period. The user row (and its email) is
    // kept so re-registering with the same address can't reset usage limits;
    // logging in again within the window cancels the deletion (see the session
    // databaseHook in $lib/auth.ts). The daily cron in mochify-worker purges
    // rows once deleted_at is older than 14 days.
    deleteAccount: async ({ locals, platform }) => {
        if (!locals.user) return fail(401, { error: 'Not authenticated' })

        const polar = new Polar({
            accessToken: env.POLAR_ACCESS_TOKEN,
            ...(env.POLAR_SANDBOX === 'true' ? { server: 'sandbox' } : {})
        })

        // Billing stops at the moment of the delete click, not at purge time.
        try {
            const subs = await polar.subscriptions.list({ customerId: locals.user.id, limit: 1 })
            const sub = subs.result.items[0]
            if (sub) await polar.subscriptions.revoke({ id: sub.id })
        } catch {
            // Not subscribed or Polar unreachable — proceed with deletion.
        }

        // Storage credentials die now, not in 14 days. The rest of the account
        // is recoverable by signing back in; live keys to someone else's bucket
        // are not something to hold on to for a deactivated account. The purge
        // cron re-runs this delete in case the call below fails.
        await callWorker(platform, `/user/${locals.user.id}/bucket`, { method: 'DELETE' }).catch(
            (e) => console.error('[dashboard] bucket credential wipe on delete failed:', e)
        )

        const db = platform?.env?.DB
        if (!db) return fail(500, { error: 'Database unavailable' })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) })
        await kysely
            .updateTable('user')
            .set({ deleted_at: Date.now() })
            .where('id', '=', locals.user.id)
            .execute()
        // The hard delete revoked sessions via cascade; the soft delete must do
        // it explicitly so the user is signed out everywhere.
        await kysely.deleteFrom('session').where('userId', '=', locals.user.id).execute()

        // Drop them from the Resend contact list now, not at purge time. The
        // account survives 14 days so usage limits can't be reset by re-signup,
        // but that is no reason to leave the address sitting in a third party's
        // marketing list after someone asked to be deleted. Signing back in
        // during the grace window re-adds it (see the session hook in auth.ts).
        await removeContact(platform?.env?.RESEND_API_KEY, locals.user.email)

        // Purge KV session cache so the cookie is immediately invalid.
        const kv = platform?.env?.USAGE_KV
        const sessionToken = locals.session?.token
        if (kv && sessionToken) await kv.delete(`sc:${sessionToken}`).catch(() => {})

        throw redirect(303, '/?deleted=true')
    }
}
