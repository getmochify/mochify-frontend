import { invalidateAll } from '$app/navigation';
import { openEmbeddedCheckout, showNotice } from '$lib/embedCheckout';
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
	const pass = opts.plus
		? { name: 'Day Pass+', ops: DAY_PASS_PLUS_OPS }
		: { name: 'Day Pass', ops: DAY_PASS_OPS };
	let checkoutUrl: string;
	try {
		const res = await fetch(opts.plus ? DAY_PASS_PLUS_ACTION : DAY_PASS_ACTION, {
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
		plan: opts.plus ? 'dayplus' : 'day',
		trigger: opts.trigger,
		onPaid: async (url) => {
			const activation = await activateDayPass(url);
			posthog.capture('day_pass_tab_activation', {
				status: activation,
				trigger: opts.trigger,
				pass: opts.plus ? 'plus' : 'day'
			});
			if (activation === 'signed_in') {
				resetUserCaches();
				void invalidateAll();
			}
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
async function activateDayPass(checkoutUrl: string): Promise<DayPassActivation> {
	for (let attempt = 0; attempt < 5; attempt++) {
		try {
			const res = await fetch('/api/auth/day-pass/activate', {
				method: 'POST',
				headers: { 'content-type': 'application/json', accept: 'application/json' },
				body: JSON.stringify({ checkoutUrl })
			});
			if (res.ok) {
				const { status } = (await res.json()) as { status?: DayPassActivation };
				return status === 'signed_in' || status === 'sign_in' ? status : 'email';
			}
			if (res.status !== 409) break;
		} catch {
			break;
		}
		await new Promise((r) => setTimeout(r, 1500));
	}
	return 'email';
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
