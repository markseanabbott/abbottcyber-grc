# Abbott Cyber GRC Platform — Cowork Handover Notes
*Last updated: 18 May 2026 — Org CRUD + Risk Profiles added*

---

## What Has Been Built

This platform was built iteratively in Claude.ai as a single-file HTML artifact. It is now being moved to Cowork for real file output and live Supabase connectivity.

### Modules Built and Approved

| Module | Status | Notes |
|---|---|---|
| Dashboard Shell | ✅ Done | Sidebar nav, org switcher, topbar, module routing |
| Org Hierarchy (UI) | ✅ Done | 4-tier dropdown, tier banners, visibility scoping |
| Insurance Readiness Survey | ✅ Done | Dual-weighted scoring, accordion panels, trend line, savings estimator |
| Organisation Manager | ✅ Done | Full CRUD: tree view, edit modal (details + risk profile tabs), delete with cascade warning, Supabase write |
| Tabletop Exercise Engine | ✅ Done | Full operational track — rebuilt in Cowork + wired to Supabase. See detail below. |
| Technology Stack Survey | ✅ Done | 10 categories, 41 questions. Chip-let framework mappings, Y/N/NA/Partial, tool_category tags for MSP catalog match. Wired to Supabase via techstack_responses + assessments snapshot. |
| Supabase Connection | ✅ Done | Verified live from Cowork. All modules wired. RLS open anon for now. |

### Tabletop Module Detail
The tabletop module is fully built and approved. It includes:
- Step 0: Technical Lead declaration (receives raw signal, assigns P1-P4 severity, recommends declare/monitor)
- vCISO commentary card shown at exercise launch
- 3 ingestion point types: PSA ticket, SOC alert, technician anomaly
- 2 pre-built scenarios: Ransomware via phishing (5 injects), BEC wire fraud (1 inject)
- Role-filtered inject cards (5 roles: IC, TL, Comms, Legal, Exec Sponsor)
- Executive Sponsor assumed-role card
- NIST IR phase tracker
- Breach declaration gate (IC + Exec Sponsor co-sign required)
- Insurer notification checklist (8 items, 72hr clock)
- After Action Report with MITRE ATT&CK revealed, criticality accuracy scoring, full event log, IR plan comparison section

---

## Supabase Database

**URL:** https://sssyimtkvmtgjpusedvq.supabase.co  
**Anon key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzc3lpbXRrdm10Z2pwdXNlZHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NzA1NTMsImV4cCI6MjA5NDU0NjU1M30.FxQaJn97YewSQi6s45nw1LgMRfBj8xhswLM47_Q2zXI

### Tables Created
- `organisations` — 4-tier hierarchy (platform, grandfather, father, child)
- `users` — per-org users with roles
- `assessments` — module scores with history (insurance, cis, nist, techstack)
- `tabletop_sessions` — exercise state + session codes
- `tabletop_participants` — who joined with which role
- `tabletop_responses` — per-inject per-role answers and criticality ratings
- `tabletop_notif_checks` — insurer notification checklist state
- `techstack_responses` — per-org per-question tech stack answers with tool_category / question_type / derive_strategy machine tags (PATCH_002)
- `organisation_profiles` — extended risk metadata per org: size, structure, data profile, regulatory scope, IT posture, vendor risk, ACL hook (PATCH_003)

### Organisation Profiles Schema (PATCH_003)
The `organisation_profiles` table is 1:1 with `organisations` (unique org_id, ON DELETE CASCADE). Key fields:

**Size & Structure:** `employee_count_band`, `annual_revenue_band`, `org_structure`
**Industry detail:** `sub_industry` (complements `industry` on organisations table)
**Operations:** `geographic_presence`, `remote_workforce_pct`
**Data & risk:** `data_sensitivity` (Low/Medium/High/Critical), `handles_pii`, `handles_payment_data`, `handles_health_data`
**Regulatory:** `regulatory_scope` (comma-separated: PCI-DSS, HIPAA, GDPR, etc.)
**IT posture:** `it_maturity` (Reactive→Optimizing), `cloud_adoption`, `vendor_count_band`, `critical_vendor_dependency`
**ACL hook:** `managed_by_org_id` — identifies which org manages this profile. NULL = inherit from parent. Used by future RLS policies.

### ACL Design — Organisation Manager
**Phase 1 (current):** Admin-only. Abbott Cyber platform users can add/edit/delete all orgs.
**Phase 2 (with auth):** RLS policies on `organisation_profiles` will enforce:
- Platform → full access
- Grandfather → can manage own tree (orgs where ancestor includes them)
- Father → can manage own children + self
- Child → can edit own profile notes only

`managed_by_org_id` allows explicit delegation (e.g., grandfather delegates a child to a specific father without full tree access).

