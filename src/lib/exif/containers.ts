// Walks an image file's container (JPEG segments, PNG chunks, WebP chunks,
// HEIF/AVIF boxes) and lifts out every metadata block it holds, without
// decoding a single pixel. Everything runs in the browser on the file's own
// bytes: nothing here makes a request.
//
// The output is raw material (EXIF as TIFF bytes, XMP as text, IPTC, ICC...).
// report.ts turns it into the viewer's sections. Removal will reuse these
// walkers, which is why they record where each block came from.
import { unzlibSync } from 'fflate';

export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'heif' | 'avif';

/** Where a block was found: the main picture, or an extra image inside the file. */
export type Where = string;

export type RawMeta = {
	format: ImageFormat;
	width?: number;
	height?: number;
	tiff: { bytes: Uint8Array; where: Where }[];
	xmp: { text: string; where: Where }[];
	iptc: { bytes: Uint8Array; where: Where }[];
	icc?: Uint8Array;
	/** Color descriptions that are not an ICC profile: PNG sRGB/gAMA/cHRM, and
	 *  `cicp:<primaries>/<transfer>` for PNG cICP and HEIF nclx. */
	colorTags: string[];
	/** `namesPerson`: the manifest carries an identity or author assertion. */
	c2pa: { bytes: number; aiSource: boolean; namesPerson: boolean; where: Where }[];
	/** PNG text chunks and JPEG comments. */
	texts: { key: string; text: string; where: Where }[];
	density?: { x: number; y: number; unit: 'in' | 'cm' | '' };
	thumbs: { label: string; bytes: number; jpeg?: Uint8Array; where: Where }[];
	/** Rotation stored by the container itself (HEIF irot/imir). */
	containerOrientation?: string;
	gainMap: boolean;
	/** Picture data stored beside the main image (depth map, alpha...). */
	pictureData: string[];
	unknown: { name: string; bytes: number; where: Where }[];
	dates: { label: string; value: string; where: Where }[];
};

const MAIN = '';
const latin1 = new TextDecoder('latin1');
const utf8 = new TextDecoder('utf-8');

export function ascii(b: Uint8Array, start: number, len: number): string {
	return latin1.decode(b.subarray(start, start + len));
}

export function startsWith(b: Uint8Array, at: number, sig: string): boolean {
	if (at + sig.length > b.length) return false;
	for (let i = 0; i < sig.length; i++) if (b[at + i] !== sig.charCodeAt(i)) return false;
	return true;
}

export function indexOfAscii(b: Uint8Array, needle: string, from = 0): number {
	const first = needle.charCodeAt(0);
	outer: for (let i = from; i <= b.length - needle.length; i++) {
		if (b[i] !== first) continue;
		for (let j = 1; j < needle.length; j++) if (b[i + j] !== needle.charCodeAt(j)) continue outer;
		return i;
	}
	return -1;
}

