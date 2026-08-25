<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';

    // Two lanes, and the page exists to keep them distinguishable. `hdr=generate`
    // preserves a camera's own measured gain map when the file has one, and
    // generates a plausible one when it does not. Core reports them separately
    // via X-Mochify-HDR (true vs generated) precisely so they are never conflated,
    // so this copy must not blur them either.
    const lanes = [
        {
            label: 'Preserved',
            when: 'Your file already carries a gain map',
            sources: 'Ultra HDR JPEGs from Pixel and recent Android phones, and Apple Adaptive HDR JPEGs shared out of an iPhone',
            detail: 'The map your camera measured is carried through resize, crop, and rotate, then re-encoded verbatim. Nothing is recomputed, because a derived map is measurably worse than the one the sensor produced.',
            tone: 'green'
        },
        {
            label: 'Generated',
            when: 'Your file is plain SDR',
            sources: 'Ordinary JPEGs, PNGs, WebP, AVIF, and HEIC or HIF photos, which never carry a gain map Mochify can read',
            detail: 'A gain map is synthesized from the highlights already in the frame: a smooth ramp that starts around three-quarters brightness and climbs to roughly 1.5 stops, tempered by local contrast so a bright sky lifts differently from a white shirt.',
            tone: 'amber'
        }
    ];

    const formatSupport = [
        { fmt: 'JPG', verdict: 'yes', note: 'Ultra HDR: an ordinary JPEG with a gain map attached. The only output here that can carry one.' },
        { fmt: 'JXL', verdict: 'partial', note: 'No gain map concept. HDR lives in the pixels as linear float, so it works from a real HDR source but there is nothing to synthesize into.' },
        { fmt: 'AVIF', verdict: 'no', note: 'Our encoder path flattens to 8-bit sRGB before AVIF is written, which clips every highlight above white. Claiming HDR here would be a lie.' },
        { fmt: 'WebP', verdict: 'no', note: 'The format cannot represent HDR in any form.' },
        { fmt: 'PNG', verdict: 'no', note: 'The format cannot represent HDR in any form.' }
    ];

    const disqualifiers = [
        { op: 'Brightness', why: 'A gain map is a ratio to its base image. Shift the base and the ratio now means something different.' },
        { op: 'Clarity', why: 'Sharpening round-trips through a bounded 16-bit Lab space, which clips everything above standard white on the way in.' },
        { op: 'Background removal', why: 'Matting runs on standard-range pixels and composites against 0-255 colors, which are meaningless against the 0-1 scale HDR works in.' },
        { op: 'Shadow generation', why: 'Same reason as background removal: the compositing step has no notion of headroom.' }
    ];

    const faqs = [
        {
            q: 'Is generated HDR the same as real HDR?',
            a: 'No, and we report it differently for exactly that reason. A camera measures headroom at capture time. Synthesis infers a plausible one from the highlights that survived in your SDR file. It looks convincing on an HDR display, but it is an effect, not recovered data. The X-Mochify-HDR response header says "true" for preserved and "generated" for synthesized so the two are never confused.'
        },
        {
            q: 'How do I know if my screen shows HDR?',
            a: 'Look at the side-by-side at the top of this page. If the right-hand image is visibly brighter in the highlights, your screen and browser render gain maps. If both look the same, you are seeing the standard-range version, which usually means an SDR display or a browser without gain-map support, such as Firefox. Recent iPhones and Android phones in Safari or Chrome are the quickest way to see the difference.'
        },
        {
            q: 'What is a gain map, exactly?',
            a: 'Not a second picture. It is a smooth, half-resolution, heavily compressed brightness multiplier stored alongside a normal image. An HDR display multiplies the base by the map to reach beyond standard white. Everything else ignores it and shows the base.'
        },
        {
            q: 'Will the file still open on a normal screen?',
            a: 'Yes. Ultra HDR is a standard JPEG with extra data attached, so anything that reads JPEG reads it. Old software sees an ordinary photo, an HDR display sees the brighter rendition. There is no separate file to manage.'
        },
        {
            q: 'How much brighter does it actually get?',
            a: 'Synthesis targets about 1.5 stops of headroom, applied only above roughly three-quarters brightness and ramped in smoothly. A real capture typically carries 2 to 4 stops. We deliberately stay conservative: overclaiming headroom is what makes fake HDR look plastic.'
        },
        {
            q: 'Why did my conversion come back without HDR?',
            a: 'Most often the output format cannot carry it (AVIF, WebP, and PNG cannot), or the request also asked for a brightness, clarity, or background-removal change, which disqualifies the HDR lane. In both cases we return a clean standard-range file and report X-Mochify-HDR as "false" rather than labeling something HDR that is not.'
        },
        {
            q: 'Does the result get bigger?',
            a: 'A gain map adds a small amount, typically a few percent, because it is stored at half resolution and compressed hard. When encoding the map would cost more than it is worth, the plain file is returned instead.'
        },
        {
            q: 'What happens to my files?',
            a: 'They travel to our encoder over HTTPS, are streamed into memory, processed, and discarded. Nothing is written to disk and nothing is logged. Metadata is stripped by default, GPS included, so turn the Strip EXIF toggle off before converting if you need camera data kept. The gain map survives stripping either way.'
        }
    ];
