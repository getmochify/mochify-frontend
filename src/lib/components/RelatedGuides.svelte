<script>
    /**
     * RelatedGuides — renders a grid of related article cards at the bottom of a guide.
     * @prop {Array<{href: string, title: string, desc: string}>} guides
     */
    export let guides = [];
</script>

<section class="my-12">
    <h2 class="text-2xl font-black text-[#4A2C2C] mb-6 flex items-center gap-3">
        <span class="w-1.5 h-8 bg-[#F06292] rounded-full inline-block"></span>
        Related Guides
    </h2>
    <div class="grid sm:grid-cols-2 gap-4">
        {#each guides as g}
            <a href={g.href} class="group block p-5 rounded-2xl bg-[#FFF5F7] border border-pink-100 hover:shadow-md hover:shadow-pink-100 hover:-translate-y-0.5 transition-all duration-300 no-underline">
                <h3 class="text-base font-black text-[#4A2C2C] group-hover:text-[#D81B60] transition-colors mb-2">{g.title} →</h3>
                <p class="text-sm text-[#6C3F31] leading-relaxed m-0">{g.desc}</p>
            </a>
        {/each}
    </div>
</section>
