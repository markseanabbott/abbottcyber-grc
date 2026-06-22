// cmmc.js — CMMC Level 1 Assessment Module
// Built on assessment_core.js (ac* functions).
// Stores runs in the 'assessments' table with module: 'cmmc'.
// POAM stored as _poam key in assessment answers JSONB (no separate table needed).

'use strict';

// ── PRACTICES DATA ────────────────────────────────────────────────────────────

const CMMC_L1_PRACTICES = [
  // ACCESS CONTROL
  { id: 'AC.L1-3.1.1', domain: 'AC', title: 'Authorized Access Control',
    desc: 'Limit information system access to authorized users, processes acting on behalf of authorized users, and devices (including other information systems).',
    sprsWeight: 5, example: 'User accounts, Active Directory/Entra ID, access control lists.' },
  { id: 'AC.L1-3.1.2', domain: 'AC', title: 'Transaction & Function Control',
    desc: 'Limit information system access to the types of transactions and functions that authorized users are permitted to execute.',
    sprsWeight: 3, example: 'Role-based access control (RBAC), least-privilege accounts, no admin rights for standard users.' },
  { id: 'AC.L1-3.1.20', domain: 'AC', title: 'External Connections',
    desc: 'Verify and control/limit connections to external information systems.',
    sprsWeight: 3, example: 'Firewall rules for outbound connections, approved external service list, VPN controls.' },
  { id: 'AC.L1-3.1.22', domain: 'AC', title: 'Publicly Accessible Content',
    desc: 'Control CUI posted or processed on publicly accessible information systems.',
    sprsWeight: 2, example: 'Review process before publishing to public-facing systems; no FCI/CUI on public websites.' },

  // IDENTIFICATION & AUTHENTICATION
  { id: 'IA.L1-3.5.1', domain: 'IA', title: 'Identification',
    desc: 'Identify information system users, processes acting on behalf of users, or devices.',
    sprsWeight: 3, example: 'Unique user accounts for every person; no shared/generic logins.' },
  { id: 'IA.L1-3.5.2', domain: 'IA', title: 'Authentication',
    desc: 'Authenticate (or verify) the identities of those users, processes, or devices as a prerequisite to allowing access to organizational information systems.',
    sprsWeight: 5, example: 'Passwords + MFA for all accounts with access to FCI; no blank passwords.' },

  // MEDIA PROTECTION
  { id: 'MP.L1-3.8.3', domain: 'MP', title: 'Media Disposal',
    desc: 'Sanitize or destroy information system media containing Federal Contract Information before disposal or reuse.',
    sprsWeight: 3, example: 'Secure wipe (DBAN, BitLocker wipe), physical shredding of drives, certificate of destruction.' },

  // PHYSICAL PROTECTION
  { id: 'PE.L1-3.10.1', domain: 'PE', title: 'Limit Physical Access',
    desc: 'Limit physical access to organizational information systems, equipment, and the respective operating environments to authorized individuals.',
    sprsWeight: 3, example: 'Locked server rooms, badge/key access, visitor sign-in, locked workstations.' },
  { id: 'PE.L1-3.10.2', domain: 'PE', title: 'Monitor Facility',
    desc: 'Protect and monitor the physical facility and support infrastructure for organizational information systems.',
    sprsWeight: 2, example: 'Security cameras, alarm systems, UPS, environmental monitoring.' },
  { id: 'PE.L1-3.10.3', domain: 'PE', title: 'Escort Visitors',
    desc: 'Escort visitors and monitor visitor activity in areas containing FCI systems.',
    sprsWeight: 2, example: 'Visitor sign-in log, visitor badges, escort policy for secure areas.' },
  { id: 'PE.L1-3.10.4', domain: 'PE', title: 'Physical Access Logs',
    desc: 'Maintain audit logs of physical access to organizational facilities where FCI systems are located.',
    sprsWeight: 2, example: 'Electronic badge logs, visitor logbooks, camera footage retention.' },

  // SYSTEM & COMMUNICATIONS PROTECTION
  { id: 'SC.L1-3.13.1', domain: 'SC', title: 'Boundary Protection',
    desc: 'Monitor, control, and protect organizational communications (transmitted or received) at external boundaries and key internal boundaries of information systems.',
    sprsWeight: 5, example: 'Perimeter firewall, email gateway, web proxy; monitoring of traffic crossing network boundary.' },
  { id: 'SC.L1-3.13.5', domain: 'SC', title: 'Public-Access Separation',
    desc: 'Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.',
    sprsWeight: 3, example: 'DMZ for web servers, guest Wi-Fi on separate VLAN, public servers isolated from internal LAN.' },

  // SYSTEM & INFORMATION INTEGRITY
  { id: 'SI.L1-3.14.1', domain: 'SI', title: 'Flaw Remediation',
    desc: 'Identify, report, and correct information and information system flaws in a timely manner.',
    sprsWeight: 5, example: 'Patch management process, RMM auto-patching, tracking of known vulnerabilities.' },
  { id: 'SI.L1-3.14.2', domain: 'SI', title: 'Malicious Code Protection',
    desc: 'Provide protection from malicious code at appropriate locations within organizational information systems.',
    sprsWeight: 5, example: 'Endpoint AV/EDR (Defender, SentinelOne, CrowdStrike) on all endpoints.' },
  { id: 'SI.L1-3.14.4', domain: 'SI', title: 'Update Protection',
    desc: 'Update malicious code protection mechanisms when new releases are available.',
    sprsWeight: 3, example: 'Auto-update definitions enabled on AV/EDR tools; managed via console.' },
  { id: 'SI.L1-3.14.5', domain: 'SI', title: 'System Scanning',
    desc: 'Perform periodic scans of organizational information systems and real-time scans of files from external sources as the files are downloaded, opened, or executed.',
    sprsWeight: 3, example: 'Scheduled full-system scans, real-time on-access scanning enabled.' },
];

const CMMC_DOMAIN_META = {
  AC: { label: 'Access Control',                    color: '#1d4ed8', bg: '#dbeafe' },
  IA: { label: 'Identification & Authentication',   color: '#7c3aed', bg: '#ede9fe' },
  MP: { label: 'Media Protection',                  color: '#b45309', bg: '#fef3c7' },
  PE: { label: 'Physical Protection',               color: '#15803d', bg: '#dcfce7' },
  SC: { label: 'System & Communications',           color: '#0369a1', bg: '#e0f2fe' },
  SI: { label: 'System & Info. Integrity',          color: '#dc2626', bg: '#fee2e2' },
};

// Total SPRS weight across all 17 L1 practices (≈55 of the 110 possible points)
const CMMC_SPRS_L1_MAX = CMMC_L1_PRACTICES.reduce((s, p) => s + p.sprsWeight, 0);

// ── STATE ─────────────────────────────────────────────────────────────────────

let cmmcState = {
  answers: {}, notes: {}, openPanels: {},
  orgId: null, view: 'dashboard',
  conductedBy: '', date: '', editId: null,
  poamRun: null, poamItems: {},
  reportRun: null, reportCommentary: '',
};

function cmmcHydrate() {
  if (cmmcState.orgId === currentOrg?.id) return;
  const runs = (orgAssessments[currentOrg?.id] || {})['cmmc'] || [];
  const last  = runs.length ? runs[runs.length - 1] : null;
  const raw   = last ? Object.assign({}, last.answers || {}) : {};
  const ans   = Object.fromEntries(Object.entries(raw).filter(([k]) => !k.startsWith('_')));
  cmmcState = {
    answers: ans, notes: {}, openPanels: {},
    orgId: currentOrg?.id, view: 'dashboard',
    conductedBy: '', date: '', editId: null,
    poamRun: null, poamItems: {},
    reportRun: null, reportCommentary: '',
  };
}

// ── SCORING ───────────────────────────────────────────────────────────────────

function cmmcCalcScore(answers) {
  let yes = 0, partial = 0, no = 0, na = 0;
  CMMC_L1_PRACTICES.forEach(p => {
    const a = answers[p.id] || '';
    if (a === 'yes')     yes++;
    else if (a === 'partial') partial++;
    else if (a === 'no') no++;
    else if (a === 'na') na++;
  });
  const total     = CMMC_L1_PRACTICES.length;
  const scoreable = total - na;
  const score     = scoreable > 0 ? Math.round((yes + partial * 0.5) / scoreable * 100) : 0;
  const answered  = yes + partial + no + na;
  return { score, yes, partial, no, na, total, scoreable, answered };
}

function cmmcGetGaps(answers) {
  return CMMC_L1_PRACTICES.filter(p => {
    const a = answers[p.id] || '';
    return a === 'no' || a === 'partial';
  });
}

function cmmcDomainProgress(answers) {
  return Object.entries(CMMC_DOMAIN_META).map(([key, meta]) => {
    const practices = CMMC_L1_PRACTICES.filter(p => p.domain === key);
    let yes = 0, partial = 0, no = 0, na = 0;
    practices.forEach(p => {
      const a = answers[p.id] || '';
      if (a === 'yes') yes++; else if (a === 'partial') partial++;
      else if (a === 'no') no++; else if (a === 'na') na++;
    });
    const scoreable = practices.length - na;
    const pct = scoreable > 0 ? Math.round((yes + partial * 0.5) / scoreable * 100) : 0;
    return { key, label: meta.label, color: meta.color, bg: meta.bg, yes, partial, no, na, total: practices.length, pct };
  });
}

