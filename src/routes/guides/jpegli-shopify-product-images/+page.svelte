<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "How to Use Jpegli for Shopify Product Images",
        description: "Pre-compress Shopify product images with Jpegli before upload so Shopify's recompression can't degrade them: ~35% smaller files, faster LCP, better SEO.",
        category: "Quick Guides",
        readTime: "6 min read",
        date: "April 6, 2026",
        lastUpdated: "September 12, 2026"
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
            desc: "Why GPS coordinates and device identifiers embedded in product photos are a privacy risk - and how to remove them."
        },
        {
            title: "JPEG in 2026: Why Jpegli Is the Best JPEG Encoder",
            href: "/guides/jpeg-in-2026-jpegli",
            desc: "A deep dive into how Jpegli achieves 35% better compression than standard JPEG at equivalent visual quality."
        }
    ];

    const toc = [
        { id: 'why-jpegli', label: 'Why Jpegli for Shopify?' },
        { id: 'shopify-recompression', label: "How Shopify's recompression damages your images" },
        { id: 'comparison', label: 'Jpegli vs standard JPEG - at a glance' },
        { id: 'step-by-step', label: 'Step-by-step: compress Shopify images with Jpegli' },
        { id: 'results', label: 'Results and privacy notes' }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/jpegli-shopify-product-images" />

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": ["TechArticle", "HowTo"],
        "headline": "How to Use Jpegli for Shopify Product Images",
        "description": "Pre-compress Shopify product images with Jpegli before upload so Shopify's recompression can't degrade them: ~35% smaller files, faster LCP, better SEO.",
        "url": "https://mochify.app/guides/jpegli-shopify-product-images",
        "inLanguage": "en",
        "image": "https://mochify.app/og/guides-jpegli-shopify-product-images.png",
        "datePublished": "2026-04-06T12:00:00+00:00",
        "dateModified": "2026-09-12T12:00:00+00:00",
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
            { "@type": "HowToStep", "name": "Open Mochify", "text": "Go to mochify.app. No account required for up to 3 files a month." },
            { "@type": "HowToStep", "name": "Describe your goal using Magic Flow", "text": "Type your intent in plain English, e.g. 'compress as jpegli at quality 82, strip location data, max 2048px'." },
            { "@type": "HowToStep", "name": "Upload your images", "text": "Drag and drop up to 3 files (Free) or 25 files (Seller/Pro). Magic Flow handles the rest." },
            { "@type": "HowToStep", "name": "Download and upload to Shopify", "text": "Replace existing product images with your jpegli-compressed files." }
        ]
    }
    </script>
    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/jpegli-shopify-product-images"
        description={metadata.description}
        datePublished="2026-04-06"
        dateModified="2026-09-12"
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
			<AccentTitle title={metadata.title} accent="Jpegli" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            Shopify recompresses every image you upload, and that second pass degrades quality you worked hard to preserve. Pre-compress with Jpegli before upload and you control the output entirely - no apps, no plugins, no quality surprises.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-lg leading-relaxed text-[#6C3F31]">
                <strong>Published April 2026 by the Mochify Engineering Team.</strong> Jpegli produces files roughly 35% smaller than a standard JPEG at equivalent visual quality - and outputs a standard <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">.jpg</code> file that every browser, Shopify theme, and marketplace reads without changes.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section>
            <GuideTOC items={toc} heading="What's in this guide" />
        </section>

        <section class="my-8 bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100">
            <SectionHeading>30-second summary</SectionHeading>
            <p>Shopify recompresses your images on upload. If you give it a poorly-encoded JPEG, you get a doubly-degraded result. Give it a Jpegli-encoded JPEG - which packs more perceptual quality per byte than standard JPEG - and Shopify's pipeline has a much better input to work with. The output on your storefront is noticeably sharper, and the file is ~35% smaller to boot.</p>
        </section>

        <!-- Section 1 -->
        <section id="why-jpegli" class="scroll-mt-24">
            <SectionHeading>Why Jpegli for Shopify?</SectionHeading>
            <p class="mb-4">Shopify caps product images at 2048 × 2048 px and auto-recompresses anything above that threshold. Standard JPEG encoders already lose detail at that step. Jpegli - released by Google in 2024 and benchmarked further in 2026 - uses psychovisual modeling to retain more perceived sharpness at lower file sizes than both standard JPEG and, on photographic content, WebP.</p>
            <p class="mb-4">A 35% file-size reduction translates directly to faster <strong>Largest Contentful Paint (LCP)</strong>, a Core Web Vitals signal that affects your Shopify store's search ranking. Reddit and Shopify developer forums consistently flag the same problem: images look sharp in Lightroom, soft after upload. The root cause is Shopify's recompression layering on top of already-lossy JPEGs. Uploading a Jpegli-encoded file at the right quality setting gives Shopify less to damage.</p>
        </section>

        <!-- Section 2 -->
        <section id="shopify-recompression" class="scroll-mt-24">
            <SectionHeading>How Shopify's recompression damages your images</SectionHeading>
            <p class="mb-4">When you upload a JPEG to Shopify, their CDN pipeline applies its own compression pass on top of yours. If your source file is already a lossy JPEG, this second pass is lossy again - compounding the quality loss each time.</p>
            <p class="mb-4">The usual symptoms: product images look crisp in your photo editor but appear slightly soft, washed out, or blocky on the storefront. Jpegli gives you a head start - because its psychovisual model preserves more perceptual sharpness per byte, Shopify's recompressor has a higher-quality input to work with and produces a noticeably better result.</p>

            <GlassInfoBox type="tip" title="The rule of thumb">
                Upload the best-encoded JPEG you can produce. Shopify will still recompress, but the output quality ceiling rises significantly when you start from a Jpegli-encoded source.
            </GlassInfoBox>
        </section>

        <!-- Section 3 -->
        <section id="comparison" class="scroll-mt-24">
            <SectionHeading>Jpegli vs standard JPEG - at a glance</SectionHeading>
            <p class="mb-4">Because Jpegli outputs a standard <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">.jpg</code> file, every browser and every Shopify theme reads it without any changes. There is no compatibility trade-off.</p>

            <GuideTable class="my-6">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Standard JPEG</th>
                            <th>Jpegli</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Encoder</td><td>libjpeg / MozJPEG</td><td>Google Jpegli</td></tr>
                        <tr><td>File size (same quality)</td><td>Baseline</td><td>~35% smaller</td></tr>
                        <tr><td>Photographic quality</td><td>Good</td><td>Visually superior</td></tr>
                        <tr><td>Browser support</td><td>Universal</td><td>Universal (JPEG container)</td></tr>
                        <tr><td>Shopify compatible</td><td>Yes</td><td>Yes</td></tr>
                    </tbody>
                </table>
            </GuideTable>
        </section>

        <!-- Section 4 -->
        <section id="step-by-step" class="scroll-mt-24">
            <SectionHeading>Step-by-step: compress Shopify images with Jpegli</SectionHeading>
            <ol class="list-decimal pl-6 mb-6 space-y-3 marker:text-[#F06292] marker:font-bold">
                <li><strong>Resize first.</strong> Scale product images to 2048 × 2048 px (or your largest display size). Shopify will not upscale, so never upload smaller than needed.</li>
                <li><strong>Open <a href="https://mochify.app">mochify.app</a>.</strong> No account is required for up to 3 files a month. Free tier: 25 images/month.</li>
                <li><strong>Describe what you want using Magic Flow.</strong> Instead of manually picking settings, type your intent in plain English - for example: <em>"compress as jpegli at quality 82, strip location data, max 2048px"</em>. Mochify's NLP engine parses the prompt and applies the right format, quality, and metadata settings to every file automatically.</li>
                <li><strong>Upload your images.</strong> Drag and drop up to 3 files (Free) or 25 files (Seller/Pro batch). Magic Flow handles the rest - no format dropdowns, no manual quality sliders.</li>
                <li><strong>Review and download.</strong> Confirm the output looks right, then download your compressed files.</li>
                <li><strong>Upload to Shopify.</strong> Replace existing product images with your Jpegli-compressed files. Shopify's recompression pass now has far less work to do.</li>
            </ol>

            <GlassInfoBox type="tip" title="Batch processing">
                Seller and Pro plans support batches of up to 25 files. If you're refreshing an entire product catalog, this is significantly faster than processing images one by one.
            </GlassInfoBox>
        </section>

        <!-- Section 5 -->
        <section id="results" class="scroll-mt-24">
            <SectionHeading>Results and privacy notes</SectionHeading>
            <p class="mb-4">Stores that pre-compress with Jpegli typically see LCP improvements of <strong>200–500 ms</strong> on product pages - run a before/after test in PageSpeed Insights to confirm your specific gains.</p>
            <p class="mb-4">If you sell from a home address or shoot products at a private location, EXIF stripping is not optional; it is essential. Mochify strips GPS coordinates, device identifiers, and embedded thumbnails by default on every file. Files are processed in RAM and never written to disk - zero retention, no cloud storage.</p>
            <p class="mb-4">Compress free at <a href="https://mochify.app">mochify.app</a> - describe what you need, privacy-first, no login required.</p>
        </section>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
