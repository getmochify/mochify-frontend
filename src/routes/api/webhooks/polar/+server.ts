import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { env } from '$env/dynamic/private';
// Build-time inlined — CF_WORKER_* live in the build env (like the auth handoff
// routes), NOT the Worker's runtime bindings, so they must come from static/private.
// Reading them via $env/dynamic/private would resolve to undefined at runtime and
// silently skip the token-bucket reseed on every plan change.
import { CF_WORKER_URL, CF_WORKER_TOKEN } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import type { RequestHandler } from './$types';
import { getPostHogClient } from '$lib/server/posthog';
import { mintAbandonedCartDiscount, planForProduct } from '$lib/server/discounts';
import { sendAbandonedCartEmails } from '$lib/server/emails/abandonedCart';
import {
	qualifyForRecovery,
	claimCheckout,
	attachDiscount,
	settleConversion,
	recoveryForDiscount
} from '$lib/server/abandonedCart';
import { mirrorPlan } from '$lib/server/resendContacts';
import { sendDayPassLink } from '$lib/server/dayPassLink';
import { reseedBucket, sha256Hex } from '$lib/server/bucket';
import { grantDayPass, parkDayPass } from '$lib/server/dayPassGrant';

async function updateUsageKv(
	kv: KVNamespace | undefined,
	userId: string,
	plan: string,
	opsLimit: number
): Promise<void> {
	if (!kv) return;
	const raw = await kv.get(userId).catch(() => null);
	const existing = raw ? (JSON.parse(raw) as { remaining?: number }) : null;
	// Preserve how many ops they've used so the counter doesn't reset visually,
	// but always update quota and plan to the new values.
	const usedSoFar =
		existing?.remaining !== undefined
			? Math.max(0, (existing as { remaining: number; quota?: number }).quota ?? opsLimit) -
				existing.remaining
			: 0;
	await kv
		.put(
			userId,
			JSON.stringify({
				remaining: Math.max(0, opsLimit - usedSoFar),
				quota: opsLimit,
				plan,
				updatedAt: new Date().toISOString()
			})
		)
		.catch(() => {});
}

// Subscription plans whose holder buying a Day Pass gets it as a top-up rather
// than a plan change. Same set as STORAGE_PLANS in $lib/server/storagePlan.
const SUBSCRIPTION_PLANS = new Set(['seller', 'pro', 'growth']);

// Add a Day Pass's uploads to a subscriber's live bucket without touching their
// plan (worker /credit; see applyCredit in mochify-worker's quota.ts). Unlike
// reseedBucket this throws on failure: the worker applies each orderId once, so
// letting the webhook 500 and Polar retry is safe, and a silently dropped
// credit is a paid-for pass that never arrived.
async function creditBucket(userId: string, amount: number, orderId: string): Promise<string> {
	if (!CF_WORKER_URL || !CF_WORKER_TOKEN) throw new Error('[daypass] worker not configured');
	const res = await fetch(`${CF_WORKER_URL}/credit`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-Worker-Token': CF_WORKER_TOKEN },
		body: JSON.stringify({ identifier: await sha256Hex(userId), userId, amount, orderId })
	});
	if (!res.ok)
		throw new Error(`[daypass] credit failed: ${res.status} ${await res.text().catch(() => '')}`);
	const { status } = (await res.json()) as { status: string };
	return status;
}

// Resolve the app user id for a Polar customer. Prefer the externalId set at
// checkout; fall back to an email match for customers created without one. A
// day-pass buyer (order.created, bought via a raw Polar link while often logged
// out) gets a Polar customer with NO externalId; when they later subscribe,
// Polar reuses that email-matched customer, so the subscription webhook arrives
// with externalId still empty. Without this fallback that webhook silently
// no-ops (if (!userId) break) and the paying user stays on free.
async function resolveUserId(
	db: D1Database,
	customer: { externalId?: string | null; email?: string | null }
): Promise<string | null> {
	if (customer.externalId) return customer.externalId;
	if (customer.email) {
		const row = await db
			.prepare('SELECT id FROM user WHERE email = ? LIMIT 1')
			.bind(customer.email)
			.first<{ id: string }>();
		return row?.id ?? null;
	}
	return null;
}

