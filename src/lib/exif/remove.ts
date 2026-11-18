// Removes metadata from a photo without touching its picture data: the
// output is the input with metadata blocks dropped or edited, and the image
// data (JPEG scans, PNG IDAT, WebP image chunks, HEIF media) is copied byte for
// byte. Rule 1 of content-ops' build brief 2026-11-18.
//
// What goes is decided per value by a `Pick`, using the same classification
// the viewer shows (report.ts) and the same levels (levels.ts), so "remove
// Location" removes exactly what the viewer listed under Location. Essentials
// are never offered to a Pick.
//
// EXIF is edited in place: entries are dropped from their IFD and their data
// zeroed, so every remaining offset, the maker note's included, stays valid.
// When only essentials are left (JPEG, PNG, WebP), the block is rebuilt small.
// HEIF is never resized: its metadata items are overwritten in place.
import exifr from 'exifr';
import { strToU8, zlibSync } from 'fflate';
import {
	detectFormat,
	ascii,
	startsWith,
	indexOfAscii,
	u16be,
	u32be,
	u32le,
	namesPerson,
	PNG_PICTURE,
	PNG_COLOR,
	inflate,
	rawProfile,
	readBoxes,
	readIloc,
	C2PA_UUID,
	type Loc
} from './containers';
import { parseXmp, removeXmpProps, IPTC_NAMES, type XmpProp } from './decoders';
import {
	tiffTarget,
	TECH_KEYS,
	ESSENTIAL_KEYS,
	classifyXmp,
	NS,
	IPTC_SECTIONS,
	pngTextTarget,
	AI_TEXT_KEYS,
	looksLikePrompt,
	type Target
} from './report';
import { levelOf } from './levels';
import type { SectionId } from './sections';

/** Whether to remove one value. `technical`: format bookkeeping (green). */
export type Pick = (section: SectionId, key: string, value: string, technical: boolean) => boolean;

export const pickSections =
	(ids: Iterable<SectionId>): Pick =>
	(section) =>
		new Set(ids).has(section);

export const pickRed: Pick = (section, key, value, technical) =>
	levelOf(section, key, value, technical).level === 'red';

const utf8 = new TextDecoder('utf-8');
const latin1 = new TextDecoder('latin1');

function concat(parts: Uint8Array[]): Uint8Array {
	const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
	let o = 0;
	for (const p of parts) {
		out.set(p, o);
		o += p.length;
	}
	return out;
}

/** A report Target as a Pick question, or null for what is never removed. */
function ask(pick: Pick, t: Target, key: string, value: string): boolean {
	if (t === 'essential' || t === 'skip') return false;
	if (t === 'tech') return pick('other', key, value, true);
	return pick(t, key, value, false);
}

// ---------------------------------------------------------------- EXIF (TIFF)

const TYPE_SIZE = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8, 4];
const POINTERS = new Map([
	[0x8769, 'exif'],
	[0x8825, 'gps'],
	[0xa005, 'interop']
]);
const ESSENTIAL_TAGS = new Set([0x0112, 0x011a, 0x011b, 0x0128]);

type Entry = {
	tag: number;
	type: number;
	count: number;
	raw: Uint8Array;
	dataAt: number;
	size: number;
};
type Ifd = { at: number; entries: Entry[]; next: number };

/**
 * Edits an EXIF block. Returns the new TIFF bytes, the input itself when
 * nothing was picked, or null when nothing at all is left. With `sameSize` the
 * result always has the input's length (HEIF).
 */
