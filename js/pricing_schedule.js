// ============================================================
// PRICING SCHEDULE (pricing_schedule.js)
// ============================================================
// Per-org tool/SKU catalog. Grandfather (MSP) sets default rates
// for their portfolio; father orgs can add overrides per tool type.
// Resolution chain: father entry → grandfather entry → module defaults.
// ============================================================

const PS_TOOL_TYPES = [
  { value:'mfa',          label:'MFA',                 icon:'🔑', hint:'Multi-Factor Authentication — per user/yr' },
  { value:'pam',          label:'PAM',                 icon:'🔐', hint:'Privileged Access Management — per user/yr' },
  { value:'edr',          label:'EDR',                 icon:'🖥️', hint:'Endpoint Detection & Response — per device/yr' },
  { value:'email',        label:'Email Security',      icon:'📧', hint:'Anti-phishing gateway, DMARC tools — per user/yr' },
  { value:'cspm',         label:'CSPM',                icon:'☁️', hint:'Cloud Security Posture Management — fixed/yr' },
  { value:'vuln_scanner', label:'Vuln Scanner',        icon:'📡', hint:'Vulnerability scanning platform — fixed/yr' },
];

const PS_MODELS = [
  { value:'perUser',     label:'Per user / yr' },
  { value:'perEndpoint', label:'Per device / yr' },
  { value:'fixed',       label:'Fixed / yr' },
];

// Default model for each tool type (drives sensible default in Add form)
const PS_TYPE_DEFAULT_MODEL = {
  mfa:'perUser', pam:'perUser', edr:'perEndpoint',
  email:'perUser', cspm:'fixed', vuln_scanner:'fixed',
};

let psState = {
  list:[],         // own org's entries
  parentList:[],   // parent org's entries (father tier only)
  loaded:false,
  editId:null,     // null = list, string = editing row
  addOpen:false,
  form:{ name:'', vendor:'', sku:'', tool_type:'', model:'', rate_low:'', rate_high:'', notes:'' },
};

// ── LOAD ────────────────────────────────────────────────────

