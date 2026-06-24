// ============================================================
// REMEDIATION COSTS (remediation_costs.js)
// Shared module: maps assessment gaps → pricing schedule entries
// → estimated cost to remediate.
//
// Source of truth for headcount: organisation_profiles (company profile).
// For TPRA and M&A CDD (external parties), headcount is entered manually.
// ============================================================

// ── MAPPINGS ─────────────────────────────────────────────────

// Tech Stack tool_category → pricing schedule tool_type
// null = no pricing schedule equivalent (process/OS feature/bundled)
const RC_TS_TO_TOOL = {
  EDR:                      'edr',
  EDR_IR_Integration:       'edr',
  App_Allowlisting:         'edr',            // typically an EDR policy feature
  SIEM_XDR_MDR:             'mdr_soc',
  Log_Aggregation:          'mdr_soc',
  Log_Retention:            'mdr_soc',
  Monitoring_24x7:          'mdr_soc',
  SOAR_Runbook:             'mdr_soc',
  MFA_All_Users:            'mfa',
  MFA_Phishing_Resistant:   'mfa',
  MFA_VPN:                  'mfa',
  SSO:                      'mfa',            // often bundled with identity platform
  PAM:                      'pam',
  JML_Automation:           'pam',
  Email_Security_Gateway:   'email',
  Email_Authentication:     'email',
  External_Sender_Banner:   'email',
  DNS_Filtering:            'dns_filter',
  NGFW:                     'ngfw',
  Network_Segmentation:     'ngfw',
  Wireless_Segmentation:    'ngfw',
  Vuln_Scanner:             'vuln_external',
  Attack_Surface_Mgmt:      'vuln_external',
  ZTNA:                     'ztna_vpn',
  DLP:                      'dlp',
  Data_Classification:      'pii_scan',
  Penetration_Testing:      'pentest_external',
  Phishing_Simulation:      'sat',
  IR_Retainer:              'vciso',
  HW_Inventory:             'mdm',
  SW_Inventory:             'mdm',
  Config_Baseline_Enforcement: 'mdm',
  // No pricing schedule equivalent:
  Backup_Tool:              null,
  Backup_Immutability:      null,
  Restore_Testing:          null,
  Disk_Encryption:          null,
  Patch_Management:         null,
  Key_Management:           null,
  RTO_RPO_Defined:          null,
  On_Call_Paging:           null,
};

// CIS control number (1–18) → pricing schedule tool_type(s)
const RC_CIS_CTRL_MAP = {
  1:  ['mdm'],                              // Inventory of enterprise assets
  2:  [],                                   // Software inventory (process)
  3:  ['dlp', 'pii_scan'],                 // Data protection
  4:  ['mdm'],                              // Secure config of enterprise assets
  5:  ['pam', 'password_vault'],           // Account management
  6:  ['mfa', 'ztna_vpn'],                // Access control management
  7:  ['vuln_external', 'vuln_internal'],  // Continuous vulnerability management
  8:  ['mdr_soc'],                         // Audit log management / SIEM
  9:  ['email', 'dns_filter'],            // Email & web browser protections
  10: ['edr'],                             // Malware defenses
  11: [],                                   // Data recovery (backup — not in pricing schedule)
  12: ['ngfw'],                            // Network infrastructure management
  13: ['mdr_soc'],                         // Network monitoring & defense
  14: ['sat'],                             // Security awareness & skills training
  15: [],                                   // Service provider management (TPRA — process)
  16: [],                                   // Application software security (no tool)
  17: ['tabletop', 'vciso'],              // Incident response management
  18: ['pentest_external'],               // Penetration testing
};

// ── HEADCOUNT ─────────────────────────────────────────────────

// employee_count_band → {low, mid, high} approximate user counts
const RC_BAND = {
  '1-10':     { low:1,   mid:5,   high:10   },
  '11-50':    { low:11,  mid:30,  high:50   },
  '51-200':   { low:51,  mid:125, high:200  },
  '201-500':  { low:201, mid:350, high:500  },
  '501-1000': { low:501, mid:750, high:1000 },
  '1001+':    { low:1001,mid:1500,high:2000 },
};

function rcGetHeadcount(orgId) {
  const profile = (typeof orgProfiles !== 'undefined' ? orgProfiles : {})?.[orgId] || {};
  const band    = RC_BAND[profile.employee_count_band] || null;

  // Users: exact field first, then band midpoint
  const users    = profile.approx_user_count    || (band ? band.mid  : null);
  const usersHi  = profile.approx_user_count    || (band ? band.high : null);

  // Endpoints: exact field first, then same as users (1 device per person)
  const endpoints   = profile.approx_device_count || users;
  const endpointsHi = profile.approx_device_count || usersHi;

  const hasProfile   = !!(profile.approx_user_count || profile.employee_count_band || profile.approx_device_count);
  const hasExact     = !!(profile.approx_user_count);
  const source       = profile.approx_user_count ? 'exact'
                     : profile.employee_count_band ? 'band'
                     : 'none';

  return { users, usersHi, endpoints, endpointsHi, hasProfile, hasExact, source, profile };
}

