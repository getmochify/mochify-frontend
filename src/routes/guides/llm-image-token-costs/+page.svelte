<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import GuideCTA from '$lib/components/GuideCTA.svelte';

    const metadata = {
        title: "LLM Image Token Costs: How Many Tokens Does an Image Use?",
        description: "No single number: about 1,300 tokens per megapixel on Claude, 1,229 on GPT-5.5+, 1,032 on Gemini. Generating one costs 196 to 7,024 output tokens. Dated.",
        category: "AI & Automation",
        readTime: "4 min read",
        date: "June 7, 2026",
        lastUpdated: "October 9, 2026"
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
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description}>
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
        "description": "No single number: about 1,300 tokens per megapixel on Claude, 1,229 on GPT-5.5+, 1,032 on Gemini. Generating one costs 196 to 7,024 output tokens. Dated.",
        "url": "https://mochify.app/guides/llm-image-token-costs",
        "datePublished": "2026-06-07",
        "dateModified": "2026-10-09",
        "inLanguage": "en",
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
                {metadata.readTime} · {metadata.date}{metadata.lastUpdated ? ` · Updated ${metadata.lastUpdated}` : ''}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            LLM Image Token Costs: How Many Tokens Does an Image Use?
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            There is no single answer to how many tokens an image uses in an LLM; it depends on the provider, the model, and the image's pixel dimensions, never its file size. As of October 2026: Anthropic's Claude counts 28×28 px visual patches, so a 1-megapixel (1000×1000 px) image costs 1,296 tokens, capped at 1,568 on standard models and 4,784 on Claude 4.7 and later. OpenAI's current models (GPT-5.4 through GPT-6) count 32×32 px patches with a 1.2× multiplier, so the same image costs 1,229 tokens; the older GPT-4o and GPT-4.1 use 85 base tokens plus 170 per 512 px tile (765 tokens). Google's Gemini charges 258 tokens per 768×768 px tile, so a 1-megapixel image is 1,032 tokens. Generating an image is billed separately as output tokens: 196 to 7,024 per 1024×1024 image on GPT Image 2.5 depending on quality, and 1,120 per 1K image on Gemini 3.1 Flash Image. The practical takeaway for anyone building agents is the same everywhere: inline image bytes burn through a context window fast, so the established fix is to pass file paths or URIs into the model, not the raw bytes.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published June 2026 by the Mochify Engineering Team.</strong>
                The per-image figures below are drawn from each provider's current vision documentation; tokenization rules change with model releases, so dates are noted throughout.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section id="per-image-token-cost-by-provider">
            <SectionHeading>Per-image token cost by provider</SectionHeading>
            <p>The numbers below come from each provider's current vision documentation. Tokenization rules change with model releases, so treat these as 2025–2026 figures and re-check the linked doc before you rely on a number.</p>

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
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Anthropic / Claude, standard tier (models before Claude 4.7)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={codeSmall}>ceil(width / 28) × ceil(height / 28)</code> visual tokens, after downscaling to a 1,568 px long edge</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,296 tokens</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,560 tokens (downscaled to 1456×819)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,568 tokens per image; long edge ≤1,568 px</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Anthropic / Claude, high-resolution tier (Claude 4.7 and later)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Same formula, downscaled only beyond a 2,576 px long edge</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,296 tokens</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">2,691 tokens (not resized)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">4,784 tokens per image; long edge ≤2,576 px</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">OpenAI GPT-5.4, 5.5, 5.6 and GPT-6 (<code class={codeSmall}>detail: high</code>)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={codeSmall}>ceil(width / 32) × ceil(height / 32)</code> patches, fitted to the detail level's limit, × 1.2</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,229 tokens (1,024 patches × 1.2)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">2,448 tokens (2,040 patches × 1.2)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">2,500-patch budget at <code class={codeSmall}>high</code>; 30,000 patches rejects the request</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">OpenAI GPT-5.1 (<code class={codeSmall}>detail: high</code>)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">70 base + 140 per 512 px tile (shortest side scaled to 768 px)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">630 tokens (4 tiles)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">910 tokens (6 tiles)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={codeSmall}>detail: low</code> is a flat 70 tokens</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">OpenAI GPT-4o / GPT-4.1 (<code class={codeSmall}>detail: high</code>)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">85 base + 170 per 512 px tile (shortest side scaled to 768 px)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">765 tokens (4 tiles)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,105 tokens (6 tiles)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={codeSmall}>detail: low</code> is a flat 85 tokens</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">OpenAI GPT-4.1-mini (patch model)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={codeSmall}>ceil(width / 32) × ceil(height / 32)</code> patches, capped at 1,536, × 1.62</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~1,659 tokens (1,024 patches × 1.62)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Scales to ≤1,536 patches, then × 1.62</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,536-patch cap before the multiplier</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] font-bold">Google Gemini</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Both sides ≤384 px → 258 tokens flat; otherwise 768×768 px tiles at 258 tokens each</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">1,032 tokens (4 tiles)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">1,548 tokens (6 tiles)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">No per-image cap stated; Google documents the tile cost, not the scaling rule</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
            <p class="text-sm text-[#875F42]">Sources: <a href="https://docs.claude.com/en/docs/build-with-claude/vision" target="_blank" rel="noopener noreferrer">Anthropic Claude vision docs</a>, <a href="https://platform.openai.com/docs/guides/vision" target="_blank" rel="noopener noreferrer">OpenAI vision docs</a>, and <a href="https://ai.google.dev/gemini-api/docs/tokens" target="_blank" rel="noopener noreferrer">Google Gemini token docs</a>, all re-read October 9, 2026 (Google's token page last updated September 23, 2026). The 1920×1080 figures assume no downscaling except where the provider documents it (Claude's standard tier); Google documents the per-tile cost but not its scaling rule, so the Gemini figures are tile counts at native size.</p>
        </section>

        <section id="image-generation-tokens">
            <SectionHeading>How many tokens does generating an image use?</SectionHeading>
            <p>Generating an image is billed on a different meter from reading one. On OpenAI's GPT Image 2.5 models a generated image is charged as image output tokens at $30 per million (October 2026 rate), and the count depends on the quality setting far more than on the size: a 1024×1024 image is 196 tokens at low quality, 439 at medium, 1,756 at high, 3,122 at xhigh and 7,024 at max, which is $0.006 to $0.21 per image before any text or image input tokens. Streaming partial images adds 100 output tokens per partial. Google prices Gemini's image models per output token too: Gemini 3.1 Flash Image counts 1,120 tokens for a 1K image, 1,680 for 2K and 2,520 for 4K at $60 per million ($0.067, $0.101 and $0.151 per image), and the cheaper Nano Banana 2.1 counts 1,120 tokens per 1K image at $30 per million ($0.0336). Anthropic's API does not generate images, so there is no Claude figure.</p>

            <ScrollableTable class="my-6">
                <table class="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Model (October 2026)</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Tokens per generated image</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Price per image (standard rate)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">OpenAI GPT Image 2.5, 1024×1024, low / medium / high</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">196 / 439 / 1,756</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">$0.006 / $0.013 / $0.053</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">OpenAI GPT Image 2.5, 1024×1024, xhigh / max</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">3,122 / 7,024</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">$0.094 / $0.211</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Google Gemini 3.1 Flash Image, 1K / 2K / 4K</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,120 / 1,680 / 2,520</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">$0.067 / $0.101 / $0.151</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] font-bold">Google Nano Banana 2.1, 1K</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">1,120</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">$0.0336</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>

            <p>Two things follow for agent builders. First, "how many tokens does an image use" has two answers, and the output one is the expensive one: reading a 1-megapixel photo costs about 1,000 to 1,300 input tokens on every current model, while generating a high-quality image can cost five times that in output tokens priced six to ten times higher. Second, the image you generate is a file the moment it lands on disk, and sending it back into the conversation as bytes pays the input price all over again; pass its path instead, which is the pattern the rest of this guide is about.</p>
            <p class="text-sm text-[#875F42]">Sources: OpenAI image generation guide and API pricing, Google Gemini API pricing, all read October 9, 2026. Prices are USD list rates and change with model releases; re-check before relying on a number.</p>
        </section>

        <section id="why-this-matters">
            <SectionHeading>Why this matters for local and agent workflows</SectionHeading>
            <p>The cost is small for one image and dangerous at scale. Claude allows up to 100 images per API request on its 200k-context models, and OpenAI allows 500 image inputs per request, but the context window fills long before those hard limits bite.</p>
            <p>It is worse on local and open-weight models. Consumer hardware typically runs models at an 8k–32k token context window. At Claude's rate of 1,296 tokens per 1 MP image, just 6 to 24 full-resolution images inline would exhaust the entire context before the model does any work. The bottleneck on memory-constrained hardware is rarely compute; it is context saturation.</p>

            <InfoBox type="tip" title="The context-saturation math">
                At ~1,300 tokens per 1 MP image, 6 to 24 full-resolution images can fill an entire 8k–32k context window before an agent starts work. (A rule of thumb derived from the published formulas above, not a single quoted source.)
            </InfoBox>
        </section>

        <section id="pass-file-paths-not-bytes">
            <SectionHeading>The fix: pass file paths, not image bytes</SectionHeading>
            <p>The durable pattern is to keep binary out of the context window and hand the model a reference instead. The <a href="https://modelcontextprotocol.io/docs/concepts/resources" target="_blank" rel="noopener noreferrer">Model Context Protocol resources specification</a> is built around exactly this: resources are identified by a URI (<code class={inlineCode}>file:///…</code>, <code class={inlineCode}>https://…</code>), so an agent receives a path or identifier rather than the encoded image. Anthropic's own guidance echoes the idea, noting that referencing uploaded images by <code class={inlineCode}>file_id</code> keeps request payloads small regardless of how many images accumulate in a conversation.</p>
            <p>This is where Mochify's local MCP server fits a token-cost argument cleanly. Run as <code class={inlineCode}>mochify serve</code>, it returns file paths and metadata to the agent, not image bytes, so a compression step never injects a multi-thousand-token blob into the model's context. You drive it in plain English, for example: <code class={inlineCode}>compress the PNGs in ./screenshots to WebP and give me the new paths</code>. The encoding itself runs on Mochify's API (<code class={inlineCode}>api.mochify.app</code>), where files are streamed into memory and wiped immediately with zero retention; the image data travels to the API to be encoded, so it is not processed on your own machine, but it also never lands in the agent's context window. The hosted MCP server follows the same principle from the other direction, returning a short-lived download URL rather than inline binary. If you're working directly in Claude Code, see our guide to how to <a href="https://mochify.app/guides/image-compression-claude-code-cli-mcp">compress images in Claude Code without bloating the context window</a>. For a full local-workflow setup on constrained hardware, see the <a href="/guides/on-device-ai-agents-image-optimization">On-Device AI Agents guide</a>.</p>
            <p>Documents behave the same way. The reference-not-blob pattern extends to <a href="/guides/extract-images-from-pdf-agent-workflows">PDF pages in an agent pipeline</a>, where extracting or converting a page returns a path and leaves the rendered bytes outside the model's context entirely.</p>
        </section>

        <!-- CTA -->
        <GuideCTA
            heading="Keep image bytes out of your context window"
            href="/"
            label="Try it free at mochify.app →"
        >
            Mochify's local MCP server returns file paths, not binary, so a compression step costs a handful of tokens instead of thousands. Just describe the job - for example <em>"compress the PNGs in ./screenshots to WebP and return the paths"</em>.
        </GuideCTA>

        <!-- Related guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <ul class="space-y-3">
                {#each related as guide}
                    <li>
                        <a href={guide.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">: {guide.desc}</span></span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </section>

    </div>
</article>
