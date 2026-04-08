<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
    <title>Fix eBay "Unsupported File" Error | Free Image Converter | Mochify</title>
    <meta name="description" content="Stop eBay upload rejections. Instantly convert iPhone HEIC photos to JPEG and compress images under 12MB with our secure C++ engine. Free, private, no account needed.">
    <meta property="og:title" content="eBay Image Compressor - Optimize Photos for Listings">
    <meta property="og:description" content="The fastest way to compress large DSLR photos for eBay.">

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@graph": [
                {
                "@type": "SoftwareApplication",
                "name": "Mochify eBay Image Converter",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Web Browser",
                "url": "https://mochify.app/solutions/ebay-image-converter",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "featureList": "Compress JPEG, Resize for eBay, Bulk Optimization, Remove Metadata"
                },
                {
                "@type": "HowTo",
                "name": "How to Fix eBay Unsupported File Errors from iPhone",
                "description": "Convert iPhone HEIC photos to eBay-compatible JPEGs and compress them under 12MB.",
                "step": [
                    {
                    "@type": "HowToStep",
                    "name": "Transfer Photos",
                    "itemListElement": [{ "@type": "HowToDirection", "text": "Move photos from iPhone to PC/Mac via AirDrop or USB." }]
                    },
                    {
                    "@type": "HowToStep",
                    "name": "Convert with Mochify",
                    "itemListElement": [{ "@type": "HowToDirection", "text": "Drag HEIC files into the tool to convert to JPEG." }]
                    },
                    {
                    "@type": "HowToStep",
                    "name": "Upload to eBay",
                    "itemListElement": [{ "@type": "HowToDirection", "text": "Download the JPEGs and add them to your listing." }]
                    }
                ]
                }
            ]
        }
    </script>
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 min-h-screen flex flex-col">
    <Navigation />

    <div class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/>
                    </svg>
                    Fixes eBay Rejections
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                    </svg>
                    Never Saved to Disk
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-[#875F42]/10 shadow-sm text-[#875F42] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"/>
                    </svg>
                    Up to 25 Files at Once
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                eBay
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    Image Converter
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Fix <strong>"Image is too large"</strong> and <strong>"Unsupported file"</strong> errors instantly. Convert HEIC to JPEG and compress under 12MB — no account needed.
            </p>
        </div>

        <div class="mb-16">
            <ImageUpload types=".JPG, .JPEG, .HEIC, .HEIF, .HIF" output="jpg" showQuality={false} showTypes={false} compact showExifOption={true} />
        </div>

        <section class="mb-16">
            <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-8">
                <h2 class="text-xl font-black text-[#4A2C2C] mb-8 text-center">3 Steps to Fix eBay Upload Errors</h2>
                <div class="grid sm:grid-cols-3 gap-8 relative">
                    {#each [
                        { n: 1, title: "Transfer", body: "Move your photos from iPhone to your PC or Mac using AirDrop or a USB cable to keep full resolution." },
                        { n: 2, title: "Convert", body: "Drag your HEIC or oversized files into the tool above. We'll convert to JPEG and compress under 12MB instantly." },
                        { n: 3, title: "List", body: "Download the optimized files and upload directly to your eBay listing. No more rejection errors." }
                    ] as step}
                        <div class="text-center relative z-10">
                            <div class="w-10 h-10 mx-auto mb-4 rounded-full bg-[#FFF0F3] border border-pink-100 text-[#F06292] flex items-center justify-center font-black text-sm">
                                {step.n}
                            </div>
                            <h3 class="font-black text-[#4A2C2C] text-sm uppercase tracking-widest mb-2">{step.title}</h3>
                            <p class="text-[#6C3F31] text-sm leading-relaxed opacity-90">{step.body}</p>
                        </div>
                    {/each}
                    <div class="hidden sm:block absolute top-5 left-[16.66%] right-[16.66%] h-px bg-pink-100 -z-0"></div>
                </div>
            </div>
        </section>

        <section class="max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-6">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">Why compress photos for eBay?</h2>
                    <p class="text-[#6C3F31] leading-relaxed">
                        eBay has a hard <strong class="text-[#7E685E]">12MB file size limit</strong> and only accepts JPEG, PNG, GIF, and BMP. Modern iPhone photos in HEIC format and DSLR files often exceed both limits, causing instant rejection.
                    </p>
                    <ul class="space-y-4">
                        {#each [
                            { title: "Avoid Rejection", body: "We compress to well under 12MB using Google's Jpegli encoder — no more upload failures." },
                            { title: "Faster Uploads", body: "Stop waiting minutes for 20MB files to upload. Smaller files go through in seconds." },
                            { title: "Better Listing SEO", body: "Listings with fast-loading images rank higher in Cassini, eBay's internal search engine." }
                        ] as item}
                            <li class="flex items-start gap-3">
                                <div class="w-5 h-5 rounded-full bg-[#F1F8E9] border border-[#DCEDC8] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg class="w-3 h-3 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                    </svg>
                                </div>
                                <span class="text-sm text-[#6C3F31] leading-relaxed"><strong class="text-[#4A2C2C]">{item.title}:</strong> {item.body}</span>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div class="space-y-3">
                    {#each [
                        { q: "Will my photos look pixelated?", a: "Not at all. We use Google's Jpegli encoder which removes invisible file data while keeping visual quality high. Your customers won't see the difference, but files can be up to 70% smaller." },
                        { q: "Can I convert iPhone HEIC photos?", a: "Yes. HEIC is the default format on iPhones and is not supported by eBay. Drop your .HEIC files in and they'll come out as eBay-compatible JPEGs." },
                        { q: "Can I upload in bulk?", a: "Yes — select up to 25 images at once. We'll compress them all and give you a single ZIP file to drag-and-drop into your listing." },
                        { q: "Are my photos private?", a: "Completely. Images are streamed into RAM, compressed, and wiped the moment you download. They never touch a disk or get logged anywhere." }
                    ] as faq}
                        <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] list-none select-none">
                                <span>{faq.q}</span>
                                <span class="text-[#7E685E] transition-transform duration-300 group-open:rotate-180">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7"/></svg>
                                </span>
                            </summary>
                            <div class="px-6 pb-6 text-sm text-[#6C3F31] leading-relaxed">
                                {faq.a}
                            </div>
                        </details>
                    {/each}
                </div>

            </div>
        </section>

    </div>

    <div class="mt-16 md:mt-24">
        <Footer />
    </div>
</div>
