import { posthog } from '$lib/analytics';

// Polar's embedded checkout, shared by the Day Pass (`$lib/dayPass`) and the
// subscription plans (`startPlanCheckout` below). The overlay keeps the page
// underneath: an uploader with files waiting, a half-written prompt, the
// pricing table. Polar only frames checkouts for hosts on the organization's
// allowlist (Settings > Preferences > Embedding), which must include mochify.app.

/** How long the overlay may take to load before the buyer is offered a tab. */
const EMBED_LOAD_TIMEOUT_MS = 12_000;

type NoticeKind = 'paid' | 'active' | 'sign_in' | 'fallback' | 'error';

/**
 * A small status card pinned to the bottom of the page, built with plain DOM
 * so every surface that offers the pass gets it without rendering anything of
 * its own. Surfaces with a richer confirmation (the uploader's toast) pass
 * `onPaid` and never see the 'paid' card.
 */
export function showNotice(
	kind: NoticeKind,
	/** The checkout to open for 'fallback'; the sign-in page for 'sign_in'. */
	checkoutUrl?: string,
	/**
	 * A text button under the message. `run` resolves to the text that replaces
	 * its label, and whether it can be pressed again.
	 */
	action?: { label: string; run: () => Promise<{ text: string; again?: boolean }> }
): void {
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
	} else if (kind === 'active') {
		title.textContent = 'Day Pass active';
		body.textContent =
			'100 image ops for the next 24 hours. A sign-in link is in your email for later.';
	} else if (kind === 'sign_in') {
		title.textContent = 'Payment received. Sign in to use it';
		body.textContent = 'That email already has a Mochify account, and your Day Pass is on it. ';
		const link = document.createElement('a');
		link.href = checkoutUrl ?? '/auth/login';
		link.target = '_blank';
		link.textContent = 'Sign in';
		link.style.cssText = 'color:#F06292;font-weight:800';
		body.appendChild(link);
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

	const parts: HTMLElement[] = [title, body, close];
	if (action) {
		const button = document.createElement('button');
		button.type = 'button';
		button.textContent = action.label;
		button.style.cssText =
			'margin-top:6px;padding:0;border:0;background:none;cursor:pointer;' +
			'font:inherit;font-size:12px;font-weight:800;color:#F06292;text-decoration:underline';
		button.addEventListener('click', async () => {
			button.disabled = true;
			const { text, again } = await action.run();
			button.textContent = text;
			button.disabled = !again;
		});
		parts.push(button);
	}
	for (const el of parts) card.appendChild(el);
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
 * Open `checkoutUrl` (created with `embedOrigin`) as an overlay. Resolves once
 * the overlay is showing or the fallback has run; `onPaid` fires later, after
 * the overlay has closed itself on payment.
 */
export async function openEmbeddedCheckout(
	checkoutUrl: string,
	opts: {
		/** `day`, `seller`, `pro` or `growth`, for analytics. */
		plan: string;
		trigger: string;
		/** Receives the paid checkout's URL (the Day Pass resend link needs it). */
		onPaid: (checkoutUrl: string) => void;
		/** Replaces the "open checkout in a new tab" notice when the overlay fails. */
		onFallback?: (checkoutUrl: string) => void;
	}
): Promise<void> {
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
		posthog.capture('checkout_overlay_opened', {
			plan: opts.plan,
			trigger: opts.trigger,
			mode: 'embed'
		});

		let paid = false;
		checkout.addEventListener('success', (event) => {
			// Handled here rather than by Polar's default, which would redirect
			// the whole page to the success URL and drop what was on it.
			event.preventDefault();
			paid = true;
			checkout.close();
			posthog.capture('checkout_overlay_paid', { plan: opts.plan, trigger: opts.trigger });
			opts.onPaid(checkoutUrl);
		});
		checkout.addEventListener('close', () => {
			if (!paid)
				posthog.capture('checkout_overlay_closed', { plan: opts.plan, trigger: opts.trigger });
		});
	} catch (err) {
		clearTimeout(timer);
		if (timedOut) removeStalledOverlay(checkoutUrl);
		posthog.capture('checkout_overlay_opened', {
			plan: opts.plan,
			trigger: opts.trigger,
			mode: 'fallback',
			reason: timedOut ? 'timeout' : String(err).slice(0, 120)
		});
		if (opts.onFallback) opts.onFallback(checkoutUrl);
		else showNotice('fallback', checkoutUrl);
	}
}

/**
 * Click handler for a subscription checkout link (`/api/checkout?plan=...`).
 *
 * The link stays a plain GET for everything that cannot run this: no JS,
 * modified clicks (new tab), and the abandoned-cart email. Otherwise the same
 * URL is POSTed as JSON for an embeddable checkout and opened as an overlay;
 * a signed-out visitor is sent to signup exactly as the GET would, and any
 * failure falls back to following the link, since there is nothing on these
 * pages a full-page checkout would lose.
 */
export function startPlanCheckout(event: MouseEvent): void {
	if (event.defaultPrevented || event.button !== 0) return;
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
	const link = event.currentTarget as HTMLAnchorElement;
	const target = new URL(link.href);
	event.preventDefault();

	const follow = () => window.location.assign(link.href);
	void (async () => {
		let data: { url?: string; successUrl?: string; redirect?: string };
		try {
			const res = await fetch(target.pathname + target.search, {
				method: 'POST',
				headers: { 'content-type': 'application/json', accept: 'application/json' },
				body: JSON.stringify({ embed: true })
			});
			if (!res.ok) throw new Error(`plan checkout failed: ${res.status}`);
			data = await res.json();
		} catch {
			follow();
			return;
		}
		if (data.redirect) {
			window.location.assign(data.redirect);
			return;
		}
		if (!data.url) {
			follow();
			return;
		}
		const successUrl = data.successUrl ?? '/dashboard?upgraded=true';
		await openEmbeddedCheckout(data.url, {
			plan: target.searchParams.get('plan') ?? 'pro',
			trigger: window.location.pathname,
			onPaid: () => window.location.assign(successUrl),
			onFallback: (url) => window.location.assign(url)
		});
	})();
}
