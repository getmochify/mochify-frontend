<script lang="ts">
    import { imageTools, videoTools, solutionCategories, type SolutionTool } from '$lib/data/solutions';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const metaDescription =
        'Free one-job image tools: HEIC, HIF and AVIF to JPG, JPEG XL, background removal, square crop, images to PDF, MP4 to WebM. 3 images a month with no signup.';

    // Cards grouped under a heading each, rather than 20 flat H2s. The order and
    // the group names match the "Which tool do I need?" section below, so a tool
    // named there sits in the group a reader would look for it in.
    const grouped = solutionCategories
        .map((category) => ({
            category,
            tools: [...imageTools, ...videoTools].filter((t) => t.category === category)
        }))
        .filter((g) => g.tools.length > 0);

    // "Which tool do I need?": the job first, the tool second. Each entry is a
    // sentence with the links inline, because the answer is usually "this one,
    // unless X", not a bare list of product names.
    const chooser: { heading: string; items: { text: string; links: { href: string; label: string }[] }[] }[] = [
        {
            heading: 'Photos that will not open',
            items: [
                {
                    text: 'A photo from an iPhone or iPad (.HEIC): {0}. Want them in one document: {1}.',
                    links: [
                        { href: '/heic-to-jpeg', label: 'HEIC to JPG' },
                        { href: '/solutions/heif-to-pdf', label: 'HEIC and HEIF to PDF' }
                    ]
                },
                {
                    text: 'A photo from a Canon, Sony or Fujifilm camera (.HIF): {0}, or {1} to keep the 10-bit color.',
                    links: [
                        { href: '/solutions/hif-to-jpg', label: 'HIF to JPG' },
                        { href: '/solutions/hif-to-avif', label: 'HIF to AVIF' }
                    ]
                },
                {
                    text: 'A plain .heif, or a mix of .heif, .heic and .hif: {0}.',
                    links: [{ href: '/solutions/heif-to-jpg', label: 'HEIF to JPG' }]
                },
                {
                    text: 'An AVIF someone sent you: {0}.',
                    links: [{ href: '/avif-to-jpg', label: 'AVIF to JPG' }]
                }
            ]
        },
        {
            heading: 'Smaller files for the web',
            items: [
                {
                    text: 'JPEG XL: {0} (with a lossless option), {1} and {2}. Browser support for JPEG XL is still uneven, so read {3} before you switch a site over.',
                    links: [
                        { href: '/solutions/png-to-jxl', label: 'PNG to JXL' },
                        { href: '/jpg-to-jpegxl', label: 'JPG to JXL' },
                        { href: '/avif-to-jpegxl', label: 'AVIF to JXL' },
                        {
                            href: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl',
                            label: 'WebP, AVIF or JPEG XL?'
                        }
                    ]
                },
                {
                    text: 'Logos, icons and illustrations: {0}, {1} or {2}.',
                    links: [
                        { href: '/solutions/svg-to-webp', label: 'SVG to WebP' },
                        { href: '/solutions/svg-to-avif', label: 'SVG to AVIF' },
                        { href: '/solutions/svg-to-jxl', label: 'SVG to JPEG XL' }
                    ]
                }
            ]
        },
        {
            heading: 'Product and marketplace photos',
            items: [
                {
                    text: 'A square crop for every photo in a batch, centered on the subject: {0}.',
                    links: [{ href: '/solutions/bulk-ai-square-cropper', label: 'Bulk Square Cropper' }]
                },
                {
                    text: 'A cutout on a transparent background: {0} or {1}. Background removal is on every plan, including Free.',
                    links: [
                        { href: '/solutions/remove-background-webp', label: 'Background Remover (WebP)' },
                        { href: '/solutions/remove-background-avif', label: '(AVIF)' }
                    ]
                },
                {
                    text: 'eBay says "file not supported" or the file is too big: {0}.',
                    links: [{ href: '/solutions/ebay-image-converter', label: 'eBay Image Resizer and Converter' }]
                }
            ]
        },
        {
            heading: 'HDR',
            items: [
                {
                    text: 'Give a photo Ultra HDR highlights on HDR screens: {0}.',
                    links: [{ href: '/solutions/sdr-to-hdr', label: 'SDR to HDR' }]
                }
            ]
        },
        {
            heading: 'PDFs',
            items: [
                {
                    text: 'Turn images into one PDF: {0}, {1} or {2}. The free plan builds a PDF from up to 3 images, and every paid plan and the Day Pass take up to 20.',
                    links: [
                        { href: '/solutions/webp-to-pdf', label: 'WebP to PDF' },
                        { href: '/solutions/jxl-to-pdf', label: 'JXL to PDF' },
                        { href: '/solutions/heif-to-pdf', label: 'HEIC and HEIF to PDF' }
                    ]
                }
            ]
        },
        {
            heading: 'Video',
            items: [
                {
                    text: '{0} and {1} run in your browser; the video never leaves your device.',
                    links: [
                        { href: '/solutions/mp4-to-webm', label: 'MP4 to WebM' },
                        { href: '/solutions/webm-to-mp4', label: 'WebM to MP4' }
                    ]
                }
            ]
        }
    ];

    /** Splits "a {0} b {1} c" into the literal runs between the placeholders. */
    const runs = (text: string) => text.split(/\{\d\}/);

    const faqs: FaqItem[] = [
        {
            q: 'Are these image converters free?',
            a: [
                'Yes, within the free allowance: 3 images a month with no signup and 25 a month with a free account, up to 20MB each and 3 files per batch. A Day Pass gives you 100 uploads in 24 hours for $2 with no account, and the paid plans raise the monthly allowance, file size and batch size; the ',
                { href: '/pricing', label: 'pricing page' },
                ' has the details in your currency.'
            ]
        },
        {
            q: 'Do I need to install anything or sign up?',
            a: 'No. Every tool here runs in your browser on Windows, Mac, Linux, iPhone or Android, and your first 3 images a month need no account. The CLI and MCP server are optional, for people who want to convert from a terminal or an AI agent, and so is the Chrome extension, for images you find on web pages.'
        },
        {
            q: 'Are my files uploaded?',
            a: 'Images and PDFs are: they travel over HTTPS to our encoder, are processed in memory and are discarded when the job finishes, with nothing written to disk. Video is not: MP4 to WebM runs entirely in your browser.'
        },
        {
            q: 'Can I convert a whole folder at once?',
            a: 'Up to 3 files per batch on the free plan, and 25 per batch on Seller, Pro and Growth, at up to 75MB each. For a folder of any size, the Mochify CLI converts a whole directory from one prompt.'
        },
        {
            q: 'What if the conversion I need is not listed here?',
            a: [
                'Use ',
                { href: '/flow', label: 'Magic Flow' },
                ': describe what you want, such as a format, a size, a crop or a background removal, and it does the job, several steps at once if you ask. Each tool page is one of those jobs made into a fixed button.'
            ]
        },
        {
            q: 'Which image format should I convert to?',
            a: [
                'JPG when the file has to open everywhere, WebP or AVIF when it is going on a website, and PNG or a lossless format when every pixel must survive. ',
                {
                    href: '/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl',
                    label: 'WebP, AVIF or JPEG XL?'
                },
                ' compares them.'
            ]
        }
    ];

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };
</script>

