import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import {
    POLAR_WEBHOOK_SECRET,
    POLAR_PRODUCT_ID_SELLER_MONTHLY,
    POLAR_PRODUCT_ID_SELLER_YEARLY,
    POLAR_PRODUCT_ID_PRO_MONTHLY,
    POLAR_PRODUCT_ID_PRO_YEARLY,
    CF_WORKER_URL,
    CF_WORKER_TOKEN,
} from '$env/static/private';
import type { RequestHandler } from './$types';

async function sha256Hex(input: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function reseedBucket(
    userId: string,
    plan: string,
    opsLimit: number,
    quotaPeriodEnd: string | null,
): Promise<void> {
    if (!CF_WORKER_URL || !CF_WORKER_TOKEN) return
    const identifier = await sha256Hex(userId)
    let ttl = 30 * 24 * 60 * 60
    if (quotaPeriodEnd) {
        const periodEnd = new Date(quotaPeriodEnd).getTime()
        const now = Date.now()
        if (periodEnd > now) ttl = Math.floor((periodEnd - now) / 1000)
    }
    await fetch(`${CF_WORKER_URL}/seed/${identifier}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Worker-Token': CF_WORKER_TOKEN },
        body: JSON.stringify({ remaining: opsLimit, quota: opsLimit, plan, ttl, userId }),
    }).catch(() => {})
}

const PRODUCT_PLAN_MAP: Record<string, { plan: 'seller' | 'pro'; ops_limit: number }> = {
    [POLAR_PRODUCT_ID_SELLER_MONTHLY]: { plan: 'seller', ops_limit: 300 },
    [POLAR_PRODUCT_ID_SELLER_YEARLY]:  { plan: 'seller', ops_limit: 300 },
    [POLAR_PRODUCT_ID_PRO_MONTHLY]:    { plan: 'pro',    ops_limit: 1200 },
    [POLAR_PRODUCT_ID_PRO_YEARLY]:     { plan: 'pro',    ops_limit: 1200 },
}

export const POST: RequestHandler = async ({ request, platform }) => {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    let event;
    try {
        event = validateEvent(body, headers, POLAR_WEBHOOK_SECRET);
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
            const tier = PRODUCT_PLAN_MAP[sub.product.id] ?? { plan: 'free' as const, ops_limit: 30 };
            const plan = isActive ? tier.plan : 'free';
            const opsLimit = isActive ? tier.ops_limit : 30;
            const periodEnd = sub.currentPeriodEnd?.toISOString() ?? null;

            await kysely
                .insertInto('profile')
                .values({
                    user_id: userId,
                    plan,
                    polar_subscription_id: sub.id,
                    polar_customer_id: sub.customer.id,
                    quota_period_end: periodEnd,
                    ops_limit: opsLimit,
                    updated_at: new Date().toISOString(),
                })
                .onConflict(oc => oc.column('user_id').doUpdateSet({
                    plan,
                    polar_subscription_id: sub.id,
                    polar_customer_id: sub.customer.id,
                    quota_period_end: periodEnd,
                    ops_limit: opsLimit,
                    updated_at: new Date().toISOString(),
                }))
                .execute();
            await reseedBucket(userId, plan, opsLimit, periodEnd);
            break;
        }

        // User re-activated a previously cancelled subscription before it expired.
        case 'subscription.uncanceled': {
            const sub = event.data;
            const userId = sub.customer.externalId;
            if (!userId) break;

            const tier = PRODUCT_PLAN_MAP[sub.product.id] ?? { plan: 'free' as const, ops_limit: 30 };
            const periodEnd = sub.currentPeriodEnd?.toISOString() ?? null;

            await kysely
                .insertInto('profile')
                .values({
                    user_id: userId,
                    plan: tier.plan,
                    polar_subscription_id: sub.id,
                    polar_customer_id: sub.customer.id,
                    quota_period_end: periodEnd,
                    ops_limit: tier.ops_limit,
                    updated_at: new Date().toISOString(),
                })
                .onConflict(oc => oc.column('user_id').doUpdateSet({
                    plan: tier.plan,
                    polar_subscription_id: sub.id,
                    polar_customer_id: sub.customer.id,
                    quota_period_end: periodEnd,
                    ops_limit: tier.ops_limit,
                    updated_at: new Date().toISOString(),
                }))
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

            await kysely
                .insertInto('profile')
                .values({
                    user_id: userId,
                    plan: 'free',
                    polar_subscription_id: null,
                    polar_customer_id: sub.customer.id,
                    quota_period_end: null,
                    ops_limit: 30,
                    updated_at: new Date().toISOString(),
                })
                .onConflict(oc => oc.column('user_id').doUpdateSet({
                    plan: 'free',
                    polar_subscription_id: null,
                    polar_customer_id: sub.customer.id,
                    quota_period_end: null,
                    ops_limit: 30,
                    updated_at: new Date().toISOString(),
                }))
                .execute();
            await reseedBucket(userId, 'free', 30, null);
            break;
        }

        default:
            // Unhandled event types — return 200 so Polar doesn't retry.
            break;
    }

    return new Response(null, { status: 200 });
};
