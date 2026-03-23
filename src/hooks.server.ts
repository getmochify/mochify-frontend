import type { Handle } from "@sveltejs/kit";
import { building } from "$app/environment";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { createAuth } from "$lib/auth";

type Auth = ReturnType<typeof createAuth>;
let _auth: Auth | undefined;

function getAuth(db: D1Database): Auth {
    if (!_auth) _auth = createAuth(db);
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
        const response = await resolve(event);
        response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
        response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
        return response;
    }

    const auth = getAuth(db);

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
                const cached = await kv.get(`sc:${sessionToken}`, 'json') as typeof session;
                if (cached) session = cached;
            } catch { /* ignore cache errors */ }
        }

        if (!session) {
            try {
                session = await auth.api.getSession({ headers: event.request.headers });
                if (session && kv && !isAuthRoute) {
                    await kv.put(`sc:${sessionToken}`, JSON.stringify(session), { expirationTtl: 300 }).catch(() => {});
                }
            } catch (e) {
                console.error("[auth] getSession failed:", e);
            }
        }
    }
    event.locals.user = session?.user ?? null;
    event.locals.session = session?.session ?? null;

    const response = await svelteKitHandler({ event, resolve, auth, building });

    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    return response;
};
