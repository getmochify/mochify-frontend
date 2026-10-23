import { openEmbeddedCheckout, showNotice } from '$lib/embedCheckout';

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

/**
 * Start the Day Pass checkout from the browser, as an overlay on this page.
 *
 * The checkout used to open in a new tab. Buyers lost the page they were on
 * (an uploader with files waiting, a half-written prompt), and Polar's numbers
 * after the 2026-09-10 POST-only fix showed most checkouts abandoned before a
 * single field was filled. The overlay keeps the page underneath, takes Mochify's
 * light colors, and tells the page when payment completes.
 *
 * Anonymous buyers are still activated by the magic link `order.created` sends:
 * the email typed at checkout is unverified, so payment alone must never sign
 * anyone in. The uploader re-checks the plan when its tab regains focus, which
 * is what unlocks it after the link is clicked.
 *
 * The native form POST stays the no-JS path (and the fallback when the fetch
 * itself fails). It is sent as JSON otherwise: SvelteKit's CSRF guard rejects a
 * form-encoded POST that arrives without an `Origin` header (in-app webviews,
 * privacy extensions, filtering proxies), and a JSON body is not a form content
 * type, so the guard skips it and the same-origin policy judges it instead.
 */
export async function startDayPassCheckout(opts: {
	next: string;
	trigger: string;
	/** Native POST form to fall back to when the fetch itself fails. */
	fallbackForm?: HTMLFormElement | null;
	/**
	 * Called once payment completes, in place of the default notice. The
	 * overlay is already closed by then.
	 */
	onPaid?: () => void;
}): Promise<void> {
	let checkoutUrl: string;
	try {
		const res = await fetch(DAY_PASS_ACTION, {
			method: 'POST',
			headers: { 'content-type': 'application/json', accept: 'application/json' },
			body: JSON.stringify({ next: opts.next, trigger: opts.trigger, embed: true })
		});
		if (res.status === 502) {
			showNotice('error');
			return;
		}
		const target = res.ok ? ((await res.json()) as { url?: string }).url : undefined;
		if (!target) throw new Error(`day pass checkout failed: ${res.status}`);
		checkoutUrl = target;
	} catch {
		// `submit()` rather than `requestSubmit()`: it skips the submit handler
		// that called us, so the fallback cannot loop back into this function.
		opts.fallbackForm?.submit();
		return;
	}

	await openEmbeddedCheckout(checkoutUrl, {
		plan: 'day',
		trigger: opts.trigger,
		onPaid: opts.onPaid ?? (() => showNotice('paid'))
	});
}
