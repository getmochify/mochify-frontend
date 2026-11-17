<script lang="ts">
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import CodeCard from '$lib/components/guide-demo/CodeCard.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "Converting Images to JPEG XL: The Practical Guide for 2026",
        description: "JPEG XL benchmarks, every conversion path (JPEG, PNG, AVIF to JXL), browser support after Chrome 155, and how to serve JXL with picture fallbacks.",
        category: "Image Formats",
        readTime: "16 min read",
        datePublished: "June 26, 2026",
        lastUpdated: "November 17, 2026"
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
            desc: "What Chrome 145 shipped behind a flag, and the Chrome 155 release that turned it on."
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

    const toc = [
                    { n: '01', id: 'what-is-jpeg-xl', label: 'What JPEG XL actually is (and why the name is confusing)' },
                    { n: '02', id: 'browser-support', label: 'Browser and ecosystem support in 2026' },
                    { n: '03', id: 'compression-benchmarks', label: 'Compression benchmarks: how much smaller?' },
                    { n: '04', id: 'encoder-settings', label: 'Which encoder and settings? What we measured' },
                    { n: '05', id: 'jpeg-to-jxl', label: 'Converting JPEG to JPEG XL' },
                    { n: '06', id: 'png-to-jxl', label: 'Converting PNG to JPEG XL' },
                    { n: '07', id: 'avif-to-jxl', label: 'Converting AVIF to JPEG XL' },
                    { n: '08', id: 'fallback-pattern', label: 'The fallback pattern: serving JXL safely on the web' },
                    { n: '09', id: 'when-not-to-use', label: 'When not to use JPEG XL' },
                    { n: '10', id: 'mochify-workflow', label: 'Mochify Workflow: convert to JPEG XL in one prompt' },
                    { n: '11', id: 'cheat-sheet', label: 'JPEG XL Quick-Reference Cheat Sheet' },
                    { n: '12', id: 'faq', label: 'FAQ' },
                ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/converting-images-to-jpeg-xl" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Converting Images to JPEG XL: The Practical Guide for 2026",
        "description": "JPEG XL benchmarks, every conversion path (JPEG, PNG, AVIF to JXL), browser support after Chrome 155, and how to serve JXL with picture fallbacks.",
        "url": "https://mochify.app/guides/converting-images-to-jpeg-xl",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/converting-images-to-jpeg-xl"
        },
        "image": "https://mochify.app/og/guides-converting-images-to-jpeg-xl.png",
        "datePublished": "2026-06-26T12:00:00+00:00",
        "dateModified": "2026-11-17T12:00:00+00:00",
        "inLanguage": "en",
        "author": { "@type": "Organization", "name": "Mochify Engineering Team", "url": "https://mochify.app" },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app",
            "logo": { "@type": "ImageObject", "url": "https://mochify.app/logo.png" }
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
                "acceptedAnswer": { "@type": "Answer", "text": "For photographic content at practical encode speeds, JPEG XL is competitive with or slightly ahead of AVIF on compression. The deciding factor used to be browser support: AVIF has roughly 95–97% global coverage, while JPEG XL sat near 15% until Chrome 155 and Firefox 158 shipped it by default in October 2026. Use AVIF as the broad-reach format, add JPEG XL as the first source where it is smaller or where you need lossless or progressive loading, and keep JPEG XL for archival masters." }
            },
            {
                "@type": "Question",
                "name": "Does Chrome support JPEG XL?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. Chrome 155, released on October 6, 2026, decodes JPEG XL by default on desktop and Android using the Rust jxl-rs decoder. Chrome 145 to 154 contain the decoder but keep it behind chrome://flags/#enable-jxl-image-format, so a visitor on an older install still needs a fallback. Our guide to JPEG XL in Chrome and what changes now has the dated per-browser table; the Chrome 145 explainer covers the earlier flag-only step." }
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
                "acceptedAnswer": { "@type": "Answer", "text": "Use the HTML picture element with a source typed image/jxl as the first source, followed by AVIF, WebP, and a JPEG img baseline. Browsers evaluate sources top to bottom and pick the first they support. See the fallback pattern section above for the full markup example, and our picture element guide for the source-order rules and the dated support figures." }
            },
            {
                "@type": "Question",
                "name": "Is JPEG XL good for archiving photos?",
                "acceptedAnswer": { "@type": "Answer", "text": "It is arguably the best format for long-term photographic archival right now. 32-bit depth, HDR support, lossless JPEG transcoding, and strong compression make a compelling combination. For large archives of existing JPEGs, the lossless transcode mode alone saves 20–30% with exact reconstruction preserved." }
            },
            {
                "@type": "Question",
                "name": "Which JPEG XL encoder and settings should I use?",
                "acceptedAnswer": { "@type": "Answer", "text": "For your own pipeline with libjxl, keep the default effort of 7 and set quality with distance, where 1.0 is meant to look identical to the original. In our 44-image test, effort 9 came out within 1% overall and encoded five times slower. A newer Rust encoder, jixel, made files 21% smaller at the same measured quality on its Medium setting, with the biggest gains on screenshots and graphics, but its default Fast setting made screenshots larger. If you convert with a tool rather than a pipeline, the tool picks the settings for you." }
            }
        ]
    }
    </script>
    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/converting-images-to-jpeg-xl"
        description={metadata.description}
        datePublished="2026-06-26"
        dateModified="2026-11-17"
    />
</svelte:head>

