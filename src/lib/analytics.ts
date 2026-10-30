// Lazy posthog-js wrapper. Keeps the ~63kB (gzipped) analytics bundle off the
// critical path: posthog-js is dynamically imported and initialised on idle,
// and any capture/identify/reset/captureException calls made before it finishes
// loading are queued and replayed once it's ready.
//
// Drop-in for the browser SDK — components import { posthog } from '$lib/analytics'
// and keep calling posthog.capture(...) etc. unchanged. (Server code uses
// posthog-node via $lib/server/posthog and is unaffected.)
import { browser } from '$app/environment';

type Method =
	| 'capture'
	| 'identify'
	| 'reset'
	| 'captureException'
	| 'startSessionRecording'
	| 'stopSessionRecording';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let instance: any = null;
let loadPromise: Promise<void> | null = null;
let initArgs: [string, Record<string, unknown>?] | null = null;
const queue: Array<{ method: Method; args: unknown[] }> = [];

function load(): Promise<void> {
	if (!browser) return Promise.resolve();
	if (loadPromise) return loadPromise;
	loadPromise = import('posthog-js')
		.then(({ default: ph }) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (initArgs) ph.init(...(initArgs as [string, any]));
			instance = ph;
			// Replay anything captured before posthog finished loading.
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			for (const { method, args } of queue) (ph as any)[method](...args);
			queue.length = 0;
		})
		.catch(() => {
			/* analytics is best-effort — never let it break the app */
		});
	return loadPromise;
}

function scheduleIdleLoad(): void {
	if (!browser) return;
	const ric = (
		window as unknown as {
			requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
		}
	).requestIdleCallback;
	if (ric) ric(() => load(), { timeout: 3000 });
	else setTimeout(load, 1500);
}

function call(method: Method, args: unknown[]): void {
	if (!browser) return;
	if (instance) {
		instance[method](...args);
	} else {
		// A real event arrived before idle — queue it and start loading now.
		queue.push({ method, args });
		load();
	}
}

export const posthog = {
	init(token: string, config?: Record<string, unknown>): void {
		initArgs = [token, config];
		scheduleIdleLoad();
	},
	capture(...args: unknown[]): void {
		call('capture', args);
	},
	identify(...args: unknown[]): void {
		call('identify', args);
	},
	reset(...args: unknown[]): void {
		call('reset', args);
	},
	captureException(...args: unknown[]): void {
		call('captureException', args);
	},
	/**
	 * Start replay for this session only. Recording is off by default
	 * (disable_session_recording in $lib/posthogConfig), so the recorder
	 * script loads only for sessions that call this.
	 */
	startSessionRecording(...args: unknown[]): void {
		call('startSessionRecording', args);
	},
	stopSessionRecording(...args: unknown[]): void {
		call('stopSessionRecording', args);
	},
	/**
	 * A flag's value once flags have loaded, or undefined when they don't load
	 * within `timeoutMs` (blocked, offline, slow). Reading it records the
	 * exposure ($feature_flag_called), so call it where the variant actually
	 * changes what the visitor sees, and treat undefined as "not in the test".
	 */
	getFeatureFlag(key: string, timeoutMs = 2000): Promise<string | boolean | undefined> {
		if (!browser) return Promise.resolve(undefined);
		return new Promise((resolve) => {
			let done = false;
			const finish = (value: string | boolean | undefined) => {
				if (done) return;
				done = true;
				resolve(value);
			};
			setTimeout(() => finish(undefined), timeoutMs);
			load().then(() => {
				if (!instance) return finish(undefined);
				// Fires straight away when flags are already loaded, and again on
				// every reload; `done` keeps it to one read and one exposure.
				instance.onFeatureFlags(() => {
					if (!done) finish(instance.getFeatureFlag(key));
				});
			});
		});
	}
};
