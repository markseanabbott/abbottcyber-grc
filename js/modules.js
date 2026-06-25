// ============================================================
// MODULE MANAGEMENT (modules.js)
// Admin page for sellable feature packages, page assignments,
// and per-user module grants. Platform admin only.
// ============================================================

// ── MODULE ACCESS (used everywhere, loaded at boot) ───────────

const modAccess = {
  pageMap: {},      // { page_key: Set<module_id> } — many-to-many
  grants:  new Set(), // module_ids the active user has been granted
};

async function modAccessLoad() {
  try {
    const rows = await sbFetch('page_module_map', 'GET') || [];
    modAccess.pageMap = {};
    rows.forEach(r => {
      if (!modAccess.pageMap[r.page_key]) modAccess.pageMap[r.page_key] = new Set();
      modAccess.pageMap[r.page_key].add(r.module_id);
    });
  } catch(e) { console.warn('modAccess pageMap load error', e); }
  await modAccessLoadGrants();
}

async function modAccessLoadGrants() {
  const userId = viewAsState?.id ?? authState?.profile?.id;
  modAccess.grants = new Set();
  if (!userId) return;
  try {
    const rows = await sbFetch(`user_module_access?user_id=eq.${userId}&select=module_id`, 'GET') || [];
    modAccess.grants = new Set(rows.map(r => r.module_id));
  } catch(e) { console.warn('modAccess grants load error', e); }
}

// Hub pages are navigation containers — accessible if the user can reach any sub-page inside.
const _HUB_SUBPAGES = {
  assessments: ['insurance','cis','techstack','tpra','cmmc','cmmc2','ai_readiness','nist_ai','iso42001','ai_unified','rapid_pyramid'],
  governance:  ['riskregister','ai_risk_register','ai_tool_catalog','policy_lib','app_inv','vendor_dir'],
  exercises:   ['tabletop','tt_ai'],
};

function _hasGrantForPage(pageKey) {
  const ids = modAccess.pageMap[pageKey];
  if (!ids || !ids.size) return false;
  for (const mid of ids) { if (modAccess.grants.has(mid)) return true; }
  return false;
}

function hasPageAccess(pageKey) {
  // Platform admin always sees everything — but only when NOT in view-as mode,
  // so "View As" accurately reflects what the impersonated user actually sees.
  if (!viewAsState && authState?.profile?.role === 'platform_admin') return true;
  // If impersonating a platform_admin, they see everything too.
  if (viewAsState?.role === 'platform_admin') return true;

  // Pages not in PAGE_REGISTRY (Settings, admin tools) are gated by adminOnly /
  // platformAdminOnly flags only — module system does not apply to them.
  if (!PAGE_REGISTRY.some(p => p.id === pageKey)) return true;

  // User has no module grants → no restrictions apply (unrestricted accounts)
  if (modAccess.grants.size === 0) return true;

  // Hub pages: show if the user can access any sub-page within that section.
  // This ensures a user with only AI Governance grants still sees the Assessments,
  // Governance and Exercises hubs (where AI pages live), without needing a separate
  // AI Governance nav section.
  const hubSubs = _HUB_SUBPAGES[pageKey];
  if (hubSubs) return hubSubs.some(_hasGrantForPage);

  // User has grants → whitelist mode: they can ONLY access pages in their granted modules.
  // A page with no module assigned is blocked for grant-restricted users.
  return _hasGrantForPage(pageKey);
}

// ── ADMIN UI STATE (lazy-loaded when navigating to the admin page) ──

let modState = {
  modules: [],   // rows from modules table
  pageMap: {},   // { page_key: { [module_id]: boolean } } — many-to-many
  tab:     'modules',
  loading: false,
  editId:  null, // null = new, uuid = editing existing
};

// ── LOAD ─────────────────────────────────────────────────────

async function modLoad() {
  modState.loading = true;
  try {
    let mods = await sbFetch('modules?order=sort_order.asc,name.asc', 'GET') || [];

    // Seed "AI Readiness" if table is empty on first use
    if (!mods.length) {
      await sbFetch('modules', 'POST', {
        name:         'AI Readiness',
        description:  'NIST AI RMF v1.0 and ISO/IEC 42001 assessments, AI Governance tabletop exercise',
        monthly_cost: 0,
        is_active:    true,
        sort_order:   10,
      });
      mods = await sbFetch('modules?order=sort_order.asc,name.asc', 'GET') || [];
    }

    modState.modules = mods;

    const mapRows = await sbFetch('page_module_map', 'GET') || [];
    modState.pageMap = {};
    mapRows.forEach(r => {
      if (!modState.pageMap[r.page_key]) modState.pageMap[r.page_key] = {};
      modState.pageMap[r.page_key][r.module_id] = true;
    });
  } catch(e) {
    console.error('modLoad error', e);
  }
  modState.loading = false;
}

