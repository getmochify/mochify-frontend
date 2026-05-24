<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';

    const metadata = {
        title: "Ecommerce Product Photo Workflow: Resize & Convert in One Prompt",
        description: "How to batch-convert product photos to JPG at 1200px and 800px with a single natural-language prompt. The fastest workflow for Shopify, Etsy, eBay, and Amazon sellers.",
        category: "Workflows",
        readTime: "4 min read",
        date: "May 2026"
    };

    const faqItems = [
        {
            q: "Why 1200px and 800px specifically?",
            a: "1200px covers the product detail page on every major platform — Shopify, Etsy, eBay, and Amazon all recommend at least 1000px on the long edge for zoom. 800px hits the grid and thumbnail sizes used for category pages and search results. Running both in one job means you only process each photo once."
        },
        {
            q: "Can I use AVIF or WebP instead of JPG for Shopify?",
            a: "Yes — Shopify accepts WebP and AVIF uploads. If you're uploading to Shopify directly, WebP at 1200px gives smaller files and better LCP scores. Use JPG when you need the broadest compatibility: eBay, Amazon, Etsy, Mercari, and most marketplace bulk-upload tools still work most reliably with JPEG."
        },
        {
            q: "Does Mochify create both sizes from a single upload?",
            a: "Yes. When your prompt requests two sizes, Magic Flow calls the squish engine twice per file and returns both outputs in a single ZIP. You don't need to upload the same photo twice."
        },
        {
            q: "How many product photos can I process at once?",
            a: "Free accounts can process 3 files per batch. Seller ($7.99/month) and Pro ($24.99/month) unlock batches up to 25 files. For larger catalogues, use the CLI: mochify *.jpg --prompt 'convert to jpg, resize to 1200px and 800px' processes an entire folder in one command."
        },
        {
            q: "Will resizing to 1200px upscale small images?",
            a: "No. Mochify never upscales. If an image is already smaller than the requested width, it's returned at its original size with a note in the response. Always shoot at full resolution and let Mochify size down."
        },
        {
            q: "Should I strip EXIF data from product photos?",
            a: "Yes, by default. Product photos often carry GPS coordinates from your home studio, device serial numbers, and shoot timestamps — none of which belong in a public listing. Mochify strips EXIF by default on every job. If you need to preserve copyright metadata for editorial use, add 'keep metadata' to your prompt."
        }
    ];

    const relatedGuides = [
        { href: '/guides/what-image-format-should-i-use-for-product-photos', title: 'What Image Format Should I Use for Product Photos?', desc: 'AVIF, WebP, or JPEG — the practical format fallback order for ecommerce.' },
        { href: '/guides/jpegli-shopify-product-images', title: 'How to Use Jpegli for Shopify Product Images', desc: 'Pre-compress before upload to stop Shopify recompression degrading quality.' },
        { href: '/guides/ai-image-compression-natural-language-2026', title: 'AI-Powered Image Compression: How Magic Flow Works', desc: "How Mochify's natural-language feature maps plain-English prompts to processing parameters." },
        { href: '/guides/exif-data-risks-image-compression-2026', title: 'The Risks of EXIF Data in Image Compression', desc: 'Why stripping metadata from product photos matters for privacy.' },
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
    <link rel="canonical" href="https://mochify.app/guides/ecommerce-product-photo-workflow-resize-convert" />
    {@html `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": metadata.title,
        "description": metadata.description,
        "author": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" },
        "publisher": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-05-23",
        "dateModified": "2026-05-23",
        "mainEntityOfPage": { "@type": "WebPage", "@id": "https://mochify.app/guides/ecommerce-product-photo-workflow-resize-convert" }
    })}</script>`}
</svelte:head>

<article class="guide-content px-4 py-8 md:py-16 md:px-8">

    <header class="mb-12">
        <div class="flex items-center gap-3 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold uppercase tracking-wider">
                {metadata.category}
            </span>
            <span class="text-xs text-[#875F42]/60 font-medium">{metadata.date} · {metadata.readTime}</span>
        </div>
        <h1>{metadata.title}</h1>
        <p class="text-xl text-[#6C3F31] leading-relaxed mt-6 max-w-2xl">
            Drop your product photos, type one line, and get two correctly sized JPGs back — ready for your listing. No settings panels, no repeat uploads, no guessing dimensions.
        </p>
    </header>

    <!-- YouTube Short embed -->
    <div class="flex justify-center mb-12">
        <div class="w-full max-w-[320px]">
            <div class="relative rounded-2xl overflow-hidden shadow-lg border border-pink-100" style="aspect-ratio: 9/16;">
                <iframe
                    src="https://www.youtube.com/embed/82GUWkHjmm0"
                    title="Ecommerce product photo workflow — convert to JPG, resize to 1200px and 800px with Mochify"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    class="absolute inset-0 w-full h-full"
                ></iframe>
            </div>
            <p class="text-center text-xs text-[#875F42]/60 mt-3">One prompt. Two sizes. Done.</p>
        </div>
    </div>

    <h2>The prompt</h2>

    <p>The workflow in the video comes down to a single line typed into Magic Flow:</p>

    <div class="my-8 rounded-2xl border border-pink-100 bg-[#FFF5F7] px-6 py-5">
        <p class="text-xs font-bold tracking-widest uppercase text-[#F06292]/60 mb-2">✦ Magic Flow prompt</p>
        <p class="text-xl font-black text-[#4A2C2C] m-0">"convert to jpg, resize to 1200px and 800px"</p>
    </div>

    <p>That's it. Magic Flow parses the intent and runs the squish engine twice per file — once at 1200px, once at 800px — returning both outputs in a single ZIP download. No format picker, no slider for each size, no second upload.</p>

    <h2>Why these two dimensions</h2>

    <p>Most ecommerce platforms expect two sizes from the same product shot:</p>

    <div class="overflow-x-auto rounded-xl border border-pink-100 shadow-sm my-8">
        <table class="w-full text-left bg-white">
            <thead class="bg-pink-50 text-[#4A2C2C]">
                <tr>
                    <th class="p-4 font-black text-sm">Size</th>
                    <th class="p-4 font-black text-sm">Use</th>
                    <th class="p-4 font-black text-sm">Platforms</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                <tr>
                    <td class="p-4 font-bold">1200px</td>
                    <td class="p-4">Product detail page, zoom</td>
                    <td class="p-4">Shopify, Etsy, eBay, Amazon, your own site</td>
                </tr>
                <tr>
                    <td class="p-4 font-bold">800px</td>
                    <td class="p-4">Category grid, search results, thumbnails</td>
                    <td class="p-4">Shopify collections, Etsy search, eBay gallery</td>
                </tr>
            </tbody>
        </table>
    </div>

    <p>Running both from a single upload means your original file is processed once, not twice. No quality loss from re-processing a previously compressed image.</p>

    <h2>Why JPG for marketplace listings</h2>

    <p>AVIF and WebP compress better and would improve your Core Web Vitals on your own Shopify storefront. But JPG is the safe default for marketplace workflows because:</p>

    <ul>
        <li>eBay's bulk upload tool requires JPEG</li>
        <li>Amazon's image upload pipeline recompresses everything to JPEG internally anyway</li>
        <li>Etsy accepts WebP but most seller tools (e.g. Vendoo, CrosslistApp) expect JPEG</li>
        <li>Third-party logistics and fulfilment platforms almost universally expect JPEG</li>
    </ul>

    <p>If you're uploading directly to Shopify and nowhere else, swap <code>jpg</code> for <code>webp</code> or <code>avif</code> in the prompt and you'll get smaller files with no compatibility trade-off.</p>

    <InfoBox type="tip" title="EXIF is stripped by default">
        Product photos often carry GPS coordinates from your home studio, device serial numbers, and shoot timestamps. Mochify strips all EXIF metadata automatically on every job. Add <strong>"keep metadata"</strong> to the prompt only if you need to preserve copyright fields for editorial licensing.
    </InfoBox>

    <h2>Running it from the CLI</h2>

    <p>If you're processing a full product catalogue, the CLI handles the whole folder in one go:</p>

    <pre><code>mochify *.jpg --prompt "convert to jpg, resize to 1200px and 800px" --output ./ready/</code></pre>

    <p>Every JPEG in the current folder gets both size variants written to <code>./ready/</code> with <code>_1200w</code> and <code>_800w</code> suffixes. No per-file loop, no shell scripting.</p>

    <h2>Variations worth knowing</h2>

    <p>The same pattern extends to other common ecommerce scenarios:</p>

    <ul>
        <li><strong>"convert to webp, resize to 1200px and 800px"</strong> — same workflow, 30–40% smaller files for direct Shopify upload</li>
        <li><strong>"convert to jpg, resize to 2000px, smart compress"</strong> — high-res for Amazon A+ content, saliency-guided quality for the smallest file at that resolution</li>
        <li><strong>"optimise for eBay"</strong> — applies eBay's recommended 1600px JPEG preset automatically, no dimensions needed</li>
        <li><strong>"convert to jpg, crop to 1:1, resize to 1080px"</strong> — square crop centred on the subject, the correct format for Instagram product posts</li>
        <li><strong>"convert to jpg, resize to 1200px and 800px, remove background"</strong> — same dual-size workflow with AI background removal (Seller or Pro plan)</li>
    </ul>

    <h2>Frequently asked questions</h2>

    <div class="space-y-4 mt-6">
        {#each faqItems as item}
            <details class="group rounded-2xl border border-pink-100 bg-white shadow-sm open:shadow-md transition-all">
                <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] text-sm select-none">
                    {item.q}
                    <span class="text-[#F06292] group-open:rotate-180 transition-transform text-lg font-black shrink-0 ml-4">↓</span>
                </summary>
                <p class="px-5 pb-5 text-sm text-[#6C3F31] leading-relaxed m-0">{item.a}</p>
            </details>
        {/each}
    </div>

    <div class="my-16 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50"></div>
        <div class="relative z-10">
            <span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm mb-4">
                Free Tool
            </span>
            <h3 class="text-2xl font-black text-[#4A2C2C] mb-3">Try it now — drop your product photos</h3>
            <p class="text-[#6C3F31] max-w-md mx-auto mb-6 leading-relaxed">
                3 images free, no account needed. Type the prompt, upload your shots, download both sizes.
            </p>
            <a href="/" class="inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
                Open Magic Flow
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>
    </div>

    <section>
        <h2>Related guides</h2>
        <ul class="space-y-3 list-none pl-0">
            {#each relatedGuides as g}
                <li class="m-0 p-0 before:hidden">
                    <a href={g.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                        <span class="flex flex-col gap-1">
                            <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{g.title}</span>
                            <span class="text-xs text-[#875F42]/60">{g.desc}</span>
                        </span>
                        <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                    </a>
                </li>
            {/each}
        </ul>
    </section>

</article>
