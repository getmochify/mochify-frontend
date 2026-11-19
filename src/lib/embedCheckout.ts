import { posthog } from '$lib/analytics';
import { USD_PRICES } from '$lib/currency';

// Polar's embedded checkout, shared by the Day Pass (`$lib/dayPass`) and the
// subscription plans (`startPlanCheckout` below). The overlay keeps the page
// underneath: an uploader with files waiting, a half-written prompt, the
// pricing table. Polar only frames checkouts for hosts on the organization's
// allowlist (Settings > Preferences > Embedding), which must include mochify.app.

/**
 * How long the overlay may take to load before the buyer is offered a tab, and
 * when `checkout_overlay_slow` fires. Was 12s: the three timeouts in the week
 * after launch (Oct 2026) all sat behind a scroll-locked spinner that long and
 * none took the fallback. Since Nov 2026 the offer at this point is a quiet
 * line on the loading card, not a warning (see `showCheckoutCard`).
 */
const EMBED_SLOW_MS = 6_000;

/**
 * When the loading card's new-tab offer becomes its main button. Session
 * recordings (Nov 2026) showed buyers reading the old 6s "slow to load" card
 * as an error and leaving, while the frame went on to load.
 */
const EMBED_PROMPT_MS = 12_000;

/**
 * How long the frame keeps loading behind that offer before it is taken down.
 * Until Nov 2026 the frame was closed at 6s, which turned a slow Polar load
 * from India (opens there took 3-4s, failures sat just past 6s) into a lost
 * sale. Now the tab is offered at 6s and a frame that loads before this still
 * opens. A frame that loads after this is closed (see openEmbeddedCheckout).
 */
const EMBED_LOAD_TIMEOUT_MS = 20_000;

const POLAR_ORIGINS = ['https://polar.sh', 'https://sandbox.polar.sh'];

/**
 * Get ready for a checkout the visitor may be about to open: resolve and
 * connect to the hosts Polar's frame loads from (its page, then Stripe).
 * Creates nothing at Polar. Call it when a checkout button appears and again
 * on hover/focus/press, since browsers drop an unused preconnect after about
 * ten seconds.
 *
 * Chrome keys connections and its cache by the top-level site *and* whether
 * the request is cross-site, so a socket opened here may not be one the frame
 * can reuse. Only DNS reliably carries over. Loading the frame itself ahead of
 * the click is what does (`createCheckoutFrame`, via `prewarmDayPass`).
 */
export function warmCheckout(): void {
	if (typeof document === 'undefined') return;
	for (const href of ['https://polar.sh', 'https://js.stripe.com']) {
		const id = `mochi-preconnect-${new URL(href).hostname}`;
		document.getElementById(id)?.remove();
		const link = document.createElement('link');
		link.id = id;
		link.rel = 'preconnect';
		link.href = href;
		document.head.appendChild(link);
		if (!document.getElementById(`${id}-dns`)) {
			const dns = document.createElement('link');
			dns.id = `${id}-dns`;
			dns.rel = 'dns-prefetch';
			dns.href = href;
			document.head.appendChild(dns);
		}
	}
}

// Every overlay piece (the loading card, a shown frame) locks the page's scroll
// while it is up; the page scrolls again once the last of them goes.
let scrollLocks = 0;
function lockScroll(): () => void {
	if (scrollLocks++ === 0) document.documentElement.style.overflow = 'hidden';
	let held = true;
	return () => {
		if (!held) return;
		held = false;
		if (--scrollLocks === 0) document.documentElement.style.overflow = '';
	};
}

/**
 * Polar's checkout page in an iframe, loaded hidden and shown on demand.
 *
 * This is what `@polar-sh/checkout/embed`'s `PolarEmbedCheckout.create` does
 * (same URL parameters, same frame attributes), done by hand for two reasons:
 * `create` shows the frame the moment it is called, so it cannot be loaded
 * ahead of a click; and every instance of that class acts on any message from
 * polar.sh without checking which frame sent it, so a second frame's `success`
 * would redirect the page. Messages here are matched to this frame's window.
 */
export type CheckoutFrame = {
	readonly url: string;
	/** `performance.now()` when the frame was created. */
	readonly startedAt: number;
	/** Creation to Polar's `loaded`, once it has arrived. */
	readonly loadMs: number | undefined;
	/** Resolves when Polar reports the checkout usable. Never rejects. */
	readonly loaded: Promise<void>;
	/** `close`: the buyer closed Polar's checkout (the frame is already gone). */
	on(event: 'close' | 'success', fn: () => void): void;
	show(): void;
	remove(): void;
};