</script>

<svelte:head>
    <title>SDR to HDR Photo Converter - Ultra HDR JPEG | Mochify</title>
    <meta name="description" content="Convert SDR photos to Ultra HDR JPEG. Mochify keeps a camera's own gain map or generates one, the file still opens everywhere, and the side-by-side shows whether your screen displays HDR.">
    <meta property="og:title" content="SDR to HDR Photo Converter - Mochify">
    <meta property="og:description" content="Add an HDR gain map to any photo. Preserved when your camera captured it, generated when it did not. Still opens everywhere, and the comparison tells you whether your screen shows HDR.">
    <link rel="canonical" href="https://mochify.app/solutions/sdr-to-hdr">

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mochify SDR to HDR Photo Converter",
            "operatingSystem": "Any",
            "applicationCategory": "MultimediaApplication",
            "applicationSubCategory": "Image Converter",
            "url": "https://mochify.app/solutions/sdr-to-hdr",
            "description": "Convert standard dynamic range photos into Ultra HDR JPEGs, preserving an existing gain map or generating one. Output opens everywhere; HDR displays render the extra highlight range.",
            "screenshot": "https://mochify.app/img/interior-hdr.jpg",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            },
            "featureList": [
                "Preserve an existing Ultra HDR or Apple Adaptive HDR gain map",
                "Generate a gain map for plain SDR photos",
                "Backwards-compatible Ultra HDR JPEG output",
                "Honest reporting of preserved versus generated headroom",
                "Processed in memory and discarded, never written to disk",
                "Side-by-side comparison that shows whether your display renders HDR"
            ],
            "softwareRequirements": "Modern Web Browser"
        }
    </script>

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                { "@type": "Question", "name": "Is generated HDR the same as real HDR?", "acceptedAnswer": { "@type": "Answer", "text": "No, and we report it differently for exactly that reason. A camera measures headroom at capture time. Synthesis infers a plausible one from the highlights that survived in your SDR file. It looks convincing on an HDR display, but it is an effect, not recovered data. The X-Mochify-HDR response header says true for preserved and generated for synthesized so the two are never confused." } },
                { "@type": "Question", "name": "How do I know if my screen shows HDR?", "acceptedAnswer": { "@type": "Answer", "text": "Look at the side-by-side at the top of this page. If the right-hand image is visibly brighter in the highlights, your screen and browser render gain maps. If both look the same, you are seeing the standard-range version, which usually means an SDR display or a browser without gain-map support, such as Firefox. Recent iPhones and Android phones in Safari or Chrome are the quickest way to see the difference." } },
                { "@type": "Question", "name": "What is a gain map, exactly?", "acceptedAnswer": { "@type": "Answer", "text": "Not a second picture. It is a smooth, half-resolution, heavily compressed brightness multiplier stored alongside a normal image. An HDR display multiplies the base by the map to reach beyond standard white. Everything else ignores it and shows the base." } },
                { "@type": "Question", "name": "Will the file still open on a normal screen?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Ultra HDR is a standard JPEG with extra data attached, so anything that reads JPEG reads it. Old software sees an ordinary photo, an HDR display sees the brighter rendition. There is no separate file to manage." } },
                { "@type": "Question", "name": "How much brighter does it actually get?", "acceptedAnswer": { "@type": "Answer", "text": "Synthesis targets about 1.5 stops of headroom, applied only above roughly three-quarters brightness and ramped in smoothly. A real capture typically carries 2 to 4 stops. We deliberately stay conservative: overclaiming headroom is what makes fake HDR look plastic." } },
                { "@type": "Question", "name": "Why did my conversion come back without HDR?", "acceptedAnswer": { "@type": "Answer", "text": "Most often the output format cannot carry it (AVIF, WebP, and PNG cannot), or the request also asked for a brightness, clarity, or background-removal change, which disqualifies the HDR lane. In both cases we return a clean standard-range file and report X-Mochify-HDR as false rather than labeling something HDR that is not." } },
                { "@type": "Question", "name": "Does the result get bigger?", "acceptedAnswer": { "@type": "Answer", "text": "A gain map adds a small amount, typically a few percent, because it is stored at half resolution and compressed hard. When encoding the map would cost more than it is worth, the plain file is returned instead." } },
                { "@type": "Question", "name": "What happens to my files?", "acceptedAnswer": { "@type": "Answer", "text": "They travel to our encoder over HTTPS, are streamed into memory, processed, and discarded. Nothing is written to disk and nothing is logged. Metadata is stripped by default, GPS included, so turn the Strip EXIF toggle off before converting if you need camera data kept. The gain map survives stripping either way." } }
            ]
        }
    </script>

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "SDR versus Ultra HDR comparison",
            "itemListElement": [
                { "@type": "ImageObject", "position": 1, "contentUrl": "https://mochify.app/img/interior.jpg", "name": "Sunlit hotel lobby interior as a standard-range JPEG", "encodingFormat": "image/jpeg", "creditText": "Mochify" },
                { "@type": "ImageObject", "position": 2, "contentUrl": "https://mochify.app/img/interior-hdr.jpg", "name": "The same lobby interior as an Ultra HDR JPEG with a generated gain map", "encodingFormat": "image/jpeg", "creditText": "Mochify" }
            ]
        }
    </script>
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

    <div class="text-center mb-12 space-y-6">
        <div class="flex flex-wrap justify-center gap-3">
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF7E6] border border-[#FDE68A] shadow-sm text-[#B45309] text-xs font-bold tracking-wide uppercase">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                Ultra HDR Gain Maps
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Never Saved to Disk
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Works With Photos, Not Video
            </span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
            Convert
            <span class="bg-gradient-to-r from-[#B0BEC5] to-[#78909C] bg-clip-text text-transparent">
                SDR photos
            </span>
            to
            <span class="bg-gradient-to-r from-[#FBBF24] to-[#F06292] bg-clip-text text-transparent">
                HDR
            </span>
        </h1>

        <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
            Give any photo a <strong class="text-[#4A2C2C]">gain map</strong> so highlights can go brighter than white on an HDR display. If your camera already captured one, we carry it through untouched. If it did not, we build a plausible one. The result is still an ordinary JPEG that opens everywhere.
        </p>
    </div>

    <div class="mb-16">
        <!-- quality=85 rather than core's default of 65. Q65 is fine on a clean
             source, but almost nothing arriving here is one: people upload JPEGs
             that have already been through a camera and a share sheet, and a
             second lossy pass at 65 stacks visible artifacts on top of the ones
             already baked in. 85 keeps that generational loss below notice
             without the file-size cost of 90. On the generate lane Q is
             forwarded straight to uhdrsave, so this is the quality of the SDR
             base the gain map sits on top of. Passed via queryParams because
             ImageUpload has no `quality` prop, only the query string it appends
             to /v1/squish. -->
        <ImageUpload types=".JPG, .JPEG, .PNG, .WEBP, .AVIF, .HEIC, .HEIF, .HIF" output="jpg" showTypes={false} queryParams="hdr=generate&quality=85" showExifOption={true} showDayPass={true} />
    </div>

    <!-- Side-by-side comparison, from the 2026-08-25 handoff. It doubles as an HDR
         display check, so it sits directly below the drop zone as part of the
         tool rather than lower on the page as a marketing aside. Both files are
         served byte-for-byte as Mochify produced them: no <picture>, no srcset,
         no CDN transform, nothing that would strip the embedded gain map. -->
    <section class="hdr-compare mt-10 max-w-4xl mx-auto" aria-labelledby="hdr-compare-h">
        <h2 id="hdr-compare-h" class="text-2xl font-black text-[#4A2C2C] mb-2 text-center">See the difference (and find out if your screen can show it)</h2>
        <p class="text-[#6C3F31] leading-relaxed mb-7 max-w-2xl mx-auto text-center">
            Both images are the same photo of a sunlit lobby. The one on the right carries a gain map that Mochify generated from the highlights already in the frame: the patch of sun on the wall, the rippling shadows beside it, and the glowing light tubes are where to look.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <figure class="m-0">
                <img
                    src="/img/interior.jpg"
                    width="2046"
                    height="3074"
                    alt="Sunlit hotel lobby with a stone wall, hanging light tubes and an arched fireplace, as a standard-range JPEG"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    class="block w-full h-auto rounded-2xl border border-pink-50 shadow-sm"
                />
                <figcaption class="mt-3 text-sm font-bold text-[#4A2C2C] text-center">Standard JPEG (SDR)</figcaption>
            </figure>
            <figure class="m-0">
                <img
                    src="/img/interior-hdr.jpg"
                    width="2046"
                    height="3074"
                    alt="The same lobby as an Ultra HDR JPEG with a generated gain map; the sunlight, shadows and light tubes render brighter on HDR displays"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    class="block w-full h-auto rounded-2xl border border-pink-50 shadow-sm"
                />
                <figcaption class="mt-3 text-sm font-bold text-[#4A2C2C] text-center">Ultra HDR JPEG (gain map added by Mochify)</figcaption>
            </figure>
        </div>

        <div class="mt-7 max-w-2xl mx-auto space-y-4">
            <p class="text-[#6C3F31] leading-relaxed">
                <strong class="text-[#4A2C2C]">If the right-hand image looks brighter in the highlights, your screen and browser are showing HDR.</strong> A phone from the last few years, a recent Mac or iPad, or an HDR monitor in Safari 26 or a Chromium browser (Chrome, Edge, Brave, Opera) will show it.
            </p>
            <p class="text-[#6C3F31] leading-relaxed">
                <strong class="text-[#4A2C2C]">If the two images look identical, you are looking at the standard-range version of both.</strong> That is not a fault in the file. Either the display has no headroom above white, or the browser does not read gain maps yet (Firefox does not, as of this writing, and neither do most desktop image viewers). Open this page on a recent phone and the difference appears.
            </p>
            <p class="text-[#6C3F31] leading-relaxed">
                This is also why the effect matters for anyone selling online: a product photo with a gain map looks like an ordinary photo to every customer, and noticeably more vivid to the growing share viewing on a phone that renders HDR. Nobody sees a worse image.
            </p>
            <p class="text-xs text-[#875F42]/70 leading-relaxed pt-1">
                Test photo by <a href="https://unsplash.com/@axcreativeagency" target="_blank" rel="noopener noreferrer" class="font-bold text-[#875F42] hover:text-[#F06292] transition-colors">Christian</a> on <a href="https://unsplash.com/photos/modern-lounge-with-stone-fireplace-VCP-nypY4as" target="_blank" rel="noopener noreferrer" class="font-bold text-[#875F42] hover:text-[#F06292] transition-colors">Unsplash</a>.
            </p>
        </div>
    </section>

    <!-- Prompt upsell, mirroring /solutions/hif-to-jpg. The example deliberately
         names resize: resize, crop and rotate carry a gain map through, whereas
         brightness, clarity and background removal disqualify the HDR lane
         entirely (see `disqualifiers` above). Suggesting one of those here would
         send people down a path that silently returns a standard-range file. -->
    <section class="mt-10 mb-20 max-w-2xl mx-auto">
        <div class="liquid-glass rounded-[2rem] px-7 py-6 flex flex-col sm:flex-row items-center gap-5">
            <div class="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD6E5] to-[#F06292]/20">
                <svg class="h-6 w-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            </div>
            <div class="flex-1 text-center sm:text-left">
                <p class="font-black text-[#4A2C2C] text-base leading-snug">Need to resize too? Just say so.</p>
                <p class="text-sm text-[#6C3F31]/70 mt-1 leading-relaxed">Type something like <span class="font-semibold text-[#6C3F31]">"add HDR and resize to 2000px"</span> and our prompt form handles the rest.</p>
            </div>
            <a
                href="/auth/register"
                class="flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-black text-white bg-[#F06292] hover:bg-[#E91E8C] shadow-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
                Try it free
            </a>
        </div>
    </section>

    <!-- Preserve vs generate. The distinction core is careful to report separately,
         so it gets the most prominent position on the page rather than a footnote. -->
    <section class="mt-10 max-w-4xl mx-auto">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-2">Two ways a photo comes back HDR</h2>
        <p class="text-[#6C3F31] leading-relaxed mb-7 max-w-2xl">
            Which lane your file takes is decided by the file itself, not by a setting. Drop it in and Mochify checks whether a gain map is already there.
        </p>

        <div class="grid md:grid-cols-2 gap-4">
            {#each lanes as lane (lane.label)}
                <div class="bg-white border border-pink-50 rounded-2xl px-6 py-6 shadow-sm flex flex-col gap-3">
                    <div class="flex items-center gap-2.5">
                        <span class="w-2.5 h-2.5 rounded-full {lane.tone === 'green' ? 'bg-[#81C784]' : 'bg-[#FBBF24]'}"></span>
                        <span class="font-black text-[#4A2C2C] text-sm uppercase tracking-widest">{lane.label}</span>
                    </div>
                    <p class="font-bold text-[#4A2C2C] text-base leading-snug">{lane.when}</p>
                    <p class="text-sm text-[#875F42] leading-relaxed">{lane.sources}</p>
                    <p class="text-sm text-[#6C3F31] leading-relaxed opacity-90 mt-1">{lane.detail}</p>
                </div>
            {/each}
        </div>

        <div class="mt-4 bg-[#FFF7E6] border border-[#FDE68A] rounded-2xl px-6 py-5">
            <p class="text-sm text-[#7C4A03] leading-relaxed">
                <strong class="font-black">Generated headroom is invented, not recovered.</strong>
                Nothing can retrieve detail your camera never wrote down. Synthesis reads the highlights that did survive and builds a brightness curve from them, which looks convincing on an HDR screen but is an effect rather than measured data. Every response says which one you got: the <span class="font-mono font-bold">X-Mochify-HDR</span> header returns <span class="font-mono font-bold">true</span> for preserved, <span class="font-mono font-bold">generated</span> for synthesized, and <span class="font-mono font-bold">false</span> when the result carries none.
            </p>
        </div>
    </section>

    <section class="mt-20 max-w-4xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-start">
            <div class="space-y-8">
                <div class="space-y-4">
                    <h2 class="text-2xl font-black text-[#4A2C2C]">What a gain map actually is</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        An ordinary photo tops out at white. A phone screen can go several times brighter than that, and a gain map is how a single file uses the extra range: a small, smooth, half-resolution <strong class="text-[#7E685E]">brightness multiplier</strong> stored next to the normal picture.
                    </p>
                    <p class="leading-relaxed text-[#6C3F31]">
                        An HDR display multiplies one by the other and gets a brighter rendition. Everything else ignores the map entirely and shows the plain image. That is why the output here is still a JPEG that opens anywhere, and why there is no second file to keep track of.
                    </p>
                </div>

                <div class="bg-white p-7 rounded-2xl border border-pink-50 shadow-sm space-y-3">
                    <h3 class="font-bold text-[#4A2C2C] text-sm uppercase tracking-widest opacity-70">How the generated map is built</h3>
                    <p class="text-sm text-[#6C3F31] leading-relaxed">
                        Brightness alone cannot distinguish a specular highlight from a blown sky from a white shirt, so a curve on brightness alone lifts all three equally and the result looks flat and artificial. The map here starts from a smooth ramp above roughly three-quarters brightness, climbing to about 1.5 stops, then corrects it by local contrast so isolated bright detail lifts more than a broad pale region.
                    </p>
                    <p class="text-sm text-[#6C3F31] leading-relaxed">
                        We deliberately do not run a neural model. A gain map gets low-passed to half resolution and compressed hard before it reaches the file, and the invented structure a model contributes does not survive that. A curve produces the same surviving result without the cost.
                    </p>
                </div>

                <div class="bg-white p-7 rounded-2xl border border-pink-50 shadow-sm space-y-3">
                    <h3 class="font-bold text-[#4A2C2C] text-sm uppercase tracking-widest opacity-70">Encoded with jpegli</h3>
                    <p class="text-sm text-[#6C3F31] leading-relaxed">
                        An Ultra HDR file is two pictures in one wrapper: the standard-range base everything sees, and the gain map on top of it. That makes the JPEG encoder matter more here than it does for an ordinary photo, because you are paying for the extra layer out of the same byte budget.
                    </p>
                    <p class="text-sm text-[#6C3F31] leading-relaxed">
                        Mochify swaps the system JPEG library for Google's <a href="/guides/jpeg-in-2026-jpegli" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">jpegli</a> across the whole encoder, so the HDR path writes through it too. Better quality-per-byte on the base image is what keeps the gain map close to free: the map itself is stored at half resolution and compressed hard, so the extra usually lands in the low single-digit percentages.
                    </p>
                </div>

                <div class="space-y-3">
                    <h3 class="text-lg font-black text-[#4A2C2C]">Which output formats can carry it</h3>
                    {#each formatSupport as f (f.fmt)}
                        <div class="bg-white p-5 rounded-2xl border border-pink-50 shadow-sm flex gap-4 items-start">
                            <span class="shrink-0 inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-mono font-black text-xs w-16 text-center
                                {f.verdict === 'yes' ? 'bg-[#F1F8E9] text-[#33691E] border border-[#DCEDC8]'
                                 : f.verdict === 'partial' ? 'bg-[#FFF7E6] text-[#B45309] border border-[#FDE68A]'
                                 : 'bg-[#F5F5F5] text-[#78909C] border border-[#E0E0E0]'}">
                                {f.fmt}
                            </span>
                            <p class="text-sm text-[#6C3F31] leading-relaxed opacity-90">{f.note}</p>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="space-y-4">
                {#each faqs as faq (faq.q)}
                    <details class="group bg-white border border-pink-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <summary class="flex items-center justify-between p-6 cursor-pointer font-bold text-[#4A2C2C] list-none select-none gap-4">
                            <span>{faq.q}</span>
                            <span class="text-[#7E685E] transition-transform duration-300 group-open:rotate-180 shrink-0">
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

    <section class="mt-20 max-w-4xl mx-auto">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-2">Edits that switch HDR off</h2>
        <p class="text-[#6C3F31] leading-relaxed mb-7 max-w-2xl">
            A gain map is a ratio to the image underneath it. Change that image and the ratio stops meaning what it meant, so these operations return a clean standard-range file instead of one labeled HDR that no longer is.
        </p>
        <div class="grid sm:grid-cols-2 gap-3">
            {#each disqualifiers as d (d.op)}
                <div class="bg-white p-5 rounded-2xl border border-pink-50 shadow-sm">
                    <h3 class="font-black text-[#4A2C2C] text-sm mb-1.5">{d.op}</h3>
                    <p class="text-sm text-[#6C3F31] leading-relaxed opacity-90">{d.why}</p>
                </div>
            {/each}
        </div>
    </section>

    <section class="mt-20 max-w-4xl mx-auto">
        <h2 class="text-2xl font-black text-[#4A2C2C] mb-2">Same thing from the API</h2>
        <p class="text-[#6C3F31] leading-relaxed mb-6 max-w-2xl">
            One parameter. Use <span class="font-mono font-bold text-[#4A2C2C]">hdr=true</span> to preserve only, or <span class="font-mono font-bold text-[#4A2C2C]">hdr=generate</span> to preserve and synthesize, which is what this page sends.
        </p>
        <div class="bg-[#2D2320] rounded-2xl px-6 py-5 overflow-x-auto shadow-sm">
            <pre class="text-sm font-mono text-[#F5E9E2] leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jpg&hdr=generate" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @photo.jpg \
  -D headers.txt -o photo-hdr.jpg

grep X-Mochify-HDR headers.txt
# X-Mochify-HDR: generated</code></pre>
        </div>
        <p class="text-sm text-[#875F42] leading-relaxed mt-4">
            One caveat worth knowing if you script this: on the HDR path only <span class="font-mono font-bold">quality</span> reaches the encoder. <span class="font-mono font-bold">optimizeForWeb</span> is accepted but has no effect, because progressive scan and 4:2:0 chroma belong to the plain JPEG writer that an Ultra HDR request does not go through. Full parameter reference lives in the <a href="/docs" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a>.
        </p>
    </section>

    <section class="mt-16 max-w-4xl mx-auto">
        <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
        <div class="grid sm:grid-cols-3 gap-4">
            <a href="/solutions/heif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                <span class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0 border border-[#C7D2FE]">
                    <svg class="w-4 h-4 text-[#4338CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                </span>
                <div>
                    <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIF to JPG →</p>
                    <p class="text-xs text-[#875F42]">Every HEIF variant, one converter</p>
                </div>
            </a>
            <a href="/solutions/hif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                <span class="w-9 h-9 rounded-xl bg-[#F1F8E9] flex items-center justify-center shrink-0 border border-[#DCEDC8]">
                    <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span>
                <div>
                    <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HIF to JPG →</p>
                    <p class="text-xs text-[#875F42]">Fuji, Canon and Sony bodies</p>
                </div>
            </a>
            <a href="/docs" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center shrink-0 border border-[#DDD6FE]">
                    <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                </span>
                <div>
                    <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">API docs →</p>
                    <p class="text-xs text-[#875F42]">Every parameter and header</p>
                </div>
            </a>
        </div>
    </section>
</div>

<style>
    /* Scoped per-page, matching /solutions/hif-to-jpg and /solutions/heif-to-jpg.
       `.liquid-glass` is not a global utility: every file that uses it carries its
       own copy, because Svelte scopes component styles. Using the class without
       this block renders the card with no background, border or shadow. */
    .liquid-glass {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow:
            0 8px 32px 0 rgba(240, 98, 146, 0.15),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.1);
    }

    /* Tells Safari 26 not to clamp the HDR image to standard range if a
       site-wide rule ever sets dynamic-range-limit: standard up the tree. */
    .hdr-compare {
        dynamic-range-limit: no-limit;
    }
</style>
