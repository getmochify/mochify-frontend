// Recovery for stale code-split chunks after a deploy.
//
// The PWA service worker waits for the next page load before activating
// (register-sw.js), so an open page normally keeps its own build's precached
// chunks. These helpers self-heal the cases that still slip through — e.g. a
// chunk evicted by an activation racing a navigation, or old assets dropped
// from the CDN after a deploy for a client with no service worker.
import { browser } from '$app/environment';

const RELOAD_KEY = 'mochify:chunk-reload-at';
const COOLDOWN_MS = 30_000;

function message(err: unknown): string {
	return err instanceof Error ? err.message : String(err ?? '');
}

/** A failed dynamic import, by each engine's message — excludes bare network failures. */
export function isDynamicImportError(err: unknown): boolean {
	const msg = message(err);
	return (
		/importing a module script failed/i.test(msg) || // Safari
		/error loading dynamically imported module/i.test(msg) || // Firefox
		/failed to fetch dynamically imported module/i.test(msg) || // Chrome
		/chunkloaderror/i.test(msg)
	);
}

/**
 * Broader than {@link isDynamicImportError}: also matches Safari's generic
 * "Load failed", which is how a failed module fetch surfaces when caught right
 * around an `import()` call. Only use this where the failing op is known to be
 * a dynamic import.
 */
export function isChunkLoadError(err: unknown): boolean {
	return isDynamicImportError(err) || /load failed/i.test(message(err));
}

/**
 * A benign network/transport failure rather than a bug in our code: an
 * interrupted, aborted, offline, or timed-out `fetch()`. Mobile Safari throws
 * `TypeError: Load failed` whenever a request is cut off — the user navigating
 * away, backgrounding the PWA, or losing connectivity mid-upload — where other
 * engines report "Failed to fetch"/"NetworkError". These are expected
 * conditions we surface to the user for a retry, not exceptions worth reporting
 * to error tracking.
 */
export function isNetworkError(err: unknown): boolean {
	if ((err as { name?: string })?.name === 'AbortError') return true;
	const msg = message(err);
	return (
		/load failed/i.test(msg) || // Safari
		/failed to fetch/i.test(msg) || // Chrome
		/networkerror when attempting to fetch/i.test(msg) || // Firefox
		/network connection was lost/i.test(msg) || // iOS
		/the request timed out/i.test(msg) ||
		/cancell?ed/i.test(msg)
	);
}

/**
 * Recover once from a chunk-load failure with a full document load. A short
 * cooldown (in sessionStorage) stops a genuinely broken/offline chunk from
 * looping, while still allowing recovery from a later deploy in the same
 * session. Returns true when recovery was triggered (callers should bail out).
 *
 * Pass the intended destination when the failure happened during a client-side
 * navigation: mobile Safari routinely fails the first cold route fetch with a
 * generic "Load failed", and reloading the *current* page there just aborts the
 * nav — the user sees a dead first tap and only the retry works. Navigating to
 * the target instead turns that failed SPA hop into a successful full load, so
 * the first tap lands where it should. With no href it falls back to a reload,
 * which is right for a failure during initial page load/hydration.
 */
export function recoverFromStaleChunk(href?: string): boolean {
	if (!browser) return false;
	let last = 0;
	try {
		last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0;
	} catch {
		// sessionStorage blocked (private mode) — fall through and recover once.
	}
	if (Date.now() - last < COOLDOWN_MS) return false;
	try {
		sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
	} catch {
		// ignore — best-effort guard
	}
	if (href) location.assign(href);
	else location.reload();
	return true;
}
