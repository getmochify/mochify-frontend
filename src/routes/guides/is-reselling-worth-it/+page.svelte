<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';

    const metadata = {
        title: "Is Reselling Worth It in 2026? The Honest Math",
        seoTitle: "Is Reselling Worth It? The Honest Math for 2026",
        description: "Is reselling worth it in 2026? The honest math: market data, time per listing, tool costs, and when a free photo workflow beats a paid one.",
        category: "Workflows",
        readTime: "14 min read",
        date: "July 23, 2026"
    };

    const toc = [
        { n: '01', href: '#the-short-answer', label: 'The Short Answer' },
        { n: '02', href: '#the-resale-market-in-2026', label: 'The Resale Market in 2026' },
        { n: '03', href: '#where-your-time-actually-goes', label: 'Where Your Time Actually Goes' },
        { n: '04', href: '#the-photo-pipeline', label: 'The Photo Pipeline' },
        { n: '05', href: '#what-reseller-tools-cost', label: 'What Reseller Tools Cost' },
        { n: '06', href: '#when-free-is-enough', label: 'When Free Is Genuinely Enough' },
        { n: '07', href: '#mochify-workflow', label: 'Mochify Workflow' },
        { n: '08', href: '#cheat-sheet', label: 'Cheat Sheet' },
        { n: '09', href: '#faq', label: 'FAQ' },
    ];

    const faqs = [
        {
            q: "Is reselling still profitable in 2026?",
            a: "Yes, for sellers who control their time per listing. US resale reached $55.5 billion in 2025 and is projected to hit $78.8 billion by 2030 per ThredUp's 14th Annual Resale Report, so demand is not the constraint. Profitability per hour is decided by sourcing margin and listing speed."
        },
        {
            q: "How much do resellers actually make?",
            a: "There is no reliable audited average; incomes range from beer money to full-time livings. The controllable variables are net margin per item and listings per hour. A seller netting $12 an item at 30 minutes of total labor per item makes roughly $24/hour; cutting labor to 15 minutes doubles that without sourcing a single better item."
        },
        {
            q: "How many photos should a reselling listing have?",
            a: "Use most of what the platform allows: eBay permits up to 24 photos, Vinted and Etsy 20, Poshmark up to 16 (commonly cited), Mercari 12. In practice 8-12 well-lit photos per item covers condition, labels, flaws, and detail shots. More angles reduce returns and disputes."
        },
        {
            q: "Do I need a cross-listing app to resell?",
            a: "Not at low volume. Below roughly 5 active listings a week, manual cross-posting (about 5 minutes per extra platform) is cheaper than $9-29/month. Above that, cross-listers earn their fee - but remember they copy photos as-is; per-platform photo sizing and conversion still has to happen before the cross-lister gets them."
        },
        {
            q: "What is the cheapest way to process reselling photos?",
            a: "For a few listings a month, a free tool: Mochify's Free tier processes 25 images a month (20MB max, batches of 3) at no cost, including background removal. For bursts, a $5 Credit Pack covers 100 images with no expiry. A subscription only makes sense once you hit the monthly cap repeatedly."
        },
        {
            q: "Is the Mochify Seller plan worth it for resellers?",
            a: "Only at real volume: if you process 200+ photos a month, Seller ($7.99/month) replaces roughly 3+ hours of one-at-a-time editing with a few batch rounds of 25 files each, and raises limits to 300 images/month at 75MB per file. Below ~25 photos a month, stay on Free - it is the same engine."
        },
        {
            q: "Do marketplace photos need to be square?",
            a: "Search thumbnails are usually cropped to 1:1 even when listing photos are not, so square-safe framing matters everywhere - except Vinted and Poshmark, which now display portrait 3:4. See our guide on marketplace square image requirements for the per-platform detail."
        },
        {
            q: "Does converting iPhone HEIC photos lose quality for listings?",
            a: "Converting HEIC to JPEG once, at high quality, is visually lossless for listing purposes and eliminates the compatibility failures some marketplaces still have with HEIC uploads. Do the conversion in the same batch pass as your resize and compression so it adds no extra step."
        }
    ];

    const related = [
        { href: '/guides/ecommerce-product-photo-workflow-resize-convert', title: 'Ecommerce Product Photo Workflow: Resize & Convert in One Prompt', desc: "The one-prompt batch workflow this guide's pipeline is built on." },
        { href: '/guides/ebay-image-file-not-supported', title: 'Why Does eBay Say My Image File Is Not Supported?', desc: 'The formats eBay accepts and why uploads fail.' },
        { href: '/guides/do-marketplace-product-images-need-to-be-square', title: 'Do Marketplace Product Images Need to Be Square?', desc: 'Per-platform thumbnail and aspect-ratio rules.' },
        { href: '/guides/jpeg-in-2026-jpegli', title: 'Jpegli Guide 2026: Quality-Per-Byte', desc: 'Why the JPEG encoder behind your listing photos matters.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.seoTitle} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <link rel="canonical" href="https://mochify.app/guides/is-reselling-worth-it" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.seoTitle} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/is-reselling-worth-it" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.seoTitle} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Is Reselling Worth It in 2026? The Honest Math",
        "description": "Is reselling worth it in 2026? The honest math: market data, time per listing, tool costs, and when a free photo workflow beats a paid one.",
        "url": "https://mochify.app/guides/is-reselling-worth-it",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/is-reselling-worth-it"
        },
        "datePublished": "2026-07-23",
        "dateModified": "2026-07-23",
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
            "@type": "WebSite",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "about": [
            { "@type": "Thing", "name": "reselling" },
            { "@type": "Thing", "name": "online marketplaces" },
            { "@type": "Thing", "name": "eBay" },
            { "@type": "Thing", "name": "Vinted" },
            { "@type": "Thing", "name": "Poshmark" },
            { "@type": "Thing", "name": "cross-listing apps" },
            { "@type": "Thing", "name": "product photography" },
            { "@type": "Thing", "name": "batch image processing" }
        ],
        "keywords": "is reselling worth it, how much do resellers make, reseller tools, reselling side hustle, cross listing apps, reseller photo workflow",
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
            { "@type": "ListItem", "position": 3, "name": "Is Reselling Worth It in 2026? The Honest Math", "item": "https://mochify.app/guides/is-reselling-worth-it" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Is Reselling Worth It in 2026? The Honest Math",
        "url": "https://mochify.app/guides/is-reselling-worth-it",
        "description": "Is reselling worth it in 2026? The honest math: market data, time per listing, tool costs, and when a free photo workflow beats a paid one.",
        "isPartOf": { "@type": "WebSite", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-07-23",
        "dateModified": "2026-07-23"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "Is reselling still profitable in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, for sellers who control their time per listing. US resale reached $55.5 billion in 2025 and is projected to hit $78.8 billion by 2030 per ThredUp's 14th Annual Resale Report, so demand is not the constraint. Profitability per hour is decided by sourcing margin and listing speed." } },
            { "@type": "Question", "name": "How much do resellers actually make?", "acceptedAnswer": { "@type": "Answer", "text": "There is no reliable audited average; incomes range from beer money to full-time livings. The controllable variables are net margin per item and listings per hour. A seller netting $12 an item at 30 minutes of total labor per item makes roughly $24/hour; cutting labor to 15 minutes doubles that without sourcing a single better item." } },
            { "@type": "Question", "name": "How many photos should a reselling listing have?", "acceptedAnswer": { "@type": "Answer", "text": "Use most of what the platform allows: eBay permits up to 24 photos, Vinted and Etsy 20, Poshmark up to 16 (commonly cited), Mercari 12. In practice 8-12 well-lit photos per item covers condition, labels, flaws, and detail shots. More angles reduce returns and disputes." } },
            { "@type": "Question", "name": "Do I need a cross-listing app to resell?", "acceptedAnswer": { "@type": "Answer", "text": "Not at low volume. Below roughly 5 active listings a week, manual cross-posting (about 5 minutes per extra platform) is cheaper than $9-29/month. Above that, cross-listers earn their fee - but remember they copy photos as-is; per-platform photo sizing and conversion still has to happen before the cross-lister gets them." } },
            { "@type": "Question", "name": "What is the cheapest way to process reselling photos?", "acceptedAnswer": { "@type": "Answer", "text": "For a few listings a month, a free tool: Mochify's Free tier processes 25 images a month (20MB max, batches of 3) at no cost, including background removal. For bursts, a $5 Credit Pack covers 100 images with no expiry. A subscription only makes sense once you hit the monthly cap repeatedly." } },
            { "@type": "Question", "name": "Is the Mochify Seller plan worth it for resellers?", "acceptedAnswer": { "@type": "Answer", "text": "Only at real volume: if you process 200+ photos a month, Seller ($7.99/month) replaces roughly 3+ hours of one-at-a-time editing with a few batch rounds of 25 files each, and raises limits to 300 images/month at 75MB per file. Below ~25 photos a month, stay on Free - it is the same engine." } },
            { "@type": "Question", "name": "Do marketplace photos need to be square?", "acceptedAnswer": { "@type": "Answer", "text": "Search thumbnails are usually cropped to 1:1 even when listing photos are not, so square-safe framing matters everywhere - except Vinted and Poshmark, which now display portrait 3:4. See our guide on marketplace square image requirements for the per-platform detail." } },
            { "@type": "Question", "name": "Does converting iPhone HEIC photos lose quality for listings?", "acceptedAnswer": { "@type": "Answer", "text": "Converting HEIC to JPEG once, at high quality, is visually lossless for listing purposes and eliminates the compatibility failures some marketplaces still have with HEIC uploads. Do the conversion in the same batch pass as your resize and compression so it adds no extra step." } }
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
            Is Reselling Worth It in 2026? The Honest Math
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Is reselling worth it in 2026? For most people who treat it as a system rather than a hobby, yes - the US secondhand market hit $55.5 billion in 2025 and is growing nearly four times faster than the broader retail clothing market. But "worth it" is a math question, not a vibes question, and most articles about reselling skip the arithmetic entirely. This guide walks through the actual numbers: what the market looks like, what your time is really spent on, what tools cost, and where the money leaks out of a one-person reselling operation.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published July 23, 2026 by the Mochify Engineering Team.</strong>
                The math here is deliberately conservative, and the free-tier cases are stated plainly: sometimes the right spend on photo tooling is zero.
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

        <section id="the-short-answer" class="scroll-mt-24">
            <SectionHeading>The Short Answer</SectionHeading>
            <p>Reselling is worth it if your hourly rate survives the listing process. Selling a $25 item that took 40 minutes to photograph, edit, and list nets you a far worse hourly rate than the same item listed in 15 minutes across three marketplaces. The market demand is proven and growing; the profitability of <em>your</em> operation depends almost entirely on how much time each listing eats. That is the lens for everything below.</p>
            <p>We build image tools for marketplace sellers, so we will be honest about where our own product fits - including the cases where you should not pay us anything.</p>
            <p>The three numbers that decide it:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Revenue per item</strong> - set by sourcing skill and marketplace choice, not by tools.</li>
                <li><strong class="text-[#4A2C2C]">Minutes per listing</strong> - photography, editing, writing, cross-posting. This is where operations quietly die.</li>
                <li><strong class="text-[#4A2C2C]">Fixed tool costs</strong> - cross-listers, photo tools, subscriptions. Cheap individually, corrosive in aggregate.</li>
            </ul>
        </section>

        <section id="the-resale-market-in-2026" class="scroll-mt-24">
            <SectionHeading>The Resale Market in 2026: the Numbers Are Real</SectionHeading>
            <p>The demand side of the equation is not in question. According to <a href="https://www.thredup.com/resale" target="_blank" rel="noopener noreferrer">ThredUp's 14th Annual Resale Report</a> (published April 2026), US resale reached $55.5 billion in 2025 - about 12% of the $458 billion Americans spent on clothing, footwear, and accessories that year. The US secondhand market is projected to reach $78.8 billion by 2030, a 7.3% compound annual growth rate, and globally the secondhand market is projected to grow from $289 billion in 2026 to <a href="https://ir.thredup.com/news-releases/news-release-details/thredups-14th-annual-resale-report-reveals-new-era-structural" target="_blank" rel="noopener noreferrer">$393 billion by 2030</a>, roughly twice the pace of the rest of the fashion industry.</p>
            <p>Two details in that report matter specifically for individual resellers:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Gen Z and Millennials are projected to drive more than 70% of market growth through 2030.</strong> Your buyers are young, mobile-first, and scroll fast - which raises the bar on listing photos, because a feed thumbnail is your only shot at a tap.</li>
                <li><strong class="text-[#4A2C2C]">Nearly half of shoppers now discover secondhand items through social media, creators, and influencer feeds</strong> rather than search. Photos are not just listing assets anymore; they are distribution assets.</li>
            </ul>
            <p>The takeaway: the market will absorb what you list. The constraint is how fast and how well you can list it.</p>
        </section>

        <section id="where-your-time-actually-goes" class="scroll-mt-24">
            <SectionHeading>Where Your Time Actually Goes</SectionHeading>
            <p>A full manual listing takes most sellers 20 to 40 minutes end to end, and photography plus photo editing is the biggest single block inside that. There is no rigorous academic study of listing time (we looked), but seller guides and cross-listing vendors consistently land in that 20-40 minute range for a single marketplace, with roughly 5 extra minutes per additional platform once the listing exists. Cross-listing vendor List Perfectly markets "80% faster" listing times - a vendor claim, but one that tells you where they think the pain is.</p>
            <p>Run the math on a modest operation: 10 listings per week at 30 minutes each is 5 hours of pure listing labor, before sourcing, packing, or shipping. If your average net profit per item is $12, your listing labor alone is running at $24/hour - decent - but it degrades fast if photos need rework, uploads fail, or you re-crop every image three times for three different marketplaces.</p>
            <p>And the marketplaces genuinely do want different things from your photos. eBay allows <a href="https://www.ebay.com/help/selling/listings/adding-pictures-listings?id=4148" target="_blank" rel="noopener noreferrer">up to 24 photos per listing</a> with a 12MB per-photo cap. Vinted takes up to 20 and displays portrait 3:4. Etsy takes 20. Poshmark takes up to 16 (commonly cited) and moved its display format to portrait 3:4 in March 2026. Mercari caps at 12. Shoot once at 10-12 photos per item and you are processing 400 to 500 images a month at the 10-listings-per-week pace - resized, cropped, and format-converted per platform.</p>
            <p>If eBay has ever rejected one of those uploads outright, our guide to the <a href="/guides/ebay-image-file-not-supported">"image file not supported" error</a> explains which formats eBay actually accepts and why phone photos trip it.</p>
        </section>

        <section id="the-photo-pipeline" class="scroll-mt-24">
            <SectionHeading>The Photo Pipeline: the Math Nobody Does</SectionHeading>
            <p>Here is the answer-first version: a reseller listing 10 items a week processes roughly 400-500 photos a month, and the tooling gates that matter at that volume are monthly image caps and batch sizes, not fancy features.</p>
            <p>Work it through:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li>10 listings/week at 10 photos each = <strong class="text-[#4A2C2C]">~100 photos per week, 400-450 per month</strong> allowing for reshoots.</li>
                <li>Each photo typically needs at least one transformation: crop to square for eBay and Mercari thumbnails, portrait 3:4 for Vinted and Poshmark, HEIC-to-JPEG conversion if you shoot on an iPhone, and compression under per-platform caps (12MB on eBay, 10MB on Vinted).</li>
                <li>Done one image at a time in a phone editor at even 30 seconds per photo, 400-450 images is <strong class="text-[#4A2C2C]">well over 3 hours a month of pure image fiddling</strong>. Batch processing collapses that to minutes.</li>
            </ul>
            <p>This is why batch size is the quietly decisive spec in any image tool a reseller uses. Processing 100 photos in batches of 3 means 34 rounds of upload-wait-download. In batches of 25, it is 4 rounds. Same photos, same tool, an order of magnitude difference in babysitting.</p>
            <p>Square thumbnails deserve a special mention because they are the one transformation almost every marketplace rewards. Most marketplaces crop search thumbnails to 1:1 whether you like it or not - our quick answer on <a href="/guides/do-marketplace-product-images-need-to-be-square">whether marketplace product images need to be square</a> covers which platforms do what. Pre-cropping to square with the subject centered is the safe play, and it is exactly the kind of repetitive job that should never be done by hand: the <a href="/solutions/bulk-ai-square-cropper">Bulk AI Square Cropper</a> smart-crops in bulk using AI saliency detection, keeping the garment centered automatically, with output sizes from 500 to 2000px.</p>
            <p>There is also an old piece of eBay research, from an internal study of 6.8 million listings, that found listings with better photo quality were about 4.5% more likely to sell. eBay no longer publishes that study, so treat the exact figure as vintage - but the direction of the claim has only strengthened as buying has moved into image-led social feeds.</p>
        </section>

        <section id="what-reseller-tools-cost" class="scroll-mt-24">
            <SectionHeading>What Reseller Tools Cost in 2026</SectionHeading>
            <p>The honest answer: the popular reseller stack costs $15-60 a month, and most of it is cross-listing software, not photo tooling. As of July 2026, the main cross-listers price out like this (vendor-published pricing, rounded):</p>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[560px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Tool</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Entry price</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">What it does with photos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Vendoo</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">from $14.99/mo</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Manual per-marketplace photo slots</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Crosslist</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">from ~$20.83/mo (annual)</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Letterboxes to square; built-in editor</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">List Perfectly</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">from $29/mo</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Hosts photos; assists 1:1 conversion</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] font-bold">Flyp</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">free 100 days, then $9/mo</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Copies photos as-is</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
            <p>Cross-listers are genuinely useful at volume - copying a listing to a second marketplace beats retyping it. But note what none of them do: per-platform photo <em>optimization</em>. They move your images around; they do not re-crop portrait for Poshmark, convert HEIC for eBay, or compress an oversized photo under a platform cap. The photo work still happens upstream, which is why it belongs in your math as its own line.</p>
            <p>For the photo line, the relevant comparison set is image tools, and the range is $0 to about $25/month. Mochify's Seller tier is $7.99/month; you can see the full breakdown on the <a href="/pricing">pricing page</a>. Whether that line should be $0 or $7.99 is the next section, and the answer is not always $7.99.</p>
        </section>

        <section id="when-free-is-enough" class="scroll-mt-24">
            <SectionHeading>When Free Is Genuinely Enough</SectionHeading>
            <p>If you list a handful of items a month, do not pay for a photo tool - free tiers exist for exactly your volume. Here is our honest segmentation, using our own product as the example because we know its numbers best:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Casual sellers (up to ~2-3 listings/month, ~25 photos):</strong> stay on <strong class="text-[#4A2C2C]">Free</strong>. A free Mochify account processes 25 images a month at up to 20MB each, in batches of 3, with the full format set, background removal, and the Magic Flow natural language interface included. That covers a couple of listings with photos to spare. Paying would be irrational.</li>
                <li><strong class="text-[#4A2C2C]">Occasional bursts (a closet clear-out, a one-off haul):</strong> the <strong class="text-[#4A2C2C]">$5 Credit Pack</strong> buys 100 images with no expiry and no subscription. Burst sellers are the segment subscriptions quietly overcharge; a one-time pack matches the shape of the work.</li>
                <li><strong class="text-[#4A2C2C]">Active resellers (5+ listings/week, 200+ photos/month):</strong> this is where <strong class="text-[#4A2C2C]">Seller at $7.99/month</strong> starts paying for itself. The trigger is not any single feature - it is hitting the 25-image monthly cap in week one, and feeling the batch-of-3 limit on every processing round. Seller raises the caps to 300 images/month, 25 files per batch, and 75MB per file, with a priority queue. At 400 photos a month, the practical difference is 4 batch rounds instead of 34.</li>
                <li><strong class="text-[#4A2C2C]">High-volume operations (multiple platforms, 500+ photos/month):</strong> Pro at $24.99/month lifts the cap to 1,200 images. Most individual resellers never need it; small teams and store-scale operations do.</li>
            </ul>
            <p>The framing we would want as buyers: a $7.99 subscription needs to save you about 20 minutes a month at a $24/hour effective rate to break even. Against 3+ hours of manual image editing, batch processing clears that bar easily <em>if</em> you are at active-reseller volume. Below that volume, it does not, and you should keep your money.</p>
            <p>One more honest note: if your photos are already perfect JPEGs at the right size, a compressor mostly buys you smaller files and faster uploads. The bigger wins come when the tool replaces several manual steps at once - crop, convert, resize, compress - which is what the next section shows. For the JPEG output itself, Mochify uses Google's jpegli encoder; our <a href="/guides/jpeg-in-2026-jpegli">Jpegli guide</a> covers why that gets you roughly 35% better compression than older JPEG encoders with no compatibility downsides on marketplace uploads.</p>
        </section>

        <!-- Workflow card -->
        <section id="mochify-workflow" class="scroll-mt-24 bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-9 not-prose">
            <h2 class="text-[1.75rem] font-black text-[#4A2C2C] mt-0 mb-4">Mochify Workflow: Batch-Prepping a Week of Listing Photos</h2>
            <p class="text-base mb-7">Shoot once, prompt once per platform, and let batch processing take the 400-500 monthly photos off your plate:</p>
            <ol class="space-y-4 list-none p-0 m-0">
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">1</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Shoot everything once</strong>
                        <p class="text-base m-0">One session, all items, 8-12 photos each. Phone or camera, natural light. Do not edit on the phone.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">2</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Dump the week's photos into Mochify</strong>
                        <p class="text-base m-0">On Seller, that is batches of up to 25 files, up to 75MB each.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">3</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">One prompt per target platform</strong>
                        <p class="text-base m-0">Magic Flow takes plain English, so the per-platform variants are one line each. eBay and Mercari: <em>"crop these square with the item centered, convert to JPEG, keep under 12MB, and strip all metadata"</em>. Vinted and Poshmark: <em>"crop to 3:4 portrait at 1080x1440, compress under 10MB, strip all metadata"</em>. Etsy: <em>"resize to 2000px on the long edge, convert to JPEG, strip all metadata"</em>.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">4</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Need a clean background for a cover shot?</strong>
                        <p class="text-base m-0">Background removal is included on every tier, Free included - prompt <em>"remove the background"</em> on the hero image and export a transparent version.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">5</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Download each platform's set</strong>
                        <p class="text-base m-0">Feed it to your cross-lister or upload directly.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">6</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Vinted sellers: use the dedicated tools</strong>
                        <p class="text-base m-0">The <a href="/vinted-seller">Vinted seller tool</a> bakes the 3:4 smart crop to 1080x1440 and the under-10MB compression into one page, and the <a href="/solutions/ebay-image-converter">eBay Image Converter</a> does the same for eBay's format and size rules.</p>
                    </div>
                </li>
            </ol>
            <p class="text-base text-[#875F42] mt-7 mb-0">Note the "strip all metadata" line in each prompt: phone photos carry EXIF data, including GPS coordinates of wherever you photographed your inventory - often your home. State the metadata handling explicitly in your prompt so you know it happened. And a privacy note, stated precisely: your images travel to <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">api.mochify.app</code> over HTTPS, are processed in RAM, and are wiped immediately after encoding - no disk writes, no logs containing file data, zero retention. We do not claim your photos "never leave your machine" (they must, for the encoding); we claim we keep nothing.</p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat Sheet: the Reseller ROI Decision Table</SectionHeading>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Your volume</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Photos/month</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Photo tool spend</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">Why</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">1-3 listings/month</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~10-30</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><strong class="text-[#4A2C2C]">$0 (Free tier)</strong></td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">25 images/month covers it</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">One-off haul or clear-out</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~50-100</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><strong class="text-[#4A2C2C]">$5 Credit Pack, once</strong></td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">100 images, no expiry, no subscription</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">5-10 listings/week</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">200-450</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><strong class="text-[#4A2C2C]">Seller, $7.99/mo</strong></td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">300 images/mo, batches of 25 vs 3, 75MB files, priority queue</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Team or store scale</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">500-1,200+</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50"><strong class="text-[#4A2C2C]">Pro, $24.99/mo</strong></td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">1,200 images/mo, top queue priority</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] font-bold">Any volume + cross-posting</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">n/a</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">Cross-lister $9-29/mo <em>separately</em></td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">They copy listings; they do not optimize photos</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
            <p>Break-even rule of thumb: a paid photo tool must save ~20 minutes/month at your effective hourly rate. At 200+ photos/month with batch processing, it saves hours.</p>
        </section>

        <!-- FAQ -->
        <GuideFAQs items={faqs} />

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Ready to run the math on your own listings?</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base">Drop this week's photos into Mochify and prompt <em>"crop these square, convert to JPEG, keep under 12MB, and strip all metadata"</em> - 3 images per session free with no signup, 25 a month with a free account.</p>
            <a href="/" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Start Optimizing Now →
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
