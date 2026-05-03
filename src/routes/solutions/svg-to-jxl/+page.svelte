<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
</script>

<svelte:head>
    <title>Convert SVG to JPEG XL Online - Free & Fast | Mochify</title>
    <meta name="description" content="Convert SVG files to JPEG XL (JXL) — the next-generation format with outstanding compression, full transparency, and lossless mode. Great for archiving and future-proofing.">
    <meta property="og:title" content="Convert SVG to JPEG XL (JXL) - Free, Private & Instant | Mochify" />
    <meta property="og:description" content="Convert SVG files to JPEG XL — outstanding compression, full transparency, and lossless mode. Future-proof your SVG assets." />
    <link rel="canonical" href="https://mochify.app/solutions/svg-to-jxl" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SVG to JPEG XL Converter",
        "description": "Convert SVG vector files to JPEG XL format with transparency support. Free, private, and processed entirely in memory.",
        "url": "https://mochify.app/solutions/svg-to-jxl",
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
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm text-amber-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    Next-Gen Format
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    SVG
                </span>
                to
                <span class="bg-gradient-to-r from-[#FDE68A] to-[#F59E0B] bg-clip-text text-transparent">
                    JPEG XL
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Rasterise SVG files to JPEG XL — outstanding compression, full transparency, and a lossless mode that outperforms PNG.
            </p>

            <!-- Browser support notice -->
            <div class="inline-flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 text-left max-w-xl mx-auto">
                <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                <p class="text-amber-800 text-sm font-medium m-0">
                    <strong>Browser support note:</strong> JPEG XL requires a browser flag in Chrome 145 and is not yet enabled by default. Best suited for archiving, internal tooling, and future-proofing workflows. Use AVIF or WebP for live web delivery today.
                </p>
            </div>
        </div>

        <div class="mb-16">
            <ImageUpload output="jxl" types=".SVG" showTypes={true} showExifOption={false} compact />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert SVG to JPEG XL?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            JPEG XL is the most capable image format available today — it supports <strong class="text-[#7E685E]">full alpha transparency</strong>, a true lossless mode that beats PNG on file size, HDR, and wide colour gamut. For SVG assets you want to archive, hand off at maximum quality, or future-proof for a stack that will adopt JXL when browser support matures, it's the right format to rasterise to now.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            JXL's lossless mode is particularly well-suited to SVG rasterisation: because SVG paths produce clean, hard edges and flat colour regions, the lossless encoder can represent the output very efficiently — often <strong class="text-[#7E685E]">smaller than an equivalent lossless PNG</strong>.
                        </p>
                    </div>

                    <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                        <h3 class="font-bold text-[#4A2C2C] mb-5 text-sm uppercase tracking-widest opacity-70">Best Use Cases in 2026</h3>
                        <ul class="space-y-3">
                            {#each [
                                'Asset archiving at maximum quality',
                                'Internal design system asset delivery',
                                'Figma / Illustrator export pipelines',
                                'Apps and tools with JXL codec support',
                                'Future-proofing for browser adoption',
                                'Lossless icon sprite rasterisation',
                            ] as item}
                                <li class="flex items-center gap-3 text-sm font-semibold text-[#6C3F31]">
                                    <span class="w-2 h-2 rounded-full bg-[#FDE68A] flex-shrink-0"></span> {item}
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>

                <div class="space-y-4">
                    {#each [
                        {
                            q: "Does JPEG XL preserve my SVG's transparency?",
                            a: "Yes. JPEG XL supports a full alpha channel. Transparent areas in your SVG stay transparent in the output."
                        },
                        {
                            q: "Can I use JXL files on my website today?",
                            a: "With caveats. Chrome 145 added JXL decoding but it requires enabling a browser flag — it's not on by default. Firefox and Safari support is still limited. For live web delivery, use AVIF or WebP with JXL as an optional progressive enhancement via a <picture> element. For archiving or internal tooling, JXL works well right now."
                        },
                        {
                            q: "What size does my SVG rasterise to?",
                            a: "By default, Mochify uses the dimensions from the SVG's viewBox or width/height attributes. To specify a different output size, use Magic Flow — for example, 'convert to JPEG XL at 2400px wide, lossless'."
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
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Browser support</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Best for</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            { fmt: 'JPEG XL', highlight: true, alpha: '✓', support: 'Partial (flag required)', best: 'Archiving, internal tooling, future-proofing' },
                            { fmt: 'AVIF', highlight: false, alpha: '✓', support: '~95% global', best: 'Modern web — best compression for live delivery' },
                            { fmt: 'WebP', highlight: false, alpha: '✓', support: '~97% global', best: 'Broad compatibility — CMSes, email, social' },
                            { fmt: 'PNG', highlight: false, alpha: '✓', support: '100%', best: 'Legacy tools, print, lossless archiving' },
                        ] as row, i}
                            <tr class={row.highlight ? 'bg-amber-50' : i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-5 py-3.5 font-black text-[#4A2C2C] border-b border-pink-50">
                                    {row.fmt}
                                    {#if row.highlight}
                                        <span class="ml-2 text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">This page</span>
                                    {/if}
                                </td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.alpha}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.support}</td>
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
                <a href="/solutions/svg-to-avif" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center flex-shrink-0 border border-green-100">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to AVIF →</p>
                        <p class="text-xs text-[#875F42]">~50% smaller than PNG, best for modern web</p>
                    </div>
                </a>
            </div>
        </section>

    </div>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>
