# Generative Magic Flow — Design & Pricing

**Status:** Planning (June 2026). No runtime changes yet — this is the design of
record to turn into tickets.

**Goal:** extend Magic Flow from `upload → convert/resize` to
`upload → generate → convert/resize`, driven by the same natural-language prompt.
A user can say *"put it on a sunny beach, add a soft shadow, then webp and avif at
500px"* and get a generated, composited, optimised result in one flow.

---

## 1. Pipeline — a "generate" stage between parse and squish

```
upload → parse (Mistral, /v1/prompt)
       → [if generate] generate stage      ← NEW (once per source image)
       → [optional preview / accept]
       → squish (convert/resize fan-out)    ← unchanged, runs on the generated result
```

Properties that keep this clean:

- **Generate runs once per source; squish fans out.** A multi-format/multi-size
  request = 1 generate call + N cheap encodes. Gen cost scales with *source images*,
  not outputs.
- **Files with no `generate` field skip the stage entirely** — zero change to the
  current path.
- Mirrors the existing `mode: 'imgpdf'` pattern (new capability, same shape).

---

## 2. NLP schema change — the `generate` flag

✅ **Implemented in the worker (June 2026)** — schema + system-prompt rules + a
server-side mutual-exclusivity guard. `edit` is **deferred** (see §8), so the live
`kind` enum is `background | shadow` only. Mistral **authors a model-ready prompt** —
it never generates an image.

```jsonc
generate: {                                    // omitted when no generative intent
  kind: "background" | "shadow",               // ("edit" deferred to a later phase)
  prompt: string                               // LLM-authored, model-ready (omitted for shadow)
}
```

Rules baked into `NLP_SYSTEM_PROMPT`:
- **Orthogonal to optimisation** — still emit `type`/`sizes`/`crop`; the fan-out is untouched.
- **`generate` ⊥ `removeBackground` (mutually exclusive).** `kind:"background"` fires
  **only when the user names a scene**; plain "remove background" / a solid colour keeps
  using `removeBackground`. A post-parse guard forces `removeBackground:false` whenever
  `kind:"background"` is set, so the new feature can't hijack a plain removal request.
