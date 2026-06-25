// ============================================================
// app_inventory.js — Application Inventory module
// gov1: scaffold | gov2: risk/criticality | gov3: BCDR | gov4: IR
// PATCH_040 (base table) + PATCH_041 (gov2/gov3/gov4 columns)
// ============================================================

let appInvState = {
  rows:       [],
  loading:    false,
  loaded:     false,
  orgId:      null,
  filter:     'all',     // status filter
  filterCrit: 'all',     // criticality filter (gov2)
  view:       'list',    // 'list' | 'bcdr' (gov3 exec summary)
  modal:      null,      // { type:'add'|'edit', row?, tab? }
};

// ─── LOAD ─────────────────────────────────────────────────────────────────────

async function loadAppInventory(orgId) {
  appInvState.loading = true;
  appInvState.orgId   = orgId;
  try {
    const rows = await sb.appInventory.getForOrg(orgId);
    appInvState.rows   = Array.isArray(rows) ? rows : [];
    appInvState.loaded = true;
  } catch(e) {
    appInvState.rows   = [];
    appInvState.loaded = true;
  }
  appInvState.loading = false;
}

// ─── DERIVED HELPERS (gov2 + gov4) ────────────────────────────────────────────

function _ainvDeriveRisk(criticality, dataClass) {
  const dc        = Array.isArray(dataClass) ? dataClass : [];
  const sensitive = dc.some(d => ['PII','Payment','Health'].includes(d));
  const highSens  = dc.filter(d => ['PII','Payment','Health'].includes(d)).length >= 2;
  if (!criticality) return null;
  if (criticality === 'Critical')              return 'Critical';
  if (criticality === 'High' && sensitive)     return 'Critical';
  if (criticality === 'High')                  return 'High';
  if (criticality === 'Medium' && highSens)    return 'High';
  if (criticality === 'Medium' && sensitive)   return 'Medium';
  if (criticality === 'Low'    && highSens)    return 'Medium';
  return 'Low';
}

function _ainvSuggestIrTier(criticality, dataClass) {
  const dc        = Array.isArray(dataClass) ? dataClass : [];
  const sensitive = dc.some(d => ['PII','Payment','Health'].includes(d));
  if (!criticality) return null;
  if (criticality === 'Critical')              return 'P1';
  if (criticality === 'High' && sensitive)     return 'P1';
  if (criticality === 'High')                  return 'P2';
  if (criticality === 'Medium' && sensitive)   return 'P2';
  if (criticality === 'Medium')                return 'P3';
  return 'P4';
}

// ─── RENDER ROOT ──────────────────────────────────────────────────────────────

function renderAppInventory() {
  if (appInvState.loading) {
    return `<div style="text-align:center;padding:3rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,.2);border-top-color:var(--navy);width:24px;height:24px;margin:0 auto 1rem"></div>
      <div style="font-size:13px;font-weight:700;color:var(--text)">Loading applications…</div>
    </div>`;
  }
  return appInvState.view === 'bcdr' ? _ainvBcdrView() : _ainvListView();
}

// ─── LIST VIEW ────────────────────────────────────────────────────────────────

