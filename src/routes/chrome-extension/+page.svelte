<script lang="ts">
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import FaqAccordion from '$lib/components/FaqAccordion.svelte';
    import { faqSchema, type FaqItem } from '$lib/faq';

    const STORE_URL = 'https://chromewebstore.google.com/detail/pgegchhkcjdcnnppeahkdcalclpaamcj';
    const REPO_URL = 'https://github.com/getmochify/mochify-chrome';

    const title = 'Mochify for Chrome - Convert Any Image in One Right-Click';
    const metaDescription =
        'Right-click any image and save it as JPG, WebP, AVIF, JPEG XL, PNG or PDF, or describe the edit you want. Free to start, open source, zero retention.';

    const faqs: FaqItem[] = [
        {
            q: 'Is the Mochify Chrome extension free?',
            a: 'Free to start. You get 3 images a month with no account and 25 a month with a free account. Paid plans use their normal allowance, and a $2 Day Pass works in the extension too. Each file you get back counts as one image.'
        },
        {
            q: 'Does it convert images on my computer?',
            a: 'No. The image travels over HTTPS to api.mochify.app, is processed in memory and is wiped as soon as the job finishes. Nothing is written to disk and nothing is used to train AI. Only video on the Mochify web app runs locally, and the extension does not handle video.'
        },
        {
            q: 'Why does it ask for access to all websites?',
            a: 'To fetch the image you right-click on whatever site you are on. A right-click image tool cannot know in advance which sites you will use it on. The extension sends nothing until you choose a format or press send, and the source code is public, so you can check what it does with that access.'
        },
        {
            q: 'Can I convert several images at once?',
            a: 'Not with the extension, which works on the image you right-click. For a batch, drop the files into the Mochify web app and describe the result once for all of them.'
        },
        {
            q: 'Which formats can it save to?',
            a: 'JPG, WebP, AVIF, JPEG XL and PNG, plus a one-page PDF of the image. The source can be any image Chrome shows you, including WebP, AVIF, HEIC and JPEG XL.'
        },
        {
            q: 'Can I save a web image as a PDF?',
            a: 'Yes. Choose Convert to, then PDF, and you get a one-page PDF of that image. This works on every plan, including Free.'
        },
        {
            q: 'Do I need a Mochify account?',
            a: 'No. Your first 3 images a month need no account. Sign in from the toolbar icon for 25 a month with a free account, or to use a paid plan or a Day Pass.'
        },
        {
            q: 'Can it save to Google Drive?',
            a: 'Yes, on the Seller, Pro and Growth plans. Switch on Save to Drive in the panel and results go to the Google Drive connected to your Mochify account instead of your Downloads folder.'
        },
        {
            q: 'Is the extension open source?',
            a: 'Yes, under the MIT license, at github.com/getmochify/mochify-chrome. It is a standard Manifest V3 extension with no build step, so what you read in the repository is what runs.'
        }
    ];

    const organization = { '@type': 'Organization', name: 'Mochify', url: 'https://mochify.app' };

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mochify.app' },
            { '@type': 'ListItem', position: 2, name: 'Chrome extension', item: 'https://mochify.app/chrome-extension' }
        ]
    };

    // No aggregateRating: the store listing has no ratings yet.
    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Mochify: Right-Click Image Converter & Compressor',
        description: metaDescription,
        url: 'https://mochify.app/chrome-extension',
        applicationCategory: 'BrowserApplication',
        operatingSystem: 'Chrome',
        downloadUrl: STORE_URL,
        license: 'https://opensource.org/licenses/MIT',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: organization
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema(faqs)
    };

    const prompts = [
        'Make it 1:1 square, remove the background, convert to AVIF',
        'Resize to 1200px wide',
        'Make the background white',
        'Convert to high quality WebP'
    ];

    const capabilities = [
        'Convert between JPG, WebP, AVIF, JPEG XL and PNG, or save the image as a one-page PDF',
        'Resize, crop (including a smart crop that keeps the subject in frame) and rotate',
        'Remove the background for a transparent PNG, or make the background white for a marketplace listing',
        'Adjust brightness and clarity',
        'Strip EXIF metadata, including GPS location',
        'Add an Ultra HDR gain map to a JPG for HDR displays',
        'Keep the encode lossless when you ask for it',
        'Add drop shadows and generated backgrounds (paid plans and the Day Pass)'
    ];

    const linkClass = 'font-bold text-[#F06292] hover:text-[#D81B60] transition-colors';
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
</svelte:head>

