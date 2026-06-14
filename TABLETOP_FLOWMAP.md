# Tabletop Exercise — Flow Reference

> Granular game flow for each tabletop track.
> Read this before running or building any tabletop module.

---

## Track Index

| Track | File | Status | Audience | Has Roles | Has Breach Gate |
|---|---|---|---|---|---|
| Operational | `js/tabletop.js` | ✅ Live | IT / Security team | Yes — 5 roles | Yes |
| AI Governance | `js/ai_tabletop.js` | ✅ Live | Cross-functional group | No | No |
| Executive | _(not built)_ | Phase 3 | C-suite / Board | TBD | TBD |
| Vendor / Third-Party | _(not built)_ | Phase 3 | Security + Procurement | TBD | TBD |
| BCDR | _(not built)_ | Phase 3 | Operations + IT + HR | TBD | TBD |

---

## Track 1 — Operational (`js/tabletop.js`)

**Audience:** IT and security team. vCISO runs as facilitator (Incident Commander role).
**Model:** Role-based. Each participant sees different information per inject. Real-time response capture per role. Multiplayer-ready (session code architecture built).

### Scenarios
| ID | Name | Injects | MITRE Tactic |
|---|---|---|---|
| ransomware-phishing | Ransomware via Phishing | 5 | Initial Access → Execution → Impact |
| bec-wire-fraud | BEC Wire Fraud | 1 | Social Engineering → Financial Fraud |

### Roles
| Code | Role | Responsibility |
|---|---|---|
| IC | Incident Commander | vCISO — leads response, calls breach |
| TL | Technical Lead | Owns Step 0 severity declaration |
| CL | Communications Lead | Internal/external comms |
| LC | Legal / Compliance | Notification, regulatory, privilege |
| ES | Executive Sponsor | Co-signs breach declaration |

### Full Flow

```
START
│
▼
SETUP
  ├── Select scenario
  ├── Enter facilitator name
  └── Select your role (IC / TL / CL / LC / ES)
      → Each participant opens the app and selects their own role
      → Role is locked once claimed (one per exercise)
│
▼
STEP 0 — TL DECLARATION  [TL role only]
  ├── Receive raw signal:
  │     PSA customer ticket  OR  SOC alert  OR  Technician anomaly
  ├── Assign severity:
  │     P1 Critical — Active breach, immediate containment
  │     P2 High     — Likely breach, escalate now
  │     P3 Medium   — Suspicious, investigate
  │     P4 Low      — Noise, monitor
  ├── Recommend:  Declare Incident  OR  Continue Monitoring
  └── Enter rationale (free text)
      → TL declaration is visible to IC only until exercise launches
│
▼
BRIEFING  [All roles]
  ├── vCISO commentary card — explains TL declaration, participant roles, exercise rules
  ├── Scenario setup text — read aloud to the full group
  └── NIST IR phase tracker initialised:
        [Preparation] → [Identification] → [Containment] → [Eradication] → [Recovery] → [Lessons Learned]
        (tracker advances as injects progress — IC controls pacing)
│
▼
INJECT LOOP  [repeats for each inject — N depends on scenario]
  │
  ├── Facilitator releases inject
  │
  ├── Each role sees ONLY their role-filtered information card
  │     Example: TL sees technical forensics; LC sees regulatory trigger language;
  │              ES sees financial impact summary; CL sees media risk angle
  │
  ├── Each participant submits:
  │     • Free-text response (what they would do / have done)
  │     • Criticality rating: Critical / High / Medium / Low
  │
  ├── Facilitator notes field (IC only — never visible to participants)
  │     Correct criticality per inject is stored here for AAR scoring
  │
  └── IC advances to next inject when responses are in
      → Inject progress bar shown (inject N of Total)
│
▼
BREACH DECLARATION GATE
  ├── IC makes recommendation:
  │     Declare Breach  — incident confirmed, IR plan activates
  │     Continue Monitoring  — not enough evidence yet
  ├── IC enters rationale
  ├── If declaring:
  │     ES must co-sign from their own screen
  │     Both IC and ES must confirm before breach is logged
  │     Breach timestamp recorded
  └── If not declaring:
        Gate bypassed — exercise proceeds directly to Notification Checklist
│
▼
INSURER NOTIFICATION CHECKLIST  [IC / facilitator]
  ├── 8 items — each toggled confirmed as group discusses
  ├── 72-hour clock reference shown per item
  └── Items:
        1. Cyber insurer notified (24–72h)
        2. Outside cyber counsel engaged (ASAP)
        3. Forensic / IR firm activated (panel preferred)
        4. Law enforcement referral assessed (FBI / IC3)
        5. Affected individuals notification planned
        6. Regulatory disclosure assessed (FTC, state AG)
        7. Media / PR response prepared
        8. Board / executive briefing delivered
│
▼
AFTER ACTION REPORT (AAR)
  ├── Summary metrics
  │     Total injects run
  │     Breach declared: Yes / No
  │     Roles who responded vs silent
  │
  ├── TL Declaration accuracy
  │     Was the severity correct? (vs facilitator's correct answer)
  │     Was the declare/monitor recommendation right?
  │
  ├── Criticality accuracy by role
  │     Per-inject: what each role rated vs the correct criticality
  │     Overall accuracy % per role
  │
  ├── MITRE ATT&CK mapping
  │     Techniques demonstrated by this scenario
  │
  ├── Full event / response timeline
  │     Chronological log of all inject responses across roles
  │
  ├── Breach declaration record
  │     IC rationale + ES co-sign timestamp (or explanation of non-declaration)
  │
  ├── IR plan comparison
  │     Facilitator notes on where exercise responses matched / diverged from the IR plan
  │
  └── 📋 Copy AAR prompt for Claude
        Bundles all above into a structured prompt — paste into Claude to get a
        formatted, client-ready After Action Report (Word-ready)
│
END
Saved to Supabase:
  tabletop_sessions   — session state, breach record, exercise log
  tabletop_responses  — per-role, per-inject responses and criticality ratings
  tabletop_participants — role claims
```

