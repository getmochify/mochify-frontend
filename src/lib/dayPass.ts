import { invalidateAll } from '$app/navigation';
import {
	createCheckoutFrame,
	listPriceUsd,
	openEmbeddedCheckout,
	showCheckoutCard,
	showNotice,
	warmCheckout,
	type CheckoutFrame,
	type PrewarmStage
} from '$lib/embedCheckout';
import { resetUserCaches } from '$lib/user';
import { posthog } from '$lib/analytics';

/**
 * The Day Pass checkout target. POST-only by design: the hosted `buy.polar.sh`
 * link it replaced created a real Polar checkout session on load, so crawlers
 * and prefetchers following the anchor generated abandoned carts. See the POST
 * handler in `src/routes/api/checkout/+server.ts`.
 */
export const DAY_PASS_ACTION = '/api/checkout?plan=day';

/**
 * Day Pass+: the same 24-hour pass with 300 uploads instead of 100, offered
 * where a visitor has dropped more files than a Day Pass covers (hif-to-jpg
 * camera dumps routinely run past 100). Same plan server side, bigger
 * allowance; see `dayPassOpsForProduct`.
 */
export const DAY_PASS_PLUS_ACTION = '/api/checkout?plan=dayplus';
export const DAY_PASS_OPS = 100;
export const DAY_PASS_PLUS_OPS = 300;

/** The pass to offer for a drop of `n` files: the Day Pass while it covers them. */
export function passForDrop(n: number): { plus: boolean; name: string; ops: number } {
	return n > DAY_PASS_OPS
		? { plus: true, name: 'Day Pass+', ops: DAY_PASS_PLUS_OPS }
		: { plus: false, name: 'Day Pass', ops: DAY_PASS_OPS };
}

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
 * A buyer with no account is signed in right here once payment completes (see
 * `activateDayPass`), so the pass starts in this tab: many never opened the
 * magic link `order.created` emails, and bought again. A buyer whose email
 * already has an account is never signed in by payment; they are asked to sign
 * in, and the uploader re-checks the plan when its tab regains focus.
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
	/** Day Pass+ (300 uploads) rather than the Day Pass. */
	plus?: boolean;
	/** Native POST form to fall back to when the fetch itself fails. */
	fallbackForm?: HTMLFormElement | null;
	/**
	 * Called once payment completes and activation has been tried, in place of
	 * the default notice, with the paid checkout's URL (for `resendDayPassLink`).
	 * The overlay is already closed by then. `paid` is false when activation
	 * failed outright; the checkout stays remembered for `retryPaidCheckout`.
	 */
	onPaid?: (checkoutUrl: string, activation: DayPassActivation, paid: boolean) => void;
}): Promise<void> {
	// This browser already paid for a pass that never activated: finish that
	// one instead of selling a second. On 2026-11-19 a buyer whose activation
	// failed still saw the limit wall and its Day Pass button, and paid again.
	const owed = paidCheckout();
	if (owed) {
		posthog.capture('day_pass_rebuy_redirected', { trigger: opts.trigger });
		const owedPass = owed.plus
			? { name: 'Day Pass+', ops: DAY_PASS_PLUS_OPS }
			: { name: 'Day Pass', ops: DAY_PASS_OPS };
		const result = await settleDayPass(owed.url, {
			plus: owed.plus,
			trigger: owed.trigger,
			via: 'retry',
			attempts: 2
		});
		if (result.paid) forgetCheckout();
		announcePaid(owed.url, result, owedPass, opts.onPaid);
		return;
	}

	const clickedAt = performance.now();
	const plus = !!opts.plus;
	const plan = plus ? 'dayplus' : 'day';
	const pass = plus
		? { name: 'Day Pass+', ops: DAY_PASS_PLUS_OPS }
		: { name: 'Day Pass', ops: DAY_PASS_OPS };
	const warm = takePrewarm(plus, opts.next);
	const prewarm: PrewarmStage = !warm
		? 'none'
		: !warm.frame
			? 'session'
			: warm.frame.loadMs === undefined
				? 'loading'
				: 'ready';
	const card = showCheckoutCard(
		{
			name: pass.name,
			detail: `${pass.ops} image ops for 24 hours`,
			price: warm?.ready?.price ?? lastPrice.get(plus)
		},
		{ plan, trigger: opts.trigger }
	);

	let session = warm ? await warm.session : null;
	if (session) {
		// The early request left `checkout_initiated` to the click; send it now,
		// alongside the overlay rather than ahead of it.
		void fetch('/api/checkout/initiated', {
			method: 'POST',
			headers: { 'content-type': 'application/json', accept: 'application/json' },
			body: JSON.stringify({
				plan,
				url: session.url,
				currency: session.currency,
				trigger: opts.trigger
			}),
			keepalive: true
		}).catch(() => {});
	} else {
		try {
			session = await requestSession({ next: opts.next, trigger: opts.trigger, plus });
		} catch (err) {
			card.remove();
			if (err instanceof PolarUnavailable) {
				showNotice('error');
				return;
			}
			// `submit()` rather than `requestSubmit()`: it skips the submit handler
			// that called us, so the fallback cannot loop back into this function.
			opts.fallbackForm?.submit();
			return;
		}
	}
	card.setPrice(session.price ?? lastPrice.get(plus));
	rememberCheckout({ url: session.url, plus, trigger: opts.trigger });

	await openEmbeddedCheckout(session.url, {
		plan,
		trigger: opts.trigger,
		sessionMs: Math.round(performance.now() - clickedAt),
		clickedAt,
		card,
		frame: warm?.frame,
		prewarm,
		onPaid: async (url) => {
			// Kept, and marked paid, until activation answers: a call that fails
			// is retried on the next load, focus or Day Pass click rather than
			// lost (2026-11-19: the buyer reloaded two seconds after a failed
			// activation, with the checkout already forgotten).
			markCheckoutPaid();
			const result = await settleDayPass(url, {
				plus,
				trigger: opts.trigger,
				via: 'overlay'
			});
			if (result.paid) forgetCheckout();
			announcePaid(url, result, pass, opts.onPaid);
		}
	});
}

