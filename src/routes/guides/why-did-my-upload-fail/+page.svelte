<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
    import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
    import StepList from '$lib/components/guide-demo/StepList.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

    // Rendered with the guide-demo component set (same as
    // jxl-vs-png-for-screenshots and bring-your-own-bucket-s3-r2). Content is
    // the content-ops handoff at article-originals/why-did-my-upload-fail.html,
    // preserved verbatim: every outbound citation kept, zero em dashes, and the
    // two external links carry target/rel per the publishing rules.

    const metadata = {
        title: "Why Did My Upload Fail? Every Mochify Error, Explained",
        seoTitle: "Why Did My Upload Fail - Every Mochify Error Explained",
        description: "Every upload and conversion error Mochify shows, what caused it, what we already did about it, and the one thing to try next. From the engineers who built it.",
        category: "Image Optimization",
        readTime: "17 min read",
        date: "September 17, 2026"
    };

    const toc = [
        { id: "cheat-sheet", label: "Cheat sheet: every message, its cause, and the fix" },
        { id: "incomplete-image", label: '"This image looks incomplete"' },
        { id: "network-error", label: '"Network error"' },
        { id: "nlp-unreachable", label: 'Magic Flow: "Load failed" or "Something went wrong on our end"' },
        { id: "unsupported-format", label: '"Unknown or unsupported image format"' },
        { id: "too-many-uploads", label: '"Too many concurrent uploads" or "Mochify is at capacity"' },
        { id: "file-too-large", label: '"Exceeds 20MB limit"' },
        { id: "batch-trimmed", label: '"Staging 3 of N files": why your batch was trimmed' },
        { id: "quota-exhausted", label: '"Rate limit reached"' },
        { id: "processing-failed", label: '"Processing Failed" or "All files failed to convert"' },
        { id: "session-expired", label: '"Upload session not found or already completed"' },
        { id: "mochify-workflow", label: "Mochify Workflow: getting a failed batch through" },
        { id: "still-stuck", label: "Still stuck? What to send us" },
        { id: "faq", label: "FAQ" }
    ];

    const workflowSteps = [
        {
            title: "Read the message before you do anything else.",
            html: `<p>It stays on screen until your next action, so find it in the <a href="#cheat-sheet">cheat sheet</a> and apply that fix first.</p>`
        },
        {
            title: "Take out anything that is not a photo.",
            html: `<p>Skip files that start with <code>._</code>, <code>.icloud</code> placeholders and anything dragged out of an app's library folder; export camera RAW to JPEG or HEIF in your camera software first.</p>`
        },
        {
            title: "Make sure every file is fully on your disk.",
            html: `<p>Open cloud-stored photos once, or copy them to your desktop, so the full original is what gets uploaded.</p>`
        },
        {
            title: "Re-add the files and describe the job in plain English.",
            html: `<p>Open <a href="/flow">Magic Flow</a>, add the files, and type what you want, for example <em>convert to JPG, max 2000px wide</em>. A language model reads the prompt and our C++ engine does the conversion. Batches are 3 files on Free and without an account, and 25 on Seller, Pro and the Day Pass.</p>`
        }
    ];

    const faqItems = [
        {
            q: "Why does Mochify say my image looks incomplete when it opens fine on my computer?",
            a: "Because the version we received was shorter than the one on your screen. Cloud storage (iCloud, OneDrive, Google Drive) can hand the browser a partial file while the original is still downloading. Open the photo once so the full file is on your disk, or copy it to the desktop, and retry. If it keeps happening on a file you know is good, tell us the file type; it may be a decoder gap on our side."
        },
        {
            q: "Does Mochify retry a failed upload automatically?",
            a: `Yes. Every upload gets up to three attempts on a dropped connection, within a few seconds. Files over 5MB are sent in pieces and resume from the last confirmed piece; if you go offline during one of those, we wait up to five minutes and continue. You only see "Network error" once all of that has been exhausted.`
        },
        {
            q: "What image formats can I upload to Mochify?",
            a: "PNG, JPEG/JPG, WebP, AVIF, HEIF/HEIC (including camera .HIF), JPEG XL, GIF and SVG. Our server identifies files by their content, not their extension. TIFF, BMP, PDF, camera RAW and PSD are not accepted as images; export a JPEG or PNG first."
        },
        {
            q: "What is the maximum file size I can upload?",
            a: "20MB per file on Free and without an account; 75MB per file on Seller, Pro and the Day Pass. The check happens in your browser before anything is sent, and an oversize file never counts against your allowance."
        },
        {
            q: "Why did Mochify only convert 3 of my files?",
            a: "Free and guest batches are 3 files at a time; paid plans and the Day Pass convert 25 at a time. The rest were set aside, not uploaded, and not counted. Convert them in the next batch, or take a Day Pass for 25 at a time."
        },
        {
            q: "How long can an upload sit before Mochify gives up on it?",
            a: `About twelve minutes of stall while a file is transferring, and two minutes for a Magic Flow prompt that has been submitted but not finished. Partial uploads live in memory only and are cleared on that timer; we restart once automatically before showing "Upload session not found."`
        },
        {
            q: `"Rate limit reached" - how long do I have to wait?`,
            a: "Waiting does not help; the message means this month's allowance is used up. It resets monthly, or you can take a $2 Day Pass (100 uploads in 24 hours) or move to a plan."
        }
    ];

    const related = [
        { title: "Photo File Too Large to Upload? Why Free Tools Reject Camera Files", href: "/guides/photo-file-too-large-to-upload", desc: "why 45-61MP camera files blow past upload limits, and what to do about it." },
        { title: "Should I Optimize My Images Before I Upload Them?", href: "/guides/should-i-optimize-images-before-upload", desc: "the case for making files web-ready before they hit a marketplace or a CMS." },
        { title: "Why Does eBay Say My Image File Is Not Supported?", href: "/guides/ebay-image-file-not-supported", desc: "the same wrong-file and wrong-format traps, from the marketplace's side." },
        { title: "How to Open HEIF Files on Windows (or Convert Them to JPG)", href: "/guides/open-heif-files-on-windows", desc: "for the Windows readers whose HEIC and HIF files will not open, let alone upload." }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>Why Did My Upload Fail - Every Mochify Error Explained</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/why-did-my-upload-fail" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Why Did My Upload Fail? Every Mochify Error, Explained",
        "description": "Every upload and conversion error Mochify shows, what caused it, what we already did about it, and the one thing to try next. From the engineers who built it.",
        "url": "https://mochify.app/guides/why-did-my-upload-fail",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/why-did-my-upload-fail"
        },
        "datePublished": "2026-09-17",
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
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app"},
                {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides"},
                {"@type": "ListItem", "position": 3, "name": "Why Did My Upload Fail? Every Mochify Error, Explained", "item": "https://mochify.app/guides/why-did-my-upload-fail"}
            ]
        },
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        }
        }
    </script>
