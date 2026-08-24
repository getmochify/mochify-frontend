<script lang="ts">
    import { onMount } from 'svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import PromptForm from '$lib/components/PromptForm.svelte';
    import { getPlan } from '$lib/user';

    // Honoured by the constellation pulses and the demo loops. Set on mount so
    // SSR output stays static and the first paint never animates unexpectedly.
    let reduceMotion = $state(false);

    let copied = $state(false);
    async function copyInstall() {
        try {
            await navigator.clipboard.writeText('brew install mochify');
            copied = true;
            setTimeout(() => (copied = false), 2000);
        } catch {
            // clipboard unavailable, no-op
        }
    }

    // Free-plan nudge, shown once after a successful batch. Ported from the
    // old homepage along with PromptForm itself.
    let showUpgradeCTA = $state(false);
    let upgradeCTADismissed = $state(false);
    async function handleSuccess() {
        if (!upgradeCTADismissed) {
            const plan = await getPlan();
            if (plan === 'free') showUpgradeCTA = true;
        }
    }

    // PWA install affordances, also ported from the old homepage.
    let installPrompt: BeforeInstallPromptEvent | null = $state(null);
    let installDismissed = $state(false);
    let isIosInstall = $state(false);
    let showIosTooltip = $state(false);

    async function triggerInstall() {
        if (!installPrompt) return;
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            installPrompt = null;
            installDismissed = true;
        }
    }

    const heroPoints = [
        'Plain-English prompts, no settings to learn',
        'Images, video, and PDFs in one drop zone',
        'Batch up to 25 files, zipped on the way out',
        '3 files free, no account needed'
    ];

    // Surface constellation. Coords are % of a wide diagram box; the core sits
    // at 50/50 with three surfaces down each side.
    // Surface map. Install-once surfaces run down the left, nothing-to-install
    // down the right, both feeding the same engine at 50/50.
    const surfaceNodes = [
        { label: 'Direct CLI', x: 16, y: 18, icon: 'M8 9l3 3-3 3m5 0h3' },
        { label: 'Local MCP', x: 12, y: 50, icon: 'M5 12h14M12 5l7 7-7 7' },
        { label: 'Chrome extension', x: 17, y: 82, icon: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0a.64.64 0 00.657.643 48.025 48.025 0 005.395-.435 48.879 48.879 0 00-.436-5.395.64.64 0 01.643-.657v0c.355 0 .676.186.959.401.29.221.634.349 1.003.349 1.036 0 1.875-1.007 1.875-2.25s-.84-2.25-1.875-2.25c-.369 0-.713.128-1.003.349-.283.215-.604.401-.959.401v0a.64.64 0 01-.643-.657 48.387 48.387 0 00-.301-4.163c-1.613.186-3.25.293-4.908.315a.656.656 0 01-.663-.658v0z' },
        { label: 'Web app', x: 84, y: 18, icon: 'M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6z' },
        { label: 'Hosted MCP', x: 88, y: 50, icon: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z' },
        { label: 'REST API', x: 83, y: 82, icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' }
    ];

    const claudeConfig = `{
  "mcpServers": {
    "mochify": {
      "command": "mochify",
      "args": ["serve"]
    }
  }
}`;

    // href is set only where a real destination exists. The two without one render
    // as plain cards, so a card that looks clickable always is.
    const surfaces = [
        { tag: 'Recommended', title: 'Local MCP server', body: 'Claude Desktop, Cursor, any stdio MCP client. Folder-on-disk friendly, and bytes never enter the agent context.', mono: 'mochify serve', href: '/guides/how-the-mochify-mcp-server-works' },
        { tag: 'Shell', title: 'Direct CLI', body: 'Build scripts, CI, agentic pipelines. A single pipe-friendly Rust binary.', mono: 'mochify *.jpg -p "..."' },
        { tag: 'Extension', title: 'Chrome extension', body: 'One-click compression from any page you are browsing.', mono: 'chrome web store', href: 'https://chromewebstore.google.com/detail/pgegchhkcjdcnnppeahkdcalclpaamcj', external: true },
        { tag: 'Browser', title: 'Web app', body: 'Drop, type, done. No install, 3 files free without an account, and the only surface that converts video.', mono: 'mochify.app/flow', href: '/flow' },
        { tag: 'No install', title: 'Hosted MCP', body: 'OAuth connector that lives inside chat. Nothing to install.', mono: 'mcp.mochify.app' },
        { tag: 'Server-side', title: 'REST API', body: 'Bearer-token auth. cURL, JS, Python, anywhere you can make an HTTPS request.', mono: 'api.mochify.app', href: '/docs' }
    ];

    // Three different privacy models, and the copy has to be exact about which is
    // which: images and PDFs are processed server-side in RAM, video never leaves
    // the browser at all (MediaBunny, client-side, no API call).
    const assets = [
        {
            kind: 'Images',
            icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z',
            formats: ['AVIF', 'JPEG XL', 'WebP', 'Jpegli', 'PNG'],
            body: 'Smart-crop, EXIF strip, HDR gain-map, and background removal. Streamed into the engine in RAM and discarded on the way out.',
            where: 'In RAM, never on disk',
            local: false
        },
        {
            kind: 'Video and audio',
            icon: 'M4.5 3h15a1.5 1.5 0 011.5 1.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3zm2.25 0v18m10.5-18v18M3 7.5h18M3 12h18M3 16.5h18',
            formats: ['MP4', 'WebM', 'MKV', 'MOV', 'MP3', 'WAV', 'FLAC'],
            body: 'Converted entirely in your browser with MediaBunny. No upload, no API call, no server involved.',
            where: 'Never leaves your browser',
            local: true
        },
        {
            kind: 'PDFs',
            icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
            formats: ['PDF'],
            body: 'Recompress embedded images and flatten oversized documents, without re-exporting from the original app.',
            where: 'In RAM, never on disk',
            local: false
        }
    ];

    const features = [
        {
            label: 'Magic Flow',
            title: 'Describe the goal in plain English.',
            body: 'No format pickers, no quality sliders. Type what you want and Magic Flow resolves the format, dimensions, crop, and options for you, across one file or a hundred.',
            demo: '/videos/magic.mp4',
            poster: '/videos/magic-poster.jpg',
            quote: '"convert to webp, 1200px and 800px, strip exif"'
        },
        {
            label: 'Direct CLI',
            title: 'Pipe it into any workflow.',
            body: 'A single Rust binary that reads paths on stdin and slots cleanly into build steps, CI, and agentic content pipelines. Zero image bytes in any agent context.',
            demo: '/videos/mochify-cli.mp4',
            poster: '/videos/mochify-cli-poster.jpg',
            quote: 'find . -name "*.heic" | mochify -t avif -o ./out'
        },
        {
            label: 'Local MCP',
            title: 'Compress from inside Claude.',
            body: 'Ask Claude in plain language. The local binary opens the file, sends bytes to the engine, writes the result to disk, and hands back only a path and a size.',
            demo: '/videos/mcp-claude.mp4',
            poster: '/videos/mcp-claude-poster.jpg',
            quote: '"Convert ~/Desktop/hero.jpg to AVIF at 1200px wide."'
        }
    ];

    onMount(() => {
        reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

        // Demo loops are several MB each. Attach src only when a card is close to
        // the viewport, and pause once it leaves so offscreen clips stop decoding.
        const videoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target as HTMLVideoElement;
                    if (entry.isIntersecting) {
                        if (!video.src && video.dataset.src) video.src = video.dataset.src;
                        if (!reduceMotion) video.play().catch(() => {});
                    } else if (!video.paused) {
                        video.pause();
                    }
                });
            },
            { rootMargin: '300px 0px', threshold: 0 }
        );
        document.querySelectorAll('.js-demo').forEach((el) => videoObserver.observe(el));

        const onBeforeInstall = (e: Event) => {
            e.preventDefault();
            installPrompt = e as BeforeInstallPromptEvent;
        };
        window.addEventListener('beforeinstallprompt', onBeforeInstall);

        const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true);
        if (isIos && !isStandalone) isIosInstall = true;

        return () => {
            observer.disconnect();
            videoObserver.disconnect();
            window.removeEventListener('beforeinstallprompt', onBeforeInstall);
        };
    });
