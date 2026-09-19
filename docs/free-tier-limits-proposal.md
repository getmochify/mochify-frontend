# Free tier, Day Pass and the revenue ceiling

Filename kept as `free-tier-limits-proposal.md` for continuity; the document outgrew that title.

Contents: sections 1 to 7 are the original free-tier limits proposal. Section 8 is the reframe once the objective turned out to be Day Pass sales. Sections 9 to 11 are the baseline numbers, why MRR plateaus, and what avoids it.

Status: **proposal only, nothing built.** Written 2026-09-10 from a discussion about whether tightening the free tier would lift paid conversions. Nothing in here is implemented. Numbers and file references are from the repo as it stands.

## 1. The proposal on the table

For **new** free accounts only:

- **5 conversions per day** instead of 25 per month, resetting on the calendar day (UTC), not a rolling 24 hours.
- **Free batch cap 3 to 5**, so the daily allowance and the batch size tell one story ("5 a day, 5 at a time") instead of two walls firing in the same session.
- **File size stays at 20MB.** The 10MB idea was dropped, see section 3.
- **Existing free accounts keep 25/month.** Grandfathered, not migrated.

## 2. Will it boost paid conversions? Honest read: a modest lift, mostly Day Pass

The case for it is sound in one respect: a limit that never binds converts nobody. At 25/month, 20MB and batch 3, the observation from the operator is that almost nobody reaches the count or size ceilings. So today those numbers are doing no conversion work at all, and 5/day would at least create the moment of decision.

But that same observation is the reason to be sceptical of a large lift:

- **If nobody hits the wall, the wall is not what is suppressing revenue.** Tightening it manufactures wall impressions that did not exist. That is a genuine change, but it is not fixing a bottleneck that was identified. It is creating one and hoping the response is payment rather than exit.
- **Sparse payments on SEO traffic is usually an intent problem.** The search terms that bring the traffic ("convert heic to jpg", "avif to jpg", "hif to jpg") are dominated by one-off consumer jobs. That visitor does not want a subscription at any limit. Walled, they leave: Preview, Paint, Squoosh and fifty other converters are one search away. No limit converts them.
- **Volume walls convert worse than capability walls.** A volume wall has a free workaround (wait a day, use another tool, make another account). A capability wall does not: 75MB files, batch 25, bucket delivery, the PDF tools, video, MCP/CLI/API. Someone blocked on capability has a need with no free substitute, which is why those blocks convert better per impression.
- **Infra is flat (about £20/month), so free usage is not a cost.** Spare capacity is profit either way. There is no margin argument for tightening, only a behavioural one, which makes it purely an empirical question.

Expected shape of the result, stated as a prediction so it can be checked later:

| Outcome              | Expectation                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Day Pass sales       | **Up, most of the lift.** $2 one-off is the only offer that matches one-off intent, and a daily cap creates exactly the "I need this finished today" moment. |
| Seller/Pro signups   | **Up slightly**, mostly pulling forward decisions from users with recurring need who would have converted later.                                             |
| Free signups         | **Down somewhat.** The tier is a worse offer, and it is the demo the guides and solutions pages rank on.                                                     |
| Bounce on tool pages | **Up**, concentrated on the photography pages whose files are largest.                                                                                       |
| Support load         | **Up a little**, from grandfathered vs new confusion ("my friend gets 25 a month").                                                                          |

Net: worth trying, but expect it to show up as $2 payments rather than subscriptions, and do not expect it to fix subscription conversion, which is a different problem (see section 6).

## 3. Why the 10MB size cut was dropped

Two reasons, one product and one structural.

**Product.** 10MB binds hardest on exactly the audience the best-ranking pages serve. HIF/HEIF files off a Fuji, Canon or Sony run 10-30MB, and camera JPEGs 8-25MB, while phone photos are 2-5MB. So a 10MB ceiling taxes the photographers arriving on `/solutions/hif-to-jpg` and `/solutions/heif-to-jpg` and leaves the marketplace persona untouched. Worse, it bites on the **first** file, before the product has demonstrated anything.

**Structural.** The free size gate is one compile-time constant applied to every unpaid caller, guests included:

- `mochify-core/utils/PlanLimits.h:16` - `kFreeSizeLimit = 20 * 1024 * 1024`
- `mochify-core/controllers/ImageController.cc:58` - gate keyed on `billing_type != "paid"`, with the 413 body hardcoding "Free tier is limited to 20 MB"

