// Turns the raw blocks from containers.ts into the EXIF viewer's report: every
// field sorted into the removable sections (sections.ts), plus the essentials
// that are kept.
import exifr from 'exifr';
import { readContainer, type RawMeta, type Where } from './containers';
import { parseXmp, parseIptc, iccDescription, type XmpProp } from './decoders';
import { SECTIONS, REASONS, type SectionId } from './sections';
import { levelOf, highest, type Level } from './levels';

export type { SectionId, Level };

export type Field = {
	/** What levels.ts rates it by: tag, property or dataset name, or a viewer key. */
	key: string;
	label: string;
	value: string;
	/** Which block it came from: EXIF, XMP, IPTC, PNG, ... */
	source: string;
	/** Format bookkeeping (EXIF version, pixel counts...): listed folded. */
	minor?: boolean;
	href?: string;
	level: Level;
	/** One line on why it is red or amber. */
	why?: string;
};

type FieldIn = Omit<Field, 'level' | 'why'>;

export type Section = {
	id: SectionId;
	title: string;
	blurb: string;
	fields: Field[];
	/** The highest level among its fields; null when it is empty. */
	level: Level | null;
};
export type Essential = { label: string; value: string; reason: string };

export type Report = {
	format: RawMeta['format'];
	width?: number;
	height?: number;
	sections: Section[];
	essentials: Essential[];
	/** Picture data stored beside the main image, left alone. */
	pictureData: string[];
	/** The EXIF thumbnail, when it is a JPEG the browser can show. */
	thumbnailJpeg?: Uint8Array;
};

// ------------------------------------------------------------ labels & values

const LABELS: Record<string, string> = {
	Make: 'Camera maker',
	Model: 'Camera model',
	LensMake: 'Lens maker',
	LensModel: 'Lens',
	LensInfo: 'Lens range',
	BodySerialNumber: 'Camera serial number',
	SerialNumber: 'Camera serial number',
	LensSerialNumber: 'Lens serial number',
	CameraOwnerName: 'Camera owner',
	OwnerName: 'Camera owner',
	MakerNote: "Maker note (the camera maker's private data)",
	ExposureTime: 'Shutter speed',
	FNumber: 'Aperture',
	ISO: 'ISO',
	FocalLength: 'Focal length',
	FocalLengthIn35mmFormat: 'Focal length (35 mm equivalent)',
	DateTimeOriginal: 'Taken',
	CreateDate: 'Digitized',
	DateTimeDigitized: 'Digitized',
	ModifyDate: 'Modified',
	DateTime: 'Modified',
	OffsetTime: 'Time zone (modified)',
	OffsetTimeOriginal: 'Time zone (taken)',
	OffsetTimeDigitized: 'Time zone (digitized)',
	SubSecTimeOriginal: 'Fraction of a second (taken)',
	SubSecTimeDigitized: 'Fraction of a second (digitized)',
	SubSecTime: 'Fraction of a second (modified)',
	Artist: 'Artist',
	Copyright: 'Copyright',
	Software: 'Software',
	HostComputer: 'Computer or device',
	ImageUniqueID: 'Unique photo ID',
	ImageDescription: 'Description',
	UserComment: 'Comment',
	GPSAltitude: 'Altitude',
	GPSImgDirection: 'Direction the camera faced',
	GPSDestBearing: 'Bearing to subject',
	GPSSpeed: 'Speed',
	GPSHPositioningError: 'Position accuracy',
	GPSDateStamp: 'GPS date',
	GPSTimeStamp: 'GPS time (UTC)',
	CreatorTool: 'Made with',
	MetadataDate: 'Metadata changed',
	DigitalSourceType: 'How the picture was made',
	creator: 'Creator',
	rights: 'Rights',
	title: 'Title',
	description: 'Description',
	subject: 'Keywords'
};

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

function humanize(key: string): string {
	if (LABELS[key]) return LABELS[key];
	const words = key
		.replace(/^GPS(?=[A-Z])/, 'GPS ')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		.replace(/[-_]+/g, ' ')
		.trim()
		.split(/\s+/);
	return words
		.map((w, i) =>
			/^[A-Z0-9]{2,}$/.test(w) ? w : i === 0 ? w[0].toUpperCase() + w.slice(1) : w.toLowerCase()
		)
		.join(' ');
}