---

## Track 2 — AI Governance (`js/ai_tabletop.js`)

**Audience:** Cross-functional team (IT, Legal, HR, Executives, Operations). Any mix.
**Model:** Discussion-based. No roles. Everyone hears the same injects. Facilitator captures group notes. Ends with a US regulatory obligation review.

### Scenarios
| ID | Name | Injects | Difficulty | Audience |
|---|---|---|---|---|
| AI-01 | The Phantom Tool | 4 | Medium | All industries |
| AI-02 | The Hallucination That Went Live | 4 | Medium | Professional Services / Legal |
| AI-03 | The Deepfake Executive | 5 | Hard | All industries |
| AI-04 | Vendor AI Gone Wrong | 5 | Hard | HR / All industries |
| AI-05 | The Poisoned Prompt | 4 | Medium | Technology / Retail |
| AI-06 | The Shadow Agent | 4 | Medium | Technology / SaaS |
| AI-07 | The Training Data Leak | 4 | Hard | All industries |
| AI-08 | The Regulator Arrives | 5 | Hard | All industries |
| AI-09 | The Model Update Nobody Noticed | 3 | Medium | All industries |
| AI-10 | The Insider Prompt | 4 | Medium | All industries |

### Framework Coverage per Scenario
Each scenario maps to specific NIST AI RMF functions (GV / MP / MS / MG) and ISO/IEC 42001:2023 clauses. These are surfaced in the AAR.

### Full Flow

```
START
│
▼
SETUP
  ├── Select scenario from list
  │     Each scenario shows: summary, industry tag, duration, difficulty, inject count
  ├── Enter facilitator name
  └── No role selection — everyone participates as a group
      → Works for in-person or virtual sessions
      → Facilitator controls pacing on their screen
│
▼
BRIEFING  [Read aloud to the group]
  ├── vCISO commentary card:
  │     "This is a discussion exercise — no wrong answers.
  │      Goal: surface gaps, stress-test decisions, identify policy improvements."
  ├── Scenario setup text — the opening situation
  │     Sets the scene without revealing how the situation develops
  └── Phase tracker initialised:
        [Briefing] → [Injects] → [Discussion] → [US Regulatory] → [AAR]
│
▼
INJECT LOOP  [all participants hear the same information]
  │
  ├── Facilitator reads inject aloud to the group
  │     Each inject adds a new piece of information that escalates or complicates the situation
  │
  ├── Group discusses freely — no formal response required
  │     Facilitator uses the notes field to capture key group positions, decisions, and gaps
  │
  ├── Progress bar shown (inject N of Total)
  │
  └── Facilitator advances when discussion is complete
      → Recommended 5–10 minutes per inject
│
▼
DISCUSSION QUESTIONS  [3–5 questions per scenario]
  │
  ├── Facilitator works through each question with the group
  │
  ├── Questions probe:
  │     • Accountability — who owns this decision?
  │     • Policy gaps — what rule or process doesn't exist?
  │     • Decision-making — what would you actually do?
  │     • Regulatory exposure — what obligations apply?
  │     • Culture — what does this reveal about your AI governance posture?
  │
  ├── Group notes captured per question
  │     (free text — facilitator types key positions and agreed actions)
  │
  └── Recommended 5–8 minutes per question
│
▼
US REGULATORY CONSIDERATIONS  [10-item checklist]
  │
  ├── Group reviews which regulatory obligations may apply to this type of incident
  ├── Toggle each item confirmed as group discusses it
  │
  └── Items with clock:
        1. Cyber insurance carrier notified            24–72h
        2. Outside cyber counsel engaged               ASAP
        3. Forensic / IR firm activated                ASAP
        4. FTC / sector regulator reviewed             Varies
        5. State AG / breach notification assessed     30–72h (all 50 states)
        6. CCPA / CPRA — California consumers          Expedient
        7. HIPAA / HHS — if health data in scope       60 days
        8. SEC disclosure — if public company          4 business days
        9. Affected individuals notification planned   Per state law
       10. FBI / IC3 referral considered               Recommended
│
▼
AFTER ACTION REPORT (AAR)
  ├── Exercise summary
  │     Scenario name, facilitator, inject count, discussion questions,
  │     regulatory items reviewed count, captured notes count
  │
  ├── Framework areas triggered
  │     NIST AI RMF references for this scenario (GV / MP / MS / MG functions)
  │       e.g. GV-1.5 AI Inventory & Lifecycle Management
  │            MS-2.5 AI Hallucination & Error Detection
  │     ISO/IEC 42001:2023 clause references
  │       e.g. §8.3 AI System Operation & Monitoring
  │            §8.5.3 Human Oversight of AI Systems
  │
  ├── Inject notes  (facilitator notes from each inject)
  │
  ├── Discussion notes  (group notes from each discussion question)
  │
  └── 📋 Copy AAR prompt for Claude
        Bundles scenario, facilitator, inject notes, discussion notes, and framework
        references into a structured prompt — paste into Claude to generate a
        client-ready After Action Report
│
END
Saved to Supabase:
  assessments table — module = 'ai_tabletop'
  answers jsonb holds: scenarioId, facilitator, injectNotes, discussionNotes, notifChecks
```

