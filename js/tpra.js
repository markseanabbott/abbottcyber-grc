
// ============================================================
// THIRD-PARTY RISK ASSESSMENT (TPRA) MODULE
// ============================================================

const TPRA_DATA_CATEGORIES = [
  { id: 'payment',     label: 'Payment / Cardholder Data',            sensitivity: 'Critical', reg: 'PCI-DSS' },
  { id: 'phi',         label: 'Health / PHI',                          sensitivity: 'Critical', reg: 'HIPAA' },
  { id: 'auth',        label: 'Auth Secrets / API Keys / Credentials', sensitivity: 'Critical', reg: 'â€”' },
  { id: 'pii',         label: 'Customer / Guest PII (at scale)',        sensitivity: 'High',     reg: 'PIPEDA / CCPA' },
  { id: 'hr',          label: 'Employee / HR Data',                     sensitivity: 'High',     reg: 'Employment law' },
  { id: 'financial',   label: 'Financial / Banking Records',            sensitivity: 'High',     reg: 'GLBA / FINTRAC' },
  { id: 'confidential',label: 'Confidential / IP / Contracts',          sensitivity: 'Moderate', reg: 'Contractual' },
  { id: 'operational', label: 'Operational Data / Telemetry / Logs',    sensitivity: 'Low',      reg: 'â€”' },
  { id: 'public',      label: 'Public / Non-Sensitive',                 sensitivity: 'Low',      reg: 'â€”' },
];

const TPRA_PROFILE_ATTRS = [
  { key: 'legal_entity',       label: 'Legal Entity & Ownership' },
  { key: 'founded',            label: 'Founded / Company Age' },
  { key: 'size',               label: 'Size / Headcount' },
  { key: 'financial_signals',  label: 'Financial Stability Signals' },
  { key: 'headquarters',       label: 'Headquarters / Legal Jurisdiction' },
  { key: 'hosting',            label: 'Hosting & Infrastructure' },
  { key: 'certifications',     label: 'Certifications (SOC 2, ISO 27001, etc.)' },
  { key: 'trust_center',       label: 'Trust Center / Security Page URL' },
  { key: 'breach_history',     label: 'Incident & Breach History' },
  { key: 'subprocessors',      label: 'Subprocessor List' },
];

const TPRA_FINDING_AREAS = [
  'Data Residency / Jurisdiction', 'Subprocessor / Fourth-Party Risk', 'Security Attestations',
  'Financial Viability', 'Breach / Incident History', 'Security Posture', 'Data Handling / Retention',
  'Concentration Risk', 'Contractual / DPA Gaps', 'Authentication & Access Controls', 'Software Vulnerability', 'Other'
];

function tpraBlankDraft() {
  return {
    id: null, vendor_name: '', product_name: '', website: '', assessor: '',
    jurisdiction: 'Canada', data_residency: '', data_categories: [], provided_docs: '',
    vendor_profile: {}, profile_confidence: {},
    findings: [], recommendations: '', outstanding_items: [],
    tier: null, tier_rationale: '', status: 'draft',
  };
}

function tpraInit() {
  tpraState = {
    orgId: currentOrg.id,
    view: 'list',
    step: 1,
    assessments: [],
    draft: tpraBlankDraft(),
    detailId: null,
    pushToRegister: false,
  };
}

async function tpraLoadAssessments() {
  try {
    const rows = await sb.tpra.getAll(currentOrg.id);
    tpraState.assessments = rows || [];
  } catch (e) {
    tpraState.assessments = [];
  }
}

function tpraCalcSuggestedTier(draft) {
  const cats = draft.data_categories || [];
  let dataSensitivity = 'Low';
  if (cats.some(c => ['payment','phi','auth'].includes(c)))        dataSensitivity = 'Critical';
  else if (cats.some(c => ['pii','hr','financial'].includes(c)))   dataSensitivity = 'High';
  else if (cats.includes('confidential'))                          dataSensitivity = 'Moderate';

  const findings = draft.findings || [];
  const critCount = findings.filter(f => f.severity === 'Critical').length;
  const highCount = findings.filter(f => f.severity === 'High').length;
  const unknownCount = findings.filter(f => f.confidence === 'Unknown').length;
  const hasBreach = (draft.vendor_profile || {}).breach_history &&
                    (draft.vendor_profile.breach_history).trim().length > 0;

  let vendorSignal = 'Low';
  if (critCount > 0 || hasBreach)          vendorSignal = 'Elevated';
  else if (highCount >= 2 || unknownCount >= 3) vendorSignal = 'Moderate';

  const MATRIX = {
    Critical: { Elevated:'Critical', Moderate:'High',     Low:'Moderate' },
    High:     { Elevated:'High',     Moderate:'High',     Low:'Moderate' },
    Moderate: { Elevated:'High',     Moderate:'Moderate', Low:'Low'      },
    Low:      { Elevated:'Moderate', Moderate:'Low',      Low:'Low'      },
  };
  return { tier: MATRIX[dataSensitivity][vendorSignal], dataSensitivity, vendorSignal };
}

function tpraHighestSensitivity(cats) {
  if (!cats || !cats.length) return 'Unknown';
  if (cats.some(c => ['payment','phi','auth'].includes(c))) return 'Critical';
  if (cats.some(c => ['pii','hr','financial'].includes(c))) return 'High';
  if (cats.includes('confidential')) return 'Moderate';
  return 'Low';
}

function tpraTierBadge(tier) {
  if (!tier) return '<span class="badge b-gray">â€”</span>';
  const cls = { Critical:'b-red', High:'b-amber', Moderate:'b-amber', Low:'b-green' }[tier] || 'b-gray';
  return '<span class="badge ' + cls + '">' + tier + '</span>';
}

function tpraSensBadge(s) {
  const cls = { Critical:'b-red', High:'b-amber', Moderate:'b-navy', Low:'b-green', Unknown:'b-gray' }[s] || 'b-gray';
  return '<span class="badge ' + cls + '" style="font-size:9px">' + s + '</span>';
}

