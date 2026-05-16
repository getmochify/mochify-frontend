<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';

    const metadata = {
        title: "AI Agent Workflow Automation for Photographers: Save Hours with Claude and Mochify",
        description: "Build a hands-off post-shoot pipeline with Claude, Dispatch, and Mochify MCP. Files land in upload-ready folders while you're still in the field.",
        category: "Workflow Automation",
        readTime: "10 min read",
        date: "May 2026"
    };

    const faqItems = [
        {
            q: "Does Mochify's MCP server work with Claude specifically, or only with certain MCP clients?",
            a: "Mochify's MCP server works with any MCP-compatible client, including Claude Desktop, Cursor, and other tools that implement the open MCP protocol. The server is not tied to any specific client."
        },
        {
            q: "Can I run this workflow without a Pro plan?",
            a: "Yes. MCP access is available on all tiers, including Free. The Free tier is capped at 25 images per month and 3 files per batch, which is useful for testing the workflow. For production use — 80+ files per wedding shoot — you'll want Seller (300 images/month, 25-file batches) or Pro (1,200 images/month, priority queue, under 60 seconds per batch)."
        },
        {
            q: "What happens if the agent sends a folder with mixed file types — HIF, JPEG, RAW?",
            a: "Mochify processes the formats it supports (HIF, JPEG, PNG, WebP, AVIF, HEIC, JPEG XL) and skips unsupported types like RAW. The agent's instruction set should log skipped files so you can handle them manually if needed."
        },
        {
            q: "How does Mochify handle a batch larger than 25 files via the CLI?",
            a: "The CLI handles folder-level batching automatically. You pass the full folder path or a glob pattern, and Mochify splits internally into batches as needed. You don't manage the chunking manually. Via MCP in an agent workflow, you'll want to split the folder glob into chunks of 25 and call Mochify sequentially."
        },
        {
            q: "Can I configure the agent to notify me on my phone when a batch is done?",
            a: "Yes. Tools like Dispatch support notification integrations including Slack, email, and webhooks. Configure a Slack notification action as the final step in your agent instruction set, and use a Slack mobile app to receive it. You can also use a webhook to trigger a push notification via a service like Pushover or ntfy."
        },
        {
            q: "Is the processed output compatible with Pixieset or SmugMug upload without any further steps?",
            a: "Yes. Output files are standard JPEG using the jpegli encoder — fully compatible with every gallery platform, CMS, and e-commerce tool. Files are correctly sized, sRGB colour profile, EXIF stripped (or selectively preserved for editorial). Drop them straight into the upload queue."
        },
        {
            q: "Do I need to re-configure the MCP server for each shoot type?",
            a: "No. The configuration is set once — MOCHIFY_API_KEY in the environment, MCP server running. The instruction sets in your agent client handle the per-shoot-type logic. You add or edit instruction sets in the client, not in Mochify's config."
        }
    ];

    const relatedGuides = [
        { href: '/guides/heif-to-jpeg-workflow-photographers-guide', title: 'HIF/HEIF to JPEG for Professional Photographers', desc: 'Privacy-first workflow blueprints for converting camera HEIF files to JPEG for professional delivery.' },
        { href: '/guides/mochify-mcp-image-compression-agent-2026', title: 'How to Use Mochify via MCP: AI Agent Image Compression', desc: 'Connect Mochify to your AI assistant via MCP and compress images with plain English — no manual settings.' },
        { href: '/guides/exif-data-risks-image-compression-2026', title: 'The Risks of EXIF Data in Image Compression', desc: 'A complete breakdown of metadata types, privacy risks, and how to strip selectively.' },
        { href: '/guides/privacy-image-optimization', title: 'Privacy & Image Optimization: A Comprehensive Guide', desc: 'How to keep your images secure with zero-retention optimization in 2026.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <link rel="canonical" href="https://mochify.app/guides/ai-agent-workflow-automation-photographers" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "AI Agent Workflow Automation for Photographers: Save Hours with Claude and Mochify",
        "description": "Build a hands-off post-shoot pipeline with Claude, Dispatch, and Mochify MCP. Files land in upload-ready folders while you're still in the field.",
        "url": "https://mochify.app/guides/ai-agent-workflow-automation-photographers",
        "datePublished": "2026-05-03",
        "dateModified": "2026-05-03",
        "inLanguage": "en-GB",
        "author": {
            "@type": "Organization",
            "name": "Mochify Engineering Team",
            "url": "https://mochify.app"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        },
        "about": [
            { "@type": "Thing", "name": "AI agent workflow" },
            { "@type": "Thing", "name": "Photography automation" },
            { "@type": "Thing", "name": "MCP server" },
            { "@type": "Thing", "name": "Image compression" },
            { "@type": "Thing", "name": "EXIF stripping" },
            { "@type": "Thing", "name": "HEIF to JPEG" }
        ],
        "keywords": "AI agent photography workflow, MCP image compression, Mochify MCP, photographer automation, HEIF to JPEG batch, post-shoot pipeline, EXIF strip automation"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "AI Agent Workflow Automation for Photographers", "item": "https://mochify.app/guides/ai-agent-workflow-automation-photographers" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
            "@type": "Question",
            "name": "Does Mochify's MCP server work with Claude specifically, or only with certain MCP clients?",
            "acceptedAnswer": { "@type": "Answer", "text": "Mochify's MCP server works with any MCP-compatible client, including Claude Desktop, Cursor, and other tools that implement the open MCP protocol." }
            },
            {
            "@type": "Question",
            "name": "Can I run this workflow without a Pro plan?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes. MCP access is available on all tiers, including Free. The Free tier is capped at 25 images per month and 3 files per batch." }
            },
            {
            "@type": "Question",
            "name": "Is the processed output compatible with Pixieset or SmugMug upload without any further steps?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes. Output files are standard JPEG using the jpegli encoder — fully compatible with every gallery platform, CMS, and e-commerce tool." }
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
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            AI Agent Workflow Automation for Photographers: Save Hours with Claude and Mochify
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Most photographers have optimised the shoot. The real time sink is what happens after: converting exports, resizing for each platform, stripping EXIF, and dropping files into the right delivery folders.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                This guide shows you how to build an AI agent pipeline on Claude, Dispatch, and Mochify's MCP server that eliminates all of that manual work. Files arrive in upload-ready folders while you're still in the car.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- Table of Contents -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>

            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    <li>
                        <a href="#cheat-sheet" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">01</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">Cheat sheet: Agent workflow at a glance</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#why-photographers-lose-time" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">02</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">Why photographers still lose time after the shoot ends</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#how-the-stack-works" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">03</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">How the stack works: Claude, Dispatch, and Mochify MCP</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#folder-structure" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">04</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">Setting up the folder structure and agent trigger</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#worked-example" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">05</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">The worked example: wedding shoot, agent running, photographer in the field</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#multi-destination" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">06</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">Multi-destination derivatives: one shoot, four outputs</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#privacy" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">07</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">Privacy in an automated pipeline</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#validation" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">08</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">What to validate and what can go wrong</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#faq" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-mochi-pink border border-pink-100 group-hover:scale-110 transition-transform">09</span>
                                <span class="text-cocoa-deep font-bold group-hover:text-mochi-pink transition-colors">FAQ</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-mochi-pink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </section>

        <!-- 01 Cheat Sheet -->
        <section id="cheat-sheet">
            <SectionHeading>Cheat Sheet: Agent Workflow at a Glance</SectionHeading>
            <p>Configure each row once. After that, dropping a folder triggers the full pipeline automatically — no manual steps in between.</p>

            <div class="overflow-x-auto rounded-2xl border border-pink-100 my-6">
                <table class="w-full border-collapse text-sm">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Trigger</th>
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Agent action</th>
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Mochify MCP call</th>
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Output folder</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            {
                                trigger: 'New folder in /exports/raw-jpegs/wedding-*/',
                                action: 'Fire agent with wedding instruction set',
                                mcp: '"Convert my exports for Pixieset — sRGB JPEG, 3,600px long edge, under 2MB, strip all EXIF"',
                                output: '/processed/pixieset/wedding-[date]/'
                            },
                            {
                                trigger: 'New folder in /exports/raw-jpegs/commercial-*/',
                                action: 'Fire agent with commercial instruction set',
                                mcp: '"Generate Shopify derivatives from shoot folder — sRGB JPEG, 2,048px square, under 500KB, strip EXIF"',
                                output: '/processed/shopify/commercial-[date]/ and /processed/etsy/commercial-[date]/'
                            },
                            {
                                trigger: 'New folder in /exports/raw-jpegs/editorial-*/',
                                action: 'Fire agent with editorial instruction set',
                                mcp: '"Batch process and strip EXIF — preserve IPTC caption/copyright, 2,400px long edge, JPEG"',
                                output: '/processed/wire/editorial-[date]/'
                            },
                        ] as row, i}
                            <tr class={i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-mono text-xs">{row.trigger}</td>
                                <td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">{row.action}</td>
                                <td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 italic text-sm">{row.mcp}</td>
                                <td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-mono text-xs">{row.output}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 02 Why photographers lose time -->
        <section id="why-photographers-lose-time">
            <SectionHeading>Why Photographers Still Lose Time After the Shoot Ends</SectionHeading>
            <p>The export is not the finish line. After Lightroom or Capture One finishes, you still need to generate platform-specific derivative sets, strip location data, confirm file sizes are within each platform's limits, and move files to the right delivery folders.</p>

            <div class="bg-[#FFF9F5] rounded-2xl border border-[#FFE4D6] p-6 my-6">
                <p class="m-0">That process — manual export plus EXIF strip plus resize — typically takes <strong class="text-[#4A2C2C]">8–15 minutes per job</strong>, and it scales linearly with the number of platforms you deliver to. For a wedding photographer delivering to Pixieset, a commercial photographer serving Shopify and Etsy, and an editorial photographer uploading to a wire service, that window compounds fast.</p>
            </div>

            <p>You're not sitting idle — you're travelling between locations, meeting clients, or trying to sleep — but the work is still waiting.</p>
            <p>When an agent handles this, the window collapses to <strong class="text-[#4A2C2C]">under 60 seconds for a 25-image batch at Pro tier</strong>. You configure the agent's instruction set once, and it fires automatically every time a new export lands. You get a notification when the files are ready. Nothing else required.</p>

            <InfoBox type="tip" title="Ready to try Mochify's MCP server?">
                Connect at <a href="/" class="text-[#D81B60] underline">mochify.app</a> — MCP access is included on all tiers.
            </InfoBox>
        </section>

        <!-- 03 How the stack works -->
        <section id="how-the-stack-works">
            <SectionHeading>How the Stack Works: Claude, Dispatch, and Mochify MCP</SectionHeading>
            <p>The three-layer architecture is straightforward: an AI agent runtime handles orchestration, a scheduler handles triggers, and Mochify's MCP server is the image processing engine the agent calls. The agent handles the logic; Mochify handles the actual pixel work.</p>
            <p><strong class="text-[#4A2C2C]">Claude</strong> (via Claude Desktop or a compatible client) is where you define instruction sets — essentially, pre-written tasks the agent executes when triggered. For this workflow, you write the instruction set once: detect the shoot type from the folder name, call Mochify MCP with the appropriate conversion parameters, and send a confirmation when done. <a href="https://docs.anthropic.com/en/docs/build-with-claude/mcp" rel="noopener noreferrer" class="text-[#D81B60] underline">Anthropic's MCP documentation</a> covers the protocol spec in detail for developers who want to go deeper.</p>
            <p><strong class="text-[#4A2C2C]">Dispatch</strong> is the scheduling and trigger layer. It runs a file watcher on your <code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-0.5 rounded text-sm font-mono">/exports/raw-jpegs/</code> directory and fires the agent job when a new folder appears. This is what makes the workflow genuinely hands-off: the export from Lightroom is the only action you take. Dispatch handles everything after.</p>
            <p><strong class="text-[#4A2C2C]">Mochify's MCP server</strong> exposes the same C++ compression engine and zero-retention pipeline as the web interface — but callable by an AI agent in natural language. The agent describes the task: format, size constraints, colour profile, EXIF handling. Mochify resolves the parameters and returns the processed files. No settings UI, no format dropdowns.</p>

            <InfoBox type="note" title="MCP access on all tiers">
                There is no developer paywall. The only configuration required is setting your <code>MOCHIFY_API_KEY</code> in the MCP server environment variables. Free, Seller, and Pro all include MCP access.
            </InfoBox>
        </section>

        <!-- 04 Folder structure -->
        <section id="folder-structure">
            <SectionHeading>Setting Up the Folder Structure and Agent Trigger</SectionHeading>
            <p>Get the folder structure right first, because the agent infers shoot type from path conventions — getting this wrong means the agent will not know which derivative set to generate.</p>
            <p>Here's the recommended local structure:</p>

            <pre class="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed my-4"><code>/studio/
  exports/
    raw-jpegs/          ← Lightroom drops files here via post-export action
  processed/
    pixieset/
    shopify/
    etsy/
    wire/
  archive/</code></pre>

            <p>The naming convention for the <code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-0.5 rounded text-sm font-mono">raw-jpegs/</code> subfolders is critical. Use a consistent prefix that maps to a shoot type:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-0.5 rounded text-sm font-mono">wedding-YYYY-MM-DD-clientname/</code> — triggers the wedding instruction set (Pixieset delivery)</li>
                <li><code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-0.5 rounded text-sm font-mono">commercial-YYYY-MM-DD-clientname/</code> — triggers the commercial instruction set (Shopify + Etsy)</li>
                <li><code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-0.5 rounded text-sm font-mono">editorial-YYYY-MM-DD-outlet/</code> — triggers the editorial instruction set (wire delivery)</li>
            </ul>

            <p>Lightroom's post-export action setting (under the Export dialog's "Post-Processing" panel) lets you specify a shell script to run when an export completes. Point this at a lightweight script that calls Dispatch with the folder path as an argument:</p>

            <pre class="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed my-4"><code>#!/bin/bash