function _ainvListView() {
  const all  = appInvState.rows;
  const filt = appInvState.filter;
  const fc   = appInvState.filterCrit;

  let filtered = filt === 'all' ? all : all.filter(r => r.status === filt);
  if (fc !== 'all') filtered = filtered.filter(r => r.criticality === fc);

  const counts = {
    all:           all.length,
    active:        all.filter(r => r.status === 'Active').length,
    underReview:   all.filter(r => r.status === 'Under Review').length,
    decommissioned:all.filter(r => r.status === 'Decommissioned').length,
  };
  const critCounts = {
    Critical: all.filter(r => r.criticality === 'Critical').length,
    High:     all.filter(r => r.criticality === 'High').length,
    Medium:   all.filter(r => r.criticality === 'Medium').length,
    Low:      all.filter(r => r.criticality === 'Low').length,
  };

  return `
${renderTierBanner()}
<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.85rem;flex-wrap:wrap;gap:8px">
  <div>
    <div style="display:flex;align-items:center;gap:.6rem">
      <button onclick="setNav('governance')" class="btn btn-outline btn-sm" style="font-size:11px;padding:3px 8px">← Governance</button>
      <div style="font-size:1.05rem;font-weight:700;color:var(--text)">🖥️ Application Inventory</div>
    </div>
    <div style="font-size:12px;color:var(--muted);margin-top:4px">Business applications registered for ${_aiEsc(currentOrg?.name || '')}</div>
  </div>
  <div style="display:flex;gap:.5rem;align-items:center">
    <button class="btn btn-outline btn-sm" onclick="appInvSetView('bcdr')" title="BCDR Tier 1 exec summary">📋 BCDR Summary</button>
    <button class="btn btn-cyan btn-sm" onclick="appInvOpenAdd()">+ Add Application</button>
  </div>
</div>

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1.25rem">
  ${[
    { label:'Total',          val: counts.all,             col:'var(--navy)' },
    { label:'Active',         val: counts.active,          col:'#15803d' },
    { label:'Under Review',   val: counts.underReview,     col:'#b45309' },
    { label:'Decommissioned', val: counts.decommissioned,  col:'var(--muted)' },
  ].map(s => `<div class="card" style="padding:1rem;text-align:center">
    <div style="font-size:1.75rem;font-weight:800;color:${s.col}">${s.val}</div>
    <div style="font-size:11px;color:var(--muted);font-weight:600;margin-top:.2rem">${s.label}</div>
  </div>`).join('')}
</div>

<div class="card" style="padding:0;overflow:hidden">
  <div class="view-tabs" style="border-bottom:1px solid var(--border);margin-bottom:0">
    ${[
      { id:'all',           label:`All (${counts.all})` },
      { id:'Active',        label:`Active (${counts.active})` },
      { id:'Under Review',  label:`Under Review (${counts.underReview})` },
      { id:'Decommissioned',label:`Decommissioned (${counts.decommissioned})` },
    ].map(t => `<button class="view-tab${filt===t.id?' active':''}" onclick="appInvSetFilter('${t.id}')">${t.label}</button>`).join('')}
  </div>
  <div style="padding:.6rem 1rem;border-bottom:1px solid var(--border);background:var(--bg);display:flex;gap:.4rem;align-items:center;flex-wrap:wrap">
    <span style="font-size:11px;font-weight:700;color:var(--muted);margin-right:.25rem">Criticality:</span>
    ${[
      { id:'all',      label:'All',                                col:'#374151', active: fc==='all' },
      { id:'Critical', label:'Critical ('+critCounts.Critical+')', col:'#b91c1c', active: fc==='Critical' },
      { id:'High',     label:'High ('+critCounts.High+')',         col:'#c2410c', active: fc==='High' },
      { id:'Medium',   label:'Medium ('+critCounts.Medium+')',     col:'#854d0e', active: fc==='Medium' },
      { id:'Low',      label:'Low ('+critCounts.Low+')',           col:'#15803d', active: fc==='Low' },
    ].map(c => `<button onclick="appInvSetFilterCrit('${c.id}')"
      style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;cursor:pointer;border:1.5px solid ${c.active ? c.col : 'var(--border)'};background:${c.active ? '#fff' : '#fff'};color:${c.col};opacity:${c.active ? '1' : '0.6'}">
      ${c.label}
    </button>`).join('')}
  </div>
  ${filtered.length === 0 ? _ainvEmpty() : _ainvTable(filtered)}
</div>

${_ainvModalHtml()}`;
}

// ─── BCDR SUMMARY VIEW (gov3) ─────────────────────────────────────────────────

function _ainvBcdrView() {
  const all   = appInvState.rows;
  const tier1 = all.filter(r => r.bcdr_priority === 'Tier 1');
  const tier2 = all.filter(r => r.bcdr_priority === 'Tier 2');
  const tier3 = all.filter(r => r.bcdr_priority === 'Tier 3');
  const unset = all.filter(r => !r.bcdr_priority);

  return `
${renderTierBanner()}
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.85rem;flex-wrap:wrap;gap:8px">
  <div>
    <div style="display:flex;align-items:center;gap:.6rem">
      <button onclick="appInvSetView('list')" class="btn btn-outline btn-sm" style="font-size:11px;padding:3px 8px">← Applications</button>
      <div style="font-size:1.05rem;font-weight:700;color:var(--text)">📋 BCDR Recovery Summary</div>
    </div>
    <div style="font-size:12px;color:var(--muted);margin-top:4px">Business continuity classification for ${_aiEsc(currentOrg?.name || '')}</div>
  </div>
</div>

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1.25rem">
  ${[
    { label:'Tier 1 — Critical',  val:tier1.length, col:'#b91c1c' },
    { label:'Tier 2 — Important', val:tier2.length, col:'#c2410c' },
    { label:'Tier 3 — Standard',  val:tier3.length, col:'#854d0e' },
    { label:'Not Classified',     val:unset.length,  col:'var(--muted)' },
  ].map(s => `<div class="card" style="padding:1rem;text-align:center;border-top:3px solid ${s.col}">
    <div style="font-size:1.75rem;font-weight:800;color:${s.col}">${s.val}</div>
    <div style="font-size:10px;color:var(--muted);font-weight:700;margin-top:.2rem;text-transform:uppercase;letter-spacing:.04em">${s.label}</div>
  </div>`).join('')}
</div>

${tier1.length === 0
  ? `<div class="card" style="padding:2.5rem;text-align:center;color:var(--muted)">
      <div style="font-size:2rem;margin-bottom:.5rem">📋</div>
      <div style="font-weight:700;color:var(--text)">No Tier 1 applications yet</div>
      <div style="font-size:13px;margin-top:.25rem">Assign BCDR priority in the Application Inventory → BCDR tab.</div>
     </div>`
  : `<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.6rem">Tier 1 — Critical Recovery Applications</div>
     <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:.85rem">
       ${tier1.map(r => _ainvBcdrCard(r)).join('')}
     </div>`}

${tier2.length > 0 ? `
  <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin:1.25rem 0 .6rem">Tier 2 — Important Recovery Applications</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:.85rem">
    ${tier2.map(r => _ainvBcdrCard(r)).join('')}
  </div>` : ''}`;
}

