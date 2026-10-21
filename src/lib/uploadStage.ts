// Speculative upload — start moving bytes the moment the user submits a prompt,
// while the NLP parse that decides the output params is still in flight.
//
// The magic flow is otherwise strictly serial: Enter → auth → /v1/usage →
// /v1/prompt (1.5-2s) → upload. The user's bytes sit idle for that whole parse.
// Staging overlaps the two, so on a small batch the upload can be *finished*
// before the parse returns rather than merely started.
//
// Mechanism: POST the whole file to /v1/upload/stage, which buffers it in core's
// RAM (zero-retention, same guarantee as /v1/squish) and returns a session id
// WITHOUT any output params. When the parse lands, /v1/upload/complete supplies
// the params and gets the processed image back. No tokens are charged until
// that complete call, so an abandoned or rejected prompt costs the user nothing.
//
// Two transports. Over HTTP (the default, and the fallback where WebSocket is
// blocked) it is ONE POST of the whole body to /v1/upload/stage, files up to
// STAGE_MAX_BYTES only. With `transport: 'ws'` (/flow) it is a deferred
// /v1/upload/init plus the bytes over $lib/uploadWs, which resumes after a drop
// and so also takes files up to STAGE_MAX_BYTES_WS.
//
// Everything here fails SOFT. A staging failure of any kind resolves to null and
// the caller silently falls back to the existing upload path — we are trading
// latency for nothing, so a failure must never become a user-visible error.
import { posthog } from '$lib/analytics';
import { CHUNK_THRESHOLD_BYTES } from '$lib/uploadChunked';
import { wsAvailable, wsTransfer, rememberWsBlocked, WsBlockedError } from '$lib/uploadWs';
import {
	uploadErrorMessage,
	readRejectLabel,
	readDetectedHeader,
	readDecoderHeader,
	trackReject,
	type UploadErrorInfo
} from '$lib/uploadError';

// How many files to stage at once.
//
// Not 25 (the magic flow's file ceiling), for four reasons that all point the
// same way: bandwidth is shared so parallelism past uplink saturation buys
// nothing; every staged file holds its bytes in core's RAM until completed;
// core enforces a 200MB per-identity budget that a 25-wide window of large
// files would breach; and if the parse comes back blocked we have wasted six
// files' worth of the user's bandwidth rather than twenty-five.
export const STAGE_CONCURRENCY = 6;

// Files at or below this go through staging. Above it they belong on the
// resumable chunked path, which is a separate (later) piece of work — so the
// boundary is deliberately the same one uploadChunked.ts already branches on.
export const STAGE_MAX_BYTES = CHUNK_THRESHOLD_BYTES;

export interface Stager {
	/**
	 * The staged session id for `file`, or null if it was never staged, failed
	 * to stage, or staging was abandoned. Never rejects — callers treat null as
	 * "use the normal upload path".
	 */
	get(file: File): Promise<string | null>;
	/**
	 * Why `file` will never upload, if staging rejected it outright.
	 *
	 * Distinct from a null `get()`: that means "stage was unavailable, use the
	 * normal path", whereas a rejection means the server has inspected the bytes
	 * and refused them. Re-uploading would fail identically, so the caller must
	 * skip the file and report this reason instead of silently retrying.
	 */
	rejectionFor(file: File): UploadErrorInfo | undefined;
	/**
	 * Stop starting new uploads AND release any staged session the upload loop
	 * never took. Safe to call more than once, and safe to call on the success
	 * path — a session that was handed out via get() is treated as the caller's
	 * and is never aborted from here.
	 */
	abandon(): void;
	/** How many files this stager will attempt (for telemetry/progress maths). */
	readonly eligible: number;
}

export function isStageEligible(file: File): boolean {
	return file.size > 0 && file.size <= STAGE_MAX_BYTES;
}

// Over the WebSocket, files above STAGE_MAX_BYTES are speculated too, up to
// this size: they are the ones that take longest, so overlapping them with the
// parse saves the most. Only over the socket, because there a drop costs one
// frame; a 25 MB single-POST stage that fails is uploaded twice. 25 MB covers
// phone photos and HEICs; past it the bandwidth spent on a prompt that is then
// rejected or a no-op is the bigger cost.
export const STAGE_MAX_BYTES_WS = 25 * 1024 * 1024;
// Large files stage on their own two workers, never in the six above. Two
// 25 MB sessions sit well inside core's 200 MB per-identity budget alongside
// the small ones, and the small files never wait behind a large one.
export const STAGE_LARGE_CONCURRENCY = 2;

