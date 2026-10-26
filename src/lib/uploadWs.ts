// WebSocket byte transfer for /flow (core's /v1/upload/ws). Moves a
// file's bytes into an EXISTING upload session — created by /v1/upload/init,
// deferred or not — so init, complete, billing and validation stay exactly
// where uploadChunked.ts and uploadStage.ts already have them.
//
// Why: on a link that drops, an HTTP request loses everything it was carrying,
// so 5 MB chunks re-send up to 5 MB per drop and a single-POST stage re-sends
// the whole file. Here the server acknowledges every 64 KB frame, a drop costs
// only what was in flight, and resuming is reconnecting (the server says where
// it got to). Measured on /beta/upload (2026-10-21): fastest of the four
// transports on a wired link once 64 frames are allowed in flight, and the only
// one that never re-sent more than what was in flight on a dropping link.
//
// Opt-in per caller: only PromptFormApp passes `transport: 'ws'`. ImageUpload,
// the CLI, the API and the extension keep the HTTP paths.
//
// Failure contract:
//   - WsBlockedError: the socket never reached "ready" while the browser was
//     online. The caller falls back to HTTP on the SAME session, and records
//     the network as blocked only if that fallback then works (rememberWsBlocked).
//   - errors with `status` (+ `errorKey`, `rejectLabel`): the server refused the
//     file or the session, shaped like uploadChunked.ts's errors so the existing
//     handling and messages apply unchanged. 404 carries `sessionExpired`.
//   - anything else after NO_PROGRESS_LIMIT_MS without progress: give up.
import { posthog } from '$lib/analytics';
import { uploadErrorMessage, trackReject, type UploadErrorKey } from '$lib/uploadError';

const FRAME_BYTES = 64 * 1024; // core's client_max_websocket_message_size is 128K
// Frames in flight before waiting for acks. 16 (1 MB) held a wired link to
// ~2/3 of 5 MB HTTP chunks; 64 (4 MB) beat them. Nothing is lost by the wider
// window on a drop: resume is driven by the server's own offset.
const WINDOW_FRAMES = 64;
const CONNECT_MS = 10_000; // no "ready" by now: treat the attempt as dropped
const STALL_MS = 20_000; // no ack for this long: a half-dead connection
// Same patience as uploadChunked.ts's OFFLINE_MAX_WAIT_MS, measured from the
// last progress rather than from going offline, so a link that keeps dropping
// but keeps moving is never abandoned.
const NO_PROGRESS_LIMIT_MS = 5 * 60 * 1000;
// A first connection can fail on a merely patchy link; two in a row with the
// browser online and nothing ever acknowledged is what a blocked network
// looks like.
const BLOCKED_AFTER_FAILED_CONNECTS = 2;

const BLOCKED_KEY = 'mochify.ws-blocked-until';
const BLOCKED_FOR_MS = 24 * 60 * 60 * 1000;

export class WsBlockedError extends Error {
	constructor() {
		super('WebSocket unavailable on this network');
	}
}

interface WsHttpError extends Error {
	status?: number;
	errorKey?: UploadErrorKey;
	rejectLabel?: string;
	sessionExpired?: boolean;
}

export interface WsTransferOptions {
	apiUrl: string;
	sessionId: string;
	file: Blob;
	jwt?: string | null;
	/** Server-acknowledged bytes: monotonic, and true even across reconnects. */
	onProgress?: (acked: number, total: number) => void;
	onRetryStateChange?: (retrying: boolean) => void;
	/** For reject telemetry and messages only. */
	rejectSource?: 'chunked_ws' | 'staged_ws';
}

/** WebSocket exists and this network has not recently been seen to block it. */
export function wsAvailable(): boolean {
	if (typeof WebSocket === 'undefined') return false;
	try {
		return Number(localStorage.getItem(BLOCKED_KEY) ?? 0) < Date.now();
	} catch {
		return true;
	}
}

/**
 * Called by a caller whose HTTP fallback SUCCEEDED after a WsBlockedError —
 * the evidence that the socket, not the link, was the problem. Stored per
 * browser for a day, so a blocked network stops paying the connect timeout
 * on every upload; a laptop that leaves the hotel finds WebSocket again
 * tomorrow.
 */
export function rememberWsBlocked(): void {
	posthog.capture('upload_ws_blocked');
	try {
		localStorage.setItem(BLOCKED_KEY, String(Date.now() + BLOCKED_FOR_MS));
	} catch {
		/* private mode: we simply probe again next time */
	}
}

const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Resolves on `online`, or after `ms` regardless: onLine can be wrong in both
// directions, so it shortens the wait rather than deciding it.
function waitForOnline(ms: number): Promise<void> {
	if (!isOffline()) return Promise.resolve();
	return new Promise((resolve) => {
		const done = () => {
			clearTimeout(t);
			window.removeEventListener('online', done);
			resolve();
		};
		const t = setTimeout(done, ms);
		window.addEventListener('online', done);
	});
}

type Attempt =
	| { kind: 'done' }
	| { kind: 'dropped'; acked: number; reachedReady: boolean }
	| { kind: 'fatal'; error: WsHttpError };

