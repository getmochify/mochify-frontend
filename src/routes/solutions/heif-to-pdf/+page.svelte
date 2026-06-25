<script lang="ts">
    import ImagesToPdf from '$lib/components/ImagesToPdf.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
</script>

<svelte:head>
    <title>HEIC/HEIF to PDF — Convert iPhone Photos to a PDF | Mochify</title>
    <meta name="description" content="Convert HEIC and HEIF photos from your iPhone or iPad into a single PDF. One page per image, multi-page support, your choice of page size. Processed in memory, never stored. Free, no sign-up required.">
    <meta property="og:title" content="HEIC/HEIF to PDF — Convert iPhone Photos to a PDF | Mochify" />
    <meta property="og:description" content="Convert HEIC and HEIF photos from your iPhone or iPad into a single PDF. One page per image, multi-page support, your choice of page size. Processed in memory, never stored. Free, no sign-up required." />
    <link rel="canonical" href="https://mochify.app/solutions/heif-to-pdf" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "HEIC/HEIF to PDF Converter",
        "description": "Convert HEIC and HEIF photos from iPhone or iPad into a single multi-page PDF. One page per image, page-size options, processed entirely in memory.",
        "url": "https://mochify.app/solutions/heif-to-pdf",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "provider": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" }
        }
    </script>
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] min-h-screen flex flex-col">
    <Navigation />

    <div class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F3F0FF] border border-[#DDD6FE] shadow-sm text-[#6D28D9] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    Photos → PDF
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm text-emerald-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 9l1.5 1.5 3-3.75" /></svg>
                    iPhone &amp; iPad
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                <span class="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    HEIC/HEIF
                </span>
                to
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    PDF
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Turn iPhone and iPad photos into a shareable PDF in one step. One page per photo, in upload order. Pick a page size, hit create, and it downloads instantly. Nothing is ever stored.
            </p>
        </div>

        <div class="mb-16">
            <ImagesToPdf
                accept=".heic,.heif,.hif,.jpg,.jpeg,.png,.webp,.avif,.jxl,image/heic,image/heif,image/jpeg,image/png,image/webp,image/avif,image/jxl"
                formatLabel="HEIC/HEIF"
                downloadName="mochified.pdf"
            />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert HEIC/HEIF to PDF?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            iPhones and iPads shoot in HEIF by default. The format is excellent — smaller files than JPEG, 10-bit colour, HDR — but <strong class="text-[#7E685E]">most non-Apple devices can't open .heic files reliably</strong>. Windows, Android, print shops, and many web services still choke on them.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Wrapping your photos in a PDF gives them <strong class="text-[#7E685E]">universal reach</strong>: one file that opens everywhere, prints predictably, and keeps every photo as its own page in the order you add them. Mochify decodes and embeds each HEIC at high quality so nothing is lost in the process.
                        </p>
                    </div>

                    <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-3">
                        <p class="text-xs font-black text-emerald-700 uppercase tracking-widest">What happens to HEIF quality in PDF</p>
                        <ul class="space-y-2.5">
                            {#each [
                                'HEIF is decoded at full resolution before embedding — no double-compression',
                                '10-bit colour data is preserved through the PDF container',
                                'Portrait mode and HDR shots embed without clipping highlights',
                                'Fit-to-image page size keeps the exact aspect ratio of each photo',
                            ] as point}
                                <li class="flex items-start gap-2.5 text-sm text-emerald-900">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></span>
                                    {point}
                                </li>
                            {/each}
                        </ul>
                    </div>

                    <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                        <h3 class="font-bold text-[#4A2C2C] mb-5 text-sm uppercase tracking-widest opacity-70">Common Use Cases</h3>
                        <ul class="space-y-3">
                            {#each [
                                'Sending a set of iPhone photos to someone on Windows or Android',
                                'Submitting photos to a form or platform that rejects HEIC',
                                'Creating a photo PDF for a print shop order',
                                'Sharing event photos as a single document by email',
                                'Archiving a shoot as a portable, self-contained file',
                                'Bundling real-estate walkthrough photos into one PDF',
                            ] as item}
                                <li class="flex items-center gap-3 text-sm font-semibold text-[#6C3F31]">
                                    <span class="w-2 h-2 rounded-full bg-emerald-300 shrink-0"></span> {item}
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>

                <div class="space-y-4">
                    {#each [
                        {
                            q: "How many photos can I combine?",
                            a: "The free tier creates a PDF of up to 3 pages. Paid plans go up to 10 pages, and Growth is unlimited (up to a 200-page safety ceiling). Each photo becomes one page."
                        },
                        {
                            q: "Do I need an account?",
                            a: "No. HEIC/HEIF to PDF works without signing up, within the same free usage limits as any other conversion. Create a free account or upgrade for more pages per PDF."
                        },
                        {
                            q: "Can I mix HEIC with other formats?",
                            a: "Yes. You can mix .heic and .heif with JPG, PNG, WebP, AVIF, and JXL in a single PDF. Each one becomes a page in the order you add it."
                        },
                        {
                            q: "What about HEIF files from Fuji or Canon cameras (HIF)?",
                            a: "HIF is the same HEIF container used by Fujifilm and Canon mirrorless cameras. Mochify handles .hif files just like .heic — add them alongside your iPhone photos."
                        },
                        {
                            q: "What page size do I get?",
                            a: "By default each page fits the photo exactly (no borders). You can also choose A4 or Letter if the PDF is headed for a printer."
                        },
                        {
                            q: "Are my photos stored anywhere?",
                            a: "Never. Mochify decodes and assembles the PDF entirely in memory, then wipes the data immediately after your download completes. No copies are kept on our servers."
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
                    { n: '1', t: 'Add your photos', d: 'Drop in HEIC or HEIF files (or JPG, PNG, WebP, AVIF). They become pages in the order you add them.' },
                    { n: '2', t: 'Pick a page size', d: 'Fit-to-image by default, or A4 / Letter if the PDF is headed for a printer.' },
                    { n: '3', t: 'Download the PDF', d: 'One click builds a single multi-page PDF in memory and downloads it. Nothing is stored.' },
                ] as step}
                    <div class="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-black text-sm mb-4">{step.n}</span>
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
                <a href="/heic-to-jpeg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                        <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 9l1.5 1.5 3-3.75" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIC to JPEG →</p>
                        <p class="text-xs text-[#875F42]">Convert iPhone photos to universally compatible JPEGs</p>
                    </div>
                </a>
                <a href="/solutions/webp-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">WebP to PDF →</p>
                        <p class="text-xs text-[#875F42]">Combine WebP images into a single multi-page PDF</p>
                    </div>
                </a>
            </div>
        </section>

    </div>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>
