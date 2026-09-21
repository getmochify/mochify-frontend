/**
 * Reading the result of a request that asked core to file its output somewhere
 * (`dest=bucket|drive`) instead of returning it.
 *
 * Core answers a SUCCESSFUL delivery with a JSON receipt in place of the file,
 * and a FAILED one with the file itself plus an `X-Mochify-Bucket-Error` header
 * (mochify-core `helpers/BucketDelivery.h`). That asymmetry is deliberate: the
 * work was already done and already charged, so a storage problem must never
 * cost the user the file. The API reference promises exactly this.
 *
 * So the BODY decides, not the status code — a receipt means it was filed,
 * anything else is the result and should be downloaded as it would have been
 * anyway. Reading it the other way round (parse-or-throw) turns a bucket
 * hiccup into a lost image.
 */

/** True when the body is core's `{ stored: true }` receipt. */
export async function wasStored(blob: Blob): Promise<boolean> {
	// A receipt is small JSON; the fallback is an image, a PDF or a zip.
	if (!blob.type.includes('json')) return false;
	try {
		const receipt = JSON.parse(await blob.text());
		return !!receipt?.stored;
	} catch {
		// A JSON content type with an unparseable body is not a receipt either.
		return false;
	}
}

/**
 * One sentence explaining why a file downloaded instead of being filed.
 *
 * `reason` is core's own `X-Mochify-Bucket-Error`, which is written for people
 * but says "your bucket" for both destinations — so the destination in play is
 * substituted in. It reads as `null` until that header joins core's
 * `Access-Control-Expose-Headers` list, hence the fallback wording.
 */
export function deliveryNote(reason: string | null, destinationLabel: string): string {
	const why = reason
		? reason.replace(/your bucket/gi, destinationLabel).replace(/\.$/, '')
		: `the write to ${destinationLabel} couldn't be completed`;
	return `Downloaded instead — ${why}.`;
}
