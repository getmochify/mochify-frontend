<script lang="ts">
    const metadata = {
        title: "Image Optimization Guides | Mochify",
        description: "Learn about modern image formats, compression techniques, and optimization strategies with our in-depth guides."
    };

    const guides = [
        {
            title: "Fuji HIF Files Explained: How to Convert X-T5 / X-H2 / X100VI / X-T50 HIF to JPEG",
            description: "Fuji's HIF files are highly efficient and better quality at 10-bit but they're not supported everywhere, which can lead to frustration. Learn how to convert your camera's .HIF files to JPGs",
            url: "/guides/fujifilm-hif-to-jpg",
            category: "Image Formats",
            readTime: "5 min read",
            date: "Feb 01, 2026"
        },
        {
            title: "Privacy & Image Optimization: A Comprehensive Guide (2026)",
            description: "Learn how to keep your images secure with zero-retention optimization. The only way to ensure 100% data privacy in 2026 while still getting fast, high-quality compression.",
            url: "/guides/privacy-image-optimization",
            category: "Data Privacy",
            readTime: "6 min read",
            date: "Feb 05, 2026",
            lastUpdated: "Mar 13, 2026"
        },
        {
            title: "Fix \"Next-Gen Formats\" in WordPress (No Plugins) & Boost LCP",
            description: "Boost LCP on your WordPress site by fixing \"Serve images in next-gen formats\" without plugins. A simple, plugin-free workflow for pre-optimizing images with Mochify before uploading to WordPress.",
            url: "/guides/next-gen-image-formats-wordpress",
            category: "WordPress Performance",
            readTime: "15 min read",
            date: "Feb 09, 2026",
            lastUpdated: "Mar 13, 2026"
        },
        {
            title: "The 2026 Guide to Next-Gen Formats: WebP, AVIF, and JPEG XL",
            description: "Your 2MB JPEG homepage hero is killing your LCP score. Google's PageSpeed Insights keeps screaming \"Serve images in next-gen formats,\" but which one should you actually use? WebP has been around since 2010, AVIF promises 50% better compression, and JPEG XL keeps showing up in conversations despite near-zero browser support.",
            url: "/guides/2026-guide-next-gen-formats",
            category: "Image Formats",
            readTime: "20 min read",
            date: "Feb 10, 2026",
            lastUpdated: "Mar 13, 2026"
        },
        {
            title: "Jpegli Guide 2026: Why Jpegli Changes the Quality-Per-Byte Game",
            description: "Boost eBay & Etsy sales with Jpegli. Get 35% better compression than MozJPEG with no quality loss. Master chroma & workflows via Mochify's encoder.",
            url: "/guides/jpeg-in-2026-jpegli",
            category: "Image Optimization",
            readTime: "20 min read",
            date: "Feb 09, 2026"
        },
        {
            title: "The Risks of EXIF Data in Image Compression (2026 Guide)",
            description: "Learn why stripping EXIF metadata during image compression is crucial for privacy and security. Understand the risks of leaving GPS coordinates, device info, and other sensitive data in your images.",
            url: "/guides/exif-data-risks-image-compression-2026",
            category: "Data Privacy",
            readTime: "15 min read",
            date: "Feb 13, 2026"
        },
        {
            title: "The History of Image Compression: From BMP to AVIF & Jpegli (2026 Guide)",
            description: "Trace the evolution of images from BMP to AVIF and Jpegli. Learn how 2026 compression tech boosts Core Web Vitals and SEO for developers and creators.",
            url: "/guides/history-image-compression-2026",
            category: "Image Formats",
            readTime: "15 min read",
            date: "Feb 15, 2026"
        },
        {
            title: "Top 5 Secure Image Compressors of 2026: Privacy, Performance, and Format Support Comparison",
            description: "Compare the best secure image compressors of 2026. Find out which tools offer true zero-retention privacy, support HEIC/AVIF/JPEG XL, and deliver the smallest files.",
            url: "/guides/top-5-secure-image-compressors-2026",
            category: "Image Optimization",
            readTime: "15 min read",
            date: "Feb 17, 2026",
            lastUpdated: "Mar 13, 2026"
        },
        {
            title: "How to Self-Host an Image Optimization API with Docker",
            description: "Tired of uploading your images to third-party services? Learn how to set up your own image optimization API using Docker and the Mochify-Lite engine for secure, private compression.",
            url: "/guides/self-hosting-image-optimization-docker",
            category: "Image Optimization",
            readTime: "5 min read",
            date: "Feb 18, 2026"
        },
        {
            title: "Optimizing Hero Images for Web Performance: A 2026 Guide",
            description: "Learn how to optimize your website's hero images for faster load times and better Core Web Vitals in 2026. A step-by-step guide to choosing the right format, compression settings, and responsive techniques.",
            url: "/guides/optimizing-hero-images",
            category: "Image Optimization",
            readTime: "14 min read",
            date: "Feb 20, 2026"
        },
        {
            title: "AI-Powered Image Compression: How Mochify's Natural Language Feature Works (2026)",
            description: "Describe your image goal in plain English and Mochify's AI picks the right format, size, and settings automatically. Powered by Mistral Small 3.2. No tech knowledge needed.",
            url: "/guides/ai-image-compression-natural-language-2026",
            category: "AI & Automation",
            readTime: "8 min read",
            date: "Mar 08, 2026"
        },
        {
            title: "How to Use Mochify via MCP: AI Agent Image Compression (2026)",
            description: "Connect Mochify to your AI assistant via MCP and compress images with plain English - no manual settings, no uploads to a browser tab. For Claude Desktop, Cursor, and any MCP-compatible client.",
            url: "/guides/mochify-mcp-image-compression-agent-2026",
            category: "AI & Automation",
            readTime: "7 min read",
            date: "Mar 09, 2026"
        },
        {
            title: "A European Alternative to TinyPNG: Privacy-First, Zero-Retention Image Compression",
            description: "Looking for a GDPR-compliant image compressor hosted in the EU? Mochify processes images in memory only, never stores your files, and strips EXIF data by default.",
            url: "/guides/european-alternative-tinypng-gdpr-compliant-image-compression",
            category: "Data Privacy",
            readTime: "15 min read",
            date: "Mar 22, 2026"
        },
        {
            title: "How to Use Jpegli for Shopify Product Images",
            description: "Pre-compress Shopify product images with Jpegli before upload. Stop Shopify's recompression from degrading quality — get ~35% smaller files, faster LCP, and better search rankings.",
            url: "/guides/jpegli-shopify-product-images",
            category: "Quick Guides",
            readTime: "6 min read",
            date: "Apr 06, 2026"
        },
        {
            title: "How Do I Preload AVIF Hero Images in WordPress to Pass the LCP Threshold?",
            description: "Serving AVIF isn't enough — browsers still discover it late. Add a preload hint to your WordPress theme so the hero image starts downloading before the render tree is built, and hit Google's 2.5s LCP target.",
            url: "/guides/preload-avif-hero-images-wordpress-lcp",
            category: "Quick Guides",
            readTime: "3 min read",
            date: "Apr 09, 2026"
        },
        {
            title: "Does Chrome 145 Enable JPEG XL by Default in 2026?",
            description: "Chrome 145 adds JPEG XL decoding support, but the feature is off by default and requires a browser flag. Here is what that means for serving images in 2026.",
            url: "/guides/chrome-145-jpeg-xl-default",
            category: "Quick Guides",
            readTime: "3 min read",
            date: "Apr 10, 2026"
        },
        {
            title: "What Should I Use in 2026: WebP, AVIF, or JPEG XL?",
            description: "In 2026, use AVIF as your primary format with WebP as fallback. JPEG XL is not production-ready for web at ~15% browser support.",
            url: "/guides/what-should-i-use-in-2026-webp-avif-or-jpeg-xl",
            category: "Quick Guides",
            readTime: "2 min read",
            date: "Apr 13, 2026"
        },
        {
            title: "Should I Optimize My Images Before I Upload Them?",
            description: "Almost always yes. A practical guide to pre-upload image optimization covering LCP, EXIF privacy, format choice, and workflows for Shopify, WordPress, and marketplaces.",
            url: "/guides/should-i-optimize-images-before-upload",
            category: "Image Optimization",
            readTime: "15 min read",
            date: "Apr 13, 2026"
        }
    ];
    guides.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
