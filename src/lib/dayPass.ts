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
	 * The overlay is already closed by then.
	 */
	onPaid?: (checkoutUrl: string, activation: DayPassActivation) => void;
}): Promise<void> {
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
			forgetCheckout();
			const { activation } = await settleDayPass(url, {
				plus,
				trigger: opts.trigger,
				via: 'overlay'
			});
			if (opts.onPaid) {
				opts.onPaid(url, activation);
			} else if (activation === 'signed_in') {
				showNotice('active', undefined, undefined, pass);
			} else if (activation === 'sign_in') {
				showNotice('sign_in', dayPassSignIn(), undefined, pass);
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
	});
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
		via: 'overlay' | 'redirect' | 'revisit';
		attempts?: number;
	}
): Promise<{ activation: DayPassActivation; paid: boolean }> {
	const result = await activateDayPass(checkoutUrl, opts.attempts);
	// A revisit asks about every checkout left open; only a paid one is news.
	if (opts.via === 'revisit' && !result.paid) return result;
	posthog.capture('day_pass_tab_activation', {
		status: result.activation,
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
type RememberedCheckout = { url: string; plus: boolean; trigger: string; at: number };
const RETURN_KEY = 'mochi:day-pass-checkout';
/** Polar holds an open checkout for an hour. */
const RETURN_MAX_AGE_MS = 60 * 60_000;

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
	let saved: Partial<RememberedCheckout> | null = null;
	try {
		saved = JSON.parse(localStorage.getItem(RETURN_KEY) ?? 'null');
	} catch {
		/* unreadable: treated as none */
	}
	if (!saved) return null;
	if (
		typeof saved.url !== 'string' ||
		typeof saved.at !== 'number' ||
		Date.now() - saved.at > RETURN_MAX_AGE_MS
	) {
		forgetCheckout();
		return null;
	}
	const plus = saved.plus === true;
	const trigger = typeof saved.trigger === 'string' ? saved.trigger : 'unknown';
	const via = returned ? 'redirect' : 'revisit';
	const { activation, paid } = await settleDayPass(saved.url, {
		plus,
		trigger,
		via,
		attempts: returned ? undefined : 1
	});
	// An unpaid checkout stays remembered on a revisit: it may yet be paid.
	if (paid || returned) forgetCheckout();
	if (!paid) return null;
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
 * browser is signed in as someone else, or activation failed).
 */
export type DayPassActivation = 'signed_in' | 'sign_in' | 'email';

/** Sign-in page that returns to this one, for a buyer whose email has an account. */
export function dayPassSignIn(): string {
	return `/auth/login?next=${encodeURIComponent(dayPassNext(new URL(window.location.href)))}`;
}

/**
 * Start the pass in this tab, for the checkout it just paid for. Retries while
 * Polar still reports the checkout as unpaid, which it can for a moment after
 * the overlay's success event. Falls back to `email` on anything else, which
 * leaves the buyer exactly where they were before this existed.
 */
async function activateDayPass(
	checkoutUrl: string,
	attempts = 5
): Promise<{ activation: DayPassActivation; paid: boolean }> {
	for (let attempt = 0; attempt < attempts; attempt++) {
		try {
			const res = await fetch('/api/auth/day-pass/activate', {
				method: 'POST',
				headers: { 'content-type': 'application/json', accept: 'application/json' },
				body: JSON.stringify({ checkoutUrl })
			});
			if (res.ok) {
				const { status } = (await res.json()) as { status?: DayPassActivation };
				return {
					activation: status === 'signed_in' || status === 'sign_in' ? status : 'email',
					paid: true
				};
			}
			if (res.status !== 409) break;
		} catch {
			break;
		}
		if (attempt + 1 === attempts) break;
		await new Promise((r) => setTimeout(r, 1500));
	}
	return { activation: 'email', paid: false };
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
