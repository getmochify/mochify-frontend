// Shared client side of videoConvert.worker.ts, used by VideoConvert and the
// /flow video branch of PromptFormApp. One worker can run several conversions
// in turn; the caller owns it and terminates it when the batch is done.
import type { ConvertRequest, WorkerResponse } from './workers/videoConvert.worker';

export type { ConvertRequest };

export type Converted = { buffer: ArrayBuffer; keptCodec?: string };

/** Error from a conversion; `fatal` means the converter itself failed to load. */
export type ConvertError = Error & { fatal?: boolean };

export function createVideoWorker(): Worker {
	return new Worker(new URL('./workers/videoConvert.worker.ts', import.meta.url), {
		type: 'module'
	});
}

export function convertInWorker(
	worker: Worker,
	request: ConvertRequest,
	onProgress?: (percent: number) => void
): Promise<Converted> {
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			worker.removeEventListener('message', onMessage);
			worker.removeEventListener('error', onError);
		};
		const onMessage = (event: MessageEvent<WorkerResponse>) => {
			const msg = event.data;
			if (msg.type === 'progress') {
				onProgress?.(msg.value);
			} else if (msg.type === 'done') {
				cleanup();
				resolve({ buffer: msg.buffer, keptCodec: msg.keptCodec });
			} else {
				cleanup();
				reject(Object.assign(new Error(msg.message), { fatal: msg.fatal }));
			}
		};
		// The worker script itself failing to load (a stale chunk after a deploy)
		// fires `error` and never answers, so without this the promise would hang.
		const onError = (event: ErrorEvent) => {
			cleanup();
			const message = event.message || 'Could not load the converter.';
			reject(Object.assign(new Error(message), { fatal: true }));
		};
		worker.addEventListener('message', onMessage);
		worker.addEventListener('error', onError);
		worker.postMessage(request);
	});
}
