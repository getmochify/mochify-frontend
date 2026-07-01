<script lang="ts">
    export let guides: Array<{ href: string; title: string; desc: string }> = [];
</script>

<section class="my-12">
    <h2 class="text-2xl font-black text-[#4A2C2C] mb-10">
        Related Guides
        <span class="block h-[5px] rounded-full bg-gradient-to-r from-[#F06292] to-[#F06292]/25 mt-3"></span>
    </h2>
    <ul class="space-y-3">
        {#each guides as g}
            <li>
                <a href={g.href} class="group flex items-center justify-between p-5 rounded-2xl bg-white border border-pink-50 shadow-sm hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                    <span class="text-[#6C3F31] font-bold group-hover:text-[#F06292] transition-colors">{g.title} <span class="font-normal opacity-70"> {g.desc}</span></span>
                    <svg class="w-4 h-4 text-pink-300 group-hover:text-[#F06292] group-hover:translate-x-1 transition-all shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                </a>
            </li>
        {/each}
    </ul>
</section>
