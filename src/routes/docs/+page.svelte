<script lang="ts">
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    // Every fact on this page comes from the shared reference module, which
    // /llms-full.txt renders as plain text from the same objects. Edit the
    // parameter there, not the markup here, or the two surfaces drift.
    import {
        API_BASE_URL,
        auth,
        plans,
        endpoints,
        squishParams,
        squishRequestHeaders,
        squishResponse,
        squishExamples,
        pdfResponseHeaders,
        pdfExamples,
        checkTokensFields,
        errors,
        pdfOps,
        pdfParams,
        pdfJpegNote,
        pdfOptimizeNotes,
        pdfExtractNote,
        pdfStorageParams,
        pdfStorageNote,
        pdfLimits
    } from '$lib/data/apiReference.js';

    const squish = endpoints.find((e) => e.id === 'squish')!;
    const pdf = endpoints.find((e) => e.id === 'pdf')!;
    const checkTokens = endpoints.find((e) => e.id === 'check-tokens')!;
    // The overview tiles quote monthly allowances, so the Day Pass (a 24-hour
    // allowance) has no tile to sit in.
    const subscriptionPlans = plans
        .filter((p) => p.name !== 'Day Pass')
        .map((p) => ({ ...p, headlineOps: p.name === 'Free' ? '25' : p.opsPerMonth }));

    const statusColor = (tone: string) =>
        tone === 'ok' ? 'text-[#A5D6A7]' : tone === 'warn' ? 'text-[#FFB74D]' : 'text-[#EF5350]';

    let activeSection = $state('overview');

    const sections = [
        { id: 'overview', label: 'Overview' },
        { id: 'authentication', label: 'Authentication' },
        { id: 'squish', label: 'POST /v1/squish' },
        { id: 'pdf', label: 'POST /v1/pdf' },
        { id: 'check-tokens', label: 'GET /v1/checkTokens' },
        { id: 'errors', label: 'Errors' },
    ];

    let clickScrolling = false;
    let clickScrollTimer: ReturnType<typeof setTimeout>;

    function scrollTo(id: string) {
        activeSection = id;
        clickScrolling = true;
        clearTimeout(clickScrollTimer);
        clickScrollTimer = setTimeout(() => { clickScrolling = false; }, 1000);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    $effect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (clickScrolling) return;
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        activeSection = entry.target.id;
                    }
                }
            },
            { rootMargin: '-15% 0px -75% 0px', threshold: 0 }
        );

        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    });
</script>