function tpraConfBadge(c) {
  const cls = { Verified:'b-green', Inferred:'b-amber', Unknown:'b-gray' }[c] || 'b-gray';
  return '<span class="badge ' + cls + '">' + c + '</span>';
}

function tpraFindingSevBadge(s) {
  const cls = { Critical:'b-red', High:'b-amber', Medium:'b-cyan', Low:'b-green', Info:'b-gray' }[s] || 'b-gray';
  return '<span class="badge ' + cls + '">' + s + '</span>';
}

function tpraRender() {
  if (activeNav !== 'tpra') return;
  document.getElementById('mainContent').innerHTML = renderTPRAInner();
}

function renderTPRAInner() {
  if (!tpraState) return '';
  const shell = renderTierBanner();
  if (tpraState.view === 'wizard')  return shell + renderTPRAWizard();
  if (tpraState.view === 'detail') {
    const a = tpraState.assessments.find(x => x.id === tpraState.detailId);
    return shell + (a ? renderTPRADetail(a) : renderTPRAList());
  }
  return shell + renderTPRAList();
}

function renderTPRAList() {
  const list = tpraState.assessments;
  let html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.85rem;flex-wrap:wrap;gap:8px">' +
    '<div><div style="font-size:17px;font-weight:700">ðŸ” Third-Party Risk Assessments</div>' +
    '<div style="font-size:12px;color:var(--muted)">' + list.length + ' vendor' + (list.length !== 1 ? 's' : '') + ' assessed for <strong>' + escH(currentOrg.name) + '</strong></div></div>' +
    '<button class="btn btn-primary" onclick="tpraNew()">+ New Assessment</button></div>';

  if (list.length === 0) {
    html += '<div class="coming-soon" style="padding:2.5rem">' +
      '<div style="font-size:36px;margin-bottom:0.75rem">ðŸ­</div>' +
      '<div style="font-size:14px;font-weight:700;margin-bottom:6px">No vendor assessments yet</div>' +
      '<div style="font-size:12px;color:var(--muted);margin-bottom:1.1rem;max-width:400px;margin-left:auto;margin-right:auto">' +
      'Run a guided third-party risk assessment against any vendor, supplier, or SaaS tool â€” and generate a client-ready Word report.</div>' +
      '<button class="btn btn-primary" onclick="tpraNew()">+ Start your first assessment</button></div>';
  } else {
    html += '<div class="card" style="padding:0;overflow:hidden"><table class="assess-table">' +
      '<thead><tr><th>Vendor / Product</th><th>Data Risk</th><th>Risk Tier</th><th>Findings</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>';
    list.forEach(function(a) {
      const hs = tpraHighestSensitivity(a.data_categories || []);
      const critHigh = (a.findings || []).filter(function(f) { return f.severity === 'Critical' || f.severity === 'High'; }).length;
      html += '<tr style="cursor:pointer" onclick="tpraViewDetail(\'' + a.id + '\')">' +
        '<td><div class="assess-row-name">' + escH(a.vendor_name) + '</div><div class="assess-row-sub">' + escH(a.product_name || 'â€”') + '</div></td>' +
        '<td>' + tpraSensBadge(hs) + '</td>' +
        '<td>' + tpraTierBadge(a.tier) + '</td>' +
        '<td>' + (critHigh > 0 ? '<span class="badge b-red">' + critHigh + ' High+</span>' : '<span style="font-size:11px;color:var(--muted)">' + (a.findings || []).length + ' total</span>') + '</td>' +
        '<td><span class="badge ' + (a.status === 'complete' ? 'b-green' : 'b-amber') + '">' + (a.status === 'complete' ? 'Complete' : 'Draft') + '</span></td>' +
        '<td style="font-size:11px;color:var(--muted)">' + new Date(a.created_at).toLocaleDateString() + '</td>' +
        '<td onclick="event.stopPropagation()" style="white-space:nowrap">' +
        '<button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="tpraEdit(\'' + a.id + '\')">Edit</button>' +
        '<button class="btn btn-sm" style="background:#fee2e2;color:#b91c1c;border:1.5px solid #fca5a5" onclick="tpraDeleteConfirm(\'' + a.id + '\')">âœ•</button></td></tr>';
    });
    html += '</tbody></table></div>';
  }
  return html;
}

function renderTPRAWizard() {
  const d = tpraState.draft;
  const step = tpraState.step;
  const STEPS = ['Vendor Intake', 'Vendor Profile', 'Risk Findings', 'Tier & Rationale', 'Review & Publish'];
  let nav = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:0.85rem;flex-wrap:wrap">' +
    '<button class="btn btn-outline btn-sm" onclick="tpraBackToList()">â† Back</button>' +
    '<div style="flex:1;font-size:15px;font-weight:700">' + (d.id ? 'Edit' : 'New') + ' Assessment: ' + escH(d.vendor_name || 'New Vendor') + '</div>' +
    '<span class="badge b-navy">Step ' + step + ' of 5</span></div>';
  let steps = '<div class="nist-track" style="margin-bottom:1rem">';
  STEPS.forEach(function(s, i) {
    const cls = i+1 === step ? 'active' : i+1 < step ? 'complete' : '';
    steps += '<div class="nist-step ' + cls + '" style="cursor:' + (i+1 < step ? 'pointer' : 'default') + ';font-size:10px"' +
      (i+1 < step ? ' onclick="tpraGoStep(' + (i+1) + ')"' : '') + '>' +
      (i+1 < step ? 'âœ“ ' : '') + s + '</div>';
  });
  steps += '</div>';
  let body = '';
  if (step === 1) body = tpraStep1();
  else if (step === 2) body = tpraStep2();
  else if (step === 3) body = tpraStep3();
  else if (step === 4) body = tpraStep4();
  else if (step === 5) body = tpraStep5();
  return nav + steps + body;
}

