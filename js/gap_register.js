// ============================================================
// GAP REGISTER (gap_register.js)
// Consolidated cross-module gap list — CIS Controls, Insurance
// Readiness, and Technology Stack, merged by tool type.
// Source of truth for headcount: organisation_profiles.
// Pricing from pricing schedule (psGetForType) — optional; gaps
// show with or without a cost estimate.
// ============================================================

let grState = {
  loading:      false,
  loaded:       false,
  orgId:        null,
  cisRun:       null,
  cisPoamItems: {},
  insRun:       null,
};

// ── LOAD ─────────────────────────────────────────────────────

async function grLoad() {
  if (!currentOrg) return;
  grState.loading = true;
  grState.loaded  = false;
  grState.orgId   = currentOrg.id;
  grState.cisRun  = null;
  grState.cisPoamItems = {};
  grState.insRun  = null;

  const orgData = orgAssessments[currentOrg.id] || {};

  // Latest CIS run
  const cisRuns = (orgData['cis'] || []).slice().sort((a,b) => (b.date||'').localeCompare(a.date||''));
  if (cisRuns.length) {
    grState.cisRun = cisRuns[0];
    if (grState.cisRun?.id) {
      try {
        const rows = await sb.cisPoam.getForAssessment(grState.cisRun.id);
        (rows || []).forEach(p => { grState.cisPoamItems[p.safeguard_id] = p; });
      } catch(e) { /* POAM load not critical */ }
    }
  }

  // Latest Insurance run
  const insRuns = (orgData['insurance'] || []).slice().sort((a,b) => (b.date||'').localeCompare(a.date||''));
  if (insRuns.length) grState.insRun = insRuns[0];

  // Tech Stack: ensure tsState is loaded for this org
  if (!tsState || tsState.orgId !== currentOrg.id) {
    tsInit();
    tsState.orgId = currentOrg.id;
    try { await tsLoadResponses(); } catch(e) { /* non-critical */ }
  }

  grState.loading = false;
  grState.loaded  = true;
  if (activeNav === 'gap_register') {
    document.getElementById('mainContent').innerHTML = renderGapRegister();
  }
}

// ── GAP BUILDER ───────────────────────────────────────────────

function grBuildGapList() {
  // Extract gaps from each module
  const cisAnswers = grState.cisRun
    ? Object.fromEntries(Object.entries(grState.cisRun.answers || {}).filter(([k]) => !k.startsWith('_')))
    : {};
  const cisGoal = grState.cisRun ? (grState.cisRun.answers || {})._goal || null : null;

  const { gaps: cisGaps } = grState.cisRun
    ? rcExtractCISGaps(cisAnswers, cisGoal, grState.cisPoamItems)
    : { gaps: [] };

  const { gaps: insGaps } = grState.insRun
    ? rcExtractInsGaps(grState.insRun.answers || {})
    : { gaps: [] };

  const { gaps: tsGaps } = rcExtractTSGaps();

  // Index by tool type
  const cisMap = Object.fromEntries(cisGaps.map(g => [g.toolType, g.sources]));
  const insMap = Object.fromEntries(insGaps.map(g => [g.toolType, g.sources]));
  const tsMap  = Object.fromEntries(tsGaps.map(g => [g.toolType, g.sources]));

  const hc = rcGetHeadcount(currentOrg?.id);

  // Walk all tool types in the catalog — show if flagged by at least one module
  const rows = [];
  PS_ALL_TYPES.forEach(t => {
    const cisS = cisMap[t.value] || null;
    const insS = insMap[t.value] || null;
    const tsS  = tsMap[t.value]  || null;
    if (!cisS && !insS && !tsS) return;

    const ps   = (typeof psGetForType === 'function') ? psGetForType(t.value) : null;
    const cost = (ps && hc.hasProfile) ? rcCalcAnnualCost(ps, hc) : null;
    const moduleCount = [cisS, insS, tsS].filter(Boolean).length;

    rows.push({ toolType:t.value, label:t.label, cisS, insS, tsS, ps, cost, hc, moduleCount });
  });

  // Sort: most modules flagging first, then alphabetical
  rows.sort((a,b) => b.moduleCount - a.moduleCount || a.label.localeCompare(b.label));
  return rows;
}