// ── HELPERS ───────────────────────────────────────────────────

function modSetTab(tab) {
  modState.tab = tab;
  document.getElementById('mainContent').innerHTML = renderModulesAdmin();
}

function modTogglePageMap(pageKey, moduleId, checked) {
  if (!modState.pageMap[pageKey]) modState.pageMap[pageKey] = {};
  modState.pageMap[pageKey][moduleId] = checked;
}

// All routable pages available for module gating.
// Settings pages are excluded — always platform-admin-gated at a higher level.
const PAGE_REGISTRY = [
  // Home
  { group: 'Home',          id: 'home',           label: 'Dashboard' },
  { group: 'Home',          id: 'rapid_pyramid',   label: 'Rapid Pre-Assessment' },
  // Assessments
  { group: 'Assessments',   id: 'assessments',     label: 'Assessments Hub' },
  { group: 'Assessments',   id: 'insurance',       label: 'Insurance Readiness' },
  { group: 'Assessments',   id: 'cis',             label: 'CIS Controls v8' },
  { group: 'Assessments',   id: 'techstack',       label: 'Technology Stack Survey' },
  { group: 'Assessments',   id: 'tpra',            label: 'Vendor Risk Assessment (TPRA)' },
  { group: 'Assessments',   id: 'cmmc',            label: 'CMMC Assessment' },
  { group: 'Assessments',   id: 'cmmc2',           label: 'CMMC 2.0 Assessment' },
  // AI Readiness
  { group: 'AI Readiness',  id: 'ai_readiness',    label: 'AI Readiness Hub' },
  { group: 'AI Readiness',  id: 'nist_ai',         label: 'NIST AI RMF v1.0' },
  { group: 'AI Readiness',  id: 'iso42001',        label: 'ISO/IEC 42001' },
  { group: 'AI Readiness',  id: 'ai_unified',      label: 'AI Unified Assessment' },
  // Governance
  { group: 'Governance',    id: 'governance',      label: 'Governance Hub' },
  { group: 'Governance',    id: 'riskregister',    label: 'Risk Register' },
  { group: 'Governance',    id: 'ai_risk_register', label: 'AI Risk Register' },
  { group: 'Governance',    id: 'ai_tool_catalog',  label: 'AI Application Inventory' },
  { group: 'Governance',    id: 'policy_lib',       label: 'Policy Library' },
  { group: 'Governance',    id: 'app_inv',          label: 'Application Inventory' },
  { group: 'Governance',    id: 'vendor_dir',       label: 'Vendor Directory' },
  // Exercises
  { group: 'Exercises',     id: 'exercises',       label: 'Exercises Hub' },
  { group: 'Exercises',     id: 'tabletop',        label: 'Cybersecurity Tabletop' },
  { group: 'Exercises',     id: 'tt_ai',           label: 'AI Governance Tabletop' },
  // Reports
  { group: 'Reports',       id: 'gap_register',    label: 'Tool Gap Register' },
  // M&A
  { group: 'M&A',           id: 'ma_cdd',          label: 'M&A Due Diligence' },
];

function modGetPages() {
  return PAGE_REGISTRY;
}

// ── RENDER ───────────────────────────────────────────────────

