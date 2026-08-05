<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';

    const metadata = {
        title: "Cross-Listing for Resellers: One Set of Photos, Every Marketplace",
        seoTitle: "Cross-Listing Photos - One Set for Every Marketplace",
        description: "Cross-listing apps copy your photos as-is. Photo specs for eBay, Poshmark, Mercari, Depop, and Vinted, plus a batch workflow that preps one set for all.",
        category: "Workflows",
        readTime: "11 min read",
        date: "August 4, 2026"
    };

    const toc = [
        { n: '01', href: '#what-is-cross-listing-and-is-it-allowed', label: 'What is cross-listing, and is it allowed?' },
        { n: '02', href: '#what-cross-listing-apps-actually-do', label: 'What cross-listing apps actually do' },
        { n: '03', href: '#the-photo-gap', label: 'The photo gap no app handles' },
        { n: '04', href: '#cheat-sheet', label: 'Marketplace photo requirements (cheat sheet)' },
        { n: '05', href: '#mochify-workflow', label: 'Mochify Workflow: one set for every marketplace' },
        { n: '06', href: '#faq', label: 'FAQ' },
    ];

    const steps = [
        {
            n: '1',
            h: 'Shoot once, wide',
            body: `Photograph each item at your camera's full resolution with the item centered and room around it. Portrait orientation is the most flexible master, since cropping portrait to square works better than stretching square to portrait.`
        },
        {
            n: '2',
            h: 'Convert iPhone photos first',
            body: `If you shoot HEIC, run the batch through the <a href="https://mochify.app/heic-to-jpeg">HEIC to JPEG converter</a> so every downstream platform accepts the files.`
        },
        {
            n: '3',
            h: 'Export for your square platforms',
            body: `Upload the batch at <a href="https://mochify.app">mochify.app</a> and prompt: "Smart-crop these to square, 1080px, JPEG, strip all metadata." Saliency-guided smart crop keeps the item centered instead of blind-center-cropping, which is exactly the failure mode of letterboxing tools. For big batches the <a href="https://mochify.app/solutions/bulk-ai-square-cropper">Bulk AI Square Cropper</a> does the same job as a dedicated tool. That output covers Depop, Mercari, and Facebook Marketplace.`
        },
        {
            n: '4',
            h: 'Export for your portrait platforms',
            body: `Second prompt on the same originals: "Crop to 3:4 portrait, 1080x1440, JPEG, strip all metadata." That covers Poshmark's new portrait layout and Vinted. (Selling on Vinted specifically? The <a href="https://mochify.app/vinted-seller">Vinted seller tool</a> is tuned to its 1080x1440 recommendation.)`
        },
        {
            n: '5',
            h: 'Export for eBay',
            body: `Third prompt: "Resize to 1600px on the long edge, JPEG, keep under 12MB each." If eBay ever rejects a file outright, the <a href="https://mochify.app/solutions/ebay-image-converter">eBay Image Converter</a> exists precisely for those "file not supported" moments; the companion quick answer on <a href="https://mochify.app/guides/ebay-image-file-not-supported">why eBay rejects image files</a> explains what triggers them.`
        },
        {
            n: '6',
            h: 'Optional: clean backgrounds for covers',
            body: `A clean or transparent background lifts cover photos on cluttered search grids. Background removal is included on every Mochify tier, so prompting "remove the background" on your cover shots costs nothing extra.`
        },
        {
            n: '7',
            h: 'Load the variants into your cross-lister',
            body: `In Vendoo, drop each platform's set into its photo slots; in List Perfectly or Crosslist, upload the correct pre-shaped set per marketplace and their auto-square handling never needs to fire.`
        },
    ];

    const faqs = [
        {
            q: "What is the best cross-listing app?",
            a: "It depends on your marketplaces and volume. Vendoo (from ~$14.99/mo) covers the most US marketplaces with per-platform photo slots; List Perfectly (from ~$29/mo) suits high-volume sellers; Crosslist (~$21/mo annual) is the pick if you need Vinted; Flyp is the budget option for the big four. None of them optimizes photos per platform, so pair any of them with a batch image workflow."
        },
        {
            q: "Is cross-listing allowed on eBay, Poshmark, Mercari, Depop, and Vinted?",
            a: "No major marketplace prohibits listing the same item elsewhere. The rule that matters is availability: delist the item everywhere the moment it sells anywhere. Most cross-listing apps automate this with inventory sync. You must use your own photos; copying another seller's images violates eBay policy and Depop removes listings that use stock photos."
        },
        {
            q: "How do I cross-list from eBay to Poshmark?",
            a: "Either manually (create a new Poshmark listing and re-enter details) or with an app like Vendoo, Flyp, or List Perfectly that copies the listing across. Before you do, reshape your photos: eBay images are usually square or landscape, and Poshmark has displayed listing photos in 3:4 portrait since March 2026, so a straight copy shows up with awkward framing."
        },
        {
            q: "Why do my Poshmark photos suddenly look cropped?",
            a: "Poshmark's March 2026 redesign displays listing photos in portrait 3:4 across search and feeds. Old square photos are automatically framed into the portrait layout, which can trim edges. Your originals are preserved on the listing page, but re-exporting cover photos at 1080x1440 portrait restores control over the framing."
        },
        {
            q: "Does eBay accept HEIC photos from an iPhone?",
            a: "Officially yes, since eBay's supported formats include HEIC and AVIF. In practice sellers regularly report failed HEIC uploads on eBay's forums. Converting to JPEG before upload avoids the problem entirely and guarantees compatibility on Depop, Vinted, and every other platform at the same time."
        },
        {
            q: "How many photos should I use per listing?",
            a: "Use the maximum the platform allows, or close to it: 24 on eBay, up to 16 on Poshmark, 12 on Mercari, 20 on Vinted. More angles mean fewer questions and fewer returns. The first photo carries most of the weight everywhere, since it's the search thumbnail."
        },
        {
            q: "Do cross-listing apps resize or crop photos automatically?",
            a: "Only minimally. Crosslist letterboxes rectangular photos into squares with black borders (with an optional center-crop mode), and List Perfectly adjusts non-square images for 1:1 marketplaces. No cross-listing app re-crops for portrait layouts, converts HEIC, upscales low-resolution images, or compresses to per-platform file limits. That preparation is on you, which is why a batch prompt workflow matters."
        }
    ];

    const related = [
        { href: '/guides/ebay-image-file-not-supported', title: 'Why Does eBay Say My Image File Is Not Supported?', desc: "The specific formats and limits behind eBay's upload errors, and the fast fix." },
        { href: '/guides/do-marketplace-product-images-need-to-be-square', title: 'Do Marketplace Product Images Need to Be Square?', desc: 'The safe-shape default when you sell across platforms.' },
        { href: '/guides/ecommerce-product-photo-workflow-resize-convert', title: 'Ecommerce Product Photo Workflow: Resize & Convert in One Prompt', desc: 'The one-prompt batch pattern this guide builds on.' },
        { href: '/guides/what-image-format-should-i-use-for-product-photos', title: 'What Image Format Should I Use for Product Photos?', desc: 'AVIF, WebP, or JPEG for listings, answered.' },
        { href: '/guides/should-i-optimize-images-before-upload', title: 'Should I Optimize My Images Before I Upload Them?', desc: "Why pre-upload optimization beats trusting the platform's compressor." },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.seoTitle} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.seoTitle} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/cross-listing-marketplace-photo-requirements" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.seoTitle} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Cross-Listing for Resellers: One Set of Photos, Every Marketplace",
        "description": "Cross-listing apps copy your photos as-is. Photo specs for eBay, Poshmark, Mercari, Depop, and Vinted, plus a batch workflow that preps one set for all.",
        "url": "https://mochify.app/guides/cross-listing-marketplace-photo-requirements",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/cross-listing-marketplace-photo-requirements"
        },
        "datePublished": "2026-08-04",
        "dateModified": "2026-08-05",
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
            { "@type": "Thing", "name": "cross-listing" },
            { "@type": "Thing", "name": "eBay" },
            { "@type": "Thing", "name": "Poshmark" },
            { "@type": "Thing", "name": "Mercari" },
            { "@type": "Thing", "name": "Depop" },
            { "@type": "Thing", "name": "Vinted" },
            { "@type": "Thing", "name": "product photography" },
            { "@type": "Thing", "name": "marketplace selling" }
        ],
        "keywords": "cross listing, cross listing app, crosslisting, marketplace photo requirements, reseller photos, poshmark portrait photos, depop photo size",
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
            { "@type": "ListItem", "position": 3, "name": "Cross-Listing for Resellers: One Set of Photos, Every Marketplace", "item": "https://mochify.app/guides/cross-listing-marketplace-photo-requirements" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "What is the best cross-listing app?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on your marketplaces and volume. Vendoo (from ~$14.99/mo) covers the most US marketplaces with per-platform photo slots; List Perfectly (from ~$29/mo) suits high-volume sellers; Crosslist (~$21/mo annual) is the pick if you need Vinted; Flyp is the budget option for the big four. None of them optimizes photos per platform, so pair any of them with a batch image workflow." } },
            { "@type": "Question", "name": "Is cross-listing allowed on eBay, Poshmark, Mercari, Depop, and Vinted?", "acceptedAnswer": { "@type": "Answer", "text": "No major marketplace prohibits listing the same item elsewhere. The rule that matters is availability: delist the item everywhere the moment it sells anywhere. Most cross-listing apps automate this with inventory sync. You must use your own photos; copying another seller's images violates eBay policy and Depop removes listings that use stock photos." } },
            { "@type": "Question", "name": "How do I cross-list from eBay to Poshmark?", "acceptedAnswer": { "@type": "Answer", "text": "Either manually (create a new Poshmark listing and re-enter details) or with an app like Vendoo, Flyp, or List Perfectly that copies the listing across. Before you do, reshape your photos: eBay images are usually square or landscape, and Poshmark has displayed listing photos in 3:4 portrait since March 2026, so a straight copy shows up with awkward framing." } },
            { "@type": "Question", "name": "Why do my Poshmark photos suddenly look cropped?", "acceptedAnswer": { "@type": "Answer", "text": "Poshmark's March 2026 redesign displays listing photos in portrait 3:4 across search and feeds. Old square photos are automatically framed into the portrait layout, which can trim edges. Your originals are preserved on the listing page, but re-exporting cover photos at 1080x1440 portrait restores control over the framing." } },
            { "@type": "Question", "name": "Does eBay accept HEIC photos from an iPhone?", "acceptedAnswer": { "@type": "Answer", "text": "Officially yes, since eBay's supported formats include HEIC and AVIF. In practice sellers regularly report failed HEIC uploads on eBay's forums. Converting to JPEG before upload avoids the problem entirely and guarantees compatibility on Depop, Vinted, and every other platform at the same time." } },
            { "@type": "Question", "name": "How many photos should I use per listing?", "acceptedAnswer": { "@type": "Answer", "text": "Use the maximum the platform allows, or close to it: 24 on eBay, up to 16 on Poshmark, 12 on Mercari, 20 on Vinted. More angles mean fewer questions and fewer returns. The first photo carries most of the weight everywhere, since it's the search thumbnail." } },
            { "@type": "Question", "name": "Do cross-listing apps resize or crop photos automatically?", "acceptedAnswer": { "@type": "Answer", "text": "Only minimally. Crosslist letterboxes rectangular photos into squares with black borders (with an optional center-crop mode), and List Perfectly adjusts non-square images for 1:1 marketplaces. No cross-listing app re-crops for portrait layouts, converts HEIC, upscales low-resolution images, or compresses to per-platform file limits. That preparation is on you, which is why a batch prompt workflow matters." } }
        ]
        }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-[#F06292] text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Cross-Listing for Resellers: One Set of Photos, Every Marketplace
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Cross-listing is how serious resellers grow: the same item, listed on eBay, Poshmark, Mercari, Depop, and Vinted at once, so it sells wherever the buyer happens to be. Cross-listing apps have made the text side of this nearly effortless. The photo side is another story. Every marketplace wants a different shape, a different size, and a different file format, and the apps mostly copy your photos as-is and hope for the best. This guide covers what cross-listing actually involves, what the apps do and don't handle, the current photo requirements for six marketplaces, and a batch workflow that preps one photo set for all of them in minutes.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published August 4, 2026 by the Mochify Engineering Team.</strong>
                Written for resellers who list everywhere: what the cross-listing apps handle, what they leave to you, and the fastest way to close the gap.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-4 border border-pink-100 shadow-inner" aria-label="Table of contents">
                <ul class="space-y-3">
                    {#each toc as item}
                        <li>
                            <a href={item.href} class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                                <span class="flex items-center gap-4">
                                    <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">{item.n}</span>
                                    <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                                </span>
                                <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </section>

        <!-- 01 -->
        <section id="what-is-cross-listing-and-is-it-allowed" class="scroll-mt-24">
            <SectionHeading>What is cross-listing, and is it allowed?</SectionHeading>
            <p>Cross-listing means publishing the same item for sale on two or more marketplaces at the same time, then removing it everywhere the moment it sells anywhere. No major marketplace prohibits listing an item elsewhere; the obligation you take on is availability, which is why the delist-on-sale habit is the one rule every experienced reseller treats as non-negotiable.</p>
            <p>It's worth doing because the buyer pools genuinely differ. The US secondhand apparel market grew 14% in 2024, its strongest year since 2021, and is projected to reach $74 billion by 2029 according to <a href="https://newsroom.thredup.com/news/thredup-13th-resale-report" target="_blank" rel="noopener noreferrer">ThredUp's 2025 Resale Report</a>. A vintage band tee might sit for weeks on eBay and sell in a day on Depop; a mid-range handbag usually runs the other way. Listing everywhere is how you find out.</p>
            <p>The catch is workload. A full manual listing takes most sellers somewhere between 20 and 40 minutes, and re-listing the same item on each additional platform adds several more minutes per marketplace. Multiply by a 200-item closet and the appeal of automation is obvious.</p>
            <InfoBox type="warning" title="Use your own photos">
                One caution before you automate: eBay's <a href="https://www.ebay.com/help/policies/listing-policies/images-videos-text-policy?id=4240" target="_blank" rel="noopener noreferrer">images and text policy</a> requires that you use your own photos and descriptions. Cross-listing your own originals is fine. Copying another seller's photos, even for an identical item, is not.
            </InfoBox>
        </section>

        <!-- 02 -->
        <section id="what-cross-listing-apps-actually-do" class="scroll-mt-24">
            <SectionHeading>What cross-listing apps actually do (and what they cost)</SectionHeading>
            <p>Cross-listing apps copy your listing data (title, description, price, category mappings, and photos) from one marketplace form to another, and most add inventory sync so a sale on one platform delists the item from the rest. As of July 2026 the main players are:</p>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">App</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Price (from)</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Marketplaces</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">What it does with photos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Vendoo</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~$14.99/mo</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~10 (eBay, Poshmark, Mercari, Depop, Grailed, Facebook, Etsy, more)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Manual: separate photo slots per marketplace; you supply the variants</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">List Perfectly</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~$29/mo</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">11 (adds Kidizen, Vestiaire, Shopify, Whatnot)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Hosts up to 30 images; auto-adjusts non-square images for 1:1 marketplaces</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Crosslist</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~$21/mo (annual)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">11+ (including Vinted)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Letterboxes rectangular photos to square with black borders (or center-crops)</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] font-bold">Flyp</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Free 100 days, then ~$9/mo</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">4 (eBay, Poshmark, Mercari, Depop)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Copies photos as-is</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
            <p>Prices and features are from each vendor's own site, accessed July 2026, and change often; treat them as ballparks. All four are good at what they promise: moving listing data around. List Perfectly claims sellers list "80% faster" with it, and even discounting a vendor's own number, the time savings on the text side are real.</p>
            <p>Whether any of these subscriptions earns its place depends on your volume more than its feature list. We work through <a href="/guides/is-reselling-worth-it">whether the reselling math works at your volume</a> separately, including where a paid tool starts paying for itself.</p>
        </section>

        <!-- 03 -->
        <section id="the-photo-gap" class="scroll-mt-24">
            <SectionHeading>The photo gap: what no cross-listing app handles</SectionHeading>
            <p>Here's the honest version: cross-listing apps move your photos between platforms, but none of them optimizes photos for each platform. The most any of them does is force a square. Crosslist <a href="https://docs.crosslist.com/knowledge-base/image-management/cropping-strategy" target="_blank" rel="noopener noreferrer">documents its approach openly</a>: rectangular images going to a square-format marketplace get black letterbox borders, with a setting to zoom-crop instead. List Perfectly similarly adjusts non-square images for marketplaces that require 1:1. That's the ceiling.</p>
            <p>What none of them does:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Re-crop for portrait platforms.</strong> Poshmark moved its entire display layer to 3:4 portrait in March 2026 (<a href="https://blog.poshmark.com/2026/03/25/your-guide-to-portrait-photos/" target="_blank" rel="noopener noreferrer">Poshmark's own guide</a> covers the change), and Vinted has recommended portrait framing for years. A square-letterboxed photo is now the wrong shape on both.</li>
                <li><strong class="text-[#4A2C2C]">Convert formats.</strong> iPhone cameras shoot HEIC by default. eBay officially accepts HEIC, but its community forums carry years of threads from sellers whose <a href="https://community.ebay.com/t5/Report-eBay-Technical-Issues/Allowing-HEIC-format-image-files-to-be-compatible-and-posted-on/td-p/33375274" target="_blank" rel="noopener noreferrer">HEIC uploads fail anyway</a>; the standard workaround is converting to JPEG before upload. Depop and Vinted are stricter still.</li>
                <li><strong class="text-[#4A2C2C]">Hit resolution and file-size targets.</strong> eBay wants at least 500x500px and caps files at 12MB. <a href="/guides/etsy-listing-photo-size-guide">Etsy wants 2000px and files under 1MB</a>. One photo cannot be both unless something re-encodes it.</li>
            </ul>
            <p>The result is familiar to anyone who cross-lists at volume: listings that look sharp on the platform you photographed for and mediocre everywhere else. eBay's own research on 6.8 million listings found that better photo quality made items measurably more likely to sell (the widely cited figure is 4.5%; it dates from an older eBay study, so treat it as directional). Photo quality is not cosmetic. It's conversion.</p>
            <p>If your photos start life as iPhone HEIC files, fix that first: the <a href="https://mochify.app/heic-to-jpeg">HEIC to JPEG converter</a> turns them into universally accepted JPEGs in one step.</p>
        </section>

        <!-- 04 -->
        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Marketplace photo requirements compared (cheat sheet)</SectionHeading>
            <p>Requirements below are from each marketplace's official documentation where it exists, accessed July 2026. Where a marketplace publishes no hard spec, we note the commonly reported figure.</p>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[720px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Marketplace</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Photos per listing</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Shape that wins</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Size guidance</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">File limits &amp; formats</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">eBay</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Up to 24</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1:1 or 16:9</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Min 500x500px; ~1600px recommended</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">12MB; JPEG, PNG, WebP, HEIC, AVIF, TIFF, BMP, GIF (<a href="https://www.ebay.com/help/selling/listings/adding-pictures-listings?id=4148" target="_blank" rel="noopener noreferrer">eBay photo rules</a>)</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Poshmark</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Up to 16 (commonly cited)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">3:4 portrait since March 2026</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~1000px+</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Square photos get auto-framed to portrait</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Mercari</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Up to 12</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Square-leaning grid</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">No official spec; ~1080px works well</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">First photo is your cover (<a href="https://www.mercari.com/us/help_center/topics/listing/guides/creating-a-listing/" target="_blank" rel="noopener noreferrer">Mercari listing guide</a>)</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Depop</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">4 (commonly reported; 8 rolling out)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Square 1:1; non-square gets cropped</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1080x1080px typical</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Original photos required; stock images get listings removed</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Vinted</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Up to 20</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">3:4 portrait</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1080x1440px recommended</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">10MB; JPEG/PNG</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] font-bold">Facebook Marketplace</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Up to 10 (commonly cited)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Square-safe</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">~1200x1200px</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">JPEG/PNG</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
            <p>Three things jump out of that table. First, no two platforms agree. Second, the shape question alone splits three ways: square for Depop and Mercari, portrait for Poshmark and Vinted, flexible for eBay. Third, the first photo matters most everywhere, because every platform uses it as the search thumbnail, and several crop it differently in search than on the listing page.</p>
            <p>Shooting advice follows directly: photograph with generous negative space around the item, so the same frame survives a square crop and a portrait crop. For the platforms that crop aggressively, our quick answer on <a href="https://mochify.app/guides/do-marketplace-product-images-need-to-be-square">whether marketplace product images need to be square</a> covers the safe default.</p>
        </section>

        <!-- 05 Mochify Workflow -->
        <section id="mochify-workflow" class="scroll-mt-24">
            <SectionHeading>Mochify Workflow: prep one photo set for every marketplace</SectionHeading>
            <p>The efficient pattern is the one professional studios use: shoot once at high resolution, then export per destination. With Magic Flow, each export is a plain-English batch prompt rather than a session in an image editor.</p>

            <div class="space-y-4 my-6">
                {#each steps as step}
                    <div class="flex items-start gap-4 rounded-2xl border border-pink-100 bg-white p-5">
                        <span class="w-9 h-9 shrink-0 rounded-full bg-pink-50 flex items-center justify-center text-sm font-black text-[#F06292] border border-pink-100">{step.n}</span>
                        <div>
                            <h3 class="font-black text-[#4A2C2C] text-lg mb-1 mt-0">{step.h}</h3>
                            <p class="text-base text-[#6C3F31] m-0">{@html step.body}</p>
                        </div>
                    </div>
                {/each}
            </div>

            <InfoBox type="tip" title="Be deliberate about EXIF">
                Note the "strip all metadata" line in the prompts: it's stated explicitly because you should always be deliberate about EXIF. Your phone embeds GPS coordinates in every photo, and your home address has no business in a marketplace listing.
            </InfoBox>

            <p class="text-sm text-[#875F42]">A privacy note on how this works: image processing happens on Mochify's servers. Your photos travel over HTTPS to api.mochify.app, are processed in RAM, and are wiped immediately after encoding, with no disk writes and no logs containing file data. Batch sizes run up to 25 files on the Seller and Pro tiers (3 per batch on Free), which fits a full listing's photo set for every platform in one pass.</p>
        </section>

        <!-- FAQ -->
        <GuideFAQs items={faqs} />

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3 mt-0">One shoot, every marketplace</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base">Three prompts per shoot batch, a few minutes total, and every marketplace gets photos shaped for its layout instead of one platform's leftovers. Upload your next batch and try <em>"smart-crop these to square, 1080px, JPEG, strip all metadata"</em> for yourself.</p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Open Magic Flow →
            </a>
        </div>

        <!-- Related guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <ul class="space-y-3">
                {#each related as guide}
                    <li>
                        <a href={guide.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="text-sm text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{guide.title} <span class="font-normal opacity-70">· {guide.desc}</span></span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                {/each}
            </ul>
        </section>

    </div>
</article>
