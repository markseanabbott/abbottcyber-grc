// js/risk_register.js
// Risk Register — residual risk view generated automatically from CIS v8 assessment findings.
// The tg_cis_assessment_risk trigger populates risk_register rows whenever a CIS assessment is saved.

let rrState = {
  rows:    [],       // [{...risk_register row, risk_control_categories: {...}}]
  loading: false,
  orgId:   null,     // org currently loaded — used to detect org switches
  filter:  'all',
  modal:   null,     // null | { type:'accept', row, acceptedBy, rationale, reviewDate }
};

// ─── BADGE HELPERS ──────────────────────────────────────────────────────────

function rrRatingBadge(rating) {
  const MAP = {
    'Critical':     { bg: '#fee2e2', c: '#dc2626' },
    'High':         { bg: '#ffedd5', c: '#ea580c' },
    'Medium':       { bg: '#fef9c3', c: '#ca8a04' },
    'Low':          { bg: '#dcfce7', c: '#16a34a' },
    'Minimal':      { bg: '#f0fdf4', c: '#166534' },
    'No Findings':  { bg: '#f1f5f9', c: '#64748b' },
    'Out of Scope': { bg: '#f1f5f9', c: '#94a3b8' },
  };
  const s = MAP[rating] || MAP['No Findings'];
  return `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;background:${s.bg};color:${s.c};white-space:nowrap">${escH(rating || '–')}</span>`;
}

function rrStatusBadge(status) {
  const MAP = {
    'Active':         { bg: '#e0e7ff', c: '#4338ca' },
    'Out of Scope':   { bg: '#f1f5f9', c: '#94a3b8' },
    'Accepted':       { bg: '#dcfce7', c: '#16a34a' },
    'Accepted - OOS': { bg: '#d1fae5', c: '#059669' },
    'Pending Review': { bg: '#fef9c3', c: '#b45309' },
  };
  const s = MAP[status] || { bg: '#f1f5f9', c: '#64748b' };
  return `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;background:${s.bg};color:${s.c};white-space:nowrap">${escH(status || '–')}</span>`;
}

// ─── DATA LOAD ──────────────────────────────────────────────────────────────

async function rrLoad() {
  if (!currentOrg) return;
  rrState.loading = true;
  rrState.orgId   = currentOrg.id;
  try {
    const rows = await sb.riskRegister.getForOrg(currentOrg.id);
    rrState.rows = (rows || []).sort((a, b) => {
      return (a.risk_control_categories?.display_order || 0)
           - (b.risk_control_categories?.display_order || 0);
    });
  } catch(e) {
    toast('Failed to load Risk Register: ' + e.message, '#dc2626');
    rrState.rows = [];
  }
  rrState.loading = false;
}

// ─── FILTER ─────────────────────────────────────────────────────────────────

function rrFilteredRows() {
  const f = rrState.filter;
  const rows = rrState.rows;
  if (f === 'all')      return rows;
  if (f === 'accepted') return rows.filter(r => r.risk_status === 'Accepted' || r.risk_status === 'Accepted - OOS');
  if (f === 'oos')      return rows.filter(r => r.risk_status === 'Out of Scope' || r.risk_status === 'Accepted - OOS');
  return rows.filter(r => r.calculated_risk_rating === f);
}

function rrSetFilter(f) {
  rrState.filter = f;
  const el = document.getElementById('mainContent');
  if (el) el.innerHTML = renderRiskRegister();
}

// ─── ACCEPT WORKFLOW ────────────────────────────────────────────────────────

function rrOpenAccept(rowId) {
  const row = rrState.rows.find(r => r.id === rowId);
  if (!row) return;
  const userName = (typeof authState !== 'undefined' && authState?.profile?.name)
    ? authState.profile.name : '';
  rrState.modal = { type: 'accept', row, acceptedBy: userName, rationale: '', reviewDate: '' };
  const el = document.getElementById('mainContent');
  if (el) el.innerHTML = renderRiskRegister();
}

function rrCloseModal() {
  rrState.modal = null;
  const el = document.getElementById('mainContent');
  if (el) el.innerHTML = renderRiskRegister();
}

function rrModalField(field, value) {
  if (rrState.modal) rrState.modal[field] = value;
}

