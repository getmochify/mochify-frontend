<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
</script>

<svelte:head>
    <title>Convert SVG to WebP Online - Free & Fast | Mochify</title>
    <meta name="description" content="Convert SVG files to WebP instantly. Preserve transparency, get smaller files than PNG, and make your SVG assets compatible with every platform and CMS.">
    <meta property="og:title" content="Convert SVG to WebP - Free, Private & Instant | Mochify" />
    <meta property="og:description" content="Convert SVG files to WebP instantly. Preserve transparency, get smaller files than PNG, and make your SVG assets compatible with every platform and CMS." />
    <link rel="canonical" href="https://mochify.app/solutions/svg-to-webp" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SVG to WebP Converter",
        "description": "Convert SVG vector files to WebP format with transparency support. Free, private, and processed entirely in memory.",
        "url": "https://mochify.app/solutions/svg-to-webp",
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
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    Transparency Preserved
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    SVG
                </span>
                to
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    WebP
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Rasterise SVG files to WebP with transparency intact — smaller than PNG, compatible with every platform and CMS.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload output="webp" showTypes={false} showExifOption={false} compact />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert SVG to WebP?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            SVG is the right format for icons, logos, and illustrations in your design tooling — but most platforms outside the browser can't accept or display it. <strong class="text-[#7E685E]">Social media, email clients, CMSes, and Open Graph previews all need a raster image.</strong>
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            WebP is the best raster target for SVG assets in 2026: it supports <strong class="text-[#7E685E]">full alpha transparency</strong> (so your logo stays crisp on any background), produces files <strong class="text-[#7E685E]">25–35% smaller than equivalent PNG</strong>, and works across every major browser, app, and platform.
                        </p>
                    </div>

                    <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                        <h3 class="font-bold text-[#4A2C2C] mb-5 text-sm uppercase tracking-widest opacity-70">Common Use Cases</h3>
                        <ul class="space-y-3">
                            {#each [
                                'Open Graph / social share images',
                                'Email template assets (SVG breaks in Outlook)',
                                'WordPress & Squarespace media libraries',
                                'App store screenshots and icons',
                                'Figma / Illustrator exports for web delivery',
                                'CMS thumbnails and preview images',
                            ] as item}
                                <li class="flex items-center gap-3 text-sm font-semibold text-[#6C3F31]">
                                    <span class="w-2 h-2 rounded-full bg-[#C4B5FD] flex-shrink-0"></span> {item}
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>

                <div class="space-y-4">
                    {#each [
                        {
                            q: "Does WebP preserve my SVG's transparency?",
                            a: "Yes. WebP supports a full alpha channel, so any transparent areas in your SVG — logos, icons, cutouts — remain transparent in the output. No white backgrounds introduced."
                        },
                        {
                            q: "What size does my SVG rasterise to?",
                            a: "By default, Mochify uses the dimensions defined in the SVG's viewBox or width/height attributes. To specify a different output size, use Magic Flow and describe the dimensions you need — for example, 'convert to WebP at 1200px wide'."
                        },
                        {
                            q: "Why WebP instead of PNG for SVG conversion?",
                            a: "WebP gives you the same transparency support as PNG but produces files roughly 25–35% smaller at equivalent quality. For web use — which is almost always the destination when converting from SVG — WebP is the better choice in 2026."
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
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">File size</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Best for</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [
                            { fmt: 'WebP', alpha: '✓', size: 'Small', best: 'Web, social, CMSes — the default choice' },
                            { fmt: 'PNG', alpha: '✓', size: 'Large', best: 'Print, lossless archiving, legacy tools' },
                            { fmt: 'AVIF', alpha: '✓', size: 'Smallest', best: 'Modern web with &lt;picture&gt; fallback' },
                            { fmt: 'JPEG', alpha: '✗', size: 'Small', best: 'Solid-background images only' },
                        ] as row, i}
                            <tr class={i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-5 py-3.5 font-black text-[#4A2C2C] border-b border-pink-50">{row.fmt}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.alpha}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.size}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{@html row.best}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </section>

    </div>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>
