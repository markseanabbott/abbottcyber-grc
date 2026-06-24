// ============================================================
// PRICING SCHEDULE (pricing_schedule.js)
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
    { value:'email',         label:'Email Security',              model:'perUser' },
    { value:'email_backup',  label:'Email Backup',                model:'perUser' },
    { value:'email_archive', label:'Email Archive / eDiscovery',  model:'perUser' },
    { value:'email_dlp',     label:'Email DLP',                   model:'perUser' },
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
    { value:'pentest_internal',   label:'Pen Testing — Internal', model:'fixed' },
    { value:'pentest_external',   label:'Pen Testing — External', model:'fixed' },
    { value:'vciso',              label:'Virtual CISO',           model:'fixed' },
    { value:'security_assessment',label:'Security Assessment',    model:'fixed' },
    { value:'tabletop',           label:'Tabletop Exercises',     model:'fixed' },
  ]},
];

// Flat lookup maps derived from groups
const PS_ALL_TYPES = PS_GROUPS.flatMap(g => g.types);
const PS_TYPE_META = Object.fromEntries(PS_ALL_TYPES.map(t => [t.value, t]));

const PS_MODELS = [
  { value:'perUser',     label:'/ user / yr' },
  { value:'perEndpoint', label:'/ device / yr' },
  { value:'fixed',       label:'fixed / yr' },
];

const PS_TEMPLATE_EXAMPLES = [
  { name:'MFA (e.g. Entra ID / Duo)', vendor:'', sku:'', tool_type:'mfa', model:'perUser', rate_low:36, rate_high:72, notes:'~$3–6/user/mo' },
  { name:'PAM (e.g. 1Password Business)', vendor:'', sku:'', tool_type:'pam', model:'perUser', rate_low:48, rate_high:120, notes:'SMB-tier PAM' },
  { name:'EDR (e.g. CrowdStrike Falcon)', vendor:'', sku:'', tool_type:'edr', model:'perEndpoint', rate_low:48, rate_high:144, notes:'Falcon Go ~$60/endpoint/yr' },
  { name:'MDR for Devices', vendor:'', sku:'', tool_type:'mdr_device', model:'perEndpoint', rate_low:120, rate_high:240, notes:'Managed detection & response' },
  { name:'MDR for Identity', vendor:'', sku:'', tool_type:'mdr_identity', model:'perUser', rate_low:60, rate_high:120, notes:'Identity threat detection' },
  { name:'MDR / SOC (flat)', vendor:'', sku:'', tool_type:'mdr_soc', model:'fixed', rate_low:2000, rate_high:8000, notes:'Monthly flat-rate SOC service' },
  { name:'Email Security (e.g. Defender P1)', vendor:'', sku:'', tool_type:'email', model:'perUser', rate_low:24, rate_high:60, notes:'Anti-phishing, DMARC' },
  { name:'Email Backup', vendor:'', sku:'', tool_type:'email_backup', model:'perUser', rate_low:12, rate_high:36, notes:'' },
  { name:'Email Archive / eDiscovery', vendor:'', sku:'', tool_type:'email_archive', model:'perUser', rate_low:18, rate_high:48, notes:'Legal hold, eDiscovery' },
  { name:'Email DLP', vendor:'', sku:'', tool_type:'email_dlp', model:'perUser', rate_low:24, rate_high:60, notes:'' },
  { name:'Email Encryption', vendor:'', sku:'', tool_type:'email_encryption', model:'perUser', rate_low:24, rate_high:60, notes:'' },
  { name:'NGFW', vendor:'', sku:'', tool_type:'ngfw', model:'fixed', rate_low:1200, rate_high:6000, notes:'Annual subscription + support' },
  { name:'CSPM (e.g. Defender for Cloud)', vendor:'', sku:'', tool_type:'cspm', model:'fixed', rate_low:1500, rate_high:8000, notes:'Cloud security posture' },
  { name:'Vuln Scan — External', vendor:'', sku:'', tool_type:'vuln_external', model:'fixed', rate_low:1500, rate_high:4000, notes:'Internet-facing asset scans' },
  { name:'Vuln Scan — Internal', vendor:'', sku:'', tool_type:'vuln_internal', model:'fixed', rate_low:1500, rate_high:5000, notes:'Internal network scans' },
  { name:'ASC Scan — External (PCI)', vendor:'', sku:'', tool_type:'asc_external', model:'fixed', rate_low:1000, rate_high:3000, notes:'PCI ASV quarterly scans' },
  { name:'Data Loss Prevention', vendor:'', sku:'', tool_type:'dlp', model:'perUser', rate_low:24, rate_high:72, notes:'' },
  { name:'PII Scanning', vendor:'', sku:'', tool_type:'pii_scan', model:'fixed', rate_low:1200, rate_high:4000, notes:'Data discovery & classification' },
  { name:'Security Awareness Training', vendor:'', sku:'', tool_type:'sat', model:'perUser', rate_low:18, rate_high:48, notes:'KnowBe4 / Proofpoint etc.' },
  { name:'Pen Testing — Internal', vendor:'', sku:'', tool_type:'pentest_internal', model:'fixed', rate_low:4000, rate_high:15000, notes:'Annual internal pentest' },
  { name:'Pen Testing — External', vendor:'', sku:'', tool_type:'pentest_external', model:'fixed', rate_low:3000, rate_high:10000, notes:'Annual external pentest' },
  { name:'Virtual CISO', vendor:'', sku:'', tool_type:'vciso', model:'fixed', rate_low:2000, rate_high:8000, notes:'Monthly retainer' },
  { name:'Security Assessment', vendor:'', sku:'', tool_type:'security_assessment', model:'fixed', rate_low:3000, rate_high:12000, notes:'One-time project' },
  { name:'Tabletop Exercises', vendor:'', sku:'', tool_type:'tabletop', model:'fixed', rate_low:1500, rate_high:5000, notes:'Per exercise' },
];

