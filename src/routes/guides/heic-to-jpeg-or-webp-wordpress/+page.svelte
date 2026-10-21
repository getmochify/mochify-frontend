<script lang="ts">
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "Should I convert HEIC to JPEG or WebP for WordPress uploads?",
        seoTitle: "Should I Convert HEIC to JPEG or WebP for WordPress?",
        description: "JPEG works everywhere and is the safest default. WebP is 25–35% smaller with 97%+ browser coverage if size matters. HEIC must be converted before serving.",
        category: "Quick Guides",
        readTime: "3 min read",
        datePublished: "June 25, 2026",
        lastUpdated: "October 7, 2026"
    };

    const related = [
        {
            title: "Fix \"Next-Gen Formats\" in WordPress (No Plugins) & Boost LCP",
            href: "/guides/next-gen-image-formats-wordpress",
            desc: "How to serve WebP and AVIF from WordPress without installing a plugin."
        },
        {
            title: "What Should I Use in 2026: WebP, AVIF, or JPEG XL?",
            href: "/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl",
            desc: "A practical format comparison for web projects, with browser support data."
        },
        {
            title: "Should I Optimize My Images Before I Upload Them?",
            href: "/guides/should-i-optimize-images-before-upload",
            desc: "Why pre-optimizing beats relying on your CMS, and how to do it efficiently."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.seoTitle}</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/heic-to-jpeg-or-webp-wordpress" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Should I convert HEIC to JPEG or WebP for WordPress uploads?",
        "description": "JPEG works everywhere and is the safest default. WebP is 25–35% smaller with 97%+ browser coverage if size matters. HEIC must be converted before serving.",
        "url": "https://mochify.app/guides/heic-to-jpeg-or-webp-wordpress",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/heic-to-jpeg-or-webp-wordpress"
        },
        "image": "https://mochify.app/og/guides-heic-to-jpeg-or-webp-wordpress.png",
        "datePublished": "2026-06-25T12:00:00+00:00",
        "dateModified": "2026-10-07T12:00:00+00:00",
        "inLanguage": "en",
        "author": { "@type": "Organization", "name": "Mochify Engineering Team", "url": "https://mochify.app" },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app",
            "logo": { "@type": "ImageObject", "url": "https://mochify.app/logo.png" }
        },
        "about": [
            { "@type": "Thing", "name": "HEIC image format" },
            { "@type": "Thing", "name": "WebP image format" },
            { "@type": "Thing", "name": "JPEG image format" },
            { "@type": "Thing", "name": "WordPress media uploads" },
            { "@type": "Thing", "name": "Image optimization" }
        ],
        "keywords": "HEIC to JPEG WordPress, HEIC to WebP WordPress, convert HEIC before upload, WordPress image formats, image compression WordPress"
    }
    </script>
    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/heic-to-jpeg-or-webp-wordpress"
        description={metadata.description}
        datePublished="2026-06-25"
        dateModified="2026-10-07"
    />
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
			<AccentTitle title={metadata.title} accent="JPEG or WebP" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.datePublished} · Updated {metadata.lastUpdated}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            JPEG works everywhere and is the safest default for WordPress uploads. WebP is the better choice when file size matters and you don't need to support very old browsers: it's typically 25–35% smaller than an equivalent JPEG, and global browser support is now above 97%. Either way, never upload HEIC directly for public display. Browsers don't support it natively, and your visitors will either see nothing or trigger a server-side fallback that may or may not work depending on your host.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">Published {metadata.datePublished} by the <strong class="text-[#6C3F31]">Mochify Engineering Team</strong>. This guide covers WordPress's built-in HEIC handling, what it gets wrong, and why converting before upload gives you more control over the result.</p>
        </div>
    </header>

    <div class="space-y-12">

        <section id="what-wordpress-does-with-heic" class="scroll-mt-24">
            <SectionHeading>What WordPress actually does with a HEIC file</SectionHeading>
            <p class="mb-4"><a href="https://make.wordpress.org/core/2024/08/15/automatic-conversion-of-heic-images-to-jpeg-in-wordpress-6-7/" target="_blank" rel="noopener noreferrer">WordPress 6.7 added automatic server-side conversion</a> of HEIC uploads to JPEG, but it only works if your host has Imagick installed with HEIC support. You can check under Tools &gt; Site Health &gt; Info &gt; Media Handling &gt; ImageMagick supported file formats. If HEIC isn't listed, WordPress displays a warning and leaves the file unconverted: it won't display in the block editor or on the front end. The original HEIC is preserved as a downloadable attachment, but it's not usable on the page.</p>
            <p class="mb-4">WordPress 7.1 (released August 19, 2026) ships the <a href="https://make.wordpress.org/core/2026/06/04/call-for-testing-client-side-media-processing/" target="_blank" rel="noopener noreferrer">client-side media pipeline</a> that spent the summer in testing: HEIC files are decoded and converted directly in the browser using WebAssembly, with no dependency on the host's Imagick build, alongside JPEG, PNG, GIF, WebP and AVIF. JPEG XL was in the June test build but is not in the release documentation's format lists, and WordPress still does not accept a .jxl upload. We break down <a href="/guides/can-wordpress-7-1-optimize-images-without-a-plugin">what 7.1 now handles natively</a> and what it still leaves to you. This is a progressive enhancement: it only activates in Chromium-based browsers on capable devices, so it doesn't eliminate the need for a reliable conversion path on older installs or non-Chromium visitors.</p>
            <p class="mb-4">Neither approach gives you meaningful control over output format or quality without extra configuration.</p>
            <p class="mb-4">Embedded metadata is the other thing that changes hands at upload, because WordPress generates its own resized derivatives from whatever you give it. If that matters for your workflow, <a href="/guides/does-stripping-exif-data-improve-wordpress-image-seo">what WordPress does to image metadata on resize</a> sets out the default behavior and what it means in practice.</p>

            <GlassInfoBox type="tip" title="Check your host first">
                WordPress's automatic HEIC conversion requires Imagick with HEIC support, and not all hosts have it. Go to Tools &gt; Site Health &gt; Info &gt; Media Handling to see what your server supports before relying on it.
            </GlassInfoBox>
        </section>

        <section id="converting-before-upload" class="scroll-mt-24">
            <SectionHeading>Why converting before upload gives you more control</SectionHeading>
            <p class="mb-4">Converting HEIC to your chosen format before it hits WordPress has three concrete advantages over letting the CMS handle it:</p>

            <ul class="mb-6 space-y-3">
                <li class="flex gap-3 items-start">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#F06292] flex-shrink-0"></span>
                    <span><strong class="text-[#4A2C2C]">Format choice.</strong> You decide whether the output is JPEG or WebP, rather than accepting whatever fallback fires.</span>
                </li>
                <li class="flex gap-3 items-start">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#F06292] flex-shrink-0"></span>
                    <span><strong class="text-[#4A2C2C]">Quality control.</strong> Automatic HEIC-to-JPEG conversions often produce large files. JPEG files converted from HEIC can run nearly double the size of the original because the conversion doesn't re-compress aggressively.</span>
                </li>
                <li class="flex gap-3 items-start">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#F06292] flex-shrink-0"></span>
                    <span><strong class="text-[#4A2C2C]">Batch efficiency.</strong> On paid plans, Mochify processes up to 25 images at once rather than triggering server-side conversion one upload at a time.</span>
                </li>
            </ul>

            <p class="mb-4">Mochify accepts HEIC files directly and converts them to JPEG or WebP using its C++ compression engine. You can describe the output in plain English, <em>"convert to WebP, max 1200px wide, strip EXIF"</em>, and Magic Flow interprets the instruction and applies the right settings automatically. Images are streamed into server RAM and wiped immediately after processing, with no retention.</p>
            <p class="mb-4">JPEG works everywhere. WebP is the better choice when file size matters and you don't need to support very old browsers: global WebP support is now above 97%.</p>
            <p class="mb-4">Serving the HEIC itself is not an option either way: <a href="/guides/can-safari-open-heic-images">only Safari renders HEIC in a browser</a>, so every visitor on Chrome, Firefox, or Edge gets a broken image.</p>
            <p class="mb-4">Convert your iPhone photos before they reach WordPress at <a href="/heic-to-jpeg">mochify.app/heic-to-jpeg</a>.</p>
        </section>

        <GlassCTA href="/" label="Try it free">
            Upload your HEIC files and convert to JPEG or WebP in seconds. Just describe what you need, <em>"convert to WebP, max 1200px, strip EXIF"</em>, and Mochify handles the rest. Free to try, no signup required for your first three images.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
