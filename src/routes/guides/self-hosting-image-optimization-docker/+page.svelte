<script>
    import ReadProgress from '$lib/components/ReadProgress.svelte';
    import GuideTOC from '$lib/components/guide-demo/GuideTOC.svelte';
    import AccentTitle from '$lib/components/guide-demo/AccentTitle.svelte';
    import CodeCard from '$lib/components/guide-demo/CodeCard.svelte';
    import GuideTable from '$lib/components/guide-demo/GuideTable.svelte';
    import RelatedGuidesGrid from '$lib/components/guide-demo/RelatedGuidesGrid.svelte';
    import SectionHeading from '$lib/components/SectionHeading.svelte';
    import GuideSchema from '$lib/components/GuideSchema.svelte';

    const metadata = {
        category: "Image Optimization",
        readTime: "5 min read",
        date: "February 18, 2026",
        lastUpdated: "October 1, 2026"
    };

    const related = [
                    { href: '/guides/privacy-image-optimization', title: 'Privacy and image optimization: the comprehensive guide', desc: 'Zero-retention, GDPR, and how to evaluate image optimization tools for regulated and NDA-sensitive work.' },
                    { href: '/guides/2026-guide-next-gen-formats', title: 'The 2026 guide to next-gen formats: WebP, AVIF, JPEG XL', desc: 'The format benchmarks and browser support behind the full engine\'s AVIF and JXL output.' },
                    { href: '/guides/why-we-relaxed-zero-retention-for-mcp', title: 'Why we relaxed our zero-retention policy for MCP', desc: 'What zero-retention means on each Mochify surface, and why self-hosting is the strictest option.' },
                ];

    const toc = [
        { id: 'docker-pull', label: 'Pulling from Docker' },
        { id: 'using-the-api', label: 'Using the API' },
        { id: 'lite-vs-full', label: 'Lite vs Full' }
    ];
</script>

<ReadProgress />

<svelte:head>
<title>Self-Host Image Optimization: Mochify-Lite on Docker</title>
<meta name="description" content="Self-host your own image compression engine with Mochify-Lite on Docker: setup, API examples, security practices and how it compares to the full engine.">
<meta property="og:description" content="Stop relying on third-party services. Set up Mochify-Lite on Docker for private, local image compression with libjpeg-turbo. Perfect for developers who want full control." />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://mochify.app/guides/self-hosting-image-optimization-docker" />

<script type="application/ld+json">
    {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Self-Hosting Image Optimization with Mochify-Lite on Docker (2026 Guide)",
    "description": "Self-host your own image compression engine with Mochify-Lite on Docker: setup, API examples, security practices and how it compares to the full engine.",
    "author": {
        "@type": "Organization",
        "name": "Mochify Engineering Team"
    },
    "publisher": {
        "@type": "Organization",
        "name": "Mochify",
        "url": "https://mochify.app"
    },
    "image": "https://mochify.app/og/guides-self-hosting-image-optimization-docker.png",
    "datePublished": "2026-02-18T12:00:00+00:00",
    "dateModified": "2026-10-01T12:00:00+00:00",
    "url": "https://mochify.app/guides/self-hosting-image-optimization-docker",
    "isPartOf": {
        "@type": "CollectionPage",
        "name": "Image Optimization Guides",
        "url": "https://mochify.app/guides"
    }
    }
</script>
	<GuideSchema
		name="Self-Hosting Image Optimization: A Guide to Mochify-Lite on Docker"
		url="https://mochify.app/guides/self-hosting-image-optimization-docker"
		description="Self-host your own image compression engine with Mochify-Lite on Docker: setup, API examples, security practices and how it compares to the full engine."
		datePublished="2026-02-18"
		dateModified="2026-10-01"
	/>
</svelte:head>

<article
	class="relative mx-auto w-full max-w-3xl px-5 pt-6 text-lg leading-relaxed text-[#6C3F31] sm:px-6 md:px-0 md:pt-0"
