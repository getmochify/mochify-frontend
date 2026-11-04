import { posthog } from '$lib/analytics';
import { USD_PRICES } from '$lib/currency';

// Polar's embedded checkout, shared by the Day Pass (`$lib/dayPass`) and the
// subscription plans (`startPlanCheckout` below). The overlay keeps the page
// underneath: an uploader with files waiting, a half-written prompt, the
// pricing table. Polar only frames checkouts for hosts on the organization's
// allowlist (Settings > Preferences > Embedding), which must include mochify.app.

/**
 * How long the overlay may take to load before the buyer is offered a tab.
 * Was 12s: the three timeouts in the week after launch (Oct 2026) all sat
 * behind a scroll-locked spinner that long and none took the fallback.
 */
const EMBED_SLOW_MS = 6_000;

/**
 * How long the frame keeps loading behind that offer before it is taken down.
 * Until Nov 2026 the frame was closed at 6s, which turned a slow Polar load
 * from India (opens there took 3-4s, failures sat just past 6s) into a lost
 * sale. Now the tab is offered at 6s and a frame that loads before this still
 * opens. A frame that loads after this is closed (see openEmbeddedCheckout).
 */
const EMBED_LOAD_TIMEOUT_MS = 20_000;

const POLAR_ORIGIN = 'https://polar.sh';

let embedImport: Promise<typeof import('@polar-sh/checkout/embed')> | undefined;
function loadEmbed() {
	embedImport ??= import('@polar-sh/checkout/embed').catch((err) => {
		embedImport = undefined;
		throw err;
	});
	return embedImport;
}

/**
 * Get ready for a checkout the visitor may be about to open: fetch the embed
 * script and open a connection to Polar, which the overlay's frame otherwise
 * pays for after the click. Creates nothing at Polar. Call it when a checkout
 * button appears and again on hover/focus/press, since browsers drop an unused
 * preconnect after about ten seconds.
 */
