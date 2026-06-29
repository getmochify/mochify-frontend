<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "On-Device AI Agents - Image and PDF Optimization for Local Workflows",
        description: "From NVIDIA DGX Spark to Apple Silicon, local AI agents are real in 2026. What that means for handling images and PDFs inside MCP agent pipelines.",
        category: "AI & Automation",
        readTime: "15 min read",
        date: "June 2, 2026",
    };

    const toc = [
        { n: '01', href: '#hardware-shift', label: 'The On-Device AI Hardware Shift' },
        { n: '02', href: '#capabilities', label: "What Local Agents Can (and Can't) Do Today" },
        { n: '03', href: '#mcp-local', label: 'How MCP Connects Agents to Local Tools' },
        { n: '04', href: '#privacy-nuance', label: 'Local Agent Does Not Mean Local Data' },
        { n: '05', href: '#token-costs', label: 'Why Image Tokens Are Expensive in Agent Context' },
        { n: '06', href: '#mochify-workflow', label: 'Mochify Workflow: Optimizing Images and PDFs Inside a Local Agent' },
        { n: '07', href: '#cheat-sheet', label: 'Cheat Sheet: On-Device Agent and Local MCP Tool Stack' },
        { n: '08', href: '#faq', label: 'FAQ' },
    ];

    const cheatSheet = [
        { scenario: '70B inference (DGX Spark, Mac Studio 128 GB)', loc: 'Local model', approach: 'Ollama, llama.cpp, MLX', leaves: 'No' },
        { scenario: '7-13B inference (AI PC, 16-32 GB)', loc: 'Local model', approach: 'Ollama, llama.cpp', leaves: 'No' },
        { scenario: 'Tool calls via MCP stdio', loc: 'Local subprocess', approach: 'Any stdio MCP server', leaves: 'Only what the tool sends' },
        { scenario: 'Image/PDF optimization (Mochify local)', loc: 'Local client, remote encoding', approach: 'mochify serve + mochify auth login', leaves: 'Yes — HTTPS to api.mochify.app, zero retention' },
        { scenario: 'Image optimization via TinyPNG MCP', loc: 'Remote API wrapper', approach: 'TinyPNG MCP', leaves: "Yes — to TinyPNG's servers" },
        { scenario: 'PDF handling via Avanquest MCP', loc: 'Remote API wrapper', approach: 'Avanquest PDF MCP', leaves: "Yes — to Avanquest's servers" },
        { scenario: 'Video compression', loc: 'Client-side browser only', approach: 'mochify.app web app', leaves: 'No — browser only' },
        { scenario: 'Passing images inline to LLM', loc: 'In-context', approach: 'Avoid for local agents', leaves: 'Yes, in prompt' },
        { scenario: 'Passing file paths via MCP', loc: 'Out-of-context', approach: 'Recommended pattern', leaves: 'Paths and metadata only' },
        { scenario: 'Mochify hosted MCP', loc: 'Remote connector', approach: 'mcp.mochify.app (OAuth)', leaves: 'Yes — HTTPS + 5-min URL pickup' },
    ];

    const faqs = [
        {
            q: "What hardware do I need to run a local AI agent for image workflows?",
            a: "For 7-13B models, which handle most tool-orchestration tasks well, a 16-32 GB AI PC with a modern NPU or dedicated GPU is sufficient. You'll get 30-100 tokens/second at Q4 quantization — fast enough for interactive workflows and background batch jobs. For 70B models, you need at least 48 GB of unified memory; 128 GB gives comfortable headroom for context and KV cache. NVIDIA's DGX Spark and Apple's Mac Studio M5 Max (128 GB) both sit in that tier, delivering roughly 25-45 tokens/second on 70B Q4 workloads.",
        },
        {
            q: "Does running a local AI agent mean my data stays on my machine?",
            a: "Not automatically. The inference runs on your hardware, but tool calls made through MCP or other integration layers may send data to remote APIs depending on which tools are configured. Every tool in the workflow needs to be evaluated on its own: check whether it uses stdio transport (same-machine subprocess) or HTTP transport (networked), and whether any HTTP server calls a third-party remote API. Never assume “local agent” implies “local tools.”",
        },
        {
            q: "Why shouldn't I pass images directly into my local agent's context?",
            a: "Image tokens are expensive. A 1-megapixel image costs roughly 1,334 tokens (approximately width * height / 750), and local models typically run with 8k-32k context windows. Passing a batch of images inline can exhaust the entire context before any processing happens. The right pattern is to use an MCP tool that handles the image and returns a file path — the agent works with the path, not the pixels.",
        },
        {
            q: "What is the difference between Mochify's hosted MCP server and its local MCP server?",
            a: "The hosted MCP server (mcp.mochify.app) is a remote connector: register it via OAuth, it processes your image server-side, and returns a short-lived download URL on files.mochify.app (valid for about five minutes). No install required. The local MCP server is the same Rust binary run in server mode via mochify serve. It returns file paths and metadata directly to the agent — no URL, no pickup store — and keeps zero server-side retention end-to-end. For developer and agent workflows, the local server is the default recommendation.",
        },
        {
            q: "Can Mochify's local MCP server handle PDF workflows too?",
            a: "Yes. PDFs are a first-class format alongside images. The local MCP server can extract individual pages as PNG, JPEG, or WebP images, and can split multi-page PDFs into individual single-page files. Both operations are Magic Flow-capable: describe what you want in plain language (“extract page 3 as WebP,” “split this into pages”) and the system handles the parameters. The privacy model is the same as images: encoding happens at api.mochify.app in RAM with no source disk writes.",
        },
        {
            q: "Does the local MCP server work with agent runtimes other than Claude?",
            a: "Any MCP-compatible host works. This includes Cursor, Claude Code, Claude Desktop, and others. MCP is supported by all major hosts including Claude, ChatGPT, Gemini, Cursor and VS Code. If your agent runtime supports stdio MCP servers, Mochify's local server wires in the same way regardless of the underlying model or host.",
        },
        {
            q: "What's the practical difference between 7B and 70B models for image workflow automation?",
            a: "A 7B model is fast (75-125 t/s on good hardware) and handles most tool-orchestration tasks competently: calling MCP tools, interpreting results, writing structured outputs. For straightforward batch processing — “compress everything in this folder to AVIF” — 7B is usually sufficient. A 70B model adds better reasoning on ambiguous inputs: understanding a vague prompt, handling edge cases in a document, or planning a complex multi-step workflow. If your agent needs to read a document and make decisions based on its content before taking action on assets, the quality difference is meaningful.",
        },
        {
            q: "Will video optimization ever be available from the CLI or local MCP server?",
            a: "Not currently, and there's no commitment to when or whether that changes. Mochify's video engine runs client-side in the browser - the bytes never leave your device, which is a stronger privacy guarantee than any server-side path. That architecture is inherently web-app-only. If your workflow involves video, use the web app; route image and PDF work through the CLI or local MCP server.",
        },
    ];

    const related = [
        { href: '/guides/how-the-mochify-mcp-server-works', title: 'How the Mochify MCP Server Works: Hosted vs Local', desc: "A full technical comparison of both MCP surfaces: the hosted server's five-minute URL pickup versus the local server's zero-retention file-path return." },
        { href: '/guides/ai-agent-workflow-automation-photographers', title: 'AI Agent Workflow Automation for Photographers', desc: 'Practical patterns for using local agents and MCP tools in photography post-processing: batch conversion, EXIF stripping, and delivery formatting.' },
        { href: '/guides/why-we-relaxed-zero-retention-for-mcp', title: 'Why We Relaxed Our Zero-Retention Policy for MCP', desc: 'The engineering reasoning behind the hosted MCP’s five-minute pickup window, and exactly what "zero-retention" means for each surface.' },
        { href: '/guides/privacy-image-optimization', title: 'Privacy & Image Optimization: A Comprehensive Guide', desc: 'GDPR, data minimisation, and how to evaluate image optimization tools for regulated and NDA-sensitive workflows.' },
        { href: '/guides/mochify-mcp-image-compression-agent-2026', title: 'How to Use Mochify via MCP', desc: 'Step-by-step setup for both MCP surfaces, with config examples for Claude Desktop and Claude Code.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:type" content="article" />

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "On-Device AI Agents - Image and PDF Optimization for Local Workflows",
      "description": "From NVIDIA DGX Spark to Apple Silicon, local AI agents are real in 2026. What that means for handling images and PDFs inside MCP agent pipelines.",
      "author": { "@type": "Organization", "name": "Mochify Engineering Team", "url": "https://mochify.app" },
      "publisher": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app", "logo": { "@type": "ImageObject", "url": "https://mochify.app/logo.png" } },
      "datePublished": "2026-06-02",
      "dateModified": "2026-06-02",
      "inLanguage": "en",
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://mochify.app/guides/on-device-ai-agents-image-optimization" }
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What hardware do I need to run a local AI agent for image workflows?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For 7-13B models, a 16-32 GB AI PC with a modern NPU or dedicated GPU is sufficient, giving 30-100 tokens/second at Q4 quantization. For 70B models you need at least 48 GB of unified memory; 128 GB gives comfortable headroom. NVIDIA DGX Spark and Apple Mac Studio M5 Max (128 GB) both deliver roughly 25-45 tokens/second on 70B Q4 workloads."
          }
        },
        {
          "@type": "Question",
          "name": "Does running a local AI agent mean my data stays on my machine?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Not automatically. The inference runs on your hardware, but tool calls made through MCP may send data to remote APIs depending on which tools are configured. Audit each tool individually: check whether it uses stdio transport (same-machine subprocess) or HTTP transport (networked), and whether any HTTP server calls a third-party remote API."
          }
        },
        {
          "@type": "Question",
          "name": "Why shouldn't I pass images directly into my local agent's context?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Image tokens are expensive. A 1-megapixel image costs roughly 1,334 tokens (width * height / 750), and local models typically run with 8k-32k context windows. The right pattern is to use an MCP tool that processes the image and returns a file path - the agent works with the path, not the pixels."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between Mochify's hosted MCP server and its local MCP server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The hosted MCP server (mcp.mochify.app) processes images server-side and returns a short-lived download URL on files.mochify.app valid for about five minutes. No install required. The local MCP server runs the same binary as mochify serve, returns file paths and metadata directly with no URL passback and no pickup store, keeping zero server-side retention end-to-end."
          }
        },
        {
          "@type": "Question",
          "name": "Can Mochify's local MCP server handle PDF workflows too?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. PDFs are a first-class format. The local MCP server can extract individual pages as PNG, JPEG, or WebP images, and can split multi-page PDFs into individual single-page files. Both operations work with Magic Flow natural language prompts. The privacy model is the same as images: encoding at api.mochify.app in RAM with no disk writes of the source."
          }
        },
        {
          "@type": "Question",
          "name": "Does the local MCP server work with agent runtimes other than Claude?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Any MCP-compatible host works, including Cursor, Claude Code, Claude Desktop, ChatGPT, Gemini, and VS Code. If your agent runtime supports stdio MCP servers, Mochify's local server wires in the same way regardless of the underlying model or host."
          }
        },
        {
          "@type": "Question",
          "name": "What's the practical difference between 7B and 70B models for image workflow automation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A 7B model is fast (75-125 t/s) and handles most tool-orchestration tasks well. For straightforward batch processing, 7B is usually sufficient. A 70B model adds better reasoning on ambiguous inputs, complex prompts, edge cases in documents, or multi-step planning where quality matters more than speed."
          }
        },
        {
          "@type": "Question",
          "name": "Will video optimization ever be available from the CLI or local MCP server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Not currently. Mochify's video engine runs client-side in the browser so bytes never leave your device. That architecture is web-app-only. The CLI, local MCP server, and REST API handle images and PDFs. Route video compression through the web app at mochify.app."
          }
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
            On-Device AI Agents: Image and PDF Optimization for Local Workflows
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Local AI agents running on hardware like NVIDIA DGX Spark and Apple Silicon are practical in 2026 — but running the model locally doesn't automatically mean your data stays local. This guide covers what the hardware shift actually enables, how MCP connects agents to genuinely local tools, and how to build an image and PDF optimization workflow that keeps server-side data retention at zero.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                <strong class="text-[#4A2C2C]">Published June 2026 by the Mochify Engineering Team.</strong> This guide covers the hardware driving the on-device AI shift, how MCP stdio servers connect agents to genuinely local tools, why a local agent runtime doesn't guarantee local data handling, and how to run zero-retention image and PDF optimization inside a local agent pipeline.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner" aria-label="Table of contents">
                <ul class="space-y-3">
                    {#each toc as item}
                        <li>
                            <a href={item.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                                <span class="flex items-center gap-4">
                                    <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">{item.n}</span>
                                    <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                                </span>
                                <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </section>

        <!-- 1. Hardware shift -->
        <section id="hardware-shift" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">1. The On-Device AI Hardware Shift</h2>
            <p class="mb-4">The gap between cloud AI and desktop AI is closing faster than most people expected, and two hardware announcements in the first half of 2026 make the change concrete enough to build workflows around.</p>
            <p class="mb-4"><strong class="text-[#4A2C2C]">NVIDIA DGX Spark</strong> is a compact desktop unit built around the GB10 Grace Blackwell superchip. According to <a href="https://docs.nvidia.com/dgx/dgx-spark/hardware.html" target="_blank" rel="noopener noreferrer">NVIDIA's DGX Spark hardware documentation</a>, it delivers 1 PFLOP of FP4 AI performance, 128 GB of LPDDR5X unified memory at 273 GB/s bandwidth, and 4 TB of NVMe storage. That memory is coherently shared between the CPU and GPU — which is what makes it viable for large-model inference, not just smaller assistant models. Independent benchmark aggregations from May 2026 put 70B Q4 models at roughly 35-45 tokens per second on DGX Spark, versus 25-32 t/s on a 128 GB Mac Studio M5 Max. Both figures are usable for interactive agent workflows; neither approaches datacenter throughput.</p>
            <p class="mb-4"><strong class="text-[#4A2C2C]">NVIDIA RTX Spark</strong> was announced on 1 June 2026 in a joint release with Microsoft. It's a new superchip designed for Windows laptops and compact desktops, built on GB10-derived silicon, with a 20-core Grace CPU, 6,144 CUDA cores on a Blackwell GPU, and up to 128 GB of unified memory. The press materials describe it as enabling "personal agents on device" and position it as the hardware backbone for an "agentic AI OS." OEM systems including the Surface Laptop Ultra, Dell XPS 16 Creator Edition, and ASUS ProArt P16 are slated to ship in fall 2026.</p>
            <p class="mb-4"><strong class="text-[#4A2C2C]">Apple Silicon</strong> has been doing this quietly for longer. Apple's <a href="https://machinelearning.apple.com/research/apple-foundation-models-tech-report-2025" target="_blank" rel="noopener noreferrer">Foundation Models technical report from June 2025</a> describes an approximately 3B-parameter multimodal model running entirely on device, with tool-calling support, guided generation, and LoRA fine-tuning for developers at no per-call cloud cost. Larger requests route to Private Cloud Compute — Apple silicon in their own data centres, no user-data retention — but many assistant tasks complete entirely locally. It's a hybrid architecture, as are Copilot+ PCs with Qualcomm Snapdragon X Elite (40+ TOPS NPU) or AMD Ryzen AI 300 — but one where the local leg does real work.</p>
            <p>The throughput ceiling matters for workflow planning. A 70B model at Q4 quantization needs roughly 42-48 GB of VRAM to load comfortably, and even on 128 GB hardware the output speed stays in the 25-45 tokens/second range. That's sufficient for coding agents, document processing, and automated batch workflows — the kind of background job that runs over a folder of images or a set of PDFs. It's not fast enough for real-time conversational interfaces at scale. Knowing where that ceiling sits is what separates a local deployment that works from one that frustrates.</p>
        </section>

        <!-- 2. Capabilities -->
        <section id="capabilities" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">2. What Local Agents Can (and Can't) Do Today</h2>
            <p class="mb-4">Local agents running on 128 GB hardware are genuinely capable for a well-defined class of tasks. The practical ceiling is the 7-70B model range.</p>
            <p class="mb-4">For the 7-13B tier — which runs comfortably on 16-32 GB AI PCs at 30-100+ tokens per second — you get reliable performance on coding assistance, document Q&amp;A, summarisation, and structured data extraction. These models handle tool-use frameworks well: they can plan a multi-step workflow, call tools via MCP, interpret results, and act on them without needing frontier-model reasoning quality. For straightforward image batch processing or file organisation tasks, a well-prompted 7B model orchestrating the right tools is entirely workable.</p>
            <p class="mb-4">At the 70B tier on 128 GB systems, reasoning quality improves substantially. Models like Llama 3.3 70B at Q4 quantization fit in around 42-48 GB of memory, leaving headroom for context and KV cache. The throughput is slower, but for batch workflows that run in the background — processing a folder of assets, converting documents, auditing a codebase — the 25-45 t/s range is plenty.</p>
            <p class="mb-4">Where local agents still fall short: holding 1M-token context windows requires hundreds of GB of high-bandwidth memory, currently the domain of H200 and MI300X class hardware. Very large models (120B+) at useful throughput are not practical on 128 GB consumer systems. Complex multi-hop reasoning on frontier tasks still benefits from cloud model quality.</p>
            <p class="mb-4">Jensen Huang made a useful point in May 2026: agentic AI demands roughly ten times more compute than earlier generative AI, because agents read large inputs, reason, call tools, and generate many output tokens in a single pass. That amplifier makes local compute more valuable — it gets used up faster — but it also means even powerful desktop hardware will continue to route some work to cloud backends. Every credible platform (Apple, Microsoft, NVIDIA, Qualcomm) acknowledges this: they all describe hybrid architectures, not purely local stacks.</p>
            <p>The practical upshot for media workflows: local agents on 128 GB hardware are the right home for orchestration, decision-making, and file management. Encoding-heavy work — the actual compression, conversion, and transformation of images and PDFs — should sit in a dedicated tool process that keeps media bytes out of the LLM context entirely.</p>
        </section>

        <!-- 3. MCP local -->
        <section id="mcp-local" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">3. How MCP Connects Agents to Local Tools</h2>
            <p class="mb-4">MCP (Model Context Protocol) is an open standard introduced by Anthropic in late 2024 for connecting AI agent runtimes to external tools. It defines a standard JSON-RPC message format and two transport modes: stdio for local, same-machine servers, and streamable HTTP for networked servers.</p>
            <p class="mb-4">The stdio transport is the architecturally important one for local agents. When a host application (Claude Desktop, Cursor, Claude Code, or any MCP-compatible runtime) uses a stdio server, it launches the server as a child process, communicates with it over stdin/stdout, and manages the process lifecycle itself. Per the <a href="https://modelcontextprotocol.io/specification/2025-06-18/basic/transports" target="_blank" rel="noopener noreferrer">official MCP transport specification</a>: "the client launches the MCP server as a subprocess... sends messages over stdin and reads responses from stdout." No network ports, no sockets required. The only configuration is a command and its arguments in a JSON config file.</p>
            <p class="mb-4">This matters for on-device workflows because a well-designed stdio tool server runs entirely within the user's OS permissions with no required network connectivity of its own. For a media optimization server, this means the agent can send a local file path, the tool processes the file, and returns a new path — without any of the image data passing through the LLM's context window.</p>
            <p class="mb-4">MCP has been adopted quickly. By early 2026, Claude Desktop, Claude Code, Cursor, ChatGPT, and VS Code all support MCP servers. MCP marketplaces list hundreds of servers spanning image processing, database connectors, code search, and cloud provider SDKs. That breadth means the ecosystem of callable tools on local hardware is already substantial — and as new agent runtimes ship on DGX Spark and RTX Spark class hardware, they inherit the same tool ecosystem without re-integration work.</p>
            <p>On platforms like Claude Code, adding a local MCP server is a one-line command (<code class="bg-pink-50 text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">claude mcp add</code>). On Claude Desktop, it's a short JSON snippet in <code class="bg-pink-50 text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">claude_desktop_config.json</code>. The agent then discovers the server's tools automatically and can call them from natural-language prompts without custom code. See our guide on <a href="/guides/how-the-mochify-mcp-server-works">how the Mochify MCP server works</a> for a full breakdown of both MCP surfaces.</p>
        </section>

        <!-- 4. Privacy nuance -->
        <section id="privacy-nuance" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">4. Local Agent Does Not Mean Local Data</h2>
            <p class="mb-4">This is the most important nuance in the whole on-device AI space, and it gets glossed over constantly in vendor marketing.</p>
            <p class="mb-4">Running your agent model locally — whether that's a 70B model on DGX Spark or Apple's 3B on-device model — means inference happens on your hardware. It does not mean every tool the agent calls processes data locally.</p>
            <p class="mb-4">Most MCP tool servers wrap remote APIs. TinyPNG's MCP integrations pass images to TinyPNG's cloud API for compression. The Avanquest PDF MCP uploads documents to Avanquest's servers for conversion. FAL's image generation MCP sends prompts to FAL's cloud infrastructure. These are all legitimate tools, but they're hybrid: the agent runtime is local, the processing is remote.</p>
            <p class="mb-4">For anyone handling client documents, assets under NDA, or regulated data, this distinction matters directly. <a href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/" target="_blank" rel="noopener noreferrer">GDPR Article 5(1)(c), as the UK ICO explains in their data minimisation guidance</a>, requires that personal data be "adequate, relevant and limited to what is necessary." Using a cloud tool to process client images or PDFs creates a data transfer to a third party. That transfer needs to be accounted for under your data-processing obligations. Zero-retention server-side processing — where originals are never written to disk — simplifies that picture considerably.</p>
            <p class="mb-4">The security angle compounds this. When a local agent runtime has access to API keys, configuration files, and private repositories, a single misconfigured tool call can silently exfiltrate sensitive content to a remote service — even if the model itself runs entirely offline. A local agent runtime is not a sandboxed environment by default. Giving an agent access to a tool that makes undisclosed network calls is a data governance risk regardless of where the model runs.</p>
            <p class="mb-4">A practical three-question audit for any MCP tool you're adding to a privacy-sensitive workflow:</p>
            <ul class="list-disc pl-6 mb-6 space-y-2 marker:text-[#F06292]">
                <li>Does it use stdio (same-machine subprocess) or HTTP (networked) transport?</li>
                <li>If HTTP, does it call a third-party remote API or only your own infrastructure?</li>
                <li>What data enters the tool call, and where exactly does it go?</li>
            </ul>
            <p>The important distinction is between the <em>agent runtime</em> being local and the <em>tools</em> being local. They are independent variables. A well-designed tool stack for regulated work audits both. For more on the privacy implications of different optimization paths, see our <a href="/guides/privacy-image-optimization">comprehensive guide to privacy and image optimization</a>.</p>
        </section>

        <!-- 5. Token costs -->
        <section id="token-costs" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">5. Why Image Tokens Are Expensive in Agent Context</h2>
            <p class="mb-4">Passing images directly into a language model's context — rather than through a tool that returns a file path — is expensive in two ways that compound on local hardware.</p>
            <p class="mb-4">First, raw token cost. <a href="https://platform.claude.com/docs/en/build-with-claude/vision" target="_blank" rel="noopener noreferrer">Claude's vision documentation</a> gives the formula: approximately <code class="bg-pink-50 text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">width * height / 750</code> tokens per image. A 1,000 x 1,000 pixel image (1 megapixel) costs roughly 1,334 tokens. A standard product photo at 3,000 x 2,000 runs to around 8,000 tokens. Pass ten images inline to start a batch job and you've consumed 80,000+ tokens before the agent has done any work.</p>
            <p class="mb-4">Second, context ceiling. Claude's context window documentation states that a single request can include up to 600 images or PDF pages (100 for models using 200k-token context windows). Those ceilings are manageable for cloud models with large context windows. For local models — which typically run with 8k to 32k context windows on consumer hardware — passing even a handful of full-resolution images inline can exhaust the entire context before any processing pipeline begins. At that point the workflow simply doesn't work.</p>
            <p class="mb-4">The established pattern, reflected in the <a href="https://modelcontextprotocol.info/docs/concepts/resources/" target="_blank" rel="noopener noreferrer">MCP resources specification</a>, is to pass file paths and metadata rather than binary data. The spec defines URI-based resource references (for example, <code class="bg-pink-50 text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">file:///home/user/project/image.jpg</code>) precisely for this: the tool server handles the file, the agent handles the reference. Anthropic's engineering write-up on <a href="https://www.anthropic.com/engineering/code-execution-with-mcp" target="_blank" rel="noopener noreferrer">MCP with code execution</a> frames this directly: MCP lets agents "use fewer tokens" by moving heavy data and compute into dedicated tool processes, with the model only seeing references and summaries.</p>
            <p>For on-device agents where context windows are tight and token throughput is measured in tens per second, this isn't an optimisation. It's a prerequisite for running image workflows at any reasonable scale.</p>
        </section>

        <!-- 6. Mochify workflow -->
        <section id="mochify-workflow" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">6. Mochify Workflow: Optimizing Images and PDFs Inside a Local Agent</h2>
            <p class="mb-6">Mochify's local MCP server is built for exactly this pattern: the agent describes what it needs in plain language, the tool handles the file, and only a file path comes back into the agent's context. No image bytes enter the model. No context gets bloated.</p>

            <div class="bg-gradient-to-br from-[#FFF5F7] to-[#FDFBF7] rounded-3xl p-6 md:p-8 border border-pink-100 mb-6">
                <ol class="space-y-6">
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <div class="flex-1 min-w-0">
                            <strong class="block text-[#4A2C2C] text-lg mb-2">Install the Mochify CLI</strong>
                            <p class="mb-3">The same Rust binary serves as both CLI and local MCP server. Install via Homebrew:</p>
                            <pre class="bg-[#2D1B1B] text-pink-100 rounded-xl p-4 mb-3 overflow-x-auto font-mono text-sm leading-relaxed"><code>brew install mochify</code></pre>
                            <p class="mb-0">On Linux, use the curl installer from <a href="https://github.com/getmochify/mochify-cli" target="_blank" rel="noopener noreferrer">github.com/getmochify/mochify-cli</a>, or <code class="bg-pink-50 text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">cargo install</code> from the repo directly.</p>
                        </div>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <div class="flex-1 min-w-0">
                            <strong class="block text-[#4A2C2C] text-lg mb-2">Authenticate once</strong>
                            <p class="mb-0">Run <code class="bg-pink-50 text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">mochify auth login</code>. A browser OAuth flow handles authentication, and credentials are saved to <code class="bg-pink-50 text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">~/.config/mochify/credentials.toml</code>. Both the CLI and the local MCP server pick them up automatically — you won't need to touch them again.</p>
                        </div>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <div class="flex-1 min-w-0">
                            <strong class="block text-[#4A2C2C] text-lg mb-2">Wire the local MCP server into your agent host</strong>
                            <p class="mb-3">For Claude Desktop, add a short snippet to <code class="bg-pink-50 text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">claude_desktop_config.json</code>:</p>
                            <pre class="bg-[#2D1B1B] text-pink-100 rounded-xl p-4 mb-3 overflow-x-auto font-mono text-sm leading-relaxed"><code>{`{
  "mcpServers": {
    "mochify": {
      "command": "mochify",
      "args": ["serve"]
    }
  }
}`}</code></pre>
                            <p class="mb-0">For Claude Code: <code class="bg-pink-50 text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">claude mcp add mochify mochify serve</code></p>
                        </div>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">4</span>
                        <div class="flex-1 min-w-0">
                            <strong class="block text-[#4A2C2C] text-lg mb-2">Describe your task with Magic Flow</strong>
                            <p class="mb-3">Mochify's natural language interface, Magic Flow, means you describe what you want rather than specifying format, quality, and resize settings by hand. The two-step pipeline — a language model parses the prompt, then Mochify's C++ compression engine executes — handles parameter resolution automatically. Real examples that work:</p>
                            <ul class="list-disc pl-6 mb-3 space-y-2 marker:text-[#F06292]">
                                <li>"Convert all the PNGs in <code class="bg-pink-50 text-[#D81B60] px-1.5 py-0.5 rounded font-mono text-xs">/project/assets</code> to AVIF at web quality"</li>
                                <li>"Compress these product photos, strip EXIF data, max 1600px wide"</li>
                                <li>"Extract page 1 of the brief as a WebP thumbnail"</li>
                                <li>"Split this 40-page contract into individual single-page PDFs"</li>
                            </ul>
                            <p class="mb-0">Magic Flow is available in the web app, via the REST API at <code class="bg-pink-50 text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">POST /v1/prompt</code>, through the CLI with the <code class="bg-pink-50 text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">-p</code> flag, and on both MCP server surfaces.</p>
                        </div>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">5</span>
                        <div class="flex-1 min-w-0">
                            <strong class="block text-[#4A2C2C] text-lg mb-2">Receive file paths, not bytes</strong>
                            <p class="mb-0">The local MCP server returns file paths and metadata — the path to the optimized output, format, dimensions, and compression ratio. No image data enters the agent's context. This is what makes high-volume batch processing viable on local hardware: the context window stays clean regardless of how many files are in the job.</p>
                        </div>
                    </li>
                </ol>
            </div>

            <InfoBox type="note" title="Privacy note">
                <p class="mb-3">Images and PDFs travel from your machine to <code class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono text-sm">api.mochify.app</code> over HTTPS for the encoding step. Processing happens in RAM, with no disk writes of the source and no logs containing file data. The local Rust binary is a client over that API; it does not encode locally. Because the local MCP path uses no pickup store, compressed bytes come straight back to the binary and are written to disk — zero server-side retention end-to-end.</p>
                <p class="mb-0">The hosted MCP server at <code class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono text-sm">mcp.mochify.app</code> works differently: it returns a short-lived download URL on <code class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono text-sm">files.mochify.app</code> (valid for about five minutes) rather than a file path. That's the right surface for non-developers who want OAuth-based access without installing anything. For agent workflows where you want file paths and zero server-side retention end-to-end, the local server is the right choice. See <a href="/guides/why-we-relaxed-zero-retention-for-mcp" class="text-blue-600 hover:text-blue-700 underline">why we adjusted our zero-retention policy for MCP</a> for the full explanation.</p>
            </InfoBox>

            <p class="mb-4"><strong class="text-[#4A2C2C]">On video:</strong> if your workflow involves video, that's handled separately. Mochify's video engine runs entirely client-side in the browser — the bytes never leave your device. That's a stronger local privacy guarantee than even the MCP path, but it means video is web-app-only. The CLI, local MCP server, and REST API handle images and PDFs. Route video compression through the web app.</p>
            <p>MCP access is available on all Mochify tiers including Free (25 images/month). For heavier batch workloads, Seller ($7.99/month) gives you 300 images/month and 25-file batches. Details at <a href="/pricing">mochify.app/pricing</a>.</p>
        </section>

        <!-- 7. Cheat sheet -->
        <section id="cheat-sheet" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">7. Cheat Sheet: On-Device Agent and Local MCP Tool Stack</h2>
            <ScrollableTable class="mb-6">
                <table class="w-full text-left bg-white text-sm">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">Scenario</th>
                            <th class="p-4 font-black">Local or remote?</th>
                            <th class="p-4 font-black">Recommended approach</th>
                            <th class="p-4 font-black">Data leaves device?</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        {#each cheatSheet as row}
                            <tr>
                                <td class="p-4 font-semibold text-[#4A2C2C]">{row.scenario}</td>
                                <td class="p-4">{row.loc}</td>
                                <td class="p-4">{row.approach}</td>
                                <td class="p-4">{row.leaves}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

        <!-- FAQ -->
        <section id="faq" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">FAQ</h2>
            <div class="space-y-4">
                {#each faqs as item}
                    <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                        <h3 class="text-lg font-black text-[#4A2C2C] mb-2">{item.q}</h3>
                        <p class="mb-0 text-base">{item.a}</p>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Related -->
        <section id="related" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">Related Guides</h2>
            <ul class="space-y-3">
                {#each related as guide}
                    <li>
                        <a href={guide.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">— {guide.desc}</span></span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </section>

        <!-- CTA -->
        <div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div class="relative z-10 mb-6">
                <span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">Free Tool</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-black text-[#4A2C2C] relative z-10 mb-3">
                Connect your local agent to Mochify
            </h3>
            <p class="text-[#6C3F31] text-lg max-w-lg mx-auto relative z-10 mb-8 leading-relaxed">
                Install the CLI, run <code class="bg-white text-[#D81B60] px-2 py-0.5 rounded font-mono text-sm">mochify auth login</code> once, and your agent can start optimizing images and PDFs with a natural language prompt — zero bytes in the model context.
            </p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
                <span>Try it free at mochify.app</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

    </div>
</article>
