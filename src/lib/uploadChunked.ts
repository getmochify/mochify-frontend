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
import { withRetry, isRetryable } from '$lib/uploadRetry';
import { posthog } from '$lib/analytics';

// Above this size, use chunked (resumable) upload. Set to exactly one chunk:
// anything larger is >=2 chunks, so a dropped connection costs at most one
// ~5MB chunk of re-send (true partial resume), and — with the offline
// pause/resume in withReconnect — survives going offline mid-upload. Files at
// or below one chunk stay on the single-POST /v1/squish path, where chunking
// would only add init/complete round-trips without buying partial resume.
// Lowered from 8MB once offline-resume landed: the 5-8MB band (very common for
// high-quality photos) is exactly what hurts on a slow mobile uplink, where an
// 8MB single POST is a ~40s non-resumable transfer.
export const CHUNK_THRESHOLD_BYTES = 5 * 1024 * 1024;
const CHUNK_SIZE_BYTES = 5 * 1024 * 1024;

// Longest we'll hold a stalled upload open waiting for the browser to come back
// online before giving up. The server keeps the half-uploaded session in RAM
// (zero-retention), so resuming within this window costs only the un-sent
// chunks; past it we fail cleanly with a clear message rather than hang forever.
const OFFLINE_MAX_WAIT_MS = 5 * 60 * 1000;

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
	// Server's true received offset, echoed on a 409 gap so the client can
	// re-sync without a separate status round-trip.
	serverOffset?: number;
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
	file: Blob,
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

// Sends one chunk starting at byte `offset` and resolves with the server's new
// contiguous high-water mark. Re-sending the same chunk at the same offset is
// safe: the server treats already-received bytes as an idempotent no-op, so a
// withRetry re-send after a lost ACK advances correctly instead of 409-ing the
// way the old sequential-index model did.
function uploadOneChunkAtOffset(
	apiUrl: string,
	sessionId: string,
	offset: number,
	slice: Blob,
	jwt: string | null | undefined,
	onProgress: (loaded: number) => void
): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.upload.addEventListener('progress', (e) => onProgress(e.loaded));
		xhr.addEventListener('load', () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				onProgress(slice.size);
				// Server echoes the new high-water mark. Fall back to
				// offset+size (correct for the normal append) if unparseable.
				let newOffset = offset + slice.size;
				try {
					const body = JSON.parse(xhr.responseText) as { offset?: number };
					if (typeof body?.offset === 'number') newOffset = body.offset;
				} catch {
					/* keep the fallback */
				}
				resolve(newOffset);
				return;
			}
			let message = `Chunk at ${offset} failed: ${xhr.status}`;
			let serverOffset: number | undefined;
			try {
				const body = JSON.parse(xhr.responseText) as { error?: string; offset?: number };
				if (body?.error) message = body.error;
				if (typeof body?.offset === 'number') serverOffset = body.offset;
			} catch {
				/* response wasn't JSON — keep the generic message */
			}
			const err = xhrError(message, { status: xhr.status });
			if (serverOffset !== undefined) err.serverOffset = serverOffset;
			reject(err);
		});
		xhr.addEventListener('error', () => reject(xhrError('Network error', { retryable: true })));
		xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));
		xhr.open(
			'POST',
			`${apiUrl}/v1/upload/chunk?session=${encodeURIComponent(sessionId)}&offset=${offset}`
		);
		xhr.setRequestHeader('Content-Type', 'application/octet-stream');
		if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
		xhr.send(slice);
	});
}

// The "where was I" query — re-syncs the client's offset after a defensive
// 409 gap (or if a 409 body lacked the offset). Returns the server's
// contiguous received offset.
async function getUploadStatus(
	apiUrl: string,
	sessionId: string,
	jwt: string | null | undefined
): Promise<number> {
	const resp = await fetch(`${apiUrl}/v1/upload/status?session=${encodeURIComponent(sessionId)}`, {
		headers: { ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}) }
	});
	if (!resp.ok) throw xhrError(`Upload status failed: ${resp.status}`, { status: resp.status });
	const body = (await resp.json()) as { offset?: number };
	return typeof body?.offset === 'number' ? body.offset : 0;
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

// The browser is reporting a hard offline state. `navigator.onLine === false`
// is the reliable direction (true doesn't guarantee reachability, but false
// does mean "no network"), which is exactly what we gate the pause on. DevTools'
// "Offline" throttling drives this the same way a real disconnect does.
function isOffline(): boolean {
	return typeof navigator !== 'undefined' && navigator.onLine === false;
}

