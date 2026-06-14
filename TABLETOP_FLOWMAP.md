# Tabletop Exercise — Flow Reference

> One-page mindmap of how each tabletop track works.
> Read this before running or building any tabletop module.

---

## Two Tracks

```
Abbott Cyber GRC — Tabletop Program
│
├── Operational Track  (js/tabletop.js)      ← Role-based, multiplayer-ready
│   Designed for IT/security teams with the vCISO as facilitator.
│   Roles receive different information per inject. Has a breach gate.
│
└── AI Governance Track  (js/ai_tabletop.js) ← Discussion-based, no roles
    Designed for cross-functional groups. Everyone sees everything.
    No breach gate. Ends with a US regulatory checklist.
```

---

## Operational Track — Game Flow

```
START
│
▼
SETUP
  ├── Select scenario  (Ransomware / BEC / future scenarios)
  ├── Enter facilitator name
  └── Select your role
        IC  — Incident Commander (vCISO)
        TL  — Technical Lead
        CL  — Communications Lead
        LC  — Legal / Compliance
        ES  — Executive Sponsor
│
▼
STEP 0 — TL DECLARATION  ← only the TL completes this
  ├── Raw signal received  (PSA ticket / SOC alert / technician anomaly)
  ├── Assign severity:  P1 Critical / P2 High / P3 Medium / P4 Low
  ├── Recommend:  Declare Incident  OR  Continue Monitoring
  └── Rationale captured
│
▼
BRIEFING
  ├── vCISO commentary card  (exercise framing for the group)
  ├── Scenario setup read aloud
  └── NIST IR phase tracker initialised
        Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned
│
▼
INJECT LOOP  (repeats for each inject — 1 to N)
  ├── Facilitator reads inject aloud
  ├── Each role sees only their role-filtered information card
  ├── Each participant submits:
  │     - Free-text response
  │     - Criticality rating  (Critical / High / Medium / Low)
  └── Facilitator can advance to next inject once responses are in
│
▼
BREACH DECLARATION GATE
  ├── IC recommends: Declare Breach  OR  Continue Monitoring
  ├── IC provides rationale
  ├── Executive Sponsor must co-sign the declaration
  └── Breach timestamp logged when both confirm
        (If no breach declared, gate is bypassed — exercise continues to AAR)
│
▼
INSURER NOTIFICATION CHECKLIST
  ├── 8-item checklist — each item toggled confirmed by facilitator
  ├── 72-hour clock reference shown per item
  └── Items cover: carrier, counsel, regulators, individuals, media, law enforcement
│
▼
AFTER ACTION REPORT (AAR)
  ├── Summary metrics:  injects run, breach declared Y/N, roles who responded
  ├── TL Declaration accuracy  (was severity correct in hindsight?)
  ├── Criticality accuracy by role  (did each role rate injects correctly?)
  ├── MITRE ATT&CK technique mapping for this scenario
  ├── Full event / response timeline
  ├── Breach declaration record  (IC rationale + ES co-sign timestamp)
  ├── IR plan comparison  (facilitator notes vs what the IR plan says to do)
  └── 📋 Copy AAR prompt for Claude  → paste into Claude → get client Word doc
│
END — session saved to Supabase (tabletop_sessions + tabletop_responses)
```

---

## AI Governance Track — Game Flow

```
START
│
▼
SETUP
  ├── Select scenario  (AI-01 through AI-10)
  │     Scenarios cover: shadow AI, deepfakes, vendor AI surveillance,
  │     prompt injection, training data leaks, regulatory audit, insider
  │     prompt abuse, hallucination in production, shadow AI agents, model updates
  ├── Enter facilitator name
  └── No role selection — everyone participates as a group
│
▼
BRIEFING
  ├── vCISO commentary card  (discussion framing, rules of engagement)
  ├── Scenario setup read aloud to the full group
  └── Phase tracker initialised:
        Briefing → Injects → Discussion → US Regulatory → AAR
│
▼
INJECT LOOP  (sequential — no role filtering)
  ├── Facilitator reads inject aloud to the group
  ├── Group discusses freely — no structured response required
  ├── Facilitator captures key points in the notes field per inject
  └── Advance when discussion is complete
│
▼
DISCUSSION QUESTIONS
  ├── 3–5 structured questions per scenario
  ├── Facilitator works through each question with the group
  ├── Group notes captured per question  (5–8 min per question recommended)
  └── Questions probe: accountability gaps, decision-making, policy failures,
      regulatory exposure, cultural issues
│
▼
US REGULATORY CHECKLIST
  ├── 10-item checklist — group reviews which obligations apply to this scenario
  ├── Items cover US law only:
  │     Cyber insurance carrier  (24–72h)
  │     Outside counsel          (ASAP)
  │     Forensic / IR firm       (ASAP)
  │     FTC / sector regulator   (varies)
  │     State AG / breach notif  (30–72h — all 50 states)
  │     CCPA / CPRA              (CA consumers)
  │     HIPAA / HHS              (if health data — 60 days)
  │     SEC 8-K disclosure       (if public co — 4 business days)
  │     Affected individuals     (per state law)
  │     FBI / IC3 referral       (recommended)
  └── Toggle each item confirmed as the group discusses it
│
▼
AFTER ACTION REPORT (AAR)
  ├── Exercise summary:  injects, discussion Qs, regulatory items reviewed
  ├── Framework areas triggered:
  │     NIST AI RMF references  (GV / MP / MS / MG functions)
  │     ISO/IEC 42001:2023 clause references
  ├── Inject notes  (facilitator notes from inject phase)
  ├── Discussion notes  (group notes from discussion phase)
  └── 📋 Copy AAR prompt for Claude  → paste into Claude → get client Word doc
│
END — session saved to Supabase (assessments table, module = ai_tabletop)
```

---

## Key Differences at a Glance

| Feature | Operational | AI Governance |
|---|---|---|
| Roles | Yes — 5 roles (IC/TL/CL/LC/ES) | None — full group |
| Role-filtered injects | Yes | No |
| Breach declaration gate | Yes — IC + ES co-sign | No |
| Regulatory checklist | Canadian (PIPEDA) + insurer | US only (CCPA, FTC, state law) |
| Framework references | NIST IR, MITRE ATT&CK | NIST AI RMF, ISO 42001 |
| Multiplayer-ready | Yes (session code, Supabase) | No (facilitator-only flow) |
| Persistence | tabletop_sessions + participants + responses | assessments (module=ai_tabletop) |
| AAR Claude prompt | Yes | Yes |

---

## Scenarios at a Glance

### Operational
| ID | Name | Injects |
|---|---|---|
| ransomware-phishing | Ransomware via Phishing | 5 |
| bec-wire-fraud | BEC Wire Fraud | 1 |

### AI Governance
| ID | Name | Injects | Difficulty |
|---|---|---|---|
| AI-01 | The Phantom Tool | 4 | Medium |
| AI-02 | The Hallucination That Went Live | 4 | Medium |
| AI-03 | The Deepfake Executive | 5 | Hard |
| AI-04 | Vendor AI Gone Wrong | 5 | Hard |
| AI-05 | The Poisoned Prompt | 4 | Medium |
| AI-06 | The Shadow Agent | 4 | Medium |
| AI-07 | The Training Data Leak | 4 | Hard |
| AI-08 | The Regulator Arrives | 5 | Hard |
| AI-09 | The Model Update Nobody Noticed | 3 | Medium |
| AI-10 | The Insider Prompt | 4 | Medium |

---

*Last updated: 2026-06-14 — AI Governance track added (v1.1.1)*
