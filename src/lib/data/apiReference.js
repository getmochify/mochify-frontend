// Single source of truth for everything factual on /docs and in /llms-full.txt.
//
// Before this file existed, the API reference lived twice: once as hand-written
// markup inside `src/routes/docs/+page.svelte`, and once as hand-written prose
// in `static/llms.txt`. Two copies of a parameter default is two chances to be
// wrong, and the v16-v18 llms.txt episode (a hand-maintained file that was
// never the one being served) is the reason the /llms-full.txt handoff made
// "generated from source, never hand-edited" a condition rather than a
// preference. So the facts live here, the docs page renders them, and the
// /llms-full.txt endpoint renders the same objects as plain text.
//
// Editing rules for this file:
//   - It IS the docs content. Change a default here and both surfaces change.
//   - `description` fields are small HTML fragments (<code>, <em>, <strong>,
//     <a href>). The docs page renders them with {@html}; the text renderer in
//     `src/lib/server/llmsFull.ts` strips the tags. Keep the markup to those
//     few elements and no classes, or the two renderings drift apart.
//   - No em dashes. The text renderer strips them defensively, but they should
//     never be written here in the first place (content-ops house rule).
//   - Claims are checked against `product-facts-ledger.md` in the content-ops
//     repo. When the two disagree, the ledger wins unless the live /pricing
//     page says otherwise (the pricing-page-wins rule).

/**
 * A parameter row. `description` is the first paragraph; `valuesNote` is the
 * smaller muted line under it that lists allowed values; `more` is a second
 * full paragraph for the ones that need the reasoning as well as the rule.
 * The docs page renders the three as they always looked; the text renderer
 * joins them into one line.
 *
 * @typedef {{ name: string, default?: string, alias?: string, description: string, valuesNote?: string, more?: string }} Param
 */
/** @typedef {{ name: string, description: string, type?: string }} Field */

export const API_BASE_URL = 'https://api.mochify.app';

export const auth = {
	header: 'Authorization: Bearer mchy_••••••••••••••••',
	// Ledger v17 and the §4.1 checklist: Bearer is the documented scheme. The
	// engine also still accepts an `x-api-key` header, but it is not documented
	// on any surface and must not appear in copy or in the OpenAPI schema.
	scheme: 'Authorization: Bearer <key>',
	keyPrefix: 'mchy_',
	summary:
		'The free tier requires no authentication. API keys are generated from your <a href="/dashboard">dashboard</a> and passed as a Bearer token.',
	notes: [
		'API keys are shown once at creation and cannot be retrieved again. Store them securely. You can regenerate a key from your dashboard at any time.'
	]
};

/**
 * Plan limits. Prices are NOT duplicated here: they come from `USD_PRICES` in
 * `src/lib/currency.ts`, which is what every pricing surface already reads, so
 * a repricing cannot leave this file stale.
 */
export const plans = [
	{
		name: 'Free',
		priceKey: null,
		opsPerMonth: '25 with a free account, 3 per month with no account (by IP address)',
		maxFileSize: '20MB',
		batch: 3,
		notable:
			'All formats, resize, rotate, crop, background removal, MCP and API access, Magic Flow. Images to PDF only, capped at 3 images.'
	},
	{
		name: 'Seller',
		priceKey: 'sellerMonthly',
		yearlyKey: 'sellerYearly',
		opsPerMonth: '300',
		maxFileSize: '75MB',
		batch: 25,
		notable:
			'Priority queue, full PDF tools, and results written straight to your own S3, R2 or S3-compatible bucket.'
	},
	{
		name: 'Pro',
		priceKey: 'proMonthly',
		yearlyKey: 'proYearly',
		opsPerMonth: '1,200',
		maxFileSize: '75MB',
		batch: 25,
		notable: 'Everything in Seller, plus top priority queue and priority email support.'
	},
	{
		name: 'Growth',
		priceKey: 'growthMonthly',
		yearlyKey: 'growthYearly',
		opsPerMonth: '5,000',
		maxFileSize: '75MB',
		batch: 25,
		notable:
			'Everything in Pro, plus unlimited PDF pages within the 200-page ceiling and PDFs built from up to 200 images.'
	},
	{
		name: 'Day Pass',
		priceKey: 'dayPass',
		opsPerMonth: '100 uploads within 24 hours',
		maxFileSize: '75MB',
		batch: 25,
		notable:
			'One-time, no subscription and no account needed (activated by magic link). The allowance is separate from a tier allowance rather than replacing it. Bring your own bucket is not included, because a pass has no account to attach a bucket to.'
	}
];

