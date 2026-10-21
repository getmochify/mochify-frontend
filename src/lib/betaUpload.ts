// Beta upload test suite (/beta/upload). Runs the same file through each upload
// transport on the visitor's REAL connection and reports what happened, so the
// WebSocket path (core's /v1/beta/upload/ws) can be judged against the chunked
// HTTP path on the patchy links it exists for.
//
// Deliberately standalone: production uploads (uploadChunked.ts, uploadStage.ts)
// are not touched or reused, so nothing here can change how /flow behaves. The
// HTTP transport below is a plain fetch re-implementation of the offset path,
// not the production client, which also means it skips withReconnect's offline
// pause. Both transports get the same retry policy so the comparison is fair.
//
// By default a run never calls /v1/upload/complete, so it is free: init only
// peeks the quota and the session is aborted afterwards.

export type Method = 'ws-64k' | 'ws-64k-w64' | 'http-5m' | 'http-256k';

export const METHODS: { id: Method; label: string; note: string }[] = [
	{ id: 'ws-64k', label: 'WebSocket, 64 KB frames', note: 'beta, 1 MB in flight' },
	{ id: 'ws-64k-w64', label: 'WebSocket, 64 KB frames, wide', note: 'beta, 4 MB in flight' },
	{ id: 'http-5m', label: 'HTTP chunks, 5 MB', note: 'what /flow uses today' },
	{ id: 'http-256k', label: 'HTTP chunks, 256 KB', note: 'small-chunk comparison' }
];

export interface RunResult {
	method: Method;
	ok: boolean;
	bytes: number;
	ms: number;
	// Connections (WS) or chunk requests (HTTP) that failed and were retried.
	reconnects: number;
	// Bytes handed to the network, including re-sends. An upper bound for HTTP,
	// where a failed request may have sent only part of its chunk.
	bytesAttempted: number;
	// Set when the run processed the result through /v1/upload/complete.
	outputBytes?: number;
	output?: Blob;
	outputType?: string;
	error?: string;
}

export interface RunOptions {
	apiUrl: string;
	token: string | null;
	file: File;
	// Call /v1/upload/complete (charges 1 operation) instead of aborting.
	process: boolean;
	params: Record<string, string>;
	// Force a disconnect every N bytes per connection (0 = only real drops).
	dropEvery: number;
	onProgress: (offset: number) => void;
	onLog: (line: string) => void;
	signal: AbortSignal;
}

const WS_FRAME = 64 * 1024;
// Frames in flight before waiting for acks. The wide variant exists to test
// whether the window is what holds the WebSocket below 5 MB HTTP chunks on a
// fast link (measured 2.8 s vs 1.9 s for ~16 MB wired). If it closes the gap,
// the window was the limit; if not, the cost is per frame.
const WS_WINDOW: Partial<Record<Method, number>> = { 'ws-64k': 16, 'ws-64k-w64': 64 };
// No ack for this long means a half-dead connection, which patchy Wi-Fi
// produces more often than a clean close.
const WS_STALL_MS = 20_000;
// Retries count only attempts that made no progress since the last one, so a
// long upload on a link that keeps dropping but keeps moving is never abandoned.
const MAX_STALLED_RETRIES = 10;
const RUN_LIMIT_MS = 10 * 60 * 1000;

const sleep = (ms: number, signal: AbortSignal) =>
	new Promise<void>((resolve, reject) => {
		const t = setTimeout(resolve, ms);
		signal.addEventListener('abort', () => {
			clearTimeout(t);
			reject(new Error('Cancelled'));
		});
	});

const backoff = (stalled: number) => Math.min(500 * 2 ** stalled, 8000);

// The Cloudflare typings make Response.json() return unknown.
type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const readJson = (r: Response): Promise<Json> => r.json().catch(() => ({})) as Promise<Json>;

function authHeaders(token: string | null): Record<string, string> {
	return token ? { Authorization: `Bearer ${token}` } : {};
}

async function initSession(o: RunOptions): Promise<string> {
	const r = await fetch(`${o.apiUrl}/v1/upload/init`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...authHeaders(o.token) },
		body: JSON.stringify({ totalBytes: o.file.size, ...o.params }),
		signal: o.signal
	});
	const body = await readJson(r);
	if (!r.ok || !body.sessionId) throw new Error(`init ${r.status}: ${body.error ?? 'no session'}`);
	return body.sessionId as string;
}

