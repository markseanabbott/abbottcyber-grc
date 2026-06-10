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

    await Promise.all([loadAssessments(currentOrg.id), loadOrgProfiles()]);

    document.getElementById('dbStatus').className = 'db-status db-live';
    document.getElementById('dbStatus').textContent = '● Live';
    document.getElementById('userChipContainer').innerHTML = renderUserChip();

    updateOrgUI(); buildNav(); renderMain();
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
  const lbl = TIER_LABELS[currentOrg.tier] || currentOrg.tier;
  ['orgAv', 'topAv'].forEach(id => {
    const el = document.getElementById(id);
    el.className = 'org-avatar ' + av;
    el.textContent = ini;
    if (id === 'topAv') el.style.cssText = 'width:18px;height:18px;font-size:8px';
  });
  document.getElementById('orgNameEl').textContent = currentOrg.name;
  document.getElementById('orgTierEl').textContent = lbl;
  document.getElementById('topOrgName').textContent = currentOrg.name;
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
  const sectionLabels = { platform: 'Platform Owner', grandfather: 'Grandfather', father: 'Father — Groups', child: 'Child — Clients' };
  let h = '';
  TIER_ORDER.forEach(tier => {
    const orgs = switchable.filter(o => o.tier === tier);
    if (!orgs.length) return;
    h += `<div class="org-divider"></div><div class="org-section-lbl">${sectionLabels[tier]}</div>`;
    orgs.forEach(o => {
      const parent = allOrgs.find(p => p.id === o.parent_id);
      const sub = parent ? parent.name : tier === 'platform' ? 'Full platform visibility' : '';
      h += `<div class="org-option${currentOrg?.id === o.id ? ' selected' : ''}" onclick="selectOrg('${o.id}')">
        <div class="org-avatar ${tierAvClass(tier)}">${tierInitials(o.name)}</div>
        <div><div class="org-opt-name">${o.name}</div><div class="org-opt-sub">${sub}</div></div>
      </div>`;
    });
  });
  dd.innerHTML = h || '<div style="padding:10px;font-size:11px;color:rgba(255,255,255,0.4)">No organisations</div>';
}

async function selectOrg(id) {
  currentOrg = allOrgs.find(o => o.id === id);
  document.getElementById('orgDD').style.display = 'none';
  document.getElementById('orgChev').textContent = '▾';
  insState = { answers: {}, openPanels: {} };
  cisState = { answers: {}, openPanels: {}, orgId: null, view: 'dashboard', editId: null, notes: {}, openComments: {}, quickAnswers: {}, quickEditId: null, poamRun: null, poamItems: {}, poamNotes: {}, reportRun: null, reportCommentary: '' };
  tsState = null;  // tech stack state is per-org — force reload on next view
  tpraState = null;  // TPRA state is per-org — force reload on next view
  nistAiState = { answers: {}, openPanels: {}, openComments: {}, notes: {}, editId: null, date: '', conductedBy: '', view: 'dashboard', reportRun: null, reportCommentary: '' };
  iso42001State = { answers: {}, openPanels: {}, openComments: {}, notes: {}, editId: null, date: '', conductedBy: '', view: 'dashboard', reportRun: null, reportCommentary: '' };
  aiUnifiedState = { answers: {}, frameworks: { nist: true, iso: true }, openPanels: {}, openComments: {}, notes: {}, editId: null, date: '', conductedBy: '', view: 'dashboard', reportRun: null, reportCommentary: '', poamRun: null, poamItems: {} };
  await loadAssessments(id);
  updateOrgUI(); buildNav(); renderMain();
}

document.addEventListener('click', e => {
  if (!e.target.closest('.org-selector')) {
    document.getElementById('orgDD').style.display = 'none';
    document.getElementById('orgChev').textContent = '▾';
  }
});

// ============================================================
// SIDEBAR
// ============================================================
function getModuleDot(id) {
  if (!currentOrg || ['home', 'tabletop', 'orgs', 'assessments'].includes(id)) return 'dot-none';
  const h = (orgAssessments[currentOrg.id] || {})[id];
  if (!h || !h.length) return 'dot-none';
  const s = h[h.length - 1].score;
  return s >= 75 ? 'dot-green' : s >= 50 ? 'dot-amber' : 'dot-red';
}

function buildNav() {
  const adminUser = typeof isAdmin === 'function' ? isAdmin() : true;
  document.getElementById('sidebarNav').innerHTML = NAV.map(g => {
    const isOpen = g.id === activeNavSection;
    const visibleItems = g.items.filter(item => !item.adminOnly || adminUser);
    if (!visibleItems.length) return '';
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

function setNav(id) {
  activeNav = id;
  const item = NAV.flatMap(g => g.items).find(i => i.id === id);
  const group = NAV.find(g => g.items.some(i => i.id === id));
  if (group) activeNavSection = group.id;
  document.getElementById('breadcrumb').innerHTML =
    `${group ? `<span style="color:var(--muted)">${group.group}</span> <span style="color:var(--muted)">›</span> ` : ''}<span style="color:var(--text);font-weight:700">${item ? item.label : id}</span>`;
  buildNav(); renderMain();
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
  const voB = viewOnlyBanner();  // empty string unless role=viewer
  if (activeNav === 'users') { el.innerHTML = renderUserManagement(); return; }
  if (activeNav === 'home') { el.innerHTML = renderHome(); drawTrend(); return; }
  if (activeNav === 'assessments') { el.innerHTML = voB + renderAssessmentsHub(); setTimeout(drawAllHubTrends, 80); return; }
  if (activeNav === 'insurance') { el.innerHTML = voB + renderInsurance(); drawTrend(); return; }
  if (activeNav === 'cis') { el.innerHTML = voB + renderCIS(); setTimeout(() => { const c = document.getElementById('cisTrendChart'); if (c) cisTrendDraw(); if (cisState.view === 'report') drawReportCharts(); }, 80); return; }  // trend draw covers both dashboard + form views
  if (activeNav === 'orgs') { el.innerHTML = renderOrgManager(); setTimeout(updateParentOptions, 100); return; }
  if (activeNav === 'tabletop') { el.innerHTML = renderTabletop(); return; }
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
  if (activeNav === 'ai_readiness') { el.innerHTML = voB + renderAiHub(); return; }
  if (activeNav === 'ai_unified') { el.innerHTML = voB + renderAiUnified(); setTimeout(() => { const c = document.getElementById('aiuTrendChart'); if (c) aiuTrendDraw(); }, 80); return; }
  if (activeNav === 'nist_ai') { el.innerHTML = voB + renderNistAi(); setTimeout(() => { const c = document.getElementById('nistAiTrendChart'); if (c) nistAiTrendDraw(); }, 80); return; }
  if (activeNav === 'iso42001') { el.innerHTML = voB + renderIso42001(); setTimeout(() => { const c = document.getElementById('iso42001TrendChart'); if (c) iso42001TrendDraw(); }, 80); return; }
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
