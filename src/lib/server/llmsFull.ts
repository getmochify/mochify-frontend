// Renders /llms-full.txt from the same objects the site renders from.
//
// Scope, per the 2026-09-19 content-ops handoff: everything an agent needs to
// USE Mochify (REST API, CLI, both MCP surfaces, the per-surface privacy model,
// plan limits), and nothing of the guide library beyond a link and one line
// each. The audience is a developer who tells a coding agent "use mochify" and
// expects the endpoints, the auth header and the MCP setup out of one fetch.
//
// Two deliberate deviations from the handoff, both toward its own stated goal
// of "never stale":
//
//   1. It renders at request time rather than at build time. The handoff asked
//      for build-time generation so the file can never be hand-edited; deriving
//      it from the live modules on each request is strictly stronger, since
//      there is no artifact to edit or to go stale between deploys, and the
//      result is memoized per worker isolate so the cost is one render per cold
//      start for a file that gets fetched a few times a month.
//   2. `Authorization: Bearer` is the only auth scheme shown, and `/v1/prompt`
//      is described as a Magic Flow capability rather than a public REST
//      endpoint. Both follow the product facts ledger over the handoff text:
//      ledger v17 (Bearer, never x-api-key) and v24 (the operator decision of
//      2026-07-23 that /v1/prompt is not publicly documented as a REST
//      endpoint, and is served by a different service than api.mochify.app).

import {
	API_BASE_URL,
	auth,
	plans,
	planNotes,
	endpoints,
	errors,
	pdfOps,
	pdfParams,
	pdfOptimizeNotes,
	pdfExtractNote,
	pdfStorageParams,
	pdfStorageNote,
	pdfLimits,
	pdfJpegNote,
	surfaces,
	cli,
	mcp,
	privacyModel,
	magicFlow
} from '$lib/data/apiReference.js';
import { USD_PRICES, toMajorUnits } from '$lib/currency';
import { guides } from '$lib/data/guides';
import { imageTools, videoTools } from '$lib/data/solutions';

const SITE = 'https://mochify.app';

/** Injected by Vite (see vite.config.ts) so the header carries a real build date. */
declare const __BUILD_DATE__: string;
const BUILD_DATE = typeof __BUILD_DATE__ === 'string' ? __BUILD_DATE__ : 'unknown';

/**
 * HTML fragment to plain text.
 *
 * The data module stores descriptions as small HTML fragments so the docs page
 * can render them directly. Here they become text: links keep their anchor text
 * and gain an absolute URL in parentheses, because an agent reading this file
 * has no page to click through from.
 */
function toText(html: string): string {
	return html
		.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (_m, href: string, label: string) =>
			href.startsWith('http') ? `${label} (${href})` : `${label} (${SITE}${href})`
		)
		.replace(/<[^>]+>/g, '')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&ndash;/g, '\u2013')
		.replace(/&times;/g, '\u00d7')
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Last line of defence on the house rule: zero em dashes in published copy, in
 * any encoding. The data module should never contain one, but the guide and
 * solution card copy this file also renders was written elsewhere and does.
 * Rewriting somebody else's card copy is not this file's job; stripping the
 * character on the way out is.
 */
