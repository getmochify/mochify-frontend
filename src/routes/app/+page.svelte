<script lang="ts">
    import PromptFormApp from '$lib/components/PromptFormApp.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
    <title>Mochify</title>
    <meta name="robots" content="noindex">
</svelte:head>

<div class="min-h-screen selection:bg-[#FFF0F3] selection:text-pink-900 flex flex-col relative">

    <Navigation />

    <main class="relative z-10 flex-grow w-full max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center justify-center">

        <header class="text-center mb-10">
            <p class="text-xs font-bold tracking-[0.18em] uppercase text-[#F06292]/80 mb-4">Images · Video · PDFs</p>
            <h1 class="font-heading text-4xl md:text-6xl font-black text-[#4A2C2C] leading-tight tracking-tight text-balance max-w-3xl mx-auto mb-3">Drop your images. <span class="text-[#F06292]">Tell us what you need.</span></h1>
            <p class="text-base md:text-lg text-[#875F42] max-w-lg mx-auto leading-relaxed text-pretty">Smart compression for product photos, websites, and everything else — no format pickers, no quality sliders.</p>
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
            <span class="font-bold">AVIF · JPEG XL · WebP · Jpegli</span>
        </div>

    </main>

    <div class="mt-12">
        <Footer minimal />
    </div>

</div>
