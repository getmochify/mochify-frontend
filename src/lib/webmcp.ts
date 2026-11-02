// WebMCP: exposes a few of the site's own actions to an AI agent running in the
// visitor's browser (https://webmachinelearning.github.io/webmcp/). The spec
// hangs the API off `document.modelContext`; Chrome's early preview and the
// agent-readiness scanners look for `navigator.modelContext`, so take either.
//
// Only tools that describe what the site really does: find a converter or a
// guide, and go to a page. Nothing here uploads, spends quota or touches the
// account, because a page-level tool runs with the visitor's session and an
// agent should not be able to do that without the visitor in the loop.
//
// The tool data (solutions + guides, a few tens of kB) is imported inside
// `execute`, so a browser without WebMCP, which today is nearly all of them,
// pays for one property check and nothing else.

type ToolResult = Record<string, unknown>;
type ModelContextTool = {
	name: string;
	title?: string;
	description: string;
	inputSchema: Record<string, unknown>;
	execute: (input: Record<string, unknown>) => ToolResult | Promise<ToolResult>;
	annotations?: { readOnlyHint?: boolean };
};
type ModelContext = {
	registerTool: (tool: ModelContextTool, options?: { signal?: AbortSignal }) => unknown;
};

function modelContext(): ModelContext | undefined {
	const mc =
		(navigator as unknown as { modelContext?: ModelContext }).modelContext ??
		(document as unknown as { modelContext?: ModelContext }).modelContext;
	return typeof mc?.registerTool === 'function' ? mc : undefined;
}

type Entry = { kind: 'tool' | 'guide'; title: string; description: string; url: string };

async function entries(): Promise<Entry[]> {
	const [{ imageTools, videoTools }, { guides }] = await Promise.all([
		import('$lib/data/solutions'),
		import('$lib/data/guides')
	]);
	return [
		...[...imageTools, ...videoTools].map((t) => ({
			kind: 'tool' as const,
			title: t.name,
			description: t.desc,
			url: `/${t.slug}`
		})),
		...guides.map((g) => ({
			kind: 'guide' as const,
			title: g.title,
			description: g.description,
			url: g.url
		}))
	];
}

/** Register the tools; returns a function that unregisters them. */
export function registerWebMcp(navigate: (path: string) => Promise<void>): () => void {
	const mc = modelContext();
	if (!mc) return () => {};
	const controller = new AbortController();

	const tools: ModelContextTool[] = [
		{
			name: 'search_tools',
			title: 'Find a Mochify tool or guide',
			description:
				'Search Mochify\'s image, PDF and video converters and its guides by keyword (for example "heic to jpg", "ebay", "remove background", "compress pdf"). Returns matching pages with their URLs, converters first.',
			inputSchema: {
				type: 'object',
				properties: {
					query: { type: 'string', description: 'What the visitor wants to do.' },
					kind: {
						type: 'string',
						enum: ['tool', 'guide', 'any'],
						description: 'Limit results to converters or guides. Defaults to any.'
					}
				},
				required: ['query']
			},
			annotations: { readOnlyHint: true },
			async execute(input) {
				const words = String(input.query ?? '')
					.toLowerCase()
					.split(/[^a-z0-9]+/)
					.filter((w) => w.length > 2); // drops "to", "a", "my", which match every page
				const kind = input.kind === 'tool' || input.kind === 'guide' ? input.kind : undefined;
				const scored = (await entries())
					.filter((e) => !kind || e.kind === kind)
					.map((e) => {
						const hay = `${e.title} ${e.url} ${e.description}`.toLowerCase();
						const hits = words.filter((w) => hay.includes(w)).length;
						// Converters sort ahead of guides at an equal match.
						return { e, hits, rank: hits + (e.kind === 'tool' ? 0.5 : 0) };
					});
				// Keep only pages matching more than half the words the best one does,
				// so "heic to jpg" is not padded out with every page that mentions JPG.
				const best = Math.max(0, ...scored.map((r) => r.hits));
				const results = scored
					.filter((r) => r.hits > 0 && r.hits > best / 2)
					.sort((a, b) => b.rank - a.rank)
					.slice(0, 8)
					.map(({ e }) => ({ ...e, url: new URL(e.url, location.origin).href }));
				return { results };
			}
		},
		{
			name: 'open_page',
			title: 'Open a Mochify page',
			description:
				'Navigate this tab to a page on mochify.app, such as a converter or guide from search_tools, "/flow" (describe an edit in plain words and drop files), "/pricing", or "/docs".',
			inputSchema: {
				type: 'object',
				properties: {
					path: {
						type: 'string',
						description: 'A path on this site starting with "/", or a full https://mochify.app URL.'
					}
				},
				required: ['path']
			},
			async execute(input) {
				let url: URL;
				try {
					url = new URL(String(input.path ?? ''), location.origin);
				} catch {
					return { ok: false, error: 'Not a valid path.' };
				}
				if (url.origin !== location.origin)
					return { ok: false, error: 'Only pages on this site can be opened.' };
				await navigate(url.pathname + url.search + url.hash);
				return { ok: true, url: url.href };
			}
		}
	];

	for (const tool of tools) {
		try {
			// The spec's registerTool returns a promise; the early preview's may not.
			Promise.resolve(mc.registerTool(tool, { signal: controller.signal })).catch(() => {});
		} catch {
			/* an implementation that rejects a tool must not break the page */
		}
	}
	return () => controller.abort();
}
