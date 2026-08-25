export const prerender = true;

// Guide pages are static long-form content with no genuine client-side
// interactivity (see audit notes in ReadProgress.svelte / BackToTop.svelte).
// Shipping zero JS avoids hydrating the full Svelte runtime for a read-only
// article. The /guides index page overrides this back to true because its
// category filter buttons need client state - see its own +page.ts.
export const csr = false;
