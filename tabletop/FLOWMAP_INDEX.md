# Tabletop Exercise — Facilitator Reference Index

> **Facilitator answer key — not shown to participants.**
> This file is the single source of truth for shared conventions referenced by all flowmap files.

---

## File index

| File | Contents |
|------|----------|
| [flowmap_operational.md](flowmap_operational.md) | Track 1 — OPS-1 through OPS-7 · hardcoded operational scenarios |
| [flowmap_ai_governance.md](flowmap_ai_governance.md) | Track 2 — AI-01 through AI-10 · AI governance scenarios |
| [storyboard/ransomware.md](storyboard/ransomware.md) | Track 3 — Ransomware archetype · 22 cards · 6 stages |
| [storyboard/bec.md](storyboard/bec.md) | Track 3 — BEC archetype · 16 cards · 5 stages |
| [storyboard/insider.md](storyboard/insider.md) | Track 3 — Insider Threat archetype · 19 cards · 5 stages |
| [storyboard/vendor.md](storyboard/vendor.md) | Track 3 — Vendor Compromise archetype · 17 cards · 5 stages |

> New archetypes (POS compromise, cloud misconfiguration, etc.) each get their own file under `storyboard/`.

---

## Track 1 and 2 — hardcoded scenarios

Track 1 (`js/tabletop.js`) and Track 2 (`js/ai_tabletop.js`) use **fixed inject sequences** — every session sees the same cards in the same order. Facilitator reference and answer keys are in the files above.

---

## Track 3 — TB Storyboard engine rules

Track 3 uses a **branching tag system**: each session walks through a fixed stage skeleton, but the card at each stage is drawn from a weighted pool filtered by tag state. Two sessions running the same archetype will almost never take the same path.

- **One card per stage**, picked from eligible cards whose `requires` tags are all in the current session tag state.
- **Each played card adds its `grants` tags** to the state — shaping which cards are eligible at the next stage.
- `requires: []` — opener card, eligible from any state (all stage-1 cards).
- `grants: []` — terminal card, ends the chain (all impact-stage cards).
- **Curation gate:** the card picker filters `WHERE curated = true`. Cards with `curated = false` are authoring drafts and never appear in live sessions.
- **`{{org_name}}` token** in every body is substituted at runtime with the client org name.

**Facilitator role:** You see the full body and all five role prompts. Participants see only their own. After each inject, open discussion — draw out the right answer before moving on.

---

## NIST phase key

| Index | Phase | When used in Track 3 |
|-------|-------|----------------------|
| 1 | Detect/Analyze | Stages 1–2 across all archetypes |
| 2 | Contain | Varies by archetype — see canonical mapping below |
| 3 | Eradicate | Impact and late-chain stages |
| 4 | Recover | Post-terminal wrap-up round only (TB10b) — **not on any inject card** |
| 5 | Post-Incident | Post-terminal wrap-up round only (TB10b) — **not on any inject card** |

> Phases 4 and 5 are exercised in the post-terminal wrap-up round (TB10b). They do not appear on `tt_inject_cards`.

---

## Role key

| ID | Role | Primary responsibility |
|----|------|------------------------|
| IC | Incident Commander | Decision authority; breach gate co-signer with ES |
| TL | Technical Lead | Technical severity assessment; IR plan owner |
| CL | Communications Lead | Internal and external messaging |
| LC | Legal Counsel | Notification obligations, privilege, regulatory |
| ES | Executive Sponsor | Business impact; resource authorization; breach gate co-signer with IC |

---

## Canonical NIST phase mapping per archetype

> **`CANONICAL` in `generate_grids.mjs` is the authoritative source — do not edit this table by hand.** It is regenerated from `CANONICAL` on every generator run. The generator also verifies that `tt_inject_cards` matches this mapping before writing any grid. A mismatch causes the script to exit with an error listing the divergent cards — fix the DB first, then re-run.

<!-- AUTOGEN:nistmapping START -->

| Archetype (DB id) | S1 | S2 | S3 | S4 | S5 | S6 |
|-------------------|----|----|----|----|----|----|
| `ransomware` | 1 | 1 | 2 | 2 | 3 | 3 |
| `bec` | 1 | 1 | 2 | 2 | 3 | — |
| `insider` | 1 | 1 | 2 | 3 | 3 | — |
| `vendor_compromise` | 1 | 1 | 2 | 3 | 3 | — |

Phase key: **1** = Detect/Analyze · **2** = Contain · **3** = Eradicate
<!-- AUTOGEN:nistmapping END -->

---

## Archetypes at a glance

| Archetype | Stages | Cards | Typical duration | Hardest outcome |
|-----------|--------|-------|-----------------|-----------------|
| Ransomware | 6 | 22 | 90–120 min | R6c — backup destruction + encrypt, no clean recovery |
| BEC | 5 | 16 | 60–75 min | B5b — double-tap phone call closes cancellation window |
| Insider | 5 | 19 | 60–75 min | I5b — regulatory notification for 50K+ PII records |
| Vendor Compromise | 5 | 17 | 75–90 min | V5a — RMM used to encrypt all managed clients simultaneously |

---

## Generating / refreshing card grids

The card grids in each `storyboard/*.md` file are generated from `tt_inject_cards` — they are not hand-maintained. Run the generator any time cards change in the DB:

```
node tabletop/generate_grids.mjs
```

Reads `SUPABASE_URL` and `SUPABASE_ANON_KEY` from `.env`. Rewrites only the `<!-- AUTOGEN:cardgrid:<archetype> START/END -->` blocks; all hand-written prose (stage skeleton, example paths, discussion questions) is untouched.

---

*Last updated: 2026-07-03 — initial restructure; canonical source for shared conventions*
