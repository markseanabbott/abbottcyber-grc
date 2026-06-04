# Abbott Cyber GRC Platform — CLAUDE.md

> Source of truth for Claude sessions. Read this before touching anything.

---

## Who Mark Is

Mark Abbott is the founder of **Abbott Cyber Consulting** — a virtual CISO / CIO consulting firm in Surrey, BC, Canada. He is not a developer. Claude builds; Mark reviews, approves, and directs. Build for a non-technical founder who will use this tool live with real clients.

Two client verticals:
- **MSPs** — vCISO, tool selection, sales enablement
- **Direct clients** — primarily hospitality (hotels)

Consulting philosophy: **risk-based and pragmatic** — highest value first, lowest cost solution that fits the actual risk profile.

---

## What This Is

A **Security Scorecard / GRC Platform** — web tool for assessing cybersecurity posture, managing risk, running tabletop exercises, and reporting across a multi-tier org hierarchy.

**Architecture: single-file HTML app.** Everything lives in `index.html` (~5,500 lines). Vanilla JS and CSS — no framework, no bundler, no build step. The file is opened directly in a browser. Supabase is the backend, accessed via the JS Fetch API using the anon key.

> **Note for Claude Code:** This is intentionally a single-file architecture. Do not refactor to React or introduce a build system without explicit instruction from Mark. The goal is to enhance and extend `index.html`, not to migrate it.

---

## File Structure

```
AbbottCyber GRC/
├── CLAUDE.md                      ← This file
├── .env                           ← Supabase credentials (NEVER commit this)
├── .gitignore                     ← Must include .env
├── PROJECT_BRIEF.md               ← Original project brief (high-level goals)
├── HANDOVER_NOTES.md              ← Architecture decisions and context
├── backlog.json                   ← Feature backlog — source of truth for what's done/next
├── index.html                     ← THE APP (5,482 lines, all modules here)
├── ~~tech_stack_survey_prototype.html~~  ← Deleted (obsolete)
├── SUPABASE_SCHEMA.sql            ← Base schema (already run)
├── SUPABASE_PATCH_001.sql         ← Added platform tier (already run)
├── SUPABASE_PATCH_002.sql         ← Added techstack_responses (already run)
├── SUPABASE_PATCH_003.sql         ← Added organisation_profiles (already run)
├── SUPABASE_PATCH_004.sql         ← Unique constraint on tabletop role claiming (already run)
└── SUPABASE_PATCH_005.sql         ← Added vendor_assessments (already run)
```

All patches have been run. The live database reflects the cumulative schema.

---

## Supabase Credentials

**IMPORTANT — Claude Code specific:**
- Credentials live in `.env` — never hardcoded, never committed to git
- `.env` must be in `.gitignore` before any git operations
- The anon key in the existing `index.html` is acceptable for now (no git yet) but must be replaced with an env variable before any deployment or version control

```
SUPABASE_URL=https://sssyimtkvmtgjpusedvq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzc3lpbXRrdm10Z2pwdXNlZHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NzA1NTMsImV4cCI6MjA5NDU0NjU1M30.FxQaJn97YewSQi6s45nw1LgMRfBj8xhswLM47_Q2zXI
```

RLS is enabled on all tables with open anon policies (tighten when user auth is added in Phase 2).

---

## ⚠️ Supabase Safety Rules — Read Before Any DB Work

This database contains **real client data**. Treat it accordingly.

1. **Never run destructive SQL without showing Mark first.** Write the patch file, explain what it does, wait for go-ahead.
2. **Always check existing schema before proposing changes.** The patch files are the source of truth for what's been run.
3. **New schema changes go in the next numbered patch file** — `SUPABASE_PATCH_006.sql`, `007`, etc. — with a comment at the top explaining what it does and a note that it needs to be run manually in the Supabase SQL Editor.
4. **Never run `supabase db push` or any migration command** without explicit approval.
5. **Never drop or truncate tables.** Ever.

---

## Database Schema (current state — all patches applied)

### `organisations`
Core hierarchy table. 4 tiers.
```sql
id uuid PK
name text
tier text CHECK ('platform','grandfather','father','child')
parent_id uuid → organisations(id) ON DELETE CASCADE
industry text
logo_url text
created_at, updated_at timestamptz
```

