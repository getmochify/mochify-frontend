<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';

    const metadata = {
        title: "SVG Conversion Guide: When to Keep Vector and When to Rasterize",
        description: "Know exactly when to keep SVG and when to convert it. Decision framework, format comparison, and WordPress workflows from the Mochify Engineering Team.",
        category: "Image Formats",
        readTime: "8 min read",
        date: "May 8, 2026"
    };
</script>

<ReadProgress />

<svelte:head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description}>
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://mochify.app/guides/svg-conversion-guide-vector-vs-raster" />
    <link rel="canonical" href="https://mochify.app/guides/svg-conversion-guide-vector-vs-raster" />

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "SVG Conversion Guide: When to Keep Vector and When to Rasterize",
        "description": "A practical decision guide for SVG: when to keep it as vector, when to convert to raster, and which format to choose — with workflow recipes for WordPress, Etsy, and email.",
        "author": {
            "@type": "Organization",
            "name": "Mochify Engineering Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mochify",
            "url": "https://mochify.app"
        },
        "datePublished": "2026-05-08",
        "dateModified": "2026-05-08",
        "url": "https://mochify.app/guides/svg-conversion-guide-vector-vs-raster",
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "Image Optimization Guides",
            "url": "https://mochify.app/guides"
        }
        }
    </script>

    <script type="application/ld+json">
        {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mochify.app" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://mochify.app/guides" },
            { "@type": "ListItem", "position": 3, "name": "SVG Conversion Guide", "item": "https://mochify.app/guides/svg-conversion-guide-vector-vs-raster" }
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
            "name": "Why does WordPress block SVG uploads by default?",
            "acceptedAnswer": { "@type": "Answer", "text": "WordPress blocks SVG because SVG files are XML and can contain scripts. Without built-in sanitization, an SVG upload is a potential XSS or XXE attack vector. Core takes the conservative position of blocking SVG entirely rather than shipping sanitization code that could itself be exploited or misconfigured." }
            },
            {
            "@type": "Question",
            "name": "When is SVG definitively better than WebP or PNG?",
            "acceptedAnswer": { "@type": "Answer", "text": "SVG is clearly better for logos, icons, and vector illustrations on sites you control, where infinite scalability, CSS theming, and tiny file sizes matter more than universal platform support. A flat SVG logo at 2KB beats any raster equivalent." }
            },
            {
            "@type": "Question",
            "name": "When should I convert SVG to WebP instead of keeping it?",
            "acceptedAnswer": { "@type": "Answer", "text": "Convert when the target platform doesn't accept SVG — WordPress default, Etsy, most email tools — or when you don't want to manage SVG sanitization in WordPress but still need small, transparency-supporting images. WebP is the right format for almost all of these cases." }
            },
            {
            "@type": "Question",
            "name": "Why do SVG logos break in Gmail or Outlook?",
            "acceptedAnswer": { "@type": "Answer", "text": "Gmail and Outlook do not reliably render external SVG images — they often display a broken image icon or strip SVG entirely. Use PNG or JPEG for logos and icons in email templates. A PNG at 2x resolution will look sharp on retina screens and render reliably across all major email clients." }
            },
            {
            "@type": "Question",
            "name": "Does converting SVG to WebP or AVIF remove the security risk?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes. Once an SVG is rasterized to WebP or AVIF, it becomes pixel data and can no longer execute scripts. Even if the original SVG contained malicious markup, the raster export is safe to serve and upload. This is one of the underrated benefits of a rasterization workflow." }
            }
        ]
        }
    </script>
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">

    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider border border-green-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            {metadata.title}
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-8">
            SVG is one of the best formats on the web — until the platform you're working with rejects it, your email client breaks it, or your WordPress media uploader refuses to accept it. The real question isn't "can I use SVG?" It's "should I use SVG <em>here</em>, for <em>this</em> workflow?"
        </p>

        <div class="bg-[#FFF5F7] rounded-3xl p-6 md:p-8 border border-pink-100 max-w-3xl">
            <p class="text-lg text-[#6C3F31] leading-relaxed">
                This guide is about decisions, not definitions. We walk you through exactly when SVG is the right call, when you need to convert it to a raster format, and which format to convert to. The examples skew toward WordPress, WooCommerce, and marketplace sellers — because that's where most of the friction lives.
            </p>
        </div>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">

        <!-- TOC -->
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>

            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner" aria-label="Table of contents">
                <ul class="space-y-3">
                    {#each [
                        { href: '#how-svg-works', num: '01', label: 'SVG: what makes it powerful (and risky)' },
                        { href: '#cheat-sheet', num: '02', label: 'Quick decision cheat sheet' },
                        { href: '#when-svg-wins', num: '03', label: 'When SVG is genuinely the best format' },
                        { href: '#when-to-convert', num: '04', label: 'When you should convert SVG to raster' },
                        { href: '#wordpress-and-svg', num: '05', label: 'WordPress and SVG: security, sanitization, plugin bloat' },
                        { href: '#choosing-raster-format', num: '06', label: 'Choosing the right raster format after converting' },
                        { href: '#decision-framework', num: '07', label: 'Decision framework: step-by-step' },
                        { href: '#workflow-recipes', num: '08', label: 'Workflow recipes with Mochify' },
                        { href: '#faq', num: '09', label: 'FAQ' },
                        { href: '#related-guides', num: '10', label: 'Related guides' },
                    ] as item}
                        <li>
                            <a href={item.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
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

        <!-- 01 — HOW SVG WORKS -->
        <section id="how-svg-works" class="scroll-mt-24 my-12">
            <SectionHeading>How SVG Works — And Why Platforms Fear It</SectionHeading>

            <p class="mb-4">SVG is XML-based vector markup. It lives in the DOM, can be styled with CSS, animated with JavaScript, and scales infinitely without a single pixel of quality loss. That's what makes it excellent for logos, icons, and diagrams on sites you control.</p>

            <p class="mb-4">The problem: those same capabilities make SVG a security liability when you don't control who uploads it. SVG files can carry XSS (cross-site scripting) and XXE (XML external entity) payloads. Real-world security advisories have documented cases where malicious SVG profile images executed attacker JavaScript in other users' browsers.</p>

            <p class="mb-4">WordPress core knows this. Its MIME-type whitelist includes JPEG, PNG, GIF, and ICO by default — but not SVG. Core doesn't ship with SVG sanitization, so it simply blocks SVG uploads rather than expose sites to exploitable files. It's a conservative but sensible call.</p>

            <div class="bg-[#F5F9FF] rounded-2xl border border-blue-200 p-6 flex gap-4 items-start my-6">
                <div class="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-base flex-shrink-0">📝</div>
                <div>
                    <strong class="block text-blue-800 font-bold mb-1 text-sm">Pro tip</strong>
                    <p class="text-[#6C3F31] text-base m-0">SVG's security risk is specific to <em>uploads from untrusted sources</em>. An SVG you created yourself in Figma or Illustrator and deploy directly via version control carries no meaningful risk — the danger is when platforms let arbitrary users upload SVG files to shared storage.</p>
                </div>
            </div>
        </section>

        <!-- 02 — CHEAT SHEET -->
        <section id="cheat-sheet" class="scroll-mt-24 my-12">
            <SectionHeading>Quick Decision Cheat Sheet</SectionHeading>

            <p class="mb-4">Use this as your first filter before going deeper into the guide.</p>

            <div class="overflow-x-auto rounded-2xl border border-pink-100 my-6">
                <table class="w-full min-w-[500px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3.5 text-sm font-black text-[#4A2C2C] border-b border-pink-100">Situation</th>
                            <th class="text-left px-4 py-3.5 text-sm font-black text-[#4A2C2C] border-b border-pink-100">Recommendation</th>
                        </tr>
                    </thead>
                    <tbody class="text-base">
                        {#each [
                            ['Logo or icon on your own site, you control the theme', 'Keep as SVG'],
                            ['WordPress media uploader (default install)', 'Convert to WebP or PNG'],
                            ['Etsy, Amazon, eBay product listing images', 'Convert to JPEG or PNG (SVG not accepted)'],
                            ['Email templates (Gmail, Outlook)', 'Convert to PNG — SVG widely unsupported'],
                            ['User-uploaded avatars or media on multi-user platform', 'Convert or sanitize; raster is safer'],
                            ['Diagrams and docs on a site you control', 'Keep as SVG'],
                            ['Marketplace storefronts, third-party dashboards', 'Convert to WebP/PNG'],
                            ['Internal asset archive, developer pipeline', 'Keep SVG as source; export WebP/AVIF for delivery'],
                        ] as [situation, rec], i}
                            <tr class={i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-4 py-3 border-b border-pink-50 text-[#6C3F31]">{situation}</td>
                                <td class="px-4 py-3 border-b border-pink-50 font-bold text-[#4A2C2C]">{rec}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <div class="bg-[#FFF9F5] rounded-2xl border border-orange-100 p-6 my-6">
                <p class="font-bold text-[#4A2C2C] mb-2">Format quick map after converting</p>
                <p class="text-base m-0">
                    <strong>WebP</strong> — safe default for WordPress and most modern web use.<br>
                    <strong>AVIF</strong> — best compression for modern-only sites and large illustrations.<br>
                    <strong>PNG</strong> — use when you need guaranteed transparency support in email or legacy platforms.<br>
                    <strong>JPEG XL</strong> — powerful for controlled archives and developer pipelines; not ready as a public web default.
                </p>
            </div>

            <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5 my-6 text-base">
                <strong>Try it now:</strong> Drop your SVG into <a href="https://mochify.app" class="text-[#D81B60] font-bold hover:underline">Mochify</a> and use Magic Flow — type "convert SVG to WebP with transparent background" and it handles the rest. No account, no plugin, no file retention.
            </div>
        </section>

        <!-- 03 — WHEN SVG WINS -->
        <section id="when-svg-wins" class="scroll-mt-24 my-12">
            <SectionHeading>When SVG Is the Best Format</SectionHeading>

            <p class="mb-4">SVG wins on sites and apps you fully control, where you can sanitize files and serve them safely. Here are the real-world cases where you should keep it as vector.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Logos on your own site</h3>
            <p class="mb-4">Infinite resolution, tiny files for simple shapes, easy theming with CSS, and perfect crispness on retina displays. If you own the theme and can control how files are sanitized or deployed, inline SVG or <code class="bg-[#FFF5F7] rounded-lg px-2 py-0.5 text-[#D81B60] font-mono text-sm">&lt;img src&gt;</code> SVG for your site header and footer is the right call.</p>
            <p class="mb-4">You get dark mode theming for free (a CSS <code class="bg-[#FFF5F7] rounded-lg px-2 py-0.5 text-[#D81B60] font-mono text-sm">fill</code> change, no new export), and the file itself is often just a few hundred bytes for a flat logo.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Icons and UI elements in web apps</h3>
            <p class="mb-4">Icon systems in SPAs and design systems benefit significantly from SVG sprites or inline SVG. You get hover states, recoloring, and dark mode support without re-exporting a new PNG every time the design changes. For a set of 50+ icons, a single SVG sprite will almost always beat an equivalent PNG sprite sheet on payload and request count.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Diagrams, charts, and technical documentation</h3>
            <p class="mb-4">SVG avoids text blurring when zoomed and keeps file sizes reasonable compared to large PNG diagrams. For documentation sites, dashboards, and admin UIs you control, SVG is the obvious choice when precision and accessibility matter.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Animated and interactive graphics</h3>
            <p class="mb-4">SVG + CSS/JavaScript gives you lightweight animations without video overhead. Explainer diagrams, step-by-step illustrations, and simple motion graphics all work well here — again, on properties you control.</p>

            <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6 my-6">
                <p class="m-0"><strong>The pattern:</strong> SVG wins when you control the front end, control uploads, and need what only vectors can deliver — scalability, theming, interactivity. If any of those conditions fall away, convert.</p>
            </div>
        </section>

        <!-- 04 — WHEN TO CONVERT -->
        <section id="when-to-convert" class="scroll-mt-24 my-12">
            <SectionHeading>When You Should Convert SVG to Raster</SectionHeading>

            <p class="mb-4">This is where most of the friction lives for non-developer site owners, ecommerce sellers, and agency clients.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">WordPress media library uploads</h3>
            <p class="mb-4">WordPress will reject SVG uploads with a "Sorry, this file type is not permitted for security reasons" error. You can unlock this with plugins like Safe SVG or custom code, but for non-technical publishers or client sites, that's friction that usually isn't worth adding. Convert your SVG to WebP or PNG before uploading to WordPress — you get a safe, optimized file without any extra plugins or security overhead.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Etsy, Shopify, and other ecommerce marketplaces</h3>
            <p class="mb-4">Etsy only accepts JPEG, PNG, and GIF for listing photos. SVG is not supported as a product image format, full stop. Shopify has partial SVG support in theme code but most merchants still rely on raster product images, and many marketplace listing tools reprocess everything to JPEG or WebP anyway. Practical rule: if the upload picker doesn't explicitly accept SVG, don't try to force it. Export a raster version upfront.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Email templates and newsletters</h3>
            <p class="mb-4">This one catches a lot of people off guard. Gmail and Outlook do not reliably render external SVG images. They often show broken images or strip SVG entirely. For logos, icons, and social badges in email, PNG at 2x resolution is dramatically more reliable. Save SVG for the web; use PNG for everything going into an email template.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">User-generated content on multi-tenant platforms</h3>
            <p class="mb-4">Any platform that lets users upload avatars, product images, or attachments is vulnerable if it accepts unsanitized SVG. XSS via malicious SVG uploads is a documented, real-world attack vector. In these contexts, it's often simpler and safer to block SVG at the upload layer and require PNG, JPEG, or WebP instead. The rasterization happens once, the risk is eliminated permanently.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Legacy and enterprise CMS environments</h3>
            <p class="mb-4">Many enterprise CMSs, DAMs, and LMS platforms either treat SVG as unsafe or don't generate correct thumbnails from vector files. Teams end up using PNG anyway for consistent previews — better to pre-convert with control over output quality than to let the platform rasterize badly.</p>

            <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5 my-6 text-base">
                <strong>Quick convert:</strong> Use Magic Flow on <a href="https://mochify.app" class="text-[#D81B60] font-bold hover:underline">Mochify</a> — type "convert SVG logos to PNG at 2x for email" and get back clean, compressed files instantly. No files stored after processing.
            </div>
        </section>

        <!-- 05 — WORDPRESS AND SVG -->
        <section id="wordpress-and-svg" class="scroll-mt-24 my-12">
            <SectionHeading>WordPress and SVG: Security, Sanitization, and Plugin Bloat</SectionHeading>

            <p class="mb-4">WordPress deserves its own section because this is where most site owners hit the wall, and the trade-offs are real.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Why core blocks SVG</h3>
            <p class="mb-4">Core's MIME-type whitelist is deliberate. Without built-in sanitization, an SVG upload is effectively a potential script upload. WordPress documentation and major hosts like WP Engine explicitly warn that enabling SVG without sanitization is dangerous. This isn't a quirk — it's a security policy.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">Enabling SVG safely (if you must)</h3>
            <p class="mb-4">If you need SVG in WordPress, the two main options are:</p>
            <p class="mb-4">A sanitizing plugin like <strong>Safe SVG</strong>, which runs uploads through a dedicated SVG sanitizer (based on the <code class="bg-[#FFF5F7] rounded-lg px-2 py-0.5 text-[#D81B60] font-mono text-sm">enshrined/svg-sanitize</code> library), integrates SVGO optimization, and lets you restrict who can upload SVG files. Or custom code using the <code class="bg-[#FFF5F7] rounded-lg px-2 py-0.5 text-[#D81B60] font-mono text-sm">upload_mimes</code> filter — but only with careful permission scoping so lower-trust roles can't upload arbitrary SVG files.</p>
            <p class="mb-4">WP Engine recommends limiting SVG uploads to admin-level users only, even when using a sanitizing plugin.</p>

            <h3 class="text-xl font-black text-[#4A2C2C] mt-8 mb-3">The plugin trade-off</h3>
            <p class="mb-4">Every plugin you add to WordPress brings update overhead, potential conflicts, and sometimes database or thumbnail bloat. Plugin bloat is a real drag on maintenance — the same reason we built Mochify to work entirely outside WordPress rather than as another plugin you have to monitor.</p>
            <p class="mb-4">For most WordPress sites, the cleaner workflow is: keep SVG files in your design tooling or version control, convert to WebP or AVIF using Mochify before uploading, and skip the SVG plugin entirely. You get 90% of the quality benefits with fewer moving parts and no SVG-specific security surface to maintain.</p>

            <div class="bg-[#FFFBEB] rounded-2xl border-2 border-dashed border-yellow-300 p-6 my-6">
                <p class="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">⚗️ Benchmark Placeholder — Real data to be added</p>
                <p class="font-bold text-[#4A2C2C] mb-1 text-base">SVG to WebP: WordPress logo conversion test</p>
                <p class="text-sm text-[#875F42] m-0">Insert real-world file size data here once benchmarks are run. Example format: "Our test flat-logo SVG ([X KB]) converted to WebP via Mochify at quality 85 produced a [X KB] file — a [X]% reduction versus an equivalent PNG export ([X KB]), with full transparency preserved."</p>
            </div>
        </section>

        <!-- 06 — CHOOSING RASTER FORMAT -->
        <section id="choosing-raster-format" class="scroll-mt-24 my-12">
            <SectionHeading>Choosing the Right Raster Format After Converting</SectionHeading>

            <p class="mb-4">Once you've decided to convert an SVG, you have three modern format options worth knowing. Here's how they compare for SVG-derived assets specifically.</p>

            <div class="overflow-x-auto rounded-2xl border border-pink-100 my-6">
                <table class="w-full min-w-[500px] border-collapse">
                    <thead>
                        <tr class="bg-[#FFF5F7]">
                            <th class="text-left px-4 py-3.5 text-sm font-black text-[#4A2C2C] border-b border-pink-100 whitespace-nowrap">Format</th>
                            <th class="text-left px-4 py-3.5 text-sm font-black text-[#4A2C2C] border-b border-pink-100 whitespace-nowrap">Browser support</th>
                            <th class="text-left px-4 py-3.5 text-sm font-black text-[#4A2C2C] border-b border-pink-100 whitespace-nowrap">Compression vs PNG</th>
                            <th class="text-left px-4 py-3.5 text-sm font-black text-[#4A2C2C] border-b border-pink-100 whitespace-nowrap">Transparency</th>
                            <th class="text-left px-4 py-3.5 text-sm font-black text-[#4A2C2C] border-b border-pink-100">Best for</th>
                        </tr>
                    </thead>
                    <tbody class="text-base">
                        {#each [
                            ['WebP', '~96% (effectively universal)', '25–35% smaller', 'Full alpha', 'WordPress, WooCommerce, general web use'],
                            ['AVIF', '~95% (newer but solid)', 'Often better than WebP, esp. for detail', 'Full alpha', 'Modern-only sites, large hero illustrations'],
                            ['JPEG XL', 'Limited/experimental', 'Excellent, esp. lossless', 'Full alpha', 'Controlled archives, developer pipelines'],
                            ['PNG', 'Universal', 'Larger files (lossless)', 'Full alpha', 'Email, legacy platforms, guaranteed compatibility'],
                        ] as [fmt, support, compression, transparency, bestFor], i}
                            <tr class={i % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'}>
                                <td class="px-4 py-3 border-b border-pink-50 font-bold text-[#4A2C2C]">{fmt}</td>
                                <td class="px-4 py-3 border-b border-pink-50 text-[#6C3F31]">{support}</td>
                                <td class="px-4 py-3 border-b border-pink-50 text-[#6C3F31]">{compression}</td>
                                <td class="px-4 py-3 border-b border-pink-50 text-[#6C3F31]">{transparency}</td>
                                <td class="px-4 py-3 border-b border-pink-50 text-[#6C3F31]">{bestFor}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 my-6">
                {#each [
                    { label: 'WebP browser support', value: '~96%', note: 'Safe default for all modern web use' },
                    { label: 'WebP vs PNG size saving', value: '25–35%', note: 'Typical saving on SVG-derived logos and icons' },
                    { label: 'AVIF browser support', value: '~95%', note: 'Strong, but WebP fallback still recommended' },
                ] as stat}
                    <div class="bg-[#FFF9F5] rounded-2xl border border-orange-100 p-5">
                        <p class="text-xs font-bold uppercase tracking-wider text-[#875F42] mb-1">{stat.label}</p>
                        <p class="text-3xl font-black text-[#D81B60] leading-tight mb-1">{stat.value}</p>
                        <p class="text-sm text-[#875F42] m-0">{stat.note}</p>
                    </div>
                {/each}
            </div>

            <p class="mb-4"><strong>For most people:</strong> WebP is the right default. It's supported in every modern browser, compresses SVG-derived logos and icons significantly smaller than PNG (typically 25–35%), and handles transparent backgrounds properly.</p>

            <p class="mb-4"><strong>For aggressive compression on modern sites:</strong> AVIF is worth adding as a primary format with a WebP fallback. It delivers better compression than WebP at equivalent quality, particularly for complex illustrations. Encoding is slower, so it's better suited to a pre-processing workflow than on-demand conversion.</p>

            <p class="mb-4"><strong>For JPEG XL:</strong> It's technically impressive — strong compression, lossless and near-lossless modes, full transparency — but browser support is still limited. Use it for internal asset archives and developer pipelines where you control the decoder, not as a primary web delivery format.</p>

            <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5 my-6 text-base">
                <strong>Convert your SVGs:</strong> <a href="https://mochify.app" class="text-[#D81B60] font-bold hover:underline">Mochify supports all three formats</a> — SVG to WebP, SVG to AVIF, and SVG to JPEG XL. Processed in memory, discarded after download. No account required on the free tier.
            </div>
        </section>

        <!-- 07 — DECISION FRAMEWORK -->
        <section id="decision-framework" class="scroll-mt-24 my-12">
            <SectionHeading>Decision Framework: Step-by-Step</SectionHeading>

            <p class="mb-6">Run your SVG through this before deciding what to do with it.</p>

            <div class="space-y-6">
                {#each [
                    {
                        title: 'Step 1 — Where is this SVG going first?',
                        items: [
                            'A site or app you fully control (theme, CSP, sanitization in place) — go to Step 2.',
                            'A third-party platform (Etsy, Shopify marketplace listings, email tool, SaaS profile uploader) — convert to raster unless their documentation explicitly confirms SVG support.',
                        ]
                    },
                    {
                        title: 'Step 2 — Does the platform officially accept SVG uploads?',
                        items: [
                            'WordPress core media uploader: No — blocked by default. Requires code or plugin.',
                            'Etsy, most marketplaces: No — JPEG/PNG/GIF only.',
                            'Email clients (Gmail, Outlook): No — external SVG widely unsupported.',
                            'If any answer is "no," convert to WebP, PNG, or AVIF for that channel.',
                        ]
                    },
                    {
                        title: 'Step 3 — Who created the SVG and who can upload it?',
                        items: [
                            'Only your internal team, stored in version control, deployed by developers: treat as trusted, keep as SVG, use proper CSP headers.',
                            'Clients, vendors, or end users can upload SVG through a media library: either sanitize aggressively with Safe SVG or block SVG and require raster uploads. Rasterizing via Mochify before upload is often the simpler path.',
                        ]
                    },
                    {
                        title: 'Step 4 — Do you need SVG-specific features?',
                        items: [
                            'You need CSS theming, hover animations, or DOM-level accessibility at runtime: keep as SVG on platforms that support it.',
                            'The graphic is static (logo, badge, illustration) and never changes color or shape at runtime: rasterization is fine — choose format based on target.',
                        ]
                    },
                    {
                        title: 'Step 5 — Format selection after conversion',
                        items: [
                            'WordPress front-end, Shopify storefront, WooCommerce: WebP as baseline, AVIF where you\'ve confirmed support.',
                            'Email or legacy CMS: PNG (for transparency) or JPEG.',
                            'Internal archives or image-heavy controlled apps: JPEG XL storage with WebP/AVIF for delivery.',
                        ]
                    },
                ] as step}
                    <div class="border-l-4 border-[#F06292] pl-5">
                        <h3 class="text-base font-black text-[#D81B60] mb-2">{step.title}</h3>
                        <ul class="space-y-1.5 ml-4 list-disc marker:text-[#F06292]">
                            {#each step.items as item}
                                <li class="text-base text-[#6C3F31]">{item}</li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>
        </section>

        <!-- 08 — WORKFLOW RECIPES -->
        <section id="workflow-recipes" class="scroll-mt-24 my-12">
            <SectionHeading>Workflow Recipes with Mochify</SectionHeading>

            <p class="mb-6">Four real-world conversion workflows. Each uses Magic Flow — describe the output you want in plain English, Mochify handles the rest.</p>

            <div class="space-y-4">
                {#each [
                    {
                        title: 'Recipe 1 — WordPress theme logo: SVG to WebP',
                        body: 'Export your SVG logo from Figma or Illustrator. Drop it into Mochify and use Magic Flow: type <strong>"convert logo SVG to WebP with transparent background."</strong> Upload the resulting WebP to WordPress — no SVG plugin needed, no sanitization concerns, and the file will typically be 30–50% smaller than a comparable PNG export. Keep the original SVG in your design files or version control.',
                    },
                    {
                        title: 'Recipe 2 — Marketplace listing stickers: SVG to PNG',
                        body: 'Convert vector badges and stickers to PNG at platform-recommended dimensions. Etsy recommends 2000px minimum on the longest side. Use Magic Flow: <strong>"convert SVG sticker to PNG at 2000px, keep transparent background."</strong> The result meets Etsy\'s file requirements and preserves the sharp edges and transparency of your original vector.',
                    },
                    {
                        title: 'Recipe 3 — Email-safe logos and icons: SVG to PNG',
                        body: 'Convert your logo and key icons to PNG at 2x resolution for email templates. In Mochify: <strong>"convert SVG logo to PNG at 400px wide."</strong> This avoids the Gmail/Outlook broken-image problem entirely. For a logo that renders at 200px in an email header, a 400px PNG at 2x gives you retina sharpness without SVG\'s email compatibility risk.',
                    },
                    {
                        title: 'Recipe 4 — Developer pipeline: SVG source, WebP/AVIF delivery',
                        body: 'For teams building in Figma or Illustrator, the cleanest workflow is to store all design assets as SVG (or JPEG XL for archival) in version control, then generate WebP and AVIF variants for production at build time using the Mochify REST API (<code class="bg-[#FFF5F7] rounded px-1.5 py-0.5 text-[#D81B60] font-mono text-sm">POST /v1/squish?type=webp</code>) or the CLI (<code class="bg-[#FFF5F7] rounded px-1.5 py-0.5 text-[#D81B60] font-mono text-sm">--prompt "convert to AVIF and WebP, max 1600px"</code>). This keeps your source files lossless and your delivery files optimized, with no per-export manual steps.',
                    },
                ] as recipe}
                    <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-6">
                        <h3 class="text-lg font-black text-[#4A2C2C] mb-3">{recipe.title}</h3>
                        <p class="text-base text-[#6C3F31] m-0">{@html recipe.body}</p>
                    </div>
                {/each}
            </div>

            <div class="bg-gradient-to-br from-[#FFF5F7] to-[#FDFBF7] rounded-3xl border border-pink-100 p-8 mt-8">
                <div class="flex items-center gap-3 mb-1">
                    <span class="w-1.5 h-8 bg-[#F06292] rounded-sm flex-shrink-0"></span>
                    <h2 class="text-xl font-black text-[#4A2C2C]">Mochify Workflow: Convert SVG to WebP, AVIF, or PNG</h2>
                </div>
                <p class="text-sm text-[#875F42] mb-6 ml-4">No account required on the free tier. Up to 3 files per session.</p>

                <ol class="space-y-5">
                    {#each [
                        ['Go to mochify.app', 'and open the Magic Flow prompt — no signup needed to start converting on the free tier.'],
                        ['Drop your SVG file', 'into the upload zone. Batch processing is supported — up to 25 files on Lite and Pro plans.'],
                        ['Describe what you want', 'in plain English. For example: "Convert this SVG to WebP with transparent background at 1200px wide" or "Convert to PNG at 2x for email, keep transparency."'],
                        ['Magic Flow parses your instruction', 'and applies the correct format, dimensions, and quality settings. No format dropdowns, no manual configuration.'],
                        ['Download your converted file.', 'WebP, AVIF, PNG, or JPEG XL — whichever format you requested. Your SVG source is never stored.'],
                        ['Upload directly to WordPress, Etsy, your email tool,', 'or wherever the asset is headed — without any plugin or security workaround needed.'],
                    ] as [bold, rest], i}
                        <li class="flex gap-4 items-start">
                            <span class="w-8 h-8 rounded-full bg-[#F06292] text-white font-black text-sm flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                            <span class="text-base text-[#6C3F31] leading-relaxed"><strong class="text-[#4A2C2C]">{bold}</strong> {rest}</span>
                        </li>
                    {/each}
                </ol>

                <div class="mt-6 pt-5 border-t border-pink-100 text-sm text-[#875F42]">
                    🔒 <strong>Privacy note:</strong> All processing happens in-memory only. Your files are never written to disk, never stored, never used for training, and wiped immediately after your download. Zero retention.
                </div>
            </div>
        </section>

        <!-- CTA -->
        <div class="bg-gradient-to-br from-[#FFF5F7] to-[#FDFBF7] rounded-3xl border border-pink-100 p-8 my-8 text-center">
            <h3 class="text-xl font-black text-[#4A2C2C] mb-2">Convert your SVGs in seconds</h3>
            <p class="text-[#6C3F31] text-base mb-5">WebP, AVIF, PNG, or JPEG XL — describe the output you want, Mochify handles the rest. No account needed on the free tier. No files stored after download.</p>
            <a href="https://mochify.app" class="inline-block bg-[#F06292] hover:bg-[#D81B60] text-white rounded-xl px-7 py-3 font-black text-base transition-colors no-underline">
                Convert SVG now at mochify.app →
            </a>
        </div>

        <!-- 09 — FAQ -->
        <section id="faq" class="scroll-mt-24 my-12">
            <SectionHeading>FAQ</SectionHeading>

            <div class="divide-y divide-pink-50">
                {#each [
                    {
                        q: 'Why does WordPress block SVG uploads by default?',
                        a: 'WordPress blocks SVG because SVG files are XML and can contain scripts. Without built-in sanitization, an SVG upload is a potential XSS or XXE attack vector. Core takes the conservative position of blocking SVG entirely rather than shipping sanitization code that could itself be exploited or misconfigured.'
                    },
                    {
                        q: 'Is it safe to enable SVG in WordPress with a plugin?',
                        a: "It can be safe if you use a sanitizing plugin like Safe SVG, restrict SVG uploads to admin-level users only, and keep the plugin updated. But you're still adding security overhead and update maintenance that you'd avoid by simply converting SVGs to WebP or PNG before uploading."
                    },
                    {
                        q: 'When is SVG definitively better than WebP or PNG?',
                        a: 'SVG is clearly better for logos, icons, and vector illustrations on sites you control, where infinite scalability, CSS theming, and tiny file sizes matter more than universal platform support. A flat SVG logo at 2KB beats any raster equivalent.'
                    },
                    {
                        q: 'When should I convert SVG to WebP instead of keeping it?',
                        a: "Convert when the target platform doesn't accept SVG — WordPress default, Etsy, most email tools — or when you don't want to manage SVG sanitization in WordPress but still need small, transparency-supporting images. WebP is the right format for almost all of these cases."
                    },
                    {
                        q: 'Is AVIF better than WebP for converted SVG graphics?',
                        a: 'AVIF often compresses better than WebP and handles transparency well. But encoding is slower and browser support, while strong, is still newer — WebP remains the safer default for broad compatibility. Use AVIF for complex illustrations or hero images on modern-only sites; use WebP as your baseline everywhere else.'
                    },
                    {
                        q: 'Why do SVG logos break in Gmail or Outlook?',
                        a: 'Gmail and Outlook do not reliably render external SVG images — they often display a broken image icon or strip SVG entirely. Use PNG or JPEG for logos and icons in email templates. A PNG at 2x resolution will look sharp on retina screens and render reliably across all major email clients.'
                    },
                    {
                        q: 'Does converting SVG to WebP or AVIF remove the security risk?',
                        a: 'Yes. Once an SVG is rasterized to WebP or AVIF, it becomes pixel data and can no longer execute scripts. Even if the original SVG contained malicious markup, the raster export is safe to serve and upload. This is one of the underrated benefits of a rasterization workflow.'
                    },
                    {
                        q: "What's the advantage of using Mochify instead of a generic online converter?",
                        a: 'Most online converters store uploaded files on disk and may retain them for hours or days. Mochify processes everything in memory only and discards files immediately after download — no persistent storage, no training data, no retention. You also get native support for WebP, AVIF, and JPEG XL in a single tool, with Magic Flow natural language processing so you can describe the output you want in plain English rather than configuring format dropdowns.'
                    },
                ] as faq}
                    <div class="py-5">
                        <h3 class="text-base font-black text-[#4A2C2C] mb-2">{faq.q}</h3>
                        <p class="text-base text-[#6C3F31] leading-relaxed m-0">{faq.a}</p>
                    </div>
                {/each}
            </div>
        </section>

        <!-- 10 — RELATED GUIDES -->
        <section id="related-guides" class="scroll-mt-24 my-12">
            <SectionHeading>Related Guides</SectionHeading>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {#each [
                    {
                        href: '/guides/next-gen-image-formats-wordpress',
                        title: 'Next-gen formats in WordPress (without plugins) →',
                        desc: 'The companion workflow guide for serving WebP and AVIF in WordPress without a page-builder plugin.'
                    },
                    {
                        href: '/guides/history-image-compression-2026',
                        title: 'The history of image compression: WebP, AVIF, JPEG XL →',
                        desc: 'A deeper look at how modern formats compare and where each one wins.'
                    },
                    {
                        href: '/guides/exif-data-risks-image-compression-2026',
                        title: 'EXIF data risks: strip metadata before you publish →',
                        desc: "Why zero-retention matters beyond just format choice — and what's hiding in your image files."
                    },
                ] as guide}
                    <a href={guide.href} class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5 block no-underline hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300">
                        <h3 class="text-base font-black text-[#4A2C2C] mb-1">{guide.title}</h3>
                        <p class="text-sm text-[#6C3F31] leading-relaxed m-0">{guide.desc}</p>
                    </a>
                {/each}
            </div>
        </section>

        <!-- Tool links + byline -->
        <div class="mt-10 pt-6 border-t border-pink-50 flex flex-wrap gap-3">
            <a href="/solutions/svg-to-webp" class="bg-[#FFF5F7] border border-pink-100 rounded-lg px-3.5 py-1.5 text-sm font-bold text-[#D81B60] hover:bg-pink-100 transition-colors no-underline">Convert SVG to WebP</a>
            <a href="/solutions/svg-to-avif" class="bg-[#FFF5F7] border border-pink-100 rounded-lg px-3.5 py-1.5 text-sm font-bold text-[#D81B60] hover:bg-pink-100 transition-colors no-underline">Convert SVG to AVIF</a>
            <a href="/solutions/svg-to-jxl" class="bg-[#FFF5F7] border border-pink-100 rounded-lg px-3.5 py-1.5 text-sm font-bold text-[#D81B60] hover:bg-pink-100 transition-colors no-underline">Convert SVG to JPEG XL</a>
        </div>

        <p class="text-sm text-[#875F42] mt-4">Published May 2026 by the Mochify Engineering Team. Last updated: May 2026.</p>

    </div>
</article>
