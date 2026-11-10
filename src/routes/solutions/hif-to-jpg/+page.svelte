<script lang="ts">
    import ImageUpload from '$lib/components/ImageUpload.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    // Moved out of the markup into the shared FaqAccordion so the answers can
    // carry links and so the FAQPage block below is built from the same array
    // the page renders. Nothing else on this page changed: it carries most of
    // the site's search clicks and is the guard in the /heic-to-jpeg experiment.
    const faqs: FaqItem[] = [
        {
            q: 'Do you see my photos?',
            a: 'No. Your photos travel over HTTPS to our encoder, are converted in memory and discarded as soon as the conversion finishes. Nothing is written to disk and nothing containing your files is logged.'
        },
        {
            q: 'What is the difference?',
            a: 'HIF stores 10-bit color data in a tiny file. JPG is the 8-bit global standard. Shoots in HIF, share in JPG.'
        },
        {
            q: 'Does this keep Fuji film sims?',
            a: 'Yes. A HIF is a developed picture, not a RAW file, so the film simulation (Velvia, Classic Chrome and the rest) is already in its pixels, and the converted JPG carries the same look. Nothing is reinterpreted on the way through.'
        },
        {
            q: 'What about EXIF metadata?',
            a: "By default, we preserve all camera metadata (ISO, Shutter, GPS). If you want to remove it for privacy, add your files and then switch on the 'Strip EXIF' toggle before converting."
        },
        {
            q: 'How do I convert a HIF file to JPG?',
            a: [
                'Drop the .HIF files into the box above and download the JPGs; there is nothing to install. Up to 3 files per batch with no signup or on a free account, and 25 per batch on Seller and Pro. Without a converter, Canon bodies convert HEIF to JPEG in the camera\'s Playback menu, Canon\'s Digital Photo Professional and Sony\'s Imaging Edge Desktop convert on a computer, and a Mac exports JPEG from Preview with File, Export. The ',
                {
                    href: '/guides/hif-to-jpg-canon-sony-fujifilm',
                    label: 'HIF to JPG guide for Canon, Sony and Fujifilm'
                },
                ' walks through each route.'
            ]
        },
        {
            q: 'What is a HIF file?',
            a: [
                'A still photo that a Canon, Sony or Fujifilm mirrorless camera has saved in the HEIF container, compressed with HEVC and usually 10 bits per channel. It is the same family of format Apple uses for .HEIC iPhone photos, under the camera makers\' extension. More in ',
                { href: '/guides/what-is-a-hif-file', label: 'What is a HIF file?' }
            ]
        },
        {
            q: 'Is HIF better than JPEG?',
            a: [
                "For capture, often yes: a 10-bit HIF records 1,024 tonal steps per channel against JPEG's 256, in a smaller file, which shows in skies and gradients and leaves more room when editing. For sharing, no: a JPG opens everywhere and a HIF does not, which is why many photographers shoot HIF and deliver JPG. To keep the 10 bits for the web, ",
                { href: '/solutions/hif-to-avif', label: 'HIF to AVIF' },
                ' does that. The trade-off is covered in ',
                {
                    href: '/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera',
                    label: 'Should I shoot HEIF or JPEG on my mirrorless camera?'
                }
            ]
        },
        {
            q: 'How do I open a .HIF file without converting it?',
            a: [
                "On a Mac it opens in Preview and Photos with no setup. On Windows 11 or 10, install the HEIF Image Extension and the HEVC Video Extensions ($0.99) from the Microsoft Store and Photos will open it; without the second one you get an error. Canon's Digital Photo Professional and Sony's Imaging Edge Desktop open their own cameras' files. Opening is not sharing, though: a marketplace, CMS or print service that wants JPEG still needs a converted file. Every Windows fix is in ",
                { href: '/guides/open-heif-files-on-windows', label: 'how to open HEIF files on Windows' },
                '.'
            ]
        },
        {
            q: 'Do I need to download software to convert HIF to JPG?',
            a: "No. This converter runs in your browser on Windows, Mac, Linux, iPhone or Android, and the conversion happens on our encoder, so there is nothing to install. If you convert whole cards regularly, the Mochify CLI converts a folder from the terminal with one plain-English prompt, and Canon's and Sony's desktop apps are the offline route."
        }
    ];

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };
</script>

