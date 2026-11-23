// The dark-mode trial's state: which pages have it, and how a choice is kept.
//
// A page opts in by marking its wrapper `.theme-root` and passing `themeToggle`
// to Navigation. Inside that wrapper, `html[data-theme='dark']` redefines the
// palette variables (the dark block in layout.css), so every token class
// turns dark with no class changes. One choice covers every opted-in page,
// and app.html applies it before first paint; pages that have not opted in
// stay light whatever the attribute says, because every rule is scoped to
// `.theme-root`.

export type Theme = 'light' | 'dark';

export const THEME_KEY = 'mochify:theme';
// The first day of the trial stored it here, /flow only (2026-11-22).
const LEGACY_KEY = 'mochi:flow-theme';

export function readTheme(): Theme {
	try {
		const saved = localStorage.getItem(THEME_KEY) ?? localStorage.getItem(LEGACY_KEY);
		return saved === 'dark' ? 'dark' : 'light';
	} catch {
		return 'light';
	}
}

/**
 * Whether this page is showing dark: the choice is dark and the page is in
 * the trial. For UI built outside the page's tree (the checkout cards in
 * $lib/embedCheckout), which the scoped CSS cannot reach.
 */
export function darkPage(): boolean {
	return (
		document.documentElement.dataset.theme === 'dark' && !!document.querySelector('.theme-root')
	);
}

export function setTheme(theme: Theme): void {
	document.documentElement.dataset.theme = theme;
	try {
		localStorage.setItem(THEME_KEY, theme);
		localStorage.removeItem(LEGACY_KEY);
	} catch {
		/* storage blocked: this page view only */
	}
}
