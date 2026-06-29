# Tabletop Exercise — Design Brief for Mockups

> Created for: Claude Cowork visual design mockups
> Purpose: Redesign the tabletop experience from text-heavy/utilitarian to something visually engaging — closer to a game than a form.
> Platform: Web app, desktop-primary but must work on mobile (participants will join on phones)

---

## Who Uses This

**Facilitator (vCISO — Mark Abbott):** Runs the exercise on a laptop, often projected on a screen for the whole group. Controls the session, reads injects aloud, captures group responses.

**Participants (3–5 people):** Executives, IT staff, legal, comms leads. Not tech people. They play roles in the exercise — Incident Commander, Technical Lead, Communications Lead, Legal/Compliance, Executive Sponsor. In the future (remote mode), they join from their own devices.

---

## The 5 Roles

Each role has a badge, icon, and distinct color identity — the design should make roles feel like characters.

| Role | Icon | Shorthand |
|---|---|---|
| Incident Commander | 🧭 | IC |
| Technical Lead | 🛠️ | TL |
| Communications Lead | 📣 | CL |
| Legal / Compliance | ⚖️ | LC |
| Executive Sponsor | 👔 | ES |

---

## Current State — What Exists Today

The tabletop module is functional but entirely text-based. Every screen is a `<div class="card">` with form inputs, text areas, and plain buttons. It works — but it looks like a GRC form, not a game.

### Screen Flow (current, facilitated local mode)

```
[SETUP] → [COMMENTARY] → [STEP 0: TL DECLARATION] → [INJECT 1] → [INJECT 2...N]
                                                          ↓ (if breach trigger fires)
                                                    [BREACH GATE]
                                                          ↓
                                                    [NOTIFICATION CHECKLIST]
                                                          ↓
                                                    [AFTER ACTION REPORT]
```

### Screen-by-screen: what's there now

**1. SETUP screen**
- Dropdown to select organization
- Text field: facilitator name
- Two mode toggles: Local (facilitated) / Remote (session code) — remote not yet built
- List of scenario cards (title, industry badge, duration, difficulty, inject count)
- Scenario cards are plain `div` boxes with text and small badges
- History list below: completed sessions for the org with "View AAR" links

**2. COMMENTARY screen** (briefing before the exercise starts)
- Dark navy card with scenario summary and "how this runs" instructions
- A lobby panel showing who has joined (if remote mode — in progress)
- Two buttons: Back to setup / Begin Step 0

**3. STEP 0: TL DECLARATION screen**
- A "raw signal" box — the first thing the team hears. A realistic dispatch message.
  - Example: *"Front desk PC is showing pop-ups demanding payment. Files won't open and have weird extensions. Two other front desk machines look the same. Guests waiting to check in."*
- Ingest type badge: PSA ticket / SOC alert / Technician anomaly
- Source label: which client/contact it came from
- Textarea: TL initial assessment ("what's going on?")
- Severity buttons: P1 Critical / P2 High / P3 Medium / P4 Low
- Decision buttons: Declare incident / Monitor only
- Submit → moves to inject stream

**4. INJECT screens** (the heart of the game — 3–5 injects per scenario)
- A progress header bar (scenario name, session code, facilitator name)
- A NIST IR phase tracker across the top: Preparation → Detection & Analysis → Containment → Eradication → Recovery → Post-Incident
- The inject card:
  - Badge: inject number, ingest type, NIST phase
  - Title: headline of what just happened
  - Body: 3–5 sentences of situation detail (written like a real ticket or alert)
- Role cards below (currently a 2-column grid, 5 cards):
  - Each shows: role icon + name
  - Role-specific prompt (what *this* role needs to decide right now)
  - Textarea for the facilitator to capture the response
  - Criticality selector: Critical / High / Medium / Low
- Action buttons: Previous inject / Save responses / Save & continue →

**5. BREACH GATE screen** (triggered mid-exercise when evidence confirms a breach)
- Red/dark warning card
- ES (Executive Sponsor) reminder — "you are not playing yourself"
- Co-sign grid: IC sign + ES sign — both required before breach is declared
- Textarea: rationale for the declaration
- Once both signed: "Declare breach →" button activates and starts the 72-hour clock