function tpraStep1() {
  const d = tpraState.draft;
  const cats = d.data_categories || [];
  let catHtml = '';
  TPRA_DATA_CATEGORIES.forEach(function(cat) {
    catHtml += '<label class="cb-item ' + (cats.includes(cat.id) ? 'checked' : '') + '" onclick="tpraToggleCat(\'' + cat.id + '\')">' +
      '<input type="checkbox" ' + (cats.includes(cat.id) ? 'checked' : '') + ' style="pointer-events:none">' +
      escH(cat.label) + ' ' + tpraSensBadge(cat.sensitivity) + '</label>';
  });
  return '<div class="card"><div class="card-title">Vendor Details</div>' +
    '<div class="form-row" style="margin-bottom:8px">' +
    '<div><div class="field-lbl">Vendor Name *</div><input type="text" value="' + escH(d.vendor_name) + '" placeholder="e.g. Proofpoint" oninput="tpraState.draft.vendor_name=this.value"></div>' +
    '<div><div class="field-lbl">Product / Service</div><input type="text" value="' + escH(d.product_name) + '" placeholder="e.g. Email Security Gateway" oninput="tpraState.draft.product_name=this.value"></div></div>' +
    '<div class="form-row"><div><div class="field-lbl">Website</div><input type="text" value="' + escH(d.website) + '" placeholder="https://" oninput="tpraState.draft.website=this.value"></div>' +
    '<div><div class="field-lbl">Assessor / Prepared by</div><input type="text" value="' + escH(d.assessor) + '" placeholder="Your name" oninput="tpraState.draft.assessor=this.value"></div></div></div>' +
    '<div class="card"><div class="card-title">Data Categories in Scope</div>' +
    '<div style="font-size:12px;color:var(--muted);margin-bottom:0.75rem">What data will live with or pass through this vendor? Select all that apply â€” this drives the impact axis of the risk tier.</div>' +
    '<div class="checkbox-group">' + catHtml + '</div></div>' +
    '<div class="card"><div class="card-title">Jurisdiction & Residency</div>' +
    '<div class="form-row" style="margin-bottom:8px"><div><div class="field-lbl">Client Jurisdiction</div>' +
    '<select onchange="tpraState.draft.jurisdiction=this.value">' +
    ['Canada','United States','European Union / UK','Australia','Other'].map(function(j) { return '<option value="' + j + '"' + (d.jurisdiction === j ? ' selected' : '') + '>' + j + '</option>'; }).join('') +
    '</select></div>' +
    '<div><div class="field-lbl">Data Residency Requirement</div><input type="text" value="' + escH(d.data_residency) + '" placeholder="e.g. Data must stay in Canada" oninput="tpraState.draft.data_residency=this.value"></div></div>' +
    '<div><div class="field-lbl">Provided Documentation (gated docs you have)</div>' +
    '<textarea placeholder="List any SOC 2 reports, DPAs, security questionnaires, trust-centre exports you have in handâ€¦" oninput="tpraState.draft.provided_docs=this.value">' + escH(d.provided_docs) + '</textarea></div></div>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px">' +
    '<button class="btn btn-outline btn-sm" onclick="tpraSaveDraft()">Save Draft</button>' +
    '<button class="btn btn-primary" onclick="tpraNext()">Next: Vendor Profile â†’</button></div>';
}

function tpraStep2() {
  const d = tpraState.draft;
  const prof = d.vendor_profile || {};
  const conf = d.profile_confidence || {};
  let rows = '';
  TPRA_PROFILE_ATTRS.forEach(function(attr) {
    rows += '<div style="padding:0.7rem 0;border-bottom:1px solid var(--border)">' +
      '<div class="field-lbl" style="margin-bottom:5px">' + attr.label + '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 100px;gap:8px;align-items:start">' +
      '<textarea style="min-height:44px" placeholder="Enter what you found, or leave blankâ€¦" oninput="tpraSetProf(\'' + attr.key + '\',this.value)">' + escH(prof[attr.key] || '') + '</textarea>' +
      '<div style="display:flex;flex-direction:column;gap:3px">' +
      ['Verified','Inferred','Unknown'].map(function(c) {
        const sel = conf[attr.key] === c;
        const cls = sel ? (c==='Verified'?'btn-green':c==='Inferred'?'btn-amber':'btn-outline') : 'btn-outline';
        return '<button class="btn btn-sm ' + cls + '" style="font-size:10px;padding:3px 6px" onclick="tpraSetConf(\'' + attr.key + '\',\'' + c + '\')">' + c + '</button>';
      }).join('') +
      '</div></div></div>';
  });
  return '<div class="card"><div class="card-title">Vendor Profile â€” Company Intelligence</div>' +
    '<div style="font-size:12px;color:var(--muted);margin-bottom:0.85rem">Enter what you found from public sources. Label each: ' +
    tpraConfBadge('Verified') + ' named source confirmed Â· ' + tpraConfBadge('Inferred') + ' reasonably deduced Â· ' + tpraConfBadge('Unknown') + ' not publicly available</div>' +
    rows +
    '<div style="padding:0.7rem 0"><div class="field-lbl" style="margin-bottom:5px">Recent Developments (last 18 months)</div>' +
    '<textarea style="min-height:72px" placeholder="Notable news: funding, layoffs, acquisitions, breaches, leadership changes, outagesâ€¦" oninput="tpraSetProf(\'recent_developments\',this.value)">' + escH(prof.recent_developments || '') + '</textarea></div></div>' +
    '<div style="display:flex;justify-content:space-between;gap:8px"><button class="btn btn-outline btn-sm" onclick="tpraGoStep(1)">â† Back</button>' +
    '<div style="display:flex;gap:8px"><button class="btn btn-outline btn-sm" onclick="tpraSaveDraft()">Save Draft</button>' +
    '<button class="btn btn-primary" onclick="tpraNext()">Next: Risk Findings â†’</button></div></div>';
}

