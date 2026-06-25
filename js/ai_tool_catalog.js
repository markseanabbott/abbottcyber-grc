// ============================================================
// AI TOOL CATALOG
// Browse and manage the seeded AI tool reference catalog.
// Platform admins can add / edit / delete entries.
// All users can browse — used as a reference and for risk register dropdowns.
// ============================================================

let aiCatState = {
  tools:      [],   // all ai_tool_catalog rows
  components: [],   // all ai_tool_components rows { parent_id, child_id }
  loaded:     false,
  adminMode:  false,
  editId:     null, // tool id being edited in modal
  saving:     false,
};

// ── APPROVAL STATUS DISPLAY ──────────────────────────────────────────────────────

const AITC_STATUS_LABELS = {
  approved:          'Approved',
  approved_enterprise: 'Approved — Enterprise Only',
  approved_self_hosted: 'Approved — Self-Hosted Only',
  conditional:       'Conditional',
  not_approved:      'Not Approved',
  under_review:      'Under Review',
};

const AITC_STATUS_COLORS = {
  approved:              { bg: '#dcfce7', color: '#166534' },
  approved_enterprise:   { bg: '#d1fae5', color: '#065f46' },
  approved_self_hosted:  { bg: '#d1fae5', color: '#065f46' },
  conditional:           { bg: '#fef3c7', color: '#92400e' },
  not_approved:          { bg: '#fee2e2', color: '#991b1b' },
  under_review:          { bg: '#e0e7ff', color: '#3730a3' },
};

function aitcStatusBadge(status) {
  const lbl  = AITC_STATUS_LABELS[status]  || status || '—';
  const clrs = AITC_STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };
  return `<span style="display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;
    background:${clrs.bg};color:${clrs.color};white-space:nowrap">${lbl}</span>`;
}

function aitcBoolChip(val, label) {
  const on = !!val;
  return `<span title="${label}" style="display:inline-flex;align-items:center;justify-content:center;
    width:22px;height:22px;border-radius:50%;font-size:11px;font-weight:700;flex-shrink:0;
    background:${on ? '#dcfce7' : '#f3f4f6'};color:${on ? '#166534' : '#9ca3af'}">
    ${on ? '✓' : '—'}</span>`;
}

// ── LOAD ─────────────────────────────────────────────────────────────────────────

async function loadAiToolCatalog() {
  if (aiCatState.loaded) return;
  try {
    const [tools, comps] = await Promise.all([
      sb.aiCatalog.getAll(),
      sb.aiCatalog.getComponents(),
    ]);
    aiCatState.tools      = tools || [];
    aiCatState.components = comps || [];
    aiCatState.loaded     = true;
  } catch (e) {
    console.warn('AI Catalog load failed:', e.message);
  }
}

// Returns child tool IDs for a given parent ID
function aitcChildIds(parentId) {
  return aiCatState.components
    .filter(c => c.parent_id === parentId)
    .map(c => c.child_id);
}

// Returns tool object by id
function aitcById(id) {
  return aiCatState.tools.find(t => t.id === id);
}

// Builds grouped structure: top-level (non-component) tools → their children
function aitcGrouped() {
  const parents = aiCatState.tools.filter(t => !t.is_component);
  return parents.map(p => ({
    tool:     p,
    children: aitcChildIds(p.id).map(cid => aitcById(cid)).filter(Boolean),
  }));
}

// Returns flat list of all tools suitable for a dropdown (grouped by vendor)
function aitcForDropdown() {
  const vendors = [...new Set(aiCatState.tools.map(t => t.vendor))].filter(Boolean).sort();
  const result = [];
  vendors.forEach(v => {
    const vTools = aiCatState.tools
      .filter(t => t.vendor === v)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    result.push({ isGroup: true, label: v });
    vTools.forEach(t => {
      result.push({ isGroup: false, tool: t, indent: t.is_component });
    });
  });
  return result;
}

// ── RENDER MAIN ──────────────────────────────────────────────────────────────────

