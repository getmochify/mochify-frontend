# Batch cap: keep the overflow as a waiting pile (parked)

**Status:** parked 2026-10-20, not started. Likely the same piece of work as the "drop-time pre-flight" already planned; fold the two together rather than build both.

**Context:** `ImageUpload.svelte` trims an oversized drop to the batch cap (3 on guest/free, 25 paid) and discards the rest. Baseline in `content-ops/reviews/2026-10-19-hif-to-jpg-batch-cap-baseline.md`: on `/solutions/hif-to-jpg`, 31% of sessions hit the cap (97% of cap hits sitewide), mean 52 files dropped (max 1,710), 547 of 553 guests, 42% never start a conversion, 0 purchases. Three copy changes shipped 2026-10-20 (`74b9b5d`, `76b0d6f`, `b258fc2`); this note is the behavior change that comes after them.

## The problem with the trim

The trim itself is right: staging 3 beats refusing the drop. The problem is that the overflow is **discarded**, so every route out of the box makes the visitor re-select files:

- A guest who buys a Day Pass has to find and drop the other 49 again after paying.
- A free account re-selects for every batch of 3.
- "Drop the next 3 after" is true but tedious.

Dropping the trim entirely (stage all 52) is worse: the convert button then implies 52 and the visitor learns mid-run that only 3 went through.

## Proposal: keep everything, convert the first batch, show the rest waiting

- **Tray splits in two.** First `batchLimit` files as normal cards; the rest as one compact **"+49 waiting"** card. No thumbnails for the pile (1,710 HIF previews would hurt; the count does the work).
- **Convert button names the batch:** "Convert 3 of 52".
- **After a batch finishes, the next fills from the pile.** Free and paid users just press Convert again.
- **A Day Pass bought mid-flow lifts the batch to 25 and pulls from the pile.** Nothing re-dropped; the step after paying is one click. This is the change most likely to move the 0 purchases.
- **For a guest out of uploads, the pile is the pitch:** "49 waiting" beside the Day Pass button says more than "Staging 3 of 52".

## Cautions

- **Hold `File` references only.** No reads, no previews, no decode for the pile. Token sufficiency must keep counting only the batch about to convert (it already does: `checkTokenLimit` runs after the cap).
- **The pile lives in the tab.** It survives Day Pass checkout only because checkout opens in a new tab (`startDayPassCheckout`). A reload or the **same-tab sign-up redirect** loses it, so a guest who signs up would still re-drop. Decide early whether that's acceptable or whether the pile needs persisting (IndexedDB handles, or at least a "you had 49 waiting" nudge after auth).
- **Paid users need it too** for drops over 25.

## The monthly-limit box has the same gap (fix in the same pass)

When a guest has fewer uploads left than files staged, `insufficientTokens` outranks the batch-cap box, so a guest dropping 20 with 0 left sees neither "Staging 3 of 20", the 100-upload Day Pass pitch, nor the Seller line. Instead:

- "0 of your 3 guest uploads remain this month, but 3 files are staged. A free account gives you 25 a month." with **Create free account** leading and the Day Pass as a small "or" link, plus a yellow "Create free account to convert 3 images" button.
- The code comment justifies free-account-first because "this user needs a handful more uploads". True for a 3-file drop, false for a 20-file one: a free account still means 7 batches of 3, re-selecting each time.
- Wording drift: this box says "100 **conversions** in 24h"; the batch-cap box and the ledger now say "uploads".
- The pink link-button and the yellow main button make the same offer twice.

Fix: branch the monthly-limit box on the size of the drop. Small drop, free account leads; large drop, Day Pass leads, with the same Seller line past 100.

## Measurement

The three copy changes started the 28-day window on 2026-10-20 (review due 2026-11-17). Shipping the pile inside that window means the read can't separate copy from behavior. At about 20 trimmed sessions a day, either let the copy run a week or two first and annotate the pile separately in PostHog, or accept that the 2026-11-17 review measures both together. Useful events once it ships: pile size at drop, batches run per session, Day Pass purchases with a non-empty pile, and files converted per oversized session (better than "completed", since finishing 3 of 52 is not success).
