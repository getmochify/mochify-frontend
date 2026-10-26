<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        "Convert JXL to JPG online: turn JPEG XL files into JPEGs that open in every app, email and upload form. Free, no signup, nothing to install.";

    const faqs: FaqItem[] = [
        {
            q: 'Is this JXL to JPG converter free?',
            a: 'Yes. Convert up to 3 files at a time with no signup, or 25 a month with a free account, at up to 20MB per file. For a bigger folder, a $2 Day Pass covers 100 uploads in 24 hours with no account, and Seller and Pro plans convert 25 files per batch.'
        },
        {
            q: "Why won't my JXL file open?",
            a: [
                'JPEG XL is new enough that plenty of software still cannot read it. Windows needs the JPEG XL Image Extension from the Microsoft Store before File Explorer and Photos can show one, Edge had not shipped support as of October 2026, and most email clients, chat apps and upload forms reject it. Converting to JPG is the quickest fix when you need the picture to open everywhere. Every way to open one without converting is in ',
                { href: '/guides/what-is-a-jxl-file', label: 'What is a JXL file?' }
            ]
        },
        {
            q: 'Will I lose quality converting JXL to JPG?',
            a: 'A little, and usually not visibly. JPG is a lossy format, so the conversion is a fresh encode rather than a copy. This page encodes at quality 85 with Google\'s jpegli encoder, which keeps photos looking the same on screen. If your JXL was lossless and you need every pixel kept, convert to PNG instead.'
        },
        {
            q: 'What happens to transparency?',
            a: 'JPG has no transparency, so transparent areas come out white. If the image needs to stay see-through, convert it to PNG or WebP in the Mochify web app instead.'
        },
        {
            q: 'What is a JXL file?',
            a: [
                'A .jxl file is an image in the JPEG XL format, designed to compress better than JPEG, PNG and WebP and to support lossless and HDR images. Photoshop, GIMP and Affinity Photo export it, and Chrome 155, Firefox 158 and Safari 17 display it. More in ',
                { href: '/guides/what-is-a-jxl-file', label: 'What is a JXL file?' }
            ]
        },
        {
            q: 'Can I keep the metadata?',
            a: "Yes. Metadata is stripped by default, GPS included. Add your files and switch Strip EXIF off before converting to keep the camera data in the JPG."
        },
        {
            q: 'What happens to my files?',
            a: 'They travel over HTTPS to api.mochify.app, are converted in memory and discarded as soon as your download is ready. Nothing is written to disk and no logs contain your image data.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify JXL to JPG Converter',
        url: 'https://mochify.app/solutions/jxl-to-jpg',
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
            'Convert JPEG XL (.jxl) to JPG in the browser',
            'Encoded with Google jpegli at quality 85',
            'Up to 3 files with no signup',
            'Processed in memory, never saved to disk',
            'Optional metadata stripping',
            'Batch conversion of up to 25 files on paid plans and the Day Pass'
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
    <title>JXL to JPG Converter - Free, No Signup | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="JXL to JPG Converter - Mochify" />
    <meta property="og:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-matcha text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Opens Everywhere
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-pink text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                <span class="bg-gradient-to-r from-[#FDE68A] to-[#F59E0B] bg-clip-text text-transparent">
                    JXL
                </span>
                to
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JPG
                </span>
                Converter
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed text-balance">
                Got a .jxl file that will not open? Drop it here and get a JPG back that works in every app, email and upload form. No signup, nothing to install.
            </p>
        </div>

        <div class="mb-16">
            <!-- quality in queryParams (ImageUpload takes no quality prop). 85 rather
                 than core's Q65 default: most JXLs are high-quality or lossless
                 masters, and the JPG is the copy people send on. -->
            <ImageUpload types=".JXL" output="jpg" showTypes={false} compact queryParams="quality=85" showExifOption={true} showDayPass={true} />
        </div>

        <section class="mt-10 max-w-4xl mx-auto">
            <h2 class="text-2xl font-extrabold text-[#4A2C2C] mb-6">How to convert JXL to JPG</h2>
            <ol class="space-y-4">
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">1</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Drop your .jxl files</strong> in the box above, or click browse. Up to 3 files per batch with no signup or on a free account, and 25 per batch on a Day Pass or any paid plan. A whole folder to convert? A <a href="/pricing" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">$2 Day Pass</a> covers 100 uploads in 24 hours, no account needed.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">2</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Decide what happens to the metadata.</strong> Once your files are in, a Strip EXIF switch appears. It is on by default, so camera data and GPS are removed unless you switch it off. Each file is then decoded and re-encoded as a JPG with Google's jpegli encoder.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">3</span>
                    <p class="leading-relaxed text-[#6C3F31]">
                        <strong class="text-[#4A2C2C]">Download your JPGs.</strong> They open in Windows Photos, Preview, Lightroom, every browser, every email client and every upload form.
                    </p>
                </li>
            </ol>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert JXL to JPG?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            JPEG XL is a better format than JPEG: smaller files, lossless and HDR support, and quality that holds up. Browsers are catching up fast, with Chrome 155 and Firefox 158 decoding it by default from October 2026 and Safari since version 17. Everything else is slower. Windows needs an extension from the Microsoft Store, Edge does not show it yet, and most email clients, messaging apps, marketplaces and CMS upload forms still reject a .jxl.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            A JPG opens everywhere. Mochify encodes it with <strong class="text-[#7E685E]">Google's jpegli</strong>, so you get a standard JPEG that works with all existing tools, with fewer wasted bytes than a typical encoder at the same quality.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Should you keep the JXL?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            Usually, yes. Treat the JPG as the copy you share and keep the JXL as your original, especially if it was saved lossless. If you need a pixel-exact copy that opens everywhere, PNG is the safer target, and if you are sending a set of images to someone, <a href="/solutions/jxl-to-pdf" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">JXL to PDF</a> bundles them into one file. For where JPEG XL works today, see our guide to <a href="/guides/jpeg-xl-chrome-support" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">JPEG XL in Chrome and what changes now</a>.
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
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Bulk and automated JXL to JPG</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                Seller and Pro accounts convert up to 25 files per batch at up to 75MB each. The same conversion runs from the terminal with the Mochify CLI (<code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">mochify *.jxl -p "convert to jpg"</code>), from an AI agent through the hosted or local MCP server, and from the REST API:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jpg&amp;quality=85" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @photo.jxl \
  -o photo.jpg</code></pre>
            <p class="leading-relaxed text-[#6C3F31]">
                Full parameter reference in the <a href="/docs" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>.
            </p>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/solutions/jxl-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">JXL to PDF →</p>
                        <p class="text-xs text-[#875F42]">Bundle JXL images into one PDF</p>
                    </div>
                </a>
                <a href="/avif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">AVIF to JPG →</p>
                        <p class="text-xs text-[#875F42]">The other new format that will not open</p>
                    </div>
                </a>
                <a href="/jpg-to-jpegxl" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">JPG to JXL →</p>
                        <p class="text-xs text-[#875F42]">Going the other way</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
