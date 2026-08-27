<script lang="ts">
    import PromptFormApp from '$lib/components/PromptFormApp.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
    <title>Convert, Resize and Compress Images, Video and PDFs | Mochify</title>
    <meta name="description" content="Drop images, PDFs or video and say what you need in plain English: convert, resize, smart crop, remove backgrounds, extract audio, compress. 3 files free, no sign-up.">

    <!-- canonical, og:image and twitter:image are injected by the root layout. -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://mochify.app/flow" />
    <meta property="og:title" content="Convert, Resize and Compress Images, Video and PDFs | Mochify" />
    <meta property="og:description" content="Say what you need in plain English and Mochify does it. Convert, resize, smart crop, remove backgrounds, rasterize PDF pages, pull audio out of video. No format pickers." />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Convert, Resize and Compress Images, Video and PDFs | Mochify" />
    <meta name="twitter:description" content="Say what you need in plain English and Mochify does it. Convert, resize, smart crop, remove backgrounds, rasterize PDF pages, pull audio out of video. No format pickers." />
</svelte:head>

<div class="min-h-screen flex flex-col relative">

    <Navigation />

    <main class="relative z-10 flex-grow w-full max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center justify-center">

        <header class="text-center mb-10">
            <p class="text-xs font-bold tracking-[0.18em] uppercase text-[#F06292]/80 mb-4">Images · Video · PDFs</p>
            <h1 class="font-heading text-4xl md:text-6xl font-black text-[#4A2C2C] leading-tight tracking-tight text-balance max-w-3xl mx-auto mb-3">Drop your files<span class="text-[#F06292]">.</span> <span class="text-[#F06292]">Tell us what you need<span class="text-[#6C3F31]">.</span></span></h1>
            <p class="text-base md:text-lg text-[#875F42] max-w-xl mx-auto leading-relaxed text-pretty">Convert, resize, crop, remove backgrounds, rasterize PDF pages or pull the audio out of a video. Just describe it. No format pickers, no quality sliders.</p>
        </header>

        <PromptFormApp />

        <!-- Capability / trust strip -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-sm text-[#6C3F31]">
            <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                <span class="font-bold">Zero-retention</span>
            </span>
            <span class="text-pink-200" aria-hidden="true">·</span>
            <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
                <span class="font-bold">25 free / month</span>
            </span>
            <span class="text-pink-200" aria-hidden="true">·</span>
            <span class="font-bold">AVIF · JPEG XL · WebP · PDF · WebM</span>
        </div>


        <!-- Capability examples · the page is prompt-driven, so the only way a
             first-time visitor (or a crawler) learns the range is to show it.
             Sits below the form so the app itself stays above the fold.
             Four examples per card, styled as filled prompt rows rather than
             bullets: uneven bullet lists left the shorter cards with dead space
             under them, and the rows read as things you would actually type. -->
        <section class="mt-16 w-full max-w-4xl">
            <h2 class="text-center font-heading font-black text-2xl md:text-3xl leading-tight text-[#4A2C2C] mb-2">Compression is just one thing you can ask for</h2>
            <p class="text-center text-[#875F42] mb-8 max-w-xl mx-auto">Type it the way you would say it. Mochify works out the formats, sizes and settings.</p>
            <div class="grid sm:grid-cols-3 gap-5">
                <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6">
                    <div class="flex items-center gap-2.5 mb-4">
                        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3]">
                            <svg class="h-4 w-4 text-[#F06292]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                        </span>
                        <h3 class="font-heading font-bold text-lg text-[#4A2C2C]">Images</h3>
                    </div>
                    <ul class="space-y-2">
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            Convert to WebP and AVIF at 1200px and 500px
                        </li>
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            Remove the background, transparent PNG
                        </li>
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            Square crop and optimize for eBay
                        </li>
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            Make it brighter and add clarity
                        </li>
                    </ul>
                </div>

                <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6">
                    <div class="flex items-center gap-2.5 mb-4">
                        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3]">
                            <svg class="h-4 w-4 text-[#F06292]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                        </span>
                        <h3 class="font-heading font-bold text-lg text-[#4A2C2C]">PDFs</h3>
                    </div>
                    <ul class="space-y-2">
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            Split into individual pages
                        </li>
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            Rasterize to PNG at 150 DPI
                        </li>
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            Convert pages to WebP, 200 DPI
                        </li>
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            High-res rasterize at 300 DPI
                        </li>
                    </ul>
                </div>

                <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6">
                    <div class="flex items-center gap-2.5 mb-4">
                        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3]">
                            <svg class="h-4 w-4 text-[#F06292]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/></svg>
                        </span>
                        <h3 class="font-heading font-bold text-lg text-[#4A2C2C]">Video and audio</h3>
                    </div>
                    <ul class="space-y-2">
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            Convert to WebM for the web
                        </li>
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            Extract the audio as MP3
                        </li>
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            Compress this for sharing
                        </li>
                        <li class="rounded-xl bg-[#FFF0F3] border border-pink-100/60 px-3.5 py-2.5 text-sm text-[#6C3F31] leading-snug">
                            Convert audio to AAC
                        </li>
                    </ul>
                </div>
            </div>
            <p class="text-center text-xs text-[#6C3F31]/60 mt-5">
                All of it works on the free plan. <a href="/pricing" class="text-[#F06292] font-semibold hover:underline">Paid plans</a> raise the monthly allowance, file size and batch size.
            </p>
        </section>

    </main>

    <div class="mt-12">
        <Footer minimal />
    </div>

</div>
