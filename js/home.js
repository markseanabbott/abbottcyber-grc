// ============================================================
// HOME DASHBOARD — js/home.js
// ============================================================

// Portfolio state for the 4 stat cards.
// loadHomePortfolio() fills this async; renderHome() reads it.
let homePortfolioState = {
  scopeKey:      null,   // sorted join of scope orgIds — changes when org/scope changes
  loading:       false,
  loaded:        false,
  orgScores:     [],     // [{orgId, name, tier, composite, modules:[{id,score}]}]
  riskCounts:    { critical: 0, high: 0 },
  assessedCount: 0,
  totalCount:    0,
  breakdownOpen: false,
};

function _scoreColor(s) {
  if (s === null || s === undefined) return 'var(--text)';
  return s >= 70 ? '#15803d' : s >= 40 ? '#b45309' : '#dc2626';
}

// Returns the orgs that determine portfolio scope for the current user/org.
function _portfolioScopeOrgs() {
  if (!currentOrg) return [];
  if (currentOrg.tier === 'child') return [currentOrg];
  return [currentOrg, ...orgsUnderCurrent()];
}

// ============================================================
// PORTFOLIO LOAD
// ============================================================
async function loadHomePortfolio() {
  if (!currentOrg) return;
  const scopeOrgs = _portfolioScopeOrgs();
  const key = scopeOrgs.map(o => o.id).sort().join(',');

  // Already loaded for this scope
  if (homePortfolioState.scopeKey === key && homePortfolioState.loaded) return;
  // Already in-flight for this scope
  if (homePortfolioState.loading && homePortfolioState.scopeKey === key) return;

  homePortfolioState.loading  = true;
  homePortfolioState.scopeKey = key;
  homePortfolioState.loaded   = false;

  try {
    // Load assessments for every scope org (caches — skips already-loaded)
    await Promise.all(scopeOrgs.map(o => loadAssessments(o.id)));

    // Per-org composite scores (avg of last run per module, only modules with data)
    const MODS = ['cis', 'insurance', 'techstack'];
    const orgScores = [];
    for (const org of scopeOrgs) {
      const h    = orgAssessments[org.id] || {};
      const mods = MODS.map(m => {
        const runs = h[m] || [];
        return runs.length ? { id: m, score: runs[runs.length - 1].score } : null;
      }).filter(Boolean);
      if (!mods.length) continue;
      orgScores.push({
        orgId:     org.id,
        name:      org.name,
        tier:      org.tier,
        composite: Math.round(mods.reduce((s, m) => s + m.score, 0) / mods.length),
        modules:   mods,
      });
    }

    // Risk counts — single multi-org query
    let riskCounts = { critical: 0, high: 0 };
    try {
      const ids   = scopeOrgs.map(o => o.id).join(',');
      const risks = await sbFetch(
        `risk_register?org_id=in.(${ids})&select=inherent_risk_rating`,
        'GET', null, {}
      );
      (risks || []).forEach(r => {
        if (r.inherent_risk_rating === 'Critical')   riskCounts.critical++;
        else if (r.inherent_risk_rating === 'High')  riskCounts.high++;
      });
    } catch (_) {
      // Fallback: use already-loaded rrState for single-org
      if (rrState.orgId === currentOrg.id) {
        rrState.rows.forEach(r => {
          if (r.inherent_risk_rating === 'Critical')  riskCounts.critical++;
          else if (r.inherent_risk_rating === 'High') riskCounts.high++;
        });
      }
    }

    // Stale check — org changed while we were loading
    if (homePortfolioState.scopeKey !== key) return;

    homePortfolioState.orgScores     = orgScores;
    homePortfolioState.riskCounts    = riskCounts;
    homePortfolioState.assessedCount = orgScores.length;
    homePortfolioState.totalCount    = scopeOrgs.length;
    homePortfolioState.loaded        = true;
  } catch (_) {
    if (homePortfolioState.scopeKey === key) homePortfolioState.loaded = false;
  }

  homePortfolioState.loading = false;

  if (activeNav === 'home') {
    const mc = document.getElementById('mainContent');
    if (mc) { mc.innerHTML = renderHome(); setTimeout(drawHomeCharts, 80); }
  }
}

function homeToggleBreakdown() {
  homePortfolioState.breakdownOpen = !homePortfolioState.breakdownOpen;
  if (activeNav === 'home') {
    const mc = document.getElementById('mainContent');
    if (mc) { mc.innerHTML = renderHome(); setTimeout(drawHomeCharts, 80); }
  }
}

// Breakdown table rendered below the stat grid
function _homePortfolioBreakdown() {
  const po           = homePortfolioState;
  const excludedCount = po.totalCount - po.assessedCount;

  const sorted = [...po.orgScores].sort((a, b) => b.composite - a.composite);
  const thStyle = 'padding:.45rem .85rem;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);text-align:center';
  const modCols = ['cis', 'insurance', 'techstack'];
  const modLabels = { cis: 'CIS', insurance: 'Insurance', techstack: 'Tech Stack' };

  const bodyRows = sorted.map(o => {
    const cols = modCols.map(m => {
      const mod = o.modules.find(x => x.id === m);
      return `<td style="padding:.4rem .85rem;font-size:11px;text-align:center;color:${mod ? _scoreColor(mod.score) : '#d1d5db'}">${mod ? mod.score + '%' : '—'}</td>`;
    }).join('');
    return `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:.4rem .85rem;font-size:12px;font-weight:600;color:var(--text)">${escH(o.name)}</td>
      <td style="padding:.4rem .85rem;font-size:13px;font-weight:800;color:${_scoreColor(o.composite)};text-align:center">${o.composite}%</td>
      ${cols}
    </tr>`;
  }).join('');

  return `<div class="card" style="margin-top:-.5rem;margin-bottom:1rem;padding:0;overflow:hidden">
    <div style="padding:.6rem 1rem;background:var(--bg);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:.75rem;flex-wrap:wrap">
      <span style="font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.05em">Score Breakdown</span>
      <span style="font-size:11px;color:var(--muted)">Based on ${po.assessedCount} of ${po.totalCount} orgs with assessment data</span>
      ${excludedCount > 0 ? `<span style="font-size:11px;color:var(--muted);font-weight:600">${excludedCount} org${excludedCount!==1?'s':''} excluded — no assessments recorded</span>` : ''}
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;min-width:380px">
        <thead>
          <tr style="background:var(--bg)">
            <th style="${thStyle};text-align:left">Organization</th>
            <th style="${thStyle}">Composite</th>
            ${modCols.map(m => `<th style="${thStyle}">${modLabels[m]}</th>`).join('')}
          </tr>
        </thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
  </div>`;
}

// ============================================================
// STAT CARDS
// ============================================================

function _homeCard2(isChild, h, pLoaded, pLoading, po) {
  if (isChild) {
    // Child: compute own composite inline from already-loaded orgAssessments
    const mods = ['cis','insurance','techstack'].map(m => {
      const runs = h[m] || [];
      return runs.length ? { id: m, label: {cis:'CIS',insurance:'Insurance',techstack:'Tech Stack'}[m], score: runs[runs.length-1].score } : null;
    }).filter(Boolean);
    const composite = mods.length
      ? Math.round(mods.reduce((s, m) => s + m.score, 0) / mods.length)
      : null;
    const subLabel = mods.length ? mods.map(m => m.label).join(' · ') : 'No assessments yet';
    return `<div class="wcard">
      <div class="wcard-icon">🎯</div>
      <div class="wcard-label">Risk Score</div>
      <div class="wcard-val" style="color:${_scoreColor(composite)}">${composite !== null ? composite + '%' : '—'}</div>
      <div class="wcard-sub">${subLabel}</div>
    </div>`;
  }

  // Portfolio: father / grandfather / platform
  const score = (pLoaded && po.orgScores.length)
    ? Math.round(po.orgScores.reduce((s, o) => s + o.composite, 0) / po.orgScores.length)
    : null;
  const excluded = pLoaded ? po.totalCount - po.assessedCount : 0;
  const metaNote = pLoaded
    ? `Based on ${po.assessedCount} of ${po.totalCount} org${po.totalCount!==1?'s':''}`
    : (pLoading ? 'Loading portfolio…' : '—');
  const excludedNote = pLoaded && excluded > 0
    ? ` · ${excluded} with no data`
    : '';
  const breakdownBtn = (pLoaded && po.orgScores.length > 0)
    ? `<div style="margin-top:5px">
        <button onclick="event.stopPropagation();homeToggleBreakdown()"
          style="background:none;border:none;color:var(--cyan);font-size:11px;font-weight:700;cursor:pointer;padding:0;font-family:inherit">
          ${po.breakdownOpen ? '▲ Hide breakdown' : '▾ Show breakdown'}
        </button>
      </div>`
    : '';

  const valHtml = score !== null
    ? `<span style="color:${_scoreColor(score)}">${score}%</span>`
    : `<span style="color:var(--muted);font-size:20px">${pLoading ? '…' : '—'}</span>`;

  return `<div class="wcard">
    <div class="wcard-icon">🎯</div>
    <div class="wcard-label">Portfolio Risk Score</div>
    <div class="wcard-val">${valHtml}</div>
    <div class="wcard-sub">${metaNote}${excludedNote}</div>
    ${breakdownBtn}
  </div>`;
}