export const planNotes = [
	'Annual plans save 17%.',
	'One operation is one output image, whatever number of transformations produced it. A request for several formats or sizes of one file returns several images and costs one operation per output.',
	'MCP and API access are included on every tier, including Free. Background removal is available on every tier, including Free.',
	'Unused monthly operations do not roll over.'
];

/** @type {Param[]} */
export const squishParams = [
	{
		name: 'type',
		default: 'jpg',
		description: 'Output format.',
		valuesNote:
			'One of: <code>jpg</code> · <code>webp</code> · <code>avif</code> · <code>jxl</code>'
	},
	{
		name: 'width',
		description:
			'Target width in pixels. Aspect ratio is preserved unless <code>smartCrop</code> is also set. Omit or set to <code>0</code> for unconstrained.'
	},
	{
		name: 'height',
		description: 'Target height in pixels. Omit or set to <code>0</code> for unconstrained.'
	},
	{
		name: 'quality',
		default: 'auto',
		description:
			'Output quality override (1–100). Overrides smart compression. JXL maps linearly, so 70 is about distance 3.0. <code>100</code> is the best <em>lossy</em> setting, not lossless: see <code>lossless</code>.'
	},
	{
		name: 'smartCompress',
		default: 'false',
		description:
			'Saliency-guided quality selection. High-detail subjects get higher quality, flat areas lower. Accepts <code>1</code> or <code>true</code>.'
	},
	{
		name: 'smartCrop',
		alias: 'crop',
		default: 'false',
		description:
			'Saliency-guided crop, centered on the detected subject. Requires both <code>width</code> and <code>height</code>. Accepts <code>1</code> or <code>true</code>.'
	},
	{
		name: 'removeBackground',
		default: 'false',
		description:
			'AI background removal. Output is PNG or WebP with an alpha channel; JPEG outputs flatten to white. Available on every plan, including Free. Accepts <code>1</code> or <code>true</code>.'
	},
	{
		name: 'rotate',
		default: '0',
		description: 'Clockwise rotation in degrees.',
		valuesNote: 'Supported values: <code>90</code> · <code>180</code> · <code>270</code>'
	},
	{
		name: 'stripExif',
		default: 'true',
		description:
			'Strip EXIF metadata from the output. Set to <code>false</code> or <code>0</code> to preserve metadata.'
	},
	{
		name: 'optimizeForWeb',
		default: 'false',
		description:
			'Progressive encoding plus 4:2:0 chroma subsampling for the smallest browser-delivered file. Accepts <code>1</code> or <code>true</code>.'
	},
	{
		name: 'brightness',
		default: '0',
		description:
			'Exposure adjustment. Range <code>-100</code> (darkest) to <code>+100</code> (brightest). <code>0</code> is no change.'
	},
	{
		name: 'clarity',
		default: 'false',
		description:
			'Midtone contrast enhancement: makes images look crisper without affecting overall exposure. Accepts <code>1</code> or <code>true</code>.'
	},
	{
		name: 'hdr',
		default: 'false',
		description:
			'Ultra HDR / ISO 21496-1 gain map handling. <code>1</code> or <code>true</code> <strong>preserves</strong> a gain map the source already has and never invents one, so it is ignored if the source is not HDR. <code>generate</code> does that <em>and</em> <strong>synthesizes</strong> a gain map when the source is plain SDR.',
		more: 'Only <code>jpg</code> output can carry a gain map (<code>jxl</code> carries HDR by a different route; <code>avif</code>, <code>webp</code> and <code>png</code> cannot). Skipped when combined with <code>brightness</code>, <code>clarity</code> or <code>removeBackground</code>, since those change the base the gain map is a ratio to. Check <code>X-Mochify-HDR</code> for what was actually emitted.'
	},
	{
		name: 'lossless',
		default: 'false',
		description:
			'Pixel-exact output. Accepts <code>1</code> or <code>true</code>, and overrides <code>quality</code> and <code>smartCompress</code>.',
		more: 'Only <code>jxl</code>, <code>webp</code> and <code>png</code> can honor it: <code>jpg</code> and <code>avif</code> are rejected with a <code>400</code> rather than silently encoded lossy. A source that is <em>already</em> lossy (JPEG, AVIF, HEIC) is re-encoded at the highest lossy setting instead, since nothing can restore what that file already discarded. Expect the output to be <strong>larger</strong> than the input: lossless preserves pixels, not file size. Check <code>X-Mochify-Lossless</code> for what was actually emitted.'
	},
	{
		name: 'targetBytes',
		description:
			'Ceiling on the output file size, in bytes. An <strong>upper bound</strong>, never a size to pad up to \u2014 if the requested quality already fits, that encode is returned untouched.',
		more: 'No encoder can predict a compressed size without encoding, and no quality value maps to one: bytes at a fixed quality are a property of the <em>pixels</em>, spanning roughly 3\u00d7 (JPEG) to 10\u00d7 (AVIF) between a flat graphic and a detailed photo at identical dimensions. So this measures instead \u2014 typically 1\u20133 encodes, at most 5, extrapolating from each real measurement rather than bisecting. Minimum <code>1024</code>. Cannot be combined with <code>lossless</code> (a <code>400</code>): a pixel-exact file is whatever size it is. Applies <strong>per output</strong>, so a multi-variant request means every variant fits, not that they sum to it. Check <code>X-Mochify-Target</code> for whether the ceiling was actually reached.'
	},
	{
		name: 'targetLever',
		default: 'both',
		description:
			'Which knob <code>targetBytes</code> may turn: <code>quality</code> (re-encode lower, never resize), <code>dimensions</code> (downscale, never change quality), or <code>both</code> (quality first, then downscale).',
		more: 'Requires <code>targetBytes</code>. <code>quality</code> is a <code>400</code> for <code>png</code> output, which has no quality control at all \u2014 use <code>dimensions</code> or <code>both</code>, where scaling is the only lever anyway. The <code>dimensions</code> lever is also withheld when an HDR gain map is being carried (<code>hdr=1</code> on an Ultra HDR source), because resizing the base would invalidate the map: quality alone is used, and the target may report <code>floor</code>. When the lever moves, <code>X-Mochify-Target-Scale</code> reports how far.'
	}
];

