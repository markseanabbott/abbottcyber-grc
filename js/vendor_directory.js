// ============================================================
// vendor_directory.js — Vendor Directory module (gov5 + gov6)
// PATCH_042 schema: vendor_directory table (base fields)
// PATCH_048 schema: criticality, risk_tier, data_access, jurisdiction,
//                   data_residency, certifications columns
// ============================================================

const _VD_DATA_ACCESS = ['PII', 'Payment Data', 'Health Data', 'IP / Confidential', 'Infrastructure Access'];
const _VD_CERTS       = ['SOC 2 Type I', 'SOC 2 Type II', 'ISO 27001', 'ISO 42001', 'PCI DSS', 'HIPAA BAA', 'CSA STAR'];

const _VD_CRIT_STYLE = {
  Critical: 'background:#fee2e2;color:#dc2626',
  High:     'background:#ffedd5;color:#ea580c',
  Moderate: 'background:#fef3c7;color:#b45309',
  Low:      'background:#dcfce7;color:#15803d',
};

// Chip state — updated in-place without page re-render
let _vdChips = { dataAccess: [], certifications: [] };

let vendorDirState = {
  rows:       [],
  loading:    false,
  loaded:     false,
  orgId:      null,
  filter:     'all',   // status filter
  critFilter: 'all',   // criticality filter
  modal:      null,    // { type:'add'|'edit', tab:0|1, row? }
  tpraMap:    {},      // normalised vendor_name → { id, date, tier }
};

// ─── LOAD ─────────────────────────────────────────────────────────────────────

async function loadVendorDirectory(orgId) {
  vendorDirState.loading = true;
  vendorDirState.orgId   = orgId;
  try {
    const [rows, tpraRaw] = await Promise.all([
      sb.vendorDir.getForOrg(orgId),
      sbFetch(`vendor_assessments?org_id=eq.${orgId}&status=eq.complete&select=id,vendor_name,completed_at,tier&order=completed_at.desc`).catch(() => []),
    ]);
    vendorDirState.rows   = Array.isArray(rows) ? rows : [];
    vendorDirState.loaded = true;
    // Build TPRA map — most recent completed assessment per vendor name
    const map = {};
    (Array.isArray(tpraRaw) ? tpraRaw : []).forEach(t => {
      const key = (t.vendor_name || '').toLowerCase().trim();
      if (key && !map[key]) map[key] = { id: t.id, date: t.completed_at ? t.completed_at.substring(0, 10) : null, tier: t.tier };
    });
    vendorDirState.tpraMap = map;
  } catch(e) {
    vendorDirState.rows    = [];
    vendorDirState.loaded  = true;
    vendorDirState.tpraMap = {};
  }
  vendorDirState.loading = false;
}

// ─── RENDER ───────────────────────────────────────────────────────────────────