### `users`
```sql
id uuid PK
org_id uuid → organisations(id) ON DELETE CASCADE
name text
email text UNIQUE
role text CHECK ('admin','analyst','viewer')
created_at timestamptz
```

### `assessments`
Score history for all survey modules.
```sql
id uuid PK
org_id uuid → organisations(id) ON DELETE CASCADE
module text  -- 'insurance' | 'cis' | 'nist' | 'techstack'
score integer  -- 0–100
sec_pct integer
ins_pct integer
answers jsonb
conducted_by text
assessed_at date
created_at timestamptz
```

### `tabletop_sessions`
```sql
id uuid PK
org_id uuid → organisations(id) ON DELETE CASCADE
scenario_id text
scenario_title text
session_code char(6) UNIQUE
status text CHECK ('setup','active','complete','expired')
facilitator_name text
current_inject integer
declaration_logged boolean
tl_assessment text, tl_severity text, tl_declare boolean
breach_declared boolean, breach_timestamp text, breach_rationale text
ic_sign_time text, es_sign_time text
notif_filed boolean
exercise_log jsonb
created_at, updated_at timestamptz
```

### `tabletop_participants`
```sql
id uuid PK
session_id uuid → tabletop_sessions(id) ON DELETE CASCADE
role_id text  -- 'ic'|'tl'|'cl'|'lc'|'es'
role_name text
player_name text
joined_at timestamptz
UNIQUE(session_id, role_id)  -- added in PATCH_004
```

### `tabletop_responses`
```sql
id uuid PK
session_id uuid → tabletop_sessions(id) ON DELETE CASCADE
inject_index integer
role_id text
player_name text
response_text text
criticality text CHECK ('Critical','High','Medium','Low')
created_at, updated_at timestamptz
UNIQUE(session_id, inject_index, role_id)
```

### `tabletop_notif_checks`
```sql
id uuid PK
session_id uuid → tabletop_sessions(id) ON DELETE CASCADE
item_id text
checked boolean
checked_at timestamptz
UNIQUE(session_id, item_id)
```

### `techstack_responses` (PATCH_002)
```sql
id uuid PK
org_id uuid → organisations(id) ON DELETE CASCADE
question_id text
category_id text
answer text CHECK ('yes','no','na','partial')
partial_detail text
tool_category text
question_type text CHECK ('presence','coverage','feature','process')
derive_strategy text
assessed_at date
created_at, updated_at timestamptz
UNIQUE(org_id, question_id)
```

### `organisation_profiles` (PATCH_003)
```sql
id uuid PK
org_id uuid UNIQUE → organisations(id) ON DELETE CASCADE
employee_count_band text
annual_revenue_band text
org_structure text
sub_industry text
geographic_presence text
remote_workforce_pct text
data_sensitivity text
handles_pii boolean
handles_payment_data boolean
handles_health_data boolean
regulatory_scope text
it_maturity text
cloud_adoption text
vendor_count_band text
critical_vendor_dependency boolean
notes text
managed_by_org_id uuid → organisations(id)
created_at, updated_at timestamptz
```

### `vendor_assessments` (PATCH_005)
```sql
id uuid PK
org_id uuid → organisations(id) ON DELETE CASCADE
vendor_name text
product_name text
website text
assessor text
status text CHECK ('draft','complete')
tier text CHECK ('Critical','High','Moderate','Low')
tier_rationale text
jurisdiction text
data_residency text
data_categories jsonb
provided_docs text
vendor_profile jsonb
profile_confidence jsonb
findings jsonb
recommendations text
outstanding_items jsonb
created_at, updated_at, completed_at timestamptz
```

### Helper function
`generate_session_code()` — returns a random 6-char alphanumeric string (no I, O, 0, 1). Used for tabletop session codes.

### `tg_touch_updated_at()` trigger
Auto-updates `updated_at` on `techstack_responses` and `organisation_profiles`.

---

## Seed Data

| ID suffix | Name | Tier | Parent |
|---|---|---|---|
| ...000 | Abbott Cyber Consulting | platform | — |
| ...001 | Abbott Cyber MSP | grandfather | Abbott Cyber Consulting |
| ...002 | Hospitality Group | father | Abbott Cyber MSP |
| ...003 | Tech & SaaS Clients | father | Abbott Cyber MSP |
| ...004 | The Grand Hotel | child | Hospitality Group |
| ...005 | Harbour Inn & Suites | child | Hospitality Group |
| ...006 | CloudStack Inc. | child | Tech & SaaS Clients |

