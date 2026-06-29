# Autonomous Tabletop — Product Concept & Backlog

> Jackbox-style, fully autonomous cybersecurity tabletop exercises.
> No facilitator required. Participants join via session code, the system
> delivers injects, routes based on choices made, and generates the full
> AAR automatically. Front to back autonomous.

---

## Core Concept

The existing tabletop engine requires a human facilitator to advance injects
and score the exercise. This parallel product removes that entirely.

**How it works:**
1. vCISO creates a session, picks a scenario, shares a 6-character code
2. Participants join on any device — no account required
3. System auto-launches when required roles are filled
4. Injects are delivered in real time, role-filtered to each participant
5. When all roles submit, Haiku evaluates responses and routes to the correct next inject
6. At exercise end, Sonnet scores the rubric and writes the full AAR
7. Shareable read-only AAR link sent to all participants

---

## Model Split — Why Two Models

| Role | Model | Why |
|---|---|---|
| Scenario authoring (one-time) | Sonnet | Full inject graph generation — quality matters, runs once |
| Runtime trigger classification | Haiku | Classification only: did the team do X or not? Fast, cheap |
| Post-inject debrief card | Haiku | Formulaic feedback per inject — speed matters, participants are waiting |
| Autonomous breach gate evaluation | Haiku | Binary threshold evaluation against pre-defined criteria |
| End-of-exercise rubric scoring | Sonnet | Judgment across 5 dimensions + written justification — client-facing |
| Full AAR narrative | Sonnet | Premium output — the deliverable clients keep |

---

## Branching Logic

Scenarios are pre-authored by Sonnet as a full inject graph — not generated at runtime.
Each inject has a set of `trigger_conditions` that Haiku checks after responses close.

Example — Ransomware scenario, inject 1:
```
Inject 1: EDR alert fires, 3 machines unresponsive

Trigger conditions:
  mfa_not_reset        → Branch: attacker re-enters via compromised MFA token
  network_not_isolated → Branch: lateral movement to PMS server confirmed
  insurer_not_notified → Branch: carrier coverage dispute at claim time

If no triggers fire → Core inject 2 (normal path)
```

Haiku reads the responses, returns:
```json
{ "mfa_not_reset": true, "network_not_isolated": false, "insurer_not_notified": true }
```

