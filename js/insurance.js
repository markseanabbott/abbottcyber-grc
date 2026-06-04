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

function renderInsurance() {
  if (!currentOrg) return '';
  const runs = (orgAssessments[currentOrg.id] || {}).insurance || [];
  const latest = runs.length ? runs[runs.length - 1] : null;
  let h = `${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.85rem;flex-wrap:wrap;gap:8px">
    <div><div style="font-size:17px;font-weight:700">🛡️ Insurance Readiness</div>
    <div style="font-size:12px;color:var(--muted)">Dual-weighted scoring · <strong>${currentOrg.name}</strong></div></div>
    <button class="btn btn-primary btn-sm" onclick="insNew()">${latest ? '+ New Assessment' : 'Start Assessment'}</button>
  </div>`;
  if (latest) {
    const col = latest.score >= 75 ? 'var(--green)' : latest.score >= 50 ? 'var(--amber)' : 'var(--red)';
    const band = latest.score >= 75 ? 'Strong Posture' : latest.score >= 60 ? 'Moderate Risk' : latest.score >= 40 ? 'Elevated Risk' : 'High Risk';
    const bCls = latest.score >= 75 ? 'band-high' : latest.score >= 60 ? 'band-mid' : 'band-low';
    h += `<div class="score-hero-ins">
      <div>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:4px">Current Score — ${currentOrg.name}</div>
        <div class="score-big" style="color:${col}">${latest.score}<span>/100</span></div>
        <div class="score-band ${bCls}">${band}</div>
        <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
          <span class="badge b-navy">Security: ${latest.secPct}%</span>
          <span class="badge b-cyan">Insurance: ${latest.insPct}%</span>
          <span style="font-size:10px;color:rgba(255,255,255,0.4)">Last run: ${latest.date}</span>
          <span style="font-size:10px;color:rgba(7,209,242,0.7)">● Saved to database</span>
        </div>
      </div>
      ${runs.length > 1 ? `<div style="flex:1;min-width:160px;max-width:220px"><canvas id="trendChart" height="70"></canvas></div>` : ''}
    </div>`;
  }
  INS_SECTIONS.forEach(sec => {
    const isOpen = insState.openPanels[sec.id];
    const sp = insAnswered(sec) === sec.questions.length ? Math.round(insSecScore(sec) / insSecMax(sec) * 100) : null;
    const ip = insAnswered(sec) === sec.questions.length ? Math.round(insInsScore(sec) / insInsMax(sec) * 100) : null;
    const avg = sp !== null ? Math.round(sp * 0.4 + ip * 0.6) : null;
    const pillCls = avg === null ? 'b-gray' : avg >= 70 ? 'b-green' : avg >= 40 ? 'b-amber' : 'b-red';
    h += `<div class="survey-panel">
      <div class="sph" onclick="insToggle('${sec.id}')">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:14px">${sec.icon}</span>
          <div><div style="font-size:13px;font-weight:700">${sec.name}</div>
          <div style="font-size:10px;color:var(--muted)">${sec.questions.length} questions · ${insAnswered(sec)}/${sec.questions.length} answered</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge ${pillCls}">${avg !== null ? avg + '%' : 'Not started'}</span>
          <span style="color:var(--muted);font-size:12px">${isOpen ? '▴' : '▾'}</span>
        </div>
      </div>
      <div class="spb${isOpen ? ' open' : ''}">
        ${sec.questions.map(q => {
          const sel = insState.answers[q.id];
          return `<div style="margin-bottom:1rem">
            <div style="font-size:13px;font-weight:700;margin-bottom:3px">${q.text}</div>
            ${q.sub ? `<div style="font-size:11px;color:var(--muted);margin-bottom:5px">${q.sub}</div>` : ''}
            <div style="display:flex;gap:4px;margin-bottom:6px;flex-wrap:wrap">
              <span class="badge b-navy">Security: ${q.secW}</span>
              <span class="badge b-cyan">Insurance: ${q.insW}</span>
            </div>
            ${q.options.map(o => {
              const sc = Math.round(o.s * 100);
              const bc = sc >= 80 ? 'b-green' : sc >= 40 ? 'b-amber' : 'b-red';
              return `<label class="mini-opt${sel === o.s ? ' sel' : ''}">
                <input type="radio" name="${q.id}" value="${o.s}" ${sel === o.s ? 'checked' : ''} onchange="insAnswer('${q.id}',${o.s})">
                ${o.t}<span class="badge ${bc}" style="margin-left:auto">${sc}%</span>
              </label>`;
            }).join('')}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  });
  if (insAllDone()) {
    const r = insCalc();
    const band = r.score >= 75 ? 'Strong Posture' : r.score >= 60 ? 'Moderate Risk' : r.score >= 40 ? 'Elevated Risk' : 'High Risk';
    const gaps = INS_SAVINGS.filter(sv => (insState.answers[sv.q] || 0) < 0.8);
    h += `<div style="background:var(--navy);border-radius:10px;padding:1rem 1.25rem;margin-top:0.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:2px">Assessment complete — ${currentOrg.name}</div>
        <div style="font-size:20px;font-weight:700;color:#fff">${r.score}/100 — <span style="font-size:12px;color:rgba(255,255,255,0.5)">${band}</span></div>
        <div style="display:flex;gap:6px;margin-top:4px">
          <span class="badge b-navy">Security: ${r.secPct}%</span>
          <span class="badge b-cyan">Insurance: ${r.insPct}%</span>
        </div>
      </div>
      <button class="btn btn-cyan" id="saveBtn" onclick="insSave()">Save to Database</button>
    </div>`;
    if (gaps.length) {
      h += `<div class="savings-box" style="margin-top:0.75rem">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--cyan2)">Estimated premium savings available</div>
        <div class="savings-grid">${gaps.slice(0, 6).map(sv => `
          <div class="sav-card">
            <div style="font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:2px">${sv.label}</div>
            <div style="font-size:17px;font-weight:700;color:#fff">${sv.pct}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.4)">${sv.annual}/yr</div>
          </div>`).join('')}
        </div>
      </div>`;
    }
  }
  return h;
}