Assessment history seeded: The Grand Hotel (3 runs), Harbour Inn (1 run), CloudStack (2 runs).

---

## Org Hierarchy — Key Rules

**4 tiers:** platform → grandfather → father → child

**Visibility scoping:**
```
platform     → sees all orgs
grandfather  → self + own fathers + those fathers' children
father       → self + own children
child        → self only
```

**ACL — current state:** Admin-only (open anon RLS). Phase 2 will enforce per-tier RLS using `managed_by_org_id` and auth.uid().

---

## What Has Been Built

| Module | Status |
|---|---|
| Dashboard Shell | ✅ Done |
| Org Hierarchy UI (4-tier dropdown, tier banners, visibility scoping) | ✅ Done |
| Insurance Readiness Survey (dual-weighted scoring, trend line, savings estimator) | ✅ Done |
| Organisation Manager (full CRUD, tree view, edit modal with Risk Profile tab) | ✅ Done |
| Technology Stack Survey (10 categories, 41 questions, chip-let framework mappings) | ✅ Done |
| Tabletop Exercise Engine — Operational Track | ✅ Done |
| Supabase connectivity (all modules wired, live) | ✅ Done |
| Third-Party Risk Assessment (TPRA) — full 5-step wizard, list, detail, Supabase persistence | ✅ Done |

### TPRA — what's inside
- 5-step wizard: Vendor Intake → Vendor Profile → Risk Findings → Tier & Rationale → Review & Publish
- Vendor intake: name, product, website, assessor, data categories (sensitivity-labelled chips), jurisdiction, data residency, provided docs
- Vendor profile: company intelligence fields (legal entity, size, HQ, certifications, breach history, etc.) with Verified / Inferred / Unknown confidence labels per field
- Risk findings: area, severity (Critical→Info), confidence, applies-to toggle, detail, recommendation; plus vendor follow-up items list
- Auto-suggested tier: data sensitivity × vendor signals matrix → Critical / High / Moderate / Low with manual override
- Review & publish: summary card, "push to risk register" checkbox (risk register Phase 2), "copy report prompt for Claude" to generate a .docx report
- Assessment list view with tier/status badges; detail view (full read-only report); draft/complete/edit/delete

### Tabletop Engine — what's inside
- Step 0: Technical Lead declaration (raw signal → P1-P4 severity → declare/monitor)
- vCISO commentary card at exercise launch
- 3 ingestion types: PSA ticket, SOC alert, technician anomaly
- 2 pre-built scenarios: Ransomware via phishing (5 injects), BEC wire fraud (1 inject)
- 5 roles: IC, TL, CL, LC, ES
- Role-filtered inject cards
- NIST IR phase tracker
- Breach declaration gate (IC + ES co-sign)
- Insurer notification checklist (8 items, 72hr clock)
- After Action Report with MITRE ATT&CK, criticality accuracy scoring, IR plan comparison

### Technology Stack Survey — what's inside
- 10 categories, 41 questions
- Y / N / NA / Partial with inline partial-detail capture
- Machine tags: `tool_category`, `question_type`, `derive_strategy`
- Framework chip-lets: CIS (with IG tier), NIST CSF 2.0, Insurance
- Maturity score: Yes=1, Partial=0.5, No=0, NA=excluded
- Snapshot writes to `assessments` on save
- Export JSON for MSP catalog matching / framework auto-scoping

### Insurance Readiness Survey — scoring model
- `secW` (0–10) + `insW` (0–10) per question
- Final score = (security% × 0.4) + (insurance% × 0.6)
- Scores saved with `sec_pct` and `ins_pct` separately

---

## What to Build Next (priority order)

