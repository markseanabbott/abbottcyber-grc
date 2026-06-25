// ============================================================
// AI RISK REGISTER
// AI-specific risk tracking with NIST AI RMF and ISO 42001 control tags.
// Distinct from the main risk register; uses AI-prefixed IDs (AI-001, AI-002…).
// ============================================================

let aiRRState = {
  rows:          [],
  orgId:         null,
  loaded:        false,
  view:          'list',  // 'list' | 'form'
  editId:        null,
  filterRating:  'all',
  filterStatus:  'all',
  expandedIds:   new Set(),
  saving:        false,
  form:          {},
};

// ── CONSTANTS ─────────────────────────────────────────────────────────────────────

const AIRR_CATEGORIES = [
  'AI Output Integrity',
  'Data Exposure via AI',
  'Shadow AI',
  'Regulatory Non-Compliance',
  'Vendor AI Risk',
  'Workforce Disruption (AI)',
  'AI Model Drift',
  'Insider Threat via AI',
  'Intellectual Property Leakage',
  'AI Bias / Discrimination',
  'Autonomous Decision Risk',
  'Supply Chain AI Risk',
];

const AIRR_DATA_CLASSES = [
  'PII / Personal Data',
  'Confidential / Legal',
  'Mixed / Internal',
  'PII + Confidential',
  'Internal / Unclassified',
  'Proprietary / Confidential',
  'Trade Secret / IP',
  'Health Data (PHI)',
  'Payment Data (PCI)',
  'Public / Unclassified',
];

const AIRR_NIST_CONTROLS = [
  'GV-1.1','GV-1.2','GV-1.3','GV-1.4','GV-1.5','GV-1.6','GV-1.7',
  'GV-2.1','GV-2.2','GV-3.1','GV-3.2','GV-4.1','GV-4.2','GV-5.1','GV-5.2','GV-6.1','GV-6.2',
  'MP-1.1','MP-1.2','MP-1.3','MP-1.4','MP-1.5','MP-1.6',
  'MP-2.1','MP-2.2','MP-2.3','MP-3.1','MP-3.2','MP-3.3','MP-3.4','MP-3.5',
  'MP-4.1','MP-4.2','MP-5.1','MP-5.2','MP-6.1',
  'MS-1.1','MS-2.1','MS-2.2','MS-2.3','MS-2.4','MS-2.5','MS-2.6',
  'MS-3.1','MS-3.2','MS-3.3','MG-1.1','MG-2.1','MG-2.2','MG-2.4',
  'MG-3.1','MG-3.2','MG-4.1','MG-4.2',
];

const AIRR_ISO_CONTROLS = [
  '§4.1','§4.2','§4.3','§4.4','§5.1','§5.2','§5.3','§5.4',
  '§6.1','§6.1.1','§6.1.2','§6.2','§7.1','§7.2','§7.3','§7.4','§7.5',
  '§8.1','§8.2','§8.2.1','§8.2.2','§8.2.3','§8.2.4',
  '§8.3','§8.4','§8.5','§8.5.1','§8.6','§9.1','§9.2','§9.3','§10.1',
];

const AIRR_LEVELS = ['Low','Medium','High','Critical'];

