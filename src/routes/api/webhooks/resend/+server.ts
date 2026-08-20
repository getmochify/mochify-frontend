import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { setMarketingPreference } from '$lib/server/unsubscribe';
import type { RequestHandler } from './$types';

// The write-back half of the Resend contact mirror ($lib/server/resendContacts).
//
// Resend requires its own {{{RESEND_UNSUBSCRIBE_URL}}} token in every broadcast,
// so a broadcast unsubscribe flips the contact inside Resend and never touches
// our /unsubscribe route. Without this endpoint that opt-out would be invisible
// to D1 and the abandoned-cart stream would keep mailing someone who had just
// told us to stop — the exact failure a one-way sync produces.
//
// Deliberately writes D1 only, never back out to Resend. The change originated
// there; echoing it would leave the two systems trading updates over an opt-out
// neither of them owns. Our outbound mirror skips no-op writes for the same
// reason, so the loop closes after one hop in either direction.

/** Resend signs with Standard Webhooks; older deliveries use the svix-* names. */
function signatureHeaders(headers: Headers) {
	return {
		id: headers.get('webhook-id') ?? headers.get('svix-id') ?? '',
		timestamp: headers.get('webhook-timestamp') ?? headers.get('svix-timestamp') ?? '',
		signature: headers.get('webhook-signature') ?? headers.get('svix-signature') ?? ''
	};
}

async function optOutByEmail(db: D1Database, email: string, optOut: boolean): Promise<void> {
	// Case-insensitive because the address comes back from a third party and
	// nothing guarantees it round-trips in the case we stored it in.
	const row = await db
		.prepare('SELECT id FROM user WHERE lower(email) = lower(?) LIMIT 1')
		.bind(email)
		.first<{ id: string }>();
	// No match is routine: the imported contacts include customers who never
	// held an account here, and there is nothing to record for them.
	if (!row?.id) return;
	await setMarketingPreference(db, row.id, optOut);
}

export const POST: RequestHandler = async ({ request, platform }) => {
	const webhookSecret = env.RESEND_WEBHOOK_SECRET;
	const apiKey = platform?.env?.RESEND_API_KEY;
	if (!webhookSecret || !apiKey) {
		console.error('[resend-webhook] RESEND_WEBHOOK_SECRET or RESEND_API_KEY is not set');
		return new Response('Not configured', { status: 503 });
	}

	const payload = await request.text();

	let event;
	try {
		event = new Resend(apiKey).webhooks.verify({
			payload,
			headers: signatureHeaders(request.headers),
			webhookSecret
		});
	} catch {
		return new Response('Invalid signature', { status: 403 });
	}

	const db = platform?.env?.DB;
	// 503 rather than 200 so Resend retries — dropping an opt-out because a
	// binding was briefly missing is the one failure worth being noisy about.
	if (!db) {
		console.error('[resend-webhook] DB binding unavailable');
		return new Response('Database unavailable', { status: 503 });
	}

	try {
		switch (event.type) {
			case 'contact.updated':
				await optOutByEmail(db, event.data.email, event.data.unsubscribed);
				break;

			// Deleting a contact is not an unsubscribe in Resend's model, but from
			// D1's side the effect has to be the same: the address is no longer on
			// the list, so nothing marketing should go to it.
			case 'contact.deleted':
				await optOutByEmail(db, event.data.email, true);
				break;

			// A spam complaint is the loudest opt-out there is. Resend suppresses
			// the address on its own side; recording it here stops the abandoned
			// cart stream, which sends through the emails API and would otherwise
			// keep trying.
			case 'email.complained':
				for (const to of event.data.to) await optOutByEmail(db, to, true);
				break;
		}
	} catch (e) {
		console.error(`[resend-webhook] ${event.type} handling failed:`, e);
		return new Response('Handler error', { status: 500 });
	}

	return new Response(null, { status: 200 });
};
