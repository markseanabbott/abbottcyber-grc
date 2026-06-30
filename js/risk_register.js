// ============================================================
// risk_register.js  —  Risk Register module (PATCH_015 schema)
//
// Architecture:
//  - POAM-sourced rows: read-only for title/status/inherent; residual/owner/notes editable
//  - Manual rows:       full CRUD
//  - Sync from POAM:    called after every cisSavePoam() save
// ============================================================

let rrState = {
  rows:      [],
  loading:   false,
  orgId:     null,
  filter:    'all',
  modal:     null,     // { type:'add'|'accept', row? }
  editingId: null,     // row id currently in inline-edit mode
};

// ─── LOAD ────────────────────────────────────────────────────────────────────

async function rrLoad() {
  if (!currentOrg?.id) return;
  rrState.loading = true;
  rrState.orgId   = currentOrg.id;
  try {
    const rows = await sb.riskRegister.getForOrg(currentOrg.id);
    rrState.rows = Array.isArray(rows) ? rows : [];
  } catch(e) {
    rrState.rows = [];
  }
  rrState.loading = false;
}

// ─── RENDER ROOT ─────────────────────────────────────────────────────────────

function renderRiskRegister() {
  if (rrState.loading) return rrLoadingShell();

  const counts   = rrCounts();
  const filtered = rrFilteredRows();

  return `
<div class="module-wrap">

  <div class="module-header">
    <div>
      <div class="module-title">Risk Register</div>
      <div class="module-sub">Consolidated view of identified risks — POAM gaps and manual entries</div>
    </div>
    <div style="display:flex;gap:.5rem;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="rrSyncFromPoam()" title="Pull latest CIS POAM gaps into the register">↻ CIS POAM</button>
      <button class="btn btn-outline btn-sm" onclick="rrSyncFromAiPoam()" title="Pull latest AI Governance POAM into the register">↻ AI Gov</button>
      <button class="btn btn-outline btn-sm" onclick="rrExportExcel()">↓ Excel</button>
      <button class="btn btn-cyan btn-sm" onclick="rrOpenAdd()">+ Add Risk</button>
    </div>
  </div>

  ${rrStatCards(counts)}

  <div class="card" style="margin-top:1.25rem">
    ${rrFilterTabs(counts)}
    ${filtered.length === 0 ? rrEmpty() : rrTable(filtered)}
  </div>

</div>
${rrModalHtml()}
`;
}

function rrLoadingShell() {
  return `<div class="module-wrap"><div style="text-align:center;padding:3rem;color:var(--muted)">
    <div class="spinner" style="border-color:rgba(21,33,104,0.2);border-top-color:var(--navy);width:24px;height:24px;margin:0 auto 1rem"></div>
    <div style="font-size:13px;font-weight:700;color:var(--text)">Loading risk register…</div>
  </div></div>`;
}

// ─── STAT CARDS ──────────────────────────────────────────────────────────────

function rrCounts() {
  const all = rrState.rows;
  return {
    all:         all.length,
    open:        all.filter(r => r.risk_status === 'Open').length,
    inProgress:  all.filter(r => r.risk_status === 'In Progress').length,
    accepted:    all.filter(r => r.risk_status === 'Accepted').length,
    closed:      all.filter(r => r.risk_status === 'Closed').length,
    transferred: all.filter(r => r.risk_status === 'Transferred').length,
  };
}

function rrStatCards(c) {
  const cards = [
    { label:'Open',        val: c.open,        color:'#dc2626' },
    { label:'In Progress', val: c.inProgress,   color:'#ea580c' },
    { label:'Accepted',    val: c.accepted,     color:'#7c3aed' },
    { label:'Closed',      val: c.closed,       color:'#15803d' },
    { label:'Transferred', val: c.transferred,  color:'var(--muted)' },
  ];
  return `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:.75rem;margin-top:1.25rem">
    ${cards.map(s => `
      <div class="card" style="padding:1rem;text-align:center">
        <div style="font-size:1.75rem;font-weight:800;color:${s.color}">${s.val}</div>
        <div style="font-size:11px;color:var(--muted);font-weight:600;margin-top:.2rem">${s.label}</div>
      </div>`).join('')}
  </div>`;
}

// ─── FILTER TABS ─────────────────────────────────────────────────────────────

function rrFilterTabs(c) {
  const tabs = [
    { id:'all',         label:`All (${c.all})` },
    { id:'Open',        label:`Open (${c.open})` },
    { id:'In Progress', label:`In Progress (${c.inProgress})` },
    { id:'Accepted',    label:`Accepted (${c.accepted})` },
    { id:'Closed',      label:`Closed (${c.closed})` },
    { id:'Transferred', label:`Transferred (${c.transferred})` },
  ];
  return `<div class="view-tabs" style="border-bottom:1px solid var(--border);margin-bottom:0">
    ${tabs.map(t => `<button class="view-tab${rrState.filter===t.id?' active':''}" onclick="rrSetFilter('${t.id}')">${t.label}</button>`).join('')}
  </div>`;
}

