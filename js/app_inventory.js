// ============================================================
// app_inventory.js — Application Inventory module (gov1)
// PATCH_040 schema: app_inventory table
// ============================================================

let appInvState = {
  rows:    [],
  loading: false,
  loaded:  false,
  orgId:   null,
  filter:  'all',
  modal:   null,   // { type:'add'|'edit', row? }
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

// ─── RENDER ROOT ──────────────────────────────────────────────────────────────

function renderAppInventory() {
  if (appInvState.loading) {
    return `<div style="text-align:center;padding:3rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,.2);border-top-color:var(--navy);width:24px;height:24px;margin:0 auto 1rem"></div>
      <div style="font-size:13px;font-weight:700;color:var(--text)">Loading applications…</div>
    </div>`;
  }

  const all    = appInvState.rows;
  const filt   = appInvState.filter;
  const filtered = filt === 'all' ? all : all.filter(r => r.status === filt);

  const counts = {
    all:           all.length,
    active:        all.filter(r => r.status === 'Active').length,
    underReview:   all.filter(r => r.status === 'Under Review').length,
    decommissioned:all.filter(r => r.status === 'Decommissioned').length,
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
  <button class="btn btn-cyan btn-sm" onclick="appInvOpenAdd()">+ Add Application</button>
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
      { id:'all',             label:`All (${counts.all})` },
      { id:'Active',          label:`Active (${counts.active})` },
      { id:'Under Review',    label:`Under Review (${counts.underReview})` },
      { id:'Decommissioned',  label:`Decommissioned (${counts.decommissioned})` },
    ].map(t => `<button class="view-tab${filt===t.id?' active':''}" onclick="appInvSetFilter('${t.id}')">${t.label}</button>`).join('')}
  </div>
  ${filtered.length === 0 ? _appInvEmpty() : _appInvTable(filtered)}
</div>

${_appInvModalHtml()}`;
}

// ─── TABLE ────────────────────────────────────────────────────────────────────

function _appInvEmpty() {
  const isFiltered = appInvState.filter !== 'all';
  return `<div style="text-align:center;padding:3rem;color:var(--muted)">
    <div style="font-size:2rem;margin-bottom:.5rem">🖥️</div>
    <div style="font-weight:700;color:var(--text);margin-bottom:.25rem">
      ${isFiltered ? `No ${_aiEsc(appInvState.filter)} applications` : 'No applications yet'}
    </div>
    <div style="font-size:13px">
      ${isFiltered
        ? 'Switch to "All" to see other statuses.'
        : 'Click <strong>+ Add Application</strong> to register your first business application.'}
    </div>
  </div>`;
}

function _appInvTable(rows) {
  const th = (label, nowrap) =>
    `<th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px;text-align:left${nowrap?';white-space:nowrap':''}">${label}</th>`;

  return `<div style="overflow-x:auto">
  <table style="width:100%;border-collapse:collapse;font-size:12.5px">
    <thead>
      <tr style="border-bottom:2px solid var(--border);background:var(--bg)">
        ${th('Application')}
        ${th('Hosting', true)}
        ${th('Status', true)}
        ${th('Owner')}
        ${th('Vendor')}
        ${th('Auth', true)}
        ${th('Data Class.', true)}
        ${th('Last Reviewed', true)}
        ${th('Actions')}
      </tr>
    </thead>
    <tbody>
      ${rows.map(r => _appInvRow(r)).join('')}
    </tbody>
  </table>
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

function _appInvRow(r) {
  const hostSty   = _AINV_HOSTING_STYLE[r.hosting_type] || 'background:#f3f4f6;color:#374151';
  const statSty   = _AINV_STATUS_STYLE[r.status]        || 'background:#f3f4f6;color:#374151';
  const dataClass = Array.isArray(r.data_classification)
    ? r.data_classification
    : (r.data_classification ? (typeof r.data_classification === 'string' ? JSON.parse(r.data_classification) : r.data_classification) : []);

  const dataChips = dataClass.map(d => {
    const s = _AINV_DC_STYLE[d] || { bg:'#f3f4f6', col:'#374151' };
    return `<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;background:${s.bg};color:${s.col};white-space:nowrap">${_aiEsc(d)}</span>`;
  }).join(' ');

  const authBadges = [
    r.auth_mfa ? `<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;background:#dcfce7;color:#15803d;white-space:nowrap">MFA</span>` : '',
    r.auth_sso ? `<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;background:#dbeafe;color:#1e40af;white-space:nowrap">SSO</span>` : '',
  ].filter(Boolean).join(' ');

  const none = '<span style="color:var(--muted);font-size:11px">—</span>';

  return `<tr style="border-bottom:1px solid var(--border);vertical-align:middle">
    <td style="padding:.65rem .75rem">
      <div style="font-weight:600;color:var(--text)">${_aiEsc(r.app_name)}</div>
      ${r.description ? `<div style="font-size:11px;color:var(--muted);margin-top:2px;line-height:1.3;max-width:260px">${_aiEsc(r.description)}</div>` : ''}
    </td>
    <td style="padding:.65rem .75rem">
      ${r.hosting_type
        ? `<span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;${hostSty}">${_aiEsc(r.hosting_type)}</span>`
        : none}
    </td>
    <td style="padding:.65rem .75rem">
      <span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;${statSty}">${_aiEsc(r.status)}</span>
    </td>
    <td style="padding:.65rem .75rem;font-size:12px;color:var(--text)">${_aiEsc(r.business_owner || '—')}</td>
    <td style="padding:.65rem .75rem;font-size:12px;color:var(--muted)">${_aiEsc(r.vendor || '—')}</td>
    <td style="padding:.65rem .75rem">${authBadges || none}</td>
    <td style="padding:.65rem .75rem"><div style="display:flex;gap:3px;flex-wrap:wrap">${dataChips || none}</div></td>
    <td style="padding:.65rem .75rem;font-size:12px;color:var(--muted);white-space:nowrap">${r.last_reviewed || '—'}</td>
    <td style="padding:.65rem .75rem">
      <div style="display:flex;gap:.35rem">
        <button class="btn btn-outline btn-sm" onclick="appInvOpenEdit('${r.id}')">Edit</button>
        <button class="btn btn-red btn-sm" onclick="appInvDelete('${r.id}')">Del</button>
      </div>
    </td>
  </tr>`;
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

function _appInvModalHtml() {
  const m = appInvState.modal;
  if (!m) return '';

  const isEdit    = m.type === 'edit';
  const r         = m.row || {};
  const dataClass = Array.isArray(r.data_classification)
    ? r.data_classification
    : (r.data_classification ? (typeof r.data_classification === 'string' ? JSON.parse(r.data_classification) : r.data_classification) : []);

  const today = new Date().toISOString().split('T')[0];

  const field = (id, label, type, val, req) => {
    const req_ = req ? ' <span style="color:#dc2626">*</span>' : '';
    if (type === 'textarea') return `<div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}${req_}</label>
      <textarea id="${id}" rows="2" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;resize:vertical;font-family:inherit;box-sizing:border-box">${_aiEsc(val)}</textarea>
    </div>`;
    return `<div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}${req_}</label>
      <input id="${id}" type="${type}" value="${_aiEsc(val)}" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;box-sizing:border-box">
    </div>`;
  };

  const sel = (id, label, opts, val) => {
    const options = ['', ...opts].map(o =>
      `<option value="${o}"${o===val?' selected':''}>${o||'— select —'}</option>`
    ).join('');
    return `<div>
      <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}</label>
      <select id="${id}" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;background:#fff;box-sizing:border-box">${options}</select>
    </div>`;
  };

  const dcChips = ['PII','Payment','Health','IP','Confidential'].map(d => {
    const s = _AINV_DC_STYLE[d] || { bg:'#f3f4f6', col:'#374151' };
    const checked = dataClass.includes(d);
    return `<label id="ainv_dclabel_${d}" onclick="appInvToggleDC('${d}')" style="cursor:pointer;display:inline-flex;align-items:center;padding:4px 11px;border-radius:99px;font-size:11px;font-weight:700;border:1.5px solid ${checked ? s.col : 'var(--border)'};background:${checked ? s.bg : '#fff'};color:${checked ? s.col : 'var(--muted)'};user-select:none">
      <input type="checkbox" id="ainv_dc_${d}" ${checked ? 'checked' : ''} style="display:none">${_aiEsc(d)}
    </label>`;
  }).join('');

  return `<div class="modal-backdrop" id="appInvModal" onclick="if(event.target===this)appInvCloseModal()" style="display:flex">
    <div class="modal-box" style="max-width:580px;width:94%;max-height:90vh;overflow-y:auto">
      <div class="modal-header">
        <span>${isEdit ? 'Edit Application' : 'Add Application'}</span>
        <button class="modal-close" onclick="appInvCloseModal()">✕</button>
      </div>
      <div class="modal-body" style="display:grid;gap:.75rem">
        ${field('ainv_app_name','App Name','text', r.app_name||'', true)}
        ${field('ainv_description','Description','textarea', r.description||'')}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
          ${field('ainv_vendor','Vendor / Supplier','text', r.vendor||'')}
          ${field('ainv_business_owner','Business Owner','text', r.business_owner||'')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
          ${sel('ainv_hosting_type','Hosting Type',['SaaS','Cloud','On-Prem','Hybrid'], r.hosting_type||'')}
          ${sel('ainv_status','Status',['Active','Under Review','Decommissioned'], r.status||'Active')}
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">Authentication</label>
          <div style="display:flex;gap:1.25rem">
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer">
              <input id="ainv_auth_mfa" type="checkbox" ${r.auth_mfa ? 'checked' : ''}> MFA Enforced
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer">
              <input id="ainv_auth_sso" type="checkbox" ${r.auth_sso ? 'checked' : ''}> SSO
            </label>
          </div>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px">Data Classification</label>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap">${dcChips}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
          ${field('ainv_date_added','Date Added','date', r.date_added || today)}
          ${field('ainv_last_reviewed','Last Reviewed','date', r.last_reviewed||'')}
        </div>
        ${field('ainv_notes','Notes','textarea', r.notes||'')}
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

// ─── MODAL CONTROLS ───────────────────────────────────────────────────────────

function appInvOpenAdd() {
  appInvState.modal = { type: 'add' };
  appInvRefresh();
}

function appInvOpenEdit(id) {
  const row = appInvState.rows.find(r => r.id === id);
  if (!row) return;
  appInvState.modal = { type: 'edit', row };
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

// ─── CRUD ─────────────────────────────────────────────────────────────────────

async function appInvSubmitAdd() {
  const name = _appInvVal('ainv_app_name');
  if (!name) { toast('App name is required', '#dc2626'); return; }
  const btn = document.getElementById('ainvSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  try {
    const row = {
      org_id:              currentOrg.id,
      app_name:            name,
      description:         _appInvVal('ainv_description')      || null,
      vendor:              _appInvVal('ainv_vendor')            || null,
      business_owner:      _appInvVal('ainv_business_owner')   || null,
      hosting_type:        _appInvVal('ainv_hosting_type')     || null,
      status:              _appInvVal('ainv_status')           || 'Active',
      auth_mfa:            document.getElementById('ainv_auth_mfa')?.checked ?? false,
      auth_sso:            document.getElementById('ainv_auth_sso')?.checked ?? false,
      data_classification: _appInvGetDC(),
      date_added:          _appInvVal('ainv_date_added')       || null,
      last_reviewed:       _appInvVal('ainv_last_reviewed')    || null,
      notes:               _appInvVal('ainv_notes')            || null,
    };
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
    const patch = {
      app_name:            name,
      description:         _appInvVal('ainv_description')      || null,
      vendor:              _appInvVal('ainv_vendor')            || null,
      business_owner:      _appInvVal('ainv_business_owner')   || null,
      hosting_type:        _appInvVal('ainv_hosting_type')     || null,
      status:              _appInvVal('ainv_status')           || 'Active',
      auth_mfa:            document.getElementById('ainv_auth_mfa')?.checked ?? false,
      auth_sso:            document.getElementById('ainv_auth_sso')?.checked ?? false,
      data_classification: _appInvGetDC(),
      date_added:          _appInvVal('ainv_date_added')       || null,
      last_reviewed:       _appInvVal('ainv_last_reviewed')    || null,
      notes:               _appInvVal('ainv_notes')            || null,
    };
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

window.loadAppInventory   = loadAppInventory;
window.renderAppInventory = renderAppInventory;
window.appInvOpenAdd      = appInvOpenAdd;
window.appInvOpenEdit     = appInvOpenEdit;
window.appInvCloseModal   = appInvCloseModal;
window.appInvSetFilter    = appInvSetFilter;
window.appInvRefresh      = appInvRefresh;
window.appInvToggleDC     = appInvToggleDC;
window.appInvSubmitAdd    = appInvSubmitAdd;
window.appInvSubmitEdit   = appInvSubmitEdit;
window.appInvDelete       = appInvDelete;