async function rrSubmitAccept() {
  const m = rrState.modal;
  if (!m) return;
  if (!m.acceptedBy.trim()) { toast('Accepted By is required', '#dc2626'); return; }
  if (!m.rationale.trim())  { toast('Rationale is required', '#dc2626'); return; }

  const btn = document.getElementById('rrAcceptBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  try {
    const reviewDate = m.reviewDate
      ? new Date(m.reviewDate).toISOString()
      : new Date(Date.now() + 365 * 86400000).toISOString();

    await sb.riskRegister.acceptRisk(
      m.row.id, m.acceptedBy.trim(), m.rationale.trim(), reviewDate
    );

    // Optimistic local update — no need to reload from server
    const idx = rrState.rows.findIndex(r => r.id === m.row.id);
    if (idx >= 0) {
      Object.assign(rrState.rows[idx], {
        risk_status:            'Accepted',
        accepted_by:            m.acceptedBy.trim(),
        acceptance_rationale:   m.rationale.trim(),
        acceptance_date:        new Date().toISOString(),
        acceptance_review_date: reviewDate,
      });
    }

    auditLog('risk_accepted', 'risk_register',
      m.row.risk_control_categories?.control_name,
      { control: m.row.risk_control_categories?.control_number });

    toast('Risk accepted and logged', '#16a34a');
    rrState.modal = null;
    const el = document.getElementById('mainContent');
    if (el) el.innerHTML = renderRiskRegister();
  } catch(e) {
    toast('Failed to accept risk: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Accept Risk'; }
  }
}

// ─── RENDER — MAIN ──────────────────────────────────────────────────────────

function renderRiskRegister() {
  if (!currentOrg) return '';

  // Loading spinner
  if (rrState.loading) {
    return renderTierBanner() + `
      <div style="text-align:center;padding:3rem;color:var(--muted)">
        <div class="spinner" style="border-color:rgba(21,33,104,0.2);border-top-color:var(--navy);width:24px;height:24px;margin:0 auto 1rem"></div>
        <div style="font-size:13px;font-weight:600">Loading risk register…</div>
      </div>`;
  }

  // No CIS assessment yet
  if (!rrState.rows.length) {
    return renderTierBanner() + `
      <div class="card" style="max-width:480px;margin:2.5rem auto;text-align:center;padding:2.5rem 2rem">
        <div style="font-size:2.5rem;margin-bottom:1rem">📋</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:0.5rem">No risk register data yet</div>
        <div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:1.5rem">
          The risk register is automatically populated when a CIS Controls v8 assessment is saved for this organisation.
          Run your first CIS assessment to generate the register.
        </div>
        <button class="btn btn-primary" onclick="setNav('cis')">Go to CIS Assessment →</button>
      </div>`;
  }

  const rows     = rrState.rows;
  const igNum    = rows[0]?.client_ig_level || 1;
  const igLabel  = `IG${igNum}`;
  const lastCalc = rows.reduce((b, r) => (!b || (r.last_calculated_at || '') > b) ? r.last_calculated_at : b, null);

  // Counts for stat cards
  const inScope      = rows.filter(r => r.in_scope);
  const critCount    = inScope.filter(r => r.calculated_risk_rating === 'Critical').length;
  const highCount    = inScope.filter(r => r.calculated_risk_rating === 'High').length;
  const acceptedCount= rows.filter(r => r.risk_status === 'Accepted' || r.risk_status === 'Accepted - OOS').length;
  const oosCount     = rows.filter(r => !r.in_scope).length;
  const pendingCount = rows.filter(r => r.risk_status === 'Pending Review').length;

  // Counts for filter tabs
  const tabCounts = {
    all:      rows.length,
    Critical: rows.filter(r => r.calculated_risk_rating === 'Critical').length,
    High:     rows.filter(r => r.calculated_risk_rating === 'High').length,
    Medium:   rows.filter(r => r.calculated_risk_rating === 'Medium').length,
    Low:      rows.filter(r => r.calculated_risk_rating === 'Low').length,
    accepted: acceptedCount,
    oos:      oosCount,
  };

  const FILTER_TABS = [
    { key: 'all',      label: 'All' },
    { key: 'Critical', label: 'Critical' },
    { key: 'High',     label: 'High' },
    { key: 'Medium',   label: 'Medium' },
    { key: 'Low',      label: 'Low' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'oos',      label: 'Out of Scope' },
  ];

  const filtered = rrFilteredRows();

  return renderTierBanner() + `
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem">
      <div>
        <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:0 0 3px">Risk Register</h2>
        <div style="font-size:11px;color:var(--muted)">
          CIS Controls v8 &bull; Scope: <strong style="color:var(--text)">${escH(igLabel)}</strong>
          ${lastCalc ? ` &bull; Last updated ${new Date(lastCalc).toLocaleDateString('en-CA')}` : ''}
          ${pendingCount ? ` &bull; <span style="color:#b45309;font-weight:700">⚠ ${pendingCount} pending review</span>` : ''}
        </div>
      </div>
    </div>

    <!-- Stat cards -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-bottom:1.25rem">
      ${rrStatCard('In Scope', `${inScope.length} / ${rows.length}`, 'var(--navy)', '#e0e7ff')}
      ${rrStatCard('Critical + High', critCount + highCount, critCount + highCount > 0 ? '#dc2626' : '#16a34a', critCount + highCount > 0 ? '#fee2e2' : '#dcfce7')}
      ${rrStatCard('Accepted', acceptedCount, '#16a34a', '#dcfce7')}
      ${rrStatCard('Out of Scope', oosCount, '#64748b', '#f1f5f9')}
    </div>

    <!-- Filter tabs -->
    <div class="view-tabs" style="margin-bottom:0.75rem;flex-wrap:wrap">
      ${FILTER_TABS.map(f => {
        const cnt = tabCounts[f.key];
        const active = rrState.filter === f.key;
        const badge = cnt ? `<span style="font-size:9px;background:${active ? 'rgba(255,255,255,0.25)' : '#e0e7ff'};color:${active ? '#fff' : '#4338ca'};padding:1px 5px;border-radius:9px;margin-left:3px">${cnt}</span>` : '';
        return `<button class="view-tab${active ? ' active' : ''}" onclick="rrSetFilter('${f.key}')">${escH(f.label)}${badge}</button>`;
      }).join('')}
    </div>

    <!-- Register table -->
    ${rrRenderTable(filtered)}

    <!-- Accept modal overlay (position:fixed — not affected by table scroll) -->
    ${rrState.modal ? rrRenderAcceptModal() : ''}
  `;
}

