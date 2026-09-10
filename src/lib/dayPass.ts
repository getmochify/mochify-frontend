/**
 * The Day Pass checkout target. POST-only by design: the hosted `buy.polar.sh`
 * link it replaced created a real Polar checkout session on load, so crawlers
 * and prefetchers following the anchor generated abandoned carts. See the POST
 * handler in `src/routes/api/checkout/+server.ts`.
 */
export const DAY_PASS_ACTION = '/api/checkout?plan=day';

/**
 * Whether the Day Pass may be offered at all. The Polar product id lives on the
 * server, so this is what the client gates rendering on: without it every CTA
 * would post to an endpoint that answers "not configured".
 *
 * A source constant, deliberately, not an env var. It was `PUBLIC_DAY_PASS_ENABLED`
 * and that broke twice, both times structurally:
 *
 * 1. `wrangler deploy` replaces the worker's plain vars with exactly what is in
 *    wrangler.jsonc (see the comment above `vars` there), so a variable added in
 *    the dashboard was wiped by the next deploy and every Day Pass CTA silently
 *    vanished from /pricing.
 * 2. wrangler vars are runtime bindings and never reach `vite build`. The
 *    /solutions/* pages are prerendered, so even with runtime set correctly they
 *    baked an empty value and kept the offer hidden.
 *
 * Which means a runtime flag could not have worked here anyway: half the
 * surfaces read it at build time. Flipping this constant is a one-line commit
 * plus a deploy, which is exactly the work rebuilding those pages needs.
 */
export const DAY_PASS_ENABLED = true;

export function dayPassEnabled(): boolean {
	return DAY_PASS_ENABLED;
}

/**
 * Where the buyer should be returned to after paying, as a same-origin path.
 * The endpoint validates it and appends `day_pass_success=1` itself.
 */
export function dayPassNext(url: URL): string {
	const clean = new URL(url.href);
	clean.searchParams.delete('day_pass_success');
	return clean.pathname + clean.search;
}