export const u16be = (b: Uint8Array, i: number) => (b[i] << 8) | b[i + 1];
export const u32be = (b: Uint8Array, i: number) =>
	((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
export const u16le = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8);
const u24le = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16);
export const u32le = (b: Uint8Array, i: number) =>
	(b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0;

/** A Content Credentials manifest that declares the picture AI-made or AI-edited. */
export function declaresAi(b: Uint8Array): boolean {
	return indexOfAscii(b, 'trainedAlgorithmicMedia') >= 0;
}

/** A manifest with a CAWG identity assertion or a schema.org author names someone. */
export function namesPerson(b: Uint8Array): boolean {
	return (
		indexOfAscii(b, 'cawg.identity') >= 0 || indexOfAscii(b, 'stds.schema-org.CreativeWork') >= 0
	);
}

export function detectFormat(b: Uint8Array): ImageFormat | null {
	if (b[0] === 0xff && b[1] === 0xd8) return 'jpeg';
	if (startsWith(b, 0, '\x89PNG\r\n\x1a\n')) return 'png';
	if (startsWith(b, 0, 'RIFF') && startsWith(b, 8, 'WEBP')) return 'webp';
	if (startsWith(b, 4, 'ftyp')) {
		const size = u32be(b, 0);
		const brands: string[] = [];
		for (let i = 8; i + 4 <= Math.min(size, b.length); i += 4)
			if (i !== 12) brands.push(ascii(b, i, 4));
		if (brands.some((x) => x === 'avif' || x === 'avis')) return 'avif';
		if (brands.some((x) => /^(heic|heix|heim|heis|hevc|hevx|mif1|msf1|mif2)$/.test(x)))
			return 'heif';
	}
	return null;
}

function emptyMeta(format: ImageFormat): RawMeta {
	return {
		format,
		tiff: [],
		xmp: [],
		iptc: [],
		colorTags: [],
		c2pa: [],
		texts: [],
		thumbs: [],
		gainMap: false,
		pictureData: [],
		unknown: [],
		dates: []
	};
}

export function readContainer(b: Uint8Array): RawMeta {
	const format = detectFormat(b);
	if (!format) throw new Error('unsupported-format');
	const meta = emptyMeta(format);
	if (format === 'jpeg') walkJpeg(b, 0, meta, MAIN);
	else if (format === 'png') walkPng(b, meta);
	else if (format === 'webp') walkWebp(b, meta);
	else walkHeif(b, meta);
	return meta;
}

// ---------------------------------------------------------------- JPEG

const XMP_SIG = 'http://ns.adobe.com/xap/1.0/\0';
const XMP_EXT_SIG = 'http://ns.adobe.com/xmp/extension/\0';

/**
 * One JPEG's segments up to its scan data. `start` is where its SOI sits,
 * which is not 0 for the extra images an MPF index points at.
 */
function walkJpeg(b: Uint8Array, start: number, meta: RawMeta, where: Where): void {
	if (b[start] !== 0xff || b[start + 1] !== 0xd8) throw new Error('unreadable');
	const iccChunks: { seq: number; data: Uint8Array }[] = [];
	const extXmp = new Map<string, { total: number; parts: { off: number; data: Uint8Array }[] }>();
	let c2paBytes = 0;
	let c2paAi = false;
	let c2paPerson = false;
	let mpf: { base: number; seg: Uint8Array } | null = null;
	let reachedScan = false;

	let i = start + 2;
	while (i + 4 <= b.length) {
		if (b[i] !== 0xff) break;
		const m = b[i + 1];
		if (m === 0xff) {
			i++;
			continue;
		}
		if (m === 0xd9) break;
		if ((m >= 0xd0 && m <= 0xd7) || m === 0x01) {
			i += 2;
			continue;
		}
		const len = u16be(b, i + 2);
		if (len < 2 || i + 2 + len > b.length) break;
		const seg = b.subarray(i + 4, i + 2 + len);
		if (m === 0xda) {
			reachedScan = true;
			break;
		}

		if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
			if (where === MAIN && meta.width === undefined) {
				meta.height = u16be(seg, 1);
				meta.width = u16be(seg, 3);
			}
		} else if (m === 0xe0 && startsWith(seg, 0, 'JFIF\0')) {
			const unit = seg[7];
			if (where === MAIN) {
				meta.density = {
					x: u16be(seg, 8),
					y: u16be(seg, 10),
					unit: unit === 1 ? 'in' : unit === 2 ? 'cm' : ''
				};
			}
			if (seg[12] && seg[13]) {
				meta.thumbs.push({
					label: `JFIF thumbnail, ${seg[12]} x ${seg[13]}`,
					bytes: seg.length - 14,
					where
				});
			}
		} else if (m === 0xe0 && startsWith(seg, 0, 'JFXX\0')) {
			meta.thumbs.push({ label: 'JFIF extension thumbnail', bytes: seg.length, where });
		} else if (m === 0xe1 && startsWith(seg, 0, 'Exif\0')) {
			meta.tiff.push({ bytes: seg.subarray(6), where });
		} else if (m === 0xe1 && startsWith(seg, 0, XMP_SIG)) {
			meta.xmp.push({ text: utf8.decode(seg.subarray(XMP_SIG.length)), where });
		} else if (m === 0xe1 && startsWith(seg, 0, XMP_EXT_SIG)) {
			const h = XMP_EXT_SIG.length;
			const guid = ascii(seg, h, 32);
			const entry = extXmp.get(guid) ?? { total: u32be(seg, h + 32), parts: [] };
			entry.parts.push({ off: u32be(seg, h + 36), data: seg.subarray(h + 40) });
			extXmp.set(guid, entry);
		} else if (m === 0xe2 && startsWith(seg, 0, 'ICC_PROFILE\0')) {
			iccChunks.push({ seq: seg[12], data: seg.subarray(14) });
		} else if (m === 0xe2 && startsWith(seg, 0, 'urn:iso:std:iso:ts:21496')) {
			// ISO 21496-1 gain map metadata (Ultra HDR v1.1 and later).
			meta.gainMap = true;
		} else if (m === 0xe2 && startsWith(seg, 0, 'MPF\0')) {
			// MPF offsets count from the byte after "MPF\0".
			mpf = { base: i + 8, seg: seg.subarray(4) };
		} else if (m === 0xeb && (indexOfAscii(seg, 'c2pa') >= 0 || indexOfAscii(seg, 'jumb') >= 0)) {
			c2paBytes += seg.length;
			if (declaresAi(seg)) c2paAi = true;
			if (namesPerson(seg)) c2paPerson = true;
		} else if (m === 0xed && startsWith(seg, 0, 'Photoshop 3.0\0')) {
			walkPhotoshop(seg.subarray(14), meta, where);
		} else if (m === 0xee && startsWith(seg, 0, 'Adobe')) {
			// Color transform flag a CMYK/YCCK decoder needs: picture data.
		} else if (m === 0xfe) {
			const text = latin1.decode(seg).replace(/\0+$/, '').trim();
			if (text) meta.texts.push({ key: 'Comment', text, where });
		} else if (m >= 0xe0 && m <= 0xef) {
			const tag = ascii(seg, 0, Math.min(12, seg.length)).replace(/[^\x20-\x7e].*$/s, '');
			meta.unknown.push({
				name: tag ? `APP${m - 0xe0} "${tag}"` : `APP${m - 0xe0} block`,
				bytes: seg.length,
				where
			});
		}
		i += 2 + len;
	}
	// A main image whose segments stop before the picture data (cut short, or
	// garbage between segments) may hold metadata past the break. Reporting it
	// as clean would be a false promise, so it is unreadable. An extra image
	// is left to the MPF walk's own checks.
	if (where === MAIN && !reachedScan) throw new Error('unreadable');

	if (iccChunks.length && where === MAIN) {
		iccChunks.sort((a, z) => a.seq - z.seq);
		const total = iccChunks.reduce((n, c) => n + c.data.length, 0);
		const icc = new Uint8Array(total);
		let o = 0;
		for (const c of iccChunks) {
			icc.set(c.data, o);
			o += c.data.length;
		}
		meta.icc = icc;
	}
	for (const { total, parts } of extXmp.values()) {
		const whole = new Uint8Array(total);
		for (const p of parts) if (p.off + p.data.length <= total) whole.set(p.data, p.off);
		meta.xmp.push({ text: utf8.decode(whole), where });
	}
	if (c2paBytes)
		meta.c2pa.push({ bytes: c2paBytes, aiSource: c2paAi, namesPerson: c2paPerson, where });
	if (mpf && where === MAIN) walkMpf(b, mpf.base, mpf.seg, meta);
}

