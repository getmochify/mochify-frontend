<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import CodeBlock from '$lib/components/CodeBlock.svelte';

    const metadata = {
        category: "WordPress Optimization",
        readTime: "15 min read",
        date: "February 09, 2026"
    };
</script>

<ReadProgress />

<svelte:head>
    <title>Fix “Serve Images in Next-Gen Formats” in WordPress (No Plugins)</title>
    <meta name="description" content="A manual, repeatable workflow to improve LCP and reduce transfer size in WordPress without installing more image optimization plugins." />
    <meta property="og:title" content="Fix “Serve Images in Next-Gen Formats” in WordPress (No Plugins)" />
    <meta property="og:description" content="Convert to WebP/AVIF, shrink hero images, and boost LCP with a sleek Mochify workflow." />
    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": ["TechArticle", "HowTo"],
        "headline": "Fix \"Serve Images in Next-Gen Formats\" in WordPress (No Plugins) & Boost LCP",
        "description": "A step-by-step guide for WordPress site owners to clear PageSpeed \"Serve images in next-gen formats\" warnings without plugins by pre-optimizing images with Mochify and deploying AVIF/WebP with JPEG fallbacks.",
        "url": "https://mochify.xyz/guides/next-gen-image-formats-wordpress",
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
            "WordPress image optimization",
            "serve images in next-gen formats",
            "Core Web Vitals and LCP",
            "plugin-free performance tuning"
        ],
        "step": [
            {
            "@type": "HowToStep",
            "name": "Run a performance audit",
            "text": "Use PageSpeed Insights or Lighthouse on a representative URL and record which images trigger the \"Serve images in next-gen formats\" warning."
            },
            {
            "@type": "HowToStep",
            "name": "Collect target images from WordPress",
            "text": "Identify hero, product, and above-the-fold images from the Media Library, theme templates, or page builder that match the flagged URLs."
            },
            {
            "@type": "HowToStep",
            "name": "Batch optimize images with Mochify",
            "text": "Upload up to 25 source images to Mochify, convert them to AVIF or WebP, and compress them to reduce file size while keeping quality suitable for your layout."
            },
            {
            "@type": "HowToStep",
            "name": "Replace originals in WordPress",
            "text": "Re-upload optimized assets and update image references in posts, pages, templates, or custom fields so the next-gen files are actually served."
            },
            {
            "@type": "HowToStep",
            "name": "Add picture-based fallbacks for critical assets",
            "text": "Wrap key hero images in a picture element that serves AVIF or WebP first with a JPEG fallback to maintain compatibility on older browsers."
            },
            {
            "@type": "HowToStep",
            "name": "Re-test Core Web Vitals",
            "text": "Run PageSpeed Insights again to confirm the next-gen warning has cleared and that Largest Contentful Paint has improved on mobile and desktop."
            }
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
            How to Fix "Serve Images in Next-Gen Formats" in WordPress (Without a Plugin)
        </h1>
        <div class="mb-8">
            <h2 class="text-xl md:text-2xl font-bold text-[#875F42] opacity-80 leading-snug">
                Improve LCP without touching your plugin stack
            </h2>
        </div>
        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
           You run PageSpeed Insights on your homepage. The report is basically fine… until it isn't: "Serve images in next-gen formats" is lighting up, and right next to it you see the other gut-punch: "LCP needs improvement."
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                If you're running WordPress (especially WooCommerce) you've probably had the same thought I have: “I could install yet another image plugin… or I could fix the actual images.”
                
                <span class="block mt-4 font-bold">
                    This guide is the second option - a manual, repeatable workflow that improves LCP and reduces transfer size without installing image optimization plugins.
                </span>
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">
        
        <section class="my-12">
            <SectionHeading>What's in this Guide</SectionHeading>

            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    <li>
                        <a href="#understanding" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">01</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Understand the Warning</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#bloat" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">02</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Avoid Plugin Bloat</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#workflow" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">03</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">The Clean Workflow</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#step-by-step" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">04</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Step-by-Step Fix</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#settings" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">05</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Recommended Dimensions</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </section>

        <section id="understanding">
            <SectionHeading>What "Serve Images in Next-Gen Formats" Actually Means</SectionHeading>
            <p class="mb-4">
               Lighthouse flags this audit when your page serves images in older formats (typically JPEG/PNG) that could be materially smaller if you served them as modern formats like WebP or AVIF.
            </p>
            <p class="mb-4">
               The key idea isn't “WebP is magic.” It's that smaller image payloads reduce the amount of data the browser must download before it can paint the page. This is why it shows up next to LCP: if your LCP element is a 900KB JPEG hero, you're asking the browser to download a big file before you can “look fast.”
            </p>

            <InfoBox type="technical">
                Lighthouse also ignores tiny wins - if an image would save less than about 8KB, it usually won't show up as a meaningful opportunity in reports.
            </InfoBox>
            
        </section>

        <section id="understanding">
            <SectionHeading>Why this shows up next to LCP</SectionHeading>

            <p class="mb-4">Largest Contentful Paint (LCP) measures how long it takes for the largest element in the viewport (often a hero image, featured image, or large banner) to render.</p>

            <p class="mb-4">So if your LCP element is a 900KB JPEG hero, you're effectively asking the browser to download and decode a big file before you can “look fast.” Convert that hero to WebP/AVIF, and you often reduce transfer size enough to move LCP in the right direction (especially on mobile connections).</p>
        </section>

        <section id="bloat">
            <SectionHeading>Why More Image Plugins Often Make Things Worse</SectionHeading>
            <p class="mb-4">
               I'm not anti-plugin. I'm anti “three plugins doing the same job with different defaults.” The most common failure mode we see on WordPress performance audits involves a stack that creates real costs:
            </p>
            <ul class="list-disc list-outside ml-6 space-y-2 mb-6 text-[#6C3F31]">
                <li>More CPU load (image processing inside your hosting environment).</li>
                <li>More moving parts (updates, conflicts, weird edge cases with themes).</li>
                <li>More media clutter (duplicate files, “-scaled” variants, “backup-originals” folders).</li>
            </ul>
            <p class="mb-4 font-bold">
               If you want a clean backend, a plugin-free workflow is simple: only upload optimized images in the first place.</p>
        </section>

        <section id="workflow">
            <SectionHeading>The Clean External Workflow (Mochify)</SectionHeading>
            <p class="mb-4">
                Mochify is built for exactly this: pre-optimizing images before they ever hit WordPress. Here is the workflow we recommend:
            </p>
            <ol class="list-decimal list-outside ml-6 space-y-3 mb-6 text-[#6C3F31]">
                <li><strong>Export or identify</strong> your hero and key content images (the ones PageSpeed calls out).</li>
                <li>Drag them into Mochify, convert <strong>JPG/PNG → WebP or AVIF</strong>, and compress.</li>
                <li>Download the optimized files and <strong>re-upload to WordPress</strong>, replacing the originals in your content/theme.</li>
            </ol>

            <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">
                Why Mochify fits this job:
            </h3>

            <ul class="list-disc list-outside ml-6 space-y-2 mb-6 text-[#6C3F31]">
                <li>Images are processed in memory and discarded immediately-no disk storage, no retention.</li>
                <li>Mochify runs a high-performance C++ engine for fast conversions and compression.</li>
                <li>You can process up to 25 images in parallel in a batch (for free), which makes "cleaning up" a page or a small library realistic in one sitting.</li>
            </ul>
            
            <div class="my-8 bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-2xl border border-pink-100">
                <h3 class="text-lg font-black text-[#875F42] mb-3 flex items-center gap-2">
                    <span class="text-xl">💡</span>
                    iPhone/Creator Bonus: HEIC Support
                </h3>
                <p class="text-base text-[#6C3F31] leading-relaxed">
                    If you or your team uploads iPhone photos (HEIC/HEIF), the plugin-free approach still works: convert them to web-friendly formats (JPEG/WebP/AVIF) <em>before</em> uploading to WordPress, so you don't fight compatibility and file size later.
                </p>
            </div>
        </section>

        <section id="step-by-step">
            <SectionHeading>Step-by-Step: Fixing One Template/Page</SectionHeading>
            <p class="mb-6">Pick one page that matters commercially - homepage, a top category, or a best-selling product page. We're going to fix that page, not "optimize your whole site" in theory.</p>

            <div class="space-y-8">
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-2">1. Identify the offending images (PageSpeed / Lighthouse)</h3>
                    <p>Run PageSpeed Insights on the exact URL (mobile first). Open "Opportunities" and find "Serve images in next-gen formats." Copy the image URLs and note which one is likely your LCP element (often the hero/featured image).</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-2">2. Find each image in WordPress</h3>
                    <p>Track down the actual file that's being served. Common places include the Media Library, Theme assets (hardcoded banners), or Page Builder sections (Elementor/Divi blocks).</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-2">3. Run them through Mochify</h3>
                    <p>Upload a batch (up to 25 at once). Choose <strong>WebP</strong> for broad compatibility or <strong>AVIF</strong> for maximum compression (great for large hero images).</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-2">4. Re-upload and replace the originals</h3>
                    <p><strong>Option A (simplest):</strong> Upload the optimized WebP and update the page/post to reference the new file.</p>
                    <p class="mt-4"><strong>Option B (developer-friendly):</strong> If you want AVIF and a clean fallback without relying on a plugin, use the <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">&lt;picture&gt;</code> tag:</p>
                    
                    <CodeBlock filename="picture.html" code={`<picture>
    <source type="image/avif" srcset="/images/hero.avif">
    <source type="image/webp" srcset="/images/hero.webp">
    <img src="/images/hero.jpg" width="1600" height="900" alt="Your descriptive alt text">
</picture>`} />
                </div>
                
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-2">5. Confirm WordPress can upload WebP</h3>
                    <p class="mb-4">WordPress has supported uploading/using WebP images natively since WordPress 5.8.</p>
                    <p>
                        That means your no-plugin workflow can be as simple as "convert to WebP, uploads, use it like any other image" on modern WordPress installs.
                    </p>
                </div>
            </div>
        </section>

        <section id="settings">
            <SectionHeading>Best-Practice Settings & Dimensions</SectionHeading>
            <p class="mb-6">
               This is where most WordPress sites quietly lose: they upload a beautiful 5000px-wide image, then let WordPress generate a dozen derivatives, and still end up serving something too heavy for the first viewport.
            </p>

            <p>
                Below is a cheat-sheet you can use as a starting point (not dogma-test against your theme layout and audience).
            </p>

            <!-- Mobile: Card Layout -->
            <div class="my-8 md:hidden space-y-4">
                <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-4">Hero / LCP image</h4>
                    <div class="space-y-3 text-[#6C3F31]">
                        <div>
                            <span class="text-xs font-black text-[#875F42] uppercase tracking-wider block mb-1">Recommended Width</span>
                            <span class="text-base">1600-2400px</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#F06292] uppercase tracking-wider block mb-1">Target Size</span>
                            <span class="text-base">150-300KB (WebP)<br><span class="text-xs opacity-70">~80-250KB (AVIF)</span></span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-4">Blog featured image</h4>
                    <div class="space-y-3 text-[#6C3F31]">
                        <div>
                            <span class="text-xs font-black text-[#875F42] uppercase tracking-wider block mb-1">Recommended Width</span>
                            <span class="text-base">1200-1600px</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#F06292] uppercase tracking-wider block mb-1">Target Size</span>
                            <span class="text-base">80-200KB</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-4">In-article images</h4>
                    <div class="space-y-3 text-[#6C3F31]">
                        <div>
                            <span class="text-xs font-black text-[#875F42] uppercase tracking-wider block mb-1">Recommended Width</span>
                            <span class="text-base">1000-1400px</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#F06292] uppercase tracking-wider block mb-1">Target Size</span>
                            <span class="text-base">60-150KB</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-4">WooCommerce product</h4>
                    <div class="space-y-3 text-[#6C3F31]">
                        <div>
                            <span class="text-xs font-black text-[#875F42] uppercase tracking-wider block mb-1">Recommended Width</span>
                            <span class="text-base">1000-1600px</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#F06292] uppercase tracking-wider block mb-1">Target Size</span>
                            <span class="text-base">70-180KB</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h4 class="font-bold text-[#4A2C2C] text-lg mb-4">Logos / simple icons</h4>
                    <div class="space-y-3 text-[#6C3F31]">
                        <div>
                            <span class="text-xs font-black text-[#875F42] uppercase tracking-wider block mb-1">Recommended Width</span>
                            <span class="text-base">Consider SVG where appropriate</span>
                        </div>
                        <div>
                            <span class="text-xs font-black text-[#F06292] uppercase tracking-wider block mb-1">Target Size</span>
                            <span class="text-base">Under 20KB</span>
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
                                <th class="py-5 px-6 text-sm font-black text-[#4A2C2C] uppercase tracking-wider w-1/3">Image Type</th>
                                <th class="py-5 px-6 text-sm font-black text-[#875F42] uppercase tracking-wider w-1/3">Recommended Width</th>
                                <th class="py-5 px-6 text-sm font-black text-[#F06292] uppercase tracking-wider w-1/3">Target Size (WebP/AVIF)</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                            <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                <td class="py-5 px-6 font-bold text-[#4A2C2C]">Hero / LCP image</td>
                                <td class="py-5 px-6">1600-2400px</td>
                                <td class="py-5 px-6 text-[#4A2C2C]">150-300KB (WebP)<br><span class="text-xs opacity-70">~80-250KB (AVIF)</span></td>
                            </tr>
                            <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                <td class="py-5 px-6 font-bold text-[#4A2C2C]">Blog featured image</td>
                                <td class="py-5 px-6">1200-1600px</td>
                                <td class="py-5 px-6 text-[#4A2C2C]">80-200KB</td>
                            </tr>
                            <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                <td class="py-5 px-6 font-bold text-[#4A2C2C]">In-article images</td>
                                <td class="py-5 px-6">1000-1400px</td>
                                <td class="py-5 px-6 text-[#4A2C2C]">60-150KB</td>
                            </tr>
                            <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                <td class="py-5 px-6 font-bold text-[#4A2C2C]">WooCommerce product</td>
                                <td class="py-5 px-6">1000-1600px</td>
                                <td class="py-5 px-6 text-[#4A2C2C]">70-180KB</td>
                            </tr>
                            <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                <td class="py-5 px-6 font-bold text-[#4A2C2C]">Logos / simple icons</td>
                                <td class="py-5 px-6">Consider SVG where appropriate</td>
                                <td class="py-5 px-6 text-[#4A2C2C]">Under 20KB</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">
                Two rules I use in audits:
            </h3>

            <ol class="list-decimal list-outside ml-6 space-y-3 mb-6 text-[#6C3F31]">
                <li>If an image is above the fold, you should be able to justify its byte cost.</li>
                <li>If an image is below the fold, don't let it be larger than the above-the-fold hero.</li>
            </ol>
        </section>

        <section id="settings">
            <SectionHeading>A Small Format Comparsion (Example)</SectionHeading>
            <p class="mb-6">Here's what "serve images in next-gen formats" looks like in practice-same visual image, different encodings.</p>
<div class="my-8 overflow-hidden rounded-3xl border border-pink-50 shadow-sm bg-white">
                <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[#FFF5F7] border-b border-pink-100">
                                <th class="py-5 px-6 text-sm font-black text-[#4A2C2C] uppercase tracking-wider w-1/3">Format</th>
                                <th class="py-5 px-6 text-sm font-black text-[#875F42] uppercase tracking-wider w-1/3">File Size</th>
                                <th class="py-5 px-6 text-sm font-black text-[#F06292] uppercase tracking-wider w-1/3">Notes</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                            <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                <td class="py-5 px-6 font-bold text-[#4A2C2C]">Original JPEG (hero)</td>
                                <td class="py-5 px-6">900KB</td>
                                <td class="py-5 px-6 text-[#4A2C2C]">Looks fine, but heavy for mobile LCP.</td>
                            </tr>
                            <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                <td class="py-5 px-6 font-bold text-[#4A2C2C]">WebP (converted)</td>
                                <td class="py-5 px-6">260KB</td>
                                <td class="py-5 px-6 text-[#4A2C2C]">Often the best "default" win with minimal fuss.</td>
                            </tr>
                            <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                <td class="py-5 px-6 font-bold text-[#4A2C2C]">AVIF (converted)</td>
                                <td class="py-5 px-6">180KB</td>
                                <td class="py-5 px-6 text-[#4A2C2C]">Smaller still; great for heroes if you handle fallback.</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    </div>

                    <p>The point isn't chasing perfect numbers - it's removing hundred of kilobytes from the crtical rendering path.</p>
        </section>

        <section id="settings">
            <SectionHeading>Measuring the Impact (Before vs. After)</SectionHeading>
            <p class="mb-4">After you replace the images:</p>
            <ol class="list-decimal list-outside ml-6 space-y-3 mb-6 text-[#6C3F31]">
                <li class="mb-3">Run PageSpeed Insights again on the same URL.</li>
                <li class="mb-3">You should see "Serve images in next-gen formats" disappear from the Opportunities section.</li>
                <li class="mb-3">Check your LCP metric - it should improve, often by a significant margin (especially on mobile).</li>
                <li class="mb-3">If you use Core Web Vitals in Google Search Console, you may see an improvement there as well after Google re-crawls your page.</li>
            </ol>     
            
            <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">
                A simple before/after story (example)
            </h3>

            <ul class="list-disc list-outside ml-6 space-y-2 mb-6 text-[#6C3F31]">
                <li>Before: hero JPEG ~900KBl LCP ~3.2s (mobile).</li>
                <li>After: hero AVIF ~180KB LCP ~2.1s (mobile).</li>
            </ul>

            <p>
                Treat those numbers as an illustration, not a promise. But the mechanism is real: LCP is driven by the render time of the largest viewport element, and on many WordPress sites that element is an image.
            </p>
</section>

<section id="settings">
    <SectionHeading>When You Might Want Automation (Mochify Pro)</SectionHeading>

    <p class="mb-6">The manual workflow is perfect for:</p>

    <ul class="list-disc list-outside ml-6 space-y-2 mb-6 text-[#6C3F31]">
        <li>A handful of high-traffic pages.</li>
        <li>A small catalog.</li>
        <li>A publisher cleaning up top posts once per quarter.</li>
    </ul>

    <p class="mb-4">
        But if you're processing thousands of product images, running multiple client sites, or building a CI-style media pipeline, you eventually want automation.
    </p>

    <p class="mb-4">
        That's where <strong>Mochify Pro (coming soon)</strong> fits:
    </p>

        <ul class="list-disc list-outside ml-6 space-y-2 mb-6 text-[#6C3F31]">
        <li>An API for high-volume, automated conversion/compression.</li>
        <li>Parameters to fine tine quality and size.</li>
    </ul>

    <p>
        Importantly, the privacy model doesn't change: Mochify is designed around in-memory processing and immediate discard-accounts would store settings and keys, not your images.
    </p>

</section>


        <div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            <div class="relative z-10 mb-6">
                <span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">
                    Free Tool
                </span>
            </div>

            <h3 class="text-2xl md:text-3xl font-black text-[#4A2C2C] relative z-10 mb-3 flex items-center justify-center gap-3">
                Fix it today, plugin-free
            </h3>

            <p class="text-[#6C3F31] text-lg max-w-lg mx-auto relative z-10 mb-8 leading-relaxed">
                Run your heaviest page through PageSpeed, list the top 5 images it calls out, and run them through Mochify now.
            </p>

            <a href="https://mochify.xyz" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
                <span>Start Optimizing</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
        </div>

    </div>

        <section class="mt-12 pt-12 border-t border-pink-50">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-8">FAQ</h2>
            <div class="space-y-6">
                <div>
                    <h4 class="font-bold text-[#4A2C2C] text-lg">Does converting to WebP/AVIF directly help SEO?</h4>
                    <p class="mt-2 text-[#6C3F31]">Indirectly: it helps by reducing bytes and improving user-perceived speed, which can improve Core Web Vitals like LCP.</p>
                </div>
                <div>
                    <h4 class="font-bold text-[#4A2C2C] text-lg">Do I need a plugin to use WebP in WordPress?</h4>
                    <p class="mt-2 text-[#6C3F31]">On modern WordPress, WebP uploads are supported natively (since 5.8), so a no-plugin workflow is viable.</p>
                </div>
                <div>
                    <h4 class="font-bold text-[#4A2C2C] text-lg">Is it safe to upload client/product images to Mochify?</h4>
                    <p class="mt-2 text-[#6C3F31]">Mochify is designed around in-memory processing with immediate discard (no disk storage/retention).</p>
                </div>
            </div>
        </section>
</article>