export function editTiff(input: Uint8Array, pick: Pick, sameSize: boolean): Uint8Array | null {
	if (input.length < 8) return input;
	const t = input.slice();
	const le = t[0] === 0x49;
	const r16 = (o: number) => (le ? t[o] | (t[o + 1] << 8) : (t[o] << 8) | t[o + 1]);
	const r32 = (o: number) =>
		(le
			? t[o] | (t[o + 1] << 8) | (t[o + 2] << 16) | (t[o + 3] << 24)
			: (t[o] << 24) | (t[o + 1] << 16) | (t[o + 2] << 8) | t[o + 3]) >>> 0;
	const w16 = (o: number, v: number) => {
		if (le) [t[o], t[o + 1]] = [v & 255, v >> 8];
		else [t[o], t[o + 1]] = [v >> 8, v & 255];
	};
	const w32 = (o: number, v: number) => {
		const bytes = [v >>> 24, (v >>> 16) & 255, (v >>> 8) & 255, v & 255];
		t.set(le ? bytes.reverse() : bytes, o);
	};
	const zero = (from: number, len: number) => t.fill(0, from, Math.min(t.length, from + len));

	const readIfd = (at: number): Ifd | null => {
		if (!at || at + 2 > t.length) return null;
		const n = r16(at);
		if (at + 2 + n * 12 + 4 > t.length) return null;
		const entries: Entry[] = [];
		for (let k = 0; k < n; k++) {
			const e = at + 2 + k * 12;
			const type = r16(e + 2);
			const count = r32(e + 4);
			const size = (TYPE_SIZE[type] ?? 1) * count;
			entries.push({
				tag: r16(e),
				type,
				count,
				raw: t.slice(e, e + 12),
				dataAt: size > 4 ? r32(e + 8) : -1,
				size
			});
		}
		return { at, entries, next: r32(at + 2 + n * 12) };
	};
	const writeIfd = (ifd: Ifd, keep: Entry[], next: number) => {
		const oldLen = 2 + ifd.entries.length * 12 + 4;
		zero(ifd.at, oldLen);
		w16(ifd.at, keep.length);
		keep.forEach((e, k) => t.set(e.raw, ifd.at + 2 + k * 12));
		w32(ifd.at + 2 + keep.length * 12, next);
	};
	const valueText = (e: Entry) => {
		const at = e.dataAt >= 0 ? e.dataAt : -1;
		const bytes = at >= 0 ? t.subarray(at, at + e.size) : e.raw.subarray(8, 8 + e.size);
		if (e.type === 2) return latin1.decode(bytes).replace(/\0+$/, '');
		// UserComment: 8 bytes naming the character code, then the text.
		if (e.tag === 0x9286) return latin1.decode(bytes.subarray(8)).replace(/\0+$/, '');
		return '';
	};
	/** An entry's inline value (SHORT or LONG): a pointer, an offset, a length. */
	const inline = (e: Entry) => {
		const v = e.raw.subarray(8, 12);
		if (e.type === 3) return le ? v[0] | (v[1] << 8) : (v[0] << 8) | v[1];
		return (
			(le
				? v[0] | (v[1] << 8) | (v[2] << 16) | (v[3] << 24)
				: (v[0] << 24) | (v[1] << 16) | (v[2] << 8) | v[3]) >>> 0
		);
	};
	const dropData = (e: Entry) => {
		if (e.dataAt >= 0) zero(e.dataAt, e.size);
	};

	const ifd0 = readIfd(r32(4));
	if (!ifd0) return pick('other', 'Unknown', '', false) && !sameSize ? null : input;
	let changed = false;

	/** Edits one IFD's own values; returns the entries it keeps. */
	const sweep = (ifd: Ifd, group: 'ifd0' | 'exif' | 'gps' | 'interop'): Entry[] => {
		const names = exifr.tagKeys.get(group);
		const keep: Entry[] = [];
		for (const e of ifd.entries) {
			if (POINTERS.has(e.tag) || (group === 'ifd0' && ESSENTIAL_TAGS.has(e.tag))) {
				keep.push(e);
				continue;
			}
			let name = names?.get(e.tag) ?? '';
			// A GPS reference (N/S, E/W...) goes with the value it qualifies.
			if (group === 'gps') name = name.replace(/Ref$/, '');
			let remove: boolean;
			if (e.tag === 0x927c) remove = pick('camera', 'MakerNote', '', false);
			else if (!name) remove = pick(group === 'gps' ? 'location' : 'other', 'Unknown', '', false);
			else {
				const value = valueText(e);
				let target = tiffTarget(name, group === 'interop' ? 'interop' : group);
				let key = name;
				if (e.tag === 0x9286 && looksLikePrompt(value)) [target, key] = ['ai', 'AIText'];
				if (TECH_KEYS.has(name) && target !== 'tech') target = 'tech';
				remove = ESSENTIAL_KEYS.has(name) ? false : ask(pick, target, key, value);
			}
			if (remove) {
				dropData(e);
				changed = true;
			} else keep.push(e);
		}
		return keep;
	};

	// Children first, so an emptied child can take its pointer with it.
	const kept0 = sweep(ifd0, 'ifd0');
	const finish = (
		parentKeep: Entry[],
		tag: number,
		group: 'exif' | 'gps' | 'interop',
		inner?: (keep: Entry[]) => Entry[]
	) => {
		const p = parentKeep.find((e) => e.tag === tag);
		if (!p) return parentKeep;
		const child = readIfd(inline(p));
		if (!child) return parentKeep;
		let keep = sweep(child, group);
		if (inner) keep = inner(keep);
		if (keep.length === 0) {
			zero(child.at, 2 + child.entries.length * 12 + 4);
			changed = true;
			return parentKeep.filter((e) => e !== p);
		}
		if (keep.length !== child.entries.length) writeIfd(child, keep, child.next);
		return parentKeep;
	};
	let keep0 = finish(kept0, 0x8769, 'exif', (exifKeep) => finish(exifKeep, 0xa005, 'interop'));
	keep0 = finish(keep0, 0x8825, 'gps');

	// IFD1: the thumbnail, taken whole.
	let next0 = ifd0.next;
	const ifd1 = readIfd(next0);
	if (ifd1 && pick('thumbnail', 'Thumbnail', '', false)) {
		for (const e of ifd1.entries) dropData(e);
		const off = ifd1.entries.find((e) => e.tag === 0x0201);
		const len = ifd1.entries.find((e) => e.tag === 0x0202);
		if (off && len) zero(inline(off), inline(len));
		zero(ifd1.at, 2 + ifd1.entries.length * 12 + 4);
		next0 = 0;
		changed = true;
	}
	if (!changed) return input;
	writeIfd(ifd0, keep0, next0);
	if (sameSize) return t;

	// Only essentials left in IFD0 and nothing else: rebuild it small.
	if (next0 === 0 && keep0.every((e) => ESSENTIAL_TAGS.has(e.tag))) {
		return keep0.length ? minimalTiff(t, keep0, le) : null;
	}
	return t;
}

