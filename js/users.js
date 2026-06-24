// ============================================================
// USER MANAGEMENT MODULE
// ============================================================
let userMgmtState = { users: [], loading: false, tab: 'users', auditDays: 30, auditLogs: [], auditLoading: false };
let _euActiveModules = []; // active modules loaded when Edit User modal opens

async function userMgmtLoad() {
  userMgmtState.loading = true;
  try {
    userMgmtState.users = await sb.users.getAll() || [];
  } catch (e) {
    console.warn('User load failed:', e);
    userMgmtState.users = [];
  }
  userMgmtState.loading = false;
}

function renderUserManagement() {
  if (!isAdmin()) return `<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">
    <div style="font-size:28px;margin-bottom:0.5rem">🔒</div>
    <div style="font-size:13px;font-weight:700">Admin access required</div>
  </div>`;

  if (userMgmtState.tab === 'audit') {
    auditTabLoad(userMgmtState.auditDays);
  } else {
    userMgmtLoad().then(() => {
      const el = document.getElementById('userMgmtContent');
      if (el) el.innerHTML = renderUserMgmtInner();
    });
  }

  return renderTierBanner() + `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <div>
      <div style="font-size:18px;font-weight:700;color:var(--navy)">User Management</div>
      <div style="font-size:12px;color:var(--muted);margin-top:2px">Manage platform accounts and org access</div>
    </div>
    ${userMgmtState.tab === 'users' ? '<button class="btn btn-primary btn-sm" onclick="openCreateUserModal()">+ Add User</button>' : ''}
  </div>
  <div class="view-tabs" style="margin-bottom:1rem">
    <div class="view-tab ${userMgmtState.tab === 'users' ? 'active' : ''}" onclick="switchUserTab('users')">Users</div>
    <div class="view-tab ${userMgmtState.tab === 'audit' ? 'active' : ''}" onclick="switchUserTab('audit')">Audit Log</div>
  </div>
  <div id="userMgmtContent">
    <div style="text-align:center;padding:2rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,0.15);border-top-color:var(--navy);width:20px;height:20px;margin:0 auto 0.75rem"></div>
      <div style="font-size:12px">Loading…</div>
    </div>
  </div>`;
}