function isLargeStageEligible(file: File): boolean {
	return file.size > STAGE_MAX_BYTES && file.size <= STAGE_MAX_BYTES_WS;
}

/** A stager that stages nothing — used when speculation is switched off. */
export function noStager(): Stager {
	return {
		get: async () => null,
		rejectionFor: () => undefined,
		abandon: () => {},
		eligible: 0
	};
}

/**
 * Tell core to drop a staged session now rather than at its TTL.
 *
 * Fire-and-forget: the server answers 204 whether or not the session was still
 * there, and nothing the caller could do differs either way. `keepalive` lets
 * the request outlive the page if this is ever wired to a teardown handler.
 */
function abortStaged(apiUrl: string, sessionId: string, jwt: string | null | undefined): void {
	void fetch(`${apiUrl}/v1/upload/abort?session=${encodeURIComponent(sessionId)}`, {
		method: 'POST',
		keepalive: true,
		headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
	}).catch(() => {
		// The TTL is the real guarantee; a failed abort just means the bytes wait
		// it out. Never surface this.
	});
}

/**
 * Speculation is only worth attempting when it can pay for itself.
 *
 * `saveData` means the user has explicitly asked the browser to conserve
 * bandwidth, and speculative bytes are exactly the kind that may be discarded.
 * A '2g'-class link is slow enough that staging would still be mid-flight long
 * after the parse returns, so it only adds a round trip and RAM pressure.
 */
export function shouldSpeculate(): boolean {
	if (typeof navigator === 'undefined') return false;
	const conn = (
		navigator as Navigator & {
			connection?: { saveData?: boolean; effectiveType?: string };
		}
	).connection;
	if (!conn) return true; // Unknown connection — assume it is worth it.
	if (conn.saveData) return false;
	if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') return false;
	return true;
}

// Statuses where the server has judged the FILE, not the moment. /v1/upload/stage
// runs ImageValidator and the decompression-bomb check over the whole body before
// reserving anything, so these verdicts are final: the same bytes sent again down
// the normal path get the same answer, having wasted a second upload to do it.
//
// Everything else — 503 (budgets, concurrency), 429 (quota), network failure — is
// about conditions rather than content, and falls back silently.
const HARD_REJECT_STATUSES = new Set([400, 413, 415, 422]);

export interface StageOutcome {
	sessionId: string | null;
	/** Set only for a definitive content rejection. Carries the help key with the message. */
	rejection?: UploadErrorInfo;
}

function stageOne(
	apiUrl: string,
	file: File,
	jwt: string | null | undefined,
	onProgress?: (deltaBytes: number) => void
): Promise<StageOutcome> {
	return new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		let lastLoaded = 0;

		// Resolve rather than reject on every failure path. The caller's fallback
		// is the existing upload, so a staging failure must be invisible.
		const giveUp = (reason: string, status?: number, rejection?: UploadErrorInfo) => {
			// Undo this attempt's contribution so the batch byte counter stays
			// truthful when the file is re-uploaded through the normal path (or
			// skipped entirely, for a rejection).
			if (lastLoaded > 0) onProgress?.(-lastLoaded);
			posthog.capture('speculative_stage_failed', {
				reason,
				status,
				size: file.size,
				rejected: !!rejection
			});
			resolve({ sessionId: null, rejection });
		};

		xhr.upload.onprogress = (e) => {
			const delta = e.loaded - lastLoaded;
			lastLoaded = e.loaded;
			onProgress?.(delta);
		};
		xhr.onload = () => {
			if (xhr.status < 200 || xhr.status >= 300) {
				if (HARD_REJECT_STATUSES.has(xhr.status)) {
					// The server has seen the bytes and refused them. Carry the
					// reason back so the caller can drop the file and say why,
					// rather than uploading it a second time to be told again.
					const rejectLabel = readRejectLabel(xhr);
					// Stage is the EARLIEST point a content rejection can happen —
					// core runs ImageValidator and the bomb check over the whole body
					// here, while the user is still typing. It was also the only
					// reject path that reported nothing beyond a generic
					// `speculative_stage_failed`, so a truncated HEIC caught at the
					// best possible moment was invisible in the same breakdown as the
					// squish/complete rejections. Same event, same shape.
					trackReject({
						label: rejectLabel,
						status: xhr.status,
						source: 'stage',
						detected: readDetectedHeader(xhr),
						decoder: readDecoderHeader(xhr),
						file
					});
					giveUp(
						'rejected',
						xhr.status,
						uploadErrorMessage(xhr.status, xhr.responseText, rejectLabel)
					);
					return;
				}
				// Conditions, not content — fall back silently.
				giveUp('http', xhr.status);
				return;
			}
			try {
				const body = JSON.parse(xhr.responseText) as { sessionId?: string };
				if (!body.sessionId) {
					giveUp('no-session-id', xhr.status);
					return;
				}
				resolve({ sessionId: body.sessionId });
			} catch {
				giveUp('bad-json', xhr.status);
			}
		};
		xhr.onerror = () => giveUp('network');
		xhr.onabort = () => giveUp('abort');

		xhr.open('POST', `${apiUrl}/v1/upload/stage`);
		xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
		if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
		xhr.send(file);
	});
}