function _homeCard3(isChild, h, pLoaded, pLoading, po) {
  let crit = 0, high = 0, ready = false;

  if (pLoaded) {
    crit  = po.riskCounts.critical;
    high  = po.riskCounts.high;
    ready = true;
  } else if (isChild && rrState.orgId === currentOrg.id) {
    // Fallback for child: use already-loaded rrState
    rrState.rows.forEach(r => {
      if (r.inherent_risk_rating === 'Critical') crit++;
      else if (r.inherent_risk_rating === 'High') high++;
    });
    ready = true;
  }

  const total     = crit + high;
  const valColor  = !ready ? 'var(--text)' : (total > 0 ? '#dc2626' : '#15803d');
  const subLabel  = !ready ? (pLoading ? 'Loading…' : '—')
                  : total === 0 ? 'None logged'
                  : `${crit} Critical · ${high} High`;
  const valHtml   = !ready
    ? `<span style="color:var(--muted);font-size:20px">${pLoading ? '…' : '—'}</span>`
    : `<span style="color:${valColor}">${total}</span>`;

  return `<div class="wcard">
    <div class="wcard-icon">⚠️</div>
    <div class="wcard-label">Open Critical Risks</div>
    <div class="wcard-val">${valHtml}</div>
    <div class="wcard-sub">${subLabel}</div>
  </div>`;
}

function _homeCard4(isChild, h, pLoaded, pLoading, po) {
  if (isChild) {
    // Last assessed date
    const allRuns = Object.values(h).flat();
    const lastDate = allRuns.length
      ? [...allRuns].sort((a, b) => (b.date||'').localeCompare(a.date||''))[0].date
      : null;
    return `<div class="wcard">
      <div class="wcard-icon">📅</div>
      <div class="wcard-label">Last Assessed</div>
      <div class="wcard-val" style="font-size:${lastDate?'15px':'22px'}">${lastDate ? lastDate.slice(0,10) : '—'}</div>
      <div class="wcard-sub">${lastDate ? 'Most recent assessment' : 'Never assessed'}</div>
    </div>`;
  }

  // Assessment Coverage
  const covPct  = (pLoaded && po.totalCount > 0)
    ? Math.round((po.assessedCount / po.totalCount) * 100)
    : null;
  const excluded = pLoaded ? po.totalCount - po.assessedCount : 0;
  const valHtml  = covPct !== null
    ? `<span style="color:${_scoreColor(covPct)}">${covPct}%</span>`
    : `<span style="color:var(--muted);font-size:20px">${pLoading ? '…' : '—'}</span>`;
  const subLabel = pLoaded
    ? `${po.assessedCount} of ${po.totalCount} org${po.totalCount!==1?'s':''} assessed${excluded > 0 ? ` · ${excluded} with no data` : ''}`
    : (pLoading ? 'Loading…' : '—');

  return `<div class="wcard">
    <div class="wcard-icon">📊</div>
    <div class="wcard-label">Assessment Coverage</div>
    <div class="wcard-val">${valHtml}</div>
    <div class="wcard-sub">${subLabel}</div>
  </div>`;
}

// ============================================================
// HOME DASHBOARD — MAIN RENDER
// ============================================================

function orgsUnderCurrent() {
  if (!currentOrg) return [];
  const authVisible = new Set(visibleOrgs().map(o => o.id));
  if (currentOrg.tier === 'platform') {
    return allOrgs.filter(o => o.id !== currentOrg.id && authVisible.has(o.id));
  }
  const directChildren = allOrgs.filter(o => o.parent_id === currentOrg.id && authVisible.has(o.id));
  const childIds = new Set(directChildren.map(o => o.id));
  const grandchildren = allOrgs.filter(o => childIds.has(o.parent_id) && authVisible.has(o.id));
  return [...directChildren, ...grandchildren];
}

function _renderGettingStartedBanner() {
  const profileDone   = !!(orgProfiles[currentOrg?.id]?.employee_count_band);
  const techStackDone = (orgAssessments[currentOrg?.id]?.techstack || []).length > 0;
  if (profileDone && techStackDone) return '';

  const doneCount = [profileDone, techStackDone].filter(Boolean).length;
  const row = (done, text, nav) => done
    ? `<div style="display:flex;align-items:center;gap:.5rem">
        <span style="color:#15803d;font-size:13px;flex-shrink:0">✅</span>
        <span style="font-size:12px;color:var(--muted);text-decoration:line-through">${text}</span>
       </div>`
    : `<div style="display:flex;align-items:center;gap:.5rem">
        <span style="color:#94a3b8;font-size:13px;flex-shrink:0">☐</span>
        <span style="font-size:12px"><a onclick="setNav('${nav}')" style="color:#dc2626;cursor:pointer;font-weight:600">${text}</a></span>
       </div>`;

  return `<div style="border-left:3px solid #f59e0b;background:#fffbeb;padding:.65rem 1rem;border-radius:0 8px 8px 0;margin-bottom:1rem;display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap">
    <div style="flex:1;min-width:180px">
      <div style="font-size:10px;font-weight:700;color:#92400e;margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.05em">Getting Started</div>
      <div style="display:flex;flex-direction:column;gap:.3rem">
        ${row(profileDone,   'Complete your Organization Profile',        'company_profile')}
        ${row(techStackDone, 'Complete your Technology Stack assessment', 'techstack')}
      </div>
    </div>
    <div style="font-size:11px;color:#92400e;font-weight:700;white-space:nowrap">${doneCount} of 2 complete</div>
  </div>`;
}

function renderHome() {
  if (!currentOrg) return '';

  // Kick off portfolio data load if stale or missing
  const _scopeKey = _portfolioScopeOrgs().map(o => o.id).sort().join(',');
  if (!homePortfolioState.loaded || homePortfolioState.scopeKey !== _scopeKey) {
    loadHomePortfolio();
  }

  // Background-load AI widget data if those widgets are in the layout and data is stale
  _homeBackgroundLoadAI();

  // Kick off gap data load if stale — grLoad() will re-render home when done
  if (typeof grLoad === 'function' && (!grState.loaded || grState.orgId !== currentOrg.id)) {
    grLoad();
  }

  const h        = orgAssessments[currentOrg.id] || {};
  const isChild  = currentOrg.tier === 'child';
  const po       = homePortfolioState;
  const pLoaded  = po.loaded  && po.scopeKey === _scopeKey;
  const pLoading = po.loading && po.scopeKey === _scopeKey;

  // Module access gate
  const _can = (gid) => typeof hasModuleAccess === 'function' ? hasModuleAccess(gid) : true;

  // Quick links
  const quickLinks = [
    { id:'insurance',  icon:'🛡️', label:'Insurance Readiness', group:'g_assessments' },
    { id:'techstack',  icon:'🖥️', label:'Technology Stack',    group:'g_assessments' },
    { id:'cis',        icon:'✅', label:'CIS Controls',         group:'g_assessments' },
    { id:'tpra',       icon:'🔍', label:'Vendor Risk',          group:'g_assessments' },
    { id:'tabletop',   icon:'🎯', label:'Tabletop',             group:'g_exercises' },
    { id:'ai_unified', icon:'🤖', label:'AI Readiness',         group:'g_ai_readiness' },
  ].filter(l => _can(l.group));

  // Risk register rows for risk widget
  const rrLoaded = rrState.orgId === currentOrg.id;
  const rrRows = rrLoaded
    ? [...rrState.rows]
        .filter(r => r.source === 'cis_poam' || r.source === 'manual')
        .sort((a, b) => {
          const o = { Critical: 0, High: 1, Medium: 2, Low: 3 };
          return (o[a.inherent_risk_rating] ?? 4) - (o[b.inherent_risk_rating] ?? 4);
        })
        .slice(0, 8)
    : null;

  // Stat cards
  const card1 = `<div class="wcard">
    <div class="wcard-icon">${TIER_ICONS[currentOrg.tier]}</div>
    <div class="wcard-label">Tier</div>
    <div class="wcard-val" style="font-size:14px">${currentOrg.tier.charAt(0).toUpperCase() + currentOrg.tier.slice(1)}</div>
    <div class="wcard-sub">${currentOrg.name}</div>
  </div>`;

  const card2 = _homeCard2(isChild, h, pLoaded, pLoading, po);
  const card3 = _homeCard3(isChild, h, pLoaded, pLoading, po);
  const card4 = _homeCard4(isChild, h, pLoaded, pLoading, po);

  const breakdownPanel = (!isChild && po.breakdownOpen && pLoaded && po.orgScores.length > 0)
    ? _homePortfolioBreakdown()
    : '';

  const mainArea = dashCustomize.open
    ? _renderCustomizePanel()
    : _renderWidgetGrid(h, rrRows, rrLoaded);

  return `
  ${renderTierBanner()}
  ${_renderGettingStartedBanner()}

  <div class="welcome-grid">
    ${card1}${card2}${card3}${card4}
  </div>

  ${breakdownPanel}

  <div style="display:flex;align-items:center;justify-content:space-between;margin:.75rem 0 ${dashCustomize.open ? '.5rem' : '.85rem'}">
    ${!dashCustomize.open && quickLinks.length ? `<div style="display:flex;gap:.5rem;flex-wrap:wrap">
      ${quickLinks.map(l => {
        const runs = h[l.id] || [];
        const last = runs.length ? runs[runs.length - 1] : null;
        const dot  = last ? (last.score >= 70 ? '#15803d' : last.score >= 40 ? '#b45309' : '#dc2626') : '#cbd5e1';
        return `<button onclick="setNav('${l.id}')" style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border:1px solid var(--border);border-radius:20px;background:#fff;font-size:12px;font-weight:600;color:var(--text);cursor:pointer;transition:all .15s" onmouseover="this.style.borderColor='var(--cyan)';this.style.color='var(--cyan)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text)'">
          <span style="width:7px;height:7px;border-radius:50%;background:${dot};flex-shrink:0"></span>
          ${l.icon} ${l.label}
        </button>`;
      }).join('')}
    </div>` : '<div></div>'}
    <button class="btn btn-outline btn-sm" onclick="toggleDashCustomize()" style="flex-shrink:0;${dashCustomize.open ? 'border-color:var(--navy);font-weight:700;color:var(--navy)' : ''}">
      ${dashCustomize.open ? '✕ Cancel' : '📐 Customize'}
    </button>
  </div>

  ${mainArea}`;
}

