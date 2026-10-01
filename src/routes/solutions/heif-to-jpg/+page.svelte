<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Convert HEIF photos to JPG online, with .heif, .heic and .hif files in one batch. Free, no signup, processed in memory and never saved to disk.';

    // Extension triage. This is the reason this page exists separately from
    // /solutions/hif-to-jpg (pro cameras) and /heic-to-jpeg (Apple): people who
    // search "HEIF to JPG" often don't know which flavour they're holding, so the
    // page's job is to identify it and hand them to the right lane.
    const flavours = [
        {
            ext: '.HEIF',
            from: 'Desktop editors, Android handsets, and anything exporting to the plain standard',
            note: 'You are in the right place'
        },
        {
            ext: '.HEIC',
            from: 'iPhone and iPad, plus most photos shared out of iCloud',
            note: 'Works here, but the iPhone page has the Apple-specific notes',
            href: '/heic-to-jpeg',
            hrefLabel: 'HEIC to JPG'
        },
        {
            ext: '.HIF',
            from: 'Canon, Sony, and Fujifilm mirrorless bodies shooting 10-bit',
            note: 'Works here, but the camera page covers film sims and HDR PQ',
            href: '/solutions/hif-to-jpg',
            hrefLabel: 'HIF to JPG'
        }
    ];

    const openIssues = [
        {
            platform: 'Windows',
            detail: 'Needs two pieces: the HEIF Image Extension, free and bundled with Windows 11, plus the HEVC Video Extensions, which cost $0.99 in the Microsoft Store because of HEVC patent licensing. Without the second one, Photos opens the container and finds image data it cannot decode.',
            moreLabel: 'Full fix-by-fix walkthrough:',
            moreHref: 'https://mochify.app/guides/open-heif-files-on-windows',
            moreText: 'opening HEIF files on Windows'
        },
        {
            platform: 'Browsers',
            detail: 'Only Safari renders HEIF. Chrome, Edge, and Firefox have never shipped support in any version, so a HEIF dropped into a web page, a CMS, or a marketplace listing is a broken image for most of the internet.'
        },
        {
            platform: 'Linux',
            detail: 'Depends entirely on whether libheif is installed and built with an HEVC decoder. Distributions increasingly ship it, but plenty of image viewers still hand you a grey box.'
        },
        {
            platform: 'Older software',
            detail: 'Anything predating roughly 2018 has no concept of HEIF at all, which covers a lot of print shops, legacy CMS uploaders, and internal business tools.'
        }
    ];

    const faqs: FaqItem[] = [
        {
            q: 'Is HEIF the same thing as HEIC?',
            a: 'HEIF is the container standard, ISO/IEC 23008-12. HEIC is what Apple calls a HEIF file whose image data is HEVC-encoded. Camera makers call the same thing HIF. The wrapper is identical in all three cases, which is why one converter handles the lot.'
        },
        {
            q: 'Why does my HEIF open on my phone but not my laptop?',
            a: 'Phones ship a hardware HEVC decoder and the operating system wires it into the photo viewer. Desktops often have the hardware but not the licensed software decoder, so the file is readable as a container and unreadable as an image. Converting to JPG sidesteps the codec question entirely.'
        },
        {
            q: 'My iPhone photos say HEIF. Is this the right converter?',
            a: [
                'Yes, they convert here. An iPhone saves HEIF files as .heic, and some exports and downloads label them .heif; either way the file is the same container and this page reads it. The ',
                { href: '/heic-to-jpeg', label: 'HEIC to JPG page' },
                ' has the iPhone-specific notes, including how to stop the phone saving HEIC in the first place.'
            ]
        },
        {
            q: 'HEIF is a container, so what is actually inside it?',
            a: 'Usually HEVC, which is what makes licensing awkward. The same container can also hold AV1 data, in which case the file is what everyone calls AVIF, or even plain JPEG data. That is why "my HEIF will not open" has a different answer on different machines.'
        },
        {
            q: 'Will converting change how the photo looks?',
            a: 'JPEG is 8-bit, so a 10-bit HEIF loses tonal precision in principle. At sensible quality settings the difference is invisible in normal viewing. The exception is HDR source material, where mapping down to standard range is a genuine change in appearance rather than a rounding error.'
        },
        {
            q: 'Can I convert a folder of multiple HEIF files in one go?',
            a: 'Yes. Drop in multiple .heif files and every one comes back as a JPEG. Batch size depends on your plan.'
        },
        {
            q: 'What happens to my files after conversion?',
            a: 'They travel to our encoder over HTTPS, are streamed into memory, converted, and discarded. Nothing is written to disk and nothing is logged. Metadata is stripped by default, GPS included, so turn the Strip EXIF toggle off before converting if you need the camera data kept.'
        },
        {
            q: 'What does HEIF stand for?',
            a: "High Efficiency Image File Format. It is a container standard (ISO/IEC 23008-12) developed by MPEG, and Apple's .heic, the camera makers' .hif and the generic .heif are all HEIF files underneath."
        },
        {
            q: 'Is HEIF better quality than JPEG?',
            a: 'At the same file size, usually yes: the HEVC compression inside most HEIF files keeps more detail than JPEG and can store 10 bits per channel where JPEG stores 8, which is why a HEIF is often around half the size of a JPEG that looks the same. The catch is compatibility, not quality: a JPG opens everywhere and a HEIF does not. In normal viewing a converted photo looks the same; the tonal precision beyond 8 bits is what goes.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify HEIF to JPG Converter',
        operatingSystem: 'Any',
        applicationCategory: 'MultimediaApplication',
        applicationSubCategory: 'Image Converter',
        url: 'https://mochify.app/solutions/heif-to-jpg',
        description: metaDescription,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        },
        featureList: [
            'Fast browser-based .heif to .jpg conversion',
            'Batch convert multiple .heif files at once',
            'No Microsoft Store HEVC codec purchase required',
            'Optional EXIF and GPS stripping',
            'Processed in memory and discarded, never written to disk'
        ],
        softwareRequirements: 'Modern Web Browser'
    };

    // Built from the same `faqs` array the accordion renders, so the schema
    // cannot drift from the visible answers the way the hand-written block did.
    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };
</script>

<svelte:head>
    <title>HEIF to JPG Converter - Free, Online, No Signup | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="HEIF to JPG Converter - Mochify">
    <meta property="og:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

    <div class="text-center mb-12 space-y-6">
        <div class="flex flex-wrap justify-center gap-3">
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] shadow-sm text-[#4338CA] text-xs font-bold tracking-wide uppercase">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11v6m4-6v6m4-9V5.25A2.25 2.25 0 0015.75 3h-7.5A2.25 2.25 0 006 5.25V8m-2.25 0h16.5" /></svg>
                Every HEIF Variant
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Never Saved to Disk
            </span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
            Convert
            <span class="bg-gradient-to-r from-[#A5B4FC] to-[#6366F1] bg-clip-text text-transparent">
                HEIF
            </span>
            to
            <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                JPG
            </span>
        </h1>

        <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
            Universal converter for the HEIF standard. Convert <strong class="text-[#4A2C2C]">.heif</strong> images from desktop editors, phones and image pipelines to JPG, with .heic and .hif files welcome in the same batch. No codec purchase, no software install.
        </p>
    </div>

    <div class="mb-16">
        <!-- quality=85, matching /solutions/hif-to-jpg: same camera source, same
             second-lossy-pass problem, so the two pages should not diverge. Core
             defaults to 65 when this is absent. -->
        <ImageUpload types=".HEIF, .HEIC, .HIF" output="jpg" showTypes={false} queryParams="photography=1&quality=85" showExifOption={true} showDayPass={true} />
    </div>

    <section class="mt-10 max-w-4xl mx-auto">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">How to convert HEIF to JPG</h2>
        <ol class="space-y-4">
            <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                <span class="shrink-0 w-8 h-8 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] font-black text-sm flex items-center justify-center">1</span>
                <p class="leading-relaxed text-[#6C3F31]">
                    <strong class="text-[#4A2C2C]">Drop your files</strong> in the box above, or click browse. .heif, .heic and .hif files can go in the same batch: up to 3 files per batch with no signup or on a free account, 25 per batch on Seller and Pro.
                </p>
            </li>
            <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                <span class="shrink-0 w-8 h-8 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] font-black text-sm flex items-center justify-center">2</span>
                <p class="leading-relaxed text-[#6C3F31]">
                    <strong class="text-[#4A2C2C]">Choose whether to keep the metadata.</strong> Once your files are in, a Strip EXIF switch appears; that is the only choice on this page. Each file is then decoded and re-encoded as a JPG with Google's jpegli encoder.
                </p>
            </li>
            <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                <span class="shrink-0 w-8 h-8 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] font-black text-sm flex items-center justify-center">3</span>
                <p class="leading-relaxed text-[#6C3F31]">
                    <strong class="text-[#4A2C2C]">Download your JPGs.</strong> They open in Windows Photos, Preview, every browser and every upload form, none of which need to know what HEIF is.
                </p>
            </li>
        </ol>
    </section>

    <!-- Extension triage: the anti-duplication centrepiece. Routes visitors to the
         Apple and pro-camera pages rather than competing with them. -->
    <section class="mt-20 max-w-4xl mx-auto">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-2">Which HEIF have you actually got?</h2>
        <p class="text-[#6C3F31] leading-relaxed mb-7 max-w-2xl">
            All three extensions below are the same container with different branding on the outside, and all three convert here. If your file came from one of the two specialist sources, those pages carry notes this one does not.
        </p>

        <div class="space-y-3">
            {#each flavours as flavour (flavour.ext)}
                <div class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                    <span class="shrink-0 inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] font-mono font-black text-sm sm:w-24">
                        {flavour.ext}
                    </span>
                    <p class="flex-1 text-sm text-[#6C3F31] leading-relaxed">
                        {flavour.from}
                    </p>
                    <div class="shrink-0 sm:text-right">
                        {#if flavour.href}
                            <a href={flavour.href} class="text-sm font-black text-[#F06292] hover:text-[#D81B60] transition-colors no-underline whitespace-nowrap">
                                {flavour.hrefLabel} →
                            </a>
                            <p class="text-xs text-[#875F42]/70 mt-0.5 max-w-[15rem]">{flavour.note}</p>
                        {:else}
                            <span class="inline-flex items-center gap-1.5 text-sm font-black text-[#33691E]">
                                <span class="w-2 h-2 rounded-full bg-[#81C784]"></span> {flavour.note}
                            </span>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <section class="mt-20 max-w-4xl mx-auto">
        <div class="space-y-8">
            <div class="space-y-4">
                <h2 class="text-2xl font-black text-[#4A2C2C]">Why HEIF files refuse to open</h2>
                <p class="leading-relaxed text-[#6C3F31]">
                    HEIF is only the wrapper. What sits inside is almost always <strong class="text-[#7E685E]">HEVC</strong>, a patent-encumbered codec, and that is the whole problem: your machine can read the container perfectly well and still have no legal right to decode the picture.
                </p>
                <p class="leading-relaxed text-[#6C3F31]">
                    This is why the same file opens instantly on a phone and shows a gray placeholder on a laptop. Converting to JPG removes the dependency rather than working around it, which is why it stays the fastest fix.
                </p>
            </div>

            <div class="grid sm:grid-cols-2 gap-3 items-start">
                {#each openIssues as issue (issue.platform)}
                    <div class="bg-white p-5 rounded-2xl border border-pink-50 shadow-sm">
                        <h3 class="font-black text-[#4A2C2C] text-sm mb-1.5">{issue.platform}</h3>
                        <p class="text-sm text-[#6C3F31] leading-relaxed opacity-90">
                            {issue.detail}{#if issue.moreHref}
                                {' '}{issue.moreLabel}
                                <a href={issue.moreHref} class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">{issue.moreText}</a>.
                            {/if}
                        </p>
                    </div>
                {/each}
            </div>

            <div class="bg-white p-7 rounded-2xl border border-pink-50 shadow-sm">
                <h3 class="font-bold text-[#4A2C2C] mb-4 text-sm uppercase tracking-widest opacity-70">Where stray .heif files come from</h3>
                <p class="text-sm text-[#6C3F31] leading-relaxed">
                    Not every HEIF arrives from a camera roll. Desktop editors such as Affinity Photo and Adobe Lightroom write the format on supported platforms, some Android phones save it when a high-efficiency photo setting is switched on (Samsung Galaxy phones write .heic), and cloud services sometimes hand back a plain <span class="font-mono font-bold text-[#4A2C2C]">.heif</span> when you download an original. Files also get renamed in transit, so an extension is a hint rather than a guarantee. Drop it in and the converter reads the actual container.
                </p>
            </div>
        </div>
    </section>

    <section class="mt-20 max-w-4xl mx-auto space-y-4">
        <h2 class="text-2xl font-black text-[#4A2C2C]">Convert HEIF to JPG without a converter</h2>
        <p class="leading-relaxed text-[#6C3F31]">
            You can, one file at a time, once your system can decode the file.
        </p>
        <p class="leading-relaxed text-[#6C3F31]">
            <strong class="text-[#4A2C2C]">Windows 11 or 10.</strong> Install the HEIF Image Extension and the HEVC Video Extensions ($0.99) from the Microsoft Store, open the file in Photos, then use the three-dots menu, Save as, and choose JPG. Without the paid extension, Photos opens the container and shows nothing. Every fix is in <a href="/guides/open-heif-files-on-windows" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">how to open HEIF files on Windows</a>.
        </p>
        <p class="leading-relaxed text-[#6C3F31]">
            <strong class="text-[#4A2C2C]">Mac.</strong> Right-click the files in Finder, choose Quick Actions, then Convert Image, and pick JPEG (macOS Monterey or later). Or open one in Preview and use File, Export. Both use the system encoder with no quality control.
        </p>
        <p class="leading-relaxed text-[#6C3F31]">
            <strong class="text-[#4A2C2C]">iPhone.</strong> For a photo you already have, save it to the Files app, touch and hold it, choose Quick Actions, then Convert Image, and pick JPEG. To stop new photos being HEIF at all, go to Settings, Camera, Formats and choose Most Compatible. The <a href="/heic-to-jpeg" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">HEIC to JPG converter</a> has the rest of the iPhone routes.
        </p>
        <p class="leading-relaxed text-[#6C3F31]">
            <strong class="text-[#4A2C2C]">Android.</strong> On Samsung Galaxy phones, open the Camera, then Settings, Advanced picture options, and switch off High efficiency pictures; new photos save as JPEG. Photos you already took stay HEIF and still need converting.
        </p>
        <p class="leading-relaxed text-[#6C3F31]">
            <strong class="text-[#4A2C2C]">Canon, Sony and Fujifilm cameras.</strong> Canon bodies convert in the Playback menu, and Canon's Digital Photo Professional and Sony's Imaging Edge Desktop convert on a computer. The <a href="/guides/heif-to-jpg-complete-guide" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">HEIF to JPG guide</a> covers each maker, and the <a href="/solutions/hif-to-jpg" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">HIF to JPG converter</a> has the notes for 10-bit camera files.
        </p>
        <p class="leading-relaxed text-[#6C3F31]">
            None of these handles a mixed folder in one pass, which is where a batch converter earns its keep.
        </p>
    </section>

    <section class="mt-20 max-w-4xl mx-auto space-y-4">
        <h2 class="text-2xl font-black text-[#4A2C2C]">Bulk, batch and automated HEIF to JPG</h2>
        <p class="leading-relaxed text-[#6C3F31]">
            A folder of mixed .heif, .heic and .hif files is the usual case. Seller and Pro accounts convert up to 25 files per batch at up to 75MB each, and a <a href="/pricing" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">Day Pass</a> gives you 100 uploads in 24 hours for $2 with no account. The same conversion runs from the terminal with the Mochify CLI (<code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify</code>, sign in once with <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify auth login</code>), from an AI agent through the hosted or local MCP server, and from the REST API:
        </p>
        <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jpg" \
  -H "Content-Type: image/heif" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @photo.heif \
  -o photo.jpg</code></pre>
        <p class="leading-relaxed text-[#6C3F31]">
            Files travel over HTTPS to api.mochify.app, are converted in memory and discarded. Full parameter reference in the <a href="/docs" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>. Need the photos in one document instead? <a href="/solutions/heif-to-pdf" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">HEIC/HEIF to PDF</a> bundles up to 20 of them.
        </p>
    </section>

    <section class="mt-20 max-w-4xl mx-auto">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">Frequently asked questions</h2>
        <FaqAccordion {faqs} class="grid md:grid-cols-2 gap-4 items-start" />
    </section>

    <section class="mt-20 mb-8 max-w-2xl mx-auto">
        <div class="liquid-glass rounded-[2rem] px-7 py-6 flex flex-col sm:flex-row items-center gap-5">
            <div class="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD6E5] to-[#F06292]/20">
                <svg class="h-6 w-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            </div>
            <div class="flex-1 text-center sm:text-left">
                <p class="font-black text-[#4A2C2C] text-base leading-snug">Want the long version?</p>
                <p class="text-sm text-[#6C3F31]/70 mt-1 leading-relaxed">Our complete guide walks through every conversion method, platform by platform, and what the 10-bit to 8-bit step actually costs you.</p>
            </div>
            <a
                href="/guides/heif-to-jpg-complete-guide"
                class="flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-black text-white bg-[#F06292] hover:bg-[#E91E8C] shadow-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap no-underline"
            >
                Read the guide
            </a>
        </div>
    </section>

    <section class="mt-16 max-w-4xl mx-auto">
        <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
        <div class="grid sm:grid-cols-3 gap-4">
            <a href="/heic-to-jpeg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                <span class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 9l1.5 1.5 3-3.75" /></svg>
                </span>
                <div>
                    <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIC to JPG →</p>
                    <p class="text-xs text-[#875F42]">The iPhone and iPad lane</p>
                </div>
            </a>
            <a href="/solutions/hif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                <span class="w-9 h-9 rounded-xl bg-[#F1F8E9] flex items-center justify-center shrink-0 border border-[#DCEDC8]">
                    <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span>
                <div>
                    <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HIF to JPG →</p>
                    <p class="text-xs text-[#875F42]">Fuji, Canon and Sony bodies</p>
                </div>
            </a>
            <a href="/solutions/heif-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center shrink-0 border border-[#DDD6FE]">
                    <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </span>
                <div>
                    <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIF to PDF →</p>
                    <p class="text-xs text-[#875F42]">Bundle photos into one document</p>
                </div>
            </a>
        </div>
    </section>
</div>

<style>
    .liquid-glass {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow:
            0 8px 32px 0 rgba(240, 98, 146, 0.15),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.1);
    }
</style>