const AIRR_RATING_COLORS = {
  Critical: { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
  High:     { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
  Medium:   { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  Low:      { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
};

const AIRR_STATUS_COLORS = {
  'Open':        { bg: '#fee2e2', color: '#991b1b' },
  'In Progress': { bg: '#fef3c7', color: '#92400e' },
  'Closed':      { bg: '#f0fdf4', color: '#166534' },
};

function airrRatingBadge(rating) {
  const c = AIRR_RATING_COLORS[rating] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
  return `<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;
    background:${c.bg};color:${c.color};border:1px solid ${c.border || c.bg}">${rating || '—'}</span>`;
}

function airrStatusBadge(status) {
  const c = AIRR_STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };
  return `<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;
    background:${c.bg};color:${c.color}">${status || '—'}</span>`;
}

function airrCalcRating(likelihood, impact) {
  const s = { Low: 1, Medium: 2, High: 3, Critical: 4 };
  const score = (s[likelihood] || 0) * (s[impact] || 0);
  if (!score) return '';
  if (score <= 2) return 'Low';
  if (score <= 5) return 'Medium';
  if (score <= 8) return 'High';
  return 'Critical';
}

function airrIdLabel(seq) {
  return `AI-${String(seq).padStart(3, '0')}`;
}

function airrSystemName(row) {
  if (row.ai_tool_catalog_id) {
    const t = typeof aitcById === 'function' ? aitcById(row.ai_tool_catalog_id) : null;
    return t ? t.name : row.ai_system_custom || '—';
  }
  return row.ai_system_custom || '—';
}

function airrVendor(row) {
  if (row.ai_tool_catalog_id) {
    const t = typeof aitcById === 'function' ? aitcById(row.ai_tool_catalog_id) : null;
    return t ? t.vendor : row.vendor || '—';
  }
  return row.vendor || '—';
}

// ── LOAD ─────────────────────────────────────────────────────────────────────────

async function loadAiRiskRegister(orgId) {
  aiRRState.orgId   = orgId;
  aiRRState.loaded  = false;
  try {
    const rows = await sb.aiRiskReg.getForOrg(orgId);
    aiRRState.rows   = rows || [];
    aiRRState.loaded = true;
  } catch (e) {
    console.warn('AI Risk Register load failed:', e.message);
    aiRRState.rows   = [];
    aiRRState.loaded = true;
  }
  // Also ensure catalog is loaded for dropdowns
  if (typeof loadAiToolCatalog === 'function' && !aiCatState?.loaded) {
    await loadAiToolCatalog();
  }
}

// ── RENDER ────────────────────────────────────────────────────────────────────────

function renderAiRiskRegister() {
  if (!currentOrg) return '';
  if (aiRRState.view === 'form') return _airrRenderForm();
  return _airrRenderList();
}

function _airrRenderList() {
  const canEdit = isAdmin() || isPlatformAdmin();

  let rows = aiRRState.rows;
  if (aiRRState.filterRating !== 'all') rows = rows.filter(r => r.rating === aiRRState.filterRating);
  if (aiRRState.filterStatus !== 'all') rows = rows.filter(r => r.status === aiRRState.filterStatus);

  const counts = { all: aiRRState.rows.length };
  AIRR_LEVELS.forEach(l => { counts[l] = aiRRState.rows.filter(r => r.rating === l).length; });
  const statusCounts = { all: aiRRState.rows.length };
  ['Open','In Progress','Closed'].forEach(s => { statusCounts[s] = aiRRState.rows.filter(r => r.status === s).length; });

  const filterTab = (key, label, count, active) =>
    `<button onclick="airrFilter('rating','${key}')" style="padding:5px 12px;border-radius:20px;border:none;cursor:pointer;font-size:11px;font-weight:700;font-family:inherit;
      background:${active ? 'var(--navy)' : 'var(--bg)'};color:${active ? '#fff' : 'var(--muted)'}">
      ${label} <span style="opacity:.7">${count}</span>
    </button>`;

  const statusTab = (key, label, count, active) =>
    `<button onclick="airrFilter('status','${key}')" style="padding:5px 12px;border-radius:20px;border:none;cursor:pointer;font-size:11px;font-weight:700;font-family:inherit;
      background:${active ? 'var(--navy)' : 'var(--bg)'};color:${active ? '#fff' : 'var(--muted)'}">
      ${label} <span style="opacity:.7">${count}</span>
    </button>`;

  const fr = aiRRState.filterRating;
  const fs = aiRRState.filterStatus;

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="display:flex;align-items:center;gap:.6rem">
        <button onclick="setNav('governance')" class="btn btn-outline btn-sm" style="font-size:11px;padding:3px 8px">← Governance</button>
        <div style="font-size:1.05rem;font-weight:700;color:var(--text)">AI Risk Register</div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">
        AI-specific risks tagged with NIST AI RMF and ISO 42001 controls
      </div>
    </div>
    <div style="display:flex;gap:.5rem;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="rrSyncFromAiPoam()" title="Pull AI Governance POAM gaps into the main Risk Register">↻ AI Gov → Risk Register</button>
      ${canEdit ? `<button class="btn btn-cyan btn-sm" onclick="airrAdd()">+ Add Risk</button>` : ''}
    </div>
  </div>

  <div style="display:flex;gap:8px;margin-bottom:.5rem;flex-wrap:wrap;align-items:center">
    <span style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Rating:</span>
    ${filterTab('all',      'All',      counts.all,      fr === 'all')}
    ${filterTab('Critical', 'Critical', counts.Critical, fr === 'Critical')}
    ${filterTab('High',     'High',     counts.High,     fr === 'High')}
    ${filterTab('Medium',   'Medium',   counts.Medium,   fr === 'Medium')}
    ${filterTab('Low',      'Low',      counts.Low,      fr === 'Low')}
  </div>
  <div style="display:flex;gap:8px;margin-bottom:1rem;flex-wrap:wrap;align-items:center">
    <span style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Status:</span>
    ${statusTab('all',         'All',         statusCounts.all,            fs === 'all')}
    ${statusTab('Open',        'Open',        statusCounts['Open'],        fs === 'Open')}
    ${statusTab('In Progress', 'In Progress', statusCounts['In Progress'], fs === 'In Progress')}
    ${statusTab('Closed',      'Closed',      statusCounts['Closed'],      fs === 'Closed')}
  </div>

  ${!aiRRState.loaded
    ? `<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">
        <div class="spinner" style="width:20px;height:20px;margin:0 auto .75rem"></div>
        <div style="font-size:13px">Loading…</div>
       </div>`
    : rows.length === 0
      ? `<div class="card" style="text-align:center;padding:2.5rem;color:var(--muted)">
          <div style="font-size:2rem;margin-bottom:.5rem">🤖</div>
          <div style="font-size:14px;font-weight:700">No AI risks found</div>
          <div style="font-size:12px;margin-top:4px">
            ${aiRRState.filterRating !== 'all' || aiRRState.filterStatus !== 'all'
              ? 'Try changing filters above.'
              : canEdit ? 'Add your first AI risk to get started.' : ''}
          </div>
         </div>`
      : _airrTable(rows, canEdit)}`;
}

function _airrTable(rows, canEdit) {
  const headerStyle = `font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;
    letter-spacing:.05em;padding:.5rem .75rem;text-align:left`;

  const rowsHtml = rows.map(r => _airrRow(r, canEdit)).join('');

  return `<div class="card" style="padding:0;overflow:hidden">
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;min-width:900px">
        <thead>
          <tr style="border-bottom:2px solid var(--border);background:var(--bg)">
            <th style="${headerStyle};width:80px">Risk ID</th>
            <th style="${headerStyle}">Category</th>
            <th style="${headerStyle}">AI System</th>
            <th style="${headerStyle}">Data Classification</th>
            <th style="${headerStyle};text-align:center">Human-in-Loop</th>
            <th style="${headerStyle};text-align:center">Likelihood</th>
            <th style="${headerStyle};text-align:center">Impact</th>
            <th style="${headerStyle};text-align:center">Rating</th>
            <th style="${headerStyle};text-align:center">Status</th>
            <th style="${headerStyle};width:30px"></th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  </div>`;
}

function _airrRow(row, canEdit) {
  const isExpanded = aiRRState.expandedIds.has(row.id);
  const td = (content, extra = '') =>
    `<td style="padding:.55rem .75rem;border-bottom:1px solid var(--border);font-size:12px;vertical-align:middle;${extra}">${content}</td>`;

  const ratingC = AIRR_RATING_COLORS[row.rating] || {};
  const systemName = airrSystemName(row);
  const vendor     = airrVendor(row);

  const levelDot = (val) => {
    const c = AIRR_RATING_COLORS[val] || {};
    return `<span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;
      background:${c.bg || '#f3f4f6'};color:${c.color || '#374151'}">${val || '—'}</span>`;
  };

  const mainRow = `<tr style="cursor:pointer" onclick="airrToggleExpand('${row.id}')">
    ${td(`<span style="font-size:11px;font-weight:700;font-family:'Courier New',monospace;
      background:var(--bg);padding:2px 6px;border-radius:4px;color:var(--navy)">${airrIdLabel(row.risk_seq)}</span>`)}
    ${td(`<span style="font-weight:600">${escH(row.category || '—')}</span>`)}
    ${td(`<div style="font-weight:600">${escH(systemName)}</div>
           <div style="font-size:10px;color:var(--muted);margin-top:1px">${escH(vendor)}</div>`)}
    ${td(`<span style="font-size:11px">${escH(row.data_classification || '—')}</span>`)}
    ${td(`<span style="font-size:13px">${row.human_in_loop ? '✅' : '❌'}</span>`, 'text-align:center')}
    ${td(levelDot(row.likelihood), 'text-align:center')}
    ${td(levelDot(row.impact),     'text-align:center')}
    ${td(airrRatingBadge(row.rating),  'text-align:center')}
    ${td(airrStatusBadge(row.status),  'text-align:center')}
    ${td(`<span style="font-size:14px;color:var(--muted)">${isExpanded ? '▲' : '▼'}</span>`, 'text-align:center')}
  </tr>`;

  const expandRow = isExpanded ? _airrExpandedRow(row, canEdit) : '';
  return mainRow + expandRow;
}

function _airrExpandedRow(row, canEdit) {
  const nistChips = (row.nist_controls || []).map(c =>
    `<span style="display:inline-block;font-size:9px;padding:2px 7px;border-radius:4px;
      background:#ede9fe;color:#5b21b6;font-weight:700;margin:2px">${escH(c)}</span>`).join('') || '<span style="color:var(--muted);font-size:11px">None assigned</span>';

  const isoChips = (row.iso_controls || []).map(c =>
    `<span style="display:inline-block;font-size:9px;padding:2px 7px;border-radius:4px;
      background:#fce7f3;color:#9d174d;font-weight:700;margin:2px">${escH(c)}</span>`).join('') || '<span style="color:var(--muted);font-size:11px">None assigned</span>';

  const sourceBadge = row.source === 'ai_assessment'
    ? `<span style="font-size:10px;background:#e0e7ff;color:#3730a3;padding:2px 7px;border-radius:10px;font-weight:700">From AI Assessment</span>`
    : `<span style="font-size:10px;background:var(--bg);color:var(--muted);padding:2px 7px;border-radius:10px;font-weight:700">Manual</span>`;

  return `<tr>
    <td colspan="10" style="padding:0;border-bottom:2px solid var(--border)">
      <div style="background:var(--bg);padding:1rem 1.25rem;border-top:1px solid var(--border)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:.75rem">
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.35rem">NIST AI RMF Controls</div>
            <div>${nistChips}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.35rem">ISO 42001 Clauses</div>
            <div>${isoChips}</div>
          </div>
        </div>
        ${row.notes ? `<div style="margin-bottom:.75rem">
          <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.35rem">Notes</div>
          <div style="font-size:12px;color:var(--text);line-height:1.5">${escH(row.notes)}</div>
        </div>` : ''}
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem">
          <div style="display:flex;gap:.5rem;align-items:center">
            ${sourceBadge}
            ${row.created_by ? `<span style="font-size:10px;color:var(--muted)">Added by ${escH(row.created_by)}</span>` : ''}
          </div>
          ${canEdit ? `<div style="display:flex;gap:6px">
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();airrEdit('${row.id}')">Edit</button>
            <button class="btn btn-red btn-sm"     onclick="event.stopPropagation();airrDelete('${row.id}')">Delete</button>
          </div>` : ''}
        </div>
      </div>
    </td>
  </tr>`;
}

// ── ADD / EDIT FORM ───────────────────────────────────────────────────────────────

function _airrRenderForm() {
  const f       = aiRRState.form;
  const isEdit  = !!aiRRState.editId;
  const title   = isEdit ? `Edit ${airrIdLabel(f.risk_seq || 0)}` : 'Add AI Risk';

  // Build AI system dropdown from catalog + custom option
  const catalogEntries = typeof aitcForDropdown === 'function' ? aitcForDropdown() : [];
  let ddOptions = `<option value="">— Select from catalog —</option>`;
  catalogEntries.forEach(entry => {
    if (entry.isGroup) {
      ddOptions += `<optgroup label="${escH(entry.label)}">`;
    } else {
      const indent = entry.indent ? '   ↳ ' : '';
      const sel = f.ai_tool_catalog_id === entry.tool.id ? 'selected' : '';
      ddOptions += `<option value="${entry.tool.id}" ${sel}>${indent}${escH(entry.tool.name)}</option>`;
    }
  });
  ddOptions += `<option value="__custom__" ${f.ai_tool_catalog_id === '__custom__' ? 'selected' : ''}>+ Custom / not in catalog</option>`;

  const showCustom = !f.ai_tool_catalog_id || f.ai_tool_catalog_id === '__custom__';

  const catOptions = AIRR_CATEGORIES.map(c =>
    `<option ${f.category === c ? 'selected' : ''}>${escH(c)}</option>`).join('');

  const dataOptions = AIRR_DATA_CLASSES.map(c =>
    `<option ${f.data_classification === c ? 'selected' : ''}>${escH(c)}</option>`).join('');

  const lvlOptions = (field) => AIRR_LEVELS.map(l =>
    `<option ${f[field] === l ? 'selected' : ''}>${l}</option>`).join('');

  const statusOptions = ['Open','In Progress','Closed'].map(s =>
    `<option ${f.status === s ? 'selected' : ''}>${s}</option>`).join('');

  // Multi-select chips for NIST + ISO controls
  const selectedNist = new Set(f.nist_controls || []);
  const selectedIso  = new Set(f.iso_controls  || []);

  const controlChips = (controls, selectedSet, prefix) =>
    controls.map(c => {
      const on = selectedSet.has(c);
      return `<button type="button" onclick="airrToggleControl('${prefix}','${c}')"
        style="padding:2px 8px;border-radius:4px;border:none;cursor:pointer;font-size:10px;font-weight:700;
          margin:2px;font-family:inherit;
          background:${on ? (prefix === 'nist' ? '#ede9fe' : '#fce7f3') : '#f3f4f6'};
          color:${on ? (prefix === 'nist' ? '#5b21b6' : '#9d174d') : '#6b7280'}">
        ${c}
      </button>`;
    }).join('');

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.85rem">
    <button onclick="airrCancelForm()" class="btn btn-outline btn-sm" style="font-size:11px;padding:3px 8px">← Back</button>
    <div style="font-size:1.05rem;font-weight:700;color:var(--text)">${title}</div>
  </div>

  <div class="card">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div>
        <label class="form-label">Category <span style="color:#dc2626">*</span></label>
        <select id="airr-category" class="form-input">
          <option value="">— Select —</option>
          ${catOptions}
        </select>
      </div>
      <div>
        <label class="form-label">AI System</label>
        <select id="airr-catalog-id" class="form-input" onchange="airrCatalogChange()">
          ${ddOptions}
        </select>
      </div>
      <div id="airr-custom-fields" style="${showCustom ? '' : 'display:none'}">
        <label class="form-label">Custom Tool Name</label>
        <input id="airr-custom-name" class="form-input" value="${escH(f.ai_system_custom || '')}" placeholder="e.g. WorkflowAI Pro">
      </div>
      <div id="airr-custom-vendor" style="${showCustom ? '' : 'display:none'}">
        <label class="form-label">Vendor (custom)</label>
        <input id="airr-custom-vendor-input" class="form-input" value="${escH(f.vendor || '')}" placeholder="e.g. Acme Corp">
      </div>
      <div>
        <label class="form-label">Data Classification</label>
        <select id="airr-data-class" class="form-input">
          <option value="">— Select —</option>
          ${dataOptions}
        </select>
      </div>
      <div style="display:flex;align-items:flex-end;padding-bottom:.25rem">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;font-weight:600">
          <input type="checkbox" id="airr-hil" ${f.human_in_loop ? 'checked' : ''} style="width:16px;height:16px">
          Human in the Loop
        </label>
      </div>
      <div>
        <label class="form-label">Likelihood <span style="color:#dc2626">*</span></label>
        <select id="airr-likelihood" class="form-input" onchange="airrAutoRating()">
          <option value="">— Select —</option>
          ${lvlOptions('likelihood')}
        </select>
      </div>
      <div>
        <label class="form-label">Impact <span style="color:#dc2626">*</span></label>
        <select id="airr-impact" class="form-input" onchange="airrAutoRating()">
          <option value="">— Select —</option>
          ${lvlOptions('impact')}
        </select>
      </div>
      <div>
        <label class="form-label">Risk Rating <span style="font-size:10px;color:var(--muted)">(auto-calculated, overridable)</span></label>
        <select id="airr-rating" class="form-input">
          <option value="">— —</option>
          ${lvlOptions('rating')}
        </select>
      </div>
      <div>
        <label class="form-label">Status</label>
        <select id="airr-status" class="form-input">
          ${statusOptions}
        </select>
      </div>
      <div style="grid-column:1/-1">
        <label class="form-label">Notes</label>
        <textarea id="airr-notes" class="form-input" rows="3" style="resize:vertical"
          placeholder="Describe the risk scenario, context, or mitigation plan…">${escH(f.notes || '')}</textarea>
      </div>
    </div>

    <div style="margin-top:1.25rem">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;
        letter-spacing:.05em;margin-bottom:.5rem">NIST AI RMF Controls</div>
      <div id="airr-nist-chips" style="line-height:2">${controlChips(AIRR_NIST_CONTROLS, selectedNist, 'nist')}</div>
    </div>

    <div style="margin-top:1rem">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;
        letter-spacing:.05em;margin-bottom:.5rem">ISO 42001 Clauses</div>
      <div id="airr-iso-chips" style="line-height:2">${controlChips(AIRR_ISO_CONTROLS, selectedIso, 'iso')}</div>
    </div>

    <div id="airr-form-err" style="color:#b91c1c;font-size:12px;margin-top:.75rem;display:none"></div>

    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:1.25rem;border-top:1px solid var(--border);padding-top:1rem">
      <button class="btn btn-outline" onclick="airrCancelForm()">Cancel</button>
      <button class="btn btn-cyan" onclick="airrSave()">${isEdit ? 'Save Changes' : 'Add Risk'}</button>
    </div>
  </div>`;
}

// ── FORM INTERACTIONS ─────────────────────────────────────────────────────────────

function airrCatalogChange() {
  const val = document.getElementById('airr-catalog-id')?.value;
  const showCustom = !val || val === '__custom__';
  const cf = document.getElementById('airr-custom-fields');
  const cv = document.getElementById('airr-custom-vendor');
  if (cf) cf.style.display = showCustom ? '' : 'none';
  if (cv) cv.style.display = showCustom ? '' : 'none';
}

function airrAutoRating() {
  const l = document.getElementById('airr-likelihood')?.value;
  const i = document.getElementById('airr-impact')?.value;
  const r = airrCalcRating(l, i);
  const el = document.getElementById('airr-rating');
  if (el && r) el.value = r;
}

function airrToggleControl(prefix, control) {
  const key  = prefix === 'nist' ? 'nist_controls' : 'iso_controls';
  const set  = new Set(aiRRState.form[key] || []);
  if (set.has(control)) set.delete(control);
  else set.add(control);
  aiRRState.form[key] = [...set];

  // Re-render just the chip panel
  const chipsId = prefix === 'nist' ? 'airr-nist-chips' : 'airr-iso-chips';
  const controls = prefix === 'nist' ? AIRR_NIST_CONTROLS : AIRR_ISO_CONTROLS;
  const el = document.getElementById(chipsId);
  if (!el) return;
  el.innerHTML = controls.map(c => {
    const on = set.has(c);
    return `<button type="button" onclick="airrToggleControl('${prefix}','${c}')"
      style="padding:2px 8px;border-radius:4px;border:none;cursor:pointer;font-size:10px;font-weight:700;
        margin:2px;font-family:inherit;
        background:${on ? (prefix === 'nist' ? '#ede9fe' : '#fce7f3') : '#f3f4f6'};
        color:${on ? (prefix === 'nist' ? '#5b21b6' : '#9d174d') : '#6b7280'}">
      ${c}
    </button>`;
  }).join('');
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────────

function airrFilter(type, val) {
  if (type === 'rating') aiRRState.filterRating = val;
  else                   aiRRState.filterStatus = val;
  airrRefresh();
}

function airrToggleExpand(id) {
  if (aiRRState.expandedIds.has(id)) aiRRState.expandedIds.delete(id);
  else aiRRState.expandedIds.add(id);
  airrRefresh();
}

function airrAdd() {
  aiRRState.view    = 'form';
  aiRRState.editId  = null;
  aiRRState.form    = { status: 'Open', human_in_loop: false };
  airrRefresh();
}

function airrEdit(id) {
  const row = aiRRState.rows.find(r => r.id === id);
  if (!row) return;
  aiRRState.view   = 'form';
  aiRRState.editId = id;
  aiRRState.form   = { ...row,
    ai_tool_catalog_id: row.ai_tool_catalog_id || '__custom__',
  };
  airrRefresh();
}

function airrCancelForm() {
  aiRRState.view   = 'list';
  aiRRState.editId = null;
  aiRRState.form   = {};
  airrRefresh();
}

async function airrSave() {
  if (aiRRState.saving) return;

  const g = id => document.getElementById(id);
  const category    = g('airr-category')?.value;
  const likelihood  = g('airr-likelihood')?.value;
  const impact      = g('airr-impact')?.value;
  const rating      = g('airr-rating')?.value;
  const status      = g('airr-status')?.value    || 'Open';
  const dataClass   = g('airr-data-class')?.value || null;
  const hil         = !!g('airr-hil')?.checked;
  const notes       = g('airr-notes')?.value.trim()     || null;
  const catalogId   = g('airr-catalog-id')?.value || null;
  const customName  = g('airr-custom-name')?.value.trim() || null;
  const customVend  = g('airr-custom-vendor-input')?.value.trim() || null;

  if (!category) {
    const err = g('airr-form-err');
    if (err) { err.textContent = 'Category is required.'; err.style.display = 'block'; }
    return;
  }
  if (!likelihood || !impact) {
    const err = g('airr-form-err');
    if (err) { err.textContent = 'Likelihood and Impact are required.'; err.style.display = 'block'; }
    return;
  }

  const isEdit = !!aiRRState.editId;
  aiRRState.saving = true;

  try {
    const row = {
      org_id:              currentOrg.id,
      category,
      ai_tool_catalog_id:  (catalogId && catalogId !== '__custom__') ? catalogId : null,
      ai_system_custom:    (!catalogId || catalogId === '__custom__') ? customName : null,
      vendor:              (!catalogId || catalogId === '__custom__') ? customVend : null,
      data_classification: dataClass,
      human_in_loop:       hil,
      likelihood,
      impact,
      rating:              rating || airrCalcRating(likelihood, impact),
      status,
      nist_controls:       aiRRState.form.nist_controls || [],
      iso_controls:        aiRRState.form.iso_controls  || [],
      notes,
      source:              'manual',
      created_by:          authState.profile?.name || authState.profile?.email || null,
    };

    if (isEdit) {
      const result = await sb.aiRiskReg.update(aiRRState.editId, row);
      const updated = Array.isArray(result) ? result[0] : result;
      const idx = aiRRState.rows.findIndex(r => r.id === aiRRState.editId);
      if (idx >= 0 && updated) aiRRState.rows[idx] = updated;
    } else {
      row.risk_seq = (await sb.aiRiskReg.maxSeq(currentOrg.id)) + 1;
      const result = await sb.aiRiskReg.add(row);
      const added  = Array.isArray(result) ? result[0] : result;
      if (added) aiRRState.rows.push(added);
    }

    aiRRState.view   = 'list';
    aiRRState.editId = null;
    aiRRState.form   = {};
    toast(isEdit ? 'Risk updated.' : 'AI risk added.');
    airrRefresh();
  } catch (e) {
    const err = g('airr-form-err');
    if (err) { err.textContent = e.message; err.style.display = 'block'; }
  } finally {
    aiRRState.saving = false;
  }
}

async function airrDelete(id) {
  const row = aiRRState.rows.find(r => r.id === id);
  if (!row) return;
  if (!confirm(`Delete ${airrIdLabel(row.risk_seq)}? This cannot be undone.`)) return;
  try {
    await sb.aiRiskReg.delete(id);
    aiRRState.rows = aiRRState.rows.filter(r => r.id !== id);
    aiRRState.expandedIds.delete(id);
    toast('Risk deleted.');
    airrRefresh();
  } catch (e) {
    toast('Delete failed: ' + e.message, '#dc2626');
  }
}

// ── REFRESH HELPER ────────────────────────────────────────────────────────────────

function airrRefresh() {
  const el = document.getElementById('mainContent');
  if (el && activeNav === 'ai_risk_register') el.innerHTML = renderAiRiskRegister();
}

// ── EXPOSE GLOBALS ────────────────────────────────────────────────────────────────

window.renderAiRiskRegister = renderAiRiskRegister;
window.loadAiRiskRegister   = loadAiRiskRegister;
window.airrFilter           = airrFilter;
window.airrToggleExpand     = airrToggleExpand;
window.airrAdd              = airrAdd;
window.airrEdit             = airrEdit;
window.airrCancelForm       = airrCancelForm;
window.airrSave             = airrSave;
window.airrDelete           = airrDelete;
window.airrCatalogChange    = airrCatalogChange;
window.airrAutoRating       = airrAutoRating;
window.airrToggleControl    = airrToggleControl;
