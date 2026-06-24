async function loadOrgProfiles() {
  try {
    const rows = await sb.profiles.getAll();
    orgProfiles = {};
    (rows || []).forEach(p => { orgProfiles[p.org_id] = p; });
  } catch (e) { console.warn('Profile load failed', e); }
}

// bootApp — loads data and renders the app shell.
// Called after auth is confirmed (either via stored session or fresh login).
async function bootApp() {
  // Multiplayer URL routing — intercept before normal app boot
  if (_MP_JOIN) { mpBoot(_MP_JOIN); return; }
  if (_MP_DISP) { dispBoot(_MP_DISP); return; }
  try {
    allOrgs = await sb.orgs();

    // Set initial org based on auth user's primary org (not always platform)
    if (authState.profile) {
      const homeOrg = allOrgs.find(o => o.id === authState.profile.org_id);
      currentOrg = homeOrg || allOrgs.find(o => o.tier === 'platform') || allOrgs[0];
    } else {
      currentOrg = allOrgs.find(o => o.tier === 'platform') || allOrgs[0];
    }

    await Promise.all([loadAssessments(currentOrg.id), loadOrgProfiles(), loadPlatformSettings()]);

    document.getElementById('dbStatus').className = 'db-status db-live';
    document.getElementById('dbStatus').textContent = '● Live';
    document.getElementById('userChipContainer').innerHTML = renderUserMenu();

    const hashNav = location.hash.slice(1);
    const validNavIds = NAV.flatMap(g => g.items).map(i => i.id);
    if (hashNav && validNavIds.includes(hashNav)) activeNav = hashNav;
    updateOrgUI(); buildNav(); renderMain();
    idleStart();
  } catch (e) {
    document.getElementById('dbStatus').className = 'db-status db-error';
    document.getElementById('dbStatus').textContent = 'DB Error';
    document.getElementById('mainContent').innerHTML = `
      <div style="text-align:center;padding:2rem">
        <div style="font-size:28px;margin-bottom:0.75rem">⚠️</div>
        <div style="font-size:14px;font-weight:700;color:var(--red);margin-bottom:6px">Database connection failed</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:1rem;max-width:420px;margin-left:auto;margin-right:auto">${e.message}</div>
        <button class="btn btn-primary btn-sm" onclick="bootApp()">Retry</button>
      </div>`;
  }
}

// startApp — entry point. Checks auth, shows login screen or boots app.
async function startApp() {
  document.getElementById('appShell').style.display = 'none';
  const authed = await authBootstrap();
  if (!authed) {
    document.body.insertAdjacentHTML('beforeend', renderLoginScreen());
    return;
  }
  document.getElementById('appShell').style.display = '';
  await bootApp();
}

function toast(msg, col = '#152168') {
  const el = document.getElementById('toast');
  el.textContent = msg; el.style.background = col;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

async function loadAssessments(orgId) {
  if (orgAssessments[orgId]) return;
  try {
    const rows = await sb.assessments(orgId);
    orgAssessments[orgId] = {};
    (rows || []).forEach(r => {
      if (!orgAssessments[orgId][r.module]) orgAssessments[orgId][r.module] = [];
      orgAssessments[orgId][r.module].push({ id: r.id, date: r.assessed_at, score: r.score, secPct: r.sec_pct, insPct: r.ins_pct, answers: r.answers || {}, conductedBy: r.conducted_by || '' });
    });
  } catch (e) { orgAssessments[orgId] = {}; }
}

function updateOrgUI() {
  if (!currentOrg) return;
  const av = tierAvClass(currentOrg.tier);
  const ini = tierInitials(currentOrg.name);
  const topAv = document.getElementById('topAv');
  if (topAv) { topAv.className = 'org-avatar ' + av; topAv.textContent = ini; }
  const topName = document.getElementById('topOrgName');
  if (topName) topName.textContent = currentOrg.name;
}

// ============================================================
// ORG DROPDOWN
// ============================================================
function toggleOrgDD() {
  const dd = document.getElementById('orgDD');
  const open = dd.style.display === 'block';
  if (!open) buildOrgDropdown();
  dd.style.display = open ? 'none' : 'block';
  document.getElementById('orgChev').textContent = open ? '▾' : '▴';
}

function buildOrgDropdown() {
  const dd = document.getElementById('orgDD');
  const switchable = visibleOrgs();
  const switchableIds = new Set(switchable.map(o => o.id));
  let h = '';

  function renderNode(o, depth) {
    const indent = depth * 14;
    const prefix = depth > 0
      ? `<span style="color:rgba(255,255,255,0.25);margin-right:4px;font-size:10px">${'—'.repeat(depth)}</span>`
      : '';
    h += `<div class="org-option${currentOrg?.id === o.id ? ' selected' : ''}" onclick="selectOrg('${o.id}')" style="padding-left:${8 + indent}px">
      <div class="org-avatar ${tierAvClass(o.tier)}" style="flex-shrink:0">${tierInitials(o.name)}</div>
      <div style="min-width:0">${prefix}<span class="org-opt-name">${o.name}</span></div>
    </div>`;
    // Render children in name order
    switchable
      .filter(c => c.parent_id === o.id)
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(c => renderNode(c, depth + 1));
  }

  // Roots = orgs whose parent is not in the switchable set (or have no parent)
  switchable
    .filter(o => !o.parent_id || !switchableIds.has(o.parent_id))
    .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) || a.name.localeCompare(b.name))
    .forEach(o => renderNode(o, 0));

  dd.innerHTML = h || '<div style="padding:10px;font-size:11px;color:rgba(255,255,255,0.4)">No organisations</div>';
}