function renderAiToolCatalog() {
  if (!currentOrg) return '';
  const isAdmin = isPlatformAdmin();

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:1.05rem;font-weight:700;color:var(--text)">AI Application Inventory</div>
      <div style="font-size:12px;color:var(--muted);margin-top:2px">Reference catalog of AI tools with compliance posture and approval status</div>
    </div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      ${isAdmin ? `<button class="btn btn-outline btn-sm" onclick="aitcToggleAdmin()"
        style="${aiCatState.adminMode ? 'background:var(--navy);color:#fff;border-color:var(--navy)' : ''}">
        ${aiCatState.adminMode ? '✓ Admin Mode' : '⚙️ Admin Mode'}</button>` : ''}
      ${isAdmin && aiCatState.adminMode
        ? `<button class="btn btn-cyan btn-sm" onclick="aitcOpenAdd()">+ Add Tool</button>`
        : ''}
    </div>
  </div>

  ${aiCatState.adminMode && isAdmin ? _aitcAdminNote() : ''}
  ${_aitcLegend()}
  ${_aitcTable()}`;
}

function _aitcAdminNote() {
  return `<div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;
    padding:.6rem .9rem;font-size:11px;color:#92400e;margin-bottom:.85rem">
    <strong>Admin mode active</strong> — you can edit seeded data and add new tools. Changes affect all users.
  </div>`;
}

function _aitcLegend() {
  const cols = [
    { label: 'DLP', desc: 'Data Loss Prevention controls' },
    { label: 'SSO', desc: 'Single Sign-On / enterprise authentication' },
    { label: 'Logs', desc: 'Audit logging / prompt & response logging' },
    { label: 'DPA', desc: 'Data Processing Agreement available' },
    { label: 'SOC 2', desc: 'SOC 2 Type II certified' },
  ];
  return `<div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.75rem;flex-wrap:wrap">
    <span style="font-size:10px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em">Compliance columns:</span>
    ${cols.map(c => `<span title="${c.desc}" style="display:inline-flex;align-items:center;gap:4px;font-size:10px;
      color:var(--muted);background:var(--bg);padding:2px 8px;border-radius:20px;border:1px solid var(--border);cursor:default">
      <span style="color:#166534;font-weight:700">✓</span> ${c.label}</span>`).join('')}
  </div>`;
}

function _aitcTable() {
  const grouped = aitcGrouped();
  if (!grouped.length) {
    return `<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">
      <div style="font-size:1.5rem;margin-bottom:.5rem">🤖</div>
      <div style="font-size:13px;font-weight:600">Catalog not loaded</div>
      <div style="font-size:11px;margin-top:4px">Run SUPABASE_PATCH_035.sql to seed the tool catalog.</div>
    </div>`;
  }

  const headerStyle = `font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;
    letter-spacing:.05em;padding:.5rem .75rem;text-align:center`;

  const rows = grouped.map(({ tool: p, children }) => {
    const parentRow = _aitcRow(p, false);
    const childRows = children.map(c => _aitcRow(c, true)).join('');
    return parentRow + childRows;
  }).join('');

  return `<div class="card" style="padding:0;overflow:hidden">
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;min-width:900px">
        <thead>
          <tr style="border-bottom:2px solid var(--border);background:var(--bg)">
            <th style="${headerStyle};text-align:left;padding-left:1rem">Tool / Version</th>
            <th style="${headerStyle};text-align:left">Vendor</th>
            <th style="${headerStyle};text-align:left">Category</th>
            <th style="${headerStyle};text-align:left">Data In Scope</th>
            <th style="${headerStyle}" title="Data Loss Prevention">DLP</th>
            <th style="${headerStyle}" title="Single Sign-On">SSO</th>
            <th style="${headerStyle}" title="Audit Logging">Logs</th>
            <th style="${headerStyle}" title="Data Processing Agreement">DPA</th>
            <th style="${headerStyle}" title="SOC 2 Type II">SOC 2</th>
            <th style="${headerStyle};text-align:left">EU AI Act</th>
            <th style="${headerStyle};text-align:left">NIST AI RMF</th>
            <th style="${headerStyle};text-align:left">ISO 42001</th>
            <th style="${headerStyle};text-align:left">Status</th>
            ${aiCatState.adminMode && isPlatformAdmin() ? `<th style="${headerStyle}"></th>` : ''}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}

