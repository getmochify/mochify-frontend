<script lang="ts">
    import ProseDocument from '$lib/components/ProseDocument.svelte';
</script>

<svelte:head>
    <title>About Mochify</title>
    <meta name="description" content="Learn more about Mochify, our mission, and how we prioritize privacy and performance in image optimization.">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mochify.app/about">
    <meta property="og:title" content="About Mochify">
    <meta property="og:description" content="Learn more about Mochify, our mission, and how we prioritize privacy and performance in image optimization.">
</svelte:head>

<ProseDocument title="About Mochify" eyebrow="About">
    <h2>The Future of Image Optimization</h2>
    <p>Mochify was founded in 2026 to solve the growing tension between website performance and data privacy. As the web moves toward stricter privacy standards and faster loading requirements, we provide a streamlined alternative to heavy plugins and invasive tracking.</p>
    <p>Our mission is to empower creators and e-commerce businesses with professional-grade compression that respects both the user and the end-consumer.</p>

    <hr />

    <h2>Privacy-First Architecture</h2>
    <p>Unlike many competitors that store images on their servers for hours or use them for AI training, Mochify uses an in-memory, zero-retention processing model. Your images are processed in RAM and discarded when the request ends. We never write your originals or optimized files to a disk, and we never use them to train anything.</p>
    <p>That is a claim worth checking rather than taking on trust, so we publish the details: how the processing container is configured, what happens to large uploads, and what we do record. See <a href="/architecture">architecture and data handling</a>.</p>

    <h2>Built for High-Performance Teams</h2>
    <p>We understand that for e-commerce merchants on Shopify and Etsy, every millisecond of load time translates directly to revenue. Mochify is designed to deliver maximum compression for modern formats like WebP and AVIF while maintaining the visual fidelity required for high-end product photography. By offering a "no-plugin" workflow, we help WordPress and WooCommerce users maintain a clean, fast backend without unnecessary database bloat.</p>

    <h2>Our Technical Commitment</h2>
    <p>We prioritize sustainable, high-value tools over the "race to the bottom" of low-quality free services. By managing our own infrastructure with a focus on CPU and RAM efficiency, we ensure that every byte compressed on Mochify meets the highest standards of the 2026 web. Whether you are a solo creator or a growing digital agency, Mochify is your partner in building a faster, more private internet.</p>
</ProseDocument>
