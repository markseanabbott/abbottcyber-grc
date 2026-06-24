// ============================================================
// MODULE MANAGEMENT (modules.js)
// Admin page for sellable feature packages, page assignments,
// and per-user module grants. Platform admin only.
// ============================================================

// ── MODULE ACCESS (used everywhere, loaded at boot) ───────────

const modAccess = {
  pageMap: {},      // { page_key: module_id }
  grants:  new Set(), // module_ids the active user has been granted
};

async function modAccessLoad() {
  try {
    const rows = await sbFetch('page_module_map', 'GET') || [];
    modAccess.pageMap = Object.fromEntries(rows.map(r => [r.page_key, r.module_id || '']));
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

function hasPageAccess(pageKey) {
  // Platform admin always sees everything (real role, not view-as)
  if (authState?.profile?.role === 'platform_admin') return true;
  const moduleId = modAccess.pageMap[pageKey];
  if (!moduleId) return true;  // no module assigned = always visible
  return modAccess.grants.has(moduleId);
}

// ── ADMIN UI STATE (lazy-loaded when navigating to the admin page) ──

let modState = {
  modules: [],   // rows from modules table
  pageMap: {},   // { page_key: module_id | '' }
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
    modState.pageMap = Object.fromEntries(mapRows.map(r => [r.page_key, r.module_id || '']));
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

function modSetPageMap(pageKey, moduleId) {
  modState.pageMap[pageKey] = moduleId || '';
}

// All nav pages except Settings (always admin-gated at a higher level)
function modGetPages() {
  const pages = [];
  (typeof NAV !== 'undefined' ? NAV : []).forEach(g => {
    if (g.id === 'g_settings') return;
    g.items.forEach(item => {
      pages.push({ group: g.group, id: item.id, label: item.label });
    });
  });
  return pages;
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
  const pages    = modGetPages();
  const actMods  = modState.modules.filter(m => m.is_active);

  const rows = pages.map(p => {
    const cur  = modState.pageMap[p.id] || '';
    const opts = `<option value="">— Unassigned (always visible) —</option>` +
      actMods.map(m =>
        `<option value="${m.id}"${cur === m.id ? ' selected' : ''}>${escH(m.name)}</option>`
      ).join('');
    return `<tr>
      <td style="padding:8px 14px;font-size:11px;color:var(--muted);white-space:nowrap">${escH(p.group)}</td>
      <td style="padding:8px 14px;font-size:13px;font-weight:600">${escH(p.label)}</td>
      <td style="padding:8px 14px;min-width:220px">
        <select style="font-size:12px;padding:5px 8px;border:1px solid var(--border);border-radius:6px;width:100%;background:#fff"
          onchange="modSetPageMap('${p.id}',this.value)">${opts}</select>
      </td>
    </tr>`;
  }).join('');

  return `
  <div class="card" style="padding:0;overflow:hidden;margin-bottom:1rem">
    <div style="padding:.65rem 1.25rem;background:var(--bg);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px">
      <span style="font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.06em">Page → Module Assignment</span>
      <span style="font-size:11px;color:var(--muted)">Pages with no module assigned are always visible to all users</span>
    </div>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:var(--bg)">
        <th style="padding:8px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--border);width:130px">Section</th>
        <th style="padding:8px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--border)">Page</th>
        <th style="padding:8px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--border)">Module</th>
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
    <div class="modal-title">${id ? 'Edit Module' : 'Add Module'}</div>
    <div style="display:flex;flex-direction:column;gap:.75rem;margin-top:1rem">
      <div>
        <label class="form-label">Module Name <span style="color:#dc2626">*</span></label>
        <input id="modFldName" type="text" value="${escH(m?.name||'')}" placeholder="e.g. AI Readiness"/>
      </div>
      <div>
        <label class="form-label">Description</label>
        <textarea id="modFldDesc" rows="2" style="resize:vertical">${escH(m?.description||'')}</textarea>
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
  const pages    = modGetPages();
  const toUpsert = [];
  const toDel    = [];

  pages.forEach(p => {
    const mid = modState.pageMap[p.id];
    if (mid) toUpsert.push({ page_key: p.id, module_id: mid });
    else      toDel.push(p.id);
  });

  try {
    if (toUpsert.length) {
      await sbFetch('page_module_map', 'POST', toUpsert,
        { 'Prefer': 'resolution=merge-duplicates' });
    }
    if (toDel.length) {
      await sbFetch(`page_module_map?page_key=in.(${toDel.join(',')})`, 'DELETE');
    }
    toast('✓ Page access saved', '#15803d');
  } catch(e) {
    toast('Error saving page access', '#dc2626');
    console.error(e);
  }
}
