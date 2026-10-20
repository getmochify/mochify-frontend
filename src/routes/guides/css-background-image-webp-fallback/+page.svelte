<script>
	import ReadProgress from '$lib/components/ReadProgress.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
	import CodeCard from '$lib/components/guide-demo/CodeCard.svelte';
	import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

	// Built from content-ops `article-originals/css-background-image-webp-fallback.html`
	// (handoff spec v1, profile quick-answer). Body copy is verbatim from the
	// handoff; head and schema are generated from its metadata block per the
	// spec's section 2.2 contract. Quick answer: no TOC, no FAQ, no FAQPage.
	const metadata = {
		title: 'How Do I Give a CSS Background Image a WebP or AVIF Fallback?',
		seoTitle: 'CSS Background Image WebP or AVIF Fallback | Mochify',
		description:
			'Use image-set() with type() for the AVIF and WebP, with a plain url() JPEG line before it. Baseline since September 2023; what older Safari gets.',
		category: 'Web Performance',
		readTime: '10 min read',
		date: 'October 15, 2026',
		bylineNote:
			'The stylesheet half of the picture-element series: two lines of CSS, the browsers that ignore them, and the checks, dated October 2026.'
	};

	const keywords =
		'background image webp fallback, image-set css, css webp fallback, css image-set webp, css background avif fallback, webp background image css';

	const pageUrl = 'https://mochify.app/guides/css-background-image-webp-fallback';

	const ruleCode = `.hero {
  background-image: url("hero.jpg");
  background-image: image-set(
    url("hero.avif") type("image/avif"),
    url("hero.webp") type("image/webp"),
    url("hero.jpg")  type("image/jpeg")
  );
}`;

	const related = [
		{
			title:
				'The HTML <picture> Tag (Picture Element): Format Fallbacks, Art Direction and the 2026 Source Order',
			href: '/guides/html-picture-tag',
			desc: 'the same fallback for images placed with an img tag, and why content images belong there.'
		},
		{
			title: 'Do WebP and AVIF Support Transparency?',
			href: '/guides/webp-avif-transparency',
			desc: 'choosing PNG as the plain fallback for a cut-out background.'
		},
		{
			title: 'What Is an AVIF File? (And How to Open One)',
			href: '/guides/what-is-an-avif-file',
			desc: 'the format in the first candidate, and why browsers open it when desktop apps do not.'
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
		datePublished: '2026-10-15',
		dateModified: '2026-10-15',
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
		about: ['image-set()', 'CSS background images', 'WebP', 'AVIF', '@supports', 'Baseline'].map(
			(name) => ({ '@type': 'Thing', name })
		),
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
		datePublished: '2026-10-15',
		dateModified: '2026-10-15'
	};

	// Escape every `<` before the JSON goes into a raw <script> tag.
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
			How Do I Give a CSS Background Image a WebP or AVIF Fallback?
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			Give a CSS background image a WebP or AVIF fallback with two <code>background-image</code>
			lines in the same rule: a plain <code>url()</code> pointing at the JPEG or PNG, then the CSS
			<code>image-set()</code> function listing the AVIF, the WebP and the JPEG, each tagged with
			<code>type()</code> so the browser takes the first format it can open.
			<code>image-set()</code>
			with <code>type()</code> has been Baseline, meaning it works in Chrome, Edge, Firefox and
			Safari, since September 2023; any browser older than that ignores the second line and paints
			the first. The <code>&lt;picture&gt;</code> element cannot do this job, because a background
			is set by a stylesheet, not by an <code>&lt;img&gt;</code>.
		</p>

		<CodeCard filename="styles.css" code={ruleCode} />

		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			If you are here, you probably met one of two things. A speed test (PageSpeed Insights,
			Lighthouse, GTmetrix) flagged "Serve images in modern formats" on a page whose largest image
			is a section background, and the <code>&lt;picture&gt;</code> fix every tutorial gives turned
			out not to apply, because <code>&lt;picture&gt;</code> only replaces <code>&lt;img&gt;</code>
			tags. Or you swapped the background for a <code>.webp</code> and someone on an older iPhone
			sent you a screenshot of a blank gray band where the photo should be. Themes and site builders
			leave this unsolved because the background line in their stylesheet names one file, and the
			settings and plugins that convert a page's images work on <code>&lt;img&gt;</code> tags. Taking
			control of it is an edge, and it is not a chore: the whole fix is the two lines above and two extra
			files beside the JPEG you already have.
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
		<section id="what-a-background-image-is" class="scroll-mt-24">
			<SectionHeading>What a background image is, and three terms this answer uses</SectionHeading>
			<p class="mb-4">
				A web page has two kinds of picture. A <strong>content image</strong> is part of the page
				itself: it is placed with an <code>&lt;img&gt;</code> tag, it sits in the flow of the text,
				it has a description for screen readers and search engines, and it is what the
				<code>&lt;picture&gt;</code> element controls. A <strong>background image</strong> is paint. The
				page's stylesheet (CSS, the text file that tells a browser how the page should look) says "fill
				this section with hero.jpg", the browser paints the file behind whatever is in that section, and
				the headline and buttons sit on top of it. The photo behind a hero heading, the texture behind
				a pricing table and the picture on a card that still shows text are usually backgrounds. A background
				is not part of the content: it has no description, search engines do not index it, and a visitor
				cannot right-click and save it.
			</p>
			<p class="mb-4">
				That last point is also the test. In Chrome or Edge, right-click the picture: if the menu
				offers <strong>Save image as</strong> or <strong>Open image in new tab</strong>, it is a
				content image and the <code>&lt;picture&gt;</code> element is the fix. If the menu shows only
				the page options (Back, Reload, Inspect and so on), it is a background, and this answer is the
				one you want. Three more terms cover the rest:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Declaration</strong>: one instruction in a stylesheet, such as
						<code>background-image: url("hero.jpg")</code>, which means "paint hero.jpg behind this
						element". If a browser does not understand a declaration, it throws that one line away
						and keeps the rest of the rule.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong><code>image-set()</code></strong>: a way of writing a background as a list of
						candidate files instead of one file, so the browser can choose. It was built for sending
						sharper images to high-resolution screens; the <code>type()</code> part is what turns it into
						a format fallback.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong><code>type()</code></strong>: the label on each candidate naming its format,
						written as a MIME type: <code>image/avif</code>, <code>image/webp</code>,
						<code>image/jpeg</code>, <code>image/png</code>. The browser skips any candidate whose
						type it cannot decode and uses the first one it can.
					</p>
				</li>
			</ul>
		</section>

		<section id="how-image-set-picks-a-file" class="scroll-mt-24">
			<SectionHeading
				>How image-set() picks a file: three visitors through the two lines</SectionHeading
			>
			<p class="mb-4">
				Start with the version you already have, a single declaration:
				<code>background-image: url("hero.jpg")</code>. Every browser understands it, and every
				visitor downloads the JPEG. The fix keeps that line and adds the <code>image-set()</code> line
				after it. When a rule sets the same property twice, the browser applies the last declaration it
				understands, so the second line wins wherever it is understood and the first line covers everyone
				else. What the rule above gives three real visitors:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong
							>Someone on a current Chrome, Firefox, Edge or Safari, including any iPhone updated
							since September 2023.</strong
						>
						Their browser understands <code>image-set()</code> and <code>type()</code>, can decode
						AVIF, and downloads <code>hero.avif</code> only, typically a fraction of the JPEG's size for
						a photograph. The WebP and the JPEG are never requested.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong
							>Someone on Safari 14, 15 or 16, say an iPhone that was never updated past iOS 16.</strong
						>
						Those versions understand <code>image-set()</code> but not <code>type()</code>, so they
						cannot use the second line and fall back to the first: <code>hero.jpg</code>, exactly
						what they got before. Safari 16 could have opened the WebP, so this visitor pays for the
						fallback with a larger file, but nothing is broken and nothing is blank.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Someone on a browser that has never heard of <code>image-set()</code></strong>,
						such as an old desktop Chrome or the built-in browser of a TV. The second line is
						invalid to them, so it is discarded and the first line applies: <code>hero.jpg</code> again.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				One download per visitor, and the JPEG is the safety net for everyone the new line does not
				reach.
			</p>
			<p class="mb-4">
				<strong>The common broken version.</strong> The most-copied snippets have only the
				<code>image-set()</code> line, or put the WebP in the plain <code>url()</code> line on the
				grounds that WebP works everywhere now, which turns the WebP fallback into the thing that
				needs a fallback. Either way, the Safari 15 visitor above gets a file their browser cannot
				open, or no file at all, and the section is a blank band. The fix is the first line, and it
				must be the JPEG or PNG. <strong>The other broken version</strong> is the two lines in the
				wrong order: put the <code>url()</code> line second and it is the last declaration every
				browser understands, so every visitor gets the JPEG and the speed test still fails. Plain
				<code>url()</code>
				first,
				<code>image-set()</code> second.
			</p>
		</section>

		<section id="browser-support" class="scroll-mt-24">
			<SectionHeading
				>image-set() browser support: which versions ignore <code>type()</code></SectionHeading
			>
			<p class="mb-4">
				<code>image-set()</code> with <code>type()</code> is listed by
				<a
					href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/image/image-set"
					target="_blank"
					rel="noopener noreferrer">MDN</a
				>
				as Baseline Widely available, "available across browsers since September 2023", the month Safari
				17 shipped it: Chrome 113, Edge 113, Firefox 89 and Safari 17 all honor the full form. The versions
				that understand <code>image-set()</code> but not <code>type()</code> are Safari and iOS
				Safari 14 through 16 and Firefox 88; MDN's compatibility data and caniuse agree on that
				list. Chrome 20 to 112 and Edge 79 to 112 recognized only a prefixed
				<code>-webkit-image-set()</code>
				with plain
				<code>url()</code> candidates, so the unprefixed line is invalid to them and the plain line
				applies. Some AI answers add a <code>-webkit-image-set()</code> line as well; we leave it
				out, because neither MDN nor caniuse records <code>type()</code> working in the prefixed
				form, and those browsers are already served by the plain line. Across all browsers in use,
				<a href="https://caniuse.com/css-image-set" target="_blank" rel="noopener noreferrer"
					>caniuse</a
				>
				puts <code>image-set()</code> at 97.27% of global traffic (94.13% full support plus 3.14% partial).
				The first line exists for the rest, and for the partial band.
			</p>
		</section>

		<section id="check-which-file" class="scroll-mt-24">
			<SectionHeading>How to check which file a visitor gets</SectionHeading>
			<p class="mb-4">
				Two checks, no coding needed, in Chrome, Edge or Firefox on your own computer:
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>See the AVIF being chosen.</strong> Open the page, right-click anywhere on it,
						choose
						<strong>Inspect</strong>, and click the <strong>Network</strong> tab in the panel that
						opens. Click the <strong>Img</strong> filter, then reload the page (Ctrl+R, or Cmd+R on
						a Mac). <code>hero.avif</code> should appear in the list and <code>hero.webp</code> and
						<code>hero.jpg</code> should not. If <code>hero.jpg</code> appears instead, the second
						line is not being understood: check that every candidate has a <code>type()</code>, that
						the values are exact (<code>image/avif</code>, not <code>image/avi</code>), and that the
						<code>image-set()</code> line comes after the <code>url()</code> line.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>See what an old browser gets, without owning an old phone.</strong> In your
						stylesheet, temporarily disable the <code>image-set()</code> line by putting
						<code>/*</code>
						before it and <code>*/</code> after its closing <code>);</code>, save, and reload. The
						section should show the JPEG exactly as before. That is what the Safari 15 visitor and
						the TV visitor see. Then put the line back.
					</p>
				</li>
			</ol>
		</section>

		<section id="supports-scripts-and-the-server-route" class="scroll-mt-24">
			<SectionHeading><code>@supports</code>, detection scripts and the server route</SectionHeading
			>
			<p class="mb-4">
				Three other answers circulate. One is wrong, and two are worth knowing about.
			</p>
			<p class="mb-4">
				<strong
					><code>@supports (background-image: url("hero.webp"))</code> does not test what it looks like
					it tests.</strong
				>
				The <code>@supports</code> rule "checks if a browser supports the specified
				<code>&lt;property&gt;: &lt;value&gt;</code> declaration" (<a
					href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@supports"
					target="_blank"
					rel="noopener noreferrer">MDN</a
				>), and the CSS standard defines support as the browser accepting that declaration rather
				than rejecting it as a parse error (<a
					href="https://www.w3.org/TR/css-conditional-3/#support-definition"
					target="_blank"
					rel="noopener noreferrer">CSS Conditional Rules Level 3, section 6.1</a
				>). <code>background-image: url("hero.webp")</code> is a perfectly good declaration to a
				browser that cannot open WebP, because the test is about the line of CSS, not the file it
				names. So the WebP rule inside that <code>@supports</code> block is applied on browsers that
				cannot show it, which is the blank band again. <code>type()</code> inside
				<code>image-set()</code>
				is the format test; <code>@supports</code> is not.
			</p>
			<p class="mb-4">
				<strong>Detection scripts (Modernizr and its descendants) do work.</strong> A script tests
				whether the browser can decode a tiny WebP, adds a class such as <code>webp</code> to the
				page, and your stylesheet carries a <code>.webp .hero</code> rule next to the plain one. It was
				the answer before 2023. The costs are a script that has to run before the background can switch,
				and two rules per image. Two lines of CSS now do the same job with no script.
			</p>
			<p class="mb-4">
				<strong>The server route needs no stylesheet change at all.</strong> An image CDN, or a
				server configured for it, reads the <code>Accept</code> header a browser sends with each image
				request, which lists the formats that browser can open, and returns an AVIF or WebP under the
				JPEG's own address. If your host or CDN offers this, turn it on and the background line can stay
				as it is; it is a setting on their side, so their documentation is the place to check.
			</p>
		</section>

		<section id="when-you-do-not-need-this" class="scroll-mt-24">
			<SectionHeading>When you do not need this</SectionHeading>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>The background is a flat color, a gradient or a small repeating pattern.</strong
						> The file is already tiny, and converting it saves bytes nobody will notice. Spend the effort
						on the large photographic backgrounds: hero sections and full-width banners.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Your CDN already negotiates formats.</strong> Then the stylesheet is not where the
						saving happens; see the server route above.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The image is content, not decoration.</strong> Google does not index CSS
						background images, so a product photo, a portrait, or anything you would want to appear
						in image search belongs in an <code>&lt;img&gt;</code> inside a
						<code>&lt;picture&gt;</code>
						element, not in a background; our guide to
						<a href="https://mochify.app/guides/html-picture-tag"
							>the HTML <code>&lt;picture&gt;</code> tag</a
						> covers that side, and it is the only place this answer sends you for markup. For a true
						background, the fallback is about what the last 3 in 100 visitors see, not about search.
					</p>
				</li>
			</ul>
		</section>

		<section id="making-the-files" class="scroll-mt-24">
			<SectionHeading>Making the AVIF and WebP files</SectionHeading>
			<p class="mb-4">
				The rule needs two extra files beside the JPEG, and the quickest way to get them is to
				describe the result. Open <a href="https://mochify.app/flow">Magic Flow</a>, drop
				<code>hero.jpg</code>, and type <code>convert to avif</code>; download the result, drop the
				JPEG again and type
				<code>convert to webp</code>. If the section is 1600 pixels wide, say so (<code
					>convert to avif, 1600px wide</code
				>) and the file comes back resized as well as re-encoded, which is often the bigger saving.
				For a flat-color pattern or a logo-like background, ask for
				<code>convert to webp, lossless</code>
				and keep a PNG as the plain-<code>url()</code> fallback; AVIF has no lossless path. From a
				terminal, the <code>mochify</code> CLI does the same for a folder:
				<code>mochify hero.jpg -t avif</code>
				and
				<code>mochify hero.jpg -t webp</code>. Either way the image travels to
				<code>api.mochify.app</code>, is encoded in memory and is wiped the moment the encode
				finishes. Twenty-five images a month are free with an account, three without one.
			</p>
		</section>

		<GlassCTA href="/flow" label="Try Magic Flow">
			Make the two files for your first background now at <a href="https://mochify.app/flow"
				>mochify.app/flow</a
			>: drop the JPEG and type <em>"convert to avif"</em>, then <em>"convert to webp"</em>.
		</GlassCTA>

		<RelatedGuidesGrid guides={related} />
	</div>
</article>