// ── COST CALC ─────────────────────────────────────────────────

function rcCalcAnnualCost(ps, hc) {
  // PS rates are monthly → ×12 for annual
  const rLo = (ps.rate_low  || 0) * 12;
  const rHi = ((ps.rate_high > 0 ? ps.rate_high : ps.rate_low) || 0) * 12;

  let annLow = 0, annHigh = 0;
  if (ps.model === 'perUser') {
    annLow  = rLo * (hc.users    || 0);
    annHigh = rHi * (hc.usersHi  || hc.users || 0);
  } else if (ps.model === 'perEndpoint') {
    annLow  = rLo * (hc.endpoints    || 0);
    annHigh = rHi * (hc.endpointsHi  || hc.endpoints || 0);
  } else {
    annLow  = rLo;
    annHigh = rHi;
  }

  const otModel = ps.one_time_model || 'fixed';
  let otLow  = ps.one_time_low  || 0;
  let otHigh = ps.one_time_high || ps.one_time_low || 0;
  if (otModel === 'perUser') {
    otLow  *= (hc.users   || 0);
    otHigh *= (hc.usersHi || hc.users || 0);
  } else if (otModel === 'perEndpoint') {
    otLow  *= (hc.endpoints    || 0);
    otHigh *= (hc.endpointsHi  || hc.endpoints || 0);
  }

  const modelLabel = ps.model === 'perUser'     ? `${hc.users||'?'} users`
                   : ps.model === 'perEndpoint'  ? `${hc.endpoints||'?'} devices`
                   : 'flat rate';

  return { annLow, annHigh, otLow, otHigh, modelLabel };
}

function _rcFmt(n) {
  if (!n) return '—';
  return '$' + Math.round(n).toLocaleString();
}
function _rcRange(lo, hi) {
  if (!lo && !hi) return '—';
  if (!hi || lo === hi) return _rcFmt(lo);
  return `${_rcFmt(lo)} – ${_rcFmt(hi)}`;
}

// ── GAP EXTRACTION ────────────────────────────────────────────

// From CIS answers + goal + (optional) POAM items for risk_decision
function rcExtractCISGaps(answers, goal, poamItems) {
  const goalN     = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 3;
  const items     = poamItems || {};
  const typeMap   = {};     // toolType → {label, sources, riskAccepted}
  const accepted  = [];     // {sf, ctrlName, title, rationale}
  const noTool    = [];     // ctrl numbers with no tool mapping

  CIS_SAFEGUARDS.filter(s =>
    (goal ? s.ig <= goalN : true) &&
    (answers[s.sf] === 'no' || answers[s.sf] === 'partial')
  ).forEach(s => {
    const item    = items[s.sf] || {};
    const ctrl    = parseInt(s.ctrl);
    const types   = RC_CIS_CTRL_MAP[ctrl] || [];

    if (item.risk_decision === 'accept') {
      accepted.push({ sf:s.sf, ctrlName:s.ctrlName, title:s.title, rationale:item.risk_rationale||'' });
      return;
    }

    if (types.length === 0) {
      // Track controls with no tool mapping
      const key = `ctrl_${ctrl}`;
      if (!noTool.find(x => x.ctrl === ctrl)) noTool.push({ ctrl, ctrlName:s.ctrlName });
      return;
    }

    types.forEach(t => {
      if (!typeMap[t]) typeMap[t] = { toolType:t, sources:[] };
      typeMap[t].sources.push(`${s.ctrl}.${s.sf.replace('cis_','')}`);
    });
  });

  return { gaps: Object.values(typeMap), accepted, noTool };
}

// From tsState answers (tech stack)
function rcExtractTSGaps() {
  if (!tsState?.answers) return { gaps: [] };
  const allQs  = (typeof TS_CATS !== 'undefined') ? TS_CATS.flatMap(c => c.questions) : [];
  const seenTypes = new Set();
  const typeMap   = {};

  allQs.forEach(q => {
    const ans = tsState.answers[q.id];
    if (!ans || ans.ans === 'yes' || ans.ans === 'na') return;
    const toolType = RC_TS_TO_TOOL[q.tool_category];
    if (!toolType) return;
    if (!typeMap[toolType]) typeMap[toolType] = { toolType, sources:[] };
    typeMap[toolType].sources.push(q.id);
  });

  return { gaps: Object.values(typeMap) };
}

// ── RENDER ────────────────────────────────────────────────────