// ============================================================
// WIDGET SYSTEM — Custom Dashboard
// ============================================================

const WIDGET_CATALOG = [
  { id: 'cis',             label: 'CIS Controls v8',          icon: '✅', nav: 'cis',             type: 'score',    desc: '' },
  { id: 'insurance',       label: 'Insurance Readiness',      icon: '🛡️', nav: 'insurance',       type: 'score',    desc: '' },
  { id: 'techstack',       label: 'Technology Stack',         icon: '🖥️', nav: 'techstack',       type: 'score',    desc: '' },
  { id: 'cmmc',            label: 'CMMC Level 1',             icon: '🛡️', nav: 'cmmc',            type: 'score',    desc: '' },
  { id: 'cmmc2',           label: 'CMMC Level 2',             icon: '🏛️', nav: 'cmmc2',           type: 'score',    desc: '' },
  { id: 'ai_unified',      label: 'AI Readiness',             icon: '🤖', nav: 'ai_readiness',    type: 'ai',       desc: '' },
  { id: 'risk_register',   label: 'Risk Register',            icon: '⚠️', nav: 'riskregister',    type: 'risk',     desc: '' },
  { id: 'ai_risk_register',label: 'AI Risk Register',         icon: '🧠', nav: 'ai_risk_register',type: 'ai_risk',  desc: 'Open AI-specific risks tracked with NIST AI RMF and ISO 42001 controls.' },
  { id: 'ai_tool_catalog', label: 'AI Application Inventory', icon: '📦', nav: 'ai_tool_catalog', type: 'ai_tools', desc: 'Approved, conditional, and shadow IT AI tool counts for this organization.' },
  { id: 'gap_register',    label: 'Tool Gap Register',        icon: '🔧', nav: 'gap_register',    type: 'gap',      desc: '' },
  { id: 'tpra',            label: 'Vendor Risk (TPRA)',       icon: '🔍', nav: 'tpra',            type: 'link',     desc: 'Deep-dive vendor risk assessments. Tier vendors Critical to Low based on data sensitivity and security posture.' },
  { id: 'tabletop',        label: 'Tabletop Exercises',       icon: '🎯', nav: 'tabletop',        type: 'link',     desc: 'Cybersecurity tabletop exercises. Operational, AI Governance, and more scenarios available.' },
];

const DEFAULT_WIDGETS = [
  { id: 'cis',           width: 2, priority: 1 },
  { id: 'insurance',     width: 1, priority: 2 },
  { id: 'gap_register',  width: 1, priority: 3 },
  { id: 'risk_register', width: 2, priority: 4 },
  { id: 'techstack',     width: 1, priority: 5 },
];

let dashCustomize = { open: false, draft: null };

function getDashConfig() {
  const saved = orgProfiles[currentOrg?.id]?.dashboard_config;
  if (saved?.widgets?.length) return saved.widgets.map(w => ({ ...w }));
  return DEFAULT_WIDGETS.map(w => ({ ...w }));
}

function _widgetScore(def, h) {
  const runs = [...(h[def.id] || [])].sort((a, b) => (b.date||'').localeCompare(a.date||''));
  const last = runs[0] || null;
  if (!last) return `<div class="card" style="padding:0;overflow:hidden;cursor:pointer" onclick="setNav('${def.nav}')" onmouseover="this.style.boxShadow='0 0 0 2px var(--cyan)'" onmouseout="this.style.boxShadow=''">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.65rem .9rem .45rem;border-bottom:1px solid var(--border)">
      <div style="font-size:12px;font-weight:700">${def.icon} ${def.label}</div>
      <span style="font-size:11px;color:var(--cyan);font-weight:700">Open →</span>
    </div>
    <div style="padding:1.25rem .9rem;text-align:center;color:var(--muted);font-size:12px">
      <div style="font-size:1.25rem;margin-bottom:.3rem">📋</div>No assessments yet — click to start
    </div>
  </div>`;

  const scoreColor = _scoreColor(last.score);
  const band = last.score >= 75 ? 'Strong' : last.score >= 60 ? 'Moderate' : last.score >= 40 ? 'Elevated' : 'High Risk';
  const delta = runs.length >= 2
    ? (() => { const d = last.score - runs[1].score; return `<span style="font-size:10px;font-weight:700;color:${d >= 0 ? '#15803d' : '#dc2626'}">${d >= 0 ? '▲' : '▼'}${Math.abs(d)}%</span>`; })()
    : '';
  const igBadge = def.id === 'cis' ? (() => {
    const g = (last.answers || {})._goal || (orgProfiles[currentOrg?.id] || {}).cis_goal;
    const cols = { ig1: { bg: '#dcfce7', txt: '#15803d' }, ig2: { bg: '#dbeafe', txt: '#1d4ed8' }, ig3: { bg: '#ede9fe', txt: '#6d28d9' } };
    const c = cols[g];
    return c ? `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:6px;background:${c.bg};color:${c.txt}">${g.toUpperCase()}</span>` : '';
  })() : '';

  return `<div class="card" style="padding:0;overflow:hidden;cursor:pointer" onclick="setNav('${def.nav}')" onmouseover="this.style.boxShadow='0 0 0 2px var(--cyan)'" onmouseout="this.style.boxShadow=''">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.65rem .9rem .45rem;border-bottom:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:.35rem;font-size:12px;font-weight:700">${def.icon} ${def.label}${igBadge ? '&ensp;' + igBadge : ''}</div>
      <span style="font-size:11px;color:var(--cyan);font-weight:700;white-space:nowrap;flex-shrink:0">Open →</span>
    </div>
    <div style="padding:.7rem .9rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.25rem">
        <div style="display:flex;align-items:baseline;gap:.35rem">
          <span style="font-size:1.85rem;font-weight:800;color:${scoreColor};font-family:monospace;line-height:1">${last.score}%</span>
          <span style="font-size:11px;font-weight:700;color:${scoreColor}">${band}</span>
        </div>
        <div style="display:flex;align-items:center;gap:.35rem">
          ${delta}
          ${runs.length >= 2 ? `<canvas id="wd-trend-${def.id}" width="60" height="24" style="flex-shrink:0"></canvas>` : ''}
        </div>
      </div>
      <div style="font-size:10px;color:var(--muted)">${runs.length} run${runs.length !== 1 ? 's' : ''} · Last: ${last.date || '—'}</div>
    </div>
  </div>`;
}

function _widgetLink(def) {
  return `<div class="card" style="padding:0;overflow:hidden;cursor:pointer" onclick="setNav('${def.nav}')" onmouseover="this.style.boxShadow='0 0 0 2px var(--cyan)'" onmouseout="this.style.boxShadow=''">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.65rem .9rem .45rem;border-bottom:1px solid var(--border)">
      <div style="font-size:12px;font-weight:700">${def.icon} ${def.label}</div>
      <span style="font-size:11px;color:var(--cyan);font-weight:700">Open →</span>
    </div>
    <div style="padding:.75rem .9rem;font-size:11px;color:var(--muted);line-height:1.55">${def.desc || 'Click to open.'}</div>
  </div>`;
}

function renderDashWidget(wid, h, rrRows, rrLoaded) {
  const def = WIDGET_CATALOG.find(w => w.id === wid);
  if (!def) return '';
  if (typeof hasPageAccess === 'function' && !hasPageAccess(def.nav)) return '';
  switch (def.type) {
    case 'score':    return _widgetScore(def, h);
    case 'ai':       return _homeAiChicklet(h) || _widgetLink(def);
    case 'risk':     return _homeRiskChicklet(rrRows, rrLoaded);
    case 'ai_risk':  return _homeAiRiskChicklet();
    case 'ai_tools': return _homeAiToolsChicklet();
    case 'gap':      return _homeTopToolsChicklet();
    case 'link':     return _widgetLink(def);
    default:         return '';
  }
}

