import type { RequestHandler } from './$types';

// Auth.md agent-registration discovery: how an AI agent gets credentials for
// Mochify. Self-contained on purpose. The REST API (api.mochify.app) takes plain
// API keys and publishes no OAuth metadata, so there is no protected-resource
// document here to point at; only the hosted MCP server (mcp.mochify.app) runs
// OAuth, and its metadata lives on that host. There is also no `agent_auth`
// block anywhere: Mochify has no endpoint that lets an agent create an account
// or claim one, and advertising a registration method that does not exist is
// worse than advertising none. Keep this in step with /docs and static/llms.txt.
export const prerender = true;

const BODY = `# Mochify auth.md

How AI agents authenticate to Mochify, an image compression and conversion service. This page is for agents, MCP clients, and the developers who configure them.

Mochify has no endpoint that creates an account on an agent's behalf. A person creates the account at https://mochify.app/auth/register, then grants the agent access through one of the methods below.

## Methods

### 1. Hosted MCP server: OAuth 2.0 with dynamic client registration

For MCP clients (Claude, Cursor, Windsurf, Gemini, and any client that supports remote MCP servers).

- MCP endpoint: https://mcp.mochify.app/mcp
- Protected resource metadata: https://mcp.mochify.app/.well-known/oauth-protected-resource
- Authorization server metadata: https://mcp.mochify.app/.well-known/oauth-authorization-server
- Client registration (RFC 7591): \`POST https://mcp.mochify.app/oauth/register\` with \`redirect_uris\` (https, http on loopback, or an app scheme) and an optional \`client_name\`. Returns a \`client_id\` and \`client_secret\` that do not expire.
- Flow: authorization code with PKCE (\`S256\`), scope \`squish\`. The person signs in to their Mochify account once and approves the client.
- Tokens: short-lived access tokens with rotating refresh tokens. Send the access token as \`Authorization: Bearer <access_token>\` to the MCP endpoint.

### 2. REST API and CLI: API key

For scripts, CI, the Mochify CLI, and agents calling the REST API directly.

- Provisioning: the account holder generates a key at https://mochify.app/dashboard#developer. The key is shown once.
- Base URL: https://api.mochify.app
- Use: \`Authorization: Bearer <api_key>\` on every request. The CLI and local MCP server (\`mochify serve\`) read it from the \`MOCHIFY_API_KEY\` environment variable.
- Check quota: \`GET https://api.mochify.app/v1/checkTokens\` returns \`{ remaining, available }\`.

### 3. Anonymous

No registration and no credential. Requests to the REST API without an \`Authorization\` header run on the anonymous free tier, limited by IP address (3 operations per batch). \`GET /v1/checkTokens\` works anonymously too.

## Plans and limits

Usage counts against the account's monthly quota whichever method is used. Plans: https://mochify.app/pricing

## Reference

- API reference: https://mochify.app/docs
- Developer reference for agents: https://mochify.app/llms-full.txt
- Contact: hello@mochify.app
`;

export const GET: RequestHandler = () =>
	new Response(BODY, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
