// Retry wrapper for upload XHRs. Users on unstable connections frequently lose
// the socket mid-transfer; re-sending after a short backoff recovers the
// transient cases. Each retry re-sends the whole body (resumable/chunked
// upload is a possible future step), so this only helps when the connection
// can survive one full pass.
//
// Only network drops and gateway/timeout statuses are retried. 4xx (quota,
// bad input) and processing 500s are deterministic — re-running them would
// re-charge tokens for the same failure.
import { posthog } from '$lib/analytics';

// 408 request timeout, 502/503/504 gateways, and Cloudflare's 52x
// origin-unreachable family.
const RETRYABLE_STATUSES = new Set([408, 502, 503, 504, 520, 521, 522, 523, 524]);

interface RetryableError {
	retryable?: boolean;
	status?: number;
}

export function isRetryable(err: unknown): boolean {
	const e = err as RetryableError | null;
	if (!e) return false;
	return e.retryable === true || (typeof e.status === 'number' && RETRYABLE_STATUSES.has(e.status));
}

/**
 * Runs `attempt`, retrying retryable failures with exponential backoff
 * (~1s, ~2s, plus jitter). `attempt` must be safe to re-run from scratch:
 * reset any phase/progress state at the start of the attempt, and roll back
 * shared progress accounting in its reject paths so a retry doesn't
 * double-count uploaded bytes.
 */
export async function withRetry<T>(
	attempt: () => Promise<T>,
	label: string,
	retries = 2,
	baseDelayMs = 1000
): Promise<T> {
	for (let attemptNo = 0; ; attemptNo++) {
		try {
			return await attempt();
		} catch (err) {
			if (attemptNo >= retries || !isRetryable(err)) throw err;
			posthog.capture('upload_retry', {
				label,
				attempt: attemptNo + 1,
				status: (err as RetryableError)?.status ?? 0
			});
			await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** attemptNo + Math.random() * 400));
		}
	}
}
