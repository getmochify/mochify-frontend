import { verifyUnsubscribeToken, setMarketingOptOut } from '$lib/server/unsubscribe';
import type { RequestHandler } from './$types';

// RFC 8058 one-click unsubscribe. This is the target of the List-Unsubscribe /
// List-Unsubscribe-Post headers, which is what renders Gmail's and Outlook's
// own "Unsubscribe" button next to the sender name. Mail providers weight that
// button heavily in reputation scoring, so shipping it protects deliverability
// of the transactional mail (magic links, receipts) sharing this domain.
//
// It lives in a +server.ts rather than as a form action because the POST arrives
// cross-origin from the mail provider with no origin header, which SvelteKit's
// CSRF protection correctly rejects for form actions. Safe here because the
// signed token is the only authority the endpoint accepts.

export const POST: RequestHandler = async ({ url, platform }) => {
	const token = url.searchParams.get('token') ?? '';
	const userId = await verifyUnsubscribeToken(token);
	// Always 200 for a bad token. Mail providers retry and then flag non-2xx
	// responses against sender reputation, and there is nothing the sender of a
	// malformed token could usefully do with the error anyway.
	if (!userId) return new Response(null, { status: 200 });

	const db = platform?.env?.DB;
	if (!db) {
		console.error('[unsubscribe] one-click: DB binding unavailable');
		return new Response(null, { status: 200 });
	}

	try {
		await setMarketingOptOut(db, userId);
	} catch (e) {
		console.error('[unsubscribe] one-click opt-out write failed:', e);
	}

	return new Response(null, { status: 200 });
};
