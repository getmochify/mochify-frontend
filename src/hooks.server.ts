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

	let session = null;
	if (sessionToken) {
		const kv = event.platform?.env?.USAGE_KV;
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
