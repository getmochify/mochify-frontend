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
	import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';

	// Built from content-ops `article-originals/optimizing-hero-images.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract. Same-slug
	// replacement of the February 2026 guide: datePublished is kept.
	const metadata = {
		title: 'Hero Image Size for Websites: Dimensions, File Size, and Why Your Banner Crops',
		seoTitle: 'Hero Image Size: Dimensions, File Size and a Fast LCP',
		description:
			'Hero image size, settled: the pixels for desktop and phone, the KB a banner should weigh in AVIF, WebP or JPEG, why it crops, and how to load it fast.',
		category: 'Web Performance',
		readTime: '39 min read',
		date: 'February 20, 2026',
		lastUpdated: 'October 16, 2026',
		bylineNote:
			'Rewritten and expanded on October 15, 2026 with a measured size table from our own run; the first version of this guide dates from February.'
	};

	const keywords =
		'hero image size, website hero image size, hero image dimensions, mobile hero image size, hero image size for website, header image size for website, banner image size for website, best image size for website, hero image aspect ratio, hero image size shopify, hero image size wordpress, hero image size squarespace, lcp image, improve lcp';

	const pageUrl = 'https://mochify.app/guides/optimizing-hero-images';

	const toc = [
		{ id: 'five-words', label: 'Five words this guide uses' },
		{ id: 'three-sizes', label: 'Size is three different things' },
		{ id: 'why-it-crops', label: 'Why your hero image crops and zooms' },
		{
			id: 'dimensions',
			label: 'Hero image size by layout: desktop, banner and mobile dimensions'
		},
		{
			id: 'file-size',
			label: 'File size: what a 1920-pixel hero weighs in JPEG, WebP and AVIF'
		},
		{ id: 'lcp', label: 'The slow page: the hero is your LCP image' },
		{
			id: 'serving',
			label: 'Serving it right: <img>, fetchpriority, srcset and <picture>'
		},
		{ id: 'platforms', label: 'Platform workflows: WordPress, Shopify, Squarespace, Wix, Webflow' },
		{ id: 'video', label: 'When your hero is a video' },
		{
			id: 'mochify-workflow',
			label: 'Mochify Workflow: resize, convert and compress a hero in one prompt'
		},
		{ id: 'cheat-sheet', label: 'Cheat Sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const heroCode =
		'<img src="hero-1920.jpg" alt="The workshop at opening time"\n     width="1920" height="800" fetchpriority="high">';

	const headCode =
		'<link rel="preload" as="image" href="hero-1920.avif" type="image/avif" fetchpriority="high">';

	const srcsetCode =
		'<img src="hero-1920.jpg"\n     srcset="hero-800.jpg 800w, hero-1280.jpg 1280w, hero-1920.jpg 1920w"\n     sizes="100vw"\n     alt="The workshop at opening time" width="1920" height="800" fetchpriority="high">';

	const pictureCode =
		'<picture>\n  <source media="(max-width: 767px)" srcset="hero-phone-1080.avif" type="image/avif">\n  <source media="(max-width: 767px)" srcset="hero-phone-1080.jpg">\n  <source srcset="hero-1920.avif" type="image/avif">\n  <img src="hero-1920.jpg" alt="The workshop at opening time"\n       width="1920" height="800" fetchpriority="high">\n</picture>';

	const resizeCode =
		'brew install mochify\nmochify auth login                                   # one-time browser sign-in\nmochify hero.jpg -t avif -w 1920 -o ./hero\nmochify hero.jpg -t webp -w 1920 -o ./hero\nmochify hero.jpg -t avif -w 1280 -o ./hero-1280\nmochify hero.jpg -p "resize to 800px wide, convert to avif"   # the Magic Flow form';

	const faqItems = [
		{
			q: 'What is the best hero image size for a website?',
			a: "Upload it 1920 pixels wide for a full-width desktop hero, at the height your theme's section uses (1920 by 1080 for a full-screen 16:9 hero, 1920 by 800 for a banner), and aim for a file under about 200 KB by saving it as AVIF or WebP at a quality setting you have checked by eye (section 5 shows what that takes on a detail-heavy photo). Add a separate portrait crop around 1080 pixels wide for phones. Larger uploads are only worth it for product shots or typography on high-density screens, and 2560 wide is the practical ceiling because WordPress and Squarespace will not serve anything bigger."
		},
		{
			q: 'What is the best hero image size for mobile?',
			a: 'A separate portrait image about 1080 pixels wide, at 4:5 (1080 by 1350) or 3:4 (1080 by 1440), with the subject in the center. Phones are 360 to 414 layout pixels wide drawn at 2x to 3x, so 1080 is sharp on all of them. Showing the desktop landscape on a phone is what produces the "cropped" and "zoomed" complaints: the phone\'s tall box can only show the middle third of a wide picture.'
		},
		{
			q: 'Is 1920 x 1080 the right size for a hero image?',
			a: "For a full-screen 16:9 hero, yes: 1920 by 1080 is full sharpness on the most common desktop screens and scales down cleanly to the rest. For a banner that is wider than it is tall, 1920 by 1080 is the wrong shape and will be cropped top and bottom; use 1920 at the banner's own ratio instead, such as 1920 by 800. The width is the constant; the height follows the section."
		},
		{
			q: 'How many KB should a hero image be?',
			a: 'Aim for under about 200 KB at 1920 wide, and expect to get there by choosing the quality setting rather than the format alone. In our October 2026 run on a detail-heavy garden photograph at 1920 by 1080, a quality-85 JPEG was 822 KB, the automatic AVIF 438 KB, the jpegli JPEG 463 KB and the WebP 517 KB; an AVIF at quality 45 was 246 KB and we could not tell it from the original at 1:1. A calmer picture (sky, a wall, a product on white) lands far lower at the same settings. For context, half of mobile sites served an LCP image of 100 KB or less in the 2024 Web Almanac. The number only means something at a stated pixel size: 200 KB at 1920 wide is a well-made file, 200 KB at 800 wide is a badly made one.'
		},
		{
			q: 'Why does my hero image look cropped or zoomed in?',
			a: "Because the section's shape is fixed by your theme and your image is a different shape, so the theme scales the image to cover the box and clips the overflow: a wide image loses its left and right on phones, a tall one loses its top and bottom on monitors. No pixel size fixes it. Match the image's ratio to the section (or set the section height to adapt to the image), keep the subject in the middle, set the platform's focal point, and use a separate portrait image for phones."
		},
		{
			q: 'Should a hero be an img tag or a CSS background image?',
			a: 'An <code>&lt;img&gt;</code> tag. The browser finds an <code>&lt;img&gt;</code> in the HTML as the page arrives and starts fetching it immediately; a CSS background is only discovered after the stylesheet has been downloaded and read, which is why web.dev calls it "not discoverable" and 35% of mobile sites have exactly this delay. If your theme forces a background, add a <code>&lt;link rel="preload" as="image"&gt;</code> for the hero file in the page head as the patch.'
		},
		{
			q: 'What is the recommended hero image size for Squarespace, Shopify or WordPress?',
			a: "Squarespace Support asks for 2500 pixels wide and 500 KB or less, and warns that under 1500 wide may blur. Shopify publishes no hero pixel size for its themes; it crops banners to the section's shape, so upload 1920 wide at that ratio, under 20 megapixels and 20 MB, and set a focal point. WordPress serves up to 2560 wide (it scales larger uploads down) and generates the responsive sizes itself, so 1920 to 2560 wide in AVIF or WebP is the upload. In all three, the file's weight is yours to fix before upload; the platform resizes for display but does not make a heavy file light."
		},
		{
			q: 'Is a hero image the same as a banner or a header image?',
			a: 'In practice, yes. "Hero" is the designer\'s word for the large image at the top of a page; builders and most site owners call it a banner, a header image, a cover or a strip, so if you searched for website banner size or header image size for a website, this is the same question. The sizing, cropping and file-weight rules in this guide are the same whatever your platform calls it. (An email hero or a social cover image is a different thing with its own fixed sizes, and is not covered here.)'
		}
	];

	const related = [
		{
			title: 'The HTML <picture> Tag: Format Fallbacks, Art Direction and the 2026 Source Order',
			href: '/guides/html-picture-tag',
			desc: 'the rules behind the phone-crop and AVIF/WebP/JPEG snippet above.'
		},
		{
			title: 'Should I Use fetchpriority or rel="preload" for My LCP Image?',
			href: '/guides/fetchpriority-vs-preload-lcp-image',
			desc: 'when the attribute alone is enough and when a hero also needs the preload hint.'
		},
		{
			title: "Convert a Website's Images to WebP and AVIF, and Keep Them That Way",
			href: '/guides/convert-website-images-to-webp-and-avif',
			desc: 'the whole library, not just the hero, with the measured sizes.'
		},
		{
			title: 'What Automatic Image Optimization Actually Does (and When to Take Control)',
			href: '/guides/what-automatic-image-optimization-actually-does',
			desc: 'what your platform fixes for you and what it leaves.'
		},
		{
			title: 'Convert MP4 to WebM for the Web',
			href: '/guides/mp4-to-webm-web-video-guide',
			desc: 'for the video-hero case.'
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
		datePublished: '2026-02-20',
		dateModified: '2026-10-16',
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
			'hero image',
			'image size',
			'Largest Contentful Paint',
			'AVIF',
			'WebP',
			'srcset',
			'responsive images'
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
		datePublished: '2026-02-20',
		dateModified: '2026-10-16'
	};

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
			<AccentTitle title={metadata.title} accent="Hero Image Size" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated} · Mochify Engineering
			Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			The right hero image size for a website is <strong>1920 pixels wide</strong>: the hero image,
			the big picture at the top of the page (your platform may call it a banner, a header image or
			a cover), should be uploaded at that width for a full-width desktop layout, at the aspect
			ratio your page's section actually uses (1920 by 1080 for a full-screen 16:9 hero, 1920 by 800
			for a wide banner), with a
			<strong>separate portrait crop of about 1080 pixels wide for phones</strong>, and it should
			weigh <strong>a few hundred kilobytes at most</strong> once it is saved as AVIF or WebP, with 200
			KB as the budget to aim for (a detail-heavy photograph needs a lower quality setting to get there;
			a calmer one gets there on its own). Keep the subject and any text in the middle of the frame, because
			the section will crop the edges on some screens whatever you do. Go bigger only for a specific reason:
			2560 wide is the sensible ceiling, and nothing above it is ever shown.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			That is the short answer, and it is the one most guides and the AI summary at the top of the
			search results give you. It is also where the trouble starts, because "size" means three
			different things, and the figure that matters for a slow page is not the one in pixels. If you
			are here because your website is loading slowly, you have been wondering why your site is so
			slow, or a speed test told you the biggest thing on the page took too long to appear, the hero
			image is almost certainly the reason: it is the largest element on most pages, and in the HTTP
			Archive's 2024 census an image was the largest element on 73% of mobile pages. Fix the file
			and you fix the metric Google scores the page on.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			This guide is written for two readers at once. If you run a site on WordPress, Shopify,
			Squarespace, Wix or Webflow and have never opened a code editor, the first three sections give
			you the numbers, the reason the platform keeps cropping your banner, and the file size that
			makes the page fast, with nothing to install. If you build sites, the later sections cover the
			serving rules that make the file count (<code>&lt;img&gt;</code> over a CSS background,
			<code>fetchpriority</code>, <code>srcset</code>, <code>&lt;picture&gt;</code>), how to read
			the result in PageSpeed Insights, and what each platform does on your behalf. Both of you will
			want the cheat sheet near the end.
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
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Hero image.</strong> The large image across the top of a page, usually with a headline
						over it. Designers say hero; Shopify says image banner or slideshow; Squarespace says banner
						or section background; Wix says strip; most people say "the big picture at the top". Same
						thing.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Pixels vs kilobytes.</strong> Pixels (px) are the picture's grid of dots: 1920 by
						1080 means 1,920 across and 1,080 down. Kilobytes (KB) are how much the file weighs, which
						is what the visitor has to download. Two files can have identical pixels and very different
						weights, and the weight is what makes a page slow.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Aspect ratio.</strong> The shape: width to height. 16:9 is a widescreen TV; 2.4:1
						is a letterbox strip; 4:5 is a portrait phone photo. When the image's shape and the box's
						shape differ, something has to give, and that something is cropping.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Device pixel ratio (DPR).</strong> A phone that is 390 "pixels" wide in your page
						layout is drawing those 390 layout pixels with 1,170 physical dots (3x). A 2x laptop draws
						a 960-wide box from 1,920 dots. So a 1920-pixel file is "full size" on a 1x monitor and "half
						size" on a 2x screen, which is why every sizing guide quietly disagrees with every other one.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>LCP (Largest Contentful Paint).</strong> Google's measure of how long the largest
						visible thing on the page takes to appear, one of the three Core Web Vitals it scores pages
						on. Google wants it at or under 2.5 seconds for most visits, and on a page with a hero image,
						the hero is usually that largest thing. If you remember one technical term from this guide,
						this is the one.
					</p>
				</li>
			</ul>
		</section>

		<section id="three-sizes" class="scroll-mt-24">
			<SectionHeading>Size is three different things</SectionHeading>
			<p class="mb-4">
				When someone asks what size a hero image should be, the honest answer is "which size?" There
				are three, and most of the conflicting advice online comes from guides that quote a number
				without saying which one they mean.
			</p>
			<p class="mb-4">
				<strong>1. The box on the page (CSS pixels).</strong> Your page lays out a hero section that is,
				say, the full width of the window and 600 layout pixels tall. On a 1920 by 1080 monitor at 100%
				scaling that is a 1920 by 600 box. On the same laptop set to 125% scaling (the second most common
				desktop setup in StatCounter's September 2026 data, which reports it as 1536 by 864) the box is
				1536 by 480 layout pixels, drawn with 1920 by 600 physical dots. On a phone it is 390 by maybe
				500, portrait. You do not control the box's size; the visitor's screen does. You only control
				its shape, through the theme setting that fixes the section height.
			</p>
			<p class="mb-4">
				<strong>2. The pixels in the file.</strong> This is the number every guide gives, and what most
				people mean by hero image resolution: 1920 by 1080, 2500 wide, 800 by 1200. The browser scales
				the file to fit the box, so a 1920-wide file fills a 1920 box at 1x exactly, fills a 960-wide
				2x box at full sharpness, and gets scaled down to fit a 390-wide phone (a 4000-pixel camera JPEG
				would be scaled down just the same, having sent ten times the bytes for no visible gain).
			</p>
			<p class="mb-4">
				<strong>3. The weight of the file (kilobytes).</strong> This is the one that decides whether the
				page feels fast, and it depends on the pixels and on the format and quality you saved it in. The
				same photograph weighed 1.79 MB as it came off a phone, 822 KB saved as a JPEG at 1920 by 1080,
				438 KB as an AVIF at the same pixels, and 246 KB as an AVIF at a lower quality setting that we
				could not tell apart from the original at 1:1 (our run, section 5). Nobody has ever noticed the
				difference between a 1920 and a 2500-pixel hero on a laptop; everybody notices a page that takes
				four seconds to show its picture.
			</p>
			<p class="mb-4">
				Hold those three apart and the rest of this guide is simple: choose the shape to match the
				section (so it does not crop badly), choose the pixels to cover the box on the screens you
				care about (so it does not blur), and choose the format and quality to make the weight small
				(so it loads fast).
			</p>
		</section>

		<section id="why-it-crops" class="scroll-mt-24">
			<SectionHeading>Why your hero image crops and zooms</SectionHeading>
			<p class="mb-4">
				Your hero crops because the section's shape is fixed by your theme and the hero image aspect
				ratio is fixed by you, and when they differ the theme shows as much of the image as fits and
				cuts off the rest. No pixel size fixes that; only the shape does, plus where you put the
				subject.
			</p>
			<p class="mb-4">
				This is the complaint behind most of the forum threads that rank for hero image size: "on
				desktop my image is cut and too much zoomed", "I tried the recommended dimensions and it
				zooms in", "it looks great on mobile but on PC it is in your face", "I made several sizes
				and all of them get cropped". Shopify's own help page describes the mechanism plainly for
				any hero section background image: slideshows, image banners and full-width sections
				"display images in an image area whose shape is set by the section, not by the image that
				you upload", and "if your image's aspect ratio is different from the aspect ratio of that
				area, then the section crops the image to fit" (<a
					href="https://help.shopify.com/en/manual/online-store/images/theme-images"
					target="_blank"
					rel="noopener noreferrer">Shopify Help Center, Uploading images</a
				>). Every builder works the same way; in CSS terms the image is set to cover the box (<code
					>object-fit: cover</code
				>
				or <code>background-size: cover</code>), which keeps its shape and clips whatever hangs over
				the edge.
			</p>
			<p class="mb-4">
				Follow one photo through it. You upload a 1920 by 1080 landscape of a workshop, with the
				product on the left and the owner on the right. On a wide monitor the banner section is 1920
				by 600 (3.2:1): the browser scales the image to fill the width, which makes it 1,080 tall,
				and clips 240 pixels off the top and 240 off the bottom. The owner's head is gone. On a
				phone the box is 390 by 520, portrait: the browser scales the image to fill the height,
				which makes it 924 wide, and shows the middle 390 of those 924 pixels. Both the product and
				the owner are gone; the visitor sees the wall between them. That is "zoomed in". Nothing was
				enlarged; the box simply cannot show the whole picture, so it shows the middle.
			</p>
			<p class="mb-4">
				Three rules follow, and they are the ones the platforms' own documentation gives:
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong
							>Match the image's shape to the section, or set the section to match the image.</strong
						>
						Most themes let you pick a banner height (small, medium, large, or one that adapts to the
						image's own ratio). The adaptive option never crops on desktop; the fixed heights always can.
						If a theme section is 16:9, upload 16:9.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Keep the subject in the middle, and keep the edges expendable.</strong> A wide image
						loses its left and right on phones; a tall one loses its top and bottom on monitors (Shopify's
						page says exactly this). Our working rule: put the subject, and anything you cannot lose,
						inside the middle half of the width and the middle two-thirds of the height. Shopify and Wix
						let you set a focal point on the image so the crop centers on it; set it.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Never put text in the image.</strong> Shopify's guidance: "images that you use for
						slideshows or backgrounds shouldn't have text in them", because the theme crops, moves and
						resizes the image under the text. A Squarespace owner on the support forum whose banner had
						the headline "burned in" found it illegible on phones for exactly this reason. Put the headline
						in the section's own text field, where it reflows.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				For phones, the better answer is a second image. A portrait crop of the same photo, with the
				subject filling the frame, looks like a choice rather than an accident. Most themes and
				every custom site can show a different image below a certain width; section 7 shows the
				<code>&lt;picture&gt;</code> version for sites you build yourself, and the platform section says
				where each builder keeps the mobile setting.
			</p>
			<p class="mb-4">
				<strong>When this is not your problem:</strong> if your hero is a plain color, a gradient or an
				illustration with nothing important near the edges, cropping is harmless and you can skip the
				mobile crop. Just keep the weight down.
			</p>
		</section>

		<section id="dimensions" class="scroll-mt-24">
			<SectionHeading
				>Hero image size by layout: desktop, banner and mobile dimensions</SectionHeading
			>
			<p class="mb-4">
				The right website hero image size is 1920 pixels wide for any full-width desktop hero, at
				the height your section's ratio needs; upload a separate portrait image around 1080 pixels
				wide for phones; and go to 2560 wide only when you have measured that the sharper file is
				worth its extra weight. Those three hero image dimensions cover almost every site, and here
				is where they come from.
			</p>
			<p class="mb-4">
				<strong>Why 1920.</strong> StatCounter's worldwide screen data for September 2026 puts 1920
				by 1080 at 28% of desktop screens, with 1536 by 864 (a 1920 laptop at 125% scaling) at 10%,
				1366 by 768 at 8%, and 2560 by 1440 at 4% (<a
					href="https://gs.statcounter.com/screen-resolution-stats/desktop/worldwide"
					target="_blank"
					rel="noopener noreferrer">StatCounter, desktop resolutions</a
				>). A 1920-wide file is full sharpness on the first three, which between them are most
				desktop visits, and it is scaled down, never up, on everything smaller. On the 2560 monitor
				it is stretched by a third; on a 2x laptop (a 1440-wide layout drawn with 2880 dots) it is
				stretched by a half. Both look fine for a photograph. The eye forgives a scaled-up
				photograph far more readily than a scaled-up screenshot or logo.
			</p>
			<p class="mb-4">
				<strong>Heights follow the section, not a rule.</strong> The full screen hero image size on a
				16:9 monitor is 1920 by 1080. A banner that sits above the content wants something wider and shorter:
				1920 by 800 (2.4:1) and 1920 by 640 (3:1) are the common shapes, and they are what the "1600 by
				500" and "1200 by 400" figures in older guides are approximating. Measure your own section: open
				the page, right-click the hero, choose Inspect, and read the box's width and height at the top
				of the panel. Upload at that ratio.
			</p>
			<p class="mb-4">
				<strong>When to go to 2x.</strong> A 2x file (3840 wide for a 1920 box, 2560 wide for a 1280
				box) is sharper on retina screens, and twice to four times the weight. Go there only if the
				hero is a product shot, typography or line art where softness shows, your audience is
				heavily on high-density screens, and the AVIF still comes in under budget. For a photograph
				of people, a landscape or a workshop, 1920 is enough and the saved bytes are worth more than
				the sharpness nobody noticed. Two platform facts put a ceiling on it anyway: WordPress
				scales any upload with a side longer than 2560 pixels down to 2560 before it is ever served
				(<a
					href="https://make.wordpress.org/core/2019/10/09/introducing-handling-of-big-images-in-wordpress-5-3/"
					target="_blank"
					rel="noopener noreferrer">the "big image" threshold, WordPress 5.3</a
				>), and Squarespace's largest generated variant is 2500 wide (<a
					href="https://support.squarespace.com/hc/en-us/articles/206542517"
					target="_blank"
					rel="noopener noreferrer">Squarespace Support, Formatting images</a
				>). Uploading 4000 pixels to either gets you a 2500-pixel file and a slower upload.
			</p>
			<p class="mb-4">
				<strong
					>Mobile hero image size: a separate crop, about 1080 wide, portrait or square.</strong
				>
				Phones in StatCounter's top five are 360 to 414 layout pixels wide, drawn at 2x to 3x, so a file
				800 to 1,170 pixels wide is full sharpness on all of them. The usual recommendation is 1080 by
				1350 (4:5) or 1080 by 1440 (3:4); both fill a phone's hero area with no side cropping. Keep the
				subject central here too, because phones vary in height and the box will still trim top and bottom.
			</p>
			<p class="mb-4">
				<strong>What about 2500, 3000, 1600?</strong> Squarespace recommends uploading 2500 wide because
				it makes its own seven sizes from your upload (100 to 2500 wide) and warns that images under 1500
				may look blurry; Wix asks for at least 3000 by 3000 for section backgrounds; theme vendors print
				1600 by 500 or 3000 by 1500 from their own measurements. None of them conflict with the numbers
				above once you know which of the three sizes they are talking about: the big uploads are the platform
				asking for a master it can resize from, and the serving sizes are what the visitor gets. Where
				you control the file the visitor receives, 1920 is the number.
			</p>
		</section>

		<section id="file-size" class="scroll-mt-24">
			<SectionHeading
				>File size: what a 1920-pixel hero weighs in JPEG, WebP and AVIF</SectionHeading
			>
			<p class="mb-4">
				A 1920 by 1080 hero photograph lands between about 250 KB and 500 KB as an AVIF or a modern
				JPEG depending on how much fine detail is in it, and "under 200 KB", the figure every sizing
				guide repeats, is a budget you reach by choosing the quality setting, not a number the
				format hands you for free. What the guides leave out is that a kilobyte target only means
				something at a stated pixel size and format, and that the picture itself decides most of it:
				a sky, a wall or a product on white compresses to a fraction of what a tree does.
			</p>
			<p class="mb-4">
				We measured it on October 15, 2026, with a deliberately hard subject: a 2576 by 1932 iPhone
				photograph of a garden under a cherry tree, 1.79 MB as it came off the phone, almost
				entirely leaves, grass and twigs, with no flat areas for an encoder to save on. Every step
				below went through Mochify's API with the quality left on automatic unless stated; the
				baselines are the same pixels saved as an ordinary JPEG at quality 85, which is the file a
				careful person would upload.
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Pixels first.</strong> Resizing the full frame from 2576 to 1920 wide took the JPEG
						from 1.79 MB to 1.05 MB. Cropping it to the 16:9 shape a full-screen hero section actually
						shows (1920 by 1080) took it to 822 KB. That is 54% gone before any format question arises,
						and it is the step people skip because the platform "resizes it anyway". It does, for display;
						it does not always re-encode the file it serves, and it never fixes a file that was heavy
						at 1920 to begin with.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Format second.</strong> At 1920 by 1080 and automatic quality, the 822 KB JPEG
						came back as a 438 KB AVIF (47% smaller), a 463 KB JPEG re-encoded with jpegli (44%
						smaller) and a 517 KB WebP (37% smaller). Two things worth noticing: AVIF won, as it
						usually does on photographs, and a modern JPEG encoder beat WebP, which means "convert
						to WebP" is not automatically a saving over a well-made JPEG. Support is no longer the
						question: caniuse's September 2026 data has AVIF at 96.35% of global users and WebP at
						97.18% (<a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer"
							>caniuse, AVIF</a
						>). Keep a JPEG as the fallback for the last few percent, and if JPEG is all your
						platform will take, make it with a modern encoder: Google's jpegli produces standard
						JPEG files that open everywhere and are, in Google's words, "35% more" compressed than
						traditional JPEG at high quality (<a
							href="https://opensource.googleblog.com/2024/04/introducing-jpegli-new-jpeg-coding-library.html"
							target="_blank"
							rel="noopener noreferrer">Google Open Source Blog, April 2024</a
						>).
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Quality last, and this is where the 200 KB comes from.</strong> The automatic setting
						is tuned for "nothing visible lost", and on this picture that is 438 KB. Asking for AVIF at
						quality 45 instead gave 246 KB, 70% below the JPEG baseline. We then put a 1:1 crop of the
						busiest patch of foliage from the baseline, the automatic AVIF and the quality-45 AVIF side
						by side and could not find a difference. That is one region of one image checked by one pair
						of eyes, so do your own check at the size the hero is shown, but it is the general shape of
						the result: on a hero, the gap between "automatic" and "half the bytes" is usually invisible,
						and the gap between quality 85 and 95 is always invisible and often doubles the file.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				The same photo at the sizes a <code>srcset</code> would serve (section 7): at 800 by 600 the baseline
				JPEG was 198 KB and the AVIF 110 KB, so the phone file is where a 200 KB budget is met without
				touching the quality at all.
			</p>
			<p class="mb-4">
				For scale: the HTTP Archive's 2024 Web Almanac found that 48% of mobile sites served an LCP
				image of 100 KB or less, which means the top half of the web is already under budget and the
				bottom half is where the four-second heroes live (<a
					href="https://almanac.httparchive.org/en/2024/performance"
					target="_blank"
					rel="noopener noreferrer">Web Almanac 2024, Performance</a
				>). The three levers, in the order they pay:
			</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>Pixels first.</strong> Resizing a 4000-pixel camera file to the 1920 the page shows
						removes three quarters of the pixels before any format question arises. This is the biggest
						single saving on most sites and the one people skip, because the platform "resizes it anyway".
						It does, for display; it does not always re-encode the file it serves, and it never fixes
						a file that was 2 MB at 1920 to begin with.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Format second.</strong> At the same pixels and the same visible quality, WebP
						and AVIF are roughly half the weight of a JPEG, and AVIF is usually the smaller of the
						two on photographs. Support is no longer the question: caniuse's September 2026 data has
						AVIF at 96.35% of global users and WebP at 97.18% (<a
							href="https://caniuse.com/avif"
							target="_blank"
							rel="noopener noreferrer">caniuse, AVIF</a
						>). Keep a JPEG as the fallback for the last few percent, and if JPEG is all your
						platform will take, encode it with a modern encoder: Google's jpegli produces standard
						JPEG files that open everywhere and are, in Google's words, "35% more" compressed than
						traditional JPEG at high quality (<a
							href="https://opensource.googleblog.com/2024/04/introducing-jpegli-new-jpeg-coding-library.html"
							target="_blank"
							rel="noopener noreferrer">Google Open Source Blog, April 2024</a
						>).
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Quality last.</strong> The difference between "quality 85" and "quality 95" is invisible
						on a hero and often doubles the file. Let the encoder choose, check the result at the size
						it is shown, and only then adjust.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				Two things that do not help: PPI or DPI (print settings that have no effect on screen
				rendering or on file weight, as Squarespace's support page states plainly), and "lossless"
				(pixel-exact encoding is for screenshots and diagrams; on a photograph it makes a larger
				file than the JPEG you started with).
			</p>
		</section>

		<section id="lcp" class="scroll-mt-24">
			<SectionHeading>The slow page: the hero is your LCP image</SectionHeading>
			<p class="mb-4">
				If your page feels slow to show its top picture, that is Largest Contentful Paint, and the
				hero is the element being measured. Google scores LCP as good at 2.5 seconds or less and
				poor above 4 seconds, measured at the 75th percentile of real visits on mobile and desktop
				separately (<a href="https://web.dev/articles/lcp" target="_blank" rel="noopener noreferrer"
					>web.dev, Largest Contentful Paint</a
				>). Images, including an element with a CSS background image, count; so does a block of
				text, which is why a hero with a big headline and a slow photo sometimes scores on the
				headline instead. In 2024, 59% of mobile pages and 74% of desktop pages passed, so a failing
				hero puts you with the 41% of mobile pages that did not, and the fix is usually the file in
				the previous section plus one of the serving rules in the next.
			</p>
			<p class="mb-4">
				<strong>See it yourself, click by click.</strong> Open
				<a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer"
					>pagespeed.web.dev</a
				>, paste your page's address, and run the analysis. Stay on the Mobile tab (that is where
				sites fail). Scroll to the diagnostics and find the one titled
				<strong>Largest Contentful Paint element</strong>: it names the element (with a snippet of
				its HTML, so you can see whether it is your hero's <code>&lt;img&gt;</code>) and breaks its
				time into four parts. If the element is your hero image and the number is red or orange,
				this guide is the fix. If the element is a block of text, the hero loaded after the text
				painted, which is its own kind of slow (see "not discoverable" below).
			</p>
			<p class="mb-4">
				<strong>The four parts, in plain English.</strong> Google splits an image's LCP time into:
				the time until the server sends the page at all (TTFB); the delay before the browser even
				starts fetching the image (resource load delay); the download itself (load duration); and
				the wait between the download finishing and the picture being drawn (render delay).
				web.dev's guidance is that the download should be about 40% of the total and the delay
				before it starts under 10%, and its own research found that "websites spend more time on
				resource load delay than on load duration" (<a
					href="https://web.dev/articles/optimize-lcp"
					target="_blank"
					rel="noopener noreferrer">web.dev, Optimize LCP</a
				>). In other words: a heavy file is the usual problem, but a file the browser did not know
				to fetch early is nearly as common, and the 2024 Almanac counts 35% of mobile sites whose
				LCP element is not discoverable in the HTML at all. That is the CSS-background problem, and
				section 7 is about it.
			</p>
			<p class="mb-4">
				<strong>What a good result looks like.</strong> To improve LCP on a page whose largest
				element is the hero, this is the target: hero as an <code>&lt;img&gt;</code> in the HTML, 1920
				wide, AVIF or WebP at a few hundred kilobytes with a JPEG fallback, marked high priority, not
				lazy-loaded, with its width and height declared so the page does not jump when it arrives (that
				jump is a second Core Web Vital, CLS, which Google wants at 0.1 or less and which "images or videos
				with unknown dimensions" cause). Do that and the hero's share of LCP is the download of one small
				file that starts the moment the page arrives.
			</p>
		</section>

		<section id="serving" class="scroll-mt-24">
			<SectionHeading
				>Serving it right: <code>&lt;img&gt;</code>, <code>fetchpriority</code>,
				<code>srcset</code> and <code>&lt;picture&gt;</code></SectionHeading
			>
			<p class="mb-4">
				Put the hero in the HTML as an <code>&lt;img&gt;</code> with
				<code>fetchpriority="high"</code>, never lazy-load it, declare its width and height, and
				give the browser a smaller file for phones with <code>srcset</code> or a different crop with
				<code>&lt;picture&gt;</code>. That is the whole list; here is each one with the simplest
				form first.
			</p>
			<p class="mb-4">
				<strong>Use <code>&lt;img&gt;</code>, not a CSS background.</strong> A background image
				lives in a stylesheet, so the browser only discovers it after it has downloaded and read the
				CSS, then started the image. An <code>&lt;img&gt;</code> is in the HTML itself, so the fetch
				starts while the page is still arriving. web.dev's rule is that an LCP image that is a CSS
				background is "not discoverable" unless you add a preload for it, and that "preload is still
				required for early discovery of LCP images included as CSS backgrounds" (<a
					href="https://web.dev/articles/fetch-priority"
					target="_blank"
					rel="noopener noreferrer">web.dev, Fetch Priority</a
				>). If your theme forces a background (many page-builder "section background" settings do),
				the preload line below is the patch; moving the hero to an image block is the fix.
			</p>
			<CodeCard filename="hero.html" code={heroCode} />
			<p class="mb-4">
				Three attributes do the work. <code>width</code> and <code>height</code> let the browser
				reserve the right space before the file arrives (<a
					href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img"
					target="_blank"
					rel="noopener noreferrer">MDN says</a
				>
				this "reduces or even prevents a layout shift"); they are the file's pixels, and CSS can still
				scale the box. <code>fetchpriority="high"</code> tells the browser to fetch this image ahead
				of the others; web.dev's test on Google Flights moved LCP from 2.6 s to 1.9 s with that one
				attribute, and it is supported in Chrome and Edge since 102, Safari since 17.2 and Firefox
				since 132. Set it on one image, the hero; on three it stops meaning anything. And note what
				is
				<strong>not</strong> there: no <code>loading="lazy"</code>. web.dev's wording is "never
				lazy-load your LCP image", yet 16% of mobile sites still did in 2024. Many themes add lazy
				loading to every image including the first; if yours does, remove it from the hero.
			</p>
			<p class="mb-4">
				<strong>The broken case, and its fix.</strong> The hero is set as the background of a
				<code>&lt;section&gt;</code> in the theme's CSS, the page scores a 3.8 s LCP, and PageSpeed
				names the section. You cannot change the markup. The patch is a preload in the
				<code>&lt;head&gt;</code>, which tells the browser about the file before it has read the
				CSS:
			</p>
			<CodeCard filename="head.html" code={headCode} />
			<p class="mb-4">
				That brings discovery forward and usually takes a second off. It is still worse than an
				<code>&lt;img&gt;</code>, because a preload names one file for every screen; our Quick
				Answer on
				<a href="https://mochify.app/guides/fetchpriority-vs-preload-lcp-image"
					>fetchpriority versus preload for the LCP image</a
				>
				covers when you need both and when the attribute alone is enough, and WordPress users have a
				<a href="https://mochify.app/guides/preload-avif-hero-images-wordpress-lcp"
					>preload walkthrough for AVIF heroes</a
				>.
			</p>
			<p class="mb-4">
				<strong
					>Smaller files for smaller screens: <code>srcset</code> and <code>sizes</code>.</strong
				>
				A phone does not need the 1920-pixel file. With <code>srcset</code> you list several widths
				of the same image and tell the browser how wide the box will be; it picks the smallest file
				that is sharp on that screen (MDN: with width descriptors "the browser uses those
				descriptors together with the
				<code>sizes</code> attribute to pick a resource").
			</p>
			<CodeCard filename="hero-srcset.html" code={srcsetCode} />
			<p class="mb-4">
				Follow a visitor through it. On a 390-wide 3x phone the box is 390 layout pixels, so the
				browser wants about 1,170 image pixels and takes <code>hero-1280.jpg</code>. On a 1x 1920
				monitor it takes <code>hero-1920.jpg</code>. On a 2x 1440 laptop it wants 2,880 and takes
				the largest you offered, 1920, scaled up a little. The same photograph is served at three
				weights and nobody sees a difference. <code>sizes="100vw"</code> means "the box is the full
				window width", which is true for a full-bleed hero; a hero inside a 1200-pixel container
				would say
				<code>sizes="(min-width: 1200px) 1200px, 100vw"</code>.
			</p>
			<p class="mb-4">
				<strong>A different crop for phones: <code>&lt;picture&gt;</code>.</strong>
				<code>srcset</code> changes the size; it cannot change the shape. For the portrait phone
				crop from section 3 you wrap the <code>&lt;img&gt;</code> in a <code>&lt;picture&gt;</code>
				with a
				<code>media</code> condition, and the same wrapper is how you offer AVIF and WebP with a JPEG
				fallback:
			</p>
			<CodeCard filename="hero-picture.html" code={pictureCode} />
			<p class="mb-4">
				The browser reads top to bottom and takes the first source it can use, so phones get the
				portrait AVIF, everything else the landscape AVIF, and anything that cannot open AVIF falls
				to the JPEG. The attributes stay on the <code>&lt;img&gt;</code>; the
				<code>&lt;picture&gt;</code>
				is only a wrapper. The rules that make this render, the source order for 2026, and the WebP
				line we left out here for brevity are in our guide to
				<a href="https://mochify.app/guides/html-picture-tag">the HTML picture tag</a>.
			</p>
			<p class="mb-4">
				<strong>Verify it, click by click.</strong> Open the page in Chrome, right-click, choose Inspect,
				open the Network tab, click the Img filter and reload. The first image in the list should be your
				hero, its Priority column should read High (right-click a column header to show Priority if it
				is hidden), and its Size column should be the figure you budgeted. Shrink the window to phone
				width and reload: the phone file should appear instead. If the hero is not near the top of the
				list, the browser found it late (a CSS background, or lazy loading); if the size is large, the
				file section is where to go back to.
			</p>
			<p class="mb-4">
				<strong>When none of this is needed.</strong> A hosted builder adds most of it for you:
				WordPress has set <code>fetchpriority</code> on the likely LCP image since 2023 (the Almanac
				credits that for adoption jumping from 0.03% to 15% of mobile sites) and has generated
				<code>srcset</code>
				since version 4.4; Squarespace and Webflow generate the size variants and the
				<code>srcset</code> on upload. On those platforms your job is the file and the crop, and the markup
				is theirs; check it in the Network tab once, then leave it.
			</p>
		</section>

		<section id="platforms" class="scroll-mt-24">
			<SectionHeading
				>Platform workflows: WordPress, Shopify, Squarespace, Wix, Webflow</SectionHeading
			>
			<p class="mb-4">
				Every builder resizes your upload for display; none of them will fix a file that was too
				heavy at the pixels it needs, and each crops by its own rules. Here is what each one does,
				from its own documentation, and what you still have to do.
			</p>
			<h3>WordPress hero image size</h3>
			<p class="mb-4">
				WordPress makes several sizes of every upload (150, 300, 768 and 1024 wide by default, plus
				your theme's own), serves them with <code>srcset</code> and <code>sizes</code> since version
				4.4, and scales any image with a side over 2560 pixels down to 2560 on upload. Since 2023
				core also sets
				<code>fetchpriority="high"</code> on the image it judges likely to be the LCP element. So
				the markup is largely done for you, and the work is the file: resize the hero to 1920 (or
				2560 if you want a 2x master; anything larger is wasted), convert it to AVIF or WebP, and
				upload that. Core does not convert formats itself; our guides on
				<a href="https://mochify.app/guides/next-gen-image-formats-wordpress"
					>fixing the "next-gen formats" warning in WordPress</a
				>
				and on
				<a href="https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin"
					>what WordPress 7.1 optimizes without a plugin</a
				>
				cover the routes. Two checks: if a theme or plugin lazy-loads every image, make sure the hero
				is excluded; and if the hero is a block or page-builder <em>background</em>, it is a CSS
				background with the discovery problem above, so prefer an image block or add the preload.
			</p>
			<h3>Shopify hero image size</h3>
			<p class="mb-4">
				Shopify accepts uploads up to 20 MB and about 20 megapixels (its help pages give both 20 MP
				and 25 MP / 5000 by 5000 as the ceiling; stay under 20), recommends 2048 by 2048 for square
				product images, and crops banner and slideshow images to the section's shape, as quoted in
				section 3. There is no official pixel size for the Dawn or Horizon hero sections, whatever
				third-party guides print; the honest answer is "the ratio your banner height setting
				produces", which you find by inspecting the rendered section. Upload 1920 wide at that
				ratio, set a focal point on the image so the crop centers on the subject, and keep text out
				of the image and in the section's text fields. Shopify's CDN can serve resized variants to
				the theme, so phones need not get the full file; what it serves is derived from your upload,
				so upload a file that is already under budget at 1920 rather than a 6 MB original. Some
				themes offer a separate mobile image for banners; where yours does, use it for the portrait
				crop.
			</p>
			<h3>Squarespace hero image size</h3>
			<p class="mb-4">
				Squarespace Support asks for 2500 pixels wide, warns that images under 1500 wide may look
				blurry on computers, recommends 500 KB or less for speed, accepts .jpg, .png, .gif and .webp
				up to 20 MB and 120 megapixels, and makes seven widths from your upload (100 to 2500) to
				serve by screen size. It also says, correctly, that DPI and PPI "only affect an image's
				print quality, not its web display". So: upload a 2500-wide master in WebP (AVIF is not on
				the accepted list) at a weight well under 500 KB, match the image's shape to the section's,
				and set the focal point so the mobile crop keeps the subject. Squarespace's own blog quotes
				hero files of 10 to 20 MB, which is the upload limit, not a target; its support page's 500
				KB is the number to work to.
			</p>
			<h3>Wix hero image size</h3>
			<p class="mb-4">
				Wix converts images to AVIF on the live site automatically, accepts uploads up to 50 MB, and
				asks for at least 3000 by 3000 for section backgrounds (<a
					href="https://support.wix.com/en/article/wix-media-supported-media-file-types-and-file-sizes"
					target="_blank"
					rel="noopener noreferrer">Wix, supported media file types</a
				>). A strip's image setting of "Scale to Fill" crops to the strip's shape, with a grid for
				choosing the focal point. Because Wix handles the format and the resizing, your lever is the
				shape and the focal point: match the image to the strip, pick the focal point, and check the
				strip in the mobile editor view before publishing. Do not upload a 50 MB file because you
				can; a clean 2500-wide master under a megabyte is plenty for Wix to derive from.
			</p>
			<h3>Webflow hero image size</h3>
			<p class="mb-4">
				Webflow limits image uploads to 4 MB and generates up to seven variants (3200, 2600, 2000,
				1600, 1080, 800 and 500 wide) with <code>srcset</code> and <code>sizes</code> for images
				added through the designer, but not for background images and not for images added by CSV or
				API (<a
					href="https://help.webflow.com/hc/en-us/articles/33961378697107-Responsive-images"
					target="_blank"
					rel="noopener noreferrer">Webflow Help, Responsive images</a
				>). The 4 MB limit means you are resizing and compressing before upload anyway; do it to
				1920 or 2560 and AVIF or WebP. And because the variants do not apply to backgrounds, put the
				hero in an Image element rather than a section background, or you get one file for every
				screen and the discovery delay on top.
			</p>
		</section>

		<section id="video" class="scroll-mt-24">
			<SectionHeading>When your hero is a video</SectionHeading>
			<p class="mb-4">
				An autoplaying video hero has the same problem as an oversized image, usually worse: a heavy
				MP4 has to start downloading and decoding before the browser can paint anything, and the
				poster image, if there is one, is what LCP measures. Treat the poster as the hero
				(everything above applies to it), keep the clip short and muted, and convert it to WebM,
				which is smaller at the same quality in every browser that matters. Our guide to
				<a href="https://mochify.app/guides/mp4-to-webm-web-video-guide"
					>converting MP4 to WebM for the web</a
				>
				covers the settings, and the
				<a href="https://mochify.app/solutions/mp4-to-webm">MP4 to WebM converter</a> runs in your browser,
				so the video never leaves your device. Video is the one Mochify format that is processed on-device;
				images are not, and the next section says so.
			</p>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading
				>Mochify Workflow: resize, convert and compress a hero in one prompt</SectionHeading
			>
			<p class="mb-4">
				The fastest way to get a hero to the right pixels, format and weight is to describe the
				result rather than configure it. Mochify's Magic Flow takes a plain-English instruction and
				applies the resize, the format and the quality in one pass; the same engine is behind the
				CLI for a folder of images and the Chrome extension for a single image on a page.
			</p>
			<GlassPanel>
				<ol class="workflow-steps">
					<li>
						<h3>In the browser</h3>
						<p class="mb-4">
							Open <a href="https://mochify.app/flow">Magic Flow</a>, drop the original photograph
							(3 files per batch and up to 20 MB each with a free account, 25 per batch and 75 MB on
							Seller, Pro, Growth or a Day Pass), and type
							<code>resize to 1920px wide, convert to avif</code>. The file comes back resized and
							encoded, usually at a fraction of the original's weight. If it is still over your
							budget, drop the result in again and name the number:
							<code>compress to 250KB</code>. Drop the original again with
							<code>resize to 1920px wide, convert to webp</code> and
							<code>resize to 1920px wide, compress</code> (the last one returns a JPEG re-encoded
							with jpegli, your fallback), and you have the three files the
							<code>&lt;picture&gt;</code>
							snippet needs. For the <code>srcset</code> set, repeat with <code>1280px wide</code>
							and
							<code>800px wide</code>. For the phone crop, drop the portrait version you made in
							your photo editor, or ask for it: <code>crop to 1080 by 1350, convert to avif</code> (the
							crop centers on the subject it detects, which works well when the subject is obvious; check
							the result).
						</p>
					</li>
					<li>
						<h3>From the terminal, for a folder</h3>
						<p class="mb-4">
							The <code>mochify</code> CLI is a client over the same API, so it takes the same instructions
							and adds patterns and output folders:
						</p>
						<CodeCard filename="resize.sh" code={resizeCode} />
						<p class="mb-4">
							The <a href="https://mochify.app/docs">API docs</a> have the same call as
							<code>POST /v1/squish</code> with <code>type=avif</code>, <code>width=1920</code> and
							an
							<code>Authorization: Bearer</code> header, for a build step that resizes every hero on the
							way in.
						</p>
					</li>
					<li>
						<h3>In Chrome, for one image</h3>
						<p class="mb-4">
							Right-click any image on a page, choose Mochify, then "Convert to" and the format. It
							is a direct conversion with no prompt and no settings, one image at a time, and the
							file lands in Downloads; "Send to Mochify..." opens the prompt panel for a resize. The
							<a href="https://mochify.app/chrome-extension">Mochify for Chrome page</a> has the install
							link.
						</p>
					</li>
				</ol>
			</GlassPanel>
			<p class="mt-6 mb-4">
				<strong>Metadata.</strong> Camera files carry EXIF (camera model, GPS position, timestamps),
				which adds weight and leaks where the photo was taken. Mochify strips it by default on every
				path above (the API unless you send <code>stripExif=false</code>, the CLI unless you pass
				<code>--keep-metadata</code>); for a hero on a public page that is what you want. Our guide
				to
				<a href="https://mochify.app/guides/exif-data-risks-image-compression-2026"
					>EXIF data and the risks of leaving it in</a
				> has the detail.
			</p>
			<p class="mt-6 mb-4 text-base leading-relaxed text-[#875F42]">
				<strong>Privacy, for this workflow.</strong> Images travel to <code>api.mochify.app</code> over
				HTTPS, are streamed into the encoder in memory, and are wiped the moment the encode finishes:
				no disk writes, no logs containing file data, and never used to train AI. That holds for the web
				app, the CLI and the extension alike; the CLI writes the result to your disk and nothing is kept
				on the server. Video, as above, is processed in the browser and never leaves your device.
			</p>
		</section>

		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat Sheet</SectionHeading>
			<GuideTable class="my-6">
				<table>
					<thead><tr><th>Question</th><th>Answer</th></tr></thead>
					<tbody>
						<tr>
							<td>Desktop hero, full width</td>
							<td
								>Upload 1920 wide, height at the section's ratio: 1920 x 1080 (16:9 full screen),
								1920 x 800 (2.4:1 banner), 1920 x 640 (3:1 strip)</td
							>
						</tr>
						<tr>
							<td>2x / retina file</td>
							<td
								>2560 wide at most (WordPress scales above 2560 down; Squarespace tops out at 2500);
								only for product shots, type or line art, and only if the AVIF is still under budget</td
							>
						</tr>
						<tr>
							<td>Phone hero</td>
							<td
								>A separate portrait crop, 1080 x 1350 (4:5) or 1080 x 1440 (3:4); subject centered</td
							>
						</tr>
						<tr>
							<td>Weight target</td>
							<td
								>Aim under about 200 KB at 1920 wide; our run at 1920 x 1080 (detail-heavy photo):
								JPEG q85 822 KB, AVIF auto 438 KB, jpegli JPEG 463 KB, WebP 517 KB, AVIF q45 246 KB
								with no visible loss at 1:1; half of mobile sites' LCP images are already under 100
								KB (Web Almanac 2024)</td
							>
						</tr>
						<tr>
							<td>Format order</td>
							<td>AVIF (96.35% support), WebP (97.18%), JPEG fallback (caniuse, Sep 2026 data)</td>
						</tr>
						<tr>
							<td>Why it crops</td>
							<td
								>The section fixes the shape; the image is scaled to cover it and the overflow is
								clipped; wide images lose their sides on phones, tall ones lose top and bottom on
								monitors</td
							>
						</tr>
						<tr>
							<td>Safe zone</td>
							<td
								>Subject and anything you cannot lose inside the middle half of the width and middle
								two-thirds of the height; set the platform's focal point; never bake text into the
								image</td
							>
						</tr>
						<tr>
							<td>Markup</td>
							<td
								><code>&lt;img&gt;</code> in the HTML, not a CSS background; <code>width</code> and
								<code>height</code> declared; <code>fetchpriority="high"</code> on the hero only; no
								<code>loading="lazy"</code>; <code>srcset</code> for sizes,
								<code>&lt;picture&gt;</code> for the phone crop and the AVIF/WebP/JPEG order</td
							>
						</tr>
						<tr>
							<td>Forced CSS background</td>
							<td
								><code
									>&lt;link rel="preload" as="image" href="hero.avif" type="image/avif"
									fetchpriority="high"&gt;</code
								>
								in the <code>&lt;head&gt;</code></td
							>
						</tr>
						<tr>
							<td>LCP line</td>
							<td
								>2.5 s good, over 4 s poor, at the 75th percentile (web.dev); check the "Largest
								Contentful Paint element" diagnostic in PageSpeed Insights, Mobile tab</td
							>
						</tr>
						<tr>
							<td>Platform masters</td>
							<td
								>WordPress 1920-2560 (auto <code>srcset</code> and <code>fetchpriority</code>);
								Shopify 1920 at the section ratio, focal point set, under 20 MP; Squarespace 2500
								wide, under 500 KB, WebP; Wix converts to AVIF, set focal point; Webflow under 4 MB,
								Image element not background</td
							>
						</tr>
						<tr>
							<td>Making the files</td>
							<td
								>Magic Flow: <code>resize to 1920px wide, convert to avif</code>; CLI:
								<code>mochify hero.jpg -t avif -w 1920</code></td
							>
						</tr>
					</tbody>
				</table>
			</GuideTable>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA href="/flow" label="Try Magic Flow">
			Resize your hero now at <a href="https://mochify.app/flow">mochify.app/flow</a>. Twenty-five
			images a month are free with an account, three a month without one. Try it with the prompt
			<em>"resize to 1920px wide, convert to avif"</em>.
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

	/* Workflow steps: the handoff authors each step title as an <h3> and step
	   2 carries a code figure, so this is a plain list rather than StepList
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