/** @type {Field[]} */
export const squishRequestHeaders = [
	{
		name: 'Content-Type',
		description:
			'MIME type of the uploaded image. For example <code>image/jpeg</code>, <code>image/webp</code>, <code>image/avif</code>, <code>image/png</code>, <code>image/heic</code>, <code>image/jxl</code>.'
	}
];

/** @type {Field[]} */
export const squishResponse = [
	{
		name: 'Body',
		description:
			'Raw compressed image bytes. Supported input formats: JPEG, PNG, WebP, AVIF, HEIF, JXL.'
	},
	{ name: 'X-Latency-Ms', description: 'Processing time in milliseconds.' },
	{
		name: 'X-Mochify-Optimized',
		description:
			'<code>true</code> if the output is smaller or the format changed; <code>false</code> if the original was returned unchanged.'
	},
	{
		name: 'X-Mochify-Reason',
		description:
			'Present when <code>X-Mochify-Optimized: false</code>. Explains why the original was returned, for example <em>"Original was smaller"</em>.'
	},
	{
		name: 'X-Mochify-Saliency',
		description: 'Saliency score (0.000–1.000). Only present when <code>smartCompress=true</code>.'
	},
	{
		name: 'X-Mochify-Target',
		description:
			'Present only when <code>targetBytes</code> was set. <code>hit</code> = the returned bytes are at or under the ceiling. <code>floor</code> = the levers ran out first, and this is the smallest output that could honestly be produced \u2014 still a real, usable image, not an error. For a multi-variant ZIP, <code>hit</code> means every entry fits. <strong>Worth checking:</strong> a <code>floor</code> response is a <code>200</code>, so it is otherwise indistinguishable from success.'
	},
	{
		name: 'X-Mochify-Target-Encodes',
		description:
			'How many encodes the size search spent, including the first one the pipeline would have performed anyway. Summed across variants for a ZIP.'
	},
	{
		name: 'X-Mochify-Target-Scale',
		description:
			'Extra downscale the <code>dimensions</code> lever applied, relative to the geometry that was requested (for example <code>0.710</code>). Omitted when the lever did not move, i.e. the output is exactly the size asked for.'
	},
	{
		name: 'X-Mochify-Quality',
		description: 'Effective quality value used. Only present when <code>smartCompress=true</code>.'
	},
	{
		name: 'X-Mochify-BgRemoved',
		description: '<code>true</code> when background removal was applied.'
	},
	{
		name: 'X-Mochify-HDR',
		description:
			'Only present when <code>hdr</code> was requested. <code>true</code> means the emitted file carries headroom the source captured, <code>generated</code> means headroom Mochify synthesized, <code>false</code> means the output carries none. It describes the bytes actually returned, so a format that cannot hold a gain map reports <code>false</code> even when the source was HDR.'
	},
	{
		name: 'X-Mochify-Lossless',
		description:
			'Only present when <code>lossless</code> was requested. <code>true</code> means the returned bytes reproduce the submitted pixels exactly; <code>downgraded</code> means they are the best lossy encode instead, because the source was already lossy or because HDR reconstruction replaced the submitted pixels.'
	}
];

