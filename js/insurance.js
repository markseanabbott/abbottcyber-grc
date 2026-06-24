const INS_SECTIONS = [
  { id: 'mfa', name: 'MFA & Auth', icon: '🔐', questions: [
    { id: 'q1', text: 'MFA enforced for all remote access?', sub: 'VPN, cloud portals, remote desktop', secW: 10, insW: 15, options: [{ t: 'Yes — all remote access requires MFA', s: 1.0 }, { t: 'Partial — some systems', s: 0.5 }, { t: 'No — passwords only', s: 0 }] },
    { id: 'q2', text: 'MFA enforced for all privileged / admin accounts?', secW: 9, insW: 14, options: [{ t: 'Yes — mandatory on all admin accounts', s: 1.0 }, { t: 'Encouraged but not enforced', s: 0.4 }, { t: 'No', s: 0 }] },
    { id: 'q3', text: 'What type of MFA is in use?', secW: 7, insW: 10, options: [{ t: 'Authenticator app or hardware token', s: 1.0 }, { t: 'Push notification', s: 0.85 }, { t: 'SMS or email OTP', s: 0.4 }, { t: 'None', s: 0 }] },
  ]},
  { id: 'backup', name: 'Backup & Recovery', icon: '💾', questions: [
    { id: 'q4', text: 'Critical systems backed up daily?', secW: 9, insW: 12, options: [{ t: 'Yes — automated daily', s: 1.0 }, { t: 'Weekly', s: 0.5 }, { t: 'Infrequent or manual', s: 0.2 }, { t: 'No backup', s: 0 }] },
    { id: 'q5', text: 'Backups stored offline or isolated?', sub: 'Air-gapped, immutable, or offsite', secW: 10, insW: 15, options: [{ t: 'Yes — offline / immutable', s: 1.0 }, { t: 'Online but separate network', s: 0.5 }, { t: 'Same network as production', s: 0.1 }, { t: 'Unknown', s: 0 }] },
    { id: 'q6', text: 'Backup restorations tested regularly?', secW: 8, insW: 9, options: [{ t: 'Quarterly or more', s: 1.0 }, { t: 'Annually', s: 0.6 }, { t: 'Rarely or never', s: 0 }] },
  ]},
  { id: 'endpoint', name: 'Endpoint Protection', icon: '🛡️', questions: [
    { id: 'q7', text: 'EDR deployed across all endpoints?', secW: 9, insW: 13, options: [{ t: 'Yes — EDR on all endpoints', s: 1.0 }, { t: 'Traditional AV only', s: 0.35 }, { t: 'Partial coverage', s: 0.3 }, { t: 'No protection', s: 0 }] },
    { id: 'q8a', text: 'OS and Microsoft updates applied on schedule?', sub: 'Windows / macOS / Linux OS patches and Microsoft product updates (e.g. Office, Exchange, SQL Server)', secW: 8, insW: 8, options: [{ t: 'Monthly or faster via managed tool (WSUS / Intune / MDM)', s: 1.0 }, { t: 'Applied manually or ad hoc — no documented schedule', s: 0.5 }, { t: 'Infrequent or reactive — known outstanding patches', s: 0.1 }] },
    { id: 'q8b', text: '3rd-party software patched on schedule?', sub: 'Browsers, Java, Adobe, line-of-business apps and other non-Microsoft software — critical CVEs closed within 30 days', secW: 7, insW: 9, options: [{ t: 'Centralised tool tracks and deploys 3rd-party patches (e.g. Chocolatey, NinjaRMM, Automox)', s: 1.0 }, { t: 'Manual process — some tracking, inconsistent coverage', s: 0.45 }, { t: 'No formal 3rd-party patch process', s: 0 }] },
  ]},
  { id: 'email', name: 'Email Security', icon: '📧', questions: [
    { id: 'q10', text: 'Email security controls deployed?', secW: 8, insW: 10, options: [{ t: 'Advanced filtering + DMARC + training', s: 1.0 }, { t: 'Basic spam filter only', s: 0.35 }, { t: 'Default provider settings', s: 0.15 }, { t: 'None', s: 0 }] },
    { id: 'q11', text: 'Security awareness training for all staff?', secW: 7, insW: 8, options: [{ t: 'Regular training + phishing simulations', s: 1.0 }, { t: 'Annual policy review only', s: 0.45 }, { t: 'No formal training', s: 0 }] },
  ]},
  { id: 'ir', name: 'Incident Response', icon: '🚨', questions: [
    { id: 'q12', text: 'Documented Incident Response Plan?', secW: 9, insW: 14, options: [{ t: 'Yes — tested within last 12 months', s: 1.0 }, { t: 'Documented, not recently tested', s: 0.55 }, { t: 'Informal / undocumented', s: 0.2 }, { t: 'No IR plan', s: 0 }] },
    { id: 'q14', text: 'Designated IR contact or retainer?', secW: 8, insW: 10, options: [{ t: 'Yes — named CISO or IR retainer', s: 1.0 }, { t: 'Use IT team ad hoc', s: 0.35 }, { t: 'No designated contact', s: 0 }] },
  ]},
  { id: 'access', name: 'Access Controls', icon: '🔑', questions: [
    { id: 'q15', text: 'Principle of least privilege enforced?', secW: 8, insW: 9, options: [{ t: 'Yes — role-based with reviews', s: 1.0 }, { t: 'Partially implemented', s: 0.45 }, { t: 'Not enforced', s: 0 }] },
    { id: 'q16', text: 'Privileged accounts separated from user accounts?', secW: 8, insW: 10, options: [{ t: 'Yes — separate admin accounts', s: 1.0 }, { t: 'Some separation, inconsistent', s: 0.45 }, { t: 'No separation', s: 0 }] },
  ]},
];
const INS_SAVINGS = [
  { q: 'q1', label: 'Enforce MFA — remote', pct: '12–18%', annual: '$4,200–$8,600' },
  { q: 'q5', label: 'Isolated backups', pct: '10–16%', annual: '$3,500–$7,000' },
  { q: 'q2', label: 'MFA on admin accounts', pct: '8–14%', annual: '$2,800–$5,400' },
  { q: 'q12', label: 'Tested IR Plan', pct: '5–10%', annual: '$1,800–$3,600' },
  { q: 'q7', label: 'Deploy EDR', pct: '6–12%', annual: '$2,200–$4,800' },
  { q: 'q10', label: 'Advanced email security', pct: '3–7%', annual: '$1,200–$2,400' },
];

