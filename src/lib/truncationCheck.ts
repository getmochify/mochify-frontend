// Detect a file whose bytes stop before the container says they should, from
// the headers alone, BEFORE it is uploaded.
//
// Why this exists
// ---------------
// The server's `corrupt-image` rejection (core's classifyLoadError, surfaced as
// "This image looks incomplete") is the most common content rejection we serve,
// and the population it hits is the one that drags photos straight out of Apple
// Photos or Google Photos. Those drags hand the browser a file-promise temp file
// or an iCloud "Optimize Storage" placeholder, and either can materialise short.
//
// Until now nothing looked. `resolveUploadSize` only reads bytes when
// `file.size === 0`; a truncated file reports a perfectly plausible non-zero
// size, takes the fast path, and is discovered only after a full upload and a
// decode attempt. That costs the user a round trip and a token, and costs us the
// server work, to learn something the first 64 bytes of the file already knew.
//
// What it reads
// -------------
// Container metadata only, via `file.slice()`. ISO-BMFF (HEIC/HEIF/AVIF) is the
// important case and the cheapest: the format declares its own length in a chain
// of top-level box headers, so walking them reads 8 to 16 bytes per box, and a
// camera HEIC has three or four (ftyp, meta, mdat). Everything else is a single
// read of the last kilobyte looking for the format's end-of-file marker.
//
// Bias
// ----
// A false positive here blocks a good photo at the door, which is worse than the
// server rejection this is meant to prevent. So every uncertain outcome returns
// "not truncated" and lets the server decide: unknown container, unreadable
// slice, a box chain that is merely odd rather than short, anything at all
// thrown. The only `truncated: true` results are ones where the file itself
// states a length the bytes do not reach.

export interface TruncationResult {
	truncated: boolean;
	/** Container we recognised, for telemetry: 'isobmff' | 'jpeg' | 'png' | 'gif'. */
	container?: string;
	/** Machine-readable cause, e.g. 'box-overruns-eof' or 'missing-eoi'. */
	reason?: string;
	/** Bytes the container declares beyond the end of the file, when known. */
	shortBy?: number;
}

const NOT_TRUNCATED: TruncationResult = { truncated: false };

// Verdicts kept per File so an upload path can annotate a later server rejection
// with what this check thought at add time. WeakMap: the entry dies with the File.
const verdicts = new WeakMap<File, TruncationResult>();

/**
 * What checkTruncation() concluded about this file, if it has been checked.
 *
 * The point of pairing this with the server's verdict is that neither number
 * means much alone. Measured against production, a HEIC missing 950 bytes off
 * its mdat still decoded to a full JPEG, so "the container declares more bytes
 * than are present" is demonstrably NOT the same thing as "the server will
 * reject this" — libheif tolerates a short tail. Joining the two tells us how
 * predictive the check actually is, which is the only honest basis for ever
 * letting it block an upload.
 */
export function truncationVerdictOf(file: File): TruncationResult | undefined {
	return verdicts.get(file);
}

// Enough to hold any end-of-file marker plus the trailing padding real encoders
// leave behind (EXIF writers and social exporters both append slack after EOI).
const TAIL_BYTES = 1024;

// A pathological or hostile file could declare thousands of tiny top-level
// boxes. A real one has a handful, so anything past this is not a file we want
// to keep reading, and "give up quietly" is the right answer per the bias above.
const MAX_BOXES = 64;

async function readSlice(file: File, start: number, end: number): Promise<Uint8Array | null> {
	try {
		const clampedEnd = Math.min(end, file.size);
		if (start < 0 || clampedEnd <= start) return null;
		const buf = await file.slice(start, clampedEnd).arrayBuffer();
		return new Uint8Array(buf);
	} catch {
		// A slice that throws is the browser telling us the underlying file moved
		// or vanished since the drop. That IS a problem, but not one this function
		// is allowed to diagnose, and resolveUploadSize/the upload itself will
		// surface it. Stay quiet.
		return null;
	}
}

function ascii(bytes: Uint8Array, offset: number, length: number): string {
	let out = '';
	for (let i = 0; i < length; i++) out += String.fromCharCode(bytes[offset + i]);
	return out;
}

/**
 * ISO-BMFF: a flat chain of top-level boxes, each `[4-byte size][4-char type]`,
 * where size covers the header plus the payload and the chain tiles the file
 * exactly. A truncated HEIC is therefore self-announcing: the final box, almost
 * always `mdat`, declares an end past the last byte present. That is precisely
 * the condition that later makes libheif chase a tile offset past EOF and emit
 * the "bad seek to N" that core classifies as corrupt-image.
 *
 * Two sizes are special and must not be mistaken for corruption:
 *   size === 1  the real size is a 64-bit value in the 8 bytes after the type.
 *   size === 0  the box runs to EOF. Legal for the last box, and by definition
 *               never short.
 */