export const squishExamples = [
	{
		label: 'cURL',
		language: 'bash',
		code: `curl -X POST "https://api.mochify.app/v1/squish?type=webp&stripExif=1" \\
  -H "Content-Type: image/jpeg" \\
  -H "Authorization: Bearer mchy_your_api_key" \\
  --data-binary @photo.jpg \\
  --output photo.webp`
	},
	{
		label: 'JavaScript',
		language: 'javascript',
		code: `const file = document.querySelector('input[type="file"]').files[0];

const response = await fetch(
  'https://api.mochify.app/v1/squish?type=avif&stripExif=1',
  {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      'Authorization': 'Bearer mchy_your_api_key',
    },
    body: file,
  }
);

const blob = await response.blob();
const latency = response.headers.get('X-Latency-Ms');

// Save the file
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'output.avif';
a.click();`
	},
	{
		label: 'Python',
		language: 'python',
		code: `import requests

with open('photo.jpg', 'rb') as f:
    response = requests.post(
        'https://api.mochify.app/v1/squish',
        params={'type': 'webp', 'stripExif': '1'},
        headers={
            'Content-Type': 'image/jpeg',
            'Authorization': 'Bearer mchy_your_api_key',
        },
        data=f,
    )

with open('output.webp', 'wb') as out:
    out.write(response.content)

print(f"Done in {response.headers.get('X-Latency-Ms')}ms")`
	}
];

export const pdfOps = [
	{
		op: 'optimize',
		returns: 'PDF',
		description:
			'Recompress the images inside a PDF, in place, and return a smaller PDF. Text, fonts, vector art, links and layout are untouched, so the document stays searchable.'
	},
	{
		op: 'extract',
		returns: 'ZIP',
		description:
			'Pull the images embedded in a PDF out of it, at the resolution they were stored at. These are the pictures somebody placed into the document, not a render of each page.'
	},
	{
		op: 'rasterize',
		returns: 'ZIP',
		description:
			'Render every page to an image, text and all. The default operation when <code>op</code> is omitted.'
	},
	{
		op: 'split',
		returns: 'ZIP',
		description: 'Explode a PDF into one single-page PDF per page. Takes no parameters.'
	},
	{
		op: 'create',
		returns: 'PDF',
		description:
			'Build a PDF from images, one page per image in upload order. Send a single raw image body, or a <code>multipart/form-data</code> upload with each file appended as <code>images</code>.'
	}
];

export const pdfJpegNote =
	'<strong>Images inside a PDF are always JPEG.</strong> The PDF format has no WebP, AVIF or JXL, so <code>op=optimize</code> re-encodes with jpegli and nothing else is offered. Those formats <em>are</em> available from <code>op=extract</code>, which writes files out rather than back into the document.';

/** @type {Record<string, Param[]>} */
export const pdfParams = {
	optimize: [
		{
			name: 'quality',
			default: '75',
			description: 'jpegli quality for the re-encode (1–100). Lower is smaller.'
		},
		{
			name: 'maxDpi',
			default: '150',
			description:
				'Target resolution, measured against how large each image is actually <em>drawn</em> on the page rather than how many pixels it stores. Use 96 for screen and email, 150 for general use, 300 to keep print quality. Set <code>0</code> to disable and rely on <code>maxDimension</code> alone.',
			more: 'A 4000px photo placed in a two-inch box is 2000 DPI of waste; the same photo full-bleed on A4 is not. Only the drawn size can tell those apart, so it is read from the content stream. An image drawn at several sizes is targeted at its largest, never its average.'
		},
		{
			name: 'maxDimension',
			default: '2000',
			description:
				'Absolute backstop applied alongside <code>maxDpi</code>: no image keeps a side longer than this. It is what limits an image the placement scan never saw drawn. Set <code>0</code> to remove the cap.',
			more: 'Resizing is layout-safe: a PDF image is drawn into the unit square, so changing its pixel size cannot move or rescale it on the page.'
		},
		{
			name: 'minSize',
			default: '64',
			description:
				'Leave images smaller than this (on either axis) untouched. Keeps spacers, rules and bullet glyphs out of the work.'
		}
	],
	extract: [
		{
			name: 'type',
			default: 'original',
			description: 'Output format for the extracted files.',
			valuesNote:
				'One of: <code>original</code> · <code>png</code> · <code>jpg</code> · <code>webp</code> · <code>avif</code> · <code>jxl</code>',
			more: '<code>original</code> copies each embedded JPEG out byte-for-byte, with no re-encode and no quality loss; images stored in other encodings come out as lossless PNG. Setting <code>maxWidth</code> forces a re-encode.'
		},
		{
			name: 'quality',
			default: '82',
			description: 'Output quality (1–100). Ignored for <code>original</code> and <code>png</code>.'
		},
		{
			name: 'maxWidth',
			default: '0',
			description:
				'Cap the width of each extracted image, preserving aspect ratio. <code>0</code> leaves sizes alone.'
		},
		{
			name: 'minSize',
			default: '64',
			description:
				'Skip images smaller than this on either axis. Exported PDFs are full of 1×1 spacers and hairline rules; without a floor the archive is mostly junk. Set <code>0</code> to take everything.'
		}
	],
	rasterize: [
		{
			name: 'type',
			default: 'png',
			description: 'Output image format for each rendered page.',
			valuesNote:
				'One of: <code>png</code> · <code>jpg</code> · <code>webp</code> · <code>avif</code> · <code>jxl</code>'
		},
		{
			name: 'dpi',
			default: '150',
			description: 'Render resolution, 36–300. Use 72 for screen previews, 300 for print.'
		},
		{
			name: 'quality',
			default: '82',
			description: 'Output quality (1–100). Ignored for <code>png</code>.'
		}
	],
	create: [
		{
			name: 'page',
			default: 'fit',
			description:
				'Page size. <code>fit</code> makes each page exactly the image, with no whitespace.',
			valuesNote: 'One of: <code>fit</code> · <code>a4</code> · <code>letter</code>'
		},
		{
			name: 'quality',
			default: '82',
			description: 'jpegli quality (1–100) for the JPEG embedded in each page.'
		},
		{
			name: 'dpi',
			default: '96',
			description: 'Pixels per inch used to size a <code>fit</code> page, 36–600.'
		},
		{
			name: 'maxWidth',
			default: '0',
			description:
				'Downscale images wider than this before embedding. <code>0</code> leaves them alone.'
		},
		{
			name: 'combine',
			default: '1',
			description:
				'Set to <code>0</code> to get one single-page PDF per image, returned as a ZIP, instead of one combined document.'
		}
	]
};