/** The MPF index (CIPA DC-007): extra images appended after the main JPEG. */
function walkMpf(b: Uint8Array, base: number, mp: Uint8Array, meta: RawMeta): void {
	const le = mp[0] === 0x49;
	const r16 = (o: number) => (le ? u16le(mp, o) : u16be(mp, o));
	const r32 = (o: number) => (le ? u32le(mp, o) : u32be(mp, o));
	if (mp.length < 8) return;
	const ifd = r32(4);
	if (ifd + 2 > mp.length) return;
	const n = r16(ifd);
	let entriesAt = -1;
	let count = 0;
	for (let k = 0; k < n; k++) {
		const e = ifd + 2 + k * 12;
		if (e + 12 > mp.length) return;
		if (r16(e) === 0xb002) {
			count = r32(e + 4) / 16;
			entriesAt = r32(e + 8);
		}
	}
	if (entriesAt < 0) return;
	for (let k = 1; k < count; k++) {
		const e = entriesAt + k * 16;
		if (e + 16 > mp.length) break;
		const type = r32(e) & 0xffffff;
		const size = r32(e + 4);
		const at = base + r32(e + 8);
		if (!size || at + 4 > b.length || b[at] !== 0xff || b[at + 1] !== 0xd8) continue;
		const where = `extra image ${k + 1}`;
		const before = meta.xmp.length;
		const hadGainMap = meta.gainMap;
		meta.gainMap = false;
		try {
			walkJpeg(b, at, meta, where);
		} catch {
			meta.gainMap = hadGainMap;
			continue;
		}
		const xmp = meta.xmp
			.slice(before)
			.map((x) => x.text)
			.join('');
		const isGainMap = meta.gainMap || /hdrgainmap|hdrgm:|HDRGainMap/i.test(xmp);
		meta.gainMap = hadGainMap || isGainMap;
		if (isGainMap) continue;
		else if (/depth/i.test(xmp)) meta.pictureData.push('depth map');
		else if (/matte/i.test(xmp)) meta.pictureData.push('portrait matte');
		else if (type === 0x010001 || type === 0x010002) {
			meta.thumbs.push({ label: 'Large preview image', bytes: size, where });
		} else meta.pictureData.push('extra image');
	}
}