function _ainvBcdrCard(r) {
  const critTag = r.criticality
    ? `<span style="font-size:9px;font-weight:700;padding:1px 7px;border-radius:8px;${_ainvCritStyle(r.criticality)}">${_aiEsc(r.criticality)}</span>`
    : '';
  return `<div class="card" style="padding:1rem">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.6rem">
      <div style="font-weight:700;color:var(--text);font-size:14px">${_aiEsc(r.app_name)}</div>
      ${critTag}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;font-size:12px;color:var(--text)">
      <div><span style="color:var(--muted);font-weight:600">RTO:</span> ${_aiEsc(r.bcdr_rto || '—')}</div>
      <div><span style="color:var(--muted);font-weight:600">RPO:</span> ${_aiEsc(r.bcdr_rpo || '—')}</div>
      ${r.bcdr_backup_method   ? `<div style="grid-column:1/-1"><span style="color:var(--muted);font-weight:600">Backup:</span> ${_aiEsc(r.bcdr_backup_method)}</div>` : ''}
      ${r.bcdr_dependencies    ? `<div style="grid-column:1/-1"><span style="color:var(--muted);font-weight:600">Dependencies:</span> ${_aiEsc(r.bcdr_dependencies)}</div>` : ''}
      ${r.bcdr_owner           ? `<div style="grid-column:1/-1"><span style="color:var(--muted);font-weight:600">BCDR Owner:</span> ${_aiEsc(r.bcdr_owner)}</div>` : ''}
    </div>
    <div style="margin-top:.6rem;text-align:right">
      <button class="btn btn-outline btn-sm" onclick="appInvOpenEdit('${r.id}');setTimeout(()=>appInvModalTab('bcdr'),50)" style="font-size:10px;padding:2px 8px">Edit BCDR</button>
    </div>
  </div>`;
}

// ─── TABLE ────────────────────────────────────────────────────────────────────

function _ainvEmpty() {
  const isFiltered = appInvState.filter !== 'all' || appInvState.filterCrit !== 'all';
  return `<div style="text-align:center;padding:3rem;color:var(--muted)">
    <div style="font-size:2rem;margin-bottom:.5rem">🖥️</div>
    <div style="font-weight:700;color:var(--text);margin-bottom:.25rem">
      ${isFiltered ? 'No applications match the current filters' : 'No applications yet'}
    </div>
    <div style="font-size:13px">
      ${isFiltered ? 'Clear the criticality or status filter to see more.' : 'Click <strong>+ Add Application</strong> to register your first business application.'}
    </div>
  </div>`;
}

const _AINV_HOSTING_STYLE = {
  'SaaS':    'background:#dbeafe;color:#1e40af',
  'Cloud':   'background:#ccfbf1;color:#0f766e',
  'On-Prem': 'background:#ede9fe;color:#6d28d9',
  'Hybrid':  'background:#fef3c7;color:#92400e',
};

const _AINV_STATUS_STYLE = {
  'Active':         'background:#dcfce7;color:#15803d',
  'Under Review':   'background:#fef3c7;color:#b45309',
  'Decommissioned': 'background:#f1f5f9;color:#64748b',
};

const _AINV_DC_STYLE = {
  'PII':          { bg:'#fee2e2', col:'#b91c1c' },
  'Payment':      { bg:'#fff7ed', col:'#c2410c' },
  'Health':       { bg:'#f0fdf4', col:'#15803d' },
  'IP':           { bg:'#ede9fe', col:'#6d28d9' },
  'Confidential': { bg:'#dbeafe', col:'#1e40af' },
};

