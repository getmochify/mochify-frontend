// How much each metadata value says about the person who took the photo:
// red, amber or green. Content-ops' handoff 2026-11-18-exif-viewer-sensitivity-
// levels (sections 1 to 4) sets the levels, the labels and the explanations; it
// asks for them to live in one data file so a level can change without touching
// the viewer. Change the wording here only through content-ops.
import type { SectionId } from './sections';

export type Level = 'red' | 'amber' | 'green';

export const LEVEL_ORDER: Level[] = ['red', 'amber', 'green'];

/** Shown as written: not "personal data", "anonymous" or "safe" (handoff section 1). */
export const LEVEL_LABELS: Record<Level, string> = {
	red: 'Identifies you or your location',
	amber: 'Could help identify you',
	green: 'Not personal on its own'
};

const WHY = {
	coordinates: 'This shows where the photo was taken.',
	altitude: 'With the coordinates, this places you more exactly.',
	direction: 'This shows which way you were facing or moving.',
	place: 'This names the place the photo was taken.',
	gpsTime: 'This shows when you were at that place.',
	gpsOther: 'With the location, this adds detail about where you were.',
	serial: 'A serial number is unique to your camera and links your photos to each other.',
	owner: "This is the name of the camera's owner.",
	model: 'Your camera, phone or lens model narrows down who took the photo.',
	makerNote: "The camera maker's private data. What it holds varies, and it can include IDs.",
	uniqueId: 'A unique ID can link this photo to other copies of it, and to a Live Photo.',
	date: 'The date shows when you were there.',
	person: 'This names a person.',
	contact: 'These are contact details.',
	people: 'This tags people who appear in the photo.',
	rights: 'Rights information. It names no one here, but can point to the owner.',
	software:
		"Your software and editing history can help tell your photos apart from other people's.",
	fileIds: 'These IDs link this file to its other versions.',
	fileName: 'The original file name can reveal names or dates.',
	c2paPerson: 'These credentials name a person or an account.',
	c2pa: 'Content Credentials record how the picture was made, and can include who made it.',
	aiText: 'The prompt and settings used to make the picture.',
	aiLabel: 'This says how the picture was made.',
	thumbnail: 'This preview can still show the photo as it was before you cropped it.',
	freeText: 'Free text can hold a name or other details.',
	unknown: 'This viewer cannot read this, so it cannot tell what it holds.'
};

/**
 * Checked in order against a field's key (an EXIF tag name, an XMP property
 * name, an IPTC dataset name, or one of the viewer's own keys: Coordinates,
 * MakerNote, Thumbnail, C2PA, C2PA-person, AIText, Comment, Text, Unknown).
 */
const RULES: { match: RegExp; level: Level; why?: string }[] = [
	{ match: /Serial/i, level: 'red', why: WHY.serial },
	{ match: /^(CameraOwnerName|OwnerName)$/, level: 'red', why: WHY.owner },
	{
		match:
			/^(Coordinates|GPS(Dest)?(Latitude|Longitude)|Gps(Latitude|Longitude)|(Latitude|Longitude))$/,
		level: 'red',
		why: WHY.coordinates
	},
	{ match: /^(GPSAltitude|AbsoluteAltitude|RelativeAltitude)$/, level: 'red', why: WHY.altitude },
	{ match: /^(GPSImgDirection|GPSDestBearing|GPSTrack)$/, level: 'red', why: WHY.direction },
	{
		match:
			/^(City|State|Country|CountryCode|Location|LocationCreated|LocationShown|Sub-?location|Province-?State|Country-?Primary\w*|GPSAreaInformation)$/,
		level: 'red',
		why: WHY.place
	},
	{ match: /^(GPSDateStamp|GPSTimeStamp)$/, level: 'amber', why: WHY.gpsTime },
	{ match: /^GPSHPositioningError$/, level: 'amber', why: WHY.gpsOther },
	{ match: /^(CreatorContactInfo|Contact)$/, level: 'red', why: WHY.contact },
	{ match: /^(PersonInImage|FaceRegions|Regions|RegionList)$/, level: 'red', why: WHY.people },
	{
		match:
			/^(creator|Artist|By-?line|By-?lineTitle|XPAuthor|Credit|Source|Writer-?Editor|CaptionWriter|AuthorsPosition|publisher|contributor|Owner|Licensor|ImageCreator|CopyrightOwner)$/,
		level: 'red',
		why: WHY.person
	},
	{ match: /^(UsageTerms|WebStatement|Marked|License\w*)$/, level: 'amber', why: WHY.rights },
	{
		match:
			/^(Make|Model|UniqueCameraModel|LensMake|LensModel|LensInfo|LensSpecification|Lens|LensID)$/,
		level: 'amber',
		why: WHY.model
	},
	{ match: /^MakerNote$/, level: 'amber', why: WHY.makerNote },
	{
		match: /^(ImageUniqueID|ContentIdentifier|MediaGroupUUID|BurstUUID)$/,
		level: 'amber',
		why: WHY.uniqueId
	},
	{
		match: /^(DocumentID|InstanceID|OriginalDocumentID|DerivedFrom|History)$/,
		level: 'amber',
		why: WHY.fileIds
	},
	{
		match: /^(PreservedFileName|OriginalRawFileName|RawFileName)$/,
		level: 'amber',
		why: WHY.fileName
	},
	// A star rating: a number, not free text.
	{ match: /^(Rating|RatingPercent)$/, level: 'green' },
	// Camera Raw's edit settings: sliders, not people.
	{ match: /^crs:/, level: 'green' },
	{ match: /^Thumbnail$/, level: 'red', why: WHY.thumbnail },
	{ match: /^C2PA-person$/, level: 'red', why: WHY.c2paPerson },
	{ match: /^C2PA$/, level: 'amber', why: WHY.c2pa },
	{ match: /^AIText$/, level: 'amber', why: WHY.aiText },
	{ match: /^(DigitalSourceType|AI\w*)$/, level: 'amber', why: WHY.aiLabel },
	{ match: /^Unknown$/, level: 'amber', why: WHY.unknown }
];

