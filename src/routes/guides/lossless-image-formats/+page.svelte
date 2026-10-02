<script>
	import ReadProgress from '$lib/components/ReadProgress.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
	import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
	import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
	import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
	import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
	import StepList from '$lib/components/guide-demo/StepList.svelte';
	import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

	// Built from content-ops `article-originals/lossless-image-formats.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract.
	const metadata = {
		title: 'Lossless Image Formats: Which One to Use, and When Lossless Is the Wrong Choice',
		seoTitle: 'Lossless Image Formats - Which to Use, and When Not To',
		description:
			'PNG, WebP, JPEG XL and AVIF tested lossless on six image types: which wins for screenshots, logos and photos, and when lossless is the wrong call.',
		category: 'Image Formats',
		readTime: '26 min read',
		date: 'October 2, 2026'
	};

	const pageUrl = 'https://mochify.app/guides/lossless-image-formats';

	const toc = [
		{
			id: 'what-lossless-means',
			label: 'What lossless actually means (and three things it does not)'
		},
		{ id: 'formats-compared', label: 'The lossless image formats in 2026, compared' },
		{ id: 'benchmark', label: 'Our benchmark: six images, four lossless formats' },
		{ id: 'which-format', label: 'Which lossless format for which image' },
		{ id: 'when-not-lossless', label: 'When lossless is the wrong choice' },
		{ id: 'support', label: 'Browser and app support for lossless formats in 2026' },
		{ id: 'traps', label: 'Five ways a "lossless" file ends up lossy' },
		{ id: 'mochify-workflow', label: 'Mochify Workflow: a pixel-exact JPEG XL, WebP or PNG' },
		{ id: 'cheat-sheet', label: 'Cheat Sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const workflowSteps = [
		{
			title: 'Decide whether the image needs lossless',
			html: `<p>Screenshots, diagrams, logos, masters and anything you will edit again: yes. A photograph that will only be viewed: no. For everything in the second group, drop the files on <a href="https://mochify.app/flow">mochify.app/flow</a>, describe the result you want ("convert these to WebP for the web, max 1600px wide, strip the location data") and let Magic Flow pick the format and quality. A language model parses the prompt and the C++ engine does the encoding.</p>`
		},
		{
			title: 'Lossless through Magic Flow, in plain English',
			html: `<p>Put the word in the prompt: "convert these screenshots to lossless WebP", "save this as a lossless JPEG XL", "make a lossless PNG of each one". Magic Flow understands the instruction and encodes pixel-exact output whenever the format you asked for supports it, which means JPEG XL, WebP and PNG. Ask for lossless AVIF or JPG and there is no lossless path for it to take, so pick one of the three. This works wherever Magic Flow does: the web app, the CLI with <code>-p</code>, both MCP servers, and <code>POST /v1/prompt</code> on the API.</p>`
		},
		{
			title: 'PNG to lossless JPEG XL, in the browser',
			html: `<p>Open the <a href="https://mochify.app/solutions/png-to-jxl">PNG to JXL converter</a>, drop the PNG, and turn on the <strong>Lossless</strong> switch that appears after upload. Output is pixel-exact, the alpha channel is carried through, a 16-bit PNG stays 16-bit, and the file is usually still smaller than the PNG. It is slower than the default encode on large files, which is the lossless trade everywhere. The switch is available without an account, within the 3-images-a-month guest allowance, and on every plan.</p>`
		},
		{
			title: 'Lossless WebP, PNG or JPEG XL through the API, for batches and automation',
			html: `<p>Add <code>lossless=1</code> to a <code>/v1/squish</code> call. It overrides any <code>quality</code> setting, and it is honored for <code>jxl</code>, <code>webp</code> and <code>png</code> output; a <code>jpg</code> or <code>avif</code> request with <code>lossless=1</code> is rejected with a <code>400</code>, because neither path is lossless.</p>
<div class="my-5 overflow-hidden rounded-2xl bg-[#2F2320]"><div class="border-b border-white/10 px-5 py-2"><span class="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-xs text-[#F6EDE8]">squish.sh</span></div><pre class="m-0! overflow-x-auto rounded-none! p-5 text-sm leading-relaxed text-[#F6EDE8]"><code>curl -X POST "https://api.mochify.app/v1/squish?type=webp&amp;lossless=1" \\
  -H "Content-Type: image/png" \\
  -H "Authorization: Bearer mchy_your_api_key" \\
  --data-binary @screenshot.png \\
  --output screenshot.webp</code></pre></div>
<p>Swap <code>type=webp</code> for <code>type=jxl</code> or <code>type=png</code> as needed. The full parameter list is at <a href="https://mochify.app/docs">mochify.app/docs</a>.</p>`
		},
		{
			title: 'From the CLI or an AI agent',
			html: `<p>The <code>mochify</code> CLI and the local MCP server (<code>mochify serve</code>) are clients over the same API, as is the hosted MCP server at <code>mcp.mochify.app</code>, so the same lossless output is available from a terminal or from Claude Desktop and Cursor, either as a plain-English instruction ("lossless WebP") or through the API parameter. Authenticate once with <code>mochify auth login</code>.</p>`
		},
		{
			title: 'Verify',
			html: `<p>For anything that matters, prove it: <code>magick compare -metric AE original.png output.webp null:</code> prints <code>0</code> when every pixel matches. For WebP, remember the hidden-RGB-under-alpha caveat in the traps section if the source has transparent pixels.</p>`
		}
	];

	const faqItems = [
		{
			q: 'What image formats are lossless?',
			a: `PNG is always lossless. WebP, JPEG XL and AVIF each have an optional lossless mode that you must select; their default modes are lossy. TIFF is lossless when saved uncompressed or with LZW, Deflate or PackBits, though it can also contain lossy JPEG data. GIF compresses losslessly but is limited to 256 colors per frame, so converting a photo to GIF loses color. BMP is uncompressed and therefore lossless, and enormous.`
		},
		{
			q: 'Is PNG 100% lossless?',
			a: `Yes. The PNG specification requires the compression to be "deterministic, reversible, and lossless", and the 0 to 9 compression level in your editor controls encoding effort and file size, not pixel accuracy. The two ways a PNG workflow loses data happen before compression: reducing bit depth on export (16-bit to 8-bit) and converting to an 8-bit palette. The file is still a lossless PNG of whatever it was given.`
		},
		{
			q: 'Is WebP lossless?',
			a: `Only in its lossless mode. Standard WebP is lossy, and a WebP saved at quality 100 is still lossy. Lossless WebP (the VP8L coding) is pixel-exact, supports transparency, and in Google's figures is 26% smaller than PNG; in our tests it was 3 to 5 times smaller than PNG on screenshots and diagrams. It is limited to 8 bits per channel, so it cannot losslessly hold a 16-bit or HDR image.`
		},
		{
			q: 'Is JPEG lossless?',
			a: `No. Standard JPEG is lossy at every quality setting, including 100, because of its color conversion, chroma subsampling and quantized frequency transform. A "lossless JPEG" mode exists in the 1990s standard and in JPEG 2000 and JPEG-LS, but browsers do not support those. JPEG XL, which is a different format, has a true lossless mode, and it can also store an existing JPEG around 20% smaller while reconstructing the original file exactly.`
		},
		{
			q: 'Which is better, lossless JPEG XL or PNG?',
			a: `Lossless JPEG XL produces smaller files than PNG for almost every image (the JPEG XL project puts PNG at 46% larger on average; our photos came out 22 to 25% smaller as JXL) and supports higher bit depths, HDR and animation. PNG opens everywhere, while JPEG XL opens in Safari today and is arriving in Chrome and Firefox in late 2026. For a file you control the viewer for, JXL; for a file you will hand to strangers, PNG, or lossless WebP if it is a flat graphic.`
		},
		{
			q: 'Is quality 100 the same as lossless?',
			a: `No, and this is the most common misunderstanding. A lossy encoder at quality 100 still runs its lossy pipeline and gets very close to the original without matching it. In our test, AVIF at quality 100 differed from the source on every image. If you need pixel-exact output, use the format's explicit lossless mode: <code>-lossless</code> in cwebp, <code>-d 0</code> in cjxl, <code>--lossless</code> in avifenc, or <code>lossless=1</code> on Mochify's API.`
		},
		{
			q: 'Is AVIF lossless?',
			a: `It can be, but it is the wrong tool for the job. AV1 has a lossless coding mode, and libavif will use it when you request 4:4:4 chroma, quality 100 and identity matrix coefficients together. The resulting files are consistently larger than lossless WebP or JPEG XL, and in our tests were sometimes larger than the PNG. Use AVIF for lossy images, where it is one of the best formats available, and use WebP or JPEG XL when you need lossless.`
		},
		{
			q: 'Does Mochify compress images losslessly?',
			a: `By default, no: every Mochify surface produces a single high-quality lossy encode, because that is the right answer for most images. Lossless is available when you ask for it: say "lossless" in a Magic Flow prompt on any surface, turn on the Lossless switch on the PNG to JXL converter, or set <code>lossless=1</code> on the <code>/v1/squish</code> API. Each gives pixel-exact JPEG XL, WebP or PNG. JPG and AVIF output cannot be lossless, and the API says so with a <code>400</code>.`
		}
	];

	const related = [
		{
			title: 'Converting Images to JPEG XL: The Practical Guide for 2026',
			href: '/guides/converting-images-to-jpeg-xl',
			desc: 'lossless and lossy JXL, from PNG, JPG and AVIF, with the browser fallback pattern.'
		},
		{
			title: 'JPEG XL vs PNG for Screenshots: Half the Size, Same Pixels',
			href: '/guides/jxl-vs-png-for-screenshots',
			desc: 'the single-comparison deep dive on the screenshot case.'
		},
		{
			title: 'Do WebP and AVIF Support Transparency?',
			href: '/guides/webp-avif-transparency',
			desc: 'how alpha is stored in each format and the five ways it gets flattened.'
		},
		{
			title: 'What Should I Use in 2026: WebP, AVIF, or JPEG XL?',
			href: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl',
			desc: 'the lossy side of the same decision.'
		},
		{
			title: 'The 2026 Guide to Next-Gen Formats: WebP, AVIF, JPEG XL',
			href: '/guides/2026-guide-next-gen-formats',
			desc: 'where each format stands on support, size and features.'
		}
	];

	const organization = { '@type': 'Organization', name: 'Mochify', url: 'https://mochify.app' };

	const articleLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: metadata.title,
		description: metadata.description,
		url: pageUrl,
		mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
		datePublished: '2026-10-02',
		dateModified: '2026-10-02',
		inLanguage: 'en',
		author: {
			'@type': 'Organization',
			name: 'Mochify Engineering Team',
			url: 'https://mochify.app'
		},
		publisher: {
			...organization,
			logo: { '@type': 'ImageObject', url: 'https://mochify.app/logo.png' },
			sameAs: ['https://github.com/getmochify']
		},
		isPartOf: { '@type': 'WebSite', name: 'Mochify', url: 'https://mochify.app' },
		about: ['Lossless compression', 'PNG', 'WebP', 'JPEG XL', 'AVIF', 'Image formats'].map(
			(name) => ({ '@type': 'Thing', name })
		),
		keywords:
			'lossless image format, best lossless image format, lossless png compression, is png lossless, is webp lossless, lossless jpeg xl, lossless vs lossy',
		speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.article-intro', 'h1'] }
	};

	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mochify.app/' },
			{ '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://mochify.app/guides' },
			{ '@type': 'ListItem', position: 3, name: metadata.title, item: pageUrl }
		]
	};

	const webPageLd = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: metadata.title,
		url: pageUrl,
		description: metadata.description,
		isPartOf: { '@type': 'WebSite', name: 'Mochify', url: 'https://mochify.app' },
		datePublished: '2026-10-02',
		dateModified: '2026-10-02'
	};
