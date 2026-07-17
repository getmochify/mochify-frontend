<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';

    const metadata = {
        title: "Image Compression Inside Claude Code: The Mochify CLI + MCP Guide",
        description: "Can Claude Code use MCP? Yes. Here's how to compress images inside Claude Code with the Mochify CLI as a build step and a local MCP server.",
        category: "AI & Automation",
        readTime: "15 min read",
        date: "July 17, 2026"
    };

    const inlineCode = "bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100";

    const toc = [
        { n: '01', href: '#can-claude-code-use-mcp', label: 'Can Claude Code use MCP?' },
        { n: '02', href: '#how-to-create-and-register-a-claude-mcp-server', label: 'How to create and register a Claude MCP server' },
        { n: '03', href: '#why-image-bytes-are-expensive', label: 'Why image bytes are expensive' },
        { n: '04', href: '#three-real-workflows', label: 'Three real workflows' },
        { n: '05', href: '#zero-retention-and-client-assets', label: 'Zero-retention and client assets' },
        { n: '06', href: '#the-performance-payoff', label: 'The performance payoff' },
        { n: '07', href: '#mochify-workflow', label: 'Mochify workflow: compress images in Claude Code' },
        { n: '08', href: '#cheat-sheet', label: 'Cheat sheet' },
        { n: '09', href: '#faq', label: 'FAQ' },
    ];

    const faqs = [
        {
            q: "Can Claude Code use MCP servers?",
            a: "Yes. Claude Code is a full MCP client. It registers local stdio servers and remote HTTP servers, discovers their tools, and calls them during a session. You add one with claude mcp add, and for a local image tool you use --transport stdio pointed at mochify serve."
        },
        {
            q: "How do I create a Claude MCP server for image compression?",
            a: "For most people there is nothing to build: install the mochify binary and run claude mcp add --transport stdio mochify -- mochify serve. That registers Mochify's local MCP server. If you want a custom server, Anthropic's mcp-server-dev plugin scaffolds a Node or Python skeleton you wire in the same way."
        },
        {
            q: "How do I compress images in Claude Code without bloating the context window?",
            a: "Use the local MCP server or the direct CLI. Both return file paths and metadata rather than image bytes, so nothing large enters the agent's context. Claude Code caps MCP tool output at 25,000 tokens by default, which is another reason returning a path beats inlining a base64 image."
        },
        {
            q: "Does Mochify run the compression on my machine?",
            a: "No. The mochify binary is a client over the API. Images travel to api.mochify.app over HTTPS, are encoded in RAM, and are wiped immediately, then the compressed file is written back to your local disk. The encoding engine is native C++ on Mochify's servers, not a local encoder."
        },
        {
            q: "Is the local workflow really zero-retention?",
            a: "On the CLI and mochify serve paths, yes, end-to-end. The original is wiped immediately after encoding with no disk writes or file-data logs, and there is no server-side pickup store, so compressed bytes return straight to your disk. The hosted MCP server differs slightly: it holds the compressed output behind a short-lived URL for up to five minutes so the link can resolve."
        },
        {
            q: "Can I compress video through the CLI or MCP?",
            a: "No. Video is a web-app-only capability that runs client-side in your browser, so the bytes never leave your device. The CLI, MCP servers, and REST API handle images and PDFs only. Keep video out of your Claude Code and CI pipelines."
        },
        {
            q: "Which format should I output for the web?",
            a: "AVIF for the best compression on photos and detailed graphics, with a WebP or JPEG fallback for older clients. AVIF support is near 94% globally per caniuse, while JPEG XL is still flag-gated in major browsers. If you need a universal JPEG, Mochify's jpegli encoding gets you more quality per byte."
        }
    ];

    const related = [
        { href: '/guides/how-the-mochify-mcp-server-works', title: 'How the Mochify MCP Server Works: Hosted vs Local', desc: 'The full architecture story, token costs, and worked examples.' },
        { href: '/guides/mochify-mcp-image-compression-agent-2026', title: 'How to Use Mochify via MCP (2026)', desc: 'Step-by-step setup for the hosted and local MCP servers.' },
        { href: '/guides/self-hosting-image-optimization-docker', title: 'How to Self-Host an Image Optimization API with Docker', desc: 'For teams that need encoding behind their own firewall.' },
        { href: '/guides/jpeg-in-2026-jpegli', title: 'Jpegli Guide 2026: Quality-Per-Byte', desc: 'When standard JPEG with jpegli beats jumping to AVIF.' },
        { href: '/guides/exif-data-risks-image-compression-2026', title: 'The Risks of EXIF Data in Image Compression', desc: 'Why stripping metadata belongs in your build step.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>Image Compression in Claude Code: CLI + MCP Setup Guide</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="Image Compression Inside Claude Code: The Mochify CLI + MCP Guide" />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/image-compression-claude-code-cli-mcp" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Image Compression Inside Claude Code: The Mochify CLI + MCP Guide" />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Image Compression Inside Claude Code: The Mochify CLI + MCP Guide",
        "description": "Can Claude Code use MCP? Yes. Here's how to compress images inside Claude Code with the Mochify CLI as a build step and a local MCP server.",
        "url": "https://mochify.app/guides/image-compression-claude-code-cli-mcp",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/image-compression-claude-code-cli-mcp"
        },
        "datePublished": "2026-07-17",
        "dateModified": "2026-07-17",
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
            { "@type": "Thing", "name": "Claude Code" },
            { "@type": "Thing", "name": "Model Context Protocol" },
            { "@type": "Thing", "name": "image compression" },
            { "@type": "Thing", "name": "AVIF" }
        ],
        "keywords": "can claude code use mcp, how to create claude mcp server, compress images in claude code, mochify cli, local mcp server, image compression",
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
            { "@type": "ListItem", "position": 3, "name": "Image Compression Inside Claude Code: The Mochify CLI + MCP Guide", "item": "https://mochify.app/guides/image-compression-claude-code-cli-mcp" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Image Compression Inside Claude Code: The Mochify CLI + MCP Guide",
        "url": "https://mochify.app/guides/image-compression-claude-code-cli-mcp",
        "description": "Can Claude Code use MCP? Yes. Here's how to compress images inside Claude Code with the Mochify CLI as a build step and a local MCP server.",
        "isPartOf": { "@type": "WebSite", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-07-17",
        "dateModified": "2026-07-17"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "Can Claude Code use MCP servers?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Claude Code is a full MCP client. It registers local stdio servers and remote HTTP servers, discovers their tools, and calls them during a session. You add one with claude mcp add, and for a local image tool you use --transport stdio pointed at mochify serve." } },
            { "@type": "Question", "name": "How do I create a Claude MCP server for image compression?", "acceptedAnswer": { "@type": "Answer", "text": "For most people there is nothing to build: install the mochify binary and run claude mcp add --transport stdio mochify -- mochify serve. That registers Mochify's local MCP server. If you want a custom server, Anthropic's mcp-server-dev plugin scaffolds a Node or Python skeleton you wire in the same way." } },
            { "@type": "Question", "name": "How do I compress images in Claude Code without bloating the context window?", "acceptedAnswer": { "@type": "Answer", "text": "Use the local MCP server or the direct CLI. Both return file paths and metadata rather than image bytes, so nothing large enters the agent's context. Claude Code caps MCP tool output at 25,000 tokens by default, which is another reason returning a path beats inlining a base64 image." } },
            { "@type": "Question", "name": "Does Mochify run the compression on my machine?", "acceptedAnswer": { "@type": "Answer", "text": "No. The mochify binary is a client over the API. Images travel to api.mochify.app over HTTPS, are encoded in RAM, and are wiped immediately, then the compressed file is written back to your local disk. The encoding engine is native C++ on Mochify's servers, not a local encoder." } },
            { "@type": "Question", "name": "Is the local workflow really zero-retention?", "acceptedAnswer": { "@type": "Answer", "text": "On the CLI and mochify serve paths, yes, end-to-end. The original is wiped immediately after encoding with no disk writes or file-data logs, and there is no server-side pickup store, so compressed bytes return straight to your disk. The hosted MCP server differs slightly: it holds the compressed output behind a short-lived URL for up to five minutes so the link can resolve." } },
            { "@type": "Question", "name": "Can I compress video through the CLI or MCP?", "acceptedAnswer": { "@type": "Answer", "text": "No. Video is a web-app-only capability that runs client-side in your browser, so the bytes never leave your device. The CLI, MCP servers, and REST API handle images and PDFs only. Keep video out of your Claude Code and CI pipelines." } },
            { "@type": "Question", "name": "Which format should I output for the web?", "acceptedAnswer": { "@type": "Answer", "text": "AVIF for the best compression on photos and detailed graphics, with a WebP or JPEG fallback for older clients. AVIF support is near 94% globally per caniuse, while JPEG XL is still flag-gated in major browsers. If you need a universal JPEG, Mochify's jpegli encoding gets you more quality per byte." } }
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
            Image Compression Inside Claude Code: The Mochify CLI + MCP Guide
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Yes, Claude Code can use MCP, and that is the cleanest way to compress images without leaving your editor. Claude Code is a full Model Context Protocol client: it connects to local and remote MCP servers, discovers their tools, and calls them mid-session (<a href="https://code.claude.com/docs/en/mcp" target="_blank" rel="noopener noreferrer">Claude Code MCP docs</a>). That means you can wire image compression straight into a coding session, run it as a build step, or trigger it from CI, all without copy-pasting files into a browser. This guide shows you two concrete ways to do that with Mochify: the <code class={inlineCode}>mochify</code> CLI as a build/pre-commit step, and <code class={inlineCode}>mochify serve</code> as a local MCP server Claude Code can call directly. We will keep this Claude-Code-specific. If you want the full hosted-vs-local architecture story, our <a href="https://mochify.app/guides/how-the-mochify-mcp-server-works">MCP server explainer</a> covers that in depth. Here, the focus is the developer workflow: how to compress images in Claude Code, why returning file paths beats inlining image bytes, and what "zero-retention" actually buys you when you are handling client assets.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published July 17, 2026 by the Mochify Engineering Team.</strong>
                This guide stays Claude-Code-specific: the CLI as a build step and mochify serve as a local MCP the agent calls directly. For the full hosted-vs-local architecture, see our MCP server explainer.
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

        <section id="can-claude-code-use-mcp" class="scroll-mt-24">
            <SectionHeading>Can Claude Code use MCP?</SectionHeading>
            <p>Claude Code can use MCP, and it acts as a first-class MCP client: it connects to external servers, lists their tools with <code class={inlineCode}>tools/list</code>, and invokes them with <code class={inlineCode}>tools/call</code> per the protocol spec (<a href="https://modelcontextprotocol.io/specification/2025-06-18/server/tools" target="_blank" rel="noopener noreferrer">Model Context Protocol: Tools</a>). Anthropic added remote MCP support in June 2025, so Claude Code talks to both local processes and remote services.</p>
            <p>In practice that gives you three transports worth knowing. Local <code class={inlineCode}>stdio</code> servers run as a child process on your machine. Remote <code class={inlineCode}>http</code> servers are the recommended transport for hosted connectors. The older <code class={inlineCode}>sse</code> transport still works but is marked deprecated in the docs, so prefer HTTP for anything remote (<a href="https://code.claude.com/docs/en/mcp" target="_blank" rel="noopener noreferrer">Claude Code MCP docs</a>). For image compression that runs against files on your disk, the local <code class={inlineCode}>stdio</code> path is the one you want, and it is exactly what <code class={inlineCode}>mochify serve</code> provides.</p>
            <p>The payoff is that "compress images in Claude Code" stops being a manual chore. Instead of describing an image to the agent or pasting it into a chat, you let Claude Code call a tool that does the encoding and hands back a file path. The agent keeps reasoning about your code; the bytes never clog its context window.</p>
        </section>

        <section id="how-to-create-and-register-a-claude-mcp-server" class="scroll-mt-24">
            <SectionHeading>How to create and register a Claude MCP server</SectionHeading>
            <p>You register an MCP server in Claude Code with <code class={inlineCode}>claude mcp add</code>, and for a local tool you use the <code class={inlineCode}>stdio</code> transport (<a href="https://code.claude.com/docs/en/mcp" target="_blank" rel="noopener noreferrer">Claude Code MCP docs</a>). The general shape puts options first, then the server name, then <code class={inlineCode}>--</code> and the command to run:</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 my-4 overflow-x-auto font-mono text-sm leading-relaxed"><code>{`# Syntax: options first, then name, then -- then the command
