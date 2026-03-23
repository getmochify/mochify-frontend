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

    const hasCookie = event.request.headers.get('cookie')?.includes('better-auth.session_token');

    let session = null;
    if (hasCookie) {
        try {
            session = await auth.api.getSession({ headers: event.request.headers });
        } catch (e) {
            console.error("[auth] getSession failed:", e);
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
