// assessment_core.js — shared chrome for assessment modules
// Pure HTML-generator functions (ac*) that modules call to assemble their views.
// No state management — each module keeps its own state.
// All functions are exposed on window. Returns HTML strings except acTrendDraw.
// Requires: escH (global, defined in config.js), Inter font (loaded globally).

'use strict';

// ── HELPERS ──────────────────────────────────────────────────────────────────

/** Returns { band, bandCol } for a 0-100 score using the standard 4-tier scale. */
function acScoreBand(score) {
  if (score >= 75) return { band: 'Strong',    bandCol: '#15803d' };
  if (score >= 60) return { band: 'Moderate',  bandCol: '#b45309' };
  if (score >= 40) return { band: 'Elevated',  bandCol: '#ea580c' };
  return               { band: 'High Risk', bandCol: '#dc2626' };
}

// ── SCORE HERO ────────────────────────────────────────────────────────────────

/**
 * acScoreHeroHtml — dark navy score hero card with score, band, trend and
 * category progress bars.  Matches the .score-hero-ins pattern from cis.js.
 *
 * @param {object} opts
 * @returns {string} HTML
 */
function acScoreHeroHtml(opts) {
  const {
    score         = 0,
    hasData       = false,
    band          = '',
    bandCol       = '#b45309',
    badge         = '',
    badgeBg       = '#dbeafe',
    badgeTxt      = '#1d4ed8',
    answered      = 0,
    total         = 0,
    date          = '',
    trendCanvasId = null,
    runCount      = 0,
    categoryBarsHtml = '',
    goalPickerHtml   = '',
  } = opts;

  const scoreDisplay = hasData
    ? `${score}<span style="font-size:18px">%</span>`
    : `<span style="font-size:18px">—</span>`;

  const bandPill = hasData
    ? `<div style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;display:inline-block;margin-top:6px;color:${bandCol};background:rgba(255,255,255,.08)">${escH(band)}</div>`
    : '';

  const badgePill = badge
    ? `<span style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;background:${badgeBg};color:${badgeTxt};margin-left:8px">${escH(badge)}</span>`
    : '';

  const subLine = hasData
    ? `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">${answered} of ${total} answered${date ? ' · ' + escH(date) : ''}</div>`
    : `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">No assessments yet</div>`;

  // Right column: trend canvas or placeholder text
  let trendHtml;
  if (trendCanvasId && runCount >= 2) {
    trendHtml = `
      <div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">Score Trend</div>
      <canvas id="${escH(trendCanvasId)}" width="200" height="60"></canvas>`;
  } else {
    const msg = runCount === 1 ? '1 run recorded<br>trend after 2nd save' : 'No assessments yet';
    trendHtml = `<div style="font-size:11px;color:rgba(255,255,255,.3);text-align:right">${msg}</div>`;
  }

  return `
  <div class="score-hero-ins" style="margin-bottom:1.25rem">
    <div style="flex:1;display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap">
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">Latest Score</div>
          <div class="score-big" style="color:#fff">${scoreDisplay}${badgePill}</div>
          ${bandPill}
          ${subLine}
        </div>
        <div style="flex:1;min-width:280px">
          ${goalPickerHtml ? `<div style="margin-bottom:12px">${goalPickerHtml}</div>` : ''}
          ${categoryBarsHtml
            ? `<div style="display:flex;gap:12px;flex-wrap:wrap">${categoryBarsHtml}</div>`
            : '<div style="font-size:11px;color:rgba(255,255,255,.3)">Run an assessment to see progress</div>'}
        </div>
      </div>
    </div>
    <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:8px">
      ${trendHtml}
      <div style="font-size:10px;color:rgba(255,255,255,.35);text-align:right;margin-top:6px">
        ${runCount} assessment${runCount !== 1 ? 's' : ''} recorded
      </div>
    </div>
  </div>`;
}

// ── HISTORY TABLE ─────────────────────────────────────────────────────────────

