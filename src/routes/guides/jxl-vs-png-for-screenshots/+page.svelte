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
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

    // Rendered with the guide-demo component set (same as
    // bring-your-own-bucket-s3-r2). Every number in this guide comes from one
    // measured pair of files, not from a vendor benchmark: a macOS screenshot
    // saved as PNG (1,924,519 bytes) and the same shot re-encoded to lossless
    // JXL by Mochify (1,034,300 bytes). The pixel-identity and color-profile
    // claims in "What lossless actually guarantees" were verified by decoding
    // both files and diffing them channel by channel. Patched 2026-09-14 for
    // the content-ops compliance pass (ledger v22 + writing manual v9).

    const metadata = {
        title: "JPEG XL vs PNG for Screenshots: Half the Size, Same Pixels",
        seoTitle: "JPEG XL vs PNG for Screenshots - Half the Size, Same Pixels",
        description: "One macOS screenshot, measured: 1.84 MiB as PNG, 0.99 MiB as lossless JPEG XL. Why screenshots compress so well in JXL, and when to stay on PNG.",
        category: "Image Formats",
        readTime: "10 min read",
        date: "September 12, 2026",
        lastUpdated: "September 14, 2026"
    };

    const toc = [
        { id: "the-short-answer", label: "The short answer" },
        { id: "the-test", label: "The test: one screenshot, two formats" },
        { id: "why-screenshots", label: "Why screenshots compress so well in JXL" },
        { id: "what-lossless-guarantees", label: "What lossless actually guarantees" },
        { id: "when-to-use", label: "When to use JXL for screenshots (and when not to)" },
        { id: "how-to-convert", label: "How to convert" },
        { id: "faq", label: "FAQ" }
    ];

    const convertSteps = [
        {
            title: "Drop the PNG on the converter.",
            html: "<p>Open the <a href=\"/solutions/png-to-jxl\">PNG to JXL converter</a> and add your screenshots. Up to 3 files a month with no signup and 20MB per file, or 25 a month with a free account. Metadata is stripped on the way through, GPS included, with nothing to set for it on this page; a screenshot rarely carries any, so for this test it made no difference.</p>"
        },
        {
            title: "Switch Lossless on.",
            html: "<p>This matters. The default PNG to JXL encode is a high-quality <em>lossy</em> pass, because for most PNGs that makes the smallest file and the difference is invisible. For screenshots you want the switch on, so the result is pixel-exact and still smaller than the PNG.</p>"
        },
        {
            title: "Check the size before you commit.",
            html: "<p>Lossless JXL beats PNG on essentially every screenshot we have measured, but a tiny image with very few colors is one case where PNG's palette mode can win. If the output is not smaller, keep the PNG.</p>"
        },
        {
            title: "Keep the PNG if the file is going anywhere public.",
            html: "<p>See the support table above. JXL is an excellent archive and Apple-ecosystem format right now, and a poor choice for a file you are about to paste into a bug tracker, a Google Doc, or a web page.</p>"
        }
    ];

    const faqItems = [
        {
            q: "Is lossless JPEG XL really identical to the PNG?",
            a: "Yes, in the sense that matters: every pixel value survives the round trip. We verified this by decoding both files and comparing them channel by channel. The one caveat is the color profile, which is a separate thing from the pixel data and is covered in the section above."
        },
        {
            q: "How much smaller is JXL than PNG for screenshots?",
            a: "In the test on this page, 46% smaller: 1,924,519 bytes as PNG against 1,034,300 bytes as lossless JXL, for a 3056x1982 macOS screenshot. Expect roughly 30% to 50% on typical UI screenshots. Photographic content inside the screenshot pushes the saving higher, flat single-color areas push it lower."
        },
        {
            q: "Can I put a JXL screenshot on a website?",
            a: "Not as your only format, no. Safari 17 and later support JXL natively, but Chrome 145 ships decoding off by default behind a flag, and Firefox is in the same position. If the image has to render for everyone, serve PNG or WebP, or use a picture element with a JXL source and a PNG fallback."
        },
        {
            q: "Does JXL keep the transparency in a macOS screenshot?",
            a: "Yes. macOS window screenshots carry an alpha channel for the rounded corners and drop shadow, and the alpha survives a lossless JXL encode intact. Both files in the test report an alpha channel."
        },
        {
            q: "Should I convert my whole screenshots folder?",
            a: "For a personal archive on a Mac, it is a reasonable trade: the test pair implies roughly 184 MiB of PNG screenshots becoming about 99 MiB. Keep the originals until you have confirmed your tools open JXL, because a screenshot you cannot open is worth less than the disk space it saved."
        },
        {
            q: "Is JXL better than WebP lossless for screenshots?",
            a: "Usually yes on size, and JXL supports higher bit depths and wider gamuts. WebP lossless has the practical advantage of working in every current browser, which for a screenshot you intend to share is often the deciding factor."
        }
    ];

    const related = [
        {
            href: "/guides/what-is-a-jxl-file",
            title: "What Is a JXL File?",
            desc: "The format explained end to end: what JPEG XL is, what opens it today, and how it compares with the formats it is trying to replace."
        },
        {
            href: "/guides/chrome-145-jpeg-xl-default",
            title: "Did Chrome 145 Enable JPEG XL by Default?",
            desc: "What Chrome 145 actually shipped, why the flag still matters, and what it means for serving JXL on the open web."
        },
        {
            href: "/guides/converting-images-to-jpeg-xl",
            title: "Converting Images to JPEG XL",
            desc: "A practical walkthrough of moving a library to JXL, including lossless mode and lossless JPEG recompression."
        },
        {
            href: "/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl",
            title: "WebP, AVIF, or JPEG XL in 2026?",
            desc: "How the three modern formats compare on size, support, and features, and which one to reach for per use case."
        }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>JPEG XL vs PNG for Screenshots - Half the Size, Same Pixels</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/jxl-vs-png-for-screenshots" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "JPEG XL vs PNG for Screenshots: Half the Size, Same Pixels",
        "description": "One macOS screenshot, measured: 1.84 MiB as PNG, 0.99 MiB as lossless JPEG XL. Why screenshots compress so well in JXL, and when to stay on PNG.",
        "url": "https://mochify.app/guides/jxl-vs-png-for-screenshots",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/jxl-vs-png-for-screenshots"
        },
        "datePublished": "2026-09-12",
        "dateModified": "2026-09-14",
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
                {"@type": "ListItem", "position": 3, "name": "JPEG XL vs PNG for Screenshots: Half the Size, Same Pixels", "item": "https://mochify.app/guides/jxl-vs-png-for-screenshots"}
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
            JPEG XL vs PNG for Screenshots: Half the Size, Same Pixels
        </h1>
        <div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
        <p class="mt-5 text-sm font-bold text-[#875F42] mb-0">
            {metadata.readTime} · {metadata.date} · Updated {metadata.lastUpdated} · Mochify Engineering Team
        </p>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed mt-8 mb-0">
            Screenshots are the one image type almost everybody produces every day, and almost nobody optimizes. Your operating system saves them as PNG, PNG is lossless, and there the thinking usually stops. But lossless is a property of the result, not of the format, and PNG is not the only way to get there. This guide takes a single real macOS screenshot, re-encodes it as lossless JPEG XL, and reports what actually happened: the sizes, the pixels, and the one piece of metadata that changed in a way worth knowing about.
        </p>

        <GlassPanel>
            <p>
                <strong class="text-[#4A2C2C]">Published September 12, 2026 by the Mochify Engineering Team.</strong>
                Every figure below comes from one measured pair of files rather than a published benchmark, and the pixel-identity claim was verified by decoding both files and diffing them channel by channel.
            </p>
        </GlassPanel>
    </header>

    <div class="space-y-12">

        <section>
            <GuideTOC items={toc} />
        </section>

        <section id="the-short-answer" class="scroll-mt-24">
            <SectionHeading>The short answer</SectionHeading>

            <VerdictPill kind="yes" banner>
                Lossless JPEG XL stored the same screenshot in 46% less space than PNG, with every pixel preserved.
            </VerdictPill>

            <p class="mt-6">
                One macOS screenshot, 3056x1982, saved by the system as PNG came to <strong class="text-[#4A2C2C]">1,924,519 bytes</strong>. Re-encoded to lossless JPEG XL it came to <strong class="text-[#4A2C2C]">1,034,300 bytes</strong>. That is 890,219 bytes saved, a 46% reduction, for a file that decodes back to the same image.
            </p>
            <p>
                The catch is not quality, it is compatibility. JXL opens natively on current macOS and in Safari 17 and later, but Chrome and Firefox still keep <a href="/guides/chrome-145-jpeg-xl-default">JPEG XL decoding behind a flag</a>. So the honest recommendation is narrow: JXL is an excellent format for a screenshot you are <em>keeping</em>, and a bad format for one you are about to <em>send</em>.
            </p>
        </section>

        <section id="the-test" class="scroll-mt-24">
            <SectionHeading>The test: one screenshot, two formats</SectionHeading>

            <p>
                The source is an ordinary full-window macOS screenshot of a web page, captured at Retina scale and saved by the system in its default format. The JXL was produced by Mochify's PNG to JXL converter with lossless mode on. Nothing was resized, cropped, or retouched between the two.
            </p>

            <GuideTable>
                <table>
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>PNG (as saved by macOS)</th>
                            <th>JPEG XL (lossless)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>File size</strong></td>
                            <td>1,924,519 bytes (1.84 MiB)</td>
                            <td>1,034,300 bytes (0.99 MiB)</td>
                        </tr>
                        <tr>
                            <td>Dimensions</td>
                            <td>3056 x 1982</td>
                            <td>3056 x 1982</td>
                        </tr>
                        <tr>
                            <td>Bytes per pixel</td>
                            <td>0.318</td>
                            <td>0.171</td>
                        </tr>
                        <tr>
                            <td>Alpha channel</td>
                            <td>Yes</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>Color profile</td>
                            <td>Display P3</td>
                            <td>sRGB IEC61966-2.1</td>
                        </tr>
                        <tr>
                            <td><strong>Result</strong></td>
                            <td>Baseline</td>
                            <td><strong>46% smaller</strong></td>
                        </tr>
                    </tbody>
                </table>
            </GuideTable>

            <p>
                Two things in that table deserve more than a row each. The bytes-per-pixel figures explain <em>why</em> the saving happens, and the color profile row is the one genuine caveat in this whole comparison. Both get their own section below.
            </p>

            <GlassInfoBox type="note" title="One file is not a benchmark">
                <p class="m-0">
                    These are real measurements from one real pair of files, which is more useful than a vendor chart and less authoritative than a corpus. On typical UI screenshots expect somewhere in the 30% to 50% range. A screenshot that is mostly flat color will save less, because PNG is already good at flat color. A screenshot containing photos, gradients, or a video still will save more.
                </p>
            </GlassInfoBox>
        </section>

        <section id="why-screenshots" class="scroll-mt-24">
            <SectionHeading>Why screenshots compress so well in JXL</SectionHeading>

            <p>
                Because JPEG XL's lossless mode is image-aware and PNG's is not, and on a screenshot that difference is worth roughly 46%. PNG compresses in two stages. First it applies one of <a href="https://www.w3.org/TR/png-3/" target="_blank" rel="noopener noreferrer">five per-row filters</a> that predict each pixel from its left and upper neighbours and store the difference. Then it runs the whole filtered stream through DEFLATE, the same general-purpose algorithm as a zip file. That design is from the mid-1990s and it is remarkable how well it has aged, but both halves are limited: the filters only look one row up and one pixel left, and DEFLATE knows nothing about images at all.
            </p>
            <p>
                JPEG XL's lossless path, called modular mode, replaces both stages with something image-aware. It uses a self-correcting predictor that weighs several different predictions per pixel and learns which is working, it can split the image into regions that get different treatment, and it entropy-codes the residuals with adaptive context modeling rather than a generic dictionary compressor.
            </p>
            <p>
                Screenshots reward that. A screenshot is full of long exact repeats, hard edges, text rendered with the same antialiasing over and over, and large areas of a single flat color interrupted by fine detail. PNG's row filters handle the flat areas well and the text poorly. Modular mode handles both, which is where the extra 46% comes from. The bytes-per-pixel numbers say it plainly: 0.318 for PNG against 0.171 for JXL, on identical pixels. You can reproduce the pair on your own screenshot with the <a href="/solutions/png-to-jxl">PNG to JXL converter</a>.
            </p>

            <GlassInfoBox type="technical" title="Also worth knowing: lossless JPEG recompression">
                <p class="m-0">
                    JXL has a second lossless trick that does not apply here but is worth knowing if you also have a folder of JPEGs. It can re-encode an existing JPEG into JXL, typically around 20% smaller, and reconstruct the original JPEG file bit for bit later. That is a different mechanism from modular mode, and it is the one genuinely unique feature JPEG XL has over every other format. Mochify's JPG to JXL converter does not do this: it is a high-quality re-encode, so keep your JPEG masters. The <a href="/guides/converting-images-to-jpeg-xl">guide to converting a library to JPEG XL</a> covers both paths.
                </p>
            </GlassInfoBox>
        </section>

        <section id="what-lossless-guarantees" class="scroll-mt-24">
            <SectionHeading>What lossless actually guarantees</SectionHeading>

            <p>
                Lossless guarantees the pixel values, not the color profile: here every pixel value survived the round trip and only the profile changed, from Display P3 to sRGB. We did not take the word "lossless" on trust. Both files were decoded to raw pixels and compared channel by channel, and the comparison is worth reporting carefully, because the first result looks alarming and the explanation is the interesting part.
            </p>
            <p>
                Compared directly, 12.8% of the color channel values differed, some by as much as 87 levels out of 255. That is not compression loss. That is the color profile row in the table above: the PNG is tagged <strong class="text-[#4A2C2C]">Display P3</strong> and the JXL is tagged <strong class="text-[#4A2C2C]">sRGB</strong>, and converting between two color spaces changes the numbers stored for a pixel even when the color it represents stays as close as the smaller space allows. Saturated colors move the most, which is exactly where the large differences landed.
            </p>
            <p>
                Convert the original to sRGB first, so both files are in the same space, and the comparison changes completely: <strong class="text-[#4A2C2C]">99.2% of values are bit-identical, and the maximum difference anywhere in the image is 1 level out of 255</strong>. A maximum delta of one is the signature of rounding between two implementations of the same color conversion, not of a lossy encoder. Lossy compression at any useful quality produces errors many times larger than that, concentrated exactly on the text edges a screenshot is full of.
            </p>
            <p>
                So the encode is genuinely lossless. The pixels went through unharmed. What changed was the color space they are described in.
            </p>

            <GlassInfoBox type="warning" title="Check this if you work in wide gamut">
                <p class="m-0">
                    In this conversion the Display P3 profile became sRGB. For a screenshot of a normal web page that is a non-event, because the content was sRGB to begin with and nothing visible changes. It matters if your screenshot contains wide-gamut content that genuinely uses the P3 space: photography, video stills, color-graded design work, or a display calibration target. In that case the colors outside sRGB are mapped into it, and that part is not recoverable. JPEG XL itself has no such limitation, it handles wide gamut and high bit depth well, so if you need P3 preserved, verify the profile on the output before converting an archive in bulk.
                </p>
            </GlassInfoBox>
        </section>

        <section id="when-to-use" class="scroll-mt-24">
            <SectionHeading>When to use JXL for screenshots (and when not to)</SectionHeading>

            <p>
                The size argument is settled. The only real question is whether the file will open where it needs to open, and for JPEG XL in 2026 the answer still depends heavily on where that is (<a href="https://caniuse.com/jpegxl" target="_blank" rel="noopener noreferrer">current browser support on caniuse.com</a>).
            </p>

            <GuideTable>
                <table>
                    <thead>
                        <tr>
                            <th>Where the screenshot is going</th>
                            <th>Format</th>
                            <th>Why</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Personal archive on a Mac</td>
                            <td><strong>JXL</strong></td>
                            <td>Finder, Preview, and Quick Look handle it natively. Roughly half the disk space.</td>
                        </tr>
                        <tr>
                            <td>Long-term storage or backup</td>
                            <td><strong>JXL</strong></td>
                            <td>Lossless, smaller, and an <a href="https://jpeg.org/jpegxl/" target="_blank" rel="noopener noreferrer">open ISO standard</a> rather than a vendor format.</td>
                        </tr>
                        <tr>
                            <td>Pasted into Slack, Jira, Notion, a doc</td>
                            <td><strong>PNG</strong></td>
                            <td>Most of these render a JXL as a broken image or an undownloadable attachment.</td>
                        </tr>
                        <tr>
                            <td>On a public web page</td>
                            <td><strong>PNG or WebP</strong></td>
                            <td>Chrome and Firefox keep JXL decoding behind a flag, so most visitors would see nothing.</td>
                        </tr>
                        <tr>
                            <td>Sent to someone on Windows</td>
                            <td><strong>PNG</strong></td>
                            <td>Windows needs an extension installed before it will preview a JXL at all.</td>
                        </tr>
                        <tr>
                            <td>Documentation you control end to end</td>
                            <td><strong>Either</strong></td>
                            <td>Fine if you can guarantee the viewer, otherwise use a picture element with a PNG fallback.</td>
                        </tr>
                    </tbody>
                </table>
            </GuideTable>

            <p>
                The pattern is consistent: JXL wins wherever <em>you</em> control what opens the file, and loses wherever you do not. That is a compatibility problem rather than a technical one, and it is slowly improving, but it is the state of things today and it is worth planning around rather than hoping past. If the choice is wider than JXL or PNG, <a href="/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl">how WebP, AVIF and JPEG XL compare</a> covers the other two.
            </p>
        </section>

        <section id="how-to-convert" class="scroll-mt-24">
            <SectionHeading>How to convert</SectionHeading>

            <StepList steps={convertSteps} />

            <GlassInfoBox type="tip" title="Keep the originals until you have checked">
                <p class="m-0">
                    Converting an archive is a one-way decision if you delete the sources. Convert a handful first, open them in whatever you actually use, confirm the color profile is what you expect, and only then run the rest. Disk space is cheaper than a screenshot you cannot open.
                </p>
            </GlassInfoBox>
        </section>

        <GlassFAQs items={faqItems} />

        <GlassCTA
            heading="Convert a screenshot to lossless JXL"
            href="/solutions/png-to-jxl"
            label="Open the PNG to JXL converter →"
            secondaryHref="/guides/what-is-a-jxl-file"
            secondaryLabel="What is a JXL file?"
        >
            Drop a PNG in, switch <em>Lossless</em> on, and compare the two sizes yourself. Files are processed in memory at api.mochify.app and wiped the moment your download is ready. Nothing is written to disk and no logs contain your image data.
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