<svelte:head>
    <title>Free Image Converters: HEIC, HIF, AVIF, JXL, PDF | Mochify</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content="Free Image Converters and Tools - Mochify" />
    <meta property="og:description" content={metaDescription} />
    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Mochify Image Optimization Tools",
        "description": "A collection of specialized image converters and optimizers for eBay, mobile, and web performance.",
        "itemListElement": [
            {
            "@type": "ListItem",
            "position": 1,
            "name": "eBay Image Resizer and Converter",
            "url": "https://mochify.app/solutions/ebay-image-converter"
            },
            {
            "@type": "ListItem",
            "position": 2,
            "name": "HEIC to JPG Converter",
            "url": "https://mochify.app/heic-to-jpeg"
            },
            {
            "@type": "ListItem",
            "position": 3,
            "name": "AVIF to JXL",
            "url": "https://mochify.app/avif-to-jpegxl"
            },
            {
            "@type": "ListItem",
            "position": 4,
            "name": "JPG to JXL",
            "url": "https://mochify.app/jpg-to-jpegxl"
            },
            {
            "@type": "ListItem",
            "position": 5,
            "name": "HIF to JPG Converter",
            "url": "https://mochify.app/solutions/hif-to-jpg"
            },
            {
            "@type": "ListItem",
            "position": 6,
            "name": "PNG to JXL",
            "url": "https://mochify.app/solutions/png-to-jxl"
            },
            {
            "@type": "ListItem",
            "position": 7,
            "name": "HEIF to JPG Converter",
            "url": "https://mochify.app/solutions/heif-to-jpg"
            },
            {
            "@type": "ListItem",
            "position": 8,
            "name": "SDR to HDR Converter",
            "url": "https://mochify.app/solutions/sdr-to-hdr"
            }
        ]
        }
    </script>

    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>
