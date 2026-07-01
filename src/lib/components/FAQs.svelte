 <section class="mt-20 max-w-3xl mx-auto mb-20">
    <h3 class="text-xl font-bold text-center mb-10">
        Frequently Asked Questions
        <span class="block h-[5px] rounded-full bg-gradient-to-r from-[#F06292]/20 via-[#F06292] to-[#F06292]/20 mt-3 mx-auto max-w-[14rem]"></span>
    </h3>
    <div class="space-y-6">
        <details class="faq-item group bg-white border border-pink-50 rounded-2xl shadow-md hover:shadow-lg open:shadow-lg transition-all">
            <summary class="flex justify-between items-center font-semibold cursor-pointer list-none p-6 text-[#4A2C2C]">
                <span>How do I compress 20MB images online?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <div class="px-6 pb-6 text-base text-[#6C3F31] leading-relaxed space-y-3 opacity-90">
                Most tools limit you to 5MB. Mochify's C++ engine allows files up to 20MB each. Simply drag and drop your large PNGs or JPGs, and we'll reduce them by up to 90% without visible quality loss.
            </div>
        </details>

        <details class="faq-item group bg-white border border-pink-50 rounded-2xl shadow-md hover:shadow-lg open:shadow-lg transition-all">
            <summary class="flex justify-between items-center font-semibold cursor-pointer list-none p-6 text-[#4A2C2C]">
                <span>Is Jpegli better than MozJPEG?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <div class="px-6 pb-6 text-base text-[#6C3F31] leading-relaxed space-y-3 opacity-90">
                Yes. Jpegli is a new JPEG encoder based on JPEG XL technology. It typically offers 35% better compression ratios than MozJPEG at high quality settings, while remaining compatible with all browsers.
            </div>
        </details>

        <details class="faq-item group bg-white border border-pink-50 rounded-2xl shadow-md hover:shadow-lg open:shadow-lg transition-all">
            <summary class="flex justify-between items-center font-semibold cursor-pointer list-none p-6 text-[#4A2C2C]">
                <span>Is Mochify greener than other compressors?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <div class="px-6 pb-6 text-base text-[#6C3F31] leading-relaxed space-y-3 opacity-90">
                <p><strong>Yes - our C++ engine is more energy-efficient.</strong></p>

                <p>Compared with many Python-based compressors, native C++20 code typically completes the same work using fewer CPU cycles, which reduces server power consumption and associated CO₂ emissions.</p>

                <p><strong>Estimated impact</strong></p>
                <ul class="list-disc list-inside">
                    <li>~0.0005 kg CO₂ saved per image (UK grid estimate).</li>
                    <li>Smaller output files lower bandwidth-related energy across delivery networks.</li>
                </ul>

                <p class="italic">We're tracking aggregate site-wide savings — stay tuned for a live counter. Figures are based on published benchmarks; actual savings vary by workload.</p>
            </div>
        </details>

        <details class="faq-item group bg-white border border-pink-50 rounded-2xl shadow-md hover:shadow-lg open:shadow-lg transition-all">
            <summary class="flex justify-between items-center font-semibold cursor-pointer list-none p-6 text-[#4A2C2C]">
                <span>Is my data safe?</span>
                <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <div class="px-6 pb-6 text-base text-[#6C3F31] leading-relaxed space-y-3 opacity-90">
                Absolutely. Mochify uses a "RAM-only" pipeline. Your images are uploaded to memory, processed, and streamed back to you. They are never saved to a disk or database.
            </div>
        </details>
    </div>
</section>