function rrSetFilter(f) {
  rrState.filter = f;
  rrRefresh();
}

function rrFilteredRows() {
  const f = rrState.filter;
  const rows = rrState.rows;
  if (f === 'all') return rows;
  return rows.filter(r => r.risk_status === f);
}

// ─── TABLE ───────────────────────────────────────────────────────────────────

function rrTable(rows) {
  const rOrder = { Critical:0, High:1, Medium:2, Low:3 };
  const sorted = [...rows].sort((a, b) => {
    const ra = rOrder[a.inherent_risk_rating] ?? 4;
    const rb = rOrder[b.inherent_risk_rating] ?? 4;
    if (ra !== rb) return ra - rb;
    return (a.safeguard_id || 'z').localeCompare(b.safeguard_id || 'z');
  });

  return `<div style="overflow-x:auto">
  <table style="width:100%;border-collapse:collapse;font-size:12.5px">
    <thead>
      <tr style="border-bottom:2px solid var(--border);text-align:left">
        <th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px;white-space:nowrap">ID</th>
        <th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px;white-space:nowrap">Source</th>
        <th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px;white-space:nowrap">Ref</th>
        <th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px">Risk</th>
        <th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px;white-space:nowrap">Inherent</th>
        <th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px;white-space:nowrap">Residual</th>
        <th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px">Status</th>
        <th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px">Owner</th>
        <th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px;white-space:nowrap">Due</th>
        <th style="padding:.6rem .75rem;color:var(--muted);font-weight:700;font-size:11px">Actions</th>
      </tr>
    </thead>
    <tbody>
      ${sorted.map(r => rrRow(r)).join('')}
    </tbody>
  </table>
  </div>`;
}

