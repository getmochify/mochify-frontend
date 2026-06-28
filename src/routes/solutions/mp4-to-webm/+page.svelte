<script lang="ts">
    import VideoConvert from '$lib/components/VideoConvert.svelte';
</script>

<svelte:head>
    <title>MP4 to WebM — Free In-Browser Video Converter | Mochify</title>
    <meta name="description" content="Convert MP4 to WebM free, right in your browser. Smaller files for web video, nothing uploaded, no account, no limits — your video never leaves your device.">
    <meta property="og:title" content="MP4 to WebM — Free & Private In-Browser Converter | Mochify" />
    <meta property="og:description" content="Convert MP4 to WebM free, right in your browser. Smaller files for web video, nothing uploaded, no account, no limits — your video never leaves your device." />
    <link rel="canonical" href="https://mochify.app/solutions/mp4-to-webm" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "MP4 to WebM Converter",
        "description": "Convert MP4 video to WebM entirely in the browser. Client-side WebCodecs conversion — files are never uploaded.",
        "url": "https://mochify.app/solutions/mp4-to-webm",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "provider": { "@type": "Organization", "name": "Mochify", "url": "https://mochify.app" }
        }
    </script>
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F3F0FF] border border-[#DDD6FE] shadow-sm text-[#6D28D9] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
                    Video Converter
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F0FDF4] border border-green-100 shadow-sm text-green-700 text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    100% In-Browser
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Nothing Uploaded
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    MP4
                </span>
                to
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    WebM
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Convert MP4 to WebM for smaller, web-friendly video — free, with no account and no limits. The conversion runs entirely in your browser, so your video never leaves your device.
            </p>
        </div>

        <div class="mb-16">
            <VideoConvert output="webm" formatLabel="WebM" accept=".mp4,video/mp4" />
        </div>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">

                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert MP4 to WebM?</h2>
                        <p class="leading-relaxed text-[#6C3F31]">
                            MP4 (H.264) is the universal capture and sharing format, but it's rarely the smallest option for the open web. <strong class="text-[#7E685E]">WebM (VP9/Opus) typically delivers noticeably smaller files at similar quality</strong>, which means faster page loads and less bandwidth for self-hosted HTML5 video.
                        </p>
                        <p class="leading-relaxed text-[#6C3F31]">
                            It's also fully open and royalty-free, and supported by every major modern browser via the native <code class="bg-pink-50 text-[#F06292] px-2 py-0.5 rounded font-mono text-base">&lt;video&gt;</code> element — ideal when you control the markup and want lean delivery.
                        </p>
                    </div>

                    <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                        <h3 class="font-bold text-[#4A2C2C] mb-5 text-sm uppercase tracking-widest opacity-70">Common Use Cases</h3>
                        <ul class="space-y-3">
                            {#each [
                                'Self-hosted HTML5 background and hero video',
                                'Smaller clips for faster-loading pages',
                                'Open, royalty-free delivery on the web',
                                'Replacing autoplaying GIFs with real video',
                                'Docs, wikis, and product pages',
                                'Anywhere bandwidth and load time matter',
                            ] as item}
                                <li class="flex items-center gap-3 text-sm font-semibold text-[#6C3F31]">
                                    <span class="w-2 h-2 rounded-full bg-[#C4B5FD] flex-shrink-0"></span> {item}
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>

                <div class="space-y-4">
                    {#each [
                        {
                            q: "Is it really free?",
                            a: "Yes — fully free with no account and no limits. The conversion runs in your browser using your own device, so there's nothing for us to meter."
                        },
                        {
                            q: "Does my video get uploaded?",
                            a: "No. Everything happens locally via your browser's built-in video engine (WebCodecs). Your file never leaves your device and nothing is sent to a server."
                        },
                        {
                            q: "Can I convert several files at once?",
                            a: "Yes. Add multiple MP4s and they're converted one after another, each downloaded automatically as a .webm file."
                        },
                        {
                            q: "Will the quality change?",
                            a: "WebM is a re-encode, not a lossless rewrap, so it's recompressed. At sensible settings the difference is hard to spot, and you usually get a smaller file at similar visual quality."
                        },
                        {
                            q: "Which browsers are supported?",
                            a: "Any modern browser with WebCodecs — current Chrome, Edge, Firefox, and Safari. If a conversion isn't supported on your browser, you'll get a clear message instead of a silent failure."
                        },
                        {
                            q: "Is there a file size or length limit?",
                            a: "There's no fixed cap, but because it runs on your device, very large files use more memory and take longer. Desktop handles big files best."
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
                    { n: '1', t: 'Add your MP4s', d: 'Drop in one or more MP4 files. They stay on your device — nothing uploads.' },
                    { n: '2', t: 'Convert in-browser', d: 'Your browser re-encodes each file to WebM with a live progress readout.' },
                    { n: '3', t: 'Download the WebM', d: 'Each converted file downloads automatically, ready for your site.' },
                ] as step}
                    <div class="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#FFF0F3] text-[#F06292] font-black text-sm mb-4">{step.n}</span>
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
                <a href="/" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">Resize &amp; compress video →</p>
                        <p class="text-xs text-[#875F42]">Use Magic Flow to also resize or shrink while converting</p>
                    </div>
                </a>
                <a href="/solutions" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">All tools →</p>
                        <p class="text-xs text-[#875F42]">Browse every image and video converter</p>
                    </div>
                </a>
            </div>
        </section>

    </div>