function renderVendorDirectory() {
  if (vendorDirState.loading) {
    return `<div style="text-align:center;padding:3rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,.2);border-top-color:var(--navy);width:24px;height:24px;margin:0 auto 1rem"></div>
      <div style="font-size:13px;font-weight:700;color:var(--text)">Loading vendors…</div>
    </div>`;
  }

  const all        = vendorDirState.rows;
  const filt       = vendorDirState.filter;
  const critFilt   = vendorDirState.critFilter;
  const filtered   = all
    .filter(r => filt     === 'all' || r.status      === filt)
    .filter(r => critFilt === 'all' || r.criticality === critFilt);

  const counts = {
    all:         all.length,
    active:      all.filter(r => r.status === 'Active').length,
    inactive:    all.filter(r => r.status === 'Inactive').length,
    underReview: all.filter(r => r.status === 'Under Review').length,
  };

  const critCounts = {
    Critical: all.filter(r => r.criticality === 'Critical').length,
    High:     all.filter(r => r.criticality === 'High').length,
    Moderate: all.filter(r => r.criticality === 'Moderate').length,
    Low:      all.filter(r => r.criticality === 'Low').length,
  };
  const hasCrit = Object.values(critCounts).some(v => v > 0);

  const catCounts = {};
  all.forEach(r => { if (r.category) catCounts[r.category] = (catCounts[r.category] || 0) + 1; });
  const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return `
${renderTierBanner()}
<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.85rem;flex-wrap:wrap;gap:8px">
  <div>
    <div style="display:flex;align-items:center;gap:.6rem">
      <button onclick="setNav('governance')" class="btn btn-outline btn-sm" style="font-size:11px;padding:3px 8px">← Governance</button>
      <div style="font-size:1.05rem;font-weight:700;color:var(--text)">🏢 Vendor Directory</div>
    </div>
    <div style="font-size:12px;color:var(--muted);margin-top:4px">Vendor registry for ${_vdEsc(currentOrg?.name || '')}</div>
  </div>
  <button class="btn btn-cyan btn-sm" onclick="vendorDirOpenAdd()">+ Add Vendor</button>
</div>

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1.25rem">
  ${[
    { label:'Total Vendors', val: counts.all,         col:'var(--navy)' },
    { label:'Active',        val: counts.active,      col:'#15803d' },
    { label:'Under Review',  val: counts.underReview, col:'#b45309' },
    { label:'Inactive',      val: counts.inactive,    col:'var(--muted)' },
  ].map(s => `<div class="card" style="padding:1rem;text-align:center">
    <div style="font-size:1.75rem;font-weight:800;color:${s.col}">${s.val}</div>
    <div style="font-size:11px;color:var(--muted);font-weight:600;margin-top:.2rem">${s.label}</div>
  </div>`).join('')}
</div>

${topCats.length > 0 ? `<div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.85rem;align-items:center">
  <span style="font-size:11px;font-weight:700;color:var(--muted)">Top categories:</span>
  ${topCats.map(([cat, n]) => `<span style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;${_vdCatStyle(cat)}">${_vdEsc(cat)} (${n})</span>`).join('')}
</div>` : ''}

${hasCrit ? `<div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.85rem;align-items:center">
  <span style="font-size:11px;font-weight:700;color:var(--muted)">Criticality:</span>
  <button onclick="vendorDirSetCritFilter('all')" style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;border:1.5px solid ${critFilt==='all'?'var(--navy)':'var(--border)'};background:${critFilt==='all'?'var(--navy)':'#fff'};color:${critFilt==='all'?'#fff':'var(--muted)'};cursor:pointer">All</button>
  ${['Critical','High','Moderate','Low'].map(c => critCounts[c] > 0 ? `<button onclick="vendorDirSetCritFilter('${c}')" style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;border:1.5px solid ${critFilt===c?'transparent':'var(--border)'};${critFilt===c ? _VD_CRIT_STYLE[c] : 'background:#fff;color:var(--muted)'};cursor:pointer">${c} (${critCounts[c]})</button>` : '').join('')}
</div>` : ''}

<div class="card" style="padding:0;overflow:hidden">
  <div class="view-tabs" style="border-bottom:1px solid var(--border);margin-bottom:0">
    ${[
      { id:'all',          label:`All (${counts.all})` },
      { id:'Active',       label:`Active (${counts.active})` },
      { id:'Under Review', label:`Under Review (${counts.underReview})` },
      { id:'Inactive',     label:`Inactive (${counts.inactive})` },
    ].map(t => `<button class="view-tab${filt===t.id?' active':''}" onclick="vendorDirSetFilter('${t.id}')">${t.label}</button>`).join('')}
  </div>
  ${filtered.length === 0 ? _vdEmpty() : _vdTable(filtered)}
</div>

${_vdModalHtml()}`;
}

// ─── TABLE ────────────────────────────────────────────────────────────────────

const _VD_STATUS_STYLE = {
  'Active':       'background:#dcfce7;color:#15803d',
  'Inactive':     'background:#f1f5f9;color:#64748b',
  'Under Review': 'background:#fef3c7;color:#b45309',
};

const _VD_CAT_COLORS = {
  'Cloud Infrastructure': 'background:#dbeafe;color:#1e40af',
  'SaaS':                 'background:#ccfbf1;color:#0f766e',
  'Managed Services':     'background:#ede9fe;color:#6d28d9',
  'Professional Services':'background:#fef9c3;color:#854d0e',
  'Hardware':             'background:#f1f5f9;color:#475569',
  'Telecom':              'background:#fce7f3;color:#9d174d',
  'Other':                'background:#f3f4f6;color:#374151',
};

function _vdCatStyle(cat) {
  return _VD_CAT_COLORS[cat] || 'background:#f3f4f6;color:#374151';
}