async function finishSession(o: RunOptions, session: string, result: RunResult) {
	const q = `session=${encodeURIComponent(session)}`;
	if (!o.process) {
		await fetch(`${o.apiUrl}/v1/upload/abort?${q}`, {
			method: 'POST',
			headers: authHeaders(o.token)
		}).catch(() => {});
		return;
	}
	const r = await fetch(`${o.apiUrl}/v1/upload/complete?${q}`, {
		method: 'POST',
		headers: authHeaders(o.token),
		signal: o.signal
	});
	if (!r.ok) {
		result.ok = false;
		result.error = `complete ${r.status}: ${(await r.text()).slice(0, 200)}`;
		return;
	}
	result.output = await r.blob();
	result.outputBytes = result.output.size;
	result.outputType = r.headers.get('content-type') ?? undefined;
}

// ---- WebSocket ---------------------------------------------------------

type WsOutcome = { offset: number; fatal?: string };

function wsConnection(
	o: RunOptions,
	session: string,
	data: Uint8Array,
	stats: RunResult,
	window: number
): Promise<WsOutcome> {
	return new Promise((resolve) => {
		const url = `${o.apiUrl.replace(/^http/, 'ws')}/v1/beta/upload/ws?session=${encodeURIComponent(session)}`;
		const ws = new WebSocket(url);
		ws.binaryType = 'arraybuffer';
		let pos = 0;
		let acked = 0;
		let total = data.length;
		let inflight = 0;
		let sentHere = 0;
		let settled = false;
		let stallTimer: ReturnType<typeof setTimeout> | undefined;

		const settle = (outcome: WsOutcome) => {
			if (settled) return;
			settled = true;
			clearTimeout(stallTimer);
			o.signal.removeEventListener('abort', onAbort);
			try {
				ws.close();
			} catch {
				/* already closed */
			}
			resolve(outcome);
		};
		const armStall = () => {
			clearTimeout(stallTimer);
			stallTimer = setTimeout(() => {
				o.onLog(`ws: no ack for ${WS_STALL_MS / 1000}s, treating as dropped`);
				settle({ offset: acked });
			}, WS_STALL_MS);
		};
		const onAbort = () => settle({ offset: acked, fatal: 'Cancelled' });
		o.signal.addEventListener('abort', onAbort);

		const pump = () => {
			while (!settled && inflight < window && pos < total) {
				if (o.dropEvery && sentHere >= o.dropEvery) {
					o.onLog(`ws: forced drop at ${pos}`);
					settle({ offset: acked });
					return;
				}
				const frame = data.subarray(pos, Math.min(pos + WS_FRAME, total));
				ws.send(frame);
				pos += frame.length;
				sentHere += frame.length;
				stats.bytesAttempted += frame.length;
				inflight++;
			}
		};

		ws.onopen = () => {
			ws.send(JSON.stringify(o.token ? { token: o.token } : {}));
			armStall();
		};
		ws.onmessage = (e) => {
			const m = JSON.parse(e.data as string);
			if (m.type === 'ready') {
				pos = acked = m.offset;
				total = m.total;
				o.onLog(`ws: ready at ${m.offset}/${m.total}`);
				o.onProgress(acked);
				armStall();
				pump();
			} else if (m.type === 'ack') {
				acked = m.offset;
				inflight--;
				o.onProgress(acked);
				armStall();
				pump();
			} else if (m.type === 'done') {
				settle({ offset: m.offset });
			} else if (m.type === 'error') {
				// 409 means the offset moved under this connection: reconnect
				// and "ready" re-syncs. Everything else will not fix itself.
				o.onLog(`ws: error ${m.status} ${m.error}`);
				settle(
					m.status === 409 ? { offset: acked } : { offset: acked, fatal: `${m.status}: ${m.error}` }
				);
			}
		};
		ws.onclose = () => settle({ offset: acked });
		ws.onerror = () => {
			/* onclose follows */
		};
	});
}

async function runWs(
	o: RunOptions,
	session: string,
	data: Uint8Array,
	stats: RunResult,
	window: number
) {
	const t0 = performance.now();
	let best = 0;
	let stalled = 0;
	for (;;) {
		const { offset, fatal } = await wsConnection(o, session, data, stats, window);
		if (fatal) throw new Error(fatal);
		if (offset >= data.length) return;
		if (offset > best) {
			best = offset;
			stalled = 0;
		} else if (++stalled > MAX_STALLED_RETRIES) {
			throw new Error(`gave up after ${MAX_STALLED_RETRIES} reconnects without progress`);
		}
		if (performance.now() - t0 > RUN_LIMIT_MS) throw new Error('run took over 10 minutes');
		stats.reconnects++;
		const wait = backoff(stalled);
		o.onLog(`ws: reconnecting in ${wait} ms`);
		await sleep(wait, o.signal);
	}
}

// ---- HTTP offset chunks ------------------------------------------------

