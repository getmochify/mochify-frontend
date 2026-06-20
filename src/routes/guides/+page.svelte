<script lang="ts">
    const metadata = {
        title: "Image Optimization Guides | Mochify",
        description: "Learn about modern image formats, compression techniques, and optimization strategies with our in-depth guides."
    };

    const guides = [
        {
            title: "Should I Use fetchpriority or rel=\"preload\" for My LCP Image?",
            description: "Use fetchpriority=\"high\" on an <img> tag found in HTML. Use rel=\"preload\" when the browser discovers the image late, via CSS or JavaScript.",
            url: "/guides/fetchpriority-vs-preload-lcp-image",
            category: "Quick Guides",
            readTime: "2 min read",
            date: "June 20, 2026"
        },
        {
            title: "How to Convert Sony HIF Files to JPG",
            description: "Convert Sony .HIF files to JPG with Sony's free Imaging Edge Desktop, or convert online in one step. Which Alpha bodies shoot HEIF, and how to export.",
            url: "/guides/sony-hif-to-jpg",
            category: "Quick Guides",
            readTime: "3 min read",
            date: "June 17, 2026"
        },
        {
            title: "Working with PDFs in AI Agent Workflows: Extract, Split, and Convert Pages",
            description: "How to extract images from PDF, split multi-page files, and convert pages to WebP inside an AI agent pipeline. Mechanics, pitfalls, and a privacy-first workflow.",
            url: "/guides/working-with-pdfs-in-ai-agent-workflows",
            category: "AI & Automation",
            readTime: "12 min read",
            date: "June 16, 2026"
        },
        {
            title: "LLM Image Token Costs: How Many Tokens Does an Image Use?",
            description: "No single number: Claude uses width×height/750 (~1,334 tokens for 1 MP), OpenAI and Gemini use tiling. Pass file paths, not image bytes, to save context.",
            url: "/guides/llm-image-token-costs",
            category: "AI & Automation",
            readTime: "4 min read",
            date: "June 7, 2026"
        },
        {
            title: "What Is a HIF File? (And How to Open One)",
            description: "A HIF file is a 10-bit HEIF photo from Canon, Sony and Fujifilm cameras. What it is, why it won't open, and how to view one on macOS, Windows, iOS and Linux.",
            url: "/guides/what-is-a-hif-file",
            category: "Quick Guides",
            readTime: "3 min read",
            date: "June 13, 2026"
        },
        {
            title: "Does Converting HIF to JPG Reduce Quality?",
            description: "Converting HIF to JPG rarely reduces visible quality. The real exception is Canon HDR PQ, where the HDR-to-SDR tone-map changes the look more than bit depth.",
            url: "/guides/does-hif-to-jpg-lose-quality",
            category: "Quick Guides",
            readTime: "3 min read",
            date: "June 5, 2026"
        },
        {
            title: "HIF to JPG: Convert Canon, Sony & Fujifilm Photos to Shareable JPEGs",
            description: "Convert HIF to JPG from Canon, Sony and Fujifilm cameras. Every method on every platform, plus what you trade away going 10-bit to 8-bit.",
            url: "/guides/hif-to-jpg-canon-sony-fujifilm",
            category: "Image Formats",
            readTime: "19 min read",
            date: "June 4, 2026"
        },
        {
            title: "On-Device AI Agents: Image and PDF Optimization for Local Workflows",
            description: "From NVIDIA DGX Spark to Apple Silicon, local AI agents are real in 2026. What that means for handling images and PDFs inside MCP agent pipelines — and why a local model doesn't mean local data.",
            url: "/guides/on-device-ai-agents-image-optimization",
            category: "AI & Automation",
            readTime: "15 min read",
            date: "June 2, 2026"
        },
        {
            title: "SVG Conversion Guide: When to Keep Vector and When to Rasterize",
            description: "The real question isn't 'can I use SVG?' — it's 'should I use SVG here, for this workflow?' Decision framework, format comparison, and WordPress workflows for designers and developers.",
            url: "/guides/svg-conversion-guide-vector-vs-raster",
            category: "Image Formats",
            readTime: "8 min read",
            date: "May 16, 2026"
        },
        {
            title: "Do Journaling Apps Compress Images? Avoid Storage Bloat.",
            description: "Most journaling apps skip real compression or make it worse. Day One converts HEIC to larger JPEGs. Here's how to fix storage bloat before it hits.",
            url: "/guides/do-journaling-apps-compress-images",
            category: "Quick Guides",
            readTime: "4 min read",
            date: "May 18, 2026"
        },
        {
            title: "Fuji HIF Files Explained: How to Convert X-T5 / X-H2 / X100VI / X-T50 HIF to JPEG",
            description: "Fuji's HIF files are highly efficient and better quality at 10-bit but they're not supported everywhere, which can lead to frustration. Learn how to convert your camera's .HIF files to JPGs",
            url: "/guides/fujifilm-hif-to-jpg",
            category: "Image Formats",
            readTime: "5 min read",
            date: "Feb 01, 2026",
            lastUpdated: "June 4, 2026"
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
            description: "Describe your image goal in plain English and Mochify's AI picks the right format, size, and settings automatically. Powered by Mistral Small 4. No tech knowledge needed.",
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
            title: "How the Mochify MCP Server Works: Hosted vs Local, with Worked Examples",
            description: "The hosted and local MCP surfaces compared — architecture, token costs, retention behaviour, and four worked examples covering URL input, uploaded images, Claude Desktop file work, and build pipelines.",
            url: "/guides/how-the-mochify-mcp-server-works",
            category: "AI & Automation",
            readTime: "9 min read",
            date: "May 28, 2026"
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
        },
        {
            title: "Is JPEG XL Ready for Shopify Product Images in 2026?",
            description: "JPEG XL is not ready for live Shopify stores in 2026. Browser support sits at 12–17% globally and Shopify doesn't accept JXL uploads. Use AVIF with a WebP fallback.",
            url: "/guides/is-jpeg-xl-ready-for-shopify-product-images",
            category: "Quick Guides",
            readTime: "3 min read",
            date: "Apr 14, 2026"
        },
        {
            title: "HIF/HEIF to JPEG for Professional Photographers: A Privacy-First Workflow Guide",
            description: "Convert Canon HIF and HEIF to JPEG with confidence. Wedding, commercial, and editorial workflow blueprints with EXIF stripping, batch sizing, and zero-retention processing.",
            url: "/guides/heif-to-jpeg-workflow-photographers-guide",
            category: "Workflows",
            readTime: "12 min read",
            date: "Apr 23, 2026"
        },
        {
            title: "Should I Shoot HEIF or JPEG on My Mirrorless Camera?",
            description: "Shoot HEIF for capture quality, deliver JPEG to clients. Here's the practical 2026 workflow for Canon EOS R, Nikon Z, and Sony Alpha shooters.",
            url: "/guides/should-i-shoot-heif-or-jpeg-mirrorless-camera",
            category: "Quick Guides",
            readTime: "3 min read",
            date: "Apr 25, 2026"
        },
        {
            title: "Does HEIF/HEIC Work With Client Gallery Platforms Like Pixieset and SmugMug?",
            description: "HEIF and HEIC files don't work reliably with most client gallery platforms. Here's what actually happens on upload, and how to keep control of your output.",
            url: "/guides/does-heif-heic-work-with-client-galleries",
            category: "Quick Guides",
            readTime: "3 min read",
            date: "Apr 26, 2026"
        },
        {
            title: "AI Agent Workflow Automation for Photographers: Save Hours with Claude and Mochify",
            description: "Build a hands-off post-shoot pipeline with Claude, Dispatch, and Mochify MCP. Files land in upload-ready folders while you're still in the field.",
            url: "/guides/ai-agent-workflow-automation-photographers",
            category: "Workflows",
            readTime: "10 min read",
            date: "May 03, 2026"
        },
        {
            title: "What Image Format Should I Use for Product Photos?",
            description: "Use AVIF for the smallest files, WebP as a fallback, and JPEG for the broadest compatibility. Here's the practical format fallback order for ecommerce product images.",
            url: "/guides/what-image-format-should-i-use-for-product-photos",
            category: "Quick Guides",
            readTime: "2 min read",
            date: "May 19, 2026"
        },
        {
            title: "Ecommerce Product Photo Workflow: Resize & Convert in One Prompt",
            description: "How to batch-convert product photos to JPG at 1200px and 800px with a single natural-language prompt. The fastest workflow for Shopify, Etsy, eBay, and Amazon sellers.",
            url: "/guides/ecommerce-product-photo-workflow-resize-convert",
            category: "Workflows",
            readTime: "4 min read",
            date: "May 23, 2026"
        },
        {
            title: "Why We Relaxed Our Zero-Retention Policy for MCP Server Compressions",
            description: "Why we softened Mochify's 'wiped immediately' claim on hosted MCP compressions to a five-minute pickup window, what we kept end-to-end, and what it means for your workflow.",
            url: "/guides/why-we-relaxed-zero-retention-for-mcp",
            category: "Data Privacy",
            readTime: "5 min read",
            date: "May 29, 2026"
        }
    ];
    guides.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const categories = ['All', ...Array.from(new Set(guides.map(g => g.category)))];
    let selectedCategory = $state('All');
    const filteredGuides = $derived(
        selectedCategory === 'All' ? guides : guides.filter(g => g.category === selectedCategory)
    );

    const toIsoDate = (d: string) => new Date(d).toISOString().split('T')[0];

    const allDates = guides.flatMap(g => [g.date, g.lastUpdated].filter(Boolean) as string[]);
    const dateModified = toIsoDate(allDates.reduce((a, b) => new Date(a) > new Date(b) ? a : b));
    const datePublished = toIsoDate(guides[guides.length - 1].date);

    const structuredData = {
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
        "mainEntity": guides.map(g => ({
            "@type": "Article",
            "name": g.title,
            "url": `https://mochify.app${g.url}`
        })),
        "datePublished": datePublished,
        "dateModified": dateModified
    };
</script>

<svelte:head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description}>
    {@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
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

<div class="flex flex-wrap gap-2 justify-center mb-10">
    {#each categories as cat}
        <button
            onclick={() => selectedCategory = cat}
            class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 {selectedCategory === cat ? 'bg-mochi-pink text-white shadow-md' : 'bg-pink-50 text-pink-400 hover:bg-pink-100'}"
        >
            {cat}
        </button>
    {/each}
</div>

<div class="grid gap-8 mb-24">
    {#each filteredGuides as guide}
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