function _vdEmpty() {
  const isFiltered = vendorDirState.filter !== 'all' || vendorDirState.critFilter !== 'all';
  return `<div style="text-align:center;padding:3rem;color:var(--muted)">
    <div style="font-size:2rem;margin-bottom:.5rem">🏢</div>
    <div style="font-weight:700;color:var(--text);margin-bottom:.25rem">
      ${isFiltered ? 'No vendors match the current filters' : 'No vendors yet'}
    </div>
    <div style="font-size:13px">
      ${isFiltered ? 'Clear the criticality or status filter to see other vendors.' : 'Click <strong>+ Add Vendor</strong> to register your first vendor.'}
    </div>
  </div>`;
}

function _vdTable(rows) {
  const th = (label, nowrap) =>
    `<th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px;text-align:left${nowrap?';white-space:nowrap':''}">${label}</th>`;

  return `<div style="overflow-x:auto">
  <table style="width:100%;border-collapse:collapse;font-size:12.5px">
    <thead>
      <tr style="border-bottom:2px solid var(--border);background:var(--bg)">
        ${th('Vendor')}
        ${th('Category',true)}
        ${th('Criticality',true)}
        ${th('Status',true)}
        ${th('Primary Contact')}
        ${th('Last Reviewed',true)}
        ${th('Actions')}
      </tr>
    </thead>
    <tbody>
      ${rows.map(r => _vdRow(r)).join('')}
    </tbody>
  </table>
  </div>`;
}