/** "2015:04:10 11:33:00" (EXIF) or "2015-04-10T11:33:00+01:00" (XMP) in plain words. */
function formatDate(s: string): string | null {
	const iptc = /^(\d{4})(\d{2})(\d{2})$/.exec(s.trim());
	if (iptc) s = `${iptc[1]}:${iptc[2]}:${iptc[3]}`;
	const m =
		/^(\d{4})[:-](\d{2})[:-](\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/.exec(
			s.trim()
		);
	if (!m) return null;
	const month = MONTHS[Number(m[2]) - 1];
	if (!month) return null;
	let out = `${month} ${Number(m[3])}, ${m[1]}`;
	if (m[4]) out += `, ${m[4]}:${m[5]}${m[6] ? ':' + m[6] : ''}`;
	if (m[7]) out += ` (UTC${m[7] === 'Z' ? '' : m[7]})`;
	return out;
}

/** IPTC "123300+0000" as "12:33:00 (UTC+00:00)". */
function formatIptcTime(s: string): string {
	const m = /^(\d{2})(\d{2})(\d{2})([+-]\d{2})(\d{2})$/.exec(s.trim());
	return m ? `${m[1]}:${m[2]}:${m[3]} (UTC${m[4]}:${m[5]})` : s;
}

/** XMP writes EXIF numbers as fractions ("103/25"); read them as numbers. */
function rational(s: string): number | null {
	const m = /^(-?\d+)\/(\d+)$/.exec(s.trim());
	return m && Number(m[2]) ? Number(m[1]) / Number(m[2]) : null;
}

const kb = (n: number) => (n < 1024 ? `${n} bytes` : `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`);

function formatValue(key: string, v: unknown): string {
	if (v === null || v === undefined) return '';
	if (v instanceof Uint8Array && /Version$/.test(key) && v.length === 4) {
		const t = String.fromCharCode(...v);
		return /^\d{4}$/.test(t) ? `${Number(t.slice(0, 2))}.${t.slice(2)}` : t;
	}
	if (v instanceof Uint8Array || v instanceof ArrayBuffer) return `${kb(v.byteLength)} of data`;
	if (v instanceof Date) return formatDate(v.toISOString()) ?? v.toISOString();
	if (Array.isArray(v) && key === 'GPSTimeStamp' && v.length === 3) {
		return v.map((x) => String(Math.floor(Number(x))).padStart(2, '0')).join(':');
	}
	if (Array.isArray(v)) return v.map((x) => formatValue('', x)).join(', ');
	if (typeof v === 'object')
		return Object.values(v as Record<string, unknown>)
			.map((x) => formatValue('', x))
			.join(', ');
	if (typeof v === 'number') {
		const round = (x: number, d = 2) => String(Math.round(x * 10 ** d) / 10 ** d);
		if (key === 'ExposureTime')
			return v > 0 && v < 1 ? `1/${Math.round(1 / v)} s` : `${round(v)} s`;
		if (key === 'FNumber' || key === 'ApertureValue') return `f/${round(v, 1)}`;
		if (/^FocalLength/.test(key)) return `${round(v, 1)} mm`;
		if (key === 'GPSAltitude' || key === 'GPSHPositioningError') return `${round(v, 1)} m`;
		if (key === 'GPSImgDirection' || key === 'GPSDestBearing') return `${Math.round(v)}°`;
		return round(v, 4);
	}
	const s = String(v).replace(/\0+$/, '').trim();
	if (key === 'ExposureTime' && /^\d+\/\d+$/.test(s)) return `${s} s`;
	const r = rational(s);
	if (r !== null) return formatValue(key, r);
	if (/^-?\d+\/\d+(\s+-?\d+\/\d+)+$/.test(s)) {
		return s
			.split(/\s+/)
			.map((x) => formatValue('', rational(x) ?? x))
			.join(', ');
	}
	if (/^(TimeCreated|DigitalCreationTime)$/.test(key)) return formatIptcTime(s);
	return formatDate(s) ?? (s.length > 600 ? s.slice(0, 600) + '…' : s);
}

// ------------------------------------------------------------ classification

const DATE_KEYS = new Set([
	'DateTimeOriginal',
	'CreateDate',
	'DateTimeDigitized',
	'ModifyDate',
	'DateTime',
	'OffsetTime',
	'OffsetTimeOriginal',
	'OffsetTimeDigitized',
	'SubSecTime',
	'SubSecTimeOriginal',
	'SubSecTimeDigitized',
	'TimeZoneOffset'
]);
const AUTHOR_KEYS = new Set(['Artist', 'Copyright', 'XPAuthor', 'CameraOwnerName', 'OwnerName']);
const SOFTWARE_KEYS = new Set([
	'Software',
	'HostComputer',
	'ProcessingSoftware',
	'ImageUniqueID',
	'DocumentName',
	'ImageHistory',
	'OriginalRawFileName'
]);
const CAMERA_KEYS = new Set([
	'Make',
	'Model',
	'UniqueCameraModel',
	'CameraSerialNumber',
	'SerialNumber',
	'LensModel',
	'LensMake'
]);
const OTHER_KEYS = new Set([
	'ImageDescription',
	'UserComment',
	'XPComment',
	'XPKeywords',
	'XPSubject',
	'XPTitle',
	'Rating',
	'RatingPercent'
]);
export const ESSENTIAL_KEYS = new Set([
	'Orientation',
	'XResolution',
	'YResolution',
	'ResolutionUnit'
]);
export const TECH_KEYS = new Set([
	'ImageWidth',
	'ImageHeight',
	'BitsPerSample',
	'Compression',
	'PhotometricInterpretation',
	'SamplesPerPixel',
	'PlanarConfiguration',
	'YCbCrPositioning',
	'YCbCrSubSampling',
	'YCbCrCoefficients',
	'ReferenceBlackWhite',
	'ExifVersion',
	'FlashpixVersion',
	'ColorSpace',
	'ComponentsConfiguration',
	'ExifImageWidth',
	'ExifImageHeight',
	'PixelXDimension',
	'PixelYDimension',
	'Gamma',
	'CompressedBitsPerPixel',
	'StripOffsets',
	'StripByteCounts',
	'RowsPerStrip',
	'TileWidth',
	'TileLength',
	'TileOffsets',
	'TileByteCounts',
	'PrintIM',
	'InteropIndex',
	'InteropVersion',
	'RelatedImageWidth',
	'RelatedImageHeight',
	'NewSubfileType',
	'SubfileType',
	'GPSVersionID'
]);
/** Camera data that repeats or qualifies the main settings: listed folded. */
const CAMERA_MINOR = new Set([
	'ShutterSpeedValue',
	'ApertureValue',
	'BrightnessValue',
	'MaxApertureValue',
	'SensitivityType',
	'FocalPlaneXResolution',
	'FocalPlaneYResolution',
	'FocalPlaneResolutionUnit',
	'SensingMethod',
	'FileSource',
	'SceneType',
	'CustomRendered',
	'SubjectDistanceRange',
	'CompositeImage',
	'SubjectArea',
	'CameraElevationAngle',
	'LightSource',
	'SceneCaptureType',
	'Sharpness',
	'Saturation',
	'Contrast',
	'GainControl',
	'DigitalZoomRatio'
]);
const SKIP_KEYS = new Set([
	'ExifIFDPointer',
	'GPSInfoIFDPointer',
	'InteropIFDPointer',
	'ExifIFD',
	'GPSIFD',
	'InteropIFD',
	'latitude',
	'longitude',
	'GPSLatitude',
	'GPSLongitude',
	'GPSLatitudeRef',
	'GPSLongitudeRef',
	'GPSAltitudeRef',
	'GPSSpeedRef',
	'GPSImgDirectionRef',
	'GPSDestBearingRef',
	'GPSTrackRef',
	'GPSDestLatitudeRef',
	'GPSDestLongitudeRef',
	'ApplicationNotes',
	'IPTC-NAA',
	'MakerNote'
]);

export function tiffTarget(key: string, group: 'ifd0' | 'exif' | 'interop' | 'gps'): Target {
	if (group === 'gps' || key.startsWith('GPS')) return TECH_KEYS.has(key) ? 'tech' : 'location';
	if (DATE_KEYS.has(key)) return 'datetime';
	if (AUTHOR_KEYS.has(key)) return 'author';
	if (SOFTWARE_KEYS.has(key)) return 'software';
	if (CAMERA_KEYS.has(key)) return 'camera';
	if (OTHER_KEYS.has(key)) return 'other';
	if (ESSENTIAL_KEYS.has(key)) return 'essential';
	if (TECH_KEYS.has(key) || group === 'interop') return 'tech';
	return group === 'exif' ? 'camera' : 'other';
}

/** PNG's registered text keywords; ImageMagick also copies EXIF in as "exif:Tag". */
export function pngTextTarget(key: string): Target {
	const exif = /^exif:(.+)$/.exec(key);
	if (exif) return tiffTarget(exif[1], 'exif');
	if (/^date:/.test(key) || key === 'Creation Time') return 'datetime';
	if (/^icc:/.test(key)) return 'tech';
	if (key === 'Author' || key === 'Copyright' || key === 'Disclaimer') return 'author';
	if (key === 'Software') return 'software';
	if (key === 'Source') return 'camera';
	return 'other';
}

/** A1111, ComfyUI, InvokeAI and NovelAI write their prompts as PNG text or EXIF comments. */
export const AI_TEXT_KEYS =
	/^(parameters|prompt|negative_prompt|workflow|dream|sd-metadata|invokeai_\w+|generation_data|ai_metadata|aesthetic_score)$/i;
export const looksLikePrompt = (t: string) =>
	/Negative prompt:|\bSteps: \d+, Sampler:|"prompt"\s*:/.test(t);

export const NS = {
	exif: 'http://ns.adobe.com/exif/1.0/',
	exifEX: 'http://cipa.jp/exif/1.0/',
	tiff: 'http://ns.adobe.com/tiff/1.0/',
	aux: 'http://ns.adobe.com/exif/1.0/aux/',
	xmp: 'http://ns.adobe.com/xap/1.0/',
	xmpMM: 'http://ns.adobe.com/xap/1.0/mm/',
	dc: 'http://purl.org/dc/elements/1.1/',
	photoshop: 'http://ns.adobe.com/photoshop/1.0/',
	xmpRights: 'http://ns.adobe.com/xap/1.0/rights/',
	crs: 'http://ns.adobe.com/camera-raw-settings/1.0/',
	iptcCore: 'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/',
	iptcExt: 'http://iptc.org/std/Iptc4xmpExt/2008-02-29/',
	plus: 'http://ns.useplus.org/ldf/xmp/1.0/',
	hdrgm: 'http://ns.adobe.com/hdr-gain-map/1.0/',
	gContainer: 'http://ns.google.com/photos/1.0/container/',
	gItem: 'http://ns.google.com/photos/1.0/container/item/',
	gCamera: 'http://ns.google.com/photos/1.0/camera/',
	apdi: 'http://ns.apple.com/pixeldatainfo/1.0/',
	appleGainMap: 'http://ns.apple.com/HDRGainMap/1.0/',
	mwgRs: 'http://www.metadataworkinggroup.com/schemas/regions/',
	dji: 'http://www.dji.com/drone-dji/1.0/'
};

const SOURCE_TYPES: Record<string, string> = {
	trainedAlgorithmicMedia: 'Made by AI',
	compositeWithTrainedAlgorithmicMedia: 'Edited with AI',
	algorithmicMedia: 'Made by software, without AI',
	compositeSynthetic: 'Composite with synthetic parts',
	digitalCapture: 'Camera capture',
	digitalArt: 'Digital art',
	composite: 'Composite',
	minorHumanEdits: 'Camera capture with minor edits'
};

export type Target = SectionId | 'essential' | 'tech' | 'skip';

export function classifyXmp(p: XmpProp): Target {
	const n = p.name;
	switch (p.ns) {
		case NS.hdrgm:
		case NS.gContainer:
		case NS.gItem:
		case NS.apdi:
		case NS.appleGainMap:
		case NS.gCamera:
			return 'essential';
		case NS.exif:
			if (n.startsWith('GPS')) return 'location';
			if (n.startsWith('DateTime')) return 'datetime';
			if (TECH_KEYS.has(n)) return 'tech';
			if (n === 'UserComment') return 'other';
			return 'camera';
		case NS.exifEX:
			return AUTHOR_KEYS.has(n) ? 'author' : TECH_KEYS.has(n) ? 'tech' : 'camera';
		case NS.aux:
			return AUTHOR_KEYS.has(n) ? 'author' : 'camera';
		case NS.tiff:
			if (ESSENTIAL_KEYS.has(n)) return 'essential';
			if (n === 'Make' || n === 'Model') return 'camera';
			if (n === 'DateTime') return 'datetime';
			if (AUTHOR_KEYS.has(n)) return 'author';
			if (n === 'Software') return 'software';
			if (n === 'ImageDescription') return 'other';
			return 'tech';
		case NS.xmp:
			if (n === 'CreatorTool') return 'software';
			if (/Date$/.test(n)) return 'datetime';
			if (n === 'Thumbnails') return 'thumbnail';
			return 'other';
		case NS.xmpMM:
		case NS.crs:
			return 'software';
		case NS.dc:
			if (/^(creator|rights|publisher|contributor)$/.test(n)) return 'author';
			if (n === 'date') return 'datetime';
			if (n === 'format') return 'tech';
			return 'other';
		case NS.photoshop:
			if (/^(City|State|Country)$/.test(n)) return 'location';
			if (n === 'DateCreated') return 'datetime';
			if (/^(AuthorsPosition|Credit|Source|CaptionWriter)$/.test(n)) return 'author';
			if (n === 'History') return 'software';
			if (/^(ColorMode|ICCProfile|LegacyIPTCDigest)$/.test(n)) return 'tech';
			return 'other';
		case NS.xmpRights:
		case NS.plus:
			return 'author';
		case NS.iptcCore:
			if (/^(Location|CountryCode)$/.test(n)) return 'location';
			if (n === 'CreatorContactInfo') return 'author';
			return 'other';
		case NS.iptcExt:
			if (n === 'DigitalSourceType' || /^AI/.test(n)) return 'ai';
			if (/^Location/.test(n)) return 'location';
			return 'other';
		case NS.dji:
			return /Gps|Altitude|Latitude|Longitude/i.test(n) ? 'location' : 'camera';
		default:
			return 'other';
	}
}

export const IPTC_SECTIONS: Record<string, Target> = {
	City: 'location',
	'Sub-location': 'location',
	'Province-State': 'location',
	'Country-PrimaryLocationCode': 'location',
	'Country-PrimaryLocationName': 'location',
	DateCreated: 'datetime',
	TimeCreated: 'datetime',
	DigitalCreationDate: 'datetime',
	DigitalCreationTime: 'datetime',
	'By-line': 'author',
	'By-lineTitle': 'author',
	Credit: 'author',
	Source: 'author',
	CopyrightNotice: 'author',
	Contact: 'author',
	'Writer-Editor': 'author',
	OriginatingProgram: 'software',
	ProgramVersion: 'software',
	RecordVersion: 'tech'
};

// ------------------------------------------------------------ build

type TiffGroups = Record<string, Record<string, unknown>>;

async function readTiff(bytes: Uint8Array): Promise<TiffGroups> {
	const out = await exifr.parse(bytes, {
		tiff: true,
		ifd1: true,
		exif: true,
		gps: true,
		interop: true,
		makerNote: true,
		userComment: true,
		xmp: false,
		iptc: false,
		icc: false,
		mergeOutput: false,
		translateKeys: true,
		translateValues: true,
		reviveValues: false
	});
	return (out ?? {}) as TiffGroups;
}

/** The SOF dimensions of a JPEG thumbnail, for its label. */
function jpegSize(b: Uint8Array): string {
	let i = 2;
	while (i + 9 < b.length && b[i] === 0xff) {
		const m = b[i + 1];
		const len = (b[i + 2] << 8) | b[i + 3];
		if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
			return `${(b[i + 7] << 8) | b[i + 8]} x ${(b[i + 5] << 8) | b[i + 6]}`;
		}
		i += 2 + len;
	}
	return '';
}