<svelte:head>
    <title>HIF to JPG Converter (Canon, Sony, Fuji) - Free | Mochify</title>
    <meta name="description" content="Free online HIF to JPG converter for Canon, Sony and Fujifilm cameras: R5, Sony Alpha, X-T5. Convert .HIF files to JPEG in seconds, no signup needed.">
    <meta property="og:description" content="Free online HIF to JPG converter for Canon, Sony and Fujifilm cameras: R5, Sony Alpha, X-T5. Convert .HIF files to JPEG in seconds, no signup needed.">

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mochify HIF to JPG Converter",
            "operatingSystem": "Any",
            "applicationCategory": "MultimediaApplication",
            "url": "https://mochify.app/solutions/hif-to-jpg",
            "description": "Instantly turn 10-bit Fuji, Canon & Sony HIF photos into universally compatible JPEGs using advanced Google Jpegli encoding.",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            },
            "featureList": [
                "Encodes JPGs with Google's jpegli encoder",
                "Converts professional HDR containers to standard 8-bit JPEGs",
                "Files streamed into memory on the encoder, never written to disk",
                "Supports 10-bit HEIF/HIF formats from Fuji X-T5, Sony A7 IV, Canon R5"
            ],
            "applicationSubCategory": "Image Converter",
            "softwareRequirements": "Modern Web Browser"
        }
    </script>

    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<div class="relative max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">
        
        <div class="text-center mb-12 space-y-6">
            <div class="flex flex-wrap justify-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-matcha text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Photographer Friendly
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-pink text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-cocoa-ink tracking-tight">
                <span class="bg-gradient-to-r from-mochi-pink-soft to-mochi-pink bg-clip-text text-transparent">
                    HIF
                </span> 
                to 
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JPG
                </span>
                Converter
            </h1>
            
            <p class="text-lg text-cocoa-deep font-medium max-w-2xl mx-auto leading-relaxed text-balance">
                Convert 10-bit Fuji, Canon & Sony HIF photos into universally compatible JPEGs instantly.
            </p>
        </div>

        <div class="mb-16">
            <!-- quality goes in queryParams, NOT as a prop: ImageUpload takes no
                 `quality`/`showQuality`, so the `quality={90}` that used to sit here
                 was silently dropped and this page ran at core's Q65 default. 85
                 because a HIF has already been through HEVC once, and a second lossy
                 pass at 65 stacks fresh artifacts on top of the baked-in ones. -->
            <ImageUpload types=".HEIF, .HIF" output="jpg" showTypes={false} compact queryParams="photography=1&quality=85" showExifOption={true} stripExifDefault={false} showDayPass={true} />
        </div>

        <section class="mt-10 max-w-4xl mx-auto">
            <h2 class="text-2xl font-extrabold text-cocoa-ink mb-6">How to convert HIF to JPG</h2>
            <ol class="space-y-4">
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">1</span>
                    <p class="leading-relaxed text-cocoa-deep">
                        <strong class="text-cocoa-ink">Drop your .HIF files</strong> in the box above, or click browse. Up to 3 files per batch with no signup or on a free account, and 25 per batch on a Day Pass or any paid plan. Got a whole shoot to convert? A <a href="/pricing" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">$2 Day Pass</a> covers 100 uploads in 24 hours, no signup.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">2</span>
                    <p class="leading-relaxed text-cocoa-deep">
                        <strong class="text-cocoa-ink">Decide what happens to the metadata.</strong> Once your files are in, a Strip EXIF switch appears; that is the only choice on this page. It starts off here, so your camera data (ISO, shutter, lens, GPS) stays in the JPG unless you switch it on. Each file is then decoded and re-encoded as a JPG with Google's jpegli encoder.
                    </p>
                </li>
                <li class="bg-white border border-pink-50 rounded-2xl px-6 py-5 shadow-sm flex gap-4 items-center">
                    <span class="shrink-0 w-8 h-8 rounded-xl deep-tile font-black text-sm flex items-center justify-center">3</span>
                    <p class="leading-relaxed text-cocoa-deep">
                        <strong class="text-cocoa-ink">Download your JPGs.</strong> They open in Lightroom, Photoshop, Windows Photos, Preview, every browser and every upload form, none of which need to know what HIF is.
                    </p>
                </li>
            </ol>
        </section>

        <section class="mt-20 mb-20 max-w-2xl mx-auto">
            <div class="liquid-glass rounded-[2rem] px-7 py-6 flex flex-col sm:flex-row items-center gap-5">
                <div class="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD6E5] to-mochi-pink/20">
                    <svg class="h-6 w-6 text-mochi-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                </div>
                <div class="flex-1 text-center sm:text-left">
                    <p class="font-black text-cocoa-ink text-base leading-snug">Need to resize as well?</p>
                    <p class="text-sm text-cocoa-deep/70 mt-1 leading-relaxed">In the Mochify web app you can type a request such as <span class="font-semibold text-cocoa-deep">"convert to JPG and resize to 1200px"</span> and Magic Flow does the rest.</p>
                </div>
                <a
                    href="/auth/register"
                    class="flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-black text-white bg-mochi-pink hover:bg-[#E91E8C] shadow-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap"
                >
                    Try it free
                </a>
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-cocoa-ink">Why convert HIF to JPG?</h2>
                    <p class="leading-relaxed text-cocoa-deep">
                        HIF is a modern container used by professional cameras to store <strong class="text-[#7E685E]">10-bit HDR photos</strong>. While they offer better color depth, they often fail to open on web browsers or older editing software.
                    </p>
                    <p class="leading-relaxed text-cocoa-deep">
                        Mochify converts them into standard 8-bit JPEGs with Google's jpegli encoder. The JPG is a standard-range file that every screen, app and upload form can show; the extra highlight headroom of an HDR capture and the 10-bit precision are not carried across. If you want to keep 10-bit color, <a href="/solutions/hif-to-avif" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">convert to AVIF</a> instead.
                    </p>
                </div>

                <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                    <h3 class="font-bold text-cocoa-ink mb-5 text-sm uppercase tracking-widest opacity-70">Supported Camera Models</h3>
                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {#each ['Fuji X-T5 / X-H2', 'Fuji X100VI', 'Canon EOS R5 / R6', 'Canon R3 / 1D X', 'Sony A7 IV / RV', 'Sony Alpha 1'] as camera}
                            <li class="flex items-center gap-3 text-sm font-semibold text-cocoa-deep">
                                <span class="w-2 h-2 rounded-full bg-matcha-dark"></span> {camera}
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-extrabold text-cocoa-ink">What the converter does to your HIF</h2>
            <p class="leading-relaxed text-cocoa-deep">
                HIF is the HEIF container as Canon, Sony and Fujifilm write it: a 10-bit, HEVC-encoded still, often with an HDR PQ tone curve, in a file that most browsers, upload forms and older editors will not open. This page decodes it and re-encodes the picture as an 8-bit JPG with Google's jpegli encoder, so what you download opens in Lightroom, Photoshop, Windows Photos, Preview, every browser and every upload form.
            </p>
            <p class="leading-relaxed text-cocoa-deep">
                What you get is the picture as it looks, in a standard-range JPG. The HDR headroom and the 10-bit precision are not carried; if you need them, <a href="/solutions/hif-to-avif" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">convert to AVIF</a> instead, which keeps 10-bit color.
            </p>
            <p class="leading-relaxed text-cocoa-deep">
                Metadata is up to you. On this page the Strip EXIF switch starts off, so ISO, shutter, lens and GPS stay in the JPG unless you switch it on before converting. Your files travel over HTTPS to our encoder, are converted in memory and discarded the moment the conversion finishes. Nothing is written to disk and nothing containing your files is logged.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-extrabold text-cocoa-ink">Converting HIF to JPG without a converter</h2>
            <p class="leading-relaxed text-cocoa-deep">
                Canon: the camera does it. In the Playback menu, a HEIF shot can be converted to JPEG on the card. On a computer, Canon's Digital Photo Professional opens .HIF files from its own bodies and exports JPEG.
            </p>
            <p class="leading-relaxed text-cocoa-deep">
                Sony: Imaging Edge Desktop. Open the Viewer, drag in the .HIF files, select them and use File, Export to save JPEGs. The full walkthrough is in <a href="/guides/sony-hif-to-jpg" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">how to convert Sony HIF files to JPG</a>.
            </p>
            <p class="leading-relaxed text-cocoa-deep">
                Mac: Preview and Photos open a .HIF with no setup. In Preview, File, Export, choose JPEG. One file at a time; for a whole card, the box at the top of this page or the CLI below is quicker.
            </p>
            <p class="leading-relaxed text-cocoa-deep">
                Windows: Windows 11 and 10 open a .HIF in Photos once the HEIF Image Extension and the HEVC Video Extensions ($0.99) are installed from the Microsoft Store; without the second one you get an error. Opening is not converting, though: a marketplace, CMS or print service that wants JPEG still needs a converted file. Every Windows fix is in <a href="/guides/open-heif-files-on-windows" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">how to open HEIF files on Windows</a>, and the camera-by-camera routes are in the <a href="/guides/hif-to-jpg-canon-sony-fujifilm" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">HIF to JPG guide for Canon, Sony and Fujifilm</a>.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto space-y-4">
            <h2 class="text-2xl font-extrabold text-cocoa-ink">Limits, bulk and automation</h2>
            <p class="leading-relaxed text-cocoa-deep">
                Up to 3 files per batch at 20MB each with no signup (3 a month as a guest) or on a free account (25 a month). Seller, Pro and Growth accounts convert 25 per batch at up to 75MB each, and a $2 <a href="/pricing" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">Day Pass</a> takes 100 uploads in 24 hours with no signup.
            </p>
            <p class="leading-relaxed text-cocoa-deep">
                The same conversion runs from the terminal with the <a href="/mcp" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">Mochify CLI</a> (sign in once with <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">mochify auth login</code>, then <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">mochify DSC00123.HIF -t jpg</code>), from an AI assistant through the hosted or local MCP server, and from the REST API:
            </p>
            <pre class="overflow-x-auto rounded-2xl bg-[#2F2320] text-[#F6EDE8] text-sm p-5 leading-relaxed"><code>curl -X POST "https://api.mochify.app/v1/squish?type=jpg&stripExif=false" \
  -H "Authorization: Bearer $MOCHIFY_KEY" \
  --data-binary @DSC00123.HIF \
  -o DSC00123.jpg</code></pre>
            <p class="leading-relaxed text-cocoa-deep">
                The CLI, MCP and API are clients over the same encoder as this page: files travel over HTTPS to api.mochify.app, are converted in memory and discarded. Drop <code class="px-1.5 py-px rounded bg-mochi-blush text-mochi-pink-ink text-sm">stripExif=false</code> to strip metadata, GPS included. Full parameter reference in the <a href="/docs" class="font-bold text-mochi-pink hover:text-mochi-pink-deep transition-colors">API documentation</a>.
            </p>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <FaqAccordion {faqs} class="grid md:grid-cols-2 gap-4 items-start" />
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-cocoa-milk uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/solutions/heif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">HEIF to JPG →</p>
                        <p class="text-xs text-cocoa-milk">Any .heif, .heic or .hif file</p>
                    </div>
                </a>
                <a href="/heic-to-jpeg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 9l1.5 1.5 3-3.75" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">HEIC to JPG →</p>
                        <p class="text-xs text-cocoa-milk">The iPhone and iPad lane</p>
                    </div>
                </a>
                <a href="/solutions/hif-to-avif" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl deep-tile">
                        <svg aria-hidden="true" class="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-cocoa-ink text-sm mb-0.5 group-hover:text-mochi-pink transition-colors">HIF to AVIF →</p>
                        <p class="text-xs text-cocoa-milk">Same photos, 10-bit preserved</p>
                    </div>
                </a>
            </div>
        </section>
    </div>


<style>
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
</style>