// ============================================================
// APPROPRIATENESS CURATOR — Platform Admin only (TB7)
// Review and tune per-scenario ratings on tt_response_cards.
// appropriateness shape: { scenario: { rating, weight } }
// ============================================================

const AC_SCENARIOS = ['ransomware','bec','insider','vendor_compromise'];
const AC_SCENARIO_LABELS = { ransomware:'Ransomware', bec:'BEC', insider:'Insider', vendor_compromise:'Vendor' };
const AC_RATINGS = ['correct','defensible-partial','inappropriate','not-applicable'];
const AC_RATING_LABELS = { 'correct':'Correct', 'defensible-partial':'Defensible-Partial', 'inappropriate':'Inappropriate', 'not-applicable':'Not Applicable' };
const AC_ROLE_ORDER = ['ic','tl','cl','lc','es'];
const AC_ROLE_NAMES = { ic:'IC — Incident Commander', tl:'TL — Technical Lead', cl:'CL — Comms Lead', lc:'LC — Legal Counsel', es:'ES — Executive Sponsor' };
const AC_PHASE_ORDER = ['detect_analyze','contain','eradicate','recover','post_incident'];
const AC_PHASE_LABELS = { detect_analyze:'Detect / Analyze', contain:'Contain', eradicate:'Eradicate', recover:'Recover', post_incident:'Post-Incident' };

let acState = {
  cards:      null,   // all tt_response_cards rows
  loading:    false,
  changed:    {},     // id → { appropriateness: {...} }
  roleFilter: '',
  phaseFilter:'',
  ratingFilter:'',
  search:     '',
};

// ── Data loading ─────────────────────────────────────────────

async function acEnsureData() {
  if (acState.cards || acState.loading) return;
  acState.loading = true;
  try {
    const data = await sbFetch('tt_response_cards?select=id,role_id,nist_phase,title,appropriateness&order=role_id,nist_phase,id&limit=300');
    acState.cards = Array.isArray(data) ? data : [];
  } catch(e) {
    acState.cards = [];
  }
  acState.loading = false;
  if (activeNav === 'appropriateness_curator') renderMain();
}

// ── Helpers ──────────────────────────────────────────────────

function acGetRating(card, scenario) {
  const src = acState.changed[card.id] || card;
  return src.appropriateness?.[scenario]?.rating || '';
}
function acGetWeight(card, scenario) {
  const src = acState.changed[card.id] || card;
  return src.appropriateness?.[scenario]?.weight || 1;
}
function acRatingColor(rating) {
  if (rating === 'correct')             return '#dcfce7;color:#15803d';
  if (rating === 'defensible-partial')  return '#fef3c7;color:#92400e';
  if (rating === 'inappropriate')       return '#fee2e2;color:#b91c1c';
  if (rating === 'not-applicable')      return '#f3f4f6;color:#6b7280';
  return '#fff;color:var(--muted)';
}

function acFilteredCards() {
  if (!acState.cards) return [];
  return acState.cards.filter(c => {
    if (acState.roleFilter  && c.role_id   !== acState.roleFilter)  return false;
    if (acState.phaseFilter && c.nist_phase !== acState.phaseFilter) return false;
    if (acState.search) {
      const q = acState.search.toLowerCase();
      if (!c.title.toLowerCase().includes(q) && !c.id.toLowerCase().includes(q)) return false;
    }
    if (acState.ratingFilter === 'unset') {
      if (AC_SCENARIOS.every(s => acGetRating(c, s) !== '')) return false;
    }
    if (acState.ratingFilter === 'has-na') {
      if (!AC_SCENARIOS.some(s => acGetRating(c, s) === 'not-applicable')) return false;
    }
    if (acState.ratingFilter === 'has-inappropriate') {
      if (!AC_SCENARIOS.some(s => acGetRating(c, s) === 'inappropriate')) return false;
    }
    if (acState.ratingFilter === 'changed') {
      if (!acState.changed[c.id]) return false;
    }
    return true;
  });
}

// ── Main render ──────────────────────────────────────────────

