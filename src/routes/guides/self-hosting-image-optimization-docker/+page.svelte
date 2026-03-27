<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import CodeBlock from '$lib/components/CodeBlock.svelte';

    const metadata = {
        category: "Image Optimization",
        readTime: "5 min read",
        date: "February 18, 2026"
    };
</script>

<ReadProgress />

<svelte:head>
<title>Self-Hosting Image Optimization with Mochify-Lite on Docker (2026 Guide)</title>
<meta name="description" content="Learn how to self-host your own image compression engine with Mochify-Lite on Docker. Complete setup guide with API usage examples, security best practices, and comparison to the full Mochify engine.">
<meta property="og:title" content="Self-Host Your Own Image Optimizer: Mochify-Lite on Docker" />
<meta property="og:description" content="Stop relying on third-party services. Set up Mochify-Lite on Docker for private, local image compression with libjpeg-turbo. Perfect for developers who want full control." />
</svelte:head>

<article class="bg-white rounded-none md:rounded-3xl pt-6 px-6 pb-8 md:p-12 border-x md:border border-pink-50 shadow-sm relative overflow-hidden">
    
    <header class="mb-12 border-b border-pink-50 pb-12">
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold uppercase tracking-wider border border-pink-100">
                {metadata.category}
            </span>
            <span class="text-sm font-bold text-[#875F42]">
                {metadata.readTime} · {metadata.date}
            </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#4A2C2C] leading-tight mb-6">
            Self-Hosting Image Optimization: A Guide to Mochify-Lite on Docker
        </h1>

        <p class="text-xl text-[#6C3F31] opacity-90 leading-relaxed max-w-2xl mb-4">
            Want to do your own image compression without relying on third-party services? This guide walks you through setting up Mochify-Lite, a powerful open-source image optimization tool, on Docker. Perfect for developers and privacy-conscious users who want full control over their image processing. 
        </p>
    </header>

    <div class="space-y-8 text-lg text-[#6C3F31] leading-relaxed">
        
        <section class="my-12">
            <SectionHeading>What's in This Guide</SectionHeading>

            <nav class="bg-[#FFF5F7] rounded-3xl p-6 border border-pink-100 shadow-inner">
                <ul class="space-y-3">
                    <li>
                        <a href="#docker-pull" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">01</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Pulling from Docker</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#using-the-api" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">02</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Using the API</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#lite-vs-full" class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                            <span class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-xs font-black text-[#F06292] border border-pink-100 group-hover:scale-110 transition-transform">03</span>
                                <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">Lite vs Full</span>
                            </span>
                            <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </section>

        <section id="docker-pull">
            <SectionHeading>Pulling the Image from Docker Hub</SectionHeading>
            <p class="mb-6">
                Setting up Mochify-Lite is straightforward because it is containerized. Since it is hosted on <a href="https://hub.docker.com/r/mochify/mochify-lite" class="text-[#F06292] font-bold underline decoration-2 decoration-[#FFB3C6] underline-offset-4 hover:text-[#ec407a] hover:decoration-[#F06292] hover:bg-[#FFF0F3] hover:rounded transition-colors">Docker Hub</a>, you can pull the image and have the engine running in seconds.
            </p>
            <p class="mb-6">
                To run the engine with optimal security and performance settings, use the following command. This configuration runs the container in the background, maps the necessary ports, and secures the environment:
            </p>
            <CodeBlock filename="docker" code={`docker run -d --name mochify-lite -p 5555:5555 --read-only --tmpfs /app/temp_ram_buffer:rw,size=64m,mode=1777 --security-opt=no-new-privileges mochify/mochify-lite:latest`} />
            <h3 class="text-xl font-bold text-[#4A2C2C] mt-8 mb-4">Understanding the Configuration</h3>
            <p class="mb-6">If you are new to Docker, here is a quick breakdown of what these flags are doing:</p>
            <ul class="list-disc pl-6 mb-6 space-y-2 marker:text-[#F06292]">
                <li><code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">-d:</code> Runs the container in "detached" mode (in the background).</li>
                <li><code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">-p 5555:5555:</code> Maps port 5555 of the container to port 5555 on your local machine. This is the gateway to the compression API.</li>
                <li><code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">--read-only:</code> A security best practice that makes the container's root filesystem immutable, preventing accidental or malicious changes.</li>
                <li><code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">--tmpfs:</code> Since the filesystem is read-only, this creates a small, fast 64MB buffer in RAM for the engine to process images temporarily.</li>
                <li><code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">--security-opt=no-new-privileges:</code> Prevents the container processes from gaining additional privileges, adding an extra layer of security.</li>
            </ul>
            <p>Once the command finishes, your local image compression engine is live and ready to receive requests at <a href="http://localhost:5555" class="text-[#F06292] font-bold underline decoration-2 decoration-[#FFB3C6] underline-offset-4 hover:text-[#ec407a] hover:decoration-[#F06292] hover:bg-[#FFF0F3] hover:rounded transition-colors">http://localhost:5555</a>. Further example configuration can be found on <a href="https://github.com/tliesnham/mochify-docker" class="text-[#F06292] font-bold underline decoration-2 decoration-[#FFB3C6] underline-offset-4 hover:text-[#ec407a] hover:decoration-[#F06292] hover:bg-[#FFF0F3] hover:rounded transition-colors">GitHub</a>.</p>
        </section>

        <section id="using-the-api">
            <SectionHeading>Using the API for Image Compression</SectionHeading>
            <p class="mb-6">
                Once your container is running, you have a high-performance compression engine sitting at the ready. Unlike SaaS tools that force you through a web interface, Mochify-Lite exposes a clean REST API. This means you can integrate it into your build scripts, local workflows, or even a right-click "Quick Action" on your desktop.
            </p>
            <p class="mb-6">
                The engine uses libjpeg-turbo and libpng under the hood, industry-standard libraries known for their balance of high speed and surgical precision.
            </p>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-8 mb-4">How to "Squish" an Image</h3>

            <p class="mb-6">
                The primary endpoint is <code class="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-bold border border-pink-100">/v1/squish</code>. It accepts standard image formats (JPEG and PNG) up to 10MB in size. To optimize an image, you simply POST the binary data to your local endpoint:
            </p>

            <CodeBlock filename="curl" code={`curl -X POST "http://localhost:5555/v1/squish" -H "Content-Type: image/jpeg" --data-binary "@mochi.jpg" --output mochi_optimized.jpg`} />
        </section>

        <section id="lite-vs-full">
            <SectionHeading>Leveling Up: Mochify vs. Mochify-Lite</SectionHeading>
            <p class="mb-6">
                While Mochify-Lite is a fantastic "drop-in" tool for standard JPEG and PNG tasks, the full Mochify engine is designed for developers who need to support the cutting edge of web performance.
            </p>
            <p class="mb-6">
                If your project requires next-gen formats like AVIF or the ultra-efficient JPEG XL, you'll want to look at the full engine. Here is how they stack up:
            </p>

            <div class="my-12">
                <div class="overflow-hidden rounded-3xl border border-pink-50 shadow-sm bg-white">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            
                            <thead>
                                <tr class="bg-[#FFF5F7] border-b border-pink-100">
                                    <th class="py-5 px-6 text-sm font-black text-[#4A2C2C] uppercase tracking-wider w-1/3">Feature</th>
                                    <th class="py-5 px-6 text-sm font-black text-[#875F42] uppercase tracking-wider w-1/3">Mochify-Lite</th>
                                    <th class="py-5 px-6 text-sm font-black text-[#F06292] uppercase tracking-wider w-1/3">Mochify (Full)</th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-pink-50 text-[#6C3F31]">
                                
                                <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                    <td class="py-5 px-6 font-bold text-[#4A2C2C]">JPEG Engine</td>
                                    <td class="py-5 px-6">libjpeg-turbo (Speed)</td>
                                    <td class="py-5 px-6 font-bold text-[#F06292]">Jpegli (Highest Quality/Ratio)</td>
                                </tr>

                                <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                    <td class="py-5 px-6 font-bold text-[#4A2C2C]">Max File Size</td>
                                    <td class="py-5 px-6">10MB</td>
                                    <td class="py-5 px-6 font-bold text-[#F06292]">20MB</td>
                                </tr>

                                <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                    <td class="py-5 px-6 font-bold text-[#4A2C2C]">Input Formats</td>
                                    <td class="py-5 px-6">JPG, PNG</td>
                                    <td class="py-5 px-6 font-bold text-[#F06292]">JPG, PNG, HEIC, AVIF, WebP</td>
                                </tr>

                                <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                    <td class="py-5 px-6 font-bold text-[#4A2C2C]">Output Formats</td>
                                    <td class="py-5 px-6">JPG, PNG</td>
                                    <td class="py-5 px-6 font-bold text-[#F06292]">JPG, PNG, AVIF, WebP, JXL</td>
                                </tr>

                                <tr class="group hover:bg-[#FFF9FB] transition-colors duration-200">
                                    <td class="py-5 px-6 font-bold text-[#4A2C2C]">Use Case</td>
                                    <td class="py-5 px-6">Quick local scripts & legacy apps</td>
                                    <td class="py-5 px-6 font-bold text-[#F06292]">Production-grade asset pipelines</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>

                <h3 class="text-xl font-bold text-[#4A2C2C] mt-8 mb-4">Why the Full Engine Matters: Jpegli and JXL</h3>

                <p class="mb-6">
                    The most significant difference in the full version is the switch to Jpegli. Developed by Google, Jpegli is a newer library that produces JPEGs that are significantly more compressed (often 30% smaller) than standard libraries while remaining 100% compatible with existing browsers and viewers.
                </p>
                <p class="mb-6">
                    Furthermore, the full engine unlocks JPEG XL (JXL) support—the format many believe to be the true successor to JPEG, offering superior lossless compression and better responsiveness.
                </p>
            </div>
        </section>
            
        <div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"><div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div> <div class="relative z-10 mb-6"><span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">Free Tool</span></div> <h3 class="text-2xl md:text-3xl font-black text-[#4A2C2C] relative z-10 mb-3 flex items-center justify-center gap-3">Ready to convert your images?</h3> <p class="text-[#6C3F31] text-lg max-w-2xl mx-auto relative z-10 mb-8 leading-relaxed">Try Mochify's zero-retention WebP and AVIF converters - no accounts, no plugins, no stored files. Process in-memory with C++ engine speed, then upload directly to your site or marketplace.</p> <a href="https://mochify.app" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline"><span>Start Optimizing</span> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg></a></div>

    </div>
</article>

<style>
    :global(.prose h3, .prose h4) {
        color: #4A2C2C !important; /* Deep Cocoa */
        font-weight: 800;
        margin-top: 3rem;
        border-bottom: 1px solid #FFF0F3;
        padding-bottom: 0.5rem;
    }
    :global(.prose strong) {
        color: #4A2C2C !important; /* Makes bold text stand out without being 'black' */
        font-weight: 700;
    }

    :global(.prose p, .prose li) {
        color: #6C3F31 !important; /* Warm Cocoa for standard text */
    }

    /* Softening the numbers in lists */
    :global(.prose ol > li::marker) {
        color: #F06292; /* Using your Brand Pink for a cute touch */
        font-weight: 800;
    }
    :global(.prose a), 
    :global(.prose a:where(:not(.not-prose))) {
        color: #F06292 !important; /* Brand Pink */
        text-underline-offset: 4px !important;
        text-decoration-thickness: 2px !important;
        text-decoration-color: #FFB3C6 !important; /* Soft Pink Underline */
        font-weight: 700 !important;
    }

    :global(.prose a:hover) {
        color: #ec407a !important;
        text-decoration-color: #F06292 !important;
        background-color: #FFF0F3 !important; /* Strawberry highlight */
        border-radius: 4px;
    }
</style>
