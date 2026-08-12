import { env } from '$env/dynamic/private'

const WORKER_URL = env.CF_WORKER_URL || 'https://id.mochify.app'

/**
 * Call the tokens worker (id.mochify.app) from server-side code.
 *
 * Prefers the in-network TOKENS service binding over a public fetch. Both run
 * inside our own Worker, so a plain `fetch()` to the public hostname leaves
 * Cloudflare's network and comes back in — DNS, TLS, a full edge hop — to reach
 * a Worker sitting next to us. The binding is a direct in-network call.
 * Measured on /api/usage: ~300-600ms public vs ~70ms bound.
 *
 * The fallback is NOT dead code and must stay: `platform` is undefined under a
 * plain `vite dev` (no workerd), so local development depends on it. It is
 * unreachable in production, where TOKENS is bound in wrangler.jsonc.
 *
 * Deliberately does not inject X-Worker-Token — callers pass their own headers,
 * because not every route on the worker is behind that gate (the CLI session
 * deposit is public, guarded by its own 256-bit state token instead).
 */
export function tokensFetch(
	platform: App.Platform | undefined,
	path: string,
	init: RequestInit = {},
): Promise<Response> {
	const req = new Request(`${WORKER_URL}${path}`, init)
	return platform?.env?.TOKENS ? platform.env.TOKENS.fetch(req) : fetch(req)
}
