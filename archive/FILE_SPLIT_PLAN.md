# File Split Plan — index.html → Modular Structure

> Status: APPROVED, NOT YET EXECUTED — awaiting git setup for rollback point
> Approved: 2026-06-04

## Goal

Split index.html (~5,500 lines) into separate files by module. No build step, no framework, no bundler. Plain `<script src="...">` tags, all functions remain global. Works with file:// exactly as today.

## New Directory Structure

```
AbbottCyber GRC/
├── index.html              ← Shell only (~60 lines)
├── css/
│   ├── core.css            ← ~200 lines
│   └── modules.css         ← ~180 lines
└── js/
    ├── config.js           ← ~80 lines
    ├── supabase.js         ← ~90 lines
    ├── home.js             ← ~170 lines
    ├── orgs.js             ← ~530 lines
    ├── insurance.js        ← ~210 lines
    ├── cis.js              ← ~400 lines
    ├── techstack.js        ← ~670 lines
    ├── tpra.js             ← ~690 lines
    ├── tabletop.js         ← ~1,300 lines
    ├── multiplayer.js      ← ~340 lines
    └── app.js              ← ~130 lines  ← LOADS LAST
```

## File Contents

| File | Contents |
|---|---|
| **index.html** | `<head>`, Google Fonts, `<link>` CSS tags, static sidebar/topbar/modal HTML, `<script>` tags in load order |
| **css/core.css** | CSS variables, reset, body, layout, sidebar, nav items, org switcher, topbar, all shared components (`.btn`, `.card`, `.badge`, `.modal`, tabs, form inputs, tier banners, score dots) |
| **css/modules.css** | Tabletop styles, tech stack survey styles, multiplayer (player + display), assessments hub table, CIS Controls, TPRA |
| **js/config.js** | `SB_URL`, `SB_KEY`, `TIER_*` constants, `NAV` array, all app state variables (`allOrgs`, `currentOrg`, `activeNav`, `activeNavSection`, `insState`, `tsState`, `cisState`, `tpraState`, etc.), multiplayer URL params, polling timers |
| **js/supabase.js** | `sbFetch()`, the `sb` object (all API methods: orgs, assessments, profiles, techstack, tpra, tabletop/tt) |
| **js/home.js** | `ASSESSMENT_CATALOG`, `renderHome()`, `renderAssessmentsHub()`, `drawAllHubTrends()`, `duplicateAssessment()` |
| **js/orgs.js** | `ORG_INDUSTRIES`, `ORG_SUB_INDUSTRIES`, `ORG_REGULATORY`, `renderOrgManager()`, `renderOrgEditModal()`, all modal/CRUD handlers, `confirmDeleteOrg()` |
| **js/insurance.js** | `INS_SECTIONS`, `INS_SAVINGS`, all `ins*` functions, `renderInsurance()`, `drawTrend()` |
| **js/cis.js** | `CIS_SAFEGUARDS`, all `cis*` functions, `renderCIS()` |
| **js/techstack.js** | `TS_CATS`, `tsInit()`, all `ts*` functions, `renderTechStack()` |
| **js/tpra.js** | `TPRA_DATA_CATEGORIES`, `TPRA_PROFILE_ATTRS`, `TPRA_FINDING_AREAS`, all `tpra*` functions |
| **js/tabletop.js** | `TT_ROLES`, `TT_NIST_PHASES`, `TT_SCENARIOS`, `TT_NOTIF_ITEMS`, `ttState`, all `tt*` functions, all `fac*` facilitator helpers |
| **js/multiplayer.js** | `mpBoot()`, all `mp*` player-join functions, `dispBoot()`, `dispRender()`, all `disp*` display-screen functions |
| **js/app.js** | `toast()`, `visibleOrgs()`, `loadOrgProfiles()`, `loadAssessments()`, `init()`, `updateOrgUI()`, org dropdown helpers, nav helpers (`buildNav`, `toggleNavSection`, `setNav`), `renderTierBanner()`, `renderMain()` — `init()` call at bottom |

## Load Order in index.html

```html
<link rel="stylesheet" href="css/core.css">
<link rel="stylesheet" href="css/modules.css">

<!-- ...static HTML body... -->

<script src="js/config.js"></script>
<script src="js/supabase.js"></script>
<script src="js/home.js"></script>
<script src="js/orgs.js"></script>
<script src="js/insurance.js"></script>
<script src="js/cis.js"></script>
<script src="js/techstack.js"></script>
<script src="js/tpra.js"></script>
<script src="js/tabletop.js"></script>
<script src="js/multiplayer.js"></script>
<script src="js/app.js"></script>   <!-- init() runs at bottom of this file -->
```

`app.js` loads last because `renderMain()` references render functions from every module —
they must be in global scope before `renderMain()` executes.

## Notes

- `escH()` (HTML escape utility) is duplicated — defined in general utils AND inside tpra block.
  Will be canonicalised in `app.js` and removed from `tpra.js`.
- All functions remain global (no `type="module"`) — no behavior change anywhere.
- Adding a new module in future: create `js/newmodule.js`, add one `<script>` line before `app.js`,
  add one `if` block to `renderMain()` in app.js, add CSS to `modules.css`.

## Execution Instructions (when ready)

1. Confirm git is initialised and current state is committed.
2. Run the split in one pass — no intermediate broken states.
3. Test all live modules after split: Dashboard, Org Manager, Insurance, CIS IG1/2/3,
   Tech Stack, TPRA, Tabletop, Assessments Hub.
4. Confirm multiplayer join (?join=CODE) and display (?display=CODE) still route correctly.