</script>

<svelte:head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description}>
    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Image Optimization Guides | Mochify",
        "url": "https://mochify.app/guides",
        "description": "A curated library of in-depth guides on privacy-first image optimization, EXIF data risks, next-gen formats, WordPress performance, Jpegli compression, and Fujifilm HIF to JPEG workflows.",
        "inLanguage": "en",
        "isPartOf": {
            "@type": "WebSite",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "mainEntity": [
            {
            "@type": "Article",
            "name": "Top 5 Secure Image Compressors for 2026: Privacy-First Optimization",
            "url": "https://mochify.app/guides/top-5-secure-image-compressors-2026"
            },
            {
            "@type": ["TechArticle", "HowTo"],
            "name": "EXIF Data Risks in Image Compression: Strip Metadata for Privacy (2026 Guide)",
            "url": "https://mochify.app/guides/exif-data-risks-image-compression-2026"
            },
            {
            "@type": ["TechArticle", "HowTo"],
            "name": "WebP vs AVIF vs JPEG XL: 2026 Comparison Guide",
            "url": "https://mochify.app/guides/2026-guide-next-gen-formats"
            },
            {
            "@type": ["TechArticle", "HowTo"],
            "name": "Fix \"Serve Images in Next-Gen Formats\" in WordPress (No Plugins) & Boost LCP",
            "url": "https://mochify.app/guides/next-gen-image-formats-wordpress"
            },
            {
            "@type": "TechArticle",
            "name": "JPEG Compression in 2026: Why Jpegli Changes the Quality-Per-Byte Game",
            "url": "https://mochify.app/guides/jpeg-in-2026-jpegli"
            },
            {
            "@type": "TechArticle",
            "name": "Secure Your Images with Zero-Retention Optimization",
            "url": "https://mochify.app/guides/privacy-image-optimization"
            },
            {
            "@type": ["TechArticle", "HowTo"],
            "name": "How to Convert X-T5 / X-H2 / X100VI / X-T50 HIF to JPEG",
            "url": "https://mochify.app/guides/fujifilm-hif-to-jpg"
            }
        ],
        "datePublished": "2026-02-17",
        "dateModified": "2026-02-17"
        }
    </script>
