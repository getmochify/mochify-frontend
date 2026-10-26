import type { BetterAuthPlugin } from 'better-auth';
import { createAuthEndpoint, getSessionFromCtx } from 'better-auth/api';
import { setSessionCookie } from 'better-auth/cookies';
import { paidDayPassCheckout } from '$lib/server/dayPassCheckout';
import { claimPendingDayPass } from '$lib/server/dayPassGrant';

/** How long the paying tab may sign back in to the account its checkout created. */
const ACTIVATION_WINDOW_MS = 2 * 60 * 60 * 1000;

export type DayPassActivation = 'signed_in' | 'sign_in' | 'email';

/**
 * POST /api/auth/day-pass/activate: start a Day Pass in the tab that paid for it.
 *
 * Anonymous buyers used to be activated only by the magic link the webhook
 * emails, and many never opened it: they paid, stayed on the free limits, and
 * bought again. Now the overlay's success handler calls this with the paid
 * checkout's URL (see `paidDayPassCheckout`: proof this browser paid), and
 *
 * - no account for the checkout email: one is created and signed in here, and
 *   the parked pass claimed. The address is NOT marked verified, since the buyer
 *   only typed it; the magic link still goes out and verifies it when clicked.
 * - an account exists: never signed in from here, or $2 and someone else's
 *   address would open their account. The webhook grants that account the pass
 *   by email, and the page asks the buyer to sign in. The one exception is the
 *   account this same checkout created a moment ago (a retry, a second tab).
 * - this browser is signed in as someone else: left alone; the pass follows the
 *   checkout email by the usual emailed route.
 *
 * A Better Auth plugin endpoint rather than a SvelteKit route because it has to
 * issue a session, and `setSessionCookie` needs the endpoint context.
 */
export function dayPassActivation(db: D1Database, resendKey: string | undefined) {
	return {
		id: 'day-pass-activation',
		endpoints: {
			activateDayPass: createAuthEndpoint(
				'/day-pass/activate',
				{ method: 'POST', requireHeaders: true },
				async (ctx) => {
					const body = ctx.body as { checkoutUrl?: unknown } | undefined;
					const checkout = await paidDayPassCheckout(body?.checkoutUrl);
					if (checkout === 'invalid') return ctx.json({ error: checkout }, { status: 400 });
					if (checkout === 'not_found') return ctx.json({ error: checkout }, { status: 404 });
					// Polar can report the overlay's success a moment before the
					// checkout reads as succeeded; the client retries a 409.
					if (checkout === 'not_paid') return ctx.json({ error: checkout }, { status: 409 });

					const adapter = ctx.context.internalAdapter;
					const email = checkout.email.toLowerCase();
					const marker = `day-pass-activation:${checkout.id}`;
					const current = await getSessionFromCtx(ctx);
					let user = (await adapter.findUserByEmail(email))?.user ?? null;

					const reply = (status: DayPassActivation) => ctx.json({ status });

					if (current) {
						if (current.user.id !== user?.id) return reply('email');
						await claimPendingDayPass(db, resendKey, current.user);
						return reply('signed_in');
					}

					if (user) {
						const made = await adapter.findVerificationValue(marker);
						const ours = made && made.value === user.id && made.expiresAt.getTime() > Date.now();
						if (!ours) return reply('sign_in');
					} else {
						try {
							user = await adapter.createUser({ email, name: '', emailVerified: false });
						} catch {
							// The address was taken in between: by a concurrent call for
							// this checkout, or by a sign-up we know nothing about. Only
							// the first is ours to sign in to, so the safe answer is the
							// existing-account one.
							return reply('sign_in');
						}
						await adapter.createVerificationValue({
							identifier: marker,
							value: user.id,
							expiresAt: new Date(Date.now() + ACTIVATION_WINDOW_MS)
						});
					}

					const session = await adapter.createSession(user.id);
					await setSessionCookie(ctx, { session, user });
					// Parked by the webhook if it already ran. If it has not, it will
					// now find this account and grant the pass to it directly.
					await claimPendingDayPass(db, resendKey, user);
					return reply('signed_in');
				}
			)
		}
	} satisfies BetterAuthPlugin;
}
