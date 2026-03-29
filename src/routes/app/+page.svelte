<script lang="ts">
    import PromptForm from '$lib/components/PromptForm.svelte';
    import { authClient } from '$lib/auth-client';
    import { invalidateAll } from '$app/navigation';
    import { page } from '$app/state';

    const sessionStore = authClient.useSession();
    let session = $derived($sessionStore.data?.session ?? page.data.session ?? null);
    let user = $derived($sessionStore.data?.user ?? page.data.user ?? null);
    let initials = $derived(user?.email?.slice(0, 1).toUpperCase() ?? '');

    async function signOut() {
        await authClient.signOut();
        await invalidateAll();
    }
</script>

<svelte:head>
    <title>Mochify</title>
    <meta name="robots" content="noindex">
</svelte:head>

<div class="min-h-screen flex flex-col bg-[#FDFBF7] relative">

    <!-- Decorative background -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden opacity-30" aria-hidden="true">
        <div class="animate-float absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-pink-200/20 blur-[80px]"></div>
        <div class="animate-float-slow absolute -bottom-56 -left-40 w-[600px] h-[600px] rounded-full bg-rose-100/15 blur-[100px]"></div>
        <div class="animate-float absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-pink-50/20 blur-[70px]"></div>
    </div>

    <!-- Minimal app header -->
    <header class="relative z-10 flex items-center justify-between px-4 py-3 border-b border-[#F0E8E0]">
        <a href="/" class="flex items-center gap-2">
            <div class="w-7 h-7 bg-[#F06292] rounded-lg flex items-center justify-center shadow-sm">
                <span class="text-white font-black text-lg leading-none">M</span>
            </div>
            <span class="text-lg font-black text-[#4A2C2C] tracking-tight">Mochify</span>
        </a>

        <div class="flex items-center gap-3">
            {#if session}
                <a href="/dashboard" class="text-xs font-semibold text-[#875F42] hover:text-[#F06292] transition-colors">
                    {initials} · Dashboard
                </a>
                <button
                    onclick={signOut}
                    class="text-xs font-semibold text-[#875F42]/60 hover:text-[#F06292] transition-colors cursor-pointer"
                >
                    Sign out
                </button>
            {:else}
                <a href="/auth/login" class="text-xs font-semibold text-[#6C3F31] hover:text-[#F06292] transition-colors">
                    Sign in
                </a>
                <a href="/auth/register" class="px-3 py-1.5 rounded-xl bg-[#F06292] text-white text-xs font-bold shadow-sm hover:bg-[#E91E63] transition-colors">
                    Sign up free
                </a>
            {/if}
        </div>
    </header>

    <!-- Tool -->
    <main class="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div class="text-center mb-8">
            <h1 class="text-5xl font-black text-[#4A2C2C] leading-tight tracking-tight mb-2">Mochify</h1>
            <p class="text-xs font-semibold tracking-widest uppercase text-[#F06292]/70">AI-POWERED IMAGE WORKFLOWS</p>
        </div>
        <PromptForm />
    </main>

</div>