export function createCheckoutFrame(checkoutUrl: string): CheckoutFrame {
	const src = new URL(checkoutUrl);
	src.searchParams.set('embed', 'true');
	src.searchParams.set('embed_origin', window.location.origin);
	src.searchParams.set('theme', 'light');

	const iframe = document.createElement('iframe');
	iframe.src = src.toString();
	iframe.title = 'Secure checkout';
	// Hidden by opacity, not `display:none`, `visibility:hidden` or an
	// off-screen position: Chrome throttles cross-origin frames in all three,
	// which would leave a warmed checkout half loaded. `inert` keeps it out of
	// the tab order and the accessibility tree until it is shown.
	iframe.style.cssText =
		'position:fixed;top:0;left:0;width:100%;height:100%;border:none;' +
		'z-index:2147483647;background-color:rgba(0,0,0,0.5);color-scheme:light;' +
		'opacity:0;pointer-events:none';
	iframe.setAttribute('inert', '');
	iframe.setAttribute('aria-hidden', 'true');
	iframe.setAttribute('data-lenis-prevent', '');
	const allowed = POLAR_ORIGINS.join(' ');
	iframe.allow = `payment 'self' ${allowed}; publickey-credentials-get 'self' ${allowed};`;

	const startedAt = performance.now();
	let loadMs: number | undefined;
	let markLoaded!: () => void;
	const loaded = new Promise<void>((resolve) => (markLoaded = resolve));
	const listeners = { close: [] as (() => void)[], success: [] as (() => void)[] };
	// After Polar's `confirmed` (payment submitted) its close button must not
	// take the frame down mid-payment; `success` lifts that again.
	let confirmed = false;
	let shown = false;
	let unlock: (() => void) | undefined;

	const onMessage = (event: MessageEvent) => {
		if (event.source !== iframe.contentWindow || !POLAR_ORIGINS.includes(event.origin)) return;
		const data = event.data as { type?: unknown; event?: unknown } | null;
		if (data?.type !== 'POLAR_CHECKOUT') return;
		if (data.event === 'loaded' && loadMs === undefined) {
			loadMs = Math.round(performance.now() - startedAt);
			markLoaded();
		} else if (data.event === 'confirmed') {
			confirmed = true;
		} else if (data.event === 'close' && !confirmed) {
			frame.remove();
			for (const fn of listeners.close) fn();
		} else if (data.event === 'success') {
			confirmed = false;
			for (const fn of listeners.success) fn();
		}
	};
	window.addEventListener('message', onMessage);
	document.body.appendChild(iframe);

	const frame: CheckoutFrame = {
		url: checkoutUrl,
		startedAt,
		get loadMs() {
			return loadMs;
		},
		loaded,
		on(event, fn) {
			listeners[event].push(fn);
		},
		show() {
			if (shown) return;
			shown = true;
			unlock = lockScroll();
			iframe.removeAttribute('inert');
			iframe.removeAttribute('aria-hidden');
			iframe.style.opacity = '1';
			iframe.style.pointerEvents = '';
			iframe.focus();
		},
		remove() {
			window.removeEventListener('message', onMessage);
			iframe.remove();
			unlock?.();
		}
	};
	return frame;
}

/** What the loading card says is being bought. */
export type CheckoutItem = {
	/** "Day Pass", "Pro plan". */
	name: string;
	/** "100 image ops for 24 hours". */
	detail?: string;
	/** As the checkout will charge it; left off until known. */
	price?: string;
};

/**
 * The loading card: shown from the click until Polar's frame reports it is
 * usable, in place of the embed's bare pulsing dot on a dimmed page. It says
 * what is being bought and for how much, and only offers a new tab once the
 * wait is long (`slow`, then `stalled`), worded as an option rather than an
 * error.
 *
 * Every way out before the frame loads (Cancel, Escape, the new-tab link,
 * leaving the page) is reported here as `checkout_overlay_closed` with
 * `frame_loaded: false`; the rest of the checkout's events are
 * `openEmbeddedCheckout`'s.
 */
export type CheckoutCard = {
	/** How the buyer left before the checkout loaded, if they did. */
	readonly left: 'cancel' | 'new_tab' | 'navigated' | undefined;
	setPrice(price: string | undefined): void;
	/** The checkout to open in a new tab; until set, no tab is offered. */
	setCheckoutUrl(url: string): void;
	onLeave(fn: () => void): void;
	slow(): void;
	stalled(): void;
	/** Take the card down without reporting anything: the frame took over. */
	remove(): void;
};