/**
 * acHistoryTableHtml — assessment history card with sortable runs table.
 * Sorts newest-first by run.date; passes both display index and original array
 * index to rowFn so action handler callbacks stay correct.
 *
 * @param {object} opts
 * @returns {string} HTML
 */
function acHistoryTableHtml(opts) {
  const {
    headerLabel    = 'Assessment History',
    headerButtons  = '',
    runs           = [],
    emptyIcon      = '📋',
    emptyTitle     = 'No assessments yet',
    emptyBody      = 'Run your first assessment to start tracking posture.',
    emptyActionHtml = '',
    colHeaders     = [],
    rowFn          = () => '',
    sortFn         = null,
  } = opts;

  const sorted = runs
    .map((r, origIdx) => ({ r, origIdx }))
    .sort(sortFn || ((a, b) => (b.r.date || '').localeCompare(a.r.date || '')));

  let bodyHtml;
  if (runs.length === 0) {
    bodyHtml = `
      <div style="text-align:center;padding:2.5rem 1rem;color:var(--muted)">
        <div style="font-size:32px;margin-bottom:0.75rem">${emptyIcon}</div>
        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:6px">${escH(emptyTitle)}</div>
        <div style="font-size:12px;margin-bottom:1.25rem">${emptyBody}</div>
        ${emptyActionHtml}
      </div>`;
  } else {
    const thCells = colHeaders.map(h =>
      `<th style="${h.style || ''};font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">${h.label}</th>`
    ).join('');

    const rows = sorted.map(({ r, origIdx }, sortedIdx) =>
      rowFn(r, sortedIdx, origIdx)
    ).join('');

    bodyHtml = `
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="border-bottom:2px solid var(--border)">${thCells}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  return `
  <div class="card" style="padding:1.25rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.1rem;flex-wrap:wrap;gap:8px">
      <div style="font-size:14px;font-weight:700;color:var(--text)">${escH(headerLabel)}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${headerButtons}</div>
    </div>
    ${bodyHtml}
  </div>`;
}

// ── STATS CHIPS ───────────────────────────────────────────────────────────────

/**
 * acStatsChipsHtml — row of stat chips above the POAM table (or any summary).
 * Each chip: white card, big coloured number, small uppercase label.
 *
 * @param {Array<{label: string, val: number|string, col: string}>} stats
 * @returns {string} HTML
 */
function acStatsChipsHtml(stats) {
  return `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem">
    ${stats.map(s => `
      <div style="padding:8px 14px;border-radius:8px;background:var(--card);border:1px solid var(--border);text-align:center;min-width:82px">
        <div style="font-size:20px;font-weight:800;color:${s.col}">${s.val}</div>
        <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-top:1px">${escH(s.label)}</div>
      </div>`).join('')}
  </div>`;
}

// ── POAM TABLE ────────────────────────────────────────────────────────────────

/**
 * acPoamTableHtml — POAM gap table.  Module supplies prefix columns via
 * colHeaders + rowPrefixFn; this function appends the five standard editable
 * columns (Assigned To, Target Date, Decision, Rationale, Status).
 *
 * @param {object} opts
 * @returns {string} HTML
 */
function acPoamTableHtml(opts) {
  const {
    gaps           = [],
    items          = {},
    inputSty       = 'width:100%;padding:4px 6px;border-radius:5px;border:1px solid var(--border);font-family:Inter,sans-serif;font-size:11px;color:var(--text);background:#fff;box-sizing:border-box',
    noGapsHtml     = '<div class="card" style="text-align:center;padding:3rem 1rem"><div style="font-size:14px;font-weight:700">No gaps found</div></div>',
    colHeaders     = [],
    rowPrefixFn    = () => '',
    groupHeaderFn  = null,
  } = opts;

  if (gaps.length === 0) return noGapsHtml;

  // Standard editable column headers appended after module prefix columns
  const stdHeaders = [
    { label: 'Assigned To',     style: 'padding:8px 10px;text-align:left;min-width:130px' },
    { label: 'Target Date',     style: 'padding:8px 10px;text-align:left;min-width:130px' },
    { label: 'Decision',        style: 'padding:8px 10px;text-align:left;min-width:140px' },
    { label: 'Rationale / Notes', style: 'padding:8px 10px;text-align:left;min-width:190px' },
    { label: 'Status',          style: 'padding:8px 10px;text-align:left;min-width:130px' },
  ];

  const allHeaders = [...colHeaders, ...stdHeaders];
  const thCells = allHeaders.map(h =>
    `<th style="${h.style || ''};font-size:10px;font-weight:700;letter-spacing:.05em">${h.label}</th>`
  ).join('');

  let lastGroup = null;
  const rowsHtml = gaps.map((gap, idx) => {
    const item = items[gap.id] || {};

    // Optional group header row
    let groupRowHtml = '';
    if (groupHeaderFn) {
      const result = groupHeaderFn(gap, lastGroup);
      if (result && result.html) {
        groupRowHtml = result.html;
        lastGroup = result.newGroup;
      }
    }

    const assignedVal  = escH(item.assigned_to  || '');
    const targetDateVal = escH(item.target_date  || '');
    const decisionVal  = item.risk_decision || 'Remediate';
    const rationaleVal = escH(item.notes        || '');
    const statusVal    = item.status            || 'Open';

    const stdCells = `
      <td style="padding:6px 8px">
        <input type="text" class="poam-assigned" data-id="${escH(String(gap.id))}"
          value="${assignedVal}" style="${inputSty}" placeholder="Name or team">
      </td>
      <td style="padding:6px 8px">
        <input type="date" class="poam-date" data-id="${escH(String(gap.id))}"
          value="${targetDateVal}" style="${inputSty}">
      </td>
      <td style="padding:6px 8px">
        <select class="poam-decision" data-id="${escH(String(gap.id))}" style="${inputSty}">
          ${['Remediate','Accept Risk','Transfer','Defer'].map(o =>
            `<option value="${o}"${decisionVal === o ? ' selected' : ''}>${o}</option>`
          ).join('')}
        </select>
      </td>
      <td style="padding:6px 8px">
        <textarea class="poam-rationale" data-id="${escH(String(gap.id))}"
          style="${inputSty};min-height:38px;resize:vertical" placeholder="Rationale or notes">${rationaleVal}</textarea>
      </td>
      <td style="padding:6px 8px">
        <select class="poam-status" data-id="${escH(String(gap.id))}" style="${inputSty}">
          ${['Open','In Progress','Remediated','Accepted'].map(o =>
            `<option value="${o}"${statusVal === o ? ' selected' : ''}>${o}</option>`
          ).join('')}
        </select>
      </td>`;

    return `${groupRowHtml}
      <tr style="border-bottom:1px solid var(--border)">
        ${rowPrefixFn(gap, item)}
        ${stdCells}
      </tr>`;
  }).join('');

  return `
  <div style="overflow-x:auto">
    <table style="width:100%;min-width:900px;border-collapse:collapse;font-size:12px">
      <thead>
        <tr style="background:var(--navy);color:#fff">${thCells}</tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>`;
}

// ── EXEC SCORE STRIP ─────────────────────────────────────────────────────────

/**
 * acExecScoreStripHtml — score strip at the top of any exec report view.
 * White card, flex row of coloured stat blocks, stacked coverage bar,
 * maturity score, and fully-implemented %, matching the CIS exec report.
 *
 * @param {object} opts
 * @returns {string} HTML
 */
function acExecScoreStripHtml(opts) {
  const {
    yes        = 0,
    partial    = 0,
    no         = 0,
    na         = 0,
    unanswered = 0,
    scopedTotal = 0,
    score      = 0,
    bandCol    = '#b45309',
    fullImpl   = 0,
    fiCol      = '#15803d',
    goalLabel  = '',
  } = opts;

  const base = scopedTotal || 1; // guard divide-by-zero
  const yesPct  = (yes        / base * 100).toFixed(1);
  const partPct = (partial    / base * 100).toFixed(1);
  const noPct   = (no         / base * 100).toFixed(1);
  const naPct   = (na         / base * 100).toFixed(1);
  const unPct   = (unanswered / base * 100).toFixed(1);

  const statBlocks = [
    { count: yes,        label: 'Implemented', color: '#15803d' },
    { count: partial,    label: 'Partial',     color: '#d97706' },
    { count: no,         label: 'Not Done',    color: '#dc2626' },
    { count: na,         label: 'N/A',         color: '#94a3b8' },
    { count: unanswered, label: 'Unanswered',  color: '#d1d5db' },
  ].map(item => `
    <div style="display:flex;align-items:center;gap:6px;padding:4px 14px;border-right:1px solid var(--border);flex-shrink:0">
      <div style="width:8px;height:8px;border-radius:2px;background:${item.color}"></div>
      <div>
        <div style="font-size:16px;font-weight:700;color:${item.color};line-height:1;font-family:monospace">${item.count}</div>
        <div style="font-size:9px;color:var(--muted)">${item.label}</div>
      </div>
    </div>`).join('');

  const coverageLabel = goalLabel ? escH(goalLabel) + ' COVERAGE' : 'COVERAGE';

  return `
  <div class="card" style="padding:.65rem 1.1rem;margin-bottom:1rem;display:flex;align-items:center;gap:0;flex-wrap:wrap">
    ${statBlocks}
    <div style="flex:1;min-width:140px;padding:4px 14px;border-right:1px solid var(--border)">
      <div style="font-size:9px;color:var(--muted);margin-bottom:3px;font-family:monospace">${coverageLabel}</div>
      <div style="height:6px;background:var(--bg);border-radius:3px;overflow:hidden;display:flex">
        <div style="width:${yesPct}%;background:#15803d"></div>
        <div style="width:${partPct}%;background:#d97706"></div>
        <div style="width:${noPct}%;background:#dc2626"></div>
        <div style="width:${naPct}%;background:#cbd5e1"></div>
        <div style="width:${unPct}%;background:#f1f5f9"></div>
      </div>
    </div>
    <div style="padding:4px 14px;border-right:1px solid var(--border);flex-shrink:0;text-align:center">
      <div style="font-size:9px;color:var(--muted)">Maturity Score</div>
      <div style="font-size:20px;font-weight:800;color:${bandCol};font-family:monospace;line-height:1.1">${score}%</div>
      <div style="font-size:9px;color:var(--muted)">yes + partial credit</div>
    </div>
    <div style="padding:4px 14px;flex-shrink:0;text-align:center">
      <div style="font-size:9px;color:var(--muted)">Fully Implemented</div>
      <div style="font-size:20px;font-weight:800;color:${fiCol};font-family:monospace;line-height:1.1">${fullImpl}%</div>
      <div style="font-size:9px;color:var(--muted)">yes answers only</div>
    </div>
  </div>`;
}

// ── TREND DRAW ────────────────────────────────────────────────────────────────

/**
 * acTrendDraw — draws a simple line+dot chart on a named canvas element.
 * Must be called after the DOM has rendered the canvas.
 * Plots run.score values on y-axis; x-axis = chronological order.
 *
 * @param {string} canvasId   - id of the <canvas> element
 * @param {Array}  runs       - array of run objects with .score (0-100) and .date
 * @param {string} [color]    - line/dot colour (default cyan)
 */
function acTrendDraw(canvasId, runs, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (!runs || runs.length < 2) return;

  const col = color || '#07B4D9';

  // Sort chronologically
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  const W = canvas.offsetWidth || 200;
  const H = 60;
  canvas.width  = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const padX   = 10;
  const padTop = 10;
  const padBot = 10;
  const n      = sorted.length;
  const drawW  = W - padX * 2;
  const drawH  = H - padTop - padBot;

  const xPos = i => padX + (n === 1 ? drawW / 2 : i / (n - 1) * drawW);
  const yPos = score => padTop + drawH - (Math.max(0, Math.min(100, score)) / 100 * drawH);

  // Line
  ctx.beginPath();
  ctx.strokeStyle = col;
  ctx.lineWidth   = 2;
  ctx.lineJoin    = 'round';
  sorted.forEach((r, i) => {
    const x = xPos(i);
    const y = yPos(r.score || 0);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Dots + score labels
  sorted.forEach((r, i) => {
    const x = xPos(i);
    const y = yPos(r.score || 0);

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();

    // Score label above dot
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font      = 'bold 8px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((r.score || 0) + '%', x, y - 6);
  });
}

// ── EXTENSION TAB BAR ─────────────────────────────────────────────────────────

/**
 * acTabExtBar — renders a small pill tab bar for module extension tabs.
 * Active tab: navy background, white text.  Inactive: ghost (outlined).
 *
 * @param {string}   coreTabsHtml  - any existing core tab HTML to prepend (may be '')
 * @param {Array<{id: string, label: string}>} extensions
 * @param {string}   activeExtId   - id of currently active extension tab ('' = none active)
 * @param {string}   onSwitch      - name of JS function to call with the extension id
 * @returns {string} HTML
 */
function acTabExtBar(coreTabsHtml, extensions, activeExtId, onSwitch) {
  const extTabs = extensions.map(ext => {
    const isActive = ext.id === activeExtId;
    const activeStyle = isActive
      ? `background:var(--navy);color:#fff;border-color:var(--navy)`
      : `background:transparent;color:var(--navy);border-color:var(--border)`;
    return `<button class="btn btn-sm" onclick="${escH(onSwitch)}('${ext.id}')"
      style="padding:4px 14px;font-size:11px;font-weight:700;border-radius:16px;border:2px solid;transition:all .15s;${activeStyle}">
      ${escH(ext.label)}
    </button>`;
  }).join('');

  return `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:1rem">
    ${coreTabsHtml}
    ${extTabs}
  </div>`;
}

