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
        { name: 'AVIF to JXL' }
    ];

    const metaDescription =
        'Convert AVIF to JXL online in seconds: up to 3 files per session with no signup, one high-quality JPEG XL encode per file, processed in memory and never saved to disk. Nothing to install and nothing to set.';

    const faqs: FaqItem[] = [
        {
            q: 'Is this AVIF to JXL converter free?',
            a: 'Yes. Convert up to 3 files per session with no signup, or 25 a month with a free account, at up to 20MB per file. For bigger jobs, a $2 Day Pass covers 100 uploads in 24 hours, and Seller and Pro plans batch 25 files at a time.'
        },
        {
            q: 'Will I lose quality converting AVIF to JXL?',
            a: 'A little, by design. Both formats are lossy, so the AVIF is decoded and re-encoded as JPEG XL with one high-quality setting. The result looks the same on screen but is a second generation of a lossy file, not a lossless copy.'
        },
        {
            q: 'Is JXL the same as JPG?',
            a: 'No. JPEG XL is a newer format from the same standards group, designed to compress better than JPEG, PNG and WebP. A .jxl file needs software that understands it, whereas a .jpg opens everywhere.'
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
            q: 'Should I use AVIF or JXL on my website?',
            a: 'AVIF, for now: it is widely supported and compresses very well. JPEG XL needs a fallback for browsers that cannot decode it. Keep JXL for pipelines and archives you control.'
        },
        {
            q: 'Does the JXL keep HDR from my AVIF?',
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
            { '@type': 'ListItem', position: 3, name: 'AVIF to JXL', item: 'https://mochify.app/avif-to-jpegxl' }
        ]
    };

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify AVIF to JXL Converter',
        url: 'https://mochify.app/avif-to-jpegxl',
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
            'Convert AVIF to JPEG XL in the browser',
            'One high-quality encode per file, nothing to set',
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
    <title>AVIF to JXL Converter (JPEG XL) - Free, Online, No Signup | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="AVIF to JXL Converter - Mochify">
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
                    AVIF
                </span>
                to
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JXL
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Drop AVIF files here and get JPEG XL (JXL) files back: one high-quality encode per file, with nothing to set. Up to 3 files per session with no signup and 20MB per file, or 25 a month with a free account. Files are processed in memory at api.mochify.app and wiped the moment your download is ready.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload output="jxl" types=".AVIF" showTypes={false} />
        </div>

        <!-- How it works -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">How to convert AVIF to JXL</h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each [
                    { n: '1', t: 'Drop your AVIF files', d: 'Up to 3 per batch to start, no account needed.' },
                    { n: '2', t: 'Let it run', d: 'There is nothing to type and nothing to set: this page does one job, an AVIF to JXL conversion, and starts it as soon as the files land.' },
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
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">What an AVIF to JXL conversion actually does</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Both formats are lossy, so this is a decode and a re-encode: the AVIF is decoded to pixels, then encoded as JPEG XL using one high-quality setting. The result looks the same on screen, but it is a second generation, not the AVIF's original data, and it is not a lossless copy. Do it when you need JXL specifically, for a pipeline, a viewer or an archive that reads it, or when you want the JXL family's traits such as progressive decoding. Do not do it to "upgrade" an image you will keep serving as AVIF: AVIF is the better-supported format on the web today, and re-encoding a lossy file never adds detail. HDR is not carried across: on Mochify only JPG output carries an HDR gain map, so a JXL from this page comes back standard-range.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Metadata is stripped by default, GPS included, with nothing to set on this page. If you need it kept, the Mochify web app has a Strip EXIF switch and the API takes stripExif=false.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">AVIF or JXL: which should you keep?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            For a public website, AVIF: browser support is broad and its compression is excellent, which is why the <a href="/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">format guide</a> recommends it for live delivery. JPEG XL support is still uneven in browsers, so a JXL on a public page needs a fallback; the <a href="/guides/chrome-145-jpeg-xl-default" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Chrome 145 and JPEG XL explainer</a> has the current picture. The <a href="/guides/converting-images-to-jpeg-xl#avif-to-jxl" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">practical JPEG XL guide</a> covers the AVIF path and the fallback pattern. Need the universally compatible version instead? The <a href="/avif-to-jpg" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">AVIF to JPG converter</a> makes a jpegli-encoded JPEG that opens everywhere.
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
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Bulk, batch and automated AVIF to JXL</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                Seller and Pro accounts convert up to 25 files per batch at up to 75MB each, and a <a href="/pricing" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">Day Pass</a> gives you 100 uploads in 24 hours for $2 with no account. The same conversion runs from the terminal with the Mochify CLI (<code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify</code>, sign in once with <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify auth login</code>), from an AI agent through the hosted or local MCP server, and from the REST API:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jxl" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @image.avif \
  -o image.jxl</code></pre>
            <p class="leading-relaxed text-[#6C3F31]">
                Every route converts at api.mochify.app in memory and keeps nothing. Full parameter reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>.
            </p>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/avif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center flex-shrink-0 border border-pink-100">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">AVIF to JPG →</p>
                        <p class="text-xs text-[#875F42]">Convert AVIF to a JPEG that opens everywhere</p>
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
                <a href="/jpg-to-jpegxl" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#6D28D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">JPG to JXL →</p>
                        <p class="text-xs text-[#875F42]">Re-encode JPEGs as JPEG XL, one high-quality path</p>
                    </div>
                </a>
            </div>
        </section>
    </div>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>
