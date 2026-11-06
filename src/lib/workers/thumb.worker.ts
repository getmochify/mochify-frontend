// Downscales a decoded ImageBitmap to a thumbnail off the main thread.
//
// createImageBitmap already decodes off-thread; what blocked the page was the
// halving downscale that followed it, about 80ms of synchronous drawImage per
// 24MP photo, so a 25-file drop froze the tray for two seconds in 80ms steps.
// The bitmap is transferred in (no copy) and closed here; the WebP comes back.
// One long-lived worker serves every request, matched by id.

export type ThumbWorkerRequest = {
	id: number;
	bitmap: ImageBitmap;
	outW: number;
	outH: number;
	quality: number;
};

export type ThumbWorkerResponse = { id: number; blob: Blob | null };

// `self` is typed as `Window` under the project's DOM lib; see zip.worker.ts.
const ctx = self as unknown as Worker;

// Same halving as the main-thread downscale in $lib/imagePreview: one draw from
// 6000px straight to 192px undersamples, so each step stays within 2x.
function downscale(bitmap: ImageBitmap, outW: number, outH: number): OffscreenCanvas | null {
	let src: ImageBitmap | OffscreenCanvas = bitmap;
	let srcW = bitmap.width;
	let srcH = bitmap.height;

	while (srcW > outW * 2 && srcH > outH * 2) {
		const stepW = Math.max(outW, Math.round(srcW / 2));
		const stepH = Math.max(outH, Math.round(srcH / 2));
		const step = new OffscreenCanvas(stepW, stepH);
		const stepCtx = step.getContext('2d');
		if (!stepCtx) return null;
		stepCtx.imageSmoothingEnabled = true;
		stepCtx.imageSmoothingQuality = 'high';
		stepCtx.drawImage(src, 0, 0, stepW, stepH);
		src = step;
		srcW = stepW;
		srcH = stepH;
	}

	const canvas = new OffscreenCanvas(outW, outH);
	const outCtx = canvas.getContext('2d');
	if (!outCtx) return null;
	outCtx.imageSmoothingEnabled = true;
	outCtx.imageSmoothingQuality = 'high';
	outCtx.drawImage(src, 0, 0, outW, outH);
	return canvas;
}

ctx.onmessage = async (event: MessageEvent<ThumbWorkerRequest>) => {
	const { id, bitmap, outW, outH, quality } = event.data;
	let blob: Blob | null = null;
	try {
		const canvas = downscale(bitmap, outW, outH);
		// An unsupported type falls back to PNG rather than failing, as toBlob
		// does on the main thread; fine at this size.
		if (canvas) blob = await canvas.convertToBlob({ type: 'image/webp', quality });
	} catch {
		blob = null;
	} finally {
		bitmap.close();
	}
	ctx.postMessage({ id, blob } satisfies ThumbWorkerResponse);
};