/** A fresh TIFF holding only the essential IFD0 entries (orientation, density). */
function minimalTiff(src: Uint8Array, keep: Entry[], le: boolean): Uint8Array {
	const extra = keep.reduce((n, e) => n + (e.size > 4 ? e.size : 0), 0);
	const out = new Uint8Array(8 + 2 + keep.length * 12 + 4 + extra);
	const w16 = (o: number, v: number) => out.set(le ? [v & 255, v >> 8] : [v >> 8, v & 255], o);
	const w32 = (o: number, v: number) => {
		const b = [v >>> 24, (v >>> 16) & 255, (v >>> 8) & 255, v & 255];
		out.set(le ? b.reverse() : b, o);
	};
	out.set(le ? [0x49, 0x49, 42, 0] : [0x4d, 0x4d, 0, 42], 0);
	w32(4, 8);
	w16(8, keep.length);
	let data = 8 + 2 + keep.length * 12 + 4;
	keep.forEach((e, k) => {
		const at = 10 + k * 12;
		out.set(e.raw, at);
		if (e.size > 4) {
			out.set(src.subarray(e.dataAt, e.dataAt + e.size), data);
			w32(at + 8, data);
			data += e.size;
		}
	});
	return out;
}

// ---------------------------------------------------------------- XMP

/** The key report.ts rates an XMP property by. */
const xmpKey = (p: XmpProp) =>
	p.ns === NS.mwgRs ? 'FaceRegions' : p.ns === NS.crs ? `crs:${p.name}` : p.name;

function xmpPicked(p: XmpProp, pick: Pick): boolean {
	return ask(pick, classifyXmp(p), xmpKey(p), p.value);
}

/** The packet minus the picked properties; null when no property is left. */
function editXmp(text: string, pick: Pick, keepNames: Set<string> = new Set()): string | null {
	let props: XmpProp[];
	try {
		props = parseXmp(text);
	} catch {
		return text;
	}
	const gone = props.filter((p) => !keepNames.has(p.name) && xmpPicked(p, pick));
	if (!gone.length) return text;
	if (gone.length === props.length) return null;
	return removeXmpProps(text, gone);
}

// ---------------------------------------------------------------- IPTC

function editIptc(b: Uint8Array, pick: Pick): Uint8Array | null {
	const out: Uint8Array[] = [];
	let kept = 0;
	let i = 0;
	let utf = false;
	while (i + 5 <= b.length) {
		if (b[i] !== 0x1c) {
			i++;
			continue;
		}
		const rec = b[i + 1];
		const ds = b[i + 2];
		let len = (b[i + 3] << 8) | b[i + 4];
		let at = i + 5;
		if (len & 0x8000) {
			const n = len & 0x7fff;
			len = 0;
			for (let j = 0; j < n; j++) len = len * 256 + b[at + j];
			at += n;
		}
		const data = b.subarray(at, at + len);
		if (rec === 1 && ds === 90 && data[0] === 0x1b) utf = true;
		let remove = false;
		if (rec === 2 && ds === 0) {
			remove = ask(pick, 'tech', 'RecordVersion', '');
			if (!remove) kept++;
		} else if (rec === 2) {
			const name = IPTC_NAMES[ds] ?? `Dataset ${ds}`;
			const value = new TextDecoder(utf ? 'utf-8' : 'latin1').decode(data);
			remove = ask(pick, IPTC_SECTIONS[name] ?? 'other', name, value);
			if (!remove) kept++;
		}
		if (!remove) out.push(b.subarray(i, at + len));
		i = at + len;
	}
	return kept ? concat(out) : null;
}

/** Photoshop resources in APP13: IPTC edited, thumbnails and the rest by section. */
function editPhotoshop(p: Uint8Array, pick: Pick): Uint8Array | null {
	const out: Uint8Array[] = [];
	let i = 0;
	let iptcChanged = false;
	const blocks: { id: number; head: Uint8Array; data: Uint8Array }[] = [];
	while (i + 12 <= p.length && startsWith(p, i, '8BIM')) {
		const id = u16be(p, i + 4);
		const nameLen = p[i + 6];
		let j = i + 7 + nameLen;
		if ((nameLen + 1) % 2) j++;
		const size = u32be(p, j);
		blocks.push({ id, head: p.subarray(i, j), data: p.subarray(j + 4, j + 4 + size) });
		i = j + 4 + size + (size % 2);
	}
	for (const blk of blocks) {
		let data: Uint8Array | null = blk.data;
		if (blk.id === 0x0404) {
			data = editIptc(blk.data, pick);
			if (data !== blk.data) iptcChanged = true;
		} else if (blk.id === 0x040c || blk.id === 0x0409) {
			if (pick('thumbnail', 'Thumbnail', '', false)) data = null;
		} else if (blk.id !== 0x0425 && pick('other', 'Unknown', '', false)) data = null;
		if (!data) continue;
		const size = new Uint8Array(4);
		new DataView(size.buffer).setUint32(0, data.length);
		out.push(blk.head, size, data, data.length % 2 ? new Uint8Array(1) : new Uint8Array(0));
	}
	// The IPTC digest (0x0425) must match the IPTC; drop it when the IPTC changed.
	const result = out.length ? concat(out) : null;
	if (!iptcChanged || !result) return result;
	return editPhotoshopDropDigest(result);
}