So "20MB for existing accounts, 10MB for new ones" cannot be expressed today. It needs a per-account limit threaded from `filters/TokenLimiter.cc:68` (which already has `plan` in hand) into that gate, plus the 413 copy de-hardcoded. Note core already carries a dormant `lite` plan with its own ceiling and task priority (`PlanLimits.h:17`, `ImageController.cc:64`, `:234`) that neither the frontend nor the worker uses. If a tier is ever added, that scaffold is the likely home.

If the size lever is wanted later: **15MB, accounts only, guests stay at 20MB.** That keeps the first-run demo intact. It does mean signing up lowers your file ceiling, which is awkward to explain, so it needs deciding rather than shipping.

## 4. What binds where today

| Tier               | Count        | Per file | Batch |
| ------------------ | ------------ | -------- | ----- |
| Guest (no account) | 3 / month    | 20MB     | 3     |
| Free account       | 25 / month   | 20MB     | 3     |
| Day Pass ($2)      | 100 / 24h    | 75MB     | 25    |
| Seller ($7.99/mo)  | 300 / month  | 75MB     | 25    |
| Pro ($24.99/mo)    | 1200 / month | 75MB     | 25    |

Sources: `src/lib/user.ts:6` (`GUEST_QUOTA`), `src/lib/components/ImageUpload.svelte:97-101` (size and batch constants), quota-per-plan in the same file's plan effect.

Note the size and batch columns are binary paid/unpaid: `maxFileSize` and `batchLimit` both branch on `userTier === 'pro'`, which is true for any paid plan including the Day Pass.

## 5. What it would take to build

**Blocker: none of this is measurable today.** No wall has an impression event. Every analytics call in `ImageUpload.svelte` fires on a click (`signup_cta_clicked`, `day_pass_cta_clicked`, `upgrade_cta_clicked`) or on a modal opened from the button path (`signup_cta_shown`, `upgrade_cta_shown`). The banners render silently, so there is no denominator and therefore no conversion rate, before or after. A limits change without that instrumentation cannot be read as a success or a failure.

Order of work:

1. **Wall-impression events** (frontend, small). One event per wall render, with wall kind and tier as properties. Useful on its own, and it is the before/after baseline. Do this first even if the rest is deferred.
2. **Backend tier** (`mochify-worker` + D1, small; core follow-on). A new plan value for daily-window free accounts. `profile.ops_limit` is already per-account and `quota_period_end` already exists, and the Day Pass already proves a sub-monthly window works, so this is mostly reseed cadence plus a plan value. Existing `free` profiles untouched.
3. **Frontend** (`ImageUpload.svelte`). `BATCH_LIMIT_STANDARD` 3 to 5; usage badge and banner copy from "this month" to "today"; quota read from the profile rather than the hardcoded ladder in the plan effect. Gate behind the plan value from step 2, since it reads wrong until that lands.
4. **Content sweep** (content-ops). See below.

**The copy is the expensive part, not the code.** "25 images a month" is asserted in **55 places across 31 files**: the homepage, four tool pages, two solution pages and 24 guides, several inside `FAQPage` schema where the visible text and the schema mirror both have to change. Under the house rules that is a Mode 6 sweep, not a UI edit.

Recommendation that avoids paying this twice: keep the number out of the content. Let the guides and tool pages say a free account gives you _more_, and put the actual figure only on `/pricing` and in the app's own usage badge, where it is read from the account. One place to change next time instead of 31.

## 6. Cheaper things to try first, given flat infra

1. **Instrument the walls.** Without this everything below is guesswork too.
2. **Cohort query.** What share of free accounts have ever hit 25/month, and what share of those ever paid? If the first number is near zero, the count limit is not the constraint and this whole proposal is aimed at the wrong thing. Answerable from D1 plus PostHog with no shipping.
3. **Lean on capability walls rather than volume.** 75MB, batch 25, bucket delivery, PDF tools, video, MCP/CLI/API. These have no free workaround, so they convert better per impression, and surfacing them costs nothing in goodwill.
4. **Day Pass as the one-off catch.** It is the only offer that fits the dominant traffic intent, it is now on the POST-only checkout, and it is the line item most likely to move under any of these changes. Worth making sure it is offered on every surface that walls a guest: today only `hif-to-jpg`, `heif-to-jpg` and `sdr-to-hdr` pass `showDayPass`.
5. **Persona pages over generic converters.** Recurring commercial need lives on `/ebay-seller`, `/vinted-seller` and the photographer workflow guides, not on "convert avif to jpg". Subscription pitches belong there.

## 7. Open questions for the operator

