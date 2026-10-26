// Matching for the filter boxes on /guides and /solutions (`ListFilter.svelte`).
//
// Format names are written several ways ("JPEG", "jpg", "JPEG XL", "jxl"), so
// both the query and the text are folded to one spelling before comparing.
// "jpeg xl" has to fold before "jpeg", or it would become "jpg xl".
function fold(text: string): string {
	return text
		.toLowerCase()
		.replace(/jpe?g[\s-]?xl/g, 'jxl')
		.replace(/jpeg/g, 'jpg')
		.replace(/\s+/g, ' ');
}

/** True when every word of `query` appears somewhere in `fields`. An empty query matches everything. */
export function matchesQuery(query: string, ...fields: (string | undefined)[]): boolean {
	const terms = fold(query).trim().split(' ').filter(Boolean);
	if (terms.length === 0) return true;
	const haystack = fold(fields.filter(Boolean).join(' '));
	return terms.every((t) => haystack.includes(t));
}
