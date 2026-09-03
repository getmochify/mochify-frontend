<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GlassFAQs from '$lib/components/guide-demo/GlassFAQs.svelte';
    import GlassCTA from '$lib/components/guide-demo/GlassCTA.svelte';
    import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
    import GlassPanel from '$lib/components/guide-demo/GlassPanel.svelte';
    import GlassInfoBox from '$lib/components/guide-demo/GlassInfoBox.svelte';
    import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
    import StepList from '$lib/components/guide-demo/StepList.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';

    // Built from the content-ops handoff (article-originals/bring-your-own-bucket-s3-r2.html,
    // spec v1) and rendered with the guide-demo component set - the open reading
    // column and mochi glass surfaces previewed at /guides/style-demo. First
    // publish, so there is no dateModified and no visible Updated line.

    const metadata = {
        title: "Bring Your Own Bucket: Send Processed Images Straight to Your Own S3 or R2",
        seoTitle: "Bring Your Own Bucket - Processed Images to Your S3 or R2",
        description: "Send every processed image straight into your own S3, R2, or S3-compatible bucket. Seller and Pro, write-only, one-object pre-signed URLs, zero retention.",
        category: "Data Privacy",
        readTime: "18 min read",
        date: "September 3, 2026"
    };

    const toc = [
        { id: "the-short-answer", label: "The short answer" },
        { id: "what-it-does", label: "What Bring your own bucket does (and does not do)" },
        { id: "who-holds-the-key", label: "Who holds the key: pre-signed URLs, explained for buyers" },
        { id: "zero-retention", label: "Why zero retention is unchanged with a bucket connected" },
        { id: "buckets-and-cdns", label: "Where the output goes next: buckets, CDNs, and your storefront" },
        { id: "costs", label: "What it costs on your side" },
        { id: "scoping-the-key", label: "Scoping the key on your side" },
        { id: "mochify-workflow", label: "Mochify Workflow: connect once, process in plain English" },
        { id: "cheat-sheet", label: "Cheat Sheet: where does my file go on each Mochify surface?" },
        { id: "faq", label: "FAQ" }
    ];

    const workflowSteps = [
        { title: "Connect the bucket.", html: "<p>On a Seller or Pro account, open <strong>Dashboard → Connections</strong> and choose Bring your own bucket. It accepts Amazon S3, Cloudflare R2, or an S3-compatible endpoint. Use a dedicated bucket or prefix and a narrowly scoped key (see the section above). This is done once.</p>" },
        { title: "Upload as usual.", html: "<p>Drop up to 25 files per batch, up to 75 MB each, into the web app. Inputs still travel from your browser to <code>api.mochify.app</code>; the bucket is for outputs.</p>" },
        { title: "Describe the job.", html: "<p>A few prompts that reflect how stores and agencies actually phrase the work: \"make these web-ready, WebP, longest edge 1600 px\"; \"convert to AVIF and strip EXIF\"; \"compress for Shopify product listings, keep under 300 KB\"; \"square-crop to the product and remove the background\". Background removal and saliency-guided smart cropping are standard operations, available on every tier, and can be invoked in the same prompt. For a bulk square crop you can also use the <a href=\"https://mochify.app/solutions/bulk-ai-square-cropper\">Bulk AI Square Cropper</a>, and for transparent cutouts the <a href=\"https://mochify.app/solutions/remove-background-webp\">background remover with WebP output</a>.</p>" },
        { title: "Let the results land.", html: "<p>Each processed file is written from the processing container straight into your bucket over a one-object pre-signed URL. Your CDN serves it from there.</p>" },
        { title: "Do the rest where you always did.", html: "<p>Marketplace listings, CMS uploads, and client handovers pull from the bucket, which is now the single optimized master library rather than one of several downloads folders.</p>" }
    ];

    const faqItems = [
        { q: "Does Mochify store my processed images?", a: "No. Images and PDFs are streamed into memory at <code>api.mochify.app</code>, processed, and discarded, with no disk writes and no file data in logs. The one documented exception is the hosted MCP server, which holds the compressed output for about five minutes so its download URL can resolve. With Bring your own bucket, the result is written straight into your bucket and is not staged on our side at all." },
        { q: "Does Mochify need read access to my bucket?", a: "The feature is write-only: it exists to put processed objects into your bucket, and the pipeline's pre-signed URL cannot list or read anything. The Connections screen tells you what the setup asks for, and a dedicated bucket or prefix with a narrowly scoped key is the recommended posture whatever service you connect." },
        { q: "What is a pre-signed URL, and why should I care?", a: "A pre-signed URL is a link that grants one specific operation on one specific object until it expires, without exposing the underlying credential; both AWS and Cloudflare R2 document it as a standard S3 mechanism. You should care because it bounds the damage a compromised component could do: with a one-object, minutes-long URL, the worst case is a single write, not a readable catalog." },
        { q: "Can I use Backblaze B2, Wasabi, DigitalOcean Spaces, or MinIO?", a: "The feature supports Amazon S3, Cloudflare R2, and S3-compatible buckets, and those providers all document S3-compatible APIs. Point the connection at the provider's S3 endpoint; if a particular provider misbehaves, tell us through the contact page so we can look at it." },
        { q: "Is Bring your own bucket available on the Free plan or with a Day Pass?", a: "No. It is a Seller and Pro feature. Free accounts and Day Pass users get results back in the browser as usual. A Day Pass is a $2, 24-hour unlock that needs no account, and a bucket connection needs an account to belong to." },
        { q: "Can the API, CLI, or MCP server write to my bucket?", a: "Not at launch. Bucket output is a web app feature; the REST API, the CLI, and both MCP servers return results to the caller, and you write them wherever you like from there. If you need this from a developer surface, let us know; it helps us prioritize." },
        { q: "Does using my own bucket change my GDPR or DPA position?", a: "It simplifies it. Processing is still covered by the Data Processing Agreement, which describes in-memory processing with no retention (and the MCP pickup exception). The result is then stored by you, in your bucket, under your access and lifecycle controls, so there is no additional storage on a sub-processor to account for." },
        { q: "What about Google Drive?", a: "Google Drive shows on the Connections screen as \"Coming soon\". It is not available yet, so plan on an S3, R2, or S3-compatible bucket for now." }
    ];

    const related = [
        { href: "/guides/privacy-image-optimization", title: "Privacy & Image Optimization: A Comprehensive Guide (2026)", desc: "the full zero-retention model this feature extends, and how to read the DPA for a client review." },
        { href: "/guides/top-5-secure-image-compressors-2026", title: "Top 5 Secure Image Compressors of 2026", desc: "what \"secure\" should mean when you compare tools, including where your files sit afterwards." },
        { href: "/guides/european-alternative-tinypng-gdpr-compliant-image-compression", title: "A European Alternative to TinyPNG (GDPR, Zero-Retention)", desc: "the compliance case for in-memory processing, which a bucket connection leaves exactly as it was." },
        { href: "/guides/why-we-relaxed-zero-retention-for-mcp", title: "Why We Relaxed Our Zero-Retention Policy for MCP", desc: "the one surface with a five-minute pickup window, and why." },
        { href: "/guides/exif-data-risks-image-compression-2026", title: "The Risks of EXIF Data in Image Compression (2026)", desc: "what to strip before a file lands in a bucket your CDN serves to the world." }
    ];