<div class="relative max-w-5xl mx-auto px-4 pt-8 pb-16 sm:px-6 lg:px-8 w-full flex-grow">

        <!-- The lead-in has to earn its place without pushing the first row of
             cards off a phone screen, so it stays one paragraph and the hero
             spacing is tighter than the tool pages'. -->
        <div class="text-center mb-8 space-y-4">
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-black text-[#4A2C2C] tracking-tight">
                Image Converters and <span class="text-[#F06292]">Tools</span>
            </h1>
            <p class="text-base sm:text-lg text-[#6C3F31] font-medium max-w-3xl mx-auto leading-relaxed">
                Each tool here does one job. Drop your files in and download the result: HEIC, HIF or AVIF to JPG, a JPEG XL encode, a transparent cutout, a square crop, a PDF. There is no prompt to write, and most pages have nothing to set. Three images a month need no signup, a free account gives you 25, and images and PDFs are processed in memory, never saved to disk. Need something that is not listed? Describe it in <a href="/flow" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">Magic Flow</a>.
            </p>
        </div>

        {#snippet toolCard(tool: SolutionTool)}
            <a
                href="/{tool.slug}"
                class="group bg-white p-8 rounded-2xl border border-pink-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
                <div class="flex justify-between items-start mb-6">
                    <div class="w-10 h-10 rounded-xl bg-[#FFF0F3] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <svg class="w-5 h-5 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            {#each tool.iconPaths as d}
                                <path stroke-linecap="round" stroke-linejoin="round" {d} />
                            {/each}
                        </svg>
                    </div>
                    <span class="px-3 py-1 rounded-xl bg-[#F1F8E9] text-[#33691E] text-[10px] font-black uppercase tracking-widest border border-[#DCEDC8]">
                        {tool.tag}
                    </span>
                </div>

                <h3 class="text-xl font-black text-[#4A2C2C] mb-3 group-hover:text-[#F06292] transition-colors">
                    {tool.name}
                </h3>
                <p class="text-sm text-[#6C3F31] leading-relaxed mb-6 opacity-90">
                    {tool.desc}
                </p>

                <div class="mt-auto flex items-center gap-2 text-xs font-black text-[#F06292] uppercase tracking-wider">
                    Open Tool
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </div>
            </a>
        {/snippet}

        {#each grouped as group (group.category)}
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">{group.category}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {#each group.tools as tool (tool.slug)}
                    {@render toolCard(tool)}
                {/each}
            </div>
        {/each}

        <section class="mt-8">
            <h2 class="text-3xl font-black text-[#4A2C2C] mb-8">Which tool do I need?</h2>
            <div class="grid md:grid-cols-2 gap-6 items-start">
                {#each chooser as block (block.heading)}
                    <div class="bg-white p-7 rounded-2xl border border-pink-50 shadow-sm">
                        <h3 class="font-black text-[#4A2C2C] mb-4">{block.heading}</h3>
                        <ul class="space-y-3">
                            {#each block.items as item}
                                <li class="flex gap-3 text-sm text-[#6C3F31] leading-relaxed">
                                    <span class="mt-2 w-1.5 h-1.5 rounded-full bg-[#F06292] shrink-0"></span>
                                    <span
                                        >{#each runs(item.text) as run, i}{run}{#if item.links[i]}<a
                                                    href={item.links[i].href}
                                                    class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors"
                                                    >{item.links[i].label}</a
                                                >{/if}{/each}</span
                                    >
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>
        </section>

        <section class="mt-20 max-w-3xl space-y-4">
            <h2 class="text-2xl font-black text-[#4A2C2C]">Tool pages, Magic Flow or the API?</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                A tool page is the quickest route when the job matches it: one fixed conversion, nothing to learn. For anything else, <a href="/flow" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">Magic Flow</a> takes a plain-English instruction such as "Remove the background, transparent PNG" or "Square crop and optimize for eBay" and does the job in one pass. In Chrome, the <a href="/chrome-extension" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">Mochify extension</a> adds a right-click "Convert to" menu for any image on a web page. For folders and automation, the Mochify CLI, the hosted and local MCP servers and the REST API run the same encoder; the <a href="/docs" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">API documentation</a> has every parameter.
            </p>
        </section>

        <section class="mt-16 max-w-3xl space-y-4">
            <h2 class="text-2xl font-black text-[#4A2C2C]">What happens to your files</h2>
            <p class="leading-relaxed text-[#6C3F31]">
                Images and PDFs travel over HTTPS to api.mochify.app, are processed in memory and discarded as soon as the job finishes. Nothing is written to disk, nothing containing your files is logged, and nothing is used to train AI. Metadata, including GPS location, is stripped by default. Video conversion runs in your browser, so the video never leaves your device. The <a href="/architecture" class="font-black text-[#F06292] hover:text-[#D81B60] transition-colors">architecture page</a> has the detail.
            </p>
        </section>

        <section class="mt-20">
            <h2 class="text-2xl font-black text-[#4A2C2C] mb-6">Frequently asked questions</h2>
            <FaqAccordion {faqs} class="grid md:grid-cols-2 gap-4 items-start" />
        </section>

        <div class="mt-16 text-center">
            <a href="/flow" class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFF5F7] text-[#F06292] font-black hover:bg-pink-50 transition-all active:scale-95 border border-pink-100 shadow-sm">
                Open Magic Flow
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
        </div>
    </div>