function rrStatCard(label, value, color, bg) {
  return `<div class="card" style="padding:1rem;text-align:center">
    <div style="font-size:22px;font-weight:800;color:${color}">${value}</div>
    <div style="font-size:10px;font-weight:600;color:var(--muted);margin-top:2px">${escH(label)}</div>
  </div>`;
}

// ─── RENDER — TABLE ─────────────────────────────────────────────────────────

function rrRenderTable(rows) {
  if (!rows.length) {
    return `<div class="card" style="padding:2rem;text-align:center;color:var(--muted);font-size:13px">No controls match this filter.</div>`;
  }
  return `<div class="card" style="padding:0;overflow:hidden">
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead>
        <tr style="background:#f8fafd;border-bottom:2px solid var(--border)">
          <th style="padding:10px 12px;text-align:left;font-weight:700;color:var(--muted);width:36px">#</th>
          <th style="padding:10px 12px;text-align:left;font-weight:700;color:var(--muted)">Control</th>
          <th style="padding:10px 12px;text-align:center;font-weight:700;color:var(--muted);width:90px">Inherent</th>
          <th style="padding:10px 12px;text-align:center;font-weight:700;color:var(--muted);width:90px">Residual</th>
          <th style="padding:10px 12px;text-align:center;font-weight:700;color:var(--muted);width:70px">Score</th>
          <th style="padding:10px 12px;text-align:center;font-weight:700;color:var(--muted);width:110px">Findings</th>
          <th style="padding:10px 12px;text-align:center;font-weight:700;color:var(--muted);width:110px">Status</th>
          <th style="padding:10px 12px;width:80px"></th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((r, i) => rrRenderRow(r, i)).join('')}
      </tbody>
    </table>
  </div>`;
}

function rrRenderRow(r, i) {
  const cat       = r.risk_control_categories || {};
  const hasScore  = r.calculated_risk_score != null;
  const score     = hasScore ? Number(r.calculated_risk_score).toFixed(1) : '—';
  const maxScore  = r.inherent_risk_score || 4;
  const bg        = i % 2 === 0 ? '#fff' : '#fafbfd';
  const canAccept = r.in_scope && (r.risk_status === 'Active' || r.risk_status === 'Pending Review') && hasScore;

  const passChip = r.finding_count_pass        ? `<span style="background:#dcfce7;color:#16a34a;font-weight:700;padding:1px 6px;border-radius:9px;font-size:9px">${r.finding_count_pass}✓</span>` : '';
  const compChip = r.finding_count_compensating ? `<span style="background:#fef9c3;color:#b45309;font-weight:700;padding:1px 6px;border-radius:9px;font-size:9px">${r.finding_count_compensating}~</span>` : '';
  const failChip = r.finding_count_fail         ? `<span style="background:#fee2e2;color:#dc2626;font-weight:700;padding:1px 6px;border-radius:9px;font-size:9px">${r.finding_count_fail}✗</span>` : '';
  const findingChips = (passChip || compChip || failChip)
    ? `<div style="display:flex;gap:3px;justify-content:center;flex-wrap:wrap">${passChip}${compChip}${failChip}</div>`
    : `<span style="color:var(--muted)">—</span>`;

  const subLine = r.risk_status === 'Accepted' && r.acceptance_review_date
    ? `<div style="font-size:10px;color:var(--muted);margin-top:1px">Review ${new Date(r.acceptance_review_date).toLocaleDateString('en-CA')} · ${escH(r.accepted_by || '')}</div>`
    : r.risk_status === 'Pending Review'
    ? `<div style="font-size:10px;color:#b45309;font-weight:700;margin-top:1px">⚠ Score changed — review acceptance</div>`
    : '';

  return `<tr style="background:${bg};border-bottom:1px solid var(--border)">
    <td style="padding:10px 12px;font-size:11px;font-weight:700;color:var(--muted)">${escH(cat.control_number || '??')}</td>
    <td style="padding:10px 12px">
      <div style="font-weight:600;color:var(--text)">${escH(cat.control_name || '—')}</div>
      ${subLine}
    </td>
    <td style="padding:10px 12px;text-align:center">${rrRatingBadge(r.inherent_risk_rating)}</td>
    <td style="padding:10px 12px;text-align:center">${rrRatingBadge(r.calculated_risk_rating)}</td>
    <td style="padding:10px 12px;text-align:center">
      ${hasScore
        ? `<span style="font-weight:700;color:var(--text)">${score}</span><span style="color:var(--muted);font-size:10px"> /${maxScore}</span>`
        : `<span style="color:var(--muted)">—</span>`}
    </td>
    <td style="padding:10px 12px">${findingChips}</td>
    <td style="padding:10px 12px;text-align:center">${rrStatusBadge(r.risk_status)}</td>
    <td style="padding:10px 12px;text-align:center">
      ${canAccept
        ? `<button class="btn btn-sm" onclick="rrOpenAccept('${r.id}')" style="font-size:10px;padding:3px 10px">Accept</button>`
        : ''}
    </td>
  </tr>`;
}