/** Photoshop image resources in APP13 (IPTC lives here as resource 0x0404). */
function walkPhotoshop(p: Uint8Array, meta: RawMeta, where: Where): void {
	let i = 0;
	let other = 0;
	while (i + 12 <= p.length && startsWith(p, i, '8BIM')) {
		const id = u16be(p, i + 4);
		const nameLen = p[i + 6];
		let j = i + 7 + nameLen;
		if ((nameLen + 1) % 2) j++;
		const size = u32be(p, j);
		const data = p.subarray(j + 4, j + 4 + size);
		if (id === 0x0404) meta.iptc.push({ bytes: data, where });
		else if (id === 0x040c || id === 0x0409) {
			const jpegAt = 28;
			meta.thumbs.push({
				label: 'Photoshop thumbnail',
				bytes: size,
				jpeg: id === 0x040c && data[jpegAt] === 0xff ? data.subarray(jpegAt) : undefined,
				where
			});
		} else if (id !== 0x0425) other += size;
		i = j + 4 + size + (size % 2);
	}
	if (other) meta.unknown.push({ name: 'Photoshop settings', bytes: other, where });
}

// ---------------------------------------------------------------- PNG

// iDOT is Apple's hint for decoding a screenshot in parallel: picture data.
export const PNG_PICTURE = new Set([
	'IHDR',
	'PLTE',
	'IDAT',
	'IEND',
	'tRNS',
	'bKGD',
	'sBIT',
	'acTL',
	'fcTL',
	'fdAT',
	'gdAT',
	'iDOT'
]);
export const PNG_COLOR = new Set(['sRGB', 'gAMA', 'cHRM', 'cICP', 'mDCV', 'cLLI']);

export function inflate(data: Uint8Array): Uint8Array | null {
	try {
		return unzlibSync(data);
	} catch {
		return null;
	}
}

/** ImageMagick's "Raw profile type ..." text: a hex dump after a length line. */
export function rawProfile(text: string): Uint8Array | null {
	const lines = text.trim().split('\n');
	if (lines.length < 3) return null;
	const hex = lines.slice(2).join('').replace(/\s+/g, '');
	if (!/^[0-9a-f]*$/i.test(hex) || hex.length % 2) return null;
	const out = new Uint8Array(hex.length / 2);
	for (let k = 0; k < out.length; k++) out[k] = parseInt(hex.substr(k * 2, 2), 16);
	return out;
}

