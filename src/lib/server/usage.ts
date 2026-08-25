import { tokensFetch } from '$lib/server/tokensWorker';

const FREE_QUOTA = 25;

export interface UsageSummary {
	used: number;
	remaining: number;
	quota: number;
	plan: string;
	updatedAt: string | null;
}

interface UsageFetchContext {
	locals: App.Locals;
	request: Request;
	platform: App.Platform | undefined;
}

// Shared by the dashboard's server load (so the usage card has real numbers on
// first paint, no loading flash) and the standalone /api/usage endpoint (still
// used by PromptForm and other client-side callers). Both ultimately hit the
// same TOKENS service binding — keeping the call and its fallback in one place
// means the two can't drift apart.
//
// Never throws: on any failure (worker unreachable, non-OK response) it
// resolves to the same free-tier defaults `/api/usage` has always returned in
// that case, so a Promise.all caller degrades gracefully instead of failing
// the whole load.
export async function fetchUsage({
	locals,
	request,
	platform
}: UsageFetchContext): Promise<UsageSummary> {
	const headers: Record<string, string> = {
		'CF-Connecting-IP': request.headers.get('CF-Connecting-IP') ?? ''
	};
	if (locals.session) {
		headers['Authorization'] = `Bearer ${locals.session.token}`;
	}

	try {
		const workerRes = await tokensFetch(platform, '/v1/usage', { headers });
		if (workerRes.ok) {
			const body = (await workerRes.json()) as {
				remaining: number;
				quota: number;
				plan: string;
				available: boolean;
			};
			const used = Math.max(0, body.quota - body.remaining);
			return {
				used,
				remaining: body.remaining,
				quota: body.quota,
				plan: body.plan,
				updatedAt: new Date().toISOString()
			};
		}
	} catch {
		// Worker unreachable — return safe defaults.
	}

	return { used: 0, remaining: FREE_QUOTA, quota: FREE_QUOTA, plan: 'free', updatedAt: null };
}
