import type { RequestHandler } from './$types';

// AI Catalog for domain-level MCP discovery, per the Server Card extension
// (modelcontextprotocol/ext-server-card, docs/discovery.md). The catalog is the
// site-wide artifact and belongs on the apex domain; the Server Card itself is
// served by the MCP worker at mcp.mochify.app/mcp/server-card, which the spec
// prefers over putting a card under .well-known ("a card under .well-known adds
// no value" - the card can live anywhere the catalog points).
//
// Entries repeat only the card's display name, which ARD-style validators
// require on every entry (the isitagentready.com scan rejects an entry without
// it). Description and version stay on the card: clients read those from there,
// so there is nothing here to drift.
export const prerender = true;

export const GET: RequestHandler = () => {
	const catalog = {
		specVersion: '1.0',
		entries: [
			{
				identifier: 'urn:air:mochify.app:mcp:mochify',
				displayName: 'Mochify',
				type: 'application/mcp-server-card+json',
				url: 'https://mcp.mochify.app/mcp/server-card'
			}
		]
	};

	return new Response(JSON.stringify(catalog, null, 2), {
		headers: {
			'Content-Type': 'application/ai-catalog+json',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