async function selectOrg(id) {
  currentOrg = allOrgs.find(o => o.id === id);
  document.getElementById('orgDD').style.display = 'none';
  document.getElementById('orgChev').textContent = '▾';
  insState = { answers: {}, openPanels: {}, view: 'dashboard', editId: null, conductedBy: '', date: '', fromNew: false };
  cisState = { answers: {}, openPanels: {}, orgId: null, view: 'dashboard', editId: null, notes: {}, openComments: {}, quickAnswers: {}, quickEditId: null, poamRun: null, poamItems: {}, poamNotes: {}, reportRun: null, reportCommentary: '' };
  tsState = null;  // tech stack state is per-org — force reload on next view
  tpraState = null;  // TPRA state is per-org — force reload on next view
  nistAiState = { answers: {}, openPanels: {}, openComments: {}, notes: {}, editId: null, date: '', conductedBy: '', view: 'dashboard', reportRun: null, reportCommentary: '' };
  iso42001State = { answers: {}, openPanels: {}, openComments: {}, notes: {}, editId: null, date: '', conductedBy: '', view: 'dashboard', reportRun: null, reportCommentary: '' };
  aiUnifiedState = { answers: {}, frameworks: { nist: true, iso: true }, openPanels: {}, openComments: {}, notes: {}, editId: null, date: '', conductedBy: '', view: 'dashboard', reportRun: null, reportCommentary: '', poamRun: null, poamItems: {}, matrixRuns: [], matrixGroup: 'g1' };
  if (ttState) { ttState.completedSessions = null; ttState.historicalSession = null; }
  exHubState = { opSessions: null };
  if (typeof maState !== 'undefined') maState = { view:'list', stepIdx:0, editId:null, list:[], listLoaded:false, saving:false, detailTab:'summary', expandedFindings:{}, framing:{ target_name:'', deal_type:'', target_industry:'', target_employee_band:'', deal_value_band:'', risk_tolerance:'moderate', assessor:'', assessed_at:'', data_sources:[], include_ai_screen:false, include_insurance_review:false }, answers:{}, poamItems:{}, currentAssessment:null };
  await loadAssessments(id);
  updateOrgUI(); buildNav(); renderMain();
}

document.addEventListener('click', e => {
  if (!e.target.closest('.org-selector')) {
    const dd = document.getElementById('orgDD');
    if (dd) dd.style.display = 'none';
    const chev = document.getElementById('orgChev');
    if (chev) chev.textContent = '▾';
  }
  if (!e.target.closest('.user-menu')) {
    const udd = document.getElementById('userMenuDD');
    if (udd) udd.style.display = 'none';
  }
});

// ============================================================
// PLATFORM SETTINGS LOADER
// ============================================================
async function loadPlatformSettings() {
  try {
    const rows = await sb.settings.get();
    if (rows?.[0]) Object.assign(platformSettings, rows[0]);
  } catch (e) { console.warn('Platform settings load failed — using defaults', e); }
}

// ============================================================
// IDLE TIMEOUT ENGINE
// ============================================================
let _idleTimer = null;
let _idleWarnTimer = null;
let _idleCountdownInterval = null;