1. **Framework auto-scoping** — tech stack answers pre-populate CIS / NIST / Insurance survey questions via `derive_strategy`. Backlog: `ts9`.
2. **MSP tool catalog** — `msp_tools` table, join on `tool_category`. Backlog: `ts8`.
3. **Jackbox-style multiplayer for tabletop** — session code join flow, role selection, participant view, real-time inject delivery. Backlog: `mp1`–`mp15`.
4. **CIS Controls v8 survey** — full questionnaire, shortened by tech-stack auto-scoping once #1 ships. Backlog: `s6`.
5. **Optional tech stack categories** — Cloud Security Posture, Application Security. Backlog: `ts6`.
6. **PDF export** — AAR and scorecard reports, Abbott Cyber branded. Backlog: `s10`, `t41`.
7. **TPRA filter/sort** — filter vendor assessment list by tier, status, sensitivity. Backlog: `tp10`.
8. **Fix org dropdown bug** — reported May 16; `toggleOrgDD()` is implemented but needs live verification.

Full backlog with phase numbers and done flags is in `backlog.json`. Do not invent features outside the backlog without asking Mark first. Do suggest additions if you see a gap.

---

## Brand & Design

**Colours (CSS variables in `:root`):**
```css
--navy:   #152168
--navy2:  #1a2a7a
--cyan:   #07B4D9
--cyan2:  #07D1F2
--bg:     #f0f4fa
--card:   #fff
--border: #dde3ef
--text:   #1a2340
--muted:  #5a6a8a
```

**Font:** Kanit from Google Fonts — 700 headings, 400 body.

**Tier colour coding:**
- Platform: gradient navy→cyan (`.av-platform`)
- Grandfather: cyan #07B4D9 (`.av-gf`)
- Father: indigo #4f46e5 (`.av-f`)
- Child: green #16a34a (`.av-c`)

**Design principle:** Clean, professional, client-facing. Non-technical language at executive layer. Risk-based prioritisation.

---

## Code Conventions

- **No framework.** Pure HTML/CSS/JS. Everything in `index.html`.
- **CSS variables** for all colours — always use `var(--navy)` etc., never hardcode hex.
- **Reuse existing component classes:** `.card`, `.btn`, `.btn-primary`, `.btn-cyan`, `.btn-outline`, `.btn-red`, `.btn-sm`, `.badge`, `.b-navy`, `.b-green`, etc.
- **Nav:** `.nav-item`, `.nav-item.active`, `.nav-score-dot`, `.dot-green/.dot-amber/.dot-red/.dot-none`
- **Tabs:** `.view-tabs` + `.view-tab` + `.view-tab.active`
- **Tier banners:** `.tier-banner.tier-banner-platform`, `.tier-banner-gf`, etc.
- **Supabase calls:** Use `fetch` with anon key in `apikey` and `Authorization` headers. Match the existing pattern throughout the file.
- **Score dots:** Green ≥70, Amber 40–69, Red <40, None = no data.
- **Upsert pattern for techstack_responses:** POST with `Prefer: resolution=merge-duplicates`.

---

## How We Work

1. Read `backlog.json` at the start of each session.
2. Identify the next incomplete item in the current phase.
3. Tell Mark what you're about to build and **confirm before starting**.
4. Build it — edit `index.html` directly (or a new file if Mark requests it).
5. Wait for approval before marking done or moving on.
6. When approved, update `backlog.json` — set `"done": true`.

**One section at a time. Build → get approval → mark done → move on.**

New SQL goes in the next numbered `SUPABASE_PATCH_00N.sql` file. Write it, explain it, wait for Mark to run it in the Supabase SQL Editor. Never run it yourself.

---

## Build Phases

**Phase 1 (MVP core — current focus):**
- Survey Engine (CIS Controls v8)
- Org Hierarchy
- Core scoring and gap analysis

**Phase 2:**
- Risk Register (full columns, heatmap, Excel export)
- Consolidated Reporting (Grandfather and Father dashboards)
- Executive dashboard and PDF export

**Phase 3:**
- Vuln scan integration
- NIST CSF 2.0 framework expansion
- Pen test integration
- Tabletop exercise program (remaining tracks: Executive, Vendor, BCDR)
- Tabletop multiplayer engine
- After Action Reports — PDF export

---

*This project has real commercial potential — future SaaS / white-label. Build accordingly: clean structure, maintainable code, no shortcuts that would hurt a future sale.*

*Last updated: 4 June 2026 — TPRA module documented; backlog updated; .gitignore added; prototype file removed*