async function checkIsoBmff(file: File): Promise<TruncationResult> {
	let offset = 0;

	for (let i = 0; i < MAX_BOXES; i++) {
		// 16 covers the largesize form; a short read at the end of the file is
		// handled by the length checks below rather than by asking for less.
		const head = await readSlice(file, offset, offset + 16);
		if (!head || head.length < 8) {
			// 1 to 7 bytes left over after a chain that otherwise tiled the file.
			// A conformant file has none, so this is either a cut landing inside a
			// box header or a few bytes of padding appended after a complete one,
			// and with no box type in hand there is nothing to tell them apart.
			// Ambiguity resolves to "let it through": the detectable window is 8
			// bytes per box out of a multi-megabyte photo, which is not worth the
			// chance of blocking a good one. The largesize branch below flags its
			// own version of this because it HAS confirmed a valid box type first.
			return NOT_TRUNCATED;
		}

		const view = new DataView(head.buffer, head.byteOffset, head.byteLength);
		const type = ascii(head, 4, 4);
		// Trailing data appended after a complete chain (rare, but valid enough
		// that decoders ignore it) would otherwise be read as a box, and its junk
		// "size" field could easily exceed the remaining bytes and be reported as
		// an overrun. A real box type is four printable ASCII characters, so this
		// tells "another box" apart from "not a box" before any size is trusted.
		if (!/^[\x20-\x7e]{4}$/.test(type)) return NOT_TRUNCATED;
		let size = view.getUint32(0);
		let headerBytes = 8;

		if (size === 1) {
			if (head.length < 16) {
				// The largesize field itself is cut off, so the file ends inside a
				// box header. Nothing ambiguous about that.
				return {
					truncated: true,
					container: 'isobmff',
					reason: 'truncated-box-header',
					shortBy: offset + 16 - file.size
				};
			}
			// getBigUint64 is exact; Number() is safe because any real size is far
			// below 2^53 and an absurd one is caught by the overrun check anyway.
			size = Number(view.getBigUint64(8));
			headerBytes = 16;
		} else if (size === 0) {
			return NOT_TRUNCATED; // runs to EOF by definition
		}

		// A size smaller than its own header is a malformed chain, not a short
		// one, and continuing would loop forever. Hand it to the server.
		if (size < headerBytes) return NOT_TRUNCATED;

		const declaredEnd = offset + size;
		if (declaredEnd > file.size) {
			return {
				truncated: true,
				container: 'isobmff',
				reason: `box-overruns-eof:${type.trim() || 'unknown'}`,
				shortBy: declaredEnd - file.size
			};
		}
		if (declaredEnd === file.size) return NOT_TRUNCATED; // chain tiled it exactly

		offset = declaredEnd;
	}

	return NOT_TRUNCATED;
}

/**
 * Formats that end in a fixed marker. Each is checked by searching the last
 * kilobyte rather than the final bytes exactly, because trailing padding after
 * the marker is common and completely valid, while the marker being absent from
 * a whole kilobyte of tail is not something a complete file does.
 */
async function checkTrailer(
	file: File,
	container: string,
	found: (tail: Uint8Array) => boolean
): Promise<TruncationResult> {
	const tail = await readSlice(file, Math.max(0, file.size - TAIL_BYTES), file.size);
	if (!tail || tail.length === 0) return NOT_TRUNCATED;
	if (found(tail)) return NOT_TRUNCATED;
	return { truncated: true, container, reason: 'missing-trailer' };
}

// JPEG's EOI. Safe to search for in the tail: inside entropy-coded data every
// 0xFF is followed by 0x00 or a restart marker (0xD0-0xD7), so a bare 0xFFD9 is
// unambiguously the end-of-image marker and not image content.
function hasJpegEoi(tail: Uint8Array): boolean {
	for (let i = tail.length - 2; i >= 0; i--) {
		if (tail[i] === 0xff && tail[i + 1] === 0xd9) return true;
	}
	return false;
}

// PNG's terminating chunk: length 0, type "IEND", then its CRC.
function hasPngIend(tail: Uint8Array): boolean {
	for (let i = tail.length - 4; i >= 0; i--) {
		if (tail[i] === 0x49 && tail[i + 1] === 0x45 && tail[i + 2] === 0x4e && tail[i + 3] === 0x44)
			return true;
	}
	return false;
}

// GIF's trailer byte. Only the very end is checked: 0x3B is an ordinary data
// byte elsewhere, so scanning for it the way the others are scanned would find
// one in almost any file and prove nothing.
function hasGifTrailer(tail: Uint8Array): boolean {
	return tail[tail.length - 1] === 0x3b;
}

/**
 * Identify the container from its magic bytes and run the matching check.
 *
 * Returns `{ truncated: false }` for anything not recognised, which includes
 * WebP, JXL, SVG and every non-image. Extending this file is the way to add
 * one, never widening a caller's assumption about what a false means.
 */
export async function checkTruncation(file: File): Promise<TruncationResult> {
	const result = await runCheck(file);
	verdicts.set(file, result);
	return result;
}

async function runCheck(file: File): Promise<TruncationResult> {
	try {
		if (file.size < 16) return NOT_TRUNCATED;
		const head = await readSlice(file, 0, 16);
		if (!head || head.length < 12) return NOT_TRUNCATED;

		// ISO-BMFF: "ftyp" at offset 4. Same predicate core uses
		// (utils/ImageValidator.h isIsoBmff), covering HEIC/HEIF/HIF and AVIF.
		if (ascii(head, 4, 4) === 'ftyp') return await checkIsoBmff(file);

		if (head[0] === 0xff && head[1] === 0xd8) return await checkTrailer(file, 'jpeg', hasJpegEoi);

		if (
			head[0] === 0x89 &&
			head[1] === 0x50 &&
			head[2] === 0x4e &&
			head[3] === 0x47 &&
			head[4] === 0x0d &&
			head[5] === 0x0a &&
			head[6] === 0x1a &&
			head[7] === 0x0a
		) {
			return await checkTrailer(file, 'png', hasPngIend);
		}

		if (ascii(head, 0, 6) === 'GIF89a' || ascii(head, 0, 6) === 'GIF87a') {
			return await checkTrailer(file, 'gif', hasGifTrailer);
		}

		return NOT_TRUNCATED;
	} catch {
		// Per the bias note at the top: never block an upload because this check
		// itself failed.
		return NOT_TRUNCATED;
	}
}
