import { posthog } from '$lib/analytics';
import { posthogOptions } from '$lib/posthogConfig';
import { PUBLIC_POSTHOG_PROJECT_TOKEN, PUBLIC_POSTHOG_HOST } from '$env/static/public';
import { isChunkLoadError, isDynamicImportError, recoverFromStaleChunk } from '$lib/chunkRecovery';
import { navigating, updated } from '$app/state';
import type { HandleClientError } from '@sveltejs/kit';
import type { CaptureResult } from 'posthog-js';

export async function init() {
	posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
		api_host: PUBLIC_POSTHOG_HOST, // t.mochify.app reverse proxy
		// Shared with the guides' standalone snippet; see $lib/posthogConfig.
		...posthogOptions,
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
	// A HOVER PRELOAD is the third case, and it must never navigate. The site
	// preloads on hover (data-sveltekit-preload-data in app.html), and a failed
	// preload reaches this hook with event.url = the hovered link (client.js
	// load_route, the `preload` branches). It used to be told apart from a real
	// navigation only by href !== location.href, which a hovered link also passes,
	// so after a deploy, moving the mouse across the nav sent the user to whatever
	// link it crossed: "a random page loads". navigating.to is set before a real
	// navigation's load starts and never for a preload, so that is the test. A
	// stale preload instead primes `updated`, which makes the beforeNavigate guard
	// in +layout.svelte turn the eventual click into a full load. Nothing is
	// reported: a real error recurs on the click, because SvelteKit does not cache
	// a failed preload.
	//
	// During hydration event.url equals location.href, and a real navigation's
	// target is navigating.to; those two discriminate the remaining cases.
	const href = event?.url?.href;
	const isNavigation = !!href && href === navigating.to?.url.href;
	if (href && href !== location.href && !isNavigation) {
		if (isChunkLoadError(error)) void updated.check();
		return { message, status };
	}
	const matches = isNavigation ? isChunkLoadError(error) : isDynamicImportError(error);

	// The 30s cooldown in recoverFromStaleChunk bounds a false positive to one hop.
	if (matches && recoverFromStaleChunk(isNavigation ? href : undefined)) {
		return { message, status };
	}
	posthog.captureException(error);
	return { message, status };
};