function rrRow(r) {
  const isPoam     = r.source === 'cis_poam';
  const isAiPoam   = r.source === 'ai_poam';
  const idx        = rrState.rows.findIndex(x => x.id === r.id);
  const isEditing  = rrState.editingId === r.id;

  const isTabletop  = r.source === 'tabletop';
  const sourceBadge = isPoam
    ? `<span class="badge b-navy" style="font-size:10px;padding:2px 7px">CIS POAM</span>`
    : isAiPoam
    ? `<span class="badge b-cyan" style="font-size:10px;padding:2px 7px">AI Gov</span>`
    : isTabletop
    ? `<span class="badge" style="font-size:10px;padding:2px 7px;background:#fef3c7;color:#92400e;border:1px solid #fcd34d">Tabletop AAR</span>`
    : `<span class="badge" style="font-size:10px;padding:2px 7px;background:#f3f4f6;color:#374151">Manual</span>`;

  const refVal = r.safeguard_id || (r.control_number ? 'CIS ' + r.control_number : null);
  const ref = refVal
    ? `<span style="font-family:monospace;font-size:12px;font-weight:700;color:var(--navy)">${esc(refVal)}</span>`
    : `<span style="color:var(--muted)">—</span>`;

  const threatBadgeColor = { Internal: '#92400e', External: '#1d4ed8', Natural: '#15803d', 'Third-Party': '#6d28d9' };
  const threatChip = r.threat_source
    ? `<span style="font-size:10px;font-weight:600;padding:1px 7px;border-radius:10px;background:${threatBadgeColor[r.threat_source] || '#475569'}18;color:${threatBadgeColor[r.threat_source] || '#475569'};border:1px solid ${threatBadgeColor[r.threat_source] || '#475569'}30;margin-right:4px">${esc(r.threat_source)}</span>`
    : '';
  const titleDisplay = `<div style="font-weight:600;color:var(--text);line-height:1.3">${esc(r.risk_title || '—')}</div>
    ${r.risk_description ? `<div style="font-size:11px;color:var(--muted);margin-top:2px;line-height:1.4;max-width:320px">${esc(r.risk_description)}</div>` : ''}
    ${threatChip ? `<div style="margin-top:4px">${threatChip}</div>` : ''}`;

  if (isEditing) {
    const iSel = (field, opts, val) => {
      const options = ['', ...opts].map(o => `<option value="${o}"${o===val?' selected':''}>${o||'— select —'}</option>`).join('');
      return `<select id="rr_il_${r.id}_${field}" style="width:100%;padding:3px 6px;border:1px solid var(--border);border-radius:5px;font-size:12px;background:#fff;box-sizing:border-box">${options}</select>`;
    };
    const iText = (field, val, placeholder) =>
      `<input id="rr_il_${r.id}_${field}" type="text" value="${esc(val)}" placeholder="${placeholder||''}"
        style="width:100%;padding:3px 6px;border:1px solid var(--border);border-radius:5px;font-size:12px;box-sizing:border-box">`;
    const iDate = (field, val) =>
      `<input id="rr_il_${r.id}_${field}" type="date" value="${esc(val)}"
        style="width:100%;padding:3px 6px;border:1px solid var(--border);border-radius:5px;font-size:12px;box-sizing:border-box">`;

    const riskCell = (isPoam || isAiPoam)
      ? `${titleDisplay}
         <div style="margin-top:5px">${iSel('threat_source',['Internal','External','Natural','Third-Party'], r.threat_source||'')}</div>`
      : `<div>${iText('title', r.risk_title||'', 'Risk title')}</div>
         <div style="margin-top:3px">${iText('desc', r.risk_description||'', 'Description')}</div>
         <div style="margin-top:3px">${iSel('threat_source',['Internal','External','Natural','Third-Party'], r.threat_source||'')}</div>`;

    const inherentCell = (isPoam || isAiPoam)
      ? rrRatingBadge(r.inherent_risk_rating)
      : iSel('inherent',['Critical','High','Medium','Low'], r.inherent_risk_rating||'');

    const statusCell = (isPoam || isAiPoam)
      ? rrStatusBadge(r.risk_status)
      : iSel('status',['Open','In Progress','Accepted','Closed','Transferred'], r.risk_status||'Open');

    const actionsCell = `
      <div style="display:flex;flex-direction:column;gap:.35rem;min-width:155px">
        <div style="display:flex;gap:.3rem">
          <button id="rr_inline_save_${r.id}" class="btn btn-cyan btn-sm" onclick="rrSaveInline('${r.id}')">💾 Save</button>
          <button class="btn btn-outline btn-sm" onclick="rrCancelEdit()">✕</button>
        </div>
        <textarea id="rr_il_${r.id}_notes" rows="2" placeholder="Treatment notes"
          style="width:100%;padding:3px 6px;border:1px solid var(--border);border-radius:5px;font-size:11.5px;resize:vertical;font-family:inherit;box-sizing:border-box">${esc(r.treatment_notes||'')}</textarea>
      </div>`;

    return `<tr style="border-bottom:1px solid var(--border);vertical-align:top;background:#f0f6ff">
      <td style="padding:.5rem .75rem;white-space:nowrap"><span style="font-family:monospace;font-size:11px;font-weight:700;color:var(--muted)">${esc(r.risk_id || '—')}</span></td>
      <td style="padding:.5rem .75rem">${sourceBadge}</td>
      <td style="padding:.5rem .75rem">${ref}</td>
      <td style="padding:.5rem .75rem;min-width:220px">${riskCell}</td>
      <td style="padding:.5rem .75rem">${inherentCell}</td>
      <td style="padding:.5rem .75rem">${iSel('residual',['Critical','High','Medium','Low'], r.residual_risk_rating||'')}</td>
      <td style="padding:.5rem .75rem">${statusCell}</td>
      <td style="padding:.5rem .75rem">${iText('owner', r.risk_owner||'', 'Owner')}</td>
      <td style="padding:.5rem .75rem">${iDate('due', r.due_date||'')}</td>
      <td style="padding:.5rem .75rem">${actionsCell}</td>
    </tr>`;
  }

  const actions = (isPoam || isAiPoam)
    ? `<div style="display:flex;gap:.4rem;flex-wrap:nowrap">
        <button class="btn btn-outline btn-sm" onclick="rrStartEdit('${r.id}')">Edit</button>
        <button class="btn btn-outline btn-sm" onclick="setNav('${isPoam ? 'cis' : 'ai_unified'}')" title="Manage status in the POAM" style="white-space:nowrap">→ POAM</button>
       </div>`
    : `<div style="display:flex;gap:.4rem;flex-wrap:nowrap">
        ${(r.risk_status !== 'Accepted' && r.risk_status !== 'Closed')
          ? `<button class="btn btn-outline btn-sm" onclick="rrOpenAccept(${idx})">Accept</button>`
          : ''}
        <button class="btn btn-outline btn-sm" onclick="rrStartEdit('${r.id}')">Edit</button>
        <button class="btn btn-red btn-sm" onclick="rrDeleteManual('${r.id}')">Del</button>
       </div>`;

  return `<tr style="border-bottom:1px solid var(--border);vertical-align:middle">
    <td style="padding:.65rem .75rem;white-space:nowrap"><span style="font-family:monospace;font-size:11px;font-weight:700;color:var(--muted)">${esc(r.risk_id || '—')}</span></td>
    <td style="padding:.65rem .75rem">${sourceBadge}</td>
    <td style="padding:.65rem .75rem">${ref}</td>
    <td style="padding:.65rem .75rem;min-width:220px">${titleDisplay}</td>
    <td style="padding:.65rem .75rem">${rrRatingBadge(r.inherent_risk_rating)}</td>
    <td style="padding:.65rem .75rem">${rrRatingBadge(r.residual_risk_rating)}</td>
    <td style="padding:.65rem .75rem">${rrStatusBadge(r.risk_status)}</td>
    <td style="padding:.65rem .75rem;color:var(--text);font-size:12px">${esc(r.risk_owner || '—')}</td>
    <td style="padding:.65rem .75rem;color:var(--muted);font-size:12px;white-space:nowrap">${r.due_date || '—'}</td>
    <td style="padding:.65rem .75rem">${actions}</td>
  </tr>`;
}

