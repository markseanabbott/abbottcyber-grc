# Tabletop Exercise — UI Design Spec
> For Claude Code implementation. Read alongside `tabletop_design_brief.md` and the existing `js/tabletop.js`.
> Designed in Cowork session 2026-06-28. Implement screen by screen — get approval before moving to the next.

---

## Design Direction

**The feel:** Jackbox meets cybersecurity war room. Game cards, not GRC forms. Every screen should feel like something is at stake.

**Key shifts from the current UI:**
- Inject cards look like physical game cards (bold coloured header, labeled sections, role icons, MITRE tags)
- Role cards in the inject screen are colour-coded characters, not identical form rows
- The breach gate is a full dark-red screen — a hard interrupt, not another card
- The AAR feels like a trophy/debrief, not a form dump

---

## Colour System

Use existing CSS variables for the app chrome. Add these new variables to `:root` in `css/core.css`:

```css
/* Role colours */
--role-ic:   #b45309;   /* Incident Commander — amber */
--role-tl:   #1d4ed8;   /* Technical Lead — blue */
--role-cl:   #7c3aed;   /* Communications Lead — purple */
--role-lc:   #059669;   /* Legal / Compliance — green */
--role-es:   #c2410c;   /* Executive Sponsor — terracotta */

/* Breach / danger */
--breach-bg:     #450a0a;
--breach-head:   #7f1d1d;
--breach-text:   #fca5a5;
--breach-border: rgba(252, 165, 165, 0.2);
```

---

## Data Structure — Inject Object

Every inject must carry enough data to render the game card automatically. No hardcoded counts.

```js
{
  id: 'ransom-01',
  title: 'PMS systems encrypted — ransom demand active',
  body: 'Front desk PCs show a ransom note. OPERA PMS offline. .locky extensions on three machines. $47,000 Bitcoin demand — 72-hour timer.',
  ingestType: 'psa',          // 'psa' | 'soc' | 'technician'
  nistPhase: 'detection',     // 'prep' | 'detection' | 'containment' | 'eradication' | 'recovery' | 'post'
  primaryRoles: ['ic','tl','lc'],   // role pips lit on card; others dimmed
  mitre: [
    { tactic: 'TA0040', tech: 'T1486 — Data encrypted for impact' },
    { tactic: 'TA0001', tech: 'T1566 — Phishing: spearphishing attachment' }
  ],
  breachTrigger: false,       // true on the inject that triggers the breach gate
  facilitatorCue: {           // shown on flip side of each role card
    ic: 'Who are you calling right now — and what exactly do you tell them?',
    tl: 'Isolate or investigate first? What are you taking offline right now?',
    cl: 'Two guests already heard "computer problem." What\'s your comms strategy now?',
    lc: 'Is this reportable? What\'s your 72-hour clock obligation right now?',
    es: 'Do you approve emergency IR spend? Does the board need to know today?'
  }
}
```

The render function loops `scenario.injects` — whatever length. "Inject X of N" comes from `index + 1` and `scenario.injects.length`.

---

## Screen 1 — Setup

No major redesign needed. Small improvements:
- Scenario cards get the game-card treatment: icon box (navy bg, cyan icon), title, tagline, difficulty chip, inject count chip, industry chip
- Selected state: `border: 2px solid var(--cyan)` + subtle cyan tint background
- Show a checkmark badge (top-right) on selected card
- "Session history" list stays below, no changes needed

---

## Screen 2 — Briefing

- Wrap in a dark navy card (`background: #0f172a`, `border-radius: 10px`)
- Scenario title in white, body text in `#94a3b8`
- Role pills row: each role shown as a small coloured pill with icon + shorthand
- vCISO note: accent-coloured callout box below the dark card
- "Begin Step 0" button: navy, right-aligned

---

## Screen 3 — Step 0: TL Declaration

**The raw signal:**
- Style as a terminal/ticket window: `background: #0f172a`, monospace font, three colour dots top-right (decorative)
- Ticket metadata line above the body text in muted colour
- Source and timestamp shown as plain text above the terminal card

**Severity buttons (P1–P4):**
- P1: `background: #dc2626; color: #fff; border: none` — solid red
- P2: transparent bg, `border: 0.5px solid` warning colour, warning text colour
- P3: transparent bg, accent border + text
- P4: transparent bg, muted border + text
- Selected state adds a ring: `box-shadow: 0 0 0 2px currentColor`

**Decision buttons:**
- "Declare incident": full-width red, `background: #dc2626`
- "Monitor only": outline style, muted
- Both equal flex width, side by side

