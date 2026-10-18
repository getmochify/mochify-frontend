// What an upload XHR had done when it failed.
//
// A status-0 "Network error" is the same event for three different failures:
// the body never left the device (Android pickers can hand Chrome a File it
// then cannot read, and every retry fails the same way), the connection
// dropped part-way, or the body arrived and the answer was lost — the only
// one that is ours. These fields tell them apart without server logs:
//   bytes_sent 0, file_readable false  -> the device could not read the file
//   0 < bytes_sent < bytes_total        -> the connection dropped mid-upload
//   upload_done true                    -> it arrived; look at core
export interface TransferState {
	bytes_sent: number;
	bytes_total: number;
	upload_done: boolean;
	headers_received: boolean;
	elapsed_ms: number;
	online: boolean;
	// Set by the caller after the final failure (see probeReadable).
	file_readable?: boolean;
}

/**
 * Starts watching `xhr`; call the returned function in the failure handler.
 * Call before `send()`. `watchUpload` registers listeners on `xhr.upload`,
 * which makes a cross-origin request preflighted, so leave it off for a
 * request whose body is trivial (it has nothing to measure anyway).
 */
export function trackTransfer(
	xhr: XMLHttpRequest,
	total: number,
	watchUpload = true
): () => TransferState {
	const started = performance.now();
	let sent = 0;
	let done = !watchUpload;
	let headers = false;
	if (watchUpload) {
		xhr.upload.addEventListener('progress', (e) => {
			sent = e.loaded;
		});
		xhr.upload.addEventListener('load', () => {
			sent = total;
			done = true;
		});
	}
	// readyState is DONE by the time 'error' fires, so record the moment the
	// response headers arrived as it happens.
	xhr.addEventListener('readystatechange', () => {
		if (xhr.readyState >= XMLHttpRequest.HEADERS_RECEIVED) headers = true;
	});
	return () => ({
		bytes_sent: sent,
		bytes_total: total,
		upload_done: done,
		headers_received: headers,
		elapsed_ms: Math.round(performance.now() - started),
		online: typeof navigator === 'undefined' ? true : navigator.onLine
	});
}

/** Whether the browser can still read the first bytes of the upload body. */
export async function probeReadable(body: Blob): Promise<boolean> {
	try {
		await body.slice(0, 16).arrayBuffer();
		return true;
	} catch {
		return false;
	}
}

/** The transfer fields of a failed upload, ready to spread into an event. */
export function transferProps(err: unknown): Partial<TransferState> {
	return (err as { transfer?: TransferState } | null)?.transfer ?? {};
}
