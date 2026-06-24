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
            <th style="${thStyle};text-align:left">Organisation</th>
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

function renderHome() {
  if (!currentOrg) return '';

  // Kick off portfolio data load if stale or missing
  const _scopeKey = _portfolioScopeOrgs().map(o => o.id).sort().join(',');
  if (!homePortfolioState.loaded || homePortfolioState.scopeKey !== _scopeKey) {
    loadHomePortfolio();
  }

  // Kick off gap data load if stale — grLoad() will re-render home when done
  if (typeof grLoad === 'function' && (!grState.loaded || grState.orgId !== currentOrg.id)) {
    grLoad();
  }

  const h        = orgAssessments[currentOrg.id] || {};
  const isChild  = currentOrg.tier === 'child';
  const po       = homePortfolioState;
  const pLoaded  = po.loaded  && po.scopeKey === _scopeKey;
  const pLoading = po.loading && po.scopeKey === _scopeKey;

  // Module access gates — respect viewAs role
  const _can = (gid) => typeof hasModuleAccess === 'function' ? hasModuleAccess(gid) : true;
  const canAssessments = _can('g_assessments');
  const canAI          = _can('g_ai_readiness');
  const canRisk        = _can('g_risk');

  // Quick links
  const quickLinks = [
    { id:'insurance',  icon:'🛡️', label:'Insurance Readiness', group:'g_assessments' },
    { id:'techstack',  icon:'🖥️', label:'Technology Stack',    group:'g_assessments' },
    { id:'cis',        icon:'✅', label:'CIS Controls',         group:'g_assessments' },
    { id:'tpra',       icon:'🔍', label:'Vendor Risk',          group:'g_risk' },
    { id:'tabletop',   icon:'🎯', label:'Tabletop',             group:'g_exercises' },
    { id:'ai_unified', icon:'🤖', label:'AI Readiness',         group:'g_ai_readiness' },
  ].filter(l => _can(l.group));

  // Risk register rows for risk chicklet (existing panel — single org, already loaded)
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

  // Panel chicklets
  const panels = [];
  if (canAssessments) { const p = _homeAssessmentsChicklet(h); if (p) panels.push(p); }
  if (canRisk)        panels.push(_homeRiskChicklet(rrRows, rrLoaded));
  if (canRisk)        panels.push(_homeTopToolsChicklet());
  if (canAI)          { const p = _homeAiChicklet(h); if (p) panels.push(p); }
  if (canAssessments && (h['cis'] || []).length > 0) panels.push(_homeCisRadarChicklet(h));

  const noPanels = panels.length === 0;

  // Stat card HTML
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

  return `
  ${renderTierBanner()}

  <!-- 4 stat cards -->
  <div class="welcome-grid">
    ${card1}${card2}${card3}${card4}
  </div>

  ${breakdownPanel}

  <!-- Quick access links -->
  ${quickLinks.length ? `<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.9rem 0 1.1rem">
    ${quickLinks.map(l => {
      const runs = h[l.id] || [];
      const last = runs.length ? runs[runs.length - 1] : null;
      const dot  = last ? (last.score >= 70 ? '#15803d' : last.score >= 40 ? '#b45309' : '#dc2626') : '#cbd5e1';
      return `<button onclick="setNav('${l.id}')" style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border:1px solid var(--border);border-radius:20px;background:#fff;font-size:12px;font-weight:600;color:var(--text);cursor:pointer;transition:all .15s" onmouseover="this.style.borderColor='var(--cyan)';this.style.color='var(--cyan)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text)'">
        <span style="width:7px;height:7px;border-radius:50%;background:${dot};flex-shrink:0"></span>
        ${l.icon} ${l.label}
      </button>`;
    }).join('')}
  </div>` : ''}

  <!-- Panel chicklet grid -->
  ${noPanels
    ? `<div class="card" style="padding:2.5rem;text-align:center;color:var(--muted)">
        <div style="font-size:2.5rem;margin-bottom:.5rem">🔒</div>
        <div style="font-weight:700;color:var(--text);margin-bottom:.25rem">Limited access</div>
        <div style="font-size:12px">You don't have access to any modules on this dashboard.<br>Contact your administrator to request access.</div>
      </div>`
    : `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;align-items:start">${panels.join('')}</div>`
  }`;
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
  _drawHomeAiRadar();
  _drawHomeCisRadar();
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
];

function renderAssessmentsHub() {
  if (!currentOrg) return '';
  const h = orgAssessments[currentOrg.id] || {};

  const chicklets = ASSESSMENT_CATALOG.map(a => {
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

    return `<div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column">
      <div style="padding:1rem 1rem .6rem;flex:1">
        <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.4rem">
          <span style="font-size:1.1rem;flex-shrink:0">${a.icon}</span>
          <div style="font-size:13px;font-weight:700;flex:1">${a.label}</div>
          ${igBadge}
        </div>
        <div style="font-size:11px;color:var(--muted);line-height:1.45">${a.description}</div>
      </div>
      <div style="padding:.5rem 1rem .6rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:.5rem">
        <div>
          <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;font-weight:700">Last run</div>
          <div style="font-size:11px;font-weight:700;color:var(--text)">
            ${last ? last.date : '<span style="color:var(--muted);font-weight:400">Never</span>'}
            ${runs.length > 1 ? `<span style="font-size:9px;color:var(--muted);font-weight:400;margin-left:4px">${runs.length} runs</span>` : ''}
          </div>
        </div>
        ${last ? `<div style="font-size:1.15rem;font-weight:800;color:${scoreColor}">${last.score}%</div>` : ''}
      </div>
      <div style="padding:.5rem 1rem .75rem;border-top:1px solid var(--border);display:flex;gap:5px">
        ${a.comingSoon
          ? `<span style="font-size:11px;font-weight:700;color:var(--muted);padding:4px 10px;border-radius:6px;background:var(--bg)">Coming soon</span>`
          : `<button class="btn btn-cyan btn-sm" onclick="setNav('${a.nav}')" style="flex:1">${last ? 'View / Run' : 'Start'}</button>`}
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