function walkPng(b: Uint8Array, meta: RawMeta): void {
	let i = 8;
	while (i + 12 <= b.length) {
		const len = u32be(b, i);
		const type = ascii(b, i + 4, 4);
		// Cut short: what was past the cut cannot be checked (see walkJpeg).
		if (i + 12 + len > b.length) throw new Error('unreadable');
		const d = b.subarray(i + 8, i + 8 + len);
		if (type === 'IHDR') {
			meta.width = u32be(d, 0);
			meta.height = u32be(d, 4);
		} else if (type === 'iCCP') {
			const nul = d.indexOf(0);
			const icc = nul > 0 ? inflate(d.subarray(nul + 2)) : null;
			if (icc) meta.icc = icc;
			else meta.colorTags.push('ICC profile');
		} else if (type === 'cICP') {
			meta.colorTags.push(`cicp:${d[0]}/${d[1]}`);
		} else if (PNG_COLOR.has(type)) {
			meta.colorTags.push(type);
		} else if (type === 'pHYs') {
			const unit = d[8];
			const ppm = (v: number) => (unit === 1 ? Math.round(v * 0.0254) : v);
			meta.density = { x: ppm(u32be(d, 0)), y: ppm(u32be(d, 4)), unit: unit === 1 ? 'in' : '' };
		} else if (type === 'orNT') {
			// PNG third edition's orientation chunk, with EXIF's 1-8 values.
			const names = [
				'',
				'',
				'Mirrored',
				'Rotated 180°',
				'Flipped',
				'Mirrored and rotated 90° counterclockwise',
				'Rotated 90° clockwise',
				'Mirrored and rotated 90° clockwise',
				'Rotated 90° counterclockwise'
			];
			meta.containerOrientation = d[0] === 1 ? 'Normal' : names[d[0]] || undefined;
		} else if (type === 'eXIf') {
			meta.tiff.push({ bytes: d, where: MAIN });
		} else if (type === 'tEXt' || type === 'zTXt' || type === 'iTXt') {
			pngText(type, d, meta);
		} else if (type === 'tIME') {
			const pad = (v: number) => String(v).padStart(2, '0');
			meta.dates.push({
				label: 'Last modified (PNG)',
				value: `${u16be(d, 0)}:${pad(d[2])}:${pad(d[3])} ${pad(d[4])}:${pad(d[5])}:${pad(d[6])}`,
				where: MAIN
			});
		} else if (type === 'caBX') {
			meta.c2pa.push({
				bytes: len,
				aiSource: declaresAi(d),
				namesPerson: namesPerson(d),
				where: MAIN
			});
		} else if (!PNG_PICTURE.has(type)) {
			meta.unknown.push({ name: `PNG chunk ${type}`, bytes: len, where: MAIN });
		}
		if (type === 'IEND') break;
		i += 12 + len;
	}
}

function pngText(type: string, d: Uint8Array, meta: RawMeta): void {
	const nul = d.indexOf(0);
	if (nul < 0) return;
	const key = ascii(d, 0, nul);
	let text: string | null = null;
	if (type === 'tEXt') text = latin1.decode(d.subarray(nul + 1));
	else if (type === 'zTXt') {
		const raw = inflate(d.subarray(nul + 2));
		text = raw ? latin1.decode(raw) : null;
	} else {
		const compressed = d[nul + 1] === 1;
		let j = d.indexOf(0, nul + 3); // language tag
		if (j < 0) return;
		j = d.indexOf(0, j + 1); // translated keyword
		if (j < 0) return;
		const body = d.subarray(j + 1);
		const raw = compressed ? inflate(body) : body;
		text = raw ? utf8.decode(raw) : null;
	}
	if (text === null) return;
	if (key === 'XML:com.adobe.xmp') {
		meta.xmp.push({ text, where: MAIN });
		return;
	}
	const profile = /^Raw profile type (exif|app1|iptc)$/i.exec(key);
	if (profile) {
		const bytes = rawProfile(text);
		if (bytes) {
			const kind = profile[1].toLowerCase();
			if (kind === 'iptc') {
				if (startsWith(bytes, 0, 'Photoshop 3.0\0')) walkPhotoshop(bytes.subarray(14), meta, MAIN);
				else if (startsWith(bytes, 0, '8BIM')) walkPhotoshop(bytes, meta, MAIN);
				else meta.iptc.push({ bytes, where: MAIN });
			} else {
				const at = startsWith(bytes, 0, 'Exif\0') ? 6 : 0;
				meta.tiff.push({ bytes: bytes.subarray(at), where: MAIN });
			}
			return;
		}
	}
	meta.texts.push({ key, text, where: MAIN });
}

// ---------------------------------------------------------------- WebP

