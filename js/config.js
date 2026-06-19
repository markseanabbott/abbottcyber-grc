const APP_VERSION = '1.2.2';

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
function _orgScopeForRole(role, orgId, accessOrgs) {
  if (role === 'platform_admin') return allOrgs;
  if (role === 'org_admin') {
    const homeOrg = allOrgs.find(o => o.id === orgId);
    if (!homeOrg) return [];
    if (homeOrg.tier === 'grandfather') {
      const fathers = allOrgs.filter(o => o.parent_id === homeOrg.id);
      const fatherIds = fathers.map(f => f.id);
      return [homeOrg, ...fathers, ...allOrgs.filter(o => fatherIds.includes(o.parent_id))];
    }
    if (homeOrg.tier === 'father') return [homeOrg, ...allOrgs.filter(o => o.parent_id === homeOrg.id)];
    return [homeOrg];
  }
  return (accessOrgs || []).map(id => allOrgs.find(o => o.id === id)).filter(Boolean);
}

function visibleOrgs() {
  if (!currentOrg) return [];

  // View-as override: use the impersonated user's visibility scope
  if (viewAsState) {
    return _orgScopeForRole(viewAsState.role, viewAsState.org_id, viewAsState.accessOrgs);
  }

  // When authenticated, visibility is based on the auth user's role + home org,
  // not whichever org is currently selected in the switcher.
  if (typeof authState !== 'undefined' && authState?.profile) {
    const role = authState.profile.role;
    return _orgScopeForRole(role, authState.profile.org_id, authState.accessOrgs);
  }

  // Pre-auth fallback — tier-based from currentOrg
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
  { id: 'g_home', group: 'Home', icon: '🏠', items: [
    { id: 'home', icon: '🏠', label: 'Dashboard', live: true, phase: 1 },
  ]},
  { id: 'g_assessments', group: 'Assessments', icon: '📋', items: [
    { id: 'assessments', icon: '📋', label: 'Assessments Hub', live: true, phase: 1 },
    { id: 'insurance', icon: '🛡️', label: 'Insurance Readiness', live: true, phase: 1 },
    { id: 'cis', icon: '✅', label: 'CIS Controls v8', live: true, phase: 1 },
    { id: 'techstack', icon: '🖥️', label: 'Technology Stack', live: true, phase: 1 },
    { id: 'nist', icon: '🏛️', label: 'NIST CSF 2.0', live: false, phase: 3 },
  ]},
  { id: 'g_ai_readiness', group: 'AI Readiness', icon: '🤖', items: [
    { id: 'ai_readiness', icon: '🤖', label: 'AI Readiness Hub', live: true, phase: 1 },
    { id: 'ai_unified', icon: '🧩', label: 'AI Governance Assessment', live: true, phase: 1 },
    { id: 'rapid_pyramid', icon: '🔺', label: 'Rapid Pre-Assessment', live: true, phase: 1 },
  ]},
  { id: 'g_risk', group: 'Risk & Vendors', icon: '⚠️', items: [
    { id: 'tpra', icon: '🔍', label: 'Vendor Risk (TPRA)', live: true, phase: 1 },
    { id: 'riskregister', icon: '📋', label: 'Risk Register', live: true, phase: 2 },
    { id: 'vulnscan', icon: '📡', label: 'Vulnerability Scan', live: false, phase: 2 },
    { id: 'pentest', icon: '🐛', label: 'Pen Test Findings', live: false, phase: 3 },
  ]},
  { id: 'g_exercises', group: 'Exercises', icon: '🎯', items: [
    { id: 'ex_hub', icon: '📋', label: 'Exercise Hub', live: true, phase: 1 },
    { id: 'tabletop', icon: '🎯', label: 'Tabletop — Operational', live: true, phase: 3 },
    { id: 'tt_ai', icon: '🤖', label: 'Tabletop — AI Governance', live: true, phase: 1 },
    { id: 'tt_exec', icon: '💼', label: 'Tabletop — Executive', live: false, phase: 3 },
    { id: 'tt_vendor', icon: '🚛', label: 'Tabletop — Vendor', live: false, phase: 3 },
    { id: 'tt_bcdr', icon: '🔄', label: 'Tabletop — BCDR', live: false, phase: 3 },
  ]},
  { id: 'g_policies', group: 'Policies', icon: '📄', items: [
    { id: 'policy_lib', icon: '📄', label: 'Policy Library', live: true, phase: 1 },
  ]},
  { id: 'g_reporting', group: 'Reports', icon: '📊', items: [
    { id: 'scorecard', icon: '📊', label: 'Report Library', live: false, phase: 2 },
    { id: 'exec_report', icon: '📄', label: 'Executive Reports', live: false, phase: 2 },
    { id: 'portfolio', icon: '🌐', label: 'Portfolio View', live: false, phase: 2 },
    { id: 'audit', icon: '📜', label: 'Audit Readiness', live: false, phase: 3 },
  ]},
  { id: 'g_settings', group: 'Settings', icon: '⚙️', platformAdminOnly: true, items: [
    { id: 'settings', icon: '⚙️', label: 'Platform Settings', live: true, phase: 1 },
  ]},
];

// ============================================================
// PLATFORM SETTINGS — defaults; overwritten from Supabase at boot
// ============================================================
let platformSettings = {
  session_timeout_minutes:  60,
  password_min_length:      8,
  password_require_upper:   true,
  password_require_number:  true,
  password_require_special: false,
};

// ============================================================
// APP STATE
// ============================================================
let allOrgs = [];
let currentOrg = null;
let orgAssessments = {};
let activeNav = 'home';
let activeNavSection = null;
let viewAsState = null; // set when platform_admin is impersonating another user
let insState = { answers: {}, openPanels: {}, view: 'dashboard', editId: null, conductedBy: '', date: '', fromNew: false };
let tsState = null;  // Technology Stack survey state; per-org, hydrated from Supabase on enter.
let orgProfiles = {};  // keyed by org_id; hydrated at init + after profile saves
let orgModalTab = 'details';  // 'details' | 'profile'
let cisState = { answers: {}, openPanels: {}, orgId: null, view: 'dashboard', editId: null, notes: {}, openComments: {}, quickAnswers: {}, quickEditId: null, poamRun: null, poamItems: {}, poamNotes: {}, reportRun: null, reportCommentary: '' };  // CIS Controls survey state
let tpraState = null;  // Third-Party Risk Assessment state; per-org, hydrated on enter.
let nistAiState = { answers: {}, openPanels: {}, openComments: {}, notes: {}, editId: null, date: '', conductedBy: '', view: 'dashboard', reportRun: null, reportCommentary: '' };
let iso42001State = { answers: {}, openPanels: {}, openComments: {}, notes: {}, editId: null, date: '', conductedBy: '', view: 'dashboard', reportRun: null, reportCommentary: '' };
let aiUnifiedState = { answers: {}, frameworks: { nist: true, iso: true }, openPanels: {}, openComments: {}, notes: {}, editId: null, date: '', conductedBy: '', view: 'dashboard', reportRun: null, reportCommentary: '', poamRun: null, poamItems: {}, matrixRuns: [], matrixGroup: 'g1' };
