<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'Solutions', href: '/solutions' },
        { name: 'JPG to JXL' }
    ];

    const metaDescription =
        'Convert JPG to JXL online in seconds: up to 3 files per session with no signup, one high-quality JPEG XL re-encode per photo, processed in memory and never saved to disk. Nothing to install and nothing to set.';

    const faqs: FaqItem[] = [
        {
            q: 'Is this JPG to JXL converter free?',
            a: 'Yes. Convert up to 3 files per session with no signup, or 25 a month with a free account, at up to 20MB per file. For bigger jobs, a $2 Day Pass covers 100 uploads in 24 hours, and Seller and Pro plans batch 25 files at a time.'
        },
        {
            q: 'Is the conversion lossless? Can I get my original JPEG back?',
            a: "No. This page re-encodes the photo as JPEG XL with one high-quality setting, so the result is a second generation of a lossy file and cannot be turned back into the original JPEG byte for byte. JPEG XL's reversible JPEG transcode is not offered here; keep your JPEG masters if you need them."
        },
        {
            q: 'Is JXL the same as JPG?',
            a: 'No. JPEG XL is a newer format from the same standards group, designed to compress better than JPEG, PNG and WebP. A .jxl file needs software that understands it; a .jpg opens everywhere.'
        },
        {
            q: 'Is JXL better than JPG?',
            a: 'As a format, yes: better compression at the same quality, plus transparency, higher bit depth and progressive decoding. For compatibility, no: JPEG opens everywhere and JXL does not yet, so keep a JPEG or another fallback for anything public.'
        },
        {
            q: 'How do I open a JXL file?',
            a: [
                'Some browsers, image viewers and photo tools read JXL and many do not. ',
                { href: '/guides/what-is-a-jxl-file', label: 'What is a JXL file?' },
                ' lists what opens one today and how to convert back to JPEG when you need to.'
            ]
        },
        {
            q: 'Does the JXL keep HDR from my phone photos?',
            a: 'No. On Mochify only JPG output carries an HDR gain map; a JXL from this page is standard-range.'
        },
        {
            q: 'Do I need to set anything before converting?',
            a: 'No. This page has nothing to set: drop the files and the conversion starts. Metadata is stripped by default, GPS included. If you need it kept, the Mochify web app has a Strip EXIF switch and the API takes stripExif=false.'
        },
        {
            q: 'What happens to my files?',
            a: 'They travel over HTTPS to api.mochify.app, are converted in memory and wiped as soon as your download is ready. Nothing is written to disk and no logs contain your image data.'
        }
    ];

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mochify.app/' },
            { '@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://mochify.app/solutions' },
            { '@type': 'ListItem', position: 3, name: 'JPG to JXL', item: 'https://mochify.app/jpg-to-jpegxl' }
        ]
    };

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify JPG to JXL Converter',
        url: 'https://mochify.app/jpg-to-jpegxl',
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
            'Convert JPG to JPEG XL in the browser',
            'One high-quality re-encode per photo, nothing to set',
            'Up to 3 files per session with no signup',
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
</script>