// ─── RENDER — ACCEPT MODAL ──────────────────────────────────────────────────

function rrRenderAcceptModal() {
  const m = rrState.modal;
  if (!m) return '';
  const cat = m.row.risk_control_categories || {};
  const defaultReview = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];

  return `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:999;display:flex;align-items:center;justify-content:center;padding:1rem" onclick="if(event.target===this)rrCloseModal()">
      <div style="background:#fff;border-radius:14px;padding:2rem;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.2);max-height:90vh;overflow-y:auto">

        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
          <div style="font-size:15px;font-weight:700;color:var(--text)">Accept Risk</div>
          <button onclick="rrCloseModal()" style="border:none;background:none;font-size:18px;cursor:pointer;color:var(--muted);line-height:1">✕</button>
        </div>

        <div style="background:#f8fafd;border-radius:8px;padding:0.875rem 1rem;margin-bottom:1.25rem;border-left:3px solid #dc2626">
          <div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:4px">
            Control ${escH(cat.control_number || '')} — ${escH(cat.control_name || '')}
          </div>
          <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap">
            ${rrRatingBadge(m.row.calculated_risk_rating)}
            ${rrStatusBadge(m.row.risk_status)}
          </div>
          ${cat.threat_scenario ? `<div style="font-size:10px;color:var(--muted);margin-top:6px;line-height:1.5">${escH(cat.threat_scenario)}</div>` : ''}
        </div>

        <div style="margin-bottom:1rem">
          <label style="font-size:11px;font-weight:700;color:var(--text);display:block;margin-bottom:4px">
            Accepted By <span style="color:#dc2626">*</span>
          </label>
          <input type="text" value="${escH(m.acceptedBy)}"
            oninput="rrModalField('acceptedBy',this.value)"
            placeholder="Name of the person formally accepting this risk"
            style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:12px;box-sizing:border-box">
        </div>

        <div style="margin-bottom:1rem">
          <label style="font-size:11px;font-weight:700;color:var(--text);display:block;margin-bottom:4px">
            Rationale <span style="color:#dc2626">*</span>
          </label>
          <textarea oninput="rrModalField('rationale',this.value)" rows="3"
            placeholder="Why is this risk being accepted? Include any compensating controls or mitigating factors…"
            style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:12px;resize:vertical;box-sizing:border-box">${escH(m.rationale)}</textarea>
        </div>

        <div style="margin-bottom:1.5rem">
          <label style="font-size:11px;font-weight:700;color:var(--text);display:block;margin-bottom:4px">Review Date</label>
          <input type="date" value="${m.reviewDate || defaultReview}"
            oninput="rrModalField('reviewDate',this.value)"
            style="padding:8px 10px;border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:12px">
          <div style="font-size:10px;color:var(--muted);margin-top:3px">Default: 1 year from today. Risk registers with overdue reviews are flagged automatically.</div>
        </div>

        <div style="display:flex;gap:0.5rem;justify-content:flex-end">
          <button class="btn btn-outline" onclick="rrCloseModal()">Cancel</button>
          <button id="rrAcceptBtn" class="btn btn-primary" onclick="rrSubmitAccept()">Accept Risk</button>
        </div>
      </div>
    </div>`;
}