### Seed Data in Database
| ID suffix | Name | Tier | Parent |
|---|---|---|---|
| ...000 | Abbott Cyber Consulting | platform | none |
| ...001 | Abbott Cyber MSP | grandfather | Abbott Cyber Consulting |
| ...002 | Hospitality Group | father | Abbott Cyber MSP |
| ...003 | Tech & SaaS Clients | father | Abbott Cyber MSP |
| ...004 | The Grand Hotel | child | Hospitality Group |
| ...005 | Harbour Inn & Suites | child | Hospitality Group |
| ...006 | CloudStack Inc. | child | Tech & SaaS Clients |

Assessment history seeded for The Grand Hotel (3 runs), Harbour Inn (1 run), CloudStack (2 runs).

### RLS Policies
Open anon policies on all tables — tighten when user auth is added in a later phase.

---

## Architecture Decisions Made

### Org Hierarchy — 4 Tiers
- **Platform** — Abbott Cyber Consulting. Sees all orgs. One per deployment.
- **Grandfather** — MSP or Franchisor HQ. Sees own tree only (own fathers + their children).
- **Father** — Regional group or MSP client group. Sees own children only.
- **Child** — Individual client site. Sees self only.

Each org links upward via `parent_id`. Platform has no parent.

### Visibility Scoping Logic
```
platform  → sees all orgs
grandfather → self + own fathers + those fathers' children
father → self + own children
child → self only
```

### Scoring Model — Insurance Readiness
- Every question has two weights: `secW` (security importance 0-10) and `insW` (insurance premium importance 0-10)
- Final score = (security% × 0.4) + (insurance% × 0.6)
- Rationale: insurance premium impact weighted higher because that's the primary value proposition for clients
- Scores saved to `assessments` table with `sec_pct` and `ins_pct` stored separately for trend analysis

### Tabletop — Key Design Decisions
- Triage is NOT part of tabletop (it's operational training, not tabletop)
- Exercise starts AFTER incident is declared — Step 0 is TL declaring, not investigating
- Executive Sponsor is ALWAYS assumed by an ops participant (not a real exec) in the operational track
- Breach declaration requires BOTH IC and Exec Sponsor to co-sign — neither alone is sufficient
- MITRE ATT&CK tactics are hidden during exercise, revealed only in AAR
- Correct criticality per inject is hidden during exercise, revealed only in AAR

---

## Brand & Design

**Brand:** Abbott Cyber Consulting  
**Tagline:** Prioritized risk approach  
**Colours:**
- Navy: `#152168`
- Cyan: `#07B4D9`  
- Light cyan: `#07D1F2`

**Font:** Kanit (700 headings, 400 body) — load from Google Fonts  
**Design principle:** Clean, professional, client-facing. Not an internal prototype.

**Tier colour coding:**
- Platform: gradient navy→cyan avatar
- Grandfather: cyan (`#07B4D9`)
- Father: indigo (`#4f46e5`)
- Child: green (`#16a34a`)

---

## What to Build Next (Priority Order)

1. **Framework auto-scoping** — tech stack answers pre-populate CIS / NIST / Insurance survey questions via the `derive_strategy` field (closes the loop on the techstack vision)
2. **MSP tool catalog (msp_tools table)** — join on `tool_category` to classify each client answer as sell / upgrade / replace
3. **Jackbox-style multiplayer for tabletop** — session code join flow, role selection screen, participant view, real-time inject delivery
4. **CIS Controls v8 survey** — full questionnaire, will be heavily abbreviated by tech-stack auto-scoping once #1 ships
5. **Optional tech stack categories** — Cloud Security Posture, Application Security toggles
6. **PDF export** — AAR and scorecard reports, Abbott Cyber branded
7. **Fix org dropdown** — small UI bug from May 16 session (user noted dropdown doesn't appear on click)

Full backlog is in `backlog.json` with phase numbers and done flags.

---

## How We Work

The founder is non-technical. The workflow is:
- Founder describes what they want in plain language
- Claude (Cowork) builds it
- Founder reviews and approves or requests changes
- Move to next item

Do not invent features outside the backlog without asking. Do suggest additions if you see a gap.

One section at a time. Build it, get approval, mark it done, move on.

---

## Files in This Folder

| File | Purpose |
|---|---|
| `PROJECT_BRIEF.md` | Full project brief — read this first |
| `backlog.json` | Feature backlog with phase numbers and done flags |
| `HANDOVER_NOTES.md` | This file — architecture decisions and context |
| `SUPABASE_SCHEMA.sql` | Full database schema (already run — for reference) |
| `SUPABASE_PATCH_001.sql` | Patch adding platform tier and fixing parent links (already run) |
| `SUPABASE_PATCH_002.sql` | Patch adding techstack_responses table (run in Supabase SQL Editor) |
| `SUPABASE_PATCH_003.sql` | Patch adding organisation_profiles table — run in Supabase SQL Editor before using Edit org / Risk Profile |
| `index.html` | Current platform — full working code |
| `tech_stack_survey_prototype.html` | Standalone prototype used to validate the chip + tags design — can be deleted once tech stack module is verified working in index.html |

---

*This project is being built as a real SaaS product with future commercial potential. Build accordingly — clean structure, maintainable code, no shortcuts that would hurt a future sale or white-label.*
