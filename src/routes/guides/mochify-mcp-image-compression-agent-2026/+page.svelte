<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';

    const inlineCode = "bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm";

    const faqs = [
        {
            q: "What is an MCP server?",
            a: "MCP (Model Context Protocol) is an open standard that lets AI assistants call external tools and APIs mid-conversation. The Mochify MCP server exposes our compression engine as a callable tool any compatible assistant can use."
        },
        {
            q: "Which AI assistants support MCP?",
            a: "Claude Desktop, Cursor, and a growing number of tools support MCP natively. Check your assistant's documentation for MCP tool configuration support."
        },
        {
            q: "Is image compression via MCP as good as the web tool?",
            a: "Yes - the same native C++ squish engine handles both. Output quality and format support are identical."
        },
        {
            q: "Does using MCP mean my images are stored?",
            a: `Your original image is processed in memory and discarded immediately - no disk writes, no logs containing image data - on every surface. One nuance for the hosted MCP: so it can return a download link instead of inline binary, the compressed result is held in a short-lived pickup store for about five minutes, then evicted whether or not it was fetched. The local CLI and <code class="${inlineCode}">mochify serve</code> skip that pickup store entirely and write the compressed bytes straight to your disk. Originals are never retained on any path.`
        },
        {
            q: "Can I use MCP for batch jobs?",
            a: "That depends on how your agent is set up to call the tool. The MCP server itself can handle individual calls in sequence - building a batch loop is possible within your agent's logic."
        },
        {
            q: "What formats does the MCP server support?",
            a: "WebP, AVIF, JPEG XL, and JPEG (via jpegli). The connected AI assistant selects the format based on your prompt."
        },
        {
            q: "How does this differ from the natural language feature on the homepage?",
            a: "The homepage feature is browser-based and designed for individual, manual use. The MCP server is for agent-driven workflows where an AI assistant is handling the task as part of a larger pipeline - without you touching a browser."
        },
        {
            q: "Do I need to install anything to use the hosted MCP?",
            a: `No. The hosted server at <code class="${inlineCode}">https://mcp.mochify.app</code> runs in the cloud. Add the URL in your AI client's settings and authorize your Mochify account - that's it. You only need to install the CLI if you want to process local files via stdio.`
        },
        {
            q: "Can I use Mochify MCP from Claude.ai in my browser?",
            a: `Yes. Claude.ai's Integrations feature supports remote MCP servers. Go to <strong>Settings → Integrations</strong>, add <code class="${inlineCode}">https://mcp.mochify.app</code>, and authorize. The local CLI MCP is not available on the web - it only runs in Claude Desktop and similar native clients.`
        },
        {
            q: "Can I run both the hosted and local MCP at the same time?",
            a: "Yes. They use independent OAuth tokens and can coexist in the same Claude Desktop config. A common setup is the hosted MCP for URL-based agent jobs and the local CLI for compressing files on your own machine - both active simultaneously."
        },
        {
            q: "Does the hosted MCP work with Gemini, Cursor, or Windsurf?",
            a: `Yes, with any client that supports remote MCP servers over HTTP. Add <code class="${inlineCode}">https://mcp.mochify.app/mcp</code> as the server URL in your client's MCP settings and follow the OAuth prompt. Mochify is also listed on Smithery and Glama if your client supports registry-based discovery.`
        }
    ];

    const related = [
        { href: '/guides/self-hosting-image-optimization-docker', title: 'How to Self-Host an Image Optimization API with Docker', desc: 'Full control, local deployment.' },
        { href: '/guides/2026-guide-next-gen-formats', title: 'The 2026 Guide to Next-Gen Formats: WebP, AVIF, and JPEG XL', desc: 'Format benchmarks and use cases.' },
        { href: '/guides/privacy-image-optimization', title: 'Privacy & Image Optimization: A Comprehensive Guide (2026)', desc: 'Zero-retention explained in depth.' },
        { href: '/guides/exif-data-risks-image-compression-2026', title: 'The Risks of EXIF Data in Image Compression (2026)', desc: 'Why metadata stripping matters.' },
        { href: '/guides/ai-image-compression-conversion', title: 'AI Image Compression and Conversion: Describe the Result, Skip the Settings', desc: 'Prompt-driven image compression and conversion in one natural-language step.' },
        { href: '/guides/llm-image-token-costs', title: 'LLM Image Token Costs: How Many Tokens Does an Image Use?', desc: 'Cut LLM image token costs by compressing before you send images to a model.' },
    ];

    const metadata = {
        title: "Mochify MCP Server - AI Agent Image Compression 2026",
        description: "Connect Mochify to your AI assistant via MCP and compress images with plain English - no manual settings, no uploads to a browser tab. Here's how it works.",
        category: "AI & Automation",
        readTime: "7 min read",
        date: "March 9, 2026",
        lastEdited: "May 30, 2026"
    };
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": ["TechArticle", "HowTo"],
        "headline": "Mochify MCP Server - AI Agent Image Compression 2026",
        "description": "Connect Mochify to your AI assistant via MCP and compress images with plain English - no manual settings, no uploads to a browser tab. Here's how it works.",
        "url": "https://mochify.app/guides/mochify-mcp-image-compression-agent-2026",
        "inLanguage": "en",
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
        "about": [
            "MCP image compression",
            "AI agent image optimization",
            "Model Context Protocol",
            "Claude Desktop image tools",
            "agentic image compression"
        ],
        "step": [
            {
            "@type": "HowToStep",
            "name": "Add the Mochify MCP server to your client's configuration file",
            "text": "Open your MCP client (Claude Desktop, Cursor, etc.) and add the Mochify MCP server to the configuration file."
            },
            {
            "@type": "HowToStep",
            "name": "Confirm the tool is available",
            "text": "Verify the Mochify squish tool appears in your assistant's list of available functions."
            },
            {
            "@type": "HowToStep",
            "name": "Describe your image task in natural language",
            "text": "Tell your AI assistant what you need in plain English - for example, 'Compress this product photo as an Instagram-ready WebP and strip the EXIF data.'"
            },
            {
            "@type": "HowToStep",
            "name": "The assistant calls Mochify with the right flags",
            "text": "The AI identifies the compression intent and calls the Mochify MCP tool with type, resize, and EXIF parameters automatically."
            },
            {
            "@type": "HowToStep",
            "name": "Receive the optimized file",
            "text": "The optimized image is returned directly into your workflow - no browser tab, no manual steps."
            }
        ],
        "datePublished": "2026-03-09",
        "dateModified": "2026-05-30"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "What is an MCP server?", "acceptedAnswer": { "@type": "Answer", "text": "MCP (Model Context Protocol) is an open standard that lets AI assistants call external tools and APIs mid-conversation. The Mochify MCP server exposes our compression engine as a callable tool any compatible assistant can use." } },
            { "@type": "Question", "name": "Which AI assistants support MCP?", "acceptedAnswer": { "@type": "Answer", "text": "Claude Desktop, Cursor, and a growing number of tools support MCP natively. Check your assistant's documentation for MCP tool configuration support." } },
            { "@type": "Question", "name": "Is image compression via MCP as good as the web tool?", "acceptedAnswer": { "@type": "Answer", "text": "Yes - the same native C++ squish engine handles both. Output quality and format support are identical." } },
            { "@type": "Question", "name": "Does using MCP mean my images are stored?", "acceptedAnswer": { "@type": "Answer", "text": "Your original image is processed in memory and discarded immediately - no disk writes, no logs containing image data - on every surface. One nuance for the hosted MCP: so it can return a download link instead of inline binary, the compressed result is held in a short-lived pickup store for about five minutes, then evicted whether or not it was fetched. The local CLI and mochify serve skip that pickup store entirely and write the compressed bytes straight to your disk. Originals are never retained on any path." } },
            { "@type": "Question", "name": "Can I use MCP for batch jobs?", "acceptedAnswer": { "@type": "Answer", "text": "That depends on how your agent is set up to call the tool. The MCP server itself can handle individual calls in sequence - building a batch loop is possible within your agent's logic." } },
            { "@type": "Question", "name": "What formats does the MCP server support?", "acceptedAnswer": { "@type": "Answer", "text": "WebP, AVIF, JPEG XL, and JPEG (via jpegli). The connected AI assistant selects the format based on your prompt." } },
            { "@type": "Question", "name": "How does this differ from the natural language feature on the homepage?", "acceptedAnswer": { "@type": "Answer", "text": "The homepage feature is browser-based and designed for individual, manual use. The MCP server is for agent-driven workflows where an AI assistant is handling the task as part of a larger pipeline - without you touching a browser." } },
            { "@type": "Question", "name": "Do I need to install anything to use the hosted MCP?", "acceptedAnswer": { "@type": "Answer", "text": "No. The hosted server at https://mcp.mochify.app runs in the cloud. Add the URL in your AI client's settings and authorize your Mochify account - that's it. You only need to install the CLI if you want to process local files via stdio." } },
            { "@type": "Question", "name": "Can I use Mochify MCP from Claude.ai in my browser?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Claude.ai's Integrations feature supports remote MCP servers. Go to Settings → Integrations, add https://mcp.mochify.app, and authorize. The local CLI MCP is not available on the web - it only runs in Claude Desktop and similar native clients." } },
            { "@type": "Question", "name": "Can I run both the hosted and local MCP at the same time?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. They use independent OAuth tokens and can coexist in the same Claude Desktop config. A common setup is the hosted MCP for URL-based agent jobs and the local CLI for compressing files on your own machine - both active simultaneously." } },
            { "@type": "Question", "name": "Does the hosted MCP work with Gemini, Cursor, or Windsurf?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, with any client that supports remote MCP servers over HTTP. Add https://mcp.mochify.app/mcp as the server URL in your client's MCP settings and follow the OAuth prompt. Mochify is also listed on Smithery and Glama if your client supports registry-based discovery." } }
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
                {metadata.readTime} · {metadata.date} · Updated {metadata.lastEdited}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            How to Use Mochify via MCP: AI Agent Image Compression (2026)
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Connect Mochify to Claude Desktop, Cursor, or any MCP-compatible assistant and compress images directly from a conversation. No browser tab, no manual settings - just describe what you want.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                <strong>Published March 2026 by the Mochify Engineering Team.</strong> The Mochify MCP server exposes our squish engine as a callable tool for AI assistants. Same compression quality, zero-retention privacy - now accessible from inside your AI workflow.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>

            <nav class="bg-[#FFF5F7] rounded-3xl p-4 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    <li>
                        <a href="#what-is" class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">01</span>
                                <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">What is the Mochify MCP server?</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#how-it-works" class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">02</span>
                                <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">How the MCP connection works</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#llm-controls" class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">03</span>
                                <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">What the LLM controls: type, size, EXIF</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#setup" class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">04</span>
                                <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">How to connect Mochify via MCP</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#example" class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">05</span>
                                <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Example: compressing images from a prompt</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#comparison" class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">06</span>
                                <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">MCP vs. the web tool: when to use each</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#cheat-sheet" class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">07</span>
                                <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Cheat sheet: prompt-to-flag mapping</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#faq" class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">08</span>
                                <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">FAQ</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#hosted-mcp" class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">09</span>
                                <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Hosted MCP: zero-install, any AI client</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </section>

        <section class="my-8 bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100">
            <h2 class="text-xl font-black text-[#4A2C2C] mb-3">30-second summary</h2>
            <p>The Mochify MCP server lets any MCP-compatible AI assistant - Claude, Cursor, or similar - compress and optimize images directly from a conversation. Describe what you want, and the assistant calls Mochify's squish engine with the right flags. No browser tab, no manual settings, no file management overhead.</p>
        </section>

        <section id="what-is" class="scroll-mt-24">
            <SectionHeading>What is the Mochify MCP server?</SectionHeading>
            <p class="mb-4">MCP (Model Context Protocol) is a standard that lets AI assistants call external tools and services mid-conversation. We've built a Mochify MCP server that exposes our squish engine as a callable tool - meaning any AI assistant with MCP support can compress, resize, and optimize your images on your behalf.</p>
            <p class="mb-4">This is the agent-first version of Mochify. The same compression quality and zero-retention privacy you get from the web tool at <a href="https://mochify.app">mochify.app</a>, accessed directly from your AI workflow without opening a browser.</p>
        </section>

        <section id="how-it-works" class="scroll-mt-24">
            <SectionHeading>How the MCP connection works</SectionHeading>
            <p class="mb-4">When you describe an image optimization task to your MCP-connected assistant, it parses your prompt and identifies the compression intent. It then calls the Mochify MCP server with the appropriate flags - type, resize dimensions, quality, EXIF handling - and returns the optimized file back into your workflow.</p>

            <p class="mb-4">The flow looks like this:</p>

            <ol class="list-decimal pl-6 mb-6 space-y-3 marker:text-[#F06292] marker:font-bold">
                <li>You describe the task in natural language to your AI assistant</li>
                <li>The assistant identifies it as an image compression job</li>
                <li>It calls the Mochify MCP tool with the right parameters</li>
                <li>Our squish engine processes the image in memory</li>
                <li>The optimized file is returned - no upload portal, no manual steps</li>
            </ol>

            <p class="mb-4">The underlying engine is the same native C++ squish pipeline that powers the web tool. You're getting identical compression quality, just accessed from inside an AI agent context. (<a href="https://web.dev/articles/fast">web.dev has a solid primer on why image optimization matters for Core Web Vitals</a> if you want background on why this matters at scale.)</p>
        </section>

        <section id="llm-controls" class="scroll-mt-24">
            <SectionHeading>What the LLM controls: type, size, EXIF</SectionHeading>
            <p class="mb-4">The AI assistant connected via MCP makes the same decisions as the natural language feature on the web tool - but in an agentic, automated context. Here's exactly what it can set:</p>

            <div class="space-y-6 mb-6">
                <div>
                    <h3 class="text-xl font-black text-[#4A2C2C] mb-2">Output format</h3>
                    <p>Based on your described use case, the model picks from WebP, AVIF, JPEG XL, or JPEG (jpegli). "Best for the web" leans WebP. "Smallest possible" picks AVIF, which at quality 60 produces files roughly 45% smaller than JPEG at quality 80. "Lossless" picks JPEG XL.</p>
                </div>

                <div>
                    <h3 class="text-xl font-black text-[#4A2C2C] mb-2">Resize and cropping</h3>
                    <p>Dimension context ("Instagram square," "thumbnail banner," "half the size") maps to explicit <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">--resize</code> and crop flags. The model understands common publishing formats and translates them to pixel dimensions without you specifying numbers.</p>
                </div>

                <div>
                    <h3 class="text-xl font-black text-[#4A2C2C] mb-2">EXIF metadata stripping</h3>
                    <p>Privacy-aware prompts ("strip location," "clean for public upload") enable metadata removal. Camera data, GPS coordinates, and device info are wiped before the file comes back.</p>
                </div>
            </div>

            <InfoBox type="tip" title="Pro tip">
                When building automations, give your agent a standing instruction like "always compress for web and strip EXIF" so it applies those settings without needing reminders per image.
            </InfoBox>
        </section>

        <section id="setup" class="scroll-mt-24">
            <SectionHeading>How to connect Mochify via MCP</SectionHeading>
            <p class="mb-6">The Mochify CLI includes the MCP server. Install it, then point your client at it.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">1. Install the CLI</h3>

            <p class="mb-2 font-semibold text-[#4A2C2C]">macOS (Homebrew):</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>brew tap getmochify/mochify
