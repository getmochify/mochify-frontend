// Tells core where a charged request came from, for the server-side
// `images_processed` event (mochify-core helpers/UsageEvent.h). That event is
// the total of images processed across every surface; the browser's own
// completion events stay for the in-page funnels.
//
// A query parameter rather than a header on purpose: a custom header has to be
// on core's CORS allow-list before a browser may send it, so a frontend
// deployed ahead of core would break every upload. Core ignores a parameter it
// does not know.
export type ApiSurface = 'tool_page' | 'web_app';

/** `client=web_app&via=prompt`, ready to append to a query string. */
export function clientQuery(surface: ApiSurface, viaPrompt = false): string {
	return `client=${surface}${viaPrompt ? '&via=prompt' : ''}`;
}
