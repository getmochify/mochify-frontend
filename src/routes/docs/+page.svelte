<script lang="ts">
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';

    let activeSection = $state('overview');

    const sections = [
        { id: 'overview', label: 'Overview' },
        { id: 'authentication', label: 'Authentication' },
        { id: 'squish', label: 'POST /v1/squish' },
        { id: 'check-tokens', label: 'GET /v1/checkTokens' },
        { id: 'prompt', label: 'POST /v1/prompt' },
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
    <meta name="description" content="Mochify REST API reference. Compress and convert images programmatically with 25 free operations per day. No account required.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mochify.xyz/docs">
    <meta property="og:title" content="API Documentation — Mochify">
    <meta property="og:description" content="Mochify REST API reference. Compress and convert images programmatically with 25 free operations per day. No account required.">
    <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Mochify API Reference",
        "description": "REST API for image compression and conversion. Compress, convert, and resize images programmatically with 25 free operations per day. No account required.",
        "url": "https://mochify.xyz/docs",
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.xyz"
        },
        "about": {
            "@type": "SoftwareApplication",
            "name": "Mochify API",
            "applicationCategory": "DeveloperApplication"
        }
    })}</script>
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 flex flex-col relative">

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
                Process images programmatically. 25 free operations per day — no account required.
                <a href="/pricing" class="text-[#F06292] font-semibold hover:underline">Pro</a> unlocks 1,000/month with an API key.
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
                            https://api.mochify.xyz
                        </div>
                        <div class="grid sm:grid-cols-3 gap-4 pt-2">
                            <div class="bg-[#FDFBF7] rounded-2xl border border-pink-50 p-4">
                                <p class="text-xs font-black text-[#875F42]/60 uppercase tracking-wider mb-1">Free tier</p>
                                <p class="text-2xl font-black text-[#4A2C2C]">25</p>
                                <p class="text-xs text-[#6C3F31]/60 mt-0.5">operations / day</p>
                            </div>
                            <div class="bg-[#FDFBF7] rounded-2xl border border-[#F06292]/15 p-4">
                                <p class="text-xs font-black text-[#F06292]/70 uppercase tracking-wider mb-1">Pro tier</p>
                                <p class="text-2xl font-black text-[#4A2C2C]">1,000</p>
                                <p class="text-xs text-[#6C3F31]/60 mt-0.5">operations / month</p>
                            </div>
                            <div class="bg-[#FDFBF7] rounded-2xl border border-pink-50 p-4">
                                <p class="text-xs font-black text-[#875F42]/60 uppercase tracking-wider mb-1">Max file size</p>
                                <p class="text-2xl font-black text-[#4A2C2C]">20 MB</p>
                                <p class="text-xs text-[#6C3F31]/60 mt-0.5">per image</p>
                            </div>
                        </div>
                        <p class="text-sm text-[#6C3F31]/70 leading-relaxed pt-2">
                            Rate limits are enforced per IP on the free tier. Pro API keys use per-key limits.
                            Each image processed — regardless of operations applied — counts as one operation.
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
                                    <span>Required</span>
                                    <span>Description</span>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">type</code>
                                    <span class="text-[#A5D6A7] font-bold text-xs mt-0.5">required</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Output format.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">One of: <code class="font-mono">jpg</code> · <code class="font-mono">png</code> · <code class="font-mono">webp</code> · <code class="font-mono">avif</code> · <code class="font-mono">jxl</code></p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">strip_exif</code>
                                    <span class="text-[#875F42]/40 font-bold text-xs mt-0.5">optional</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Strip EXIF metadata from the output.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">Default: <code class="font-mono">1</code></p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">smartCompress</code>
                                    <span class="text-[#875F42]/40 font-bold text-xs mt-0.5">optional</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Enable smart compression — targets optimal quality/size balance automatically.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">Pass <code class="font-mono">1</code> to enable.</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">maxWidth</code>
                                    <span class="text-[#875F42]/40 font-bold text-xs mt-0.5">optional</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Resize the image to a maximum width in pixels. Aspect ratio is preserved.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">Example: <code class="font-mono">maxWidth=1600</code></p>
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
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <span class="text-[#4A2C2C] font-semibold">Body</span>
                                    <p class="text-[#6C3F31]">Raw compressed image bytes.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">X-Latency-Ms</code>
                                    <p class="text-[#6C3F31]">Processing time in milliseconds (response header).</p>
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
                                    <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>curl -X POST "https://api.mochify.xyz/v1/squish?type=webp&strip_exif=1" \
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
  'https://api.mochify.xyz/v1/squish?type=avif&strip_exif=1',
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
        'https://api.mochify.xyz/v1/squish',
        params=&#123;'type': 'webp', 'strip_exif': '1'&#125;,
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
                            <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>curl "https://api.mochify.xyz/v1/checkTokens" \
  -H "Authorization: Bearer mchy_your_api_key"

