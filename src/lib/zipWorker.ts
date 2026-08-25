// Shared zip-download helper for the batch-download paths in ImageUpload,
// PromptForm and PromptFormApp. fflate's zip() concatenates bytes
// synchronously on the calling thread, so doing it on the main thread froze
// the tab for large batches. This hands the work to a worker instead, and
// reads blobs into memory one at a time (not Promise.all) so peak memory
// stays around a single file's size rather than every blob plus every
// arraybuffer being resident at once.
import type { ZipWorkerRequest, ZipWorkerResponse } from './workers/zip.worker';

export interface ZipBlobEntry {
	name: string;
	blob: Blob;
}

export async function zipBlobs(entries: ZipBlobEntry[]): Promise<Blob> {
	// Duplicate names: last one wins. Matches the Record<string, Uint8Array>
	// accumulation this replaces, where a later assignment to the same key
	// silently overwrote the earlier one.
	const deduped = new Map<string, Blob>();
	for (const entry of entries) deduped.set(entry.name, entry.blob);

	const worker = new Worker(new URL('./workers/zip.worker.ts', import.meta.url), {
		type: 'module'
	});

	try {
		return await new Promise<Blob>((resolve, reject) => {
			worker.onerror = (event) => {
				reject(event.error instanceof Error ? event.error : new Error(event.message));
			};
			worker.onmessage = (event: MessageEvent<ZipWorkerResponse>) => {
				const msg = event.data;
				if (msg.type === 'done') {
					resolve(new Blob([msg.buffer], { type: 'application/zip' }));
				} else {
					reject(new Error(msg.message));
				}
			};

			(async () => {
				for (const [name, blob] of deduped) {
					const buffer = await blob.arrayBuffer();
					worker.postMessage({ type: 'add', name, buffer } satisfies ZipWorkerRequest, [buffer]);
				}
				worker.postMessage({ type: 'finish' } satisfies ZipWorkerRequest);
			})().catch(reject);
		});
	} finally {
		worker.terminate();
	}
}
