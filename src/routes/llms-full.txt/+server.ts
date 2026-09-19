import { renderLlmsFull } from '$lib/server/llmsFull';
import { getPostHogClient } from '$lib/server/posthog';

// Not prerendered, unlike /sitemap.xml. A prerendered route becomes a static
// asset served by Cloudflare's asset handler, which means this handler's
// Content-Type and Cache-Control are dropped and no request ever reaches the
// worker. The handoff asked for `text/plain; charset=utf-8`, no long CDN cache,
// and (if cheap) a count of who fetches it. All three need the request to reach
// code, so it runs dynamically and memoizes the body per isolate instead.
export const prerender = false;

export async function GET({ request }) {
	const body = renderLlmsFull();

	// Which agents actually read this is the open question the handoff wants
	// answered in a month: the published research says almost nothing fetches
	// an llms.txt, with agent tooling the one exception. A user agent string is
	// the whole event; nothing about the caller is stored beyond it.
	try {
		const posthog = getPostHogClient();
		posthog.capture({
			distinctId: 'ai-discovery',
			event: 'ai_discovery_fetch',
			properties: {
				file: '/llms-full.txt',
				user_agent: request.headers.get('user-agent') ?? 'none',
				referer: request.headers.get('referer') ?? null
			}
		});
		await posthog.flush();
	} catch {
		/* never fail the fetch for telemetry */
	}

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			// Short edge cache: the file is cheap to render and the point of
			// generating it from source is that a deploy changes it immediately.
			'Cache-Control': 'public, max-age=0, s-maxage=300',
			'X-Robots-Tag': 'all'
		}
	});
}
