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
// Deliberately NOT chunked: chunking exists for resumability on large files, and
// a small file on a flaky link needs re-sending rather than resuming. Staging is
// one round trip where the chunked path is init + N chunks + complete.
//
// Everything here fails SOFT. A staging failure of any kind resolves to null and
// the caller silently falls back to the existing upload path — we are trading
// latency for nothing, so a failure must never become a user-visible error.
import { posthog } from '$lib/analytics';
import { CHUNK_THRESHOLD_BYTES } from '$lib/uploadChunked';
import { uploadErrorMessage } from '$lib/uploadError';

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
	rejectionFor(file: File): string | undefined;
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
	/** Set only for a definitive content rejection. */
	rejection?: string;
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
		const giveUp = (reason: string, status?: number, rejection?: string) => {
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
					giveUp(
						'rejected',
						xhr.status,
						uploadErrorMessage(
							xhr.status,
							xhr.responseText,
							xhr.getResponseHeader('X-Mochify-Reject') ?? undefined
						)
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
	onProgress?: (deltaBytes: number) => void
): Stager {
	const eligible = files.filter(isStageEligible);
	const results = new Map<File, Promise<string | null>>();
	// Session ids we hold that the upload loop has not taken responsibility for.
	// A file leaves this map the moment get() hands its id out — from then on the
	// caller will either complete it (which consumes the session server-side) or
	// fail, and aborting underneath an in-flight completion would be a bug.
	const unclaimed = new Map<File, string>();
	// Files the server refused outright, with the reason to show the user.
	const rejections = new Map<File, string>();
	let abandoned = false;
	let cursor = 0;

	// Each worker pulls the next file rather than the list being pre-partitioned,
	// so one slow large file cannot stall a whole slice of the batch.
	const resolvers = new Map<File, (v: string | null) => void>();
	for (const f of eligible) {
		results.set(f, new Promise<string | null>((res) => resolvers.set(f, res)));
	}

	const runWorker = async (): Promise<void> => {
		while (cursor < eligible.length) {
			const file = eligible[cursor++];
			const resolve = resolvers.get(file)!;
			if (abandoned) {
				resolve(null);
				continue;
			}
			const { sessionId, rejection } = await stageOne(apiUrl, file, jwt, onProgress);
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
			skipped: files.length - eligible.length,
			bytes: eligible.reduce((sum, f) => sum + f.size, 0)
		});
		for (let i = 0; i < Math.min(STAGE_CONCURRENCY, eligible.length); i++) void runWorker();
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
