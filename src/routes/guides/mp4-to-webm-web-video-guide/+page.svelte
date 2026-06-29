<script lang="ts">
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import CodeBlock from '$lib/components/CodeBlock.svelte';
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';

    const metadata = {
        title: "Convert MP4 to WebM for the Web: Smaller Files, Faster Pages, No Upload Required",
        description: "Convert MP4 to WebM using VP9 for 30–50% smaller files. Covers browser support, Core Web Vitals impact, the video fallback pattern, and in-browser conversion with no upload.",
        category: "Web Performance",
        readTime: "17 min read",
        date: "June 26, 2026"
    };

    const videoFallbackCode = `<video
  autoplay
  muted
  loop
  playsinline
  preload="metadata"
  poster="/images/video-poster.jpg"
  width="1280"
  height="720"
>
  <source src="/video/hero.webm" type='video/webm; codecs="vp9, opus"' />
  <source src="/video/hero.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
  <p>Your browser doesn't support HTML video. <a href="/video/hero.mp4">Download the video</a>.</p>
</video>`;

    const tocItems = [
        { n: '01', id: 'webm-vs-mp4', label: 'WebM vs MP4: what\'s actually different?' },
        { n: '02', id: 'browser-support', label: 'Browser support in 2026: what you can safely ship' },
        { n: '03', id: 'file-size-benchmarks', label: 'How much smaller? VP9 and AV1 file size benchmarks' },
        { n: '04', id: 'video-fallback', label: 'The <video> fallback pattern every site should use' },
        { n: '05', id: 'core-web-vitals', label: 'Video format choices and Core Web Vitals' },
        { n: '06', id: 'privacy-risks', label: 'Why online converters are a privacy risk' },
        { n: '07', id: 'mochify-workflow', label: 'Mochify Workflow: convert in your browser' },
        { n: '08', id: 'cheat-sheet', label: 'MP4 to WebM cheat sheet' },
        { n: '09', id: 'faq', label: 'FAQ' },
    ];

    const related = [
        { href: '/guides/optimizing-hero-images', title: 'Optimising Hero Images for Web Performance', desc: 'The image-side companion to this guide: LCP optimisation, responsive sizes, and format choices for above-the-fold images.' },
        { href: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl', title: 'What Should I Use in 2026: WebP, AVIF, or JPEG XL?', desc: 'The same codec-vs-compatibility analysis applied to images - useful context when optimising both assets on the same page.' },
        { href: '/guides/2026-guide-next-gen-formats', title: 'The 2026 Guide to Next-Gen Formats: WebP, AVIF, JPEG XL', desc: 'Deeper coverage of royalty-free web format history and what drives compression gains across the modern codec family.' },
        { href: '/guides/privacy-image-optimization', title: 'Privacy and Image Optimization: A Comprehensive Guide', desc: 'Covers the data-handling landscape for online media tools, including the retention and logging practices that apply to server-side converters.' },
        { href: '/guides/on-device-ai-agents-image-optimization', title: 'On-Device AI Agents: Image and PDF Optimization for Local Workflows', desc: 'For teams building automation pipelines: how on-device and in-browser tooling keeps media workflows private and agent-friendly.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <link rel="canonical" href="https://mochify.app/guides/mp4-to-webm-web-video-guide" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/mp4-to-webm-web-video-guide" />
    <meta name="twitter:card" content="summary_large_image" />

    {@html `<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Convert MP4 to WebM for the Web: Smaller Files, Faster Pages, No Upload Required",
        "description": "Convert MP4 to WebM using VP9 for 30–50% smaller files. Covers browser support, Core Web Vitals impact, the video fallback pattern, and in-browser conversion with no upload.",
        "url": "https://mochify.app/guides/mp4-to-webm-web-video-guide",
        "datePublished": "2026-06-26",
        "dateModified": "2026-06-26",
        "inLanguage": "en",
        "author": {
            "@type": "Organization",
            "name": "Mochify Engineering Team",
            "url": "https://mochify.app"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app",
            "logo": {
                "@type": "ImageObject",
                "url": "https://mochify.app/logo.png"
            }
        },
        "about": [
            { "@type": "Thing", "name": "WebM" },
            { "@type": "Thing", "name": "VP9" },
            { "@type": "Thing", "name": "MP4" },
            { "@type": "Thing", "name": "Web video performance" },
            { "@type": "Thing", "name": "Core Web Vitals" }
        ],
        "keywords": "convert mp4 to webm, webm vs mp4, vp9 web video, video compression web, core web vitals video, html5 video fallback"
    }
    <\/script>`}

    {@html `<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "Convert MP4 to WebM for the Web", "item": "https://mochify.app/guides/mp4-to-webm-web-video-guide" }
        ]
    }
    <\/script>`}

    {@html `<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Do I still need an MP4 if I'm serving WebM?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Even though WebM/VP9 has broad modern browser support, you should always include an MP4/H.264 source as a fallback. Some legacy browsers, certain email clients, and some social sharing contexts require MP4. The video fallback pattern handles this automatically - modern browsers take the WebM and ignore the MP4 entirely, while anything that cannot play WebM falls through to the H.264 source."
                }
            },
            {
                "@type": "Question",
                "name": "Which is better for web video: VP9 or AV1?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For most projects today, VP9 is the pragmatic choice. It delivers 30–50% smaller files than H.264, encodes in reasonable time, and has near-universal support across current browsers including Safari. AV1 compresses 10–30% better than VP9 and is supported in all modern browsers including Safari 17+, but encode times are 5–10x longer than VP9."
                }
            },
            {
                "@type": "Question",
                "name": "Will converting to WebM reduce video quality?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "At comparable bitrate targets, WebM/VP9 actually delivers better quality than H.264. The point of the conversion is that you get the same perceived quality at a lower bitrate. For most web uses - hero loops, product demos - a moderate VP9 quality setting will produce a file that looks identical to the source at significantly smaller size."
                }
            },
            {
                "@type": "Question",
                "name": "Does Safari support WebM in 2026?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Current versions of Safari support VP8/VP9 in WebM. AV1 is supported in Safari 17 and later. The MP4 fallback remains necessary for older Safari versions and users who have not updated recently."
                }
            },
            {
                "@type": "Question",
                "name": "Can I convert MP4 to WebM without installing anything?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Mochify's video tool at mochify.app/solutions/mp4-to-webm runs entirely in your browser - no install required. The conversion engine runs client-side so nothing is uploaded to a server."
                }
            }
        ]
    }
    <\/script>`}
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Convert MP4 to WebM for the Web: Smaller Files, Faster Pages, No Upload Required
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Converting an MP4 hero video to WebM using VP9 typically cuts file size by 30–50% with no visible quality difference. This guide covers the codec landscape, the exact size savings you can expect, the <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">&lt;video&gt;</code> fallback pattern that keeps Safari and legacy browsers covered, and how to convert without uploading your footage to a third-party server.
        </p>

        <p class="text-sm text-[#875F42]">Published {metadata.date} by the <strong class="text-[#6C3F31]">Mochify Engineering Team</strong>. For web developers and performance-focused teams who need to reduce video payload for LCP-critical pages without compromising compatibility or privacy.</p>
    </header>

    <!-- Card-link TOC -->
    <section class="mb-12">
        <h2 class="font-black text-[#4A2C2C] text-lg mb-5 flex items-center gap-3">
            <span class="w-1.5 h-6 bg-[#F06292] rounded-full shrink-0"></span>
            What's in This Guide
        </h2>
        <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner" aria-label="Table of contents">
            <ul class="space-y-3">
                {#each tocItems as item}
                    <li>
                        <a href="#{item.id}" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform shrink-0">{item.n}</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </section>

    <div class="space-y-12 text-lg text-[#6C3F31] leading-relaxed">

        <!-- Intro -->
        <p>If you have an MP4 video on your landing page, hero section, or product demo, you are almost certainly serving a larger file than you need to. Converting that MP4 to WebM using VP9 typically cuts file size by 30–50% with no visible quality difference. That is not a theoretical gain: a 12 MB hero video becomes roughly 7 MB, and a background loop that took three seconds to buffer on mobile might load in under two. For pages where video is the Largest Contentful Paint element, this matters directly for your Core Web Vitals score.</p>

        <!-- Section 1 -->
        <section id="webm-vs-mp4" class="scroll-mt-24">
            <SectionHeading>WebM vs MP4: What's Actually Different?</SectionHeading>
            <p class="mb-4">WebM is a royalty-free container built specifically for web delivery. MP4 is a general-purpose container designed for broad compatibility. The practical difference is not really about containers: it is about the codecs they carry.</p>
            <ul class="list-disc pl-6 mb-4 space-y-2">
                <li><strong class="text-[#4A2C2C]">MP4</strong> typically carries H.264 (AVC) video and AAC audio. H.264 is the universal fallback: every browser on every platform plays it, which is exactly why it is the right choice for email attachments, social uploads, and anywhere you do not control the player.</li>
                <li><strong class="text-[#4A2C2C]">WebM</strong> carries VP8, VP9, or AV1 video alongside Opus or Vorbis audio. VP9 is the practical choice for most web projects today: near-universal modern browser support, roughly 30–50% smaller files than H.264 at similar perceived quality, and encode times measured in seconds for typical web clips.</li>
                <li><strong class="text-[#4A2C2C]">AV1</strong> in WebM pushes compression further still - typically 40–55% smaller than H.264 - but encode times are 5–10x longer than VP9, and hardware decoder support on pre-2020 mobile devices is inconsistent.</li>
            </ul>
            <p>The reason web developers care about this split: H.264 is royalty-bearing, which means tooling and distribution can carry licensing costs and complications. VP9 and AV1 are royalty-free, which is why they are the codecs of choice when you are serving video you control directly.</p>
        </section>

        <!-- Section 2 -->
        <section id="browser-support" class="scroll-mt-24">
            <SectionHeading>Browser Support in 2026: What You Can Safely Ship</SectionHeading>
            <p class="mb-4">VP9 in WebM is the safe bet for modern web delivery. <a href="https://caniuse.com/webm" target="_blank" rel="noopener noreferrer">According to caniuse.com</a>, WebM (VP8/VP9) is supported in current versions of all major desktop and mobile browsers as of March 2026 - Chrome, Edge, Firefox, and Safari all handle it. The practical implication: if you serve WebM/VP9 alongside an MP4/H.264 fallback, you get maximum compression for modern browsers and guaranteed compatibility for anything older.</p>
            <p class="mb-4">The Safari situation has improved materially. Safari historically lagged on VP9 and AV1 support, forcing many teams to maintain MP4 as the primary format. That has changed:</p>
            <ul class="list-disc pl-6 mb-4 space-y-2">
                <li>VP8/VP9 in WebM: supported in current Safari versions.</li>
                <li>AV1: supported in Safari 17 and later, alongside Chrome, Firefox, and Edge.</li>
            </ul>
            <p class="mb-4">This means AV1 is a viable choice if your audience skews toward recent hardware and software, though it remains a stretch if you need to cover pre-2022 mobile browsers. For most projects, VP9 WebM plus H.264 MP4 fallback covers 99%+ of users.</p>
            <p><a href="https://caniuse.com/?search=H.264" target="_blank" rel="noopener noreferrer">H.264 in MP4</a> remains the most broadly compatible format across all browsers, making it the correct fallback - not the primary format for a performance-optimised site.</p>
        </section>

        <!-- Section 3 -->
        <section id="file-size-benchmarks" class="scroll-mt-24">
            <SectionHeading>How Much Smaller? VP9 and AV1 File Size Benchmarks</SectionHeading>
            <p class="mb-4">The numbers here come from several independent benchmarks and are consistent enough to use as planning figures.</p>

            <p class="mb-3 font-bold text-[#4A2C2C]">1080p 60-second clip, comparative output sizes:</p>
            <ScrollableTable class="mb-6">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border-b border-pink-100">Format</th>
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border-b border-pink-100">Codec</th>
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border-b border-pink-100">Approximate size</th>
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border-b border-pink-100">vs H.264</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-pink-50">
                            <td class="px-4 py-3">MP4</td>
                            <td class="px-4 py-3">H.264</td>
                            <td class="px-4 py-3">~12 MB</td>
                            <td class="px-4 py-3 text-[#875F42]">baseline</td>
                        </tr>
                        <tr class="border-b border-pink-50 bg-[#FFFBFC]">
                            <td class="px-4 py-3">WebM</td>
                            <td class="px-4 py-3">VP9</td>
                            <td class="px-4 py-3">~7 MB</td>
                            <td class="px-4 py-3 text-[#F06292] font-bold">~42% smaller</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">WebM</td>
                            <td class="px-4 py-3">AV1</td>
                            <td class="px-4 py-3">~5 MB</td>
                            <td class="px-4 py-3 text-[#F06292] font-bold">~58% smaller</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>

            <p class="mb-3 font-bold text-[#4A2C2C]">720p 60-second clip:</p>
            <ScrollableTable class="mb-6">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border-b border-pink-100">Format</th>
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border-b border-pink-100">Codec</th>
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border-b border-pink-100">Approximate size</th>
                            <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border-b border-pink-100">vs H.264</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-pink-50">
                            <td class="px-4 py-3">MP4</td>
                            <td class="px-4 py-3">H.264</td>
                            <td class="px-4 py-3">~6 MB</td>
                            <td class="px-4 py-3 text-[#875F42]">baseline</td>
                        </tr>
                        <tr class="border-b border-pink-50 bg-[#FFFBFC]">
                            <td class="px-4 py-3">WebM</td>
                            <td class="px-4 py-3">VP9</td>
                            <td class="px-4 py-3">~3.5 MB</td>
                            <td class="px-4 py-3 text-[#F06292] font-bold">~42% smaller</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">WebM</td>
                            <td class="px-4 py-3">AV1</td>
                            <td class="px-4 py-3">~2.5 MB</td>
                            <td class="px-4 py-3 text-[#F06292] font-bold">~58% smaller</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>

            <p class="mb-4">These are representative benchmarks corroborated by <a href="https://www.mux.com/articles/how-to-create-webm-videos-with-ffmpeg" target="_blank" rel="noopener noreferrer">Mux's encoding guidance</a>, which recommends 2–3 Mbps for 1080p VP9 versus 4–6 Mbps for H.264 at comparable quality - implying roughly 40–50% bitrate savings. A codec comparison tool from <a href="https://ittybit.com/guides/compare-video-codecs/" target="_blank" rel="noopener noreferrer">ittybit.com</a> shows similar results: for a 1080p test clip, H.264 output was ~25 MB, VP9 ~17 MB, and AV1 ~15 MB.</p>
            <p class="mb-4">The rule of thumb for planning: expect WebM/VP9 to deliver 30–50% smaller files than MP4/H.264 at equivalent visual quality. AV1 can push that to 40–58%, at the cost of significantly longer encode times.</p>

            <InfoBox type="tip" title="AV1 encode time trade-off">
                AV1 is 5–10x slower than VP9 to encode, and VP9 is already slower than H.264. For short web clips this is usually fine - a 30-second loop might take a few minutes rather than seconds - but for longer content or batch jobs, AV1 encode time is a real planning consideration.
            </InfoBox>
        </section>

        <!-- Section 4 -->
        <section id="video-fallback" class="scroll-mt-24">
            <SectionHeading>The &lt;video&gt; Fallback Pattern Every Site Should Use</SectionHeading>
            <p class="mb-4">Serving WebM without a fallback is a mistake - older browsers and some contexts still require MP4. The correct pattern is a <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">&lt;video&gt;</code> element with multiple <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">&lt;source&gt;</code> children in priority order. The browser picks the first source it can play and stops evaluating the rest.</p>

            <CodeBlock filename="hero.html" code={videoFallbackCode} />

            <p class="mb-4">A few implementation notes worth keeping in mind:</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-8">Order matters</h3>
            <p class="mb-4">Put the WebM source first. Browsers that support VP9 will take it and download the smaller file. Browsers that do not will fall through to the MP4. <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/video" target="_blank" rel="noopener noreferrer">MDN explicitly recommends listing the smaller resource first</a> so capable browsers pay the lower bandwidth cost.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-8">Include the <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">type</code> attribute with codec hints</h3>
            <p class="mb-4">The browser uses this to skip sources it cannot play without attempting to download them. <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">video/webm; codecs="vp9, opus"</code> and <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">video/mp4; codecs="avc1.42E01E, mp4a.40.2"</code> are the correct type strings for VP9 WebM and H.264 MP4 respectively.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-8"><code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">preload="metadata"</code> instead of <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">preload="auto"</code></h3>
            <p class="mb-4">This tells the browser to fetch only enough to know the video's duration and dimensions, not the full file, on initial load. For hero videos especially, this is the difference between video content dominating your LCP or staying out of the critical path.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-8"><code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">muted</code> is required for <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">autoplay</code></h3>
            <p class="mb-4">Browsers block autoplay of unmuted video. If you want a background loop to start automatically, it must be muted.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-8"><code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">playsinline</code> for iOS Safari</h3>
            <p>Without this, iOS Safari will try to play the video fullscreen rather than inline in the page.</p>
        </section>

        <!-- Section 5 -->
        <section id="core-web-vitals" class="scroll-mt-24">
            <SectionHeading>Video Format Choices and Core Web Vitals</SectionHeading>
            <p class="mb-4">Converting MP4 to WebM is not just about file size. It connects directly to how Google scores your page.</p>
            <p class="mb-4">Images and video account for over 70% of the bytes downloaded for the average website. Choosing more efficient formats can lead to lower overall page load times and potentially improve a page's Largest Contentful Paint (LCP). LCP is one of the three Core Web Vitals Google uses in ranking - it measures how long the largest visible element (often a hero image or video) takes to render.</p>
            <p class="mb-4">When your hero video is the LCP element, every megabyte you strip from it reduces LCP time directly. Switching a 12 MB H.264 hero to a 7 MB VP9 WebM, combined with <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">preload="metadata"</code> and a poster image, is one of the higher-leverage LCP optimisations available on video-heavy pages.</p>
            <p class="mb-4">The pattern that works:</p>
            <ol class="list-decimal pl-6 mb-4 space-y-2">
                <li>Serve WebM/VP9 as the primary source, MP4/H.264 as fallback.</li>
                <li>Use <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">preload="metadata"</code> to avoid blocking the initial parse on a full video download.</li>
                <li>Set a <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">poster</code> image that renders while the video loads, so the LCP element itself is a small static image rather than waiting for the first video frame.</li>
                <li>For below-the-fold video: consider <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">preload="none"</code> and an <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">IntersectionObserver</code> to defer loading until the element is near the viewport.</li>
            </ol>
            <p class="mb-4"><a href="https://web.dev/learn/performance/video-performance" target="_blank" rel="noopener noreferrer">web.dev's video performance module</a> demonstrates this same pattern and goes deeper on <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">poster</code> image optimisation and lazy-loading strategies for below-the-fold video.</p>
            <p>If you are already optimising images for web performance - converting to WebP or AVIF, setting responsive sizes, preloading the hero - video format is the next logical step. See <a href="/guides/optimizing-hero-images">Optimising Hero Images for Web Performance</a> for the image side of this and how image and video optimisation work together for LCP-critical pages.</p>
        </section>

        <!-- Section 6 -->
        <section id="privacy-risks" class="scroll-mt-24">
            <SectionHeading>Why Online Converters Are a Privacy Risk</SectionHeading>
            <p class="mb-4">The obvious tool for converting MP4 to WebM is a search away - dozens of sites offer free browser-based conversion. But what most of them actually do is upload your file to a remote server, run FFmpeg, and hand you back the result. That means your footage leaves your machine.</p>
            <p class="mb-4">The implications range from inconvenient to serious.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-8">Retention windows vary wildly</h3>
            <p class="mb-4">Some services delete files after conversion; others hold them for 24 hours or longer. Convertio's policy, for example, states that output files are held for 24 hours before deletion, with IP addresses and conversion metadata kept for significantly longer. If you are converting client footage, demo reels, unreleased product videos, or anything under NDA, "deleted after 24 hours" is not the same as "never left your device."</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-8">Logs persist even when files do not</h3>
            <p class="mb-4">Even services that delete files promptly tend to log IP addresses, file types, conversion timestamps, and success flags. This data can be retained for weeks or months, and it is exactly the kind of data that appears in breach reports.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mb-3 mt-8">Real incidents have happened</h3>
            <p class="mb-4">A 2024 report documented a breach at TuneFab, a media converter, where a misconfigured database exposed around 280 GB of user data including IP addresses and account identifiers. A separate incident involved Dirpy, an online video downloader, leaking 15.7 million records including user activity logs and the URLs of downloaded content.</p>

            <InfoBox type="warning" title="FBI advisory">
                A 2025 advisory from the FBI warned that some free online file converter sites have been used to distribute malware, tricking users into downloading infected files as part of conversion workflows. The recommendation is to avoid arbitrary free converters and use trusted, local tools instead.
            </InfoBox>

            <p class="mb-4">The alternative is browser-based conversion using WebAssembly - tools where the conversion engine runs inside your browser tab and your video bytes never touch a remote server. ffmpeg.wasm is a full WebAssembly port of FFmpeg that runs entirely client-side; the project explicitly describes its privacy benefit as "your users' data only lives inside their browser." These tools can even run offline once cached, since there is no server round-trip involved.</p>
            <p>Mochify's video tool takes the same approach: conversion happens in your browser. The video never leaves your device. See also <a href="/guides/privacy-image-optimization">Privacy and Image Optimization</a> for a broader look at the data-handling landscape for online media tools.</p>
        </section>

    </div>

    <!-- Mochify Workflow -->
    <section id="mochify-workflow" class="scroll-mt-24 mt-12 bg-gradient-to-b from-[#FFF5F7] to-white border border-pink-100 rounded-3xl p-8">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">Mochify Workflow: Convert MP4 to WebM in Your Browser</h2>
        <p class="text-[#6C3F31] text-lg mb-8 leading-relaxed">Mochify's video engine runs entirely client-side. Open the tool, drop in your MP4, and the conversion runs in your browser tab. No account required to start; no upload to a remote server; no waiting on a queue.</p>

        <ol class="space-y-5" aria-label="Conversion steps">
            {#each [
                { n: '1', title: 'Open the tool.', body: 'Go to mochify.app/solutions/mp4-to-webm in your browser. No install required.' },
                { n: '2', title: 'Drop in your MP4.', body: 'Drag your file onto the tool or click to select it from your file system.' },
                { n: '3', title: 'Wait for the conversion.', body: 'Processing runs in your browser tab. Larger files take longer since everything runs locally on your machine - you will see progress as it works.' },
                { n: '4', title: 'Download the WebM output.', body: 'Save the converted file alongside your original MP4.' },
                { n: '5', title: 'Add both to your <video> element.', body: 'Use the fallback pattern from Section 4 - WebM first, MP4 second. Keep both files; you need both for full browser coverage.' },
            ] as step}
                <li class="flex gap-4 items-start">
                    <span class="w-8 h-8 shrink-0 rounded-full bg-[#F06292] text-white flex items-center justify-center font-black text-sm mt-0.5">{step.n}</span>
                    <p class="text-[#6C3F31] leading-relaxed"><strong class="text-[#4A2C2C]">{step.title}</strong> {@html step.body}</p>
                </li>
            {/each}
        </ol>

        <InfoBox type="tip" title="Pro tip: shorter loops, smaller files">
            If your source video is longer than a short loop, trim it to the minimum necessary length before converting. For background videos especially, a 6–10 second seamless loop delivers the same visual effect at a fraction of the file size.
        </InfoBox>

        <div class="border-t border-pink-100 mt-8 pt-6 text-[#875F42] text-base leading-relaxed">
            <strong class="text-[#6C3F31]">Privacy note:</strong> Because processing is entirely in-browser, there are no retention concerns. The video bytes never leave your device - not to Mochify's servers, not to any third party. This is the fundamental architectural difference from server-side online converters.
        </div>
    </section>

    <!-- Cheat Sheet -->
    <section id="cheat-sheet" class="scroll-mt-24 mt-12 bg-[#FFF5F7] border border-pink-100 rounded-3xl p-8">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">MP4 to WebM Cheat Sheet</h2>
        <ScrollableTable>
            <table class="w-full text-sm">
                <thead>
                    <tr class="bg-white">
                        <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border-b border-pink-100">Decision</th>
                        <th class="text-left px-4 py-3 font-bold text-[#4A2C2C] border-b border-pink-100">Recommendation</th>
                    </tr>
                </thead>
                <tbody>
                    {#each [
                        ['Primary web codec', 'VP9 (WebM) - broad support, 30–50% savings vs H.264'],
                        ['Future-proofing', 'AV1 (WebM) - up to 58% savings, but slower encode'],
                        ['Fallback format', 'H.264 (MP4) - universal compatibility'],
                        ['Source order in <video>', 'WebM first, MP4 second'],
                        ['type attribute (WebM)', 'video/webm; codecs="vp9, opus"'],
                        ['type attribute (MP4)', 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'],
                        ['Hero/autoplay attributes', 'autoplay muted loop playsinline preload="metadata"'],
                        ['LCP optimisation', 'poster image + preload="metadata"'],
                        ['Below-the-fold video', 'preload="none" + IntersectionObserver'],
                        ['Privacy-safe conversion', 'In-browser tool (Mochify, ffmpeg.wasm) - no upload'],
                        ['Typical VP9 file saving', '30–50% smaller than H.264 at similar quality'],
                        ['AV1 encode time trade-off', '5–10x slower than VP9; not worth it for tight deadlines'],
                    ] as [decision, rec], i}
                        <tr class="{i % 2 === 1 ? 'bg-white' : ''} border-b border-pink-50 last:border-b-0">
                            <td class="px-4 py-3 font-semibold text-[#4A2C2C] align-top">{decision}</td>
                            <td class="px-4 py-3 text-[#6C3F31]">{rec}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </ScrollableTable>
    </section>

    <!-- FAQ -->
    <section id="faq" class="scroll-mt-24 mt-12">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-8 flex items-center gap-3">
            <span class="w-1.5 h-7 bg-[#F06292] rounded-full shrink-0"></span>
            FAQ
        </h2>

        <div class="space-y-2">
            {#each [
                {
                    q: 'Do I still need an MP4 if I\'m serving WebM?',
                    a: 'Yes. Even though WebM/VP9 has broad modern browser support, you should always include an MP4/H.264 source as a fallback. Some legacy browsers, certain email clients, and some social sharing contexts require MP4. The <video> fallback pattern handles this automatically - modern browsers take the WebM and ignore the MP4 entirely, while anything that cannot play WebM falls through to the H.264 source.'
                },
                {
                    q: 'Which is better for web video: VP9 or AV1?',
                    a: 'For most projects today, VP9 is the pragmatic choice. It delivers 30–50% smaller files than H.264, encodes in reasonable time, and has near-universal support across current browsers including Safari. AV1 compresses 10–30% better than VP9 and is supported in all modern browsers including Safari 17+, but encode times are 5–10x longer than VP9. If your team has the encode budget and your audience is on recent hardware, AV1 is the more efficient output. Otherwise, VP9 covers the practical majority of cases.'
                },
                {
                    q: 'Will converting to WebM reduce video quality?',
                    a: 'At comparable bitrate targets, WebM/VP9 actually delivers better quality than H.264 - the point of the conversion is that you get the same perceived quality at a lower bitrate. If your converter settings are producing visibly lower quality WebM than your original MP4, the output quality or bitrate target is set too aggressively. For most web uses (hero loops, product demos), a moderate VP9 quality setting will produce a file that looks identical to the source at significantly smaller size.'
                },
                {
                    q: 'Does Safari support WebM in 2026?',
                    a: 'Current versions of Safari support VP8/VP9 in WebM. AV1 is supported in Safari 17 and later. The days of Safari being a hard blocker on WebM delivery are behind us for most audiences, though the MP4 fallback remains necessary for older Safari versions and any users who have not updated recently.'
                },
                {
                    q: 'Why should I convert in the browser rather than uploading to an online converter?',
                    a: 'Server-side converters require your video to leave your machine. Depending on the service, your file may be retained for 24 hours or more, logged alongside your IP address, and potentially accessible if the provider\'s storage is misconfigured or breached. For footage under NDA, client work, or any video you\'d rather keep private, in-browser conversion - where the video bytes never leave your device - is the correct choice. The FBI issued guidance in 2025 noting that some free online converters have been used to distribute malware, adding a security dimension to the privacy concern.'
                },
                {
                    q: 'Can I convert MP4 to WebM without installing anything?',
                    a: 'Yes. Mochify\'s video tool at mochify.app/solutions/mp4-to-webm runs entirely in your browser - no install required. The conversion engine runs client-side, so nothing is uploaded to a server. For development workflows where you prefer a command-line approach, FFmpeg handles MP4-to-WebM conversion locally, but that requires a local FFmpeg install.'
                },
                {
                    q: 'What attributes should a hero autoplay video have in HTML?',
                    a: 'For a muted autoplay background loop: autoplay, muted, loop, and playsinline are the baseline. Add preload="metadata" to avoid blocking page load on the full video download, and include a poster attribute pointing to a still frame so the element has something to show before the first video frame loads. Without muted, browsers will block autoplay. Without playsinline, iOS Safari will force the video into fullscreen.'
                },
                {
                    q: 'Is WebM supported for video backgrounds on Squarespace, Webflow, or WordPress?',
                    a: 'Webflow natively supports WebM video in its video backgrounds, as does modern WordPress when using the Video block or self-hosted video elements in custom themes. Squarespace\'s built-in video blocks typically accept both formats. For any of these platforms, the practical recommendation is the same: prepare both a WebM and MP4 version and use the platform\'s option to specify multiple sources, or embed a custom HTML block with the video fallback pattern.'
                },
            ] as item}
                <details class="group border border-pink-100 rounded-2xl overflow-hidden">
                    <summary class="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none bg-white hover:bg-[#FFF5F7] transition-colors">
                        <span class="font-bold text-[#4A2C2C] text-base">{item.q}</span>
                        <svg class="w-5 h-5 text-pink-400 shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </summary>
                    <div class="px-6 pb-5 pt-2 text-[#6C3F31] leading-relaxed text-base bg-white border-t border-pink-50">
                        {item.a}
                    </div>
                </details>
            {/each}
        </div>
    </section>

    <!-- CTA -->
    <aside class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-8 mt-12">
        <p class="text-[#6C3F31] leading-relaxed mb-5">Convert your MP4 to WebM right now - no account needed, nothing uploaded. Mochify's video engine runs entirely in your browser, so your footage stays on your machine while you get a web-optimised WebM file ready to drop into your <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">&lt;video&gt;</code> element.</p>
        <a href="/solutions/mp4-to-webm" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 no-underline text-base">
            Convert MP4 to WebM free
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </a>
    </aside>

    <div class="mt-12">
        <RelatedGuides guides={related} />
    </div>

</article>