function editPhotoshopDropDigest(p: Uint8Array): Uint8Array | null {
	const out: Uint8Array[] = [];
	let i = 0;
	while (i + 12 <= p.length && startsWith(p, i, '8BIM')) {
		const nameLen = p[i + 6];
		let j = i + 7 + nameLen;
		if ((nameLen + 1) % 2) j++;
		const size = u32be(p, j);
		const end = j + 4 + size + (size % 2);
		if (u16be(p, i + 4) !== 0x0425) out.push(p.subarray(i, end));
		i = end;
	}
	return out.length ? concat(out) : null;
}

// ---------------------------------------------------------------- JPEG

const XMP_SIG = 'http://ns.adobe.com/xap/1.0/\0';
const XMP_EXT_SIG = 'http://ns.adobe.com/xmp/extension/\0';

function segment(marker: number, payload: Uint8Array): Uint8Array {
	if (payload.length + 2 > 0xffff) throw new Error('segment-too-large');
	const out = new Uint8Array(4 + payload.length);
	out[0] = 0xff;
	out[1] = marker;
	out[2] = (payload.length + 2) >> 8;
	out[3] = (payload.length + 2) & 255;
	out.set(payload, 4);
	return out;
}

type JpegResult = { header: Uint8Array; scanAt: number; mpfAt: number; mpfOld: number };

/**
 * One JPEG's header segments, cleaned. `scanAt` is where its SOS starts in
 * the input; everything from there on is picture data. `mpfAt` is the MPF
 * segment's offset inside the new header, or -1.
 */
function cleanJpegHeader(b: Uint8Array, start: number, pick: Pick): JpegResult {
	const parts: Uint8Array[] = [b.subarray(start, start + 2)];
	let size = 2;
	let mpfAt = -1;
	let mpfOld = -1;
	const push = (u: Uint8Array) => {
		parts.push(u);
		size += u.length;
	};

	// Extended XMP goes as a whole or not at all: its GUID is the MD5 of the
	// full text, so it cannot be edited without recomputing that.
	const ext = new Map<string, { total: number; parts: { off: number; data: Uint8Array }[] }>();
	let i = start + 2;
	while (i + 4 <= b.length && b[i] === 0xff) {
		const m = b[i + 1];
		if (m === 0xda || m === 0xd9) break;
		const len = u16be(b, i + 2);
		const seg = b.subarray(i + 4, i + 2 + len);
		if (m === 0xe1 && startsWith(seg, 0, XMP_EXT_SIG)) {
			const h = XMP_EXT_SIG.length;
			const guid = ascii(seg, h, 32);
			const e = ext.get(guid) ?? { total: u32be(seg, h + 32), parts: [] };
			e.parts.push({ off: u32be(seg, h + 36), data: seg.subarray(h + 40) });
			ext.set(guid, e);
		}
		i += 2 + len;
	}
	const dropExt = new Set<string>();
	for (const [guid, e] of ext) {
		const whole = new Uint8Array(e.total);
		for (const p of e.parts) if (p.off + p.data.length <= e.total) whole.set(p.data, p.off);
		if (editXmp(utf8.decode(whole), pick) === null) dropExt.add(guid);
	}
	const keepInMain = new Set(ext.size && dropExt.size < ext.size ? ['HasExtendedXMP'] : []);

	i = start + 2;
	while (i + 4 <= b.length) {
		if (b[i] !== 0xff) throw new Error('unreadable');
		const m = b[i + 1];
		if (m === 0xff) {
			i++;
			continue;
		}
		if (m === 0xda) break;
		if (m === 0xd9) break;
		const len = u16be(b, i + 2);
		const whole = b.subarray(i, i + 2 + len);
		const seg = b.subarray(i + 4, i + 2 + len);
		i += 2 + len;

		if (m === 0xe0 && startsWith(seg, 0, 'JFIF\0')) {
			if (seg[12] && seg[13] && pick('thumbnail', 'Thumbnail', '', false)) {
				const p = seg.slice(0, 14);
				p[12] = p[13] = 0;
				push(segment(m, p));
			} else push(whole);
		} else if (m === 0xe0 && startsWith(seg, 0, 'JFXX\0')) {
			if (!pick('thumbnail', 'Thumbnail', '', false)) push(whole);
		} else if (m === 0xe1 && startsWith(seg, 0, 'Exif\0')) {
			const tiff = seg.subarray(6);
			const out = editTiff(tiff, pick, false);
			if (out === tiff) push(whole);
			else if (out) push(segment(m, concat([seg.subarray(0, 6), out])));
		} else if (m === 0xe1 && startsWith(seg, 0, XMP_SIG)) {
			const text = utf8.decode(seg.subarray(XMP_SIG.length));
			const out = editXmp(text, pick, keepInMain);
			if (out === text) push(whole);
			else if (out !== null)
				push(segment(m, concat([seg.subarray(0, XMP_SIG.length), strToU8(out)])));
		} else if (m === 0xe1 && startsWith(seg, 0, XMP_EXT_SIG)) {
			if (!dropExt.has(ascii(seg, XMP_EXT_SIG.length, 32))) push(whole);
		} else if (m === 0xe2 && startsWith(seg, 0, 'MPF\0')) {
			mpfAt = size;
			mpfOld = i - 2 - len;
			push(whole);
		} else if (m === 0xeb && (indexOfAscii(seg, 'c2pa') >= 0 || indexOfAscii(seg, 'jumb') >= 0)) {
			const key = namesPerson(seg) ? 'C2PA-person' : 'C2PA';
			if (!pick('ai', key, '', false)) push(whole);
		} else if (m === 0xed && startsWith(seg, 0, 'Photoshop 3.0\0')) {
			const out = editPhotoshop(seg.subarray(14), pick);
			if (out) push(segment(m, concat([seg.subarray(0, 14), out])));
		} else if (m === 0xfe) {
			const text = latin1.decode(seg);
			const ai = looksLikePrompt(text);
			if (!pick(ai ? 'ai' : 'other', ai ? 'AIText' : 'Comment', text, false)) push(whole);
		} else if (
			m >= 0xe0 &&
			m <= 0xef &&
			!(
				m === 0xe2 &&
				(startsWith(seg, 0, 'ICC_PROFILE\0') || startsWith(seg, 0, 'urn:iso:std:iso:ts:21496'))
			) &&
			!(m === 0xee && startsWith(seg, 0, 'Adobe'))
		) {
			if (!pick('other', 'Unknown', '', false)) push(whole);
		} else push(whole);
	}
	return { header: concat(parts), scanAt: i, mpfAt, mpfOld };
}