// ── STATE ────────────────────────────────────────────────────

let psState = {
  rows:[],        // own org rows; each may have _new / _dirty / _deleted flags
  parentRows:[],  // MSP inherited rows (read-only)
  loaded:false,
  saving:false,
  importRows:null,
};

// ── LOAD ────────────────────────────────────────────────────

async function psLoad() {
  psState.loaded = false;
  psState.rows = []; psState.parentRows = [];
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
  try {
    const own = await sbFetch(`pricing_schedule?org_id=eq.${currentOrg.id}&order=tool_type.asc,name.asc`, 'GET');
    psState.rows = (own || []).map(r => ({ ...r, _dirty:false, _new:false, _deleted:false }));
    if (currentOrg.tier === 'father' && currentOrg.parent_id) {
      const par = await sbFetch(`pricing_schedule?org_id=eq.${currentOrg.parent_id}&order=tool_type.asc,name.asc`, 'GET');
      psState.parentRows = par || [];
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
  const isGf     = tier === 'grandfather';
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
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name||'')} · ${isGf ? 'MSP — rates apply to your full portfolio' : isFather ? 'Company — inherits MSP pricing, override as needed' : 'Platform'}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
      <label class="btn btn-outline" style="cursor:pointer;margin:0;font-size:11px">
        ↑ Import CSV
        <input type="file" accept=".csv" style="display:none" onchange="psImportFile(this)"/>
      </label>
      <button class="btn btn-outline" style="font-size:11px" onclick="psExportTemplate()">↓ Export Template</button>
      ${activeRows.length ? `<button class="btn btn-outline" style="font-size:11px" onclick="psExportCurrent()">↓ Export Current</button>` : ''}
      <button class="btn btn-outline" style="font-size:11px" onclick="psAddRow()">+ Add Row</button>
      <button class="btn btn-cyan" style="font-size:11px" onclick="psSaveAll()" ${psState.saving?'disabled':''}>
        ${psState.saving ? 'Saving…' : 'Save All'}
      </button>
    </div>
  </div>

  ${psState.importRows !== null ? _renderImportPreview() : ''}

  ${isFather && psState.parentRows.length > 0 ? `
  <div class="card" style="padding:10px 14px;background:#e0f2fe;border:1px solid #bae6fd;margin-bottom:10px;font-size:11px;color:#0369a1">
    Inheriting <strong>${psState.parentRows.length} tool${psState.parentRows.length!==1?'s':''}</strong> from <strong>${escH(parentName)}</strong> below. Your rows above override by tool type.
  </div>` : ''}

  <div class="card" style="padding:0;margin-bottom:1rem">
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px;min-width:900px">
        <thead>
          <tr style="background:#f8fafc;position:sticky;top:0;z-index:1">
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:160px">Tool type</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:200px">Product / SKU name</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:130px">Vendor</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:100px">SKU #</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:110px">Model</th>
            <th style="text-align:right;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:80px">Low $</th>
            <th style="text-align:right;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:80px">High $</th>
            <th style="text-align:left;padding:7px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:160px">Notes</th>
            <th style="padding:7px 8px;border-bottom:2px solid var(--border);width:36px"></th>
          </tr>
        </thead>
        <tbody>
          ${activeRows.length === 0 && psState.parentRows.length === 0 ? `
          <tr><td colspan="9" style="padding:2rem;text-align:center;color:var(--muted)">
            No entries yet — click <strong>+ Add Row</strong> or <strong>↑ Import CSV</strong> to get started.
          </td></tr>` : ''}
          ${activeRows.map((r,i) => _renderPSTableRow(r, i)).join('')}
        </tbody>
        ${isFather && psState.parentRows.length > 0 ? `
        <tbody>
          <tr><td colspan="9" style="padding:6px 8px;background:#e0f2fe;font-size:10px;font-weight:700;color:#0369a1;border-top:2px solid #bae6fd">
            📋 Inherited from ${escH(parentName)} (read-only — add a row with the same type above to override)
          </td></tr>
          ${psState.parentRows.map(r => _renderPSParentRow(r)).join('')}
        </tbody>` : ''}
      </table>
    </div>
  </div>`;
}

function _renderPSTableRow(r, idx) {
  const dirty = r._dirty || r._new;
  return `
  <tr style="border-bottom:1px solid #f1f5f9;${dirty?'background:#fefce8':''}${idx%2&&!dirty?' background:#fafafa':''}">
    <td style="padding:4px 6px">
      <select style="width:100%;padding:4px 6px;border:1px solid ${dirty?'var(--cyan)':'var(--border)'};border-radius:4px;font-family:inherit;font-size:11px"
        onchange="psRowSet(${idx},'tool_type',this.value);psRowAutoModel(${idx},this.value)">
        <option value="">— Type —</option>
        ${PS_GROUPS.map(g=>`
          <optgroup label="${g.label}">
            ${g.types.map(t=>`<option value="${t.value}" ${r.tool_type===t.value?'selected':''}>${t.label}</option>`).join('')}
          </optgroup>`).join('')}
      </select>
    </td>
    <td style="padding:4px 6px">
      <input type="text" value="${escH(r.name||'')}" placeholder="Product / SKU name"
        style="width:100%;padding:4px 6px;border:1px solid ${dirty?'var(--cyan)':'var(--border)'};border-radius:4px;font-family:inherit;font-size:11px"
        oninput="psRowSet(${idx},'name',this.value)"/>
    </td>
    <td style="padding:4px 6px">
      <input type="text" value="${escH(r.vendor||'')}" placeholder="e.g. Pax8"
        style="width:100%;padding:4px 6px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:11px"
        oninput="psRowSet(${idx},'vendor',this.value)"/>
    </td>
    <td style="padding:4px 6px">
      <input type="text" value="${escH(r.sku||'')}" placeholder="Part #"
        style="width:100%;padding:4px 6px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:11px"
        oninput="psRowSet(${idx},'sku',this.value)"/>
    </td>
    <td style="padding:4px 6px">
      <select style="width:100%;padding:4px 6px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:11px"
        onchange="psRowSet(${idx},'model',this.value)">
        ${PS_MODELS.map(m=>`<option value="${m.value}" ${r.model===m.value?'selected':''}>${m.label}</option>`).join('')}
      </select>
    </td>
    <td style="padding:4px 6px">
      <input type="number" min="0" step="0.01" value="${r.rate_low??''}" placeholder="0"
        style="width:100%;padding:4px 6px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:11px;text-align:right"
        oninput="psRowSet(${idx},'rate_low',this.value)"/>
    </td>
    <td style="padding:4px 6px">
      <input type="number" min="0" step="0.01" value="${r.rate_high??''}" placeholder="—"
        style="width:100%;padding:4px 6px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:11px;text-align:right"
        oninput="psRowSet(${idx},'rate_high',this.value)"/>
    </td>
    <td style="padding:4px 6px">
      <input type="text" value="${escH(r.notes||'')}" placeholder="Optional"
        style="width:100%;padding:4px 6px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:11px"
        oninput="psRowSet(${idx},'notes',this.value)"/>
    </td>
    <td style="padding:4px 6px;text-align:center">
      <button onclick="psRowDelete(${idx})" title="Remove row"
        style="background:none;border:none;cursor:pointer;color:#dc2626;font-size:14px;padding:2px 4px;line-height:1">✕</button>
    </td>
  </tr>`;
}

function _renderPSParentRow(r) {
  const typeMeta = PS_TYPE_META[r.tool_type] || {};
  const modelLbl = PS_MODELS.find(m=>m.value===r.model)?.label || r.model;
  return `
  <tr style="border-bottom:1px solid #f1f5f9;background:#f8fbff;opacity:0.85">
    <td style="padding:6px 8px;font-size:11px;color:#0369a1;font-weight:700">${escH(typeMeta.label||r.tool_type)}</td>
    <td style="padding:6px 8px;font-size:11px">${escH(r.name)}</td>
    <td style="padding:6px 8px;font-size:11px;color:var(--muted)">${escH(r.vendor||'')}</td>
    <td style="padding:6px 8px;font-size:11px;color:var(--muted)">${escH(r.sku||'')}</td>
    <td style="padding:6px 8px;font-size:11px;color:var(--muted)">${modelLbl}</td>
    <td style="padding:6px 8px;font-size:11px;text-align:right;font-weight:700">$${r.rate_low}</td>
    <td style="padding:6px 8px;font-size:11px;text-align:right;color:var(--muted)">${r.rate_high ? '$'+r.rate_high : '—'}</td>
    <td style="padding:6px 8px;font-size:11px;color:var(--muted)">${escH(r.notes||'')}</td>
    <td></td>
  </tr>`;
}

// ── ROW ACTIONS ──────────────────────────────────────────────

function psAddRow() {
  psState.rows.push({ _new:true, _dirty:true, _deleted:false,
    tool_type:'', name:'', vendor:'', sku:'', model:'perUser', rate_low:'', rate_high:'', notes:'' });
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
  // scroll to bottom of table
  setTimeout(() => { const t = document.querySelector('table tbody'); if (t) t.lastElementChild?.scrollIntoView({ behavior:'smooth' }); }, 50);
}

function psRowSet(idx, field, value) {
  if (!psState.rows[idx]) return;
  psState.rows[idx][field] = value;
  psState.rows[idx]._dirty = true;
}

function psRowAutoModel(idx, toolType) {
  const meta = PS_TYPE_META[toolType];
  if (meta?.model && psState.rows[idx]) {
    psState.rows[idx].model = meta.model;
    // update the model select in-place without full re-render
    const selects = document.querySelectorAll('tbody tr td:nth-child(5) select');
    const activeRows = psState.rows.filter(r => !r._deleted);
    const rowIdx = activeRows.indexOf(psState.rows[idx]);
    if (selects[rowIdx]) selects[rowIdx].value = meta.model;
  }
}

function psRowDelete(idx) {
  const activeRows = psState.rows.filter(r => !r._deleted);
  const row = activeRows[idx];
  if (!row) return;
  if (row._new) {
    psState.rows = psState.rows.filter(r => r !== row);
  } else {
    row._deleted = true;
  }
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

async function psSaveAll() {
  const toCreate  = psState.rows.filter(r => r._new && !r._deleted);
  const toUpdate  = psState.rows.filter(r => !r._new && r._dirty && !r._deleted);
  const toDelete  = psState.rows.filter(r => !r._new && r._deleted);
  if (!toCreate.length && !toUpdate.length && !toDelete.length) {
    toast('Nothing to save', '#6b7280'); return;
  }
  // validate required fields on active rows
  const invalid = psState.rows.filter(r => !r._deleted && (!r.tool_type || !r.name || r.rate_low === '' || r.rate_low === null));
  if (invalid.length) { toast(`${invalid.length} row${invalid.length!==1?'s':''} missing type, name, or low rate`, '#dc2626'); return; }
  psState.saving = true;
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
  let ok = 0, fail = 0;
  try {
    for (const r of toCreate) {
      const p = _psBuildPayload(r);
      const res = await sbFetch('pricing_schedule','POST',p,{'Prefer':'return=representation'});
      const created = Array.isArray(res)?res[0]:res;
      if (created?.id) { Object.assign(r, created, {_new:false,_dirty:false,_deleted:false}); ok++; }
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
    fail++;
    toast('Save failed — ' + (e.message||'error'), '#dc2626');
  }
  psState.saving = false;
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

function _psBuildPayload(r) {
  return {
    org_id:    currentOrg.id,
    name:      r.name,
    vendor:    r.vendor    || null,
    sku:       r.sku       || null,
    tool_type: r.tool_type,
    model:     r.model     || 'fixed',
    rate_low:  parseFloat(r.rate_low)  || 0,
    rate_high: parseFloat(r.rate_high) > 0 ? parseFloat(r.rate_high) : null,
    notes:     r.notes     || null,
    active:    true,
  };
}

// ── IMPORT / EXPORT ─────────────────────────────────────────

const PS_CSV_HEADERS = ['name','vendor','sku','tool_type','model','rate_low','rate_high','notes'];

function _csvEscape(v) {
  const s = String(v ?? '');
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g,'""')}"` : s;
}