# Response
# &#123; "remaining": 983, "available": true &#125;</code></pre>
                        </div>
                    </div>
                </section>

                <!-- POST /v1/prompt -->
                <section id="prompt">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="px-2.5 py-1 rounded-lg bg-[#F06292] text-white text-xs font-black uppercase tracking-wide">POST</span>
                        <h2 class="text-2xl font-black text-[#4A2C2C] font-mono">/v1/prompt</h2>
                    </div>
                    <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 space-y-6">
                        <p class="text-[#6C3F31] leading-relaxed">
                            Interprets a plain-language prompt and returns per-file processing parameters to pass to
                            <code class="font-mono text-sm text-[#F06292]">/v1/squish</code>. This powers the
                            <a href="/flow" class="text-[#F06292] font-semibold hover:underline">Magic Flow</a> feature.
                        </p>

                        <div>
                            <h3 class="text-sm font-black text-[#4A2C2C] uppercase tracking-wider mb-3">Request Body <span class="text-[#875F42]/50 font-normal normal-case tracking-normal text-xs ml-1">application/json</span></h3>
                            <div class="rounded-2xl overflow-hidden border border-pink-100 divide-y divide-pink-50">
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-[#FFF5F7] text-xs font-black text-[#875F42]/60 uppercase tracking-wider">
                                    <span>Field</span>
                                    <span>Required</span>
                                    <span>Description</span>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm">
                                    <code class="font-mono text-[#F06292] font-bold">prompt</code>
                                    <span class="text-[#A5D6A7] font-bold text-xs mt-0.5">required</span>
                                    <p class="text-[#6C3F31]">Natural language description of what you want to do. E.g. <em>"Convert to WebP and strip location data"</em>.</p>
                                </div>
                                <div class="grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-4 items-start text-sm bg-[#FDFBF7]">
                                    <code class="font-mono text-[#F06292] font-bold">fileData</code>
                                    <span class="text-[#A5D6A7] font-bold text-xs mt-0.5">required</span>
                                    <div>
                                        <p class="text-[#6C3F31]">Array of file metadata objects. Used to generate per-file configs.</p>
                                        <p class="text-[#875F42]/60 text-xs mt-1">Each object: <code class="font-mono">&#123; name: string, width: number, height: number &#125;</code></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-2xl overflow-hidden border border-pink-100">
                            <div class="bg-[#4A2C2C] px-4 py-2 flex items-center gap-2">
                                <span class="text-[#FFB3C6]/60 text-xs font-bold uppercase tracking-wider">cURL</span>
                            </div>
                            <pre class="bg-[#2E1A14] text-[#FFE5EC] text-sm font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre"><code>curl -X POST "https://api.mochify.xyz/v1/prompt" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mchy_your_api_key" \
  -d '&#123;
    "prompt": "Convert to AVIF and strip EXIF data",
    "fileData": [
      &#123; "name": "photo.jpg", "width": 4032, "height": 3024 &#125;
    ]
  &#125;'</code></pre>
                        </div>

                        <div class="bg-[#FDFBF7] border border-pink-100 rounded-2xl px-5 py-4 flex gap-3">
                            <span class="text-[#F06292] text-sm font-black flex-shrink-0 mt-0.5">i</span>
                            <p class="text-sm text-[#6C3F31]/80 leading-relaxed">
                                The response contains per-file parameters. Pass them directly to
                                <code class="font-mono text-xs">/v1/squish</code> as query params for each file.
                            </p>
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
                                <code class="font-mono font-black text-[#EF5350]">429</code>
                                <p class="text-[#6C3F31]">Rate limit exceeded. Free tier resets daily; Pro resets monthly. <a href="/pricing" class="text-[#F06292] font-semibold hover:underline">Upgrade</a> for higher limits.</p>
                            </div>
                            <div class="grid grid-cols-[auto_1fr] gap-x-6 px-5 py-4 items-start text-sm">
                                <code class="font-mono font-black text-[#EF5350]">500</code>
                                <p class="text-[#6C3F31]">Server error — the image could not be processed.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA -->
                <div class="bg-gradient-to-br from-[#FFF0F5] to-white rounded-3xl border border-[#F06292]/20 shadow-sm p-8 text-center">
                    <h3 class="text-xl font-black text-[#4A2C2C] mb-2">Need more operations?</h3>
                    <p class="text-[#6C3F31]/70 text-sm mb-6">Upgrade to Pro for 1,000 operations/month and a dedicated API key.</p>
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