const PRIMARIES: Record<number, string> = {
	1: 'sRGB',
	9: 'Rec. 2020',
	11: 'DCI-P3',
	12: 'Display P3'
};
const TRANSFERS: Record<number, string> = { 16: 'PQ (HDR)', 18: 'HLG (HDR)' };

/** "cicp:12/13" as "Display P3"; PNG's own chunks by name. */
function colorTagName(t: string): string {
	const m = /^cicp:(\d+)\/(\d+)$/.exec(t);
	if (m) {
		const name = PRIMARIES[Number(m[1])] ?? 'Color space tags';
		const transfer = TRANSFERS[Number(m[2])];
		return transfer ? `${name}, ${transfer}` : name;
	}
	if (t === 'gAMA' || t === 'cHRM') return 'Gamma and primaries';
	if (t === 'mDCV' || t === 'cLLI') return '';
	return t;
}

/** Byte length of the maker note (tag 0x927C in the Exif IFD), or 0. */
function makerNoteSize(t: Uint8Array): number {
	if (t.length < 8) return 0;
	const le = t[0] === 0x49;
	const r16 = (o: number) => (le ? t[o] | (t[o + 1] << 8) : (t[o] << 8) | t[o + 1]);
	const r32 = (o: number) =>
		(le
			? t[o] | (t[o + 1] << 8) | (t[o + 2] << 16) | (t[o + 3] << 24)
			: (t[o] << 24) | (t[o + 1] << 16) | (t[o + 2] << 8) | t[o + 3]) >>> 0;
	const find = (ifd: number, tag: number) => {
		if (ifd + 2 > t.length) return -1;
		const n = r16(ifd);
		for (let k = 0; k < n; k++) {
			const e = ifd + 2 + k * 12;
			if (e + 12 > t.length) return -1;
			if (r16(e) === tag) return e;
		}
		return -1;
	};
	const exifPtr = find(r32(4), 0x8769);
	if (exifPtr < 0) return 0;
	const mn = find(r32(exifPtr + 8), 0x927c);
	return mn < 0 ? 0 : r32(mn + 4);
}

