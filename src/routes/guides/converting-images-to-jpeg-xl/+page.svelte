<script lang="ts">
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import CodeBlock from '$lib/components/CodeBlock.svelte';
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';

    const metadata = {
        title: "Converting Images to JPEG XL: The Practical Guide for 2026",
        description: "JPEG XL compression benchmarks, every conversion path (JPEG, PNG, AVIF to JXL), honest 2026 browser support, and how to serve JXL safely with picture fallbacks.",
        category: "Image Formats",
        readTime: "11 min read",
        datePublished: "June 26, 2026"
    };

    const related = [
        {
            title: "The 2026 Guide to Next-Gen Formats: WebP, AVIF, and JPEG XL",
            href: "/guides/2026-guide-next-gen-formats",
            desc: "Full comparison of all three formats with use-case recommendations and real-world data."
        },
        {
            title: "What Should I Use in 2026: WebP, AVIF, or JPEG XL?",
            href: "/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl",
            desc: "Quick-answer format breakdown for the most common decision developers and designers face."
        },
        {
            title: "Does Chrome 145 Enable JPEG XL by Default?",
            href: "/guides/chrome-145-jpeg-xl-default",
            desc: "Full timeline on Chrome's JPEG XL reversal and what it means for production sites in 2026."
        },
        {
            title: "Should I Optimize My Images Before I Upload Them?",
            href: "/guides/should-i-optimize-images-before-upload",
            desc: "Pre-upload optimization decisions and how modern formats fit into your workflow."
        },
        {
            title: "Optimizing Hero Images for Web Performance (2026)",
            href: "/guides/optimizing-hero-images",
            desc: "LCP, picture elements, and format strategy for above-the-fold images that affect your Core Web Vitals."
        }
    ];

    const pictureCode = `<picture>
  <source type="image/jxl" srcset="image.jxl">
  <source type="image/avif" srcset="image.avif">
  <source type="image/webp" srcset="image.webp">
  <img src="image.jpg" alt="Description of image" width="800" height="600">
</picture>`;
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/converting-images-to-jpeg-xl" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Converting Images to JPEG XL: The Practical Guide for 2026",
        "description": "JPEG XL compression benchmarks, every conversion path (JPEG, PNG, AVIF to JXL), honest 2026 browser support, and how to serve JXL safely with picture fallbacks.",
        "url": "https://mochify.app/guides/converting-images-to-jpeg-xl",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/converting-images-to-jpeg-xl"
        },
        "datePublished": "2026-06-26",
        "dateModified": "2026-06-26",
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
                {"@type": "ListItem", "position": 3, "name": "Converting Images to JPEG XL: The Practical Guide for 2026", "item": "https://mochify.app/guides/converting-images-to-jpeg-xl"}
            ]
        },
        "about": [
            { "@type": "Thing", "name": "JPEG XL" },
            { "@type": "Thing", "name": "Image compression" },
            { "@type": "Thing", "name": "Web performance" },
            { "@type": "Thing", "name": "Next-generation image formats" }
        ],
        "keywords": "JPEG XL, convert to JXL, JPEG XL conversion, PNG to JXL, AVIF to JXL, JPEG XL browser support 2026, next-gen image formats"
    }
    </script>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is JPEG XL better than AVIF?",
                "acceptedAnswer": { "@type": "Answer", "text": "For photographic content at practical encode speeds, JPEG XL is competitive with or slightly ahead of AVIF on compression. The more important factor in 2026 is browser support: AVIF has roughly 95–97% global coverage; JPEG XL has around 14–15%. Use AVIF for web delivery and consider JPEG XL for archival masters or Safari-primary audiences." }
            },
            {
                "@type": "Question",
                "name": "Does Chrome support JPEG XL?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes, but not by default. Chrome 145 and later Canary builds ship a Rust-based JXL decoder, but it remains gated behind chrome://flags/#enable-jxl-image-format. Stable Chrome does not display JXL images for general users as of mid-2026." }
            },
            {
                "@type": "Question",
                "name": "Can I convert a JPEG to JPEG XL without losing any quality?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. JPEG XL's lossless transcode mode wraps the existing JPEG data inside a JXL container with no re-encoding. The resulting file is smaller (typically 20–30%) and allows exact byte-for-byte reconstruction of the original JPEG." }
            },
            {
                "@type": "Question",
                "name": "What file types can I convert to JPEG XL?",
                "acceptedAnswer": { "@type": "Answer", "text": "JPEG, PNG, WebP, AVIF, and HEIC all convert cleanly to JXL. Each has a slightly different optimal strategy: lossless transcode for JPEGs, lossless JXL for PNG graphics, and archival-focused conversions for AVIF. Mochify handles all of these formats on upload." }
            },
            {
                "@type": "Question",
                "name": "Should I use JPEG XL for my Shopify store?",
                "acceptedAnswer": { "@type": "Answer", "text": "Not for web delivery in 2026. Shopify's CDN and upload pipeline are built around JPEG, PNG, and WebP. For e-commerce product images, AVIF with a WebP fallback is the highest-impact format switch you can make today." }
            },
            {
                "@type": "Question",
                "name": "Does JPEG XL support transparency?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes, in both lossy and lossless modes. This makes it a potential PNG replacement for transparent UI elements, logos, and sprites. For most web delivery today, WebP lossless remains the practical choice for transparent assets." }
            },
            {
                "@type": "Question",
                "name": "How do I serve JPEG XL with a fallback for unsupported browsers?",
                "acceptedAnswer": { "@type": "Answer", "text": "Use the HTML picture element with a source element typed image/jxl as the first source, followed by AVIF, WebP, and a JPEG img baseline. Browsers evaluate sources top to bottom and pick the first they support." }
            },
            {
                "@type": "Question",
                "name": "Is JPEG XL good for archiving photos?",
                "acceptedAnswer": { "@type": "Answer", "text": "It is arguably the best format for long-term photographic archival right now. 32-bit depth, HDR support, lossless JPEG transcoding, and strong compression make a compelling combination. For large archives of existing JPEGs, the lossless transcode mode alone saves 20–30% with exact reconstruction preserved." }
            }
        ]
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
            Converting Images to JPEG XL: The Practical Guide for 2026
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            JPEG XL promises better compression than JPEG, WebP, and often AVIF, lossless JPEG archiving, HDR support, and progressive rendering. The catch: as of mid-2026 it is native in Safari and available behind a flag in Chrome, but absent from Firefox and Edge for general audiences. This guide covers the benchmarks, every meaningful conversion path, honest browser support, and how to set up a <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-sm border border-pink-100">&lt;picture&gt;</code> fallback that actually works.
        </p>

        <p class="text-sm text-[#875F42]">Published {metadata.datePublished} by the <strong class="text-[#6C3F31]">Mochify Engineering Team</strong>. Covers JPEG, PNG, and AVIF-to-JXL workflows, with compression data from Google's image coding benchmarks and practical guidance on when JXL is and isn't production-ready.</p>
    </header>

    <!-- TOC -->
    <nav class="bg-[#FFF5F7] border border-pink-100 rounded-3xl p-8 mb-12" aria-label="What's in this guide">
        <h2 class="font-black text-[#4A2C2C] text-base mb-5 flex items-center gap-3">
            <span class="w-1.5 h-6 bg-[#F06292] rounded-full shrink-0"></span>
            What's in This Guide
        </h2>
        <ol class="space-y-3">
            {#each [
                { n: '01', id: 'what-is-jpeg-xl', label: 'What JPEG XL actually is (and why the name is confusing)' },
                { n: '02', id: 'browser-support', label: 'Browser and ecosystem support in 2026' },
                { n: '03', id: 'compression-benchmarks', label: 'Compression benchmarks: how much smaller?' },
                { n: '04', id: 'jpeg-to-jxl', label: 'Converting JPEG to JPEG XL' },
                { n: '05', id: 'png-to-jxl', label: 'Converting PNG to JPEG XL' },
                { n: '06', id: 'avif-to-jxl', label: 'Converting AVIF to JPEG XL' },
                { n: '07', id: 'fallback-pattern', label: 'The fallback pattern: serving JXL safely on the web' },
                { n: '08', id: 'when-not-to-use', label: 'When not to use JPEG XL yet' },
                { n: '09', id: 'mochify-workflow', label: 'Mochify Workflow: convert to JPEG XL in one prompt' },
                { n: '10', id: 'cheat-sheet', label: 'JPEG XL Quick-Reference Cheat Sheet' },
                { n: '11', id: 'faq', label: 'FAQ' },
            ] as item}
                <li class="flex items-center gap-4">
                    <span class="w-8 h-8 shrink-0 bg-[#FFF0F5] border border-pink-100 rounded-full flex items-center justify-center font-black text-[#F06292] text-xs">{item.n}</span>
                    <a href="#{item.id}" class="text-[#6C3F31] font-semibold text-sm hover:text-[#F06292] transition-colors">{item.label}</a>
                </li>
            {/each}
        </ol>
    </nav>

    <div class="space-y-12 text-lg text-[#6C3F31] leading-relaxed">

        <section id="what-is-jpeg-xl" class="scroll-mt-24">
            <SectionHeading>What JPEG XL Actually Is (and Why the Name Is Confusing)</SectionHeading>
            <p class="mb-4">JPEG XL (extension <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-sm border border-pink-100">.jxl</code>) is not a direct update to classic JPEG the way that phrasing implies. It is a completely new codec, standardised by the JPEG committee as ISO 18181, with a different architecture underneath. The "JPEG" in the name refers to the committee, not the format family.</p>
            <p class="mb-4">Two properties make JXL genuinely unusual among modern formats. First, it can losslessly transcode an existing JPEG into a JXL container that is smaller but still allows exact byte-for-byte reconstruction of the original JPEG — you shrink the file without losing the source. Second, it supports up to 32-bit per channel colour depth and HDR (PQ and HLG), making it the strongest archival format in this comparison for professional photography workflows.</p>
            <p>Compare that to AVIF, which tops out at 12-bit depth. Both WebP and AVIF are strong choices for web delivery today, but for long-term archival of high-bit-depth stills, JPEG XL's spec headroom is a real advantage.</p>
        </section>

        <section id="browser-support" class="scroll-mt-24">
            <SectionHeading>Browser and Ecosystem Support in 2026</SectionHeading>
            <p class="mb-4">JPEG XL is natively supported in <strong class="text-[#4A2C2C]">Safari 17 and above</strong> (announced at WWDC 2023), covering all up-to-date macOS and iOS devices. That gives you roughly 14–15% global browser coverage as a baseline — meaningful for Apple-heavy audiences, but not enough to replace JPEG or AVIF as your primary format.</p>
            <p class="mb-4">Chrome's history with JXL is worth knowing because it explains where things stand now. Chromium shipped early JPEG XL support behind a flag in versions 91–109, then <a href="https://caniuse.com/jpegxl" target="_blank" rel="noopener noreferrer" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">removed it entirely in Chrome 110</a> citing "lack of ecosystem momentum." In late 2025 and early 2026, Google reversed course: a Rust-based JXL decoder (<code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">jxl-rs</code>) was merged into Chromium's rendering pipeline. Chrome 145 and later Canary builds expose it via <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">chrome://flags/#enable-jxl-image-format</code>, but it remains disabled by default and Google has not announced a stable-channel rollout date as of mid-2026.</p>
            <p class="mb-4">Firefox is in a similar position — JPEG XL support is available in Nightly and Firefox Labs builds but is not enabled in general releases.</p>

            <InfoBox type="tip" title="Practical takeaway">
                Use JPEG XL as an enhancement layer served only to capable clients, with a robust fallback for everyone else. The <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">&lt;picture&gt;</code> element is your main tool — covered in the <a href="#fallback-pattern" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">fallback pattern section</a> below.
            </InfoBox>

            <p class="mt-4"><strong class="text-[#4A2C2C]">CDN and platform support</strong> follows the same split. Fastly Image Optimizer supports JPEG XL as both input and output. Cloudflare Images and Netlify Image CDN do not yet support JXL as an output format. Imgix accepts JXL as input but only serves AVIF or WebP as output. Major CMSes — WordPress core and Shopify — do not expose JXL in their upload or delivery pipelines, and several WordPress performance guides explicitly categorise it as not production-ready for those stacks in 2026.</p>
        </section>

        <section id="compression-benchmarks" class="scroll-mt-24">
            <SectionHeading>Compression Benchmarks: How Much Smaller?</SectionHeading>
            <p class="mb-4">JPEG XL's compression efficiency is well-documented in peer-reviewed testing. The <a href="https://research.google/pubs/jpeg-xl-next-generation-image-compression-architecture-and-coding-tools/" target="_blank" rel="noopener noreferrer" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">JPEG XL next-generation image compression architecture paper</a> from Google covers the codec's design goals and efficiency in detail. Here is what the numbers say across three scenarios.</p>

            <h3 class="font-bold text-[#4A2C2C] text-xl mt-8 mb-3">Lossy: JPEG XL vs JPEG</h3>
            <p class="mb-4">For typical photographic content, a lossy JPEG XL re-encode at comparable perceptual quality produces files <strong class="text-[#4A2C2C]">30–55% smaller than legacy JPEG</strong>. The upper end reflects high-effort encoder settings; a practical web preset sits closer to 35–45%. <a href="https://storage.googleapis.com/avif-comparison/index.html" target="_blank" rel="noopener noreferrer" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">Google's Image Coding Comparisons tool</a> shows JPEG XL consistently outperforming JPEG and WebP at equivalent subjective quality across a broad range of photographic test sets.</p>
            <p class="mb-4">JPEG XL vs AVIF is tighter. Cloudinary image researcher Jon Sneyers, analysing the same benchmarks with practical encode presets (JXL s6 vs AVIF s7), found that 9 out of 13 quality metrics favoured JPEG XL on photographic datasets — a useful read on a competitive comparison.</p>

            <h3 class="font-bold text-[#4A2C2C] text-xl mt-8 mb-3">Lossless: JPEG XL vs PNG</h3>
            <p class="mb-4">PNG has been the default lossless format for web graphics for decades. JPEG XL lossless is a meaningful upgrade. Community benchmarking across hundreds of images found that JPEG XL lossless at effort=1 (very fast) produced files roughly <strong class="text-[#4A2C2C]">19–25% smaller than PNG</strong> at PNG's own maximum compression, while encoding around 150 times faster. At higher effort settings, JPEG XL lossless can be 40–50% smaller than PNG — at the cost of much slower encoding. For archival use where you run the encoder once and store the result, high-effort settings are often worth it. JPEG XL also supports full transparency in both lossy and lossless modes, making it a viable PNG replacement for logos, sprites, and UI assets.</p>

            <h3 class="font-bold text-[#4A2C2C] text-xl mt-8 mb-3">Lossless JPEG archiving</h3>
            <p class="mb-4">This is JPEG XL's most distinctive feature. Existing JPEG files can be transcoded into a JXL container that allows exact byte-for-byte reconstruction of the original JPEG. The <a href="https://infoscience.epfl.ch/nanna/record/277420/files/Submitted%20manuscript.pdf" target="_blank" rel="noopener noreferrer" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">EPFL/Google benchmarking paper</a> puts the average storage reduction for this reversible transcoding at <strong class="text-[#4A2C2C]">22%</strong> across broad test sets, with Apple's WWDC documentation noting up to 60% reduction on some photographic datasets at higher settings.</p>
            <p>For large JPEG archives — e-commerce product catalogs, photo libraries, stock collections — converting JPEG to JXL in lossless-transcode mode gives you 20–40% storage savings while preserving the ability to reconstruct the original JPEG exactly. That is a hard-to-argue-with value proposition for archival pipelines, independent of browser support.</p>
        </section>

        <section id="jpeg-to-jxl" class="scroll-mt-24">
            <SectionHeading>Converting JPEG to JPEG XL</SectionHeading>
            <p class="mb-4">Converting JPEG to JPEG XL has two distinct modes, and which one is right depends on your goal.</p>
            <p class="mb-4"><strong class="text-[#4A2C2C]">Lossless transcode mode</strong> wraps the original JPEG data inside a JXL container with no re-encoding. You retain bit-for-bit reconstructability of the source file, and you typically see 20–30% file size reduction. This is the right choice for archival use and for any pipeline where you might need the original JPEG again downstream — legacy systems, social preview generation, ad networks.</p>
            <p class="mb-4"><strong class="text-[#4A2C2C]">Lossy re-encode mode</strong> fully decodes the JPEG and re-encodes to JXL at the target quality. You get larger savings — 40–60% vs the original JPEG at similar perceptual quality — but you are making a generation copy. If the source JPEG was already lossy, you are stacking artifacts. This is the right choice when you have access to the raw source (a TIFF, a RAW export, or a lossless master) and are producing a fresh JXL for serving.</p>
            <p class="mb-4">For web delivery in mid-2026, JPEG-to-JXL primarily serves Safari users and Chrome users who have enabled the flag. The baseline JPEG remains the universal fallback.</p>
            <p>You can convert to JPEG XL directly at <a href="/jpg-to-jpegxl" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app/jpg-to-jpegxl</a> — describe what you need in plain English, or drop your files and let Magic Flow choose the right settings. For batch workflows, the CLI and MCP routes are covered in the <a href="#mochify-workflow" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">Mochify Workflow section</a> below.</p>
        </section>

        <section id="png-to-jxl" class="scroll-mt-24">
            <SectionHeading>Converting PNG to JPEG XL</SectionHeading>
            <p class="mb-4">PNG is overused as a web format because it is the default export from many design tools, not because it is the right choice for most images. JPEG XL gives you two options to improve on it.</p>
            <p class="mb-4">For <strong class="text-[#4A2C2C]">photographic PNGs</strong> (PNG exports of photos, which are common from Figma and similar tools), lossy JPEG XL typically cuts file size by 60–80% at similar visual quality. The format's VarDCT mode handles photographic content the same way AVIF or WebP do — much better than PNG's lossless model.</p>
            <p class="mb-4">For <strong class="text-[#4A2C2C]">graphics, illustrations, UI elements, and transparent assets</strong>, JPEG XL lossless is the right mode. You keep the transparency, the sharp edges, and the exact pixel data. The compression win over PNG (19–50% depending on encoder effort) is a genuine improvement, not a trade-off.</p>
            <p class="mb-4">In practice, the main reason to convert PNG to JXL today is archival compression and the Safari audience. For web delivery, you would pair the JXL source with a WebP or PNG fallback in a <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">&lt;picture&gt;</code> element. For pipelines using Fastly Image Optimizer or a JXL-aware CDN, the CDN can negotiate the format automatically based on the client <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">Accept</code> header.</p>
            <p>Convert PNG to JPEG XL at <a href="/solutions/png-to-jxl" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app/solutions/png-to-jxl</a>.</p>
        </section>

        <section id="avif-to-jxl" class="scroll-mt-24">
            <SectionHeading>Converting AVIF to JPEG XL</SectionHeading>
            <p class="mb-4">Converting AVIF to JPEG XL for current web delivery does not make much sense on compression grounds alone — both formats are competitive, and AVIF has far broader browser support across Chrome, Firefox, Safari, and Edge. You would be trading ecosystem compatibility for marginal compression gains.</p>
            <p class="mb-4">The case for AVIF-to-JXL conversion is narrower and more specific. For <strong class="text-[#4A2C2C]">HDR and wide-gamut archival</strong>, AVIF supports HDR but tops out at 12-bit depth. JPEG XL goes to 32-bit. If you are building a long-term archive from AVIF masters, JPEG XL is the stronger archival target for high-bit-depth content. For <strong class="text-[#4A2C2C]">consolidating a mixed archive</strong>, if you have a mix of JPEGs, PNGs, and AVIFs and want a single high-quality master format for storage, JPEG XL can ingest all of them. The masters become JXL; AVIF, WebP, and JPEG derivatives are generated from those masters for web delivery. And for <strong class="text-[#4A2C2C]">pipeline readiness</strong>, building AVIF-to-JXL into your workflow now means you are ready to serve JXL when Chrome and Firefox ship it by default — you just flip the <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">&lt;source&gt;</code> priority.</p>
            <p>Convert AVIF to JPEG XL at <a href="/avif-to-jpegxl" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app/avif-to-jpegxl</a>.</p>
        </section>

        <section id="fallback-pattern" class="scroll-mt-24">
            <SectionHeading>The Fallback Pattern: Serving JXL Safely on the Web</SectionHeading>
            <p class="mb-4">The canonical pattern for JPEG XL on the web uses the HTML <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">&lt;picture&gt;</code> element. Browsers evaluate <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">&lt;source&gt;</code> elements in order and select the first format they support, falling back to the <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">&lt;img&gt;</code> tag for everything else.</p>

            <CodeBlock filename="HTML" code={pictureCode} />

            <p class="mb-4">This stack gives you JXL for Safari and Chrome-with-flag-enabled, AVIF for Chrome/Firefox/Edge, WebP for older clients, and JPEG for everything else.</p>
            <p class="mb-4"><strong class="text-[#4A2C2C]">Always include <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">width</code> and <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">height</code> attributes</strong> on the <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">&lt;img&gt;</code> tag. Browsers need these to reserve layout space before the image loads. Omitting them causes cumulative layout shift (CLS), which affects your Core Web Vitals score. See our guide on <a href="/guides/optimizing-hero-images" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">optimizing hero images for web performance</a> for more on this.</p>
            <p class="mb-4"><strong class="text-[#4A2C2C]">Do not serve JPEG XL as your only format.</strong> A standalone <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">&lt;img src="image.jxl"&gt;</code> will display a broken image in Chrome, Firefox, and Edge for the majority of users who have not enabled the flag. This is the current production reality.</p>
            <p><strong class="text-[#4A2C2C]">CDN-level negotiation</strong> is cleaner than HTML for high-traffic sites. If you are on Fastly Image Optimizer, you can configure it to auto-negotiate JXL based on the <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">Accept</code> header, so the right format is served without changing your image markup. Cloudflare and Netlify do not yet offer this for JXL.</p>
        </section>

        <section id="when-not-to-use" class="scroll-mt-24">
            <SectionHeading>When Not to Use JPEG XL Yet</SectionHeading>
            <p class="mb-4">JPEG XL is production-ready in specific contexts and experimental in others. Being clear about the difference saves headaches.</p>
            <p class="mb-4"><strong class="text-[#4A2C2C]">Production-ready with fallbacks:</strong> photography portfolios and creative tools serving a predominantly macOS/iOS audience (Safari 17 and above handles JXL natively); internal archival and storage pipelines where browser support is irrelevant; sites running on Fastly Image Optimizer, which can serve JXL to capable clients automatically; HDR photography and retina-quality sites where the 32-bit depth is a real advantage.</p>
            <p class="mb-4"><strong class="text-[#4A2C2C]">Wait or test carefully:</strong> WordPress and Shopify sites — neither platform exposes JXL in its standard delivery stack. Mass-market web apps where a broken image in Chrome is a business problem. Any pipeline that feeds third-party systems such as social previews, email clients, or ad networks, which mostly do not understand JXL and will display nothing.</p>

            <InfoBox type="note" title="The right mental model for 2026">
                JPEG XL is where WebP was around 2018. Strong format, real compression wins, but meaningful adoption gaps that require engineering around. The difference is that the archival and lossless-JPEG-transcode use cases are valuable today, independent of where browser support lands.
            </InfoBox>
        </section>

        <section id="mochify-workflow" class="scroll-mt-24 bg-gradient-to-b from-[#FFF5F7] to-white border border-pink-100 rounded-3xl p-8">
            <SectionHeading>Mochify Workflow: Convert to JPEG XL in One Prompt</SectionHeading>
            <p class="mb-6">Mochify handles JPEG XL conversion across all surfaces — the web app, the CLI, both MCP servers, and the REST API. For batches up to 25 files (Seller or Pro) or 3 files (Free), describe what you need in plain English and Magic Flow applies the right settings automatically.</p>

            <ol class="space-y-6">
                {#each [
                    {
                        n: '1',
                        title: 'Describe the task in plain English.',
                        body: 'Tell Mochify what you want and Magic Flow works out the settings. Example prompts: "Convert these JPEGs to JPEG XL, keep quality high", "Convert to JXL lossless for archival", or "Batch convert these PNGs to JPEG XL and reduce file size."'
                    },
                    {
                        n: '2',
                        title: 'Mochify converts the files.',
                        body: 'Magic Flow (powered by Mistral Small 4) parses the prompt, resolves the appropriate format settings, and the C++ engine executes the conversion. Batches of up to 25 files on paid plans, 3 on Free.'
                    },
                    {
                        n: '3',
                        title: 'Download and integrate.',
                        body: 'The converted JXL files come back ready to slot into your picture stack or archival storage. No manual settings panel, no quality slider — just a description of the outcome you need.'
                    },
                ] as step}
                    <li class="flex gap-5 items-start">
                        <span class="w-8 h-8 shrink-0 bg-[#F06292] text-white rounded-full flex items-center justify-center font-black text-sm">{step.n}</span>
                        <div class="pt-0.5">
                            <strong class="block text-[#4A2C2C] font-bold mb-1">{step.title}</strong>
                            <span class="text-[#6C3F31]">{step.body}</span>
                        </div>
                    </li>
                {/each}
            </ol>

            <div class="mt-8">
                <InfoBox type="tip" title="Developer tip">
                    Using the local MCP server (<code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-sm border border-pink-100">mochify serve</code>) via Claude Desktop or a compatible agent? It returns file paths and metadata rather than image bytes, keeping your agent context clean for large batches. See our guide on <a href="/guides/how-the-mochify-mcp-server-works" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">how the Mochify MCP server works</a> for setup details.
                </InfoBox>
            </div>

            <p class="mt-6 text-sm text-[#875F42] border-t border-pink-100 pt-5 leading-relaxed">
                <strong class="text-[#6C3F31]">Privacy note:</strong> Images are streamed into server RAM at <code class="bg-pink-50 text-[#F06292] px-1.5 py-0.5 rounded font-mono text-xs border border-pink-100">api.mochify.app</code> for encoding and the originals are wiped immediately — no disk writes, no logs containing file data. The compressed JXL output comes back to you without the source being stored. For the hosted MCP server, the compressed output is held briefly in a pickup store (five-minute TTL) so the short-lived download URL can resolve; the local CLI and local MCP server skip the pickup store entirely and are zero-retention end-to-end.
            </p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24 bg-[#FFF5F7] border border-pink-100 rounded-3xl p-8">
            <SectionHeading>JPEG XL Quick-Reference Cheat Sheet</SectionHeading>

            <ScrollableTable class="mt-6">
                <table class="w-full text-sm border-collapse">
                    <thead>
                        <tr class="bg-[#FFF0F5]">
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border border-pink-100">Scenario</th>
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border border-pink-100">Recommended mode</th>
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border border-pink-100">Expected size vs original</th>
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border border-pink-100">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            ['Archiving existing JPEGs', 'Lossless transcode (JPEG-in-JXL)', '20–30% smaller', 'Exact JPEG reconstruction preserved'],
                            ['Web photos, new encode', 'Lossy JXL from lossless master', '35–55% smaller than JPEG', 'Pair with AVIF/WebP/JPEG fallbacks'],
                            ['PNG graphics / UI / logos', 'Lossless JXL', '19–50% smaller than PNG', 'Transparency supported'],
                            ['Photographic PNGs', 'Lossy JXL', '60–80% smaller than PNG', 'Only if quality loss is acceptable'],
                            ['AVIF archives (HDR)', 'Lossless JXL', 'Comparable size', 'Use for long-term masters; serve AVIF for web'],
                            ['WordPress / Shopify delivery', 'Avoid JXL as primary', '—', 'Platform stacks optimised for WebP/AVIF'],
                            ['Safari-primary audience', 'JXL as first source', 'Best quality per byte', 'Always include AVIF/WebP/JPEG fallback'],
                            ['Chrome/Firefox general delivery', 'JXL behind picture, not primary', '—', 'Not default-on in Chrome or Firefox mid-2026'],
                        ] as row}
                            <tr class="even:bg-[#FFFAFC]">
                                {#each row as cell}
                                    <td class="px-4 py-3 border border-pink-100 text-[#6C3F31] align-top">{cell}</td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </ScrollableTable>

            <h3 class="font-bold text-[#4A2C2C] text-lg mt-10 mb-4">Browser support summary (mid-2026)</h3>
            <ScrollableTable>
                <table class="w-full text-sm border-collapse">
                    <thead>
                        <tr class="bg-[#FFF0F5]">
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border border-pink-100">Browser</th>
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border border-pink-100">JPEG XL support</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            ['Safari 17+', 'Native, no flag required'],
                            ['Chrome 145+ / Canary', 'Behind chrome://flags/#enable-jxl-image-format'],
                            ['Firefox Nightly', 'Behind Firefox Labs toggle'],
                            ['Firefox stable, Edge, most Android', 'Not supported'],
                            ['Global coverage', '~14–15%'],
                        ] as row}
                            <tr class="even:bg-[#FFFAFC]">
                                {#each row as cell}
                                    <td class="px-4 py-3 border border-pink-100 text-[#6C3F31] align-top">{cell}</td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

        <section id="faq" class="scroll-mt-24">
            <SectionHeading>FAQ</SectionHeading>
            <div class="space-y-3 mt-6">
                {#each [
                    {
                        q: "Is JPEG XL better than AVIF?",
                        a: "For photographic content at practical encode speeds, JPEG XL is competitive with or slightly ahead of AVIF on compression. The more important factor in 2026 is browser support: AVIF has roughly 95–97% global coverage; JPEG XL has around 14–15%. Use AVIF for web delivery and consider JPEG XL for archival masters or Safari-primary audiences."
                    },
                    {
                        q: "Does Chrome support JPEG XL?",
                        a: "Yes, but not by default. Chrome 145 and later Canary builds ship a Rust-based JXL decoder, but it is gated behind chrome://flags/#enable-jxl-image-format. Stable Chrome does not display JXL images for general users as of mid-2026. Our full breakdown of the Chrome 145 situation covers the timeline in more detail."
                    },
                    {
                        q: "Can I convert a JPEG to JPEG XL without losing any quality?",
                        a: "Yes. JPEG XL's lossless transcode mode wraps the existing JPEG data inside a JXL container with no re-encoding. The resulting file is smaller (typically 20–30%) and allows exact byte-for-byte reconstruction of the original JPEG. This is different from a lossy re-encode, which improves compression further but creates a generation copy."
                    },
                    {
                        q: "What file types can I convert to JPEG XL?",
                        a: "JPEG, PNG, WebP, AVIF, and HEIC all convert cleanly to JXL. Each has a slightly different optimal strategy: lossless transcode for JPEGs, lossless JXL for PNG graphics, and archival-focused conversions for AVIF. Mochify handles all of these formats on upload."
                    },
                    {
                        q: "Should I use JPEG XL for my Shopify store?",
                        a: "Not for web delivery in 2026. Shopify's CDN and upload pipeline are built around JPEG, PNG, and WebP; JXL files are not in the supported upload list. For e-commerce product images, AVIF with a WebP fallback is the highest-impact format switch you can make today."
                    },
                    {
                        q: "Does JPEG XL support transparency?",
                        a: "Yes, in both lossy and lossless modes. This makes it a potential PNG replacement for transparent UI elements, logos, and sprites — at least for platforms and CDNs that support it. For most web delivery today, WebP lossless remains the practical choice for transparent assets."
                    },
                    {
                        q: "How do I serve JPEG XL with a fallback for unsupported browsers?",
                        a: "Use the HTML picture element with a source typed image/jxl as the first source, followed by AVIF, WebP, and a JPEG img baseline. Browsers evaluate sources top to bottom and pick the first they support. See the fallback pattern section above for the full markup example."
                    },
                    {
                        q: "Is JPEG XL good for archiving photos?",
                        a: "It is arguably the best format for long-term photographic archival right now. 32-bit depth, HDR support, lossless JPEG transcoding, and strong compression make a compelling combination. For large archives of existing JPEGs, the lossless transcode mode alone — 20–30% smaller with exact reconstruction — is reason enough to run a conversion."
                    },
                ] as faq}
                    <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] list-none select-none text-base">
                            <span>{faq.q}</span>
                            <span class="text-[#7E685E] transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </summary>
                        <div class="px-6 pb-6 text-base text-[#6C3F31] leading-relaxed">
                            {faq.a}
                        </div>
                    </details>
                {/each}
            </div>
        </section>

        <aside class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-8">
            <p class="text-[#6C3F31] leading-relaxed mb-5">Ready to convert your images to JPEG XL? Drop your files at <strong class="text-[#4A2C2C]">mochify.app</strong> and describe what you need in plain English — something like <em>"convert these to JPEG XL for archival, keep full quality"</em> or <em>"batch convert to JXL and compress for web."</em> No settings panel, no plugins, no signup required for up to 3 files.</p>
            <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 no-underline text-base">
                Try it free
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </aside>

        <RelatedGuides guides={related} />

    </div>
</article>
