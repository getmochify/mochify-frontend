<script lang="ts">
    import ImagesToPdf from '$lib/components/ImagesToPdf.svelte';
</script>

<svelte:head>
    <title>WebP to PDF — Combine Images into One PDF | Mochify</title>
    <meta name="description" content="Turn WebP images into a PDF in one step — one page per image, multi-page support, your choice of page size. Processed in memory, never stored. Free, no sign-up required.">
    <meta property="og:title" content="WebP to PDF — Combine Images into One PDF | Mochify" />
    <meta property="og:description" content="Turn WebP images into a PDF in one step — one page per image, multi-page support, your choice of page size. Processed in memory, never stored. Free, no sign-up required." />
    <link rel="canonical" href="https://mochify.app/solutions/webp-to-pdf" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "WebP to PDF Converter",
        "description": "Combine WebP images into a single multi-page PDF. One page per image, page-size options, processed entirely in memory.",
        "url": "https://mochify.app/solutions/webp-to-pdf",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "provider": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" }
        }
    </script>
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F3F0FF] border border-[#DDD6FE] shadow-sm text-[#6D28D9] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    Images → PDF
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F0FDF4] border border-green-100 shadow-sm text-green-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Multi-page
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    WebP
                </span>
                to
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    PDF
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Combine WebP images into a single PDF — one page per image, in upload order. Pick a page size, hit create, and it downloads instantly. Nothing is ever stored.
            </p>
        </div>

        <div class="mb-16">
            <ImagesToPdf />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Why turn WebP into a PDF?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            WebP is great for the web, but it's a <strong class="text-[#7E685E]">terrible format to send someone</strong> — most apps, printers, and document tools don't open it, and there's no clean way to bundle several into one file.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            A PDF fixes both: it's <strong class="text-[#7E685E]">universally viewable</strong>, prints predictably, and holds <strong class="text-[#7E685E]">every image as its own page</strong> in one shareable file. Mochify embeds each WebP at high quality — one page per image, in the order you add them.
                        </p>
                    </div>

                    <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                        <h3 class="font-bold text-[#4A2C2C] mb-5 text-sm uppercase tracking-widest opacity-70">Common Use Cases</h3>
                        <ul class="space-y-3">
                            {#each [
                                'Bundling screenshots into one document',
                                'Sending a set of designs to a client',
                                'Printable contact sheets and proofs',
                                'Receipts and scanned pages as one file',
                                'Portfolios and lookbooks',
                                'Anything a colleague can\'t open as .webp',
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
                            q: "How many images can I combine?",
                            a: "The free tier creates a PDF of up to 3 pages. Paid plans go up to 10 pages, and Growth is unlimited (up to a 200-page safety ceiling). Each image becomes one page."
                        },
                        {
                            q: "Do I need an account?",
                            a: "No — WebP to PDF works without signing up, within the same free usage limits as any other conversion. Create a free account or upgrade for more pages per PDF."
                        },
                        {
                            q: "Can I combine other formats too?",
                            a: "Yes. Alongside WebP you can add PNG, JPG, AVIF, and HEIC/HIF — mix and match in a single PDF. Each one becomes a page in the order you add it."
                        },
                        {
                            q: "What page size do I get?",
                            a: "By default each page fits the image exactly (no borders). You can also choose A4 or Letter if you're going to print the result."
                        },
                        {
                            q: "Does it lose quality?",
                            a: "Each image is embedded with high-quality encoding, so pages look the same as your originals at a sensible file size. There's no re-compression round-trip back to WebP."
                        },
                        {
                            q: "Are my files stored anywhere?",
                            a: "Never. Mochify builds the PDF in memory and wipes the data immediately after your download completes. No copies are kept on our servers."
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

        <!-- How it works -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">How it works</h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each [
                    { n: '1', t: 'Add your images', d: 'Drop in WebP (or PNG, JPG, AVIF, HEIC) files. They become pages in the order you add them.' },
                    { n: '2', t: 'Pick a page size', d: 'Fit-to-image by default, or A4 / Letter if the PDF is headed for a printer.' },
                    { n: '3', t: 'Download the PDF', d: 'One click builds a single multi-page PDF in memory and downloads it — nothing is stored.' },
                ] as step}
                    <div class="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#FFF0F3] text-[#F06292] font-black text-sm mb-4">{step.n}</span>
                        <h3 class="font-black text-[#4A2C2C] text-sm mb-1.5">{step.t}</h3>
                        <p class="text-sm text-[#6C3F31] leading-relaxed opacity-90">{step.d}</p>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-2 gap-4">
                <a href="/solutions/remove-background-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">Remove Background to WebP →</p>
                        <p class="text-xs text-[#875F42]">AI cutouts with a transparent WebP output</p>
                    </div>
                </a>
                <a href="/solutions/svg-to-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to WebP →</p>
                        <p class="text-xs text-[#875F42]">Rasterise vector assets to WebP with transparency</p>
                    </div>
                </a>
            </div>
        </section>

    </div>

