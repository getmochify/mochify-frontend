<script>
	import ReadProgress from '$lib/components/ReadProgress.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
	import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
	import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
	import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
	import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
	import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
	import StepList from '$lib/components/guide-demo/StepList.svelte';
	import CodeCard from '$lib/components/guide-demo/CodeCard.svelte';
	import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

	// First long-form guide published on the guide-demo component set rather
	// than the older SectionHeading/InfoBox pair. /guides/style-demo stays as
	// the noindex reference copy.

	const metadata = {
		title: 'Do WebP and AVIF Support Transparency?',
		description:
			'Yes, both carry a full alpha channel. Why a transparent cut-out comes back black or white, the five causes, and how to check a file before blaming the format.',
		category: 'Image Formats',
		readTime: '14 min read',
		date: 'September 21, 2026'
	};

	const toc = [
		{ id: 'how-alpha-is-stored', label: 'How WebP and AVIF store transparency' },
		{ id: 'where-it-works', label: 'Where transparent WebP and AVIF display correctly in 2026' },
		{ id: 'five-causes', label: 'Why your cut-out came back black or white: five causes' },
		{
			id: 'check-the-file',
			label: 'Check the file first: does it actually have an alpha channel?'
		},
		{ id: 'fixes', label: 'The fix for each cause' },
		{ id: 'which-format', label: 'PNG, WebP or AVIF for a cut-out?' },
		{
			id: 'mochify-workflow',
			label: 'Mochify Workflow: remove a background to transparent WebP or AVIF'
		},
		{ id: 'cheat-sheet', label: 'Cheat Sheet: symptom, cause, fix' },
		{ id: 'faq', label: 'FAQ' }
	];

	const visualCheck = `<body style="background:#e91e63"><img src="cutout.webp"></body>`;

	const identifyCmd = `identify -format '%[opaque]' cutout.avif`;

	const workflowSteps = [
		{
			title: 'Magic Flow, for anything with a twist.',
			html: '<p>Open <a href="/flow">mochify.app/flow</a>, drop your images, and describe the result. "Remove the background, transparent PNG" is one of the page\'s own example prompts; "remove the background and place it on white" gives you the flattened version a marketplace wants, so you can produce both from the same upload. There are no format pickers or quality sliders to set.</p>'
		},
		{
			title: 'The fixed-purpose pages, for a plain cut-out.',
			html: '<p><a href="/solutions/remove-background-webp">Remove Background to WebP</a> and <a href="/solutions/remove-background-avif">Remove Background to AVIF</a> do one job each: drop a JPG, PNG, WebP, AVIF, HEIC, HEIF or HIF file and download the cut-out with a full alpha channel. Without an account you can process 3 files per batch at up to 20MB each, 3 images a month; a free account raises that to 25 a month, and paid plans raise the file size to 75MB and batches to 25.</p>'
		},
		{
			title: 'The API and MCP, for batches and automation.',
			html: '<p>Background removal is available through the REST API and both MCP surfaces on every tier, so an agent or a script can run the same cut-out over a folder. The API strips EXIF by default (GPS included) unless you pass <code>stripExif=false</code>; the two solution pages have no settings at all.</p>'
		}
	];

	const faqItems = [
		{
			q: 'Does WebP support transparency?',
			a: 'Yes. Lossless WebP stores a full 8-bit alpha channel with every pixel, and lossy WebP adds a separate alpha plane in an ALPH chunk, so both kinds can hold soft, partial transparency. Every current browser renders it; the only common failures are apps with old decoders and platforms that convert uploads to JPEG.'
		},
		{
			q: 'Does AVIF support transparency?',
			a: 'Yes. AVIF stores transparency as a second, monochrome AV1 image inside the file at the same bit depth as the color image, and it can compress that alpha plane lossily, which is one reason AVIF cut-outs are often smaller than WebP ones. Static AVIF with alpha displays correctly in Chrome, Firefox, Edge and Safari 16.4 or later.'
		},
		{
			q: 'Why does my transparent PNG turn black when I convert it to AVIF?',
			a: "Usually because the converter is built on an old ImageMagick 6 or a library without alpha support, both of which write the color image and drop the alpha item. Convert with a current libavif or ImageMagick 7 build, then run identify -format '%[opaque]' on the output; False confirms the transparency survived."
		},
		{
			q: 'Why does my cut-out show a black background on Etsy?',
			a: 'Because Etsy stores listing images as JPEG and states in its help center that "the transparent parts of the image will appear black on Etsy". No file format changes that. Composite the cut-out onto the background you want before uploading; Magic Flow\'s "remove the background and place it on white" does it in one prompt.'
		},
		{
			q: 'How do I check whether an image file actually has an alpha channel?',
			a: "Open it on a brightly colored web page and see whether the color shows through, or run ImageMagick's identify -format '%[opaque]' file and read False (has transparent pixels) or True (fully opaque). For WebP, ExifTool's WebP_Flags tag also reports the alpha bit."
		},
		{
			q: 'Does removing the background on Mochify cost extra or need a paid plan?',
			a: 'No. Background removal is on every plan including Free, and it works without an account within the same allowance as any other conversion: 3 images a month with no signup, 25 a month with a free account, at up to 20MB and 3 files per batch. Paid plans raise the allowance, the file size (75MB) and the batch size (25).'
		},
		{
			q: 'Should I use PNG, WebP or AVIF for a transparent logo?',
			a: 'Keep a PNG master, publish WebP by default, and serve AVIF where your site or CDN can fall back to WebP for the rest. Google puts lossless WebP at 26% smaller than PNG, AVIF is usually smaller still on soft-edged cut-outs, and PNG is the one to send wherever the destination will flatten the file anyway.'
		}
	];

	const related = [
		{
			title: 'Should My Product Images Be AVIF or WebP in 2026?',
			href: '/guides/should-my-product-images-be-avif-or-webp-in-2026',
			desc: 'the size-versus-compatibility call for e-commerce, transparency included.'
		},
		{
			title: 'What Is an AVIF File? (And How to Open One)',
			href: '/guides/what-is-an-avif-file',
			desc: 'opening and converting AVIF on machines and apps that do not read it yet.'
		},
		{
			title: 'Product Image Requirements for Every Major Marketplace',
			href: '/guides/product-image-requirements-marketplace-guide',
			desc: 'which platforms want a white background, at what size, in which format.'
		},
		{
			title: 'Do Marketplace Product Images Need to Be Square?',
			href: '/guides/do-marketplace-product-images-need-to-be-square',
			desc: 'the cropping half of preparing a cut-out for listings.'
		},
		{
			title: 'The 2026 Guide to Next-Gen Formats: WebP, AVIF, JPEG XL',
			href: '/guides/2026-guide-next-gen-formats',
			desc: 'where each format stands on support, size and features.'
		}
	];