</script>

<svelte:head>
    <title>Compress images, video & PDFs with plain language | Mochify</title>
    <meta name="description" content="Drop a file and say what you want. AVIF, WebP, JPEG XL and PDF compression in your browser, from the CLI, or inside Claude via a local MCP server. Zero retention.">

        <!-- canonical, og:image and twitter:image are injected by the root layout. -->

        <!-- Open Graph -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mochify.app/" />
        <meta property="og:title" content="Compress images, video & PDFs with plain language | Mochify" />
        <meta property="og:description" content="One engine, six surfaces: web app, CLI, local and hosted MCP, REST API, Chrome extension. Zero retention on images and PDFs; video never leaves your browser." />

        <!-- Twitter / X -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Compress images, video & PDFs with plain language | Mochify" />
        <meta name="twitter:description" content="Web app, CLI, local and hosted MCP, REST API, Chrome extension. Zero retention on images and PDFs; video never leaves your browser." />

        <!-- Single graph for the page. The Organization node it references by
             @id is emitted sitewide from the root layout, so it is not repeated
             here; same-page JSON-LD is merged by @id. -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": "https://mochify.app/#website",
                    "url": "https://mochify.app",
                    "name": "Mochify",
                    "publisher": { "@id": "https://mochify.app/#organization" },
                    "inLanguage": "en"
                },
                {
                    "@type": "WebApplication",
                    "@id": "https://mochify.app/#webapp",
                    "name": "Mochify",
                    "url": "https://mochify.app",
                    "description": "Compress, convert, resize and crop images, video and PDFs by describing what you want in plain language. Images and PDFs are streamed through a native C++ engine in RAM with zero retention; video is converted entirely in the browser and never uploaded. Try 3 files free with no account.",
                    "applicationCategory": "MultimediaApplication",
                    "operatingSystem": "Any",
                    "browserRequirements": "Requires a modern browser with JavaScript enabled",
                    "publisher": { "@id": "https://mochify.app/#organization" },
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "description": "Free tier: 3 files per batch with no account, or 25 images per month with a free account. Paid plans raise the monthly allowance, file size and batch size; see https://mochify.app/pricing for local pricing.",
                        "url": "https://mochify.app/pricing"
                    },
                    "isAccessibleForFree": true,
                    "featureList": [
                        "Natural-language Magic Flow: describe the output instead of choosing settings",
                        "AVIF, WebP, JPEG XL, Jpegli JPEG and PNG output; JPEG, PNG, WebP, AVIF, HEIC/HEIF and JPEG XL input",
                        "Resize, rotate, saliency-guided smart crop and background removal",
                        "EXIF stripping",
                        "PDF tools: recompress embedded images, rasterize pages, split documents",
                        "In-browser video and audio conversion (MP4, WebM, MKV, MOV, MP3, WAV, FLAC) with no upload",
                        "Batch processing: 3 files free, up to 25 per batch on paid plans, zipped output",
                        "Zero retention on images and PDFs; video never leaves the browser",
                        "Local and hosted MCP servers, CLI, REST API and Chrome extension on every plan"
                    ],
                    "inLanguage": "en"
                },
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://mochify.app/#cli",
                    "name": "Mochify CLI",
                    "description": "Rust binary that runs as a direct command-line tool or as a local MCP server for Claude Desktop, Claude Code, Cursor and any stdio MCP client. Only file paths and result metadata enter the agent context; image bytes never do.",
                    "applicationCategory": "DeveloperApplication",
                    "operatingSystem": "macOS, Linux, Windows",
                    "softwareVersion": "1.5.0",
                    "downloadUrl": "https://github.com/getmochify/mochify-cli/releases",
                    "installUrl": "https://github.com/getmochify/mochify-cli",
                    "codeRepository": "https://github.com/getmochify/mochify-cli",
                    "programmingLanguage": "Rust",
                    "publisher": { "@id": "https://mochify.app/#organization" },
                    "isAccessibleForFree": true,
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    }
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://mochify.app/#faq",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "Is Mochify free to use?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. Try 3 files free without an account. A free account (no card needed) gives you 25 images a month at up to 20 MB each, with every output format, Magic Flow, background removal, and full CLI, MCP and API access. Seller and Pro plans raise the monthly allowance to 300 and 1,200 images, lift the file limit to 75 MB, allow batches of 25 files, and add priority processing. If you just need a bigger batch for one afternoon, a Day Pass unlocks 100 uploads for 24 hours with no subscription. Current prices for your region are on the pricing page."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Are my images stored or shared?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "No. Mochify streams each image or PDF straight into the encoder in server RAM, compresses it, returns the result and discards it. Originals are never written to disk and no logs contain image data. The one exception is the hosted MCP connector, which keeps the compressed output on an unguessable URL for up to five minutes so your chat client can fetch it; the original is still discarded immediately, and the local CLI and MCP server hold nothing server-side at all. Video is converted entirely in your browser and never uploaded."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How much smaller will my images be?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "It depends on the format and the source. As a guide, Jpegli typically produces JPEGs around 35% smaller than a standard encoder at the same visual quality, WebP is around 26% smaller than JPEG, and AVIF is roughly 50% smaller than JPEG and 20% smaller than WebP. Smart Compress picks the best quality-to-size balance for each image automatically, so you never have to guess a quality setting."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What image formats does Mochify support?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Input: JPEG, PNG, WebP, AVIF, HEIC/HEIF and JPEG XL. Output: JPEG (via Jpegli), PNG, WebP, AVIF and JPEG XL. Without an account you can process 3 files per batch; paid plans allow batches of up to 25. For larger volumes, the CLI and REST API handle scripted bulk processing with no per-file overhead."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Does Mochify have an API?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. The REST API lives at api.mochify.app and is available on every plan, including Free. Send a raw image body to POST /v1/squish with a type parameter, or use POST /v1/pdf for PDF tools. A free account gives you a bearer token and 25 images a month; Seller and Pro raise that to 300 and 1,200. The API documentation has examples in cURL, JavaScript and Python."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Can I use Mochify from the command line or inside Claude?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes, on every plan. Install the Rust binary with brew install mochify (Linux and Cargo paths are on the repo). The same binary runs as a direct CLI and, with mochify serve, as a local MCP server for Claude Desktop, Claude Code, Cursor and any stdio MCP client. Because the binary opens files on your own disk, only file paths and result metadata cross the agent context, never image bytes. If you would rather not install anything, the hosted MCP at mcp.mochify.app connects with OAuth."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is Magic Flow?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Magic Flow is Mochify's natural-language interface. Instead of choosing a format and quality setting, you describe what you want, for example \"convert to AVIF and strip location data\" or \"make these web-ready, max 1600px wide\", and Mochify works out the right parameters for each file. It uses a two-step pipeline: a language model parses the prompt, then the native engine executes it. Magic Flow is available in the web app, the CLI (-p) and both MCP servers."
                            }
                        }
                    ]
                }
            ]
        }
        </script>