<svelte:head>
    <title>API Documentation | Mochify</title>
    <meta name="description" content="Mochify REST API reference. Compress and convert images programmatically. 3 ops free without an account, or 25/month with a free account.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mochify.app/docs">
    <meta property="og:title" content="API Documentation | Mochify">
    <meta property="og:description" content="Mochify REST API reference. Compress and convert images programmatically. 3 ops free without an account, or 25/month with a free account.">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Mochify API Reference",
        "description": "REST API for image compression and conversion. 3 free operations per month without an account. Create a free account for 25 operations per month. Seller and Pro plans include a Bearer-token API key.",
        "url": "https://mochify.app/docs",
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "about": {
            "@type": "SoftwareApplication",
            "name": "Mochify API",
            "applicationCategory": "DeveloperApplication"
        }
    }</script>
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] flex flex-col relative">

    <div class="fixed inset-0 pointer-events-none opacity-20"
         style="background-image: radial-gradient(circle at 15% 15%, #F0629212 0%, transparent 50%), radial-gradient(circle at 85% 85%, #A5D6A712 0%, transparent 50%);">
    </div>

    <Navigation />

    <div class="relative z-10 flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <!-- Header -->
        <div class="mb-12">
            <div class="flex items-center gap-3 mb-4">
                <span class="inline-block px-3 py-1 rounded-full bg-[#FFF5F7] text-[#F06292] text-xs font-black uppercase tracking-wider">REST API</span>
                <span class="text-[#875F42]/40 text-sm">v1</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-black text-[#4A2C2C] tracking-tight mb-4">
                API Reference
            </h1>
            <p class="text-[#6C3F31]/70 text-lg max-w-2xl">
                Process images programmatically. Try 3 ops free without signing up, or create a free account for 25/month.
                <a href="/pricing" class="text-[#F06292] font-semibold hover:underline">Seller and Pro</a> plans unlock more with an API key.
            </p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">

            <!-- Sidebar nav -->
            <aside class="lg:w-52 flex-shrink-0">
                <nav class="lg:sticky lg:top-8 flex flex-row lg:flex-col gap-1 flex-wrap">
                    {#each sections as s}
                        <button
                            onclick={() => scrollTo(s.id)}
                            class="text-left px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer {activeSection === s.id ? 'bg-[#FFF5F7] text-[#F06292] font-bold' : 'text-[#875F42]/70 hover:text-[#6C3F31] hover:bg-white/60'}"
                        >
                            {s.label}
                        </button>
                    {/each}
                </nav>
            </aside>

            <!-- Main content -->
            <main class="flex-1 min-w-0 space-y-16">

                <!-- Overview -->
                <section id="overview">
                    <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Overview</h2>
                    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 space-y-4">
                        <p class="text-[#6C3F31] leading-relaxed">
                            All API requests are made to the base URL:
                        </p>
                        <div class="bg-[#FFF5F7] rounded-2xl px-5 py-4 font-mono text-sm text-[#4A2C2C] font-bold select-all">
                            {API_BASE_URL}
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
                            {#each subscriptionPlans as plan}
                                <div class="bg-[#FDFBF7] rounded-2xl border {plan.name === 'Free' ? 'border-pink-50' : 'border-[#F06292]/15'} p-4">
                                    <p class="text-xs font-black {plan.name === 'Free' ? 'text-[#875F42]/60' : 'text-[#F06292]/70'} uppercase tracking-wider mb-1">{plan.name === 'Free' ? 'Free account' : `${plan.name} tier`}</p>
                                    <p class="text-2xl font-black text-[#4A2C2C]">{plan.headlineOps}</p>
                                    <p class="text-xs text-[#6C3F31]/60 mt-0.5">{plan.name === 'Free' ? 'ops/mo · 3 without signup' : 'operations / month'}</p>
                                </div>
                            {/each}
                            <div class="bg-[#FDFBF7] rounded-2xl border border-pink-50 p-4">
                                <p class="text-xs font-black text-[#875F42]/60 uppercase tracking-wider mb-1">Max file size</p>
                                <p class="text-2xl font-black text-[#4A2C2C]">75 MB</p>
                                <p class="text-xs text-[#6C3F31]/60 mt-0.5">paid plans · 20 MB free</p>
                            </div>
                        </div>
                        <p class="text-sm text-[#6C3F31]/70 leading-relaxed pt-2">
                            Without an account: 3 ops/month (IP-based). Free account: 25 ops/month. Paid API keys use per-key limits.
                            Each image returned counts as one operation, however many transformations were applied to it. A request for multiple formats or sizes of one file returns multiple images and costs one operation per output.
                        </p>
                    </div>
                </section>

                <!-- Authentication -->
                <section id="authentication">
                    <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Authentication</h2>
                    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 space-y-5">
                        <p class="api-prose text-[#6C3F31] leading-relaxed">{@html auth.summary}</p>
                        <div class="rounded-2xl overflow-hidden border border-pink-100">
                            <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                <span class="text-[#F06292] text-xs font-black uppercase tracking-wider">Header</span>
                            </div>
                            <pre class="bg-[#2E1A14] text-[#FFB3C6] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed"><code>{auth.header}</code></pre>
                        </div>
                        {#each auth.notes as note}
                            <div class="bg-[#FFFBF0] border border-[#FFD54F]/40 rounded-2xl px-5 py-4 flex gap-3">
                                <span class="text-[#F57C00] text-lg flex-shrink-0">!</span>
                                <p class="api-prose text-sm text-[#6C3F31]/80 leading-relaxed">{@html note}</p>
                            </div>
                        {/each}
                    </div>
                </section>

                <!-- POST /v1/squish -->
                <section id="squish">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="px-2.5 py-1 rounded-lg bg-[#F06292] text-white text-xs font-black uppercase tracking-wide">{squish.method}</span>
                        <h2 class="text-2xl font-black text-[#4A2C2C] font-mono">{squish.path}</h2>
                    </div>
                    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 space-y-6">
                        <p class="api-prose text-[#6C3F31] leading-relaxed">{@html squish.summary}</p>

                        <!-- Query parameters -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Query Parameters</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Parameter</span>
                                    <span>Default</span>
                                    <span>Description</span>
                                </div>
                                {#each squishParams as param, i}
                                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm {i % 2 === 1 ? 'bg-[#FDFBF7]' : ''}">
                                        <div>
                                            <code class="font-mono text-[#F06292] font-bold">{param.name}</code>
                                            {#if param.alias}
                                                <p class="text-[#875F42]/50 text-xs mt-1">alias: <code class="font-mono">{param.alias}</code></p>
                                            {/if}
                                        </div>
                                        <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">{param.default ?? '-'}</span>
                                        <div>
                                            <p class="api-prose text-[#6C3F31]">{@html param.description}</p>
                                            {#if param.valuesNote}
                                                <p class="api-prose text-[#875F42]/60 text-xs mt-1">{@html param.valuesNote}</p>
                                            {/if}
                                            {#if param.more}
                                                <p class="api-prose text-[#6C3F31] mt-2">{@html param.more}</p>
                                            {/if}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <!-- Request headers -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Request Headers</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                {#each squishRequestHeaders as header}
                                    <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                        <code class="font-mono text-[#F06292] font-bold">{header.name}</code>
                                        <p class="api-prose text-[#6C3F31]">{@html header.description}</p>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <!-- Response -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Response</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Header / Field</span>
                                    <span>Description</span>
                                </div>
                                {#each squishResponse as field, i}
                                    <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm {i % 2 === 1 ? 'bg-[#FDFBF7]' : ''}">
                                        {#if field.name === 'Body'}
                                            <span class="text-[#4A2C2C] font-semibold">{field.name}</span>
                                        {:else}
                                            <code class="font-mono text-[#F06292] font-bold">{field.name}</code>
                                        {/if}
                                        <p class="api-prose text-[#6C3F31]">{@html field.description}</p>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <!-- Examples -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Examples</h3>
                            <div class="space-y-3">
                                {#each squishExamples as example}
                                    <div class="rounded-2xl overflow-hidden border border-pink-100">
                                        <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                            <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">{example.label}</span>
                                        </div>
                                        <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>{example.code}</code></pre>
                                    </div>
                                {/each}
                            </div>
                        </div>

                    </div>
                </section>

                <!-- POST /v1/pdf -->
                <section id="pdf">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="px-2.5 py-1 rounded-lg bg-[#F06292] text-white text-xs font-black uppercase tracking-wide">{pdf.method}</span>
                        <h2 class="text-2xl font-black text-[#4A2C2C] font-mono">{pdf.path}</h2>
                    </div>
                    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 space-y-6">
                        <p class="api-prose text-[#6C3F31] leading-relaxed">{@html pdf.summary}</p>

                        <!-- Operations -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Operations</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[auto_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>op</span>
                                    <span>Returns</span>
                                    <span>Description</span>
                                </div>
                                {#each pdfOps as op, i}
                                    <div class="grid grid-cols-[auto_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm {i % 2 === 1 ? 'bg-[#FDFBF7]' : ''}">
                                        <code class="font-mono text-[#F06292] font-bold">{op.op}</code>
                                        <span class="text-[#875F42]/60 font-mono text-xs mt-0.5">{op.returns}</span>
                                        <p class="api-prose text-[#6C3F31]">{@html op.description}</p>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <div class="rounded-2xl bg-[#FFF5F7] border border-pink-100 px-5 py-4">
                            <p class="api-prose text-[#6C3F31] text-sm leading-relaxed">{@html pdfJpegNote}</p>
                        </div>

                        {#each Object.entries(pdfParams) as [op, params]}
                            <div>
                                <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Parameters: op={op}</h3>
                                <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                        <span>Parameter</span>
                                        <span>Default</span>
                                        <span>Description</span>
                                    </div>
                                    {#each params as param, i}
                                        <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm {i % 2 === 1 ? 'bg-[#FDFBF7]' : ''}">
                                            <code class="font-mono text-[#F06292] font-bold">{param.name}</code>
                                            <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">{param.default ?? '-'}</span>
                                            <div>
                                                <p class="api-prose text-[#6C3F31]">{@html param.description}</p>
                                                {#if param.valuesNote}
                                                    <p class="api-prose text-[#875F42]/60 text-xs mt-1">{@html param.valuesNote}</p>
                                                {/if}
                                                {#if param.more}
                                                    <p class="api-prose text-[#6C3F31] mt-2">{@html param.more}</p>
                                                {/if}
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                                {#if op === 'optimize'}
                                    <div class="mt-3 space-y-2">
                                        {#each pdfOptimizeNotes as note}
                                            <p class="api-prose text-sm text-[#6C3F31]/80 leading-relaxed">{@html note}</p>
                                        {/each}
                                    </div>
                                {/if}
                                {#if op === 'extract'}
                                    <p class="api-prose mt-3 text-sm text-[#6C3F31]/80 leading-relaxed">{@html pdfExtractNote}</p>
                                {/if}
                            </div>
                        {/each}

                        <!-- Saving to your own storage -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Saving to your own storage</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Parameter</span>
                                    <span>Default</span>
                                    <span>Description</span>
                                </div>
                                {#each pdfStorageParams as param, i}
                                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm {i % 2 === 1 ? 'bg-[#FDFBF7]' : ''}">
                                        <code class="font-mono text-[#F06292] font-bold">{param.name}</code>
                                        <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">{param.default ?? '-'}</span>
                                        <div>
                                            <p class="api-prose text-[#6C3F31]">{@html param.description}</p>
                                            {#if param.more}
                                                <p class="api-prose text-[#6C3F31] mt-2">{@html param.more}</p>
                                            {/if}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                            <p class="api-prose mt-3 text-sm text-[#6C3F31]/80 leading-relaxed">{@html pdfStorageNote}</p>
                        </div>

                        <!-- Plans and limits -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Plans and limits</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                {#each pdfLimits as limit, i}
                                    <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm {i % 2 === 1 ? 'bg-[#FDFBF7]' : ''}">
                                        <span class="api-prose text-[#4A2C2C] font-semibold">{@html limit.name}</span>
                                        <p class="api-prose text-[#6C3F31]">{@html limit.description}</p>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <!-- Response headers -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Response Headers</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Header</span>
                                    <span>Description</span>
                                </div>
                                {#each pdfResponseHeaders as header, i}
                                    <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm {i % 2 === 1 ? 'bg-[#FDFBF7]' : ''}">
                                        <code class="font-mono text-[#F06292] font-bold">{header.name}</code>
                                        <p class="api-prose text-[#6C3F31]">{@html header.description}</p>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <!-- Examples -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Examples</h3>
                            <div class="space-y-3">
                                {#each pdfExamples as example}
                                    <div class="rounded-2xl overflow-hidden border border-pink-100">
                                        <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                            <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">{example.label}</span>
                                        </div>
                                        <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>{example.code}</code></pre>
                                    </div>
                                {/each}
                            </div>
                        </div>

                    </div>
                </section>

                <!-- GET /v1/checkTokens -->
                <section id="check-tokens">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="px-2.5 py-1 rounded-lg bg-[#A5D6A7] text-[#2E7D32] text-xs font-black uppercase tracking-wide">{checkTokens.method}</span>
                        <h2 class="text-2xl font-black text-[#4A2C2C] font-mono">{checkTokens.path}</h2>
                    </div>
                    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 space-y-6">
                        <p class="api-prose text-[#6C3F31] leading-relaxed">{@html checkTokens.summary}</p>
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Response</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Field</span>
                                    <span>Type</span>
                                    <span>Description</span>
                                </div>
                                {#each checkTokensFields as field, i}
                                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm {i % 2 === 1 ? 'bg-[#FDFBF7]' : ''}">
                                        <code class="font-mono text-[#F06292] font-bold">{field.name}</code>
                                        <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">{field.type}</span>
                                        <p class="api-prose text-[#6C3F31]">{@html field.description}</p>
                                    </div>
                                {/each}
                            </div>
                        </div>
                        {#each checkTokens.examples ?? [] as example}
                            <div class="rounded-2xl overflow-hidden border border-pink-100">
                                <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                    <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">{example.label}</span>
                                </div>
                                <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>{example.code}</code></pre>
                            </div>
                        {/each}
                    </div>
                </section>

                <!-- Errors -->
                <section id="errors">
                    <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Errors</h2>
                    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 space-y-4">
                        <p class="text-[#6C3F31] leading-relaxed">
                            The API uses standard HTTP status codes.
                        </p>
                        <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                <span>Status</span>
                                <span>Meaning</span>
                            </div>
                            {#each errors as error, i}
                                <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm {i % 2 === 1 ? 'bg-[#FDFBF7]' : ''}">
                                    <code class="font-mono font-black {statusColor(error.tone)}">{error.status}</code>
                                    <p class="api-prose text-[#6C3F31]">{@html error.description}</p>
                                </div>
                            {/each}
                        </div>
                    </div>
                </section>


                <!-- CTA -->
                <div class="bg-gradient-to-br from-[#FFF0F5] to-white rounded-3xl border border-[#F06292]/20 shadow-sm p-8 text-center">
                    <h3 class="text-xl font-black text-[#4A2C2C] mb-2">Need more operations?</h3>
                    <p class="text-[#6C3F31]/70 text-sm mb-6">Upgrade to Pro for 1,200 operations/month and a dedicated API key.</p>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <a href="/pricing" class="px-6 py-3 rounded-2xl bg-[#F06292] text-white text-sm font-black hover:bg-[#E0527F] transition-all shadow-sm hover:shadow-md">
                            View pricing
                        </a>
                        <a href="/dashboard" class="px-6 py-3 rounded-2xl border border-[#875F42]/15 text-sm font-black text-[#6C3F31] hover:border-[#F06292]/30 hover:text-[#F06292] hover:bg-[#FFF5F7] transition-all">
                            Get your API key
                        </a>
                    </div>
                </div>

            </main>
        </div>
    </div>

    <div class="mt-16 md:mt-24">
        <Footer />
    </div>
</div>

<style>
    /* Descriptions come from the shared reference module as small HTML
       fragments, so the inline <code> in them cannot carry Tailwind classes the
       way the hand-written markup did. This reproduces exactly what
       `font-mono text-xs` rendered, and the anchor styling the prose had. */
    .api-prose :global(code) {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.75rem;
        line-height: 1rem;
    }
    .api-prose :global(a) {
        color: #f06292;
        font-weight: 600;
    }
    .api-prose :global(a:hover) {
        text-decoration: underline;
    }
</style>
