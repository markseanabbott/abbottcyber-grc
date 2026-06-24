// ============================================================
// PRICING SCHEDULE (pricing_schedule.js)
// All rates stored and displayed as MONTHLY (per user/device/month or flat/month).
// ma_cdd.js multiplies × 12 when converting to annual cost estimates.
// ============================================================

const PS_GROUPS = [
  { label:'Identity & Access', types:[
    { value:'mfa',          label:'MFA',                          model:'perUser' },
    { value:'pam',          label:'PAM',                          model:'perUser' },
  ]},
  { label:'Endpoint & Detection', types:[
    { value:'edr',          label:'EDR',                          model:'perEndpoint' },
    { value:'mdr_device',   label:'MDR — Device',                 model:'perEndpoint' },
    { value:'mdr_identity', label:'MDR — Identity',               model:'perUser' },
    { value:'mdr_soc',      label:'MDR / SOC',                    model:'fixed' },
  ]},
  { label:'Email & Messaging', types:[
    { value:'email',            label:'Email Security',           model:'perUser' },
    { value:'email_backup',     label:'Email Backup',             model:'perUser' },
    { value:'email_archive',    label:'Email Archive / eDiscovery', model:'perUser' },
    { value:'email_dlp',        label:'Email DLP',                model:'perUser' },
    { value:'email_encryption', label:'Email Encryption',         model:'perUser' },
  ]},
  { label:'Network & Infrastructure', types:[
    { value:'ngfw',          label:'NGFW',                        model:'fixed' },
    { value:'cspm',          label:'CSPM',                        model:'fixed' },
    { value:'vuln_external', label:'Vuln Scan — External',        model:'fixed' },
    { value:'vuln_internal', label:'Vuln Scan — Internal',        model:'fixed' },
    { value:'vuln_scanner',  label:'Vuln Scan (general)',         model:'fixed' },
    { value:'asc_external',  label:'ASC Scan — External (PCI)',   model:'fixed' },
  ]},
  { label:'Data Protection', types:[
    { value:'dlp',      label:'Data Loss Prevention',             model:'perUser' },
    { value:'pii_scan', label:'PII Scanning',                     model:'fixed' },
  ]},
  { label:'Training & Awareness', types:[
    { value:'sat', label:'Security Awareness Training',           model:'perUser' },
  ]},
  { label:'Professional Services', types:[
    { value:'pentest_internal',    label:'Pen Testing — Internal', model:'fixed' },
    { value:'pentest_external',    label:'Pen Testing — External', model:'fixed' },
    { value:'vciso',               label:'Virtual CISO',           model:'fixed' },
    { value:'security_assessment', label:'Security Assessment',    model:'fixed' },
    { value:'tabletop',            label:'Tabletop Exercises',     model:'fixed' },
  ]},
];

const PS_ALL_TYPES = PS_GROUPS.flatMap(g => g.types);
const PS_TYPE_META = Object.fromEntries(PS_ALL_TYPES.map(t => [t.value, t]));

const PS_MODELS = [
  { value:'perUser',     label:'/ user / mo' },
  { value:'perEndpoint', label:'/ device / mo' },
  { value:'fixed',       label:'flat / mo' },
];

const PS_OT_MODELS = [
  { value:'fixed',       label:'flat fee' },
  { value:'perUser',     label:'per user' },
  { value:'perEndpoint', label:'per device' },
];

