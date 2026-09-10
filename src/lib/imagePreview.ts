// Shared thumbnail + dimension-probe helper for the file trays in PromptForm,
// PromptFormApp and ImageUpload.
//
// Before this existed, each tray decoded every original file TWICE: once as a
// full-resolution <img src={URL.createObjectURL(file)}> for a 64px thumbnail
// (the browser decodes and keeps the whole bitmap resident for as long as the
// <img> stays mounted), and again via a throwaway `new Image()` at submit time
// to read width/height for the /v1/nlp/parse payload. A 24MP camera photo
// decodes to ~100MB of raw pixels; a 25-file batch meant up to 25 of those
// resident at once, plus a second full-decode burst right at submit.
//
// getImagePreview() does ONE decode per file (via createImageBitmap, which
// never touches the DOM) and derives both a small downscaled thumbnail blob
// and the intrinsic width/height from that single bitmap. Results are cached
// per File, so a caller that grabs a thumbnail at add-time and later needs
// the dimensions at submit-time gets the second value for free — zero extra
// decodes for the common case.

export type ImagePreviewResult = {
	/**
	 * Object URL for a small (downscaled) preview blob, ready to hand straight
	 * to an <img src>. Null only if even a fallback URL couldn't be created
	 * (e.g. URL.createObjectURL itself threw) — callers should show their
	 * existing placeholder icon in that case, same as an empty string today.
	 */
	thumbUrl: string | null;
	/** Intrinsic width in px, or 0 if the file couldn't be decoded at all. */
	width: number;
	/** Intrinsic height in px, or 0 if the file couldn't be decoded at all. */
	height: number;
};

// Longest edge of the generated thumbnail, in device pixels. The trays render
// previews at 64 CSS px (the h-16 w-16 bubbles in PromptForm/PromptFormApp/
// ImageUpload), so 192 covers a 3x display (iPhone Pro, most recent Android)
// without asking canvas to hold anything close to the original's resolution.
// It was 128, which is only 2x and left every thumbnail slightly soft on a 3x
// screen; at this size the encoded blob is a few kB either way.
const DEFAULT_TARGET_PX = 192;

// WebP quality for the thumbnail. 0.82 was inherited from a time when this
// encoded larger previews. At 192px the blob is a handful of kB at any quality,
// so the lower setting bought nothing and put visible blocking on screenshots
// and flat graphics, on top of the resampling artefacts fixed below.
const THUMB_QUALITY = 0.92;

// Cap on simultaneous decodes. Adding a 25-file batch at once shouldn't spike
// to 25 concurrent createImageBitmap calls in a burst — a small handful in
// flight keeps the main thread responsive and bounds peak memory regardless
// of batch size.
const MAX_CONCURRENT_DECODES = 3;

let activeDecodes = 0;
const decodeQueue: (() => void)[] = [];

function acquireSlot(): Promise<void> {
	if (activeDecodes < MAX_CONCURRENT_DECODES) {
		activeDecodes++;
		return Promise.resolve();
	}
	return new Promise((resolve) => {
		decodeQueue.push(() => {
			activeDecodes++;
			resolve();
		});
	});
}

function releaseSlot(): void {
	activeDecodes--;
	const next = decodeQueue.shift();
	if (next) next();
}

function safeObjectUrl(file: File): string | null {
	try {
		return URL.createObjectURL(file);
	} catch {
		return null;
	}
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error('image decode timed out')), ms);
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

// Keyed by File so a thumbnail generated at add-time and a dimension lookup
// at submit-time share one decode. WeakMap means a File with no other
// references (fully removed from every component's state) can be
// garbage-collected along with its cache entry — releaseImagePreview only
// needs to handle revoking the object URL still alive inside it.
const previewCache = new WeakMap<File, Promise<ImagePreviewResult>>();

/**
 * Decode the file, honouring EXIF rotation.
 *
 * `imageOrientation` is passed explicitly because the default has moved: the
 * spec now says `from-image`, but older Chrome defaulted to `none` and Safari
 * has varied, which is what left portrait phone photos lying on their side in
 * the tray. Being explicit also makes the reported width/height the *display*
 * dimensions, which is what the /v1/prompt payload wants: a user asking for
 * "800 wide" means the picture as they see it, not as the sensor stored it.
 *
 * The retry exists because the options bag itself is not universally accepted.
 * Where it is rejected, a bare decode is still far better than no thumbnail,
 * which is what a single failed call would have produced.
 */
async function decodeBitmap(file: File): Promise<ImageBitmap> {
	try {
		return await withTimeout(createImageBitmap(file, { imageOrientation: 'from-image' }), 8000);
	} catch {
		return await withTimeout(createImageBitmap(file), 8000);
	}
}

