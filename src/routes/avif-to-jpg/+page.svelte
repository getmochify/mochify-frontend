<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';

    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'Solutions', href: '/solutions' },
        { name: 'AVIF to JPG' }
    ];

    // Every answer here is rendered inside its <details> element, so it is in the
    // served HTML rather than injected on click. The previous accordion shipped
    // three questions and no answers to a crawler, which is what the FAQPage
    // block below is supposed to mirror.
    const faqs = [
        {
            q: 'Is this AVIF to JPG converter free?',
            a: 'Yes. Convert up to 3 images per session with no signup, or 25 a month with a free account, at up to 20MB per file. For bigger jobs, a $2 Day Pass covers 100 uploads in 24 hours, and Seller and Pro plans batch 25 files at a time.'
        },
        {
            q: 'Will my photos lose quality?',
            a: 'Slightly in principle, because both formats are lossy, but in practice a good encoder makes the difference invisible. Mochify encodes with jpegli, which was preferred over standard JPEG encoders in published testing at a lower bitrate. HDR AVIFs are the exception: tone-mapping to 8-bit changes the look.'
        },
        {
            q: 'Is there a file size limit?',
            a: '20MB per file and 3 files per batch with no signup or a free account; 75MB per file and 25 per batch on Seller, Pro and the Day Pass.'
        },
        {
            q: 'What happens to my files?',
            a: 'They travel to our encoder over HTTPS, are streamed into memory, converted, and discarded. Nothing is written to disk and nothing is logged. Metadata is stripped by default, GPS included; turn the Strip EXIF toggle off before converting if you need camera data kept.'
        },
        {
            q: 'Why did my downloaded image save as AVIF instead of JPG?',
            a: 'Because the website served AVIF: your browser supports it and the file is smaller. Right-click-save gives you whatever the server sent, and on most modern sites and image CDNs that is AVIF.'
        },
        {
            q: 'Can I open an AVIF file without converting it?',
            a: 'Drag it into any current browser tab and it displays. On Windows, the free AV1 Video Extension lets Photos, Paint and File Explorer handle it; on macOS Ventura or later, Preview and Quick Look open it. Converting is for the apps and forms that still refuse it.'
        },
        {
            q: 'Can I convert AVIF to JPG on Windows 11 without installing anything?',
            a: 'Yes: this page runs in Edge or Chrome with nothing to install. Paint can do it too, but only after the AV1 Video Extension is installed from the Microsoft Store.'
        },
        {
            q: 'What about transparent AVIF images?',
            a: 'JPEG has no transparency, so a transparent AVIF is flattened onto a solid background. Keep the alpha channel by converting to PNG or WebP in the Mochify app instead.'
        },
        {
            q: 'Can I convert a whole folder of AVIF files at once?',
            a: 'Yes. Seller and Pro batch up to 25 files per job, the Day Pass covers 100 uploads in 24 hours, and the CLI takes one prompt for a whole directory. Paint and Preview only handle files one at a time.'
        }
    ];
</script>