function insToggle(id) { insState.openPanels[id] = !insState.openPanels[id]; renderMain(); }
function insAnswer(qid, score) {
  insState.answers[qid] = score;
  const sec = INS_SECTIONS.find(s => s.questions.some(q => q.id === qid));
  if (sec && !insState.openPanels[sec.id]) insState.openPanels[sec.id] = true;
  renderMain();
}
function insNew() { insState = { answers: {}, openPanels: { [INS_SECTIONS[0].id]: true } }; renderMain(); }

async function insSave() {
  const r = insCalc();
  const today = new Date().toISOString().split('T')[0];
  const btn = document.getElementById('saveBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Saving…'; }
  try {
    await sb.saveAssessment({ org_id: currentOrg.id, module: 'insurance', score: r.score, sec_pct: r.secPct, ins_pct: r.insPct, answers: insState.answers, assessed_at: today });
    if (!orgAssessments[currentOrg.id]) orgAssessments[currentOrg.id] = {};
    if (!orgAssessments[currentOrg.id].insurance) orgAssessments[currentOrg.id].insurance = [];
    orgAssessments[currentOrg.id].insurance.push({ date: today, score: r.score, secPct: r.secPct, insPct: r.insPct });
    insState = { answers: {}, openPanels: {} };
    toast(`✓ Score saved for ${currentOrg.name}`, '#15803d');
    buildNav(); renderMain();
  } catch (e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Save to Database'; }
  }
}

function drawTrend() {
  const runs = (orgAssessments[currentOrg?.id] || {}).insurance || [];
  if (runs.length < 2) return;
  setTimeout(() => {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 200; canvas.width = W; const H = 70;
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
      ctx.fillStyle = '#fff'; ctx.font = 'bold 9px Kanit,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(s, px(i), py(s) - 7);
    });
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '9px Kanit,sans-serif';
    runs.forEach((r, i) => { ctx.textAlign = 'center'; ctx.fillText(r.date.slice(5), px(i), H); });
  }, 80);
}
