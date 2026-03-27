<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import InfoBox from '$lib/components/InfoBox.svelte';
    import CodeBlock from '$lib/components/CodeBlock.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import RelatedGuides from '$lib/components/RelatedGuides.svelte';

    const metadata = {
        category: "Image Optimization",
        readTime: "14 min read",
        date: "February 20, 2026"
    };
</script>

<ReadProgress />

<svelte:head>
    <title>Optimizing Hero Images: Fix LCP & Boost SEO with No Plugins</title>
    <meta name="description" content="Your 4 sec hero loads kill rankings. Learn to compress heroes to <150KB AVIF, fix LCP to 1.3s, and boost SEO 10-20% without plugins.">
    <meta property="og:title" content="Optimizing Hero Images: Fix LCP & Boost SEO with No Plugins" />
    <meta property="og:description" content="Your hero image loads in 4 seconds? Google notices. Learn how to compress hero images, fix LCP errors, and stop visitors from bouncing — no plugins required." />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Optimizing Hero Images: Fix LCP & Boost SEO Without Plugins",
        "description": "Fix slow LCP scores from bloated hero images. Step-by-step guide for WordPress, Shopify, Squarespace, and Wix — no plugins needed.",
        "url": "https://mochify.app/guides/optimizing-hero-images",
        "inLanguage": "en",
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "about": [
            "LCP optimization",
            "hero image compression",
            "Core Web Vitals",
            "AVIF WebP hero images",
            "WordPress Shopify image optimization"
        ],
        "datePublished": "2026-02-20",
        "dateModified": "2026-02-20"
        }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-[#E8F5E9] text-[#15803d] text-xs font-bold uppercase tracking-wider border border-green-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Optimizing Hero Images: Fix LCP &amp; Boost SEO Without Plugins
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            Your hero image loads in 4 seconds? <strong>Google notices.</strong> Every millisecond counts when your LCP score directly impacts rankings. We've seen sites drop 10–20 positions because of a bloated hero, while competitors with sub-1.5s LCP times cruise past them in search results.
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                This guide walks you through the exact steps to compress hero images, fix LCP errors, and keep visitors from bouncing before your page even loads — broken down by platform with a handy cheat sheet at the end.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>
            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    {#each [
                        { id: 'core-web-vitals', num: '01', label: 'Understanding Core Web Vitals in 60 Seconds' },
                        { id: 'why-hero-images', num: '02', label: 'Why Hero Images Kill SEO' },
                        { id: 'best-practices', num: '03', label: 'Core Best Practices for Hero Optimization' },
                        { id: 'platforms', num: '04', label: 'Platform-Specific Workflows: WordPress, Shopify, Squarespace, Wix' },
                        { id: 'cheat-sheet', num: '05', label: 'Hero Image Optimization Cheat Sheet 2026' },
                        { id: 'mochify-workflow', num: '06', label: 'Mochify Workflow: Batch Process Heroes Fast' },
                    ] as item}
                        <li>
                            <a href="#{item.id}" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                                <span class="flex items-center gap-4">
                                    <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">{item.num}</span>
                                    <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{item.label}</span>
                                </span>
                                <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </section>

        <!-- Core Web Vitals -->
        <section id="core-web-vitals" class="my-12">
            <SectionHeading>Understanding Core Web Vitals in 60 Seconds</SectionHeading>
            <p class="mb-6">Google evaluates your site speed using three Core Web Vitals metrics. Think of them as performance scorecards that directly influence your rankings.</p>

            <div class="grid md:grid-cols-3 gap-5 my-8">
                <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
                    <div class="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center mb-4">
                        <span class="text-lg font-black text-[#D81B60]">LCP</span>
                    </div>
                    <h3 class="text-base font-black text-[#4A2C2C] mb-2">Largest Contentful Paint</h3>
                    <p class="text-sm text-[#6C3F31] leading-relaxed">How long it takes for the biggest visible element to load — usually your hero image. Google wants this <strong>under 2.5s</strong>. Above 4s? You're in the red zone.</p>
                </div>
                <div class="bg-[#FFF9F5] rounded-2xl border border-[#FFE4D6] p-6">
                    <div class="w-10 h-10 rounded-xl bg-[#FFF0E6] flex items-center justify-center mb-4">
                        <span class="text-lg font-black text-[#875F42]">CLS</span>
                    </div>
                    <h3 class="text-base font-black text-[#4A2C2C] mb-2">Cumulative Layout Shift</h3>
                    <p class="text-sm text-[#6C3F31] leading-relaxed">Tracks page jumps caused by images loading without defined dimensions. <strong>Below 0.1 is good.</strong> Always define <code class="bg-pink-50 px-1 rounded text-sm font-mono text-[#D81B60]">width</code> and <code class="bg-pink-50 px-1 rounded text-sm font-mono text-[#D81B60]">height</code>.</p>
                </div>
                <div class="bg-[#F5F9FF] rounded-2xl border border-blue-100 p-6">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                        <span class="text-lg font-black text-blue-600">INP</span>
                    </div>
                    <h3 class="text-base font-black text-[#4A2C2C] mb-2">Interaction to Next Paint</h3>
                    <p class="text-sm text-[#6C3F31] leading-relaxed">Replaced FID in 2024 — measures how quickly your page responds to clicks and taps. Indirectly affected by heavy image payloads hogging main thread.</p>
                </div>
            </div>

            <p>Your hero image impacts all three metrics, but <strong>LCP is where you'll see the biggest gains</strong> from optimization.</p>
        </section>

        <!-- Why Hero Images Kill SEO -->
        <section id="why-hero-images" class="my-12">
            <SectionHeading>Why Hero Images Kill SEO</SectionHeading>
            <p class="mb-6">Every e-commerce site and agency portfolio we've audited in 2026 has the same problem: gorgeous 5MB hero images that tank LCP scores. Here's what that costs you.</p>

            <div class="space-y-6">
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">The Ranking Tax</h3>
                    <p class="mb-4">Slow LCP drops organic rankings by 10–20% on average. Google's algorithm treats Core Web Vitals as a tiebreaker between similar content, and in competitive niches that tiebreaker decides who lands on page one. We've tracked Shopify stores that fixed their hero LCP and climbed from position 12 to position 4 within three weeks — same content, same backlinks, just faster paint times.</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">The Bounce Rate Spike</h3>
                    <p class="mb-4">Research consistently shows that even a <strong>1-second delay increases bounce rates by 7%</strong>. Your hero loads slowly, visitors see a blank screen or placeholder, and they're gone before your value proposition even renders. Mobile users on spotty 4G connections are even less forgiving.</p>
                </div>

                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">The Slider Problem</h3>
                    <p class="mb-4">Image sliders and carousels make this worse. Loading 3–5 hero images for a rotating banner multiplies your payload by 3–5×. Most users never click past slide one, so you're sacrificing LCP for features nobody uses. We recommend <strong>static heroes with a single CTA</strong> for maximum conversion and speed.</p>
                </div>

                <!-- Before/After callout -->
                <div class="my-8 bg-gradient-to-br from-[#FFF5F7] to-white rounded-3xl border border-pink-100 p-6 md:p-8">
                    <h3 class="text-lg font-black text-[#4A2C2C] mb-5">Before / After: What Optimization Actually Delivers</h3>
                    <div class="grid md:grid-cols-2 gap-5">
                        <div class="bg-red-50 rounded-2xl border border-red-100 p-5">
                            <p class="text-xs font-black text-red-400 uppercase tracking-wider mb-3">Before</p>
                            <ul class="space-y-2 text-sm text-[#6C3F31]">
                                <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></span>2.8 MB JPEG hero</li>
                                <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></span>LCP 4.2s</li>
                                <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></span>Bounce rate 68%</li>
                            </ul>
                        </div>
                        <div class="bg-[#E8F5E9] rounded-2xl border border-green-100 p-5">
                            <p class="text-xs font-black text-[#15803d] uppercase tracking-wider mb-3">After</p>
                            <ul class="space-y-2 text-sm text-[#6C3F31]">
                                <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></span>145 KB AVIF hero — <strong>93% smaller</strong></li>
                                <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></span>LCP 1.3s — <strong>69% faster</strong></li>
                                <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></span>Bounce rate 51% — <strong>25% lower</strong></li>
                            </ul>
                        </div>
                    </div>
                    <p class="text-sm text-[#875F42] mt-4">Real metrics from client projects. Compression isn't just about speed — it's about keeping visitors long enough to convert them.</p>
                </div>
            </div>
        </section>

        <!-- Core Best Practices -->
        <section id="best-practices" class="my-12">
            <SectionHeading>Core Best Practices for Hero Optimization</SectionHeading>
            <p class="mb-8">Let's break down the technical steps that actually move the needle. These apply whether you're on WordPress, Shopify, or a custom stack.</p>

            <div class="space-y-10">

                <!-- Format choice -->
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Pick the Right Format: AVIF, WebP, or Jpegli JPEG</h3>
                    <div class="grid md:grid-cols-3 gap-4 my-6">
                        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5">
                            <p class="text-xs font-black text-[#D81B60] uppercase tracking-wider mb-2">Best Choice</p>
                            <h4 class="font-black text-[#4A2C2C] mb-2">AVIF</h4>
                            <p class="text-sm text-[#6C3F31]">50% smaller than JPEG at equivalent quality. Supports HDR + alpha transparency. <strong>94% browser support</strong> as of 2025. Use AVIF for your primary hero.</p>
                        </div>
                        <div class="bg-[#FFF9F5] rounded-2xl border border-[#FFE4D6] p-5">
                            <p class="text-xs font-black text-[#875F42] uppercase tracking-wider mb-2">Fallback</p>
                            <h4 class="font-black text-[#4A2C2C] mb-2">WebP</h4>
                            <p class="text-sm text-[#6C3F31]">30% smaller than JPEG. Near-universal support (97%). Older Safari and legacy browsers still need WebP as a safety net.</p>
                        </div>
                        <div class="bg-[#F5F9FF] rounded-2xl border border-blue-100 p-5">
                            <p class="text-xs font-black text-blue-600 uppercase tracking-wider mb-2">Marketplace Lock-in</p>
                            <h4 class="font-black text-[#4A2C2C] mb-2">Jpegli JPEG</h4>
                            <p class="text-sm text-[#6C3F31]">Google's modern JPEG encoder. Standard JPEG output — compatible everywhere — but 35% better compression at high quality. No format headaches.</p>
                        </div>
                    </div>
                    <p class="mb-4">Use a <code class="bg-pink-50 px-1.5 py-0.5 rounded text-sm font-mono text-[#D81B60]">&lt;picture&gt;</code> element with AVIF first, WebP second, and JPEG fallback:</p>
                    <CodeBlock filename="hero.html" code={`<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Product showcase" width="1920" height="800">
</picture>`} />
                </div>

                <!-- Size -->
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Size It Right: 1920×800 for Desktop, Mobile Variants via Srcset</h3>
                    <p class="mb-4">Most themes display heroes at 1920px width on desktop. Going larger wastes bandwidth without improving visual quality. Height depends on your aspect ratio — 800px works well for 2.4:1 banners, while 1080px suits 16:9 full-screen heroes.</p>
                    <InfoBox type="tip" title="Mobile-first sizing">
                        Mobile visitors (70%+ of traffic for e-commerce sites) need smaller variants. Use <code>srcset</code> to serve 800×600 images to phones and 1200×900 to tablets. Always define <code>width</code> and <code>height</code> attributes to prevent CLS — without dimensions the page jumps as content shifts down.
                    </InfoBox>
                </div>

                <!-- Background images -->
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Background Images vs <code class="text-[#D81B60] font-mono text-lg">&lt;img&gt;</code> Tags</h3>
                    <p class="mb-4">CSS background images are invisible to preload scanners, which means browsers discover them late and start fetching them after parsing CSS. <strong>This delays LCP by 200–500ms</strong> compared to <code class="bg-pink-50 px-1.5 py-0.5 rounded text-sm font-mono text-[#D81B60]">&lt;img&gt;</code> tags.</p>
                    <p>Switch from <code class="bg-pink-50 px-1.5 py-0.5 rounded text-sm font-mono text-[#D81B60]">background-image</code> in CSS to proper <code class="bg-pink-50 px-1.5 py-0.5 rounded text-sm font-mono text-[#D81B60]">&lt;img&gt;</code> elements. If your theme forces backgrounds (looking at you, Elementor sliders), move the hero to an Image widget and preload it manually. The LCP improvement is worth the template refactor.</p>
                </div>

                <!-- fetchpriority -->
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Preload Your Hero with <code class="text-[#D81B60] font-mono text-lg">fetchpriority="high"</code></h3>
                    <p class="mb-4">Browsers prioritize resources in a specific order: CSS first, then scripts, then images. Your hero image often loads with default priority — meaning it waits behind other assets.</p>
                    <p class="mb-4">Fix this by preloading the hero and setting <code class="bg-pink-50 px-1.5 py-0.5 rounded text-sm font-mono text-[#D81B60]">fetchpriority="high"</code>:</p>
                    <CodeBlock filename="<head>" code={`<link rel="preload" as="image" href="hero.avif" fetchpriority="high">`} />
                    <InfoBox type="technical" title="Why this matters">
                        Etsy deployed this technique site-wide and improved LCP by 4%, with some pages seeing 20–30% gains. Add this <code>&lt;link&gt;</code> tag in your <code>&lt;head&gt;</code> before other stylesheets and scripts. Without <code>fetchpriority="high"</code>, some browsers treat image preloads as low priority and negate the benefit entirely.
                    </InfoBox>
                </div>

                <!-- srcset -->
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Responsive Heroes: Srcset for Different Viewports</h3>
                    <p class="mb-4">Desktop users don't need 1920px images if their screen is 1366px wide. Mobile users on 375px phones certainly don't. Serve appropriately sized variants:</p>
                    <CodeBlock filename="responsive-hero.html" code={`<img
  srcset="hero-800.avif 800w, hero-1200.avif 1200w, hero-1920.avif 1920w"
  sizes="100vw"
  src="hero-1920.avif"
  alt="Hero image"
  width="1920"
  height="800"
  fetchpriority="high"
>`} />
                    <p>The browser picks the smallest image that fills the viewport. A phone gets 800w (~60 KB), a tablet gets 1200w (~110 KB), and a desktop gets 1920w (~150 KB). You're saving bandwidth and speeding up LCP for most visitors.</p>
                </div>

                <!-- Metadata strip -->
                <div>
                    <h3 class="text-xl font-bold text-[#4A2C2C] mb-3">Strip Metadata for Privacy and Smaller Files</h3>
                    <p class="mb-4">EXIF data (camera model, GPS coordinates, timestamps) bloats images by 10–50 KB without adding any visual value. Worse, it <strong>leaks privacy information</strong> like location and device details.</p>
                    <p>Quality compression tools strip metadata automatically. When you run images through Mochify, we discard EXIF, color profiles, and thumbnail previews embedded by cameras — keeping only the pixel data needed to display the image.</p>
                </div>

            </div>
        </section>

        <!-- Platform Workflows -->
        <section id="platforms" class="my-12">
            <SectionHeading>Platform-Specific Workflows</SectionHeading>
            <p class="mb-8">Different platforms need different approaches. Here's how to pre-optimize heroes for each without adding plugins or overhead.</p>

            <div class="space-y-10">

                <!-- WordPress -->
                <div class="bg-[#FFF5F7] rounded-3xl border border-pink-100 p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-5">
                        <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-pink-100">
                            <svg class="w-5 h-5 text-[#21759B]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zM3.01 12c0-1.3.28-2.54.78-3.66L8.3 21.27C5.2 19.81 3.01 16.16 3.01 12zm8.99 8.99c-.88 0-1.73-.13-2.54-.36l2.7-7.84 2.76 7.57c.02.04.04.07.05.1-.93.34-1.92.53-2.97.53zm1.24-13.26c.54-.03 1.03-.08 1.03-.08.48-.06.43-.77-.06-.74 0 0-1.46.11-2.4.11-.88 0-2.37-.11-2.37-.11-.48-.03-.54.71-.06.74 0 0 .46.05.95.08l1.4 3.84-1.97 5.9L7.1 7.73c.54-.03 1.03-.08 1.03-.08.48-.06.43-.77-.06-.74 0 0-1.46.11-2.4.11-.17 0-.36 0-.57-.01C6.54 4.67 9.12 3.01 12 3.01c2.14 0 4.09.82 5.55 2.16-.04 0-.07-.01-.11-.01-.88 0-1.5.77-1.5 1.59 0 .74.43 1.37.88 2.11.34.6.74 1.37.74 2.48 0 .77-.29 1.66-.68 2.9l-.89 2.97-3.23-9.58zm4.74 11.65l2.74-7.92c.51-1.28.68-2.31.68-3.22 0-.33-.02-.64-.06-.93A8.98 8.98 0 0120.99 12c0 3.61-1.95 6.77-4.99 8.47l-.02-.09z"/></svg>
                        </div>
                        <h3 class="text-xl font-black text-[#4A2C2C]">WordPress</h3>
                    </div>
                    <p class="mb-5 text-[#6C3F31]">WordPress generates multiple thumbnail sizes on upload — optimization plugins add database bloat and CPU overhead. Skip them entirely with this plugin-free workflow:</p>
                    <ol class="space-y-3 list-none pl-0">
                        {#each [
                            'Resize your hero to 1920×800 (or your theme\'s recommended size) before uploading',
                            'Convert to AVIF and WebP using Mochify (batch process up to 25 images at once)',
                            'Compress to target <150 KB per hero image for fast LCP',
                            'Upload the optimized files directly to WordPress media library',
                            'Add fetchpriority="high" to your hero via theme settings or a custom HTML block',
                        ] as step, i}
                            <li class="flex items-start gap-4">
                                <span class="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-pink-200 flex items-center justify-center text-xs font-black text-[#F06292] mt-0.5">{i + 1}</span>
                                <span class="text-[#6C3F31]">{step}</span>
                            </li>
                        {/each}
                    </ol>
                    <InfoBox type="tip" title="Pro-tip">
                        Check your theme's actual display size by inspecting the rendered hero in DevTools. Many themes claim to need 2400px width but actually display at 1920px — meaning you're serving wasted pixels.
                    </InfoBox>
                </div>

                <!-- Shopify -->
                <div class="bg-[#FFF9F5] rounded-3xl border border-[#FFE4D6] p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-5">
                        <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-[#FFE4D6]">
                            <svg class="w-5 h-5 text-[#96BF48]" viewBox="0 0 24 24" fill="currentColor"><path d="M15.337 23.979l7.216-1.561s-2.597-17.56-2.617-17.679c-.019-.118-.121-.196-.233-.196s-2.186-.154-2.186-.154-.972-.972-1.078-1.063v-.009c-.019-.009-.028-.009-.047 0l-1.063 20.662h-.007l.015-.001zm-3.792-11.051l-.766-2.336s-.943.497-2.092.497c-1.681 0-1.764-.766-1.764-1.345 0-1.766 3.52-2.429 3.52-6.539 0-3.239-2.053-5.303-4.8-5.303-3.31 0-4.993 2.663-4.993 2.663l.91 2.831s1.681-2.053 3.241-2.053c1.156 0 1.653.876 1.653 1.681 0 1.988-2.995 2.598-2.995 6.391 0 3.271 2.287 5.377 5.469 5.377 1.175 0 2.617-.497 2.617-.497v-.168zm4.545-9.248c-1.143-.059-2.326.278-2.326.278l-.682 9.889.186.048 2.822-10.215z"/></svg>
                        </div>
                        <h3 class="text-xl font-black text-[#4A2C2C]">Shopify</h3>
                    </div>
                    <p class="mb-4 text-[#6C3F31]">Shopify themes have preset hero dimensions that vary by template. Dawn wants 1920×800, while Prestige prefers 2400×1200. Using the wrong size forces Shopify to resize server-side, degrading quality.</p>
                    <ol class="space-y-3 list-none pl-0 mb-6">
                        {#each [
                            'Check your theme\'s documentation for recommended hero dimensions (or inspect the rendered size in DevTools)',
                            'Export source images at the exact dimensions',
                            'Convert to WebP (Shopify supports WebP natively; AVIF support rolling out theme-by-theme)',
                            'Compress to under 300 KB for desktop heroes, under 150 KB for mobile variants',
                            'Upload via the theme customizer — Shopify CDN serves optimized versions automatically',
                        ] as step, i}
                            <li class="flex items-start gap-4">
                                <span class="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[#FFD4B8] flex items-center justify-center text-xs font-black text-[#875F42] mt-0.5">{i + 1}</span>
                                <span class="text-[#6C3F31]">{step}</span>
                            </li>
                        {/each}
                    </ol>
                    <InfoBox type="warning" title="Mobile Consideration">
                        Over 70% of Shopify traffic is mobile. Test your hero on actual devices or Chrome DevTools mobile emulation to confirm it loads in under 2 seconds on 4G connections.
                    </InfoBox>
                </div>

                <!-- Squarespace -->
                <div class="bg-[#F5F9FF] rounded-3xl border border-blue-100 p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-5">
                        <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-blue-100">
                            <svg class="w-4 h-4 text-[#222]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 8.6L12 .3 3.7 8.6l2.1 2.1 4.7-4.7v13.9h3V6l4.7 4.7 2.1-2.1zm-1.1 6.1l-2.1-2.1-4.7 4.7V3.4h-3V17.3L4.7 12.6l-2.1 2.1L12 23.7l9.3-9.3-2.1 2.3z"/></svg>
                        </div>
                        <h3 class="text-xl font-black text-[#4A2C2C]">Squarespace</h3>
                    </div>
                    <p class="mb-4 text-[#6C3F31]">Squarespace recommends 2500×1500 for full-width hero banners. But 2500px at high quality easily hits 1–2 MB, which kills LCP — compress before you upload.</p>
                    <ol class="space-y-3 list-none pl-0 mb-6">
                        {#each [
                            'Resize to 2500×1500 (or 1920×1080 for 16:9 banners)',
                            'Convert to WebP (Squarespace supports WebP; AVIF varies by template version)',
                            'Compress to target <500 KB — any larger and LCP creeps above 2.5s',
                            'Upload via the Design panel and set your hero as the background or featured image',
                            'Enable Squarespace\'s built-in image loading optimizations in site settings',
                        ] as step, i}
                            <li class="flex items-start gap-4">
                                <span class="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-blue-200 flex items-center justify-center text-xs font-black text-blue-500 mt-0.5">{i + 1}</span>
                                <span class="text-[#6C3F31]">{step}</span>
                            </li>
                        {/each}
                    </ol>
                    <InfoBox type="note" title="Lazy loading">
                        Squarespace handles lazy loading automatically for below-the-fold images, but your hero should always load eagerly. Check that the hero has <code>loading="eager"</code> or no lazy loading attribute in your template's advanced settings.
                    </InfoBox>
                </div>

                <!-- Wix -->
                <div class="bg-[#FDFBF7] rounded-3xl border border-pink-50 p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-5">
                        <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-pink-50">
                            <span class="text-sm font-black text-[#FAAD2B]">Wix</span>
                        </div>
                        <h3 class="text-xl font-black text-[#4A2C2C]">Wix</h3>
                    </div>
                    <p class="mb-4 text-[#6C3F31]">Wix automatically converts uploaded images to WebP and applies some compression. This is convenient but gives you less control over quality and file size. Pre-optimizing before upload ensures you hit your LCP targets.</p>
                    <ol class="space-y-3 list-none pl-0">
                        {#each [
                            'Resize to 1920×1080 (Wix\'s standard hero size for most templates)',
                            'Compress to <200 KB as JPEG or WebP',
                            'Upload via the media manager',
                            'Wix\'s CDN serves optimized versions automatically, but starting with a smaller file ensures the fastest possible delivery',
                        ] as step, i}
                            <li class="flex items-start gap-4">
                                <span class="flex-shrink-0 w-7 h-7 rounded-full bg-[#FFF5F7] border border-pink-200 flex items-center justify-center text-xs font-black text-[#F06292] mt-0.5">{i + 1}</span>
                                <span class="text-[#6C3F31]">{step}</span>
                            </li>
                        {/each}
                    </ol>
                    <p class="mt-5 text-sm text-[#875F42]">Wix's editor doesn't expose <code class="bg-white px-1 rounded font-mono">fetchpriority</code> or manual preload options, so focus on <strong>file size as your primary lever</strong>. Smaller heroes load faster regardless of priority hints.</p>
                </div>

            </div>
        </section>

        <!-- Cheat Sheet -->
        <section id="cheat-sheet" class="my-12">
            <SectionHeading>Hero Image Optimization Cheat Sheet 2026</SectionHeading>

            <div class="overflow-x-auto mb-10">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7] border-b border-pink-100">
                            <th class="py-4 px-5 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Platform</th>
                            <th class="py-4 px-5 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Recommended Size</th>
                            <th class="py-4 px-5 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Target File Size</th>
                            <th class="py-4 px-5 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Format Priority</th>
                            <th class="py-4 px-5 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Key LCP Step</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50">
                        {#each [
                            { platform: 'WordPress', size: '1920×800', target: '<150 KB', formats: 'AVIF › WebP › JPEG', key: 'Pre-compress, add fetchpriority' },
                            { platform: 'Shopify', size: '1920×800', target: '<300 KB', formats: 'WebP › JPEG', key: 'Check theme specs, mobile test' },
                            { platform: 'Squarespace', size: '2500×1500', target: '<500 KB', formats: 'WebP › JPEG', key: 'Compress before upload' },
                            { platform: 'Wix', size: '1920×1080', target: '<200 KB', formats: 'WebP › JPEG', key: 'Pre-compress, let Wix CDN serve' },
                            { platform: 'Custom / Static', size: '1920×800', target: '<150 KB', formats: 'AVIF › WebP › JPEG', key: 'Preload, srcset, fetchpriority' },
                        ] as row}
                            <tr class="hover:bg-pink-50/30 transition-colors">
                                <td class="py-4 px-5 font-bold text-[#4A2C2C]">{row.platform}</td>
                                <td class="py-4 px-5 text-[#6C3F31] font-mono text-sm">{row.size}</td>
                                <td class="py-4 px-5 text-[#6C3F31] font-semibold">{row.target}</td>
                                <td class="py-4 px-5 text-[#6C3F31] text-sm">{row.formats}</td>
                                <td class="py-4 px-5 text-[#875F42] text-sm">{row.key}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <h3 class="text-lg font-black text-[#4A2C2C] mb-4">Format Comparison Quick Reference</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7] border-b border-pink-100">
                            <th class="py-4 px-5 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Format</th>
                            <th class="py-4 px-5 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Compression vs JPEG</th>
                            <th class="py-4 px-5 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Browser Support 2026</th>
                            <th class="py-4 px-5 text-sm font-black text-[#4A2C2C] uppercase tracking-wider">Use Case</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50">
                        <tr class="hover:bg-pink-50/30 transition-colors bg-pink-50/20">
                            <td class="py-4 px-5 font-bold text-[#D81B60]">AVIF</td>
                            <td class="py-4 px-5 text-[#D81B60] font-semibold">50% smaller</td>
                            <td class="py-4 px-5 text-[#6C3F31]">94%</td>
                            <td class="py-4 px-5 text-[#6C3F31] text-sm">Modern sites, best compression</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="py-4 px-5 font-bold text-[#4A2C2C]">WebP</td>
                            <td class="py-4 px-5 text-[#6C3F31] font-semibold">30% smaller</td>
                            <td class="py-4 px-5 text-[#6C3F31]">97%</td>
                            <td class="py-4 px-5 text-[#6C3F31] text-sm">Fallback, wide compatibility</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="py-4 px-5 font-bold text-[#4A2C2C]">Jpegli JPEG</td>
                            <td class="py-4 px-5 text-[#6C3F31] font-semibold">35% better at HQ</td>
                            <td class="py-4 px-5 text-[#6C3F31]">100%</td>
                            <td class="py-4 px-5 text-[#6C3F31] text-sm">Marketplaces, legacy systems</td>
                        </tr>
                        <tr class="hover:bg-pink-50/30 transition-colors">
                            <td class="py-4 px-5 font-bold text-[#875F42]">JPEG</td>
                            <td class="py-4 px-5 text-[#875F42]">Baseline</td>
                            <td class="py-4 px-5 text-[#6C3F31]">100%</td>
                            <td class="py-4 px-5 text-[#6C3F31] text-sm">Universal fallback only</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Mochify Workflow -->
        <section id="mochify-workflow" class="my-12">
            <SectionHeading>Mochify Workflow: Batch Process Heroes Fast</SectionHeading>
            <p class="mb-6">Mochify handles up to 25 hero images per batch with zero-retention in-memory processing. Your images are compressed in RAM and discarded immediately — no disk storage, no tracking, no risk of leaks.</p>

            <div class="my-8 bg-gradient-to-br from-[#FFF5F7] to-white rounded-3xl border border-pink-100 p-6 md:p-8">
                <h3 class="text-lg font-black text-[#4A2C2C] mb-6">Step-by-step</h3>
                <ol class="space-y-4 list-none pl-0">
                    {#each [
                        { step: 'Drag your hero images (JPEG, PNG, HEIC, or existing WebP) into the Mochify web tool', icon: '1' },
                        { step: 'Select output format: AVIF for maximum compression, WebP for broader compatibility, or Jpegli JPEG for universal support', icon: '2' },
                        { step: "Select 'Smart Mode' for intelligent optimization and best quality-to-size ratio", icon: '3' },
                        { step: 'Batch compress all 25 images in one pass — our C++ engine processes them in parallel', icon: '4' },
                        { step: 'Download as a single ZIP (for batch processing) or individual files, ready to upload to your site', icon: '5' },
                    ] as item}
                        <li class="flex items-start gap-4">
                            <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[#F06292] flex items-center justify-center text-sm font-black text-white shadow-md shadow-pink-200 mt-0.5">{item.icon}</span>
                            <span class="text-[#6C3F31] pt-1">{item.step}</span>
                        </li>
                    {/each}
                </ol>
                <p class="text-sm text-[#875F42] mt-6 pt-6 border-t border-pink-100">The entire workflow takes under 2 minutes for a full batch. No accounts, no plugins installed on your server, no database overhead.</p>
            </div>

            <InfoBox type="note" title="High-volume workflows">
                For thousands of images monthly, Mochify Pro (coming later in 2026) adds custom presets, higher file limits, and API integration — all with identical zero-retention privacy. Perfect for agencies managing multiple client sites or e-commerce stores with large product catalogs.
            </InfoBox>

            <div class="mt-8 text-center">
                <a
                    href="/"
                    class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-br from-[#F06292] to-[#e040a0] text-white font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105 transition-all duration-200 no-underline"
                >
                    Compress your hero images now
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                    </svg>
                </a>
            </div>
        </section>

        <!-- Related Guides -->
        <RelatedGuides guides={[
            {
                href: '/guides/privacy-image-optimization',
                title: 'Privacy & Image Optimization',
                desc: 'Why zero-retention beats plugins — in-memory processing protects your images from disk storage and AI training.',
            },
            {
                href: '/guides/next-gen-image-formats-wordpress',
                title: 'Fix "Serve Images in Next-Gen Formats" in WordPress',
                desc: 'Convert your entire WordPress media library to AVIF and WebP without plugin bloat.',
            },
            {
                href: '/guides/2026-guide-next-gen-formats',
                title: 'The 2026 Guide to Next-Gen Formats',
                desc: 'Deep dive into WebP, AVIF, and JPEG XL compression ratios, browser support, and when to use each format.',
            },
            {
                href: '/guides/jpeg-in-2026-jpegli',
                title: 'Jpegli Guide 2026',
                desc: "Master Google's modern JPEG encoder for marketplaces and legacy platforms — better quality per byte.",
            },
        ]} />

    </div>
</article>
