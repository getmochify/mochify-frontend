// Reliable upload-size resolution.
//
// Some File objects misreport `file.size === 0` even though the underlying
// content is large — most commonly files picked from Android cloud document
// providers (Google Drive / Google Photos / OneDrive) and un-downloaded
// iCloud photos on iOS. Every upload guard we have keys off `file.size`:
//   - the oversize check (drop files over the plan's per-file limit),
//   - the chunk-vs-direct routing (files > CHUNK_THRESHOLD go chunked).
// A misreported 0 slips past both: it passes the size filter, is routed to the
// single-POST /v1/squish path, and then `xhr.send(file)` streams the *real*
// bytes — which either trips Drogon's 80 MB body cap (a raw 413 the UI never
// modelled) or silently bypasses the per-plan size limit. This is why 413s
// cluster on low-end-Android / cloud-storage-heavy populations rather than by
// distance.
//
// resolveUploadSize() closes the gap by draining the file's stream to measure
// the true byte length whenever `file.size` is unusable, bailing out as soon
// as it crosses the limit so we never buffer more than we must. When the file
// is within the limit we retain the drained bytes as a Blob (cached per File)
// so the subsequent upload sends real content with a correct Content-Length —
// which also lets the server reject early instead of accumulating the body.

// Bytes we had to buffer while measuring a misreported file, keyed by the
// original File so the upload path can send real content. WeakMap → the Blob
// is GC'd once the File is dropped from the selection.
const bodyCache = new WeakMap<File, Blob>();

export interface ResolvedSize {
	// True byte length as far as we measured (may stop early once over limit).
	size: number;
	// false when we had to measure because file.size was unusable.
	trusted: boolean;
	// true when size is known to exceed the passed limit.
	exceededLimit: boolean;
	// true when file.size was unusable AND we could recover no bytes (the stream
	// threw, or drained to zero). Such a file can't be uploaded by any path — no
	// size to route on, chunking would send zero chunks, and a direct POST sends
	// an empty/truncated body — so callers should drop it up front rather than
	// letting it fail as a confusing server error.
	unreadable: boolean;
}

// The body to actually upload for this file: the measured-bytes Blob when we
// had to reconstruct a misreported file, otherwise the original File.
export function uploadBodyOf(file: File): File | Blob {
	return bodyCache.get(file) ?? file;
}

// The size to route/validate/report on: the reconstructed body's size when we
// measured one, otherwise the File's own (trusted, non-zero) size.
export function effectiveSize(file: File): number {
	const cached = bodyCache.get(file);
	return cached ? cached.size : file.size;
}

export async function resolveUploadSize(file: File, limit: number): Promise<ResolvedSize> {
	// Fast path: a plausible non-zero size is trustworthy — no read needed.
	if (file.size > 0) {
		return { size: file.size, trusted: true, exceededLimit: file.size > limit, unreadable: false };
	}

	// file.size is 0/unknown — drain the stream to measure the real length,
	// retaining bytes so the true content can be uploaded if it fits.
	try {
		const reader = file.stream().getReader();
		const chunks: Uint8Array[] = [];
		let total = 0;
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
			total += value.byteLength;
			if (total > limit) {
				// Over the ceiling — stop reading and drop it; no point buffering more.
				await reader.cancel();
				return { size: total, trusted: false, exceededLimit: true, unreadable: false };
			}
		}
		// Drained cleanly but yielded no bytes: an empty or unmaterialised
		// placeholder file. Nothing to upload, so flag it unreadable rather than
		// letting it POST an empty body.
		if (total === 0) return { size: 0, trusted: false, exceededLimit: false, unreadable: true };
		// chunks are ArrayBuffer-backed Uint8Arrays from a File stream; the cast
		// satisfies the lib's SharedArrayBuffer-pedantic BlobPart typing.
		bodyCache.set(file, new Blob(chunks as BlobPart[], { type: file.type }));
		return { size: total, trusted: false, exceededLimit: false, unreadable: false };
	} catch {
		// Streaming unsupported/failed on a file that also reported size 0: we have
		// no way to read its bytes, so it can't be uploaded correctly by any path.
		// Flag it unreadable so callers drop it with a helpful message instead of
		// streaming it into a confusing server error (a truncated 413).
		return { size: 0, trusted: false, exceededLimit: false, unreadable: true };
	}
}
