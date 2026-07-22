// Human-facing messages for upload failures, and a hook to confirm the
// misreported-size theory in the field.
//
// The server returns a helpful plaintext body on a 413 (e.g. "File too large.
// Free tier is limited to 20 MB. Upgrade to Lite or Pro for larger files.").
// Prefer that when present; fall back to a friendly default so the user never
// sees a bare "Server error: 413".
import { posthog } from '$lib/analytics';

export function uploadErrorMessage(status: number, serverText?: string): string {
	const text = serverText?.trim();
	if (status === 413) {
		return text && text.length > 0
			? text
			: 'That file is too large to upload. Try a smaller image or upgrade your plan.';
	}
	if (status === 415) return text && text.length > 0 ? text : 'That file type is not supported.';
	if (status === 429) return 'Rate limit exceeded';
	return text && text.length > 0 ? text : `Server error: ${status}`;
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
