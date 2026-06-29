<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';

    const metadata = {
        title: "LLM Image Token Costs: How Many Tokens Does an Image Use?",
        description: "No single number: Claude uses width×height/750 (~1,334 tokens for 1 MP), OpenAI and Gemini use tiling. Pass file paths, not image bytes, to save context.",
        category: "AI & Automation",
        readTime: "4 min read",
        date: "June 2026"
    };

    const inlineCode = "bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100";
    const codeSmall = "bg-pink-50 text-pink-600 px-1 py-0.5 rounded text-xs font-bold border border-pink-100";

    const related = [
        { href: '/guides/how-the-mochify-mcp-server-works', title: 'How the Mochify MCP Server Works: Hosted vs Local', desc: 'The architecture behind paths-not-bytes for agent workflows.' },
        { href: '/guides/on-device-ai-agents-image-optimization', title: 'On-Device AI Agents: Image and PDF Optimization', desc: 'Running this locally on memory-constrained hardware.' },
        { href: '/guides/mochify-mcp-image-compression-agent-2026', title: 'How to Use Mochify via MCP (2026)', desc: 'Connecting an agent to Mochify step by step.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <link rel="canonical" href="https://mochify.app/guides/llm-image-token-costs" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="LLM Image Token Costs: How Many Tokens Does an Image Use?" />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/llm-image-token-costs" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "LLM Image Token Costs: How Many Tokens Does an Image Use?",
        "description": "No single number: Claude uses width×height/750 (~1,334 tokens for 1 MP), OpenAI and Gemini use tiling. Pass file paths, not image bytes, to save context.",
        "url": "https://mochify.app/guides/llm-image-token-costs",
        "datePublished": "2026-06-07",
        "dateModified": "2026-06-07",
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
            { "@type": "Thing", "name": "LLM image tokens" },
            { "@type": "Thing", "name": "Vision tokens" },
            { "@type": "Thing", "name": "Context window" },
            { "@type": "Thing", "name": "Anthropic Claude vision" },
            { "@type": "Thing", "name": "OpenAI GPT-4o vision" },
            { "@type": "Thing", "name": "Google Gemini" },
            { "@type": "Thing", "name": "Model Context Protocol" }
        ],
        "keywords": "how many tokens is an image, image tokens, vision tokens, llm image tokens, tokens per image, claude vision tokens, image token cost"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "LLM Image Token Costs: How Many Tokens Does an Image Use?", "item": "https://mochify.app/guides/llm-image-token-costs" }
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
            LLM Image Token Costs: How Many Tokens Does an Image Use?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            There is no single answer to how many tokens an image uses in an LLM; it depends on the provider, the model, and the image's dimensions. On Anthropic's Claude, the rule is <code class={inlineCode}>tokens = (width × height) / 750</code>, so a 1-megapixel (1000×1000 px) image costs roughly 1,334 tokens, capped at 1,568 on standard models. OpenAI's GPT-4o and GPT-4.1 use a tile model (85 base tokens plus 170 per 512px tile), and Google's Gemini uses fixed 768×768 px tiles at 258 tokens each. The practical takeaway for anyone building agents is the same across all three: inline image bytes burn through a context window fast, so the established fix is to pass file paths or URIs into the model, not the raw bytes.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published June 2026 by the Mochify Engineering Team.</strong>
                The per-image figures below are drawn from each provider's current vision documentation; tokenisation rules change with model releases, so dates are noted throughout.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section id="per-image-token-cost-by-provider">
            <SectionHeading>Per-image token cost by provider</SectionHeading>
            <p>The numbers below come from each provider's current vision documentation. Tokenisation rules change with model releases, so treat these as 2025–2026 figures and re-check the linked doc before you rely on a number.</p>

            <ScrollableTable class="my-6">
                <table class="w-full min-w-[720px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Provider</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Formula</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">1 MP image (1000×1000 px)</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Typical photo (1920×1080 px)</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Caps</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Anthropic / Claude (standard models)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={codeSmall}>(width × height) / 750</code></td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~1,334 tokens</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~1,568 tokens (capped and downscaled)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,568 tokens max; long edge ≤1,568 px</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Anthropic / Claude Opus 4.7 &amp; 4.8</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Same formula, higher native resolution</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~1,334 tokens</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~2,765 tokens</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">4,784 tokens max; long edge ≤2,576 px</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">OpenAI GPT-4o / GPT-4.1 (<code class={codeSmall}>detail: high</code>)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">85 base + 170 per 512px tile (after scaling to fit 2048px, shortest side 768px)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~765 tokens</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~765 tokens</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">500 images and 50MB payload per request</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">OpenAI GPT-4o (<code class={codeSmall}>detail: low</code>)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Fixed</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">85 tokens</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">85 tokens</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Flat rate</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">OpenAI GPT-4.1-mini / o4-mini (patch model)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={codeSmall}>ceil(w/32) × ceil(h/32)</code> patches, capped at 1,536, × model multiplier (1.62 for 4.1-mini, 1.72 for o4-mini)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~1,659 tokens (1,024 patches × 1.62)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Scales to ≤1,536 patches, then multiplier</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,536 patch cap before multiplier</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] font-bold">Google Gemini</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Both dims ≤384 px → 258 tokens flat; otherwise tile into 768×768 px tiles at 258 tokens each</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">~258–1,032 tokens (tile-count dependent)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">~258–516 tokens</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">No per-image cap stated</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
            <p class="text-sm text-[#875F42]">Sources: <a href="https://docs.claude.com/en/docs/build-with-claude/vision" target="_blank" rel="noopener noreferrer">Anthropic Claude vision docs</a>, <a href="https://platform.openai.com/docs/guides/vision" target="_blank" rel="noopener noreferrer">OpenAI vision docs</a>, and <a href="https://ai.google.dev/gemini-api/docs/tokens" target="_blank" rel="noopener noreferrer">Google Gemini token docs</a>, all accessed June 2026. Worked Gemini figures for non-square photos are approximate; Google documents the per-tile cost but not a worked example for a 16:9 image.</p>
        </section>

        <section id="why-this-matters">
            <SectionHeading>Why this matters for local and agent workflows</SectionHeading>
            <p>The cost is small for one image and dangerous at scale. Claude allows up to 100 images per API request on its 200k-context models, and OpenAI allows 500 image inputs per request, but the context window fills long before those hard limits bite.</p>
            <p>It is worse on local and open-weight models. Consumer hardware typically runs models at an 8k–32k token context window. At Claude's rate of about 1,334 tokens per 1 MP image, just 6 to 24 full-resolution images inline would exhaust the entire context before the model does any work. The bottleneck on memory-constrained hardware is rarely compute; it is context saturation.</p>

            <InfoBox type="tip" title="The context-saturation math">
                At ~1,334 tokens per 1 MP image, 6 to 24 full-resolution images can fill an entire 8k–32k context window before an agent starts work. (A rule of thumb derived from the published formulas above, not a single quoted source.)
            </InfoBox>
        </section>

        <section id="pass-file-paths-not-bytes">
            <SectionHeading>The fix: pass file paths, not image bytes</SectionHeading>
            <p>The durable pattern is to keep binary out of the context window and hand the model a reference instead. The <a href="https://modelcontextprotocol.io/docs/concepts/resources" target="_blank" rel="noopener noreferrer">Model Context Protocol resources specification</a> is built around exactly this: resources are identified by a URI (<code class={inlineCode}>file:///…</code>, <code class={inlineCode}>https://…</code>), so an agent receives a path or identifier rather than the encoded image. Anthropic's own guidance echoes the idea, noting that referencing uploaded images by <code class={inlineCode}>file_id</code> keeps request payloads small regardless of how many images accumulate in a conversation.</p>
            <p>This is where Mochify's local MCP server fits a token-cost argument cleanly. Run as <code class={inlineCode}>mochify serve</code>, it returns file paths and metadata to the agent, not image bytes, so a compression step never injects a multi-thousand-token blob into the model's context. You drive it in plain English, for example: <code class={inlineCode}>compress the PNGs in ./screenshots to WebP and give me the new paths</code>. The encoding itself runs on Mochify's API (<code class={inlineCode}>api.mochify.app</code>), where files are streamed into memory and wiped immediately with zero retention; the image data travels to the API to be encoded, so it is not processed on your own machine, but it also never lands in the agent's context window. The hosted MCP server follows the same principle from the other direction, returning a short-lived download URL rather than inline binary. For a full local-workflow setup on constrained hardware, see the <a href="/guides/on-device-ai-agents-image-optimization">On-Device AI Agents guide</a>.</p>
        </section>

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-2xl font-black text-[#4A2C2C] relative z-10 mb-3">Keep image bytes out of your context window</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base">Mochify's local MCP server returns file paths, not binary, so a compression step costs a handful of tokens instead of thousands. Just describe the job - for example <em>"compress the PNGs in ./screenshots to WebP and return the paths"</em>.</p>
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
                            <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">— {guide.desc}</span></span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </section>

    </div>
</article>