function tpraStep3() {
  const d = tpraState.draft;
  const findings = d.findings || [];
  let findHtml = findings.length === 0
    ? '<div style="text-align:center;padding:1.5rem;color:var(--muted);background:var(--bg);border-radius:8px;margin-bottom:0.75rem">No findings yet. Add your first finding.</div>'
    : findings.map(function(f, i) {
        const sevBadge = f.severity ? tpraFindingSevBadge(f.severity) : '';
        const confBtns = ['Verified','Inferred','Unknown'].map(function(c) {
          const sel = f.confidence === c;
          const cls = sel ? (c==='Verified'?'btn-green':c==='Inferred'?'btn-amber':'btn-outline') : 'btn-outline';
          return '<button class="btn btn-sm ' + cls + '" style="font-size:10px" onclick="tpraUpdateFinding(' + i + ',\'confidence\',\'' + c + '\')">' + c + '</button>';
        }).join('');
        const atBtns = ['Both','Vendor-Hosted','Self-Hosted'].map(function(at) {
          return '<button class="btn btn-sm ' + (f.applies_to===at?'btn-cyan':'btn-outline') + '" style="font-size:10px" onclick="tpraUpdateFinding(' + i + ',\'applies_to\',\'' + at + '\')">' + at + '</button>';
        }).join('');
        const sevBtns = ['Critical','High','Medium','Low','Info'].map(function(s) {
          return '<button class="crit-btn ' + (f.severity===s?'sel-'+s:'') + '" onclick="tpraUpdateFinding(' + i + ',\'severity\',\'' + s + '\')">' + s + '</button>';
        }).join('');
        const areaOpts = TPRA_FINDING_AREAS.map(function(a) {
          return '<option value="' + a + '"' + (f.area===a?' selected':'') + '>' + a + '</option>';
        }).join('');
        return '<div class="survey-panel" style="margin-bottom:0.5rem">' +
          '<div class="sph" onclick="document.getElementById(\'fp' + i + '\').classList.toggle(\'open\')">' +
          '<div style="display:flex;align-items:center;gap:8px">' + sevBadge +
          '<span style="font-size:13px;font-weight:700">' + escH(f.area || 'New Finding') + '</span></div>' +
          '<button class="btn btn-sm" style="background:#fee2e2;color:#b91c1c;border:1.5px solid #fca5a5;font-size:10px;padding:2px 7px"' +
          ' onclick="event.stopPropagation();tpraRemoveFinding(' + i + ')">âœ•</button></div>' +
          '<div class="spb open" id="fp' + i + '">' +
          '<div class="form-row" style="margin-bottom:8px">' +
          '<div><div class="field-lbl">Finding Area</div><select onchange="tpraUpdateFinding(' + i + ',\'area\',this.value)">' +
          '<option value="">Select areaâ€¦</option>' + areaOpts + '</select></div>' +
          '<div><div class="field-lbl">Severity</div><div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">' + sevBtns + '</div></div></div>' +
          '<div class="form-row" style="margin-bottom:8px">' +
          '<div><div class="field-lbl">Confidence</div><div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">' + confBtns + '</div></div>' +
          '<div><div class="field-lbl">Applies To</div><div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">' + atBtns + '</div></div></div>' +
          '<div style="margin-bottom:8px"><div class="field-lbl">Finding Detail</div>' +
          '<textarea placeholder="Describe the risk clearlyâ€¦" oninput="tpraUpdateFinding(' + i + ',\'detail\',this.value)">' + escH(f.detail||'') + '</textarea></div>' +
          '<div><div class="field-lbl">Recommendation</div>' +
          '<textarea placeholder="What should the client do?" style="min-height:48px" oninput="tpraUpdateFinding(' + i + ',\'recommendation\',this.value)">' + escH(f.recommendation||'') + '</textarea></div></div></div>';
      }).join('');

  let outstanding = (d.outstanding_items || []).map(function(item, i) {
    return '<div style="display:flex;gap:8px;margin-bottom:6px">' +
      '<input type="text" value="' + escH(item) + '" placeholder="e.g. Please provide your SOC 2 Type II report"' +
      ' oninput="tpraState.draft.outstanding_items[' + i + ']=this.value" style="flex:1">' +
      '<button class="btn btn-sm" style="background:#fee2e2;color:#b91c1c;border:1.5px solid #fca5a5" onclick="tpraRemoveOutstanding(' + i + ')">âœ•</button></div>';
  }).join('');

  return '<div class="card"><div class="card-title">Risk Findings</div>' +
    '<div style="font-size:12px;color:var(--muted);margin-bottom:0.85rem">Document each material concern. Unknown items that matter should be added to the vendor follow-up list below.</div>' +
    findHtml +
    '<button class="btn btn-outline" style="width:100%;margin-top:4px" onclick="tpraAddFinding()">+ Add Finding</button></div>' +
    '<div class="card"><div class="card-title">Vendor Follow-up Items</div>' +
    '<div style="font-size:12px;color:var(--muted);margin-bottom:0.75rem">Questions to send the vendor â€” Unknown gaps that need their response.</div>' +
    outstanding +
    '<button class="btn btn-outline btn-sm" onclick="tpraAddOutstanding()">+ Add Item</button></div>' +
    '<div style="display:flex;justify-content:space-between;gap:8px"><button class="btn btn-outline btn-sm" onclick="tpraGoStep(2)">â† Back</button>' +
    '<div style="display:flex;gap:8px"><button class="btn btn-outline btn-sm" onclick="tpraSaveDraft()">Save Draft</button>' +
    '<button class="btn btn-primary" onclick="tpraNext()">Next: Tier & Rationale â†’</button></div></div>';
}

