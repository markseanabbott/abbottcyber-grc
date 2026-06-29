// ============================================================
// SCENARIO BUILDER — Platform Admin module
// Create, edit, clone, and publish MITRE ATT&CK-mapped tabletop
// exercise scenarios stored in the tabletop_scenarios table.
// Published scenarios appear automatically in the exercise runner.
// ============================================================

// sbState declared in config.js

const SB_NIST_SHORT = ['Preparation', 'Detection', 'Containment', 'Eradication', 'Recovery', 'Post-Incident'];
const SB_NIST_PHASE_CLASSES = ['prep', 'detection', 'containment', 'eradication', 'recovery', 'post'];

const SB_INGEST_TYPES = [
  'PSA ticket',
  'SOC alert',
  'Technician anomaly',
  'SOC + technician',
  'Bank + finance team',
  'IT security + finance',
  'Legal + IT security + insurance',
];

const SB_INDUSTRIES = [
  'Hospitality',
  'Technology / SaaS',
  'Healthcare',
  'Financial Services',
  'Manufacturing',
  'Retail',
  'Professional Services',
  'Other',
];

// ---- BLANK OBJECTS ------------------------------------------------

function sbBlankScenario() {
  return {
    id: null, title: '', industry: '', difficulty: 'Medium',
    duration: '', track: 'operational', summary: '', tags: [],
    declaration: { ingest: 'PSA ticket', source: '', raw: '', correctSeverity: 'P1', correctDeclare: true },
    injects: [], status: 'draft', source_id: null, source_title: null,
  };
}

function sbBlankInject(idx, total) {
  const nextIdx = (idx + 1 < total) ? idx + 1 : null;
  return {
    ingest: 'SOC alert', title: '', body: '', phaseIdx: 1,
    correctCriticality: 'Critical',
    mitre: { tactic: '', technique: '' },
    triggersBreach: false,
    primaryRoles: ['ic', 'tl', 'cl', 'lc', 'es'],
    rolePrompts: { ic: '', tl: '', cl: '', lc: '', es: '' },
    branches: [{ id: 'default', label: 'Continue →', next_index: nextIdx }],
  };
}

// ---- INIT & LOAD --------------------------------------------------

async function sbInit() {
  if (!sbState.loaded) await sbLoadScenarios();
  sbRender();
}

async function sbLoadScenarios() {
  try {
    const rows = await sbFetch('tabletop_scenarios?order=created_at.asc', 'GET');
    sbState.scenarios = Array.isArray(rows) ? rows : [];
  } catch (e) {
    console.warn('sbLoad failed', e);
    sbState.scenarios = [];
  }
  sbState.loaded = true;
}

function sbRender() {
  const el = document.getElementById('mainContent');
  if (el && activeNav === 'scenario_builder') el.innerHTML = renderScenarioBuilder();
}

// ---- TOP-LEVEL RENDER ---------------------------------------------

function renderScenarioBuilder() {
  if (sbState.view === 'flow')   return renderSbFlow();
  if (sbState.view === 'editor') return renderSbEditor();
  return renderSbList();
}

// ---- LIST VIEW ----------------------------------------------------

function renderSbList() {
  const f = sbState.filterStatus;
  const filtered = sbState.scenarios.filter(s => f === 'all' || s.status === f);
  const builtins = typeof TT_SCENARIOS !== 'undefined' ? Object.values(TT_SCENARIOS) : [];

  return `${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;gap:12px;flex-wrap:wrap">
    <div>
      <div style="font-size:17px;font-weight:700">&#x1F3AC; Scenario Builder</div>
      <div style="font-size:12px;color:var(--muted);margin-top:2px">Create MITRE ATT&amp;CK-mapped exercise scenarios. Published scenarios appear in the exercise runner.</div>
    </div>
    <div style="display:flex;gap:8px;flex-shrink:0">
      <button class="btn btn-outline btn-sm" onclick="sbNew()">+ New scenario</button>
    </div>
  </div>

  <div class="view-tabs" style="margin-bottom:1rem">
    ${['all', 'draft', 'published'].map(s =>
      `<div class="view-tab${f === s ? ' active' : ''}" onclick="sbSetFilter('${s}')">${s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</div>`
    ).join('')}
  </div>

  ${sbState.scenarios.length === 0 ? `
    <div class="card" style="text-align:center;padding:2.5rem;color:var(--muted)">
      <div style="font-size:36px;margin-bottom:0.5rem">&#x1F3AC;</div>
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">No custom scenarios yet</div>
      <div style="font-size:12px;margin-bottom:1rem">Clone a built-in to get started, or create one from scratch.</div>
      <button class="btn btn-primary btn-sm" onclick="sbNew()">+ New scenario</button>
    </div>
  ` : `
  <div class="card" style="padding:0;overflow:hidden;margin-bottom:1.5rem">
    <table class="sb-table">
      <thead>
        <tr>
          <th>Title</th><th>Industry</th><th>Difficulty</th>
          <th style="text-align:center">Injects</th><th>Status</th>
          <th style="text-align:right">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.length === 0 ? `<tr><td colspan="6" style="padding:1.5rem;text-align:center;color:var(--muted)">No scenarios match this filter.</td></tr>` : ''}
        ${filtered.map(s => sbRenderListRow(s)).join('')}
      </tbody>
    </table>
  </div>
  `}

  <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:0.5rem">
    Built-in Scenarios — Clone to customize
  </div>
  <div class="card" style="padding:0;overflow:hidden">
    <table class="sb-table">
      <thead>
        <tr>
          <th>Title</th><th>Industry</th><th>Difficulty</th>
          <th style="text-align:center">Injects</th><th style="text-align:right">Action</th>
        </tr>
      </thead>
      <tbody>
        ${builtins.map(s => `
          <tr>
            <td>
              <div style="font-weight:600;color:var(--text)">${s.title}</div>
              <div style="font-size:10px;color:var(--muted);margin-top:1px">${(s.summary || '').slice(0, 80)}${(s.summary||'').length > 80 ? '…' : ''}</div>
            </td>
            <td style="color:var(--muted)">${s.industry || '—'}</td>
            <td>${sbDiffBadge(s.difficulty)}</td>
            <td style="text-align:center;color:var(--text)">${(s.injects || []).length}</td>
            <td style="text-align:right;white-space:nowrap">
              <div style="display:flex;gap:6px;justify-content:flex-end">
                <button class="btn btn-outline btn-sm" onclick="sbViewFlowBuiltin('${s.id}')">📊 Flow</button>
                <button class="btn btn-outline btn-sm" onclick="sbCloneBuiltin('${s.id}')">Clone →</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
}

