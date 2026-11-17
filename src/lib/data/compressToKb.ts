// The "Compress image to N KB" tool pages: one entry per size page.
//
// Every figure is content-ops' own test of the live engine (handoff
// 2026-11-17-compress-to-kb-tool-pages-framework, section 7; ledger v117), so a
// number here is a published product claim. Change one only from a re-run of
// those tests. The four size pages share CompressToKbPage.svelte and differ
// only by this data, so a fix to the copy reaches all of them at once.

export type KbSize = {
	kb: number;
	slug: string;
	/** Title words after "Compress Image to {N}KB Online - ", following each
	 *  size's own search demand (content-ops SEO sweep 2026-11-17). */
	titleTail: string;
	/** 12 MP iPhone photo (about 4032 x 3024) at this size. */
	photo12: string;
	/** 24 MP iPhone photo (5712 x 4284) at this size. */
	photo24: string;
	/** Phone photo of a printed page: dimensions, and how the text reads. */
	printed: string;
	printedNote: string;
	/** How the small print reads, for the "Will text stay readable" answer. */
	printedReads: string;
	/** "N to N" percent of width and height a phone photo kept. */
	scale: string;
	/** Smallest and largest result in the tests, in KB. */
	resultLow: number;
	resultHigh: number;
	/** Lower bound of the range example ("20KB to 50KB"). */
	rangeLow: number;
	mb: string;
	/** The sentence closing the "What a photo looks like" section. */
	look: string;
	/** Short form of `look`, for the general page's table. */
	lookShort: string;
};

export const kbSizes: KbSize[] = [
	{
		kb: 20,
		slug: 'compress-image-to-20kb',
		titleTail: 'Resize Photo Free',
		photo12: '626 x 470',
		photo24: '655 x 490',
		printed: '680 x 900',
		printedNote: 'legible but rough',
		printedReads: 'legible but rough',
		scale: '12 to 16%',
		resultLow: 18,
		resultHigh: 19,
		rangeLow: 10,
		mb: '0.02MB',
		look: 'At this size a photo is small and soft, fine as a thumbnail or a form photo.',
		lookShort: 'Small and soft; fine as a thumbnail or a form photo'
	},
	{
		kb: 50,
		slug: 'compress-image-to-50kb',
		titleTail: 'Resize JPG Free',
		photo12: '1095 x 821',
		photo24: '1150 x 860',
		printed: '1100 x 1470',
		printedNote: 'small print still readable',
		printedReads: 'readable',
		scale: '20 to 27%',
		resultLow: 45,
		resultHigh: 48,
		rangeLow: 20,
		mb: '0.05MB',
		look: "At this size a photo looks fine on a phone screen or in a form's preview, and soft if you zoom in.",
		lookShort: 'Fine on a phone screen, soft if you zoom in'
	},
	{
		kb: 100,
		slug: 'compress-image-to-100kb',
		titleTail: 'Resize Photo Free',
		photo12: '1668 x 1251',
		photo24: '1700 x 1275',
		printed: '1730 x 2300',
		printedNote: 'small print clear',
		printedReads: 'clear',
		scale: '30 to 41%',
		resultLow: 91,
		resultHigh: 95,
		rangeLow: 50,
		mb: '0.1MB',
		look: 'At this size a photo is sharp on a phone screen.',
		lookShort: 'Sharp on a phone screen'
	},
	{
		kb: 200,
		slug: 'compress-image-to-200kb',
		titleTail: 'Resize JPG Free',
		photo12: '2722 x 2042',
		photo24: '2560 x 1920',
		printed: '2620 x 3500',
		printedNote: 'small print clear',
		printedReads: 'clear',
		scale: '45 to 68%',
		resultLow: 190,
		resultHigh: 196,
		rangeLow: 100,
		mb: '0.2MB',
		look: 'At this size a photo is sharp on most screens.',
		lookShort: 'Sharp on most screens'
	}
];

export const GENERAL_SLUG = 'reduce-image-size-in-kb';
