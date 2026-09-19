// First-page thumbnails and page counts for the PDF chips in the file tray,
// read locally before anything is uploaded.
//
// Two problems, one answer. The tray used to show every PDF as the same red
// document icon, so a batch of five was five identical bubbles with no way to
// tell which was which. And the page count only existed server-side: core caps
// the PDF-in ops at 10 pages on the paid plans below Growth and at 200
// absolutely, so a 60-page 90MB scan was pushed all the way up the wire before
// anything could say it was never going to be processed. Rendering page one in
// the browser answers both at once — the render carries numPages with it.
//
// pdf.js is the only way to rasterise a PDF page in a browser: there is no
// native API, and <embed> renders the platform viewer rather than something we
// can crop into a 64px bubble. It costs ~129kB gz for the API plus ~366kB gz
// for its own worker, which is why NOTHING here is imported until a PDF is
// actually attached — the dynamic import below is the entire reason this lives
// in its own module rather than inside imagePreview.ts.
//
// Every failure path returns nulls rather than throwing. A browser too old for
// the modern build (pdf.js 6 needs Promise.withResolvers, so Safari <17.4),
// an encrypted document, a corrupt one: the tray falls back to the icon it
// showed before this existed, and the page gate falls back to letting core
// decide. Degrading is always correct here — this is a preview, and refusing a
// file because we could not draw a picture of it would be a worse bug than the
// one it prevents.

// Both halves of pdf.js are pulled in as URLs rather than as modules, so Vite
// emits them as standalone .mjs assets and the bundle cost of these two lines
// is two strings. That is deliberate on both counts: a normal `import()` would
// bundle the 437kB API into an app chunk, and app chunks land in the service
// worker's precache glob (js/css/…) — every visitor would download pdf.js as
// part of the offline shell to support a file type most of them never attach.
// As .mjs assets they are fetched the first time someone attaches a PDF, and
// never otherwise. pdf.min.mjs is self-contained, so nothing else is needed to
// make it load this way.
import pdfApiUrl from 'pdfjs-dist/build/pdf.min.mjs?url';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

export type PdfPreviewResult = {
	/**
	 * Object URL for a small WebP render of page one, ready for an <img src>.
	 * Null whenever the document could not be rendered for any reason — the
	 * caller shows its existing PDF icon, exactly as before.
	 */
	thumbUrl: string | null;
	/** Page count, or null if the document could not be opened at all. */
	pages: number | null;
	/** True only for a password-protected document (a knowable, explainable state). */
	encrypted: boolean;
};

/**
 * Core's absolute ceiling for every PDF-in op, regardless of plan.
 * Core is the authority; these exist so the client can say the same thing
 * before spending the upload rather than after. If the caps move, they move
 * here and in `static/llms.txt`/`/docs` together.
 */
export const PDF_MAX_PAGES = 200;
/** What the paid plans below Growth get per PDF. */
export const PDF_PAGE_CAP_STANDARD = 10;

type Plan = 'free' | 'seller' | 'pro' | 'day' | 'growth';

/**
 * Pages this plan may send through a PDF-in op (optimize/extract/rasterize/
 * split). Free is not given a number: the PDF-in ops are paid-only, so core
 * answers 403 long before a page count matters, and quoting a page limit to
 * someone who cannot use the op at all would be the wrong message. An
 * unresolved plan (null) is treated the same way — say nothing rather than
 * guess a limit at somebody.
 */
export function pdfPageCap(plan: Plan | null): number | null {
	if (plan === null || plan === 'free') return null;
	return plan === 'growth' ? PDF_MAX_PAGES : PDF_PAGE_CAP_STANDARD;
}

// Longest edge of the render, in device pixels — the same 192 imagePreview
// uses, for the same reason: the tray bubbles are 64 CSS px and 3x covers
// every current phone.
const DEFAULT_TARGET_PX = 192;

// Matches imagePreview's thumbnail quality so a mixed tray looks uniform.
const THUMB_QUALITY = 0.92;

// pdf.js parses and decodes inside its own single worker, so more than a
// couple of documents in flight only queues work there while holding several
// full file buffers in memory at once. Two keeps a 25-PDF batch moving without
// the memory spike.
const MAX_CONCURRENT_RENDERS = 2;

// A render that has not finished by now is not going to be worth waiting for.
// Generous because it covers reading the file, transferring it to the worker
// and parsing a document that may be 100MB.
const RENDER_TIMEOUT_MS = 20000;

let activeRenders = 0;
const renderQueue: (() => void)[] = [];

function acquireSlot(): Promise<void> {
	if (activeRenders < MAX_CONCURRENT_RENDERS) {
		activeRenders++;
		return Promise.resolve();
	}
	return new Promise((resolve) => {
		renderQueue.push(() => {
			activeRenders++;
			resolve();
		});
	});
}

function releaseSlot(): void {
	activeRenders--;
	const next = renderQueue.shift();
	if (next) next();
}

// Loaded once per session, on first PDF attach. Held as a promise so a batch
// dropped in together shares the single download rather than racing it.
let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;