function _renderWidgetGrid(h, rrRows, rrLoaded) {
  const config = getDashConfig();
  const enabled = config
    .filter(w => WIDGET_CATALOG.some(c => c.id === w.id))
    .sort((a, b) => ((a.priority ?? 99) - (b.priority ?? 99)) || a.id.localeCompare(b.id));

  if (!enabled.length) return `<div class="card" style="padding:2.5rem;text-align:center;color:var(--muted)">
    <div style="font-size:2rem;margin-bottom:.5rem">📊</div>
    <div style="font-weight:700;color:var(--text);margin-bottom:.25rem">No widgets selected</div>
    <div style="font-size:12px">Click <strong>Customize</strong> to add widgets to your dashboard.</div>
  </div>`;

  const cells = enabled.map(w => {
    const span = Math.max(1, Math.min(4, w.width || 1));
    const html = renderDashWidget(w.id, h, rrRows, rrLoaded);
    return html ? `<div style="grid-column:span ${span}">${html}</div>` : '';
  }).filter(Boolean).join('');

  if (!cells) return `<div class="card" style="padding:2.5rem;text-align:center;color:var(--muted)">
    <div style="font-size:2rem;margin-bottom:.5rem">🔒</div>
    <div style="font-weight:700;color:var(--text);margin-bottom:.25rem">No accessible widgets</div>
    <div style="font-size:12px">Your current access level doesn't include the selected widgets.</div>
  </div>`;

  return `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;align-items:start">${cells}</div>`;
}

function _renderCustomizePanel() {
  const draft = dashCustomize.draft || [];
  const available = WIDGET_CATALOG.filter(w =>
    typeof hasPageAccess !== 'function' || hasPageAccess(w.nav)
  );

  const rows = available.map(w => {
    const cfg = draft.find(x => x.id === w.id);
    const enabled = !!cfg;
    const width = cfg?.width || 1;
    const priority = cfg?.priority ?? '';

    return `<div style="display:flex;align-items:center;gap:.65rem;padding:.5rem .9rem;border-bottom:1px solid var(--border)">
      <input type="checkbox" id="wt-cb-${w.id}" ${enabled ? 'checked' : ''}
        onchange="dashToggleWidget('${w.id}',this.checked)"
        style="width:15px;height:15px;flex-shrink:0;cursor:pointer;accent-color:var(--navy)">
      <label for="wt-cb-${w.id}" style="flex:1;font-size:12px;font-weight:700;cursor:pointer;user-select:none">${w.icon} ${w.label}</label>
      <div style="display:flex;align-items:center;gap:.35rem;flex-shrink:0;${enabled ? '' : 'opacity:.3;pointer-events:none'}">
        <span style="font-size:10px;color:var(--muted)">Priority</span>
        <input type="number" min="1" max="99" value="${priority}" placeholder="—"
          onchange="dashSetPriority('${w.id}',this.value)"
          style="width:46px;padding:3px 5px;border:1px solid var(--border);border-radius:5px;font-size:12px;text-align:center;font-family:monospace;outline:none"
          onfocus="this.style.borderColor='var(--navy)'" onblur="this.style.borderColor='var(--border)'">
        <span style="font-size:10px;color:var(--muted);margin-left:.15rem">Width</span>
        ${[1,2,3,4].map(n => `<button onclick="dashSetWidth('${w.id}',${n})"
          style="padding:3px 9px;font-size:11px;font-weight:700;border-radius:5px;cursor:pointer;transition:all .1s;border:1.5px solid ${enabled && width === n ? 'var(--navy)' : 'var(--border)'};background:${enabled && width === n ? 'var(--navy)' : '#fff'};color:${enabled && width === n ? '#fff' : 'var(--muted)'}">${n}×</button>`).join('')}
      </div>
    </div>`;
  }).join('');

  return `<div class="card" style="padding:0;overflow:hidden;margin-bottom:.5rem">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.6rem .9rem;border-bottom:1px solid var(--border);background:var(--bg)">
      <div>
        <div style="font-size:13px;font-weight:700">📐 Customize Dashboard</div>
        <div style="font-size:10px;color:var(--muted)">Toggle widgets · set priority (1 = first) · choose column width</div>
      </div>
      <div style="display:flex;gap:.4rem">
        <button class="btn btn-outline btn-sm" onclick="cancelDashConfig()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="saveDashConfig()">Save Layout</button>
      </div>
    </div>
    ${rows}
  </div>`;
}

function toggleDashCustomize() {
  dashCustomize.open = !dashCustomize.open;
  dashCustomize.draft = dashCustomize.open ? getDashConfig() : null;
  const mc = document.getElementById('mainContent');
  if (mc) { mc.innerHTML = renderHome(); if (!dashCustomize.open) setTimeout(drawHomeCharts, 80); }
}

function dashToggleWidget(id, enabled) {
  if (!dashCustomize.draft) return;
  const idx = dashCustomize.draft.findIndex(w => w.id === id);
  if (enabled && idx === -1) {
    const maxPri = dashCustomize.draft.length
      ? Math.max(...dashCustomize.draft.map(w => w.priority ?? 0))
      : 0;
    dashCustomize.draft.push({ id, width: 1, priority: maxPri + 1 });
  } else if (!enabled && idx !== -1) {
    dashCustomize.draft.splice(idx, 1);
  }
  const mc = document.getElementById('mainContent');
  if (mc) mc.innerHTML = renderHome();
}

function dashSetWidth(id, width) {
  if (!dashCustomize.draft) return;
  const w = dashCustomize.draft.find(x => x.id === id);
  if (w) w.width = width;
  const mc = document.getElementById('mainContent');
  if (mc) mc.innerHTML = renderHome();
}

function dashSetPriority(id, val) {
  if (!dashCustomize.draft) return;
  const w = dashCustomize.draft.find(x => x.id === id);
  if (w) w.priority = parseInt(val) || 99;
}

function cancelDashConfig() {
  dashCustomize.open = false;
  dashCustomize.draft = null;
  const mc = document.getElementById('mainContent');
  if (mc) { mc.innerHTML = renderHome(); setTimeout(drawHomeCharts, 80); }
}

async function saveDashConfig() {
  const config = { widgets: dashCustomize.draft || getDashConfig() };
  try {
    await sb.profiles.upsert({ org_id: currentOrg.id, dashboard_config: config });
    if (!orgProfiles[currentOrg.id]) orgProfiles[currentOrg.id] = { org_id: currentOrg.id };
    orgProfiles[currentOrg.id].dashboard_config = config;
    dashCustomize.open = false;
    dashCustomize.draft = null;
    const mc = document.getElementById('mainContent');
    if (mc) { mc.innerHTML = renderHome(); setTimeout(drawHomeCharts, 80); }
    toast('✓ Dashboard layout saved', '#15803d');
  } catch (e) {
    toast('Error saving layout', '#dc2626');
    console.error(e);
  }
}

// ─── PANEL CHICKLETS ──────────────────────────────────────────────────────────

function _homeAssessmentsChicklet(h) {
  const catalog = [
    { id:'cis',       label:'CIS Controls v8',    icon:'✅', nav:'cis' },
    { id:'insurance', label:'Insurance Readiness', icon:'🛡️', nav:'insurance' },
    { id:'techstack', label:'Technology Stack',    icon:'🖥️', nav:'techstack' },
  ];

  // Only show assessments that have been run
  const done = catalog.filter(a => (h[a.id] || []).length > 0);
  if (!done.length) return '';

  const rows = done.map(a => {
    const runs = h[a.id] || [];
    const last = runs[runs.length - 1];
    const scoreColor = last.score >= 70 ? '#15803d' : last.score >= 40 ? '#b45309' : '#dc2626';
    return `<div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .9rem;border-bottom:1px solid var(--border);cursor:pointer" onclick="setNav('${a.nav}')" onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background=''">
      <span style="font-size:13px;flex-shrink:0">${a.icon}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.label}</div>
        <div style="font-size:10px;color:var(--muted)">${last.date || '—'}</div>
      </div>
      ${runs.length >= 2 ? `<canvas id="home-trend-${a.id}" width="50" height="20" style="flex-shrink:0"></canvas>` : ''}
      <span style="font-size:12px;font-weight:800;color:${scoreColor};flex-shrink:0;min-width:28px;text-align:right">${last.score}%</span>
    </div>`;
  }).join('');

  return `<div class="card" style="padding:0;overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem .9rem .5rem;border-bottom:1px solid var(--border)">
      <div style="font-size:13px;font-weight:700">📋 Assessments</div>
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();setNav('assessments')">View all →</button>
    </div>
    ${rows}
  </div>`;
}

