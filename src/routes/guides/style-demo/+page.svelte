<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
    import VerdictPill from '$lib/components/guide-demo/VerdictPill.svelte';
    import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
    import StepList from '$lib/components/guide-demo/StepList.svelte';
    import CodeCard from '$lib/components/guide-demo/CodeCard.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

    // STYLE DEMO - a restyled fork of the why-hdr-photos-look-flat-when-shared
    // guide. Not indexed, not in guides.ts. Content is identical to the live
    // guide; only the presentation differs (open ProseDocument-style layout,
    // blob background, mochi liquid-glass surfaces, new demo components).

    const metadata = {
        category: "Image Formats",
        readTime: "17 min read",
        date: "August 26, 2026"
    };

    const toc = [
        { id: "the-short-answer", label: "The short answer" },
        { id: "what-a-gain-map-is", label: "What a gain map actually is" },
        { id: "three-reasons", label: "The three reasons an HDR photo goes flat" },
        { id: "where-hdr-displays", label: "Where HDR photos actually display right now" },
        { id: "check-your-screen", label: "Check whether your screen shows HDR" },
        { id: "which-formats", label: "Which formats can carry HDR (and which cannot)" },
        { id: "edits-that-switch-hdr-off", label: "The edits that switch HDR off" },
        { id: "mochify-workflow", label: "Mochify Workflow: keep the gain map, or add one" },
        { id: "cheat-sheet", label: "Cheat Sheet: does this keep my gain map?" },
        { id: "faq", label: "FAQ" }
    ];

    const workflowSteps = [
        {
            title: "Sort your sources.",
            html: "<p>Files from a recent iPhone or Android phone probably carry a map already. Files from cameras, older phones, scans, screenshots, or anything that has been through an editor or a website probably do not. You do not need to know for sure; the converter checks.</p>"
        },
        {
            title: "Finish destructive edits first.",
            html: "<p>Crop, brightness, sharpening, background removal, and shadows all belong before this step, on the SDR base (see the section above). Resize, crop, and rotate are safe on the HDR path and carry an existing map through untouched.</p>"
        },
        {
            title: "Drop the files on the converter.",
            html: "<p>It accepts JPG, JPEG, PNG, WebP, AVIF, HEIC, HEIF, and HIF, up to 3 files at 20MB each without an account, and choose JPG as the output. If a file already carries a gain map, it is re-encoded verbatim; nothing is recomputed, because a derived map is measurably worse than the one the sensor produced. If the file is plain SDR, a map is generated from the highlights already in the frame: a smooth ramp that starts around three-quarters brightness and climbs to roughly 1.5 stops, tempered by local contrast so a bright sky lifts differently from a white shirt. Generated headroom is invented, not recovered. It looks convincing on an HDR screen, but it is an effect, not measured data, and we would rather say so than pretend otherwise.</p>"
        },
        {
            title: "Read the result.",
            html: "<p>Every response says which lane the file took. The <code>X-Mochify-HDR</code> header is <code>true</code> for preserved, <code>generated</code> for synthesized, and <code>false</code> when the output carries no map, which happens if you chose a format that cannot carry one or requested an edit that switches HDR off.</p>"
        },
        {
            title: "Same thing from the API.",
            html: "<p>One parameter: <code>hdr=true</code> preserves only, <code>hdr=generate</code> preserves and synthesizes.</p>"
        }
    ];

    const curlExample = `curl -X POST "https://api.mochify.app/v1/squish?type=jpg&hdr=generate" \\
  -H "Authorization: Bearer $MOCHIFY_KEY" \\
  --data-binary @photo.jpg \\
  -D headers.txt -o photo-hdr.jpg

grep X-Mochify-HDR headers.txt
# X-Mochify-HDR: generated`;

    const faqItems = [
        {
            q: "Why do my HDR photos look washed out after export?",
            a: "Usually because whatever you opened the export in does not render gain maps, so it shows the standard-range base image alone. Check the same file on a recent iPhone or Pixel in the native gallery: if it looks right there, the map survived and the problem is the viewer. If it looks flat there too, an edit or a pipeline stripped the map and you need a fresh export from a source that still has it."
        },
        {
            q: "Is generated HDR the same as real HDR?",
            a: "No. A camera measures headroom at capture time; synthesis infers a plausible map from the highlights that survived in an SDR file. Mochify's generated maps target about 1.5 stops, applied above roughly three-quarters brightness, while a real capture typically carries 2 to 4 stops. It looks convincing on an HDR display, but it is an effect, not recovered detail."
        },
        {
            q: "Will an Ultra HDR photo still open on a normal screen?",
            a: "Yes. Ultra HDR is a standard JPEG with extra data attached, so anything that reads JPEG reads it. Screens and apps that understand the gain map show the brighter version; everything else shows the normal image, with no clipping or other damage."
        },
        {
            q: "Does a gain map make the file much bigger?",
            a: "No. The map is stored at reduced resolution and compressed hard, so it typically adds a few percent. Android's specification recommends a quarter of the primary image's resolution per dimension."
        },
        {
            q: "Can I add HDR to an old JPEG?",
            a: "You can add a generated gain map to it, and on an HDR screen the highlights will lift. What you cannot do is recover detail the camera never recorded; anything that was clipped to white in the original stays clipped, just brighter. Treat it as a finishing effect, not a restoration."
        },
        {
            q: "How do I know if my screen shows HDR photos?",
            a: "View a plain JPEG and its Ultra HDR version side by side; the comparison on Mochify's SDR to HDR converter page is built for this. If the HDR version is visibly brighter in the highlights, your screen and browser render gain maps. If both look the same, you are seeing the standard-range image, which usually means an SDR display or a browser without gain-map support. A recent phone is the quickest place to see the difference."
        },
        {
            q: "Which browsers show HDR photos in 2026?",
            a: "Safari 26 on iOS, iPadOS, macOS, and visionOS, plus Chromium-based browsers such as Chrome, Edge, Brave, and Opera, on a display with HDR headroom. Firefox does not yet, and there is no caniuse.com entry to track it, so test on a device."
        },
        {
            q: "Does converting an HDR photo to WebP or PNG keep the HDR?",
            a: "No. Neither format can represent HDR in common use, so you get the standard-range base image. Keep JPEG (Ultra HDR) or HEIC if the destination understands gain maps, or AVIF and JPEG XL if the destination can display HDR pixel data directly."
        }
    ];

    const related = [
        { title: "Jpegli Guide 2026: Quality-Per-Byte", href: "/guides/jpeg-in-2026-jpegli", desc: "the encoder that makes an Ultra HDR JPEG's second layer almost free." },
        { title: "What Is an AVIF File? (And How to Open One)", href: "/guides/what-is-an-avif-file", desc: "the format that stores HDR in the pixels instead of a map." },
        { title: "HEIF to JPG: The Complete Conversion Guide", href: "/guides/heif-to-jpg-complete-guide", desc: "converting the container most HDR captures start in." },
        { title: "HIF to JPG: Convert Canon, Sony & Fujifilm Photos to Shareable JPEGs", href: "/guides/hif-to-jpg-canon-sony-fujifilm", desc: "the pro-camera lane, where 10-bit files need a different plan." },
        { title: "Can Safari Open HEIC Images on the Web?", href: "/guides/can-safari-open-heic-images", desc: "the companion browser-support question for Apple's other format." }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>Guide Style Demo | Mochify</title>
    <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<!-- Single max-w-3xl reading column: header, prose, and every card share the
     same container edges. At rollout this constraint moves to the guides
     layout's <main> so the breadcrumb shares it too. -->
<article class="relative mx-auto w-full max-w-3xl px-5 sm:px-6 md:px-0 pt-6 md:pt-0 text-lg text-[#6C3F31] leading-relaxed">

    <!-- Top-only mochi wash: absolute (scrolls away with the page, unlike the
         fixed BlobBackground), full-bleed via the 100vw trick, and faded out
         by a mask before the body text starts. The reading surface below is
         plain --mochi-bg, matching /about and /architecture. -->
    <div class="hero-wash" aria-hidden="true"></div>


    <header class="mb-12 md:mb-14">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#F06292] mb-3 mt-0">
            {metadata.category} · Guide
        </p>
        <h1 class="text-3xl md:text-[2.75rem] font-black text-[#4A2C2C] tracking-tight leading-[1.1] mb-0">
            Why HDR Photos Look Flat When You Share Them (and How Gain Maps Fix It)
        </h1>
        <div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
        <p class="mt-5 text-sm font-bold text-[#875F42] mb-0">
            {metadata.readTime} · {metadata.date} · Mochify Engineering Team
        </p>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed mt-8 mb-0">
            HDR photos look flat when you share them because the extra brightness lives in a separate layer, called a gain map, that only some screens and apps know how to use. Everything else silently shows the standard-range base image underneath, and a photo that glowed on your phone turns dull on a client's laptop, in a browser, or after an export. The base image is what it always was. What changed is that nothing is applying the map. This guide explains the mechanism in plain English, walks through each place the map gets lost, and shows how to get a file that keeps it, or a plausible one when the original never had it.
        </p>
    </header>

    <div class="space-y-12">

        <!-- TOC -->
        <section>
            <GuideTOC items={toc} />
        </section>

        <!-- 01 -->
        <section id="the-short-answer" class="scroll-mt-24">
            <SectionHeading>The short answer</SectionHeading>
            <GlassPanel label="Key takeaway">
                <p>
                    A modern HDR photo is two pictures in one file: a normal standard-range (SDR) image that everything can show, plus a small gain map that tells an HDR display how much brighter each region may go. When a viewer, a platform, or an export path ignores or strips that map, you get the SDR image alone, which is exactly the "flat and washed out" result people describe. The photo has not been damaged. The extra headroom is either still there and unread, or it has been removed on the way.
                </p>
            </GlassPanel>
            <p class="mb-4 mt-6">That distinction matters because the fixes are different. If the map is still in the file, the fix is to view it somewhere that renders HDR. If the map was stripped by an edit or an upload pipeline, you need a copy that keeps it. And if the source was never HDR to begin with, no viewer will make it glow; the only honest option is to generate a plausible map, and to know that is what you did.</p>
        </section>

        <!-- 02 -->
        <section id="what-a-gain-map-is" class="scroll-mt-24">
            <SectionHeading>What a gain map actually is</SectionHeading>
            <p class="mb-4">A gain map is a low-resolution brightness multiplier stored next to a normal image, and it is how one file can look correct on both an SDR screen and an HDR one. Android's Ultra HDR specification describes it as "a logarithmic map indicating how much to brighten each pixel in the SDR rendition to produce the target HDR rendition," and recommends storing it at a quarter of the primary image's resolution per dimension, so a 1920 by 1080 photo carries a 480 by 270 map (<a href="https://developer.android.com/media/platform/hdr-image-format" target="_blank" rel="noopener noreferrer">Android Ultra HDR Image Format v1.1</a>).</p>
            <p class="mb-4">An HDR-aware display reads the base image, reads the map, and multiplies one by the other. Because the map is keyed to the display's own capability, a phone that can push highlights three times brighter than white applies more of the map than a laptop that can push them one and a half times. Anything that does not understand the map, which was every viewer in the world until 2023, simply shows the base image. The specification calls this out as the design goal: no clipping, no crushed shadows, no local contrast changes in the fallback. It is a clean degrade, not a broken one.</p>
            <p class="mb-4">Three names describe the same idea, and the naming is where most confusion starts:</p>
            <ul class="list-disc pl-6 space-y-3 marker:text-[#F06292] my-6">
                <li><strong>Ultra HDR</strong> is Google's name. It shipped with Android 14, Pixel cameras write it by default, and the container is an ordinary JPEG with the gain map tucked into a multi-picture structure and described in XMP metadata. Google's open-source <a href="https://github.com/google/libultrahdr" target="_blank" rel="noopener noreferrer">libultrahdr</a> library is the reference implementation.</li>
                <li><strong>Adaptive HDR</strong> is Apple's name for its adoption of the ISO standard, added with iOS 18, iPadOS 18, and macOS Sequoia in September 2024. iPhones had been writing an earlier, Apple-specific gain map for years before that; the standardized one is what makes those files readable elsewhere.</li>
                <li><strong>ISO 21496-1</strong> is the standard both now share. ISO published it in July 2025 as "Gain map metadata for image conversion, Part 1: Dynamic range conversion" (<a href="https://www.iso.org/standard/86775.html" target="_blank" rel="noopener noreferrer">ISO 21496-1:2025</a>), and Android 15 writes both its own metadata and the ISO metadata into the same file so a Pixel photo opens correctly on an iPhone and vice versa.</li>
            </ul>
            <p class="mb-4">The practical takeaway: a "real" HDR photo from a phone is not a special format. It is a JPEG (or HEIC) with a map inside. That is why it opens everywhere, and also why it is so easy to lose the map without noticing.</p>
        </section>

        <!-- 03 -->
        <section id="three-reasons" class="scroll-mt-24">
            <SectionHeading>The three reasons an HDR photo goes flat</SectionHeading>
            <p class="mb-4">Almost every "my HDR photo looks flat" complaint comes down to one of three causes, and forum threads tend to blur them together: the viewer is not rendering the map, the platform stripped the map, or the destination is physically SDR. A typical Adobe Community thread opens with a photo that "looks great in Lightroom" and then, once exported and opened from a folder, looks "flat and over exposed"; the replies in that same thread cover all three causes without ever separating them.</p>
            <p class="mb-4"><strong>1. The viewer ignores the map.</strong> Most desktop image viewers, most email clients, most operating-system previews, and Firefox as of this writing show the SDR base and nothing else. The file is intact. Open the same file on a recent iPhone or Pixel in the native gallery, or in Safari 26 or a current Chromium browser on an HDR-capable screen, and the highlights come back. If a file looks flat on one device and correct on another, this is the cause, and there is nothing to fix in the file.</p>
            <p class="mb-4"><strong>2. The pipeline stripped the map.</strong> A gain map is metadata plus an auxiliary image, and any process that re-encodes the picture without understanding it throws both away. Users on the Squarespace forum report exactly this: "Squarespace strips the JPEG Gain Map metadata from the file." Many social uploads through a desktop browser do the same. Some editing operations do it by necessity (see the section on edits below). Once the map is gone, no viewer can restore it, because the map was measured at capture time and cannot be recomputed from an 8-bit base image.</p>
            <p class="mb-4"><strong>3. The destination is SDR by nature.</strong> Prints, projectors, most office monitors, and any PDF are standard range. An HDR edit that pushes highlights above paper white will always land flat on paper, because there is no brighter-than-white on paper. This is the case people most often mistake for a bug.</p>
            <p class="mb-4">Diagnosing which one you have takes about a minute: view the file on a phone that shot HDR in the first place. If it glows there, the map survived and you have a viewer or destination problem. If it is flat there too, the map is gone.</p>
        </section>

        <!-- 04 -->
        <section id="where-hdr-displays" class="scroll-mt-24">
            <SectionHeading>Where HDR photos actually display right now</SectionHeading>
            <p class="mb-4">As of mid-2026, gain-map photos display correctly in the native photo apps of recent iPhones and Android phones, in Safari 26 and Chromium-based browsers, and on Instagram and Threads, while Firefox, most desktop viewers, and most website builders still show only the SDR base. The support picture moves quarterly, so treat this as a snapshot rather than a table of record.</p>
            <p class="mb-4"><strong>Browsers.</strong> WebKit's release notes are unambiguous: "in Safari 26.0 for iOS 26, iPadOS 26, macOS 26 and visionOS 26, WebKit adds support for HDR images on the web," alongside a new CSS <code>dynamic-range-limit</code> property that lets a page choose between full HDR and a standard-range rendering (<a href="https://webkit.org/blog/17333/webkit-features-in-safari-26-0/" target="_blank" rel="noopener noreferrer">WebKit Features in Safari 26.0</a>). Chromium browsers (Chrome, Edge, Brave, Opera) added Ultra HDR display support earlier. Firefox has an open request for ISO 21496-1 support with no committed date. There is no caniuse.com entry for gain-map images yet, so check on a real device rather than a compatibility table.</p>
            <p class="mb-4"><strong>Phones.</strong> Android 14 and later render Ultra HDR in the system gallery and Google Photos; iOS 18 and later render both Apple's own and ISO gain maps in Photos. These are also the screens with the most headroom to show: Apple lists the iPhone 16 Pro at 1,000 nits typical, 1,600 nits HDR peak (<a href="https://support.apple.com/en-us/121031" target="_blank" rel="noopener noreferrer">Apple tech specs</a>), and Google lists the Pixel 9 Pro at up to 2,000 nits in HDR mode. A gain map that looks dramatic on either of those will look gentler on a laptop that tops out much lower, which is by design.</p>
            <p class="mb-4"><strong>Social platforms.</strong> Meta announced HDR photo support for Instagram in March 2024, built on gain maps so a post "can be displayed on any monitor regardless of whether it supports HDR or just SDR." The practical caveats, documented by photographers rather than by Meta, are that Stories do not carry HDR, some capture modes lack a map, and uploading through a desktop browser often drops it. Post from the phone, from the native app, to keep it.</p>
            <p class="mb-4"><strong>Website builders and CMSs.</strong> This is the weakest link. Any platform that re-encodes uploads on its own pipeline will keep the map only if that pipeline understands it, and most do not yet; user reports of stripped maps on Squarespace have gone unanswered. If HDR on your own site matters, host the file you produced rather than letting the platform regenerate it, and confirm in Safari 26 or Chrome on an HDR screen.</p>
            <p class="mb-4">Ready to check your own file? <a href="/solutions/sdr-to-hdr">Convert SDR to HDR</a> returns an Ultra HDR JPEG and tells you in the response whether the map was preserved, generated, or absent.</p>
        </section>

        <!-- 05 -->
        <section id="check-your-screen" class="scroll-mt-24">
            <SectionHeading>Check whether your screen shows HDR</SectionHeading>
            <p class="mb-4">The fastest way to know whether what you are looking at can render a gain map is to view the same photo twice, once as a plain JPEG and once as an Ultra HDR JPEG, and see whether they differ. On the <a href="/solutions/sdr-to-hdr">SDR to HDR converter page</a> we keep exactly that pair side by side: if the right-hand image is visibly brighter in the highlights, your screen and browser are rendering HDR; if the two look identical, you are seeing the standard-range base of both.</p>
            <p class="mb-4">Identical is not a fault. It means one of two things: the display has no headroom above white (most office monitors, many laptops, every projector), or the browser does not read gain maps yet (Firefox, most desktop viewers). Open the same page on a recent iPhone or Android phone and the difference appears, which is also the quickest way to confirm a file of your own still carries its map: convert it, then view the result on a phone that renders HDR.</p>
            <p class="mb-4">This test is worth running before you blame an export. A surprising number of "my HDR photo went flat" complaints are looked at on a screen that could never have shown the difference in the first place.</p>
        </section>

        <!-- 06 -->
        <section id="which-formats" class="scroll-mt-24">
            <SectionHeading>Which formats can carry HDR (and which cannot)</SectionHeading>
            <p class="mb-4">Only two mainstream formats carry a gain map in a way that falls back cleanly: JPEG (as Ultra HDR) and HEIC, with AVIF and JPEG XL taking a different route by storing HDR in the pixels themselves, and WebP and PNG unable to represent HDR at all in common use. Which one you choose decides whether the photo survives the trip.</p>
            <ul class="list-disc pl-6 space-y-3 marker:text-[#F06292] my-6">
                <li><strong>JPEG with a gain map (Ultra HDR).</strong> The safest choice for sharing, because the fallback is an ordinary JPEG. Lightroom's own documentation describes a JPEG export from an HDR edit as saving "an SDR image with HDR details preserved with a Gain map" (<a href="https://helpx.adobe.com/lightroom-cc/using/hdr-output.html" target="_blank" rel="noopener noreferrer">Adobe, HDR output</a>). The map adds a few percent to file size because it is stored at reduced resolution and compressed hard.</li>
                <li><strong>HEIC / HEIF.</strong> What iPhones and many cameras write natively, with the gain map inside the container. Excellent on Apple hardware; support elsewhere is patchier, which is why so many workflows convert to JPEG for delivery. If you are converting camera HEIF files, our <a href="/guides/heif-to-jpg-complete-guide">HEIF to JPG conversion guide</a> covers the general path.</li>
                <li><strong>AVIF.</strong> Can hold true 10-bit HDR in PQ or HLG, and Adobe recommends it for HDR export because of the higher bit depth and smaller files. But that is HDR in the pixels, not a gain map over an SDR base: a viewer that does not do HDR does not get a clean fallback. AVIF also carries an ISO gain map in newer encoders, but that path is still uncommon. Our explainer on <a href="/guides/what-is-an-avif-file">what an AVIF file is</a> covers the format's wider tradeoffs.</li>
                <li><strong>JPEG XL.</strong> HDR-native, stored as floating-point pixel data; also listed by Adobe as an HDR-capable export. Like AVIF, there is nothing to synthesize a gain map into, so a JXL file is HDR only if the source was.</li>
                <li><strong>WebP.</strong> Cannot represent HDR in any form.</li>
                <li><strong>PNG.</strong> The third edition of the PNG specification adds a <code>cICP</code> chunk for native HDR color signaling (<a href="https://www.w3.org/TR/png-3/" target="_blank" rel="noopener noreferrer">W3C PNG Third Edition</a>), a different mechanism with no SDR fallback layer; a separate proposal to add gain maps to PNG remains an open issue, not part of the spec. For sharing purposes today, treat PNG as SDR.</li>
            </ul>
            <p class="mb-4">If the goal is "everyone sees a good photo and HDR screens see a better one," JPEG with a gain map is the format that delivers it. It is also the only output on our HDR converter that carries one, for exactly the reasons above.</p>
        </section>

        <!-- 07 -->
        <section id="edits-that-switch-hdr-off" class="scroll-mt-24">
            <SectionHeading>The edits that switch HDR off</SectionHeading>
            <p class="mb-4">Any edit that changes the base image invalidates the gain map, because the map is a ratio relative to that base, and honest tools return a clean SDR file rather than a file labeled HDR that no longer is. This is the least understood cause of flat exports, and it is not a bug in the editor.</p>
            <p class="mb-4">Think of the map as "multiply this pixel by this much." Brighten the base image by half a stop and the multiplier now points at a different starting value; applying it would overshoot. Sharpen through a bounded color space and everything above standard white is clipped before the map is even consulted. Remove a background and composite the subject onto a new one, and the compositing math runs on 0 to 255 values that have no concept of headroom. Generate a drop shadow and the same applies.</p>
            <p class="mb-4">So a workflow that shoots HDR, then adjusts brightness, sharpens, and cuts out the subject, ends with an SDR file no matter how careful each step was. That is not a reason to avoid those edits. It is a reason to sequence them: do the destructive edits first, on the base image, then produce the HDR deliverable last, from a source that still has its map, or by generating a map for the finished SDR result.</p>
        </section>

        <!-- 08 -->
        <section id="mochify-workflow" class="scroll-mt-24">
            <SectionHeading>Mochify Workflow: keep the gain map, or add one</SectionHeading>
            <p class="mb-4">Mochify's <a href="/solutions/sdr-to-hdr">SDR to HDR converter</a> takes any photo and returns an Ultra HDR JPEG, preserving the gain map if the file already has one and synthesizing a plausible one if it does not, so the same tool handles a Pixel capture that needs to survive a resize and a plain JPEG that never had headroom. The lane is decided by the file, not by a setting.</p>

            <GlassPanel>
                <StepList steps={workflowSteps} />
            </GlassPanel>

            <CodeCard filename="bash" code={curlExample} />

            <p class="mb-4">On the HDR path only the <code>quality</code> parameter reaches the encoder; <code>optimizeForWeb</code> is accepted but has no effect, because progressive scan and chroma subsampling belong to the plain JPEG writer that an Ultra HDR request does not go through. The encoder is Google's jpegli across the whole pipeline, which is what keeps the map close to free: better quality per byte on the base image pays for the extra layer, and the map itself usually lands in the low single-digit percentages. The <a href="/guides/jpeg-in-2026-jpegli">jpegli guide</a> covers why that matters for every JPEG, HDR or not.</p>

            <GlassInfoBox type="note" title="Privacy note for this path">
                Images travel to <code>api.mochify.app</code> over HTTPS, are streamed into memory, processed, and discarded. Nothing is written to disk and nothing is logged. Metadata, including GPS, is stripped by default. This is the same in-memory model as every image operation; the <a href="/architecture">architecture and data handling page</a> describes the read-only processing container in detail.
            </GlassInfoBox>
        </section>

        <!-- 09 -->
        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat Sheet: does this keep my gain map?</SectionHeading>

            <GuideTable class="my-6">
                <table>
                    <thead>
                        <tr>
                            <th>Step or destination</th>
                            <th>Gain map survives?</th>
                            <th>Why</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Viewing in Photos on iOS 18+ / Android 14+</td>
                            <td><VerdictPill kind="yes">Yes, rendered</VerdictPill></td>
                            <td>Native gain-map support</td>
                        </tr>
                        <tr>
                            <td>Safari 26, Chrome, Edge, Brave, Opera on an HDR screen</td>
                            <td><VerdictPill kind="yes">Yes, rendered</VerdictPill></td>
                            <td>Browser support shipped</td>
                        </tr>
                        <tr>
                            <td>Firefox, most desktop viewers, email previews</td>
                            <td><VerdictPill kind="mixed">Present but not shown</VerdictPill></td>
                            <td>Viewer ignores the map; file is intact</td>
                        </tr>
                        <tr>
                            <td>Instagram or Threads, posted from the phone app</td>
                            <td><VerdictPill kind="mixed">Usually</VerdictPill></td>
                            <td>Gain-map support since March 2024; Stories and desktop uploads excepted</td>
                        </tr>
                        <tr>
                            <td>Website builder that re-encodes uploads</td>
                            <td><VerdictPill kind="no">Often stripped</VerdictPill></td>
                            <td>Pipeline does not understand the map</td>
                        </tr>
                        <tr>
                            <td>Resize, crop, rotate on the HDR path</td>
                            <td><VerdictPill kind="yes">Yes, carried through</VerdictPill></td>
                            <td>Base changes proportionally; map re-encoded verbatim</td>
                        </tr>
                        <tr>
                            <td>Brightness, clarity, background removal, shadow generation</td>
                            <td><VerdictPill kind="no">No, returns SDR</VerdictPill></td>
                            <td>Base image changed; the ratio no longer applies</td>
                        </tr>
                        <tr>
                            <td>Export to JPEG (Ultra HDR) or HEIC</td>
                            <td><VerdictPill kind="yes">Yes</VerdictPill></td>
                            <td>Formats carry a gain map</td>
                        </tr>
                        <tr>
                            <td>Export to AVIF or JPEG XL</td>
                            <td><VerdictPill kind="note">Different mechanism</VerdictPill></td>
                            <td>HDR in the pixels, no SDR-base fallback</td>
                        </tr>
                        <tr>
                            <td>Export to WebP or PNG</td>
                            <td><VerdictPill kind="no">No</VerdictPill></td>
                            <td>Formats cannot carry it in common use</td>
                        </tr>
                        <tr>
                            <td>Print</td>
                            <td><VerdictPill kind="no">No</VerdictPill></td>
                            <td>Paper is SDR</td>
                        </tr>
                    </tbody>
                </table>
            </GuideTable>
        </section>

        <!-- 10 FAQ -->
        <GlassFAQs items={faqItems} />

        <!-- Final CTA -->
        <GlassCTA
            heading="Ready to check your own file?"
            href="/solutions/sdr-to-hdr"
            label="Convert SDR to HDR →"
        >
            Convert SDR to HDR returns an Ultra HDR JPEG and tells you in the response whether the map was preserved, generated, or absent.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>

<style>
    /* Demo-only breadcrumb adjustments. The breadcrumb renders in the shared
       guides layout at max-w-4xl; align it with this page's 3xl reading
       column and drop the current-page crumb (the h1 is two lines below it,
       and the JSON-LD BreadcrumbList keeps the full trail for SEO). At
       rollout both moves belong in the layout: constrain <main> to 3xl and
       stop appending the page-name crumb. */
    :global(nav[aria-label='Breadcrumb']) {
        max-width: 48rem;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 1.25rem;
    }

    /* Hide the page-name crumb and the separator that precedes it. */
    :global(nav[aria-label='Breadcrumb'] li:last-child) {
        display: none;
    }
    :global(nav[aria-label='Breadcrumb'] li:nth-last-child(2) > span[aria-hidden='true']) {
        display: none;
    }

    /* Match the article's mobile gutter (px-5 vs the breadcrumb's px-4). */
    @media (max-width: 767px) {
        :global(nav[aria-label='Breadcrumb']) {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
        }
    }

    .hero-wash {
        position: absolute;
        top: -20rem; /* start well above the viewport so no seam shows behind the nav */
        left: 50%;
        transform: translateX(-50%);
        width: 100vw;
        height: 1450px;
        z-index: -1;
        pointer-events: none;
        background:
            radial-gradient(ellipse 60% 45% at 12% 8%, rgba(255, 179, 198, 0.4) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 90% 18%, rgba(224, 172, 213, 0.32) 0%, transparent 70%),
            radial-gradient(ellipse 45% 35% at 55% 55%, rgba(255, 214, 224, 0.25) 0%, transparent 70%);
        mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 100%);
        -webkit-mask-image: linear-gradient(to bottom, black 0%, black 55%, transparent 100%);
    }

    @media (max-width: 768px) {
        .hero-wash {
            height: 1000px;
            background:
                radial-gradient(ellipse 60% 45% at 12% 8%, rgba(255, 179, 198, 0.22) 0%, transparent 70%),
                radial-gradient(ellipse 50% 40% at 90% 18%, rgba(224, 172, 213, 0.16) 0%, transparent 70%),
                radial-gradient(ellipse 45% 35% at 55% 55%, rgba(255, 214, 224, 0.12) 0%, transparent 70%);
        }
    }
</style>