function rrEmpty() {
  const isFiltered = rrState.filter !== 'all';
  return `<div style="text-align:center;padding:3rem;color:var(--muted)">
    <div style="font-size:2rem;margin-bottom:.5rem">📋</div>
    <div style="font-weight:700;color:var(--text);margin-bottom:.25rem">
      ${isFiltered ? `No ${esc(rrState.filter)} risks` : 'No risks logged yet'}
    </div>
    <div style="font-size:13px">
      ${isFiltered
        ? `Switch to "All" to see other statuses.`
        : `Save a CIS POAM or AI Governance POAM to populate from gaps, or click <strong>Add Risk</strong> for manual entries.`}
    </div>
  </div>`;
}

// ─── BADGES ──────────────────────────────────────────────────────────────────

function rrRatingBadge(r) {
  if (!r) return `<span style="color:var(--muted);font-size:11px">—</span>`;
  const map = {
    Critical: 'background:#fef2f2;color:#dc2626;border:1px solid #fecaca',
    High:     'background:#fff7ed;color:#ea580c;border:1px solid #fed7aa',
    Medium:   'background:#fefce8;color:#b45309;border:1px solid #fde68a',
    Low:      'background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0',
  };
  const style = map[r] || 'background:#f3f4f6;color:#374151;border:1px solid #e5e7eb';
  return `<span style="display:inline-block;padding:2px 9px;border-radius:99px;font-size:11px;font-weight:700;${style}">${esc(r)}</span>`;
}

function rrStatusBadge(s) {
  const map = {
    'Open':        'background:#fef2f2;color:#dc2626;border:1px solid #fecaca',
    'In Progress': 'background:#fff7ed;color:#ea580c;border:1px solid #fed7aa',
    'Accepted':    'background:#f5f3ff;color:#7c3aed;border:1px solid #ddd6fe',
    'Closed':      'background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0',
    'Transferred': 'background:#f3f4f6;color:#374151;border:1px solid #e5e7eb',
  };
  const style = map[s] || 'background:#f3f4f6;color:#374151';
  return `<span style="display:inline-block;padding:2px 9px;border-radius:99px;font-size:11px;font-weight:700;${style}">${esc(s) || '—'}</span>`;
}

// ─── MODALS ───────────────────────────────────────────────────────────────────

function rrModalHtml() {
  const m = rrState.modal;
  if (!m) return '';

  let body = '';
  if (m.type === 'add')    body = rrModalAdd();
  else if (m.type === 'accept') body = rrModalAccept(m.row);

  return `<div class="modal-backdrop" id="rrModal" onclick="if(event.target===this)rrCloseModal()" style="display:flex">
    <div class="modal-box" style="max-width:520px;width:92%">${body}</div>
  </div>`;
}

function rrModalAdd() {
  return `
  <div class="modal-header"><span>Add Manual Risk</span><button class="modal-close" onclick="rrCloseModal()">✕</button></div>
  <div class="modal-body" style="display:grid;gap:.75rem">
    ${rrField('risk_title','Risk Title','text','',true)}
    ${rrField('risk_description','Description','textarea','')}
    ${rrSelect('threat_source','Threat Source',['Internal','External','Natural','Third-Party'],'')}
    ${rrSelect('inherent_risk_rating','Inherent Risk Rating',['Critical','High','Medium','Low'],'')}
    ${rrSelect('residual_risk_rating','Residual Risk Rating (after controls)',['Critical','High','Medium','Low'],'')}
    ${rrField('risk_owner','Owner / Assigned To','text','')}
    ${rrField('due_date','Due Date','date','')}
    ${rrField('treatment_notes','Treatment Notes','textarea','')}
  </div>
  <div class="modal-footer">
    <button class="btn btn-outline btn-sm" onclick="rrCloseModal()">Cancel</button>
    <button class="btn btn-cyan btn-sm" id="rrSaveBtn" onclick="rrSubmitAdd()">Add Risk</button>
  </div>`;
}