function _downloadCsv(content, filename) {
  const blob = new Blob([content], { type:'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function psExportTemplate() {
  const validTypes = PS_ALL_TYPES.map(t=>t.value).join(' | ');
  const lines = [
    '# Abbott Cyber GRC — Pricing Schedule Import Template',
    `# tool_type must be one of: ${validTypes}`,
    '# model must be one of: perUser | perEndpoint | fixed',
    '# rate_low is required. rate_high is optional.',
    '# Lines starting with # are ignored on import.',
    PS_CSV_HEADERS.join(','),
    ...PS_TEMPLATE_EXAMPLES.map(r => PS_CSV_HEADERS.map(h => _csvEscape(r[h]??'')).join(',')),
  ];
  _downloadCsv(lines.join('\n'), 'pricing_schedule_template.csv');
}

function psExportCurrent() {
  const rows = psState.rows.filter(r => !r._deleted && !r._new);
  if (!rows.length) { toast('No saved entries to export', '#b45309'); return; }
  const header = PS_CSV_HEADERS.join(',');
  const body   = rows.map(r => PS_CSV_HEADERS.map(h => _csvEscape(r[h]??'')).join(',')).join('\n');
  const safeOrg = (currentOrg?.name||'org').replace(/[^a-zA-Z0-9]/g,'_');
  _downloadCsv(header + '\n' + body, `pricing_schedule_${safeOrg}.csv`);
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
    if (!obj.name)                   errors.push('name required');
    if (!validTypes.has(obj.tool_type)) errors.push(`tool_type "${obj.tool_type}" not recognised`);
    if (!validModels.has(obj.model)) errors.push(`model "${obj.model}" not recognised`);
    const lo = parseFloat(obj.rate_low);
    if (isNaN(lo) || lo < 0)         errors.push('rate_low must be ≥ 0');
    return { ...obj, rate_low: isNaN(lo)?null:lo,
      rate_high: parseFloat(obj.rate_high)>0 ? parseFloat(obj.rate_high) : null,
      _valid: errors.length===0, _errors: errors };
  });
}