- Does the cohort data support the premise? If nobody hits 25/month, does the proposal still make sense as a way to create pressure rather than relieve it?
- 5/day or 3/day? 5 is recommended: both wall a batch user in the first session, but 3 also annoys the light repeat user who was never going to pay.
- Is the free tier's job acquisition (keep it generous, monetise capability) or qualification (keep it tight, monetise volume)? The answer decides this without needing any more analysis.
- Day Pass allowance is 100 ops / 24h at $2. If new free accounts get 5/day, the pass is 20 days of free-tier allowance for $2. That is intentional as a quasi-trial, but worth re-confirming at the new ratio.

## 8. Reframe (2026-09-10, same discussion): the goal is Day Pass, not subscriptions

The operator's actual objective: **catch high-intent one-off users with the Day Pass.** Subscribers are a separate segment, the people already using Mochify fully, and they largely convert on their own.

This changes two things above.

**The daily cap is well matched to this goal, unlike the subscription goal.** A monthly wall says "come back next month", so the user leaves and forgets. A daily wall says "tomorrow, or $2 now", and the pass is a 24-hour product. The wall and the offer share a time-shape, and $2 is priced at the impatience rather than at the volume. Section 2's scepticism was aimed at subscription lift and still stands for that; it does not apply to pass sales.

**But coverage is the binding constraint, not the limits.** Audited 2026-09-10:

- `/flow` and the homepage (`PromptFormApp.svelte`) offer the Day Pass **nowhere**. The only mention is a comment about image generation being Pro-only. The guest walls exist (`signup_cta_shown` / `upgrade_cta_shown` at `:883`, modals at `:3172`, `:3233`, `:3239`) and offer a free account or `/pricing` only. This is the standalone PWA and the main product surface, and a user hitting a wall mid-batch there is the highest-intent user on the site.
- Only **3 of 14** ImageUpload tool pages pass `showDayPass`: `solutions/hif-to-jpg`, `solutions/heif-to-jpg`, `solutions/sdr-to-hdr`. Not offered on `/avif-to-jpg`, `/heic-to-jpeg`, `/jpg-to-jpegxl`, `/avif-to-jpegxl`, `solutions/ebay-image-converter`, `solutions/bulk-ai-square-cropper`, both `remove-background-*`, all three `svg-to-*`, `solutions/png-to-jxl`.

So on most surfaces a walled high-intent user is offered only "create a free account", which is the lower-intent path, and on the main product surface nothing paid at all.

**Wall routing by shape**, once coverage exists:

| Wall                          | Primary      | Why                                                                                                                                                                           |
| ----------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Count (out of uploads)        | Free account | 25/month free beats 100/24h for $2 on pure volume. The pass belongs here as a clearly labelled "no account, no email, done now", which is its real edge, not as the headline. |
| File size (over 20MB)         | **Day Pass** | A free account does not lift the ceiling, so it is a false fix. Already the behaviour where enabled.                                                                          |
| Batch cap (over 3 files)      | **Day Pass** | Same: free stays at 3, the pass gives 25.                                                                                                                                     |
| Repeat wall hits across weeks | Subscription | Habit, not intent. A cohort worth targeting separately once impressions exist.                                                                                                |

**Revised order of work**

1. Coverage: `showDayPass` on the remaining tool pages, plus Day Pass CTAs in the two `PromptFormApp` wall modals (a `DayPassButton` drop-in, same pattern as `ImageUpload`). Pure upside, no limit change, no goodwill cost.
2. Wall routing per the table above.
3. Wall-impression events, to see which wall sells passes.
4. Then the 5/day cap, with the offer already visible everywhere it would push people.

Doing 4 before 1 manufactures walls on surfaces where the offer is not shown, which turns the wall into a bounce.

## 9. Baseline as of 2026-09-10

Recorded so later changes can be judged against something.

| Measure                         | Value                                                        |
| ------------------------------- | ------------------------------------------------------------ |
| Google Search Console, 3 months | 2.32k clicks, 46.3k impressions, 5% CTR, average position 11 |
| Current click rate              | roughly 60 to 70 per day, up about 10x over the quarter      |
| Free accounts                   | about 200, growing daily                                     |
| Subscribers                     | 3                                                            |
| Visitor to signup               | about 8.6% of organic clicks                                 |
| Free to paid                    | about 1.5%                                                   |
| Day Pass sales                  | rare                                                         |
| Infra cost                      | flat, about £20/month                                        |