/** Tell the page how a paid checkout ended: its own handler, or a notice card. */
function announcePaid(
	url: string,
	{ activation, paid }: { activation: DayPassActivation; paid: boolean },
	pass: { name: string; ops: number },
	onPaid?: (checkoutUrl: string, activation: DayPassActivation, paid: boolean) => void
): void {
	if (onPaid) {
		onPaid(url, activation, paid);
	} else if (activation === 'signed_in') {
		showNotice('active', undefined, undefined, pass);
	} else if (activation === 'sign_in') {
		showNotice('sign_in', dayPassSignIn(), undefined, pass);
	} else if (!paid) {
		showNotice(
			'activating',
			undefined,
			{
				label: 'Try again',
				run: async () => {
					const retried = await retryPaidCheckout();
					if (!retried) return { text: 'Your pass is ready. Reload the page.' };
					if (retried.paid) {
						announcePaid(retried.checkoutUrl, retried, pass);
						return { text: 'Done' };
					}
					return { text: 'Still not through. Use the emailed link.', again: true };
				}
			},
			pass
		);
	} else {
		showNotice(
			'paid',
			url,
			{
				label: 'Resend the link',
				run: () => resendDayPassLink(url)
			},
			pass
		);
	}
}

/**
 * Activate the pass for a paid checkout and bring this tab's session up to
 * date. `paid` is whether Polar confirmed the payment, as opposed to
 * activation giving up on a checkout that never read as paid.
 */
async function settleDayPass(
	checkoutUrl: string,
	opts: {
		plus: boolean;
		trigger: string;
		via: 'overlay' | 'redirect' | 'revisit' | 'retry';
		attempts?: number;
	}
): Promise<{ activation: DayPassActivation; paid: boolean }> {
	const result = await activateDayPass(checkoutUrl, opts.attempts);
	// A revisit asks about every checkout left open; only a paid one is news.
	if (opts.via === 'revisit' && !result.paid) return result;
	posthog.capture('day_pass_tab_activation', {
		status: result.activation,
		// `email` is both a real answer (signed in as someone else) and the
		// fallback when every attempt failed; these tell the two apart.
		paid: result.paid,
		...(result.failure ? { failure: result.failure } : {}),
		trigger: opts.trigger,
		pass: opts.plus ? 'plus' : 'day',
		via: opts.via
	});
	if (result.activation === 'signed_in') {
		resetUserCaches();
		void invalidateAll();
	}
	return result;
}