<article
	class="relative mx-auto w-full max-w-3xl px-5 pt-6 text-lg leading-relaxed text-cocoa-deep sm:px-6 md:px-0 md:pt-0"
>
	<div class="hero-wash" aria-hidden="true"></div>

    <header class="mb-12 md:mb-14">
		<p class="mt-0 mb-3 text-xs font-bold tracking-[0.18em] text-mochi-pink uppercase">
			{metadata.category}
		</p>
		<h1
			class="mb-0 text-3xl leading-[1.1] font-black tracking-tight text-cocoa-ink md:text-[2.75rem]"
		>
			<AccentTitle title={metadata.title} accent="JPEG XL" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-mochi-pink to-mochi-pink-soft"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-cocoa-milk">
			{metadata.readTime} · Published {metadata.datePublished} · Updated {metadata.lastUpdated}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-cocoa-deep opacity-90">
            JPEG XL promises better compression than JPEG, WebP, and often AVIF, lossless JPEG archiving, HDR support, and progressive rendering. As of October 2026 it decodes by default in Chrome 155 and later and in Firefox 158 and later, and in Safari 17 and later for still images; the catch is that installed browsers, Edge and everything outside a browser lag behind, so a fallback still matters. This guide covers the benchmarks, every meaningful conversion path, honest browser support, and how to set up a <code class="bg-pink-50 text-mochi-pink px-2 py-px rounded font-mono text-sm border border-pink-100">&lt;picture&gt;</code> fallback that actually works.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-mochi-blush/70 p-6">
            <p class="m-0 text-base leading-relaxed text-cocoa-deep">Published {metadata.datePublished} by the <strong class="text-cocoa-deep">Mochify Engineering Team</strong>. Covers JPEG, PNG, and AVIF-to-JXL workflows, with compression data from Google's image coding benchmarks and our own 44-image encoder test, and practical guidance on when JXL is and isn't production-ready.</p>
        </div>
    </header>

    <section>
            <GuideTOC items={toc} heading="What's in This Guide" />
        </section>

    <div class="space-y-12">

        <section id="what-is-jpeg-xl" class="scroll-mt-24">
            <SectionHeading>What JPEG XL Actually Is (and Why the Name Is Confusing)</SectionHeading>
            <p class="mb-4">JPEG XL (extension <code class="bg-pink-50 text-mochi-pink px-2 py-px rounded font-mono text-sm border border-pink-100">.jxl</code>) is not a direct update to classic JPEG the way that phrasing implies. It is a completely new codec, standardized by the JPEG committee as ISO 18181, with a different architecture underneath. The "JPEG" in the name refers to the committee, not the format family.</p>
            <p class="mb-4">Two properties make JXL genuinely unusual among modern formats. First, it can losslessly transcode an existing JPEG into a JXL container that is smaller but still allows exact byte-for-byte reconstruction of the original JPEG - you shrink the file without losing the source. Second, it supports up to 32-bit per channel color depth and HDR (PQ and HLG), making it the strongest archival format in this comparison for professional photography workflows.</p>
            <p>Compare that to AVIF, which tops out at 12-bit depth. Both WebP and AVIF are strong choices for web delivery today, but for long-term archival of high-bit-depth stills, JPEG XL's spec headroom is a real advantage.</p>
        </section>

        <section id="browser-support" class="scroll-mt-24">
            <SectionHeading>Browser and Ecosystem Support in 2026</SectionHeading>
            <p class="mb-4">JPEG XL has been natively supported in <strong class="text-cocoa-ink">Safari 17 and above</strong> (announced at WWDC 2023) for still images, covering all up-to-date macOS and iOS devices; Safari does not decode animated JXL or render progressively. Until October 2026 that Safari share, roughly 14–17% of global browsing, was the whole installed base, which is why this guide treated JXL as an Apple-audience format. That changed on October 6.</p>
            <p class="mb-4">Chrome's history with JXL is worth knowing because it explains where things stand now. Chromium shipped early JPEG XL support behind a flag in versions 91–109, then <a href="https://caniuse.com/jpegxl" target="_blank" rel="noopener noreferrer">removed it entirely in Chrome 110</a> citing "lack of ecosystem momentum." In late 2025 and early 2026, Google reversed course: a Rust-based JXL decoder (<code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">jxl-rs</code>) was merged into Chromium's rendering pipeline. Chrome 145 to 154 exposed it via <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">chrome://flags/#enable-jxl-image-format</code>, disabled by default. Chrome 155, released on October 6, 2026, enables it by default on Windows, macOS, Linux, ChromeOS and Android, with no flag; Google's announcement, "Shipping JPEG XL in Chrome", explains the Rust decoder and the memory-safety reasoning. Installed browsers take weeks to update, so for the rest of 2026 a share of Chrome traffic is still on 152 to 154.</p>
            <p class="mb-4">Firefox enables JPEG XL by default from Firefox 158, released on October 13, 2026, with animation and progressive display; Firefox 157 does not, despite Mozilla's August intent to ship naming it. Edge, Samsung Internet and the other Chromium-based browsers had not shipped the change as of October 7, 2026, and Microsoft has made no statement. Check caniuse.com/jpegxl for the live row before you drop a fallback.</p>

            <GlassInfoBox type="tip" title="Practical takeaway">
                Use JPEG XL as an enhancement layer served only to capable clients, with a robust fallback for everyone else. The <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">&lt;picture&gt;</code> element is your main tool - covered in the <a href="#fallback-pattern">fallback pattern section</a> below.
            </GlassInfoBox>

            <p class="mt-4"><strong class="text-cocoa-ink">CDN and platform support</strong> follows the same split. Fastly Image Optimizer supports JPEG XL as both input and output. Cloudflare Images and Netlify Image CDN do not yet support JXL as an output format. Imgix accepts JXL as input but only serves AVIF or WebP as output. Major CMSes - WordPress core and Shopify - do not expose JXL in their upload or delivery pipelines: WordPress 7.1's client-side media pipeline outputs JPEG, PNG, WebP, AVIF and GIF, and Shopify's accepted upload formats are JPEG, PNG, GIF, HEIC and WebP. Browser support arriving does not change either of those until the platforms add an encoder.</p>
        </section>

        <section id="compression-benchmarks" class="scroll-mt-24">
            <SectionHeading>Compression Benchmarks: How Much Smaller?</SectionHeading>
            <p class="mb-4">JPEG XL's compression efficiency is well-documented in peer-reviewed testing. The <a href="https://research.google/pubs/jpeg-xl-next-generation-image-compression-architecture-and-coding-tools/" target="_blank" rel="noopener noreferrer">JPEG XL next-generation image compression architecture paper</a> from Google covers the codec's design goals and efficiency in detail. Here is what the numbers say across three scenarios.</p>

            <h3 class="font-bold text-cocoa-ink text-xl mt-8 mb-3">Lossy: JPEG XL vs JPEG</h3>
            <p class="mb-4">For typical photographic content, a lossy JPEG XL re-encode at comparable perceptual quality produces files <strong class="text-cocoa-ink">30–55% smaller than legacy JPEG</strong>. The upper end reflects high-effort encoder settings; a practical web preset sits closer to 35–45%. <a href="https://storage.googleapis.com/avif-comparison/index.html" target="_blank" rel="noopener noreferrer">Google's Image Coding Comparisons tool</a> shows JPEG XL consistently outperforming JPEG and WebP at equivalent subjective quality across a broad range of photographic test sets.</p>
            <p class="mb-4">JPEG XL vs AVIF is tighter. Cloudinary image researcher Jon Sneyers, analyzing the same benchmarks with practical encode presets (JXL s6 vs AVIF s7), found that 9 out of 13 quality metrics favoured JPEG XL on photographic datasets - a useful read on a competitive comparison.</p>

            <h3 class="font-bold text-cocoa-ink text-xl mt-8 mb-3">Lossless: JPEG XL vs PNG</h3>
            <p class="mb-4">PNG has been the default lossless format for web graphics for decades. JPEG XL lossless is a meaningful upgrade. Community benchmarking across hundreds of images found that JPEG XL lossless at effort=1 (very fast) produced files roughly <strong class="text-cocoa-ink">19–25% smaller than PNG</strong> at PNG's own maximum compression, while encoding around 150 times faster. At higher effort settings, JPEG XL lossless can be 40–50% smaller than PNG - at the cost of much slower encoding. For archival use where you run the encoder once and store the result, high-effort settings are often worth it. JPEG XL also supports full transparency in both lossy and lossless modes, making it a viable PNG replacement for logos, sprites, and UI assets. For a measured example on one real macOS screenshot, 46% smaller with every pixel checked, see <a href="/guides/jxl-vs-png-for-screenshots">JPEG XL vs PNG for screenshots</a>. For how lossless JPEG XL compares with lossless WebP, PNG and AVIF across six image types, and when lossless is the wrong choice altogether, see <a href="/guides/lossless-image-formats">which lossless image format to use</a>.</p>

            <h3 class="font-bold text-cocoa-ink text-xl mt-8 mb-3">Lossless JPEG archiving</h3>
            <p class="mb-4">This is JPEG XL's most distinctive feature. Existing JPEG files can be transcoded into a JXL container that allows exact byte-for-byte reconstruction of the original JPEG. The <a href="https://doi.org/10.1117/12.2556264" target="_blank" rel="noopener noreferrer">EPFL/Google benchmarking paper</a> puts the average storage reduction for this reversible transcoding at <strong class="text-cocoa-ink">22%</strong> across broad test sets, with Apple's WWDC documentation noting up to 60% reduction on some photographic datasets at higher settings.</p>
            <p>For large JPEG archives - e-commerce product catalogs, photo libraries, stock collections - converting JPEG to JXL in lossless-transcode mode gives you 20–40% storage savings while preserving the ability to reconstruct the original JPEG exactly. That is a hard-to-argue-with value proposition for archival pipelines, independent of browser support.</p>
        </section>

        <section id="encoder-settings" class="scroll-mt-24">
            <SectionHeading>Which Encoder and Settings? What We Measured</SectionHeading>
            <p class="mb-4">The encoder you use, and how hard you let it work, changes JPEG XL file sizes almost as much as the format choice does. In our November 2026 run on 44 images, libjxl's default (effort 7) was the right baseline, effort 9 saved nothing on photos, and a newer Rust encoder, jixel, made files 21% smaller at the same measured quality on its Medium setting while taking about 45% longer to encode.</p>
            <p class="mb-4">Most people never see these settings, because a converter picks them. They matter once you run your own pipeline, or when two tools give you very different file sizes for "the same" JPEG XL.</p>

            <h3 class="font-bold text-cocoa-ink text-xl mt-8 mb-3">Three words this section uses</h3>
            <ul class="list-disc pl-6 mb-4 space-y-3">
                <li><strong class="text-cocoa-ink">Encoder:</strong> the program that turns pixels into a .jxl file. Any conforming decoder reads every JPEG XL file the same way, but two encoders can make very different files from the same picture. <a href="https://github.com/libjxl/libjxl" target="_blank" rel="noopener noreferrer">libjxl</a> is the reference encoder (its command-line tool is <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">cjxl</code>); <a href="https://crates.io/crates/jixel" target="_blank" rel="noopener noreferrer">jixel</a> is a newer encoder written in Rust, used as a library from code.</li>
                <li><strong class="text-cocoa-ink">Effort:</strong> how long the encoder searches for a smaller file. In libjxl it runs from 1 (fastest) to 10, and the default is 7. More effort costs encoding time; it does not lower quality.</li>
                <li><strong class="text-cocoa-ink">Distance:</strong> the quality target. 0 is lossless, 1.0 is meant to look identical to the original, and higher numbers give smaller, softer files. Two encoders do not mean the same thing by the same number, which is why we compared files at equal measured quality, never at equal settings.</li>
            </ul>

            <h3 class="font-bold text-cocoa-ink text-xl mt-8 mb-3">How we tested</h3>
            <p class="mb-4">We encoded 44 images with libjxl 0.13.0 at efforts 1, 3, 7 and 9, with libjxl 0.11.2 at effort 7 for comparison, and with jixel 0.5.10 at its Fast (default), Medium and Slow speeds: 24 photos from the Kodak test set, 9 UI screenshots, 6 charts and line drawings, and 5 images with transparency. Each image went through six quality levels, was decoded with libjxl's <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">djxl</code>, and was scored against the original with three quality metrics: SSIMULACRA2, Butteraugli and <a href="https://kornel.ski/dssim" target="_blank" rel="noopener noreferrer">DSSIM</a>. For every image we then compared file sizes at the same score across the range both encoders reached.</p>
            <p class="mb-4">The metric matters. jixel tunes its output against SSIMULACRA2, and libjxl's distance scale is built on Butteraugli, so the figures below use DSSIM, which belongs to neither project. All three metrics pointed the same way. Everything ran on one CPU thread on a two-core cloud machine, with transparency kept lossless on both encoders. The screenshots, charts and transparent images are small sets made for this test (the nine screenshots are six pages, three of them also captured at double resolution), so read their percentages as a direction, not a precise figure. The 24 photos are the firmer result.</p>

            <h3 class="font-bold text-cocoa-ink text-xl mt-8 mb-3">The results: file size at equal quality</h3>
            <p class="mb-4">Each figure is the file size against libjxl 0.13.0 at effort 7 for the same DSSIM score. Negative means smaller.</p>
            <GuideTable class="my-6">
                <table>
                    <thead>
                        <tr>
                            <th>Setting</th>
                            <th>Photos</th>
                            <th>Screenshots</th>
                            <th>Charts and line art</th>
                            <th>Transparent</th>
                            <th>All 44</th>
                            <th>Encode speed (MP/s, one thread)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            ['libjxl effort 1', '+9%', '+98%', '+22%', '+49%', '+30%', '15.9'],
                            ['libjxl effort 3', '0%', '+63%', '0%', '+28%', '+14%', '14.5'],
                            ['libjxl effort 7 (default)', 'baseline', 'baseline', 'baseline', 'baseline', 'baseline', '2.1'],
                            ['libjxl effort 9', '0%', '+11%', '0%', '-10%', '+1%', '0.43'],
                            ['jixel Fast (default)', '-13%', '+40%', '-39%', '+14%', '-6%', '3.3'],
                            ['jixel Medium', '-14%', '-13%', '-57%', '-15%', '-21%', '1.45'],
                            ['jixel Slow', '-17%', '-58%', '-63%', '-32%', '-36%', '0.14'],
                        ] as row}
                            <tr>
                                {#each row as cell}
                                    <td>{cell}</td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </GuideTable>
            <p class="mb-4">What the table says, in order of how much it should change what you do:</p>
            <ul class="list-disc pl-6 mb-4 space-y-3">
                <li><strong class="text-cocoa-ink">Keep libjxl at effort 7.</strong> Effort 9 encoded five times slower (0.43 against 2.1 megapixels a second) and came out within 1% overall; on our screenshots it made files 11% larger. Efforts 1 and 3 are seven times faster but cost 14% to 30% overall and up to double on screenshots.</li>
                <li><strong class="text-cocoa-ink">The encoder matters more than the effort.</strong> jixel Medium made files 21% smaller than libjxl's default while taking about 45% longer to encode (1.45 against 2.1 megapixels a second). jixel Slow made them 36% smaller, but at 15 times the time, which only pays for images you encode once and serve for years.</li>
                <li><strong class="text-cocoa-ink">Check the defaults before you trust a headline.</strong> jixel's default speed, Fast, made screenshots 40% larger than libjxl did. The gains above come from its slower settings.</li>
                <li><strong class="text-cocoa-ink">Photos gain least, screenshots and graphics most.</strong> On photos jixel's saving was 13% to 17% on DSSIM and 6% to 10% on Butteraugli; on charts and screenshots its Medium and Slow settings saved 13% to 63%.</li>
                <li><strong class="text-cocoa-ink">Re-test after an upgrade.</strong> On our nine screenshots, libjxl 0.11.2 at effort 7 made files 13% smaller than 0.13.0 at the same quality; photos did not change. Nine images is a small set, so measure your own before and after.</li>
            </ul>

            <h3 class="font-bold text-cocoa-ink text-xl mt-8 mb-3">A worked example: one dashboard screenshot</h3>
            <p class="mb-4">Take a 1280 x 800 screenshot of a web dashboard: dark sidebar, white cards, large numbers, small gray labels. Encoded with libjxl 0.13.0 at distance 1.0 and effort 7, it came out at 61,135 bytes with a SSIMULACRA2 score of 89.5. jixel Slow at distance 1.0 produced 26,298 bytes scoring 89.7, and its DSSIM score was better too: the same picture to both metrics, 57% smaller.</p>
            <p class="mb-4">Now the trap. On one of the Kodak photos (768 x 512, two parrots), the same distance 1.0 gave 56,733 bytes from libjxl scoring 87.6, and 37,214 bytes from jixel scoring 84.9. That smaller file is also a lower-quality one. Comparing encoders by their settings instead of by a measured score is how most "encoder X is 30% better" claims go wrong.</p>

            <h3 class="font-bold text-cocoa-ink text-xl mt-8 mb-3">Lossless and JPEG recompression</h3>
            <p class="mb-4">For lossless output, libjxl at effort 9 was 7% smaller than effort 7 for three times the encoding time, jixel Medium was 17% smaller and jixel Slow 25% smaller (55% on screenshots), while jixel Fast was 33% larger. Every one of the 308 lossless files decoded back to the exact original pixels.</p>
            <p class="mb-4">Lossless JPEG recompression, the reversible mode described in the next section, was a tie. Both encoders shrank 24 photos saved as quality-85 JPEGs by 14% and 9 screenshot JPEGs by 31% to 34%, and every file rebuilt the original JPEG byte for byte. Your saving depends on the JPEG you start from: ours were written with optimized Huffman tables, which leaves less to win than the 22% average from the EPFL and Google study above.</p>

            <h3 class="font-bold text-cocoa-ink text-xl mt-8 mb-3">Do the files open everywhere?</h3>
            <p class="mb-4">Every file from both encoders decoded to the same image, within a few levels of rounding, in libjxl's <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">djxl</code> and in <a href="https://github.com/libjxl/jxl-rs" target="_blank" rel="noopener noreferrer">jxl-rs</a>, the Rust decoder that ships in Chrome. A third decoder, jxl-oxide, showed visible errors on 5 of the 264 jixel files we checked, and on none of libjxl's. It is not settled whether jxl-oxide or jixel is at fault; if the apps your audience uses are built on jxl-oxide, test before you switch encoders.</p>

            <h3 class="font-bold text-cocoa-ink text-xl mt-8 mb-3">Which should you use?</h3>
            <ul class="list-disc pl-6 mb-4 space-y-3">
                <li><strong class="text-cocoa-ink">Converting a handful of files:</strong> you do not need to choose. A converter picks the encoder and settings for you; the <a href="/solutions/png-to-jxl">PNG to JXL converter</a> uses one high-quality setting with nothing to set, or a pixel-exact copy if you switch Lossless on after uploading.</li>
                <li><strong class="text-cocoa-ink">Your own pipeline with libjxl:</strong> leave effort at 7 and set quality with distance, for example <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">cjxl input.png output.jxl -d 1 -e 7</code>. For lossless, use <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">-d 0</code>. For a JPEG you might need back, <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">cjxl photo.jpg photo.jxl</code> transcodes reversibly by default, and <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">djxl photo.jxl photo-restored.jpg</code> returns the original file.</li>
                <li><strong class="text-cocoa-ink">Screenshots, UI and graphics you encode once:</strong> jixel Medium or Slow is worth a trial if you build in Rust, with a check in the decoders your audience uses.</li>
                <li><strong class="text-cocoa-ink">When none of this is needed:</strong> if browser support, not bytes, is what holds JPEG XL back on your site, a better encoder changes nothing. Get the fallback right first.</li>
            </ul>
            <p>To check a result yourself rather than trust a setting: decode it with <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">djxl output.jxl check.png</code>, then run <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">dssim original.png check.png</code>. A score of 0 means identical, and smaller is better. Compare two encoders at the same score, then look at the file sizes.</p>
        </section>

        <section id="jpeg-to-jxl" class="scroll-mt-24">
            <SectionHeading>Converting JPEG to JPEG XL</SectionHeading>
            <p class="mb-4">Converting JPEG to JPEG XL has two distinct modes, and which one is right depends on your goal.</p>
            <p class="mb-4"><strong class="text-cocoa-ink">Lossless transcode mode</strong> wraps the original JPEG data inside a JXL container with no re-encoding. You retain bit-for-bit reconstructability of the source file, and you typically see 20–30% file size reduction. This is the right choice for archival use and for any pipeline where you might need the original JPEG again downstream - legacy systems, social preview generation, ad networks.</p>
            <p class="mb-4"><strong class="text-cocoa-ink">Lossy re-encode mode</strong> fully decodes the JPEG and re-encodes to JXL at the target quality. You get larger savings - 40–60% vs the original JPEG at similar perceptual quality - but you are making a generation copy. If the source JPEG was already lossy, you are stacking artifacts. This is the right choice when you have access to the raw source (a TIFF, a RAW export, or a lossless master) and are producing a fresh JXL for serving.</p>
            <p class="mb-4">For web delivery from October 2026, JPEG-to-JXL serves Safari, Chrome 155+ and Firefox 158+ users, a share that grows weekly as installed browsers update. The baseline JPEG remains the universal fallback.</p>
            <p>You can convert to JPEG XL directly with the <a href="/jpg-to-jpegxl">JPG to JXL converter</a>: drop the files and it re-encodes them with one high-quality setting, nothing to set. It is a re-encode, not the reversible JPEG transcode described above, so keep your JPEG masters. For batch workflows, the CLI and MCP routes are covered in the <a href="#mochify-workflow">Mochify Workflow section</a> below.</p>
        </section>

        <section id="png-to-jxl" class="scroll-mt-24">
            <SectionHeading>Converting PNG to JPEG XL</SectionHeading>
            <p class="mb-4">PNG is overused as a web format because it is the default export from many design tools, not because it is the right choice for most images. JPEG XL gives you two options to improve on it.</p>
            <p class="mb-4">For <strong class="text-cocoa-ink">photographic PNGs</strong> (PNG exports of photos, which are common from Figma and similar tools), lossy JPEG XL typically cuts file size by 60–80% at similar visual quality. The format's VarDCT mode handles photographic content the same way AVIF or WebP do - much better than PNG's lossless model.</p>
            <p class="mb-4">For <strong class="text-cocoa-ink">graphics, illustrations, UI elements, and transparent assets</strong>, JPEG XL lossless is the right mode. You keep the transparency, the sharp edges, and the exact pixel data. The compression win over PNG (19–50% depending on encoder effort) is a genuine improvement, not a trade-off.</p>
            <p class="mb-4">In practice, the reasons to convert PNG to JXL today are archival compression, lossless masters, and web delivery to the Chrome 155, Firefox 158 and Safari 17 audience, which is most desktop traffic once the October releases have rolled out. For web delivery, you would pair the JXL source with a WebP or PNG fallback in a <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">&lt;picture&gt;</code> element. For pipelines using Fastly Image Optimizer or a JXL-aware CDN, the CDN can negotiate the format automatically based on the client <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">Accept</code> header.</p>
            <p>Convert PNG to JPEG XL with the <a href="/solutions/png-to-jxl">PNG to JXL converter</a>: a high-quality compressed encode by default, or switch Lossless on after uploading for a pixel-exact copy that is usually still smaller than the PNG.</p>
        </section>

        <section id="avif-to-jxl" class="scroll-mt-24">
            <SectionHeading>Converting AVIF to JPEG XL</SectionHeading>
            <p class="mb-4">Converting AVIF to JPEG XL for current web delivery does not make much sense on compression grounds alone - both formats are competitive, and AVIF still has the broader installed base, including Edge and Samsung Internet, which have not yet shipped JXL. You would be trading ecosystem compatibility for marginal compression gains.</p>
            <p class="mb-4">The case for AVIF-to-JXL conversion is narrower and more specific. For <strong class="text-cocoa-ink">HDR and wide-gamut archival</strong>, AVIF supports HDR but tops out at 12-bit depth. JPEG XL goes to 32-bit. If you are building a long-term archive from AVIF masters, JPEG XL is the stronger archival target for high-bit-depth content. For <strong class="text-cocoa-ink">consolidating a mixed archive</strong>, if you have a mix of JPEGs, PNGs, and AVIFs and want a single high-quality master format for storage, JPEG XL can ingest all of them. The masters become JXL; AVIF, WebP, and JPEG derivatives are generated from those masters for web delivery. And for <strong class="text-cocoa-ink">pipeline readiness</strong>, building AVIF-to-JXL into your workflow means you can serve JXL to Chrome 155 and Firefox 158 now - you just put the JXL <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">&lt;source&gt;</code> first.</p>
            <p>Convert AVIF to JPEG XL with the <a href="/avif-to-jpegxl">AVIF to JXL converter</a>: a decode and high-quality re-encode, nothing to set.</p>
        </section>

        <section id="fallback-pattern" class="scroll-mt-24">
            <SectionHeading>The Fallback Pattern: Serving JXL Safely on the Web</SectionHeading>
            <p class="mb-4">The canonical pattern for JPEG XL on the web uses the HTML <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">&lt;picture&gt;</code> element. Browsers evaluate <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">&lt;source&gt;</code> elements in order and select the first format they support, falling back to the <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">&lt;img&gt;</code> tag for everything else.</p>

            <CodeCard filename="HTML" code={pictureCode} />

            <p class="mb-4">This stack gives you JXL for Chrome 155+, Firefox 158+ and Safari 17+, AVIF for Edge and older Chrome and Firefox, WebP for older clients, and JPEG for everything else.</p>
            <p class="mb-4"><strong class="text-cocoa-ink">Always include <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">width</code> and <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">height</code> attributes</strong> on the <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">&lt;img&gt;</code> tag. Browsers need these to reserve layout space before the image loads. Omitting them causes cumulative layout shift (CLS), which affects your Core Web Vitals score. See our guide on <a href="/guides/optimizing-hero-images">optimizing hero images for web performance</a> for more on this.</p>
            <p class="mb-4"><strong class="text-cocoa-ink">Do not serve JPEG XL as your only format.</strong> A standalone <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">&lt;img src="image.jxl"&gt;</code> will display a broken image in Edge, in any Chrome or Firefox that has not yet updated to the October 2026 releases, and in email clients and chat apps. That remains the production reality for months after a release. If you need to send a JXL to someone whose software cannot open it, the <a href="/solutions/jxl-to-jpg">JXL to JPG converter</a> gives you a JPEG that opens anywhere.</p>
            <p><strong class="text-cocoa-ink">CDN-level negotiation</strong> is cleaner than HTML for high-traffic sites. If you are on Fastly Image Optimizer, you can configure it to auto-negotiate JXL based on the <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">Accept</code> header, so the right format is served without changing your image markup. Cloudflare and Netlify do not yet offer this for JXL.</p>
        </section>

        <section id="when-not-to-use" class="scroll-mt-24">
            <SectionHeading>When Not to Use JPEG XL</SectionHeading>
            <p class="mb-4">JPEG XL is production-ready with a fallback in most contexts since October 2026, and still the wrong choice in a few. Being clear about the difference saves headaches.</p>
            <p class="mb-4"><strong class="text-cocoa-ink">Production-ready with fallbacks:</strong> any site whose audience is mostly on Chrome, Firefox or Safari (Chrome 155, Firefox 158 and Safari 17 decode JXL natively); internal archival and storage pipelines where browser support is irrelevant; sites running on Fastly Image Optimizer, which can serve JXL to capable clients automatically; HDR photography and retina-quality sites where the 32-bit depth is a real advantage.</p>
            <p class="mb-4"><strong class="text-cocoa-ink">Wait or test carefully:</strong> WordPress and Shopify sites - neither platform exposes JXL in its standard delivery stack. Mass-market web apps where a broken image in Edge or in a not-yet-updated Chrome is a business problem. Any pipeline that feeds third-party systems such as social previews, email clients, or ad networks, which mostly do not understand JXL and will display nothing.</p>

            <GlassInfoBox type="note" title="The right mental model for 2026">
                JPEG XL is where WebP was around 2018. Strong format, real compression wins, but meaningful adoption gaps that require engineering around. The difference is that the archival and lossless-JPEG-transcode use cases are valuable today, independent of where browser support lands.
            </GlassInfoBox>
        </section>

        <section id="mochify-workflow" class="scroll-mt-24 bg-gradient-to-b from-mochi-blush to-white border border-pink-100 rounded-3xl p-8">
            <SectionHeading>Mochify Workflow: Convert to JPEG XL in One Prompt</SectionHeading>
            <p class="mb-6">Mochify handles JPEG XL conversion across all surfaces - the web app, the CLI, both MCP servers, and the REST API. For batches up to 25 files (Seller or Pro) or 3 files (Free), describe what you need in plain English and Magic Flow applies the right settings automatically.</p>

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
                        body: 'The converted JXL files come back ready to slot into your picture stack or archival storage. No manual settings panel, no quality slider - just a description of the outcome you need.'
                    },
                ] as step}
                    <li class="flex gap-5 items-start">
                        <span class="w-8 h-8 shrink-0 bg-mochi-pink text-white rounded-full flex items-center justify-center font-black text-sm">{step.n}</span>
                        <div class="pt-0.5">
                            <strong class="block text-cocoa-ink font-bold mb-1">{step.title}</strong>
                            <span class="text-cocoa-deep">{step.body}</span>
                        </div>
                    </li>
                {/each}
            </ol>

            <div class="mt-8">
                <GlassInfoBox type="tip" title="Developer tip">
                    Using the local MCP server (<code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-sm border border-pink-100">mochify serve</code>) via Claude Desktop or a compatible agent? It returns file paths and metadata rather than image bytes, keeping your agent context clean for large batches. See our guide on <a href="/guides/how-the-mochify-mcp-server-works">how the Mochify MCP server works</a> for setup details.
                </GlassInfoBox>
            </div>

            <p class="mt-6 text-sm text-cocoa-milk border-t border-pink-100 pt-5 leading-relaxed">
                <strong class="text-cocoa-deep">Privacy note:</strong> Images are streamed into server RAM at <code class="bg-pink-50 text-mochi-pink px-1.5 py-px rounded font-mono text-xs border border-pink-100">api.mochify.app</code> for encoding and the originals are wiped immediately - no disk writes, no logs containing file data. The compressed JXL output comes back to you without the source being stored. For the hosted MCP server, the compressed output is held briefly in a pickup store (five-minute TTL) so the short-lived download URL can resolve; the local CLI and local MCP server skip the pickup store entirely and are zero-retention end-to-end.
            </p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24 bg-mochi-blush border border-pink-100 rounded-3xl p-8">
            <SectionHeading>JPEG XL Quick-Reference Cheat Sheet</SectionHeading>

            <GuideTable class="my-6">
                <table>
                    <thead>
                        <tr>
                            <th>Scenario</th>
                            <th>Recommended mode</th>
                            <th>Expected size vs original</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            ['Archiving existing JPEGs', 'Lossless transcode (JPEG-in-JXL)', '20–30% smaller', 'Exact JPEG reconstruction preserved'],
                            ['Web photos, new encode', 'Lossy JXL from lossless master', '35–55% smaller than JPEG', 'Pair with AVIF/WebP/JPEG fallbacks'],
                            ['PNG graphics / UI / logos', 'Lossless JXL', '19–50% smaller than PNG', 'Transparency supported'],
                            ['Photographic PNGs', 'Lossy JXL', '60–80% smaller than PNG', 'Only if quality loss is acceptable'],
                            ['AVIF archives (HDR)', 'Lossless JXL', 'Comparable size', 'Use for long-term masters; serve AVIF for web'],
                            ['Choosing libjxl effort', 'Effort 7, the default', 'Effort 9 within 1%, 5x slower', 'Efforts 1–3 cost 14–30% overall (our 44-image test)'],
                            ['Screenshots and graphics, encoded once', 'Lossy JXL from a slower encoder (jixel Medium or Slow)', '13–63% smaller than libjxl effort 7 at equal quality', 'Test in the decoders your audience uses'],
                            ['WordPress / Shopify delivery', 'Avoid JXL as primary', 'n/a', 'Platform stacks optimized for WebP/AVIF'],
                            ['Safari-primary audience', 'JXL as first source', 'Best quality per byte', 'Always include AVIF/WebP/JPEG fallback'],
                            ['Chrome/Firefox general delivery', 'JXL as first source in picture', 'Best quality per byte', 'Default-on in Chrome 155+ and Firefox 158+; keep an AVIF/WebP/JPEG fallback'],
                        ] as row}
                            <tr>
                                {#each row as cell}
                                    <td>{cell}</td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </GuideTable>

            <h3 class="font-bold text-cocoa-ink text-lg mt-10 mb-4">Browser support summary (late 2026)</h3>
            <GuideTable class="my-6">
                <table>
                    <thead>
                        <tr>
                            <th>Browser</th>
                            <th>JPEG XL support</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            ['Chrome 155+ (desktop and Android)', 'Yes, by default from October 6, 2026 (145 to 154: flag only)'],
                            ['Firefox 158+', 'Yes, by default from October 13, 2026'],
                            ['Safari 17+', 'Still images only; no animation, no progressive decode'],
                            ['Edge, Samsung Internet, not-yet-updated installs', 'Not yet; keep an AVIF or WebP fallback'],
                            ['Global coverage', '~17% on October 7, 2026, rising as Chrome 155 and Firefox 158 roll out'],
                        ] as row}
                            <tr>
                                {#each row as cell}
                                    <td>{cell}</td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </GuideTable>
        </section>

        <section id="faq" class="scroll-mt-24">
            <SectionHeading>FAQ</SectionHeading>
            <div class="space-y-3 mt-6">
                {#each [
                    {
                        q: "Is JPEG XL better than AVIF?",
                        a: "For photographic content at practical encode speeds, JPEG XL is competitive with or slightly ahead of AVIF on compression. The deciding factor used to be browser support: AVIF has roughly 95–97% global coverage, while JPEG XL sat near 15% until Chrome 155 and Firefox 158 shipped it by default in October 2026. Use AVIF as the broad-reach format, add JPEG XL as the first source where it is smaller or where you need lossless or progressive loading, and keep JPEG XL for archival masters."
                    },
                    {
                        q: "Does Chrome support JPEG XL?",
                        a: "Yes. Chrome 155, released on October 6, 2026, decodes JPEG XL by default on desktop and Android using the Rust jxl-rs decoder. Chrome 145 to 154 contain the decoder but keep it behind chrome://flags/#enable-jxl-image-format, so a visitor on an older install still needs a fallback. Our guide to <a href=\"https://mochify.app/guides/jpeg-xl-chrome-support\">JPEG XL in Chrome and what changes now</a> has the dated per-browser table; the <a href=\"https://mochify.app/guides/chrome-145-jpeg-xl-default\">Chrome 145 explainer</a> covers the earlier flag-only step."
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
                        a: "Yes, in both lossy and lossless modes. This makes it a potential PNG replacement for transparent UI elements, logos, and sprites - at least for platforms and CDNs that support it. For most web delivery today, WebP lossless remains the practical choice for transparent assets."
                    },
                    {
                        q: "How do I serve JPEG XL with a fallback for unsupported browsers?",
                        a: "Use the HTML picture element with a source typed image/jxl as the first source, followed by AVIF, WebP, and a JPEG img baseline. Browsers evaluate sources top to bottom and pick the first they support. See the fallback pattern section above for the full markup example, and our <a href=\"/guides/html-picture-tag\">picture element guide</a> for the source-order rules and the dated support figures."
                    },
                    {
                        q: "Is JPEG XL good for archiving photos?",
                        a: "It is arguably the best format for long-term photographic archival right now. 32-bit depth, HDR support, lossless JPEG transcoding, and strong compression make a compelling combination. For large archives of existing JPEGs, the lossless transcode mode alone - 20–30% smaller with exact reconstruction - is reason enough to run a conversion."
                    },
                    {
                        q: "Which JPEG XL encoder and settings should I use?",
                        a: "For your own pipeline with libjxl, keep the default effort of 7 and set quality with distance, where 1.0 is meant to look identical to the original. In our 44-image test, effort 9 came out within 1% overall and encoded five times slower. A newer Rust encoder, jixel, made files 21% smaller at the same measured quality on its Medium setting, with the biggest gains on screenshots and graphics, but its default Fast setting made screenshots larger. If you convert with a tool rather than a pipeline, the tool picks the settings for you."
                    },
                ] as faq}
                    <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-cocoa-ink list-none select-none text-base">
                            <span>{faq.q}</span>
                            <span class="text-[#7E685E] transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </summary>
                        <div class="px-6 pb-6 text-base text-cocoa-deep leading-relaxed">
                            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                            {@html faq.a}
                        </div>
                    </details>
                {/each}
            </div>
        </section>

        <GlassCTA href="/" label="Try it free">
            Ready to convert your images to JPEG XL? Drop your files at <strong class="text-cocoa-ink">mochify.app</strong> and describe what you need in plain English - something like <em>"convert these to JPEG XL for archival, keep full quality"</em> or <em>"batch convert to JXL and compress for web."</em> No settings panel, no plugins, no signup required for up to 3 files.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