function noEmDash(text: string): string {
	return text.replace(/—|&mdash;|&#8212;|&#x2014;/gi, '-').replace(/ - +/g, ' - ');
}

function price(key: string | null | undefined): string {
	if (!key) return '$0';
	const amount = USD_PRICES[key];
	if (amount === undefined) return '';
	const major = toMajorUnits(amount, 'usd');
	// Whole dollars read as whole dollars: the Day Pass is "$2 one-time"
	// everywhere else it is quoted, not "$2.00".
	return `$${Number.isInteger(major) ? major : major.toFixed(2)}`;
}

function heading(text: string): string {
	return `\n## ${text}\n`;
}

function paramLines(
	params: {
		name: string;
		default?: string;
		alias?: string;
		description: string;
		valuesNote?: string;
		more?: string;
	}[]
): string {
	return params
		.map((p) => {
			const def = p.default ? ` (default: ${p.default})` : '';
			const alias = p.alias ? ` (alias: ${p.alias})` : '';
			// The docs page shows these as a muted values line and a second
			// paragraph; a text file has neither, so they join the sentence.
			const extra = [p.valuesNote, p.more]
				.filter(Boolean)
				.map((part) => ` ${toText(part as string)}`)
				.join('');
			return `- ${p.name}${alias}${def}: ${toText(p.description)}${extra}`;
		})
		.join('\n');
}

function fieldLines(fields: { name: string; description: string }[]): string {
	return fields.map((f) => `- ${toText(f.name)}: ${toText(f.description)}`).join('\n');
}

function render(): string {
	const out: string[] = [];

	out.push('# Mochify: full reference for agents and developers');
	out.push('');
	out.push(
		'Mochify is a privacy-first image, PDF and video toolkit. Images and PDFs are streamed into a native C++ engine in RAM at api.mochify.app, processed, and returned; the source bytes are never written to disk and never logged. Video is converted entirely in the browser and never leaves the device. The same engine is reachable from the web app, a REST API, a Rust CLI, a hosted MCP server and a local MCP server, which is what this file documents: the endpoints, the auth header, the parameters and the limits, in the detail an agent needs to call them correctly the first time.'
	);
	out.push('');
	out.push(`Site: ${SITE}`);
	out.push(`Canonical: ${SITE}/llms-full.txt`);
	out.push(`Short version: ${SITE}/llms.txt`);
	out.push(`Build date: ${BUILD_DATE}`);

	// ---- Surfaces -------------------------------------------------------
	out.push(heading('Surfaces'));
	out.push(
		'Surfaces are where you reach Mochify. Formats and capabilities are what it does to a file. They are separate axes: the CLI, MCP and API handle images and PDFs, and video is web app only.'
	);
	out.push('');
	for (const s of surfaces) {
		out.push(`- ${s.name}${s.url ? ` (${s.url})` : ''}: ${toText(s.description)}`);
	}

	// ---- Authentication --------------------------------------------------
	out.push(heading('Authentication'));
	out.push(toText(auth.summary));
	out.push('');
	out.push(`    ${auth.scheme}`);
	out.push('');
	out.push(`Keys are prefixed ${auth.keyPrefix} and are issued from ${SITE}/dashboard.`);
	for (const note of auth.notes) out.push(toText(note));
	out.push(
		'Requests with no key are served anonymously against the free tier, metered by IP address, rather than rejected.'
	);

	// ---- REST API --------------------------------------------------------
	out.push(heading('REST API'));
	out.push(`Base URL: ${API_BASE_URL}`);

	for (const ep of endpoints) {
		out.push(`\n### ${ep.method} ${ep.path}\n`);
		out.push(toText(ep.summary));

		if (ep.id === 'squish') {
			out.push('\nQuery parameters:');
			out.push(paramLines(ep.params as never));
			out.push('\nRequest headers:');
			out.push(fieldLines(ep.requestHeaders as never));
			out.push('\nResponse:');
			out.push(fieldLines(ep.response as never));
		}

		if (ep.id === 'pdf') {
			out.push('\nOperations:');
			for (const op of pdfOps) {
				out.push(`- op=${op.op} (returns ${op.returns}): ${toText(op.description)}`);
			}
			out.push('');
			out.push(toText(pdfJpegNote));
			for (const [op, params] of Object.entries(pdfParams)) {
				out.push(`\nParameters, op=${op}:`);
				out.push(paramLines(params));
				if (op === 'optimize') for (const n of pdfOptimizeNotes) out.push(toText(n));
				if (op === 'extract') out.push(toText(pdfExtractNote));
			}
			out.push('\nWriting the result to your own storage:');
			out.push(paramLines(pdfStorageParams));
			out.push(toText(pdfStorageNote));
			out.push('\nPDF limits:');
			out.push(fieldLines(pdfLimits));
			out.push('\nResponse headers:');
			out.push(fieldLines(ep.response as never));
		}

		if (ep.id === 'check-tokens') {
			out.push('\nResponse fields:');
			out.push(fieldLines(ep.fields as never));
		}

		for (const ex of ep.examples) {
			out.push(`\n${noEmDash(ex.label)}:\n`);
			out.push(
				ex.code
					.split('\n')
					.map((l) => `    ${l}`)
					.join('\n')
			);
		}
	}

	out.push(heading('Errors'));
	out.push('The API uses standard HTTP status codes.');
	out.push('');
	for (const e of errors) out.push(`- ${e.status}: ${toText(e.description)}`);

	// ---- Magic Flow ------------------------------------------------------
	out.push(heading('Magic Flow (natural language)'));
	out.push(toText(magicFlow.summary));
	out.push(toText(magicFlow.surfaces));

	// ---- CLI -------------------------------------------------------------
	out.push(heading('CLI'));
	out.push('Install:');
	for (const line of cli.install) out.push(`- ${line}`);
	out.push('\nAuthentication:');
	for (const line of cli.auth) out.push(`- ${line}`);
	out.push('\nUsage:');
	for (const line of cli.usage) out.push(`- ${line}`);
	out.push('');
	for (const line of cli.notes) out.push(line);
	out.push(`Repository: ${cli.repo}`);

	// ---- MCP -------------------------------------------------------------
	out.push(heading('MCP servers'));
	out.push('Hosted (no install):');
	out.push(`- Endpoint: ${mcp.hosted.endpoint}`);
	out.push(`- OAuth metadata: ${mcp.hosted.discovery}`);
	out.push(`- Auth: ${mcp.hosted.auth}`);
	out.push(`- Image input: ${mcp.hosted.input}`);
	out.push(`- Result delivery: ${mcp.hosted.output}`);
	out.push(`- Clients: ${mcp.hosted.clients}`);
	out.push('\nLocal (for local files):');
	out.push(`- Command: ${mcp.local.command}`);
	out.push(`- Client config: ${mcp.local.clientConfig}`);
	out.push(`- ${mcp.local.notes}`);
	out.push('\nTools exposed by both:');
	for (const t of mcp.tools) out.push(`- ${t.name}: ${t.description}`);
	out.push('');
	out.push(mcp.registries);

	// ---- Privacy ---------------------------------------------------------
	out.push(heading('Privacy and retention, per surface'));
	out.push(
		'There is no single blanket claim that covers every surface. Each path has its own accurate description, and an agent repeating the wrong one is the most expensive mistake this file could cause.'
	);
	out.push('');
	for (const p of privacyModel) out.push(`- ${p.path}: ${p.claim}`);

	// ---- Plans -----------------------------------------------------------
	out.push(heading('Plans and limits'));
	for (const p of plans) {
		const monthly = price(p.priceKey);
		const yearly = p.yearlyKey ? price(p.yearlyKey) : null;
		const priceLabel =
			p.name === 'Day Pass'
				? `${monthly} one-time`
				: yearly
					? `${monthly}/month or ${yearly}/year`
					: `${monthly}/month`;
		out.push(
			`\n${p.name} (${priceLabel})\n- Operations: ${p.opsPerMonth}\n- Max file size: ${p.maxFileSize}\n- Batch: up to ${p.batch} files\n- ${noEmDash(p.notable)}`
		);
	}
	out.push('');
	for (const n of planNotes) out.push(`- ${n}`);
	out.push(`\nLive pricing: ${SITE}/pricing`);

	// ---- Tool pages ------------------------------------------------------
	out.push(heading('Tool pages'));
	out.push(
		'Fixed-purpose converters: drop a file, get the converted file. They have no prompt and no settings panel.'
	);
	out.push('');
	for (const t of [...imageTools, ...videoTools]) {
		out.push(`- ${t.name} (${SITE}/${t.slug}): ${noEmDash(t.desc)}`);
	}

	// ---- Guides ----------------------------------------------------------
	out.push(heading('Guides'));
	out.push(`Long-form articles. Index: ${SITE}/guides`);
	out.push('');
	for (const g of guides) {
		out.push(`- ${noEmDash(g.title)} (${SITE}${g.url}): ${noEmDash(g.description)}`);
	}

	// ---- Legal -----------------------------------------------------------
	out.push(heading('Legal'));
	out.push(`- Privacy policy: ${SITE}/privacy`);
	out.push(`- Data Processing Agreement: ${SITE}/dpa`);
	out.push(`- Terms and Conditions: ${SITE}/terms`);
	out.push(`- Service Terms (paid service, API and MCP): ${SITE}/service-terms`);

	return noEmDash(out.join('\n')) + '\n';
}

// One render per worker isolate. The file changes only when the code that
// produces it is redeployed, so there is nothing to invalidate.
let cached: string | null = null;

export function renderLlmsFull(): string {
	if (cached === null) cached = render();
	return cached;
}
