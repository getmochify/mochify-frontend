<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';

    // The URL stays /heic-to-jpeg, but every visible label says "JPG": that is the
    // spelling the SERP uses and the one the sibling pages (HEIF to JPG, HIF to
    // JPG) already carry.
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'Solutions', href: '/solutions' },
        { name: 'HEIC to JPG' }
    ];

    // Answers render inside their <details>, so they are in the served HTML rather
    // than injected on click, and they mirror the FAQPage block below verbatim.
    const faqs = [
        {
            q: 'Is this HEIC to JPG converter free?',
            a: 'Yes. Convert up to 3 images per session with no signup, or 25 a month with a free account, at up to 20MB per file. For bigger jobs, a $2 Day Pass covers 100 uploads in 24 hours, and Seller and Pro plans batch 25 files at a time.'
        },
        {
            q: 'Do you see my photos?',
            a: 'No. They travel to our encoder over HTTPS, are streamed into memory, converted, and discarded. Nothing is written to disk and nothing is logged. Metadata is stripped by default, GPS included, with nothing to set on this page. If you need it kept, the Mochify web app has a Strip EXIF switch and the API takes stripExif=false.'
        },
        {
            q: 'Why do my iPhone photos save as HEIC instead of JPG?',
            a: "Because HEIC has been the iPhone's default since iOS 11: the same picture at about half the size of a JPEG. Settings, Camera, Formats, Most Compatible switches new photos to JPEG; photos you already have need converting."
        },
        {
            q: "Why can't I save a HEIC file as a JPG?",
            a: 'Usually because the app cannot decode it in the first place. On Windows, Photos and Paint need the HEIF Image Extension and the paid HEVC Video Extensions from the Microsoft Store before Save as offers JPG. This page needs neither.'
        },
        {
            q: 'Is there a file size limit?',
            a: '20MB per file and 3 files per batch with no signup or a free account; 75MB per file and 25 per batch on Seller, Pro and the Day Pass.'
        },
        {
            q: 'Will my photos lose quality?',
            a: 'Slightly in principle, because both formats are lossy, but in practice a good encoder makes the difference invisible. Mochify encodes with jpegli, which was preferred over standard JPEG encoders in published testing at a lower bitrate. HDR headroom and the video half of a Live Photo do not carry into a standard JPEG.'
        },
        {
            q: 'What is the difference between HEIC and HEIF?',
            a: "HEIF is the container standard; HEIC is Apple's name for a HEIF file whose picture is HEVC-encoded, which is what iPhones write. Canon, Sony and Fujifilm cameras write the same family as .hif. All three convert here."
        },
        {
            q: 'Can I convert HEIC to JPG on Windows 10 without installing anything?',
            a: 'Yes: this page runs in Edge or Chrome with nothing to install. Windows Photos can do it too, but only after the HEIF and HEVC extensions are installed from the Microsoft Store.'
        },
        {
            q: 'Can I convert a whole camera roll of HEIC files at once?',
            a: 'Yes. Seller and Pro batch up to 25 files per job, the Day Pass covers 100 uploads in 24 hours, and the CLI takes one prompt for a whole directory. Photos, Preview and the Files app only handle files one at a time.'
        }
    ];
</script>