function rrModalEditNotes(r) {
  const isAiPoam = r.source === 'ai_poam';
  const sourceLine = isAiPoam
    ? `<span class="badge b-cyan" style="font-size:10px">AI Gov</span>&nbsp;<strong style="color:var(--text)">${esc(r.risk_title || r.safeguard_id || '')}</strong> — status is managed in the AI Governance POAM.`
    : `<span class="badge b-navy" style="font-size:10px">CIS POAM</span>&nbsp;<strong style="color:var(--text)">${esc(r.risk_title || r.safeguard_id || '')}</strong> — status and title are managed in the POAM.`;
  return `
  <div class="modal-header"><span>Edit Risk Notes</span><button class="modal-close" onclick="rrCloseModal()">✕</button></div>
  <div style="padding:.5rem 1.5rem .25rem;font-size:12px;color:var(--muted)">
    ${sourceLine}
  </div>
  <div class="modal-body" style="display:grid;gap:.75rem">
    ${rrSelect('threat_source','Threat Source',['Internal','External','Natural','Third-Party'], r.threat_source || '')}
    ${rrSelect('residual_risk_rating','Residual Risk Rating (your professional judgement)',['Critical','High','Medium','Low'],r.residual_risk_rating || '')}
    ${rrField('risk_owner','Owner / Assigned To','text', r.risk_owner || '')}
    ${rrField('due_date','Due Date','date', r.due_date || '')}
    ${rrField('treatment_notes','Treatment Notes','textarea', r.treatment_notes || '')}
  </div>
  <div class="modal-footer">
    <button class="btn btn-outline btn-sm" onclick="rrCloseModal()">Cancel</button>
    <button class="btn btn-cyan btn-sm" id="rrSaveBtn" onclick="rrSubmitEditNotes('${r.id}')">Save</button>
  </div>`;
}

function rrModalEditManual(r) {
  return `
  <div class="modal-header"><span>Edit Risk</span><button class="modal-close" onclick="rrCloseModal()">✕</button></div>
  <div class="modal-body" style="display:grid;gap:.75rem">
    ${rrField('risk_title','Risk Title','text', r.risk_title || '', true)}
    ${rrField('risk_description','Description','textarea', r.risk_description || '')}
    ${rrSelect('threat_source','Threat Source',['Internal','External','Natural','Third-Party'], r.threat_source || '')}
    ${rrSelect('inherent_risk_rating','Inherent Risk Rating',['Critical','High','Medium','Low'], r.inherent_risk_rating || '')}
    ${rrSelect('residual_risk_rating','Residual Risk Rating',['Critical','High','Medium','Low'], r.residual_risk_rating || '')}
    ${rrSelect('risk_status','Status',['Open','In Progress','Accepted','Closed','Transferred'], r.risk_status || 'Open')}
    ${rrField('risk_owner','Owner / Assigned To','text', r.risk_owner || '')}
    ${rrField('due_date','Due Date','date', r.due_date || '')}
    ${rrField('treatment_notes','Treatment Notes','textarea', r.treatment_notes || '')}
  </div>
  <div class="modal-footer">
    <button class="btn btn-outline btn-sm" onclick="rrCloseModal()">Cancel</button>
    <button class="btn btn-cyan btn-sm" id="rrSaveBtn" onclick="rrSubmitEditManual('${r.id}')">Save</button>
  </div>`;
}

function rrModalAccept(r) {
  const oneYear = new Date();
  oneYear.setFullYear(oneYear.getFullYear() + 1);
  const defDate = oneYear.toISOString().split('T')[0];
  return `
  <div class="modal-header"><span>Accept Risk</span><button class="modal-close" onclick="rrCloseModal()">✕</button></div>
  <div style="padding:.5rem 1.5rem .25rem">
    <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:.75rem 1rem;font-size:12.5px;color:#5b21b6;line-height:1.5">
      <strong>Accepted</strong> means the organization has formally decided to live with this risk — not that it has been fixed.
      Use <strong>Closed</strong> (via Edit) once the risk has been remediated.
    </div>
  </div>
  <div class="modal-body" style="display:grid;gap:.75rem">
    ${rrField('accepted_by','Accepted By (name / role)','text','',true)}
    ${rrField('acceptance_rationale','Rationale','textarea','',true)}
    ${rrField('acceptance_review_date','Schedule Review Date','date', defDate)}
  </div>
  <div class="modal-footer">
    <button class="btn btn-outline btn-sm" onclick="rrCloseModal()">Cancel</button>
    <button class="btn btn-sm" style="background:#7c3aed;color:#fff;border:none;border-radius:7px;padding:7px 18px;font-weight:700;cursor:pointer" id="rrSaveBtn" onclick="rrSubmitAccept('${r.id}')">Accept Risk</button>
  </div>`;
}

// ─── FORM HELPERS ─────────────────────────────────────────────────────────────