# post-export-trigger.sh
FOLDER_PATH="$1"
dispatch trigger mochify-agent --param folder="$FOLDER_PATH"</code></pre>

            <p>Set this script as the "After Export" action in Lightroom. Every export will now fire Dispatch automatically, which fires the agent, which calls Mochify. You set this up once.</p>

            <InfoBox type="tip" title="Pro tip">
                Keep the <code>archive/</code> folder as a post-processing step — move originals there after the agent confirms successful output. This keeps <code>raw-jpegs/</code> clean and prevents duplicate processing if Dispatch re-checks the folder.
            </InfoBox>
        </section>

        <!-- 05 Worked example -->
        <section id="worked-example">
            <SectionHeading>The Worked Example: Wedding Shoot, Agent Running, Photographer in the Field</SectionHeading>
            <p>Here's a complete, concrete run-through. It's a Saturday in May 2026. You've just finished the ceremony set. You're in the car park, tablet in hand, and you trigger a Lightroom export over your studio's remote connection.</p>

            <div class="bg-gradient-to-b from-[#FFF5F7] to-[#FDFBF7] rounded-2xl border border-pink-100 p-6 md:p-8 mt-4">
                <h3 class="text-lg font-black text-[#4A2C2C] mb-4 mt-0">Step by step</h3>
                <ol class="list-none p-0 space-y-4">
                    {#each [
                        { n: 1, title: 'Export triggered.', body: 'Lightroom exports 80 HIF files from the ceremony set to /studio/exports/raw-jpegs/wedding-2026-05-03-hartley/. The folder name contains wedding-, which maps to the Pixieset instruction set.' },
                        { n: 2, title: 'Lightroom post-export action fires.', body: 'The shell script runs and calls Dispatch with the folder path.' },
                        { n: 3, title: 'Dispatch detects the new folder.', body: 'The file watcher confirms the export is complete (file count stable, no active writes) and fires the agent job.' },
                        { n: 4, title: 'Agent fires.', body: 'It reads the folder name, identifies the shoot type as wedding, and loads the pre-written Pixieset instruction set.' },
                        { n: 5, title: 'Agent calls Mochify MCP.', body: 'The natural language call is: "Convert everything in /studio/exports/raw-jpegs/wedding-2026-05-03-hartley/ to sRGB JPEG for Pixieset, 3,600px long edge, under 2MB, strip all EXIF including embedded thumbnails."' },
                        { n: 6, title: 'Mochify processes the batch.', body: 'The in-memory pipeline handles the conversion — no source files are written to third-party disk, no data retained after processing. Mochify uses Google\'s jpegli encoder, which produces standard JPEG files at roughly 25–30% smaller file sizes than libjpeg-turbo at equivalent quality. Your 80 files are processed in under 60 seconds at Pro tier.' },
                        { n: 7, title: 'Output lands in the delivery folder.', body: 'Processed files appear in /studio/processed/pixieset/wedding-2026-05-03-hartley/ — correctly sized, correct colour profile, EXIF stripped, within Pixieset\'s size limits.' },
                        { n: 8, title: 'Agent sends confirmation.', body: 'A Slack message (or desktop notification, depending on your Dispatch config) reads: "80 files processed. Ready to upload to Pixieset."' },
                    ] as step}
                        <li class="flex gap-4 items-start m-0">
                            <span class="w-8 h-8 bg-[#F06292] text-white font-black rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">{step.n}</span>
                            <div>
                                <strong class="text-[#4A2C2C]">{step.title}</strong>
                                <span class="ml-1">{step.body}</span>
                            </div>
                        </li>
                    {/each}
                </ol>

                <div class="mt-6 pt-5 border-t border-pink-100 text-sm text-[#875F42] leading-relaxed">
                    You didn't touch a keyboard after step 1. All processing happens in Mochify's in-memory pipeline — zero retention, wiped immediately after output is returned. Your originals never leave your machine.
                </div>
            </div>

            <p class="mt-6">The equivalent CLI command — for readers who want to test the same conversion manually or script it outside an agent context:</p>

            <pre class="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed my-4"><code>mochify --prompt "Pixieset gallery set, sRGB JPEG, 3600px long edge, under 2MB, strip all EXIF" \
  ./exports/raw-jpegs/wedding-2026-05-03-hartley/*.jpg \
  --out ./processed/pixieset/wedding-2026-05-03-hartley/</code></pre>

            <p>The <code class="bg-[#FFF5F7] text-[#D81B60] px-1.5 py-0.5 rounded text-sm font-mono">--prompt</code> flag accepts the same natural language instruction as the MCP call. This is useful for one-off runs, debugging, or verifying output before you trust the agent to run unsupervised.</p>

            <!-- CTA -->
            <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow mt-6">
                <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <h3 class="text-2xl font-black text-[#4A2C2C] relative z-10 mb-3 mt-0">Process your own batch right now</h3>
                <p class="text-[#6C3F31] max-w-md mx-auto relative z-10 mb-6 text-base">No setup required. Drag, describe, download.</p>
                <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                    Try Mochify free →
                </a>
            </div>
        </section>

        <!-- 06 Multi-destination -->
        <section id="multi-destination">
            <SectionHeading>Multi-Destination Derivatives: One Shoot, Four Outputs</SectionHeading>
            <p>For a commercial shoot, you're not delivering to one platform — you're delivering to several with different specs. The agent handles all of them in a single pass, running the instruction sets sequentially.</p>
            <p>Here's the prompt sequence the agent runs for a commercial product shoot:</p>

            <p><strong class="text-[#4A2C2C]">Pixieset gallery (client proofs)</strong></p>
            <pre class="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed my-3"><code>"Convert everything in /studio/exports/raw-jpegs/commercial-2026-05-03-brand/
to sRGB JPEG, 3,600px long edge, under 2MB, strip all EXIF"</code></pre>
            <p class="text-sm text-[#875F42]">Output: <code class="font-mono">/studio/processed/pixieset/commercial-2026-05-03-brand/</code></p>

            <p><strong class="text-[#4A2C2C]">Shopify product images</strong></p>
            <pre class="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed my-3"><code>"Generate Shopify derivatives from shoot folder - sRGB JPEG, 2,048px square,
under 500KB, strip EXIF"</code></pre>
            <p class="text-sm text-[#875F42]">Output: <code class="font-mono">/studio/processed/shopify/commercial-2026-05-03-brand/</code></p>

            <p><strong class="text-[#4A2C2C]">Etsy listings</strong></p>
            <pre class="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed my-3"><code>"Batch process and strip EXIF - sRGB JPEG, 2,000px long edge, under 1MB,
strip all metadata"</code></pre>
            <p class="text-sm text-[#875F42]">Output: <code class="font-mono">/studio/processed/etsy/commercial-2026-05-03-brand/</code></p>

            <p><strong class="text-[#4A2C2C]">Brand website (modern format)</strong></p>
            <pre class="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed my-3"><code>"Convert everything in this folder to sRGB AVIF, under 300KB, strip EXIF"</code></pre>
            <p class="text-sm text-[#875F42]">Output: <code class="font-mono">/studio/processed/web/commercial-2026-05-03-brand/</code></p>

            <p>For a 25-image commercial batch at Pro tier, all four derivative sets complete in under four minutes total. The agent coordinates the sequence, but each Mochify call is independent — if one fails, the others continue.</p>

            <InfoBox type="technical" title="EXIF stripping overhead">
                EXIF stripping adds less than <strong>2% to processing time</strong>. It's not a meaningful overhead — specify it freely in every prompt.
            </InfoBox>
        </section>

        <!-- 07 Privacy -->
        <section id="privacy">
            <SectionHeading>Privacy in an Automated Pipeline</SectionHeading>
            <p>Privacy matters more in an agent workflow, not less — because files are being processed without you watching. Mochify's in-memory, zero-retention pipeline means no source files are written to third-party disk at any point in the process. The agent passes the task to Mochify, Mochify processes in memory, and the output is returned directly to your local folder. Your originals never leave your machine and no intermediary cloud storage is involved.</p>
            <p>EXIF stripping is specified as intent in the Magic Flow prompt — not configured as a separate tool step. You write "strip all EXIF including embedded thumbnails" in the same sentence as your format and size requirements, and Mochify resolves and applies all of it in a single pass. This matters for client privacy: wedding and portrait files contain GPS coordinates, device metadata, and sometimes embedded contact information from your camera profile.</p>
            <p>For editorial work, the rule is different. Wire services require IPTC caption and copyright fields to travel with the file for attribution. In that case, use a selective instruction:</p>

            <pre class="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed my-4"><code>"Batch process and strip EXIF - preserve IPTC caption and copyright fields,
strip GPS and device metadata, 2,400px long edge, JPEG"</code></pre>

            <p>Magic Flow understands the distinction and applies EXIF stripping selectively. No manual metadata editing needed.</p>
        </section>

        <!-- 08 Validation -->
        <section id="validation">
            <SectionHeading>What to Validate and What Can Go Wrong</SectionHeading>
            <p>An automated pipeline is only trustworthy if it validates its own output. Here's what to configure the agent to check before marking a batch complete.</p>

            <p><strong class="text-[#4A2C2C]">File size validation.</strong> The agent should confirm that every output file is within the target platform's size limit before sending the confirmation notification. If any file exceeds the limit, it should re-run that file with a slightly lower quality setting and re-check. Mochify's Magic Flow handles this gracefully — the prompt can specify "under 2MB" as a hard constraint, and the encoder will find the quality level that satisfies it.</p>
            <p><strong class="text-[#4A2C2C]">Mixed file types.</strong> If a folder contains HIF, JPEG, and occasional RAW files (from a second shooter, for example), Mochify processes the formats it supports and skips unsupported types. The agent's instruction set should flag skipped files in the confirmation message rather than silently omitting them.</p>
            <p><strong class="text-[#4A2C2C]">Batches larger than 25 files.</strong> The 25-file batch limit applies to Seller and Pro tiers via MCP. If you're processing 80 files, the CLI handles this automatically by splitting internally across multiple batches — you pass the full folder and Mochify manages the chunking. Via MCP, the agent should split the folder glob into chunks of 25 and call Mochify sequentially, collecting confirmations before marking the job done.</p>
            <p><strong class="text-[#4A2C2C]">Format rejection.</strong> If Lightroom exports a file with an unusual colour profile or embedded ICC profile that causes a processing error, Mochify will return an error for that file. Configure the agent to log errors with filenames and re-queue them for manual review rather than failing silently.</p>
        </section>

        <!-- Final CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-2xl font-black text-[#4A2C2C] relative z-10 mb-3 mt-0">Set up your agent workflow today</h3>
            <p class="text-[#6C3F31] max-w-md mx-auto relative z-10 mb-6 text-base">Connect Mochify's MCP server — available on all plans, no developer paywall.</p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Get started at mochify.app →
            </a>
        </div>

        <!-- FAQ -->
        <section id="faq">
            <SectionHeading>FAQ</SectionHeading>
            <div class="divide-y divide-pink-50">
                {#each faqItems as item}
                    <div class="py-5">
                        <h3 class="text-base font-black text-[#4A2C2C] mb-2 mt-0">{item.q}</h3>
                        <p class="text-base leading-relaxed m-0">{item.a}</p>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Related guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                {#each relatedGuides as guide}
                    <a href={guide.href} class="block bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5 no-underline hover:shadow-md hover:-translate-y-0.5 transition-all">
                        <h3 class="text-sm font-black text-[#4A2C2C] mb-1.5 mt-0">{guide.title} →</h3>
                        <p class="text-xs text-[#6C3F31] leading-relaxed m-0">{guide.desc}</p>
                    </a>
                {/each}
            </div>
        </section>

    </div>
</article>
