import { env } from '$env/dynamic/public';

/**
 * The Day Pass checkout target. POST-only by design: the hosted `buy.polar.sh`
 * link it replaced created a real Polar checkout session on load, so crawlers
 * and prefetchers following the anchor generated abandoned carts. See the POST
 * handler in `src/routes/api/checkout/+server.ts`.
 */
export const DAY_PASS_ACTION = '/api/checkout?plan=day';

/**
 * Whether the Day Pass may be offered at all. The Polar product id lives on the
 * server now, so this flag is what the client gates rendering on: without it
 * every CTA would post to an endpoint that answers "not configured".
 */
export function dayPassEnabled(): boolean {
	return env.PUBLIC_DAY_PASS_ENABLED === 'true';
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
