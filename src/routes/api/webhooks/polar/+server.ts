import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { createClient } from '@supabase/supabase-js';
import {
    SUPABASE_SERVICE_ROLE_KEY,
    POLAR_WEBHOOK_SECRET,
    POLAR_PRODUCT_ID_LITE_MONTHLY,
    POLAR_PRODUCT_ID_LITE_YEARLY,
    POLAR_PRODUCT_ID_PRO_MONTHLY,
    POLAR_PRODUCT_ID_PRO_YEARLY,
} from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

// Service-role client — bypasses RLS so webhooks can write any profile.
function adminClient() {
    return createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

const PRODUCT_PLAN_MAP: Record<string, { plan: 'lite' | 'pro'; ops_limit: number }> = {
    [POLAR_PRODUCT_ID_LITE_MONTHLY]: { plan: 'lite', ops_limit: 300 },
    [POLAR_PRODUCT_ID_LITE_YEARLY]:  { plan: 'lite', ops_limit: 300 },
    [POLAR_PRODUCT_ID_PRO_MONTHLY]:  { plan: 'pro',  ops_limit: 1200 },
    [POLAR_PRODUCT_ID_PRO_YEARLY]:   { plan: 'pro',  ops_limit: 1200 },
}

export const POST: RequestHandler = async ({ request }) => {
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

    const supabase = adminClient();

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

            await supabase.from('profiles').upsert(
                {
                    user_id: userId,
                    plan: isActive ? tier.plan : 'free',
                    polar_subscription_id: sub.id,
                    polar_customer_id: sub.customer.id,
                    quota_period_end: sub.currentPeriodEnd?.toISOString() ?? null,
                    ops_limit: isActive ? tier.ops_limit : 30,
                },
                { onConflict: 'user_id' }
            );
            break;
        }

        // User re-activated a previously cancelled subscription before it expired.
        case 'subscription.uncanceled': {
            const sub = event.data;
            const userId = sub.customer.externalId;
            if (!userId) break;

            const tier = PRODUCT_PLAN_MAP[sub.product.id] ?? { plan: 'free' as const, ops_limit: 30 };

            await supabase.from('profiles').upsert(
                {
                    user_id: userId,
                    plan: tier.plan,
                    polar_subscription_id: sub.id,
                    polar_customer_id: sub.customer.id,
                    quota_period_end: sub.currentPeriodEnd?.toISOString() ?? null,
                    ops_limit: tier.ops_limit,
                },
                { onConflict: 'user_id' }
            );
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

            await supabase.from('profiles').upsert(
                {
                    user_id: userId,
                    plan: 'free',
                    polar_subscription_id: null,
                    polar_customer_id: sub.customer.id,
                    quota_period_end: null,
                    ops_limit: 30,
                },
                { onConflict: 'user_id' }
            );
            break;
        }

        default:
            // Unhandled event types — return 200 so Polar doesn't retry.
            break;
    }

    return new Response(null, { status: 200 });
};