function walkWebp(b: Uint8Array, meta: RawMeta): void {
	let i = 12;
	while (i + 8 <= b.length) {
		const type = ascii(b, i, 4);
		const len = u32le(b, i + 4);
		if (i + 8 + len > b.length) throw new Error('unreadable');
		const d = b.subarray(i + 8, i + 8 + len);
		if (type === 'VP8X') {
			meta.width = u24le(d, 4) + 1;
			meta.height = u24le(d, 7) + 1;
		} else if (type === 'VP8 ' && meta.width === undefined && d.length >= 10) {
			meta.width = u16le(d, 6) & 0x3fff;
			meta.height = u16le(d, 8) & 0x3fff;
		} else if (type === 'VP8L' && meta.width === undefined && d.length >= 5) {
			const bits = u32le(d, 1);
			meta.width = (bits & 0x3fff) + 1;
			meta.height = ((bits >>> 14) & 0x3fff) + 1;
		} else if (type === 'ICCP') {
			meta.icc = d;
		} else if (type === 'EXIF') {
			meta.tiff.push({ bytes: startsWith(d, 0, 'Exif\0') ? d.subarray(6) : d, where: MAIN });
		} else if (type === 'XMP ') {
			meta.xmp.push({ text: utf8.decode(d), where: MAIN });
		} else if (type === 'C2PA') {
			meta.c2pa.push({
				bytes: len,
				aiSource: declaresAi(d),
				namesPerson: namesPerson(d),
				where: MAIN
			});
		} else if (!/^(VP8 |VP8L|ALPH|ANIM|ANMF)$/.test(type)) {
			meta.unknown.push({ name: `WebP chunk ${type.trim()}`, bytes: len, where: MAIN });
		}
		i += 8 + len + (len % 2);
	}
}

// ---------------------------------------------------------------- HEIF / AVIF

export type Box = { type: string; start: number; body: number; end: number };

export function readBoxes(b: Uint8Array, from: number, to: number): Box[] {
	const out: Box[] = [];
	let i = from;
	while (i + 8 <= to) {
		let size = u32be(b, i);
		const type = ascii(b, i + 4, 4);
		let body = i + 8;
		if (size === 1) {
			if (i + 16 > to) break;
			size = u32be(b, i + 8) * 2 ** 32 + u32be(b, i + 12);
			body = i + 16;
		} else if (size === 0) size = to - i;
		if (size < body - i || i + size > to) break;
		out.push({ type, start: i, body, end: i + size });
		i += size;
	}
	return out;
}

export const C2PA_UUID = 'd8fec3d61b0e483c92975828877ec481';

type Item = { id: number; type: string; contentType?: string };
export type Loc = { method: number; extents: { offset: number; length: number }[] };