// ── SCORE BREAKDOWN CARD ──────────────────────────────────────────────────────

/**
 * acExecScoreBreakdownHtml — Score Breakdown card (left column of 2-col exec grid).
 * Shows big score + band number, stacked bar, legend chips, and fully-implemented box.
 *
 * @param {object} opts - { score, band, bandCol, yesPct, partPct, noPct, naPct, unPct,
 *                          yesN, partN, noN, naN, fullImpl, fiCol, scoreable,
 *                          scoreableLabel?, metLabel?, partLabel?, noLabel?, naLabel? }
 * @returns {string} HTML — .card div
 */
function acExecScoreBreakdownHtml(opts) {
  const {
    score, band, bandCol,
    yesPct = 0, partPct = 0, noPct = 0, naPct = 0, unPct = 0,
    yesN = 0, partN = 0, noN = 0, naN = 0,
    fullImpl = 0, fiCol = '#b45309',
    scoreable = 0,
    scoreableLabel = 'applicable items',
    metLabel  = 'Yes',     partLabel = 'Partial',
    noLabel   = 'No',      naLabel   = 'N/A',
  } = opts;

  return `<div class="card" style="padding:1.1rem">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Score Breakdown</div>
    <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:2px">
      <span style="font-size:38px;font-weight:800;color:${bandCol};font-family:monospace;line-height:1">${score}%</span>
      <span style="font-size:13px;font-weight:700;color:${bandCol}">${escH(band)}</span>
    </div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:10px">Maturity — partial answers earn 50% credit</div>
    <div style="height:10px;background:var(--bg);border-radius:5px;overflow:hidden;display:flex;margin-bottom:8px">
      <div style="width:${yesPct}%;background:#15803d"></div>
      <div style="width:${partPct}%;background:#d97706"></div>
      <div style="width:${noPct}%;background:#dc2626"></div>
      <div style="width:${naPct}%;background:#cbd5e1"></div>
      <div style="width:${unPct}%;background:#f1f5f9"></div>
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px">
      ${[
        { label: metLabel,  count: yesN,  color: '#15803d' },
        { label: partLabel, count: partN, color: '#d97706' },
        { label: noLabel,   count: noN,   color: '#dc2626' },
        { label: naLabel,   count: naN,   color: '#94a3b8' },
      ].map(x => `<div style="display:flex;align-items:center;gap:4px">
        <div style="width:8px;height:8px;border-radius:2px;background:${x.color}"></div>
        <span style="font-size:12px;font-weight:700;color:${x.color}">${x.count}</span>
        <span style="font-size:10px;color:var(--muted)">${x.label}</span>
      </div>`).join('')}
    </div>
    <div style="padding:10px 12px;background:var(--bg);border-radius:7px;border-left:3px solid ${fiCol}">
      <div style="font-size:10px;color:var(--muted);margin-bottom:2px">Fully Implemented — yes/met only, no partial credit</div>
      <div style="display:flex;align-items:baseline;gap:6px">
        <span style="font-size:26px;font-weight:800;color:${fiCol};font-family:monospace;line-height:1">${fullImpl}%</span>
        <span style="font-size:11px;color:var(--muted)">${yesN} of ${scoreable} ${escH(scoreableLabel)} complete</span>
      </div>
    </div>
  </div>`;
}