function tpraStep4() {
  const d = tpraState.draft;
  const suggested = tpraCalcSuggestedTier(d);
  const selected = d.tier || suggested.tier;
  const tierBtns = ['Critical','High','Moderate','Low'].map(function(t) {
    const active = selected === t;
    const cls = active ? (t==='Critical'?'btn-red':t==='Low'?'btn-green':'btn-amber') : 'btn-outline';
    return '<button class="btn ' + cls + '" style="min-width:90px" onclick="tpraState.draft.tier=\'' + t + '\';tpraRender()">' + t + '</button>';
  }).join('');

  let outstanding = '';
  if ((d.outstanding_items || []).length > 0) {
    outstanding = '<div class="card"><div class="card-title">Vendor Follow-ups (' + d.outstanding_items.length + ')</div>' +
      d.outstanding_items.map(function(item, i) {
        return '<div style="display:flex;gap:8px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">' +
          '<span style="font-size:11px;font-weight:700;color:var(--cyan);min-width:18px">' + (i+1) + '.</span>' +
          '<span style="font-size:12px">' + escH(item) + '</span></div>';
      }).join('') + '</div>';
  }

  return '<div class="card"><div class="card-title">Risk Tier</div>' +
    '<div style="background:var(--bg);border-radius:8px;padding:0.85rem 1rem;margin-bottom:1rem;border-left:3px solid var(--cyan)">' +
    '<div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:4px">AUTO-SUGGESTED TIER</div>' +
    '<div style="font-size:13px;font-weight:700;margin-bottom:4px">' + tpraTierBadge(suggested.tier) +
    ' â€” Data Sensitivity: <strong>' + suggested.dataSensitivity + '</strong> Ã— Vendor Signals: <strong>' + suggested.vendorSignal + '</strong></div>' +
    '<div style="font-size:11px;color:var(--muted)">Override below if your professional judgement differs, and document the rationale.</div></div>' +
    '<div class="field-lbl" style="margin-bottom:6px">Selected Tier</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem">' + tierBtns + '</div>' +
    '<div class="field-lbl" style="margin-bottom:4px">Tier Rationale</div>' +
    '<textarea style="min-height:100px" placeholder="Explain the deciding factors: data sensitivity, vendor signals, and any professional judgement appliedâ€¦" oninput="tpraState.draft.tier_rationale=this.value">' + escH(d.tier_rationale) + '</textarea></div>' +
    '<div class="card"><div class="card-title">Prioritised Recommendations</div>' +
    '<textarea style="min-height:120px" placeholder="Key recommendations: contract provisions, required vendor responses, compensating controls, risk acceptance conditions, monitoring requirementsâ€¦" oninput="tpraState.draft.recommendations=this.value">' + escH(d.recommendations) + '</textarea></div>' +
    outstanding +
    '<div style="display:flex;justify-content:space-between;gap:8px"><button class="btn btn-outline btn-sm" onclick="tpraGoStep(3)">â† Back</button>' +
    '<div style="display:flex;gap:8px"><button class="btn btn-outline btn-sm" onclick="tpraSaveDraft()">Save Draft</button>' +
    '<button class="btn btn-primary" onclick="tpraNext()">Next: Review & Publish â†’</button></div></div>';
}

function tpraStep5() {
  const d = tpraState.draft;
  const cats = (d.data_categories || []).map(function(id) {
    const cat = TPRA_DATA_CATEGORIES.find(function(c) { return c.id === id; });
    return cat ? cat.label : id;
  });
  const highSens = tpraHighestSensitivity(d.data_categories || []);
  const findings = d.findings || [];
  const critHigh = findings.filter(function(f) { return f.severity === 'Critical' || f.severity === 'High'; });
  const canComplete = d.vendor_name.trim() && d.tier;

  let rationale = d.tier_rationale
    ? '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:4px">Tier Rationale</div>' +
      '<div style="font-size:12px;background:var(--bg);border-radius:7px;padding:0.65rem 0.85rem;margin-bottom:0.85rem;line-height:1.5">' + escH(d.tier_rationale) + '</div>'
    : '';

  let critHtml = '';
  if (critHigh.length > 0) {
    critHtml = '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--red);margin-bottom:6px">High & Critical Findings</div>' +
      critHigh.map(function(f) {
        return '<div style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">' +
          tpraFindingSevBadge(f.severity) +
          '<div style="flex:1"><div style="font-size:12px;font-weight:700">' + escH(f.area) + '</div>' +
          '<div style="font-size:11px;color:var(--muted);line-height:1.4">' + escH(f.detail || '') + '</div></div></div>';
      }).join('');
  }

  let registerCard = '';
  if (critHigh.length > 0) {
    registerCard = '<div class="card" style="border:1.5px solid var(--cyan)">' +
      '<div class="card-title">Risk Register</div>' +
      '<div style="font-size:12px;color:var(--muted);margin-bottom:0.75rem">' + critHigh.length + ' High/Critical finding' + (critHigh.length!==1?'s':'') + ' can be pushed to the Risk Register as Third-Party risk entries.</div>' +
      '<label class="cb-item ' + (tpraState.pushToRegister?'checked':'') + '" onclick="tpraState.pushToRegister=!tpraState.pushToRegister;tpraRender()">' +
      '<input type="checkbox" ' + (tpraState.pushToRegister?'checked':'') + ' style="pointer-events:none">Push ' + critHigh.length + ' finding' + (critHigh.length!==1?'s':'') + ' to Risk Register on completion</label></div>';
  }

  return '<div class="card"><div class="card-title">Assessment Summary</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:1rem">' +
    '<div style="background:var(--bg);border-radius:8px;padding:0.75rem 1rem"><div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:4px">Vendor</div>' +
    '<div style="font-size:14px;font-weight:700">' + escH(d.vendor_name || 'â€”') + '</div><div style="font-size:12px;color:var(--muted)">' + escH(d.product_name || '') + '</div></div>' +
    '<div style="background:var(--bg);border-radius:8px;padding:0.75rem 1rem"><div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:4px">Risk Tier</div>' +
    '<div style="font-size:22px;font-weight:700;margin-top:2px">' + tpraTierBadge(d.tier) + '</div></div>' +
    '<div style="background:var(--bg);border-radius:8px;padding:0.75rem 1rem"><div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:4px">Data in Scope</div>' +
    '<div style="font-size:11px;margin-bottom:4px">' + (cats.length > 0 ? cats.join(', ') : 'None selected') + '</div>' + tpraSensBadge(highSens) + '</div>' +
    '<div style="background:var(--bg);border-radius:8px;padding:0.75rem 1rem"><div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:4px">Findings</div>' +
    '<div style="font-size:20px;font-weight:700">' + findings.length + '</div><div style="font-size:12px;color:var(--red)">' + critHigh.length + ' High or Critical</div></div></div>' +
    rationale + critHtml + '</div>' + registerCard +
    '<div class="card" style="background:linear-gradient(135deg,#0d1b4e,#152168);border:none">' +
    '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--cyan2);margin-bottom:0.5rem">Generate Word Report</div>' +
    '<div style="font-size:12px;color:rgba(255,255,255,0.7);margin-bottom:1rem;line-height:1.5">After completing, ask Claude to generate the full .docx vendor risk report. Click below to copy a pre-filled prompt with your assessment data.</div>' +
    '<button class="btn" style="background:var(--cyan);color:#fff;width:100%" onclick="tpraCopyPrompt()">ðŸ“‹ Copy Report Prompt for Claude</button></div>' +
    '<div style="display:flex;justify-content:space-between;gap:8px"><button class="btn btn-outline btn-sm" onclick="tpraGoStep(4)">â† Back</button>' +
    '<div style="display:flex;gap:8px"><button class="btn btn-outline btn-sm" onclick="tpraSaveDraft()">Save as Draft</button>' +
    '<button class="btn btn-green" onclick="tpraComplete()" ' + (canComplete?'':'disabled title="Vendor name and tier required"') + '>âœ“ Complete Assessment</button></div></div>';
}

