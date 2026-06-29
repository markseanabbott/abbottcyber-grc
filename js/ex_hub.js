// ============================================================
// ex_hub.js — Exercise Hub
// Unified view of all completed tabletop exercises for the
// selected org: Operational + AI Governance tracks.
// ============================================================

let exHubState = {
  opSessions: null,  // null = not loaded; [] = loaded empty
};

function renderExHub() {
  if (!currentOrg) return `<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">Select an organization to view exercises.</div>`;
  exHubEnsureOp();
  return exHubRender();
}

async function exHubEnsureOp() {
  if (exHubState.opSessions !== null) return;
  try {
    exHubState.opSessions = await sb.tt.listCompletedForOrg(currentOrg.id);
  } catch(e) {
    exHubState.opSessions = [];
  }
  if (['exercises', 'scenario_library', 'ex_hub', 'home'].includes(activeNav)) renderMain();
}

function exHubRender() {
  const aiRuns = ((orgAssessments[currentOrg?.id] || {})['ai_tabletop'] || []);
  const opSessions = exHubState.opSessions;

  // Build unified list
  const rows = [];

  // AI tabletop entries
  aiRuns.forEach(r => {
    const a = r.answers || {};
    rows.push({
      type: 'ai',
      date: r.date || r.assessed_at || '',
      scenario: a.scenarioName || a.scenarioId || '—',
      facilitator: a.facilitator || r.conductedBy || '—',
      breach: null,  // AI tabletop doesn't have breach declare
      severity: null,
      injectCount: Object.keys(a.injectNotes || {}).length,
      discussionCount: Object.keys(a.discussionNotes || {}).length,
      notifCount: Object.values(a.notifChecks || {}).filter(Boolean).length,
      id: r.id,
    });
  });

  // Operational tabletop entries
  if (opSessions) {
    opSessions.forEach(s => {
      const log = Array.isArray(s.exercise_log) ? s.exercise_log : [];
      rows.push({
        type: 'op',
        date: s.created_at ? s.created_at.substring(0, 10) : '',
        scenario: s.scenario_title || s.scenario_id || '—',
        facilitator: s.facilitator_name || '—',
        breach: s.breach_declared,
        severity: s.tl_severity || '—',
        injectCount: log.length,
        discussionCount: null,
        notifCount: null,
        id: s.id,
        session: s,
      });
    });
  }

  // Sort newest first
  rows.sort((a, b) => b.date.localeCompare(a.date));

  // Stats
  const total = rows.length;
  const breachCount = rows.filter(r => r.breach === true).length;
  const aiCount = rows.filter(r => r.type === 'ai').length;
  const opCount = rows.filter(r => r.type === 'op').length;
  const loading = opSessions === null;

  // Reuse governance hub's _govBucket / _govCard helpers (global from home.js)
  const EX_SECTIONS = [
    {
      label: 'Cybersecurity Exercises',
      items: [
        { icon: '🛡️', label: 'Cybersecurity Tabletop', description: 'Run incident response exercises for ransomware, BEC, and other threat scenarios. Multi-role, inject-driven, breach-declaration gate.', nav: 'tabletop' },
      ],
    },
    {
      label: 'AI Governance Exercises',
      items: [
        { icon: '🤖', label: 'AI Governance Tabletop', description: 'AI-specific exercises across Governance (policy, model risk, bias, NIST AI RMF) and Attack Simulation (prompt injection, phishing, model extraction) tracks.', nav: 'tt_ai' },
      ],
    },
  ];

  const [cyberSection, aiSection] = EX_SECTIONS.map(s => ({
    ...s,
    visible: s.items.filter(i => (typeof hasPageAccess !== 'function' || hasPageAccess(i.nav))),
  }));

  const cyberHtml = cyberSection.visible.length ? _govBucket(cyberSection, cyberSection.visible) : '';
  const aiHtml    = aiSection.visible.length    ? _govBucket(aiSection, aiSection.visible)       : '';

  return `${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">🎯 Exercises</div>
      <div style="font-size:12px;color:var(--muted)">Tabletop exercises and scenario simulations for ${escH(currentOrg.name)}</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;align-items:start;margin-bottom:1.25rem">
    ${cyberHtml}
    ${aiHtml}
  </div>

  <div class="summary-metrics" style="margin-bottom:1.25rem">
    <div class="sm-card"><div class="sm-val">${total}</div><div class="sm-lbl">Total exercises</div></div>
    <div class="sm-card"><div class="sm-val">${opCount}</div><div class="sm-lbl">Cybersecurity</div></div>
    <div class="sm-card"><div class="sm-val">${aiCount}</div><div class="sm-lbl">AI Governance</div></div>
    <div class="sm-card"><div class="sm-val" style="color:${breachCount > 0 ? '#dc2626' : '#15803d'}">${breachCount}</div><div class="sm-lbl">Breach events</div></div>
  </div>

  ${loading ? `<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">
    <div class="spinner" style="border-color:rgba(21,33,104,.2);border-top-color:var(--navy);width:18px;height:18px;margin:0 auto 0.75rem"></div>
    <div style="font-size:12px">Loading sessions…</div>
  </div>` : rows.length === 0 ? '' : `
  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:.5rem">Exercise History</div>
  <div class="card" style="padding:0">
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="border-bottom:2px solid var(--border)">
          <th style="text-align:left;padding:10px 14px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Date</th>
          <th style="text-align:left;padding:10px 14px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Track</th>
          <th style="text-align:left;padding:10px 14px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Scenario</th>
          <th style="text-align:left;padding:10px 14px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Facilitator</th>
          <th style="text-align:center;padding:10px 14px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Outcome</th>
          <th style="text-align:center;padding:10px 14px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Activity</th>
          <th style="padding:10px 14px"></th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((r, i) => {
          const isAi = r.type === 'ai';
          const trackBadge = isAi
            ? `<span class="badge" style="background:#ede9fe;color:#6d28d9">AI Governance</span>`
            : `<span class="badge" style="background:#dbeafe;color:#1d4ed8">Cybersecurity</span>`;

          let outcomeCells = '';
          if (isAi) {
            const notifPct = r.notifCount > 0 ? `${r.notifCount} notif` : '';
            outcomeCells = `<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center">
              ${r.injectCount > 0 ? `<span class="badge b-navy">${r.injectCount} inject notes</span>` : ''}
              ${r.discussionCount > 0 ? `<span class="badge b-gray">${r.discussionCount} discussion</span>` : ''}
              ${notifPct ? `<span class="badge b-amber">${notifPct}</span>` : ''}
            </div>`;
          } else {
            const sevColor = r.severity === 'P1' ? '#dc2626' : r.severity === 'P2' ? '#d97706' : '#5a6a8a';
            outcomeCells = `<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center">
              <span class="badge" style="background:${sevColor};color:#fff">${r.severity}</span>
              ${r.breach === true ? `<span class="badge b-red">Breach declared</span>` : r.breach === false ? `<span class="badge b-green">No breach</span>` : ''}
            </div>`;
          }

          const activity = isAi
            ? `${r.injectCount + r.discussionCount} notes`
            : `${r.injectCount} log entries`;

          const aarBtn = isAi
            ? `<button class="btn btn-sm btn-outline" onclick="exHubViewAiAAR('${r.id}')">View AAR</button>`
            : `<button class="btn btn-sm btn-outline" onclick="exHubViewOpAAR('${r.id}')">View AAR</button>`;

          return `<tr style="border-bottom:1px solid var(--border);${i % 2 === 1 ? 'background:#fafbff' : ''}">
            <td style="padding:10px 14px;font-size:13px;font-weight:600;white-space:nowrap">${r.date}</td>
            <td style="padding:10px 14px">${trackBadge}</td>
            <td style="padding:10px 14px;font-size:13px;max-width:220px">${r.scenario}</td>
            <td style="padding:10px 14px;font-size:12px;color:var(--muted)">${r.facilitator}</td>
            <td style="padding:10px 14px;text-align:center">${outcomeCells}</td>
            <td style="padding:10px 14px;text-align:center;font-size:12px;color:var(--muted)">${activity}</td>
            <td style="padding:10px 14px;text-align:right">${aarBtn}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`}`;
}

function exHubViewAiAAR(id) {
  // Navigate to AI tabletop module and load the historical run
  activeNav = 'tt_ai';
  buildNav();
  if (!aittState) aittInit();
  aittLoadRun(id);
}

function exHubViewOpAAR(sessionId) {
  // Navigate to operational tabletop and load historical AAR
  activeNav = 'tabletop';
  buildNav();
  if (!ttState) ttInit();
  // Ensure history is loaded so we can look up the session
  if (!ttState.completedSessions) ttState.completedSessions = exHubState.opSessions || [];
  const session = (ttState.completedSessions || []).find(s => s.id === sessionId);
  if (session) {
    ttState.historicalSession = session;
    ttState.view = 'history_aar';
  }
  renderMain();
}
