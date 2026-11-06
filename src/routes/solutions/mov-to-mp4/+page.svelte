<script lang="ts">
    import VideoConvert from '$lib/components/VideoConvert.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        "Convert MOV to MP4 in your browser, including iPhone videos: H.264 MP4 that plays on Windows, Android and in editors. Free, no signup, never uploaded.";

    const faqs: FaqItem[] = [
        {
            q: "Is this MOV to MP4 converter free?",
            a: "Yes, with no account. The conversion runs on your own device and never touches our servers, so it does not use any of your monthly image allowance."
        },
        {
            q: "Is my video uploaded?",
            a: "No. Your browser converts the file with its built-in video engine (WebCodecs). The video is read from your device, converted in the tab and saved back to your device. It is never sent to Mochify or anyone else."
        },
        {
            q: "Can I convert iPhone videos?",
            a: "Yes. iPhones record MOV files in HEVC (H.265) by default, or in H.264 if the camera is set to Most Compatible. Both convert to MP4, and the video keeps its orientation, so portrait clips stay portrait."
        },
        {
            q: "Will the quality change?",
            a: "If your MOV already uses H.264, no: the video is moved into an MP4 container without re-encoding, so it is identical to the original and converts in seconds. HEVC video is re-encoded to H.264 at the same bitrate. H.264 is less efficient than HEVC, so very detailed or fast-moving footage can look slightly softer; most clips look the same."
        },
        {
            q: "Will the MP4 be bigger than my MOV?",
            a: "About the same size. H.264 video is copied as it is, and HEVC video is re-encoded at the same bitrate as the original."
        },
        {
            q: "What happens to iPhone HDR video?",
            a: "It stays HDR. The MP4 keeps the HDR color information, so it looks right on HDR screens and in apps that support HDR. Players without HDR support show it the same way they would show the original MOV, which can look a little flat."
        },
        {
            q: "Does the MP4 keep the sound?",
            a: "Yes. AAC audio, which is what iPhones and most cameras record, is copied as it is. Other audio is converted to AAC, or kept as it is if your browser cannot encode AAC."
        },
        {
            q: "Can I convert several files at once?",
            a: "Yes, up to 10 at a time. They convert one after another, and each MP4 downloads as soon as it is ready."
        },
        {
            q: "Which browsers can convert MOV to MP4?",
            a: "Current desktop Chrome and Edge, Safari 26 and later, and Firefox 130 and later on desktop. Re-encoding HEVC needs a browser that can play HEVC, which Safari can, and Chrome and Edge can on most computers made in the last several years. If yours cannot, the HEVC video is kept as it is inside the MP4 and the page tells you."
        },
        {
            q: "Can I convert ProRes MOV files?",
            a: "No. Browsers cannot read ProRes, the format used by many cameras and editing exports, so this page cannot convert it. FFmpeg or HandBrake, below, can."
        },
        {
            q: "Is there a file size or length limit?",
            a: "There is no fixed cap. The whole file is held in memory while it converts, so very long or high-resolution clips need a computer with plenty of memory, and a desktop or laptop handles them best."
        }
    ];

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'MOV to MP4 Converter',
        description: metaDescription,
        url: 'https://mochify.app/solutions/mov-to-mp4',
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
    <title>MOV to MP4 Converter - Free, No Upload | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-violet text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
                    Video Converter
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-green text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    100% In-Browser
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-pink text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Nothing Uploaded
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-cocoa-ink tracking-tight">
                Convert
                <span class="bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
                    MOV
                </span>
                to
                <span class="bg-gradient-to-r from-mochi-pink-soft to-mochi-pink bg-clip-text text-transparent">
                    MP4
                </span>
            </h1>

            <p class="text-lg text-cocoa-deep font-medium max-w-2xl mx-auto leading-relaxed text-balance">
                Convert MOV videos from your iPhone, Mac or camera to an MP4 that plays on Windows and Android and opens in mainstream video editors and upload forms. It is free and needs no account, and the conversion runs entirely in your browser, so your video never leaves your device.
            </p>
        </div>

        <div class="mb-16">
            <VideoConvert output="mp4" formatLabel="MP4" accept=".mov,.qt,video/quicktime" videoCodec="avc" audioCodec="aac" copyFallback={['hevc']} />
        </div>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-cocoa-ink">How to convert MOV to MP4</h2>
            <ol class="list-decimal space-y-2 pl-6 text-cocoa-deep leading-relaxed">
                <li>Drop up to 10 MOV files on the box above, or click to choose them. Nothing is uploaded.</li>
                <li>Your browser converts them one after another, with a progress readout for each file.</li>
                <li>Each MP4 downloads as soon as it is ready, with the same name as the original.</li>
            </ol>
            <p class="leading-relaxed text-cocoa-deep">You do not need an account, and converting video does not use any of your monthly image allowance.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-cocoa-ink">Why convert MOV to MP4?</h2>
            <p class="leading-relaxed text-cocoa-deep">MOV is Apple's QuickTime format, and it is what iPhones, Macs and many cameras save video as. Apple devices play it without a second thought, but plenty of other places do not: some Windows and Android players, editing apps, learning platforms and website upload forms only accept MP4. MP4 with H.264 video and AAC audio is the combination almost everything accepts.</p>
            <p class="leading-relaxed text-cocoa-deep">There is a second catch with iPhone video. Since iOS 11, iPhones record in HEVC (H.265) by default, which saves space but needs a paid extension to play on some Windows PCs. Converting to H.264 MP4 solves both problems at once.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-cocoa-ink">What the converter does to your video</h2>
            <ul class="list-disc space-y-2 pl-6 text-cocoa-deep leading-relaxed">
                <li><strong class="text-cocoa-ink">H.264 video</strong> (iPhone on Most Compatible, Mac screen recordings, many cameras): copied into the MP4 without re-encoding. The picture is identical to the original and even long clips convert in seconds.</li>
                <li><strong class="text-cocoa-ink">HEVC video</strong> (iPhone default): re-encoded to H.264 at the same bitrate as the original. If your browser cannot read HEVC, the video is kept as HEVC inside the MP4 instead, and the page tells you.</li>
                <li><strong class="text-cocoa-ink">HDR video:</strong> the HDR color information is kept, so iPhone HDR clips still look right on HDR screens.</li>
                <li><strong class="text-cocoa-ink">Audio:</strong> AAC audio is copied as it is. Other audio is re-encoded to AAC, or kept as it is if your browser cannot encode AAC.</li>
                <li><strong class="text-cocoa-ink">Orientation, size and length:</strong> portrait clips stay portrait, with the same resolution and running time as the MOV.</li>
                <li><strong class="text-cocoa-ink">File size:</strong> about the same as your MOV.</li>
            </ul>
            <p class="leading-relaxed text-cocoa-deep">H.264 needs more bits than HEVC for the same picture, so at the same bitrate very detailed or fast-moving HEVC footage can look slightly softer after conversion. For most phone clips the difference is hard to see.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-cocoa-ink">Why your video never leaves your device</h2>
            <p class="leading-relaxed text-cocoa-deep">The conversion runs in your browser tab, using the video encoder built into the browser (the WebCodecs API). Your file is read from your disk, converted in the tab and saved back to your downloads. It is never sent to Mochify or anyone else. Most online converters upload your file to a server first; for family videos, client footage or anything private, that difference matters.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-cocoa-ink">Which browsers can convert</h2>
            <p class="leading-relaxed text-cocoa-deep">Desktop Chrome and Edge convert reliably. Safari (version 26 and later) and Firefox (version 130 and later on desktop) also include the browser video engine this page uses. Firefox on Android does not. If your browser cannot convert the file, the page tells you instead of failing silently.</p>
            <p class="leading-relaxed text-cocoa-deep">For iPhone HEVC video, Safari and Chrome on a Mac give the best result, because they can re-encode HEVC to H.264. Chrome and Edge on Windows can too on most computers made in the last several years.</p>
            <p class="leading-relaxed text-cocoa-deep">Long or high-resolution clips use a lot of memory, because the whole file is held in the tab while it converts. A desktop or laptop handles large files best.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-bold text-cocoa-ink">Converting MOV to MP4 without a converter</h2>
            <ul class="list-disc space-y-2 pl-6 text-cocoa-deep leading-relaxed">
                <li><strong class="text-cocoa-ink">FFmpeg</strong> (free, Windows, Mac and Linux): <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">ffmpeg -i input.mov -c:v libx264 -crf 20 -c:a aac -movflags +faststart output.mp4</code>. If the MOV is already H.264, <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">ffmpeg -i input.mov -c copy output.mp4</code> changes the container without re-encoding. This also handles ProRes.</li>
                <li><strong class="text-cocoa-ink">HandBrake</strong> (free, Windows, Mac and Linux): open the MOV and choose a preset from the General category, which writes MP4 with H.264 video.</li>            </ul>
            <p class="leading-relaxed text-cocoa-deep">Have a WebM instead? The <a href="/solutions/webm-to-mp4" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">WebM to MP4 converter</a> handles those. iPhone photos rather than videos? The <a href="/heic-to-jpeg" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">HEIC to JPG converter</a> turns iPhone HEIC photos into JPGs.</p>
        </section>

        <section class="mt-16 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-cocoa-ink mb-4">Frequently asked questions</h2>
            <FaqAccordion {faqs} />
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-cocoa-milk uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-2 gap-4">
                <a href="/heic-to-jpeg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">HEIC to JPG →</p>
                        <p class="text-xs text-cocoa-milk">Convert iPhone photos to JPG</p>
                    </div>
                </a>
                <a href="/solutions" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">All tools →</p>
                        <p class="text-xs text-cocoa-milk">Browse every image and video converter</p>
                    </div>
                </a>
            </div>
        </section>

    </div>
