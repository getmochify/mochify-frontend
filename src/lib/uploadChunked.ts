// Chunked upload for large files on unreliable connections. Splits a file
// into sequential ~5MB chunks against mochify-core's /v1/upload/init,
// /v1/upload/chunk, /v1/upload/complete endpoints (reassembled purely in
// core's RAM — zero-retention, same guarantee as the direct /v1/squish path).
//
// Each chunk is retried independently via the existing withRetry helper, so
// a dropped connection only costs re-sending the current ~5MB chunk instead
// of the whole file. Files at or below CHUNK_THRESHOLD_BYTES keep using the
// existing single-POST /v1/squish path unchanged — this is only for the
// minority of large uploads where a flaky connection actually hurts.
import { withRetry } from '$lib/uploadRetry';
import { posthog } from '$lib/analytics';

// Above this size, use chunked upload. Comfortably above typical compressed
// photo sizes (keeps the common case on the fast unchanged path) and well
// under the 20MB free-tier ceiling, so free-tier users on flaky connections
// still benefit for their largest allowed uploads.
export const CHUNK_THRESHOLD_BYTES = 8 * 1024 * 1024;
const CHUNK_SIZE_BYTES = 5 * 1024 * 1024;

export type UploadPhase = 'uploading' | 'processing' | 'downloading';

// Raw params, matching the same names Mochify::Pipeline::SquishInput reads
// on the backend (utils/UploadSessionStore.h's UploadSession mirrors these
// exactly). All optional/blank by default, same as the direct /v1/squish
// query params.
export interface ChunkedUploadParams {
	type?: string;
	// Multi-variant CSV params (e.g. types="avif,webp", sizes="500x0,1200x0").
	// Sent in the init JSON body and stored on the backend's UploadSession;
	// /v1/upload/complete then returns an application/zip of all variants.
	types?: string;
	sizes?: string;
	stripExif?: string;
	smartCompress?: string;
	removeBackground?: string;
	generate?: string;
	optimizeForWeb?: string;
	hdr?: string;
	background?: string;
	smartCrop?: string;
	crop?: string;
	width?: string;
	height?: string;
	rotate?: string;
	dpi?: string;
	brightness?: string;
	clarity?: string;
	quality?: string;
	// Passthrough for extra params (e.g. solution-page presets carried via a
	// component's `queryParams` prop) — unrecognized keys are ignored by the
	// backend's JSON parsing the same way an unrecognized query param is
	// ignored by req->getParameter(...) on the direct /v1/squish path.
	[key: string]: string | undefined;
}

export interface ChunkedUploadCallbacks {
	jwt?: string | null;
	// Reports (loaded, total) for THIS file's upload phase. `loaded` is
	// clamped to strict monotonic growth across the whole file: it is the
	// highest byte offset ever reached, never the current attempt's raw
	// event.loaded. When a dropped connection restarts the current chunk from
	// zero, the raw offset dips, but the clamp absorbs it so callers only ever
	// see the reported total move forward — no rubber-banding. A max() can't
	// drift out of sync the way an add/rollback accumulator can, so this stays
	// as cheap and robust as the old pure-function formula while removing the
	// backward dip it used to expose.
	onUploadProgress?: (loaded: number, total: number) => void;
	onPhaseChange?: (phase: UploadPhase) => void;
	onDownloadProgress?: (loaded: number, total: number) => void;
	// Fires `true` when a chunk (or the finalize step) hits a retryable
	// network drop and enters withRetry's backoff loop, and `false` once it
	// recovers or gives up. Lets the UI surface a transient "unstable
	// connection" hint without tearing down the in-progress upload.
	onRetryStateChange?: (isRetrying: boolean) => void;
}

interface RetryableXhrError extends Error {
	status?: number;
	retryable?: boolean;
}

function xhrError(
	message: string,
	opts: { status?: number; retryable?: boolean }
): RetryableXhrError {
	const err: RetryableXhrError = new Error(message);
	if (opts.status !== undefined) err.status = opts.status;
	if (opts.retryable !== undefined) err.retryable = opts.retryable;
	return err;
}

async function initSession(
	apiUrl: string,
	file: File,
	params: ChunkedUploadParams,
	jwt?: string | null
): Promise<{ sessionId: string }> {
	const resp = await fetch(`${apiUrl}/v1/upload/init`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
		},
		body: JSON.stringify({ totalBytes: file.size, ...params })
	});
	if (!resp.ok) {
		let message = `Upload init failed: ${resp.status}`;
		try {
			const body = (await resp.json()) as { error?: string };
			if (body?.error) message = body.error;
		} catch {
			/* body wasn't JSON — keep the generic message */
		}
		throw xhrError(message, { status: resp.status });
	}
	const body = (await resp.json()) as { sessionId?: string };
	if (!body?.sessionId) throw new Error('Upload init did not return a sessionId.');
	return { sessionId: body.sessionId };
}

