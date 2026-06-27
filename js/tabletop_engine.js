// ============================================================
// TABLETOP ENGINE — shared reusable engine for all tabletop tracks
// ============================================================
// Handles: scenario loading (DB + built-in fallback), inject navigation
// with branching ("choose your own adventure"), inject path tracking,
// and facilitator rubric scoring.
//
// Does NOT handle: UI rendering, Supabase session management,
// gate logic (breach, declaration) — those stay in each track adapter.
//
// Session modes:
//   'local'  — facilitator runs on one screen, group participates verbally
//   'remote' — session code issued, participants join on own devices

let tteState = {
  scenario:      null,   // normalised scenario object (see tteNormalise)
  mode:          'local',
  currentIndex:  0,      // integer index into scenario.injects[]
  injectPath:    [],     // [{index, branchTaken}] — path taken so far
  dbScenarios:   null,   // null = not loaded; [] = loaded empty; [...] = rows
};

// ============================================================
// NORMALISE — converts any scenario format to engine format
// Adds inject IDs and default linear branches where missing.
// Preserves all original fields.
// ============================================================
function tteNormalise(raw) {
  const rawInjects = raw.injects || [];
  const injects = rawInjects.map((inj, i) => ({
    ...inj,
    id: inj.id || `i${String(i).padStart(3, '0')}`,
    branches: inj.branches && inj.branches.length
      ? inj.branches
      : [{ id: 'default', label: 'Continue →', next_index: i + 1 < rawInjects.length ? i + 1 : null }],
  }));
  return {
    ...raw,
    injects,
    _source: raw._source || 'builtin',
  };
}

// ============================================================
// SCENARIO LOADING
// ============================================================

// Load all custom scenarios from Supabase (cached after first call).
async function tteLoadDbScenarios() {
  if (tteState.dbScenarios !== null) return tteState.dbScenarios;
  try {
    const rows = await sbFetch('tabletop_scenarios?order=created_at.asc', 'GET');
    tteState.dbScenarios = Array.isArray(rows) ? rows.map(r => tteNormalise({ ...r, _source: 'db' })) : [];
  } catch (e) {
    console.warn('TTE: DB scenario load failed', e);
    tteState.dbScenarios = [];
  }
  return tteState.dbScenarios;
}

// Returns all available scenarios for a given track.
// DB scenarios first, then built-ins. Pass null/undefined track for all.
async function tteGetScenarioList(track) {
  const db = await tteLoadDbScenarios();
  const builtins = typeof TT_SCENARIOS !== 'undefined'
    ? Object.values(TT_SCENARIOS).map(s => tteNormalise(s))
    : [];
  const all = [...db, ...builtins];
  return track ? all.filter(s => (s.track || 'operational') === track) : all;
}

// Load a single scenario by ID. Checks DB first, falls back to built-ins.
async function tteLoadScenario(id) {
  const db = await tteLoadDbScenarios();
  const dbMatch = db.find(s => s.id === id);
  if (dbMatch) return dbMatch;
  if (typeof TT_SCENARIOS !== 'undefined' && TT_SCENARIOS[id]) {
    return tteNormalise(TT_SCENARIOS[id]);
  }
  return null;
}

// ============================================================
// ENGINE INIT — call once per exercise session, after resolving scenario
// ============================================================
function tteInitEngine(scenario, mode) {
  tteState.scenario     = scenario ? tteNormalise(scenario) : null;
  tteState.mode         = mode || 'local';
  tteState.currentIndex = 0;
  tteState.injectPath   = [];
}

// ============================================================
// NAVIGATION
// ============================================================

function tteCurrentInject() {
  if (!tteState.scenario) return null;
  return tteState.scenario.injects[tteState.currentIndex] || null;
}

function tteBranches() {
  const inj = tteCurrentInject();
  if (!inj) return [];
  return inj.branches || [];
}

function tteHasMultipleBranches() {
  return tteBranches().length > 1;
}

function tteCanGoBack() {
  return tteState.injectPath.length > 0;
}

function tteIsLastInject() {
  const branches = tteBranches();
  return !branches.length || branches.every(b => b.next_index === null || b.next_index === undefined);
}

// Advance to next inject via a chosen branch.
// Records the branch taken in injectPath.
// Returns the next index (integer), or null if this was the last inject.
function tteNavigate(branchId) {
  if (!tteState.scenario) return null;
  const branches = tteBranches();
  const chosen = branches.find(b => b.id === branchId) || branches[0];
  if (!chosen) return null;
  tteState.injectPath.push({ index: tteState.currentIndex, branchTaken: chosen.id });
  const next = chosen.next_index !== undefined ? chosen.next_index : null;
  if (next !== null && next !== undefined) {
    tteState.currentIndex = next;
  }
  return next !== undefined ? next : null;
}

// Go back one inject step.
function ttePrev() {
  if (!tteCanGoBack()) return;
  const last = tteState.injectPath.pop();
  tteState.currentIndex = last.index;
}

// Restore engine state from a persisted inject_path (for resume/AAR).
function tteRestorePath(injectPath, scenario) {
  tteState.scenario    = scenario ? tteNormalise(scenario) : null;
  tteState.injectPath  = Array.isArray(injectPath) ? injectPath : [];
  if (!tteState.scenario) return;
  if (tteState.injectPath.length > 0) {
    const last = tteState.injectPath[tteState.injectPath.length - 1];
    const lastInj = tteState.scenario.injects[last.index];
    const branch = lastInj && lastInj.branches
      ? lastInj.branches.find(b => b.id === last.branchTaken) || lastInj.branches[0]
      : null;
    tteState.currentIndex = branch && branch.next_index != null ? branch.next_index : (last.index + 1);
  } else {
    tteState.currentIndex = 0;
  }
}

