<script lang="ts">
    import ImagesToPdf from '$lib/components/ImagesToPdf.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Turn HEIC photos from an iPhone or iPad, or HEIF files from any source, into one PDF with a page per photo. Free, no signup, never saved to disk.';

    const faqs: FaqItem[] = [
        {
            q: 'Is this HEIC to PDF converter free?',
            a: [
                'Yes. Without an account or on a free account, you can build a PDF from up to 3 photos. A paid plan, or a $2 Day Pass with no account, takes up to 20 photos per PDF; the ',
                { href: '/pricing', label: 'pricing page' },
                ' has the plans.'
            ]
        },
        {
            q: 'Do I need an account?',
            a: 'No. HEIC/HEIF to PDF works without signing up, within the same free limits as any other conversion, and a PDF can hold up to 3 photos. A free account gives you more conversions each month, not more pages per PDF; a paid plan or a Day Pass takes up to 20 photos per PDF.'
        },
        {
            q: 'How many photos can I combine?',
            a: 'Up to 20 per PDF on any paid plan, Growth included, and on a Day Pass. The free plan takes 3, with or without a free account. Each photo becomes one page, in the order you add them.'
        },
        {
            q: 'Does converting HEIC to PDF reduce quality?',
            a: 'Slightly. A PDF cannot hold HEIC data, so each photo is re-encoded as a high-quality JPEG before it goes on the page. The pages look the same on screen and print cleanly, but they carry 8 bits per channel rather than 10, and an HDR photo becomes a standard-range page.'
        },
        {
            q: 'Is HEIF better quality than JPEG?',
            a: 'At the same file size, usually yes: HEIF compresses more efficiently than JPEG and can hold 10-bit color and HDR. That is why iPhones save HEIC by default. The catch is compatibility, which is the reason to put the photos in a PDF, where every page is a JPEG that any reader can open.'
        },
        {
            q: 'How do I turn HEIC photos into a PDF on my iPhone?',
            a: [
                'In Photos, select the photos, tap Share, then Print, pinch outward on the preview and save the result to Files. For photos already in Files, select them, tap More and choose Create PDF. Our ',
                { href: '/guides/heic-to-pdf-iphone-photos', label: 'HEIC to PDF guide' },
                ' has the full steps for iPhone, Mac and Windows.'
            ]
        },
        {
            q: 'Can I use HIF files from a Canon, Sony or Fujifilm camera?',
            a: [
                'Yes, this page accepts .hif files. For camera work you usually want a JPG per frame rather than a PDF, though: ',
                { href: '/solutions/hif-to-jpg', label: 'HIF to JPG' },
                ' converts them and is built for camera files.'
            ]
        },
        {
            q: 'What happens to my photos?',
            a: 'They are sent to api.mochify.app, the PDF is built in memory, and the photos are discarded once the PDF is returned. Nothing is written to disk, no logs contain your data, and your photos are never used to train AI. Location and camera metadata are not copied into the PDF.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'HEIC and HEIF to PDF Converter',
        description:
            'Turn HEIC and HEIF photos into one multi-page PDF, one JPEG page per photo, with fit, A4 or Letter pages. Free, no signup, processed in memory.',
        url: 'https://mochify.app/solutions/heif-to-pdf',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@type': 'Organization', name: 'Mochify', url: 'https://mochify.app' }
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };
</script>

<svelte:head>
    <title>HEIC and HEIF to PDF Converter - Free, No Signup | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="HEIC and HEIF to PDF Converter - Mochify" />
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:title" content="HEIC and HEIF to PDF Converter - Mochify" />
    <meta name="twitter:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

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
                Convert
                <span class="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    HEIC and HEIF
                </span>
                to
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    PDF
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Drop HEIC or HEIF photos here and get one PDF back, a page per photo in the order you added them, up to 20 files at a time on a paid plan or Day Pass (3 on the free plan). Each photo is stored in the PDF as a standard JPEG, so the document opens on Windows, Android, in any mail client and at any print shop, including the ones that reject a .heic file. The PDF is built in memory at api.mochify.app and wiped as soon as your download is ready.
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
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">How to convert HEIC to PDF</h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each [
                    { n: '1', t: 'Add your photos', d: 'Drop in .heic or .heif files, or mix in JPG, PNG, WebP, AVIF or JXL; each becomes one page, in the order you add them.' },
                    { n: '2', t: 'Pick a page size', d: 'Pages fit each photo exactly by default, with no white border. Choose A4 or Letter if the PDF is headed for a printer. There is nothing else to set: this page does one job.' },
                    { n: '3', t: 'Download the PDF', d: 'One file, ready to send.' },
                ] as step}
                    <div class="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-black text-sm mb-4">{step.n}</span>
                        <h3 class="font-black text-[#4A2C2C] text-sm mb-1.5">{step.t}</h3>
                        <p class="text-sm text-[#6C3F31] leading-relaxed opacity-90">{step.d}</p>
                    </div>
                {/each}
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Which file have you got?</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                HEIC and HEIF are the same format family (the HEIF container, ISO/IEC 23008-12), and this page takes both. Where the file came from decides what else is worth knowing:
            </p>
            <ul class="space-y-3">
                <li class="flex gap-3 text-[#6C3F31] leading-relaxed">
                    <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span><strong class="text-[#4A2C2C]">.HEIC</strong> is what an iPhone or iPad saves by default. If you are here with phone photos, this is the right tool, and there is a built-in route on the phone too (below).</span>
                </li>
                <li class="flex gap-3 text-[#6C3F31] leading-relaxed">
                    <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span><strong class="text-[#4A2C2C]">.heif</strong> with nothing else to go on can come from an Android phone's high-efficiency photo setting or from another app. It converts the same way.</span>
                </li>
                <li class="flex gap-3 text-[#6C3F31] leading-relaxed">
                    <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span><strong class="text-[#4A2C2C]">.HIF</strong> is what Canon, Sony and Fujifilm cameras write in HEIF mode. This page accepts it, but camera files usually need a JPG per frame for editing or delivery rather than a PDF: <a href="/solutions/hif-to-jpg" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">HIF to JPG</a> is built for that.</span>
                </li>
            </ul>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">What is in the PDF</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        A PDF cannot hold HEIC data, so each photo is decoded and re-encoded as a high-quality JPEG with jpegli, then placed on its own page. The pages look the same on screen and print cleanly, but two things a HEIC can hold do not make the trip:
                    </p>
                    <ul class="space-y-3">
                        <li class="flex gap-3 text-[#6C3F31] leading-relaxed">
                            <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                            <span><strong class="text-[#4A2C2C]">10-bit color.</strong> JPEG inside a PDF has 8 bits per channel, 256 steps instead of the 1,024 a 10-bit photo can store. On screen and on paper this rarely shows.</span>
                        </li>
                        <li class="flex gap-3 text-[#6C3F31] leading-relaxed">
                            <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                            <span><strong class="text-[#4A2C2C]">HDR.</strong> An HDR photo becomes a standard-range page.</span>
                        </li>
                    </ul>
                    <p class="leading-relaxed text-[#6C3F31]">
                        Portrait photos stay upright, every pixel is kept, and the PDF carries the pictures only: location and camera metadata are not copied into it. Send the original HEIC files alongside if you need them.
                    </p>
                </div>

                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">When a PDF is the right move</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        A .heic file opens reliably on Apple devices and not much else: Windows needs extra extensions, and many upload forms and print shops refuse it. A PDF opens everywhere and holds a set of photos as one file in a fixed order: photos for someone on Windows or Android, a portal that only takes PDF, a print order, receipts shot on the phone. If you need separate images instead, <a href="/heic-to-jpeg" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">HEIC to JPG</a> converts each photo to a JPG.
                    </p>
                </div>
            </div>
        </section>

        <section class="mt-20 max-w-3xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Converting HEIC to PDF on iPhone, Mac or Windows</h2>
            <ul class="space-y-3">
                <li class="flex gap-3 text-[#6C3F31] leading-relaxed">
                    <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span><strong class="text-[#4A2C2C]">iPhone or iPad:</strong> in Photos, select the photos, tap Share, then Print, pinch outward on the preview and save the result to Files. For photos already in Files, select them, tap More and choose Create PDF.</span>
                </li>
                <li class="flex gap-3 text-[#6C3F31] leading-relaxed">
                    <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span><strong class="text-[#4A2C2C]">Mac:</strong> select the photos in Finder, right-click, then Quick Actions and Create PDF.</span>
                </li>
                <li class="flex gap-3 text-[#6C3F31] leading-relaxed">
                    <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span><strong class="text-[#4A2C2C]">Windows:</strong> Windows needs Microsoft's HEIF Image Extensions and HEVC Video Extensions ($0.99) to open a HEIC at all. With both installed, select the photos in File Explorer, choose Print and pick Microsoft Print to PDF.</span>
                </li>
            </ul>
            <p class="leading-relaxed text-[#6C3F31]">
                <a href="/guides/heic-to-pdf-iphone-photos" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">How to convert iPhone photos (HEIC) to PDF</a> walks through each route, including batches of 50 photos. This page is the shortcut on a computer without the extensions, for a mix of formats, or for one PDF from any browser.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Limits, bulk and automation</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                Your first PDF needs no account. Without an account or on a free account, a PDF can hold up to 3 photos; every paid plan, Growth included, and the Day Pass take up to 20 photos per PDF on this page.
            </p>
            <p class="leading-relaxed text-[#6C3F31]">
                Building a PDF from images is also available on the hosted MCP server and the REST API, through <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">POST /v1/pdf</code>; full reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>. Through the API, Growth builds PDFs from up to 200 images. Every route builds the PDF at api.mochify.app in memory, keeps nothing on disk and writes no logs containing your data.
            </p>
            <p class="leading-relaxed text-[#6C3F31]">
                To build the same PDF from a script, send the photos with <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">op=create</code>; each becomes one page, in the order you send them:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/pdf?op=create" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  -F "images=@IMG_0001.heic" \
  -F "images=@IMG_0002.heic" \
  -F "images=@IMG_0003.heic" \
  --output photos.pdf</code></pre>
            <p class="leading-relaxed text-[#6C3F31]">
                Add <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">page=a4</code> or <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">page=letter</code> for a standard sheet. Building a PDF from images works on every plan, including Free.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">Frequently asked questions</h2>
            <FaqAccordion {faqs} class="grid md:grid-cols-2 gap-4 items-start" />
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
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIC to JPG →</p>
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
