// Last-known signed-in state, so prerendered pages can paint the signed-in nav
// and usage badge before the session request comes back.
//
// /solutions/*, the homepage and the guides are prerendered: their HTML is
// built once for nobody, so it always says "signed out" until useSession()
// resolves in the browser, and the nav visibly switched over a moment later.
// /flow is SSR and never had the problem. The real session cookie is HttpOnly,
// so the inline script in app.html reads this hint instead. It is a hint, not
// auth: nothing is granted on it, and the live session replaces it on every
// page (written by Navigation, cleared on sign-out or when the session comes
// back empty). localStorage rather than a cookie so it rides on no request.

const AUTH_KEY = 'mochify:auth';
const USAGE_KEY = 'mochify:usage-badge';

/** The signed-in user's initial, or null to clear the hint (and the cached badge). */
export function setAuthHint(initial: string | null): void {
	try {
		const root = document.documentElement;
		if (initial) {
			localStorage.setItem(AUTH_KEY, initial);
			root.dataset.auth = 'in';
			root.style.setProperty('--auth-initial', JSON.stringify(initial));
		} else {
			localStorage.removeItem(AUTH_KEY);
			localStorage.removeItem(USAGE_KEY);
			delete root.dataset.auth;
			root.style.removeProperty('--auth-initial');
		}
	} catch {
		// Storage blocked (private mode, policy): the page just behaves as before.
	}
}

export type UsageBadge = { label: string; ok: boolean };

/** The usage badge as last shown to this signed-in user, if any. */
export function readUsageBadge(): UsageBadge | null {
	try {
		if (!localStorage.getItem(AUTH_KEY)) return null;
		const raw = localStorage.getItem(USAGE_KEY);
		const parsed = raw ? (JSON.parse(raw) as Partial<UsageBadge>) : null;
		return parsed && typeof parsed.label === 'string'
			? { label: parsed.label, ok: parsed.ok !== false }
			: null;
	} catch {
		return null;
	}
}

export function writeUsageBadge(badge: UsageBadge | null): void {
	try {
		if (badge) localStorage.setItem(USAGE_KEY, JSON.stringify(badge));
		else localStorage.removeItem(USAGE_KEY);
	} catch {
		// See setAuthHint.
	}
}