/**
 * Downscale to exactly outW x outH, halving as many times as it takes.
 *
 * One `drawImage` from a 6000px bitmap straight down to 192px undersamples
 * badly: the fast path reads too few source pixels, which is what produced
 * aliasing on fine repeating detail (fabric, brickwork), moire, and mush where
 * a screenshot had text. Halving keeps every step inside the filter's
 * competence, and five small draws cost nothing next to the decode that
 * preceded them. `imageSmoothingQuality` is set on every context because
 * Chrome's default is 'low'.
 */
function downscale(bitmap: ImageBitmap, outW: number, outH: number): HTMLCanvasElement | null {
	let src: ImageBitmap | HTMLCanvasElement = bitmap;
	let srcW = bitmap.width;
	let srcH = bitmap.height;

	while (srcW > outW * 2 && srcH > outH * 2) {
		const stepW = Math.max(outW, Math.round(srcW / 2));
		const stepH = Math.max(outH, Math.round(srcH / 2));
		const step = document.createElement('canvas');
		step.width = stepW;
		step.height = stepH;
		const stepCtx = step.getContext('2d');
		if (!stepCtx) return null;
		stepCtx.imageSmoothingEnabled = true;
		stepCtx.imageSmoothingQuality = 'high';
		stepCtx.drawImage(src, 0, 0, stepW, stepH);
		src = step;
		srcW = stepW;
		srcH = stepH;
	}

	const canvas = document.createElement('canvas');
	canvas.width = outW;
	canvas.height = outH;
	const ctx = canvas.getContext('2d');
	if (!ctx) return null;
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(src, 0, 0, outW, outH);
	return canvas;
}

async function decode(file: File, targetPx: number): Promise<ImagePreviewResult> {
	await acquireSlot();
	try {
		let bitmap: ImageBitmap;
		try {
			bitmap = await decodeBitmap(file);
		} catch {
			// Not decodable via createImageBitmap — HEIC/HEIF in the rare case a
			// caller didn't already filter it out, JXL outside Safari (always),
			// and occasionally AVIF on older Safari. Preserve today's fallback:
			// hand back the original file's object URL so the <img> itself gets
			// a shot at rendering it (some engines' <img> decoder differs from
			// createImageBitmap's), with dimensions unknown — exactly what the
			// old per-component getDimensions() returned on decode failure.
			return { thumbUrl: safeObjectUrl(file), width: 0, height: 0 };
		}
		try {
			const { width, height } = bitmap;
			if (!width || !height) {
				return { thumbUrl: safeObjectUrl(file), width, height };
			}
			const scale = Math.min(1, targetPx / Math.max(width, height));
			// Already thumbnail-sized: the original IS the best thumbnail. Re-encoding
			// it would only add lossy WebP on top of an image that needed no resizing
			// at all, which is what visibly degraded small logos, icons and graphics.
			// Nothing to free memory-wise either: the file is small by definition.
			if (scale === 1) {
				return { thumbUrl: safeObjectUrl(file), width, height };
			}
			const outW = Math.max(1, Math.round(width * scale));
			const outH = Math.max(1, Math.round(height * scale));
			const canvas = downscale(bitmap, outW, outH);
			if (!canvas) return { thumbUrl: safeObjectUrl(file), width, height };
			// An unsupported type makes toBlob fall back to PNG rather than fail,
			// which is a fine outcome at this size.
			const blob = await new Promise<Blob | null>((resolve) =>
				canvas.toBlob(resolve, 'image/webp', THUMB_QUALITY)
			);
			if (!blob) return { thumbUrl: safeObjectUrl(file), width, height };
			return { thumbUrl: URL.createObjectURL(blob), width, height };
		} finally {
			// Frees the decoded bitmap immediately rather than waiting on GC — this
			// is the whole point: peak decoded memory is transient (one bitmap in
			// flight per concurrency slot) instead of resident per tray item.
			bitmap.close();
		}
	} finally {
		releaseSlot();
	}
}

/**
 * Get (or reuse) a small preview + the file's intrinsic dimensions from a
 * single decode. Safe to call repeatedly for the same File — later calls
 * return the same cached promise rather than decoding again.
 */
export function getImagePreview(
	file: File,
	targetPx: number = DEFAULT_TARGET_PX
): Promise<ImagePreviewResult> {
	let cached = previewCache.get(file);
	if (!cached) {
		cached = decode(file, targetPx);
		previewCache.set(file, cached);
	}
	return cached;
}

/**
 * Revoke a file's cached thumbnail URL (once it resolves, if it hasn't
 * already) and drop it from the cache. Call this at every point the old
 * per-component code revoked its own preview URL — file removal, batch trim,
 * form reset, a completed/failed upload leaving the tray — so that if the
 * same File object is ever reused, getImagePreview() decodes fresh instead of
 * handing back an already-revoked URL.
 */
export function releaseImagePreview(file: File): void {
	const cached = previewCache.get(file);
	if (!cached) return;
	previewCache.delete(file);
	cached.then(
		(result) => {
			if (result.thumbUrl) URL.revokeObjectURL(result.thumbUrl);
		},
		() => {
			// decode() never rejects, but guard anyway — nothing to revoke.
		}
	);
}
