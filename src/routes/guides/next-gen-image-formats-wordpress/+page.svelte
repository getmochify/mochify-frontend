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

	// Built from content-ops `article-originals/next-gen-image-formats-wordpress.html` (handoff spec v1).
	// Body copy is verbatim from the handoff; head and schema are generated
	// from its metadata block per the spec's section 2.2 contract. Same-slug
	// replacement of the February 2026 guide: datePublished is kept.
	const metadata = {
		title: 'How to Fix "Improve Image Delivery" in WordPress Without a Plugin',
		seoTitle: 'Fix "Improve Image Delivery" in WordPress Without a Plugin',
		description:
			'PageSpeed\'s "Improve image delivery" is the old next-gen formats warning. What it scores, what WordPress does by itself, and the plugin-free WebP/AVIF fix.',
		category: 'WordPress Performance',
		readTime: '37 min read',
		date: 'February 9, 2026',
		lastUpdated: 'October 16, 2026',
		bylineNote:
			"Rewritten and expanded on October 16, 2026 around PageSpeed's current image insight and WordPress 7.1, with a measured size table from our own run; the first version of this guide dates from February 2026."
	};

	const keywords =
		'improve image delivery wordpress, serve images in next-gen formats wordpress, wordpress webp, wordpress avif, convert images to webp wordpress, wordpress image optimization without plugin, does wordpress support webp, wordpress image sizes, pagespeed insights images wordpress';

	const pageUrl = 'https://mochify.app/guides/next-gen-image-formats-wordpress';

	const toc = [
		{ id: 'five-terms', label: 'Five terms this guide uses' },
		{
			id: 'what-changed',
			label:
				'"Improve image delivery" is the warning that used to say "Serve images in next-gen formats"'
		},
		{ id: 'how-it-scores', label: 'How PageSpeed decides an image is too big' },
		{ id: 'what-wordpress-does', label: 'What WordPress does with your images by itself' },
		{ id: 'which-file', label: 'Which file your visitors actually get' },
		{ id: 'benchmark', label: 'One photo through WordPress: the numbers' },
		{ id: 'the-fix', label: 'The plugin-free fix, step by step' },
		{ id: 'which-format', label: 'AVIF, WebP or a better JPEG for WordPress?' },
		{
			id: 'picture-route',
			label: 'The <picture> route in the block editor, and when you do not need it'
		},
		{
			id: 'first-party-plugin',
			label: 'If you would rather WordPress did it: the first-party plugin'
		},
		{ id: 'verify', label: 'Check it worked, click by click' },
		{ id: 'troubleshooting', label: 'When the warning will not go away' },
		{
			id: 'mochify-workflow',
			label: 'Mochify Workflow: converting WordPress images before upload'
		},
		{ id: 'cheat-sheet', label: 'Cheat Sheet' },
		{ id: 'faq', label: 'FAQ' }
	];

	const pictureCode =
		'<picture>\n  <source srcset="/wp-content/uploads/2026/10/hero-1920.avif" type="image/avif">\n  <img src="/wp-content/uploads/2026/10/hero-1920.jpg"\n       alt="Describe the picture"\n       width="1920" height="1080"\n       fetchpriority="high" decoding="async">\n</picture>';

	const faqItems = [
		{
			q: 'Does WordPress support WebP and AVIF without a plugin?',
			a: "Yes for uploads. WordPress has accepted WebP uploads since version 5.8 (2021) and AVIF since 6.5 (2024), as long as the server's image library can decode them; Tools → Site Health → Info → Media Handling lists what yours supports. What core does not do without a plugin or a code filter is convert a JPEG you upload into WebP or AVIF copies. Upload the modern format yourself and WordPress makes its sub-sizes in that format."
		},
		{
			q: 'What does "Improve image delivery" mean in PageSpeed Insights?',
			a: 'It is the single insight that replaced four image audits in Lighthouse 13 (October 2025), including "Serve images in next-gen formats". It lists images whose file size is well above about 0.167 bytes per pixel, which is what Google assumes a good AVIF encode would reach, and shows the gap as estimated savings. Each image carries a message saying whether the fix is a modern format, more compression, fewer pixels or a video instead of a GIF.'
		},
		{
			q: 'Why is my image still flagged after I converted it to WebP?',
			a: 'Usually one of three reasons. The page is still embedding the old JPEG copy (check the filename in the PSI row against your Media Library). The image has more pixels than its slot, which the format change does not fix. Or the WebP is simply still above the 0.167 bytes-per-pixel yardstick: on a detailed photo, conversion at a comfortable quality shrinks the row rather than removing it, and only a lower quality setting or fewer pixels clears it.'
		},
		{
			q: 'Does WordPress 7.1 convert images to WebP automatically?',
			a: 'No. WordPress 7.1 (August 2026) moved resizing and compression into the browser on Chrome and Edge, writes JPEGs about 15% smaller than before, and converts iPhone HEIC files to JPEG at upload. Conversion to WebP or AVIF still happens only if the <code>image_editor_output_format</code> filter tells it to, so a JPEG upload still produces JPEG copies.'
		},
		{
			q: 'Should I upload AVIF or WebP to WordPress?',
			a: 'WebP for images that go straight into the Image block: 97.18% of browsers open it, it has worked in WordPress since 5.8, and every host can process it. AVIF for the hero and other large photos where its extra savings matter, ideally with a JPEG fallback through <code>&lt;picture&gt;</code>, and only after Site Health shows your host supports it (or you are on 7.1 in Chrome, which does the work in the browser). A jpegli-encoded JPEG is the choice if you want no compatibility questions; on our test photo it matched AVIF.'
		},
		{
			q: 'What image size should I upload to WordPress?',
			a: 'The widest the image will be displayed, times two at most for high-density screens: around 1,024 to 1,440 pixels for a blog column photo and about 1,920 for a full-width hero. Anything wider than 2,560 pixels is scaled down by WordPress anyway and kept only as the original file. Fewer pixels does more for the PageSpeed row than any format change, because the target it scores against is proportional to the pixel count.'
		},
		{
			q: 'Is it safe to send client or product photos to Mochify?',
			a: 'Images sent to Mochify go to <code>api.mochify.app</code>, are processed in memory and wiped as soon as the result returns; nothing is written to disk, no log holds file data, and nothing is used to train AI. That holds for the web app, the Chrome extension, the CLI and the API. Only the video tools run entirely in your browser without the file leaving your machine; images and PDFs make the round trip and are not kept.'
		}
	];

	const related = [
		{
			title: 'Can WordPress 7.1 Optimize Images Without a Plugin?',
			href: '/guides/can-wordpress-7-1-optimize-images-without-a-plugin',
			desc: 'what the browser-side pipeline does at upload, and what it still leaves to you.'
		},
		{
			title: 'Convert Website Images to WebP and AVIF (and Automate It)',
			href: '/guides/convert-website-images-to-webp-and-avif',
			desc: 'the one-command route for a whole uploads folder and a script for new files.'
		},
		{
			title: 'The HTML <picture> Tag',
			href: '/guides/html-picture-tag',
			desc: 'the full fallback snippet, responsive widths and the four rules that make it render.'
		},
		{
			title: 'Hero Image Size: Dimensions, File Size and a Fast LCP',
			href: '/guides/optimizing-hero-images',
			desc: 'the three sizes a hero needs and the benchmark behind "under 200 KB".'
		},
		{
			title: 'Should I Convert HEIC to JPEG or WebP for WordPress?',
			href: '/guides/heic-to-jpeg-or-webp-wordpress',
			desc: 'the format decision for iPhone photos before they reach the Media Library.'
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
		datePublished: '2026-02-09',
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
			'PageSpeed Insights',
			'Lighthouse',
			'WordPress',
			'WebP',
			'AVIF',
			'image optimization',
			'Largest Contentful Paint'
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
		datePublished: '2026-02-09',
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
			{metadata.title}
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated} · Mochify Engineering
			Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			You ran PageSpeed Insights on your WordPress site and it lists your photos under <strong
				>"Improve image delivery"</strong
			>, with an estimated saving next to each one and a line like
			<em
				>"Using a modern image format (WebP, AVIF) or increasing the image compression could improve
				this image's download size."</em
			>
			If you last looked a year ago, the same row was called
			<strong>"Serve images in next-gen formats"</strong>. It is the same complaint with a new name:
			the files your page sends are bigger than the pictures in them need to be, and the biggest of
			them is usually also the thing Google times for your Largest Contentful Paint score.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			WordPress does not fix this for you, and that is not a bug. Core keeps the format you upload,
			makes several smaller JPEG copies of it at a fixed quality setting, and serves one of those
			copies in your posts. Since version 7.1 it does that work in your browser instead of on your
			server, which makes the copies a little smaller, but it still converts nothing to WebP or AVIF
			unless a plugin or a line of code tells it to. Leave it at the defaults and you get the same
			images as every other WordPress site: fine, average, and flagged.
		</p>
		<p class="mt-5 mb-0 text-lg leading-relaxed text-[#6C3F31]">
			The usual advice is to install an image optimization plugin. That works, and this guide tells
			you which one WordPress itself publishes if you want that route. But a plugin that re-encodes
			your whole library is a lot of machinery for what is usually a handful of images on a handful
			of pages, and it adds a service, a quota and a settings page to a site you were trying to make
			lighter. The alternative is older and simpler: give WordPress images that are already the
			right size and the right format, and let it serve them like any other image. This guide shows
			you how to do exactly that for the images PageSpeed names, with one measured example so you
			know what to expect, and how to check that it worked. If you do not write code, start with the
			five terms below; the rest of the guide assumes only those.
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

		<section id="five-terms" class="scroll-mt-24">
			<SectionHeading>Five terms this guide uses</SectionHeading>
			<p class="mb-4">Everything below rests on five words. If you know them, skip ahead.</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>PageSpeed Insights (PSI) and Lighthouse.</strong> Lighthouse is Google's page-testing
						engine; PageSpeed Insights is the web page at pagespeed.web.dev that runs it for you. The
						advice rows PSI shows are Lighthouse's, so the two names mean the same report.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Format.</strong> The kind of image file. JPEG and PNG are the old universal ones.
						WebP (2010) and AVIF (2019) store the same picture in a smaller file, which is why speed tests
						ask for them. Switching format changes nothing about the picture, only how it is packed.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Sub-sizes.</strong> The smaller copies WordPress makes of every image you upload (thumbnail,
						medium, large and so on). The file you uploaded is kept; the copies are what your posts mostly
						show.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>LCP (Largest Contentful Paint).</strong> How long the biggest thing in the first
						screen takes to appear. Google's "good" line is 2.5 seconds for most visitors (<a
							href="https://web.dev/articles/lcp"
							target="_blank"
							rel="noopener noreferrer">web.dev</a
						>). On most WordPress pages the biggest thing is an image, which is why image rows sit
						next to LCP in the report.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Bytes per pixel.</strong> File size divided by the number of pixels in the picture.
						A 300 KB photo that is 1,024 by 768 pixels is 0.38 bytes per pixel. PageSpeed thinks in this
						unit, and once you do too, the report stops being mysterious.
					</p>
				</li>
			</ul>
		</section>

		<section id="what-changed" class="scroll-mt-24">
			<SectionHeading
				>"Improve image delivery" is the warning that used to say "Serve images in next-gen formats"</SectionHeading
			>
			<p class="mb-4">
				In October 2025 Google's Lighthouse 13 removed four separate image audits from its report,
				"Serve images in next-gen formats" among them, and replaced them with a single insight
				called
				<strong>Improve image delivery</strong>, with PageSpeed Insights due to follow within the
				week (<a
					href="https://developer.chrome.com/blog/lighthouse-13-0"
					target="_blank"
					rel="noopener noreferrer">Lighthouse 13 release notes</a
				>). The Chrome documentation for the old audit now opens with a banner saying it has moved
				into the new insight. If you are following a tutorial that tells you to look for "next-gen
				formats" in the Opportunities list, that list no longer exists; look for "Improve image
				delivery" in the report's Insights section instead.
			</p>
			<p class="mb-4">
				The new insight is the four old ones in one row, and each image it lists carries one of four
				messages. You will see them verbatim in PSI, so here they are with what each one means for a
				WordPress site:
			</p>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr
							><th>Message in PageSpeed Insights</th><th>What it is really saying</th><th
								>The usual WordPress cause</th
							></tr
						></thead
					>
					<tbody>
						<tr>
							<td
								><em
									>Using a modern image format (WebP, AVIF) or increasing the image compression
									could improve this image's download size.</em
								></td
							>
							<td
								>A JPEG or PNG is heavier than the same picture would be as a well-compressed AVIF.</td
							>
							<td
								>A photo uploaded as JPEG or PNG and served as one of WordPress's quality-82 copies.</td
							>
						</tr>
						<tr>
							<td
								><em
									>Increasing the image compression factor could improve this image's download size.</em
								></td
							>
							<td
								>The file is already WebP or AVIF but was saved at a quality higher than the picture
								needs.</td
							>
							<td>A WebP exported from a design tool at quality 95-100.</td>
						</tr>
						<tr>
							<td
								><em
									>This image file is larger than it needs to be (W x H) for its displayed
									dimensions (w x h). Use responsive images to reduce the image download size.</em
								></td
							>
							<td>The browser downloaded more pixels than it drew.</td>
							<td
								>The full-size upload used in a slot a quarter of its width; a theme header or
								slider that ignores WordPress's sub-sizes.</td
							>
						</tr>
						<tr>
							<td
								><em
									>Using video formats instead of GIFs can improve the download size of animated
									content.</em
								></td
							>
							<td>An animated GIF over 100 KiB.</td>
							<td>A GIF in a post or a page builder block.</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				The row that fixes most of the page is almost always the first one, and this guide is mostly
				about it. The third one is about size rather than format, and it matters just as much; it is
				why "convert everything to WebP" alone often leaves the row in place.
			</p>
		</section>

		<section id="how-it-scores" class="scroll-mt-24">
			<SectionHeading>How PageSpeed decides an image is too big</SectionHeading>
			<p class="mb-4">
				PageSpeed does not convert your image and measure the result. It applies a yardstick: about <strong
					>0.167 bytes per pixel</strong
				>, the size it assumes a good AVIF encoder would reach, and it reports the gap between your
				file and that figure as the "estimated savings". Anything under 4 KiB of estimated saving is
				left off the list. That is the whole mechanism, and knowing it changes how you read the
				report.
			</p>
			<p class="mb-4">
				The yardstick comes straight from the insight's source code in Chrome DevTools, which
				Lighthouse shares (<a
					href="https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/models/trace/insights/ImageDelivery.ts"
					target="_blank"
					rel="noopener noreferrer">ImageDelivery.ts</a
				>). The target is written as 2 bytes per pixel (a plain bitmap with 4:2:2 color) divided by
				12, a 12:1 compression ratio, and the estimate for each image is simply its size minus 0.167
				times its width times its height, where width and height are the image file's own pixels,
				not the space it fills on the page. A JPEG or PNG above the target gets the "modern format
				or compression" message; a WebP or AVIF above it gets the "compression" message. Three more
				rules from the same file are worth knowing:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>The 4 KiB floor.</strong> Images whose estimated saving is 4,096 bytes or less are
						not shown at all. Small icons and thumbnails fall out of the report on their own.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>A 12 KiB allowance for responsive images.</strong> The "larger than it needs to
						be" check ignores up to 12 KiB of waste when the image has a <code>srcset</code> or sits
						in a
						<code>&lt;picture&gt;</code>, because an effort was made. WordPress adds
						<code>srcset</code> to the images it serves from the Image block, so a WordPress post gets
						this allowance; a hard-coded theme banner does not.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>GIFs are judged by size alone.</strong> Anything over 100 KiB is flagged for video,
						whatever its pixels.
					</p>
				</li>
			</ul>
			<p class="mb-4">
				Two consequences follow. First, the "estimated savings" figure is the file's distance from a
				12:1 ideal, not a measurement of what any particular conversion will save you; a detailed
				photograph compressed to a quality you would be happy to publish will often land above 0.167
				and stay on the list, smaller than before. Second, <strong
					>pixels are the lever the formula rewards most.</strong
				>
				Halving the width quarters the pixel count and quarters the target along with it, which is why
				the step order later in this guide is size first, encoder second, format third, the same order
				the insight's own documentation gives (<a
					href="https://developer.chrome.com/docs/performance/insights/image-delivery"
					target="_blank"
					rel="noopener noreferrer">Improve image delivery</a
				>).
			</p>
			<p class="mb-4">
				Work it on a real number. A 1,024 by 768 photo is 786,432 pixels, so the target is about 131
				KB. WordPress's own quality-82 copy of a busy garden photo at that size is 296 KB (0.38
				bytes per pixel), and PSI would show roughly 165 KB of estimated savings next to it. Convert
				the same copy to AVIF at an automatic quality and it becomes 178 KB; the row shrinks to
				about 47 KB but does not vanish. Take the AVIF down to quality 45 and it is 96 KB, under the
				target, and the row goes. Whether you want the row gone or the page fast is a decision this
				guide comes back to in the benchmark section.
			</p>
		</section>

		<section id="what-wordpress-does" class="scroll-mt-24">
			<SectionHeading>What WordPress does with your images by itself</SectionHeading>
			<p class="mb-4">
				WordPress accepts WebP and AVIF uploads, makes JPEG copies of JPEGs at a fixed quality, and
				converts nothing to a new format unless code tells it to. Here is the current behavior,
				version by version, so you know what you are working with and what the plugins are selling.
			</p>
			<p class="mb-4">
				<strong>It accepts WebP (since 5.8) and AVIF (since 6.5).</strong> From WordPress 5.8 you
				can upload and use WebP images like any JPEG (<a
					href="https://make.wordpress.org/core/2021/06/07/wordpress-5-8-adds-webp-support/"
					target="_blank"
					rel="noopener noreferrer">WordPress 5.8 adds WebP support</a
				>); from 6.5 the same is true of AVIF, provided your host's image library can decode it (<a
					href="https://make.wordpress.org/core/2024/02/23/wordpress-6-5-adds-avif-support/"
					target="_blank"
					rel="noopener noreferrer">WordPress 6.5 adds AVIF support</a
				>). You can check your own server under
				<strong>Tools → Site Health → Info → Media Handling</strong>, where the supported formats
				are listed. Many hosts still run an ImageMagick or GD without AVIF; on those, an AVIF upload
				is refused or arrives without its sub-sizes, which is one reason WebP remains the safer
				"just upload it" format.
			</p>
			<p class="mb-4">
				<strong>It keeps the format you upload.</strong> The 5.8 announcement says it plainly: by
				default WordPress creates the sub-sized copies "of the same type as the uploaded file".
				Upload a JPEG, get JPEG copies; upload a WebP, get WebP copies. There is a developer filter
				(<code>image_editor_output_format</code>) that can turn JPEG uploads into WebP or AVIF
				copies, and a plan to switch it on by default was reverted before WordPress 6.1 shipped in
				2022 (<a
					href="https://make.wordpress.org/core/2022/09/11/webp-in-core-for-6-1/"
					target="_blank"
					rel="noopener noreferrer">the Make WordPress thread</a
				>). Nothing in core has changed that since. This is the fact the plugin market rests on, and
				the fact that makes the plugin-free route work: if you upload the modern format, you get the
				modern format.
			</p>
			<p class="mb-4">
				<strong>It makes several copies at quality 82.</strong> A default install generates a
				thumbnail (150 pixels), medium (300), medium_large (768 wide), large (1,024), and, since
				5.3, two larger copies at 1,536 and 2,048 pixels for high-density screens. Any JPEG wider or
				taller than 2,560 pixels is also scaled down to 2,560 and saved with a <code>-scaled</code>
				suffix, and that scaled copy is what "Full Size" means in your posts; the file you uploaded is
				kept on disk untouched (<a
					href="https://make.wordpress.org/core/2019/10/09/introducing-handling-of-big-images-in-wordpress-5-3/"
					target="_blank"
					rel="noopener noreferrer">big image handling in 5.3</a
				>). Every JPEG copy is written at quality 82, WordPress's default since 4.5. That quality is
				reasonable; the encoder behind it is the limiting factor, as the benchmark below shows.
			</p>
			<p class="mb-4">
				<strong>Since 7.1 it does the resizing in your browser.</strong> WordPress 7.1 (August 2026)
				moved resizing, compression and sub-size generation to the browser on Chrome and Edge,
				falling back to the server on other browsers. The JPEGs it writes are about 15% smaller than
				the old server-side ones, HEIC photos from an iPhone are converted to JPEG before upload
				with the original kept alongside, and AVIF uploads work even on hosts whose server cannot
				decode AVIF (<a
					href="https://make.wordpress.org/core/2026/07/22/client-side-media-processing-in-wordpress-7-1/"
					target="_blank"
					rel="noopener noreferrer">client-side media processing dev note</a
				>). Format conversion still happens "only if <code>image_editor_output_format</code> says
				so", so 7.1 changed where the work happens, not what it produces. Our Quick Answer on
				<a href="/guides/can-wordpress-7-1-optimize-images-without-a-plugin"
					>what WordPress 7.1 optimizes natively without a plugin</a
				> covers the full list, including what it still decides for you.
			</p>
			<p class="mb-4">
				<strong>It never touches what is already in your library.</strong> No WordPress version re-encodes
				existing uploads. Whatever you change today applies to new uploads; the two-year-old hero on your
				home page stays exactly as it was until you replace it. That is also true of the first-party conversion
				plugin (section 10), which is why the manual route is usually the right one for a live site: the
				images PageSpeed names are the ones worth your time.
			</p>
		</section>

		<section id="which-file" class="scroll-mt-24">
			<SectionHeading>Which file your visitors actually get</SectionHeading>
			<p class="mb-4">
				Your visitors almost never download the file you uploaded. They get one of WordPress's
				copies, chosen by the Image block's Resolution setting and the browser's screen width, and
				the fix has to land on that copy.
			</p>
			<p class="mb-4">
				Open any post, click an image, and look at the block sidebar (the <strong>Settings</strong>
				button next to Save or Publish opens it if it is hidden). Under the Settings tab there is a
				<strong>Resolution</strong> choice, with "options that may include Full Size, Large, Medium
				and Thumbnail depending on what your theme supports and the size of the originally uploaded
				image" (<a
					href="https://wordpress.org/documentation/article/image-block/"
					target="_blank"
					rel="noopener noreferrer">Image block documentation</a
				>). Pick Large and the post embeds the 1,024-pixel copy; pick Full Size and it embeds the
				scaled 2,560-pixel one. WordPress then adds a <code>srcset</code> listing the smaller copies so
				a phone can take the 768 or 300 instead. Theme header images, sliders and page-builder backgrounds
				usually bypass all of this and load whatever file they were given, which is why they are so often
				the biggest row in the report.
			</p>
			<p class="mb-4">
				So when PSI lists <code>garden-1024x768.jpg</code>, it is telling you three things at once:
				the post uses the large copy, the copy is a JPEG because the upload was, and the copy is
				heavier than it needs to be. Replacing the upload with an AVIF or WebP of the right width
				replaces every copy below it, because WordPress makes the new copies in the new format.
				Replacing a theme image replaces one file. Either way, the filename in the report tells you
				which it is: a <code>-WIDTHxHEIGHT</code> suffix is a WordPress copy, <code>-scaled</code> is
				the 2,560 version, and a name with neither is the original file or a theme asset.
			</p>
		</section>

		<section id="benchmark" class="scroll-mt-24">
			<SectionHeading>One photo through WordPress: the numbers</SectionHeading>
			<p class="mb-4">
				We took one iPhone photo, made the copies a default WordPress install would make of it, and
				converted each copy before upload. The result is that WordPress's copies run at roughly
				double PageSpeed's yardstick, conversion removes a third to nearly half of the bytes, and a
				well-encoded JPEG did as well as AVIF on this photo. Here is the run in full, so you can
				judge it against your own images.
			</p>
			<p class="mb-4">
				The photo is a 2,576 by 1,932 pixel garden shot, 1.79 MB, full of leaves and twigs: the kind
				of detail that compresses worst, so these are conservative numbers. We produced the <code
					>-scaled</code
				>, 1536, large and medium_large copies as JPEG at quality 82, the WordPress default, then
				sent each copy to Mochify's API with no quality setting (automatic) and no resizing, once
				per output format. The "PSI gap" column is the file's distance from the insight's 0.167
				bytes-per-pixel target, which is the figure PageSpeed would show as estimated savings.
			</p>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr
							><th>WordPress copy</th><th>Pixels</th><th>WordPress JPEG q82</th><th>jpegli JPEG</th
							><th>WebP</th><th>AVIF</th><th>PSI gap (WordPress → AVIF)</th></tr
						></thead
					>
					<tbody>
						<tr
							><td><code>-scaled</code></td><td>2560 x 1920</td><td>1,591 KB</td><td
								>968 KB (-39%)</td
							><td>1,011 KB (-36%)</td><td>899 KB (-44%)</td><td>772 KB → 79 KB</td></tr
						>
						<tr
							><td><code>1536x1536</code></td><td>1536 x 1152</td><td>643 KB</td><td
								>388 KB (-40%)</td
							><td>432 KB (-33%)</td><td>383 KB (-41%)</td><td>348 KB → 88 KB</td></tr
						>
						<tr
							><td><code>large</code></td><td>1024 x 768</td><td>296 KB</td><td>177 KB (-40%)</td
							><td>205 KB (-31%)</td><td>178 KB (-40%)</td><td>165 KB → 47 KB</td></tr
						>
						<tr
							><td><code>medium_large</code></td><td>768 x 576</td><td>167 KB</td><td
								>101 KB (-40%)</td
							><td>115 KB (-31%)</td><td>101 KB (-39%)</td><td>93 KB → 28 KB</td></tr
						>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">Four things in that table are worth more than the percentages:</p>
			<ol class="mb-6 list-decimal space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>WordPress's copies sit at 0.32 to 0.38 bytes per pixel</strong>, about twice the
						0.167 PageSpeed treats as efficient. A default WordPress photo is flagged at every size,
						however carefully you set the quality, because the encoder behind it is a
						general-purpose libjpeg or ImageMagick at a fixed setting. WordPress 7.1's browser-side
						encoder closes some of that gap (about 15% by the project's own figure), not most of it.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The encoder mattered more than the format.</strong> Mochify's JPEG output uses
						Google's jpegli encoder, and on this photo it beat WebP at every size (177 KB against
						205 KB at 1,024 wide) and came within a kilobyte of AVIF. It is still a plain
						<code>.jpg</code> that every browser, crawler and email client has opened since the 1990s.
						If the compatibility questions in section 8 give you pause, this is the way out: a smaller
						JPEG is most of the win and none of the risk.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>A busy photo stays on the list at automatic quality.</strong> Every converted file
						in the table is still above 0.167 bytes per pixel, so PSI would still show the row, with the
						figure cut by 70 to 80%. Dropping the 1,024 AVIF to quality 45 took it to 96 KB, 68% below
						WordPress's copy and under the target, and in a side-by-side crop of the busiest foliage we
						could not tell the four versions apart. That is one photo, one region and our eyes, so treat
						it as a demonstration rather than a rule: lower the quality until you can see it, then step
						back one notch. On a product shot against a plain background the automatic encode is usually
						already under the target.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>Pixels did more than any format.</strong> The large copy is 5.4 times smaller
						than the <code>-scaled</code> one before anything is converted. If a 2,560-pixel file is being
						sent to a 700-pixel column, no format change competes with fixing that first.
					</p>
				</li>
			</ol>
			<p class="mb-4">
				The whole run is recorded in our research notes with the exact byte counts; the numbers
				above are for this photo, on this day, and your photos will differ in degree but not in
				shape.
			</p>
			<p class="mb-4">
				<a href="/flow">Try the same comparison on one of your own images in Mochify</a>: drop the
				file in, ask for "convert to AVIF" and then "convert to JPG", and compare the sizes against
				what is in your uploads folder.
			</p>
		</section>

		<section id="the-fix" class="scroll-mt-24">
			<SectionHeading>The plugin-free fix, step by step</SectionHeading>
			<p class="mb-4">
				The fix is five steps for each image PageSpeed names: find the file, decide its width,
				convert it, upload the new one in place of the old, and give the hero image its priority.
				Done for the handful of images on your most-visited pages, it removes most of the row and
				most of the LCP problem without touching your plugin stack.
			</p>
			<h3>Step 1: list the images PageSpeed names</h3>
			<p class="mb-4">
				Run <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer"
					>PageSpeed Insights</a
				>
				on the exact URL (the mobile tab first; that is the one Google weights). In the report's Insights
				section, open <strong>Improve image delivery</strong>. Each row is one image: its URL (with
				a small preview), the estimated saving in KiB and the message from the table in section 2.
				Copy the URLs. If the page passes, the insight is listed among the passed checks and you can
				stop; this guide is only needed for pages where it does not.
			</p>
			<p class="mb-4">
				Read the filenames before you do anything else. <code>hero-scaled.jpg</code> is the
				2,560-pixel copy of an upload, which means the page is embedding "Full Size".
				<code>garden-1024x768.jpg</code> is the large copy. <code>header-bg.png</code> with no suffix
				is a theme or page-builder asset, not a Media Library copy. A row that says "larger than it needs
				to be (2560 x 1920) for its displayed dimensions (720 x 540)" is a size problem first and a format
				problem second.
			</p>
			<h3>Step 2: decide the width each image needs</h3>
			<p class="mb-4">
				An image needs to be as wide as the widest space it fills, times two at most for
				high-density screens. A photo in a blog column that is 720 pixels wide needs a 1,440-pixel
				file at the outside and is well served by WordPress's 1,024 large copy. A full-width hero on
				a 1,920-pixel desktop needs about 1,920. Nothing on a normal page needs 2,560, and nothing
				needs the 4,032 pixels an iPhone shoots. For the hero specifically, our guide to <a
					href="/guides/optimizing-hero-images">hero image size and LCP</a
				> walks through the three sizes that matter and why "under 200 KB" is a quality decision rather
				than a format property.
			</p>
			<p class="mb-4">
				The simplest version: upload images at the largest width the page will show them, and let
				WordPress make the smaller copies. The full version, for a hero that must be fast on phones
				too, is a 1,920-wide file plus a separate 800-wide crop served through <code
					>&lt;picture&gt;</code
				>, which section 9 covers.
			</p>
			<h3>Step 3: convert the image before it goes into WordPress</h3>
			<p class="mb-4">
				Convert the original file, not the copy PageSpeed listed. The original is in your Media
				Library: open the image's attachment details and use its <strong>File URL</strong> (for a
				photo over 2,560 pixels that link points at the <code>-scaled</code> copy, and the untouched original
				has the same name without the suffix). Theme assets live in the theme's own folder or settings.
				Resize it to the width from step 2 and save it as AVIF or WebP, or as a jpegli-encoded JPEG if
				you want zero compatibility questions. Section 13 shows the Mochify prompts for this; any converter
				that lets you set a width and a format will do the job.
			</p>
			<p class="mb-4">
				Two rules while you are there. Strip the metadata unless you need it: a phone photo carries
				a few hundred kilobytes of thumbnail, GPS and camera data that no visitor sees, and
				WordPress keeps everything in the original file (our Quick Answer on <a
					href="/guides/does-stripping-exif-data-improve-wordpress-image-seo"
					>stripping EXIF data from WordPress uploads</a
				>
				covers what that does and does not do for SEO). And if the photo came from an iPhone as HEIC,
				convert it yourself rather than letting WordPress 7.1 turn it into a JPEG at upload;
				<a href="/guides/heic-to-jpeg-or-webp-wordpress">HEIC to JPEG or WebP for WordPress</a> explains
				which target to pick.
			</p>
			<h3>Step 4: upload the new file and point the page at it</h3>
			<p class="mb-4">
				WordPress does not overwrite the file you already uploaded; you add the new one and swap it
				in. In the block editor, click the Image block, click <strong>Replace</strong> in its
				toolbar, choose <strong>Upload</strong>, pick the converted file, and set the block's
				<strong>Resolution</strong> to Large (or Full Size if the column really is that wide). For a featured
				image, remove it in the post sidebar and set the new upload. For a theme header or background,
				use the theme's own control (the Customizer, the Site Editor or the page-builder's image field)
				and give it the new file. The old file stays in your uploads folder, which costs you nothing;
				delete it from the Media Library later if you like.
			</p>
			<p class="mb-4">
				If your host's server cannot encode AVIF (section 4), an AVIF upload may arrive without its
				smaller copies, or be refused outright. On WordPress 7.1 in Chrome or Edge the upload goes
				through regardless, because the browser does the work; on older versions or other browsers,
				use WebP for the upload or ask your host to enable AVIF in ImageMagick. Site Health tells
				you which case you are in before you try.
			</p>
			<h3>Step 5: give the LCP image its priority</h3>
			<p class="mb-4">
				Converting the hero makes it small; telling the browser to fetch it first makes it early.
				Since 6.3, WordPress adds <code>fetchpriority="high"</code> to the image it judges most
				likely to be the largest in the first screen and keeps <code>loading="lazy"</code> off the
				first images it outputs (<a
					href="https://make.wordpress.org/core/2023/07/13/image-performance-enhancements-in-wordpress-6-3/"
					target="_blank"
					rel="noopener noreferrer">image performance in WordPress 6.3</a
				>). Check that your hero got the first and not the second (section 11 shows how to look),
				and if a theme or builder has lazy-loaded the hero, fix that before anything else. Our
				explainer on
				<a href="/guides/fetchpriority-vs-preload-lcp-image"
					>fetchpriority versus preload for the LCP image</a
				>
				covers the choice, and
				<a href="/guides/preload-avif-hero-images-wordpress-lcp"
					>preloading an AVIF hero in WordPress</a
				> covers the preload tag for the hero you have just converted.
			</p>
			<p class="mb-4">
				That is the whole fix for the pages that matter. For a site with thousands of images and a
				theme that pulls from the uploads folder directly, the same idea scales as a command: our
				guide to <a href="/guides/convert-website-images-to-webp-and-avif"
					>converting a site's images to WebP and AVIF in one command</a
				> does the batch and keeps new files converted.
			</p>
		</section>

		<section id="which-format" class="scroll-mt-24">
			<SectionHeading>AVIF, WebP or a better JPEG for WordPress?</SectionHeading>
			<p class="mb-4">
				For an image you upload straight into the Image block, choose WebP or a well-encoded JPEG;
				reserve AVIF for the hero and other large photos where its extra savings are worth a
				fallback. The reasoning is about who cannot open what, and in 2026 the gap is small but not
				zero.
			</p>
			<p class="mb-4">
				In caniuse's September 2026 data, 97.18% of global users have a browser that opens WebP and
				96.35% one that opens AVIF (<a
					href="https://caniuse.com/webp"
					target="_blank"
					rel="noopener noreferrer">caniuse WebP</a
				>,
				<a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer">caniuse AVIF</a
				>). AVIF arrived in Safari with iOS 16, so the 3 or 4 visitors in 100 who cannot open it are
				typically on phones that stopped updating around 2022, on televisions and in locked-down
				office browsers (an illustration of the kind of browser, not a measured breakdown). If you
				upload an AVIF and put it in the Image block, those visitors see a broken image. If you
				upload a WebP, a slightly smaller group sees a broken image. If you upload a JPEG, nobody
				does.
			</p>
			<p class="mb-4">That gives three honest positions:</p>
			<GuideTable class="my-6">
				<table>
					<thead
						><tr
							><th>You want</th><th>Upload</th><th>Compatibility</th><th>What PageSpeed does</th
							></tr
						></thead
					>
					<tbody>
						<tr>
							<td>The row gone, and you have a hero worth the effort</td>
							<td>AVIF, with a JPEG fallback via <code>&lt;picture&gt;</code> (section 9)</td>
							<td>Everyone, through the fallback</td>
							<td>Clears if the quality is low enough; otherwise shrinks</td>
						</tr>
						<tr>
							<td>The simplest safe upload</td>
							<td>WebP</td>
							<td>97% directly; the rest see nothing</td>
							<td>Shrinks, sometimes clears</td>
						</tr>
						<tr>
							<td>No compatibility questions at all</td>
							<td>jpegli JPEG at the right width</td>
							<td>Everyone</td>
							<td>Shrinks by about 40% on photos; the row usually stays, smaller</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>
			<p class="mb-4">
				The jpegli row surprises people. The format comparison most guides reprint, WebP 25-34%
				smaller than JPEG and AVIF up to 50% smaller, is measured against a 1990s JPEG encoder;
				against a modern one the gap closes, and on our garden photo it closed completely. For the
				full picture of what each format does well, including transparency and the newly arrived
				JPEG XL, see our <a href="/guides/2026-guide-next-gen-formats"
					>WebP vs AVIF vs JPEG XL comparison</a
				>.
			</p>
		</section>

		<section id="picture-route" class="scroll-mt-24">
			<SectionHeading
				>The <code>&lt;picture&gt;</code> route in the block editor, and when you do not need it</SectionHeading
			>
			<p class="mb-4">
				You need <code>&lt;picture&gt;</code> only when you want AVIF on a page that must still work for
				the last 4% of browsers, and in WordPress you get it either from the first-party plugin or from
				a Custom HTML block. For most images you do not need it at all: a WebP or a good JPEG in the ordinary
				Image block is the right amount of engineering.
			</p>
			<p class="mb-4">
				When you do want it, this is the smallest markup that works, pasted into a <strong
					>Custom HTML</strong
				> block in place of the Image block:
			</p>
			<CodeCard filename="picture-block.html" code={pictureCode} />
			<p class="mb-4">
				The browser takes the AVIF if it can open it and the JPEG if it cannot; it downloads one of
				the two, never both. Upload both files to the Media Library first and copy their URLs from
				the attachment details. The <code>width</code> and <code>height</code> stop the layout
				jumping, and <code>fetchpriority="high"</code> belongs only on the one image in the first
				screen. The trade is that a Custom HTML block has no Resolution setting and no automatic
				<code>srcset</code>, so the responsive sizing WordPress normally does for you is now yours
				to write; our guide to <a href="/guides/html-picture-tag">the HTML picture tag</a> covers
				the full snippet with multiple widths, art direction and the four rules that make it render.
				If the image is a CSS background in your theme rather than an <code>&lt;img&gt;</code>,
				<code>&lt;picture&gt;</code> cannot reach it;
				<a href="/guides/css-background-image-webp-fallback"
					>WebP fallbacks for CSS background images</a
				> is the route for those.
			</p>
			<p class="mb-4">
				A broken case and its fix, because it is the one people hit: you paste the block, the page
				shows the JPEG everywhere, and PSI still lists it. Open the page source (right-click, <strong
					>View Page Source</strong
				>, search for <code>&lt;picture</code>) and check the <code>type</code> attribute reads
				exactly
				<code>image/avif</code> and the AVIF URL returns a file when you open it in a new tab. A mistyped
				type or a 404 on the AVIF silently falls through to the JPEG, which is the fallback doing its
				job.
			</p>
		</section>

		<section id="first-party-plugin" class="scroll-mt-24">
			<SectionHeading>If you would rather WordPress did it: the first-party plugin</SectionHeading>
			<p class="mb-4">
				If you want every new upload converted automatically, the plugin to install is WordPress's
				own
				<strong>Modern Image Formats</strong>, published by the WordPress Performance Team. It adds
				WebP and AVIF output for media uploads inside WordPress, generates AVIF when your host
				supports it and WebP otherwise, lets you choose between the two under
				<strong>Settings → Media</strong>, and has an option to output fallback images in the
				original format alongside the modern ones (<a
					href="https://wordpress.org/plugins/webp-uploads/"
					target="_blank"
					rel="noopener noreferrer">Modern Image Formats on wordpress.org</a
				>). At the time of writing it is at version 2.7.1 with over 100,000 active installations and
				is tested up to WordPress 7.1.3.
			</p>
			<p class="mb-4">
				Two things to know before you reach for it. It converts <strong>new uploads only</strong>;
				everything already in your library stays as it is unless you regenerate the sub-sizes with a
				tool like WP-CLI's <code>wp media regenerate</code> or a regenerate-thumbnails plugin, which on
				a large site is a long job with real disk-space consequences. And it converts at the server's
				or browser's quality setting, with a general-purpose encoder, so you get a WebP or AVIF version
				of the 0.3-bytes-per-pixel copies rather than a file you chose. It is a good, free, first-party
				answer to "make it automatic". It is not a reason to skip the manual fix on the pages that matter,
				because those images are already uploaded.
			</p>
			<p class="mb-4">
				The commercial plugins the AI Overview recommends do the same conversion plus bulk
				re-encoding of the existing library, usually through a paid service with a monthly quota.
				The support threads ranking for this warning are a fair preview of the failure modes: images
				"not being converted" with no explanation, converted copies that exist in the database but
				not on disk after a staging-to-production move, and a bulk run that stops at "Your monthly
				limit has been exceeded" and leaves half the library done. None of that is an argument
				against plugins in general. It is an argument for knowing which images actually matter,
				fixing those by hand, and only automating what you can verify.
			</p>
		</section>

		<section id="verify" class="scroll-mt-24">
			<SectionHeading>Check it worked, click by click</SectionHeading>
			<p class="mb-4">
				Verification is three checks: the browser is receiving the new file, PageSpeed agrees, and
				WordPress can keep doing it for the next upload. Do all three; the forum threads are full of
				people who did one.
			</p>
			<p class="mb-4">
				<strong>The browser.</strong> Open the page in Chrome. Right-click anywhere, choose
				<strong>Inspect</strong>, click the <strong>Network</strong> tab, click the
				<strong>Img</strong> filter button, then reload the page. Each image appears as a row; the
				<strong>Type</strong> column reads <code>avif</code>, <code>webp</code> or
				<code>jpeg</code>, and the <strong>Size</strong> column is what was actually transferred.
				Right-click any column header, tick <strong>Priority</strong> to show that column, and check
				the hero's row reads High and that it loaded in the first few rows, not after a scroll. If
				the Type still says
				<code>jpeg</code> for an image you converted, the page is pointing at the old file: go back to
				step 4.
			</p>
			<p class="mb-4">
				<strong>PageSpeed.</strong> Re-run the same URL on pagespeed.web.dev. PSI tests a fresh
				load, so there is no cache to clear on your side, but if your host or a caching plugin
				serves a stored copy of the page, purge it first or the test sees the old HTML. Open
				<strong>Improve image delivery</strong> again. The images you fixed should be gone from the list
				or carry a much smaller figure (for the reason in section 3). Check the LCP figure in the field
				data at the top of the report over the following weeks rather than the lab figure on the day;
				that is the one that comes from real visitors.
			</p>
			<p class="mb-4">
				<strong>WordPress.</strong> Under
				<strong>Tools → Site Health → Info → Media Handling</strong>, confirm the image library and
				the formats it supports, so you know whether the next AVIF upload will get its sub-sizes.
				Then upload one more converted image into a draft post and check its sub-sizes exist in the
				Media Library's attachment details. If they do, your workflow is now the default for every
				future upload, which is the point.
			</p>
		</section>

		<section id="troubleshooting" class="scroll-mt-24">
			<SectionHeading>When the warning will not go away</SectionHeading>
			<p class="mb-4">
				When the row persists after a conversion, the page is almost always still pointing at the
				old file, the file is bigger in pixels than its slot, or the image never went through the
				Media Library at all. Work down this list before changing anything else:
			</p>
			<ul class="mb-6 list-disc space-y-3 pl-6">
				<li>
					<p class="mb-0">
						<strong>The URL in PSI is not the file you uploaded.</strong> Compare the filename in
						the row with the one in your Media Library. A <code>-scaled</code> or
						<code>-1024x768</code>
						suffix on a <code>.jpg</code> after you uploaded an <code>.avif</code> means the block is
						still embedding the old attachment. Replace it (step 4).
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The row says "larger than it needs to be".</strong> That is pixels, not format. Resize
						to the displayed width times two at most and re-upload. Converting a 2,560-pixel file to AVIF
						and serving it in a 700-pixel column will still be flagged.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The image is not a Media Library image.</strong> Theme headers, sliders, page-builder
						backgrounds, logos baked into the theme and images injected by other plugins are files on
						disk that WordPress never processed. Find them in the theme or plugin settings and replace
						the file itself.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>A cache is serving the old page.</strong> Purge your caching plugin and your CDN after
						a replacement, then re-test. The page can be fixed while the test is still reading yesterday's
						HTML.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The image is a lazy-loaded hero.</strong> A hero with
						<code>loading="lazy"</code> is late regardless of format and shows up as an LCP problem rather
						than an image row. Remove the lazy loading from the first-screen image; most themes allow
						it per image or per block.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The file is a GIF.</strong> Replace an animated GIF over 100 KiB with a short
						MP4 or WebM, or with a still image if the animation was decorative. Our
						<a href="/guides/mp4-to-webm-web-video-guide">MP4 to WebM guide</a> covers the video side.
					</p>
				</li>
				<li>
					<p class="mb-0">
						<strong>The row is now small and you want it gone.</strong> Lower the quality until you can
						see a difference in the areas you care about, then step back once. On a detailed photo that
						may mean an AVIF around quality 45 to 50; on a product shot the automatic setting is usually
						enough. Or accept a small row: the page is already fast, and the figure is a yardstick, not
						a verdict.
					</p>
				</li>
			</ul>
		</section>

		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading>Mochify Workflow: converting WordPress images before upload</SectionHeading>
			<p class="mb-4">
				Mochify is built for the "give WordPress a finished image" route: you describe what you want
				in plain English, it converts, resizes and compresses in one pass, and you upload the result
				like any other file. Here is the workflow for the five steps above, on each of the surfaces
				that fit a WordPress job.
			</p>
			<GlassPanel>
				<ol class="workflow-steps">
					<li>
						<h3>Gather the flagged images.</h3>
						<p>
							Drop the images PageSpeed named into <a href="/flow">Mochify</a> (the originals from your
							Media Library, or the theme files). Up to 3 at a time without an account or on a free account,
							25 at a time on a paid plan; a free account gets 25 images a month, and 3 a month with no
							account at all.
						</p>
					</li>
					<li>
						<h3>Say what you need.</h3>
						<p>
							Magic Flow is a prompt, not a settings panel: <em
								>"Convert to AVIF and resize to 1024 pixels wide"</em
							>
							for a blog-column photo; <em>"Convert to WebP, 1920 pixels wide"</em> for a hero;
							<em>"Convert to JPG"</em> if you want the jpegli JPEG from the benchmark with no
							compatibility questions; <em>"Compress to under 150 KB"</em> when the size is the constraint,
							in which case Mochify lowers the quality and, if it has to, the dimensions, and tells you
							the final size and pixels. A language model reads the sentence and the C++ engine does the
							work; there is no slider to get wrong.
						</p>
					</li>
					<li>
						<h3>Metadata is stripped by default.</h3>
						<p>
							GPS, camera and thumbnail data come out unless you turn the Strip EXIF switch off, so
							the file you upload is only the picture.
						</p>
					</li>
					<li>
						<h3>Download and upload.</h3>
						<p>
							Put the result into WordPress (step 4 above). Make the AVIF and the JPEG in two
							prompts if you are building a <code>&lt;picture&gt;</code> block.
						</p>
					</li>
					<li>
						<h3>Images already on the live page.</h3>
						<p>
							The <a href="/chrome-extension">Mochify Chrome extension</a> skips the download step:
							right-click the image on your own site, choose <strong>Convert to</strong> and a
							format, and the converted file saves to your Downloads folder with nothing resized and
							no prompt to write; choose
							<strong>Send to Mochify</strong> instead if you want to describe a resize as well. One image
							at a time, which is the shape of this job.
						</p>
					</li>
					<li>
						<h3>Developers and large libraries.</h3>
						<p>
							The same engine is one request away: <code
								>curl -X POST "https://api.mochify.app/v1/squish?type=avif&amp;width=1024" -H
								"Authorization: Bearer mchy_your_key" -H "Content-Type: image/jpeg" --data-binary
								@garden.jpg -o garden.avif</code
							>
							(the <a href="/docs">API docs</a> list every parameter), and the CLI route in our
							<a href="/guides/convert-website-images-to-webp-and-avif"
								>whole-site conversion guide</a
							> walks a folder and keeps new files converted.
						</p>
					</li>
				</ol>
			</GlassPanel>
			<p class="mt-6 mb-4 text-base leading-relaxed text-[#875F42]">
				<strong>Privacy, for client sites and product photos:</strong> images sent to Mochify travel
				to
				<code>api.mochify.app</code>, are encoded in memory, and are wiped as soon as the result is
				returned; nothing is written to disk, no log holds file data, and nothing is used to train
				AI. That is true of the web app, the extension, the CLI and the API alike. (It is the video
				tools that never leave your browser at all; images and PDFs make the round trip.) A one-off
				library clean-up that outgrows the free allowance fits a $2 Day Pass: 100 uploads within 24
				hours, 25 at a time, files up to 75 MB, no account needed.
			</p>
		</section>

		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat Sheet</SectionHeading>
			<GuideTable class="my-6">
				<table>
					<thead><tr><th>Topic</th><th>The short version</th></tr></thead>
					<tbody>
						<tr>
							<td>The warning</td>
							<td
								>"Improve image delivery" (PSI/Lighthouse 13, since October 2025) = the old "Serve
								images in next-gen formats" + "Efficiently encode images" + "Properly size images" +
								"Use video for animated content"</td
							>
						</tr>
						<tr>
							<td>How it scores</td>
							<td
								>File bytes minus 0.167 bytes per pixel of the file's own dimensions; rows under 4
								KiB hidden; 12 KiB of size waste forgiven when <code>srcset</code> or
								<code>&lt;picture&gt;</code> is present; GIFs over 100 KiB flagged for video</td
							>
						</tr>
						<tr>
							<td>What WordPress does</td>
							<td
								>Accepts WebP (5.8) and AVIF (6.5, host permitting); keeps the upload's format;
								makes quality-82 copies at 150 / 300 / 768 / 1,024 / 1,536 / 2,048 and <code
									>-scaled</code
								> at 2,560; since 7.1 resizes in the browser on Chrome/Edge; never re-encodes existing
								uploads</td
							>
						</tr>
						<tr>
							<td>Which copy is served</td>
							<td
								>The Image block's Resolution (Large = 1,024) plus <code>srcset</code>;
								theme/builder images bypass it</td
							>
						</tr>
						<tr>
							<td>Step order</td>
							<td>Pixels → encoder → format. Size to the displayed width (x2 max), then convert</td>
						</tr>
						<tr>
							<td>Format choice</td>
							<td
								>Image block: WebP or jpegli JPEG. Hero: AVIF + JPEG fallback via <code
									>&lt;picture&gt;</code
								> in a Custom HTML block. 97.18% / 96.35% support (WebP / AVIF, Sept 2026)</td
							>
						</tr>
						<tr>
							<td>Our numbers</td>
							<td
								>WordPress copies 0.32-0.38 B/px; conversion -31% to -44%; jpegli JPEG = AVIF on a
								busy photo; 1,024 copy 296 KB → 177 KB (JPG) → 96 KB (AVIF q45)</td
							>
						</tr>
						<tr>
							<td>Verify</td>
							<td
								>DevTools → Network → Img → Type column; re-run PSI after purging caches; Site
								Health → Media Handling</td
							>
						</tr>
						<tr>
							<td>Automatic instead</td>
							<td
								>WordPress's own Modern Image Formats plugin (new uploads only, Settings → Media)</td
							>
						</tr>
						<tr>
							<td>Mochify prompt</td>
							<td
								>"Convert to AVIF and resize to 1024 pixels wide" at mochify.app/flow; 3 per batch
								free, 25 paid; EXIF stripped by default; in-memory, zero retention</td
							>
						</tr>
					</tbody>
				</table>
			</GuideTable>
		</section>

		<GlassFAQs items={faqItems} />

		<GlassCTA href="/flow" label="Try Magic Flow">
			Convert your first flagged image now at <a href="/flow">mochify.app/flow</a>: twenty-five
			images a month are free with an account, three a month without one. Try it with the prompt
			<em>"convert to AVIF and resize to 1024 pixels wide"</em>.
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

	/* Workflow steps: the handoff authors each step title as an <h3>, so this
	   is a plain list rather than StepList (whose titles are <p>). */
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

	/* The curl one-liner in step 6 is long and unbroken; let it wrap. */
	.workflow-steps code {
		overflow-wrap: anywhere;
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
