/**
 * Sanitise a `?next=` redirect target.
 *
 * Shared by the login and register loads rather than copied into each: this is
 * the open-redirect guard, and a duplicated security check is the kind that
 * drifts when only one copy gets fixed.
 *
 * Same-origin paths only. A leading `//` is protocol-relative and escapes the
 * origin, and any `://` is an absolute URL, so both are rejected in favour of
 * the fallback.
 */
export function sanitiseNext(raw: string | null, fallback = '/dashboard'): string {
	const candidate = raw ?? fallback;
	if (candidate.startsWith('/') && !candidate.startsWith('//') && !candidate.includes('://'))
		return candidate;
	return fallback;
}

/** Plans the register page can present a tailored panel for. */
const PAID_PLANS = new Set(['seller', 'pro']);

/**
 * Which plan the visitor was reaching for when they were bounced to signup.
 *
 * `/api/checkout` sends unauthenticated buyers to `/auth/register?next=/api/checkout?plan=seller...`,
 * so the intent is already in the URL and only needs reading. An explicit
 * `?plan=` wins, so the page can also be linked directly from a campaign.
 * Returns null for anything unrecognised, which renders the free-account panel.
 */
export function planIntent(url: URL, next: string): string | null {
	const explicit = url.searchParams.get('plan');
	if (explicit && PAID_PLANS.has(explicit)) return explicit;

	const query = next.indexOf('?');
	if (query === -1) return null;
	const fromNext = new URLSearchParams(next.slice(query + 1)).get('plan');
	return fromNext && PAID_PLANS.has(fromNext) ? fromNext : null;
}
