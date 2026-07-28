import { posthog } from '$lib/analytics';
import { PUBLIC_POSTHOG_PROJECT_TOKEN, PUBLIC_POSTHOG_HOST } from '$env/static/public';
import { isChunkLoadError, recoverFromStaleChunk } from '$lib/chunkRecovery';
import type { HandleClientError } from '@sveltejs/kit';
import type { CaptureResult } from 'posthog-js';

export async function init() {
	posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
		api_host: PUBLIC_POSTHOG_HOST, // t.mochify.app reverse proxy
		ui_host: 'https://eu.posthog.com', // required with a proxy so in-app links resolve to PostHog
		defaults: '2026-01-30',
		person_profiles: 'identified_only',
		capture_exceptions: false,
		capture_performance: false,
		disable_session_recording: true,
		// Google OAuth returns via accounts.google.com, which PostHog would
		// otherwise record as the referrer — polluting acquisition sources and
		// starting a new session that makes one returning login look like a fresh
		// referred visit. No one organically arrives from accounts.google.com, so
		// rewriting just that referrer to direct is safe (real google.com search
		// traffic is untouched).
		before_send: (event: CaptureResult | null) => {
			const props = event?.properties;
			if (props && props.$referring_domain === 'accounts.google.com') {
				props.$referring_domain = '$direct';
				props.$referrer = '$direct';
			}
			return event;
		}
	});
}

export const handleError: HandleClientError = async ({ error, status, message }) => {
	// A failed route-chunk import is almost always a client on a stale build after
	// a deploy — reload once to recover instead of reporting it as a real error.
	// Use the broad matcher: Safari surfaces a failed route-module fetch during
	// client navigation as a generic "Load failed", which the narrow
	// isDynamicImportError misses — leaving Safari users with a dead link click
	// while Chrome/Firefox self-heal. The 30s cooldown in recoverFromStaleChunk
	// bounds the rare false positive (e.g. a load() fetch failure) to one reload.
	if (isChunkLoadError(error) && recoverFromStaleChunk()) {
		return { message, status };
	}
	posthog.captureException(error);
	return { message, status };
};
