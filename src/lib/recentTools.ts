/**
 * The converter pages this browser last used, for the "Recently used" row on
 * the dashboard. People sign up from a converter (hif-to-jpg, webp-to-jpg) and
 * come back for that converter, but the dashboard only offered Flow.
 *
 * Paths only, in localStorage: it is a per-browser convenience, nothing the
 * server needs, and the dashboard checks each one against the tool list before
 * showing it. Kept free of the tool data so the uploader can record without
 * pulling the whole catalog into its bundle.
 */
const KEY = 'mochify:recent-tools';
const MAX = 5;

/** Remember a page the uploader just converted on. Any path; unknown ones are filtered on read. */
export function recordToolUse(pathname: string): void {
	try {
		const path = pathname.replace(/\/+$/, '') || '/';
		const list = readRecentPaths().filter((p) => p !== path);
		localStorage.setItem(KEY, JSON.stringify([path, ...list].slice(0, MAX)));
	} catch {
		/* storage blocked: nothing to remember */
	}
}

/** Most recent first. Empty when storage is blocked or holds anything unexpected. */
export function readRecentPaths(): string[] {
	try {
		const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
		return Array.isArray(raw) ? raw.filter((p): p is string => typeof p === 'string') : [];
	} catch {
		return [];
	}
}