function insSecScore(s) { return s.questions.reduce((a, q) => { const r = insState.answers[q.id]; return a + (r !== undefined ? r * q.secW : 0); }, 0); }
function insInsScore(s) { return s.questions.reduce((a, q) => { const r = insState.answers[q.id]; return a + (r !== undefined ? r * q.insW : 0); }, 0); }
function insSecMax(s) { return s.questions.reduce((a, q) => a + q.secW, 0); }
function insInsMax(s) { return s.questions.reduce((a, q) => a + q.insW, 0); }
function insAnswered(s) { return s.questions.filter(q => insState.answers[q.id] !== undefined).length; }
function insAllDone() { return INS_SECTIONS.every(s => insAnswered(s) === s.questions.length); }
function insCalc() {
  const sm = INS_SECTIONS.reduce((a, s) => a + insSecMax(s), 0);
  const im = INS_SECTIONS.reduce((a, s) => a + insInsMax(s), 0);
  const ss = Math.round(INS_SECTIONS.reduce((a, s) => a + insSecScore(s), 0) / sm * 100);
  const is = Math.round(INS_SECTIONS.reduce((a, s) => a + insInsScore(s), 0) / im * 100);
  return { score: Math.round(ss * 0.4 + is * 0.6), secPct: ss, insPct: is };
}

// ─── VIEW ROUTER ──────────────────────────────────────────────
function renderInsurance() {
  if (!currentOrg) return '';
  if (insState.view === 'form') return renderInsuranceForm();
  if (insState.view === 'cost') return renderInsuranceCostTab();
  return renderInsuranceDashboard();
}