// ── COMMENTARY CARD ───────────────────────────────────────────────────────────

/**
 * acExecCommentaryHtml — Executive Commentary card with paste textarea,
 * AI prompt button, and save button.
 *
 * @param {object} opts - { commentary, commentaryId, copyFn, saveFn, placeholder? }
 * @returns {string} HTML — .card div
 */
function acExecCommentaryHtml(opts) {
  const {
    commentary   = '',
    commentaryId = 'execReportCommentary',
    copyFn       = '',
    saveFn       = '',
    placeholder  = 'Type your executive commentary here, or click ✨ Generate AI Prompt — paste the output into Claude, copy the response back here, then Save.',
  } = opts;

  return `<div class="card" style="padding:1.25rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Executive Commentary</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">Written narrative for client presentation</div>
      </div>
      <div style="display:flex;gap:6px">
        ${copyFn ? `<button class="btn btn-outline btn-sm" onclick="${escH(copyFn)}()" title="Generate a data-rich prompt to paste into Claude">✨ Generate AI Prompt</button>` : ''}
        ${saveFn ? `<button class="btn btn-cyan btn-sm" onclick="${escH(saveFn)}()">Save Commentary</button>` : ''}
      </div>
    </div>
    <textarea id="${escH(commentaryId)}" rows="8"
      placeholder="${escH(placeholder)}"
      style="width:100%;box-sizing:border-box;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border);font-family:Inter,sans-serif;font-size:13px;color:var(--text);resize:vertical;line-height:1.7"
    >${escH(commentary)}</textarea>
    <div style="font-size:10px;color:var(--muted);margin-top:6px">
      💡 <strong>Generate AI Prompt</strong> copies a pre-filled prompt to your clipboard. Paste into Claude → get polished commentary → paste back above → Save.
    </div>
  </div>`;
}

// ── EXPORTS ───────────────────────────────────────────────────────────────────

window.acScoreBand              = acScoreBand;
window.acScoreHeroHtml          = acScoreHeroHtml;
window.acHistoryTableHtml       = acHistoryTableHtml;
window.acStatsChipsHtml         = acStatsChipsHtml;
window.acPoamTableHtml          = acPoamTableHtml;
window.acExecScoreStripHtml     = acExecScoreStripHtml;
window.acExecScoreBreakdownHtml = acExecScoreBreakdownHtml;
window.acExecCommentaryHtml     = acExecCommentaryHtml;
window.acTrendDraw              = acTrendDraw;
window.acTabExtBar              = acTabExtBar;
