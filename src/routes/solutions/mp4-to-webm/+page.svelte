<script lang="ts">
    import VideoConvert from '$lib/components/VideoConvert.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        "Convert MP4 to WebM in your browser: VP9 video and Opus audio, sized for the web. Free, no account, and your video never leaves your device.";

    const faqs: FaqItem[] = [
        {
            q: "Is this MP4 to WebM converter free?",
            a: "Yes, with no account. The conversion runs on your own device and never touches our servers, so it does not use any of your monthly image allowance."
        },
        {
            q: "Is my video uploaded?",
            a: "No. Your browser converts the file with its built-in video engine (WebCodecs). The video is read from your device, converted in the tab and saved back to your device. It is never sent to Mochify or anyone else."
        },
        {
            q: "Will the WebM be smaller than my MP4?",
            a: "Usually, yes. The converter aims for the same video bitrate as your MP4, and VP9 is more efficient than H.264 at that bitrate. In our tests the WebM was 14% to 33% smaller."
        },
        {
            q: "Does the WebM keep the sound?",
            a: "Yes. The audio track is kept and re-encoded to Opus, the standard audio codec for WebM."
        },
        {
            q: "Will the quality change?",
            a: "A little, because both tracks are re-encoded. At normal viewing size the difference is hard to see. Keep your original MP4 as the master and as the fallback on your site."
        },
        {
            q: "Can I convert several files at once?",
            a: "Yes, up to 10 at a time. They convert one after another, and each WebM downloads as soon as it is ready."
        },
        {
            q: "Which browsers can convert MP4 to WebM?",
            a: "Current desktop Chrome and Edge. Firefox 130 and later on desktop and Safari 26 and later also include the browser video engine this page uses; Firefox on Android does not. If your browser cannot encode WebM, the page tells you."
        },
        {
            q: "Is there a file size or length limit?",
            a: "There is no fixed cap. The whole file is held in memory while it converts, so very long or high-resolution clips need a computer with plenty of memory, and a desktop or laptop handles them best."
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'MP4 to WebM Converter',
        description: metaDescription,
        url: 'https://mochify.app/solutions/mp4-to-webm',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@type': 'Organization', name: 'Mochify', url: 'https://mochify.app' }
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };

    const videoSnippet = `<video autoplay muted loop playsinline preload="metadata" poster="/images/poster.jpg">
  <source src="/video/hero.webm" type='video/webm; codecs="vp9, opus"'>
  <source src="/video/hero.mp4" type="video/mp4">
</video>`;
</script>

<svelte:head>
    <title>MP4 to WebM Converter - Free, No Upload | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="MP4 to WebM Converter - Mochify" />
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:title" content="MP4 to WebM Converter - Mochify" />
    <meta name="twitter:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

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
                Convert
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    MP4
                </span>
                to
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    WebM
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Convert MP4 to WebM for smaller, web-friendly video. It is free and needs no account, and the conversion runs entirely in your browser, so your video never leaves your device.
            </p>
        </div>

        <div class="mb-16">
            <VideoConvert output="webm" formatLabel="WebM" accept=".mp4,video/mp4" />
        </div>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">How to convert MP4 to WebM</h2>
            <ol class="list-decimal space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li>Drop up to 10 MP4 files on the box above, or click to choose them. Nothing is uploaded.</li>
                <li>Your browser converts them one after another, with a progress readout for each file.</li>
                <li>Each WebM downloads as soon as it is ready, with the same name as the original.</li>
            </ol>
            <p class="leading-relaxed text-[#6C3F31]">You do not need an account, and converting video does not use any of your monthly image allowance.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">What the converter does to your video</h2>
            <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li><strong class="text-[#4A2C2C]">Video:</strong> re-encoded to VP9, the codec most websites use for WebM. If your browser cannot encode VP9, it uses AV1 or VP8 instead.</li>
                <li><strong class="text-[#4A2C2C]">Audio:</strong> kept, and re-encoded to Opus, the standard audio codec for WebM.</li>
                <li><strong class="text-[#4A2C2C]">Size and length:</strong> the same resolution and running time as the MP4.</li>
                <li><strong class="text-[#4A2C2C]">File size:</strong> the converter aims for the same video bitrate as your MP4, and VP9 gets more picture out of those bits than H.264, so the WebM usually comes out smaller. In our tests it was 14% to 33% smaller.</li>
            </ul>
            <p class="leading-relaxed text-[#6C3F31]">It is a re-encode, not a rewrap: MP4 usually carries H.264 video and AAC audio, which a WebM file cannot hold, so both tracks are encoded again.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Why your video never leaves your device</h2>
            <p class="leading-relaxed text-[#6C3F31]">The conversion runs in your browser tab, using the video encoder built into the browser (the WebCodecs API). Your file is read from your disk, converted in the tab and saved back to your downloads. It is never sent to Mochify or anyone else, which is why there is nothing to sign up for and nothing to delete afterwards. Most online converters upload your file to a server first; for client footage, unreleased product videos or anything under NDA, that difference matters.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Which browsers can convert</h2>
            <p class="leading-relaxed text-[#6C3F31]">Desktop Chrome and Edge convert reliably. Firefox (version 130 and later on desktop) and Safari (version 26 and later) also include the browser video engine this page uses. Firefox on Android does not. If your browser cannot encode WebM, the page tells you instead of failing silently.</p>
            <p class="leading-relaxed text-[#6C3F31]">Long or high-resolution clips use a lot of memory, because the whole file is held in the tab while it converts. A desktop or laptop handles large files best.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Using your WebM on a website</h2>
            <p class="leading-relaxed text-[#6C3F31]">Serve the WebM first and keep the MP4 as a fallback, so every browser gets a file it can play:</p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>{videoSnippet}</code></pre>
            <p class="leading-relaxed text-[#6C3F31]">The browser plays the first source it supports. Only have a WebM? The <a href="/solutions/webm-to-mp4" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">WebM to MP4 converter</a> makes the MP4 fallback. Our <a href="/guides/mp4-to-webm-web-video-guide" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">MP4 to WebM guide</a> covers VP9 against AV1, browser support and how video choices affect Core Web Vitals.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Converting MP4 to WebM without a converter</h2>
            <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li><strong class="text-[#4A2C2C]">FFmpeg</strong> (free, Windows, Mac and Linux): <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 -c:a libopus output.webm</code>. A lower <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">-crf</code> gives higher quality and a bigger file.</li>
                <li><strong class="text-[#4A2C2C]">HandBrake</strong> (free, Windows, Mac and Linux): open the MP4, set Format to WebM in the Summary tab, and pick VP9 as the video encoder.</li>
                <li><strong class="text-[#4A2C2C]">VLC:</strong> Media &gt; Convert / Save with the "Video - VP80 + Vorbis (Webm)" profile. That writes the older VP8 codec, so the files are larger than VP9.</li>
            </ul>
        </section>

        <section class="mt-16 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-[#4A2C2C] mb-4">Frequently asked questions</h2>
            <FaqAccordion {faqs} />
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-2 gap-4">
                <a href="/guides/mp4-to-webm-web-video-guide" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">MP4 to WebM guide →</p>
                        <p class="text-xs text-[#875F42]">Codecs, browser support and the video fallback pattern</p>
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