function idleReset() {
  if (!platformSettings.session_timeout_minutes) return;
  clearTimeout(_idleTimer);
  clearTimeout(_idleWarnTimer);
  clearInterval(_idleCountdownInterval);
  const modal = document.getElementById('idleWarningModal');
  if (modal) modal.style.display = 'none';

  const totalMs = platformSettings.session_timeout_minutes * 60 * 1000;
  const warnMs  = totalMs - (2 * 60 * 1000);

  if (warnMs > 0) _idleWarnTimer = setTimeout(idleShowWarning, warnMs);
  _idleTimer = setTimeout(idleSignOut, totalMs);
}

function idleShowWarning() {
  const modal = document.getElementById('idleWarningModal');
  if (!modal) return;
  modal.style.display = 'flex';
  let secs = 120;
  const el = document.getElementById('idleCountdown');
  if (el) el.textContent = secs;
  _idleCountdownInterval = setInterval(() => {
    secs--;
    const el2 = document.getElementById('idleCountdown');
    if (el2) el2.textContent = secs;
    if (secs <= 0) clearInterval(_idleCountdownInterval);
  }, 1000);
}

function idleExtend() { idleReset(); }

async function idleSignOut() {
  clearInterval(_idleCountdownInterval);
  const modal = document.getElementById('idleWarningModal');
  if (modal) modal.style.display = 'none';
  await doSignOut();
}

function idleStart() {
  if (!platformSettings.session_timeout_minutes) return;
  ['mousemove','keydown','click','scroll','touchstart'].forEach(ev =>
    document.addEventListener(ev, idleReset, { passive: true })
  );
  idleReset();
}

function idleStop() {
  clearTimeout(_idleTimer);
  clearTimeout(_idleWarnTimer);
  clearInterval(_idleCountdownInterval);
}

// ============================================================
// SIDEBAR
// ============================================================
function getModuleDot(id) {
  if (!currentOrg || ['home', 'tabletop', 'tt_ai', 'orgs', 'assessments', 'ma_cdd'].includes(id)) return 'dot-none';
  const h = (orgAssessments[currentOrg.id] || {})[id];
  if (!h || !h.length) return 'dot-none';
  const s = h[h.length - 1].score;
  return s >= 75 ? 'dot-green' : s >= 50 ? 'dot-amber' : 'dot-red';
}

const _GROUP_MODULE = {
  g_assessments: 'assessments',
  g_ai_readiness: 'ai',
  g_risk: 'risk',
  g_exercises: 'exercises',
  g_reporting: 'reports',
};

function _hasItemAccess(moduleKey) {
  if (!moduleKey) return true;
  const role = viewAsState?.role || authState?.profile?.role;
  if (!role || role === 'platform_admin') return true;
  const access = viewAsState?.module_access ?? authState?.profile?.module_access;
  if (!access) return true;
  return access[moduleKey] !== false;
}

function hasModuleAccess(groupId) {
  const role = viewAsState?.role || authState?.profile?.role;
  if (!role || role === 'platform_admin') return true; // only platform_admin bypasses module access
  const access = viewAsState?.module_access ?? authState?.profile?.module_access;
  if (!access) return true; // NULL = full access (existing users unaffected)
  const key = _GROUP_MODULE[groupId];
  if (!key) return true; // g_home always visible
  return access[key] !== false;
}

async function viewAsUser(userId) {
  const user = userMgmtState?.users?.find(u => u.id === userId);
  if (!user) return;
  let accessOrgs = [];
  if (['analyst','viewer'].includes(user.role)) {
    try {
      const rows = await sb.userOrgAccess.getForUser(userId);
      accessOrgs = (rows || []).map(r => r.org_id);
    } catch {}
  }
  viewAsState = {
    name: user.name || user.email,
    email: user.email,
    role: user.role,
    org_id: user.org_id,
    module_access: user.module_access || null,
    accessOrgs,
  };
  const homeOrg = allOrgs.find(o => o.id === user.org_id);
  if (homeOrg) currentOrg = homeOrg;
  activeNav = 'home';
  activeNavSection = null;
  updateOrgUI();
  document.getElementById('userChipContainer').innerHTML = renderUserMenu();
  updateViewAsBanner();
  buildNav();
  renderMain();
  toast(`Viewing as ${viewAsState.name}`, '#92400e');
}

