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
            a: 'Yes, Mochify preserves Fuji film simulations (Velvia, Classic Chrome, etc.) so your intended look stays intact.'
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
    <title>Convert HIF to JPG Online (Fuji/Canon) - Free & Fast | Mochify</title>
    <meta name="description" content="Convert Fuji, Canon & Sony HIF photos to JPEG instantly. Perfect for photographers using X-T5, R5, or Sony Alpha. Free, secure, and runs in-memory.">
    <meta property="og:title" content="HIF to JPG Converter - Mochify">

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
                "Preserves 10-bit dynamic range via Jpegli psychovisual quantization",
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
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F1F8E9] border border-[#DCEDC8] shadow-sm text-[#33691E] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Photographer Friendly
                </span>
                <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Never Saved to Disk
                </span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
                Convert 
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">
                    HIF
                </span> 
                to 
                <span class="bg-gradient-to-r from-[#E0ACD5] to-[#BA68C8] bg-clip-text text-transparent">
                    JPG
                </span>
            </h1>
            
            <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
                Turn 10-bit Fuji, Canon & Sony HIF photos into universally compatible JPEGs instantly.
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

        <section class="mt-10 mb-20 max-w-2xl mx-auto">
            <div class="liquid-glass rounded-[2rem] px-7 py-6 flex flex-col sm:flex-row items-center gap-5">
                <div class="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD6E5] to-[#F06292]/20">
                    <svg class="h-6 w-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                </div>
                <div class="flex-1 text-center sm:text-left">
                    <p class="font-black text-[#4A2C2C] text-base leading-snug">Need to resize as well?</p>
                    <p class="text-sm text-[#6C3F31]/70 mt-1 leading-relaxed">In the Mochify web app you can type a request such as <span class="font-semibold text-[#6C3F31]">"convert to JPG and resize to 1200px"</span> and Magic Flow does the rest.</p>
                </div>
                <a
                    href="/auth/register"
                    class="flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-black text-white bg-[#F06292] hover:bg-[#E91E8C] shadow-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap"
                >
                    Try it free
                </a>
            </div>
        </section>

        <section class="mt-20 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-start">
            
            <div class="space-y-8">
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-[#4A2C2C]">Why convert HIF to JPG?</h2>
                    <p class="leading-relaxed text-[#6C3F31]">
                        HIF is a modern container used by professional cameras to store <strong class="text-[#7E685E]">10-bit HDR photos</strong>. While they offer better color depth, they often fail to open on web browsers or older editing software.
                    </p>
                    <p class="leading-relaxed text-[#6C3F31]">
                        Mochify converts these into standard 8-bit JPEGs using the advanced <strong class="text-[#7E685E]">Google Jpegli encoder</strong>. This ensures that while the file becomes 8-bit, the 10-bit dynamic range is visually preserved through advanced psychovisual quantization.
                    </p>
                </div>

                <div class="bg-white p-8 rounded-2xl border border-pink-50 shadow-sm">
                    <h3 class="font-bold text-[#4A2C2C] mb-5 text-sm uppercase tracking-widest opacity-70">Supported Camera Models</h3>
                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {#each ['Fuji X-T5 / X-H2', 'Fuji X100VI', 'Canon EOS R5 / R6', 'Canon R3 / 1D X', 'Sony A7 IV / RV', 'Sony Alpha 1'] as camera}
                            <li class="flex items-center gap-3 text-sm font-semibold text-[#6C3F31]">
                                <span class="w-2 h-2 rounded-full bg-[#81C784]"></span> {camera}
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>

            <FaqAccordion {faqs} />
        </div>
        </section>

        <!-- Also available -->
        <section class="mt-16 max-w-4xl mx-auto">
            <p class="text-xs font-black text-[#875F42] uppercase tracking-widest mb-4">Also available</p>
            <div class="grid sm:grid-cols-3 gap-4">
                <a href="/solutions/heif-to-jpg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0 border border-[#C7D2FE]">
                        <svg class="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIF to JPG →</p>
                        <p class="text-xs text-[#875F42]">Any .heif, .heic or .hif file</p>
                    </div>
                </a>
                <a href="/heic-to-jpeg" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                        <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 9l1.5 1.5 3-3.75" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HEIC to JPG →</p>
                        <p class="text-xs text-[#875F42]">The iPhone and iPad lane</p>
                    </div>
                </a>
                <a href="/solutions/hif-to-avif" class="flex items-center gap-4 bg-white border border-pink-50 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                    <span class="w-9 h-9 rounded-xl bg-[#F3F0FF] flex items-center justify-center shrink-0 border border-[#DDD6FE]">
                        <svg class="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    </span>
                    <div>
                        <p class="font-black text-[#4A2C2C] text-sm mb-0.5 group-hover:text-[#F06292] transition-colors">HIF to AVIF →</p>
                        <p class="text-xs text-[#875F42]">Same photos, 10-bit preserved</p>
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