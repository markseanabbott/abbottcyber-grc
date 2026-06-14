// Returns orgs that sit beneath currentOrg in the hierarchy,
// intersected with the user's auth scope so we never surface orgs they shouldn't see.
function orgsUnderCurrent() {
  if (!currentOrg) return [];
  const authVisible = new Set(visibleOrgs().map(o => o.id));
  // Platform: show everything else in scope
  if (currentOrg.tier === 'platform') {
    return allOrgs.filter(o => o.id !== currentOrg.id && authVisible.has(o.id));
  }
  // Other tiers: direct children + their children (covers grandfather→father→child)
  const directChildren = allOrgs.filter(o => o.parent_id === currentOrg.id && authVisible.has(o.id));
  const childIds = new Set(directChildren.map(o => o.id));
  const grandchildren = allOrgs.filter(o => childIds.has(o.parent_id) && authVisible.has(o.id));
  return [...directChildren, ...grandchildren];
}

function renderHome() {
  if (!currentOrg) return '';
  const subOrgs = orgsUnderCurrent();
  const h = orgAssessments[currentOrg.id] || {};
  const mods = Object.keys(h).filter(k => h[k] && h[k].length > 0);
  const scores = mods.map(k => h[k][h[k].length - 1].score);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  return `
  ${renderTierBanner()}
  <div class="welcome-grid">
    <div class="wcard"><div class="wcard-icon">${TIER_ICONS[currentOrg.tier]}</div>
      <div class="wcard-label">Tier</div>
      <div class="wcard-val" style="font-size:14px">${currentOrg.tier.charAt(0).toUpperCase() + currentOrg.tier.slice(1)}</div>
      <div class="wcard-sub">${currentOrg.name}</div></div>
    <div class="wcard"><div class="wcard-icon">👁️</div>
      <div class="wcard-label">Sub-organisations</div>
      <div class="wcard-val">${subOrgs.length}</div>
      <div class="wcard-sub">${subOrgs.length ? 'Under this org' : 'No children'}</div></div>
    <div class="wcard"><div class="wcard-icon">📋</div>
      <div class="wcard-label">Assessments</div>
      <div class="wcard-val">${mods.length}</div>
      <div class="wcard-sub">This org</div></div>
    <div class="wcard"><div class="wcard-icon">🎯</div>
      <div class="wcard-label">Avg score</div>
      <div class="wcard-val">${avg !== null ? avg + '%' : '—'}</div>
      <div class="wcard-sub">${avg !== null ? 'This org' : 'No data yet'}</div></div>
  </div>
  <div class="card">
    <div class="card-title">Live modules</div>
    ${[{ id: 'insurance', icon: '🛡️', label: 'Insurance Readiness' }, { id: 'techstack', icon: '🖥️', label: 'Technology Stack' }, { id: 'tabletop', icon: '🎯', label: 'Tabletop — Operational' }, { id: 'tpra', icon: '🔍', label: 'Vendor Risk (TPRA)' }].map(item => {
      const runs = (h[item.id] || []);
      const last = runs.length ? runs[runs.length - 1] : null;
      const dot = last ? (last.score >= 75 ? 'dot-green' : last.score >= 50 ? 'dot-amber' : 'dot-red') : 'dot-none';
      return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="setNav('${item.id}')">
        <span class="nav-score-dot ${dot}" style="width:8px;height:8px"></span>
        <span style="font-size:15px">${item.icon}</span>
        <span style="font-size:13px;font-weight:700;flex:1">${item.label}</span>
        ${last ? `<span style="font-size:12px;font-weight:700;color:${last.score >= 75 ? 'var(--green)' : last.score >= 50 ? 'var(--amber)' : 'var(--red)'}">${last.score}/100</span>` : `<span style="font-size:11px;color:var(--muted)">Not started</span>`}
        <span style="color:var(--muted)">›</span>
      </div>`;
    }).join('')}
  </div>
  ${subOrgs.length ? `
  <div class="card">
    <div class="card-title">Organisations under ${escH(currentOrg.name)} (${subOrgs.length})</div>
    ${subOrgs.map(o => {
      const parent = allOrgs.find(p => p.id === o.parent_id);
      return `<div class="org-tree-item">
        <div class="org-avatar ${tierAvClass(o.tier)}" style="width:24px;height:24px;font-size:9px;flex-shrink:0">${tierInitials(o.name)}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:700">${escH(o.name)}</div>
          <div style="font-size:10px;color:var(--muted)">${o.tier}${parent && parent.id !== currentOrg.id ? ' · ' + escH(parent.name) : ''}</div>
        </div>
        <span class="badge ${o.tier === 'grandfather' ? 'b-cyan' : o.tier === 'father' ? 'b-purple' : 'b-green'}">${o.tier}</span>
        <button class="btn btn-outline btn-sm" style="margin-left:6px" onclick="selectOrg('${o.id}')">Switch →</button>
      </div>`;
    }).join('')}
  </div>` : ''}`;
}

// ============================================================
// ASSESSMENTS HUB
// ============================================================

const ASSESSMENT_CATALOG = [
  { id: 'cis', label: 'CIS Controls v8', icon: '✅', ig: null, igLabel: null, description: '153 safeguards across 18 controls. Per-org IG goal (IG1/IG2/IG3). Full assessment history.', nav: 'cis' },
  { id: 'insurance', label: 'Insurance Readiness', icon: '🛡️', ig: null, igLabel: null, description: 'Dual-weighted readiness score for cyber insurance applications.', nav: 'insurance' },
  { id: 'nist', label: 'NIST CSF 2.0', icon: '🏛️', ig: null, igLabel: null, description: 'NIST Cybersecurity Framework 2.0 assessment.', nav: 'nist', comingSoon: true },
  { id: 'techstack', label: 'Technology Stack', icon: '🖥️', ig: null, igLabel: null, description: 'Maps your technology to security frameworks and gaps.', nav: 'techstack' },
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
            : a.igLabel ? `<span class="ig-badge ${a.igClass}">${a.igLabel}</span>` : '<span style="color:var(--muted);font-size:11px">—</span>'}</td>
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
    // Fill area under line
    ctx.beginPath();
    scores.forEach((s, i) => { i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)); });
    ctx.lineTo(px(scores.length - 1), H); ctx.lineTo(px(0), H); ctx.closePath();
    ctx.fillStyle = 'rgba(7,180,217,0.08)'; ctx.fill();
    // Line
    ctx.beginPath(); ctx.strokeStyle = '#07B4D9'; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
    scores.forEach((s, i) => { i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)); });
    ctx.stroke();
    // Dots
    scores.forEach((s, i) => {
      ctx.beginPath(); ctx.arc(px(i), py(s), 3, 0, Math.PI * 2);
      ctx.fillStyle = s >= 75 ? '#15803d' : s >= 50 ? '#b45309' : '#b91c1c'; ctx.fill();
    });
    // Last score label
    const last = scores[scores.length - 1];
    ctx.fillStyle = last >= 75 ? '#15803d' : last >= 50 ? '#b45309' : '#b91c1c';
    ctx.font = 'bold 8px Inter,sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(last, W - 2, 9);
  });
}

// Duplicate an assessment: copy latest answers, clear evidence/notes, go to survey
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
