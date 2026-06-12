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

  // ── AI Maturity Pyramid ──────────────────────────────────────
  html += `
  <div class="card" style="padding:1.1rem;margin-bottom:1.25rem">
    <div style="font-size:13px;font-weight:700;margin-bottom:.75rem">🔺 AI Governance Maturity Pyramid <span style="font-size:10px;font-weight:400;color:var(--muted);margin-left:6px">NIST AI RMF · click any segment to set status</span></div>
    <div style="display:grid;grid-template-columns:1fr 320px;border:1px solid var(--border);border-radius:8px;overflow:hidden">
      <div style="padding:10px 14px;background:var(--bg);display:flex;flex-direction:column;min-height:480px">
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:6px">
          <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid #6b35c8;color:#6b35c8;background:rgba(107,53,200,.08);font-family:monospace;text-transform:uppercase;letter-spacing:.05em">GOVERN</span>
          <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid #0d9488;color:#0d9488;background:rgba(13,148,136,.08);font-family:monospace;text-transform:uppercase;letter-spacing:.05em">MAP</span>
          <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid #d97706;color:#d97706;background:rgba(217,119,6,.08);font-family:monospace;text-transform:uppercase;letter-spacing:.05em">MEASURE</span>
          <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid #2e7ab0;color:#2e7ab0;background:rgba(46,122,176,.08);font-family:monospace;text-transform:uppercase;letter-spacing:.05em">MANAGE</span>
          <span style="flex:1;min-width:12px"></span>
          <span style="font-size:10px;color:var(--muted);display:flex;gap:10px;flex-wrap:wrap">
            <span><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#c00000;margin-right:3px;vertical-align:middle"></span>Not Addressed</span>
            <span><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#e8a000;margin-right:3px;vertical-align:middle"></span>Partial</span>
            <span><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#2e7ab0;margin-right:3px;vertical-align:middle"></span>In Progress</span>
            <span><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#00af50;margin-right:3px;vertical-align:middle"></span>Implemented</span>
          </span>
        </div>
        <svg id="aihub-pyr" viewBox="-120 0 1540 710" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="flex:1;min-height:380px;width:100%;display:block"></svg>
        <p style="font-size:10px;color:var(--muted);margin-top:4px;text-align:center;font-family:monospace">click any segment to cycle: not addressed → partial → in progress → implemented</p>
      </div>
      <div style="background:var(--card);border-left:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden">
        <div id="aihub-detail-panel" style="flex:1;overflow-y:auto;display:flex;flex-direction:column">
          <div id="aihub-detail-empty" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--muted);font-size:11px;padding:24px;text-align:center">
            <div style="font-size:28px;opacity:.25">🔺</div>
            <div>Select a segment from the pyramid</div>
            <div style="font-size:9px;margin-top:2px;opacity:.6;font-family:monospace">to view NIST AI RMF details and set maturity status</div>
          </div>
          <div id="aihub-detail-content" style="display:none;padding:14px;flex:1;flex-direction:column;gap:10px">
            <div id="aihub-d-name" style="font-size:14px;font-weight:700;color:var(--text);line-height:1.3"></div>
            <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
              <span id="aihub-d-tier-badge" style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid;font-family:monospace;text-transform:uppercase;letter-spacing:.06em"></span>
              <span id="aihub-d-rmf-badge" style="font-size:9px;font-weight:600;padding:2px 7px;border-radius:4px;border:1px solid var(--border);color:var(--muted);font-family:monospace;background:var(--bg)"></span>
              <span id="aihub-d-iso-badge" style="font-size:9px;font-weight:600;padding:2px 7px;border-radius:4px;border:1px solid #0d9488;color:#0d9488;font-family:monospace;background:rgba(13,148,136,.08)"></span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:6px">
              <span style="font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);min-width:42px;padding-top:5px;font-family:monospace">Status</span>
              <div id="aihub-d-status-btns" style="display:flex;gap:4px;flex-wrap:wrap"></div>
            </div>
            <div style="height:1px;background:var(--border)"></div>
            <div>
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:5px;font-family:monospace">Why this matters</div>
              <div id="aihub-d-commentary" style="font-size:11px;color:var(--muted);line-height:1.7"></div>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid var(--border);padding:10px 12px;flex-shrink:0">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:6px">
            <div style="border-radius:5px;padding:5px 2px;text-align:center;background:#c00000;border:2px solid #960000">
              <div id="aihub-s-r" style="font-size:15px;font-weight:700;font-family:monospace;color:#fff">0</div>
              <div style="font-size:8px;color:rgba(255,255,255,.8);line-height:1.2">Not Addressed</div>
            </div>
            <div style="border-radius:5px;padding:5px 2px;text-align:center;background:#e8a000;border:2px solid #b87800">
              <div id="aihub-s-y" style="font-size:15px;font-weight:700;font-family:monospace;color:#fff">0</div>
              <div style="font-size:8px;color:rgba(255,255,255,.8);line-height:1.2">Partial</div>
            </div>
            <div style="border-radius:5px;padding:5px 2px;text-align:center;background:#2e7ab0;border:2px solid #1e5a8a">
              <div id="aihub-s-b" style="font-size:15px;font-weight:700;font-family:monospace;color:#fff">0</div>
              <div style="font-size:8px;color:rgba(255,255,255,.8);line-height:1.2">In Progress</div>
            </div>
            <div style="border-radius:5px;padding:5px 2px;text-align:center;background:#00af50;border:2px solid #007a38">
              <div id="aihub-s-g" style="font-size:15px;font-weight:700;font-family:monospace;color:#fff">0</div>
              <div style="font-size:8px;color:rgba(255,255,255,.8);line-height:1.2">Implemented</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="flex:1;height:5px;background:var(--bg);border-radius:3px;overflow:hidden">
              <div id="aihub-mat-fill" style="height:100%;width:0%;background:linear-gradient(90deg,#c00000,#e8a000,#2e7ab0,#00af50);border-radius:3px;transition:width .35s ease"></div>
            </div>
            <div id="aihub-mat-pct" style="font-size:11px;font-weight:700;font-family:monospace;color:var(--text);min-width:28px;text-align:right">0%</div>
          </div>
          <div id="aihub-data-src" style="font-size:9px;color:var(--muted);margin-top:5px;text-align:center;font-style:italic"></div>
        </div>
      </div>
    </div>
  </div>
  <div id="aihub-tip" style="position:fixed;background:var(--card);border:1px solid var(--border);color:var(--text);font-size:11px;padding:4px 8px;border-radius:5px;pointer-events:none;display:none;z-index:9999;box-shadow:0 4px 14px rgba(0,0,0,.15);max-width:200px;line-height:1.4"></div>`;

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

