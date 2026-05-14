import { PUBLIC_POSTHOG_HOST } from '$env/static/public';
import type { RequestHandler } from './$types';

const POSTHOG_HOST = PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

const STRIP_HEADERS = ['cookie', 'authorization', 'host', 'x-forwarded-for', 'x-real-ip'];

async function proxy(request: Request, path: string): Promise<Response> {
    const url = new URL(request.url);
    const target = `${POSTHOG_HOST}/${path}${url.search}`;

    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
        if (!STRIP_HEADERS.includes(key.toLowerCase())) {
            headers.set(key, value);
        }
    }

    return fetch(target, {
        method: request.method,
        headers,
        body: request.method !== 'GET' && request.method !== 'HEAD'
            ? await request.arrayBuffer()
            : undefined,
    });
}

export const GET: RequestHandler = ({ request, params }) =>
    proxy(request, params.path);

export const POST: RequestHandler = ({ request, params }) =>
    proxy(request, params.path);