claude mcp add [options] <name> -- <command> [args...]

# Register Mochify's local MCP server
claude mcp add --transport stdio mochify -- mochify serve`}</code></pre>
            <p>That single command is the answer to "how to create a Claude MCP server" for the common case: you do not have to author a server from scratch when a tool already ships one. The <code class={inlineCode}>mochify</code> binary runs as a local MCP server when you launch it with <code class={inlineCode}>mochify serve</code>, and the line above tells Claude Code to start that process and speak MCP to it over stdio.</p>
            <p>Install the binary first. It is a single Rust binary distributed three ways:</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 my-4 overflow-x-auto font-mono text-sm leading-relaxed"><code>{`# macOS (Homebrew tap)
brew tap getmochify/mochify
brew install mochify

# Linux (raw binary)
curl -fsSL https://mochify.app/install.sh | sh

# From source
cargo install mochify

# Authenticate once: opens a browser OAuth flow
mochify auth login`}</code></pre>
            <p><code class={inlineCode}>mochify auth login</code> is the standard auth path. It saves credentials to <code class={inlineCode}>~/.config/mochify/credentials.toml</code>, and both the CLI and the local MCP server pick them up automatically, so there is no API key to paste into a config file or refresh later.</p>
            <p>Once registered, check the server inside Claude Code:</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 my-4 overflow-x-auto font-mono text-sm leading-relaxed"><code>{`claude mcp list        # show configured servers
