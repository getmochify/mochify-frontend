<script lang="ts">
    import ImagesToPdf from '$lib/components/ImagesToPdf.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Combine JXL images into one PDF online: one page per image in upload order, up to 20 files, no signup for your first PDF. Each image is stored in the PDF as a standard JPEG so it opens anywhere. Built in memory, never saved to disk.';

    const faqs: FaqItem[] = [
        {
            q: 'Is this JXL to PDF converter free?',
            a: 'Yes for your first PDF: no signup, up to 20 files, with the free allowance building a PDF of up to 3 pages. Full PDF tools are included in the Seller and Pro plans; see the pricing page for the current limits.'
        },
        {
            q: 'Do I need an account?',
            a: 'No. The page works without signing up, within the same free limits as any other Mochify conversion. Create a free account or upgrade to Seller or Pro for full PDF tools.'
        },
        {
            q: 'Does converting to PDF reduce the quality of my JXL images?',
            a: 'Slightly, by design. PDF readers cannot show JPEG XL data, so each image is re-encoded as a high-quality standard JPEG and placed on its own page. The pages look the same on screen and print cleanly, but they are not the original JXL pixels, and transparency or extra bit depth is not carried across. Keep the JXL files if you need them preserved.'
        },
        {
            q: 'Are the JXL files embedded as JXL inside the PDF?',
            a: 'No. Each image is stored as a standard JPEG so the PDF opens in every reader today. JPEG XL inside PDF is not something readers support yet, which is exactly why this page exists.'
        },
        {
            q: 'Can I mix JXL with other formats?',
            a: 'Yes. Add .jxl, PNG, JPG, WebP, AVIF and HEIC files together; each becomes one page, in the order you add them.'
        },
        {
            q: 'How many images can I combine?',
            a: 'Up to 20 files per PDF on this page. The free allowance builds a PDF of up to 3 pages; full PDF tools are part of Seller and Pro.'
        },
        {
            q: 'How do I open a JXL file without converting it?',
            a: [
                'Support is still uneven: some browsers, image viewers and photo tools read JXL, many do not. ',
                { href: '/guides/what-is-a-jxl-file', label: 'What is a JXL file?' },
                ' lists what opens one today, and the ',
                { href: '/jpg-to-jpegxl', label: 'JPG to JXL converter' },
                ' goes the other way if you want to make JXL files.'
            ]
        },
        {
            q: 'What happens to my files?',
            a: 'They travel over HTTPS to api.mochify.app, the PDF is built in memory, and everything is wiped as soon as your download is ready. Nothing is written to disk and no logs contain your image data.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify JXL to PDF Converter',
        url: 'https://mochify.app/solutions/jxl-to-pdf',
        applicationCategory: 'MultimediaApplication',
        applicationSubCategory: 'Image Converter',
        operatingSystem: 'Web',
        description: metaDescription,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        },
        featureList: [
            'Combine up to 20 JXL images into one PDF',
            'One page per image, in upload order',
            'Also accepts PNG, JPG, WebP, AVIF and HEIC',
            'Images stored as standard JPEG so the PDF opens anywhere',
            'Built in memory, never saved to disk',
            'No signup for the first PDF'
        ],
        softwareRequirements: 'Modern Web Browser'
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };
</script>

<svelte:head>
    <title>JXL to PDF Converter - Free, Online, No Signup | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="JXL to PDF Converter - Mochify" />
    <meta property="og:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F3F0FF] border border-[#DDD6FE] shadow-sm text-[#6D28D9] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    Images to PDF
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-100 shadow-sm text-amber-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Opens anywhere
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert
                <span class="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    JXL
                </span>
                to
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    PDF
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Drop JPEG XL images here and get one PDF back, a page per image in the order you added them, up to 20 files at a time. Each image is stored in the PDF as a standard JPEG, so the document opens in any PDF reader, mail client or print shop, including the many that cannot open a .jxl file at all. The PDF is built in memory at api.mochify.app and wiped as soon as your download is ready.
            </p>
        </div>

        <div class="mb-16">
            <ImagesToPdf
                accept=".jxl,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif,.hif,image/jxl,image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
                formatLabel="JPEG XL"
                downloadName="mochified.pdf"
            />
        </div>

        <!-- How it works -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">How it works</h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each [
                    { n: '1', t: 'Add your images', d: 'Drop in JXL files, or mix in PNG, JPG, WebP, AVIF and HEIC; each becomes one page, in the order you add them.' },
                    { n: '2', t: 'Let it run', d: 'There is almost nothing to set: this page does one job, images to a single PDF. Pages fit each image exactly by default; choose A4 or Letter if the PDF is headed for a printer.' },
                    { n: '3', t: 'Download the PDF', d: 'One file, ready to send.' },
                ] as step}
                    <div class="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-50 text-amber-600 font-black text-sm mb-4">{step.n}</span>
                        <h3 class="font-black text-[#4A2C2C] text-sm mb-1.5">{step.t}</h3>
                        <p class="text-sm text-[#6C3F31] leading-relaxed opacity-90">{step.d}</p>
                    </div>
                {/each}
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">What is in the PDF</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            PDF readers cannot display JPEG XL data yet, so this page does not embed your .jxl files as they are. Each image is decoded and re-encoded as a baseline JPEG at high quality, then placed on its own page. That is a lossy step: the pages look the same on screen and print cleanly, but they are not the original JXL pixels, and features JPEG cannot hold, such as an alpha channel or more than 8 bits per channel, are not carried into the PDF. If you need the JXL files themselves preserved, send them alongside the PDF; the PDF is the version everyone can open. Our <a href="/guides/jpeg-in-2026-jpegli" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">jpegli guide</a> explains why a modern JPEG encode holds up so well, and <a href="/guides/what-is-a-jxl-file" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">What is a JXL file?</a> covers the format the pages started as.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">When JXL to PDF is the right move</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Almost nothing outside a browser or a specialist viewer opens a .jxl file: mail clients, print shops, document tools and most operating-system viewers will not. Wrapping a set of JXL images in a PDF gives them universal reach in one file that keeps its page order. Typical uses: sending JXL exports from a photo tool to a client, a portable single-file version of an image set, proofs for a printer, screenshots or UI captures bundled into one document, and anything a recipient cannot open as JXL. Prefer a JPEG per image instead of a document? Convert back with the CLI or API, described below.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Limits, bulk and automation</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Your first PDF needs no account; a free account or no-signup session builds a PDF of up to 3 pages, and full PDF tools are part of Seller and Pro. This page takes up to 20 files per PDF. The same in-memory model applies to the CLI (<code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify</code>, sign in once with <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify auth login</code>), the hosted and local MCP servers and the REST API, which also handle PDF work through <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">POST /v1/pdf</code>; full reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>. Every route converts at api.mochify.app in memory, keeps nothing on disk and writes no logs containing your data.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl font-bold text-[#4A2C2C] mb-4">Frequently asked questions</h2>
                    <FaqAccordion {faqs} />
                </div>
            </div>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/solutions/webp-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">WebP to PDF →</p>
                        <p class="text-xs text-[#875F42]">Combine WebP images into a single multi-page PDF</p>
                    </div>
                </a>
                <a href="/solutions/heif-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center flex-shrink-0 border border-pink-100">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 9l1.5 1.5 3-3.75" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIC to PDF →</p>
                        <p class="text-xs text-[#875F42]">Bundle iPhone photos into one PDF</p>
                    </div>
                </a>
                <a href="/solutions/png-to-jxl" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">PNG to JXL →</p>
                        <p class="text-xs text-[#875F42]">One high-quality JPEG XL encode per PNG</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
