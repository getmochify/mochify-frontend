<script lang="ts">
    import { onMount } from 'svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import MagicFlowPreview from '$lib/components/MagicFlowPreview.svelte';

    let copied = $state(false);
    async function copyInstall() {
        try {
            await navigator.clipboard.writeText('brew install mochify');
            copied = true;
            setTimeout(() => (copied = false), 2000);
        } catch {
            // clipboard unavailable — no-op
        }
    }

    // Hero constellation — coords are % of the diagram box; the core sits at 50/50.
    const heroNodes = [
        { label: 'CLI',         x: 18, y: 20, icon: 'M8 9l3 3-3 3m5 0h3' },
        { label: 'Local MCP',   x: 80, y: 15, icon: 'M5 12h14M12 5l7 7-7 7' },
        { label: 'REST API',    x: 12, y: 52, icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' },
        { label: 'Hosted MCP',  x: 88, y: 48, icon: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z' },
        { label: 'Web app',     x: 28, y: 85, icon: 'M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6z' },
        { label: 'Extension',   x: 78, y: 84, icon: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0a.64.64 0 00.657.643 48.025 48.025 0 005.395-.435 48.879 48.879 0 00-.436-5.395.64.64 0 01.643-.657v0c.355 0 .676.186.959.401.29.221.634.349 1.003.349 1.036 0 1.875-1.007 1.875-2.25s-.84-2.25-1.875-2.25c-.369 0-.713.128-1.003.349-.283.215-.604.401-.959.401v0a.64.64 0 01-.643-.657 48.387 48.387 0 00-.301-4.163c-1.613.186-3.25.293-4.908.315a.656.656 0 01-.663-.658v0z' },
    ];

    const claudeConfig = `{
  "mcpServers": {
    "mochify": {
      "command": "mochify",
      "args": ["serve"]
    }
  }
}`;

    const surfaces = [
        { tag: 'Recommended', title: 'Local MCP server', body: 'Claude Desktop, Cursor, any stdio MCP client. Folder-on-disk friendly — bytes never enter the agent context.', mono: 'mochify serve' },
        { tag: 'Shell', title: 'Direct CLI', body: 'Build scripts, CI, agentic pipelines. A single pipe-friendly Rust binary.', mono: 'mochify *.jpg -p "…"' },
        { tag: 'No install', title: 'Hosted MCP', body: 'OAuth connector that lives inside chat. Nothing to install.', mono: 'mcp.mochify.app' },
        { tag: 'Server-side', title: 'REST API', body: 'Bearer-token auth. cURL, JS, Python — anywhere you can make an HTTPS request.', mono: 'api.mochify.app' },
        { tag: 'Browser', title: 'Web app', body: 'Drop, type, done. No install, 3 files free without an account.', mono: 'mochify.app/app' },
        { tag: 'Extension', title: 'Chrome extension', body: 'One-click compression from any page you are browsing.', mono: 'chrome web store' },
    ];

    const assets = [
        { kind: 'Images', body: 'AVIF, JPEG XL, WebP, and Jpegli-encoded JPEG. Smart-crop, EXIF strip, HDR gain-map, background removal.', demo: '/demos/asset-images.mp4', poster: '/demos/asset-images.jpg' },
        { kind: 'Video', body: 'Transcode and compress clips through the local binary — handled on your machine, streamed to the engine in RAM.', demo: '/demos/asset-video.mp4', poster: '/demos/asset-video.jpg' },
        { kind: 'PDFs', body: 'Recompress embedded images and flatten oversized documents without a round-trip through a browser tab.', demo: '/demos/asset-pdf.mp4', poster: '/demos/asset-pdf.jpg' },
    ];

    const features = [
        {
            label: 'Magic Flow',
            title: 'Describe the goal in plain English.',
            body: 'No format pickers, no quality sliders. Type what you want and Magic Flow resolves the format, dimensions, crop, and options for you — across one file or a hundred.',
            demo: '/videos/magic.mp4',
            poster: '/demos/prompt-form.jpg',
            quote: '"convert to webp, 1200px and 800px, strip exif"',
            ready: true,
        },
        {
            label: 'Direct CLI',
            title: 'Pipe it into any workflow.',
            body: 'A single Rust binary that reads paths on stdin and slots cleanly into build steps, CI, and agentic content pipelines. Zero image bytes in any agent context.',
            demo: '/demos/cli-run.mp4',
            poster: '/demos/cli-run.jpg',
            quote: 'find . -name "*.heic" | mochify -t avif -o ./out',
        },
        {
            label: 'Local MCP',
            title: 'Compress from inside Claude.',
            body: 'Ask Claude in plain language. The local binary opens the file, sends bytes to the engine, writes the result to disk, and hands back only a path and a size.',
            demo: '/demos/mcp-claude.mp4',
            poster: '/demos/mcp-claude.jpg',
            quote: '"Convert ~/Desktop/hero.jpg to AVIF at 1200px wide."',
        },
    ];

    onMount(() => {
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
        return () => observer.disconnect();
    });
</script>

<svelte:head>
    <title>Mochify | Image, video & PDF compression for AI-native workflows</title>
    <meta name="description" content="One Rust binary. Runs as a CLI, a local MCP server for Claude Desktop and Cursor, and inside Claude Code. Compress images, video, and PDFs with plain language — zero image bytes in your agent's context.">
    <meta name="robots" content="noindex">
</svelte:head>

<Navigation />

<main class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

    <!-- HERO -->
    <section class="pt-12 md:pt-20 pb-16 md:pb-24 grid md:grid-cols-2 gap-12 md:gap-8 items-center">
        <!-- Left: copy + install -->
        <div>
            <p class="text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-[#F06292] mb-5">
                Image compression, built for AI-native workflows
            </p>
            <h1 class="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-[#4A2C2C] mb-6">
                Compress images, video, and PDFs inside your terminal, your editor, or your AI agent.
            </h1>
            <p class="text-lg text-[#6C3F31] opacity-90 leading-relaxed mb-9">
                One Rust binary. Runs as a CLI, as a local MCP server for Claude Desktop and Cursor, and inside Claude Code's shell. Same engine as the web app — in RAM, zero retention, and zero image bytes in your agent's context.
            </p>

            <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
                <button
                    onclick={copyInstall}
                    class="group flex items-center justify-between gap-6 bg-[#2D1B1B] text-pink-100 rounded-2xl pl-6 pr-4 py-4 font-mono text-base shadow-lg hover:shadow-pink-300/20 transition-all w-full sm:w-auto"
                >
                    <span class="whitespace-nowrap"><span class="text-[#F06292] mr-2">$</span>brew install mochify</span>
                    <span class="inline-block text-center min-w-[3.5rem] text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/10 text-pink-100/80 group-hover:bg-white/20 transition-colors">
                        {copied ? 'Copied' : 'Copy'}
                    </span>
                </button>
                <a href="/app" class="text-base font-bold text-[#F06292] hover:text-[#D81B60] underline decoration-2 underline-offset-4 transition-colors whitespace-nowrap">
                    Just want a browser? →
                </a>
            </div>
            <p class="text-sm text-[#875F42] opacity-80">Linux · Cargo · Smithery · Glama install paths on the repo.</p>
        </div>

        <!-- Right: hub-and-spoke constellation -->
        <div class="relative hidden md:block" style="height: 420px;">
            <!-- Soft radial glow behind the constellation -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-br from-pink-100/50 via-transparent to-transparent blur-3xl pointer-events-none"></div>

            <!-- Spokes + travelling pulses (stretched to fill the box) -->
            <svg class="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {#each heroNodes as n, i}
                    <line x1={n.x} y1={n.y} x2="50" y2="50" stroke="#F4B4CC" stroke-width="0.35" stroke-linecap="round" opacity="0.6" />
                    <circle r="0.9" fill="#F06292" opacity="0">
                        <animateMotion dur="2.8s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={`M${n.x} ${n.y} L 50 50`} />
                        <animate attributeName="opacity" dur="2.8s" begin={`${i * 0.45}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.2;0.8;1" />
                    </circle>
                {/each}
            </svg>

            <!-- Surface chips, pinned to each node -->
            {#each heroNodes as n}
                <div class="absolute" style={`left:${n.x}%; top:${n.y}%; transform: translate(-50%, -50%);`}>
                    <span class="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-md border border-pink-100 text-[#A23861] text-sm font-bold whitespace-nowrap">
                        <svg class="w-4 h-4 text-[#F06292] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={n.icon}/></svg>
                        {n.label}
                    </span>
                </div>
            {/each}

            <!-- Glowing engine core -->
            <div class="absolute flex flex-col items-center" style="left:50%; top:50%; transform: translate(-50%, -50%);">
                <div class="relative">
                    <div class="absolute -inset-3 rounded-3xl bg-[#F06292]/30 blur-xl animate-pulse pointer-events-none"></div>
                    <div class="relative w-16 h-16 rounded-2xl bg-[#F06292] flex items-center justify-center shadow-lg shadow-pink-300/50 ring-4 ring-white/70">
                        <span class="text-white font-heading font-black text-3xl leading-none">M</span>
                    </div>
                </div>
                <p class="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#875F42] opacity-70 text-center leading-tight">One engine<br>Six surfaces</p>
            </div>
        </div>
    </section>

    <!-- WEB APP — equal billing with a live demo -->
    <section class="reveal py-14 md:py-20 border-t border-pink-100">
        <div class="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div>
                <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#F06292] mb-4">No install · in your browser</p>
                <h2 class="font-heading font-black text-3xl md:text-4xl text-[#4A2C2C] leading-tight mb-5">Prefer the browser? The full Magic Flow, one tab.</h2>
                <p class="text-lg text-[#6C3F31] leading-relaxed mb-6">
                    Drop an image, video, or PDF, describe what you want in plain English, and Mochify resolves the format, size, and crop for you. No formats to pick, no sliders, no account — 3 files free.
                </p>
                <ul class="space-y-2.5">
                    {#each ['Plain-English prompts — no settings to learn', 'Drag-and-drop images, video, and PDFs', 'Batch up to 25 files, zipped on the way out', 'Same zero-retention engine as the CLI'] as point}
                        <li class="flex items-start gap-3 text-[#6C3F31]">
                            <svg class="w-5 h-5 text-[#F06292] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                            <span>{point}</span>
                        </li>
                    {/each}
                </ul>
            </div>
            <div>
                <MagicFlowPreview />
            </div>
        </div>
    </section>

    <!-- 3-STEP INSTALL → COMPRESS -->
    <section class="reveal py-14 md:py-20 border-t border-pink-100">
        <SectionHeading>From install to compressing inside Claude in three steps</SectionHeading>
        <p class="text-[#875F42] text-lg max-w-2xl mb-10">No OAuth, no remote connector to reconnect, no API key to manage.</p>

        <div class="grid md:grid-cols-3 gap-6 items-stretch">
            <!-- Step 1 -->
            <div class="bg-white rounded-3xl border border-pink-50 shadow-sm p-7 flex flex-col h-full">
                <span class="w-10 h-10 rounded-full bg-[#F06292] text-white font-black flex items-center justify-center mb-5 font-heading shadow-md shadow-pink-200 ring-4 ring-pink-100">1</span>
                <h3 class="font-heading font-bold text-xl text-[#4A2C2C] mb-2">Install</h3>
                <p class="text-[#875F42] mb-5 leading-relaxed">macOS via Homebrew. Linux and Cargo paths on the repo.</p>
                <div class="mt-auto bg-[#1C1C1E] rounded-2xl overflow-hidden">
                    <div class="flex items-center gap-2 px-4 py-2.5 bg-[#2C2C2E] border-b border-white/5">
                        <div class="w-3 h-3 shrink-0 rounded-full bg-[#FF5F57]"></div>
                        <div class="w-3 h-3 shrink-0 rounded-full bg-[#FFBD2E]"></div>
                        <div class="w-3 h-3 shrink-0 rounded-full bg-[#28C941]"></div>
                        <span class="ml-2 text-xs text-white/40 font-mono truncate">terminal</span>
                    </div>
                    <div class="p-4 font-mono text-xs leading-relaxed text-white/85 min-h-[168px] space-y-1.5">
                        <p><span class="text-[#F06292] select-none">$</span> brew install mochify</p>
                        <p><span class="text-[#F06292] select-none">$</span> mochify auth login</p>
                        <p class="text-[#28C941]">✓ signed in — CLI + MCP ready</p>
                    </div>
                </div>
            </div>

            <!-- Step 2 -->
            <div class="bg-white rounded-3xl border border-pink-50 shadow-sm p-7 flex flex-col h-full">
                <span class="w-10 h-10 rounded-full bg-[#F06292] text-white font-black flex items-center justify-center mb-5 font-heading shadow-md shadow-pink-200 ring-4 ring-pink-100">2</span>
                <h3 class="font-heading font-bold text-xl text-[#4A2C2C] mb-2">Wire it into Claude</h3>
                <p class="text-[#875F42] mb-5 leading-relaxed">Three lines of JSON. Restart Claude Desktop.</p>
                <div class="mt-auto bg-[#1C1C1E] rounded-2xl overflow-hidden">
                    <div class="flex items-center gap-2 px-4 py-2.5 bg-[#2C2C2E] border-b border-white/5">
                        <div class="w-3 h-3 shrink-0 rounded-full bg-[#FF5F57]"></div>
                        <div class="w-3 h-3 shrink-0 rounded-full bg-[#FFBD2E]"></div>
                        <div class="w-3 h-3 shrink-0 rounded-full bg-[#28C941]"></div>
                        <span class="ml-2 text-xs text-white/40 font-mono truncate">claude_desktop_config.json</span>
                    </div>
                    <pre class="p-4 font-mono text-xs leading-relaxed text-white/75 min-h-[168px] overflow-x-auto">{claudeConfig}</pre>
                </div>
            </div>

            <!-- Step 3 -->
            <div class="bg-white rounded-3xl border border-pink-50 shadow-sm p-7 flex flex-col h-full">
                <span class="w-10 h-10 rounded-full bg-[#F06292] text-white font-black flex items-center justify-center mb-5 font-heading shadow-md shadow-pink-200 ring-4 ring-pink-100">3</span>
                <h3 class="font-heading font-bold text-xl text-[#4A2C2C] mb-2">Compress</h3>
                <p class="text-[#875F42] mb-5 leading-relaxed">Ask Claude in plain English. The image stays on your laptop; only paths cross the context.</p>
                <div class="mt-auto bg-[#1C1C1E] rounded-2xl overflow-hidden">
                    <div class="flex items-center gap-2 px-4 py-2.5 bg-[#2C2C2E] border-b border-white/5">
                        <div class="w-3 h-3 shrink-0 rounded-full bg-[#FF5F57]"></div>
                        <div class="w-3 h-3 shrink-0 rounded-full bg-[#FFBD2E]"></div>
                        <div class="w-3 h-3 shrink-0 rounded-full bg-[#28C941]"></div>
                        <span class="ml-2 text-xs text-white/40 font-mono truncate">Claude Desktop</span>
                    </div>
                    <div class="p-4 space-y-3 font-mono text-xs leading-relaxed min-h-[168px]">
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
    </section>

    <!-- FEATURE SHOWCASE WITH VIDEO SLOTS -->
    <section class="reveal py-14 md:py-20 border-t border-pink-100">
        <SectionHeading>See it in action</SectionHeading>
        <p class="text-[#875F42] text-lg max-w-2xl mb-12">Three surfaces, one engine. Drop a clip into each slot to bring it to life.</p>

        <div class="space-y-16">
            {#each features as f, i}
                <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div class={i % 2 === 1 ? 'md:order-2' : ''}>
                        <span class="inline-block text-xs font-bold uppercase tracking-[0.14em] text-[#F06292] mb-3">{f.label}</span>
                        <h3 class="font-heading font-black text-2xl md:text-3xl text-[#4A2C2C] mb-4 leading-tight">{f.title}</h3>
                        <p class="text-[#6C3F31] text-lg leading-relaxed mb-5">{f.body}</p>
                        <div class="bg-[#2D1B1B] text-pink-100 rounded-xl px-4 py-3 font-mono text-sm overflow-x-auto">{f.quote}</div>
                    </div>

                    <!-- Video slot: drop a 5–10s muted loop at the path below -->
                    <div class={i % 2 === 1 ? 'md:order-1' : ''}>
                        <div class="relative rounded-3xl overflow-hidden border border-pink-100 shadow-md bg-gradient-to-br from-[#FFF5F7] to-[#FDE8EF]" style="aspect-ratio: 16/10;">
                            <video
                                class="absolute inset-0 w-full h-full object-cover"
                                autoplay
                                muted
                                loop
                                playsinline
                                preload="none"
                                poster={f.poster}
                            >
                                <source src={f.demo} type="video/mp4" />
                            </video>
                            {#if !f.ready}
                                <div class="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur text-[#A23861] text-xs font-bold shadow-sm">
                                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    demo slot · {f.demo}
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- WORKS WHERE YOU WORK -->
    <section class="reveal py-14 md:py-20 border-t border-pink-100">
        <SectionHeading>Works where you work</SectionHeading>
        <p class="text-[#875F42] text-lg max-w-2xl mb-10">One engine, six surfaces. Pick the one that fits your workflow.</p>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {#each surfaces as s}
                <div class="bg-white rounded-3xl border border-pink-50 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <span class="inline-block text-[10px] font-black uppercase tracking-[0.14em] text-[#F06292] mb-2.5">{s.tag}</span>
                    <h3 class="font-heading font-bold text-lg text-[#4A2C2C] mb-2">{s.title}</h3>
                    <p class="text-[#875F42] text-sm leading-relaxed mb-4">{s.body}</p>
                    <code class="text-xs font-mono bg-[#FFF5F7] text-[#D81B60] px-2 py-1 rounded-lg border border-pink-100">{s.mono}</code>
                </div>
            {/each}
        </div>
    </section>

    <!-- LOCAL MEDIA: IMAGES, VIDEO, PDFs -->
    <section class="reveal py-14 md:py-20 border-t border-pink-100">
        <SectionHeading>Images, video, and PDFs — one toolkit</SectionHeading>
        <p class="text-[#875F42] text-lg max-w-2xl mb-10">Drop any asset into the web app, or point the binary at a folder. Same prompt-driven engine for every type.</p>

        <div class="grid md:grid-cols-3 gap-6">
            {#each assets as a}
                <div class="bg-white rounded-3xl border border-pink-50 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <!-- Video slot -->
                    <div class="relative bg-gradient-to-br from-[#FFF5F7] to-[#FDE8EF]" style="aspect-ratio: 16/10;">
                        <video class="absolute inset-0 w-full h-full object-cover" autoplay muted loop playsinline preload="none" poster={a.poster}>
                            <source src={a.demo} type="video/mp4" />
                        </video>
                        <div class="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur text-[#A23861] text-xs font-bold shadow-sm">demo slot · {a.demo}</div>
                    </div>
                    <div class="p-6">
                        <h3 class="font-heading font-bold text-xl text-[#4A2C2C] mb-2">{a.kind}</h3>
                        <p class="text-[#875F42] text-sm leading-relaxed">{a.body}</p>
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- TOKEN SAVINGS -->
    <section class="reveal py-14 md:py-20 border-t border-pink-100">
        <SectionHeading>Why this doesn't waste your tokens</SectionHeading>
        <p class="text-[#875F42] text-lg max-w-2xl mb-12">
            Most ways of giving an agent image-processing capability push image bytes through the context window — twice. Mochify's local MCP doesn't.
        </p>

        <!-- Stat callout -->
        <div class="flex flex-col sm:flex-row gap-4 mb-10">
            <div class="flex-1 bg-white rounded-3xl border border-pink-50 shadow-sm p-7 text-center">
                <p class="font-heading font-black text-5xl text-[#F06292] mb-1">0</p>
                <p class="text-sm font-bold text-[#4A2C2C] uppercase tracking-wider">image bytes in context</p>
                <p class="text-xs text-[#875F42] mt-1">local MCP or CLI</p>
            </div>
            <div class="flex-1 bg-white rounded-3xl border border-pink-50 shadow-sm p-7 text-center">
                <p class="font-heading font-black text-5xl text-[#F06292] mb-1">~33%</p>
                <p class="text-sm font-bold text-[#4A2C2C] uppercase tracking-wider">base64 inflation, avoided</p>
                <p class="text-xs text-[#875F42] mt-1">bytes that never enter the payload</p>
            </div>
            <div class="flex-1 bg-white rounded-3xl border border-pink-50 shadow-sm p-7 text-center">
                <p class="font-heading font-black text-5xl text-[#F06292] mb-1">5 min</p>
                <p class="text-sm font-bold text-[#4A2C2C] uppercase tracking-wider">max pickup window</p>
                <p class="text-xs text-[#875F42] mt-1">hosted MCP only · local has zero</p>
            </div>
        </div>

        <!-- Flow comparison — unified dark card -->
        <div class="bg-[#1C1C1E] rounded-3xl overflow-hidden shadow-xl mb-8">
            <!-- Title bar -->
            <div class="flex items-center gap-2 px-5 py-3 bg-[#2C2C2E] border-b border-white/5">
                <div class="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div class="w-3 h-3 rounded-full bg-[#28C841]"></div>
                <span class="ml-3 text-xs text-white/40 font-mono">context window — bytes travelling through your agent</span>
            </div>
            <!-- Split columns -->
            <div class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                <!-- Bad -->
                <div class="p-6">
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
                            { label: 'agent', payload: '', bad: false },
                        ] as row}
                            <div class="flex items-center gap-3">
                                <span class="text-white/40 w-20 shrink-0">{row.label}</span>
                                <span class="{row.bad ? 'text-[#FF5F57] font-bold' : 'text-white/25'}">{row.payload}</span>
                            </div>
                        {/each}
                    </div>
                </div>
                <!-- Good -->
                <div class="p-6">
                    <div class="flex items-center gap-2 mb-5">
                        <span class="w-4 h-4 rounded-full bg-[#28C841] flex items-center justify-center shrink-0">
                            <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                        </span>
                        <span class="text-white/60 text-xs font-mono uppercase tracking-widest">Local Mochify MCP</span>
                    </div>
                    <div class="space-y-2 font-mono text-sm">
                        {#each [
                            { label: 'agent', payload: '→ file path', },
                            { label: 'tool call', payload: '→ path only', },
                            { label: 'response', payload: '→ path + meta', },
                            { label: 'agent', payload: '', },
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

        <div class="bg-[#FFF5F7] rounded-2xl border border-pink-100 p-5 flex items-start gap-4">
            <svg class="w-5 h-5 text-[#F06292] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
            <p class="text-sm text-[#6C3F31] leading-relaxed">
                <strong class="text-[#4A2C2C]">Zero retention, by design.</strong> Originals are streamed into the encoder in RAM and discarded immediately — no disk writes of the source, no logs containing image data. The local binary writes compressed results straight to your disk; nothing is held server-side. For a fully on-machine engine, self-host via the <a href="/guides/self-hosting-image-optimization-docker" class="text-[#F06292] hover:text-[#D81B60] underline underline-offset-2">Docker guide</a>.
            </p>
        </div>
    </section>

    <!-- AUDIENCE SOLUTIONS -->
    <section class="reveal py-14 md:py-20 border-t border-pink-100">
        <SectionHeading>Built for the rest of your stack</SectionHeading>
        <p class="text-[#875F42] text-lg max-w-2xl mb-10">Audience-specific guides and workflows live on their own pages.</p>

        <div class="grid sm:grid-cols-3 gap-5">
            <a href="/solutions" class="block bg-white rounded-3xl border border-pink-50 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all no-underline">
                <h3 class="font-heading font-bold text-lg text-[#4A2C2C] mb-2">Shopify &amp; e-commerce</h3>
                <p class="text-[#875F42] text-sm leading-relaxed">Cut LCP with AVIF on product photos and batch-resize a whole catalogue in one prompt.</p>
            </a>
            <div class="block bg-white rounded-3xl border border-pink-50 shadow-sm p-6">
                <h3 class="font-heading font-bold text-lg text-[#4A2C2C] mb-2">Agencies</h3>
                <p class="text-[#875F42] text-sm leading-relaxed">Batch client deliverables through a single CLI command or an agentic pipeline.</p>
            </div>
            <div class="block bg-white rounded-3xl border border-pink-50 shadow-sm p-6">
                <h3 class="font-heading font-bold text-lg text-[#4A2C2C] mb-2">Creators</h3>
                <p class="text-[#875F42] text-sm leading-relaxed">Strip EXIF, resize for the web, and keep originals private with zero-retention processing.</p>
            </div>
        </div>
    </section>

    <!-- FINAL CTA -->
    <section class="reveal py-16 md:py-24 border-t border-pink-100">
        <div class="text-center max-w-2xl mx-auto">
            <h2 class="font-heading font-black text-3xl md:text-4xl text-[#4A2C2C] mb-4">Wire Mochify into your workflow today</h2>
            <p class="text-[#6C3F31] text-lg mb-9 leading-relaxed">
                MCP and API access on every plan, starting at Free. No paywall on developer or agent features.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onclick={copyInstall}
                    class="group flex items-center gap-4 bg-[#2D1B1B] text-pink-100 rounded-2xl px-6 py-4 font-mono text-base shadow-lg transition-all"
                >
                    <span class="whitespace-nowrap"><span class="text-[#F06292] mr-2">$</span>brew install mochify</span>
                    <span class="inline-block text-center min-w-[3.5rem] text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a href="/pricing" class="inline-flex items-center gap-2 px-7 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                    View plans →
                </a>
            </div>
        </div>
    </section>

</main>

<Footer />
