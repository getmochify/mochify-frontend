// The guides index page has a genuinely interactive category filter
// (buttons drive `$state`/`$derived` in +page.svelte), so it needs to
// hydrate even though the rest of /guides/* ships csr = false.
export const csr = true;