function _homeRiskChicklet(rows, loaded) {
  const ratingStyle = { Critical:'#dc2626', High:'#ea580c', Medium:'#b45309', Low:'#15803d' };
  const ratingBg    = { Critical:'#fef2f2', High:'#fff7ed', Medium:'#fefce8', Low:'#f0fdf4' };

  let body;
  if (!loaded) {
    body = `<div style="padding:1.25rem;text-align:center;color:var(--muted);font-size:12px">
      <div style="font-size:1.25rem;margin-bottom:.35rem">⏳</div>Loading risks…</div>`;
  } else if (!rows || !rows.length) {
    body = `<div style="padding:1.25rem;text-align:center;color:var(--muted);font-size:12px">
      <div style="font-size:1.5rem;margin-bottom:.35rem">✅</div>No open risks logged.<br>
      <span style="font-size:11px">Save a CIS POAM to auto-populate.</span></div>`;
  } else {
    body = rows.map(r => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.45rem .9rem;border-bottom:1px solid var(--border);cursor:pointer;gap:.5rem" onclick="setNav('riskregister')" onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background=''">
      <div style="min-width:0;flex:1">
        <div style="font-size:11.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.risk_title || '—')}</div>
        ${r.control_number ? `<div style="font-size:10px;color:var(--muted);font-family:monospace">CIS ${esc(r.control_number)}</div>` : ''}
      </div>
      ${r.inherent_risk_rating ? `<span style="flex-shrink:0;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:${ratingBg[r.inherent_risk_rating]||'#f3f4f6'};color:${ratingStyle[r.inherent_risk_rating]||'#374151'}">${esc(r.inherent_risk_rating)}</span>` : ''}
    </div>`).join('');
  }

  return `<div class="card" style="padding:0;overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem .9rem .5rem;border-bottom:1px solid var(--border)">
      <div style="font-size:13px;font-weight:700">⚠️ Risk Register</div>
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();setNav('riskregister')">View all →</button>
    </div>
    ${body}
  </div>`;
}

function _homeAiRiskChicklet() {
  const loaded = typeof aiRRState !== 'undefined' && aiRRState.loaded && aiRRState.orgId === currentOrg?.id;
  const ratingOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const ratingStyle = { Critical: '#dc2626', High: '#ea580c', Medium: '#b45309', Low: '#15803d' };
  const ratingBg    = { Critical: '#fef2f2', High: '#fff7ed', Medium: '#fefce8', Low: '#f0fdf4' };

  let body;
  if (!loaded) {
    body = `<div style="padding:1.25rem;text-align:center;color:var(--muted);font-size:12px">
      <div style="font-size:1.25rem;margin-bottom:.35rem">⏳</div>Loading AI risks…</div>`;
  } else {
    const open = (aiRRState.rows || []).filter(r => r.status !== 'Closed')
      .sort((a, b) => (ratingOrder[a.rating] ?? 4) - (ratingOrder[b.rating] ?? 4));
    if (!open.length) {
      body = `<div style="padding:1.25rem;text-align:center;color:var(--muted);font-size:12px">
        <div style="font-size:1.5rem;margin-bottom:.35rem">✅</div>No open AI risks.</div>`;
    } else {
      const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
      open.forEach(r => { if (counts[r.rating] !== undefined) counts[r.rating]++; });
      const chips = Object.entries(counts).filter(([,n]) => n > 0).map(([k, n]) =>
        `<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:${ratingBg[k]};color:${ratingStyle[k]}">${n} ${k}</span>`
      ).join('');
      const rows = open.slice(0, 5).map(r => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:.4rem .9rem;border-bottom:1px solid var(--border);cursor:pointer;gap:.5rem" onclick="setNav('ai_risk_register')" onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background=''">
          <div style="min-width:0;flex:1;font-size:11.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escH(r.category || '—')}</div>
          <span style="flex-shrink:0;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:${ratingBg[r.rating]||'#f3f4f6'};color:${ratingStyle[r.rating]||'#374151'}">${escH(r.rating||'')}</span>
        </div>`).join('');
      body = `<div style="display:flex;gap:.35rem;flex-wrap:wrap;padding:.5rem .9rem .4rem">${chips}</div>${rows}`;
    }
  }

  return `<div class="card" style="padding:0;overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem .9rem .5rem;border-bottom:1px solid var(--border)">
      <div style="font-size:13px;font-weight:700">🧠 AI Risk Register</div>
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();setNav('ai_risk_register')">View all →</button>
    </div>
    ${body}
  </div>`;
}

function _homeAiToolsChicklet() {
  const loaded = typeof aiCatState !== 'undefined' && aiCatState.orgLoaded && aiCatState.orgId === currentOrg?.id;
  const statusStyle = { approved: '#15803d', conditional: '#b45309', not_approved: '#dc2626', shadow_it: '#6d28d9' };
  const statusBg    = { approved: '#f0fdf4', conditional: '#fefce8', not_approved: '#fef2f2', shadow_it: '#f5f3ff' };
  const statusLabel = { approved: 'Approved', conditional: 'Conditional', not_approved: 'Not Approved', shadow_it: 'Shadow IT' };

  let body;
  if (!loaded) {
    body = `<div style="padding:1.25rem;text-align:center;color:var(--muted);font-size:12px">
      <div style="font-size:1.25rem;margin-bottom:.35rem">⏳</div>Loading AI tools…</div>`;
  } else {
    const tools = aiCatState.orgTools || [];
    if (!tools.length) {
      body = `<div style="padding:1.25rem;text-align:center;color:var(--muted);font-size:12px">
        <div style="font-size:1.5rem;margin-bottom:.35rem">📦</div>No tools in inventory yet.<br>
        <span style="font-size:11px">Add tools via AI Application Inventory.</span></div>`;
    } else {
      const counts = { approved: 0, conditional: 0, not_approved: 0, shadow_it: 0 };
      tools.forEach(t => { if (counts[t.org_status] !== undefined) counts[t.org_status]++; });
      const chips = Object.entries(counts).filter(([,n]) => n > 0).map(([k, n]) =>
        `<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:${statusBg[k]};color:${statusStyle[k]}">${n} ${statusLabel[k]}</span>`
      ).join('');
      const recent = tools.slice(0, 4).map(t => {
        const name = t.is_custom ? (t.custom_name || 'Custom Tool') : (aiCatState.tools.find(c => c.id === t.tool_catalog_id)?.name || 'Tool');
        const st = t.org_status || 'shadow_it';
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:.4rem .9rem;border-bottom:1px solid var(--border);cursor:pointer;gap:.5rem" onclick="setNav('ai_tool_catalog')" onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background=''">
          <div style="min-width:0;flex:1;font-size:11.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escH(name)}</div>
          <span style="flex-shrink:0;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;background:${statusBg[st]||'#f3f4f6'};color:${statusStyle[st]||'#374151'}">${statusLabel[st]||st}</span>
        </div>`;
      }).join('');
      body = `<div style="display:flex;gap:.35rem;flex-wrap:wrap;padding:.5rem .9rem .4rem">${chips}</div>${recent}
        ${tools.length > 4 ? `<div style="padding:.4rem .9rem;font-size:11px;color:var(--muted);text-align:center">+${tools.length - 4} more</div>` : ''}`;
    }
  }

  return `<div class="card" style="padding:0;overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem .9rem .5rem;border-bottom:1px solid var(--border)">
      <div style="font-size:13px;font-weight:700">📦 AI Application Inventory</div>
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();setNav('ai_tool_catalog')">View all →</button>
    </div>
    ${body}
  </div>`;
}

function _homeBackgroundLoadAI() {
  if (!currentOrg) return;
  const cfg = getDashConfig();
  const needsRR    = cfg.some(w => w.id === 'ai_risk_register');
  const needsTools = cfg.some(w => w.id === 'ai_tool_catalog');
  if (!needsRR && !needsTools) return;
  const rrStale    = needsRR    && !(typeof aiRRState  !== 'undefined' && aiRRState.loaded    && aiRRState.orgId    === currentOrg.id);
  const toolsStale = needsTools && !(typeof aiCatState !== 'undefined' && aiCatState.orgLoaded && aiCatState.orgId   === currentOrg.id);
  if (!rrStale && !toolsStale) return;
  setTimeout(async () => {
    if (rrStale    && typeof loadAiRiskRegister === 'function') await loadAiRiskRegister(currentOrg.id);
    if (toolsStale && typeof loadAiInventory    === 'function') await loadAiInventory(currentOrg.id);
    if (activeNav === 'home') {
      const mc = document.getElementById('mainContent');
      if (mc) { mc.innerHTML = renderHome(); setTimeout(drawHomeCharts, 80); }
    }
  }, 0);
}

function _homeAiChicklet(h) {
  const runs   = [...(h['ai_unified'] || [])].sort((a, b) => (b.date||'').localeCompare(a.date||''));
  const latest = runs[0] || null;
  const scoreVal   = latest?.score ?? null;
  const scoreColor = scoreVal !== null ? _scoreColor(scoreVal) : 'var(--muted)';

  if (!latest) return '';

  return `<div class="card" style="padding:0;overflow:hidden;cursor:pointer" onclick="setNav('ai_readiness')" onmouseover="this.style.boxShadow='0 0 0 2px var(--cyan)'" onmouseout="this.style.boxShadow=''">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem .9rem .5rem;border-bottom:1px solid var(--border)">
      <div>
        <div style="font-size:13px;font-weight:700">🤖 AI Readiness</div>
        <div style="font-size:10px;color:var(--muted)">Last run: ${latest.date || '—'}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:1.3rem;font-weight:800;color:${scoreColor}">${scoreVal}%</div>
        <div style="font-size:10px;color:var(--muted)">Overall</div>
      </div>
    </div>
    <div style="padding:.5rem .75rem .5rem">
      <div style="display:flex;gap:4px">
        <div style="flex:1;text-align:center">
          <div style="font-size:9px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px">NIST AI RMF</div>
          <canvas id="home-ai-nist-radar" style="display:block;width:100%;height:250px"></canvas>
        </div>
        <div style="flex:1;text-align:center">
          <div style="font-size:9px;font-weight:700;color:#0f766e;text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px">ISO 42001</div>
          <canvas id="home-ai-iso-radar" style="display:block;width:100%;height:250px"></canvas>
        </div>
      </div>
    </div>
    <div style="padding:.35rem .9rem .75rem;text-align:center;font-size:11px;color:var(--cyan);font-weight:700">→ AI Readiness Hub</div>
  </div>`;
}

function _homeCisRadarChicklet(h) {
  const runs   = [...(h['cis'] || [])].sort((a, b) => (b.date||'').localeCompare(a.date||''));
  const latest = runs[0];
  if (!latest) return '';
  const scoreVal   = latest.score ?? null;
  const scoreColor = scoreVal !== null ? _scoreColor(scoreVal) : 'var(--muted)';
  const goal    = (latest.answers || {})._goal;
  const igCols  = { ig1: { bg: '#dcfce7', txt: '#15803d' }, ig2: { bg: '#dbeafe', txt: '#1d4ed8' }, ig3: { bg: '#ede9fe', txt: '#6d28d9' } };
  const igC     = igCols[goal];

  return `<div class="card" style="padding:0;overflow:hidden;cursor:pointer" onclick="setNav('cis')" onmouseover="this.style.boxShadow='0 0 0 2px var(--cyan)'" onmouseout="this.style.boxShadow=''">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem .9rem .5rem;border-bottom:1px solid var(--border)">
      <div>
        <div style="font-size:13px;font-weight:700">✅ CIS Controls</div>
        <div style="font-size:10px;color:var(--muted)">Last run: ${latest.date || '—'}${goal && igC ? ' · <span style="font-weight:700;color:' + igC.txt + '">' + goal.toUpperCase() + '</span>' : ''}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:1.3rem;font-weight:800;color:${scoreColor}">${scoreVal !== null ? scoreVal + '%' : '—'}</div>
        <div style="font-size:10px;color:var(--muted)">Overall</div>
      </div>
    </div>
    <div style="padding:.5rem .75rem .5rem">
      <canvas id="home-cis-radar" style="display:block;width:100%;height:280px"></canvas>
    </div>
    <div style="padding:.35rem .9rem .75rem;text-align:center;font-size:11px;color:var(--cyan);font-weight:700">→ CIS Controls Assessment</div>
  </div>`;
}

function _homeTopToolsChicklet() {
  // Risk priority rank per PS_ALL_TYPES tool type — lower = higher priority
  const RISK_RANK = {
    edr:                1,
    mdr_soc:            2,
    mdr_device:         3,
    mdr_identity:       4,
    mfa:                5,
    email:              6,
    vuln_external:      7,
    vuln_internal:      8,
    dns_filter:         9,
    ngfw:              10,
    ztna_vpn:          11,
    mdm:               12,
    sat:               13,
    dlp:               14,
    pii_scan:          15,
    pam:               16,
    cspm:              17,
    password_vault:    18,
    dark_web_monitoring:19,
    pentest_external:  20,
    pentest_internal:  21,
    vciso:             22,
    email_backup:      23,
    email_dlp:         24,
    email_encryption:  25,
    email_archive:     26,
    asc_external:      27,
    vuln_scanner:      28,
    security_assessment:29,
    tabletop:          30,
  };

  const rankColors = ['#dc2626','#ea580c','#d97706','#2563eb','#7c3aed'];

  // Loading state — grLoad() will re-render home when complete
  if (grState.loading || !grState.loaded || grState.orgId !== currentOrg?.id) {
    return `<div class="card" style="padding:0;overflow:hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem .9rem .5rem;border-bottom:1px solid var(--border)">
        <div style="font-size:13px;font-weight:700">🔧 Missing Tools</div>
      </div>
      <div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:12px">
        <div class="spinner" style="border-color:rgba(21,33,104,0.2);border-top-color:var(--navy);width:20px;height:20px;margin:0 auto .6rem"></div>
        Loading gap data…
      </div>
    </div>`;
  }

  // Pull directly from the Tool Gap Register — same data, risk-priority sorted
  const { rows: gapRows, catalogMode } = grBuildGapList();

  if (catalogMode) {
    return `<div class="card" style="padding:0;overflow:hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem .9rem .5rem;border-bottom:1px solid var(--border)">
        <div style="font-size:13px;font-weight:700">🔧 Missing Tools</div>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();setNav('gap_register')">Tool Gap Register →</button>
      </div>
      <div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:12px">
        <div style="font-size:1.5rem;margin-bottom:.4rem">📋</div>
        Run a CIS, Insurance, or Tech Stack assessment<br>to identify which tools are missing.
      </div>
    </div>`;
  }

  // Sort all gaps by risk priority rank, take top 5
  const missing = gapRows
    .slice()
    .sort((a, b) => (RISK_RANK[a.toolType] || 99) - (RISK_RANK[b.toolType] || 99))
    .slice(0, 5);

  if (!missing.length) {
    return `<div class="card" style="padding:0;overflow:hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem .9rem .5rem;border-bottom:1px solid var(--border)">
        <div style="font-size:13px;font-weight:700">🔧 Missing Tools</div>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();setNav('gap_register')">Tool Gap Register →</button>
      </div>
      <div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:12px">
        <div style="font-size:1.5rem;margin-bottom:.4rem">✅</div>
        No tool gaps identified from current assessments.
      </div>
    </div>`;
  }

  const rows = missing.map((t, i) => {
    const ps = t.ps || ((typeof psGetForType === 'function') ? psGetForType(t.toolType) : null);
    const priceNote = ps
      ? `<span style="font-size:10px;color:#15803d;font-weight:700">${escH(ps.name)}</span>`
      : `<span style="font-size:10px;color:#b45309;cursor:pointer" onclick="event.stopPropagation();setNav('pricing_schedule')">Add to Pricing Schedule →</span>`;
    const frameworkBadges = [
      t.cisS ? `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:#dbeafe;color:#1d4ed8">CIS</span>` : '',
      t.insS ? `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:#dcfce7;color:#15803d">Ins</span>` : '',
      t.tsS  ? `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:#fef3c7;color:#92400e">TS</span>` : '',
    ].filter(Boolean).join(' ');
    return `<div style="display:flex;align-items:center;gap:.6rem;padding:.5rem .9rem;border-bottom:1px solid var(--border)">
      <div style="width:20px;height:20px;border-radius:50%;background:${rankColors[i]};color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i + 1}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:700">${escH(t.label)}</div>
        <div style="display:flex;gap:3px;margin-top:2px">${frameworkBadges}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">${priceNote}</div>
    </div>`;
  }).join('');

  return `<div class="card" style="padding:0;overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem .9rem .5rem;border-bottom:1px solid var(--border)">
      <div>
        <div style="font-size:13px;font-weight:700">🔧 Missing Tools</div>
        <div style="font-size:10px;color:var(--muted)">Priority order by risk reduction</div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();setNav('gap_register')">Tool Gap Register →</button>
    </div>
    ${rows}
  </div>`;
}

