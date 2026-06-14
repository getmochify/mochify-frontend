import { posthog } from '$lib/analytics';
import { PUBLIC_POSTHOG_PROJECT_TOKEN, PUBLIC_POSTHOG_HOST } from '$env/static/public';
import { isDynamicImportError, recoverFromStaleChunk } from '$lib/chunkRecovery';
import type { HandleClientError } from '@sveltejs/kit';

export async function init() {
	posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
		api_host: PUBLIC_POSTHOG_HOST, // t.mochify.app reverse proxy
		ui_host: 'https://eu.posthog.com', // required with a proxy so in-app links resolve to PostHog
		defaults: '2026-01-30',
		person_profiles: 'identified_only',
		capture_exceptions: false,
		capture_performance: false,
		disable_session_recording: true
	});
}

export const handleError: HandleClientError = async ({ error, status, message }) => {
	// A failed route-chunk import is almost always a client on a stale build after
	// a deploy — reload once to recover instead of reporting it as a real error.
	if (isDynamicImportError(error) && recoverFromStaleChunk()) {
		return { message, status };
	}
	posthog.captureException(error);
	return { message, status };
};