// ─── DASHBOARD ────────────────────────────────────────────────
function renderInsuranceDashboard() {
  const orgId = currentOrg.id;
  const rawRuns = (orgAssessments[orgId] || {}).insurance || [];
  const sorted = rawRuns.map((r, i) => ({ r, i })).sort((a, b) => (b.r.date || '').localeCompare(a.r.date || ''));
  const latest = sorted.length ? sorted[0].r : null;
  const latestOrigIdx = sorted.length ? sorted[0].i : -1;

  const scoreColor = !latest ? 'rgba(255,255,255,.35)' : latest.score >= 75 ? '#4ade80' : latest.score >= 50 ? '#fbbf24' : '#f87171';
  const scoreBand = !latest ? null : latest.score >= 75 ? 'Strong Posture' : latest.score >= 60 ? 'Moderate Risk' : latest.score >= 40 ? 'Elevated Risk' : 'High Risk';
  const bandCls = !latest ? '' : latest.score >= 75 ? 'band-high' : latest.score >= 60 ? 'band-mid' : 'band-low';
  const gaps = latest && latest.answers ? INS_SAVINGS.filter(sv => (latest.answers[sv.q] || 0) < 0.8) : [];

  let h = `${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:3px">🛡️ Insurance Readiness</div>
      <div style="font-size:12px;color:var(--muted)">Dual-weighted scoring · Security 40% / Insurance 60% · <strong>${currentOrg.name}</strong></div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${latest ? `<button class="btn btn-outline btn-sm" style="border-color:#15803d;color:#15803d" onclick="insOpenCost()">💲 Cost to Remediate</button>` : ''}
      <button class="btn btn-cyan btn-sm" onclick="insNew()">+ New Assessment</button>
    </div>
  </div>

  <div class="score-hero-ins" style="margin-bottom:1.25rem">
    <div style="flex:1">
      <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:6px">Current Score — ${currentOrg.name}</div>
      <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start">
        <div>
          <div class="score-big" style="color:${scoreColor}">${latest ? latest.score : '—'}<span style="font-size:18px">${latest ? '%' : ''}</span></div>
          ${scoreBand ? `<div class="score-band ${bandCls}">${scoreBand}</div>` : '<div style="font-size:11px;color:rgba(255,255,255,.35);margin-top:6px">No assessments yet</div>'}
        </div>
        ${latest ? `
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:3px">Security</div>
          <div style="font-size:26px;font-weight:800;color:#93c5fd;line-height:1">${latest.secPct}%</div>
          <div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:2px">40% weight</div>
        </div>
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:3px">Insurance</div>
          <div style="font-size:26px;font-weight:800;color:#6ee7b7;line-height:1">${latest.insPct}%</div>
          <div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:2px">60% weight</div>
        </div>
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:3px">Runs</div>
          <div style="font-size:26px;font-weight:800;color:rgba(255,255,255,.6);line-height:1">${rawRuns.length}</div>
          <div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:2px">assessments</div>
        </div>` : ''}
      </div>
    </div>
    ${rawRuns.length >= 2 ? `<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:6px">
      <div style="font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4)">Score Trend</div>
      <canvas id="trendChart" width="200" height="65"></canvas>
    </div>` : ''}
  </div>

  <div class="card" style="padding:1.25rem;margin-bottom:1rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
      <div style="font-size:14px;font-weight:700;color:var(--text)">Assessment History</div>
      <button class="btn btn-cyan btn-sm" onclick="insNew()">+ New Assessment</button>
    </div>
    ${!rawRuns.length ? `
      <div style="text-align:center;padding:2.5rem 1rem;color:var(--muted)">
        <div style="font-size:32px;margin-bottom:.75rem">🛡️</div>
        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:6px">No assessments yet</div>
        <div style="font-size:12px;margin-bottom:1.25rem">Run your first insurance readiness assessment to benchmark your cyber insurance posture.</div>
        <button class="btn btn-cyan btn-sm" onclick="insNew()">+ Start First Assessment</button>
      </div>
    ` : `
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px;min-width:560px">
          <thead><tr style="border-bottom:2px solid var(--border)">
            <th style="text-align:left;padding:6px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Date</th>
            <th style="text-align:center;padding:6px 8px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Overall</th>
            <th style="text-align:center;padding:6px 8px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Security</th>
            <th style="text-align:center;padding:6px 8px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Insurance</th>
            <th style="text-align:left;padding:6px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Conducted By</th>
            <th style="text-align:right;padding:6px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Actions</th>
          </tr></thead>
          <tbody>
            ${sorted.map(({ r, i }) => {
              const isLatest = i === latestOrigIdx;
              const sColor = (r.score || 0) >= 75 ? '#15803d' : (r.score || 0) >= 50 ? '#b45309' : '#dc2626';
              return `<tr style="border-bottom:1px solid var(--border)">
                <td style="padding:9px 10px;font-weight:${isLatest ? '700' : '400'};white-space:nowrap">
                  ${r.date || '—'}
                  ${isLatest ? '<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;background:#dbeafe;color:#1d4ed8;margin-left:6px">Latest</span>' : ''}
                </td>
                <td style="padding:9px 8px;text-align:center">
                  <span style="font-size:15px;font-weight:800;color:${sColor}">${r.score ?? '—'}</span><span style="font-size:11px;color:var(--muted)">%</span>
                </td>
                <td style="padding:9px 8px;text-align:center">
                  <span style="font-size:12px;font-weight:700;color:#1d4ed8">${r.secPct ?? '—'}%</span>
                </td>
                <td style="padding:9px 8px;text-align:center">
                  <span style="font-size:12px;font-weight:700;color:#0f766e">${r.insPct ?? '—'}%</span>
                </td>
                <td style="padding:9px 10px;color:var(--muted);font-size:12px">${escH(r.conductedBy || '—')}</td>
                <td style="padding:9px 10px;text-align:right">
                  <button class="btn btn-outline btn-sm" onclick="insOpenAssessment(${i})" style="font-size:11px;padding:3px 9px;margin-right:4px">✏️ Edit</button>
                  <button class="btn btn-red btn-sm" onclick="insDeleteAssessment('${r.id}')" style="font-size:11px;padding:3px 9px">Delete</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `}
  </div>

  ${gaps.length ? `<div class="savings-box">
    <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--cyan2);margin-bottom:.85rem">Estimated premium savings available — address these gaps to improve your score</div>
    <div class="savings-grid">${gaps.map(sv => `
      <div class="sav-card">
        <div style="font-size:10px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px">${sv.label}</div>
        <div style="font-size:17px;font-weight:700;color:#fff">${sv.pct}</div>
        <div style="font-size:10px;color:rgba(255,255,255,.4)">${sv.annual}/yr</div>
      </div>`).join('')}
    </div>
  </div>` : ''}`;

  return h;
}

// ─── FORM ─────────────────────────────────────────────────────
function renderInsuranceForm() {
  const allDone = insAllDone();
  const totalQs = INS_SECTIONS.reduce((a, s) => a + s.questions.length, 0);
  const answeredQs = INS_SECTIONS.reduce((a, s) => a + insAnswered(s), 0);
  const remaining = totalQs - answeredQs;
  const pct = totalQs > 0 ? Math.round(answeredQs / totalQs * 100) : 0;

  // Live score from answered questions only (like CIS "Score So Far")
  let displayScore = null, displaySecPct = null, displayInsPct = null;
  if (answeredQs > 0) {
    let ss = 0, si = 0, smax = 0, imax = 0;
    INS_SECTIONS.forEach(sec => sec.questions.forEach(q => {
      if (insState.answers[q.id] !== undefined) {
        ss += insState.answers[q.id] * q.secW; si += insState.answers[q.id] * q.insW;
        smax += q.secW; imax += q.insW;
      }
    }));
    displaySecPct = smax ? Math.round(ss / smax * 100) : 0;
    displayInsPct = imax ? Math.round(si / imax * 100) : 0;
    displayScore = Math.round(displaySecPct * 0.4 + displayInsPct * 0.6);
  }

  let h = `${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🛡️ Insurance Readiness — ${insState.editId ? 'Edit Assessment' : 'New Assessment'}</div>
      <div style="font-size:12px;color:var(--muted)">${insState.editId ? 'Editing an existing record — saving will update it in place' : 'Answer all ' + totalQs + ' questions, then save to record this run'}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="insBackToDashboard()">← Back to Dashboard</button>
      ${insState.fromNew ? '<button class="btn btn-outline btn-sm" id="insPrefillBtn" onclick="insPrefillFromTS()" style="font-size:11px">&#8681; From Tech Stack</button>' : ''}
    </div>
  </div>

  <div class="score-hero-ins" style="margin-bottom:1.25rem">
    <div style="flex:1;display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap">
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">Score So Far</div>
          <div class="score-big" style="color:#fff">${displayScore !== null ? displayScore : '—'}<span style="font-size:18px">${displayScore !== null ? '%' : ''}</span></div>
          <div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">${allDone ? 'All questions answered' : answeredQs + '/' + totalQs + ' answered'}</div>
        </div>
        <div style="flex:1;min-width:220px">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
            <span style="font-size:10px;color:rgba(255,255,255,.5)">${answeredQs} of ${totalQs} questions</span>
            <span style="font-size:10px;color:rgba(255,255,255,.5)">${pct}%</span>
          </div>
          <div style="height:6px;background:rgba(255,255,255,.12);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--cyan);border-radius:3px;transition:width .3s"></div>
          </div>
          ${allDone && displaySecPct !== null ? `
          <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
            <span class="badge b-navy" style="font-size:10px">Security: ${displaySecPct}%</span>
            <span class="badge b-cyan" style="font-size:10px">Insurance: ${displayInsPct}%</span>
          </div>` : ''}
        </div>
      </div>
    </div>
    <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:6px">
      <div>
        <div style="font-size:9px;color:rgba(255,255,255,.4);margin-bottom:3px">Assessment Date</div>
        <input type="date" value="${insState.date || ''}" onchange="insState.date=this.value"
          style="padding:5px 8px;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-family:Inter,sans-serif;font-size:12px;color-scheme:dark">
      </div>
      <div>
        <div style="font-size:9px;color:rgba(255,255,255,.4);margin-bottom:3px">Conducted By</div>
        <input type="text" value="${escH(insState.conductedBy || '')}" placeholder="Assessor name" oninput="insState.conductedBy=this.value"
          style="padding:5px 8px;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-family:Inter,sans-serif;font-size:12px;width:150px" autocomplete="off">
      </div>
    </div>
  </div>

  ${INS_SECTIONS.map(sec => {
    const isOpen = insState.openPanels[sec.id];
    const ans = insAnswered(sec);
    const done = ans === sec.questions.length;
    const started = ans > 0 && !done;
    return `<div class="survey-panel">
      <div class="sph" onclick="insToggle('${sec.id}')">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:15px">${sec.icon}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--text)">${sec.name}</div>
            <div style="font-size:10px;color:var(--muted)">${sec.questions.length} questions · ${ans}/${sec.questions.length} answered</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge ${done ? 'b-green' : started ? 'b-amber' : 'b-gray'}">${done ? 'Done' : started ? 'In progress' : 'Not started'}</span>
          <span style="color:var(--muted);font-size:12px">${isOpen ? '▴' : '▾'}</span>
        </div>
      </div>
      <div class="spb${isOpen ? ' open' : ''}">
        ${sec.questions.map(q => {
          const sel = insState.answers[q.id];
          return `<div class="cis-safeguard">
            <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:3px">
              <span class="badge b-navy" style="font-size:9px;flex-shrink:0;margin-top:1px">Sec: ${q.secW}</span>
              <span class="badge b-cyan" style="font-size:9px;flex-shrink:0;margin-top:1px">Ins: ${q.insW}</span>
              <span class="cis-sf-text" style="margin:0">${q.text}</span>
            </div>
            ${q.sub ? `<div class="cis-sf-sub">${q.sub}</div>` : '<div style="margin-bottom:6px"></div>'}
            <div class="cis-ans-row" style="flex-direction:column;gap:4px">
              ${q.options.map(o => {
                const sc = Math.round(o.s * 100);
                const isSel = sel === o.s;
                const selCls = isSel ? (sc >= 80 ? 'sel-yes' : sc >= 40 ? 'sel-partial' : 'sel-no') : '';
                return `<button class="cis-ans-btn${isSel ? ' ' + selCls : ''}" onclick="insAnswer('${q.id}',${o.s})"
                  style="text-align:left;white-space:normal;height:auto;width:100%;padding:6px 10px;font-size:11px">
                  ${o.t}<span style="float:right;font-size:9px;opacity:.65;margin-left:8px">${sc}%</span>
                </button>`;
              }).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('')}

  <div style="margin-top:.75rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    <button class="btn btn-outline btn-sm" onclick="insBackToDashboard()">← Back to Dashboard</button>
    ${insState.fromNew ? '<button class="btn btn-outline btn-sm" id="insPrefillBtn2" onclick="insPrefillFromTS()" style="font-size:11px">&#8681; From Tech Stack</button>' : ''}
    <span style="flex:1"></span>
    ${remaining > 0 ? `<span style="font-size:11px;color:var(--muted)">${remaining} question${remaining !== 1 ? 's' : ''} remaining</span>` : ''}
    ${allDone ? '<button class="btn btn-cyan btn-sm" id="saveBtn" onclick="insSave()">Save Assessment</button>' : '<button class="btn btn-cyan btn-sm" disabled style="opacity:.35;cursor:not-allowed">Save Assessment</button>'}
  </div>`;

  if (allDone) {
    const r = insCalc();
    const gaps = INS_SAVINGS.filter(sv => (insState.answers[sv.q] || 0) < 0.8);
    if (gaps.length) {
      h += `<div class="savings-box" style="margin-top:.75rem">
        <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--cyan2);margin-bottom:.85rem">Estimated premium savings available — address these gaps</div>
        <div class="savings-grid">${gaps.map(sv => `
          <div class="sav-card">
            <div style="font-size:10px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px">${sv.label}</div>
            <div style="font-size:17px;font-weight:700;color:#fff">${sv.pct}</div>
            <div style="font-size:10px;color:rgba(255,255,255,.4)">${sv.annual}/yr</div>
          </div>`).join('')}
        </div>
      </div>`;
    }
  }

  return h;
}

// ─── INTERACTIONS ─────────────────────────────────────────────
function insToggle(id) { insState.openPanels[id] = !insState.openPanels[id]; renderMain(); }

function insAnswer(qid, score) {
  insState.answers[qid] = score;
  const sec = INS_SECTIONS.find(s => s.questions.some(q => q.id === qid));
  if (sec && !insState.openPanels[sec.id]) insState.openPanels[sec.id] = true;
  renderMain();
}

function insNew() {
  insState = {
    answers: {},
    openPanels: { [INS_SECTIONS[0].id]: true },
    view: 'form',
    editId: null,
    conductedBy: '',
    date: new Date().toISOString().slice(0, 10),
    fromNew: true,
  };
  renderMain();
}

function insOpenCost() {
  const runs = (orgAssessments[currentOrg?.id] || {}).insurance || [];
  const sorted = runs.map((r, i) => ({ r, i })).sort((a, b) => (b.r.date || '').localeCompare(a.r.date || ''));
  if (!sorted.length) { toast('No assessments recorded yet', '#b45309'); return; }
  insState.costRun = sorted[0].r;
  insState.view = 'cost';
  renderMain();
}

function renderInsuranceCostTab() {
  const run = insState.costRun;
  if (!run) return renderInsuranceDashboard();
  const answers = run.answers || {};
  const { gaps } = rcExtractInsGaps(answers);
  const gapCount = Object.keys(RC_INS_TO_TOOL).filter(qId => (answers[qId] ?? -1) < 1.0 && answers[qId] !== undefined).length;

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">💲 Cost to Remediate</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · Insurance Readiness · ${run.date || '—'} · ${gapCount} gap${gapCount!==1?'s':''} across ${gaps.length} tool type${gaps.length!==1?'s':''}</div>
    </div>
    <button class="btn btn-outline btn-sm" onclick="insState.view='dashboard';renderMain()">← Back</button>
  </div>
  ${renderRemediationCosts(gaps, currentOrg.id, { runDate: run.date })}`;
}

function insOpenAssessment(origIdx) {
  const runs = (orgAssessments[currentOrg?.id] || {}).insurance || [];
  const run = runs[origIdx];
  if (!run) return;
  insState = {
    answers: Object.assign({}, run.answers || {}),
    openPanels: { [INS_SECTIONS[0].id]: true },
    view: 'form',
    editId: run.id || null,
    conductedBy: run.conductedBy || '',
    date: run.date || new Date().toISOString().slice(0, 10),
  };
  renderMain();
}

function insBackToDashboard() {
  insState.view = 'dashboard';
  renderMain();
}

async function insDeleteAssessment(id) {
  if (!confirm('Delete this assessment? This cannot be undone.')) return;
  try {
    await sbFetch(`assessments?id=eq.${id}`, 'DELETE');
    delete orgAssessments[currentOrg.id];
    await loadAssessments(currentOrg.id);
    toast('Assessment deleted', '#15803d');
    buildNav(); renderMain();
  } catch(e) {
    toast('Delete failed: ' + e.message, '#dc2626');
  }
}

async function insSave() {
  const r = insCalc();
  const date = insState.date || new Date().toISOString().slice(0, 10);
  document.querySelectorAll('#saveBtn,[onclick="insSave()"]').forEach(b => { b.disabled = true; b.innerHTML = '<span class="spinner"></span>Saving…'; });
  const payload = {
    org_id: currentOrg.id,
    module: 'insurance',
    score: r.score,
    sec_pct: r.secPct,
    ins_pct: r.insPct,
    answers: insState.answers,
    assessed_at: date,
    conducted_by: insState.conductedBy || null,
  };
  try {
    if (insState.editId) {
      await sbFetch(`assessments?id=eq.${insState.editId}`, 'PATCH', payload);
    } else {
      await sb.saveAssessment(payload);
    }
    delete orgAssessments[currentOrg.id];
    await loadAssessments(currentOrg.id);
    insState.view = 'dashboard';
    auditLog('assessment_saved', 'assessment', 'Insurance Readiness', { score: r.score, sec_pct: r.secPct, ins_pct: r.insPct });
    toast(`Insurance assessment saved — ${r.score}%`, '#15803d');
    buildNav(); renderMain();
  } catch (e) {
    toast('Save failed: ' + e.message, '#dc2626');
    document.querySelectorAll('#saveBtn,[onclick="insSave()"]').forEach(b => { b.disabled = false; b.textContent = 'Save Assessment'; });
  }
}

function drawTrend() {
  const runs = (orgAssessments[currentOrg?.id] || {}).insurance || [];
  if (runs.length < 2) return;
  setTimeout(() => {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 200; canvas.width = W; const H = 65;
    ctx.clearRect(0, 0, W, H);
    const scores = runs.map(r => r.score);
    const mn = Math.min(...scores) - 10, mx = Math.max(...scores) + 10;
    const px = i => Math.round(i * (W - 20) / (runs.length - 1) + 10);
    const py = v => Math.round(H - 6 - (v - mn) / (mx - mn) * (H - 16));
    ctx.beginPath(); ctx.strokeStyle = '#07B4D9'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    scores.forEach((s, i) => { i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)); }); ctx.stroke();
    scores.forEach((s, i) => {
      ctx.beginPath(); ctx.arc(px(i), py(s), 4, 0, Math.PI * 2);
      ctx.fillStyle = s >= 75 ? '#15803d' : s >= 50 ? '#b45309' : '#b91c1c'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 9px Inter,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(s, px(i), py(s) - 7);
    });
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '9px Inter,sans-serif';
    runs.forEach((r, i) => { ctx.textAlign = 'center'; ctx.fillText((r.date || '').slice(5), px(i), H); });
  }, 80);
}