function sbRenderListRow(s) {
  const titleSafe = (s.title || '').replace(/'/g, "\\'");
  return `<tr>
    <td>
      <div style="font-weight:600;color:var(--text)">${s.title || '(Untitled)'}</div>
      <div style="font-size:10px;color:var(--muted);margin-top:1px">${(s.summary || '').slice(0, 80)}${(s.summary||'').length > 80 ? '…' : ''}</div>
      ${s.source_title ? `<div style="font-size:10px;color:var(--muted);margin-top:2px">Cloned from: <em>${s.source_title}</em></div>` : ''}
    </td>
    <td style="color:var(--muted)">${s.industry || '—'}</td>
    <td>${sbDiffBadge(s.difficulty)}</td>
    <td style="text-align:center;color:var(--text)">${(s.injects || []).length}</td>
    <td><span class="badge ${s.status === 'published' ? 'b-green' : 'b-gray'}">${s.status === 'published' ? 'Published' : 'Draft'}</span></td>
    <td style="text-align:right">
      <div style="display:flex;gap:6px;justify-content:flex-end">
        <button class="btn btn-outline btn-sm" onclick="sbEditCustom('${s.id}')">Edit</button>
        <button class="btn btn-outline btn-sm" onclick="sbViewFlowFromList('${s.id}')">📊 Flow</button>
        <button class="btn btn-outline btn-sm" onclick="sbCloneCustom('${s.id}')">Clone</button>
        <button class="btn btn-red btn-sm" onclick="sbDeleteCustom('${s.id}','${titleSafe}')">Delete</button>
      </div>
    </td>
  </tr>`;
}

function sbDiffBadge(d) {
  if (!d) return '—';
  const cls = d === 'Hard' ? 'b-red' : d === 'Easy' ? 'b-green' : 'b-amber';
  return `<span class="badge ${cls}">${d}</span>`;
}

// ---- EDITOR VIEW --------------------------------------------------

function renderSbEditor() {
  const sc = sbState.editing;
  if (!sc) return renderSbList();
  const isNew = !sc.id;
  const totalInjects = sc.injects.length;

  return `${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;gap:12px;flex-wrap:wrap">
    <div style="display:flex;align-items:center;gap:10px">
      <button class="btn btn-outline btn-sm" onclick="sbBack()">← Scenarios</button>
      <span style="font-size:15px;font-weight:700">${isNew ? 'New Scenario' : 'Edit Scenario'}</span>
      ${sc.status === 'published' ? '<span class="badge b-green">Published</span>' : '<span class="badge b-gray">Draft</span>'}
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-outline btn-sm" onclick="sbViewFlowFromEditor()">📊 View flow</button>
      <button class="btn btn-outline btn-sm" onclick="sbSave('draft')">Save draft</button>
      <button class="btn btn-primary btn-sm" onclick="sbSave('published')">Publish</button>
    </div>
  </div>

  <!-- METADATA -->
  <div class="card" style="margin-bottom:1rem">
    <div class="card-title" style="margin-bottom:1rem">Scenario Metadata</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
      <div>
        <div class="field-lbl">Title *</div>
        <input id="sb-title" type="text" value="${sbEsc(sc.title)}" placeholder="e.g. Ransomware via Phishing"/>
      </div>
      <div>
        <div class="field-lbl">Industry</div>
        <select id="sb-industry">
          <option value="">Select industry…</option>
          ${SB_INDUSTRIES.map(i => `<option value="${i}"${sc.industry === i ? ' selected' : ''}>${i}</option>`).join('')}
        </select>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px">
      <div>
        <div class="field-lbl">Difficulty</div>
        <select id="sb-difficulty">
          ${['Easy','Medium','Hard'].map(d => `<option value="${d}"${sc.difficulty === d ? ' selected' : ''}>${d}</option>`).join('')}
        </select>
      </div>
      <div>
        <div class="field-lbl">Duration</div>
        <input id="sb-duration" type="text" value="${sbEsc(sc.duration)}" placeholder="e.g. ~90 min"/>
      </div>
      <div>
        <div class="field-lbl">Track</div>
        <select id="sb-track">
          ${['operational','executive','vendor'].map(t => `<option value="${t}"${sc.track === t ? ' selected' : ''}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div style="margin-bottom:10px">
      <div class="field-lbl">Summary (shown on exercise setup screen)</div>
      <textarea id="sb-summary" rows="2" placeholder="One-paragraph description of the scenario and learning objectives.">${sbEsc(sc.summary)}</textarea>
    </div>
    <div>
      <div class="field-lbl">Tags (comma-separated, e.g. ransomware, lateral-movement, PII)</div>
      <input id="sb-tags" type="text" value="${(sc.tags || []).join(', ')}" placeholder="ransomware, lateral-movement"/>
    </div>
  </div>

  <!-- STEP 0 — DECLARATION -->
  <div class="card" style="margin-bottom:1rem">
    <div class="card-title" style="margin-bottom:0.25rem">Step 0 — Initial Signal</div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:1rem">The raw signal that starts the exercise. The Technical Lead evaluates severity and decides whether to declare an incident.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
      <div>
        <div class="field-lbl">Ingest type</div>
        <select id="sb-decl-ingest">
          ${SB_INGEST_TYPES.map(t => `<option value="${t}"${sc.declaration.ingest === t ? ' selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
      <div>
        <div class="field-lbl">Source (who reported it)</div>
        <input id="sb-decl-source" type="text" value="${sbEsc(sc.declaration.source)}" placeholder="e.g. The Grand Hotel — front desk supervisor"/>
      </div>
    </div>
    <div style="margin-bottom:10px">
      <div class="field-lbl">Raw signal text (as received)</div>
      <textarea id="sb-decl-raw" rows="3" placeholder="Describe the raw signal exactly as the Technical Lead would receive it — no interpretation.">${sbEsc(sc.declaration.raw)}</textarea>
    </div>
    <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
      <div>
        <div class="field-lbl" style="margin-bottom:5px">Correct severity</div>
        <div style="display:flex;gap:6px">
          ${['P1','P2','P3','P4'].map(p => `
            <button class="btn btn-sm ${sc.declaration.correctSeverity === p ? 'btn-primary' : 'btn-outline'}"
              onclick="sbSetDeclSeverity('${p}')">${p}</button>
          `).join('')}
        </div>
      </div>
      <div>
        <div class="field-lbl" style="margin-bottom:5px">Should declare incident?</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm ${sc.declaration.correctDeclare ? 'btn-primary' : 'btn-outline'}" onclick="sbSetDeclDeclare(true)">Yes</button>
          <button class="btn btn-sm ${!sc.declaration.correctDeclare ? 'btn-red' : 'btn-outline'}" onclick="sbSetDeclDeclare(false)">No</button>
        </div>
      </div>
    </div>
  </div>

  <!-- INJECTS -->
  <div class="card" style="margin-bottom:1rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
      <div class="card-title" style="margin-bottom:0">Injects <span style="font-size:11px;font-weight:400;color:var(--muted)">(${totalInjects} total)</span></div>
      <button class="btn btn-outline btn-sm" onclick="sbAddInject()">+ Add inject</button>
    </div>
    ${totalInjects === 0 ? `
      <div style="text-align:center;padding:1.5rem;color:var(--muted);font-size:12px">
        No injects yet. Add your first inject above.
      </div>
    ` : sc.injects.map((inj, idx) => sbRenderInjectRow(inj, idx, totalInjects)).join('')}
  </div>

  <!-- FOOTER ACTIONS -->
  <div style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:2rem">
    <button class="btn btn-outline btn-sm" onclick="sbBack()">Cancel</button>
    <button class="btn btn-outline btn-sm" onclick="sbSave('draft')">Save draft</button>
    <button class="btn btn-primary btn-sm" onclick="sbSave('published')">Publish</button>
  </div>`;
}

// ---- INJECT ROW ---------------------------------------------------

function sbRenderInjectRow(inj, idx, totalInjects) {
  const isOpen = sbState.expandedInject === idx;
  const phaseLabel = SB_NIST_SHORT[inj.phaseIdx] || '?';
  const phaseClass = SB_NIST_PHASE_CLASSES[inj.phaseIdx] || '';
  return `
  <div class="sb-inject-row" id="sb-inj-row-${idx}">
    <div class="sb-inject-header" onclick="sbToggleInject(${idx})">
      <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
        <div class="sb-inject-num">${idx + 1}</div>
        <div class="tt-card-head ${phaseClass}" style="padding:2px 8px;border-radius:4px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#fff;flex-shrink:0">${phaseLabel}</div>
        <div style="font-weight:600;color:var(--text);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${inj.title || '<em style="color:var(--muted)">Untitled inject</em>'}</div>
        ${inj.triggersBreach ? '<span class="badge b-red" style="flex-shrink:0;font-size:9px">Breach trigger</span>' : ''}
        ${inj.mitre?.tactic ? `<span class="badge b-gray" style="flex-shrink:0;font-size:9px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${inj.mitre.tactic.split(' ').slice(0,2).join(' ')}</span>` : ''}
      </div>
      <div style="display:flex;gap:6px;align-items:center;flex-shrink:0" onclick="event.stopPropagation()">
        <button class="btn btn-outline btn-sm" onclick="sbToggleInject(${idx})">${isOpen ? 'Close' : 'Edit'}</button>
        <button class="btn btn-outline btn-sm" onclick="sbMoveInject(${idx},-1)" ${idx === 0 ? 'disabled' : ''} title="Move up">↑</button>
        <button class="btn btn-outline btn-sm" onclick="sbMoveInject(${idx},1)" ${idx === totalInjects - 1 ? 'disabled' : ''} title="Move down">↓</button>
        <button class="btn btn-red btn-sm" onclick="sbDeleteInject(${idx})">Remove</button>
      </div>
    </div>
    ${isOpen ? sbRenderInjectForm(inj, idx, totalInjects) : ''}
  </div>`;
}

// ---- INJECT FORM --------------------------------------------------

function sbRenderInjectForm(inj, idx, totalInjects) {
  const roles = [
    { id: 'ic', name: 'Incident Commander' },
    { id: 'tl', name: 'Technical Lead' },
    { id: 'cl', name: 'Communications Lead' },
    { id: 'lc', name: 'Legal / Compliance' },
    { id: 'es', name: 'Executive Sponsor' },
  ];

  return `
  <div class="sb-inject-form">
    <!-- Row 1: ingest type + title -->
    <div style="display:grid;grid-template-columns:200px 1fr;gap:10px;margin-bottom:10px">
      <div>
        <div class="field-lbl">Ingest type</div>
        <select id="sb-inj-${idx}-ingest">
          ${SB_INGEST_TYPES.map(t => `<option value="${t}"${inj.ingest === t ? ' selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
      <div>
        <div class="field-lbl">Inject title</div>
        <input id="sb-inj-${idx}-title" type="text" value="${sbEsc(inj.title)}" placeholder="e.g. EDR confirms ransomware behaviour across 4 hosts"/>
      </div>
    </div>

    <!-- Body -->
    <div style="margin-bottom:10px">
      <div class="field-lbl">Inject body (displayed to participants)</div>
      <textarea id="sb-inj-${idx}-body" rows="4" placeholder="Full scenario text — technical detail, observable data, timestamps. Written from the perspective of what's just been discovered.">${sbEsc(inj.body)}</textarea>
    </div>

    <!-- NIST phase + MITRE -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
      <div>
        <div class="field-lbl" style="margin-bottom:5px">NIST IR phase</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${SB_NIST_SHORT.map((p, pi) => `
            <button class="btn btn-sm ${inj.phaseIdx === pi ? 'btn-primary' : 'btn-outline'}"
              onclick="sbSetInjectPhase(${idx},${pi})" style="font-size:10px">${p}</button>
          `).join('')}
        </div>
      </div>
      <div>
        <div class="field-lbl" style="margin-bottom:5px">Correct criticality</div>
        <div style="display:flex;gap:5px">
          ${['Critical','High','Medium','Low'].map(c => `
            <button class="btn btn-sm ${inj.correctCriticality === c ? 'btn-primary' : 'btn-outline'}"
              onclick="sbSetInjectCrit(${idx},'${c}')" style="font-size:10px">${c}</button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- MITRE -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
      <div>
        <div class="field-lbl">MITRE tactic</div>
        <input id="sb-inj-${idx}-tactic" type="text" value="${sbEsc(inj.mitre?.tactic)}" placeholder="e.g. TA0040 Impact"/>
      </div>
      <div>
        <div class="field-lbl">MITRE technique</div>
        <input id="sb-inj-${idx}-technique" type="text" value="${sbEsc(inj.mitre?.technique)}" placeholder="e.g. T1486 Data Encrypted for Impact"/>
      </div>
    </div>

    <!-- Flags: triggers breach + primary roles -->
    <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:12px">
      <div style="display:flex;align-items:center;gap:8px">
        <input type="checkbox" id="sb-inj-${idx}-breach" ${inj.triggersBreach ? 'checked' : ''}/>
        <label for="sb-inj-${idx}-breach" style="font-size:12px;cursor:pointer;color:var(--text)">
          Triggers breach declaration gate
        </label>
      </div>
    </div>

    <!-- Primary roles -->
    <div style="margin-bottom:12px">
      <div class="field-lbl" style="margin-bottom:5px">Primary roles (active on this inject — others dimmed)</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${roles.map(r => {
          const isPrimary = (inj.primaryRoles || []).includes(r.id);
          return `<label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer">
            <input type="checkbox" data-role="${r.id}" class="sb-role-chk-${idx}" ${isPrimary ? 'checked' : ''}/>
            ${r.name}
          </label>`;
        }).join('')}
      </div>
    </div>

    <!-- Role prompts -->
    <div style="margin-bottom:12px">
      <div class="field-lbl" style="margin-bottom:6px">Role prompts (question shown to each role on their response card)</div>
      ${roles.map(r => `
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px">
          <div style="font-size:10px;font-weight:700;color:var(--text);width:120px;flex-shrink:0;padding-top:8px">${r.name}</div>
          <textarea id="sb-inj-${idx}-prompt-${r.id}" rows="2" placeholder="${r.id === 'ic' ? 'What is the IC\'s primary decision or action right now?' : `What is the ${r.name}'s specific role here?`}" style="flex:1">${sbEsc((inj.rolePrompts || {})[r.id])}</textarea>
        </div>
      `).join('')}
    </div>

    <!-- Branches -->
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <div class="field-lbl" style="margin-bottom:0">Branch options (where this inject leads)</div>
        <button class="btn btn-outline btn-sm" onclick="sbAddBranch(${idx})">+ Add branch</button>
      </div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:8px">
        Default: one branch pointing to the next inject. Add more for choose-your-own-adventure branching.
      </div>
      ${(inj.branches || []).map((b, bi) => `
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
          <input id="sb-inj-${idx}-branch-${bi}-label" type="text" value="${sbEsc(b.label)}" placeholder="Branch label (e.g. Escalate to FBI)" style="flex:1"/>
          <div style="flex-shrink:0;min-width:180px">
            <select id="sb-inj-${idx}-branch-${bi}-next">
              <option value="null" ${b.next_index === null || b.next_index === undefined ? 'selected' : ''}>End exercise</option>
              ${sbState.editing.injects.map((inj2, ni) => ni === idx ? '' :
                `<option value="${ni}" ${b.next_index === ni ? 'selected' : ''}>Inject ${ni + 1}: ${(inj2.title || 'Untitled').slice(0, 30)}</option>`
              ).join('')}
            </select>
          </div>
          ${(inj.branches || []).length > 1 ? `<button class="btn btn-red btn-sm" onclick="sbDeleteBranch(${idx},${bi})">×</button>` : ''}
        </div>
      `).join('')}
    </div>
  </div>`;
}

// ---- ACTIONS — LIST VIEW ------------------------------------------

function sbSetFilter(f) { sbState.filterStatus = f; sbRender(); }

function sbNew() {
  sbState.editing = sbBlankScenario();
  sbState.expandedInject = null;
  sbState.view = 'editor';
  sbRender();
}

function sbCloneBuiltin(id) {
  const src = typeof TT_SCENARIOS !== 'undefined' && TT_SCENARIOS[id];
  if (!src) { toast('Built-in scenario not found', '#dc2626'); return; }
  const clone = sbBlankScenario();
  clone.title = src.title + ' (copy)';
  clone.industry = src.industry || '';
  clone.difficulty = src.difficulty || 'Medium';
  clone.duration = src.duration || '';
  clone.summary = src.summary || '';
  clone.declaration = src.declaration ? { ...src.declaration } : clone.declaration;
  clone.injects = (src.injects || []).map(inj => ({
    ingest: inj.ingest || 'SOC alert',
    title: inj.title || '',
    body: inj.body || '',
    phaseIdx: inj.phaseIdx ?? 1,
    correctCriticality: inj.correctCriticality || 'Critical',
    mitre: inj.mitre ? { ...inj.mitre } : { tactic: '', technique: '' },
    triggersBreach: !!inj.triggersBreach,
    primaryRoles: inj.primaryRoles ? [...inj.primaryRoles] : ['ic','tl','cl','lc','es'],
    rolePrompts: inj.rolePrompts ? { ...inj.rolePrompts } : { ic:'', tl:'', cl:'', lc:'', es:'' },
    branches: [{ id: 'default', label: 'Continue →', next_index: null }],
  }));
  // Fix up default branch next_index after all injects are known
  clone.injects.forEach((inj, i) => {
    inj.branches[0].next_index = (i + 1 < clone.injects.length) ? i + 1 : null;
  });
  clone.source_id = src.id;
  clone.source_title = src.title;
  sbState.editing = clone;
  sbState.expandedInject = null;
  sbState.view = 'editor';
  sbRender();
}

function sbCloneCustom(id) {
  const src = sbState.scenarios.find(s => s.id === id);
  if (!src) { toast('Scenario not found', '#dc2626'); return; }
  const clone = {
    ...JSON.parse(JSON.stringify(src)),
    id: null,
    title: (src.title || '') + ' (copy)',
    status: 'draft',
    source_id: src.id,
    source_title: src.title,
  };
  sbState.editing = clone;
  sbState.expandedInject = null;
  sbState.view = 'editor';
  sbRender();
}

function sbEditCustom(id) {
  const src = sbState.scenarios.find(s => s.id === id);
  if (!src) { toast('Scenario not found', '#dc2626'); return; }
  sbState.editing = JSON.parse(JSON.stringify(src));
  sbState.expandedInject = null;
  sbState.view = 'editor';
  sbRender();
}

async function sbDeleteCustom(id, title) {
  if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
  try {
    await sbFetch(`tabletop_scenarios?id=eq.${id}`, 'DELETE');
    sbState.scenarios = sbState.scenarios.filter(s => s.id !== id);
    tteState.dbScenarios = null; // invalidate engine cache
    auditLog('scenario_delete', { scenario_id: id, title });
    toast('Scenario deleted', '#15803d');
    sbRender();
  } catch (e) { toast('Delete failed — ' + e.message, '#dc2626'); }
}

// ---- ACTIONS — EDITOR VIEW ----------------------------------------

function sbBack() {
  sbState.view = 'list';
  sbState.editing = null;
  sbState.expandedInject = null;
  sbRender();
}

function sbToggleInject(idx) {
  if (sbState.expandedInject === idx) {
    sbCollectExpandedInject();
    sbState.expandedInject = null;
  } else {
    if (sbState.expandedInject !== null) sbCollectExpandedInject();
    sbState.expandedInject = idx;
  }
  sbRender();
}

function sbAddInject() {
  if (sbState.expandedInject !== null) sbCollectExpandedInject();
  const idx = sbState.editing.injects.length;
  sbState.editing.injects.push(sbBlankInject(idx, idx + 1));
  sbState.expandedInject = idx;
  sbRender();
}

function sbDeleteInject(idx) {
  if (!confirm('Remove this inject?')) return;
  if (sbState.expandedInject === idx) sbState.expandedInject = null;
  else if (sbState.expandedInject > idx) sbState.expandedInject--;
  sbState.editing.injects.splice(idx, 1);
  // Recalculate default branch next_index values
  sbState.editing.injects.forEach((inj, i) => {
    if (inj.branches && inj.branches.length === 1 && inj.branches[0].id === 'default') {
      inj.branches[0].next_index = (i + 1 < sbState.editing.injects.length) ? i + 1 : null;
    }
  });
  sbRender();
}

function sbMoveInject(idx, dir) {
  if (sbState.expandedInject !== null) sbCollectExpandedInject();
  const injects = sbState.editing.injects;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= injects.length) return;
  [injects[idx], injects[newIdx]] = [injects[newIdx], injects[idx]];
  if (sbState.expandedInject === idx) sbState.expandedInject = newIdx;
  else if (sbState.expandedInject === newIdx) sbState.expandedInject = idx;
  sbRender();
}

function sbSetInjectPhase(idx, phaseIdx) {
  sbState.editing.injects[idx].phaseIdx = phaseIdx;
  sbRender();
}

function sbSetInjectCrit(idx, crit) {
  sbState.editing.injects[idx].correctCriticality = crit;
  sbRender();
}

function sbSetDeclSeverity(sev) {
  sbState.editing.declaration.correctSeverity = sev;
  sbRender();
}

function sbSetDeclDeclare(val) {
  sbState.editing.declaration.correctDeclare = val;
  sbRender();
}

function sbAddBranch(idx) {
  if (!sbState.editing.injects[idx].branches) sbState.editing.injects[idx].branches = [];
  const injects = sbState.editing.injects;
  sbState.editing.injects[idx].branches.push({
    id: 'branch_' + Date.now(),
    label: 'Alternative path',
    next_index: idx + 1 < injects.length ? idx + 1 : null,
  });
  sbRender();
}

function sbDeleteBranch(idx, bi) {
  sbState.editing.injects[idx].branches.splice(bi, 1);
  sbRender();
}

// ---- COLLECT FROM DOM ---------------------------------------------

// Read the expanded inject form fields back into sbState.editing.injects[idx]
function sbCollectExpandedInject() {
  const idx = sbState.expandedInject;
  if (idx === null || !sbState.editing || idx >= sbState.editing.injects.length) return;
  const inj = sbState.editing.injects[idx];

  const g = id => document.getElementById(id);

  inj.ingest  = g(`sb-inj-${idx}-ingest`)?.value  || inj.ingest;
  inj.title   = g(`sb-inj-${idx}-title`)?.value   || inj.title;
  inj.body    = g(`sb-inj-${idx}-body`)?.value    || '';
  inj.mitre   = {
    tactic:    g(`sb-inj-${idx}-tactic`)?.value    || '',
    technique: g(`sb-inj-${idx}-technique`)?.value || '',
  };
  inj.triggersBreach = g(`sb-inj-${idx}-breach`)?.checked || false;

  // Primary roles — read all checkboxes with class sb-role-chk-{idx}
  const roleChks = document.querySelectorAll(`.sb-role-chk-${idx}`);
  inj.primaryRoles = [];
  roleChks.forEach(cb => { if (cb.checked) inj.primaryRoles.push(cb.dataset.role); });

  // Role prompts
  ['ic','tl','cl','lc','es'].forEach(r => {
    const el = g(`sb-inj-${idx}-prompt-${r}`);
    if (el) inj.rolePrompts[r] = el.value;
  });

  // Branches
  const total = (inj.branches || []).length;
  for (let bi = 0; bi < total; bi++) {
    const labelEl = g(`sb-inj-${idx}-branch-${bi}-label`);
    const nextEl  = g(`sb-inj-${idx}-branch-${bi}-next`);
    if (labelEl) inj.branches[bi].label = labelEl.value;
    if (nextEl) {
      const nv = nextEl.value;
      inj.branches[bi].next_index = (nv === 'null' || nv === '') ? null : parseInt(nv, 10);
    }
  }
}

// Read all metadata + declaration fields from the editor DOM
function sbCollectMeta() {
  const g = id => document.getElementById(id);
  const sc = sbState.editing;
  sc.title      = g('sb-title')?.value?.trim()   || '';
  sc.industry   = g('sb-industry')?.value         || '';
  sc.difficulty = g('sb-difficulty')?.value       || 'Medium';
  sc.duration   = g('sb-duration')?.value?.trim() || '';
  sc.track      = g('sb-track')?.value            || 'operational';
  sc.summary    = g('sb-summary')?.value?.trim()  || '';
  const rawTags = g('sb-tags')?.value || '';
  sc.tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);

  sc.declaration.ingest          = g('sb-decl-ingest')?.value  || '';
  sc.declaration.source          = g('sb-decl-source')?.value?.trim() || '';
  sc.declaration.raw             = g('sb-decl-raw')?.value?.trim()    || '';
}

// ---- SAVE ---------------------------------------------------------

async function sbSave(status) {
  // Collect all in-flight form values
  sbCollectMeta();
  if (sbState.expandedInject !== null) sbCollectExpandedInject();

  const sc = sbState.editing;
  if (!sc.title.trim()) { toast('Scenario title is required', '#dc2626'); return; }

  sc.status = status;

  const payload = {
    title:        sc.title,
    industry:     sc.industry,
    difficulty:   sc.difficulty,
    duration:     sc.duration,
    track:        sc.track,
    summary:      sc.summary,
    tags:         sc.tags,
    declaration:  sc.declaration,
    injects:      sc.injects,
    status:       sc.status,
    source_id:    sc.source_id || null,
    source_title: sc.source_title || null,
  };

  try {
    let saved;
    if (sc.id) {
      // Update existing
      const rows = await sbFetch(
        `tabletop_scenarios?id=eq.${sc.id}`, 'PATCH', payload,
        { 'Prefer': 'return=representation' }
      );
      saved = Array.isArray(rows) ? rows[0] : rows;
      // Update in local list
      const li = sbState.scenarios.findIndex(s => s.id === sc.id);
      if (li >= 0) sbState.scenarios[li] = saved;
    } else {
      // Insert new
      const rows = await sbFetch(
        'tabletop_scenarios', 'POST', payload,
        { 'Prefer': 'return=representation' }
      );
      saved = Array.isArray(rows) ? rows[0] : rows;
      sbState.scenarios.push(saved);
      sc.id = saved.id;
    }
    tteState.dbScenarios = null; // invalidate engine cache so runner picks up change
    auditLog('scenario_save', { scenario_id: sc.id, title: sc.title, status });
    toast(status === 'published' ? 'Scenario published' : 'Draft saved', '#15803d');
    sbRender();
  } catch (e) { toast('Save failed — ' + e.message, '#dc2626'); }
}

// ---- FLOW VIEW ----------------------------------------------------

function sbViewFlowFromList(id) {
  const sc = sbState.scenarios.find(s => s.id === id);
  if (!sc) return;
  sbState.flowScenario = JSON.parse(JSON.stringify(sc));
  sbState.view = 'flow';
  sbRender();
}

function sbViewFlowBuiltin(id) {
  const src = typeof TT_SCENARIOS !== 'undefined' && TT_SCENARIOS[id];
  if (!src) return;
  sbState.flowScenario = JSON.parse(JSON.stringify(src));
  sbState.view = 'flow';
  sbRender();
}

function sbViewFlowFromEditor() {
  sbCollectMeta();
  if (sbState.expandedInject !== null) sbCollectExpandedInject();
  sbState.flowScenario = null; // null = use editing
  sbState.view = 'flow';
  sbRender();
}

function sbFlowBack() {
  if (sbState.flowScenario) {
    sbState.flowScenario = null;
    sbState.view = 'list';
  } else {
    sbState.view = 'editor';
  }
  sbRender();
}

function renderSbFlow() {
  const sc = sbState.flowScenario || sbState.editing;
  if (!sc) return renderSbList();
  const fromEditor = !sbState.flowScenario;
  const injects = sc.injects || [];

  return `${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;gap:12px;flex-wrap:wrap">
    <div style="display:flex;align-items:center;gap:10px">
      <button class="btn btn-outline btn-sm" onclick="sbFlowBack()">← ${fromEditor ? 'Back to editor' : 'Back to scenarios'}</button>
      <span style="font-size:15px;font-weight:700">📊 Scenario Flow</span>
      <span class="badge ${sc.status === 'published' ? 'b-green' : 'b-gray'}">${sc.status === 'published' ? 'Published' : 'Draft'}</span>
    </div>
    <div style="font-size:12px;color:var(--muted)">${sc.title || 'Untitled'} &mdash; ${injects.length} inject${injects.length !== 1 ? 's' : ''}</div>
  </div>

  <div style="max-width:680px;margin:0 auto;padding-bottom:2rem">

    <!-- Step 0 -->
    ${sbRenderFlowStep0(sc.declaration)}

    <!-- Injects -->
    ${injects.length === 0 ? `
      <div style="text-align:center;padding:2rem;color:var(--muted);font-size:12px;border:2px dashed var(--border);border-radius:8px;margin-top:8px">
        No injects added yet.
      </div>
    ` : injects.map((inj, idx) => `
      ${sbFlowConnector(inj.branches, idx, injects)}
      ${sbRenderFlowInject(inj, idx, injects)}
    `).join('')}

    <!-- End state -->
    ${injects.length > 0 ? `
      ${sbFlowConnector(null, -1, [])}
      <div style="text-align:center;padding:10px 20px;border:2px dashed var(--border);border-radius:8px;color:var(--muted);font-size:12px;font-weight:600;letter-spacing:0.04em">
        🏁 EXERCISE COMPLETE
      </div>
    ` : ''}
  </div>`;
}

function sbRenderFlowStep0(decl) {
  if (!decl) return '';
  const sev = decl.correctSeverity || '?';
  const declare = decl.correctDeclare;
  return `
  <div style="border:2px solid var(--navy);border-radius:10px;overflow:hidden;background:#fff">
    <div style="background:var(--navy);padding:9px 14px;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff">0</div>
        <span style="font-size:9px;text-transform:uppercase;letter-spacing:0.06em;color:rgba(255,255,255,0.75);font-weight:600">Initial Signal — Step 0</span>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <span style="font-size:10px;background:rgba(255,255,255,0.15);color:#fff;padding:1px 8px;border-radius:10px">Correct: ${sev}</span>
        <span style="font-size:10px;background:${declare ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'};color:${declare ? '#4ade80' : '#fca5a5'};padding:1px 8px;border-radius:10px">${declare ? 'Declare ✓' : 'Monitor'}</span>
      </div>
    </div>
    <div style="padding:10px 14px">
      ${decl.ingest ? `<span style="font-size:10px;color:var(--muted);margin-bottom:4px;display:block">via ${decl.ingest}${decl.source ? ' — ' + decl.source : ''}</span>` : ''}
      <div style="font-size:12px;color:var(--text);line-height:1.5">${decl.raw || '<em style="color:var(--muted)">No signal text</em>'}</div>
    </div>
  </div>`;
}

function sbRenderFlowInject(inj, idx, allInjects) {
  const phaseLabel = SB_NIST_SHORT[inj.phaseIdx] || '?';
  const phaseClass = SB_NIST_PHASE_CLASSES[inj.phaseIdx] || 'detection';
  const branches   = inj.branches || [{ label: 'Continue →', next_index: idx + 1 < allInjects.length ? idx + 1 : null }];
  const hasNonDefault = branches.length > 1;

  return `
  <div style="border:1.5px solid var(--border);border-radius:10px;overflow:hidden;background:#fff">
    <!-- Phase header -->
    <div class="tt-card-head ${phaseClass}" style="padding:9px 14px;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0">${idx + 1}</div>
        <span style="font-size:9px;text-transform:uppercase;letter-spacing:0.06em;color:rgba(255,255,255,0.75);font-weight:600">${phaseLabel}</span>
        <span style="font-size:9px;color:rgba(255,255,255,0.6)">via ${inj.ingest || '—'}</span>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        ${inj.triggersBreach ? '<span style="font-size:9px;background:rgba(220,38,38,0.35);color:#fca5a5;padding:1px 7px;border-radius:10px">⚠ Breach trigger</span>' : ''}
        <span style="font-size:10px;background:rgba(255,255,255,0.15);color:#fff;padding:1px 8px;border-radius:10px">${inj.correctCriticality || '—'}</span>
      </div>
    </div>
    <!-- Body -->
    <div style="padding:10px 14px">
      <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:6px">${inj.title || '(Untitled)'}</div>
      ${inj.mitre?.tactic ? `
        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px">
          <span class="badge b-gray" style="font-size:9px">${inj.mitre.tactic}</span>
          ${inj.mitre.technique ? `<span class="badge b-gray" style="font-size:9px">${inj.mitre.technique}</span>` : ''}
        </div>
      ` : ''}
      ${(inj.primaryRoles || []).length > 0 && (inj.primaryRoles || []).length < 5 ? `
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          ${(inj.primaryRoles || []).map(r => `<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:3px;background:#f0f4fa;color:var(--navy)">${r.toUpperCase()}</span>`).join('')}
          <span style="font-size:9px;color:var(--muted)">primary</span>
        </div>
      ` : ''}
    </div>
    <!-- Branch footer -->
    <div style="border-top:0.5px solid var(--border);background:#f8fafc;padding:8px 14px">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:5px">
        ${hasNonDefault ? 'Branches' : 'Continues to'}
      </div>
      ${branches.map((b, bi) => {
        const ni = b.next_index;
        const destLabel = (ni !== null && ni !== undefined && allInjects[ni])
          ? `Inject ${ni + 1}: ${(allInjects[ni].title || 'Untitled').slice(0, 40)}`
          : 'End exercise';
        const isDefault = bi === 0;
        return `<div style="display:flex;align-items:baseline;gap:6px;font-size:11px;margin-bottom:3px">
          <span style="font-size:13px;color:${isDefault ? 'var(--muted)' : 'var(--cyan)'}">
            ${isDefault ? (branches.length > 1 ? '↓' : '→') : '⤵'}
          </span>
          ${hasNonDefault ? `<span style="font-weight:600;color:var(--text)">${b.label || 'Branch ' + (bi + 1)}</span><span style="color:var(--muted)">→</span>` : ''}
          <span style="color:var(--navy);font-weight:500">${destLabel}</span>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function sbFlowConnector(branches, idx, allInjects) {
  // If previous inject had multiple branches, show a fork indicator; otherwise simple arrow
  const hasMultiple = branches && branches.length > 1;
  return `
  <div style="display:flex;flex-direction:column;align-items:center;padding:2px 0;gap:0">
    <div style="width:2px;height:${hasMultiple ? 20 : 24}px;background:var(--border)"></div>
    ${hasMultiple
      ? `<div style="font-size:9px;color:var(--muted);background:#f0f4fa;border:0.5px solid var(--border);border-radius:10px;padding:1px 8px;margin:2px 0">branching paths</div>
         <div style="width:2px;height:8px;background:var(--border)"></div>`
      : `<div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid var(--border)"></div>`}
  </div>`;
}

// ---- UTILITIES ----------------------------------------------------

function sbEsc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---- WINDOW EXPORTS -----------------------------------------------

window.renderScenarioBuilder = renderScenarioBuilder;
window.sbInit                = sbInit;
window.sbBack                = sbBack;
window.sbNew                 = sbNew;
window.sbCloneBuiltin        = sbCloneBuiltin;
window.sbCloneCustom         = sbCloneCustom;
window.sbEditCustom          = sbEditCustom;
window.sbDeleteCustom        = sbDeleteCustom;
window.sbSave                = sbSave;
window.sbSetFilter           = sbSetFilter;
window.sbAddInject           = sbAddInject;
window.sbDeleteInject        = sbDeleteInject;
window.sbMoveInject          = sbMoveInject;
window.sbToggleInject        = sbToggleInject;
window.sbSetInjectPhase      = sbSetInjectPhase;
window.sbSetInjectCrit       = sbSetInjectCrit;
window.sbSetDeclSeverity     = sbSetDeclSeverity;
window.sbSetDeclDeclare      = sbSetDeclDeclare;
window.sbAddBranch           = sbAddBranch;
window.sbDeleteBranch        = sbDeleteBranch;
window.sbViewFlowFromList    = sbViewFlowFromList;
window.sbViewFlowFromEditor  = sbViewFlowFromEditor;
window.sbViewFlowBuiltin     = sbViewFlowBuiltin;
window.sbFlowBack            = sbFlowBack;