function exitViewAs() {
  viewAsState = null;
  const myOrg = allOrgs.find(o => o.id === authState.profile?.org_id) || allOrgs[0];
  if (myOrg) currentOrg = myOrg;
  activeNav = 'home';
  activeNavSection = null;
  updateOrgUI();
  document.getElementById('userChipContainer').innerHTML = renderUserMenu();
  updateViewAsBanner();
  buildNav();
  renderMain();
  toast('Returned to your own account', '#152168');
}

function updateViewAsBanner() {
  const banner = document.getElementById('viewAsBanner');
  if (!banner) return;
  if (!viewAsState) {
    banner.style.display = 'none';
    banner.innerHTML = '';
    return;
  }
  const roleLabels = { platform_admin: 'Platform Admin', org_admin: 'Org Admin', analyst: 'Analyst', viewer: 'View Only' };
  const org = allOrgs.find(o => o.id === viewAsState.org_id);
  banner.style.display = '';
  banner.innerHTML = `<div class="view-as-banner">
    <span style="font-size:16px">🔍</span>
    <span>Viewing as <strong>${escH(viewAsState.name)}</strong> — ${roleLabels[viewAsState.role] || viewAsState.role}${org ? ' · ' + escH(org.name) : ''}</span>
    <span style="color:#b45309;font-size:11px">Writes disabled in preview mode</span>
    <button onclick="exitViewAs()" style="margin-left:auto;background:#92400e;color:#fff;border:none;padding:4px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">Exit View As</button>
  </div>`;
}

