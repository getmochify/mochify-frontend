<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        category: "Image Optimization",
        readTime: "20 min read",
        date: "February 09, 2026"
    };
</script>

<ReadProgress />

<svelte:head>
    <title>JPEG Compression in 2026: Why Jpegli Changes the Quality-Per-Byte Game</title>
    <meta name="description" content="Deliver better JPEG quality at smaller file sizes with Google's jpegli encoder. Get up to 35% compression improvement for eBay, Etsy, and platform-locked workflows without losing compatibility.">
    <meta property="og:title" content="JPEG Compression in 2026: Why Jpegli Changes the Quality-Per-Byte Game" />
    <meta property="og:description" content="Deliver better JPEG quality at smaller file sizes with Google's jpegli encoder. Get up to 35% compression improvement for eBay, Etsy, and platform-locked workflows without losing compatibility." />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "JPEG Compression in 2026: Why Jpegli Changes the Quality-Per-Byte Game",
        "description": "A 2026 guide to using Google's jpegli encoder for e-commerce and marketplace workflows, comparing it to MozJPEG and libjpeg-turbo, and explaining how Mochify delivers privacy-first jpegli compression.",
        "url": "https://mochify.xyz/guides/jpeg-in-2026-jpegli",
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
            "jpegli JPEG compression",
            "JPEG optimization in 2026",
            "MozJPEG vs jpegli vs libjpeg-turbo",
            "marketplace product photo workflows",
            "zero-retention image optimisation"
        ],
        "datePublished": "2026-02-09",
        "dateModified": "2026-02-09"
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
            JPEG Compression in 2026: Why Jpegli Changes the Quality-Per-Byte Game
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            <strong>The problem:</strong> I have to deliver JPEG because the platform only accepts JPEG (eBay, Etsy, legacy CMS, print upload portals), but I still need smaller files without ugly artifacts. The old tools give me two bad choices—crank quality to 90 and bloat the file, or drop to 70 and watch detail collapse into blocky mush.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl"><p class="text-lg text-[#6C3F31] leading-relaxed">            Modern JPEG encoders changed that trade-off. Google's jpegli library (released in 2024) delivers reported compression improvements of up to 35% at high quality settings while maintaining full compatibility with every JPEG viewer on the planet. This isn't a new format requiring browser support or user education—it's better math inside the same old container.
</p></div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">
        
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>

            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    <li>
                        <a href="#comparison" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">01</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">JPEG Encoder Comparison Cheat Sheet</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#basics" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">02</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">JPEG Basics That Matter for Performance</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#what-is-jpegli" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">03</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">What Jpegli Is (Better Encoding, Not a New Format)</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#adoption" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">04</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Why Your Stack Probably Still Uses MozJPEG</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#workflows" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">05</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Real-World Workflows for Platform-Locked Scenarios</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#testing" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">06</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">A Repeatable Test Methodology</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#faq" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">07</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">FAQ: Common Questions About JPEG Optimization</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </section>

        <section id="comparison">
            <SectionHeading>JPEG Encoder Comparison: 2026 Cheat Sheet</SectionHeading>

            <!-- Mobile: Card Layout -->
            <div class="my-8 md:hidden space-y-4">
                <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-4">libjpeg-turbo</h4>
                    <div class="space-y-3 text-[#6C3F31]">
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Speed</span>
                            <span class="text-base">Very fast (baseline)</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Quality-per-Byte</span>
                            <span class="text-base">Standard</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Compatibility</span>
                            <span class="text-base">Universal</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Best For</span>
                            <span class="text-base">High-volume pipelines prioritizing speed over size</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Current Adoption</span>
                            <span class="text-base">Default in most Linux distros</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-4">MozJPEG</h4>
                    <div class="space-y-3 text-[#6C3F31]">
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Speed</span>
                            <span class="text-base">Fast</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Quality-per-Byte</span>
                            <span class="text-base">Better than libjpeg-turbo (especially at medium quality)</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Compatibility</span>
                            <span class="text-base">Universal</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Best For</span>
                            <span class="text-base">WordPress, CDN edge, general web delivery</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Current Adoption</span>
                            <span class="text-base">Widely adopted in web optimization tools</span>
                        </div>
                    </div>
                </div>

                <div class="bg-pink-50/30 rounded-2xl border border-pink-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h4 class="font-bold text-[#D81B60] text-lg mb-4">jpegli</h4>
                    <div class="space-y-3 text-[#6C3F31]">
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Speed</span>
                            <span class="text-base">Fast (comparable to MozJPEG)</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#D81B60] uppercase tracking-wider block mb-1">Quality-per-Byte</span>
                            <span class="text-base font-bold text-[#D81B60]">Best reported (up to 35% smaller at high quality vs libjpeg-turbo)</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Compatibility</span>
                            <span class="text-base">Universal (fully interoperable)</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Best For</span>
                            <span class="text-base">High-quality exports, photography, platform-locked scenarios</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Current Adoption</span>
                            <span class="text-base">Emerging (2024 release, not yet in mainstream tools)</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Desktop: Table Layout -->
            <div class="my-8 overflow-hidden rounded-3xl border border-pink-50 shadow-sm bg-white hidden md:block">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[#FFF5F7] border-b border-pink-100">
                                <th class="py-5 px-6 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Encoder</th>
                                <th class="py-5 px-6 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Speed</th>
                                <th class="py-5 px-6 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Quality-per-Byte</th>
                                <th class="py-5 px-6 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Compatibility</th>
                                <th class="py-5 px-6 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Best For</th>
                                <th class="py-5 px-6 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Current Adoption</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-pink-50">
                            <tr class="hover:bg-pink-50/30 transition-colors">
                                <td class="py-5 px-6 font-bold text-[#4A2C2C]">libjpeg-turbo</td>
                                <td class="py-5 px-6 text-[#6C3F31]">Very fast (baseline)</td>
                                <td class="py-5 px-6 text-[#6C3F31]">Standard</td>
                                <td class="py-5 px-6 text-[#6C3F31]">Universal</td>
                                <td class="py-5 px-6 text-[#6C3F31]">High-volume pipelines prioritizing speed over size</td>
                                <td class="py-5 px-6 text-[#6C3F31]">Default in most Linux distros</td>
                            </tr>
                            <tr class="hover:bg-pink-50/30 transition-colors">
                                <td class="py-5 px-6 font-bold text-[#4A2C2C]">MozJPEG</td>
                                <td class="py-5 px-6 text-[#6C3F31]">Fast</td>
                                <td class="py-5 px-6 text-[#6C3F31]">Better than libjpeg-turbo (especially at medium quality)</td>
                                <td class="py-5 px-6 text-[#6C3F31]">Universal</td>
                                <td class="py-5 px-6 text-[#6C3F31]">WordPress, CDN edge, general web delivery</td>
                                <td class="py-5 px-6 text-[#6C3F31]">Widely adopted in web optimization tools</td>
                            </tr>
                            <tr class="hover:bg-pink-50/30 transition-colors bg-pink-50/20">
                                <td class="py-5 px-6 font-bold text-[#D81B60]">jpegli</td>
                                <td class="py-5 px-6 text-[#6C3F31]">Fast (comparable to MozJPEG)</td>
                                <td class="py-5 px-6 text-[#D81B60] font-bold">Best reported (up to 35% smaller at high quality vs libjpeg-turbo)</td>
                                <td class="py-5 px-6 text-[#6C3F31]">Universal (fully interoperable)</td>
                                <td class="py-5 px-6 text-[#6C3F31]">High-quality exports, photography, platform-locked scenarios</td>
                                <td class="py-5 px-6 text-[#6C3F31]">Emerging (2024 release, not yet in mainstream tools)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <section id="basics">
            <SectionHeading>JPEG Basics That Matter for Performance</SectionHeading>

            <div class="space-y-8">
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Progressive vs Baseline</h3>
                    
                    <p class="mb-4"><strong>Baseline JPEG</strong> loads top-to-bottom in one pass. The user sees nothing until the first scan lines arrive, then the image reveals itself linearly. For small images or fast connections, this works fine.</p>

                    <p class="mb-4"><strong>Progressive JPEG</strong> encodes the image in multiple scans—first a rough, blurry preview of the entire frame, then successive passes that refine detail. This improves perceived load speed (users see <em>something</em> immediately) and typically results in 2-10% smaller files for images over 10KB. The trade-off is slightly higher CPU cost during decode, which matters on older mobile devices but is negligible on modern hardware.</p>

                    <InfoBox type="tip">
                        <strong>When to use progressive:</strong> Large hero images, above-the-fold content, slow mobile connections. <strong>When to skip it:</strong> Thumbnails under 10KB, environments where decode speed is critical (embedded devices), scenarios where every CPU cycle counts.
                    </InfoBox>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Chroma Subsampling</h3>
                    
                    <p class="mb-4">JPEG separates luminance (brightness) from chrominance (color). Most encoders subsample chroma to save bits—the human eye is less sensitive to color detail than brightness detail.</p>

                    <ul class="list-disc list-outside ml-6 space-y-2 mb-6 text-[#6C3F31]">
                        <li><strong>4:4:4</strong> – No subsampling. Full color resolution. Larger files, best for graphics with sharp color transitions or text.</li>
                        <li><strong>4:2:2</strong> – Chroma sampled at half horizontal resolution. Moderate savings, good for high-quality photography.</li>
                        <li><strong>4:2:0</strong> – Chroma sampled at half resolution in both dimensions. Standard for web JPEGs. Saves the most space, acceptable for most photographic content.</li>
                    </ul>

                    <p class="mb-4">If you're compressing product photos for eBay or marketing assets for email, 4:2:0 is fine. If you're exporting screenshots with UI text, force 4:4:4 or switch to PNG.</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Quality Settings (and Why They're Misleading)</h3>
                    
                    <p class="mb-4">Every encoder defines "quality" differently. MozJPEG's 85 is not the same as libjpeg-turbo's 85. Jpegli's 90 produces smaller files than libjpeg-turbo's 90 at similar visual fidelity (in tests conducted by Google using crowdsourced raters and ELO scoring).</p>

                    <p class="mb-4 font-bold text-[#D81B60]">Don't trust the number. Trust your eyes and a file-size comparison at fixed visual quality.</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Metadata and ICC Profiles</h3>
                    
                    <p class="mb-4">JPEG files can carry EXIF metadata (camera settings, GPS, timestamps) and ICC color profiles (how to interpret the RGB values). Stripping metadata reduces file size by a few KB—sometimes 10-20KB for a RAW-exported JPEG with embedded previews. ICC profiles are usually a few KB but essential for print workflows. For web delivery, sRGB is assumed, so stripping non-sRGB profiles is safe.</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">When JPEG Is Still the Right Choice</h3>
                    
                    <p class="mb-4">JPEG remains the best option when:</p>

                    <ul class="list-disc list-outside ml-6 space-y-2 mb-6 text-[#6C3F31]">
                        <li>The platform explicitly rejects modern formats (eBay, Etsy, many print labs, government portals).</li>
                        <li>You need universal decode support (email clients, ancient browsers, embedded systems).</li>
                        <li>You're archiving photographic content and want a format that will open in 2046.</li>
                        <li>Encode speed matters more than the last 10% of compression efficiency.</li>
                    </ul>

                    <p class="mb-4">JPEG is not the right choice for graphics with sharp edges (logos, diagrams, UI screenshots)—use PNG. For web delivery with modern browser support, AVIF and WebP deliver better compression. But when you're forced into JPEG, use the best encoder available.</p>
                </div>
            </div>
        </section>

        <section id="what-is-jpegli">
            <SectionHeading>What Jpegli Is: Better JPEG Encoding, Not a New Format</SectionHeading>

            <p class="mb-6">Jpegli is an advanced JPEG encoder (and decoder) released by Google in April 2024. It produces standard JPEG files that open in every image viewer, browser, and photo app—no special support required.</p>

            <div class="space-y-8">
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">How It Remains Interoperable</h3>
                    
                    <p class="mb-4">Jpegli complies with the original JPEG standard (ISO/IEC 10918-1). The output is a <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">.jpg</code> file using the traditional 8-bit formalism. Any device or app that can display a JPEG from 2005 can display a JPEG from jpegli in 2026. There is no "jpegli format"—there's just JPEG, encoded more intelligently.</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">What "Better JPEG Encoding" Actually Means</h3>
                    
                    <p class="mb-4">Jpegli applies techniques originally developed for JPEG XL (a next-generation image format) to the constraints of classic JPEG. Specifically:</p>

                    <ul class="list-disc list-outside ml-6 space-y-2 mb-6 text-[#6C3F31]">
                        <li><strong>Adaptive quantization heuristics</strong> – Jpegli spatially modulates the quantization dead zone based on psychovisual modeling (how the human eye perceives detail and noise). This means the encoder allocates more bits to visually important areas and fewer bits to areas where artifacts are less noticeable.</li>
                        <li><strong>Improved quantization matrix selection</strong> – The quantization matrices (which control how aggressively the DCT coefficients are rounded) were optimized for a mix of psychovisual quality metrics, not just mathematical distortion.</li>
                        <li><strong>Precise intermediate calculations</strong> – Both encoding and decoding use more accurate math, reducing cumulative rounding errors that degrade quality.</li>
                        <li><strong>XYB colorspace option</strong> – Jpegli can encode JPEG using the XYB colorspace (a perceptually uniform space developed for JPEG XL) via an embedded ICC profile, improving coding efficiency. This is an advanced feature not yet widely used in practice.</li>
                    </ul>

                    <p class="mb-4">The result, as reported by Google in crowdsourced rater studies, is that jpegli at 2.8 bits-per-pixel (BPP) matched the visual quality of libjpeg-turbo at 3.7 BPP—a 32% reduction in bitrate, or equivalently, a 35% compression improvement at similar quality.</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Why This Is Different from "New Formats" Like AVIF or JPEG XL</h3>
                    
                    <p class="mb-4">AVIF and JPEG XL are modern image formats with better compression than JPEG but require explicit browser/app support. As of 2026, AVIF has ~94% browser support, and JPEG XL support varies (Apple announced support in 2025, but adoption is still rolling out).</p>

                    <p class="mb-4 font-bold text-[#D81B60]">Jpegli doesn't require any browser updates. A jpegli-encoded JPEG is just a JPEG. The improvement is invisible to the decoder—it simply receives a smaller file that looks better.</p>
                </div>
            </div>
        </section>

        <section>
            <SectionHeading>Claims and Nuance: What the Tests Actually Show</SectionHeading>

            <p class="mb-4">Google's announcement cited a 35% compression improvement at high quality settings. This number comes from a specific methodology: crowdsourced raters comparing images from the Cloudinary Image Dataset '22, encoded at several bitrates using jpegli, libjpeg-turbo, and MozJPEG, with results aggregated using ELO scoring.</p>

            <div class="my-6 bg-[#FFF5F7] rounded-2xl p-6 border border-pink-100">
                <h3 class="text-lg font-black text-[#875F42] mb-3">Important caveats:</h3>
                <ul class="list-disc list-outside ml-6 space-y-2 text-[#6C3F31]">
                    <li> The 35% figure applies to high-quality settings (e.g., quality 90+). At medium quality (70-80), the gap narrows.</li>
                    <li>The test used photographic content. Graphics, screenshots, and synthetic images may behave differently.</li>
                    <li>The XYB colorspace mode was <em>disabled</em> in the Google study, as it is how most users would initially deploy jpegli.</li>
                    <li>Independent tests (e.g., Gianni Rosato's analysis) show jpegli outperforms MozJPEG on some images but not all—results vary by content type.</li>
                </ul>
            </div>

            <p class="mb-4 font-bold text-[#D81B60]">Bottom line: Jpegli improves quality-per-byte in tests and reported real-world use, but it is not a universal 35% win on every image. Test it on your specific content at your target quality level.</p>
        </section>

        <section id="adoption">
            <SectionHeading>Adoption Reality: Why Your Stack Probably Still Uses MozJPEG or libjpeg-turbo</SectionHeading>

            <div class="space-y-8">
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">libjpeg-turbo: The Default Everywhere</h3>
                    
                    <p class="mb-4">libjpeg-turbo is the default JPEG library in most Linux distributions and underpins countless image processing pipelines. It prioritizes speed—claiming 2-6x faster encoding/decoding than the original libjpeg. For high-throughput CDN edge nodes or batch pipelines processing millions of images, that speed matters more than the last 10% of compression efficiency.</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">MozJPEG: The Web Optimization Standard</h3>
                    
                    <p class="mb-4">MozJPEG (developed by Mozilla) improved on libjpeg-turbo's compression ratio, especially at medium quality settings, while maintaining API/ABI compatibility. It became the go-to encoder for web optimization workflows—ImageMagick, libvips, and many online compression tools default to MozJPEG when targeting JPEG output.</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Jpegli: Newer and Not Yet Everywhere</h3>
                    
                    <p class="mb-4">Jpegli was released in April 2024. As of early 2026:</p>

                    <ul class="list-disc list-outside ml-6 space-y-2 mb-6 text-[#6C3F31]">
                        <li><strong>Not in Lightroom</strong> – Adobe has not integrated jpegli into Lightroom Classic or Lightroom CC. Users have requested it on Adobe community forums.</li>
                        <li><strong>Not in mainstream tooling by default</strong> – ImageMagick and libvips support jpegli as an optional backend (if compiled with libjxl, which includes the <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">cjpegli</code> binary), but it is not the default.</li>
                        <li><strong>Emerging in specialized tools</strong> – Privacy-focused and performance-oriented image optimizers (like Mochify) have adopted jpegli early, offering it as an explicit output option.</li>
                    </ul>

                    <div class="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-2xl border border-pink-100">
                        <h4 class="text-lg font-black text-[#875F42] mb-3">Why the slow rollout?</h4>
                        <p class="text-[#6C3F31]">Established tools with massive installed bases move cautiously. MozJPEG is proven, stable, and "good enough" for most workflows. Jpegli requires recompilation with libjxl dependencies, which adds complexity. As jpegli matures and more benchmark data accumulates, expect gradual adoption—but don't expect Adobe or WordPress plugins to switch overnight.</p>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <SectionHeading>Stop Uploading Bloated Files and Hoping the Platform Fixes Them</SectionHeading>

            <p class="mb-4">A disturbingly common workflow: shoot a 6MB JPEG from a DSLR, drag it into the eBay listing form, and hope eBay's backend recompresses it gracefully. It won't. eBay will hammer it with a generic lossy pass that obliterates fine detail, or reject it entirely for exceeding size limits.</p>

            <p class="mb-4">The same applies to WordPress users who install five plugins (image optimization, lazy load, CDN integration, WebP conversion, and a caching layer) and wonder why their admin panel takes 8 seconds to load. Plugin bloat is real—each plugin adds database queries, background processes, and potential conflicts. Optimize your images <em>before</em> upload. Use an external tool, get the file size and format right, then import clean assets. Your server, your database, and your sanity will thank you.</p>
        </section>

        <section id="workflows">
            <SectionHeading>Practical Workflows: Real Scenarios Where JPEG (and Jpegli) Matter</SectionHeading>

            <div class="space-y-10">
                <div class="bg-white p-8 rounded-[2.5rem] border border-pink-100 shadow-sm">
                    <div class="mb-4">
                        <h3 class="text-xl font-bold text-[#4A2C2C] mb-2">Workflow 1: "I Need JPEG for eBay/Etsy/Legacy CMS"</h3>
                    </div>

                    <p class="mb-4 text-[#8B5E51]"><strong>Problem:</strong> The platform only accepts JPEG. You have 200 product photos at 8MB each from a Fuji X-T5 shooting HIF/HEIF. eBay's limit is 12MB total per listing, and each photo should be under 1MB for fast mobile load.</p>

                    <p class="mb-3 font-bold text-[#4A2C2C]">Solution:</p>
                    
                    <ol class="list-decimal list-outside ml-6 space-y-3 mb-6 text-[#6C3F31]">
                        <li><strong>Convert format first</strong> (if needed) – If your camera outputs HIF/HEIF/RAW, convert to JPEG. Tools like Mochify handle HIF-to-JPEG conversion with in-memory processing.</li>
                        <li><strong>Resize to platform specs</strong> – eBay recommends 1600×1600px. Etsy wants 2000-2400px width. Amazon specifies 2000×2000px minimum for zoom. Don't guess—check the current platform guidelines.</li>
                        <li><strong>Compress with jpegli</strong> – Use a quality setting that hits your target file size (typically 200-500KB per image for product photos). Jpegli at quality 85-90 will deliver better visual results than libjpeg-turbo or MozJPEG at the same file size (based on reported test results).</li>
                        <li><strong>Verify one image first</strong> – Encode one sample, upload it to the platform, check how it looks on desktop and mobile. If the platform recompresses on upload, you'll see it immediately.</li>
                    </ol>

                    <InfoBox type="tip">
                        Use an external optimizer that supports jpegli output (like Mochify) to avoid plugin overhead and maintain clean local exports.
                    </InfoBox>
                </div>

                <div class="bg-white p-8 rounded-[2.5rem] border border-pink-100 shadow-sm">
                    <div class="mb-4">
                        <h3 class="text-xl font-bold text-[#4A2C2C] mb-2">Workflow 2: "I Can Serve WebP/AVIF but Need JPEG Fallback"</h3>
                    </div>

                    <p class="mb-4 text-[#8B5E51]"><strong>Problem:</strong> Your CDN or CMS serves AVIF to Chrome, WebP to Safari, and JPEG to legacy browsers/email clients. You need a high-quality JPEG fallback that doesn't bloat the origin server.</p>

                    <p class="mb-3 font-bold text-[#4A2C2C]">Solution:</p>
                    
                    <ol class="list-decimal list-outside ml-6 space-y-3 mb-6 text-[#6C3F31]">
                        <li><strong>Store one source-quality master</strong> (PNG or lossless WebP/JPEG XL) at maximum resolution.</li>
                        <li><strong>Generate three variants on first request or at build time:</strong>
                            <ul class="list-disc list-outside ml-6 mt-2 space-y-1">
                                <li>AVIF at quality 60-70 (smallest file, best for modern browsers).</li>
                                <li>WebP at quality 75-80 (broader compatibility than AVIF in 2026).</li>
                                <li>JPEG (jpegli) at quality 85-90 (universal fallback, smaller than MozJPEG equivalent).</li>
                            </ul>
                        </li>
                        <li><strong>Use <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">&lt;picture&gt;</code> element or <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">Accept</code> header negotiation</strong> to serve the best format per client.</li>
                        <li><strong>Cache aggressively</strong> – Generate once, serve from edge.</li>
                    </ol>

                    <p class="text-[#6C3F31]">This workflow is common in Next.js/Cloudflare/Imgix pipelines. Jpegli as the fallback encoder shaves 15-30% off JPEG fallback size compared to libjpeg-turbo, which translates to measurable LCP improvements for users stuck on IE11 or ancient Android WebViews.</p>
                </div>

                <div class="bg-white p-8 rounded-[2.5rem] border border-pink-100 shadow-sm">
                    <div class="mb-4">
                        <h3 class="text-xl font-bold text-[#4A2C2C] mb-2">Workflow 3: "Photographer/Export Pipeline (Lightroom → Optimize → Client Delivery)"</h3>
                    </div>

                    <p class="mb-4 text-[#8B5E51]"><strong>Problem:</strong> You export 500 wedding photos from Lightroom at quality 90 (sRGB JPEG). Files are 3-5MB each. The client wants a Google Drive folder under 2GB total, and you want each image under 1MB for fast web gallery load.</p>

                    <p class="mb-3 font-bold text-[#4A2C2C]">Solution:</p>
                    
                    <ol class="list-decimal list-outside ml-6 space-y-3 mb-6 text-[#6C3F31]">
                        <li><strong>Export from Lightroom at maximum quality</strong> (90-95) with sRGB color profile and no size limit. Do <em>not</em> resize or compress in Lightroom—Lightroom's JPEG encoder (as of 2026) still uses an older library, not jpegli.</li>
                        <li><strong>Batch process the exported JPEGs externally</strong> - Resize to 2560px long edge (sufficient for 4K display). Compress using jpegli at quality 85. Target 800KB-1.2MB per image.</li>
                        <li><strong>Strip unnecessary metadata</strong> - Remove GPS, camera serial numbers, and embedded thumbnails. Keep copyright EXIF if contractually required.</li>
                        <li><strong>Test decode compatibility</strong> - Open a few files in common client tools (Windows Photo Viewer, macOS Preview, Gmail image preview). Jpegli JPEGs are fully compatible, but it never hurts to verify before delivering 500 files.</li>
                    </ol>

                    <InfoBox type="technical">
                        <strong>Why not do this in Lightroom?</strong> Lightroom's export quality slider is a black box, and as of 2026, it does not use jpegli. External optimization with jpegli gives you explicit control and measurably smaller files at equivalent visual quality (per test results reported by Google and independent reviewers).
                    </InfoBox>
                </div>
            </div>
        </section>

        <section id="testing">
            <SectionHeading>A Repeatable Test Methodology: Compare Encoders on Your Content</SectionHeading>

            <p class="mb-6">Generic benchmarks (like Google's or Gianni Rosato's) are useful, but they tested <em>their</em> images. Your product photos, your hero images, your content may behave differently. Here's a methodology you can replicate in 30 minutes.</p>

            <div class="space-y-8">
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Step 1: Select 3-5 Representative Source Images</h3>
                    <ul class="list-disc list-outside ml-6 space-y-2 mb-4 text-[#6C3F31]">
                        <li>Pick images that represent your actual use case (product photos, portraits, UI screenshots, etc.).</li>
                        <li>Use high-quality originals (PNG, or JPEG at quality 95+, or camera RAW exported lossless).</li>
                        <li>Include at least one image with gradients (sky, skin tone) and one with sharp edges (if applicable).</li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Step 2: Fix Dimensions and Normalize</h3>
                    <p class="mb-4">Resize all images to your target output resolution (e.g., 2048px wide for web, 1600×1600px for eBay). Use a consistent resampling filter (Lanczos3 or similar).</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Step 3: Encode with Multiple Encoders at Equal Target File Size</h3>
                    <ul class="list-disc list-outside ml-6 space-y-2 mb-4 text-[#6C3F31]">
                        <li>Pick a target file size (e.g., 300KB).</li>
                        <li>Encode each image with:
                            <ul class="list-disc list-outside ml-6 mt-2 space-y-1">
                                <li>libjpeg-turbo (adjust quality until file ≈ 300KB).</li>
                                <li>MozJPEG (same process).</li>
                                <li>jpegli (same process).</li>
                            </ul>
                        </li>
                        <li>Record the quality setting required to hit 300KB for each encoder.</li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Step 4: Measure Visual Quality</h3>
                    
                    <p class="mb-3"><strong>Subjective (best):</strong> Open all three versions side-by-side at 100% zoom. Look for blocking artifacts (8×8 squares), banding in gradients, loss of fine detail. Trust your eyes—metrics don't capture everything.</p>

                    <p class="mb-4"><strong>Objective (if available):</strong> Use SSIM or SSIMULACRA2 to compare each encoded version against the original. SSIM is outdated but widely available. SSIMULACRA2 is more perceptually accurate. Beware that metrics can mislead—an image with a higher SSIM score may still look worse to human eyes.</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Step 5: Measure Encoding Time</h3>
                    
                    <p class="mb-4">If speed matters (batch processing thousands of images), time the encode:</p>

                    <div class="my-4 bg-[#2C1A1A] rounded-xl p-5 overflow-x-auto border border-pink-100/20 shadow-inner">
<pre class="text-pink-100 text-sm font-mono leading-relaxed">time cjpegli input.png -q 85 output.jpg
time cjpeg -quality 85 input.png > output_mozjpeg.jpg</pre>
                    </div>

                    <p class="mb-4">Jpegli encoding speed is comparable to MozJPEG in most tests (70-100ms per image for typical web-resolution photos on modern CPUs).</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Step 6: Document Settings and Results</h3>
                    
                    <p class="mb-4">Create a simple table:</p>

                    <!-- Mobile: Card Layout -->
                    <div class="my-6 md:hidden space-y-4">
                        <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <h4 class="font-bold text-[#4A2C2C] text-lg mb-4">libjpeg-turbo</h4>
                            <div class="grid grid-cols-2 gap-4 text-[#6C3F31]">
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Quality</span>
                                    <span class="text-base">78</span>
                                </div>
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">File Size</span>
                                    <span class="text-base">305KB</span>
                                </div>
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Encoding Time</span>
                                    <span class="text-base">45ms</span>
                                </div>
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Visual Score</span>
                                    <span class="text-base">0.92</span>
                                </div>
                                <div class="col-span-2">
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Subjective Notes</span>
                                    <span class="text-base">Slight blocking in sky</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <h4 class="font-bold text-[#4A2C2C] text-lg mb-4">MozJPEG</h4>
                            <div class="grid grid-cols-2 gap-4 text-[#6C3F31]">
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Quality</span>
                                    <span class="text-base">82</span>
                                </div>
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">File Size</span>
                                    <span class="text-base">298KB</span>
                                </div>
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Encoding Time</span>
                                    <span class="text-base">98ms</span>
                                </div>
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Visual Score</span>
                                    <span class="text-base">0.94</span>
                                </div>
                                <div class="col-span-2">
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Subjective Notes</span>
                                    <span class="text-base">Clean, good detail</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-pink-50/30 rounded-2xl border border-pink-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <h4 class="font-bold text-[#D81B60] text-lg mb-4">jpegli 4:2:0</h4>
                            <div class="grid grid-cols-2 gap-4 text-[#6C3F31]">
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Quality</span>
                                    <span class="text-base">85</span>
                                </div>
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">File Size</span>
                                    <span class="text-base">303KB</span>
                                </div>
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Encoding Time</span>
                                    <span class="text-base">71ms</span>
                                </div>
                                <div>
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Visual Score</span>
                                    <span class="text-base">0.95</span>
                                </div>
                                <div class="col-span-2">
                                    <span class="text-xs font-black text-[#4A2C2C] uppercase tracking-wider block mb-1">Subjective Notes</span>
                                    <span class="text-base">Cleanest gradients</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Desktop: Table Layout -->
                    <div class="my-6 overflow-hidden rounded-3xl border border-pink-50 shadow-sm bg-white hidden md:block">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-[#FFF5F7] border-b border-pink-100">
                                        <th class="py-4 px-6 text-sm font-black text-[#4A2C2C]">Encoder</th>
                                        <th class="py-4 px-6 text-sm font-black text-[#4A2C2C]">Quality</th>
                                        <th class="py-4 px-6 text-sm font-black text-[#4A2C2C]">File Size</th>
                                        <th class="py-4 px-6 text-sm font-black text-[#4A2C2C]">Encoding Time</th>
                                        <th class="py-4 px-6 text-sm font-black text-[#4A2C2C]">Visual Score (SSIM)</th>
                                        <th class="py-4 px-6 text-sm font-black text-[#4A2C2C]">Subjective Notes</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-pink-50">
                                    <tr>
                                        <td class="py-4 px-6 text-[#6C3F31]">libjpeg-turbo</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">78</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">305KB</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">45ms</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">0.92</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">Slight blocking in sky</td>
                                    </tr>
                                    <tr>
                                        <td class="py-4 px-6 text-[#6C3F31]">MozJPEG</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">82</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">298KB</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">98ms</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">0.94</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">Clean, good detail</td>
                                    </tr>
                                    <tr class="bg-pink-50/30">
                                        <td class="py-4 px-6 font-bold text-[#D81B60]">jpegli 4:2:0</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">85</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">303KB</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">71ms</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">0.95</td>
                                        <td class="py-4 px-6 text-[#6C3F31]">Cleanest gradients</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <p class="mb-4">This data is specific to <em>your</em> content and workflow. Use it to decide which encoder to adopt.</p>
                </div>
            </div>
        </section>

        <section>
            <SectionHeading>Mochify's Privacy-First JPEG Optimization</SectionHeading>

            <p class="mb-4">When you're forced to deliver JPEG—because eBay won't accept AVIF, or your client's print lab demands it, or the legacy CMS hasn't been updated since 2015—you want the best possible quality-per-byte without exposing your unpublished product photos or client assets to generic cloud processors that store files for "processing".</p>

            <p class="mb-6">Mochify processes images entirely in RAM. The file streams into memory, gets compressed (using jpegli or other modern encoders), and is deleted the instant the download completes. Nothing touches the hard drive. No training data. No 24-hour retention window. Just ephemeral processing at C++20 speed.</p>

            <div class="bg-gradient-to-br from-pink-50 to-orange-50 p-8 rounded-[2rem] border border-pink-100">
                <h3 class="text-lg font-black text-[#875F42] mb-3 flex items-center gap-2">
                    Why this matters for JPEG workflows specifically
                </h3>
                <p class="text-[#6C3F31] leading-relaxed mb-4">
                    When you're exporting product photography for a new Shopify drop, or preparing 200 listings for eBay, you're handling unreleased inventory. A leaked product photo 48 hours before launch can cost thousands in competitive advantage. Zero-retention architecture eliminates that risk entirely.
                </p>
                <p class="text-[#6C3F31] leading-relaxed">
                    Mochify supports jpegli output, which means you can compress to smaller file sizes at higher visual quality compared to tools still using libjpeg-turbo—without storing your images on someone else's server.
                </p>
            </div>
        </section>

        <div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10 mb-6">
                <span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">
                    Free Tool
                </span>
            </div>

            <h3 class="text-2xl md:text-3xl font-black text-[#4A2C2C] relative z-10 mb-3 flex items-center justify-center gap-3">
                Try It: Compare Jpegli on One Real Image
            </h3>

            <p class="text-[#6C3F31] text-lg max-w-2xl mx-auto relative z-10 mb-8 leading-relaxed">
                Theory and benchmarks are useful, but your specific content behaves differently from test datasets. Pick one representative image and compress it with jpegli to see the quality-per-byte improvement for yourself.
            </p>

            <a href="https://mochify.xyz" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
                <span>Compress a JPEG with Mochify (Jpegli)</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

        <section id="faq" class="mt-12 pt-12 border-t border-pink-50">
            <SectionHeading>FAQ: JPEG Optimization in 2026</SectionHeading>
            
            <div class="space-y-6">
                <div class="bg-white p-6 rounded-2xl border border-pink-100">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-2">Is jpegli just Google's version of MozJPEG?</h4>
                    <p class="text-[#6C3F31]">No. MozJPEG improved on libjpeg-turbo primarily through better quantization and trellis optimization. Jpegli applies adaptive quantization heuristics from JPEG XL, improved matrix selection, and optionally uses the XYB colorspace—techniques MozJPEG doesn't use. In independent tests, jpegli outperforms MozJPEG on high-quality photographic content, though results vary by image.</p>
                </div>
                
                <div class="bg-white p-6 rounded-2xl border border-pink-100">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-2">Will jpegli-encoded JPEGs open on my iPhone?</h4>
                    <p class="text-[#6C3F31]">Yes. Jpegli produces standard JPEG files fully compliant with ISO/IEC 10918-1. Every JPEG viewer, including iOS Photos, Android Gallery, Windows Photo Viewer, and every web browser, will open them without issue.</p>
                </div>
                
                <div class="bg-white p-6 rounded-2xl border border-pink-100">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-2">Can I use jpegli in Photoshop or Lightroom?</h4>
                    <p class="text-[#6C3F31]">Not natively as of early 2026. Adobe has not integrated jpegli into their export pipelines. You can export from Lightroom at high quality, then recompress externally using a tool that supports jpegli (like Mochify or command-line <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">cjpegli</code> from libjxl).</p>
                </div>
                
                <div class="bg-white p-6 rounded-2xl border border-pink-100">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-2">Does jpegli support progressive JPEG?</h4>
                    <p class="text-[#6C3F31]">Yes. Jpegli can encode both baseline and progressive JPEGs. Use progressive encoding for large images (hero images, product photos above 100KB) to improve perceived load speed.</p>
                </div>
                
                <div class="bg-white p-6 rounded-2xl border border-pink-100">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-2">How much smaller are jpegli files compared to MozJPEG?</h4>
                    <p class="text-[#6C3F31]">It depends on the image and quality setting. Google's tests showed up to 35% smaller files at high quality (90+) compared to libjpeg-turbo, and smaller than MozJPEG in several scenarios. Independent tests show mixed results—sometimes 10-15% smaller, sometimes negligible. Test on your own content.</p>
                </div>
                
                <div class="bg-white p-6 rounded-2xl border border-pink-100">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-2">Should I switch all my existing JPEGs to jpegli?</h4>
                    <p class="text-[#6C3F31]">Only if you need to reduce file size and are reprocessing assets anyway (e.g., resizing for a new platform, refreshing a product catalog). Recompressing an already-compressed JPEG introduces generation loss. If the current JPEG is "good enough," leave it.</p>
                </div>
                
                <div class="bg-white p-6 rounded-2xl border border-pink-100">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-2">What chroma subsampling should I use with jpegli?</h4>
                    <p class="text-[#6C3F31]">For photographic content, 4:2:0 is standard and delivers the smallest files with minimal visible quality loss. For graphics, screenshots, or images with fine color detail (e.g., product photos with intricate patterns), test 4:2:2 or 4:4:4—the file will be larger, but color fidelity improves.</p>
                </div>
                
                <div class="bg-white p-6 rounded-2xl border border-pink-100">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-2">Does jpegli work with ICC color profiles?</h4>
                    <p class="text-[#6C3F31]">Yes. Jpegli can embed ICC profiles (including sRGB and XYB). For web delivery, sRGB is safe to embed or assume. For print workflows, retain the original profile from your RAW processor.</p>
                </div>
                
                <div class="bg-white p-6 rounded-2xl border border-pink-100">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-2">Why isn't jpegli the default in WordPress plugins yet?</h4>
                    <p class="text-[#6C3F31]">Adoption lag. WordPress image optimization plugins (ShortPixel, Smush, EWWW) are built around libjpeg-turbo and MozJPEG, which are stable, widely tested, and simple to deploy. Jpegli requires libjxl dependencies and was only released in 2024. Expect gradual adoption as jpegli proves itself in production at scale.</p>
                </div>
                
                <div class="bg-white p-6 rounded-2xl border border-pink-100">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-2">Is jpegli faster or slower than MozJPEG?</h4>
                    <p class="text-[#6C3F31]">Comparable. Google's benchmarks and independent tests show jpegli encoding speed is similar to MozJPEG and faster than older tools like Guetzli. Decode speed is identical (they all produce standard JPEGs decoded by the same libraries).</p>
                </div>
                
                <div class="bg-white p-6 rounded-2xl border border-pink-100">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-2">Can I use jpegli for JPEG XL output?</h4>
                    <p class="text-[#6C3F31]">No. Jpegli produces JPEG files, not JPEG XL files. JPEG XL is a separate next-generation format with better compression than JPEG but limited browser support as of 2026. If you want JPEG XL output, use <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">cjxl</code> from the libjxl toolkit.</p>
                </div>
            </div>
        </section>
    </div>

</article>