function _vdRow(r) {
  const statSty  = _VD_STATUS_STYLE[r.status] || 'background:#f3f4f6;color:#374151';
  const catSty   = _vdCatStyle(r.category);
  const critSty  = r.criticality ? (_VD_CRIT_STYLE[r.criticality] || '') : '';
  const none     = '<span style="color:var(--muted);font-size:11px">—</span>';

  // TPRA match
  const tpraKey  = (r.vendor_name || '').toLowerCase().trim();
  const tpra     = vendorDirState.tpraMap[tpraKey];

  const contactCell = r.contact_name
    ? `<div style="font-size:12px;color:var(--text)">${_vdEsc(r.contact_name)}</div>
       ${r.contact_email ? `<div style="font-size:11px;color:var(--muted)">${_vdEsc(r.contact_email)}</div>` : ''}`
    : none;

  return `<tr style="border-bottom:1px solid var(--border);vertical-align:middle">
    <td style="padding:.65rem .75rem">
      <div style="font-weight:600;color:var(--text)">${_vdEsc(r.vendor_name)}</div>
      ${r.product_service ? `<div style="font-size:11px;color:var(--muted);margin-top:1px">${_vdEsc(r.product_service)}</div>` : ''}
      ${r.website ? `<div style="font-size:11px;margin-top:1px"><a href="${_vdEsc(r.website)}" target="_blank" rel="noopener" style="color:var(--cyan);text-decoration:none">${_vdEsc(r.website)}</a></div>` : ''}
      ${tpra ? `<div style="margin-top:3px"><span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:99px;background:#ede9fe;color:#6d28d9">TPRA ${tpra.date || '—'}</span></div>` : ''}
    </td>
    <td style="padding:.65rem .75rem">
      ${r.category ? `<span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;${catSty}">${_vdEsc(r.category)}</span>` : none}
    </td>
    <td style="padding:.65rem .75rem">
      ${r.criticality ? `<span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;${critSty}">${_vdEsc(r.criticality)}</span>` : none}
    </td>
    <td style="padding:.65rem .75rem">
      <span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;${statSty}">${_vdEsc(r.status)}</span>
    </td>
    <td style="padding:.65rem .75rem">${contactCell}</td>
    <td style="padding:.65rem .75rem;font-size:12px;color:var(--muted);white-space:nowrap">${r.last_reviewed || '—'}</td>
    <td style="padding:.65rem .75rem">
      <div style="display:flex;gap:.35rem">
        <button class="btn btn-outline btn-sm" onclick="vendorDirOpenEdit('${r.id}')">Edit</button>
        <button class="btn btn-red btn-sm" onclick="vendorDirDelete('${r.id}')">Del</button>
      </div>
    </td>
  </tr>`;
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

function _vdModalHtml() {
  const m = vendorDirState.modal;
  if (!m) return '';

  const isEdit = m.type === 'edit';
  const r      = m.row || {};
  const today  = new Date().toISOString().split('T')[0];
  const tab    = m.tab ?? 0;

  // TPRA lookup for this vendor
  const tpraKey  = (r.vendor_name || '').toLowerCase().trim();
  const tpra     = tpraKey ? vendorDirState.tpraMap[tpraKey] : null;

  const fld = (id, label, type, val, req) => {
    const rq = req ? ' <span style="color:#dc2626">*</span>' : '';
    if (type === 'textarea') return `<div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}${rq}</label>
      <textarea id="${id}" rows="2" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;resize:vertical;font-family:inherit;box-sizing:border-box">${_vdEsc(val)}</textarea>
    </div>`;
    return `<div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}${rq}</label>
      <input id="${id}" type="${type}" value="${_vdEsc(val)}" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;box-sizing:border-box">
    </div>`;
  };

  const sel = (id, label, opts, val) => `<div>
    <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}</label>
    <select id="${id}" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;background:#fff;box-sizing:border-box">
      ${opts.map(o => `<option value="${o.val}"${o.val===val?' selected':''}>${o.lbl}</option>`).join('')}
    </select>
  </div>`;

  const CATS = ['Cloud Infrastructure','SaaS','Managed Services','Professional Services','Hardware','Telecom','Other'];
  const catOpts   = [{ val:'', lbl:'— select —' }, ...CATS.map(c => ({ val: c, lbl: c }))];
  const statOpts  = ['Active','Inactive','Under Review'].map(o => ({ val: o, lbl: o }));
  const critOpts  = [{ val:'', lbl:'— select —' }, ...['Critical','High','Moderate','Low'].map(o => ({ val: o, lbl: o }))];
  const tierOpts  = [{ val:'', lbl:'— select —' }, ...['Critical','High','Moderate','Low'].map(o => ({ val: o, lbl: o }))];

  // Chip builder (uses _vdChips for state — no re-render on toggle)
  const chipRow = (field, opts) => opts.map(opt => {
    const key    = field + ':' + opt;
    const active = (_vdChips[field] || []).includes(opt);
    return `<button type="button" data-vd-chip="${key}"
      onclick="vendorDirToggleChip('${field}','${_vdEsc(opt)}')"
      style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;cursor:pointer;
             border:1.5px solid ${active ? 'transparent' : 'var(--border)'};
             background:${active ? 'var(--navy)' : '#fff'};
             color:${active ? '#fff' : 'var(--muted)'}">${_vdEsc(opt)}</button>`;
  }).join('');

  return `<div class="modal-backdrop" id="vendorDirModal" onclick="if(event.target===this)vendorDirCloseModal()" style="display:flex">
    <div class="modal-box" style="max-width:600px;width:94%;max-height:90vh;overflow-y:auto">
      <div class="modal-header">
        <span>${isEdit ? 'Edit: '+_vdEsc(r.vendor_name||'') : 'Add Vendor'}</span>
        <button class="modal-close" onclick="vendorDirCloseModal()">✕</button>
      </div>

      <!-- Tab nav -->
      <div class="view-tabs" style="border-bottom:1px solid var(--border);margin:0 0 1rem">
        <button class="view-tab${tab===0?' active':''}" onclick="vendorDirSetTab(0)">Basic Info</button>
        <button class="view-tab${tab===1?' active':''}" onclick="vendorDirSetTab(1)">Risk &amp; Criticality</button>
      </div>

      <!-- Tab 0: Basic Info -->
      <div id="vd-tab-0" class="modal-body" style="display:${tab===0?'grid':'none'};gap:.75rem">
        ${fld('vd_vendor_name',    'Vendor Name',         'text',     r.vendor_name     || '', true)}
        ${fld('vd_product_service','Product / Service',   'text',     r.product_service || '')}
        ${fld('vd_website',        'Website',             'url',      r.website         || '')}
        ${sel('vd_category',       'Category',            catOpts,    r.category        || '')}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
          ${fld('vd_contact_name', 'Primary Contact Name','text',     r.contact_name    || '')}
          ${fld('vd_contact_email','Contact Email',       'email',    r.contact_email   || '')}
        </div>
        ${sel('vd_status',         'Status',              statOpts,   r.status          || 'Active')}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
          ${fld('vd_date_added',   'Date Added',          'date',     r.date_added      || today)}
          ${fld('vd_last_reviewed','Last Reviewed',       'date',     r.last_reviewed   || '')}
        </div>
        ${fld('vd_notes',          'Notes',               'textarea', r.notes           || '')}
      </div>

      <!-- Tab 1: Risk & Criticality -->
      <div id="vd-tab-1" class="modal-body" style="display:${tab===1?'grid':'none'};gap:1rem">

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
          ${sel('vd_criticality', 'Business Criticality', critOpts, r.criticality || '')}
          ${sel('vd_risk_tier',   'Risk Tier',            tierOpts, r.risk_tier   || '')}
        </div>

        ${fld('vd_criticality_rationale', 'Criticality Rationale', 'textarea', r.criticality_rationale || '')}

        <div>
          <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">Data Access Types</label>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap">${chipRow('dataAccess', _VD_DATA_ACCESS)}</div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
          ${fld('vd_jurisdiction',   'Jurisdiction',   'text', r.jurisdiction   || '')}
          ${fld('vd_data_residency', 'Data Residency', 'text', r.data_residency || '')}
        </div>

        <div>
          <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">Certifications Held</label>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap">${chipRow('certifications', _VD_CERTS)}</div>
        </div>

        <!-- TPRA link (read-only) -->
        <div style="background:var(--bg);border-radius:9px;padding:.75rem 1rem">
          <div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:.35rem;text-transform:uppercase;letter-spacing:.05em">Last TPRA Assessment</div>
          ${tpra
            ? `<div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap">
                <span style="font-size:13px;font-weight:700;color:var(--text)">${tpra.date || '—'}</span>
                ${tpra.tier ? `<span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;${_VD_CRIT_STYLE[tpra.tier]||''}">${_vdEsc(tpra.tier)}</span>` : ''}
                <button class="btn btn-outline btn-sm" onclick="vendorDirCloseModal();setNav('tpra')" style="font-size:11px">View in TPRA →</button>
               </div>`
            : `<div style="font-size:12px;color:var(--muted)">No completed TPRA assessment found for this vendor.
                <button class="btn btn-outline btn-sm" onclick="vendorDirCloseModal();setNav('tpra')" style="font-size:11px;margin-left:.5rem">Go to TPRA →</button>
               </div>`}
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="vendorDirCloseModal()">Cancel</button>
        <button class="btn btn-cyan btn-sm" id="vdSaveBtn" onclick="${isEdit ? `vendorDirSubmitEdit('${r.id}')` : 'vendorDirSubmitAdd()'}">
          ${isEdit ? 'Save Changes' : 'Add Vendor'}
        </button>
      </div>
    </div>
  </div>`;
}