/**
 * The checkout this browser last opened, kept so a payment that leaves the
 * page can still be activated when the buyer lands back on it.
 *
 * Some payments finish away from the page: the whole tab goes to the provider
 * and returns through the success URL, so the overlay's success handler never
 * runs and the buyer was left with the emailed link alone (2026-11-16: paid,
 * never opened it, clicked the Day Pass three more times). In `localStorage`,
 * not `sessionStorage`, so the loading card's "Continue in a new tab" is
 * covered too.
 */
type RememberedCheckout = {
	url: string;
	plus: boolean;
	trigger: string;
	at: number;
	/** The overlay saw it paid, but activation has not answered yet. */
	paid?: boolean;
};
const RETURN_KEY = 'mochi:day-pass-checkout';
/** Polar holds an open checkout for an hour. */
const RETURN_MAX_AGE_MS = 60 * 60_000;
/** A paid one is owed a pass for as long as the pass would have run. */
const PAID_MAX_AGE_MS = 24 * 60 * 60_000;

function readCheckout(): RememberedCheckout | null {
	let saved: Partial<RememberedCheckout> | null = null;
	try {
		saved = JSON.parse(localStorage.getItem(RETURN_KEY) ?? 'null');
	} catch {
		/* unreadable: treated as none */
	}
	if (!saved) return null;
	const maxAge = saved.paid === true ? PAID_MAX_AGE_MS : RETURN_MAX_AGE_MS;
	if (
		typeof saved.url !== 'string' ||
		typeof saved.at !== 'number' ||
		Date.now() - saved.at > maxAge
	) {
		forgetCheckout();
		return null;
	}
	return {
		url: saved.url,
		plus: saved.plus === true,
		trigger: typeof saved.trigger === 'string' ? saved.trigger : 'unknown',
		at: saved.at,
		paid: saved.paid === true
	};
}

function markCheckoutPaid(): void {
	const saved = readCheckout();
	if (!saved) return;
	try {
		localStorage.setItem(RETURN_KEY, JSON.stringify({ ...saved, paid: true }));
	} catch {
		/* storage blocked: the emailed link still activates the pass */
	}
}

/** A checkout this browser paid for whose activation never answered. */
function paidCheckout(): RememberedCheckout | null {
	const saved = readCheckout();
	return saved?.paid ? saved : null;
}

/** Whether this browser holds a paid pass still waiting to activate. */
export function dayPassOwed(): boolean {
	return paidCheckout() !== null;
}

/**
 * Try again to activate a pass this browser paid for, after the first try
 * failed. For a tab regaining focus and the "Try again" buttons. Resolves to
 * `null` when nothing is owed.
 */
export async function retryPaidCheckout(): Promise<{
	checkoutUrl: string;
	activation: DayPassActivation;
	paid: boolean;
} | null> {
	const owed = paidCheckout();
	if (!owed) return null;
	const result = await settleDayPass(owed.url, {
		plus: owed.plus,
		trigger: owed.trigger,
		via: 'retry',
		attempts: 2
	});
	if (result.paid) forgetCheckout();
	return { checkoutUrl: owed.url, ...result };
}

function rememberCheckout(checkout: Omit<RememberedCheckout, 'at'>): void {
	try {
		localStorage.setItem(RETURN_KEY, JSON.stringify({ ...checkout, at: Date.now() }));
	} catch {
		/* storage blocked: the emailed link still activates the pass */
	}
}

function forgetCheckout(): void {
	try {
		localStorage.removeItem(RETURN_KEY);
	} catch {
		/* nothing to forget */
	}
}

/**
 * Finish a Day Pass that was paid for away from the overlay: activate it in
 * this tab, as the overlay would have. `returned` is a landing on the success
 * URL (`day_pass_success=1`), where Polar may still be settling the payment,
 * so activation retries; any other page load asks once, which covers a buyer
 * who came back by the back button or a fresh visit. Resolves to `null` when
 * this browser holds no recent checkout or Polar does not report it paid,
 * which leaves the buyer with the emailed link, as before.
 */
