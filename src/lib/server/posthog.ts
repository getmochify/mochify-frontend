import { PostHog } from 'posthog-node';
import type { Cookies } from '@sveltejs/kit';
import { PUBLIC_POSTHOG_PROJECT_TOKEN, PUBLIC_POSTHOG_HOST } from '$env/static/public';

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog {
	if (!posthogClient) {
		posthogClient = new PostHog(PUBLIC_POSTHOG_PROJECT_TOKEN, {
			host: PUBLIC_POSTHOG_HOST,
			flushAt: 1,
			flushInterval: 0
		});
	}
	return posthogClient;
}

/**
 * The browser's PostHog id, so an anonymous Day Pass purchase stitches onto the
 * session that led to it. posthog-js keeps it in its own cookie; reading it is
 * the only way to attribute a server-side event for a caller with no account.
 * Falls back to `anonymous`, matching the webhook's own unresolved-buyer events.
 */
export function posthogDistinctId(cookies: Cookies, userId?: string): string {
	if (userId) return userId;
	const raw = cookies.get(`ph_${PUBLIC_POSTHOG_PROJECT_TOKEN}_posthog`);
	if (raw) {
		try {
			const id = (JSON.parse(raw) as { distinct_id?: string }).distinct_id;
			if (id) return id;
		} catch {
			/* fall through */
		}
	}
	return 'anonymous';
}