function walkHeif(b: Uint8Array, meta: RawMeta): void {
	const top = readBoxes(b, 0, b.length);
	for (const box of top) {
		if (box.type === 'uuid') {
			const id = Array.from(b.subarray(box.body, box.body + 16), (x) =>
				x.toString(16).padStart(2, '0')
			).join('');
			if (id === C2PA_UUID)
				meta.c2pa.push({
					bytes: box.end - box.start,
					aiSource: declaresAi(b.subarray(box.body, box.end)),
					namesPerson: namesPerson(b.subarray(box.body, box.end)),
					where: MAIN
				});
			else
				meta.unknown.push({ name: 'Private box (uuid)', bytes: box.end - box.start, where: MAIN });
		}
	}
	const metaBox = top.find((x) => x.type === 'meta');
	if (!metaBox) throw new Error('unreadable');
	const kids = readBoxes(b, metaBox.body + 4, metaBox.end);

	let primary = 0;
	const items = new Map<number, Item>();
	const locs = new Map<number, Loc>();
	const refs: { type: string; from: number; to: number[] }[] = [];
	const props: Box[] = [];
	const assoc = new Map<number, number[]>();
	let idat: Box | undefined;

	for (const k of kids) {
		const v = b[k.body];
		if (k.type === 'pitm') primary = v === 0 ? u16be(b, k.body + 4) : u32be(b, k.body + 4);
		else if (k.type === 'iinf') {
			const at = k.body + 4 + (v === 0 ? 2 : 4);
			for (const infe of readBoxes(b, at, k.end)) {
				if (infe.type !== 'infe') continue;
				const iv = b[infe.body];
				if (iv < 2) continue;
				let p = infe.body + 4;
				const id = iv === 2 ? u16be(b, p) : u32be(b, p);
				p += (iv === 2 ? 2 : 4) + 2;
				const type = ascii(b, p, 4);
				p += 4;
				const nameEnd = b.indexOf(0, p);
				const item: Item = { id, type };
				if (type === 'mime' && nameEnd >= 0 && nameEnd < infe.end) {
					const ctEnd = b.indexOf(0, nameEnd + 1);
					if (ctEnd >= 0 && ctEnd <= infe.end)
						item.contentType = ascii(b, nameEnd + 1, ctEnd - nameEnd - 1);
				}
				items.set(id, item);
			}
		} else if (k.type === 'iloc') readIloc(b, k, locs);
		else if (k.type === 'iref') {
			for (const r of readBoxes(b, k.body + 4, k.end)) {
				const w = v === 0 ? 2 : 4;
				const rd = (o: number) => (w === 2 ? u16be(b, o) : u32be(b, o));
				const from = rd(r.body);
				const n = u16be(b, r.body + w);
				const to: number[] = [];
				for (let j = 0; j < n; j++) to.push(rd(r.body + w + 2 + j * w));
				refs.push({ type: r.type, from, to });
			}
		} else if (k.type === 'iprp') {
			for (const c of readBoxes(b, k.body, k.end)) {
				if (c.type === 'ipco') props.push(...readBoxes(b, c.body, c.end));
				else if (c.type === 'ipma') readIpma(b, c, assoc);
			}
		} else if (k.type === 'idat') idat = k;
	}

	const itemBytes = (id: number): Uint8Array | null => {
		const loc = locs.get(id);
		if (!loc) return null;
		const total = loc.extents.reduce((n, e) => n + e.length, 0);
		if (total > b.length) return null;
		const out = new Uint8Array(total);
		let o = 0;
		for (const e of loc.extents) {
			const src = loc.method === 1 && idat ? idat.body + e.offset : e.offset;
			if (src + e.length > b.length) return null;
			out.set(b.subarray(src, src + e.length), o);
			o += e.length;
		}
		return out;
	};
	const propsOf = (id: number) => (assoc.get(id) ?? []).map((ix) => props[ix - 1]).filter(Boolean);
	const auxType = (id: number) => {
		const aux = propsOf(id).find((p) => p.type === 'auxC');
		if (!aux) return '';
		const s = aux.body + 4;
		const e = b.indexOf(0, s);
		return ascii(b, s, (e < 0 || e > aux.end ? aux.end : e) - s);
	};
	const describes = (id: number) => refs.find((r) => r.type === 'cdsc' && r.from === id)?.to ?? [];
	const whereFor = (id: number) => {
		const to = describes(id);
		return to.length === 0 || to.includes(primary) ? MAIN : `extra image ${to[0]}`;
	};

	for (const p of propsOf(primary)) {
		if (p.type === 'ispe') {
			meta.width = u32be(b, p.body + 4);
			meta.height = u32be(b, p.body + 8);
		} else if (p.type === 'colr') {
			const kind = ascii(b, p.body, 4);
			if (kind === 'prof' || kind === 'rICC') meta.icc = b.subarray(p.body + 4, p.end);
			else
				meta.colorTags.push(
					kind === 'nclx' ? `cicp:${u16be(b, p.body + 4)}/${u16be(b, p.body + 6)}` : kind
				);
		} else if (p.type === 'irot') {
			const deg = (b[p.body] & 3) * 90;
			if (deg) meta.containerOrientation = `Rotated ${deg}° counterclockwise`;
		} else if (p.type === 'imir') {
			meta.containerOrientation = `${meta.containerOrientation ? meta.containerOrientation + ', ' : ''}mirrored`;
		}
	}

	// A grid image (Fujifilm and Canon .HIF) can carry its color on the tiles
	// rather than on the grid item itself.
	if (!meta.icc && !meta.colorTags.length) {
		const colr = props.find((p) => p.type === 'colr');
		if (colr) {
			const kind = ascii(b, colr.body, 4);
			if (kind === 'prof' || kind === 'rICC') meta.icc = b.subarray(colr.body + 4, colr.end);
			else
				meta.colorTags.push(
					kind === 'nclx' ? `cicp:${u16be(b, colr.body + 4)}/${u16be(b, colr.body + 6)}` : kind
				);
		}
	}

	for (const item of items.values()) {
		if (item.type === 'Exif') {
			const d = itemBytes(item.id);
			if (d && d.length > 4) {
				const skip = 4 + u32be(d, 0);
				if (skip < d.length) meta.tiff.push({ bytes: d.subarray(skip), where: whereFor(item.id) });
			}
		} else if (item.type === 'mime' && /rdf\+xml/.test(item.contentType ?? '')) {
			const d = itemBytes(item.id);
			if (d) meta.xmp.push({ text: utf8.decode(d), where: whereFor(item.id) });
		} else if (item.type === 'mime' && /c2pa/.test(item.contentType ?? '')) {
			const d = itemBytes(item.id);
			meta.c2pa.push({
				bytes: d?.length ?? 0,
				aiSource: d ? declaresAi(d) : false,
				namesPerson: d ? namesPerson(d) : false,
				where: MAIN
			});
		} else if (item.type === 'tmap') {
			meta.gainMap = true;
		}
	}

	for (const r of refs) {
		if (r.type === 'thmb') {
			const ispe = propsOf(r.from).find((p) => p.type === 'ispe');
			const dims = ispe ? `, ${u32be(b, ispe.body + 4)} x ${u32be(b, ispe.body + 8)}` : '';
			const size = locs.get(r.from)?.extents.reduce((n, e) => n + e.length, 0) ?? 0;
			meta.thumbs.push({ label: `Embedded thumbnail${dims}`, bytes: size, where: MAIN });
		} else if (r.type === 'auxl') {
			const t = auxType(r.from);
			if (/hdrgainmap/i.test(t)) meta.gainMap = true;
			else if (/depth|auxid:2/i.test(t)) meta.pictureData.push('depth map');
			else if (/alpha|auxid:1/i.test(t)) meta.pictureData.push('transparency');
			else if (/matte/i.test(t)) meta.pictureData.push('portrait matte');
			else meta.pictureData.push('extra image');
		}
	}
}

