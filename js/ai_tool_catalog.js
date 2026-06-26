// ============================================================
// AI APPLICATION INVENTORY
// Two-tab module:
//   My AI Tools   — per-org inventory: select catalog tools or add custom.
//                   Status: Approved / Conditional / Not Approved / Shadow IT.
//                   Shadow IT & Not Approved appear on a separate sub-tab.
//   Reference Catalog — browse seeded compliance catalog; "Add to My Tools" per entry.
//                       Platform admin mode: edit / add / delete catalog entries.
// ============================================================

let aitcLinksState = {
  open:       false,
  tab:        'links',
  tokens:     [],
  pending:    [],
  loading:    false,
  generating: false,
  rejectId:   null,
};

let aiCatState = {
  // Catalog (seeded reference data)
  tools:         [],   // ai_tool_catalog rows
  components:    [],   // ai_tool_components rows
  catalogLoaded: false,
  loaded:        false,   // alias checked by ai_risk_register.js
  // Org inventory (ai_org_tools)
  orgTools:      [],   // ai_org_tools rows for current org
  orgId:         null,
  orgLoaded:     false,
  // App Inventory rows for link picker (gov12)
  appList:       [],
  appListOrgId:  null,
  // UI state
  tab:           'mytools',    // 'mytools' | 'catalog'
  myToolsTab:    'active',     // 'active' | 'flagged'
  adminMode:     false,
  // Add / edit modals
  modal:         null,         // null | { type: 'addCatalog'|'addCustom'|'editOrgTool', ... }
  saving:        false,
};

// ── STATUS DEFINITIONS ────────────────────────────────────────────────────────────