function renderTPRADetail(a) {
  const cats = (a.data_categories || []).map(function(id) {
    const cat = TPRA_DATA_CATEGORIES.find(function(c) { return c.id === id; });
    return cat ? cat.label : id;
  });
  const highSens = tpraHighestSensitivity(a.data_categories || []);
  const profile = a.vendor_profile || {};
  const profConf = a.profile_confidence || {};
  const findings = (a.findings || []).slice().sort(function(x, y) {
    const o = {Critical:0,High:1,Medium:2,Low:3,Info:4};
    return (o[x.severity]||4) - (o[y.severity]||4);
  });

  const catChips = (a.data_categories||[]).map(function(id) {
    const cat = TPRA_DATA_CATEGORIES.find(function(c) { return c.id === id; });
    return cat ? '<span class="cb-item checked">' + escH(cat.label) + ' ' + tpraSensBadge(cat.sensitivity) + '</span>' : '';
  }).join('');

  const profileRows = TPRA_PROFILE_ATTRS.map(function(attr) {
    const val = profile[attr.key];
    const c = profConf[attr.key];
    return '<tr><td style="padding:8px;border-bottom:1px solid var(--border);font-weight:700;white-space:nowrap">' + escH(attr.label) + '</td>' +
      '<td style="padding:8px;border-bottom:1px solid var(--border);color:' + (val?'var(--text)':'var(--muted)') + '">' + (val ? escH(val) : 'â€”') + '</td>' +
      '<td style="padding:8px;border-bottom:1px solid var(--border)">' + (c ? tpraConfBadge(c) : '<span style="color:var(--muted)">â€”</span>') + '</td></tr>';
  }).join('');

  const findingsHtml = findings.length > 0
    ? '<div class="card"><div class="card-title">Risk Findings (' + findings.length + ')</div>' +
      findings.map(function(f) {
        const atBadge = f.applies_to && f.applies_to !== 'Both' ? '<span class="badge b-gray" style="font-size:9px">' + f.applies_to + '</span>' : '';
        return '<div style="padding:0.75rem 0;border-bottom:1px solid var(--border)">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">' +
          tpraFindingSevBadge(f.severity) + '<span style="font-size:13px;font-weight:700">' + escH(f.area) + '</span>' + atBadge +
          (f.confidence ? '<span style="margin-left:auto">' + tpraConfBadge(f.confidence) + '</span>' : '') + '</div>' +
          '<div style="font-size:12px;color:var(--text);line-height:1.5;margin-bottom:4px">' + escH(f.detail||'') + '</div>' +
          (f.recommendation ? '<div style="font-size:12px;color:var(--navy);background:#eef1ff;border-radius:6px;padding:5px 9px;margin-top:4px"><strong>â†’</strong> ' + escH(f.recommendation) + '</div>' : '') +
          '</div>';
      }).join('') + '</div>'
    : '';

  const outstandingHtml = (a.outstanding_items||[]).length > 0
    ? '<div class="card"><div class="card-title">Vendor Follow-up Items (' + a.outstanding_items.length + ')</div>' +
      a.outstanding_items.map(function(item, i) {
        return '<div style="display:flex;gap:8px;align-items:flex-start;padding:6px 0;border-bottom:1px solid var(--border)">' +
          '<span style="font-size:11px;font-weight:700;color:var(--cyan);min-width:18px">' + (i+1) + '.</span>' +
          '<span style="font-size:12px">' + escH(item) + '</span></div>';
      }).join('') + '</div>'
    : '';

  return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:0.85rem;flex-wrap:wrap">' +
    '<button class="btn btn-outline btn-sm" onclick="tpraBackToList()">â† Back</button>' +
    '<div style="flex:1;font-size:15px;font-weight:700">' + escH(a.vendor_name) + ' â€” Vendor Risk Assessment</div>' +
    '<button class="btn btn-outline btn-sm" onclick="tpraEdit(\'' + a.id + '\')">Edit</button>' +
    '<button class="btn btn-cyan btn-sm" onclick="tpraCopyPromptForId(\'' + a.id + '\')">ðŸ“‹ Copy Report Prompt</button></div>' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:0.85rem">' +
    '<div class="wcard"><div class="wcard-label">Risk Tier</div><div style="margin-top:6px">' + tpraTierBadge(a.tier) + '</div></div>' +
    '<div class="wcard"><div class="wcard-label">Data Sensitivity</div><div style="margin-top:6px">' + tpraSensBadge(highSens) + '</div><div class="wcard-sub">' + cats.length + ' categor' + (cats.length!==1?'ies':'y') + '</div></div>' +
    '<div class="wcard"><div class="wcard-label">Findings</div><div class="wcard-val">' + findings.length + '</div><div class="wcard-sub" style="color:var(--red)">' + findings.filter(function(f) { return f.severity==='Critical'||f.severity==='High'; }).length + ' High+</div></div>' +
    '<div class="wcard"><div class="wcard-label">Status</div><div style="margin-top:6px"><span class="badge ' + (a.status==='complete'?'b-green':'b-amber') + '">' + (a.status==='complete'?'Complete':'Draft') + '</span></div><div class="wcard-sub">' + new Date(a.created_at).toLocaleDateString() + '</div></div></div>' +
    (a.tier_rationale ? '<div class="card"><div class="card-title">Tier Rationale</div><div style="font-size:13px;line-height:1.6">' + escH(a.tier_rationale) + '</div></div>' : '') +
    '<div class="card"><div class="card-title">Data in Scope</div><div class="checkbox-group">' + catChips + '</div>' +
    (a.jurisdiction ? '<div style="margin-top:8px;font-size:12px"><strong>Jurisdiction:</strong> ' + escH(a.jurisdiction) + (a.data_residency?' Â· <strong>Residency:</strong> '+escH(a.data_residency):'') + '</div>' : '') + '</div>' +
    '<div class="card"><div class="card-title">Vendor Profile</div>' +
    '<table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr>' +
    '<th style="text-align:left;padding:6px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted);border-bottom:2px solid var(--border);white-space:nowrap">Attribute</th>' +
    '<th style="text-align:left;padding:6px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted);border-bottom:2px solid var(--border)">Value</th>' +
    '<th style="text-align:left;padding:6px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted);border-bottom:2px solid var(--border)">Confidence</th>' +
    '</tr></thead><tbody>' + profileRows +
    (profile.recent_developments ? '<tr><td style="padding:8px;font-weight:700;vertical-align:top">Recent Developments</td><td style="padding:8px;line-height:1.5" colspan="2">' + escH(profile.recent_developments) + '</td></tr>' : '') +
    '</tbody></table></div>' + findingsHtml +
    (a.recommendations ? '<div class="card"><div class="card-title">Recommendations</div><div style="font-size:13px;line-height:1.6;white-space:pre-wrap">' + escH(a.recommendations) + '</div></div>' : '') +
    outstandingHtml;
}

