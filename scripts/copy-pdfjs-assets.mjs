// Copies pdf.js's wasm decoders into static/pdfjs/ so the PDF thumbnails in
// the file tray can render scanned documents.
//
// pdf.js 6 decodes JBIG2, JPEG 2000 and ICC colour in WebAssembly, fetched at
// runtime from whatever `wasmUrl` points at (see src/lib/pdfPreview.ts). Almost
// every scanned PDF is JBIG2, so without these the thumbnail for a scan is a
// sheet of blank paper — which is the document type the PDF tools exist for.
// They are only fetched when a document actually needs one, so this costs
// nothing for a born-digital PDF.
//
// Copied rather than committed: the files are version-locked to the installed
// pdfjs-dist, and a stale copy in git would be silently wrong after an upgrade.
// static/pdfjs/ is gitignored for the same reason. Runs from `prepare` (so a
// fresh install has them) and from `build`.

import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const from = resolve(root, 'node_modules/pdfjs-dist/wasm');
const to = resolve(root, 'static/pdfjs');

if (!existsSync(from)) {
	// `prepare` can run before dependencies are on disk in some install
	// orders. Not fatal: the build runs this again, and a missing decoder
	// degrades to a thumbnail rather than an error.
	console.warn('[pdfjs] node_modules/pdfjs-dist/wasm not found, skipping asset copy');
	process.exit(0);
}

await rm(to, { recursive: true, force: true });
await mkdir(to, { recursive: true });
await cp(from, to, { recursive: true });
console.log('[pdfjs] copied wasm decoders to static/pdfjs/');