function renderModulesAdmin() {
  if (modState.loading) {
    return `<div style="text-align:center;padding:3rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,0.2);border-top-color:var(--navy);width:24px;height:24px;margin:0 auto 1rem"></div>
      <div style="font-size:13px">Loading modules…</div>
    </div>`;
  }

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📦 Module Management</div>
      <div style="font-size:12px;color:var(--muted)">Manage sellable feature packages and control which pages each module unlocks</div>
    </div>
    ${modState.tab === 'modules' ? `<button class="btn btn-cyan btn-sm" onclick="modOpenModal(null)">+ Add Module</button>` : ''}
  </div>
  <div class="view-tabs" style="margin-bottom:1rem">
    <button class="view-tab${modState.tab==='modules'?' active':''}" onclick="modSetTab('modules')">Modules</button>
    <button class="view-tab${modState.tab==='pages'?' active':''}" onclick="modSetTab('pages')">Page Access</button>
  </div>
  ${modState.tab === 'modules' ? _modRenderModulesTab() : _modRenderPageTab()}`;
}

function _modRenderModulesTab() {
  if (!modState.modules.length) {
    return `<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">No modules yet. Use "Add Module" above.</div>`;
  }

  const rows = modState.modules.map((m, i) => `
    <tr style="${i%2===1?'background:var(--bg)':''}">
      <td style="padding:10px 14px;font-size:13px;font-weight:700">${escH(m.name)}</td>
      <td style="padding:10px 14px;font-size:12px;color:var(--muted);max-width:320px">${escH(m.description||'—')}</td>
      <td style="padding:10px 14px;text-align:center;font-size:12px;white-space:nowrap">
        ${m.monthly_cost > 0
          ? '<strong>$' + parseFloat(m.monthly_cost).toFixed(2) + '</strong><span style="color:var(--muted)">/mo</span>'
          : '<span style="color:var(--muted)">Free</span>'}
      </td>
      <td style="padding:10px 14px;text-align:center">
        <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;
          background:${m.is_active?'#dcfce7':'#f1f5f9'};color:${m.is_active?'#15803d':'#64748b'}">
          ${m.is_active?'Active':'Inactive'}
        </span>
      </td>
      <td style="padding:10px 14px;text-align:right;white-space:nowrap">
        <button class="btn btn-outline btn-sm" onclick="modOpenModal('${m.id}')">Edit</button>
        <button class="btn btn-red btn-sm" style="margin-left:4px" onclick="modDelete('${m.id}')">Delete</button>
      </td>
    </tr>`).join('');

  return `<div class="card" style="padding:0;overflow:hidden">
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:var(--bg)">
        <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--border)">Module</th>
        <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--border)">Description</th>
        <th style="padding:10px 14px;text-align:center;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--border)">Cost</th>
        <th style="padding:10px 14px;text-align:center;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--border)">Status</th>
        <th style="border-bottom:1px solid var(--border)"></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function _modRenderPageTab() {
  const pages   = modGetPages();
  const actMods = modState.modules.filter(m => m.is_active);

  if (!actMods.length) {
    return `<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">
      No active modules yet. Add a module on the Modules tab first.
    </div>`;
  }

  // One column per active module
  const modCols = actMods.map(m =>
    `<th style="padding:8px 10px;text-align:center;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--border);white-space:nowrap;min-width:100px">${escH(m.name)}</th>`
  ).join('');

  let lastGroup = '';
  const rows = pages.map((p, i) => {
    const groupCell = p.group !== lastGroup
      ? `<td style="padding:8px 14px;font-size:11px;color:var(--muted);white-space:nowrap;vertical-align:middle" rowspan="${pages.filter(x => x.group === p.group).length}">${escH(p.group)}</td>`
      : '';
    if (p.group !== lastGroup) lastGroup = p.group;

    const checks = actMods.map(m => {
      const chk = !!(modState.pageMap[p.id]?.[m.id]);
      return `<td style="padding:8px 10px;text-align:center;border-left:1px solid var(--border)">
        <input type="checkbox" ${chk ? 'checked' : ''} onchange="modTogglePageMap('${p.id}','${m.id}',this.checked)">
      </td>`;
    }).join('');

    return `<tr style="${i%2===1?'background:var(--bg)':''}">
      ${groupCell}
      <td style="padding:8px 14px;font-size:13px;font-weight:600">${escH(p.label)}</td>
      ${checks}
    </tr>`;
  }).join('');

  return `
  <div style="font-size:12px;color:var(--muted);margin-bottom:.65rem">
    Check the modules each page belongs to. A page with no module checked is always visible to all users.
    A user gains access to a page if they hold <em>any</em> of its modules.
  </div>
  <div class="card" style="padding:0;overflow:auto;margin-bottom:1rem">
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:var(--bg)">
        <th style="padding:8px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--border);width:120px">Section</th>
        <th style="padding:8px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--border)">Page</th>
        ${modCols}
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <button class="btn btn-primary" onclick="modSavePageAccess()">Save Page Access</button>`;
}

// ── MODAL ─────────────────────────────────────────────────────

function modOpenModal(id) {
  modState.editId = id;
  const m = id ? modState.modules.find(x => x.id === id) : null;

  document.getElementById('modModalBox').innerHTML = `
    <div style="padding:1.5rem">
    <div class="modal-title">${id ? 'Edit Module' : 'Add Module'}</div>
    <div style="display:flex;flex-direction:column;gap:.75rem;margin-top:1rem">
      <div>
        <label class="form-label">Module Name <span style="color:#dc2626">*</span></label>
        <input id="modFldName" type="text" value="${escH(m?.name||'')}" placeholder="e.g. AI Readiness"/>
      </div>
      <div>
        <label class="form-label">Description</label>
        <textarea id="modFldDesc" rows="4" style="resize:vertical;min-height:80px">${escH(m?.description||'')}</textarea>
      </div>
      <div>
        <label class="form-label">Monthly Cost ($/mo)</label>
        <input id="modFldCost" type="number" min="0" step="0.01" value="${m ? parseFloat(m.monthly_cost).toFixed(2) : '0.00'}"/>
      </div>
      <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer;font-size:13px;font-weight:600">
        <input id="modFldActive" type="checkbox" ${(!m || m.is_active) ? 'checked' : ''}/>
        Active
      </label>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:1.25rem">
      <button class="btn btn-outline" onclick="modCloseModal()">Cancel</button>
      <button class="btn btn-primary" onclick="modSave()">Save Module</button>
    </div>
    </div>`;

  document.getElementById('modModal').style.display = 'flex';
  setTimeout(() => document.getElementById('modFldName')?.focus(), 50);
}

function modCloseModal() {
  document.getElementById('modModal').style.display = 'none';
}

// ── SAVE / DELETE ─────────────────────────────────────────────

async function modSave() {
  const name = document.getElementById('modFldName')?.value?.trim();
  if (!name) { toast('Module name is required', '#dc2626'); return; }

  const payload = {
    name,
    description:  document.getElementById('modFldDesc')?.value?.trim() || null,
    monthly_cost: parseFloat(document.getElementById('modFldCost')?.value||'0') || 0,
    is_active:    document.getElementById('modFldActive')?.checked ?? true,
  };

  try {
    if (modState.editId) {
      await sbFetch(`modules?id=eq.${modState.editId}`, 'PATCH', payload);
      toast('✓ Module updated', '#15803d');
    } else {
      await sbFetch('modules', 'POST', payload);
      toast('✓ Module added', '#15803d');
    }
    modCloseModal();
    await modLoad();
    document.getElementById('mainContent').innerHTML = renderModulesAdmin();
  } catch(e) {
    toast('Error saving module', '#dc2626');
    console.error(e);
  }
}

async function modDelete(id) {
  const access = await sbFetch(`user_module_access?module_id=eq.${id}&select=user_id`, 'GET') || [];
  const n = access.length;
  const msg = n > 0
    ? `${n} user${n!==1?'s have':' has'} access to this module. Deleting it will revoke their access. Continue?`
    : 'Delete this module? This cannot be undone.';
  if (!confirm(msg)) return;

  try {
    await sbFetch(`modules?id=eq.${id}`, 'DELETE');
    toast('✓ Module deleted', '#15803d');
    await modLoad();
    document.getElementById('mainContent').innerHTML = renderModulesAdmin();
  } catch(e) {
    toast('Error deleting module', '#dc2626');
    console.error(e);
  }
}

async function modSavePageAccess() {
  const pages = modGetPages();
  const pageKeys = pages.map(p => p.id);

  // Collect all desired (page_key, module_id) pairs
  const desired = [];
  pages.forEach(p => {
    const mods = modState.pageMap[p.id] || {};
    Object.entries(mods).forEach(([moduleId, checked]) => {
      if (checked) desired.push({ page_key: p.id, module_id: moduleId });
    });
  });

  try {
    // Delete all current assignments for known nav pages, then re-insert
    if (pageKeys.length) {
      await sbFetch(`page_module_map?page_key=in.(${pageKeys.join(',')})`, 'DELETE');
    }
    if (desired.length) {
      await sbFetch('page_module_map', 'POST', desired);
    }
    // Reload the boot-time cache so changes take effect immediately
    await modAccessLoad();
    toast('✓ Page access saved', '#15803d');
  } catch(e) {
    toast('Error saving page access', '#dc2626');
    console.error(e);
  }
}
