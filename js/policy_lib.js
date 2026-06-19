// ============================================================
// policy_lib.js — Policy Library
// Platform-level policy template catalog.
// Organised by framework (NIST CSF 2.0 / NIST AI RMF).
// Templates are placeholders until real files are uploaded.
// ============================================================

let plibState = {
  filter: 'all',    // 'all' | 'nist_csf' | 'nist_ai'
  highlight: null,  // policy id to scroll-highlight (set from POAM backlink)
};

// ── CATALOG ───────────────────────────────────────────────────────────────────
// cisGroups: CIS control group numbers this policy covers (for POAM backlinks)
// url: set to a download URL when the real template is ready; null = placeholder

const POLICY_TEMPLATES = [
  // ── NIST CSF 2.0 ──────────────────────────────────────────────────────────
  {
    id: 'pol_isp',
    name: 'Information Security Policy',
    framework: 'nist_csf',
    frameworkLabel: 'NIST CSF 2.0',
    domain: 'Govern',
    controls: ['GV.OC', 'GV.PO'],
    description: 'Establishes the organisation\'s commitment to protecting information assets, defines security scope, roles, and responsibilities across all systems and data.',
    cisGroups: [4, 8, 9, 10, 12, 13, 16],
    url: null,
  },
  {
    id: 'pol_rmp',
    name: 'Risk Management Policy',
    framework: 'nist_csf',
    frameworkLabel: 'NIST CSF 2.0',
    domain: 'Govern / Identify',
    controls: ['GV.RM', 'ID.RA'],
    description: 'Defines the risk management methodology, risk appetite, and how identified risks are assessed, treated, and monitored over time.',
    cisGroups: [4, 7],
    url: null,
  },
  {
    id: 'pol_acp',
    name: 'Access Control Policy',
    framework: 'nist_csf',
    frameworkLabel: 'NIST CSF 2.0',
    domain: 'Protect',
    controls: ['PR.AA'],
    description: 'Governs how access to systems and data is provisioned, reviewed, and revoked. Covers MFA, least-privilege, and identity lifecycle management.',
    cisGroups: [5, 6],
    url: null,
  },
  {
    id: 'pol_irp',
    name: 'Incident Response Policy',
    framework: 'nist_csf',
    frameworkLabel: 'NIST CSF 2.0',
    domain: 'Respond / Recover',
    controls: ['RS.MA', 'RS.CO', 'RC.RP'],
    description: 'Defines how security incidents are identified, classified, contained, and reported. Includes roles, communication chains, and regulatory notification timelines.',
    cisGroups: [17],
    url: null,
  },
  {
    id: 'pol_amp',
    name: 'Asset Management Policy',
    framework: 'nist_csf',
    frameworkLabel: 'NIST CSF 2.0',
    domain: 'Identify',
    controls: ['ID.AM'],
    description: 'Establishes requirements for maintaining accurate inventories of hardware and software assets, including classification and ownership assignment.',
    cisGroups: [1, 2],
    url: null,
  },
  {
    id: 'pol_dcp',
    name: 'Data Classification & Handling Policy',
    framework: 'nist_csf',
    frameworkLabel: 'NIST CSF 2.0',
    domain: 'Protect',
    controls: ['PR.DS'],
    description: 'Defines how data is classified by sensitivity, handled in transit and at rest, retained, and securely disposed of at end of life.',
    cisGroups: [3],
    url: null,
  },
  {
    id: 'pol_vmp',
    name: 'Vulnerability Management Policy',
    framework: 'nist_csf',
    frameworkLabel: 'NIST CSF 2.0',
    domain: 'Identify / Protect',
    controls: ['ID.RA', 'PR.PS'],
    description: 'Establishes frequency, scope, and remediation timelines for vulnerability scanning, patch management, and penetration testing programs.',
    cisGroups: [7, 18],
    url: null,
  },
  {
    id: 'pol_tprp',
    name: 'Third-Party & Vendor Risk Policy',
    framework: 'nist_csf',
    frameworkLabel: 'NIST CSF 2.0',
    domain: 'Govern',
    controls: ['GV.SC'],
    description: 'Governs how third-party vendors are assessed, onboarded, monitored, and offboarded. Includes contractual security requirements and ongoing review cadence.',
    cisGroups: [15],
    url: null,
  },
  {
    id: 'pol_satp',
    name: 'Security Awareness & Training Policy',
    framework: 'nist_csf',
    frameworkLabel: 'NIST CSF 2.0',
    domain: 'Protect',
    controls: ['PR.AT'],
    description: 'Defines mandatory security training requirements for all staff, training frequency, role-specific programs, and phishing simulation requirements.',
    cisGroups: [14],
    url: null,
  },
  {
    id: 'pol_bcrp',
    name: 'Business Continuity & DR Policy',
    framework: 'nist_csf',
    frameworkLabel: 'NIST CSF 2.0',
    domain: 'Recover',
    controls: ['RC.RP', 'RC.CO'],
    description: 'Establishes RTO/RPO targets, backup requirements, failover procedures, and the conditions under which the BC Plan is formally activated.',
    cisGroups: [11],
    url: null,
  },

  // ── NIST AI RMF ───────────────────────────────────────────────────────────
  {
    id: 'pol_aigov',
    name: 'AI Governance Policy',
    framework: 'nist_ai',
    frameworkLabel: 'NIST AI RMF',
    domain: 'GOVERN',
    controls: ['GV-1.1', 'GV-1.2', 'GV-2.1'],
    description: 'Establishes accountability structures, roles, and decision rights for the development, procurement, and deployment of AI systems across the organisation.',
    cisGroups: [],
    url: null,
    downloads: [
      { label: 'Comprehensive', url: 'templates/ENT-Draft-POL-AI%20Governance-Comprehensive-6.26.docx' },
      { label: 'SMB', url: 'templates/ENT-Draft-POL-AI%20Governance-SMB-6.26.docx' },
    ],
  },
  {
    id: 'pol_aiaup',
    name: 'AI Acceptable Use Policy',
    framework: 'nist_ai',
    frameworkLabel: 'NIST AI RMF',
    domain: 'GOVERN',
    controls: ['GV-1.1', 'GV-5.1', 'GV-6.1'],
    description: 'Defines permitted and prohibited uses of AI tools by employees, contractors, and third parties. Covers data input restrictions, output verification requirements, disclosure obligations when AI-generated content is shared externally, and consequences for misuse.',
    cisGroups: [],
    url: null,
    downloads: [
      { label: 'Comprehensive', url: 'templates/ENT-Draft-POL-AUP-Comprehensive-6.26.docx' },
      { label: 'SMB', url: 'templates/ENT-Draft-POL-AUP-SMB-6.26.docx' },
    ],
  },
  {
    id: 'pol_airmp',
    name: 'AI Risk Management Policy',
    framework: 'nist_ai',
    frameworkLabel: 'NIST AI RMF',
    domain: 'MAP / MEASURE / MANAGE',
    controls: ['MP-1.1', 'MS-1.1', 'MG-1.1'],
    description: 'Defines how AI-related risks are identified, classified, measured, and treated across the full AI system lifecycle from inception to decommission.',
    cisGroups: [],
    url: null,
    downloads: [
      { label: 'Comprehensive', url: 'templates/ENT-Draft-POL-AI%20Risk%20Management-Comprehensive-6.26.docx' },
      { label: 'SMB', url: 'templates/ENT-Draft-POL-AI%20Risk%20Management-SMB-6.26.docx' },
    ],
  },
  {
    id: 'pol_aiinv',
    name: 'AI Use Case Inventory Policy',
    framework: 'nist_ai',
    frameworkLabel: 'NIST AI RMF',
    domain: 'MAP',
    controls: ['MP-2.1', 'MP-3.1'],
    description: 'Requires a maintained register of all AI systems in use, their purpose, data inputs, risk classification, approval status, and responsible owner.',
    cisGroups: [],
    url: null,
    downloads: [
      { label: 'Comprehensive', url: 'templates/ENT-Draft-POL-AI%20Use%20Case%20Inventory-Comprehensive-6.26.docx' },
      { label: 'SMB', url: 'templates/ENT-Draft-POL-AI%20Use%20Case%20Inventory-SMB-6.26.docx' },
    ],
  },
  {
    id: 'pol_aiirp',
    name: 'AI Incident Response Policy',
    framework: 'nist_ai',
    frameworkLabel: 'NIST AI RMF',
    domain: 'MANAGE',
    controls: ['MG-2.2', 'MG-4.1'],
    description: 'Defines how AI-specific incidents — harmful outputs, model drift, adversarial attacks, data poisoning — are detected, escalated, contained, and remediated.',
    cisGroups: [],
    url: null,
    downloads: [
      { label: 'Comprehensive', url: 'templates/ENT-Draft-POL-AI%20Incident%20Response-Comprehensive-6.26.docx' },
      { label: 'SMB', url: 'templates/ENT-Draft-POL-AI%20Incident%20Response-SMB-6.26.docx' },
    ],
  },
  {
    id: 'pol_aitap',
    name: 'AI Transparency & Accountability Policy',
    framework: 'nist_ai',
    frameworkLabel: 'NIST AI RMF',
    domain: 'GOVERN / MANAGE',
    controls: ['GV-5.1', 'GV-6.1', 'MG-3.1'],
    description: 'Establishes disclosure obligations for AI use to stakeholders, explainability standards, and accountability for AI-driven decisions affecting individuals.',
    cisGroups: [],
    url: null,
    downloads: [
      { label: 'Comprehensive', url: 'templates/ENT-Draft-POL-AI%20Transparency%20and%20Accountability-Comprehensive-6.26.docx' },
      { label: 'SMB', url: 'templates/ENT-Draft-POL-AI%20Transparency%20and%20Accountability-SMB-6.26.docx' },
    ],
  },
  {
    id: 'pol_aidqp',
    name: 'AI Data Quality & Bias Management Policy',
    framework: 'nist_ai',
    frameworkLabel: 'NIST AI RMF',
    domain: 'MEASURE',
    controls: ['MS-2.1', 'MS-2.5', 'MS-3.1'],
    description: 'Defines requirements for training and test data quality, bias detection methods, fairness evaluation criteria, and ongoing model performance monitoring.',
    cisGroups: [],
    url: null,
    downloads: [
      { label: 'Comprehensive', url: 'templates/ENT-Draft-POL-AI%20Data%20Quality%20and%20Bias%20Management-Comprehensive-6.26.docx' },
      { label: 'SMB', url: 'templates/ENT-Draft-POL-AI%20Data%20Quality%20and%20Bias%20Management-SMB-6.26.docx' },
    ],
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

// Returns all policies that cover a given CIS control group number
function plibForCisGroup(groupNum) {
  return POLICY_TEMPLATES.filter(p => (p.cisGroups || []).includes(groupNum));
}

// Navigate to Policy Library and highlight a specific policy
function plibOpenFromPoam(policyId) {
  plibState.filter = 'all';
  plibState.highlight = policyId;
  setNav('policy_lib');
  setTimeout(() => {
    const el = document.getElementById('plib-' + policyId);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }, 100);
}

function plibSetFilter(fw) {
  plibState.filter = fw;
  renderMain();
}

// ── RENDER ────────────────────────────────────────────────────────────────────

function renderPolicyLib() {
  const filtered = plibState.filter === 'all'
    ? POLICY_TEMPLATES
    : POLICY_TEMPLATES.filter(p => p.framework === plibState.filter);

  const csf  = POLICY_TEMPLATES.filter(p => p.framework === 'nist_csf').length;
  const ai   = POLICY_TEMPLATES.filter(p => p.framework === 'nist_ai').length;

  const tabs = [
    { id: 'all',      label: `All (${POLICY_TEMPLATES.length})` },
    { id: 'nist_csf', label: `NIST CSF 2.0 (${csf})` },
    { id: 'nist_ai',  label: `NIST AI RMF (${ai})` },
  ];

  return `${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:1rem">
    <div style="font-size:17px;font-weight:700">&#x1F4C4; Policy Library</div>
    <div style="font-size:12px;color:var(--muted)">Templates are placeholders — download available once files are uploaded</div>
  </div>

  <div class="view-tabs" style="margin-bottom:1.25rem">
    ${tabs.map(t => `<button class="view-tab${plibState.filter === t.id ? ' active' : ''}" onclick="plibSetFilter('${t.id}')">${t.label}</button>`).join('')}
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1rem">
    ${filtered.map(p => plibRenderCard(p)).join('')}
  </div>`;
}

function plibRenderCard(p) {
  const isCsf   = p.framework === 'nist_csf';
  const isHl    = plibState.highlight === p.id;
  const accentCol = isCsf ? 'var(--navy)' : '#7c3aed';
  const fwBg     = isCsf ? '#eff6ff' : '#f5f3ff';
  const fwTxt    = isCsf ? '#1d4ed8' : '#6d28d9';

  const controlChips = p.controls.map(c =>
    `<span style="font-size:10px;font-weight:600;padding:2px 7px;border-radius:6px;background:${fwBg};color:${fwTxt};border:1px solid ${isCsf ? '#bfdbfe' : '#ddd6fe'}">${c}</span>`
  ).join('');

  const hasDownloads = p.downloads && p.downloads.length > 0;
  const hasUrl = !!p.url;
  const isAvailable = hasDownloads || hasUrl;

  const downloadBtns = hasDownloads
    ? p.downloads.map(d => `<a href="${d.url}" download class="btn btn-cyan btn-sm" style="text-decoration:none">&#x2193; ${escH(d.label)}</a>`).join('')
    : hasUrl
      ? `<a href="${p.url}" target="_blank" rel="noopener" class="btn btn-cyan btn-sm" style="text-decoration:none">&#x2193; Download</a>`
      : `<button class="btn btn-sm" disabled style="opacity:.45;cursor:default;background:var(--border);color:var(--muted);border:none">&#x2193; In Development</button>`;

  const statusBadge = isAvailable
    ? `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;background:#dcfce7;color:#15803d">&#x2713; Available</span>`
    : `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;background:#fef3c7;color:#b45309">&#x23F3; Placeholder</span>`;

  return `<div id="plib-${p.id}" class="card" style="padding:1.1rem 1.2rem;border-top:3px solid ${accentCol};${isHl ? 'box-shadow:0 0 0 3px rgba(7,180,217,.35);' : ''}transition:box-shadow .2s">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:.6rem">
      <div style="font-size:13px;font-weight:700;color:var(--text);line-height:1.3">${escH(p.name)}</div>
      <span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;background:${fwBg};color:${fwTxt};white-space:nowrap;flex-shrink:0">${p.frameworkLabel}</span>
    </div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:.55rem;font-weight:600;letter-spacing:.02em">${escH(p.domain)}</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:.75rem">${controlChips}</div>
    <div style="font-size:12px;color:var(--text);line-height:1.5;margin-bottom:1rem">${escH(p.description)}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
      ${statusBadge}
      <div style="display:flex;gap:6px;flex-wrap:wrap">${downloadBtns}</div>
    </div>
  </div>`;
}
