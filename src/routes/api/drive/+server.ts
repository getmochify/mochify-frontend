import { env } from '$env/dynamic/private'
import type { RequestHandler } from './$types'

const WORKER_URL = env.CF_WORKER_URL || 'https://id.mochify.app'

// Drive connection summary for the app surface.
//
// The twin of /api/bucket, and it answers the same question: is a "save to
// Drive" control worth showing? That is a question about the connection rather
// than the plan — a verified connection can only exist for an account that was
// entitled to make one. Returns display fields only; the folder id and the
// account's tokens have no business in a browser.
export const GET: RequestHandler = async ({ locals, platform }) => {
    if (!locals.user) return Response.json({ connected: false })

    try {
        const req = new Request(`${WORKER_URL}/user/${locals.user.id}/drive`, {
            headers: { 'X-Worker-Token': env.CF_WORKER_TOKEN ?? '' }
        })
        const res = platform?.env?.TOKENS
            ? await platform.env.TOKENS.fetch(req)
            : await fetch(req)

        if (res.ok) {
            const body = (await res.json()) as {
                connected?: boolean
                email?: string | null
                folderName?: string
                status?: string
            }
            return Response.json({
                connected: body.connected ?? false,
                email: body.email ?? null,
                folderName: body.folderName ?? 'Mochify',
                status: body.status ?? 'unverified'
            })
        }
    } catch (e) {
        console.error('[api/drive] lookup failed:', e)
    }

    // Degrade to "not connected" rather than erroring: the compose bar should
    // work perfectly well without this control.
    return Response.json({ connected: false })
}
