<script lang="ts">
    import { onMount } from 'svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import CodeCard from '$lib/components/guide-demo/CodeCard.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const HOSTED_URL = 'https://mcp.mochify.app';
    const REPO_URL = 'https://github.com/getmochify/mochify-cli';

    const title = 'Mochify MCP Server - Edit Images From Your AI Assistant';
    const metaDescription =
        'Connect Mochify to Claude, Cursor or any MCP client and ask in plain English: compress, convert, crop, hide faces, erase an object, recolor, compress PDFs.';

    const faqs: FaqItem[] = [
        {
            q: 'Is the Mochify MCP server free?',
            a: 'Yes, on every plan, with a free account giving 25 images a month. Compressing, converting, cropping, hiding faces and areas, building a PDF from images and checking your usage are on every plan. Erasing an object, recoloring an object and the PDF-in operations (compress, extract, rasterize, split) need a paid plan or the $2 Day Pass (a Day Pass is used here on the free account you sign in with).'
        },
        {
            q: 'Which assistants can I use it with?',
            a: 'Any client that supports MCP. The hosted server at mcp.mochify.app works with clients that support remote connectors with OAuth, such as Claude Desktop and Cursor. The local server, mochify serve, works with any client that can run a standard stdio MCP server, including Claude Desktop, Claude Code and Cursor.'
        },
        {
            q: 'Does the assistant see my image?',
            a: "Your assistant sees whatever you give it; that is how it chooses a box. Mochify does not see what the box contains: it receives four numbers, fractions of the upright image from the top-left corner, and edits the pixels inside them. The finished image goes back to you as a download link (hosted) or a file on your disk (local), not into the assistant's context."
        },
        {
            q: 'Are my images processed on my computer?',
            a: 'No, on either server. Images travel over HTTPS to api.mochify.app, are processed in memory and are wiped as soon as the job finishes. The local server differs in what it keeps afterwards, which is nothing: the result is written straight to your disk, with no pickup store. Only video on the Mochify web app runs locally, and the MCP server does not handle video.'
        },
        {
            q: 'How does a photo I attached to the chat reach Mochify?',
            a: 'An assistant sees an attached photo as pixels, not as a file, so it asks Mochify for a one-time upload link with the create_upload tool, then either uploads the photo itself or hands you the link to drop the photo on. The link works once. The original is deleted the moment processing starts, or after 15 minutes if it is never used. An image you give by URL never touches it.'
        },
        {
            q: 'Can I ask it to blur faces without drawing a box?',
            a: 'Yes. "Hide every face" uses Mochify\'s own face detector, so no box is needed. It is best-effort, and the assistant reports how many faces it hid: check that number against the people in the picture and ask for a box over anyone it missed. Hidden areas are solid black by default; a blur is cosmetic and can sometimes be partly reversed.'
        },
        {
            q: 'Can it remove a person or an object from a photo?',
            a: 'Yes, on paid plans including the Day Pass, with the erase tool: the assistant boxes the object, Mochify paints it out and fills in the background. It is best on small distractions, and large removals come out softer. Erase invents pixels, so it is for tidying your own photos and never a way to hide anything sensitive; use redaction for that.'
        },
        {
            q: 'Can it compress a PDF?',
            a: 'Yes, on a paid plan or the Day Pass. It recompresses the images inside the PDF and leaves text, fonts and vectors alone, so the document stays searchable and the output is never larger than the input. Each PDF compressed counts as one image against your allowance. Seller, Pro and the Day Pass take PDFs of up to 10 pages; Growth goes further. Building a PDF from images works on every plan.'
        },
        {
            q: 'Does using the MCP server use my monthly allowance?',
            a: 'Yes. There is one monthly allowance per account, shared by the web app, the MCP server, the command line and the API. Each file you get back counts as one image. Ask the assistant to check your usage at any time.'
        }
    ];

    let demoVideo: HTMLVideoElement;
    let setupVideo: HTMLVideoElement;
    let reduceMotion = $state(false);

    onMount(() => {
        reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Attach src only when a clip is near the viewport, and pause it once
        // it leaves, so a visitor who never scrolls that far downloads nothing.
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const video = entry.target as HTMLVideoElement;
                    if (entry.isIntersecting) {
                        if (!video.src && video.dataset.src) video.src = video.dataset.src;
                        if (!reduceMotion) video.play().catch(() => {});
                    } else if (!video.paused) {
                        video.pause();
                    }
                }
            },
            { rootMargin: '300px 0px', threshold: 0 }
        );
        observer.observe(demoVideo);
        observer.observe(setupVideo);
        return () => observer.disconnect();
    });

    const organization = { '@type': 'Organization', name: 'Mochify', url: 'https://mochify.app' };

    const demoDescription =
        'One sentence in Claude: remove the bin from a street photo and export it as a 4:5 and a 1:1 crop. Mochify erases the bin, the assistant picks both crops, and the two files are saved to the desktop.';

    const videoLd = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'Mochify MCP server demo: erase and crop a photo from Claude',
        description: demoDescription,
        thumbnailUrl: 'https://mochify.app/videos/mcp-erase-crop-demo-poster.jpg',
        contentUrl: 'https://mochify.app/videos/mcp-erase-crop-demo.mp4',
        uploadDate: '2026-10-20',
        duration: 'PT25S',
        publisher: organization
    };

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mochify.app' },
            { '@type': 'ListItem', position: 2, name: 'MCP server', item: 'https://mochify.app/mcp' }
        ]
    };

    // softwareVersion is the hosted server card's version: bump it when the card bumps.
    // No aggregateRating.
    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify MCP Server',
        description: metaDescription,
        url: 'https://mochify.app/mcp',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        installUrl: HOSTED_URL,
        downloadUrl: REPO_URL,
        softwareVersion: '1.7.0',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: organization
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };

    const brewInstall = `brew tap getmochify/mochify
brew install mochify
mochify auth login`;

    const localConfig = `{
  "mcpServers": {
    "mochify": {
      "command": "mochify",
      "args": ["serve"]
    }
  }
}`;

    const guides = [
        {
            href: 'https://mochify.app/guides/how-the-mochify-mcp-server-works',
            title: 'How the Mochify MCP Server Works: Hosted vs Local',
            desc: 'the two surfaces, worked examples and what each costs in tokens.'
        },
        {
            href: 'https://mochify.app/guides/mochify-mcp-image-compression-agent-2026',
            title: 'How to Use Mochify via MCP',
            desc: 'the step-by-step setup in each client.'
        },
        {
            href: 'https://mochify.app/guides/blur-faces-license-plate-ai-assistant',
            title: 'How to Blur Faces or a License Plate in a Photo (Ask Your AI Assistant)',
            desc: 'redaction on two real photos, including what the detector missed.'
        },
        {
            href: 'https://mochify.app/guides/remove-objects-from-photo-ai-assistant',
            title: 'How to Remove Objects From a Photo With an AI Assistant (and Recolor Them)',
            desc: 'erase and recolor on real photos, with the three runs that did not come out clean.'
        },
        {
            href: 'https://mochify.app/guides/image-compression-claude-code-cli-mcp',
            title: 'Image Compression Inside Claude Code: The Mochify CLI + MCP Guide',
            desc: 'the local binary in a coding session.'
        },
        {
            href: 'https://mochify.app/guides/extract-images-from-pdf-agent-workflows',
            title: 'Working with PDFs in AI Agent Workflows',
            desc: 'extract, split and convert pages from an assistant.'
        },
        {
            href: 'https://mochify.app/guides/why-we-relaxed-zero-retention-for-mcp',
            title: 'Why We Relaxed Our Zero-Retention Policy for MCP',
            desc: 'the five-minute pickup store, and why it exists.'
        }
    ];

    const linkClass = 'font-bold text-[#F06292] hover:text-[#D81B60] transition-colors';
    const h2Class = 'text-2xl font-bold text-[#4A2C2C] scroll-mt-24';
    const pClass = 'leading-relaxed text-[#6C3F31]';
    const promptClass =
        'inline-block rounded-2xl rounded-bl-md bg-[#FFF5F7] border border-pink-100 px-5 py-3 text-[#4A2C2C] font-semibold leading-relaxed';
    const freePlan =
        'inline-flex items-center px-3 py-1 rounded-xl bg-[#F0FDF4] border border-green-100 text-green-700 text-xs font-bold tracking-wide';
    const paidPlan =
        'inline-flex items-center px-3 py-1 rounded-xl bg-[#F3F0FF] border border-[#DDD6FE] text-[#6D28D9] text-xs font-bold tracking-wide';
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={metaDescription}>
    <meta property="og:title" content={title} />
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={metaDescription} />

    {@html `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(softwareLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(videoLd)}<\/script>`}
