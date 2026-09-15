<script lang="ts">
    import PromptFormApp from '$lib/components/PromptFormApp.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';

    // Bound so the example rows below can load themselves into the compose bar
    // instead of just sitting there looking like buttons that do nothing.
    let form: ReturnType<typeof PromptFormApp> | undefined = $state();

    // Icon paths are inline rather than an icon component: three uses, one file.
    const exampleCards = [
        {
            title: 'Images',
            icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
            examples: [
                'Convert to WebP and AVIF at 1200px and 500px',
                'Remove the background, transparent PNG',
                'Square crop and optimize for eBay',
                'Make it brighter and add clarity'
            ]
        },
        {
            title: 'PDFs',
            icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
            examples: [
                'Split into individual pages',
                'Rasterize to PNG at 150 DPI',
                'Convert pages to WebP, 200 DPI',
                'High-res rasterize at 300 DPI'
            ]
        },
        {
            title: 'Video and audio',
            icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
            examples: [
                'Convert to WebM for the web',
                'Extract the audio as MP3',
                'Compress this for sharing',
                'Convert audio to AAC'
            ]
        }
    ];
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
            <p class="text-base md:text-lg text-[#875F42] max-w-2xl mx-auto leading-relaxed text-pretty">Convert, resize, crop, remove backgrounds, rasterize PDF pages or pull the audio out of a video. Just describe it. No format pickers, no quality sliders.</p>
        </header>

        <PromptFormApp bind:this={form} />

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
             Each row is a real example you can click: it loads into the compose
             bar and scrolls back up. They used to carry the same pink-pill
             styling as the live suggestion chips above the fold while being
             inert, so one visual language meant two things on one page.
             The lists are auto-rows-fr grids rather than stacks: the cards are
             equal-height grid cells, so every row in every card resolves to the
             same height. Wrapping rows no longer leave dead space under the
             shorter cards, and the rows line up across all three. -->
        <section class="mt-16 w-full max-w-4xl">
            <h2 class="text-center font-heading font-black text-2xl md:text-3xl leading-tight text-[#4A2C2C] mb-2">Compression is just one thing you can ask for</h2>
            <p class="text-center text-[#875F42] mb-8 max-w-xl mx-auto">Type it the way you would say it. Mochify works out the formats, sizes and settings. Tap any example to load it.</p>
            <div class="grid sm:grid-cols-3 gap-5">
                {#each exampleCards as card (card.title)}
                    <div class="mochi-card flex h-full flex-col rounded-3xl bg-white p-6">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] shadow-[0_2px_8px_rgba(240,98,146,0.35)]">
                                <svg class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d={card.icon} /></svg>
                            </span>
                            <h3 class="font-heading font-bold text-lg text-[#4A2C2C]">{card.title}</h3>
                        </div>
                        <ul class="grid flex-1 auto-rows-fr list-none gap-2 p-0">
                            {#each card.examples as example (example)}
                                <li class="flex">
                                    <button
                                        type="button"
                                        onclick={() => form?.useExample(example)}
                                        aria-label="Use this example: {example}"
                                        class="mochi-row flex h-full w-full cursor-pointer items-center rounded-2xl px-4 py-2.5 text-left text-sm leading-snug text-[#6C3F31]"
                                    >{example}</button>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>
            <p class="text-center text-sm text-[#6C3F31]/75 mt-6">
                All of it works on the free plan. <a href="/pricing" class="text-[#F06292] font-semibold hover:underline">Paid plans</a> raise the monthly allowance, file size and batch size.
            </p>
        </section>

    </main>

    <div class="mt-12">
        <Footer minimal />
    </div>

</div>

<style>
    /* The example rows were a flat #FFF0F3 fill with a flat 1px border: the only
       pink surfaces on the page with no inner light, which is what made them
       read as unfinished next to the compose bar. These borrow the
       `.liquid-bubble` treatment the app already uses for file thumbnails —
       highlight along the top edge, soft shade below, pink-tinted lift — and a
       16px radius, so the contents are no longer squarer than their 24px card. */
    .mochi-row {
        background: linear-gradient(160deg, #fff5f8 0%, #ffe7ee 100%);
        border: 1px solid rgba(240, 98, 146, 0.12);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -2px 4px rgba(240, 98, 146, 0.07),
            0 1px 2px rgba(240, 98, 146, 0.06);
        transition:
            transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.2s ease,
            background 0.2s ease;
    }

    .mochi-row:hover {
        background: linear-gradient(160deg, #ffffff 0%, #ffeef3 100%);
        transform: translateY(-2px);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1),
            0 8px 18px -6px rgba(240, 98, 146, 0.28);
    }

    /* Squish on press, matching .btn-mochi. */
    .mochi-row:active {
        transform: translateY(0) scale(0.99);
        box-shadow:
            inset 0 2px 5px rgba(240, 98, 146, 0.16),
            0 1px 2px rgba(240, 98, 146, 0.06);
    }

    .mochi-row:focus-visible {
        outline: 2px solid #f06292;
        outline-offset: 2px;
    }

    /* shadow-sm pulled too tight on a 24px radius and made the corners look
       clipped rather than lifted; this matches the compose bar's pink shadow. */
    .mochi-card {
        border: 1px solid rgba(240, 98, 146, 0.14);
        box-shadow:
            0 2px 4px -2px rgba(108, 63, 49, 0.05),
            0 14px 32px -14px rgba(240, 98, 146, 0.24);
    }

    @media (prefers-reduced-motion: reduce) {
        .mochi-row,
        .mochi-row:hover,
        .mochi-row:active {
            transform: none;
            transition: none;
        }
    }
</style>