function loadPdfjs(): Promise<typeof import('pdfjs-dist')> {
	if (!pdfjsPromise) {
		// @vite-ignore: the specifier is a URL resolved at build time (above),
		// which is exactly what keeps this out of the bundle graph.
		pdfjsPromise = (
			import(/* @vite-ignore */ pdfApiUrl) as Promise<typeof import('pdfjs-dist')>
		).then((pdfjs) => {
			pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
			return pdfjs;
		});
		// A failed load must not poison the session — a flaky network on the
		// first attach shouldn't mean no thumbnails until reload.
		pdfjsPromise.catch(() => {
			pdfjsPromise = null;
		});
	}
	return pdfjsPromise;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error('pdf render timed out')), ms);
		promise.then(
			(v) => {
				clearTimeout(timer);
				resolve(v);
			},
			(e) => {
				clearTimeout(timer);
				reject(e);
			}
		);
	});
}

const EMPTY: PdfPreviewResult = { thumbUrl: null, pages: null, encrypted: false };

async function render(file: File, targetPx: number): Promise<PdfPreviewResult> {
	await acquireSlot();
	try {
		return await withTimeout(renderInner(file, targetPx), RENDER_TIMEOUT_MS);
	} catch (e) {
		// PasswordException is the one failure worth naming: it is a property of
		// the document rather than of us, and the tray can say so.
		const encrypted = (e as { name?: string })?.name === 'PasswordException';
		return { thumbUrl: null, pages: null, encrypted };
	} finally {
		releaseSlot();
	}
}

async function renderInner(file: File, targetPx: number): Promise<PdfPreviewResult> {
	const pdfjs = await loadPdfjs();
	const data = await file.arrayBuffer();

	const loadingTask = pdfjs.getDocument({
		data,
		// The buffer is transferred to the worker rather than copied, so the
		// document's bytes exist once, and destroying the task below reclaims
		// them. (`data` is unusable on this side afterwards, which is fine —
		// nothing here reads it again.)
		//
		// Where the wasm decoders live. pdf.js 6 decodes JBIG2 and JPEG 2000 in
		// WebAssembly, and a scanned PDF is usually JBIG2 — without this the
		// scan thumbnails render as blank paper, which is the exact case the
		// PDF tools get used for. scripts/copy-pdfjs-assets.mjs puts them here.
		wasmUrl: '/pdfjs/',
		// Nothing streams: the whole file is already in hand, and leaving these
		// on makes pdf.js plan for range requests it will never issue.
		disableAutoFetch: true,
		disableStream: true,
		// Standard-font and CMap data are not shipped (2.4MB of assets for text
		// that is illegible at 64px anyway). pdf.js substitutes a fallback face
		// and logs about it, so keep it quiet.
		verbosity: 0
	});
	const doc = await loadingTask.promise;

	try {
		const pages = doc.numPages;
		const page = await doc.getPage(1);
		const base = page.getViewport({ scale: 1 });
		const scale = Math.min(1, targetPx / Math.max(base.width, base.height));
		// A page smaller than the thumbnail is rare (a tiny custom page size)
		// but must not be upscaled into a blurry render — cap at 1:1 and let
		// CSS size it down.
		const viewport = page.getViewport({ scale: scale || 1 });

		const canvas = document.createElement('canvas');
		canvas.width = Math.max(1, Math.round(viewport.width));
		canvas.height = Math.max(1, Math.round(viewport.height));
		const ctx = canvas.getContext('2d');
		if (!ctx) return { thumbUrl: null, pages, encrypted: false };
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';

		// pdf.js fills white by default, which is what a page without a
		// background should look like — transparent would show the tray's pink
		// wash through the paper.
		await page.render({ canvas, viewport }).promise;
		page.cleanup();

		const blob = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob(resolve, 'image/webp', THUMB_QUALITY)
		);
		return {
			thumbUrl: blob ? URL.createObjectURL(blob) : null,
			pages,
			encrypted: false
		};
	} finally {
		// Frees the worker-side document and the transferred buffer with it.
		// Without this a 25-PDF batch keeps every parsed document resident for
		// as long as the tray is open.
		void loadingTask.destroy();
	}
}

// Keyed by File, like imagePreview's cache, so the tray's thumbnail and the
// submit-time page check share one render. WeakMap means a File dropped from
// every component's state can be collected along with its entry.
const previewCache = new WeakMap<File, Promise<PdfPreviewResult>>();

/**
 * Render (or reuse) a first-page thumbnail and page count for a PDF. Safe to
 * call repeatedly for the same File — later calls get the cached promise.
 * Never rejects.
 */
export function getPdfPreview(
	file: File,
	targetPx: number = DEFAULT_TARGET_PX
): Promise<PdfPreviewResult> {
	let cached = previewCache.get(file);
	if (!cached) {
		cached = render(file, targetPx).catch(() => EMPTY);
		previewCache.set(file, cached);
	}
	return cached;
}

/**
 * Revoke a PDF's cached thumbnail URL and drop it from the cache. Call
 * wherever the file leaves the tray, same as releaseImagePreview.
 */
export function releasePdfPreview(file: File): void {
	const cached = previewCache.get(file);
	if (!cached) return;
	previewCache.delete(file);
	cached.then(
		(result) => {
			if (result.thumbUrl) URL.revokeObjectURL(result.thumbUrl);
		},
		() => {}
	);
}