const AITC_ORG_STATUS = {
  approved:    { label: 'Approved',    bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
  conditional: { label: 'Conditional', bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
  not_approved:{ label: 'Not Approved',bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
  shadow_it:   { label: 'Shadow IT',   bg: '#fef2f3', color: '#be123c', border: '#fecdd3' },
};

const AITC_CATALOG_STATUS = {
  approved:              { label: 'Approved',                    bg: '#dcfce7', color: '#166534' },
  approved_enterprise:   { label: 'Approved — Enterprise Only',  bg: '#d1fae5', color: '#065f46' },
  approved_self_hosted:  { label: 'Approved — Self-Hosted Only', bg: '#d1fae5', color: '#065f46' },
  conditional:           { label: 'Conditional',                 bg: '#fef3c7', color: '#92400e' },
  not_approved:          { label: 'Not Approved',                bg: '#fee2e2', color: '#991b1b' },
  under_review:          { label: 'Under Review',                bg: '#e0e7ff', color: '#3730a3' },
};

function aitcOrgStatusBadge(status) {
  const s = AITC_ORG_STATUS[status] || { label: status || '—', bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
  return `<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;
    background:${s.bg};color:${s.color};border:1px solid ${s.border || s.bg};white-space:nowrap">${s.label}</span>`;
}

function aitcCatalogStatusBadge(status) {
  const s = AITC_CATALOG_STATUS[status] || { label: status || '—', bg: '#f3f4f6', color: '#374151' };
  return `<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;
    background:${s.bg};color:${s.color};white-space:nowrap">${s.label}</span>`;
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
  if (aiCatState.catalogLoaded) return;
  try {
    const [tools, comps] = await Promise.all([
      sb.aiCatalog.getAll(),
      sb.aiCatalog.getComponents(),
    ]);
    aiCatState.tools         = tools || [];
    aiCatState.components    = comps || [];
    aiCatState.catalogLoaded = true;
    aiCatState.loaded        = true;
  } catch (e) {
    console.warn('AI Catalog load failed:', e.message);
  }
}

async function loadAiOrgTools(orgId) {
  aiCatState.orgId     = orgId;
  aiCatState.orgLoaded = false;
  try {
    const rows = await sb.aiOrgTools.getForOrg(orgId);
    aiCatState.orgTools  = rows || [];
    aiCatState.orgLoaded = true;
  } catch (e) {
    console.warn('AI Org Tools load failed:', e.message);
    aiCatState.orgTools  = [];
    aiCatState.orgLoaded = true;
  }
}

// Combined load: catalog + org tools in parallel
async function loadAiInventory(orgId) {
  await Promise.all([
    loadAiToolCatalog(),
    loadAiOrgTools(orgId),
    aitcLoadAppList(orgId),
  ]);
}

async function aitcLoadAppList(orgId) {
  if (aiCatState.appListOrgId === orgId && aiCatState.appList.length) return;
  try {
    const rows = await sb.appInventory.getForOrg(orgId);
    aiCatState.appList      = Array.isArray(rows) ? rows : [];
    aiCatState.appListOrgId = orgId;
  } catch (e) {
    aiCatState.appList = [];
  }
}

// ── HELPERS ───────────────────────────────────────────────────────────────────────

function aitcById(id) {
  return aiCatState.tools.find(t => t.id === id);
}

function aitcChildIds(parentId) {
  return aiCatState.components.filter(c => c.parent_id === parentId).map(c => c.child_id);
}

function aitcGrouped() {
  const parents = aiCatState.tools.filter(t => !t.is_component);
  return parents.map(p => ({
    tool: p,
    children: aitcChildIds(p.id).map(cid => aitcById(cid)).filter(Boolean),
  }));
}

// Flat list for risk register dropdown (vendor-grouped)
function aitcForDropdown() {
  const vendors = [...new Set(aiCatState.tools.map(t => t.vendor))].filter(Boolean).sort();
  const result = [];
  vendors.forEach(v => {
    const vTools = aiCatState.tools
      .filter(t => t.vendor === v)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    result.push({ isGroup: true, label: v });
    vTools.forEach(t => result.push({ isGroup: false, tool: t, indent: t.is_component }));
  });
  return result;
}

// Name of an org tool (catalog name or custom name)
function aitcOrgToolName(ot) {
  if (ot.tool_catalog_id) {
    const t = aitcById(ot.tool_catalog_id);
    return t ? t.name : ot.custom_name || '—';
  }
  return ot.custom_name || '—';
}

function aitcOrgToolVendor(ot) {
  if (ot.tool_catalog_id) {
    const t = aitcById(ot.tool_catalog_id);
    return t ? t.vendor : ot.custom_vendor || '—';
  }
  return ot.custom_vendor || '—';
}

function aitcOrgToolCategory(ot) {
  if (ot.tool_catalog_id) {
    const t = aitcById(ot.tool_catalog_id);
    return t ? t.category : ot.custom_category || '—';
  }
  return ot.custom_category || '—';
}

function aitcOrgToolScope(ot) {
  if (ot.custom_data_scope?.length) return ot.custom_data_scope;
  if (ot.tool_catalog_id) {
    const t = aitcById(ot.tool_catalog_id);
    return t?.data_in_scope || [];
  }
  return [];
}

// Check if a catalog tool is already in the org's inventory
function aitcIsInOrgTools(catalogId) {
  return aiCatState.orgTools.some(ot => ot.tool_catalog_id === catalogId);
}

// ── RENDER MAIN ──────────────────────────────────────────────────────────────────

function renderAiToolCatalog() {
  if (!currentOrg) return '';

  const tab = aiCatState.tab;
  const tabBtn = (id, label, icon) =>
    `<button onclick="aitcSetTab('${id}')" style="padding:7px 16px;border-radius:7px;border:none;cursor:pointer;
      font-size:12px;font-weight:700;font-family:inherit;
      background:${tab === id ? 'var(--navy)' : 'var(--bg)'};
      color:${tab === id ? '#fff' : 'var(--muted)'}">
      ${icon} ${label}
    </button>`;

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:1.05rem;font-weight:700;color:var(--text)">AI Application Inventory</div>
      <div style="font-size:12px;color:var(--muted);margin-top:2px">Track the AI tools your organization uses, approves, or has flagged</div>
    </div>
  </div>

  <div style="display:flex;gap:6px;margin-bottom:1.1rem;background:var(--bg);padding:5px;border-radius:10px;width:fit-content">
    ${tabBtn('mytools',  'My AI Tools',        '🤖')}
    ${tabBtn('catalog',  'Reference Catalog',   '📦')}
  </div>

  ${tab === 'mytools'  ? _aitcMyToolsView()  : ''}
  ${tab === 'catalog'  ? _aitcCatalogView()  : ''}

  ${_aitcModalHtml()}
  ${aitcLinksState.open ? _aitcLinksModal() : ''}`;
}

// ── MY AI TOOLS TAB ───────────────────────────────────────────────────────────────

function _aitcMyToolsView() {
  const myTab = aiCatState.myToolsTab;

  const activeTools  = aiCatState.orgTools.filter(t => ['approved','conditional'].includes(t.org_status));
  const flaggedTools = aiCatState.orgTools.filter(t => ['not_approved','shadow_it'].includes(t.org_status));

  const subTabBtn = (id, label, count, color) =>
    `<button onclick="aitcSetMyTab('${id}')" style="padding:5px 14px;border-radius:20px;border:none;cursor:pointer;
      font-size:11px;font-weight:700;font-family:inherit;
      background:${myTab === id ? color : 'var(--bg)'};
      color:${myTab === id ? '#fff' : 'var(--muted)'}">
      ${label} <span style="opacity:.8">${count}</span>
    </button>`;

  const tools = myTab === 'active' ? activeTools : flaggedTools;

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.85rem;flex-wrap:wrap;gap:.5rem">
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${subTabBtn('active',  'Active',              activeTools.length,  '#16a34a')}
      ${subTabBtn('flagged', 'Shadow IT & Flagged', flaggedTools.length, '#b91c1c')}
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${isPlatformAdmin() || isAdmin() ? `<button class="btn btn-outline btn-sm" onclick="aitcOpenLinks()">🔗 Submission Links</button>` : ''}
      <button class="btn btn-outline btn-sm" onclick="aitcOpenAddFromCatalog()">+ From Catalog</button>
      <button class="btn btn-cyan btn-sm"    onclick="aitcOpenAddCustom()">+ Custom Tool</button>
    </div>
  </div>

  ${myTab === 'flagged' && flaggedTools.length > 0 ? `
    <div style="background:#fef2f3;border:1px solid #fecdd3;border-radius:8px;padding:.6rem .9rem;
      font-size:11px;color:#be123c;margin-bottom:.85rem">
      <strong>Shadow IT & Flagged tools</strong> — these tools have been identified but are not approved for use.
      Review and update their status or remove them from inventory.
    </div>` : ''}

  ${!aiCatState.orgLoaded
    ? `<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">
        <div class="spinner" style="width:20px;height:20px;margin:0 auto .75rem"></div>
        <div style="font-size:13px">Loading…</div>
       </div>`
    : tools.length === 0
      ? _aitcMyToolsEmpty(myTab)
      : _aitcMyToolsTable(tools)}`;
}

function _aitcMyToolsEmpty(tab) {
  if (tab === 'active') {
    return `<div class="card" style="text-align:center;padding:2.5rem;color:var(--muted)">
      <div style="font-size:2rem;margin-bottom:.5rem">✅</div>
      <div style="font-size:14px;font-weight:700">No approved tools yet</div>
      <div style="font-size:12px;margin-top:4px">Add tools from the catalog or add a custom tool above.</div>
      <div style="margin-top:1rem;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-outline btn-sm" onclick="aitcOpenAddFromCatalog()">+ From Catalog</button>
        <button class="btn btn-cyan btn-sm"    onclick="aitcOpenAddCustom()">+ Custom Tool</button>
      </div>
    </div>`;
  }
  return `<div class="card" style="text-align:center;padding:2.5rem;color:var(--muted)">
    <div style="font-size:2rem;margin-bottom:.5rem">🎉</div>
    <div style="font-size:14px;font-weight:700">No flagged tools</div>
    <div style="font-size:12px;margin-top:4px">No Shadow IT or rejected tools on record.</div>
  </div>`;
}

function _aitcMyToolsTable(tools) {
  const headerStyle = `font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;
    letter-spacing:.05em;padding:.5rem .75rem;text-align:left`;

  const rows = tools.map(ot => {
    const name     = aitcOrgToolName(ot);
    const vendor   = aitcOrgToolVendor(ot);
    const category = aitcOrgToolCategory(ot);
    const scope    = aitcOrgToolScope(ot);

    const td = (content, extra = '') =>
      `<td style="padding:.55rem .75rem;border-bottom:1px solid var(--border);font-size:12px;vertical-align:middle;${extra}">${content}</td>`;

    const scopeText = scope.length ? scope.join(', ') : '—';

    const linkedApp    = ot.app_inventory_id ? aiCatState.appList.find(a => a.id === ot.app_inventory_id) : null;
    const regScopes    = Array.isArray(ot.regulatory_scope) ? ot.regulatory_scope : [];
    const _REG_COL     = { 'SOX':'background:#fef3c7;color:#92400e', 'PCI-DSS':'background:#dbeafe;color:#1e40af', 'HIPAA':'background:#dcfce7;color:#15803d', 'PIPEDA':'background:#ede9fe;color:#6d28d9' };
    const regBadges    = regScopes.map(s => `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:5px;${_REG_COL[s]||'background:#f1f5f9;color:#374151'}">${escH(s)}</span>`).join(' ');

    return `<tr>
      ${td(`<div style="display:flex;align-items:center;gap:6px">
              <div>
                <div style="font-weight:700">${escH(name)}</div>
                <div style="font-size:10px;color:var(--muted)">${escH(vendor)}</div>
                <div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:2px">
                  ${ot.department ? `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:5px;background:#f1f5f9;color:#475569;border:1px solid #e2e8f0">${escH(ot.department)}</span>` : ''}
                  ${linkedApp ? `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:5px;background:#dbeafe;color:#1e40af" title="Linked to Application Inventory">🔗 ${escH(linkedApp.app_name)}</span>` : ''}
                  ${regBadges}
                  ${ot.regulatory_scope_other ? `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:5px;background:#f1f5f9;color:#374151" title="${escH(ot.regulatory_scope_other)}">+Other</span>` : ''}
                </div>
              </div>
              ${ot.is_custom ? `<span style="font-size:9px;background:#e0e7ff;color:#3730a3;padding:1px 6px;border-radius:10px;font-weight:700">custom</span>` : ''}
            </div>`)}
      ${td(`<span style="font-size:11px;color:var(--muted)">${escH(category)}</span>`)}
      ${td(`<span style="font-size:11px">${escH(scopeText)}</span>`, 'max-width:180px')}
      ${td(aitcOrgStatusBadge(ot.org_status))}
      ${td(`<span style="font-size:11px;color:var(--muted)">${escH(ot.notes || '—')}</span>`, 'max-width:200px')}
      ${td(`<div style="display:flex;gap:5px;white-space:nowrap">
              <button class="btn btn-outline btn-sm" style="font-size:10px;padding:3px 8px" onclick="aitcEditOrgTool('${ot.id}')">Edit</button>
              <button class="btn btn-outline btn-sm" style="font-size:10px;padding:3px 8px;border-color:#7c3aed;color:#7c3aed" title="Create AI Risk Register entry for this tool" onclick="aitcCreateRiskFromTool('${ot.id}')">→ Risk</button>
              <button class="btn btn-red btn-sm"     style="font-size:10px;padding:3px 8px" onclick="aitcRemoveOrgTool('${ot.id}')">Remove</button>
            </div>`, 'text-align:right')}
    </tr>`;
  }).join('');

  return `<div class="card" style="padding:0;overflow:hidden">
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;min-width:700px">
        <thead>
          <tr style="border-bottom:2px solid var(--border);background:var(--bg)">
            <th style="${headerStyle}">Tool / Vendor</th>
            <th style="${headerStyle}">Category</th>
            <th style="${headerStyle}">Data In Scope</th>
            <th style="${headerStyle}">Status</th>
            <th style="${headerStyle}">Notes</th>
            <th style="${headerStyle};width:120px"></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}

// ── REFERENCE CATALOG TAB ─────────────────────────────────────────────────────────

function _aitcCatalogView() {
  const isAdmin = isPlatformAdmin();

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:.5rem">
    <div style="font-size:12px;color:var(--muted)">
      Seeded reference catalog — compliance posture for Tier 1 AI tools.
      Click <strong>Add to My Tools</strong> to track a tool in your inventory.
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${isAdmin ? `<button class="btn btn-outline btn-sm" onclick="aitcToggleAdmin()"
        style="${aiCatState.adminMode ? 'background:var(--navy);color:#fff;border-color:var(--navy)' : ''}">
        ${aiCatState.adminMode ? '✓ Admin Mode' : '⚙️ Admin Mode'}</button>` : ''}
      ${isAdmin && aiCatState.adminMode
        ? `<button class="btn btn-cyan btn-sm" onclick="aitcOpenAddCatalogEntry()">+ Add Catalog Entry</button>`
        : ''}
    </div>
  </div>

  ${aiCatState.adminMode && isAdmin
    ? `<div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:.6rem .9rem;
        font-size:11px;color:#92400e;margin-bottom:.85rem">
        <strong>Admin mode active</strong> — you can edit seeded catalog entries and add new ones. Changes affect all users.
       </div>`
    : ''}

  ${_aitcLegend()}
  ${_aitcCatalogTable()}`;
}

function _aitcLegend() {
  const cols = ['DLP','SSO','Logs','DPA','SOC 2'];
  return `<div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.75rem;flex-wrap:wrap">
    <span style="font-size:10px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em">Compliance columns:</span>
    ${cols.map(c => `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;
      color:var(--muted);background:var(--bg);padding:2px 8px;border-radius:20px;border:1px solid var(--border)">
      <span style="color:#166534;font-weight:700">✓</span> ${c}</span>`).join('')}
  </div>`;
}

function _aitcCatalogTable() {
  const grouped = aitcGrouped();
  if (!grouped.length) {
    return `<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">
      <div style="font-size:1.5rem;margin-bottom:.5rem">📦</div>
      <div style="font-size:13px;font-weight:600">Catalog not loaded</div>
      <div style="font-size:11px;margin-top:4px">Run SUPABASE_PATCH_035.sql to seed the tool catalog.</div>
    </div>`;
  }

  const headerStyle = `font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;
    letter-spacing:.05em;padding:.5rem .75rem;text-align:center`;

  const rows = grouped.map(({ tool: p, children }) =>
    _aitcCatalogRow(p, false) + children.map(c => _aitcCatalogRow(c, true)).join('')
  ).join('');

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
            <th style="${headerStyle};text-align:left">Default Status</th>
            <th style="${headerStyle}"></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}

function _aitcCatalogRow(tool, isChild) {
  const td = (content, extra = '') =>
    `<td style="padding:.55rem .75rem;border-bottom:1px solid var(--border);font-size:12px;vertical-align:middle;${extra}">${content}</td>`;

  const nameCell = isChild
    ? `<div style="display:flex;align-items:center;gap:6px;padding-left:1.25rem">
        <span style="color:var(--muted);font-size:11px">↳</span>
        <span style="font-weight:600">${escH(tool.name)}</span>
        <span style="font-size:9px;background:#e0e7ff;color:#3730a3;padding:1px 6px;border-radius:10px;font-weight:700">component</span>
       </div>`
    : `<span style="font-weight:700">${escH(tool.name)}</span>`;

  const nistChips = (tool.nist_controls || []).slice(0, 4).map(c =>
    `<span style="display:inline-block;font-size:9px;padding:1px 5px;border-radius:4px;
      background:#ede9fe;color:#5b21b6;font-weight:600;margin:1px">${escH(c)}</span>`).join('') +
    (tool.nist_controls?.length > 4 ? `<span style="font-size:9px;color:var(--muted)">+${tool.nist_controls.length - 4}</span>` : '');

  const isoChips = (tool.iso42001 || []).slice(0, 3).map(c =>
    `<span style="display:inline-block;font-size:9px;padding:1px 5px;border-radius:4px;
      background:#fce7f3;color:#9d174d;font-weight:600;margin:1px">${escH(c)}</span>`).join('') +
    (tool.iso42001?.length > 3 ? `<span style="font-size:9px;color:var(--muted)">+${tool.iso42001.length - 3}</span>` : '');

  const alreadyAdded = aitcIsInOrgTools(tool.id);
  const addBtn = alreadyAdded
    ? `<span style="font-size:10px;color:#166534;font-weight:700;padding:3px 8px">✓ Added</span>`
    : `<button class="btn btn-outline btn-sm" style="font-size:10px;padding:3px 8px;white-space:nowrap"
        onclick="aitcOpenAddFromCatalogEntry('${tool.id}')">+ Add to My Tools</button>`;

  const rowBg = isChild ? 'background:#fafbff;' : '';

  return `<tr style="${rowBg}">
    ${td(nameCell, 'padding-left:1rem')}
    ${td(`<span style="font-size:11px;color:var(--muted)">${escH(tool.vendor || '—')}</span>`)}
    ${td(`<span style="font-size:11px;color:var(--muted)">${escH(tool.category || '—')}</span>`)}
    ${td(`<span style="font-size:11px">${escH((tool.data_in_scope || []).join(', ') || '—')}</span>`, 'max-width:140px')}
    ${td(aitcBoolChip(tool.has_dlp,  'Data Loss Prevention'), 'text-align:center')}
    ${td(aitcBoolChip(tool.has_sso,  'Single Sign-On'),       'text-align:center')}
    ${td(aitcBoolChip(tool.has_logs, 'Audit Logging'),        'text-align:center')}
    ${td(aitcBoolChip(tool.has_dpa,  'Data Processing Agreement'), 'text-align:center')}
    ${td(aitcBoolChip(tool.has_soc2, 'SOC 2 Type II'),        'text-align:center')}
    ${td(`<span style="font-size:10px;color:var(--muted)">${escH(tool.eu_ai_act || '—')}</span>`, 'max-width:130px')}
    ${td(nistChips || '—', 'max-width:170px')}
    ${td(isoChips  || '—', 'max-width:130px')}
    ${td(aitcCatalogStatusBadge(tool.default_approval_status))}
    ${td(`<div style="display:flex;gap:4px;white-space:nowrap;justify-content:flex-end">
            ${addBtn}
            ${aiCatState.adminMode && isPlatformAdmin()
              ? `<button class="btn btn-outline btn-sm" style="font-size:10px;padding:3px 8px" onclick="aitcOpenEditCatalogEntry('${tool.id}')">Edit</button>
                 ${!tool.is_seeded
                   ? `<button class="btn btn-red btn-sm" style="font-size:10px;padding:3px 8px" onclick="aitcDeleteCatalogEntry('${tool.id}')">Del</button>`
                   : ''}`
              : ''}
          </div>`, 'text-align:right')}
  </tr>`;
}

// ── MODAL HTML (rendered inline at bottom of page) ────────────────────────────────

function _aitcModalHtml() {
  if (!aiCatState.modal) return '';
  const m = aiCatState.modal;

  if (m.type === 'addFromCatalog') return _aitcModalAddFromCatalog(m);
  if (m.type === 'addCustom')      return _aitcModalAddCustom(m);
  if (m.type === 'editOrgTool')    return _aitcModalEditOrgTool(m);
  if (m.type === 'editCatalog')    return _aitcModalEditCatalog(m);
  if (m.type === 'pickFromCatalog') return _aitcModalPickFromCatalog(m);
  return '';
}

function _aitcModalWrap(content) {
  return `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9000;
    display:flex;align-items:center;justify-content:center" onclick="if(event.target===this)aitcCloseModal()">
    <div style="background:#fff;border-radius:14px;max-width:540px;width:94%;max-height:90vh;
      overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)" onclick="event.stopPropagation()">
      ${content}
    </div>
  </div>`;
}

function _statusSelect(id, selected) {
  return `<select id="${id}" class="form-input">
    ${Object.entries(AITC_ORG_STATUS).map(([v, s]) =>
      `<option value="${v}" ${selected === v ? 'selected' : ''}>${s.label}</option>`
    ).join('')}
  </select>`;
}

function _aitcDeptDatalist() {
  const depts = [...new Set(aiCatState.orgTools.map(t => t.department).filter(Boolean))];
  return `<datalist id="aitc-dept-list">${depts.map(d => `<option value="${escH(d)}">`).join('')}</datalist>`;
}

function _aitcModalAddFromCatalog(m) {
  const tool = aitcById(m.catalogId);
  if (!tool) return '';
  return _aitcModalWrap(`
    <div style="padding:1.5rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
        <div>
          <div style="font-size:15px;font-weight:700">Add to My Tools</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">${escH(tool.name)} — ${escH(tool.vendor || '')}</div>
        </div>
        <button onclick="aitcCloseModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted)">✕</button>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label">Approval Status</label>
        ${_statusSelect('aitc-add-status', 'shadow_it')}
        <div style="font-size:10px;color:var(--muted);margin-top:4px">
          Shadow IT = discovered / unvetted. Update once reviewed.
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label">Department</label>
        <input id="aitc-add-dept" list="aitc-dept-list" class="form-input" placeholder="e.g. Finance, Operations…" style="width:100%;box-sizing:border-box">
        ${_aitcDeptDatalist()}
      </div>
      <div style="margin-bottom:1.25rem">
        <label class="form-label">Notes (optional)</label>
        <textarea id="aitc-add-notes" class="form-input" rows="2" placeholder="e.g. Used by Sales team for email drafting…"></textarea>
      </div>
      <div id="aitc-modal-err" style="color:#b91c1c;font-size:12px;margin-bottom:.75rem;display:none"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-outline btn-sm" onclick="aitcCloseModal()">Cancel</button>
        <button class="btn btn-cyan btn-sm" onclick="aitcSaveAddFromCatalog('${tool.id}')">Add to My Tools</button>
      </div>
    </div>`);
}

function _aitcModalAddCustom(m) {
  return _aitcModalWrap(`
    <div style="padding:1.5rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
        <div style="font-size:15px;font-weight:700">Add Custom AI Tool</div>
        <button onclick="aitcCloseModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted)">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Tool Name <span style="color:#dc2626">*</span></label>
          <input id="aitc-c-name" class="form-input" placeholder="e.g. WorkflowAI Pro">
        </div>
        <div>
          <label class="form-label">Vendor</label>
          <input id="aitc-c-vendor" class="form-input" placeholder="e.g. Acme Corp">
        </div>
        <div>
          <label class="form-label">Category</label>
          <input id="aitc-c-category" class="form-input" placeholder="e.g. AI Agent, Browser Extension">
        </div>
        <div>
          <label class="form-label">Approval Status</label>
          ${_statusSelect('aitc-c-status', 'shadow_it')}
        </div>
        <div style="grid-column:1/-1">
          <label class="form-label">Data In Scope</label>
          <input id="aitc-c-scope" class="form-input" placeholder="Text, Documents, Email (comma-separated)">
        </div>
        <div>
          <label class="form-label">Department</label>
          <input id="aitc-c-dept" list="aitc-dept-list" class="form-input" placeholder="e.g. Finance, Operations…">
          ${_aitcDeptDatalist()}
        </div>
        <div style="grid-column:1/-1">
          <label class="form-label">Notes (optional)</label>
          <textarea id="aitc-c-notes" class="form-input" rows="2" placeholder="e.g. Discovered via browser extension policy review…"></textarea>
        </div>
      </div>
      <div id="aitc-modal-err" style="color:#b91c1c;font-size:12px;margin-bottom:.75rem;display:none"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-outline btn-sm" onclick="aitcCloseModal()">Cancel</button>
        <button class="btn btn-cyan btn-sm" onclick="aitcSaveAddCustom()">Add Tool</button>
      </div>
    </div>`);
}

function _aitcLinkedAppCard(appId) {
  if (!appId) return '';
  const app = aiCatState.appList.find(a => a.id === appId);
  if (!app) return '';
  const _b = (label, val, bg, col) => val
    ? `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;background:${bg};color:${col}">${escH(val)}</span>`
    : '';
  const critB = _b('Crit', app.criticality, app.criticality === 'Critical' ? '#fee2e2' : app.criticality === 'High' ? '#ffedd5' : app.criticality === 'Medium' ? '#fef3c7' : '#dcfce7', app.criticality === 'Critical' ? '#991b1b' : app.criticality === 'High' ? '#9a3412' : app.criticality === 'Medium' ? '#92400e' : '#166534');
  const bcdrB = _b('BCDR', app.bcdr_priority, '#ede9fe', '#6d28d9');
  const irB   = app.ir_priority_tier ? `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;background:#dbeafe;color:#1e40af">IR ${escH(app.ir_priority_tier)}</span>` : '';
  return `<div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.65rem .9rem;display:flex;align-items:center;gap:.75rem;flex-wrap:wrap">
    <span style="font-size:11px;color:var(--muted)">From <strong style="color:var(--text)">${escH(app.app_name)}</strong>:</span>
    ${critB} ${bcdrB} ${irB}
    ${!critB && !bcdrB && !irB ? `<span style="font-size:11px;color:var(--muted)">No criticality or BCDR data set yet.</span>` : ''}
  </div>`;
}

function aitcRefreshLinkedApp() {
  const sel = document.getElementById('aitc-e-app-link');
  const box = document.getElementById('aitc-linked-app-info');
  if (box) box.innerHTML = _aitcLinkedAppCard(sel?.value || '');
}

function _aitcModalEditOrgTool(m) {
  const ot = aiCatState.orgTools.find(t => t.id === m.id);
  if (!ot) return '';
  const name = aitcOrgToolName(ot);
  return _aitcModalWrap(`
    <div style="padding:1.5rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
        <div>
          <div style="font-size:15px;font-weight:700">Edit Tool</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">${escH(name)}</div>
        </div>
        <button onclick="aitcCloseModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted)">✕</button>
      </div>
      ${ot.is_custom ? `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Tool Name</label>
          <input id="aitc-e-name" class="form-input" value="${escH(ot.custom_name || '')}">
        </div>
        <div>
          <label class="form-label">Vendor</label>
          <input id="aitc-e-vendor" class="form-input" value="${escH(ot.custom_vendor || '')}">
        </div>
        <div>
          <label class="form-label">Category</label>
          <input id="aitc-e-category" class="form-input" value="${escH(ot.custom_category || '')}">
        </div>
        <div>
          <label class="form-label">Data In Scope</label>
          <input id="aitc-e-scope" class="form-input" value="${escH((ot.custom_data_scope || []).join(', '))}">
        </div>
      </div>` : ''}
      <div style="margin-bottom:1rem">
        <label class="form-label">Approval Status</label>
        ${_statusSelect('aitc-e-status', ot.org_status)}
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label">Department</label>
        <input id="aitc-e-dept" list="aitc-dept-list" class="form-input" value="${escH(ot.department || '')}" placeholder="e.g. Finance, Operations…">
        ${_aitcDeptDatalist()}
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label">Notes</label>
        <textarea id="aitc-e-notes" class="form-input" rows="2">${escH(ot.notes || '')}</textarea>
      </div>

      <div style="border-top:1px solid var(--border);margin:1.1rem 0 1rem"></div>

      <div style="margin-bottom:1rem">
        <label class="form-label">Linked Application <span style="font-weight:400;color:var(--muted)">(optional)</span></label>
        <select id="aitc-e-app-link" class="form-input" onchange="aitcRefreshLinkedApp()">
          <option value="">— Not linked —</option>
          ${aiCatState.appList.map(a => `<option value="${a.id}" ${ot.app_inventory_id === a.id ? 'selected' : ''}>${escH(a.app_name)}${a.criticality ? ' · ' + a.criticality : ''}</option>`).join('')}
        </select>
        <div style="font-size:11px;color:var(--muted);margin-top:3px">Link this AI tool to an Application Inventory entry to surface shared BCDR and criticality context.</div>
        <div id="aitc-linked-app-info" style="margin-top:.6rem">${_aitcLinkedAppCard(ot.app_inventory_id)}</div>
      </div>

      <div style="margin-bottom:1.25rem">
        <label class="form-label">Regulatory Scope</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:.5rem">${
          [['SOX','Sarbanes-Oxley (SOX)'],['PCI-DSS','PCI-DSS'],['HIPAA','HIPAA'],['PIPEDA','PIPEDA / Privacy']].map(([val, lbl]) => {
            const existingScopes = Array.isArray(ot.regulatory_scope) ? ot.regulatory_scope : [];
            const checked = existingScopes.includes(val);
            return `<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;padding:5px 8px;border-radius:7px;border:1px solid var(--border);background:var(--bg)">
              <input id="aitc-e-scope-${val.replace('-','')}" type="checkbox" ${checked ? 'checked' : ''}> ${lbl}
            </label>`;
          }).join('')
        }</div>
        <input id="aitc-e-scope-other" class="form-input" value="${escH(ot.regulatory_scope_other || '')}"
          placeholder="Other frameworks (e.g. GDPR, ISO 27001…)" style="font-size:12px">
      </div>

      <div id="aitc-modal-err" style="color:#b91c1c;font-size:12px;margin-bottom:.75rem;display:none"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-outline btn-sm" onclick="aitcCloseModal()">Cancel</button>
        <button class="btn btn-cyan btn-sm" onclick="aitcSaveEditOrgTool('${ot.id}', ${ot.is_custom})">Save Changes</button>
      </div>
    </div>`);
}

function _aitcModalPickFromCatalog(m) {
  // Search + list of catalog tools not already in org tools
  const search  = m.search || '';
  const notAdded = aiCatState.tools.filter(t =>
    !aitcIsInOrgTools(t.id) &&
    (!search || t.name.toLowerCase().includes(search.toLowerCase()) ||
                (t.vendor || '').toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const rows = notAdded.map(t => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.6rem .75rem;
      border-bottom:1px solid var(--border)" onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background=''">
      <div>
        <div style="font-size:12px;font-weight:700">${escH(t.name)}</div>
        <div style="font-size:10px;color:var(--muted)">${escH(t.vendor || '')} · ${escH(t.category || '')}</div>
      </div>
      <button class="btn btn-outline btn-sm" style="font-size:10px;padding:3px 10px;white-space:nowrap"
        onclick="aitcOpenAddFromCatalogEntry('${t.id}')">Select →</button>
    </div>`).join('');

  return _aitcModalWrap(`
    <div style="padding:1.5rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
        <div style="font-size:15px;font-weight:700">Select from Catalog</div>
        <button onclick="aitcCloseModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted)">✕</button>
      </div>
      <input class="form-input" style="margin-bottom:.75rem" placeholder="Search tools…"
        value="${escH(search)}" oninput="aitcCatalogSearch(this.value)">
      <div style="max-height:400px;overflow-y:auto;border:1px solid var(--border);border-radius:8px">
        ${rows.length
          ? rows
          : `<div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:12px">
              ${notAdded.length === 0 && !search ? 'All catalog tools have already been added.' : 'No results.'}
             </div>`}
      </div>
    </div>`);
}

function _aitcModalEditCatalog(m) {
  const tool = m.id ? aitcById(m.id) : null;
  const statuses = Object.entries(AITC_CATALOG_STATUS).map(([v, s]) =>
    `<option value="${v}" ${tool?.default_approval_status === v ? 'selected' : ''}>${s.label}</option>`).join('');

  return _aitcModalWrap(`
    <div style="padding:1.5rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
        <div style="font-size:15px;font-weight:700">${tool ? 'Edit Catalog Entry' : 'Add Catalog Entry'}</div>
        <button onclick="aitcCloseModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted)">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
        <div><label class="form-label">Name</label><input id="aitc-cat-name" class="form-input" value="${escH(tool?.name || '')}"></div>
        <div><label class="form-label">Vendor</label><input id="aitc-cat-vendor" class="form-input" value="${escH(tool?.vendor || '')}"></div>
        <div><label class="form-label">Category</label><input id="aitc-cat-category" class="form-input" value="${escH(tool?.category || 'Foundation LLM')}"></div>
        <div><label class="form-label">Default Status</label><select id="aitc-cat-status" class="form-input">${statuses}</select></div>
        <div style="grid-column:1/-1"><label class="form-label">Data In Scope</label><input id="aitc-cat-scope" class="form-input" value="${escH((tool?.data_in_scope || []).join(', '))}"></div>
        <div style="grid-column:1/-1"><label class="form-label">EU AI Act</label><input id="aitc-cat-euai" class="form-input" value="${escH(tool?.eu_ai_act || '')}"></div>
        <div style="grid-column:1/-1"><label class="form-label">NIST AI RMF Controls</label><input id="aitc-cat-nist" class="form-input" value="${escH((tool?.nist_controls || []).join(', '))}"></div>
        <div style="grid-column:1/-1"><label class="form-label">ISO 42001 Clauses</label><input id="aitc-cat-iso" class="form-input" value="${escH((tool?.iso42001 || []).join(', '))}"></div>
      </div>
      <div style="margin:.75rem 0">
        <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem">Compliance</div>
        <div style="display:flex;gap:1rem;flex-wrap:wrap">
          ${[['dlp','DLP'],['sso','SSO'],['logs','Audit Logs'],['dpa','DPA'],['soc2','SOC 2']].map(([k,l]) =>
            `<label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer">
              <input type="checkbox" id="aitc-cat-${k}" ${tool?.[`has_${k}`] ? 'checked' : ''}> ${l}
            </label>`).join('')}
        </div>
      </div>
      <div id="aitc-modal-err" style="color:#b91c1c;font-size:12px;margin-bottom:.75rem;display:none"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:1rem">
        <button class="btn btn-outline btn-sm" onclick="aitcCloseModal()">Cancel</button>
        <button class="btn btn-cyan btn-sm" onclick="aitcSaveCatalogEntry('${tool?.id || ''}')">
          ${tool ? 'Save Changes' : 'Add Entry'}
        </button>
      </div>
    </div>`);
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────────

function aitcSetTab(tab) {
  aiCatState.tab = tab;
  aitcRefresh();
}

function aitcSetMyTab(tab) {
  aiCatState.myToolsTab = tab;
  aitcRefresh();
}

function aitcToggleAdmin() {
  aiCatState.adminMode = !aiCatState.adminMode;
  aitcRefresh();
}

function aitcCloseModal() {
  aiCatState.modal = null;
  aitcRefresh();
}

function aitcCatalogSearch(val) {
  aiCatState.modal = { ...aiCatState.modal, search: val };
  aitcRefresh();
}

// Open the "pick from catalog" browse modal
function aitcOpenAddFromCatalog() {
  aiCatState.modal = { type: 'pickFromCatalog', search: '' };
  aitcRefresh();
}

// Open the "add this specific tool" status modal
function aitcOpenAddFromCatalogEntry(catalogId) {
  aiCatState.modal = { type: 'addFromCatalog', catalogId };
  aitcRefresh();
}

function aitcOpenAddCustom() {
  aiCatState.modal = { type: 'addCustom' };
  aitcRefresh();
}

function aitcEditOrgTool(id) {
  aiCatState.modal = { type: 'editOrgTool', id };
  aitcRefresh();
}

function aitcOpenAddCatalogEntry() {
  aiCatState.modal = { type: 'editCatalog', id: null };
  aitcRefresh();
}

function aitcOpenEditCatalogEntry(id) {
  aiCatState.modal = { type: 'editCatalog', id };
  aitcRefresh();
}

// ── SAVE HANDLERS ─────────────────────────────────────────────────────────────────

async function aitcSaveAddFromCatalog(catalogId) {
  if (aiCatState.saving) return;
  const status  = document.getElementById('aitc-add-status')?.value || 'shadow_it';
  const notes   = document.getElementById('aitc-add-notes')?.value.trim() || null;
  const dept    = document.getElementById('aitc-add-dept')?.value.trim() || null;
  const addedBy = authState.profile?.name || authState.profile?.email || null;
  aiCatState.saving = true;
  try {
    // Add the parent tool
    const row = {
      org_id: currentOrg.id,
      tool_catalog_id: catalogId,
      is_custom: false,
      org_status: status,
      notes,
      department: dept,
      added_by: addedBy,
    };
    const result = await sb.aiOrgTools.add(row);
    const added  = Array.isArray(result) ? result[0] : result;
    if (added) aiCatState.orgTools.push(added);

    // Auto-add catalog children (components) with the same status
    const parentName  = aitcById(catalogId)?.name || '';
    const childIds    = aitcChildIds(catalogId);
    let childrenAdded = 0;
    for (const childId of childIds) {
      if (aitcIsInOrgTools(childId)) continue; // already in inventory
      try {
        const childRow = {
          org_id: currentOrg.id,
          tool_catalog_id: childId,
          is_custom: false,
          org_status: status,
          notes: `Auto-added as component of ${parentName}`,
          added_by: addedBy,
        };
        const cr = await sb.aiOrgTools.add(childRow);
        const addedChild = Array.isArray(cr) ? cr[0] : cr;
        if (addedChild) { aiCatState.orgTools.push(addedChild); childrenAdded++; }
      } catch (_) { /* skip — may already exist */ }
    }

    aiCatState.modal = null;
    aiCatState.tab = 'mytools';
    aiCatState.myToolsTab = ['approved','conditional'].includes(status) ? 'active' : 'flagged';
    const msg = childrenAdded > 0
      ? `${parentName} + ${childrenAdded} component${childrenAdded > 1 ? 's' : ''} added to your inventory.`
      : 'Tool added to your inventory.';
    toast(msg);
    aitcRefresh();
  } catch (e) {
    const err = document.getElementById('aitc-modal-err');
    if (err) { err.textContent = e.message; err.style.display = 'block'; }
  } finally {
    aiCatState.saving = false;
  }
}

async function aitcSaveAddCustom() {
  if (aiCatState.saving) return;
  const name = document.getElementById('aitc-c-name')?.value.trim();
  if (!name) {
    const err = document.getElementById('aitc-modal-err');
    if (err) { err.textContent = 'Tool name is required.'; err.style.display = 'block'; }
    return;
  }
  const vendor   = document.getElementById('aitc-c-vendor')?.value.trim()   || null;
  const category = document.getElementById('aitc-c-category')?.value.trim() || null;
  const scopeRaw = document.getElementById('aitc-c-scope')?.value           || '';
  const status   = document.getElementById('aitc-c-status')?.value          || 'shadow_it';
  const dept     = document.getElementById('aitc-c-dept')?.value.trim()     || null;
  const notes    = document.getElementById('aitc-c-notes')?.value.trim()    || null;
  const scope    = scopeRaw.split(',').map(s => s.trim()).filter(Boolean);

  aiCatState.saving = true;
  try {
    const row = {
      org_id: currentOrg.id,
      tool_catalog_id: null,
      is_custom: true,
      custom_name: name,
      custom_vendor: vendor,
      custom_category: category,
      custom_data_scope: scope.length ? scope : null,
      org_status: status,
      department: dept,
      notes,
      added_by: authState.profile?.name || authState.profile?.email || null,
    };
    const result = await sb.aiOrgTools.add(row);
    const added  = Array.isArray(result) ? result[0] : result;
    if (added) aiCatState.orgTools.push(added);
    aiCatState.modal = null;
    aiCatState.tab = 'mytools';
    aiCatState.myToolsTab = ['approved','conditional'].includes(status) ? 'active' : 'flagged';
    toast('Custom tool added to your inventory.');
    aitcRefresh();
  } catch (e) {
    const err = document.getElementById('aitc-modal-err');
    if (err) { err.textContent = e.message; err.style.display = 'block'; }
  } finally {
    aiCatState.saving = false;
  }
}

async function aitcSaveEditOrgTool(id, isCustom) {
  if (aiCatState.saving) return;
  const status    = document.getElementById('aitc-e-status')?.value;
  const notes     = document.getElementById('aitc-e-notes')?.value.trim()    || null;
  const dept      = document.getElementById('aitc-e-dept')?.value.trim()     || null;
  const appLinkId = document.getElementById('aitc-e-app-link')?.value        || null;
  const regScopes = ['SOX','PCIDSS','HIPAA','PIPEDA']
    .filter(s => document.getElementById(`aitc-e-scope-${s}`)?.checked)
    .map(s => s === 'PCIDSS' ? 'PCI-DSS' : s);
  const regOther  = document.getElementById('aitc-e-scope-other')?.value.trim() || null;
  const patch  = {
    org_status:             status,
    notes,
    department:             dept,
    app_inventory_id:       appLinkId || null,
    regulatory_scope:       regScopes,
    regulatory_scope_other: regOther,
  };
  if (isCustom) {
    patch.custom_name     = document.getElementById('aitc-e-name')?.value.trim()     || null;
    patch.custom_vendor   = document.getElementById('aitc-e-vendor')?.value.trim()   || null;
    patch.custom_category = document.getElementById('aitc-e-category')?.value.trim() || null;
    const scopeRaw        = document.getElementById('aitc-e-scope')?.value           || '';
    patch.custom_data_scope = scopeRaw.split(',').map(s => s.trim()).filter(Boolean);
  }
  aiCatState.saving = true;
  try {
    const result  = await sb.aiOrgTools.update(id, patch);
    const updated = Array.isArray(result) ? result[0] : result;
    const idx = aiCatState.orgTools.findIndex(t => t.id === id);
    if (idx >= 0 && updated) aiCatState.orgTools[idx] = updated;
    aiCatState.modal = null;
    toast('Tool updated.');
    aitcRefresh();
  } catch (e) {
    const err = document.getElementById('aitc-modal-err');
    if (err) { err.textContent = e.message; err.style.display = 'block'; }
  } finally {
    aiCatState.saving = false;
  }
}

async function aitcRemoveOrgTool(id) {
  const ot = aiCatState.orgTools.find(t => t.id === id);
  if (!ot) return;
  if (!confirm(`Remove "${aitcOrgToolName(ot)}" from your AI inventory? This only removes it from your organization's list.`)) return;
  try {
    await sb.aiOrgTools.delete(id);
    aiCatState.orgTools = aiCatState.orgTools.filter(t => t.id !== id);
    toast('Tool removed from inventory.');
    aitcRefresh();
  } catch (e) {
    toast('Remove failed: ' + e.message, '#dc2626');
  }
}

async function aitcSaveCatalogEntry(existingId) {
  if (aiCatState.saving) return;
  const g   = id => document.getElementById(id);
  const name = g('aitc-cat-name')?.value.trim();
  if (!name) {
    const err = g('aitc-modal-err');
    if (err) { err.textContent = 'Name is required.'; err.style.display = 'block'; }
    return;
  }
  const csv = v => (v || '').split(',').map(s => s.trim()).filter(Boolean);
  const row = {
    name,
    vendor:   g('aitc-cat-vendor')?.value.trim()   || null,
    category: g('aitc-cat-category')?.value.trim() || 'Foundation LLM',
    default_approval_status: g('aitc-cat-status')?.value || 'under_review',
    data_in_scope: csv(g('aitc-cat-scope')?.value),
    eu_ai_act:     g('aitc-cat-euai')?.value.trim() || null,
    nist_controls: csv(g('aitc-cat-nist')?.value),
    iso42001:      csv(g('aitc-cat-iso')?.value),
    has_dlp:  !!g('aitc-cat-dlp')?.checked,
    has_sso:  !!g('aitc-cat-sso')?.checked,
    has_logs: !!g('aitc-cat-logs')?.checked,
    has_dpa:  !!g('aitc-cat-dpa')?.checked,
    has_soc2: !!g('aitc-cat-soc2')?.checked,
    is_seeded: false,
  };
  if (existingId) row.id = existingId;
  aiCatState.saving = true;
  try {
    const result = await sb.aiCatalog.upsert(row);
    const saved  = Array.isArray(result) ? result[0] : result;
    const idx = aiCatState.tools.findIndex(t => t.id === saved?.id);
    if (idx >= 0) aiCatState.tools[idx] = saved;
    else if (saved) aiCatState.tools.push(saved);
    aiCatState.modal = null;
    toast(existingId ? 'Catalog entry updated.' : 'Catalog entry added.');
    aitcRefresh();
  } catch (e) {
    const err = g('aitc-modal-err');
    if (err) { err.textContent = e.message; err.style.display = 'block'; }
  } finally {
    aiCatState.saving = false;
  }
}

async function aitcDeleteCatalogEntry(id) {
  const tool = aitcById(id);
  if (!tool) return;
  if (tool.is_seeded) { toast('Seeded catalog entries cannot be deleted.', '#dc2626'); return; }
  if (!confirm(`Delete "${tool.name}" from the catalog? This cannot be undone.`)) return;
  try {
    await sb.aiCatalog.delete(id);
    aiCatState.tools = aiCatState.tools.filter(t => t.id !== id);
    toast('Catalog entry deleted.');
    aitcRefresh();
  } catch (e) {
    toast('Delete failed: ' + e.message, '#dc2626');
  }
}

// ── CREATE RISK FROM TOOL ─────────────────────────────────────────────────────────
// Pre-fills the AI Risk Register "Add Risk" form with data from an org tool entry
// and navigates to the AI Risk Register module.

function aitcCreateRiskFromTool(orgToolId) {
  const ot = aiCatState.orgTools.find(t => t.id === orgToolId);
  if (!ot) return;

  const name     = aitcOrgToolName(ot);
  const vendor   = aitcOrgToolVendor(ot);
  const category = aitcOrgToolCategory(ot);
  const scope    = aitcOrgToolScope(ot);

  // Map tool category to risk category
  const riskCategoryMap = {
    'Foundation LLM':      'Model Access & Supply Chain',
    'AI Agent':            'Agentic AI & Automation',
    'AI Assistant':        'Data Exposure & Privacy',
    'Browser Extension':   'Data Exposure & Privacy',
    'Code Assistant':      'Intellectual Property & Confidentiality',
    'Image Generator':     'Intellectual Property & Confidentiality',
    'Productivity AI':     'AI Tool Usage & Shadow IT',
    'Collaboration AI':    'AI Tool Usage & Shadow IT',
  };
  const riskCategory = riskCategoryMap[category] || 'AI Tool Usage & Shadow IT';

  // Pick the highest-sensitivity data class present in scope
  const sensOrder = ['Medical','Financial','PII','Customer Data','HR Data','Confidential','Internal','Text','Documents','Code','Public'];
  const dataClass  = scope.find(s => sensOrder.includes(s)) || scope[0] || null;

  // Pre-fill aiRRState form — aiRRState must exist (ai_risk_register.js loaded)
  if (typeof aiRRState === 'undefined') {
    toast('Navigate to AI Risk Register first to initialise the module.', '#dc2626');
    return;
  }

  aiRRState.view    = 'form';
  aiRRState.editId  = null;
  aiRRState.form    = {
    category:           riskCategory,
    ai_tool_catalog_id: ot.tool_catalog_id || null,
    ai_system_custom:   ot.is_custom ? name : null,
    vendor:             vendor !== '—' ? vendor : null,
    data_classification: dataClass,
    human_in_loop:      false,
    likelihood:         'Medium',
    impact:             'Medium',
    rating:             'Medium',
    status:             'Open',
    nist_controls:      [],
    iso_controls:       [],
    notes:              `Auto-created from AI Application Inventory — ${name}${ot.org_status === 'shadow_it' ? ' (Shadow IT)' : ''}`,
    source:             'manual',
  };

  // Navigate — setNav will load the risk register and render the pre-filled form
  if (typeof setNav === 'function') setNav('ai_risk_register');
}

// ── SUBMISSION LINKS (gov10) ─────────────────────────────────────────────────────

async function aitcOpenLinks() {
  aitcLinksState.open    = true;
  aitcLinksState.loading = true;
  aitcRefresh();
  try {
    const [toks, pending] = await Promise.all([
      sb.submissionTokens.getForOrg(currentOrg.id, 'ai_tool_catalog'),
      sb.pendingSubmissions.getForOrg(currentOrg.id, 'ai_tool_catalog'),
    ]);
    aitcLinksState.tokens  = Array.isArray(toks)    ? toks    : [];
    aitcLinksState.pending = Array.isArray(pending) ? pending : [];
  } catch (e) {
    toast('Failed to load submission links: ' + e.message, '#dc2626');
  }
  aitcLinksState.loading = false;
  aitcRefresh();
}

function aitcCloseLinks() {
  aitcLinksState.open     = false;
  aitcLinksState.rejectId = null;
  aitcRefresh();
}

function aitcLinksTab(tab) {
  aitcLinksState.tab = tab;
  aitcRefresh();
}

async function aitcGenerateLink() {
  if (aitcLinksState.generating) return;
  const label     = document.getElementById('aitc-link-label')?.value.trim() || null;
  const duration  = document.getElementById('aitc-link-duration')?.value || '7d';
  const hours     = { '24h': 24, '7d': 168, '30d': 720 }[duration] || 168;
  const expiresAt = new Date(Date.now() + hours * 3600 * 1000).toISOString();
  aitcLinksState.generating = true;
  aitcRefresh();
  try {
    const row = {
      org_id:     currentOrg.id,
      module:     'ai_tool_catalog',
      label,
      created_by: authState.profile?.name || authState.profile?.email || null,
      expires_at: expiresAt,
    };
    const result = await sb.submissionTokens.create(row);
    const newTok = Array.isArray(result) ? result[0] : result;
    if (newTok) aitcLinksState.tokens.unshift(newTok);
    auditLog('submission_link_created', 'submission_token', label || 'AI Tool Catalog link', { org_id: currentOrg.id });
    toast('Submission link created', '#15803d');
  } catch (e) {
    toast('Failed to create link: ' + e.message, '#dc2626');
  }
  aitcLinksState.generating = false;
  aitcRefresh();
}

async function aitcRevokeToken(id) {
  if (!confirm('Revoke this link? Anyone with the URL will no longer be able to submit.')) return;
  try {
    await sb.submissionTokens.revoke(id);
    const tok = aitcLinksState.tokens.find(t => t.id === id);
    if (tok) tok.revoked = true;
    auditLog('submission_link_revoked', 'submission_token', id, { org_id: currentOrg.id });
    toast('Link revoked', '#b45309');
    aitcRefresh();
  } catch (e) {
    toast('Revoke failed: ' + e.message, '#dc2626');
  }
}

async function aitcDeleteToken(id) {
  if (!confirm('Delete this link? All pending submissions through it will also be deleted.')) return;
  try {
    await sb.submissionTokens.delete(id);
    aitcLinksState.tokens  = aitcLinksState.tokens.filter(t => t.id !== id);
    aitcLinksState.pending = aitcLinksState.pending.filter(p => p.token_id !== id);
    toast('Link deleted', '#5a6a8a');
    aitcRefresh();
  } catch (e) {
    toast('Delete failed: ' + e.message, '#dc2626');
  }
}

function aitcCopyLink(id) {
  const inp = document.getElementById(`aitc-tok-url-${id}`);
  if (!inp) return;
  const copy = () => { inp.select(); document.execCommand('copy'); toast('Link copied!', '#15803d'); };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(inp.value).then(() => toast('Link copied!', '#15803d')).catch(copy);
  } else { copy(); }
}

async function aitcApproveSubmission(id) {
  const sub = aitcLinksState.pending.find(p => p.id === id);
  if (!sub) return;
  try {
    const payload = sub.payload || {};
    const toolRow = {
      org_id:            sub.org_id,
      tool_catalog_id:   payload.catalog_tool_id || null,
      is_custom:         !payload.catalog_tool_id,
      custom_name:       payload.catalog_tool_id ? null : (payload.tool_name || 'Unknown Tool'),
      custom_vendor:     payload.vendor || null,
      custom_data_scope: Array.isArray(payload.data_classification) && payload.data_classification.length ? payload.data_classification : null,
      org_status:        'shadow_it',
      department:        payload.department || null,
      notes:             [payload.purpose, payload.website ? 'URL: ' + payload.website : '', `Submitted by ${sub.submitter_name || 'Unknown'}${sub.submitter_email ? ' (' + sub.submitter_email + ')' : ''}`].filter(Boolean).join(' — ') || null,
      added_by:          sub.submitter_name || 'Submission Portal',
    };
    await sb.aiOrgTools.add(toolRow);
    const patch = { status: 'approved', reviewed_by: authState.profile?.name || authState.profile?.email || null, reviewed_at: new Date().toISOString() };
    await sb.pendingSubmissions.updateStatus(id, patch);
    Object.assign(sub, patch);
    if (aiCatState.orgId === sub.org_id) {
      const rows = await sb.aiOrgTools.getForOrg(sub.org_id);
      if (Array.isArray(rows)) aiCatState.orgTools = rows;
    }
    auditLog('submission_approved', 'ai_tool_catalog', payload.tool_name, { org_id: sub.org_id });
    toast('Approved — tool added as Shadow IT', '#15803d');
    aitcRefresh();
  } catch (e) {
    toast('Approval failed: ' + e.message, '#dc2626');
  }
}

function aitcStartReject(id) {
  aitcLinksState.rejectId = id;
  aitcRefresh();
}

function aitcCancelReject() {
  aitcLinksState.rejectId = null;
  aitcRefresh();
}

async function aitcConfirmReject(id) {
  const sub = aitcLinksState.pending.find(p => p.id === id);
  if (!sub) return;
  const note = document.getElementById('aitc-reject-note')?.value.trim() || null;
  try {
    const patch = {
      status:       'rejected',
      reviewed_by:  authState.profile?.name || authState.profile?.email || null,
      reviewed_at:  new Date().toISOString(),
      review_notes: note,
    };
    await sb.pendingSubmissions.updateStatus(id, patch);
    Object.assign(sub, patch);
    aitcLinksState.rejectId = null;
    auditLog('submission_rejected', 'ai_tool_catalog', sub.payload?.tool_name || '', { org_id: sub.org_id });
    toast('Submission rejected', '#b45309');
    aitcRefresh();
  } catch (e) {
    toast('Reject failed: ' + e.message, '#dc2626');
  }
}

function _aitcLinksModal() {
  const { tab, tokens, pending, loading, generating, rejectId } = aitcLinksState;
  const now          = new Date();
  const pendingCount = pending.filter(p => p.status === 'pending').length;
  const _tokUrl = (tok) => window.location.href.split('?')[0] + '?submit=' + tok.token;
  const _tokSt  = (tok) => {
    if (tok.revoked)                    return { label:'Revoked', col:'#b91c1c', bg:'#fee2e2' };
    if (new Date(tok.expires_at) < now) return { label:'Expired', col:'#6b7280', bg:'#f3f4f6' };
    return { label:'Active', col:'#15803d', bg:'#dcfce7' };
  };
  const _fmtD = (iso) => iso ? new Date(iso).toLocaleDateString('en-CA', { month:'short', day:'numeric', year:'numeric' }) : '—';
  const _esc  = (s) => !s ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  let body = '';
  if (loading) {
    body = `<div style="text-align:center;padding:2rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,.2);border-top-color:var(--navy);width:20px;height:20px;margin:0 auto .75rem"></div>
      <div style="font-size:12px">Loading…</div></div>`;

  } else if (tab === 'links') {
    const tokenRows = tokens.length === 0
      ? `<div style="text-align:center;padding:1.5rem;color:var(--muted);font-size:12px">No links yet.</div>`
      : tokens.map(tok => {
          const st     = _tokSt(tok);
          const isLive = !tok.revoked && new Date(tok.expires_at) >= now;
          return `<div style="border:1px solid var(--border);border-radius:9px;padding:.85rem 1rem;margin-bottom:.6rem">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:.5rem">
              <span style="font-size:13px;font-weight:700;color:var(--text)">${_esc(tok.label || '(no label)')}</span>
              <div style="display:flex;align-items:center;gap:6px">
                <span style="font-size:10px;font-weight:700;padding:1px 8px;border-radius:20px;background:${st.bg};color:${st.col}">${st.label}</span>
                <span style="font-size:11px;color:var(--muted)">Expires ${_fmtD(tok.expires_at)}</span>
              </div>
            </div>
            <div style="display:flex;gap:6px;align-items:center">
              <input readonly value="${_esc(_tokUrl(tok))}" id="aitc-tok-url-${tok.id}"
                style="flex:1;font-size:11px;padding:5px 8px;border:1px solid var(--border);border-radius:6px;color:var(--muted);background:var(--bg);font-family:monospace;min-width:0;box-sizing:border-box"
                onclick="this.select()">
              <button class="btn btn-outline btn-sm" onclick="aitcCopyLink('${tok.id}')" style="flex-shrink:0">📋 Copy</button>
              ${isLive  ? `<button class="btn btn-outline btn-sm" style="color:#b91c1c;border-color:#b91c1c;flex-shrink:0" onclick="aitcRevokeToken('${tok.id}')">Revoke</button>` : ''}
              ${!isLive ? `<button class="btn btn-outline btn-sm" style="color:var(--muted);flex-shrink:0" onclick="aitcDeleteToken('${tok.id}')">Delete</button>` : ''}
            </div>
            ${tok.created_by ? `<div style="font-size:10px;color:var(--muted);margin-top:.3rem">Created by ${_esc(tok.created_by)}</div>` : ''}
          </div>`;
        }).join('');

    body = `
      <div style="background:var(--bg);border-radius:9px;padding:1rem;margin-bottom:1rem">
        <div style="display:grid;grid-template-columns:1fr 140px auto;gap:8px;align-items:end;margin-bottom:.6rem">
          <div>
            <label style="display:block;font-size:10px;font-weight:700;color:var(--text);margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Label (optional)</label>
            <input id="aitc-link-label" placeholder="e.g. IT Survey Q3 2026"
              style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;box-sizing:border-box;font-family:inherit">
          </div>
          <div>
            <label style="display:block;font-size:10px;font-weight:700;color:var(--text);margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Expires In</label>
            <select id="aitc-link-duration" style="width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:7px;font-size:13px;box-sizing:border-box;font-family:inherit">
              <option value="24h">24 hours</option>
              <option value="7d" selected>7 days</option>
              <option value="30d">30 days</option>
            </select>
          </div>
          <button class="btn btn-cyan btn-sm" onclick="aitcGenerateLink()" ${generating ? 'disabled' : ''} style="align-self:end">
            ${generating ? 'Generating…' : 'Generate Link'}
          </button>
        </div>
        <div style="font-size:11px;color:var(--muted)">Anyone with the URL can submit an AI tool for your review without logging in.</div>
      </div>
      ${tokenRows}`;

  } else {
    const pendingRows = pending.length === 0
      ? `<div style="text-align:center;padding:1.5rem;color:var(--muted);font-size:12px">No submissions yet.</div>`
      : pending.map(sub => {
          const p  = sub.payload || {};
          const dc = Array.isArray(p.data_classification) ? p.data_classification : [];
          const sCol = { pending:'#b45309', approved:'#15803d', rejected:'#b91c1c' }[sub.status] || '#374151';
          const sBg  = { pending:'#fef3c7', approved:'#dcfce7', rejected:'#fee2e2' }[sub.status] || '#f3f4f6';
          const toolDisplay = p.is_catalog_pick ? _esc(p.tool_name || '—') : _esc(p.tool_name || '—');
          const actions = sub.status === 'pending'
            ? `<div style="display:flex;gap:6px;margin-top:.6rem">
                <button class="btn btn-sm" style="background:#15803d;color:#fff;border:none;flex:1" onclick="aitcApproveSubmission('${sub.id}')">✓ Approve</button>
                <button class="btn btn-outline btn-sm" style="color:#b91c1c;border-color:#b91c1c;flex:1" onclick="aitcStartReject('${sub.id}')">✕ Reject</button>
              </div>` : '';
          const rejectForm = rejectId === sub.id
            ? `<div style="margin-top:.6rem;padding:.7rem;background:#fff5f5;border:1px solid #fecaca;border-radius:7px">
                <label style="display:block;font-size:11px;font-weight:700;color:#b91c1c;margin-bottom:4px">Rejection reason (optional)</label>
                <textarea id="aitc-reject-note" rows="2" style="width:100%;padding:6px 8px;border:1px solid #fecaca;border-radius:6px;font-size:12px;box-sizing:border-box;resize:vertical;font-family:inherit"></textarea>
                <div style="display:flex;gap:6px;margin-top:.4rem">
                  <button class="btn btn-sm" style="background:#b91c1c;color:#fff;border:none;flex:1" onclick="aitcConfirmReject('${sub.id}')">Confirm Reject</button>
                  <button class="btn btn-outline btn-sm" style="flex:1" onclick="aitcCancelReject()">Cancel</button>
                </div>
              </div>` : '';

          return `<div style="border:1px solid var(--border);border-radius:9px;padding:.85rem 1rem;margin-bottom:.6rem">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:.4rem">
              <div>
                <span style="font-size:13px;font-weight:700;color:var(--text)">${toolDisplay}</span>
                ${p.vendor ? `<span style="font-size:11px;color:var(--muted);margin-left:6px">${_esc(p.vendor)}</span>` : ''}
                ${p.department ? `<span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:9px;background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;margin-left:6px">${_esc(p.department)}</span>` : ''}
                ${p.is_catalog_pick ? `<span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:9px;background:#dbeafe;color:#1e40af;border:1px solid #bfdbfe;margin-left:4px">Catalog</span>` : ''}
              </div>
              <span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:20px;background:${sBg};color:${sCol}">${sub.status.charAt(0).toUpperCase()+sub.status.slice(1)}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:.35rem">
              <strong>${_esc(sub.submitter_name || 'Unknown')}</strong>${sub.submitter_email ? ` · ${_esc(sub.submitter_email)}` : ''} · ${_fmtD(sub.created_at)}
            </div>
            ${p.purpose ? `<div style="font-size:12px;color:var(--text);line-height:1.5;margin-bottom:.35rem">${_esc(p.purpose)}</div>` : ''}
            ${dc.length > 0 ? `<div style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:.3rem">${dc.map(d => `<span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:9px;background:#ede9fe;color:#6d28d9;border:1px solid #ddd6fe">${_esc(d)}</span>`).join('')}</div>` : ''}
            ${p.website ? `<div style="font-size:11px;color:var(--muted)">URL: ${_esc(p.website)}</div>` : ''}
            ${sub.status === 'rejected' && sub.review_notes ? `<div style="font-size:11px;color:#b91c1c;margin-top:.3rem;font-style:italic">Rejected: ${_esc(sub.review_notes)}</div>` : ''}
            ${actions}
            ${rejectForm}
          </div>`;
        }).join('');

    body = pendingRows;
  }

  return `<div class="modal-backdrop" onclick="if(event.target===this)aitcCloseLinks()" style="display:flex">
    <div class="modal-box" style="max-width:660px;width:94%;max-height:88vh;overflow-y:auto">
      <div class="modal-header">
        <span>🔗 Submission Links — AI Tool Catalog</span>
        <button class="modal-close" onclick="aitcCloseLinks()">✕</button>
      </div>
      <div class="view-tabs" style="margin:0;padding:0 1.25rem;border-bottom:1px solid var(--border)">
        <button class="view-tab${tab === 'links'   ? ' active' : ''}" onclick="aitcLinksTab('links')">Active Links</button>
        <button class="view-tab${tab === 'pending' ? ' active' : ''}" onclick="aitcLinksTab('pending')">
          Pending Review${pendingCount > 0 ? ` <span style="display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;background:#ef4444;color:#fff;border-radius:50%;font-size:10px;font-weight:700;padding:0 3px">${pendingCount}</span>` : ''}
        </button>
      </div>
      <div class="modal-body" style="padding-top:1rem">${body}</div>
    </div>
  </div>`;
}

// ── REFRESH ───────────────────────────────────────────────────────────────────────

function aitcRefresh() {
  const el = document.getElementById('mainContent');
  if (el && activeNav === 'ai_tool_catalog') el.innerHTML = renderAiToolCatalog();
}

// ── EXPOSE GLOBALS ────────────────────────────────────────────────────────────────

window.renderAiToolCatalog        = renderAiToolCatalog;
window.loadAiToolCatalog          = loadAiToolCatalog;
window.loadAiOrgTools             = loadAiOrgTools;
window.loadAiInventory            = loadAiInventory;
window.aitcSetTab                 = aitcSetTab;
window.aitcSetMyTab               = aitcSetMyTab;
window.aitcToggleAdmin            = aitcToggleAdmin;
window.aitcCloseModal             = aitcCloseModal;
window.aitcCatalogSearch          = aitcCatalogSearch;
window.aitcOpenAddFromCatalog     = aitcOpenAddFromCatalog;
window.aitcOpenAddFromCatalogEntry= aitcOpenAddFromCatalogEntry;
window.aitcOpenAddCustom          = aitcOpenAddCustom;
window.aitcEditOrgTool            = aitcEditOrgTool;
window.aitcRemoveOrgTool          = aitcRemoveOrgTool;
window.aitcOpenAddCatalogEntry    = aitcOpenAddCatalogEntry;
window.aitcOpenEditCatalogEntry   = aitcOpenEditCatalogEntry;
window.aitcSaveAddFromCatalog     = aitcSaveAddFromCatalog;
window.aitcSaveAddCustom          = aitcSaveAddCustom;
window.aitcSaveEditOrgTool        = aitcSaveEditOrgTool;
window.aitcSaveCatalogEntry       = aitcSaveCatalogEntry;
window.aitcDeleteCatalogEntry     = aitcDeleteCatalogEntry;
window.aitcById                   = aitcById;
window.aitcForDropdown            = aitcForDropdown;
window.aitcCreateRiskFromTool     = aitcCreateRiskFromTool;
window.aitcLoadAppList            = aitcLoadAppList;
window.aitcRefreshLinkedApp       = aitcRefreshLinkedApp;
window.aitcOpenLinks              = aitcOpenLinks;
window.aitcCloseLinks             = aitcCloseLinks;
window.aitcLinksTab               = aitcLinksTab;
window.aitcGenerateLink           = aitcGenerateLink;
window.aitcRevokeToken            = aitcRevokeToken;
window.aitcDeleteToken            = aitcDeleteToken;
window.aitcCopyLink               = aitcCopyLink;
window.aitcApproveSubmission      = aitcApproveSubmission;
window.aitcStartReject            = aitcStartReject;
window.aitcCancelReject           = aitcCancelReject;
window.aitcConfirmReject          = aitcConfirmReject;