---

## Screen 4 — Inject Card (main game screen — most important)

### App header bar
```
[Navy bar]
Left: Scenario title · Facilitator name
Right: "Inject X of N" in cyan (#07D1F2) | LIVE pill
```

### NIST phase tracker
Horizontal step bar below the header. 6 steps:
`Preparation → Detection → Containment → Eradication → Recovery → Post-incident`

- Done steps: success bg + check icon in dot
- Current step: `background: var(--cyan)`, label in cyan + bold
- Upcoming: muted border, muted text
- Connecting lines: 1px, done = success colour, upcoming = border colour
- Overflow-x: auto for narrow screens

### Inject game card (left column, ~175px wide, fixed)

```
┌──────────────────────────┐
│ [COLOURED HEADER BAND]   │  ← colour by NIST phase (see below)
│  NIST PHASE LABEL        │
│  INJECT TITLE            │  uppercase, white, font-weight 500
│  [ingest badge] Inject N │  pill badge, white on translucent
├──────────────────────────┤
│ Short description        │  9–10px, muted, border-bottom
│                          │
│ MITRE ATT&CK             │  section label (9px, uppercase, muted)
│ [TA0040] T1486 — ...     │  tactic tag + technique text
│ [TA0001] T1566 — ...     │
│                          │
│ ROLES                    │  section label
│ [IC][TL][CL][LC][ES]     │  18px pip icons, dimmed if not primary
├──────────────────────────┤
│ RANSOM-01 · P1    ⚠     │  footer: code + severity icon
└──────────────────────────┘
```

**Header band colour by NIST phase:**
| Phase | Background |
|---|---|
| Preparation | `#1e3a8a` (dark blue) |
| Detection | `#1e3a8a` (dark blue) |
| Containment | `#78350f` (dark amber) |
| Eradication | `#7c2d12` (dark red-brown) |
| Recovery | `#064e3b` (dark green) |
| Post-incident | `#1e293b` (dark slate) |

**Ingest type badge colours (inside the pill on the card):**
| Type | Style |
|---|---|
| PSA ticket | amber tint text |
| SOC alert | cyan tint text |
| Technician | purple tint text |

**Role pips:**
- Active: full opacity, role colour background
- Inactive: same background, `opacity: 0.2`

### Role response rows (right column, flex: 1)

One row per role. Layout: `[icon] [name] [input field] [criticality button]`

- Icon: 22×22px, role colour background, white icon, border-radius 5px
- Name: 10px, font-weight 500, min-width 22px
- Input: flex 1, no border, transparent bg, 10px text
- Criticality button: small pill, colour-coded border+text
  - Critical: danger colour
  - High: warning colour
  - Medium: accent colour
  - Low / unset: muted

**Dimmed roles:** If a role is not in `primaryRoles` for this inject, the icon gets `opacity: 0.35` and the input placeholder reads "Not primary this inject" in muted style. Still capturable — just visually de-emphasised.

### Role card flip (facilitator cue on the back)

Each role card in the **full role-card view** (not the compact row — this is for a possible expanded view) has a flip:
- Front: role header + textarea + criticality selector
- Back: dark background (role colour at ~15% opacity over near-black), "FACILITATOR CUE" label, the cue question in large text
- Flip trigger: small rotate icon button (ti-rotate) in the card header, top-right
- CSS: `perspective: 1000px` on wrapper, `transform-style: preserve-3d`, `transition: transform 0.45s ease`
- Both faces use `backface-visibility: hidden`
- Back face: `transform: rotateY(180deg)` at rest; card gets `.flipped` class to rotate

### Action bar (bottom of inject screen)
```
[← Previous inject]    [Save]  [Save & continue →]
```
- Left: text button, muted
- Right: outline "Save" + navy "Save & continue →"
- Border-top, surface-1 background

---

## Screen 5 — Breach Gate

**This is the most dramatic screen. Full dark treatment.**

Outer wrapper: `border-radius: 12px; overflow: hidden` — no light background visible.

