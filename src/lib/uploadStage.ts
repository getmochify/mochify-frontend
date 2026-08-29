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
	/** Stop starting new uploads. In-flight ones are left to finish. */
	abandon(): void;
	/** How many files this stager will attempt (for telemetry/progress maths). */
	readonly eligible: number;
}

export function isStageEligible(file: File): boolean {
	return file.size > 0 && file.size <= STAGE_MAX_BYTES;
}

/** A stager that stages nothing — used when speculation is switched off. */
export function noStager(): Stager {
	return { get: async () => null, abandon: () => {}, eligible: 0 };
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

function stageOne(
	apiUrl: string,
	file: File,
	jwt: string | null | undefined,
	onProgress?: (deltaBytes: number) => void
): Promise<string | null> {
	return new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		let lastLoaded = 0;

		// Resolve rather than reject on every failure path. The caller's fallback
		// is the existing upload, so a staging failure must be invisible.
		const giveUp = (reason: string, status?: number) => {
			// Undo this attempt's contribution so the batch byte counter stays
			// truthful when the file is re-uploaded through the normal path.
			if (lastLoaded > 0) onProgress?.(-lastLoaded);
			posthog.capture('speculative_stage_failed', { reason, status, size: file.size });
			resolve(null);
		};

		xhr.upload.onprogress = (e) => {
			const delta = e.loaded - lastLoaded;
			lastLoaded = e.loaded;
			onProgress?.(delta);
		};
		xhr.onload = () => {
			if (xhr.status < 200 || xhr.status >= 300) {
				// 503 (budget/concurrency), 429 (quota), 413 (plan ceiling), 415
				// (not an image) all land here. None are worth surfacing: either
				// the normal path will hit the same wall and report it properly,
				// or staging simply was not available this time.
				giveUp('http', xhr.status);
				return;
			}
			try {
				const body = JSON.parse(xhr.responseText) as { sessionId?: string };
				if (!body.sessionId) {
					giveUp('no-session-id', xhr.status);
					return;
				}
				resolve(body.sessionId);
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
			resolve(await stageOne(apiUrl, file, jwt, onProgress));
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
		get: (file: File) => results.get(file) ?? Promise.resolve(null),
		abandon: () => {
			abandoned = true;
		},
		eligible: eligible.length
	};
}