---

## Track 3 — Executive _(not yet built — Phase 3)_

**Audience:** C-suite and board. Business-framed scenarios in revenue, reputation, and regulatory terms — not technical.
**Model:** Decision-inject based. Executives presented with choices: pay/don't pay, notify/delay, shut down/continue operations.
**Planned scenarios:** Ransom demand decision, regulatory breach notification, reputational crisis, M&A due diligence failure, cyber insurance claim.
**Key difference from Operational:** No technical roles. No MITRE ATT&CK. Focus on business impact, legal exposure, and stakeholder communications.

---

## Track 4 — Vendor / Third-Party _(not yet built — Phase 3)_

**Audience:** Security team + Procurement + Legal. Examines what happens when your vendor has the incident, not you.
**Model:** TBD — likely discussion-based (similar to AI Governance track).
**Planned scenarios:** Critical vendor ransomware, supply chain compromise (SolarWinds-style), vendor data breach exposing client data, vendor going dark mid-incident.
**Key difference:** Exercises vendor contract gaps, shared responsibility questions, and DPA/notification obligations as the downstream customer.

---

## Track 5 — BCDR _(not yet built — Phase 3)_

**Audience:** Operations + IT + HR. Broader than cyber — covers any disruption event.
**Model:** TBD.
**Planned scenarios:** Datacenter outage, extended power failure, pandemic/key person loss, critical supplier failure, physical site loss.
**Key difference:** Exercises RTO/RPO, BCP activation authority, and communication trees — not IR plans or breach notification.

---

## Common Patterns Across All Tracks

```
Every track shares this skeleton:

  SETUP → BRIEFING → [INJECT LOOP] → [DEBRIEF PHASE] → AAR → SAVE

What varies:
  - INJECT LOOP:  role-filtered (Operational) vs. group-heard (AI / Executive / BCDR)
  - DEBRIEF PHASE: structured Qs (AI), notification checklist (Operational + AI),
                   decision gate (Operational breach), ransom decision (Executive TBD)
  - AAR:          MITRE ATT&CK + criticality scoring (Operational)
                  vs. NIST AI RMF + ISO 42001 refs (AI Governance)
                  vs. business impact + legal debrief (Executive TBD)
  - PERSISTENCE:  session tables (Operational) vs. assessments table (AI + future tracks)
```

---

## Building a New Track — Checklist

When adding a new tabletop track, follow this pattern:

1. **New JS file** — `js/tt_[name].js`
   - Define scenario data array (id, name, injects, discussion/decision Qs, framework refs)
   - Define state object and `init()` function
   - Implement `render[Name]()` as the top-level render router
   - Build view functions for each phase (setup, briefing, inject, debrief, aar)
   - Implement `[name]SaveAndNew()` saving to `assessments` table with unique `module=` value

2. **`js/config.js`** — add nav item to `g_exercises` group

3. **`js/app.js`** — add render route: `if (activeNav === 'tt_[name]') { el.innerHTML = render[Name](); return; }`

4. **`index.html`** — add `<script src="js/tt_[name].js"></script>` before `app.js`

5. **Update this document** — add the new track's flow above

6. **`backlog.json`** — mark relevant items done

---

*Last updated: 2026-06-14 — granular per-track flows added; AI Governance (v1.1.1)*