async function psLoad() {
  psState.loaded = false;
  psState.list = [];
  psState.parentList = [];
  try {
    const rows = await sbFetch(`pricing_schedule?org_id=eq.${currentOrg.id}&order=sort_order.asc,name.asc`, 'GET');
    psState.list = rows || [];
    if (currentOrg.tier === 'father' && currentOrg.parent_id) {
      const pRows = await sbFetch(`pricing_schedule?org_id=eq.${currentOrg.parent_id}&order=sort_order.asc,name.asc`, 'GET');
      psState.parentList = pRows || [];
    }
    psState.loaded = true;
  } catch(e) {
    psState.loaded = true;
    toast('Failed to load pricing schedule', '#dc2626');
  }
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

// ── RENDER MAIN ─────────────────────────────────────────────

function renderPricingSchedule() {
  const tier     = currentOrg?.tier;
  const isGf     = tier === 'grandfather';
  const isFather = tier === 'father';
  const parentName = allOrgs?.find(o => o.id === currentOrg?.parent_id)?.name || 'MSP';

  if (!psState.loaded) {
    return `
    ${renderTierBanner()}
    <div style="text-align:center;padding:3rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,0.2);border-top-color:var(--navy);width:24px;height:24px;margin:0 auto 1rem"></div>
      <div style="font-size:13px;font-weight:700;color:var(--text)">Loading pricing schedule…</div>
    </div>`;
  }

  const own    = psState.list;
  const parent = psState.parentList;

  // Group own entries by type for display
  const byType = {};
  PS_TOOL_TYPES.forEach(t => { byType[t.value] = { own:[], parent:[] }; });
  own.forEach(r    => { if (byType[r.tool_type]) byType[r.tool_type].own.push(r); });
  parent.forEach(r => { if (byType[r.tool_type]) byType[r.tool_type].parent.push(r); });

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">💲 Pricing Schedule</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name||'')} · ${isGf ? 'MSP — rates apply to your full portfolio' : isFather ? 'Company — inherits MSP pricing, override as needed' : 'Platform'}</div>
    </div>
    <button class="btn btn-cyan" onclick="psOpenAdd()">+ Add Tool</button>
  </div>

  ${psState.addOpen || psState.editId ? _renderPSForm() : ''}

  ${isFather && parent.length === 0 ? `
  <div class="card" style="padding:10px 14px;background:#fffbeb;border:1px solid #fde68a;margin-bottom:1rem;font-size:11px;color:#92400e">
    <strong>${escH(parentName)}</strong> has not set up a pricing schedule yet. You can enter your own rates below and they will be used in all your assessments.
  </div>` : ''}

  ${isFather && parent.length > 0 ? `
  <div class="card" style="padding:10px 14px;background:#e0f2fe;border:1px solid #bae6fd;margin-bottom:1rem;font-size:11px;color:#0369a1">
    Inheriting <strong>${parent.length} tool${parent.length!==1?'s':''}</strong> from <strong>${escH(parentName)}</strong>.
    Add your own entries below to override a specific tool type for this client.
    When both exist for the same type, your entry takes priority.
  </div>` : ''}

  ${PS_TOOL_TYPES.map(t => {
    const ownRows    = byType[t.value].own;
    const parentRows = byType[t.value].parent;
    const hasAny     = ownRows.length > 0 || parentRows.length > 0;
    if (!hasAny && !psState.addOpen) return '';
    return `
    <div class="card" style="margin-bottom:1rem;padding:0">
      <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--border)">
        <span style="font-size:18px">${t.icon}</span>
        <div>
          <div style="font-size:13px;font-weight:700">${t.label}</div>
          <div style="font-size:10px;color:var(--muted)">${t.hint}</div>
        </div>
      </div>
      ${ownRows.length === 0 && parentRows.length === 0 ? `
        <div style="padding:10px 14px;font-size:11px;color:var(--muted);font-style:italic">No entries — using platform default pricing</div>
      ` : ''}
      ${ownRows.map(r => _renderPSRow(r, 'own')).join('')}
      ${isFather ? parentRows.map(r => _renderPSRow(r, 'parent')).join('') : ''}
    </div>`;
  }).join('')}

  ${own.length === 0 && !psState.addOpen ? `
  <div class="card" style="text-align:center;padding:2.5rem;color:var(--muted)">
    <div style="font-size:2rem;margin-bottom:0.5rem">💲</div>
    <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px">No pricing entries yet</div>
    <div style="font-size:12px;margin-bottom:1.25rem">
      ${isGf
        ? 'Add your MSP tool pricing and SKUs. These rates will be used as defaults across all assessments in your portfolio.'
        : 'Add pricing entries to override the MSP defaults for this client, or to set rates when no MSP catalog exists.'}
    </div>
    <button class="btn btn-cyan" onclick="psOpenAdd()">+ Add First Tool</button>
  </div>` : ''}`;
}

function _renderPSRow(r, source) {
  const isEditing = psState.editId === r.id;
  const typeInfo  = PS_TOOL_TYPES.find(t => t.value === r.tool_type) || {};
  const modelLbl  = PS_MODELS.find(m => m.value === r.model)?.label || r.model;
  const srcBadge  = source === 'parent'
    ? `<span style="font-size:9px;font-weight:700;color:#7c3aed;padding:1px 5px;background:#faf5ff;border-radius:3px;border:1px solid #ddd6fe">MSP</span>`
    : '';

  if (isEditing) return _renderPSForm(r);

  return `
  <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #f1f5f9;${source==='parent'?'background:#fafafa;opacity:0.85':''}">
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <span style="font-size:12px;font-weight:700">${escH(r.name)}</span>
        ${srcBadge}
        ${!r.active ? `<span style="font-size:9px;font-weight:700;color:#6b7280;padding:1px 5px;background:#f3f4f6;border-radius:3px">Inactive</span>` : ''}
      </div>
      <div style="font-size:10px;color:var(--muted);margin-top:1px">
        ${r.vendor ? escH(r.vendor) + ' · ' : ''}${r.sku ? 'SKU: ' + escH(r.sku) + ' · ' : ''}${modelLbl}
        ${r.notes ? `<span style="color:#94a3b8"> · ${escH(r.notes)}</span>` : ''}
      </div>
    </div>
    <div style="text-align:right;flex-shrink:0">
      <div style="font-size:13px;font-weight:800;color:var(--navy)">$${r.rate_low}${r.rate_high && r.rate_high !== r.rate_low ? ` – $${r.rate_high}` : ''}</div>
      <div style="font-size:9px;color:var(--muted)">${modelLbl}</div>
    </div>
    ${source === 'own' ? `
    <div style="display:flex;gap:4px;flex-shrink:0">
      <button class="btn btn-outline btn-sm" onclick="psEdit('${r.id}')">Edit</button>
      <button class="btn btn-sm" style="background:#fef2f2;color:#dc2626;border:1px solid #fca5a5" onclick="psDelete('${r.id}')">Delete</button>
    </div>` : ''}
  </div>`;
}

function _renderPSForm(r) {
  const f       = r || psState.form;
  const isEdit  = !!r;
  const typeVal = isEdit ? r.tool_type  : psState.form.tool_type;
  const modVal  = isEdit ? r.model      : (psState.form.model || PS_TYPE_DEFAULT_MODEL[psState.form.tool_type] || '');

  return `
  <div class="card" style="margin-bottom:1rem;border:2px solid var(--cyan);padding:16px">
    <div style="font-size:13px;font-weight:700;margin-bottom:12px">${isEdit ? 'Edit tool' : 'Add tool'}</div>
    <div class="form-row">
      <div>
        <div class="field-lbl">Tool type *</div>
        <select id="psf_type" onchange="psFormSet('tool_type',this.value); psFormAutoModel(this.value)">
          <option value="">— Select —</option>
          ${PS_TOOL_TYPES.map(t=>`<option value="${t.value}" ${typeVal===t.value?'selected':''}>${t.icon} ${t.label}</option>`).join('')}
        </select>
      </div>
      <div>
        <div class="field-lbl">Pricing model *</div>
        <select id="psf_model" onchange="psFormSet('model',this.value)">
          <option value="">— Select —</option>
          ${PS_MODELS.map(m=>`<option value="${m.value}" ${modVal===m.value?'selected':''}>${m.label}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div>
        <div class="field-lbl">Product / tool name *</div>
        <input type="text" id="psf_name" value="${escH(isEdit?r.name:psState.form.name)}" placeholder="e.g. CrowdStrike Falcon Go" oninput="psFormSet('name',this.value)"/>
      </div>
      <div>
        <div class="field-lbl">Vendor / distributor</div>
        <input type="text" id="psf_vendor" value="${escH(isEdit?r.vendor||'':psState.form.vendor)}" placeholder="e.g. Pax8 MSP" oninput="psFormSet('vendor',this.value)"/>
      </div>
    </div>
    <div class="form-row">
      <div>
        <div class="field-lbl">SKU / part number</div>
        <input type="text" id="psf_sku" value="${escH(isEdit?r.sku||'':psState.form.sku)}" placeholder="Optional" oninput="psFormSet('sku',this.value)"/>
      </div>
      <div></div>
    </div>
    <div class="form-row">
      <div>
        <div class="field-lbl">Rate — low *</div>
        <input type="number" id="psf_low" min="0" step="0.01" value="${isEdit?r.rate_low:psState.form.rate_low}" placeholder="0.00" oninput="psFormSet('rate_low',this.value)"/>
        <div style="font-size:10px;color:var(--muted);margin-top:3px">$ per unit per year (low end of range)</div>
      </div>
      <div>
        <div class="field-lbl">Rate — high</div>
        <input type="number" id="psf_high" min="0" step="0.01" value="${isEdit?r.rate_high||'':psState.form.rate_high}" placeholder="Leave blank if single rate" oninput="psFormSet('rate_high',this.value)"/>
        <div style="font-size:10px;color:var(--muted);margin-top:3px">$ per unit per year (high end — optional)</div>
      </div>
    </div>
    <div style="margin-top:6px">
      <div class="field-lbl">Notes</div>
      <input type="text" id="psf_notes" value="${escH(isEdit?r.notes||'':psState.form.notes)}" placeholder="e.g. Includes Threat Graph. Requires annual commit." oninput="psFormSet('notes',this.value)"/>
    </div>
    <div style="display:flex;gap:8px;margin-top:14px">
      <button class="btn btn-cyan" onclick="${isEdit ? `psSaveEdit('${r.id}')` : 'psSaveAdd()'}">${isEdit ? 'Save changes' : 'Add tool'}</button>
      <button class="btn btn-outline" onclick="psCancel()">Cancel</button>
    </div>
  </div>`;
}

// ── ACTIONS ──────────────────────────────────────────────────

function psOpenAdd() {
  psState.addOpen = true;
  psState.editId  = null;
  psState.form    = { name:'', vendor:'', sku:'', tool_type:'', model:'', rate_low:'', rate_high:'', notes:'' };
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

function psEdit(id) {
  psState.editId  = id;
  psState.addOpen = false;
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

function psCancel() {
  psState.addOpen = false;
  psState.editId  = null;
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

function psFormSet(field, value) { psState.form[field] = value; }

function psFormAutoModel(toolType) {
  const defaultModel = PS_TYPE_DEFAULT_MODEL[toolType];
  if (defaultModel) {
    psState.form.model = defaultModel;
    const el = document.getElementById('psf_model');
    if (el) el.value = defaultModel;
  }
}

function _psReadForm(existingId) {
  const name     = document.getElementById('psf_name')?.value?.trim()   || '';
  const vendor   = document.getElementById('psf_vendor')?.value?.trim() || '';
  const sku      = document.getElementById('psf_sku')?.value?.trim()    || '';
  const notes    = document.getElementById('psf_notes')?.value?.trim()  || '';
  const toolType = document.getElementById('psf_type')?.value           || '';
  const model    = document.getElementById('psf_model')?.value          || '';
  const rateLow  = parseFloat(document.getElementById('psf_low')?.value);
  const rateHigh = parseFloat(document.getElementById('psf_high')?.value);
  if (!name)     { toast('Product name is required', '#dc2626'); return null; }
  if (!toolType) { toast('Tool type is required',    '#dc2626'); return null; }
  if (!model)    { toast('Pricing model is required','#dc2626'); return null; }
  if (isNaN(rateLow) || rateLow < 0) { toast('Low rate must be a number ≥ 0', '#dc2626'); return null; }
  return { org_id: currentOrg.id, name, vendor:vendor||null, sku:sku||null, notes:notes||null,
           tool_type:toolType, model, rate_low:rateLow,
           rate_high: (!isNaN(rateHigh) && rateHigh > 0) ? rateHigh : null };
}

async function psSaveAdd() {
  const payload = _psReadForm();
  if (!payload) return;
  try {
    const created = await sbFetch('pricing_schedule', 'POST', payload, { 'Prefer':'return=representation' });
    const row     = Array.isArray(created) ? created[0] : created;
    if (row) psState.list.push(row);
    psState.addOpen = false;
    toast('Tool added ✓', '#15803d');
    document.getElementById('mainContent').innerHTML = renderPricingSchedule();
  } catch(e) { toast('Save failed — ' + (e.message||'error'), '#dc2626'); }
}

async function psSaveEdit(id) {
  const payload = _psReadForm(id);
  if (!payload) return;
  try {
    await sbFetch(`pricing_schedule?id=eq.${id}`, 'PATCH', payload);
    const idx = psState.list.findIndex(r => r.id === id);
    if (idx >= 0) psState.list[idx] = { ...psState.list[idx], ...payload };
    psState.editId = null;
    toast('Changes saved ✓', '#15803d');
    document.getElementById('mainContent').innerHTML = renderPricingSchedule();
  } catch(e) { toast('Save failed — ' + (e.message||'error'), '#dc2626'); }
}

async function psDelete(id) {
  const row = psState.list.find(r => r.id === id);
  if (!row) return;
  if (!confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
  try {
    await sbFetch(`pricing_schedule?id=eq.${id}`, 'DELETE');
    psState.list = psState.list.filter(r => r.id !== id);
    toast('Tool deleted', '#6b7280');
    document.getElementById('mainContent').innerHTML = renderPricingSchedule();
  } catch(e) { toast('Delete failed', '#dc2626'); }
}

// ── PUBLIC API ───────────────────────────────────────────────
// Returns the resolved pricing for a given tool_type for the current org.
// Caller (e.g. ma_cdd.js) should call psGetForType() after psLoad() data is available.
// Resolution: own org entry (first active) → parent org entry → null (caller uses module default)

function psGetForType(toolType) {
  const own    = (psState.list    || []).find(r => r.tool_type === toolType && r.active !== false);
  const parent = (psState.parentList || []).find(r => r.tool_type === toolType && r.active !== false);
  if (own)    return { ...own,    source:'org',    sourceLabel: currentOrg?.name || 'this org' };
  if (parent) return { ...parent, source:'parent', sourceLabel: allOrgs?.find(o=>o.id===currentOrg?.parent_id)?.name || 'MSP' };
  return null;
}

// ── WINDOW EXPORTS ───────────────────────────────────────────

window.renderPricingSchedule = renderPricingSchedule;
window.psLoad                = psLoad;
window.psOpenAdd             = psOpenAdd;
window.psEdit                = psEdit;
window.psCancel              = psCancel;
window.psFormSet             = psFormSet;
window.psFormAutoModel       = psFormAutoModel;
window.psSaveAdd             = psSaveAdd;
window.psSaveEdit            = psSaveEdit;
window.psDelete              = psDelete;
window.psGetForType          = psGetForType;