// Resolves as soon as the browser fires `online` (or immediately if it never
// went offline / exposes no signal). Rejects once we've stayed offline past
// OFFLINE_MAX_WAIT_MS so a permanently-dropped connection fails with a clear
// message instead of hanging on a session the server will eventually reap.
function waitForOnline(maxWaitMs = OFFLINE_MAX_WAIT_MS): Promise<void> {
	if (!isOffline()) return Promise.resolve();
	return new Promise<void>((resolve, reject) => {
		const cleanup = () => {
			window.removeEventListener('online', onOnline);
			clearTimeout(timer);
		};
		const onOnline = () => {
			cleanup();
			resolve();
		};
		const timer = setTimeout(() => {
			cleanup();
			reject(
				new Error(
					`Upload paused: still offline after ${Math.round(maxWaitMs / 60000)} minutes. Please try again.`
				)
			);
		}, maxWaitMs);
		window.addEventListener('online', onOnline);
	});
}

// Wraps a retryable upload op with offline-aware resume. While the browser is
// offline we *pause* (not a retry) and wait for reconnection, then let the
// op run — it re-reads the server's high-water mark each attempt, so a resumed
// chunk picks up exactly where the drop left off. withRetry still handles the
// short online blips (2 quick retries). A give-up that coincides with the
// browser having gone offline again loops back into the wait instead of
// failing, which is what turns "throttle to offline" from a hard error into a
// resume once you're back on. `onRetry` drives the amber "reconnecting" banner.
async function withReconnect<T>(
	op: () => Promise<T>,
	label: string,
	onRetry?: (isRetrying: boolean) => void
): Promise<T> {
	for (;;) {
		if (isOffline()) {
			onRetry?.(true);
			posthog.capture('upload_offline_wait', { label });
			await waitForOnline();
			posthog.capture('upload_offline_resumed', { label });
		}
		try {
			const result = await withRetry(op, label, 2, 1000, onRetry);
			onRetry?.(false);
			return result;
		} catch (err) {
			// Stay in the retrying state and loop back into the wait: we only
			// gave up because the connection dropped, not because the upload is
			// actually broken.
			if (isRetryable(err) && isOffline()) continue;
			onRetry?.(false);
			throw err;
		}
	}
}

export async function uploadChunked(
	// Accepts a Blob (superclass of File) so callers can pass a reconstructed
	// body for files that misreported size===0 — see $lib/uploadSize.
	file: Blob,
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

	// `offset` is the server-confirmed contiguous high-water mark. Each chunk is
	// sent starting exactly here and, on success, advances to the server's
	// reported offset. A dropped connection mid-chunk is retried in place by
	// withRetry — re-sending the same chunk at the same offset is safe (the
	// server no-ops already-received bytes), which fixes the lost-ACK case the
	// old sequential-index model turned into an unrecoverable 409.
	let offset = 0;
	while (offset < file.size) {
		const newOffset = await withReconnect(
			async () => {
				const start = offset; // read fresh each attempt (a 409 re-sync below can move it)
				const end = Math.min(start + CHUNK_SIZE_BYTES, file.size);
				const slice = file.slice(start, end);
				try {
					return await uploadOneChunkAtOffset(
						apiUrl,
						sessionId,
						start,
						slice,
						jwt,
						(loadedInChunk) => {
							const totalLoaded = Math.min(start + loadedInChunk, file.size);
							if (totalLoaded > maxLoadedSeen) {
								maxLoadedSeen = totalLoaded;
								onUploadProgress?.(maxLoadedSeen, file.size);
							}
						}
					);
				} catch (err) {
					// Defensive: a 409 gap means client and server disagree on
					// the offset. Re-sync from the server's truth and retry from
					// there. Never fires for a well-behaved client (the server's
					// idempotent-duplicate rule absorbs lost-ACK re-sends), but
					// self-heals rather than hard-failing.
					if ((err as RetryableXhrError)?.status === 409) {
						const e = err as RetryableXhrError;
						offset = e.serverOffset ?? (await getUploadStatus(apiUrl, sessionId, jwt));
						throw xhrError('Resyncing upload offset', { retryable: true });
					}
					throw err;
				}
			},
			'chunk_upload',
			onRetryStateChange
		);
		offset = newOffset;
	}

	posthog.capture('chunked_upload_all_chunks_sent', { fileSize: file.size, chunks: totalChunks });
	onPhaseChange?.('processing');

	try {
		const blob = await withReconnect(
			() =>
				completeUpload(apiUrl, sessionId, jwt, (loaded, total) => {
					onPhaseChange?.('downloading');
					onDownloadProgress?.(loaded, total);
				}),
			'chunk_complete',
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
