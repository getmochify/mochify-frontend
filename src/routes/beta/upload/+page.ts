import type { PageLoad } from './$types';

// Test surface, not a product page: never prerendered (so the header below is
// actually sent), never in the sitemap, and marked noindex,nofollow twice over,
// in this header and in the page's <meta>. Deliberately NOT in robots.txt: a
// Disallow would stop crawlers fetching the page and ever seeing the noindex,
// and would advertise the URL. setHeaders is a no-op on client navigation.
export const prerender = false;

export const load: PageLoad = ({ setHeaders }) => {
	setHeaders({ 'X-Robots-Tag': 'noindex, nofollow' });
};
