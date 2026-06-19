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
  reportRun: null,
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
    reportRun: null,
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

  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { score, yes, partial, no, na, total, scoreable, answered } = cmmcCalcScore(answers);
  const { band, bandCol } = acScoreBand(score);
  const unanswered  = total - (yes + partial + no + na);
  const fullImpl    = scoreable > 0 ? Math.round(yes / scoreable * 100) : 0;
  const fiCol       = fullImpl >= 75 ? '#15803d' : fullImpl >= 50 ? '#b45309' : '#dc2626';
  const domProg     = cmmcDomainProgress(answers);
  const topGaps     = cmmcGetGaps(answers);
  const sprs        = cmmcSprsCalc(answers);

  const scoreStripHtml = acExecScoreStripHtml({
    yes, partial, no, na, unanswered, scopedTotal: total,
    score, bandCol, fullImpl, fiCol, goalLabel: 'L1',
  });

  const domTableHtml = `
  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Domain Coverage</div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr style="border-bottom:2px solid var(--border)">
        <th style="text-align:left;padding:6px 8px;font-size:10px;font-weight:700;color:var(--muted)">Domain</th>
        <th style="text-align:center;padding:6px 8px;font-size:10px;font-weight:700;color:#15803d">Met</th>
        <th style="text-align:center;padding:6px 8px;font-size:10px;font-weight:700;color:#b45309">Partial</th>
        <th style="text-align:center;padding:6px 8px;font-size:10px;font-weight:700;color:#dc2626">Not Met</th>
        <th style="text-align:center;padding:6px 8px;font-size:10px;font-weight:700;color:var(--muted)">Score</th>
        <th style="padding:6px 8px;min-width:120px"></th>
      </tr></thead>
      <tbody>
        ${domProg.map(d => `<tr style="border-bottom:1px solid var(--border)">
          <td style="padding:8px 8px">
            <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;background:${d.bg};color:${d.color}">${d.key}</span>
            <span style="font-size:11px;color:var(--muted);margin-left:6px">${d.label}</span>
          </td>
          <td style="padding:8px 8px;text-align:center;font-weight:700;color:#15803d">${d.yes}</td>
          <td style="padding:8px 8px;text-align:center;font-weight:700;color:#b45309">${d.partial}</td>
          <td style="padding:8px 8px;text-align:center;font-weight:700;color:#dc2626">${d.no}</td>
          <td style="padding:8px 8px;text-align:center;font-weight:700;color:${d.pct>=75?'#15803d':d.pct>=50?'#b45309':'#dc2626'}">${d.pct}%</td>
          <td style="padding:8px 8px">
            <div style="height:6px;background:var(--bg);border-radius:3px;overflow:hidden">
              <div style="height:100%;width:${d.pct}%;background:${d.color};border-radius:3px;transition:width .4s"></div>
            </div>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  const gapsHtml = topGaps.length ? `
  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Gaps to Address (${topGaps.length})</div>
    ${topGaps.map(g => {
      const meta = CMMC_DOMAIN_META[g.domain] || {};
      const ans  = answers[g.id] || '';
      return `<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;background:${meta.bg};color:${meta.color};white-space:nowrap;margin-top:1px">${escH(g.id)}</span>
        <div>
          <div style="font-size:12px;font-weight:600">${escH(g.title)}</div>
          <div style="font-size:11px;color:var(--muted)">${escH(g.desc)}</div>
        </div>
        <span style="margin-left:auto;font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;
          background:${ans==='no'?'#fee2e2':'#fef3c7'};color:${ans==='no'?'#dc2626':'#b45309'};white-space:nowrap">
          ${ans==='no'?'Not Met':'Partial'}
        </span>
      </div>`;
    }).join('')}
  </div>` : '';

  const promptHtml = `
  <div class="card" style="padding:1.1rem;margin-bottom:1rem;border-left:4px solid var(--cyan)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div style="font-size:13px;font-weight:700">📋 Executive Report Prompt</div>
      <button class="btn btn-cyan btn-sm" onclick="cmmcCopyReportPrompt()">Copy to Clipboard</button>
    </div>
    <div style="font-size:11px;color:var(--muted);line-height:1.6">
      Copy this prompt to Claude to generate a Word-ready executive report for ${escH(currentOrg.name)}.
    </div>
  </div>`;

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📊 CMMC L1 Executive Report</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''}</div>
    </div>
    <div style="display:flex;gap:6px">
      <button class="btn btn-outline btn-sm" onclick="cmmcNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="cmmcOpenSprs(null)">🏛 SPRS →</button>
    </div>
  </div>
  ${scoreStripHtml}
  ${domTableHtml}
  ${gapsHtml}
  ${promptHtml}`;
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
      await sbFetch(`/rest/v1/assessments?id=eq.${encodeURIComponent(cmmcState.editId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ score, answers: answersToSave, assessed_at: date, conducted_by: conductedBy }),
      });
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
    await sbFetch(`/rest/v1/assessments?id=eq.${encodeURIComponent(run.id)}`, { method: 'DELETE' });
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
    await sbFetch(`/rest/v1/assessments?id=eq.${encodeURIComponent(run.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ answers: updatedAnswers }),
    });
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

  const prompt = `You are a cybersecurity consultant producing a Word-ready executive report. Use plain text formatting only — no markdown symbols, no asterisks, no pound signs. Use ALL-CAPS for section headings. Use numbered lists for recommendations. Use simple hyphens for bullets. Never use bold/italic markers.

CLIENT: ${currentOrg.name}
FRAMEWORK: CMMC Level 1 (DoD Contractor Self-Assessment)
ASSESSMENT DATE: ${run.date || '—'}
CONDUCTED BY: ${run.conductedBy || '—'}

SCORE SUMMARY:
Overall Score: ${score}% (${band})
Implemented (Met): ${yes} / ${scoreable} scoreable practices
Partial: ${partial}
Not Met: ${no}
N/A: ${na}

ESTIMATED SPRS CONTRIBUTION (L1 only): ${sprs.contribution} of ${sprs.maxContribution} possible points
NOTE: Full SPRS score (0-110) requires all 110 NIST SP 800-171 practices — this assessment covers Level 1 only.

DOMAIN BREAKDOWN:
${domainSummary}

${gaps.length > 0 ? `GAPS (${gaps.length} practices not fully met):
${gapList}` : 'GAPS: None — all 17 Level 1 practices are Met or N/A.'}

OUTPUT FORMAT:
Produce a 1-2 page executive security report with these sections:

EXECUTIVE SUMMARY
One paragraph (4-6 sentences). State the assessment scope (CMMC L1, 17 practices, 6 domains). State the overall score and risk posture. Identify the strongest and weakest domains by name. Note the estimated SPRS contribution.

KEY FINDINGS
3-5 bullet points covering the most important observations. Include: what is working well, critical gaps, and any domain with score below 50%.

DOMAIN ANALYSIS
One short paragraph per domain. State score and whether it is strong, acceptable, or a concern. Name specific practices that are gaps.

PRIORITY RECOMMENDATIONS
Numbered list of the top 5 actions. Each recommendation: one sentence what to do, one sentence why it matters for CMMC compliance. Order by impact on SPRS score (highest deduction practices first).

SPRS READINESS NOTE
One paragraph explaining what SPRS is, that the contractor must self-attest annually in the SPRS portal, and what the estimated L1 contribution means. Note that additional NIST SP 800-171 assessment is required for a complete SPRS score.

NEXT STEPS
Bullet list: 3-4 practical next steps with specific, actionable language.`;

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
