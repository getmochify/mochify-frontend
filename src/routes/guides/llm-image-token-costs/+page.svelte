<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "LLM Image Token Costs: How Many Tokens Does an Image Use?",
        description: "No single number: about 1,300 tokens per megapixel on Claude, 1,229 on GPT-5.5+, 1,032 on Gemini. Generating one costs 196 to 7,024 output tokens. Dated.",
        category: "AI & Automation",
        readTime: "4 min read",
        date: "June 7, 2026",
        lastUpdated: "October 16, 2026"
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
        "image": "https://mochify.app/og/guides-llm-image-token-costs.png",
        "datePublished": "2026-06-07T12:00:00+00:00",
        "dateModified": "2026-10-16T12:00:00+00:00",
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

    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/llm-image-token-costs"
        description={metadata.description}
        datePublished="2026-06-07"
        dateModified="2026-10-16"
    />
</svelte:head>

<article
	class="relative mx-auto w-full max-w-3xl px-5 pt-6 text-lg leading-relaxed text-[#6C3F31] sm:px-6 md:px-0 md:pt-0"
>
	<div class="hero-wash" aria-hidden="true"></div>

    <header class="mb-12 md:mb-14">
		<p class="mt-0 mb-3 text-xs font-bold tracking-[0.18em] text-[#F06292] uppercase">
			{metadata.category}
		</p>
		<h1
			class="mb-0 text-3xl leading-[1.1] font-black tracking-tight text-[#4A2C2C] md:text-[2.75rem]"
		>
			<AccentTitle title={metadata.title} accent="LLM Image Token Costs" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · {metadata.lastUpdated ? 'Published ' : ''}{metadata.date}{metadata.lastUpdated ? ` · Updated ${metadata.lastUpdated}` : ''}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            There is no single answer to how many tokens an image uses in an LLM; it depends on the provider, the model, and the image's pixel dimensions, never its file size. As of October 2026: Anthropic's Claude counts 28×28 px visual patches, so a 1-megapixel (1000×1000 px) image costs 1,296 tokens, capped at 1,568 on standard models and 4,784 on Claude 4.7 and later. OpenAI's current models (GPT-5.4 through GPT-6) count 32×32 px patches with a 1.2× multiplier, so the same image costs 1,229 tokens; the older GPT-4o and GPT-4.1 use 85 base tokens plus 170 per 512 px tile (765 tokens). Google's Gemini charges 258 tokens per 768×768 px tile, so a 1-megapixel image is 1,032 tokens. Generating an image is billed separately as output tokens: 196 to 7,024 per 1024×1024 image on GPT Image 2.5 depending on quality, and 1,120 per 1K image on Gemini 3.1 Flash Image. The practical takeaway for anyone building agents is the same everywhere: inline image bytes burn through a context window fast, so the established fix is to pass file paths or URIs into the model, not the raw bytes.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">
                <strong class="text-[#4A2C2C]">Published June 2026 by the Mochify Engineering Team.</strong>
                The per-image figures below are drawn from each provider's current vision documentation; tokenization rules change with model releases, so dates are noted throughout.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section id="per-image-token-cost-by-provider" class="scroll-mt-24">
            <SectionHeading>Per-image token cost by provider</SectionHeading>
            <p>The numbers below come from each provider's current vision documentation. Tokenization rules change with model releases, so treat these as 2025–2026 figures and re-check the linked doc before you rely on a number.</p>

            <GuideTable class="my-6">
                <table>
                    <thead>
                        <tr>
                            <th>Provider</th>
                            <th>Formula</th>
                            <th>1 MP image (1000×1000 px)</th>
                            <th>Typical photo (1920×1080 px)</th>
                            <th>Caps</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Anthropic / Claude, standard tier (models before Claude 4.7)</td>
                            <td><code class={codeSmall}>ceil(width / 28) × ceil(height / 28)</code> visual tokens, after downscaling to a 1,568 px long edge</td>
                            <td>1,296 tokens</td>
                            <td>1,560 tokens (downscaled to 1456×819)</td>
                            <td>1,568 tokens per image; long edge ≤1,568 px</td>
                        </tr>
                        <tr>
                            <td>Anthropic / Claude, high-resolution tier (Claude 4.7 and later)</td>
                            <td>Same formula, downscaled only beyond a 2,576 px long edge</td>
                            <td>1,296 tokens</td>
                            <td>2,691 tokens (not resized)</td>
                            <td>4,784 tokens per image; long edge ≤2,576 px</td>
                        </tr>
                        <tr>
                            <td>OpenAI GPT-5.4, 5.5, 5.6 and GPT-6 (<code class={codeSmall}>detail: high</code>)</td>
                            <td><code class={codeSmall}>ceil(width / 32) × ceil(height / 32)</code> patches, fitted to the detail level's limit, × 1.2</td>
                            <td>1,229 tokens (1,024 patches × 1.2)</td>
                            <td>2,448 tokens (2,040 patches × 1.2)</td>
                            <td>2,500-patch budget at <code class={codeSmall}>high</code>; 30,000 patches rejects the request</td>
                        </tr>
                        <tr>
                            <td>OpenAI GPT-5.1 (<code class={codeSmall}>detail: high</code>)</td>
                            <td>70 base + 140 per 512 px tile (shortest side scaled to 768 px)</td>
                            <td>630 tokens (4 tiles)</td>
                            <td>910 tokens (6 tiles)</td>
                            <td><code class={codeSmall}>detail: low</code> is a flat 70 tokens</td>
                        </tr>
                        <tr>
                            <td>OpenAI GPT-4o / GPT-4.1 (<code class={codeSmall}>detail: high</code>)</td>
                            <td>85 base + 170 per 512 px tile (shortest side scaled to 768 px)</td>
                            <td>765 tokens (4 tiles)</td>
                            <td>1,105 tokens (6 tiles)</td>
                            <td><code class={codeSmall}>detail: low</code> is a flat 85 tokens</td>
                        </tr>
                        <tr>
                            <td>OpenAI GPT-4.1-mini (patch model)</td>
                            <td><code class={codeSmall}>ceil(width / 32) × ceil(height / 32)</code> patches, capped at 1,536, × 1.62</td>
                            <td>~1,659 tokens (1,024 patches × 1.62)</td>
                            <td>Scales to ≤1,536 patches, then × 1.62</td>
                            <td>1,536-patch cap before the multiplier</td>
                        </tr>
                        <tr>
                            <td>Google Gemini</td>
                            <td>Both sides ≤384 px → 258 tokens flat; otherwise 768×768 px tiles at 258 tokens each</td>
                            <td>1,032 tokens (4 tiles)</td>
                            <td>1,548 tokens (6 tiles)</td>
                            <td>No per-image cap stated; Google documents the tile cost, not the scaling rule</td>
                        </tr>
                    </tbody>
                </table>
            </GuideTable>
            <p class="text-sm text-[#875F42]">Sources: <a href="https://docs.claude.com/en/docs/build-with-claude/vision" target="_blank" rel="noopener noreferrer">Anthropic Claude vision docs</a>, <a href="https://platform.openai.com/docs/guides/vision" target="_blank" rel="noopener noreferrer">OpenAI vision docs</a>, and <a href="https://ai.google.dev/gemini-api/docs/tokens" target="_blank" rel="noopener noreferrer">Google Gemini token docs</a>, all re-read October 9, 2026 (Google's token page last updated September 23, 2026). The 1920×1080 figures assume no downscaling except where the provider documents it (Claude's standard tier); Google documents the per-tile cost but not its scaling rule, so the Gemini figures are tile counts at native size.</p>
        </section>

        <section id="image-generation-tokens" class="scroll-mt-24">
            <SectionHeading>How many tokens does generating an image use?</SectionHeading>
            <p>Generating an image is billed on a different meter from reading one. On OpenAI's GPT Image 2.5 models a generated image is charged as image output tokens at $30 per million (October 2026 rate), and the count depends on the quality setting far more than on the size: a 1024×1024 image is 196 tokens at low quality, 439 at medium, 1,756 at high, 3,122 at xhigh and 7,024 at max, which is $0.006 to $0.21 per image before any text or image input tokens. Streaming partial images adds 100 output tokens per partial. Google prices Gemini's image models per output token too: Gemini 3.1 Flash Image counts 1,120 tokens for a 1K image, 1,680 for 2K and 2,520 for 4K at $60 per million ($0.067, $0.101 and $0.151 per image), and the cheaper Nano Banana 2.1 counts 1,120 tokens per 1K image at $30 per million ($0.0336). Anthropic's API does not generate images, so there is no Claude figure.</p>

            <GuideTable class="my-6">
                <table>
                    <thead>
                        <tr>
                            <th>Model (October 2026)</th>
                            <th>Tokens per generated image</th>
                            <th>Price per image (standard rate)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>OpenAI GPT Image 2.5, 1024×1024, low / medium / high</td>
                            <td>196 / 439 / 1,756</td>
                            <td>$0.006 / $0.013 / $0.053</td>
                        </tr>
                        <tr>
                            <td>OpenAI GPT Image 2.5, 1024×1024, xhigh / max</td>
                            <td>3,122 / 7,024</td>
                            <td>$0.094 / $0.211</td>
                        </tr>
                        <tr>
                            <td>Google Gemini 3.1 Flash Image, 1K / 2K / 4K</td>
                            <td>1,120 / 1,680 / 2,520</td>
                            <td>$0.067 / $0.101 / $0.151</td>
                        </tr>
                        <tr>
                            <td>Google Nano Banana 2.1, 1K</td>
                            <td>1,120</td>
                            <td>$0.0336</td>
                        </tr>
                    </tbody>
                </table>
            </GuideTable>

            <p>Two things follow for agent builders. First, "how many tokens does an image use" has two answers, and the output one is the expensive one: reading a 1-megapixel photo costs about 1,000 to 1,300 input tokens on every current model, while generating a high-quality image can cost five times that in output tokens priced six to ten times higher. Second, the image you generate is a file the moment it lands on disk, and sending it back into the conversation as bytes pays the input price all over again; pass its path instead, which is the pattern the rest of this guide is about.</p>
            <p class="text-sm text-[#875F42]">Sources: OpenAI image generation guide and API pricing, Google Gemini API pricing, all read October 9, 2026. Prices are USD list rates and change with model releases; re-check before relying on a number.</p>
        </section>

        <section id="why-this-matters" class="scroll-mt-24">
            <SectionHeading>Why this matters for local and agent workflows</SectionHeading>
            <p>The cost is small for one image and dangerous at scale. Claude allows up to 100 images per API request on its 200k-context models, and OpenAI allows 500 image inputs per request, but the context window fills long before those hard limits bite.</p>
            <p>It is worse on local and open-weight models. Consumer hardware typically runs models at an 8k–32k token context window. At Claude's rate of 1,296 tokens per 1 MP image, just 6 to 24 full-resolution images inline would exhaust the entire context before the model does any work. The bottleneck on memory-constrained hardware is rarely compute; it is context saturation. The same ceilings decide what a chat window does to a photo you attach: we measured <a href="/guides/can-chatgpt-compress-images">what happens when you ask a chatbot to compress a photo</a>, and the resize came first.</p>

            <GlassInfoBox type="tip" title="The context-saturation math">
                At ~1,300 tokens per 1 MP image, 6 to 24 full-resolution images can fill an entire 8k–32k context window before an agent starts work. (A rule of thumb derived from the published formulas above, not a single quoted source.)
            </GlassInfoBox>
        </section>

        <section id="pass-file-paths-not-bytes" class="scroll-mt-24">
            <SectionHeading>The fix: pass file paths, not image bytes</SectionHeading>
            <p>The durable pattern is to keep binary out of the context window and hand the model a reference instead. The <a href="https://modelcontextprotocol.io/docs/concepts/resources" target="_blank" rel="noopener noreferrer">Model Context Protocol resources specification</a> is built around exactly this: resources are identified by a URI (<code class={inlineCode}>file:///…</code>, <code class={inlineCode}>https://…</code>), so an agent receives a path or identifier rather than the encoded image. Anthropic's own guidance echoes the idea, noting that referencing uploaded images by <code class={inlineCode}>file_id</code> keeps request payloads small regardless of how many images accumulate in a conversation.</p>
            <p>This is where Mochify's local MCP server fits a token-cost argument cleanly. Run as <code class={inlineCode}>mochify serve</code>, it returns file paths and metadata to the agent, not image bytes, so a compression step never injects a multi-thousand-token blob into the model's context. You drive it in plain English, for example: <code class={inlineCode}>compress the PNGs in ./screenshots to WebP and give me the new paths</code>. The encoding itself runs on Mochify's API (<code class={inlineCode}>api.mochify.app</code>), where files are streamed into memory and wiped immediately with zero retention; the image data travels to the API to be encoded, so it is not processed on your own machine, but it also never lands in the agent's context window. The hosted MCP server follows the same principle from the other direction, returning a short-lived download URL rather than inline binary. If you're working directly in Claude Code, see our guide to how to <a href="https://mochify.app/guides/image-compression-claude-code-cli-mcp">compress images in Claude Code without bloating the context window</a>. For a full local-workflow setup on constrained hardware, see the <a href="/guides/on-device-ai-agents-image-optimization">On-Device AI Agents guide</a>.</p>
            <p>Documents behave the same way. The reference-not-blob pattern extends to <a href="/guides/extract-images-from-pdf-agent-workflows">PDF pages in an agent pipeline</a>, where extracting or converting a page returns a path and leaves the rendered bytes outside the model's context entirely.</p>
        </section>

        <!-- CTA -->
        <GlassCTA
            heading="Keep image bytes out of your context window"
            href="/"
            label="Try it free at mochify.app →"
        >
            Mochify's local MCP server returns file paths, not binary, so a compression step costs a handful of tokens instead of thousands. Just describe the job - for example <em>"compress the PNGs in ./screenshots to WebP and return the paths"</em>.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