export async function resumeDayPassReturn(returned: boolean): Promise<{
	checkoutUrl: string;
	activation: DayPassActivation;
} | null> {
	const saved = readCheckout();
	if (!saved) return null;
	const { plus, trigger } = saved;
	// A paid one is the overlay's own payment whose activation failed; anything
	// else is a payment the overlay never saw.
	const via = saved.paid ? 'retry' : returned ? 'redirect' : 'revisit';
	const { activation, paid } = await settleDayPass(saved.url, {
		plus,
		trigger,
		via,
		attempts: returned || saved.paid ? undefined : 1
	});
	// An unpaid checkout stays remembered on a revisit: it may yet be paid. So
	// does a paid one whose activation failed again: it is still owed.
	if (paid || (returned && !saved.paid)) forgetCheckout();
	if (!paid) return null;
	// Already reported when the overlay saw it paid.
	if (saved.paid) return { checkoutUrl: saved.url, activation };
	// The overlay never saw this payment, so it never reported it.
	const plan = plus ? 'dayplus' : 'day';
	posthog.capture('checkout_overlay_paid', {
		plan,
		trigger,
		amount_usd: listPriceUsd(plan),
		via
	});
	return { checkoutUrl: saved.url, activation };
}

type DayPassSession = { url: string; price?: string; currency?: string };

/** Polar refused or timed out (our 502): the card says so, no form fallback. */
class PolarUnavailable extends Error {}

/** The last price the server quoted for each pass, for the next card. */
const lastPrice = new Map<boolean, string>();

/**
 * Create a Day Pass checkout for the overlay. Sent as JSON, not as the form:
 * see `startDayPassCheckout` on SvelteKit's CSRF guard.
 */
async function requestSession(body: {
	next: string;
	trigger?: string;
	plus: boolean;
	prewarm?: boolean;
}): Promise<DayPassSession> {
	const res = await fetch(body.plus ? DAY_PASS_PLUS_ACTION : DAY_PASS_ACTION, {
		method: 'POST',
		headers: { 'content-type': 'application/json', accept: 'application/json' },
		body: JSON.stringify({
			next: body.next,
			trigger: body.trigger,
			embed: true,
			...(body.prewarm ? { prewarm: true } : {})
		})
	});
	if (res.status === 502) throw new PolarUnavailable();
	const data = res.ok ? ((await res.json()) as Partial<DayPassSession>) : undefined;
	if (!data?.url) throw new Error(`day pass checkout failed: ${res.status}`);
	if (data.price) lastPrice.set(body.plus, data.price);
	return { url: data.url, price: data.price, currency: data.currency };
}

/**
 * A Day Pass checkout made ahead of the click, with Polar's frame loading
 * (then waiting) hidden on the page. Opening it is then a matter of showing
 * the frame: Polar's frame was the slow half of the checkout (Nov 2026: p90
 * 5.1s in India, 3.1s elsewhere, against ~1s to create the session).
 */
type Prewarm = {
	plus: boolean;
	next: string;
	createdAt: number;
	session: Promise<DayPassSession | null>;
	/** The session, once it has arrived. */
	ready?: DayPassSession;
	frame?: CheckoutFrame;
	discarded: boolean;
};

const prewarms = new Map<boolean, Prewarm>();
/** Polar holds an open checkout for an hour; leave margin for the purchase. */
const PREWARM_MAX_AGE_MS = 30 * 60_000;
/**
 * Early checkouts one page may create per pass. A limit box re-rendering, or a
 * buyer cancelling and coming back, must not turn into a stream of sessions.
 */
const PREWARM_BUDGET = 3;
const prewarmsMade = new Map<boolean, number>();

/**
 * Create the pass's checkout and load Polar's frame now, so the click only
 * has to show it. For the limit boxes alone: a visitor there has run out and
 * the pass is the offer in front of them. Never for subscriptions, whose
 * expired checkouts send abandoned-cart emails; and the early checkout is
 * marked `prewarm`, so it sends no `checkout_initiated` until it is clicked.
 *
 * Idempotent: a fresh checkout for this pass and return path is kept.
 */
export function prewarmDayPass(opts: { next: string; plus?: boolean }): void {
	if (typeof window === 'undefined') return;
	warmCheckout();
	const plus = !!opts.plus;
	const current = prewarms.get(plus);
	if (
		current &&
		current.next === opts.next &&
		performance.now() - current.createdAt < PREWARM_MAX_AGE_MS
	) {
		return;
	}
	const made = prewarmsMade.get(plus) ?? 0;
	if (made >= PREWARM_BUDGET) return;
	prewarmsMade.set(plus, made + 1);
	if (current) discard(current);

	const entry: Prewarm = {
		plus,
		next: opts.next,
		createdAt: performance.now(),
		session: Promise.resolve(null),
		discarded: false
	};
	entry.session = requestSession({ next: opts.next, plus, prewarm: true }).then(
		(session) => {
			if (entry.discarded) return null;
			entry.ready = session;
			entry.frame = createCheckoutFrame(session.url);
			return session;
		},
		() => {
			// Nothing to clean up; the next show or hover may try again.
			if (prewarms.get(plus) === entry) prewarms.delete(plus);
			return null;
		}
	);
	prewarms.set(plus, entry);
}