const PS_TEMPLATE_EXAMPLES = [
  { name:'MFA (e.g. Entra ID / Duo / Okta)',             vendor:'', sku:'', tool_type:'mfa',               model:'perUser',     rate_low:3,    rate_high:6,    one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'Often bundled with M365 BP' },
  { name:'PAM (e.g. 1Password Business)',                vendor:'', sku:'', tool_type:'pam',               model:'perUser',     rate_low:4,    rate_high:10,   one_time_low:500,  one_time_high:2000, covers:'',                                        notes:'Add onboarding to one-time' },
  { name:'EDR (e.g. CrowdStrike Falcon Go)',             vendor:'', sku:'', tool_type:'edr',               model:'perEndpoint', rate_low:4,    rate_high:12,   one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'Falcon Go ~$4/endpoint/mo' },
  { name:'MDR — Device (managed EDR)',                   vendor:'', sku:'', tool_type:'mdr_device',        model:'perEndpoint', rate_low:10,   rate_high:20,   one_time_low:0,    one_time_high:0,    covers:'edr',                                     notes:'Covers EDR as bundle' },
  { name:'MDR — Identity',                              vendor:'', sku:'', tool_type:'mdr_identity',       model:'perUser',     rate_low:5,    rate_high:10,   one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'' },
  { name:'MDR / SOC (flat monthly)',                    vendor:'', sku:'', tool_type:'mdr_soc',            model:'fixed',       rate_low:2000, rate_high:8000, one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'Often bundles EDR + identity' },
  { name:'Barracuda Advanced',                          vendor:'Barracuda', sku:'', tool_type:'email',     model:'perUser',     rate_low:2,    rate_high:3,    one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'Basic email security' },
  { name:'Barracuda Premium',                           vendor:'Barracuda', sku:'', tool_type:'email',     model:'perUser',     rate_low:3,    rate_high:5,    one_time_low:0,    one_time_high:0,    covers:'email_backup',                            notes:'Adds email backup' },
  { name:'Barracuda Premium Plus',                      vendor:'Barracuda', sku:'', tool_type:'email',     model:'perUser',     rate_low:5,    rate_high:7,    one_time_low:0,    one_time_high:0,    covers:'email_backup|email_archive|email_dlp|email_encryption', notes:'Full suite' },
  { name:'Email Backup',                                vendor:'', sku:'', tool_type:'email_backup',       model:'perUser',     rate_low:1,    rate_high:3,    one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'' },
  { name:'Email Archive / eDiscovery',                  vendor:'', sku:'', tool_type:'email_archive',      model:'perUser',     rate_low:1.5,  rate_high:4,    one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'Legal hold & compliance' },
  { name:'Email DLP',                                   vendor:'', sku:'', tool_type:'email_dlp',          model:'perUser',     rate_low:2,    rate_high:5,    one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'' },
  { name:'Email Encryption',                            vendor:'', sku:'', tool_type:'email_encryption',   model:'perUser',     rate_low:2,    rate_high:5,    one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'' },
  { name:'NGFW',                                        vendor:'', sku:'', tool_type:'ngfw',               model:'fixed',       rate_low:100,  rate_high:500,  one_time_low:500,  one_time_high:2000, covers:'',                                        notes:'Subscription + support' },
  { name:'CSPM (e.g. Defender for Cloud)',              vendor:'', sku:'', tool_type:'cspm',               model:'fixed',       rate_low:125,  rate_high:600,  one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'Basic tier often free' },
  { name:'Vuln Scan — External',                        vendor:'', sku:'', tool_type:'vuln_external',      model:'fixed',       rate_low:100,  rate_high:300,  one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'Internet-facing assets' },
  { name:'Vuln Scan — Internal',                        vendor:'', sku:'', tool_type:'vuln_internal',      model:'fixed',       rate_low:100,  rate_high:400,  one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'Internal network scans' },
  { name:'ASC Scan — External (PCI)',                   vendor:'', sku:'', tool_type:'asc_external',       model:'fixed',       rate_low:80,   rate_high:250,  one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'PCI ASV quarterly scans' },
  { name:'Data Loss Prevention',                        vendor:'', sku:'', tool_type:'dlp',                model:'perUser',     rate_low:2,    rate_high:6,    one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'' },
  { name:'PII Scanning',                                vendor:'', sku:'', tool_type:'pii_scan',           model:'fixed',       rate_low:100,  rate_high:300,  one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'Data discovery & classification' },
  { name:'Security Awareness Training',                 vendor:'', sku:'', tool_type:'sat',                model:'perUser',     rate_low:2,    rate_high:4,    one_time_low:500,  one_time_high:1500, covers:'',                                        notes:'KnowBe4 / Proofpoint' },
  { name:'Pen Testing — Internal',                      vendor:'', sku:'', tool_type:'pentest_internal',   model:'fixed',       rate_low:0,    rate_high:0,    one_time_low:4000, one_time_high:15000,covers:'',                                        notes:'Annual engagement — use one-time' },
  { name:'Pen Testing — External',                      vendor:'', sku:'', tool_type:'pentest_external',   model:'fixed',       rate_low:0,    rate_high:0,    one_time_low:3000, one_time_high:10000,covers:'',                                        notes:'Annual engagement — use one-time' },
  { name:'Virtual CISO',                                vendor:'', sku:'', tool_type:'vciso',              model:'fixed',       rate_low:2000, rate_high:8000, one_time_low:0,    one_time_high:0,    covers:'',                                        notes:'Monthly retainer' },
  { name:'Security Assessment',                         vendor:'', sku:'', tool_type:'security_assessment',model:'fixed',       rate_low:0,    rate_high:0,    one_time_low:3000, one_time_high:12000,covers:'',                                        notes:'Project — use one-time' },
  { name:'Tabletop Exercises',                          vendor:'', sku:'', tool_type:'tabletop',           model:'fixed',       rate_low:0,    rate_high:0,    one_time_low:1500, one_time_high:5000, covers:'',                                        notes:'Per exercise — use one-time' },
];

// ── STATE ────────────────────────────────────────────────────

let psState = {
  rows:[],
  parentRows:[],
  loaded:false,
  saving:false,
  importRows:null,
};

// ── LOAD ─────────────────────────────────────────────────────