// ============================================================
// AI Maturity Pyramid — scoped init, called after renderAiHub
// ============================================================
function initAiMaturityPyramid() {
  const svg = document.getElementById('aihub-pyr');
  if (!svg) return;

  const CATALOGUE = {
    'AI Policy & Accountability':              { rmf:'GOVERN 1.1',              iso:'ISO 42001 §5.2 / §6.1',         tier:'Governing',  commentary:`The foundation of responsible AI begins with formal policy. Without documented policies that assign clear accountability for AI systems — who owns them, who is responsible when they fail, and what values they must uphold — risk cannot be systematically managed. NIST AI RMF GOVERN 1.1 requires organisations to establish and maintain policies covering AI risk management roles, responsibilities, and authorities. This means naming an AI owner for each deployed system, defining acceptable use, and establishing a process for escalating AI-related concerns. For businesses deploying AI in customer-facing or operational roles, a policy gap is a liability gap.` },
    'AI Roles & Training':                     { rmf:'GOVERN 2.2',              iso:'ISO 42001 §7.2 / §7.3',         tier:'Governing',  commentary:`AI systems are only as trustworthy as the people overseeing them. NIST AI RMF GOVERN 2.2 requires that staff with AI responsibilities receive appropriate training to understand AI risks, limitations, and their own role in governance. Without role-appropriate AI literacy, policies become paper exercises and risks go unrecognised. Building foundational AI awareness across the organisation is the single most scalable investment in responsible AI you can make.` },
    'AI Inventory & Use-Case Register':        { rmf:'MAP 1.1',                 iso:'ISO 42001 §8.2 / Annex A.5.1', tier:'Mapping',    commentary:`You cannot govern what you have not mapped. NIST AI RMF MAP 1.1 requires organisations to identify and document all AI systems in use — including third-party AI embedded in SaaS tools — along with their intended purpose, data inputs, and decision scope. An AI inventory is not bureaucracy; it is the prerequisite for every other governance activity.` },
    'Contextual Risk & Impact Assessment':     { rmf:'MAP 2.1 / MAP 3.5',       iso:'ISO 42001 §6.1 / Annex A.5.4', tier:'Mapping',    commentary:`Not all AI risk is equal, and not all AI contexts carry the same stakes. NIST AI RMF MAP 2.1 and MAP 3.5 require organisations to assess the context in which each AI system operates — including the potential for harm to individuals, groups, or operations if the system behaves unexpectedly. Impact assessments ground risk management in real-world consequences rather than abstract checklists.` },
    'Third-Party AI Risk':                     { rmf:'MAP 5.1',                 iso:'ISO 42001 §8.4 / Annex A.10.1',tier:'Mapping',    commentary:`Most organisations use far more third-party AI than they build themselves — through SaaS platforms, embedded analytics, and vendor-supplied tools. NIST AI RMF MAP 5.1 requires organisations to assess AI risk in their supply chain. Third-party AI risk assessments should be part of every vendor onboarding and renewal process.` },
    'Bias & Fairness Testing':                 { rmf:'MEASURE 2.5',             iso:'ISO 42001 §9.1 / Annex A.6.1', tier:'Measuring',  commentary:`AI systems can encode and amplify biases present in training data, producing outcomes that are unfair, discriminatory, or simply inaccurate for certain groups. NIST AI RMF MEASURE 2.5 requires organisations to test AI systems for bias and fairness relevant to their deployment context. Bias testing is not a one-time exercise — models drift, data changes, and context evolves.` },
    'Explainability & Transparency':           { rmf:'MEASURE 2.6',             iso:'ISO 42001 §8.5 / Annex A.6.2', tier:'Measuring',  commentary:`When an AI system makes or informs a consequential decision, the people affected and those accountable for outcomes need to understand why. NIST AI RMF MEASURE 2.6 addresses explainability — the ability to describe, in meaningful terms, how an AI system reached an output. Explainability also supports compliance with privacy regulations that require meaningful information about automated decision-making.` },
    'Performance Monitoring & KPIs':           { rmf:'MEASURE 1.1 / MEASURE 2.1',iso:'ISO 42001 §9.1 / §10.1',      tier:'Measuring',  commentary:`AI systems degrade. Models trained on yesterday's data may perform poorly on today's reality — a phenomenon known as model drift. NIST AI RMF MEASURE 1.1 and MEASURE 2.1 require organisations to establish measurable performance indicators for AI systems and monitor them on an ongoing basis. Proactive monitoring is the difference between catching drift early and discovering it through a failure.` },
    'AI Incident Response':                    { rmf:'MANAGE 3.1',              iso:'ISO 42001 §10.1 / Annex A.9.3',tier:'Managing',   commentary:`AI systems will fail, behave unexpectedly, or produce harmful outputs — the question is whether your organisation is prepared to respond. NIST AI RMF MANAGE 3.1 requires organisations to have documented processes for detecting, escalating, and responding to AI incidents, including the ability to disable or override AI systems when necessary.` },
    'Decommission & Model Lifecycle':          { rmf:'MANAGE 4.1',              iso:'ISO 42001 §8.6 / Annex A.9.4', tier:'Managing',   commentary:`AI systems have lifecycles. Models that were fit for purpose when deployed may become outdated, biased, or misaligned with changed business context over time. NIST AI RMF MANAGE 4.1 requires organisations to have processes for retiring AI systems that no longer meet performance, fairness, or risk standards.` },
    'Human Oversight Controls':                { rmf:'MANAGE 2.4',              iso:'ISO 42001 §8.5 / Annex A.8.1', tier:'Managing',   commentary:`Automation should amplify human judgement, not replace it in contexts where human oversight is critical. NIST AI RMF MANAGE 2.4 requires organisations to implement controls ensuring that humans can intervene in AI-assisted decisions — particularly where outcomes are high-stakes or irreversible.` },
    'Continuous Improvement & Feedback Loops': { rmf:'GOVERN (continuous)',     iso:'ISO 42001 §10.2 / §10.3',       tier:'Optimizing', commentary:`Mature AI governance is not static. NIST AI RMF's GOVERN function includes requirements for continuous improvement — using incident data, audit findings, stakeholder feedback, and performance metrics to iteratively refine both AI systems and the governance processes surrounding them.` },
    'AI Governance Board / RACI':              { rmf:'GOVERN 1.2',              iso:'ISO 42001 §5.3 / §6.2',         tier:'Optimizing', commentary:`At the optimising level of AI maturity, governance is embedded in organisational structure. NIST AI RMF GOVERN 1.2 calls for defined, cross-functional accountability for AI risk — including executive sponsorship, legal and compliance involvement, and operational representation.` },
    'AI Supplier Transparency Requirements':   { rmf:'GOVERN 6.1',              iso:'ISO 42001 §8.4 / Annex A.10.2',tier:'Governing',  commentary:`Organisations deploying AI are increasingly responsible for ensuring the systems they procure meet minimum transparency and documentation standards. NIST AI RMF GOVERN 6.1 requires that AI risk management expectations be flowed down to AI providers — through contractual requirements, due diligence questionnaires, and ongoing attestation.` },
    'Trustworthy AI Principles':               { rmf:'GOVERN 1.7',              iso:'ISO 42001 §4.1 / Annex A.2.2', tier:'Governing',  commentary:`NIST AI RMF is built on a framework of AI trustworthiness characteristics: valid, reliable, safe, secure, explainable, fair, privacy-preserving, and accountable. GOVERN 1.7 requires organisations to formally adopt and communicate their AI values and principles as operational commitments that shape how AI is evaluated, deployed, and retired.` },
    'Data Governance for AI':                  { rmf:'MAP 3.2',                 iso:'ISO 42001 §8.4 / Annex A.8.3', tier:'Mapping',    commentary:`AI systems are only as trustworthy as the data they are built on and operate with. NIST AI RMF MAP 3.2 requires organisations to understand the provenance, quality, and representativeness of data used in AI systems. Poor data governance leads to biased models, inaccurate outputs, and privacy violations.` },
    'Red-Teaming & Adversarial Testing':       { rmf:'MEASURE 2.7 / MEASURE 2.9',iso:'ISO 42001 §9.1 / Annex A.9.2',tier:'Measuring',  commentary:`AI systems can be deliberately manipulated through adversarial inputs — crafted data designed to cause misclassification, extract sensitive information, or trigger harmful outputs. NIST AI RMF MEASURE 2.7 and MEASURE 2.9 address the need for adversarial testing — structured attempts to find and exploit weaknesses in AI systems before they are discovered by malicious actors.` },
    'AI Risk Register':                        { rmf:'MAP 5.2',                 iso:'ISO 42001 §6.1',                tier:'Mapping',    commentary:`Risk cannot be managed from memory. NIST AI RMF MAP 5.2 requires organisations to document identified AI risks in a structured register — capturing the risk description, likelihood, potential impact, current controls, and ownership. An AI risk register is the operational backbone of an AI governance programme.` },
    'AI Acceptable Use Policy':                { rmf:'GOVERN 1.1',              iso:'ISO 42001 §5.2 / §6.1.2',       tier:'Governing',  commentary:`An AI Acceptable Use Policy defines the boundaries within which staff, contractors, and systems may deploy or interact with AI tools — covering permitted use cases, prohibited applications, data handling expectations, and accountability for outputs. Without an acceptable use policy, AI adoption outpaces governance.` },
    'Data Classification Policy':              { rmf:'GOVERN 1.6 / MAP 3.2',    iso:'ISO 42001 §8.4 / Annex A.8.3', tier:'Governing',  commentary:`A data classification policy establishes categories of data sensitivity — defining what constitutes personal, confidential, regulated, or public information — and sets handling rules for each category. For organisations where AI may process guest PII, payment data, and behavioural analytics simultaneously, data classification is the policy layer that determines what AI systems are permitted to access.` },
    'Information Security Policy (AI scope)':  { rmf:'GOVERN 1.1',              iso:'ISO 42001 §5.1 / Annex A.6.2', tier:'Governing',  commentary:`Existing information security policies must be explicitly scoped to address AI systems. AI introduces unique security considerations: model extraction attacks, adversarial inputs, training data poisoning, and the risk of sensitive data being embedded in model weights. NIST AI RMF GOVERN 1.1 requires that AI risk management be integrated with existing organisational security frameworks.` },
    'AI Ethics & Principles Statement':        { rmf:'GOVERN 1.7',              iso:'ISO 42001 §4.1 / Annex A.2.2', tier:'Governing',  commentary:`An AI Ethics and Principles Statement articulates the values that govern how your organisation develops, deploys, and retires AI — covering fairness, transparency, accountability, privacy, and human oversight. A published principles statement serves as the reference point for all governance decisions and signals your commitment to responsible AI to customers, regulators, and partners.` }
  };

  const TIERS = [
    { label:'Optimizing', rmfColor:'#6b35c8', cols:[
      { type:'seg', id:'cont_improve', name:'Continuous Improvement',  sku:'Continuous Improvement & Feedback Loops' },
      { type:'seg', id:'gov_board',    name:'Board RACI',               sku:'AI Governance Board / RACI' }
    ]},
    { label:'Managing', rmfColor:'#2e7ab0', cols:[
      { type:'seg', id:'ai_irt',   name:'AI Incident Response',           sku:'AI Incident Response' },
      { type:'seg', id:'human_ctl',name:'Human Oversight Controls',       sku:'Human Oversight Controls' },
      { type:'seg', id:'decom',    name:'Decommission & Model Lifecycle', sku:'Decommission & Model Lifecycle' }
    ]},
    { label:'Measuring', rmfColor:'#d97706', cols:[
      { type:'seg', id:'bias_fair', name:'Bias & Fairness Testing',           sku:'Bias & Fairness Testing' },
      { type:'seg', id:'explain',   name:'Explainability & Transparency',     sku:'Explainability & Transparency' },
      { type:'seg', id:'perf_mon',  name:'Performance Monitoring & KPIs',     sku:'Performance Monitoring & KPIs' },
      { type:'seg', id:'red_team',  name:'Red-Teaming & Adversarial Testing', sku:'Red-Teaming & Adversarial Testing' }
    ]},
    { label:'Mapping', rmfColor:'#0d9488', cols:[
      { type:'seg', id:'ai_inv',  name:'AI Inventory & Use-Case Register',    sku:'AI Inventory & Use-Case Register' },
      { type:'seg', id:'ctx_risk',name:'Contextual Risk & Impact Assessment', sku:'Contextual Risk & Impact Assessment' },
      { type:'seg', id:'tp_ai',   name:'Third-Party AI Risk',                 sku:'Third-Party AI Risk' },
      { type:'seg', id:'data_gov',name:'Data Governance for AI',              sku:'Data Governance for AI' },
      { type:'seg', id:'ai_reg',  name:'AI Risk Register',                    sku:'AI Risk Register' }
    ]},
    { label:'Governing', rmfColor:'#6b35c8', cols:[
      { type:'seg', id:'ai_policy',   name:'AI Policy & Accountability',             sku:'AI Policy & Accountability' },
      { type:'seg', id:'ai_roles',    name:'AI Roles & Training',                    sku:'AI Roles & Training' },
      { type:'seg', id:'ai_princ',    name:'Trustworthy AI Principles',              sku:'Trustworthy AI Principles' },
      { type:'seg', id:'ai_supplier', name:'AI Supplier Transparency',               sku:'AI Supplier Transparency Requirements' },
      { type:'seg', id:'ai_aup',      name:'AI Acceptable Use Policy',               sku:'AI Acceptable Use Policy' },
      { type:'seg', id:'data_class',  name:'Data Classification Policy',             sku:'Data Classification Policy' },
      { type:'seg', id:'infosec_ai',  name:'InfoSec Policy (AI scope)',               sku:'Information Security Policy (AI scope)' },
      { type:'seg', id:'ai_ethics',   name:'AI Ethics & Principles',                 sku:'AI Ethics & Principles Statement' }
    ]}
  ];

  const TIER_FILLS = [
    { base:'#6b35c8', dark:'#4e228f' },
    { base:'#2e7ab0', dark:'#1e5a8a' },
    { base:'#b45309', dark:'#92400e' },
    { base:'#0d9488', dark:'#0f766e' },
    { base:'#3730a3', dark:'#1e1a78' }
  ];

  const TIER_COLORS = {
    'Optimizing':{ bg:'#6b35c8', border:'#4e228f', text:'#fff' },
    'Managing':  { bg:'#2e7ab0', border:'#1e5a8a', text:'#fff' },
    'Measuring': { bg:'#b45309', border:'#92400e', text:'#fff' },
    'Mapping':   { bg:'#0d9488', border:'#0f766e', text:'#fff' },
    'Governing': { bg:'#3730a3', border:'#1e1a78', text:'#fff' }
  };

  const ALL_SEGS = [];
  TIERS.forEach(tier => tier.cols.forEach(col => {
    if (col.type === 'seg') ALL_SEGS.push({ id: col.id, name: col.name, sku: col.sku });
  }));

  // Map each pyramid segment to the most relevant ai_unified control ID
  const PYRAMID_MAP = {
    'ai_policy':    'AIG-1.1',  // AI governance policy documented
    'ai_roles':     'AIG-3.3',  // AI competence and awareness program
    'ai_princ':     'AIG-3.2',  // Responsible AI culture and ethics
    'ai_supplier':  'AIG-2.5',  // AI vendor and supply chain risks evaluated
    'ai_aup':       'AIG-1.1',  // AI governance policy (AUP is part of it)
    'data_class':   'AIG-4.1',  // Data governance for AI inputs
    'infosec_ai':   'AIG-4.4',  // AI infrastructure secured and managed
    'ai_ethics':    'AIG-3.2',  // Responsible AI culture and ethics
    'ai_inv':       'AIG-1.5',  // AI program scope and context established
    'ctx_risk':     'AIG-2.4',  // AI impact assessment conducted
    'tp_ai':        'AIG-2.5',  // AI vendor and supply chain risks
    'data_gov':     'AIG-4.1',  // Data governance for AI inputs
    'ai_reg':       'AIG-2.2',  // AI risks documented and tracked
    'bias_fair':    'AIG-6.4',  // Bias and fairness testing conducted
    'explain':      'AIG-3.1',  // Human review of AI outputs
    'perf_mon':     'AIG-5.4',  // AI system performance monitored post-deployment
    'red_team':     'AIG-6.3',  // Adversarial testing and red-teaming
    'ai_irt':       'AIG-7.1',  // AI incident detection and response
    'human_ctl':    'AIG-3.1',  // Human review of AI outputs
    'decom':        'AIG-5.5',  // AI system decommissioning managed
    'cont_improve': 'AIG-7.4',  // Continual improvement of AI practices
    'gov_board':    'AIG-1.3',  // AI roles and accountability assigned
  };

  // Load latest ai_unified assessment answers to pre-populate state
  const _orgId = currentOrg?.id;
  const _runs = (orgAssessments[_orgId] || {})['ai_unified'] || [];
  const _latest = _runs.length ? [..._runs].sort((a, b) => (b.date||'').localeCompare(a.date||''))[0] : null;
  const _answers = _latest
    ? Object.fromEntries(Object.entries(_latest.answers||{}).filter(([k]) => !k.startsWith('_')))
    : {};

  const ANSWER_STATUS = { yes: 'green', partial: 'yellow', no: 'red' };

  const state = {};
  ALL_SEGS.forEach(s => {
    const ctrlId = PYRAMID_MAP[s.id];
    const answer = ctrlId ? _answers[ctrlId] : null;
    state[s.id] = ANSWER_STATUS[answer] || 'red';
  });

  const hasAssessment = _latest !== null;
  let selectedId = null;

  const STATUS_CYCLE = ['red','yellow','blue','green'];

  function getStatusFill(status) {
    if (status === 'red')    return '#c00000';
    if (status === 'yellow') return '#e8a000';
    if (status === 'blue')   return '#2e7ab0';
    if (status === 'green')  return '#00af50';
    return '#888';
  }
  function getStatusStroke(status) {
    return { red:'#960000', yellow:'#b87800', blue:'#1e5a8a', green:'#007a38' }[status] || '#555';
  }

  const W = 1400, TIP_Y = 28, BASE_Y = 690, HALF_W = 460, PAD = 5;
  const NT = TIERS.length, TH = (BASE_Y - TIP_Y) / NT;

  function tierBounds(ti) {
    const topY = TIP_Y + ti * TH, botY = topY + TH;
    const ft = (topY - TIP_Y) / (BASE_Y - TIP_Y), fb = (botY - TIP_Y) / (BASE_Y - TIP_Y);
    return { topY, botY, topHW: ft * HALF_W, botHW: fb * HALF_W };
  }

  function ns(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }

  function wrap(text, maxW, fs) {
    const max = Math.max(4, Math.floor(maxW / (fs * 0.52)));
    const words = text.split(' '); const lines = []; let cur = '';
    words.forEach(w => { const t = cur ? cur + ' ' + w : w; if (t.length > max && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur);
    return lines;
  }

  function drawWrapped(g, cx, cy, text, maxW, fs) {
    const lines = wrap(text, maxW, fs);
    const lh = fs * 1.25, tot = lines.length * lh;
    lines.forEach((line, li) => {
      const t = ns('text');
      t.setAttribute('x', cx); t.setAttribute('y', cy - tot / 2 + li * lh + lh * 0.78);
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#ffffff');
      t.setAttribute('font-size', fs); t.setAttribute('font-weight', '600');
      t.setAttribute('font-family', 'Kanit,sans-serif'); t.style.pointerEvents = 'none';
      t.textContent = line; g.appendChild(t);
    });
  }

  const tipEl = document.getElementById('aihub-tip');
  function moveTip(e) { tipEl.style.left = (e.clientX + 14) + 'px'; tipEl.style.top = (e.clientY - 32) + 'px'; }

  function renderPyramid() {
    svg.innerHTML = '';
    const cx = W / 2;
    TIERS.forEach((tier, ti) => {
      const { topY, botY, topHW, botHW } = tierBounds(ti);
      const tierWtop = topHW * 2, tierWbot = botHW * 2;
      const nCols = tier.cols.length;
      const colXtop = [], colXbot = [];
      for (let i = 0; i <= nCols; i++) {
        colXtop.push(cx - topHW + (i / nCols) * tierWtop);
        colXbot.push(cx - botHW + (i / nCols) * tierWbot);
      }
      const yt = topY + PAD, yb = botY - PAD;
      const APEX_GAP = 12;

      tier.cols.forEach((col, ci) => {
        const colFracL = ci / nCols - 0.5, colFracR = (ci + 1) / nCols - 0.5;
        const apexOffL = colFracL * APEX_GAP * 2, apexOffR = colFracR * APEX_GAP * 2;
        const _xtl = colXtop[ci] + PAD + apexOffL * Math.max(0, 1 - topHW / 40);
        const _xtr = colXtop[ci + 1] - PAD + apexOffR * Math.max(0, 1 - topHW / 40);
        const xtl = Math.min(_xtl, _xtr), xtr = Math.max(_xtl, _xtr);
        const xbl = colXbot[ci] + PAD, xbr = colXbot[ci + 1] - PAD;
        const midX = (xtl + xtr + xbl + xbr) / 4;
        const colW = (xtr - xtl + xbr - xbl) / 2;
        const status = state[col.id];
        const isSelected = selectedId === col.id;
        const g = ns('g');
        const poly = ns('polygon');
        poly.setAttribute('points', `${xtl},${yt} ${xtr},${yt} ${xbr},${yb} ${xbl},${yb}`);
        poly.setAttribute('fill', getStatusFill(status));
        poly.setAttribute('stroke', isSelected ? '#ffffff' : getStatusStroke(status));
        poly.setAttribute('stroke-width', isSelected ? '3.5' : '1');
        g.appendChild(poly);
        const midY = (yt + yb) / 2;
        const fs = Math.min(11, Math.max(7, (yb - yt) / 4.5));
        drawWrapped(g, midX, midY, col.name, colW - 6, fs);
        g.style.cursor = 'pointer';
        g.addEventListener('click', () => selectSeg(col.id));
        g.addEventListener('mouseenter', e => { tipEl.style.display = 'block'; tipEl.textContent = col.name; moveTip(e); });
        g.addEventListener('mousemove', moveTip);
        g.addEventListener('mouseleave', () => { tipEl.style.display = 'none'; });
        svg.appendChild(g);
      });

      const { topY: ty, botY: by, topHW: thw } = tierBounds(ti);
      const lblY = (ty + by) / 2;
      const lblAnchorX = cx - Math.max(thw, 0) - 80;
      const lt = ns('text');
      lt.setAttribute('x', lblAnchorX); lt.setAttribute('y', lblY + 4);
      lt.setAttribute('text-anchor', 'end'); lt.setAttribute('fill', '#5a3a9a');
      lt.setAttribute('font-size', '13'); lt.setAttribute('font-weight', '700');
      lt.setAttribute('font-family', 'Kanit,sans-serif'); lt.setAttribute('letter-spacing', '0.06em');
      lt.textContent = tier.label.toUpperCase(); svg.appendChild(lt);
    });
  }

  function getTierForId(id) {
    for (const tier of TIERS) {
      if (tier.cols.find(c => c.id === id)) return tier;
    }
    return null;
  }

  function selectSeg(id) {
    const current = state[id];
    const nextIdx = (STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length;
    state[id] = STATUS_CYCLE[nextIdx];
    selectedId = id;
    renderPyramid();
    updateStats();
    showDetail(id);
  }

  function showDetail(id) {
    const seg = ALL_SEGS.find(s => s.id === id);
    if (!seg) return;
    const cat = CATALOGUE[seg.sku] || {};
    const tier = getTierForId(id);
    const status = state[id];
    document.getElementById('aihub-detail-empty').style.display = 'none';
    const dc = document.getElementById('aihub-detail-content');
    dc.style.display = 'flex';
    document.getElementById('aihub-d-name').textContent = seg.name;
    const tb = document.getElementById('aihub-d-tier-badge');
    const tc = TIER_COLORS[tier?.label] || { bg:'#666', border:'#444', text:'#fff' };
    tb.textContent = tier?.label || '';
    tb.style.background = tc.bg; tb.style.borderColor = tc.border; tb.style.color = tc.text;
    const rmfBadge = document.getElementById('aihub-d-rmf-badge');
    if (cat.rmf) {
      rmfBadge.innerHTML = `<a href="https://airc.nist.gov/Home" target="_blank" rel="noopener" title="Open NIST AI RMF Resource Centre" style="color:inherit;text-decoration:none">${cat.rmf} ↗</a>`;
      rmfBadge.style.display = '';
    } else { rmfBadge.innerHTML = ''; rmfBadge.style.display = 'none'; }
    const isoBadge = document.getElementById('aihub-d-iso-badge');
    if (cat.iso) {
      isoBadge.innerHTML = `<a href="https://www.iso.org/standard/81230.html" target="_blank" rel="noopener" title="Open ISO/IEC 42001:2023 standard page" style="color:inherit;text-decoration:none">${cat.iso} ↗</a>`;
      isoBadge.style.display = '';
    } else { isoBadge.style.display = 'none'; }
    const btns = document.getElementById('aihub-d-status-btns');
    btns.innerHTML = '';
    [['red','Not Addressed','#c00000'],['yellow','Partial','#e8a000'],['blue','In Progress','#2e7ab0'],['green','Implemented','#00af50']].forEach(([v, label, col]) => {
      const btn = document.createElement('button');
      btn.style.cssText = `padding:3px 9px;border-radius:5px;border:1.5px solid ${status===v?col:'var(--border)'};background:${status===v?col:'transparent'};cursor:pointer;font-size:10px;font-weight:500;color:${status===v?'#fff':'var(--muted)'};transition:all .12s`;
      btn.textContent = label;
      btn.onclick = () => { state[id] = v; renderPyramid(); updateStats(); showDetail(id); };
      btns.appendChild(btn);
    });
    document.getElementById('aihub-d-commentary').textContent = cat.commentary || '';
  }

  function updateStats() {
    const vals = ALL_SEGS.map(s => state[s.id]);
    document.getElementById('aihub-s-r').textContent = vals.filter(v => v === 'red').length;
    document.getElementById('aihub-s-y').textContent = vals.filter(v => v === 'yellow').length;
    document.getElementById('aihub-s-b').textContent = vals.filter(v => v === 'blue').length;
    document.getElementById('aihub-s-g').textContent = vals.filter(v => v === 'green').length;
    const g = vals.filter(v => v === 'green').length;
    const b = vals.filter(v => v === 'blue').length;
    const y = vals.filter(v => v === 'yellow').length;
    const pct = Math.round((g + b * 0.5 + y * 0.25) / vals.length * 100);
    document.getElementById('aihub-mat-pct').textContent = pct + '%';
    document.getElementById('aihub-mat-fill').style.width = pct + '%';
    const srcEl = document.getElementById('aihub-data-src');
    if (srcEl) {
      srcEl.textContent = hasAssessment
        ? `Auto-populated from AI Governance assessment (${_latest.date || 'latest'}) — click segments to adjust`
        : 'No assessment on file — click segments to set status manually';
    }
  }

  renderPyramid();
  updateStats();
}