export const pdfOptimizeNotes = [
	'<strong>It never returns a larger file.</strong> If recompression would not help, the original bytes come back and <code>X-Mochify-Saved-Pct</code> is <code>0</code>. Running it twice changes nothing.',
	'<strong>It never drops what it cannot handle.</strong> Images in encodings outside the supported set (CMYK, indexed palettes, JPEG 2000, CCITT and JBIG2 scans, stencil masks) are passed through byte-for-byte rather than skipped.'
];

export const pdfExtractNote =
	'An image repeated across pages, such as a logo or letterhead, is returned once rather than once per page. Files are named <code>page-003-image-002.webp</code>, recording the page each image was first found on.';

/** @type {Param[]} */
export const pdfStorageParams = [
	{
		name: 'dest',
		description:
			'Write the result to your connected storage instead of returning it. One of <code>bucket</code> or <code>drive</code>. The response becomes a JSON receipt, <code>{ "stored": true, ... }</code>, and the bytes go straight from Mochify to your storage rather than back through the browser.',
		more: 'Only the operations that produce a single file accept it: <code>op=optimize</code>, and <code>op=create</code> with <code>combine=1</code>. <code>extract</code>, <code>rasterize</code>, <code>split</code> and <code>combine=0</code> return an archive and are refused with a 400 rather than filed under a made-up name.'
	},
	{
		name: 'name',
		description:
			'Required whenever <code>dest</code> is set. The destination filename, including extension. Without it every file in a batch would derive the same fallback name and overwrite each other.'
	}
];

export const pdfStorageNote =
	'Requires a signed-in account with that destination connected in the <a href="/dashboard">dashboard</a>; an anonymous request gets a 401. If the write fails, the file is returned as a normal download with an <code>X-Mochify-Bucket-Error</code> header rather than erroring, so a storage problem never costs you the work.';

export const pdfLimits = [
	{
		name: 'Plan access',
		description:
			'<code>optimize</code>, <code>extract</code>, <code>rasterize</code> and <code>split</code> require a paid plan (Seller, Pro, Growth, or Day Pass). <code>create</code> is available on every plan, including Free.'
	},
	{ name: 'Request body', description: '100 MB maximum.' },
	{
		name: 'Pages',
		description:
			'200 absolute. For the PDF-in operations, Growth is unlimited within that and other paid plans cap at 10 pages.'
	},
	{
		name: 'Images per <code>create</code>',
		description: 'Free 3, Seller / Pro / Day Pass 10, Growth 200.'
	},
	{ name: 'Cost', description: 'One operation per request, whatever the page or image count.' }
];