export function warmCheckout(): void {
	if (typeof document === 'undefined') return;
	void loadEmbed().catch(() => {});
	document.getElementById('mochi-polar-preconnect')?.remove();
	const link = document.createElement('link');
	link.id = 'mochi-polar-preconnect';
	link.rel = 'preconnect';
	link.href = POLAR_ORIGIN;
	document.head.appendChild(link);
}

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
	action?: { label: string; run: () => Promise<{ text: string; again?: boolean }> },
	/** Which pass was bought, for the 'paid', 'active' and 'sign_in' copy. */
	pass: { name: string; ops: number } = { name: 'Day Pass', ops: 100 },
	/** Runs when the card goes away by the visitor's hand: its link or its ×. */
	onLeave?: () => void
): void {
	document.getElementById('mochi-day-pass-notice')?.remove();
	const card = document.createElement('div');
	card.id = 'mochi-day-pass-notice';
	card.setAttribute('role', 'status');
	// Polar's frame sits at the maximum z-index. The 'fallback' card is shown
	// over a frame still loading, so it takes the same z-index and, appended
	// later, paints on top; every other card stays under a checkout.
	card.style.cssText =
		'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);' +
		`z-index:${kind === 'fallback' ? 2147483647 : 2147483646};` +
		'width:min(420px,calc(100vw - 32px));box-sizing:border-box;padding:14px 40px 14px 16px;' +
		'background:#FFF5F7;border:1px solid rgba(240,98,146,0.25);border-radius:16px;' +
		'box-shadow:0 8px 24px rgba(108,63,49,0.15);font:14px/1.4 Nunito,system-ui,sans-serif;color:#4A2C2C';

	const title = document.createElement('p');
	title.style.cssText = 'margin:0;font-weight:900';
	const body = document.createElement('p');
	body.style.cssText = 'margin:2px 0 0;font-size:12px;color:rgba(108,63,49,0.75)';

	if (kind === 'paid') {
		title.textContent = 'Payment received. Check your email';
		body.textContent = `We've sent a magic link to activate your ${pass.name}. Click it to unlock ${pass.ops} image ops for 24 hours.`;
	} else if (kind === 'active') {
		title.textContent = `${pass.name} active`;
		body.textContent = `${pass.ops} image ops for the next 24 hours. A sign-in link is in your email for later.`;
	} else if (kind === 'sign_in') {
		title.textContent = 'Payment received. Sign in to use it';
		body.textContent = `That email already has a Mochify account, and your ${pass.name} is on it. `;
		const link = document.createElement('a');
		link.href = checkoutUrl ?? '/auth/login';
		link.target = '_blank';
		link.textContent = 'Sign in';
		link.style.cssText = 'color:#F06292;font-weight:800';
		body.appendChild(link);
	} else if (kind === 'fallback') {
		// A new tab rather than a redirect: the page underneath holds the
		// visitor's files. The click is a user gesture, so no popup blocker.
		title.textContent = 'Checkout is slow to load here.';
		body.textContent = 'Finish in a new tab. Your files stay on this page.';
		const link = document.createElement('a');
		link.href = checkoutUrl ?? '#';
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.textContent = 'Continue to secure checkout';
		link.style.cssText =
			'display:block;margin-top:10px;padding:10px 14px;border-radius:12px;' +
			'background:#F06292;color:#fff;font-weight:800;text-align:center;text-decoration:none';
		link.addEventListener('click', () => {
			posthog.capture('checkout_fallback_clicked');
			card.remove();
			onLeave?.();
		});
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
	close.addEventListener('click', () => {
		card.remove();
		onLeave?.();
	});

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
 * The plan's USD list price in dollars, for weighing purchases against each
 * other in PostHog (the `batch-queue` experiment's revenue metric). Polar's
 * success message carries no amount, so this is the list price, not what was
 * charged: a GBP buyer or a discount still counts at the USD figure, which is
 * the right unit for comparing a $5 Day Pass+ with a $2 Day Pass. Undefined
 * for a plan this table does not know, so a new plan shows up as missing
 * rather than as a wrong number.
 */
function listPriceUsd(plan: string, billing?: 'monthly' | 'yearly'): number | undefined {
	const key =
		plan === 'day'
			? 'dayPass'
			: plan === 'dayplus'
				? 'dayPassPlus'
				: `${plan}${billing === 'yearly' ? 'Yearly' : 'Monthly'}`;
	const cents = USD_PRICES[key];
	return cents === undefined ? undefined : cents / 100;
}

/**
 * Open `checkoutUrl` (created with `embedOrigin`) as an overlay. Resolves once
 * the overlay is showing or the fallback has run; `onPaid` fires later, after
 * the overlay has closed itself on payment.
 *
 * Without `onFallback`, a frame slower than EMBED_SLOW_MS gets the "finish in
 * a new tab" card over it but keeps loading until EMBED_LOAD_TIMEOUT_MS; the
 * card goes if the frame arrives first. With `onFallback` (plan checkouts,
 * which navigate away) the caller takes over at EMBED_SLOW_MS as before.
 */
export async function openEmbeddedCheckout(
	checkoutUrl: string,
	opts: {
		/** `day`, `dayplus`, `seller`, `pro` or `growth`, for analytics. */
		plan: string;
		/** Subscription billing period; absent for the passes. */
		billing?: 'monthly' | 'yearly';
		trigger: string;
		/** How long the caller took to create the Polar checkout, for analytics. */
		sessionMs?: number;
		/** Receives the paid checkout's URL (the Day Pass resend link needs it). */
		onPaid: (checkoutUrl: string) => void;
		/** Replaces the "open checkout in a new tab" notice when the overlay fails. */
		onFallback?: (checkoutUrl: string) => void;
	}
): Promise<void> {
	// Where a slow checkout loses its time: creating the session (`session_ms`,
	// our API and Polar's) or loading the frame (`frame_ms`, Polar's page in
	// the visitor's browser). Opens from India took 3-4s in all (Nov 2026).
	const frameStart = performance.now();
	const timing = () => ({
		session_ms: opts.sessionMs,
		frame_ms: Math.round(performance.now() - frameStart)
	});
	// 'timeout' when the frame never loaded, 'gave_up' when the visitor left
	// the slow card (its new-tab link or its ×) before it did.
	let stalled: 'timeout' | 'gave_up' | undefined;
	let slow = false;
	let slowTimer: ReturnType<typeof setTimeout> | undefined;
	let timer: ReturnType<typeof setTimeout> | undefined;
	try {
		const { PolarEmbedCheckout } = await loadEmbed();
		const opening = PolarEmbedCheckout.create(checkoutUrl, { theme: 'light' });
		const checkout = await new Promise<Awaited<typeof opening>>((resolve, reject) => {
			opening.then(resolve, reject);
			const stop = (why: 'timeout' | 'gave_up') => {
				stalled = why;
				reject(
					new Error(why === 'timeout' ? 'embed load timeout' : 'embed abandoned while loading')
				);
			};
			if (opts.onFallback) {
				timer = setTimeout(() => stop('timeout'), EMBED_SLOW_MS);
				return;
			}
			timer = setTimeout(() => stop('timeout'), EMBED_LOAD_TIMEOUT_MS);
			slowTimer = setTimeout(() => {
				slow = true;
				posthog.capture('checkout_overlay_slow', {
					plan: opts.plan,
					trigger: opts.trigger,
					session_ms: opts.sessionMs
				});
				showNotice('fallback', checkoutUrl, undefined, undefined, () => stop('gave_up'));
			}, EMBED_SLOW_MS);
		}).catch((err) => {
			// A frame that loads after we gave up must not appear over the notice.
			void opening.then((late) => late.close()).catch(() => {});
			throw err;
		});
		clearTimeout(timer);
		clearTimeout(slowTimer);
		if (slow) document.getElementById('mochi-day-pass-notice')?.remove();
		posthog.capture('checkout_overlay_opened', {
			plan: opts.plan,
			trigger: opts.trigger,
			mode: 'embed',
			slow,
			...timing()
		});

		// Why and how fast the overlay closed. Six of 23 opens closed inside 2s
		// with no error recorded, so `reason` and `open_ms` are what tell a
		// visitor's own dismissal from an embed that broke on load.
		const openedAt = performance.now();
		let closed = false;
		const reportClose = (reason: 'paid' | 'user_dismissed' | 'navigated') => {
			if (closed) return;
			closed = true;
			window.removeEventListener('pagehide', onLeave);
			posthog.capture('checkout_overlay_closed', {
				plan: opts.plan,
				trigger: opts.trigger,
				reason,
				open_ms: Math.round(performance.now() - openedAt)
			});
		};
		const onLeave = () => reportClose('navigated');
		window.addEventListener('pagehide', onLeave);

		let paid = false;
		checkout.addEventListener('success', (event) => {
			// Handled here rather than by Polar's default, which would redirect
			// the whole page to the success URL and drop what was on it.
			event.preventDefault();
			paid = true;
			checkout.close();
			posthog.capture('checkout_overlay_paid', {
				plan: opts.plan,
				trigger: opts.trigger,
				amount_usd: listPriceUsd(opts.plan, opts.billing)
			});
			opts.onPaid(checkoutUrl);
		});
		checkout.addEventListener('close', () => reportClose(paid ? 'paid' : 'user_dismissed'));
	} catch (err) {
		clearTimeout(timer);
		clearTimeout(slowTimer);
		if (stalled) removeStalledOverlay(checkoutUrl);
		const reason = stalled ?? 'load_error';
		posthog.capture('checkout_overlay_failed', {
			plan: opts.plan,
			trigger: opts.trigger,
			reason,
			slow,
			error: String(err).slice(0, 200),
			...timing()
		});
		posthog.capture('checkout_overlay_opened', {
			plan: opts.plan,
			trigger: opts.trigger,
			mode: 'fallback',
			reason: stalled ? reason : String(err).slice(0, 120)
		});
		// The visitor has already chosen (the tab opened, or they closed the card).
		if (stalled === 'gave_up') return;
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
// One plan checkout at a time. A double tap on mobile fired two requests a
// second apart and created two Polar checkouts (2026-10-24), both abandoned.
let planCheckoutBusy = false;

export function startPlanCheckout(event: MouseEvent): void {
	if (event.defaultPrevented || event.button !== 0) return;
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
	const link = event.currentTarget as HTMLAnchorElement;
	const target = new URL(link.href);
	event.preventDefault();
	if (planCheckoutBusy) return;
	planCheckoutBusy = true;
	link.setAttribute('aria-busy', 'true');
	const release = () => {
		planCheckoutBusy = false;
		link.removeAttribute('aria-busy');
	};

	const follow = () => window.location.assign(link.href);
	void (async () => {
		let data: { url?: string; successUrl?: string; redirect?: string };
		const sessionStart = performance.now();
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
		// Released once the overlay is up (it covers the button) so closing it
		// and choosing again still works. The navigating paths above keep it
		// held: the page is going away.
		try {
			await openEmbeddedCheckout(data.url, {
				plan: target.searchParams.get('plan') ?? 'pro',
				billing: target.searchParams.get('billing') === 'yearly' ? 'yearly' : 'monthly',
				trigger: window.location.pathname,
				sessionMs: Math.round(performance.now() - sessionStart),
				onPaid: () => window.location.assign(successUrl),
				onFallback: (url) => window.location.assign(url)
			});
		} finally {
			release();
		}
	})();
}