export const POST: RequestHandler = async ({ request, platform }) => {
	const body = await request.text();
	const headers = Object.fromEntries(request.headers.entries());

	let event;
	try {
		event = validateEvent(body, headers, env.POLAR_WEBHOOK_SECRET);
	} catch (err) {
		if (err instanceof WebhookVerificationError) {
			return new Response('Invalid signature', { status: 403 });
		}
		return new Response('Webhook error', { status: 400 });
	}

	const db = platform?.env?.DB;
	if (!db) return new Response('Database unavailable', { status: 503 });

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const kysely = new Kysely<any>({ dialect: new D1Dialect({ database: db }) });
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const kv = platform?.env?.USAGE_KV;

	const PRODUCT_PLAN_MAP: Record<string, { plan: 'seller' | 'pro' | 'growth'; ops_limit: number }> =
		{
			[env.POLAR_PRODUCT_ID_SELLER_MONTHLY]: { plan: 'seller', ops_limit: 300 },
			[env.POLAR_PRODUCT_ID_SELLER_YEARLY]: { plan: 'seller', ops_limit: 300 },
			[env.POLAR_PRODUCT_ID_PRO_MONTHLY]: { plan: 'pro', ops_limit: 1200 },
			[env.POLAR_PRODUCT_ID_PRO_YEARLY]: { plan: 'pro', ops_limit: 1200 },
			// Inert until POLAR_PRODUCT_ID_GROWTH_* env vars are set to the Polar product
			// IDs. `?? ''` keeps the computed key a string before the vars are defined
			// (svelte-kit only types known env vars as string); '' never matches a real id.
			[env.POLAR_PRODUCT_ID_GROWTH_MONTHLY ?? '']: { plan: 'growth', ops_limit: 5000 },
			[env.POLAR_PRODUCT_ID_GROWTH_YEARLY ?? '']: { plan: 'growth', ops_limit: 5000 }
		};

	switch (event.type) {
		// Subscription became active (first payment succeeded).
		case 'subscription.active':
		// Subscription was created (may still be awaiting payment).
		case 'subscription.created':
		// Subscription renewed or plan changed.
		case 'subscription.updated': {
			const sub = event.data;
			const userId = await resolveUserId(db, sub.customer);
			if (!userId) break;

			const isActive = sub.status === 'active';
			const tier = PRODUCT_PLAN_MAP[sub.product.id];
			if (!tier) {
				console.error(
					`[webhook] Unknown product id=${sub.product.id}. Known: ${JSON.stringify(Object.keys(PRODUCT_PLAN_MAP))}`
				);
			}
			const resolvedTier = tier ?? { plan: 'free' as const, ops_limit: 30 };
			const plan = isActive ? resolvedTier.plan : 'free';
			const opsLimit = isActive ? resolvedTier.ops_limit : 30;
			const periodEnd = sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).getTime() : null;
			const now = Date.now();

			await kysely
				.insertInto('profile')
				.values({
					user_id: userId,
					plan,
					polar_subscription_id: sub.id,
					polar_customer_id: sub.customer.id,
					quota_period_end: periodEnd,
					ops_limit: opsLimit,
					created_at: now,
					updated_at: now
				})
				.onConflict((oc) =>
					oc.column('user_id').doUpdateSet({
						plan,
						polar_subscription_id: sub.id,
						polar_customer_id: sub.customer.id,
						quota_period_end: periodEnd,
						ops_limit: opsLimit,
						updated_at: now
					})
				)
				.execute();
			await updateUsageKv(kv, userId, plan, opsLimit);
			await reseedBucket(userId, plan, opsLimit, periodEnd);
			// Keep the Resend contact's `tier` property honest. Segments are built
			// on it, so a subscriber left sitting at `free` would keep receiving the
			// upgrade nudges they have just paid to stop seeing. Awaited after the
			// D1 write like every other mirror, and it swallows its own errors.
			await mirrorPlan(db, platform?.env?.RESEND_API_KEY, userId);
			if (isActive) {
				// Runs on all three of created/active/updated, not just active, so the
				// follow-up cancel gets more than one attempt. See settleConversion.
				const recovery = sub.discountId ? await recoveryForDiscount(db, sub.discountId) : null;
				await settleConversion(
					db,
					platform?.env?.RESEND_API_KEY,
					userId,
					sub.discountId ?? null
				).catch((e) => console.error('[abandoned-cart] settle failed:', e));

				const posthog = getPostHogClient();
				posthog.capture({
					distinctId: userId,
					event: 'subscription_activated',
					properties: { plan, ops_limit: opsLimit, webhook_event: event.type }
				});
				if (recovery) {
					posthog.capture({
						distinctId: userId,
						event: 'abandoned_cart_converted',
						properties: { plan, discount_code: recovery.discount_code, checkout_id: recovery.id }
					});
				}
				await posthog.flush();
			}
			break;
		}

		// Checkout session timed out without being completed. This is the abandoned
		// cart trigger. It is inert until `checkout.expired` is ticked on for this
		// endpoint in the Polar dashboard — adding the case here is not enough.
		case 'checkout.expired': {
			const co = event.data;
			const posthog = getPostHogClient();

			const userId = await resolveUserId(db, {
				externalId: co.externalCustomerId,
				email: co.customerEmail
			});
			const email = co.customerEmail;
			// Billing country, for the payment-method targeting in the recovery
			// email (see indiaPaymentNote in emails/abandonedCart). Null when the
			// buyer left before filling the address in, which is fine: a decline
			// happens after that step.
			const country = co.customerBillingAddress?.country ?? null;
			// Only subscription plans. A day pass checkout that expires is not a
			// cart we have an offer for, and the discount is scoped to monthly
			// subscription products anyway.
			const target = planForProduct(co.productId);

			const skip = !userId ? 'no_user' : !email ? 'no_email' : !target ? 'not_a_plan' : null;
			if (skip) {
				posthog.capture({
					distinctId: userId ?? email ?? 'anonymous',
					event: 'abandoned_cart_detected',
					properties: { qualified: false, reason: skip }
				});
				await posthog.flush();
				break;
			}

			const qualified = await qualifyForRecovery(db, userId!);
			posthog.capture({
				distinctId: userId!,
				event: 'abandoned_cart_detected',
				properties: {
					qualified: qualified.ok,
					reason: qualified.ok ? null : qualified.reason,
					plan: target!.plan,
					country
				}
			});

			if (!qualified.ok) {
				await posthog.flush();
				break;
			}

			// Claim before minting. A Polar redelivery that gets here concurrently
			// loses this insert and exits, rather than minting a second live code.
			const claimed = await claimCheckout(db, {
				id: co.id,
				userId: userId!,
				email: email!,
				productId: co.productId,
				plan: target!.plan,
				billing: target!.billing,
				country
			});
			if (!claimed) {
				await posthog.flush();
				break;
			}

			const discount = await mintAbandonedCartDiscount(userId!);
			if (!discount) {
				// The row stays claimed with no discount. Deliberate: retrying risks
				// a duplicate mint, and the 30-day suppression will not trap the user
				// forever. The console.error in mintAbandonedCartDiscount is the alert.
				await posthog.flush();
				break;
			}

			const emails = await sendAbandonedCartEmails(platform?.env?.RESEND_API_KEY, email!, userId!, {
				plan: target!.plan,
				// Always offer monthly. The discount is scoped to the monthly
				// products, so linking someone back to an annual checkout would
				// hand them a code Polar then refuses to apply.
				billing: 'monthly',
				code: discount.code,
				appUrl: PUBLIC_APP_URL,
				country
			});

			await attachDiscount(db, co.id, discount, emails);

			posthog.capture({
				distinctId: userId!,
				event: 'abandoned_cart_email_sent',
				properties: {
					plan: target!.plan,
					discount_code: discount.code,
					scheduled_followup: emails.followupId !== null
				}
			});
			await posthog.flush();
			break;
		}

		// User re-activated a previously cancelled subscription before it expired.
		case 'subscription.uncanceled': {
			const sub = event.data;
			const userId = await resolveUserId(db, sub.customer);
			if (!userId) break;

			const unctier = PRODUCT_PLAN_MAP[sub.product.id];
			if (!unctier) {
				console.error(`[webhook] uncanceled: Unknown product id=${sub.product.id}`);
			}
			const tier = unctier ?? { plan: 'free' as const, ops_limit: 25 };
			const periodEnd = sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).getTime() : null;
			const now = Date.now();

			await kysely
				.insertInto('profile')
				.values({
					user_id: userId,
					plan: tier.plan,
					polar_subscription_id: sub.id,
					polar_customer_id: sub.customer.id,
					quota_period_end: periodEnd,
					ops_limit: tier.ops_limit,
					created_at: now,
					updated_at: now
				})
				.onConflict((oc) =>
					oc.column('user_id').doUpdateSet({
						plan: tier.plan,
						polar_subscription_id: sub.id,
						polar_customer_id: sub.customer.id,
						quota_period_end: periodEnd,
						ops_limit: tier.ops_limit,
						updated_at: now
					})
				)
				.execute();
			await updateUsageKv(kv, userId, tier.plan, tier.ops_limit);
			await reseedBucket(userId, tier.plan, tier.ops_limit, periodEnd);
			await mirrorPlan(db, platform?.env?.RESEND_API_KEY, userId);
			break;
		}

		// Subscription cancelled — downgrade at period end (Polar handles access until then).
		// subscription.canceled fires when they cancel but still have time left.
		// subscription.revoked fires when access is immediately removed.
		case 'subscription.canceled':
		case 'subscription.revoked': {
			const sub = event.data;
			const userId = await resolveUserId(db, sub.customer);
			if (!userId) break;

			const now = Date.now();
			await kysely
				.insertInto('profile')
				.values({
					user_id: userId,
					plan: 'free',
					polar_subscription_id: null,
					polar_customer_id: sub.customer.id,
					quota_period_end: null,
					ops_limit: 30,
					created_at: now,
					updated_at: now
				})
				.onConflict((oc) =>
					oc.column('user_id').doUpdateSet({
						plan: 'free',
						polar_subscription_id: null,
						polar_customer_id: sub.customer.id,
						quota_period_end: null,
						ops_limit: 30,
						updated_at: now
					})
				)
				.execute();
			await updateUsageKv(kv, userId, 'free', 30);
			await reseedBucket(userId, 'free', 30, null);
			await mirrorPlan(db, platform?.env?.RESEND_API_KEY, userId);
			const posthog = getPostHogClient();
			posthog.capture({
				distinctId: userId,
				event: 'subscription_cancelled',
				properties: { webhook_event: event.type }
			});
			await posthog.flush();
			break;
		}

		// One-time day pass purchase.
		case 'order.created': {
			const order = event.data;
			// Only process paid, one-time purchases for the day pass product.
			if (order.status !== 'paid') break;
			if (order.billingReason !== 'purchase') break;
			if (order.product?.id !== env.POLAR_PRODUCT_ID_DAY_PASS) break;

			const email = order.customer.email;
			if (!email) break;

			// A subscriber gets the pass as a top-up. The path below writes
			// plan 'day' over whatever they had, and a lapsed pass reads as
			// free, so a Seller, Pro or Growth customer who bought one was on
			// the free tier a day later. Checked before the magic link: they
			// already have an account, and a Polar retry would resend it.
			const existing = await db
				.prepare(
					'SELECT u.id AS id, p.plan AS plan FROM user u LEFT JOIN profile p ON p.user_id = u.id WHERE u.email = ? LIMIT 1'
				)
				.bind(email)
				.first<{ id: string; plan: string | null }>();
			if (existing?.plan && SUBSCRIPTION_PLANS.has(existing.plan)) {
				const status = await creditBucket(existing.id, 100, order.id);
				if (status === 'ok') {
					const posthog = getPostHogClient();
					posthog.capture({
						distinctId: existing.id,
						event: 'day_pass_activated',
						properties: { polar_order_id: order.id, mode: 'subscriber_credit', plan: existing.plan }
					});
					await posthog.flush();
				}
				break;
			}

			// A buyer with an account gets the pass now. A first-time buyer has
			// none yet: the magic-link plugin creates the user when the link is
			// clicked, not when it is sent, so the order is parked and the
			// user-create hook in $lib/auth grants it on activation. This used to
			// look the email up, find nobody and stop, and first-time buyers paid
			// for a pass they never received. Parked before the link goes out, so
			// even an instant click finds the row.
			const userRow = await db
				.prepare('SELECT id, email FROM user WHERE lower(email) = lower(?) LIMIT 1')
				.bind(email)
				.first<{ id: string; email: string }>();

			if (userRow) {
				await grantDayPass(db, platform?.env?.RESEND_API_KEY, userRow, order.id);
			} else {
				// Thrown on purpose if it fails (e.g. migration 0005 not applied):
				// Polar retries a 500, and a dropped row is a paid pass lost.
				await parkDayPass(db, email, order.id);
				const posthog = getPostHogClient();
				posthog.capture({
					distinctId: email,
					event: 'day_pass_pending',
					properties: { polar_order_id: order.id }
				});
				await posthog.flush();
			}

			await sendDayPassLink(
				db,
				platform?.env?.RESEND_API_KEY,
				email,
				order.metadata?.return_path
			).catch((e: unknown) => console.error('[daypass] magic link send failed:', e));
			break;
		}

		default:
			// Unhandled event types — return 200 so Polar doesn't retry.
			break;
	}

	return new Response(null, { status: 200 });
};