function cleanJpeg(b: Uint8Array, pick: Pick): Uint8Array {
	const main = cleanJpegHeader(b, 0, pick);
	const delta = main.header.length - main.scanAt;
	if (main.mpfAt < 0) return concat([main.header, b.subarray(main.scanAt)]);

	// MPF: extra images after the main one, located by offsets from the MP
	// header. Clean each one's header too, then rewrite the index.
	const mpOld = main.mpfOld + 8;
	const mp = b.subarray(mpOld);
	const le = mp[0] === 0x49;
	const r16 = (o: number) => (le ? mp[o] | (mp[o + 1] << 8) : (mp[o] << 8) | mp[o + 1]);
	const r32 = (o: number) => (le ? u32le(mp, o) : u32be(mp, o));
	const ifd = r32(4);
	let entriesAt = -1;
	let count = 0;
	for (let k = 0; k < r16(ifd); k++) {
		const e = ifd + 2 + k * 12;
		if (r16(e) === 0xb002) {
			count = r32(e + 4) / 16;
			entriesAt = r32(e + 8);
		}
	}
	if (entriesAt < 0) return concat([main.header, b.subarray(main.scanAt)]);

	// Ultra HDR's GContainer lists each extra image's length in the main XMP;
	// cleaning an extra image would make that wrong, so leave them as they are.
	const mainXmp = latin1.decode(main.header);
	const touchExtras = !/GContainer|Container:Directory/.test(mainXmp);

	const extras: { k: number; at: number; size: number; out: Uint8Array }[] = [];
	for (let k = 1; k < count; k++) {
		const e = entriesAt + k * 16;
		const size = r32(e + 4);
		const at = mpOld + r32(e + 8);
		if (!size || at + size > b.length || b[at] !== 0xff || b[at + 1] !== 0xd8) continue;
		const img = b.subarray(at, at + size);
		let out = img;
		if (touchExtras) {
			try {
				const h = cleanJpegHeader(b, at, pick);
				out = concat([h.header, b.subarray(h.scanAt, at + size)]);
			} catch {
				out = img;
			}
		}
		extras.push({ k, at, size, out });
	}
	extras.sort((a, z) => a.at - z.at);

	const parts: Uint8Array[] = [main.header];
	let cursor = main.scanAt;
	let pos = main.header.length;
	const newAt = new Map<number, { at: number; size: number }>();
	for (const x of extras) {
		if (x.at < cursor) continue;
		parts.push(b.subarray(cursor, x.at));
		pos += x.at - cursor;
		newAt.set(x.k, { at: pos, size: x.out.length });
		parts.push(x.out);
		pos += x.out.length;
		cursor = x.at + x.size;
	}
	parts.push(b.subarray(cursor));
	const out = concat(parts);

	// Rewrite the MP entries in the copied MPF segment.
	const mpNew = main.mpfAt + 8;
	const w32 = (o: number, v: number) => {
		const bytes = [v >>> 24, (v >>> 16) & 255, (v >>> 8) & 255, v & 255];
		out.set(le ? bytes.reverse() : bytes, mpNew + o);
	};
	w32(entriesAt + 4, r32(entriesAt + 4) + delta);
	for (const [k, v] of newAt) {
		w32(entriesAt + k * 16 + 4, v.size);
		w32(entriesAt + k * 16 + 8, v.at - mpNew);
	}
	return out;
}

