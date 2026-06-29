# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build (Cloudflare adapter)
npm run preview      # Preview production build locally
npm run check        # Svelte type-check (svelte-check + tsconfig)
npm run lint         # Prettier check + ESLint
npm run format       # Auto-format with Prettier
```

There is no test suite. Type-check with `npm run check` before considering changes complete.

## Environment

Copy `.env.example` to `.env`. The only variable is:
```
PUBLIC_API_URL=http://localhost   # Defaults to https://api.mochify.app in production
```

## Architecture

**SvelteKit 5** frontend deployed on **Cloudflare Pages** via `@sveltejs/adapter-cloudflare`. All image processing is handled by an external C++ backend — this repo is purely the UI.

### Two core UI modes

The homepage (`/`) lets users toggle between:

1. **Magic Flow** — `PromptForm.svelte`: NLP-driven. User describes what they want in plain text, files are attached, and a two-step API call is made: first `POST /v1/nlp/parse` to interpret the prompt, then `POST /v1/squish` per file with the parsed parameters.

2. **Manual Settings** — `ImageUpload.svelte`: Classic form with format selector. Sends files directly to `POST /v1/squish`. Supports batch processing up to 25 files (2 concurrent), token-limit checking via `GET /v1/checkTokens`, EXIF stripping, and smart-compress toggles. Multiple outputs are zipped client-side with `fflate`.

`/app` is the standalone PWA surface (the web app manifest's `start_url`, `display: standalone`). It renders `PromptFormApp.svelte` — a fork of `PromptForm.svelte` kept separate so the installed-app experience can diverge (e.g. agentic/MCP "Mochify 2.0" framing) without affecting the homepage. It uses the shared `Navigation` and `Footer` and is `noindex`.

### API endpoints used

- `POST /v1/squish?type=<format>&strip_exif=<bool>&smartCompress=1` — Upload a single image (raw body), returns compressed blob. `X-Latency-Ms` header on response.
- `GET /v1/checkTokens` — Returns `{ remaining, available }`. Works anonymously (IP-based) or with an API key.
- `POST /v1/nlp/parse` — Body: `{ prompt, fileData: [{name, width, height}] }`. Returns per-file processing config.

### Route structure

- `/` — Homepage with tab-switcher between PromptForm and ImageUpload
- `/app` — Standalone PWA surface (manifest `start_url`); renders the `PromptFormApp.svelte` fork, with shared Navigation + Footer, `noindex`
- `/solutions/*` — Use-case landing pages (eBay converter, HIF-to-AVIF, etc.) — each embeds `ImageUpload` with preset `output` and `queryParams` props
- `/guides/*` — Long-form content articles; shares `src/routes/guides/+layout.svelte` for typography, link styling, and nav chrome
- `/comparison`, `/about`, `/privacy`, `/terms`, `/service-terms` — Static pages

### Design system

Defined in `src/routes/layout.css` (imported via `+layout.svelte`). Tailwind v4 with a warm mochi palette:

| Token | Value | Usage |
|-------|-------|-------|
| `--mochi-bg` | `#FDFBF7` | Page background |
| `--mochi-pink` | `#F06292` | Primary accent / CTA |
| `--cocoa-deep` | `#6C3F31` | Body text |
| `--matcha-green` | `#A5D6A7` | Submit/action buttons |

Body font: **Quicksand**. Heading font: **Outfit** (both via `@fontsource`).

Custom utility classes: `.reveal` (scroll-triggered fade-in), `.shimmer-text`, `.animate-float`, `.btn-mochi`, `.card-mochi`.

The `PromptForm` uses a `.liquid-glass` CSS style (frosted glass card with `backdrop-filter: blur`).

### Key component props

**`ImageUpload.svelte`**
- `output` — preset output format (locks the format selector when provided via `hasOutputOverride`)
- `queryParams` — appended to `/v1/squish` query string (for solution pages, e.g. `maxWidth=1600`)
- `compact`, `theme` (`'pink'` | `'blue'`), `showTypes`, `showExifOption`, `showSmartMode`

### State management

Uses **Svelte 5 runes** throughout (`$state`, `$derived`, `$effect`, `$props`). No external state library.

### Guide pages (`/guides/*`)

Each guide is a standalone `.svelte` file. The shared layout (`src/routes/guides/+layout.svelte`) provides typography, link styling, and nav chrome — guide pages do not need to re-declare these.

**Typography system** (applied via `article` selectors in the layout):
- `article a:not([class])` — pink `#F06292`, bold, faint underline. Hover: darkens to `#ec407a` + strawberry `#FFF0F3` background pill. This is the same style used on the terms page and globally in `.prose`.
- `article p` — `#4A2C2C` (deep cocoa). Overrides any inherited Tailwind color.
- `article h2/h3/h4` — styled in layout; h2 has pink border-bottom.
- `article code` — pink background, `#BE185D` text, 1px vertical padding. Do not add `py-0.5` on inline code — use `py-px`.
- `article blockquote` — pink left border, blush gradient background.

**Key components for guide pages:**
- `SectionHeading` — renders an `<h2>` with a self-stretching pink bar that scales with multi-line headings. Use for all section headings instead of bare `<h2>`.
- `InfoBox` — callout box with types `tip | technical | note | warning`. Uses a coloured dot (not emoji) as the indicator. Keep content concise.
- `RelatedGuides` — takes an array of `{ title, href, desc }` objects.
- `ReadProgress` — reading progress bar; import at the top of each guide.
- `Breadcrumb` — rendered by the layout automatically; no action needed.

### Mochify content publishing — non-negotiable preservation rules

Source of record for any article is the handoff HTML in the content-ops repo (`article-originals/<slug>.html`). Do **not** tidy, reformat, or rewrite content that was handed over.

1. **No em dashes — ever.** Published copy must contain zero em dashes (`—`). Do not insert them and do not let the build introduce them. En dashes (`–`) are correct **only** in numeric ranges (`8–15 min`, `25–30%`) and must be left exactly as authored. If you see an em dash in a draft or rendered preview, it is a defect — replace it with a hyphen or restructured clause, never leave it.
2. **Never drop outbound links.** Every external citation link in the source (`web.dev`, MDN, `caniuse.com`, etc.) must appear in the published page. Do not strip, clean up, or summarise away citations. Internal `mochify.app` links must survive too.
3. **External-link format is fixed.** Every external link renders as:
   ```html
   <a href="https://example.com/page" target="_blank" rel="noopener noreferrer">anchor text</a>
   ```
   Internal links (`https://mochify.app/...` or relative) do **not** get `target`/`rel`.
4. **Don't invent or repoint URLs.** Use the exact hrefs from the source. If a link looks wrong, flag it to the content team — do not guess a replacement.
5. **Preserve the shell verbatim.** Nav/footer targets are the live source of truth (Get started → `/auth/register`, Contact → `mailto:hello@mochify.app`, Terms of Service → `/service-terms`, Terms & Conditions → `/terms`). Do not rewrite these.

### Mandatory pre-publish verification (run every time, report the result)

Run against the built `.svelte` file, not just the source. Fail the publish if any check fails.

1. **Em-dash scan** — expect zero matches:
   ```bash
   grep -n '—' src/routes/guides/<slug>/+page.svelte
   ```

2. **Outbound-link parity** — rendered page must have at least as many external links as the source:
   ```bash
   grep -oE 'href="https?://[^"]+"' ../content-ops/article-originals/<slug>.html | grep -v 'mochify\.app' | sort -u > /tmp/src-links.txt
   grep -oE 'href="https?://[^"]+"' src/routes/guides/<slug>/+page.svelte | grep -v 'mochify\.app' | sort -u > /tmp/out-links.txt
   diff /tmp/src-links.txt /tmp/out-links.txt   # expect no missing lines
   ```

3. **External-link attributes** — every external anchor carries `target="_blank"` and `rel="noopener noreferrer"`.

4. **Report** — state the em-dash count (must be 0) and source-vs-rendered external-link counts (must match) before marking publish done.

**Known pipeline regressions (content-ops fix pending — `dev-publishing-guardrails.md` Part A):**
- Smart-dash typography (`remark-smartypants` / `markdown-it typographer: true`) converts hyphens to em dashes at build time.
- `rehype-external-links` missing from pipeline causes `target`/`rel` to be stripped.

### Security

- Strict CSP configured in `svelte.config.js` — `connect-src` is limited to `self`, `PUBLIC_API_URL`, and `analytics.mochify.xyz`. Adding new external fetch targets requires updating this.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, etc.) set in `src/hooks.server.js`.
- Analytics via self-hosted Umami at `analytics.mochify.xyz`. Events tracked via `window.umami.track(...)`.
