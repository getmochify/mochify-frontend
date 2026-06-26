<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';

    const platforms = ['Shopify', 'Etsy', 'eBay', 'Amazon', 'Vinted', 'Lightroom', 'HEIC', 'AVIF', 'WebP'];
</script>

<svelte:head>
    <title>Mochify — Image compression for agents, builders, and creators</title>
    <meta name="description" content="Compress images from your AI agent via MCP, automate workflows with the CLI, or use Magic Flow in the browser. Privacy-first, zero-persistence image optimization.">
    <link rel="canonical" href="https://mochify.app" />
</svelte:head>

<!-- Minimal nav -->
<header class="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0D1117]/80 backdrop-blur-md">
    <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 font-[Outfit] font-black text-white text-lg tracking-tight">
            <span class="text-mochi-pink">✦</span> mochify
        </a>
        <div class="flex items-center gap-4 sm:gap-5">
            <a href="/pricing" class="hidden sm:block text-slate-400 hover:text-white text-sm transition-colors">Pricing</a>
            <a href="/docs" class="hidden sm:block text-slate-400 hover:text-white text-sm transition-colors">Docs</a>
            <a href="/guides" class="hidden sm:block text-slate-400 hover:text-white text-sm transition-colors">Guides</a>
            <a href="/auth/login" class="hidden sm:block text-slate-400 hover:text-white text-sm transition-colors">Sign in</a>
            <a href="/" class="px-4 py-1.5 rounded-xl bg-mochi-pink hover:bg-[#E91E63] text-white text-sm font-bold transition-colors shadow-md">
                Launch App
            </a>
        </div>
    </div>
</header>

<!-- ── Developer / Agent section ─────────────────────────────── -->
<section class="relative min-h-screen bg-[#0D1117] flex flex-col justify-center pt-14 overflow-hidden">

    <!-- Subtle grid texture -->
    <div class="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(240,98,146,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(240,98,146,0.04)_1px,transparent_1px)] [background-size:48px_48px]"></div>

    <!-- Pink radial glow -->
    <div class="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_900px_600px_at_50%_45%,rgba(240,98,146,0.09)_0%,transparent_70%)]"></div>

    <!-- Corner vignettes -->
    <div class="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_100%_60%_at_0%_0%,rgba(240,98,146,0.04),transparent),radial-gradient(ellipse_100%_60%_at_100%_100%,rgba(240,98,146,0.04),transparent)]"></div>

    <div class="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">

        <!-- Eyebrow badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-mochi-pink/30 bg-mochi-pink/10 text-mochi-pink text-xs font-bold uppercase tracking-widest mb-8">
            <span class="w-1.5 h-1.5 rounded-full bg-mochi-pink animate-pulse"></span>
            For developers &amp; agents
        </div>

        <!-- Headline -->
        <h1 class="font-[Outfit] font-black text-4xl md:text-6xl text-white leading-[1.1] tracking-tight mb-6">
            Image compression,<br>in your agent.
        </h1>

        <!-- Sub-copy -->
        <p class="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
            Install the CLI or connect via MCP — Mochify works inside Claude, Cursor, Windsurf, and any workflow that speaks natural language.
        </p>

        <!-- Inert dark frosted-glass prompt card -->
        <div class="relative mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-1 shadow-[0_0_80px_rgba(240,98,146,0.10)] mb-10">
            <div class="rounded-xl bg-white/[0.03] px-5 py-4 text-left">
                <p class="text-[10px] text-slate-600 font-mono mb-2.5 uppercase tracking-widest">Magic Flow</p>
                <p class="font-[Quicksand] text-slate-200 text-base leading-relaxed">
                    convert to jpg, resize to 1200px and 800px<span class="inline-block w-0.5 h-[1em] bg-mochi-pink animate-pulse ml-0.5 translate-y-[0.1em]"></span>
                </p>
            </div>
            <div class="flex items-center justify-between px-4 py-2.5">
                <span class="text-xs text-slate-600 font-mono">2 files attached</span>
                <button disabled class="px-4 py-1.5 rounded-xl bg-mochi-pink/25 text-mochi-pink/50 text-sm font-bold cursor-not-allowed select-none">
                    Compress →
                </button>
            </div>
        </div>

        <!-- CTAs -->
        <div class="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a href="/docs" class="px-6 py-3 rounded-2xl bg-white text-[#0D1117] font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg">
                Install CLI
            </a>
            <a href="/guides/mochify-mcp-image-compression-agent-2026" class="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-colors">
                Connect MCP →
            </a>
        </div>

        <!-- CLI code hint -->
        <div class="inline-block rounded-xl border border-white/10 bg-black/40 px-5 py-3 font-mono text-sm text-left">
            <span class="text-mochi-pink select-none">$ </span><span class="text-slate-300">mochify</span> <span class="text-slate-400">*.jpg</span> <span class="text-slate-500">--prompt</span> <span class="text-green-400">"convert to jpg, resize to 1200px"</span>
        </div>

    </div>
</section>

<!-- ── Web App / Creators section ────────────────────────────── -->
<section class="relative bg-[#FDFBF7] min-h-screen flex flex-col justify-center overflow-hidden">

    <!-- Ambient blobs -->
    <div class="pointer-events-none absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-pink-100/70 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-amber-100/60 blur-3xl"></div>
    <div class="pointer-events-none absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-rose-50/80 blur-2xl -translate-y-1/2"></div>

    <div class="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">

        <!-- Eyebrow badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-200 bg-pink-50 text-mochi-pink text-xs font-bold uppercase tracking-widest mb-8">
            For creators &amp; sellers
        </div>

        <!-- Headline -->
        <h2 class="font-[Outfit] font-black text-4xl md:text-6xl text-[#4A2C2C] leading-[1.1] tracking-tight mb-6">
            Describe it.<br>Download it.
        </h2>

        <!-- Sub-copy -->
        <p class="text-cocoa-deep text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
            Upload your photos and tell Mochify what you need in plain English — format, size, quality, metadata. No settings menus, no guesswork. Done in seconds.
        </p>

        <!-- Main CTA -->
        <a href="/" class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-mochi-pink hover:bg-[#E91E63] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mb-14">
            Launch App <span aria-hidden="true">→</span>
        </a>

        <!-- Platform badges -->
        <div class="flex flex-wrap justify-center items-center gap-2">
            {#each platforms as platform}
                <span class="px-3 py-1.5 rounded-full bg-white border border-pink-100 text-cocoa-deep text-xs font-semibold shadow-sm">
                    {platform}
                </span>
            {/each}
        </div>

    </div>
</section>

<Footer />
