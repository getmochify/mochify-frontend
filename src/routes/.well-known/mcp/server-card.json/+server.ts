import type { RequestHandler } from './$types';

// The MCP Server Card on the apex domain, at the path agent-readiness scanners
// probe. The card itself is owned by the MCP worker (mcp.mochify.app/mcp/server-card,
// which ai-catalog.json points at), so this relays it rather than keeping a
// second copy here that would fall behind the worker's version and tool list.
// Not prerendered for the same reason: a build-time snapshot would go stale on
// the next worker deploy, and a worker outage would fail the frontend build.
const CARD_URL = 'https://mcp.mochify.app/mcp/server-card';

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		const res = await fetch(CARD_URL, { headers: { Accept: 'application/json' } });
		if (!res.ok) return new Response('Server card unavailable', { status: 502 });
		return new Response(await res.text(), {
			headers: {
				'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
				'Cache-Control': 'public, max-age=3600',
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch {
		return new Response('Server card unavailable', { status: 502 });
	}
};
