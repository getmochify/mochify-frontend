// Human-facing messages for upload failures, and a hook to confirm the
// misreported-size theory in the field.
//
// The server returns a helpful plaintext body on a 413 (e.g. "File too large.
// Free tier is limited to 20 MB. Upgrade to Lite or Pro for larger files.").
// Prefer that when present; fall back to a friendly default so the user never
// sees a bare "Server error: 413".
import { posthog } from '$lib/analytics';

// Stable machine keys for every user-facing upload failure. These exist so the
// failure surfaces can link to the right section of the upload-error guide and
// so PostHog can group failures on a slug instead of on prose — before this,
// manual_compress_failed and magic_flow_failed carried only a free-text
// `error` string, which made the failure inventory a grouping exercise.
//
// Names deliberately diverge from the server's X-Mochify-Reject taxonomy in two
// places: `network_error` is a transport drop while `nlp_unreachable` is the
// prompt service being unreachable (different causes, different advice), and
// the 429 is `quota_exhausted` because it is monthly-allowance exhaustion, not
// a rate limiter — `rate_limited` stays free in case a real one is ever added.
export type UploadErrorKey =
	| 'incomplete_image'
	| 'network_error'
	| 'nlp_unreachable'
	| 'unsupported_format'
	| 'too_many_uploads'
	| 'file_too_large'
	| 'batch_trimmed'
	| 'quota_exhausted'
	| 'processing_failed'
	| 'server_error'
	| 'session_expired';

export interface UploadErrorInfo {
	message: string;
	key: UploadErrorKey;
}

const UPLOAD_HELP_GUIDE = '/guides/why-did-my-upload-fail';

// Section anchors in the published guide. The guide's section ids are frozen
// for exactly this reason: these links are in-product help, so a renamed id
// silently degrades every failure surface to a mid-page scroll.
const HELP_ANCHORS: Record<UploadErrorKey, string> = {
	incomplete_image: '#incomplete-image',
	network_error: '#network-error',
	nlp_unreachable: '#nlp-unreachable',
	unsupported_format: '#unsupported-format',
	too_many_uploads: '#too-many-uploads',
	file_too_large: '#file-too-large',
	batch_trimmed: '#batch-trimmed',
	quota_exhausted: '#quota-exhausted',
	// Both land on the same section: the guide treats a decode failure and a
	// bare 5xx as one "this is ours, not yours" case.
	processing_failed: '#processing-failed',
	server_error: '#processing-failed',
	session_expired: '#session-expired'
};

/** Guide URL for an error key. Anything unmapped goes to the "still stuck" section. */
export function helpUrlForKey(key?: string): string {
	const anchor = key ? HELP_ANCHORS[key as UploadErrorKey] : undefined;
	return `${UPLOAD_HELP_GUIDE}${anchor ?? '#still-stuck'}`;
}

// Fired from the help link's onclick, following the upgrade_cta_clicked /
// signup_cta_clicked pattern. `decoder` rides along on incomplete_image only:
// core's corrupt-image label covers both a genuinely truncated file and any
// other libheif failure, so without it the counts for that one anchor mix two
// unrelated causes and cannot be read.
export function trackHelpLinkClicked(opts: {
	key?: string;
	surface: string;
	decoder?: string;
}): void {
	try {
		posthog.capture('help_link_clicked', {
			error_key: opts.key ?? 'unknown',
			surface: opts.surface,
			...(opts.decoder ? { decoder: opts.decoder } : {})
		});
	} catch {
		/* analytics must never break an upload path */
	}
}