function cmmcSprsCalc(answers) {
  let deductions = 0;
  CMMC_L1_PRACTICES.forEach(p => {
    const a = answers[p.id] || '';
    if (a === 'no')      deductions += p.sprsWeight;
    else if (a === 'partial') deductions += Math.round(p.sprsWeight * 0.5);
  });
  const contribution = Math.max(0, CMMC_SPRS_L1_MAX - deductions);
  return { contribution, maxContribution: CMMC_SPRS_L1_MAX, deductions };
}

// ── RENDER ROUTER ─────────────────────────────────────────────────────────────

function renderCMMC() {
  if (!currentOrg) return '';
  cmmcHydrate();
  if (cmmcState.view === 'form')    return renderCMMCForm();
  if (cmmcState.view === 'poam')    return renderCMMCPoam();
  if (cmmcState.view === 'report')  return renderCMMCExec();
  if (cmmcState.view === 'sprs')    return renderCMMCSprs();
  return renderCMMCDashboard();
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

function renderCMMCDashboard() {
  const runs   = (orgAssessments[currentOrg.id] || {})['cmmc'] || [];
  const sorted = [...runs].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const latest = sorted[0] || null;
  const latestAns = latest
    ? Object.fromEntries(Object.entries(latest.answers || {}).filter(([k]) => !k.startsWith('_')))
    : {};

  const { score, yes, partial, no, na, total, scoreable, answered } = latest
    ? cmmcCalcScore(latestAns) : { score: 0, yes: 0, partial: 0, no: 0, na: 0, total: 17, scoreable: 17, answered: 0 };

  const { band, bandCol } = acScoreBand(score);
  const domainProgress    = latest ? cmmcDomainProgress(latestAns) : [];

  // Domain bars
  const categoryBarsHtml = domainProgress.map(d => `
    <div style="flex:1;min-width:110px">
      <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:3px">
        <span style="font-size:10px;font-weight:700;color:${d.color}">${d.key}</span>
        <span style="font-size:9px;color:rgba(255,255,255,.5)">${d.total}p</span>
        <span style="font-size:10px;color:rgba(255,255,255,.7);margin-left:auto">${d.yes + d.partial}/${d.total - d.na}</span>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.12);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${d.pct}%;background:${d.color};border-radius:2px;transition:width .4s"></div>
      </div>
    </div>`).join('');

  const heroHtml = acScoreHeroHtml({
    score, hasData: !!latest && answered > 0, band, bandCol,
    badge: 'L1', badgeBg: '#e0f2fe', badgeTxt: '#0369a1',
    answered, total: scoreable,
    date: latest?.date || '',
    trendCanvasId: 'cmmcTrendChart',
    runCount: runs.length,
    categoryBarsHtml: latest && answered > 0 ? categoryBarsHtml : '',
  });

  // History table row function
  const pctCell = (pct) => {
    const c = pct >= 75 ? '#15803d' : pct >= 50 ? '#b45309' : '#dc2626';
    return `<span style="font-size:13px;font-weight:700;color:${c}">${pct}%</span>`;
  };

  const historyHtml = acHistoryTableHtml({
    headerLabel: 'Assessment History',
    headerButtons: `
      <button class="btn btn-outline btn-sm" onclick="cmmcExportExcel()">↓ Export</button>
      <button class="btn btn-cyan btn-sm" onclick="cmmcStartNew()">+ New Assessment</button>`,
    runs,
    emptyIcon: '🛡️',
    emptyTitle: 'No CMMC assessments yet',
    emptyBody: 'Run your first CMMC Level 1 self-assessment to establish your DoD contractor baseline.',
    emptyActionHtml: `<button class="btn btn-cyan btn-sm" onclick="cmmcStartNew()">+ Start First Assessment</button>`,
    colHeaders: [
      { label: 'Date',         style: 'text-align:left;padding:7px 10px' },
      { label: 'Score',        style: 'text-align:center;padding:7px 8px' },
      { label: 'Implemented',  style: 'text-align:center;padding:7px 8px' },
      { label: 'Partial',      style: 'text-align:center;padding:7px 8px' },
      { label: 'Not Met',      style: 'text-align:center;padding:7px 8px' },
      { label: 'Conducted By', style: 'text-align:left;padding:7px 10px' },
      { label: 'Actions',      style: 'text-align:right;padding:7px 10px' },
    ],
    rowFn: (run, _sortedIdx, origIdx) => {
      const ans = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
      const s   = cmmcCalcScore(ans);
      const isLatest = origIdx === runs.indexOf(latest);
      return `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px;font-weight:${isLatest?'700':'400'}">
          ${run.date || '—'}
          ${isLatest ? '<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;background:#e0f2fe;color:#0369a1;margin-left:6px">Latest</span>' : ''}
        </td>
        <td style="padding:8px 8px;text-align:center">${s.answered > 0 ? pctCell(s.score) : '<span style="color:var(--muted)">—</span>'}</td>
        <td style="padding:8px 8px;text-align:center"><span style="font-weight:700;color:#15803d">${s.yes}</span></td>
        <td style="padding:8px 8px;text-align:center"><span style="font-weight:700;color:#b45309">${s.partial}</span></td>
        <td style="padding:8px 8px;text-align:center"><span style="font-weight:700;color:#dc2626">${s.no}</span></td>
        <td style="padding:8px 10px;color:var(--muted)">${escH(run.conductedBy || '—')}</td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap">
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cmmcOpenReport(${origIdx})">📊 Report</button>
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cmmcOpenPoam(${origIdx})">📋 POAM</button>
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cmmcOpenSprs(${origIdx})">🏛 SPRS</button>
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cmmcOpenAssessment(${origIdx})">View / Edit</button>
          <button class="btn btn-red btn-sm" onclick="cmmcDeleteAssessment(${origIdx})">Delete</button>
        </td>
      </tr>`;
    },
  });

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🛡️ CMMC Level 1</div>
      <div style="font-size:12px;color:var(--muted)">17 practices · 6 domains · DoD contractor self-assessment for Federal Contract Information (FCI)</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="setNav('assessments')">← Hub</button>
      <button class="btn btn-cyan btn-sm" onclick="cmmcStartNew()">+ New Assessment</button>
    </div>
  </div>
  ${heroHtml}
  ${historyHtml}
  <div class="card" style="padding:1.1rem;margin-top:1rem;border-left:4px solid #0369a1">
    <div style="font-size:13px;font-weight:700;margin-bottom:6px;color:var(--text)">ℹ️ About CMMC Level 1</div>
    <div style="font-size:12px;color:var(--muted);line-height:1.7">
      CMMC Level 1 applies to all DoD contractors handling <strong>Federal Contract Information (FCI)</strong>. It requires annual self-assessment and self-attestation by a senior official in the <strong>Supplier Performance Risk System (SPRS)</strong>. Level 1 is based on the 15 practices in FAR Clause 52.204-21, expanded to 17 in CMMC 2.0.
      <br><br>
      <strong>Not handling FCI?</strong> If your contract is commercial and does not involve DoD systems or FCI, CMMC may not apply. Confirm with your contracting officer.
    </div>
  </div>`;
}

function cmmcTrendDraw() {
  const runs = (orgAssessments[currentOrg?.id] || {})['cmmc'] || [];
  acTrendDraw('cmmcTrendChart', runs, '#0369a1');
}

// ── ASSESSMENT FORM ───────────────────────────────────────────────────────────

function renderCMMCForm() {
  const isEdit    = !!cmmcState.editId;
  const runs      = (orgAssessments[currentOrg.id] || {})['cmmc'] || [];
  const editRun   = isEdit ? runs.find(r => r.id === cmmcState.editId) : null;
  const answers   = cmmcState.answers;
  const today     = new Date().toISOString().split('T')[0];

  const { score, yes, partial, no, na, answered, total } = cmmcCalcScore(answers);
  const { band, bandCol } = acScoreBand(score);

  // Group practices by domain
  const domains = [...new Set(CMMC_L1_PRACTICES.map(p => p.domain))];

  const ansBtn = (practiceId, val, label, col) => {
    const active = answers[practiceId] === val;
    return `<button onclick="cmmcSetAnswer('${practiceId}','${val}')"
      style="padding:5px 14px;font-size:11px;font-weight:700;border-radius:16px;border:2px solid ${active ? col : 'var(--border)'};
      background:${active ? col : '#fff'};color:${active ? '#fff' : 'var(--muted)'};cursor:pointer;transition:all .12s">
      ${label}
    </button>`;
  };

  const domainsHtml = domains.map(domKey => {
    const meta      = CMMC_DOMAIN_META[domKey];
    const practices = CMMC_L1_PRACTICES.filter(p => p.domain === domKey);
    const dYes      = practices.filter(p => answers[p.id] === 'yes').length;
    const dTotal    = practices.length;
    const isOpen    = cmmcState.openPanels[domKey] !== false; // open by default

    const practicesHtml = practices.map(p => {
      const ans = answers[p.id] || '';
      const rowBg = ans === 'no' ? 'background:rgba(220,38,38,.03)' : ans === 'partial' ? 'background:rgba(180,83,9,.03)' : '';
      return `<div style="padding:12px 14px;border-bottom:1px solid var(--border);${rowBg}">
        <div style="display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap">
          <div style="flex:1;min-width:260px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:8px;background:${meta.bg};color:${meta.color};white-space:nowrap">${escH(p.id)}</span>
              <span style="font-size:13px;font-weight:700;color:var(--text)">${escH(p.title)}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);line-height:1.55;margin-bottom:4px">${escH(p.desc)}</div>
            <div style="font-size:10px;color:var(--muted);font-style:italic">💡 ${escH(p.example)}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;flex-wrap:wrap">
            ${ansBtn(p.id, 'yes', 'Met', '#15803d')}
            ${ansBtn(p.id, 'partial', 'Partial', '#b45309')}
            ${ansBtn(p.id, 'no', 'Not Met', '#dc2626')}
            ${ansBtn(p.id, 'na', 'N/A', '#94a3b8')}
          </div>
        </div>
      </div>`;
    }).join('');

    return `<div class="card" style="padding:0;overflow:hidden;margin-bottom:0.75rem">
      <div onclick="cmmcTogglePanel('${domKey}')" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:pointer;background:${meta.bg}">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:12px;font-weight:800;color:${meta.color}">${domKey}</span>
          <span style="font-size:13px;font-weight:700;color:var(--text)">${meta.label}</span>
          <span style="font-size:11px;color:${meta.color};font-weight:600">${dYes}/${dTotal} met</span>
        </div>
        <span style="font-size:13px;color:var(--muted)">${isOpen ? '▴' : '▾'}</span>
      </div>
      ${isOpen ? `<div>${practicesHtml}</div>` : ''}
    </div>`;
  }).join('');

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🛡️ CMMC Level 1 — Assessment</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · ${isEdit ? 'Editing ' + (editRun?.date || '') : 'New assessment'}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="cmmcNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" id="cmmcPrefillBtn" onclick="cmmcPrefillFromTS()" title="Pre-populate practices from your Technology Stack survey">&#8681; From Tech Stack</button>
      <button class="btn btn-cyan btn-sm" id="cmmcSaveBtn" onclick="cmmcSaveAssessment()">💾 Save Assessment</button>
    </div>
  </div>

  <div class="card" style="padding:1rem;margin-bottom:1rem;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
    <div style="display:flex;align-items:center;gap:12px;flex:1;flex-wrap:wrap">
      <div>
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:3px">Conducted By</div>
        <input type="text" id="cmmcConductedBy" value="${escH(cmmcState.conductedBy)}" placeholder="Your name"
          oninput="cmmcState.conductedBy=this.value"
          style="padding:6px 10px;border-radius:6px;border:1px solid var(--border);font-size:12px;font-family:Inter,sans-serif;width:180px">
      </div>
      <div>
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:3px">Assessment Date</div>
        <input type="date" id="cmmcDate" value="${cmmcState.date || today}"
          oninput="cmmcState.date=this.value"
          style="padding:6px 10px;border-radius:6px;border:1px solid var(--border);font-size:12px;font-family:Inter,sans-serif">
      </div>
    </div>
    <div style="text-align:center;padding:8px 16px;border-left:1px solid var(--border)">
      <div style="font-size:10px;color:var(--muted);margin-bottom:2px">Progress</div>
      <div style="font-size:20px;font-weight:800;color:${answered === total ? '#15803d' : bandCol}">${answered}/${total}</div>
      <div style="font-size:10px;font-weight:700;color:${bandCol}">${answered > 0 ? score + '%' : '—'}</div>
    </div>
  </div>

  ${domainsHtml}`;
}

