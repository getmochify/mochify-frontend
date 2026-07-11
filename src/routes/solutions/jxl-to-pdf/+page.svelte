<script lang="ts">
    import ImagesToPdf from '$lib/components/ImagesToPdf.svelte';
</script>

<svelte:head>
    <title>JPEG XL to PDF — Convert JXL Images to a PDF | Mochify</title>
    <meta name="description" content="Convert JPEG XL images to a PDF in one step — one page per image, multi-page support, your choice of page size. Processed in memory, never stored. Free, no sign-up required.">
    <meta property="og:title" content="JPEG XL to PDF — Convert JXL Images to a PDF | Mochify" />
    <meta property="og:description" content="Convert JPEG XL images to a PDF in one step — one page per image, multi-page support, your choice of page size. Processed in memory, never stored. Free, no sign-up required." />
    <link rel="canonical" href="https://mochify.app/solutions/jxl-to-pdf" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "JPEG XL to PDF Converter",
        "description": "Convert JPEG XL images into a single multi-page PDF. One page per image, page-size options, processed entirely in memory.",
        "url": "https://mochify.app/solutions/jxl-to-pdf",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "provider": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" }
        }
    </script>
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F3F0FF] border border-[#DDD6FE] shadow-sm text-[#6D28D9] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    Images → PDF
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-100 shadow-sm text-amber-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                    Next-gen quality
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                <span class="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    JPEG XL
                </span>
                to
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    PDF
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Turn JPEG XL images into a shareable PDF in one step. One page per image, in upload order. Pick a page size, hit create, and it downloads instantly. Nothing is ever stored.
            </p>
        </div>

        <div class="mb-16">
            <ImagesToPdf
                accept=".jxl,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif,.hif,image/jxl,image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
                formatLabel="JPEG XL"
                downloadName="mochified.pdf"
            />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert JPEG XL to PDF?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            JPEG XL is an exceptional format — excellent compression, lossless mode, wide color gamut, up to 32-bit depth — but <strong class="text-[#7E685E]">almost nothing outside a browser can open a .jxl file</strong>. No standard email client, print shop, document tool, or operating system viewer handles it reliably.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Wrapping your JXL images in a PDF gives them <strong class="text-[#7E685E]">universal reach</strong>: one file that opens everywhere, prints predictably, and holds every image as its own page in the order you add it. Mochify embeds each image with high-quality encoding so no detail is lost in the conversion.
                        </p>
                    </div>

                    <!-- JXL quality callout -->
                    <div class="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-3">
                        <p class="text-xs font-black text-amber-700 uppercase tracking-widest">Why JXL quality holds up in PDF</p>
                        <ul class="space-y-2.5">
                            {#each [
                                'Lossless mode preserves every pixel — useful for print-ready or archival exports',
                                'Up to 32-bit depth survives the embed without banding or clipping',
                                'Wide color gamut (Display-P3, Rec. 2020) is preserved in the PDF container',
                                'Smaller source files mean faster uploads and a leaner final PDF',
                            ] as point}
                                <li class="flex items-start gap-2.5 text-sm text-amber-900">
                                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5"></span>
                                    {point}
                                </li>
                            {/each}
                        </ul>
                    </div>

                    <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                        <h3 class="font-bold text-[#4A2C2C] mb-5 text-sm uppercase tracking-widest opacity-70">Common Use Cases</h3>
                        <ul class="space-y-3">
                            {#each [
                                'Sharing JXL exports from photography tools with clients',
                                'Archival image sets that need a portable, single-file format',
                                'Print-ready photo proofs from high-bit-depth exports',
                                'Technical or scientific images requiring wide gamut fidelity',
                                'Bundling JXL screenshots or UI captures into one document',
                                'Anything a recipient cannot open as a .jxl file',
                            ] as item}
                                <li class="flex items-center gap-3 text-sm font-semibold text-[#6C3F31]">
                                    <span class="w-2 h-2 rounded-full bg-amber-300 flex-shrink-0"></span> {item}
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
                            a: "No. JPEG XL to PDF works without signing up, within the same free usage limits as any other conversion. Create a free account or upgrade for more pages per PDF."
                        },
                        {
                            q: "Can I mix JXL with other formats?",
                            a: "Yes. You can mix .jxl with PNG, JPG, WebP, AVIF, and HEIC/HIF in a single PDF. Each one becomes a page in the order you add it."
                        },
                        {
                            q: "Does converting to PDF reduce JXL quality?",
                            a: "No. Mochify embeds images at high quality, so lossless JXL files stay lossless. The wide gamut and bit depth characteristics that make JXL valuable are preserved through the embed."
                        },
                        {
                            q: "What page size do I get?",
                            a: "By default each page fits the image exactly (no borders). You can also choose A4 or Letter if the PDF is headed for a printer."
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
                    { n: '1', t: 'Add your images', d: 'Drop in JXL files (or PNG, JPG, WebP, AVIF, HEIC). They become pages in the order you add them.' },
                    { n: '2', t: 'Pick a page size', d: 'Fit-to-image by default, or A4 / Letter if the PDF is headed for a printer.' },
                    { n: '3', t: 'Download the PDF', d: 'One click builds a single multi-page PDF in memory and downloads it. Nothing is stored.' },
                ] as step}
                    <div class="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-50 text-amber-600 font-black text-sm mb-4">{step.n}</span>
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
                <a href="/solutions/webp-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">WebP to PDF →</p>
                        <p class="text-xs text-[#875F42]">Combine WebP images into a single multi-page PDF</p>
                    </div>
                </a>
                <a href="/solutions/png-to-jxl" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">PNG to JPEG XL →</p>
                        <p class="text-xs text-[#875F42]">Compress PNG images to next-gen JPEG XL</p>
                    </div>
                </a>
            </div>
        </section>

    </div>

