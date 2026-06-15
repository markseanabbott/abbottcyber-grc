// Returns orgs that sit beneath currentOrg in the hierarchy,
// intersected with the user's auth scope so we never surface orgs they shouldn't see.
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

// ============================================================
// HOME DASHBOARD
// ============================================================

function renderHome() {
  if (!currentOrg) return '';
  const h = orgAssessments[currentOrg.id] || {};
  const subOrgs = orgsUnderCurrent();

  // Module access gates — respect viewAs role
  const _can = (gid) => typeof hasModuleAccess === 'function' ? hasModuleAccess(gid) : true;
  const canAssessments = _can('g_assessments');
  const canAI          = _can('g_ai_readiness');
  const canRisk        = _can('g_risk');

  // Avg score: only from accessible modules
  const scoredMods = [
    ...(canAssessments ? ['cis','insurance','techstack'] : []),
    ...(canAI          ? ['ai_unified'] : []),
  ];
  const scores = scoredMods
    .map(k => { const r = h[k] || []; return r.length ? r[r.length-1].score : null; })
    .filter(s => s !== null);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  // Quick links — only modules user can reach
  const quickLinks = [
    { id:'insurance',  icon:'🛡️', label:'Insurance Readiness', group:'g_assessments' },
    { id:'techstack',  icon:'🖥️', label:'Technology Stack',    group:'g_assessments' },
    { id:'cis',        icon:'✅', label:'CIS Controls',         group:'g_assessments' },
    { id:'tpra',       icon:'🔍', label:'Vendor Risk',          group:'g_risk' },
    { id:'tabletop',   icon:'🎯', label:'Tabletop',             group:'g_exercises' },
    { id:'ai_unified', icon:'🤖', label:'AI Readiness',         group:'g_ai_readiness' },
  ].filter(l => _can(l.group));

  // Risk register rows (use rrState if loaded for this org)
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

  // Build panel chicklets — only accessible ones
  const panels = [];
  if (canAssessments) panels.push(_homeAssessmentsChicklet(h));
  if (canRisk)        panels.push(_homeRiskChicklet(rrRows, rrLoaded));
  if (canAI)          panels.push(_homeAiChicklet(h));

  const noPanels = panels.length === 0;

  return `
  ${renderTierBanner()}

  <!-- 4 stat chicklets -->
  <div class="welcome-grid">
    <div class="wcard">
      <div class="wcard-icon">${TIER_ICONS[currentOrg.tier]}</div>
      <div class="wcard-label">Tier</div>
      <div class="wcard-val" style="font-size:14px">${currentOrg.tier.charAt(0).toUpperCase() + currentOrg.tier.slice(1)}</div>
      <div class="wcard-sub">${currentOrg.name}</div>
    </div>
    <div class="wcard">
      <div class="wcard-icon">👁️</div>
      <div class="wcard-label">Sub-organisations</div>
      <div class="wcard-val">${subOrgs.length}</div>
      <div class="wcard-sub">${subOrgs.length ? 'Under this org' : 'No children'}</div>
    </div>
    <div class="wcard">
      <div class="wcard-icon">📋</div>
      <div class="wcard-label">Assessments run</div>
      <div class="wcard-val">${canAssessments || canAI ? scores.length : '—'}</div>
      <div class="wcard-sub">${canAssessments || canAI ? 'This org' : 'No access'}</div>
    </div>
    <div class="wcard">
      <div class="wcard-icon">🎯</div>
      <div class="wcard-label">Avg score</div>
      <div class="wcard-val">${avg !== null ? avg + '%' : '—'}</div>
      <div class="wcard-sub">${avg !== null ? 'Across active modules' : (canAssessments || canAI ? 'No data yet' : 'No access')}</div>
    </div>
  </div>

  <!-- Quick access links (filtered by module access) -->
  ${quickLinks.length ? `<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.9rem 0 1.1rem">
    ${quickLinks.map(l => {
      const runs = h[l.id] || [];
      const last = runs.length ? runs[runs.length - 1] : null;
      const dot = last ? (last.score >= 70 ? '#15803d' : last.score >= 40 ? '#b45309' : '#dc2626') : '#cbd5e1';
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
  const rows = catalog.map(a => {
    const runs = h[a.id] || [];
    const last = runs.length ? runs[runs.length - 1] : null;
    const scoreColor = !last ? 'var(--muted)' : last.score >= 70 ? '#15803d' : last.score >= 40 ? '#b45309' : '#dc2626';
    return `<div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .9rem;border-bottom:1px solid var(--border);cursor:pointer" onclick="setNav('${a.nav}')" onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background=''">
      <span style="font-size:13px;flex-shrink:0">${a.icon}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.label}</div>
        <div style="font-size:10px;color:var(--muted)">${last ? last.date : 'Never run'}</div>
      </div>
      ${runs.length >= 2 ? `<canvas id="home-trend-${a.id}" width="50" height="20" style="flex-shrink:0"></canvas>` : ''}
      <span style="font-size:12px;font-weight:800;color:${scoreColor};flex-shrink:0;min-width:28px;text-align:right">${last ? last.score + '%' : '—'}</span>
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
  const runs = [...(h['ai_unified'] || [])].sort((a, b) => (b.date||'').localeCompare(a.date||''));
  const latest = runs[0] || null;
  const scoreVal = latest?.score ?? null;
  const scoreColor = scoreVal !== null ? (scoreVal >= 70 ? '#15803d' : scoreVal >= 40 ? '#b45309' : '#dc2626') : 'var(--muted)';

  if (!latest) {
    return `<div class="card" style="padding:0;overflow:hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem .9rem .5rem;border-bottom:1px solid var(--border)">
        <div style="font-size:13px;font-weight:700">🤖 AI Readiness</div>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();setNav('ai_hub')">View Hub →</button>
      </div>
      <div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:12px">
        <div style="font-size:1.5rem;margin-bottom:.35rem">🤖</div>
        No AI Governance assessment yet.<br>
        <button class="btn btn-outline btn-sm" style="margin-top:.6rem" onclick="setNav('ai_unified')">Start Assessment →</button>
      </div>
    </div>`;
  }

  return `<div class="card" style="padding:0;overflow:hidden;cursor:pointer" onclick="setNav('ai_hub')" onmouseover="this.style.boxShadow='0 0 0 2px var(--cyan)'" onmouseout="this.style.boxShadow=''">
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
      <canvas id="home-ai-radar" style="display:block;width:100%;height:240px"></canvas>
    </div>
    <div style="padding:.35rem .9rem .75rem;text-align:center;font-size:11px;color:var(--cyan);font-weight:700">→ AI Readiness Hub</div>
  </div>`;
}

// ─── CHART DRAWING ────────────────────────────────────────────────────────────

function drawHomeCharts() {
  _drawHomeAssessmentTrends();
  _drawHomeAiRadar();
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
  const canvas = document.getElementById('home-ai-radar');
  if (!canvas) return;
  const W = canvas.offsetWidth || 260;
  canvas.setAttribute('width', W);
  canvas.setAttribute('height', 240);
  const answers = Object.fromEntries(Object.entries(latest.answers || {}).filter(([k]) => !k.startsWith('_')));
  const fw = aiuFrameworksFromRun(latest);
  // Map null pct → 0 so all 9 groups always show as axes on the radar
  const groupScores = aiuCalcGroupScores(answers, fw).map(g => ({ ...g, pct: g.pct ?? 0 }));
  aiuDrawRadar('home-ai-radar', groupScores);
}

// ============================================================
// ASSESSMENTS HUB
// ============================================================

const ASSESSMENT_CATALOG = [
  { id: 'cis',       label: 'CIS Controls v8',    icon: '✅', description: '153 safeguards across 18 controls. Per-org IG goal (IG1/IG2/IG3). Full assessment history.', nav: 'cis' },
  { id: 'insurance', label: 'Insurance Readiness', icon: '🛡️', description: 'Dual-weighted readiness score for cyber insurance applications.', nav: 'insurance' },
  { id: 'nist',      label: 'NIST CSF 2.0',        icon: '🏛️', description: 'NIST Cybersecurity Framework 2.0 assessment.', nav: 'nist', comingSoon: true },
  { id: 'techstack', label: 'Technology Stack',    icon: '🖥️', description: 'Maps your technology to security frameworks and gaps.', nav: 'techstack' },
];

function renderAssessmentsHub() {
  if (!currentOrg) return '';
  const h = orgAssessments[currentOrg.id] || {};
  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📋 Assessments</div>
      <div style="font-size:12px;color:var(--muted)">All available assessments for ${currentOrg.name}</div>
    </div>
  </div>
  <div class="card" style="padding:0;overflow:hidden">
    <table class="assess-table">
      <thead>
        <tr>
          <th>Assessment</th>
          <th>IG Level</th>
          <th>Last Run</th>
          <th>Score</th>
          <th style="min-width:110px">Trend</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${ASSESSMENT_CATALOG.map(a => {
          const runs = h[a.id] || [];
          const last = runs.length ? runs[runs.length - 1] : null;
          const scorePillClass = !last ? 'asp-none' : last.score >= 75 ? 'asp-green' : last.score >= 50 ? 'asp-amber' : 'asp-red';
          const canDuplicate = runs.length > 0 && !a.comingSoon;
          return `<tr>
            <td>
              <div class="assess-row-name">${a.icon} ${a.label}</div>
              <div class="assess-row-sub">${a.description}</div>
            </td>
            <td>${a.id === 'cis'
              ? (() => { const g = (orgProfiles[currentOrg?.id] || {}).cis_goal; const igCols = { ig1: { bg: '#dcfce7', txt: '#15803d' }, ig2: { bg: '#dbeafe', txt: '#1d4ed8' }, ig3: { bg: '#ede9fe', txt: '#6d28d9' } }; const c = igCols[g]; return g && c ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;background:${c.bg};color:${c.txt}">${g.toUpperCase()}</span>` : '<span style="font-size:10px;color:var(--muted)">No goal set</span>'; })()
              : '<span style="color:var(--muted);font-size:11px">—</span>'}</td>
            <td style="color:${last ? 'var(--text)' : 'var(--muted)'}">
              ${last ? `<span style="font-size:11px">${last.date}</span>` : '<span style="font-size:11px">Never</span>'}
              ${runs.length > 1 ? `<div style="font-size:10px;color:var(--muted)">${runs.length} runs total</div>` : ''}
            </td>
            <td><span class="assess-score-pill ${scorePillClass}">${last ? last.score + '/100' : 'Not run'}</span></td>
            <td>
              ${runs.length >= 2
                ? `<canvas id="hub-trend-${a.id}" class="trend-canvas" width="110" height="36"></canvas>`
                : `<span style="font-size:10px;color:var(--muted)">${runs.length === 1 ? '1 run — need 2+' : '—'}</span>`}
            </td>
            <td>
              <div style="display:flex;gap:5px;flex-wrap:wrap">
                ${a.comingSoon
                  ? `<span style="font-size:10px;font-weight:700;color:var(--muted);padding:4px 8px;border-radius:6px;background:var(--bg)">Coming soon</span>`
                  : `<button class="btn btn-cyan btn-sm" onclick="setNav('${a.nav}')">${last ? 'View / Run' : 'Start'}</button>`}
                ${canDuplicate ? `<button class="btn btn-outline btn-sm" title="Duplicate for re-up assessment" onclick="duplicateAssessment('${a.id}')">⧉ Re-up</button>` : ''}
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>
  <div style="font-size:11px;color:var(--muted);margin-top:8px">
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
  const h = orgAssessments[currentOrg?.id] || {};
  const runs = h[moduleId] || [];
  if (!runs.length) return;
  const last = runs[runs.length - 1];
  if (moduleId === 'insurance') {
    insState = { answers: Object.assign({}, last.answers || {}), openPanels: { [INS_SECTIONS[0].id]: true } };
    toast('✓ Copied last answers — update and re-save when ready', '#152168');
    setNav('insurance');
  } else if (moduleId === 'cis') {
    const rawAnswers = Object.assign({}, last.answers || {});
    const answers = Object.fromEntries(Object.entries(rawAnswers).filter(([k]) => !k.startsWith('_')));
    cisState = { answers, openPanels: {}, orgId: currentOrg?.id, view: 'form' };
    toast('✓ Copied last answers — update and re-save when ready', '#152168');
    setNav('cis');
  } else if (moduleId === 'techstack') {
    toast('✓ Navigate to Technology Stack to review and re-run', '#152168');
    setNav('techstack');
  }
}