function _ainvCritStyle(crit) {
  return ({
    'Critical': 'background:#fee2e2;color:#b91c1c',
    'High':     'background:#fff7ed;color:#c2410c',
    'Medium':   'background:#fef9c3;color:#854d0e',
    'Low':      'background:#f0fdf4;color:#15803d',
  })[crit] || 'background:#f3f4f6;color:#374151';
}

function _ainvBcdrStyle(tier) {
  return ({
    'Tier 1': 'background:#fee2e2;color:#b91c1c',
    'Tier 2': 'background:#fff7ed;color:#c2410c',
    'Tier 3': 'background:#fef9c3;color:#854d0e',
  })[tier] || 'background:#f3f4f6;color:#374151';
}

function _ainvTable(rows) {
  const th = (label, nowrap) =>
    `<th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px;text-align:left${nowrap?';white-space:nowrap':''}">${label}</th>`;

  return `<div style="overflow-x:auto">
  <table style="width:100%;border-collapse:collapse;font-size:12.5px">
    <thead>
      <tr style="border-bottom:2px solid var(--border);background:var(--bg)">
        ${th('Application')}
        ${th('Hosting',true)}
        ${th('Status',true)}
        ${th('Crit. / Risk',true)}
        ${th('BCDR',true)}
        ${th('Owner')}
        ${th('Auth',true)}
        ${th('Data Class.',true)}
        ${th('Actions')}
      </tr>
    </thead>
    <tbody>
      ${rows.map(r => _ainvRow(r)).join('')}
    </tbody>
  </table>
  </div>`;
}