</script>

<ReadProgress />

<svelte:head>
	<title>Do WebP and AVIF Support Transparency? | Mochify</title>
	<meta name="description" content={metadata.description} />
	<meta
		name="robots"
		content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
	/>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:url" content="https://mochify.app/guides/webp-avif-transparency" />
	<meta property="og:site_name" content="Mochify" />
	<meta property="og:locale" content="en" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": "Do WebP and AVIF Support Transparency? Why Cut-Outs Come Back Black or White (and How to Fix It)",
			"description": "Yes, both carry a full alpha channel. Why a transparent cut-out comes back black or white, the five causes, and how to check a file before blaming the format.",
			"url": "https://mochify.app/guides/webp-avif-transparency",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "https://mochify.app/guides/webp-avif-transparency"
			},
			"datePublished": "2026-09-21",
			"dateModified": "2026-09-21",
			"inLanguage": "en",
			"author": {
				"@type": "Organization",
				"name": "Mochify Engineering Team",
				"url": "https://mochify.app"
			},
			"publisher": {
				"@type": "Organization",
				"name": "Mochify",
				"url": "https://mochify.app",
				"logo": {
					"@type": "ImageObject",
					"url": "https://mochify.app/logo.png"
				}
			},
			"isPartOf": {
				"@type": "CollectionPage",
				"name": "Image Optimization Guides",
				"url": "https://mochify.app/guides"
			},
			"about": [
				{ "@type": "Thing", "name": "WebP" },
				{ "@type": "Thing", "name": "AVIF" },
				{ "@type": "Thing", "name": "Alpha channel" },
				{ "@type": "Thing", "name": "Transparency" }
			]
		}
	</script>

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "FAQPage",
			"mainEntity": [
				{
					"@type": "Question",
					"name": "Does WebP support transparency?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Yes. Lossless WebP stores a full 8-bit alpha channel with every pixel, and lossy WebP adds a separate alpha plane in an ALPH chunk, so both kinds can hold soft, partial transparency. Every current browser renders it; the only common failures are apps with old decoders and platforms that convert uploads to JPEG."
					}
				},
				{
					"@type": "Question",
					"name": "Does AVIF support transparency?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Yes. AVIF stores transparency as a second, monochrome AV1 image inside the file at the same bit depth as the color image, and it can compress that alpha plane lossily, which is one reason AVIF cut-outs are often smaller than WebP ones. Static AVIF with alpha displays correctly in Chrome, Firefox, Edge and Safari 16.4 or later."
					}
				},
				{
					"@type": "Question",
					"name": "Why does my transparent PNG turn black when I convert it to AVIF?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Usually because the converter is built on an old ImageMagick 6 or a library without alpha support, both of which write the color image and drop the alpha item. Convert with a current libavif or ImageMagick 7 build, then check the output reports transparent pixels."
					}
				},
				{
					"@type": "Question",
					"name": "Why does my cut-out show a black background on Etsy?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Because Etsy stores listing images as JPEG and states in its help center that the transparent parts of the image will appear black on Etsy. No file format changes that. Composite the cut-out onto the background you want before uploading."
					}
				},
				{
					"@type": "Question",
					"name": "How do I check whether an image file actually has an alpha channel?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Open it on a brightly colored web page and see whether the color shows through, or run ImageMagick's identify command and read False (has transparent pixels) or True (fully opaque). For WebP, ExifTool's WebP_Flags tag also reports the alpha bit."
					}
				},
				{
					"@type": "Question",
					"name": "Does removing the background on Mochify cost extra or need a paid plan?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "No. Background removal is on every plan including Free, and it works without an account within the same allowance as any other conversion: 3 images a month with no signup, 25 a month with a free account, at up to 20MB and 3 files per batch. Paid plans raise the allowance, the file size (75MB) and the batch size (25)."
					}
				},
				{
					"@type": "Question",
					"name": "Should I use PNG, WebP or AVIF for a transparent logo?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Keep a PNG master, publish WebP by default, and serve AVIF where your site or CDN can fall back to WebP for the rest. Google puts lossless WebP at 26% smaller than PNG, AVIF is usually smaller still on soft-edged cut-outs, and PNG is the one to send wherever the destination will flatten the file anyway."
					}
				}
			]
		}
	</script>
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
			Do WebP and AVIF Support Transparency? Why Cut-Outs Come Back Black or White (and How to Fix
			It)
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.date} · Mochify Engineering Team
		</p>

		<p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
			Yes. WebP and AVIF both carry a full alpha channel, so a cut-out product shot, logo or sticker
			can stay transparent in either format, usually at a fraction of the PNG's size. When a
			transparent WebP or AVIF comes back with a black or white background, the format is almost
			never the reason. Something in the chain flattened it: the site you uploaded to re-encoded the
			file as a JPEG, the app that opened it could not read the alpha channel, or the export you ran
			never wrote one in the first place. This guide explains how the two formats store
			transparency, where it displays correctly in 2026, the five ways it gets lost, and how to
			check a file before you blame the format.
		</p>
	</header>

	<div class="space-y-12">
		<section>
			<GuideTOC items={toc} />
		</section>

		<!-- 01 -->
		<section id="how-alpha-is-stored" class="scroll-mt-24">
			<SectionHeading>How WebP and AVIF store transparency</SectionHeading>
			<p class="mb-4">
				Both formats store transparency as a real per-pixel alpha channel, not the single "this one
				color is invisible" trick that GIF and paletted PNG use, so soft edges, drop shadows and
				semi-transparent glass all survive. The details differ, and one of them explains why AVIF
				cut-outs are often smaller.
			</p>
			<p class="mb-4">
				<strong>WebP</strong> has two internal codings. Lossless WebP (VP8L) stores every pixel as a
				32-bit ARGB value, alpha included, and Google's
				<a
					href="https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification"
					target="_blank"
					rel="noopener noreferrer">lossless bitstream specification</a
				>
				states that it "stores and restores the pixel values exactly, including the color values for
				fully transparent pixels". Lossy WebP (VP8) has no alpha of its own, so the
				<a
					href="https://developers.google.com/speed/webp/docs/riff_container"
					target="_blank"
					rel="noopener noreferrer">container specification</a
				>
				adds a separate <code>ALPH</code> chunk holding an 8-bit alpha plane, with an alpha flag in
				the extended <code>VP8X</code> header. That alpha plane is stored raw or compressed with the lossless
				coder: a lossy WebP therefore has lossy color and near-lossless transparency, which is why a WebP
				with a large soft shadow can be surprisingly big.
			</p>
			<p class="mb-4">
				<strong>AVIF</strong> stores alpha as a second, monochrome AV1 image inside the same file,
				marked as an auxiliary alpha item; the
				<a
					href="https://aomediacodec.github.io/av1-avif/v1.2.0.html"
					target="_blank"
					rel="noopener noreferrer">AVIF specification</a
				>
				requires it to be encoded at the same bit depth as the color image, so an 8-, 10- or 12-bit
				AVIF gets an 8-, 10- or 12-bit alpha channel. Because the alpha plane is just another AV1
				picture, it can be compressed lossily, which WebP cannot do. Jake Archibald's
				<a
					href="https://jakearchibald.com/2020/avif-has-landed/"
					target="_blank"
					rel="noopener noreferrer">"AVIF has landed"</a
				> singles this out as part of AVIF's advantage on images with complex transparency. The specification
				also defines a flag for premultiplied alpha, and mishandling that flag is behind some of the darkened-edge
				bugs later in this guide.
			</p>
			<p class="mb-4">
				<strong>PNG</strong>, for comparison, has two transparency mechanisms: a full alpha channel
				in RGBA images, and a <code>tRNS</code> chunk that marks one color or a palette entry as
				transparent. A "transparent PNG" that was saved as an indexed image with <code>tRNS</code>
				has hard, binary edges; the RGBA kind has soft ones.
				<strong>JPEG has no alpha channel at all</strong>, which is the single most common reason a
				transparent image turns opaque: the moment anything in the chain saves it as a JPEG, the
				background has to become a color, and that color is usually white or black.
			</p>
		</section>

		<!-- 02 -->
		<section id="where-it-works" class="scroll-mt-24">
			<SectionHeading>Where transparent WebP and AVIF display correctly in 2026</SectionHeading>
			<p class="mb-4">
				In every current browser, and in most current apps, both formats show their transparency as
				intended. Where the alpha channel goes missing, it is nearly always an old decoder, a
				thumbnail renderer or a platform that converts uploads.
			</p>
			<p class="mb-4">
				<strong>Browsers.</strong> Per
				<a href="https://caniuse.com/webp" target="_blank" rel="noopener noreferrer">caniuse.com</a
				>, WebP is supported by 96.82% of browsers in use as of August 2026; Firefox added it in
				version 65 (January 2019) and Safari needs version 14 on macOS Big Sur or later.
				<a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer"
					>AVIF sits at 95.36%</a
				>: Chrome 85, Firefox 93 (animated AVIF from Firefox 113), Edge 121, and full support in
				Safari 16.4, with 16.1 to 16.3 marked partial. Static WebP and AVIF with alpha render
				correctly in all of them. The known exceptions are animation-specific:
				<a
					href="https://bugs.webkit.org/show_bug.cgi?id=275906"
					target="_blank"
					rel="noopener noreferrer">WebKit bug 275906</a
				>, filed in June 2024 and duplicated again in January 2026, reports animated AVIF with
				transparency playing back with incorrect transparency in Safari, and an Apple Developer
				Forums thread reproduces the same animated file rendering with a black background in Safari
				16.6, 18.3 and 18.5 while Safari 17.5 and Chrome 138 show it correctly.
			</p>
			<p class="mb-4">
				<strong>Operating systems.</strong> macOS and iOS decode WebP and AVIF natively in current releases,
				and Android has decoded AVIF since Android 12. Windows 11 still leans on Microsoft Store extensions
				for AVIF thumbnails and previews in some configurations, which is why a transparent AVIF can show
				a plain thumbnail in File Explorer while it renders perfectly in Edge.
			</p>
			<p class="mb-4">
				<strong>Platforms that keep the alpha channel.</strong> Discord's engineering team wrote in
				<a
					href="https://discord.com/blog/modern-image-formats-at-discord-supporting-webp-and-avif"
					target="_blank"
					rel="noopener noreferrer">March 2025</a
				>
				that its media pipeline serves emoji and stickers as WebP and AVIF precisely because both
				"support variable transparency levels (or alpha channels)", and that more than 95% of its
				animated emoji now go out as animated WebP. WordPress has accepted WebP uploads since 5.8
				and
				<a
					href="https://make.wordpress.org/core/2024/02/23/wordpress-6-5-adds-avif-support/"
					target="_blank"
					rel="noopener noreferrer">AVIF uploads since 6.5</a
				> (February 2024), with a caveat about thumbnails covered below. Wix lists WEBP and AVIF among
				the formats it accepts for site media.
			</p>
			<p class="mb-4">
				<strong>Platforms that do not.</strong>
				<a
					href="https://help.etsy.com/hc/en-us/articles/115015663347-Requirements-and-Best-Practices-for-Images-in-Your-Etsy-Shop"
					target="_blank"
					rel="noopener noreferrer">Etsy's help center</a
				> is unusually direct: "If a file contains transparency, the transparent parts of the image will
				appear black on Etsy", and transparent PNGs are listed as unsupported. Shopify's CDN has been
				reported to convert some large PNGs to JPEG, filling the transparency with black. Any marketplace
				or social network that only stores JPEG will do the same, whatever format you upload. We could
				not confirm the exact current behavior of eBay, Amazon, Instagram, Facebook or X from their own
				documentation while researching this guide, so treat every JPEG-only destination as "flatten it
				yourself, onto the background color the platform wants".
			</p>
			<p class="mb-4">
				If you sell on marketplaces, the <a
					href="/guides/product-image-requirements-marketplace-guide"
					>marketplace product image requirements guide</a
				> covers which platforms want white backgrounds and at what size.
			</p>
		</section>

		<!-- 03 -->
		<section id="five-causes" class="scroll-mt-24">
			<SectionHeading>Why your cut-out came back black or white: five causes</SectionHeading>
			<p class="mb-4">
				A transparent image turns black or white for one of five reasons, and the fix is different
				for each, so it is worth identifying which one you have before re-exporting anything.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">
				1. The destination re-encoded it as a JPEG
			</h3>
			<p class="mb-4">
				This is the most common cause and the only one you cannot fix with a better file.
				Marketplaces, social networks and some CMS image pipelines normalize every upload to JPEG
				for storage and delivery. JPEG cannot represent transparency, so the encoder composites your
				cut-out onto a solid color. Etsy documents black; many other pipelines default to white. A
				Shopify community thread from October 2023 describes exactly this: large PNGs automatically
				converted to progressive JPEG with black backgrounds on roughly one product image in ten.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">
				2. The app that opened it cannot read the alpha channel
			</h3>
			<p class="mb-4">
				The file is fine; the viewer is not. Three well-documented examples: image libraries built
				on ImageMagick 6 produced AVIFs with black backgrounds instead of transparency (<a
					href="https://alexwlchan.net/2023/check-for-transparency/"
					target="_blank"
					rel="noopener noreferrer">documented in January 2023</a
				>; the fix was ImageMagick 7), and the same behavior sat as a confirmed, unassigned Ubuntu
				bug filed in June 2022. WordPress's performance team traced
				<a
					href="https://github.com/WordPress/performance/issues/2237"
					target="_blank"
					rel="noopener noreferrer">AVIF thumbnails losing their alpha</a
				>
				to the server's Imagick version rather than to WordPress itself. On Android, apps using the
				Glide image loader without its AVIF module rendered transparent AVIFs with black backgrounds
				on Android 12 and 13 devices (<a
					href="https://github.com/bumptech/glide/issues/5140"
					target="_blank"
					rel="noopener noreferrer">bumptech/glide #5140</a
				>, May 2023). In each case the same file opened correctly elsewhere.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">
				3. The export never wrote an alpha channel
			</h3>
			<p class="mb-4">
				Some export paths silently drop transparency. LibreOffice added WebP export in 7.4 but its
				bug tracker carries a confirmed report (<a
					href="https://www.mail-archive.com/libreoffice-bugs@lists.freedesktop.org/msg1013443.html"
					target="_blank"
					rel="noopener noreferrer">bug 160305</a
				>, March 2024) that WebP export "does not support transparency", which matches the Impress
				and Draw complaints that a transparent slide element comes out on a white box. Canva accepts
				WebP uploads but, as of a May 2026 audit of its export menu, offers no WebP or AVIF download
				at all, so a "transparent WebP" from Canva is a PNG that was renamed or re-encoded somewhere
				else. Figma's built-in export panel is PNG, JPG, SVG and PDF; WebP and AVIF need a plugin.
				GIMP exports both formats with alpha, but animated WebP made from layers can composite
				frames over each other unless you run Filters, Animation, Unoptimize first (GNOME Discourse,
				October 2023).
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">4. It is the page, not the file</h3>
			<p class="mb-4">
				Two of the three Shopify "transparent product images show a black background" threads we
				read (April and June 2023) turned out to be theme CSS: the Dawn theme's product-media
				container had a background color, and the transparent image was doing exactly what it should
				over it. A one-line CSS change fixed both. Before you re-export anything, open the image on
				its own; if it is transparent alone and black in the layout, the layout is the problem.
			</p>

			<h3 class="mt-8 mb-3 text-xl font-black text-[#4A2C2C]">
				5. Animation and premultiplied alpha edge cases
			</h3>
			<p class="mb-4">
				The rarest cause, and the one with the least satisfying fix. Animated AVIF with transparency
				renders with a black background in some Safari versions (the WebKit bug above), while static
				AVIF is fine. Firefox 86 darkened semi-transparent regions of AVIF images on Windows and
				Linux because alpha premultiplication was applied inconsistently; <a
					href="https://bugzilla.mozilla.org/show_bug.cgi?id=1684688"
					target="_blank"
					rel="noopener noreferrer">Bugzilla 1684688</a
				> records the fix landing in Firefox 87. If your problem is dark or fringed edges rather than
				a solid background, and it only shows in one browser, you are here.
			</p>
		</section>

		<!-- 04 -->
		<section id="check-the-file" class="scroll-mt-24">
			<SectionHeading>Check the file first: does it actually have an alpha channel?</SectionHeading>
			<p class="mb-4">
				Before changing anything, confirm whether the file you have actually contains transparency,
				because half of these problems are a file that was flattened before you ever looked at it.
				Two checks cover both formats.
			</p>
			<p class="mb-4">
				<strong>The visual check.</strong> Put the image on a strongly colored page and look at the edges.
				A one-line HTML file does it:
			</p>

			<CodeCard filename="html" code={visualCheck} />

			<p class="mb-4">
				If the pink shows through around the subject, the file has alpha and the problem is
				downstream. If you see a white or black box, the file is already flat. Any editor with a
				checkerboard view (GIMP, Photoshop, Affinity) tells you the same thing.
			</p>
			<p class="mb-4">
				<strong>The command-line check.</strong> ImageMagick's <code>identify</code> reports whether every
				pixel is opaque:
			</p>

			<CodeCard filename="bash" code={identifyCmd} />

			<p class="mb-4">
				<code>False</code> means the file contains transparent pixels; <code>True</code> means it is
				fully opaque, whatever its extension says. The same command works for WebP and PNG. For WebP
				specifically, ExifTool exposes the container's alpha flag in its <code>WebP_Flags</code>
				tag, and libwebp's <code>webpinfo</code> lists the chunks (a transparent lossy WebP shows an
				<code>ALPH</code>
				chunk; a lossless one carries alpha inside the <code>VP8L</code> bitstream). libavif's
				<code>avifdec --info</code> does the equivalent chunk-level dump for AVIF.
			</p>
			<p class="mb-4">
				Once you know the file is transparent, work through the causes above in order: destination,
				viewer, export, page, then the animation edge cases.
			</p>
		</section>

		<!-- 05 -->
		<section id="fixes" class="scroll-mt-24">
			<SectionHeading>The fix for each cause</SectionHeading>
			<p class="mb-4">
				Match the fix to the cause; re-exporting a file that was flattened by the destination only
				wastes the afternoon.
			</p>

			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>Cause</th>
							<th>Fix</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Destination re-encodes to JPEG</td>
							<td
								>Stop fighting it. Composite the cut-out onto the exact background the platform
								wants (pure white for most marketplaces) and upload that. Keep the transparent
								master for everywhere else.</td
							>
						</tr>
						<tr>
							<td>Viewer or library cannot read alpha</td>
							<td
								>Update the specific component: ImageMagick 7 rather than 6, the Glide AVIF module,
								the Windows AVIF extension, your CMS host's Imagick build. Test the same file in a
								current browser to prove the file is good.</td
							>
						</tr>
						<tr>
							<td>Export dropped the alpha</td>
							<td
								>Export a PNG from the app that cannot write transparent WebP or AVIF, then convert
								the PNG with a tool that preserves alpha (any current libwebp or libavif build, or
								an online converter that states it keeps transparency).</td
							>
						</tr>
						<tr>
							<td>The page, not the file</td>
							<td
								>Remove the background color from the container element, or set it deliberately.
								Check by opening the image URL on its own.</td
							>
						</tr>
						<tr>
							<td>Animated or premultiplied-alpha edge case</td>
							<td
								>Ship a static image where you can; for animated AVIF, serve animated WebP to Safari
								or provide a fallback in a <code>&lt;picture&gt;</code> element until the WebKit bug is
								closed.</td
							>
						</tr>
					</tbody>
				</table>
			</GuideTable>

			<p class="mb-4">
				If the cause turns out to be the export, the quickest replacement is a fresh cut-out: <a
					href="/solutions/remove-background-webp">Remove Background to WebP</a
				> writes the alpha channel every time, from the original photo rather than a flattened copy.
			</p>
		</section>

		<!-- 06 -->
		<section id="which-format" class="scroll-mt-24">
			<SectionHeading>PNG, WebP or AVIF for a cut-out?</SectionHeading>

			<GlassPanel label="Key takeaway">
				<p>
					For the web, WebP is the safe default and AVIF is the smaller one; PNG remains the right
					choice for print, for archiving a master, and for any destination that is going to
					re-encode the file anyway.
				</p>
			</GlassPanel>

			<p class="mt-6 mb-4">
				Google's own figure for lossless WebP is 26% smaller than PNG on average (<a
					href="https://developers.google.com/speed/webp/faq"
					target="_blank"
					rel="noopener noreferrer">WebP FAQ</a
				>), and a lossy WebP with a lossless alpha plane is smaller again. AVIF can go further on
				images with large soft-edged transparent regions because it compresses the alpha plane
				lossily, but the gain depends heavily on the image, and we have not benchmarked it on
				cut-outs, so treat "AVIF is smaller" as usually rather than always true. The trade-off is
				reach: WebP's 96.82% browser coverage versus AVIF's 95.36% is close, but the long tail of
				apps, CMS thumbnailers and Windows previews still handles WebP more reliably than AVIF in
				2026.
			</p>
			<p class="mb-4">
				A practical rule: keep a PNG master, publish WebP by default, add AVIF where your stack (a
				modern CMS, an image CDN, or your own build pipeline) serves it with a fallback, and flatten
				to JPEG only for the platforms that will do it for you anyway. Our <a
					href="/guides/should-my-product-images-be-avif-or-webp-in-2026"
					>AVIF or WebP for product images</a
				>
				answer goes deeper on the size and compatibility trade for e-commerce, and
				<a href="/guides/what-is-an-avif-file">What Is an AVIF File?</a> covers opening AVIF on machines
				that cannot.
			</p>
		</section>

		<!-- 07 -->
		<section id="mochify-workflow" class="scroll-mt-24">
			<SectionHeading
				>Mochify Workflow: remove a background to transparent WebP or AVIF</SectionHeading
			>
			<p class="mb-4">
				Mochify removes a background and writes the result as a transparent WebP or AVIF in one
				step, on every plan including Free, from any browser. There are three ways in, depending on
				what you need.
			</p>

			<GlassPanel>
				<StepList steps={workflowSteps} />
			</GlassPanel>

			<GlassInfoBox type="note" title="Privacy, stated precisely for this workflow">
				The images travel to <code>api.mochify.app</code>, are processed in memory, and are wiped as
				soon as the result is delivered; nothing is written to disk and no logs contain file data.
				That holds for the web pages, the API and the MCP surfaces alike.
			</GlassInfoBox>

			<p class="mt-6 mb-4">
				One thing the workflow will not do: make a platform that stores JPEG keep your transparency.
				If the destination is Etsy, upload the "place it on white" version.
			</p>
		</section>

		<!-- 08 -->
		<section id="cheat-sheet" class="scroll-mt-24">
			<SectionHeading>Cheat Sheet: symptom, cause, fix</SectionHeading>

			<GuideTable class="my-6">
				<table>
					<thead>
						<tr>
							<th>What you see</th>
							<th>Most likely cause</th>
							<th>Do this</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Black background after uploading to a marketplace or social app</td>
							<td>Platform re-encoded to JPEG (Etsy documents black)</td>
							<td>Upload a version composited onto the platform's required color</td>
						</tr>
						<tr>
							<td>White background after uploading to a marketplace or CMS</td>
							<td>Same, with a white matte</td>
							<td>Same; or check the CMS thumbnail library version</td>
						</tr>
						<tr>
							<td>Fine in Chrome, black in an app or a Windows thumbnail</td>
							<td>Viewer lacks an AVIF/WebP-alpha decoder</td>
							<td>Update the decoder or extension; keep the file</td>
						</tr>
						<tr>
							<td>White box after exporting from LibreOffice, Canva or Figma</td>
							<td>Export path never wrote alpha</td>
							<td>Export PNG, convert with a tool that keeps alpha</td>
						</tr>
						<tr>
							<td>Transparent on its own, black inside the web page</td>
							<td>Container CSS background</td>
							<td>Fix the CSS, not the image</td>
						</tr>
						<tr>
							<td>Animated AVIF black in Safari only</td>
							<td>WebKit animated-AVIF bug</td>
							<td>Serve animated WebP or a fallback to Safari</td>
						</tr>
						<tr>
							<td>Dark fringe on soft edges in one browser</td>
							<td>Premultiplied-alpha handling</td>
							<td>Re-encode with a current encoder; test another browser</td>
						</tr>
						<tr>
							<td><code>identify -format '%[opaque]'</code> prints <code>True</code></td>
							<td>The file is already flat</td>
							<td>Go back to the master and export again</td>
						</tr>
					</tbody>
				</table>
			</GuideTable>
		</section>

		<!-- 09 FAQ -->
		<GlassFAQs items={faqItems} />

		<p class="mb-4">
			Whatever caused the black box, the master file is the thing to protect: keep the transparent
			original, and make each flattened copy from it rather than from the last upload. If you need a
			new cut-out, <a href="/flow">mochify.app/flow</a> will remove the background and hand you a
			transparent PNG in one prompt, and the <a href="/solutions/remove-background-webp">WebP</a>
			and <a href="/solutions/remove-background-avif">AVIF</a> pages do the same for those two formats.
		</p>

		<GlassCTA
			heading="Need a cut-out that keeps its transparency?"
			href="/solutions/remove-background-webp"
			label="Remove Background to WebP →"
			secondaryHref="/solutions/remove-background-avif"
			secondaryLabel="Or to AVIF"
		>
			Both write a full alpha channel from the original photo, on every plan including Free, with no
			settings to get wrong.
		</GlassCTA>

		<RelatedGuidesGrid guides={related} />
	</div>
</article>

<style>
	/* The breadcrumb renders in the shared guides layout at max-w-4xl; align
       it with this page's 3xl reading column. The full trail stays visible,
       current-page crumb included, so what the reader sees matches the
       BreadcrumbList JSON-LD. At rollout the width constraint belongs in the
       layout: constrain <main> to 3xl. */
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
		top: -20rem; /* start well above the viewport so no seam shows behind the nav */
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