Engine routes to the highest-priority fired trigger. The branch inject calls out
the consequence explicitly in the narrative ("At 09:47 the attacker re-enters
via the compromised MFA token…") so teams feel the impact of their decisions.

---

## Cost Model

Per exercise (7 injects, 5 participants, ransomware scenario):

| Step | Model | Est. cost |
|---|---|---|
| Haiku routing (×7 injects) | Haiku | ~$0.003 |
| Post-inject debrief cards (×7) | Haiku | ~$0.018 |
| Breach gate evaluation | Haiku | ~$0.001 |
| Rubric scoring (Sonnet) | Sonnet | ~$0.027 |
| AAR narrative (Sonnet) | Sonnet | ~$0.045 |
| **Total per exercise** | | **~$0.09–$0.10** |

Scenario authoring (Sonnet, one-time per scenario): ~$0.15 each.
20-scenario library: ~$3 total.

Monthly volume estimates:
- 50 exercises/month → ~$5
- 100 exercises/month → ~$10
- 500 exercises/month → ~$50

---

## Architecture Notes

**Real-time delivery:** Supabase Realtime (websockets) replaces polling.
Inject activation is pushed to all participant clients simultaneously.

**Auto-advance lock:** Last submitter queries response count vs active role count.
If complete, triggers the advance + Haiku call. Atomic lock via Supabase update
prevents double-advance when two responses arrive simultaneously.

**AI proxy:** Single Supabase Edge Function proxies all Anthropic API calls.
Keeps the API key server-side. Takes `{model, messages, max_tokens}`, returns completion.

**Scenario storage:** Scenarios live in `tabletop_scenarios` (already exists in DB).
Each scenario stores the full inject graph as JSONB including branch nodes,
trigger conditions, role cards, correct answers, and rubric mapping.

**Session state:** `tabletop_sessions.mode = 'autonomous'` flags the session type.
`ai_usage jsonb` logs token spend per exercise. `shared_aar_token uuid` enables
the shareable read-only AAR link.

---

## Backlog — Infrastructure & AI Proxy

| ID | Item | Priority |
|---|---|---|
| `ata_infra_1` | Supabase Edge Function — Anthropic API proxy. ~50 lines. Takes `{model, messages, max_tokens}`, returns completion. Keeps API key server-side. | Critical |
| `ata_infra_2` | Supabase Realtime subscription in participant client — inject delivery pushed to all connected devices simultaneously. Replaces polling. | Critical |
| `ata_infra_3` | DB: add `shared_aar_token uuid` to `tabletop_sessions` for login-free AAR link. | Critical |
| `ata_infra_4` | Token cost logging — record Haiku/Sonnet input/output tokens per exercise to `tabletop_sessions.ai_usage jsonb`. | High |

---

## Backlog — Scenario Authoring

| ID | Item | Priority |
|---|---|---|
| `ata_author_1` | Scenario brief form — industry, attack vector, client size, difficulty, learning objectives. Prompt input for Sonnet. | Critical |
| `ata_author_2` | Sonnet scenario graph generation — brief in, full inject graph out as JSON. Core injects + branch injects + role cards + trigger conditions. | Critical |
| `ata_author_3` | Graph review UI — visualize the full inject tree (core path + branch nodes) before approving. | High |
| `ata_author_4` | Trigger condition builder — define what Haiku checks per inject. Each condition maps to a branch inject node. | Critical |
| `ata_author_5` | Inline inject editor — tweak Sonnet's output before saving. Edit body, role cards, correct answers, trigger conditions. | High |
| `ata_author_6` | Publish to `tabletop_scenarios` — save approved graph to DB. Reusable across all clients indefinitely. | Critical |
| `ata_author_7` | Scenario versioning — update a scenario without breaking sessions already running on the prior version. | Medium |

---

## Backlog — Session Creation

| ID | Item | Priority |
|---|---|---|
| `ata_session_1` | Autonomous session creation wizard — scenario select, mode = autonomous, timer config (lobby countdown, per-inject timer). | Critical |
| `ata_session_2` | Role configuration — mark roles required or optional, set minimum required roles for auto-launch. | High |
| `ata_session_3` | Session code share screen — code displayed large, copy-to-clipboard, optional QR code for in-room projection. | High |

---

## Backlog — Lobby & Join

| ID | Item | Priority |
|---|---|---|
| `ata_lobby_1` | Join flow via session code — name entry, role selection, role lock on claim. Builds on existing multiplayer.js base. | Critical |
| `ata_lobby_2` | Live waiting room — connected participants, role fill status, countdown to auto-launch. | Critical |
| `ata_lobby_3` | Auto-launch trigger — game starts when required roles filled OR lobby countdown hits zero. | Critical |
| `ata_lobby_4` | Late joiner handling — join mid-exercise as observer or claim an unclaimed optional role. | Medium |
| `ata_lobby_5` | Mobile-responsive join UI — full participation from a phone. Usable on a 375px screen. | High |

---

## Backlog — Exercise Runtime

| ID | Item | Priority |
|---|---|---|
| `ata_runtime_1` | Real-time inject delivery via Supabase Realtime. Role filtering applied client-side. | Critical |
| `ata_runtime_2` | Role-filtered inject cards on participant screens. | Critical |
| `ata_runtime_3` | Response submission UI — text box, criticality selector, submit button. Writes to `tabletop_responses`. | Critical |
| `ata_runtime_4` | Auto-advance detection — last submitter queries response count vs active role count. If complete, triggers close + Haiku routing. | Critical |
| `ata_runtime_5` | Atomic advance lock — prevents double-advance when two responses arrive simultaneously. | Critical |
| `ata_runtime_6` | Per-inject response timer — configurable countdown, auto-advance on expiry, flags unanswered roles in AAR. | High |
| `ata_runtime_7` | Participant progress bar — inject counter, live role status dots, running exercise clock. | High |
| `ata_runtime_8` | Reconnect / resume — participant drops and rejoins, session state restored from Supabase. | High |

---

## Backlog — AI Engine (Haiku)

| ID | Item | Priority |
|---|---|---|
| `ata_ai_1` | Haiku trigger classification — evaluates all responses against inject's trigger_conditions, returns structured JSON. | Critical |
| `ata_ai_2` | Branch inject activation — engine reads Haiku JSON, routes to matching branch inject node. | Critical |
| `ata_ai_3` | Post-inject Haiku debrief card — what team got right, what they missed, correct action. Shown 60 seconds before next inject. | High |
| `ata_ai_4` | Autonomous breach gate — Haiku evaluates TL responses against breach threshold. Pushes co-sign prompt to IC + ES screens. | High |
| `ata_ai_5` | Missed-action injection — fired branch inject explicitly narrates the consequence in scenario text. | High |

---

## Backlog — End of Exercise (Sonnet)

| ID | Item | Priority |
|---|---|---|
| `ata_end_1` | Sonnet rubric scoring — 5 dimensions × 1–5 score + written justification. Stored to `rubric_scores`. | Critical |
| `ata_end_2` | Sonnet AAR narrative — full written AAR from all session data. Breach timeline, per-role assessment, missed triggers, remediation. | Critical |
| `ata_end_3` | In-app AAR render — score card, rubric, breach record, MITRE mapping, narrative. | Critical |
| `ata_end_4` | Shareable read-only AAR link — `?token=<uuid>`, no login, 30-day TTL. | High |
| `ata_end_5` | AAR email delivery — send AAR link to participant emails at exercise end. | Medium |

---

## Backlog — Scenario Library

| ID | Item | Priority |
|---|---|---|
| `ata_lib_1` | Seed library — 5 Sonnet-authored starter scenarios: Ransomware (hotel), BEC wire fraud, MSP supply-chain pivot, POS compromise, overnight vishing. | Critical |
| `ata_lib_2` | Scenario browser — list with industry, attack type, difficulty, estimated runtime. Filter and search. | High |
| `ata_lib_3` | Scenario preview — view core inject path and branch structure before assigning to a session. | Medium |
| `ata_lib_4` | Scenario categories and tags — hospitality, MSP, executive, compliance-track, beginner/intermediate/advanced. | Medium |
| `ata_lib_5` | Custom scenario from brief — vCISO enters client brief, Sonnet generates bespoke scenario, reviewed and saved. | High |

---

## Backlog — Product Viability Gates

| ID | Item | Priority |
|---|---|---|
| `ata_viability_1` | End-to-end internal smoke test — one full autonomous exercise with test accounts. Validate Realtime delivery, auto-advance, Haiku routing, Sonnet AAR. | Critical |
| `ata_viability_2` | AI output quality review — run ransomware scenario twice with correct and incorrect responses. Verify Haiku routes correctly and Sonnet AAR reflects what happened. | Critical |
| `ata_viability_3` | Cost-per-exercise validation — confirm real token spend matches ~$0.10 estimate via ai_usage log. | Critical |
| `ata_viability_4` | First client pilot — one autonomous exercise with a real client. Capture written feedback. Decision gate before wider release. | High |

---

*Last updated: 2026-06-27*
*Status: Concept — not yet in active development*