// ── RENDER ────────────────────────────────────────────────────

function renderGapRegister() {
  if (!currentOrg) return '';

  if (grState.loading || !grState.loaded) {
    return `${renderTierBanner()}
    <div style="text-align:center;padding:3rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,0.2);border-top-color:var(--navy);width:24px;height:24px;margin:0 auto 1rem"></div>
      <div style="font-size:13px;font-weight:700;color:var(--text)">Loading gap register…</div>
    </div>`;
  }

  const rows = grBuildGapList();
  const hc   = rcGetHeadcount(currentOrg.id);

  const hasCIS = !!grState.cisRun;
  const hasIns = !!grState.insRun;
  const hasTS  = !!(tsState?.answers && Object.keys(tsState.answers).length);

  // Summary of data sources
  const srcChips = [
    hasCIS ? `<span style="font-size:10px;padding:2px 8px;background:#dbeafe;color:#1d4ed8;border-radius:4px;font-weight:700">CIS ${grState.cisRun?.date||''}</span>` : `<span style="font-size:10px;padding:2px 8px;background:#f1f5f9;color:var(--muted);border-radius:4px">CIS — no assessment</span>`,
    hasIns ? `<span style="font-size:10px;padding:2px 8px;background:#dcfce7;color:#15803d;border-radius:4px;font-weight:700">Insurance ${grState.insRun?.date||''}</span>` : `<span style="font-size:10px;padding:2px 8px;background:#f1f5f9;color:var(--muted);border-radius:4px">Insurance — no assessment</span>`,
    hasTS  ? `<span style="font-size:10px;padding:2px 8px;background:#fef3c7;color:#92400e;border-radius:4px;font-weight:700">Tech Stack</span>` : `<span style="font-size:10px;padding:2px 8px;background:#f1f5f9;color:var(--muted);border-radius:4px">Tech Stack — no responses</span>`,
  ].join('');

  // Headcount banner (compact)
  let hcBanner = '';
  if (!hc.hasProfile) {
    hcBanner = `<div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:6px;padding:7px 12px;margin-bottom:10px;font-size:11px;color:#92400e;display:flex;align-items:center;gap:8px">
      ⚠️ <span>Add headcount in <button onclick="setNav('company_profile')" style="background:none;border:none;cursor:pointer;font-size:11px;color:#1d4ed8;padding:0;text-decoration:underline;font-family:inherit">Company Profile</button> to show cost estimates</span>
    </div>`;
  }

  if (!rows.length) {
    const noData = !hasCIS && !hasIns && !hasTS;
    return `${renderTierBanner()}
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
      <div>
        <div style="font-size:17px;font-weight:700">📋 Gap Register</div>
        <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · consolidated cross-module gaps</div>
      </div>
    </div>
    <div class="card" style="padding:2.5rem;text-align:center;color:var(--muted)">
      <div style="font-size:2rem;margin-bottom:.5rem">${noData ? '📋' : '✅'}</div>
      <div style="font-weight:700;color:var(--text);margin-bottom:.25rem">
        ${noData ? 'No assessments recorded yet' : 'No gaps identified'}
      </div>
      <div style="font-size:12px">
        ${noData
          ? 'Run a CIS Controls, Insurance Readiness, or Technology Stack assessment to populate the gap register.'
          : 'All assessed controls are met across CIS, Insurance, and Technology Stack.'}
      </div>
    </div>`;
  }

  // Totals for priced rows
  let totalAnnLow = 0, totalAnnHigh = 0, totalOTLow = 0, totalOTHigh = 0, pricedCount = 0;
  rows.forEach(r => {
    if (r.cost) {
      totalAnnLow  += r.cost.annLow;
      totalAnnHigh += r.cost.annHigh;
      totalOTLow   += r.cost.otLow;
      totalOTHigh  += r.cost.otHigh;
      pricedCount++;
    }
  });

  const _fmt = n => n ? '$' + Math.round(n).toLocaleString() : '—';
  const _rng = (lo,hi) => !lo && !hi ? '—' : (!hi || lo===hi) ? _fmt(lo) : `${_fmt(lo)} – ${_fmt(hi)}`;

  const tableRows = rows.map(r => {
    // Module badges
    const cisBadge = r.cisS
      ? `<span title="${r.cisS.join(', ')}" style="font-size:9px;font-weight:700;padding:1px 6px;background:#dbeafe;color:#1d4ed8;border-radius:3px;cursor:default">CIS</span>`
      : '';
    const insBadge = r.insS
      ? `<span title="${r.insS.join(', ')}" style="font-size:9px;font-weight:700;padding:1px 6px;background:#dcfce7;color:#15803d;border-radius:3px;cursor:default">Insurance</span>`
      : '';
    const tsBadge = r.tsS
      ? `<span title="${r.tsS.join(', ')}" style="font-size:9px;font-weight:700;padding:1px 6px;background:#fef3c7;color:#92400e;border-radius:3px;cursor:default">Tech Stack</span>`
      : '';
    const badges = [cisBadge, insBadge, tsBadge].filter(Boolean).join(' ');

    // Source count note
    const totalSrcs = [...(r.cisS||[]), ...(r.insS||[]), ...(r.tsS||[])].length;
    const srcNote = `${totalSrcs} gap${totalSrcs!==1?'s':''} · ${r.moduleCount} framework${r.moduleCount!==1?'s':''}`;

    // Pricing
    let pricingCell = '';
    let annCell = '', otCell = '';
    if (r.ps) {
      const sku = r.ps.name ? escH(r.ps.name) : '—';
      const src = r.ps.source === 'parent'
        ? `<span style="font-size:8px;font-weight:700;color:#7c3aed;padding:1px 4px;background:#faf5ff;border-radius:2px">MSP</span>`
        : `<span style="font-size:8px;font-weight:700;color:#0369a1;padding:1px 4px;background:#e0f2fe;border-radius:2px">Custom</span>`;
      pricingCell = `<div style="font-size:11px;font-weight:600">${sku} ${src}</div>
        <div style="font-size:9px;color:var(--muted);margin-top:1px">${r.ps.vendor ? escH(r.ps.vendor)+' · ' : ''}${r.cost?.modelLabel||''}</div>`;
      annCell = r.cost ? `<span style="font-weight:700">${_rng(r.cost.annLow, r.cost.annHigh)}</span>` : '—';
      otCell  = r.cost?.otLow > 0 ? `<span style="color:#7c3aed;font-weight:700">${_rng(r.cost.otLow, r.cost.otHigh)}</span>` : '—';
    } else {
      pricingCell = `<span style="font-size:10px;color:#b45309;cursor:pointer" onclick="setNav('pricing_schedule')">Not configured — add to Pricing Schedule →</span>`;
      annCell = '—';
      otCell  = '—';
    }

    return `<tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:8px 10px;vertical-align:top">
        <div style="font-weight:700;font-size:12px">${escH(r.label)}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px">${srcNote}</div>
      </td>
      <td style="padding:8px 10px;vertical-align:top">
        <div style="display:flex;gap:4px;flex-wrap:wrap">${badges}</div>
      </td>
      <td style="padding:8px 10px;vertical-align:top">${pricingCell}</td>
      <td style="padding:8px 10px;text-align:right;vertical-align:top;white-space:nowrap">${annCell}</td>
      <td style="padding:8px 10px;text-align:right;vertical-align:top;white-space:nowrap">${otCell}</td>
    </tr>`;
  }).join('');

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📋 Gap Register</div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:6px">${escH(currentOrg.name)} · ${rows.length} tool gap${rows.length!==1?'s':''} identified across frameworks</div>
      <div style="display:flex;gap:5px;flex-wrap:wrap">${srcChips}</div>
    </div>
    <button class="btn btn-outline btn-sm" onclick="grLoad()">↺ Refresh</button>
  </div>

  ${hcBanner}

  ${pricedCount > 0 ? `
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem">
    <div style="padding:10px 16px;border-radius:8px;background:var(--card);border:1px solid var(--border);min-width:120px">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">Est. Annual Cost</div>
      <div style="font-size:18px;font-weight:800;color:var(--navy);margin-top:2px">${_rng(totalAnnLow, totalAnnHigh)}</div>
      <div style="font-size:9px;color:var(--muted);margin-top:1px">${pricedCount} of ${rows.length} tools priced</div>
    </div>
    ${totalOTLow > 0 ? `
    <div style="padding:10px 16px;border-radius:8px;background:var(--card);border:1px solid var(--border);min-width:120px">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">Est. One-time Setup</div>
      <div style="font-size:18px;font-weight:800;color:#7c3aed;margin-top:2px">${_rng(totalOTLow, totalOTHigh)}</div>
    </div>` : ''}
    ${rows.length - pricedCount > 0 ? `
    <div style="padding:10px 16px;border-radius:8px;background:#fef3c7;border:1px solid #fbbf24;min-width:120px">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#92400e">Not Priced</div>
      <div style="font-size:18px;font-weight:800;color:#92400e;margin-top:2px">${rows.length - pricedCount} tool${rows.length-pricedCount!==1?'s':''}</div>
      <div style="font-size:9px;color:#92400e;margin-top:1px">Add to Pricing Schedule</div>
    </div>` : ''}
  </div>` : ''}

  <div class="card" style="padding:0">
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:#f8fafc">
            <th style="text-align:left;padding:8px 10px;border-bottom:2px solid var(--border);font-weight:700;min-width:140px">Gap / Tool type</th>
            <th style="text-align:left;padding:8px 10px;border-bottom:2px solid var(--border);font-weight:700;min-width:180px">Flagged by</th>
            <th style="text-align:left;padding:8px 10px;border-bottom:2px solid var(--border);font-weight:700;min-width:200px">Pricing schedule</th>
            <th style="text-align:right;padding:8px 10px;border-bottom:2px solid var(--border);font-weight:700;min-width:130px">Annual cost (est.)</th>
            <th style="text-align:right;padding:8px 10px;border-bottom:2px solid var(--border);font-weight:700;min-width:110px;color:#7c3aed">One-time setup</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
        ${pricedCount > 0 ? `
        <tfoot>
          <tr style="background:#f8fafc;border-top:2px solid var(--border)">
            <td colspan="3" style="padding:8px 10px;font-weight:700">Total (priced tools only)</td>
            <td style="padding:8px 10px;text-align:right;font-weight:800;color:var(--navy)">${_rng(totalAnnLow, totalAnnHigh)}</td>
            <td style="padding:8px 10px;text-align:right;font-weight:700;color:#7c3aed">${totalOTLow > 0 ? _rng(totalOTLow, totalOTHigh) : '—'}</td>
          </tr>
          <tr style="background:#f8fafc">
            <td colspan="5" style="padding:4px 10px;font-size:10px;color:var(--muted)">
              Hover over framework badges to see specific question / control IDs. Annual costs = monthly rate × 12. Headcount from Company Profile${hc.source==='band'?' (estimated from employee band)':''}.
            </td>
          </tr>
        </tfoot>` : ''}
      </table>
    </div>
  </div>`;
}

window.renderGapRegister = renderGapRegister;
window.grLoad            = grLoad;
