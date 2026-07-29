import { env } from '$env/dynamic/private'
import type { RequestHandler } from './$types'

const WORKER_URL = env.CF_WORKER_URL || 'https://tokens.mochify.app'
const FREE_QUOTA = 25

export const GET: RequestHandler = async ({ locals, request, platform }) => {
    const headers: Record<string, string> = {
        'CF-Connecting-IP': request.headers.get('CF-Connecting-IP') ?? '',
    }
    if (locals.session) {
        headers['Authorization'] = `Bearer ${locals.session.token}`
    }

    try {
        const target = `${WORKER_URL}/v1/usage`
        // Prefer the in-network service binding (RPC on Cloudflare's network, no
        // public round-trip) over a public fetch — the latter double-hops out to
        // the edge and back, which measured ~300-600ms vs the worker's own ~70ms.
        // Falls back to the public URL until TOKENS is bound in wrangler, so this
        // is safe to deploy before the binding exists. Same path either way, so
        // the worker routes identically. This endpoint backs getPlan() too, so
        // the speed-up lands on every plan gate (solutions pages, PromptForm).
        const workerRes = platform?.env?.TOKENS
            ? await platform.env.TOKENS.fetch(new Request(target, { headers }))
            : await fetch(target, { headers })
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