// ─── CHART DRAWING ────────────────────────────────────────────────────────────

function drawHomeCharts() {
  _drawHomeAssessmentTrends();
  _drawWidgetTrends();
  _drawHomeAiRadar();
  _drawHomeCisRadar();
}

function _drawWidgetTrends() {
  const h = orgAssessments[currentOrg?.id] || {};
  WIDGET_CATALOG.filter(w => w.type === 'score').forEach(def => {
    const runs = [...(h[def.id] || [])].sort((a, b) => (a.date||'').localeCompare(b.date||''));
    if (runs.length < 2) return;
    const canvas = document.getElementById(`wd-trend-${def.id}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 60, H = 24;
    canvas.width = W; canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    const scores = runs.map(r => r.score);
    const mn = Math.max(0, Math.min(...scores) - 10);
    const mx = Math.min(100, Math.max(...scores) + 10);
    const range = mx - mn || 1;
    const px = i => Math.round(3 + i * (W - 6) / (scores.length - 1));
    const py = v => Math.round(H - 3 - (v - mn) / range * (H - 7));
    ctx.beginPath();
    scores.forEach((s, i) => i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)));
    ctx.lineTo(px(scores.length - 1), H); ctx.lineTo(px(0), H); ctx.closePath();
    ctx.fillStyle = 'rgba(7,180,217,0.1)'; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = '#07B4D9'; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
    scores.forEach((s, i) => i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)));
    ctx.stroke();
    scores.forEach((s, i) => {
      ctx.beginPath(); ctx.arc(px(i), py(s), 2, 0, Math.PI * 2);
      ctx.fillStyle = s >= 70 ? '#15803d' : s >= 40 ? '#b45309' : '#dc2626'; ctx.fill();
    });
  });
}

function _drawHomeAssessmentTrends() {
  const h = orgAssessments[currentOrg?.id] || {};
  ['cis','insurance','techstack'].forEach(id => {
    const runs = h[id] || [];
    if (runs.length < 2) return;
    const canvas = document.getElementById(`home-trend-${id}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 50, H = 20;
    canvas.width = W; canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    const scores = runs.map(r => r.score);
    const mn = Math.max(0, Math.min(...scores) - 10);
    const mx = Math.min(100, Math.max(...scores) + 10);
    const px = i => Math.round(3 + i * (W - 6) / (scores.length - 1));
    const py = v => Math.round(H - 3 - (v - mn) / (mx - mn) * (H - 7));
    ctx.beginPath();
    scores.forEach((s, i) => i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)));
    ctx.lineTo(px(scores.length - 1), H); ctx.lineTo(px(0), H); ctx.closePath();
    ctx.fillStyle = 'rgba(7,180,217,0.08)'; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = '#07B4D9'; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
    scores.forEach((s, i) => i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)));
    ctx.stroke();
    scores.forEach((s, i) => {
      ctx.beginPath(); ctx.arc(px(i), py(s), 2, 0, Math.PI * 2);
      ctx.fillStyle = s >= 70 ? '#15803d' : s >= 40 ? '#b45309' : '#dc2626'; ctx.fill();
    });
  });
}