// WebSocket staging: a deferred /v1/upload/init (no params, same contract as
// /v1/upload/stage) and the bytes over $lib/uploadWs, so a drop while the
// prompt parses costs one frame instead of the whole file. Same fail-soft
// contract as stageOne. 'blocked' (the socket never connected) and
// 'unsupported' (a core without deferred init) both tell the caller to stage
// over HTTP instead; only 'blocked' says anything about the network.
//
// One thing moves: /v1/upload/stage validates the whole body as it lands, and
// a deferred init cannot. The first frame still gets core's magic-byte check
// (a non-image is refused while the user is typing), but a truncated or bomb
// file is now refused at /v1/upload/complete, which the upload loop already
// reports as a rejection ('staged_complete').
async function stageOneWs(
	apiUrl: string,
	file: File,
	jwt: string | null | undefined,
	onProgress?: (deltaBytes: number) => void,
	onRetryStateChange?: (retrying: boolean) => void
): Promise<StageOutcome | 'blocked' | 'unsupported'> {
	let lastLoaded = 0;
	const rollback = () => {
		if (lastLoaded > 0) onProgress?.(-lastLoaded);
		lastLoaded = 0;
	};
	const giveUp = (reason: string, status?: number, rejection?: UploadErrorInfo): StageOutcome => {
		rollback();
		posthog.capture('speculative_stage_failed', {
			reason,
			status,
			size: file.size,
			rejected: !!rejection,
			transport: 'ws'
		});
		return { sessionId: null, rejection };
	};

	let sessionId: string;
	try {
		const resp = await fetch(`${apiUrl}/v1/upload/init`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
			},
			body: JSON.stringify({ totalBytes: file.size, deferred: true })
		});
		const body = (await resp.json().catch(() => ({}))) as {
			sessionId?: string;
			error?: string;
			deferred?: boolean;
		};
		if (!resp.ok) {
			// init only judges the size against the plan here (413); everything
			// else is conditions, as for stageOne.
			if (HARD_REJECT_STATUSES.has(resp.status)) {
				return giveUp('rejected', resp.status, uploadErrorMessage(resp.status, body.error ?? ''));
			}
			return giveUp('http', resp.status);
		}
		if (!body.sessionId) return giveUp('no-session-id', resp.status);
		// A core without deferred init ignores the flag and makes an ordinary
		// session, which would then process with DEFAULT params and ignore the
		// ones complete sends. Never use one; stage over HTTP instead.
		if (body.deferred !== true) {
			abortStaged(apiUrl, body.sessionId, jwt);
			return 'unsupported';
		}
		sessionId = body.sessionId;
	} catch {
		return giveUp('network');
	}

	try {
		await wsTransfer({
			apiUrl,
			sessionId,
			file,
			jwt,
			rejectSource: 'staged_ws',
			onRetryStateChange,
			onProgress: (acked) => {
				onProgress?.(acked - lastLoaded);
				lastLoaded = acked;
			}
		});
		return { sessionId };
	} catch (err) {
		if (err instanceof WsBlockedError) {
			rollback();
			abortStaged(apiUrl, sessionId, jwt);
			return 'blocked';
		}
		const status = (err as { status?: number }).status;
		// A first-frame refusal: core has already dropped the session.
		if (status && HARD_REJECT_STATUSES.has(status)) {
			const e = err as Error & { errorKey?: UploadErrorInfo['key']; rejectLabel?: string };
			return giveUp('rejected', status, {
				message: e.message,
				key: e.errorKey ?? uploadErrorMessage(status, e.message, e.rejectLabel).key
			});
		}
		abortStaged(apiUrl, sessionId, jwt);
		return giveUp(status ? 'http' : 'network', status);
	}
}

/**
 * Begin staging `files` immediately. Returns synchronously so the caller can
 * fire the NLP request in the same tick — the whole point is that these two
 * happen at once.
 *
 * @param onProgress receives byte deltas (negative on rollback) so the caller's
 *                   existing upload-progress counter stays accurate.
 */