- **Background prompt is subject-less** (ends "empty foreground, no central subject,
  space for a subject") so the model doesn't paint its own subject onto the scene.
- **Shadow has no prompt** (composited locally in VIPS).
- A **safety line** refuses disallowed imagery.

---

## 3. Technique decomposition — don't reach for the expensive model first

Not every "generate" needs a heavyweight editing model, and Mochify already owns two
of the three pieces (BiRefNet bg-removal + VIPS compositing in `mochify-core`).

| `kind` | Technique | External model? |
|---|---|---|
| **shadow** | Pure VIPS in core — blur the alpha mask, offset, darken, composite | **None** |
| **background** | **Composite**: core removes bg (existing BiRefNet) → model generates *just the scene* (text→image) → core composites subject over it (+ optional synthetic shadow) | Cheap text→image |
| **edit** _(DEFERRED — later phase)_ | Instruction-editing model on the whole image | Expensive editor — **image leaves** |

The composite background path is the strategic one: the subject is the **real
cutout** (perfect preservation), the model only does a text→image scene, and
drop shadows are free in VIPS. Reserve full editing models for what composite
can't do.

---

## 4. Where it runs + models

New **`/v1/generate` on the worker** — it has the native Workers AI binding and
already routes Mistral through AI Gateway (keys server-side, observability,
caching, rate-limiting). Frontend orchestrates: generated image returns to the
client, which then sends it to core `/v1/squish` as today.

> ⚠️ **Verify the current Workers AI catalog + provider pricing before locking model IDs.**

- **FLUX.1 [schnell]** on Workers AI — text→image. Right for the *background scene*
  in the composite path. Native, cheap. (Not an editor.)
- **FLUX Kontext [pro] / [max]** via AI Gateway → BFL (or fal/Replicate) —
  instruction editing for `kind:"edit"`. Capable, third-party, pricier. Phase 3.

---

## 5. The three gates

### Consent — `ai_thirdparty_optin` (already shipped on `profile`)
The generate stage must check the per-user opt-in. If generative intent is detected
and the user hasn't opted in, show the **PromptForm consent popup** → write the flag
via the shared `/api/ai-optin` endpoint → proceed. Nuance for copy: schnell *on
Workers AI* keeps data on Cloudflare; Kontext *via AI Gateway → BFL* is a true third
party. The toggle covers the latter.

> **Near-term scope (shadows + composite backgrounds) keeps every image local.** The
> subject cut-out and composite happen in core; only the LLM-authored *text prompt*
> goes to schnell on Workers AI — **no user image leaves to a third party.** So the
> hard `ai_thirdparty_optin` gate is **not strictly required until the edit phase**;
> a light "AI-generated background" disclosure is enough for phases 1–2. The opt-in
> we shipped becomes the gate when `edit` (image leaves) lands.

### Metering — weighted decrement (see §6)
- **Paid-gated** to the same set the PDF tools use: `billing_plan ∈ {seller, pro, growth, day}`.
- **Same token bucket, weighted**: a generation decrements the bucket by **N**, not 1.
- **Charged on successful generation, not on acceptance** — the model runs (and you
  pay the provider) before the user decides. Otherwise generate-and-reject loops cost
  you for free. (Optionally allow one free reroll per intent.)
- **Cost is per `generate.kind`** (background ≠ edit; see §6).
- Code surface: add a `cost` param to the decrement path
  (`TokenBucket` DO → worker `/decrement` → `doDecrement`) that atomically checks
  `remaining ≥ cost` and subtracts `cost`. Squish is unchanged.

### UX — generating phase + preview
Generative output is non-deterministic; auto-applying to a batch and encoding N
formats *before* the user sees it is a bad surprise + wasted cost. Add a `generating`
`processPhase` and a `review`/accept state before the squish fan-out. The
`processPhase` machinery already has the hooks.

---

## 6. Pricing — what N should be

**Formula:** `break-even N = provider cost per gen ÷ revenue per op`, then round up and
add a margin buffer (a normal op costs ~nothing and is near-pure margin; a gen eats
real margin, so never price at break-even).

**Revenue per op** (from current plans): Seller $7.99/300 = $0.0266; Pro
$24.99/1,200 = $0.0208. Use the **lower** (~**$0.021/op**, Pro) as the divisor so
margin holds on every tier.

**Provider cost per gen** — ⚠️ *estimates, verify before committing*:

| Path | Model / where | Est. cost / image |
|---|---|---|
| Shadow | none (VIPS in core) | **$0** |
| Background (composite) | FLUX schnell on Workers AI (scene only) | **~$0.006** |
| Edit (pro) | FLUX Kontext pro via AI Gateway | **~$0.04** |
| Edit (max) | FLUX Kontext max | **~$0.08** |

**Recommended N** (break-even ÷ $0.021, rounded up + buffer):

| Kind | Cost | Break-even N | **Recommended N** | Coverage |
|---|---|---|---|---|
| Shadow | $0 | 0 | **0–1** (free perk, or count as 1) | — |
| Background | ~$0.006 | ~0.3 → 1 | **5** | ~17× |
| Edit (pro) | ~$0.04 | ~2 | **10** | ~5× |
| Edit (max) | ~$0.08 | ~4 | **20** | ~5× |

Background's break-even is below 1 op, so N=5 there is **value capture + abuse
prevention + premium signalling**, not cost recovery (anywhere 3–8 is pure margin).
Edits are cost-plus, so ~5× coverage.

**Sanity check** (N=5 background / N=10 edit):

| Plan | Backgrounds/mo | Edits/mo | Worst-case cost (all edits) | Price |
|---|---|---|---|---|
| Seller (300) | 60 | 30 | $1.20 | $7.99 |
| Pro (1,200) | 240 | 120 | $4.80 | $24.99 |
| Growth (5,000) | 1,000 | 500 | $20 | (verify) |

Margins hold (~85% Seller, ~80% Pro even if a user does nothing but edits). Growth is
the one to watch — confirm its price against the $20 worst-case exposure.

**Why not a single N:** background and edit costs differ ~7×; one multiplier either
bleeds margin on edits or makes backgrounds absurd. Cost it per `kind`.

---

## 7. Privacy posture

- **Composite background path: the user's photo never leaves Mochify** — bg-removal +
  compositing are local; only a *text prompt* goes to schnell. Strong differentiator,
  worth marketing.
- **Edit path (Kontext): the image goes to a third party.** Needs a scoped carve-out
  in the zero-retention claim (like the existing "HIF travels to the API" note) + a
  provider on no-training / zero-retention terms. Gated behind consent.

---

## 8. Phased rollout

1. **Shadows** — `kind:"shadow"`, pure VIPS, no model, no third party, no consent.
   Proves the whole generate stage + NLP `generate` field end-to-end with zero AI risk.
2. **Backgrounds (composite)** — schnell scene + existing bg-removal + VIPS composite.
   Consent + metering (N=5) go live here.
3. **Full edits — DEFERRED.** FLUX Kontext / Gemini via AI Gateway for `kind:"edit"`.
   This is the only phase where an image leaves to a third party, so it carries the
   real cost/risk and the `ai_thirdparty_optin` gate. Revisit after phases 1–2 land
   (N=10/20). Until then, near-term work is **schnell-only** (and may not even need a
   third-party provider relationship beyond Workers AI).

---

## 9. Open decisions / numbers to lock

- **Reroll policy** — free first regeneration per intent, or charge every gen?
- **Shadow N** — free (0) or count as 1 op?
- **Real provider prices** — schnell cost (depends on steps + resolution — pin them);
  Kontext pro/max at the chosen provider. Re-run the ÷$0.021 formula with live numbers.
- **Growth plan price** — needed to confirm the $20 worst-case exposure is safe.
- **Day-pass + gen** — day-pass counts as paid (unlocks PDF tools); confirm you're
  happy with day-pass users generating (ops quota caps the blast radius).
- **Post-gen conversion cost** — charge normal per-output tokens on top of N
  (recommended, simple) or discount because they "already paid" for the gen?