async function psLoad() {
  psState.loaded = false;
  psState.rows = []; psState.parentRows = [];
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
  try {
    const own = await sbFetch(`pricing_schedule?org_id=eq.${currentOrg.id}&order=tool_type.asc,name.asc`, 'GET');
    psState.rows = (own || []).map(r => ({ ...r, covers: r.covers || [], _dirty:false, _new:false, _deleted:false }));
    if (currentOrg.tier === 'father' && currentOrg.parent_id) {
      const par = await sbFetch(`pricing_schedule?org_id=eq.${currentOrg.parent_id}&order=tool_type.asc,name.asc`, 'GET');
      psState.parentRows = (par || []).map(r => ({ ...r, covers: r.covers || [] }));
    }
    psState.loaded = true;
  } catch(e) {
    psState.loaded = true;
    toast('Failed to load pricing schedule', '#dc2626');
  }
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

// ── RENDER ───────────────────────────────────────────────────

function renderPricingSchedule() {
  const tier     = currentOrg?.tier;
  const isFather = tier === 'father';
  const parentName = allOrgs?.find(o => o.id === currentOrg?.parent_id)?.name || 'MSP';

  if (!psState.loaded) {
    return `${renderTierBanner()}
    <div style="text-align:center;padding:3rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,0.2);border-top-color:var(--navy);width:24px;height:24px;margin:0 auto 1rem"></div>
      <div style="font-size:13px;font-weight:700;color:var(--text)">Loading pricing schedule…</div>
    </div>`;
  }

  const activeRows = psState.rows.filter(r => !r._deleted);

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">💲 Pricing Schedule</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name||'')} · All rates are <strong>monthly</strong></div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
      <label class="btn btn-outline" style="cursor:pointer;margin:0;font-size:11px">
        ↑ Import CSV
        <input type="file" accept=".csv" style="display:none" onchange="psImportFile(this)"/>
      </label>
      <button class="btn btn-outline" style="font-size:11px" onclick="psExportTemplate()">↓ Template</button>
      ${activeRows.length ? `<button class="btn btn-outline" style="font-size:11px" onclick="psExportCurrent()">↓ Export</button>` : ''}
      <button class="btn btn-outline" style="font-size:11px" onclick="psAddRow()">+ Add Row</button>
      <button class="btn btn-cyan" style="font-size:11px" onclick="psSaveAll()" ${psState.saving?'disabled':''}>
        ${psState.saving ? 'Saving…' : 'Save All'}
      </button>
    </div>
  </div>

  ${psState.importRows !== null ? _renderImportPreview() : ''}

  ${isFather && psState.parentRows.length > 0 ? `
  <div class="card" style="padding:10px 14px;background:#e0f2fe;border:1px solid #bae6fd;margin-bottom:10px;font-size:11px;color:#0369a1">
    Inheriting <strong>${psState.parentRows.length} tool${psState.parentRows.length!==1?'s':''}</strong> from <strong>${escH(parentName)}</strong>. Your rows override by type.
  </div>` : ''}

  <div class="card" style="padding:0;margin-bottom:1rem">
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px;min-width:1300px">
        <thead>
          <tr style="background:#f8fafc">
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:155px">Tool type</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:200px">Product / SKU name</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:110px">Vendor</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:85px">SKU #</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:105px">Model</th>
            <th style="text-align:right;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:68px">Mo Low</th>
            <th style="text-align:right;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:68px">Mo High</th>
            <th style="text-align:right;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:78px;color:#7c3aed">One-time</th>
            <th style="text-align:right;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:78px;color:#7c3aed">OT High</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:90px;color:#7c3aed">OT Model</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:170px">Also covers</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:140px">Notes</th>
            <th style="padding:7px 8px;border-bottom:2px solid var(--border);width:32px"></th>
          </tr>
        </thead>
        <tbody>
          ${activeRows.length === 0 && psState.parentRows.length === 0 ? `
          <tr><td colspan="13" style="padding:2rem;text-align:center;color:var(--muted)">
            No entries — click <strong>+ Add Row</strong> or <strong>↑ Import CSV</strong>.
          </td></tr>` : ''}
          ${activeRows.map(r => _renderPSTableRow(r, psState.rows.indexOf(r))).join('')}
        </tbody>
        ${isFather && psState.parentRows.length > 0 ? `
        <tbody>
          <tr><td colspan="13" style="padding:6px 8px;background:#e0f2fe;font-size:10px;font-weight:700;color:#0369a1;border-top:2px solid #bae6fd">
            📋 Inherited from ${escH(parentName)} (read-only — add a row with the same type to override)
          </td></tr>
          ${psState.parentRows.map(r => _renderPSParentRow(r)).join('')}
        </tbody>` : ''}
      </table>
    </div>
    <div style="padding:8px 12px;font-size:10px;color:var(--muted);border-top:1px solid var(--border)">
      <strong>Also covers:</strong> for bundle SKUs (e.g. Barracuda Premium Plus → covers email, email_backup, email_archive, email_dlp, email_encryption). Cost resolution will find this entry for any covered type — no duplicate rows needed.
    </div>
  </div>`;
}

function _renderPSTableRow(r, realIdx) {
  const dirty = r._dirty || r._new;
  const bd = dirty ? 'var(--cyan)' : 'var(--border)';
  return `
  <tr id="ps-row-${realIdx}" style="border-bottom:1px solid #f1f5f9;${dirty?'background:#fefce8;':''}">
    <td style="padding:4px 5px">
      <select style="width:100%;padding:4px 5px;border:1px solid ${bd};border-radius:4px;font-family:inherit;font-size:10px"
        onchange="psRowSet(${realIdx},'tool_type',this.value);psRowAutoModel(${realIdx},this.value)">
        <option value="">— Type —</option>
        ${PS_GROUPS.map(g=>`<optgroup label="${g.label}">
          ${g.types.map(t=>`<option value="${t.value}" ${r.tool_type===t.value?'selected':''}>${t.label}</option>`).join('')}
        </optgroup>`).join('')}
      </select>
    </td>
    <td style="padding:4px 5px">
      <input type="text" value="${escH(r.name||'')}" placeholder="Product name"
        style="width:100%;padding:4px 5px;border:1px solid ${bd};border-radius:4px;font-family:inherit;font-size:10px"
        oninput="psRowSet(${realIdx},'name',this.value)"/>
    </td>
    <td style="padding:4px 5px">
      <input type="text" value="${escH(r.vendor||'')}" placeholder="Vendor"
        style="width:100%;padding:4px 5px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:10px"
        oninput="psRowSet(${realIdx},'vendor',this.value)"/>
    </td>
    <td style="padding:4px 5px">
      <input type="text" value="${escH(r.sku||'')}" placeholder="Part #"
        style="width:100%;padding:4px 5px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:10px"
        oninput="psRowSet(${realIdx},'sku',this.value)"/>
    </td>
    <td style="padding:4px 5px">
      <select style="width:100%;padding:4px 5px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:10px"
        onchange="psRowSet(${realIdx},'model',this.value)">
        ${PS_MODELS.map(m=>`<option value="${m.value}" ${r.model===m.value?'selected':''}>${m.label}</option>`).join('')}
      </select>
    </td>
    <td style="padding:4px 5px">
      <input type="number" min="0" step="0.01" value="${r.rate_low??''}" placeholder="0"
        style="width:100%;padding:4px 5px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:10px;text-align:right"
        oninput="psRowSet(${realIdx},'rate_low',this.value)"/>
    </td>
    <td style="padding:4px 5px">
      <input type="number" min="0" step="0.01" value="${r.rate_high??''}" placeholder="—"
        style="width:100%;padding:4px 5px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:10px;text-align:right"
        oninput="psRowSet(${realIdx},'rate_high',this.value)"/>
    </td>
    <td style="padding:4px 5px">
      <input type="number" min="0" step="1" value="${r.one_time_low??''}" placeholder="0"
        style="width:100%;padding:4px 5px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:10px;text-align:right;color:#7c3aed"
        oninput="psRowSet(${realIdx},'one_time_low',this.value)"/>
    </td>
    <td style="padding:4px 5px">
      <input type="number" min="0" step="1" value="${r.one_time_high??''}" placeholder="—"
        style="width:100%;padding:4px 5px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:10px;text-align:right;color:#7c3aed"
        oninput="psRowSet(${realIdx},'one_time_high',this.value)"/>
    </td>
    <td style="padding:4px 5px">
      <select style="width:100%;padding:4px 5px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:10px;color:#7c3aed"
        onchange="psRowSet(${realIdx},'one_time_model',this.value)">
        ${PS_OT_MODELS.map(m=>`<option value="${m.value}" ${(r.one_time_model||'fixed')===m.value?'selected':''}>${m.label}</option>`).join('')}
      </select>
    </td>
    <td id="ps-covers-${realIdx}" style="padding:4px 5px">
      ${_renderCoversCell(r, realIdx)}
    </td>
    <td style="padding:4px 5px">
      <input type="text" value="${escH(r.notes||'')}" placeholder="Optional"
        style="width:100%;padding:4px 5px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:10px"
        oninput="psRowSet(${realIdx},'notes',this.value)"/>
    </td>
    <td style="padding:4px 5px;text-align:center">
      <button onclick="psRowDelete(${realIdx})" title="Remove"
        style="background:none;border:none;cursor:pointer;color:#dc2626;font-size:14px;padding:2px 4px;line-height:1">✕</button>
    </td>
  </tr>`;
}

function _renderCoversCell(r, realIdx) {
  const covered = r.covers || [];
  return `
  <div style="display:flex;flex-wrap:wrap;gap:3px;align-items:center;min-height:22px">
    ${covered.map(t => {
      const meta = PS_TYPE_META[t];
      return `<span style="display:inline-flex;align-items:center;gap:2px;font-size:9px;padding:1px 5px;background:#e0f2fe;color:#0369a1;border-radius:3px;white-space:nowrap">
        ${escH(meta?.label||t)}
        <span onclick="psRowCoverRemove(${realIdx},'${t}')" style="cursor:pointer;color:#dc2626;font-size:11px;line-height:1">✕</span>
      </span>`;
    }).join('')}
    <select style="font-size:9px;padding:1px 3px;border:1px solid var(--border);border-radius:3px;color:var(--muted);max-width:110px"
      onchange="if(this.value){psRowCoverPick(${realIdx},this.value);this.value=''}">
      <option value="">+ add…</option>
      ${PS_GROUPS.map(g => {
        const opts = g.types.filter(t => t.value !== r.tool_type && !covered.includes(t.value));
        if (!opts.length) return '';
        return `<optgroup label="${g.label}">${opts.map(t=>`<option value="${t.value}">${t.label}</option>`).join('')}</optgroup>`;
      }).join('')}
    </select>
  </div>`;
}

function _renderPSParentRow(r) {
  const typeMeta = PS_TYPE_META[r.tool_type] || {};
  const modelLbl = PS_MODELS.find(m=>m.value===r.model)?.label || r.model;
  const covered  = r.covers || [];
  return `
  <tr style="border-bottom:1px solid #f1f5f9;background:#f8fbff;opacity:0.85">
    <td style="padding:5px 8px;font-size:10px;color:#0369a1;font-weight:700">${escH(typeMeta.label||r.tool_type)}</td>
    <td style="padding:5px 8px;font-size:10px">${escH(r.name)}</td>
    <td style="padding:5px 8px;font-size:10px;color:var(--muted)">${escH(r.vendor||'')}</td>
    <td style="padding:5px 8px;font-size:10px;color:var(--muted)">${escH(r.sku||'')}</td>
    <td style="padding:5px 8px;font-size:10px;color:var(--muted)">${modelLbl}</td>
    <td style="padding:5px 8px;font-size:10px;text-align:right;font-weight:700">${r.rate_low?'$'+r.rate_low:'—'}</td>
    <td style="padding:5px 8px;font-size:10px;text-align:right;color:var(--muted)">${r.rate_high?'$'+r.rate_high:'—'}</td>
    <td style="padding:5px 8px;font-size:10px;text-align:right;color:#7c3aed">${r.one_time_low?'$'+r.one_time_low:'—'}</td>
    <td style="padding:5px 8px;font-size:10px;text-align:right;color:var(--muted)">${r.one_time_high?'$'+r.one_time_high:'—'}</td>
    <td style="padding:5px 8px;font-size:10px;color:#7c3aed">${PS_OT_MODELS.find(m=>m.value===(r.one_time_model||'fixed'))?.label||'flat fee'}</td>
    <td style="padding:5px 8px;font-size:10px">
      ${covered.length ? covered.map(t=>`<span style="font-size:8px;padding:1px 4px;background:#e0f2fe;color:#0369a1;border-radius:3px;margin-right:2px">${escH(PS_TYPE_META[t]?.label||t)}</span>`).join('') : '—'}
    </td>
    <td style="padding:5px 8px;font-size:10px;color:var(--muted)">${escH(r.notes||'')}</td>
    <td></td>
  </tr>`;
}

// ── ROW ACTIONS ──────────────────────────────────────────────

function psAddRow() {
  psState.rows.push({ _new:true, _dirty:true, _deleted:false,
    tool_type:'', name:'', vendor:'', sku:'', model:'perUser',
    rate_low:'', rate_high:'', one_time_low:'', one_time_high:'', one_time_model:'fixed',
    covers:[], notes:'' });
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
  setTimeout(() => { const t = document.querySelector('table tbody'); if(t) t.lastElementChild?.scrollIntoView({behavior:'smooth'}); }, 50);
}

function psRowSet(realIdx, field, value) {
  if (!psState.rows[realIdx]) return;
  psState.rows[realIdx][field] = value;
  psState.rows[realIdx]._dirty = true;
}

function psRowAutoModel(realIdx, toolType) {
  const meta = PS_TYPE_META[toolType];
  if (meta?.model && psState.rows[realIdx]) {
    psState.rows[realIdx].model = meta.model;
    const activeRows = psState.rows.filter(r => !r._deleted);
    const displayIdx = activeRows.indexOf(psState.rows[realIdx]);
    const selects    = document.querySelectorAll('tbody tr td:nth-child(5) select');
    if (selects[displayIdx]) selects[displayIdx].value = meta.model;
  }
}

function psRowCoverPick(realIdx, toolType) {
  const row = psState.rows[realIdx];
  if (!row) return;
  const covers = [...(row.covers || [])];
  if (!covers.includes(toolType)) covers.push(toolType);
  row.covers = covers;
  row._dirty = true;
  const cell = document.getElementById(`ps-covers-${realIdx}`);
  if (cell) cell.innerHTML = _renderCoversCell(row, realIdx);
}

function psRowCoverRemove(realIdx, toolType) {
  const row = psState.rows[realIdx];
  if (!row) return;
  row.covers = (row.covers || []).filter(t => t !== toolType);
  row._dirty = true;
  const cell = document.getElementById(`ps-covers-${realIdx}`);
  if (cell) cell.innerHTML = _renderCoversCell(row, realIdx);
}

function psRowDelete(realIdx) {
  const row = psState.rows[realIdx];
  if (!row) return;
  if (row._new) {
    psState.rows.splice(realIdx, 1);
  } else {
    row._deleted = true;
  }
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

async function psSaveAll() {
  const toCreate = psState.rows.filter(r => r._new && !r._deleted);
  const toUpdate = psState.rows.filter(r => !r._new && r._dirty && !r._deleted);
  const toDelete = psState.rows.filter(r => !r._new && r._deleted);
  if (!toCreate.length && !toUpdate.length && !toDelete.length) {
    toast('Nothing to save', '#6b7280'); return;
  }
  const invalid = psState.rows.filter(r => !r._deleted && (!r.tool_type || !r.name));
  if (invalid.length) { toast(`${invalid.length} row${invalid.length!==1?'s':''} missing type or name`, '#dc2626'); return; }
  psState.saving = true;
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
  let ok = 0;
  try {
    for (const r of toCreate) {
      const res = await sbFetch('pricing_schedule','POST',_psBuildPayload(r),{'Prefer':'return=representation'});
      const created = Array.isArray(res)?res[0]:res;
      if (created?.id) Object.assign(r, created, {_new:false,_dirty:false,_deleted:false,covers:created.covers||[]});
      ok++;
    }
    for (const r of toUpdate) {
      await sbFetch(`pricing_schedule?id=eq.${r.id}`,'PATCH',_psBuildPayload(r));
      r._dirty = false; ok++;
    }
    for (const r of toDelete) {
      await sbFetch(`pricing_schedule?id=eq.${r.id}`,'DELETE');
      ok++;
    }
    psState.rows = psState.rows.filter(r => !r._deleted);
    toast(`Saved ${ok} change${ok!==1?'s':''} ✓`, '#15803d');
  } catch(e) {
    toast('Save failed — ' + (e.message||'error'), '#dc2626');
  }
  psState.saving = false;
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

function _psBuildPayload(r) {
  return {
    org_id:        currentOrg.id,
    name:          r.name,
    vendor:        r.vendor        || null,
    sku:           r.sku           || null,
    tool_type:     r.tool_type,
    model:         r.model         || 'fixed',
    rate_low:      parseFloat(r.rate_low)       || 0,
    rate_high:     parseFloat(r.rate_high) > 0   ? parseFloat(r.rate_high)      : null,
    one_time_low:  parseFloat(r.one_time_low)   || 0,
    one_time_high: parseFloat(r.one_time_high) > 0 ? parseFloat(r.one_time_high) : null,
    one_time_model: ['fixed','perUser','perEndpoint'].includes(r.one_time_model) ? r.one_time_model : 'fixed',
    covers:        Array.isArray(r.covers) ? r.covers : [],
    notes:         r.notes         || null,
    active:        true,
  };
}

// ── IMPORT / EXPORT ──────────────────────────────────────────

const PS_CSV_HEADERS = ['name','vendor','sku','tool_type','model','rate_low','rate_high','one_time_low','one_time_high','one_time_model','covers','notes'];

function _csvEscape(v) {
  const s = String(v ?? '');
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g,'""')}"` : s;
}

function _downloadCsv(content, filename) {
  const blob = new Blob([content], {type:'text/csv;charset=utf-8;'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function psExportTemplate() {
  const validTypes = PS_ALL_TYPES.map(t=>t.value).join(' | ');
  const lines = [
    '# Abbott Cyber GRC — Pricing Schedule Import Template',
    '# All rates are MONTHLY. Use one_time_low/high for setup fees, onboarding, or engagement costs.',
    `# tool_type: ${validTypes}`,
    '# model: perUser | perEndpoint | fixed',
    '# covers: pipe-separated types this SKU also satisfies, e.g. email_backup|email_archive',
    '# Lines starting with # are ignored.',
    PS_CSV_HEADERS.join(','),
    ...PS_TEMPLATE_EXAMPLES.map(r => PS_CSV_HEADERS.map(h => {
      if (h === 'covers') return _csvEscape(typeof r.covers === 'string' ? r.covers : (r.covers||[]).join('|'));
      return _csvEscape(r[h]??'');
    }).join(',')),
  ];
  _downloadCsv(lines.join('\n'), 'pricing_schedule_template.csv');
}

function psExportCurrent() {
  const rows = psState.rows.filter(r => !r._deleted && !r._new);
  if (!rows.length) { toast('No saved entries to export', '#b45309'); return; }
  const header = PS_CSV_HEADERS.join(',');
  const body   = rows.map(r => PS_CSV_HEADERS.map(h => {
    if (h === 'covers') return _csvEscape((r.covers||[]).join('|'));
    return _csvEscape(r[h]??'');
  }).join(',')).join('\n');
  const safeOrg = (currentOrg?.name||'org').replace(/[^a-zA-Z0-9]/g,'_');
  _downloadCsv(header+'\n'+body, `pricing_schedule_${safeOrg}.csv`);
}

function psImportFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    psState.importRows = _parseCsvImport(e.target.result);
    input.value = '';
    document.getElementById('mainContent').innerHTML = renderPricingSchedule();
  };
  reader.readAsText(file);
}

function _parseCsvImport(text) {
  const validTypes  = new Set(PS_ALL_TYPES.map(t=>t.value));
  const validModels = new Set(['perUser','perEndpoint','fixed']);
  const lines = text.split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
  if (!lines.length) return [];
  const headerLine = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g,''));
  return lines.slice(1).map(line => {
    const raw = _splitCsvLine(line);
    const obj = {};
    headerLine.forEach((h,j) => { obj[h] = (raw[j]||'').trim(); });
    const errors = [];
    if (!obj.name)                      errors.push('name required');
    if (!validTypes.has(obj.tool_type)) errors.push(`tool_type "${obj.tool_type}" not recognised`);
    if (!validModels.has(obj.model))    errors.push(`model "${obj.model}" not recognised`);
    const lo = parseFloat(obj.rate_low);
    if (isNaN(lo) || lo < 0)            errors.push('rate_low must be ≥ 0');
    const coversRaw = (obj.covers||'').split('|').map(s=>s.trim()).filter(Boolean);
    const badCovers = coversRaw.filter(t => !validTypes.has(t));
    if (badCovers.length) errors.push(`covers unknown: ${badCovers.join(', ')}`);
    return {
      ...obj,
      rate_low:      isNaN(lo) ? null : lo,
      rate_high:     parseFloat(obj.rate_high)     > 0 ? parseFloat(obj.rate_high)     : null,
      one_time_low:  parseFloat(obj.one_time_low)  > 0 ? parseFloat(obj.one_time_low)  : 0,
      one_time_high: parseFloat(obj.one_time_high) > 0 ? parseFloat(obj.one_time_high) : null,
      one_time_model: ['fixed','perUser','perEndpoint'].includes(obj.one_time_model) ? obj.one_time_model : 'fixed',
      covers:        coversRaw.filter(t => validTypes.has(t)),
      _valid: errors.length === 0, _errors: errors,
    };
  });
}