// â”€â”€ Event handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function tpraNew() {
  tpraState.draft = tpraBlankDraft();
  tpraState.view = 'wizard';
  tpraState.step = 1;
  tpraState.pushToRegister = false;
  tpraRender();
}
function tpraBackToList() { tpraState.view = 'list'; tpraRender(); }
function tpraGoStep(n)    { tpraState.step = n; tpraRender(); }
function tpraViewDetail(id) { tpraState.detailId = id; tpraState.view = 'detail'; tpraRender(); }

function tpraNext() {
  if (tpraState.step === 1 && !tpraState.draft.vendor_name.trim()) { toast('Please enter a vendor name', '#b91c1c'); return; }
  tpraState.step++;
  tpraSaveDraftSilent();
  tpraRender();
}

async function tpraSaveDraft() { await tpraSaveDraftSilent(); toast('Draft saved âœ“'); }

async function tpraSaveDraftSilent() {
  const d = tpraState.draft;
  if (!d.vendor_name.trim()) return;
  const row = {
    org_id: currentOrg.id,
    vendor_name: d.vendor_name, product_name: d.product_name, website: d.website, assessor: d.assessor,
    status: 'draft', tier: d.tier || null, tier_rationale: d.tier_rationale,
    jurisdiction: d.jurisdiction, data_residency: d.data_residency,
    data_categories: d.data_categories, provided_docs: d.provided_docs,
    vendor_profile: d.vendor_profile, profile_confidence: d.profile_confidence,
    findings: d.findings, recommendations: d.recommendations, outstanding_items: d.outstanding_items,
    updated_at: new Date().toISOString(),
  };
  if (d.id) row.id = d.id;
  try {
    const result = await sb.tpra.upsert(row);
    const saved = Array.isArray(result) ? result[0] : result;
    if (saved && saved.id) tpraState.draft.id = saved.id;
    const rows = await sb.tpra.getAll(currentOrg.id);
    tpraState.assessments = rows || [];
  } catch (e) { toast('Save failed: ' + e.message, '#b91c1c'); }
}

