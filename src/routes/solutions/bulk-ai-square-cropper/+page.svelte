<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';

    const SIZES = [500, 800, 1000, 1200, 1500, 2000] as const;
    type Size = typeof SIZES[number];

    let squareSize: Size = $state(1000);
    const queryParams = $derived(`width=${squareSize}&height=${squareSize}&smartCrop=1`);
</script>

<svelte:head>
    <title>Bulk AI Square Cropper — Smart-Crop Images to a Square | Mochify</title>
    <meta name="description" content="Batch crop images to a perfect square using AI saliency — the subject stays centred automatically. Pick your size, upload, download. Free, no sign-up required.">
    <meta property="og:title" content="Bulk AI Square Cropper — Smart-Crop Images to a Square | Mochify" />
    <meta property="og:description" content="Batch crop images to a perfect square using AI saliency — the subject stays centred automatically. Pick your size, upload, download. Free, no sign-up required." />
    <link rel="canonical" href="https://mochify.app/solutions/bulk-ai-square-cropper" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Bulk AI Square Cropper",
        "description": "Batch crop images to a perfect square using AI saliency detection. Subject stays centred automatically. Processed in memory, never stored.",
        "url": "https://mochify.app/solutions/bulk-ai-square-cropper",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "provider": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" }
        }
    </script>
</svelte:head>

