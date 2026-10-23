import { posthog } from '$lib/analytics';

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

/** How long the overlay may take to load before the buyer is offered a tab. */
const EMBED_LOAD_TIMEOUT_MS = 12_000;

type NoticeKind = 'paid' | 'fallback' | 'error';

/**
 * A small status card pinned to the bottom of the page, built with plain DOM
 * so every surface that offers the pass gets it without rendering anything of
 * its own. Surfaces with a richer confirmation (the uploader's toast) pass
 * `onPaid` and never see the 'paid' card.
 */
function showNotice(kind: NoticeKind, checkoutUrl?: string): void {
	document.getElementById('mochi-day-pass-notice')?.remove();
	const card = document.createElement('div');
	card.id = 'mochi-day-pass-notice';
	card.setAttribute('role', 'status');
	card.style.cssText =
		'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483646;' +
		'width:min(420px,calc(100vw - 32px));box-sizing:border-box;padding:14px 40px 14px 16px;' +
		'background:#FFF5F7;border:1px solid rgba(240,98,146,0.25);border-radius:16px;' +
		'box-shadow:0 8px 24px rgba(108,63,49,0.15);font:14px/1.4 Nunito,system-ui,sans-serif;color:#4A2C2C';

	const title = document.createElement('p');
	title.style.cssText = 'margin:0;font-weight:900';
	const body = document.createElement('p');
	body.style.cssText = 'margin:2px 0 0;font-size:12px;color:rgba(108,63,49,0.75)';

	if (kind === 'paid') {
		title.textContent = 'Payment received. Check your email';
		body.textContent =
			"We've sent a magic link to activate your Day Pass. Click it to unlock 100 image ops for 24 hours.";
	} else if (kind === 'fallback') {
		title.textContent = "Checkout didn't open on this page.";
		const link = document.createElement('a');
		link.href = checkoutUrl ?? '#';
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.textContent = 'Open checkout in a new tab';
		link.style.cssText = 'color:#F06292;font-weight:800';
		link.addEventListener('click', () => card.remove());
		body.appendChild(link);
	} else {
		title.textContent = "Checkout couldn't start.";
		body.textContent = 'Please try again in a moment.';
	}

	const close = document.createElement('button');
	close.type = 'button';
	close.setAttribute('aria-label', 'Dismiss');
	close.textContent = '\u00d7';
	close.style.cssText =
		'position:absolute;top:8px;right:10px;border:0;background:none;cursor:pointer;' +
		'font-size:20px;line-height:1;color:rgba(135,95,66,0.5)';
	close.addEventListener('click', () => card.remove());

	for (const el of [title, body, close]) card.appendChild(el);
	document.body.appendChild(card);
}

/**
 * Remove an overlay whose iframe never reported `loaded`. The embed library
 * only hands back its instance once the frame loads, so a frame that a blocker
 * or a dead connection stalls has to be taken down by hand: otherwise the page
 * stays behind a scroll-locked full-screen frame with no close button.
 */
function removeStalledOverlay(checkoutUrl: string): void {
	const origin = new URL(checkoutUrl).origin;
	document.querySelectorAll<HTMLIFrameElement>('iframe').forEach((frame) => {
		if (frame.src.startsWith(origin)) frame.remove();
	});
	document.querySelector('.polar-loader-spinner')?.parentElement?.remove();
	document.body.classList.remove('polar-no-scroll');
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

	let timedOut = false;
	let timer: ReturnType<typeof setTimeout> | undefined;
	try {
		const { PolarEmbedCheckout } = await import('@polar-sh/checkout/embed');
		const opening = PolarEmbedCheckout.create(checkoutUrl, { theme: 'light' });
		const checkout = await Promise.race([
			opening,
			new Promise<never>((_, reject) => {
				timer = setTimeout(() => reject(new Error('embed load timeout')), EMBED_LOAD_TIMEOUT_MS);
			})
		]).catch((err) => {
			timedOut = true;
			// A frame that loads after we gave up must not appear over the notice.
			void opening.then((late) => late.close()).catch(() => {});
			throw err;
		});
		clearTimeout(timer);
		posthog.capture('day_pass_checkout_opened', { trigger: opts.trigger, mode: 'embed' });

		let paid = false;
		checkout.addEventListener('success', (event) => {
			// Handled here rather than by Polar's default, which would redirect
			// the whole page to the success URL and drop what was on it.
			event.preventDefault();
			paid = true;
			checkout.close();
			posthog.capture('day_pass_checkout_paid', { trigger: opts.trigger, mode: 'embed' });
			if (opts.onPaid) opts.onPaid();
			else showNotice('paid');
		});
		checkout.addEventListener('close', () => {
			if (!paid) posthog.capture('day_pass_checkout_closed', { trigger: opts.trigger });
		});
	} catch (err) {
		clearTimeout(timer);
		if (timedOut) removeStalledOverlay(checkoutUrl);
		posthog.capture('day_pass_checkout_opened', {
			trigger: opts.trigger,
			mode: 'fallback',
			reason: timedOut ? 'timeout' : String(err).slice(0, 120)
		});
		showNotice('fallback', checkoutUrl);
	}
}