function rrField(id, label, type, val, required) {
  const req = required ? ' *' : '';
  if (type === 'textarea') {
    return `<div>
      <label style="font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}${req}</label>
      <textarea id="rr_${id}" rows="3" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:7px;font-size:13px;resize:vertical;font-family:inherit;box-sizing:border-box">${esc(val)}</textarea>
    </div>`;
  }
  return `<div>
    <label style="font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}${req}</label>
    <input id="rr_${id}" type="${type}" value="${esc(val)}" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:7px;font-size:13px;box-sizing:border-box"/>
  </div>`;
}

function rrSelect(id, label, opts, val) {
  const options = ['', ...opts].map(o =>
    `<option value="${o}"${o === val ? ' selected' : ''}>${o || '— select —'}</option>`
  ).join('');
  return `<div>
    <label style="font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px">${label}</label>
    <select id="rr_${id}" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:7px;font-size:13px;background:#fff;box-sizing:border-box">${options}</select>
  </div>`;
}

function rrVal(id) {
  const el = document.getElementById(`rr_${id}`);
  return el ? el.value.trim() : '';
}

// ─── OPEN MODALS ─────────────────────────────────────────────────────────────

function rrOpenAdd() {
  rrState.modal = { type: 'add' };
  rrRefresh();
}

function rrOpenEditNotes(idx) {
  rrState.modal = { type: 'editNotes', row: rrState.rows[idx] };
  rrRefresh();
}

function rrOpenEditManual(idx) {
  rrState.modal = { type: 'editManual', row: rrState.rows[idx] };
  rrRefresh();
}

function rrOpenAccept(idx) {
  rrState.modal = { type: 'accept', row: rrState.rows[idx] };
  rrRefresh();
}

function rrCloseModal() {
  rrState.modal = null;
  rrRefresh();
}

function rrRefresh() {
  const el = document.getElementById('mainContent');
  if (el && activeNav === 'riskregister') el.innerHTML = renderRiskRegister();
}

// ─── SUBMIT HANDLERS ─────────────────────────────────────────────────────────

async function rrSubmitAdd() {
  const title = rrVal('risk_title');
  if (!title) { toast('Risk title is required', '#dc2626'); return; }
  const btn = document.getElementById('rrSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  try {
    const row = {
      org_id:               currentOrg.id,
      source:               'manual',
      risk_title:           title,
      risk_description:     rrVal('risk_description') || null,
      threat_source:        rrVal('threat_source') || null,
      inherent_risk_rating: rrVal('inherent_risk_rating') || null,
      residual_risk_rating: rrVal('residual_risk_rating') || null,
      risk_owner:           rrVal('risk_owner') || null,
      due_date:             rrVal('due_date') || null,
      treatment_notes:      rrVal('treatment_notes') || null,
      risk_status:          'Open',
    };
    const result = await sb.riskRegister.add(row);
    const newRow = Array.isArray(result) ? result[0] : result;
    if (newRow) rrState.rows.push(newRow);
    rrState.modal = null;
    toast('Risk added', '#15803d');
    rrRefresh();
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Add Risk'; }
  }
}

async function rrSubmitEditNotes(id) {
  const btn = document.getElementById('rrSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  try {
    const patch = {
      threat_source:        rrVal('threat_source') || null,
      residual_risk_rating: rrVal('residual_risk_rating') || null,
      risk_owner:           rrVal('risk_owner') || null,
      due_date:             rrVal('due_date') || null,
      treatment_notes:      rrVal('treatment_notes') || null,
    };
    await sb.riskRegister.update(id, patch);
    const idx = rrState.rows.findIndex(r => r.id === id);
    if (idx >= 0) Object.assign(rrState.rows[idx], patch);
    rrState.modal = null;
    toast('Notes saved', '#15803d');
    rrRefresh();
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Save'; }
  }
}

async function rrSubmitEditManual(id) {
  const title = rrVal('risk_title');
  if (!title) { toast('Risk title is required', '#dc2626'); return; }
  const btn = document.getElementById('rrSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  try {
    const patch = {
      risk_title:           title,
      risk_description:     rrVal('risk_description') || null,
      threat_source:        rrVal('threat_source') || null,
      inherent_risk_rating: rrVal('inherent_risk_rating') || null,
      residual_risk_rating: rrVal('residual_risk_rating') || null,
      risk_status:          rrVal('risk_status') || 'Open',
      risk_owner:           rrVal('risk_owner') || null,
      due_date:             rrVal('due_date') || null,
      treatment_notes:      rrVal('treatment_notes') || null,
    };
    await sb.riskRegister.update(id, patch);
    const idx = rrState.rows.findIndex(r => r.id === id);
    if (idx >= 0) Object.assign(rrState.rows[idx], patch);
    rrState.modal = null;
    toast('Risk updated', '#15803d');
    rrRefresh();
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Save'; }
  }
}