function _aitcRow(tool, isChild) {
  const td = (content, extra = '') =>
    `<td style="padding:.55rem .75rem;border-bottom:1px solid var(--border);font-size:12px;vertical-align:middle;${extra}">${content}</td>`;

  const nameCell = isChild
    ? `<div style="display:flex;align-items:center;gap:6px;padding-left:1.25rem">
        <span style="color:var(--muted);font-size:11px">↳</span>
        <span style="font-weight:600;color:var(--text)">${escH(tool.name)}</span>
        <span style="font-size:9px;background:#e0e7ff;color:#3730a3;padding:1px 6px;border-radius:10px;font-weight:700">component</span>
       </div>`
    : `<span style="font-weight:700;color:var(--text)">${escH(tool.name)}</span>`;

  const nistChips = (tool.nist_controls || []).slice(0, 4).map(c =>
    `<span style="display:inline-block;font-size:9px;padding:1px 5px;border-radius:4px;
      background:#ede9fe;color:#5b21b6;font-weight:600;margin:1px">${escH(c)}</span>`).join('') +
    (tool.nist_controls?.length > 4 ? `<span style="font-size:9px;color:var(--muted)">+${tool.nist_controls.length - 4}</span>` : '');

  const isoChips = (tool.iso42001 || []).slice(0, 3).map(c =>
    `<span style="display:inline-block;font-size:9px;padding:1px 5px;border-radius:4px;
      background:#fce7f3;color:#9d174d;font-weight:600;margin:1px">${escH(c)}</span>`).join('') +
    (tool.iso42001?.length > 3 ? `<span style="font-size:9px;color:var(--muted)">+${tool.iso42001.length - 3}</span>` : '');

  const scopeText = (tool.data_in_scope || []).join(', ') || '—';
  const rowBg = isChild ? 'background:#fafbff;' : '';

  return `<tr style="${rowBg}">
    ${td(nameCell, 'padding-left:1rem')}
    ${td(`<span style="font-size:11px;color:var(--muted)">${escH(tool.vendor || '—')}</span>`)}
    ${td(`<span style="font-size:11px;color:var(--muted)">${escH(tool.category || '—')}</span>`)}
    ${td(`<span style="font-size:11px;color:var(--text)">${escH(scopeText)}</span>`, 'max-width:160px')}
    ${td(aitcBoolChip(tool.has_dlp,  'Data Loss Prevention'), 'text-align:center')}
    ${td(aitcBoolChip(tool.has_sso,  'Single Sign-On'),       'text-align:center')}
    ${td(aitcBoolChip(tool.has_logs, 'Audit Logging'),        'text-align:center')}
    ${td(aitcBoolChip(tool.has_dpa,  'Data Processing Agreement'), 'text-align:center')}
    ${td(aitcBoolChip(tool.has_soc2, 'SOC 2 Type II'),        'text-align:center')}
    ${td(`<span style="font-size:10px;color:var(--muted)">${escH(tool.eu_ai_act || '—')}</span>`, 'max-width:140px')}
    ${td(nistChips || '—', 'max-width:180px')}
    ${td(isoChips  || '—', 'max-width:140px')}
    ${td(aitcStatusBadge(tool.default_approval_status))}
    ${aiCatState.adminMode && isPlatformAdmin()
      ? `<td style="padding:.4rem .6rem;border-bottom:1px solid var(--border);text-align:center;white-space:nowrap">
          <button class="btn btn-outline btn-sm" style="font-size:10px;padding:3px 8px" onclick="aitcOpenEdit('${tool.id}')">Edit</button>
          ${!tool.is_seeded
            ? `<button class="btn btn-red btn-sm" style="font-size:10px;padding:3px 8px;margin-left:4px" onclick="aitcDelete('${tool.id}')">Del</button>`
            : `<span style="font-size:9px;color:var(--muted);margin-left:4px">seeded</span>`}
        </td>`
      : ''}
  </tr>`;
}

// ── ADMIN ACTIONS ────────────────────────────────────────────────────────────────

function aitcToggleAdmin() {
  aiCatState.adminMode = !aiCatState.adminMode;
  aitcRefresh();
}

