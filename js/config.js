// ============================================================
// MULTIPLAYER — URL routing (detect ?join= or ?display= params)
// ============================================================
const _MP_PARAMS = new URLSearchParams(window.location.search);
const _MP_JOIN  = (_MP_PARAMS.get('join')    || '').toUpperCase().trim();
const _MP_DISP  = (_MP_PARAMS.get('display') || '').toUpperCase().trim();

// Polling timers
let mpPollTimer   = null;
let dispPollTimer = null;
let facPollTimer  = null;
let facParticipants = [];

// Player session state — persisted in sessionStorage so refresh doesn't log out
function mpLoadState() { try { return JSON.parse(sessionStorage.getItem('mp_player') || 'null'); } catch { return null; } }
function mpSaveState(s) { try { sessionStorage.setItem('mp_player', JSON.stringify(s)); } catch {} }
function mpClearState() { try { sessionStorage.removeItem('mp_player'); } catch {} }

// Selected criticality for player view (in-memory)
let _mpCrit = null;
let _mpSelCard = null; // selected card index for option-card UI

// ============================================================
// TIER CONFIG
// ============================================================
const TIER_ORDER = ['platform', 'grandfather', 'father', 'child'];
const TIER_LABELS = {
  platform: 'Platform Owner — All organisations',
  grandfather: 'Grandfather — Own portfolio',
  father: 'Father — Own clients',
  child: 'Child — Self only',
};
const TIER_BANNER_CLASS = {
  platform: 'tier-banner-platform',
  grandfather: 'tier-banner-gf',
  father: 'tier-banner-father',
  child: 'tier-banner-child',
};
const TIER_ICONS = { platform: '🌐', grandfather: '🏛️', father: '👥', child: '🏢' };
const TIER_AV = { platform: 'av-platform', grandfather: 'av-gf', father: 'av-f', child: 'av-c' };

function tierAvClass(tier) { return TIER_AV[tier] || 'av-c'; }
function tierInitials(name) { return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(); }

// ============================================================
// VISIBILITY SCOPING
// ============================================================
function visibleOrgs() {
  if (!currentOrg) return [];
  if (currentOrg.tier === 'platform') return allOrgs;
  if (currentOrg.tier === 'grandfather') {
    const fathers = allOrgs.filter(o => o.parent_id === currentOrg.id);
    const fatherIds = fathers.map(f => f.id);
    const children = allOrgs.filter(o => fatherIds.includes(o.parent_id));
    return [currentOrg, ...fathers, ...children];
  }
  if (currentOrg.tier === 'father') {
    return [currentOrg, ...allOrgs.filter(o => o.parent_id === currentOrg.id)];
  }
  return [currentOrg];
}

// ============================================================
// NAV CONFIG
// ============================================================
const NAV = [
  { id: 'g_dashboard', group: 'Dashboard', icon: '🏠', items: [
    { id: 'home', icon: '🏠', label: 'Dashboard', live: true, phase: 1 },
    { id: 'orgs', icon: '🏢', label: 'Organisation Manager', live: true, phase: 1 },
  ]},
  { id: 'g_assessments', group: 'Assessments', icon: '📋', items: [
    { id: 'assessments', icon: '📋', label: 'Assessments Hub', live: true, phase: 1 },
    { id: 'insurance', icon: '🛡️', label: 'Insurance Readiness', live: true, phase: 1 },
    { id: 'cis', icon: '✅', label: 'CIS Controls v8', live: true, phase: 1 },
    { id: 'nist', icon: '🏛️', label: 'NIST CSF 2.0', live: false, phase: 3 },
    { id: 'techstack', icon: '🖥️', label: 'Technology Stack', live: true, phase: 1 },
  ]},
  { id: 'g_risk', group: 'Risk Management', icon: '⚠️', items: [
    { id: 'tpra', icon: '🔍', label: 'Vendor Risk (TPRA)', live: true, phase: 1 },
    { id: 'riskregister', icon: '📋', label: 'Risk Register', live: false, phase: 2 },
    { id: 'vulnscan', icon: '📡', label: 'Vulnerability Scan', live: false, phase: 2 },
    { id: 'pentest', icon: '🐛', label: 'Pen Test Findings', live: false, phase: 3 },
  ]},
  { id: 'g_compliance', group: 'Compliance', icon: '🔗', items: [
    { id: 'frameworks', icon: '🔗', label: 'Framework Mapping', live: false, phase: 2 },
    { id: 'audit', icon: '📜', label: 'Audit Readiness', live: false, phase: 3 },
  ]},
  { id: 'g_exercises', group: 'Exercises', icon: '🎯', items: [
    { id: 'tabletop', icon: '🎯', label: 'Tabletop — Operational', live: true, phase: 3 },
    { id: 'tt_exec', icon: '💼', label: 'Tabletop — Executive', live: false, phase: 3 },
    { id: 'tt_vendor', icon: '🚛', label: 'Tabletop — Vendor', live: false, phase: 3 },
    { id: 'tt_bcdr', icon: '🔄', label: 'Tabletop — BCDR', live: false, phase: 3 },
  ]},
  { id: 'g_reporting', group: 'Reporting', icon: '📊', items: [
    { id: 'scorecard', icon: '📊', label: 'Scorecards', live: false, phase: 2 },
    { id: 'exec_report', icon: '📄', label: 'Executive Reports', live: false, phase: 2 },
    { id: 'portfolio', icon: '🌐', label: 'Portfolio View', live: false, phase: 2 },
  ]},
];

// ============================================================
// APP STATE
// ============================================================
let allOrgs = [];
let currentOrg = null;
let orgAssessments = {};
let activeNav = 'home';
let activeNavSection = 'g_dashboard';
let insState = { answers: {}, openPanels: {} };
let tsState = null;  // Technology Stack survey state; per-org, hydrated from Supabase on enter.
let orgProfiles = {};  // keyed by org_id; hydrated at init + after profile saves
let orgModalTab = 'details';  // 'details' | 'profile'
let cisState = { answers: {}, openPanels: {}, orgId: null, view: 'dashboard', editId: null, notes: {}, openComments: {}, quickAnswers: {}, quickEditId: null, poamRun: null, poamItems: {}, poamNotes: {} };  // CIS Controls survey state
let tpraState = null;  // Third-Party Risk Assessment state; per-org, hydrated on enter.
