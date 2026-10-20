<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Can WordPress 7.1 Optimize Images Without a Plugin?",
        description: "Mostly, yes. WordPress 7.1 compresses, resizes, and converts HEIC images in-browser, but only in Chrome/Edge and only to fixed defaults.",
        category: "WordPress Performance",
        readTime: "2 min read",
        date: "August 21, 2026",
        lastUpdated: "August 25, 2026"
    };

    const related = [
        { href: '/guides/heic-to-jpeg-or-webp-wordpress', title: 'Should I convert HEIC to JPEG or WebP for WordPress uploads?', desc: 'choosing the right target format before upload.' },
        { href: '/guides/next-gen-image-formats-wordpress', title: 'Fix "Next-Gen Formats" in WordPress (No Plugins)', desc: 'the PageSpeed delivery-side fix.' },
        { href: '/guides/does-stripping-exif-data-improve-wordpress-image-seo', title: 'Does Stripping EXIF Data Improve WordPress Image SEO?', desc: 'what metadata does and does not affect.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Can WordPress 7.1 Optimize Images Without a Plugin?",
        "description": "Mostly, yes. WordPress 7.1 compresses, resizes, and converts HEIC images in-browser, but only in Chrome/Edge and only to fixed defaults.",
        "url": "https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin"
        },
        "datePublished": "2026-08-21",
        "dateModified": "2026-08-25",
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
            "@type": "WebSite",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "about": [
            { "@type": "Thing", "name": "WordPress 7.1" },
            { "@type": "Thing", "name": "libvips" },
            { "@type": "Thing", "name": "HEIC image format" },
            { "@type": "Thing", "name": "AVIF image format" },
            { "@type": "Thing", "name": "HDR gain maps" },
            { "@type": "Thing", "name": "EXIF metadata" }
        ],
        "keywords": "WordPress 7.1 image optimization without plugin, wordpress 7.1 image optimization, wordpress image compression without plugin, heic to jpeg wordpress uploads, avif support wordpress, wordpress media library optimization, libvips image processing",
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".article-intro", "h1"]
        }
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app/" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "Can WordPress 7.1 Optimize Images Without a Plugin?", "item": "https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Can WordPress 7.1 Optimize Images Without a Plugin?",
        "url": "https://mochify.app/guides/can-wordpress-7-1-optimize-images-without-a-plugin",
        "description": "Mostly, yes. WordPress 7.1 compresses, resizes, and converts HEIC images in-browser, but only in Chrome/Edge and only to fixed defaults.",
        "isPartOf": { "@type": "WebSite", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-08-21",
        "dateModified": "2026-08-25"
        }
    </script>
</svelte:head>

<article
	class="relative mx-auto w-full max-w-3xl px-5 pt-6 text-lg leading-relaxed text-[#6C3F31] sm:px-6 md:px-0 md:pt-0"
