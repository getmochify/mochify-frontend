<script>
    import { page } from '$app/stores';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Mochi from '$lib/components/Mochi.svelte';
</script>

<svelte:head>
    <title>Page Not Found | Mochify</title>
</svelte:head>

<!-- No background of its own: the body already paints #FDFBF7, and an opaque
     fill here would cover the layout's blush blobs. -->
<div class="min-h-screen flex flex-col relative overflow-hidden">
    

    <Navigation />

    <main class="relative z-10 flex-grow flex items-center justify-center w-full px-4 py-12">
        
        <div class="bg-white p-12 md:p-16 rounded-[3rem] border border-pink-50 shadow-sm text-center max-w-2xl mx-auto animate-fade-in-up">
            
            <div class="mb-6 flex flex-col items-center">
                <Mochi class="mb-4 w-36 md:w-44" />
                <span class="text-[#F06292] font-bold tracking-widest uppercase text-sm mb-2">Error {$page.status}</span>
                <h1 class="text-3xl md:text-5xl font-extrabold text-[#4A2C2C]">
                    Oops! squished it.
                </h1>
            </div>

            <p class="text-xl text-[#875F42] leading-relaxed mb-10 max-w-md mx-auto">
                We couldn't find the page you're looking for. It might have been compressed into oblivion (or just moved).
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F06292] hover:bg-[#ec407a] text-white font-black rounded-2xl shadow-lg hover:-translate-y-1 transition-all duration-300 no-underline">
                    Back to Optimizer
                </a>
                
                <a href="/guides" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFF0F3] hover:bg-[#FFE5EC] text-[#BE185D] font-bold rounded-2xl border border-pink-100 transition-all duration-300 no-underline">
                    Read Our Guides
                </a>
            </div>

        </div>
    </main>

    <div class="mt-20">
        <Footer />
    </div>

</div>

<style>
    /* Simple entrance animation */
    .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>