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
PUBLIC_API_URL=http://localhost   # Defaults to https://api.mochify.xyz in production
```

## Architecture

**SvelteKit 5** frontend deployed on **Cloudflare Pages** via `@sveltejs/adapter-cloudflare`. All image processing is handled by an external C++ backend — this repo is purely the UI.

### Two core UI modes

The homepage (`/`) lets users toggle between:

1. **Magic Flow** — `PromptForm.svelte`: NLP-driven. User describes what they want in plain text, files are attached, and a two-step API call is made: first `POST /v1/nlp/parse` to interpret the prompt, then `POST /v1/squish` per file with the parsed parameters.

2. **Manual Settings** — `ImageUpload.svelte`: Classic form with format selector. Sends files directly to `POST /v1/squish`. Supports batch processing up to 25 files (2 concurrent), token-limit checking via `GET /v1/checkTokens`, EXIF stripping, and smart-compress toggles. Multiple outputs are zipped client-side with `fflate`.

`/flow` is a standalone page that renders only `PromptForm.svelte`.

### API endpoints used

- `POST /v1/squish?type=<format>&strip_exif=<bool>&smartCompress=1` — Upload a single image (raw body), returns compressed blob. `X-Latency-Ms` header on response.
- `GET /v1/checkTokens` — Returns `{ remaining, available }`. Works anonymously (IP-based) or with an API key.
- `POST /v1/nlp/parse` — Body: `{ prompt, fileData: [{name, width, height}] }`. Returns per-file processing config.

### Route structure

- `/` — Homepage with tab-switcher between PromptForm and ImageUpload
- `/flow` — Standalone Magic Flow page
- `/solutions/*` — Use-case landing pages (eBay converter, HIF-to-AVIF, etc.) — each embeds `ImageUpload` with preset `output` and `queryParams` props
- `/guides/*` — Static long-form content articles; shares `src/routes/guides/+layout.svelte`
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

### Security

- Strict CSP configured in `svelte.config.js` — `connect-src` is limited to `self`, `PUBLIC_API_URL`, and `analytics.mochify.xyz`. Adding new external fetch targets requires updating this.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, etc.) set in `src/hooks.server.js`.
- Analytics via self-hosted Umami at `analytics.mochify.xyz`. Events tracked via `window.umami.track(...)`.
