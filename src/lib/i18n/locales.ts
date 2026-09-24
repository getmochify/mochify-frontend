// The site's languages, in one table.
//
// This exists because the same list was being hand-maintained in ten places: an
// hreflang block in every Flow and pricing page, the footer switcher, the
// `<html lang>` hook, the sitemap and the locale banners. Three localisation
// handoffs in a row have had to say "add this line to all of them", and the
// fourth added a language that needs TWO hreflang values on one URL. A list
// copied ten times is a list that drifts.

export type Locale = {
	/** BCP-47 tag, and the value of `<html lang>`. */
	code: string;
	/** What the language calls itself, for the switcher. */
	label: string;
	/** URL prefix. Empty for English, which has no prefix. */
	prefix: string;
	/**
	 * hreflang values pointing at this locale's URLs. Usually one.
	 *
	 * Portuguese has two: the copy is Brazilian and declared `pt-BR`, but it also
	 * serves every other Portuguese speaker, so the same URL claims bare `pt`
	 * rather than leaving Portugal and Angola to the English x-default
	 * (operator decision, handoff 2026-09-24 A2).
	 */
	hreflang: string[];
};

export const LOCALES: Locale[] = [
	{ code: 'en', label: 'English', prefix: '', hreflang: ['en'] },
	{ code: 'fr', label: 'Français', prefix: '/fr', hreflang: ['fr'] },
	{ code: 'es', label: 'Español', prefix: '/es', hreflang: ['es'] },
	{ code: 'ja', label: '日本語', prefix: '/ja', hreflang: ['ja'] },
	{ code: 'pt-BR', label: 'Português', prefix: '/pt-br', hreflang: ['pt-BR', 'pt'] }
];

export const DEFAULT_LOCALE = LOCALES[0];

/**
 * Pages that exist in every language, named by their English path.
 *
 * Everything else (guides, /about, the solution pages) is English only, so the
 * switcher sends other languages to their own main surface rather than a 404.
 */
export const TRANSLATED_PAGES = ['/flow', '/pricing'];

/** The locale a pathname belongs to. English for anything unprefixed. */
export function localeForPath(pathname: string): Locale {
	return (
		LOCALES.find(
			(l) => l.prefix && (pathname === l.prefix || pathname.startsWith(`${l.prefix}/`))
		) ?? DEFAULT_LOCALE
	);
}

/** The English path a localised pathname corresponds to. */
export function basePath(pathname: string): string {
	const locale = localeForPath(pathname);
	return locale.prefix ? pathname.slice(locale.prefix.length) : pathname;
}

/** Where `locale` serves the page currently at `pathname`. */
export function localisedPath(locale: Locale, pathname: string): string {
	const base = basePath(pathname);
	return TRANSLATED_PAGES.includes(base) ? `${locale.prefix}${base}` : `${locale.prefix}/flow`;
}

/**
 * The full alternate set for one page family, in the order every page emits it.
 *
 * `x-default` is English: serving is by URL and nothing redirects on IP or
 * Accept-Language, which would hide the localised pages from a US crawler.
 */
export function alternates(base: (typeof TRANSLATED_PAGES)[number], origin = 'https://mochify.app') {
	const links = LOCALES.flatMap((l) =>
		l.hreflang.map((hreflang) => ({ hreflang, href: `${origin}${l.prefix}${base}` }))
	);
	return [...links, { hreflang: 'x-default', href: `${origin}${DEFAULT_LOCALE.prefix}${base}` }];
}
