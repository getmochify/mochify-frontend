import { posthog } from '$lib/analytics';

/**
 * Telling someone a big batch has finished while they are in another tab.
 *
 * Processing is driven by the open tab, so the useful moment is "I switched
 * away while 40 files ran", not "email me tomorrow". Two signals, both local:
 *
 * 1. The tab title counts the run (`(12/40) Mochify`) and flags the finish
 *    until the tab is looked at again. No permission, works for guests.
 * 2. A browser notification at the end, for visitors who opted in from the
 *    link shown on big batches. Asked in context, never on load: a cold prompt
 *    gets denied, and a denial cannot be asked again.
 *
 * Desktop only for the notification. There is no service worker, and without
 * one Android Chrome throws on `new Notification()` and iOS has no constructor
 * at all; a mobile tab in the background is usually frozen anyway.
 */

export type NotifySurface = 'manual' | 'flow';

/** A run this big is worth offering, and announcing, a notification for. */
export const NOTIFY_MIN_FILES = 5;
/** Or a run that took this long, whatever its size. */
export const NOTIFY_MIN_MS = 30_000;

const supported = (): boolean =>
	typeof window !== 'undefined' &&
	'Notification' in window &&
	window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Whether to show the "Notify me" link: supported, and not yet answered. */
export function canAskToNotify(): boolean {
	return supported() && Notification.permission === 'default';
}

export function notifyGranted(): boolean {
	return supported() && Notification.permission === 'granted';
}

/** Must run from a click: browsers drop permission requests without a gesture. */
export async function askToNotify(surface: NotifySurface): Promise<NotificationPermission> {
	let result: NotificationPermission = 'default';
	try {
		result = await Notification.requestPermission();
	} catch {
		/* a browser that refuses the request outright counts as unanswered */
	}
	posthog.capture('batch_notify_asked', { surface, result });
	return result;
}

/**
 * The tab title during a run. `progress` takes over the title on first call,
 * `finish` hands it back: at once if the tab is in view, otherwise with a done
 * marker that clears when the visitor returns. `reset` is for unmount.
 */
export function createBatchTitle() {
	let base: string | null = null;
	let marked: string | null = null;
	let onReturn: (() => void) | null = null;

	const clearMark = () => {
		if (onReturn) document.removeEventListener('visibilitychange', onReturn);
		onReturn = null;
		// Only undo our own title: a navigation since may have set a new one.
		if (marked !== null && base !== null && document.title === marked) document.title = base;
		marked = null;
	};

	return {
		progress(done: number, total: number) {
			if (total < 2) return;
			if (base === null) {
				clearMark();
				base = document.title;
			}
			document.title = `(${done}/${total}) ${base}`;
		},
		finish(ok: boolean) {
			if (base === null) return;
			if (!document.hidden) {
				document.title = base;
				base = null;
				return;
			}
			marked = `${ok ? '✓ Done' : '⚠ Needs a look'} · ${base}`;
			document.title = marked;
			onReturn = () => {
				if (document.hidden) return;
				clearMark();
				base = null;
			};
			document.addEventListener('visibilitychange', onReturn);
		},
		reset() {
			if (base !== null && marked === null && document.title.startsWith('(')) document.title = base;
			clearMark();
			base = null;
		}
	};
}

/**
 * Announce a finished run, if it was big or long, the tab is out of view, and
 * the visitor opted in. Clicking it brings the tab back.
 */
export function notifyBatchDone(opts: {
	surface: NotifySurface;
	ok: boolean;
	body: string;
	files: number;
	startedAt: number;
}): void {
	if (!document.hidden || !notifyGranted()) return;
	if (opts.files < NOTIFY_MIN_FILES && Date.now() - opts.startedAt < NOTIFY_MIN_MS) return;
	try {
		const n = new Notification(opts.ok ? 'Your files are ready' : 'Your batch needs a look', {
			body: opts.body,
			icon: '/web-app-manifest-192x192.png',
			tag: 'mochify-batch'
		});
		n.onclick = () => {
			window.focus();
			n.close();
			posthog.capture('batch_notify_clicked', { surface: opts.surface });
		};
		posthog.capture('batch_notify_sent', { surface: opts.surface, ok: opts.ok, files: opts.files });
	} catch {
		/* best-effort: the title marker still says it finished */
	}
}
