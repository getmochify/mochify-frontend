import { env } from '$env/dynamic/private'
import type { RequestHandler } from './$types'

const WORKER_URL = env.CF_WORKER_URL || 'https://id.mochify.app'

// Bucket connection summary for the app surface.
//
// PromptFormApp needs to know whether a "save to bucket" control is worth
// showing, which is a question about the connection rather than the plan: a
// verified connection can only exist for an account that was entitled to make
// one. Returns the display fields only — never the credentials, and never the
// masked key, which the compose bar has no use for.
export const GET: RequestHandler = async ({ locals, platform }) => {
    if (!locals.user) return Response.json({ connected: false })

    try {
        const target = `${WORKER_URL}/user/${locals.user.id}/bucket`
        const req = new Request(target, {
            headers: { 'X-Worker-Token': env.CF_WORKER_TOKEN ?? '' },
        })
        // Prefer the in-network service binding over a public round-trip, same
        // reasoning as /api/usage.
        const res = platform?.env?.TOKENS
            ? await platform.env.TOKENS.fetch(req)
            : await fetch(req)

        if (res.ok) {
            const body = (await res.json()) as {
                connected?: boolean
                bucket?: string
                prefix?: string
                status?: string
            }
            return Response.json({
                connected: body.connected ?? false,
                bucket: body.bucket ?? null,
                prefix: body.prefix ?? '',
                status: body.status ?? 'unverified',
            })
        }
    } catch (e) {
        console.error('[api/bucket] lookup failed:', e)
    }

    // Degrade to "no bucket" rather than erroring: the compose bar should still
    // work perfectly well without this control.
    return Response.json({ connected: false })
}
