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
 * Reload once to pull the current build after a stale-chunk failure. A short
 * cooldown (in sessionStorage) stops a genuinely broken/offline chunk from
 * looping, while still allowing recovery from a later deploy in the same
 * session. Returns true when a reload was triggered (callers should bail out).
 */
export function recoverFromStaleChunk(): boolean {
	if (!browser) return false;
	let last = 0;
	try {
		last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0;
	} catch {
		// sessionStorage blocked (private mode) — fall through and reload once.
	}
	if (Date.now() - last < COOLDOWN_MS) return false;
	try {
		sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
	} catch {
		// ignore — best-effort guard
	}
	location.reload();
	return true;
}
