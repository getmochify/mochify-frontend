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
            <h1 class="text-4xl md:text-6xl font-black text-[#4A2C2C] leading-tight tracking-tight mb-3">Mochify</h1>
            <h2 class="text-xs font-semibold tracking-widest uppercase text-[#F06292]/70">AI-POWERED IMAGE WORKFLOWS</h2>
        </header>

        <PromptFormApp />

    </main>

    <div class="mt-12">
        <Footer minimal />
    </div>

</div>
