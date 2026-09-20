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

    // Uses the guide-demo component set (open reading column, mochi glass
    // surfaces) rather than the boxed card layout the older guides still use.
    // /guides/style-demo stays as the noindex reference copy of this design.

    const metadata = {
        title: "How to Make Any Photo Ultra HDR (Google Photos, Samsung, iPhone, Lightroom, or Online)",
        description: "Convert any photo to Ultra HDR on Google Photos, Samsung, iPhone, Lightroom or online: what conversion really does, exact steps, and where the result displays.",
        category: "Image Formats",
        readTime: "23 min read",
        date: "September 20, 2026"
    };

    const toc = [
        { id: "which-hdr", label: "Which \"HDR\" you mean (and which results to ignore)" },
        { id: "what-conversion-does", label: "What converting a photo to HDR actually does" },
        { id: "google-photos", label: "Google Photos on Android: the Ultra HDR slider" },
        { id: "samsung-xiaomi", label: "Samsung and Xiaomi: capture is HDR, the toggles are for display" },
        { id: "iphone", label: "iPhone: HDR by default, no converter for old photos" },
        { id: "lightroom", label: "Lightroom and Camera Raw: HDR Output" },
        { id: "online-converters", label: "Online converters: three checks before you upload" },
        { id: "mochify-workflow", label: "Mochify Workflow: convert a photo to Ultra HDR" },
        { id: "where-it-displays", label: "Will it look right where you post it?" },
        { id: "cheat-sheet", label: "Cheat Sheet: which route converts what" },
        { id: "faq", label: "FAQ" }
    ];

    const workflowSteps = [
        {
            title: "Sort your sources.",
            html: "<p>Recent iPhone and Android captures usually carry a map already; camera JPEGs, older phone photos, scans, screenshots and anything downloaded from a website usually do not. You do not need to know which; the converter checks each file.</p>"
        },
        {
            title: "Finish destructive edits first.",
            html: "<p>Crop, straighten, brightness, sharpening, background removal and shadow work belong before this step, on the normal image. Resize, crop and rotate are safe on the HDR path and carry an existing map through untouched, but brightness, clarity, background removal and shadow generation switch the HDR path off and return a clean standard-range file, because the base image they change no longer matches the map.</p>"
        },
        {
            title: "Drop the files.",
            html: "<p>The page accepts JPG, JPEG, PNG, WebP, AVIF, HEIC, HEIF and HIF, up to 3 files at 20MB each without an account. Metadata, including GPS, is stripped by default; if you need camera data kept, turn the Strip EXIF toggle off before converting. The gain map survives either way.</p>"
        },
        {
            title: "Read which lane each file took.",
            html: "<p>A file that already carried a gain map is re-encoded verbatim; nothing is recomputed, because a derived map is measurably worse than the one the sensor produced. A plain SDR file gets a synthesized map: a smooth ramp that starts around three-quarters brightness and climbs to about 1.5 stops, tempered by local contrast so a bright sky lifts differently from a white shirt. Generated headroom is invented, not recovered, and the page says so rather than pretending otherwise. If encoding a map would cost more than it is worth for a particular image, you get the plain file back.</p>"
        },
        {
            title: "Check your own screen with the side-by-side.",
            html: "<p>The page shows the same photo as SDR and Ultra HDR directly under the uploader. If the two look identical, your screen or browser is not rendering HDR, and the photo you just made will look identical too, until you open it somewhere that does.</p>"
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
            q: "Can you convert an SDR photo to HDR?",
            a: "Yes. A converter computes a gain map, a small brightness multiplier stored alongside the normal image, and writes both into a standard JPEG called Ultra HDR. On an HDR display the highlights go brighter than white; on any other screen you see the original photo. Google Photos on Android, Lightroom's HDR Output and online converters such as Mochify's all do this in under a minute."
        },
        {
            q: "Does converting a photo to HDR recover detail that was lost?",
            a: "No. If the original was clipped at capture, the detail is gone, and no tool recovers it. Conversion infers where extra brightness plausibly belongs from the highlights that survived and writes a modest map, which is why honest converters describe generated headroom as invented rather than restored. Only a photo captured in HDR, or edited from a raw file with real highlight data, carries measured headroom."
        },
        {
            q: "Is the Google Photos Ultra HDR slider real HDR?",
            a: "It writes a real, standards-compliant gain map into the JPEG, so the file is a genuine Ultra HDR image that HDR screens and apps will render. What it is not is recovered data: the slider synthesizes headroom for a photo that never had any, at the strength you choose. That is exactly what any SDR-to-HDR conversion does."
        },
        {
            q: "How do I turn an Ultra HDR photo back into a normal JPEG?",
            a: "On Mochify, run the file through as JPG without asking for HDR and it comes back as a plain standard-range JPEG: the gain map is dropped unless you request the HDR path, and the <code>X-Mochify-HDR</code> response header reads <code>false</code> so you can confirm it. Any output other than JPG comes back standard-range too, so converting the file to PNG or WebP drops the map, and so does any brightness, clarity, background removal or shadow edit, which return a clean SDR file. Google Photos saves an SDR copy if you apply certain filters or Markup edits. Keep the original if you might want the HDR version later."
        },
        {
            q: "Why does my HDR photo look too bright on Instagram, and can I turn HDR off?",
            a: "Instagram renders gain maps in feed posts, so on an HDR phone at night a strong map can look like glare. As a viewer, turn down HDR system-wide: on Galaxy phones with One UI 7, Settings, Advanced features, Super HDR; on Pixels running Android 16, Settings, Display &amp; touch, Enhanced HDR brightness. As the poster, use a gentler map: a lower slider value in Google Photos, or a converter that caps generated headroom at around 1.5 stops."
        },
        {
            q: "How do I know if my screen shows HDR photos?",
            a: "Open the <a href=\"/solutions/sdr-to-hdr#hdr-compare-h\">side-by-side comparison on Mochify's converter page</a>, which shows the same photo as a standard JPEG and as an Ultra HDR JPEG. If the right-hand image is clearly brighter in the highlights, your screen and browser render gain maps. If both look the same, you are seeing the standard-range version: a non-HDR display, a browser without gain-map support such as Firefox, or a phone with its HDR display setting turned off."
        },
        {
            q: "Does JPEG support HDR?",
            a: "Yes, since Ultra HDR. The gain map rides inside an ordinary JPEG next to the normal image, so the file opens everywhere and only HDR-aware viewers use the extra layer. That is different from AVIF and JPEG XL, which can store HDR in the pixels themselves, and from WebP and PNG, which cannot carry an Ultra HDR gain map in common use. The short version, including how to spot a converter that gives you the wrong kind of HDR file, is in <a href=\"/guides/does-jpeg-support-hdr\">Does JPEG support HDR?</a>."
        },
        {
            q: "Does a gain map make the file much bigger?",
            a: "No. The map is stored at a fraction of the image's resolution and compressed hard; Android's specification recommends storing it at a quarter of the width and height. On Mochify, where the whole pipeline uses the jpegli encoder, the map typically adds a low single-digit percentage to the file size."
        }
    ];

    const related = [
        { title: "Why HDR Photos Look Flat When You Share Them (and How Gain Maps Fix It)", href: "/guides/why-hdr-photos-look-flat-when-shared", desc: "the troubleshooting companion: every place the map gets lost, and the fix for each." },
        { title: "Jpegli Guide 2026: Quality-Per-Byte", href: "/guides/jpeg-in-2026-jpegli", desc: "the encoder that makes an Ultra HDR JPEG's second layer almost free." },
        { title: "HEIF to JPG: The Complete Conversion Guide", href: "/guides/heif-to-jpg-complete-guide", desc: "converting the container most HDR captures start in." },
        { title: "HIF to JPG: Convert Canon, Sony & Fujifilm Photos to Shareable JPEGs", href: "/guides/hif-to-jpg-canon-sony-fujifilm", desc: "the pro-camera lane, where 10-bit HDR PQ files need a different plan." },
        { title: "What Is an AVIF File? (And How to Open One)", href: "/guides/what-is-an-avif-file", desc: "the format that stores HDR in the pixels instead of a map." }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>How to Convert a Photo to Ultra HDR - Every Platform | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/how-to-make-any-photo-ultra-hdr" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "How to Make Any Photo Ultra HDR (Google Photos, Samsung, iPhone, Lightroom, or Online)",
        "description": "Convert any photo to Ultra HDR on Google Photos, Samsung, iPhone, Lightroom or online: what conversion really does, exact steps, and where the result displays.",
        "url": "https://mochify.app/guides/how-to-make-any-photo-ultra-hdr",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/how-to-make-any-photo-ultra-hdr"
        },
        "datePublished": "2026-09-20",
        "dateModified": "2026-09-20",
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
            { "@type": "Thing", "name": "Ultra HDR" },
            { "@type": "Thing", "name": "gain map" },
            { "@type": "Thing", "name": "Google Photos" },
            { "@type": "Thing", "name": "Samsung Super HDR" },
            { "@type": "Thing", "name": "Adaptive HDR" },
            { "@type": "Thing", "name": "ISO 21496-1" }
        ],
        "keywords": "convert photo to Ultra HDR, how to convert SDR to HDR, Google Photos Ultra HDR, Samsung Super HDR, iPhone HDR photos, Lightroom HDR output, gain map, Ultra HDR JPEG",
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".article-intro", "h1"]
        }
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app/" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "How to Make Any Photo Ultra HDR (Google Photos, Samsung, iPhone, Lightroom, or Online)", "item": "https://mochify.app/guides/how-to-make-any-photo-ultra-hdr" }
        ]
        }
    </script>
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
            How to Make Any Photo Ultra HDR (Google Photos, Samsung, iPhone, Lightroom, or Online)
        </h1>
        <div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
        <p class="mt-5 text-sm font-bold text-[#875F42] mb-0">
            {metadata.readTime} · {metadata.date} · Mochify Engineering Team
        </p>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed mt-8 mb-0">
            You can convert an ordinary photo to Ultra HDR in about a minute, and the result is still a normal JPEG that opens everywhere: on an HDR screen the highlights push past white, and on any other screen you see the same picture you started with. The catch is that "convert a photo to HDR" means four different things on the internet, and three of them will hand you the wrong file. This guide sorts out which HDR you actually want, explains what a conversion does and does not do to your picture, and then walks through the real steps on Google Photos, Samsung and Xiaomi phones, iPhone, Lightroom, and an online converter, finishing with where the result will and will not display once you post it.
        </p>
    </header>

    <div class="space-y-12">

        <!-- TOC -->
        <section>
            <GuideTOC items={toc} />
        </section>

        <!-- 01 -->
        <section id="which-hdr" class="scroll-mt-24">
            <SectionHeading>Which "HDR" you mean (and which results to ignore)</SectionHeading>
            <p class="mb-4">The HDR photo you want is an Ultra HDR (gain map) image: a standard JPEG with a small extra layer that tells an HDR display how much brighter each region may go. If you search "convert SDR to HDR" or "JPG to HDR converter", most of what ranks is something else, and it pays to recognize the three impostors before you upload anything.</p>
            <p class="mb-4"><strong>Video converters.</strong> Topaz, Wondershare, UniFab, VanceAI and the AI-upscaling crowd own the phrase "SDR to HDR". They take video and output HDR10 or Dolby Vision clips. Useful if you have footage; useless for a photo.</p>
            <p class="mb-4"><strong>Radiance <code>.hdr</code> file converters.</strong> Convertio, ChangeMyFile, AnyConv, Vertopal and the other convert-anything sites will happily turn a JPG into an "HDR" file. The HDR they mean is the 1980s Radiance RGBE format used as an environment map for 3D lighting in Blender and Maya, and ChangeMyFile's own page says so. Your phone cannot open it, Instagram will not take it, and it does not add brightness to anything. If a tool offers <code>.hdr</code> as the output extension, you are on the wrong page.</p>
            <p class="mb-4"><strong>"HDR filter" apps.</strong> Photo editors have sold an "HDR effect" for fifteen years: crunched shadows, glowing edges, saturated skies. That is a look, applied to a normal image, and it displays identically on every screen. It has nothing to do with the format Google, Apple and Meta now call HDR photos, which is about a display showing real extra brightness. Some online tools blur the two, exporting a "tone-mapped JPG" and calling it HDR. It is not.</p>
            <p class="mb-4">The real thing is defined by ISO 21496-1:2025, the gain map standard published in July 2025 and referenced by Android's Ultra HDR format, Apple's Adaptive HDR and Adobe Camera Raw. In plain terms: one file, two renditions. The base image is the normal photo. The gain map is a low-resolution brightness multiplier stored alongside it. A viewer that understands the map lifts the highlights; a viewer that does not simply shows the base. Our companion guide on <a href="/guides/why-hdr-photos-look-flat-when-shared">why HDR photos look flat when shared</a> covers the mechanism in depth. Here we care about making one.</p>

            <GlassInfoBox type="tip" title="Check your screen before you convert anything">
                Every step in this guide produces a file whose extra brightness only shows on a screen and browser that render gain maps, so the first thing to establish is whether yours does. The converter page has a <a href="/solutions/sdr-to-hdr#hdr-compare-h">side-by-side of the same photo as SDR and Ultra HDR</a>: if the right-hand image is visibly brighter in the sunlit wall and the light tubes, you will see everything this guide describes; if the two look identical, you are on a standard-range screen or browser, and every HDR photo you make will look ordinary there until you open it somewhere else. Thirty seconds now saves you an hour of wondering whether the conversion worked.
            </GlassInfoBox>
        </section>

        <!-- 02 -->
        <section id="what-conversion-does" class="scroll-mt-24">
            <SectionHeading>What converting a photo to HDR actually does</SectionHeading>
            <p class="mb-4">Converting an SDR photo to Ultra HDR means computing a gain map for a picture that never had one, and that map is a plausible guess, not recovered data. This is the point every converter's marketing dances around, so it is worth being precise about it before you press the button.</p>
            <p class="mb-4">When a phone captures an HDR photo, the map comes from the sensor: the camera saw highlights brighter than white, kept them, and stored the ratio between that scene and the standard-range picture. Apple's cameras have embedded gain maps since 2020, and iPhone HDR captures carry a headroom value "greater than 1 and up to 8 depending on the scene content" according to Apple's own <a href="https://developer.apple.com/videos/play/wwdc2024/10177/" target="_blank" rel="noopener noreferrer">WWDC session on Adaptive HDR</a>. Pixel phones have captured Ultra HDR by default since the Pixel 8. Those files already have real headroom. Converting them is pointless; the job is to keep the map through editing and sharing.</p>
            <p class="mb-4">An old JPEG, a screenshot, a scan, a stock image or anything that has been through a website has no such data. Whatever was brighter than white is gone; the pixels are clipped at 255. A converter, whether it is Google Photos, an AI tool or Mochify, has to infer where extra brightness would have been from what survived: the smooth bright regions, the local contrast, the shape of the highlights. Google describes its own machine-learning model in exactly these terms in its <a href="https://research.google/blog/hdr-photo-editing-with-machine-learning/" target="_blank" rel="noopener noreferrer">HDR photo editing research post</a>: it "can produce a Gain Map given only an SDR image as input". Given only an SDR image is the operative phrase. The result looks convincing on an HDR screen. It is an effect, not measurement.</p>
            <p class="mb-4">Three practical consequences follow. First, generated headroom is modest by design: Mochify's synthesized map, for example, targets about 1.5 stops above roughly three-quarters brightness, ramped in smoothly, while a real capture can carry several times that. Second, conversion cannot fix a blown sky or a black shadow; it lifts what is there and invents nothing new. Third, because the base image is untouched and the map rides alongside it, the file stays a standard JPEG. Android's Ultra HDR specification puts it plainly: "Legacy readers that don't support the new format read and display the conventional low dynamic range image" (<a href="https://developer.android.com/media/platform/hdr-image-format" target="_blank" rel="noopener noreferrer">Android Ultra HDR image format v1.1</a>). Nothing you do here breaks the photo for anyone.</p>
        </section>

        <!-- 03 -->
        <section id="google-photos" class="scroll-mt-24">
            <SectionHeading>Google Photos on Android: the Ultra HDR slider</SectionHeading>
            <p class="mb-4">The fastest way to convert a photo to Ultra HDR on an Android phone is the Ultra HDR slider in the Google Photos editor, which works on existing photos, including ones taken years ago on a camera that never heard of gain maps. Google's help page gives the path in one line: open Google Photos, select a photo, tap Edit, then "use the Ultra HDR slider in the editor" (<a href="https://support.google.com/photos/answer/14159275" target="_blank" rel="noopener noreferrer">Google Photos Help: HDR photos</a>). The slider sits with the other adjustment tools, alongside Brightness and Contrast, and you set its strength, so you choose how much headroom to invent. Save, and the photo is an Ultra HDR JPEG in your library and in your backup.</p>
            <p class="mb-4">Two things Google's documentation says that people miss:</p>
            <ul class="list-disc pl-6 space-y-3 marker:text-[#F06292] my-6">
                <li><strong>The slider does not change your screen; the screen changes the slider.</strong> On Android 16 and later there is a system setting, Settings, then Display &amp; touch, then <strong>Enhanced HDR brightness</strong>, with its own on/off and intensity. If that is off, Google says "the Ultra HDR slider still shows up in the Google Photos app. It won't change the photo's appearance." Google's page does not say whether the map is still saved in that state, so the safe move is to turn the setting on before you judge the result. If you are not sure the phone renders HDR at all, open the <a href="/solutions/sdr-to-hdr#hdr-compare-h">side-by-side check</a> in the phone's browser; it answers that in one glance.</li>
                <li><strong>Some edits will quietly save an SDR copy.</strong> Google Photos now preserves HDR through most edits, including Magic Eraser and Unblur, but its help page lists the exceptions: "certain filters", "incompatible formats", HDR output settings turned off, and Markup edits with the pen or highlighter. Do the Ultra HDR step last, and skip Markup on a photo you want to stay HDR.</li>
            </ul>
            <p class="mb-4">The feature reached Android phones in April 2025 and, per Google's June 2025 update, edited HDR photos now keep their full range. Whether the slider has shipped in Google Photos for iPhone is something Google's help pages do not confirm as of September 2026, so treat it as an Android route.</p>
            <p class="mb-4">Because Google Photos ships on Samsung, Xiaomi, OnePlus and every other Android phone, this route is not Pixel-only. If the slider is missing on your phone, update the app first; if it is still missing, the online route below does the same job from any browser.</p>
        </section>

        <!-- 04 -->
        <section id="samsung-xiaomi" class="scroll-mt-24">
            <SectionHeading>Samsung and Xiaomi: capture is HDR, the toggles are for display</SectionHeading>
            <p class="mb-4">Samsung and Xiaomi phones capture HDR photos natively on recent models, but neither ships a built-in tool that converts an existing SDR photo to HDR; the HDR switches in their settings control how HDR photos are displayed, not whether a photo has a gain map. This trips a lot of people up, because the settings are named as if they add HDR.</p>
            <p class="mb-4"><strong>Samsung Super HDR.</strong> Galaxy phones from the S24 series onward capture HDR stills and can share them to Instagram with the effect intact. The <strong>Super HDR</strong> switch is a display control. Samsung's own support page for One UI 7 puts it under the system settings, not the Gallery: "Open the Settings app on your smartphone (not the Gallery app). Tap on Advanced Features. Find and turn on the option Super HDR." On earlier One UI versions the same toggle lived inside the Gallery's own settings. Samsung's regional support note is explicit that if a file "lack[s] HDR data, enabling Super HDR won't affect display". So: Super HDR shows the headroom your camera already captured, everywhere from Gallery to Instagram, and turning it off is the fix when HDR content is blindingly bright at night, which is why One UI 7 made it system-wide. It does not convert anything.</p>
            <p class="mb-4"><strong>Xiaomi Pro HDR display.</strong> Same shape. Xiaomi's support FAQ for the 14 Ultra explains that "the Pro HDR display is only supported in the Gallery APP" and that you enable it in the Gallery app's settings. Photos from the native camera carry the data; the toggle lets the Gallery render it. Third-party apps may not.</p>
            <p class="mb-4">To convert an old photo on either brand, use the Google Photos slider above (Google Photos runs fine on Galaxy and Xiaomi devices) or an online converter. Once you have an Ultra HDR JPEG, the Super HDR or Pro HDR display setting is what makes it glow on the phone itself, and the quickest way to confirm the toggle is doing its job is the <a href="/solutions/sdr-to-hdr#hdr-compare-h">SDR versus Ultra HDR comparison</a> in the phone's browser: brighter on the right means the phone is rendering the map.</p>
        </section>

        <!-- 05 -->
        <section id="iphone" class="scroll-mt-24">
            <SectionHeading>iPhone: HDR by default, no converter for old photos</SectionHeading>
            <p class="mb-4">An iPhone captures HDR photos automatically and there is no built-in way to convert an older SDR photo to HDR in the Photos app, so the route for old pictures is a desktop editor or an online converter. Apple's current camera guide states that "By default, iPhone takes photos in HDR (for the rear camera and the front camera) when it's most effective", and a manual HDR switch exists only on the iPhone 11 models, iPhone SE (2nd generation) and iPhone 12 (<a href="https://support.apple.com/guide/iphone/adjust-hdr-camera-settings-iph2cafe2ebc/ios" target="_blank" rel="noopener noreferrer">Apple Support: Adjust HDR camera settings</a>). Newer iPhones decide for you.</p>
            <p class="mb-4">Under the hood, Apple's format is called Adaptive HDR. With iOS 18 Apple moved its cameras to gain maps that follow the same ISO standard as Android's Ultra HDR, and its engineers confirmed that "JPEG files also fully support Adaptive HDR" alongside HEIF, so an iPhone photo exported as JPEG can keep its headroom. iOS 18 and macOS 15 also taught Messages, Quick Look, Preview and Photos to display gain-map images, which is why an HDR photo texted between iPhones looks right. Safari 26 renders HDR images too, so the <a href="/solutions/sdr-to-hdr#hdr-compare-h">comparison on the converter page</a> works as a display check on an iPhone running iOS 26.</p>
            <p class="mb-4">Applying Apple's HDR effect to a picture that does not have one is exposed to developers as an API, not to you as a menu item. In practice that leaves three options for an old photo on an iPhone: open it in Lightroom mobile and use HDR Output (next section), upload it to an online converter from Safari, or move it to an Android device and use Google Photos. Note the format trap on the way out: iPhone photos are usually <code>.HEIC</code>. Mochify's converter accepts HEIC directly, and if you only need a plain JPEG copy, the <a href="/heic-to-jpeg">HEIC to JPG converter</a> is the right page; the pro-camera <code>.HIF</code> files from Canon, Sony and Fujifilm bodies are a different lane with their own <a href="/guides/hif-to-jpg-canon-sony-fujifilm">HIF to JPG guide</a>.</p>
        </section>

        <!-- 06 -->
        <section id="lightroom" class="scroll-mt-24">
            <SectionHeading>Lightroom and Camera Raw: HDR Output</SectionHeading>
            <p class="mb-4">Lightroom can turn an SDR photo into an HDR-output file with a gain map, but read the export list for the version you own, because Adobe documents different formats for Lightroom Classic and for Lightroom on mobile and desktop. In both, the model is the same: edit in HDR mode, then export with HDR output enabled. Adobe's Camera Raw documentation describes the file it writes as one that "combines both SDR and HDR renditions within a single image and interpolates between the two dynamically at display time", citing ISO 21496-1 (<a href="https://helpx.adobe.com/camera-raw/using/gain-map.html" target="_blank" rel="noopener noreferrer">Adobe: Gain map in Camera Raw</a>).</p>
            <p class="mb-4"><strong>Lightroom (mobile and desktop, the cloud version).</strong> Open the photo, edit in HDR mode, then Share, Export as, and pick the file type. Adobe's export page lists JPG, AVIF, DNG and TIF, and describes JPG as a "widely compatible format that stores HDR data using gain map metadata", with the caveat that it "may display as SDR in non-compatible applications". That is the file you want for Instagram, Google Photos or a website.</p>
            <p class="mb-4"><strong>Lightroom Classic.</strong> Press the <strong>HDR</strong> button in Develop, Basics (it needs Process Version 3 or later), then File, Export and check <strong>Enable HDR Output</strong>. Adobe's Classic page lists AVIF, JPEG XL, TIFF, PSD and PNG as the HDR-capable formats and recommends "AVIF or JPEG XL for sharing and web applications". If you need a gain-map JPEG from Classic, check the export dialog in your build rather than assuming it is there; Adobe's current documentation for Classic does not list it, while the mobile and desktop app's does.</p>
            <p class="mb-4">One honesty note that applies here as much as to any converter: Lightroom's HDR mode gives you sliders that reach above white, and on a raw file with real highlight data that is recovery. On a JPEG that was clipped at capture, it is the same invention as everywhere else, just with you holding the brush.</p>
        </section>

        <!-- 07 -->
        <section id="online-converters" class="scroll-mt-24">
            <SectionHeading>Online converters: three checks before you upload</SectionHeading>
            <p class="mb-4">An online converter is the only route that works from any device, any browser and any file, but the category is full of tools that produce the wrong HDR, so run three checks before you trust one with a photo you care about. The checks take thirty seconds and rule out most of what ranks.</p>
            <ol class="list-decimal pl-6 space-y-3 marker:text-[#F06292] marker:font-bold my-6">
                <li><strong>Does it output an Ultra HDR JPEG, with a gain map?</strong> Look for the words "gain map", "Ultra HDR" or "ISO 21496-1" and a <code>.jpg</code> output. If the output extension is <code>.hdr</code>, <code>.exr</code> or <code>.pic</code>, it is a 3D-lighting format converter. If it only mentions "HDR effect", "filter" or "tone-mapped", it is a look, not a format.</li>
                <li><strong>Does it say what it invents?</strong> A tool that claims to "recover" or "reconstruct" the dynamic range of a single JPEG is describing synthesis in flattering words. The honest ones tell you the headroom is generated and roughly how much. Prefer those; you will understand what you are looking at when the result is brighter than you expected.</li>
                <li><strong>What happens to your file?</strong> Photos leave your device for any server-side tool. Read the retention line. A tool that processes in memory and discards the file is a different proposition from one that stores uploads, and a tool that says nothing has answered the question.</li>
            </ol>
            <p class="mb-4">Mochify's <a href="/solutions/sdr-to-hdr">SDR to HDR converter</a> passes all three by design, and the next section walks through it.</p>
        </section>

        <!-- 08 -->
        <section id="mochify-workflow" class="scroll-mt-24">
            <SectionHeading>Mochify Workflow: convert a photo to Ultra HDR</SectionHeading>
            <p class="mb-4">Mochify's <a href="/solutions/sdr-to-hdr">SDR to HDR page</a> turns any supported photo into an Ultra HDR JPEG in one drop: it keeps a gain map that is already in the file and generates one when there is none, and it tells you which of the two it did. The page is a fixed-purpose converter, so there is nothing to configure beyond a Strip EXIF toggle that appears after upload.</p>

            <GlassPanel>
                <StepList steps={workflowSteps} />
            </GlassPanel>

            <p class="mb-4">Only JPG output carries the map. Ask for JXL, AVIF, WebP or PNG and you get a standard-range file, since none of those can carry an Ultra HDR gain map on this path. The encoder is Google's jpegli throughout, which is what keeps the extra layer close to free: the map typically adds a low single-digit percentage to file size. The <a href="/guides/jpeg-in-2026-jpegli">jpegli guide</a> explains why that matters for every JPEG you ship.</p>

            <p class="mb-4"><strong>Same thing from the API.</strong> One parameter on <code>POST /v1/squish</code>: <code>hdr=true</code> preserves an existing map only, <code>hdr=generate</code> preserves and synthesizes. The <code>X-Mochify-HDR</code> response header reads <code>true</code>, <code>generated</code> or <code>false</code>, so a script can log which lane each file took. Leave the parameter off and an existing map is dropped: the output is a plain SDR JPEG and the header reads <code>false</code>. The <code>mochify</code> command-line tool (1.6.0 and later) has the same two lanes as <code>--hdr</code>: bare <code>--hdr</code> preserves an existing map and does nothing to an SDR photo, <code>--hdr generate</code> also synthesizes one, and both need <code>-t jpg</code>; <code>mochify photo.jpg -t jpg --hdr generate</code> is the whole command. The Chrome extension runs the same HDR path, so a photo on a web page can take the same route as the page.</p>

            <CodeCard filename="bash" code={curlExample} />

            <p class="mb-4">On the HDR path only <code>quality</code> reaches the encoder; <code>optimizeForWeb</code> is accepted but has no effect. The <a href="/docs">API documentation</a> has the full parameter list.</p>

            <GlassInfoBox type="note" title="Privacy note for this path">
                Images travel to <code>api.mochify.app</code> over HTTPS, are streamed into memory, processed and discarded. Nothing is written to disk, and there are no logs containing file data. This is the same in-memory model as every image operation on Mochify; the <a href="/architecture">architecture and data handling page</a> describes the read-only processing container.
            </GlassInfoBox>
        </section>

        <!-- 09 -->
        <section id="where-it-displays" class="scroll-mt-24">
            <SectionHeading>Will it look right where you post it?</SectionHeading>
            <p class="mb-4">An Ultra HDR photo only glows where the viewer renders gain maps, and as of September 2026 that means Google Photos, Apple Photos, Samsung Gallery, Instagram and Threads feed posts, Chromium browsers and Safari 26, but not Facebook, Flickr, Firefox, Instagram Stories or most website builders. Everywhere else you get the base image, which is the photo you started with, so nothing is lost; it just is not HDR there.</p>
            <p class="mb-4"><strong>Where it works.</strong> Android 14 and later display Ultra HDR system-wide; iOS 18 and macOS 15 render gain maps in Photos, Messages, Quick Look and Preview. Instagram and Threads have supported HDR photos in feed posts since March 2024, per <a href="https://engineering.fb.com/2024/03/26/android/instagram-threads-hdr-photos/" target="_blank" rel="noopener noreferrer">Meta's engineering announcement</a>, when posted from the phone app; Stories do not show HDR and uploads from a desktop browser are unreliable. Google Messages keeps the map over RCS. Chrome and the other Chromium browsers display gain-map JPEGs, and WebKit added HDR image support in Safari 26.0 for iOS, iPadOS and macOS 26 (<a href="https://webkit.org/blog/17333/webkit-features-in-safari-26-0/" target="_blank" rel="noopener noreferrer">WebKit blog</a>).</p>
            <p class="mb-4"><strong>Where it does not.</strong> Facebook does not support HDR photos. Flickr converts uploads to 8-bit JPEG. Firefox has no gain-map support; the request has sat open since 2023. Squarespace strips the gain map on upload, as Adobe's Lightroom engineering lead confirmed in Squarespace's own forum, and other builders and CDNs that re-encode images are likely to do the same. For WhatsApp, Telegram, X, Pinterest and the rest, we have found no reliable published behavior, so send yourself a test image before you rely on it.</p>
            <p class="mb-4"><strong>When it looks wrong.</strong> Two opposite complaints come up constantly, and they have opposite causes. "It looks flat and dull" means the viewer is showing the base image: wrong app, wrong browser, or a pipeline stripped the map. Rule out the screen first with the side-by-side check, then work through the rest; our <a href="/guides/why-hdr-photos-look-flat-when-shared">guide to HDR photos that look flat when shared</a> walks through each case. "It is blindingly bright" means the viewer is rendering the map on a screen turned up at night. Samsung answered that with the system-wide Super HDR switch in One UI 7, and Pixel phones on Android 16 have the Enhanced HDR brightness slider; both tame every app at once, including Instagram. If you are the one posting, remember a generated map is a choice: a smaller slider value in Google Photos, or Mochify's deliberately restrained 1.5 stops, reads as depth rather than glare on a phone in a dark room.</p>
            <p class="mb-4">Ready to try it on a photo of your own? <a href="/solutions/sdr-to-hdr">Convert a photo to Ultra HDR</a> and use the side-by-side under the uploader to see whether your screen shows the difference.</p>
        </section>

        <!-- 10 -->
        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat Sheet: which route converts what</SectionHeading>

            <GuideTable class="my-6">
                <table>
                    <thead>
                        <tr>
                            <th>Route</th>
                            <th>Converts an old SDR photo?</th>
                            <th>What you get</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Google Photos (Android): Edit, Ultra HDR slider</td>
                            <td><VerdictPill kind="yes">Yes, strength you choose</VerdictPill></td>
                            <td>Ultra HDR JPEG in your library</td>
                            <td>Works on any photo; keeps HDR through most edits; Markup and some filters save SDR</td>
                        </tr>
                        <tr>
                            <td>Samsung Super HDR (Settings, Advanced features)</td>
                            <td><VerdictPill kind="no">No, display only</VerdictPill></td>
                            <td>Renders existing HDR photos brighter</td>
                            <td>Camera captures HDR from the S24 series; switch off to stop glare at night</td>
                        </tr>
                        <tr>
                            <td>Xiaomi Pro HDR display (Gallery settings)</td>
                            <td><VerdictPill kind="no">No, display only</VerdictPill></td>
                            <td>Renders existing HDR photos in Gallery</td>
                            <td>Third-party apps may not render it</td>
                        </tr>
                        <tr>
                            <td>iPhone Photos app</td>
                            <td><VerdictPill kind="no">No</VerdictPill></td>
                            <td>HDR at capture by default</td>
                            <td>Manual switch only on iPhone 11, SE (2nd gen), 12; use Lightroom or an online tool for old photos</td>
                        </tr>
                        <tr>
                            <td>Lightroom (mobile/desktop cloud): HDR mode, Export, JPG</td>
                            <td><VerdictPill kind="yes">Yes</VerdictPill></td>
                            <td>Gain-map JPG (also AVIF, TIF, DNG)</td>
                            <td>Adobe describes JPG as the compatible option</td>
                        </tr>
                        <tr>
                            <td>Lightroom Classic: Develop HDR, Export, Enable HDR Output</td>
                            <td><VerdictPill kind="yes">Yes</VerdictPill></td>
                            <td>AVIF, JPEG XL, TIFF, PSD, PNG per Adobe's page</td>
                            <td>Check your build for JPEG; Adobe recommends AVIF or JXL for web</td>
                        </tr>
                        <tr>
                            <td>Mochify SDR to HDR converter</td>
                            <td><VerdictPill kind="yes">Yes, generated (about 1.5 stops)</VerdictPill></td>
                            <td>Ultra HDR JPEG; existing maps preserved verbatim</td>
                            <td>3 files / 20MB without an account; JPG output only; API <code>hdr=generate</code>; also on the CLI (<code>--hdr generate</code> with <code>-t jpg</code>) and the Chrome extension; back to SDR: JPG output with HDR off</td>
                        </tr>
                        <tr>
                            <td>Generic "JPG to HDR" converter (<code>.hdr</code> output)</td>
                            <td><VerdictPill kind="no">No</VerdictPill></td>
                            <td>Radiance RGBE file for 3D lighting</td>
                            <td>Wrong HDR; phones and social apps cannot use it</td>
                        </tr>
                        <tr>
                            <td>"HDR filter" apps</td>
                            <td><VerdictPill kind="no">No</VerdictPill></td>
                            <td>A tone-mapped SDR image</td>
                            <td>A look, not a format; identical on every screen</td>
                        </tr>
                    </tbody>
                </table>
            </GuideTable>

            <p class="mb-4">If your photo is already on your phone, the Google Photos slider is the shortest path. If it is anywhere else, or you have a batch, <a href="/solutions/sdr-to-hdr">Mochify's SDR to HDR converter</a> takes three files at a time without an account and tells you which lane each one took.</p>
        </section>

        <!-- 11 FAQ -->
        <GlassFAQs items={faqItems} />

        <!-- Final CTA -->
        <GlassCTA
            heading="Ready to try it on a photo of your own?"
            href="/solutions/sdr-to-hdr"
            label="Convert a photo to Ultra HDR →"
        >
            Convert a photo to Ultra HDR and use the side-by-side under the uploader to see whether your screen shows the difference.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>

<style>
    /* The breadcrumb renders in the shared guides layout at max-w-4xl; align
       it with this page's 3xl reading column. The full trail stays visible,
       current-page crumb included, so what the reader sees matches the
       BreadcrumbList JSON-LD. */
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
