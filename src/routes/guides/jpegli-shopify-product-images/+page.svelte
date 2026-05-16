<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

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

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in this guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    <li>
                        <a href="#why-jpegli" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">01</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Why Jpegli for Shopify?</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#shopify-recompression" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">02</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">How Shopify's recompression damages your images</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#comparison" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">03</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Jpegli vs standard JPEG — at a glance</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#step-by-step" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">04</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Step-by-step: compress Shopify images with Jpegli</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#results" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">05</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Results and privacy notes</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </section>

        <section class="my-8 bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100">
            <SectionHeading>30-second summary</SectionHeading>
            <p>Shopify recompresses your images on upload. If you give it a poorly-encoded JPEG, you get a doubly-degraded result. Give it a Jpegli-encoded JPEG — which packs more perceptual quality per byte than standard JPEG — and Shopify's pipeline has a much better input to work with. The output on your storefront is noticeably sharper, and the file is ~35% smaller to boot.</p>
        </section>

        <!-- Section 1 -->
        <section id="why-jpegli" class="scroll-mt-24">
            <SectionHeading>Why Jpegli for Shopify?</SectionHeading>
            <p class="mb-4">Shopify caps product images at 2048 × 2048 px and auto-recompresses anything above that threshold. Standard JPEG encoders already lose detail at that step. Jpegli — released by Google in 2024 and benchmarked further in 2026 — uses psychovisual modelling to retain more perceived sharpness at lower file sizes than both standard JPEG and, on photographic content, WebP.</p>
            <p class="mb-4">A 35% file-size reduction translates directly to faster <strong>Largest Contentful Paint (LCP)</strong>, a Core Web Vitals signal that affects your Shopify store's search ranking. Reddit and Shopify developer forums consistently flag the same problem: images look sharp in Lightroom, soft after upload. The root cause is Shopify's recompression layering on top of already-lossy JPEGs. Uploading a Jpegli-encoded file at the right quality setting gives Shopify less to damage.</p>
        </section>

        <!-- Section 2 -->
        <section id="shopify-recompression" class="scroll-mt-24">
            <SectionHeading>How Shopify's recompression damages your images</SectionHeading>
            <p class="mb-4">When you upload a JPEG to Shopify, their CDN pipeline applies its own compression pass on top of yours. If your source file is already a lossy JPEG, this second pass is lossy again — compounding the quality loss each time.</p>
            <p class="mb-4">The usual symptoms: product images look crisp in your photo editor but appear slightly soft, washed out, or blocky on the storefront. Jpegli gives you a head start — because its psychovisual model preserves more perceptual sharpness per byte, Shopify's recompressor has a higher-quality input to work with and produces a noticeably better result.</p>

            <InfoBox type="tip" title="The rule of thumb">
                Upload the best-encoded JPEG you can produce. Shopify will still recompress, but the output quality ceiling rises significantly when you start from a Jpegli-encoded source.
            </InfoBox>
        </section>

        <!-- Section 3 -->
        <section id="comparison" class="scroll-mt-24">
            <SectionHeading>Jpegli vs standard JPEG — at a glance</SectionHeading>
            <p class="mb-4">Because Jpegli outputs a standard <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">.jpg</code> file, every browser and every Shopify theme reads it without any changes. There is no compatibility trade-off.</p>

            <div class="overflow-x-auto rounded-xl border border-pink-100 shadow-sm mb-8">
                <table class="w-full text-left bg-white">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black"></th>
                            <th class="p-4 font-black">Standard JPEG</th>
                            <th class="p-4 font-black">Jpegli</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Encoder</td><td class="p-4">libjpeg / MozJPEG</td><td class="p-4">Google Jpegli</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">File size (same quality)</td><td class="p-4">Baseline</td><td class="p-4">~35% smaller</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Photographic quality</td><td class="p-4">Good</td><td class="p-4">Visually superior</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Browser support</td><td class="p-4">Universal</td><td class="p-4">Universal (JPEG container)</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Shopify compatible</td><td class="p-4">Yes</td><td class="p-4">Yes</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Section 4 -->
        <section id="step-by-step" class="scroll-mt-24">
            <SectionHeading>Step-by-step: compress Shopify images with Jpegli</SectionHeading>
            <ol class="list-decimal pl-6 mb-6 space-y-3 marker:text-[#F06292] marker:font-bold">
                <li><strong>Resize first.</strong> Scale product images to 2048 × 2048 px (or your largest display size). Shopify will not upscale, so never upload smaller than needed.</li>
                <li><strong>Open <a href="https://mochify.app" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app</a>.</strong> No account is required for up to 3 files per session. Free tier: 25 images/month.</li>
                <li><strong>Describe what you want using Magic Flow.</strong> Instead of manually picking settings, type your intent in plain English — for example: <em>"compress as jpegli at quality 82, strip location data, max 2048px"</em>. Mochify's NLP engine parses the prompt and applies the right format, quality, and metadata settings to every file automatically.</li>
                <li><strong>Upload your images.</strong> Drag and drop up to 3 files (Free) or 25 files (Seller/Pro batch). Magic Flow handles the rest — no format dropdowns, no manual quality sliders.</li>
                <li><strong>Review and download.</strong> Confirm the output looks right, then download your compressed files.</li>
                <li><strong>Upload to Shopify.</strong> Replace existing product images with your Jpegli-compressed files. Shopify's recompression pass now has far less work to do.</li>
            </ol>

            <InfoBox type="tip" title="Batch processing">
                Seller and Pro plans support batches of up to 25 files. If you're refreshing an entire product catalogue, this is significantly faster than processing images one by one.
            </InfoBox>
        </section>

        <!-- Section 5 -->
        <section id="results" class="scroll-mt-24">
            <SectionHeading>Results and privacy notes</SectionHeading>
            <p class="mb-4">Stores that pre-compress with Jpegli typically see LCP improvements of <strong>200–500 ms</strong> on product pages — run a before/after test in PageSpeed Insights to confirm your specific gains.</p>
            <p class="mb-4">If you sell from a home address or shoot products at a private location, EXIF stripping is not optional; it is essential. Mochify strips GPS coordinates, device identifiers, and embedded thumbnails by default on every file. Files are processed in RAM and never written to disk — zero retention, no cloud storage.</p>
            <p class="mb-4">Compress free at <a href="https://mochify.app" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app</a> — describe what you need, privacy-first, no login required.</p>
        </section>

        <RelatedGuides guides={related} />

    </div>
</article>