// ---------------------------------------------------------------- PNG

const CRC_TABLE = (() => {
	const t = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		t[n] = c >>> 0;
	}
	return t;
})();

function crc32(b: Uint8Array): number {
	let c = 0xffffffff;
	for (let i = 0; i < b.length; i++) c = CRC_TABLE[(c ^ b[i]) & 255] ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
	const out = new Uint8Array(12 + data.length);
	const dv = new DataView(out.buffer);
	dv.setUint32(0, data.length);
	out.set(strToU8(type), 4);
	out.set(data, 8);
	dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
	return out;
}

/** ImageMagick's "Raw profile type" text, as rawProfile() reads it. */
function rawProfileText(kind: string, bytes: Uint8Array): string {
	const hex = Array.from(bytes, (x) => x.toString(16).padStart(2, '0')).join('');
	const lines = hex.match(/.{1,72}/g) ?? [];
	return `\n${kind}\n${String(bytes.length).padStart(8)}\n${lines.join('\n')}\n`;
}

function cleanPng(b: Uint8Array, pick: Pick): Uint8Array {
	const parts: Uint8Array[] = [b.subarray(0, 8)];
	let i = 8;
	while (i + 12 <= b.length) {
		const len = u32be(b, i);
		const type = ascii(b, i + 4, 4);
		const whole = b.subarray(i, i + 12 + len);
		const d = b.subarray(i + 8, i + 8 + len);
		i += 12 + len;

		if (type === 'eXIf') {
			const out = editTiff(d, pick, false);
			if (out === d) parts.push(whole);
			else if (out) parts.push(pngChunk('eXIf', out));
		} else if (type === 'tEXt' || type === 'zTXt' || type === 'iTXt') {
			const out = cleanPngText(type, d, pick);
			if (out === d) parts.push(whole);
			else if (out) parts.push(out);
		} else if (type === 'tIME') {
			if (!pick('datetime', 'FileDate', '', false)) parts.push(whole);
		} else if (type === 'caBX') {
			if (!pick('ai', namesPerson(d) ? 'C2PA-person' : 'C2PA', '', false)) parts.push(whole);
		} else if (
			PNG_PICTURE.has(type) ||
			PNG_COLOR.has(type) ||
			/^(iCCP|pHYs|orNT)$/.test(type) ||
			// A critical chunk (upper-case first letter) is never optional.
			(type.charCodeAt(0) & 0x20) === 0
		) {
			parts.push(whole);
		} else if (!pick('other', 'Unknown', '', false)) parts.push(whole);
		if (type === 'IEND') break;
	}
	return concat(parts);
}

/** A cleaned text chunk, the input itself when untouched, or null to drop it. */
function cleanPngText(type: string, d: Uint8Array, pick: Pick): Uint8Array | null {
	const nul = d.indexOf(0);
	if (nul < 0) return d;
	const key = ascii(d, 0, nul);
	let text: string | null = null;
	if (type === 'tEXt') text = latin1.decode(d.subarray(nul + 1));
	else if (type === 'zTXt') {
		const raw = inflate(d.subarray(nul + 2));
		text = raw ? latin1.decode(raw) : null;
	} else {
		const compressed = d[nul + 1] === 1;
		let j = d.indexOf(0, nul + 3);
		if (j >= 0) j = d.indexOf(0, j + 1);
		if (j >= 0) {
			const body = d.subarray(j + 1);
			const raw = compressed ? inflate(body) : body;
			text = raw ? utf8.decode(raw) : null;
		}
	}
	if (text === null) return pick('other', 'Unknown', '', false) ? null : d;

	const iTXt = (k: string, value: string) =>
		pngChunk('iTXt', concat([strToU8(k), new Uint8Array([0, 0, 0, 0, 0]), strToU8(value)]));

	if (key === 'XML:com.adobe.xmp') {
		const out = editXmp(text, pick);
		return out === text ? d : out === null ? null : iTXt(key, out);
	}
	const profile = /^Raw profile type (exif|app1|iptc)$/i.exec(key);
	if (profile) {
		const bytes = rawProfile(text);
		if (!bytes) return d;
		const kind = profile[1].toLowerCase();
		let out: Uint8Array | null;
		if (kind === 'iptc') {
			const ps = startsWith(bytes, 0, 'Photoshop 3.0\0') ? 14 : 0;
			out = startsWith(bytes, ps, '8BIM')
				? editPhotoshop(bytes.subarray(ps), pick)
				: editIptc(bytes, pick);
			if (out && ps) out = concat([bytes.subarray(0, ps), out]);
		} else {
			const at = startsWith(bytes, 0, 'Exif\0') ? 6 : 0;
			const tiff = bytes.subarray(at);
			const t = editTiff(tiff, pick, false);
			out = t === tiff ? bytes : t ? concat([bytes.subarray(0, at), t]) : null;
		}
		if (out === bytes) return d;
		return out
			? pngChunk(
					'zTXt',
					concat([strToU8(key), new Uint8Array([0, 0]), deflateText(rawProfileText(kind, out))])
				)
			: null;
	}
	const ai = AI_TEXT_KEYS.test(key) || looksLikePrompt(text);
	const exifKey = /^exif:(.+)$/.exec(key)?.[1];
	if (exifKey && ESSENTIAL_KEYS.has(exifKey)) return d;
	const target: Target = ai ? 'ai' : pngTextTarget(key);
	const k = ai ? 'AIText' : (exifKey ?? (/^date:/.test(key) ? 'FileDate' : 'Text'));
	const technical = !!exifKey && (target === 'tech' || TECH_KEYS.has(exifKey));
	const remove =
		target === 'essential'
			? pick('other', k, text, true)
			: technical
				? pick('other', k, text, true)
				: ask(pick, target, k, text);
	return remove ? null : d;
}

