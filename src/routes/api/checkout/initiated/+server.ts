import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { captureDayPassInitiated } from '$lib/server/dayPassCheckout';

const POLAR_CHECKOUT = /^https:\/\/(?:sandbox\.)?polar\.sh\/checkout\/polar_c_[A-Za-z0-9]+/;

/**
 * The click on a Day Pass checkout created ahead of it (`prewarm` on
 * `api/checkout`). That request skipped `checkout_initiated`, since nobody had
 * started a checkout yet; this sends it when someone does, with the same
 * properties the click-time path sends, so the `batch-queue` experiment counts
 * a warmed checkout exactly as it counts a cold one.
 *
 * Analytics only: it creates and changes nothing, so the body is checked for
 * shape and not for ownership.
 */
export const POST: RequestHandler = async (event) => {
	const body = (await event.request.json().catch(() => null)) as {
		plan?: unknown;
		url?: unknown;
		currency?: unknown;
		trigger?: unknown;
	} | null;
	const plan = body?.plan;
	if (
		(plan !== 'day' && plan !== 'dayplus') ||
		typeof body?.url !== 'string' ||
		!POLAR_CHECKOUT.test(body.url)
	) {
		return json({ error: 'invalid' }, { status: 400 });
	}
	const currency =
		typeof body.currency === 'string' && /^(?:[a-z]{3}|default)$/.test(body.currency)
			? body.currency
			: 'default';
	captureDayPassInitiated(event, {
		plan,
		currency,
		trigger: typeof body.trigger === 'string' ? body.trigger.slice(0, 100) : null,
		embed: true
	});
	return json({ ok: true });
};
