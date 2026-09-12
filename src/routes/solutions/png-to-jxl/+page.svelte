<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Convert PNG to JXL online in seconds: a high-quality JPEG XL encode by default, or switch Lossless on for a pixel-exact copy that is usually still smaller than the PNG. Up to 3 files with no signup, processed in memory and never saved to disk.';

    const faqs: FaqItem[] = [
        {
            q: 'Is this PNG to JXL converter free?',
            a: 'Yes, including lossless mode. Convert up to 3 files a month with no signup, or 25 a month with a free account, at up to 20MB per file. For bigger jobs, a $2 Day Pass covers 100 uploads in 24 hours, and Seller and Pro plans batch 25 files at a time.'
        },
        {
            q: 'Is the conversion lossless?',
            a: 'It can be. The default is a high-quality compressed encode, which makes the smallest file and looks the same on screen but is not pixel-exact. Switch Lossless on after uploading and the JXL reproduces your PNG pixel for pixel, usually still smaller than the PNG. Lossless takes longer on large files.'
        },
        {
            q: 'Which should I choose, lossless or compressed?',
            a: 'Lossless for logos, icons, design assets, screenshots you will keep editing and anything you would archive as PNG. Compressed for screenshots and UI exports you only need to look at, and for photos saved as PNG, where it makes a much smaller file. If in doubt, keep your original PNG and use compressed.'
        },
        {
            q: "Does the JXL keep my PNG's transparency?",
            a: 'Yes, in both modes. The alpha channel is carried through, so transparent backgrounds and soft edges come back as they were.'
        },
        {
            q: 'What is a JXL file?',
            a: [
                'A .jxl file is an image in the JPEG XL format, a newer format designed to compress better than JPEG, PNG and WebP. Our guide ',
                { href: '/guides/what-is-a-jxl-file', label: 'What is a JXL file?' },
                ' covers how to open one, which apps support it and when converting back to JPEG is the safer choice.'
            ]
        },
        {
            q: 'Can I use JXL files on my website?',
            a: [
                'Only with a fallback. Browser support is still partial, so serve JXL inside a picture element with an AVIF or WebP alternative, or keep JXL for pipelines and archives you control. The ',
                { href: '/guides/chrome-145-jpeg-xl-default', label: 'Chrome 145 and JPEG XL explainer' },
                ' has the current state of support.'
            ]
        },
        {
            q: 'Can I convert formats other than PNG here?',
            a: [
                'This page is tuned for PNG. For JPEGs use the ',
                { href: '/jpg-to-jpegxl', label: 'JPG to JXL converter' },
                ', and for AVIF files the ',
                { href: '/avif-to-jpegxl', label: 'AVIF to JXL converter' },
                '; each uses a path chosen for its input.'
            ]
        },
        {
            q: 'What happens to my files?',
            a: 'They travel over HTTPS to api.mochify.app, are converted in memory and wiped as soon as your download is ready. Nothing is written to disk and no logs contain your image data. Metadata is stripped by default, GPS included; if you need it kept, the Mochify web app has a Strip EXIF switch and the API takes stripExif=false.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify PNG to JXL Converter',
        url: 'https://mochify.app/solutions/png-to-jxl',
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
            'Convert PNG to JPEG XL in the browser',
            'High-quality compressed encode by default',
            'Optional pixel-exact lossless mode',
            'Up to 3 files with no signup',
            'Processed in memory, never saved to disk',
            'Metadata including GPS stripped by default',
            'Batch conversion of up to 25 files on paid plans'
        ],
        softwareRequirements: 'Modern Web Browser'
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };

    const formatRows = [
        {
            fmt: 'JXL (this page)',
            highlight: true,
            alpha: 'Yes',
            lossless: 'Yes, with the Lossless switch (compressed by default)',
            support: 'Partial',
            best: 'Archives and pipelines you control, smaller PNG replacements'
        },
        {
            fmt: 'AVIF',
            highlight: false,
            alpha: 'Yes',
            lossless: 'No',
            support: 'Broad',
            best: 'Live web delivery, best compression'
        },
        {
            fmt: 'WebP',
            highlight: false,
            alpha: 'Yes',
            lossless: 'No',
            support: 'Broad',
            best: 'CMSes, email, social, wide compatibility'
        },
        {
            fmt: 'PNG',
            highlight: false,
            alpha: 'Yes',
            lossless: 'It is lossless',
            support: 'Universal',
            best: 'Pixel-exact masters, print, legacy tools'
        }
    ];
</script>