function discard(entry: Prewarm): void {
	entry.discarded = true;
	entry.frame?.remove();
	if (prewarms.get(entry.plus) === entry) prewarms.delete(entry.plus);
}

/**
 * Hand the click this pass's early checkout, if it has a usable one. Taken off
 * the shelf either way: an overlay owns its frame, and a stale one is dropped.
 */
function takePrewarm(plus: boolean, next: string): Prewarm | undefined {
	const entry = prewarms.get(plus);
	if (!entry) return undefined;
	prewarms.delete(plus);
	if (entry.next !== next || performance.now() - entry.createdAt >= PREWARM_MAX_AGE_MS) {
		discard(entry);
		return undefined;
	}
	return entry;
}

/**
 * What the paying tab ended up as (see `api/auth/day-pass/activate`):
 * `signed_in` with the pass on its way, `sign_in` when the email already has an
 * account, and `email` when only the emailed link can activate it (this
 * browser is signed in as someone else, the account has no password or Google
 * login, or activation failed).
 */
export type DayPassActivation = 'signed_in' | 'sign_in' | 'email';

/** Sign-in page that returns to this one, for a buyer whose email has an account. */
export function dayPassSignIn(): string {
	return `/auth/login?next=${encodeURIComponent(dayPassNext(new URL(window.location.href)))}`;
}

/**
 * Start the pass in this tab, for the checkout it just paid for. Retries while
 * Polar still reports the checkout as unpaid, which it can for a moment after
 * the overlay's success event, and after a server error or a dropped request.
 * Falls back to `email` on anything else, which leaves the buyer exactly where
 * they were before this existed.
 *
 * The server error retry matters: a call that dies partway can already have
 * created this checkout's account (2026-11-19: account and session made, the
 * pass not claimed, a 100-upload pass parked while the buyer paid again). The
 * endpoint signs back in to the account its own checkout created, so a second
 * call finishes the job rather than meeting an existing account.
 */
async function activateDayPass(
	checkoutUrl: string,
	attempts = 5
): Promise<{ activation: DayPassActivation; paid: boolean; failure?: string }> {
	let failure = 'unknown';
	for (let attempt = 0; attempt < attempts; attempt++) {
		try {
			const res = await fetch('/api/auth/day-pass/activate', {
				method: 'POST',
				headers: { 'content-type': 'application/json', accept: 'application/json' },
				body: JSON.stringify({ checkoutUrl })
			});
			if (res.ok) {
				const { status } = (await res.json()) as { status?: DayPassActivation };
				// Only an activation answer means paid. An error body that slipped
				// through as a 200 (see `dayPassActivation`) carries no status.
				if (status === 'signed_in' || status === 'sign_in' || status === 'email') {
					return { activation: status, paid: true };
				}
				failure = 'no_status';
				break;
			}
			failure = `http_${res.status}`;
			if (res.status !== 409 && res.status < 500) break;
		} catch {
			failure = 'network';
		}
		if (attempt + 1 === attempts) break;
		await new Promise((r) => setTimeout(r, 1500));
	}
	return { activation: 'email', paid: false, failure };
}

/**
 * Ask for the activation email again, for the checkout this browser just paid
 * (see `api/day-pass/resend`). Resolves to the line to show in place of the
 * button, and whether it is worth pressing again.
 */
export async function resendDayPassLink(
	checkoutUrl: string
): Promise<{ text: string; again?: boolean }> {
	try {
		const res = await fetch('/api/day-pass/resend', {
			method: 'POST',
			headers: { 'content-type': 'application/json', accept: 'application/json' },
			body: JSON.stringify({ checkoutUrl })
		});
		if (res.ok) return { text: 'Sent. Check your inbox and spam folder.' };
		if (res.status === 429) return { text: 'Just sent. Give it a minute, then check spam.' };
		if (res.status === 409)
			return { text: 'Payment is still processing. Try again in a moment.', again: true };
	} catch {
		/* fall through */
	}
	return { text: "Couldn't resend. Email hello@mochify.app and we'll sort it." };
}