**6. NOTIFICATION CHECKLIST screen**
- 72-hour countdown clock (starts from breach timestamp)
- 8 checklist items — each with a label, detail, and recommended timing:
  1. Cyber insurance carrier (24–48h)
  2. Outside cyber counsel (4h)
  3. Forensic IR firm (4h)
  4. Law enforcement — FBI Cyber Division / IC3 (24h)
  5. FTC / federal regulatory (72h)
  6. State Attorney General — privacy notification (72h)
  7. Card networks — PCI DSS (24h, if cards in scope)
  8. Affected individuals — notification plan (72h)
- Checkboxes with timestamps when checked

**7. AFTER ACTION REPORT (AAR) screen**
- Rubric scoring card: 5 dimensions × 1–5 scale
  1. Incident Identification & Declaration
  2. Containment & Eradication
  3. Communications
  4. Legal & Regulatory Compliance
  5. Recovery & Lessons Learned
- Score summary: average → letter grade (A–F)
- Timeline: key events logged during the exercise
- Per-inject response review: what each role said, vs correct criticality
- MITRE ATT&CK mapping (tactic + technique revealed for each inject)
- Breach declaration record (if applicable)
- Score dots vs correct criticality comparison
- AI-generated narrative (if enabled in premium tier)

---

## What the Scenarios Look Like

There are 6 built-in scenarios + the ability to add custom ones:

| Scenario | Industry | Difficulty | Injects |
|---|---|---|---|
| Ransomware via Phishing | Hospitality | Hard | 5 |
| Business Email Compromise — Wire Fraud | Technology / SaaS | Medium | 4 |
| Overnight Vishing — Fake PMS Support Call | Hospitality | Medium | 4 |
| POS Skimmer — F&B and Spa Terminals | Hospitality | Hard | 4 |
| RMM Compromise — MSP Supply Chain Pivot | MSP | Hard | 4 |
| Reservation System Breach — Guest PII on Dark Web | Hospitality | Hard | 4 |

Each scenario has a brief, a declaration signal (the "alarm" that starts the game), and a chain of injects that escalate in complexity. Some injects trigger the breach gate.

---

## Future State — What's Being Built Next

### Mode 2: Remote Facilitated (building now — Steps 36–50)
Same exercise, but participants are on their own phones/laptops. They join via a 6-character session code (Jackbox-style). The facilitator still controls the pace on their screen. Each participant sees only their own role card and submits their own response. The facilitator sees all responses in real time.

New screens needed:
- **Session code entry screen** — participant enters the 6-char code to join
- **Role selection screen** — pick your role, enter name, role locks
- **Participant waiting room** — see who else has joined, status dots per role
- **Participant inject card** — filtered to just their role (no other roles visible)
- **Participant response submission** — their text box + criticality selector
- **Facilitator response feed** — live grid showing responses as they come in

### Mode 3: AI Autonomous (building after Steps 51–98)
No facilitator at all. The AI runs the whole exercise:
- Participants join, roles fill, game auto-launches
- AI delivers injects via real-time push
- AI evaluates responses after each inject, routes to the correct next inject based on what the team missed
- At the end: AI writes the full AAR, sends a shareable link to all participants

This is a genuinely new product feel — participants should feel like they're inside a game with a live narrator/referee, not filling in a GRC form.

---

## Design Intent — What to Aim For

### The feeling we want
- **Jackbox meets cybersecurity war room.** The game is serious content but visually alive.
- **The inject should feel like incoming news.** When a new inject hits, it should feel like an alert just fired — urgency, colour, motion.
- **Roles are characters.** Each role card should feel distinct — colour-coded, icon-led.
- **Progress matters.** Players should always know where they are in the scenario arc.
- **The breach gate is a moment.** When the team declares a breach, it should feel weighty — red, dramatic, co-sign feels like two keys turning simultaneously.
- **The AAR is the trophy.** The After Action Report should feel like a proper debrief document, not a form dump.

### Colour language (from existing brand)
```
Navy:       #152168  — authority, framework
Cyan:       #07B4D9  — active, live, "go"
Cyan2:      #07D1F2  — highlights
Background: #f0f4fa
Cards:      #ffffff
Borders:    #dde3ef
Text:       #1a2340
Muted:      #5a6a8a
```