**The 1.5% is a floor, not a measurement.** Every in-product Day Pass CTA was almost certainly never rendering. `showDayPass` has been opt-in since the feature shipped and only `hif-to-jpg`, `heif-to-jpg` and `sdr-to-hdr` opted in; all three are prerendered, and the gate until 2026-09-10 was `PUBLIC_POLAR_DAY_PASS_URL` stored as a Cloudflare **Secret**, which is runtime-only and never reaches the build. Measured live the same day: `/pricing` (SSR) carried the public env, `/solutions/hif-to-jpg` (prerendered) carried none. So the only human path to the pass checkout was the `/pricing` button. Fixed by moving the flag to a source constant (`src/lib/dayPass.ts`).

Two checks that confirm it, both in existing data: break `day_pass_cta_clicked` down by `trigger` (if `file_size_card`, `batch_cap_banner`, `token_wall_banner` and `button_click_file_size` are all near zero, confirmed); and watch Polar checkout creations after the POST-only change (a sharp fall with flat paid conversions means the previous "checkout activity", heavily developing-country and heavily declined, was card testing against the crawlable hosted link rather than demand).

## 10. Why MRR plateaus, in arithmetic

Revenue = traffic x conversion x ARPU. Each term has a different ceiling:

- **Traffic** is capped by intent quality, not volume. Converter searches are one-off consumer jobs.
- **Conversion** caps around 3% for that intent. It is 1.5% now and the CTAs were broken, so there is real room, but not an order of magnitude.
- **ARPU** is capped by the price list. Pro at $24.99 is the top public plan, so $10k MRR means roughly 400 to 800 paying subscribers drawn from one-off consumer traffic.

Four figures comes from doing more of the current thing: at a blended $12 and 3% conversion, about 2,800 accounts, which back-solves to roughly 32k cumulative clicks. On the current curve that is plausibly 10 to 14 months.

Five figures does not. At $12 blended it needs about 830 subscribers and roughly 320k cumulative clicks. At $50 blended it needs about 200 customers. **The gap between plateau and five figures is ARPU, not traffic.**

This is also why more work on free-tier limits and converter-page conversion cannot produce five figures: it optimises the capped terms. Executed well it moves hundreds to low thousands, which is worth having, and is where sections 1 to 8 top out.

## 11. What avoids the plateau

Ordered cheapest first.

**1. Sell something above $25. Most of it is already built.** The `growth` plan is threaded through the stack: plan union at `src/lib/user.ts:50`, 5000-op quota in `ImageUpload.svelte`, plan checks in `PromptFormApp.svelte:284` and `:415`, contact mirroring in `resendContacts.ts:31`, Pro-level task priority in `mochify-core/controllers/ImageController.cc:233`. What is missing is a Polar product (there is no `POLAR_PRODUCT_ID_GROWTH` in `wrangler.jsonc` `vars`) and a boolean (`showGrowth = false` on the pricing page). A sellable $49 to $99 usage tier is plan plumbing plus a pricing row, not new product work. Twenty customers there is several times current MRR.

**2. Point it at the buyer already in the codebase.** MCP server with real OAuth, CLI, API, bring-your-own-bucket. Agent workflows need image ops and token-cost reduction, and there is already a guide on exactly that. That buyer never arrives from "convert heic to jpg": they arrive from MCP registries, GitHub, npm and developer docs, where Mochify is currently absent. Free distribution, unexploited, and the largest single gap between here and five figures.

**3. One marketplace plugin, WordPress first.** Largest install base, the WP optimisation guides already rank, and a thin plugin calling the API turns a marketplace into a channel delivering business-shaped recurring users. A deliberate quarter, not a weekend: review process, maintenance, support.

**4. Day Pass to subscription expansion.** Two or more passes in 30 days is a recurring-need signal. One email with the pass value credited toward Seller. The email infrastructure and the `order.created` webhook that knows the buyer both exist.

**5. Make usage sticky.** Bucket delivery, API in CI, scheduled jobs: anything that makes Mochify part of a pipeline rather than a visit. Retention is what compounds MRR, and a converter someone visits twice a year cannot.

**Also, separately, the largest top-of-funnel lever:** average position 11 at 5% CTR. Moving pages that already rank from 11 to 5 takes CTR to roughly 15 to 20% on the same impressions, so 2.3k clicks becomes 7 to 9k with no new pages published. Internal linking, title and intent alignment on pages sitting at 8 to 15, and consolidating cannibalising pairs.

**Risk to accept if the ARPU path is taken:** business customers bring support expectations, SLA questions and invoicing requests. Polar as merchant of record covers tax and invoices; the emails do not cover themselves.