<div class="relative flex min-h-screen flex-col">
<Navigation />

<main class="relative z-10 max-w-5xl mx-auto px-4 pt-7 pb-12 sm:px-6 lg:px-8 w-full flex-grow">

    <div class="text-center mb-10 space-y-6">
        <div class="flex flex-wrap justify-center gap-3">
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F3F0FF] border border-[#DDD6FE] shadow-sm text-[#6D28D9] text-xs font-bold tracking-wide uppercase">
                Chrome Extension
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F0FDF4] border border-green-100 shadow-sm text-green-700 text-xs font-bold tracking-wide uppercase">
                Open Source
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFF5F7] border border-pink-100 shadow-sm text-[#F06292] text-xs font-bold tracking-wide uppercase">
                Zero Retention
            </span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-[#4A2C2C] tracking-tight">
            Convert any image in
            <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">one right-click</span>
        </h1>

        <p class="text-lg text-[#6C3F31] font-medium max-w-2xl mx-auto leading-relaxed">
            The Mochify Chrome extension adds two options to the right-click menu on every image you see on the web. Convert to gives you a one-click format change. Send to Mochify... lets you describe the edit you want in plain English. Either way, the result lands in your Downloads folder, or in Google Drive on a paid plan.
        </p>

        <div class="flex flex-wrap justify-center items-center gap-4">
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" class="px-7 py-3.5 rounded-2xl bg-mochi-pink hover:bg-[#E91E63] text-white font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Add to Chrome
            </a>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" class={linkClass}>
                Read the source on GitHub
            </a>
        </div>

        <p class="text-sm text-[#875F42] max-w-xl mx-auto leading-relaxed">
            Free to start: 3 images with no account, 25 a month with a free one. Open source under the MIT license. Processed in memory and wiped as soon as the job finishes.
        </p>
    </div>

    <div class="mb-16 max-w-4xl mx-auto">
        <img
            src="/img/chrome-extension/marquee-1400x560.webp"
            width="1400"
            height="560"
            fetchpriority="high"
            alt="The Mochify right-click menu open on a web image, with Convert to expanded to show JPG, WebP, AVIF, JPEG XL, PNG and PDF, and the Send to Mochify prompt panel beside it."
            class="w-full h-auto rounded-3xl shadow-sm border border-pink-50"
        />
    </div>

    <section class="mt-16 max-w-4xl mx-auto space-y-6">
        <h2 class="text-2xl font-bold text-[#4A2C2C]">Two ways to use it</h2>

        <div class="space-y-4">
            <h3 class="text-xl font-bold text-[#4A2C2C]">Convert to: one click, no typing</h3>
            <p class="leading-relaxed text-[#6C3F31]">Right-click an image, choose Convert to and pick a format: JPG, WebP, AVIF, JPEG XL or PNG, or a one-page PDF of the image. The format is the whole instruction, so nothing is parsed and nothing is asked. Quality stays on auto and nothing is resized. The file saves straight to your Downloads folder with the same name and the new extension.</p>
            <img
                src="/img/chrome-extension/store-01-convert-to-1280x800.webp"
                width="1280"
                height="800"
                loading="lazy"
                decoding="async"
                alt="Chrome's right-click menu on an image, with the Mochify entry expanded to show Send to Mochify and a Convert to submenu listing JPG, WebP, AVIF, JPEG XL, PNG and PDF."
                class="w-full h-auto rounded-2xl shadow-sm border border-pink-50"
            />
        </div>

        <div class="space-y-4 pt-4">
            <h3 class="text-xl font-bold text-[#4A2C2C]">Send to Mochify: describe the edit you want</h3>
            <p class="leading-relaxed text-[#6C3F31]">Need more than a format change? Choose Send to Mochify... and a small panel opens on the page. Type what you want in plain English:</p>
            <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
                {#each prompts as prompt}
                    <li>"{prompt}"</li>
                {/each}
            </ul>
            <p class="leading-relaxed text-[#6C3F31]">Magic Flow reads the request and does it in one pass. There are no settings panels and no quality sliders to work through. Ask for more than one output, for example "AVIF, WebP and JPG", and the files come back together in a zip.</p>
            <img
                src="/img/chrome-extension/store-02-magic-flow-1280x800.webp"
                width="1280"
                height="800"
                loading="lazy"
                decoding="async"
                alt="The Send to Mochify panel over a web page, with the prompt 'convert to high quality webp' typed in and a Save to Drive toggle switched on."
                class="w-full h-auto rounded-2xl shadow-sm border border-pink-50"
            />
        </div>
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 class="text-2xl font-bold text-[#4A2C2C]">What it can do</h2>
        <p class="leading-relaxed text-[#6C3F31]">Everything Magic Flow does on the web app, on the image you right-click:</p>
        <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
            {#each capabilities as item}
                <li>{item}</li>
            {/each}
        </ul>
        <p class="leading-relaxed text-[#6C3F31]">The extension works on one image at a time. For a batch, drop the files into the <a href="/flow" class={linkClass}>web app</a> and describe the result once for all of them.</p>
        <img
            src="/img/chrome-extension/store-03-background-removal-1280x800.webp"
            width="1280"
            height="800"
            loading="lazy"
            decoding="async"
            alt="Before and after: a photo of three drinks on a wooden table, and the same drinks cut out on a transparent background after the prompt 'remove the background'."
            class="w-full h-auto rounded-2xl shadow-sm border border-pink-50"
        />
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 class="text-2xl font-bold text-[#4A2C2C]">Save to Google Drive</h2>
        <p class="leading-relaxed text-[#6C3F31]">On the Seller, Pro and Growth plans, the panel gains a Save to Drive toggle. Switch it on and results from either path, Convert to or Send to Mochify, go to your Google Drive instead of your Downloads folder. The extension never talks to Google itself: it uses the Drive connection already on your Mochify account, so it asks for no Google permission of its own.</p>
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 class="text-2xl font-bold text-[#4A2C2C]">Free to start</h2>
        <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
            <li>3 images a month with no account at all</li>
            <li>25 images a month with a free account, no card needed</li>
            <li>Paid plans use their normal monthly allowance</li>
            <li>A $2 Day Pass (100 uploads in 24 hours) works in the extension too</li>
        </ul>
        <p class="leading-relaxed text-[#6C3F31]">Each file you get back counts as one image, so a prompt that asks for three formats uses three. When you reach the limit, the panel tells you and offers a free sign-in. Monthly plans are on the <a href="/pricing" class={linkClass}>pricing page</a>.</p>
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 class="text-2xl font-bold text-[#4A2C2C]">How your images are handled</h2>
        <p class="leading-relaxed text-[#6C3F31]">The image you right-click travels over HTTPS to api.mochify.app, is processed in memory and is wiped as soon as the job finishes. Nothing is written to disk, nothing containing your image is logged, and nothing is used to train AI. That is zero retention. It is not local processing, and we would rather tell you exactly which one it is. Prompt parsing and allowance checks go to id.mochify.app.</p>
        <p class="leading-relaxed text-[#6C3F31]">The extension asks for access to all websites because that is what lets it fetch the image you right-click on whichever site you are on. It also asks for the context menu, the active tab, scripting (to open the panel on the page) and storage (to remember your sign-in and your Save to Drive setting). It sends nothing until you choose a format or press send. The code is public under the MIT license at <a href={REPO_URL} target="_blank" rel="noopener noreferrer" class={linkClass}>github.com/getmochify/mochify-chrome</a>, so you can read exactly what it does with the access it asks for.</p>
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 class="text-2xl font-bold text-[#4A2C2C]">Install</h2>
        <ol class="list-decimal space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
            <li>Add it from the <a href={STORE_URL} target="_blank" rel="noopener noreferrer" class={linkClass}>Chrome Web Store</a>.</li>
            <li>Right-click any image on any web page.</li>
            <li>Choose Convert to and a format, or Send to Mochify... and describe what you want.</li>
            <li>Optional: click the Mochify icon in the toolbar and sign in for 25 images a month, or to use your paid plan.</li>
        </ol>
    </section>

    <section class="mt-16 max-w-4xl mx-auto space-y-4">
        <h2 class="text-2xl font-bold text-[#4A2C2C]">Guides</h2>
        <ul class="list-disc space-y-2 pl-6 text-[#6C3F31] leading-relaxed">
            <li><a href="/guides/save-webp-as-jpg-chrome" class={linkClass}>How to Save a WebP as JPG in Chrome: Every Route That Actually Works</a> - why Chrome hands you WebP, and the fastest ways out, extension or not.</li>
            <li><a href="/guides/save-image-as-type-alternative" class={linkClass}>Save Image as Type Is Gone: How to Replace It Safely</a> - what to check before you trust any right-click image extension, ours included.</li>
        </ul>
    </section>

    <section class="mt-16 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-[#4A2C2C] mb-4">Frequently asked questions</h2>
        <FaqAccordion {faqs} />
    </section>

</main>

<Footer />
</div>
