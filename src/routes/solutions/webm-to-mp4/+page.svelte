<script lang="ts">
    import VideoConvert from '$lib/components/VideoConvert.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        "Convert WebM to MP4 in your browser: H.264 video and AAC audio that play on iPhone, Mac and Windows. Free, no account, never uploaded.";

    const faqs: FaqItem[] = [
        {
            q: "Is this WebM to MP4 converter free?",
            a: "Yes, with no account. The conversion runs on your own device and never touches our servers, so it does not use any of your monthly image allowance."
        },
        {
            q: "Is my video uploaded?",
            a: "No. Your browser converts the file with its built-in video engine (WebCodecs). The video is read from your device, converted in the tab and saved back to your device. It is never sent to Mochify or anyone else."
        },
        {
            q: "Will the MP4 play on my iPhone?",
            a: "Yes. The MP4 uses H.264 video and AAC audio, which iPhone, Mac and Windows play without any extra apps. If your browser could not encode AAC, the original audio is kept instead, and the video may play without sound on some devices; converting in desktop Chrome or Edge avoids that."
        },
        {
            q: "Will the quality change?",
            a: "A little, because the video is re-encoded. The converter keeps your WebM's bitrate, and H.264 is less efficient than VP9, so very detailed or fast-moving footage can look slightly softer. Most clips look the same."
        },
        {
            q: "Will the MP4 be bigger than my WebM?",
            a: "About the same size. The converter aims for your WebM's video bitrate; in our tests the MP4 was 2% to 8% larger."
        },
        {
            q: "Does the MP4 keep the sound?",
            a: "Yes. The audio is re-encoded to AAC, or kept as it is if your browser cannot encode AAC."
        },
        {
            q: "Can I convert several files at once?",
            a: "Yes, up to 10 at a time. They convert one after another, and each MP4 downloads as soon as it is ready."
        },
        {
            q: "Which browsers can convert WebM to MP4?",
            a: "Current desktop Chrome and Edge. Firefox 130 and later on desktop and Safari 26 and later also include the browser video engine this page uses; Firefox on Android does not. If your browser cannot convert the file, the page tells you."
        },
        {
            q: "Is there a file size or length limit?",
            a: "There is no fixed cap. The whole file is held in memory while it converts, so very long or high-resolution clips need a computer with plenty of memory, and a desktop or laptop handles them best."
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'WebM to MP4 Converter',
        description: metaDescription,
        url: 'https://mochify.app/solutions/webm-to-mp4',
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
</script>

<svelte:head>
    <title>WebM to MP4 Converter - Free, No Upload | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="WebM to MP4 Converter - Mochify" />
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:title" content="WebM to MP4 Converter - Mochify" />
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
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    WebM
                </span>
                to
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    MP4
                </span>
            </h1>

            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Convert WebM to an MP4 that plays on iPhone, Mac and Windows and opens in mainstream video editors. It is free and needs no account, and the conversion runs entirely in your browser, so your video never leaves your device.
            </p>
        </div>

        <div class="mb-16">
            <VideoConvert output="mp4" formatLabel="MP4" accept=".webm,video/webm" videoCodec="avc" audioCodec="aac" />
        </div>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">How to convert WebM to MP4</h2>
            <ol class="list-decimal space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li>Drop up to 10 WebM files on the box above, or click to choose them. Nothing is uploaded.</li>
                <li>Your browser converts them one after another, with a progress readout for each file.</li>
                <li>Each MP4 downloads as soon as it is ready, with the same name as the original.</li>
            </ol>
            <p class="leading-relaxed text-[#6C3F31]">You do not need an account, and converting video does not use any of your monthly image allowance.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert WebM to MP4?</h2>
            <p class="leading-relaxed text-[#6C3F31]">WebM is built for the web, and browsers play it well. Outside the browser it is a different story: QuickTime Player on a Mac and many video editors and upload forms will not take a WebM file. MP4 with H.264 video and AAC audio is the combination almost everything accepts, from iPhone to Windows to editing apps.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">What the converter does to your video</h2>
            <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li><strong class="text-[#4A2C2C]">Video:</strong> re-encoded from VP9 or VP8 to H.264, the most widely supported video codec.</li>
                <li><strong class="text-[#4A2C2C]">Audio:</strong> re-encoded to AAC, the audio iPhone, Mac and Windows play natively. If your browser cannot encode AAC, the original audio track is kept inside the MP4 instead, and not every player supports that.</li>
                <li><strong class="text-[#4A2C2C]">Size and length:</strong> the same resolution and running time as the WebM.</li>
                <li><strong class="text-[#4A2C2C]">File size:</strong> about the same as your WebM. The converter aims for the same video bitrate, and in our tests the MP4 came out between 2% and 8% larger.</li>
            </ul>
            <p class="leading-relaxed text-[#6C3F31]">H.264 needs more bits than VP9 for the same picture, so at the same bitrate very detailed or fast-moving footage can look slightly softer. For most screen recordings and clips the difference is hard to see.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Why your video never leaves your device</h2>
            <p class="leading-relaxed text-[#6C3F31]">The conversion runs in your browser tab, using the video encoder built into the browser (the WebCodecs API). Your file is read from your disk, converted in the tab and saved back to your downloads. It is never sent to Mochify or anyone else. Most online converters upload your file to a server first; for client footage, meeting recordings or anything private, that difference matters.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Which browsers can convert</h2>
            <p class="leading-relaxed text-[#6C3F31]">Desktop Chrome and Edge convert reliably. Firefox (version 130 and later on desktop) and Safari (version 26 and later) also include the browser video engine this page uses. Firefox on Android does not. If your browser cannot convert the file, the page tells you instead of failing silently.</p>
            <p class="leading-relaxed text-[#6C3F31]">Long or high-resolution clips use a lot of memory, because the whole file is held in the tab while it converts. A desktop or laptop handles large files best.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-[#4A2C2C]">Converting WebM to MP4 without a converter</h2>
            <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                <li><strong class="text-[#4A2C2C]">FFmpeg</strong> (free, Windows, Mac and Linux): <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">ffmpeg -i input.webm -c:v libx264 -crf 23 -c:a aac -movflags +faststart output.mp4</code>. A lower <code class="px-1.5 py-px rounded bg-[#FFF5F7] text-[#BE185D] text-sm">-crf</code> gives higher quality and a bigger file.</li>
                <li><strong class="text-[#4A2C2C]">HandBrake</strong> (free, Windows, Mac and Linux): open the WebM and choose a preset from the Web category, which writes MP4 with H.264 video.</li>
            </ul>
            <p class="leading-relaxed text-[#6C3F31]">Going the other way? The <a href="/solutions/mp4-to-webm" class="font-bold text-[#F06292] hover:text-[#D81B60] transition-colors">MP4 to WebM converter</a> makes WebM files for self-hosted web video.</p>
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
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">Web video guide →</p>
                        <p class="text-xs text-[#875F42]">WebM vs MP4, browser support and the fallback pattern</p>
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