</svelte:head>

<div class="relative flex min-h-screen flex-col">
<Navigation />

<main class="relative z-10 max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

    <div class="text-center mb-10 space-y-6">
        <div class="flex flex-wrap justify-center gap-3">
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-violet text-xs font-bold tracking-wide uppercase">
                MCP Server
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-green text-xs font-bold tracking-wide uppercase">
                Hosted or Local
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl deep-chip-pink text-xs font-bold tracking-wide uppercase">
                Zero Retention
            </span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
            Edit images from your
            <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">AI assistant</span>
        </h1>

        <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed text-balance">
            Connect Mochify once and your assistant can compress, convert, crop, hide, erase and recolor the images you give it, and work on your PDFs, by asking in plain English. You describe the result. Where a box is needed, the assistant looks at the picture and chooses it. Mochify does the pixel work and hands back the file.
        </p>

        <div class="flex flex-wrap justify-center items-center gap-4">
            <a href="#setup" class="px-7 py-3.5 rounded-2xl bg-mochi-pink hover:bg-[#E91E63] text-white font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Add https://mcp.mochify.app to your assistant
            </a>
            <a href="#setup" class={linkClass}>
                Run it on your own machine instead
            </a>
        </div>

        <p class="text-sm text-[#875F42] max-w-xl mx-auto leading-relaxed">
            Works with Claude Desktop, Cursor and any client that supports MCP. Free account: 25 images a month. Images are processed in memory at api.mochify.app and wiped as soon as the job finishes; the model that picks a box never sends Mochify a description of what is in it.
        </p>
    </div>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 id="demo" class={h2Class}>See it in action</h2>
        <p class="leading-relaxed text-[#6C3F31]">{demoDescription}</p>
        <video
            bind:this={demoVideo}
            data-src="/videos/mcp-erase-crop-demo.mp4"
            poster="/videos/mcp-erase-crop-demo-poster.jpg"
            width="1042"
            height="720"
            muted
            loop
            playsinline
            preload="none"
            controls={reduceMotion}
            disablepictureinpicture
            aria-label="Demo: asking Claude to remove the bin from a photo on the desktop and export 4:5 and 1:1 crops; Claude calls Mochify, then shows both finished crops with the bin gone."
            class="w-full h-auto rounded-2xl shadow-sm border border-pink-50 bg-[#FFF5F7]"
        ></video>
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-6">
        <h2 id="setup" class={h2Class}>Two ways to connect</h2>

        <div class="space-y-4">
            <h3 class="text-xl font-bold text-[#4A2C2C]">Hosted: nothing to install</h3>
            <p class={pClass}>In Claude Desktop, go to Settings, then Connectors, add https://mcp.mochify.app and sign in when the browser window opens. Cursor and other clients that support remote MCP connectors follow the same shape. From then on the assistant has five Mochify tools: squish for images, create_upload for a photo attached to the chat, pdf and pdf_create for documents, and check_usage for your allowance.</p>
            <video
                bind:this={setupVideo}
                data-src="/videos/mcp-setup-claude.mp4"
                poster="/videos/mcp-setup-claude-poster.jpg"
                width="1042"
                height="720"
                muted
                loop
                playsinline
                preload="none"
                controls={reduceMotion}
                disablepictureinpicture
                aria-label="Setup in Claude Desktop: Settings, Connectors, Add custom connector, name Mochify, URL https://mcp.mochify.app, sign in, and the Mochify connector listing its tools."
                class="w-full h-auto rounded-2xl shadow-sm border border-pink-50 bg-[#FFF5F7]"
            ></video>
            <p class={pClass}>Results come back as a download link on files.mochify.app that works for about five minutes. The assistant receives the link, never the image.</p>
        </div>

        <div class="space-y-4 pt-4">
            <h3 class="text-xl font-bold text-[#4A2C2C]">Local: one binary, your disk</h3>
            <CodeCard filename="terminal" code={brewInstall} />
            <p class={pClass}>Then add it under mcpServers in your client's MCP config (claude_desktop_config.json in Claude Desktop):</p>
            <CodeCard filename="mcp config" code={localConfig} />
            <p class={pClass}>The same binary is the Mochify command-line tool. As a local server it returns file paths, so results are written to your disk and no image bytes enter the chat. Linux binaries and cargo install are on <a href={REPO_URL} target="_blank" rel="noopener noreferrer" class={linkClass}>GitHub</a>. Either way the pixels are processed at api.mochify.app, not on your machine; the local server has no pickup store, which is the difference.</p>
        </div>

        <div class="space-y-4 pt-4">
            <h3 class="text-xl font-bold text-[#4A2C2C]">How a box works</h3>
            <p class={pClass}>Four of the sections below need a box: crop to a region, hide an area, erase an object, recolor an object. Your assistant looks at the image and chooses the box; Mochify receives four numbers, fractions of the upright picture from the top-left corner, never pixels and never a description of what the box contains. The assistant that can see the picture does the understanding. Mochify does the editing.</p>
        </div>
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 id="compress" class={h2Class}>Compress and convert</h2>
        <p class={promptClass}>"Convert hero.jpg to AVIF at 1200 pixels wide."</p>
        <p><span class={freePlan}>Every plan, including Free.</span></p>
        <p class={pClass}>The squish tool takes an image by URL, by file path on the local server, or from a one-time upload link when the photo is attached to the chat. Out comes JPG (encoded with jpegli), WebP, AVIF, JPEG XL or PNG, resized if you asked, with the metadata stripped or kept as you ask. HEIC and HEIF from a phone or camera go in like any other format.</p>
        <!-- Pair 1 (compress and convert): before/after from the handoff's A5 shot list goes here. -->
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 id="crop" class={h2Class}>Crop and region</h2>
        <p class={promptClass}>"Crop this to a square around the product." or "Crop to the mug on the right."</p>
        <p><span class={freePlan}>Every plan, including Free.</span></p>
        <p class={pClass}>Two kinds of crop. A smart crop finds the subject itself and keeps it in frame at the size you asked for; it works best when the subject is obvious. A region crop is one your assistant chooses by looking at the image: it picks the rectangle, Mochify cuts it. A box that runs past the edge is trimmed to the picture.</p>
        <!-- Pair 2 (region crop) goes here. -->
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 id="redact" class={h2Class}>Hide faces and areas</h2>
        <p class={promptClass}>"Hide every face and the number plate, then give me a WebP."</p>
        <p><span class={freePlan}>Every plan, including Free.</span></p>
        <p class={pClass}>Faces are found by Mochify's own detector on Mochify's servers; no third-party service sees the image. It is best-effort: it can miss small faces in a group and strong side profiles, so the assistant tells you how many faces it hid, and you check that against the people in the picture and ask for a box over anyone it missed. Other areas, a plate, an address label, a screen, are boxes the assistant chooses. Up to 64 areas in one call.</p>
        <p class={pClass}>Hidden areas are filled solid black by default. You can ask for a blur instead, but blur is a cosmetic look: blurred text and faces can sometimes be partly recovered, so use the solid fill for anything that must stay secret. Redaction runs before any crop, so a crop can never uncover a hidden area, and a redacted image always has its metadata removed and any HDR gain map dropped, because an EXIF thumbnail or a gain map could still hold the original.</p>
        <!-- Pair 3 (hide faces and areas) goes here. -->
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 id="erase" class={h2Class}>Erase an object</h2>
        <p class={promptClass}>"Remove the bin on the left and fill in the background."</p>
        <p><span class={paidPlan}>Paid plans, including the Day Pass.</span></p>
        <p class={pClass}>Erase paints a boxed object out and fills the space with plausible background. Your assistant draws the box around the whole object with a margin, shadow included; Mochify finds the object's outline inside the box and repaints only the outline plus a margin, so as little of the scene as possible is invented. Up to eight objects in one call. It is best on small distractions against texture or a plain background: a bin, a cable, a stray passer-by. Large removals come out softer, because the model paints at a fixed 512 by 512.</p>
        <p class={pClass}>Erase invents pixels. It is for tidying your own photos, and never a way to hide anything sensitive; for that, ask it to hide the area instead (see <a href="#redact" class={linkClass}>Hide faces and areas</a>). An erased image always has its metadata removed and any HDR gain map dropped. Real runs, including the ones that came out soft, are in <a href="/guides/remove-objects-from-photo-ai-assistant" class={linkClass}>how to remove objects from a photo with an AI assistant</a>.</p>
        <!-- Pair 4 (erase) goes here; its "after" image is also the planned og:image. -->
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 id="recolor" class={h2Class}>Recolor an object</h2>
        <p class={promptClass}>"Make the jacket navy blue and keep the shading."</p>
        <p><span class={paidPlan}>Paid plans, including the Day Pass.</span></p>
        <p class={pClass}>Recolor changes the color of a boxed object and keeps its shading: every fold, highlight and texture stays where it was, and only the hue moves to the color you named. Your assistant boxes the exact part to recolor, the jacket rather than the whole person, and Mochify finds the outline inside the box so the object changes and the rectangle does not. Nothing is generated. A box with no clear object in it is skipped and reported, never painted as a block. Up to eight objects in one call. A recolored image always has its metadata removed and any HDR gain map dropped.</p>
        <!-- Pair 5 (recolor) goes here. -->
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 id="pdf" class={h2Class}>PDFs</h2>
        <p class={promptClass}>"Compress this PDF so it will go by email." or "Split this into one PDF per page." or "Make a PDF from these three photos."</p>
        <p class={pClass}>Building a PDF from images works on every plan, including Free: up to 3 images per PDF on Free, 20 on paid plans. Compressing, extracting the images, rasterizing pages and splitting need a paid plan or the Day Pass.</p>
        <p class={pClass}>Compression recompresses the images inside the PDF and leaves text, fonts and vectors untouched, so the document stays searchable and is never larger than it was. Each PDF you compress counts as one image against your monthly allowance, however many images are inside it. Seller, Pro and the Day Pass handle PDFs of up to 10 pages; Growth goes further. A PDF over your plan's limit is refused, not returned half done.</p>
        <!-- Pair 6 (PDF) goes here. -->
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 id="usage" class={h2Class}>Check your usage</h2>
        <p class={promptClass}>"How many images do I have left this month?"</p>
        <p><span class={freePlan}>Every plan, including Free.</span></p>
        <p class={pClass}>The check_usage tool returns what remains of your allowance for the current period, counted across every surface you use Mochify on: the web app, the assistant, the command line and the API share one monthly allowance. Each file you get back counts as one image.</p>
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 id="privacy" class={h2Class}>How your images are handled</h2>
        <p class={pClass}>Images travel over HTTPS to api.mochify.app, are processed in memory and are wiped as soon as the job finishes. Nothing is written to disk, nothing containing your image is logged, and nothing is used to train AI. That holds for face detection, erase and recolor too: the models run on Mochify's own servers, with no third-party service in the loop. It is not local processing, on either server, and we would rather tell you exactly which one it is.</p>
        <p class={pClass}>Two things the hosted server adds, and the local one does not. The finished file is held for about five minutes on files.mochify.app so that your download link works, then evicted whether or not it was fetched; only the link enters the chat. And when a photo is attached to the chat, the assistant cannot send its bytes, so it asks Mochify for a one-time upload link and either uploads the photo itself or hands you the link to drop it on. That original is kept in private storage, never publicly served, and deleted the moment processing starts, or after 15 minutes if it never does. The local server uses neither: the result is written straight to your disk. The full account is on our <a href="https://mochify.app/architecture" class={linkClass}>architecture page</a>.</p>
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 id="plans" class={h2Class}>Plans</h2>
        <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
            <li>Free account: 25 images a month, every tool except erase, recolor and the PDF-in operations</li>
            <li>Seller, Pro and Growth: the plan's monthly allowance, every tool, PDFs to 10 pages (Growth goes further)</li>
            <li>Day Pass: 100 uploads in 24 hours for $2, every tool, PDFs to 10 pages (used from an assistant on a free account you are signed in with)</li>
            <li>Each file you get back counts as one image, and each PDF you compress counts as one</li>
        </ul>
        <p class={pClass}>Monthly plans and limits are on the <a href="https://mochify.app/pricing" class={linkClass}>pricing page</a>.</p>
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 id="guides" class={h2Class}>Guides</h2>
        <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
            {#each guides as g}
                <li><a href={g.href} class={linkClass}>{g.title}</a> - {g.desc}</li>
            {/each}
        </ul>
    </section>

    <section class="mt-16 max-w-4xl mx-auto">
        <h2 id="faq" class="{h2Class} mb-4">Frequently asked questions</h2>
        <FaqAccordion {faqs} />
    </section>

</main>

<Footer />
</div>