function renderUserMgmtInner() {
  const users = userMgmtState.users;
  // Filter: org_admin sees only users in their visibility scope
  const visOrgIds = visibleOrgs().map(o => o.id);
  const filtered = isPlatformAdmin() ? users : users.filter(u => visOrgIds.includes(u.org_id));

  if (!filtered.length) return `<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">
    <div style="font-size:24px;margin-bottom:0.5rem">👥</div>
    <div style="font-size:13px;font-weight:700;margin-bottom:4px">No users yet</div>
    <div style="font-size:12px">Click <strong>Add User</strong> to create the first account.</div>
  </div>`;

  const roleColors = {
    platform_admin: 'background:#152168;color:#fff',
    org_admin: 'background:#4f46e5;color:#fff',
    analyst: 'background:#0e7490;color:#fff',
    viewer: 'background:#6b7280;color:#fff',
  };
  const roleLabels = {
    platform_admin: 'Platform Admin', org_admin: 'Org Admin',
    analyst: 'Analyst', viewer: 'View Only',
  };

  return `<div class="card" style="overflow:hidden;padding:0">
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:var(--bg)">
          <th style="padding:10px 14px;font-size:10px;font-weight:700;color:var(--muted);text-align:left;
            text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid var(--border)">Name</th>
          <th style="padding:10px 14px;font-size:10px;font-weight:700;color:var(--muted);text-align:left;
            text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid var(--border)">Email</th>
          <th style="padding:10px 14px;font-size:10px;font-weight:700;color:var(--muted);text-align:left;
            text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid var(--border)">Role</th>
          <th style="padding:10px 14px;font-size:10px;font-weight:700;color:var(--muted);text-align:left;
            text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid var(--border)">Organization</th>
          <th style="padding:10px 14px;font-size:10px;font-weight:700;color:var(--muted);text-align:left;
            text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid var(--border)">Auth</th>
          <th style="padding:10px 14px;border-bottom:1px solid var(--border)"></th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map((u, i) => {
          const org = allOrgs.find(o => o.id === u.org_id);
          const isMe = u.auth_id === authState.user?.id;
          return `<tr style="border-bottom:1px solid var(--border);${isMe ? 'background:#f0f9ff' : ''}">
            <td style="padding:10px 14px">
              <div style="font-size:13px;font-weight:700;color:var(--text)">${escH(u.name || '—')}</div>
              ${isMe ? '<div style="font-size:10px;color:var(--cyan);font-weight:600">You</div>' : ''}
            </td>
            <td style="padding:10px 14px;font-size:12px;color:var(--muted)">${escH(u.email)}</td>
            <td style="padding:10px 14px">
              <span style="padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;
                ${roleColors[u.role] || 'background:#e5e7eb;color:#374151'}">${roleLabels[u.role] || u.role}</span>
            </td>
            <td style="padding:10px 14px;font-size:12px;color:var(--text)">${escH(org?.name || '—')}</td>
            <td style="padding:10px 14px">
              ${u.auth_id
                ? '<span style="color:#16a34a;font-size:11px;font-weight:700">✓ Linked</span>'
                : '<span style="color:#d97706;font-size:11px;font-weight:700">⚠ No login</span>'}
            </td>
            <td style="padding:10px 14px;text-align:right">
              ${!isMe ? `<button class="btn btn-sm btn-outline" onclick="openEditUserModal('${u.id}')" style="margin-right:4px">Edit</button>
              ${isPlatformAdmin() && !viewAsState ? `<button class="btn btn-sm btn-outline" onclick="viewAsUser('${u.id}')" style="margin-right:4px;color:#92400e;border-color:#f59e0b">👁 View As</button>` : ''}
              <button class="btn btn-sm btn-red" onclick="confirmDeleteUser('${u.id}','${escH(u.name||u.email)}')">Remove</button>` : ''}
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

// ============================================================
// CREATE USER MODAL
// ============================================================
function openCreateUserModal() {
  const visOrgs = visibleOrgs();
  const roleOptions = isPlatformAdmin()
    ? ['platform_admin','org_admin','analyst','viewer']
    : ['org_admin','analyst','viewer'];

  const roleLabels = {
    platform_admin: 'Platform Admin — full access to all orgs',
    org_admin: 'Org Admin — full access within their org scope',
    analyst: 'Analyst — read/write on assigned orgs',
    viewer: 'View Only — read-only on assigned orgs',
  };

  document.getElementById('userModalBox').innerHTML = `
    <div style="padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem">
        <div style="font-size:16px;font-weight:700;color:var(--navy)">Add New User</div>
        <button onclick="closeUserModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted)">✕</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div>
          <label class="form-label">Full Name</label>
          <input id="uName" type="text" class="form-input" placeholder="Jane Smith">
        </div>
        <div>
          <label class="form-label">Email Address</label>
          <input id="uEmail" type="email" class="form-input" placeholder="jane@example.com">
        </div>
      </div>
      <div style="margin-bottom:12px">
        <label class="form-label">Temporary Password</label>
        <input id="uPassword" type="text" class="form-input" placeholder="Min. 8 characters — user should change on first login">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div>
          <label class="form-label">Role</label>
          <select id="uRole" class="form-input" onchange="userRoleChanged()">
            ${roleOptions.map(r => `<option value="${r}">${roleLabels[r]}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Primary Organization</label>
          <select id="uOrgId" class="form-input">
            ${visOrgs.map(o => `<option value="${o.id}">${o.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div id="uOrgAccessSection" style="display:none;margin-bottom:12px">
        <label class="form-label">Accessible Organizations <span style="color:var(--muted);font-weight:400">(select all they can see)</span></label>
        <div id="uOrgAccessList" style="border:1px solid var(--border);border-radius:8px;padding:8px;max-height:160px;overflow-y:auto">
          ${visOrgs.map(o => `<label style="display:flex;align-items:center;gap:8px;padding:4px 6px;cursor:pointer;border-radius:4px;font-size:12px">
            <input type="checkbox" class="uOrgCheck" value="${o.id}"> ${escH(o.name)}
            <span style="font-size:10px;color:var(--muted)">${o.tier}</span>
          </label>`).join('')}
        </div>
      </div>
      <div style="margin-bottom:12px">
        <label class="form-label">Module Access</label>
        <div id="uModuleSection" style="border:1px solid var(--border);border-radius:8px;padding:8px;display:grid;grid-template-columns:1fr 1fr;gap:2px">
          <label style="display:flex;align-items:center;gap:6px;padding:5px 6px;cursor:pointer;border-radius:4px;font-size:12px"><input type="checkbox" class="uModuleCheck" value="assessments" checked> 📋 Assessments</label>
          <label style="display:flex;align-items:center;gap:6px;padding:5px 6px;cursor:pointer;border-radius:4px;font-size:12px"><input type="checkbox" class="uModuleCheck" value="ai" checked> 🤖 AI Readiness</label>
          <label style="display:flex;align-items:center;gap:6px;padding:5px 6px;cursor:pointer;border-radius:4px;font-size:12px"><input type="checkbox" class="uModuleCheck" value="risk" checked> ⚠️ Risk &amp; Vendors</label>
          <label style="display:flex;align-items:center;gap:6px;padding:5px 6px;cursor:pointer;border-radius:4px;font-size:12px"><input type="checkbox" class="uModuleCheck" value="exercises" checked> 🎯 Exercises</label>
          <label style="display:flex;align-items:center;gap:6px;padding:5px 6px;cursor:pointer;border-radius:4px;font-size:12px"><input type="checkbox" class="uModuleCheck" value="reports" checked> 📊 Reports</label>
          <label style="display:flex;align-items:center;gap:6px;padding:5px 6px;cursor:pointer;border-radius:4px;font-size:12px"><input type="checkbox" class="uModuleCheck" value="ma_cdd"> 🤝 M&amp;A Due Diligence</label>
        </div>
        <div id="uModuleNote" style="font-size:10px;color:var(--muted);margin-top:4px"></div>
      </div>
      <div id="uError" style="display:none;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;
        padding:8px 10px;border-radius:6px;font-size:12px;margin-bottom:10px"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-outline btn-sm" onclick="closeUserModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" id="uCreateBtn" onclick="submitCreateUser()">Create User</button>
      </div>
    </div>`;
  document.getElementById('userModal').style.display = 'flex';
  userRoleChanged();
}

function userRoleChanged() {
  const role = document.getElementById('uRole')?.value;
  const hasOrgAccess = ['analyst','viewer'].includes(role);
  const hasModuleConfig = role !== 'platform_admin';
  const s1 = document.getElementById('uOrgAccessSection');
  if (s1) s1.style.display = hasOrgAccess ? '' : 'none';
  const checks = document.querySelectorAll('.uModuleCheck');
  const note = document.getElementById('uModuleNote');
  checks.forEach(cb => {
    cb.disabled = !hasModuleConfig;
    cb.checked = true;
    cb.closest('label').style.opacity = hasModuleConfig ? '1' : '0.45';
    cb.closest('label').style.cursor = hasModuleConfig ? 'pointer' : 'default';
  });
  if (note) note.textContent = hasModuleConfig ? 'Uncheck sections to remove from their navigation.' : 'Platform Admin always has full access to all modules.';
}

async function submitCreateUser() {
  const name = document.getElementById('uName').value.trim();
  const email = document.getElementById('uEmail').value.trim();
  const password = document.getElementById('uPassword').value;
  const role = document.getElementById('uRole').value;
  const orgId = document.getElementById('uOrgId').value;
  const errEl = document.getElementById('uError');

  if (!email || !password || !orgId) {
    errEl.textContent = 'Email, password, and organisation are required.';
    errEl.style.display = '';
    return;
  }
  const pwdErrors = (typeof validatePassword === 'function') ? validatePassword(password) : [];
  if (pwdErrors.length) {
    errEl.textContent = 'Password must contain: ' + pwdErrors.join(', ') + '.';
    errEl.style.display = '';
    return;
  }

  const btn = document.getElementById('uCreateBtn');
  btn.textContent = 'Creating…'; btn.disabled = true; errEl.style.display = 'none';

  try {
    // 1. Create Supabase auth account
    const authUid = await authCreateAuthUser(email, password);

    // 2. Insert app user record
    const isRestricted = role !== 'platform_admin';
    let moduleAccess = null;
    if (isRestricted) {
      const checked = [...document.querySelectorAll('.uModuleCheck:checked')].map(cb => cb.value);
      moduleAccess = { assessments: checked.includes('assessments'), ai: checked.includes('ai'), risk: checked.includes('risk'), exercises: checked.includes('exercises'), reports: checked.includes('reports'), ma_cdd: checked.includes('ma_cdd') };
    }
    const newUser = await sb.users.create({
      name: name || null,
      email,
      role,
      org_id: orgId,
      auth_id: authUid,
      module_access: moduleAccess,
    });
    const userId = Array.isArray(newUser) ? newUser[0]?.id : newUser?.id;

    // 3. Save org access list for analyst/viewer
    if (['analyst','viewer'].includes(role) && userId) {
      const checked = [...document.querySelectorAll('.uOrgCheck:checked')].map(cb => cb.value);
      if (checked.length) {
        await sb.userOrgAccess.upsertAll(checked.map(orgId => ({ user_id: userId, org_id: orgId })));
      }
    }

    auditLog('user_created', 'user', email, { name: name || null, role, org_id: orgId });
    closeUserModal();
    toast(`User ${email} created successfully`, '#16a34a');
    await userMgmtLoad();
    const el = document.getElementById('userMgmtContent');
    if (el) el.innerHTML = renderUserMgmtInner();
  } catch (e) {
    btn.textContent = 'Create User'; btn.disabled = false;
    errEl.textContent = e.message;
    errEl.style.display = '';
  }
}

// ============================================================
// EDIT USER MODAL
// ============================================================
async function openEditUserModal(userId) {
  const user = userMgmtState.users.find(u => u.id === userId);
  if (!user) return;

  const visOrgs = visibleOrgs();
  const roleOptions = isPlatformAdmin()
    ? ['platform_admin','org_admin','analyst','viewer']
    : ['org_admin','analyst','viewer'];
  const roleLabels = {
    platform_admin: 'Platform Admin', org_admin: 'Org Admin',
    analyst: 'Analyst', viewer: 'View Only',
  };

  // Load existing org access, active modules, and user module grants in parallel
  let existingAccess = [], activeModules = [], userModuleGrants = new Set();
  try {
    const [orgRows, modRows, grantRows] = await Promise.all([
      sb.userOrgAccess.getForUser(userId),
      sbFetch('modules?is_active=eq.true&order=sort_order.asc,name.asc', 'GET'),
      sbFetch(`user_module_access?user_id=eq.${userId}&select=module_id`, 'GET'),
    ]);
    existingAccess    = (orgRows   || []).map(r => r.org_id);
    activeModules     = modRows    || [];
    userModuleGrants  = new Set((grantRows || []).map(r => r.module_id));
  } catch {}
  _euActiveModules = activeModules;

  document.getElementById('userModalBox').innerHTML = `
    <div style="padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem">
        <div style="font-size:16px;font-weight:700;color:var(--navy)">Edit User — ${escH(user.name || user.email)}</div>
        <button onclick="closeUserModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted)">✕</button>
      </div>
      <div style="margin-bottom:12px">
        <label class="form-label">Full Name</label>
        <input id="euName" type="text" class="form-input" value="${escH(user.name || '')}">
      </div>
      <div style="margin-bottom:12px;color:var(--muted);font-size:12px">
        Email: <strong>${escH(user.email)}</strong> — email changes require the Supabase dashboard
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div>
          <label class="form-label">Role</label>
          <select id="euRole" class="form-input" onchange="editUserRoleChanged()">
            ${roleOptions.map(r => `<option value="${r}" ${r===user.role?'selected':''}>${roleLabels[r]}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Primary Organization</label>
          <select id="euOrgId" class="form-input">
            ${visOrgs.map(o => `<option value="${o.id}" ${o.id===user.org_id?'selected':''}>${escH(o.name)}</option>`).join('')}
          </select>
        </div>
      </div>
      <div id="euOrgAccessSection" style="${['analyst','viewer'].includes(user.role) ? '' : 'display:none'};margin-bottom:12px">
        <label class="form-label">Accessible Organizations</label>
        <div style="border:1px solid var(--border);border-radius:8px;padding:8px;max-height:160px;overflow-y:auto">
          ${visOrgs.map(o => `<label style="display:flex;align-items:center;gap:8px;padding:4px 6px;cursor:pointer;border-radius:4px;font-size:12px">
            <input type="checkbox" class="euOrgCheck" value="${o.id}" ${existingAccess.includes(o.id)?'checked':''}> ${escH(o.name)}
            <span style="font-size:10px;color:var(--muted)">${o.tier}</span>
          </label>`).join('')}
        </div>
      </div>
      <div style="margin-bottom:12px">
        <label class="form-label">Section Access</label>
        <div id="euModuleSection" style="border:1px solid var(--border);border-radius:8px;padding:8px;display:grid;grid-template-columns:1fr 1fr;gap:2px">
          ${[['assessments','📋 Assessments'],['ai','🤖 AI Readiness'],['risk','⚠️ Governance'],['exercises','🎯 Exercises'],['reports','📊 Reports'],['ma_cdd','🤝 M&amp;A Due Diligence']].map(([val,lbl]) => {
            const canConfig = user.role !== 'platform_admin';
            const ma = user.module_access;
            const chk = !ma || ma[val] !== false;
            return `<label style="display:flex;align-items:center;gap:6px;padding:5px 6px;border-radius:4px;font-size:12px;cursor:${canConfig?'pointer':'default'};opacity:${canConfig?'1':'0.45'}"><input type="checkbox" class="euModuleCheck" value="${val}" ${chk?'checked':''} ${canConfig?'':'disabled'}> ${lbl}</label>`;
          }).join('')}
        </div>
        <div id="euModuleNote" style="font-size:10px;color:var(--muted);margin-top:4px">${user.role !== 'platform_admin' ? 'Uncheck sections to remove from their navigation.' : 'Platform Admin always has full access to all modules.'}</div>
      </div>
      ${activeModules.length ? `<div style="margin-bottom:12px">
        <label class="form-label">Add-on Modules</label>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden">
          ${activeModules.map((m, i) => `
            <label style="display:flex;align-items:center;gap:.6rem;padding:8px 10px;cursor:pointer;${i ? 'border-top:1px solid var(--border)' : ''}">
              <input type="checkbox" class="euModSubCheck" value="${m.id}" ${userModuleGrants.has(m.id) ? 'checked' : ''}>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;font-weight:700">${escH(m.name)}</div>
                ${m.description ? `<div style="font-size:10px;color:var(--muted)">${escH(m.description)}</div>` : ''}
              </div>
              ${m.monthly_cost > 0 ? `<div style="font-size:11px;color:var(--muted);white-space:nowrap">$${parseFloat(m.monthly_cost).toFixed(2)}/mo</div>` : ''}
            </label>`).join('')}
        </div>
        <div style="font-size:10px;color:var(--muted);margin-top:4px">Controls access to add-on features assigned in Module Management.</div>
      </div>` : ''}
      <div id="euError" style="display:none;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;
        padding:8px 10px;border-radius:6px;font-size:12px;margin-bottom:10px"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-outline btn-sm" onclick="closeUserModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" id="euSaveBtn" onclick="submitEditUser('${userId}')">Save Changes</button>
      </div>
    </div>`;
  document.getElementById('userModal').style.display = 'flex';
}

function editUserRoleChanged() {
  const role = document.getElementById('euRole')?.value;
  const canConfigModules = role !== 'platform_admin';
  const hasOrgAccess = ['analyst','viewer'].includes(role);
  const s1 = document.getElementById('euOrgAccessSection');
  if (s1) s1.style.display = hasOrgAccess ? '' : 'none';
  const checks = document.querySelectorAll('.euModuleCheck');
  const note = document.getElementById('euModuleNote');
  checks.forEach(cb => {
    cb.disabled = !canConfigModules;
    cb.closest('label').style.opacity = canConfigModules ? '1' : '0.45';
    cb.closest('label').style.cursor = canConfigModules ? 'pointer' : 'default';
  });
  if (note) note.textContent = canConfigModules ? 'Uncheck sections to remove from their navigation.' : 'Platform Admin always has full access to all modules.';
}

async function submitEditUser(userId) {
  const name = document.getElementById('euName').value.trim();
  const role = document.getElementById('euRole').value;
  const orgId = document.getElementById('euOrgId').value;
  const errEl = document.getElementById('euError');
  const btn = document.getElementById('euSaveBtn');
  btn.textContent = 'Saving…'; btn.disabled = true; errEl.style.display = 'none';

  try {
    const isRestricted = role !== 'platform_admin';
    let moduleAccess = null;
    if (isRestricted) {
      const checked = [...document.querySelectorAll('.euModuleCheck:checked')].map(cb => cb.value);
      moduleAccess = { assessments: checked.includes('assessments'), ai: checked.includes('ai'), risk: checked.includes('risk'), exercises: checked.includes('exercises'), reports: checked.includes('reports'), ma_cdd: checked.includes('ma_cdd') };
    }
    await sb.users.update(userId, { name: name || null, role, org_id: orgId, module_access: moduleAccess });

    // Update org access for analyst/viewer
    await sb.userOrgAccess.deleteForUser(userId);
    if (['analyst','viewer'].includes(role)) {
      const checked = [...document.querySelectorAll('.euOrgCheck:checked')].map(cb => cb.value);
      if (checked.length) {
        await sb.userOrgAccess.upsertAll(checked.map(oid => ({ user_id: userId, org_id: oid })));
      }
    }

    // Sync add-on module grants (user_module_access table)
    if (_euActiveModules.length) {
      const checked = new Set([...document.querySelectorAll('.euModSubCheck:checked')].map(cb => cb.value));
      // Delete all existing grants for this user, then re-insert checked ones
      await sbFetch(`user_module_access?user_id=eq.${userId}`, 'DELETE');
      if (checked.size) {
        const rows = [...checked].map(mid => ({ user_id: userId, module_id: mid }));
        await sbFetch('user_module_access', 'POST', rows);
      }
      // Reload module access state if this is the currently logged-in user
      if (userId === authState?.profile?.id) await modAccessLoadGrants();
    }

    const editedUser = userMgmtState.users.find(u => u.id === userId);
    auditLog('user_edited', 'user', editedUser?.email || userId, { name: name || null, role, org_id: orgId });
    closeUserModal();
    toast('User updated', '#16a34a');
    await userMgmtLoad();
    const el = document.getElementById('userMgmtContent');
    if (el) el.innerHTML = renderUserMgmtInner();
  } catch (e) {
    btn.textContent = 'Save Changes'; btn.disabled = false;
    errEl.textContent = e.message; errEl.style.display = '';
  }
}

// ============================================================
// DELETE USER
// ============================================================
function confirmDeleteUser(userId, displayName) {
  if (!confirm(`Remove user "${displayName}"? This will delete their platform account and sign-in access.`)) return;
  deleteUser(userId, displayName);
}

async function deleteUser(userId, displayName) {
  try {
    // Get auth_id before deleting the app record
    const userRow = userMgmtState.users.find(u => u.id === userId);
    const authId = userRow?.auth_id;

    await sb.userOrgAccess.deleteForUser(userId);
    await sb.users.delete(userId);

    // Delete Supabase Auth account (requires SB_SERVICE_KEY)
    if (authId) {
      try {
        await authAdminDeleteUser(authId);
      } catch (authErr) {
        console.warn('App user deleted but auth account removal failed:', authErr.message);
        toast(`${displayName} removed from platform — auth account needs manual cleanup in Supabase dashboard`, '#d97706');
        auditLog('user_deleted', 'user', displayName, { auth_cleanup: 'failed', reason: authErr.message });
        await userMgmtLoad();
        const el = document.getElementById('userMgmtContent');
        if (el) el.innerHTML = renderUserMgmtInner();
        return;
      }
    }

    auditLog('user_deleted', 'user', displayName, { auth_cleanup: authId ? 'success' : 'no_auth_id' });
    toast(`${displayName} removed`, '#d97706');
    await userMgmtLoad();
    const el = document.getElementById('userMgmtContent');
    if (el) el.innerHTML = renderUserMgmtInner();
  } catch (e) {
    toast('Failed to remove user: ' + e.message, '#dc2626');
  }
}

function closeUserModal() {
  document.getElementById('userModal').style.display = 'none';
}

// ============================================================
// AUDIT LOG TAB
// ============================================================
function switchUserTab(tab) {
  userMgmtState.tab = tab;
  renderMain();
}

async function auditTabLoad(days) {
  userMgmtState.auditLoading = true;
  const el = document.getElementById('userMgmtContent');
  if (el) el.innerHTML = renderAuditShell(days, [], true);
  try {
    const orgIds = isPlatformAdmin() ? null : visibleOrgs().map(o => o.id);
    const rows = await sb.auditLog.getRecent(days, orgIds);
    userMgmtState.auditLogs = rows || [];
  } catch (e) {
    userMgmtState.auditLogs = [];
  }
  userMgmtState.auditLoading = false;
  if (el) el.innerHTML = renderAuditShell(days, userMgmtState.auditLogs, false);
}

function setAuditDays(days) {
  userMgmtState.auditDays = days;
  auditTabLoad(days);
}

function renderAuditShell(days, rows, loading) {
  const EVENT_LABELS = {
    user_created:        'User Created',
    user_edited:         'User Edited',
    user_deleted:        'User Deleted',
    assessment_saved:    'Assessment Saved',
    assessment_updated:  'Assessment Updated',
    assessment_deleted:  'Assessment Deleted',
    poam_saved:          'POAM Saved',
    tpra_published:      'TPRA Published',
    tpra_deleted:        'TPRA Deleted',
    org_created:         'Org Created',
    org_updated:         'Org Updated',
    org_deleted:         'Org Deleted',
  };
  const EVENT_COLORS = {
    user_created:       '#15803d', assessment_saved:   '#15803d',
    assessment_updated: '#15803d', tpra_published:     '#0e7490',
    org_created:        '#15803d', poam_saved:         '#4f46e5',
    user_edited:        '#4f46e5', org_updated:        '#4f46e5',
    user_deleted:       '#b91c1c', assessment_deleted: '#b91c1c',
    tpra_deleted:       '#b91c1c', org_deleted:        '#b91c1c',
  };

  const pills = [7, 30, 90].map(d =>
    `<button onclick="setAuditDays(${d})" style="padding:4px 12px;border-radius:99px;font-size:11px;font-weight:700;
      cursor:pointer;border:1px solid ${days===d?'var(--navy)':'var(--border)'};
      background:${days===d?'var(--navy)':'#fff'};color:${days===d?'#fff':'var(--muted)'}">
      ${d}d
    </button>`
  ).join('');

  const header = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
      <div style="font-size:13px;color:var(--muted)">Events in the last <strong>${days} days</strong></div>
      <div style="display:flex;gap:6px">${pills}</div>
    </div>`;

  if (loading) return header + `<div style="text-align:center;padding:3rem;color:var(--muted)">
    <div class="spinner" style="border-color:rgba(21,33,104,0.15);border-top-color:var(--navy);width:20px;height:20px;margin:0 auto 0.75rem"></div>
    <div style="font-size:12px">Loading audit log…</div>
  </div>`;

  if (!rows.length) return header + `<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">
    <div style="font-size:24px;margin-bottom:0.5rem">📋</div>
    <div style="font-size:13px;font-weight:700;margin-bottom:4px">No events recorded</div>
    <div style="font-size:12px">Changes will appear here as actions are taken in the platform.</div>
  </div>`;

  const orgMap = {};
  (typeof allOrgs !== 'undefined' ? allOrgs : []).forEach(o => { orgMap[o.id] = o.name; });

  const tableRows = rows.map(r => {
    const ts = new Date(r.created_at);
    const dateStr = ts.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = ts.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' });
    const color = EVENT_COLORS[r.event_type] || '#6b7280';
    const label = EVENT_LABELS[r.event_type] || r.event_type;
    const orgName = r.org_id ? (orgMap[r.org_id] || '—') : '—';
    let detailStr = '';
    if (r.details && Object.keys(r.details).length) {
      detailStr = Object.entries(r.details)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' · ');
    }
    return `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:9px 14px;white-space:nowrap">
        <div style="font-size:12px;font-weight:600;color:var(--text)">${dateStr}</div>
        <div style="font-size:11px;color:var(--muted)">${timeStr}</div>
      </td>
      <td style="padding:9px 14px">
        <div style="font-size:12px;font-weight:600;color:var(--text)">${escH(r.actor_name || '—')}</div>
        <div style="font-size:11px;color:var(--muted)">${escH(r.actor_email || '')}</div>
      </td>
      <td style="padding:9px 14px">
        <span style="padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;
          background:${color}18;color:${color};border:1px solid ${color}40">${escH(label)}</span>
      </td>
      <td style="padding:9px 14px;font-size:12px;color:var(--text)">${escH(r.target_name || '—')}</td>
      <td style="padding:9px 14px;font-size:12px;color:var(--muted)">${escH(orgName)}</td>
      <td style="padding:9px 14px;font-size:11px;color:var(--muted);max-width:220px;word-break:break-word">${escH(detailStr)}</td>
    </tr>`;
  }).join('');

  return header + `<div class="card" style="overflow:hidden;padding:0">
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:var(--bg)">
          ${['Time','Actor','Event','Target','Organization','Details'].map(h =>
            `<th style="padding:9px 14px;font-size:10px;font-weight:700;color:var(--muted);text-align:left;
              text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid var(--border)">${h}</th>`
          ).join('')}
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  </div>`;
}