export function readIloc(b: Uint8Array, k: Box, locs: Map<number, Loc>): void {
	const v = b[k.body];
	let p = k.body + 4;
	const offSize = b[p] >> 4;
	const lenSize = b[p] & 15;
	const baseSize = b[p + 1] >> 4;
	const idxSize = v === 1 || v === 2 ? b[p + 1] & 15 : 0;
	p += 2;
	const rd = (size: number) => {
		let x = 0;
		for (let j = 0; j < size; j++) x = x * 256 + b[p + j];
		p += size;
		return x;
	};
	const count = v < 2 ? rd(2) : rd(4);
	for (let n = 0; n < count && p < k.end; n++) {
		const id = v < 2 ? rd(2) : rd(4);
		const method = v === 1 || v === 2 ? rd(2) & 15 : 0;
		rd(2); // data_reference_index
		const base = rd(baseSize);
		const extents: Loc['extents'] = [];
		const ec = rd(2);
		for (let e = 0; e < ec; e++) {
			if (idxSize) rd(idxSize);
			const offset = base + rd(offSize);
			const length = rd(lenSize);
			extents.push({ offset, length });
		}
		locs.set(id, { method, extents });
	}
}

function readIpma(b: Uint8Array, k: Box, assoc: Map<number, number[]>): void {
	const v = b[k.body];
	const flags = b[k.body + 3];
	let p = k.body + 4;
	const n = u32be(b, p);
	p += 4;
	for (let e = 0; e < n && p < k.end; e++) {
		const id = v < 1 ? u16be(b, p) : u32be(b, p);
		p += v < 1 ? 2 : 4;
		const c = b[p++];
		const list: number[] = [];
		for (let j = 0; j < c; j++) {
			if (flags & 1) {
				list.push(u16be(b, p) & 0x7fff);
				p += 2;
			} else list.push(b[p++] & 0x7f);
		}
		assoc.set(id, list);
	}
}
