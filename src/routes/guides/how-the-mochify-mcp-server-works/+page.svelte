<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "How the Mochify MCP Server Works: Hosted vs Local, with Worked Examples",
        description: "How Mochify's MCP server handles image compression for AI agents, hosted vs local workflows, token costs, and four worked examples.",
        category: "AI & Automation",
        readTime: "9 min read",
        date: "May 28, 2026",
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
      "@type": "Article",
      "headline": "How the Mochify MCP Server Works: Hosted vs Local, with Worked Examples",
      "description": "How Mochify's MCP server handles image compression for AI agents, hosted vs local workflows, token costs, and four worked examples.",
      "author": { "@type": "Organization", "name": "Mochify Engineering Team" },
      "publisher": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" },
      "datePublished": "2026-05-28",
      "dateModified": "2026-05-28",
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://mochify.app/guides/how-the-mochify-mcp-server-works" }
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does using the Mochify MCP server cost more tokens than the web app?",
          "acceptedAnswer": { "@type": "Answer", "text": "The web app costs no agent tokens at all. Among agent-driven workflows: hosted MCP URL input is now nearly free in both directions because compressed results return as a download URL rather than inline bytes. Hosted MCP upload input is expensive on the way in but cheap on the way back (a URL string). The local install remains the cheapest of all because no image bytes ever enter the agent's context in either direction." }
        },
        {
          "@type": "Question",
          "name": "Does the hosted MCP server store my images?",
          "acceptedAnswer": { "@type": "Answer", "text": "The original you send is processed in RAM and discarded immediately after encoding. The hosted MCP briefly holds the compressed result in a pickup store with a five-minute TTL so it can return a download URL. After five minutes the result is evicted. The local install workflows skip the pickup store entirely." }
        },
        {
          "@type": "Question",
          "name": "Can I use the MCP server on the Free tier?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. MCP and API access are included on all tiers: Free (25 images/month), Seller, and Pro. The monthly image limit applies equally across the web app, the MCP server, and the API." }
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
            How the Mochify MCP Server Works: Hosted vs Local, with Worked Examples
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            The bridge between your AI agent and our compression engine comes in two distinct flavours. Here's how each one works, where each one belongs, and the part nobody else writes down: where the MCP server actually saves you tokens, and where it doesn't.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                This guide covers the hosted MCP server at <code class="bg-pink-100 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mcp.mochify.app</code> and the local MCP server via <code class="bg-pink-100 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mochify serve</code> - their architecture, setup, token-cost profiles, retention behaviour, and four concrete worked examples.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-4 border border-pink-100 shadow-inner" aria-label="Table of contents">
                <ul class="space-y-3">
                    {#each [
                        { n: '01', href: '#cheat-sheet',  label: '30-second cheat sheet' },
                        { n: '02', href: '#two-surfaces', label: 'The two surfaces of the Mochify MCP server' },
                        { n: '03', href: '#hosted-mcp',   label: 'How the hosted MCP server works' },
                        { n: '04', href: '#local-install', label: 'How the local install works' },
                        { n: '05', href: '#when-to-use',  label: 'When to use which (decision table)' },
                        { n: '06', href: '#example-1',    label: 'Worked example 1: hosted MCP with a public URL' },
                        { n: '07', href: '#example-2',    label: 'Worked example 2: hosted MCP with an uploaded image' },
                        { n: '08', href: '#example-3',    label: 'Worked example 3: local MCP server in Claude Desktop' },
                        { n: '09', href: '#example-4',    label: 'Worked example 4: direct CLI in Claude Code or a build pipeline' },
                        { n: '10', href: '#token-cost',   label: 'The honest answer on token cost' },
                        { n: '11', href: '#faq',          label: 'FAQ' },
                        { n: '12', href: '#related',      label: 'Related guides' },
                    ] as item}
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

        <!-- Cheat Sheet -->
        <section id="cheat-sheet" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">30-Second Cheat Sheet</h2>
            <p class="mb-6">If your goal is the lowest possible token cost, use either local mode or hosted-MCP URL input. The hosted MCP now returns compressed results as a short-lived download URL rather than inline binary - which fixes the old return-side problem but means the compressed result is briefly held in Mochify-controlled storage.</p>

            <ScrollableTable class="mb-6">
                <table class="w-full text-left bg-white text-sm">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">Workflow</th>
                            <th class="p-4 font-black">Image bytes go to</th>
                            <th class="p-4 font-black">In agent context?</th>
                            <th class="p-4 font-black">Best for</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr>
                            <td class="p-4 font-bold">Hosted MCP, URL input</td>
                            <td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">api.mochify.app</code></td>
                            <td class="p-4">Neither (URLs in, URL out)</td>
                            <td class="p-4">Public or CDN-hosted images you want as AVIF, WebP, or JXL</td>
                        </tr>
                        <tr>
                            <td class="p-4 font-bold">Hosted MCP, uploaded image</td>
                            <td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">api.mochify.app</code></td>
                            <td class="p-4">Input only (output returns as URL)</td>
                            <td class="p-4">Small images already in a conversation</td>
                        </tr>
                        <tr>
                            <td class="p-4 font-bold">Local MCP (<code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">mochify serve</code>)</td>
                            <td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">api.mochify.app</code> via local binary</td>
                            <td class="p-4">Neither (paths only)</td>
                            <td class="p-4">Claude Desktop, Cursor, file work on disk</td>
                        </tr>
                        <tr>
                            <td class="p-4 font-bold">Direct CLI (<code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">mochify</code>)</td>
                            <td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">api.mochify.app</code> via local binary</td>
                            <td class="p-4">Neither (paths only)</td>
                            <td class="p-4">Build pipelines, Claude Code, batch jobs, scripts</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>

            <InfoBox type="note" title="Encoding always happens server-side">
                Encoding still happens in RAM on <code class="bg-blue-50 text-blue-600 px-1.5 py-px rounded font-mono text-sm">api.mochify.app</code> for all four workflows. Local install workflows skip the pickup store entirely - the compressed bytes flow straight from the API back to your disk.
            </InfoBox>
        </section>

        <!-- Two Surfaces -->
        <section id="two-surfaces" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">The Two Surfaces of the Mochify MCP Server</h2>
            <p class="mb-4">Mochify exposes its compression engine to AI agents through two separate surfaces. Both ultimately call the same hosted API at <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">api.mochify.app/v1/squish</code>, where the encoding work happens in RAM and the original is discarded immediately. They differ in where the agent's request originates, whether image bytes ever pass through the agent's context window, and whether the compressed result is briefly held server-side for pickup.</p>

            <p class="mb-4">The <strong class="text-[#4A2C2C]">hosted MCP server</strong> lives at <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">https://mcp.mochify.app</code>. Any MCP-compatible client - Claude Desktop, Cursor, any agent runtime that supports remote connectors - can register it, authenticate via OAuth, and call its tools. The agent sends a request, Mochify's hosted MCP forwards it to the API, and the processed image comes back as a short-lived download URL on <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">files.mochify.app</code>.</p>

            <p class="mb-4">The <strong class="text-[#4A2C2C]">local MCP server</strong> is a single Rust binary (<code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mochify</code>) that ships via Homebrew, raw download, or <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">cargo install</code>. It runs as a direct CLI in your shell, and the same binary runs as a local MCP server when launched with <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mochify serve</code> and registered in your Claude Desktop config. In both local modes, the agent sees only file paths and metadata - image bytes flow from your disk to the API via the local binary and never enter the agent's context window.</p>

            <p>You don't pick one over the other for life. You pick the right one for the job at hand. The rest of this guide gets specific about which is which.</p>
        </section>

        <!-- Hosted MCP -->
        <section id="hosted-mcp" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">How the Hosted MCP Server Works</h2>
            <p class="mb-6">The hosted server is a connector that any MCP-compatible AI assistant can register and call. Once OAuth is complete, the agent has two tools available: <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">squish</code> for image processing, and <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">check_usage</code> for quota checks.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">Setup, in one paragraph</h3>
            <p class="mb-6">In Claude Desktop, go to Settings → Connectors, add <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">https://mcp.mochify.app</code>, then complete an OAuth flow that authorises Mochify to process images on your behalf. Cursor and other clients follow the same shape. The full step-by-step is in our <a href="/guides/mochify-mcp-image-compression-agent-2026">MCP setup guide</a>. Authentication is OAuth-based, the connector talks to our servers over HTTPS, and the agent doesn't need to manage an API key directly.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">The <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-base">squish</code> tool</h3>
            <p class="mb-4">The <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">squish</code> tool accepts either a public HTTPS URL to fetch the image from, or raw base64 image bytes plus a media type. It returns a <strong class="text-[#4A2C2C]">short-lived download URL</strong> for the processed image - a five-minute TTL on <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">files.mochify.app</code>, with an explicit "expires in ~5 minutes" note in the response so the agent and any downstream tool know exactly when the link goes dead.</p>

            <p class="mb-6">JPEG is the default output (encoded with Google's jpegli encoder, which delivers roughly 35% better compression than <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">libjpeg-turbo</code> at matched quality). AVIF, JPEG XL, WebP, and PNG are also supported. Options include resize, smart-crop to a subject, EXIF stripping, brightness, clarity, <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">smartCompress</code>, HDR gain-map preservation, and AI background removal.</p>

            <InfoBox type="note" title="URL passback is a recent change">
                Earlier versions of the hosted MCP returned the processed image inline as binary content, which produced reliable hangs and unsaveable results across most chat clients. URL passback fixes that, at the cost of a brief pickup window on Mochify's side - covered in the retention section below.
            </InfoBox>

            <h3 id="retention-honestly" class="text-xl font-black text-[#4A2C2C] mb-3 scroll-mt-24">Retention, honestly</h3>
            <p class="mb-4">The original image you send to Mochify is streamed into the encoder in RAM, processed, and discarded. There are no disk writes of the source, and no logs containing image data.</p>

            <p class="mb-4">What URL passback adds is a brief <strong class="text-[#4A2C2C]">pickup window</strong> for the compressed result. After encoding, Mochify holds the processed bytes in a pickup store keyed by an unguessable hash, with a five-minute TTL. After five minutes the result is evicted regardless of whether anything fetched it.</p>

            <div class="bg-[#FFF9F5] rounded-2xl p-6 border border-[#FFE4D6] my-6">
                <p class="text-[#6C3F31] mb-0">This is a softening of the original "wiped immediately" claim on the compressed-output side. We'd rather describe it accurately than carry a phrase that no longer matches what the server does. The two local install workflows don't use the pickup store at all - the local binary receives the compressed bytes from the API and writes them straight to your disk. If you need the strongest possible end-to-end retention story, use a local mode or self-host via our <a href="/guides/self-hosting-image-optimization-docker">Docker guide</a>.</p>
            </div>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">Where the agent's tokens go</h3>
            <p class="mb-4">Now that the hosted MCP returns a download URL instead of an inline image, the token-cost story has shifted. URL input is genuinely cheap on both sides: a URL in, a URL out. Upload input is still expensive on the way in because the image is base64-encoded into the tool-call payload, but the return is a short text URL rather than a binary blob - a one-way cost rather than two-way.</p>

            <p>When you use the hosted MCP through Claude, what passes through the agent provider's systems is now just the download URL string, unless the agent itself fetches the file and brings the bytes into the conversation. The image bytes only enter the chat provider's infrastructure if the agent decides they need to.</p>
        </section>

        <!-- Local Install -->
        <section id="local-install" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">How the Local Install Works</h2>
            <p class="mb-6">The local install is a single Rust binary that runs as either a direct CLI or as a local MCP server that Claude Desktop spawns as a subprocess. In either mode, the agent sees only file paths and compression metadata - never image bytes, and nothing held server-side after the compressed result is written to your disk.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">Installation and auth</h3>
            <p class="mb-3 font-semibold text-[#4A2C2C]">macOS (Homebrew):</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>brew tap getmochify/mochify
brew install mochify</code></pre>

            <p class="mb-4">One auth step covers both CLI and MCP modes:</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>mochify auth login</code></pre>
            <p class="mb-6">This opens your browser, you sign in with your Mochify account, and credentials are written to <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">~/.config/mochify/credentials.toml</code>. No environment variables to manage, no API key to copy and paste.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">Direct CLI mode</h3>
            <p class="mb-4">The CLI takes one or more file paths and a set of options. The <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">-p</code> flag is the headline feature - describe the goal in plain English:</p>

            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-4 overflow-x-auto font-mono text-sm leading-relaxed"><code>mochify photo.jpg -p "optimise for eBay"
mochify *.heic -p "convert to WebP, 1200px wide, strip EXIF" -o ./out</code></pre>

            <p class="mb-4">It also accepts file paths on stdin, which is what makes it slot cleanly into any Unix pipeline:</p>

            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>find . -name "*.jpg" | mochify -t webp -o ./out
ls *.heic | mochify -t jpg</code></pre>

            <ScrollableTable class="mb-6">
                <table class="w-full text-left bg-white text-sm">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">Flag</th>
                            <th class="p-4 font-black">What it does</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">-t, --type &lt;FORMAT&gt;</code></td><td class="p-4">Output format: <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">jpg</code>, <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">png</code>, <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">webp</code>, <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">avif</code>, <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">jxl</code></td></tr>
                        <tr><td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">-w, --width &lt;N&gt;</code></td><td class="p-4">Target width in pixels</td></tr>
                        <tr><td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">-H, --height &lt;N&gt;</code></td><td class="p-4">Target height in pixels</td></tr>
                        <tr><td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">--crop</code></td><td class="p-4">Saliency-guided crop to exact dimensions</td></tr>
                        <tr><td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">-o, --output &lt;DIR&gt;</code></td><td class="p-4">Output directory (defaults to input dir)</td></tr>
                        <tr><td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">-n, --name &lt;NAME&gt;</code></td><td class="p-4">Base name for the output file</td></tr>
                        <tr><td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">-r, --rotation &lt;DEG&gt;</code></td><td class="p-4">Rotate by 0, 90, 180, or 270 degrees</td></tr>
                        <tr><td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">--clarity</code></td><td class="p-4">Midtone contrast enhancement</td></tr>
                        <tr><td class="p-4"><code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">-p, --prompt &lt;TEXT&gt;</code></td><td class="p-4">Natural-language prompt that resolves all params automatically</td></tr>
                    </tbody>
                </table>
            </ScrollableTable>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">Local MCP server mode</h3>
            <p class="mb-3">Same binary, different invocation. Add this to <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">~/Library/Application Support/Claude/claude_desktop_config.json</code>:</p>

            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>{`{
  "mcpServers": {
    "mochify": {
      "command": "mochify",
      "args": ["serve"]
    }
  }
}`}</code></pre>

            <p class="mb-4">Restart Claude Desktop. The <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">squish</code> tool now appears in the connections panel and uses the credentials from your earlier <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">mochify auth login</code>. No OAuth round-trip, no remote connector to refresh, no token expiry to worry about.</p>

            <InfoBox type="tip" title="Give Claude the full path">
                When asking Claude to process an image via the local MCP, give it the full path: <em>"Convert /Users/me/Desktop/photo.jpg to AVIF at 1000px wide."</em> The local binary opens the file, sends bytes to the API, gets the result back, writes it to disk, and returns the saved path and file size. The image never enters Claude's context.
            </InfoBox>
        </section>

        <!-- When to use which -->
        <section id="when-to-use" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">When to Use Which</h2>
            <p class="mb-6">Pick by what's true about your task, not by which tool you've heard of.</p>

            <ScrollableTable class="mb-8">
                <table class="w-full text-left bg-white text-sm">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">If…</th>
                            <th class="p-4 font-black">Use</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4">Someone shared an image URL and you want it as AVIF or WebP</td><td class="p-4 font-semibold">Hosted MCP (URL input)</td></tr>
                        <tr><td class="p-4">You want to drag a small image into a chat and have it compressed</td><td class="p-4 font-semibold">Hosted MCP (upload) - see <a href="#example-2">Worked Example 2</a></td></tr>
                        <tr><td class="p-4">You're in Claude Desktop and images live on your laptop</td><td class="p-4 font-semibold">Local MCP server (<code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">mochify serve</code>)</td></tr>
                        <tr><td class="p-4">You're in Claude Code working in a project repo full of images</td><td class="p-4 font-semibold">Direct CLI</td></tr>
                        <tr><td class="p-4">You're building a static site and want compression as a build step</td><td class="p-4 font-semibold">Direct CLI (no agent needed)</td></tr>
                        <tr><td class="p-4">Your agent is generating images and needs to compress before commit</td><td class="p-4 font-semibold">Direct CLI from the script</td></tr>
                        <tr><td class="p-4">You want zero image bytes in any agent's context window</td><td class="p-4 font-semibold">Either local mode</td></tr>
                        <tr><td class="p-4">No developer environment, want the simplest possible AI workflow</td><td class="p-4 font-semibold">Hosted MCP with a URL</td></tr>
                    </tbody>
                </table>
            </ScrollableTable>

            <div class="my-8 bg-[#FFF5F7] p-8 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <h3 class="text-xl font-black text-[#4A2C2C] relative z-10 mb-2">Ready to connect Mochify to your AI workflow?</h3>
                <p class="text-[#6C3F31] relative z-10 mb-6">MCP and API access are included on every plan, starting at Free. No paywall on developer or agent features.</p>
                <a href="/pricing" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
                    View plans
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </a>
            </div>
        </section>

        <!-- Example 1 -->
        <section id="example-1" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Worked Example 1: Hosted MCP with a Public URL</h2>
            <p class="mb-6">URL-input mode is the cheapest hosted MCP workflow: no image bytes touch the agent's context window in either direction - a URL string in, a URL string out.</p>

            <p class="mb-4">A blogger is in Claude Desktop with the Mochify connector registered. They say: <em>"Convert this hero image to AVIF and resize to 1200px wide for my blog: https://example.com/photo.jpg"</em></p>

            <div class="bg-gradient-to-br from-[#FFF5F7] to-[#FDFBF7] rounded-3xl p-6 border border-pink-100 mb-6">
                <ol class="space-y-5">
                    {#each [
                        `Claude maps the request via Magic Flow to <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">squish({ url: "https://example.com/photo.jpg", type: "avif", width: 1200 })</code>.`,
                        `Mochify's hosted server fetches <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">photo.jpg</code> from <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">example.com</code>, runs it through the AVIF encoder in RAM, and parks the compressed result in its pickup store.`,
                        `The tool response carries a short-lived download URL on <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">files.mochify.app</code> (valid for five minutes). Claude fetches the URL to show you the result or hands you the link directly.`,
                    ] as step, i}
                        <li class="flex gap-4 items-start">
                            <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <span class="text-[#6C3F31]">{@html step}</span>
                        </li>
                    {/each}
                </ol>
                <p class="mt-5 pt-4 border-t border-pink-100 text-sm text-[#875F42]">Token cost: just the URL strings and options in both directions. The original image bytes never touch the agent's context, and the compressed bytes only reach the chat if Claude chooses to fetch the result for display. This is the cheapest of the hosted-MCP workflows by a wide margin.</p>
            </div>

            <p>For format context: <a href="https://web.dev/articles/compress-images-avif">web.dev's AVIF compression study</a> places AVIF at 40–50% smaller files than JPEG at matched visual quality. Browser support sits at over 95% globally per <a href="https://caniuse.com/avif">caniuse.com/avif</a>, so the output is safe to serve as the primary format on most modern sites.</p>
        </section>

        <!-- Example 2 -->
        <section id="example-2" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Worked Example 2: Hosted MCP with an Uploaded Image</h2>
            <p class="mb-6">This was historically the workflow most people tried first, and it disappointed in three independent ways. One of those three is now fixed. We're going to be just as direct about what's solid as we were about what wasn't.</p>

            <div class="bg-[#FFF9F5] rounded-2xl p-6 border border-[#FFE4D6] mb-4">
                <h3 class="text-base font-black text-[#4A2C2C] mb-2">Failure 1 (still applies): the image you uploaded isn't the image Mochify receives.</h3>
                <p class="text-[#6C3F31] text-base mb-0">When you attach a file to a chat, the client's vision pipeline resizes it - typically to around 1568 pixels on the long edge - and frequently re-encodes it before the model can see anything. The bytes the model packages into the tool call are that vision-processed copy, not your original. For a screenshot you're sending around at thumbnail size this is fine. For a hero image where pixel-level quality matters, it isn't.</p>
            </div>

            <div class="bg-[#FFF9F5] rounded-2xl p-6 border border-[#FFE4D6] mb-4">
                <h3 class="text-base font-black text-[#4A2C2C] mb-2">Failure 2 (still applies): the base64 round-trip is size-capped.</h3>
                <p class="text-[#6C3F31] text-base mb-0">The full image, base64-encoded into JSON, has to fit inside the MCP tool-call payload, and base64 inflates bytes by roughly a third. Anything much larger than a small screenshot is at risk of being truncated or rejected outright.</p>
            </div>

            <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100 mb-6">
                <h3 class="text-base font-black text-[#4A2C2C] mb-2">Failure 3 (fixed): returning the compressed image inline used to be unreliable.</h3>
                <p class="text-[#6C3F31] text-base mb-0">Mochify's hosted MCP previously returned the processed image inline as binary content, which forced the chat client to render or save a binary blob from a tool response. Support varied wildly, and in practice the tool call frequently hung or produced a result the user couldn't save. We've now switched to URL passback: the response is a text URL on <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">files.mochify.app</code>, valid for five minutes. Chat clients handle a URL string without difficulty.</p>
            </div>

            <p class="mb-4">Where this leaves us: the drag-into-chat workflow is now genuinely usable for small images where the quality hit from chat-client upload pre-processing doesn't matter - a screenshot you're prepping for a Notion page, a thumbnail you want as AVIF, a quick conversion of a small graphic. It is <em>not</em> the right workflow for a hero image, a product photo, or anything where you'd want pixel-accurate output. For those, use <a href="#example-1">Worked Example 1</a> (URL input) or <a href="#example-3">Worked Example 3</a> (local MCP server).</p>

            <p class="mb-4">A worked run: drag a small PNG screenshot into Claude with <em>"Make this web-ready."</em> Claude calls <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">squish({'{'} data: "&lt;base64...&gt;", mediaType: "image/png", optimizeForWeb: true {'}'})</code>. Magic Flow infers AVIF output with sensible web-ready defaults and EXIF stripping. Mochify processes the vision-processed copy of your screenshot and returns:</p>

            <pre class="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl p-5 mb-4 overflow-x-auto font-mono text-sm leading-relaxed"><code>Image processed successfully (image/avif, 12.7 KB).
Download URL (expires in ~5 minutes): https://files.mochify.app/629b...d46.avif</code></pre>

            <p>Claude either fetches that URL and shows you the result, or hands you the link directly. The compressed file lives on <code class="bg-pink-50 text-[#D81B60] px-2 py-px rounded font-mono text-sm">files.mochify.app</code> for the rest of the five-minute window and then disappears.</p>
        </section>

        <!-- Example 3 -->
        <section id="example-3" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Worked Example 3: Local MCP Server in Claude Desktop</h2>
            <p class="mb-6">The local MCP server is the right surface for chat-driven file work: image bytes flow directly from disk to the API and back to disk, no agent context touched, no pickup store involved.</p>

            <blockquote class="border-l-4 border-[#F06292] pl-6 py-3 mb-6 bg-[#FFF5F7] rounded-r-2xl">
                <p class="text-[#4A2C2C] font-semibold italic">"Convert all the JPEGs in /Users/sam/Desktop/product-shoot/ to AVIF at 1200px wide and save them to /Users/sam/Desktop/product-shoot/web/"</p>
            </blockquote>

            <div class="bg-gradient-to-br from-[#FFF5F7] to-[#FDFBF7] rounded-3xl p-6 border border-pink-100 mb-6">
                <ol class="space-y-5">
                    {#each [
                        'Claude picks up that this is an image-processing task and finds the <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">squish</code> tool on the locally-registered <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">mochify</code> MCP server.',
                        'Claude calls <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">squish</code> once per file, passing the full file path plus the resolved parameters from Magic Flow.',
                        'The local <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">mochify</code> binary, running as a subprocess, opens each file from disk, sends the bytes to <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">api.mochify.app/v1/squish</code>, receives the compressed result, and writes it to the requested output directory.',
                        'The MCP tool response back to Claude contains the saved path, original size, and new size. No image bytes.',
                        'Claude summarises: <em>"Compressed 24 product photos. Originals 38.7 MB total; AVIF outputs 9.1 MB total. Average saving 77%. Files in ~/Desktop/product-shoot/web/"</em>',
                    ] as step, i}
                        <li class="flex gap-4 items-start">
                            <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <span class="text-[#6C3F31]">{@html step}</span>
                        </li>
                    {/each}
                </ol>
                <p class="mt-5 pt-4 border-t border-pink-100 text-sm text-[#875F42]">Token cost: the agent never holds image bytes - paths and metadata only. No pickup store on Mochify's side either: the compressed bytes flow straight from the API back to disk via the local binary. Setup was a one-time <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">brew install mochify</code>, <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-xs">mochify auth login</code>, and three lines of JSON in the config file.</p>
            </div>
        </section>

        <!-- Example 4 -->
        <section id="example-4" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Worked Example 4: Direct CLI in Claude Code or a Build Pipeline</h2>
            <p class="mb-6">The direct CLI is the cheapest workflow per image by orders of magnitude - zero image bytes in any agent context, works with no agent at all, and slots cleanly into any Unix pipeline or CI step.</p>

            <p class="mb-4">A developer working on a Next.js site opens Claude Code and asks: <em>"Optimise everything in public/images to AVIF and WebP, then add a preload tag for the hero image."</em></p>

            <div class="bg-gradient-to-br from-[#FFF5F7] to-[#FDFBF7] rounded-3xl p-6 border border-pink-100 mb-6">
                <ol class="space-y-5">
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span class="text-[#6C3F31]">Claude reads the directory listing (just filenames and sizes, not pixels).</span>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <div class="flex-1 min-w-0 text-[#6C3F31]">
                            <p class="mb-2">Claude runs two shell commands to produce both formats:</p>
                            <pre class="bg-[#2D1B1B] text-pink-100 rounded-xl p-4 overflow-x-auto font-mono text-sm leading-relaxed"><code>mochify ./public/images/*.{'{jpg,png}'} -p "web-ready AVIF, max 1600px wide" -o ./public/images
mochify ./public/images/*.{'{jpg,png}'} -t webp -w 1600 -o ./public/images</code></pre>
                        </div>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span class="text-[#6C3F31]">The CLI processes the folder in place. Each invocation prints a summary line per file plus a totals line.</span>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-8 h-8 bg-[#F06292] text-white font-black text-sm rounded-full flex items-center justify-center shrink-0 mt-0.5">4</span>
                        <span class="text-[#6C3F31]">Claude parses the summaries, then edits <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">app/page.tsx</code> to add the preload tag and the <code class="bg-pink-100 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">&lt;picture&gt;</code> element with the AVIF / WebP / JPEG fallback chain.</span>
                    </li>
                </ol>
                <p class="mt-5 pt-4 border-t border-pink-100 text-sm text-[#875F42]">Token cost: zero image bytes anywhere in the agent's context. Only paths, filenames, sizes, and the CLI's text output.</p>
            </div>

            <p class="mb-4">The same pattern works without an agent at all. A content engineer building an unattended publishing pipeline:</p>

            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-4 overflow-x-auto font-mono text-sm leading-relaxed"><code># Generate the hero, optimise to AVIF + WebP, then commit
generate-hero-image "$DRAFT_PATH" /tmp/hero.png
mochify /tmp/hero.png -p "AVIF web-ready hero, 1600 wide" -o ./public/heroes/
mochify /tmp/hero.png -t webp -w 1600 -o ./public/heroes/
git add ./public/heroes/ && git commit -m "Add hero for $DRAFT_PATH"</code></pre>

            <p class="mb-4">Or the stdin pipe pattern for batch jobs:</p>

            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 mb-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>find ./uploads -name "*.heic" | mochify -t jpg -o ./out</code></pre>

            <p>No upload step, no download step, no chat round-trip, no per-image agent token cost. For container-based pipelines, see our <a href="/guides/self-hosting-image-optimization-docker">self-hosting image optimisation with Docker guide</a>.</p>
        </section>

        <!-- Token Cost -->
        <section id="token-cost" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">The Honest Answer on Token Cost</h2>
            <p class="mb-4">The hosted MCP server used to be a workflow saver but not a token saver, because compressed results returned inline as binary. With URL passback, that's no longer true on the return side. The local install remains the cheapest workflow per image, because no image bytes ever enter the agent's context in either direction.</p>

            <p class="mb-4">The <strong class="text-[#4A2C2C]">hosted MCP server with URL input</strong> is now genuinely cheap both ways - a URL string in, a URL string out. Upload input is still expensive on the way in because the image is base64-encoded into the tool-call payload, but the return is a short text URL rather than a binary blob; it's a one-way cost rather than a two-way one.</p>

            <p class="mb-6">The <strong class="text-[#4A2C2C]">local install (CLI or <code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">mochify serve</code>)</strong> is still the cheapest workflow per image. Nothing about the image ever enters the agent's context - not on the way in, not on the way back. For batch workflows the difference is dramatic: compressing 100 images via the hosted-MCP upload path would push 100 base64 payloads through your agent's context; compressing them via the local install puts a handful of summary lines in.</p>

            <InfoBox type="note" title="Image bytes still travel to Mochify's servers">
                In local modes, the image bytes still travel from your laptop to <code class="bg-blue-50 text-blue-600 px-1.5 py-px rounded font-mono text-sm">api.mochify.app</code> over HTTPS for the actual encoding work. They never hit your agent's context, but they do hit Mochify's servers, where the original is processed in RAM and discarded immediately. If you need image bytes to never leave your machine, the only option is to self-host the engine via our <a href="/guides/self-hosting-image-optimization-docker" class="text-blue-600 hover:text-blue-700 underline">Docker self-hosting guide</a>.
            </InfoBox>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3">The practical rule</h3>
            <ul class="list-disc pl-6 mb-6 space-y-2 marker:text-[#F06292]">
                <li>A few chat-driven image edits per week with no install - use the hosted MCP and don't worry about it.</li>
                <li>Chat-driven work where the files are already on your laptop - install the local MCP server (<code class="bg-pink-50 text-[#D81B60] px-1.5 py-px rounded font-mono text-sm">mochify serve</code>).</li>
                <li>Anything resembling a pipeline (build step, content workflow, batch processing, repo-wide cleanup, agentic content generation) - use the direct CLI.</li>
            </ul>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-4">Benchmark: 1600px PNG source, three formats</h3>
            <ScrollableTable class="mb-4">
                <table class="w-full text-left bg-white text-sm">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">Output format</th>
                            <th class="p-4 font-black">Quality setting</th>
                            <th class="p-4 font-black">File size</th>
                            <th class="p-4 font-black">Reduction vs. source</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4 font-semibold text-[#4A2C2C]">PNG (source)</td><td class="p-4">—</td><td class="p-4">3.1 MB</td><td class="p-4">—</td></tr>
                        <tr><td class="p-4">JPEG (jpegli)</td><td class="p-4">80</td><td class="p-4 font-semibold text-[#4A2C2C]">193 KB</td><td class="p-4 text-[#15803d] font-bold">−94%</td></tr>
                        <tr><td class="p-4">WebP</td><td class="p-4">80</td><td class="p-4 font-semibold text-[#4A2C2C]">122 KB</td><td class="p-4 text-[#15803d] font-bold">−96%</td></tr>
                        <tr><td class="p-4">AVIF</td><td class="p-4">60</td><td class="p-4 font-semibold text-[#4A2C2C]">80 KB</td><td class="p-4 text-[#15803d] font-bold">−97%</td></tr>
                    </tbody>
                </table>
            </ScrollableTable>
            <p class="text-sm text-[#875F42] italic mb-8">Source is a lossless 1600px PNG - the large reductions reflect PNG→lossy format conversion as well as compression. For a JPEG-to-JPEG comparison, <a href="https://opensource.googleblog.com/2024/04/introducing-jpegli-a-new-jpeg-coding.html">Google's jpegli announcement</a> reports 35% better compression than libjpeg-turbo at matched quality, and <a href="https://web.dev/articles/compress-images-avif">web.dev's AVIF benchmarks</a> place AVIF 40–50% below comparable JPEG.</p>
        </section>

        <!-- FAQ -->
        <section id="faq" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">FAQ</h2>
            <div class="space-y-4">
                {#each [
                    {
                        q: "Does using the Mochify MCP server cost more tokens than the web app?",
                        a: "The web app costs no agent tokens at all - it's just you and a browser. Among agent-driven workflows: hosted MCP URL input is now nearly free in both directions. Hosted MCP upload input is expensive on the way in (base64-encoded image bytes in the tool-call payload) but cheap on the way back (a URL string). The local install remains the cheapest of all because no image bytes ever enter the agent's context in either direction."
                    },
                    {
                        q: "Can I use the MCP server on the Free tier?",
                        a: "Yes. MCP and API access are included on all tiers: Free (25 images/month), Seller, and Pro. The monthly image limit applies equally across the web app, the MCP server, and the API."
                    },
                    {
                        q: "Does the hosted MCP server store my images?",
                        a: "The original you send is processed in RAM and discarded immediately after encoding - no disk writes, no logs containing image data. The hosted MCP does briefly hold the compressed result in a pickup store with a five-minute TTL so it can return a download URL. After five minutes the result is evicted. The local install workflows skip the pickup store entirely."
                    },
                    {
                        q: "What's the difference between Magic Flow and the squish tool?",
                        a: "squish is the low-level tool the MCP server exposes - it takes explicit parameters: format, quality, dimensions, options. Magic Flow is the natural-language layer that lets you describe the goal in plain English and have the agent resolve the parameters automatically. Most users only ever interact with Magic Flow."
                    },
                    {
                        q: "Can I run mochify without an agent?",
                        a: "Yes. mochify is a standalone Rust binary. It works from the shell, in scripts, in CI, in Docker - anywhere you can run a single static binary. Many users run the CLI directly as a build step with no agent involved at all."
                    },
                    {
                        q: "Which formats does squish actually output?",
                        a: "JPEG (encoded with jpegli for ~35% smaller files at matched quality), AVIF, JPEG XL, WebP, and PNG. AVIF is our default recommendation for web delivery; jpegli-encoded JPEG is the broad-compatibility fallback."
                    },
                    {
                        q: "Does the MCP server support background removal and smart crop?",
                        a: "Yes. squish exposes removeBackground, crop (smart crop to the subject), smartCompress (saliency-guided quality selection), brightness, clarity, stripExif, rotate, and HDR gain-map preservation. Background removal requires a Seller or Pro plan; the rest are available on all tiers."
                    },
                    {
                        q: "Can I use the MCP server through Cursor or other MCP clients?",
                        a: "Yes. For the hosted server, any client that supports remote MCP connectors over HTTP with OAuth can register https://mcp.mochify.app. For the local server, any client that supports the standard stdio MCP pattern - Cursor, Continue, Cline, Claude Code with custom config, and others - can spawn mochify serve as a subprocess. Mochify is also listed on Smithery and Glama MCP marketplaces."
                    },
                ] as item}
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
                {#each [
                    { href: '/guides/mochify-mcp-image-compression-agent-2026', title: 'How to Use Mochify via MCP: AI Agent Image Compression', desc: 'The practical setup walkthrough for connecting Mochify to Claude Desktop and other MCP clients.' },
                    { href: '/guides/ai-image-compression-natural-language-2026', title: "How Mochify's Natural Language Feature Works", desc: 'Deep dive on the Magic Flow language layer that sits in front of squish.' },
                    { href: '/guides/ai-agent-workflow-automation-photographers', title: 'AI Agent Workflow Automation for Photographers', desc: 'An end-to-end pipeline example using Claude, Dispatch, and the Mochify MCP server.' },
                    { href: '/guides/jpeg-in-2026-jpegli', title: 'Jpegli: Why It Changes the Quality-Per-Byte Game', desc: 'How the JPEG output that Mochify produces gets 35% smaller files at matched quality.' },
                    { href: '/guides/privacy-image-optimization', title: 'Privacy & Image Optimization: A Comprehensive Guide', desc: 'The zero-retention story that underpins every Mochify surface, including the MCP server.' },
                ] as guide}
                    <li>
                        <a href={guide.href} class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">— {guide.desc}</span></span>
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
                Wire Mochify into your AI workflow today
            </h3>
            <p class="text-[#6C3F31] text-lg max-w-lg mx-auto relative z-10 mb-8 leading-relaxed">
                MCP and API access are available on every plan, starting at Free. No paywall on developer or agent features.
            </p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
                <span>Start Optimizing Free</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

    </div>
</article>
