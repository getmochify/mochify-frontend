import { fail } from '@sveltejs/kit';
import { verifyUnsubscribeToken, setMarketingOptOut } from '$lib/server/unsubscribe';
import type { Actions, PageServerLoad } from './$types';

// The GET deliberately does NOT opt anyone out. Corporate mail scanners and link
// prefetchers (Outlook Safe Links, Gmail image proxy, various security gateways)
// fetch every URL in an inbound email, so a mutating GET unsubscribes people who
// never clicked anything. The page renders a confirm button; the POST does the work.
//
// Gmail's native "Unsubscribe" affordance is handled separately by the one-click
// endpoint, which is what the List-Unsubscribe-Post header points at.

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token') ?? '';
	const userId = token ? await verifyUnsubscribeToken(token) : null;
	return { token, valid: userId !== null };
};

export const actions: Actions = {
	default: async ({ request, platform }) => {
		const data = await request.formData();
		const token = ((data.get('token') as string) ?? '').trim();

		const userId = await verifyUnsubscribeToken(token);
		if (!userId) return fail(400, { error: 'That unsubscribe link is not valid or has expired.' });

		const db = platform?.env?.DB;
		if (!db) {
			console.error('[unsubscribe] DB binding unavailable');
			return fail(503, {
				error: 'Something went wrong on our end. Please email hello@mochify.app.'
			});
		}

		try {
			// Resend key passed so the contact is flipped in the same breath: a
			// broadcast going out an hour later must not reach someone who used
			// this page. A Resend failure is logged, not surfaced — the D1 write
			// has already stopped the sending we control.
			await setMarketingOptOut(db, userId, platform?.env?.RESEND_API_KEY);
		} catch (e) {
			console.error('[unsubscribe] opt-out write failed:', e);
			return fail(500, {
				error: 'Something went wrong on our end. Please email hello@mochify.app.'
			});
		}

		return { done: true };
	}
};
