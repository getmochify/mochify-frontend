<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';

    const metadata = {
        title: "How to Compress and Optimize AI-Generated Images (in Automated and Agent Workflows)",
        description: "AI image compression for generated assets: why diffusion outputs are huge, which formats win, and how to automate the optimize-after-generation step in an agent pipeline.",
        category: "AI & Automation",
        readTime: "15 min read",
        date: "July 2, 2026"
    };

    const inlineCode = "bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100";

    const toc = [
        { n: '01', href: '#why-optimize', label: 'Why AI-Generated Images Need Optimizing' },
        { n: '02', href: '#optimization-moves', label: 'The Optimization Moves That Actually Matter' },
        { n: '03', href: '#tool-call-pattern', label: 'Automating It: The Agent Tool-Call Pattern' },
        { n: '04', href: '#workflows', label: 'Three Real-World Workflows You Can Copy' },
        { n: '05', href: '#privacy', label: 'The Privacy Angle for Generated Client Assets' },
        { n: '06', href: '#mochify-workflow', label: 'Mochify Workflow: Optimizing Generated Images Inside an Agent' },
        { n: '07', href: '#cheat-sheet', label: 'Cheat Sheet: AI Image Optimization at a Glance' },
        { n: '08', href: '#faq', label: 'FAQ' },
    ];

    const cheatSheet = [
        { decision: 'Delivery format', def: 'AVIF, with WebP then JPEG/PNG fallback', why: '~50% smaller than JPEG, 20-30% smaller than WebP at matched quality' },
        { decision: 'Master/source format', def: 'PNG', why: 'Lossless, alpha, pixel-exact for re-edits' },
        { decision: 'Target dimensions', def: 'Resize to display size (e.g. 1600px long edge, 1200x630 social)', why: 'Source-resolution everywhere is the biggest avoidable waste' },
        { decision: 'Metadata', def: 'Strip EXIF/IPTC/XMP', why: '15-30% smaller, no visual change, no leaked internal detail' },
        { decision: 'Where bytes go in an agent', def: 'File path in, file path out (never inline pixels)', why: 'A 1 MP image is ~1,334 tokens; inline batches blow the context' },
        { decision: 'Automation surface', def: 'Tool call via MCP / CI build step / CDN', why: 'Deterministic, repeatable, observable' },
        { decision: 'JPEG XL', def: 'Skip for web delivery', why: 'Near-zero browser support outside Safari' },
        { decision: 'Client/NDA assets', def: 'Zero-retention processor + DPA', why: 'Data minimisation; avoid third-party retention' },
    ];

    const faqs = [
        {
            q: "Why are AI-generated images so large by default?",
            a: "Generators output at high dimensions (commonly 1024-2048px per side) in lossless or near-lossless formats, usually PNG. DALL-E 3 PNGs at 1024x1024 have been reported around 3 MB, and Midjourney V7 upscales to a 2048x2048 canvas. Those settings are sensible for a master file but far heavier than the web needs, which is why an optimize-after-generation step matters."
        },
        {
            q: "What format should I convert AI images to for the web?",
            a: `AVIF is the strongest default, typically around 50% smaller than JPEG and 20-30% smaller than WebP at matched quality, with browser support now above 95% of global usage. Use WebP as the broad-compatibility fallback and JPEG or PNG below that. Serve the chain with a <code class="${inlineCode}">&lt;picture&gt;</code> element or an image CDN that negotiates by <code class="${inlineCode}">Accept</code> header.`
        },
        {
            q: "How much smaller can compressing a generated PNG actually make it?",
            a: "A lot. Google's reference figures put lossless WebP at 26% smaller than PNG and lossy WebP 25-34% smaller than JPEG. AVIF goes further still. In a worked 2026 comparison, a 2000x2000 image dropped from 540 KB as JPEG to 210 KB as AVIF, a 61% reduction, before you even account for resizing to display dimensions."
        },
        {
            q: "Why shouldn't I pass generated images straight into my agent's context?",
            a: `Image tokens are expensive. Claude's vision docs give roughly <code class="${inlineCode}">width * height / 750</code> tokens per image, so a 1-megapixel image is about 1,334 tokens and ten of them exceed 13,000 before any work starts. The efficient pattern is an MCP tool that takes a file path and returns a new path, keeping pixels out of the model entirely.`
        },
        {
            q: "How do I automate image optimization in an AI pipeline?",
            a: "Three established patterns: an agent tool call (generate, then call an optimization tool that returns a compressed path), a CI build step (a GitHub Action recompresses images on each pull request), or CDN/framework-level conversion at the edge. All three keep the compression deterministic and separate from generation. Pick the one that matches where your assets live."
        },
        {
            q: "Does Mochify's local MCP server keep my generated images private?",
            a: `It is zero-retention, but be precise about what that means. Images travel to <code class="${inlineCode}">api.mochify.app</code> over HTTPS, are processed in RAM, and are wiped immediately with no source disk writes and no logs containing file data. The local binary is a client over that API, not a local encoder, so the accurate claim is zero-retention rather than "never leaves your machine." Because the local path uses no pickup store, compressed bytes return straight to your disk, end to end.`
        },
        {
            q: "Can I optimize generated images and PDFs in the same agent workflow?",
            a: `Yes. Mochify treats documents like web assets, so the CLI, both MCP surfaces, and the REST API handle PDFs alongside images via the <code class="${inlineCode}">POST /v1/pdf</code> endpoint: extract pages as PNG/JPEG/WebP, or split a multi-page PDF into single pages, all Magic Flow-capable. Video is the exception: it is processed client-side in the web app only, so keep video out of CLI, MCP, and API workflows.`
        },
        {
            q: "Is AVIF or JPEG XL the better choice for archiving my source generations?",
            a: "For an archive where browser support is irrelevant, JPEG XL can edge AVIF at high qualities. For anything you will deliver on the web, AVIF wins on support: JPEG XL has effectively no support outside Safari as of early 2026. Most teams keep a lossless PNG or original generation as the master and deliver AVIF."
        }
    ];

    const related = [
        { href: '/guides/on-device-ai-agents-image-optimization', title: 'On-Device AI Agents: Image and PDF Optimization for Local Workflows', desc: 'The hardware and local-MCP context behind running these workflows on your own machine, and why local agents do not automatically mean local data.' },
        { href: '/guides/how-the-mochify-mcp-server-works', title: 'How the Mochify MCP Server Works: Hosted vs Local', desc: "A full comparison of the two MCP surfaces: the hosted server's five-minute URL pickup versus the local server's zero-retention file-path return." },
        { href: '/guides/ai-agent-workflow-automation-photographers', title: 'AI Agent Workflow Automation for Photographers', desc: 'The same tool-call patterns applied to a photography post-processing pipeline: batch conversion, EXIF stripping, and delivery formatting.' },
        { href: '/guides/mochify-mcp-image-compression-agent-2026', title: 'How to Use Mochify via MCP', desc: 'Step-by-step setup for both MCP surfaces, with config examples for Claude Desktop and Claude Code.' },
        { href: '/guides/2026-guide-next-gen-formats', title: 'The 2026 Guide to Next-Gen Formats: WebP, AVIF, JPEG XL', desc: 'The deep dive on format choice, benchmarks, and browser support behind the recommendations here.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>AI Image Compression - Optimize Generated Assets in Agent Workflows</title>
    <meta name="description" content={metadata.description}>
    <link rel="canonical" href="https://mochify.app/guides/compress-optimize-ai-generated-images" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="How to Compress and Optimize AI-Generated Images (in Automated and Agent Workflows)" />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/compress-optimize-ai-generated-images" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="How to Compress and Optimize AI-Generated Images in Agent Workflows" />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "How to Compress and Optimize AI-Generated Images (in Automated and Agent Workflows)",
        "description": "AI image compression for generated assets: why diffusion outputs are huge, which formats win, and how to automate the optimize-after-generation step in an agent pipeline.",
        "url": "https://mochify.app/guides/compress-optimize-ai-generated-images",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/compress-optimize-ai-generated-images"
        },
        "datePublished": "2026-07-02",
        "dateModified": "2026-07-02",
        "inLanguage": "en",
        "author": {
            "@type": "Organization",
            "name": "Mochify Engineering Team",
            "url": "https://mochify.app"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app",
            "logo": {
                "@type": "ImageObject",
                "url": "https://mochify.app/logo.png"
            }
        },
        "isPartOf": {
            "@type": "WebSite",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "about": [
            { "@type": "Thing", "name": "AI image compression" },
            { "@type": "Thing", "name": "Image optimization" },
            { "@type": "Thing", "name": "AVIF" },
            { "@type": "Thing", "name": "WebP" },
            { "@type": "Thing", "name": "AI agent workflows" },
            { "@type": "Thing", "name": "Model Context Protocol" }
        ],
        "keywords": "ai image compression, ai image optimization, automate image optimization, compress ai images, convert png to webp, reduce png file size",
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".article-intro", "h1"]
        }
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app/" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "How to Compress and Optimize AI-Generated Images", "item": "https://mochify.app/guides/compress-optimize-ai-generated-images" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "How to Compress and Optimize AI-Generated Images (in Automated and Agent Workflows)",
        "url": "https://mochify.app/guides/compress-optimize-ai-generated-images",
        "description": "AI image compression for generated assets: why diffusion outputs are huge, which formats win, and how to automate the optimize-after-generation step in an agent pipeline.",
        "isPartOf": { "@type": "WebSite", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-07-02",
        "dateModified": "2026-07-02"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "Why are AI-generated images so large by default?", "acceptedAnswer": { "@type": "Answer", "text": "Generators output at high dimensions (commonly 1024-2048px per side) in lossless or near-lossless formats, usually PNG. DALL-E 3 PNGs at 1024x1024 have been reported around 3 MB, and Midjourney V7 upscales to a 2048x2048 canvas. Those settings are sensible for a master file but far heavier than the web needs, which is why an optimize-after-generation step matters." } },
            { "@type": "Question", "name": "What format should I convert AI images to for the web?", "acceptedAnswer": { "@type": "Answer", "text": "AVIF is the strongest default, typically around 50% smaller than JPEG and 20-30% smaller than WebP at matched quality, with browser support now above 95% of global usage. Use WebP as the broad-compatibility fallback and JPEG or PNG below that. Serve the chain with a picture element or an image CDN that negotiates by Accept header." } },
            { "@type": "Question", "name": "How much smaller can compressing a generated PNG actually make it?", "acceptedAnswer": { "@type": "Answer", "text": "A lot. Google's reference figures put lossless WebP at 26% smaller than PNG and lossy WebP 25-34% smaller than JPEG. AVIF goes further still. In a worked 2026 comparison, a 2000x2000 image dropped from 540 KB as JPEG to 210 KB as AVIF, a 61% reduction, before you even account for resizing to display dimensions." } },
            { "@type": "Question", "name": "Why shouldn't I pass generated images straight into my agent's context?", "acceptedAnswer": { "@type": "Answer", "text": "Image tokens are expensive. Claude's vision docs give roughly width times height divided by 750 tokens per image, so a 1-megapixel image is about 1,334 tokens and ten of them exceed 13,000 before any work starts. The efficient pattern is an MCP tool that takes a file path and returns a new path, keeping pixels out of the model entirely." } },
            { "@type": "Question", "name": "How do I automate image optimization in an AI pipeline?", "acceptedAnswer": { "@type": "Answer", "text": "Three established patterns: an agent tool call (generate, then call an optimization tool that returns a compressed path), a CI build step (a GitHub Action recompresses images on each pull request), or CDN/framework-level conversion at the edge. All three keep the compression deterministic and separate from generation. Pick the one that matches where your assets live." } },
            { "@type": "Question", "name": "Does Mochify's local MCP server keep my generated images private?", "acceptedAnswer": { "@type": "Answer", "text": "It is zero-retention, but be precise about what that means. Images travel to api.mochify.app over HTTPS, are processed in RAM, and are wiped immediately with no source disk writes and no logs containing file data. The local binary is a client over that API, not a local encoder, so the accurate claim is zero-retention rather than never leaves your machine. Because the local path uses no pickup store, compressed bytes return straight to your disk, end to end." } },
            { "@type": "Question", "name": "Can I optimize generated images and PDFs in the same agent workflow?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Mochify treats documents like web assets, so the CLI, both MCP surfaces, and the REST API handle PDFs alongside images via the POST /v1/pdf endpoint: extract pages as PNG/JPEG/WebP, or split a multi-page PDF into single pages, all Magic Flow-capable. Video is the exception: it is processed client-side in the web app only, so keep video out of CLI, MCP, and API workflows." } },
            { "@type": "Question", "name": "Is AVIF or JPEG XL the better choice for archiving my source generations?", "acceptedAnswer": { "@type": "Answer", "text": "For an archive where browser support is irrelevant, JPEG XL can edge AVIF at high qualities. For anything you will deliver on the web, AVIF wins on support: JPEG XL has effectively no support outside Safari as of early 2026. Most teams keep a lossless PNG or original generation as the master and deliver AVIF." } }
        ]
        }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-[#F06292] text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            How to Compress and Optimize AI-Generated Images (in Automated and Agent Workflows)
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            AI image generators emit large, lossless or near-lossless files at print-scale dimensions, so a single generated asset can weigh several megabytes before you have done anything with it. That is fine as a master, and wrong for the web. AI image compression is the step that turns a 3 MB generation into a sub-500 KB asset your page, app, or repo can actually ship.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published July 2026 by the Mochify Engineering Team.</strong>
                This guide stays in the generated-asset and agent-pipeline lane: how to automate the optimize-after-generation step without leaking client data or blowing your agent's token budget.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-4 border border-pink-100 shadow-inner" aria-label="Table of contents">
                <ul class="space-y-3">
                    {#each toc as item}
                        <li>
                            <a href={item.href} class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                                <span class="flex items-center gap-4">
                                    <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">{item.n}</span>
                                    <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                                </span>
                                <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </section>

        <section id="why-optimize" class="scroll-mt-24">
            <SectionHeading>Why AI-Generated Images Need Optimizing</SectionHeading>
            <p>AI image generators emit large, lossless or near-lossless files at print-scale dimensions, so a single generated asset can weigh several megabytes before you have done anything with it. That is fine as a master, and wrong for the web. AI image compression is the step that turns a 3 MB generation into a sub-500 KB asset your page, app, or repo can actually ship.</p>
            <p>The numbers behind the problem are concrete. DALL-E 3 outputs at 1024x1024, 1024x1792, or 1792x1024, defaulting to PNG unless you explicitly ask for something else, and API users have reported 1024x1024 PNG responses landing at roughly 3 MB when compression is minimal. Midjourney V7 upscales its default 1:1 output to 2048x2048, a 4-megapixel canvas that produces multi-megabyte files if exported as PNG or high-quality JPEG without down-sampling. Stable Diffusion 1.5 generates at a native 512x512 and SDXL nearer 1024x1024, both of which are then routinely upscaled, compounding file weight at every stage if no optimization step exists.</p>
            <p>Here is why that matters downstream. Images remain the single largest contributor to page weight, sitting at roughly 40% of total transfer size on a median page according to HTTP Archive data. A generated hero illustration dropped onto a page unoptimized is almost always the Largest Contentful Paint element, and Google's guidance is to <a href="https://web.dev/articles/optimize-lcp" target="_blank" rel="noopener noreferrer">keep LCP under 2.5 seconds</a>, explicitly naming large, unoptimized images as a leading cause of slow LCP. A 3 MB above-the-fold PNG, on a mobile connection, is the difference between passing and failing Core Web Vitals.</p>
            <p>There is a cost angle too. A pipeline that generates hundreds or thousands of images a week for content, listings, or experimentation pays for every megabyte in object storage and CDN egress. Keeping assets in the 2-4 MB band instead of the sub-500 KB range achievable with a resize-plus-modern-format step multiplies those bills across thumbnails, variants, and experiment branches that never needed to be stored at source resolution.</p>
        </section>

        <section id="optimization-moves" class="scroll-mt-24">
            <SectionHeading>The Optimization Moves That Actually Matter</SectionHeading>
            <p>Three moves do almost all the work: pick a modern format, resize to the size you will actually display, and strip the metadata. Everything else is a refinement on top of these.</p>
            <h3 class="text-xl font-black text-[#4A2C2C] mt-7 mb-3">Format choice is the biggest lever</h3>
            <p>For generated imagery destined for the web, the priority order is AVIF, then WebP, with JPEG (via the jpegli encoder) and PNG as fallbacks. Google's WebP reference figures put <a href="https://developers.google.com/speed/webp" target="_blank" rel="noopener noreferrer">lossless WebP at 26% smaller than PNG and lossy WebP at 25-34% smaller than JPEG</a> at equivalent quality. AVIF, built on the AV1 codec, goes further: independent comparisons and <a href="https://web.dev/learn/images/avif" target="_blank" rel="noopener noreferrer">web.dev's AVIF documentation</a> describe roughly 50% reductions versus JPEG and 20-30% versus WebP at matched quality, with particular strength on the photographic detail and gradients common in diffusion output. A worked figure from a 2026 format comparison makes the magnitude tangible: a 2000x2000 image compressed from a 540 KB JPEG baseline to about 350 KB WebP (-35%) and 210 KB AVIF (-61%).</p>
            <p>Browser support no longer holds you back. Per <a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer">Can I Use</a>, AVIF reached full support across Chrome, Edge, Firefox, Safari, and iOS Safari, covering well over 95% of global usage by 2025-2026, and WebP support is effectively universal. The safe delivery chain is AVIF with a WebP and then JPEG/PNG fallback, which <code class={inlineCode}>&lt;picture&gt;</code> elements and most image CDNs negotiate automatically. JPEG XL still has near-zero browser support outside Safari, so it stays an archival curiosity rather than a web delivery format for now.</p>
            <h3 class="text-xl font-black text-[#4A2C2C] mt-7 mb-3">Resize to the display size</h3>
            <p>Generators hand you a high-resolution canvas so you have room to crop, but the final embed is usually much smaller: 1200x630 for a social card, 800x800 for a product shot, 1600px on the long edge for a retina-friendly hero. Serving the source dimensions everywhere is the most common avoidable waste in a generated-image pipeline. A single oversized hero can consume more bandwidth than every other resource on the page combined.</p>
            <h3 class="text-xl font-black text-[#4A2C2C] mt-7 mb-3">Strip the metadata</h3>
            <p>EXIF, IPTC, and XMP fields carry nothing the browser needs to render an image, and removing them can <a href="https://calendar.perfplanet.com/2022/reduce-image-sizes-by-removing-metadata/" target="_blank" rel="noopener noreferrer">trim 15-30% off the file</a> with zero visual impact. For generated assets the payload is usually lighter than a DSLR's, but some pipelines embed tool identifiers or prompt traces, so stripping is both a size win and a way to avoid leaking internal detail.</p>
            <div class="mt-6">
                <InfoBox type="tip" title="Keep PNG for masters only">
                    PNG is the format most generators default to. Keep it for masters, alpha transparency, and pixel-exact UI elements, but it is rarely the right delivery format. For most generated content, WebP or AVIF reproduces the same visual result at a fraction of the bytes.
                </InfoBox>
            </div>
        </section>

        <section id="tool-call-pattern" class="scroll-mt-24">
            <SectionHeading>Automating It: The Agent Tool-Call Pattern</SectionHeading>
            <p>The right way to automate image optimization in an agent pipeline is a tool call that takes a file path and returns a new path, never raw image bytes flowing through the model's context. This keeps the heavy, deterministic work in a dedicated process and leaves the agent to orchestrate.</p>
            <p>The reason is token cost, and it is steep. Vision-enabled models bill images as token-heavy inputs. <a href="https://platform.claude.com/docs/en/build-with-claude/vision" target="_blank" rel="noopener noreferrer">Claude's vision documentation</a> gives the formula as approximately <code class={inlineCode}>width * height / 750</code> tokens per image, which puts a 1-megapixel image at around 1,334 tokens and a 3000x2000 generation at roughly 8,000. Pass ten freshly generated images inline to kick off a batch and you have burned 80,000-plus tokens before any optimization has happened. On local models with 8k-32k context windows, a handful of inline images can exhaust the context entirely and the workflow simply stops working.</p>
            <p>The <a href="https://modelcontextprotocol.io/specification/2025-06-18/server/tools" target="_blank" rel="noopener noreferrer">Model Context Protocol</a> formalizes the alternative. Tools are typed endpoints an agent invokes for side-effectful operations like file transformation, and the protocol's resource model is built around passing URI references such as <code class={inlineCode}>file:///path/to/image.png</code> rather than binary blobs. Anthropic's engineering write-up on <a href="https://www.anthropic.com/engineering/code-execution-with-mcp" target="_blank" rel="noopener noreferrer">code execution with MCP</a> frames the payoff directly: moving heavy data and compute into dedicated tool processes lets the agent "use fewer tokens" while the model sees only references and summaries.</p>
            <p>In practice that means an image-optimization capability should be exposed as a tool that accepts a path and returns the optimized path plus metadata (format, dimensions, compression ratio). The agent chains the steps - generate, optimize via tool call, then commit or publish - without ever holding pixels. For a pipeline handling dozens of images per job, designing it so only references live in context can cut token usage by orders of magnitude and makes execution far more predictable.</p>
        </section>

        <section id="workflows" class="scroll-mt-24">
            <SectionHeading>Three Real-World Workflows You Can Copy</SectionHeading>
            <p>There are three established shapes for the optimize-after-generation step, and most pipelines are a variation on one of them. Each separates generation from optimization so the compression logic is deterministic and reusable.</p>
            <h3 class="text-xl font-black text-[#4A2C2C] mt-7 mb-3">Workflow A: the content agent</h3>
            <p>An agent drafts an article, calls an image-generation API for illustrations, and publishes to a CMS. Each generated image is saved to a working directory, an optimization tool is called with the path and a preset (hero, inline, thumbnail), and the agent updates the CMS entry to point at the returned AVIF or WebP variant. The source PNG either moves to cold storage or is discarded. This is the workflow most teams building AI content pipelines actually need, and it is the one the Mochify section below walks through end to end.</p>
            <h3 class="text-xl font-black text-[#4A2C2C] mt-7 mb-3">Workflow B: the diffusion pipeline</h3>
            <p>Stable Diffusion or SDXL setups generate at model-native size, upscale to target resolution, apply brand or artistic filters, then call a compression step that produces sized AVIF/WebP derivatives and strips metadata. Those optimized files become the canonical production assets, and a CDN negotiates the final format per client via the <code class={inlineCode}>Accept</code> header. The principle is the same as a build pipeline: normalize and compress before anything reaches origin.</p>
            <h3 class="text-xl font-black text-[#4A2C2C] mt-7 mb-3">Workflow C: the repo build step</h3>
            <p>Teams that check generated assets into a repository can lean on CI. GitHub Actions such as <code class={inlineCode}>calibreapp/image-actions</code> traverse a pull request, recompress and transcode any new PNG/JPEG/WebP/AVIF, and commit the optimized versions back to the branch. An agent commits the raw generations as part of a content PR; CI enforces the size and format standard before merge. Agents generate, CI optimizes, humans review - clean separation of concerns.</p>
            <p>The thread running through all three: the model decides what to generate and where it goes, and a dedicated tool decides how it gets compressed. That boundary is what makes the pipeline cheap to run and easy to reason about.</p>
        </section>

        <section id="privacy" class="scroll-mt-24">
            <SectionHeading>The Privacy Angle for Generated Client Assets</SectionHeading>
            <p>Where the optimization step sends your data matters the moment generated assets contain anything client-confidential, under NDA, or otherwise sensitive. The principle is data minimization, and it shapes which optimization tool you should reach for.</p>
            <p>The UK ICO's guidance on <a href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/" target="_blank" rel="noopener noreferrer">data minimisation</a> requires that personal data be "adequate, relevant and limited to what is necessary," and its storage-limitation guidance adds that data should not be kept longer than needed. Applied to a generation pipeline, that argues against indefinitely storing the dozens of draft and discarded images a workflow throws off, and against routing client assets through a tool that retains them.</p>
            <p>There is a quieter risk specific to agents. A local agent runtime with access to API keys and private repositories can, through a single misconfigured or undisclosed tool call, exfiltrate sensitive content to a remote service even when the model itself runs offline. "Local agent" does not imply "local data." Before adding an optimization tool to a privacy-sensitive workflow, it is worth asking what data enters the tool call, where exactly it goes, and whether the service retains it. For regulated or agency work, a zero-retention processor and a signed <a href="/dpa">Data Processing Agreement</a> are what turn that question into a documented answer.</p>
        </section>

        <!-- Workflow card -->
        <section id="mochify-workflow" class="scroll-mt-24 bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-9 not-prose">
            <h2 class="text-[1.75rem] font-black text-[#4A2C2C] mb-4">Mochify Workflow: Optimizing Generated Images Inside an Agent</h2>
            <p class="mb-7">Mochify's local MCP server is built for the optimize-after-generation pattern: the agent describes the task in plain language, the tool handles the file, and only a file path comes back into context. No image bytes enter the model, so the context window stays clean no matter how many images the job touches. Here is the full setup.</p>
            <ol class="space-y-6 list-none p-0 m-0">
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">1</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Install the Mochify CLI</strong>
                        <p class="text-base mb-3">The same Rust binary serves as both the CLI and the local MCP server. Install via Homebrew:</p>
                        <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-3 overflow-x-auto font-mono text-sm leading-relaxed"><code>brew install mochify</code></pre>
                        <p class="text-base m-0">On Linux, use the curl installer from <a href="https://github.com/getmochify/mochify-cli" target="_blank" rel="noopener noreferrer">github.com/getmochify/mochify-cli</a>, or <code class={inlineCode}>cargo install</code> from the repo.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">2</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Authenticate once</strong>
                        <p class="text-base m-0">Run <code class={inlineCode}>mochify auth login</code>. A browser OAuth flow handles authentication and writes credentials to <code class={inlineCode}>~/.config/mochify/credentials.toml</code>. Both the CLI and the local MCP server pick them up automatically.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">3</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Wire the local MCP server into your agent host</strong>
                        <p class="text-base mb-3">For Claude Desktop, add a short JSON snippet to <code class={inlineCode}>claude_desktop_config.json</code>:</p>
                        <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-3 overflow-x-auto font-mono text-sm leading-relaxed"><code>{`{
  "mcpServers": {
    "mochify": {
      "command": "mochify",
      "args": ["serve"]
    }
  }
}`}</code></pre>
                        <p class="text-base m-0">For Claude Code: <code class={inlineCode}>claude mcp add mochify mochify serve</code></p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">4</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Describe the task with Magic Flow</strong>
                        <p class="text-base mb-3">Magic Flow is Mochify's natural-language interface, so the agent describes the goal rather than setting format, quality, and resize values by hand. The two-step pipeline parses the prompt with a language model, then hands off to Mochify's C++ engine for the actual compression. Prompts that map cleanly onto a generated-image workflow:</p>
                        <ul class="list-disc pl-6 space-y-2 mb-3 text-base">
                            <li>"Convert every PNG in <code class={inlineCode}>/build/generated</code> to AVIF at web quality, max 1600px wide"</li>
                            <li>"Compress these illustrations, strip metadata, and output WebP"</li>
                            <li>"Resize this hero to 1200x630 and convert to AVIF for the social card"</li>
                        </ul>
                        <p class="text-base m-0">Magic Flow is available in the web app, via the REST API at <code class={inlineCode}>POST /v1/prompt</code>, through the CLI with the <code class={inlineCode}>-p</code> flag, and on both MCP surfaces. Direct (non-prompt) image compression runs through <code class={inlineCode}>POST /v1/squish</code>. Supported formats span JPG/jpegli, PNG, WebP, AVIF, JPEG XL, and HEIC/HEIF on upload, with batches up to 25 on paid tiers.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">5</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Receive file paths, not bytes</strong>
                        <p class="text-base m-0">The local MCP server returns file paths and metadata: the optimized output path, format, dimensions, and compression ratio. No image data enters the agent's context. This is what makes high-volume batch processing viable, including on local hardware where context windows are tight.</p>
                    </div>
                </li>
            </ol>

            <div class="mt-7">
                <InfoBox type="warning" title="Privacy note (read this before you wire it into client work)">
                    Images travel from your machine to <code class={inlineCode}>api.mochify.app</code> over HTTPS for the encoding step. They are streamed into the encoder in RAM, wiped immediately, with no disk writes of the source and no logs containing file data. The local Rust binary is a client over that API; it does not encode locally, so this is zero-retention, not "your images never leave your laptop." Because the local MCP path uses no pickup store, compressed bytes come straight back to the binary and are written to your disk, keeping the path zero-retention end to end. The hosted MCP server at <code class={inlineCode}>mcp.mochify.app</code> works differently: it returns a short-lived download URL on <code class={inlineCode}>files.mochify.app</code> (about a five-minute window) instead of a file path, which suits non-developers who want OAuth access with nothing to install. For a full comparison, see <a href="/guides/how-the-mochify-mcp-server-works">How the Mochify MCP Server Works</a>.
                </InfoBox>
            </div>
            <p class="text-base text-[#875F42] mt-5 mb-0">MCP and API access are included on every tier, Free included (25 images per month, or 3 per session with no signup). For heavier batch work, Seller at $7.99/month raises that to 300 images and 25-file batches. Current limits are on the <a href="/pricing">pricing page</a>.</p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat Sheet: AI Image Optimization at a Glance</SectionHeading>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[720px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Decision</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Default for generated images</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Why</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each cheatSheet as row, i}
                            <tr class="{i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'} align-top">
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">{row.decision}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.def}</td>
                                <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">{row.why}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

        <!-- FAQ -->
        <section id="faq" class="scroll-mt-24">
            <SectionHeading>FAQ</SectionHeading>
            <div class="space-y-4 mt-4">
                {#each faqs as faq}
                    <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md open:shadow-md transition-all">
                        <summary class="flex justify-between items-center gap-4 font-bold cursor-pointer list-none p-5 text-[#4A2C2C]">
                            <span>{faq.q}</span>
                            <span class="transition group-open:rotate-180 shrink-0 text-[#F06292]">
                                <svg fill="none" height="22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="22"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <div class="px-5 pb-5 text-base text-[#6C3F31] leading-relaxed opacity-90">
                            {@html faq.a}
                        </div>
                    </details>
                {/each}
            </div>
        </section>

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Put the optimize-after-generation step on autopilot</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base">Wire the local MCP server into your agent and describe the job in plain English: <em>"convert every PNG in /build/generated to AVIF at web quality, max 1600px wide."</em></p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Try it free at mochify.app →
            </a>
        </div>

        <!-- Related guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <ul class="space-y-3">
                {#each related as guide}
                    <li>
                        <a href={guide.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">· {guide.desc}</span></span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </section>

    </div>
</article>