export function uploadErrorMessage(
	status: number,
	serverText?: string,
	rejectLabel?: string
): UploadErrorInfo {
	const text = serverText?.trim();

	// Corrupt/truncated input — the server's `corrupt-image` taxonomy class (a
	// 422). Prefer the X-Mochify-Reject header, but fall back to a status+body
	// match so this still works if the header isn't readable (e.g. before the
	// CORS expose-headers change is deployed). The dominant real cause is an
	// iCloud "Optimize Storage" placeholder that never materialised to full-res,
	// so steer the user to re-download the original rather than blaming the file.
	//
	// Names cloud storage generally rather than iCloud alone: OneDrive's Files
	// On-Demand and Google Drive's streaming mode produce the identical partial
	// file, and 71% of these messages are on Windows, where the iCloud-only
	// wording named the one service the reader was not using.
	const isCorrupt =
		rejectLabel === 'corrupt-image' ||
		(status === 422 && !!text && /corrupt or truncated/i.test(text));
	if (isCorrupt) {
		return {
			message:
				'This image looks incomplete. If it lives in iCloud, OneDrive, Google Drive or ' +
				'another cloud folder, open it once so the full-size original downloads, then try again.',
			key: 'incomplete_image'
		};
	}

	if (status === 413) {
		// This specific reason means the bomb-protection check couldn't parse the
		// image header at all — in practice that's almost always an upload that
		// didn't fully arrive (a dropped/flaky connection), not a bad file. The
		// raw backend wording ("Failed to read image dimensions") means nothing
		// to a user and reads like their photo is broken, so reframe it as a
		// retry-the-upload prompt instead of passing it through verbatim.
		if (text?.includes('Failed to read image dimensions')) {
			return {
				message:
					"That upload didn't complete. The file may be too large to process, or the connection dropped partway. Try a smaller version, or upload it again.",
				key: 'file_too_large'
			};
		}
		return {
			message:
				text && text.length > 0
					? text
					: 'That file is too large to upload. Try a smaller image or upgrade your plan.',
			key: 'file_too_large'
		};
	}
	if (status === 415) {
		return {
			message: text && text.length > 0 ? text : 'That file type is not supported.',
			key: 'unsupported_format'
		};
	}
	if (status === 429) return { message: 'Rate limit exceeded', key: 'quota_exhausted' };
	// Both 503s: the per-identity session cap on init/stage ("Too many concurrent
	// uploads.") and queue saturation on /v1/squish ("Mochify is at capacity.").
	// Different causes and different Retry-After values, but the same advice, and
	// the server's own body already says which one happened.
	if (status === 503) {
		return {
			message:
				text && text.length > 0 ? text : 'Mochify is busy right now. Please retry in a moment.',
			key: 'too_many_uploads'
		};
	}
	// A session the server has already reaped (or a completion sent twice). Only
	// a 404 whose body says so — a bare 404 on any other path is not this.
	if (status === 404 && !!text && /session (not found|expired)|already completed/i.test(text)) {
		return { message: text, key: 'session_expired' };
	}
	// Any other 422 (e.g. jpeg-missing-dht): the server's plaintext body is
	// already user-facing, so pass it through rather than a bare "Server error".
	if (status === 422) {
		return {
			message: text && text.length > 0 ? text : 'That image could not be processed.',
			key: 'processing_failed'
		};
	}
	return {
		message: text && text.length > 0 ? text : `Server error: ${status}`,
		key: 'server_error'
	};
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

// The decoder's own sentence (X-Mochify-Decoder, sanitised server-side by
// ImageValidator::sanitizeForHeader) — e.g. "heifload_buffer: bad seek to 9491"
// vs "heif: Unsupported feature: ...". Set on header-read rejections and, since
// the decode-time catch sites in core's SquishPipeline started emitting it, on
// pipeline rejections too.
//
// This is the field that splits `corrupt-image`. That label is reached BOTH by a
// genuinely truncated file and by any other libheif failure, because core's
// isCorruptImageError matches the bare "heifload" domain — so the count alone
// cannot tell a real iCloud placeholder from an intact photo we simply failed to
// decode, and both get told their image is incomplete.
// Readable cross-origin only because Cors.h lists it in Access-Control-Expose-Headers.
export function readDecoderHeader(xhr: XMLHttpRequest): string | undefined {
	try {
		return xhr.getResponseHeader('X-Mochify-Decoder')?.trim() || undefined;
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
	// in, so rejections stay distinguishable in telemetry. 'stage' is the
	// speculative POST itself, which refuses a file while the user is still
	// typing; it was previously the one reject path that reported nothing.
	source: 'squish' | 'chunked_complete' | 'staged_complete' | 'stage';
	plan?: string;
	detected?: string;
	decoder?: string;
	/** undefined when the file was never pre-flighted (non-image, or another path). */
	preflightTruncated?: boolean;
}): void {
	try {
		posthog.capture('upload_reject', {
			reject_label: opts.label ?? 'unknown',
			status: opts.status,
			source: opts.source,
			plan: opts.plan ?? 'unknown',
			detected: opts.detected ?? 'unknown',
			decoder: opts.decoder ?? 'unknown',
			preflight_truncated:
				opts.preflightTruncated === undefined ? 'unchecked' : opts.preflightTruncated,
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
