// Card data for the /solutions index, and the source the /llms-full.txt
// endpoint lists the tool pages from.
//
// This lived inside `src/routes/solutions/+page.svelte` until /llms-full.txt
// needed the same list. Copying it would have created a second place to add a
// tool page and a first chance for the two to disagree, so the page imports it
// from here instead. Nothing else changed: the shape, the copy and the icon
// paths are exactly what the index rendered before.

export type SolutionTool = {
	name: string;
	slug: string;
	desc: string;
	iconPaths: string[];
	tag: string;
};

export const imageTools: SolutionTool[] = [
	{
		name: 'SDR to HDR Converter',
		slug: 'solutions/sdr-to-hdr',
		desc: 'Give any photo an Ultra HDR gain map - preserved when your camera captured one, generated when it did not.',
		iconPaths: [
			'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z'
		],
		tag: 'HDR'
	},
	{
		name: 'Background Remover (WebP)',
		slug: 'solutions/remove-background-webp',
		desc: 'Cut out the subject and download a transparent WebP — AI removal, full alpha, smaller than PNG.',
		iconPaths: [
			'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42'
		],
		tag: 'Cutout'
	},
	{
		name: 'Background Remover (AVIF)',
		slug: 'solutions/remove-background-avif',
		desc: 'Cut out the subject and download a transparent AVIF — the smallest transparent format, full alpha.',
		iconPaths: [
			'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42'
		],
		tag: 'Cutout'
	},
	{
		name: 'WebP to PDF',
		slug: 'solutions/webp-to-pdf',
		desc: 'Combine WebP (and PNG/JPG/AVIF) images into a single multi-page PDF — one page per image.',
		iconPaths: [
			'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
		],
		tag: 'PDF'
	},
	{
		name: 'JXL to PDF',
		slug: 'solutions/jxl-to-pdf',
		desc: 'Combine up to 20 JXL images into one PDF, a page per image, stored as standard JPEG so it opens anywhere.',
		iconPaths: [
			'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
		],
		tag: 'PDF'
	},
	{
		name: 'HEIC/HEIF to PDF',
		slug: 'solutions/heif-to-pdf',
		desc: 'Bundle iPhone and iPad photos into a shareable PDF — HEIC decoded at full quality, one page per photo.',
		iconPaths: [
			'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
		],
		tag: 'PDF'
	},
	{
		name: 'Bulk Square Cropper',
		slug: 'solutions/bulk-ai-square-cropper',
		desc: 'Crop a batch of images to a perfect square; AI finds the subject in each one and centers the crop on it.',
		iconPaths: [
			'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15'
		],
		tag: 'AI Crop'
	},
	{
		name: 'eBay Image Converter',
		slug: 'solutions/ebay-image-converter',
		desc: "Fix 'file not supported' errors and stay under the 12MB limit.",
		iconPaths: [
			'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z'
		],
		tag: 'Marketplace'
	},
	{
		name: 'HEIC to JPG',
		slug: 'heic-to-jpeg',
		desc: 'Instant iPhone photo conversion for universal compatibility.',
		iconPaths: [
			'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 9l1.5 1.5 3-3.75'
		],
		tag: 'Mobile'
	},
	{
		name: 'JPG to JXL',
		slug: 'jpg-to-jpegxl',
		desc: 'Re-encode JPEGs as JPEG XL, one high-quality path. Experimental because browser support for JXL is still uneven.',
		iconPaths: [
			'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z'
		],
		tag: 'Experimental'
	},
	{
		name: 'AVIF to JXL',
		slug: 'avif-to-jpegxl',
		desc: 'Decode AVIF and re-encode as JPEG XL, one high-quality path. Standard-range output.',
		iconPaths: ['M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5'],
		tag: 'Next-Gen'
	},
	{
		name: 'HIF to JPG Converter',
		slug: 'solutions/hif-to-jpg',
		desc: 'Convert Fuji, Canon & Sony HIF photos to universally compatible JPEGs.',
		iconPaths: [
			'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z',
			'M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z'
		],
		tag: 'Photography'
	},
	{
		name: 'HEIF to JPG Converter',
		slug: 'solutions/heif-to-jpg',
		desc: 'Convert any HEIF variant to JPG: .heif, .heic and .hif, mixed in one batch.',
		iconPaths: [
			'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
		],
		tag: 'Photography'
	},
	{
		name: 'AVIF to JPG Converter',
		slug: 'avif-to-jpg',
		desc: 'Turn modern AVIF files into high-quality JPEGs that work with every app and device.',
		iconPaths: [
			'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
		],
		tag: 'Web'
	},
	{
		name: 'HIF to AVIF Converter',
		slug: 'solutions/hif-to-avif',
		desc: 'Convert Fuji, Canon & Sony HIF photos to AVIF while preserving 10-bit quality.',
		iconPaths: [
			'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z',
			'M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z'
		],
		tag: 'Photography'
	},
	{
		name: 'SVG to WebP Converter',
		slug: 'solutions/svg-to-webp',
		desc: 'Rasterise SVG assets to WebP with transparency preserved — smaller than PNG, compatible everywhere.',
		iconPaths: [
			'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42'
		],
		tag: 'Design'
	},
	{
		name: 'SVG to AVIF Converter',
		slug: 'solutions/svg-to-avif',
		desc: 'Rasterise SVG files to AVIF — up to 50% smaller than PNG with full transparency support.',
		iconPaths: [
			'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42'
		],
		tag: 'Design'
	},
	{
		name: 'SVG to JPEG XL Converter',
		slug: 'solutions/svg-to-jxl',
		desc: 'Rasterise SVG files to JPEG XL — outstanding compression, lossless mode, and full transparency.',
		iconPaths: [
			'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z'
		],
		tag: 'Next-Gen'
	},
	{
		name: 'PNG to JXL',
		slug: 'solutions/png-to-jxl',
		desc: 'Re-encode PNG files as JPEG XL: high-quality compressed by default, pixel-exact lossless on request.',
		iconPaths: [
			'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
		],
		tag: 'Next-Gen'
	}
];

export const videoTools: SolutionTool[] = [
	{
		name: 'MP4 to WebM',
		slug: 'solutions/mp4-to-webm',
		desc: 'Convert MP4 to smaller, web-friendly WebM — 100% in your browser, nothing uploaded, free.',
		iconPaths: [
			'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z'
		],
		tag: 'Video'
	}
];