function renderAppropriatenessCurator() {
  if (!acState.cards) {
    acEnsureData();
    return `<div style="text-align:center;padding:3rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,.15);border-top-color:var(--navy);width:22px;height:22px;margin:0 auto .75rem"></div>
      <div style="font-size:12px">Loading response cards…</div>
    </div>`;
  }

  const total      = acState.cards.length;
  const fullyRated = acState.cards.filter(c => AC_SCENARIOS.every(s => acGetRating(c, s) !== '')).length;
  const changedCt  = Object.keys(acState.changed).length;
  const pct        = total ? Math.round(fullyRated / total * 100) : 0;

  const filtered = acFilteredCards();

  // Group filtered by role → phase
  const grouped = {};
  for (const c of filtered) {
    if (!grouped[c.role_id]) grouped[c.role_id] = {};
    if (!grouped[c.role_id][c.nist_phase]) grouped[c.role_id][c.nist_phase] = [];
    grouped[c.role_id][c.nist_phase].push(c);
  }

  return `
<div style="padding:16px 20px;max-width:1100px">

  <!-- Header -->
  <div class="card" style="padding:14px 18px;margin-bottom:14px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
    <div>
      <div style="font-size:15px;font-weight:700;color:var(--navy)">Response Card Appropriateness Curator</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">Platform Admin · Tune per-scenario ratings and critical weights on tt_response_cards</div>
    </div>
    <div style="margin-left:auto;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div style="text-align:right">
        <div style="font-size:20px;font-weight:700;color:${pct===100?'var(--green)':'var(--navy)'}">${fullyRated}<span style="font-size:12px;font-weight:400;color:var(--muted)"> / ${total}</span></div>
        <div style="font-size:10px;color:var(--muted);font-weight:600;letter-spacing:.05em">FULLY RATED</div>
      </div>
      <div style="width:72px;height:6px;background:#e5e7eb;border-radius:3px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${pct===100?'var(--green)':'var(--cyan)'};transition:.3s"></div>
      </div>
      ${changedCt ? `<span style="font-size:11px;font-weight:700;color:var(--amber);background:#fef3c7;padding:3px 10px;border-radius:20px">${changedCt} unsaved</span>` : ''}
      <button class="btn btn-primary btn-sm" onclick="acSaveAll()">Save All Changes</button>
    </div>
  </div>

  <!-- Filters -->
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center">
    <select class="form-select" style="font-size:12px;padding:5px 10px;border:1.5px solid var(--border);border-radius:7px;font-family:inherit;outline:none;color:var(--text);background:#fff"
      onchange="acState.roleFilter=this.value;renderMain()">
      <option value="" ${!acState.roleFilter?'selected':''}>All Roles</option>
      ${AC_ROLE_ORDER.map(r=>`<option value="${r}" ${acState.roleFilter===r?'selected':''}>${AC_ROLE_NAMES[r]}</option>`).join('')}
    </select>
    <select class="form-select" style="font-size:12px;padding:5px 10px;border:1.5px solid var(--border);border-radius:7px;font-family:inherit;outline:none;color:var(--text);background:#fff"
      onchange="acState.phaseFilter=this.value;renderMain()">
      <option value="" ${!acState.phaseFilter?'selected':''}>All Phases</option>
      ${AC_PHASE_ORDER.map(p=>`<option value="${p}" ${acState.phaseFilter===p?'selected':''}>${AC_PHASE_LABELS[p]}</option>`).join('')}
    </select>
    <select class="form-select" style="font-size:12px;padding:5px 10px;border:1.5px solid var(--border);border-radius:7px;font-family:inherit;outline:none;color:var(--text);background:#fff"
      onchange="acState.ratingFilter=this.value;renderMain()">
      <option value="" ${!acState.ratingFilter?'selected':''}>All Ratings</option>
      <option value="unset" ${acState.ratingFilter==='unset'?'selected':''}>Unset (missing scenarios)</option>
      <option value="has-na" ${acState.ratingFilter==='has-na'?'selected':''}>Has not-applicable</option>
      <option value="has-inappropriate" ${acState.ratingFilter==='has-inappropriate'?'selected':''}>Has inappropriate</option>
      <option value="changed" ${acState.ratingFilter==='changed'?'selected':''}>Unsaved changes</option>
    </select>
    <input type="text" placeholder="Search title or ID…" value="${acState.search}"
      oninput="acState.search=this.value;renderMain()"
      style="font-size:12px;padding:5px 10px;border:1.5px solid var(--border);border-radius:7px;font-family:inherit;outline:none;color:var(--text);width:160px"/>
    ${(acState.roleFilter||acState.phaseFilter||acState.ratingFilter||acState.search) ? `<button class="btn btn-outline btn-sm" onclick="acState.roleFilter='';acState.phaseFilter='';acState.ratingFilter='';acState.search='';renderMain()">Clear</button>` : ''}
    <span style="font-size:11px;color:var(--muted);margin-left:4px">${filtered.length} card${filtered.length!==1?'s':''}</span>
  </div>

  <!-- Stats strip -->
  <div style="display:flex;gap:16px;font-size:11px;font-weight:600;color:var(--muted);margin-bottom:16px;flex-wrap:wrap">
    ${(()=>{
      const hasNA    = acState.cards.filter(c=>AC_SCENARIOS.some(s=>acGetRating(c,s)==='not-applicable')).length;
      const hasWrong = acState.cards.filter(c=>AC_SCENARIOS.some(s=>acGetRating(c,s)==='inappropriate')).length;
      const unset    = acState.cards.filter(c=>AC_SCENARIOS.some(s=>acGetRating(c,s)==='')).length;
      return `<span style="color:var(--green)">✓ ${fullyRated} fully rated</span>
              <span style="color:#6b7280">— ${hasNA} with not-applicable</span>
              <span style="color:#b91c1c">✗ ${hasWrong} with inappropriate</span>
              ${unset ? `<span style="color:var(--amber)">⚠ ${unset} have unset scenarios</span>` : ''}`;
    })()}
  </div>

  ${filtered.length === 0 ? `<div style="text-align:center;padding:2rem;color:var(--muted)">No cards match the current filters.</div>` : ''}

  <!-- Cards grouped by role → phase -->
  ${AC_ROLE_ORDER.filter(r=>grouped[r]).map(role => {
    const roleTotal = Object.values(grouped[role]).flat().length;
    return `<div style="margin-bottom:24px">
      <div style="font-size:13px;font-weight:700;color:var(--navy);padding:10px 14px;background:#fff;border:1px solid var(--border);border-radius:10px 10px 0 0;border-bottom:none">
        ${AC_ROLE_NAMES[role]}
        <span style="font-size:11px;font-weight:400;color:var(--muted);margin-left:6px">${roleTotal} card${roleTotal!==1?'s':''}</span>
      </div>
      ${AC_PHASE_ORDER.filter(p=>grouped[role]?.[p]).map((phase, pi, phases) => {
        const phaseCards = grouped[role][phase];
        const isLast = pi === phases.filter(p=>grouped[role]?.[p]).length - 1;
        return `<div>
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);padding:6px 14px;background:var(--bg);border:1px solid var(--border);border-top:none">
            ${AC_PHASE_LABELS[phase]} — ${phaseCards.length} card${phaseCards.length!==1?'s':''}
          </div>
          <div style="border:1px solid var(--border);border-top:none;background:#fff;${isLast?'border-radius:0 0 10px 10px;overflow:hidden':''}">
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr style="background:var(--bg)">
                  <th style="padding:7px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);text-align:left;white-space:nowrap;border-bottom:1px solid var(--border)">ID</th>
                  <th style="padding:7px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);text-align:left;border-bottom:1px solid var(--border)">Title</th>
                  ${AC_SCENARIOS.map(s=>`<th style="padding:7px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);text-align:center;border-bottom:1px solid var(--border);min-width:130px">${AC_SCENARIO_LABELS[s]}</th>`).join('')}
                  <th style="padding:7px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);text-align:left;border-bottom:1px solid var(--border)">Save</th>
                </tr>
              </thead>
              <tbody>
                ${phaseCards.map((c,ci) => acRenderRow(c, ci === phaseCards.length - 1)).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }).join('')}

</div>`;
}

function acRenderRow(card, isLast) {
  const hasPending = !!acState.changed[card.id];
  const borderStyle = isLast ? '' : 'border-bottom:1px solid var(--border)';
  const scenarioCells = AC_SCENARIOS.map(s => {
    const rating = acGetRating(card, s);
    const weight = acGetWeight(card, s);
    const colorStyle = acRatingColor(rating);
    return `<td style="padding:6px 8px;${borderStyle};vertical-align:middle">
      <select style="width:100%;padding:3px 6px;border:1.5px solid var(--border);border-radius:6px;font-size:11px;font-weight:600;font-family:inherit;outline:none;cursor:pointer;background:${colorStyle.split(';')[0].replace('background:','').trim()};${colorStyle.includes('color:')?'color:'+colorStyle.split('color:')[1]:''}"
        onchange="acOnRatingChange('${card.id}','${s}',this)">
        <option value="" ${!rating?'selected':''}>(unset)</option>
        ${AC_RATINGS.map(r=>`<option value="${r}" ${rating===r?'selected':''}>${AC_RATING_LABELS[r]}</option>`).join('')}
      </select>
      <div style="display:flex;gap:2px;margin-top:3px">
        <button onclick="acOnWeightChange('${card.id}','${s}',1)" style="flex:1;padding:2px 4px;font-size:10px;font-weight:700;border:1.5px solid ${weight===1?'#7dd3fc':'var(--border)'};border-radius:4px;cursor:pointer;background:${weight===1?'#e0f2fe':'#fff'};color:${weight===1?'#0369a1':'var(--muted)'};font-family:inherit">1</button>
        <button onclick="acOnWeightChange('${card.id}','${s}',2)" style="flex:1;padding:2px 4px;font-size:10px;font-weight:700;border:1.5px solid ${weight===2?'#fcd34d':'var(--border)'};border-radius:4px;cursor:pointer;background:${weight===2?'#fef3c7':'#fff'};color:${weight===2?'#92400e':'var(--muted)'};font-family:inherit">2★</button>
      </div>
    </td>`;
  }).join('');

  return `<tr style="${borderStyle}" onmouseenter="this.style.background='#f8f9fc'" onmouseleave="this.style.background=''">
    <td style="padding:6px 10px;${borderStyle};white-space:nowrap">
      <span style="font-size:10px;font-weight:700;color:var(--muted);font-family:monospace">${card.id}</span>
      ${hasPending ? `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--amber);margin-left:4px;vertical-align:middle" title="Unsaved changes"></span>` : ''}
    </td>
    <td style="padding:6px 10px;${borderStyle};font-size:12px;max-width:200px">${card.title}</td>
    ${scenarioCells}
    <td style="padding:6px 10px;${borderStyle};white-space:nowrap">
      <button class="btn btn-primary btn-sm" onclick="acSaveCard('${card.id}')">Save</button>
    </td>
  </tr>`;
}

// ── Event handlers ────────────────────────────────────────────

function acEnsureChanged(id) {
  if (!acState.changed[id]) {
    const card = (acState.cards || []).find(c => c.id === id);
    acState.changed[id] = { appropriateness: JSON.parse(JSON.stringify(card?.appropriateness || {})) };
  }
}

function acOnRatingChange(id, scenario, sel) {
  acEnsureChanged(id);
  if (!acState.changed[id].appropriateness[scenario]) acState.changed[id].appropriateness[scenario] = { rating: '', weight: 1 };
  acState.changed[id].appropriateness[scenario].rating = sel.value;
  renderMain();
}

function acOnWeightChange(id, scenario, weight) {
  acEnsureChanged(id);
  if (!acState.changed[id].appropriateness[scenario]) acState.changed[id].appropriateness[scenario] = { rating: '', weight: 1 };
  acState.changed[id].appropriateness[scenario].weight = weight;
  renderMain();
}

async function acSaveCard(id) {
  const pending = acState.changed[id];
  if (!pending) { showToast('No changes to save'); return; }
  try {
    await sbFetch('tt_response_cards?id=eq.' + encodeURIComponent(id), {
      method: 'PATCH',
      headers: { 'Prefer': 'return=minimal' },
      body: JSON.stringify({ appropriateness: pending.appropriateness })
    });
    const card = (acState.cards || []).find(c => c.id === id);
    if (card) card.appropriateness = JSON.parse(JSON.stringify(pending.appropriateness));
    delete acState.changed[id];
    showToast('Saved ' + id);
    renderMain();
  } catch(e) {
    showToast('Error: ' + e.message, true);
  }
}

async function acSaveAll() {
  const ids = Object.keys(acState.changed);
  if (!ids.length) { showToast('No unsaved changes'); return; }
  let saved = 0, failed = 0;
  for (const id of ids) {
    try {
      await sbFetch('tt_response_cards?id=eq.' + encodeURIComponent(id), {
        method: 'PATCH',
        headers: { 'Prefer': 'return=minimal' },
        body: JSON.stringify({ appropriateness: acState.changed[id].appropriateness })
      });
      const card = (acState.cards || []).find(c => c.id === id);
      if (card) card.appropriateness = JSON.parse(JSON.stringify(acState.changed[id].appropriateness));
      delete acState.changed[id];
      saved++;
    } catch(e) { failed++; }
  }
  showToast(saved + ' saved' + (failed ? ', ' + failed + ' failed' : ''), failed > 0);
  renderMain();
}

window.renderAppropriatenessCurator = renderAppropriatenessCurator;
window.acSaveCard  = acSaveCard;
window.acSaveAll   = acSaveAll;
window.acOnRatingChange = acOnRatingChange;
window.acOnWeightChange = acOnWeightChange;