<svelte:head>
    <title>PNG to JXL Converter (JPEG XL) - Lossless Option, Free, No Signup | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="PNG to JXL Converter - Mochify" />
    <meta property="og:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F3F0FF] border border-[#DDD6FE] shadow-sm text-[#6D28D9] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Lossless Option
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
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    PNG
                </span>
                to
                <span class="bg-gradient-to-r from-[#FDE68A] to-[#F59E0B] bg-clip-text text-transparent">
                    JXL
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Drop PNG files here and get JPEG XL (JXL) files back. By default each file gets one high-quality encode tuned for PNG content, which makes the smallest file; switch <strong class="text-[#7E685E]">Lossless</strong> on after uploading and the JXL reproduces your PNG pixel for pixel, usually still smaller than the original. Up to 3 files a month with no signup and 20MB per file, or 25 a month with a free account. Files are processed in memory at api.mochify.app and wiped the moment your download is ready.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload
                output="jxl"
                types=".PNG"
                showTypes={true}
                showExifOption={false}
                losslessDefault={false}
                showLosslessOption={true}
                compact
            />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">How to convert PNG to JXL</h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each [
                    { n: '1', t: 'Drop your PNGs', d: 'Drag up to 3 files onto the box, or click it to choose them. No account is needed for your first files.' },
                    { n: '2', t: 'Choose lossless if you need it', d: 'The default is a high-quality encode that makes the smallest file and looks the same on screen. Switch Lossless on if the JXL must match the PNG exactly, for archives, masters or graphics you will keep editing; it takes longer on large files. There is nothing else to set.' },
                    { n: '3', t: 'Download', d: 'Each JXL comes back in seconds, a little longer for big files in lossless mode.' },
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
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Lossless or compressed: which should you pick?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            <strong class="text-[#7E685E]">Lossless</strong> gives you the PNG's pixels back exactly, in a JXL that is typically smaller than the PNG, because JPEG XL's lossless coder handles flat color, sharp edges and text very efficiently. Pick it for logos, icons, design assets, screenshots you will keep editing, and anything you would otherwise archive as PNG. It is the slower path and the difference shows on large files. Sixteen-bit PNGs stay 16-bit.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            <strong class="text-[#7E685E]">Compressed</strong> (the default) re-encodes the pixels with one high-quality setting chosen for PNG content. The result looks the same on screen and is a good deal smaller again than lossless, which is what you want for screenshots and UI exports you only need to look at, or photos that happen to be saved as PNG. It is not a pixel-exact copy, so keep the PNG if you might need one later.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Transparency is carried through in both modes: a PNG with a transparent background comes back as a JXL with the same alpha channel, so icons and cut-outs keep their edges.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Metadata is stripped by default, GPS included, with nothing to set for it on this page. If you need the file's metadata kept, the Mochify web app has a Strip EXIF switch and the API takes stripExif=false.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Can you use a JXL file on the web today?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Not for every visitor yet. Browser support for JPEG XL is still uneven, so a JXL on a public page needs a fallback for browsers that cannot decode it. Our <a href="/guides/chrome-145-jpeg-xl-default" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Chrome 145 and JPEG XL explainer</a> has the current picture, and the <a href="/guides/converting-images-to-jpeg-xl#png-to-jxl" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">practical JPEG XL guide</a> covers the PNG path and the fallback pattern. Where JXL is already useful: image pipelines and tools that read it, internal archives that are not served to browsers, and anywhere you control the viewer. For live web delivery to a general audience, <a href="/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">AVIF or WebP</a> is still the safer choice, and JPEG remains the format that opens everywhere.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl font-bold text-[#4A2C2C] mb-4">Frequently asked questions</h2>
                    <FaqAccordion {faqs} />
                </div>
            </div>
        </section>

        <!-- Format comparison -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">PNG, JXL, AVIF or WebP: which one?</h2>
            <div class="overflow-x-auto rounded-2xl border border-pink-50 shadow-sm">
                <table class="w-full border-collapse text-sm">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Format</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Transparency</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Lossless on Mochify</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Browser support</th>
                            <th class="text-left px-5 py-4 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-50">Best for</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each formatRows as row, i}
                            <tr class={row.highlight ? 'bg-amber-50' : i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-5 py-3.5 font-black text-[#4A2C2C] border-b border-pink-50">{row.fmt}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.alpha}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.lossless}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.support}</td>
                                <td class="px-5 py-3.5 text-[#6C3F31] border-b border-pink-50">{row.best}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Bulk / automation -->
        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Bulk, batch and automated PNG to JXL</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                Seller and Pro accounts convert up to 25 files per batch at up to 75MB each, and a <a href="/pricing" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Day Pass</a> gives you 100 uploads in 24 hours for $2 with no account. The same conversion runs from the terminal with the Mochify CLI (<code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify</code>, sign in once with <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify auth login</code>), from an AI agent through the hosted or local MCP server, and from the REST API:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jxl" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @screenshot.png \
  -o screenshot.jxl</code></pre>
            <p class="leading-relaxed text-[#6C3F31]">
                The CLI, MCP and API are clients over the same encoder as this page: files travel over HTTPS to api.mochify.app, are converted in memory and discarded. Full parameter reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>. Lossless is available there too: add <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">&amp;lossless=1</code> to the same request. Coming from a JPEG instead? The <a href="/jpg-to-jpegxl" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">JPG to JXL converter</a> is the better starting point; from AVIF, use <a href="/avif-to-jpegxl" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">AVIF to JXL</a>.
            </p>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/jpg-to-jpegxl" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center flex-shrink-0 border border-pink-100">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">JPG to JXL →</p>
                        <p class="text-xs text-[#875F42]">Re-encode JPEGs as JPEG XL, one high-quality path</p>
                    </div>
                </a>
                <a href="/avif-to-jpegxl" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#6D28D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">AVIF to JXL →</p>
                        <p class="text-xs text-[#875F42]">Transcode AVIF to JPEG XL</p>
                    </div>
                </a>
                <a href="/solutions/jxl-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">JXL to PDF →</p>
                        <p class="text-xs text-[#875F42]">Bundle JXL images into one PDF</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