>
	<div class="hero-wash" aria-hidden="true"></div>

    <header class="mb-12 md:mb-14">
		<p class="mt-0 mb-3 text-xs font-bold tracking-[0.18em] text-[#F06292] uppercase">
			{metadata.category}
		</p>
		<h1
			class="mb-0 text-3xl leading-[1.1] font-black tracking-tight text-[#4A2C2C] md:text-[2.75rem]"
		>
			<AccentTitle title={metadata.title} accent="Without a Plugin" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            Mostly, yes. WordPress 7.1 image optimization without a plugin is now real: the release (August 19, 2026) moves image compression, resizing, and thumbnail generation into your browser, converts iPhone HEIC photos to JPEG on upload, decodes AVIF natively, and preserves HDR gain maps. For routine upload-time optimization, most sites no longer need a dedicated plugin. The trade-off is control: WordPress optimizes to its own defaults, only in supported browsers, and it never touches the full-size original you upload.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-lg leading-relaxed text-[#6C3F31]">
                <strong>Quick answer:</strong> Yes, largely. WordPress 7.1's browser-based pipeline (released August 19, 2026) handles upload-time compression, resizing, thumbnails, HEIC-to-JPEG conversion, and native AVIF decoding without a plugin. It uses fixed defaults, works fully only in Chrome and Edge 137+, and leaves your original file's metadata untouched.
            </p>
        </div>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">
                <strong class="text-[#4A2C2C]">Published August 21, 2026 by the Mochify Engineering Team.</strong>
                This quick answer separates what WordPress 7.1's new browser-based pipeline automates from what still requires a dedicated tool.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section id="what-wordpress-7-1-does-natively" class="scroll-mt-24">
            <SectionHeading>What WordPress 7.1 does natively</SectionHeading>
            <p>The new pipeline runs in the browser through a WebAssembly build of the libvips image library, so processing no longer hits PHP memory limits or upload timeouts on shared hosting. According to the <a href="https://make.wordpress.org/core/2026/07/22/client-side-media-processing-in-wordpress-7-1/" target="_blank" rel="noopener noreferrer">WordPress 7.1 dev notes</a>, libvips produces JPEGs around 15% smaller than the old server-side pipeline, and the <a href="https://wordpress.org/news/2026/08/mary-lou/" target="_blank" rel="noopener noreferrer">release announcement</a> confirms native handling for AVIF, HEIC, and HDR gain maps.</p>
            <p>In practice: HEIC photos are decoded in the browser and uploaded as web-ready JPEG (the HEIC original is kept as a companion file), 10-bit and 12-bit AVIF sources keep their bit depth in generated sizes, and HDR gain-map data survives across every thumbnail.</p>
            <p>One important limit: client-side processing currently works in Chrome and Edge 137+ only. Firefox, Safari, and low-memory devices silently fall back to the old server-side processing, so results are not identical for every user who uploads.</p>
        </section>

        <section id="what-it-still-leaves-to-you" class="scroll-mt-24">
            <SectionHeading>What it still leaves to you</SectionHeading>
            <p>WordPress applies its own defaults, not your decisions. JPEG quality stays fixed at 82 unless a developer adds code-level filters, there is no per-image choice of output format or quality in the admin, and the release notes describe nothing for re-optimizing images already in your media library. Scaling still caps large uploads at 2560px rather than the exact dimensions your theme needs.</p>
            <p>The original file is also untouched by design. WordPress has never stripped metadata from the full-size original, so an uploaded photo's EXIF data, including GPS location, stays in that file on your server. If that matters for privacy, it needs handling before upload; our <a href="/guides/does-stripping-exif-data-improve-wordpress-image-seo">EXIF and WordPress SEO Quick Answer</a> covers why.</p>
        </section>

        <section id="where-pre-upload-optimization-still-fits" class="scroll-mt-24">
            <SectionHeading>Where pre-upload optimization still fits</SectionHeading>
            <p>Optimizing before upload gives you what 7.1 does not: exact dimensions, your chosen format and quality, and clean metadata, identical in every browser. WordPress is one case of a pattern that now runs everywhere; see <a href="/guides/what-automatic-image-optimization-actually-does">the bigger picture on platform defaults</a> for how the same trade-off plays out across Shopify, Instagram, and the marketplaces. Files are streamed into memory on Mochify's servers for processing and wiped immediately, with nothing retained. If your library is full of iPhone photos, start with the <a href="/heic-to-jpeg">HEIC to JPEG converter</a>, and see our guide to <a href="/guides/next-gen-image-formats-wordpress">fixing next-gen image formats in WordPress</a> for the delivery side that 7.1 still does not solve.</p>
        </section>

        <!-- CTA -->
        <GlassCTA
            heading="Optimize before you upload"
            href="/"
            label="Open mochify.app →"
        >
            With Mochify you can describe the whole job in plain English, for example: <em>"resize these to 1600px wide, convert to WebP, and strip GPS data."</em>
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
