import { PUBLIC_API_URL } from '$env/static/public'
import { env } from '$env/dynamic/private'
import type { RequestHandler } from './$types'

const API_URL = PUBLIC_API_URL || 'https://api.mochify.app'
const WORKER_URL = env.CF_WORKER_URL || 'https://tokens.mochify.app'
const FREE_QUOTA = 25

export const GET: RequestHandler = async ({ locals, request }) => {
    if (!locals.user || !locals.session) {
        // Unauthenticated — proxy to core's IP-based free tier check.
        try {
            const coreRes = await fetch(`${API_URL}/v1/checkTokens`, {
                headers: { 'X-Forwarded-For': request.headers.get('CF-Connecting-IP') ?? '' },
            })
            if (coreRes.ok) {
                const body = await coreRes.json() as { remaining?: number; available?: number }
                const remaining = body.remaining ?? body.available ?? FREE_QUOTA
                const used = Math.max(0, FREE_QUOTA - remaining)
                return Response.json({ used, remaining, quota: FREE_QUOTA, plan: 'free', updatedAt: null })
            }
        } catch {
            // Core unreachable — return full free quota.
        }
        return Response.json({ used: 0, remaining: FREE_QUOTA, quota: FREE_QUOTA, plan: 'free', updatedAt: null })
    }

    // Authenticated — delegate to worker which peeks DO for live count and refreshes KV.
    try {
        const workerRes = await fetch(`${WORKER_URL}/v1/usage`, {
            headers: { Authorization: `Bearer ${locals.session.token}` },
        })
        if (workerRes.ok) {
            const body = await workerRes.json() as { remaining: number; quota: number; plan: string; available: boolean }
            const used = Math.max(0, body.quota - body.remaining)
            return Response.json({
                used,
                remaining: body.remaining,
                quota: body.quota,
                plan: body.plan,
                updatedAt: new Date().toISOString(),
            })
        }
    } catch {
        // Worker unreachable — fall through to safe defaults.
    }

    return Response.json({ used: 0, remaining: FREE_QUOTA, quota: FREE_QUOTA, plan: 'free', updatedAt: null })
}