</script>

<ReadProgress />

<svelte:head>
	<title>{metadata.seoTitle}</title>
	<meta name="description" content={metadata.description} />
	<meta
		name="keywords"
		content="lossless image format, best lossless image format, lossless png compression, is png lossless, is webp lossless, lossless jpeg xl, lossless vs lossy"
	/>
	<meta
		name="robots"
		content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
	/>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={metadata.seoTitle} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:site_name" content="Mochify" />
	<meta property="og:locale" content="en" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metadata.seoTitle} />
	<meta name="twitter:description" content={metadata.description} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${JSON.stringify(articleLd)}<\/script>`}
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}<\/script>`}
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${JSON.stringify(webPageLd)}<\/script>`}
</svelte:head>

<article
	class="relative mx-auto w-full max-w-3xl px-5 pt-6 text-lg leading-relaxed text-[#6C3F31] sm:px-6 md:px-0 md:pt-0"
>
	<div class="hero-wash" aria-hidden="true"></div>

	<header class="mb-12 md:mb-14">
		<p class="mt-0 mb-3 text-xs font-bold tracking-[0.18em] text-[#F06292] uppercase">
			{metadata.category} · Guide
		</p>
		<h1
			class="mb-0 text-3xl leading-[1.1] font-black tracking-tight text-[#4A2C2C] md:text-[2.75rem]"
		>
			Lossless Image Formats: Which One to Use, and When Lossless Is the Wrong Choice
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			A lossless image format stores every pixel exactly, so the decoded image is bit-for-bit
			identical to what went in. In 2026 there are four that matter for everyday work: PNG, lossless
			WebP, lossless JPEG XL and lossless AVIF, with TIFF for print workflows. Which one to pick
			depends on the image, not on the format's reputation. In our tests, lossless WebP produced the
			smallest files for screenshots, diagrams, charts and a transparent logo (a 1440x900 app
			screenshot came out at 22 KB against 71 KB as a PNG), lossless JPEG XL edged it on
			photographs, and lossless AVIF never came first, sometimes landing larger than the PNG. The
			bigger finding is the one most guides skip: on a photograph, the smallest lossless file was
			still 14 times the size of a good lossy encode. This guide explains what "lossless" actually
			guarantees, compares the formats on real images, gives you a one-line rule for each kind of
			image, and shows the traps that quietly turn a lossless file lossy.
		</p>

		<div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
			<p class="m-0 text-base leading-relaxed text-[#6C3F31]">
				<strong class="text-[#4A2C2C]"
					>Published {metadata.date} by the Mochify Engineering Team.</strong
				>
				Six test images run through Mochify's API with lossless=1 and verified pixel-for-pixel, so every
				number here is ours and reproducible.
			</p>
		</div>
	</header>

	<div class="space-y-12">
		<section>
			<GuideTOC items={toc} />
		</section>

		<section id="what-lossless-means" class="scroll-mt-24">
			<SectionHeading>What lossless actually means (and three things it does not)</SectionHeading>
			<p class="mb-4">
				Lossless means the decoder reproduces the exact pixel values that were encoded. Nothing is
				approximated, nothing is thrown away, and you can re-save the file a thousand times without
				the image changing. That is the whole definition, and it is narrower than people assume: it
				says nothing about how big the file is, how long it takes to encode, or whether the pixels
				you fed the encoder were any good to begin with.
			</p>
			<p class="mb-4">
				The W3C's PNG specification, which reached its Third Edition as a <a
					href="https://www.w3.org/TR/png-3/"
					target="_blank"
					rel="noopener noreferrer">W3C Recommendation in June 2025</a
				>, puts it plainly: the format's compression is "deterministic, reversible, and lossless".
				Lossless image formats get their savings the way ZIP does, by finding repetition. PNG
				predicts each pixel from its neighbors and hands the residual to DEFLATE; WebP's lossless
				mode adds a color cache and palette tricks; JPEG XL's modular mode uses adaptive prediction
				and context modeling. Flat colors, repeated patterns and sharp edges compress beautifully.
				Sensor noise in a photograph compresses badly, because noise has no pattern to find.
			</p>
			<p class="mb-4">
				Three things that lossless does <strong>not</strong> mean, each of which is the subject of a forum
				thread that still ranks on Google's first page:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>The compression level is not a quality setting.</strong> When GIMP, Photoshop or
						a command-line tool asks for a PNG "compression level" from 0 to 9, it is asking how
						hard the encoder should search for repetition. Level 0 and level 9 decode to identical
						pixels; the difference is file size and encoding time. The same is true of oxipng's
						levels, cwebp's <code>-m</code> method, and cjxl's <code>-e</code> effort.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>"Quality 100" is not lossless.</strong> A lossy encoder at its top quality setting
						still runs the image through a lossy pipeline, usually a color-space conversion and a frequency
						transform, and gets close to the original without matching it. In our tests, AVIF at quality
						100 through a common encoder path differed from the source on every image. WebP, AVIF and
						JPEG XL each have a separate lossless mode you have to ask for by name.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>"Compressed without losing quality" is a marketing phrase, not a technical one.</strong
						> It almost always means "visually indistinguishable at normal viewing size". TinyPNG, to
						its credit, describes its own engine as a "smart lossy compression engine". A tool that advertises
						lossless PNG optimization and saves 6% is usually re-packing the same pixels more tightly,
						which is real but is a different thing from the format-level choice this guide is about.
					</p>
				</li>
			</ul>
		</section>
		<section id="formats-compared" class="scroll-mt-24">
			<SectionHeading>The lossless image formats in 2026, compared</SectionHeading>
			<p class="mb-4">
				Four formats can store a lossless image and display it in a current browser: PNG everywhere,
				lossless WebP everywhere, lossless AVIF everywhere, and lossless JPEG XL in Safari today
				with Chrome and Firefox at the point of switching it on. TIFF is lossless (usually) but is
				not a web format; GIF and HEIF are technically capable and practically beside the point.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr
							><th>Format</th><th>Lossless mode</th><th>Bit depth</th><th>Alpha</th><th
								>Animation</th
							><th>HDR</th><th>Max dimensions</th><th>Where it opens</th></tr
						></thead
					><tbody
						><tr
							><td><strong>PNG</strong></td><td>Always</td><td>1 to 16 bits per channel</td><td
								>Yes</td
							><td>APNG (official since PNG Third Edition, 2025)</td><td
								>Yes, via <code>cICP</code> (Third Edition)</td
							><td>2^31-1 per side</td><td>Everywhere</td></tr
						>
						<tr
							><td><strong>WebP</strong></td><td>Optional (VP8L)</td><td>8-bit only</td><td>Yes</td
							><td>Yes</td><td>No</td><td>16,383 x 16,383</td><td
								>96.8% of browsers (<a
									href="https://caniuse.com/webp"
									target="_blank"
									rel="noopener noreferrer">caniuse</a
								>)</td
							></tr
						>
						<tr
							><td><strong>JPEG XL</strong></td><td>Optional (modular mode)</td><td
								>Up to 32 bits per channel</td
							><td>Yes</td><td>Yes</td><td>Yes</td><td>2^30-1 per side</td><td
								>Safari 17+; Chrome 155 scheduled Oct 2026; Firefox pending (see below)</td
							></tr
						>
						<tr
							><td><strong>AVIF</strong></td><td
								>Optional (AV1 lossless, 4:4:4 + identity matrix)</td
							><td>8, 10, 12-bit</td><td>Yes</td><td>Yes</td><td>Yes</td><td
								>Very large (tiled grids)</td
							><td
								>95.4% of browsers (<a
									href="https://caniuse.com/avif"
									target="_blank"
									rel="noopener noreferrer">caniuse</a
								>)</td
							></tr
						>
						<tr
							><td><strong>TIFF</strong></td><td
								>Uncompressed, LZW, Deflate or PackBits (can also hold lossy JPEG)</td
							><td>Up to 32-bit float</td><td>Yes</td><td>No</td><td>Via profiles</td><td
								>Very large</td
							><td>Safari only, in browsers; every editor and print RIP</td></tr
						>
						<tr
							><td><strong>GIF</strong></td><td>LZW is lossless, but 256 colors per frame</td><td
								>8-bit palette</td
							><td>1-bit</td><td>Yes</td><td>No</td><td>65,535 x 65,535</td><td>Everywhere</td></tr
						></tbody
					>
				</table>
			</GuideTable>
			<p class="mb-4">A few rows need a sentence each.</p>
			<p class="mb-4">
				<strong>PNG</strong> is the baseline for a reason: it has been lossless by construction
				since 1996, every decoder on earth reads it, and the 2025 Third Edition brought animation
				and HDR signaling into the standard. Its weakness is size. Google's figures put
				<a href="https://developers.google.com/speed/webp" target="_blank" rel="noopener noreferrer"
					>lossless WebP at 26% smaller than PNG</a
				> on average, and the JPEG XL project's own headline is that an equivalent PNG is 46% larger than
				a lossless JXL, which works out to JXL being about 31% smaller.
			</p>
			<p class="mb-4">
				<strong>Lossless WebP</strong> was designed specifically to replace PNG on the web. Google's 2017
				study across 12,000 PNGs found lossless WebP 23% smaller than ZopfliPNG-optimized files and 42%
				smaller than libpng's output, and smaller on more than 99% of the images. The limit is 8 bits
				per channel: no 16-bit masters, no HDR.
			</p>
			<p class="mb-4">
				<strong>Lossless JPEG XL</strong> is the most capable of the four: 32-bit samples, alpha,
				animation, HDR, and a reversible transcode that stores an existing JPEG around 20% smaller
				and reconstructs it bit-exactly. We cover it in depth in
				<a href="https://mochify.app/guides/converting-images-to-jpeg-xl"
					>our guide to converting images to JPEG XL</a
				>. The caveat is support, which has moved a long way in 2026 but is not universal yet.
			</p>
			<p class="mb-4">
				<strong>Lossless AVIF</strong> exists because AV1 has a lossless coding mode, but it was
				never the format's purpose. libavif only encodes losslessly with 4:4:4 chroma, quality 100
				and identity (or YCgCo-R) matrix coefficients, and the results are consistently larger than
				lossless WebP or JXL. Johannes Siipola's widely cited
				<a
					href="https://siipo.la/blog/whats-the-best-lossless-image-format-comparing-png-webp-avif-and-jpeg-xl"
					target="_blank"
					rel="noopener noreferrer">2021 comparison</a
				> measured a median of 203 KB for AVIF against 148 KB for WebP and 131 KB for JXL on 94 design
				images, and our own numbers below say the same thing with 2026 encoders. Use AVIF for lossy, where
				it is excellent, and reach for something else for lossless.
			</p>
			<p class="mb-4">
				<strong>TIFF</strong> is lossless when saved uncompressed or with LZW, Deflate or PackBits,
				which is how print and archive workflows use it, but the container can also carry
				JPEG-compressed data, so a <code>.tif</code> is not automatically lossless. No browser except
				Safari renders it in a web page.
			</p>
			<p class="mb-4">
				<strong>GIF</strong> compresses losslessly, but converting any image with more than 256 colors
				to GIF quantizes it first. The format is lossless; the conversion usually is not.
			</p>
			<p class="mb-4">
				<strong>HEIF / HEIC</strong> files are normally HEVC-encoded and lossy. The container allows lossless
				coding, but the HEIC you get from a phone and the HIF a Canon or Sony body writes are lossy by
				default, and lossless is not an option you will find in a camera menu.
			</p>
		</section>
		<section id="benchmark" class="scroll-mt-24">
			<SectionHeading>Our benchmark: six images, four lossless formats</SectionHeading>
			<p class="mb-4">
				We ran six images through Mochify's API with <code>lossless=1</code> as PNG, WebP and JPEG XL,
				encoded the same six as lossless AVIF with the reference encoder (Mochify has no lossless AVIF
				path, for reasons the table makes clear), decoded every output and compared it pixel-for-pixel
				with the source. Lossless WebP produced the smallest file on every flat graphic and on the transparent
				logo, lossless JPEG XL edged it on both photographs, and lossless AVIF was never smallest.
			</p>
			<p class="mb-4">
				<strong>Method.</strong> The images are reproducible: a synthetic 1440x900 app screenshot
				(flat panels, anti-aliased text), a 1200x800 flowchart, a 1200x800 bar chart with smooth
				gradient fills, an 800x800 logo with a soft drop shadow on a transparent background, and two
				photographs from scikit-image's public-domain sample set (512x512 and 600x400), all saved as
				PNG by libpng at its default level 6. Each PNG was posted to <code>POST /v1/squish</code> on
				<code>api.mochify.app</code>
				with <code>lossless=1</code> and <code>type=png</code>, <code>type=webp</code> and
				<code>type=jxl</code>, and again with no <code>lossless</code> parameter to get Mochify's default
				(lossy) WebP and JPEG XL for scale. Lossless AVIF came from libavif 1.4.2 (quality 100, 4:4:4,
				identity matrix). Every output was decoded and compared with the source: 17 of the 18 Mochify
				lossless files were byte-identical, and the eighteenth, the transparent logo as WebP, matched
				on every visible pixel (more on that below). Run on October 2, 2026; the scripts and raw results
				are in our content repo.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr
							><th>Image</th><th>Source PNG</th><th>Mochify lossless PNG</th><th
								>Mochify lossless WebP</th
							><th>Mochify lossless JPEG XL</th><th>AVIF lossless (libavif)</th><th
								>Smallest lossless vs source</th
							><th>Mochify default WebP (lossy)</th><th>Mochify default JPEG XL (lossy)</th></tr
						></thead
					><tbody
						><tr
							><td>App screenshot, 1440x900</td><td>71.0 KB</td><td>72.9 KB</td><td
								><strong>21.8 KB</strong></td
							><td>99.8 KB</td><td>47.2 KB</td><td>-69%</td><td>44.4 KB</td><td>69.4 KB</td></tr
						>
						<tr
							><td>Flowchart, 1200x800</td><td>18.5 KB</td><td>18.8 KB</td><td
								><strong>5.5 KB</strong></td
							><td>15.9 KB</td><td>17.3 KB</td><td>-70%</td><td>9.5 KB</td><td>14.4 KB</td></tr
						>
						<tr
							><td>Gradient bar chart, 1200x800</td><td>15.1 KB</td><td>30.1 KB</td><td
								><strong>6.5 KB</strong></td
							><td>11.7 KB</td><td>14.5 KB</td><td>-57%</td><td>8.5 KB</td><td>13.0 KB</td></tr
						>
						<tr
							><td>Logo with soft shadow (alpha), 800x800</td><td>32.0 KB</td><td>31.3 KB</td><td
								><strong>14.9 KB</strong></td
							><td>22.4 KB</td><td>38.2 KB</td><td>-53%</td><td>20.0 KB</td><td>23.6 KB</td></tr
						>
						<tr
							><td>Photograph, 512x512</td><td>414.6 KB</td><td>621.0 KB</td><td>332.9 KB</td><td
								><strong>325.4 KB</strong></td
							><td>363.2 KB</td><td>-22%</td><td>23.4 KB</td><td>26.0 KB</td></tr
						>
						<tr
							><td>Photograph, 600x400</td><td>438.7 KB</td><td>609.2 KB</td><td>331.2 KB</td><td
								><strong>330.5 KB</strong></td
							><td>370.5 KB</td><td>-25%</td><td>28.1 KB</td><td>26.5 KB</td></tr
						></tbody
					>
				</table>
			</GuideTable>
			<p class="mb-4">Four things stand out.</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>On flat graphics, lossless WebP was in a different league.</strong> On the screenshot
						it was 4.6 times smaller than lossless JPEG XL and 3.3 times smaller than the source PNG;
						on the flowchart, 3.4 times smaller than the PNG. The screenshot is exactly what WebP's lossless
						coder was built for: large areas of identical color and a small palette.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>On flat graphics, the lossless file was smaller than the lossy ones.</strong> The
						21.8 KB lossless WebP of the screenshot beat Mochify's own default 44.4 KB WebP and 69.4 KB
						JPEG XL, and the same held on the flowchart, the chart and the logo. Lossy encoders spend
						bytes trying to preserve the look of sharp text edges that a lossless coder simply stores.
						For UI, diagrams and text, lossless is not the cautious choice; it is the small one.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>On photographs, lossless saved a fifth and lossy saved an order of magnitude.</strong
						> JPEG XL's lossless mode was the smallest at 325.4 KB for the 512x512 photo, 22% under the
						source PNG, with WebP two percent behind. Mochify's default WebP of the same photo was 23.4
						KB, 13.9 times smaller than the best lossless file, and at that size the difference is invisible
						at normal viewing distance. That ratio is the whole argument of the "when not to use lossless"
						section below.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>PNG to PNG is not where lossless savings live.</strong> Re-encoding a PNG as a lossless
						PNG came back between 2% smaller and twice as large as the libpng source, and 39 to 50% larger
						on the photographs. A lossless PNG is still a PNG; the savings come from changing format to
						WebP or JPEG XL. If you need a smaller file that must stay a PNG, a dedicated optimizer such
						as oxipng is the tool (it took 17 to 30% off our flat graphics and 1 to 2% off the photographs).
					</p>
				</li>
			</ol>
			<p class="mb-4">
				For comparison we also ran the same six files through the reference encoders at their
				slowest settings (cwebp method 6, cjxl effort 9, oxipng). The ranking did not change.
				Maximum effort bought 4 to 48% on the flat graphics (the screenshot: 16.4 KB as WebP, 56.0
				KB as JPEG XL) and 1 to 4% on the photographs, and at effort 9 JPEG XL overtook WebP on the
				logo (11.7 against 14.3 KB). Encoding effort is a dial on every lossless encoder; it changes
				the size, never the pixels.
			</p>
			<p class="mb-4">
				Two traps surfaced in the course of running this benchmark, and both are common enough that
				we reproduced them deliberately. AVIF at "quality 100" through a popular Python encoder
				binding, with 4:4:4 chroma but the default color matrix, was not pixel-identical on any of
				the six images; the 512x512 photo came out at 288 KB, smaller than any true lossless file,
				because it was lossy. And lossless WebP, both from Mochify and from libwebp's command-line
				encoder at its defaults, altered the hidden RGB values under fully transparent pixels in the
				logo (902 of them in Mochify's output, 381 in cwebp's). Every visible pixel and the whole
				alpha channel were identical, but a byte comparison fails; libwebp's <code>exact</code> option
				keeps those hidden values if you need them.
			</p>
			<p class="mb-4">
				If screenshots are your main use case, <a
					href="https://mochify.app/guides/jxl-vs-png-for-screenshots"
					>our JPEG XL vs PNG for screenshots guide</a
				> goes deeper on that one comparison. The lesson of this broader test is that the right lossless
				format depends on the picture, so the next section gives you the rule for each.
			</p>
		</section>
		<section id="which-format" class="scroll-mt-24">
			<SectionHeading>Which lossless format for which image</SectionHeading>
			<p class="mb-4">
				Pick by image content and destination, not by the format's reputation: lossless WebP for
				anything flat that will be viewed in a browser, PNG when the file has to open everywhere or
				needs more than 8 bits, lossless JPEG XL for masters and for photographs that must stay
				lossless, and TIFF when a print or archive workflow asks for it.
			</p>
			<p class="mb-4">
				<strong>Screenshots, UI mockups, app store images.</strong> Lossless WebP, by a wide margin. Every
				browser in use reads it, the files were 3 to 5 times smaller than the alternatives in our test,
				and the lossless coder is specifically tuned for flat color and text. Keep a PNG if the screenshot
				is going into a document, a ticket system or a slide deck that may not accept WebP.
			</p>
			<p class="mb-4">
				<strong>Diagrams, charts, line art, icons rendered to raster.</strong> Lossless WebP again, for
				the same reasons. If the graphic has a smooth gradient, lossless JPEG XL closes the gap but did
				not overtake WebP in our chart test (11.7 KB against 6.5 KB).
			</p>
			<p class="mb-4">
				<strong>Logos and cut-outs with soft transparency.</strong> Lossless WebP won our test (14.9
				KB against 22.4 KB for lossless JPEG XL and 32.0 KB for the PNG) and is far better
				supported; only at the reference encoder's slowest setting did JPEG XL pull ahead. Ship
				WebP; keep the JXL or PNG as the master. If the destination flattens transparent images to a
				background color, as several marketplaces do, no lossless format will save you;
				<a href="https://mochify.app/guides/webp-avif-transparency"
					>our guide to WebP and AVIF transparency</a
				> covers that chain of failures.
			</p>
			<p class="mb-4">
				<strong>Photographs you must keep lossless</strong> (a master you will edit again, a scan, a scientific
				or medical image, a legal exhibit). Lossless JPEG XL if your tools read it, because it is the
				smallest and keeps 16-bit and HDR data. PNG at 16 bits if they do not. TIFF if the workflow is
				built around it. Do not use lossless WebP for this: it is 8-bit only, so a 16-bit master would
				be silently truncated before it was "losslessly" stored.
			</p>
			<p class="mb-4">
				<strong>Photographs for a web page, a listing, a message, a social post.</strong> Not lossless.
				See the next section.
			</p>
			<p class="mb-4">
				<strong>An existing JPEG.</strong> Leave it as a JPEG. Converting a JPEG to PNG, lossless
				WebP or lossless JXL produces a much larger file that faithfully preserves the JPEG's
				compression artifacts; you have paid in bytes for a perfect copy of an imperfect image. The
				one exception is JPEG XL's reversible transcode, which stores the JPEG itself around 20%
				smaller and can give you the original bytes back; that is a feature of the <code>cjxl</code> encoder,
				and converting through a tool that decodes and re-encodes the pixels, which is what most converters
				including our own JPG to JXL page do, is a lossy re-encode rather than a transcode.
			</p>
			<p class="mb-4">
				<strong>Animation.</strong> Animated WebP for the web; APNG where you need lossless frames and
				broad decoder support; animated JXL once the browsers you care about have caught up.
			</p>
		</section>
		<section id="when-not-lossless" class="scroll-mt-24">
			<SectionHeading>When lossless is the wrong choice</SectionHeading>
			<p class="mb-4">
				For photographs that will be looked at rather than edited, lossless is the wrong choice
				almost every time: in our test the best lossless photo file was 13.9 times the size of
				Mochify's default WebP of the same photo, which is visually indistinguishable at normal
				viewing size. The question to ask is not "do I want to lose quality" (nobody does) but "will
				anyone ever see the difference, and what does avoiding it cost".
			</p>
			<p class="mb-4">
				Lossless formats hunt for repetition, and photographs contain very little of it. Every pixel
				of sky is a slightly different shade; every edge is softened by the lens; the sensor adds
				noise that is, by definition, random. A lossless encoder has to store all of that. A lossy
				encoder is allowed to drop the noise and the detail your eye cannot resolve, and that is
				where the 13.9x comes from. Lossy photo formats have also improved a great deal: WebP, AVIF
				and JPEG XL at moderate quality settings, and even standard JPEG through Google's jpegli
				encoder, deliver files that pass visual inspection at a fraction of lossless size. Our <a
					href="https://mochify.app/guides/jpeg-in-2026-jpegli">Jpegli guide</a
				> shows how far the plain JPEG has come.
			</p>
			<p class="mb-4">
				There are three honest reasons to keep a photograph lossless, and they are all about the
				future rather than the present: you will edit it again (each lossy re-save compounds), you
				need it as evidence or a scientific record, or you are archiving a master from which every
				delivery copy will be made. For those, use lossless and accept the size. For everything
				else, including the listing photo, the blog hero, the message attachment and the social
				post, a well-encoded lossy file is the right answer, and "compress without losing quality"
				means "compress so that nobody can tell", which modern encoders do very well.
			</p>
			<p class="mb-4">
				If you are not sure which side of the line an image falls on, <a href="https://mochify.app"
					>mochify.app</a
				> defaults to a single high-quality encode on every surface; you only reach for lossless when
				you have a reason to.
			</p>
		</section>
		<section id="support" class="scroll-mt-24">
			<SectionHeading>Browser and app support for lossless formats in 2026</SectionHeading>
			<p class="mb-4">
				PNG and lossless WebP open in every browser in use, lossless AVIF in all current ones, and
				lossless JPEG XL in Safari today, with Chrome's default-on release scheduled for October
				2026 and Firefox's announced but not yet shipped at the time of writing. This section
				describes the state on October 2, 2026, the day this guide was published, and the JPEG XL
				picture is changing week by week; <a
					href="https://caniuse.com/jpegxl"
					target="_blank"
					rel="noopener noreferrer">caniuse.com/jpegxl</a
				> is the live reference if you are reading this later.
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>PNG:</strong> universal, including APNG animation in every major browser.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>WebP (lossless and lossy):</strong>
						<a href="https://caniuse.com/webp" target="_blank" rel="noopener noreferrer"
							>96.8% of browsers in use</a
						>. Chrome since version 32, Firefox since 65, Safari since 14 on macOS Big Sur or later
						(full support from Safari 16).
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>AVIF (lossless and lossy):</strong>
						<a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer">95.4%</a>.
						Chrome 85, Firefox 93, Safari 16.4 (16.1 to 16.3 partial), Edge 121.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>JPEG XL:</strong> Safari 17 and later decodes still images. Chrome 145 to 154
						ship the decoder behind the <code>#enable-jxl-image-format</code> flag; Chrome 155,
						whose stable release is scheduled for October 6, 2026, lists JPEG XL decoding in its
						release notes. Firefox compiled JPEG XL into release builds from version 152 (June 2026)
						behind a Firefox Labs toggle, and Mozilla's intent to ship names Firefox 158 as the
						default-on target; version 157, released September 29, 2026, does not enable it. Check
						<a href="https://caniuse.com/jpegxl" target="_blank" rel="noopener noreferrer"
							>caniuse.com/jpegxl</a
						>
						for the live picture, and read
						<a href="https://mochify.app/guides/chrome-145-jpeg-xl-default"
							>our Chrome and JPEG XL guide</a
						> for how to serve JXL with a fallback in the meantime.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>TIFF:</strong> Safari only, in web content. Every desktop image editor, and every
						print workflow, reads it.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				Outside the browser, the picture is simpler than it looks. macOS and iOS open PNG, WebP,
				AVIF and JPEG XL natively in current releases. Windows 11 reads PNG and WebP natively,
				relies on Microsoft Store extensions for AVIF in some configurations, and JPEG XL support
				there depends on the app. Design tools and office suites nearly all take PNG and
				increasingly WebP; JPEG XL is still the one to check before you send a file to someone whose
				software you do not know.
			</p>
		</section>
		<section id="traps" class="scroll-mt-24">
			<SectionHeading>Five ways a "lossless" file ends up lossy</SectionHeading>
			<p class="mb-4">
				A lossless format only guarantees that what the encoder received comes back out; it cannot
				protect you from what happened before the encoder, or from a setting that quietly switches
				the lossless mode off. Five of these account for nearly every "but it was lossless"
				complaint.
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Bit-depth reduction on export.</strong> Some export paths write 8 bits per channel
						from a 16-bit document (Photoshop's Quick Export is the commonly reported example, while Save
						As keeps 16). Lossless WebP is 8-bit by design. A 16-bit master "losslessly" saved through
						either path has lost half its precision before compression started. If the bit depth matters,
						confirm it in the output file.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Quality 100 instead of the lossless mode.</strong> WebP, AVIF and JPEG XL each
						have a lossy pipeline that runs even at the top quality setting. In our test,
						quality-100 AVIF differed from the source on every image. Look for the explicit flag:
						<code>-lossless</code>
						in cwebp, <code>-d 0</code> in cjxl, <code>--lossless</code> in avifenc, and, on
						Mochify, the word "lossless" in the prompt, the Lossless switch, or the
						<code>lossless=1</code> parameter.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Transparent-pixel cleanup.</strong> libwebp's lossless encoder, by default, is
						free to change the RGB values hidden under fully transparent pixels to improve
						compression. The image looks identical and the alpha is exact, but a byte comparison
						fails. If you need bit-exact RGBA, use the <code>exact</code> option.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Palette conversion.</strong> Saving to GIF, or to an 8-bit paletted PNG, quantizes
						any image with more than 256 colors. The compression that follows is lossless; the quantization
						was not.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Color-space and profile conversion.</strong> Converting between color spaces (Display
						P3 to sRGB, say) before encoding rounds every pixel, and the lossless encoder faithfully stores
						the rounded result. Keep the source profile when you need exactness, and embed it rather than
						converting.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				A sixth is worth a sentence because it is not pixel loss but is data loss: stripping
				metadata. Removing EXIF makes a file smaller and more private and leaves every pixel
				untouched, so a file with its metadata stripped is still lossless in the image sense. Just
				know that the capture date, camera and GPS are gone, which is usually the point.
			</p>
		</section>
		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify Workflow: a pixel-exact JPEG XL, WebP or PNG</SectionHeading>
			<p class="mb-4">
				Mochify's default on every surface is a single high-quality encode, so lossless is a choice
				you make deliberately, in one of three ways: say "lossless" in a Magic Flow prompt, turn on
				the Lossless switch on the PNG to JXL converter, or set the <code>lossless</code> parameter on
				the API. All three give pixel-exact JPEG XL, WebP or PNG. Here is the workflow for the cases above.
			</p>
			<GlassPanel>
				<StepList steps={workflowSteps} />
			</GlassPanel>
			<p class="mt-6 mb-0 text-base leading-relaxed text-[#875F42]">
				<strong>Privacy note for images.</strong> Whichever surface you use, the image travels over
				HTTPS to <code>api.mochify.app</code>, is encoded in memory, and is wiped immediately: no
				disk writes, no logs containing file data, and never used to train AI. The CLI and local MCP
				server return the result straight to your machine; the hosted MCP server holds only the
				compressed output behind a short-lived <code>files.mochify.app</code> URL for about five minutes
				so the agent can fetch it. Images are not processed on your device, so we do not describe them
				as never leaving it. (That line is true only of Mochify's video tools, which run entirely in the
				browser.)
			</p>
		</section>
		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat Sheet</SectionHeading>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr><th>If the image is...</th><th>Use</th><th>Because</th><th>Avoid</th></tr></thead
					><tbody
						><tr
							><td>A screenshot, UI, or app store image</td><td
								><strong>Lossless WebP</strong> (PNG where WebP is not accepted)</td
							><td
								>3 to 5x smaller than PNG or lossless JXL in our test; universal browser support</td
							><td>Lossy anything (bigger and blurrier on text)</td></tr
						>
						<tr
							><td>A diagram, chart or line art</td><td><strong>Lossless WebP</strong></td><td
								>Smallest on flat color and gradients alike</td
							><td>AVIF lossless (larger than PNG on our chart)</td></tr
						>
						<tr
							><td>A logo or cut-out with soft alpha</td><td
								><strong>Lossless WebP</strong> to ship, <strong>lossless JXL</strong> or PNG as master</td
							><td>WebP 14.9 KB, JXL 22.4 KB vs PNG 32 KB; alpha exact</td><td
								>GIF (1-bit alpha, 256 colors)</td
							></tr
						>
						<tr
							><td>A photograph to be viewed</td><td
								><strong>Lossy</strong> WebP, AVIF, JXL or jpegli JPEG</td
							><td>13.9x smaller than the best lossless file, visually identical</td><td
								>Lossless (a fifth off PNG at best)</td
							></tr
						>
						<tr
							><td>A photograph to be edited again, or a master</td><td
								><strong>Lossless JXL</strong> (16/32-bit) or <strong>16-bit PNG</strong>; TIFF for
								print</td
							><td>Keeps full precision; smallest lossless option</td><td
								>Lossless WebP (8-bit only)</td
							></tr
						>
						<tr
							><td>An existing JPEG</td><td><strong>Keep the JPEG</strong></td><td
								>Lossless re-encoding preserves the artifacts at several times the size</td
							><td>PNG "to make it lossless"</td></tr
						>
						<tr
							><td>Anything where "lossless" must be provable</td><td
								>Encode with the explicit lossless flag, then <code>compare -metric AE</code></td
							><td>Quality 100 is not lossless; WebP needs <code>exact</code> for RGBA</td><td
								>Trusting the setting name</td
							></tr
						></tbody
					>
				</table>
			</GuideTable>
			<p class="mb-4">
				Ten-second version: <strong
					>flat graphics, lossless WebP; photos, good lossy; masters, lossless JXL or 16-bit PNG;
					never lossless AVIF.</strong
				>
			</p>
		</section>
		<GlassFAQs items={faqItems} />

		<GlassCTA href="/" label="Try it free">
			Not sure which side of the line an image falls on? Drop it on Mochify and say what you want in
			plain English, for example <em>"convert these screenshots to lossless WebP"</em> or
			<em>"make this photo web-ready, keep it under 300 KB"</em>. The default is a single
			high-quality encode; lossless is one word away.
		</GlassCTA>

		<RelatedGuidesGrid guides={related} />
	</div>
</article>

<style>
	/* The breadcrumb renders in the shared guides layout at max-w-4xl; align
       it with this page's 3xl reading column. */
	:global(nav[aria-label='Breadcrumb']) {
		max-width: 48rem;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 1.25rem;
	}

	/* Match the article's mobile gutter (px-5 vs the breadcrumb's px-4). */
	@media (max-width: 767px) {
		:global(nav[aria-label='Breadcrumb']) {
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}
	}

	.hero-wash {
		position: absolute;
		top: -20rem;
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		height: 1450px;
		z-index: -1;
		pointer-events: none;
		background:
			radial-gradient(ellipse 60% 45% at 12% 8%, rgba(255, 179, 198, 0.4) 0%, transparent 70%),
			radial-gradient(ellipse 50% 40% at 90% 18%, rgba(224, 172, 213, 0.32) 0%, transparent 70%),
			radial-gradient(ellipse 45% 35% at 55% 55%, rgba(255, 214, 224, 0.25) 0%, transparent 70%);
		mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 100%);
		-webkit-mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 100%);
	}

	@media (max-width: 768px) {
		.hero-wash {
			height: 1000px;
			background:
				radial-gradient(ellipse 60% 45% at 12% 8%, rgba(255, 179, 198, 0.22) 0%, transparent 70%),
				radial-gradient(ellipse 50% 40% at 90% 18%, rgba(224, 172, 213, 0.16) 0%, transparent 70%),
				radial-gradient(ellipse 45% 35% at 55% 55%, rgba(255, 214, 224, 0.12) 0%, transparent 70%);
		}
	}
</style>