/** @type {Field[]} */
export const pdfResponseHeaders = [
	{ name: 'X-Latency-Ms', description: 'Processing time in milliseconds. All operations.' },
	{
		name: 'X-Mochify-Pages',
		description: 'Pages processed. <code>rasterize</code>, <code>split</code>, <code>create</code>.'
	},
	{
		name: 'X-Mochify-Images',
		description: 'Images returned in the archive. <code>extract</code>.'
	},
	{
		name: 'X-Mochify-Skipped',
		description:
			'Images skipped for being too small, too large, or in an encoding that cannot be extracted. <code>extract</code>.'
	},
	{
		name: 'X-Mochify-Duplicates',
		description: 'Repeat references to an image already returned once. <code>extract</code>.'
	},
	{
		name: 'X-Mochify-Images-Recompressed',
		description: 'Images actually replaced. <code>optimize</code>.'
	},
	{
		name: 'X-Mochify-Images-Kept',
		description:
			'Images left as they were, either because recompressing them would not have saved enough or because they were outside the supported set. <code>optimize</code>.'
	},
	{
		name: 'X-Mochify-Original-Bytes',
		description: 'Size of the submitted PDF. <code>optimize</code>.'
	},
	{
		name: 'X-Mochify-Saved-Pct',
		description:
			'Percentage saved, as a whole number. <code>0</code> means the original was returned unchanged. <code>optimize</code>.'
	}
];

export const pdfExamples = [
	{
		label: 'cURL · compress a PDF',
		language: 'bash',
		code: `curl -X POST "https://api.mochify.app/v1/pdf?op=optimize&quality=75&maxDpi=150" \\
  -H "Content-Type: application/pdf" \\
  -H "Authorization: Bearer mchy_your_api_key" \\
  --data-binary @report.pdf \\
  --output report-compressed.pdf \\
  --dump-header -
# X-Mochify-Images-Recompressed: 12
# X-Mochify-Saved-Pct: 47`
	},
	{
		label: 'cURL · extract the images as WebP',
		language: 'bash',
		code: `curl -X POST "https://api.mochify.app/v1/pdf?op=extract&type=webp&maxWidth=1600" \\
  -H "Content-Type: application/pdf" \\
  -H "Authorization: Bearer mchy_your_api_key" \\
  --data-binary @brochure.pdf \\
  --output images.zip
# Omit type= to get the embedded images byte-for-byte, with no re-encode.`
	},
	{
		label: 'JavaScript · compress and report the saving',
		language: 'javascript',
		code: `const file = document.querySelector('input[type="file"]').files[0];
const response = await fetch(
  'https://api.mochify.app/v1/pdf?op=optimize&quality=75',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/pdf',
      'Authorization': 'Bearer mchy_your_api_key',
    },
    body: file,
  }
);
const blob = await response.blob();
const saved = response.headers.get('X-Mochify-Saved-Pct');
// 0 means the PDF was already well compressed and came back untouched.
console.log(saved === '0' ? 'Already optimal' : \`Saved \${saved}%\`);`
	},
	{
		label: 'Python · render pages to PNG',
		language: 'python',
		code: `import requests, zipfile, io
with open('report.pdf', 'rb') as f:
    response = requests.post(
        'https://api.mochify.app/v1/pdf',
        params={'op': 'rasterize', 'type': 'png', 'dpi': '300'},
        headers={
            'Content-Type': 'application/pdf',
            'Authorization': 'Bearer mchy_your_api_key',
        },
        data=f,
    )
zipfile.ZipFile(io.BytesIO(response.content)).extractall('pages/')
print(f"{response.headers.get('X-Mochify-Pages')} pages rendered")`
	},
	{
		label: 'cURL · build a PDF from images',
		language: 'bash',
		code: `curl -X POST "https://api.mochify.app/v1/pdf?op=create&page=a4" \\
  -H "Authorization: Bearer mchy_your_api_key" \\
  -F "images=@page1.jpg" \\
  -F "images=@page2.jpg" \\
  -F "images=@page3.jpg" \\
  --output album.pdf`
	}
];

/** @type {Field[]} */
export const checkTokensFields = [
	{
		name: 'remaining',
		type: 'number',
		description: 'Total remaining operations for the current IP or API key.'
	},
	{
		name: 'available',
		type: 'boolean',
		description: '<code>true</code> if at least one operation remains.'
	}
];

