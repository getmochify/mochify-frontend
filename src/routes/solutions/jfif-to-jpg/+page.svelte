<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Convert JFIF to JPG online, free: the .jfif Windows saves from the web becomes a .jpg every app and upload form accepts. No signup, nothing to install.';

    const faqs: FaqItem[] = [
        {
            q: 'Is this JFIF to JPG converter free?',
            a: 'Yes. Convert up to 3 files at a time with no signup, or 25 a month with a free account, at up to 20MB per file. For a bigger folder, a $2 Day Pass covers 100 uploads in 24 hours with no signup, and Seller, Pro and Growth plans convert 25 files per batch.'
        },
        {
            q: 'What is a JFIF file?',
            a: 'A JPEG. JFIF (JPEG File Interchange Format) is the standard layout most JPEG files have always used, so a .jfif and a .jpg hold the same kind of image. Only the extension differs, and some upload forms check the extension rather than the contents.'
        },
        {
            q: 'Why did my image save as .jfif?',
            a: 'Windows often names JPEG images saved from a browser .jfif instead of .jpg. The picture is an ordinary JPEG; it just arrives with an extension that some apps and websites do not recognize.'
        },
        {
            q: 'Can I just rename .jfif to .jpg?',
            a: 'Yes, and it loses nothing: the file is already a JPEG, so changing the extension is enough for most apps. Converting here is the better route when you have several files, when you cannot rename them (some phones and work machines hide extensions), or when you also want the metadata stripped.'
        },
        {
            q: 'How do I convert JFIF to JPG on Windows or a Mac without a converter?',
            a: 'On Windows, show file name extensions (File Explorer > View), right-click the file, choose Rename and change .jfif to .jpg; or open it in Paint and use Save as > JPEG picture. On a Mac, rename it in Finder, or open it in Preview and use File > Export with JPEG as the format. Renaming loses nothing, because the file is already a JPEG. The converter above is for a batch, or for a machine that hides extensions.'
        },
        {
            q: 'How do I stop Windows saving images as .jfif?',
            a: 'Windows picks the extension from one registry entry. Open Registry Editor, go to HKEY_CLASSES_ROOT\\MIME\\Database\\Content Type\\image/jpeg, and change the Extension value from .jfif to .jpg. New downloads use .jpg from then on, with no restart. Back up the registry first, and leave it alone on a work machine you do not administer. Files already saved as .jfif stay as they are: rename or convert those.'
        },
        {
            q: 'Will I lose quality converting JFIF to JPG?',
            a: "Not visibly. The conversion is a fresh JPEG encode at quality 85 with Google's jpegli encoder, which keeps photos looking the same on screen. A JFIF saved at high quality usually comes back noticeably smaller; one that was already heavily compressed can come back a little larger. If you need the exact original bytes, rename the file instead."
        },
        {
            q: 'What is the difference between JFIF and JPEG?',
            a: 'JPEG is the compression method; JFIF is one of the two common file layouts that carry it, the other being Exif, which cameras and phones write. Both decode the same way in every app, and both are usually given the .jpg extension.'
        },
        {
            q: 'What happens to my files?',
            a: 'They travel over HTTPS to api.mochify.app, are converted in memory and discarded as soon as your download is ready. Nothing is written to disk and no logs contain your image data. Metadata is stripped by default; switch Strip EXIF off after adding your files to keep it.'
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify JFIF to JPG Converter',
        url: 'https://mochify.app/solutions/jfif-to-jpg',
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
            'Convert JFIF to JPG in the browser',
            'Encoded with Google jpegli at quality 85',
            'Up to 3 files with no signup',
            'Batch conversion of up to 25 files on paid plans and the Day Pass',
            'Processed in memory, never saved to disk',
            'Optional metadata stripping'
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
    <title>JFIF to JPG Converter - Free Online, No Signup | Mochify</title>
    <meta name="description" content={metaDescription}>
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

            <h1 class="text-4xl sm:text-5xl font-black text-cocoa-ink tracking-tight">
                <span class="bg-gradient-to-r from-[#FFB74D] to-[#F57C00] bg-clip-text text-transparent">
                    JFIF
                </span>
                to
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JPG
                </span>
                Converter
            </h1>

            <p class="text-lg text-cocoa-deep font-medium max-w-2xl mx-auto leading-relaxed text-balance">
                Saved an image and got a .jfif that an upload form will not take? Drop it here and get a standard .jpg back that works in every app, form and print service. No signup, nothing to install.
            </p>
        </div>

        <div class="mb-16">
            <!-- A JFIF is already a JPEG, so this is a JPEG re-encode: quality 85
                 as on /solutions/jpegli-compressor rather than core's Q65 default,
                 which would stack a second round of artifacts on a web image. -->
            <ImageUpload types=".JFIF" output="jpg" showTypes={false} compact queryParams="quality=85" showExifOption={true} showDayPass={true} />
        </div>

        <section class="mt-10 max-w-4xl mx-auto">
            <h2 class="text-2xl font-extrabold text-cocoa-ink mb-6">How to convert JFIF to JPG</h2>
            <ol class="space-y-4">
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">1</span>
                    <p class="leading-relaxed text-cocoa-deep">
                        <strong class="text-cocoa-ink">Drop your .jfif files</strong> in the box above, or click browse. Up to 3 files per batch with no signup or on a free account, and 25 per batch on a Day Pass or any paid plan. A whole folder to convert? A <a href="/pricing" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">$2 Day Pass</a> covers 100 uploads in 24 hours with no signup.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">2</span>
                    <p class="leading-relaxed text-cocoa-deep">
                        <strong class="text-cocoa-ink">Decide what happens to the metadata.</strong> Once your files are in, a Strip EXIF switch appears. It is on by default, so any embedded data is removed unless you switch it off. Each file is then re-encoded as a JPG with Google's jpegli encoder.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">3</span>
                    <p class="leading-relaxed text-cocoa-deep">
                        <strong class="text-cocoa-ink">Download your JPGs.</strong> Each file comes back with a .jpg extension, and more than one comes back as a single zip. They open in every editor, upload form, print kiosk and email client.
                    </p>
                </li>
            </ol>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-cocoa-ink">A JFIF is already a JPEG</h2>
                        <p class="leading-relaxed text-cocoa-deep">
                            JFIF is the file layout most JPEG images have used since the early 1990s, so a .jfif holds exactly the same kind of picture as a .jpg. Windows often gives that extension to JPEGs saved from a browser, and the trouble starts when a form, a marketplace or an older app checks the extension and refuses anything that does not end in .jpg or .jpeg.
                        </p>
                        <p class="leading-relaxed text-cocoa-deep">
                            That means renaming one file from <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">photo.jfif</code> to <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">photo.jpg</code> works and loses nothing. Converting here is quicker for a batch, works where you cannot see or change extensions, and gives you a clean JPEG encoded with <strong class="text-[#7E685E]">Google's jpegli</strong>, with metadata stripped unless you keep it. For how jpegli compares with older encoders, read <a href="/guides/jpeg-in-2026-jpegli" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">JPEG in 2026</a>.
                        </p>
                        <p class="leading-relaxed text-cocoa-deep">
                            Saving images from websites a lot? The <a href="/chrome-extension" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">Mochify Chrome extension</a> lets you right-click any image and save it straight as a JPG, and our guide to <a href="/guides/save-image-as-type-alternative" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">choosing the format when you save an image</a> covers the other routes.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-cocoa-ink">JPG or PNG?</h2>
                        <p class="leading-relaxed text-cocoa-deep">
                            JPG for almost everything: it is what the JFIF already is, and it keeps the file small. Pick PNG only when an app or form asks for it, or when you want to edit the image several times without adding compression each time; the file will be several times larger. For that, use <a href="/solutions/jfif-to-png" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">JFIF to PNG</a>.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl font-bold text-cocoa-ink mb-4">Frequently asked questions</h2>
                    <FaqAccordion {faqs} />
                </div>
            </div>
        </section>

        <!-- Bulk / automation -->
        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-cocoa-ink">Bulk and automated JFIF to JPG</h2>
            <p class="leading-relaxed text-cocoa-deep">
                Seller, Pro and Growth accounts convert up to 25 files per batch at up to 75MB each. The same conversion runs from the terminal with the Mochify CLI (<code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">mochify *.jfif -p "convert to jpg"</code>), from an AI agent through the hosted or local MCP server, and from the REST API:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jpg&amp;quality=85" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @image.jfif \
  -o image.jpg</code></pre>
            <p class="leading-relaxed text-cocoa-deep">
                Full parameter reference in the <a href="/docs" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">API documentation</a>.
            </p>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-cocoa-milk uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-2 gap-4">
                <a href="/solutions/jfif-to-png" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">JFIF to PNG →</p>
                        <p class="text-xs text-cocoa-milk">Lossless, for editing</p>
                    </div>
                </a>
                <a href="/solutions/jpegli-compressor" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">JPEG Compressor →</p>
                        <p class="text-xs text-cocoa-milk">Smaller JPEGs with jpegli</p>
                    </div>
                </a>
                <a href="/solutions/webp-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">WebP to JPG →</p>
                        <p class="text-xs text-cocoa-milk">The other format web saves arrive in</p>
                    </div>
                </a>
                <a href="/solutions/jfif-to-pdf" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">JFIF to PDF →</p>
                        <p class="text-xs text-cocoa-milk">Merge .jfif images into one PDF</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
