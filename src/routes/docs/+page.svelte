<script lang="ts">
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';

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
    <title>API Documentation — Mochify</title>
    <meta name="description" content="Mochify REST API reference. Compress and convert images programmatically — 3 ops free without an account, or 25/month with a free account.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mochify.app/docs">
    <meta property="og:title" content="API Documentation — Mochify">
    <meta property="og:description" content="Mochify REST API reference. Compress and convert images programmatically — 3 ops free without an account, or 25/month with a free account.">
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
                Process images programmatically. Try 3 ops free without signing up — or create a free account for 25/month.
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
                            https://api.mochify.app
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                            <div class="bg-[#FDFBF7] rounded-2xl border border-pink-50 p-4">
                                <p class="text-xs font-black text-[#875F42]/60 uppercase tracking-wider mb-1">Free account</p>
                                <p class="text-2xl font-black text-[#4A2C2C]">25</p>
                                <p class="text-xs text-[#6C3F31]/60 mt-0.5">ops/mo · 3 without signup</p>
                            </div>
                            <div class="bg-[#FDFBF7] rounded-2xl border border-[#F06292]/15 p-4">
                                <p class="text-xs font-black text-[#F06292]/70 uppercase tracking-wider mb-1">Seller tier</p>
                                <p class="text-2xl font-black text-[#4A2C2C]">300</p>
                                <p class="text-xs text-[#6C3F31]/60 mt-0.5">operations / month</p>
                            </div>
                            <div class="bg-[#FDFBF7] rounded-2xl border border-[#F06292]/15 p-4">
                                <p class="text-xs font-black text-[#F06292]/70 uppercase tracking-wider mb-1">Pro tier</p>
                                <p class="text-2xl font-black text-[#4A2C2C]">1,200</p>
                                <p class="text-xs text-[#6C3F31]/60 mt-0.5">operations / month</p>
                            </div>
                            <div class="bg-[#FDFBF7] rounded-2xl border border-pink-50 p-4">
                                <p class="text-xs font-black text-[#875F42]/60 uppercase tracking-wider mb-1">Max file size</p>
                                <p class="text-2xl font-black text-[#4A2C2C]">75 MB</p>
                                <p class="text-xs text-[#6C3F31]/60 mt-0.5">Seller · unlimited Pro · 20 MB free</p>
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
                        <p class="text-[#6C3F31] leading-relaxed">
                            The free tier requires no authentication. Pro API keys are generated from your
                            <a href="/dashboard" class="text-[#F06292] font-semibold hover:underline">dashboard</a>
                            and passed as a Bearer token:
                        </p>
                        <div class="rounded-2xl overflow-hidden border border-pink-100">
                            <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                <span class="text-[#F06292] text-xs font-black uppercase tracking-wider">Header</span>
                            </div>
                            <pre class="bg-[#2E1A14] text-[#FFB3C6] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed"><code>Authorization: Bearer mchy_••••••••••••••••</code></pre>
                        </div>
                        <div class="bg-[#FFFBF0] border border-[#FFD54F]/40 rounded-2xl px-5 py-4 flex gap-3">
                            <span class="text-[#F57C00] text-lg flex-shrink-0">!</span>
                            <p class="text-sm text-[#6C3F31]/80 leading-relaxed">
                                API keys are shown once at creation and cannot be retrieved again. Store them securely.
                                You can regenerate a key from your dashboard at any time.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- POST /v1/squish -->
                <section id="squish">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="px-2.5 py-1 rounded-lg bg-[#F06292] text-white text-xs font-black uppercase tracking-wide">POST</span>
                        <h2 class="text-2xl font-black text-[#4A2C2C] font-mono">/v1/squish</h2>
                    </div>
                    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 space-y-6">
                        <p class="text-[#6C3F31] leading-relaxed">
                            Compress and/or convert a single image. Send the raw image bytes as the request body.
                            Returns the processed image as a binary blob.
                        </p>

                        <!-- Query parameters -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Query Parameters</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Parameter</span>
                                    <span>Default</span>
                                    <span>Description</span>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">type</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">jpg</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Output format.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">One of: <code class="font-mono">jpg</code> · <code class="font-mono">webp</code> · <code class="font-mono">avif</code> · <code class="font-mono">jxl</code></p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">width</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">—</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Target width in pixels. Aspect ratio is preserved unless <code class="font-mono text-xs">smartCrop</code> is also set. Omit or set to <code class="font-mono text-xs">0</code> for unconstrained.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">height</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">—</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Target height in pixels. Omit or set to <code class="font-mono text-xs">0</code> for unconstrained.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">quality</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">auto</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Output quality override (1–100). Overrides smart compression. JXL maps linearly — 70 ≈ distance 3.0. <code class="font-mono text-xs">100</code> is the best <em>lossy</em> setting, not lossless — see <code class="font-mono text-xs">lossless</code>.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">smartCompress</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">false</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Saliency-guided quality selection. High-detail subjects get higher quality, flat areas lower. Accepts <code class="font-mono text-xs">1</code> or <code class="font-mono text-xs">true</code>.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <div>
                                        <code class="font-mono text-[#F06292] font-bold">smartCrop</code>
                                        <p class="text-[#875F42]/50 text-xs mt-1">alias: <code class="font-mono">crop</code></p>
                                    </div>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">false</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Saliency-guided crop — centers the crop on the detected subject. Requires both <code class="font-mono text-xs">width</code> and <code class="font-mono text-xs">height</code>. Accepts <code class="font-mono text-xs">1</code> or <code class="font-mono text-xs">true</code>.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">removeBackground</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">false</span>
                                    <div>
                                        <p class="text-[#6C3F31]">AI background removal. Output is PNG/WebP with alpha channel. JPEG outputs flatten to white. Available on every plan, including Free. Accepts <code class="font-mono text-xs">1</code> or <code class="font-mono text-xs">true</code>.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">rotate</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">0</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Clockwise rotation in degrees.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">Supported values: <code class="font-mono">90</code> · <code class="font-mono">180</code> · <code class="font-mono">270</code></p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">stripExif</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">true</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Strip EXIF metadata from the output. Set to <code class="font-mono text-xs">false</code> or <code class="font-mono text-xs">0</code> to preserve metadata.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">optimizeForWeb</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">false</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Progressive encoding + 4:2:0 chroma subsampling for the smallest browser-delivered file. Accepts <code class="font-mono text-xs">1</code> or <code class="font-mono text-xs">true</code>.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">brightness</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">0</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Exposure adjustment. Range <code class="font-mono text-xs">-100</code> (darkest) to <code class="font-mono text-xs">+100</code> (brightest). <code class="font-mono text-xs">0</code> = no change.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">clarity</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">false</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Midtone contrast enhancement — makes images look crisper and more detailed without affecting overall exposure. Accepts <code class="font-mono text-xs">1</code> or <code class="font-mono text-xs">true</code>.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">hdr</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">false</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Ultra HDR / ISO 21496-1 gain map handling. <code class="font-mono text-xs">1</code> or <code class="font-mono text-xs">true</code> <strong>preserves</strong> a gain map the source already has, and never invents one — silently ignored if the source is not HDR. <code class="font-mono text-xs">generate</code> does that <em>and</em> <strong>synthesises</strong> a gain map when the source is plain SDR.</p>
                                        <p class="text-[#6C3F31] mt-2">Only <code class="font-mono text-xs">jpg</code> output can carry a gain map (<code class="font-mono text-xs">jxl</code> carries HDR by a different route; <code class="font-mono text-xs">avif</code>, <code class="font-mono text-xs">webp</code> and <code class="font-mono text-xs">png</code> cannot). Skipped when combined with <code class="font-mono text-xs">brightness</code>, <code class="font-mono text-xs">clarity</code> or <code class="font-mono text-xs">removeBackground</code>, since those change the base the gain map is a ratio to. Check <code class="font-mono text-xs">X-Mochify-HDR</code> for what was actually emitted.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">lossless</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">false</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Pixel-exact output. Accepts <code class="font-mono text-xs">1</code> or <code class="font-mono text-xs">true</code>, and overrides <code class="font-mono text-xs">quality</code> and <code class="font-mono text-xs">smartCompress</code>.</p>
                                        <p class="text-[#6C3F31] mt-2">Only <code class="font-mono text-xs">jxl</code>, <code class="font-mono text-xs">webp</code> and <code class="font-mono text-xs">png</code> can honour it — <code class="font-mono text-xs">jpg</code> and <code class="font-mono text-xs">avif</code> are rejected with a <code class="font-mono text-xs">400</code> rather than silently encoded lossy. A source that is <em>already</em> lossy (JPEG, AVIF, HEIC) is re-encoded at the highest lossy setting instead, since nothing can restore what that file already discarded. Expect the output to be <strong>larger</strong> than the input: lossless preserves pixels, not file size. Check <code class="font-mono text-xs">X-Mochify-Lossless</code> for what was actually emitted.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- Request headers -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Request Headers</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">Content-Type</code>
                                    <p class="text-[#6C3F31]">MIME type of the uploaded image. E.g. <code class="font-mono text-xs">image/jpeg</code>, <code class="font-mono text-xs">image/webp</code>, <code class="font-mono text-xs">image/avif</code>, <code class="font-mono text-xs">image/png</code>, <code class="font-mono text-xs">image/heic</code>, <code class="font-mono text-xs">image/jxl</code></p>
                                </div>
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
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <span class="text-[#4A2C2C] font-semibold">Body</span>
                                    <p class="text-[#6C3F31]">Raw compressed image bytes. Supported input formats: JPEG, PNG, WebP, AVIF, HEIF, JXL.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">X-Latency-Ms</code>
                                    <p class="text-[#6C3F31]">Processing time in milliseconds.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Optimized</code>
                                    <p class="text-[#6C3F31]"><code class="font-mono text-xs">true</code> if the output is smaller or the format changed; <code class="font-mono text-xs">false</code> if the original was returned unchanged.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Reason</code>
                                    <p class="text-[#6C3F31]">Present when <code class="font-mono text-xs">X-Mochify-Optimized: false</code>. Explains why the original was returned, e.g. <em>"Original was smaller"</em>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Saliency</code>
                                    <p class="text-[#6C3F31]">Saliency score (0.000–1.000). Only present when <code class="font-mono text-xs">smartCompress=true</code>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Quality</code>
                                    <p class="text-[#6C3F31]">Effective quality value used. Only present when <code class="font-mono text-xs">smartCompress=true</code>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-BgRemoved</code>
                                    <p class="text-[#6C3F31]"><code class="font-mono text-xs">true</code> when background removal was applied.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-HDR</code>
                                    <p class="text-[#6C3F31]">Only present when <code class="font-mono text-xs">hdr</code> was requested. <code class="font-mono text-xs">true</code> — the emitted file carries headroom the source captured. <code class="font-mono text-xs">generated</code> — headroom Mochify synthesised. <code class="font-mono text-xs">false</code> — the output carries none. It describes the bytes actually returned, so a format that cannot hold a gain map reports <code class="font-mono text-xs">false</code> even when the source was HDR.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Lossless</code>
                                    <p class="text-[#6C3F31]">Only present when <code class="font-mono text-xs">lossless</code> was requested. <code class="font-mono text-xs">true</code> — the returned bytes reproduce the submitted pixels exactly. <code class="font-mono text-xs">downgraded</code> — they are the best lossy encode instead, because the source was already lossy or because HDR reconstruction replaced the submitted pixels.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Examples -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Examples</h3>
                            <div class="space-y-3">

                                <div class="rounded-2xl overflow-hidden border border-pink-100">
                                    <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                        <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">cURL</span>
                                    </div>
                                    <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>curl -X POST "https://api.mochify.app/v1/squish?type=webp&stripExif=1" \
  -H "Content-Type: image/jpeg" \
  -H "Authorization: Bearer mchy_your_api_key" \
  --data-binary @photo.jpg \
  --output photo.webp</code></pre>
                                </div>

                                <div class="rounded-2xl overflow-hidden border border-pink-100">
                                    <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                        <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">JavaScript</span>
                                    </div>
                                    <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>const file = document.querySelector('input[type="file"]').files[0];

