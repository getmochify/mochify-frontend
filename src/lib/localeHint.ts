import { browser } from '$app/environment';

/**
 * The tag to send the parser as its locale hint, taken from the VISITOR rather
 * than from the page.
 *
 * `/fr/flow` can hardcode `fr-FR`, because every French-writing visitor groups
 * numbers the same way. Spanish cannot: Spain writes `1.200` and `1,5`, Mexico
 * writes `1,200` and `1.5`, and they mean the opposite things. `es` alone does
 * not say which, so the page asks the browser (handoff 2026-09-24 A7).
 *
 * Read from `navigator.languages` rather than the `Accept-Language` header for
 * the same reason LocaleBanner does: these pages sit behind Cloudflare, and
 * varying the HTML on a request header either fragments the edge cache or lets
 * one visitor's copy be served to the next. The hint is only needed when a
 * prompt is submitted, which is always after hydration, so nothing is lost.
 *
 * Returns the visitor's full tag when it is in `language` (`es-MX`, `es-419`),
 * and the bare language otherwise, which is also what a browser sending plain
 * `es` produces. The parser is expected to treat a region it cannot place the
 * same as no region at all.
 */
export function visitorLocale(language: string): string {
	if (!browser) return language;
	let tags: readonly string[] = [];
	try {
		tags = navigator.languages?.length ? navigator.languages : [navigator.language];
	} catch {
		// Blocked or absent navigator: the bare language is a safe hint.
		return language;
	}
	const match = tags.find((tag) => tag?.toLowerCase().split('-')[0] === language);
	return match || language;
}