</svelte:head>

<Navigation />

<main class="relative z-10">

    <!-- ═══ 1. HERO · copy + install on the left, the live tool on the right ═══ -->
    <section class="pt-10 md:pt-16 pb-12 md:pb-16">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
            <div class="flex flex-col md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-5 md:items-center">

                <!-- A: headline. First in the DOM on every breakpoint. -->
                <div class="order-1 md:col-start-1 md:row-start-1 md:self-end">
                    <p class="text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-[#F06292] mb-4">
                        Image compression, built for AI-native workflows
                    </p>
                    <h1 class="font-heading font-black text-4xl sm:text-5xl md:text-[3.4rem] leading-[1.05] tracking-tight text-[#4A2C2C] mb-5 md:mb-0">
                        Compress images, video, and PDFs with plain language.
                    </h1>
                </div>

                <!-- B: the tool. Sits second on mobile so a phone reaches it immediately. -->
                <div class="order-2 md:col-start-2 md:row-start-1 md:row-span-2 md:self-center mb-10 md:mb-0">
                    <PromptForm onSuccess={handleSuccess} />

                    {#if showUpgradeCTA}
                        <div class="mt-4 animate-slide-up">
                            <div class="relative rounded-2xl overflow-hidden glass-card-pink shadow-sm">
                                <button
                                    onclick={() => { showUpgradeCTA = false; upgradeCTADismissed = true; }}
                                    class="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-[#875F42]/40 hover:text-[#7A5A3A] transition-all cursor-pointer"
                                    aria-label="Dismiss"
                                >
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                                <div class="px-5 pt-4 pb-1">
                                    <p class="text-xs font-extrabold tracking-widest uppercase text-[#F06292]/60 mb-0.5">You're on the free plan</p>
                                    <h3 class="text-base font-black text-[#4A2C2C] leading-snug">Running a lot of images? Get more headroom.</h3>
                                    <p class="text-xs text-[#7A5A3A] mt-1">Free account gives you 25 ops/month. Upgrade for priority processing, larger files, and more volume.</p>
                                </div>
                                <div class="px-5 py-3">
                                    <a
                                        href="/pricing"
                                        class="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#FF9EBB] to-[#F06292] text-white text-sm font-bold shadow-[0_4px_14px_rgba(240,98,146,0.35)] hover:shadow-[0_6px_20px_rgba(240,98,146,0.5)] hover:-translate-y-px transition-all duration-200 no-underline"
                                    >
                                        See all plans and pricing →
                                    </a>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- C: the pitch + install. Below the tool on mobile, under the h1 on desktop. -->
                <div class="order-3 md:col-start-1 md:row-start-2 md:self-start">
                    <p class="text-base md:text-lg text-[#6C3F31] opacity-90 leading-relaxed mb-6 md:mt-6">
                        Drop a file and say what you want. Images and PDFs run anywhere the Rust binary does: a shell, a build script, or inside Claude. Video converts in your browser and never uploads. Zero retention throughout, and zero image bytes in your agent's context.
                    </p>

                    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                        <button
                            onclick={copyInstall}
                            class="group flex items-center justify-between gap-6 bg-[#2D1B1B] text-pink-100 rounded-2xl pl-6 pr-4 py-4 font-mono text-base shadow-lg hover:shadow-pink-300/20 transition-all w-full sm:w-auto cursor-pointer"
                        >
                            <span class="whitespace-nowrap"><span class="text-[#F06292] mr-2">$</span>brew install mochify</span>
                            <span class="inline-block text-center min-w-[3.5rem] text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/10 text-pink-100/80 group-hover:bg-white/20 transition-colors">
                                {copied ? 'Copied' : 'Copy'}
                            </span>
                        </button>
                        <a href="#surfaces" class="text-base font-bold text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-4 transition-colors whitespace-nowrap">
                            CLI, MCP, and API →
                        </a>
                    </div>
                    <p class="text-sm text-[#875F42] opacity-80">Linux, Cargo, Smithery, and Glama install paths on the repo.</p>

                    {#if (installPrompt && !installDismissed) || isIosInstall}
                        <button
                            onclick={installPrompt ? triggerInstall : () => (showIosTooltip = true)}
                            class="md:hidden inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full border border-[#F06292]/25 bg-gradient-to-r from-[#F06292]/8 to-[#875F42]/6 hover:from-[#F06292]/15 hover:to-[#875F42]/12 hover:border-[#F06292]/40 shadow-sm transition-all duration-200 group"
                        >
                            <svg class="w-3.5 h-3.5 text-[#F06292]/70 group-hover:text-[#F06292] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                            </svg>
                            <span class="text-xs font-semibold text-[#6C3F31]/70 group-hover:text-[#6C3F31] transition-colors">Add to Home Screen</span>
                        </button>
                    {/if}
                </div>
            </div>

            <!-- Trust strip, full width under both columns -->
            <ul class="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 border-t border-pink-100 pt-6">
                {#each heroPoints as point}
                    <li class="flex items-start gap-2.5 text-sm text-[#6C3F31]">
                        <svg class="w-4 h-4 text-[#F06292] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <span>{point}</span>
                    </li>
                {/each}
            </ul>
        </div>
    </section>

    <!-- ═══ 2. WORKS WHERE YOU WORK · blush band, constellation feeding the grid ═══ -->
    <section id="surfaces" class="reveal bg-[#FFF0F3]/55 py-14 md:py-20 border-y border-pink-100">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 class="font-heading font-black text-3xl md:text-[2.5rem] leading-[1.1] text-[#4A2C2C] mb-4">Works where you work</h2>
            <span class="block w-16 h-[5px] rounded-full bg-gradient-to-r from-[#F06292] to-[#F06292]/25 mb-6"></span>
            <p class="text-[#875F42] text-lg max-w-2xl mb-12">One engine, six surfaces. Pick the one that fits your workflow.</p>

            <!-- Surface map. Lines live in a stretched viewBox, which is fine for straight
                 strokes once they are non-scaling; the travelling pulses are HTML dots so
                 they stay round instead of squashing with the box. -->
            <div class="relative hidden md:block mx-auto max-w-3xl mb-14" style="height: 320px;">
                <div class="absolute inset-0 rounded-full bg-gradient-to-br from-white/70 via-transparent to-transparent blur-3xl pointer-events-none"></div>

                <p class="absolute left-[2%] top-0 text-[10px] font-black uppercase tracking-[0.16em] text-[#C48BA4]">Install once</p>
                <p class="absolute right-[2%] top-0 text-[10px] font-black uppercase tracking-[0.16em] text-[#C48BA4]">Nothing to install</p>

                <svg class="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    {#each surfaceNodes as n}
                        <line x1={n.x} y1={n.y} x2="50" y2="50" stroke="#F4B4CC" stroke-width="1.25" vector-effect="non-scaling-stroke" stroke-linecap="round" opacity="0.75" />
                    {/each}
                </svg>

                {#if !reduceMotion}
                    {#each surfaceNodes as n, i}
                        <span class="pulse" style={`left:${n.x}%; top:${n.y}%; animation-delay:${i * 0.45}s;`}></span>
                    {/each}
                {/if}

                {#each surfaceNodes as n}
                    <div class="absolute" style={`left:${n.x}%; top:${n.y}%; transform: translate(-50%, -50%);`}>
                        <span class="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-md border border-pink-100 text-[#A23861] text-sm font-bold whitespace-nowrap">
                            <svg class="w-4 h-4 text-[#F06292] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={n.icon}/></svg>
                            {n.label}
                        </span>
                    </div>
                {/each}

                <div class="absolute flex flex-col items-center" style="left:50%; top:50%; transform: translate(-50%, -50%);">
                    <div class="relative">
                        <div class="absolute -inset-4 rounded-[1.75rem] bg-[#F06292]/30 blur-xl animate-pulse pointer-events-none"></div>
                        <div class="relative w-20 h-20 rounded-[1.4rem] bg-[#F06292] flex items-center justify-center shadow-xl shadow-pink-300/50 ring-4 ring-white/70">
                            <span class="text-white font-heading font-black text-4xl leading-none">M</span>
                        </div>
                    </div>
                    <p class="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#875F42] opacity-70 text-center leading-tight">One engine<br>Six surfaces</p>
                </div>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {#each surfaces as s}
                    <svelte:element
                        this={s.href ? 'a' : 'div'}
                        href={s.href}
                        target={s.external ? '_blank' : undefined}
                        rel={s.external ? 'noopener noreferrer' : undefined}
                        class="group block bg-white rounded-3xl border border-pink-100 shadow-sm p-6 no-underline {s.href ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-pink-200 transition-all' : ''}"
                    >
                        <span class="inline-block text-[10px] font-black uppercase tracking-[0.14em] text-[#F06292] mb-2.5">{s.tag}</span>
                        <h3 class="font-heading font-bold text-lg text-[#4A2C2C] mb-2">{s.title}</h3>
                        <p class="text-[#875F42] text-sm leading-relaxed mb-4">{s.body}</p>
                        <span class="inline-flex items-center gap-1.5">
                            <code class="text-xs font-mono bg-[#FFF5F7] text-[#D81B60] px-2 py-1 rounded-lg border border-pink-100">{s.mono}</code>
                            {#if s.href}
                                <svg class="w-3.5 h-3.5 text-[#F06292] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                            {/if}
                        </span>
                    </svelte:element>
                {/each}
            </div>
        </div>
    </section>

    <!-- ═══ 3. THREE STEPS · white band, terminal cards ═══ -->
    <section class="reveal bg-white/60 py-14 md:py-20">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 class="font-heading font-black text-3xl md:text-[2.5rem] leading-[1.1] text-[#4A2C2C] mb-4">From install to compressing inside Claude in three steps</h2>
            <span class="block w-16 h-[5px] rounded-full bg-gradient-to-r from-[#F06292] to-[#F06292]/25 mb-6"></span>
            <p class="text-[#875F42] text-lg max-w-2xl mb-12">No OAuth, no remote connector to reconnect, no API key to manage.</p>

            <div class="grid gap-10 md:grid-cols-3 md:gap-x-6 md:gap-y-0 md:grid-rows-[auto_auto_1fr]">
                <!-- Step 1. No outer card: the window is the card. Subgrid keeps the
                     three title rows, body rows, and windows aligned across columns. -->
                <div class="md:grid md:row-span-3 md:grid-rows-subgrid">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="w-8 h-8 shrink-0 rounded-full bg-[#F06292] text-white text-sm font-black flex items-center justify-center font-heading shadow-md shadow-pink-200 ring-4 ring-pink-100">1</span>
                        <h3 class="font-heading font-bold text-xl text-[#4A2C2C]">Install</h3>
                    </div>
                    <p class="text-[#875F42] leading-relaxed mb-5">macOS via Homebrew. Linux and Cargo paths on the repo.</p>
                    <div class="md:h-full flex flex-col rounded-2xl overflow-hidden bg-[#1C1C1E] shadow-lg ring-1 ring-black/5">
                        <div class="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#2C2C2E] border-b border-white/5">
                            <div class="w-3 h-3 shrink-0 rounded-full bg-[#FF5F57]"></div>
                            <div class="w-3 h-3 shrink-0 rounded-full bg-[#FFBD2E]"></div>
                            <div class="w-3 h-3 shrink-0 rounded-full bg-[#28C941]"></div>
                            <span class="ml-2 text-xs text-white/40 font-mono truncate">terminal</span>
                        </div>
                        <div class="flex-1 p-4 font-mono text-xs leading-relaxed text-white/85 space-y-1.5">
                            <p><span class="text-[#F06292] select-none">$</span> brew install mochify</p>
                            <p><span class="text-[#F06292] select-none">$</span> mochify auth login</p>
                            <p class="text-[#28C941]">✓ signed in, CLI and MCP ready</p>
                        </div>
                    </div>
                </div>

                <!-- Step 2. No outer card: the window is the card. Subgrid keeps the
                     three title rows, body rows, and windows aligned across columns. -->
                <div class="md:grid md:row-span-3 md:grid-rows-subgrid">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="w-8 h-8 shrink-0 rounded-full bg-[#F06292] text-white text-sm font-black flex items-center justify-center font-heading shadow-md shadow-pink-200 ring-4 ring-pink-100">2</span>
                        <h3 class="font-heading font-bold text-xl text-[#4A2C2C]">Wire it into Claude</h3>
                    </div>
                    <p class="text-[#875F42] leading-relaxed mb-5">Three lines of JSON. Restart Claude Desktop.</p>
                    <div class="md:h-full flex flex-col rounded-2xl overflow-hidden bg-[#1C1C1E] shadow-lg ring-1 ring-black/5">
                        <div class="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#2C2C2E] border-b border-white/5">
                            <div class="w-3 h-3 shrink-0 rounded-full bg-[#FF5F57]"></div>
                            <div class="w-3 h-3 shrink-0 rounded-full bg-[#FFBD2E]"></div>
                            <div class="w-3 h-3 shrink-0 rounded-full bg-[#28C941]"></div>
                            <span class="ml-2 text-xs text-white/40 font-mono truncate">claude_desktop_config.json</span>
                        </div>
                        <pre class="flex-1 p-4 font-mono text-xs leading-relaxed text-white/75 overflow-x-auto">{claudeConfig}</pre>
                    </div>
                </div>

                <!-- Step 3. No outer card: the window is the card. Subgrid keeps the
                     three title rows, body rows, and windows aligned across columns. -->
                <div class="md:grid md:row-span-3 md:grid-rows-subgrid">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="w-8 h-8 shrink-0 rounded-full bg-[#F06292] text-white text-sm font-black flex items-center justify-center font-heading shadow-md shadow-pink-200 ring-4 ring-pink-100">3</span>
                        <h3 class="font-heading font-bold text-xl text-[#4A2C2C]">Compress</h3>
                    </div>
                    <p class="text-[#875F42] leading-relaxed mb-5">Ask Claude in plain English. The image stays on your laptop; only paths cross the context.</p>
                    <div class="md:h-full flex flex-col rounded-2xl overflow-hidden bg-[#1C1C1E] shadow-lg ring-1 ring-black/5">
                        <div class="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#2C2C2E] border-b border-white/5">
                            <div class="w-3 h-3 shrink-0 rounded-full bg-[#FF5F57]"></div>
                            <div class="w-3 h-3 shrink-0 rounded-full bg-[#FFBD2E]"></div>
                            <div class="w-3 h-3 shrink-0 rounded-full bg-[#28C941]"></div>
                            <span class="ml-2 text-xs text-white/40 font-mono truncate">Claude Desktop</span>
                        </div>
                        <div class="flex-1 p-4 space-y-3 font-mono text-xs leading-relaxed">
                            <div class="flex gap-2">
                                <span class="text-[#F06292] shrink-0">you</span>
                                <span class="text-white/80">Convert ~/Desktop/hero.jpg to AVIF at 1200px wide</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-[#FFBD2E] shrink-0">tool</span>
                                <span class="text-white/50">mochify · squish(path, type="avif", width=1200)</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-[#28C941] shrink-0">done</span>
                                <span class="text-white/80">hero.avif · 34 KB <span class="text-white/40">(was 2.1 MB)</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ═══ 4. SEE IT IN ACTION · mochi ground, alternating features + asset strip ═══ -->
    <section class="reveal py-14 md:py-20">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 class="font-heading font-black text-3xl md:text-[2.5rem] leading-[1.1] text-[#4A2C2C] mb-4">See it in action</h2>
            <span class="block w-16 h-[5px] rounded-full bg-gradient-to-r from-[#F06292] to-[#F06292]/25 mb-6"></span>
            <p class="text-[#875F42] text-lg max-w-2xl mb-12">The browser, the shell, and Claude Desktop, all running the same engine.</p>

            <div class="space-y-16">
                {#each features as f, i}
                    <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div class={i % 2 === 1 ? 'md:order-2' : ''}>
                            <span class="inline-block text-xs font-bold uppercase tracking-[0.14em] text-[#F06292] mb-3">{f.label}</span>
                            <h3 class="font-heading font-black text-2xl md:text-3xl text-[#4A2C2C] mb-4 leading-tight">{f.title}</h3>
                            <p class="text-[#6C3F31] text-lg leading-relaxed mb-5">{f.body}</p>
                            <div class="bg-[#2D1B1B] text-pink-100 rounded-xl px-4 py-3 font-mono text-sm overflow-x-auto">{f.quote}</div>
                        </div>

                        <!-- Demo loop: 16:10, muted. src is attached by the observer in
                             onMount once the card is near the viewport, so a visitor who
                             never scrolls this far downloads none of them. -->
                        <div class={i % 2 === 1 ? 'md:order-1' : ''}>
                            <div class="relative rounded-3xl overflow-hidden border border-pink-100 shadow-md bg-gradient-to-br from-[#FFF5F7] to-[#FDE8EF]" style="aspect-ratio: 16/10;">
                                <video
                                    class="js-demo absolute inset-0 w-full h-full object-cover"
                                    data-src={f.demo}
                                    muted
                                    loop
                                    playsinline
                                    preload="none"
                                    poster={f.poster}
                                    controls={reduceMotion}
                                    disablepictureinpicture
                                    aria-label={`${f.label} demo`}
                                ></video>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Asset types, a lighter strip rather than its own section -->
            <div class="mt-20 pt-12 border-t border-pink-100">
                <h3 class="font-heading font-black text-2xl text-[#4A2C2C] mb-2">Images, video, and PDFs, one toolkit</h3>
                <p class="text-[#875F42] mb-8 max-w-2xl">Drop any asset into the web app and say what you want. Images and PDFs run through the engine in RAM; video is converted in your browser and never uploaded at all.</p>

                <div class="grid md:grid-cols-3 gap-5">
                    {#each assets as a}
                        <div class="flex flex-col rounded-3xl border border-pink-100 bg-white shadow-sm p-6">
                            <span class="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#FFF5F7] border border-pink-100 mb-4">
                                <svg class="w-5 h-5 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d={a.icon}/></svg>
                            </span>
                            <h4 class="font-heading font-bold text-lg text-[#4A2C2C] mb-1.5">{a.kind}</h4>
                            <p class="text-[#875F42] text-sm leading-relaxed mb-4">{a.body}</p>

                            <div class="flex flex-wrap gap-1.5 mb-4">
                                {#each a.formats as fmt}
                                    <span class="text-[11px] font-mono font-medium bg-[#FFF5F7] text-[#D81B60] px-2 py-1 rounded-lg border border-pink-100">{fmt}</span>
                                {/each}
                            </div>

                            <span class="mt-auto pt-3 border-t border-pink-100/70 flex items-center gap-2 text-xs font-bold text-[#875F42]">
                                <span class="w-1.5 h-1.5 rounded-full shrink-0 {a.local ? 'bg-[#28C941]' : 'bg-[#F06292]'}"></span>
                                {a.where}
                            </span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </section>

    <!-- ═══ 5. TOKEN SAVINGS · full-bleed dark, the argument that closes developers ═══ -->
    <section class="reveal bg-[#1C1C1E] py-16 md:py-24">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 class="font-heading font-black text-3xl md:text-[2.5rem] text-white mb-4 leading-[1.1]">
                Why this doesn't waste your tokens
            </h2>
            <span class="block w-16 h-[5px] rounded-full bg-gradient-to-r from-[#F06292] to-[#F06292]/25 mb-6"></span>
            <p class="text-white/60 text-lg max-w-2xl mb-12 leading-relaxed">
                Most ways of giving an agent image-processing capability push image bytes through the context window, twice. Mochify's local MCP doesn't.
            </p>

            <div class="grid sm:grid-cols-3 gap-4 mb-12">
                <div class="rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center">
                    <p class="font-heading font-black text-5xl text-[#F06292] mb-1">0</p>
                    <p class="text-sm font-bold text-white uppercase tracking-wider">image bytes in context</p>
                    <p class="text-xs text-white/40 mt-1">local MCP or CLI</p>
                </div>
                <div class="rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center">
                    <p class="font-heading font-black text-5xl text-[#F06292] mb-1">~33%</p>
                    <p class="text-sm font-bold text-white uppercase tracking-wider">base64 inflation, avoided</p>
                    <p class="text-xs text-white/40 mt-1">bytes that never enter the payload</p>
                </div>
                <div class="rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center">
                    <p class="font-heading font-black text-5xl text-[#F06292] mb-1">5 min</p>
                    <p class="text-sm font-bold text-white uppercase tracking-wider">max pickup window</p>
                    <p class="text-xs text-white/40 mt-1">hosted MCP only, local has zero</p>
                </div>
            </div>

            <div class="bg-[#111113] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-8">
                <div class="flex items-center gap-2 px-5 py-3 bg-[#2C2C2E] border-b border-white/5">
                    <div class="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                    <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                    <div class="w-3 h-3 rounded-full bg-[#28C841]"></div>
                    <span class="ml-3 text-xs text-white/40 font-mono">context window, bytes travelling through your agent</span>
                </div>
                <div class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div class="p-6 md:p-8">
                        <div class="flex items-center gap-2 mb-5">
                            <span class="w-4 h-4 rounded-full bg-[#FF5F57] flex items-center justify-center shrink-0">
                                <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                            </span>
                            <span class="text-white/60 text-xs font-mono uppercase tracking-widest">Naive MCP setup</span>
                        </div>
                        <div class="space-y-2 font-mono text-sm">
                            {#each [
                                { label: 'agent', payload: '→ image bytes', bad: true },
                                { label: 'tool call', payload: '→ bytes again', bad: true },
                                { label: 'response', payload: '→ bytes again', bad: true },
                                { label: 'agent', payload: '', bad: false }
                            ] as row}
                                <div class="flex items-center gap-3">
                                    <span class="text-white/40 w-20 shrink-0">{row.label}</span>
                                    <span class="{row.bad ? 'text-[#FF5F57] font-bold' : 'text-white/25'}">{row.payload}</span>
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div class="p-6 md:p-8">
                        <div class="flex items-center gap-2 mb-5">
                            <span class="w-4 h-4 rounded-full bg-[#28C841] flex items-center justify-center shrink-0">
                                <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                            </span>
                            <span class="text-white/60 text-xs font-mono uppercase tracking-widest">Local Mochify MCP</span>
                        </div>
                        <div class="space-y-2 font-mono text-sm">
                            {#each [
                                { label: 'agent', payload: '→ file path' },
                                { label: 'tool call', payload: '→ path only' },
                                { label: 'response', payload: '→ path + meta' },
                                { label: 'agent', payload: '' }
                            ] as row}
                                <div class="flex items-center gap-3">
                                    <span class="text-white/40 w-20 shrink-0">{row.label}</span>
                                    <span class="text-[#28C841] font-bold">{row.payload}</span>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-white/10 bg-white/[0.04] p-6 flex items-start gap-4">
                <svg class="w-5 h-5 text-[#F06292] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                <p class="text-sm text-white/60 leading-relaxed">
                    <strong class="text-white">Zero retention, by design.</strong> Originals are streamed into the encoder in RAM and discarded immediately: no disk writes of the source, no logs containing image data. The local binary writes compressed results straight to your disk; nothing is held server-side. For a fully on-machine engine, self-host via the <a href="/guides/self-hosting-image-optimization-docker" class="text-[#F06292] hover:text-[#F8A5C2] underline underline-offset-2">Docker guide</a>.
                </p>
            </div>
        </div>
    </section>

    <!-- ═══ 6. CORE WEB VITALS · ported from the old homepage, commercial intent ═══ -->
    <section class="reveal bg-white/60 py-14 md:py-20">
        <div class="mx-auto max-w-4xl px-4 sm:px-6">
            <p class="text-xs font-bold tracking-widest uppercase text-[#F06292] mb-2">Shopify and ecommerce</p>
            <h2 class="font-heading font-black text-3xl md:text-[2.5rem] text-[#4A2C2C] mb-4 leading-[1.1]">Better Core Web Vitals start with smaller product images</h2>
            <span class="block w-16 h-[5px] rounded-full bg-gradient-to-r from-[#F06292] to-[#F06292]/25 mb-6"></span>
            <p class="text-[#6C3F31] leading-relaxed max-w-2xl mb-8">
                Largest Contentful Paint (LCP) is Google's primary page speed signal, and product images are almost always the bottleneck. Converting your catalog to AVIF or WebP can cut file sizes by up to 50% with no visible quality loss, directly improving your store's search ranking and conversion rate.
            </p>
            <!-- Stat cards. Same card language as the rest of the page, and the same
                 number-first shape as the token-savings stats, so the two rhyme. -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div class="rounded-3xl border border-pink-100 bg-white shadow-sm p-6">
                    <p class="font-heading font-black text-4xl text-[#F06292] leading-none mb-3">~50%</p>
                    <p class="font-heading font-bold text-lg text-[#4A2C2C] mb-1.5">Smaller with AVIF</p>
                    <p class="text-sm text-[#875F42] leading-relaxed">AVIF cuts file size roughly in half versus JPEG at equivalent quality, the fastest format Shopify supports.</p>
                </div>
                <div class="rounded-3xl border border-pink-100 bg-white shadow-sm p-6">
                    <p class="font-heading font-black text-4xl text-[#F06292] leading-none mb-3">25</p>
                    <p class="font-heading font-bold text-lg text-[#4A2C2C] mb-1.5">Images per batch</p>
                    <p class="text-sm text-[#875F42] leading-relaxed">Drop a whole set of product shots at once on Seller, Pro or a Day Pass. Describe what you need, like "convert to WebP, max 1600px wide", and Mochify handles the rest.</p>
                </div>
                <div class="rounded-3xl border border-pink-100 bg-white shadow-sm p-6">
                    <p class="font-heading font-black text-4xl text-[#F06292] leading-none mb-3">0</p>
                    <p class="font-heading font-bold text-lg text-[#4A2C2C] mb-1.5">Copies kept, ever</p>
                    <p class="text-sm text-[#875F42] leading-relaxed">Images are never stored or logged. Safe for unreleased products, private SKUs, and anything not yet live on your store.</p>
                </div>
            </div>
            <!-- Day Pass sits here, on the batch-size objection, rather than in the
                 hero or a CTA: it converts the one-batch-today seller who would
                 otherwise bounce at "sign up for a subscription", without competing
                 with Seller for the visitor who would take a plan. Text link only,
                 no button, so the hierarchy stays free trial -> plans. -->
            <p class="mt-6 text-sm text-[#875F42]/80 leading-relaxed">
                Need a bigger batch just for today? A <strong class="font-bold text-[#6C3F31]">Day Pass</strong> unlocks 100 uploads and 25-file batches for 24 hours, no account or subscription, or see how Seller compares on the <a href="/pricing#day-pass" class="text-[#F06292] font-semibold hover:underline">pricing page</a>.
            </p>
        </div>
    </section>

    <!-- ═══ 7. FAQ · ported, matches the FAQPage schema above ═══ -->
    <section class="reveal py-14 md:py-20 border-t border-pink-100">
        <div class="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 class="text-center font-heading font-black text-3xl md:text-[2.5rem] leading-[1.1] text-[#4A2C2C] mb-3">Frequently asked questions</h2>
            <p class="text-center text-[#875F42] mb-8">Everything you need to know before compressing your first batch.</p>
            <!-- One card, hairline-divided. Seven separate shadowed pills read as a
                 stack of buttons rather than a reference list. -->
            <div class="rounded-3xl border border-pink-100 bg-white shadow-sm overflow-hidden divide-y divide-pink-100">

                <details class="group open:bg-[#FFFAFB] transition-colors">
                    <summary class="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] hover:text-[#D81B60] transition-colors select-none">
                        Is Mochify free to use?
                        <svg class="w-5 h-5 shrink-0 text-[#F06292] group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                    </summary>
                    <p class="px-6 pb-5 -mt-1 text-sm text-[#6C3F31] leading-relaxed">
                        Yes. Try 3 files free without an account. A free account (no card needed) gives you 25 images a month at up to 20 MB each, with every output format, Magic Flow, background removal, and full CLI, MCP and API access. Seller and Pro plans raise the monthly allowance to 300 and 1,200 images, lift the file limit to 75 MB, allow batches of 25 files, and add priority processing. If you just need a bigger batch for one afternoon, a Day Pass unlocks 100 uploads for 24 hours with no subscription. Current prices for your region are on the <a href="/pricing" class="text-[#F06292] font-semibold hover:underline">pricing page</a>.
                    </p>
                </details>

                <details class="group open:bg-[#FFFAFB] transition-colors">
                    <summary class="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] hover:text-[#D81B60] transition-colors select-none">
                        Are my images stored or shared?
                        <svg class="w-5 h-5 shrink-0 text-[#F06292] group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                    </summary>
                    <p class="px-6 pb-5 -mt-1 text-sm text-[#6C3F31] leading-relaxed">
                        No. Mochify streams each image or PDF straight into the encoder in server RAM, compresses it, returns the result and discards it. Originals are never written to disk and no logs contain image data. The one exception is the hosted MCP connector, which keeps the compressed output on an unguessable URL for up to five minutes so your chat client can fetch it; the original is still discarded immediately, and the local CLI and MCP server hold nothing server-side at all. Video is converted entirely in your browser and never uploaded.
                    </p>
                </details>

                <details class="group open:bg-[#FFFAFB] transition-colors">
                    <summary class="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] hover:text-[#D81B60] transition-colors select-none">
                        How much smaller will my images be?
                        <svg class="w-5 h-5 shrink-0 text-[#F06292] group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                    </summary>
                    <p class="px-6 pb-5 -mt-1 text-sm text-[#6C3F31] leading-relaxed">
                        It depends on the format and the source. As a guide, Jpegli typically produces JPEGs around 35% smaller than a standard encoder at the same visual quality, WebP is around 26% smaller than JPEG, and AVIF is roughly 50% smaller than JPEG and 20% smaller than WebP. Smart Compress picks the best quality-to-size balance for each image automatically, so you never have to guess a quality setting.
                    </p>
                </details>

                <details class="group open:bg-[#FFFAFB] transition-colors">
                    <summary class="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] hover:text-[#D81B60] transition-colors select-none">
                        What image formats does Mochify support?
                        <svg class="w-5 h-5 shrink-0 text-[#F06292] group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                    </summary>
                    <p class="px-6 pb-5 -mt-1 text-sm text-[#6C3F31] leading-relaxed">
                        Input: JPEG, PNG, WebP, AVIF, HEIC/HEIF and JPEG XL. Output: JPEG (via Jpegli), PNG, WebP, AVIF and JPEG XL. Without an account you can process 3 files per batch; paid plans allow batches of up to 25. For larger volumes, the CLI and REST API handle scripted bulk processing with no per-file overhead.
                    </p>
                </details>

                <details class="group open:bg-[#FFFAFB] transition-colors">
                    <summary class="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] hover:text-[#D81B60] transition-colors select-none">
                        Does Mochify have an API?
                        <svg class="w-5 h-5 shrink-0 text-[#F06292] group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                    </summary>
                    <p class="px-6 pb-5 -mt-1 text-sm text-[#6C3F31] leading-relaxed">
                        Yes. The REST API lives at <code class="font-mono text-xs text-[#F06292]">api.mochify.app</code> and is available on every plan, including Free. Send a raw image body to <code class="font-mono text-xs text-[#F06292]">POST /v1/squish</code> with a <code class="font-mono text-xs">type</code> parameter, or use <code class="font-mono text-xs text-[#F06292]">POST /v1/pdf</code> for PDF tools. A free account gives you a bearer token and 25 images a month; Seller and Pro raise that to 300 and 1,200. The <a href="/docs" class="text-[#F06292] font-semibold hover:underline">API documentation</a> has examples in cURL, JavaScript and Python.
                    </p>
                </details>

                <details class="group open:bg-[#FFFAFB] transition-colors">
                    <summary class="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] hover:text-[#D81B60] transition-colors select-none">
                        Can I use Mochify from the command line or inside Claude?
                        <svg class="w-5 h-5 shrink-0 text-[#F06292] group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                    </summary>
                    <p class="px-6 pb-5 -mt-1 text-sm text-[#6C3F31] leading-relaxed">
                        Yes, on every plan. Install the Rust binary with <code class="font-mono text-xs text-[#F06292]">brew install mochify</code> (Linux and Cargo paths are on the repo). The same binary runs as a direct CLI and, with <code class="font-mono text-xs text-[#F06292]">mochify serve</code>, as a local MCP server for Claude Desktop, Claude Code, Cursor and any stdio MCP client. Because the binary opens files on your own disk, only file paths and result metadata cross the agent context, never image bytes. If you would rather not install anything, the hosted MCP at <code class="font-mono text-xs text-[#F06292]">mcp.mochify.app</code> connects with OAuth.
                    </p>
                </details>

                <details class="group open:bg-[#FFFAFB] transition-colors">
                    <summary class="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-bold text-[#4A2C2C] hover:text-[#D81B60] transition-colors select-none">
                        What is Magic Flow?
                        <svg class="w-5 h-5 shrink-0 text-[#F06292] group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                    </summary>
                    <p class="px-6 pb-5 -mt-1 text-sm text-[#6C3F31] leading-relaxed">
                        Magic Flow is Mochify's natural-language interface. Instead of choosing a format and quality setting, you describe what you want, for example <em>"convert to AVIF and strip location data"</em> or <em>"make these web-ready, max 1600px wide"</em>, and Mochify works out the right parameters for each file. It uses a two-step pipeline: a language model parses the prompt, then the native engine executes it. Magic Flow is available in the web app, the CLI (<code class="font-mono text-xs text-[#F06292]">-p</code>) and both MCP servers.
                    </p>
                </details>

            </div>
        </div>
    </section>

    <!-- ═══ 8. AUDIENCE + FINAL CTA · blush close ═══ -->
    <section class="reveal bg-gradient-to-b from-[#FFF0F3]/60 via-[#FFF0F3]/30 to-transparent pt-16 md:pt-24 pb-8 md:pb-12 border-t border-pink-100">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
            <div class="grid sm:grid-cols-3 gap-5 mb-16">
                <a href="/solutions" class="block bg-white rounded-3xl border border-pink-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all no-underline">
                    <h3 class="font-heading font-bold text-lg text-[#4A2C2C] mb-2">Shopify and ecommerce</h3>
                    <p class="text-[#875F42] text-sm leading-relaxed">Cut LCP with AVIF on product photos and batch-resize a whole catalog in one prompt.</p>
                </a>
                <div class="block bg-white rounded-3xl border border-pink-100 shadow-sm p-6">
                    <h3 class="font-heading font-bold text-lg text-[#4A2C2C] mb-2">Agencies</h3>
                    <p class="text-[#875F42] text-sm leading-relaxed">Batch client deliverables through a single CLI command or an agentic pipeline.</p>
                </div>
                <div class="block bg-white rounded-3xl border border-pink-100 shadow-sm p-6">
                    <h3 class="font-heading font-bold text-lg text-[#4A2C2C] mb-2">Creators</h3>
                    <p class="text-[#875F42] text-sm leading-relaxed">Strip EXIF, resize for the web, and keep originals private with zero-retention processing.</p>
                </div>
            </div>

            <div class="text-center max-w-2xl mx-auto">
                <h2 class="font-heading font-black text-3xl md:text-[2.5rem] leading-[1.1] text-[#4A2C2C] mb-4">Wire Mochify into your workflow today</h2>
                <p class="text-[#6C3F31] text-lg mb-9 leading-relaxed">
                    MCP and API access on every plan, starting at Free. No paywall on developer or agent features.
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onclick={copyInstall}
                        class="group flex items-center gap-4 bg-[#2D1B1B] text-pink-100 rounded-2xl px-6 py-4 font-mono text-base shadow-lg transition-all cursor-pointer"
                    >
                        <span class="whitespace-nowrap"><span class="text-[#F06292] mr-2">$</span>brew install mochify</span>
                        <span class="inline-block text-center min-w-[3.5rem] text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a href="/pricing" class="inline-flex items-center gap-2 px-7 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                        View plans →
                    </a>
                </div>
            </div>
        </div>
    </section>

</main>

<div class="relative z-10 mt-8 md:mt-12">
    <Footer />
</div>

{#if showIosTooltip}
    <div role="presentation" class="fixed inset-0 z-50 flex items-end justify-center pb-6 px-4" onclick={(e) => { if (e.target === e.currentTarget) showIosTooltip = false; }}>
        <div role="dialog" aria-modal="true" aria-labelledby="ios-tooltip-title" tabindex="-1" class="w-full max-w-sm bg-[#FDFBF7] border border-[#F06292]/20 rounded-2xl shadow-xl p-5">
            <div class="flex items-start justify-between mb-3">
                <p id="ios-tooltip-title" class="text-sm font-semibold text-[#4A2C2C]">Add Mochify to your Home Screen</p>
                <button onclick={() => (showIosTooltip = false)} aria-label="Close" class="text-[#875F42]/50 hover:text-[#875F42] transition-colors ml-3 shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <ol class="space-y-2.5">
                <li class="flex items-center gap-3 text-xs text-[#6C3F31]">
                    <span class="flex items-center justify-center w-5 h-5 rounded-full bg-[#F06292]/15 text-[#F06292] font-bold shrink-0">1</span>
                    <span>Tap the <strong>Share</strong> button in Safari</span>
                </li>
                <li class="flex items-center gap-3 text-xs text-[#6C3F31]">
                    <span class="flex items-center justify-center w-5 h-5 rounded-full bg-[#F06292]/15 text-[#F06292] font-bold shrink-0">2</span>
                    <span>Scroll down and tap <strong>Add to Home Screen</strong></span>
                </li>
                <li class="flex items-center gap-3 text-xs text-[#6C3F31]">
                    <span class="flex items-center justify-center w-5 h-5 rounded-full bg-[#F06292]/15 text-[#F06292] font-bold shrink-0">3</span>
                    <span>Tap <strong>Add</strong> to confirm</span>
                </li>
            </ol>
        </div>
    </div>
{/if}

<style>
    .glass-card-pink {
        background: linear-gradient(135deg, rgba(255, 240, 243, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(240, 98, 146, 0.18);
        box-shadow: 0 4px 24px rgba(240, 98, 146, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    /* Travelling pulses along each spoke. HTML rather than SVG so the dots stay
       circular inside the non-uniformly scaled diagram box. Animating left/top
       lets one keyframe serve every node: the start value comes from the
       element's own inline position. */
    .pulse {
        position: absolute;
        width: 7px;
        height: 7px;
        margin: -3.5px 0 0 -3.5px;
        border-radius: 9999px;
        background: #F06292;
        opacity: 0;
        pointer-events: none;
        animation: travel 2.8s linear infinite;
    }
    @keyframes travel {
        0%   { opacity: 0; }
        15%  { opacity: 1; }
        85%  { opacity: 1; }
        100% { left: 50%; top: 50%; opacity: 0; }
    }

    @keyframes slide-up {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up {
        animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* SMIL pulses are removed in markup; this covers the CSS-driven core glow
       and the reveal transitions. */
    @media (prefers-reduced-motion: reduce) {
        :global(.animate-pulse) { animation: none !important; }
        .pulse { animation: none; }
        .animate-slide-up { animation: none; opacity: 1; transform: none; }
    }
</style>