function cmmcSetAnswer(id, val) {
  cmmcState.answers[id] = val;
  renderMain();
}

function cmmcTogglePanel(key) {
  cmmcState.openPanels[key] = cmmcState.openPanels[key] === false ? true : false;
  renderMain();
}

// ── POAM VIEW ─────────────────────────────────────────────────────────────────

function renderCMMCPoam() {
  const run  = cmmcState.poamRun;
  if (!run) { cmmcState.view = 'dashboard'; return renderCMMCDashboard(); }

  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const poamItems = cmmcState.poamItems || {};
  const gaps  = cmmcGetGaps(answers);

  const assigned   = gaps.filter(g => poamItems[g.id]?.assigned_to).length;
  const dated      = gaps.filter(g => poamItems[g.id]?.target_date).length;
  const accepted   = gaps.filter(g => poamItems[g.id]?.risk_decision === 'Accept Risk').length;
  const remediated = gaps.filter(g => poamItems[g.id]?.status === 'Remediated').length;

  const stats = [
    { label: 'Total Gaps',       val: gaps.length,            col: 'var(--navy)' },
    { label: 'Unassigned',       val: gaps.length - assigned, col: '#dc2626' },
    { label: 'Assigned',         val: assigned,               col: '#b45309' },
    { label: 'Dates Set',        val: dated,                  col: '#1d4ed8' },
    { label: 'Accepted',         val: accepted,               col: '#7c3aed' },
    { label: 'Remediated',       val: remediated,             col: '#15803d' },
  ];

  const noGapsHtml = `<div class="card" style="text-align:center;padding:3rem 1rem">
    <div style="font-size:32px;margin-bottom:.75rem">🎉</div>
    <div style="font-size:14px;font-weight:700;margin-bottom:4px">No gaps found</div>
    <div style="font-size:12px;color:var(--muted)">All 17 CMMC Level 1 practices are answered Met or N/A.</div>
  </div>`;

  const inputSty = 'width:100%;padding:4px 6px;border-radius:5px;border:1px solid var(--border);font-family:Inter,sans-serif;font-size:11px;color:var(--text);background:#fff;box-sizing:border-box';

  // Domain group separator
  let lastDomain = null;
  const groupHeaderFn = (gap, _last) => {
    if (gap.domain === lastDomain) return null;
    const meta = CMMC_DOMAIN_META[gap.domain] || {};
    lastDomain = gap.domain;
    return {
      html: `<tr style="background:#f0f4fa;border-top:2px solid var(--navy)">
        <td colspan="9" style="padding:8px 12px">
          <span style="font-size:11px;font-weight:700;color:var(--navy)">${gap.domain}: ${escH(meta.label || '')}</span>
        </td>
      </tr>`,
      newGroup: gap.domain,
    };
  };

  const rowPrefixFn = (gap, _item) => {
    const meta = CMMC_DOMAIN_META[gap.domain] || {};
    const ans  = answers[gap.id] || '';
    const ansBadge = ans === 'no'
      ? '<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:#fee2e2;color:#dc2626">Not Met</span>'
      : '<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:#fef3c7;color:#b45309">Partial</span>';
    return `
      <td style="padding:8px 10px;font-weight:700;color:var(--navy);white-space:nowrap;vertical-align:top;font-size:11px">${escH(gap.id)}</td>
      <td style="padding:8px 6px;text-align:center;vertical-align:top">
        <span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:${meta.bg};color:${meta.color}">${gap.domain}</span>
      </td>
      <td style="padding:8px 6px;text-align:center;vertical-align:top">${ansBadge}</td>
      <td style="padding:8px 10px;font-size:11px;line-height:1.4;color:var(--text);vertical-align:top">
        <div style="font-weight:600;margin-bottom:2px">${escH(gap.title)}</div>
        <div style="color:var(--muted);font-size:10px">${escH(gap.desc)}</div>
      </td>`;
  };

  const tableHtml = acPoamTableHtml({
    gaps, items: poamItems, inputSty, noGapsHtml,
    colHeaders: [
      { label: 'ID',                    style: 'padding:8px 10px;text-align:left' },
      { label: 'Domain',                style: 'padding:8px 6px;text-align:center' },
      { label: 'Gap',                   style: 'padding:8px 6px;text-align:center' },
      { label: 'Practice Title & Desc', style: 'padding:8px 10px;text-align:left;min-width:260px' },
    ],
    rowPrefixFn,
    groupHeaderFn: gaps.length > 0 ? (gap, last) => groupHeaderFn(gap, last) : null,
  });

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📋 Plan of Action &amp; Milestones</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · CMMC L1 · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="cmmcNavToDashboard()">← Back</button>
      <button class="btn btn-cyan btn-sm" id="cmmcPoamSaveBtn" onclick="cmmcSavePoam()">Save POAM</button>
    </div>
  </div>
  ${acStatsChipsHtml(stats)}
  ${tableHtml}`;
}

// ── EXEC REPORT ───────────────────────────────────────────────────────────────

function renderCMMCExec() {
  const run = cmmcState.reportRun;
  if (!run) { cmmcState.view = 'dashboard'; return renderCMMCDashboard(); }

  const answers    = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { score, yes, partial, no, na, total, scoreable, answered } = cmmcCalcScore(answers);
  const { band, bandCol } = acScoreBand(score);
  const unanswered = total - (yes + partial + no + na);
  const fullImpl   = scoreable > 0 ? Math.round(yes / scoreable * 100) : 0;
  const fiCol      = fullImpl >= 75 ? '#15803d' : fullImpl >= 50 ? '#b45309' : '#dc2626';
  const domProg    = cmmcDomainProgress(answers);
  const topGaps    = cmmcGetGaps(answers);
  const runs       = (orgAssessments[currentOrg.id] || {})['cmmc'] || [];
  const commentary = cmmcState.reportCommentary || (run.answers || {})._exec_commentary || '';

  // Stacked bar percentages (out of all 17 practices)
  const barBase = total;
  const yesPct  = barBase > 0 ? (yes       / barBase * 100).toFixed(1) : 0;
  const partPct = barBase > 0 ? (partial   / barBase * 100).toFixed(1) : 0;
  const noPct   = barBase > 0 ? (no        / barBase * 100).toFixed(1) : 0;
  const naPct   = barBase > 0 ? (na        / barBase * 100).toFixed(1) : 0;
  const unPct   = barBase > 0 ? (unanswered / barBase * 100).toFixed(1) : 0;

  const scoreStripHtml = acExecScoreStripHtml({
    yes, partial, no, na, unanswered, scopedTotal: total,
    score, bandCol, fullImpl, fiCol, goalLabel: 'L1',
  });

  const scoreBreakdownHtml = acExecScoreBreakdownHtml({
    score, band, bandCol,
    yesPct, partPct, noPct, naPct, unPct,
    yesN: yes, partN: partial, noN: no, naN: na,
    fullImpl, fiCol, scoreable,
    scoreableLabel: 'scoreable practices',
    metLabel: 'Met', partLabel: 'Partial', noLabel: 'Not Met', naLabel: 'N/A',
  });

  const domCoverageHtml = `
  <div class="card" style="padding:1.1rem">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Domain Coverage</div>
    ${domProg.map(d => `
      <div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
          <span style="font-size:12px;font-weight:700;color:${d.color}">${d.key} <span style="font-size:10px;color:var(--muted);font-weight:400">— ${d.label}</span></span>
          <span style="font-size:14px;font-weight:800;color:${d.pct>=75?'#15803d':d.pct>=50?'#b45309':'#dc2626'};font-family:monospace">${d.pct}%</span>
        </div>
        <div style="height:8px;background:var(--bg);border-radius:4px;overflow:hidden;display:flex">
          <div style="width:${d.total > 0 ? (d.yes / d.total * 100).toFixed(1) : 0}%;background:${d.color}"></div>
          <div style="width:${d.total > 0 ? (d.partial / d.total * 100).toFixed(1) : 0}%;background:${d.color};opacity:.45"></div>
        </div>
        <div style="font-size:10px;color:var(--muted);margin-top:3px">${d.yes} met · ${d.partial} partial · ${d.no} not met${d.na ? ' · ' + d.na + ' N/A' : ''} · ${d.total} practices</div>
      </div>`).join('')}
    ${runs.length >= 2
      ? `<div style="margin-top:6px;padding-top:10px;border-top:1px solid var(--border)">
          <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">Score Trend</div>
          <canvas id="cmmcReportTrend" style="width:100%;display:block"></canvas>
         </div>`
      : ''}
  </div>`;

  const radarHtml = `
  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:6px">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--text)">🎯 Domain Radar — CMMC L1</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">Score per domain · % of practices met or partial</div>
      </div>
    </div>
    <canvas id="cmmcReportRadar" width="560" height="320" style="width:100%;max-width:560px;display:block;margin:0 auto"></canvas>
  </div>`;

  const gapsHtml = topGaps.length ? `
  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Priority Gaps — Not Met or Partial (${topGaps.length})</div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <tbody>
        ${topGaps.map(g => {
          const meta = CMMC_DOMAIN_META[g.domain] || {};
          const ans  = answers[g.id] || '';
          return `<tr style="border-bottom:1px solid var(--border)">
            <td style="padding:6px 10px;font-weight:700;color:${meta.color};white-space:nowrap;width:140px">${escH(g.id)}</td>
            <td style="padding:6px 6px;width:48px"><span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;background:${meta.bg};color:${meta.color}">${g.domain}</span></td>
            <td style="padding:6px 10px;color:var(--text)">${escH(g.title)}</td>
            <td style="padding:6px 10px;white-space:nowrap"><span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;
              background:${ans==='no'?'#fee2e2':'#fef3c7'};color:${ans==='no'?'#dc2626':'#b45309'}">${ans==='no'?'Not Met':'Partial'}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>` : `
  <div class="card" style="padding:1.1rem;margin-bottom:1rem;text-align:center;color:#15803d">
    <div style="font-size:18px;margin-bottom:4px">✅</div>
    <div style="font-size:13px;font-weight:700">No gaps — all 17 Level 1 practices are Met or N/A</div>
  </div>`;

  const commentaryHtml = acExecCommentaryHtml({
    commentary,
    commentaryId: 'cmmcReportCommentary',
    copyFn: 'cmmcCopyReportPrompt',
    saveFn: 'cmmcSaveCommentary',
  });

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📊 CMMC L1 Executive Report</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="cmmcNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="cmmcExportReportWord()">📄 Export Word</button>
      <button class="btn btn-outline btn-sm" onclick="cmmcOpenSprs(null)">🏛 SPRS →</button>
    </div>
  </div>
  ${scoreStripHtml}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
    ${scoreBreakdownHtml}
    ${domCoverageHtml}
  </div>
  ${radarHtml}
  ${gapsHtml}
  ${commentaryHtml}`;
}

// ── SPRS EXTENSION TAB ────────────────────────────────────────────────────────

function renderCMMCSprs() {
  const run = cmmcState.reportRun;
  if (!run) { cmmcState.view = 'dashboard'; return renderCMMCDashboard(); }

  const answers     = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { yes, partial, no, na, total, scoreable, score } = cmmcCalcScore(answers);
  const sprs        = cmmcSprsCalc(answers);
  const l1Pct       = scoreable > 0 ? Math.round(yes / scoreable * 100) : 0;
  const sprsCol     = sprs.contribution >= 45 ? '#15803d' : sprs.contribution >= 30 ? '#b45309' : '#dc2626';

  // Practice-level SPRS breakdown
  const breakdownRows = CMMC_L1_PRACTICES.map(p => {
    const ans = answers[p.id] || '';
    const deduction = ans === 'no' ? p.sprsWeight : ans === 'partial' ? Math.round(p.sprsWeight * 0.5) : 0;
    const meta = CMMC_DOMAIN_META[p.domain] || {};
    const statusColor = deduction === 0 ? '#15803d' : ans === 'partial' ? '#b45309' : '#dc2626';
    const statusLabel = deduction === 0 ? (ans === 'na' ? 'N/A' : 'Met') : ans === 'partial' ? `Partial (−${deduction}pts)` : `Not Met (−${deduction}pts)`;
    return `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:7px 10px;font-size:11px;font-weight:700;color:${meta.color}">${escH(p.id)}</td>
      <td style="padding:7px 8px;font-size:11px">${escH(p.title)}</td>
      <td style="padding:7px 8px;text-align:center;font-size:11px;font-weight:700;color:${meta.color}">${p.domain}</td>
      <td style="padding:7px 8px;text-align:center"><span style="font-size:10px;font-weight:700;color:${sprsCol === '#15803d' && deduction === 0 ? '#15803d' : statusColor}">${statusLabel}</span></td>
      <td style="padding:7px 8px;text-align:center;font-size:11px;font-weight:700;color:${sprsCol}">${p.sprsWeight}</td>
    </tr>`;
  }).join('');

  const attestChecklist = [
    'All 17 CMMC L1 practices have been assessed by a knowledgeable representative',
    'Assessment results are documented and can be produced upon request',
    'A senior company official (e.g., CEO, CISO, or authorized delegate) will attest',
    'Self-attestation will be submitted in the SPRS portal at https://www.sprs.csd.disa.mil/',
    'SPRS submission includes: company name, CAGE code, assessment date, and score',
    'Assessment will be renewed annually or when significant system changes occur',
    'A plan of action exists for any practices not currently met',
  ];

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">🏛 SPRS Score — CMMC L1</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · ${run.date || '—'} · Supplier Performance Risk System</div>
    </div>
    <div style="display:flex;gap:6px">
      <button class="btn btn-outline btn-sm" onclick="cmmcNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="cmmcOpenReport(null)">📊 Report</button>
    </div>
  </div>

  <!-- SPRS Score Card -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
    <div class="card" style="padding:1.1rem;text-align:center;border-top:4px solid ${sprsCol}">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:6px">L1 SPRS Contribution</div>
      <div style="font-size:36px;font-weight:800;color:${sprsCol};font-family:monospace;line-height:1">${sprs.contribution}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">of ${sprs.maxContribution} possible from L1</div>
      <div style="margin-top:8px;height:6px;background:var(--bg);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${Math.round(sprs.contribution/sprs.maxContribution*100)}%;background:${sprsCol};border-radius:3px;transition:width .4s"></div>
      </div>
    </div>
    <div class="card" style="padding:1.1rem;text-align:center;border-top:4px solid #94a3b8">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:6px">Full SPRS Range</div>
      <div style="font-size:24px;font-weight:800;color:var(--text);font-family:monospace;line-height:1">0–110</div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">All 110 NIST SP 800-171 practices</div>
      <div style="font-size:10px;color:var(--muted);margin-top:6px">L1 covers ~${sprs.maxContribution} of 110 points</div>
    </div>
    <div class="card" style="padding:1.1rem;text-align:center;border-top:4px solid #1d4ed8">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:6px">L1 Practices Met</div>
      <div style="font-size:36px;font-weight:800;color:#1d4ed8;font-family:monospace;line-height:1">${yes}<span style="font-size:16px">/${scoreable}</span></div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">${l1Pct}% fully implemented</div>
    </div>
  </div>

  <!-- Important Notice -->
  <div class="card" style="padding:1rem;margin-bottom:1rem;border-left:4px solid #b45309;background:#fffbeb">
    <div style="font-size:12px;font-weight:700;color:#b45309;margin-bottom:4px">⚠️ Important — SPRS Score Disclaimer</div>
    <div style="font-size:11px;color:var(--text);line-height:1.65">
      This tool assesses the <strong>17 CMMC Level 1 practices</strong> only. The full SPRS score (0–110) covers all 110 practices from NIST SP 800-171. Your actual SPRS submission must reflect your total posture across all practices applicable to your systems. The score shown here is the estimated <strong>L1 contribution only</strong> — it does not represent a complete SPRS score. Engage a CMMC consultant for your formal submission if handling CUI or pursuing CMMC Level 2+.
    </div>
  </div>

  <!-- Practice Breakdown -->
  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">L1 Practice Breakdown — SPRS Points</div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="background:var(--navy);color:#fff">
          <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700">Practice ID</th>
          <th style="padding:7px 8px;text-align:left;font-size:10px;font-weight:700">Title</th>
          <th style="padding:7px 8px;text-align:center;font-size:10px;font-weight:700">Domain</th>
          <th style="padding:7px 8px;text-align:center;font-size:10px;font-weight:700">Status</th>
          <th style="padding:7px 8px;text-align:center;font-size:10px;font-weight:700">Pt Weight</th>
        </tr></thead>
        <tbody>${breakdownRows}</tbody>
        <tfoot><tr style="background:#f0f4fa;border-top:2px solid var(--navy)">
          <td colspan="3" style="padding:8px 10px;font-size:12px;font-weight:700">Total L1 Contribution</td>
          <td colspan="2" style="padding:8px 10px;text-align:center;font-size:14px;font-weight:800;color:${sprsCol}">${sprs.contribution} / ${sprs.maxContribution} pts</td>
        </tfoot>
      </table>
    </div>
  </div>

  <!-- Self-Attestation Checklist -->
  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="font-size:13px;font-weight:700;margin-bottom:10px">✅ Self-Attestation Checklist</div>
    ${attestChecklist.map((item, i) => `
      <div style="display:flex;align-items:flex-start;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)">
        <input type="checkbox" id="sprs_chk_${i}" style="margin-top:2px;flex-shrink:0">
        <label for="sprs_chk_${i}" style="font-size:12px;color:var(--text);cursor:pointer">${escH(item)}</label>
      </div>`).join('')}
    <div style="margin-top:12px;padding:10px;background:var(--bg);border-radius:6px;font-size:11px;color:var(--muted)">
      Submit your self-attestation at <strong>sprs.csd.disa.mil</strong> using your company CAGE code. The affirming official must be a senior company official with authority to attest on behalf of the organization.
    </div>
  </div>`;
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────

function cmmcStartNew() {
  cmmcState.answers      = {};
  cmmcState.conductedBy  = '';
  cmmcState.date         = '';
  cmmcState.editId       = null;
  cmmcState.openPanels   = {};
  cmmcState.view         = 'form';
  renderMain();
}

function cmmcOpenAssessment(idx) {
  const runs = (orgAssessments[currentOrg.id] || {})['cmmc'] || [];
  const run  = runs[idx];
  if (!run) return;
  const ans  = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  cmmcState.answers     = Object.assign({}, ans);
  cmmcState.conductedBy = run.conductedBy || '';
  cmmcState.date        = run.date || '';
  cmmcState.editId      = run.id;
  cmmcState.view        = 'form';
  renderMain();
}

function cmmcOpenPoam(idx) {
  const runs = (orgAssessments[currentOrg.id] || {})['cmmc'] || [];
  const run  = idx != null ? runs[idx] : cmmcState.reportRun;
  if (!run) return;
  const savedPoam = run.answers?._poam || {};
  cmmcState.poamRun   = run;
  cmmcState.poamItems = JSON.parse(JSON.stringify(savedPoam));
  cmmcState.view      = 'poam';
  renderMain();
}

function cmmcOpenReport(idx) {
  const runs = (orgAssessments[currentOrg.id] || {})['cmmc'] || [];
  const run  = idx != null ? runs[idx] : cmmcState.reportRun;
  if (!run) return;
  cmmcState.reportRun = run;
  cmmcState.view      = 'report';
  renderMain();
}

function cmmcOpenSprs(idx) {
  const runs = (orgAssessments[currentOrg.id] || {})['cmmc'] || [];
  const run  = idx != null ? runs[idx] : cmmcState.reportRun;
  if (!run) return;
  cmmcState.reportRun = run;
  cmmcState.view      = 'sprs';
  renderMain();
}

function cmmcNavToDashboard() {
  cmmcState.view = 'dashboard';
  renderMain();
}

async function cmmcSaveAssessment() {
  const btn = document.getElementById('cmmcSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  const conductedBy = (document.getElementById('cmmcConductedBy')?.value || cmmcState.conductedBy || '').trim();
  const date        = (document.getElementById('cmmcDate')?.value || cmmcState.date || '').trim()
                    || new Date().toISOString().split('T')[0];
  const { score }   = cmmcCalcScore(cmmcState.answers);

  const answersToSave = { ...cmmcState.answers, _conducted_by: conductedBy, _date: date };

  try {
    if (cmmcState.editId) {
      // Update existing assessment
      await sb.updateAssessment(cmmcState.editId, { score, answers: answersToSave, assessed_at: date, conducted_by: conductedBy });
      // Update in-memory
      const runs = (orgAssessments[currentOrg.id] || {})['cmmc'] || [];
      const idx  = runs.findIndex(r => r.id === cmmcState.editId);
      if (idx >= 0) {
        runs[idx] = { ...runs[idx], score, answers: answersToSave, date, conductedBy };
      }
    } else {
      const saved = await sb.saveAssessment({
        org_id: currentOrg.id, module: 'cmmc', score,
        answers: answersToSave, assessed_at: date, conducted_by: conductedBy,
      });
      const record = Array.isArray(saved) ? saved[0] : saved;
      if (!orgAssessments[currentOrg.id]) orgAssessments[currentOrg.id] = {};
      if (!orgAssessments[currentOrg.id]['cmmc']) orgAssessments[currentOrg.id]['cmmc'] = [];
      orgAssessments[currentOrg.id]['cmmc'].push({
        id: record?.id, score, answers: answersToSave, date, conductedBy,
      });
    }
    toast('Assessment saved', '#15803d');
    cmmcState.editId = null;
    cmmcState.view   = 'dashboard';
  } catch (e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = '💾 Save Assessment'; }
    return;
  }
  renderMain();
}

async function cmmcDeleteAssessment(idx) {
  const runs = (orgAssessments[currentOrg.id] || {})['cmmc'] || [];
  const run  = runs[idx];
  if (!run) return;
  if (!confirm(`Delete the CMMC L1 assessment from ${run.date || '(no date)'}? This cannot be undone.`)) return;
  try {
    await sb.deleteAssessment(run.id);
    orgAssessments[currentOrg.id]['cmmc'].splice(idx, 1);
    toast('Assessment deleted', '#15803d');
    renderMain();
  } catch (e) {
    toast('Delete failed: ' + e.message, '#dc2626');
  }
}

async function cmmcSavePoam() {
  const run = cmmcState.poamRun;
  if (!run) return;
  const btn = document.getElementById('cmmcPoamSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  // Read editable fields from DOM
  const poamData = {};
  document.querySelectorAll('[class*="poam-assigned"]').forEach(el => {
    const id = el.dataset.id;
    if (!id) return;
    if (!poamData[id]) poamData[id] = {};
    poamData[id].assigned_to = el.value.trim();
  });
  document.querySelectorAll('[class*="poam-date"]').forEach(el => {
    const id = el.dataset.id;
    if (!id) return;
    if (!poamData[id]) poamData[id] = {};
    poamData[id].target_date = el.value;
  });
  document.querySelectorAll('[class*="poam-decision"]').forEach(el => {
    const id = el.dataset.id;
    if (!id) return;
    if (!poamData[id]) poamData[id] = {};
    poamData[id].risk_decision = el.value;
  });
  document.querySelectorAll('[class*="poam-rationale"]').forEach(el => {
    const id = el.dataset.id;
    if (!id) return;
    if (!poamData[id]) poamData[id] = {};
    poamData[id].notes = el.value.trim();
  });
  document.querySelectorAll('[class*="poam-status"]').forEach(el => {
    const id = el.dataset.id;
    if (!id) return;
    if (!poamData[id]) poamData[id] = {};
    poamData[id].status = el.value;
  });

  const updatedAnswers = { ...(run.answers || {}), _poam: poamData };
  try {
    await sb.updateAssessment(run.id, { answers: updatedAnswers });
    run.answers = updatedAnswers;
    cmmcState.poamItems = poamData;
    toast('POAM saved', '#15803d');
  } catch (e) {
    toast('POAM save failed: ' + e.message, '#dc2626');
  }
  if (btn) { btn.disabled = false; btn.textContent = 'Save POAM'; }
}

function cmmcCopyReportPrompt() {
  const run = cmmcState.reportRun;
  if (!run) return;
  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { score, yes, partial, no, na, total, scoreable } = cmmcCalcScore(answers);
  const { band } = acScoreBand(score);
  const gaps = cmmcGetGaps(answers);
  const sprs = cmmcSprsCalc(answers);

  const domainSummary = Object.entries(CMMC_DOMAIN_META).map(([key, meta]) => {
    const practices = CMMC_L1_PRACTICES.filter(p => p.domain === key);
    const dYes = practices.filter(p => answers[p.id] === 'yes').length;
    const dNA  = practices.filter(p => answers[p.id] === 'na').length;
    const dSco = practices.length - dNA;
    const dPct = dSco > 0 ? Math.round(dYes / dSco * 100) : 100;
    return `${key} (${meta.label}): ${dPct}% — ${dYes}/${practices.length} met`;
  }).join('\n');

  const gapList = gaps.map(g => `- ${g.id} [${g.domain}]: ${g.title} — ${answers[g.id] === 'partial' ? 'Partial' : 'Not Met'}`).join('\n');

  const prompt = `You are a cybersecurity consultant writing the EXECUTIVE COMMENTARY section of a client report. The report already contains score tables, domain charts, gap tables, and a practice listing generated from the assessment data — you only need to write the narrative text that goes in the Executive Summary section.

IMPORTANT OUTPUT RULES:
- Output ONLY the three sections below, nothing else
- No title, no score summary table, no domain analysis section, no SPRS note, no next steps, no disclaimer
- Plain text only — no markdown, no asterisks, no pound signs, no bold markers
- Use exactly these section headings in ALL-CAPS on their own line
- Bullet points: start each with a hyphen and space "- "
- Numbered items: start each with "1." "2." etc. Do NOT write a number prefix AND a separate label

CLIENT: ${currentOrg.name}
FRAMEWORK: CMMC Level 1 (17 practices, 6 domains)
DATE: ${run.date || '—'} | ASSESSOR: ${run.conductedBy || '—'}
SCORE: ${score}% (${band}) | MET: ${yes}/${scoreable} | PARTIAL: ${partial} | NOT MET: ${no}
SPRS (L1 contribution): ${sprs.contribution} / ${sprs.maxContribution} pts

DOMAIN SCORES:
${domainSummary}

${gaps.length > 0 ? `GAPS (${gaps.length} practices not fully met):
${gapList}` : 'NO GAPS — all 17 Level 1 practices are Met or N/A.'}

OUTPUT — write exactly these three sections:

EXECUTIVE SUMMARY
Write 3-5 sentences. State the assessment scope (CMMC L1, 17 practices, 6 domains). Summarise the overall score and risk posture. Name the strongest and weakest domains. Mention the SPRS contribution and whether a full L2 assessment is needed.

KEY FINDINGS
4-6 bullet points. Each on its own line starting with "- ". Cover: what is working well, the most critical gaps, any domain at 0%, and any partial practices. Be specific — name practices and domains.

PRIORITY RECOMMENDATIONS
Top 5 numbered actions. Each on its own line starting with "1." through "5.". One sentence per item: what to do and why it matters for CMMC compliance. Order by SPRS impact (highest deduction practices first).`;

  navigator.clipboard.writeText(prompt).then(() => {
    toast('Report prompt copied to clipboard', '#15803d');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = prompt;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    toast('Report prompt copied', '#15803d');
  });
}

function cmmcExportExcel() {
  toast('Excel export coming soon', '#b45309');
}

// ── COMMENTARY ────────────────────────────────────────────────────────────────

async function cmmcSaveCommentary() {
  const run = cmmcState.reportRun;
  if (!run) return;
  const commentary = document.getElementById('cmmcReportCommentary')?.value || '';
  cmmcState.reportCommentary = commentary;
  try {
    const updated = { ...(run.answers || {}), _exec_commentary: commentary };
    await sb.updateAssessment(run.id, { answers: updated });
    run.answers = updated;
    toast('Commentary saved', '#15803d');
  } catch (e) {
    toast('Save failed: ' + e.message, '#dc2626');
  }
}

// ── DOMAIN RADAR ──────────────────────────────────────────────────────────────

function drawCmmcRadar(canvasId, answers) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const W = canvas.offsetWidth || 560;
  const H = 320;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2, cy = H / 2, R = Math.min(cx, cy) - 45;
  const domains   = Object.keys(CMMC_DOMAIN_META);
  const n         = domains.length;
  const angleStep = (Math.PI * 2) / n;
  const startAngle = -Math.PI / 2;

  const scores = domains.map(key => {
    const practices = CMMC_L1_PRACTICES.filter(p => p.domain === key);
    const yes  = practices.filter(p => answers[p.id] === 'yes').length;
    const part = practices.filter(p => answers[p.id] === 'partial').length;
    const na   = practices.filter(p => answers[p.id] === 'na').length;
    const sc   = practices.length - na;
    return sc > 0 ? (yes + part * 0.5) / sc : 0;
  });

  // Grid rings
  [0.2, 0.4, 0.6, 0.8, 1.0].forEach(level => {
    ctx.beginPath();
    domains.forEach((_, i) => {
      const angle = startAngle + i * angleStep;
      const x = cx + R * level * Math.cos(angle);
      const y = cy + R * level * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = '#e8edf5';
    ctx.lineWidth = 1;
    ctx.stroke();
    if (level < 1.0) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '8px Inter,Arial,sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(level * 100)}%`, cx + R * level + 3, cy);
    }
  });

  // Spokes
  domains.forEach((_, i) => {
    const angle = startAngle + i * angleStep;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
    ctx.strokeStyle = '#e8edf5';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Filled polygon
  ctx.beginPath();
  domains.forEach((_, i) => {
    const angle = startAngle + i * angleStep;
    const x = cx + R * scores[i] * Math.cos(angle);
    const y = cy + R * scores[i] * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(7,180,217,0.15)';
  ctx.fill();
  ctx.strokeStyle = '#07B4D9';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots + labels
  ctx.textBaseline = 'alphabetic';
  domains.forEach((key, i) => {
    const angle    = startAngle + i * angleStep;
    const val      = scores[i];
    const meta     = CMMC_DOMAIN_META[key];

    // Data dot
    const dx = cx + R * val * Math.cos(angle);
    const dy = cy + R * val * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = meta.color;
    ctx.fill();

    // Axis label
    const labelR = R + 26;
    const lx = cx + labelR * Math.cos(angle);
    const ly = cy + labelR * Math.sin(angle);
    ctx.font = 'bold 11px Inter,Arial,sans-serif';
    ctx.fillStyle = meta.color;
    ctx.textAlign   = lx < cx - 5 ? 'right' : lx > cx + 5 ? 'left' : 'center';
    ctx.textBaseline = ly < cy - 5 ? 'bottom' : ly > cy + 5 ? 'top' : 'middle';
    ctx.fillText(key, lx, ly);

    // Score sub-label
    ctx.font = '9px Inter,Arial,sans-serif';
    ctx.fillStyle = '#94a3b8';
    const sdy = ly < cy - 5 ? ly - 13 : ly > cy + 5 ? ly + 13 : ly + 12;
    ctx.fillText(`${Math.round(val * 100)}%`, lx, sdy);
  });
}

// ── REPORT CHART ORCHESTRATION ────────────────────────────────────────────────

function drawCmmcReportCharts() {
  const run = cmmcState.reportRun;
  if (!run || cmmcState.view !== 'report') return;
  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));

  // Trend canvas (inside Domain Coverage card)
  const runs = (orgAssessments[currentOrg?.id] || {})['cmmc'] || [];
  const trendCanvas = document.getElementById('cmmcReportTrend');
  if (trendCanvas && runs.length >= 2) acTrendDraw('cmmcReportTrend', runs, '#0369a1');

  // Radar canvas
  drawCmmcRadar('cmmcReportRadar', answers);
}

// ── WORD EXPORT ───────────────────────────────────────────────────────────────

function cmmcExportReportWord() {
  const run = cmmcState.reportRun;
  if (!run) return;

  const answers  = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { score, yes, partial, no, na, total, scoreable } = cmmcCalcScore(answers);
  const { band, bandCol } = acScoreBand(score);
  const fullImpl  = scoreable > 0 ? Math.round(yes / scoreable * 100) : 0;
  const fiCol     = fullImpl >= 75 ? '#15803d' : fullImpl >= 50 ? '#b45309' : '#dc2626';
  const gaps      = cmmcGetGaps(answers);
  const sprs      = cmmcSprsCalc(answers);
  const domProg   = cmmcDomainProgress(answers);
  const rawCommentary = cmmcState.reportCommentary || (run.answers || {})._exec_commentary || '';
  const exportDate    = new Date().toLocaleDateString('en-CA');

  const runs   = (orgAssessments[currentOrg?.id] || {})['cmmc'] || [];
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const prevRun     = sorted.length >= 2 ? sorted[sorted.length - 2] : null;
  const scoreChange = prevRun ? score - prevRun.score : null;
  const changeStr   = scoreChange === null ? 'First assessment' : (scoreChange > 0 ? '+' + scoreChange + '%' : scoreChange + '%');

  // ── Commentary formatter — KEY FINDINGS (bullets), PRIORITY RECOMMENDATIONS (numbered),
  //    ALL-CAPS subheaders, prose bullets, numbered prose items ──────────────────────────
  function fmtCommentary(text, placeholder) {
    if (!text) return placeholder
      ? `<p style="color:#94a3b8;font-style:italic;font-size:10pt;margin:0 0 10pt 0">${placeholder}</p>`
      : '';

    const BULLET_TBL = items => '<table style="width:100%;border-collapse:collapse;margin:0 0 10pt 0">' +
      items.map(l => `<tr>
        <td style="width:14pt;vertical-align:top;padding:4pt 8pt 4pt 0;color:#152168;font-size:14pt;line-height:1">&#8226;</td>
        <td style="font-size:11pt;line-height:1.65;padding:4pt 0;vertical-align:top;border-bottom:1pt solid #f1f5f9">${escH(l)}</td>
      </tr>`).join('') + '</table>';

    const NUM_TBL = items => '<table style="width:100%;border-collapse:collapse;margin:0 0 10pt 0">' +
      items.map((l, i) => `<tr>
        <td style="background:#152168;color:#fff;width:24pt;text-align:center;font-size:11pt;font-weight:bold;vertical-align:top;padding:7pt 4pt;border-bottom:1pt solid #1e3080">${i + 1}</td>
        <td style="padding:7pt 10pt;border-bottom:1pt solid #e8ecf4;font-size:11pt;line-height:1.65;vertical-align:top">${escH(l)}</td>
      </tr>`).join('') + '</table>';

    const SUBHEAD = label => `<div style="font-size:9.5pt;color:#152168;font-weight:bold;text-transform:uppercase;letter-spacing:.5pt;margin:14pt 0 5pt 0;padding-bottom:3pt;border-bottom:1.5pt solid #152168">${label}</div>`;

    let html = '';
    let mode = 'prose'; // prose | findings | recommendations | bullets | numbered
    let items = [];

    function flushItems() {
      if (!items.length) return;
      if (mode === 'findings' || mode === 'bullets') html += BULLET_TBL(items);
      else if (mode === 'recommendations' || mode === 'numbered') html += NUM_TBL(items);
      items = [];
    }

    text.split('\n').map(l => l.trim()).forEach(line => {
      if (!line) {
        // blank line: flush any pending list, return to prose
        flushItems();
        mode = 'prose';
        return;
      }
      // Named section headers
      if (/^KEY FINDINGS$/i.test(line)) { flushItems(); html += SUBHEAD('Key Findings'); mode = 'findings'; return; }
      if (/^PRIORITY RECOMMENDATIONS?$/i.test(line)) { flushItems(); html += SUBHEAD('Priority Recommendations'); mode = 'recommendations'; return; }
      if (/^EXECUTIVE SUMMARY$/i.test(line)) { flushItems(); html += SUBHEAD('Executive Summary'); mode = 'prose'; return; }
      // Any other ALL-CAPS-only line → styled subheader (catches DOMAIN ANALYSIS, SPRS NOTE, NEXT STEPS, etc.)
      if (/^[A-Z][A-Z\s\(\)\-\/&0-9\.]+$/.test(line) && line.length > 3 && !/^\d/.test(line)) {
        flushItems();
        html += SUBHEAD(line.charAt(0) + line.slice(1).toLowerCase());
        mode = 'prose'; return;
      }
      // In findings/recommendations mode: accept lines that start with bullet, number, or plain text
      if (mode === 'findings' || mode === 'bullets') {
        items.push(line.replace(/^[•\-\*]\s*/, ''));
        return;
      }
      if (mode === 'recommendations' || mode === 'numbered') {
        items.push(line.replace(/^[•\-\*]\s*/, '').replace(/^\d+[\.\)]\s*/, ''));
        return;
      }
      // Prose mode: detect bullet lines
      if (/^[•\-\*]\s/.test(line)) {
        if (mode !== 'bullets') { flushItems(); mode = 'bullets'; }
        items.push(line.replace(/^[•\-\*]\s*/, ''));
        return;
      }
      // Prose mode: detect numbered lines "1. text"
      if (/^\d+[\.\)]\s/.test(line)) {
        if (mode !== 'numbered') { flushItems(); mode = 'numbered'; }
        items.push(line.replace(/^\d+[\.\)]\s*/, ''));
        return;
      }
      // Plain prose
      flushItems();
      mode = 'prose';
      html += `<p style="font-size:11pt;line-height:1.75;margin:0 0 8pt 0">${escH(line)}</p>`;
    });
    flushItems();
    return html;
  }

  // ── Gauge canvas → PNG ────────────────────────────────────────────────────
  let gaugeImg = null;
  {
    const _gc = document.createElement('canvas');
    _gc.width = 280; _gc.height = 155;
    _gc.style.cssText = 'position:fixed;left:-9999px;pointer-events:none';
    document.body.appendChild(_gc);
    const _ctx = _gc.getContext('2d');
    const cx = 140, cy = 130, r = 105, tw = 18;
    const t = Math.max(0.02, Math.min(0.98, score / 100));
    _ctx.beginPath(); _ctx.arc(cx, cy, r, Math.PI, 0, false);
    _ctx.strokeStyle = '#e8edf5'; _ctx.lineWidth = tw; _ctx.lineCap = 'butt'; _ctx.stroke();
    const _g = _ctx.createLinearGradient(cx - r, 0, cx + r, 0);
    _g.addColorStop(0, '#dc2626'); _g.addColorStop(0.30, '#f97316');
    _g.addColorStop(0.55, '#f59e0b'); _g.addColorStop(0.75, '#84cc16'); _g.addColorStop(1.00, '#15803d');
    _ctx.beginPath(); _ctx.arc(cx, cy, r, Math.PI, 0, false);
    _ctx.strokeStyle = _g; _ctx.lineWidth = tw; _ctx.lineCap = 'butt'; _ctx.stroke();
    const nx = cx + r * 0.84 * Math.cos(Math.PI + t * Math.PI);
    const ny = cy + r * 0.84 * Math.sin(Math.PI + t * Math.PI);
    _ctx.beginPath(); _ctx.moveTo(cx, cy); _ctx.lineTo(nx, ny);
    _ctx.strokeStyle = '#152168'; _ctx.lineWidth = 3.5; _ctx.lineCap = 'round'; _ctx.stroke();
    _ctx.beginPath(); _ctx.arc(cx, cy, 9, 0, Math.PI * 2); _ctx.fillStyle = '#152168'; _ctx.fill();
    _ctx.beginPath(); _ctx.arc(cx, cy, 5, 0, Math.PI * 2); _ctx.fillStyle = '#fff'; _ctx.fill();
    _ctx.textAlign = 'center';
    _ctx.font = 'bold 34px Arial,sans-serif'; _ctx.fillStyle = '#152168';
    _ctx.fillText(`${score}%`, cx, 82);
    _ctx.font = 'bold 12px Arial,sans-serif'; _ctx.fillStyle = bandCol;
    _ctx.fillText(band, cx, 100);
    _ctx.font = '9px Arial,sans-serif'; _ctx.fillStyle = '#94a3b8';
    _ctx.textAlign = 'left';  _ctx.fillText('Low',  cx - r + 2, 150);
    _ctx.textAlign = 'right'; _ctx.fillText('High', cx + r - 2, 150);
    gaugeImg = _gc.toDataURL('image/png');
    document.body.removeChild(_gc);
  }

  // ── Radar canvas → PNG ────────────────────────────────────────────────────
  let radarImg = null;
  {
    const _rc = document.createElement('canvas');
    _rc.id = '_cmmcRadExp';
    _rc.width = 320; _rc.height = 320;
    _rc.style.cssText = 'position:fixed;left:-9999px;width:320px;height:320px;pointer-events:none';
    document.body.appendChild(_rc);
    drawCmmcRadar('_cmmcRadExp', answers);
    radarImg = _rc.toDataURL('image/png');
    document.body.removeChild(_rc);
  }

  // ── Trend canvas → PNG (only if 2+ runs) ─────────────────────────────────
  let trendImg = null;
  if (sorted.length >= 2) {
    const _tc = document.createElement('canvas');
    _tc.id = '_cmmcTrExp';
    _tc.width = 560; _tc.height = 110;
    _tc.style.cssText = 'position:fixed;left:-9999px;pointer-events:none';
    document.body.appendChild(_tc);
    acTrendDraw('_cmmcTrExp', sorted, '#0369a1');
    trendImg = _tc.toDataURL('image/png');
    document.body.removeChild(_tc);
  }

  // ── Domain rows ────────────────────────────────────────────────────────────
  const domRows = domProg.map(d =>
    `<tr>
      <td style="font-weight:bold;color:${d.color};white-space:nowrap;font-size:9pt">${d.key}</td>
      <td>${escH(d.label)}</td>
      <td style="text-align:center;font-weight:bold;color:#15803d">${d.yes}</td>
      <td style="text-align:center;font-weight:bold;color:#b45309">${d.partial}</td>
      <td style="text-align:center;font-weight:bold;color:${d.no > 0 ? '#dc2626' : '#15803d'}">${d.no}</td>
      <td style="text-align:center;color:#94a3b8">${d.na}</td>
      <td style="text-align:center;font-weight:bold;color:${d.pct>=75?'#15803d':d.pct>=50?'#b45309':'#dc2626'}">${d.pct}%</td>
    </tr>`
  ).join('');

  // ── Gap rows ───────────────────────────────────────────────────────────────
  const topGaps = gaps.slice(0, 10);
  const gapRows = topGaps.map(g => {
    const ans  = answers[g.id] || '';
    const meta = CMMC_DOMAIN_META[g.domain] || {};
    return `<tr>
      <td style="font-weight:bold;color:${meta.color};white-space:nowrap;font-size:9pt">${escH(g.id)}</td>
      <td><span style="font-size:9pt;font-weight:bold;padding:1pt 6pt;border-radius:8pt;background:${meta.bg};color:${meta.color}">${g.domain}</span></td>
      <td>${escH(g.title)}</td>
      <td style="font-weight:bold;color:${ans==='no'?'#dc2626':'#b45309'};white-space:nowrap">${ans === 'no' ? 'Not Met' : 'Partial'}</td>
    </tr>`;
  }).join('');

  // ── Full practice listing ──────────────────────────────────────────────────
  const _aL = { yes: 'Met', partial: 'Partial', no: 'Not Met', na: 'N/A' };
  const _aC = { yes: '#15803d', partial: '#b45309', no: '#dc2626', na: '#94a3b8' };
  const byDomain = {};
  CMMC_L1_PRACTICES.forEach(p => {
    if (!byDomain[p.domain]) byDomain[p.domain] = [];
    byDomain[p.domain].push(p);
  });
  const practiceListHtml = Object.keys(byDomain).map(dom => {
    const meta = CMMC_DOMAIN_META[dom] || {};
    const rows = byDomain[dom].map(p => {
      const ans = answers[p.id] || '';
      return `<tr>
        <td style="font-weight:bold;color:${meta.color};white-space:nowrap;font-size:9pt">${escH(p.id)}</td>
        <td style="font-weight:bold;color:${_aC[ans]||'#94a3b8'};text-align:center;white-space:nowrap;font-size:9pt">${_aL[ans]||'—'}</td>
        <td><strong style="font-size:9.5pt">${escH(p.title)}</strong><br><span style="font-size:8.5pt;color:#5a6a8a">${escH(p.desc)}</span></td>
      </tr>`;
    }).join('');
    return `<tr><td colspan="3" style="background:#152168;color:#fff;font-weight:bold;font-size:9.5pt;padding:5pt 8pt;border:none">${dom} — ${escH(meta.label || dom)}</td></tr>${rows}`;
  }).join('');

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8">
<title>CMMC Level 1 — Executive Report — ${escH(currentOrg.name)}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11pt; color: #1a2340; margin: 0; padding: 0; }
  .page { padding: 2.5cm; max-width: 19cm; margin: 0 auto; }
  h1 { font-size: 20pt; color: #152168; margin: 0 0 4pt 0; font-weight: bold; }
  h2 { font-size: 11pt; color: #152168; margin: 20pt 0 6pt 0; font-weight: bold;
       border-bottom: 1.5pt solid #152168; padding-bottom: 3pt;
       text-transform: uppercase; letter-spacing: .5pt; }
  .sub { font-size: 10pt; color: #5a6a8a; margin: 0 0 20pt 0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10pt; font-size: 10pt; }
  th { background: #152168; color: #fff; text-align: left; padding: 5pt 8pt;
       font-size: 9pt; text-transform: uppercase; letter-spacing: .4pt; }
  td { padding: 5pt 8pt; border-bottom: 1pt solid #e8ecf4; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .footer { margin-top: 28pt; padding-top: 8pt; border-top: 1pt solid #dde3ef; font-size: 8pt; color: #94a3b8; }
</style>
</head>
<body>
<div class="page">

  <h1>CMMC Level 1 — Executive Security Report</h1>
  <div class="sub">
    ${escH(currentOrg.name)} &nbsp;&middot;&nbsp; CMMC Level 1 (17 Practices) &nbsp;&middot;&nbsp; ${run.date || '&mdash;'}
    ${run.conductedBy ? ' &nbsp;&middot;&nbsp; Assessed by: ' + escH(run.conductedBy) : ''}
  </div>

  <h2>Executive Summary</h2>
  ${fmtCommentary(rawCommentary, 'No executive commentary saved. Use the Generate AI Prompt button in the exec report view, paste the prompt into Claude, then save the response before exporting.')}

  <h2>Overall Security Score</h2>
  <div style="display:flex;gap:24pt;margin-bottom:12pt;align-items:flex-start">
    <div style="flex-shrink:0;text-align:center">${gaugeImg ? `<img src="${gaugeImg}" style="width:240px;display:block">` : ''}</div>
    <div style="flex:1">
      <table style="margin:0;font-size:10pt">
        ${[
          ['Practices in scope',       total,                                                                           '#1a2340'],
          ['Met (Yes)',                 yes + ' (' + Math.round(yes / total * 100) + '%)',                              '#15803d'],
          ['Partial',                   partial + ' (' + Math.round(partial / total * 100) + '%)',                      '#b45309'],
          ['Not Met',                   no + ' (' + Math.round(no / total * 100) + '%)',                               no > 0 ? '#dc2626' : '#15803d'],
          ['N/A',                       na,                                                                             '#94a3b8'],
          ['Overall Score',             score + '% — ' + band,                                                         bandCol],
          ['Fully Implemented',         fullImpl + '%',                                                                 fiCol],
          ['Est. SPRS Contribution',    sprs.contribution + ' of ' + sprs.maxContribution + ' pts',                    '#1a2340'],
          ['vs Prior assessment',       changeStr,                                                                      '#1a2340'],
          ['Date',                      run.date || '—',                                                                '#5a6a8a'],
          ['Assessor',                  run.conductedBy || '—',                                                         '#5a6a8a'],
        ].map(([l, v, c]) => `<tr>
          <td style="padding:4pt 8pt 4pt 0;border:none;color:#5a6a8a;font-size:9.5pt;white-space:nowrap">${l}</td>
          <td style="padding:4pt 0;border:none;font-weight:bold;font-size:9.5pt;color:${c}">${v}</td>
        </tr>`).join('')}
      </table>
    </div>
  </div>

  ${radarImg ? `
  <h2>Domain Radar</h2>
  <div style="text-align:center;margin-bottom:16pt">
    <img src="${radarImg}" style="max-width:280pt;width:65%;display:inline-block">
  </div>` : ''}

  <h2>Domain Coverage</h2>
  <table>
    <thead><tr>
      <th style="width:36pt">Domain</th><th>Area</th>
      <th style="text-align:center">Met</th><th style="text-align:center">Partial</th>
      <th style="text-align:center">Not Met</th><th style="text-align:center">N/A</th>
      <th style="text-align:center">Score</th>
    </tr></thead>
    <tbody>${domRows}</tbody>
  </table>

  ${sorted.length >= 2 ? `
  <h2>Score Trend</h2>
  ${trendImg ? `<div style="margin-bottom:12pt"><img src="${trendImg}" style="width:100%;display:block"></div>` : ''}` : ''}

  <h2>Top ${topGaps.length} Priority Gaps</h2>
  ${topGaps.length ? `
  <table>
    <thead><tr>
      <th style="width:70pt">Practice ID</th><th style="width:36pt">Domain</th>
      <th>Title</th><th style="width:54pt">Status</th>
    </tr></thead>
    <tbody>
      ${gapRows}
      ${gaps.length > 10 ? `<tr><td colspan="4" style="color:#94a3b8;font-style:italic;font-size:9pt">+ ${gaps.length - 10} more — see full assessment listing below</td></tr>` : ''}
    </tbody>
  </table>` : `<p style="color:#15803d;font-weight:bold">&#10003; No gaps &mdash; all 17 Level 1 practices are Met or N/A.</p>`}

  <h2>SPRS Readiness Note</h2>
  <p style="font-size:10pt;line-height:1.65;color:#5a6a8a">This assessment covers the 17 CMMC Level 1 practices. The estimated L1 contribution to the SPRS score is <strong>${sprs.contribution} of ${sprs.maxContribution} possible points</strong>. The full SPRS score (0–110) covers all 110 NIST SP 800-171 Rev 2 practices — a CMMC Level 2 assessment is required for a complete score. Annual self-attestation must be submitted at <strong>sprs.csd.disa.mil</strong> by a senior company official with authority to attest on behalf of the organization.</p>

  <div style="page-break-before: always">
    <h2>Full Assessment — All 17 CMMC Level 1 Practices</h2>
    <table>
      <thead><tr>
        <th style="width:80pt">Practice ID</th>
        <th style="width:44pt">Status</th>
        <th>Title &amp; Description</th>
      </tr></thead>
      <tbody>${practiceListHtml}</tbody>
    </table>
  </div>

  <div class="footer">
    Generated by Abbott Cyber Consulting GRC Platform &nbsp;&middot;&nbsp;
    CMMC Level 1 &nbsp;&middot;&nbsp; ${run.date || exportDate} &nbsp;&middot;&nbsp; Confidential — Do not distribute without authorization.
  </div>

</div>
</body>
</html>`;

  const blob = new Blob(['﻿' + html], { type: 'application/msword' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `CMMC-L1-Report-${(currentOrg.name || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}_${run.date || exportDate}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Word report downloaded', '#15803d');
}

// ── WINDOW EXPORTS ─────────────────────────────────────────────────────────────
window.renderCMMC              = renderCMMC;
window.cmmcStartNew            = cmmcStartNew;
window.cmmcOpenAssessment      = cmmcOpenAssessment;
window.cmmcOpenPoam            = cmmcOpenPoam;
window.cmmcOpenReport          = cmmcOpenReport;
window.cmmcOpenSprs            = cmmcOpenSprs;
window.cmmcNavToDashboard      = cmmcNavToDashboard;
window.cmmcSaveAssessment      = cmmcSaveAssessment;
window.cmmcDeleteAssessment    = cmmcDeleteAssessment;
window.cmmcSavePoam            = cmmcSavePoam;
window.cmmcCopyReportPrompt    = cmmcCopyReportPrompt;
window.cmmcSaveCommentary      = cmmcSaveCommentary;
window.cmmcExportReportWord    = cmmcExportReportWord;
window.cmmcExportExcel         = cmmcExportExcel;
window.cmmcSetAnswer           = cmmcSetAnswer;
window.cmmcTogglePanel         = cmmcTogglePanel;
window.cmmcTrendDraw           = cmmcTrendDraw;
window.drawCmmcRadar           = drawCmmcRadar;
window.drawCmmcReportCharts    = drawCmmcReportCharts;
