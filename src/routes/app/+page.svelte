<script lang="ts">
    import PromptForm from '$lib/components/PromptForm.svelte';
    import { authClient } from '$lib/auth-client';
    import { goto, invalidateAll } from '$app/navigation';
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
    <meta name="theme-color" content="#FDFBF7">
</svelte:head>

<div class="min-h-screen flex flex-col bg-[#FDFBF7]">

    <!-- Minimal app header -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-[#F0E8E0]">
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
    <main class="flex-1 flex flex-col items-center justify-start px-4 pt-8 pb-12">
        <PromptForm />
    </main>

</div>
