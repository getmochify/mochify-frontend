<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
</script>

<svelte:head>
    <title>About Mochify</title>
    <meta name="description" content="Learn more about Mochify, our mission, and how we prioritize privacy and performance in image optimization.">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mochify.app/about">
    <meta property="og:title" content="About Mochify">
    <meta property="og:description" content="Learn more about Mochify, our mission, and how we prioritize privacy and performance in image optimization.">
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 flex flex-col relative">
    
    <div class="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjgiIGZpbGw9InJnYmEoMjU1LDI0MCwyNDMsMC4zKSIvPjwvZz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>

    <Navigation />
    <main class="relative z-10 flex-grow w-full max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <header class="text-center mb-16">
            <div class="flex flex-col items-center gap-2 mb-4">
                <h1 class="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#FFB3C6] via-[#E0ACD5] to-[#C5A3E0] bg-clip-text text-transparent leading-tight text-center drop-shadow-sm pb-2 mb-16">
					About Mochify
				</h1>
            </div>
        </header>

        <article class="prose prose-p:leading-relaxed prose-li:leading-relaxed max-w-none prose-headings:text-[var(--cocoa-deep)] prose-p:text-[var(--cocoa-milk)] prose-li:text-[var(--cocoa-milk)] prose-strong:text-[var(--cocoa-deep)]">
            <h2 class="text-3xl font-black text-[#4A2C2C] mb-6">The Future of Image Optimization</h2>
            <p class="text-xl text-[#875F42] leading-relaxed mb-12 font-medium">Mochify was founded in 2026 to solve the growing tension between website performance and data privacy. As the web moves toward stricter privacy standards and faster loading requirements, we provide a streamlined alternative to heavy plugins and invasive tracking.</p>
            <p class="text-base text-[#6C3F31] leading-relaxed">Our mission is to empower creators and e-commerce businesses with professional-grade compression that respects both the user and the end-consumer.</p>

            <hr />

            <h2>Privacy-First Architecture</h2>
            <p>Unlike many competitors that store images on their servers for hours or use them for AI training, Mochify uses a unique in-memory, zero-retention processing model.</p>
            <ul>
                <li><strong>Instant Discard:</strong> Your images are processed in the server's RAM and discarded immediately after the task is finished.</li>
                <li><strong>No Disk Storage:</strong> We never write your original or optimized files to a hard drive, ensuring a truly ephemeral experience.</li>
                <li><strong>Data Integrity:</strong> We do not track users or build profiles; our focus is purely on technical performance and file efficiency.</li>
            </ul>

            <h2>Built for High-Performance Teams</h2>
            <p>We understand that for e-commerce merchants on Shopify and Etsy, every millisecond of load time translates directly to revenue. Mochify is designed to deliver maximum compression for modern formats like WebP and AVIF while maintaining the visual fidelity required for high-end product photography. By offering a "no-plugin" workflow, we help WordPress and WooCommerce users maintain a clean, fast backend without unnecessary database bloat.</p>

            <h2>Our Technical Commitment</h2>
            <p>We prioritize sustainable, high-value tools over the "race to the bottom" of low-quality free services. By managing our own infrastructure with a focus on CPU and RAM efficiency, we ensure that every byte compressed on Mochify meets the highest standards of the 2026 web. Whether you are a solo creator or a growing digital agency, Mochify is your partner in building a faster, more private internet.</p>
        </article>

    </main>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>
</div>

<style>
    hr {
        border: none;
        height: 1px;
        background: linear-gradient(to right, transparent, #FFE5EC, transparent);
        margin: 4rem 0;
    }
</style>