<svelte:head>
    <title>HEIC to JPG Converter - Free, Online, No Signup | Mochify</title>
    <meta name="description" content="Convert iPhone HEIC photos to JPG online in seconds: up to 3 files per session with no signup, jpegli-encoded JPEGs that open everywhere. Nothing to install, no codec to buy, processed in memory and never saved to disk.">
    <meta property="og:title" content="HEIC to JPG Converter - Mochify">
    <meta property="og:description" content="Convert iPhone HEIC photos to JPG online in seconds: up to 3 files per session with no signup, jpegli-encoded JPEGs that open everywhere. Nothing to install, no codec to buy, processed in memory and never saved to disk.">

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mochify HEIC to JPG Converter",
            "operatingSystem": "Web",
            "applicationCategory": "MultimediaApplication",
            "applicationSubCategory": "Image Converter",
            "url": "https://mochify.app/heic-to-jpeg",
            "description": "Convert iPhone HEIC photos to JPG online in seconds: up to 3 files per session with no signup, jpegli-encoded JPEGs that open everywhere. Nothing to install, no codec to buy, processed in memory and never saved to disk.",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            },
            "featureList": [
                "Convert iPhone HEIC photos to JPEG in the browser",
                "jpegli encoder for better quality per byte",
                "Up to 3 files per session with no signup",
                "No software install or Microsoft Store codec purchase required",
                "Batch conversion of up to 25 files on paid plans",
                "CLI, MCP server and REST API for automated conversion",
                "Files processed in memory and never saved to disk; metadata including GPS stripped by default"
            ],
            "softwareRequirements": "Modern Web Browser"
        }
    </script>

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app/" },
                { "@type": "ListItem", "position": 2, "name": "Solutions", "item": "https://mochify.app/solutions" },
                { "@type": "ListItem", "position": 3, "name": "HEIC to JPG", "item": "https://mochify.app/heic-to-jpeg" }
            ]
        }
    </script>

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                { "@type": "Question", "name": "Is this HEIC to JPG converter free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Convert up to 3 images per session with no signup, or 25 a month with a free account, at up to 20MB per file. For bigger jobs, a $2 Day Pass covers 100 uploads in 24 hours, and Seller and Pro plans batch 25 files at a time." } },
                { "@type": "Question", "name": "Do you see my photos?", "acceptedAnswer": { "@type": "Answer", "text": "No. They travel to our encoder over HTTPS, are streamed into memory, converted, and discarded. Nothing is written to disk and nothing is logged. Metadata is stripped by default, GPS included, with nothing to set on this page. If you need it kept, the Mochify web app has a Strip EXIF switch and the API takes stripExif=false." } },
                { "@type": "Question", "name": "Why do my iPhone photos save as HEIC instead of JPG?", "acceptedAnswer": { "@type": "Answer", "text": "Because HEIC has been the iPhone's default since iOS 11: the same picture at about half the size of a JPEG. Settings, Camera, Formats, Most Compatible switches new photos to JPEG; photos you already have need converting." } },
                { "@type": "Question", "name": "Why can't I save a HEIC file as a JPG?", "acceptedAnswer": { "@type": "Answer", "text": "Usually because the app cannot decode it in the first place. On Windows, Photos and Paint need the HEIF Image Extension and the paid HEVC Video Extensions from the Microsoft Store before Save as offers JPG. This page needs neither." } },
                { "@type": "Question", "name": "Is there a file size limit?", "acceptedAnswer": { "@type": "Answer", "text": "20MB per file and 3 files per batch with no signup or a free account; 75MB per file and 25 per batch on Seller, Pro and the Day Pass." } },
                { "@type": "Question", "name": "Will my photos lose quality?", "acceptedAnswer": { "@type": "Answer", "text": "Slightly in principle, because both formats are lossy, but in practice a good encoder makes the difference invisible. Mochify encodes with jpegli, which was preferred over standard JPEG encoders in published testing at a lower bitrate. HDR headroom and the video half of a Live Photo do not carry into a standard JPEG." } },
                { "@type": "Question", "name": "What is the difference between HEIC and HEIF?", "acceptedAnswer": { "@type": "Answer", "text": "HEIF is the container standard; HEIC is Apple's name for a HEIF file whose picture is HEVC-encoded, which is what iPhones write. Canon, Sony and Fujifilm cameras write the same family as .hif. All three convert here." } },
                { "@type": "Question", "name": "Can I convert HEIC to JPG on Windows 10 without installing anything?", "acceptedAnswer": { "@type": "Answer", "text": "Yes: this page runs in Edge or Chrome with nothing to install. Windows Photos can do it too, but only after the HEIF and HEVC extensions are installed from the Microsoft Store." } },
                { "@type": "Question", "name": "Can I convert a whole camera roll of HEIC files at once?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Seller and Pro batch up to 25 files per job, the Day Pass covers 100 uploads in 24 hours, and the CLI takes one prompt for a whole directory. Photos, Preview and the Files app only handle files one at a time." } }
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
                Works on iPhone, Mac & Windows
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    HEIC
                </span>
                to
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JPG
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Drop in the .heic photos from your iPhone and get JPGs that open in every app, on every device, with nothing to install. Up to 3 files per session with no signup, encoded with Google's jpegli for better quality per byte, processed in memory and never saved to disk.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload types=".HEIC, .HEIF, .HIF" showQuality={false} showTypes={false} compact />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">How to convert HEIC to JPG</h2>
            <ol class="space-y-4">
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#FFF5F7] border border-pink-100 text-[#F06292] font-black text-sm flex items-center justify-center">1</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Drop your .heic files above</strong>, or click browse. Up to 3 per session with no account, 25 a month with a free account. Files from an iPhone, iPad or iCloud download all work; .heif and .hif files convert here too.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#FFF5F7] border border-pink-100 text-[#F06292] font-black text-sm flex items-center justify-center">2</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Let it run.</strong> There is nothing to type and nothing to set: this page does one job, a HEIC to JPG conversion tuned for quality, and starts it as soon as the files land.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-xl bg-[#FFF5F7] border border-pink-100 text-[#F06292] font-black text-sm flex items-center justify-center">3</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Download your JPGs.</strong> They open in Windows Photos, Paint, Preview, Photoshop, every email client and every upload form, none of which need to know what HEIC is.
                    </p>
                </li>
            </ol>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
                <div class="space-y-4">
                    <h2 class="text-2xl font-black text-[#4A2C2C]">Why your iPhone photos are HEIC, and why nothing else opens them</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        Since iOS 11, iPhones have saved photos as HEIC by default: a HEIF container with the picture encoded in HEVC, at roughly half the size of an equivalent JPEG. Apple's own devices open it natively, so you never notice until a photo leaves the Apple ecosystem: an upload form rejects it, a Windows PC shows a blank thumbnail, or an Android phone, a CMS or a print shop hands it straight back.
                    </p>
                    <p class="leading-relaxed text-[#6C3F31]">
                        The reason is licensing, not age. HEVC is a patented codec, so Windows only opens HEIC after two extensions are installed from the Microsoft Store (the HEIF Image Extension is free; the HEVC Video Extensions cost $0.99), and Chrome, Edge and Firefox have never displayed HEIC at all; only Safari does. Converting to JPG removes the dependency instead of working around it, which is why it stays the fastest fix. If you have a plain .heif from a desktop editor or an Android phone, the <a href="/solutions/heif-to-jpg" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">HEIF to JPG converter</a> covers every variant; if the file is a .hif from a Canon, Sony or Fujifilm camera, the <a href="/solutions/hif-to-jpg" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">HIF to JPG converter</a> has the notes for 10-bit camera files.
                    </p>
                </div>

                <div class="space-y-4">
                    <h2 class="text-2xl font-black text-[#4A2C2C]">Will converting HEIC to JPG lose quality?</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        Not visibly, with a good encoder. An iPhone HEIC is already a lossy file, and converting it to JPEG is a second lossy encode, so the encoder decides how much survives. Mochify writes every JPEG through Google's jpegli, which in published testing was preferred over libjpeg-turbo and MozJPEG output while using fewer bits per pixel. The <a href="/guides/jpeg-in-2026-jpegli" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">jpegli guide</a> has the numbers.
                    </p>
                    <p class="leading-relaxed text-[#6C3F31]">
                        Three things do not make the trip, whatever the encoder. JPEG is standard-range 8-bit, so the extra headroom in an iPhone HDR photo does not carry into a plain JPEG. A Live Photo is a HEIC plus a short video, and converting keeps the still only. And the JPG will be bigger than the HEIC was, usually around twice the size: you are trading bytes for compatibility. Metadata is stripped by default, GPS included, with nothing to set on this page; if you need the camera data kept, the Mochify web app has a Strip EXIF switch and the API takes stripExif=false. The <a href="/guides/exif-data-risks-image-compression-2026" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">EXIF guide</a> explains what is in there.
                    </p>
                </div>
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-3 gap-8 items-start">
                <div class="space-y-3">
                    <h2 class="text-xl font-black text-[#4A2C2C]">Convert HEIC to JPG on Windows 11 or 10 without a converter</h2>
                    <p class="leading-relaxed text-[#6C3F31] text-sm">
                        You can, one file at a time, once the codecs are in. Install the HEIF Image Extension and the HEVC Video Extensions from the Microsoft Store, open the .heic in Photos, then use the three-dots menu, Save as, and choose JPG. Paint works the same way after the extensions are installed. Without the paid HEVC extension, Photos opens the container and shows nothing. Every fix, and what to do when 10-bit files still refuse, is in <a href="/guides/open-heif-files-on-windows" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">how to open HEIF files on Windows</a>.
                    </p>
                </div>
                <div class="space-y-3">
                    <h2 class="text-xl font-black text-[#4A2C2C]">Convert HEIC to JPG on a Mac</h2>
                    <p class="leading-relaxed text-[#6C3F31] text-sm">
                        Right-click the file in Finder, choose Quick Actions, then Convert Image, and pick JPEG (macOS Monterey or later). Or open it in Preview, then File, Export, and set the format to JPEG. Both use the system encoder with no control over quality, and neither handles a folder, which is where a batch converter earns its keep.
                    </p>
                </div>
                <div class="space-y-3">
                    <h2 class="text-xl font-black text-[#4A2C2C]">Convert HEIC to JPG on the iPhone itself</h2>
                    <p class="leading-relaxed text-[#6C3F31] text-sm">
                        Three routes, none of which need an app. To stop new photos being HEIC at all, go to Settings, Camera, Formats and choose Most Compatible; the camera then saves JPEG. To convert when you copy to a computer, go to Settings, Photos (Settings, Apps, Photos on iOS 18) and set Transfer to Mac or PC to Automatic. For a photo you already have, save it to the Files app, touch and hold it, choose Quick Actions, then Convert Image, and pick JPEG. AirDrop to a Mac keeps the file as HEIC.
                    </p>
                </div>
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Bulk, batch and automated HEIC to JPG</h2>
            <p class="leading-relaxed text-[#6C3F31] max-w-3xl mb-6">
                A camera roll is the usual case: a client's phone photos, a marketplace listing shot on an iPhone, a whole trip. Seller and Pro accounts convert up to 25 files per batch at up to 75MB each, and a <a href="/pricing" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">Day Pass</a> gives you 100 uploads in 24 hours for $2 with no account. The same conversion runs from the terminal with the Mochify CLI (<span class="font-mono font-bold text-[#4A2C2C]">mochify</span>, one plain-English prompt for a whole directory, sign in once with <span class="font-mono font-bold text-[#4A2C2C]">mochify auth login</span>), from an AI agent through the hosted or local MCP server, and from the REST API:
            </p>

            <div class="bg-[#2D2320] rounded-2xl px-6 py-5 overflow-x-auto shadow-sm">
                <pre class="text-sm font-mono text-[#F5E9E2] leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jpg" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @IMG_0001.heic \
  -o IMG_0001.jpg</code></pre>
            </div>

            <p class="text-sm text-[#875F42] leading-relaxed mt-4 max-w-3xl">
                The CLI, MCP and API are clients over the same encoder as this page: files travel over HTTPS to api.mochify.app, are converted in memory and discarded. Full parameter reference in the <a href="/docs" class="font-black text-[#875F42] hover:text-[#F06292] transition-colors">API documentation</a>. Need the photos in one document instead? <a href="/solutions/heif-to-pdf" class="font-black text-[#875F42] hover:text-[#F06292] transition-colors">HEIC to PDF</a> bundles up to 20 of them.
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

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/solutions/heif-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIC to PDF&nbsp;→</p>
                        <p class="text-xs text-[#875F42]">Bundle iPhone photos into one document</p>
                    </div>
                </a>
                <a href="/solutions/heif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0 border border-[#C7D2FE]">
                        <svg class="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIF to JPG&nbsp;→</p>
                        <p class="text-xs text-[#875F42]">Any .heif, .heic or .hif file</p>
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
            </div>

            <div class="grid sm:grid-cols-2 gap-4 mt-4">
                <a href="/guides/can-safari-open-heic-images" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center shrink-0 border border-[#FBCFE8]">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">Can Safari open HEIC?&nbsp;→</p>
                        <p class="text-xs text-[#875F42]">The one browser that renders it, and what that means for uploads</p>
                    </div>
                </a>
                <a href="/guides/heic-to-jpeg-or-webp-wordpress" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center shrink-0 border border-[#FBCFE8]">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIC to JPEG or WebP?&nbsp;→</p>
                        <p class="text-xs text-[#875F42]">Which format to pick for WordPress uploads</p>
                    </div>
                </a>
            </div>
        </section>
    </div>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>