async function rrSubmitAccept(id) {
  const acceptedBy = rrVal('accepted_by');
  const rationale  = rrVal('acceptance_rationale');
  if (!acceptedBy || !rationale) { toast('Accepted by and rationale are required', '#dc2626'); return; }
  const btn = document.getElementById('rrSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  try {
    const patch = {
      risk_status:            'Accepted',
      accepted_by:            acceptedBy,
      acceptance_rationale:   rationale,
      acceptance_date:        new Date().toISOString(),
      acceptance_review_date: rrVal('acceptance_review_date') || null,
    };
    await sb.riskRegister.update(id, patch);
    const idx = rrState.rows.findIndex(r => r.id === id);
    if (idx >= 0) Object.assign(rrState.rows[idx], patch);
    rrState.modal = null;
    toast('Risk accepted', '#7c3aed');
    rrRefresh();
  } catch(e) {
    toast('Accept failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Accept Risk'; }
  }
}

async function rrDeleteManual(id) {
  if (!confirm('Delete this risk entry? This cannot be undone.')) return;
  try {
    await sb.riskRegister.delete(id);
    rrState.rows = rrState.rows.filter(r => r.id !== id);
    toast('Risk deleted', '#15803d');
    rrRefresh();
  } catch(e) {
    toast('Delete failed: ' + e.message, '#dc2626');
  }
}

// ─── INLINE EDIT ─────────────────────────────────────────────────────────────

function rrStartEdit(id) {
  rrState.editingId = id;
  rrRefresh();
}

function rrCancelEdit() {
  rrState.editingId = null;
  rrRefresh();
}

function rrInlineVal(id, field) {
  const el = document.getElementById(`rr_il_${id}_${field}`);
  return el ? el.value.trim() : '';
}

async function rrSaveInline(id) {
  const row = rrState.rows.find(r => r.id === id);
  if (!row) return;
  const isPoam = row.source === 'cis_poam' || row.source === 'ai_poam';
  const saveBtn = document.getElementById(`rr_inline_save_${id}`);
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '…'; }
  try {
    const patch = {
      threat_source:        rrInlineVal(id, 'threat_source') || null,
      residual_risk_rating: rrInlineVal(id, 'residual') || null,
      risk_owner:           rrInlineVal(id, 'owner') || null,
      due_date:             rrInlineVal(id, 'due') || null,
      treatment_notes:      rrInlineVal(id, 'notes') || null,
    };
    if (!isPoam) {
      const title = rrInlineVal(id, 'title');
      if (!title) { toast('Risk title is required', '#dc2626'); if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '💾 Save'; } return; }
      Object.assign(patch, {
        risk_title:           title,
        risk_description:     rrInlineVal(id, 'desc') || null,
        inherent_risk_rating: rrInlineVal(id, 'inherent') || null,
        risk_status:          rrInlineVal(id, 'status') || 'Open',
      });
    }
    await sb.riskRegister.update(id, patch);
    const idx = rrState.rows.findIndex(r => r.id === id);
    if (idx >= 0) Object.assign(rrState.rows[idx], patch);
    rrState.editingId = null;
    toast('Saved', '#15803d');
    rrRefresh();
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '💾 Save'; }
  }
}

// ─── SYNC FROM POAM ──────────────────────────────────────────────────────────
// Manual trigger for rr_e: pulls latest CIS assessment POAM into the register.
// Useful after PATCH_015 migration (existing POAM won't appear until a re-save).