<div class="flex-1 bg-[#FDFBF7] min-h-screen flex flex-col">
    <Navigation />

    <div class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                    Square Crop
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-violet-50 border border-violet-100 shadow-sm text-violet-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    AI Saliency
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Bulk
                <span class="bg-gradient-to-r from-[#F06292] to-violet-500 bg-clip-text text-transparent">
                    AI Square
                </span>
                Cropper
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Crop any image to a perfect square in bulk. AI saliency keeps the subject centred automatically — no manual adjustments needed.
            </p>
        </div>

        <!-- Size picker -->
        <div class="max-w-2xl mx-auto mb-8">
            <div class="bg-white rounded-2xl border border-pink-50 shadow-sm p-5">
                <p class="text-xs font-black uppercase tracking-widest text-[#875F42] mb-4">Square size</p>
                <div class="flex flex-wrap gap-2">
                    {#each SIZES as size}
                        <button
                            type="button"
                            onclick={() => squareSize = size}
                            class="rounded-full px-4 py-2 text-sm font-bold transition-all {squareSize === size
                                ? 'bg-[#F06292] text-white shadow-sm'
                                : 'bg-pink-50 text-pink-500 hover:bg-pink-100'}"
                        >
                            {size} px
                        </button>
                    {/each}
                </div>
                <p class="text-xs text-[#875F42] mt-3 opacity-70">
                    Current: {squareSize} × {squareSize} px &nbsp;·&nbsp; AI saliency centres the crop on the main subject
                </p>
            </div>
        </div>

        <div class="mb-16">
            <ImageUpload {queryParams} />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">What is AI square cropping?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            A standard centre crop blindly cuts from the middle of the frame. AI saliency cropping first analyses the image to find the most important region — a face, a product, the focal subject — then centres the square crop around that point instead.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            The result is that product shots, portraits, and real-world photos all crop correctly in bulk without any manual adjustment per image.
                        </p>
                    </div>

                    <div class="bg-violet-50 border border-violet-100 rounded-2xl p-6 space-y-3">
                        <p class="text-xs font-black text-violet-700 uppercase tracking-widest">Common square sizes</p>
                        <ul class="space-y-2.5">
                            {#each [
                                '1000 px — standard for most e-commerce platforms',
                                '1200 px — Shopify and high-DPI product grids',
                                '800 px — Instagram feed and general social media',
                                '500 px — thumbnails, avatars, and preview cards',
                                '2000 px — print-ready or high-res archive',
                            ] as point}
                                <li class="flex items-start gap-2.5 text-sm text-violet-900">
                                    <span class="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5"></span>
                                    {point}
                                </li>
                            {/each}
                        </ul>
                    </div>

                    <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                        <h3 class="font-bold text-[#4A2C2C] mb-5 text-sm uppercase tracking-widest opacity-70">Common Use Cases</h3>
                        <ul class="space-y-3">
                            {#each [
                                'Preparing product images for an e-commerce catalogue',
                                'Normalising a batch of photos to a uniform grid layout',
                                'Squaring up listing photos before uploading to marketplaces',
                                'Creating consistent thumbnails from varied source images',
                                'Cropping portraits for profile or team-page cards',
                                'Batch-prepping images for social media posting',
                            ] as item}
                                <li class="flex items-center gap-3 text-sm font-semibold text-[#6C3F31]">
                                    <span class="w-2 h-2 rounded-full bg-pink-300 shrink-0"></span> {item}
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>

                <div class="space-y-4">
                    {#each [
                        {
                            q: "How does the AI know where to crop?",
                            a: "Mochify runs a saliency model that identifies the most visually important region of each image — typically the main subject, face, or product. The square crop is then centred on that region rather than the geometric centre of the frame."
                        },
                        {
                            q: "What happens if the subject is near an edge?",
                            a: "The saliency model clamps the crop window to the image boundaries, so it will get as close as possible to centring on the subject without cropping outside the image."
                        },
                        {
                            q: "Can I pick my own square size?",
                            a: "Yes — choose from 500, 800, 1000, 1200, 1500, or 2000 px using the size picker above the uploader. Set the size before uploading your batch."
                        },
                        {
                            q: "What output format should I use?",
                            a: "WebP is the best default: smallest file size, supported by all modern browsers. Use JPG for maximum compatibility with older apps, marketplaces, or clients who need a standard format."
                        },
                        {
                            q: "How many images can I process at once?",
                            a: "Free accounts can process up to 3 images per batch. Paid plans unlock up to 25 files at once with 2 concurrent uploads."
                        },
                        {
                            q: "Are my images stored anywhere?",
                            a: "Never. Each image is processed in memory on the server and returned immediately. No copy is retained after your download completes."
                        },
                    ] as faq}
                        <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] list-none select-none">
                                <span>{faq.q}</span>
                                <span class="text-[#7E685E] transition-transform duration-300 group-open:rotate-180">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7" /></svg>
                                </span>
                            </summary>
                            <div class="px-6 pb-6 text-base text-[#6C3F31] leading-relaxed">
                                {faq.a}
                            </div>
                        </details>
                    {/each}
                </div>
            </div>
        </section>

        <!-- How it works -->
        <section class="mt-20 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-6">How it works</h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each [
                    { n: '1', t: 'Pick your size', d: 'Choose the square output size that matches your platform — 1000 px for most e-commerce, 800 px for social.' },
                    { n: '2', t: 'Upload your images', d: 'Add up to 25 images at once. The AI saliency model analyses each one independently.' },
                    { n: '3', t: 'Download the results', d: 'Each image comes back as a perfectly square crop centred on its main subject. Nothing is stored.' },
                ] as step}
                    <div class="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-violet-50 text-violet-600 font-black text-sm mb-4">{step.n}</span>
                        <h3 class="font-black text-[#4A2C2C] text-sm mb-1.5">{step.t}</h3>
                        <p class="text-sm text-[#6C3F31] leading-relaxed opacity-90">{step.d}</p>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-2 gap-4">
                <a href="/solutions/ebay-image-converter" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#FFF5F7] flex items-center justify-center shrink-0 border border-pink-100">
                        <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">eBay Image Converter →</p>
                        <p class="text-xs text-[#875F42]">Fix file-not-supported errors and stay under the 12 MB limit</p>
                    </div>
                </a>
                <a href="/solutions/remove-background-webp" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 border border-violet-100">
                        <svg class="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">Background Remover →</p>
                        <p class="text-xs text-[#875F42]">AI cutout with transparent WebP output — great alongside square crops</p>
                    </div>
                </a>
            </div>
        </section>

    </div>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>
