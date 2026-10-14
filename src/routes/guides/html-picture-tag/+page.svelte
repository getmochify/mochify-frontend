<script>
	import ReadProgress from '$lib/components/ReadProgress.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
	import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
	import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
	import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
	import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
	import CodeCard from '$lib/components/guide-demo/CodeCard.svelte';
	import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

	// Built from content-ops `article-originals/html-picture-tag.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract.
	const metadata = {
		title:
			'The HTML <picture> Tag (Picture Element): Format Fallbacks, Art Direction and the 2026 Source Order',
		seoTitle: 'HTML Picture Tag (Picture Element) - AVIF to JPEG Fallbacks',
		description:
			'The HTML picture tag, explained: AVIF, WebP and JPEG fallbacks in the right order, art direction, dark mode, and the four rules that make it render.',
		category: 'Web Performance',
		readTime: '37 min read',
		date: 'October 14, 2026',
		bylineNote:
			'Written from the questions people actually bring to the picture element, with the source order and support figures dated October 2026.'
	};

	const keywords =
		'picture tag html, html picture element, picture element, picture tag html responsive, picture tag vs img tag, img srcset vs picture, webp fallback to jpg, picture element dark mode, html picture srcset, picture source media';

	const pageUrl = 'https://mochify.app/guides/html-picture-tag';

	const toc = [
		{ id: 'five-words', label: 'Five words this guide uses' },
		{ id: 'the-snippet', label: 'The snippet that fixes "Serve images in modern formats"' },
		{ id: 'four-rules', label: 'The four rules that make the picture element work' },
		{
			id: 'which-source-loaded',
			label: 'Does it download every source? How to see which one loaded'
		},
		{ id: 'art-direction', label: 'Art direction: a different crop per screen with media' },
		{ id: 'dark-mode', label: 'Dark mode images with prefers-color-scheme (and its limit)' },
		{
			id: 'source-order',
			label: 'The 2026 source order: AVIF, WebP, JPEG, and where JPEG XL fits'
		},
		{ id: 'limits', label: 'Two things the picture tag cannot do: HDR and CSS backgrounds' },
		{ id: 'picture-vs-srcset', label: 'The HTML picture tag vs srcset vs a plain <img>' },
		{ id: 'mochify-workflow', label: 'Mochify Workflow: making the AVIF, WebP and JPEG files' },
		{ id: 'cheat-sheet', label: 'Cheat Sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const snippetCode = `<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="A kayak on a still lake at sunrise"
       width="1600" height="900" loading="lazy" decoding="async">
</picture>`;

	const noTypeCode = `<source srcset="hero.avif">`;

	const artDirectionSimpleCode = `<picture>
  <source media="(min-width: 1024px)" srcset="kitchen-wide.jpg">
  <img src="kitchen-tall.jpg" alt="A coffee grinder on a kitchen counter"
       width="900" height="1200">
</picture>`;

	const artDirectionFullCode = `<picture>
  <!-- Wide screens: the wide crop, in AVIF, then WebP, then JPEG -->
  <source media="(min-width: 1024px)" srcset="kitchen-wide.avif" type="image/avif">
  <source media="(min-width: 1024px)" srcset="kitchen-wide.webp" type="image/webp">
  <source media="(min-width: 1024px)" srcset="kitchen-wide.jpg" type="image/jpeg">
  <!-- Everything else: the tall crop, in AVIF, then WebP -->
  <source srcset="kitchen-tall.avif" type="image/avif">
  <source srcset="kitchen-tall.webp" type="image/webp">
  <!-- The fallback: the tall crop as a JPEG -->
  <img src="kitchen-tall.jpg" alt="A coffee grinder on a kitchen counter"
       width="900" height="1200" loading="lazy" decoding="async">
</picture>`;

	const breakpointsBrokenCode = `<!-- Broken: a 1440px laptop never gets the ultrawide crop -->
<source media="(max-width: 1023px)" srcset="kitchen-tall.jpg">
<source media="(min-width: 1024px)" srcset="kitchen-wide.jpg">
<source media="(min-width: 1440px)" srcset="kitchen-ultrawide.jpg">
<img src="kitchen-tall.jpg" alt="...">`;

	const breakpointsFixedCode = `<!-- Fixed: biggest first, phones fall through to the <img> -->
<source media="(min-width: 1440px)" srcset="kitchen-ultrawide.jpg">
<source media="(min-width: 1024px)" srcset="kitchen-wide.jpg">
<img src="kitchen-tall.jpg" alt="...">`;

	const darkModeCode = `<picture>
  <source srcset="logo-light-text.avif" media="(prefers-color-scheme: dark)" type="image/avif">
  <source srcset="logo-light-text.png" media="(prefers-color-scheme: dark)">
  <source srcset="logo-dark-text.avif" type="image/avif">
  <img src="logo-dark-text.png" alt="Acme" width="160" height="40">
</picture>`;

	const cliCode = `brew install mochify
mochify auth login                       # one-time browser sign-in
mochify ./images/*.jpg -t avif -o ./avif
mochify ./images/*.jpg -t webp -o ./webp
mochify ./images/*.jpg -t avif -w 1200 -o ./avif-1200   # resized variants`;

	const faqItems = [
		{
			q: 'Why does my picture tag show nothing at all?',
			a: `Almost always because the <code>&lt;img&gt;</code> is missing. The <code>&lt;picture&gt;</code> element only provides context for its <code>&lt;img&gt;</code>; the <code>&lt;source&gt;</code> elements are conditions, and without an <code>&lt;img&gt;</code> there is nothing for any browser to render. The other common cause is a <code>&lt;source&gt;</code> with no <code>type</code> pointing at a format the browser cannot open: the browser selects it, fails to decode it, and shows a broken image instead of falling through. Add the <code>&lt;img&gt;</code> and give every format source a MIME <code>type</code>.`
		},
		{
			q: 'Does the order of the source tags matter?',
			a: `Yes, completely. The browser reads the <code>&lt;source&gt;</code> elements from the top and uses the first one whose <code>media</code> condition is true and whose <code>type</code> it can open; everything after it is ignored. Put the format you most want served first (AVIF above WebP), and with <code>media</code> conditions list the largest <code>min-width</code> breakpoint first or the smallest <code>max-width</code> first.`
		},
		{
			q: 'Does the browser download all the images in a picture element?',
			a: `No. The browser decides which source to use from the <code>media</code> and <code>type</code> attributes before it downloads anything, then fetches that one file. The other sources cost nothing. If the window later crosses a <code>media</code> breakpoint, for example on a tablet turned sideways, the browser may fetch the newly matching file, but on first load it is one download per <code>&lt;picture&gt;</code>.`
		},
		{
			q: 'Can I put a class or width on the picture tag?',
			a: `You can, but it will not do what you want. The <code>&lt;img&gt;</code> is the element that is drawn and laid out, so <code>class</code>, <code>width</code>, <code>height</code>, <code>style</code> and any CSS that targets the image need to be on the <code>&lt;img&gt;</code>. The <code>&lt;picture&gt;</code> is a wrapper with no box of its own in most layouts; styling it is like styling a <code>&lt;span&gt;</code> around the image.`
		},
		{
			q: 'Do I still need a JPEG fallback for WebP and AVIF in 2026?',
			a: `Yes. In caniuse's September 2026 data 97.18% of global users have a WebP-capable browser and 96.35% an AVIF-capable one, which still leaves roughly 3 in 100 visitors who open neither, plus every crawler, link preview and tool that only reads the <code>&lt;img src&gt;</code>. Google Search Central explicitly recommends a <code>src</code> fallback. The JPEG is the file you already had, so keeping it costs nothing.`
		},
		{
			q: 'Does Google index images inside a picture element?',
			a: `Google asks you to provide a fallback <code>&lt;img&gt;</code> with a <code>src</code> attribute whenever you use <code>&lt;picture&gt;</code>, and says it can find images in the <code>src</code> of an <code>&lt;img&gt;</code> even when that <code>&lt;img&gt;</code> is a child of other elements. Keep the <code>&lt;img&gt;</code> present, give it a real <code>src</code> and a descriptive <code>alt</code>, and the image is discoverable; the <code>&lt;source&gt;</code> URLs are not the ones to rely on for image search. Google does not index CSS background images at all.`
		},
		{
			q: "Why does my dark-mode picture not change when I click my site's theme toggle?",
			a: `Because <code>prefers-color-scheme</code> reports the phone's or computer's own dark-mode setting, not a switch on your site. A <code>&lt;source media="(prefers-color-scheme: dark)"&gt;</code> changes only when the visitor's device goes dark. A site-level toggle needs to do the swap itself, by showing and hiding two <code>&lt;img&gt;</code> elements with a class, or by changing <code>src</code> and <code>srcset</code> with a few lines of JavaScript.`
		},
		{
			q: 'Should I put JPEG XL in my picture tag now that Chrome supports it?',
			a: `Only if you already have the JXL files. Chrome 155 (October 6, 2026) and Firefox 158 (October 13) open JPEG XL by default and Safari has opened still JXL images since version 17, but caniuse's September 2026 figure is 16.95% global, almost all of it Safari's partial support, and Edge has not shipped it. A <code>&lt;source srcset="x.jxl" type="image/jxl"&gt;</code> placed above the AVIF source is harmless, because every other browser skips it, but it is not yet a reason to make a fourth set of files.`
		}
	];

	const related = [
		{
			title: 'JPEG XL Is in Chrome: What Changes for Your Images, and What Does Not Yet',
			href: '/guides/jpeg-xl-chrome-support',
			desc: 'the dated browser table behind the JPEG XL row, and why a fallback stays mandatory.'
		},
		{
			title: 'What Should I Use in 2026: WebP, AVIF, or JPEG XL?',
			href: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl',
			desc: 'the format decision the source order depends on.'
		},
		{
			title: 'Optimizing Hero Images for Web Performance',
			href: '/guides/optimizing-hero-images',
			desc: 'fetchpriority, preload and the LCP image the picture element wraps.'
		},
		{
			title: 'Do WebP and AVIF Support Transparency?',
			href: '/guides/webp-avif-transparency',
			desc: 'choosing the fallback for logos and cut-outs.'
		},
		{
			title: 'Why HDR Photos Look Flat When You Share Them',
			href: '/guides/why-hdr-photos-look-flat-when-shared',
			desc: 'gain maps, and why a format fallback can hide them.'
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
		datePublished: '2026-10-14',
		dateModified: '2026-10-14',
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
			'picture element',
			'HTML',
			'AVIF',
			'WebP',
			'JPEG XL',
			'art direction',
			'responsive images',
			'srcset',
			'prefers-color-scheme'
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
		datePublished: '2026-10-14',
		dateModified: '2026-10-14'
	};

	// The headline carries a literal <picture>, so every `<` is escaped before
	// it goes into the raw <script> tag.
	/** @param {object} data */
	const ld = (data) => JSON.stringify(data).replace(/</g, '\\u003c');
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
	{@html `<script type="application/ld+json">${ld(articleLd)}<\/script>`}
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${ld(breadcrumbLd)}<\/script>`}
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html `<script type="application/ld+json">${ld(webPageLd)}<\/script>`}
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
			The HTML <code>&lt;picture&gt;</code> Tag (Picture Element): Format Fallbacks, Art Direction and
			the 2026 Source Order
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			The HTML picture tag (the <code>&lt;picture&gt;</code> element) lets you offer a browser several
			versions of the same image and have it pick the first one it can use. That is the whole mechanism.
			It is how a page serves a small AVIF file to the browsers that can open it, a WebP to the ones that
			cannot, and a plain JPEG to everything else, from one piece of markup and with one download per
			image. It is also how you show a wide photo on a laptop and a close crop of the same photo on a
			phone, or a dark logo to visitors in dark mode, without any JavaScript.
		</p>

		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			If you are here because a speed test (PageSpeed Insights, Lighthouse, GTmetrix) told you to
			"Serve images in modern formats", the warning means your page is sending visitors the same
			JPEG or PNG you uploaded, when a file a fraction of the size would show the same picture. The
			reason it is still there is that most platforms do not fix it for you. WordPress core stores
			and serves uploads in the format they arrived in unless a plugin or a line of configuration
			says otherwise (our guide to <a
				href="https://mochify.app/guides/next-gen-image-formats-wordpress"
				>fixing the modern-formats warning in WordPress</a
			> covers that route), and hosted site builders vary: some convert, few let you choose which format
			goes first, and almost none will show a different crop on a phone or a different logo in dark mode.
			Leaving images to the platform's defaults gets you the same images as every other site on that platform.
			That is fine if average is the goal. If you want pages that load faster than your competitors',
			pass Google's Core Web Vitals checks, and look right on a phone, images are one of the few levers
			you can pull yourself, and this particular lever is not a chore: a few lines of markup per image,
			two extra files beside the one you already have, and a converter that makes them in one go.
		</p>

		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			Most explanations of the picture tag in HTML are written as reference entries: here are the
			attributes, good luck. This guide starts where the questions actually start. It gives you the
			snippet that clears the warning, walks through what a visitor on a 2026 iPhone and a visitor
			on an old office PC each receive from it, explains the four rules that decide whether it shows
			anything at all, and settles the order the formats should go in now that AVIF works for 96% of
			people and JPEG XL has just arrived in Chrome. Then it shows you how to make the extra files.
			If you have never written HTML, start with the five words below; the rest of the guide assumes
			only those.
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

		<section id="five-words" class="scroll-mt-24">
			<SectionHeading>Five words this guide uses</SectionHeading>
			<p class="mb-4">
				A web page is a text file, and every picture on it is a line of that text pointing at an
				image file. The picture element adds a short list of alternatives around that line.
				Everything below rests on these five terms:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong><code>&lt;img&gt;</code></strong>: the HTML tag that puts an image on a page.
						<code>&lt;img src="photo.jpg"&gt;</code> means "show the file called photo.jpg here". It has
						been in HTML since the beginning and every browser, crawler and app understands it.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Format</strong>: the kind of image file. JPEG and PNG are the old universal
						ones. WebP (2010) and AVIF (2019) store the same picture in a much smaller file, which
						is why speed tests ask for them. JPEG XL is the newest. Not every browser can open every
						format, which is the problem <code>&lt;picture&gt;</code> exists to solve.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong><code>&lt;source&gt;</code></strong>: one alternative inside a
						<code>&lt;picture&gt;</code>. Each <code>&lt;source&gt;</code> names a file and,
						optionally, a condition for using it: a format the browser must be able to decode (<code
							>type</code
						>), or a screen condition such as "window at least 1024 pixels wide" (<code>media</code
						>).
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Fallback</strong>: the version that is used when none of the alternatives apply.
						In a <code>&lt;picture&gt;</code>, the fallback is always the <code>&lt;img&gt;</code> at
						the bottom, and it is also the only part of the whole thing that the browser actually displays.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Media query</strong>: a yes/no question about the visitor's screen or settings,
						written in brackets: <code>(min-width: 1024px)</code> means "is the window at least 1024
						pixels wide?", <code>(prefers-color-scheme: dark)</code> means "is dark mode on?".
						<code>&lt;picture&gt;</code> uses them to choose between crops and between light and dark
						images.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				The format part is where most of the benefit is, so that is where we start.
			</p>
		</section>

		<section id="the-snippet" class="scroll-mt-24">
			<SectionHeading>The snippet that fixes "Serve images in modern formats"</SectionHeading>
			<p class="mb-4">
				This is the markup that satisfies the audit and still works in every browser: an AVIF
				source, a WebP source, and a JPEG <code>&lt;img&gt;</code> that carries everything else. You
				replace an existing <code>&lt;img&gt;</code> with it, and put the two extra files next to the
				JPEG.
			</p>
			<CodeCard filename="picture.html" code={snippetCode} />
			<p class="mb-4">Read it as a set of instructions to the browser, top to bottom:</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						"If you can open AVIF files, use <code>hero.avif</code> and stop reading."
					</p>
				</li>
				<li>
					<p class="mb-0">
						"Otherwise, if you can open WebP files, use <code>hero.webp</code> and stop."
					</p>
				</li>
				<li>
					<p class="mb-0">
						"Otherwise, use <code>hero.jpg</code>. Either way, this <code>&lt;img&gt;</code> line is
						the picture: here is its description for screen readers (<code>alt</code>), its size so
						you can leave room for it before it arrives (<code>width</code>, <code>height</code>),
						and permission to load it later if it is further down the page (<code
							>loading="lazy"</code
						>)."
					</p>
				</li>
			</ol>
			<p class="mb-4">Here is what that means for three real visitors to the same page:</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Someone on a 2026 iPhone or a current Chrome, Firefox or Edge.</strong> Their
						browser opens AVIF, so it downloads <code>hero.avif</code> only. For a photograph that is
						typically a fraction of the size of the JPEG, so the page appears sooner and uses less of
						their data plan. They never know the other two files exist.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>Someone on an older machine whose browser predates AVIF but handles WebP.</strong
						>
						Their browser skips the first line, downloads <code>hero.webp</code>, and gets most of
						the saving.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>Someone on a browser that opens neither, or a tool that does not know what <code
								>&lt;picture&gt;</code
							> means at all</strong
						>
						(an older in-app browser, a link preview bot, a search crawler). They get
						<code>hero.jpg</code>, exactly as they would have before you touched the page. Nothing
						breaks.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				The audit this answers is Lighthouse's "Serve images in modern formats" (it was called
				"next-gen formats" for years, and the old name still circulates; since Lighthouse 13 it
				lives inside the "Improve image delivery" insight). The audit names AVIF and WebP, and its
				own advice is to "serve a fallback PNG or JPEG image for older browser support" (<a
					href="https://developer.chrome.com/docs/lighthouse/performance/uses-webp-images"
					target="_blank"
					rel="noopener noreferrer">Chrome for Developers</a
				>). It does not tell you how to do that. The snippet above is how.
			</p>
			<p class="mb-4">
				If you already have the three files, you can stop here and paste it. If you do not, the <a
					href="#mochify-workflow">workflow section</a
				> makes them in a couple of minutes. The rest of this guide is for the moment the snippet does
				not behave, which, judging by the questions people ask about it, is often.
			</p>
		</section>

		<section id="four-rules" class="scroll-mt-24">
			<SectionHeading>The four rules that make the picture element work</SectionHeading>
			<p class="mb-4">
				Almost every "my picture tag does not work" problem is a violation of one of four rules:
				sources are read in order; <code>type</code> only skips what the browser cannot decode; the
				<code>&lt;img&gt;</code> is the only element that actually exists on the page; and a
				<code>&lt;source&gt;</code> inside <code>&lt;picture&gt;</code> takes <code>srcset</code>,
				not
				<code>src</code>.
			</p>
			<p class="mb-4">
				A useful way to hold all four in your head: the <code>&lt;picture&gt;</code> is an envelope,
				the <code>&lt;source&gt;</code> lines are instructions written on the envelope ("if you can
				read AVIF, use the AVIF"), and the <code>&lt;img&gt;</code> is the photograph inside. The envelope
				is never framed and hung on the wall. The photograph is.
			</p>

			<h3>Rule 1: the first usable source wins, in document order</h3>
			<p class="mb-4">
				The browser does not look for the "best" source. It reads the list from the top and takes
				the first one it can use. The HTML standard's selection algorithm takes the <code
					>&lt;picture&gt;</code
				>
				element's children "retaining relative order", walks them one by one, and for each
				<code>&lt;source&gt;</code> says: if it "has a <code>media</code> attribute, and its value
				does not match the environment, continue to the next child"; if it "has a <code>type</code>
				attribute, and its value is an unknown or unsupported MIME type, continue to the next child".
				The first child that survives both checks is chosen and the algorithm returns (<a
					href="https://html.spec.whatwg.org/multipage/images.html#updating-the-source-set"
					target="_blank"
					rel="noopener noreferrer">WHATWG HTML, "updating the source set"</a
				>). Nothing below it is looked at.
			</p>
			<p class="mb-4">
				So the order is your preference list, and a browser that could use several of them takes the
				top one. If you put WebP above AVIF by mistake, every modern browser takes the WebP and the
				AVIF files you made are never downloaded by anyone. Put the format you most want served
				first: AVIF above WebP, and JPEG XL above AVIF only if you want JXL served to the browsers
				that now decode it (see <a href="#source-order">the source order section</a> for whether you do).
			</p>

			<h3>Rule 2: <code>type</code> is a skip instruction, not a label</h3>
			<p class="mb-4">
				The <code>type</code> attribute is how the browser knows, before downloading anything,
				whether it can open a file. The standard says it exists "to allow the user agent to skip to
				the next source element if it does not support the given type". It takes a MIME type, which
				is the internet's formal name for a format: <code>image/avif</code>,
				<code>image/webp</code>,
				<code>image/jxl</code>, <code>image/png</code>. The file's extension (<code>.avif</code>) is
				not consulted; the browser reads the <code>type</code> string and nothing else.
			</p>
			<p class="mb-4">
				That makes the failure mode easy to predict. Leave <code>type</code> off a
				<code>&lt;source&gt;</code> and every browser assumes it can use it, including the ones that cannot.
				So this:
			</p>
			<CodeCard filename="picture.html" code={noTypeCode} />
			<p class="mb-4">
				is selected by a browser that cannot open AVIF, which then tries to decode the file, fails,
				and shows a broken image instead of moving on to the JPEG. Give every format-fallback source
				a <code>type</code>. It is one word per line and it is the difference between a safe
				fallback and a blank space.
			</p>

			<h3>Rule 3: the <code>&lt;img&gt;</code> is the only real element</h3>
			<p class="mb-4">
				The <code>&lt;picture&gt;</code> element, in the standard's words, "merely provides a
				context for its contained <code>img</code> element". The <code>&lt;source&gt;</code> lines
				are conditions. The <code>&lt;img&gt;</code> is the thing on the page: it is what is drawn,
				what CSS lays out, what screen readers announce and what search engines find. Whatever file
				the browser chose, it is shown <em>through</em> the <code>&lt;img&gt;</code>.
			</p>
			<p class="mb-4">
				That has consequences people trip over every week, and each one is a forum thread:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong
							><code>class</code>, <code>id</code>, <code>width</code>, <code>height</code> and
							<code>style</code> go on the <code>&lt;img&gt;</code>.</strong
						>
						Styling the <code>&lt;picture&gt;</code> does nothing to the image. If your stylesheet
						says
						<code>.hero &#123; border-radius: 12px &#125;</code> and the class is on the
						<code>&lt;picture&gt;</code>, the corners stay square. Move the class to the
						<code>&lt;img&gt;</code> and it works.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong><code>alt</code> goes on the <code>&lt;img&gt;</code>.</strong> There is no
						<code>alt</code> on <code>&lt;source&gt;</code>. This is the description a screen reader
						speaks and the text that shows if the image fails; it belongs on the element that is
						actually displayed.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							><code>width</code> and <code>height</code> go on the
							<code>&lt;img&gt;</code>.</strong
						>
						The browser uses them to reserve the right-sized space before the file arrives, which is what
						stops the page jumping as images load. Give the real pixel dimensions of the fallback file.
						In a format-fallback <code>&lt;picture&gt;</code> every version should be the same
						picture at the same dimensions, so one pair covers all three. (MDN also allows
						<code>width</code>
						and <code>height</code> on a <code>&lt;source&gt;</code>, which matters only when
						different crops have different shapes; see <a href="#art-direction">art direction</a>.)
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							><code>loading</code>, <code>decoding</code> and <code>fetchpriority</code> go on the
							<code>&lt;img&gt;</code>.</strong
						>
						They are <code>&lt;img&gt;</code> attributes and apply to whichever file was chosen.
						<code>loading="lazy"</code> for anything the visitor has to scroll to;
						<code>fetchpriority="high"</code> for the one image at the top that is your Largest
						Contentful Paint. Our guide to
						<a href="https://mochify.app/guides/optimizing-hero-images"
							>optimizing hero images for LCP</a
						> covers that trade-off.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							><code>object-fit</code>, <code>object-position</code> and friends go on the
							<code>&lt;img&gt;</code>.</strong
						>
						MDN's own note: "Use these properties on the child <code>&lt;img&gt;</code> element, not
						the <code>&lt;picture&gt;</code> element" (<a
							href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture"
							target="_blank"
							rel="noopener noreferrer">MDN, <code>&lt;picture&gt;</code></a
						>).
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Google finds the image through the <code>&lt;img&gt;</code>.</strong> Google
						Search Central recommends that "you always specify a fallback URL using the
						<code>src</code>
						attribute" because "some browsers and crawlers don't understand these attributes", and says
						Google can find images in the <code>src</code> attribute of an <code>&lt;img&gt;</code>
						even when it is a child of other elements (<a
							href="https://developers.google.com/search/docs/appearance/google-images"
							target="_blank"
							rel="noopener noreferrer">Google Search Central, image SEO</a
						>). The <code>&lt;source&gt;</code> URLs are not where a crawler goes looking.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				The single most common reason a <code>&lt;picture&gt;</code> shows nothing at all is that
				the
				<code>&lt;img&gt;</code> is missing. People write three <code>&lt;source&gt;</code> lines,
				see nothing, and assume the sources are wrong. The standard's content model is "Zero or more
				<code>source</code> elements, followed by one <code>img</code> element". Without the
				<code>&lt;img&gt;</code> there is nothing to render, in any browser, no matter how correct the
				sources are.
			</p>

			<h3>
				Rule 4: <code>&lt;source&gt;</code> inside <code>&lt;picture&gt;</code> uses
				<code>srcset</code>, never <code>src</code>
			</h3>
			<p class="mb-4">
				The standard says the <code>srcset</code> attribute on a <code>&lt;source&gt;</code> inside
				<code>&lt;picture&gt;</code> "must be present", and MDN marks <code>src</code> as "Not
				allowed if the parent is <code>&lt;picture&gt;</code>". A
				<code>&lt;source src="hero.avif"&gt;</code>
				is simply ignored; the browser moves on as if the line were not there. This is a copy-paste error
				from <code>&lt;video&gt;</code> and <code>&lt;audio&gt;</code>, where
				<code>&lt;source src&gt;</code> is correct, and it is a quiet one: the page still shows the JPEG
				fallback, nothing looks broken, and the AVIF never gets served until someone checks the Network
				panel.
			</p>
			<p class="mb-4">
				A <code>srcset</code> with a single file name is fine, and it is all the format-fallback
				snippet needs. <code>srcset</code> can also list several sizes of the same file (<code
					>hero-800.avif 800w, hero-1600.avif 1600w</code
				>) with a <code>sizes</code> attribute beside it, which lets each format offer a small
				version for phones and a large one for laptops; the
				<a href="#picture-vs-srcset">comparison section</a> covers when that extra set of files is worth
				it.
			</p>
		</section>

		<section id="which-source-loaded" class="scroll-mt-24">
			<SectionHeading>Does it download every source? How to see which one loaded</SectionHeading>
			<p class="mb-4">
				No. The browser reads the <code>&lt;source&gt;</code> list before it fetches anything,
				chooses one candidate, and downloads that one file; the other files are never requested. The
				choice is made from the words in the markup (the <code>type</code> and <code>media</code>
				attributes), not by trying each file in turn, which is why <code>type</code> has to be an
				accurate MIME type and why <code>media</code> is tested against the current window rather
				than by trial and error. A <code>&lt;picture&gt;</code> with three alternatives costs the
				visitor one download, the same as a plain <code>&lt;img&gt;</code>.
			</p>
			<p class="mb-4">
				The standard's "update the image data" algorithm selects one image source from the source
				set and makes one request for it. If the conditions later change, for example the visitor
				turns a tablet sideways and the window crosses a <code>media</code> breakpoint, the browser
				re-runs the selection and may request a different candidate. On first load it is one request
				per
				<code>&lt;picture&gt;</code>.
			</p>
			<p class="mb-4">Two ways to see which file was chosen, and neither needs any coding:</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>The Network panel.</strong> In Chrome, Edge or Firefox, right-click the page,
						choose
						<strong>Inspect</strong>, open the <strong>Network</strong> tab, click the
						<strong>Img</strong> filter, then reload the page. You will see <code>hero.avif</code>
						in the list (in any current browser) and no request for <code>hero.webp</code> or
						<code>hero.jpg</code>. If you see the JPEG instead in a current Chrome, Firefox or
						Safari, the <code>type</code> values or the <code>srcset</code> spelling are wrong: check
						Rules 2 and 4.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong><code>currentSrc</code> in the console.</strong> Open the
						<strong>Console</strong>
						tab in the same panel and paste
						<code>document.querySelector('picture img').currentSrc</code>. It prints the address of
						the file the browser actually selected. The standard defines <code>currentSrc</code> as
						"the
						<code>img</code> element's current request's current URL", and that request is built
						from the source set, which for an <code>&lt;img&gt;</code> inside
						<code>&lt;picture&gt;</code>
						includes the parent's <code>&lt;source&gt;</code> lines. So it reports the winning
						<code>&lt;source&gt;</code>, not just the <code>&lt;img src&gt;</code>.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				Do not judge it from the <strong>Elements</strong> tab. That tab shows the markup as you
				wrote it, so the <code>&lt;img src="hero.jpg"&gt;</code> is displayed there whether or not the
				JPEG is what loaded.
			</p>

			<h3>Check your own site in sixty seconds</h3>
			<p class="mb-4">
				Open any page of your site, right-click, choose <strong>View Page Source</strong>, and
				search (Ctrl+F or Cmd+F) for <code>&lt;picture</code>. If it is there, your site or platform
				already does this and the questions are only about the order and the files. If it is not,
				every image on the page is served as whatever format you uploaded, which for most sites
				means JPEG or PNG, and the snippet in this guide is the fix. If your site runs on WordPress,
				our guide to
				<a href="https://mochify.app/guides/next-gen-image-formats-wordpress"
					>fixing the "next-gen formats" warning in WordPress without plugins</a
				> covers the WordPress-specific route.
			</p>
		</section>

		<section id="art-direction" class="scroll-mt-24">
			<SectionHeading
				>Art direction: a different crop per screen with <code>media</code></SectionHeading
			>
			<p class="mb-4">
				Art direction means showing a different composition of the same photograph depending on the
				screen it is on, not just the same picture scaled down. The <code>media</code> attribute on
				<code>&lt;source&gt;</code> is how you do it: each <code>&lt;source&gt;</code> carries a condition
				about the screen, and the first one whose condition is true is used.
			</p>
			<p class="mb-4">
				Here is the problem it solves. Picture a shop's homepage banner: a wide photograph of a
				kitchen, with the product (say, a coffee grinder) on the counter at the right-hand side. On
				a laptop the whole scene fits and the grinder is clearly visible. On a phone, the same wide
				image is shrunk to a third of the width, the kitchen becomes a thin strip, and the grinder
				is a few pixels wide. Simply scaling the image down keeps the composition and loses the
				point. What you want on the phone is a tall crop with the grinder filling the frame. That is
				art direction: two crops of one photo, chosen by screen width.
			</p>
			<p class="mb-4">
				Here is the simplest version, two crops and no format fallback yet, so the structure is
				clear:
			</p>
			<CodeCard filename="art-direction.html" code={artDirectionSimpleCode} />
			<p class="mb-4">
				Read it as: "If the window is at least 1024 pixels wide, use the wide crop. Otherwise, use
				the tall crop." A laptop or desktop window is almost always wider than 1024 pixels, so it
				gets
				<code>kitchen-wide.jpg</code>. A phone screen is around 360 to 430 pixels wide in the units
				browsers use, so the condition is false, the browser skips the <code>&lt;source&gt;</code>,
				and the phone gets <code>kitchen-tall.jpg</code>. One file is downloaded either way.
			</p>
			<p class="mb-4">
				Now add the format fallback from earlier, and the same two crops become six <code
					>&lt;source&gt;</code
				>
				lines plus the <code>&lt;img&gt;</code>:
			</p>
			<CodeCard filename="art-direction.html" code={artDirectionFullCode} />
			<p class="mb-4">
				Follow two visitors through it. A visitor on a laptop with a current browser: line 1 asks
				"wide window?" (yes) "and can you open AVIF?" (yes), so they get <code
					>kitchen-wide.avif</code
				>
				and the browser stops. A visitor on a three-year-old phone whose browser handles WebP but not
				AVIF: lines 1 to 3 fail the "wide window?" test, line 4 passes the window test but fails the AVIF
				test, line 5 passes both, so they get <code>kitchen-tall.webp</code>. Nobody downloads more
				than one file.
			</p>
			<p class="mb-4">
				The pattern is "crops times formats". Two crops and three formats is six lines; three crops
				would be nine. That is normal, and it is the point at which a converter that handles a
				folder at once (the <a href="#mochify-workflow">workflow section</a>) stops being a
				convenience and becomes necessary. Most images on most sites do not need art direction at
				all: a product thumbnail or a blog photo that just scales down is fine with the three-line
				format fallback. Reserve crops for the images where the small version loses the subject,
				which is usually the banner at the top.
			</p>
			<p class="mb-4">Three things to get right, because each has a forum thread behind it.</p>
			<p class="mb-4">
				<strong>Pick one direction and order the conditions accordingly.</strong>
				<code>min-width</code> conditions ("at least this wide") are true for every window
				<em>larger</em> than the number, so list the biggest breakpoint first.
				<code>max-width</code> conditions ("no wider than this") are true for every window
				<em>smaller</em> than the number, so list the smallest first. Mixing the two, or listing them
				in the wrong order, is how a crop "stops working" after an edit. Here is the common version of
				the bug, three breakpoints that look sensible and are not:
			</p>
			<CodeCard filename="breakpoints.html" code={breakpointsBrokenCode} />
			<p class="mb-4">
				On a 1440-pixel window the browser reads line 1 (no, too wide), then line 2 ("at least
				1024?" yes) and stops. Line 3 is never reached, because every window that is at least 1440
				wide is also at least 1024 wide. The fix is to put the biggest number first and let the
				<code>&lt;img&gt;</code> cover the phones, with no <code>max-width</code> line at all:
			</p>
			<CodeCard filename="breakpoints.html" code={breakpointsFixedCode} />
			<p class="mb-4">
				The safe habit is one direction per <code>&lt;picture&gt;</code>, biggest first with
				<code>min-width</code>. The classic <code>(min-width: 1024px)</code> form is understood by
				every browser; if you prefer the newer range syntax, <code>(width &gt;= 1024px)</code>,
				check the oldest browser you support before relying on it.
			</p>
			<p class="mb-4">
				<strong
					>Keep the fallback <code>&lt;img&gt;</code> pointing at the crop that serves the visitors your
					conditions do not cover.</strong
				>
				In the example, the phone crop is the default and the wide crop is the exception. If you reverse
				it (wide crop on the <code>&lt;img&gt;</code>, tall crop behind a
				<code>(max-width: 1023px)</code> condition), the markup still works, but a crawler or an old
				browser that ignores <code>&lt;picture&gt;</code> now gets the wide version, which is fine for
				a banner and wrong for a portrait-shaped slot.
			</p>
			<p class="mb-4">
				<strong>Different crops can have different dimensions.</strong> This is the case where
				<code>width</code> and <code>height</code> on a <code>&lt;source&gt;</code> earn their
				place: a 1600 by 900 wide crop and a 900 by 1200 tall crop do not share a shape, so give
				each
				<code>&lt;source&gt;</code> its own pair (<code>width="1600" height="900"</code> on the wide
				lines) and the <code>&lt;img&gt;</code> the fallback's pair, and the browser reserves the right
				box whichever it picks. Without that, the page lays out for the tall crop, then jumps when the
				wide one arrives.
			</p>
		</section>

		<section id="dark-mode" class="scroll-mt-24">
			<SectionHeading
				>Dark mode images with <code>prefers-color-scheme</code> (and its limit)</SectionHeading
			>
			<p class="mb-4">
				A <code>&lt;source&gt;</code> with <code>media="(prefers-color-scheme: dark)"</code> serves
				a different file when the visitor's phone or computer is set to dark mode, and it works
				today in every current browser because it is just another media query. The typical use is a
				logo: a dark wordmark on a light page, a light wordmark on a dark one, chosen automatically.
				web.dev shows exactly this pattern (<a
					href="https://web.dev/articles/prefers-color-scheme"
					target="_blank"
					rel="noopener noreferrer">web.dev, <code>prefers-color-scheme</code></a
				>), and MDN's <code>&lt;picture&gt;</code> page uses it as its <code>media</code> example.
			</p>
			<CodeCard filename="dark-mode.html" code={darkModeCode} />
			<p class="mb-4">
				Read it as: "If the visitor is in dark mode, use the light-text logo (AVIF if you can, PNG
				if not). Otherwise, use the dark-text logo." A visitor whose iPhone switches to dark mode at
				sunset sees the logo change on their next page load, with no code on your side beyond those
				four lines.
			</p>
			<p class="mb-4">
				The limit is the one that surprises people: <code>prefers-color-scheme</code> reports the
				operating system or browser setting, not a theme switch on your own site. If your site has a
				sun/moon button that adds a <code>dark</code> class to the page, a
				<code>&lt;picture&gt;</code>
				keyed on <code>prefers-color-scheme</code> ignores it, and your light-text logo appears only
				when the visitor's whole phone goes dark. For a site-level toggle, the toggle has to do the
				work: either put both logos on the page as two <code>&lt;img&gt;</code> elements and show
				one or the other with a class, or have a few lines of script swap the <code>src</code> (and
				<code>srcset</code>) when the theme changes. Both are fine; <code>&lt;picture&gt;</code> on its
				own is not the tool for that job.
			</p>
			<p class="mb-4">
				For logos and icons, which usually have transparent backgrounds, the fallback should be a
				PNG, not a JPEG (a JPEG has no transparency and will paint the background a solid color),
				and the modern versions should be encoded without visible loss. Our guide on <a
					href="https://mochify.app/guides/webp-avif-transparency"
					>why WebP and AVIF cut-outs come back with black or white backgrounds</a
				> explains which formats carry transparency and where it survives.
			</p>
		</section>

		<section id="source-order" class="scroll-mt-24">
			<SectionHeading
				>The 2026 source order: AVIF, WebP, JPEG, and where JPEG XL fits</SectionHeading
			>
			<p class="mb-4">
				For almost every site in October 2026 the right order is AVIF, then WebP, then the JPEG (or
				PNG) fallback on the <code>&lt;img&gt;</code>. JPEG XL goes above AVIF only if you already
				have JXL files and want the browsers that decode them to get them; it is not yet a reason to
				make a fourth set of files.
			</p>
			<p class="mb-4">
				"Support" here means the share of people whose browser can open the format. The figures come
				from <a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer">caniuse</a
				>, which combines each browser's version history with StatCounter's usage data; these are
				from the September 2026 data:
			</p>
			<GuideTable class="my-6">
				<table>
					<thead>
						<tr
							><th>Format</th><th>Global support (caniuse, Sep 2026 data)</th><th
								>Where it is decoded</th
							><th>Place in the <code>&lt;picture&gt;</code></th></tr
						>
					</thead>
					<tbody>
						<tr
							><td>AVIF</td><td>96.35%</td><td
								>Chrome 85+, Edge 121+, Firefox 93+, Safari 16.4+ (16.1 to 16.3 partial)</td
							><td>First <code>&lt;source&gt;</code> (<code>type="image/avif"</code>)</td></tr
						>
						<tr
							><td>WebP</td><td>97.18%</td><td
								>Chrome 32+, Edge 18+, Firefox 65+, Safari 16+ (14 to 15.6 partial)</td
							><td>Second <code>&lt;source&gt;</code> (<code>type="image/webp"</code>)</td></tr
						>
						<tr
							><td>JPEG XL</td><td>16.95% (0.02% full, 16.93% partial)</td><td
								>Chrome 155+ (October 6, 2026), Firefox 158+ (October 13), Safari 17+ for still
								images only; Edge not yet</td
							><td
								>Optional first <code>&lt;source&gt;</code> (<code>type="image/jxl"</code>) where
								you have the files</td
							></tr
						>
						<tr
							><td>JPEG / PNG</td><td>effectively universal</td><td
								>Everything, including crawlers that only read <code>src</code></td
							><td>The <code>&lt;img&gt;</code></td></tr
						>
						<tr
							><td>HEIC / HEIF</td><td>16.93%, Safari 17+ only</td><td
								>Not a web format; convert it</td
							><td>Never in a <code>&lt;source&gt;</code></td></tr
						>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				Read the JPEG XL row carefully. Almost all of its 16.95% is Safari's partial support, and
				the September data predates Chrome 155 and Firefox 158, which shipped in the first two weeks
				of October. The share will rise as those versions reach people's machines, but a rollout
				takes weeks, Edge has made no statement, and nothing outside a browser (email clients, chat
				apps, most CMS previews) opens a <code>.jxl</code>. Our guide to
				<a href="https://mochify.app/guides/jpeg-xl-chrome-support"
					>what Chrome 155 shipping JPEG XL changes, and what it does not yet</a
				> has the dated table and the caveats per engine.
			</p>
			<p class="mb-4">
				<strong>Why AVIF before WebP?</strong> Because the browsers that decode AVIF are a subset of
				the ones that decode WebP, and for photographs an AVIF is usually the smaller file of the
				two. Listing it first gives the smaller file to everyone who can take it and costs nothing
				to the rest, who fall through to the WebP. Our Quick Answer on
				<a href="https://mochify.app/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl"
					>whether to use WebP, AVIF or JPEG XL in 2026</a
				>
				covers the exceptions (very small graphics, slow encoding on huge batches, transparency edge cases),
				and <a href="https://mochify.app/guides/what-is-an-avif-file">what an AVIF file is</a> covers
				the format itself.
			</p>
			<p class="mb-4">
				<strong>Why keep the JPEG at all?</strong> Two reasons that will not go away in 2026. First,
				roughly 3 in 100 visitors (100% minus the 97.18% WebP figure, using caniuse's September 2026
				numbers) decode neither modern format: an iPhone that stopped at iOS 15, a smart TV's
				browser, a locked-down corporate machine, an app's built-in web view. Without the JPEG, on a
				site with 100,000 monthly visitors, that is nearly 3,000 broken images a month. Second, the
				<code>&lt;img src&gt;</code> is the address Google asks you to provide and the one that crawlers,
				link previews and "save image as" all reach for. The fallback is cheap: it is the file you already
				had.
			</p>
			<p class="mb-4">
				Two notes on the fallback itself. If the image has transparency or is a flat graphic (an
				icon, a diagram, a screenshot with text in it), make the fallback a PNG and ask for lossless
				WebP for the WebP source; a JPEG will paint the transparent area a solid color and blur the
				edges of text. And do not put a <code>.heic</code> in a <code>&lt;source&gt;</code>: HEIC is
				the format iPhones save photos in, not a format for delivering them, and only Safari opens
				it. If your source photos came off an iPhone, convert them first (our
				<a href="https://mochify.app/heic-to-jpeg">HEIC to JPG converter</a> does a batch with no account).
			</p>
		</section>

		<section id="limits" class="scroll-mt-24">
			<SectionHeading>Two things the picture tag cannot do: HDR and CSS backgrounds</SectionHeading>
			<p class="mb-4">
				<code>&lt;picture&gt;</code> chooses a source on exactly two tests, <code>media</code> and
				<code>type</code>, so it cannot choose on anything else, and it has no say over an image
				that is drawn by a stylesheet rather than placed by an <code>&lt;img&gt;</code>.
			</p>
			<p class="mb-4">
				<strong>It has no HDR step.</strong> Recent phones save photos with extra brightness
				information (a "gain map") that makes highlights glow on an HDR screen; a JPEG that carries
				one is called an Ultra HDR JPEG. The <code>&lt;picture&gt;</code> selection algorithm checks
				the media query and the MIME type and nothing more. So if your fallback
				<code>&lt;img&gt;</code>
				is an Ultra HDR JPEG and you put a standard AVIF above it, every browser that opens AVIF takes
				the AVIF, and the gain map is never seen by anyone, including the visitors on screens that could
				have shown it. The format fallback silently downgrades the picture on exactly the displays where
				it would have looked best. There is a <code>dynamic-range</code> media feature in CSS, and
				in principle a <code>&lt;source media="(dynamic-range: high)"&gt;</code>
				could route HDR-capable screens to an HDR file, but we have not verified that any browser honors
				it for image selection and do not recommend relying on it. If HDR matters for a given image, serve
				the gain-map JPEG on its own and keep the AVIF/WebP chain for the images where it does not. Our
				guide on
				<a href="https://mochify.app/guides/why-hdr-photos-look-flat-when-shared"
					>why HDR photos look flat when you share them</a
				>
				explains gain maps and which formats can carry one (for Mochify's own output, only JPG does; AVIF,
				WebP and PNG come back standard range).
			</p>
			<p class="mb-4">
				<strong>It does not apply to CSS background images.</strong> Some images are not placed with
				an <code>&lt;img&gt;</code> at all; they are painted behind a section by a stylesheet rule
				such as <code>background-image: url(hero.jpg)</code>. The <code>&lt;picture&gt;</code>
				element has no influence over those. The stylesheet equivalent is <code>image-set()</code>
				with
				<code>type()</code> hints, which has been Baseline since September 2023, backed by a plain
				<code>url()</code> fallback for anything older; <code>@supports</code> tests whether the
				browser understands a line of CSS, not whether it can open the file, so it is the wrong tool
				for format detection. One more reason to prefer <code>&lt;img&gt;</code>: Google does not
				index CSS images at all, so a photo you want to appear in image search belongs in an
				<code>&lt;img&gt;</code>
				inside a <code>&lt;picture&gt;</code>, not in a background. The CSS version has its own
				short article in this series: how to give a CSS background image a WebP or AVIF fallback.
			</p>
		</section>

		<section id="picture-vs-srcset" class="scroll-mt-24">
			<SectionHeading
				>The HTML picture tag vs <code>srcset</code> vs a plain
				<code>&lt;img&gt;</code></SectionHeading
			>
			<p class="mb-4">
				Use a plain <code>&lt;img&gt;</code> when nothing varies; use <code>&lt;img&gt;</code> with
				<code>srcset</code> and <code>sizes</code> when the only thing that varies is how big the
				image needs to be; use <code>&lt;picture&gt;</code> when the format or the crop varies. The three
				are not competitors so much as three sizes of the same decision, and most pages use all of them.
			</p>
			<p class="mb-4">
				<code>srcset</code> is the part that confuses people, so in plain terms: <code>srcset</code>
				on an <code>&lt;img&gt;</code> lists the same photo at several pixel widths (<code
					>photo-400.jpg 400w, photo-800.jpg 800w, photo-1600.jpg 1600w</code
				>) and
				<code>sizes</code> tells the browser how wide the image will be displayed; the browser then
				picks the smallest file that will still look sharp on that screen. It is how a phone avoids
				downloading a 1600-pixel file for a 400-pixel-wide slot. It cannot say anything about
				formats or crops; that is what <code>&lt;picture&gt;</code> adds.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead><tr><th>You need</th><th>Use</th><th>Why</th></tr></thead>
					<tbody>
						<tr
							><td>One file, one format</td><td><code>&lt;img src&gt;</code></td><td
								>Nothing to choose between</td
							></tr
						>
						<tr
							><td>Same picture at several pixel widths</td><td
								><code>&lt;img srcset="… 800w, … 1600w" sizes="…"&gt;</code></td
							><td
								>The browser picks the best resolution for the slot and screen density; it may pick
								a larger one than you expect, and you cannot force it</td
							></tr
						>
						<tr
							><td>Different formats (AVIF, WebP, JPEG)</td><td
								><code>&lt;picture&gt;</code> with <code>type</code> on each
								<code>&lt;source&gt;</code></td
							><td
								>Format is a yes/no the browser answers from the MIME type; <code>srcset</code> has no
								way to express it</td
							></tr
						>
						<tr
							><td>Different crops per screen</td><td
								><code>&lt;picture&gt;</code> with <code>media</code> on each
								<code>&lt;source&gt;</code></td
							><td>A crop is an editorial decision; <code>media</code> makes it binding</td></tr
						>
						<tr
							><td>Formats and sizes and crops</td><td
								><code>&lt;picture&gt;</code> with <code>media</code>, <code>type</code>, and a
								<code>srcset</code> with <code>w</code> descriptors plus <code>sizes</code> on each
								<code>&lt;source&gt;</code></td
							><td>Everything, at the cost of many files</td></tr
						>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				The distinction that explains the difference in one sentence comes from web.dev's picture
				element lesson: <code>srcset</code> gives the browser suggestions,
				<code>&lt;picture&gt;</code>
				gives it commands. With <code>srcset</code> alone you describe the candidates and let the
				browser pick, which is right for sizes because the browser knows the screen density, the
				window width and what it has already cached, and you do not. With
				<code>&lt;picture&gt;</code>
				the
				<code>media</code> and <code>type</code> tests are evaluated in order and the first pass wins,
				which is right for formats (a browser either opens AVIF or it does not) and for crops (you, not
				the browser, decide the tall version is for phones).
			</p>
			<p class="mb-4">
				A <code>&lt;picture&gt;</code> is not a performance feature by itself. It does not make an image
				smaller; the smaller file has to exist. It is the delivery mechanism for files you have already
				made in the right formats, which is the next section.
			</p>
			<p class="mb-4">
				If you build on a framework or a site builder, you may never write any of this by hand.
				Next.js's <code>&lt;Image&gt;</code> renders an <code>&lt;img&gt;</code> and picks the
				format on the server from the request's <code>Accept</code> header (WebP by default, AVIF
				optional, with art direction left to you via a <code>&lt;picture&gt;</code>); Astro's
				<code>&lt;Picture /&gt;</code> emits a <code>&lt;picture&gt;</code> with AVIF and WebP
				sources; Eleventy Image emits an <code>&lt;img&gt;</code> or a <code>&lt;picture&gt;</code>.
				Hosted platforms vary, and the sixty-second check above (search the page source for
				<code>&lt;picture</code>) tells you what yours does. The rules in this guide are what those
				tools are implementing, and they are what to check when the output looks wrong.
			</p>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify Workflow: making the AVIF, WebP and JPEG files</SectionHeading>
			<p class="mb-4">
				The snippet needs three files per image, and the fastest way to get them is to describe the
				result rather than configure it. Mochify's Magic Flow takes a plain-English instruction and
				applies the right format, quality and size; the same engine is behind the CLI for whole
				folders and the Chrome extension for a single image. None of the three needs an account for
				the first few files.
			</p>
			<GlassPanel>
				<ol class="workflow-steps">
					<li>
						<h3>In the browser, for a batch</h3>
						<p>
							Open <a href="https://mochify.app/flow">Magic Flow</a>, drop the JPEGs (3 per batch
							with a free account, 25 on a paid plan), and type <code>convert to avif</code>.
							Download the results into a folder called <code>avif</code>. Drop the same files again
							and type
							<code>convert to webp</code>. If a photo is going into a slot that is 1200 pixels
							wide, say so: <code>convert to avif, 1200px wide</code>, and the AVIF comes back
							resized as well as re-encoded, which is often a bigger saving than the format change.
							For a logo or diagram with transparency, ask for
							<code>convert to webp, lossless</code> and keep a PNG as the fallback; AVIF has no lossless
							path, so for pixel-exact graphics it is WebP or JPEG XL that you want.
						</p>
					</li>
					<li>
						<h3>From the terminal, for a folder</h3>
						<p>
							If you are comfortable with a command line, the <code>mochify</code> CLI is a client over
							the same API, so it takes the same instructions and adds patterns and output folders:
						</p>
						<CodeCard filename="convert.sh" code={cliCode} />
						<p>
							<code>--lossless</code> works for WebP, PNG and JPEG XL output;
							<code>-p "convert to avif, 1200px wide"</code> is the Magic Flow form if you would
							rather describe it. A <code>find</code> pipeline (<code
								>find . -name "*.jpg" | mochify -t webp -o ./out</code
							>) handles a whole tree of folders. The
							<a href="https://mochify.app/docs">API docs</a>
							have the same conversion as a
							<code>POST /v1/squish</code> call with <code>type=avif</code> and an
							<code>Authorization: Bearer</code> header, for build scripts.
						</p>
					</li>
					<li>
						<h3>In Chrome, for one image</h3>
						<p>
							Right-click any image on a page, choose Mochify, then "Convert to" and the format you
							want. It is a direct conversion with no prompt and no settings, one image at a time,
							and the file lands in your Downloads folder. The <a
								href="https://mochify.app/chrome-extension">Mochify for Chrome page</a
							> has the install link.
						</p>
					</li>
					<li>
						<h3>Keep the JPEGs, but make them smaller</h3>
						<p>
							The fallback is the file you started with, and if it was exported at maximum quality
							it is probably twice the size it needs to be. Drop the JPEGs into Magic Flow with the
							instruction <code>compress</code> and they come back as JPEGs re-encoded with jpegli, which
							keeps the familiar JPEG that opens everywhere while spending fewer bytes at the same visual
							quality.
						</p>
					</li>
				</ol>
			</GlassPanel>
			<p class="mt-6 mb-4 text-base leading-relaxed text-[#875F42]">
				<strong>Privacy, for this workflow.</strong> Images travel to <code>api.mochify.app</code> over
				HTTPS, are streamed into the encoder in memory, and are wiped the moment the encode finishes:
				no disk writes, no logs containing file data, and never used to train AI. That holds for the web
				app, the CLI and the extension alike; the CLI writes the results to your disk and nothing is kept
				on the server. (Video is the one Mochify format that is processed in the browser and never leaves
				the device; images are not, and we do not claim otherwise.)
			</p>
			<p class="mb-0">
				<strong>Keeping them converted.</strong> Converting the existing library once is the easy
				half. Every image uploaded after today arrives as a JPEG or PNG and quietly undoes the fix,
				unless conversion is part of how images reach the site: a build step, a CLI run on a
				schedule, or a converter the CMS calls. The CLI commands above are the seed of that
				pipeline; Magic Flow at
				<a href="https://mochify.app/flow">mochify.app/flow</a> is the version with nothing to install.
			</p>
		</section>

		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat Sheet</SectionHeading>
			<GuideTable class="my-6">
				<table>
					<thead><tr><th>Question</th><th>Answer</th></tr></thead>
					<tbody>
						<tr
							><td>Minimum working <code>&lt;picture&gt;</code></td><td
								><code>&lt;source srcset="x.avif" type="image/avif"&gt;</code>,
								<code>&lt;source srcset="x.webp" type="image/webp"&gt;</code>,
								<code>&lt;img src="x.jpg" alt="…" width="…" height="…"&gt;</code></td
							></tr
						>
						<tr
							><td>Source order in 2026</td><td
								>AVIF, WebP, then JPEG (or PNG) on the <code>&lt;img&gt;</code>; JPEG XL first only
								if you have the files</td
							></tr
						>
						<tr
							><td>Which source is used</td><td
								>The first <code>&lt;source&gt;</code> whose <code>media</code> matches and whose
								<code>type</code> the browser decodes; otherwise the <code>&lt;img&gt;</code></td
							></tr
						>
						<tr
							><td>What <code>type</code> does</td><td
								>Lets the browser skip a format it cannot open before any download; always set it on
								format-fallback sources</td
							></tr
						>
						<tr
							><td
								>Where <code>alt</code>, <code>class</code>, <code>width</code>,
								<code>height</code>,
								<code>loading</code>, <code>decoding</code>, <code>fetchpriority</code>, CSS go</td
							><td
								>On the <code>&lt;img&gt;</code>, never on <code>&lt;picture&gt;</code> or
								<code>&lt;source&gt;</code></td
							></tr
						>
						<tr
							><td><code>src</code> or <code>srcset</code> on <code>&lt;source&gt;</code></td><td
								><code>srcset</code>; <code>src</code> is ignored inside
								<code>&lt;picture&gt;</code></td
							></tr
						>
						<tr
							><td>Downloads every source?</td><td
								>No; one candidate is chosen from the markup and one file downloaded (another may
								follow if a <code>media</code> condition changes)</td
							></tr
						>
						<tr
							><td>See which loaded</td><td
								>DevTools Network tab filtered by Img, or <code>img.currentSrc</code> in the console</td
							></tr
						>
						<tr
							><td>Check whether your site uses it</td><td
								>View Page Source, search for <code>&lt;picture</code></td
							></tr
						>
						<tr
							><td>Art direction</td><td
								><code>media="(min-width: 1024px)"</code> on the wide-crop sources, the phone crop
								on the <code>&lt;img&gt;</code>; crops times formats = number of
								<code>&lt;source&gt;</code> lines</td
							></tr
						>
						<tr
							><td><code>min-width</code> vs <code>max-width</code></td><td
								>Largest breakpoint first with <code>min-width</code>; smallest first with
								<code>max-width</code>; one direction per <code>&lt;picture&gt;</code></td
							></tr
						>
						<tr
							><td>Dark mode</td><td
								><code>media="(prefers-color-scheme: dark)"</code>; follows the device setting, not
								your site's toggle</td
							></tr
						>
						<tr
							><td>HDR</td><td
								>Not negotiated; an AVIF source beats an Ultra HDR JPEG fallback wherever AVIF
								decodes</td
							></tr
						>
						<tr
							><td>CSS backgrounds</td><td
								>Out of scope; use <code>image-set()</code> with <code>type()</code> and a
								<code>url()</code> fallback</td
							></tr
						>
						<tr
							><td>Support (caniuse, Sep 2026 data)</td><td
								>AVIF 96.35%, WebP 97.18%, JPEG XL 16.95% (nearly all Safari partial; Chrome 155 and
								Firefox 158 shipped in October)</td
							></tr
						>
						<tr
							><td>Making the files</td><td
								>Magic Flow <code>convert to avif</code> / <code>convert to webp</code>; CLI
								<code>mochify *.jpg -t avif -o ./avif</code></td
							></tr
						>
					</tbody>
				</table>
			</GuideTable>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA href="/flow" label="Try Magic Flow">
			Make the three files for your first image now at <a href="https://mochify.app/flow"
				>mochify.app/flow</a
			>
			and prompt <em>"convert to avif"</em>, then <em>"convert to webp"</em>. Twenty-five images a
			month are free with an account, three without one.
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

	/* Workflow steps: the handoff authors each step title as an <h3> and step 2
	   carries a code figure, so this is a plain list rather than StepList
	   (whose titles are <p> and whose bodies are an {@html} string). */
	.workflow-steps {
		list-style: none;
		counter-reset: step;
		margin: 0;
		padding: 0;
	}

	.workflow-steps > li {
		counter-increment: step;
		position: relative;
		padding-left: 3.25rem;
		padding-bottom: 2rem;
	}

	.workflow-steps > li:last-child {
		padding-bottom: 0;
	}

	.workflow-steps > li::before {
		content: counter(step);
		position: absolute;
		left: 0;
		top: 0;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 0.95rem;
		color: #fff;
		background: linear-gradient(135deg, #f06292 0%, #ffb3c6 100%);
		box-shadow: 0 4px 12px rgba(240, 98, 146, 0.25);
	}

	.workflow-steps h3 {
		margin: 0.2rem 0 0.75rem;
	}

	.workflow-steps p {
		margin: 0 0 0.75rem;
	}

	.workflow-steps p:last-child {
		margin-bottom: 0;
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