function _drawHomeAiRadar() {
  const h = orgAssessments[currentOrg?.id] || {};
  const runs = [...(h['ai_unified'] || [])].sort((a, b) => (b.date||'').localeCompare(a.date||''));
  const latest = runs[0];
  if (!latest) return;
  const answers  = Object.fromEntries(Object.entries(latest.answers || {}).filter(([k]) => !k.startsWith('_')));
  const fw       = aiuFrameworksFromRun(latest);
  const nistAxes = aiuCalcNistFunctionScores(answers, fw);
  const isoAxes  = aiuCalcIsoClauseScores(answers, fw);

  function drawPanel(canvasId, axes, fillColor, strokeColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const W = canvas.offsetWidth || 130;
    canvas.setAttribute('width', W);
    canvas.setAttribute('height', 250);
    aiuDrawFrameworkRadar(canvas, axes, fillColor, strokeColor);
  }

  if (fw.nist !== false) drawPanel('home-ai-nist-radar', nistAxes, 'rgba(29,78,216,0.12)', '#1d4ed8');
  if (fw.iso  !== false) drawPanel('home-ai-iso-radar',  isoAxes,  'rgba(15,118,110,0.12)', '#0f766e');
}

function _drawHomeCisRadar() {
  const h = orgAssessments[currentOrg?.id] || {};
  const runs = [...(h['cis'] || [])].sort((a, b) => (b.date||'').localeCompare(a.date||''));
  const latest = runs[0];
  if (!latest) return;
  const canvas = document.getElementById('home-cis-radar');
  if (!canvas) return;
  const W = canvas.offsetWidth || 260;
  canvas.setAttribute('width', W);
  canvas.setAttribute('height', 280);
  const answers = Object.fromEntries(Object.entries(latest.answers || {}).filter(([k]) => !k.startsWith('_')));
  const goal    = (latest.answers || {})._goal;
  const goalN   = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 3;
  cisDrawRadar('home-cis-radar', answers, goalN);
}

// ============================================================
// ASSESSMENTS HUB
// ============================================================

const ASSESSMENT_CATALOG = [
  { id: 'cis',       label: 'CIS Controls v8',    icon: '✅', description: '153 safeguards across 18 controls. Per-org IG goal (IG1/IG2/IG3). Full assessment history.', nav: 'cis' },
  { id: 'insurance', label: 'Insurance Readiness', icon: '🛡️', description: 'Dual-weighted readiness score for cyber insurance applications.', nav: 'insurance' },
  { id: 'techstack', label: 'Technology Stack',    icon: '🖥️', description: 'Maps your technology to security frameworks and gaps.', nav: 'techstack' },
  { id: 'cmmc',      label: 'CMMC Level 1',        icon: '🛡️', description: '17 practices across 6 domains. SPRS score contribution. DoD contractor self-assessment.', nav: 'cmmc' },
  { id: 'cmmc2',     label: 'CMMC Level 2',        icon: '🏛️', description: '110 NIST SP 800-171 practices across 14 domains. Full SPRS score (0–110). CUI handling assessment.', nav: 'cmmc2' },
  { id: 'ma_cdd',    label: 'M&A Due Diligence',   icon: '🤝', description: 'Cybersecurity due diligence for mergers and acquisitions. Risk scoring across 8 domains.', nav: 'ma_cdd' },
  { id: 'nist',      label: 'NIST CSF 2.0',        icon: '🏛️', description: 'NIST Cybersecurity Framework 2.0 assessment.', nav: 'nist', comingSoon: true },
  { id: 'ai_unified', label: 'AI Readiness',       icon: '🤖', description: 'NIST AI RMF and ISO 42001 combined AI governance assessment with unified scoring and radar chart.', nav: 'ai_readiness', aiTag: true },
  { id: 'tpra',       label: 'Vendor Risk (TPRA)', icon: '🔍', description: 'Third-party vendor risk assessment wizard. Deep-dive assessments for critical and high-risk vendors.', nav: 'tpra', noScore: true },
];

function renderAssessmentsHub() {
  if (!currentOrg) return '';
  const h = orgAssessments[currentOrg.id] || {};

  const chicklets = ASSESSMENT_CATALOG.filter(a => hasPageAccess(a.nav)).map(a => {
    const runs = (h[a.id] || []).slice().sort((x, y) => (y.date||'').localeCompare(x.date||''));
    const last = runs[0] || null;
    const canDuplicate = runs.length > 0 && !a.comingSoon;

    const scoreColor = !last ? 'var(--muted)'
      : last.score >= 70 ? '#15803d'
      : last.score >= 40 ? '#b45309'
      : '#dc2626';

    const igBadge = a.id === 'cis' ? (() => {
      const g = (orgProfiles[currentOrg?.id] || {}).cis_goal;
      const igCols = { ig1: { bg: '#dcfce7', txt: '#15803d' }, ig2: { bg: '#dbeafe', txt: '#1d4ed8' }, ig3: { bg: '#ede9fe', txt: '#6d28d9' } };
      const c = igCols[g];
      return g && c ? `<span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;background:${c.bg};color:${c.txt}">${g.toUpperCase()}</span>` : '';
    })() : '';

    const aiBadge = a.aiTag
      ? `<span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;background:#ede9fe;color:#6d28d9">AI</span>`
      : '';

    return `<div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column">
      <div style="padding:1rem 1rem .6rem;flex:1">
        <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.4rem">
          <span style="font-size:1.1rem;flex-shrink:0">${a.icon}</span>
          <div style="font-size:13px;font-weight:700;flex:1">${a.label}</div>
          ${igBadge}${aiBadge}
        </div>
        <div style="font-size:11px;color:var(--muted);line-height:1.45">${a.description}</div>
      </div>
      ${a.noScore
        ? `<div style="padding:.5rem 1rem .6rem;border-top:1px solid var(--border)">
            <div style="font-size:11px;color:var(--muted)">Vendor risk assessments</div>
          </div>`
        : `<div style="padding:.5rem 1rem .6rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:.5rem">
            <div>
              <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;font-weight:700">Last run</div>
              <div style="font-size:11px;font-weight:700;color:var(--text)">
                ${last ? last.date : '<span style="color:var(--muted);font-weight:400">Never</span>'}
                ${runs.length > 1 ? `<span style="font-size:9px;color:var(--muted);font-weight:400;margin-left:4px">${runs.length} runs</span>` : ''}
              </div>
            </div>
            ${last ? `<div style="font-size:1.15rem;font-weight:800;color:${scoreColor}">${last.score}%</div>` : ''}
          </div>`}
      <div style="padding:.5rem 1rem .75rem;border-top:1px solid var(--border);display:flex;gap:5px">
        ${a.comingSoon
          ? `<span style="font-size:11px;font-weight:700;color:var(--muted);padding:4px 10px;border-radius:6px;background:var(--bg)">Coming soon</span>`
          : `<button class="btn btn-cyan btn-sm" onclick="setNav('${a.nav}')" style="flex:1">${a.noScore ? 'View Assessments' : last ? 'View / Run' : 'Start'}</button>`}
        ${canDuplicate ? `<button class="btn btn-outline btn-sm" title="Duplicate last assessment for a quick re-run" onclick="duplicateAssessment('${a.id}')">⧉ Re-up</button>` : ''}
      </div>
    </div>`;
  }).join('');

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📋 Assessments</div>
      <div style="font-size:12px;color:var(--muted)">All available assessments for ${escH(currentOrg.name)}</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:.75rem">
    ${chicklets}
  </div>
  <div style="font-size:11px;color:var(--muted);margin-top:.75rem">
    💡 <strong>Re-up</strong> duplicates the last assessment's answers (clearing evidence notes) so you can quickly run a follow-up without starting from scratch.
  </div>`;
}

// ============================================================
// EXERCISES HUB
// ============================================================

const EXERCISE_CATALOG = [
  { id: 'ex_hub',    label: 'Exercise Hub',             icon: '📋', description: 'Browse all available tabletop scenarios and manage past exercise sessions.', nav: 'ex_hub' },
  { id: 'tabletop',  label: 'Tabletop — Operational',   icon: '🎯', description: 'Ransomware, BEC, and operational incident response scenarios for your whole team.', nav: 'tabletop' },
  { id: 'tt_ai',     label: 'Tabletop — AI Governance', icon: '🤖', description: 'AI risk and governance scenarios aligned to NIST AI RMF and ISO 42001.', nav: 'tt_ai' },
  { id: 'tt_exec',   label: 'Tabletop — Executive',     icon: '💼', description: 'Board and executive-level crisis response and decision-making scenarios.', nav: 'tt_exec',   comingSoon: true },
  { id: 'tt_vendor', label: 'Tabletop — Vendor',        icon: '🚛', description: 'Third-party and supply chain incident scenarios with vendor coordination.', nav: 'tt_vendor', comingSoon: true },
  { id: 'tt_bcdr',   label: 'Tabletop — BCDR',          icon: '🔄', description: 'Business continuity and disaster recovery scenario exercises.', nav: 'tt_bcdr',   comingSoon: true },
];

function renderExercisesHub() {
  if (!currentOrg) return '';

  const cards = EXERCISE_CATALOG.filter(e => hasPageAccess(e.nav)).map(e => {
    return `<div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column">
      <div style="padding:1rem 1rem .6rem;flex:1">
        <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.4rem">
          <span style="font-size:1.1rem;flex-shrink:0">${e.icon}</span>
          <div style="font-size:13px;font-weight:700;flex:1">${e.label}</div>
        </div>
        <div style="font-size:11px;color:var(--muted);line-height:1.45">${e.description}</div>
      </div>
      <div style="padding:.5rem 1rem .75rem;border-top:1px solid var(--border);display:flex;gap:5px">
        ${e.comingSoon
          ? `<span style="font-size:11px;font-weight:700;color:var(--muted);padding:4px 10px;border-radius:6px;background:var(--bg)">Coming soon</span>`
          : `<button class="btn btn-cyan btn-sm" onclick="setNav('${e.nav}')" style="flex:1">View / Run</button>`}
      </div>
    </div>`;
  }).join('');

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">🎯 Exercises</div>
      <div style="font-size:12px;color:var(--muted)">All available exercises for ${escH(currentOrg.name)}</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:.75rem">
    ${cards}
  </div>`;
}