</script>

<ReadProgress />

<svelte:head>
    <title>Bring Your Own Bucket - Processed Images to Your S3 or R2 | Mochify</title>
    <meta name="description" content={metadata.description}>
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content="https://mochify.app/guides/bring-your-own-bucket-s3-r2" />
    <meta property="og:site_name" content="Mochify" />
    <meta property="og:locale" content="en" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Bring Your Own Bucket: Send Processed Images Straight to Your Own S3 or R2",
        "description": "Send every processed image straight into your own S3, R2, or S3-compatible bucket. Seller and Pro, write-only, one-object pre-signed URLs, zero retention.",
        "url": "https://mochify.app/guides/bring-your-own-bucket-s3-r2",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://mochify.app/guides/bring-your-own-bucket-s3-r2"
        },
        "datePublished": "2026-09-03",
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
            { "@type": "Thing", "name": "Amazon S3" },
            { "@type": "Thing", "name": "Cloudflare R2" },
            { "@type": "Thing", "name": "pre-signed URL" },
            { "@type": "Thing", "name": "object storage" },
            { "@type": "Thing", "name": "image optimization" },
            { "@type": "Thing", "name": "GDPR" }
        ],
        "keywords": "bring your own bucket, S3, Cloudflare R2, S3-compatible storage, pre-signed URL, image processing, zero retention, object storage, CDN",
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
            { "@type": "ListItem", "position": 3, "name": "Bring Your Own Bucket: Send Processed Images Straight to Your Own S3 or R2", "item": "https://mochify.app/guides/bring-your-own-bucket-s3-r2" }
        ]
        }
    </script>