function _splitCsvLine(line) {
  const result=[]; let cur=''; let inQ=false;
  for (let i=0;i<line.length;i++) {
    const c=line[i];
    if (c==='"') { if(inQ&&line[i+1]==='"'){cur+='"';i++;}else inQ=!inQ; }
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
  const modelLbl={ perUser:'per user/yr', perEndpoint:'per device/yr', fixed:'fixed/yr' };
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
      <table style="width:100%;border-collapse:collapse;font-size:11px;min-width:700px">
        <thead><tr style="background:#f8fafc">
          <th style="text-align:left;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Status</th>
          <th style="text-align:left;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Type</th>
          <th style="text-align:left;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Name</th>
          <th style="text-align:left;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Model</th>
          <th style="text-align:right;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Rate</th>
          <th style="text-align:left;padding:5px 8px;border-bottom:2px solid var(--border);font-weight:700">Vendor / Notes</th>
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
            <td style="padding:5px 8px;vertical-align:top;color:var(--muted)">${escH(modelLbl[r.model]||r.model||'—')}</td>
            <td style="padding:5px 8px;vertical-align:top;text-align:right;font-weight:700">
              ${r.rate_low!=null?`$${r.rate_low}${r.rate_high?` – $${r.rate_high}`:''}` :'—'}
            </td>
            <td style="padding:5px 8px;vertical-align:top;color:var(--muted);font-size:10px">
              ${escH(r.vendor||'')}${r.vendor&&r.notes?' · ':''}${escH(r.notes||'')}
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
        rate_low:r.rate_low, rate_high:r.rate_high||null, notes:r.notes||null, active:true };
      const res = await sbFetch('pricing_schedule','POST',payload,{'Prefer':'return=representation'});
      const row = Array.isArray(res)?res[0]:res;
      if (row?.id) psState.rows.push({...row,_new:false,_dirty:false,_deleted:false});
      imported++;
    }
    psState.importRows = null;
    toast(`${imported} tool${imported!==1?'s':''} imported ✓`, '#15803d');
  } catch(e) {
    toast(`Import failed after ${imported} rows — ${e.message||'error'}`, '#dc2626');
  }
  document.getElementById('mainContent').innerHTML = renderPricingSchedule();
}

// ── PUBLIC API ────────────────────────────────────────────────

function psGetForType(toolType) {
  const own    = (psState.rows||[]).find(r=>r.tool_type===toolType && r.active!==false && !r._deleted && !r._new);
  const parent = (psState.parentRows||[]).find(r=>r.tool_type===toolType && r.active!==false);
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
window.psRowDelete           = psRowDelete;
window.psSaveAll             = psSaveAll;
window.psGetForType          = psGetForType;
window.psExportTemplate      = psExportTemplate;
window.psExportCurrent       = psExportCurrent;
window.psImportFile          = psImportFile;
window.psImportConfirm       = psImportConfirm;
window.psCancelImport        = psCancelImport;
