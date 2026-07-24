<script lang="ts">
    import ProseDocument from '$lib/components/ProseDocument.svelte';
</script>

<svelte:head>
    <title>Sustainability - Mochify</title>
    <meta name="description" content="How Mochify keeps its footprint small: efficient compression, lean zero-retention infrastructure, native C++ processing, and renewably-powered hosting.">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mochify.app/sustainability">
    <meta property="og:title" content="Sustainability - Mochify">
    <meta property="og:description" content="How Mochify keeps its footprint small: efficient compression, lean zero-retention infrastructure, native C++ processing, and renewably-powered hosting.">
</svelte:head>

<ProseDocument title="Sustainability" eyebrow="Our footprint">
    <p>Mochify exists to make files smaller. Efficiency is not a marketing add-on for us; it is the entire product. Here is an honest account of what that means for our environmental footprint, and, just as importantly, what it does not.</p>

    <h2>Smaller files, less to move</h2>
    <p>Every image Mochify compresses is a file that takes less energy to send across the network and less power to load on someone's phone or laptop. A lighter page transfers fewer bytes on every visit, for as long as it stays online. Multiplied across thousands of images and millions of page views, that adds up to a real reduction in the data the web has to shift around. The most sustainable byte is the one you never had to send.</p>

    <h2>Efficient by architecture</h2>
    <p>Our image processing runs on <strong>Drogon</strong>, a high-performance C++ framework, rather than the interpreted runtimes that sit behind many image tools. Native compiled code does the same job using far less CPU time and memory per image, which means less energy burned for every file we optimise.</p>
    <p>Files are processed entirely in memory and discarded the moment the work is done. Nothing sits idle on a disk drawing power, waiting to be read again. A lean architecture is a lower-energy one.</p>

    <h2>Powered by renewable energy</h2>
    <p>Both halves of our stack run on renewable energy, and we name the providers so you can check for yourself rather than take our word for it:</p>
    <ul>
        <li>Our website and content delivery run on <strong>Cloudflare</strong>, which matches 100% of its global network's energy use with renewable electricity under the RE100 initiative. <a href="https://blog.cloudflare.com/cloudflare-committed-to-building-a-greener-internet/" target="_blank" rel="noopener noreferrer">Read Cloudflare's commitment</a>.</li>
        <li>Our backend image processing runs on <strong>netcup</strong>, which powers its data centres with renewable electricity, primarily hydropower. <a href="https://www.netcup.com/en/about-netcup/green-electricity-energy-efficiency" target="_blank" rel="noopener noreferrer">Read netcup's green electricity policy</a>.</li>
    </ul>

    <h2>What we do not claim</h2>
    <blockquote>
        <p>We are a small operation, and we would rather be precise than impressive. Mochify is not "carbon neutral", and we have not purchased offsets for our own footprint. What we can stand behind is straightforward: an efficient product that reduces data transfer, a lean architecture that wastes little compute, and hosting that runs on renewable energy. If we ever measure or offset our own emissions, we will say so here, with evidence.</p>
    </blockquote>
</ProseDocument>