/** A field no rule names takes its section's level (handoff section 3). */
const SECTION_DEFAULT: Record<SectionId, { level: Level; why?: string }> = {
	location: { level: 'amber', why: WHY.gpsOther },
	camera: { level: 'green' },
	datetime: { level: 'amber', why: WHY.date },
	author: { level: 'red', why: WHY.person },
	software: { level: 'amber', why: WHY.software },
	ai: { level: 'amber', why: WHY.c2pa },
	thumbnail: { level: 'red', why: WHY.thumbnail },
	other: { level: 'amber', why: WHY.freeText }
};

/** A copyright line with no name in it ("© 2024. All rights reserved.") is amber. */
const NAMELESS_NOTICE = /copyright|all rights reserved|\(c\)|©|\d|[^\p{L}]/giu;

/**
 * The level of one value. `technical` marks format bookkeeping the viewer
 * recognizes (EXIF version, pixel counts): green. Anything unrecognized is
 * amber, which the "other" default covers.
 */
export function levelOf(
	section: SectionId,
	key: string,
	value: string,
	technical = false
): { level: Level; why?: string } {
	if (/^(Copyright|CopyrightNotice|rights)$/.test(key)) {
		return value.replace(NAMELESS_NOTICE, '').length < 2
			? { level: 'amber', why: WHY.rights }
			: { level: 'red', why: WHY.person };
	}
	const rule = RULES.find((r) => r.match.test(key));
	if (rule) return { level: rule.level, why: rule.why };
	if (technical) return { level: 'green' };
	return SECTION_DEFAULT[section];
}

/** The highest level among `levels`, or null for none. */
export function highest(levels: Level[]): Level | null {
	return LEVEL_ORDER.find((l) => levels.includes(l)) ?? null;
}

type Rated = { id: SectionId; title: string; fields: { label: string; level: Level }[] };

export type Verdict = {
	level: Level | null;
	headline: string;
	/** What the headline counts, named. */
	detail: string;
	counts: Record<Level, number>;
};

const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const upperFirst = (s: string) => s[0].toUpperCase() + s.slice(1);

/**
 * The line above the sections (handoff section 4.1). A red "thing" is the
 * Location or Embedded thumbnail section as a whole, or each distinct red
 * field elsewhere (a serial number, a name); an amber "thing" is a section
 * holding amber values.
 */
export function verdict(sections: Rated[]): Verdict {
	const counts: Record<Level, number> = { red: 0, amber: 0, green: 0 };
	for (const s of sections) for (const f of s.fields) counts[f.level]++;

	const red: string[] = [];
	for (const s of sections) {
		const reds = s.fields.filter((f) => f.level === 'red');
		if (!reds.length) continue;
		if (s.id === 'location' || s.id === 'thumbnail') red.push(s.title);
		else
			for (const f of reds) {
				const name = lowerFirst(f.label.replace(/ \(extra image \d+\)$/, ''));
				if (!red.some((x) => x.toLowerCase() === name.toLowerCase())) red.push(name);
			}
	}
	if (red.length) {
		const n = red.length;
		return {
			level: 'red',
			headline: `${n} ${n === 1 ? 'thing in this photo identifies' : 'things in this photo identify'} you or your location.`,
			detail: upperFirst(red.join(', ')),
			counts
		};
	}
	const amber = sections
		.filter((s) => s.fields.some((f) => f.level === 'amber'))
		.map((s) => s.title);
	if (amber.length) {
		const n = amber.length;
		return {
			level: 'amber',
			headline: `Nothing here identifies you directly. ${n} ${n === 1 ? 'thing' : 'things'} could help identify you.`,
			detail: amber.join(', '),
			counts
		};
	}
	if (counts.green) {
		return {
			level: 'green',
			headline: 'Nothing here identifies you or your location.',
			detail: '',
			counts
		};
	}
	return {
		level: null,
		headline: 'This photo holds no metadata beyond what it needs to display.',
		detail: '',
		counts
	};
}
