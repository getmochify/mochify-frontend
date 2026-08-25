import type { Handle, HandleServerError } from '@sveltejs/kit';
import { building } from '$app/environment';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { createAuth } from '$lib/auth';
import { getPostHogClient } from '$lib/server/posthog';

// Prerendered routes (/, /docs, etc.) are served as static assets and never hit this
// hook, so the root _headers file duplicates this Link value — keep the two in sync.
const DISCOVERY_LINK_HEADER = [
	'<https://mochify.app/sitemap.xml>; rel="sitemap"',
	'<https://mochify.app/.well-known/api-catalog>; rel="api-catalog"',
	'<https://mochify.app/docs>; rel="service-doc"'
].join(', ');

/**
 * SvelteKit ships this page's `modulepreload`/stylesheet/font hints in the `Link`
 * header on server-rendered routes (it only inlines them as `<link>` tags when
 * prerendering). `set()` here would drop every one of them, leaving SSR routes
 * — /contact, /pricing, /auth/* — with no resource hints at all: the browser
 * discovers start.js → app.js → the route chunk only by executing the inline
 * bootstrap, so they load as a cold serial waterfall. Safari fails that first
 * cold route fetch often enough that `handleError` in hooks.client.ts treated it
 * as a stale chunk and reloaded the page. Append, never set.
 */
function setSecurityHeaders(response: Response): Response {
	response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.append('Link', DISCOVERY_LINK_HEADER);
	return response;
}

type Auth = ReturnType<typeof createAuth>;
let _auth: Auth | undefined;

function getAuth(db: D1Database, resendKey: string | undefined): Auth {
	if (!_auth) _auth = createAuth(db, resendKey);
	return _auth;
}

export const handle: Handle = async ({ event, resolve }) => {
	let db: D1Database | undefined;
	try {
		db = event.platform?.env?.DB;
	} catch {
		db = undefined;
	}

	if (!db) {
		// Prerendering or local dev without platform bindings — skip auth.
		event.locals.user = null;
		event.locals.session = null;
		return setSecurityHeaders(await resolve(event));
	}

	const auth = getAuth(db, event.platform?.env?.RESEND_API_KEY);

	const cookieHeader = event.request.headers.get('cookie') ?? '';
	const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
	const sessionToken = tokenMatch?.[1];
	const kv = event.platform?.env?.USAGE_KV;

	// better-auth's SvelteKit adapter (svelteKitHandler, invoked below) routes any
	// `/api/auth/*` request straight to `auth.handler(request)` and returns that
	// Response without ever calling `resolve(event)`. That means `event.locals`,
	// populated further down for `load` functions, is never consulted for auth-API
	// requests — so narrowing the `isAuthRoute` exclusion below would NOT get
	// GET /api/auth/get-session onto the KV fast path; it would just populate an
	// `event.locals` nobody reads while `auth.handler()` still runs its own,
	// separate D1-backed session lookup for the response body. Confirmed by
	// reading node_modules/better-auth/dist/integrations/svelte-kit.mjs
	// (`svelteKitHandler`) and dist/api/routes/session.mjs (`getSession()`, which
	// always hits `ctx.context.internalAdapter.findSession` because this app
	// doesn't enable better-auth's own `session.cookieCache`).
	//
	// So get-session gets its own short-circuit instead: on a KV cache hit for
	// this exact route, answer directly from the cache and skip `svelteKitHandler`
	// (and therefore `auth.handler()` and D1) entirely. `auth.api.getSession()`
	// and the HTTP `/get-session` route both dispatch to the identical endpoint
	// definition (see getEndpoints() in dist/api/index.mjs), so the object already
	// cached below under `sc:<token>` is byte-identical, once JSON-serialized, to
	// what a live response body would contain — safe to replay verbatim.
	//
	// Only ever short-circuits on a HIT. On a miss, fall through to the ordinary
	// `isAuthRoute` bypass and let `auth.handler()` do the authoritative lookup —
	// duplicating that lookup here just to warm the cache would reintroduce a
	// second D1 query on every miss. In practice the cache is already warm almost
	// always: the SSR render of whatever page triggered this client-side call
	// populates the same `sc:<token>` entry moments earlier via the fast path below.
	//
	// Staleness/invalidation: identical tradeoff to every other KV-cached page.
	// Sign-out clears the cookie, so the (cookie-less) next request can't replay a
	// stale hit. A session revoked from another device (or via better-auth's own
	// revoke-session/revoke-other-sessions, which only touch D1) can still read as
	// valid here for up to the 5-minute TTL — deleteAccount is the one path that
	// proactively purges `sc:<token>` (see dashboard/+page.server.ts). No new risk
	// introduced; this route now just shares the risk every other page accepts.
	const isGetSessionRoute =
		event.request.method === 'GET' && event.url.pathname === '/api/auth/get-session';
	if (sessionToken && kv && isGetSessionRoute) {
		try {
			const cached = await kv.get(`sc:${sessionToken}`, 'json');
			if (cached) {
				return setSecurityHeaders(
					new Response(JSON.stringify(cached), {
						headers: {
							'content-type': 'application/json',
							'cache-control': 'no-store',
							pragma: 'no-cache'
						}
					})
				);
			}
		} catch {
			/* ignore cache errors, fall through to the authoritative path */
		}
	}

	let session = null;
	if (sessionToken) {
		const isAuthRoute = event.url.pathname.startsWith('/api/auth/');

		// KV fast path — skip D1 for cached sessions on non-auth routes.
		if (kv && !isAuthRoute) {
			try {
				const cached = (await kv.get(`sc:${sessionToken}`, 'json')) as typeof session;
				if (cached) session = cached;
			} catch {
				/* ignore cache errors */
			}
		}

		if (!session) {
			try {
				session = await auth.api.getSession({ headers: event.request.headers });
				if (session && kv && !isAuthRoute) {
					await kv
						.put(`sc:${sessionToken}`, JSON.stringify(session), { expirationTtl: 300 })
						.catch(() => {});
				}
			} catch (e) {
				console.error('[auth] getSession failed:', e);
			}
		}
	}
	event.locals.user = session?.user ?? null;
	event.locals.session = session?.session ?? null;

	return setSecurityHeaders(await svelteKitHandler({ event, resolve, auth, building }));
};

export const handleError: HandleServerError = async ({ error, status, message }) => {
	try {
		const posthog = getPostHogClient();
		posthog.capture({
			distinctId: 'server',
			event: 'server_error',
			properties: {
				error: error instanceof Error ? error.message : String(error),
				status,
				message
			}
		});
		await posthog.flush();
	} catch {
		/* ignore posthog errors */
	}

	return { message, status };
};