function _ainvRow(r) {
  const hostSty = _AINV_HOSTING_STYLE[r.hosting_type] || 'background:#f3f4f6;color:#374151';
  const statSty = _AINV_STATUS_STYLE[r.status]        || 'background:#f3f4f6;color:#374151';
  const dc = Array.isArray(r.data_classification)
    ? r.data_classification
    : (r.data_classification ? (typeof r.data_classification === 'string' ? JSON.parse(r.data_classification) : r.data_classification) : []);

  const dataChips = dc.map(d => {
    const s = _AINV_DC_STYLE[d] || { bg:'#f3f4f6', col:'#374151' };
    return `<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;background:${s.bg};color:${s.col};white-space:nowrap">${_aiEsc(d)}</span>`;
  }).join(' ');

  const authBadges = [
    r.auth_mfa ? `<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;background:#dcfce7;color:#15803d;white-space:nowrap">MFA</span>` : '',
    r.auth_sso ? `<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;background:#dbeafe;color:#1e40af;white-space:nowrap">SSO</span>` : '',
  ].filter(Boolean).join(' ');

  const riskLevel = _ainvDeriveRisk(r.criticality, dc);
  const critCell  = r.criticality ? `
    <div style="display:flex;flex-direction:column;gap:2px">
      <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;${_ainvCritStyle(r.criticality)}">${_aiEsc(r.criticality)}</span>
      ${riskLevel ? `<span style="font-size:9px;color:var(--muted);font-weight:600;padding-left:2px">Risk: ${_aiEsc(riskLevel)}</span>` : ''}
      ${r.in_regulatory_scope ? `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:6px;background:#ede9fe;color:#6d28d9">Reg.</span>` : ''}
    </div>` : `<span style="color:var(--muted);font-size:11px">—</span>`;

  const bcdrCell = r.bcdr_priority
    ? `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;${_ainvBcdrStyle(r.bcdr_priority)}">${_aiEsc(r.bcdr_priority)}</span>`
    : `<span style="color:var(--muted);font-size:11px">—</span>`;

  const none = '<span style="color:var(--muted);font-size:11px">—</span>';

  return `<tr style="border-bottom:1px solid var(--border);vertical-align:middle">
    <td style="padding:.65rem .75rem">
      <div style="font-weight:600;color:var(--text)">${_aiEsc(r.app_name)}</div>
      ${r.description ? `<div style="font-size:11px;color:var(--muted);margin-top:2px;line-height:1.3;max-width:240px">${_aiEsc(r.description)}</div>` : ''}
      ${r.ir_in_scope ? `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:6px;background:#dbeafe;color:#1e40af;margin-top:3px;display:inline-block">IR</span>` : ''}
    </td>
    <td style="padding:.65rem .75rem">
      ${r.hosting_type ? `<span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;${hostSty}">${_aiEsc(r.hosting_type)}</span>` : none}
    </td>
    <td style="padding:.65rem .75rem">
      <span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;${statSty}">${_aiEsc(r.status)}</span>
    </td>
    <td style="padding:.65rem .75rem">${critCell}</td>
    <td style="padding:.65rem .75rem">${bcdrCell}</td>
    <td style="padding:.65rem .75rem;font-size:12px;color:var(--text)">${_aiEsc(r.business_owner || '—')}</td>
    <td style="padding:.65rem .75rem">${authBadges || none}</td>
    <td style="padding:.65rem .75rem"><div style="display:flex;gap:3px;flex-wrap:wrap">${dataChips || none}</div></td>
    <td style="padding:.65rem .75rem">
      <div style="display:flex;gap:.35rem">
        <button class="btn btn-outline btn-sm" onclick="appInvOpenEdit('${r.id}')">Edit</button>
        <button class="btn btn-red btn-sm" onclick="appInvDelete('${r.id}')">Del</button>
      </div>
    </td>
  </tr>`;
}

// ─── MODAL (4-tab) ────────────────────────────────────────────────────────────

function _ainvModalHtml() {
  const m = appInvState.modal;
  if (!m) return '';

  const isEdit  = m.type === 'edit';
  const r       = m.row || {};
  const initTab = m.tab || 'general';
  const dc = Array.isArray(r.data_classification)
    ? r.data_classification
    : (r.data_classification ? (typeof r.data_classification === 'string' ? JSON.parse(r.data_classification) : r.data_classification) : []);

  const today = new Date().toISOString().split('T')[0];

  const fld = (id, label, type, val, req) => {
    const rq = req ? ' <span style="color:#dc2626">*</span>' : '';
    if (type === 'textarea') return `<div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}${rq}</label>
      <textarea id="${id}" rows="2" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;resize:vertical;font-family:inherit;box-sizing:border-box">${_aiEsc(val)}</textarea>
    </div>`;
    return `<div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}${rq}</label>
      <input id="${id}" type="${type}" value="${_aiEsc(val)}" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;box-sizing:border-box">
    </div>`;
  };

  const sel = (id, label, opts, val) => {
    const options = ['', ...opts].map(o => `<option value="${o}"${o===val?' selected':''}>${o || '— select —'}</option>`).join('');
    return `<div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}</label>
      <select id="${id}" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;background:#fff;box-sizing:border-box">${options}</select>
    </div>`;
  };

  const dcChips = ['PII','Payment','Health','IP','Confidential'].map(d => {
    const s = _AINV_DC_STYLE[d] || { bg:'#f3f4f6', col:'#374151' };
    const checked = dc.includes(d);
    return `<label id="ainv_dclabel_${d}" onclick="appInvToggleDC('${d}')" style="cursor:pointer;display:inline-flex;align-items:center;padding:4px 11px;border-radius:99px;font-size:11px;font-weight:700;border:1.5px solid ${checked ? s.col : 'var(--border)'};background:${checked ? s.bg : '#fff'};color:${checked ? s.col : 'var(--muted)'};user-select:none">
      <input type="checkbox" id="ainv_dc_${d}" ${checked ? 'checked' : ''} style="display:none">${_aiEsc(d)}
    </label>`;
  }).join('');

  const tabs = isEdit ? ['general','risk','bcdr','ir'] : ['general'];
  const tabLabels = { general:'General', risk:'Risk & Criticality', bcdr:'BCDR', ir:'IR' };
  const tabHeader = tabs.map(t =>
    `<button id="ainv_tabbtn_${t}" class="view-tab${initTab===t?' active':''}" onclick="appInvModalTab('${t}')">${tabLabels[t]}</button>`
  ).join('');

  const show = (t) => `display:${initTab===t?'grid':'none'};gap:.75rem`;

  // ── General panel ────────────────────────────────────────────────────────
  const panelGeneral = `<div id="ainv_panel_general" style="${show('general')}">
    ${fld('ainv_app_name','App Name','text', r.app_name||'', true)}
    ${fld('ainv_description','Description','textarea', r.description||'')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
      ${fld('ainv_vendor','Vendor / Supplier','text', r.vendor||'')}
      ${fld('ainv_business_owner','Business Owner','text', r.business_owner||'')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
      ${sel('ainv_hosting_type','Hosting Type',['SaaS','Cloud','On-Prem','Hybrid'], r.hosting_type||'')}
      ${sel('ainv_status','Status',['Active','Under Review','Decommissioned'], r.status||'Active')}
    </div>
    <div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">Authentication</label>
      <div style="display:flex;gap:1.25rem">
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer"><input id="ainv_auth_mfa" type="checkbox" ${r.auth_mfa?'checked':''}> MFA Enforced</label>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer"><input id="ainv_auth_sso" type="checkbox" ${r.auth_sso?'checked':''}> SSO</label>
      </div>
    </div>
    <div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">Data Classification</label>
      <div style="display:flex;gap:.4rem;flex-wrap:wrap">${dcChips}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
      ${fld('ainv_date_added','Date Added','date', r.date_added || today)}
      ${fld('ainv_last_reviewed','Last Reviewed','date', r.last_reviewed||'')}
    </div>
    ${fld('ainv_notes','Notes','textarea', r.notes||'')}
  </div>`;

  // ── Risk & Criticality panel (gov2) ──────────────────────────────────────
  const suggestedRisk = _ainvDeriveRisk(r.criticality, dc);
  const panelRisk = isEdit ? `<div id="ainv_panel_risk" style="${show('risk')}">
    ${sel('ainv_criticality','Business Criticality',['Critical','High','Medium','Low'], r.criticality||'')}
    ${fld('ainv_criticality_rationale','Criticality Rationale','textarea', r.criticality_rationale||'')}
    ${r.criticality ? `<div style="padding:.6rem .9rem;background:var(--bg);border-radius:8px;border:1px solid var(--border)">
      <div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:4px">Derived Risk Level</div>
      <span style="font-size:12px;font-weight:700;padding:2px 10px;border-radius:99px;${_ainvCritStyle(suggestedRisk||'Low')}">${suggestedRisk || 'Unset'}</span>
      <span style="font-size:11px;color:var(--muted);margin-left:.5rem">Auto-derived from criticality × data classification</span>
    </div>` : `<div style="padding:.6rem .9rem;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:12px;color:var(--muted)">
      Set a criticality level above to see the derived risk level.
    </div>`}
    <div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">Regulatory Scope</label>
      <label style="display:flex;align-items:flex-start;gap:6px;font-size:13px;cursor:pointer">
        <input id="ainv_in_regulatory_scope" type="checkbox" ${r.in_regulatory_scope?'checked':''} style="margin-top:2px">
        <span>This application is in scope for regulatory compliance (PCI DSS, HIPAA, SOX, PIPEDA, GDPR, etc.)</span>
      </label>
    </div>
  </div>` : '';

  // ── BCDR panel (gov3) ─────────────────────────────────────────────────────
  const panelBcdr = isEdit ? `<div id="ainv_panel_bcdr" style="${show('bcdr')}">
    ${sel('ainv_bcdr_priority','Recovery Priority Tier',['Tier 1','Tier 2','Tier 3'], r.bcdr_priority||'')}
    <div style="padding:.6rem .9rem;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:12px;color:var(--muted);line-height:1.6">
      <strong style="color:var(--text)">Tier 1</strong> — Must restore within hours. Revenue-critical or safety-critical.<br>
      <strong style="color:var(--text)">Tier 2</strong> — Restore within 1–2 days. Core operations impacted if down.<br>
      <strong style="color:var(--text)">Tier 3</strong> — Restore within a week. Supporting functions only.
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
      ${fld('ainv_bcdr_rto','Recovery Time Objective (RTO)','text', r.bcdr_rto||'')}
      ${fld('ainv_bcdr_rpo','Recovery Point Objective (RPO)','text', r.bcdr_rpo||'')}
    </div>
    ${fld('ainv_bcdr_backup_method','Backup Method','text', r.bcdr_backup_method||'')}
    ${fld('ainv_bcdr_dependencies','Dependencies (other apps or vendors)','textarea', r.bcdr_dependencies||'')}
    ${fld('ainv_bcdr_owner','BCDR Owner / Contact','text', r.bcdr_owner||'')}
  </div>` : '';

  // ── IR panel (gov4) ───────────────────────────────────────────────────────
  const suggestedIr = _ainvSuggestIrTier(r.criticality, dc);
  const panelIr = isEdit ? `<div id="ainv_panel_ir" style="${show('ir')}">
    <div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">In Scope for Incident Response</label>
      <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer">
        <input id="ainv_ir_in_scope" type="checkbox" ${r.ir_in_scope?'checked':''}>
        This application is in scope for IR procedures and runbooks
      </label>
    </div>
    <div style="display:flex;align-items:flex-end;gap:.5rem">
      <div style="flex:1">${sel('ainv_ir_priority_tier','IR Priority Tier',['P1','P2','P3','P4'], r.ir_priority_tier||'')}</div>
      ${suggestedIr ? `<button type="button" class="btn btn-outline btn-sm" onclick="appInvIrAutoSuggest()" style="padding:8px 12px;white-space:nowrap">↺ Suggest ${suggestedIr}</button>` : ''}
    </div>
    ${suggestedIr ? `<div style="font-size:11px;color:var(--muted);margin-top:-4px">Based on criticality (${_aiEsc(r.criticality||'—')}) × data classification</div>` : ''}
    ${fld('ainv_ir_tech_contact','Key Technical Contact','text', r.ir_tech_contact||'')}
    ${fld('ainv_ir_vendor_contact','Vendor IR Contact','text', r.ir_vendor_contact||'')}
    ${fld('ainv_ir_escalation_path','Escalation Path','textarea', r.ir_escalation_path||'')}
    ${fld('ainv_ir_last_incident_date','Last Incident Date','date', r.ir_last_incident_date||'')}
  </div>` : '';

  return `<div class="modal-backdrop" id="appInvModal" onclick="if(event.target===this)appInvCloseModal()" style="display:flex">
    <div class="modal-box" style="max-width:600px;width:94%;max-height:90vh;overflow-y:auto">
      <div class="modal-header">
        <span>${isEdit ? 'Edit: '+_aiEsc(r.app_name||'') : 'Add Application'}</span>
        <button class="modal-close" onclick="appInvCloseModal()">✕</button>
      </div>
      ${tabs.length > 1 ? `<div class="view-tabs" style="margin:0;padding:0 1.25rem;border-bottom:1px solid var(--border)">${tabHeader}</div>` : ''}
      <div class="modal-body" style="padding-top:1rem">
        ${panelGeneral}
        ${panelRisk}
        ${panelBcdr}
        ${panelIr}
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="appInvCloseModal()">Cancel</button>
        <button class="btn btn-cyan btn-sm" id="ainvSaveBtn" onclick="${isEdit ? `appInvSubmitEdit('${r.id}')` : 'appInvSubmitAdd()'}">
          ${isEdit ? 'Save Changes' : 'Add Application'}
        </button>
      </div>
    </div>
  </div>`;
}

// ─── MODAL TAB SWITCH (DOM toggle — preserves form values) ────────────────────

function appInvModalTab(tab) {
  ['general','risk','bcdr','ir'].forEach(t => {
    const panel = document.getElementById(`ainv_panel_${t}`);
    const btn   = document.getElementById(`ainv_tabbtn_${t}`);
    if (panel) panel.style.display = t === tab ? 'grid' : 'none';
    if (btn) btn.classList.toggle('active', t === tab);
  });
  if (appInvState.modal) appInvState.modal.tab = tab;
}

// ─── IR AUTO-SUGGEST ──────────────────────────────────────────────────────────

function appInvIrAutoSuggest() {
  const crit  = document.getElementById('ainv_criticality')?.value;
  const dc    = _appInvGetDC();
  const tier  = _ainvSuggestIrTier(crit, dc);
  if (!tier) { toast('Set a criticality level first (Risk & Criticality tab)', '#b45309'); return; }
  const el = document.getElementById('ainv_ir_priority_tier');
  if (el) { el.value = tier; toast(`IR tier set to ${tier}`, '#0f766e'); }
}

// ─── MODAL CONTROLS ───────────────────────────────────────────────────────────

function appInvOpenAdd() {
  appInvState.modal = { type: 'add', tab: 'general' };
  appInvRefresh();
}

function appInvOpenEdit(id) {
  const row = appInvState.rows.find(r => r.id === id);
  if (!row) return;
  appInvState.modal = { type: 'edit', row, tab: 'general' };
  appInvRefresh();
}

function appInvCloseModal() {
  appInvState.modal = null;
  appInvRefresh();
}

function appInvSetFilter(f) {
  appInvState.filter = f;
  appInvRefresh();
}

function appInvSetFilterCrit(fc) {
  appInvState.filterCrit = fc;
  appInvRefresh();
}

function appInvSetView(v) {
  appInvState.view = v;
  appInvRefresh();
}

function appInvRefresh() {
  const el = document.getElementById('mainContent');
  if (el && activeNav === 'app_inv') el.innerHTML = renderAppInventory();
}

function appInvToggleDC(d) {
  const cb    = document.getElementById(`ainv_dc_${d}`);
  const label = document.getElementById(`ainv_dclabel_${d}`);
  if (!cb || !label) return;
  cb.checked = !cb.checked;
  const s = _AINV_DC_STYLE[d] || { bg:'#f3f4f6', col:'#374151' };
  label.style.borderColor = cb.checked ? s.col : 'var(--border)';
  label.style.background  = cb.checked ? s.bg  : '#fff';
  label.style.color       = cb.checked ? s.col : 'var(--muted)';
}

function _appInvGetDC() {
  return ['PII','Payment','Health','IP','Confidential']
    .filter(d => document.getElementById(`ainv_dc_${d}`)?.checked);
}

function _appInvVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function _appInvCheck(id) {
  return document.getElementById(id)?.checked ?? false;
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

function _ainvBuildPayload(base) {
  return Object.assign(base, {
    app_name:             _appInvVal('ainv_app_name')               || null,
    description:          _appInvVal('ainv_description')            || null,
    vendor:               _appInvVal('ainv_vendor')                 || null,
    business_owner:       _appInvVal('ainv_business_owner')         || null,
    hosting_type:         _appInvVal('ainv_hosting_type')           || null,
    status:               _appInvVal('ainv_status')                 || 'Active',
    auth_mfa:             _appInvCheck('ainv_auth_mfa'),
    auth_sso:             _appInvCheck('ainv_auth_sso'),
    data_classification:  _appInvGetDC(),
    date_added:           _appInvVal('ainv_date_added')             || null,
    last_reviewed:        _appInvVal('ainv_last_reviewed')          || null,
    notes:                _appInvVal('ainv_notes')                  || null,
    criticality:              _appInvVal('ainv_criticality')            || null,
    criticality_rationale:    _appInvVal('ainv_criticality_rationale')  || null,
    in_regulatory_scope:      _appInvCheck('ainv_in_regulatory_scope'),
    bcdr_priority:            _appInvVal('ainv_bcdr_priority')          || null,
    bcdr_rto:                 _appInvVal('ainv_bcdr_rto')               || null,
    bcdr_rpo:                 _appInvVal('ainv_bcdr_rpo')               || null,
    bcdr_backup_method:       _appInvVal('ainv_bcdr_backup_method')     || null,
    bcdr_dependencies:        _appInvVal('ainv_bcdr_dependencies')      || null,
    bcdr_owner:               _appInvVal('ainv_bcdr_owner')             || null,
    ir_in_scope:              _appInvCheck('ainv_ir_in_scope'),
    ir_priority_tier:         _appInvVal('ainv_ir_priority_tier')       || null,
    ir_tech_contact:          _appInvVal('ainv_ir_tech_contact')        || null,
    ir_vendor_contact:        _appInvVal('ainv_ir_vendor_contact')      || null,
    ir_escalation_path:       _appInvVal('ainv_ir_escalation_path')     || null,
    ir_last_incident_date:    _appInvVal('ainv_ir_last_incident_date')  || null,
  });
}

async function appInvSubmitAdd() {
  const name = _appInvVal('ainv_app_name');
  if (!name) { toast('App name is required', '#dc2626'); return; }
  const btn = document.getElementById('ainvSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  try {
    const row    = _ainvBuildPayload({ org_id: currentOrg.id });
    const result = await sb.appInventory.add(row);
    const newRow = Array.isArray(result) ? result[0] : result;
    if (newRow) appInvState.rows.push(newRow);
    appInvState.modal = null;
    toast('Application added', '#15803d');
    auditLog('app_inventory_add', { app_name: name, org_id: currentOrg.id });
    appInvRefresh();
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Add Application'; }
  }
}

async function appInvSubmitEdit(id) {
  const name = _appInvVal('ainv_app_name');
  if (!name) { toast('App name is required', '#dc2626'); return; }
  const btn = document.getElementById('ainvSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  try {
    const patch = _ainvBuildPayload({});
    await sb.appInventory.update(id, patch);
    const idx = appInvState.rows.findIndex(r => r.id === id);
    if (idx >= 0) Object.assign(appInvState.rows[idx], patch);
    appInvState.modal = null;
    toast('Saved', '#15803d');
    auditLog('app_inventory_update', { id, app_name: name, org_id: currentOrg.id });
    appInvRefresh();
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Save Changes'; }
  }
}

async function appInvDelete(id) {
  const row = appInvState.rows.find(r => r.id === id);
  if (!confirm(`Delete "${row?.app_name || 'this application'}"? This cannot be undone.`)) return;
  try {
    await sb.appInventory.delete(id);
    appInvState.rows = appInvState.rows.filter(r => r.id !== id);
    toast('Application deleted', '#15803d');
    auditLog('app_inventory_delete', { id, org_id: currentOrg.id });
    appInvRefresh();
  } catch(e) {
    toast('Delete failed: ' + e.message, '#dc2626');
  }
}

// ─── UTILITY ──────────────────────────────────────────────────────────────────

function _aiEsc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── WINDOW EXPORTS ───────────────────────────────────────────────────────────

window.loadAppInventory    = loadAppInventory;
window.renderAppInventory  = renderAppInventory;
window.appInvOpenAdd       = appInvOpenAdd;
window.appInvOpenEdit      = appInvOpenEdit;
window.appInvCloseModal    = appInvCloseModal;
window.appInvModalTab      = appInvModalTab;
window.appInvIrAutoSuggest = appInvIrAutoSuggest;
window.appInvSetFilter     = appInvSetFilter;
window.appInvSetFilterCrit = appInvSetFilterCrit;
window.appInvSetView       = appInvSetView;
window.appInvRefresh       = appInvRefresh;
window.appInvToggleDC      = appInvToggleDC;
window.appInvSubmitAdd     = appInvSubmitAdd;
window.appInvSubmitEdit    = appInvSubmitEdit;
window.appInvDelete        = appInvDelete;