claude mcp get mochify # details for one server
/mcp                   # inside Claude Code: status + tool count`}</code></pre>
            <p>If you would rather author your own server, Anthropic ships an <code class={inlineCode}>mcp-server-dev</code> plugin that scaffolds a Node or Python skeleton you wire back in with the same <code class={inlineCode}>claude mcp add</code> flow. For compressing images, though, registering <code class={inlineCode}>mochify serve</code> is the whole job.</p>
            <p>If you want to set this up right now, the binary and quick-start are at <a href="https://mochify.app/docs">mochify.app/docs</a>.</p>
        </section>

        <section id="why-image-bytes-are-expensive" class="scroll-mt-24">
            <SectionHeading>Why image bytes are expensive</SectionHeading>
            <p>Returning raw image bytes into an agent's context is slow and costly; returning a file path or URL is cheap, and the protocol is built for it. The MCP tools spec defines <code class={inlineCode}>resource_link</code> and <code class={inlineCode}>resource</code> content types precisely so servers can hand back a handle instead of inlining a base64 blob (<a href="https://modelcontextprotocol.io/specification/2025-06-18/server/tools" target="_blank" rel="noopener noreferrer">Model Context Protocol: Tools</a>). Claude Code reinforces this with hard limits: it warns when any MCP tool output exceeds 10,000 tokens and enforces a default cap of 25,000 tokens, which you can raise with <code class={inlineCode}>MAX_MCP_OUTPUT_TOKENS</code> (<a href="https://code.claude.com/docs/en/mcp" target="_blank" rel="noopener noreferrer">Claude Code MCP docs</a>).</p>
            <p>The cost side is real. Images are tokenized alongside text and billed from the same pool; Anthropic's token-counting endpoint counts images and PDFs just like prompt text (<a href="https://platform.claude.com/docs/en/build-with-claude/token-counting" target="_blank" rel="noopener noreferrer">Anthropic token counting</a>). With 2026 flagship pricing in the region of $5 per million input tokens and $25 per million output tokens on a 1M-token context window, a batch job that inlines hundreds of images can quietly burn tens of thousands of tokens per run before the model has done any useful reasoning.</p>
            <p>This is the core reason the local MCP path matters for developers. Mochify's local MCP server (<code class={inlineCode}>mochify serve</code>) returns file paths and metadata, not image bytes, so the image data never enters the agent's context at all. The agent sees "compressed <code class={inlineCode}>/assets/hero.avif</code>, 2.4 MB to 410 KB" as a short string and keeps going. The direct CLI behaves the same way: bytes flow from your disk to the encoder and back to disk, with only a one-line summary surfacing to the session.</p>
        </section>

        <section id="three-real-workflows" class="scroll-mt-24">
            <SectionHeading>Three real workflows</SectionHeading>
            <p>The patterns developers already use for image optimization, pre-commit hooks, CI actions, and build steps, map cleanly onto Claude Code. Here are three that earn their place.</p>
            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">1. CLI as a pre-commit / build step</h3>
            <p>Run the <code class={inlineCode}>mochify</code> CLI as a build step so no oversized asset gets committed. This mirrors the well-established pattern of wrapping an optimizer (oxipng, ImageOptim CLI) in a pre-commit hook, but with Magic Flow you describe the intent instead of memorizing flags:</p>
            <pre class="bg-[#2D1B1B] text-pink-100 rounded-2xl p-5 my-4 overflow-x-auto font-mono text-sm leading-relaxed"><code>{`# Compress staged images before they land in a commit
mochify -p "compress for web, convert PNGs to AVIF, strip EXIF" ./src/assets/*.png`}</code></pre>
            <p>Because the CLI is a client over the API and returns paths to disk, it slots into a Husky hook or an npm script the same way any other formatter would. Strip EXIF here too: it removes location and camera metadata before the file ever reaches your repo. (More on why that matters in our <a href="https://mochify.app/guides/exif-data-risks-image-compression-2026">EXIF data risks guide</a>.)</p>
            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3"><code class={inlineCode}>mochify serve</code> as a local MCP tool in a session</h3>
            <p>Let the agent find and fix images interactively. Once <code class={inlineCode}>mochify serve</code> is registered, you can ask Claude Code to do multi-step asset work it could not do with a plain CLI: "Find all images contributing to poor LCP on the homepage, re-encode the hero to AVIF, add a WebP fallback in the <code class={inlineCode}>&lt;picture&gt;</code> element, and update the <code class={inlineCode}>srcset</code>." The agent decides which images matter, calls the Mochify tool to compress them, and edits the markup, all in one loop. This is the workflow a plain build step cannot match, because it couples compression with code changes and reasoning.</p>
            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Non-interactive mode in CI</h3>
            <p>Pipe Claude Code's headless mode into a CI job for repo-wide passes. Claude Code supports a non-interactive <code class={inlineCode}>claude -p</code> mode you can drive from a GitHub Action, combining a git diff of changed assets with a request to compress them and summarize the result. The Mochify MCP tool does the encoding; the action commits the optimized files back to the branch. This is the agent-driven version of the many CI actions that compress images on pull requests, with the difference that the agent can also adjust the code that references those assets.</p>
        </section>

        <section id="zero-retention-and-client-assets" class="scroll-mt-24">
            <SectionHeading>Zero-retention and client assets</SectionHeading>
            <p>"Zero-retention" means a service does not persist your prompts or files beyond transient processing, and for agencies under NDAs or GDPR that is a contractual concern, not a nicety. Recent AI image services define the term concretely as prompts and outputs that are not logged, not used for training, and deleted immediately after delivery. Data-processing agreements increasingly require exactly this: a named retention period, a deletion procedure, and no secondary use such as model training.</p>
            <p>For a coding agent the local-versus-remote split is what decides your exposure. A local tool that runs on your machine keeps bytes off third-party servers except where it explicitly calls an API. A remote service receives whatever it needs to do the job, and is then governed by that provider's retention and training policy. This is worth checking carefully for your own setup, too: Anthropic's consumer plans moved in 2025 to an opt-in model where chats and coding sessions can be retained and used for training for up to five years if you opt in, while API and enterprise products keep the stricter no-training stance. If you are handling client assets in Claude Code, confirm which plan and settings you are on.</p>
            <p>Mochify's position here is deliberately narrow and honest. On the CLI and <code class={inlineCode}>mochify serve</code> paths, the original is streamed into RAM at <code class={inlineCode}>api.mochify.app</code>, wiped immediately, and never written to our disks or logged; the compressed output returns straight to your local disk with no server-side pickup store. That is zero-retention end-to-end for the developer surfaces. We do not claim your images never leave your laptop, because they travel to the API for encoding. If you need an even tighter boundary, our <a href="https://mochify.app/guides/self-hosting-image-optimization-docker">self-hosting guide</a> walks through running an optimization API behind your own firewall.</p>
        </section>

        <section id="the-performance-payoff" class="scroll-mt-24">
            <SectionHeading>The performance payoff</SectionHeading>
            <p>Optimizing images is the single biggest lever on Largest Contentful Paint, and modern formats compress dramatically better than JPEG. Google's web.dev guidance is consistent that LCP is usually dominated by a hero image, so compressing, correctly sizing, and modernizing that image is the highest-impact change you can make (<a href="https://web.dev/articles/optimize-vitals-lighthouse" target="_blank" rel="noopener noreferrer">web.dev: optimize LCP</a>).</p>
            <p>The format gains are large and measurable. WebP typically runs 25-35% smaller than JPEG at similar quality, and AVIF often lands around 50% smaller than JPEG and 20% smaller than WebP. Crucially, AVIF is now production-ready: caniuse reports support across Chrome (85+), Safari (16.4+), Firefox (93+), Edge (121+), and most mobile browsers, putting global coverage near 94% (<a href="https://caniuse.com/avif" target="_blank" rel="noopener noreferrer">caniuse: AVIF</a>). JPEG XL is the exception, still disabled by default in Chrome and Firefox as of early 2026, so ship it only with fallbacks and feature detection.</p>
            <p>In concrete terms, a 2.4 MB JPEG hero re-encoded to AVIF at web quality typically lands around 410 KB, an 83% reduction, with no visible quality loss on a standard display. Do that across a batch and you are shipping a fraction of the bytes. When you would rather keep the familiar JPEG container, Mochify uses Google's jpegli encoder to squeeze more quality per byte out of standard JPEG; our <a href="https://mochify.app/guides/jpeg-in-2026-jpegli">jpegli guide</a> covers when that is the right call.</p>
            <InfoBox type="tip" title="Batch tip">
                <p>Running larger batches across a whole repo? Paid tiers raise the per-batch limit to 25 files and lift the monthly allowance; see the current limits at <a href="https://mochify.app/pricing">mochify.app/pricing</a>.</p>
            </InfoBox>
        </section>

        <!-- Workflow card -->
        <section id="mochify-workflow" class="scroll-mt-24 bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-9 not-prose">
            <h2 class="text-[1.75rem] font-black text-[#4A2C2C] mt-0 mb-4">Mochify workflow: compress images in Claude Code</h2>
            <p class="text-base mb-7">Tell Mochify what you want in plain English and Magic Flow resolves the format, quality, and resize settings for you. This is the natural-language layer that sits in front of every Mochify surface, including the CLI (<code class={inlineCode}>-p</code> / <code class={inlineCode}>--prompt</code>) and the local MCP server. A two-step pipeline handles it: a language model parses your prompt, then the native C++ engine on Mochify's API servers does the encoding. Here is the end-to-end flow for compressing images inside a Claude Code session:</p>
            <ol class="space-y-4 list-none p-0 m-0">
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">1</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Install and authenticate</strong>
                        <p class="text-base m-0"><code class={inlineCode}>brew tap getmochify/mochify && brew install mochify</code>, then <code class={inlineCode}>mochify auth login</code> once.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">2</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Register the local MCP server</strong>
                        <p class="text-base m-0"><code class={inlineCode}>claude mcp add --transport stdio mochify -- mochify serve</code>. Confirm with <code class={inlineCode}>/mcp</code> inside Claude Code.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">3</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Describe the task in plain English</strong>
                        <p class="text-base m-0">In your session, ask: "Find every image over 500 KB in <code class={inlineCode}>/public</code>, convert them to AVIF at web quality, and keep the originals' filenames." Magic Flow maps that to the right parameters.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">4</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Let the agent call the tool</strong>
                        <p class="text-base m-0">Claude Code invokes the Mochify MCP tool, which streams each image to <code class={inlineCode}>api.mochify.app</code> for encoding and writes the compressed result back to disk.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">5</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Review the summary</strong>
                        <p class="text-base m-0">The tool returns file paths and before/after sizes, not image bytes, so the agent can reason about the result and update your markup without bloating its context.</p>
                    </div>
                </li>
            </ol>
            <p class="text-base text-[#875F42] mt-7 mb-0">For privacy, here is the precise model so you do not overclaim to your own clients. Images travel to <code class={inlineCode}>api.mochify.app</code> over HTTPS, are streamed into the encoder in RAM, and are wiped immediately after encoding, with no disk writes of the source and no logs containing file data. The compressed bytes come straight back to your local binary and are written to your disk. There is no server-side pickup store on the local CLI or <code class={inlineCode}>mochify serve</code> path, so these workflows are zero-retention end-to-end. Images do not "never leave your machine," they travel to the API for the encoding and come back; what they do not do is linger on our servers.</p>
            <p class="text-base mt-4 mb-0">A note on scope: the CLI, the local MCP server, and the REST API handle images (<code class={inlineCode}>/v1/squish</code>) and PDFs (<code class={inlineCode}>/v1/pdf</code>). Video is a separate, web-app-only capability that runs client-side in the browser, so do not wire video into a Claude Code or CI workflow expecting it to work from the CLI or MCP. Keep "where you reach Mochify" (the surfaces) separate from "what it does to your files" (the formats), and you will not trip over that boundary.</p>
            <p class="text-base mt-4 mb-0">Want to try the natural-language layer first? Start at <a href="https://mochify.app/docs">mochify.app/docs</a> and run a single <code class={inlineCode}>mochify -p "convert to AVIF, max 1600px wide" ./hero.jpg</code> before you wire up the agent.</p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat sheet</SectionHeading>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Task</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Command or prompt</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Install (macOS)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={inlineCode}>brew tap getmochify/mochify && brew install mochify</code></td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Authenticate</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={inlineCode}>mochify auth login</code></td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Register local MCP in Claude Code</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={inlineCode}>claude mcp add --transport stdio mochify -- mochify serve</code></td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Check the server</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={inlineCode}>/mcp</code> (inside Claude Code) or <code class={inlineCode}>claude mcp list</code></td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">One-off CLI compress</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={inlineCode}>mochify -p "convert to AVIF, max 1600px wide" ./hero.jpg</code></td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Pre-commit batch</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><code class={inlineCode}>mochify -p "compress for web, strip EXIF" ./assets/*.png</code></td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">In-session agent prompt</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">"Find images over 500 KB in /public, convert to AVIF, update srcset"</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[720px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">What you want</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Best surface</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Image bytes in agent context?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Build step / CI / scripts</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Direct CLI (<code class={inlineCode}>mochify</code>)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No (paths only)</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Interactive work in Claude Code</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Local MCP (<code class={inlineCode}>mochify serve</code>)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No (paths only)</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">No-install, chat-only</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Hosted MCP (<code class={inlineCode}>mcp.mochify.app</code>)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Output returned as a short-lived URL</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

        <!-- FAQ -->
        <GuideFAQs items={faqs} />

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Compress images without leaving Claude Code</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base">Install the <code class={inlineCode}>mochify</code> binary, register <code class={inlineCode}>mochify serve</code> as your local MCP server, and describe what you want in plain English, for example <em>"convert to AVIF, max 1600px wide"</em>.</p>
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