const CARD_STYLE_ID = 'mochi-checkout-card-style';
const CARD_CSS = `
#mochi-checkout-card{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(45,27,27,0.45);font:14px/1.45 Nunito,system-ui,sans-serif;color:#4A2C2C;animation:mochi-cc-fade .15s ease-out}
#mochi-checkout-card .cc-panel{width:min(400px,100%);box-sizing:border-box;padding:22px 22px 16px;background:#FDFBF7;border-radius:20px;box-shadow:0 20px 50px rgba(45,27,27,0.25);outline:none}
#mochi-checkout-card .cc-eyebrow{display:flex;align-items:center;gap:6px;margin:0;font-size:12px;font-weight:800;color:#875F42}
#mochi-checkout-card .cc-row{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:10px 0 0}
#mochi-checkout-card .cc-name{margin:0;font:800 19px/1.2 Outfit,system-ui,sans-serif;color:#2D1B1B}
#mochi-checkout-card .cc-price{margin:0;font:900 20px/1.2 Outfit,system-ui,sans-serif;color:#2D1B1B;white-space:nowrap}
#mochi-checkout-card .cc-detail{margin:2px 0 0;font-size:13px;color:rgba(108,63,49,0.8)}
#mochi-checkout-card .cc-track{position:relative;height:4px;margin:18px 0 0;border-radius:4px;background:#FFF0F3;overflow:hidden}
#mochi-checkout-card .cc-bar{position:absolute;top:0;left:-40%;width:40%;height:100%;border-radius:4px;background:#F06292;animation:mochi-cc-slide 1.3s ease-in-out infinite}
#mochi-checkout-card .cc-status{margin:10px 0 0;font-size:13px;font-weight:700;color:#6C3F31}
#mochi-checkout-card .cc-hint{margin:6px 0 0;font-size:12px;color:rgba(108,63,49,0.75)}
#mochi-checkout-card .cc-hint a{color:#F06292;font-weight:800}
#mochi-checkout-card .cc-tab{display:block;margin:12px 0 0;padding:10px 14px;border-radius:12px;background:#F06292;color:#fff;font-weight:800;text-align:center;text-decoration:none}
#mochi-checkout-card .cc-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:16px 0 0;padding:12px 0 0;border-top:1px solid rgba(240,98,146,0.15);font-size:12px;color:rgba(135,95,66,0.7)}
#mochi-checkout-card .cc-cancel{padding:4px 0;border:0;background:none;cursor:pointer;font:inherit;font-weight:800;color:#875F42}
#mochi-checkout-card .cc-cancel:hover{color:#D81B60}
@keyframes mochi-cc-slide{to{left:100%}}
@keyframes mochi-cc-fade{from{opacity:0}}
@media (prefers-reduced-motion:reduce){#mochi-checkout-card,#mochi-checkout-card .cc-bar{animation:none}#mochi-checkout-card .cc-bar{left:0;width:100%;opacity:.5}}
`;

const LOCK_ICON =
	'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

