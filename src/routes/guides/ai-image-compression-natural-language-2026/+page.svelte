<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "AI Image Compression with Natural Language - Mochify 2026",
        description: "Describe your image goal in plain English and Mochify's AI picks the right format, size, and settings automatically. Powered by Mistral Small 3.2. No tech knowledge needed.",
        category: "AI & Automation",
        readTime: "8 min read",
        date: "March 8, 2026"
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
        "headline": "AI-Powered Image Compression: How Mochify's Natural Language Feature Works (2026)",
        "description": "Describe your image goal in plain English and Mochify's AI picks the right format, size, and settings automatically. Powered by Mistral Small 3.2. No tech knowledge needed.",
        "url": "https://mochify.app/guides/ai-image-compression-natural-language-2026",
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
            "AI image compression",
            "natural language image optimization",
            "Mistral Small 3.2",
            "WebP AVIF JPEG XL format selection",
            "EXIF stripping automation"
        ],
        "step": [
            {
            "@type": "HowToStep",
            "name": "Go to mochify.app",
            "text": "Open the Mochify tool at mochify.app. No account required."
            },
            {
            "@type": "HowToStep",
            "name": "Upload your image",
            "text": "Upload your image by clicking or dragging it into the tool."
            },
            {
            "@type": "HowToStep",
            "name": "Describe your goal in plain English",
            "text": "Type a description of what you need in the natural language field - a single sentence is enough. For example: 'Instagram-ready WebP, strip location data'."
            },
            {
            "@type": "HowToStep",
            "name": "Hit squish",
            "text": "The AI parses your description and automatically sets format, resize, and EXIF options before processing."
            },
            {
            "@type": "HowToStep",
            "name": "Download your optimized image",
            "text": "Download the result. Your image is processed in memory and never stored."
            }
        ],
        "datePublished": "2026-03-08",
        "dateModified": "2026-03-08"
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
            AI-Powered Image Compression: How Mochify's Natural Language Feature Works (2026)
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Type "Instagram-ready WebP, strip location data" and Mochify handles the rest. <a href="https://docs.mistral.ai/models/mistral-small-3-2-25-06">Mistral Small 3.2</a> parses your intent and passes the right flags to our compression engine - no dropdowns, no format knowledge required.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                <strong>Published March 2026 by the Mochify Engineering Team.</strong> We've connected an LLM directly into our compression pipeline. Describe your goal in plain English - the AI does the settings layer for you.
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
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">What is Mochify's natural language compression feature?</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#how-it-works" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">02</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">How the AI picks your compression settings</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#formats" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">03</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Format selection: WebP, AVIF, JXL, or JPEG</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#resizing" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">04</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Smart resizing and cropping from plain English</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#exif" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">05</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">EXIF stripping on request</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#how-to-use" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">06</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">How to use it right now</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#cheat-sheet" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">07</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Cheat sheet: prompt examples and what they produce</span>
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
            <p>You type something like "Instagram-ready WebP, strip location data" into the Mochify tool. Mistral Small 3.2 parses that, chooses the right flags (format: webp, resize to 1080x1080, EXIF strip: on), and passes them to our squish engine. Your image comes back optimized exactly as described — without you touching a single dropdown.</p>
        </section>

        <section id="what-is" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">What is Mochify's natural language compression feature?</h2>
            <p class="mb-4">Instead of manually selecting formats and settings, you describe what you want and Mochify figures out the technical details for you. We've connected an LLM — specifically Mistral Small 3.2 — directly into the compression pipeline on the main tool at <a href="https://mochify.app" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app</a>. It reads your intent and translates it into the right squish flags before processing your image.</p>
            <p class="mb-4">This sits inside the existing tool interface. No separate mode to switch to, no new account needed. Type your description, upload your image, and the AI handles the settings layer.</p>
        </section>

        <section id="how-it-works" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">How the AI picks your compression settings</h2>
            <p class="mb-4">The core idea is simple: your plain-English description becomes a set of compression flags. Mistral Small 3.2 parses the prompt, identifies what you need — format, dimensions, metadata handling — and calls our squish engine with those exact parameters.</p>
            <p class="mb-4">Here's what that looks like in practice. "Best for the web" might produce <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">--format webp --quality 82</code>. "Tiny for mobile" could produce <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">--format avif --quality 65 --resize 800</code>. "Blog-post-ready, clean upload" might add <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">--strip-exif</code> on top of a balanced WebP output. The LLM doesn't guess randomly — it maps your language to a defined set of flags the squish engine understands.</p>

            <InfoBox type="tip" title="Pro tip">
                You don't need to be precise. "Make it small for email" works just as well as "compress to AVIF at quality 60." The model handles the ambiguity.
            </InfoBox>
        </section>

        <section id="formats" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Format selection: WebP, AVIF, JXL, or JPEG</h2>
            <p class="mb-4">The AI can choose from four output formats depending on how you describe your goal. AVIF delivers roughly 45% smaller files than JPEG at equivalent visual quality — making it the right pick when file size is the priority. WebP hits the sweet spot between compression and compatibility, supported by all major browsers since 2023 (<a href="https://caniuse.com/webp" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">caniuse.com</a>). JPEG XL (JXL) is the choice for lossless or near-lossless archival. Standard JPEG via our jpegli encoder remains the best option when universal compatibility is non-negotiable.</p>

            <div class="overflow-x-auto rounded-xl border border-pink-100 shadow-sm mb-8">
                <table class="w-full text-left bg-white whitespace-nowrap md:whitespace-normal">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">Prompt hint</th>
                            <th class="p-4 font-black">Likely format output</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4 font-bold">"Best for the web" / "web-ready"</td><td class="p-4">WebP</td></tr>
                        <tr><td class="p-4 font-bold">"Tiny," "mobile," "smallest possible"</td><td class="p-4">AVIF</td></tr>
                        <tr><td class="p-4 font-bold">"Lossless," "archive quality"</td><td class="p-4">JPEG XL</td></tr>
                        <tr><td class="p-4 font-bold">"Compatible everywhere," "email"</td><td class="p-4">JPEG (jpegli)</td></tr>
                        <tr><td class="p-4 font-bold">"Instagram," "social"</td><td class="p-4">WebP or AVIF</td></tr>
                    </tbody>
                </table>
            </div>

            <p class="mb-4">The AI cross-references your described use case against format strengths. You don't need to know what AVIF is — just describe what the image is for.</p>
        </section>

        <section id="resizing" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Smart resizing and cropping from plain English</h2>
            <p class="mb-4">Dimension hints in your description translate directly to resize and crop flags. "Instagram square" tells the model to target 1080×1080 with appropriate cropping. "Thumbnail banner" produces a landscape crop scaled to a web-friendly width. "Full-size but compressed" keeps the original dimensions and only adjusts quality and format.</p>
            <p class="mb-4">This removes the most common source of friction for content teams: looking up the "right" dimensions for every platform every time. The model maintains an understanding of common publishing contexts — social formats, email headers, blog post images — and maps those to real pixel dimensions before calling /squish.</p>
        </section>

        <section id="exif" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">EXIF stripping on request</h2>
            <p class="mb-4">Any prompt mentioning privacy, clean uploads, or sharing publicly will trigger EXIF metadata removal. Camera model, GPS coordinates, shooting time — all of it gets stripped before the file is returned. (For more on why this matters, see our <a href="/guides/exif-data-risks-image-compression-2026" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">EXIF risks guide</a>.)</p>
            <p class="mb-4">Importantly, EXIF stripping only activates when relevant to your prompt. If you're compressing personal archive images and don't mention privacy, the metadata is left intact. The AI respects your intent rather than applying blanket rules.</p>
        </section>

        <section id="how-to-use" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">How to use it right now</h2>
            <ol class="list-decimal pl-6 mb-6 space-y-3 marker:text-[#F06292] marker:font-bold">
                <li>Go to <a href="https://mochify.app" class="text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-2 transition-colors">mochify.app</a></li>
                <li>Upload your image (or drop it in)</li>
                <li>In the natural language field, describe your goal — a single sentence is enough</li>
                <li>Hit squish — the AI handles format, size, and metadata settings automatically</li>
                <li>Download your optimized image</li>
            </ol>
            <p class="mb-4">No account required. Zero retention — your image is processed in memory and never stored.</p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Cheat sheet: prompt examples and what they produce</h2>

            <div class="overflow-x-auto rounded-xl border border-pink-100 shadow-sm mb-8">
                <table class="w-full text-left bg-white whitespace-nowrap md:whitespace-normal">
                    <thead class="bg-pink-50 text-[#4A2C2C]">
                        <tr>
                            <th class="p-4 font-black">Your description</th>
                            <th class="p-4 font-black">Format</th>
                            <th class="p-4 font-black">Resize</th>
                            <th class="p-4 font-black">EXIF strip</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                        <tr><td class="p-4 font-bold">"Instagram square, web-ready"</td><td class="p-4">WebP</td><td class="p-4">1080×1080</td><td class="p-4">No</td></tr>
                        <tr><td class="p-4 font-bold">"Tiny for mobile, strip location"</td><td class="p-4">AVIF</td><td class="p-4">~800px wide</td><td class="p-4 text-[#F06292] font-bold">Yes</td></tr>
                        <tr><td class="p-4 font-bold">"Blog post hero, fast load"</td><td class="p-4">WebP</td><td class="p-4">~1200px wide</td><td class="p-4">No</td></tr>
                        <tr><td class="p-4 font-bold">"Email thumbnail, clean"</td><td class="p-4">JPEG (jpegli)</td><td class="p-4">~600px wide</td><td class="p-4 text-[#F06292] font-bold">Yes</td></tr>
                        <tr><td class="p-4 font-bold">"Archive quality, no compression"</td><td class="p-4">JPEG XL</td><td class="p-4">Original</td><td class="p-4">No</td></tr>
                        <tr><td class="p-4 font-bold">"Social banner"</td><td class="p-4">WebP</td><td class="p-4">~1200×630</td><td class="p-4">No</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section id="faq" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">FAQ</h2>

            <div class="space-y-6">
                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">What AI model does Mochify use for natural language compression?</h3>
                    <p>We use Mistral Small 3.2, called via the Mistral API. It parses your prompt and determines the appropriate compression flags before passing instructions to the squish engine.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">Do I need to write precise technical descriptions?</h3>
                    <p>No. Casual descriptions like "make it small for my blog" work well. The model is built to handle vague intent and translate it into specific settings.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">What formats can the AI choose from?</h3>
                    <p>WebP, AVIF, JPEG XL, and JPEG (encoded with jpegli for better efficiency). The choice depends on what you describe.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">Does the AI always strip EXIF data?</h3>
                    <p>Only when your prompt indicates a privacy or clean-upload intent. If you don't mention it, metadata is left untouched.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">Is my image stored after processing?</h3>
                    <p>No. Mochify processes images in memory only — zero retention. This applies whether you use the standard tool or the natural language feature.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">Can I use this for batch compression?</h3>
                    <p>The natural language feature on the homepage applies the same settings to your upload. For high-volume batch workflows, see our CLI and MCP options.</p>
                </div>

                <div class="bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-2">What if the AI picks the wrong format?</h3>
                    <p>You can specify the format explicitly in your description ("give me a WebP") and the model will follow that instruction directly.</p>
                </div>
            </div>
        </section>

        <section id="related" class="scroll-mt-24">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">Related guides</h2>
            <ul class="space-y-3">
                <li>
                    <a href="/guides/2026-guide-next-gen-formats" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                        <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">The 2026 Guide to Next-Gen Formats: WebP, AVIF, and JPEG XL <span class="font-normal opacity-70">— Which format is right for which job, with benchmarks</span></span>
                        <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                    </a>
                </li>
                <li>
                    <a href="/guides/exif-data-risks-image-compression-2026" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                        <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">The Risks of EXIF Data in Image Compression (2026) <span class="font-normal opacity-70">— Why stripping metadata matters</span></span>
                        <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                    </a>
                </li>
                <li>
                    <a href="/guides/privacy-image-optimization" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                        <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Privacy & Image Optimization: A Comprehensive Guide (2026) <span class="font-normal opacity-70">— Zero-retention explained</span></span>
                        <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                    </a>
                </li>
                <li>
                    <a href="/guides/self-hosting-image-optimization-docker" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                        <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">How to Self-Host an Image Optimization API with Docker <span class="font-normal opacity-70">— For teams who want full control</span></span>
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
                Try it yourself — just describe what you need
            </h3>

            <p class="text-[#6C3F31] text-lg max-w-lg mx-auto relative z-10 mb-8 leading-relaxed">
                No account. No dropdowns. Type your goal, upload your image, and let the AI handle the rest.
            </p>

            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
                <span>Start Optimizing Free</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

    </div>
</article>