Functional colours to add:
- **Breach red:** #dc2626 — used for the breach gate, Critical badges, danger moments
- **Amber/warning:** #b45309 — High severity, caution states
- **Green/resolved:** #16a34a — completed steps, signed states, good news
- **Deep alert:** near-black dark card (#1a0a00 or dark red gradient) for breach screens

### Severity / criticality colour coding
- Critical → red badge
- High → amber badge
- Medium → blue badge
- Low → gray badge
- P1–P4 buttons should follow the same pattern

---

## Specific Screens to Mockup

Please design mockups for these key screens in priority order:

### Priority 1 — Core Game Loop (facilitated local)

**A. Scenario selection card** (on the Setup screen)
- Richer scenario card: cover image or icon, scenario name, big difficulty badge (Hard/Medium), industry chip, duration, inject count
- Selected state should feel "picked" not just a border colour change
- Maybe a short flavor text / teaser on hover

**B. Step 0 — TL Declaration** (the opening alarm)
- The raw signal should feel like an incoming dispatch — ticker tape, alert banner, or message bubble
- Source and ingest type should be immediately readable
- Severity buttons (P1–P4) should be bold and color-coded, not plain text
- "Declare incident" should feel like a red button you commit to

**C. Inject card** (main game screen — shown the most)
- The inject situation should be the visual hero — large, clear, urgent
- NIST phase tracker as a horizontal progress arc or step bar
- Role cards in a grid — each role clearly color-coded with a distinct icon
- Role prompt text should be styled like a direct instruction ("Your call, IC...")
- Response textarea and criticality selector per role
- Inject counter (Inject 2 of 5) should feel like a game level indicator

**D. Breach gate** (the dramatic moment)
- Full-screen dark red treatment
- Two "key slots" — IC sign and ES sign — with clear signed/unsigned state
- Dramatic "BREACH DECLARED" confirmation on completion
- 72-hour clock starting visually

**E. Notification checklist**
- 8 items as checklist cards with a running clock
- Each item shows recommended timing and checks off with a timestamp
- Visual progress bar showing how many are complete

**F. AAR — After Action Report**
- Score card at the top with grade and rubric bars
- Clean timeline below
- Per-inject expandable sections showing responses vs correct answer
- MITRE ATT&CK tags on each inject
- Print/share ready styling

---

### Priority 2 — Remote Facilitated Mode (Jackbox flow)

**G. Participant join screen**
- Big 6-char code entry (like Jackbox's "Enter room code")
- Name entry, role selection grid
- Clean, mobile-first — this is on a phone

**H. Role selection grid**
- 5 role cards with icon, name, status (open/taken)
- "I am the Incident Commander" — bold selection
- Waiting state after selection

**I. Participant waiting room**
- Role dots showing who has joined
- Session name + code displayed
- "Waiting for exercise to begin…" with a subtle animation

**J. Participant inject card (phone view)**
- Just their role, their prompt, their response field
- Criticality selector is big (touch-friendly)
- Submit button is clear and satisfying

---

### Priority 3 — AI Autonomous (future)

**K. AI narration / autonomous inject delivery**
- Who is "speaking" when AI delivers an inject? A narrator card? A vCISO avatar?
- Post-inject AI debrief: "What you got right / what you missed" card before next inject
- Autonomous breach gate — AI evaluates and triggers the gate automatically

---

## Screen Transition / Flow Notes

- Setup → Commentary: feels like a briefing room
- Commentary → Step 0: tone shift — "the alarm has fired, real time now"
- Step 0 → Inject 1: urgency ramps up, the clock is implied
- Inject N → Breach Gate: a hard interrupt, the whole screen changes
- Breach Gate → Notification: relief, but a new clock starts
- Notification → AAR: debrief mode — slower, analytical, deliverable-ready
- Historical AAR view: same as live AAR but read-only, with edit rubric option

---

## Technical Constraints for Design

- **Single HTML file app** — all CSS must be inline or via `css/core.css` and `css/modules.css`. No external component libraries.
- **Vanilla JS** — no React, no framework. All interaction is DOM manipulation.
- **No SVG animation libraries** — keep transitions to CSS keyframes and transforms only.
- **Mobile responsive required** — participant screens (G–J above) will be on 375px phones. Facilitator screens can be 1024px desktop-primary.
- **Dark mode for breach/danger screens** — the breach gate and high-severity states use dark backgrounds. The rest of the app is light.
- **Existing CSS variables** — the design must use `var(--navy)`, `var(--cyan)`, etc. New variables can be added but must follow the naming pattern.

---

*Last updated: 2026-06-28*
*Status: Design brief — for mockups only, not yet implemented*
