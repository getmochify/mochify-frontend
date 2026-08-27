<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';
    import GuideCTA from '$lib/components/GuideCTA.svelte';

    const metadata = {
        title: "Etsy Listing Photo Size: The Complete Guide",
        description: "Etsy listing photos should be at least 2000px and under 1MB. Every current spec from Etsy's docs, why photos blur after upload, and a one-prompt batch fix.",
        category: "Image Optimization",
        readTime: "9 min read",
        date: "August 3, 2026"
    };

    const faqItems = [
        {
            q: "What size are Etsy listing photos supposed to be?",
            a: "At least 2000 pixels in both width and height, under 1MB in file size, in JPG, PNG, GIF, SVG, or HEIC format. A 2000x2000 square is the most practical target because it survives Etsy's square, portrait, and landscape thumbnail crops."
        },
        {
            q: "What is the best aspect ratio for Etsy photos?",
            a: "Etsy publishes no required ratio. It recommends the first photo be landscape or square, then crops thumbnails to square, portrait, and landscape in different placements. Shooting with negative space and uploading square masters handles all three gracefully."
        },
        {
            q: "Why are my Etsy photos blurry after uploading?",
            a: "Etsy compresses every uploaded image to keep pages fast, and states this in its documentation. Blur usually means the upload was either under 2000px (so it's being stretched) or already heavily compressed (so artifacts compound). Upload larger, cleanly encoded files and sharpness survives the recompression."
        },
        {
            q: "How many photos and videos can I add to an Etsy listing?",
            a: "Up to 20 photos and 2 videos per listing. Videos run 3-15 seconds at up to 100MB, and Etsy removes the audio track on upload."
        },
        {
            q: "Does Etsy accept HEIC photos from an iPhone?",
            a: "Yes, HEIC is one of Etsy's five supported formats, alongside JPG, PNG, GIF, and SVG. Converting HEIC to JPEG before upload is still worth considering, because it lets you control the compression quality instead of leaving the conversion to Etsy's pipeline."
        },
        {
            q: "What is the Etsy thumbnail size?",
            a: "There is no single current thumbnail size; the old 570x456 figure no longer appears in Etsy's documentation. Etsy generates square, portrait, and landscape thumbnails from your first photo automatically, which is why the upload itself should be large and loosely framed."
        },
        {
            q: "Do bigger photo files rank better on Etsy?",
            a: "No. Resolution matters (Etsy says first photos under 635px can rank lower in search), but file size beyond what quality requires just risks failed uploads past 1MB. The target is maximum sharpness within the 1MB budget, which is a compression-efficiency problem, not a bigger-is-better one."
        }
    ];

    const relatedGuides = [
        { href: '/guides/jpeg-in-2026-jpegli', title: 'Jpegli Guide 2026: Why Jpegli Changes the Quality-Per-Byte Game', desc: 'The encoder logic behind sharp files under 1MB.' },
        { href: '/guides/should-i-optimize-images-before-upload', title: 'Should I Optimize My Images Before I Upload Them?', desc: "Why pre-upload optimization beats trusting any platform's compressor." },
        { href: '/guides/do-marketplace-product-images-need-to-be-square', title: 'Do Marketplace Product Images Need to Be Square?', desc: 'The cross-platform shape question, answered.' },
        { href: '/guides/ecommerce-product-photo-workflow-resize-convert', title: 'Ecommerce Product Photo Workflow: Resize & Convert in One Prompt', desc: 'The batch pattern for sellers on multiple platforms.' },
        { href: '/guides/what-image-format-should-i-use-for-product-photos', title: 'What Image Format Should I Use for Product Photos?', desc: 'AVIF, WebP, or JPEG for product listings.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/etsy-listing-photo-size-guide" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Etsy Listing Photo Size: The Complete Guide",
        "description": "Etsy listing photos should be at least 2000px and under 1MB. Every current spec from Etsy's docs, why photos blur after upload, and a one-prompt batch fix.",
        "url": "https://mochify.app/guides/etsy-listing-photo-size-guide",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/etsy-listing-photo-size-guide"
        },
        "datePublished": "2026-08-03",
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
            { "@type": "Thing", "name": "Etsy" },
            { "@type": "Thing", "name": "product photography" },
            { "@type": "Thing", "name": "image compression" },
            { "@type": "Thing", "name": "image sizes" },
            { "@type": "Thing", "name": "thumbnails" }
        ],
        "keywords": "etsy listing photo size, etsy image size, etsy photo size, etsy thumbnail size, etsy photo requirements, etsy banner size"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "Etsy Listing Photo Size: The Complete Guide", "item": "https://mochify.app/guides/etsy-listing-photo-size-guide" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
            "@type": "Question",
            "name": "What size are Etsy listing photos supposed to be?",
            "acceptedAnswer": { "@type": "Answer", "text": "At least 2000 pixels in both width and height, under 1MB in file size, in JPG, PNG, GIF, SVG, or HEIC format. A 2000x2000 square is the most practical target because it survives Etsy's square, portrait, and landscape thumbnail crops." }
            },
            {
            "@type": "Question",
            "name": "What is the best aspect ratio for Etsy photos?",
            "acceptedAnswer": { "@type": "Answer", "text": "Etsy publishes no required ratio. It recommends the first photo be landscape or square, then crops thumbnails to square, portrait, and landscape in different placements. Shooting with negative space and uploading square masters handles all three gracefully." }
            },
            {
            "@type": "Question",
            "name": "Why are my Etsy photos blurry after uploading?",
            "acceptedAnswer": { "@type": "Answer", "text": "Etsy compresses every uploaded image to keep pages fast, and states this in its documentation. Blur usually means the upload was either under 2000px (so it's being stretched) or already heavily compressed (so artifacts compound). Upload larger, cleanly encoded files and sharpness survives the recompression." }
            },
            {
            "@type": "Question",
            "name": "How many photos and videos can I add to an Etsy listing?",
            "acceptedAnswer": { "@type": "Answer", "text": "Up to 20 photos and 2 videos per listing. Videos run 3-15 seconds at up to 100MB, and Etsy removes the audio track on upload." }
            },
            {
            "@type": "Question",
            "name": "Does Etsy accept HEIC photos from an iPhone?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes, HEIC is one of Etsy's five supported formats, alongside JPG, PNG, GIF, and SVG. Converting HEIC to JPEG before upload is still worth considering, because it lets you control the compression quality instead of leaving the conversion to Etsy's pipeline." }
            },
            {
            "@type": "Question",
            "name": "What is the Etsy thumbnail size?",
            "acceptedAnswer": { "@type": "Answer", "text": "There is no single current thumbnail size; the old 570x456 figure no longer appears in Etsy's documentation. Etsy generates square, portrait, and landscape thumbnails from your first photo automatically, which is why the upload itself should be large and loosely framed." }
            },
            {
            "@type": "Question",
            "name": "Do bigger photo files rank better on Etsy?",
            "acceptedAnswer": { "@type": "Answer", "text": "No. Resolution matters (Etsy says first photos under 635px can rank lower in search), but file size beyond what quality requires just risks failed uploads past 1MB. The target is maximum sharpness within the 1MB budget, which is a compression-efficiency problem, not a bigger-is-better one." }
            }
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
            Etsy Listing Photo Size: The Complete Guide
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            The right Etsy listing photo size is at least 2000 pixels in both width and height, with a file size under 1MB. That single sentence resolves most of the confusion, but it hides the details that actually cost sellers sales: why photos turn blurry after upload, how Etsy crops your first photo three different ways, and which of the numbers floating around the internet are years out of date. This guide covers every current Etsy image spec, sourced from Etsy's own documentation, plus a batch workflow that gets an entire shop's photos to spec in one prompt.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published August 3, 2026 by the Mochify Engineering Team.</strong>
                Every number in this guide comes from Etsy's live documentation, not the recycled specs most size guides still publish.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- Table of Contents -->
        <section>
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-4 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    {#each [
                        { n: '01', href: '#what-size-should-etsy-listing-photos-be', label: 'What size should Etsy listing photos be?' },
                        { n: '02', href: '#why-etsy-photos-look-blurry-after-upload', label: 'Why Etsy photos look blurry after upload' },
                        { n: '03', href: '#thumbnails-how-etsy-crops-your-first-photo', label: 'Thumbnails: how Etsy crops your first photo' },
                        { n: '04', href: '#every-other-etsy-image-size', label: 'Every other Etsy image size' },
                        { n: '05', href: '#cheat-sheet', label: 'Etsy image size cheat sheet' },
                        { n: '06', href: '#mochify-workflow', label: "Mochify Workflow: batch-prep a shop's photos" },
                        { n: '07', href: '#faq', label: 'FAQ' },
                    ] as item}
                        <li>
                            <a href={item.href} class="group flex items-center justify-between p-3 rounded-xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                                <span class="flex items-center gap-4">
                                    <span class="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">{item.n}</span>
                                    <span class="text-[#4A2C2C] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                                </span>
                                <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </section>

        <!-- 01 What size -->
        <section id="what-size-should-etsy-listing-photos-be" class="scroll-mt-24">
            <SectionHeading>What size should Etsy listing photos be?</SectionHeading>
            <p>Etsy recommends listing photos with a width and height of at least 2000 pixels, and warns that images over 1MB in file size may not finish uploading. Those are the two numbers that matter, straight from <a href="https://help.etsy.com/hc/en-us/articles/115015663347-Requirements-and-Best-Practices-for-Images-in-Your-Etsy-Shop" target="_blank" rel="noopener noreferrer">Etsy's image requirements</a>. Everything else is detail:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Minimum for your first photo: 635px</strong> in width and height. Below that, Etsy says listings can show up lower in search. This is the floor, not the target.</li>
                <li><strong class="text-[#4A2C2C]">Formats: JPG, PNG, GIF, SVG, and HEIC</strong> - the only file types Etsy supports. Animated GIFs aren't supported, and PNG transparency renders as black, so flatten transparent images onto a background before upload.</li>
                <li><strong class="text-[#4A2C2C]">Color: sRGB.</strong> Etsy converts everything to sRGB anyway; converting before upload avoids surprise color shifts. CMYK is for print, not listings.</li>
                <li><strong class="text-[#4A2C2C]">Per listing: up to 20 photos and 2 videos</strong>, per <a href="https://help.etsy.com/hc/en-us/articles/115015628707-How-to-Create-a-Listing" target="_blank" rel="noopener noreferrer">Etsy's listing documentation</a>.</li>
            </ul>
            <InfoBox type="note" title="Retired specs still circulating">
                Worth flagging what's not in Etsy's current documentation, because outdated numbers dominate the search results: there is no 72 PPI requirement (PPI is irrelevant for screen display), no 570x456 "thumbnail size" (a legacy figure that appears on no live Etsy page), and no rule that photos must be 4:3. If a guide quotes those, it's recycling specs from years ago.
            </InfoBox>
            <p>Does any of this matter commercially? Etsy's own buyer surveys say yes, emphatically: <a href="https://www.etsy.com/seller-handbook/article/147451496051" target="_blank" rel="noopener noreferrer">90% of shoppers rated photo quality "extremely important" or "very important"</a> to their purchase decision, and Etsy reports photos are the single biggest factor, ahead of shipping cost, reviews, and even price.</p>
        </section>

        <!-- 02 Why blurry -->
        <section id="why-etsy-photos-look-blurry-after-upload" class="scroll-mt-24">
            <SectionHeading>Why Etsy photos look blurry after upload</SectionHeading>
            <p>Etsy recompresses every photo you upload, and that recompression is usually what makes crisp photos turn soft. This isn't speculation; it's in Etsy's own documentation: "Images may appear less sharp after being uploaded due to compression of the image files. We do this in order to improve the overall performance of the page."</p>
            <p>Two upload habits make the recompression visibly worse:</p>
            <ol class="list-decimal pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Uploading too small.</strong> Anything under 2000px gets displayed at sizes it can't support, especially once zoom is involved. Etsy notes that downsizing a large image is safe, but enlarging a small one causes pixelation. There's no fix for missing pixels; re-shoot or re-export from the original.</li>
                <li><strong class="text-[#4A2C2C]">Uploading an already heavily compressed JPEG.</strong> Compression stacks. A JPEG exported at aggressive quality settings, or saved repeatedly through messaging apps, goes through Etsy's compressor a second time, and the artifacts compound. Sellers report this constantly as "my photos looked fine until I uploaded them."</li>
            </ol>
            <p>The fix for the second problem is quality-per-byte: deliver a file that's small and clean, so Etsy's pass has good material to work with. This is exactly the trade the jpegli encoder is built for; our <a href="https://mochify.app/guides/jpeg-in-2026-jpegli">Jpegli quality-per-byte guide</a> covers why it produces roughly 35% smaller files than older JPEG encoders with no visible quality loss. A 2000-3000px photo, encoded well, lands comfortably under Etsy's 1MB threshold without looking like it was squeezed there. The broader principle - optimize before you upload rather than trusting a platform's compressor - applies to <a href="https://mochify.app/guides/should-i-optimize-images-before-upload">every upload destination</a>, not just Etsy.</p>
        </section>

        <!-- 03 Thumbnails -->
        <section id="thumbnails-how-etsy-crops-your-first-photo" class="scroll-mt-24">
            <SectionHeading>Thumbnails: how Etsy crops your first photo</SectionHeading>
            <p>Etsy doesn't show your photo at one shape. The same first image gets cropped to square, portrait, and landscape thumbnails in different parts of the site and app, which is why Etsy's guidance is to shoot with negative space around your product and check the listing preview tool, which shows all three crops before you publish.</p>
            <p>Practical implications:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">A 2000x2000 square master is the most crop-resistant upload.</strong> Whatever Etsy trims for a portrait or landscape context, a centered subject with breathing room survives.</li>
                <li><strong class="text-[#4A2C2C]">First photo sets the tone.</strong> Etsy recommends the first photo be landscape or square, and it dictates how your other photos display on the listing.</li>
                <li><strong class="text-[#4A2C2C]">Don't crop tight in-camera.</strong> Tight crops look decisive in the editor and lose product edges in Etsy's thumbnails. Leave margin; crop happens at display time whether you like it or not.</li>
            </ul>
            <p>If you <a href="/guides/cross-listing-marketplace-photo-requirements">sell across marketplaces</a>, this multi-crop behavior is Etsy's version of a problem every platform has: our quick answer on <a href="https://mochify.app/guides/do-marketplace-product-images-need-to-be-square">whether marketplace product images need to be square</a> covers the cross-platform default.</p>
        </section>

        <!-- 04 Every other size -->
        <section id="every-other-etsy-image-size" class="scroll-mt-24">
            <SectionHeading>Every other Etsy image size: banners, logos, and video</SectionHeading>
            <p>Listing photos carry the sales weight, but a shop has a full set of image slots. Current specs from Etsy's requirements page:</p>

            <ScrollableTable class="my-6">
                <table class="w-full border-collapse text-sm">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Shop asset</th>
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Recommended size</th>
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Minimum</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Shop logo (icon)</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">500 x 500px</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">n/a</td></tr>
                        <tr class="bg-[#FDFBF7]"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Profile photo</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">400 x 400px</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">n/a</td></tr>
                        <tr class="bg-white"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Mini shop banner</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">1600 x 213px</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">1200 x 160px</td></tr>
                        <tr class="bg-[#FDFBF7]"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Big shop banner</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">1600 x 400px</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">1200 x 300px</td></tr>
                        <tr class="bg-white"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Carousel banner (Etsy Plus)</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">1200 x 300px</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">n/a</td></tr>
                        <tr class="bg-[#FDFBF7]"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Order receipt banner</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">n/a</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">760 x 100px</td></tr>
                        <tr class="bg-white"><td class="px-4 py-3 text-[#6C3F31] font-black">Team logo</td><td class="px-4 py-3 text-[#6C3F31]">170 x 100px</td><td class="px-4 py-3 text-[#6C3F31]">n/a</td></tr>
                    </tbody>
                </table>
            </ScrollableTable>

            <p><strong class="text-[#4A2C2C]">Listing videos</strong>, per <a href="https://help.etsy.com/hc/en-us/articles/360053206073-How-to-Add-Listing-Videos" target="_blank" rel="noopener noreferrer">Etsy's video documentation</a>: 3-15 seconds, up to 100MB, minimum 500px resolution with at least 1080px recommended, up to 2 per listing. Etsy strips the audio on upload, so shoot for silent playback.</p>
        </section>

        <!-- 05 Cheat sheet -->
        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Etsy image size cheat sheet</SectionHeading>
            <ScrollableTable class="my-6">
                <table class="w-full border-collapse text-sm">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Spec</th>
                            <th class="text-left px-4 py-3 text-[#875F42] font-black text-xs uppercase tracking-wider border-b border-pink-100">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Listing photo size</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">2000px+ width and height (2000x2000 square is most crop-resistant)</td></tr>
                        <tr class="bg-[#FDFBF7]"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">First photo minimum</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">635 x 635px</td></tr>
                        <tr class="bg-white"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">File size</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">Under 1MB</td></tr>
                        <tr class="bg-[#FDFBF7]"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Formats</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">JPG, PNG, GIF, SVG, HEIC</td></tr>
                        <tr class="bg-white"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Color profile</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">sRGB</td></tr>
                        <tr class="bg-[#FDFBF7]"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Photos per listing</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">Up to 20</td></tr>
                        <tr class="bg-white"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Videos per listing</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">Up to 2 (3-15s, max 100MB, 1080px+ ideal)</td></tr>
                        <tr class="bg-[#FDFBF7]"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Aspect ratio</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">No fixed rule; first photo landscape or square; expect square, portrait, AND landscape crops</td></tr>
                        <tr class="bg-white"><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50 font-black">Transparency</td><td class="px-4 py-3 text-[#6C3F31] border-b border-pink-50">Renders black; flatten first</td></tr>
                        <tr class="bg-[#FDFBF7]"><td class="px-4 py-3 text-[#6C3F31] font-black">Retired specs you can ignore</td><td class="px-4 py-3 text-[#6C3F31]">72 PPI, 570x456 thumbnails, mandatory 4:3, 10-photo limit</td></tr>
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

        <!-- 06 Mochify Workflow -->
        <section id="mochify-workflow" class="scroll-mt-24">
            <SectionHeading>Mochify Workflow: batch-prep an entire shop's photos</SectionHeading>
            <p>The goal: every photo at 2000x2000, sharp, sRGB, under 1MB. One Magic Flow prompt handles a whole batch.</p>

            <div class="space-y-4 my-6">
                {#each [
                    {
                        n: '1',
                        h: 'Start from your best originals',
                        body: 'Full-resolution exports from your camera or phone, not screenshots or re-saved copies. If your phone shoots HEIC, Etsy accepts it, but converting through the <a href="/heic-to-jpeg">HEIC to JPEG converter</a> keeps you in control of the encoding rather than leaving it to Etsy\'s pipeline.'
                    },
                    {
                        n: '2',
                        h: 'Upload the batch and describe the result',
                        body: 'Upload at <a href="https://mochify.app">mochify.app</a> and prompt: "Smart-crop these to 2000x2000 square, JPEG, under 1MB each, strip all metadata." Magic Flow parses the prompt and the C++ engine executes it: saliency-guided smart crop keeps the product centered, and jpegli encoding spends the byte budget where your product detail is.'
                    },
                    {
                        n: '3',
                        h: 'Or use the dedicated tool',
                        body: 'For a pure cropping pass, the <a href="https://mochify.app/solutions/bulk-ai-square-cropper">Bulk AI Square Cropper</a> smart-crops batches to square at up to 2000px output.'
                    },
                    {
                        n: '4',
                        h: 'Spot-check the first photo of each listing',
                        body: "Use Etsy's preview tool to check all three thumbnail crops before publishing."
                    },
                ] as step}
                    <div class="flex items-start gap-4 rounded-2xl border border-pink-100 bg-white p-5">
                        <span class="w-9 h-9 shrink-0 rounded-full bg-pink-50 flex items-center justify-center text-sm font-black text-[#F06292] border border-pink-100">{step.n}</span>
                        <div>
                            <h3 class="font-black text-[#4A2C2C] text-lg mb-1 mt-0">{step.h}</h3>
                            <p class="text-base text-[#6C3F31] m-0">{@html step.body}</p>
                        </div>
                    </div>
                {/each}
            </div>

            <InfoBox type="tip" title="Say the metadata part out loud">
                The metadata line in that prompt is deliberate: camera EXIF can include GPS coordinates, and for anyone photographing products at home, stripping location data before a public listing is basic hygiene. Stating it in the prompt makes the behavior explicit rather than assumed.
            </InfoBox>

            <p class="text-sm text-[#875F42]">Privacy note: your photos travel over HTTPS to api.mochify.app, are processed in RAM, and are wiped immediately after encoding - no disk writes, no logs containing file data. Batches run up to 25 files on the Seller and Pro tiers (3 per batch on Free), so a 20-photo listing preps in a single pass.</p>
            <p>Prepping a whole shop's worth of listings is as much a time question as a formatting one. If Etsy is one of several places you sell, <a href="/guides/is-reselling-worth-it">the reseller volume math</a> covers when a paid photo workflow starts paying for itself.</p>
        </section>

        <!-- Inline CTA -->
        <GuideCTA
            heading="A shop's worth of photos, one prompt"
            href="/"
            label="Open Magic Flow →"
        >
            Upload your originals and try <em>"smart-crop these to 2000x2000 square, JPEG, under 1MB each, strip all metadata"</em> - every listing lands sharp, on-spec, and ready for all three of Etsy's crops.
        </GuideCTA>

        <!-- FAQ -->
        <GuideFAQs items={faqItems} />

        <!-- Related Guides -->
        <section>
            <SectionHeading>Related Guides</SectionHeading>
            <ul class="space-y-3">
                {#each relatedGuides as guide}
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