</svelte:head>

<!-- Single max-w-3xl reading column: header, prose, and every card share the
     same container edges. -->
<article class="relative mx-auto w-full max-w-3xl px-5 sm:px-6 md:px-0 pt-6 md:pt-0 text-lg text-[#6C3F31] leading-relaxed">

    <div class="hero-wash" aria-hidden="true"></div>

    <header class="mb-12 md:mb-14">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#F06292] mb-3 mt-0">
            {metadata.category} · Guide
        </p>
        <h1 class="text-3xl md:text-[2.75rem] font-black text-[#4A2C2C] tracking-tight leading-[1.1] mb-0">
            Why Did My Upload Fail? Every Mochify Error, Explained
        </h1>
        <div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
        <p class="mt-5 text-sm font-bold text-[#875F42] mb-0">
            {metadata.readTime} · {metadata.date} · Mochify Engineering Team
        </p>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed mt-8 mb-0">
            If Mochify just showed you an error and sent you here, you are in the right place. This guide covers every message the web app can show when an upload or conversion fails: what it means, what we already did automatically before you saw it, and the one or two things worth trying next. We wrote it from the code and from a month of failure logs, so the advice is ordered by what actually fixes each problem, not by guesswork.
        </p>

        <GlassPanel label="Two facts up front">
            <p class="m-0">
                Across a month of logs, "Network error" and "This image looks incomplete" together account for roughly three in four failed conversions, and most of them are fixable in a minute. And the message you saw stays on screen until your next action, so you can read this, go back, and it will still be there.
            </p>
        </GlassPanel>
    </header>

    <div class="space-y-12">

        <section>
            <GuideTOC items={toc} />
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat sheet: every message, its cause, and the fix</SectionHeading>
            <p class="mb-4">Find your message in the left column. The right column is the thing to try first.</p>

            <GuideTable class="my-6">
                <table>
                    <thead>
                        <tr>
                            <th>Message you saw</th>
                            <th>What it means</th>
                            <th>Try this first</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>This image looks incomplete</td>
                            <td>The bytes that reached us were not a complete image</td>
                            <td>Open the photo once so it fully downloads, or copy it to your desktop, then retry</td>
                        </tr>
                        <tr>
                            <td>Network error</td>
                            <td>The connection dropped on every one of our three attempts</td>
                            <td>Retry; switch to Wi-Fi for large files; fewer files at once</td>
                        </tr>
                        <tr>
                            <td>Load failed / Something went wrong on our end (Magic Flow)</td>
                            <td>We could not reach the service that interprets your prompt</td>
                            <td>Submit the prompt again</td>
                        </tr>
                        <tr>
                            <td>Unknown or unsupported image format</td>
                            <td>The file is not an image, or is a format we do not accept</td>
                            <td>Check you picked the actual photo, not a sidecar or cache file; see the accepted list</td>
                        </tr>
                        <tr>
                            <td>N file(s) not supported. Accepted: ...</td>
                            <td>Same thing, caught before upload</td>
                            <td>Same</td>
                        </tr>
                        <tr>
                            <td>Too many concurrent uploads / Mochify is at capacity</td>
                            <td>A short-lived server-side cap</td>
                            <td>We already tried three times; wait ten seconds and press convert again</td>
                        </tr>
                        <tr>
                            <td>Exceeds 20MB limit</td>
                            <td>The file is over your tier's per-file limit</td>
                            <td>Day Pass ($2) or a plan for 75MB; nothing was uploaded</td>
                        </tr>
                        <tr>
                            <td>Staging 3 of N files</td>
                            <td>Free and guest batches are 3 files at a time</td>
                            <td>Convert these 3, then the next 3; or 25 at a time on any paid plan</td>
                        </tr>
                        <tr>
                            <td>Rate limit reached</td>
                            <td>This month's uploads are used up</td>
                            <td>Wait for the reset, take a Day Pass, or pick a plan</td>
                        </tr>
                        <tr>
                            <td>Processing Failed / All files failed to convert</td>
                            <td>Our side, not yours</td>
                            <td>Retry once; if it repeats, tell us</td>
                        </tr>
                        <tr>
                            <td>Upload session not found or already completed</td>
                            <td>The upload stalled long enough that we let it go</td>
                            <td>Start the upload again</td>
                        </tr>
                    </tbody>
                </table>
            </GuideTable>
        </section>

        <section id="incomplete-image" class="scroll-mt-24">
            <SectionHeading>"This image looks incomplete"</SectionHeading>
            <p class="mb-4">This message means the bytes that reached our server could not be read as a complete image: the file arrived, but it was shorter than a real photo, or its header was there and the picture data was not. The most common cause is a file that is still arriving on your machine, or has not fully downloaded from cloud storage, at the moment you added it.</p>
            <p class="mb-4">Modern cloud storage is designed to show you a file before it is really on your disk. iCloud's Optimize Mac Storage, OneDrive's Files On-Demand and Google Drive's streaming mode all keep a small placeholder locally and fetch the full-size original when something opens it. Most of the time the browser triggers that fetch and everything works. Sometimes it gets a partial file instead, and that partial file is what we receive. The same thing happens with a photo you have just AirDropped or copied from a phone or camera while the copy is still finishing.</p>
            <p class="mb-4">What to try, in order of how often it works:</p>
            <ol class="list-decimal pl-6 space-y-3 marker:text-[#F06292] marker:font-bold my-6">
                <li><strong>Open the photo once on your computer</strong> (Photos, Preview, the Windows Photos app, anything) so the full-resolution original downloads, then add it to Mochify again. On iCloud this is the whole fix. See Apple's note on <a href="https://support.apple.com/en-us/HT204264" target="_blank" rel="noopener noreferrer">downloading originals from iCloud Photos</a>.</li>
                <li><strong>On Windows with OneDrive, right-click the file and choose "Always keep on this device"</strong>, or copy it to your desktop first. Microsoft documents the placeholder behavior in its <a href="https://support.microsoft.com/en-us/office/save-disk-space-with-onedrive-files-on-demand-for-windows-0e6860d3-d9f3-4971-b321-7092438fb38e" target="_blank" rel="noopener noreferrer">Files On-Demand guide</a>.</li>
                <li><strong>If the file came from a phone or camera in the last minute, wait for the copy to finish</strong> and try again.</li>
                <li><strong>If none of that helps, try the file from a different location</strong>: a copy on the desktop, not the cloud folder.</li>
            </ol>
            <p class="mb-4">One honest caveat. This message covers every case where we could not read the picture, and that includes the rare case where the file is fine and our decoder is the problem. If this keeps happening on a photo you know opens everywhere else, <a href="/contact">tell us</a> and include the file type (HEIC, JPG, PNG...). That is the fastest route to a fix on our side, and we would rather hear about it than have you fight a file that is not broken.</p>
        </section>

        <section id="network-error" class="scroll-mt-24">
            <SectionHeading>"Network error"</SectionHeading>
            <p class="mb-4">"Network error" means your connection dropped on every one of our three automatic attempts to send the file. Six in ten of these come from Android phones, and the rest from Windows. It is almost never something on our end, and it is almost always fixed by a retry on a steadier connection.</p>
            <p class="mb-4">Here is what already happened before you saw the message. Every upload gets up to three attempts on a transport drop, with a short back-off between attempts (about a second, then about two), so the whole cycle finishes within a few seconds. For files over 5MB we do more than retry: the upload goes up in pieces, each piece is confirmed by the server before the next is sent, and a dropped connection costs at most the piece in flight. If you go offline partway through one of these larger uploads, we pause rather than fail, wait up to five minutes for the browser to come back, and then pick up where we stopped. Leave it stalled for much longer than about twelve minutes and the upload starts over from the beginning, once, automatically, before we show you anything.</p>
            <p class="mb-4">On files over 5MB you may have seen an amber "Unstable connection detected. Pausing and retrying..." strip while this was going on. On a small file in manual mode the retries are silent, which is why the message can seem to arrive out of nowhere.</p>
            <p class="mb-4">What to try:</p>
            <ol class="list-decimal pl-6 space-y-3 marker:text-[#F06292] marker:font-bold my-6">
                <li><strong>Press convert again.</strong> A momentary drop is the usual cause and the second run normally succeeds.</li>
                <li><strong>On a phone, switch to Wi-Fi for anything large.</strong> Mobile data with a weak signal is where most of these come from.</li>
                <li><strong>Upload fewer files at once.</strong> Manual conversion sends one file at a time, so a shorter batch shortens the window in which a drop can bite.</li>
                <li><strong>Keep the tab in the foreground on Android.</strong> Backgrounded tabs get throttled, and a throttled tab looks a lot like a dead connection.</li>
            </ol>
        </section>

        <section id="nlp-unreachable" class="scroll-mt-24">
            <SectionHeading>Magic Flow: "Load failed" or "Something went wrong on our end"</SectionHeading>
            <p class="mb-4">These two Magic Flow messages are not upload failures. "Load failed" (Safari's wording; other browsers say "Failed to fetch") means the browser could not reach the service that interprets your plain-English prompt. "Something went wrong on our end - please try again in a moment" means that service answered with an error. Either way, your files are untouched and the fix is to submit the prompt again.</p>
            <p class="mb-4">Retrying is the right move here for a different reason than the Network error above: the failure is between your browser and the prompt service, not in your files, and a prompt that failed once usually goes through on resubmit. If it fails twice, simplify the prompt: "convert to JPG, max 2000px wide" beats a paragraph. And if you see "Couldn't quite understand that - try again, or rephrase and resubmit," that is the model asking for a clearer instruction, not a connection problem.</p>
        </section>

        <section id="unsupported-format" class="scroll-mt-24">
            <SectionHeading>"Unknown or unsupported image format" (and "N file(s) not supported")</SectionHeading>
            <p class="mb-4">This one almost always means the file you added is not actually a photo. In a month of logs, most of the rejected files were things that live next to photos and look like them: macOS sidecar files, iCloud placeholder stubs, and what look like cache files dragged out of an application's library folder. The one genuine format gap that matters is camera RAW.</p>
            <p class="mb-4">You may see either of two messages, depending on where the file got caught. "N file(s) not supported. Accepted: ..." is the browser check, which looks at the file's name and type and stops the upload before it starts. "Invalid Format: Unknown or unsupported image format" is the server check, which reads the first bytes of the file and identifies it by content, not by name. A non-image renamed to <code>.jpg</code> sails through the first and is refused by the second.</p>
            <p class="mb-4"><strong>What we accept:</strong> PNG, JPEG/JPG, WebP, AVIF, HEIF/HEIC (including camera <code>.HIF</code>), JPEG XL, GIF (the first frame) and SVG. Animated WebP, AVIF and PNG are accepted as input; the output is a still. Our server identifies files by content on every surface, so renaming a file does not make it acceptable.</p>
            <p class="mb-4"><strong>What we refuse, with a specific message:</strong> TIFF and BMP ("TIFF images aren't supported yet - export as PNG or JPEG and try again", and the same for BMP) and PDF, which has its own tools rather than the image path.</p>
            <p class="mb-4"><strong>What falls into the generic message:</strong> camera RAW (<code>.CR3</code>, <code>.ARW</code>, <code>.RAF</code>, <code>.NEF</code>) and Photoshop <code>.PSD</code>. RAW is a real gap, not a mistake on your part: export a JPEG or HEIF from your camera software first.</p>
            <p class="mb-4">The three traps to check before anything else:</p>
            <ol class="list-decimal pl-6 space-y-3 marker:text-[#F06292] marker:font-bold my-6">
                <li><strong>Files that start with <code>._</code>.</strong> If you unzipped a folder that was created on a Mac, Windows shows a shadow file next to every photo: <code>._DSC1234.JPG</code> beside <code>DSC1234.JPG</code>. They are metadata sidecars, not images, and "select all" picks them up. Skip anything with the <code>._</code> prefix.</li>
                <li><strong>Anything dragged out of an app's library or cache folder.</strong> Photo managers keep derivative files that carry image names and are not images. Export from the app instead of dragging from its folder.</li>
                <li><strong>iCloud Drive stubs.</strong> A file called <code>photo.jpg.icloud</code> is a placeholder. Open the real file once so it downloads, then add that.</li>
            </ol>
            <p class="mb-4">If your file is a <code>.HEIC</code> from an iPhone and you only want a JPG, the <a href="/heic-to-jpeg">HEIC to JPG converter</a> is the direct route. If it is a <code>.HIF</code> from a Canon, Sony or Fujifilm body, that is a different lane: use the <a href="/solutions/hif-to-jpg">HIF to JPG tool</a>. For a mixed folder of <code>.heif</code>, <code>.heic</code> and <code>.hif</code>, the <a href="/solutions/heif-to-jpg">HEIF to JPG converter</a> takes all three in one batch.</p>
        </section>

        <section id="too-many-uploads" class="scroll-mt-24">
            <SectionHeading>"Too many concurrent uploads" or "Mochify is at capacity"</SectionHeading>
            <p class="mb-4">Both messages are short-lived server-side limits, and by the time you read either one we have already made three attempts within a few seconds. "Too many concurrent uploads. Please retry shortly." is a per-user cap on simultaneous upload sessions that a normal batch will not reach. "Mochify is at capacity. Please retry in 1s." means the processing queue was briefly full.</p>
            <p class="mb-4">The fix is the same for both: wait about ten seconds and press convert again. If you are driving Mochify from a script or several tabs at once, stagger the runs. A 25-file batch on a paid plan does not trip the cap, because manual conversion uploads one file at a time and Magic Flow stages at most six.</p>
        </section>

        <section id="file-too-large" class="scroll-mt-24">
            <SectionHeading>"Exceeds 20MB limit": the file is over your per-file limit</SectionHeading>
            <p class="mb-4">The per-file limit is 20MB on Free (and without an account) and 75MB on Seller, Pro and the Day Pass. The check runs in your browser before anything is sent, so an oversize file gets its own red card, never joins the upload, and never counts against anything.</p>
            <p class="mb-4">The limit is per file, not per batch. If one photo is over and the rest are fine, the rest convert normally.</p>
            <p class="mb-4">For a one-off batch of large files, the Day Pass is the cheapest route: $2, 100 uploads within 24 hours, files up to 75MB, no account or subscription, and it sits on top of whatever monthly allowance you already have. For regular work with 45-61MP camera files, <a href="/pricing">Seller or Pro</a> is the fit. We covered why camera files run this big, and what to do about it, in our guide to <a href="/guides/photo-file-too-large-to-upload">photos that are too large to upload</a>.</p>
        </section>

        <section id="batch-trimmed" class="scroll-mt-24">
            <SectionHeading>"Staging 3 of N files": why your batch was trimmed</SectionHeading>
            <p class="mb-4">This banner is not an error. Free accounts and visitors without an account convert 3 files per batch; any paid plan (Seller, Pro or a Day Pass) converts 25 per batch. When you add more than your batch size, we stage 3 and set the rest aside. Nothing happens to the files we set aside: they are not uploaded and they do not count against your allowance.</p>
            <p class="mb-4">Two things people get wrong here. Signing up for a free account raises your monthly allowance from 3 to 25, but it does not raise the batch size: Free and guest batches are both 3. And the trimmed files are not lost; the banner says "convert these 3 now and drop the rest in a second batch," which is exactly what it sounds like.</p>
            <p class="mb-4">If you regularly have more than three files, a Day Pass ($2) gets you 25 at a time for 24 hours, and the <a href="/pricing">pricing page</a> has the monthly plans.</p>
        </section>

        <section id="quota-exhausted" class="scroll-mt-24">
            <SectionHeading>"Rate limit reached": you have used this month's uploads</SectionHeading>
            <p class="mb-4">Despite the wording, this is not a rate limit and waiting a minute will not help. It means the monthly allowance on your account (or the 3 free conversions per month for visitors without an account) ran out partway through a batch. The files that converted before the limit are already downloaded; the message tells you how many remain.</p>
            <p class="mb-4">Your options are your monthly reset, a Day Pass ($2 for 100 uploads within 24 hours, which sits on top of your monthly allowance rather than replacing it), or a plan: 25 a month on Free, 300 on Seller, 1,200 on Pro. If you are converting without an account, signing up for a free account takes you from 3 a month to 25.</p>

            <GlassInfoBox type="note" title="We know the wording is wrong">
                <p class="m-0">We know "Rate limit reached" is the wrong phrase for this and it is on the list to change.</p>
            </GlassInfoBox>
        </section>

        <section id="processing-failed" class="scroll-mt-24">
            <SectionHeading>"Processing Failed" or "All files failed to convert"</SectionHeading>
            <p class="mb-4">These are ours, not yours. "Processing Failed" means the file uploaded fine and our decoder could not process it, either because of a fault in the conversion engine or a missing codec on the server. "All files failed to convert" is a fallback that should not be reachable at all, and the handful of times it appears we treat as a bug report.</p>
            <p class="mb-4">Retry once. A deterministic decode failure will fail the same way twice, so if the retry fails, do not keep going: <a href="/contact">tell us</a> with the file type and roughly when it happened, and we will look at the server log for that request. This is the one category where the log almost always tells us exactly what went wrong.</p>
        </section>

        <section id="session-expired" class="scroll-mt-24">
            <SectionHeading>"Upload session not found or already completed"</SectionHeading>
            <p class="mb-4">This message means an upload stalled long enough that we released it. Half-uploaded files live only in server memory, never on disk, and we clear that memory on a timer: if an upload stalls for more than about twelve minutes we let it go and you will need to start it again. On Magic Flow, if you leave a submitted prompt sitting for more than two minutes before it finishes, the same thing happens.</p>
            <p class="mb-4">Before you saw this message we already tried once to restart the upload from the beginning automatically. If you are seeing it, that restart did not complete either, which usually means the connection is the real problem: see the <a href="#network-error">Network error</a> advice above. The same message also appears if the same upload is completed twice (a double-click on convert, say); in that case the first one succeeded, and a duplicate cannot be charged twice.</p>
        </section>

        <section id="mochify-workflow" class="scroll-mt-24">
            <SectionHeading>Mochify Workflow: getting a failed batch through</SectionHeading>
            <p class="mb-4">If a batch failed, the quickest way back is to clear out the files that can never work, make sure the rest are fully on your disk, and describe the job once in Magic Flow.</p>

            <GlassPanel>
                <StepList steps={workflowSteps} />
            </GlassPanel>

            <GlassInfoBox type="note" title="Privacy note">
                <p class="m-0">Your images travel to <code>api.mochify.app</code> over HTTPS for encoding, are processed in memory and wiped immediately, with no disk writes and no logs containing file data. A half-finished upload lives only in server memory and is cleared when it stalls.</p>
            </GlassInfoBox>
        </section>

        <section id="still-stuck" class="scroll-mt-24">
            <SectionHeading>Still stuck? What to send us</SectionHeading>
            <p class="mb-4">If you have tried the fix for your message and it still fails, <a href="/contact">contact us</a> and include: your browser and operating system, the file type and rough size, the exact message you saw, and roughly when it happened. That is enough for us to find the request in our logs. You do not need to send the photo itself, and for the "incomplete" and "processing failed" cases we would rather see the log than the file.</p>
        </section>

        <GlassFAQs items={faqItems} />

        <GlassCTA
            heading="Ready to try again?"
            href="/flow"
            label="Open Magic Flow →"
            secondaryHref="#cheat-sheet"
            secondaryLabel="Back to the cheat sheet"
        >
            Head back to Magic Flow, add your files, and describe what you want in plain English: <em>convert to JPG, max 2000px wide</em>.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>

<style>
    /* The breadcrumb renders in the shared guides layout at max-w-4xl; align
       it with this page's 3xl reading column. */
    :global(nav[aria-label='Breadcrumb']) {
        max-width: 48rem;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 1.25rem;
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
        top: -20rem;
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