// zTXt wants zlib data: the inverse of the reader's unzlibSync.
const deflateText = (s: string) => zlibSync(strToU8(s, true));

// ---------------------------------------------------------------- WebP

function cleanWebp(b: Uint8Array, pick: Pick): Uint8Array {
	const parts: Uint8Array[] = [];
	let vp8x: Uint8Array | null = null;
	let hasExif = false;
	let hasXmp = false;
	let i = 12;
	while (i + 8 <= b.length) {
		const type = ascii(b, i, 4);
		const len = u32le(b, i + 4);
		const padded = len + (len % 2);
		const whole = b.subarray(i, i + 8 + padded);
		const d = b.subarray(i + 8, i + 8 + len);
		i += 8 + padded;
		const chunk = (data: Uint8Array) => {
			const out = new Uint8Array(8 + data.length + (data.length % 2));
			out.set(strToU8(type), 0);
			new DataView(out.buffer).setUint32(4, data.length, true);
			out.set(data, 8);
			return out;
		};
		if (type === 'VP8X') {
			vp8x = whole.slice();
			parts.push(vp8x);
		} else if (type === 'EXIF') {
			const at = startsWith(d, 0, 'Exif\0') ? 6 : 0;
			const tiff = d.subarray(at);
			const out = editTiff(tiff, pick, false);
			if (out === tiff) parts.push(whole);
			else if (out) parts.push(chunk(concat([d.subarray(0, at), out])));
			hasExif ||= out !== null;
		} else if (type === 'XMP ') {
			const text = utf8.decode(d);
			const out = editXmp(text, pick);
			if (out === text) parts.push(whole);
			else if (out !== null) parts.push(chunk(strToU8(out)));
			hasXmp ||= out !== null;
		} else if (type === 'C2PA') {
			if (!pick('ai', namesPerson(d) ? 'C2PA-person' : 'C2PA', '', false)) parts.push(whole);
		} else if (/^(VP8 |VP8L|ALPH|ANIM|ANMF|ICCP)$/.test(type)) {
			parts.push(whole);
		} else if (!pick('other', 'Unknown', '', false)) parts.push(whole);
	}
	if (vp8x) {
		vp8x[8] = (vp8x[8] & ~0x0c) | (hasExif ? 0x08 : 0) | (hasXmp ? 0x04 : 0);
	}
	const body = concat(parts);
	const out = new Uint8Array(12 + body.length);
	out.set(b.subarray(0, 12), 0);
	new DataView(out.buffer).setUint32(4, 4 + body.length, true);
	out.set(body, 12);
	return out;
}

// ---------------------------------------------------------------- HEIF / AVIF

/** Byte ranges of a HEIF item, resolved to absolute file offsets. */
function heifItems(b: Uint8Array) {
	const top = readBoxes(b, 0, b.length);
	const metaBox = top.find((x) => x.type === 'meta');
	const items: {
		id: number;
		type: string;
		contentType?: string;
		ranges: [number, number][];
		/** Where its infe box's flags byte sits (bit 0: hidden item). */
		flagsAt: number;
	}[] = [];
	const uuids = top.filter((x) => x.type === 'uuid');
	/** 'thmb' references: the box, and the thumbnail item it names. */
	const thumbRefs: { start: number; from: number }[] = [];
	if (!metaBox) return { items, uuids, thumbRefs };
	const kids = readBoxes(b, metaBox.body + 4, metaBox.end);
	const locs = new Map<number, Loc>();
	let idat = -1;
	for (const k of kids) {
		if (k.type === 'iloc') readIloc(b, k, locs);
		if (k.type === 'idat') idat = k.body;
	}
	const iinf = kids.find((k) => k.type === 'iinf');
	const iref = kids.find((k) => k.type === 'iref');
	if (iref) {
		const w = b[iref.body] === 0 ? 2 : 4;
		for (const ref of readBoxes(b, iref.body + 4, iref.end)) {
			if (ref.type === 'thmb')
				thumbRefs.push({
					start: ref.start,
					from: w === 2 ? u16be(b, ref.body) : u32be(b, ref.body)
				});
		}
	}
	if (!iinf) return { items, uuids, thumbRefs };
	const at = iinf.body + 4 + (b[iinf.body] === 0 ? 2 : 4);
	for (const infe of readBoxes(b, at, iinf.end)) {
		const iv = b[infe.body];
		if (infe.type !== 'infe' || iv < 2) continue;
		let p = infe.body + 4;
		const id = iv === 2 ? u16be(b, p) : u32be(b, p);
		p += (iv === 2 ? 2 : 4) + 2;
		const type = ascii(b, p, 4);
		p += 4;
		const nameEnd = b.indexOf(0, p);
		let contentType: string | undefined;
		if (type === 'mime' && nameEnd >= 0 && nameEnd < infe.end) {
			const ctEnd = b.indexOf(0, nameEnd + 1);
			if (ctEnd >= 0 && ctEnd <= infe.end) contentType = ascii(b, nameEnd + 1, ctEnd - nameEnd - 1);
		}
		const loc = locs.get(id);
		const ranges: [number, number][] = (loc?.extents ?? []).map((e) => {
			const s = loc!.method === 1 && idat >= 0 ? idat + e.offset : e.offset;
			return [s, s + e.length];
		});
		items.push({ id, type, contentType, ranges, flagsAt: infe.body + 3 });
	}
	return { items, uuids, thumbRefs };
}

