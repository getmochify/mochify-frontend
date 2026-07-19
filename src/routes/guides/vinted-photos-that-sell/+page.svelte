<script>
    import ScrollableTable from '$lib/components/ScrollableTable.svelte';
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideFAQs from '$lib/components/GuideFAQs.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';

    const metadata = {
        title: "How to Take Vinted Photos That Sell",
        description: "How to take good photos for Vinted: light, backgrounds, the real size and ratio facts, privacy checks, and a one-prompt batch workflow for sellers.",
        category: "Workflows",
        readTime: "13 min read",
        date: "July 19, 2026"
    };

    const inlineCode = "bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100";

    const toc = [
        { n: '01', href: '#why-photos-matter', label: 'Why Photos Decide What Sells on Vinted' },
        { n: '02', href: '#vinted-rules', label: 'The Rules Vinted Actually Sets' },
        { n: '03', href: '#how-to-shoot', label: 'How to Shoot: Light, Background, Framing' },
        { n: '04', href: '#flat-lay-hanger-worn', label: 'Flat Lay, Hanger, or Worn?' },
        { n: '05', href: '#technical-facts', label: 'Photo Size, Ratio, and Format: The Real Numbers' },
        { n: '06', href: '#privacy', label: 'The Privacy Check Most Sellers Skip' },
        { n: '07', href: '#mochify-workflow', label: 'Mochify Workflow: Fix a Whole Clear-Out in One Prompt' },
        { n: '08', href: '#cheat-sheet', label: 'Cheat Sheet' },
        { n: '09', href: '#faq', label: 'FAQ' },
    ];

    const faqs = [
        {
            q: "What is the best photo size for Vinted?",
            a: "Portrait orientation at a 3:4 ratio, around 1080x1440 pixels, with the item centered. Vinted publishes no official size requirement; this recommendation comes from how its pipeline actually behaves - grid thumbnails are cropped to a fixed 310x430 portrait window and item photos are served at roughly 800px, so a centered portrait shot survives both."
        },
        {
            q: "How many photos should a Vinted listing have?",
            a: "Vinted allows up to 20 photos per listing. Five to eight covers most items: full front, full back, label, fabric close-up, and any flaws. Branded and designer items should carry more detail shots, since close-ups of logos, stitching, and tags are how buyers and Vinted judge authenticity."
        },
        {
            q: "Do Vinted photos need a white background?",
            a: "No. Vinted has no background requirement; its guidance asks for clear photos in natural daylight with true colors. A plain wall or floor works well. A clean white background does give listings the polished, brand-style look, and Mochify can apply background removal as part of your photo prep on any plan, including Free."
        },
        {
            q: "Can I use stock photos on Vinted?",
            a: "No. Vinted's rules require your own photos of the actual item, and listings using stock or watermarked images can be hidden or removed. Buyers also treat stock photos as a scam signal, so even where a listing survives, it converts poorly."
        },
        {
            q: "Should I show flaws in my Vinted photos?",
            a: "Yes, always. Vinted's rules state that if a defect is not shown in photos and mentioned in the description, the buyer can return the item as significantly not as described. An honest close-up of a flaw costs a little on price and saves you a cancelled sale, a return, and a negative review."
        },
        {
            q: "Do worn photos really sell items faster?",
            a: "Worn photos help buyers judge fit, and many sellers report better results with them, but they are not required and there is no reliable public data proving a specific uplift. Vinted itself suggests flat lay, hangers, or a mannequin if you prefer not to appear in photos. A headless mirror shot is a solid middle ground."
        },
        {
            q: "Why do my Vinted photos look cropped in search?",
            a: "Because the search grid crops every first photo to a fixed portrait thumbnail (310x430 pixels when served). If your photo is landscape or the item sits off-center, the sides get cut. Shoot portrait with the item centered, or batch-crop to 3:4 portrait before uploading."
        },
        {
            q: "Do I need to remove metadata from Vinted photos?",
            a: "It is the safe habit. Phone photos can carry EXIF metadata including GPS coordinates of your home. Platforms usually strip metadata on re-encode, but the same photos often get shared in chats or reused elsewhere. Stripping EXIF yourself before upload, with an explicit instruction like \"strip all metadata\", removes the question entirely."
        }
    ];

    const related = [
        { href: '/guides/vinted-photo-size', title: 'What Size Should Vinted Photos Be?', desc: 'The two-minute answer on sizes, ratios, and what Vinted\'s pipeline does to uploads.' },
        { href: '/guides/ecommerce-product-photo-workflow-resize-convert', title: 'Ecommerce Product Photo Workflow: Resize & Convert in One Prompt', desc: 'The same batch approach for Shopify, Etsy, eBay, and Amazon sellers.' },
        { href: '/guides/do-marketplace-product-images-need-to-be-square', title: 'Do Marketplace Product Images Need to Be Square?', desc: 'Why Vinted is portrait while most marketplaces crop to 1:1.' },
        { href: '/guides/exif-data-risks-image-compression-2026', title: 'The Risks of EXIF Data in Image Compression', desc: 'What your photos reveal and how stripping metadata protects you.' },
        { href: '/guides/ebay-image-file-not-supported', title: 'Why Does eBay Say My Image File Is Not Supported?', desc: 'Fixing upload errors on the other big second-hand marketplace.' },
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title} - Sell Faster | Mochify</title>
    <meta name="description" content={metadata.description}>
    <link rel="canonical" href="https://mochify.app/guides/vinted-photos-that-sell" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/vinted-photos-that-sell" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "How to Take Vinted Photos That Sell",
        "description": "How to take good photos for Vinted: light, backgrounds, the real size and ratio facts, privacy checks, and a one-prompt batch workflow for sellers.",
        "url": "https://mochify.app/guides/vinted-photos-that-sell",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/vinted-photos-that-sell"
        },
        "datePublished": "2026-07-19",
        "dateModified": "2026-07-19",
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
            { "@type": "Thing", "name": "Vinted" },
            { "@type": "Thing", "name": "product photography" },
            { "@type": "Thing", "name": "marketplace selling" },
            { "@type": "Thing", "name": "image optimization" },
            { "@type": "Thing", "name": "EXIF metadata" }
        ],
        "keywords": "how to take good photos for vinted, vinted photo tips, vinted photos, vinted selling tips, vinted photo size",
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
            { "@type": "ListItem", "position": 3, "name": "How to Take Vinted Photos That Sell", "item": "https://mochify.app/guides/vinted-photos-that-sell" }
        ]
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "How to Take Vinted Photos That Sell",
        "url": "https://mochify.app/guides/vinted-photos-that-sell",
        "description": "How to take good photos for Vinted: light, backgrounds, the real size and ratio facts, privacy checks, and a one-prompt batch workflow for sellers.",
        "isPartOf": { "@type": "WebSite", "name": "Mochify", "url": "https://mochify.app" },
        "datePublished": "2026-07-19",
        "dateModified": "2026-07-19"
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "What is the best photo size for Vinted?", "acceptedAnswer": { "@type": "Answer", "text": "Portrait orientation at a 3:4 ratio, around 1080x1440 pixels, with the item centered. Vinted publishes no official size requirement; this recommendation comes from how its pipeline actually behaves - grid thumbnails are cropped to a fixed 310x430 portrait window and item photos are served at roughly 800px, so a centered portrait shot survives both." } },
            { "@type": "Question", "name": "How many photos should a Vinted listing have?", "acceptedAnswer": { "@type": "Answer", "text": "Vinted allows up to 20 photos per listing. Five to eight covers most items: full front, full back, label, fabric close-up, and any flaws. Branded and designer items should carry more detail shots, since close-ups of logos, stitching, and tags are how buyers and Vinted judge authenticity." } },
            { "@type": "Question", "name": "Do Vinted photos need a white background?", "acceptedAnswer": { "@type": "Answer", "text": "No. Vinted has no background requirement; its guidance asks for clear photos in natural daylight with true colors. A plain wall or floor works well. A clean white background does give listings the polished, brand-style look, and Mochify can apply background removal as part of your photo prep on any plan, including Free." } },
            { "@type": "Question", "name": "Can I use stock photos on Vinted?", "acceptedAnswer": { "@type": "Answer", "text": "No. Vinted's rules require your own photos of the actual item, and listings using stock or watermarked images can be hidden or removed. Buyers also treat stock photos as a scam signal, so even where a listing survives, it converts poorly." } },
            { "@type": "Question", "name": "Should I show flaws in my Vinted photos?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, always. Vinted's rules state that if a defect is not shown in photos and mentioned in the description, the buyer can return the item as significantly not as described. An honest close-up of a flaw costs a little on price and saves you a cancelled sale, a return, and a negative review." } },
            { "@type": "Question", "name": "Do worn photos really sell items faster?", "acceptedAnswer": { "@type": "Answer", "text": "Worn photos help buyers judge fit, and many sellers report better results with them, but they are not required and there is no reliable public data proving a specific uplift. Vinted itself suggests flat lay, hangers, or a mannequin if you prefer not to appear in photos. A headless mirror shot is a solid middle ground." } },
            { "@type": "Question", "name": "Why do my Vinted photos look cropped in search?", "acceptedAnswer": { "@type": "Answer", "text": "Because the search grid crops every first photo to a fixed portrait thumbnail (310x430 pixels when served). If your photo is landscape or the item sits off-center, the sides get cut. Shoot portrait with the item centered, or batch-crop to 3:4 portrait before uploading." } },
            { "@type": "Question", "name": "Do I need to remove metadata from Vinted photos?", "acceptedAnswer": { "@type": "Answer", "text": "It is the safe habit. Phone photos can carry EXIF metadata including GPS coordinates of your home. Platforms usually strip metadata on re-encode, but the same photos often get shared in chats or reused elsewhere. Stripping EXIF yourself before upload, with an explicit instruction like \"strip all metadata\", removes the question entirely." } }
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
            How to Take Vinted Photos That Sell
        </h1>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Good photos are the single biggest lever a Vinted seller controls. The feed is a grid of portrait thumbnails, buyers decide in a glance, and two identical hoodies at the same price will sell at very different speeds depending on which one looks like a shop listing and which one looks like a pile on a bed. This guide covers how to take good photos for Vinted from the ground up: what Vinted's own rules ask for, how to shoot with a phone and daylight, the real technical facts about sizes and cropping (which almost every blog post gets wrong), and how to batch-fix an entire wardrobe clear-out in one plain-English prompt.
        </p>

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
            <p class="text-[#6C3F31] text-base leading-relaxed m-0">
                <strong class="text-[#4A2C2C]">Published July 19, 2026 by the Mochify Engineering Team.</strong>
                Written after checking what Vinted's help pages and image pipeline actually do in July 2026, since most photo-requirements posts invent their numbers.
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

        <section id="why-photos-matter" class="scroll-mt-24">
            <SectionHeading>Why Photos Decide What Sells on Vinted</SectionHeading>
            <p>Vinted is a scroll of portrait thumbnails, and your first photo is competing directly against every similar item on the platform, so photo quality is the difference between being clicked and being skipped. The marketplace is not getting less crowded: Vinted's members traded €10.8 billion in goods in 2025, up 47% year on year, according to <a href="https://company.vinted.com/newsroom/financial-results-2025" target="_blank" rel="noopener noreferrer">Vinted's 2025 annual results</a>. More buyers, but also more competing listings in every search.</p>
            <p>When a buyer searches for a jacket, they see a wall of near-identical thumbnails. The listings that get opened share three traits: the item fills the frame, the light is bright and natural, and the background does not fight the product. None of that requires a camera upgrade. It requires knowing what the feed does to your photo (it crops it, hard - more on that below) and spending an extra minute per item.</p>
            <p>There is a second, less obvious reason photos matter: trust. Vinted's marketplace runs on buyer confidence in second-hand goods, and a listing with clear, honest, multi-angle photos reads as a seller who will actually post the item. Blurry single-photo listings attract lowball offers because the photo itself signals risk.</p>
        </section>

        <section id="vinted-rules" class="scroll-mt-24">
            <SectionHeading>The Rules Vinted Actually Sets</SectionHeading>
            <p>Vinted's official photo rules are about content, not pixels: up to 20 photos per listing, the first photo must show the entire item, and every photo must be your own. The full list, from <a href="https://www.vinted.co.uk/help/48-what-photos-you-should-upload" target="_blank" rel="noopener noreferrer">Vinted's help center</a>, is worth internalizing because listings that break it can be hidden or removed:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">First photo: the whole item, no collages.</strong> This is the thumbnail buyers see in search.</li>
                <li><strong class="text-[#4A2C2C]">Your own photos only.</strong> No stock images, no watermarked pictures, nothing saved from the internet. Stock photos are both against the rules and a known scam signal buyers actively avoid.</li>
                <li><strong class="text-[#4A2C2C]">Natural daylight, no flash, no filters.</strong> Vinted asks for true colors; a filtered photo that misrepresents color is grounds for a return.</li>
                <li><strong class="text-[#4A2C2C]">Several angles, plus close-ups.</strong> Labels, logos, stitching, care tags. For branded items, close-up detail shots are how Vinted (and buyers) judge authenticity, and Vinted asks for at least three detail photos on designer listings.</li>
                <li><strong class="text-[#4A2C2C]">Show every defect.</strong> A bobbled cuff or small stain photographed honestly protects you: if a flaw is not shown and mentioned, the buyer can return the item as not as described.</li>
                <li><strong class="text-[#4A2C2C]">Keep yourself out of frame.</strong> Vinted's own guidance suggests avoiding your face and identifiable features, and using a hanger, mannequin, or flat lay instead of modeling.</li>
            </ul>
            <p>Use all 20 slots when the item deserves it. A full set of angles and details answers questions before they are asked, which means fewer messages and faster offers.</p>
        </section>

        <section id="how-to-shoot" class="scroll-mt-24">
            <SectionHeading>How to Shoot: Light, Background, Framing</SectionHeading>
            <p>Daylight, a plain background, and a tight portrait frame will do more for your Vinted photos than any editing app. The practical setup:</p>
            <p><strong class="text-[#4A2C2C]">Light.</strong> Shoot near a window in daytime, with the light falling on the item rather than behind it. Overcast light is even better than direct sun, which throws harsh shadows and blows out whites. Never use flash: it flattens texture and shifts colors, and Vinted's guidance explicitly asks for natural daylight.</p>
            <p><strong class="text-[#4A2C2C]">Background.</strong> A plain wall, a wooden floor, or an ironed white sheet. The background's job is to disappear. A cluttered bedroom floor is the fastest way to make a €40 item look like a €4 item, and busy patterns confuse the feed's small thumbnails.</p>
            <p><strong class="text-[#4A2C2C]">Framing.</strong> Shoot portrait (vertical), item centered, filling most of the frame. This matters more on Vinted than on almost any other marketplace because of how the grid crops thumbnails - covered in the numbers section below. Leave a little margin around the item so the crop cannot amputate a sleeve.</p>
            <p><strong class="text-[#4A2C2C]">Sharpness.</strong> Wipe the lens, hold still or brace your elbows, and tap to focus on the item. Vinted downscales your upload substantially, and downscaling is kind to sharp photos and cruel to blurry ones.</p>
            <p>Shoot the set in one pass per item: full front, full back, label, fabric close-up, any flaws. Five to eight photos covers most items; use more of the 20 for branded pieces.</p>
        </section>

        <section id="flat-lay-hanger-worn" class="scroll-mt-24">
            <SectionHeading>Flat Lay, Hanger, or Worn?</SectionHeading>
            <p>There is no single right style: flat lay is fastest and most consistent, hangers show drape, and worn shots show fit, but Vinted itself points sellers toward the first two if they prefer not to appear in photos. The honest trade-offs:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Flat lay</strong> (item laid flat, shot from above): fast, repeatable, great for tops, knitwear, and kids' clothes. Smooth the garment and square it to the frame. Its weakness is drape: heavy or structured pieces can look shapeless.</li>
                <li><strong class="text-[#4A2C2C]">Hanger</strong> (against a plain wall or door): shows how the garment hangs, takes seconds, and photographs jackets and dresses far better than flat lay.</li>
                <li><strong class="text-[#4A2C2C]">Worn</strong>: best for fit and styling, and buyers do respond to seeing shape on a body. But it is optional: Vinted's own privacy guidance suggests hiding your face or cropping identifiable features, and a headless mirror shot or a mannequin gets most of the benefit.</li>
            </ul>
            <p>Whichever you choose, keep it consistent across a listing. A flat-lay front and a worn back photo of the same item reads as two different garments in the thumbnail strip.</p>
            <p>Ready to make a batch of mixed phone shots look consistent? That is a one-prompt job - <a href="/vinted-seller">try Mochify's Vinted photo optimizer</a>.</p>
        </section>

        <section id="technical-facts" class="scroll-mt-24">
            <SectionHeading>Photo Size, Ratio, and Format: The Real Numbers</SectionHeading>
            <p>Vinted publishes no official photo size, aspect ratio, or file-size requirement; the numbers that matter are the ones its image pipeline actually produces, and those favor a centered, portrait, roughly 3:4 shot at 1080px wide or more. This is the part nearly every "Vinted photo requirements" blog post invents, so here is what we actually verified in July 2026:</p>
            <ul class="list-disc pl-6 space-y-2 my-4">
                <li><strong class="text-[#4A2C2C]">Vinted's help center sets no technical spec.</strong> No dimensions, no ratio, no file size, no format list appears anywhere in the official photo guidance. Claims like "Vinted requires 4:5 at 1080x1350" are third-party guesses.</li>
                <li><strong class="text-[#4A2C2C]">The search grid crops your first photo to a fixed portrait window.</strong> We inspected the live catalog: grid thumbnails are served as 310x430 pixel portrait crops of your first photo, regardless of the shape you uploaded. A landscape photo loses its left and right edges in exactly the view where buyers decide whether to tap.</li>
                <li><strong class="text-[#4A2C2C]">Item pages preserve your ratio but downscale hard.</strong> Full listing photos are re-encoded to WebP and served at roughly 800 pixels on the long side. Uploading a 4000px export gains you nothing; a sharp 1080-1600px photo is already more than Vinted will ever show.</li>
            </ul>
            <p>The practical spec, based on how the pipeline behaves: <strong class="text-[#4A2C2C]">portrait, 3:4 ratio (the default on most phone cameras), around 1080x1440 pixels, item centered, saved as JPEG or PNG.</strong> For the full breakdown of what Vinted does to your uploads, see our companion piece, <a href="/guides/vinted-photo-size">What Size Should Vinted Photos Be?</a></p>

            <InfoBox type="note" title="iPhone sellers: convert HEIC first">
                Your camera saves .HEIC files. The Vinted app handles them, but browsers and desktop editing tools often do not. If you organize or edit listing photos on a computer, convert them first with our <a href="/heic-to-jpeg">HEIC to JPEG converter</a> - and see <a href="/guides/heic-to-jpeg-or-webp-wordpress">Should I convert HEIC to JPEG or WebP for WordPress uploads?</a> if you also sell on your own site.
            </InfoBox>
        </section>

        <section id="privacy" class="scroll-mt-24">
            <SectionHeading>The Privacy Check Most Sellers Skip</SectionHeading>
            <p>Listing photos taken at home can reveal more than the item: reflections, paperwork in the background, and the photo's hidden EXIF metadata, which can include the exact GPS coordinates of where it was taken. Vinted's own guidance already covers the visible half - avoid your face, blur identifiable features, and never share personal details in photos or chat.</p>
            <p>The invisible half is metadata. Phone cameras embed EXIF data in every shot: device model, timestamp, and (if location services are on for the camera) GPS coordinates of your home. Marketplaces typically re-encode uploads, which in practice removes most metadata - but "typically" and "most" are doing heavy lifting there, and the photos also sit in your cloud library, get shared in chats, and get reused across platforms that behave differently. The robust habit is stripping metadata yourself before upload, stated explicitly as part of your workflow rather than assumed. Our guide to <a href="/guides/exif-data-risks-image-compression-2026">the risks of EXIF data in image compression</a> covers what leaks and why.</p>

            <InfoBox type="tip" title="Two-second background scan">
                Before shooting, scan for window views that identify your street, letters with your address, screens, and mirrors. Cheaper than editing them out afterwards.
            </InfoBox>
        </section>

        <!-- Workflow card -->
        <section id="mochify-workflow" class="scroll-mt-24 bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-9 not-prose">
            <h2 class="text-[1.75rem] font-black text-[#4A2C2C] mt-0 mb-4">Mochify Workflow: Fix a Whole Clear-Out in One Prompt</h2>
            <p class="text-base mb-7">You can turn a camera roll of casual phone shots into a consistent, portrait-cropped, metadata-free Vinted listing set with one plain-English instruction. Mochify's Magic Flow takes a described outcome and applies the right crop, size, format, and cleanup automatically:</p>
            <ol class="space-y-4 list-none p-0 m-0">
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">1</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Shoot everything first</strong>
                        <p class="text-base m-0">One pass per item: front, back, label, fabric, flaws. Do not worry about exact framing; leave margin around each item.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">2</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Open Mochify</strong>
                        <p class="text-base m-0">Go to <a href="/vinted-seller">mochify.app/vinted-seller</a> in your browser. No install needed. Without an account you can process up to 3 images per session; a free account covers 25 images per month, with a 3-file batch size and 20MB per file.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">3</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Describe the result</strong>
                        <p class="text-base m-0">Type a prompt such as: "crop these to 3:4 portrait, center the item, resize to 1440px tall, convert to JPEG, and strip all metadata". Magic Flow parses the instruction, then Mochify's C++ engine executes it: smart cropping detects the item and keeps it centered in the new portrait frame, and the explicit "strip all metadata" removes EXIF, including GPS.</p>
                    </div>
                </li>
                <li class="flex gap-4 items-start">
                    <span class="shrink-0 w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center mt-0.5">4</span>
                    <div class="min-w-0 flex-1">
                        <strong class="block text-[#4A2C2C] text-lg mb-1.5">Download and list</strong>
                        <p class="text-base m-0">You get web-ready JPEGs at a consistent size and ratio, safe for the grid crop and free of location data. Upload straight to your Vinted listing.</p>
                    </div>
                </li>
            </ol>
            <p class="text-base mt-7 mb-0">Two upgrades worth knowing about. High-volume sellers on the Seller or Pro plan get 25-file batches and 75MB files, which turns a 60-photo clear-out from a session-by-session job into three drag-and-drops. And background removal - placing your item on a clean white background, the brand-listing look - is part of the standard toolkit on every plan, including Free.</p>
            <p class="text-base text-[#875F42] mt-4 mb-0">A note on privacy, because clothes photographed in your home are personal data in every sense: images sent to Mochify are streamed into server memory at <code class={inlineCode}>api.mochify.app</code>, processed, and wiped immediately. No disk writes, no logs containing your files, zero retention. Our <a href="/guides/privacy-image-optimization">privacy and image optimization guide</a> explains the model in depth.</p>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat Sheet</SectionHeading>
            <ScrollableTable class="my-6">
                <table class="w-full min-w-[480px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">What</th>
                            <th class="text-left px-4 py-3 text-[#4A2C2C] font-black text-sm border-b border-pink-100">The move</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Orientation</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Portrait, 3:4 ratio (phone default)</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Size</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">~1080x1440px; anything beyond ~1600px is wasted</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Format</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">JPEG or PNG (convert iPhone HEIC first)</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">First photo</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Entire item, centered, no collage</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Photos per listing</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Up to 20; use 5-8 minimum, more for branded items</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Light</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Daylight near a window; no flash, no filters</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Background</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Plain wall, floor, or white sheet</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Style</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Flat lay or hanger; worn optional (keep your face out)</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Honesty</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Photograph every flaw; close-ups of labels and stitching</td>
                        </tr>
                        <tr class="bg-[#FDFBF7] align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50 font-bold">Privacy</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31] border-b border-pink-50">Scan backgrounds; strip EXIF metadata before upload</td>
                        </tr>
                        <tr class="bg-white align-top">
                            <td class="px-4 py-3 text-sm text-[#6C3F31] font-bold">Batch fix</td>
                            <td class="px-4 py-3 text-sm text-[#6C3F31]">One Magic Flow prompt: crop 3:4, center, JPEG, strip metadata</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollableTable>
        </section>

        <!-- FAQ -->
        <GuideFAQs items={faqs} />

        <!-- CTA -->
        <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-8 md:p-10 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <h3 class="text-[1.75rem] font-black text-[#4A2C2C] relative z-10 mb-3">Selling this weekend?</h3>
            <p class="text-[#6C3F31] max-w-lg mx-auto relative z-10 mb-6 text-base">Batch-fix your listing photos in one prompt - just describe it, like <em>"crop these to 3:4 portrait, center the item, convert to JPEG, and strip all metadata"</em>. Free for up to 25 images a month, no card needed.</p>
            <a href="/vinted-seller" class="relative z-10 inline-flex items-center gap-3 px-7 py-3.5 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                Try the Vinted photo optimizer →
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