// ─── MODAL CONTROLS ───────────────────────────────────────────────────────────

function vendorDirOpenAdd() {
  _vdChips = { dataAccess: [], certifications: [] };
  vendorDirState.modal = { type: 'add', tab: 0 };
  vendorDirRefresh();
}

function vendorDirOpenEdit(id) {
  const row = vendorDirState.rows.find(r => r.id === id);
  if (!row) return;
  _vdChips = {
    dataAccess:    Array.isArray(row.data_access)   ? [...row.data_access]   : [],
    certifications:Array.isArray(row.certifications) ? [...row.certifications] : [],
  };
  vendorDirState.modal = { type: 'edit', tab: 0, row };
  vendorDirRefresh();
}

function vendorDirCloseModal() {
  vendorDirState.modal = null;
  vendorDirRefresh();
}

function vendorDirSetFilter(f) {
  vendorDirState.filter = f;
  vendorDirRefresh();
}

function vendorDirSetCritFilter(c) {
  vendorDirState.critFilter = c;
  vendorDirRefresh();
}

function vendorDirSetTab(n) {
  const m = vendorDirState.modal;
  if (!m) return;
  // Toggle tab panels in-place (no re-render — preserves typed field values)
  const t0 = document.getElementById('vd-tab-0');
  const t1 = document.getElementById('vd-tab-1');
  if (t0) t0.style.display = n === 0 ? 'grid' : 'none';
  if (t1) t1.style.display = n === 1 ? 'grid' : 'none';
  document.querySelectorAll('#vendorDirModal .view-tab').forEach((btn, i) => {
    btn.classList.toggle('active', i === n);
  });
  m.tab = n;
}

function vendorDirToggleChip(field, val) {
  const arr = _vdChips[field] || [];
  const idx = arr.indexOf(val);
  if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
  _vdChips[field] = arr;
  // Update button visuals only — no re-render
  const key = field + ':' + val;
  const btn = document.querySelector(`[data-vd-chip="${key}"]`);
  if (btn) {
    const on = arr.includes(val);
    btn.style.background   = on ? 'var(--navy)' : '#fff';
    btn.style.color        = on ? '#fff'        : 'var(--muted)';
    btn.style.borderColor  = on ? 'transparent' : 'var(--border)';
  }
}

