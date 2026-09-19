// The last few Magic Flow prompts, kept in localStorage for /flow only.
//
// Why only /flow: it is the installed PWA and the surface people come back to,
// so "the thing I typed last Tuesday for eBay listings" is worth having. The
// homepage is a demo somebody tries once, often on a shared machine, and a
// stranger's half-typed instructions sitting in the suggestion row there is a
// worse first impression than no feature at all. The component takes a
// `rememberPrompts` prop rather than reading the route, the same way `maxWidth`
// handles the other per-surface difference.
//
// Nothing here leaves the browser. It is the viewer's own text on the viewer's
// own device, never sent anywhere, and `clearPromptHistory` is wired to a
// visible control rather than buried, because the point of a privacy-first
// product is that the user can see and undo what it keeps.

export type PromptMode = 'image' | 'pdf' | 'video' | 'create';

export type PromptHistoryEntry = {
	text: string;
	/** Which tray this was typed for, so a PDF prompt is not offered for images. */
	mode: PromptMode;
};

const KEY = 'mochify:prompt-history:v1';

/** Enough to cover "what did I do last time" without becoming a log. */
export const PROMPT_HISTORY_LIMIT = 10;

/** How many are surfaced as chips. The row already carries the static suggestions. */
export const PROMPT_HISTORY_VISIBLE = 3;

// "webp" is a prompt. "w" is a slip of the keyboard on the way to submitting.
const MIN_LENGTH = 3;

const MODES: PromptMode[] = ['image', 'pdf', 'video', 'create'];

function isEntry(value: unknown): value is PromptHistoryEntry {
	if (typeof value !== 'object' || value === null) return false;
	const entry = value as Record<string, unknown>;
	return (
		typeof entry.text === 'string' &&
		entry.text.length > 0 &&
		typeof entry.mode === 'string' &&
		MODES.includes(entry.mode as PromptMode)
	);
}

/**
 * Read the stored history. Returns an empty list for every failure: storage
 * disabled (Safari private browsing throws on access, not just on write),
 * cleared site data, or a stored value from some other version of this shape.
 */
export function loadPromptHistory(): PromptHistoryEntry[] {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(isEntry).slice(0, PROMPT_HISTORY_LIMIT);
	} catch {
		return [];
	}
}

/**
 * Add a prompt and persist, newest first. Returns the new list so the caller
 * can assign it straight to state.
 *
 * Deliberately called when a prompt is SUBMITTED rather than when it succeeds.
 * A prompt that failed, or that hit a paywall, is the one most worth getting
 * back: the user is about to retry it or edit it. It is also a single call
 * site, where "on success" would mean touching all five of the branch tails
 * that clear the prompt.
 */
export function rememberPrompt(
	history: PromptHistoryEntry[],
	text: string,
	mode: PromptMode
): PromptHistoryEntry[] {
	const trimmed = text.trim();
	if (trimmed.length < MIN_LENGTH) return history;

	// Same prompt again (same words, same tray) moves to the front rather than
	// filling the list with itself. Case-insensitive because "Convert to WebP"
	// and "convert to webp" are the same instruction.
	const deduped = history.filter(
		(entry) => !(entry.mode === mode && entry.text.toLowerCase() === trimmed.toLowerCase())
	);
	const next = [{ text: trimmed, mode }, ...deduped].slice(0, PROMPT_HISTORY_LIMIT);

	try {
		localStorage.setItem(KEY, JSON.stringify(next));
	} catch {
		// Full, disabled, or private mode. The in-memory list still works for
		// this session, which is better than refusing to recall anything.
	}
	return next;
}

/** Forget everything. Wired to the visible control on the chip row. */
export function clearPromptHistory(): void {
	try {
		localStorage.removeItem(KEY);
	} catch {
		/* nothing stored means nothing to remove */
	}
}

/**
 * The entries worth offering for the current tray. A null mode means nothing is
 * attached yet, so nothing has ruled anything out: show the most recent few
 * whatever they were for.
 */
export function promptsForMode(
	history: PromptHistoryEntry[],
	mode: 'image' | 'pdf' | 'video' | null,
	limit: number = PROMPT_HISTORY_VISIBLE
): PromptHistoryEntry[] {
	const matching = mode === null ? history : history.filter((entry) => entry.mode === mode);
	return matching.slice(0, limit);
}

// ---------------------------------------------------------------------------
// "Same again"
//
// Watching real sessions, people finish a batch, drop the next one in, and type
// "same again" - so the words they already reach for should work. This resolves
// them locally rather than in the prompt service: the worker is stateless and
// cached through AI Gateway, so teaching the model about a previous turn would
// mean a conversation schema, a worse cache key, and tokens spent on a lookup
// the browser can do for free.
//
// Only a prompt that is *nothing but* a repeat phrase resolves. "same again but
// as PNG" carries a modifier, and silently dropping it would be worse than
// sending it to the model, which understands it perfectly well.
// ---------------------------------------------------------------------------

const REPEAT_PHRASES = new Set([
	'same',
	'same again',
	'same as before',
	'same as last time',
	'same thing',
	'same thing again',
	'same settings',
	'do the same',
	'do the same again',
	'do it again',
	'do that again',
	'again',
	'repeat',
	'repeat that',
	'redo',
	'redo that',
	'one more time'
]);

export function isRepeatPhrase(text: string): boolean {
	const normalized = text
		.trim()
		.toLowerCase()
		.replace(/[.!?]+$/, '')
		.replace(/^please\s+/, '')
		.replace(/\s+please$/, '')
		.replace(/\s+/g, ' ');
	return REPEAT_PHRASES.has(normalized);
}

/**
 * The most recent stored prompt for exactly this tray. Strict on mode: a PDF
 * instruction repeated onto images would be a confident wrong answer, which is
 * worse than asking the user to type it.
 */
export function lastPromptForMode(
	history: PromptHistoryEntry[],
	mode: PromptMode
): PromptHistoryEntry | null {
	return history.find((entry) => entry.mode === mode) ?? null;
}