const response = await fetch(
  'https://api.mochify.app/v1/squish?type=avif&stripExif=1',
  &#123;
    method: 'POST',
    headers: &#123;
      'Content-Type': file.type,
      'Authorization': 'Bearer mchy_your_api_key',
    &#125;,
    body: file,
  &#125;
);

const blob = await response.blob();
const latency = response.headers.get('X-Latency-Ms');

// Save the file
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'output.avif';
a.click();</code></pre>
                                </div>

                                <div class="rounded-2xl overflow-hidden border border-pink-100">
                                    <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                        <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">Python</span>
                                    </div>
                                    <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>import requests

with open('photo.jpg', 'rb') as f:
    response = requests.post(
        'https://api.mochify.app/v1/squish',
        params=&#123;'type': 'webp', 'stripExif': '1'&#125;,
        headers=&#123;
            'Content-Type': 'image/jpeg',
            'Authorization': 'Bearer mchy_your_api_key',
        &#125;,
        data=f,
    )

with open('output.webp', 'wb') as out:
    out.write(response.content)

print(f"Done in &#123;response.headers.get('X-Latency-Ms')&#125;ms")</code></pre>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                <!-- POST /v1/pdf -->
                <section id="pdf">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="px-2.5 py-1 rounded-lg bg-[#F06292] text-white text-xs font-black uppercase tracking-wide">POST</span>
                        <h2 class="text-2xl font-black text-[#4A2C2C] font-mono">/v1/pdf</h2>
                    </div>
                    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 space-y-6">
                        <p class="text-[#6C3F31] leading-relaxed">
                            The PDF toolkit. A single endpoint with five operations, selected with <code class="font-mono text-xs">?op=</code>.
                            Four of them take a PDF as the raw request body; <code class="font-mono text-xs">op=create</code> takes images and produces one.
                        </p>

                        <!-- Operations -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Operations</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[auto_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>op</span>
                                    <span>Returns</span>
                                    <span>Description</span>
                                </div>
                                <div class="grid grid-cols-[auto_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">optimize</code>
                                    <span class="text-[#875F42]/60 font-mono text-xs mt-0.5">PDF</span>
                                    <p class="text-[#6C3F31]">Recompress the images inside a PDF, in place, and return a smaller PDF. Text, fonts, vector art, links and layout are untouched, so the document stays searchable.</p>
                                </div>
                                <div class="grid grid-cols-[auto_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">extract</code>
                                    <span class="text-[#875F42]/60 font-mono text-xs mt-0.5">ZIP</span>
                                    <p class="text-[#6C3F31]">Pull the images embedded in a PDF out of it, at the resolution they were stored at. These are the pictures somebody placed into the document, not a render of each page.</p>
                                </div>
                                <div class="grid grid-cols-[auto_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">rasterize</code>
                                    <span class="text-[#875F42]/60 font-mono text-xs mt-0.5">ZIP</span>
                                    <p class="text-[#6C3F31]">Render every page to an image, text and all. The default operation when <code class="font-mono text-xs">op</code> is omitted.</p>
                                </div>
                                <div class="grid grid-cols-[auto_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">split</code>
                                    <span class="text-[#875F42]/60 font-mono text-xs mt-0.5">ZIP</span>
                                    <p class="text-[#6C3F31]">Explode a PDF into one single-page PDF per page. Takes no parameters.</p>
                                </div>
                                <div class="grid grid-cols-[auto_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">create</code>
                                    <span class="text-[#875F42]/60 font-mono text-xs mt-0.5">PDF</span>
                                    <p class="text-[#6C3F31]">Build a PDF from images, one page per image in upload order. Send a single raw image body, or a <code class="font-mono text-xs">multipart/form-data</code> upload with each file appended as <code class="font-mono text-xs">images</code>.</p>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-2xl bg-[#FFF5F7] border border-pink-100 px-5 py-4">
                            <p class="text-[#6C3F31] text-sm leading-relaxed">
                                <strong class="text-[#4A2C2C]">Images inside a PDF are always JPEG.</strong>
                                The PDF format has no WebP, AVIF or JXL, so <code class="font-mono text-xs">op=optimize</code> re-encodes with jpegli and nothing else is offered.
                                Those formats <em>are</em> available from <code class="font-mono text-xs">op=extract</code>, which writes files out rather than back into the document.
                            </p>
                        </div>

                        <!-- op=optimize -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Parameters: op=optimize</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Parameter</span>
                                    <span>Default</span>
                                    <span>Description</span>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">quality</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">75</span>
                                    <p class="text-[#6C3F31]">jpegli quality for the re-encode (1&ndash;100). Lower is smaller.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">maxDpi</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">150</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Target resolution, measured against how large each image is actually <em>drawn</em> on the page rather than how many pixels it stores. Use 96 for screen and email, 150 for general use, 300 to keep print quality. Set <code class="font-mono text-xs">0</code> to disable and rely on <code class="font-mono text-xs">maxDimension</code> alone.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">A 4000px photo placed in a two-inch box is 2000 DPI of waste; the same photo full-bleed on A4 is not. Only the drawn size can tell those apart, so it is read from the content stream. An image drawn at several sizes is targeted at its largest, never its average.</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">maxDimension</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">2000</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Absolute backstop applied alongside <code class="font-mono text-xs">maxDpi</code>: no image keeps a side longer than this. It is what limits an image the placement scan never saw drawn. Set <code class="font-mono text-xs">0</code> to remove the cap.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">Resizing is layout-safe: a PDF image is drawn into the unit square, so changing its pixel size cannot move or rescale it on the page.</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">minSize</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">64</span>
                                    <p class="text-[#6C3F31]">Leave images smaller than this (on either axis) untouched. Keeps spacers, rules and bullet glyphs out of the work.</p>
                                </div>
                            </div>
                            <div class="mt-3 space-y-2 text-sm text-[#6C3F31]">
                                <p><strong class="text-[#4A2C2C]">It never returns a larger file.</strong> If recompression would not help, the original bytes come back and <code class="font-mono text-xs">X-Mochify-Saved-Pct</code> is <code class="font-mono text-xs">0</code>. Running it twice changes nothing.</p>
                                <p><strong class="text-[#4A2C2C]">It never drops what it cannot handle.</strong> Images in encodings outside the supported set (CMYK, indexed palettes, JPEG 2000, CCITT and JBIG2 scans, stencil masks) are passed through byte-for-byte rather than skipped.</p>
                            </div>
                        </div>

                        <!-- op=extract -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Parameters: op=extract</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Parameter</span>
                                    <span>Default</span>
                                    <span>Description</span>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">type</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">original</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Output format for the extracted files.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">One of: <code class="font-mono">original</code> · <code class="font-mono">png</code> · <code class="font-mono">jpg</code> · <code class="font-mono">webp</code> · <code class="font-mono">avif</code> · <code class="font-mono">jxl</code></p>
                                        <p class="text-[#875F42]/60 text-xs mt-1"><code class="font-mono">original</code> copies each embedded JPEG out byte-for-byte, with no re-encode and no quality loss; images stored in other encodings come out as lossless PNG. Setting <code class="font-mono">maxWidth</code> forces a re-encode.</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">quality</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">82</span>
                                    <p class="text-[#6C3F31]">Output quality (1&ndash;100). Ignored for <code class="font-mono text-xs">original</code> and <code class="font-mono text-xs">png</code>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">maxWidth</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">0</span>
                                    <p class="text-[#6C3F31]">Cap the width of each extracted image, preserving aspect ratio. <code class="font-mono text-xs">0</code> leaves sizes alone.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">minSize</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">64</span>
                                    <p class="text-[#6C3F31]">Skip images smaller than this on either axis. Exported PDFs are full of 1&times;1 spacers and hairline rules; without a floor the archive is mostly junk. Set <code class="font-mono text-xs">0</code> to take everything.</p>
                                </div>
                            </div>
                            <p class="mt-3 text-sm text-[#6C3F31]">An image repeated across pages, such as a logo or letterhead, is returned once rather than once per page. Files are named <code class="font-mono text-xs">page-003-image-002.webp</code>, recording the page each image was first found on.</p>
                        </div>

                        <!-- op=rasterize -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Parameters: op=rasterize</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Parameter</span>
                                    <span>Default</span>
                                    <span>Description</span>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">type</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">png</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Output image format for each rendered page.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">One of: <code class="font-mono">png</code> · <code class="font-mono">jpg</code> · <code class="font-mono">webp</code> · <code class="font-mono">avif</code> · <code class="font-mono">jxl</code></p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">dpi</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">150</span>
                                    <p class="text-[#6C3F31]">Render resolution, 36&ndash;300. Use 72 for screen previews, 300 for print.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">quality</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">82</span>
                                    <p class="text-[#6C3F31]">Output quality (1&ndash;100). Ignored for <code class="font-mono text-xs">png</code>.</p>
                                </div>
                            </div>
                        </div>

                        <!-- op=create -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Parameters: op=create</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Parameter</span>
                                    <span>Default</span>
                                    <span>Description</span>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">page</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">fit</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Page size. <code class="font-mono text-xs">fit</code> makes each page exactly the image, with no whitespace.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">One of: <code class="font-mono">fit</code> · <code class="font-mono">a4</code> · <code class="font-mono">letter</code></p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">quality</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">82</span>
                                    <p class="text-[#6C3F31]">jpegli quality (1&ndash;100) for the JPEG embedded in each page.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">dpi</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">96</span>
                                    <p class="text-[#6C3F31]">Pixels per inch used to size a <code class="font-mono text-xs">fit</code> page, 36&ndash;600.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">maxWidth</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">0</span>
                                    <p class="text-[#6C3F31]">Downscale images wider than this before embedding. <code class="font-mono text-xs">0</code> leaves them alone.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">combine</code>
                                    <span class="text-[#875F42]/40 font-mono text-xs mt-0.5">1</span>
                                    <p class="text-[#6C3F31]">Set to <code class="font-mono text-xs">0</code> to get one single-page PDF per image, returned as a ZIP, instead of one combined document.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Plans and limits -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Plans and limits</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <span class="text-[#4A2C2C] font-bold">Plan access</span>
                                    <p class="text-[#6C3F31]"><code class="font-mono text-xs">optimize</code>, <code class="font-mono text-xs">extract</code>, <code class="font-mono text-xs">rasterize</code> and <code class="font-mono text-xs">split</code> require a paid plan (Seller, Pro, Growth, or Day Pass). <code class="font-mono text-xs">create</code> is available on every plan, including Free.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <span class="text-[#4A2C2C] font-bold">Request body</span>
                                    <p class="text-[#6C3F31]">100 MB maximum.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <span class="text-[#4A2C2C] font-bold">Pages</span>
                                    <p class="text-[#6C3F31]">200 absolute. For the PDF-in operations, Growth is unlimited within that and other paid plans cap at 10 pages.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <span class="text-[#4A2C2C] font-bold">Images per <code class="font-mono text-xs">create</code></span>
                                    <p class="text-[#6C3F31]">Free 3, Seller / Pro / Day Pass 10, Growth 200.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <span class="text-[#4A2C2C] font-bold">Cost</span>
                                    <p class="text-[#6C3F31]">One operation per request, whatever the page or image count.</p>
                                </div>
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
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">X-Latency-Ms</code>
                                    <p class="text-[#6C3F31]">Processing time in milliseconds. All operations.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Pages</code>
                                    <p class="text-[#6C3F31]">Pages processed. <code class="font-mono text-xs">rasterize</code>, <code class="font-mono text-xs">split</code>, <code class="font-mono text-xs">create</code>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Images</code>
                                    <p class="text-[#6C3F31]">Images returned in the archive. <code class="font-mono text-xs">extract</code>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Skipped</code>
                                    <p class="text-[#6C3F31]">Images skipped for being too small, too large, or in an encoding that cannot be extracted. <code class="font-mono text-xs">extract</code>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Duplicates</code>
                                    <p class="text-[#6C3F31]">Repeat references to an image already returned once. <code class="font-mono text-xs">extract</code>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Images-Recompressed</code>
                                    <p class="text-[#6C3F31]">Images actually replaced. <code class="font-mono text-xs">optimize</code>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Images-Kept</code>
                                    <p class="text-[#6C3F31]">Images left as they were, either because recompressing them would not have saved enough or because they were outside the supported set. <code class="font-mono text-xs">optimize</code>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Original-Bytes</code>
                                    <p class="text-[#6C3F31]">Size of the submitted PDF. <code class="font-mono text-xs">optimize</code>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">X-Mochify-Saved-Pct</code>
                                    <p class="text-[#6C3F31]">Percentage saved, as a whole number. <code class="font-mono text-xs">0</code> means the original was returned unchanged. <code class="font-mono text-xs">optimize</code>.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Examples -->
                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Examples</h3>
                            <div class="space-y-3">

                                <div class="rounded-2xl overflow-hidden border border-pink-100">
                                    <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                        <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">cURL &middot; compress a PDF</span>
                                    </div>
                                    <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>curl -X POST "https://api.mochify.app/v1/pdf?op=optimize&quality=75&maxDpi=150" \
  -H "Content-Type: application/pdf" \
  -H "Authorization: Bearer mchy_your_api_key" \
  --data-binary @report.pdf \
  --output report-compressed.pdf \
  --dump-header -

# X-Mochify-Images-Recompressed: 12
# X-Mochify-Saved-Pct: 47</code></pre>
                                </div>

                                <div class="rounded-2xl overflow-hidden border border-pink-100">
                                    <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                        <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">cURL &middot; extract the images as WebP</span>
                                    </div>
                                    <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>curl -X POST "https://api.mochify.app/v1/pdf?op=extract&type=webp&maxWidth=1600" \
  -H "Content-Type: application/pdf" \
  -H "Authorization: Bearer mchy_your_api_key" \
  --data-binary @brochure.pdf \
  --output images.zip

# Omit type= to get the embedded images byte-for-byte, with no re-encode.</code></pre>
                                </div>

                                <div class="rounded-2xl overflow-hidden border border-pink-100">
                                    <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                        <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">JavaScript &middot; compress and report the saving</span>
                                    </div>
                                    <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>const file = document.querySelector('input[type="file"]').files[0];

const response = await fetch(
  'https://api.mochify.app/v1/pdf?op=optimize&quality=75',
  &#123;
    method: 'POST',
    headers: &#123;
      'Content-Type': 'application/pdf',
      'Authorization': 'Bearer mchy_your_api_key',
    &#125;,
    body: file,
  &#125;
);

const blob = await response.blob();
const saved = response.headers.get('X-Mochify-Saved-Pct');

// 0 means the PDF was already well compressed and came back untouched.
console.log(saved === '0' ? 'Already optimal' : `Saved $&#123;saved&#125;%`);</code></pre>
                                </div>

                                <div class="rounded-2xl overflow-hidden border border-pink-100">
                                    <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                        <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">Python &middot; render pages to PNG</span>
                                    </div>
                                    <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>import requests, zipfile, io

with open('report.pdf', 'rb') as f:
    response = requests.post(
        'https://api.mochify.app/v1/pdf',
        params=&#123;'op': 'rasterize', 'type': 'png', 'dpi': '300'&#125;,
        headers=&#123;
            'Content-Type': 'application/pdf',
            'Authorization': 'Bearer mchy_your_api_key',
        &#125;,
        data=f,
    )

zipfile.ZipFile(io.BytesIO(response.content)).extractall('pages/')
print(f"&#123;response.headers.get('X-Mochify-Pages')&#125; pages rendered")</code></pre>
                                </div>

                                <div class="rounded-2xl overflow-hidden border border-pink-100">
                                    <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                        <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">cURL &middot; build a PDF from images</span>
                                    </div>
                                    <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>curl -X POST "https://api.mochify.app/v1/pdf?op=create&page=a4" \
  -H "Authorization: Bearer mchy_your_api_key" \
  -F "images=@page1.jpg" \
  -F "images=@page2.jpg" \
  -F "images=@page3.jpg" \
  --output album.pdf</code></pre>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                <!-- GET /v1/checkTokens -->
                <section id="check-tokens">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="px-2.5 py-1 rounded-lg bg-[#A5D6A7] text-[#2E7D32] text-xs font-black uppercase tracking-wide">GET</span>
                        <h2 class="text-2xl font-black text-[#4A2C2C] font-mono">/v1/checkTokens</h2>
                    </div>
                    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 space-y-6">
                        <p class="text-[#6C3F31] leading-relaxed">
                            Returns the number of remaining operations for the current IP or API key.
                            Useful for checking quota before submitting a batch.
                        </p>

                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Response</h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Field</span>
                                    <span>Type</span>
                                    <span>Description</span>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">remaining</code>
                                    <span class="text-[#875F42]/60 text-xs font-mono mt-0.5">number</span>
                                    <p class="text-[#6C3F31]">Total remaining operations for the current IP or API key.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">available</code>
                                    <span class="text-[#875F42]/60 text-xs font-mono mt-0.5">boolean</span>
                                    <p class="text-[#6C3F31]"><code class="text-xs">true</code> if at least one operation remains.</p>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-2xl overflow-hidden border border-pink-100">
                            <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">cURL</span>
                            </div>
                            <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>curl "https://api.mochify.app/v1/checkTokens" \
  -H "Authorization: Bearer mchy_your_api_key"

# Response
# &#123; "remaining": 983, "available": true &#125;</code></pre>
                        </div>
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
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm">
                                <code class="font-mono font-black text-[#A5D6A7]">200</code>
                                <p class="text-[#6C3F31]">Success. Response body is the processed image.</p>
                            </div>
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                <code class="font-mono font-black text-[#FFB74D]">400</code>
                                <p class="text-[#6C3F31]">Bad request — missing or invalid parameters.</p>
                            </div>
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm">
                                <code class="font-mono font-black text-[#FFB74D]">401</code>
                                <p class="text-[#6C3F31]">Unauthorized — invalid or missing API key.</p>
                            </div>
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                <code class="font-mono font-black text-[#FFB74D]">403</code>
                                <p class="text-[#6C3F31]">Your plan does not include this operation. The PDF-in operations on <code class="font-mono text-xs">/v1/pdf</code> require a paid plan. <a href="/pricing" class="text-[#F06292] font-semibold hover:underline">Upgrade</a> to enable them.</p>
                            </div>
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm">
                                <code class="font-mono font-black text-[#FFB74D]">413</code>
                                <p class="text-[#6C3F31]">Payload too large. The request body, or the output it would produce, exceeds the limit for your plan.</p>
                            </div>
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                <code class="font-mono font-black text-[#FFB74D]">415</code>
                                <p class="text-[#6C3F31]">Unsupported media type. The body was not a file this operation accepts, for example an image sent to a PDF-in operation.</p>
                            </div>
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm">
                                <code class="font-mono font-black text-[#FFB74D]">422</code>
                                <p class="text-[#6C3F31]">The file was readable but could not be processed as asked. The body explains why, for example a PDF with more pages than your plan allows, a password-protected PDF, or a PDF holding no extractable images.</p>
                            </div>
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                <code class="font-mono font-black text-[#EF5350]">429</code>
                                <p class="text-[#6C3F31]">Rate limit exceeded. Free tier resets monthly; Seller and Pro reset on your billing date. <a href="/pricing" class="text-[#F06292] font-semibold hover:underline">Upgrade</a> for higher limits.</p>
                            </div>
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm">
                                <code class="font-mono font-black text-[#EF5350]">500</code>
                                <p class="text-[#6C3F31]">Server error — the file could not be processed.</p>
                            </div>
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                <code class="font-mono font-black text-[#EF5350]">503</code>
                                <p class="text-[#6C3F31]">At capacity. Retry after the delay in the <code class="font-mono text-xs">Retry-After</code> header. Nothing is charged for a request that returns this.</p>
                            </div>
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
