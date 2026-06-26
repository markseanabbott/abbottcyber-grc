'use strict';

// ============================================================
// BACKLOG MANAGER — Platform admin only
// Dynamic backlog backed by Supabase backlog_items table.
// Seeded from backlog.json paste on first load.
// Status: add | edit | completed | cancelled  (PATCH_024)
// ============================================================

const _BLM_SECTION_FILES = {
  core:                  ['js/config.js', 'js/app.js'],
  dashboard_shell:       ['js/app.js', 'js/config.js', 'js/home.js', 'css/core.css'],
  survey:                ['js/insurance.js', 'js/assessment_core.js'],
  technology_stack:      ['js/techstack.js', 'js/prefill.js'],
  cis_controls:          ['js/cis.js', 'js/assessment_core.js'],
  cmmc_l1:               ['js/cmmc.js', 'js/assessment_core.js', 'js/prefill.js'],
  cmmc_l2:               ['js/cmmc2.js', 'js/assessment_core.js'],
  auth:                  ['js/auth.js', 'js/users.js', 'js/supabase.js'],
  tpra:                  ['js/tpra.js'],
  hierarchy:             ['js/orgs.js', 'js/config.js'],
  grandfather_reporting: ['js/home.js', 'js/app.js'],
  father_reporting:      ['js/home.js', 'js/app.js'],
  vuln_scan:             ['js/app.js'],
  nist_expansion:        ['js/nist_ai.js', 'js/assessment_core.js'],
  pentest:               ['js/app.js'],
  reporting:             ['js/app.js', 'css/core.css'],
  vciso_program:         ['js/app.js', 'js/supabase.js'],
  risk_register_core:    ['js/risk_register.js', 'js/supabase.js'],
  risk_register_ux:      ['js/risk_register.js'],
  risk_register_export:  ['js/risk_register.js'],
  tabletop_core:         ['js/tabletop.js', 'js/ex_hub.js', 'js/config.js'],
  tabletop_operational:  ['js/tabletop.js'],
  tabletop_executive:    ['js/tabletop.js'],
  tabletop_vendor:       ['js/tabletop.js'],
  tabletop_aar:          ['js/tabletop.js', 'js/ex_hub.js'],
  tabletop_multiplayer:  ['js/multiplayer.js', 'js/tabletop.js'],
  ai_tools:              ['js/ai_unified.js', 'js/ai_hub.js'],
  tabletop_bcdr:         ['js/tabletop.js'],
  policy_library:        ['js/policy_lib.js'],
  ai_readiness:          ['js/ai_unified.js', 'js/ai_hub.js', 'js/nist_ai.js', 'js/iso42001.js'],
};

