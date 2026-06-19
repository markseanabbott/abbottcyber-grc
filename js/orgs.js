function orgTreeActions(org, badge, badgeClass) {
  const isPlatform = org.tier === 'platform';
  return `
    <span class="badge ${badgeClass}">${badge}</span>
    <button class="btn btn-outline btn-sm" style="margin-left:6px" onclick="selectOrg('${org.id}')">View</button>
    <button class="btn btn-outline btn-sm" style="margin-left:4px" onclick="openOrgEdit('${org.id}')">Edit</button>
    ${!isPlatform ? `<button class="btn btn-sm" style="margin-left:4px;background:#fee2e2;color:#b91c1c;border:1.5px solid #fca5a5" onclick="confirmDeleteOrg('${org.id}')">✕</button>` : ''}
  `;
}

function renderOrgManager() {
  const renderedIds = new Set();

  const hierarchyHtml = allOrgs.filter(o => o.tier === 'platform').map(platform => {
    renderedIds.add(platform.id);
    const gfs = allOrgs.filter(o => o.parent_id === platform.id);
    return `<div>
      <div class="org-tree-item" style="border-bottom:2px solid var(--cyan);padding-bottom:8px;margin-bottom:8px">
        <div class="org-avatar av-platform" style="width:30px;height:30px;font-size:10px;flex-shrink:0">${tierInitials(platform.name)}</div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700">${platform.name}</div>
          <div style="font-size:10px;color:var(--muted)">Platform Owner · Sees all ${allOrgs.length} organisations</div>
        </div>
        ${orgTreeActions(platform, 'Platform', 'b-platform')}
      </div>
      ${gfs.map(gf => {
        renderedIds.add(gf.id);
        const fathers = allOrgs.filter(o => o.parent_id === gf.id);
        return `<div style="margin-left:1rem;margin-bottom:6px">
          <div class="org-tree-item">
            <span style="color:rgba(7,180,217,0.4);font-size:14px;flex-shrink:0">└</span>
            <div class="org-avatar av-gf" style="width:26px;height:26px;font-size:9px;flex-shrink:0">${tierInitials(gf.name)}</div>
            <div style="flex:1">
              <div style="font-size:12px;font-weight:700">${gf.name}</div>
              <div style="font-size:10px;color:var(--muted)">Grandfather · ${fathers.length} Father groups</div>
            </div>
            ${orgTreeActions(gf, 'GF', 'b-cyan')}
          </div>
          ${fathers.map(f => {
            renderedIds.add(f.id);
            const kids = allOrgs.filter(o => o.parent_id === f.id);
            return `<div style="margin-left:1.5rem">
              <div class="org-tree-item">
                <span style="color:rgba(79,70,229,0.4);font-size:14px;flex-shrink:0">└</span>
                <div class="org-avatar av-f" style="width:24px;height:24px;font-size:9px;flex-shrink:0">${tierInitials(f.name)}</div>
                <div style="flex:1">
                  <div style="font-size:12px;font-weight:700">${f.name}</div>
                  <div style="font-size:10px;color:var(--muted)">Father · ${kids.length} child clients</div>
                </div>
                ${orgTreeActions(f, 'Father', 'b-purple')}
              </div>
              ${kids.map(c => {
                renderedIds.add(c.id);
                return `<div style="margin-left:1.5rem">
                  <div class="org-tree-item">
                    <span style="color:rgba(22,163,74,0.4);font-size:14px;flex-shrink:0">└</span>
                    <div class="org-avatar av-c" style="width:22px;height:22px;font-size:8px;flex-shrink:0">${tierInitials(c.name)}</div>
                    <div style="flex:1">
                      <div style="font-size:12px;font-weight:700">${c.name}</div>
                      <div style="font-size:10px;color:var(--muted)">Child · ${c.industry || '—'}${orgProfiles[c.id]?.data_sensitivity ? ` · <span class="risk-profile-badge rpb-${(orgProfiles[c.id].data_sensitivity).toLowerCase()}">${orgProfiles[c.id].data_sensitivity} data sensitivity</span>` : ''}</div>
                    </div>
                    ${orgTreeActions(c, 'Child', 'b-green')}
                  </div>
                </div>`;
              }).join('')}
            </div>`;
          }).join('')}
        </div>`;
      }).join('')}
    </div>`;
  }).join('');

  const orphans = allOrgs.filter(o => !renderedIds.has(o.id));
  const orphanHtml = orphans.length ? `
    <div class="card" style="border-top:3px solid #f59e0b">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.75rem">
        <div style="font-size:13px;font-weight:700;color:#92400e">⚠️ Unplaced Organisations (${orphans.length})</div>
        <div style="font-size:11px;color:#92400e">These organisations are not visible in the hierarchy — edit each one to assign a valid tier and parent.</div>
      </div>
      ${orphans.map(o => `
        <div class="org-tree-item" style="border-left:3px solid #f59e0b;padding-left:10px;margin-bottom:4px">
          <div class="org-avatar" style="width:26px;height:26px;font-size:9px;flex-shrink:0;background:#fef3c7;color:#92400e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700">${tierInitials(o.name)}</div>
          <div style="flex:1">
            <div style="font-size:12px;font-weight:700">${o.name}</div>
            <div style="font-size:10px;color:var(--muted)">${o.tier.charAt(0).toUpperCase()+o.tier.slice(1)} · parent_id: ${o.parent_id ? o.parent_id.slice(0,8)+'…' : 'none'}</div>
          </div>
          ${orgTreeActions(o, o.tier.charAt(0).toUpperCase()+o.tier.slice(1), 'b-amber')}
        </div>`).join('')}
    </div>` : '';

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.85rem;flex-wrap:wrap;gap:8px">
    <div><div style="font-size:17px;font-weight:700">🏢 Organisation Manager</div>
    <div style="font-size:12px;color:var(--muted)">${allOrgs.length} organisations · Four-tier hierarchy${orphans.length ? ` · <span style="color:#b45309;font-weight:700">${orphans.length} unplaced</span>` : ''}</div></div>
  </div>
  <div class="card">
    <div class="card-title">Full hierarchy</div>
    ${hierarchyHtml}
  </div>
  ${orphanHtml}
  <div class="card">
    <div class="card-title">Add new organisation</div>
    <div class="add-org-form">
      <div class="form-row">
        <div><div class="field-lbl">Name</div><input type="text" id="newOrgName" placeholder="e.g. Maple Leaf Hotels"/></div>
        <div><div class="field-lbl">Industry</div>
          <select id="newOrgIndustry">
            <option value="">— Select industry —</option>
            ${ORG_INDUSTRIES.map(i => `<option value="${i}">${i}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div><div class="field-lbl">Tier</div>
          <select id="newOrgTier" onchange="updateParentOptions()">
            <option value="child">Child</option>
            <option value="father">Father</option>
            <option value="grandfather">Grandfather</option>
          </select>
        </div>
        <div><div class="field-lbl">Parent</div><select id="newOrgParent"></select></div>
      </div>
      <button class="btn btn-cyan" onclick="addOrg()">Add Organisation</button>
    </div>
  </div>`;
}

function updateParentOptions() {
  const tier = document.getElementById('newOrgTier')?.value;
  const sel = document.getElementById('newOrgParent');
  if (!sel) return;
  const parentTier = tier === 'child' ? 'father' : tier === 'father' ? 'grandfather' : tier === 'grandfather' ? 'platform' : null;
  if (!parentTier) { sel.innerHTML = '<option value="">No parent</option>'; return; }
  sel.innerHTML = allOrgs.filter(o => o.tier === parentTier).map(o => `<option value="${o.id}">${o.name}</option>`).join('');
}

async function addOrg() {
  const name = document.getElementById('newOrgName')?.value?.trim();
  const tier = document.getElementById('newOrgTier')?.value;
  const parent = document.getElementById('newOrgParent')?.value || null;
  const industry = document.getElementById('newOrgIndustry')?.value?.trim() || null;
  if (!name) { toast('Please enter a name.', '#dc2626'); return; }
  const btn = event.target; btn.disabled = true; btn.textContent = 'Saving…';
  try {
    const result = await sb.createOrg({ name, tier, parent_id: parent || null, industry });
    allOrgs.push(result[0]);
    auditLog('org_created', 'org', name, { tier });
    toast(`✓ ${name} added`, '#15803d');
    buildNav(); renderMain();
  } catch (e) {
    toast('Error: ' + e.message, '#dc2626');
    btn.disabled = false; btn.textContent = 'Add Organisation';
  }
}

// ============================================================
// ORG MANAGER — REFERENCE DATA
// ============================================================
const ORG_INDUSTRIES = [
  'Technology','Healthcare','Financial Services','Hospitality & Tourism',
  'Legal','Education','Manufacturing','Retail','Professional Services',
  'Real Estate','Construction','Non-Profit','Government / Public Sector',
  'Cybersecurity Consulting','Other'
];

const ORG_SUB_INDUSTRIES = {
  'Technology': ['SaaS','Managed Service Provider (MSP)','IT Consulting','Fintech','Edtech','Healthtech','Hardware / OEM','Telecommunications','Other'],
  'Healthcare': ['Hospital / Health System','Medical Practice / Clinic','Allied Health','Aged Care','Pathology / Diagnostics','Pharmacy','Health Insurance','Other'],
  'Financial Services': ['Banking','Insurance','Accounting / Audit','Wealth Management','Mortgage Broking','Payments','Superannuation','Other'],
  'Hospitality & Tourism': ['Hotels & Resorts','Restaurants & Cafes','Events & Venues','Travel Agency','Tourism Operator','Other'],
  'Legal': ['Commercial Law','Family Law','Criminal Law','IP & Technology Law','Other'],
  'Education': ['K-12 School','Higher Education','Vocational / TAFE','EdTech Platform','Tutoring / Training','Other'],
  'Manufacturing': ['Food & Beverage','Industrial / Heavy','Consumer Goods','Pharmaceutical','Defence & Aerospace','Other'],
  'Retail': ['Brick & Mortar','eCommerce','Franchise','Grocery','Other'],
  'Professional Services': ['Consulting','Marketing & Advertising','Architecture','Engineering','Other'],
};

const ORG_REGULATORY = [
  'PCI-DSS','HIPAA','GDPR','CCPA','SOC 2 Type II','ISO 27001',
  'NIST CSF','Essential Eight','APRA CPS 234','HiTRUST','FedRAMP','None'
];

// ============================================================
// ORG MANAGER — CRUD FUNCTIONS
// ============================================================

function openOrgEdit(orgId) {
  orgModalTab = 'details';
  const org = allOrgs.find(o => o.id === orgId);
  if (!org) return;
  const modal = document.getElementById('orgModal');
  const box = document.getElementById('orgModalBox');
  box.innerHTML = renderOrgEditModal(org);
  modal.style.display = 'flex';
}

function closeOrgModal() {
  document.getElementById('orgModal').style.display = 'none';
  document.getElementById('orgModalBox').innerHTML = '';
}

function switchOrgModalTab(tab) {
  orgModalTab = tab;
  const org = allOrgs.find(o => o.id === document.getElementById('orgEditId')?.value);
  if (org) document.getElementById('orgModalBox').innerHTML = renderOrgEditModal(org);
}

function renderOrgEditModal(org) {
  const p = orgProfiles[org.id] || {};
  const isDetails = orgModalTab === 'details';

  // Sub-industries for current industry
  const subs = ORG_SUB_INDUSTRIES[org.industry] || [];

  // Regulatory checkboxes
  const regSelected = (p.regulatory_scope || '').split(',').map(s => s.trim()).filter(Boolean);

  return `
  <input type="hidden" id="orgEditId" value="${org.id}"/>
  <div class="modal-header">
    <div>
      <div class="modal-title">Edit Organisation</div>
      <div style="font-size:10px;color:var(--muted);margin-top:1px">${org.name} · ${org.tier.charAt(0).toUpperCase()+org.tier.slice(1)}</div>
    </div>
    <button class="modal-close" onclick="closeOrgModal()">✕</button>
  </div>

  <div style="padding:0.75rem 1.25rem 0;border-bottom:1px solid var(--border)">
    <div class="view-tabs" style="border-bottom:none;margin-bottom:0">
      <button class="view-tab ${isDetails ? 'active' : ''}" onclick="switchOrgModalTab('details')">Organisation Details</button>
      <button class="view-tab ${!isDetails ? 'active' : ''}" onclick="switchOrgModalTab('profile')">Risk Profile</button>
    </div>
  </div>

  <div class="modal-body">
  ${isDetails ? `
    <!-- DETAILS TAB -->
    <div class="profile-section">
      <div class="profile-section-title">Basic Information</div>
      <div class="form-row" style="margin-bottom:8px">
        <div>
          <div class="field-lbl">Organisation Name</div>
          <input type="text" id="editOrgName" value="${org.name}"/>
        </div>
        <div>
          <div class="field-lbl">Industry</div>
          <select id="editOrgIndustry" onchange="updateEditSubIndustry()">
            <option value="">— Select —</option>
            ${ORG_INDUSTRIES.map(i => `<option value="${i}" ${org.industry === i ? 'selected' : ''}>${i}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row" style="margin-bottom:8px">
        <div>
          <div class="field-lbl">Sub-Industry</div>
          <select id="editOrgSubIndustry">
            <option value="">— Select —</option>
            ${subs.map(s => `<option value="${s}" ${p.sub_industry === s ? 'selected' : ''}>${s}</option>`).join('')}
            ${p.sub_industry && !subs.includes(p.sub_industry) ? `<option value="${p.sub_industry}" selected>${p.sub_industry}</option>` : ''}
          </select>
        </div>
        <div>
          <div class="field-lbl">Tier</div>
          <select id="editOrgTier" ${org.tier === 'platform' ? 'disabled' : ''} onchange="updateEditParentOptions()">
            ${['platform','grandfather','father','child'].map(t =>
              `<option value="${t}" ${org.tier === t ? 'selected' : ''}>${t.charAt(0).toUpperCase()+t.slice(1)}</option>`
            ).join('')}
          </select>
        </div>
      </div>
      <div class="form-row" style="margin-bottom:0">
        <div>
          <div class="field-lbl">Parent Organisation</div>
          <select id="editOrgParent">
            <option value="">— None (top-level) —</option>
            ${allOrgs.filter(o => o.id !== org.id).map(o =>
              `<option value="${o.id}" ${org.parent_id === o.id ? 'selected' : ''}>${o.name} (${o.tier})</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <div class="field-lbl">Logo URL (optional)</div>
          <input type="text" id="editOrgLogo" value="${org.logo_url || ''}" placeholder="https://…"/>
        </div>
      </div>
    </div>

    <div class="profile-section">
      <div class="profile-section-title">ACL — Management Assignment</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px">
        Controls which organisation can manage this record. Currently admin-only (Phase 1).
        When user authentication is added, this will drive which org manager can edit sub-orgs.
      </div>
      <div class="form-row" style="margin-bottom:0">
        <div>
          <div class="field-lbl">Managed by</div>
          <select id="editOrgManagedBy">
            <option value="">— Inherit from parent —</option>
            ${allOrgs.filter(o => ['platform','grandfather','father'].includes(o.tier)).map(o =>
              `<option value="${o.id}" ${p.managed_by_org_id === o.id ? 'selected' : ''}>${o.name} (${o.tier})</option>`
            ).join('')}
          </select>
        </div>
        <div style="display:flex;align-items:flex-end">
          <div style="background:#e0f7fc;border-radius:7px;padding:6px 10px;font-size:10px;color:#0369a1;font-weight:700;width:100%">
            Phase 1: Only Abbott Cyber admins can manage all orgs.<br>
            Phase 2 will scope this per user role.
          </div>
        </div>
      </div>
    </div>
  ` : `
    <!-- RISK PROFILE TAB -->
    <div class="profile-section">
      <div class="profile-section-title">Size & Structure</div>
      <div class="form-row" style="margin-bottom:8px">
        <div>
          <div class="field-lbl">Employee Count</div>
          <select id="pEditEmployees">
            <option value="">— Unknown —</option>
            ${['1-10','11-50','51-200','201-500','501-1000','1001+'].map(v =>
              `<option value="${v}" ${p.employee_count_band === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <div class="field-lbl">Annual Revenue</div>
          <select id="pEditRevenue">
            <option value="">— Unknown —</option>
            ${['<$1M','$1M–$5M','$5M–$25M','$25M–$100M','$100M–$500M','$500M+'].map(v =>
              `<option value="${v}" ${p.annual_revenue_band === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
      </div>
      <div class="form-row" style="margin-bottom:0">
        <div>
          <div class="field-lbl">Org Structure</div>
          <select id="pEditStructure">
            <option value="">— Select —</option>
            ${['Private Company','Public Company','Non-Profit','Government / Public Sector','Franchise','Partnership','Sole Trader','Other'].map(v =>
              `<option value="${v}" ${p.org_structure === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <div class="field-lbl">Geographic Presence</div>
          <select id="pEditGeo">
            <option value="">— Select —</option>
            ${['Local','Regional','National','International'].map(v =>
              `<option value="${v}" ${p.geographic_presence === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
      </div>
    </div>

    <div class="profile-section">
      <div class="profile-section-title">Data & Risk Profile</div>
      <div class="form-row" style="margin-bottom:8px">
        <div>
          <div class="field-lbl">Data Sensitivity</div>
          <select id="pEditDataSensitivity">
            <option value="">— Unassessed —</option>
            ${['Low','Medium','High','Critical'].map(v =>
              `<option value="${v}" ${p.data_sensitivity === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <div class="field-lbl">Remote Workforce</div>
          <select id="pEditRemote">
            <option value="">— Unknown —</option>
            ${['0–10%','10–25%','25–50%','50–75%','75–100%'].map(v =>
              `<option value="${v}" ${p.remote_workforce_pct === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
      </div>
      <div style="margin-bottom:8px">
        <div class="field-lbl">Data Types Handled</div>
        <div class="checkbox-group">
          <label class="cb-item ${p.handles_pii ? 'checked' : ''}" onclick="toggleCb(this,'pEditPii')">
            <input type="checkbox" id="pEditPii" ${p.handles_pii ? 'checked' : ''}> PII / Personal Data
          </label>
          <label class="cb-item ${p.handles_payment_data ? 'checked' : ''}" onclick="toggleCb(this,'pEditPayment')">
            <input type="checkbox" id="pEditPayment" ${p.handles_payment_data ? 'checked' : ''}> Payment Card Data
          </label>
          <label class="cb-item ${p.handles_health_data ? 'checked' : ''}" onclick="toggleCb(this,'pEditHealth')">
            <input type="checkbox" id="pEditHealth" ${p.handles_health_data ? 'checked' : ''}> Health / Medical Data
          </label>
        </div>
      </div>
      <div>
        <div class="field-lbl">Regulatory Requirements</div>
        <div class="checkbox-group">
          ${ORG_REGULATORY.map(r => `
            <label class="cb-item ${regSelected.includes(r) ? 'checked' : ''}" onclick="toggleCb(this,'reg_${r.replace(/[^a-z0-9]/gi,'_')}')">
              <input type="checkbox" id="reg_${r.replace(/[^a-z0-9]/gi,'_')}" ${regSelected.includes(r) ? 'checked' : ''}> ${r}
            </label>`).join('')}
        </div>
      </div>
    </div>

    <div class="profile-section">
      <div class="profile-section-title">IT Posture</div>
      <div class="form-row" style="margin-bottom:8px">
        <div>
          <div class="field-lbl">IT Maturity</div>
          <select id="pEditMaturity">
            <option value="">— Unassessed —</option>
            ${['Reactive','Developing','Defined','Managed','Optimizing'].map(v =>
              `<option value="${v}" ${p.it_maturity === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <div class="field-lbl">Cloud Adoption</div>
          <select id="pEditCloud">
            <option value="">— Unknown —</option>
            ${['None','Partial','Primarily Cloud','Cloud-First'].map(v =>
              `<option value="${v}" ${p.cloud_adoption === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
      </div>
      <div class="form-row" style="margin-bottom:0">
        <div>
          <div class="field-lbl">Third-Party Vendor Count</div>
          <select id="pEditVendors">
            <option value="">— Unknown —</option>
            ${['0–5','6–20','21–50','51+'].map(v =>
              `<option value="${v}" ${p.vendor_count_band === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
        <div style="display:flex;align-items:center;gap:8px;padding-top:18px">
          <label class="cb-item ${p.critical_vendor_dependency ? 'checked' : ''}" onclick="toggleCb(this,'pEditCritVendor')" style="flex:1">
            <input type="checkbox" id="pEditCritVendor" ${p.critical_vendor_dependency ? 'checked' : ''}> Critical vendor dependency
          </label>
        </div>
      </div>
    </div>

    <div class="profile-section">
      <div class="profile-section-title">Notes</div>
      <textarea id="pEditNotes" rows="3" placeholder="Any additional context about this organisation's risk posture, known issues, or upcoming changes…">${p.notes || ''}</textarea>
    </div>
  `}
  </div>

  <div class="modal-footer">
    <button class="btn btn-outline" onclick="closeOrgModal()">Cancel</button>
    <button class="btn btn-cyan" onclick="saveOrgEdit('${org.id}')">Save Changes</button>
  </div>`;
}

function toggleCb(label, inputId) {
  const cb = document.getElementById(inputId);
  if (!cb) return;
  cb.checked = !cb.checked;
  label.classList.toggle('checked', cb.checked);
}

function updateEditSubIndustry() {
  const industry = document.getElementById('editOrgIndustry')?.value;
  const subs = ORG_SUB_INDUSTRIES[industry] || [];
  const sel = document.getElementById('editOrgSubIndustry');
  if (!sel) return;
  sel.innerHTML = `<option value="">— Select —</option>` + subs.map(s => `<option value="${s}">${s}</option>`).join('');
}

function updateEditParentOptions() {
  // Refresh parent dropdown when tier changes in edit modal
  const tier = document.getElementById('editOrgTier')?.value;
  const orgId = document.getElementById('orgEditId')?.value;
  const sel = document.getElementById('editOrgParent');
  if (!sel || !tier) return;
  const parentTierMap = { child: 'father', father: 'grandfather', grandfather: 'platform', platform: null };
  const allowedParentTier = parentTierMap[tier];
  sel.innerHTML = `<option value="">— None —</option>` +
    allOrgs
      .filter(o => o.id !== orgId && (!allowedParentTier || o.tier === allowedParentTier))
      .map(o => `<option value="${o.id}">${o.name} (${o.tier})</option>`)
      .join('');
}

async function saveOrgEdit(orgId) {
  const btn = event.target; btn.disabled = true; btn.textContent = 'Saving…';
  try {
    const org = allOrgs.find(o => o.id === orgId);
    const isDetails = orgModalTab === 'details';

    if (isDetails) {
      // Save org table fields
      const patch = {
        name: document.getElementById('editOrgName')?.value?.trim() || org.name,
        industry: document.getElementById('editOrgIndustry')?.value || null,
        tier: document.getElementById('editOrgTier')?.value || org.tier,
        parent_id: document.getElementById('editOrgParent')?.value || null,
        logo_url: document.getElementById('editOrgLogo')?.value?.trim() || null,
        updated_at: new Date().toISOString(),
      };
      await sb.updateOrg(orgId, patch);
      // Merge into allOrgs cache
      const idx = allOrgs.findIndex(o => o.id === orgId);
      if (idx !== -1) allOrgs[idx] = { ...allOrgs[idx], ...patch };

      // Save managed_by to profile (create profile record if not exists)
      const managedBy = document.getElementById('editOrgManagedBy')?.value || null;
      await sb.profiles.upsert({ org_id: orgId, managed_by_org_id: managedBy || null });
      await loadOrgProfiles();

      auditLog('org_updated', 'org', patch.name, { tier: patch.tier || null });
      toast(`✓ ${patch.name} updated`, '#15803d');
    } else {
      // Save profile fields
      const regChecked = ORG_REGULATORY
        .filter(r => document.getElementById('reg_' + r.replace(/[^a-z0-9]/gi,'_'))?.checked)
        .join(',');

      const profileRow = {
        org_id: orgId,
        employee_count_band: document.getElementById('pEditEmployees')?.value || null,
        annual_revenue_band: document.getElementById('pEditRevenue')?.value || null,
        org_structure: document.getElementById('pEditStructure')?.value || null,
        sub_industry: document.getElementById('editOrgSubIndustry')?.value || null,
        geographic_presence: document.getElementById('pEditGeo')?.value || null,
        remote_workforce_pct: document.getElementById('pEditRemote')?.value || null,
        data_sensitivity: document.getElementById('pEditDataSensitivity')?.value || null,
        handles_pii: document.getElementById('pEditPii')?.checked || false,
        handles_payment_data: document.getElementById('pEditPayment')?.checked || false,
        handles_health_data: document.getElementById('pEditHealth')?.checked || false,
        regulatory_scope: regChecked || null,
        it_maturity: document.getElementById('pEditMaturity')?.value || null,
        cloud_adoption: document.getElementById('pEditCloud')?.value || null,
        vendor_count_band: document.getElementById('pEditVendors')?.value || null,
        critical_vendor_dependency: document.getElementById('pEditCritVendor')?.checked || false,
        notes: document.getElementById('pEditNotes')?.value?.trim() || null,
        managed_by_org_id: orgProfiles[orgId]?.managed_by_org_id || null,
      };
      await sb.profiles.upsert(profileRow);
      await loadOrgProfiles();
      toast(`✓ Risk profile saved`, '#15803d');
    }

    closeOrgModal();
    buildNav(); renderMain();
  } catch (e) {
    toast('Error: ' + e.message, '#dc2626');
    btn.disabled = false; btn.textContent = 'Save Changes';
  }
}

function confirmDeleteOrg(orgId) {
  const org = allOrgs.find(o => o.id === orgId);
  if (!org) return;
  const children = allOrgs.filter(o => o.parent_id === orgId);
  const grandchildren = children.flatMap(c => allOrgs.filter(o => o.parent_id === c.id));
  const totalCascade = children.length + grandchildren.length;

  const modal = document.getElementById('orgModal');
  const box = document.getElementById('orgModalBox');
  box.innerHTML = `
    <div class="modal-header">
      <div class="modal-title" style="color:#b91c1c">⚠️ Delete Organisation</div>
      <button class="modal-close" onclick="closeOrgModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="delete-confirm-box">
        <div style="font-size:13px;font-weight:700;margin-bottom:6px">Delete <em>${org.name}</em>?</div>
        <div style="font-size:12px;color:var(--text);line-height:1.6">
          This action is permanent and cannot be undone.
          ${totalCascade > 0 ? `<br><br><strong>Cascade warning:</strong> This will also delete
          <strong>${totalCascade} child organisation${totalCascade !== 1 ? 's' : ''}</strong>
          (${children.length} direct${grandchildren.length > 0 ? ` + ${grandchildren.length} nested` : ''}),
          plus all their assessments, tabletop sessions, and risk profiles.` : ''}
        </div>
        ${totalCascade > 0 ? `<div style="margin-top:10px;font-size:11px;font-weight:700;color:#b91c1c">
          Orgs that will be deleted: ${[org, ...children, ...grandchildren].map(o => o.name).join(', ')}
        </div>` : ''}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeOrgModal()">Cancel</button>
      <button class="btn btn-red" onclick="deleteOrgConfirmed('${orgId}')">Delete permanently</button>
    </div>`;
  modal.style.display = 'flex';
}

async function deleteOrgConfirmed(orgId) {
  const btn = event.target; btn.disabled = true; btn.textContent = 'Deleting…';
  const org = allOrgs.find(o => o.id === orgId);
  try {
    await sb.deleteOrg(orgId);
    // Remove org and all descendants from local cache
    const idsToRemove = new Set();
    const collectIds = (id) => {
      idsToRemove.add(id);
      allOrgs.filter(o => o.parent_id === id).forEach(c => collectIds(c.id));
    };
    collectIds(orgId);
    allOrgs = allOrgs.filter(o => !idsToRemove.has(o.id));
    if (currentOrg && idsToRemove.has(currentOrg.id)) {
      currentOrg = allOrgs.find(o => o.tier === 'platform') || allOrgs[0];
    }
    auditLog('org_deleted', 'org', org?.name || orgId, { tier: org?.tier || null });
    toast(`✓ ${org?.name || 'Organisation'} deleted`, '#15803d');
    closeOrgModal();
    updateOrgUI(); buildNav(); renderMain();
  } catch (e) {
    toast('Delete failed: ' + e.message, '#dc2626');
    btn.disabled = false; btn.textContent = 'Delete permanently';
  }
}