export function startStaging(
	files: File[],
	apiUrl: string,
	jwt: string | null | undefined,
	onProgress?: (deltaBytes: number) => void,
	// 'ws' stages over $lib/uploadWs (resumable), falling back to the
	// single-POST stage when the socket is blocked. Only /flow passes it.
	opts: { transport?: 'http' | 'ws'; onRetryStateChange?: (retrying: boolean) => void } = {}
): Stager {
	let useWs = opts.transport === 'ws' && wsAvailable();
	const small = files.filter(isStageEligible);
	const large = useWs ? files.filter(isLargeStageEligible) : [];
	const eligible = [...small, ...large];
	const results = new Map<File, Promise<string | null>>();
	// Session ids we hold that the upload loop has not taken responsibility for.
	// A file leaves this map the moment get() hands its id out — from then on the
	// caller will either complete it (which consumes the session server-side) or
	// fail, and aborting underneath an in-flight completion would be a bug.
	const unclaimed = new Map<File, string>();
	// Files the server refused outright, with the reason to show the user.
	const rejections = new Map<File, UploadErrorInfo>();
	let abandoned = false;

	// Each worker pulls the next file rather than the list being pre-partitioned,
	// so one slow large file cannot stall a whole slice of the batch.
	const resolvers = new Map<File, (v: string | null) => void>();
	for (const f of eligible) {
		results.set(f, new Promise<string | null>((res) => resolvers.set(f, res)));
	}

	// Two queues, each pulled by its own workers.
	const runWorker = async (queue: File[]): Promise<void> => {
		while (queue.length > 0) {
			const file = queue.shift()!;
			const resolve = resolvers.get(file)!;
			const isLarge = !isStageEligible(file);
			// A large file is only ever staged over the socket (see
			// STAGE_MAX_BYTES_WS); once the batch has lost it, it waits for the
			// parse like any other large file.
			if (abandoned || (isLarge && !useWs)) {
				resolve(null);
				continue;
			}
			let outcome: StageOutcome | 'blocked' | 'unsupported' | undefined;
			if (useWs) {
				outcome = await stageOneWs(apiUrl, file, jwt, onProgress, opts.onRetryStateChange);
				if (outcome === 'blocked' || outcome === 'unsupported') {
					// Stop trying the socket for the rest of this batch. For
					// 'blocked', the HTTP stage working is what proves the network
					// blocks it.
					const blocked = outcome === 'blocked';
					useWs = false;
					if (isLarge) {
						outcome = { sessionId: null };
					} else {
						outcome = await stageOne(apiUrl, file, jwt, onProgress);
						if (blocked && outcome.sessionId) rememberWsBlocked();
					}
				}
			} else {
				outcome = await stageOne(apiUrl, file, jwt, onProgress);
			}
			const { sessionId, rejection } = outcome;
			if (rejection) rejections.set(file, rejection);
			if (sessionId) {
				// abandon() may have fired while this upload was in flight; that
				// call could not have seen this session, so release it here.
				if (abandoned) {
					abortStaged(apiUrl, sessionId, jwt);
					resolve(null);
					continue;
				}
				unclaimed.set(file, sessionId);
			}
			resolve(sessionId);
		}
	};

	if (eligible.length > 0) {
		posthog.capture('speculative_stage_started', {
			files: eligible.length,
			large: large.length,
			skipped: files.length - eligible.length,
			bytes: eligible.reduce((sum, f) => sum + f.size, 0)
		});
		const smallQueue = [...small];
		const largeQueue = [...large];
		for (let i = 0; i < Math.min(STAGE_CONCURRENCY, smallQueue.length); i++)
			void runWorker(smallQueue);
		for (let i = 0; i < Math.min(STAGE_LARGE_CONCURRENCY, largeQueue.length); i++)
			void runWorker(largeQueue);
	}

	return {
		get: (file: File) => {
			// Handing the id out transfers ownership: the upload loop will consume
			// it at /v1/upload/complete, so abandon() must not abort it afterwards.
			unclaimed.delete(file);
			return results.get(file) ?? Promise.resolve(null);
		},
		rejectionFor: (file: File) => rejections.get(file),
		abandon: () => {
			abandoned = true;
			if (unclaimed.size > 0) {
				posthog.capture('speculative_aborted', { sessions: unclaimed.size });
				for (const sessionId of unclaimed.values()) abortStaged(apiUrl, sessionId, jwt);
				unclaimed.clear();
			}
		},
		eligible: eligible.length
	};
}
