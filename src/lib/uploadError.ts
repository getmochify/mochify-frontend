// Human-facing messages for upload failures, and a hook to confirm the
// misreported-size theory in the field.
//
// The server returns a helpful plaintext body on a 413 (e.g. "File too large.
// Free tier is limited to 20 MB. Upgrade to Lite or Pro for larger files.").
// Prefer that when present; fall back to a friendly default so the user never
// sees a bare "Server error: 413".
import { posthog } from '$lib/analytics';

export function uploadErrorMessage(
	status: number,
	serverText?: string,
	rejectLabel?: string
): string {
	const text = serverText?.trim();

	// Corrupt/truncated input — the server's `corrupt-image` taxonomy class (a
	// 422). Prefer the X-Mochify-Reject header, but fall back to a status+body
	// match so this still works if the header isn't readable (e.g. before the
	// CORS expose-headers change is deployed). The dominant real cause is an
	// iCloud "Optimize Storage" placeholder that never materialised to full-res,
	// so steer the user to re-download the original rather than blaming the file.
	const isCorrupt =
		rejectLabel === 'corrupt-image' ||
		(status === 422 && !!text && /corrupt or truncated/i.test(text));
	if (isCorrupt) {
		return (
			"This image looks incomplete — if it's stored in iCloud, open it in " +
			'Photos or Preview first to download the full-resolution original, then try again.'
		);
	}

	if (status === 413) {
		// This specific reason means the bomb-protection check couldn't parse the
		// image header at all — in practice that's almost always an upload that
		// didn't fully arrive (a dropped/flaky connection), not a bad file. The
		// raw backend wording ("Failed to read image dimensions") means nothing
		// to a user and reads like their photo is broken, so reframe it as a
		// retry-the-upload prompt instead of passing it through verbatim.
		if (text?.includes('Failed to read image dimensions')) {
			return "That upload didn't complete. The file may be too large to process, or the connection dropped partway. Try a smaller version, or upload it again.";
		}
		return text && text.length > 0
			? text
			: 'That file is too large to upload. Try a smaller image or upgrade your plan.';
	}
	if (status === 415) return text && text.length > 0 ? text : 'That file type is not supported.';
	if (status === 429) return 'Rate limit exceeded';
	// Any other 422 (e.g. jpeg-missing-dht): the server's plaintext body is
	// already user-facing, so pass it through rather than a bare "Server error".
	if (status === 422) return text && text.length > 0 ? text : 'That image could not be processed.';
	return text && text.length > 0 ? text : `Server error: ${status}`;
}

// The server's rejection taxonomy label (utils/ImageProcessor.h classifyLoadError),
// surfaced as the X-Mochify-Reject response header. Readable cross-origin only
// because Cors.h lists it in Access-Control-Expose-Headers; returns undefined if
// absent (older core, or a non-pipeline rejection like a 413/429).
export function readRejectLabel(xhr: XMLHttpRequest): string | undefined {
	try {
		return xhr.getResponseHeader('X-Mochify-Reject')?.trim() || undefined;
	} catch {
		return undefined;
	}
}

// The server's header-bytes diagnostic (X-Mochify-Detected, from core's
// ImageValidator::describeHeader) — e.g. "len=28 magic=46554a4946494c4d4343442d"
// or "len=2480762 magic=... brands=heic,mif1,...". Set on a 415, which core
// decides from magic bytes alone BEFORE any decoder runs, so nothing downstream
// ever sees the file: this string and core's own log line are the only records
// that the rejection happened. Capturing it here is what turns "Unknown or
// unsupported image format" from an unactionable count into a named file type.
// Readable cross-origin only because Cors.h lists it in Access-Control-Expose-Headers.
export function readDetectedHeader(xhr: XMLHttpRequest): string | undefined {
	try {
		return xhr.getResponseHeader('X-Mochify-Detected')?.trim() || undefined;
	} catch {
		return undefined;
	}
}

// Fire-and-forget telemetry for a server-classified rejection. Only meaningful
// when a label is present (the pipeline classified the failure), which lets us
// measure the field rate of each class — e.g. what share of failures are
// corrupt-image (truncated HEIC) vs a real engine-error. Mirrors trackUpload413.
export function trackReject(opts: {
	label?: string;
	status: number;
	// 'staged_complete' is the speculative path in $lib/uploadStage.ts — same
	// /v1/upload/complete endpoint as 'chunked_complete', different upload route
	// in, so rejections stay distinguishable in telemetry.
	source: 'squish' | 'chunked_complete' | 'staged_complete';
	plan?: string;
	detected?: string;
}): void {
	try {
		posthog.capture('upload_reject', {
			reject_label: opts.label ?? 'unknown',
			status: opts.status,
			source: opts.source,
			plan: opts.plan ?? 'unknown',
			detected: opts.detected ?? 'unknown',
			ua: typeof navigator !== 'undefined' ? navigator.userAgent : ''
		});
	} catch {
		/* analytics must never break an upload path */
	}
}

// Read an XHR's plaintext error body regardless of responseType (we use
// responseType='blob' for the compressed image, so a 413's text arrives as a
// Blob). Best-effort — returns undefined if nothing readable.
export async function readXhrErrorText(xhr: XMLHttpRequest): Promise<string | undefined> {
	try {
		const r = xhr.response;
		if (!r) return undefined;
		if (typeof r === 'string') return r;
		if (r instanceof Blob) return await r.text();
	} catch {
		/* ignore */
	}
	return undefined;
}

// Fire-and-forget telemetry for a 413. `reportedSize` is the File's own
// (possibly misreported) size; `resolvedSize` is what we measured. A cluster
// of reportedSize=0 with a large resolvedSize confirms the cloud-provider
// placeholder theory; resolvedSize under the plan limit points at a plan/limit
// mismatch instead.
export function trackUpload413(opts: {
	reportedSize: number;
	resolvedSize: number;
	plan?: string;
}): void {
	try {
		posthog.capture('upload_413', {
			reported_size: opts.reportedSize,
			resolved_size: opts.resolvedSize,
			size_misreported: opts.reportedSize === 0 && opts.resolvedSize > 0,
			plan: opts.plan ?? 'unknown',
			ua: typeof navigator !== 'undefined' ? navigator.userAgent : ''
		});
	} catch {
		/* analytics must never break an upload path */
	}
}
