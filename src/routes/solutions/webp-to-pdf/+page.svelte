<script lang="ts">
    import ImagesToPdf from '$lib/components/ImagesToPdf.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Combine WebP images into one PDF, a page per image in the order you add them. Mix in PNG, JPG, AVIF or HEIC. Free, no signup, processed in memory and never saved to disk.';

    const faqs: FaqItem[] = [
        {
            q: 'Is this WebP to PDF converter free?',
            a: [
                'Yes. Without an account or on a free account, you can build a PDF from up to 3 images. A paid plan, or a $2 Day Pass with no account, takes up to 20 images per PDF; the ',
                { href: '/pricing', label: 'pricing page' },
                ' has the plans.'
            ]
        },
        {
            q: 'Do I need an account?',
            a: 'No. WebP to PDF works without signing up, within the same free limits as any other conversion, and a PDF can hold up to 3 images. A free account gives you more conversions each month, not more pages per PDF; a paid plan or a Day Pass takes up to 20 images per PDF.'
        },
        {
            q: 'How many images can I combine?',
            a: 'Up to 20 per PDF on any paid plan, Growth included, and on a Day Pass. The free plan takes 3, with or without a free account. Each image becomes one page, in the order you add them.'
        },
        {
            q: 'Does converting WebP to PDF reduce quality?',
            a: 'Slightly, and rarely visibly. A PDF cannot hold WebP data, so each image is re-encoded as a high-quality JPEG with jpegli before it goes on the page. Pages look the same on screen and print cleanly, but they are not the original WebP pixels, so keep the WebP files if you need them untouched.'
        },
        {
            q: 'What happens to a transparent WebP?',
            a: 'The transparent areas turn white. Images inside these PDFs are JPEGs, and JPEG has no alpha channel. If you need the cut-out kept, send the WebP or a PNG alongside the PDF.'
        },
        {
            q: 'Can I mix WebP with other formats?',
            a: 'Yes. Add PNG, JPG, AVIF, HEIC or JXL files alongside your WebP images; each becomes one page, in the order you add them.'
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
        name: 'WebP to PDF Converter',
        description:
            'Combine WebP images into one multi-page PDF, one JPEG page per image, with fit, A4 or Letter pages. Free, no signup, processed in memory.',
        url: 'https://mochify.app/solutions/webp-to-pdf',
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
    <title>WebP to PDF Converter - Combine WebP Images Into One PDF | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="WebP to PDF Converter - Mochify" />
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:title" content="WebP to PDF Converter - Mochify" />
    <meta name="twitter:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

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
                Convert
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    WebP
                </span>
                to
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    PDF
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Drop WebP images here and get one PDF back, a page per image in the order you added them, up to 20 files at a time on a paid plan or Day Pass (3 on the free plan). Each image is stored in the PDF as a standard JPEG, so the document opens in any PDF reader, mail client or print shop, including the ones that will not open a .webp file. The PDF is built in memory at api.mochify.app and wiped as soon as your download is ready.
            </p>
        </div>

        <div class="mb-16">
            <ImagesToPdf />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">How to convert WebP to PDF</h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each [
                    { n: '1', t: 'Add your images', d: 'Drop in WebP files, or mix in PNG, JPG, AVIF, HEIC or JXL; each becomes one page, in the order you add them.' },
                    { n: '2', t: 'Pick a page size', d: 'Pages fit each image exactly by default, with no white border. Choose A4 or Letter if the PDF is headed for a printer. There is nothing else to set: this page does one job.' },
                    { n: '3', t: 'Download the PDF', d: 'One file, ready to send.' },
                ] as step}
                    <div class="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#F3F0FF] text-[#6D28D9] font-black text-sm mb-4">{step.n}</span>
                        <h3 class="font-black text-[#4A2C2C] text-sm mb-1.5">{step.t}</h3>
                        <p class="text-sm text-[#6C3F31] leading-relaxed opacity-90">{step.d}</p>
                    </div>
                {/each}
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">What is in the PDF</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        A PDF cannot hold WebP data, so each image is decoded and re-encoded as a high-quality JPEG with jpegli, then placed on its own page. The pages look the same on screen and print cleanly, but they are not the original WebP pixels, and two things change:
                    </p>
                    <ul class="space-y-3">
                        <li class="flex gap-3 text-[#6C3F31] leading-relaxed">
                            <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#C4B5FD] shrink-0"></span>
                            <span><strong class="text-[#4A2C2C]">Transparency turns white.</strong> JPEG has no alpha channel, so the transparent parts of a logo, sticker or cut-out come out white. If that matters, send the WebP or a PNG alongside the PDF; <a href="/guides/webp-avif-transparency" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Do WebP and AVIF support transparency?</a> explains where a cut-out survives.</span>
                        </li>
                        <li class="flex gap-3 text-[#6C3F31] leading-relaxed">
                            <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#C4B5FD] shrink-0"></span>
                            <span><strong class="text-[#4A2C2C]">Page size follows the image.</strong> Every pixel is kept, so by default a large screenshot makes a large page. Choose A4 or Letter for a document meant for paper.</span>
                        </li>
                    </ul>
                    <p class="leading-relaxed text-[#6C3F31]">
                        The PDF carries the pictures only, with no WebP data and no metadata, so keep the originals if you need them.
                    </p>
                </div>

                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">When WebP to PDF is the right move</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        WebP is built for web pages and travels badly: plenty of mail clients, print shops and upload forms still refuse a .webp. A PDF opens anywhere and holds a set of images as one file in a fixed order: screenshots for a document, designs for a client, receipts, printer proofs, a portfolio. If you only need one image that opens anywhere, a JPG is lighter: <a href="/guides/save-webp-as-jpg-chrome" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">How to save WebP as JPG in Chrome</a> covers every route.
                    </p>
                </div>
            </div>
        </section>

        <section class="mt-20 max-w-3xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Converting WebP to PDF on Windows, Mac or iPhone</h2>
            <p class="leading-relaxed text-[#6C3F31]">For a single image, the tools already on your device will do it:</p>
            <ul class="space-y-3">
                {#each [
                    { p: 'Windows:', d: 'open the WebP in your browser or the Photos app, press Ctrl+P and choose Microsoft Print to PDF.' },
                    { p: 'Mac:', d: 'open the WebP in Preview, then File, Print, and Save as PDF.' },
                    { p: 'iPhone or iPad:', d: 'in the Files app, select the images, tap More and choose Create PDF.' },
                ] as route}
                    <li class="flex gap-3 text-[#6C3F31] leading-relaxed">
                        <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#C4B5FD] shrink-0"></span>
                        <span><strong class="text-[#4A2C2C]">{route.p}</strong> {route.d}</span>
                    </li>
                {/each}
            </ul>
            <p class="leading-relaxed text-[#6C3F31]">
                For a batch, a mix of formats, or a computer where you cannot install anything, drop the lot here and get one PDF in any browser.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Limits, bulk and automation</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                Your first PDF needs no account. Without an account or on a free account, a PDF can hold up to 3 images; every paid plan, Growth included, and the Day Pass take up to 20 images per PDF on this page.
            </p>
            <p class="leading-relaxed text-[#6C3F31]">
                Building a PDF from images is also available on the hosted MCP server and the REST API, through <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">POST /v1/pdf</code>; full reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>. Through the API, Growth builds PDFs from up to 200 images. Every route builds the PDF at api.mochify.app in memory, keeps nothing on disk and writes no logs containing your data.
            </p>
            <p class="leading-relaxed text-[#6C3F31]">
                To build the same PDF from a script, send the images with <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">op=create</code>; each image becomes one page, in the order you send them:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/pdf?op=create" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  -F "images=@page1.webp" \
  -F "images=@page2.webp" \
  -F "images=@page3.webp" \
  --output pages.pdf</code></pre>
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
                <a href="/solutions/remove-background-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">WebP Background Remover →</p>
                        <p class="text-xs text-[#875F42]">AI cutouts with a transparent WebP output</p>
                    </div>
                </a>
                <a href="/solutions/svg-to-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">SVG to WebP →</p>
                        <p class="text-xs text-[#875F42]">Rasterize vector assets to WebP with transparency</p>
                    </div>
                </a>
                <a href="/solutions/heif-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIC and HEIF to PDF →</p>
                        <p class="text-xs text-[#875F42]">Bundle iPhone photos into a single multi-page PDF</p>
                    </div>
                </a>
                <a href="/solutions/jxl-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">JPEG XL to PDF →</p>
                        <p class="text-xs text-[#875F42]">Combine JPEG XL images into a single multi-page PDF</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