>
	<div class="hero-wash" aria-hidden="true"></div>
    
    <header class="mb-12 md:mb-14">
		<p class="mt-0 mb-3 text-xs font-bold tracking-[0.18em] text-[#F06292] uppercase">
			{metadata.category}
		</p>
		<h1
			class="mb-0 text-3xl leading-[1.1] font-black tracking-tight text-[#4A2C2C] md:text-[2.75rem]"
		>
			<AccentTitle title="Self-Hosting Image Optimization: A Guide to Mochify-Lite on Docker" accent="Self-Hosting Image Optimization" />
		</h1>
		<div class="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6]"></div>
		<p class="mt-5 mb-0 text-sm font-bold text-[#875F42]">
			{metadata.readTime} · Published {metadata.date} · Updated {metadata.lastUpdated} · Mochify Engineering Team
		</p>

        <p class="article-intro mt-8 mb-0 text-xl leading-relaxed text-[#6C3F31] opacity-90">
            Want to do your own image compression without relying on third-party services? This guide walks you through setting up Mochify-Lite, a powerful open-source image optimization tool, on Docker. Perfect for developers and privacy-conscious users who want full control over their image processing. 
        </p>
    </header>

    <div class="space-y-12">
        
        <section>
            <GuideTOC items={toc} heading="What's in This Guide" />
        </section>

        <section id="docker-pull" class="scroll-mt-24">
            <SectionHeading>Pulling the Image from Docker Hub</SectionHeading>
            <p class="mb-6">
                Setting up Mochify-Lite is straightforward because it is containerized. Since it is hosted on <a href="https://hub.docker.com/r/mochify/mochify-lite" class="text-[#F06292] font-bold underline decoration-2 decoration-[#FFB3C6] underline-offset-4 hover:text-[#ec407a] hover:decoration-[#F06292] hover:bg-[#FFF0F3] hover:rounded transition-colors">Docker Hub</a>, you can pull the image and have the engine running in seconds.
            </p>
            <p class="mb-6">
                To run the engine with optimal security and performance settings, use the following command. This configuration runs the container in the background, maps the necessary ports, and secures the environment:
            </p>
            <CodeCard filename="docker" code={`docker run -d --name mochify-lite -p 5555:5555 --read-only --tmpfs /app/temp_ram_buffer:rw,size=64m,mode=1777 --security-opt=no-new-privileges mochify/mochify-lite:latest`} />
            <h3 class="text-xl font-bold text-[#4A2C2C] mt-8 mb-4">Understanding the Configuration</h3>
            <p class="mb-6">If you are new to Docker, here is a quick breakdown of what these flags are doing:</p>
            <ul class="list-disc pl-6 mb-6 space-y-2 marker:text-[#F06292]">
                <li><code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">-d:</code> Runs the container in "detached" mode (in the background).</li>
                <li><code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">-p 5555:5555:</code> Maps port 5555 of the container to port 5555 on your local machine. This is the gateway to the compression API.</li>
                <li><code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">--read-only:</code> A security best practice that makes the container's root filesystem immutable, preventing accidental or malicious changes.</li>
                <li><code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">--tmpfs:</code> Since the filesystem is read-only, this creates a small, fast 64MB buffer in RAM for the engine to process images temporarily.</li>
                <li><code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">--security-opt=no-new-privileges:</code> Prevents the container processes from gaining additional privileges, adding an extra layer of security.</li>
            </ul>
            <p>Once the command finishes, your local image compression engine is live and ready to receive requests at <code>http://localhost:5555</code>. Further example configuration can be found on <a href="https://github.com/tliesnham/mochify-docker" class="text-[#F06292] font-bold underline decoration-2 decoration-[#FFB3C6] underline-offset-4 hover:text-[#ec407a] hover:decoration-[#F06292] hover:bg-[#FFF0F3] hover:rounded transition-colors">GitHub</a>.</p>
        </section>

        <section id="using-the-api" class="scroll-mt-24">
            <SectionHeading>Using the API for Image Compression</SectionHeading>
            <p class="mb-6">
                Once your container is running, you have a high-performance compression engine sitting at the ready. Unlike SaaS tools that force you through a web interface, Mochify-Lite exposes a clean REST API. This means you can integrate it into your build scripts, local workflows, or even a right-click "Quick Action" on your desktop.
            </p>
            <p class="mb-6">
                The engine uses libjpeg-turbo and libpng under the hood, industry-standard libraries known for their balance of high speed and surgical precision.
            </p>

            <h3 class="text-xl font-bold text-[#4A2C2C] mt-8 mb-4">How to "Squish" an Image</h3>

            <p class="mb-6">
                The primary endpoint is <code class="bg-pink-50 text-pink-600 px-1.5 py-px rounded text-sm font-bold border border-pink-100">/v1/squish</code>. It accepts standard image formats (JPEG and PNG) up to 10MB in size. To optimize an image, you simply POST the binary data to your local endpoint:
            </p>

            <CodeCard filename="curl" code={`curl -X POST "http://localhost:5555/v1/squish" -H "Content-Type: image/jpeg" --data-binary "@mochi.jpg" --output mochi_optimized.jpg`} />
        </section>

        <section id="lite-vs-full" class="scroll-mt-24">
            <SectionHeading>Leveling Up: Mochify vs. Mochify-Lite</SectionHeading>
            <p class="mb-6">
                While Mochify-Lite is a fantastic "drop-in" tool for standard JPEG and PNG tasks, the full Mochify engine is designed for developers who need to support the cutting edge of web performance.
            </p>
            <p class="mb-6">
                If your project requires next-gen formats like AVIF or the ultra-efficient JPEG XL, you'll want to look at the full engine. Here is how they stack up:
            </p>

            <div class="my-12">
                    <GuideTable class="my-6">
                        <table>
                            
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Mochify-Lite</th>
                                    <th>Mochify (Full)</th>
                                </tr>
                            </thead>

                            <tbody>
                                
                                <tr>
                                    <td>JPEG Engine</td>
                                    <td>libjpeg-turbo (Speed)</td>
                                    <td>Jpegli (Highest Quality/Ratio)</td>
                                </tr>

                                <tr>
                                    <td>Max File Size</td>
                                    <td>10MB</td>
                                    <td>20MB</td>
                                </tr>

                                <tr>
                                    <td>Input Formats</td>
                                    <td>JPG, PNG</td>
                                    <td>JPG, PNG, HEIC, AVIF, WebP</td>
                                </tr>

                                <tr>
                                    <td>Output Formats</td>
                                    <td>JPG, PNG</td>
                                    <td>JPG, PNG, AVIF, WebP, JXL</td>
                                </tr>

                                <tr>
                                    <td>Use Case</td>
                                    <td>Quick local scripts & legacy apps</td>
                                    <td>Production-grade asset pipelines</td>
                                </tr>

                            </tbody>
                        </table>
                    </GuideTable>

                <h3 class="text-xl font-bold text-[#4A2C2C] mt-8 mb-4">Why the Full Engine Matters: Jpegli and JXL</h3>

                <p class="mb-6">
                    The most significant difference in the full version is the switch to Jpegli. Developed by Google, Jpegli is a newer library that produces JPEGs that are significantly more compressed (often 30% smaller) than standard libraries while remaining 100% compatible with existing browsers and viewers.
                </p>
                <p class="mb-6">
                    Furthermore, the full engine unlocks JPEG XL (JXL) support—the format many believe to be the true successor to JPEG, offering superior lossless compression and better responsiveness.
                </p>
            </div>
        </section>
            
        <div class="my-12 bg-[#FFF5F7] p-8 md:p-10 rounded-3xl border border-pink-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"><div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div> <div class="relative z-10 mb-6"><span class="inline-block px-3 py-1 rounded-full bg-white text-[#F06292] text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">Free Tool</span></div> <h3 class="text-2xl md:text-3xl font-extrabold text-[#4A2C2C] relative z-10 mb-3 flex items-center justify-center gap-3">Ready to convert your images?</h3> <p class="text-[#6C3F31] text-lg max-w-2xl mx-auto relative z-10 mb-8 leading-relaxed">Try Mochify's zero-retention WebP and AVIF converters - no accounts, no plugins, no stored files. Process in-memory with C++ engine speed, then upload directly to your site or marketplace.</p> <a href="https://mochify.app" class="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#F06292] hover:bg-[#D81B60] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300 no-underline"><span>Start Optimizing</span> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg></a></div>

        <RelatedGuidesGrid guides={related} />

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