export function showCheckoutCard(
	item: CheckoutItem,
	/** For the `checkout_overlay_closed` a pre-load exit sends. */
	context: { plan: string; trigger: string }
): CheckoutCard {
	if (!document.getElementById(CARD_STYLE_ID)) {
		const style = document.createElement('style');
		style.id = CARD_STYLE_ID;
		style.textContent = CARD_CSS;
		document.head.appendChild(style);
	}
	document.getElementById('mochi-checkout-card')?.remove();
	// The last checkout's "slow" or "couldn't start" card would sit under this one.
	document.getElementById('mochi-day-pass-notice')?.remove();

	const shownAt = performance.now();
	const returnFocus = document.activeElement as HTMLElement | null;
	const unlock = lockScroll();
	const leaveFns: (() => void)[] = [];
	let left: CheckoutCard['left'];
	let checkoutUrl: string | undefined;
	let gone = false;

	const root = document.createElement('div');
	root.id = 'mochi-checkout-card';
	const panel = document.createElement('div');
	panel.className = 'cc-panel';
	panel.setAttribute('role', 'dialog');
	panel.setAttribute('aria-modal', 'true');
	panel.setAttribute('aria-labelledby', 'mochi-cc-name');
	panel.setAttribute('aria-describedby', 'mochi-cc-status');
	panel.tabIndex = -1;

	const eyebrow = document.createElement('p');
	eyebrow.className = 'cc-eyebrow';
	eyebrow.innerHTML = `${LOCK_ICON}<span>Secure checkout</span>`;

	const row = document.createElement('div');
	row.className = 'cc-row';
	const name = document.createElement('p');
	name.className = 'cc-name';
	name.id = 'mochi-cc-name';
	name.textContent = item.name;
	const price = document.createElement('p');
	price.className = 'cc-price';
	row.appendChild(name);
	row.appendChild(price);

	const detail = document.createElement('p');
	detail.className = 'cc-detail';
	if (item.detail) detail.textContent = item.detail;

	const track = document.createElement('div');
	track.className = 'cc-track';
	track.setAttribute('aria-hidden', 'true');
	const bar = document.createElement('div');
	bar.className = 'cc-bar';
	track.appendChild(bar);

	const status = document.createElement('p');
	status.className = 'cc-status';
	status.id = 'mochi-cc-status';
	status.setAttribute('role', 'status');
	status.textContent = 'Opening secure checkout…';

	const hint = document.createElement('div');

	const foot = document.createElement('div');
	foot.className = 'cc-foot';
	const cancel = document.createElement('button');
	cancel.type = 'button';
	cancel.className = 'cc-cancel';
	cancel.textContent = 'Cancel';
	const by = document.createElement('span');
	by.textContent = 'Payments by Polar and Stripe';
	foot.appendChild(cancel);
	foot.appendChild(by);

	for (const part of [eyebrow, row, detail, track, status, hint, foot]) {
		if (part !== detail || item.detail) panel.appendChild(part);
	}
	root.appendChild(panel);
	document.body.appendChild(root);
	panel.focus();

	const tabLink = (className: string, text: string) => {
		const link = document.createElement('a');
		link.className = className;
		link.href = checkoutUrl ?? '#';
		// A new tab rather than a redirect: the page underneath holds the
		// visitor's files. The click is a user gesture, so no popup blocker.
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.textContent = text;
		link.addEventListener('click', () => {
			posthog.capture('checkout_fallback_clicked');
			leave('new_tab');
		});
		return link;
	};

	const take = () => {
		if (gone) return false;
		gone = true;
		root.remove();
		unlock();
		window.removeEventListener('keydown', onKey, true);
		window.removeEventListener('pagehide', onPageHide);
		return true;
	};
	const leave = (how: NonNullable<CheckoutCard['left']>) => {
		if (!take()) return;
		left = how;
		posthog.capture('checkout_overlay_closed', {
			plan: context.plan,
			trigger: context.trigger,
			reason:
				how === 'cancel' ? 'user_dismissed' : how === 'new_tab' ? 'fallback_tab' : 'navigated',
			frame_loaded: false,
			open_ms: Math.round(performance.now() - shownAt)
		});
		if (how === 'cancel') returnFocus?.focus?.();
		for (const fn of leaveFns) fn();
	};
	// Captured and stopped, so a modal under the card (the uploader's limit
	// dialogs) does not close on the same key.
	const onKey = (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return;
		event.stopImmediatePropagation();
		leave('cancel');
	};
	const onPageHide = () => leave('navigated');
	cancel.addEventListener('click', () => leave('cancel'));
	window.addEventListener('keydown', onKey, true);
	window.addEventListener('pagehide', onPageHide);

	const card: CheckoutCard = {
		get left() {
			return left;
		},
		setPrice(value) {
			price.textContent = value ?? '';
		},
		setCheckoutUrl(url) {
			checkoutUrl = url;
		},
		onLeave(fn) {
			leaveFns.push(fn);
		},
		slow() {
			if (gone || !checkoutUrl) return;
			hint.className = 'cc-hint';
			hint.replaceChildren(
				'Still connecting to our payment provider. You can also ',
				tabLink('', 'open checkout in a new tab'),
				'.'
			);
		},
		stalled() {
			if (gone || !checkoutUrl) return;
			status.textContent = 'This is taking longer than usual.';
			hint.className = 'cc-hint';
			hint.replaceChildren(
				'Your files stay on this page.',
				tabLink('cc-tab', 'Continue in a new tab')
			);
		},
		remove() {
			take();
		}
	};
	card.setPrice(item.price);
	return card;
}

