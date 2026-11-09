<script lang="ts">
    import ImagesToPdf from '$lib/components/ImagesToPdf.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Merge JFIF images into one PDF online, a page per image in the order you add them. Mix in JPG, PNG, WebP or HEIC. Free, no signup, never saved to disk.';

    const faqs: FaqItem[] = [
        {
            q: 'Is this JFIF to PDF converter free?',
            a: [
                'Yes. Without an account or on a free account, you can build a PDF from up to 3 images. A paid plan, or a $2 Day Pass with no account, takes up to 20 images per PDF; the ',
                { href: '/pricing', label: 'pricing page' },
                ' has the plans.'
            ]
        },
        {
            q: 'Do I need an account?',
            a: 'No. JFIF to PDF works without signing up, within the same free limits as any other conversion, and a PDF can hold up to 3 images. A free account gives you more conversions each month, not more pages per PDF; a paid plan or a Day Pass takes up to 20 images per PDF.'
        },
        {
            q: 'What is a JFIF file?',
            a: [
                'A JPEG. JFIF (JPEG File Interchange Format) is the layout most JPEG files have always used, and Windows often gives the .jfif extension to JPEGs saved from a browser. Only the extension differs from a .jpg; if you need a single image rather than a PDF, ',
                { href: '/solutions/jfif-to-jpg', label: 'JFIF to JPG' },
                ' fixes the extension.'
            ]
        },
        {
            q: 'How many images can I combine?',
            a: 'Up to 20 per PDF on any paid plan, Growth included, and on a Day Pass. The free plan takes 3, with or without a free account. Each image becomes one page, in the order you add them.'
        },
        {
            q: 'Does converting JFIF to PDF reduce quality?',
            a: 'Slightly, and rarely visibly. Each image is decoded and re-encoded as a high-quality JPEG with jpegli before it goes on the page, rather than copied in byte for byte, so the pages look the same on screen and print cleanly but are a fresh encode. Keep the JFIF files if you need the exact originals.'
        },
        {
            q: 'Can I mix JFIF with other formats?',
            a: 'Yes. Add JPG, PNG, WebP, AVIF, HEIC or JXL files alongside your JFIF images; each becomes one page, in the order you add them.'
        },
        {
            q: 'What page size do I get?',
            a: 'Each page fits its image exactly by default, with no border. Choose A4 or Letter after adding your files if you are going to print.'
        },
        {
            q: 'What happens to my files?',
            a: 'They are sent to api.mochify.app, the PDF is built in memory, and the images are discarded once the PDF is returned. Nothing is written to disk, no logs contain your data, and your files are never used to train AI.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'JFIF to PDF Converter',
        description: metaDescription,
        url: 'https://mochify.app/solutions/jfif-to-pdf',
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
    <title>JFIF to PDF Converter - Free Online, No Signup | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-violet text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    Images → PDF
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-green text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Multi-page
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-pink text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-cocoa-ink tracking-tight">
                <span class="bg-gradient-to-r from-mochi-pink-soft to-mochi-pink bg-clip-text text-transparent">
                    JFIF
                </span>
                to
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    PDF
                </span>
                Converter
            </h1>

            <p class="text-lg text-cocoa-deep font-medium max-w-2xl mx-auto leading-relaxed text-balance">
                Drop .jfif images here and get one PDF back, a page per image in the order you added them, up to 20 files at a time on a paid plan or Day Pass (3 on the free plan). The PDF opens in any reader, mail client or print shop, and goes through upload forms that ask for a PDF and turn a .jfif away. It is built in memory at api.mochify.app and wiped as soon as your download is ready.
            </p>
        </div>

        <div class="mb-16">
            <ImagesToPdf />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-cocoa-ink mb-6">How to convert JFIF to PDF</h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each [
                    { n: '1', t: 'Add your images', d: 'Drop in .jfif files, or mix in JPG, PNG, WebP, AVIF, HEIC or JXL; each becomes one page, in the order you add them.' },
                    { n: '2', t: 'Pick a page size', d: 'Pages fit each image exactly by default, with no white border. Choose A4 or Letter if the PDF is headed for a printer. There is nothing else to set: this page does one job.' },
                    { n: '3', t: 'Download the PDF', d: 'One file, ready to send.' },
                ] as step}
                    <div class="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#F3F0FF] text-[#6D28D9] font-black text-sm mb-4">{step.n}</span>
                        <h3 class="font-bold text-cocoa-ink text-sm mb-1.5">{step.t}</h3>
                        <p class="text-sm text-cocoa-deep leading-relaxed opacity-90">{step.d}</p>
                    </div>
                {/each}
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-cocoa-ink">What is in the PDF</h2>
                    <p class="leading-relaxed text-cocoa-deep">
                        A JFIF is already a JPEG, and JPEG is what images inside a PDF are stored as. Each image is still decoded and re-encoded with jpegli at high quality as a baseline JPEG, the variant every PDF reader can show, then placed on its own page. Two things to know:
                    </p>
                    <ul class="space-y-3">
                        <li class="flex gap-3 text-cocoa-deep leading-relaxed">
                            <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#C4B5FD] shrink-0"></span>
                            <span><strong class="text-cocoa-ink">Pages come out the right way up.</strong> A photo that carries a rotation flag is turned upright before it goes on the page, so nothing arrives sideways.</span>
                        </li>
                        <li class="flex gap-3 text-cocoa-deep leading-relaxed">
                            <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#C4B5FD] shrink-0"></span>
                            <span><strong class="text-cocoa-ink">Page size follows the image.</strong> Every pixel is kept, so by default a large photo makes a large page. Choose A4 or Letter for a document meant for paper.</span>
                        </li>
                    </ul>
                    <p class="leading-relaxed text-cocoa-deep">
                        The PDF carries the pictures only, with no metadata, so keep the originals if you need them.
                    </p>
                </div>

                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-cocoa-ink">When JFIF to PDF is the right move</h2>
                    <p class="leading-relaxed text-cocoa-deep">
                        Plenty of forms, portals and print shops ask for one PDF, and the .jfif extension that Windows gives to images saved from a browser is one they often refuse. A PDF holds a set of images as one file in a fixed order: scanned receipts, ID photos for an application, screenshots for a report, pages of a document you photographed. If you only need one image with an extension every upload box accepts, use <a href="/solutions/jfif-to-jpg" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">JFIF to JPG</a> instead.
                    </p>
                </div>
            </div>
        </section>

        <section class="mt-20 max-w-3xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-cocoa-ink">Converting JFIF to PDF on Windows or Mac</h2>
            <p class="leading-relaxed text-cocoa-deep">For a single image, the tools already on your computer will do it:</p>
            <ul class="space-y-3">
                {#each [
                    { p: 'Windows:', d: 'open the JFIF in the Photos app or your browser, press Ctrl+P and choose Microsoft Print to PDF.' },
                    { p: 'Mac:', d: 'open the JFIF in Preview, then File, Print, and Save as PDF.' },
                ] as route}
                    <li class="flex gap-3 text-cocoa-deep leading-relaxed">
                        <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#C4B5FD] shrink-0"></span>
                        <span><strong class="text-cocoa-ink">{route.p}</strong> {route.d}</span>
                    </li>
                {/each}
            </ul>
            <p class="leading-relaxed text-cocoa-deep">
                For a batch, a mix of formats, or a computer where you cannot install anything, drop the lot here and get one PDF in any browser.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-cocoa-ink">Limits, bulk and automation</h2>
            <p class="leading-relaxed text-cocoa-deep">
                Your first PDF needs no account. Without an account or on a free account, a PDF can hold up to 3 images; every paid plan, Growth included, and the Day Pass take up to 20 images per PDF on this page.
            </p>
            <p class="leading-relaxed text-cocoa-deep">
                Building a PDF from images is also available on the hosted MCP server and the REST API, through <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">POST /v1/pdf</code>; full reference in the <a href="/docs" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">API documentation</a>. Through the API, Growth builds PDFs from up to 200 images. Every route builds the PDF at api.mochify.app in memory, keeps nothing on disk and writes no logs containing your data.
            </p>
            <p class="leading-relaxed text-cocoa-deep">
                To build the same PDF from a script, send the images with <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">op=create</code>; each image becomes one page, in the order you send them:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/pdf?op=create" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  -F "images=@page1.jfif" \
  -F "images=@page2.jfif" \
  -F "images=@page3.jfif" \
  --output pages.pdf</code></pre>
            <p class="leading-relaxed text-cocoa-deep">
                Add <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">page=a4</code> or <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">page=letter</code> for a standard sheet. Building a PDF from images works on every plan, including Free.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-cocoa-ink mb-6">Frequently asked questions</h2>
            <FaqAccordion {faqs} class="grid md:grid-cols-2 gap-4 items-start" />
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-cocoa-milk uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-2 gap-4">
                <a href="/solutions/jfif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">JFIF to JPG →</p>
                        <p class="text-xs text-cocoa-milk">Standard .jpg files every upload box accepts</p>
                    </div>
                </a>
                <a href="/solutions/jfif-to-png" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">JFIF to PNG →</p>
                        <p class="text-xs text-cocoa-milk">Lossless PNGs for apps and forms that ask for PNG</p>
                    </div>
                </a>
                <a href="/solutions/heif-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">HEIC and HEIF to PDF →</p>
                        <p class="text-xs text-cocoa-milk">Bundle iPhone photos into a single multi-page PDF</p>
                    </div>
                </a>
                <a href="/solutions/webp-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">WebP to PDF →</p>
                        <p class="text-xs text-cocoa-milk">Combine WebP images into a single multi-page PDF</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