function aitcOpenAdd() {
  aiCatState.editId = null;
  _aitcShowModal(null);
}

function aitcOpenEdit(id) {
  aiCatState.editId = id;
  const tool = aitcById(id);
  _aitcShowModal(tool);
}

function _aitcShowModal(tool) {
  const statuses = Object.entries(AITC_STATUS_LABELS).map(([v, l]) =>
    `<option value="${v}" ${tool?.default_approval_status === v ? 'selected' : ''}>${l}</option>`).join('');

  const scopeVal = (tool?.data_in_scope || []).join(', ');
  const nistVal  = (tool?.nist_controls || []).join(', ');
  const isoVal   = (tool?.iso42001     || []).join(', ');

  const title = tool ? `Edit: ${escH(tool.name)}` : 'Add AI Tool';

  const html = `
  <div style="padding:1.5rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
      <div style="font-size:15px;font-weight:700;color:var(--text)">${title}</div>
      <button onclick="aitcCloseModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted)">✕</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
      ${_aitcField('Name', `<input id="aitc-name" class="form-input" value="${escH(tool?.name || '')}" placeholder="e.g. ChatGPT Enterprise">`)}
      ${_aitcField('Vendor', `<input id="aitc-vendor" class="form-input" value="${escH(tool?.vendor || '')}" placeholder="e.g. OpenAI">`)}
      ${_aitcField('Category', `<input id="aitc-category" class="form-input" value="${escH(tool?.category || 'Foundation LLM')}" placeholder="Foundation LLM">`)}
      ${_aitcField('Tier', `<select id="aitc-tier" class="form-input">
        ${['Tier 1','Tier 2','Tier 3'].map(t => `<option ${tool?.tier === t ? 'selected' : ''}>${t}</option>`).join('')}
      </select>`)}
      ${_aitcField('Approval Status', `<select id="aitc-status" class="form-input">${statuses}</select>`, '1/-1')}
      ${_aitcField('Data In Scope', `<input id="aitc-scope" class="form-input" value="${escH(scopeVal)}" placeholder="Text, Code, Images (comma-separated)">`, '1/-1')}
      ${_aitcField('EU AI Act', `<input id="aitc-euai" class="form-input" value="${escH(tool?.eu_ai_act || '')}" placeholder="GPAI Model">`, '1/-1')}
      ${_aitcField('NIST AI RMF Controls', `<input id="aitc-nist" class="form-input" value="${escH(nistVal)}" placeholder="GV-1.5, MP-1.1 (comma-separated)">`, '1/-1')}
      ${_aitcField('ISO 42001 Clauses', `<input id="aitc-iso" class="form-input" value="${escH(isoVal)}" placeholder="§6.1.2, §8.2 (comma-separated)">`, '1/-1')}
    </div>
    <div style="margin:.75rem 0">
      <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem">Compliance</div>
      <div style="display:flex;gap:1rem;flex-wrap:wrap">
        ${[['dlp','DLP'],['sso','SSO'],['logs','Audit Logs'],['dpa','DPA'],['soc2','SOC 2']].map(([k, l]) =>
          `<label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer">
            <input type="checkbox" id="aitc-${k}" ${tool?.[`has_${k}`] ? 'checked' : ''}> ${l}
          </label>`).join('')}
      </div>
    </div>
    <div style="margin:.75rem 0">
      <label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer">
        <input type="checkbox" id="aitc-component" ${tool?.is_component ? 'checked' : ''}>
        <span>This is a component / sub-application (child of another tool)</span>
      </label>
    </div>
    <div id="aitc-err" style="color:#b91c1c;font-size:12px;margin-top:.5rem;display:none"></div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:1.25rem">
      <button class="btn btn-outline btn-sm" onclick="aitcCloseModal()">Cancel</button>
      <button class="btn btn-cyan btn-sm" onclick="aitcSave('${tool?.id || ''}')">
        ${tool ? 'Save Changes' : 'Add Tool'}
      </button>
    </div>
  </div>`;

  document.getElementById('aitcModalBox').innerHTML = html;
  document.getElementById('aitcModal').style.display = 'flex';
}