function _splitCsvLine(line) {
  const result=[]; let cur=''; let inQ=false;
  for (let i=0;i<line.length;i++) {
    const c=line[i];
    if (c==='"'){if(inQ&&line[i+1]==='"'){cur+='"';i++;}else inQ=!inQ;}
    else if(c===','&&!inQ){result.push(cur);cur='';}
    else cur+=c;
  }
  result.push(cur);
  return result;
}

function _renderImportPreview() {
  const rows   = psState.importRows || [];
  const valid  = rows.filter(r=>r._valid);
  const invalid= rows.filter(r=>!r._valid);
  const mLbl   = { perUser:'per user/mo', perEndpoint:'per device/mo', fixed:'flat/mo' };
  return `
  <div class="card" style="margin-bottom:1rem;border:2px solid var(--cyan)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="font-size:13px;font-weight:700">Import Preview — ${rows.length} row${rows.length!==1?'s':''} parsed</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">
          <span style="color:#15803d;font-weight:700">${valid.length} valid</span>
          ${invalid.length?`&nbsp;·&nbsp;<span style="color:#dc2626;font-weight:700">${invalid.length} with errors</span>`:''}
        </div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-outline btn-sm" onclick="psCancelImport()">Cancel</button>
        ${valid.length?`<button class="btn btn-cyan btn-sm" onclick="psImportConfirm()">Import ${valid.length} row${valid.length!==1?'s':''}</button>`:''}
      </div>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px;min-width:650px">
        <thead><tr style="background:#f8fafc">
          <th style="text-align:left;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Status</th>
          <th style="text-align:left;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Type</th>
          <th style="text-align:left;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Name</th>
          <th style="text-align:left;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Model</th>
          <th style="text-align:right;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Mo rate</th>
          <th style="text-align:right;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700;color:#7c3aed">One-time</th>
          <th style="text-align:left;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Also covers</th>
        </tr></thead>
        <tbody>
          ${rows.map(r=>`
          <tr style="border-bottom:1px solid #f1f5f9;background:${r._valid?'#f0fdf4':'#fef2f2'}">
            <td style="padding:5px 8px;vertical-align:top">
              ${r._valid
                ?`<span style="font-size:9px;font-weight:700;color:#15803d;padding:2px 6px;background:#dcfce7;border-radius:3px">✓</span>`
                :`<div style="font-size:9px;font-weight:700;color:#dc2626">✕ Skip</div>
                  <div style="font-size:9px;color:#dc2626;margin-top:2px">${r._errors.map(e=>escH(e)).join('<br>')}</div>`}
            </td>
            <td style="padding:5px 8px;vertical-align:top">
              <span style="font-size:10px;font-weight:700;color:#0369a1;padding:1px 5px;background:#e0f2fe;border-radius:3px">${escH(r.tool_type||'?')}</span>
            </td>
            <td style="padding:5px 8px;vertical-align:top;font-weight:600">${escH(r.name||'—')}</td>
            <td style="padding:5px 8px;vertical-align:top;color:var(--muted)">${escH(mLbl[r.model]||r.model||'—')}</td>
            <td style="padding:5px 8px;vertical-align:top;text-align:right;font-weight:700">
              ${r.rate_low!=null?`$${r.rate_low}${r.rate_high?` – $${r.rate_high}`:''}` : '—'}
            </td>
            <td style="padding:5px 8px;vertical-align:top;text-align:right;color:#7c3aed">
              ${r.one_time_low>0?`$${r.one_time_low}${r.one_time_high?` – $${r.one_time_high}`:''}` : '—'}
            </td>
            <td style="padding:5px 8px;vertical-align:top;font-size:10px;color:#0369a1">
              ${(r.covers||[]).map(t=>escH(PS_TYPE_META[t]?.label||t)).join(', ')||'—'}
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function psCancelImport() {
  psState.importRows = null;
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

async function psImportConfirm() {
  const valid = (psState.importRows||[]).filter(r=>r._valid);
  if (!valid.length) return;
  let imported = 0;
  try {
    for (const r of valid) {
      const payload = { org_id:currentOrg.id, name:r.name, vendor:r.vendor||null,
        sku:r.sku||null, tool_type:r.tool_type, model:r.model,
        rate_low:r.rate_low, rate_high:r.rate_high||null,
        one_time_low:r.one_time_low||0, one_time_high:r.one_time_high||null,
        one_time_model:r.one_time_model||'fixed',
        covers:r.covers||[], notes:r.notes||null, active:true };
      const res = await sbFetch('pricing_schedule','POST',payload,{'Prefer':'return=representation'});
      const row = Array.isArray(res)?res[0]:res;
      if (row?.id) psState.rows.push({...row, covers:row.covers||[], _new:false, _dirty:false, _deleted:false});
      imported++;
    }
    psState.importRows = null;
    toast(`${imported} tool${imported!==1?'s':''} imported ✓`, '#15803d');
  } catch(e) {
    toast(`Import failed after ${imported} — ${e.message||'error'}`, '#dc2626');
  }
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

// ── PUBLIC API ────────────────────────────────────────────────

// Returns the best matching pricing_schedule entry for a given tool_type.
// Checks primary tool_type AND the covers[] array — so a Barracuda Premium Plus
// entry with tool_type='email' and covers=['email_backup','email_archive','email_dlp','email_encryption']
// will be returned when asked for any of those types. No duplicate rows needed.
function psGetForType(toolType) {
  const match = r =>
    r.active !== false && !r._deleted && !r._new &&
    (r.tool_type === toolType || (r.covers || []).includes(toolType));
  const own    = (psState.rows||[]).find(match);
  const parent = (psState.parentRows||[]).find(r =>
    r.active !== false && (r.tool_type === toolType || (r.covers||[]).includes(toolType))
  );
  if (own)    return {...own,    source:'org',    sourceLabel:currentOrg?.name||'this org'};
  if (parent) return {...parent, source:'parent', sourceLabel:allOrgs?.find(o=>o.id===currentOrg?.parent_id)?.name||'MSP'};
  return null;
}

// ── WINDOW EXPORTS ────────────────────────────────────────────

window.renderPricingSchedule = renderPricingSchedule;
window.psLoad                = psLoad;
window.psAddRow              = psAddRow;
window.psRowSet              = psRowSet;
window.psRowAutoModel        = psRowAutoModel;
window.psRowCoverPick        = psRowCoverPick;
window.psRowCoverRemove      = psRowCoverRemove;
window.psRowDelete           = psRowDelete;
window.psSaveAll             = psSaveAll;
window.psGetForType          = psGetForType;
window.psExportTemplate      = psExportTemplate;
window.psExportCurrent       = psExportCurrent;
window.psImportFile          = psImportFile;
window.psImportConfirm       = psImportConfirm;
window.psCancelImport        = psCancelImport;