export const endpoints = [
	{
		id: 'squish',
		method: 'POST',
		path: '/v1/squish',
		summary:
			'Compress and/or convert a single image. Send the raw image bytes as the request body. Returns the processed image as a binary blob.',
		params: squishParams,
		requestHeaders: squishRequestHeaders,
		response: squishResponse,
		examples: squishExamples
	},
	{
		id: 'pdf',
		method: 'POST',
		path: '/v1/pdf',
		summary:
			'The PDF toolkit. A single endpoint with five operations, selected with <code>?op=</code>. Four of them take a PDF as the raw request body; <code>op=create</code> takes images and produces one.',
		ops: pdfOps,
		params: pdfParams,
		response: pdfResponseHeaders,
		examples: pdfExamples
	},
	{
		id: 'check-tokens',
		method: 'GET',
		path: '/v1/checkTokens',
		summary:
			'Returns the number of remaining operations for the current IP or API key. Useful for checking quota before submitting a batch.',
		fields: checkTokensFields,
		examples: [
			{
				label: 'cURL',
				language: 'bash',
				code: `curl "https://api.mochify.app/v1/checkTokens" \\
  -H "Authorization: Bearer mchy_your_api_key"
# Response
# { "remaining": 983, "available": true }`
			}
		]
	}
];

/** `tone` drives the status-code color on /docs: ok is green, warn amber, bad red. 429 reads as red rather than amber because a blocked batch is not a warning. */
export const errors = [
	{ status: '200', tone: 'ok', description: 'Success. Response body is the processed image.' },
	{ status: '400', tone: 'warn', description: 'Bad request: missing or invalid parameters.' },
	{ status: '401', tone: 'warn', description: 'Unauthorized: invalid or missing API key.' },
	{
		status: '403',
		tone: 'warn',
		description:
			'Your plan does not include this operation. The PDF-in operations on <code>/v1/pdf</code> require a paid plan. <a href="/pricing">Upgrade</a> to enable them.'
	},
	{
		status: '413',
		tone: 'warn',
		description:
			'Payload too large. The request body, or the output it would produce, exceeds the limit for your plan.'
	},
	{
		status: '415',
		tone: 'warn',
		description:
			'Unsupported media type. The body was not a file this operation accepts, for example an image sent to a PDF-in operation.'
	},
	{
		status: '422',
		tone: 'warn',
		description:
			'The file was readable but could not be processed as asked. The body explains why, for example a PDF with more pages than your plan allows, a password-protected PDF, or a PDF holding no extractable images.'
	},
	{
		status: '429',
		tone: 'bad',
		description:
			'Rate limit exceeded. Free tier resets monthly; paid tiers reset on your billing date. <a href="/pricing">Upgrade</a> for higher limits.'
	},
	{ status: '500', tone: 'bad', description: 'Server error: the file could not be processed.' },
	{
		status: '503',
		tone: 'bad',
		description:
			'At capacity. Retry after the delay in the <code>Retry-After</code> header. Nothing is charged for a request that returns this.'
	}
];

// ---------------------------------------------------------------------------
// Surfaces, privacy and the agent-facing clients.
//
// None of this is on /docs today, which is why it is grouped separately: it is
// rendered only into /llms-full.txt. Every claim here is ledger §1 and §3 text
// rather than anything new, because an agent acting on a wrong privacy claim is
// the single most expensive mistake this file could make.
// ---------------------------------------------------------------------------

export const surfaces = [
	{
		name: 'Web app',
		url: 'https://mochify.app',
		description:
			'Browser app. Handles images, PDFs and video. Magic Flow (a natural-language prompt) and Manual Settings are the two modes. The standalone installable surface is https://mochify.app/flow.'
	},
	{
		name: 'Chrome extension',
		description: 'Browser extension for image workflows.'
	},
	{
		name: 'REST API',
		url: 'https://api.mochify.app',
		description:
			'POST /v1/squish, POST /v1/pdf and GET /v1/checkTokens. Auth is Authorization: Bearer &lt;key&gt;.'
	},
	{
		name: 'CLI',
		description:
			'The mochify Rust binary. A client over the API: it does not encode locally. Handles images, PDFs and Magic Flow prompts.'
	},
	{
		name: 'Local MCP server',
		description:
			'The same binary run as mochify serve. Returns file paths and metadata, never image bytes in the agent context.'
	},
	{
		name: 'Hosted MCP server',
		url: 'https://mcp.mochify.app',
		description:
			'OAuth, no install. Returns a short-lived download URL on files.mochify.app rather than inline binary.'
	}
];

export const cli = {
	install: [
		'macOS: brew install mochify (tap getmochify/mochify)',
		'Linux: curl binaries from the repo',
		'Rust: cargo install mochify'
	],
	auth: [
		'mochify auth login opens a browser, authorizes the account, and writes credentials to ~/.config/mochify/credentials.toml. This is the standard path and covers both the CLI and mochify serve.',
		'MOCHIFY_API_KEY is an optional environment-variable override for headless environments. It is not the setup step.'
	],
	usage: [
		'mochify photo.jpg --type webp: compress and convert.',
		'mochify *.jpg -p "resize to 1200px and convert to webp": Magic Flow, the same natural-language path the web app uses.',
		'mochify serve: run the local MCP server over stdio.'
	],
	repo: 'https://github.com/getmochify/mochify-cli',
	notes: [
		'The installed binary is named mochify, not mochify-cli.',
		'Compressed bytes come back from api.mochify.app straight to disk. There is no pickup store on this path.'
	]
};

