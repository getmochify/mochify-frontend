<script>
	import ReadProgress from '$lib/components/ReadProgress.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
	import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
	import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
	import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
	import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
	import StepList from '$lib/components/guide-demo/StepList.svelte';
	import CodeCard from '$lib/components/guide-demo/CodeCard.svelte';
	import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

	// Built from content-ops `article-originals/jpeg-xl-chrome-support.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract.
	const metadata = {
		title: 'JPEG XL Is in Chrome: What Changes for Your Images, and What Does Not Yet',
		seoTitle: 'JPEG XL in Chrome - What Changes Now Chrome 155 Ships It',
		description:
			'Chrome 155 decodes JPEG XL by default from October 6, 2026; Firefox 158 follows on October 13. Browser table, caveats, and what to do by stack.',
		category: 'Image Formats',
		readTime: '20 min read',
		date: 'October 7, 2026',
		bylineNote:
			'Written the day after Chrome 155 shipped, with a dated support table and the caveats the release notes leave out.'
	};

	const keywords =
		'jpeg xl chrome, what browsers support jpeg xl, jpeg xl browser support, chrome 155 jpeg xl, jpeg xl firefox, jpeg xl safari, jpeg xl vs avif, jxl chrome';

	const pageUrl = 'https://mochify.app/guides/jpeg-xl-chrome-support';

	const toc = [
		{ id: 'what-shipped', label: 'What Chrome 155 actually shipped' },
		{ id: 'support-table', label: 'JPEG XL browser support, dated October 7, 2026' },
		{ id: 'fallback', label: 'Why you still need a fallback, and for how long' },
		{ id: 'serving', label: 'How to serve JPEG XL safely today' },
		{
			id: 'jxl-vs-avif',
			label: 'What JPEG XL gives you that AVIF and WebP do not (and the reverse)'
		},
		{ id: 'by-stack', label: 'What to do now, by stack' },
		{ id: 'mochify-workflow', label: 'Mochify Workflow: converting images to JPEG XL' },
		{ id: 'cheat-sheet', label: 'Cheat Sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const pictureCode = `<picture>
  <source type="image/jxl"  srcset="hero.jxl">
  <source type="image/avif" srcset="hero.avif">
  <source type="image/webp" srcset="hero.webp">
  <img src="hero.jpg" alt="Describe the image" width="1600" height="900">
</picture>`;

	const workflowSteps = [
		{
			title: 'Open the web app and describe the result',
			html: `<p>Drop up to three images (25 on a paid plan) into <a href="https://mochify.app/flow">mochify.app/flow</a> and type the goal: "convert these to JPEG XL for the web, max 1600px wide, strip location data". Magic Flow parses the instruction with a language model, then the C++ engine runs the resize, the EXIF strip and the JXL encode. One high-quality lossy encode per image is the default.</p>`
		},
		{
			title: 'Ask for lossless when you mean it',
			html: `<p>"Save as lossless JPEG XL" produces a pixel-exact file; the same instruction works on the CLI, both MCP servers and the API. On the API it is <code>lossless=1</code>, and it only applies to JXL, WebP and PNG output (JPG and AVIF return a 400 rather than quietly encoding lossy). A source that is already lossy, such as a JPEG, comes back as the best lossy encode with the <code>X-Mochify-Lossless: downgraded</code> header, because no encoder can restore what that file has already thrown away.</p>`
		},
		{
			title: 'Use the fixed-purpose converters for one-format jobs',
			html: `<p><a href="https://mochify.app/solutions/png-to-jxl">PNG to JXL</a> has a Lossless switch after upload (default off); <a href="https://mochify.app/jpg-to-jpegxl">JPG to JXL</a> and <a href="https://mochify.app/avif-to-jpegxl">AVIF to JXL</a> each run one high-quality re-encode; <a href="https://mochify.app/solutions/svg-to-jxl">SVG to JXL</a> rasterizes a vector at the long edge you pick, with transparency kept. These pages are converters, not prompt boxes: drop files, get files.</p>`
		},
		{
			title: 'Script it',
			html: `<p>From the CLI, <code>mochify photo.jpg -t jxl -o ./out</code>, or <code>mochify *.png -p "lossless JPEG XL"</code>. From code, <code>POST https://api.mochify.app/v1/squish?type=jxl</code> with <code>Authorization: Bearer &lt;key&gt;</code> and the image as the request body; the <a href="https://mochify.app/docs">API docs</a> have cURL, JavaScript and Python examples. Both MCP servers take the same instruction from an agent in plain language.</p>`
		},
		{
			title: 'Grab one image off any page',
			html: `<p>The <a href="https://mochify.app/chrome-extension">Chrome extension</a> adds a right-click "Convert to" menu with JPEG XL as an option; the file lands in Downloads with no prompt and no settings.</p>`
		}
	];

	const faqItems = [
		{
			q: 'Does Chrome support JPEG XL now?',
			a: `Yes. Chrome 155, released on October 6, 2026, decodes JPEG XL images by default on Windows, macOS, Linux, ChromeOS and Android, using the <code>jxl-rs</code> decoder written in Rust. Chrome 145 to 154 contain the decoder but keep it behind <code>chrome://flags/#enable-jxl-image-format</code>. Check your version at <code>chrome://version</code>; if it is below 155, restart Chrome to pick up the update.`
		},
		{
			q: 'Why did Chrome remove JPEG XL in 2023, and why is it back?',
			a: `Chrome 110 removed the original flag-gated support in February 2023, saying there was not enough ecosystem interest to justify maintaining it. In November 2025 Chrome said it would ship the format if a memory-safe decoder existed, and the Rust decoder <code>jxl-rs</code> was written to meet that condition. The Chrome team also cites developer demand through the Interop project as a reason for the reversal.`
		},
		{
			q: 'Does Firefox support JPEG XL?',
			a: `From Firefox 158, released on October 13, 2026, yes, on desktop and Android, including animation and progressive display. Firefox 157 does not, despite Mozilla's August intent to ship naming it; the preference was enabled by default for 158. Firefox currently displays HDR JPEG XL images as standard dynamic range.`
		},
		{
			q: 'Does Safari support JPEG XL?',
			a: `Safari 17 and later on macOS, iOS and iPadOS decode still JPEG XL images. Animated JXL and progressive decoding are not supported, which is why caniuse lists Safari as partial support.`
		},
		{
			q: 'Does Microsoft Edge support JPEG XL?',
			a: `Not as of October 7, 2026. Edge is built on Chromium and normally inherits Chromium features within days or weeks of a Chrome release, but Microsoft has made no statement and Edge 155 had not shipped. Treat Edge as unsupported until its release notes say otherwise.`
		},
		{
			q: 'Do I still need an AVIF or WebP fallback for JPEG XL?',
			a: `Yes, for at least the rest of 2026. Installed Chrome versions lag the release by weeks, Edge and Samsung Internet have not moved, and email clients and chat apps do not decode the format. Serve JXL as the first <code>&lt;source&gt;</code> in a <code>&lt;picture&gt;</code> element with AVIF and WebP below it and a JPEG <code>&lt;img&gt;</code> fallback.`
		},
		{
			q: 'Should I switch from AVIF to JPEG XL?',
			a: `No, add rather than switch. AVIF usually produces the smaller file at the quality most web photos are served at and reaches more installed browsers today. JPEG XL wins for lossless images, for high-fidelity photography, for progressive loading and for recompressing existing JPEGs reversibly. Put JXL above AVIF in the cascade where it is smaller, and keep both.`
		},
		{
			q: 'How do I check whether my browser can display JPEG XL?',
			a: `Open a known <code>.jxl</code> image, such as the test page on jpegxl.info, in the browser you want to check; if it renders, the browser decodes the format. In script, decode a one-pixel JXL data URI into an <code>Image</code> and test <code>naturalWidth</code> for a value above zero. Do not rely on the user-agent string, because a browser version can be new enough and still have the feature off.`
		}
	];

	const related = [
		{
			title: 'Converting Images to JPEG XL: The Practical Guide for 2026',
			href: '/guides/converting-images-to-jpeg-xl',
			desc: 'every conversion path to JXL, with benchmarks and the fallback pattern.'
		},
		{
			title: 'What Is a JXL File? How to Open, Convert and Share JPEG XL',
			href: '/guides/what-is-a-jxl-file',
			desc: 'what to do with a .jxl someone sent you.'
		},
		{
			title: 'Lossless Image Formats: Which One to Use, and When Lossless Is the Wrong Choice',
			href: '/guides/lossless-image-formats',
			desc: 'PNG, WebP, JPEG XL and AVIF tested lossless on six images.'
		},
		{
			title: 'The 2026 Guide to Next-Gen Formats: WebP, AVIF, and JPEG XL',
			href: '/guides/2026-guide-next-gen-formats',
			desc: 'the full comparison of the three formats.'
		},
		{
			title: 'JPEG XL vs PNG for Screenshots: Half the Size, Same Pixels',
			href: '/guides/jxl-vs-png-for-screenshots',
			desc: 'the single-comparison deep dive behind the 46% figure.'
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
		datePublished: '2026-10-07',
		dateModified: '2026-10-07',
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
		about: [
			'JPEG XL',
			'Chrome 155',
			'Firefox 158',
			'Safari',
			'AVIF',
			'WebP',
			'jxl-rs',
			'picture element'
		].map((name) => ({ '@type': 'Thing', name })),
		keywords,
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
		datePublished: '2026-10-07',
		dateModified: '2026-10-07'
	};
</script>

<ReadProgress />

<svelte:head>
	<title>{metadata.seoTitle}</title>
	<meta name="description" content={metadata.description} />
	<meta name="keywords" content={keywords} />
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
			JPEG XL Is in Chrome: What Changes for Your Images, and What Does Not Yet
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			Chrome supports JPEG XL. As of Chrome 155, released on October 6, 2026, the browser decodes
			<code>.jxl</code> images by default on every platform it ships on, with no flag, using a new
			decoder written in Rust. Firefox 158 switches its own JPEG XL decoder on by default a week
			later, on October 13. Safari has opened still JXL images since Safari 17 in 2023. That is the
			headline, and it is a real one: the format that Chrome dropped in 2023 is back in the three
			major engines within the same fortnight. What the headline leaves out is the part you have to
			plan around. Chrome 155 being released is not the same as Chrome 155 being installed; the
			morning after the release, our own Mac was still on Chrome 152. Safari still cannot show
			animated or progressively loading JXL. Edge has said nothing. Shopify will not accept a
			<code>.jxl</code> upload. This guide gives you the dated support table, the caveats nobody prints
			next to it, and a what-to-do list by stack so you can decide whether JPEG XL goes into your pipeline
			this month or next quarter.
		</p>

		<div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
			<p class="m-0 text-base leading-relaxed text-[#6C3F31]">
				<strong class="text-[#4A2C2C]"
					>Published {metadata.date} by the Mochify Engineering Team.</strong
				>
				{metadata.bylineNote}
			</p>
		</div>
	</header>

	<div class="space-y-12">
		<section>
			<GuideTOC items={toc} />
		</section>

		<section id="what-shipped" class="scroll-mt-24">
			<SectionHeading>What Chrome 155 actually shipped</SectionHeading>
			<p class="mb-4">
				Chrome 155 decodes JPEG XL images on by default, on Windows, macOS, Linux, ChromeOS, Android
				and Android WebView, with a decoder called <code>jxl-rs</code> that is written entirely in
				Rust. That is the whole change, and it is the one that matters: a
				<code>&lt;img src="photo.jxl"&gt;</code> renders in Chrome 155 the way a WebP or AVIF does, with
				no setting for the user to flip.
			</p>
			<p class="mb-4">
				The announcement came from the Chrome team on October 6 in a post titled <a
					href="https://developer.chrome.com/blog/jpeg-xl-in-chrome"
					target="_blank"
					rel="noopener noreferrer">Shipping JPEG XL in Chrome</a
				>, and the same day's
				<a
					href="https://chromestatus.com/release-notes/155"
					target="_blank"
					rel="noopener noreferrer">Chrome 155 release notes</a
				> list "JPEG XL decoding support (image/jxl) in blink". Two details from the post are worth keeping:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>The decoder is new, not the one Chrome removed.</strong> The 2021 experiment
						used
						<code>libjxl</code>, the C++ reference implementation. Chrome's position since late 2025
						was that it would ship JPEG XL only with a memory-safe decoder, because image decoders
						parse untrusted bytes inside the renderer and have been a reliable source of browser
						vulnerabilities. <code>jxl-rs</code> is that decoder. Google says fuzzing and code review
						have found no memory-safety bugs across its history, and that its SIMD layer gets it to roughly
						the speed of the C++ implementation.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Google's own advice is "try both".</strong> The post recommends testing AVIF and JPEG
						XL against each other, and says JPEG XL is "most helpful for high-fidelity or lossless compression,
						especially of photographic images", or where fine-grained progressive loading matters. That
						is a narrower pitch than "replace everything", and it is the right one.
					</p>
				</li>
			</ul>
			<p class="mb-4">The timeline, for anyone who lost track:</p>
			<GuideTable class="my-6">
				<table>
					<thead><tr><th>Date</th><th>Event</th></tr></thead>
					<tbody>
						<tr><td>2021</td><td>Chromium adds JPEG XL behind a flag (versions 91 to 109)</td></tr>
						<tr
							><td>February 2023</td><td
								>Chrome 110 removes it, citing too little ecosystem interest</td
							></tr
						>
						<tr><td>September 2023</td><td>Safari 17 ships JPEG XL for still images</td></tr>
						<tr
							><td>November 2025</td><td
								>Chrome says it will ship JPEG XL once a memory-safe decoder exists</td
							></tr
						>
						<tr
							><td>January 2026</td><td
								><code>jxl-rs</code> lands in Chromium 145 behind
								<code>chrome://flags/#enable-jxl-image-format</code></td
							></tr
						>
						<tr
							><td>August 24, 2026</td><td
								>Chrome and Mozilla post intents to ship on the same day</td
							></tr
						>
						<tr><td>October 6, 2026</td><td>Chrome 155 stable: JPEG XL on by default</td></tr>
						<tr><td>October 13, 2026</td><td>Firefox 158 stable: JPEG XL on by default</td></tr>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				We covered the February step in <a
					href="https://mochify.app/guides/chrome-145-jpeg-xl-default"
					>Does Chrome 145 Enable JPEG XL by Default?</a
				>, and the answer to that question is still no. The answer to "does Chrome support JPEG XL"
				changed on October 6.
			</p>
		</section>

		<section id="support-table" class="scroll-mt-24">
			<SectionHeading>JPEG XL browser support, dated October 7, 2026</SectionHeading>
			<p class="mb-4">
				Three engines decode JPEG XL from mid-October 2026: Chrome from 155, Firefox from 158, and
				Safari from 17. Each comes with a caveat, and the caveats are different.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr
							><th>Browser</th><th>JPEG XL</th><th>Since</th><th>Caveats (October 7, 2026)</th></tr
						></thead
					>
					<tbody>
						<tr
							><td>Chrome (desktop)</td><td>Yes, by default</td><td>155 (October 6, 2026)</td><td
								>Rollout to installed browsers takes weeks; versions 145 to 154 need the flag</td
							></tr
						>
						<tr
							><td>Chrome for Android</td><td>Yes, per the intent to ship</td><td>155</td><td
								>Listed as shipping on Android and WebView in Chrome's <a
									href="https://groups.google.com/a/chromium.org/g/blink-dev/c/-gDojQbDPRI"
									target="_blank"
									rel="noopener noreferrer">Intent to Ship</a
								>; caniuse's Android row had not caught up on October 7</td
							></tr
						>
						<tr
							><td>Edge</td><td>Not yet</td><td>n/a</td><td
								>Built on Chromium; no statement from Microsoft; Edge 155 had not shipped on October
								7</td
							></tr
						>
						<tr
							><td>Firefox</td><td>Yes, by default</td><td>158 (October 13, 2026)</td><td
								>Firefox 157 does not have it (the August intent said 157; the pref flipped for
								158). Animation and progressive display supported; HDR JXL is shown as SDR</td
							></tr
						>
						<tr
							><td>Safari (macOS, iOS, iPadOS)</td><td>Still images only</td><td
								>17 (September 2023)</td
							><td>No animated JXL, no progressive decoding; uses the C++ decoder</td></tr
						>
						<tr
							><td>Samsung Internet, Opera, Brave, Vivaldi</td><td>Not yet</td><td>n/a</td><td
								>Chromium derivatives pick the change up on their own schedules</td
							></tr
						>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				Sources: the <a href="https://caniuse.com/jpegxl" target="_blank" rel="noopener noreferrer"
					>caniuse JPEG XL table</a
				>
				(which records Chrome 155+ and Firefox 158+ as supported and Safari 17+ as partial, with the
				notes "Supports still images. Animated image sequences are not supported" and "Partial
				support refers to not supporting progressive decoding"), Chrome's release notes and intent
				to ship, and Mozilla's
				<a
					href="https://bugzilla.mozilla.org/show_bug.cgi?id=2065096"
					target="_blank"
					rel="noopener noreferrer">Bugzilla entry</a
				>
				enabling the <code>image.jxl.enabled</code> preference by default with a target of Firefox 158.
			</p>
			<p class="mb-4">
				One number to treat carefully: on October 7 caniuse put global support at about 17%, almost
				all of it Safari. That figure is a snapshot taken the day after Chrome's release and before
				Firefox's, so it measures installed browsers, not shipping ones. It will climb through
				October and November as Chrome and Firefox auto-update, and it will stall below the AVIF
				line until Edge and Samsung Internet move. Quote the date with the number or do not quote
				it.
			</p>
		</section>

		<section id="fallback" class="scroll-mt-24">
			<SectionHeading>Why you still need a fallback, and for how long</SectionHeading>
			<p class="mb-4">
				You still need a non-JXL fallback for every image you serve on the open web, and you will
				need it for months, not days. A stable release is the start of a rollout, not the end of
				one, and three things sit between "Chrome 155 is out" and "my visitors can decode JXL".
			</p>
			<p class="mb-4">
				<strong>Installed versions lag the release.</strong> Chrome updates itself in the background,
				but only when the browser is restarted and only as Google ramps the release across its user base.
				We checked our own Mac the morning after the announcement and it reported Chrome 152. Enterprise
				fleets pin versions for longer. For a few weeks, a meaningful share of "Chrome" traffic is Chrome
				152, 153 and 154, none of which decode JXL without the flag.
			</p>
			<p class="mb-4">
				<strong>The other Chromium browsers have not moved.</strong> Edge, Samsung Internet, Opera, Brave
				and Vivaldi all inherit Chromium's decoder, but each ships on its own cadence and each can leave
				a feature off. Edge is the one that matters for desktop traffic, and as of October 7 Microsoft
				has said nothing. Treat Edge as unsupported until its own release notes say otherwise.
			</p>
			<p class="mb-4">
				<strong>Everything that is not a browser.</strong> Email clients render images with their
				own engines, and none of the big ones have announced JXL. Slack, Notion, Jira and most chat
				apps show an uploaded <code>.jxl</code> as a broken thumbnail or an undownloadable attachment.
				Windows still needs an add-on to preview the format. A JXL that renders perfectly in Chrome 155
				is still the wrong file to attach to a message.
			</p>
			<p class="mb-4">
				How long is "months"? Nobody publishes a rollout curve, so here is the honest version: check
				the caniuse share monthly, and drop the fallback when the browsers your analytics actually
				show have cleared the version line. For a consumer site in late 2026 that is a question for
				the new year, not for this quarter.
			</p>
		</section>

		<section id="serving" class="scroll-mt-24">
			<SectionHeading>How to serve JPEG XL safely today</SectionHeading>
			<p class="mb-4">
				The safe way to serve JPEG XL in October 2026 is the <code>&lt;picture&gt;</code> element
				with a <code>type</code> attribute per source, JXL first, then AVIF, then WebP, then a JPEG
				<code>&lt;img&gt;</code> that every client on earth can open. The browser picks the first
				<code>&lt;source&gt;</code> whose MIME type it can decode and ignores the rest, so a browser that
				cannot decode JXL never requests the file.
			</p>
			<CodeCard filename="hero.html" code={pictureCode} />
			<p class="mb-4">Three practical notes:</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong
							>Put <code>width</code> and <code>height</code> on the
							<code>&lt;img&gt;</code>.</strong
						> The fallback image's dimensions reserve the layout box for whichever source wins, which
						is what keeps your CLS at zero while the browser decides.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Do not ship a bare <code>&lt;img src="x.jxl"&gt;</code>.</strong> On Chrome 152, Edge,
						and every email client it is a broken image, and a broken LCP image is an LCP failure. This
						was true last week and it is true this week.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Content negotiation is a separate question.</strong> Services that pick a format
						on the server read the <code>Accept</code> request header. Safari has advertised
						<code>image/jxl</code> there since 17; we could not confirm from Chrome's announcement
						or release notes whether 155 adds it, so if your CDN negotiates formats, check its
						documentation for JPEG XL specifically rather than assuming the new Chrome will be
						served JXL automatically. The
						<code>&lt;picture&gt;</code> route does not depend on the header at all.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				For feature detection in script, decoding a one-pixel JXL data URI and checking
				<code>naturalWidth</code> is the reliable test; the format-sniffing shortcuts that work for
				WebP (checking <code>canvas.toDataURL</code>) do not apply, because browsers decode JXL but
				do not encode it.
			</p>
			<p class="mb-4">
				Ready to make the JXL variants? <a href="https://mochify.app/flow"
					>Convert a batch to JPEG XL</a
				>
				by describing what you want, or go straight to the
				<a href="https://mochify.app/solutions/png-to-jxl">PNG to JXL converter</a> if the source is PNG.
			</p>
		</section>

		<section id="jxl-vs-avif" class="scroll-mt-24">
			<SectionHeading
				>What JPEG XL gives you that AVIF and WebP do not (and the reverse)</SectionHeading
			>
			<p class="mb-4">
				JPEG XL earns its place for lossless work, for high-fidelity photography, for progressive
				loading and for recompressing existing JPEGs without loss; AVIF stays the stronger choice
				for ordinary web photos at the file sizes most sites actually serve. Google's advice to try
				both is not hedging. The formats are good at different things, and the two browser vendors
				said so in nearly the same words: Mozilla's intent to ship describes JPEG XL as excelling
				"at lossless imagery, progressive rendering, and further compressing JPEGs without quality
				loss" and AVIF at "web-quality photographic images".
			</p>
			<p class="mb-4">Where JPEG XL wins:</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Lossless.</strong> JPEG XL's lossless mode is the best general-purpose lossless
						image coder in a browser today. In
						<a href="https://mochify.app/guides/jxl-vs-png-for-screenshots">our screenshot test</a>,
						one 1440x900 macOS screenshot came out at 1.84 MiB as a PNG and 0.99 MiB as a lossless
						JXL, a 46% saving with identical pixels. In our six-image lossless benchmark,
						<a href="https://mochify.app/guides/lossless-image-formats"
							>lossless JXL edged lossless WebP on photographs</a
						> and lossless AVIF never came first. One caveat from Chrome's own intent-to-ship thread:
						a reviewer measured the new decoder's lossless path at roughly 30 times slower than WebP's
						lossless decode on one test image, so for flat graphics that will be viewed in a browser,
						lossless WebP remains the quicker file to display as well as, in our tests, the smaller one.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Reversible JPEG recompression.</strong> A JPEG can be re-wrapped as a JXL about 20%
						smaller and converted back to the byte-identical original on demand. No other web format can
						do this. For an archive of existing JPEGs it is free space with zero risk.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Progressive decoding.</strong> A JXL can render a usable low-resolution image from
						the first bytes and refine as the rest arrives. Chrome and Firefox decode it progressively;
						Safari does not. AVIF has no comparable mode.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Bit depth and gamut.</strong> Up to 32 bits per channel, wide gamut and HDR in the
						format itself. (Note that Firefox currently displays HDR JXL as SDR, and that Mochify's own
						JXL output is standard range; see the workflow section.)
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Big images.</strong> JXL's size limit is over a billion pixels on a side; WebP stops
						at 16,383.
					</p>
				</li>
			</ul>
			<p class="mb-4">Where AVIF wins:</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Low and medium bitrates.</strong> For a product photo or a blog hero at the quality
						most sites serve, AVIF usually produces the smaller file. Google's own codec comparisons have
						AVIF ahead at the bitrates typical of web delivery, and the Chrome blog's "30-50% better than
						JPEG" figure for JXL is in the same range as AVIF's, not above it.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Installed base.</strong> AVIF has been in Chrome since 85, Firefox since 93 and Safari
						since 16.4, and it is in Edge and Samsung Internet. For the next several months it reaches
						more people than JXL by a wide margin.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				The practical reading: if you already serve AVIF, you are not behind. Add JXL at the top of
				the cascade where it is cheaper or where you need lossless or progressive; keep AVIF as the
				second source; keep WebP and JPEG below that. The decision is covered format by format in <a
					href="https://mochify.app/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl"
					>WebP, AVIF or JPEG XL in 2026?</a
				>.
			</p>
		</section>

		<section id="by-stack" class="scroll-mt-24">
			<SectionHeading>What to do now, by stack</SectionHeading>
			<p class="mb-4">
				What you should do this month depends on who serves your images, not on the format's merits.
				Here is the list.
			</p>
			<p class="mb-4">
				<strong>You run a static site or your own build pipeline.</strong> Add a JXL variant to your
				image step and put it first in <code>&lt;picture&gt;</code>. If you encode with
				<code>cjxl</code>
				from libjxl, <code>cjxl photo.jpg photo.jxl</code> performs the reversible JPEG transcode by
				default, and <code>-d 0</code> gives lossless from any source. If your build uses Node's
				<code>sharp</code>, check that your installed build includes the JXL codec before relying on
				it; the prebuilt binaries have historically shipped without it. Or hand the encode to an
				API: Mochify's <code>POST /v1/squish?type=jxl</code> returns a JXL for any JPEG, PNG, WebP, AVIF,
				HEIC or SVG you send it.
			</p>
			<p class="mb-4">
				<strong>You use an image CDN.</strong> This is where the format arrives with the least work,
				and where the provider decides.
				<a
					href="https://www.fastly.com/documentation/reference/io/format/"
					target="_blank"
					rel="noopener noreferrer">Fastly Image Optimizer</a
				>
				accepts <code>format=jxl</code> and its <code>auto</code> mode prioritizes "JPEGXL, AVIF,
				WebP" in that order. Cloudinary has offered <code>f_jxl</code> since 2020; check its current
				automatic-format behavior. Cloudflare Images' documented <code>format</code> values are auto,
				avif, webp, jpeg and baseline-jpeg, with no JXL output at the time of writing. If your CDN cannot
				produce JXL, nothing changes for you until it can.
			</p>
			<p class="mb-4">
				<strong>You run WordPress.</strong> WordPress 7.1's client-side media pipeline decodes HEIC,
				WebP and AVIF in the browser and outputs JPEG, PNG, WebP, AVIF and GIF; JPEG XL appeared in
				the June test build's decode list but is in neither list in the release documentation, core
				has no JXL encoder, and a .jxl upload is still refused because core does not register the
				MIME type. Keep serving AVIF with WebP and JPEG below it, as in our
				<a href="https://mochify.app/guides/next-gen-image-formats-wordpress"
					>WordPress next-gen formats guide</a
				>, and revisit when a plugin or core adds JXL output. You can hand-place a JXL in a
				<code>&lt;picture&gt;</code> block today, but you cannot make the media library generate one.
			</p>
			<p class="mb-4">
				<strong>You sell on Shopify or a marketplace.</strong> Nothing changes. Shopify's accepted
				upload formats are JPEG, progressive JPEG, PNG, GIF, HEIC and WebP, and its storefront image
				transforms output JPG, PNG and WebP. A <code>.jxl</code> upload is refused. Our
				<a href="https://mochify.app/guides/is-jpeg-xl-ready-for-shopify-product-images"
					>JPEG XL for Shopify</a
				> answer stands: keep your masters as lossless JXL if you like, upload JPEG or PNG.
			</p>
			<p class="mb-4">
				<strong>You are a photographer or keep an archive.</strong> This is the group the release
				changes most, and the change is not about delivery. Chrome and Firefox decoding JXL means a
				<code>.jxl</code> sent to a client or a picture editor opens in their browser, where last month
				it did not. For storage, the lossless JPEG transcode is the move: 20% back on an existing JPEG
				library with a byte-exact undo, and lossless JXL from RAW-derived TIFFs or PNGs at a fraction
				of their size. For delivery, keep sending JPEG until the recipient's tools catch up; the format
				opening in a browser does not mean it opens in Lightroom or an email preview.
			</p>
			<p class="mb-4">
				<strong>You build agent or API pipelines.</strong> Add <code>type=jxl</code> as an output
				option and let the consumer choose. The format is a safe target now because the two browsers
				your users run will decode it, and the API accepts JXL as input too, so a JXL-in, AVIF-out
				step costs nothing extra. See
				<a href="https://mochify.app/guides/how-the-mochify-mcp-server-works"
					>how the Mochify MCP server works</a
				> for the agent surfaces.
			</p>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify Workflow: converting images to JPEG XL</SectionHeading>
			<p class="mb-4">
				Every Mochify image surface can output JPEG XL, and the fastest path is to say so in plain
				English. Here is the workflow for a batch of web images, followed by the other surfaces.
			</p>
			<GlassPanel>
				<StepList steps={workflowSteps} />
			</GlassPanel>
			<p class="mt-6 mb-4">
				Two honest limits. Mochify's JPG to JXL path is a decode and re-encode, not JXL's reversible
				JPEG transcode; if you want the byte-exact round trip for an archive, use <code>cjxl</code>,
				and use Mochify for the web variants. And Mochify's JXL output is standard dynamic range:
				the HDR gain-map path exists for JPG output only.
			</p>
			<p class="mb-0 text-base leading-relaxed text-[#875F42]">
				<strong>Privacy, for this workflow:</strong> images travel to <code>api.mochify.app</code>
				over HTTPS, are encoded in RAM, and are wiped immediately with no disk writes, no logs
				containing file data, and no use for AI training. That holds for the web app, the CLI, the
				Chrome extension, the API and both MCP servers; the CLI and local MCP server are clients
				over the same API and do not encode locally. The hosted MCP server holds the compressed
				output for up to five minutes on
				<code>files.mochify.app</code> so the agent can fetch it. The "never leaves your device" line
				belongs only to Mochify's video tools, which run in the browser.
			</p>
		</section>

		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat Sheet</SectionHeading>
			<GuideTable class="my-6">
				<table>
					<thead><tr><th>You want to...</th><th>Do this in October 2026</th><th>Why</th></tr></thead
					>
					<tbody>
						<tr
							><td>Know if Chrome shows <code>.jxl</code></td><td
								>Chrome 155 or later does, by default</td
							><td>Shipped October 6, 2026; 145 to 154 need the flag</td></tr
						>
						<tr
							><td>Know if Firefox shows <code>.jxl</code></td><td>Firefox 158 or later does</td><td
								>Ships October 13, 2026; 157 does not</td
							></tr
						>
						<tr
							><td>Know if Safari shows <code>.jxl</code></td><td
								>Safari 17 or later does, still images only</td
							><td>No animation, no progressive decode</td></tr
						>
						<tr
							><td>Know about Edge</td><td>Treat as no</td><td
								>No Microsoft statement; Edge 155 not out on October 7</td
							></tr
						>
						<tr
							><td>Serve JXL on a public site</td><td
								><code>&lt;picture&gt;</code> with JXL, AVIF, WebP sources and a JPEG
								<code>&lt;img&gt;</code></td
							><td
								>Installed browsers lag the release by weeks; Edge and email clients do not decode
								it</td
							></tr
						>
						<tr
							><td>Decide JXL vs AVIF for a web photo</td><td
								>Test both; AVIF usually smaller at web quality, JXL at high quality</td
							><td>Google and Mozilla both say so</td></tr
						>
						<tr
							><td>Shrink an archive of JPEGs</td><td
								><code>cjxl</code> reversible transcode, about 20% smaller</td
							><td>Byte-exact undo; no other format does this</td></tr
						>
						<tr
							><td>Store lossless masters</td><td
								>Lossless JXL (Mochify: "lossless" in the prompt, the PNG to JXL switch, or
								<code>lossless=1</code>)</td
							><td>Smallest lossless on photos; 46% under PNG on our screenshot</td></tr
						>
						<tr
							><td>Upload to Shopify or a marketplace</td><td>JPEG or PNG, as before</td><td
								>JXL uploads are refused</td
							></tr
						>
						<tr
							><td>Send a <code>.jxl</code> in email or chat</td><td>Do not; send JPEG or PNG</td
							><td>Email clients and chat apps do not render it</td></tr
						>
						<tr
							><td>Drop the fallback</td><td>Not yet; re-check caniuse monthly</td><td
								>Edge, Samsung Internet and pinned enterprise versions</td
							></tr
						>
					</tbody>
				</table>
			</GuideTable>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA href="/" label="Try it free">
			Ready to add JPEG XL above your AVIF and WebP sources? Convert a batch at <a
				href="https://mochify.app">mochify.app</a
			>
			and prompt <em>"convert these to JPEG XL for the web, max 1600px wide"</em>. You get a JXL
			variant of every image, ready to drop into your picture element.
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
