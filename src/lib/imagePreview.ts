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
// ImageUpload); 2x covers retina without asking canvas to hold anything close
// to the original's resolution.
const DEFAULT_TARGET_PX = 128;

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

async function decode(file: File, targetPx: number): Promise<ImagePreviewResult> {
	await acquireSlot();
	try {
		let bitmap: ImageBitmap;
		try {
			bitmap = await withTimeout(createImageBitmap(file), 8000);
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
			const outW = Math.max(1, Math.round(width * scale));
			const outH = Math.max(1, Math.round(height * scale));
			const canvas = document.createElement('canvas');
			canvas.width = outW;
			canvas.height = outH;
			const ctx = canvas.getContext('2d');
			if (!ctx) return { thumbUrl: safeObjectUrl(file), width, height };
			ctx.drawImage(bitmap, 0, 0, outW, outH);
			const blob = await new Promise<Blob | null>((resolve) =>
				canvas.toBlob(resolve, 'image/webp', 0.82)
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