brew install mochify</code></pre>

            <p class="mb-2 font-semibold text-[#4A2C2C]">Linux / WSL:</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code># x86_64 (most Linux / WSL)
curl -L https://github.com/getmochify/mochify-cli/releases/latest/download/mochify-linux-x86_64 -o mochify
chmod +x mochify && sudo mv mochify /usr/local/bin/

# arm64 (Raspberry Pi, AWS Graviton, etc.)
curl -L https://github.com/getmochify/mochify-cli/releases/latest/download/mochify-linux-arm64 -o mochify
chmod +x mochify && sudo mv mochify /usr/local/bin/</code></pre>

            <p class="mb-6">All binaries are statically linked - no dependencies needed. Also available on the <a href="https://github.com/getmochify/mochify-cli/releases">GitHub releases page</a>.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">2. Add to your MCP client config</h3>
            <p class="mb-3">For <strong>Claude Desktop</strong>, edit <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">~/Library/Application Support/Claude/claude_desktop_config.json</code>:</p>

            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>{`{
  "mcpServers": {
    "mochify": {
      "command": "mochify",
      "args": ["serve"]
    }
  }
}`}</code></pre>

            <p class="mb-6">To unlock your plan's limits, authenticate once with a browser login:</p>

            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-4 overflow-x-auto font-mono text-sm leading-relaxed"><code>mochify auth login</code></pre>

            <p class="mb-6">This opens your browser, you sign in, and credentials are saved to <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">~/.config/mochify/credentials.toml</code>. Both the CLI and the <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">mochify serve</code> MCP server pick them up automatically - no key to paste into your config. (<code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">MOCHIFY_API_KEY</code> still works as an optional environment-variable override, but <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">mochify auth login</code> is the standard path.)</p>

            <p class="mb-4">Restart Claude Desktop after saving. The Mochify <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">squish</code> tool will appear in your assistant's available functions - test it with: <em>"Compress this image as a WebP for the web."</em></p>

            <InfoBox type="tip" title="No API key needed to start">
                Without a key, requests run on the free tier - 25 images per month (IP-based), or 3 per session with no signup. To use your plan's higher limits (Seller 300/month, Pro 1,200/month), run <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">mochify auth login</code> once to authenticate against your Mochify account.
            </InfoBox>
        </section>

        <section id="hosted-mcp" class="scroll-mt-24">
            <SectionHeading>Hosted MCP: zero-install, any AI client</SectionHeading>
            <p class="mb-6">The Mochify MCP server is also available as a hosted HTTP endpoint at <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">https://mcp.mochify.app</code>. No binary to install, no Rust toolchain, no config file - paste the URL, authorize your account, and the <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">squish</code> tool appears in your AI assistant instantly.</p>

            <p class="mb-6">One behavioral note specific to the hosted server: it returns the compressed image as a short-lived download URL on <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">files.mochify.app</code> (about a five-minute window), not as inline binary. Your original is still processed in RAM and discarded immediately; only the compressed output sits briefly in a pickup store so the link can resolve. The local CLI never uses that pickup store - it writes results straight to disk.</p>

            <ScrollableTable class="mb-8">
                <table class="w-full text-left bg-white whitespace-nowrap md:whitespace-normal">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black"></th>
                            <th class="p-4 font-black">Hosted MCP (mcp.mochify.app)</th>
                            <th class="p-4 font-black">Local CLI MCP (stdio)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4 font-bold">Setup</td><td class="p-4">Paste a URL, click Authorize</td><td class="p-4">Install CLI, edit config file</td></tr>
                        <tr><td class="p-4 font-bold">Works in Claude.ai web</td><td class="p-4 text-[#F06292] font-bold">Yes</td><td class="p-4">No (desktop only)</td></tr>
                        <tr><td class="p-4 font-bold">Works in Claude Desktop</td><td class="p-4 text-[#F06292] font-bold">Yes</td><td class="p-4 text-[#F06292] font-bold">Yes</td></tr>
                        <tr><td class="p-4 font-bold">Works in Gemini / Cursor / Windsurf</td><td class="p-4 text-[#F06292] font-bold">Yes (remote MCP URL)</td><td class="p-4">Varies by client</td></tr>
                        <tr><td class="p-4 font-bold">Image source</td><td class="p-4">Public URLs (agent fetches)</td><td class="p-4">Local files + public URLs</td></tr>
                        <tr><td class="p-4 font-bold">Auth</td><td class="p-4">OAuth 2.0 (one-click)</td><td class="p-4">Optional API key via env var</td></tr>
                        <tr><td class="p-4 font-bold">Can run simultaneously</td><td class="p-4 text-[#F06292] font-bold">Yes</td><td class="p-4 text-[#F06292] font-bold">Yes</td></tr>
                    </tbody>
                </table>
            </ScrollableTable>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">Claude.ai web (claude.ai)</h3>
            <p class="mb-4">In Claude.ai, go to <strong>Settings → Integrations</strong> and add a new integration with the URL:</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>https://mcp.mochify.app</code></pre>
            <p class="mb-6">Claude will redirect you to Mochify to sign in and authorize. After that, just tell Claude to compress an image by URL and it will call the <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">squish</code> tool automatically.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">Claude Desktop (remote server)</h3>
            <p class="mb-4">Add a remote entry to your Claude Desktop config alongside any local servers you already have:</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>{`{
  "mcpServers": {
    "mochify-hosted": {
      "type": "http",
      "url": "https://mcp.mochify.app/mcp"
    }
  }
}`}</code></pre>
            <p class="mb-6">Claude Desktop will walk you through the OAuth flow the first time it connects. You can run both this remote entry and the local <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">mochify serve</code> entry at the same time - they use independent tokens.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">Gemini, Cursor, Windsurf, and other MCP clients</h3>
            <p class="mb-6">Any client that supports remote MCP servers (HTTP+SSE or Streamable HTTP transport) works with the hosted endpoint. Add <code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-sm">https://mcp.mochify.app/mcp</code> as the server URL and follow the client's OAuth prompt.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">Smithery &amp; Glama</h3>
            <p class="mb-4">Mochify is listed on <strong>Smithery</strong> and <strong>Glama</strong> - MCP registries and marketplaces where you can discover and install MCP tools with a single click. Search for "Mochify" to add the hosted server directly from the registry without touching any config file.</p>

            <InfoBox type="tip" title="Agentic workflows with multiple MCPs">
                Combine the Mochify hosted MCP with a filesystem or Google Drive MCP and your assistant becomes a full image pipeline agent. Say <em>"Optimize all the product photos in my Drive folder as WebPs and strip the EXIF"</em> - the Drive MCP fetches the URLs, Mochify processes each one, and each result comes back as a short-lived download link. No scripts, no manual steps.
            </InfoBox>
        </section>

        <section id="example" class="scroll-mt-24">
            <SectionHeading>Example: compressing images from a prompt</SectionHeading>
            <p class="mb-4">Say you're working in Claude Desktop and you say:</p>

            <blockquote class="border-l-4 border-[#F06292] pl-6 py-2 mb-6 bg-[#FFF5F7] rounded-r-2xl">
                <p class="text-[#4A2C2C] font-bold italic">"Can you compress this product photo as an Instagram-ready WebP and strip the EXIF data?"</p>
            </blockquote>

            <p class="mb-4">Behind the scenes, the assistant calls Mochify's MCP server with roughly:</p>

            <ul class="space-y-2 mb-6 pl-4">
                <li><code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">--type webp</code></li>
                <li><code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">--resize 1080x1080</code></li>
                <li><code class="bg-pink-50 text-[#F06292] px-2 py-px rounded font-mono text-base">--strip-exif</code></li>
            </ul>

            <p class="mb-6">The result comes back in seconds - a web-optimized 1080×1080 WebP with no metadata attached. You didn't touch a settings panel or look up Instagram's recommended dimensions. The agent handled the full decision chain.</p>

            <figure class="rounded-2xl overflow-hidden border border-pink-100 shadow-sm">
                <img src="/claude_mochified.webp" alt="Claude Desktop compressing an image via Mochify MCP - the assistant calls the squish tool and returns an optimized WebP" class="w-full" loading="lazy" />
                <figcaption class="bg-[#FFF5F7] px-5 py-3 text-sm text-[#875F42] text-center border-t border-pink-100">
                    Mochify in action: Here, Claude is using the Mochify MCP server to optimize a desktop screenshot. Total reduction: 96%. All handled locally via natural language.
                </figcaption>
            </figure>
        </section>

        <section id="comparison" class="scroll-mt-24">
            <SectionHeading>MCP vs. the web tool: when to use each</SectionHeading>
            <p class="mb-6">Both options use the same squish engine and deliver the same output quality. The difference is workflow fit.</p>

            <ScrollableTable class="mb-6">
                <table class="w-full text-left bg-white whitespace-nowrap md:whitespace-normal">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black"></th>
                            <th class="p-4 font-black">Web tool (mochify.app)</th>
                            <th class="p-4 font-black">MCP server</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4 font-bold">Best for</td><td class="p-4">One-off compression, quick jobs</td><td class="p-4">Automated workflows, agent pipelines</td></tr>
                        <tr><td class="p-4 font-bold">Interface</td><td class="p-4">Browser, natural language field</td><td class="p-4">AI assistant (Claude, Cursor, etc.)</td></tr>
                        <tr><td class="p-4 font-bold">Setup required</td><td class="p-4">None</td><td class="p-4">MCP client configuration</td></tr>
                        <tr><td class="p-4 font-bold">Batch handling</td><td class="p-4">Up to 25 files</td><td class="p-4">Depends on agent implementation</td></tr>
                        <tr><td class="p-4 font-bold">Privacy</td><td class="p-4">Zero-retention, in-memory</td><td class="p-4">Zero-retention, in-memory</td></tr>
                        <tr><td class="p-4 font-bold">Format support</td><td class="p-4">WebP, AVIF, JXL, JPEG</td><td class="p-4">WebP, AVIF, JXL, JPEG</td></tr>
                    </tbody>
                </table>
            </ScrollableTable>

            <p>If you're optimizing images as part of a larger agent workflow - content pipelines, automated publishing, code-adjacent tasks - MCP is the right path. For quick, individual jobs, the web tool is faster to reach.</p>

            <p class="mt-4">The same MCP connection isn't limited to image compression, either. It can also <a href="https://mochify.app/guides/working-with-pdfs-in-ai-agent-workflows">handle PDFs in an AI agent workflow</a> - extracting pages, splitting documents, and converting them alongside your image jobs.</p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat sheet: prompt-to-flag mapping</SectionHeading>

            <ScrollableTable class="mb-8">
                <table class="w-full text-left bg-white whitespace-nowrap md:whitespace-normal">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">Prompt</th>
                            <th class="p-4 font-black">Format</th>
                            <th class="p-4 font-black">Resize</th>
                            <th class="p-4 font-black">EXIF strip</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4 font-bold">"Instagram square"</td><td class="p-4">WebP</td><td class="p-4">1080×1080</td><td class="p-4">Optional</td></tr>
                        <tr><td class="p-4 font-bold">"Smallest possible, mobile"</td><td class="p-4">AVIF</td><td class="p-4">~800px</td><td class="p-4">No</td></tr>
                        <tr><td class="p-4 font-bold">"Blog hero, fast loading"</td><td class="p-4">WebP</td><td class="p-4">~1200px</td><td class="p-4">No</td></tr>
                        <tr><td class="p-4 font-bold">"Archive, no quality loss"</td><td class="p-4">JPEG XL</td><td class="p-4">Original</td><td class="p-4">No</td></tr>
                        <tr><td class="p-4 font-bold">"Clean for public upload"</td><td class="p-4">WebP</td><td class="p-4">Optional</td><td class="p-4 text-[#F06292] font-bold">Yes</td></tr>
                        <tr><td class="p-4 font-bold">"Email thumbnail"</td><td class="p-4">JPEG (jpegli)</td><td class="p-4">~600px</td><td class="p-4 text-[#F06292] font-bold">Yes</td></tr>
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

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

        <RelatedGuides guides={related} />

        <div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>

            <div class="relative z-10 mb-6">
                <span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">
                    Free Tool
                </span>
            </div>

            <h3 class="text-2xl md:text-3xl font-black text-[#4A2C2C] relative z-10 mb-3 flex items-center justify-center gap-3">
                Try it without MCP - just describe what you need
            </h3>

            <p class="text-[#6C3F31] text-lg max-w-lg mx-auto relative z-10 mb-8 leading-relaxed">
                No account. No dropdowns. The natural language feature on the web tool works the same way - type your goal, upload your image, done.
            </p>

            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
                <span>Start Optimizing Free</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

    </div>
</article>