</svelte:head>

<div class="px-4 py-12 sm:px-6 lg:px-8">
        
<header class="text-center mb-16">
    <h1 class="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#FFB3C6] via-[#E0ACD5] to-[#C5A3E0] bg-clip-text text-transparent leading-tight pb-2 mb-6">
        Image Optimization Guides
    </h1>
    <p class="text-xl text-[#875F42] font-medium max-w-2xl mx-auto">
        In-depth articles about modern image formats, compression techniques, and best practices for web performance.
    </p>
</header>

<div class="grid gap-8 mb-24">
    {#each guides as guide}
        <a href={guide.url} class="group block bg-white rounded-3xl p-8 border border-pink-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold uppercase tracking-wider mb-4">
                {guide.category}
            </span>
    
            <h2 class="text-2xl md:text-3xl font-black text-[#4A2C2C] group-hover:text-[#F06292] transition-colors mb-3">
                {guide.title}
            </h2>
            
            <p class="text-[#875F42] leading-relaxed mb-6 opacity-80">
                {guide.description}
            </p>
            
            <div class="flex items-center justify-between text-xs font-bold text-[#875F42]/60 pt-6 border-t border-pink-50">
                <span>{guide.date}{guide.lastUpdated ? ` · Updated ${guide.lastUpdated}` : ''} · {guide.readTime}</span>
                <span class="text-[#F06292] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Guide →
                </span>
            </div>
        </a>
    {/each}
</div>

<div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
    <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
    
    <div class="relative z-10 mb-6">
        <span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">
            Free Tool
        </span>
    </div>

    <h3 class="text-2xl md:text-3xl font-black text-[#4A2C2C] relative z-10 mb-3 flex items-center justify-center gap-3">
        Ready to squish some images?
    </h3>

    <p class="text-[#6C3F31] text-lg max-w-lg mx-auto relative z-10 mb-8 leading-relaxed">
        Try our native C++ engine for instant Jpegli, AVIF, and WebP compression.
    </p>

    <a href="/" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline">
        <span>Start Optimizing Now</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
    </a>
</div>

</div>