export const mcp = {
	hosted: {
		endpoint: 'https://mcp.mochify.app/mcp',
		discovery: 'https://mcp.mochify.app/.well-known/oauth-authorization-server',
		auth: 'OAuth 2.0 with PKCE. The user authorizes their Mochify account once and the client receives a short-lived access token (1-hour TTL, auto-refreshed). No API key management.',
		input: 'Public HTTPS URLs (url parameter) or base64 bytes (data plus mediaType), for both images and PDFs.',
		output:
			'A short-lived download URL on files.mochify.app with a 5-minute expiry, stated in the tool response.',
		clients:
			'Claude.ai (Settings > Integrations), Claude Desktop (type: "http"), Gemini, Cursor, Windsurf, and any client that supports remote MCP servers.'
	},
	local: {
		command: 'mochify serve',
		clientConfig: '{ "command": "mochify", "args": ["serve"] }',
		notes:
			'Works with local file paths and public URLs, over stdio, with any stdio MCP client. The file is written straight to disk and the agent gets back a path and a size, never the bytes.'
	},
	tools: [
		{
			name: 'squish',
			description:
				'Compress, convert, resize or transform an image. Parameters (all optional): url, data, mediaType, type (jpg | png | webp | avif | jxl), width, height, quality (1–100), crop, rotate (0 | 90 | 180 | 270), removeBackground, background, stripExif (default true), smartCompress, optimizeForWeb, brightness (-100 to +100), clarity, lossless (jxl, webp and png only), hdr ("preserve" keeps a gain map the source has, "generate" also synthesises one for an SDR source).'
		},
		{
			name: 'pdf',
			description:
				'Work on a PDF. Parameters: url or data (plus mediaType), op (optimize | extract | rasterize | split, default rasterize), type, dpi, quality, maxWidth, minSize. optimize returns a smaller PDF whose text and layout are untouched; extract, rasterize and split return a zip. All four require a paid plan.'
		},
		{
			name: 'pdf_create',
			description:
				'Build a PDF from images, one page per image, in the order given. Parameters: images (array of { url | data, mediaType, name }, up to 200), page (fit | a4 | letter), quality, dpi, maxWidth, combine (false returns a zip of single-page PDFs). Available on every plan including Free.'
		},
		{
			name: 'check_usage',
			description:
				'Check remaining operations in the current billing period. No parameters. Returns remaining and total quota.'
		}
	],
	registries: 'Listed on the Smithery and Glama MCP marketplaces.'
};

export const privacyModel = [
	{
		path: 'Images and PDFs, every server surface',
		claim:
			'Streamed into the encoder in RAM at api.mochify.app, wiped immediately. No disk writes of the source and no logs containing file data. They do travel to the API for encoding: nothing about images or PDFs is processed on your machine.'
	},
	{
		path: 'Hosted MCP output',
		claim:
			'The original is wiped immediately. The compressed output is held in a pickup store under an unguessable hash with a 5-minute TTL so the files.mochify.app URL resolves, then evicted whether or not it was fetched.'
	},
	{
		path: 'CLI and local MCP (mochify serve)',
		claim:
			'No pickup store. Compressed bytes come straight back to the local binary and are written to disk. Zero retention end to end. These are clients over the API: they still call api.mochify.app, and the difference from the web app is the absence of a pickup store, not local encoding.'
	},
	{
		path: 'Video',
		claim:
			'Processed entirely in the browser. Video bytes never leave the device. This is the only surface where that is true, and it is web-app only.'
	},
	{
		path: 'Bring your own bucket (Seller, Pro and Growth)',
		claim:
			'Same in-memory processing; the result is then written from the processing container straight into the customer own S3, R2 or S3-compatible bucket through a pre-signed URL valid for one object and a few minutes. The bucket is the customer storage, not Mochify storage. Write-only: Mochify does not read from or browse the bucket in normal use.'
	}
];

export const magicFlow = {
	summary:
		'Magic Flow is the natural-language interface: a language model parses the prompt, then the C++ engine executes it. Current model: Mistral Small 4 (mistral-small-4-0-26-03).',
	surfaces:
		'Available in the web app, the CLI (-p), both MCP surfaces, and the PDF tools. It is not exposed as a publicly documented REST endpoint, and the fixed-purpose converter pages under /solutions do not have a prompt.'
};
