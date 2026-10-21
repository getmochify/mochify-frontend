<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        title: "What Automatic Image Optimization Actually Does (and When to Take Control)",
        description: "Platforms optimize images automatically, but everyone gets the same defaults. What the automatic layer does, where it stops, and how to take control.",
        category: "Image Optimization",
        readTime: "13 min read",
        date: "August 25, 2026",
        lastUpdated: "October 16, 2026"
    };

    const toc = [
        { id: "the-short-answer", num: "01", label: "The short answer" },
        { id: "the-automatic-layer", num: "02", label: "The automatic layer: what each platform does to your images" },
        { id: "where-the-defaults-stop", num: "03", label: "Where the defaults stop: the ceiling built into automatic optimization" },
        { id: "what-no-pipeline-will-do", num: "04", label: "What no platform pipeline will do for you" },
        { id: "taking-control", num: "05", label: "Taking control: the pre-upload pipeline" },
        { id: "mochify-workflow", num: "06", label: "Mochify Workflow: automating your own pipeline" },
        { id: "cheat-sheet", num: "07", label: "Cheat Sheet: platform defaults at a glance" },
        { id: "faq", num: "08", label: "FAQ" }
    ];

    const faqItems = [
        {
            q: "What is automatic image optimization?",
            a: "Automatic image optimization is processing a platform applies to images without user input: compressing, resizing, and re-formatting uploads or deliveries to fixed defaults. WordPress 7.1 does it in the browser at upload, Shopify and image CDNs do it at delivery, and social platforms and marketplaces re-encode on ingest. It protects page speed but applies the same settings to every user's images."
        },
        {
            q: "Does WordPress compress images automatically?",
            a: "Yes. Since WordPress 7.1 (August 2026), core compresses and resizes images in the browser during upload, generating thumbnails and converting HEIC to JPEG, at a fixed JPEG quality of 82 with no admin setting to change it. The full-size original you upload is kept untouched, metadata included, and the browser pipeline currently runs in Chrome and Edge 137+ with a silent server-side fallback elsewhere."
        },
        {
            q: "Does Shopify compress product images?",
            a: "Yes, at delivery. Shopify's CDN automatically serves your images in the best format each visitor's browser supports, including WebP and AVIF, generates multiple display sizes, and compresses what it serves. Your uploaded original is not modified, so the quality ceiling of everything Shopify serves is set by the file you give it."
        },
        {
            q: "Does Instagram reduce photo quality?",
            a: "Instagram uploads photos at up to 1080x1080 pixels per its help center and re-encodes them to its own compression target, so detail above that resolution is discarded. Exporting at Instagram's exact display size before posting, rather than uploading a full-resolution file, leaves its re-encode the least room to degrade your image."
        },
        {
            q: "Why do my photos look worse after uploading?",
            a: "Because the platform re-processed them: resized past their sharpness, re-encoded at a lower quality than your export, or shifted colors in a pipeline you cannot see or configure. Seller forums are full of the symptoms, from dulled contrast to white backgrounds turning gray. The reliable fix is pre-processing: upload a file already at the platform's display size and under its caps, so the automatic layer has as little to do as possible."
        },
        {
            q: "Should I still optimize images if my platform does it automatically?",
            a: "Yes, but for different reasons than before. Let the platform handle delivery mechanics; do the work it cannot do: framing, backgrounds, format choice for your masters, metadata decisions, and consistent sizing across every channel. Platform optimization sets the same floor for everyone; pre-upload optimization is what puts your images above it."
        },
        {
            q: "Can I automate image optimization without learning new software?",
            a: "Yes. Natural-language tools take a written instruction like \"resize to 1600px, convert to WebP, strip location data\" and apply it to a whole batch, and the same prompt works in Mochify's web app, CLI, and MCP server surfaces, so an AI agent can run your pipeline as part of a bigger workflow. The instruction is the pipeline, which makes your standard repeatable instead of aspirational."
        }
    ];

    const related = [
        { title: "Can WordPress 7.1 Optimize Images Without a Plugin?", href: "/guides/can-wordpress-7-1-optimize-images-without-a-plugin", desc: "The release that moved the automatic layer into the browser, and its limits." },
        { title: "Should I Optimize My Images Before I Upload Them?", href: "/guides/should-i-optimize-images-before-upload", desc: "The yes/no decision this guide's argument rests on." },
        { title: "Ecommerce Product Photo Workflow: Resize & Convert in One Prompt", href: "/guides/ecommerce-product-photo-workflow-resize-convert", desc: "The concrete store-batch pipeline, end to end." },
        { title: "AI Image Compression and Conversion: Describe the Result, Skip the Settings", href: "/guides/ai-image-compression-conversion", desc: "How Magic Flow turns instructions into pipelines." },
        { title: "JPEG Compression in 2026: Why Jpegli Changes the Quality-Per-Byte Game", href: "/guides/jpeg-in-2026-jpegli", desc: "The encoder advantage your pipeline gets and platform defaults don't." }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>Automatic Image Optimization - What It Does & Its Limits</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/what-automatic-image-optimization-actually-does" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "What Automatic Image Optimization Actually Does (and When to Take Control)",
        "description": "Platforms optimize images automatically, but everyone gets the same defaults. What the automatic layer does, where it stops, and how to take control.",
        "url": "https://mochify.app/guides/what-automatic-image-optimization-actually-does",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/what-automatic-image-optimization-actually-does"
        },
        "image": "https://mochify.app/og/guides-what-automatic-image-optimization-actually-does.png",
        "datePublished": "2026-08-25T12:00:00+00:00",
        "dateModified": "2026-10-16T12:00:00+00:00",
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
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        },
        "about": [
            { "@type": "Thing", "name": "Automatic image optimization" },
            { "@type": "Thing", "name": "WordPress 7.1" },
            { "@type": "Thing", "name": "Shopify CDN optimization" },
            { "@type": "Thing", "name": "Instagram image compression" },
            { "@type": "Thing", "name": "Pre-upload image pipeline" }
        ],
        "keywords": "automatic image optimization, does wordpress compress images, does shopify compress images, does instagram compress photos, image optimization workflow, pre-upload image pipeline",
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".article-intro", "h1"]
        }
        }
    </script>


    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is automatic image optimization?",
                "acceptedAnswer": { "@type": "Answer", "text": "Automatic image optimization is processing a platform applies to images without user input: compressing, resizing, and re-formatting uploads or deliveries to fixed defaults. WordPress 7.1 does it in the browser at upload, Shopify and image CDNs do it at delivery, and social platforms and marketplaces re-encode on ingest. It protects page speed but applies the same settings to every user's images." }
            },
            {
                "@type": "Question",
                "name": "Does WordPress compress images automatically?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. Since WordPress 7.1 (August 2026), core compresses and resizes images in the browser during upload, generating thumbnails and converting HEIC to JPEG, at a fixed JPEG quality of 82 with no admin setting to change it. The full-size original you upload is kept untouched, metadata included, and the browser pipeline currently runs in Chrome and Edge 137+ with a silent server-side fallback elsewhere." }
            },
            {
                "@type": "Question",
                "name": "Does Shopify compress product images?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes, at delivery. Shopify's CDN automatically serves your images in the best format each visitor's browser supports, including WebP and AVIF, generates multiple display sizes, and compresses what it serves. Your uploaded original is not modified, so the quality ceiling of everything Shopify serves is set by the file you give it." }
            },
            {
                "@type": "Question",
                "name": "Does Instagram reduce photo quality?",
                "acceptedAnswer": { "@type": "Answer", "text": "Instagram uploads photos at up to 1080x1080 pixels per its help center and re-encodes them to its own compression target, so detail above that resolution is discarded. Exporting at Instagram's exact display size before posting, rather than uploading a full-resolution file, leaves its re-encode the least room to degrade your image." }
            },
            {
                "@type": "Question",
                "name": "Why do my photos look worse after uploading?",
                "acceptedAnswer": { "@type": "Answer", "text": "Because the platform re-processed them: resized past their sharpness, re-encoded at a lower quality than your export, or shifted colors in a pipeline you cannot see or configure. The reliable fix is pre-processing: upload a file already at the platform's display size and under its caps, so the automatic layer has as little to do as possible." }
            },
            {
                "@type": "Question",
                "name": "Should I still optimize images if my platform does it automatically?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes, but for different reasons than before. Let the platform handle delivery mechanics; do the work it cannot do: framing, backgrounds, format choice for your masters, metadata decisions, and consistent sizing across every channel. Platform optimization sets the same floor for everyone; pre-upload optimization is what puts your images above it." }
            },
            {
                "@type": "Question",
                "name": "Can I automate image optimization without learning new software?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. Natural-language tools take a written instruction like 'resize to 1600px, convert to WebP, strip location data' and apply it to a whole batch, and the same prompt works in Mochify's web app, CLI, and MCP server surfaces, so an AI agent can run your pipeline as part of a bigger workflow. The instruction is the pipeline, which makes your standard repeatable instead of aspirational." }
            }
        ]
        }
    </script>
    <GuideSchema
        name={metadata.title}
        url="https://mochify.app/guides/what-automatic-image-optimization-actually-does"
        description={metadata.description}
        datePublished="2026-08-25"
        dateModified="2026-10-16"
    />
