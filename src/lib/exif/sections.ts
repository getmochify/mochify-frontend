// The EXIF tools' sections and essentials, in the wording of content-ops'
// build brief 2026-11-18 (sections 5 and 6). Change them through content-ops.
// Kept apart from report.ts so a page can list them without loading exifr.

export type SectionId =
	'location' | 'camera' | 'datetime' | 'author' | 'software' | 'ai' | 'thumbnail' | 'other';

export const SECTIONS: { id: SectionId; title: string; blurb: string }[] = [
	{
		id: 'location',
		title: 'Location',
		blurb: 'Where the photo was taken: GPS coordinates, altitude, direction and place names.'
	},
	{
		id: 'camera',
		title: 'Camera and lens',
		blurb: 'The camera or phone, the lens, serial numbers and the exposure settings.'
	},
	{
		id: 'datetime',
		title: 'Date and time',
		blurb: 'When the photo was taken, digitized and last changed, with time zone offsets.'
	},
	{
		id: 'author',
		title: 'Author and copyright',
		blurb: 'Names, copyright notices, credits and contact details.'
	},
	{
		id: 'software',
		title: 'Software and edit history',
		blurb: 'The apps that made or edited the file, their settings and its history.'
	},
	{
		id: 'ai',
		title: 'AI labels and Content Credentials',
		blurb: 'Content Credentials (C2PA) and labels or prompts left by AI tools.'
	},
	{
		id: 'thumbnail',
		title: 'Embedded thumbnail',
		blurb:
			'A small preview stored inside the file. It can show the photo as it was before a crop or edit.'
	},
	{
		id: 'other',
		title: 'Other',
		blurb: 'Comments, captions, keywords and any block this viewer does not recognize.'
	}
];

export const REASONS = {
	orientation: 'Without it, a photo taken on a phone can display sideways.',
	color: 'Without it, colors can look dull or shifted on other screens.',
	gainMap: 'It is part of how the photo looks on an HDR screen.',
	density: 'It sets the print size. It says nothing about you.'
};