function _aitcField(label, input, gridCol = '') {
  const colStyle = gridCol ? `grid-column:${gridCol};` : '';
  return `<div style="${colStyle}">
    <label style="display:block;font-size:10px;font-weight:700;color:var(--muted);
      text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">${label}</label>
    ${input}
  </div>`;
}

function aitcCloseModal() {
  document.getElementById('aitcModal').style.display = 'none';
}

async function aitcSave(existingId) {
  if (aiCatState.saving) return;
  const get = id => document.getElementById(id);
  const name = get('aitc-name')?.value.trim();
  if (!name) {
    const err = get('aitc-err');
    if (err) { err.textContent = 'Tool name is required.'; err.style.display = 'block'; }
    return;
  }

  const csvToArr = v => (v || '').split(',').map(s => s.trim()).filter(Boolean);

  const row = {
    name,
    vendor:                   get('aitc-vendor')?.value.trim()   || null,
    category:                 get('aitc-category')?.value.trim() || 'Foundation LLM',
    tier:                     get('aitc-tier')?.value            || 'Tier 1',
    default_approval_status:  get('aitc-status')?.value          || 'under_review',
    data_in_scope:            csvToArr(get('aitc-scope')?.value),
    eu_ai_act:                get('aitc-euai')?.value.trim()     || null,
    nist_controls:            csvToArr(get('aitc-nist')?.value),
    iso42001:                 csvToArr(get('aitc-iso')?.value),
    has_dlp:                  !!get('aitc-dlp')?.checked,
    has_sso:                  !!get('aitc-sso')?.checked,
    has_logs:                 !!get('aitc-logs')?.checked,
    has_dpa:                  !!get('aitc-dpa')?.checked,
    has_soc2:                 !!get('aitc-soc2')?.checked,
    is_component:             !!get('aitc-component')?.checked,
    is_seeded:                false, // user-added tools are not seeded
  };
  if (existingId) row.id = existingId;

  aiCatState.saving = true;
  try {
    const result = await sb.aiCatalog.upsert(row);
    const saved  = Array.isArray(result) ? result[0] : result;
    // Update local cache
    const idx = aiCatState.tools.findIndex(t => t.id === saved?.id);
    if (idx >= 0) aiCatState.tools[idx] = saved;
    else if (saved) aiCatState.tools.push(saved);
    aitcCloseModal();
    toast(existingId ? 'Tool updated.' : 'Tool added to catalog.');
    aitcRefresh();
  } catch (e) {
    const err = document.getElementById('aitc-err');
    if (err) { err.textContent = e.message; err.style.display = 'block'; }
  } finally {
    aiCatState.saving = false;
  }
}

async function aitcDelete(id) {
  const tool = aitcById(id);
  if (!tool) return;
  if (tool.is_seeded) { toast('Seeded tools cannot be deleted.', '#dc2626'); return; }
  if (!confirm(`Delete "${tool.name}" from the catalog? This cannot be undone.`)) return;
  try {
    await sb.aiCatalog.delete(id);
    aiCatState.tools = aiCatState.tools.filter(t => t.id !== id);
    toast('Tool deleted.');
    aitcRefresh();
  } catch (e) {
    toast('Delete failed: ' + e.message, '#dc2626');
  }
}

// ── REFRESH HELPER ────────────────────────────────────────────────────────────────

function aitcRefresh() {
  const el = document.getElementById('mainContent');
  if (el && activeNav === 'ai_tool_catalog') el.innerHTML = renderAiToolCatalog();
}

// ── EXPOSE GLOBALS ────────────────────────────────────────────────────────────────

window.renderAiToolCatalog  = renderAiToolCatalog;
window.loadAiToolCatalog    = loadAiToolCatalog;
window.aitcToggleAdmin      = aitcToggleAdmin;
window.aitcOpenAdd          = aitcOpenAdd;
window.aitcOpenEdit         = aitcOpenEdit;
window.aitcCloseModal       = aitcCloseModal;
window.aitcSave             = aitcSave;
window.aitcDelete           = aitcDelete;
window.aitcById             = aitcById;
window.aitcForDropdown      = aitcForDropdown;
