// ============================================================
// vendor_directory.js — Vendor Directory module (gov5)
// PATCH_042 schema: vendor_directory table
// ============================================================

let vendorDirState = {
  rows:    [],
  loading: false,
  loaded:  false,
  orgId:   null,
  filter:  'all',   // status filter
  modal:   null,    // { type:'add'|'edit', row? }
};

// ─── LOAD ─────────────────────────────────────────────────────────────────────

async function loadVendorDirectory(orgId) {
  vendorDirState.loading = true;
  vendorDirState.orgId   = orgId;
  try {
    const rows = await sb.vendorDir.getForOrg(orgId);
    vendorDirState.rows   = Array.isArray(rows) ? rows : [];
    vendorDirState.loaded = true;
  } catch(e) {
    vendorDirState.rows   = [];
    vendorDirState.loaded = true;
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

  const all    = vendorDirState.rows;
  const filt   = vendorDirState.filter;
  const filtered = filt === 'all' ? all : all.filter(r => r.status === filt);

  const counts = {
    all:         all.length,
    active:      all.filter(r => r.status === 'Active').length,
    inactive:    all.filter(r => r.status === 'Inactive').length,
    underReview: all.filter(r => r.status === 'Under Review').length,
  };

  // Category breakdown for stats
  const catCounts = {};
  all.forEach(r => { if (r.category) catCounts[r.category] = (catCounts[r.category] || 0) + 1; });
  const topCats = Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,3);

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
  ${topCats.map(([cat,n]) => `<span style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;${_vdCatStyle(cat)}">${_vdEsc(cat)} (${n})</span>`).join('')}
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
  const isFiltered = vendorDirState.filter !== 'all';
  return `<div style="text-align:center;padding:3rem;color:var(--muted)">
    <div style="font-size:2rem;margin-bottom:.5rem">🏢</div>
    <div style="font-weight:700;color:var(--text);margin-bottom:.25rem">
      ${isFiltered ? `No ${_vdEsc(vendorDirState.filter)} vendors` : 'No vendors yet'}
    </div>
    <div style="font-size:13px">
      ${isFiltered ? 'Switch to "All" to see other statuses.' : 'Click <strong>+ Add Vendor</strong> to register your first vendor.'}
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
  const statSty = _VD_STATUS_STYLE[r.status] || 'background:#f3f4f6;color:#374151';
  const catSty  = _vdCatStyle(r.category);
  const none    = '<span style="color:var(--muted);font-size:11px">—</span>';

  const contactCell = r.contact_name
    ? `<div style="font-size:12px;color:var(--text)">${_vdEsc(r.contact_name)}</div>
       ${r.contact_email ? `<div style="font-size:11px;color:var(--muted)">${_vdEsc(r.contact_email)}</div>` : ''}`
    : none;

  return `<tr style="border-bottom:1px solid var(--border);vertical-align:middle">
    <td style="padding:.65rem .75rem">
      <div style="font-weight:600;color:var(--text)">${_vdEsc(r.vendor_name)}</div>
      ${r.product_service ? `<div style="font-size:11px;color:var(--muted);margin-top:1px">${_vdEsc(r.product_service)}</div>` : ''}
      ${r.website ? `<div style="font-size:11px;margin-top:1px"><a href="${_vdEsc(r.website)}" target="_blank" rel="noopener" style="color:var(--cyan);text-decoration:none">${_vdEsc(r.website)}</a></div>` : ''}
    </td>
    <td style="padding:.65rem .75rem">
      ${r.category ? `<span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;${catSty}">${_vdEsc(r.category)}</span>` : none}
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

  const CATS = ['Cloud Infrastructure','SaaS','Managed Services','Professional Services','Hardware','Telecom','Other'];
  const catOptions = ['', ...CATS].map(o => `<option value="${o}"${o===r.category?' selected':''}>${o||'— select —'}</option>`).join('');
  const statOptions = ['Active','Inactive','Under Review'].map(o => `<option value="${o}"${o===r.status?' selected':''}>${o}</option>`).join('');

  return `<div class="modal-backdrop" id="vendorDirModal" onclick="if(event.target===this)vendorDirCloseModal()" style="display:flex">
    <div class="modal-box" style="max-width:560px;width:94%;max-height:90vh;overflow-y:auto">
      <div class="modal-header">
        <span>${isEdit ? 'Edit: '+_vdEsc(r.vendor_name||'') : 'Add Vendor'}</span>
        <button class="modal-close" onclick="vendorDirCloseModal()">✕</button>
      </div>
      <div class="modal-body" style="display:grid;gap:.75rem">
        ${fld('vd_vendor_name','Vendor Name','text', r.vendor_name||'', true)}
        ${fld('vd_product_service','Product / Service','text', r.product_service||'')}
        ${fld('vd_website','Website','url', r.website||'')}
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">Category</label>
          <select id="vd_category" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;background:#fff;box-sizing:border-box">${catOptions}</select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
          ${fld('vd_contact_name','Primary Contact Name','text', r.contact_name||'')}
          ${fld('vd_contact_email','Contact Email','email', r.contact_email||'')}
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">Status</label>
          <select id="vd_status" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;background:#fff;box-sizing:border-box">${statOptions}</select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
          ${fld('vd_date_added','Date Added','date', r.date_added || today)}
          ${fld('vd_last_reviewed','Last Reviewed','date', r.last_reviewed||'')}
        </div>
        ${fld('vd_notes','Notes','textarea', r.notes||'')}
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
  vendorDirState.modal = { type: 'add' };
  vendorDirRefresh();
}

function vendorDirOpenEdit(id) {
  const row = vendorDirState.rows.find(r => r.id === id);
  if (!row) return;
  vendorDirState.modal = { type: 'edit', row };
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

function vendorDirRefresh() {
  const el = document.getElementById('mainContent');
  if (el && activeNav === 'vendor_dir') el.innerHTML = renderVendorDirectory();
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

function _vdVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function _vdPayload(base) {
  return Object.assign(base, {
    vendor_name:    _vdVal('vd_vendor_name')    || null,
    product_service:_vdVal('vd_product_service')|| null,
    website:        _vdVal('vd_website')        || null,
    category:       _vdVal('vd_category')       || null,
    contact_name:   _vdVal('vd_contact_name')   || null,
    contact_email:  _vdVal('vd_contact_email')  || null,
    status:         _vdVal('vd_status')         || 'Active',
    date_added:     _vdVal('vd_date_added')     || null,
    last_reviewed:  _vdVal('vd_last_reviewed')  || null,
    notes:          _vdVal('vd_notes')          || null,
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

window.loadVendorDirectory   = loadVendorDirectory;
window.renderVendorDirectory = renderVendorDirectory;
window.vendorDirOpenAdd      = vendorDirOpenAdd;
window.vendorDirOpenEdit     = vendorDirOpenEdit;
window.vendorDirCloseModal   = vendorDirCloseModal;
window.vendorDirSetFilter    = vendorDirSetFilter;
window.vendorDirRefresh      = vendorDirRefresh;
window.vendorDirSubmitAdd    = vendorDirSubmitAdd;
window.vendorDirSubmitEdit   = vendorDirSubmitEdit;
window.vendorDirDelete       = vendorDirDelete;