type NoticeKind = 'paid' | 'activating' | 'active' | 'sign_in' | 'fallback' | 'error';

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
	/** Which pass was bought, for the 'paid', 'activating', 'active' and 'sign_in' copy. */
	pass: { name: string; ops: number } = { name: 'Day Pass', ops: 100 },
	/** Runs when the card goes away by the visitor's hand: its link or its ×. */
	onLeave?: () => void
): void {
	document.getElementById('mochi-day-pass-notice')?.remove();
	const card = document.createElement('div');
	card.id = 'mochi-day-pass-notice';
	card.setAttribute('role', 'status');
	// Polar's frame sits at the maximum z-index. The 'fallback' card takes the
	// same z-index so nothing a page layers up can cover the way out; every
	// other card stays under a checkout.
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
	} else if (kind === 'activating') {
		// Paid, but activation failed: say so plainly, so the limit wall
		// underneath does not read as an invitation to pay again.
		title.textContent = 'Payment received. Your pass is still activating';
		body.textContent = `Your ${pass.name} is paid for, so there is no need to buy it again. If it does not switch on in a moment, try again, or use the link we emailed you.`;
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
 * The plan's USD list price in dollars, for weighing purchases against each
 * other in PostHog (the `batch-queue` experiment's revenue metric). Polar's
 * success message carries no amount, so this is the list price, not what was
 * charged: a GBP buyer or a discount still counts at the USD figure, which is
 * the right unit for comparing a $5 Day Pass+ with a $2 Day Pass. Undefined
 * for a plan this table does not know, so a new plan shows up as missing
 * rather than as a wrong number.
 */
export function listPriceUsd(plan: string, billing?: 'monthly' | 'yearly'): number | undefined {
	const key =
		plan === 'day'
			? 'dayPass'
			: plan === 'dayplus'
				? 'dayPassPlus'
				: `${plan}${billing === 'yearly' ? 'Yearly' : 'Monthly'}`;
	const cents = USD_PRICES[key];
	return cents === undefined ? undefined : cents / 100;
}

/** How ready the checkout was when the buyer clicked (see `prewarmDayPass`). */
export type PrewarmStage = 'none' | 'session' | 'loading' | 'ready';

/**
 * Open `checkoutUrl` (created with `embedOrigin`) as an overlay, taking over
 * from the `card` the caller put up at the click. Resolves once the overlay is
 * showing or the fallback has run; `onPaid` fires later, after the overlay has
 * closed itself on payment.
 *
 * Without `onFallback`, a frame slower than EMBED_SLOW_MS gets a quiet new-tab
 * offer on the card, a firmer one at EMBED_PROMPT_MS, and keeps loading until
 * EMBED_LOAD_TIMEOUT_MS. With `onFallback` (plan checkouts, which navigate
 * away) the caller takes over at EMBED_SLOW_MS as before.
 */
export async function openEmbeddedCheckout(
	checkoutUrl: string,
	opts: {
		/** `day`, `dayplus`, `seller`, `pro` or `growth`, for analytics. */
		plan: string;
		/** Subscription billing period; absent for the passes. */
		billing?: 'monthly' | 'yearly';
		trigger: string;
		/** How long the click waited for the Polar checkout, for analytics. */
		sessionMs?: number;
		/** `performance.now()` at the click, for `total_ms`. */
		clickedAt: number;
		card: CheckoutCard;
		/** This checkout's frame, already loading or loaded ahead of the click. */
		frame?: CheckoutFrame;
		prewarm?: PrewarmStage;
		/** Receives the paid checkout's URL (the Day Pass resend link needs it). */
		onPaid: (checkoutUrl: string) => void;
		/** Replaces the "open checkout in a new tab" notice when the overlay fails. */
		onFallback?: (checkoutUrl: string) => void;
	}
): Promise<void> {
	const { card } = opts;
	if (card.left) {
		opts.frame?.remove();
		return;
	}
	card.setCheckoutUrl(checkoutUrl);
	// Where a slow checkout loses its time: creating the session (`session_ms`,
	// our API and Polar's) or loading the frame (`frame_ms`, Polar's page in
	// the visitor's browser), from the click. A warmed checkout has spent most
	// of both before the click; `prewarm_frame_ms` is what its frame took in
	// the background, so Polar's own load time stays comparable.
	const frameStart = performance.now();
	const warmFrame = opts.frame?.url === checkoutUrl ? opts.frame : undefined;
	if (opts.frame && !warmFrame) opts.frame.remove();
	const preloaded = warmFrame?.loadMs !== undefined;
	const timing = () => ({
		session_ms: opts.sessionMs,
		frame_ms: Math.round(performance.now() - frameStart),
		total_ms: Math.round(performance.now() - opts.clickedAt),
		preloaded,
		prewarm: opts.prewarm ?? 'none',
		...(warmFrame ? { prewarm_frame_ms: warmFrame.loadMs } : {})
	});
	// 'timeout' when the frame never loaded, 'gave_up' when the visitor left
	// the loading card (Cancel, Escape, its new-tab link) before it did.
	let stalled: 'timeout' | 'gave_up' | undefined;
	let slow = false;
	const timers: ReturnType<typeof setTimeout>[] = [];
	let frame: CheckoutFrame | undefined;
	try {
		frame = warmFrame ?? createCheckoutFrame(checkoutUrl);
		const loading = frame.loaded;
		await new Promise<void>((resolve, reject) => {
			void loading.then(resolve);
			const stop = (why: 'timeout' | 'gave_up') => {
				stalled = why;
				reject(
					new Error(why === 'timeout' ? 'embed load timeout' : 'embed abandoned while loading')
				);
			};
			card.onLeave(() => stop('gave_up'));
			if (opts.onFallback) {
				timers.push(setTimeout(() => stop('timeout'), EMBED_SLOW_MS));
				return;
			}
			timers.push(setTimeout(() => stop('timeout'), EMBED_LOAD_TIMEOUT_MS));
			timers.push(
				setTimeout(() => {
					slow = true;
					posthog.capture('checkout_overlay_slow', {
						plan: opts.plan,
						trigger: opts.trigger,
						session_ms: opts.sessionMs
					});
					card.slow();
				}, EMBED_SLOW_MS)
			);
			timers.push(setTimeout(() => card.stalled(), EMBED_PROMPT_MS));
		});
		timers.forEach(clearTimeout);
		const checkout = frame;
		checkout.show();
		card.remove();
		posthog.capture('checkout_overlay_opened', {
			plan: opts.plan,
			trigger: opts.trigger,
			mode: 'embed',
			slow,
			...timing()
		});

		// Why and how fast the overlay closed. Six of 23 opens closed inside 2s
		// with no error recorded, so `reason` and `open_ms` are what tell a
		// visitor's own dismissal from an embed that broke on load. Closes
		// before the frame loaded are the card's (`frame_loaded: false`).
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
				frame_loaded: true,
				open_ms: Math.round(performance.now() - openedAt)
			});
		};
		const onLeave = () => reportClose('navigated');
		window.addEventListener('pagehide', onLeave);

		checkout.on('success', () => {
			// Handled here rather than by following Polar's success URL, which
			// would redirect the whole page and drop what was on it. The close is
			// reported now: `remove()` drops the message listener, so Polar's own
			// `close` can no longer arrive, and `onPaid` may navigate away.
			reportClose('paid');
			checkout.remove();
			posthog.capture('checkout_overlay_paid', {
				plan: opts.plan,
				trigger: opts.trigger,
				amount_usd: listPriceUsd(opts.plan, opts.billing)
			});
			opts.onPaid(checkoutUrl);
		});
		checkout.on('close', () => reportClose('user_dismissed'));
	} catch (err) {
		timers.forEach(clearTimeout);
		frame?.remove();
		card.remove();
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
		// The visitor has already chosen (the tab opened, or they cancelled).
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

	const plan = target.searchParams.get('plan') ?? 'pro';
	const billing = target.searchParams.get('billing') === 'yearly' ? 'yearly' : 'monthly';
	const trigger = window.location.pathname;
	const clickedAt = performance.now();
	const card = showCheckoutCard(
		{
			name: `${plan.charAt(0).toUpperCase()}${plan.slice(1)} plan`,
			detail: billing === 'yearly' ? 'Billed yearly' : 'Billed monthly'
		},
		{ plan, trigger }
	);
	card.onLeave(release);
	// The card goes quietly first, so leaving the page is not reported as the
	// buyer closing a checkout.
	const navigate = (url: string) => {
		card.remove();
		window.location.assign(url);
	};
	const follow = () => navigate(link.href);
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
		if (card.left) return;
		if (data.redirect) {
			navigate(data.redirect);
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
				plan,
				billing,
				trigger,
				sessionMs: Math.round(performance.now() - clickedAt),
				clickedAt,
				card,
				onPaid: () => window.location.assign(successUrl),
				onFallback: (url) => window.location.assign(url)
			});
		} finally {
			release();
		}
	})();
}