// ============================================================
// GOVERNANCE HUB
// Vendor Directory is the ongoing management registry.
// TPRA (in Assessments) is the deep-dive assessment process.
// Future: a vendor in the directory will link to one or more TPRA assessments
// via a vendor_directory_id FK on vendor_assessments.
// ============================================================

const GOVERNANCE_GROUPS = [
  {
    label: 'Inventories',
    items: [
      { id: 'app_inv',         label: 'Application Inventory', icon: '🖥️', description: 'Track all business applications — hosting, status, criticality, BCDR, IR scope, and data classification.', nav: 'app_inv' },
      { id: 'ai_tool_catalog', label: 'AI Tool Inventory',     icon: '🤖', description: 'AI tools in use across the org — approved, conditional, shadow IT, and NIST / ISO 42001 mappings.', nav: 'ai_tool_catalog' },
      { id: 'vendor_dir',      label: 'Vendor Directory',      icon: '🏢', description: 'Central registry of all vendors — category, primary contact, status, and review dates.', nav: 'vendor_dir' },
    ],
  },
  {
    label: 'Risk Registers',
    items: [
      { id: 'riskregister',     label: 'Risk Register',    icon: '📋', description: 'Track and manage operational and cybersecurity risks across your organization.', nav: 'riskregister' },
      { id: 'ai_risk_register', label: 'AI Risk Register', icon: '🧠', description: 'AI-specific risk tracking with NIST AI RMF and ISO 42001 control tags. AI-prefixed risk IDs.', nav: 'ai_risk_register' },
    ],
  },
  {
    label: 'Other',
    items: [
      { id: 'policy_lib', label: 'Policy Library', icon: '📄', description: 'Manage and maintain your security policy documents.', nav: 'policy_lib' },
    ],
  },
];

function _govCard(g) {
  return `<div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column">
    <div style="padding:1rem 1rem .6rem;flex:1">
      <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.4rem">
        <span style="font-size:1.1rem;flex-shrink:0">${g.icon}</span>
        <div style="font-size:13px;font-weight:700;flex:1">${g.label}</div>
      </div>
      <div style="font-size:11px;color:var(--muted);line-height:1.45">${g.description}</div>
    </div>
    <div style="padding:.5rem 1rem .75rem;border-top:1px solid var(--border);display:flex;gap:5px">
      ${g.comingSoon
        ? `<span style="font-size:11px;font-weight:700;color:var(--muted);padding:4px 10px;border-radius:6px;background:var(--bg)">Coming soon</span>`
        : `<button class="btn btn-cyan btn-sm" onclick="setNav('${g.nav}')" style="flex:1">View</button>`}
    </div>
  </div>`;
}

function renderGovernanceHub() {
  if (!currentOrg) return '';

  const groupHtml = GOVERNANCE_GROUPS.map(group => {
    const visible = group.items.filter(g => hasPageAccess(g.nav));
    if (!visible.length) return '';
    const cols = Math.min(visible.length, 3);
    return `
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-top:1.25rem;margin-bottom:.5rem;padding-bottom:.3rem;border-bottom:1px solid var(--border)">${group.label}</div>
      <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:.75rem">
        ${visible.map(_govCard).join('')}
      </div>`;
  }).join('');

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">⚖️ Governance</div>
      <div style="font-size:12px;color:var(--muted)">Inventories, risk registers, and policies for ${escH(currentOrg.name)}</div>
    </div>
  </div>
  ${groupHtml}`;
}

function drawAllHubTrends() {
  const h = orgAssessments[currentOrg?.id] || {};
  ASSESSMENT_CATALOG.forEach(a => {
    const runs = h[a.id] || [];
    if (runs.length < 2) return;
    const canvas = document.getElementById(`hub-trend-${a.id}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 110, H = 36;
    canvas.width = W; canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    const scores = runs.map(r => r.score);
    const mn = Math.max(0, Math.min(...scores) - 10);
    const mx = Math.min(100, Math.max(...scores) + 10);
    const px = i => Math.round(8 + i * (W - 16) / (scores.length - 1));
    const py = v => Math.round(H - 6 - (v - mn) / (mx - mn) * (H - 14));
    ctx.beginPath();
    scores.forEach((s, i) => { i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)); });
    ctx.lineTo(px(scores.length - 1), H); ctx.lineTo(px(0), H); ctx.closePath();
    ctx.fillStyle = 'rgba(7,180,217,0.08)'; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = '#07B4D9'; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
    scores.forEach((s, i) => { i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)); });
    ctx.stroke();
    scores.forEach((s, i) => {
      ctx.beginPath(); ctx.arc(px(i), py(s), 3, 0, Math.PI * 2);
      ctx.fillStyle = s >= 75 ? '#15803d' : s >= 50 ? '#b45309' : '#b91c1c'; ctx.fill();
    });
    const last = scores[scores.length - 1];
    ctx.fillStyle = last >= 75 ? '#15803d' : last >= 50 ? '#b45309' : '#b91c1c';
    ctx.font = 'bold 8px Inter,sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(last, W - 2, 9);
  });
}

function duplicateAssessment(moduleId) {
  const h    = orgAssessments[currentOrg?.id] || {};
  const runs = h[moduleId] || [];
  if (!runs.length) return;
  const last = runs[runs.length - 1];
  if (moduleId === 'insurance') {
    insState = { answers: Object.assign({}, last.answers || {}), openPanels: { [INS_SECTIONS[0].id]: true }, view: 'form', editId: null, conductedBy: last.conductedBy || '', date: new Date().toISOString().slice(0, 10) };
    toast('✓ Copied last answers — update and re-save when ready', '#152168');
    setNav('insurance');
  } else if (moduleId === 'cis') {
    const rawAnswers = Object.assign({}, last.answers || {});
    const answers = Object.fromEntries(Object.entries(rawAnswers).filter(([k]) => !k.startsWith('_')));
    cisState = { answers, openPanels: {}, orgId: currentOrg?.id, view: 'form' };
    toast('✓ Copied last answers — update and re-save when ready', '#152168');
    setNav('cis');
  } else if (moduleId === 'cmmc') {
    const rawAnswers = Object.assign({}, last.answers || {});
    const answers = Object.fromEntries(Object.entries(rawAnswers).filter(([k]) => !k.startsWith('_')));
    cmmcState = { ...cmmcState, answers, openPanels: {}, orgId: currentOrg?.id, view: 'form', editId: null, conductedBy: last.conductedBy || '', date: new Date().toISOString().slice(0, 10) };
    toast('✓ Copied last answers — update and re-save when ready', '#152168');
    setNav('cmmc');
  } else if (moduleId === 'cmmc2') {
    const rawAnswers = Object.assign({}, last.answers || {});
    const answers = Object.fromEntries(Object.entries(rawAnswers).filter(([k]) => !k.startsWith('_')));
    cmmc2State = { ...cmmc2State, answers, openPanels: {}, orgId: currentOrg?.id, view: 'form', editId: null, conductedBy: last.conductedBy || '', date: new Date().toISOString().slice(0, 10) };
    toast('✓ Copied last answers — update and re-save when ready', '#152168');
    setNav('cmmc2');
  } else if (moduleId === 'techstack') {
    toast('✓ Navigate to Technology Stack to review and re-run', '#152168');
    setNav('techstack');
  }
}

// ============================================================
// WINDOW EXPORTS
// ============================================================
window.renderHome          = renderHome;
window.renderAssessmentsHub = renderAssessmentsHub;
window.drawHomeCharts      = drawHomeCharts;
window.drawAllHubTrends    = drawAllHubTrends;
window.duplicateAssessment = duplicateAssessment;
window.homeToggleBreakdown = homeToggleBreakdown;
window.loadHomePortfolio   = loadHomePortfolio;
window.orgsUnderCurrent    = orgsUnderCurrent;
window.toggleDashCustomize = toggleDashCustomize;
window.dashToggleWidget    = dashToggleWidget;
window.dashSetWidth        = dashSetWidth;
window.dashSetPriority     = dashSetPriority;
window.cancelDashConfig    = cancelDashConfig;
window.saveDashConfig      = saveDashConfig;
