<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';

    const metadata = {
        title: "Working with PDFs in AI Agent Workflows: Extract, Split, and Convert Pages",
        description: "How to extract images from PDF, split multi-page files, and convert pages to WebP inside an AI agent pipeline. Mechanics, pitfalls, and a privacy-first workflow.",
        category: "AI & Automation",
        readTime: "12 min read",
        date: "June 16, 2026"
    };

    const inlineCode = "bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100";

    const faqs = [
        {
            q: "How do I extract images from a PDF in an automated pipeline?",
            a: `Decide first whether you want the embedded image object (use an extractor like <code class="${inlineCode}">pdfimages</code> or PyMuPDF's <code class="${inlineCode}">extract_image</code>) or a render of the whole page (use a renderer at 150–300 DPI). Agent pipelines usually want the page render, because they are producing previews and model inputs rather than harvesting original artwork. With Mochify, you describe it in plain English ("extract page 3 as WebP") and the PDF utility handles it via <code class="${inlineCode}">POST /v1/pdf</code>.`
        },
        {
            q: "What DPI should I use when converting PDF pages to images?",
            a: "Around 150 DPI for legible on-screen images, 300 DPI when output may be printed, and 600 DPI only for fine line art or archival work. The common ~72 DPI default is suitable for tiny thumbnails only. Set the resolution at render time, because upscaling a low-DPI image afterwards cannot recover detail."
        },
        {
            q: "Does splitting a PDF lose bookmarks or form fields?",
            a: "Often, yes. Tools such as pdfcpu state outright that annotations, outlines, structure trees, and forms are not carried into split output. For routing and summarisation this is fine; if you depend on interactive forms or accessibility tags, treat the split as lossy and verify what survived."
        },
        {
            q: "Why return file paths instead of the image bytes to my agent?",
            a: "Images are billed as tokens (a 512×512 image is roughly 210 tokens in OpenAI's worked example), so piping every page through the model context is expensive at batch scale, and the MCP resources spec is built around returning URIs and metadata rather than blobs. Returning paths keeps cost down and lets the bytes enter context only when a step genuinely needs them. Mochify's local MCP server returns paths and metadata by default."
        },
        {
            q: "Is Mochify's PDF utility available to AI agents, or only in the web app?",
            a: `It is available across the web app, the CLI, both MCP servers, and the REST API, all served by <code class="${inlineCode}">POST /v1/pdf</code>. (Video is the one capability that is web-app-only; the PDF utility is not.) For agent work, the local MCP server is the surface to lead with because it returns paths, not bytes.`
        },
        {
            q: "Is PDF processing on Mochify private? Does the file stay on my machine?",
            a: `The file does not stay on your machine. PDFs travel to <code class="${inlineCode}">api.mochify.app</code> over HTTPS exactly like images, are processed in RAM, and are wiped immediately with no source disk writes and no logs containing file data. That is zero-retention, which is a stronger and more honest claim than "never leaves your device." Local CLI and local MCP paths are zero-retention end-to-end; the hosted MCP holds only the output behind a five-minute download URL.`
        },
        {
            q: "Can I use the PDF utility on the free tier?",
            a: "Yes. MCP and API access are included on every tier, including Free, which allows 25 operations per month (or 3 per session with no signup) and a 20MB file-size limit. Seller and Pro raise the file-size limit to 75MB and batch size to 25 files."
        },
        {
            q: "WebP or AVIF for PDF page previews?",
            a: `Default to WebP: it is widely supported and typically 25–34% smaller than JPEG at similar quality. Use AVIF where your tooling and audience support it for even smaller files, and keep a JPEG fallback in a <code class="${inlineCode}">&lt;picture&gt;</code> element for older clients.`
        }
    ];

    const related = [
        { href: '/guides/on-device-ai-agents-image-optimization', title: 'On-Device AI Agents: Image and PDF Optimization', desc: 'The pillar this sits under: the hardware shift, local-vs-remote tooling, and the zero-retention model.' },
        { href: '/guides/how-the-mochify-mcp-server-works', title: 'How the Mochify MCP Server Works: Hosted vs Local', desc: 'The hosted vs local mechanics and token-cost detail behind paths-not-bytes.' },
        { href: '/guides/mochify-mcp-image-compression-agent-2026', title: 'How to Use Mochify via MCP (2026)', desc: 'Step-by-step setup for wiring Mochify into an MCP-compatible agent.' },
        { href: '/guides/ai-agent-workflow-automation-photographers', title: 'AI Agent Workflow Automation for Photographers', desc: 'A worked agent pipeline using the local CLI and Magic Flow.' },
        { href: '/guides/privacy-image-optimization', title: 'Privacy & Image Optimization: A Comprehensive Guide', desc: 'The full zero-retention model and why it matters for regulated work.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <link rel="canonical" href="https://mochify.app/guides/working-with-pdfs-in-ai-agent-workflows" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="Extract Images from PDF in AI Agent Workflows - Split & Convert" />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/working-with-pdfs-in-ai-agent-workflows" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Working with PDFs in AI Agent Workflows: Extract, Split, and Convert Pages",
        "description": "How to extract images from PDF, split multi-page files, and convert pages to WebP inside an AI agent pipeline. Mechanics, pitfalls, and a privacy-first workflow.",
        "url": "https://mochify.app/guides/working-with-pdfs-in-ai-agent-workflows",
        "datePublished": "2026-06-16",
        "dateModified": "2026-06-16",
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
            { "@type": "Thing", "name": "Extract images from PDF" },
            { "@type": "Thing", "name": "PDF splitting" },
            { "@type": "Thing", "name": "AI agent workflows" },
            { "@type": "Thing", "name": "Model Context Protocol" }
        ],
        "keywords": "extract images from pdf, split pdf, convert pdf to webp, pdf in agent workflows, mcp pdf tool, paths not bytes"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "Working with PDFs in AI Agent Workflows", "item": "https://mochify.app/guides/working-with-pdfs-in-ai-agent-workflows" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "How do I extract images from a PDF in an automated pipeline?", "acceptedAnswer": { "@type": "Answer", "text": "Decide first whether you want the embedded image object (use an extractor like pdfimages or PyMuPDF's extract_image) or a render of the whole page (use a renderer at 150-300 DPI). Agent pipelines usually want the page render, because they are producing previews and model inputs rather than harvesting original artwork. With Mochify, you describe it in plain English (\"extract page 3 as WebP\") and the PDF utility handles it via POST /v1/pdf." } },
            { "@type": "Question", "name": "What DPI should I use when converting PDF pages to images?", "acceptedAnswer": { "@type": "Answer", "text": "Around 150 DPI for legible on-screen images, 300 DPI when output may be printed, and 600 DPI only for fine line art or archival work. The common ~72 DPI default is suitable for tiny thumbnails only. Set the resolution at render time, because upscaling a low-DPI image afterwards cannot recover detail." } },
            { "@type": "Question", "name": "Does splitting a PDF lose bookmarks or form fields?", "acceptedAnswer": { "@type": "Answer", "text": "Often, yes. Tools such as pdfcpu state outright that annotations, outlines, structure trees, and forms are not carried into split output. For routing and summarisation this is fine; if you depend on interactive forms or accessibility tags, treat the split as lossy and verify what survived." } },
            { "@type": "Question", "name": "Why return file paths instead of the image bytes to my agent?", "acceptedAnswer": { "@type": "Answer", "text": "Images are billed as tokens (a 512x512 image is roughly 210 tokens in OpenAI's worked example), so piping every page through the model context is expensive at batch scale, and the MCP resources spec is built around returning URIs and metadata rather than blobs. Returning paths keeps cost down and lets the bytes enter context only when a step genuinely needs them. Mochify's local MCP server returns paths and metadata by default." } },
            { "@type": "Question", "name": "Is Mochify's PDF utility available to AI agents, or only in the web app?", "acceptedAnswer": { "@type": "Answer", "text": "It is available across the web app, the CLI, both MCP servers, and the REST API, all served by POST /v1/pdf. Video is the one capability that is web-app-only; the PDF utility is not. For agent work, the local MCP server is the surface to lead with because it returns paths, not bytes." } },
            { "@type": "Question", "name": "Is PDF processing on Mochify private? Does the file stay on my machine?", "acceptedAnswer": { "@type": "Answer", "text": "The file does not stay on your machine. PDFs travel to api.mochify.app over HTTPS exactly like images, are processed in RAM, and are wiped immediately with no source disk writes and no logs containing file data. That is zero-retention, which is a stronger and more honest claim than \"never leaves your device.\" Local CLI and local MCP paths are zero-retention end-to-end; the hosted MCP holds only the output behind a five-minute download URL." } },
            { "@type": "Question", "name": "Can I use the PDF utility on the free tier?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. MCP and API access are included on every tier, including Free, which allows 25 operations per month (or 3 per session with no signup) and a 20MB file-size limit. Seller and Pro raise the file-size limit to 75MB and batch size to 25 files." } },
            { "@type": "Question", "name": "WebP or AVIF for PDF page previews?", "acceptedAnswer": { "@type": "Answer", "text": "Default to WebP: it is widely supported and typically 25-34% smaller than JPEG at similar quality. Use AVIF where your tooling and audience support it for even smaller files, and keep a JPEG fallback in a picture element for older clients." } }
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
            Working with PDFs in AI Agent Workflows: Extract, Split, and Convert Pages
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            If you build agents or automation, sooner or later a PDF lands in the pipeline and the agent needs a page as an image, the document broken into single pages, or a thumbnail for a preview card. This guide covers the three operations that recur when you extract images from PDF files, split multi-page documents, and convert pages to web formats inside an automated workflow - plus the correctness traps, the agent-tool-call pattern that keeps token costs sane, and the privacy model that matters when those PDFs hold regulated data.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published June 16, 2026 by the Mochify Engineering Team.</strong>
                This guide is for developers and AI builders wiring PDF operations into pipelines: the mechanics of rendering versus extraction, splitting without breaking documents, converting pages to WebP and AVIF, the paths-not-bytes pattern, and a privacy-first workflow for regulated documents.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <section id="the-three-core-pdf-operations">
            <SectionHeading>The three core PDF operations</SectionHeading>
            <p>Most PDF work in an agent pipeline reduces to three operations: turning a page into an image, splitting a multi-page file into single pages, and converting those page images into a web-friendly format. Each is conceptually simple and each has a sharp edge that bites automated workflows specifically.</p>
            <p>The reason these three keep recurring is that a PDF is not an image and not a neat bag of text. It is a set of drawing instructions: text runs, vector paths, embedded bitmaps, fonts, and transparency, composited at render time. That single fact explains nearly every gotcha further down. "Get me page 3 as a PNG" is really "execute the page's drawing instructions at a chosen resolution and flatten the result to a raster," which is a different job from "pull the embedded photo out of page 3." Keep those two jobs distinct and most of the confusion disappears.</p>
            <p>We'll take the operations in the order they usually appear in a pipeline: extract, split, convert.</p>
        </section>

        <section id="how-to-extract-images-from-a-pdf">
            <SectionHeading>How to extract images from a PDF</SectionHeading>
            <p>When you <strong class="text-[#4A2C2C]">extract images from PDF</strong> pages there are two genuinely different operations hiding under one phrase, and picking the wrong one is the most common mistake we see. You either pull <em>embedded</em> image objects straight out of the file, or you <em>render</em> the whole page to a new raster image. They produce different results and fail in different ways.</p>
            <p><strong class="text-[#4A2C2C]">Embedded image extraction</strong> reads the PDF's internal object table and exports the original image streams, preserving the source format and resolution. This is the right call when a document contains a photo or a figure you want to reuse at its native quality, and tools like Poppler's <code class={inlineCode}>pdfimages</code> or PyMuPDF's <code class={inlineCode}>get_images</code>/<code class={inlineCode}>extract_image</code> are built for exactly this. The catch: it only sees objects that exist as discrete images. A text-only page, a vector chart, or a page that is itself one giant scanned bitmap will not give you the clean "logo.png" you were hoping for.</p>
            <p><strong class="text-[#4A2C2C]">Page rendering</strong> runs the page's full drawing model (text, vectors, images, fonts, transparency) and composites it into a bitmap at a resolution you choose. This is what you want for previews, thumbnails, and feeding a page to a vision model. The single most important parameter is DPI. Renderers commonly default to roughly 72 DPI, which is fine for a tiny thumbnail and visibly blurry for anything else. As a rule of thumb, set 150 DPI for legible on-screen page images, 300 DPI when the output may be printed, and only reach for 600 DPI for fine line art or archival work. Higher DPI is not free: file size and render time climb with it, and you cannot recover detail by upscaling a low-DPI render after the fact, so set the resolution at the initial rasterisation step, not in post.</p>
            <p>A second rule of thumb worth internalising: rendering quality is not only about DPI. Anti-aliasing, font hinting, and colour-space handling all affect whether small text and thin lines come out crisp or jagged, which is why a mature rendering engine matters more than a high number in the DPI field.</p>
            <p>So the decision is: do you need the <em>asset that was placed on the page</em> (extract embedded) or <em>what the page looks like</em> (render)? Agent pipelines almost always want the second, because they are producing previews and model inputs rather than harvesting original artwork.</p>
        </section>

        <section id="splitting-multi-page-pdfs">
            <SectionHeading>Splitting multi-page PDFs without breaking them</SectionHeading>
            <p>Splitting a multi-page PDF into single-page files is the simplest operation to describe and the easiest to get subtly wrong. Copying page ranges into new documents is trivial; preserving everything attached to those pages is not.</p>
            <p>The two failure modes to plan around:</p>
            <p>First, <strong class="text-[#4A2C2C]">off-by-one page ranges.</strong> Command-line tools and human-facing UIs almost always use 1-based page numbers, while most programming libraries index pages from 0. An automation script that mixes a 1-based prompt ("split off pages 1 to 5") with a 0-based API call is the classic source of a split that is silently shifted by one page. Decide on one convention at the boundary of your pipeline and normalise to it.</p>
            <p>Second, <strong class="text-[#4A2C2C]">structural loss.</strong> Splitting often drops document features that live above the page level. The pdfcpu project is refreshingly explicit about this: its <a href="https://pdfcpu.io/core/split" target="_blank" rel="noopener noreferrer">split documentation</a> states that annotations, outlines (bookmarks), structure trees, and forms "are not carried over into the output files," because copying them piecemeal can leave them broken or invalid. That matters more than it sounds. If your pipeline relies on a tagged structure tree for accessibility, on bookmarks for navigation, or on form fields staying interactive, a naive split will quietly degrade all three. For most agent use cases (slice a report into per-page PDFs to route, summarise, or attach) this is acceptable. For anything touching forms or accessibility tags, treat split output as lossy and verify.</p>
            <p>The practical guidance: split by page span for batch routing, split by bookmark when you genuinely need chapter-level sections and your tool supports the bookmark depth you need, and always test what survives before you trust it in production.</p>
        </section>

        <section id="converting-pages-to-web-formats">
            <SectionHeading>Converting pages to web formats: WebP, AVIF, and documents as web assets</SectionHeading>
            <p>Converting rendered page images into WebP or AVIF is what turns "a PDF" into "web assets." Once a page is a raster image, the same format economics that govern product photos apply: modern formats are smaller than JPEG at the same perceived quality, which is the whole point of generating them.</p>
            <p>WebP is the safe default. It is broadly supported and, per MDN's <a href="https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types" target="_blank" rel="noopener noreferrer">image format guide</a>, delivers meaningfully smaller files than JPEG at comparable quality; independent measurements commonly put lossy WebP around 25–34% smaller than JPEG. AVIF can compress smaller still and supports wider colour and HDR, at the cost of slower encoding and patchier tooling. The conclusion many teams reach in practice: default to WebP, offer AVIF where the tooling is solid, and keep a JPEG fallback for legacy clients via a <code class={inlineCode}>&lt;picture&gt;</code> element.</p>
            <p>The "documents as web assets" framing is the useful mental shift here. A first-page thumbnail for a document-listing UI, a WebP preview embedded in a knowledge base, a cropped figure pulled from a report and served responsively: these are all just images now, and they belong in the same optimisation pipeline you already run for photographs. Treating a PDF page as a web asset rather than a special document type is exactly how you keep one pipeline instead of two.</p>
        </section>

        <section id="why-pdf-operations-belong-in-agent-workflows">
            <SectionHeading>Why PDF operations belong in agent workflows</SectionHeading>
            <p>PDF extract/split/convert operations show up in agent pipelines because documents are rarely the final destination; they are an input to be triaged, summarised, routed, or indexed. The operations are the pre-processing that makes the rest of the pipeline possible.</p>
            <p>Realistic examples we see:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Document-processing agents</strong> that render each page to an image so a vision model can read scanned or image-heavy pages that have no extractable text layer.</li>
                <li><strong class="text-[#4A2C2C]">Preview and thumbnail generation</strong>, where an agent renders the first page to a small WebP for a listing card, then routes the document based on what it sees.</li>
                <li><strong class="text-[#4A2C2C]">Batch contract and report handling</strong>, where a large file is split into per-page or per-section PDFs so individual pages can be sent to different downstream steps (signature, redaction, summarisation).</li>
                <li><strong class="text-[#4A2C2C]">Ingestion for search and retrieval</strong>, where pages are sliced into chunks and stored alongside thumbnails or cropped figures next to their embeddings.</li>
            </ul>
            <p>This is increasingly true on local hardware too. As <a href="/guides/on-device-ai-agents-image-optimization">on-device AI agents</a> move onto desktop-class machines, the same discipline matters even more, because a local model's context window is tight and a folder of rendered pages will blow through it fast.</p>
            <p>In all of these, the agent is orchestrating tools, not doing the pixel work itself. Which leads to the pattern that actually matters for cost and reliability.</p>
        </section>

        <section id="the-paths-not-bytes-pattern">
            <SectionHeading>The paths-not-bytes pattern (and why it saves tokens)</SectionHeading>
            <p>The established pattern for a PDF tool in an agent workflow is to do the heavy work, write the results to disk or object storage, and return file paths and lightweight metadata into the model context - not the raw image or document bytes. There are two solid reasons, one architectural and one financial.</p>
            <p>Architecturally, this is exactly how the Model Context Protocol models data. The MCP <a href="https://modelcontextprotocol.io/specification/2025-06-18/server/resources" target="_blank" rel="noopener noreferrer">resources specification</a> exposes data via URIs with MIME types, leaving the client to decide <em>when</em> to actually read the bytes. A tool that hands back <code class={inlineCode}>file:///out/contract-p3.webp</code> plus its format, dimensions, and page index fits this model cleanly; a tool that dumps a base64 blob into every response does not.</p>
            <p>Financially, images are expensive in context because they are billed as tokens. OpenAI's <a href="https://openai.com/api/pricing/" target="_blank" rel="noopener noreferrer">pricing documentation</a> works through an example where a single 512×512 image costs on the order of 210 tokens, and Azure's vision pricing breaks a comparable input down as 170 + 85 image tokens on top of the text. Those numbers are small per image and brutal at batch scale: render 200 pages and pipe each one through the model context and you are paying token rent on every pixel, repeatedly, for data the model often does not need to "see" at all. Return a path instead, and the bytes enter the context only on the rare call where the model genuinely must look.</p>
            <p>The takeaway: design your PDF tools to return URIs and metadata by default. Let the host application or a downstream tool fetch the actual file when, and only when, it is needed.</p>
        </section>

        <!-- Workflow card -->
        <section id="mochify-workflow-extract-and-split" class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-9 not-prose">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Mochify Workflow: extract and split a PDF inside an agent pipeline</h2>
            <p class="mb-7">Here is how this looks with Mochify's PDF utility, which does the two operations above (page-level image extraction and precision splitting) and is built to be driven by an agent. Mochify treats documents like web assets: the same engine that gets your images web-ready handles PDF pages, and you talk to it in plain English through Magic Flow. A worked example: an agent ingesting a folder of multi-page contracts, producing a WebP preview of each cover page and splitting the rest into single-page PDFs for routing.</p>
            <ol class="space-y-6 list-none p-0 m-0">
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">1</span>
                    <div>
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Describe the task in natural language</strong>
                        <p class="text-base m-0">Magic Flow is the interface, so the agent does not assemble flags. It sends something like <em>"extract page 1 of each PDF as a WebP thumbnail, and split the remaining pages into single-page PDFs."</em> Magic Flow runs a two-step pipeline: a language model parses the prompt into concrete parameters, then Mochify's C++ engine executes the extraction and the split.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">2</span>
                    <div>
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">The request hits the PDF endpoint</strong>
                        <p class="text-base m-0">PDF work is served by a dedicated endpoint, <code class={inlineCode}>POST /v1/pdf</code> on <code class={inlineCode}>api.mochify.app</code>. The PDF utility is available wherever you reach Mochify as a developer: the web app, the CLI, both MCP servers, and the REST API.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">3</span>
                    <div>
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Run it through the surface that suits the agent</strong>
                        <p class="text-base m-0">For an autonomous pipeline, the local MCP server (<code class={inlineCode}>mochify serve</code>, the same Rust binary as the <code class={inlineCode}>mochify</code> CLI) is the one to reach for. It returns file paths and metadata, so the page images and split PDFs never enter the agent's context window, only their paths do. That is the paths-not-bytes pattern, enforced by the surface.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">4</span>
                    <div>
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Hand the outputs downstream</strong>
                        <p class="text-base m-0">The agent now has, say, <code class={inlineCode}>cover-p1.webp</code> plus per-page PDFs and their metadata. It routes, summarises, or attaches them, fetching actual bytes only if a step truly needs them.</p>
                    </div>
                </li>
            </ol>

            <div class="mt-7">
                <InfoBox type="tip" title="Privacy note">
                    PDFs are <strong>not</strong> processed on your machine. They travel to <code class={inlineCode}>api.mochify.app</code> over HTTPS exactly like images do, are processed in RAM, and are wiped immediately with no disk writes of the source and no logs containing file data. That is zero-retention, not "never leaves your laptop." The local CLI and local MCP server stay zero-retention end-to-end (no pickup store on the return), while the hosted MCP server holds only the <em>output</em> behind a short-lived download URL on <code class={inlineCode}>files.mochify.app</code> (a five-minute TTL) so the agent can fetch it; the original is still discarded immediately either way. For the full mechanics, see <a href="/guides/how-the-mochify-mcp-server-works">How the Mochify MCP Server Works</a> and <a href="/guides/why-we-relaxed-zero-retention-for-mcp">why we adjusted zero-retention for MCP</a>.
                </InfoBox>
            </div>
            <p class="text-base text-[#875F42] mt-5 mb-0">Because MCP and API access are included on every tier, including Free, you can wire this into an agent without a paid plan to start. Point your agent at <a href="/">Mochify</a> and you are running.</p>
        </section>

        <section id="privacy-and-compliance">
            <SectionHeading>Privacy and compliance for document pipelines</SectionHeading>
            <p>Where PDF processing happens is a compliance question, not just an engineering one, because the documents agents handle (contracts, reports, anything under NDA or regulation) frequently contain personal data. The governing principle is data minimisation.</p>
            <p>Under GDPR, <a href="https://gdpr-info.eu/art-5-gdpr/" target="_blank" rel="noopener noreferrer">Article 5(1)(c)</a> requires that personal data be "adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed." The UK ICO's <a href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/" target="_blank" rel="noopener noreferrer">guidance on data minimisation</a> puts it plainly: identify "the minimum amount of personal data you need to fulfil your purpose," hold that much "but no more," and review and delete what you no longer need. Holding more than necessary is likely to be unlawful.</p>
            <p>Applied to a PDF pipeline, that principle pushes you toward two things: send the minimum, and retain nothing you do not have to. Every time a document goes to a third-party cloud service, you are transferring personal data to a processor, which carries contractual and security obligations and, often, retention you did not ask for. Where Mochify is that processor, the data-processing terms are set out in our <a href="/dpa">Data Processing Agreement</a>. A service that processes in memory and keeps nothing after the operation is materially lower-risk than one that stores your documents for caching, analytics, or re-use. This is why the zero-retention model matters for the kind of work agents do: the original is gone the instant encoding finishes, so there is no document sitting in someone's bucket to be breached, subpoenaed, or quietly mined later.</p>
            <p>A clarification, because it is easy to overstate: zero-retention is not the same as on-device processing. For images and PDFs, the bytes do travel to the API for encoding; what makes it defensible is that they are not kept. Be precise about that distinction in your own compliance documentation. If you want the deeper treatment, our <a href="/guides/privacy-image-optimization">privacy and image optimization guide</a> and our <a href="/guides/european-alternative-tinypng-gdpr-compliant-image-compression">GDPR-focused TinyPNG alternative comparison</a> both go further.</p>
        </section>

        <section id="quality-and-correctness-gotchas">
            <SectionHeading>Quality and correctness gotchas</SectionHeading>
            <p>Most PDF pipeline bugs come from a short list of predictable mistakes. Here they are, so you can check for them before they ship.</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Default low DPI.</strong> Rendering at the ~72 DPI default produces blurry previews and unreadable print output. Set 150–300 DPI deliberately, and remember upscaling afterwards cannot recover lost detail.</li>
                <li><strong class="text-[#4A2C2C]">Confusing extract with render.</strong> Embedded image extraction will miss text-only pages and vector charts; page rendering is what you want for previews and vision-model inputs. Pick the operation that matches the goal.</li>
                <li><strong class="text-[#4A2C2C]">Off-by-one splits.</strong> 1-based CLIs versus 0-based libraries cause silently shifted page ranges. Normalise the convention at your pipeline boundary.</li>
                <li><strong class="text-[#4A2C2C]">Lost structure on split.</strong> Annotations, bookmarks, structure trees, and forms can be dropped when splitting. If accessibility tags or interactive forms matter, verify they survived.</li>
                <li><strong class="text-[#4A2C2C]">Scanned PDFs are images, not text.</strong> A document that is really a stack of scanned pages has no text layer to extract. You render pages to images and OCR them; do not expect text extraction to work on a photocopy.</li>
                <li><strong class="text-[#4A2C2C]">Colour, transparency, and thin lines.</strong> High DPI alone does not guarantee quality. Anti-aliasing and colour-space handling decide whether small text and fine lines render cleanly.</li>
            </ul>
        </section>

        <section id="pdf-operations-cheat-sheet">
            <SectionHeading>PDF operations cheat sheet</SectionHeading>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[720px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Operation</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">What it does</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Sensible default</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Watch out for</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Extract embedded image</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Pulls an original image object out of the file at native quality</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Use when you want the placed photo/figure as-is</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Misses text-only pages, vector charts, full-page scans</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Render page to image</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Rasterises the whole page (text, vectors, images)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">150 DPI on-screen, 300 DPI for print</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~72 DPI default is blurry; no recovery by upscaling</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Split by page span</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Breaks a multi-page PDF into single pages</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1 page per file for routing</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Off-by-one (1-based vs 0-based); structure loss</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Split by bookmark</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Cuts into logical sections (chapters)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">When you need section-level files</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Tool may only support shallow bookmark depth</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Convert page to WebP/AVIF</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Compresses a rendered page for web delivery</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">WebP default; AVIF where tooling is solid</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Keep a JPEG fallback via <code class={inlineCode}>&lt;picture&gt;</code></td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] font-bold">Return to an agent</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Hand results back as paths + metadata</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Paths-not-bytes; fetch on demand</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Inline base64 bloats context and token cost</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
            <p>Mochify's PDF utility covers the extract and split operations here (PDF pages out as PNG, JPEG, or WebP; multi-page files split into single-page PDFs), driven by Magic Flow prompts like <em>"extract page 3 as WebP"</em> or <em>"split this into pages."</em> Try it at <a href="/">mochify.app</a>.</p>
        </section>

        <!-- FAQ -->
        <section id="faq">
            <SectionHeading>Frequently asked questions</SectionHeading>
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
            <h3 class="text-2xl font-black text-[#4A2C2C] relative z-10 mb-3">Wiring PDFs into an agent?</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base">Point it at Mochify's PDF utility, describe the job in plain English, and get back file paths and metadata - the page images and split PDFs never touch your model context.</p>
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