function vendorDirRefresh() {
  const el = document.getElementById('mainContent');
  if (el && activeNav === 'vendor_dir') el.innerHTML = renderVendorDirectory();
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

function _vdVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function _vdSelVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function _vdPayload(base) {
  return Object.assign(base, {
    // Basic Info tab
    vendor_name:             _vdVal('vd_vendor_name')             || null,
    product_service:         _vdVal('vd_product_service')         || null,
    website:                 _vdVal('vd_website')                 || null,
    category:                _vdSelVal('vd_category')             || null,
    contact_name:            _vdVal('vd_contact_name')            || null,
    contact_email:           _vdVal('vd_contact_email')           || null,
    status:                  _vdSelVal('vd_status')               || 'Active',
    date_added:              _vdVal('vd_date_added')              || null,
    last_reviewed:           _vdVal('vd_last_reviewed')           || null,
    notes:                   _vdVal('vd_notes')                   || null,
    // Risk & Criticality tab
    criticality:             _vdSelVal('vd_criticality')          || null,
    criticality_rationale:   _vdVal('vd_criticality_rationale')   || null,
    risk_tier:               _vdSelVal('vd_risk_tier')            || null,
    data_access:             _vdChips.dataAccess,
    jurisdiction:            _vdVal('vd_jurisdiction')            || null,
    data_residency:          _vdVal('vd_data_residency')          || null,
    certifications:          _vdChips.certifications,
  });
}

async function vendorDirSubmitAdd() {
  const name = _vdVal('vd_vendor_name');
  if (!name) { toast('Vendor name is required', '#dc2626'); return; }
  const btn = document.getElementById('vdSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  try {
    const row    = _vdPayload({ org_id: currentOrg.id });
    const result = await sb.vendorDir.add(row);
    const newRow = Array.isArray(result) ? result[0] : result;
    if (newRow) vendorDirState.rows.push(newRow);
    vendorDirState.modal = null;
    toast('Vendor added', '#15803d');
    auditLog('vendor_directory_add', { vendor_name: name, org_id: currentOrg.id });
    vendorDirRefresh();
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Add Vendor'; }
  }
}

async function vendorDirSubmitEdit(id) {
  const name = _vdVal('vd_vendor_name');
  if (!name) { toast('Vendor name is required', '#dc2626'); return; }
  const btn = document.getElementById('vdSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  try {
    const patch = _vdPayload({});
    await sb.vendorDir.update(id, patch);
    const idx = vendorDirState.rows.findIndex(r => r.id === id);
    if (idx >= 0) Object.assign(vendorDirState.rows[idx], patch);
    vendorDirState.modal = null;
    toast('Saved', '#15803d');
    auditLog('vendor_directory_update', { id, vendor_name: name, org_id: currentOrg.id });
    vendorDirRefresh();
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Save Changes'; }
  }
}

async function vendorDirDelete(id) {
  const row = vendorDirState.rows.find(r => r.id === id);
  if (!confirm(`Delete "${row?.vendor_name || 'this vendor'}"? This cannot be undone.`)) return;
  try {
    await sb.vendorDir.delete(id);
    vendorDirState.rows = vendorDirState.rows.filter(r => r.id !== id);
    toast('Vendor deleted', '#15803d');
    auditLog('vendor_directory_delete', { id, org_id: currentOrg.id });
    vendorDirRefresh();
  } catch(e) {
    toast('Delete failed: ' + e.message, '#dc2626');
  }
}

// ─── UTILITY ──────────────────────────────────────────────────────────────────

function _vdEsc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── WINDOW EXPORTS ───────────────────────────────────────────────────────────

window.loadVendorDirectory     = loadVendorDirectory;
window.renderVendorDirectory   = renderVendorDirectory;
window.vendorDirOpenAdd        = vendorDirOpenAdd;
window.vendorDirOpenEdit       = vendorDirOpenEdit;
window.vendorDirCloseModal     = vendorDirCloseModal;
window.vendorDirSetFilter      = vendorDirSetFilter;
window.vendorDirSetCritFilter  = vendorDirSetCritFilter;
window.vendorDirSetTab         = vendorDirSetTab;
window.vendorDirToggleChip     = vendorDirToggleChip;
window.vendorDirRefresh        = vendorDirRefresh;
window.vendorDirSubmitAdd      = vendorDirSubmitAdd;
window.vendorDirSubmitEdit     = vendorDirSubmitEdit;
window.vendorDirDelete         = vendorDirDelete;