function uploadOneChunk(
	apiUrl: string,
	sessionId: string,
	chunkIndex: number,
	slice: Blob,
	jwt: string | null | undefined,
	onProgress: (loaded: number) => void
): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.upload.addEventListener('progress', (e) => onProgress(e.loaded));
		xhr.addEventListener('load', () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				onProgress(slice.size);
				resolve();
				return;
			}
			let message = `Chunk ${chunkIndex} failed: ${xhr.status}`;
			try {
				const body = JSON.parse(xhr.responseText);
				if (body?.error) message = body.error;
			} catch {
				/* response wasn't JSON — keep the generic message */
			}
			reject(xhrError(message, { status: xhr.status }));
		});
		xhr.addEventListener('error', () => reject(xhrError('Network error', { retryable: true })));
		xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));
		xhr.open(
			'POST',
			`${apiUrl}/v1/upload/chunk?session=${encodeURIComponent(sessionId)}&index=${chunkIndex}`
		);
		xhr.setRequestHeader('Content-Type', 'application/octet-stream');
		if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
		xhr.send(slice);
	});
}

function completeUpload(
	apiUrl: string,
	sessionId: string,
	jwt: string | null | undefined,
	onDownloadProgress?: (loaded: number, total: number) => void
): Promise<Blob> {
	return new Promise<Blob>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.addEventListener('progress', (e) => {
			if (e.lengthComputable) onDownloadProgress?.(e.loaded, e.total);
		});
		xhr.addEventListener('load', () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				const latency = xhr.getResponseHeader('X-Latency-Ms');
				if (latency) console.log(`[C++ Engine] chunked upload squished in ${latency}`);
				resolve(xhr.response);
				return;
			}
			const error: RetryableXhrError = new Error(`Upload finalize failed: ${xhr.status}`);
			error.status = xhr.status;
			reject(error);
		});
		xhr.addEventListener('error', () => reject(xhrError('Network error', { retryable: true })));
		xhr.open('POST', `${apiUrl}/v1/upload/complete?session=${encodeURIComponent(sessionId)}`);
		if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
		xhr.send();
	});
}

export async function uploadChunked(
	file: File,
	apiUrl: string,
	params: ChunkedUploadParams,
	callbacks: ChunkedUploadCallbacks = {}
): Promise<Blob> {
	const { jwt, onUploadProgress, onPhaseChange, onDownloadProgress, onRetryStateChange } =
		callbacks;

	onPhaseChange?.('uploading');
	const { sessionId } = await initSession(apiUrl, file, params, jwt);

	const totalChunks = Math.ceil(file.size / CHUNK_SIZE_BYTES);
	posthog.capture('chunked_upload_started', { fileSize: file.size, chunks: totalChunks });

	// Highest byte offset reported so far, across every chunk and across any
	// chunk's retries. Progress is clamped up to this, so a retry that
	// re-sends the current chunk from zero can never push the reported total
	// backward (see onUploadProgress's contract above).
	let maxLoadedSeen = 0;

	for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
		const start = chunkIndex * CHUNK_SIZE_BYTES;
		const end = Math.min(start + CHUNK_SIZE_BYTES, file.size);
		const slice = file.slice(start, end);

		await withRetry(
			() =>
				uploadOneChunk(apiUrl, sessionId, chunkIndex, slice, jwt, (loadedInChunk) => {
					const totalLoaded = Math.min(chunkIndex * CHUNK_SIZE_BYTES + loadedInChunk, file.size);
					if (totalLoaded > maxLoadedSeen) {
						maxLoadedSeen = totalLoaded;
						onUploadProgress?.(maxLoadedSeen, file.size);
					}
				}),
			'chunk_upload',
			2,
			1000,
			onRetryStateChange
		);
	}

	posthog.capture('chunked_upload_all_chunks_sent', { fileSize: file.size, chunks: totalChunks });
	onPhaseChange?.('processing');

	try {
		const blob = await withRetry(
			() =>
				completeUpload(apiUrl, sessionId, jwt, (loaded, total) => {
					onPhaseChange?.('downloading');
					onDownloadProgress?.(loaded, total);
				}),
			'chunk_complete',
			2,
			1000,
			onRetryStateChange
		);
		posthog.capture('chunked_upload_completed', { fileSize: file.size });
		return blob;
	} catch (err) {
		const status = (err as RetryableXhrError)?.status ?? 0;
		posthog.capture('chunked_upload_failed', { fileSize: file.size, status });
		throw err;
	}
}
