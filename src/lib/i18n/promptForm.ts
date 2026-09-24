// The localisable strings of PromptFormApp: the ones a visitor reads.
//
// This is a seam, not a framework. There is no message catalogue, no runtime
// locale lookup and no build step: a page that wants another language passes
// the strings it overrides, and everything else falls back to English. The
// alternative was forking the component per locale, which is what CLAUDE.md
// tells us not to do and what forced every change to be made twice last time.
//
// Prompts are deliberately NOT in here. What a visitor types goes to the parser
// as they wrote it, and the chips that pre-write a prompt are copy owned by
// content-ops per locale (see `showSuggestionChips` in PromptFormApp).

export type PromptFormStrings = {
	/** Hint beside the + button before any file is chosen. */
	uploadButton: string;
	/** Rotating placeholders for the compose box, image mode. One entry means no rotation. */
	imagePlaceholders: string[];
	/** The two chips that open a menu rather than filling the box. */
	convertToLabel: string;
	rotateLabel: string;
	/** The three failure messages a visitor can actually hit from the compose box. */
	errorParse: string;
	errorServer: string;
	errorConnection: (fileName: string) => string;
	/**
	 * The prompt chips: a label and the prompt it writes into the box. Both are
	 * copy, and the prompt is copy that gets parsed, so a locale supplies its own
	 * rather than having the English one translated at the last moment. The dot
	 * colour is presentational and shared.
	 */
	imageSuggestions: { label: string; prompt: string; dot: string }[];
	/** The attachment line before anything is attached. */
	noFilesYet: string;
	/**
	 * The help tooltip behind the `?` beside the send button.
	 *
	 * The format lists are NOT in here. JPG, WebP, MP4 and the rest are product
	 * nouns that read the same in every language, like the tier names in the
	 * pricing set; only the sentences around them are copy.
	 *
	 * The "how it works" body deliberately never names a language. The English
	 * original says "in plain English", and the obvious translation would be
	 * "en français" or "日本語で", which is exactly the claim the localised pages
	 * are not allowed to make until the parse test has run (manual §6). Each one
	 * says "in one sentence" instead, which is what the copy sheets themselves
	 * say and is true today.
	 */
	infoHowLabel: string;
	infoHowBody: string;
	infoFormatsLabel: string;
	infoPdfLabel: string;
	infoPdfBody: string;
	infoAvLabel: string;
	/** Follows the codec list, so it opens mid-sentence. */
	infoAvBody: string;
};

export const EN_PROMPT_FORM_STRINGS: PromptFormStrings = {
	uploadButton: 'Add images, PDFs, or video',
	imagePlaceholders: [
		'remove bg, avif and webp, 1200px, 800px…',
		'Remove background, square crop, shopify…',
		'avif and webp, 1200px, 800px, 500px…',
		'Convert to webp, resize width 800px and 600px…',
		'vinted, compress, 1080x1080 and 500px…'
	],
	convertToLabel: 'Convert to…',
	rotateLabel: 'Rotate…',
	errorParse: "Couldn't quite understand that — try again, or rephrase and resubmit.",
	errorServer: 'Something went wrong on our end — please try again in a moment.',
	errorConnection: (fileName: string) =>
		`Lost connection while processing ${fileName} — check your internet and try again.`,
	noFilesYet: 'No files yet',
	infoHowLabel: 'How it works',
	infoHowBody:
		'Describe what you want in plain English, attach your images, then hit send. The AI reads your prompt and processes each file automatically.',
	infoFormatsLabel: 'Accepted formats',
	infoPdfLabel: 'PDF tools',
	infoPdfBody:
		'Rasterize pages to images (PNG, JPG, WebP…) or split a PDF into individual page files.',
	infoAvLabel: 'Video & audio',
	infoAvBody: '— converted entirely in your browser, nothing uploaded.',
	imageSuggestions: [
		{
			label: 'Remove BG',
			prompt: 'Remove the background and convert to PNG',
			dot: 'bg-purple-400'
		},
		{
			label: 'eBay',
			prompt: 'Optimize for eBay listings — square crop, convert to JPEG',
			dot: 'bg-[#3665F3]'
		},
		{
			label: 'Vinted',
			prompt: 'Optimize for Vinted listings — square crop, compress',
			dot: 'bg-[#007782]'
		},
		{
			label: 'Square crop',
			prompt: 'Smart-crop to square, centering the main subject',
			dot: 'bg-[#66BB6A]'
		},
		{
			label: 'PageSpeed',
			prompt: 'Fix my PageSpeed — convert to WebP and compress for fast load times',
			dot: 'bg-[#4285F4]'
		},
		{
			label: 'To PDF',
			prompt: 'Combine into a single PDF',
			dot: 'bg-rose-400'
		}
	]
};
