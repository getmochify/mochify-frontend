<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';

    const metadata = {
        title: "How to Use Jpegli for Shopify Product Images",
        description: "Pre-compress Shopify product images with Jpegli before upload. Stop Shopify's recompression from degrading quality — get ~35% smaller files, faster LCP, and better search rankings.",
        category: "Quick Guides",
        readTime: "6 min read",
        date: "April 6, 2026"
    };

    const related = [
        {
            title: "AI-Powered Image Compression with Natural Language",
            href: "/guides/ai-image-compression-natural-language-2026",
            desc: "How Mochify's Magic Flow interprets plain English to pick the right compression settings automatically."
        },
        {
            title: "EXIF Data Risks: Strip Image Metadata Before Uploading",
            href: "/guides/exif-data-risks-image-compression-2026",
            desc: "Why GPS coordinates and device identifiers embedded in product photos are a privacy risk — and how to remove them."
        },
        {
            title: "JPEG in 2026: Why Jpegli Is the Best JPEG Encoder",
            href: "/guides/jpeg-in-2026-jpegli",
            desc: "A deep dive into how Jpegli achieves 35% better compression than standard JPEG at equivalent visual quality."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/jpegli-shopify-product-images" />

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": ["TechArticle", "HowTo"],
        "headline": "How to Use Jpegli for Shopify Product Images",
        "description": "Pre-compress Shopify product images with Jpegli before upload. Stop Shopify's recompression from degrading quality — get ~35% smaller files, faster LCP, and better search rankings.",
        "url": "https://mochify.app/guides/jpegli-shopify-product-images",
        "inLanguage": "en",
        "datePublished": "2026-04-06",
        "dateModified": "2026-04-06",
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "about": ["Jpegli", "Shopify image optimization", "LCP", "Core Web Vitals", "EXIF stripping"],
        "step": [
            { "@type": "HowToStep", "name": "Resize first", "text": "Scale product images to 2048 x 2048 px or your largest display size." },
            { "@type": "HowToStep", "name": "Open Mochify", "text": "Go to mochify.app. No account required for up to 3 files per session." },
            { "@type": "HowToStep", "name": "Describe your goal using Magic Flow", "text": "Type your intent in plain English, e.g. 'compress as jpegli at quality 82, strip location data, max 2048px'." },
            { "@type": "HowToStep", "name": "Upload your images", "text": "Drag and drop up to 3 files (Free) or 25 files (Seller/Pro). Magic Flow handles the rest." },
            { "@type": "HowToStep", "name": "Download and upload to Shopify", "text": "Replace existing product images with your jpegli-compressed files." }
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
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            How to Use Jpegli for Shopify Product Images
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Shopify recompresses every image you upload, and that second pass degrades quality you worked hard to preserve. Pre-compress with Jpegli before upload and you control the output entirely — no apps, no plugins, no quality surprises.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                <strong>Published April 2026 by the Mochify Engineering Team.</strong> Jpegli produces files roughly 35% smaller than a standard JPEG at equivalent visual quality — and outputs a standard <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">.jpg</code> file that every browser, Shopify theme, and marketplace reads without changes.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed guide-content">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    {#each [
                        { n: '01', href: '#why-jpegli', label: 'Why Jpegli for Shopify?' },
                        { n: '02', href: '#shopify-recompression', label: "How Shopify's recompression damages your images" },
                        { n: '03', href: '#comparison', label: 'Jpegli vs standard JPEG — at a glance' },
                        { n: '04', href: '#step-by-step', label: 'Step-by-step: compress Shopify images with Jpegli' },
                        { n: '05', href: '#results', label: 'Results and privacy notes' },
                    ] as item}
                        <li>
                            <a href={item.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                                <span class="flex items-center gap-4">
                                    <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">{item.n}</span>
                                    <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                                </span>
                                <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </section>

        <!-- Why Jpegli -->
        <section id="why-jpegli" class="my-12">
            <SectionHeading>Why Jpegli for Shopify?</SectionHeading>

            <p>Shopify caps product images at 2048 × 2048 px and auto-recompresses anything above that threshold. Standard JPEG encoders already lose detail at that step. Jpegli — released by Google in 2024 and benchmarked further in 2026 — uses psychovisual modelling to retain more perceived sharpness at lower file sizes than both standard JPEG and, on photographic content, WebP.</p>

            <p>A 35% file-size reduction translates directly to faster <strong>Largest Contentful Paint (LCP)</strong>, a Core Web Vitals signal that affects your Shopify store's search ranking.</p>

            <p>Reddit and Shopify developer forums consistently flag the same problem: images look sharp in Lightroom, soft after upload. The root cause is Shopify's recompression layering on top of already-lossy JPEGs. Uploading a jpegli-encoded file at the right quality setting gives Shopify less to damage.</p>
        </section>

        <!-- Shopify recompression -->
        <section id="shopify-recompression" class="my-12">
            <SectionHeading>How Shopify's Recompression Damages Your Images</SectionHeading>

            <p>When you upload a JPEG to Shopify, their CDN pipeline applies its own compression pass on top of yours. If your source file is already a lossy JPEG, this second pass is lossy again — compounding the quality loss each time.</p>

            <p>The usual symptoms: product images look crisp in your photo editor but appear slightly soft, washed out, or blocky on the storefront. Jpegli gives you a head start — because its psychovisual model preserves more perceptual sharpness per byte, Shopify's recompressor has a higher-quality input to work with and produces a noticeably better result.</p>

            <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100 my-8">
                <p class="text-[#6C3F31] font-semibold mb-1">The rule of thumb</p>
                <p class="text-[#875F42] mb-0">Upload the best-encoded JPEG you can produce. Shopify will still recompress, but the output quality ceiling rises significantly when you start from a Jpegli-encoded source.</p>
            </div>
        </section>

        <!-- Comparison table -->
        <section id="comparison" class="my-12">
            <SectionHeading>Jpegli vs Standard JPEG — At a Glance</SectionHeading>

            <div class="overflow-x-auto">
                <table class="w-full text-sm rounded-xl overflow-hidden shadow-sm">
                    <thead>
                        <tr>
                            <th class="text-left p-4 bg-[#FFF5F7] text-[#4A2C2C] font-bold border border-pink-100"></th>
                            <th class="text-left p-4 bg-[#FFF5F7] text-[#4A2C2C] font-bold border border-pink-100">Standard JPEG</th>
                            <th class="text-left p-4 bg-[#FFF5F7] text-[#4A2C2C] font-bold border border-pink-100">Jpegli</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            ['Encoder', 'libjpeg / MozJPEG', 'Google Jpegli'],
                            ['File size (same quality)', 'Baseline', '~35% smaller'],
                            ['Photographic quality', 'Good', 'Visually superior'],
                            ['Browser support', 'Universal', 'Universal (JPEG container)'],
                            ['Shopify compatible', 'Yes', 'Yes'],
                        ] as row}
                            <tr>
                                <td class="p-4 font-semibold text-[#4A2C2C] border border-pink-50 bg-white">{row[0]}</td>
                                <td class="p-4 text-[#875F42] border border-pink-50 bg-white">{row[1]}</td>
                                <td class="p-4 text-[#875F42] border border-pink-50 bg-[#FDFBF7]">{row[2]}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <p class="mt-6">Because Jpegli outputs a standard <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">.jpg</code> file, every browser and every Shopify theme reads it without any changes. There is no compatibility trade-off.</p>
        </section>

        <!-- Step by step -->
        <section id="step-by-step" class="my-12">
            <SectionHeading>Step-by-Step: Compress Shopify Images with Jpegli</SectionHeading>

            <div class="space-y-4 mt-6">
                {#each [
                    {
                        n: 1,
                        title: 'Resize first',
                        body: 'Scale product images to 2048 × 2048 px (or your largest display size). Shopify will not upscale, so never upload smaller than needed.'
                    },
                    {
                        n: 2,
                        title: 'Open mochify.app',
                        body: 'No account is required for up to 3 files per session. Free tier: 25 images/month.'
                    },
                    {
                        n: 3,
                        title: 'Describe what you want using Magic Flow',
                        body: 'Instead of manually picking settings, type your intent in plain English — for example: "compress as jpegli at quality 82, strip location data, max 2048px". Mochify\'s NLP engine parses the prompt and applies the right format, quality, and metadata settings to every file automatically.'
                    },
                    {
                        n: 4,
                        title: 'Upload your images',
                        body: 'Drag and drop up to 3 files (Free) or 25 files (Seller/Pro batch). Magic Flow handles the rest — no format dropdowns, no manual quality sliders to second-guess.'
                    },
                    {
                        n: 5,
                        title: 'Review and download',
                        body: 'Confirm the output looks right, then download your compressed files.'
                    },
                    {
                        n: 6,
                        title: 'Upload to Shopify',
                        body: "Replace existing product images with your Jpegli-compressed files. Shopify's recompression pass now has far less work to do."
                    },
                ] as step}
                    <div class="flex gap-5 p-5 rounded-2xl bg-white border border-pink-50 shadow-sm">
                        <span class="flex-shrink-0 w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center text-sm font-black text-[#F06292] border border-pink-100">{step.n}</span>
                        <div>
                            <p class="font-bold text-[#4A2C2C] mb-1">{step.title}</p>
                            <p class="text-[#875F42] text-base mb-0">{step.body}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Results -->
        <section id="results" class="my-12">
            <SectionHeading>Results and Privacy Notes</SectionHeading>

            <p>Stores that pre-compress with Jpegli typically see LCP improvements of <strong>200–500 ms</strong> on product pages — run a before/after test in PageSpeed Insights to confirm your specific gains.</p>

            <p>If you sell from a home address or shoot products at a private location, EXIF stripping is not optional; it is essential. Mochify strips GPS coordinates, device identifiers, and embedded thumbnails by default on every file. Files are processed in RAM and never written to disk — zero retention, no cloud storage.</p>

            <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100 my-8">
                <a href="https://mochify.app" class="block text-center">
                    <p class="text-[#4A2C2C] font-black text-lg mb-1">Compress free at mochify.app</p>
                    <p class="text-[#875F42] text-sm mb-0">Describe what you need — privacy-first, no login required</p>
                </a>
            </div>
        </section>

        <RelatedGuides guides={related} />

    </div>
</article>
