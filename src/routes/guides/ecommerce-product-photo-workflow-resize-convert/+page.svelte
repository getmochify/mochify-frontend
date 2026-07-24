<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';

    const metadata = {
        title: "Ecommerce Product Photo Workflow: Resize & Convert in One Prompt",
        description: "How to batch-convert product photos to JPG at 1200px and 800px with a single natural-language prompt. The fastest workflow for Shopify, Etsy, eBay, and Amazon sellers.",
        category: "Workflows",
        readTime: "4 min read",
        date: "May 2026",
        lastUpdated: "July 24, 2026"
    };

    const faqItems = [
        {
            q: "Why 1200px and 800px specifically?",
            a: "1200px covers the product detail page on every major platform - Shopify, Etsy, eBay, and Amazon all recommend at least 1000px on the long edge for zoom. 800px hits the grid and thumbnail sizes used for category pages and search results. Running both in one job means you only process each photo once."
        },
        {
            q: "Can I use AVIF or WebP instead of JPG for Shopify?",
            a: "Yes - Shopify accepts WebP and AVIF uploads. If you're uploading to Shopify directly, WebP at 1200px gives smaller files and better LCP scores. Use JPG when you need the broadest compatibility: eBay, Amazon, Etsy, Mercari, and most marketplace bulk-upload tools still work most reliably with JPEG."
        },
        {
            q: "Does Mochify create both sizes from a single upload?",
            a: "Yes. When your prompt requests two sizes, Magic Flow calls the squish engine twice per file and returns both outputs in a single ZIP. You don't need to upload the same photo twice."
        },
        {
            q: "How many product photos can I process at once?",
            a: "Free accounts can process 3 files per batch. Seller ($7.99/month) and Pro ($24.99/month) unlock batches up to 25 files. For larger catalogs, use the CLI: mochify *.jpg --prompt 'convert to jpg, resize to 1200px and 800px' processes an entire folder in one command."
        },
        {
            q: "Will resizing to 1200px upscale small images?",
            a: "No. Mochify never upscales. If an image is already smaller than the requested width, it's returned at its original size. Always shoot at full resolution and let Mochify size down."
        },
        {
            q: "Should I strip EXIF data from product photos?",
            a: "Yes, by default. Product photos often carry GPS coordinates from your home studio, device serial numbers, and shoot timestamps - none of which belong in a public listing. Mochify strips EXIF by default on every job. Add 'keep metadata' to your prompt only if you need to preserve copyright fields for editorial licensing."
        }
    ];

    const relatedGuides = [
        { href: '/guides/what-image-format-should-i-use-for-product-photos', title: 'What Image Format Should I Use for Product Photos?', desc: 'AVIF, WebP, or JPEG - the practical format fallback order for ecommerce product images.' },
        { href: '/guides/jpegli-shopify-product-images', title: 'How to Use Jpegli for Shopify Product Images', desc: 'Pre-compress before upload to stop Shopify recompression degrading your image quality.' },
        { href: '/guides/ai-image-compression-natural-language-2026', title: 'AI-Powered Image Compression: How Magic Flow Works', desc: "How Mochify's natural-language feature maps plain-English prompts to processing parameters." },
        { href: '/guides/exif-data-risks-image-compression-2026', title: 'The Risks of EXIF Data in Image Compression', desc: 'Why stripping metadata from product photos matters before uploading to a public listing.' },
        { href: '/guides/ai-image-compression-conversion', title: 'AI Image Compression and Conversion: Describe the Result, Skip the Settings', desc: 'AI image compression and conversion in one prompt, no manual format or quality settings.' },
        { href: '/guides/do-marketplace-product-images-need-to-be-square', title: 'Do Marketplace Product Images Need to Be Square?', desc: 'What the major marketplaces actually require for product image dimensions and cropping.' },
        { href: '/guides/vinted-photos-that-sell', title: 'How to Take Vinted Photos That Sell', desc: 'Light, backgrounds, the real size facts, and a one-prompt batch workflow.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://mochify.app/guides/ecommerce-product-photo-workflow-resize-convert" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Ecommerce Product Photo Workflow: Resize & Convert in One Prompt",
        "description": "How to batch-convert product photos to JPG at 1200px and 800px with a single natural-language prompt. The fastest workflow for Shopify, Etsy, eBay, and Amazon sellers.",
        "url": "https://mochify.app/guides/ecommerce-product-photo-workflow-resize-convert",
        "datePublished": "2026-05-23",
        "dateModified": "2026-07-24",
        "inLanguage": "en",
        "author": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" },
        "publisher": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" },
        "isPartOf": { "@type": "CollectionPage", "name": "Image Optimization Guides", "url": "https://mochify.app/guides" },
        "about": [
            { "@type": "Thing", "name": "Ecommerce product photography" },
            { "@type": "Thing", "name": "Image resizing workflow" },
            { "@type": "Thing", "name": "Shopify image optimization" },
            { "@type": "Thing", "name": "Magic Flow natural language" }
        ],
        "keywords": "ecommerce product photo workflow, resize product images, convert jpg 1200px 800px, Shopify image workflow, Magic Flow prompt, batch image resize"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "Ecommerce Product Photo Workflow", "item": "https://mochify.app/guides/ecommerce-product-photo-workflow-resize-convert" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "Ecommerce Product Photo Workflow: Convert to JPG & Resize to 1200px and 800px",
        "description": "How to batch-convert product photos to JPG at 1200px and 800px with a single natural-language prompt in Mochify. Works for Shopify, Etsy, eBay, and Amazon sellers.",
        "thumbnailUrl": "https://i.ytimg.com/vi/82GUWkHjmm0/hqdefault.jpg",
        "uploadDate": "2026-05-23",
        "duration": "PT25S",
        "embedUrl": "https://www.youtube.com/embed/82GUWkHjmm0",
        "url": "https://www.youtube.com/shorts/82GUWkHjmm0",
        "publisher": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" }
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
            "@type": "Question",
            "name": "Why 1200px and 800px specifically?",
            "acceptedAnswer": { "@type": "Answer", "text": "1200px covers the product detail page on every major platform. 800px hits the grid and thumbnail sizes used for category pages and search results." }
            },
            {
            "@type": "Question",
            "name": "Does Mochify create both sizes from a single upload?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes. When your prompt requests two sizes, Magic Flow runs the squish engine twice per file and returns both outputs in a single ZIP." }
            },
            {
            "@type": "Question",
            "name": "Should I strip EXIF data from product photos?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes, by default. Product photos often carry GPS coordinates from your home studio, device serial numbers, and shoot timestamps. Mochify strips EXIF by default on every job." }
            }
        ]
        }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider border border-green-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.date}{metadata.lastUpdated ? ` · Updated ${metadata.lastUpdated}` : ''}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Ecommerce Product Photo Workflow: Resize &amp; Convert in One Prompt
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Product photos from a camera are never the right size or format for a marketplace listing. Here's the fastest way to fix that - one prompt, two sizes, done.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                This guide walks through the workflow shown in the video above: drop your product shots into Magic Flow, type a single natural-language prompt, and download a ZIP with both sizes ready for your listing - no format pickers, no quality sliders, no repeat uploads.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- YouTube Short -->
        <section>
            <SectionHeading>See It in Action</SectionHeading>
            <p>This short shows the full workflow from upload to download in under a minute:</p>

            <div class="flex justify-center my-8">
                <div class="w-full max-w-[300px]">
                    <div class="relative rounded-2xl overflow-hidden shadow-lg border border-pink-100" style="aspect-ratio: 9/16;">
                        <iframe
                            src="https://www.youtube.com/embed/82GUWkHjmm0"
                            title="Ecommerce product photo workflow - convert to JPG, resize to 1200px and 800px with Mochify"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen
                            class="absolute inset-0 w-full h-full"
                        ></iframe>
                    </div>
                    <p class="text-center text-sm text-[#875F42] mt-3 font-medium">One prompt. Two sizes. Done.</p>
                </div>
            </div>
        </section>

        <!-- Table of Contents -->
        <section>
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-4 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    {#each [
                        { n: '01', href: '#the-prompt', label: 'The prompt' },
                        { n: '02', href: '#why-two-sizes', label: 'Why these two dimensions' },
                        { n: '03', href: '#format-choice', label: 'Format choice for marketplace listings' },
                        { n: '04', href: '#cli', label: 'Running it from the CLI for full catalogs' },
                        { n: '05', href: '#variations', label: 'Prompt variations worth knowing' },
                        { n: '06', href: '#faq', label: 'FAQ' },
                    ] as item}
                        <li>
                            <a href={item.href} class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                                <span class="flex items-center gap-4">
                                    <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">{item.n}</span>
                                    <span class="text-[#4A2C2C] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                                </span>
                                <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </section>

        <!-- 01 The Prompt -->
        <section id="the-prompt">
            <SectionHeading>The Prompt</SectionHeading>
            <p>The workflow in the video comes down to a single line typed into Magic Flow:</p>

            <div class="my-6 rounded-2xl border border-pink-200 bg-[#FFF5F7] px-6 py-5">
                <p class="text-xs font-bold tracking-widest uppercase text-[#F06292]/70 mb-2">✦ Magic Flow prompt</p>
                <p class="text-[1.75rem] font-black text-[#4A2C2C] m-0">"convert to jpg, resize to 1200px and 800px"</p>
            </div>

            <p>Magic Flow parses that intent and runs the squish engine twice per file - once at 1200px, once at 800px - returning both outputs in a single ZIP. No format picker, no slider for each size, no second upload. The engine resolves width-only instructions against the longest edge and preserves the original aspect ratio unless you explicitly ask for a crop.</p>

            <InfoBox type="tip" title="EXIF is stripped by default">
                Product photos often carry GPS coordinates from your home studio, device serial numbers, and shoot timestamps. Mochify strips all EXIF metadata automatically on every job. Add <strong>"keep metadata"</strong> to the prompt only if you need to preserve copyright fields for editorial licensing.
            </InfoBox>
        </section>

        <!-- 02 Why Two Sizes -->
        <section id="why-two-sizes">
            <SectionHeading>Why These Two Dimensions</SectionHeading>
            <p>Most ecommerce platforms expect two sizes from the same product shot:</p>

            <ScrollableTable class="my-6">
                <table class="w-full border-collapse text-sm">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Size</th>
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Use</th>
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Platforms</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white">
                            <td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">1200px</td>
                            <td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">Product detail page, zoom</td>
                            <td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">Shopify, Etsy, eBay, Amazon, your own site</td>
                        </tr>
                        <tr class="bg-[#FDFBF7]">
                            <td class="px-4 py-3 text-[#6C3F31] font-black">800px</td>
                            <td class="px-4 py-3 text-[#6C3F31]">Category grid, search results, thumbnails</td>
                            <td class="px-4 py-3 text-[#6C3F31]">Shopify collections, Etsy search, eBay gallery</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>

            <p>Running both from a single upload means your original file is processed once, not twice. No quality loss from re-processing a previously compressed image.</p>
        </section>

        <!-- 03 Format Choice -->
        <section id="format-choice">
            <SectionHeading>Format Choice for Marketplace Listings</SectionHeading>
            <p>AVIF and WebP compress better and improve Core Web Vitals on your own Shopify storefront. But JPG is the safe default for marketplace workflows because:</p>

            <ul class="list-none pl-0 space-y-2 my-6">
                {#each [
                    "eBay's bulk upload tool requires JPEG",
                    "Amazon's image pipeline recompresses everything to JPEG internally anyway",
                    "Etsy accepts WebP but most cross-listing tools (Vendoo, CrosslistApp) expect JPEG",
                    "Third-party logistics and fulfillment platforms almost universally expect JPEG",
                ] as point}
                    <li class="flex items-start gap-3">
                        <span class="text-[#F06292] font-black mt-0.5 shrink-0">→</span>
                        <span class="text-[#6C3F31]">{point}</span>
                    </li>
                {/each}
            </ul>

            <p>Get the format or file size wrong and you'll run straight into <a href="https://mochify.app/guides/ebay-image-file-not-supported">eBay's "file not supported" error and the 12 MB limit</a>, so it's worth resizing and converting before you upload rather than after a listing bounces.</p>

            <p>If you're uploading directly to Shopify and nowhere else, swap <code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-px rounded text-sm font-mono">jpg</code> for <code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-px rounded text-sm font-mono">webp</code> or <code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-px rounded text-sm font-mono">avif</code> in the prompt and you'll get 25–50% smaller files with no compatibility trade-off.</p>

            <InfoBox type="note" title="Mochify uses jpegli for JPEG output">
                All JPEG output uses Google's jpegli encoder, which produces files roughly 25–35% smaller than standard libjpeg at equivalent visual quality. The output is a fully standard JPEG - compatible with every platform, CMS, and image tool.
            </InfoBox>

            <p>Selling second-hand on Vinted? The same one-prompt approach works there, with a portrait twist - see <a href="/guides/vinted-photos-that-sell">our guide to taking Vinted photos that sell</a>.</p>
        </section>

        <!-- 04 CLI -->
        <section id="cli">
            <SectionHeading>Running It from the CLI for Full Catalogs</SectionHeading>
            <p>For a full product catalog, the CLI processes an entire folder in one command:</p>

            <pre class="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed my-4"><code>mochify *.jpg --prompt "convert to jpg, resize to 1200px and 800px" --output ./ready/</code></pre>

            <p>Every JPEG in the current folder gets both size variants written to <code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-px rounded text-sm font-mono">./ready/</code> with <code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-px rounded text-sm font-mono">_1200w</code> and <code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-px rounded text-sm font-mono">_800w</code> suffixes. No per-file loop, no shell scripting. Install the CLI via:</p>

            <pre class="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed my-4"><code>cargo install mochify</code></pre>
        </section>

        <!-- Inline CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3 mt-0">Try it now - drop your product photos</h3>
            <p class="text-[#6C3F31] max-w-md mx-auto relative z-10 mb-6 text-base">3 images free, no account needed. Type the prompt, upload your shots, download both sizes.</p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Open Magic Flow →
            </a>
        </div>

        <!-- 05 Variations -->
        <section id="variations">
            <SectionHeading>Prompt Variations Worth Knowing</SectionHeading>
            <p>The same pattern extends to other common ecommerce scenarios. Here are the most useful variants:</p>

            <div class="space-y-4 my-6">
                {#each [
                    {
                        prompt: '"convert to webp, resize to 1200px and 800px"',
                        note: 'Same workflow, 30–40% smaller files. Use when uploading directly to Shopify.'
                    },
                    {
                        prompt: '"optimize for eBay"',
                        note: "Applies eBay's recommended 1600px JPEG preset automatically - no dimensions needed."
                    },
                    {
                        prompt: '"convert to jpg, crop to 1:1, resize to 1080px"',
                        note: 'Square crop centered on the subject - the correct format for Instagram product posts.'
                    },
                    {
                        prompt: '"convert to jpg, resize to 2000px, smart compress"',
                        note: 'High-res for Amazon A+ content, saliency-guided quality for the smallest file at that resolution.'
                    },
                    {
                        prompt: '"convert to jpg, resize to 1200px and 800px, remove background"',
                        note: 'Same dual-size workflow with AI background removal. Requires Seller or Pro plan.'
                    },
                ] as v}
                    <div class="rounded-2xl border border-pink-100 bg-white p-5">
                        <p class="font-black text-[#4A2C2C] font-mono text-sm mb-2 m-0">{v.prompt}</p>
                        <p class="text-sm text-[#875F42] m-0">{v.note}</p>
                    </div>
                {/each}
            </div>

            <p>The time this workflow saves compounds with every listing you process - one prompt instead of manual resizing per photo, per size. If you're weighing whether reselling at volume is worth the hours, see <a href="/guides/is-reselling-worth-it">the honest math on whether reselling is worth it</a>.</p>
        </section>

        <!-- FAQ -->
        <GuideFAQs items={faqItems} />

        <!-- Final CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3 mt-0">Ready to process your catalog?</h3>
            <p class="text-[#6C3F31] max-w-md mx-auto relative z-10 mb-6 text-base">Start free. Upgrade for batches up to 25 files, background removal, and priority processing.</p>
            <a href="/pricing" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                See plans &amp; pricing →
            </a>
        </div>

        <!-- Related Guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <ul class="space-y-3">
                {#each relatedGuides as guide}
                    <li>
                        <a href={guide.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">— {guide.desc}</span></span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </section>

    </div>
</article>