</svelte:head>

<article
	class="relative mx-auto w-full max-w-3xl px-5 pt-6 text-lg leading-relaxed text-[#6C3F31] sm:px-6 md:px-0 md:pt-0"
>
	<div class="hero-wash" aria-hidden="true"></div>

    <header class="mb-12 md:mb-14">
		<p class="mt-0 mb-3 text-xs font-bold tracking-[0.18em] text-[#F06292] uppercase">
			{metadata.category}
		</p>
		<h1
			class="mb-0 text-3xl leading-[1.1] font-black tracking-tight text-[#4A2C2C] md:text-[2.75rem]"
		>
			<AccentTitle title={metadata.title} accent="Automatic Image Optimization" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated}
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            Automatic image optimization is now built into almost everything you publish through. WordPress 7.1 compresses and resizes uploads in your browser, Shopify's CDN re-formats product photos per visitor, Instagram re-encodes whatever you post, and marketplaces run your listing photos through pipelines you never see. That layer is real progress, and you should let it work. But here is the part the release notes skip: automatic optimization applies the platform's defaults, not your decisions, and the defaults are identical for everyone. The same quality setting, the same size caps, the same crop-nothing, judge-nothing processing that every one of your competitors gets. This guide walks through what the automatic layer actually does on each major platform, where its ceiling sits, and how taking control of your images before upload is what makes them faster, cleaner, and visibly better than the baseline everyone else settles for.
        </p>

        <div class="mt-8 rounded-2xl border border-pink-100 bg-[#FFF5F7]/70 p-6">
            <p class="m-0 text-base leading-relaxed text-[#6C3F31]">
                <strong class="text-[#4A2C2C]">Published August 25, 2026 by the Mochify Engineering Team.</strong>
                Written for the moment automatic optimization feels like it's already handled: what each platform's default actually does, where it stops, and the pre-upload pipeline that closes the gap.
            </p>
        </div>
    </header>

    <div class="space-y-12">

        <section>
            <GuideTOC items={toc} heading="What's in this guide" />
        </section>

        <!-- 01 -->
        <section id="the-short-answer" class="scroll-mt-24">
            <SectionHeading>The short answer</SectionHeading>
            <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
                <p class="text-[#6C3F31] leading-relaxed m-0">
                    Automatic image optimization handles delivery well and originals not at all: platforms compress, resize, and re-format what they serve, using one fixed set of defaults for every user, with no control surface for you and no view into what happened. That is a floor, not a ceiling. It will keep an unoptimized upload from wrecking your page speed, but it cannot make your images better than anyone else's, because everyone else's images go through the exact same pipe. The work that differentiates - your framing, your backgrounds, your format strategy, your metadata decisions, your consistency across every channel - only exists if you do it before upload, and in 2026 that work can be described in a sentence and automated.
                </p>
            </div>
        </section>

        <!-- 02 -->
        <section id="the-automatic-layer" class="scroll-mt-24">
            <SectionHeading>The automatic layer: what each platform does to your images</SectionHeading>
            <p class="mb-4">Most platforms now optimize images without asking, either at upload time or at delivery time, and the coverage is better than it has ever been. The current state on the platforms we get asked about most:</p>
            <p class="mb-4"><strong>WordPress, which powers 40.7% of all websites, just made the biggest move.</strong> WordPress 7.1 (released August 19, 2026) processes images in your browser at upload: compression, resizing, and thumbnail generation through a WebAssembly build of the libvips library, producing JPEGs around 15% smaller than the old server pipeline, according to the <a href="https://make.wordpress.org/core/2026/07/22/client-side-media-processing-in-wordpress-7-1/" target="_blank" rel="noopener noreferrer">official dev notes</a>. It converts iPhone HEIC photos to JPEG on upload and decodes AVIF natively. We covered <a href="/guides/can-wordpress-7-1-optimize-images-without-a-plugin">what 7.1 handles and what it leaves out</a> in detail when it shipped.</p>
            <p class="mb-4"><strong>Shopify optimizes at the CDN.</strong> Product images are re-encoded for each visitor: <a href="https://help.shopify.com/en/manual/online-store/images/theme-images" target="_blank" rel="noopener noreferrer">Shopify's documentation</a> states that when a browser supports WebP or AVIF, images are delivered in those formats, multiple display sizes are generated automatically, and GIFs are converted to animated WebP. Shopify goes as far as telling merchants that "images don't need to be manually compressed prior to uploading." For pure delivery speed, that is true. Hold that thought.</p>
            <p class="mb-4"><strong>Instagram caps and re-encodes.</strong> <a href="https://help.instagram.com/1631821640426723" target="_blank" rel="noopener noreferrer">Instagram's help center</a> states photos are uploaded at "the best quality resolution possible (up to 1080x1080 pixels)". Whatever detail lives above that ceiling is discarded, and the file is re-encoded to Instagram's own compression target on the way in.</p>
            <p class="mb-4"><strong>Marketplaces process invisibly.</strong> eBay, Vinted, Etsy and the rest resize and re-encode listing photos against their own caps and display sizes. None of them publishes what that processing does, and seller forums show the result of the gap: threads describing photos "being dulled" on upload, white backgrounds turning gray, and settings changes that do not help, often with no answer at all. Our <a href="/guides/product-image-requirements-marketplace-guide">marketplace image requirements guide</a> tracks the published caps; what happens inside the pipeline is not documented anywhere.</p>
            <p class="mb-4">Add the CDN-level optimizers many sites layer on top, and the picture is clear: in 2026, an image you publish is almost certainly optimized by someone. The question has moved. It is no longer "will my image be compressed?" It is "who decides how, and is the default good enough for what I am trying to do?"</p>
        </section>

        <!-- 03 -->
        <section id="where-the-defaults-stop" class="scroll-mt-24">
            <SectionHeading>Where the defaults stop: the ceiling built into automatic optimization</SectionHeading>
            <p class="mb-4">Automatic optimization has a hard ceiling, and it is built in on purpose: platforms optimize for their average upload with one fixed configuration, because at their scale nothing else is operable. Four consequences follow.</p>
            <p class="mb-4"><strong>One setting for everyone.</strong> WordPress 7.1 encodes JPEGs at quality 82, the same default the platform has used since 2016, for every image on every site. There is no admin control for it, no per-image choice of quality or format; changing it means a developer writing code-level filters. Your hero product shot and a throwaway blog thumbnail get identical treatment, and so does every other site on the platform. What the hero needs instead (its own dimensions, a phone crop, and a file weight chosen by eye rather than by a global quality setting) is the subject of our guide to <a href="/guides/optimizing-hero-images">hero image size, file size and LCP</a>.</p>
            <p class="mb-4"><strong>Delivery only, originals untouched.</strong> The automatic layer works on copies it serves, not the files you gave it. WordPress keeps your full-size original as uploaded, which also means the EXIF metadata in it, including GPS coordinates if your camera wrote them, stays on the server. Shopify serves optimized renditions from the CDN while your upload sits in the library as-is. Automatic optimization never cleans, never re-masters, and never fixes the source. It also keeps the format you uploaded: a JPEG stays a JPEG in every copy unless a plugin or a code filter converts it, which is why PageSpeed's "Improve image delivery" row survives the 7.1 upgrade; <a href="/guides/next-gen-image-formats-wordpress">fixing that warning in WordPress without a plugin</a> is the companion guide.</p>
            <p class="mb-4"><strong>Invisible and inconsistent.</strong> You do not get a report of what was done. WordPress 7.1's browser pipeline runs in Chrome and Edge 137+ only and silently falls back to the old server path everywhere else, so two colleagues uploading the same photo can get different results and never know. Shopify's format switching depends on each visitor's browser. When something does go wrong, you end up where the seller forums are: "my images keep losing quality after I upload," with no way to see which step did it.</p>
            <p class="mb-4"><strong>No judgment.</strong> The pipeline does not know that the gray tinge on your white background is costing you clicks, that your product should be cropped tighter, that this batch is going to three platforms with three different requirements, or that a JPEG is the wrong master format for your line art. It optimizes bytes. It has no opinion about your images, and opinions are what make images stand out.</p>
            <p class="mb-4">None of this is an argument against the automatic layer. It is an argument for knowing exactly where it stops, and the platforms' own documentation, read closely, draws the line for you: <a href="/guides/should-i-optimize-images-before-upload">our companion piece on whether to optimize before upload</a> goes deeper on that split.</p>
        </section>

        <!-- 04 -->
        <section id="what-no-pipeline-will-do" class="scroll-mt-24">
            <SectionHeading>What no platform pipeline will do for you</SectionHeading>
            <p class="mb-4">Everything a platform's automatic optimization skips is, by definition, a place your images can be better than everyone else's. The list is consistent across platforms:</p>
            <ul class="list-disc pl-6 space-y-3 marker:text-[#F06292] my-6">
                <li><strong>Framing and cropping.</strong> No pipeline decides what the subject is or crops to flatter it. Consistent, well-framed images across a store or feed are a human (or AI-assisted) decision made before upload.</li>
                <li><strong>Backgrounds.</strong> A clean or removed background is the single most visible difference between amateur and professional product images, and no platform does it for you.</li>
                <li><strong>Format strategy for your masters.</strong> Platforms re-format deliveries; they do not tell you what to keep. Whether your archive should be JPEG, or 10-bit AVIF, or JPEG XL is your call, and it determines what quality you can serve everywhere else forever.</li>
                <li><strong>Metadata decisions.</strong> Strip the GPS trail, keep the copyright, or ship everything: that choice should be deliberate, and platform defaults range from "strips some copies" to "keeps it all" without asking.</li>
                <li><strong>Cross-platform consistency.</strong> Your site, your marketplace listings, and your social posts each run different pipelines with different caps. Only a pre-upload workflow gives the same photo the same treatment everywhere.</li>
                <li><strong>Quality where it counts.</strong> A fixed sitewide quality of 82 is sensible on average and wrong at the extremes, in both directions. Deciding where quality matters is editorial work no default can do.</li>
            </ul>
            <p class="mb-4">Every item on that list is workflow, not wizardry. Which is the point: the gap between "optimized by default" and "actually good" is closed by a repeatable process, and repeatable processes can be automated.</p>
        </section>

        <!-- 05 -->
        <section id="taking-control" class="scroll-mt-24">
            <SectionHeading>Taking control: the pre-upload pipeline</SectionHeading>
            <p class="mb-4">Taking control means owning one step: between your master file and every destination sits a pipeline you define, so that what each platform receives is already sized, formatted, framed, and cleaned to your standard, and the automatic layer downstream has nothing left to break. Four principles make it work:</p>
            <ol class="list-decimal pl-6 space-y-3 marker:text-[#F06292] marker:font-black my-6">
                <li><strong>Keep masters, ship copies.</strong> Archive the full-resolution original; generate per-destination copies at each platform's display size. Resolution nobody displays is bytes nobody needs: <a href="/guides/photo-file-too-large-to-upload">we measured a 40MB camera JPEG landing at 1-2MB</a> once resized to display resolution and re-encoded, with nothing visible lost.</li>
                <li><strong>Use better encoders than the defaults.</strong> The encoder is where quality-per-byte lives. Google's jpegli, the encoder Mochify uses for JPEG output, delivers a <a href="https://opensource.googleblog.com/2024/04/introducing-jpegli-new-jpeg-coding-library.html" target="_blank" rel="noopener noreferrer">35% compression improvement at high quality settings</a> over legacy JPEG encoding, in a file every browser and marketplace already accepts. Platform pipelines meet a compatibility budget; your pipeline can simply be better.</li>
                <li><strong>Make the invisible visible.</strong> Decide metadata explicitly, per destination. Check results yourself instead of trusting the pipe: our <a href="/comparison">before/after comparison tool</a> exists because "looks fine at a glance" is how gray whites ship.</li>
                <li><strong>Automate it or you will stop doing it.</strong> A standard you apply by hand on busy days is not a standard. The pipeline has to be one action, or zero. Our guide to <a href="/guides/convert-website-images-to-webp-and-avif">converting a website's images to WebP and AVIF and keeping them converted</a> is that pipeline written down: one command for the library you have, and a twelve-line script for everything that arrives after.</li>
            </ol>
            <p class="mb-4">That last principle is where AI earns its place in an image workflow, and it is the difference between 2026 tooling and the settings-panel era: you describe the outcome once, in plain language, and the same instruction runs on every batch, every day, identically.</p>
            <p class="mb-4"><strong>See what your current images could look like: <a href="/">run a free comparison at mochify.app</a>.</strong></p>
        </section>

        <!-- 06 -->
        <section id="mochify-workflow" class="scroll-mt-24">
            <SectionHeading>Mochify Workflow: automating your own pipeline</SectionHeading>
            <p class="mb-4">This is the workflow we built Mochify around: one plain-English instruction, applied consistently, on every surface you work from. Magic Flow parses your prompt with a language model, then our C++ engine executes it.</p>

            <div class="bg-gradient-to-b from-[#FFF5F7] to-[#FDFBF7] rounded-3xl border border-pink-100 p-6 md:p-8 my-6">
                <ol class="space-y-8">
                    <li class="flex gap-4 items-start">
                        <span class="w-10 h-10 rounded-full bg-[#F06292] flex items-center justify-center text-white font-black text-base flex-shrink-0">1</span>
                        <div>
                            <p class="font-black text-[#4A2C2C] mb-2">Start from your masters, not from platform re-downloads</p>
                            <p class="m-0">Free accounts process 25 images a month (3 a month with no signup, 20MB per file); Seller and Pro raise the limits to 75MB files and 25-file batches.</p>
                        </div>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-10 h-10 rounded-full bg-[#F06292] flex items-center justify-center text-white font-black text-base flex-shrink-0">2</span>
                        <div>
                            <p class="font-black text-[#4A2C2C] mb-2">Describe the whole job in one prompt</p>
                            <p class="m-0">For a store batch: "resize to 2000px on the long edge, convert to WebP, keep each under 500KB, and strip location data." For listings: "remove the background and crop square." One sentence replaces a settings panel, and the same sentence produces the same result next week.</p>
                        </div>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-10 h-10 rounded-full bg-[#F06292] flex items-center justify-center text-white font-black text-base flex-shrink-0">3</span>
                        <div>
                            <p class="font-black text-[#4A2C2C] mb-2">Let the operations you would never do by hand run in the same pass</p>
                            <p class="m-0">Background removal is available on every tier, including Free, and smart cropping picks the subject with AI saliency: the <a href="/solutions/bulk-ai-square-cropper">Bulk Square Cropper</a> is the batch version for marketplace grids, and <a href="/solutions/remove-background-webp">background removal to transparent WebP</a> covers the clean-background look on product shots.</p>
                        </div>
                    </li>
                    <li class="flex gap-4 items-start">
                        <span class="w-10 h-10 rounded-full bg-[#F06292] flex items-center justify-center text-white font-black text-base flex-shrink-0">4</span>
                        <div>
                            <p class="font-black text-[#4A2C2C] mb-2">Scale it into your tools when you outgrow the browser</p>
                            <p class="m-0">The same engine is scriptable: the <code>mochify</code> CLI takes the identical plain-English prompt with the <code>-p</code> flag, and the local MCP server (<code>mochify serve</code>) lets AI agents run your image pipeline for you inside tools like Claude Code, returning file paths rather than dumping image bytes into the agent's context. Our guide to <a href="/guides/image-compression-claude-code-cli-mcp">image compression inside Claude Code</a> shows the full setup. Images and PDFs are what the CLI, MCP, and API surfaces automate; video processing lives in the web app, where it runs in your browser.</p>
                        </div>
                    </li>
                </ol>
            </div>

            <GlassInfoBox type="note" title="Keep the privacy you started with">
                Your images travel to <code>api.mochify.app</code> over HTTPS, are processed in RAM, and are wiped immediately after encoding: no disk writes, no logs containing file data, zero retention. Taking control of your pipeline should not mean handing your originals to a service that keeps them.
            </GlassInfoBox>

            <p class="mb-4"><strong>Build your pipeline once and stop re-doing it: <a href="/">start free at mochify.app</a> - no signup for your first files.</strong></p>
        </section>

        <!-- 07 -->
        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat Sheet: platform defaults at a glance</SectionHeading>

            <GuideTable class="my-6">
                <table>
                    <thead>
                        <tr>
                            <th>Platform</th>
                            <th>What it does automatically</th>
                            <th>What it never touches</th>
                            <th>Do this before upload</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>WordPress 7.1</td>
                            <td>Browser-side compress + resize (quality 82, ~15% smaller JPEGs), HEIC to JPEG, AVIF decode, thumbnails; Chrome/Edge 137+ only, silent server fallback</td>
                            <td>Your original file and its metadata; per-image quality/format; existing library</td>
                            <td>Size to your theme's real display width; choose format; strip metadata deliberately</td>
                        </tr>
                        <tr>
                            <td>Shopify</td>
                            <td>CDN re-encoding, WebP/AVIF per browser, auto display sizes, GIF to animated WebP</td>
                            <td>Your uploaded master; framing, backgrounds, consistency</td>
                            <td>Upload a clean, cropped, color-true master at 2048px+; let the CDN handle delivery</td>
                        </tr>
                        <tr>
                            <td>Instagram</td>
                            <td>Resize to 1080px ceiling, re-encode to its own target</td>
                            <td>Anything above 1080px is discarded, not preserved</td>
                            <td>Export at exact target size (e.g. 1080x1350) so its re-encode has nothing to butcher</td>
                        </tr>
                        <tr>
                            <td>Marketplaces (eBay, Vinted, Etsy)</td>
                            <td>Resize/re-encode to unpublished internal targets; enforce caps (e.g. 12MB eBay, 10MB Vinted)</td>
                            <td>Framing, background, white balance; sellers report visible shifts</td>
                            <td>Ship pre-sized, background-cleaned, sub-cap files so the pipeline has minimal work to do</td>
                        </tr>
                        <tr>
                            <td>Everywhere</td>
                            <td>Delivery-side byte reduction with fixed defaults</td>
                            <td>Judgment: crop, background, format strategy, metadata, cross-channel consistency</td>
                            <td>Run your own pre-upload pipeline, automated with one repeatable instruction</td>
                        </tr>
                    </tbody>
                </table>
            </GuideTable>
        </section>

        <!-- 08 FAQ -->
        <GlassFAQs items={faqItems} jsonLd={false} />

        <!-- Final CTA -->
        <GlassCTA
            heading="Close the gap instead of leaving it open"
            href="/"
            label="Open mochify.app →"
        >
            See what your own images look like with the gap closed instead of left open: drop a batch into Mochify and prompt <em>"resize to 2000px on the long edge, convert to WebP, and strip location data"</em>, then compare it to what the platform default would have shipped.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>