function renderRemediationCosts(gaps, orgId, opts = {}) {
  const hc     = rcGetHeadcount(orgId);
  const { accepted = [], noTool = [], runDate = '' } = opts;

  // Look up pricing for each gap
  const priced  = [];
  const missing = [];
  gaps.forEach(g => {
    const ps = (typeof psGetForType === 'function') ? psGetForType(g.toolType) : null;
    if (ps) priced.push({ ...g, ps });
    else    missing.push(g);
  });

  // Totals
  let totalAnnLow = 0, totalAnnHigh = 0, totalOTLow = 0, totalOTHigh = 0;
  priced.forEach(g => {
    const c = rcCalcAnnualCost(g.ps, hc);
    totalAnnLow  += c.annLow;
    totalAnnHigh += c.annHigh;
    totalOTLow   += c.otLow;
    totalOTHigh  += c.otHigh;
  });

  const typeMeta = (typeof PS_TYPE_META !== 'undefined') ? PS_TYPE_META : {};

  // Headcount banner
  let hcBanner = '';
  if (!hc.hasProfile) {
    hcBanner = `
    <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:10px 14px;margin-bottom:1rem;display:flex;align-items:center;gap:10px">
      <div style="font-size:18px">⚠️</div>
      <div>
        <div style="font-size:12px;font-weight:700;color:#92400e">Add headcount to get cost estimates</div>
        <div style="font-size:11px;color:#78350f;margin-top:2px">Set employee count or exact user/device counts in your Company Profile — costs for per-user and per-device tools can't be calculated without it.</div>
        <button class="btn btn-outline btn-sm" style="margin-top:6px;font-size:10px;border-color:#d97706;color:#92400e" onclick="setNav('company_profile')">→ Go to Company Profile</button>
      </div>
    </div>`;
  } else {
    const srcNote = hc.source === 'exact' ? 'from Company Profile' : 'estimated from employee count band';
    const editLink = `<button onclick="setNav('company_profile')" style="background:none;border:none;cursor:pointer;font-size:10px;color:var(--cyan);padding:0;font-family:inherit">Edit →</button>`;
    hcBanner = `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:8px 14px;margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
      <div style="font-size:11px;color:#15803d">
        <strong>Headcount (${srcNote}):</strong>&nbsp;
        ${hc.users ? `${hc.users}${hc.usersHi && hc.usersHi !== hc.users ? '–'+hc.usersHi : ''} users` : '? users'}
        &nbsp;·&nbsp;
        ${hc.endpoints ? `${hc.endpoints}${hc.endpointsHi && hc.endpointsHi !== hc.endpoints ? '–'+hc.endpointsHi : ''} devices` : '? devices'}
      </div>
      ${editLink}
    </div>`;
  }

  // Cost table
  let tableHtml = '';
  if (priced.length > 0) {
    const rows = priced.map(g => {
      const c    = rcCalcAnnualCost(g.ps, hc);
      const lbl  = typeMeta[g.toolType]?.label || g.toolType;
      const src  = g.ps.source === 'parent'
        ? `<span style="font-size:9px;font-weight:700;color:#7c3aed;padding:1px 5px;background:#faf5ff;border-radius:3px">MSP</span>`
        : `<span style="font-size:9px;font-weight:700;color:#0369a1;padding:1px 5px;background:#e0f2fe;border-radius:3px">Custom</span>`;
      const noHC = !hc.hasProfile && (g.ps.model !== 'fixed');
      return `<tr style="border-bottom:1px solid #f1f5f9">
        <td style="padding:7px 8px;font-weight:700;font-size:12px">${escH(lbl)}</td>
        <td style="padding:7px 8px;font-size:11px">
          <div style="font-weight:600">${escH(g.ps.name||'—')}</div>
          <div style="font-size:9px;color:var(--muted)">${g.ps.vendor ? escH(g.ps.vendor)+' · ' : ''}${src}</div>
          <div style="font-size:9px;color:var(--muted);margin-top:1px">${g.sources.length} gap${g.sources.length!==1?'s':''}</div>
        </td>
        <td style="padding:7px 8px;font-size:11px;color:var(--muted)">${c.modelLabel}</td>
        <td style="padding:7px 8px;font-size:12px;font-weight:700;text-align:right">
          ${noHC ? '<span style="color:#b45309;font-size:10px">Add headcount</span>' : _rcRange(c.annLow, c.annHigh)}
        </td>
        <td style="padding:7px 8px;font-size:12px;text-align:right;color:${c.otLow > 0 ? '#7c3aed' : 'var(--muted)'}">
          ${c.otLow > 0 ? _rcRange(c.otLow, c.otHigh) : '—'}
        </td>
      </tr>`;
    }).join('');

    const hasNoHC = !hc.hasProfile && priced.some(g => g.ps.model !== 'fixed');
    tableHtml = `
    <div class="card" style="padding:0;margin-bottom:1rem">
      <div style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:12px;font-weight:700">
        ${priced.length} tool${priced.length!==1?'s':''} identified — estimated cost
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:11px;min-width:500px">
          <thead>
            <tr style="background:#f8fafc">
              <th style="text-align:left;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:120px">Tool type</th>
              <th style="text-align:left;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:180px">From pricing schedule</th>
              <th style="text-align:left;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:90px">Unit</th>
              <th style="text-align:right;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:120px">Annual cost (est.)</th>
              <th style="text-align:right;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:110px;color:#7c3aed">One-time setup</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr style="background:#f8fafc;border-top:2px solid var(--border)">
              <td colspan="3" style="padding:8px;font-weight:700;font-size:12px">Estimated total</td>
              <td style="padding:8px;text-align:right;font-weight:800;font-size:13px;color:var(--navy)">
                ${hasNoHC ? '—' : _rcRange(totalAnnLow, totalAnnHigh)}
              </td>
              <td style="padding:8px;text-align:right;font-weight:700;font-size:12px;color:#7c3aed">
                ${totalOTLow > 0 ? _rcRange(totalOTLow, totalOTHigh) : '—'}
              </td>
            </tr>
            <tr style="background:#f8fafc">
              <td colspan="5" style="padding:4px 8px;font-size:10px;color:var(--muted)">
                Annual costs are recurring monthly rate × 12. Estimates shown as low – high range where pricing has a range configured. Setup fees are one-time only.
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>`;
  }

  // Not in pricing schedule
  let missingHtml = '';
  if (missing.length > 0) {
    missingHtml = `
    <div class="card" style="padding:12px 16px;margin-bottom:1rem;border-left:3px solid #f59e0b">
      <div style="font-size:12px;font-weight:700;margin-bottom:6px;color:#92400e">⚠️ ${missing.length} tool type${missing.length!==1?'s':''} not yet in your Pricing Schedule</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">
        ${missing.map(g => {
          const lbl = typeMeta[g.toolType]?.label || g.toolType;
          return `<span style="font-size:10px;padding:2px 8px;background:#fef3c7;border:1px solid #fbbf24;border-radius:4px;color:#92400e">${escH(lbl)}</span>`;
        }).join('')}
      </div>
      <button class="btn btn-outline btn-sm" style="font-size:10px;border-color:#d97706;color:#92400e" onclick="setNav('pricing_schedule')">→ Open Pricing Schedule</button>
    </div>`;
  }

  // Risk accepted (CIS only)
  let acceptedHtml = '';
  if (accepted.length > 0) {
    acceptedHtml = `
    <div class="card" style="padding:12px 16px;margin-bottom:1rem;border-left:3px solid #7c3aed">
      <div style="font-size:12px;font-weight:700;margin-bottom:6px;color:#7c3aed">Risk Accepted — not included in cost estimate</div>
      ${accepted.map(a => `
        <div style="padding:5px 0;border-bottom:1px solid #f1f5f9;font-size:11px">
          <span style="font-weight:700">${escH(a.sf)}</span>
          <span style="color:var(--muted);margin-left:4px">${escH(a.ctrlName)} · ${escH(a.title)}</span>
          ${a.rationale ? `<div style="font-size:10px;color:var(--muted);margin-top:1px;font-style:italic">"${escH(a.rationale)}"</div>` : ''}
        </div>`).join('')}
    </div>`;
  }

  // Controls with no tool (process gaps)
  let noToolHtml = '';
  if (noTool.length > 0) {
    noToolHtml = `
    <div style="font-size:10px;color:var(--muted);margin-top:4px;padding:8px 0">
      <strong>Process gaps (no tooling cost):</strong>
      ${noTool.map(n => escH(n.ctrlName)).join(', ')}
      — these controls are addressed through policy and process, not tooling.
    </div>`;
  }

  const hasAnything = priced.length || missing.length || accepted.length;

  return `
    ${hcBanner}
    ${!hasAnything ? `
    <div class="card" style="padding:2.5rem;text-align:center;color:var(--muted)">
      <div style="font-size:1.75rem;margin-bottom:.5rem">✅</div>
      <div style="font-weight:700;color:var(--text);margin-bottom:.25rem">No gaps to remediate</div>
      <div style="font-size:12px">All assessed controls are met or not applicable.</div>
    </div>` : ''}
    ${tableHtml}
    ${missingHtml}
    ${acceptedHtml}
    ${noToolHtml}`;
}

window.rcGetHeadcount          = rcGetHeadcount;
window.renderRemediationCosts  = renderRemediationCosts;
window.rcExtractCISGaps        = rcExtractCISGaps;
window.rcExtractTSGaps         = rcExtractTSGaps;