export async function buildReport(bytes: Uint8Array): Promise<Report> {
	const raw = readContainer(bytes);
	const sections = new Map<SectionId, Field[]>(SECTIONS.map((s) => [s.id, []]));
	const add = (id: SectionId, f: FieldIn, where: Where = '') => {
		if (!f.value) return;
		// Only format bookkeeping counts as technical: a folded copy of a date
		// or a software name is as telling as the original.
		const technical = !!f.minor && (id === 'other' || id === 'camera');
		const rated = { ...f, ...levelOf(id, f.key, f.value, technical) };
		sections.get(id)!.push(where ? { ...rated, label: `${f.label} (${where})` } : rated);
	};
	const route = (t: Target, f: FieldIn, where: Where) => {
		if (t === 'skip' || t === 'essential') return;
		if (t === 'tech') add('other', { ...f, minor: true }, where);
		else add(t, f, where);
	};

	let orientation = raw.containerOrientation ?? '';
	let density = '';
	let gainMap = raw.gainMap;
	let thumbnailJpeg: Uint8Array | undefined;
	const pictureData = new Set(raw.pictureData);

	// EXIF
	for (const { bytes: tiff, where } of raw.tiff) {
		let g: TiffGroups;
		try {
			g = await readTiff(tiff);
		} catch {
			add(
				'other',
				{
					key: 'Unknown',
					label: 'EXIF block that could not be read',
					value: kb(tiff.length),
					source: 'EXIF'
				},
				where
			);
			continue;
		}
		const ifd0 = g.ifd0 ?? {};
		const exif = g.exif ?? {};
		const gps = g.gps ?? {};

		if (where === '' && ifd0.Orientation !== undefined && !orientation)
			orientation = formatValue('', ifd0.Orientation);
		if (where === '' && ifd0.XResolution && !density) {
			const unit =
				ifd0.ResolutionUnit === 'Centimeters' || ifd0.ResolutionUnit === 3 ? 'per cm' : 'dpi';
			density = `${formatValue('', ifd0.XResolution)} ${unit}`;
		}
		// XMP and IPTC can also live inside the TIFF structure (tags 700, 33723).
		if (ifd0.ApplicationNotes instanceof Uint8Array)
			raw.xmp.push({ text: new TextDecoder().decode(ifd0.ApplicationNotes), where });
		if (ifd0['IPTC-NAA'] instanceof Uint8Array) raw.iptc.push({ bytes: ifd0['IPTC-NAA'], where });

		if (typeof gps.latitude === 'number' && typeof gps.longitude === 'number') {
			const lat = gps.latitude.toFixed(6);
			const lon = gps.longitude.toFixed(6);
			add(
				'location',
				{
					key: 'Coordinates',
					label: 'Coordinates',
					value: `${lat}, ${lon}`,
					source: 'EXIF',
					href: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
				},
				where
			);
		}
		for (const [key, value] of Object.entries(gps)) {
			if (SKIP_KEYS.has(key)) continue;
			let v = formatValue(key, value);
			if (key === 'GPSAltitude' && gps.GPSAltitudeRef !== undefined) {
				const below =
					formatValue('', gps.GPSAltitudeRef).startsWith('1') ||
					/below/i.test(String(gps.GPSAltitudeRef));
				v += below ? ' below sea level' : ' above sea level';
			}
			if (key === 'GPSSpeed') {
				const unit: Record<string, string> = { K: 'km/h', M: 'mph', N: 'knots' };
				v = `${formatValue('', value)} ${unit[String(gps.GPSSpeedRef)] ?? ''}`.trim();
			}
			const north: Record<string, string> = { T: ' (true north)', M: ' (magnetic north)' };
			if (key === 'GPSImgDirection') v += north[String(gps.GPSImgDirectionRef)] ?? '';
			if (key === 'GPSDestBearing') v += north[String(gps.GPSDestBearingRef)] ?? '';
			route(
				TECH_KEYS.has(key) ? 'tech' : 'location',
				{ key, label: humanize(key), value: v, source: 'EXIF' },
				where
			);
		}

		for (const [group, data] of [
			['ifd0', ifd0],
			['exif', exif],
			['interop', g.interop ?? {}]
		] as const) {
			for (const [key, value] of Object.entries(data)) {
				if (SKIP_KEYS.has(key) || ESSENTIAL_KEYS.has(key)) continue;
				let target = tiffTarget(key, group);

				const v = formatValue(key, value);
				const prompt = key === 'UserComment' && looksLikePrompt(v);
				if (prompt) target = 'ai';
				const minor = target === 'camera' && CAMERA_MINOR.has(key);
				route(
					target,
					{
						key: prompt ? 'AIText' : key,
						label: humanize(key),
						value: v,
						source: 'EXIF',
						minor: minor || undefined
					},
					where
				);
			}
		}

		// exifr reads past the maker note without reporting it, so find it in
		// the TIFF structure directly.
		const makerNote = makerNoteSize(tiff);
		if (makerNote)
			add(
				'camera',
				{
					key: 'MakerNote',
					label: humanize('MakerNote'),
					value: `Present, ${kb(makerNote)}`,
					source: 'EXIF'
				},
				where
			);

		const ifd1 = g.ifd1 ?? {};
		const off = Number(ifd1.ThumbnailOffset ?? ifd1.JPEGInterchangeFormat);
		const len = Number(ifd1.ThumbnailLength ?? ifd1.JPEGInterchangeFormatLength);
		if (off && len && off + len <= tiff.length) {
			const jpeg = tiff.subarray(off, off + len);
			const dims = jpeg[0] === 0xff && jpeg[1] === 0xd8 ? jpegSize(jpeg) : '';
			if (where === '' && dims) thumbnailJpeg = jpeg;
			add(
				'thumbnail',
				{
					key: 'Thumbnail',
					label: 'EXIF thumbnail',
					value: `${dims ? dims + ', ' : ''}${kb(len)}`,
					source: 'EXIF'
				},
				where
			);
		} else if (Object.keys(ifd1).length) {
			add(
				'thumbnail',
				{ key: 'Thumbnail', label: 'EXIF thumbnail', value: 'Present', source: 'EXIF' },
				where
			);
		}
	}

	// XMP
	for (const { text, where } of raw.xmp) {
		let props: XmpProp[];
		try {
			props = parseXmp(text);
		} catch {
			add(
				'other',
				{
					key: 'Unknown',
					label: 'XMP block that could not be read',
					value: kb(text.length),
					source: 'XMP'
				},
				where
			);
			continue;
		}
		for (const p of props) {
			const t = classifyXmp(p);
			if (t === 'essential') {
				if (
					p.ns === NS.hdrgm ||
					p.ns === NS.appleGainMap ||
					(p.ns === NS.gItem && /GainMap/i.test(p.value))
				)
					gainMap = true;
				if (p.ns === NS.gCamera && /MotionPhoto|MicroVideo/.test(p.name))
					pictureData.add('motion photo video');
				if (p.ns === NS.tiff && p.name === 'Orientation' && !orientation) orientation = p.value;
				continue;
			}
			let value = formatValue(p.name, p.value);
			if (p.name === 'DigitalSourceType') {
				const key = p.value.split('/').pop() ?? '';
				value = SOURCE_TYPES[key] ? `${SOURCE_TYPES[key]} (${key})` : value;
			}
			const label = p.ns === NS.mwgRs ? 'Tagged faces and regions' : humanize(p.name);
			const minor = t === 'tech' || p.ns === NS.crs || (p.ns === NS.xmpMM && p.name !== 'History');
			const key = p.ns === NS.mwgRs ? 'FaceRegions' : p.ns === NS.crs ? `crs:${p.name}` : p.name;
			route(t, { key, label, value, source: 'XMP', minor: minor || undefined }, where);
		}
	}

	// IPTC
	for (const { bytes: iptc, where } of raw.iptc) {
		for (const { name, value } of parseIptc(iptc)) {
			route(
				IPTC_SECTIONS[name] ?? 'other',
				{
					key: name,
					label: humanize(name.replace(/-/g, '')),
					value: formatValue(name, value),
					source: 'IPTC'
				},
				where
			);
		}
	}

	// Content Credentials
	for (const c of raw.c2pa) {
		add(
			'ai',
			{
				key: c.namesPerson ? 'C2PA-person' : 'C2PA',
				label: c.namesPerson
					? 'Content Credentials (C2PA), naming a person or account'
					: 'Content Credentials (C2PA)',
				value: `Present, ${kb(c.bytes)}`,
				source: 'C2PA'
			},
			c.where
		);
		if (c.aiSource)
			add(
				'ai',
				{
					key: 'DigitalSourceType',
					label: 'The credentials say',
					value: 'Made or edited with AI',
					source: 'C2PA'
				},
				c.where
			);
	}

	// PNG text and JPEG comments
	for (const t of raw.texts) {
		const ai = AI_TEXT_KEYS.test(t.key) || looksLikePrompt(t.text);
		if (raw.format === 'jpeg') {
			add(
				ai ? 'ai' : 'other',
				{
					key: ai ? 'AIText' : 'Comment',
					label: 'Comment',
					value: formatValue('', t.text),
					source: 'JPEG'
				},
				t.where
			);
			continue;
		}
		const exifKey = /^exif:(.+)$/.exec(t.key)?.[1];
		const target = ai ? 'ai' : pngTextTarget(t.key);
		const label = exifKey
			? humanize(exifKey)
			: /^date:/.test(t.key)
				? `File ${t.key.slice(5)} date`
				: `Text: ${t.key}`;
		// ImageMagick's text copy of the EXIF: listed so nothing hides, folded
		// unless it says where or who.
		const minor = !!exifKey && target !== 'location' && target !== 'author';
		route(
			target === 'essential' ? 'tech' : target,
			{
				key: ai ? 'AIText' : (exifKey ?? (/^date:/.test(t.key) ? 'FileDate' : 'Text')),
				label,
				value: formatValue(exifKey ?? '', t.text),
				source: 'PNG text',
				minor: minor || undefined
			},
			t.where
		);
	}
	for (const d of raw.dates)
		add(
			'datetime',
			{ key: 'FileDate', label: d.label, value: formatValue('', d.value), source: 'PNG' },
			d.where
		);

	for (const t of raw.thumbs)
		add(
			'thumbnail',
			{ key: 'Thumbnail', label: t.label, value: kb(t.bytes), source: raw.format.toUpperCase() },
			t.where
		);
	if (!thumbnailJpeg) thumbnailJpeg = raw.thumbs.find((t) => t.jpeg && t.where === '')?.jpeg;

	for (const u of raw.unknown)
		add(
			'other',
			{
				key: 'Unknown',
				label: `Unrecognized block: ${u.name}`,
				value: kb(u.bytes),
				source: 'File'
			},
			u.where
		);

	if (!density && raw.density && raw.density.x) {
		density = raw.density.unit
			? `${raw.density.x} ${raw.density.unit === 'in' ? 'dpi' : 'per cm'}`
			: '';
	}

	const essentials: Essential[] = [];
	if (orientation)
		essentials.push({ label: 'Orientation', value: orientation, reason: REASONS.orientation });
	const iccName = raw.icc ? iccDescription(raw.icc) || 'Embedded profile' : '';
	const colorName =
		iccName ||
		raw.colorTags
			.map(colorTagName)
			.filter((x, i, a) => x && a.indexOf(x) === i)
			.join(', ');
	if (colorName)
		essentials.push({ label: 'Color profile', value: colorName, reason: REASONS.color });
	if (gainMap)
		essentials.push({ label: 'HDR gain map', value: 'Present', reason: REASONS.gainMap });
	if (density) essentials.push({ label: 'Pixel density', value: density, reason: REASONS.density });

	return {
		format: raw.format,
		width: raw.width,
		height: raw.height,
		sections: SECTIONS.map((s) => {
			const fields = sections.get(s.id)!;
			return { ...s, fields, level: highest(fields.map((f) => f.level)) };
		}),
		essentials,
		pictureData: [...pictureData],
		thumbnailJpeg
	};
}