```
┌─────────────────────────────────────┐
│ [DARK RED HEADER: #7f1d1d]          │
│   [trigger pill — which inject]     │
│   ⚠ BREACH DECLARATION REQUIRED    │  uppercase, #fca5a5, 18px
│   Subtitle explaining what happened │
├─────────────────────────────────────┤
│ [BODY: #450a0a]                     │
│                                     │
│ Trigger explanation box             │  rgba(fca5a5, 0.08) bg
│ (what evidence triggered the gate)  │
│                                     │
│ [IC SLOT]        [ES SLOT]          │  2-column grid
│  signed ✓         awaiting…        │
│  green border     dashed border     │
│  name + time      "Sign as ES →"   │
│                                     │
│ Rationale textarea                  │  dark bg, light text
│                                     │
│ [Declare breach — start 72h clock]  │  full-width red button
│  Disabled (greyed) until both sign  │
└─────────────────────────────────────┘
```

**Co-sign slot states:**
- Unsigned: `border: 1.5px dashed rgba(fca5a5, 0.25)`, lock icon, "Awaiting sign-off"
- Signed: `border: 1.5px solid #16a34a`, `background: rgba(22,163,74,0.12)`, check icon in green, name + timestamp

**Declare button states:**
- Locked (not both signed): `opacity: 0.45; cursor: not-allowed; background: #991b1b`
- Unlocked: `background: #dc2626; cursor: pointer; opacity: 1`

---

## Screen 6 — Notification Checklist

**72-hour clock banner** (top, full-width):
- Background: `#1e0a0a`
- Border: `0.5px solid rgba(220,38,38,0.3)`, border-radius 8px
- Left: "TIME REMAINING" label + `HH:MM:SS` countdown in monospace, #fca5a5
- Right: "X of 8 complete" + a small progress bar

**Checklist items** — one per notification requirement:
- Unchecked: standard surface-2 card, 0.5px border
- Checked: success bg tint, success border, name in success text colour, timestamp right-aligned
- Checkbox: 18×18px, border-radius 4px; checked state fills with `var(--fill-success)`, shows check icon

**Recommended timing** shown as secondary text below the name (muted, 9px).

Items in order:
1. Outside cyber counsel (4h)
2. Forensic IR firm (4h)
3. Cyber insurance carrier (24–48h)
4. Law enforcement — FBI Cyber / IC3 (24h)
5. Card networks — PCI DSS (24h, if cards in scope)
6. FTC / federal regulatory (72h)
7. State Attorney General (72h)
8. Affected individuals — notification plan (72h)

---

## Screen 7 — After Action Report (AAR)

**Grade badge** (centred, top):
- 60×60px circle, `background: var(--navy)`, `color: var(--cyan)`, 24px font-weight 500
- Letter grade (A–F) derived from average rubric score
- Score out of 100 below it, 13px muted text

**Rubric** (5 rows):
Each row: `[label 155px min-width] [progress bar flex:1] [X/5 score right-aligned]`
- Bar colour: green ≥4, amber =3, red ≤2
- Bar height: 5–6px, border-radius 3px

Rubric dimensions:
1. Incident identification & declaration
2. Containment & eradication
3. Communications
4. Legal & regulatory compliance
5. Recovery & lessons learned

**Exercise timeline:**
- Left border line (2px, `var(--border)`)
- Each event: dot on the left (8px circle) + timestamp + description
- Key events (IC declaration, breach): dot colour = `var(--cyan)`
- Breach event: dot colour = `#dc2626`

**MITRE ATT&CK reveal:**
- One row per technique revealed across all injects
- Columns: inject label | tactic tag (navy bg) | technique description
- These are hidden during the exercise; revealed here as the debrief

**Export button** in the header bar (top-right): print/PDF trigger.

---

## Implementation Order (suggested)

Build and get approval one screen at a time:

1. **Inject card screen** — this is the one shown most. Get it right first.
   - App header with inject counter
   - NIST phase tracker
   - Game card component (data-driven from inject object)
   - Role response rows (compact, with dimming)
   - Action bar
2. **Step 0 — TL declaration** (terminal ticket style)
3. **Breach gate** (dark treatment)
4. **Notification checklist** (clock + checklist)
5. **AAR** (grade + rubric + timeline + MITRE reveal)
6. **Setup + briefing** (least urgent — functional already)

---

## CSS Notes

- All new styles go in `css/modules.css` under a `/* Tabletop redesign */` comment block
- Use existing CSS variables (`var(--navy)`, `var(--cyan)`, etc.) for all brand colours
- Add the new role/breach variables to `:root` in `css/core.css`
- No external libraries — CSS keyframes and transforms only for animation
- The NIST tracker and game card must be `overflow-x: auto` for mobile
- Breach gate dark backgrounds are on inner divs, not the page — the page bg stays light

---

*Generated from Cowork design session 2026-06-28. Reference `tabletop_design_brief.md` for full functional spec.*
