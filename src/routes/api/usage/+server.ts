import { env } from '$env/dynamic/private'
import type { RequestHandler } from './$types'

const WORKER_URL = env.CF_WORKER_URL || 'https://tokens.mochify.app'
const FREE_QUOTA = 25

export const GET: RequestHandler = async ({ locals, request }) => {
    const headers: Record<string, string> = {
        'CF-Connecting-IP': request.headers.get('CF-Connecting-IP') ?? '',
    }
    if (locals.session) {
        headers['Authorization'] = `Bearer ${locals.session.token}`
    }

    try {
        const workerRes = await fetch(`${WORKER_URL}/v1/usage`, { headers })
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
        // Worker unreachable — return safe defaults.
    }

    return Response.json({ used: 0, remaining: FREE_QUOTA, quota: FREE_QUOTA, plan: 'free', updatedAt: null })
}