</svelte:head>

<!-- Single max-w-3xl reading column: header, prose, and every card share the
     same container edges. -->
<article class="relative mx-auto w-full max-w-3xl px-5 sm:px-6 md:px-0 pt-6 md:pt-0 text-lg text-[#6C3F31] leading-relaxed">

    <!-- Top-only mochi wash: absolute (scrolls away with the page, unlike the
         fixed BlobBackground), full-bleed via the 100vw trick, and faded out
         by a mask before the body text starts. -->
    <div class="hero-wash" aria-hidden="true"></div>

    <header class="mb-12 md:mb-14">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#F06292] mb-3 mt-0">
            {metadata.category} · Guide
        </p>
        <h1 class="text-3xl md:text-[2.75rem] font-black text-[#4A2C2C] tracking-tight leading-[1.1] mb-0">
            Bring Your Own Bucket: Send Processed Images Straight to Your Own S3 or R2
        </h1>
        <div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
        <p class="mt-5 text-sm font-bold text-[#875F42] mb-0">
            {metadata.readTime} · {metadata.date} · Mochify Engineering Team
        </p>

        <p class="article-intro text-xl text-[#6C3F31] opacity-90 leading-relaxed mt-8 mb-0">
            Bring your own bucket lets Seller and Pro accounts have every processed image written straight into an Amazon S3, Cloudflare R2, or S3-compatible bucket they already own, so the optimized file lands in the storage it was always headed for instead of coming back to your device as a download to file away. Nothing changes on Mochify's side, because Mochify never stores image data in either case: the file is processed in memory and discarded. The pipeline never holds your credential either: for each result it is handed a pre-signed URL that is good for one object and a few minutes, and nothing else. This guide explains what that means in plain terms, who holds which key, why it sits inside our zero-retention model rather than beside it, how the output fits a bucket that already has a CDN in front of it, what it costs on your side, and where the edges are.
        </p>

        <GlassPanel>
            <p>
                <strong class="text-[#4A2C2C]">Published September 3, 2026 by the Mochify Engineering Team.</strong>
                A plain-language explainer of the Bring your own bucket feature for stores and agencies, written from the live architecture page and verified against the product ledger.
            </p>
        </GlassPanel>
    </header>

    <div class="space-y-12">

        <!-- TOC -->
        <section>
            <GuideTOC items={toc} />
        </section>


        <section id="the-short-answer" class="scroll-mt-24">
            <SectionHeading>The short answer</SectionHeading>
            <GlassPanel label="Key takeaway">
                <p>With Bring your own bucket connected, you upload as normal, describe the job in plain English, and the finished files are written from our processing container directly into your bucket. The original is streamed into memory, processed, and discarded, exactly as it is for every image job. Without a bucket, the result comes back to your browser and Mochify keeps nothing. With a bucket, the result goes to your bucket and Mochify keeps nothing. The only thing that changes is the delivery address.</p>
            </GlassPanel>
            <p class="mb-4">Three facts do most of the work in this guide. First, it is write-only: Mochify writes results into the bucket and does not read from it, list it, or touch anything already there. Second, the pipeline is handed a capability, not a credential: a pre-signed URL that can put one named object and expires in minutes. Third, it is available on Seller and Pro, in the web app, and not on Free or on a Day Pass, because a pass has no account to attach a bucket to.</p>
            <p class="mb-4">If you run a store, an agency, or a build pipeline that already keeps its image library in object storage, this removes the step everyone dislikes: downloading a zip of optimized files and re-uploading it to the place they were always going to end up.</p>
        </section>

        <section id="what-it-does" class="scroll-mt-24">
            <SectionHeading>What Bring your own bucket does (and does not do)</SectionHeading>
            <p class="mb-4">Bring your own bucket is an output destination, not a sync tool. You point Mochify at a bucket from <strong>Dashboard → Connections</strong>, and from then on processed results are written into that bucket instead of coming back to you as a download to file away.</p>
            <p class="mb-4">What it does:</p>
            <ul class="list-disc pl-6 space-y-3 marker:text-[#F06292] my-6">
                <li><strong>Writes results into storage you own.</strong> Amazon S3, Cloudflare R2, or any bucket that speaks the S3 API. Backblaze B2, Wasabi, DigitalOcean Spaces, MinIO, Tigris, and Hetzner all document S3-compatible endpoints, and the pattern is the same for each.</li>
                <li><strong>Keeps the input path unchanged.</strong> Files still upload from your browser to <code>api.mochify.app</code> over HTTPS and are processed in memory. The bucket is where the answer goes, not where the question comes from.</li>
                <li><strong>Stays write-only.</strong> The connection exists to put objects. It is not used to read your existing images, enumerate the bucket, or delete anything.</li>
            </ul>
            <p class="mb-4">What it does not do, at launch:</p>
            <ul class="list-disc pl-6 space-y-3 marker:text-[#F06292] my-6">
                <li><strong>It is a web app feature.</strong> The REST API, the CLI, and both MCP servers return results to the caller the way they always have. Do not build a script on the assumption that an API call will land a file in your bucket; that is not how the feature ships today.</li>
                <li><strong>It is not a Free or Day Pass feature.</strong> Bucket output is on Seller ($7.99/month) and Pro ($24.99/month). A Day Pass is a $2, 24-hour, no-account unlock, and there is no account for a bucket to belong to.</li>
                <li><strong>It is not a file manager.</strong> Mochify does not browse, organize, or clean up your bucket. Your storage stays your business.</li>
            </ul>
            <p class="mb-4">Google Drive appears next to it on the Connections screen marked "Coming soon". That is all it is for now, so plan around buckets.</p>
        </section>

        <section id="who-holds-the-key" class="scroll-mt-24">
            <SectionHeading>Who holds the key: pre-signed URLs, explained for buyers</SectionHeading>
            <p class="mb-4">The safest way for a service to write into your bucket is for the service to never touch your bucket credential at all, and that is how this works: one isolated component holds your encrypted key, and the processing pipeline only ever receives a short-lived, single-object URL derived from it. Every write-your-own-bucket feature on the market has to answer "who holds my key," and most vendor pages skip the question. Here is the honest version.</p>
            <p class="mb-4">A pre-signed URL is a standard object-storage mechanism. Amazon's own documentation puts it simply: "A presigned URL gives you access to the object identified in the URL, provided that the creator of the presigned URL has permissions to access that object," and "the capabilities of a presigned URL are limited by the permissions of the user who created it" (<a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html" target="_blank" rel="noopener noreferrer">AWS S3 User Guide</a>). Cloudflare R2 implements the same idea through its S3-compatible API and describes it as "granting temporary access to objects without exposing your API credentials" (<a href="https://developers.cloudflare.com/r2/api/s3/presigned-urls/" target="_blank" rel="noopener noreferrer">Cloudflare R2 docs</a>). The URL names one object, one operation, and one expiry. Whoever holds it can do that one thing until the clock runs out, and nothing else. This URL is plumbing between our services and your bucket; you never see it, and it is unrelated to the download link the hosted MCP server returns.</p>
            <p class="mb-4">Our <a href="https://mochify.app/architecture">architecture and data handling page</a> states how Mochify uses it, and it is worth quoting because this is the one feature where we hold a credential on your behalf:</p>
            <ul class="list-disc pl-6 space-y-3 marker:text-[#F06292] my-6">
                <li>"Your keys are encrypted and isolated. The secret is sealed with AES-256-GCM under a key held by a single service. The dashboard cannot decrypt it, and the image pipeline never sees it at all."</li>
                <li>"The pipeline receives a capability, not a credential. When a result is written to your bucket, the processing service is handed a pre-signed URL valid for one object and a few minutes. It cannot choose the destination, list your bucket, or read anything from it."</li>
            </ul>
            <p class="mb-4">Two details deserve a plain-English translation. AES-256-GCM is authenticated encryption: it protects the stored key against being read and against being tampered with, and it is specified by NIST in <a href="https://csrc.nist.gov/pubs/sp/800/38/d/final" target="_blank" rel="noopener noreferrer">SP 800-38D</a>. Sealing your secret "under a key held by a single service" is the envelope pattern, where the thing that can unwrap the secret lives in one place and the systems that do the work are never given it.</p>
            <p class="mb-4">The practical consequence is blast radius. AWS lets a pre-signed URL live for up to seven days when it is minted with long-term credentials; ours lives for minutes and covers one object. If the processing container were ever compromised, the most an attacker could do with what it holds is finish writing the file it was already writing. It could not read your catalog, list your bucket, or pick a different destination, because the URL it was given cannot do any of those things.</p>
        </section>

        <section id="zero-retention" class="scroll-mt-24">
            <SectionHeading>Why zero retention is unchanged with a bucket connected</SectionHeading>
            <p class="mb-4">Writing a result into your bucket does not add a copy on Mochify's side, because the result never stops anywhere on Mochify's side: it travels from the processing container straight to your storage, and the processing container itself has no disk to keep it on. The zero-retention line for images and PDFs is unchanged.</p>
            <p class="mb-4">It helps to be precise about what that line is, because it is not one blanket claim. Images and PDFs travel to <code>api.mochify.app</code> over HTTPS, are streamed into memory, processed, and discarded, with no disk writes and no logs containing file data. That holds across the web app, the REST API, the CLI, and both MCP servers. The hosted MCP server is the one documented exception: it holds the <em>compressed output</em> in a pickup store for about five minutes so the short-lived <code>files.mochify.app</code> URL can resolve, then evicts it; we wrote up the reasoning in <a href="https://mochify.app/guides/why-we-relaxed-zero-retention-for-mcp">why we relaxed our zero-retention policy for MCP</a>. Video is different again: it is processed in the browser and never leaves your device.</p>
            <p class="mb-4">Bring your own bucket sits inside that model, not outside it. The <code>/architecture</code> page says the result "does not pass back through your browser and it is not staged anywhere in between," which is the whole point: there is no Mochify-side copy to retain, expire, or delete. The copy that exists is in your bucket, under your account, subject to your lifecycle rules and your access policy.</p>
            <p class="mb-4">For the agency and regulated-data audience, that distinction matters in contract terms as well. Under GDPR a processor may only engage a further processor with the controller's authorization, must apply security measures appropriate to the risk, and must not keep personal data longer than necessary. A pipeline that holds nothing has very little to account for on the retention side, and a result written to your own bucket is stored by you, under your controls, rather than by a sub-processor. Our <a href="https://mochify.app/dpa">Data Processing Agreement</a> covers the processing itself; note that it describes in-memory processing and the MCP pickup exception, and does not add any bucket-related retention, because there is none to add. If you need the DPA language for a specific client review, <a href="https://mochify.app/guides/privacy-image-optimization">privacy and image optimization for agencies</a> walks through how to read it.</p>
        </section>

        <section id="buckets-and-cdns" class="scroll-mt-24">
            <SectionHeading>Where the output goes next: buckets, CDNs, and your storefront</SectionHeading>
            <p class="mb-4">Once the file is in your bucket, the CDN you already have in front of that bucket serves it, and nothing new has to be hosted. This is the step every tutorial on "image processing with S3" stops short of, and it is the step the forum threads keep asking about ("how can we show the processed images from the AWS S3 bucket as product pictures?").</p>
            <p class="mb-4">The two mainstream patterns:</p>
            <ul class="list-disc pl-6 space-y-3 marker:text-[#F06292] my-6">
                <li><strong>Cloudflare R2 behind a custom domain.</strong> Cloudflare's documentation notes that "domain access through a custom domain allows you to use Cloudflare Cache to accelerate access to your R2 bucket" (<a href="https://developers.cloudflare.com/r2/buckets/public-buckets/" target="_blank" rel="noopener noreferrer">R2 public buckets</a>). A processed <code>hero.webp</code> written to the bucket is a cacheable <code>https://img.yourdomain.com/hero.webp</code> a moment later.</li>
                <li><strong>Amazon S3 behind CloudFront with origin access control.</strong> The bucket stays private; CloudFront is the only principal allowed to read from it (<a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html" target="_blank" rel="noopener noreferrer">CloudFront developer guide</a>). The same object, served from the edge, with S3 Block Public Access still on.</li>
            </ul>
            <p class="mb-4">Two honest caveats. Object storage does not transform anything on its own; as one Cloudflare community answer puts it, "R2 is just an object storage bucket. It doesn't offer such transformations natively." That is exactly the gap this feature fills: the transformation happens at Mochify, and the bucket receives the finished asset. And if your images are listed on a marketplace or a hosted storefront, the bucket is your master library, not the listing. Shopify, for example, serves product media from its own CDN and accepts images up to 5000 x 5000 pixels and under 20 MB (<a href="https://help.shopify.com/en/manual/products/product-media/product-media-types" target="_blank" rel="noopener noreferrer">Shopify Help Center</a>); you still upload to the platform, but you upload the optimized file from a bucket you control rather than a downloads folder. For the per-platform limits, see our <a href="https://mochify.app/guides/product-image-requirements-marketplace-guide">marketplace product image requirements guide</a>.</p>
            <p class="mb-4">Why bother optimizing before the file ever reaches the bucket? Because image bytes are still the largest thing on the page. The 2025 HTTP Archive Web Almanac reports the median mobile home page carrying 911 KB of images and the median desktop page 1,058 KB, more than any other resource type (<a href="https://almanac.httparchive.org/en/2025/page-weight" target="_blank" rel="noopener noreferrer">Web Almanac: Page Weight</a>), and images are the Largest Contentful Paint element on 76.0% of mobile pages and 85.3% of desktop pages (<a href="https://almanac.httparchive.org/en/2025/performance" target="_blank" rel="noopener noreferrer">Web Almanac: Performance</a>). A bucket full of unoptimized originals behind a fast CDN is still a slow site.</p>
        </section>

        <section id="costs" class="scroll-mt-24">
            <SectionHeading>What it costs on your side</SectionHeading>
            <p class="mb-4">Bring your own bucket is included in Seller and Pro; the only new line item is your own bucket's storage and requests, which for most stores and agencies is small change next to the plan. The numbers depend on the provider:</p>
            <ul class="list-disc pl-6 space-y-3 marker:text-[#F06292] my-6">
                <li><strong>Cloudflare R2</strong> publishes $0.015 per GB-month for Standard storage, $4.50 per million Class A operations (writes), $0.36 per million Class B operations (reads), and no egress charge: "egressing directly from R2 ... does not incur data transfer (egress) charges and is free" (<a href="https://developers.cloudflare.com/r2/pricing/" target="_blank" rel="noopener noreferrer">R2 pricing</a>). Each processed image is one write, so a 10,000-image catalog refresh costs a few cents in operations.</li>
                <li><strong>Amazon S3</strong> publishes per-region storage and request rates on its pricing page, with the first 100 GB per month of data transfer out to the internet free across AWS services. Beyond that allowance, egress is the number to watch on AWS; it is the reason many image-heavy sites put CloudFront or a third-party CDN in front of S3 rather than serving from the bucket.</li>
                <li><strong>S3-compatible providers</strong> each publish their own rates. Several compete on egress; check the provider's page rather than assuming S3's model.</li>
            </ul>
            <p class="mb-4">The cost you are not paying is the pipeline. The build-it-yourself route (a Lambda function, an image library, an API gateway, a queue, and someone to keep it patched) is free in cloud fees and expensive in hours. This feature is for the team that would rather not own that.</p>
        </section>

        <section id="scoping-the-key" class="scroll-mt-24">
            <SectionHeading>Scoping the key on your side</SectionHeading>
            <p class="mb-4">Whatever service you connect to a bucket, the right posture on your side is a key that can only do what the feature needs, on only the bucket it needs, and Bring your own bucket is write-only by design, so a narrowly scoped key lines up with how it is used. This section is general object-storage hygiene rather than a Mochify setup manual; the Connections screen tells you what it asks for.</p>
            <ul class="list-disc pl-6 space-y-3 marker:text-[#F06292] my-6">
                <li><strong>Dedicated bucket or prefix.</strong> Give processed output its own bucket, or its own prefix in an existing one. It keeps the blast radius small and makes the lifecycle rules simple.</li>
                <li><strong>Least privilege.</strong> AWS's own guidance is to "grant only the permissions that are required to perform a task" (<a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html" target="_blank" rel="noopener noreferrer">S3 security best practices</a>), and its example bucket policies include an <code>s3:PutObject</code>-only grant for a third party (<a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html" target="_blank" rel="noopener noreferrer">example bucket policies</a>). On R2, API tokens can be scoped to specific buckets with read-only or read-and-write permission (<a href="https://developers.cloudflare.com/r2/api/s3/tokens/" target="_blank" rel="noopener noreferrer">R2 tokens</a>).</li>
                <li><strong>Keep the bucket private.</strong> Block Public Access on S3, and serve through the CDN. Encryption at rest is on by default: since January 2023 every new S3 object is encrypted with SSE-S3 unless you choose another option.</li>
                <li><strong>Rotate on your schedule.</strong> A dedicated key for one integration is easy to rotate or revoke without touching anything else in your account.</li>
            </ul>
            <p class="mb-4">One more reason the pre-signed model is worth insisting on from any vendor: because the pipeline only ever holds a one-object URL, a narrowly scoped key is all it can ever exercise. A service that instead ships your long-lived credential to every worker cannot make that promise, whatever its permissions policy says.</p>
        </section>

        <section id="mochify-workflow" class="scroll-mt-24">
            <SectionHeading>Mochify Workflow: connect once, process in plain English</SectionHeading>
            <p class="mb-4">The workflow is the normal Magic Flow workflow with one setup step in front of it. Magic Flow is Mochify's natural-language interface: you describe the outcome ("compress these for the product grid, max 2048 px, strip location data"), a language model parses the request, and the native C++ engine executes it. With a bucket connected, the results of that request are written into your storage.</p>

            <GlassPanel>
                <StepList steps={workflowSteps} />
            </GlassPanel>

            <p class="mb-4">For developers: the REST API (<code>POST /v1/squish</code> on <code>api.mochify.app</code>, authenticated with <code>Authorization: Bearer &lt;key&gt;</code>), the <code>mochify</code> CLI, and the local and hosted MCP servers all return results to the caller as before. Bucket output is a web app feature at launch. If your automation needs files in a bucket today, write them there from the client that receives the result, using your own scoped key, which is the same pattern we use on our side.</p>
            <GlassInfoBox type="note" title="Privacy note for this path">
                Images travel to <code>api.mochify.app</code> over HTTPS, are streamed into memory, processed, and discarded; nothing is written to disk and nothing is logged. With a bucket connected, the result then travels from the processing container straight to your storage and is not staged in between. Mochify retains nothing in either case; the only copy of the result is the one in your bucket.
            </GlassInfoBox>
        </section>

        <section id="cheat-sheet" class="scroll-mt-24">
            <SectionHeading>Cheat Sheet: where does my file go on each Mochify surface?</SectionHeading>

            <GuideTable class="my-6">
                <table> 
                    <thead>
                        <tr><th>Surface</th><th>Where the input goes</th><th>Where the result goes</th><th>Retention on Mochify's side</th></tr>
                    </thead> 
                    <tbody> 
                        <tr><td>Web app, no bucket connected</td><td><code>api.mochify.app</code>, in memory</td><td>Back to your browser</td><td>None: processed in RAM, discarded</td></tr> 
                        <tr><td>Web app, <strong>Bring your own bucket</strong> (Seller/Pro)</td><td><code>api.mochify.app</code>, in memory</td><td>Straight into your S3 / R2 / S3-compatible bucket via a one-object, minutes-long pre-signed URL</td><td>None: not staged; the copy is yours</td></tr> 
                        <tr><td>REST API (<code>/v1/squish</code>, <code>/v1/pdf</code>)</td><td><code>api.mochify.app</code>, in memory</td><td>Back to the caller in the response</td><td>None</td></tr> 
                        <tr><td>CLI (<code>mochify</code>) and local MCP server (<code>mochify serve</code>)</td><td><code>api.mochify.app</code>, in memory</td><td>Written to your local disk by the binary</td><td>None, end to end</td></tr> 
                        <tr><td>Hosted MCP server (<code>mcp.mochify.app</code>)</td><td><code>api.mochify.app</code>, in memory</td><td>A short-lived download URL on <code>files.mochify.app</code></td><td>Original discarded; compressed output held about 5 minutes, then evicted</td></tr> 
                        <tr><td>Video (web app only)</td><td>Stays in your browser</td><td>Stays in your browser</td><td>Never leaves your device</td></tr> 
                    </tbody> 
                </table>
            </GuideTable>

            <p class="mb-4">Bring your own bucket: Seller and Pro only, web app only at launch, write-only, S3 / R2 / S3-compatible. Not on Free, not on a Day Pass.</p>
        </section>

        <!-- FAQ -->
        <GlassFAQs items={faqItems} />

        <!-- Final CTA -->
        <GlassCTA
            heading="Connect a bucket"
            href="/pricing"
            label="See Seller and Pro plans →"
        >
            Connect a bucket on a Seller or Pro plan, drop in a batch, and tell Magic Flow what you need: <em>make these web-ready, WebP, longest edge 1600 px</em>. The results land straight in your own S3, R2, or S3-compatible storage, with nothing kept on Mochify's side.
        </GlassCTA>

        <RelatedGuidesGrid guides={related} />

    </div>
</article>

<style>
    /* The breadcrumb renders in the shared guides layout at max-w-4xl; align
       it with this page's 3xl reading column. The full trail stays visible,
       current-page crumb included, so what the reader sees matches the
       BreadcrumbList JSON-LD. At rollout the width constraint belongs in the
       layout: constrain <main> to 3xl. */
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
