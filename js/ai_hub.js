// ============================================================
// AI Readiness Hub — aggregated view of the unified AI governance assessment
// ============================================================

function renderAiHub() {
  const orgId = currentOrg?.id;
  const runs = (orgAssessments[orgId] || {})['ai_unified'] || [];

  function latestRun(arr) {
    if (!arr.length) return null;
    return [...arr].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
  }

  const latest = latestRun(runs);
  const answers = latest
    ? Object.fromEntries(Object.entries(latest.answers || {}).filter(([k]) => !k.startsWith('_')))
    : {};
  const fw = latest ? aiuFrameworksFromRun(latest) : { nist: true, iso: true };
  const scores = latest ? aiuCalcScore(answers, fw) : { overall: null, nist: null, iso: null };
  const groupScores = latest ? aiuCalcGroupScores(answers, fw) : [];
  const gaps = latest ? aiuWeightedGaps(answers, fw) : [];
  const top3 = gaps.slice(0, 3);

  const scoreColor = aiuScoreColor;
  const scoreBand  = aiuScoreBand;

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🤖 AI Readiness Hub</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name || '')} · NIST AI RMF v1.0 × ISO/IEC 42001:2023 cross-walk assessment</div>
    </div>
    <button class="btn btn-cyan btn-sm" onclick="setNav('ai_unified')">
      ${latest ? '📊 Open Assessment' : '+ Start AI Assessment'}
    </button>
  </div>

  <!-- Score hero -->
  <div class="score-hero-ins" style="margin-bottom:1.25rem">
    <div style="flex:1">
      <div style="font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:6px">Combined AI Governance Score</div>
      <div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap">
        <div>
          <div class="score-big" style="color:#fff">${scores.overall !== null ? scores.overall : '—'}<span style="font-size:18px">${scores.overall !== null ? '%' : ''}</span></div>
          ${scores.overall !== null
            ? `<div style="font-size:11px;font-weight:700;margin-top:4px;padding:3px 10px;border-radius:20px;display:inline-block;background:rgba(255,255,255,.08);color:${scoreColor(scores.overall)}">${scoreBand(scores.overall)}</div>`
            : `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">Run your first AI governance assessment to see your score</div>`}
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          ${fw.nist !== false && scores.nist !== null
            ? `<div>
                <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">NIST AI RMF</div>
                <div style="font-size:26px;font-weight:800;color:#93c5fd;line-height:1">${scores.nist}%</div>
               </div>` : ''}
          ${fw.iso !== false && scores.iso !== null
            ? `<div>
                <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">ISO 42001</div>
                <div style="font-size:26px;font-weight:800;color:#6ee7b7;line-height:1">${scores.iso}%</div>
               </div>` : ''}
          ${runs.length > 0
            ? `<div>
                <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">Assessments</div>
                <div style="font-size:26px;font-weight:800;color:rgba(255,255,255,.7);line-height:1">${runs.length}</div>
               </div>` : ''}
        </div>
      </div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.25rem">`;

  // ── Group breakdown card ──────────────────────────────────────
  html += `
    <div class="card" style="padding:1.1rem">
      <div style="font-size:13px;font-weight:700;margin-bottom:.9rem">Domain Breakdown</div>
      ${groupScores.filter(g => g.pct !== null).length
        ? groupScores.filter(g => g.pct !== null).map(g => {
            const m = AI_GROUP_META[g.grp];
            return `<div style="margin-bottom:7px">
              <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px">
                <span style="font-size:10px;font-weight:700;color:var(--text)">${m.icon} ${m.label}</span>
                <span style="font-size:10px;font-weight:700;color:${scoreColor(g.pct)}">${g.pct}% <span style="font-size:9px;color:var(--muted);font-weight:400">${g.answered}/${g.total}</span></span>
              </div>
              <div style="height:5px;background:var(--bg);border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${g.pct}%;background:${m.color};border-radius:3px;transition:width .4s"></div>
              </div>
            </div>`;
          }).join('')
        : `<div style="text-align:center;padding:1.5rem 0;color:var(--muted)">
            <div style="font-size:24px;margin-bottom:.5rem">🤖</div>
            <div style="font-size:11px">No assessments yet</div>
          </div>`}
      <div style="margin-top:.9rem;display:flex;gap:6px">
        <button class="btn btn-cyan btn-sm" onclick="setNav('ai_unified')">${latest ? '📊 Open Assessment' : '+ Start Now'}</button>
        ${latest ? `<button class="btn btn-outline btn-sm" onclick="setNav('ai_unified');aiuOpenGapReport(0)">🔍 Gap Report</button>` : ''}
      </div>
    </div>`;

  // ── Top priority gaps card ────────────────────────────────────
  html += `
    <div class="card" style="padding:1.1rem">
      <div style="font-size:13px;font-weight:700;margin-bottom:.9rem">⭐ Top Priority Gaps</div>
      ${top3.length
        ? top3.map((g, i) => {
            const m = AI_GROUP_META[g.grp];
            const wColor = AI_WEIGHT_COLORS[g.weight];
            return `<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:.65rem;padding:.5rem .6rem;border-radius:6px;background:${g.answer==='no'?'#fff7f7':'#fffbeb'};border:1px solid ${g.answer==='no'?'#fecaca':'#fde68a'}">
              <div style="font-size:15px;font-weight:900;color:${wColor};min-width:18px;text-align:center;line-height:1.3">${i+1}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:10px;font-weight:700;color:${m.color};margin-bottom:1px">${g.id} · <span style="color:${wColor}">${AI_WEIGHT_LABELS[g.weight]}</span></div>
                <div style="font-size:11px;font-weight:700;color:var(--text)">${escH(g.title)}</div>
                <div style="display:flex;gap:3px;margin-top:3px;flex-wrap:wrap">
                  ${(g.nist||[]).map(id=>`<span style="font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;background:#dbeafe;color:#1e40af">${id}</span>`).join('')}
                  ${(g.iso||[]).map(id=>`<span style="font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;background:#ccfbf1;color:#0f766e">${id}</span>`).join('')}
                </div>
              </div>
            </div>`;
          }).join('')
        : `<div style="text-align:center;padding:1.5rem 0;color:var(--muted)">
            ${latest
              ? `<div style="font-size:11px">🎉 No gaps found in latest assessment</div>`
              : `<div style="font-size:11px">Complete an assessment to see priority gaps</div>`}
          </div>`}
      ${gaps.length > 3
        ? `<div style="font-size:10px;color:var(--muted);margin-top:.5rem">+ ${gaps.length - 3} more gaps — open the full Gap Report</div>` : ''}
    </div>`;

  html += `</div>`;

  // ── Framework info bar ────────────────────────────────────────
  html += `
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:.75rem;margin-bottom:1.25rem">
    <div style="padding:.85rem;border-radius:8px;background:var(--card);border:1px solid var(--border)">
      <div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:4px">🏛️ NIST AI RMF v1.0</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:.65rem">AI Risk Management Framework by NIST — covers GOVERN, MAP, MEASURE, and MANAGE functions. 68 sub-categories.</div>
      <div style="font-size:11px;font-weight:700;color:${scores.nist!==null ? scoreColor(scores.nist) : 'var(--muted)'}">
        ${scores.nist !== null ? scores.nist + '% — ' + scoreBand(scores.nist) : 'Not yet assessed'}
      </div>
    </div>
    <div style="padding:.85rem;border-radius:8px;background:var(--card);border:1px solid var(--border)">
      <div style="font-size:12px;font-weight:700;color:#0f766e;margin-bottom:4px">📋 ISO/IEC 42001:2023</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:.65rem">AI Management System standard — defines requirements for an AIMS covering governance, risk, performance, and continual improvement.</div>
      <div style="font-size:11px;font-weight:700;color:${scores.iso!==null ? scoreColor(scores.iso) : 'var(--muted)'}">
        ${scores.iso !== null ? scores.iso + '% — ' + scoreBand(scores.iso) : 'Not yet assessed'}
      </div>
    </div>
    <div style="padding:.85rem;border-radius:8px;background:var(--card);border:1px solid var(--border)">
      <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px">🧩 Unified Cross-Walk</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:.65rem">44 harmonized questions map to both frameworks simultaneously. Each answer contributes to both NIST AI RMF and ISO 42001 scores via weighted gap analysis.</div>
      <button class="btn btn-outline btn-sm" onclick="setNav('ai_unified')">${latest ? '📊 View Latest' : '+ Start Assessment'} →</button>
    </div>
  </div>`;

  // ── History table ──────────────────────────────────────────────
  if (runs.length) {
    html += `<div class="card" style="padding:1.1rem">
      <div style="font-size:13px;font-weight:700;margin-bottom:.75rem">Assessment History</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="border-bottom:2px solid var(--border)">
          <th style="text-align:left;padding:6px 10px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Date</th>
          <th style="text-align:center;padding:6px 8px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Overall</th>
          <th style="text-align:center;padding:6px 8px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">NIST</th>
          <th style="text-align:center;padding:6px 8px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">ISO</th>
          <th style="text-align:left;padding:6px 10px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Conducted By</th>
          <th style="text-align:right;padding:6px 10px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Actions</th>
        </tr></thead>
        <tbody>
          ${[...runs].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map((r, i) => {
            const cleanAns = Object.fromEntries(Object.entries(r.answers||{}).filter(([k])=>!k.startsWith('_')));
            const runFw = aiuFrameworksFromRun(r);
            const sc = aiuCalcScore(cleanAns, runFw);
            return `<tr style="border-bottom:1px solid var(--border)">
              <td style="padding:7px 10px;font-weight:700">${r.date||'—'}</td>
              <td style="padding:7px 8px;text-align:center">
                <span style="font-size:14px;font-weight:700;color:${scoreColor(sc.overall)}">${sc.overall??'—'}</span>${sc.overall!==null?'<span style="font-size:10px;color:var(--muted)">%</span>':''}
              </td>
              <td style="padding:7px 8px;text-align:center">
                ${runFw.nist!==false && sc.nist!==null ? `<span style="font-size:12px;font-weight:700;color:#1d4ed8">${sc.nist}%</span>` : '<span style="color:var(--muted)">—</span>'}
              </td>
              <td style="padding:7px 8px;text-align:center">
                ${runFw.iso!==false && sc.iso!==null ? `<span style="font-size:12px;font-weight:700;color:#0f766e">${sc.iso}%</span>` : '<span style="color:var(--muted)">—</span>'}
              </td>
              <td style="padding:7px 10px;color:var(--muted)">${escH(r.conductedBy||'—')}</td>
              <td style="padding:7px 10px;text-align:right">
                <button class="btn btn-outline btn-sm" onclick="setNav('ai_unified')" style="font-size:11px;padding:3px 8px">Open →</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
  }

  return html;
}
