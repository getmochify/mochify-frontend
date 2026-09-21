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
 * Start the Day Pass checkout from the browser.
 *
 * The native form POST is the fallback here, not the primary path. SvelteKit's
 * CSRF guard rejects any form-encoded POST whose `Origin` header does not match
 * the page origin, and it treats a *missing* Origin the same way — see
 * `csrf_check_origin` in kit's `respond.js`. A slice of real traffic arrives
 * with that header stripped (in-app webviews, privacy extensions, filtering
 * proxies), and those buyers got a bare "Cross-site POST form submissions are
 * forbidden" page instead of a checkout. The guard fires before `handle`, so
 * nothing server-side can rescue it.
 *
 * A JSON body is not a form content type, so the guard skips the request
 * entirely and it is judged by the same-origin policy the browser already
 * enforces: a cross-site caller would need a CORS preflight this app never
 * answers. The form stays in the markup for the no-JS case (and as the
 * fallback below), which is still the reason the CTA is a form and not a link.
 *
 * Call this synchronously from the click/submit handler: the checkout tab is
 * opened inside the user gesture, before the await, or the popup blocker eats it.
 */
export async function startDayPassCheckout(opts: {
	next: string;
	trigger: string;
	/** Native POST form to fall back to when the fetch itself fails. */
	fallbackForm?: HTMLFormElement | null;
}): Promise<void> {
	const tab = window.open('', '_blank');
	try {
		tab?.document.write(
			'<title>Redirecting to checkout</title><p style="font:16px system-ui;padding:2rem">Taking you to checkout…</p>'
		);
	} catch {
		/* cosmetic only */
	}

	try {
		const res = await fetch(DAY_PASS_ACTION, {
			method: 'POST',
			headers: { 'content-type': 'application/json', accept: 'application/json' },
			body: JSON.stringify({ next: opts.next, trigger: opts.trigger })
		});
		const target = res.ok ? ((await res.json()) as { url?: string }).url : undefined;
		if (!target) throw new Error(`day pass checkout failed: ${res.status}`);
		if (tab) {
			tab.opener = null;
			tab.location.replace(target);
		} else {
			// Popup blocked despite the gesture — don't lose the buyer, use this tab.
			window.location.assign(target);
		}
	} catch {
		tab?.close();
		// `submit()` rather than `requestSubmit()`: it skips the submit handler
		// that called us, so the fallback cannot loop back into this function.
		opts.fallbackForm?.submit();
	}
}
