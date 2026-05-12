import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { env } from '$env/dynamic/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import type { RequestHandler } from './$types';
import { getPostHogClient } from '$lib/server/posthog';
import { createAuth } from '$lib/auth';

async function sha256Hex(input: string): Promise<string> {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

async function reseedBucket(
	userId: string,
	plan: string,
	opsLimit: number,
	quotaPeriodEnd: number | null
): Promise<void> {
	if (!env.CF_WORKER_URL || !env.CF_WORKER_TOKEN) return;
	const identifier = await sha256Hex(userId);
	let ttl = 30 * 24 * 60 * 60;
	if (quotaPeriodEnd) {
		const now = Date.now();
		if (quotaPeriodEnd > now) ttl = Math.floor((quotaPeriodEnd - now) / 1000);
	}
	await fetch(`${env.CF_WORKER_URL}/seed/${identifier}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-Worker-Token': env.CF_WORKER_TOKEN },
		body: JSON.stringify({ remaining: opsLimit, quota: opsLimit, plan, ttl, userId })
	}).then(async (r) => {
		if (!r.ok) console.error(`[webhook] reseedBucket failed: ${r.status} ${await r.text().catch(() => '')}`);
	}).catch((e) => console.error('[webhook] reseedBucket fetch error:', e));
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

	const PRODUCT_PLAN_MAP: Record<string, { plan: 'seller' | 'pro'; ops_limit: number }> = {
		[env.POLAR_PRODUCT_ID_SELLER_MONTHLY]: { plan: 'seller', ops_limit: 300 },
		[env.POLAR_PRODUCT_ID_SELLER_YEARLY]: { plan: 'seller', ops_limit: 300 },
		[env.POLAR_PRODUCT_ID_PRO_MONTHLY]: { plan: 'pro', ops_limit: 1200 },
		[env.POLAR_PRODUCT_ID_PRO_YEARLY]: { plan: 'pro', ops_limit: 1200 }
	};

	switch (event.type) {
		// Subscription became active (first payment succeeded).
		case 'subscription.active':
		// Subscription was created (may still be awaiting payment).
		case 'subscription.created':
		// Subscription renewed or plan changed.
		case 'subscription.updated': {
			const sub = event.data;
			const userId = sub.customer.externalId;
			if (!userId) break;

			const isActive = sub.status === 'active';
			const tier = PRODUCT_PLAN_MAP[sub.product.id];
			if (!tier) {
				console.error(`[webhook] Unknown product id=${sub.product.id}. Known: ${JSON.stringify(Object.keys(PRODUCT_PLAN_MAP))}`);
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
			await reseedBucket(userId, plan, opsLimit, periodEnd);
			if (isActive) {
				const posthog = getPostHogClient();
				posthog.capture({
					distinctId: userId,
					event: 'subscription_activated',
					properties: { plan, ops_limit: opsLimit, webhook_event: event.type }
				});
				await posthog.flush();
			}
			break;
		}

		// User re-activated a previously cancelled subscription before it expired.
		case 'subscription.uncanceled': {
			const sub = event.data;
			const userId = sub.customer.externalId;
			if (!userId) break;

			const unctier = PRODUCT_PLAN_MAP[sub.product.id];
			if (!unctier) {
				console.error(`[webhook] uncanceled: Unknown product id=${sub.product.id}`);
			}
			const tier = unctier ?? { plan: 'free' as const, ops_limit: 30 };
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
			await reseedBucket(userId, tier.plan, tier.ops_limit, periodEnd);
			break;
		}

		// Subscription cancelled — downgrade at period end (Polar handles access until then).
		// subscription.canceled fires when they cancel but still have time left.
		// subscription.revoked fires when access is immediately removed.
		case 'subscription.canceled':
		case 'subscription.revoked': {
			const sub = event.data;
			const userId = sub.customer.externalId;
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
			await reseedBucket(userId, 'free', 30, null);
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

			// Send magic link — creates the user in D1 if they don't exist yet.
			const auth = createAuth(db, platform?.env?.RESEND_API_KEY);
			await auth.api.signInMagicLink({
				body: { email, callbackURL: '/' },
				headers: new Headers({ origin: PUBLIC_APP_URL }),
			}).catch((e: unknown) => console.error('[daypass] magic link send failed:', e));

			// Resolve user ID (guaranteed to exist now that magic link ran).
			const userRow = await db
				.prepare('SELECT id FROM user WHERE email = ? LIMIT 1')
				.bind(email)
				.first<{ id: string }>();

			if (!userRow) break;

			const quotaPeriodEnd = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

			await kysely
				.insertInto('profile')
				.values({
					user_id: userRow.id,
					plan: 'day',
					ops_limit: 500,
					quota_period_end: quotaPeriodEnd,
					updated_at: new Date().toISOString()
				})
				.onConflict((oc) =>
					oc.column('user_id').doUpdateSet({
						plan: 'day',
						ops_limit: 500,
						quota_period_end: quotaPeriodEnd,
						updated_at: new Date().toISOString()
					})
				)
				.execute();

			await reseedBucket(userRow.id, 'day', 500, quotaPeriodEnd);

			const posthog = getPostHogClient();
			posthog.capture({
				distinctId: userRow.id,
				event: 'day_pass_activated',
				properties: { polar_order_id: order.id }
			});
			await posthog.flush();
			break;
		}

		default:
			// Unhandled event types — return 200 so Polar doesn't retry.
			break;
	}

	return new Response(null, { status: 200 });
};
