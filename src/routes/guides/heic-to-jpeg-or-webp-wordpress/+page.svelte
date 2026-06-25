<script lang="ts">
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Should I convert HEIC to JPEG or WebP for WordPress uploads?",
        description: "JPEG works everywhere and is the safest default. WebP is better when file size matters — it's 25–35% smaller and has 97%+ browser coverage. HEIC must always be converted before serving.",
        category: "Quick Guides",
        readTime: "3 min read",
        datePublished: "June 25, 2026"
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
    <title>{metadata.title} | Mochify</title>
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
        "description": "JPEG works everywhere and is the safest default. WebP is better when file size matters — it's 25–35% smaller and has 97%+ browser coverage. HEIC must always be converted before serving.",
        "url": "https://mochify.app/guides/heic-to-jpeg-or-webp-wordpress",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/heic-to-jpeg-or-webp-wordpress"
        },
        "datePublished": "2026-06-25",
        "dateModified": "2026-06-25",
        "inLanguage": "en-GB",
        "author": { "@type": "Organization", "name": "Mochify Engineering Team", "url": "https://mochify.app" },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app",
            "logo": { "@type": "ImageObject", "url": "https://mochify.app/logo.png" }
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app"},
                {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides"},
                {"@type": "ListItem", "position": 3, "name": "Should I convert HEIC to JPEG or WebP for WordPress uploads?", "item": "https://mochify.app/guides/heic-to-jpeg-or-webp-wordpress"}
            ]
        },
        "about": [
            { "@type": "Thing", "name": "HEIC image format" },
            { "@type": "Thing", "name": "WebP image format" },
            { "@type": "Thing", "name": "JPEG image format" },
            { "@type": "Thing", "name": "WordPress media uploads" },
            { "@type": "Thing", "name": "Image optimisation" }
        ],
        "keywords": "HEIC to JPEG WordPress, HEIC to WebP WordPress, convert HEIC before upload, WordPress image formats, image compression WordPress"
    }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.datePublished}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Should I convert HEIC to JPEG or WebP for WordPress uploads?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            JPEG works everywhere and is the safest default for WordPress uploads. WebP is the better choice when file size matters and you don't need to support very old browsers: it's typically 25–35% smaller than an equivalent JPEG, and global browser support is now above 97%. Either way, never upload HEIC directly for public display. Browsers don't support it natively, and your visitors will either see nothing or trigger a server-side fallback that may or may not work depending on your host.
        </p>

        <p class="text-sm text-[#875F42]">Published {metadata.datePublished} by the <strong class="text-[#6C3F31]">Mochify Engineering Team</strong>. This guide covers WordPress's built-in HEIC handling, what it gets wrong, and why converting before upload gives you more control over the result.</p>
    </header>

    <div class="space-y-12 text-lg text-[#6C3F31] leading-relaxed">

        <section id="what-wordpress-does-with-heic" class="scroll-mt-24">
            <SectionHeading>What WordPress actually does with a HEIC file</SectionHeading>
            <p class="mb-4"><a href="https://make.wordpress.org/core/2024/08/15/automatic-conversion-of-heic-images-to-jpeg-in-wordpress-6-7/" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">WordPress 6.7 added automatic server-side conversion</a> of HEIC uploads to JPEG, but it only works if your host has Imagick installed with HEIC support. You can check under Tools &gt; Site Health &gt; Info &gt; Media Handling &gt; ImageMagick supported file formats. If HEIC isn't listed, WordPress displays a warning and leaves the file unconverted: it won't display in the block editor or on the front end. The original HEIC is preserved as a downloadable attachment, but it's not usable on the page.</p>
            <p class="mb-4">WordPress 7.1 is now in testing with a <a href="https://make.wordpress.org/core/2026/06/04/call-for-testing-client-side-media-processing/" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">client-side media pipeline</a> that converts and resizes images directly in the browser using WebAssembly, with support for HEIC, WebP, AVIF, and JPEG XL. This is a progressive enhancement: it only activates in Chromium-based browsers on capable devices, so it doesn't eliminate the need for a reliable conversion path on older installs or non-Chromium visitors.</p>
            <p class="mb-4">Neither approach gives you meaningful control over output format or quality without extra configuration.</p>

            <InfoBox type="tip" title="Check your host first">
                WordPress's automatic HEIC conversion requires Imagick with HEIC support, and not all hosts have it. Go to Tools &gt; Site Health &gt; Info &gt; Media Handling to see what your server supports before relying on it.
            </InfoBox>
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
            <p class="mb-4">Convert your iPhone photos before they reach WordPress at <a href="/heic-to-jpeg" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app/heic-to-jpeg</a>.</p>
        </section>

        <aside class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-8">
            <p class="text-[#6C3F31] leading-relaxed mb-5">Upload your HEIC files and convert to JPEG or WebP in seconds. Just describe what you need, <em>"convert to WebP, max 1200px, strip EXIF"</em>, and Mochify handles the rest. Free to try, no signup required for your first three images.</p>
            <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 no-underline text-base">
                Try it free
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </aside>

        <RelatedGuides guides={related} />

    </div>
</article>