<svelte:head>
    <title>AVIF to JPG Converter - Free, Online, No Signup | Mochify</title>
    <meta name="description" content="Convert AVIF to JPG online in seconds: up to 3 files per session with no signup, jpegli-encoded JPEGs that open everywhere. Processed in memory, never saved to disk.">
    <meta property="og:title" content="AVIF to JPG Converter - Mochify">
    <meta property="og:description" content="Convert AVIF to JPG online in seconds: up to 3 files per session with no signup, jpegli-encoded JPEGs that open everywhere. Processed in memory, never saved to disk.">

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app/" },
                { "@type": "ListItem", "position": 2, "name": "Solutions", "item": "https://mochify.app/solutions" },
                { "@type": "ListItem", "position": 3, "name": "AVIF to JPG", "item": "https://mochify.app/avif-to-jpg" }
            ]
        }
    </script>

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mochify AVIF to JPG Converter",
            "operatingSystem": "Web",
            "applicationCategory": "MultimediaApplication",
            "applicationSubCategory": "Image Converter",
            "url": "https://mochify.app/avif-to-jpg",
            "description": "Convert AVIF to JPG online in seconds: up to 3 files per session with no signup, jpegli-encoded JPEGs that open everywhere. Processed in memory, never saved to disk.",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            },
            "featureList": [
                "Convert AVIF to JPEG in the browser",
                "jpegli encoder for better quality per byte",
                "Up to 3 files per session with no signup",
                "Batch conversion of up to 25 files on paid plans",
                "CLI, MCP server and REST API for automated conversion",
                "Files processed in memory and never saved to disk"
            ],
            "softwareRequirements": "Modern Web Browser"
        }
    </script>

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                { "@type": "Question", "name": "Is this AVIF to JPG converter free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Convert up to 3 images per session with no signup, or 25 a month with a free account, at up to 20MB per file. For bigger jobs, a $2 Day Pass covers 100 uploads in 24 hours, and Seller and Pro plans batch 25 files at a time." } },
                { "@type": "Question", "name": "Will my photos lose quality?", "acceptedAnswer": { "@type": "Answer", "text": "Slightly in principle, because both formats are lossy, but in practice a good encoder makes the difference invisible. Mochify encodes with jpegli, which was preferred over standard JPEG encoders in published testing at a lower bitrate. HDR AVIFs are the exception: tone-mapping to 8-bit changes the look." } },
                { "@type": "Question", "name": "Is there a file size limit?", "acceptedAnswer": { "@type": "Answer", "text": "20MB per file and 3 files per batch with no signup or a free account; 75MB per file and 25 per batch on Seller, Pro and the Day Pass." } },
                { "@type": "Question", "name": "What happens to my files?", "acceptedAnswer": { "@type": "Answer", "text": "They travel to our encoder over HTTPS, are streamed into memory, converted, and discarded. Nothing is written to disk and nothing is logged. Metadata is stripped by default, GPS included; turn the Strip EXIF toggle off before converting if you need camera data kept." } },
                { "@type": "Question", "name": "Why did my downloaded image save as AVIF instead of JPG?", "acceptedAnswer": { "@type": "Answer", "text": "Because the website served AVIF: your browser supports it and the file is smaller. Right-click-save gives you whatever the server sent, and on most modern sites and image CDNs that is AVIF." } },
                { "@type": "Question", "name": "Can I open an AVIF file without converting it?", "acceptedAnswer": { "@type": "Answer", "text": "Drag it into any current browser tab and it displays. On Windows, the free AV1 Video Extension lets Photos, Paint and File Explorer handle it; on macOS Ventura or later, Preview and Quick Look open it. Converting is for the apps and forms that still refuse it." } },
                { "@type": "Question", "name": "Can I convert AVIF to JPG on Windows 11 without installing anything?", "acceptedAnswer": { "@type": "Answer", "text": "Yes: this page runs in Edge or Chrome with nothing to install. Paint can do it too, but only after the AV1 Video Extension is installed from the Microsoft Store." } },
                { "@type": "Question", "name": "What about transparent AVIF images?", "acceptedAnswer": { "@type": "Answer", "text": "JPEG has no transparency, so a transparent AVIF is flattened onto a solid background. Keep the alpha channel by converting to PNG or WebP in the Mochify app instead." } },
                { "@type": "Question", "name": "Can I convert a whole folder of AVIF files at once?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Seller and Pro batch up to 25 files per job, the Day Pass covers 100 uploads in 24 hours, and the CLI takes one prompt for a whole directory. Paint and Preview only handle files one at a time." } }
            ]
        }
    </script>
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
                Works on iPhone, Android, Mac & Windows
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    AVIF
                </span>
                to
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JPG
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Drop in an .avif file and get a JPEG that opens in every app, on every device. Up to 3 files per session with no signup, encoded with Google's jpegli for better quality per byte, processed in memory and never saved to disk.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload output="jpg" types=".AVIF" showTypes={false} />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">How to convert AVIF to JPG</h2>
            <ol class="space-y-4">
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#FFF5F7] border border-pink-100 text-[#F06292] font-black text-sm flex items-center justify-center">1</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Drop your .avif files above</strong>, or click browse. Up to 3 per session with no account, 25 a month with a free account.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#FFF5F7] border border-pink-100 text-[#F06292] font-black text-sm flex items-center justify-center">2</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Say what you want in plain English</strong>, for example "convert to JPG at high quality" or "convert to JPG and keep the metadata". There are no settings panels; Mochify reads the instruction and does the rest.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#FFF5F7] border border-pink-100 text-[#F06292] font-black text-sm flex items-center justify-center">3</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Download your JPGs.</strong> They open in Photos, Paint, Preview, Photoshop, email clients and upload forms, none of which need to know what AVIF is.
                    </p>
                </li>
            </ol>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
                <div class="space-y-4">
                    <h2 class="text-2xl font-black text-[#4A2C2C]">Why your computer will not open an AVIF file</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        AVIF is the format websites now serve because it makes pages faster: the same picture at a fraction of a JPEG's size. Every current browser renders it, so when you right-click and save an image from a site, you increasingly get an .avif file whether or not anything else on your computer can open it.
                    </p>
                    <p class="leading-relaxed text-[#6C3F31]">
                        That is where it stops. Windows Photos and Paint only open AVIF after you install the free AV1 Video Extension from the Microsoft Store; on a Mac, Preview needs Ventura or later; older photo editors, most email clients and many upload forms reject the file outright. Converting to JPG is the fix that works everywhere, and the <a href="/guides/what-is-an-avif-file" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">guide to AVIF files</a> explains the format if you want the background.
                    </p>
                </div>

                <div class="space-y-4">
                    <h2 class="text-2xl font-black text-[#4A2C2C]">Will converting AVIF to JPG lose quality?</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        Not visibly, with a good encoder. Almost every AVIF you meet is already lossy, and converting it to JPEG is a second lossy encode, so the encoder decides how much survives. Mochify writes every JPEG through Google's jpegli, which in published testing was preferred over libjpeg-turbo and MozJPEG output while using fewer bits per pixel. The <a href="/guides/jpeg-in-2026-jpegli" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">jpegli guide</a> has the numbers.
                    </p>
                    <p class="leading-relaxed text-[#6C3F31]">
                        Two things do not survive the trip, whatever the encoder. JPEG has no transparency, so an AVIF with a transparent background is flattened onto a solid one; if you need the alpha channel, convert to PNG or WebP in the Mochify app instead. And JPEG is 8-bit standard range, so a 10-bit or HDR AVIF is tone-mapped down, which changes the look more than the compression does. Expect the JPG to be bigger than the AVIF was: you are trading bytes for compatibility.
                    </p>
                </div>
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Convert AVIF to JPG on Windows 11 or Mac without a converter</h2>
            <p class="leading-relaxed text-[#6C3F31] max-w-3xl">
                You can do it natively, one file at a time. On Windows 10 or 11, install the AV1 Video Extension from the Microsoft Store, open the .avif in Paint, then File, Save as, JPEG picture. On macOS Ventura or later, open it in Preview, then File, Export, and set the format to JPEG. Both use the system encoder with no control over quality or metadata, and neither handles a folder. The <a href="/guides/avif-to-jpg" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">full AVIF to JPG guide</a> walks through every route, including the command line.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Bulk, batch and automated AVIF to JPG</h2>
            <p class="leading-relaxed text-[#6C3F31] max-w-3xl mb-6">
                A folder of AVIFs is the usual case: a scraped product catalog, a client handoff, a batch of downloads. Seller and Pro accounts convert up to 25 files per batch at up to 75MB each, and a <a href="/pricing" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">Day Pass</a> gives you 100 uploads in 24 hours for $2 with no account. The same conversion runs from the terminal with the Mochify CLI (<span class="font-mono font-bold text-[#4A2C2C]">mochify</span>, one plain-English prompt for a whole directory, sign in once with <span class="font-mono font-bold text-[#4A2C2C]">mochify auth login</span>), from an AI agent through the hosted or local MCP server, and from the REST API:
            </p>

            <div class="bg-[#2D2320] rounded-2xl px-6 py-5 overflow-x-auto shadow-sm">
                <pre class="text-sm font-mono text-[#F5E9E2] leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jpg" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @photo.avif \
  -o photo.jpg</code></pre>
            </div>

            <p class="text-sm text-[#875F42] leading-relaxed mt-4 max-w-3xl">
                The CLI, MCP and API are clients over the same encoder as this page: files travel over HTTPS to api.mochify.app, are converted in memory and discarded. Full parameter reference in the <a href="/docs" class="font-black text-[#875F42] hover:text-[#F06292] transition-colors">API documentation</a>.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">FAQ</h2>
            <div class="grid md:grid-cols-2 gap-4 items-start">
                {#each faqs as faq (faq.q)}
                    <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md open:shadow-md transition-all">
                        <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] select-none list-none gap-4">
                            <span>{faq.q}</span>
                            <span class="text-[#7E685E] transition-transform duration-300 group-open:rotate-180 shrink-0">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </summary>
                        <div class="px-6 pb-6 text-[#6C3F31] leading-relaxed">
                            {faq.a}
                        </div>
                    </details>
                {/each}
            </div>
        </section>

        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="/heic-to-jpeg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0 border border-[#C7D2FE]">
                        <svg class="w-4 h-4 text-[#4338CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIC to JPG&nbsp;→</p>
                        <p class="text-xs text-[#875F42]">Every iPhone photo, one converter</p>
                    </div>
                </a>
                <a href="/solutions/hif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F1F8E9] flex items-center justify-center shrink-0 border border-[#DCEDC8]">
                        <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HIF to JPG&nbsp;→</p>
                        <p class="text-xs text-[#875F42]">Fuji, Canon and Sony bodies</p>
                    </div>
                </a>
                <a href="/avif-to-jpegxl" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">AVIF to JPEG XL&nbsp;→</p>
                        <p class="text-xs text-[#875F42]">Keep the small file, gain compatibility</p>
                    </div>
                </a>
                <a href="/guides/avif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center shrink-0 border border-[#FBCFE8]">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">AVIF to JPG guide&nbsp;→</p>
                        <p class="text-xs text-[#875F42]">Windows 11, Mac or the command line</p>
                    </div>
                </a>
            </div>
        </section>
    </div>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>