function httpError(status: number, message: string, rejectLabel?: string): WsHttpError {
	const { message: text, key } = uploadErrorMessage(status, message, rejectLabel);
	const err: WsHttpError = new Error(text);
	err.status = status;
	err.errorKey = key;
	if (rejectLabel) err.rejectLabel = rejectLabel;
	if (status === 404) err.sessionExpired = true;
	return err;
}

// One connection, from open to close. Never rejects; the outcome says what
// happened and the loop in wsTransfer decides what to do about it.
// Frames are Blob slices: the browser reads them from the file as it sends, so
// a 75 MB upload never sits in memory whole.
function attempt(o: WsTransferOptions, startAcked: number, onReady: () => void): Promise<Attempt> {
	return new Promise((resolve) => {
		const base = o.apiUrl.replace(/^http/, 'ws');
		const ws = new WebSocket(`${base}/v1/upload/ws?session=${encodeURIComponent(o.sessionId)}`);
		ws.binaryType = 'arraybuffer';
		const total = o.file.size;
		let pos = startAcked;
		let acked = startAcked;
		let inflight = 0;
		let reachedReady = false;
		let settled = false;
		let timer: ReturnType<typeof setTimeout> | undefined;

		const settle = (a: Attempt) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			window.removeEventListener('offline', onOffline);
			try {
				ws.close();
			} catch {
				/* already closed */
			}
			resolve(a);
		};
		const dropped = () => settle({ kind: 'dropped', acked, reachedReady });
		const arm = (ms: number) => {
			clearTimeout(timer);
			timer = setTimeout(dropped, ms);
		};
		const onOffline = () => dropped();
		window.addEventListener('offline', onOffline);
		arm(CONNECT_MS);

		const pump = () => {
			while (!settled && inflight < WINDOW_FRAMES && pos < total) {
				const end = Math.min(pos + FRAME_BYTES, total);
				ws.send(o.file.slice(pos, end));
				pos = end;
				inflight++;
			}
		};

		ws.onopen = () => ws.send(JSON.stringify(o.jwt ? { token: o.jwt } : {}));
		ws.onmessage = (e) => {
			let m: { type?: string; offset?: number; status?: number; error?: string; reject?: string };
			try {
				m = JSON.parse(e.data as string);
			} catch {
				return;
			}
			if (m.type === 'ready') {
				reachedReady = true;
				onReady();
				pos = acked = m.offset ?? 0;
				o.onProgress?.(acked, total);
				arm(STALL_MS);
				pump();
			} else if (m.type === 'ack') {
				acked = m.offset ?? acked;
				inflight--;
				o.onProgress?.(acked, total);
				arm(STALL_MS);
				pump();
			} else if (m.type === 'done') {
				o.onProgress?.(total, total);
				settle({ kind: 'done' });
			} else if (m.type === 'error') {
				const status = m.status ?? 0;
				// 409: the offset moved under this connection; reconnecting re-syncs.
				// 503: auth momentarily unavailable on core's side; worth a retry.
				if (status === 409 || status === 503) return dropped();
				if (m.reject) {
					trackReject({
						label: m.reject,
						status,
						source: o.rejectSource ?? 'chunked_ws',
						file: o.file instanceof File ? o.file : undefined
					});
				}
				settle({ kind: 'fatal', error: httpError(status, m.error ?? '', m.reject) });
			}
		};
		ws.onclose = dropped;
		ws.onerror = () => {
			/* onclose follows */
		};
	});
}

/** Resolves once every byte of `file` is in the session; see the file header for failures. */
export async function wsTransfer(o: WsTransferOptions): Promise<void> {
	const total = o.file.size;
	let acked = 0;
	let everReady = false;
	let failedConnects = 0;
	let failures = 0;
	let lastProgress = performance.now();
	const started = lastProgress;
	// Summarised once per upload in `finally` rather than captured per drop:
	// one patchy connection was logging dozens of events a session.
	let reconnects = 0;
	let outcome: 'done' | 'failed' = 'failed';
	let retrying = false;
	const setRetrying = (r: boolean) => {
		if (r !== retrying) {
			retrying = r;
			o.onRetryStateChange?.(r);
		}
	};

	try {
		for (;;) {
			const a = await attempt(o, acked, () => setRetrying(false));
			if (a.kind === 'done') {
				outcome = 'done';
				return;
			}
			if (a.kind === 'fatal') throw a.error;

			if (a.reachedReady) {
				everReady = true;
				failedConnects = 0;
			} else if (!isOffline()) {
				failedConnects++;
			}
			if (!everReady && failedConnects >= BLOCKED_AFTER_FAILED_CONNECTS) throw new WsBlockedError();

			if (a.acked > acked) {
				acked = a.acked;
				lastProgress = performance.now();
				failures = 0;
			}
			const left = NO_PROGRESS_LIMIT_MS - (performance.now() - lastProgress);
			if (left <= 0) {
				const err: WsHttpError = new Error('Upload stalled: no progress for 5 minutes.');
				err.errorKey = 'network_error';
				throw err;
			}
			setRetrying(true);
			reconnects++;
			await sleep(Math.min(500 * 2 ** failures++, 8000, left));
			await waitForOnline(left);
		}
	} finally {
		setRetrying(false);
		if (reconnects > 0) {
			posthog.capture('upload_ws_resumed', {
				reconnects,
				outcome,
				acked,
				total,
				ms: Math.round(performance.now() - started)
			});
		}
	}
}
