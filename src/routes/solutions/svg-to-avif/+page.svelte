<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
</script>

<svelte:head>
    <title>Convert SVG to AVIF Online - Free & Fast | Mochify</title>
    <meta name="description" content="Convert SVG files to AVIF instantly. Get the smallest file sizes with full transparency support — the best raster format for SVG assets on modern web.">
    <meta property="og:title" content="Convert SVG to AVIF - Free, Private & Instant | Mochify" />
    <meta property="og:description" content="Convert SVG files to AVIF instantly. Get the smallest file sizes with full transparency support — the best raster format for SVG assets on modern web." />
    <link rel="canonical" href="https://mochify.app/solutions/svg-to-avif" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SVG to AVIF Converter",
        "description": "Convert SVG vector files to AVIF format with transparency support. Free, private, and processed entirely in memory.",
        "url": "https://mochify.app/solutions/svg-to-avif",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
        "provider": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" }
        }
    </script>
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 min-h-screen flex flex-col">
    <Navigation />

    <div class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F3F0FF] border border-[#DDD6FE] shadow-sm text-[#6D28D9] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                    Design Assets
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F0FDF4] border border-green-100 shadow-sm text-green-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    Smallest File Size
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    SVG
                </span>
                to
                <span class="bg-gradient-to-r from-[#6EE7B7] to-[#059669] bg-clip-text text-transparent">
                    AVIF
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Rasterise SVG files to AVIF — the most efficient format for transparent web assets, with up to 50% smaller files than PNG.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload output="avif" types=".SVG" showTypes={true} showExifOption={false} compact />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert SVG to AVIF?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            AVIF is the best-performing raster format available in 2026 for web-delivered assets. When you rasterise an SVG to AVIF, you get <strong class="text-[#7E685E]">full alpha transparency</strong>, support in all major browsers, and file sizes <strong class="text-[#7E685E]">roughly 50% smaller than equivalent PNG</strong> — significantly better than WebP.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            This makes AVIF the strongest choice for SVG assets delivered in modern web stacks: hero images, icon sprites, logo variants on dark and light backgrounds, and any asset where you control the serving environment and want the best possible LCP score.
                        </p>
                    </div>

                    <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                        <h3 class="font-bold text-[#4A2C2C] mb-5 text-sm uppercase tracking-widest opacity-70">Common Use Cases</h3>
                        <ul class="space-y-3">
                            {#each [
                                'Hero images and above-the-fold graphics',
                                'Logo variants for dark/light mode',
                                'Icon sets for modern web apps',
                                'Next.js / Nuxt / SvelteKit image pipelines',
                                'Cloudflare Images and CDN delivery',
                                'Open Graph images for modern platforms',
                            ] as item}
                                <li class="flex items-center gap-3 text-sm font-semibold text-[#6C3F31]">
                                    <span class="w-2 h-2 rounded-full bg-[#6EE7B7] flex-shrink-0"></span> {item}
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>

                <div class="space-y-4">
                    {#each [
                        {
                            q: "Does AVIF preserve my SVG's transparency?",
                            a: "Yes. AVIF supports a full alpha channel, so transparent areas in your SVG stay transparent in the output. No white background is added."
                        },
                        {
                            q: "What size does my SVG rasterise to?",
                            a: "By default, Mochify uses the dimensions from the SVG's viewBox or width/height attributes. To specify a different size, use Magic Flow — for example, 'convert to AVIF at 1200px wide, strip metadata'."
                        },
                        {
                            q: "AVIF vs WebP — which should I choose for SVG assets?",
                            a: "AVIF if you control the serving environment and want the smallest files — it's ~50% smaller than PNG vs WebP's ~30%. WebP if you need maximum compatibility, including older email clients, some CMSes, and tools that don't yet support AVIF."
                        },
                        {
                            q: "Are my files stored anywhere?",
                            a: "Never. Mochify processes everything in memory and wipes the data immediately after your download completes. No copies are kept on our servers."
                        },
                    ] as faq}
                        <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] list-none select-none">
                                <span>{faq.q}</span>
                                <span class="text-[#7E685E] transition-transform duration-300 group-open:rotate-180">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7" /></svg>
                                </span>
                            </summary>
                            <div class="px-6 pb-6 text-base text-[#6C3F31] leading-relaxed">
                                {faq.a}
                            </div>
                        </details>
                    {/each}
                </div>
            </div>
        </section>

        <!-- Format comparison -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">SVG → raster: choosing the right format</h2>
            <div class="overflow-x-auto rounded-2xl border border-pink-50 shadow-sm">
                <table class="w-full border-collapse text-sm">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Format</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Transparency</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">File size vs PNG</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Best for</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            { fmt: 'AVIF', highlight: true, alpha: '✓', size: '~50% smaller', best: 'Modern web stacks — best compression, full alpha' },
                            { fmt: 'WebP', highlight: false, alpha: '✓', size: '~30% smaller', best: 'Broad compatibility — CMSes, email, social' },
                            { fmt: 'PNG', highlight: false, alpha: '✓', size: 'Baseline', best: 'Print, lossless archiving, legacy tools' },
                            { fmt: 'JPEG', highlight: false, alpha: '✗', size: '~30% smaller', best: 'Solid-background images only' },
                        ] as row, i}
                            <tr class={row.highlight ? 'bg-[#F0FDF4]' : i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-5 py-3.5 font-black text-[#4A2C2C] border-b border-pink-50">
                                    {row.fmt}
                                    {#if row.highlight}
                                        <span class="ml-2 text-[10px] font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                                    {/if}
                                </td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.alpha}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.size}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.best}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-2 gap-4">
                <a href="/solutions/svg-to-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center flex-shrink-0 border border-pink-100">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to WebP →</p>
                        <p class="text-xs text-[#875F42]">Broadest compatibility — CMSes, email, social</p>
                    </div>
                </a>
                <a href="/solutions/svg-to-jxl" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to JPEG XL →</p>
                        <p class="text-xs text-[#875F42]">Next-gen format, lossless mode, future-proofing</p>
                    </div>
                </a>
            </div>
        </section>

    </div>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>