// Serialise for Supabase storage.
function ttePathJson() {
  return tteState.injectPath;
}

// ============================================================
// RUBRIC SCORING
// 5 dimensions × 1–5 facilitator score → avg → 0–100 → A–F grade
// Rubric dimensions are defined per-scenario (rubric_dimensions[]).
// Default operational dimensions used when scenario doesn't define them.
// ============================================================

const TTE_DEFAULT_RUBRIC = [
  { id: 'detection',  label: 'Detection & Severity Assessment',  desc: 'Did the team correctly identify severity and scope?' },
  { id: 'decision',   label: 'Decision Authority & Escalation',  desc: 'Were the right decisions made by the right roles?' },
  { id: 'comms',      label: 'Communications & Messaging',       desc: 'Were internal and external comms timely and appropriate?' },
  { id: 'legal',      label: 'Legal & Regulatory Awareness',     desc: 'Did the team demonstrate awareness of breach clocks and obligations?' },
  { id: 'recovery',   label: 'Recovery & Continuity',            desc: 'Were containment and recovery actions realistic and prioritized?' },
];

let _tteRubric = {};  // { [dimensionId]: { score: 1–5, notes: string } }

function tteRubricDimensions() {
  if (tteState.scenario && tteState.scenario.rubric_dimensions && tteState.scenario.rubric_dimensions.length) {
    return tteState.scenario.rubric_dimensions;
  }
  return TTE_DEFAULT_RUBRIC;
}

function tteSetRubricScore(dimensionId, score, notes) {
  _tteRubric[dimensionId] = { score: Math.min(5, Math.max(1, Number(score))), notes: notes || '' };
}

function tteGetRubric() { return { ..._tteRubric }; }

function tteClearRubric() { _tteRubric = {}; }

function tteRubricComplete() {
  const dims = tteRubricDimensions();
  return dims.every(d => _tteRubric[d.id] && _tteRubric[d.id].score);
}

function tteRubricGrade() {
  const scores = Object.values(_tteRubric).map(r => r.score);
  if (!scores.length) return null;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const pct = Math.round((avg / 5) * 100);
  if (pct >= 90) return { letter: 'A', pct, color: '#15803d', bg: '#dcfce7' };
  if (pct >= 75) return { letter: 'B', pct, color: '#1d4ed8', bg: '#dbeafe' };
  if (pct >= 60) return { letter: 'C', pct, color: '#d97706', bg: '#fef3c7' };
  if (pct >= 45) return { letter: 'D', pct, color: '#ea580c', bg: '#ffedd5' };
  return { letter: 'F', pct, color: '#dc2626', bg: '#fee2e2' };
}

// ============================================================
// BRANCH UI — renders alternative path buttons inside inject card
// Only visible when a scenario has multiple branches defined.
// saveFn: name of the JS function to call with (branchId)
// ============================================================
function tteRenderBranchPanel(saveFn) {
  const branches = tteBranches();
  if (branches.length <= 1) return '';  // linear scenario — no panel needed
  const altBranches = branches.slice(1);  // first branch = default; rest = alternatives
  return `<div style="margin-top:10px;background:#f5f3ff;border:1.5px solid #ddd6fe;border-radius:10px;padding:10px 12px">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6d28d9;margin-bottom:7px">
      Facilitator — did the team take a different path?
    </div>
    <div style="display:flex;flex-direction:column;gap:5px">
      ${altBranches.map(b => `<button class="btn btn-outline btn-sm" style="justify-content:flex-start;text-align:left;border-color:#c4b5fd;color:#6d28d9" onclick="${saveFn}('${b.id}')">
        &#x21A9; ${b.label}${b.facilitator_note ? ` <span style="font-size:10px;color:var(--muted);margin-left:4px">(${b.facilitator_note})</span>` : ''}
      </button>`).join('')}
    </div>
  </div>`;
}

// ============================================================
// EXPORTS
// ============================================================
window.tteState              = tteState;
window.tteNormalise          = tteNormalise;
window.tteLoadDbScenarios    = tteLoadDbScenarios;
window.tteGetScenarioList    = tteGetScenarioList;
window.tteLoadScenario       = tteLoadScenario;
window.tteInitEngine         = tteInitEngine;
window.tteCurrentInject      = tteCurrentInject;
window.tteBranches           = tteBranches;
window.tteHasMultipleBranches = tteHasMultipleBranches;
window.tteCanGoBack          = tteCanGoBack;
window.tteIsLastInject       = tteIsLastInject;
window.tteNavigate           = tteNavigate;
window.ttePrev               = ttePrev;
window.tteRestorePath        = tteRestorePath;
window.ttePathJson           = ttePathJson;
window.TTE_DEFAULT_RUBRIC    = TTE_DEFAULT_RUBRIC;
window.tteRubricDimensions   = tteRubricDimensions;
window.tteSetRubricScore     = tteSetRubricScore;
window.tteGetRubric          = tteGetRubric;
window.tteClearRubric        = tteClearRubric;
window.tteRubricComplete     = tteRubricComplete;
window.tteRubricGrade        = tteRubricGrade;
window.tteRenderBranchPanel  = tteRenderBranchPanel;
