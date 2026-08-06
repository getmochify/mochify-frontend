import { posthog } from '$lib/analytics';
import { PUBLIC_POSTHOG_PROJECT_TOKEN, PUBLIC_POSTHOG_HOST } from '$env/static/public';
import { isChunkLoadError, isDynamicImportError, recoverFromStaleChunk } from '$lib/chunkRecovery';
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

export const handleError: HandleClientError = async ({ error, event, status, message }) => {
	// A failed route-chunk import is almost always a client on a stale build after
	// a deploy — recover once with a full load instead of reporting a real error.
	//
	// Which matcher we may use depends on where we are. During a client-side
	// navigation the failing op really is a route-module import, so the broad
	// matcher is safe and necessary: Safari reports a failed module fetch as a
	// generic "Load failed" that isDynamicImportError misses, leaving Safari users
	// with a dead link click while Chrome/Firefox self-heal. Recover to the
	// destination (event.url) rather than reloading in place, which would just
	// abort the nav and read as a dead first tap.
	//
	// On initial load/hydration we have no such guarantee — "Load failed" is what
	// Safari throws for *any* interrupted fetch (see isNetworkError). Broad-matching
	// there turned an incidental failure into location.assign() on the URL we are
	// already on: a silent, unexplained page refresh, Safari-only, with nothing in
	// the UI to show for it. chunkRecovery documents this limit on isChunkLoadError;
	// honour it and require a genuine dynamic-import error during hydration.
	//
	// SvelteKit only commits the history entry after a load resolves, so on a failed
	// navigation location.href is still the previous page while event.url is the
	// target; during hydration the two are equal. That difference is the discriminator.
	const href = event?.url?.href;
	const isNavigation = !!href && href !== location.href;
	const matches = isNavigation ? isChunkLoadError(error) : isDynamicImportError(error);

	// The 30s cooldown in recoverFromStaleChunk bounds a false positive to one hop.
	if (matches && recoverFromStaleChunk(isNavigation ? href : undefined)) {
		return { message, status };
	}
	posthog.captureException(error);
	return { message, status };
};