function buildNav() {
  const vEl = document.getElementById('sidebarVersion');
  if (vEl) vEl.textContent = `v${APP_VERSION}`;
  const adminUser = typeof isAdmin === 'function' ? isAdmin() : true;
  const platformAdmin = typeof isPlatformAdmin === 'function' ? isPlatformAdmin() : true;
  document.getElementById('sidebarNav').innerHTML = NAV.map(g => {
    if (!hasModuleAccess(g.id)) return '';
    if (g.platformAdminOnly && !platformAdmin) return '';
    const visibleItems = g.items.filter(item => (!item.adminOnly || adminUser) && _hasItemAccess(item.moduleKey));
    if (!visibleItems.length) return '';
    // Single-item groups render as flat items (no accordion wrapper)
    if (visibleItems.length === 1) {
      const item = visibleItems[0];
      return `<div class="nav-item-flat${item.id === activeNav ? ' active' : ''}" onclick="setNav('${item.id}')">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
        ${item.live ? `<span class="nav-score-dot ${getModuleDot(item.id)}" style="margin-left:auto"></span>` : ''}
      </div>`;
    }
    const isOpen = g.id === activeNavSection;
    return `
    <div class="nav-section">
      <div class="nav-section-hdr${isOpen ? ' open' : ''}" onclick="toggleNavSection('${g.id}')">
        <span class="nav-icon">${g.icon}</span>
        <span>${g.group}</span>
        <span class="nav-section-chevron">▶</span>
      </div>
      <div class="nav-section-children${isOpen ? ' open' : ''}">
        ${visibleItems.map(item => `
        <div class="nav-item${item.id === activeNav ? ' active' : ''}" onclick="setNav('${item.id}')">
          <span class="nav-icon">${item.icon}</span>
          <span>${item.label}</span>
          ${item.live ? `<span class="nav-score-dot ${getModuleDot(item.id)}"></span>` : `<span style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.2);margin-left:auto">P${item.phase}</span>`}
        </div>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function toggleNavSection(id) {
  activeNavSection = activeNavSection === id ? null : id;
  buildNav();
}

const _ADMIN_PAGES = { orgs: 'Organisation Manager', users: 'User Management' };

function setNav(id, { pushState = true } = {}) {
  activeNav = id;
  const item = NAV.flatMap(g => g.items).find(i => i.id === id);
  const group = NAV.find(g => g.items.some(i => i.id === id));
  if (group) activeNavSection = group.id;
  const adminLabel = _ADMIN_PAGES[id];
  document.getElementById('breadcrumb').innerHTML = adminLabel
    ? `<span style="color:var(--muted)">Admin</span> <span style="color:var(--muted)">›</span> <span style="color:var(--text);font-weight:700">${adminLabel}</span>`
    : `${group && visibleItems(group) > 1 ? `<span style="color:var(--muted)">${group.group}</span> <span style="color:var(--muted)">›</span> ` : ''}<span style="color:var(--text);font-weight:700">${item ? item.label : id}</span>`;
  if (pushState) history.pushState({ nav: id }, '', '#' + id);
  buildNav(); renderMain();
}

window.addEventListener('popstate', e => {
  const id = e.state?.nav || (location.hash.slice(1)) || 'home';
  setNav(id, { pushState: false });
});

function visibleItems(group) {
  const adminUser = typeof isAdmin === 'function' ? isAdmin() : true;
  return group.items.filter(i => !i.adminOnly || adminUser).length;
}

// ============================================================
// TIER BANNER
// ============================================================
function renderTierBanner() {
  if (!currentOrg) return '';
  const icon = TIER_ICONS[currentOrg.tier] || '🏢';
  const label = TIER_LABELS[currentOrg.tier] || currentOrg.tier;
  const bannerClass = TIER_BANNER_CLASS[currentOrg.tier] || 'tier-banner-child';
  const vis = visibleOrgs().length;
  return `<div class="tier-banner ${bannerClass}">
    <span style="font-size:16px">${icon}</span>
    <div style="flex:1"><span style="font-weight:700">${currentOrg.name}</span> <span style="font-weight:400;opacity:0.7">— ${label}</span></div>
    <span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:99px;background:rgba(255,255,255,0.15);color:inherit">Visibility: ${vis} org${vis !== 1 ? 's' : ''}</span>
  </div>`;
}

// ============================================================
// MAIN RENDER ROUTER
// ============================================================
function viewOnlyBanner() {
  if (!isViewOnly()) return '';
  return `<div style="background:#fef3c7;border:1px solid #f59e0b;color:#92400e;padding:8px 14px;
    border-radius:8px;font-size:12px;font-weight:600;margin-bottom:1rem;display:flex;align-items:center;gap:6px">
    <span>👁</span> View-only access — assessments and data are read-only for your account
  </div>`;
}

function renderMain() {
  const el = document.getElementById('mainContent');
  if (!el) return;
  if (!currentOrg && !['users','settings'].includes(activeNav)) {
    el.innerHTML = '<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">No organisation selected.</div>';
    return;
  }
  const voB = viewOnlyBanner();  // empty string unless role=viewer
  if (activeNav === 'users') { el.innerHTML = renderUserManagement(); return; }
  if (activeNav === 'settings') { el.innerHTML = renderSettings(); setTimeout(settingsLoad, 50); return; }
  if (activeNav === 'backlog') {
    if (!blmState.items.length && !blmState.loading) {
      blmState.loading = true;
      el.innerHTML = renderBacklogManager();
      blmLoad().then(() => { if (activeNav === 'backlog') el.innerHTML = renderBacklogManager(); });
    } else {
      el.innerHTML = renderBacklogManager();
    }
    return;
  }
  if (activeNav === 'company_profile') { el.innerHTML = renderCompanyProfile(); return; }
  if (activeNav === 'home') {
    el.innerHTML = renderHome();
    setTimeout(drawHomeCharts, 80);
    if (rrState.orgId !== currentOrg?.id) {
      rrLoad().then(() => { if (activeNav === 'home') { el.innerHTML = renderHome(); setTimeout(drawHomeCharts, 80); } });
    }
    return;
  }
  if (activeNav === 'assessments') { el.innerHTML = voB + renderAssessmentsHub(); setTimeout(drawAllHubTrends, 80); return; }
  if (activeNav === 'insurance') { el.innerHTML = voB + renderInsurance(); drawTrend(); return; }
  if (activeNav === 'cis') { el.innerHTML = voB + renderCIS(); setTimeout(() => { const c = document.getElementById('cisTrendChart'); if (c) cisTrendDraw(); if (cisState.view === 'report') drawReportCharts(); }, 80); return; }  // trend draw covers both dashboard + form views
  if (activeNav === 'orgs') { el.innerHTML = renderOrgManager(); setTimeout(updateParentOptions, 100); return; }
  if (activeNav === 'ex_hub') { el.innerHTML = renderExHub(); return; }
  if (activeNav === 'policy_lib') { el.innerHTML = renderPolicyLib(); return; }
  if (activeNav === 'tabletop') { el.innerHTML = renderTabletop(); return; }
  if (activeNav === 'tt_ai') { el.innerHTML = renderAiTabletop(); return; }
  if (activeNav === 'techstack') {
    if (!tsState || tsState.orgId !== currentOrg.id) {
      tsInit();
      tsState.orgId = currentOrg.id;
      el.innerHTML = renderTechStack();   // render loading state immediately
      tsLoadResponses().then(() => tsRender());
    } else {
      el.innerHTML = renderTechStack();
    }
    return;
  }
  if (activeNav === 'ai_readiness') { el.innerHTML = voB + renderAiHub(); setTimeout(initAiReadinessHub, 50); return; }
  if (activeNav === 'rapid_pyramid') { el.innerHTML = voB + renderRapidPreAssessment(); setTimeout(() => initRapidPyramid(), 50); return; }
  if (activeNav === 'ai_unified') { el.innerHTML = voB + renderAiUnified(); setTimeout(() => { const c = document.getElementById('aiuTrendChart'); if (c) aiuTrendDraw(); if (aiUnifiedState.view === 'report') { const run = aiUnifiedState.reportRun; if (run) { const ans = Object.fromEntries(Object.entries(run.answers||{}).filter(([k])=>!k.startsWith('_'))); const fw = aiuFrameworksFromRun(run); const gs = aiuCalcGroupScores(ans, fw); aiuDrawRadar('aiurep-radar', gs); const pyrEl = document.getElementById('aiurep-pyr'); if (pyrEl) initAiPyramid('aiurep', false, aiuBuildPyramidState(ans), false); } } }, 80); return; }
  if (activeNav === 'cmmc') { el.innerHTML = voB + renderCMMC(); setTimeout(() => { const c = document.getElementById('cmmcTrendChart'); if (c) cmmcTrendDraw(); if (cmmcState.view === 'report') drawCmmcReportCharts(); }, 80); return; }
  if (activeNav === 'cmmc2') { el.innerHTML = voB + renderCMMC2(); setTimeout(() => { const c = document.getElementById('cmmc2TrendChart'); if (c) cmmc2TrendDraw(); if (cmmc2State.view === 'report') drawCmmc2ReportCharts(); }, 80); return; }
  if (activeNav === 'nist_ai') { el.innerHTML = voB + renderNistAi(); setTimeout(() => { const c = document.getElementById('nistAiTrendChart'); if (c) nistAiTrendDraw(); }, 80); return; }
  if (activeNav === 'iso42001') { el.innerHTML = voB + renderIso42001(); setTimeout(() => { const c = document.getElementById('iso42001TrendChart'); if (c) iso42001TrendDraw(); }, 80); return; }
  if (activeNav === 'riskregister') {
    if (!rrState || rrState.orgId !== currentOrg?.id) {
      rrState.loading = true;
      rrState.orgId = currentOrg?.id;
      el.innerHTML = renderRiskRegister();
      rrLoad().then(() => { if (activeNav === 'riskregister') el.innerHTML = renderRiskRegister(); });
    } else {
      el.innerHTML = renderRiskRegister();
    }
    return;
  }
  if (activeNav === 'ma_cdd') {
    if (!maState.listLoaded) {
      maState.listLoaded = true;
      el.innerHTML = renderMACDD();
      maLoadList().then(() => { if (activeNav === 'ma_cdd') el.innerHTML = renderMACDD(); });
    } else {
      el.innerHTML = renderMACDD();
    }
    return;
  }
  if (activeNav === 'tpra') {
    if (!tpraState || tpraState.orgId !== currentOrg.id) {
      tpraInit();
      el.innerHTML = renderTierBanner() + `<div style="text-align:center;padding:2rem;color:var(--muted)">
        <div class="spinner" style="border-color:rgba(21,33,104,0.2);border-top-color:var(--navy);width:20px;height:20px;margin:0 auto 0.75rem"></div>
        <div style="font-size:12px">Loading vendor assessments…</div>
      </div>`;
      tpraLoadAssessments().then(() => {
        if (activeNav === 'tpra') el.innerHTML = renderTierBanner() + renderTPRAList();
      });
    } else {
      el.innerHTML = renderTPRAInner();
    }
    return;
  }
  const item = NAV.flatMap(g => g.items).find(i => i.id === activeNav);
  el.innerHTML = `<div class="coming-soon">
    <div style="font-size:32px;margin-bottom:0.5rem">${item ? item.icon : '🔧'}</div>
    <div style="font-size:14px;font-weight:700;margin-bottom:4px">${item ? item.label : activeNav}</div>
    <div style="font-size:12px;color:var(--muted)">This module is on the roadmap.</div>
    <div class="cs-phase">Phase ${item ? item.phase : '?'}</div>
  </div>`;
}

function escH(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

startApp();