async function rrSyncFromPoam() {
  if (!currentOrg?.id) return;
  const cisSessions = (typeof orgAssessments !== 'undefined' && orgAssessments[currentOrg.id])
    ? (orgAssessments[currentOrg.id]['cis'] || [])
    : [];
  if (!cisSessions.length) {
    toast('No CIS assessment found for this org', '#ea580c');
    return;
  }
  // Sort oldest→newest so the most recent POAM data wins on upsert conflicts
  const sorted = [...cisSessions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const syncBtn = document.querySelector('[onclick="rrSyncFromPoam()"]');
  if (syncBtn) { syncBtn.disabled = true; syncBtn.textContent = '↻ Syncing…'; }
  try {
    // Sync all assessments — POAM items may be on any assessment, not just the latest
    for (const session of sorted) {
      await sb.riskRegister.sync(currentOrg.id, session.id);
    }
    // Reload rows
    const rows = await sb.riskRegister.getForOrg(currentOrg.id);
    rrState.rows = Array.isArray(rows) ? rows : [];
    rrState.orgId = currentOrg.id;
    toast('Risk register synced from CIS POAM', '#15803d');
    rrRefresh();
  } catch(e) {
    console.error('rrSyncFromPoam failed:', e);
    toast('Sync failed: ' + e.message, '#dc2626');
    if (syncBtn) { syncBtn.disabled = false; syncBtn.textContent = '↻ CIS POAM'; }
  }
}

async function rrSyncFromAiPoam() {
  if (!currentOrg?.id) return;
  const aiSessions = (typeof orgAssessments !== 'undefined' && orgAssessments[currentOrg.id])
    ? (orgAssessments[currentOrg.id]['ai_unified'] || [])
    : [];
  const withPoam = [...aiSessions]
    .filter(r => r.answers?._poam)
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // oldest→newest, most recent wins
  if (!withPoam.length) {
    toast('No AI Governance POAM found — open a POAM and save it first', '#ea580c');
    return;
  }
  const syncBtn = document.querySelector('[onclick="rrSyncFromAiPoam()"]');
  if (syncBtn) { syncBtn.disabled = true; syncBtn.textContent = '↻ Syncing…'; }
  try {
    for (const session of withPoam) {
      const poamData = JSON.parse(session.answers._poam || '{}');
      const items = [];
      for (const [ctrlId, poamItem] of Object.entries(poamData)) {
        if (!poamItem?.status) continue;
        const ctrl = (typeof AI_UNIFIED_CONTROLS !== 'undefined' ? AI_UNIFIED_CONTROLS : []).find(c => c.id === ctrlId);
        if (!ctrl) continue;
        const riskStatus = poamItem.status === 'complete' ? 'Closed'
          : poamItem.status === 'accepted' ? 'Accepted'
          : poamItem.status === 'in_progress' ? 'In Progress'
          : 'Open';
        const w = ctrl.weight || 3;
        const inherent = w >= 5 ? 'Critical' : w >= 4 ? 'High' : w >= 3 ? 'Medium' : 'Low';
        items.push({
          safeguard_id:         ctrlId,
          risk_title:           ctrl.title,
          risk_description:     ctrl.desc || ctrl.title,
          inherent_risk_rating: inherent,
          risk_status:          riskStatus,
          risk_owner:           poamItem.owner || '',
          treatment_notes:      poamItem.notes || '',
          due_date:             poamItem.targetDate || '',
        });
      }
      if (items.length) await sb.riskRegister.syncAi(currentOrg.id, session.id, items);
    }
    const rows = await sb.riskRegister.getForOrg(currentOrg.id);
    rrState.rows = Array.isArray(rows) ? rows : [];
    rrState.orgId = currentOrg.id;
    toast('Risk register synced from AI Governance POAM', '#15803d');
    rrRefresh();
  } catch(e) {
    console.error('rrSyncFromAiPoam failed:', e);
    toast('Sync failed: ' + e.message, '#dc2626');
    if (syncBtn) { syncBtn.disabled = false; syncBtn.textContent = '↻ AI Gov'; }
  }
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────

function rrExportExcel() {
  const rows = rrState.rows;
  if (!rows.length) { toast('No risks to export', '#ea580c'); return; }

  const sourceLabel = s =>
    s === 'cis_poam'  ? 'CIS POAM'     :
    s === 'ai_poam'   ? 'AI Gov'        :
    s === 'tabletop'  ? 'Tabletop AAR'  : 'Manual';

  const rOrder = { Critical:0, High:1, Medium:2, Low:3 };
  const sorted = [...rows].sort((a, b) => {
    const ra = rOrder[a.inherent_risk_rating] ?? 4;
    const rb = rOrder[b.inherent_risk_rating] ?? 4;
    return ra !== rb ? ra - rb : (a.safeguard_id || 'z').localeCompare(b.safeguard_id || 'z');
  });

  const data = sorted.map(r => ({
    'Risk ID':              r.risk_id || '',
    'Source':               sourceLabel(r.source),
    'Ref':                  r.safeguard_id || (r.control_number ? 'CIS ' + r.control_number : ''),
    'Risk Title':           r.risk_title || '',
    'Description':          r.risk_description || '',
    'Threat Source':        r.threat_source || '',
    'Inherent Rating':      r.inherent_risk_rating || '',
    'Residual Rating':      r.residual_risk_rating || '',
    'Status':               r.risk_status || '',
    'Owner':                r.risk_owner || '',
    'Due Date':             r.due_date || '',
    'Treatment Notes':      r.treatment_notes || '',
    'Accepted By':          r.accepted_by || '',
    'Acceptance Rationale': r.acceptance_rationale || '',
    'Review Date':          r.acceptance_review_date || '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    {wch:10},{wch:13},{wch:10},{wch:36},{wch:46},{wch:14},
    {wch:15},{wch:15},{wch:14},{wch:20},{wch:12},{wch:42},
    {wch:20},{wch:42},{wch:14},
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Risk Register');
  const orgSlug = (currentOrg?.name || 'org').replace(/[^a-z0-9]/gi, '_');
  const date    = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Risk_Register_${orgSlug}_${date}.xlsx`);
}

// ─── UTILITY ─────────────────────────────────────────────────────────────────

function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
