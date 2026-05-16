<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Should I Optimize My Images Before I Upload Them?",
        description: "Should you optimize images before upload? Almost always yes. A practical guide covering LCP, EXIF privacy, formats, and the right workflow for Shopify, WordPress, and marketplaces.",
        category: "Image Optimization",
        readTime: "15 min read",
        date: "April 13, 2026"
    };

    const related = [
        {
            title: "The Risks of EXIF Data in Image Compression (2026 Guide)",
            href: "/guides/exif-data-risks-image-compression-2026",
            desc: "What EXIF contains, who can read it, and why stripping it before upload protects your privacy and GDPR compliance."
        },
        {
            title: "Optimizing Hero Images for Web Performance: A 2026 Guide",
            href: "/guides/optimizing-hero-images",
            desc: "Step-by-step guide to compressing hero images, diagnosing LCP failures, and deploying web-ready variants."
        },
        {
            title: "How to Use Jpegli for Shopify Product Images",
            href: "/guides/jpegli-shopify-product-images",
            desc: "How Google's jpegli encoder delivers up to 35% smaller JPEGs at high quality, and how to use it for product image workflows."
        },
        {
            title: "The 2026 Guide to Next-Gen Formats: WebP, AVIF, and JPEG XL",
            href: "/guides/2026-guide-next-gen-formats",
            desc: "Format-by-format breakdown with browser support data, compression benchmarks, and practical recommendations by use case."
        }
    ];

    const toc = [
        { id: "short-answer", num: "01", label: "The Short Answer: Yes, But Not Always in the Same Way" },
        { id: "why-it-matters", num: "02", label: "Why Pre-Upload Optimization Still Matters" },
        { id: "when-definitely", num: "03", label: "When You Definitely Should Optimize Before Upload" },
        { id: "when-optional", num: "04", label: "When Pre-Upload Optimization is Optional or Secondary" },
        { id: "image-factors", num: "05", label: "The Image Factors That Actually Matter" },
        { id: "audience-advice", num: "06", label: "Audience-Specific Advice: What Should You Do?" },
        { id: "decision-framework", num: "07", label: "A Simple Decision Framework" },
        { id: "workflow", num: "08", label: "The Best Pre-Upload Workflow with Mochify" },
        { id: "prompt-examples", num: "09", label: "Magic Flow Prompt Examples for Every Audience" },
        { id: "misconceptions", num: "10", label: "Common Misconceptions to Avoid" },
        { id: "faq", num: "11", label: "FAQ" }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/should-i-optimize-images-before-upload" />

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Should I Optimize My Images Before I Upload Them?",
        "description": "A practical guide to pre-upload image optimization: when it is mandatory, when it is optional, and the right workflow for Shopify, WordPress, and marketplaces.",
        "url": "https://mochify.app/guides/should-i-optimize-images-before-upload",
        "datePublished": "2026-04-13",
        "dateModified": "2026-04-13",
        "inLanguage": "en",
        "author": { "@type": "Organization", "name": "Mochify Engineering Team" },
        "isPartOf": { "@type": "CollectionPage", "name": "Image Optimization Guides", "url": "https://mochify.app/guides" },
        "publisher": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app"},
                {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides"},
                {"@type": "ListItem", "position": 3, "name": "Should I Optimize My Images Before I Upload Them?", "item": "https://mochify.app/guides/should-i-optimize-images-before-upload"}
            ]
        }
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Do I still need to optimize images before uploading to Shopify if it already compresses them?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. Shopify's CDN performs compression and format conversion, but it works from whatever original you upload. A 10MB camera file as a starting point means the CDN is working harder, generating derivatives from a much larger source, and may compound compression artifacts. Resize to 2048x2048px and compress before upload so the CDN has a clean, correctly-sized input to work from." }
            },
            {
                "@type": "Question",
                "name": "What size should my product images be for Shopify, Etsy, or Amazon?",
                "acceptedAnswer": { "@type": "Answer", "text": "Shopify's sweet spot is 2048x2048px at under 400KB. Etsy recommends 2000-3000px on the longest side for zoom quality. Amazon requires a minimum 1000px on the longest side and recommends 2000px or more. All three benefit from pre-upload EXIF stripping and compression to jpegli JPEG or WebP." }
            },
            {
                "@type": "Question",
                "name": "Is WebP or AVIF better for my website images?",
                "acceptedAnswer": { "@type": "Answer", "text": "WebP is the safer default at about 96% browser support. AVIF typically achieves 20-50% better compression than WebP at equivalent visual quality and has about 93% support, but benefits from a JPEG fallback for older browsers and email clients. For ecommerce product images where every byte matters, AVIF with JPEG fallback is the stronger choice if your platform supports picture elements." }
            },
            {
                "@type": "Question",
                "name": "How small should my images be for good Core Web Vitals?",
                "acceptedAnswer": { "@type": "Answer", "text": "For LCP, Google targets under 2.5 seconds on a 75th-percentile mobile connection. Practical targets: hero images under 200KB, product images under 400KB, inline blog images under 200KB." }
            },
            {
                "@type": "Question",
                "name": "Do I really need to strip EXIF metadata before I upload photos?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes, especially for photos taken at personal or client locations. EXIF commonly contains GPS coordinates accurate to a few meters, device serial numbers, and timestamps. GDPR classifies this as personal data when it can identify individuals. Many platforms do not reliably remove it. Stripping EXIF before upload is the only guarantee." }
            },
            {
                "@type": "Question",
                "name": "What's the safest default workflow if I don't want to think about settings?",
                "acceptedAnswer": { "@type": "Answer", "text": "Use Mochify's Magic Flow with this prompt: 'Make these web-ready: max 1600px wide, prefer WebP or AVIF, keep each file under 250KB, strip all EXIF metadata.' That covers dimensions, format selection, compression, and privacy in one step." }
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
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Should I Optimize My Images Before I Upload Them?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            In almost every case, yes — not because platforms do nothing, but because you need predictable performance, visual quality, and privacy. The nuance is in <em>how</em> you optimize.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl mb-4">
            <p class="text-[#6C3F31] leading-relaxed text-base">
                This guide covers when pre-upload optimization is mandatory, when it's optional, which image factors actually matter (LCP, EXIF, formats, dimensions), and step-by-step workflows with Magic Flow prompt examples for Shopify, WordPress, marketplaces, developers, photographers, and privacy-sensitive work.
            </p>
        </div>

        <p class="text-sm text-[#875F42]">Published 13 April 2026 by the <strong class="text-[#6C3F31]">Mochify Engineering Team</strong></p>
    </header>

    <div class="space-y-12 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <section>
            <SectionHeading>What's in this guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    {#each toc as item}
                    <li>
                        <a href="#{item.id}" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform flex-shrink-0">{item.num}</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors text-sm md:text-base">{item.label}</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    {/each}
                </ul>
            </nav>
        </section>

        <!-- Cheat Sheet -->
        <section>
            <SectionHeading>Cheat sheet: pre-upload optimization at a glance</SectionHeading>

            <div class="overflow-x-auto rounded-xl border border-pink-100 shadow-sm mb-6">
                <table class="w-full text-left bg-white text-base">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">Scenario</th>
                            <th class="p-4 font-black">Optimize before upload?</th>
                            <th class="p-4 font-black">Key reason</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Shopify product images</td><td class="p-4">Yes, strongly recommended</td><td class="p-4">Control 2048×2048px sizing, EXIF stripping; CDN then works from better inputs</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">WordPress hero images</td><td class="p-4">Yes, mandatory for good LCP</td><td class="p-4">Hero images are the most common LCP bottleneck; pre-compressed WebP/AVIF keeps LCP under 2.5s</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Etsy / eBay / Amazon listings</td><td class="p-4">Yes, especially for privacy</td><td class="p-4">Marketplaces re-compress but rarely strip EXIF reliably; GPS data can leak</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Next.js with image CDN</td><td class="p-4">Recommended for normalization, optional for final compression</td><td class="p-4">CDN generates optimized variants; clean source inputs still reduce artifact risk</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Social media</td><td class="p-4">Recommended, not critical for performance</td><td class="p-4">Platforms compress heavily; EXIF risk persists in some download contexts</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Small icons, logos, SVGs</td><td class="p-4">Usually no</td><td class="p-4">File weight is minimal; build tools handle these</td></tr>
                        <tr><td class="p-4 font-bold text-[#4A2C2C]">Archive masters / RAW files</td><td class="p-4">No — keep originals, optimize delivery copies</td><td class="p-4">Protect fidelity for future reuse</td></tr>
                    </tbody>
                </table>
            </div>

            <InfoBox type="tip" title="Magic Flow safe default prompt">
                "Make these web-ready: max 1600px wide, prefer WebP or AVIF, keep each file under 250KB, strip all EXIF metadata."
            </InfoBox>
        </section>

        <!-- 01 -->
        <section id="short-answer" class="scroll-mt-24">
            <SectionHeading>The short answer: yes, but not always in the same way</SectionHeading>
            <p class="mb-4">In almost every case, you should optimize images before upload — not because platforms do nothing, but because you need predictable performance, visual quality, and privacy. The nuance is in <em>how</em> you optimize: a Shopify product photo and an archive master for a Next.js CDN pipeline call for very different approaches.</p>
            <p class="mb-4">The safe default is: resize to the largest display size you'll actually need, compress with a modern encoder, strip EXIF metadata, and keep your original separately. That single workflow eliminates the most common causes of slow pages, GDPR-sensitive metadata leaks, and opaque platform re-compression surprises.</p>
        </section>

        <!-- 02 -->
        <section id="why-it-matters" class="scroll-mt-24">
            <SectionHeading>Why pre-upload optimization still matters</SectionHeading>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Images, Core Web Vitals, and SEO</h3>
            <p class="mb-4">Pre-upload image optimization is one of the clearest levers for improving Largest Contentful Paint (LCP), which Google uses as a confirmed ranking signal. Images are often the largest element on the page — when they're bloated, the LCP timer keeps running. Multiple audits show that unoptimized images routinely account for 50–80% of total page bytes on ecommerce pages, and replacing a 2MB hero JPEG with a properly compressed WebP or AVIF at the same dimensions can cut LCP by several seconds on a mobile connection.</p>
            <p class="mb-4">Better Core Web Vitals translate directly into visibility. Research from DebugBear and others has documented cases where improving Web Vitals scores increased the number of URLs with "Good" rankings by hundreds of percent, with corresponding lifts in organic impressions. For an image-heavy site — ecommerce stores, portfolios, publisher blogs — getting images right before they ever hit your CMS is the single highest-leverage thing you can do.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">How platforms actually handle your images</h3>
            <p class="mb-4">Shopify's CDN automatically generates multiple responsive sizes and can serve WebP based on browser support. WordPress stores the original plus multiple derivatives. Etsy and Amazon both re-compress at ingest. So the question isn't "do they optimize anything?" — they do. The question is whether you're comfortable with opaque, platform-defined defaults.</p>
            <p class="mb-4">The problem with relying entirely on platform processing is unpredictability. Shopify can convert to WebP but still serves your original as the base for all transformations — if that original is a 12MB DSLR file, every generated size is working from unnecessarily large source material, and aggressive CDN re-compression often introduces visible sharpness loss. WordPress plugin behaviour varies wildly by host and configuration. Marketplaces don't publish their compression parameters. Optimizing before upload puts you in control of the quality-to-size trade-off rather than discovering it after launch.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Privacy and EXIF: what your metadata reveals</h3>
            <p class="mb-4">This is the angle most platform documentation skips entirely. Every JPEG and HEIC you shoot with a smartphone or modern camera contains EXIF metadata — and that data commonly includes GPS coordinates accurate to a few meters, device make/model and serial numbers, timestamps, and sometimes face recognition tags.</p>
            <p class="mb-4">GDPR classifies this as personal data when it can identify individuals. Many marketplaces and social platforms re-compress images but don't reliably remove EXIF in all contexts — some allow "download original" functionality that delivers your file intact. If you photograph products at home, in a client's studio, or at a private location, the GPS coordinates are embedded in every shot.</p>
            <p class="mb-4">Mochify strips EXIF by default as part of the processing pipeline, with an explicit opt-in to retain it when needed (for example, professional photographers preserving copyright metadata). Files are processed in RAM only and wiped immediately — they never touch disk, and they're never stored. Your location data doesn't leave your control.</p>

            <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100">
                <h3 class="text-lg font-black text-[#4A2C2C] mb-3">Prepare your images before they leave your machine</h3>
                <p class="text-[#6C3F31] leading-relaxed mb-4">Strip EXIF, resize, and compress in one step. No account needed to start.</p>
                <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 no-underline text-base">
                    Try it free
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </a>
            </div>
        </section>

        <!-- 03 -->
        <section id="when-definitely" class="scroll-mt-24">
            <SectionHeading>When you definitely should optimize before upload</SectionHeading>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Product images for Shopify, Etsy, eBay, and Amazon</h3>
            <p class="mb-4">Yes — strongly. Product photos are typically the heaviest assets on listing pages and the most likely LCP elements. Each marketplace has its own recommended dimensions: Etsy recommends at least 2000px on the longest side for full zoom quality, Amazon requires a minimum of 1000px but recommends 2000px or more, and eBay best practice lands around 1600×1600px. None of them gives you fine-grained guidance on compression — that's your job.</p>
            <p class="mb-4">Camera JPEGs and HEIC files from modern smartphones are routinely 5–12MB. Uploading those directly means the platform is working from massive originals, often re-compressing in ways that hurt sharpness at zoom. More importantly: none of these platforms consistently strips EXIF. If your product photography includes shots from your home, workshop, or client location, the GPS coordinates are in every file you upload.</p>
            <p class="mb-4">The right workflow: convert to jpegli JPEG, WebP, or AVIF at the platform's recommended dimensions, target a clean file size (300–500KB for most marketplace images is realistic without visible quality loss), and strip all EXIF before upload.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">WordPress heroes, galleries, and WooCommerce stores</h3>
            <p class="mb-4">Yes — this is the scenario where pre-upload optimization makes the biggest measurable difference. WordPress stores the original file plus multiple auto-generated sizes. Every heavy original you upload stays in your database and backups forever, and on shared hosting, the CPU cost of generating derivatives slows down initial processing.</p>
            <p class="mb-4">Hero images are the most frequent cause of poor LCP scores in Lighthouse and PageSpeed Insights audits. A 2400px-wide WebP or AVIF hero compressed to under 200KB will consistently outperform a 3MB JPEG on mobile, regardless of what your caching or CDN layer does on top.</p>

            <InfoBox type="tip" title="Skip the plugins">
                Many WordPress performance guides push users toward image optimization plugins. These add database overhead, API dependencies on third-party services, and often require paid subscriptions. Optimizing before upload with an external tool means your WordPress install stays lean and the media library receives already-correct files.
            </InfoBox>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Client work, NDA assets, and sensitive locations</h3>
            <p class="mb-4">Always optimize (and strip EXIF) before upload when the images involve client locations, private facilities, or personally identifiable subjects. GDPR, UK GDPR, and similar frameworks treat location and device data as personal data. The safest position is to ensure that metadata never leaves the controlled environment at all.</p>
            <p class="mb-4">Mochify's zero-retention, in-memory pipeline is specifically built for this: there is no disk write, no server-side log of the files processed, and no persistent storage. For agency workflows where client assets must stay confidential, this is a meaningful differentiator versus SaaS tools that retain your files for days or weeks.</p>
        </section>

        <!-- 04 -->
        <section id="when-optional" class="scroll-mt-24">
            <SectionHeading>When pre-upload optimization is optional or secondary</SectionHeading>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Modern image CDNs and build-time pipelines</h3>
            <p class="mb-4">If you're running a Next.js site with Cloudflare Images, Imgix, or a similar image CDN in front, the CDN is generating AVIF/WebP/JPEG variants on-the-fly from your source assets. In this setup, the priority isn't aggressive pre-compression — it's <strong>normalization</strong>. You want clean inputs: consistent sRGB colour profile, sensible maximum dimensions (a 3000px long edge is plenty), and EXIF stripped. The CDN handles the rest.</p>
            <p class="mb-4">Use Mochify here as a normalization step, not a final-delivery encoder. A Magic Flow prompt like <em>"normalize for CDN: 3000px long edge, sRGB, strip EXIF, master format lossless WebP, keep visual quality very high"</em> gives the CDN a clean, compact source without sacrificing fidelity.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Archival masters and high-fidelity photos</h3>
            <p class="mb-4">Never let your master file become a lossy, pre-compressed web copy. Photographers, design teams, and archive managers should always retain a high-quality original — whether that's a RAW file, a lossless TIFF, or a high-quality JPEG XL — in local or controlled storage. The "optimize before upload" advice in this guide refers to preparing delivery copies, not replacing your masters with heavily compressed versions.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Tiny icons, logos, and SVGs</h3>
            <p class="mb-4">For icons, UI graphics, and SVGs, standard build tools already handle minification and caching effectively. File sizes are typically minimal (under 20KB), and the performance impact of manual pre-optimization is negligible.</p>
        </section>

        <!-- 05 -->
        <section id="image-factors" class="scroll-mt-24">
            <SectionHeading>The image factors that actually matter</SectionHeading>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Dimensions</h3>
            <p class="mb-4">Oversized dimensions are the primary driver of bloated file sizes. A 4000px-wide camera image displayed in a 1200px column contains four times the pixel data that will ever be rendered — and every pixel costs bytes. Resize to the largest display size you'll actually need (with some headroom for Retina/HiDPI: 2× is usually sufficient), and you'll often achieve 70–80% file size reduction before any encoder-level compression is applied.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">File size and compression</h3>
            <p class="mb-4">Common red flags: any image over 500KB on a product listing page, any hero image over 1MB, any inline blog image over 200KB. For encoding efficiency: AVIF typically achieves around 50% smaller files than JPEG at comparable visual quality, and WebP commonly saves 25–35% versus JPEG. Mochify's jpegli encoder delivers up to 35% better compression at high quality versus standard libjpeg-turbo/MozJPEG encoders, producing standard JPEG files that work everywhere.</p>

            <div class="bg-[#FFF9F5] rounded-3xl p-6 border border-orange-100 mb-4">
                <p class="text-xs font-black text-[#875F42] uppercase tracking-wider mb-2">Real benchmark</p>
                <p class="text-[#6C3F31] text-base">A typical 5.2MB camera JPEG product photo, resized to 2048×2048px and compressed with jpegli at quality 82, consistently comes in at 280–340KB with no visible quality loss at normal zoom levels. That's a 93%+ reduction with full zoom fidelity retained.</p>
            </div>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Format choice: JPEG, WebP, AVIF, PNG, JPEG XL</h3>
            <p class="mb-4">Each format has a genuinely different use case. Don't default to "always AVIF" or "always WebP" without considering the destination:</p>
            <ul class="list-disc pl-6 mb-6 space-y-2 marker:text-[#F06292]">
                <li><strong>WebP:</strong> About 96% browser support, 25–35% smaller than JPEG. Safe default for almost all web delivery.</li>
                <li><strong>AVIF:</strong> 20–50% smaller than WebP at equivalent quality, ~93% browser support. Strong choice for product photography where file size matters most.</li>
                <li><strong>JPEG (via jpegli):</strong> Still necessary for email, older marketplace APIs, and anywhere AVIF/WebP isn't supported. Standard JPEG container — compatible everywhere.</li>
                <li><strong>PNG:</strong> Use for logos, UI screenshots, and graphics with transparency or sharp edges.</li>
                <li><strong>JPEG XL:</strong> Excellent archival format, but delivery support is still niche at ~12–17% in 2026. Don't use it as your primary web format yet.</li>
            </ul>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">EXIF metadata and privacy guarantees</h3>
            <p class="mb-4">EXIF can add 30–80KB to each file (a minor but real bandwidth cost) and carries significant privacy and compliance risk. Strip it before upload as a default. The only time to retain EXIF is when you have a specific professional reason — copyright metadata for press photography, capture date for archival workflows — and in those cases, do it explicitly with an opt-in.</p>
        </section>

        <!-- 06 -->
        <section id="audience-advice" class="scroll-mt-24">
            <SectionHeading>Audience-specific advice: what should you do?</SectionHeading>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Ecommerce sellers and Shopify stores</h3>
            <p class="mb-4">Optimize everything before upload. Convert HEIC or camera JPEGs to jpegli JPEG or WebP/AVIF at marketplace-specific dimensions. Strip all EXIF. For Shopify specifically: target 2048×2048px and under 400KB. For Etsy/eBay/Amazon: 2000–2500px on the longest side, under 500KB, JPEG or WebP.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">WordPress and WooCommerce site owners</h3>
            <p class="mb-4">Pre-upload optimization replaces the need for most image optimization plugins. Resize hero images to your theme's max content width (usually 1400–1600px), convert to WebP, target under 200KB for inline images and under 350KB for product images. Upload the optimized copy, not the original.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Developers and technical teams</h3>
            <p class="mb-4">Use Mochify as a normalization and build-time step rather than a final delivery encoder. The REST API (<code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">POST /v1/prompt</code> at <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">api.mochify.app</code>) and CLI (<code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">--prompt</code> flag) support Magic Flow, so you can integrate natural-language optimization prompts into CI pipelines or preprocessing scripts. The MCP server lets AI agents request optimized variants inline, without a browser tab.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Designers, photographers, and agencies</h3>
            <p class="mb-4">Keep your masters. Treat pre-upload optimization as producing delivery variants from those masters, not replacing them. For web portfolios and client review links, target 2560px long edge, jpegli at quality 85, under 1MB. For client deliverables, strip GPS and device serial numbers as a default. For HEIC input from iPhone shoots, Mochify converts directly to AVIF/WebP/JPEG without manual intermediate steps.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Privacy-conscious users and casual creators</h3>
            <p class="mb-4">The "just strip EXIF and resize" use case is fully served on the free tier, with no account required for up to 3 files per session. Use the Magic Flow default prompt, download the optimized files, upload to wherever you're sharing. The free tier gives you 25 images per month.</p>
        </section>

        <!-- 07 -->
        <section id="decision-framework" class="scroll-mt-24">
            <SectionHeading>A simple decision framework</SectionHeading>
            <p class="mb-6">Work through these five questions before uploading any image:</p>

            <ol class="space-y-3 mb-6">
                {#each [
                    ["Is this likely to be an LCP element or an important product/hero asset?", "If yes, optimize before upload — dimensions, format, and compression are all on the table."],
                    ["Does the destination platform auto-optimize with a CDN or dynamic format conversion?", "If yes, focus on normalization (clean dimensions, sRGB, EXIF stripped) rather than aggressive compression."],
                    ["Does the image contain sensitive metadata (GPS, client data, device info)?", "If yes, strip EXIF before upload regardless of everything else."],
                    ["Do you need a high-quality master for future reuse?", "If yes, archive that master separately and treat pre-upload optimization as preparing a delivery copy."],
                    ["Are you on shared hosting or resource-constrained infrastructure?", "If yes, push more work to pre-upload tools to reduce server-side processing load."]
                ] as [q, a], i}
                <li class="flex gap-4 items-start p-5 bg-white border border-pink-50 rounded-2xl shadow-sm">
                    <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span><strong>{q}</strong> {a}</span>
                </li>
                {/each}
            </ol>

            <InfoBox type="note" title="If you're unsure">
                The safe default: resize to your largest display need, compress with WebP or jpegli JPEG, strip EXIF, and keep the original locally. That single step addresses LCP, privacy, and platform unpredictability in one go.
            </InfoBox>
        </section>

        <!-- 08 -->
        <section id="workflow" class="scroll-mt-24">
            <SectionHeading>The best pre-upload workflow with Mochify</SectionHeading>

            <div class="bg-gradient-to-b from-[#FFF5F7] to-[#FDFBF7] rounded-3xl border border-pink-100 p-6 md:p-8 mb-6">
                <ol class="space-y-8">
                    {#each [
                        ["Keep a master, work from copies", "Before running anything through Mochify, make sure you have a retained high-quality original. Export from Lightroom at high quality, or keep the unedited camera file. Mochify processes files in-memory and returns optimized copies — your source never changes — but the discipline of maintaining a separate master protects you from over-compression mistakes."],
                        ["Describe the goal in plain English (Magic Flow)", null],
                        ["Download web-ready files and upload to your platform", "Download the processed batch. These are the files that go to Shopify, WordPress, your marketplace, your CMS. Not the originals. Check one or two at the largest display size to confirm sharpness — especially for product images that will be zoomed."],
                        ["Check Core Web Vitals and iterate", "After deploying, run PageSpeed Insights on your key pages. Check LCP specifically. If you're still seeing LCP warnings, tighten your dimensions or file size targets, then re-run through Mochify with adjusted Magic Flow prompts."]
                    ] as [title, body], i}
                    <li class="flex gap-4 items-start">
                        <span class="w-10 h-10 rounded-full bg-[#F06292] flex items-center justify-center text-white font-black text-base flex-shrink-0">{i + 1}</span>
                        <div>
                            <p class="font-black text-[#4A2C2C] mb-2">{title}</p>
                            {#if i === 1}
                            <p class="mb-3">Open <a href="https://mochify.app" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app</a>, upload your files (up to 25 at a time on paid tiers, up to 3 per session on the free tier without signup), and type what you need in the prompt field. You don't need to know encoder settings or format flags. Magic Flow parses your prompt, maps intent to compression parameters, and passes them to the processing engine.</p>
                            <div class="bg-blue-50 rounded-2xl border border-blue-100 p-4 text-sm text-[#4A2C2C] italic space-y-1">
                                <p>"Shopify product photos, 2048px square, jpegli JPEG, under 400KB, strip EXIF"</p>
                                <p>"WordPress blog images, 1400px wide, WebP, under 200KB, strip all metadata"</p>
                                <p>"Marketplace listings for Etsy, 2500px longest edge, high quality, no location data"</p>
                            </div>
                            {:else}
                            <p>{body}</p>
                            {/if}
                        </div>
                    </li>
                    {/each}
                </ol>

                <div class="border-t border-pink-100 mt-6 pt-4">
                    <p class="text-sm text-[#875F42]">All files are processed in-memory and wiped immediately after download. Zero disk storage. Zero retention. Your files never leave your control.</p>
                </div>
            </div>
        </section>

        <!-- 09 -->
        <section id="prompt-examples" class="scroll-mt-24">
            <SectionHeading>Magic Flow prompt examples for every audience</SectionHeading>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Shopify and ecommerce</h3>
            <div class="rounded-2xl overflow-hidden border border-pink-100 shadow-sm mb-6">
                <div class="bg-[#4A2C2C] px-5 py-3"><span class="text-pink-200 text-xs font-black uppercase tracking-widest">Magic Flow prompts</span></div>
                <pre class="bg-[#2D1B1B] text-[#FFF0F3] text-sm p-6 overflow-x-auto leading-relaxed whitespace-pre-wrap"><code>"Optimize these Shopify product photos: 2048x2048px, jpegli JPEG, keep them under 400KB, strip EXIF, and make sure they stay sharp when zoomed."

"Convert these iPhone product photos to JPEG for Etsy listings, 2500px on the longest edge, aim for 300-500KB each, pure sRGB color, and strip all EXIF/location data."

"Prepare these product images for Amazon: 2000x2000px square, white background preserved, high-quality jpegli JPEG, under 500KB, no metadata."</code></pre>
            </div>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">WordPress and publishers</h3>
            <div class="rounded-2xl overflow-hidden border border-pink-100 shadow-sm mb-6">
                <div class="bg-[#4A2C2C] px-5 py-3"><span class="text-pink-200 text-xs font-black uppercase tracking-widest">Magic Flow prompts</span></div>
                <pre class="bg-[#2D1B1B] text-[#FFF0F3] text-sm p-6 overflow-x-auto leading-relaxed whitespace-pre-wrap"><code>"Prepare these blog images for WordPress: 1400px content width, prefer WebP, keep files under 200KB, strip EXIF, and keep text in screenshots crisp."

"Create WooCommerce product images: 1600px square, WebP plus a high-quality JPEG fallback, under 350KB, no metadata."

"Prepare this as a homepage hero image: 2400px wide, AVIF first with JPEG fallback, target under 200KB if possible without banding, remove all metadata."</code></pre>
            </div>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Developers (API / CLI / MCP)</h3>
            <div class="rounded-2xl overflow-hidden border border-pink-100 shadow-sm mb-6">
                <div class="bg-[#4A2C2C] px-5 py-3"><span class="text-pink-200 text-xs font-black uppercase tracking-widest">API / CLI</span></div>
                <pre class="bg-[#2D1B1B] text-[#FFF0F3] text-sm p-6 overflow-x-auto leading-relaxed whitespace-pre-wrap"><code>"Normalize this asset set for a Next.js image CDN: convert everything to sRGB, longest edge 3000px, keep near-lossless quality, strip EXIF, output lossless WebP as masters."

CLI:      --prompt "normalize for CDN: 3000px long edge, sRGB, strip EXIF, master format lossless WebP, keep visual quality very high"

REST API: POST /v1/prompt  {'{"prompt": "compress these for web delivery: max 1600px, WebP, under 250KB, strip all metadata"}'}</code></pre>
            </div>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-6">Designers, photographers, and agencies</h3>
            <div class="rounded-2xl overflow-hidden border border-pink-100 shadow-sm mb-6">
                <div class="bg-[#4A2C2C] px-5 py-3"><span class="text-pink-200 text-xs font-black uppercase tracking-widest">Magic Flow prompts</span></div>
                <pre class="bg-[#2D1B1B] text-[#FFF0F3] text-sm p-6 overflow-x-auto leading-relaxed whitespace-pre-wrap"><code>"Create web portfolio versions of these photos: 2560px on the long edge, jpegli JPEG around quality 85, target 800KB-1.2MB each, keep all visual detail, strip EXIF."

"Compress these HEIC files to jpegli JPEG for a client handoff, 2000px longest edge, keep visual quality high, strip all EXIF including location."

"Compress this batch of client photos for review links: 1600px wide, good quality, under 400KB, strip all EXIF including GPS, timestamps, and device IDs."</code></pre>
            </div>
        </section>

        <!-- 10 -->
        <section id="misconceptions" class="scroll-mt-24">
            <SectionHeading>Common misconceptions to avoid</SectionHeading>

            <div class="space-y-4">
                {#each [
                    ["Platforms always optimize everything for me.", "Shopify, CDNs, and some CMSs do optimize, but behaviour varies considerably. Many marketplaces re-compress for size but don't strip EXIF or guarantee optimal formats. You can't verify what their encoder settings are or predict when their defaults change."],
                    ["Smaller is always better.", "Pushing images to extreme compression levels causes banding, colour shifts, and ringing artifacts that are immediately visible to users — and damage brand perception on product pages. The goal is optimal quality-per-byte, not the absolute minimum file size."],
                    ["One format fits all.", "WebP is a safe default for most web delivery. AVIF is often 20–50% smaller but requires a JPEG fallback for older clients. Email and some marketplace APIs still require JPEG. PNG is still the right choice for logos and sharp UI graphics."],
                    ["Plugins replace pre-upload optimization.", "Plugin bloat — additional database tables, API calls to third-party services, processing queue overhead — is itself a performance problem. A clean upload is always better than a plugin patching a messy one."],
                    ["I should upload originals and let the platform sort it.", "Uploading full-resolution DSLR files (5–20MB) is the most common cause of poor LCP and oversized page weight. These originals also persist in your database and backups forever."]
                ] as [myth, reality]}
                <div class="bg-blue-50 rounded-2xl border border-blue-100 p-5">
                    <p class="font-black text-[#4A2C2C] mb-1">"{myth}"</p>
                    <p class="text-[#6C3F31] text-base">{reality}</p>
                </div>
                {/each}
            </div>
        </section>

        <!-- 11 FAQ -->
        <section id="faq" class="scroll-mt-24">
            <SectionHeading>FAQ</SectionHeading>

            <div class="space-y-6">
                {#each [
                    ["Do I still need to optimize images before uploading to Shopify if it already compresses them?", "Yes. Shopify's CDN performs compression and format conversion, but it works from whatever original you upload. A 10MB camera file as a starting point means the CDN is working harder, generating derivatives from a much larger source, and may compound compression artifacts. Resize to 2048×2048px and compress before upload so the CDN has a clean, correctly-sized input to work from."],
                    ["What size should my product images be for Shopify, Etsy, or Amazon?", "Shopify's sweet spot is 2048×2048px at under 400KB. Etsy recommends 2000–3000px on the longest side for zoom quality. Amazon requires a minimum 1000px on the longest side and recommends 2000px or more. All three benefit from pre-upload EXIF stripping and compression to jpegli JPEG or WebP."],
                    ["Is WebP or AVIF better for my website images?", "WebP is the safer default at about 96% browser support. AVIF typically achieves 20–50% better compression than WebP at equivalent visual quality and has about 93% support, but benefits from a JPEG fallback for older browsers and email clients. For ecommerce product images where every byte matters, AVIF with JPEG fallback is the stronger choice if your platform supports <picture> elements."],
                    ["How small should my images be for good Core Web Vitals?", "For LCP, Google targets under 2.5 seconds on a 75th-percentile mobile connection. Practical targets: hero images under 200KB, product images under 400KB, inline blog images under 200KB. These targets assume images are sized to their display dimensions — a 2400px hero that displays at 1400px is carrying unnecessary pixels regardless of compression."],
                    ["Do I really need to strip EXIF metadata before I upload photos?", "Yes, especially for photos taken at personal or client locations. EXIF commonly contains GPS coordinates accurate to a few meters, device serial numbers, and timestamps. GDPR classifies this as personal data when it can identify individuals. Many platforms don't reliably remove it, even after re-compression. Stripping EXIF before upload is the only guarantee."],
                    ["Can WordPress plugins replace pre-upload optimization?", "They partially overlap, but plugins have real downsides: database overhead, API dependencies on third-party services, processing latency on shared hosting, and subscription costs. Pre-upload optimization with an external tool means your WordPress install receives already-correct files, reducing the work plugins need to do — or eliminating the need for them entirely on the image side."],
                    ["What's the safest default workflow if I don't want to think about settings?", "Use Mochify's Magic Flow with this prompt: \"Make these web-ready: max 1600px wide, prefer WebP or AVIF, keep each file under 250KB, strip all EXIF metadata.\" That covers dimensions, format selection, compression, and privacy in one step. Keep your originals in a separate folder before you start."],
                    ["Should I convert everything to a single format before upload?", "No. Match the format to the destination: WebP for most web delivery, AVIF for bandwidth-critical product images with modern CDN support, JPEG (jpegli) for email and legacy APIs, PNG for logos and transparency-dependent graphics. Magic Flow can handle this per-batch if you describe the destination platform in your prompt."]
                ] as [q, a], i}
                <div class="pb-6 {i < 7 ? 'border-b border-pink-50' : ''}">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">{q}</h3>
                    <p class="text-[#6C3F31]">{a}</p>
                </div>
                {/each}
            </div>
        </section>

        <RelatedGuides guides={related} />

    </div>
</article>
