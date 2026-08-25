// Zips already-compressed image bytes off the main thread. Uses fflate's
// streaming Zip API with ZipPassThrough entries (store only, no
// re-compression - inputs are already-compressed images, matching the
// previous level: 0 setting). One-shot: the caller spins up a fresh worker
// per zip and terminates it once the archive comes back.
import { Zip, ZipPassThrough } from 'fflate';

export type ZipWorkerRequest =
	{ type: 'add'; name: string; buffer: ArrayBuffer } | { type: 'finish' };

export type ZipWorkerResponse =
	{ type: 'done'; buffer: ArrayBuffer } | { type: 'error'; message: string };

// `self` is typed as `Window` under the project's DOM lib (no `webworker`
// lib is configured, and the two can't be mixed in one tsconfig). The
// worker/main-thread postMessage(message, transfer) shape is identical to
// `Worker.postMessage`, so casting through that interface keeps this file
// type-safe without pulling in a conflicting global lib.
const ctx = self as unknown as Worker;

let archive: Zip | null = null;
let chunks: Uint8Array[] = [];
let totalLength = 0;

function reportError(err: unknown) {
	const message = err instanceof Error ? err.message : String(err);
	ctx.postMessage({ type: 'error', message } satisfies ZipWorkerResponse);
}

function getArchive(): Zip {
	if (archive) return archive;
	archive = new Zip((err, chunk, final) => {
		if (err) {
			reportError(err);
			return;
		}
		if (chunk) {
			chunks.push(chunk);
			totalLength += chunk.length;
		}
		if (final) {
			const merged = new Uint8Array(totalLength);
			let offset = 0;
			for (const c of chunks) {
				merged.set(c, offset);
				offset += c.length;
			}
			chunks = [];
			totalLength = 0;
			ctx.postMessage({ type: 'done', buffer: merged.buffer } satisfies ZipWorkerResponse, [
				merged.buffer
			]);
		}
	});
	return archive;
}

ctx.onmessage = (event: MessageEvent<ZipWorkerRequest>) => {
	const msg = event.data;
	try {
		if (msg.type === 'add') {
			const file = new ZipPassThrough(msg.name);
			getArchive().add(file);
			file.push(new Uint8Array(msg.buffer), true);
		} else if (msg.type === 'finish') {
			getArchive().end();
		}
	} catch (err) {
		reportError(err);
	}
};
