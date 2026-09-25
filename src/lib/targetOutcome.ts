// Reading back what a `targetBytes` request actually achieved.
//
// A byte ceiling is the one parameter that can be honoured PARTIALLY. Core
// searches for a quality (and, unless the lever forbids it, a scale) that fits
// under the ceiling, and when the levers run out before the ceiling is reached
// it returns the smallest file it could honestly produce and says so in
// `X-Mochify-Target: floor`. That is a 200 carrying real image bytes, not an
// error — so without reading the header a missed ceiling is indistinguishable
// from success, and the user finds out when whatever they needed the limit for
// rejects the file.
//
// Lives in its own module because all three upload routes have to report it
// (direct /v1/squish, the staged complete, and the chunked complete) and they
// live in two different files.

/** `X-Mochify-Target`. Absent when no ceiling was requested. */
export type TargetOutcome = 'hit' | 'floor';

/**
 * Read the outcome off a finished XHR.
 *
 * Cross-origin readable only because core lists the header in its
 * Access-Control-Expose-Headers — same constraint as X-Mochify-Reject, and the
 * same failure mode if it is ever dropped there: this returns undefined and the
 * miss goes unreported rather than throwing.
 */
export function readTargetOutcome(xhr: XMLHttpRequest): TargetOutcome | undefined {
	try {
		const raw = xhr.getResponseHeader('X-Mochify-Target')?.trim();
		return raw === 'hit' || raw === 'floor' ? raw : undefined;
	} catch {
		return undefined;
	}
}

/** One output that came back over the ceiling it was given. */
export interface MissedTarget {
	name: string;
	/** The ceiling that was asked for, in bytes. */
	targetBytes: number;
}

/**
 * Decimal units, deliberately — 1 MB is 1,000,000 bytes here.
 *
 * This has to match how the prompt parsed the user's words: they typed "1mb",
 * the NLP read it as 1,000,000, so echoing it back as "1 MB" is the only
 * spelling that does not look like a different number than the one they asked
 * for. The binary formatter used elsewhere in the app renders that same ceiling
 * as "0.95 MB".
 */
export function formatTargetBytes(n: number): string {
	if (n >= 1_000_000) {
		const mb = n / 1_000_000;
		// Trim a trailing .0 so an exact 1 MB ceiling reads as "1 MB".
		return `${mb.toFixed(mb < 10 ? 1 : 0).replace(/\.0$/, '')} MB`;
	}
	return `${Math.round(n / 1000)} KB`;
}

/**
 * The sentence appended to the run's success message when at least one output
 * missed its ceiling. Named and shaped like `deliveryNote` in $lib/delivery,
 * which answers the same kind of question: the work succeeded, but not in the
 * way that was asked for.
 *
 * Deliberately does NOT quote the size that came back. The response body is the
 * image only on the plain single-output path — a multi-variant run answers with
 * a ZIP and a bucket write answers with a JSON receipt, so its length is not the
 * output's length in either case. The header says the ceiling was missed, which
 * is the part that is true everywhere.
 */
export function targetNote(missed: MissedTarget[]): string {
	if (!missed.length) return '';
	if (missed.length === 1) {
		const m = missed[0];
		return `“${m.name}” could not be brought under ${formatTargetBytes(m.targetBytes)} — the smallest version that could be made was saved instead.`;
	}
	return `${missed.length} files could not be brought under their size limit; the smallest version of each was saved instead.`;
}