// Status config — drives tab colours, badge colours, and item styling
const BLM_STATUS = {
  add:       { label: 'Add',       icon: '🔵', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  edit:      { label: 'Edit',      icon: '🟡', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  completed: { label: 'Completed', icon: '🟢', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  cancelled: { label: 'Cancelled', icon: '⚫', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
};

function _blmStatus(item) {
  return item.status || (item.done ? 'completed' : 'add');
}

let blmState = {
  items:     [],
  loading:   false,
  seedMode:  false,
  notesOpen: {},
  filter:    { phase: 'all', status: 'all', section: 'all', q: '' },
  collapsed: {},
};

// ============================================================
// LOAD
// ============================================================
async function blmLoad() {
  blmState.loading = true;
  try {
    const rows = await sbFetch(
      'backlog_items?select=*&order=section_phase.asc.nullslast,sort_order.asc,id.asc',
      'GET', null, {}
    );
    blmState.items = Array.isArray(rows) ? rows : [];
  } catch (e) {
    toast('Failed to load backlog: ' + e.message, '#dc2626');
    blmState.items = [];
  }
  blmState.loading = false;
}

// ============================================================
// RENDER — MAIN
// ============================================================
function renderBacklogManager() {
  if (!isPlatformAdmin()) {
    return `<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">
      <div style="font-size:2rem;margin-bottom:.5rem">🔒</div>
      <div style="font-weight:700;color:var(--text)">Platform Admins Only</div>
      <div style="font-size:13px;margin-top:.5rem">The Feature Backlog is only accessible to platform administrators.</div>
    </div>`;
  }

  // Status counts across all items
  const counts = { add: 0, edit: 0, completed: 0, cancelled: 0 };
  blmState.items.forEach(i => { const s = _blmStatus(i); if (counts[s] !== undefined) counts[s]++; });
  const total = blmState.items.length;

  // Build unique sections & phases for filter dropdowns
  const sections = [...new Map(blmState.items.map(i => [i.section_id, { id: i.section_id, title: i.section_title, phase: i.section_phase }])).values()];
  const phases   = [...new Set(blmState.items.map(i => i.section_phase).filter(Boolean))].sort((a,b)=>a-b);

  const f = blmState.filter;

  const seedPanel = blmState.seedMode ? `
    <div class="card" style="margin-bottom:1rem;border:2px solid var(--cyan);padding:1.25rem">
      <div style="font-weight:700;color:var(--navy);margin-bottom:.5rem">📥 Seed from backlog.json</div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:.75rem">Paste the full contents of <code>backlog.json</code> below. Existing items will be updated; new items will be inserted.</div>
      <textarea id="blmSeedJson" rows="10" style="width:100%;font-family:monospace;font-size:11px;border:1px solid var(--border);border-radius:6px;padding:.5rem;box-sizing:border-box;resize:vertical" placeholder='{ "sections": [ ... ] }'></textarea>
      <div style="margin-top:.75rem;display:flex;gap:.5rem">
        <button class="btn btn-primary btn-sm" onclick="blmConfirmSeed()">Import All Items</button>
        <button class="btn btn-outline btn-sm" onclick="blmCancelSeed()">Cancel</button>
      </div>
    </div>` : '';

  return `
    <div style="max-width:1000px;margin:0 auto">

      <!-- Header -->
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;flex-wrap:wrap">
        <div>
          <h2 style="margin:0;font-size:20px;font-weight:800;color:var(--navy)">📋 Feature Backlog</h2>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">
            ${counts.add} to add &nbsp;·&nbsp;
            ${counts.edit} in edit &nbsp;·&nbsp;
            ${counts.completed} completed &nbsp;·&nbsp;
            ${counts.cancelled} cancelled &nbsp;·&nbsp;
            ${total} total
          </div>
        </div>
        <div style="margin-left:auto;display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn btn-outline btn-sm" onclick="blmOpenSeed()">📥 Seed from JSON</button>
          <button class="btn btn-outline btn-sm" onclick="blmExpandAll()">Expand All</button>
          <button class="btn btn-outline btn-sm" onclick="blmCollapseAll()">Collapse All</button>
        </div>
      </div>

      ${seedPanel}

      <!-- STATUS TABS -->
      <div style="display:flex;gap:.35rem;flex-wrap:wrap;margin-bottom:.75rem">
        ${_blmTab('all', 'All', total, f.status)}
        ${_blmTab('add', 'Add', counts.add, f.status)}
        ${_blmTab('edit', 'Edit', counts.edit, f.status)}
        ${_blmTab('completed', 'Completed', counts.completed, f.status)}
        ${_blmTab('cancelled', 'Cancelled', counts.cancelled, f.status)}
      </div>

      <!-- SECONDARY FILTERS -->
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:.65rem 1rem;align-items:center">
        <select onchange="blmSetFilter('phase',this.value)" style="font-size:12px;border:1px solid var(--border);border-radius:6px;padding:5px 8px;background:#fff;color:var(--text)">
          <option value="all" ${f.phase==='all'?'selected':''}>All phases</option>
          ${phases.map(p=>`<option value="${p}" ${f.phase==p?'selected':''}>Phase ${p}</option>`).join('')}
          <option value="null" ${f.phase==='null'?'selected':''}>No phase</option>
        </select>
        <select onchange="blmSetFilter('section',this.value)" style="font-size:12px;border:1px solid var(--border);border-radius:6px;padding:5px 8px;background:#fff;color:var(--text);max-width:220px">
          <option value="all">All sections</option>
          ${sections.map(s=>`<option value="${s.id}" ${f.section===s.id?'selected':''}>${s.title}</option>`).join('')}
        </select>
        <input type="text" placeholder="Search…" value="${f.q}" oninput="blmSetFilter('q',this.value)"
          style="font-size:12px;border:1px solid var(--border);border-radius:6px;padding:5px 8px;flex:1;min-width:120px;color:var(--text)"/>
        ${(f.phase!=='all'||f.status!=='all'||f.section!=='all'||f.q)?`<button class="btn btn-outline btn-sm" onclick="blmResetFilters()">✕ Reset</button>`:''}
      </div>

      <!-- LIST -->
      <div id="blmList">${blmRenderList()}</div>
    </div>`;
}

function _blmTab(statusKey, label, count, activeStatus) {
  const isActive = activeStatus === statusKey;
  const cfg = BLM_STATUS[statusKey];
  const activeBg     = cfg ? cfg.bg     : 'var(--navy)';
  const activeColor  = cfg ? cfg.color  : '#fff';
  const activeBorder = cfg ? cfg.border : 'var(--navy)';
  return `<button onclick="blmSetFilter('status','${statusKey}')"
    style="padding:6px 14px;border-radius:20px;border:2px solid ${isActive ? (cfg ? activeBorder : 'var(--navy)') : 'var(--border)'};
      background:${isActive ? (cfg ? activeBg : 'var(--navy)') : '#fff'};
      color:${isActive ? (cfg ? activeColor : '#fff') : 'var(--muted)'};
      font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .12s">
    ${label}
    <span style="margin-left:5px;font-size:11px;background:${isActive ? 'rgba(0,0,0,.08)' : 'var(--bg)'};border-radius:10px;padding:1px 7px">${count}</span>
  </button>`;
}

// ============================================================
// RENDER — LIST
// ============================================================
function blmRenderList() {
  if (blmState.loading) return `<div style="text-align:center;padding:3rem;color:var(--muted)"><div class="spinner" style="margin:0 auto 1rem;width:24px;height:24px;border-color:rgba(21,33,104,.2);border-top-color:var(--navy)"></div><div style="font-size:13px">Loading…</div></div>`;

  if (!blmState.items.length) return `<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">
    <div style="font-size:1.5rem;margin-bottom:.5rem">📭</div>
    <div style="font-weight:700;color:var(--text)">No items yet</div>
    <div style="font-size:13px;margin-top:.25rem">Click <strong>Seed from JSON</strong> to import your backlog.</div>
  </div>`;

  const f = blmState.filter;

  const filtered = blmState.items.filter(item => {
    const s = _blmStatus(item);
    if (f.status !== 'all' && s !== f.status) return false;
    if (f.phase === 'null' && item.section_phase != null) return false;
    if (f.phase !== 'all' && f.phase !== 'null' && item.section_phase != parseInt(f.phase)) return false;
    if (f.section !== 'all' && item.section_id !== f.section) return false;
    if (f.q && !item.text.toLowerCase().includes(f.q.toLowerCase()) &&
               !(item.notes||'').toLowerCase().includes(f.q.toLowerCase())) return false;
    return true;
  });

  if (!filtered.length) return `<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">
    <div style="font-size:13px">No items match the current filters.</div>
  </div>`;

  // Group by section
  const bySection = {};
  filtered.forEach(item => {
    const key = item.section_id;
    if (!bySection[key]) bySection[key] = { title: item.section_title, phase: item.section_phase, items: [] };
    bySection[key].items.push(item);
  });

  return Object.entries(bySection).map(([sectionId, sec]) =>
    blmRenderSection(sectionId, sec.title, sec.phase, sec.items)
  ).join('');
}

function blmRenderSection(sectionId, title, phase, items) {
  const collapsed  = !!blmState.collapsed[sectionId];
  const phaseLabel = phase != null ? `<span style="font-size:10px;background:#e0e7ff;color:#4338ca;border-radius:4px;padding:2px 6px;font-weight:600">Ph ${phase}</span>` : '';

  // Status mini-counts for section header
  const sc = { add: 0, edit: 0, completed: 0, cancelled: 0 };
  items.forEach(i => { const s = _blmStatus(i); if (sc[s] !== undefined) sc[s]++; });
  const statusSummary = [
    sc.add       ? `<span style="color:${BLM_STATUS.add.color};font-size:10px;font-weight:700">${sc.add} add</span>` : '',
    sc.edit      ? `<span style="color:${BLM_STATUS.edit.color};font-size:10px;font-weight:700">${sc.edit} edit</span>` : '',
    sc.completed ? `<span style="color:${BLM_STATUS.completed.color};font-size:10px;font-weight:700">${sc.completed} done</span>` : '',
    sc.cancelled ? `<span style="color:${BLM_STATUS.cancelled.color};font-size:10px;font-weight:700">${sc.cancelled} cancelled</span>` : '',
  ].filter(Boolean).join('<span style="color:var(--border)"> · </span>');

  return `<div class="card" style="margin-bottom:.75rem;padding:0;overflow:hidden">
    <div onclick="blmToggleSection('${sectionId}')" style="display:flex;align-items:center;gap:.75rem;padding:.9rem 1rem;cursor:pointer;background:var(--bg);border-bottom:${collapsed?'none':'1px solid var(--border)'};user-select:none">
      <span style="font-size:12px;color:var(--muted);transition:transform .15s;display:inline-block;transform:rotate(${collapsed?'-90':'0'}deg)">▼</span>
      <span style="font-weight:700;color:var(--navy);flex:1;font-size:14px">${escH(title)}</span>
      ${phaseLabel}
      <span style="display:flex;gap:.4rem;align-items:center">${statusSummary}</span>
    </div>
    ${collapsed ? '' : `<div style="padding:.25rem 0">${items.map((item, i) => blmRenderItem(item, i + 1)).join('')}</div>`}
  </div>`;
}

function blmRenderItem(item, idx) {
  const itemStatus  = _blmStatus(item);
  const cfg         = BLM_STATUS[itemStatus];
  const priorityBadge = item.priority ? _blmPriorityBadge(item.priority) : '';
  const hasNotes    = !!(item.notes || '').trim();
  const notesOpen   = !!blmState.notesOpen[item.id];
  const depsArr     = Array.isArray(item.dependencies) ? item.dependencies : [];
  const deps        = depsArr.length ? blmState.items.filter(x => depsArr.includes(x.id)) : [];

  const isDimmed    = itemStatus === 'completed' || itemStatus === 'cancelled';
  const textStyle   = itemStatus === 'completed' ? 'text-decoration:line-through;color:var(--muted)' :
                      itemStatus === 'cancelled'  ? 'text-decoration:line-through;color:#9ca3af'     : 'color:var(--text)';

  // Status select — styled with the current status colour
  const statusSelect = `<select onchange="blmSetStatus('${item.id}',this.value)"
    style="border:1.5px solid ${cfg.border};background:${cfg.bg};color:${cfg.color};border-radius:6px;padding:3px 6px;font-size:11px;font-weight:700;cursor:pointer;min-width:90px;outline:none">
    <option value="add"       ${itemStatus==='add'       ?'selected':''}>🔵 Add</option>
    <option value="edit"      ${itemStatus==='edit'      ?'selected':''}>🟡 Edit</option>
    <option value="completed" ${itemStatus==='completed' ?'selected':''}>🟢 Completed</option>
    <option value="cancelled" ${itemStatus==='cancelled' ?'selected':''}>⚫ Cancelled</option>
  </select>`;

  const pMap = { Critical:'#dc2626', High:'#d97706', Medium:'#2563eb', Low:'#6b7280' };
  const pVal = item.priority || '';
  const pColor = pMap[pVal] || '#9ca3af';
  const prioritySelect = `<select onchange="blmSetPriority('${item.id}',this.value)"
    style="border:1.5px solid ${pVal ? pColor+'55' : 'var(--border)'};background:${pVal ? pColor+'12' : '#fff'};color:${pVal ? pColor : 'var(--muted)'};
      border-radius:6px;padding:3px 24px 3px 6px;font-size:11px;font-weight:700;cursor:pointer;outline:none;
      appearance:none;-webkit-appearance:none;
      background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='${encodeURIComponent(pVal ? pColor : '#9ca3af')}'/%3E%3C/svg%3E\");
      background-repeat:no-repeat;background-position:right 6px center;background-size:7px 4px;min-width:80px">
    <option value="" ${!pVal?'selected':''}>— Priority</option>
    <option value="Critical" ${pVal==='Critical'?'selected':''}>Critical</option>
    <option value="High"     ${pVal==='High'    ?'selected':''}>High</option>
    <option value="Medium"   ${pVal==='Medium'  ?'selected':''}>Medium</option>
    <option value="Low"      ${pVal==='Low'     ?'selected':''}>Low</option>
  </select>`;

  return `<div style="display:flex;align-items:flex-start;gap:.75rem;padding:.65rem 1rem;border-bottom:1px solid var(--border);${isDimmed?'opacity:.55':''}">
    ${idx ? `<div style="font-size:10px;color:#c4cad8;font-weight:700;min-width:20px;text-align:right;flex-shrink:0;padding-top:6px;user-select:none">${idx}</div>` : ''}
    <div style="flex-shrink:0;padding-top:1px">${statusSelect}</div>
    <div style="flex:1;min-width:0">
      <div style="font-size:13px;line-height:1.5;${textStyle}">${escH(item.text)}</div>
      ${hasNotes && notesOpen ? `<div style="font-size:11px;color:var(--muted);margin-top:.4rem;line-height:1.6;background:var(--bg);border-radius:6px;padding:.5rem .75rem;border-left:3px solid var(--cyan)">${escH(item.notes)}</div>` : ''}
      ${deps.length ? `<div style="font-size:11px;color:var(--muted);margin-top:.35rem">Depends on: ${deps.map(d=>{const ds=_blmStatus(d);const dc=BLM_STATUS[ds];return`<span style="background:${dc.bg};color:${dc.color};border-radius:4px;padding:1px 6px;font-size:10px;font-weight:600">${escH(d.id)}</span>`;}).join(' ')}</div>` : ''}
    </div>
    <div style="display:flex;gap:.35rem;align-items:center;flex-shrink:0">
      ${prioritySelect}
      ${hasNotes ? `<button class="btn btn-outline btn-sm" onclick="blmToggleNotes('${item.id}')" style="font-size:10px;padding:2px 7px" title="Toggle notes">${notesOpen?'▲':'📝'}</button>` : ''}
      <button class="btn btn-sm" onclick="blmCopyPrompt('${item.id}')"
        style="font-size:10px;padding:3px 8px;background:var(--navy);color:#fff;border:none;border-radius:5px;cursor:pointer" title="Copy AI build prompt">📋 AI Prompt</button>
    </div>
  </div>`;
}

async function blmSetPriority(id, priority) {
  try {
    await sbFetch(`backlog_items?id=eq.${id}`, 'PATCH',
      { priority: priority || null },
      { Prefer: 'return=minimal' }
    );
    const item = blmState.items.find(i => i.id === id);
    if (item) item.priority = priority || null;
    const el = document.getElementById('blmList');
    if (el) el.innerHTML = blmRenderList();
    toast(`Priority → ${priority || 'unset'}`, '#152168');
  } catch(e) {
    toast('Failed to update: ' + e.message, '#dc2626');
  }
}

// ============================================================
// INTERACTIONS
// ============================================================
function blmSetFilter(type, val) {
  blmState.filter[type] = val;
  // Re-render the whole page so tab counts and list both update
  const mc = document.getElementById('mainContent');
  if (mc && activeNav === 'backlog') mc.innerHTML = renderBacklogManager();
}

function blmResetFilters() {
  blmState.filter = { phase: 'all', status: 'all', section: 'all', q: '' };
  const mc = document.getElementById('mainContent');
  if (mc && activeNav === 'backlog') mc.innerHTML = renderBacklogManager();
}

function blmToggleSection(sectionId) {
  blmState.collapsed[sectionId] = !blmState.collapsed[sectionId];
  const el = document.getElementById('blmList');
  if (el) el.innerHTML = blmRenderList();
}

function blmExpandAll() {
  blmState.collapsed = {};
  const el = document.getElementById('blmList');
  if (el) el.innerHTML = blmRenderList();
}

function blmCollapseAll() {
  const sectionIds = [...new Set(blmState.items.map(i => i.section_id))];
  sectionIds.forEach(id => { blmState.collapsed[id] = true; });
  const el = document.getElementById('blmList');
  if (el) el.innerHTML = blmRenderList();
}

function blmToggleNotes(id) {
  blmState.notesOpen[id] = !blmState.notesOpen[id];
  const el = document.getElementById('blmList');
  if (el) el.innerHTML = blmRenderList();
}

async function blmSetStatus(id, newStatus) {
  const newDone = newStatus === 'completed';
  try {
    await sbFetch(`backlog_items?id=eq.${id}`, 'PATCH',
      { status: newStatus, done: newDone },
      { Prefer: 'return=minimal' }
    );
    const item = blmState.items.find(i => i.id === id);
    if (item) { item.status = newStatus; item.done = newDone; }
    // Re-render full page so tab counts update
    const mc = document.getElementById('mainContent');
    if (mc && activeNav === 'backlog') mc.innerHTML = renderBacklogManager();
    toast(`→ ${BLM_STATUS[newStatus]?.label || newStatus}`, BLM_STATUS[newStatus]?.color || '#152168');
  } catch(e) {
    toast('Failed to update: ' + e.message, '#dc2626');
  }
}

// ============================================================
// SEED
// ============================================================
function blmOpenSeed() {
  blmState.seedMode = true;
  const mc = document.getElementById('mainContent');
  if (mc) mc.innerHTML = renderBacklogManager();
}

function blmCancelSeed() {
  blmState.seedMode = false;
  const mc = document.getElementById('mainContent');
  if (mc) mc.innerHTML = renderBacklogManager();
}

async function blmConfirmSeed() {
  const ta = document.getElementById('blmSeedJson');
  if (!ta || !ta.value.trim()) { toast('Paste the backlog.json content first', '#dc2626'); return; }

  let json;
  try { json = JSON.parse(ta.value.trim()); } catch(e) { toast('Invalid JSON: ' + e.message, '#dc2626'); return; }

  const sections = json.sections;
  if (!Array.isArray(sections)) { toast('JSON must have a "sections" array', '#dc2626'); return; }

  const rows = [];
  let sortOrder = 0;
  sections.forEach(sec => {
    (sec.items || []).forEach(item => {
      const done   = item.done || false;
      const status = item.status || (done ? 'completed' : 'add');
      rows.push({
        id:            item.id,
        section_id:    sec.id,
        section_title: sec.title,
        section_phase: sec.phase || null,
        sort_order:    sortOrder++,
        text:          item.text,
        done,
        status,
        priority:      item.priority     || null,
        notes:         item.notes        || null,
        dependencies:  item.dependencies || [],
      });
    });
  });

  if (!rows.length) { toast('No items found in JSON', '#dc2626'); return; }

  // Deduplicate by id
  const rowMap = new Map();
  rows.forEach(r => rowMap.set(r.id, r));
  const deduped = Array.from(rowMap.values());

  toast(`Importing ${deduped.length} items…`);

  try {
    for (let i = 0; i < deduped.length; i += 50) {
      const batch = deduped.slice(i, i + 50);
      await sbFetch('backlog_items', 'POST', batch, {
        Prefer: 'resolution=merge-duplicates,return=minimal',
      });
    }
    toast(`✓ Imported ${deduped.length} items`, '#15803d');
    blmState.seedMode = false;
    await blmLoad();
    const mc = document.getElementById('mainContent');
    if (mc) mc.innerHTML = renderBacklogManager();
  } catch(e) {
    toast('Seed failed: ' + e.message, '#dc2626');
  }
}

// ============================================================
// AI PROMPT GENERATOR
// ============================================================
function blmCopyPrompt(id) {
  const item = blmState.items.find(i => i.id === id);
  if (!item) return;
  const sectionItems = blmState.items.filter(i => i.section_id === item.section_id);
  const prompt = _blmBuildPrompt(item, sectionItems);
  navigator.clipboard.writeText(prompt).then(() => {
    toast('📋 AI prompt copied to clipboard!', '#15803d');
  }).catch(() => {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center';
    modal.innerHTML = `<div style="background:#fff;border-radius:14px;padding:1.5rem;max-width:680px;width:92%;max-height:80vh;display:flex;flex-direction:column">
      <div style="font-weight:700;color:var(--navy);margin-bottom:.75rem">📋 AI Build Prompt — copy manually</div>
      <textarea style="flex:1;font-family:monospace;font-size:11px;border:1px solid var(--border);border-radius:6px;padding:.5rem;resize:none;min-height:320px">${prompt.replace(/</g,'&lt;')}</textarea>
      <button onclick="this.closest('div[style]').remove()" style="margin-top:.75rem;padding:9px;background:var(--navy);color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer">Close</button>
    </div>`;
    document.body.appendChild(modal);
  });
}

function _blmBuildPrompt(item, sectionItems) {
  const completedInSection = sectionItems.filter(i => _blmStatus(i) === 'completed' && i.id !== item.id);
  const otherPending       = sectionItems.filter(i => !['completed','cancelled'].includes(_blmStatus(i)) && i.id !== item.id);
  const depsArr            = Array.isArray(item.dependencies) ? item.dependencies : [];
  const depItems           = depsArr.length ? blmState.items.filter(x => depsArr.includes(x.id)) : [];
  const files              = (_BLM_SECTION_FILES[item.section_id] || ['js/app.js', 'js/config.js']).join(', ');
  const priorityNote       = item.priority ? ` Priority: ${item.priority}.` : '';
  const phaseNote          = item.section_phase ? ` Phase ${item.section_phase}.` : '';

  const notesBlock = item.notes
    ? `\n## BUILD CONTEXT (from prior sessions)\n${item.notes}\n`
    : '';

  const depsBlock = depItems.length
    ? `\n## DEPENDENCIES (these must exist before building this item)\n${depItems.map(d =>
        `- [${_blmStatus(d).toUpperCase()}] ${d.id}: ${d.text}${d.notes ? '\n  Notes: ' + d.notes.slice(0, 200) : ''}`
      ).join('\n')}\n`
    : '';

  const doneBlock = completedInSection.length
    ? `\n## COMPLETED IN THIS SECTION (use as patterns and context)\n${completedInSection.slice(0, 8).map(d =>
        `- ${d.id}: ${d.text}${d.notes ? '\n  ' + d.notes.slice(0, 200) : ''}`
      ).join('\n')}\n`
    : '';

  const pendingBlock = otherPending.length
    ? `\n## OTHER PENDING ITEMS IN THIS SECTION (context — do NOT build these yet)\n${otherPending.map(p =>
        `- ${p.id}: ${p.text}`
      ).join('\n')}\n`
    : '';

  return `Build the following feature for the Abbott Cyber GRC Platform.

## FEATURE TO BUILD
Item ID: ${item.id}
Section: ${item.section_title}${phaseNote}${priorityNote}

${item.text}
${notesBlock}${depsBlock}
## PROJECT ARCHITECTURE (read before building)
- index.html = HTML shell + <script> loader. js/*.js = vanilla JS modules. No framework, no build step.
- CSS: css/core.css + css/modules.css. Always use var(--navy), var(--cyan), var(--bg), etc. Never hardcode hex.
- Reuse classes: .card, .btn, .btn-primary, .btn-cyan, .btn-outline, .btn-sm, .badge, .score-hero-ins, .view-tabs, .view-tab, .view-tab.active
- Supabase: sbFetch(path, method, body, extraHeaders) in js/supabase.js. Use sb.* helpers where they exist.
- New SQL: write SUPABASE_PATCH_0NN.sql (next is 025), explain it, wait for Mark to run it in Supabase SQL Editor. Never run it yourself.
- New modules: add <script src="js/name.js?v=YYYYMMDD"> to index.html above app.js
- New nav items: add to NAV array in js/config.js (include live:true, phase, platformAdminOnly if needed)
- Render routing: add \`if (activeNav === 'id') { el.innerHTML = renderX(); ... return; }\` to renderMain() in js/app.js
- Module state: declare in js/config.js (e.g. \`let fooState = { view: 'dashboard', ... };\`)
- Window exports: add \`window.X = X;\` at bottom of every module for all public functions
- Audit: call \`auditLog()\` on all write operations (see js/supabase.js for pattern)
- Cache: bump ?v=YYYYMMDD on ALL script tags in index.html after any change
- isPlatformAdmin() in auth.js → true only for platform_admin role
- toast(msg, hexColor) for user feedback — NOT showToast()

## FILES TO READ FIRST
${files}
Also read CLAUDE.md and the relevant sections of backlog.json for full context.
${doneBlock}${pendingBlock}
## INSTRUCTIONS
1. Read the files listed above before writing any code.
2. Describe your approach to Mark and confirm before building.
3. Build ONLY the item described — do not build other pending items in the list.
4. Follow all project conventions above.
5. When done, update backlog.json: set "done": true and add a "notes" field summarising what was built, key function names, and file locations.
6. Bump the ?v= cache-bust suffix on all script tags in index.html.
`;
}

// ============================================================
// WINDOW EXPORTS
// ============================================================
window.renderBacklogManager = renderBacklogManager;
window.blmLoad              = blmLoad;
window.blmSetFilter         = blmSetFilter;
window.blmResetFilters      = blmResetFilters;
window.blmToggleSection     = blmToggleSection;
window.blmExpandAll         = blmExpandAll;
window.blmCollapseAll       = blmCollapseAll;
window.blmToggleNotes       = blmToggleNotes;
window.blmSetStatus         = blmSetStatus;
window.blmOpenSeed          = blmOpenSeed;
window.blmCancelSeed        = blmCancelSeed;
window.blmConfirmSeed       = blmConfirmSeed;
window.blmCopyPrompt        = blmCopyPrompt;
window.blmSetPriority       = blmSetPriority;
