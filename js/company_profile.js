'use strict';

// ============================================================
// COMPANY PROFILE — "Start Here" intake page
// Reads/writes organisation_profiles for the current org.
// Shows a Risk Context card and links to Technology Stack.
// New columns (PATCH_023): approx_device_count, approx_user_count, primary_msp
// ============================================================

function renderCompanyProfile() {
  if (!currentOrg) return '<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">No organisation selected.</div>';

  const p   = orgProfiles[currentOrg.id] || {};
  const org = currentOrg;

  // Completeness indicator — count non-empty profile fields
  const _filled = [
    p.employee_count_band, p.org_structure, p.annual_revenue_band,
    p.approx_user_count != null ? String(p.approx_user_count) : '',
    p.approx_device_count != null ? String(p.approx_device_count) : '',
    p.primary_msp,
    p.geographic_presence, p.remote_workforce_pct, p.cloud_adoption,
    p.data_sensitivity, p.it_maturity,
  ].filter(f => f && String(f).trim() !== '').length;
  const pct      = Math.round((_filled / 11) * 100);
  const barColor = pct >= 80 ? '#15803d' : pct >= 40 ? '#d97706' : 'var(--navy)';
  const hasData  = _filled > 0;

  // Regulatory scope chips
  const regSelected = (p.regulatory_scope || '').split(',').map(s => s.trim()).filter(Boolean);

  // Sub-industries for current industry selection
  const subs = (typeof ORG_SUB_INDUSTRIES !== 'undefined' && ORG_SUB_INDUSTRIES[org.industry]) || [];

  // Risk context (only shown when profile has some data)
  const riskCtx = hasData ? _cpRiskContext(p) : null;

  return `
  <div style="max-width:860px;margin:0 auto">

    <!-- Page header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:.75rem">
      <div>
        <h2 style="margin:0;font-size:20px;font-weight:800;color:var(--navy)">🏢 Start Here</h2>
        <div style="font-size:12px;color:var(--muted);margin-top:2px">Build a risk profile for <strong>${escH(org.name)}</strong> — all fields optional</div>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem">
        <div style="font-size:11px;color:var(--muted)">${pct}% complete</div>
        <div style="width:100px;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:${barColor};border-radius:3px;transition:width .4s"></div>
        </div>
      </div>
    </div>

    <!-- Step indicator -->
    <div style="display:flex;align-items:stretch;margin-bottom:1.5rem;font-size:12px;font-weight:700">
      <div style="display:flex;align-items:center;gap:.5rem;background:var(--navy);color:#fff;border-radius:8px 0 0 8px;padding:.55rem 1.1rem">
        <span style="background:#fff;color:var(--navy);border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0">1</span>
        Company Profile
      </div>
      <div style="width:0;height:0;border-top:19px solid transparent;border-bottom:19px solid transparent;border-left:12px solid var(--navy)"></div>
      <div style="display:flex;align-items:center;gap:.5rem;background:var(--cyan);color:#fff;border-radius:0 8px 8px 0;padding:.55rem 1.1rem .55rem 1.4rem;cursor:pointer" onclick="setNav('techstack')">
        <span style="background:rgba(255,255,255,.3);color:#fff;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0">2</span>
        Technology Stack →
      </div>
    </div>

    <!-- Risk Context card (appears after first save) -->
    ${riskCtx ? `
    <div class="card" style="margin-bottom:1.25rem;padding:1rem 1.25rem;border-left:4px solid ${riskCtx.color}">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem">
        <span style="font-size:15px">${riskCtx.icon}</span>
        <span style="font-weight:700;color:var(--navy);font-size:13px">Risk Context — ${escH(riskCtx.tier)}</span>
      </div>
      <div style="font-size:12px;color:var(--text);line-height:1.7">${riskCtx.summary}</div>
      ${riskCtx.flags.length ? `<div style="margin-top:.6rem;display:flex;gap:.35rem;flex-wrap:wrap">${riskCtx.flags.map(f => `<span style="font-size:10px;background:${f.bg};color:${f.col};border-radius:4px;padding:2px 8px;font-weight:600">${escH(f.label)}</span>`).join('')}</div>` : ''}
    </div>` : ''}

    <!-- FORM CARD -->
    <div class="card" style="margin-bottom:1rem;padding:0;overflow:hidden">

      <!-- ── Organization ── -->
      <div style="padding:.65rem 1.25rem;background:var(--bg);border-bottom:1px solid var(--border)">
        <span style="font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.06em">Organization</span>
      </div>
      <div style="padding:1rem 1.25rem 1.25rem;display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
        <div>
          <div class="field-lbl">Industry</div>
          <select id="cp_industry" onchange="cpUpdateSubIndustry()">
            <option value="">— Select —</option>
            ${(typeof ORG_INDUSTRIES !== 'undefined' ? ORG_INDUSTRIES : []).map(i =>
              `<option value="${i}" ${org.industry === i ? 'selected' : ''}>${i}</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <div class="field-lbl">Sub-Industry</div>
          <select id="cp_sub_industry">
            <option value="">— Select —</option>
            ${subs.map(s => `<option value="${s}" ${p.sub_industry === s ? 'selected' : ''}>${s}</option>`).join('')}
            ${p.sub_industry && !subs.includes(p.sub_industry) ? `<option value="${p.sub_industry}" selected>${escH(p.sub_industry)}</option>` : ''}
          </select>
        </div>
        <div>
          <div class="field-lbl">Organization Structure</div>
          <select id="cp_org_structure">
            <option value="">— Select —</option>
            ${['Private Company','Public Company','Non-Profit','Government / Public Sector','Franchise','Partnership','Sole Trader','Other'].map(v =>
              `<option value="${v}" ${p.org_structure === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <div class="field-lbl">Annual Revenue</div>
          <select id="cp_revenue">
            <option value="">— Unknown —</option>
            ${['<$1M','$1M–$5M','$5M–$25M','$25M–$100M','$100M–$500M','$500M+'].map(v =>
              `<option value="${v}" ${p.annual_revenue_band === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <div class="field-lbl">Employee Count</div>
          <select id="cp_employees">
            <option value="">— Unknown —</option>
            ${['1-10','11-50','51-200','201-500','501-1000','1001+'].map(v =>
              `<option value="${v}" ${p.employee_count_band === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <div class="field-lbl">Geographic Presence</div>
          <select id="cp_geo">
            <option value="">— Select —</option>
            ${['Local','Regional','National','International'].map(v =>
              `<option value="${v}" ${p.geographic_presence === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
      </div>

      <!-- ── People & Infrastructure ── -->
      <div style="padding:.65rem 1.25rem;background:var(--bg);border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
        <span style="font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.06em">People & Infrastructure</span>
      </div>
      <div style="padding:1rem 1.25rem 1.25rem;display:grid;grid-template-columns:1fr 1fr 1fr;gap:.75rem">
        <div>
          <div class="field-lbl">Approx. Users</div>
          <input type="number" id="cp_user_count" min="0" placeholder="e.g. 45"
            value="${p.approx_user_count != null ? p.approx_user_count : ''}"
            style="width:100%;box-sizing:border-box"/>
        </div>
        <div>
          <div class="field-lbl">Approx. Devices / Endpoints</div>
          <input type="number" id="cp_device_count" min="0" placeholder="e.g. 60"
            value="${p.approx_device_count != null ? p.approx_device_count : ''}"
            style="width:100%;box-sizing:border-box"/>
        </div>
        <div>
          <div class="field-lbl">Primary MSP / IT Provider</div>
          <input type="text" id="cp_primary_msp" placeholder="e.g. Acme IT Solutions"
            value="${escH(p.primary_msp || '')}"
            style="width:100%;box-sizing:border-box"/>
        </div>
        <div>
          <div class="field-lbl">Remote Workforce</div>
          <select id="cp_remote">
            <option value="">— Unknown —</option>
            ${['0–10%','10–25%','25–50%','50–75%','75–100%'].map(v =>
              `<option value="${v}" ${p.remote_workforce_pct === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
        <div>
          <div class="field-lbl">Cloud Adoption</div>
          <select id="cp_cloud">
            <option value="">— Unknown —</option>
            ${['None','Partial','Primarily Cloud','Cloud-First'].map(v =>
              `<option value="${v}" ${p.cloud_adoption === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
      </div>

      <!-- ── Data & Compliance ── -->
      <div style="padding:.65rem 1.25rem;background:var(--bg);border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
        <span style="font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.06em">Data & Compliance</span>
      </div>
      <div style="padding:1rem 1.25rem 1.25rem">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:.875rem">
          <div>
            <div class="field-lbl">Data Sensitivity</div>
            <select id="cp_data_sensitivity">
              <option value="">— Unassessed —</option>
              ${['Low','Medium','High','Critical'].map(v =>
                `<option value="${v}" ${p.data_sensitivity === v ? 'selected' : ''}>${v}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <div class="field-lbl">Third-Party Vendor Count</div>
            <select id="cp_vendors">
              <option value="">— Unknown —</option>
              ${['0–5','6–20','21–50','51+'].map(v =>
                `<option value="${v}" ${p.vendor_count_band === v ? 'selected' : ''}>${v}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div style="margin-bottom:.875rem">
          <div class="field-lbl">Data Types Handled</div>
          <div class="checkbox-group">
            <label class="cb-item ${p.handles_pii ? 'checked' : ''}" onclick="toggleCb(this,'cp_pii')">
              <input type="checkbox" id="cp_pii" ${p.handles_pii ? 'checked' : ''}> PII / Personal Data
            </label>
            <label class="cb-item ${p.handles_payment_data ? 'checked' : ''}" onclick="toggleCb(this,'cp_payment')">
              <input type="checkbox" id="cp_payment" ${p.handles_payment_data ? 'checked' : ''}> Payment Card Data (PCI-DSS)
            </label>
            <label class="cb-item ${p.handles_health_data ? 'checked' : ''}" onclick="toggleCb(this,'cp_health')">
              <input type="checkbox" id="cp_health" ${p.handles_health_data ? 'checked' : ''}> Health / Medical Data
            </label>
          </div>
        </div>
        <div>
          <div class="field-lbl">Regulatory / Compliance Requirements</div>
          <div class="checkbox-group">
            ${(typeof ORG_REGULATORY !== 'undefined' ? ORG_REGULATORY : []).map(r => {
              const cbId = 'cp_reg_' + r.replace(/[^a-z0-9]/gi,'_');
              return `<label class="cb-item ${regSelected.includes(r) ? 'checked' : ''}" onclick="toggleCb(this,'${cbId}')">
                <input type="checkbox" id="${cbId}" ${regSelected.includes(r) ? 'checked' : ''}> ${escH(r)}
              </label>`;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- ── IT Maturity ── -->
      <div style="padding:.65rem 1.25rem;background:var(--bg);border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
        <span style="font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.06em">IT Maturity</span>
      </div>
      <div style="padding:1rem 1.25rem 1.25rem;display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
        <div>
          <div class="field-lbl">IT Maturity Level</div>
          <select id="cp_maturity">
            <option value="">— Unassessed —</option>
            ${['Reactive','Developing','Defined','Managed','Optimizing'].map(v =>
              `<option value="${v}" ${p.it_maturity === v ? 'selected' : ''}>${v}</option>`
            ).join('')}
          </select>
        </div>
        <div style="display:flex;align-items:center;padding-top:18px">
          <label class="cb-item ${p.critical_vendor_dependency ? 'checked' : ''}" onclick="toggleCb(this,'cp_crit_vendor')" style="flex:1">
            <input type="checkbox" id="cp_crit_vendor" ${p.critical_vendor_dependency ? 'checked' : ''}> Critical vendor dependency
          </label>
        </div>
      </div>

      <!-- ── Notes ── -->
      <div style="padding:.65rem 1.25rem;background:var(--bg);border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
        <span style="font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.06em">Notes</span>
      </div>
      <div style="padding:1rem 1.25rem 1.25rem">
        <textarea id="cp_notes" rows="3"
          style="width:100%;box-sizing:border-box;font-size:13px;border:1px solid var(--border);border-radius:7px;padding:.6rem .75rem;color:var(--text);resize:vertical;font-family:inherit"
          placeholder="Any additional context — known risks, upcoming changes, special data handling, key dependencies…">${escH(p.notes || '')}</textarea>
      </div>

      <!-- Save footer -->
      <div style="padding:.875rem 1.25rem;background:var(--bg);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:1rem">
        <div style="font-size:11px;color:var(--muted)">All fields optional — save at any time to update your risk context</div>
        <button class="btn btn-primary" onclick="cpSave()" id="cpSaveBtn">Save Profile</button>
      </div>
    </div>

    <!-- Step 2 CTA -->
    <div class="card" style="padding:1.25rem;display:flex;align-items:center;gap:1rem;cursor:pointer;border:2px solid var(--cyan)"
      onclick="setNav('techstack')"
      onmouseover="this.style.boxShadow='0 4px 16px rgba(7,180,217,.2)'"
      onmouseout="this.style.boxShadow=''">
      <div style="font-size:2rem;flex-shrink:0">🖥️</div>
      <div style="flex:1">
        <div style="font-weight:700;color:var(--navy);font-size:14px;margin-bottom:2px">Next: Technology Stack Survey</div>
        <div style="font-size:12px;color:var(--muted)">Inventory your security tools — answers auto-populate CIS Controls, NIST, and Insurance Readiness assessments</div>
      </div>
      <div style="font-size:22px;color:var(--cyan);font-weight:700;flex-shrink:0">→</div>
    </div>

  </div>`;
}

// Refresh sub-industry dropdown when industry changes
function cpUpdateSubIndustry() {
  const industry = document.getElementById('cp_industry')?.value;
  const subs = (typeof ORG_SUB_INDUSTRIES !== 'undefined' ? ORG_SUB_INDUSTRIES[industry] : null) || [];
  const sel  = document.getElementById('cp_sub_industry');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Select —</option>' +
    subs.map(s => `<option value="${s}">${s}</option>`).join('');
}

// Save profile to Supabase
async function cpSave() {
  const btn = document.getElementById('cpSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  try {
    const regChecked = (typeof ORG_REGULATORY !== 'undefined' ? ORG_REGULATORY : [])
      .filter(r => document.getElementById('cp_reg_' + r.replace(/[^a-z0-9]/gi,'_'))?.checked)
      .join(',');

    const rawUsers   = document.getElementById('cp_user_count')?.value;
    const rawDevices = document.getElementById('cp_device_count')?.value;
    const userCount   = rawUsers   !== '' ? parseInt(rawUsers,   10) : null;
    const deviceCount = rawDevices !== '' ? parseInt(rawDevices, 10) : null;

    const row = {
      org_id:                     currentOrg.id,
      employee_count_band:        document.getElementById('cp_employees')?.value        || null,
      annual_revenue_band:        document.getElementById('cp_revenue')?.value          || null,
      org_structure:              document.getElementById('cp_org_structure')?.value    || null,
      sub_industry:               document.getElementById('cp_sub_industry')?.value     || null,
      geographic_presence:        document.getElementById('cp_geo')?.value              || null,
      remote_workforce_pct:       document.getElementById('cp_remote')?.value           || null,
      data_sensitivity:           document.getElementById('cp_data_sensitivity')?.value || null,
      handles_pii:                document.getElementById('cp_pii')?.checked            || false,
      handles_payment_data:       document.getElementById('cp_payment')?.checked        || false,
      handles_health_data:        document.getElementById('cp_health')?.checked         || false,
      regulatory_scope:           regChecked || null,
      it_maturity:                document.getElementById('cp_maturity')?.value         || null,
      cloud_adoption:             document.getElementById('cp_cloud')?.value            || null,
      vendor_count_band:          document.getElementById('cp_vendors')?.value          || null,
      critical_vendor_dependency: document.getElementById('cp_crit_vendor')?.checked   || false,
      notes:                      document.getElementById('cp_notes')?.value?.trim()    || null,
      approx_user_count:          isNaN(userCount)   ? null : userCount,
      approx_device_count:        isNaN(deviceCount) ? null : deviceCount,
      primary_msp:                document.getElementById('cp_primary_msp')?.value?.trim() || null,
      managed_by_org_id:          orgProfiles[currentOrg.id]?.managed_by_org_id || null,
    };

    // Also update org.industry if changed
    const selIndustry = document.getElementById('cp_industry')?.value;
    if (selIndustry && selIndustry !== currentOrg.industry) {
      await sb.updateOrg(currentOrg.id, { industry: selIndustry, updated_at: new Date().toISOString() });
      const idx = allOrgs.findIndex(o => o.id === currentOrg.id);
      if (idx !== -1) allOrgs[idx].industry = selIndustry;
      currentOrg = allOrgs.find(o => o.id === currentOrg.id) || currentOrg;
    }

    await sb.profiles.upsert(row);
    await loadOrgProfiles();
    auditLog('profile_updated', 'org', currentOrg.name, { org_id: currentOrg.id });
    toast('✓ Company profile saved', '#15803d');
    // Invalidate gap register + pricing caches so headcount reflects immediately on next visit
    if (typeof grState !== 'undefined') grState.loaded = false;
    if (typeof psState !== 'undefined') psState.loaded = false;

    // Re-render to show/refresh Risk Context card
    const mc = document.getElementById('mainContent');
    if (mc && activeNav === 'company_profile') mc.innerHTML = renderCompanyProfile();
  } catch (e) {
    toast('Save failed: ' + e.message, '#dc2626');
    const b = document.getElementById('cpSaveBtn');
    if (b) { b.disabled = false; b.textContent = 'Save Profile'; }
  }
}

// Risk Context interpretation — drives the summary card
function _cpRiskContext(p) {
  const sensitivity  = p.data_sensitivity;
  const regs         = (p.regulatory_scope || '').split(',').map(s => s.trim()).filter(r => r && r !== 'None');
  const hasPayment   = !!p.handles_payment_data;
  const hasHealth    = !!p.handles_health_data;
  const hasPii       = !!p.handles_pii;
  const critVendor   = !!p.critical_vendor_dependency;

  const flags = [];
  if (hasPayment)                       flags.push({ label: 'PCI-DSS in scope',         bg: '#fef3c7', col: '#92400e' });
  if (hasHealth)                        flags.push({ label: 'Health data obligations',   bg: '#fef3c7', col: '#92400e' });
  if (regs.includes('GDPR'))            flags.push({ label: 'GDPR obligations',          bg: '#dbeafe', col: '#1e40af' });
  if (regs.includes('CCPA'))            flags.push({ label: 'CCPA obligations',          bg: '#dbeafe', col: '#1e40af' });
  if (regs.includes('APRA CPS 234'))    flags.push({ label: 'APRA CPS 234',             bg: '#ede9fe', col: '#5b21b6' });
  if (regs.some(r => r.startsWith('CMMC'))) flags.push({ label: 'CMMC in scope',        bg: '#ede9fe', col: '#5b21b6' });
  if (critVendor)                       flags.push({ label: 'Critical vendor exposure',  bg: '#fee2e2', col: '#991b1b' });

  const isHigh = sensitivity === 'High' || sensitivity === 'Critical' || hasPayment || hasHealth || regs.length >= 2;
  const isMed  = sensitivity === 'Medium' || hasPii || regs.length >= 1;

  if (isHigh) {
    return {
      tier: 'CIS IG2 Recommended',
      icon: '🔴',
      color: '#dc2626',
      summary: `Based on your data profile${sensitivity ? ' (<strong>' + sensitivity + '</strong> sensitivity)' : ''} and compliance requirements, this organisation warrants <strong>CIS Implementation Group 2</strong> controls — 74 safeguards covering asset management, access control, data protection, logging, and incident response. Run a CIS Controls assessment to establish your baseline and build a POAM for the gaps.`,
      flags,
    };
  }
  if (isMed) {
    return {
      tier: 'CIS IG1 Baseline',
      icon: '🟡',
      color: '#d97706',
      summary: `Your profile indicates <strong>CIS IG1</strong> is the right starting point — 56 foundational safeguards covering inventory, access control, data protection, and incident response. With personal data in scope, prioritise Safeguard 3 (data protection) and Safeguard 5 (account management) first. Run the Technology Stack survey to identify quick wins before your CIS assessment.`,
      flags,
    };
  }
  return {
    tier: 'CIS IG1 Baseline',
    icon: '🟢',
    color: '#15803d',
    summary: `A <strong>CIS IG1 baseline</strong> is well-matched to your current risk profile. Start with the Technology Stack survey to pre-populate your assessments, then run a CIS Quick Check to establish your posture score.`,
    flags,
  };
}

// ============================================================
// WINDOW EXPORTS
// ============================================================
window.renderCompanyProfile = renderCompanyProfile;
window.cpSave               = cpSave;
window.cpUpdateSubIndustry  = cpUpdateSubIndustry;
