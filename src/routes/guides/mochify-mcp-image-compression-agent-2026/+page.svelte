<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "Mochify MCP Server - AI Agent Image Compression 2026",
        description: "Connect Mochify to your AI assistant via MCP and compress images with plain English - no manual settings, no uploads to a browser tab. Here's how it works.",
        category: "AI & Automation",
        readTime: "7 min read",
        date: "March 9, 2026",
        lastEdited: "March 14, 2026"
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
        "url": "https://mochify.xyz/guides/mochify-mcp-image-compression-agent-2026",
        "inLanguage": "en",
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.xyz/guides"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.xyz"
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
        "dateModified": "2026-03-14"
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
            Connect Mochify to Claude Desktop, Cursor, or any MCP-compatible assistant and compress images directly from a conversation. No browser tab, no manual settings — just describe what you want.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                <strong>Published March 2026 by the Mochify Engineering Team.</strong> The Mochify MCP server exposes our squish engine as a callable tool for AI assistants. Same compression quality, zero-retention privacy — now accessible from inside your AI workflow.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>

            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    <li>
                        <a href="#what-is" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">01</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">What is the Mochify MCP server?</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#how-it-works" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">02</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">How the MCP connection works</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#llm-controls" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">03</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">What the LLM controls: type, size, EXIF</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#setup" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">04</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">How to connect Mochify via MCP</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#example" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">05</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Example: compressing images from a prompt</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#comparison" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">06</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">MCP vs. the web tool: when to use each</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#cheat-sheet" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">07</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Cheat sheet: prompt-to-flag mapping</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#faq" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">08</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">FAQ</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </section>

        <section class="my-8 bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100">
            <h2 class="text-xl font-black text-[#4A2C2C] mb-3">30-second summary</h2>
            <p>The Mochify MCP server lets any MCP-compatible AI assistant — Claude, Cursor, or similar — compress and optimize images directly from a conversation. Describe what you want, and the assistant calls Mochify's squish engine with the right flags. No browser tab, no manual settings, no file management overhead.</p>
        </section>

        <section id="what-is" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">What is the Mochify MCP server?</h2>
            <p class="mb-4">MCP (Model Context Protocol) is a standard that lets AI assistants call external tools and services mid-conversation. We've built a Mochify MCP server that exposes our squish engine as a callable tool — meaning any AI assistant with MCP support can compress, resize, and optimize your images on your behalf.</p>
            <p class="mb-4">This is the agent-first version of Mochify. The same compression quality and zero-retention privacy you get from the web tool at <a href="https://mochify.xyz" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.xyz</a>, accessed directly from your AI workflow without opening a browser.</p>
        </section>

        <section id="how-it-works" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">How the MCP connection works</h2>
            <p class="mb-4">When you describe an image optimization task to your MCP-connected assistant, it parses your prompt and identifies the compression intent. It then calls the Mochify MCP server with the appropriate flags — type, resize dimensions, quality, EXIF handling — and returns the optimized file back into your workflow.</p>

            <p class="mb-4">The flow looks like this:</p>

            <ol class="list-decimal pl-6 mb-6 space-y-3 marker:text-[#F06292] marker:font-bold">
                <li>You describe the task in natural language to your AI assistant</li>
                <li>The assistant identifies it as an image compression job</li>
                <li>It calls the Mochify MCP tool with the right parameters</li>
                <li>Our squish engine processes the image in memory</li>
                <li>The optimized file is returned — no upload portal, no manual steps</li>
            </ol>

            <p class="mb-4">The underlying engine is the same native C++ squish pipeline that powers the web tool. You're getting identical compression quality, just accessed from inside an AI agent context. (<a href="https://web.dev/articles/fast" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">web.dev has a solid primer on why image optimization matters for Core Web Vitals</a> if you want background on why this matters at scale.)</p>
        </section>

        <section id="llm-controls" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">What the LLM controls: type, size, EXIF</h2>
            <p class="mb-4">The AI assistant connected via MCP makes the same decisions as the natural language feature on the web tool — but in an agentic, automated context. Here's exactly what it can set:</p>

            <div class="space-y-6 mb-6">
                <div>
                    <h3 class="text-xl font-black text-[#4A2C2C] mb-2">Output format</h3>
                    <p>Based on your described use case, the model picks from WebP, AVIF, JPEG XL, or JPEG (jpegli). "Best for the web" leans WebP. "Smallest possible" picks AVIF, which at quality 60 produces files roughly 45% smaller than JPEG at quality 80. "Lossless" picks JPEG XL.</p>
                </div>

                <div>
                    <h3 class="text-xl font-black text-[#4A2C2C] mb-2">Resize and cropping</h3>
                    <p>Dimension context ("Instagram square," "thumbnail banner," "half the size") maps to explicit <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">--resize</code> and crop flags. The model understands common publishing formats and translates them to pixel dimensions without you specifying numbers.</p>
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
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">How to connect Mochify via MCP</h2>
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

            <p class="mb-6">All binaries are statically linked — no dependencies needed. Also available on the <a href="https://github.com/getmochify/mochify-cli/releases" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">GitHub releases page</a>.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">2. Add to your MCP client config</h3>
            <p class="mb-3">For <strong>Claude Desktop</strong>, edit <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-sm">~/Library/Application Support/Claude/claude_desktop_config.json</code>:</p>

            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>{`{
  "mcpServers": {
    "mochify": {
      "command": "mochify",
      "args": ["serve"]
    }
  }
}`}</code></pre>

            <p class="mb-6">If you have an API key (for higher limits), pass it via the environment:</p>

            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>{`{
  "mcpServers": {
    "mochify": {
      "command": "mochify",
      "args": ["serve"],
      "env": { "MOCHIFY_API_KEY": "your-key" }
    }
  }
}`}</code></pre>

            <p class="mb-4">Restart Claude Desktop after saving. The Mochify <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-sm">squish</code> tool will appear in your assistant's available functions — test it with: <em>"Compress this image as a WebP for the web."</em></p>

            <InfoBox type="tip" title="No API key needed to start">
                Without a key, requests run on the free tier — 25 images per day per IP. Get an API key from your <a href="/dashboard" class="text-[#F06292] hover:text-[#D81B60] underline">dashboard</a> to track usage and unlock higher limits.
            </InfoBox>
        </section>

        <section id="example" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Example: compressing images from a prompt</h2>
            <p class="mb-4">Say you're working in Claude Desktop and you say:</p>

            <blockquote class="border-l-4 border-[#F06292] pl-6 py-2 mb-6 bg-[#FFF5F7] rounded-r-2xl">
                <p class="text-[#4A2C2C] font-bold italic">"Can you compress this product photo as an Instagram-ready WebP and strip the EXIF data?"</p>
            </blockquote>

            <p class="mb-4">Behind the scenes, the assistant calls Mochify's MCP server with roughly:</p>

            <ul class="space-y-2 mb-6 pl-4">
                <li><code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">--type webp</code></li>
                <li><code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">--resize 1080x1080</code></li>
                <li><code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">--strip-exif</code></li>
            </ul>

            <p class="mb-6">The result comes back in seconds — a web-optimized 1080×1080 WebP with no metadata attached. You didn't touch a settings panel or look up Instagram's recommended dimensions. The agent handled the full decision chain.</p>

            <figure class="rounded-2xl overflow-hidden border border-pink-100 shadow-sm">
                <img src="/claude_mochified.webp" alt="Claude Desktop compressing an image via Mochify MCP — the assistant calls the squish tool and returns an optimized WebP" class="w-full" loading="lazy" />
                <figcaption class="bg-[#FFF5F7] px-5 py-3 text-sm text-[#875F42] text-center border-t border-pink-100">
                    Mochify in action: Here, Claude is using the Mochify MCP server to optimize a desktop screenshot. Total reduction: 96%. All handled locally via natural language.
                </figcaption>
            </figure>
        </section>

        <section id="comparison" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">MCP vs. the web tool: when to use each</h2>
            <p class="mb-6">Both options use the same squish engine and deliver the same output quality. The difference is workflow fit.</p>

            <div class="overflow-x-auto rounded-xl border border-pink-100 shadow-sm mb-6">
                <table class="w-full text-left bg-white whitespace-nowrap md:whitespace-normal">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black"></th>
                            <th class="p-4 font-black">Web tool (mochify.xyz)</th>
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
            </div>

            <p>If you're optimizing images as part of a larger agent workflow — content pipelines, automated publishing, code-adjacent tasks — MCP is the right path. For quick, individual jobs, the web tool is faster to reach.</p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Cheat sheet: prompt-to-flag mapping</h2>

            <div class="overflow-x-auto rounded-xl border border-pink-100 shadow-sm mb-8">
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
            </div>
        </section>

        <section id="faq" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">FAQ</h2>

            <div class="space-y-6">
                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">What is an MCP server?</h3>
                    <p>MCP (Model Context Protocol) is an open standard that lets AI assistants call external tools and APIs mid-conversation. The Mochify MCP server exposes our compression engine as a callable tool any compatible assistant can use.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">Which AI assistants support MCP?</h3>
                    <p>Claude Desktop, Cursor, and a growing number of tools support MCP natively. Check your assistant's documentation for MCP tool configuration support.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">Is image compression via MCP as good as the web tool?</h3>
                    <p>Yes — the same native C++ squish engine handles both. Output quality and format support are identical.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">Does using MCP mean my images are stored?</h3>
                    <p>No. Mochify's zero-retention policy applies regardless of how you connect. Images are processed in memory and never written to disk or retained after the job completes.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">Can I use MCP for batch jobs?</h3>
                    <p>That depends on how your agent is set up to call the tool. The MCP server itself can handle individual calls in sequence — building a batch loop is possible within your agent's logic.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">What formats does the MCP server support?</h3>
                    <p>WebP, AVIF, JPEG XL, and JPEG (via jpegli). The connected AI assistant selects the format based on your prompt.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">How does this differ from the natural language feature on the homepage?</h3>
                    <p>The homepage feature is browser-based and designed for individual, manual use. The MCP server is for agent-driven workflows where an AI assistant is handling the task as part of a larger pipeline — without you touching a browser.</p>
                </div>
            </div>
        </section>

        <section id="related" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">Related guides</h2>
            <ul class="space-y-3">
                <li>
                    <a href="/guides/self-hosting-image-optimization-docker" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                        <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">How to Self-Host an Image Optimization API with Docker <span class="font-normal opacity-70">— Full control, local deployment</span></span>
                        <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                    </a>
                </li>
                <li>
                    <a href="/guides/2026-guide-next-gen-formats" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                        <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">The 2026 Guide to Next-Gen Formats: WebP, AVIF, and JPEG XL <span class="font-normal opacity-70">— Format benchmarks and use cases</span></span>
                        <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                    </a>
                </li>
                <li>
                    <a href="/guides/privacy-image-optimization" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                        <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Privacy & Image Optimization: A Comprehensive Guide (2026) <span class="font-normal opacity-70">— Zero-retention explained in depth</span></span>
                        <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                    </a>
                </li>
                <li>
                    <a href="/guides/exif-data-risks-image-compression-2026" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                        <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">The Risks of EXIF Data in Image Compression (2026) <span class="font-normal opacity-70">— Why metadata stripping matters</span></span>
                        <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                    </a>
                </li>
            </ul>
        </section>

        <div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>

            <div class="relative z-10 mb-6">
                <span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">
                    Free Tool
                </span>
            </div>

            <h3 class="text-2xl md:text-3xl font-black text-[#4A2C2C] relative z-10 mb-3 flex items-center justify-center gap-3">
                Try it without MCP — just describe what you need
            </h3>

            <p class="text-[#6C3F31] text-lg max-w-lg mx-auto relative z-10 mb-8 leading-relaxed">
                No account. No dropdowns. The natural language feature on the web tool works the same way — type your goal, upload your image, done.
            </p>

            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
                <span>Start Optimizing Free</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

    </div>
</article>