async function tpraComplete() {
  const d = tpraState.draft;
  if (!d.vendor_name.trim() || !d.tier) { toast('Vendor name and tier are required', '#b91c1c'); return; }
  const row = {
    org_id: currentOrg.id,
    vendor_name: d.vendor_name, product_name: d.product_name, website: d.website, assessor: d.assessor,
    status: 'complete', tier: d.tier, tier_rationale: d.tier_rationale,
    jurisdiction: d.jurisdiction, data_residency: d.data_residency,
    data_categories: d.data_categories, provided_docs: d.provided_docs,
    vendor_profile: d.vendor_profile, profile_confidence: d.profile_confidence,
    findings: d.findings, recommendations: d.recommendations, outstanding_items: d.outstanding_items,
    completed_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
  if (d.id) row.id = d.id;
  try {
    const result = await sb.tpra.upsert(row);
    const saved = Array.isArray(result) ? result[0] : result;
    if (saved && saved.id) { tpraState.draft.id = saved.id; tpraState.detailId = saved.id; }
    const rows = await sb.tpra.getAll(currentOrg.id);
    tpraState.assessments = rows || [];
    tpraState.view = 'detail';
    toast('Assessment completed âœ“', '#15803d');
    tpraRender();
  } catch (e) { toast('Error: ' + e.message, '#b91c1c'); }
}

async function tpraEdit(id) {
  const a = tpraState.assessments.find(function(x) { return x.id === id; });
  if (!a) return;
  tpraState.draft = {
    id: a.id, vendor_name: a.vendor_name||'', product_name: a.product_name||'', website: a.website||'', assessor: a.assessor||'',
    jurisdiction: a.jurisdiction||'Canada', data_residency: a.data_residency||'',
    data_categories: a.data_categories||[], provided_docs: a.provided_docs||'',
    vendor_profile: a.vendor_profile||{}, profile_confidence: a.profile_confidence||{},
    findings: a.findings||[], recommendations: a.recommendations||'', outstanding_items: a.outstanding_items||[],
    tier: a.tier||null, tier_rationale: a.tier_rationale||'', status: a.status||'draft',
  };
  tpraState.view = 'wizard'; tpraState.step = 1; tpraState.pushToRegister = false;
  tpraRender();
}

async function tpraDeleteConfirm(id) {
  if (!confirm('Delete this vendor assessment? This cannot be undone.')) return;
  try {
    await sb.tpra.delete(id);
    tpraState.assessments = tpraState.assessments.filter(function(a) { return a.id !== id; });
    if (tpraState.view === 'detail' && tpraState.detailId === id) tpraState.view = 'list';
    toast('Assessment deleted'); tpraRender();
  } catch (e) { toast('Delete failed', '#b91c1c'); }
}

function tpraToggleCat(id) {
  const cats = tpraState.draft.data_categories || [];
  const idx = cats.indexOf(id);
  if (idx >= 0) cats.splice(idx, 1); else cats.push(id);
  tpraState.draft.data_categories = cats;
  tpraRender();
}

function tpraSetProf(key, val) {
  if (!tpraState.draft.vendor_profile) tpraState.draft.vendor_profile = {};
  tpraState.draft.vendor_profile[key] = val;
}

function tpraSetConf(key, val) {
  if (!tpraState.draft.profile_confidence) tpraState.draft.profile_confidence = {};
  tpraState.draft.profile_confidence[key] = val;
  tpraRender();
}

function tpraAddFinding() {
  if (!tpraState.draft.findings) tpraState.draft.findings = [];
  tpraState.draft.findings.push({ area:'', severity:'', confidence:'', applies_to:'Both', detail:'', recommendation:'' });
  tpraRender();
}

function tpraRemoveFinding(i) { tpraState.draft.findings.splice(i, 1); tpraRender(); }

function tpraUpdateFinding(i, key, val) {
  tpraState.draft.findings[i][key] = val;
  if (key === 'severity' || key === 'confidence' || key === 'applies_to') tpraRender();
}

function tpraAddOutstanding() {
  if (!tpraState.draft.outstanding_items) tpraState.draft.outstanding_items = [];
  tpraState.draft.outstanding_items.push('');
  tpraRender();
}

function tpraRemoveOutstanding(i) { tpraState.draft.outstanding_items.splice(i, 1); tpraRender(); }

function tpraCopyPrompt() { tpraBuildAndCopy(tpraState.draft); }

function tpraCopyPromptForId(id) {
  const a = tpraState.assessments.find(function(x) { return x.id === id; });
  if (a) tpraBuildAndCopy(a);
}

function tpraBuildAndCopy(d) {
  const cats = (d.data_categories||[]).map(function(id) {
    const cat = TPRA_DATA_CATEGORIES.find(function(c) { return c.id === id; });
    return cat ? cat.label : id;
  });
  const findings = d.findings || [];
  const profile = d.vendor_profile || {};
  const conf = d.profile_confidence || {};

  const profileLines = TPRA_PROFILE_ATTRS
    .filter(function(a) { return profile[a.key]; })
    .map(function(a) { return '- ' + a.label + ': ' + profile[a.key] + ' [' + (conf[a.key]||'Unknown') + ']'; })
    .join('\n') || '(not completed)';

  const findingLines = findings.length
    ? findings.map(function(f, i) {
        return (i+1) + '. [' + (f.severity||'?') + '] [' + (f.confidence||'?') + '] ' + f.area + ': ' + f.detail +
               '\n   Recommendation: ' + (f.recommendation||'TBD');
      }).join('\n\n')
    : '(none)';

  const prompt = 'Please generate a Third-Party Risk Assessment report using the TPRA skill. Here is the assessment data:\n\n' +
    'VENDOR: ' + d.vendor_name + (d.product_name ? '\nPRODUCT: ' + d.product_name : '') + (d.website ? '\nWEBSITE: ' + d.website : '') + (d.assessor ? '\nASSESSOR: ' + d.assessor : '') + '\n\n' +
    'DATA CATEGORIES IN SCOPE: ' + (cats.join(', ') || 'None specified') + '\n' +
    'JURISDICTION: ' + (d.jurisdiction || 'Not specified') + '\n' +
    'DATA RESIDENCY REQUIREMENT: ' + (d.data_residency || 'None specified') + '\n' +
    (d.provided_docs ? 'PROVIDED DOCUMENTATION: ' + d.provided_docs + '\n' : '') + '\n' +
    'RISK TIER: ' + (d.tier || 'TBD') + '\n' +
    'TIER RATIONALE: ' + (d.tier_rationale || 'TBD') + '\n\n' +
    'VENDOR PROFILE:\n' + profileLines + (profile.recent_developments ? '\n- Recent Developments: ' + profile.recent_developments : '') + '\n\n' +
    'FINDINGS (' + findings.length + '):\n' + findingLines + '\n\n' +
    'OVERALL RECOMMENDATIONS:\n' + (d.recommendations || 'TBD') + '\n\n' +
    'OUTSTANDING VENDOR FOLLOW-UP ITEMS:\n' +
    ((d.outstanding_items||[]).length ? (d.outstanding_items||[]).map(function(item,i){ return (i+1)+'. '+item; }).join('\n') : '(none)') + '\n\n' +
    'Please produce the full Word .docx report based on this intake data, following the TPRA skill\'s report structure.';

  try {
    navigator.clipboard.writeText(prompt);
    toast('Prompt copied â€” paste into Claude to generate the report âœ“', '#15803d');
  } catch(e) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.display = 'flex';
    backdrop.innerHTML = '<div class="modal-box"><div class="modal-header"><div class="modal-title">Copy this prompt and paste into Claude</div>' +
      '<button class="modal-close" onclick="this.closest(\'.modal-backdrop\').remove()">âœ•</button></div>' +
      '<div class="modal-body"><textarea style="width:100%;min-height:300px;font-size:11px;font-family:monospace">' + prompt.replace(/</g,'&lt;') + '</textarea></div>' +
      '<div class="modal-footer"><button class="btn btn-primary" onclick="this.closest(\'.modal-backdrop\').remove()">Close</button></div></div>';
    backdrop.onclick = function(ev) { if (ev.target===backdrop) backdrop.remove(); };
    document.body.appendChild(backdrop);
  }
}