<svelte:head>
    <title>JPG to JXL Converter (JPEG XL) - Free, Online, No Signup | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="JPG to JXL Converter - Mochify">
    <meta property="og:description" content={metaDescription}>

    {@html `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] min-h-screen flex flex-col">
    <Navigation />

    <div class="max-w-5xl mx-auto w-full pt-6">
        <Breadcrumb items={breadcrumbItems} />
    </div>

    <div class="relative max-w-5xl mx-auto px-4 pt-1 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">

            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Works on iPhone, Mac &amp; Windows
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    JPG
                </span>
                to
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JXL
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Drop JPEG photos here and get JPEG XL (JXL) files back: one high-quality re-encode per photo, with nothing to set. Up to 3 files per session with no signup and 20MB per file, or 25 a month with a free account. Files are processed in memory at api.mochify.app and wiped the moment your download is ready.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload output="jxl" types=".JPG, .JPEG" showTypes={false} />
        </div>

        <!-- How it works -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">How to convert JPG to JXL</h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each [
                    { n: '1', t: 'Drop your JPEGs', d: 'Up to 3 per batch to start, no account needed.' },
                    { n: '2', t: 'Let it run', d: 'There is nothing to type and nothing to set: this page does one job, a JPG to JXL conversion, and starts it as soon as the files land.' },
                    { n: '3', t: 'Download', d: 'Each JXL comes back in seconds.' },
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

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">This is a re-encode, not the lossless JPEG transcode</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            JPEG XL is known for a trick: it can repack an existing JPEG losslessly, smaller, and give the exact original JPEG back later. <strong class="text-[#7E685E]">This page does not do that.</strong> It decodes your JPEG to pixels and encodes them as JPEG XL with one high-quality setting. The result looks the same on screen and is usually smaller, but it is a second generation of a lossy file and it cannot be turned back into your original JPEG byte for byte. If you are archiving a photo library and want the reversible transcode, keep your JPEG masters and use a desktop tool that offers it; if you want a smaller, good-looking JXL for a pipeline or viewer that reads the format, this page is the quick way.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Metadata is stripped by default, GPS included, with nothing to set on this page. If you need the camera data kept, the Mochify web app has a Strip EXIF switch and the API takes stripExif=false.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Is JXL better than JPG?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            As a format, JPEG XL compresses photographs more efficiently than JPEG at the same visual quality and supports things JPEG cannot, such as transparency, higher bit depth and progressive decoding. As a file on the web, JPEG still wins on one thing that matters most: it opens everywhere, and JXL does not yet. So the honest answer is "better format, worse compatibility". The <a href="/guides/chrome-145-jpeg-xl-default" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Chrome 145 and JPEG XL explainer</a> has the current state of browser support, <a href="/guides/what-is-a-jxl-file" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">What is a JXL file?</a> covers which apps open one, and the <a href="/guides/converting-images-to-jpeg-xl#jpeg-to-jxl" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">practical JPEG XL guide</a> walks through the JPEG path and the fallback pattern. If what you actually need is a smaller JPEG rather than a new format, the <a href="/guides/jpeg-in-2026-jpegli" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">jpegli guide</a> explains how Mochify's JPEG encoder gets more quality per byte while staying a plain .jpg.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">HDR and what does not carry across</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            A JXL from this page is standard-range. On Mochify only JPG output carries an HDR gain map, so a phone photo with a gain map comes back as a normal-range JXL; use the <a href="/solutions/sdr-to-hdr" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">SDR to HDR page</a> if the HDR version is what you need.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl font-bold text-[#4A2C2C] mb-4">Frequently asked questions</h2>
                    <FaqAccordion {faqs} />
                </div>
            </div>
        </section>

        <!-- Bulk / automation -->
        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Bulk, batch and automated JPG to JXL</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                Seller and Pro accounts convert up to 25 files per batch at up to 75MB each, and a <a href="/pricing" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Day Pass</a> gives you 100 uploads in 24 hours for $2 with no account. The same conversion runs from the terminal with the Mochify CLI (<code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify</code>, sign in once with <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify auth login</code>), from an AI agent through the hosted or local MCP server, and from the REST API:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jxl" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @IMG_0001.jpg \
  -o IMG_0001.jxl</code></pre>
            <p class="leading-relaxed text-[#6C3F31]">
                Every route converts at api.mochify.app in memory and keeps nothing. Full parameter reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>. Have PNGs or AVIFs instead? <a href="/solutions/png-to-jxl" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">PNG to JXL</a> and <a href="/avif-to-jpegxl" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">AVIF to JXL</a> each use a path chosen for their input.
            </p>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/solutions/png-to-jxl" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">PNG to JXL →</p>
                        <p class="text-xs text-[#875F42]">One high-quality JPEG XL encode per PNG</p>
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
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center flex-shrink-0 border border-pink-100">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">JXL to PDF →</p>
                        <p class="text-xs text-[#875F42]">Bundle JXL images into one PDF</p>
                    </div>
                </a>
            </div>
        </section>
    </div>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>
