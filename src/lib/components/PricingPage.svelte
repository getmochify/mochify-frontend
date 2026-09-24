<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DayPassButton from '$lib/components/DayPassButton.svelte';
	import { dayPassEnabled } from '$lib/dayPass';
	import {
		formatMonthlyEquivalent,
		formatPrice,
		savingsPercent,
		toMajorUnits,
		USD_PRICES
	} from '$lib/currency';
	import { EN_PRICING, type PricingStrings } from '$lib/i18n/pricing';
	import { faqSchema } from '$lib/faq';

	// One pricing page, two locales. The page copy lives in $lib/i18n/pricing,
	// so /pricing and /fr/pricing render this same markup rather than a fork —
	// the lesson CLAUDE.md records about PromptFormApp, which drifted the moment
	// there were two of it and made every change something you had to do twice.
	//
	// `locale` is passed to the price formatters as well as chosen the strings:
	// EUR formatted with the `en` locale reads "€7.99", and a French visitor
	// should be reading "7,99 €".
	let {
		data,
		strings = {},
		locale = 'en'
	}: {
		data: {
			pricing?: { currency?: string; prices?: Record<string, number> } | null;
			/** The page's language in the visitor's region, from the server load. */
			formatLocale?: string;
		};
		strings?: Partial<PricingStrings>;
		locale?: string;
	} = $props();

	// `locale` is the page's language and decides the copy, the schema's
	// inLanguage and the lang attribute. `formatLocale` is that language in the
	// visitor's own region and decides only how a price is written, because those
	// are different questions: every reader of /es/pricing gets the same Spanish,
	// but a Mexican reader writes $1,234.50 where Spain writes 1234,50 $. Falls
	// back to the page language, which is what this rendered before.
	const priceLocale = $derived(data.formatLocale ?? locale);

	const t: PricingStrings = $derived({ ...EN_PRICING, ...strings });

	let billing = $state<'monthly' | 'yearly'>('monthly');

	// USD_PRICES is the shared fallback every price surface renders from (see
	// $lib/currency); `data.pricing` overrides it when Polar holds prices in
	// the visitor's own currency (see +page.server.ts).
	const currency = $derived(data.pricing?.currency ?? 'usd');
	const amounts = $derived({ ...USD_PRICES, ...(data.pricing?.prices ?? {}) });

	// Reads the derived state above, so it stays reactive to the billing toggle.
	const price = (plan: string) => formatPrice(amounts[plan], currency, priceLocale);
	// One FAQ answer quotes the Day Pass price, so the set is built from it
	// rather than hardcoding a figure that a repricing would strand.
	const faqs = $derived(t.faqs(price('dayPass')));
	// Derived rather than a hardcoded "17%", so a local price that rounds to a
	// different discount can't leave a false claim next to it.
	const yearlySaving = $derived(savingsPercent(amounts.sellerMonthly, amounts.sellerYearly));
	const proYearlySaving = $derived(savingsPercent(amounts.proMonthly, amounts.proYearly));

	const growthYearlySaving = $derived(savingsPercent(amounts.growthMonthly, amounts.growthYearly));

	// The Monthly/Yearly toggle carries NO figure, on any of the five pricing
	// pages (handoff 2026-09-24 E2).
	//
	// It began as Seller's number presented as every tier's, which is false the
	// moment they diverge, and they do: Pro is 20% in EUR and 13% in GBP against
	// Seller's 17%. That was replaced by a derived "up to the best of the three",
	// accurate in every currency. Content-ops asked for the figure gone anyway,
	// across two handoffs, and it is their call: a toggle is a control, the
	// per-card badges are the claim, and each of those still shows its own exact
	// figure for the visitor's own currency.

	// Kill switch for the Growth tier, kept now that it is live: flipping this to
	// false pulls the card out of the grid without touching anything else. The
	// layout holds either way because Free lives in its own full-width card
	// below rather than in this grid.
	//
	// It does NOT gate the checkout route or the Polar webhook, so an in-flight
	// subscription keeps working if the card is ever hidden.
	const showGrowth = true;

	// Structured data. Built here, from `t`, rather than written out per route:
	// the FAQPage entries come from the same array the accordion renders, so a copy
	// edit cannot leave the crawler holding the previous answer. The English
	// block this replaces had already drifted that way in two answers.
	//
	// Offer prices come from the rendered `amounts`, so the schema quotes what the
	// visitor is shown. The old block was USD literals on a page that may render
	// GBP or EUR.
	const schemaCurrency = $derived(currency.toUpperCase());
	const bareAmount = (plan: string) => String(toMajorUnits(amounts[plan], currency));

	const offersLd = $derived(
		t.schemaOffers.map((offer) => ({
			'@type': 'Offer',
			name: offer.name,
			price: offer.plan ? bareAmount(offer.plan) : '0',
			priceCurrency: schemaCurrency,
			...(offer.unitCode && offer.plan
				? {
						priceSpecification: {
							'@type': 'UnitPriceSpecification',
							price: bareAmount(offer.plan),
							priceCurrency: schemaCurrency,
							unitCode: offer.unitCode
						}
					}
				: {}),
			description: offer.description(price)
		}))
	);

	const pageLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebPage',
					'@id': t.schemaUrl,
					url: t.schemaUrl,
					name: t.metaTitle,
					description: t.schemaDescription,
					inLanguage: locale,
					isPartOf: { '@id': 'https://mochify.app' }
				},
				{
					'@type': 'SoftwareApplication',
					name: 'Mochify',
					url: 'https://mochify.app',
					applicationCategory: 'MultimediaApplication',
					operatingSystem: 'Any',
					offers: offersLd
				},
				{
					'@type': 'FAQPage',
					inLanguage: locale,
					mainEntity: faqSchema(faqs)
				}
			]
		})
	);
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${pageLd}<\/script>`}
</svelte:head>

<div class="relative flex min-h-screen flex-col">
	<Navigation />

	<main class="relative z-10 mx-auto w-full max-w-5xl flex-grow px-4 py-12 md:py-20">
		<!-- Header -->
		<div class="mb-14 text-center">
			<!-- Eyebrow, not a heading. Visually this sits above the h1, but marking
                 it up as an h2 would put an h2 before the h1 in document order: screen
                 readers announce it first and the page's real heading reads as
                 subordinate to it. Same styling as ProseDocument's eyebrow. -->
			<p class="mb-3 text-xs font-bold tracking-[0.18em] text-[#F06292] uppercase">
				{t.eyebrow}
			</p>
			<h1 class="mb-4 text-4xl font-black tracking-tight text-[#4A2C2C] md:text-5xl">
				{t.h1Before}
				<span class="bg-gradient-to-r from-[#F06292] to-[#FF9EBB] bg-clip-text text-transparent">
					{t.h1Accent}
				</span>
				{t.h1After}
			</h1>
			<p class="mx-auto max-w-xl text-lg text-[#6C3F31]">
				{t.heroSub}
			</p>
			<!-- Surface list: this is the proof of the eyebrow's claim, so it reads
                 as a badge rather than fine print. Still deliberately one text node
                 rather than spans joined by separator elements: a styled separator
                 strands at the end of a line when the row wraps, which is the bug
                 just fixed in the footer. Plain text wraps like prose instead. -->
			<div class="mt-6 flex justify-center">
				<p
					class="inline-block rounded-2xl border border-pink-100 bg-[#FFF0F3]/70 px-5 py-2.5 text-sm font-black tracking-tight text-[#6C3F31] shadow-sm md:text-base"
				>
					{t.surfaces}
				</p>
			</div>
		</div>

		<!-- Billing toggle -->
		<div class="mb-10 flex items-center justify-center">
			<div class="inline-flex items-center gap-1 rounded-full bg-[#FFF0F5] p-1">
				<button
					type="button"
					onclick={() => (billing = 'monthly')}
					class="cursor-pointer rounded-full px-5 py-2 text-sm font-black transition-all {billing ===
					'monthly'
						? 'bg-white text-mochi-pink shadow-sm'
						: 'text-cocoa-deep/50 hover:text-cocoa-deep'}"
				>
					{t.billingMonthly}
				</button>
				<button
					type="button"
					onclick={() => (billing = 'yearly')}
					class="cursor-pointer rounded-full px-5 py-2 text-sm font-black transition-all {billing ===
					'yearly'
						? 'bg-white text-mochi-pink shadow-sm'
						: 'text-cocoa-deep/50 hover:text-cocoa-deep'}"
				>
					{t.billingYearly}
				</button>
			</div>
		</div>

		<!-- Pricing cards
             Deliberately thin: a full feature comparison table sits directly
             below, so each card carries only the differentiators someone scans
             for when choosing a tier (volume, file size, batch, queue, and the
             one or two headline capabilities). Everything ubiquitous across
             plans — formats, resize/crop/rotate, video, MCP/API — lives in the
             table instead of being repeated three times up here. -->
		<!-- Three SUBSCRIPTION tiers. Free is deliberately not among them: it is a
             top-of-funnel entry rather than a purchase decision, and giving it a
             column made the buyer compare four things when only three are for
             sale. It moves to a full-width card directly below, where it still
             reads first on mobile. max-w-5xl because three cards at max-w-4xl
             were already tight before Growth existed. -->
		<div class="mx-auto grid max-w-5xl items-start gap-6 md:grid-cols-3">
			<!-- Seller tier — flagged as the popular pick. Keeps the white card
                 so Pro's gradient still reads as the top tier; the badge and a
                 stronger border do the highlighting instead.
                 `order-first` on mobile only: stacked in one column, the middle
                 card is the one nobody scrolls to, so the recommended plan leads
                 and Free follows immediately after. DOM order stays Free, Seller,
                 Pro, which is the reading order at every width from md up. -->
			<div
				class="relative order-first flex flex-col rounded-3xl border-2 border-[#F06292]/30 bg-white p-8 shadow-md md:order-none"
			>
				<span
					class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#F06292] px-3 py-1 text-[10px] font-black tracking-wider whitespace-nowrap text-white uppercase shadow-sm"
				>
					{t.mostPopular}
				</span>
				<div class="mb-6">
					<span
						class="mb-4 inline-block rounded-full bg-[#FFF5F7] px-3 py-1 text-xs font-black tracking-wider text-[#F06292] uppercase"
						>Seller</span
					>
					<div class="flex items-end gap-1">
						<span class="text-4xl font-black text-[#4A2C2C]"
							>{billing === 'monthly' ? price('sellerMonthly') : price('sellerYearly')}</span
						>
						<span class="mb-2 text-sm text-[#6C3F31]/50"
							>{billing === 'monthly' ? t.perMonth : t.perYear}</span
						>
					</div>
					<p class="mt-1 text-sm text-[#7A4A38]">
						{#if billing === 'monthly'}
							{t.or}
							<strong class="text-cocoa-deep">{t.perYearInline(price('sellerYearly'))}</strong>
							<span
								class="ml-1 inline-block rounded-full bg-matcha-green/30 px-2 py-0.5 text-xs font-bold text-[#3A6B3C]"
								>{t.saveExact(yearlySaving)}</span
							>
						{:else}
							<span class="text-cocoa-deep/50"
								>{t.billedAnnually(
									formatMonthlyEquivalent(amounts.sellerYearly, currency, priceLocale)
								)}</span
							>
						{/if}
					</p>
				</div>

				<ul class="mb-8 flex-grow space-y-3">
					{#each t.sellerFeatures as feature}
						<li class="flex items-start gap-3 text-sm text-[#6C3F31]">
							<span class="mt-0.5 font-black text-[#A5D6A7]">✓</span>
							<span>{@html feature}</span>
						</li>
					{/each}
				</ul>

				<a
					href="/api/checkout?plan=seller&billing={billing}"
					data-sveltekit-reload
					class="block rounded-2xl bg-[#FBD5E2] px-6 py-3 text-center text-sm font-black text-[#AD1457] shadow-sm transition-all hover:bg-[#F8BBD0] hover:shadow-md active:scale-95"
				>
					{t.ctaSeller}
				</a>
			</div>

			<!-- Pro tier -->
			<div
				class="relative flex flex-col overflow-hidden rounded-3xl border border-[#F06292]/20 bg-gradient-to-br from-[#FFF0F5] to-white p-8 shadow-md"
			>
				<!-- Decorative blob -->
				<div
					class="pointer-events-none absolute -top-6 -right-6 h-32 w-32 rounded-full bg-[#F06292]/10 blur-2xl"
				></div>

				<div class="relative mb-6">
					<span
						class="mb-4 inline-block rounded-full bg-[#F06292] px-3 py-1 text-xs font-black tracking-wider text-white uppercase"
						>Pro</span
					>
					<div class="flex items-end gap-1">
						<span class="text-4xl font-black text-[#4A2C2C]"
							>{billing === 'monthly' ? price('proMonthly') : price('proYearly')}</span
						>
						<span class="mb-2 text-sm text-[#6C3F31]/50"
							>{billing === 'monthly' ? t.perMonth : t.perYear}</span
						>
					</div>
					<p class="mt-1 text-sm text-[#7A4A38]">
						{#if billing === 'monthly'}
							{t.or} <strong class="text-cocoa-deep">{t.perYearInline(price('proYearly'))}</strong>
							<span
								class="ml-1 inline-block rounded-full bg-matcha-green/30 px-2 py-0.5 text-xs font-bold text-[#3A6B3C]"
								>{t.saveExact(proYearlySaving)}</span
							>
						{:else}
							<span class="text-cocoa-deep/50"
								>{t.billedAnnually(
									formatMonthlyEquivalent(amounts.proYearly, currency, priceLocale)
								)}</span
							>
						{/if}
					</p>
				</div>

				<p class="relative mb-3 text-xs font-black tracking-wider text-[#6C3F31]/50 uppercase">
					{t.everythingInSeller}
				</p>

				<ul class="relative mb-8 flex-grow space-y-3">
					{#each t.proFeatures as feature}
						<li class="flex items-start gap-3 text-sm text-[#6C3F31]">
							<span class="mt-0.5 font-black text-[#F06292]">✓</span>
							<span>{@html feature}</span>
						</li>
					{/each}
				</ul>

				<a
					href="/api/checkout?plan=pro&billing={billing}"
					data-sveltekit-reload
					class="block rounded-2xl bg-[#F06292] px-6 py-3 text-center text-sm font-black text-white shadow-sm transition-all hover:bg-[#E0527F] hover:shadow-md active:scale-95"
				>
					{t.ctaPro}
				</a>
			</div>

			<!-- Growth — priced but not yet purchasable. Everything it claims is
                 already enforced in core/worker: PLAN_LIMITS.growth = 5000, and
                 the PDF page cap that stops every other paid plan at 10 pages
                 does not apply to it. Deliberately NOT claiming bucket/Drive,
                 gen-AI or priority queue: Pro has all three, so "Everything in
                 Pro, plus:" already covers them and repeating them would pad the
                 card with non-differentiators. -->
			{#if showGrowth}
				<div
					class="relative flex flex-col overflow-hidden rounded-3xl border border-[#F06292]/20 bg-white p-8 shadow-md"
				>
					<div class="mb-6">
						<div class="mb-4 flex items-center gap-2">
							<span
								class="inline-block rounded-full bg-[#FFF5F7] px-3 py-1 text-xs font-black tracking-wider text-[#F06292] uppercase"
								>Growth</span
							>
						</div>
						<div class="flex items-end gap-1">
							<span class="text-4xl font-black text-[#4A2C2C]"
								>{billing === 'monthly' ? price('growthMonthly') : price('growthYearly')}</span
							>
							<span class="mb-2 text-sm text-[#6C3F31]/50"
								>{billing === 'monthly' ? t.perMonth : t.perYear}</span
							>
						</div>
						<p class="mt-1 text-sm text-[#7A4A38]">
							{#if billing === 'monthly'}
								{t.or}
								<strong class="text-cocoa-deep">{t.perYearInline(price('growthYearly'))}</strong>
								<span
									class="ml-1 inline-block rounded-full bg-matcha-green/30 px-2 py-0.5 text-xs font-bold text-[#3A6B3C]"
									>{t.saveExact(growthYearlySaving)}</span
								>
							{:else}
								<strong class="text-cocoa-deep">{t.percentOff(growthYearlySaving)}</strong>
								{t.vsMonthly}
							{/if}
						</p>
					</div>

					<p class="mb-3 text-xs font-black tracking-wider text-[#6C3F31]/50 uppercase">
						{t.everythingInPro}
					</p>

					<ul class="mb-8 flex-grow space-y-3">
						{#each t.growthFeatures as feature}
							<li class="flex items-start gap-3 text-sm text-[#6C3F31]">
								<span class="mt-0.5 font-black text-[#F06292]">✓</span>
								<span>{@html feature}</span>
							</li>
						{/each}
					</ul>

					<a
						href="/api/checkout?plan=growth&billing={billing}"
						data-sveltekit-reload
						class="block rounded-2xl border border-[#F06292]/40 px-6 py-3 text-center text-sm font-black text-[#F06292] shadow-sm transition-all hover:bg-[#FFF5F7] hover:shadow-md active:scale-95"
					>
						{t.ctaGrowth}
					</a>
				</div>
			{/if}
		</div>

		<!-- Free — full width beneath the paid tiers. It keeps every feature it
             listed as a column, just laid out horizontally: the point of the
             move is to stop it competing for attention in the buying decision,
             not to hide what it includes. `md:` guards the row layout so it
             stacks normally on mobile, where it still appears directly after the
             three cards. -->
		<div class="mx-auto mt-6 max-w-5xl">
			<div
				class="flex flex-col gap-6 rounded-3xl border border-[#875F42]/15 bg-white p-6 shadow-sm sm:p-8 md:flex-row md:items-center"
			>
				<div class="flex-shrink-0 md:w-1/4">
					<span
						class="mb-3 inline-block rounded-full bg-[#F5F0E8] px-3 py-1 text-xs font-black tracking-wider text-[#6C3F31] uppercase"
						>Free</span
					>
					<div class="flex items-end gap-1">
						<span class="text-3xl font-black text-[#4A2C2C]"
							>{formatPrice(0, currency, priceLocale)}</span
						>
						<span class="mb-1 text-sm text-[#6C3F31]/50">{t.perForever}</span>
					</div>
				</div>

				<ul class="grid flex-grow gap-x-6 gap-y-3 sm:grid-cols-2">
					{#each t.freeFeatures as feature}
						<li class="flex items-start gap-3 text-sm text-[#6C3F31]">
							<span class="mt-0.5 font-black text-[#A5D6A7]">✓</span>
							<span>{@html feature}</span>
						</li>
					{/each}
				</ul>

				<div class="flex-shrink-0 md:w-1/5">
					<a
						href="/auth/register"
						class="block rounded-2xl border border-[#875F42]/25 px-6 py-3 text-center text-sm font-black text-[#6C3F31] transition-all hover:border-[#F06292]/40 hover:bg-[#FFF5F7] hover:text-[#F06292]"
					>
						{t.ctaFree}
					</a>
					<!-- Describes the no-account path, not the Free plan, so it
                         stays outside the feature list exactly as it did before. -->
					<p class="mt-3 text-center text-xs text-[#6C3F31]/50">
						{t.or}
						<a href={t.flowHref} class="font-semibold text-[#F06292] hover:underline"
							>{t.noSignupLink}</a
						>
					</p>
				</div>
			</div>
		</div>

		<!-- Privacy trust strip — applies to every plan, so it spans all tiers
             rather than repeating per card. Wording matches /privacy: uploads
             are processed in RAM and discarded; deliberately says nothing about
             the MCP processed-output exception documented there. -->
		<div class="mx-auto mt-8 max-w-4xl">
			<div
				class="flex items-center gap-4 rounded-3xl border border-pink-100 bg-[#FFF9FB] px-6 py-5 shadow-sm"
			>
				<span
					class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FFF0F5] text-[#F06292]"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-5 w-5"
						aria-hidden="true"
					>
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
						<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
					</svg>
				</span>
				<p class="text-sm leading-relaxed text-[#6C3F31]">
					<strong class="text-[#4A2C2C]">{t.privacyLead}</strong>
					{t.privacyBody}
					<a
						href={t.privacyHref}
						class="font-semibold whitespace-nowrap text-[#F06292] hover:underline">{t.learnMore}</a
					>
				</p>
			</div>
		</div>

		<!-- Day Pass · `day-pass` is the anchor the homepage ecommerce block links
             to; scroll-mt keeps the heading clear of the sticky nav on landing. -->
		{#if dayPassEnabled()}
			<div id="day-pass" class="mx-auto mt-8 max-w-4xl scroll-mt-24">
				<div class="mb-6 flex items-center gap-4">
					<div
						class="h-px flex-grow bg-gradient-to-r from-transparent via-pink-100 to-transparent"
					></div>
					<span
						class="text-xs font-bold tracking-widest whitespace-nowrap text-[#6C3F31]/40 uppercase"
						>{t.orNoSubscription}</span
					>
					<div
						class="h-px flex-grow bg-gradient-to-r from-transparent via-pink-100 to-transparent"
					></div>
				</div>

				<div
					class="flex flex-col gap-6 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center"
				>
					<div class="flex-shrink-0">
						<span
							class="mb-3 inline-block rounded-full bg-[#FFF5F7] px-3 py-1 text-xs font-black tracking-wider text-[#F06292] uppercase"
							>Day Pass</span
						>
						<div class="flex items-end gap-1">
							<span class="text-3xl font-black text-[#4A2C2C]">{price('dayPass')}</span>
							<span class="mb-1.5 text-sm text-[#6C3F31]/50">{t.oneTime}</span>
						</div>
					</div>

					<div class="flex-grow">
						<ul class="flex flex-wrap gap-x-6 gap-y-2">
							{#each t.dayPassFeatures as feature}
								<li class="flex items-center gap-2 text-sm text-[#6C3F31]">
									<span class="font-black text-[#A5D6A7]">✓</span>
									<span>{@html feature}</span>
								</li>
							{/each}
						</ul>
					</div>

					<div class="flex flex-shrink-0 flex-col items-start gap-1.5 sm:items-end">
						<!-- Buyers land back on the homepage so ImageUpload's
                         day_pass_success toast (magic-link instructions) is shown. -->
						<DayPassButton
							trigger="pricing_page"
							next="/"
							class="block rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-6 py-3 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
						>
							{t.ctaDayPass(price('dayPass'))}
						</DayPassButton>
					</div>
				</div>
			</div>
		{/if}

		<!-- Feature comparison table -->
		<div class="mx-auto mt-16 max-w-4xl">
			<h2 class="mb-8 text-center text-xl font-black text-[#4A2C2C]">{t.fullComparison}</h2>

			<div class="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-pink-50">
								<th class="w-2/5 px-6 py-4 text-left font-medium text-[#6C3F31]/50"
									>{t.tblFeature}</th
								>
								<th class="px-6 py-4 text-center font-black text-[#6C3F31]">Free</th>
								<th class="px-6 py-4 text-center font-black text-[#6C3F31]">Seller</th>
								<th class="px-6 py-4 text-center font-black text-[#F06292]">Pro</th>
								<th class="px-6 py-4 text-center font-black text-[#F06292]">Growth</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-pink-50">
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">{t.tblMonthlyImages}</td>
								<td class="px-6 py-4 text-center text-[#6C3F31]">{t.tblPerMonth(25)}</td>
								<td class="px-6 py-4 text-center text-[#6C3F31]">{t.tblPerMonth(300)}</td>
								<td class="px-6 py-4 text-center text-[#6C3F31]">{t.tblPerMonth(1200)}</td>
								<td class="px-6 py-4 text-center text-xs text-[#6C3F31]/50"
									>{t.tblPerMonth(5000)}</td
								>
							</tr>
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">{t.tblMaxFileSize}</td>
								<td class="px-6 py-4 text-center text-[#6C3F31]">{t.tblSizeFree}</td>
								<td class="px-6 py-4 text-center font-bold text-[#6C3F31]">{t.tblSizePaid}</td>
								<td class="px-6 py-4 text-center font-bold text-[#6C3F31]">{t.tblSizePaid}</td>
								<td class="px-6 py-4 text-center text-xs text-[#6C3F31]/50">{t.tblSizePaid}</td>
							</tr>
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">JPG, WEBP, AVIF, PNG, JXL</td>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
							</tr>
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">{t.tblHeicUpload}</td>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
							</tr>
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">{t.tblResizeRotateCrop}</td>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
							</tr>
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">{t.tblBackgroundRemoval}</td>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
							</tr>
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">{t.tblAiBackgrounds}</td>
								<td class="px-6 py-4 text-center font-black text-[#6C3F31]/30"
									>{t.tblNotIncluded}</td
								>
								<td
									class="px-6 py-4 text-center text-[11px] font-bold tracking-wide text-[#F06292]/70 uppercase"
									>{t.tblSoon}</td
								>
								<td
									class="px-6 py-4 text-center text-[11px] font-bold tracking-wide text-[#F06292]/70 uppercase"
									>{t.tblSoon}</td
								>
								<td class="px-6 py-4 text-center text-xs text-[#6C3F31]/50">{t.tblSoon}</td>
							</tr>
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">{t.tblMcpApi}</td>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
							</tr>
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">{t.tblBatchUpload}</td>
								<td class="px-6 py-4 text-center text-xs text-[#6C3F31]/50">{t.tblFiles(3)}</td>
								<td class="px-6 py-4 text-center text-xs font-semibold text-[#6C3F31]"
									>{t.tblFiles(25)}</td
								>
								<td class="px-6 py-4 text-center text-xs font-bold text-[#F06292]"
									>{t.tblFiles(25)}</td
								>
								<td class="px-6 py-4 text-center text-xs text-[#6C3F31]/50">{t.tblFiles(25)}</td>
							</tr>
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">{@html t.tblPdfTools}</td>
								<td class="px-6 py-4 text-center text-xs text-[#6C3F31]/50">{t.tblPdfFree}</td>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
								<td class="px-6 py-4 text-center text-xs text-[#6C3F31]/50">{t.tblPdfUnlimited}</td>
							</tr>
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">{@html t.tblOwnStorage}</td>
								<td class="px-6 py-4 text-center font-black text-[#6C3F31]/30"
									>{t.tblNotIncluded}</td
								>
								<td class="px-6 py-4 text-center font-black text-[#A5D6A7]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
								<td class="px-6 py-4 text-center font-black text-[#F06292]">✓</td>
							</tr>
							<tr>
								<td class="px-6 py-4 text-[#6C3F31]">{t.tblQueue}</td>
								<td class="px-6 py-4 text-center text-xs text-[#6C3F31]/50">{t.tblQueueStandard}</td
								>
								<td class="px-6 py-4 text-center text-xs font-semibold text-[#6C3F31]"
									>{t.tblQueuePriority}</td
								>
								<td class="px-6 py-4 text-center text-xs font-bold text-[#F06292]"
									>{t.tblQueueTop}</td
								>
								<td class="px-6 py-4 text-center text-xs text-[#6C3F31]/50">{t.tblQueueTop}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- FAQ · same one-card, hairline-divided treatment as the homepage FAQ.
             Six separate shadowed pills read as a stack of buttons rather than a
             reference list. -->
		<div class="mx-auto mt-16 max-w-3xl">
			<h2
				class="mb-3 text-center font-heading text-3xl leading-[1.1] font-black text-[#4A2C2C] md:text-[2.5rem]"
			>
				{t.faqHeading}
			</h2>
			<p class="mb-8 text-center text-[#875F42]">{t.faqSub}</p>
			<div
				class="divide-y divide-pink-100 overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm"
			>
				{#each faqs as faq}
					<details class="group transition-colors open:bg-[#FFFAFB]">
						<summary
							class="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-bold text-[#4A2C2C] transition-colors select-none hover:text-[#D81B60]"
						>
							{faq.q}
							<svg
								class="h-5 w-5 shrink-0 text-[#F06292] transition-transform duration-200 group-open:rotate-180"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								viewBox="0 0 24 24"
								aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg
							>
						</summary>
						<p class="-mt-1 px-6 pb-5 text-sm leading-relaxed text-[#6C3F31]">
							{@html faq.a}
						</p>
					</details>
				{/each}
			</div>
		</div>

		<!-- Closing CTA · blush card, mirrors the homepage's final CTA so the two
             pages end on the same note. -->
		<div class="mx-auto mt-14 max-w-3xl md:mt-16">
			<div
				class="rounded-3xl border border-pink-100 bg-gradient-to-b from-[#FFF0F3]/70 to-white px-6 py-10 text-center shadow-sm md:px-12 md:py-12"
			>
				<h2 class="mb-3 font-heading text-2xl leading-[1.15] font-black text-[#4A2C2C] md:text-3xl">
					{t.ctaHeading}
				</h2>
				<p class="mx-auto mb-8 max-w-md leading-relaxed text-[#6C3F31]">
					{t.ctaBody}
				</p>
				<div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
					<a
						href="/auth/register"
						class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F06292] px-7 py-4 font-black text-white no-underline shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#D81B60] sm:w-auto"
					>
						{t.ctaCreateAccount}
					</a>
					<a
						href="/flow"
						class="inline-flex w-full items-center justify-center rounded-2xl border border-[#875F42]/25 px-7 py-4 font-black text-[#6C3F31] no-underline transition-all hover:border-[#F06292]/40 hover:bg-[#FFF5F7] hover:text-[#F06292] sm:w-auto"
					>
						{t.ctaTryFree}
					</a>
				</div>
				<p class="mt-6 text-xs text-[#6C3F31]/60">
					{t.ctaContactBefore}
					<a href="mailto:hello@mochify.app" class="font-semibold text-[#F06292] hover:underline"
						>hello@mochify.app</a
					>{t.ctaContactAfter}
				</p>
			</div>
		</div>
	</main>

	<div class="mt-16 md:mt-24">
		<Footer />
	</div>
</div>
