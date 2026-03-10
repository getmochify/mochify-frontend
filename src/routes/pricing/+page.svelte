<script lang="ts">
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
    <title>Pricing — Mochify</title>
    <meta name="description" content="Simple, transparent pricing. Start free with 100 operations per month — no account needed. Upgrade to Lite for 300 ops or Pro for 1,200 ops a month." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://mochify.xyz/pricing" />
    <meta property="og:title" content="Pricing — Mochify" />
    <meta property="og:description" content="Simple, transparent pricing. Start free with 100 operations per month — no account needed. Upgrade to Lite for 300 ops or Pro for 1,200 ops a month." />
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://mochify.xyz/pricing",
                "url": "https://mochify.xyz/pricing",
                "name": "Pricing — Mochify",
                "description": "Simple, transparent pricing. Start free with 100 operations per month — no account needed. Upgrade to Lite for 300 ops or Pro for 1,200 ops a month.",
                "isPartOf": { "@id": "https://mochify.xyz" }
            },
            {
                "@type": "SoftwareApplication",
                "name": "Mochify",
                "url": "https://mochify.xyz",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Any",
                "offers": [
                    {
                        "@type": "Offer",
                        "name": "Free",
                        "price": "0",
                        "priceCurrency": "USD",
                        "description": "100 image operations per month, no account required. Includes all formats, resize, rotate, crop, MCP and API access. Standard processing queue."
                    },
                    {
                        "@type": "Offer",
                        "name": "Lite — Monthly",
                        "price": "5.00",
                        "priceCurrency": "USD",
                        "priceSpecification": {
                            "@type": "UnitPriceSpecification",
                            "price": "5.00",
                            "priceCurrency": "USD",
                            "unitCode": "MON"
                        },
                        "description": "300 image operations per month. Includes all formats, resize, rotate, crop, background removal, MCP and API access. Up to 75MB per file. Priority processing queue."
                    },
                    {
                        "@type": "Offer",
                        "name": "Pro — Monthly",
                        "price": "12.00",
                        "priceCurrency": "USD",
                        "priceSpecification": {
                            "@type": "UnitPriceSpecification",
                            "price": "12.00",
                            "priceCurrency": "USD",
                            "unitCode": "MON"
                        },
                        "description": "1,200 image operations per month. Includes all formats, resize, rotate, crop, background removal, MCP and API access. Up to 75MB per file. Top priority processing queue."
                    },
                    {
                        "@type": "Offer",
                        "name": "Lite — Annual",
                        "price": "50.00",
                        "priceCurrency": "USD",
                        "priceSpecification": {
                            "@type": "UnitPriceSpecification",
                            "price": "50.00",
                            "priceCurrency": "USD",
                            "unitCode": "ANN"
                        },
                        "description": "300 image operations per month, billed annually at $50/year. Save 17% versus monthly. Includes background removal. Up to 75MB per file. Priority processing queue."
                    },
                    {
                        "@type": "Offer",
                        "name": "Pro — Annual",
                        "price": "120.00",
                        "priceCurrency": "USD",
                        "priceSpecification": {
                            "@type": "UnitPriceSpecification",
                            "price": "120.00",
                            "priceCurrency": "USD",
                            "unitCode": "ANN"
                        },
                        "description": "1,200 image operations per month, billed annually at $120/year. Save 17% versus monthly. Includes background removal. Up to 75MB per file. Top priority processing queue."
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What counts as an operation?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Each image processed — compressed, converted, resized, or any combination — counts as one operation. Batch uploads count one per file."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do free operations roll over?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Free tier resets every month. Lite and Pro operations reset monthly on your billing date and do not roll over."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can I use the API on the free tier?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes — all tiers have full MCP and API access. The same monthly limit applies."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can I cancel anytime?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. Cancel any time and you keep access until the end of your billing period."
                        }
                    }
                ]
            }
        ]
    }
    </script>
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 flex flex-col relative">
    <!-- Decorative background -->
    <div class="fixed inset-0 pointer-events-none opacity-30"
         style="background-image: radial-gradient(circle at 20% 20%, #F0629215 0%, transparent 50%), radial-gradient(circle at 80% 80%, #A5D6A715 0%, transparent 50%);">
    </div>

    <Navigation />

    <main class="relative z-10 flex-grow w-full max-w-5xl mx-auto px-4 py-12 md:py-20">

        <!-- Header -->
        <div class="text-center mb-14">
            <h1 class="text-4xl md:text-5xl font-black text-[#4A2C2C] tracking-tight mb-4">
                Simple,
                <span class="bg-gradient-to-r from-[#F06292] to-[#FF9EBB] bg-clip-text text-transparent">
                    honest
                </span>
                pricing
            </h1>
            <p class="text-[#6C3F31]/70 text-lg max-w-xl mx-auto">
                No subscriptions required to get started. Jump in free — upgrade when you need more.
            </p>
        </div>

        <!-- Pricing cards -->
        <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">

            <!-- Free tier -->
            <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-8 flex flex-col">
                <div class="mb-6">
                    <span class="inline-block px-3 py-1 rounded-full bg-[#FFF5F7] text-[#F06292] text-xs font-black uppercase tracking-wider mb-4">Free</span>
                    <div class="flex items-end gap-1">
                        <span class="text-5xl font-black text-[#4A2C2C]">$0</span>
                        <span class="text-[#6C3F31]/50 mb-2 text-sm">/ forever</span>
                    </div>
                    <p class="text-[#6C3F31]/60 text-sm mt-2">No account required. Just drag, drop, and go.</p>
                </div>

                <ul class="space-y-3 flex-grow mb-8">
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#A5D6A7] font-black">✓</span>
                        <span><strong>100 operations</strong> per month</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#A5D6A7] font-black">✓</span>
                        <span>All image formats — JPG, WEBP, AVIF, PNG, JXL, HEIC (upload)</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#A5D6A7] font-black">✓</span>
                        <span>Resize, rotate &amp; crop</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#A5D6A7] font-black">✓</span>
                        <span>MCP &amp; API access</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]/50">
                        <span class="mt-0.5 font-black">–</span>
                        <span>Standard processing queue</span>
                    </li>
                </ul>

                <a
                    href="/"
                    class="block text-center px-6 py-3 rounded-2xl border border-[#875F42]/15 text-sm font-black text-[#6C3F31] hover:border-[#F06292]/30 hover:text-[#F06292] hover:bg-[#FFF5F7] transition-all"
                >
                    Start for free
                </a>
            </div>

            <!-- Lite tier -->
            <div class="bg-white rounded-3xl border border-pink-100 shadow-sm p-8 flex flex-col">
                <div class="mb-6">
                    <span class="inline-block px-3 py-1 rounded-full bg-[#FFF5F7] text-[#F06292] text-xs font-black uppercase tracking-wider mb-4">Lite</span>
                    <div class="flex items-end gap-1">
                        <span class="text-5xl font-black text-[#4A2C2C]">$5</span>
                        <span class="text-[#6C3F31]/50 mb-2 text-sm">/ month</span>
                    </div>
                    <p class="text-[#6C3F31]/60 text-sm mt-1">
                        Or <strong class="text-[#6C3F31]">$50 / year</strong>
                        <span class="ml-1 inline-block px-2 py-0.5 rounded-full bg-[#A5D6A7]/30 text-[#3A6B3C] text-xs font-bold">Save 17%</span>
                    </p>
                </div>

                <ul class="space-y-3 flex-grow mb-8">
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#A5D6A7] font-black">✓</span>
                        <span><strong>300 operations</strong> per month</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#A5D6A7] font-black">✓</span>
                        <span>All image formats — JPG, WEBP, AVIF, PNG, JXL, HEIC (upload)</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#A5D6A7] font-black">✓</span>
                        <span><strong>75MB</strong> per file <span class="text-[#6C3F31]/50">(up from 20MB)</span></span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#A5D6A7] font-black">✓</span>
                        <span>Resize, rotate &amp; crop</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#A5D6A7] font-black">✓</span>
                        <span>Background removal</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#A5D6A7] font-black">✓</span>
                        <span>MCP &amp; API access</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#A5D6A7] font-black">✓</span>
                        <span><strong>Priority queue</strong> — ahead of free users</span>
                    </li>
                </ul>

                <a
                    href="/auth/login"
                    class="block text-center px-6 py-3 rounded-2xl border border-[#875F42]/15 text-sm font-black text-[#6C3F31] hover:border-[#F06292]/30 hover:text-[#F06292] hover:bg-[#FFF5F7] transition-all"
                >
                    Get Lite
                </a>
            </div>

            <!-- Pro tier -->
            <div class="bg-gradient-to-br from-[#FFF0F5] to-white rounded-3xl border border-[#F06292]/20 shadow-md p-8 flex flex-col relative overflow-hidden">
                <!-- Decorative blob -->
                <div class="absolute -top-6 -right-6 w-32 h-32 bg-[#F06292]/10 rounded-full blur-2xl pointer-events-none"></div>

                <div class="mb-6 relative">
                    <span class="inline-block px-3 py-1 rounded-full bg-[#F06292] text-white text-xs font-black uppercase tracking-wider mb-4">Pro</span>
                    <div class="flex items-end gap-1">
                        <span class="text-5xl font-black text-[#4A2C2C]">$12</span>
                        <span class="text-[#6C3F31]/50 mb-2 text-sm">/ month</span>
                    </div>
                    <p class="text-[#6C3F31]/60 text-sm mt-1">
                        Or <strong class="text-[#6C3F31]">$120 / year</strong>
                        <span class="ml-1 inline-block px-2 py-0.5 rounded-full bg-[#A5D6A7]/30 text-[#3A6B3C] text-xs font-bold">Save 17%</span>
                    </p>
                </div>

                <ul class="space-y-3 flex-grow mb-8">
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#F06292] font-black">✓</span>
                        <span><strong>1,200 operations</strong> per month</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#F06292] font-black">✓</span>
                        <span>All image formats — JPG, WEBP, AVIF, PNG, JXL, HEIC (upload)</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#F06292] font-black">✓</span>
                        <span><strong>75MB</strong> per file <span class="text-[#6C3F31]/50">(up from 20MB)</span></span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#F06292] font-black">✓</span>
                        <span>Resize, rotate &amp; crop</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#F06292] font-black">✓</span>
                        <span>Background removal</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#F06292] font-black">✓</span>
                        <span>MCP &amp; API access</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-[#6C3F31]">
                        <span class="mt-0.5 text-[#F06292] font-black">✓</span>
                        <span><strong>Top priority queue</strong> — ahead of everyone</span>
                    </li>
                </ul>

                <a
                    href="/auth/login"
                    class="block text-center px-6 py-3 rounded-2xl bg-[#F06292] text-white text-sm font-black hover:bg-[#E0527F] transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    Get Pro
                </a>
            </div>
        </div>

        <!-- Feature comparison table -->
        <div class="mt-16 max-w-4xl mx-auto">
            <h2 class="text-xl font-black text-[#4A2C2C] text-center mb-8">Full comparison</h2>

            <div class="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-pink-50">
                            <th class="text-left px-6 py-4 text-[#6C3F31]/50 font-medium w-2/5">Feature</th>
                            <th class="px-6 py-4 text-center font-black text-[#6C3F31]">Free</th>
                            <th class="px-6 py-4 text-center font-black text-[#6C3F31]">Lite</th>
                            <th class="px-6 py-4 text-center font-black text-[#F06292]">Pro</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-pink-50">
                        <tr>
                            <td class="px-6 py-4 text-[#6C3F31]">Monthly operations</td>
                            <td class="px-6 py-4 text-center text-[#6C3F31]">100 / month</td>
                            <td class="px-6 py-4 text-center text-[#6C3F31]">300 / month</td>
                            <td class="px-6 py-4 text-center text-[#6C3F31]">1,000 / month</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-[#6C3F31]">Account required</td>
                            <td class="px-6 py-4 text-center text-[#6C3F31]/60">No</td>
                            <td class="px-6 py-4 text-center text-[#6C3F31]/60">Yes</td>
                            <td class="px-6 py-4 text-center text-[#6C3F31]/60">Yes</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-[#6C3F31]">Max file size</td>
                            <td class="px-6 py-4 text-center text-[#6C3F31]">20MB</td>
                            <td class="px-6 py-4 text-center font-bold text-[#6C3F31]">75MB</td>
                            <td class="px-6 py-4 text-center font-bold text-[#6C3F31]">75MB</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-[#6C3F31]">JPG, WEBP, AVIF, PNG, JXL</td>
                            <td class="px-6 py-4 text-center text-[#A5D6A7] font-black">✓</td>
                            <td class="px-6 py-4 text-center text-[#A5D6A7] font-black">✓</td>
                            <td class="px-6 py-4 text-center text-[#F06292] font-black">✓</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-[#6C3F31]">HEIC upload</td>
                            <td class="px-6 py-4 text-center text-[#A5D6A7] font-black">✓</td>
                            <td class="px-6 py-4 text-center text-[#A5D6A7] font-black">✓</td>
                            <td class="px-6 py-4 text-center text-[#F06292] font-black">✓</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-[#6C3F31]">Resize, rotate &amp; crop</td>
                            <td class="px-6 py-4 text-center text-[#A5D6A7] font-black">✓</td>
                            <td class="px-6 py-4 text-center text-[#A5D6A7] font-black">✓</td>
                            <td class="px-6 py-4 text-center text-[#F06292] font-black">✓</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-[#6C3F31]">Background removal</td>
                            <td class="px-6 py-4 text-center text-[#6C3F31]/30 font-black">—</td>
                            <td class="px-6 py-4 text-center text-[#A5D6A7] font-black">✓</td>
                            <td class="px-6 py-4 text-center text-[#F06292] font-black">✓</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-[#6C3F31]">MCP &amp; API access</td>
                            <td class="px-6 py-4 text-center text-[#A5D6A7] font-black">✓</td>
                            <td class="px-6 py-4 text-center text-[#A5D6A7] font-black">✓</td>
                            <td class="px-6 py-4 text-center text-[#F06292] font-black">✓</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-[#6C3F31]">Processing queue</td>
                            <td class="px-6 py-4 text-center text-[#6C3F31]/50 text-xs">Standard</td>
                            <td class="px-6 py-4 text-center text-[#6C3F31] font-semibold text-xs">Priority</td>
                            <td class="px-6 py-4 text-center text-[#F06292] font-bold text-xs">Top priority</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- FAQ -->
        <div class="mt-16 max-w-2xl mx-auto">
            <h2 class="text-xl font-black text-[#4A2C2C] text-center mb-8">Common questions</h2>
            <div class="space-y-4">
                <details class="bg-white rounded-2xl border border-pink-100 shadow-sm group">
                    <summary class="px-6 py-4 cursor-pointer font-semibold text-[#4A2C2C] flex justify-between items-center select-none list-none">
                        What counts as an operation?
                        <span class="text-[#F06292] group-open:rotate-180 transition-transform text-lg font-black">↓</span>
                    </summary>
                    <p class="px-6 pb-5 text-sm text-[#6C3F31]/70 leading-relaxed">
                        Each image processed — compressed, converted, resized, or any combination — counts as one operation. Batch uploads count one per file.
                    </p>
                </details>

                <details class="bg-white rounded-2xl border border-pink-100 shadow-sm group">
                    <summary class="px-6 py-4 cursor-pointer font-semibold text-[#4A2C2C] flex justify-between items-center select-none list-none">
                        Do operations roll over?
                        <span class="text-[#F06292] group-open:rotate-180 transition-transform text-lg font-black">↓</span>
                    </summary>
                    <p class="px-6 pb-5 text-sm text-[#6C3F31]/70 leading-relaxed">
                        All tiers reset monthly. Free resets every calendar month; Lite and Pro reset on your billing date. Operations do not roll over.
                    </p>
                </details>

                <details class="bg-white rounded-2xl border border-pink-100 shadow-sm group">
                    <summary class="px-6 py-4 cursor-pointer font-semibold text-[#4A2C2C] flex justify-between items-center select-none list-none">
                        Can I use the API on the free tier?
                        <span class="text-[#F06292] group-open:rotate-180 transition-transform text-lg font-black">↓</span>
                    </summary>
                    <p class="px-6 pb-5 text-sm text-[#6C3F31]/70 leading-relaxed">
                        Yes — all tiers have full MCP and API access. The same monthly limit applies.
                    </p>
                </details>

                <details class="bg-white rounded-2xl border border-pink-100 shadow-sm group">
                    <summary class="px-6 py-4 cursor-pointer font-semibold text-[#4A2C2C] flex justify-between items-center select-none list-none">
                        Can I cancel anytime?
                        <span class="text-[#F06292] group-open:rotate-180 transition-transform text-lg font-black">↓</span>
                    </summary>
                    <p class="px-6 pb-5 text-sm text-[#6C3F31]/70 leading-relaxed">
                        Yes. Cancel any time and you keep access until the end of your billing period.
                    </p>
                </details>
            </div>
        </div>

    </main>

    <div class="mt-16 md:mt-24">
        <Footer />
    </div>
</div>