function readRanges(b: Uint8Array, ranges: [number, number][]): Uint8Array {
	return concat(ranges.map(([s, e]) => b.subarray(s, e)));
}

function writeRanges(out: Uint8Array, ranges: [number, number][], data: Uint8Array): void {
	let o = 0;
	for (const [s, e] of ranges) {
		out.set(data.subarray(o, o + (e - s)), s);
		o += e - s;
	}
}

const EMPTY_XMP = '<x:xmpmeta xmlns:x="adobe:ns:meta/"/>';

function cleanHeif(b: Uint8Array, pick: Pick): Uint8Array {
	const out = b.slice();
	const { items, uuids, thumbRefs } = heifItems(b);
	for (const item of items) {
		if (!item.ranges.length || item.ranges.some(([, e]) => e > b.length)) continue;
		if (item.type === 'Exif') {
			const d = readRanges(b, item.ranges);
			if (d.length < 4) continue;
			const skip = 4 + u32be(d, 0);
			if (skip >= d.length) continue;
			const tiff = d.subarray(skip);
			const edited = editTiff(tiff, pick, true);
			if (edited && edited !== tiff) {
				const next = d.slice();
				next.set(edited, skip);
				writeRanges(out, item.ranges, next);
			}
		} else if (item.type === 'mime' && /rdf\+xml/.test(item.contentType ?? '')) {
			const d = readRanges(b, item.ranges);
			const text = utf8.decode(d);
			const edited = editXmp(text, pick);
			if (edited === text) continue;
			// Same length: pad with spaces, which XML allows after the root.
			const bytes = strToU8(edited ?? EMPTY_XMP);
			if (bytes.length > d.length) continue;
			const next = new Uint8Array(d.length).fill(0x20);
			next.set(bytes, 0);
			writeRanges(out, item.ranges, next);
		} else if (item.type === 'mime' && /c2pa/.test(item.contentType ?? '')) {
			const d = readRanges(b, item.ranges);
			if (pick('ai', namesPerson(d) ? 'C2PA-person' : 'C2PA', '', false)) {
				writeRanges(out, item.ranges, new Uint8Array(d.length));
			}
		}
	}
	// A thumbnail is a whole picture item, which cannot be cut out without
	// moving everything after it. Instead its data is zeroed, it is marked
	// hidden, and its 'thmb' reference is renamed so no reader looks for it.
	if (thumbRefs.length && pick('thumbnail', 'Thumbnail', '', false)) {
		for (const ref of thumbRefs) {
			const item = items.find((x) => x.id === ref.from);
			if (!item || item.ranges.some(([, e]) => e > b.length)) continue;
			for (const [s, e] of item.ranges) out.fill(0, s, e);
			out[item.flagsAt] |= 1;
			out.set(strToU8('free'), ref.start + 4);
		}
	}

	for (const box of uuids) {
		const id = Array.from(b.subarray(box.body, box.body + 16), (x) =>
			x.toString(16).padStart(2, '0')
		).join('');
		const body = b.subarray(box.body, box.end);
		const isC2pa = id === C2PA_UUID;
		const remove = isC2pa
			? pick('ai', namesPerson(body) ? 'C2PA-person' : 'C2PA', '', false)
			: pick('other', 'Unknown', '', false);
		if (remove) {
			// A 'free' box of the same size: nothing after it moves.
			out.set(strToU8('free'), box.start + 4);
			out.fill(0, box.body, box.end);
		}
	}
	return out;
}

// ---------------------------------------------------------------- entry point

export function removeMetadata(bytes: Uint8Array, pick: Pick): Uint8Array {
	const format = detectFormat(bytes);
	if (format === 'jpeg') return cleanJpeg(bytes, pick);
	if (format === 'png') return cleanPng(bytes, pick);
	if (format === 'webp') return cleanWebp(bytes, pick);
	if (format === 'heif' || format === 'avif') return cleanHeif(bytes, pick);
	throw new Error('unsupported-format');
}