async function serverOffset(o: RunOptions, session: string): Promise<number> {
	const r = await fetch(`${o.apiUrl}/v1/upload/status?session=${encodeURIComponent(session)}`, {
		headers: authHeaders(o.token),
		signal: o.signal
	});
	const body = await readJson(r);
	if (!r.ok) throw new Error(`status ${r.status}: ${body.error ?? ''}`);
	return body.offset as number;
}

async function runHttp(
	o: RunOptions,
	session: string,
	data: Uint8Array,
	chunkSize: number,
	stats: RunResult
) {
	const t0 = performance.now();
	let offset = 0;
	let best = 0;
	let stalled = 0;
	let sentSinceDrop = 0;
	while (offset < data.length) {
		const piece = o.file.slice(offset, Math.min(offset + chunkSize, data.length));
		// fetch has no upload progress, so a request that stops moving is caught
		// by a deadline sized for a slow (~32 KB/s) uplink, not by a stall timer.
		const ctl = new AbortController();
		const onAbort = () => ctl.abort();
		o.signal.addEventListener('abort', onAbort);
		const deadline = setTimeout(() => ctl.abort(), Math.max(30_000, piece.size / 32));
		try {
			// A simulated drop kills the connection once dropEvery bytes have gone
			// out since the last one, so a chunk crossing that point is lost after
			// sending only the bytes before it. A chunk larger than dropEvery can
			// therefore never succeed, exactly as on a link that drops that often.
			if (o.dropEvery && sentSinceDrop + piece.size > o.dropEvery) {
				stats.bytesAttempted += o.dropEvery - sentSinceDrop;
				sentSinceDrop = 0;
				throw new Error('forced drop');
			}
			stats.bytesAttempted += piece.size;
			const r = await fetch(
				`${o.apiUrl}/v1/upload/chunk?session=${encodeURIComponent(session)}&offset=${offset}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/octet-stream', ...authHeaders(o.token) },
					body: piece,
					signal: ctl.signal
				}
			);
			const body = await readJson(r);
			if (r.status === 409) {
				offset = body.offset;
				continue;
			}
			if (!r.ok) {
				// 5xx and 429 may pass; a 4xx is the file or the session.
				if (r.status >= 500 || r.status === 429) throw new Error(`chunk ${r.status}`);
				const err = new Error(`chunk ${r.status}: ${body.error ?? ''}`);
				(err as Error & { fatal?: boolean }).fatal = true;
				throw err;
			}
			offset = body.offset;
			sentSinceDrop += piece.size;
			o.onProgress(offset);
		} catch (e) {
			if (o.signal.aborted) throw new Error('Cancelled');
			if ((e as Error & { fatal?: boolean }).fatal) throw e;
			if (performance.now() - t0 > RUN_LIMIT_MS) throw new Error('run took over 10 minutes');
			stats.reconnects++;
			o.onLog(`http: chunk at ${offset} failed (${(e as Error).message})`);
			for (;;) {
				const wait = backoff(stalled);
				await sleep(wait, o.signal);
				try {
					offset = await serverOffset(o, session);
					break;
				} catch {
					if (++stalled > MAX_STALLED_RETRIES) throw new Error('status unreachable, gave up');
				}
			}
			if (offset > best) {
				best = offset;
				stalled = 0;
			} else if (++stalled > MAX_STALLED_RETRIES) {
				throw new Error(`gave up after ${MAX_STALLED_RETRIES} retries without progress`);
			}
			o.onLog(`http: resuming at ${offset}`);
			o.onProgress(offset);
		} finally {
			clearTimeout(deadline);
			o.signal.removeEventListener('abort', onAbort);
		}
	}
}

// ---- entry -------------------------------------------------------------

export async function runMethod(method: Method, o: RunOptions): Promise<RunResult> {
	const result: RunResult = {
		method,
		ok: false,
		bytes: o.file.size,
		ms: 0,
		reconnects: 0,
		bytesAttempted: 0
	};
	const data = new Uint8Array(await o.file.arrayBuffer());
	let session: string | undefined;
	const t0 = performance.now();
	try {
		session = await initSession(o);
		o.onLog(`${method}: session ${session.slice(0, 10)}…`);
		const window = WS_WINDOW[method];
		if (window) await runWs(o, session, data, result, window);
		else
			await runHttp(o, session, data, method === 'http-5m' ? 5 * 1024 * 1024 : 256 * 1024, result);
		result.ms = Math.round(performance.now() - t0);
		result.ok = true;
		await finishSession(o, session, result);
		session = undefined;
	} catch (e) {
		result.ms = Math.round(performance.now() - t0);
		result.error = (e as Error).message;
	} finally {
		if (session) await finishSession({ ...o, process: false }, session, result);
	}
	return result;
}
