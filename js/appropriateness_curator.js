// ============================================================
// APPROPRIATENESS CURATOR — Platform Admin only (TB7)
// Review and tune per-scenario ratings on tt_response_cards.
// Also supports adding new cards (in-place authoring).
// appropriateness shape: { scenario: { rating, weight } }
// ============================================================

const AC_SCENARIOS = ['ransomware','bec','insider','vendor_compromise'];
const AC_SCENARIO_LABELS = { ransomware:'Ransomware', bec:'BEC', insider:'Insider', vendor_compromise:'Vendor' };
const AC_RATINGS = ['correct','defensible-partial','inappropriate','not-applicable'];
const AC_RATING_LABELS = { 'correct':'Correct', 'defensible-partial':'Defensible-Partial', 'inappropriate':'Inappropriate', 'not-applicable':'Not Applicable' };
const AC_ROLE_ORDER = ['ic','tl','cl','lc','es'];
const AC_ROLE_NAMES  = { ic:'IC — Incident Commander', tl:'TL — Technical Lead', cl:'CL — Comms Lead', lc:'LC — Legal Counsel', es:'ES — Executive Sponsor' };
const AC_PHASE_ORDER = ['detect_analyze','contain','eradicate','recover','post_incident'];
const AC_PHASE_LABELS = { detect_analyze:'Detect / Analyze', contain:'Contain', eradicate:'Eradicate', recover:'Recover', post_incident:'Post-Incident' };
const AC_PHASE_NUMS  = { detect_analyze:1, contain:2, eradicate:3, recover:4, post_incident:5 };

let acState = {
  cards:       null,   // all tt_response_cards rows
  loading:     false,
  changed:     {},     // id → { appropriateness: {...} }
  roleFilter:  '',
  phaseFilter: '',
  ratingFilter:'',
  search:      '',
  legendOpen:  false,
  // add-card modal
  adding:      false,
  newCard: { role_id:'ic', nist_phase:'detect_analyze', id:'', title:'', body:'', scenario_types:[], curated:false },
};

// ── Data loading ─────────────────────────────────────────────

async function acEnsureData() {
  if (acState.cards || acState.loading) return;
  acState.loading = true;
  try {
    const data = await sbFetch('tt_response_cards?select=id,role_id,nist_phase,title,body,appropriateness,scenario_types,curated&order=role_id,nist_phase,id&limit=500');
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
    if (acState.roleFilter  && c.role_id    !== acState.roleFilter)  return false;
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

// Auto-suggest next ID for a given role + phase
function acSuggestId(role, phase) {
  const phaseNum = AC_PHASE_NUMS[phase] || 1;
  const prefix   = `RC-${role.toUpperCase()}-${phaseNum}-`;
  const existing = (acState.cards || [])
    .filter(c => c.id.startsWith(prefix))
    .map(c => parseInt(c.id.replace(prefix, ''), 10))
    .filter(n => !isNaN(n));
  const next = existing.length ? Math.max(...existing) + 1 : 1;
  return prefix + String(next).padStart(2, '0');
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
      <div style="font-size:11px;color:var(--muted);margin-top:2px">Platform Admin · Tune ratings and weights · Add new response cards</div>
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
      <button class="btn btn-cyan btn-sm" onclick="acOpenAddModal()">+ Add Card</button>
      <button class="btn btn-primary btn-sm" onclick="acSaveAll()">Save All Changes</button>
    </div>
  </div>

  <!-- Legend (collapsible) -->
  <div style="margin-bottom:14px;border:1.5px solid var(--border);border-radius:10px;background:#fff;overflow:hidden">
    <button onclick="acState.legendOpen=!acState.legendOpen;renderMain()"
      style="width:100%;padding:10px 16px;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:8px;font-family:inherit;text-align:left">
      <span style="font-size:13px;font-weight:700;color:var(--navy)">How this tool works</span>
      <span style="font-size:11px;color:var(--muted);margin-left:4px">— ratings, weights, dealing rule, curated flag</span>
      <span style="margin-left:auto;font-size:14px;color:var(--muted)">${acState.legendOpen ? '▲' : '▼'}</span>
    </button>
    ${acState.legendOpen ? `
    <div style="padding:0 16px 16px;display:flex;flex-direction:column;gap:16px;border-top:1px solid var(--border)">

      <!-- Big picture -->
      <div style="padding-top:12px">
        <p style="margin:0;font-size:12px;color:var(--text);line-height:1.6">
          Each <strong>response card</strong> is an action a player can take during a tabletop exercise (e.g. <em>"Convene the IR team"</em>).
          During a live session (TB9), the engine deals each player a hand of cards filtered to their role and the current NIST phase.
          This tool lets you control <strong>which cards get dealt in which scenarios</strong>, and mark cards as <strong>ready to use</strong>.
        </p>
      </div>

      <!-- Ratings -->
      <div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:8px">Ratings — what they mean</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px">
          <div style="padding:10px 12px;background:#dcfce7;border-radius:8px">
            <div style="font-size:12px;font-weight:700;color:#15803d">Correct</div>
            <div style="font-size:11px;color:#166534;margin-top:3px;line-height:1.5">The right action for this scenario. Player scores full points. <em>Example: "Isolate the endpoint" in a ransomware scenario.</em></div>
          </div>
          <div style="padding:10px 12px;background:#fef3c7;border-radius:8px">
            <div style="font-size:12px;font-weight:700;color:#92400e">Defensible-Partial</div>
            <div style="font-size:11px;color:#78350f;margin-top:3px;line-height:1.5">Reasonable but not optimal — partial credit. Good for sparking discussion. <em>Example: "Notify all staff" before scope is confirmed.</em></div>
          </div>
          <div style="padding:10px 12px;background:#fee2e2;border-radius:8px">
            <div style="font-size:12px;font-weight:700;color:#b91c1c">Inappropriate</div>
            <div style="font-size:11px;color:#991b1b;margin-top:3px;line-height:1.5">Plausible-but-wrong distractor — zero or negative points. <strong>IS dealt</strong> so players can make the wrong call. <em>Example: "Isolate the endpoint" in a BEC wire-fraud scenario — no endpoint to isolate.</em></div>
          </div>
          <div style="padding:10px 12px;background:#f3f4f6;border-radius:8px">
            <div style="font-size:12px;font-weight:700;color:#6b7280">Not Applicable</div>
            <div style="font-size:11px;color:#4b5563;margin-top:3px;line-height:1.5">Completely irrelevant to this scenario — <strong>NOT dealt at all</strong>. Skip silently. <em>Example: "Freeze wire transfers" in a ransomware scenario.</em></div>
          </div>
        </div>
      </div>

      <!-- Dealing rule -->
      <div style="padding:10px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px">
        <div style="font-size:11px;font-weight:700;color:#1d4ed8;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">TB9 Dealing Rule</div>
        <div style="font-size:12px;color:#1e3a8a;line-height:1.6">
          Deal: <strong>correct</strong> + <strong>defensible-partial</strong> + <strong>inappropriate</strong><br>
          Skip: <strong>not-applicable</strong> only<br>
          <span style="color:#1d4ed8;font-size:11px">The key insight: inappropriate cards ARE included — they're the distractors that create realistic decision pressure.</span>
        </div>
      </div>

      <!-- Weights -->
      <div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:8px">Weight — how important is this card?</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <div style="padding:10px 14px;background:#e0f2fe;border:1px solid #7dd3fc;border-radius:8px;flex:1;min-width:200px">
            <div style="font-size:12px;font-weight:700;color:#0369a1">Weight 1 — Normal</div>
            <div style="font-size:11px;color:#0c4a6e;margin-top:3px;line-height:1.5">Standard action. Correct/wrong matters but isn't catastrophic.</div>
          </div>
          <div style="padding:10px 14px;background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;flex:1;min-width:200px">
            <div style="font-size:12px;font-weight:700;color:#92400e">Weight 2★ — Critical</div>
            <div style="font-size:11px;color:#78350f;margin-top:3px;line-height:1.5">Must-do action, or catastrophic if wrong. Scores double. Used for breach declaration, legal notification, evidence preservation.</div>
          </div>
        </div>
      </div>

      <!-- scenario_types vs appropriateness -->
      <div style="padding:10px 14px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px">
        <div style="font-size:11px;font-weight:700;color:#6d28d9;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">scenario_types vs appropriateness — what's the difference?</div>
        <div style="font-size:12px;color:#4c1d95;line-height:1.6">
          <strong>appropriateness</strong> (this table) — controls whether a card is <em>dealt</em> in a given scenario.<br>
          <strong>scenario_types</strong> (set when adding a card) — marks which scenarios the action is <em>correct</em> in, used by TB10 scoring to auto-grade hands.<br>
          <span style="font-size:11px;color:#7c3aed">They often overlap, but appropriateness drives the hand; scenario_types drives the score.</span>
        </div>
      </div>

      <!-- Curated -->
      <div style="padding:10px 14px;background:#f0fdf4;border:1px solid #86efac;border-radius:8px">
        <div style="font-size:11px;font-weight:700;color:#15803d;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">Curated flag</div>
        <div style="font-size:12px;color:#14532d;line-height:1.6">
          TB9 <strong>only deals cards where curated = true</strong>. All seeded cards start as <em>curated=false</em> — a safety gate so unreviewed cards never show up in a live client session.
          Once you've reviewed a card and set its ratings, flip it to curated in the table.
        </div>
      </div>

    </div>` : ''}
  </div>

  <!-- Filters -->
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center">
    <select style="font-size:12px;padding:5px 10px;border:1.5px solid var(--border);border-radius:7px;font-family:inherit;outline:none;color:var(--text);background:#fff"
      onchange="acState.roleFilter=this.value;renderMain()">
      <option value="" ${!acState.roleFilter?'selected':''}>All Roles</option>
      ${AC_ROLE_ORDER.map(r=>`<option value="${r}" ${acState.roleFilter===r?'selected':''}>${AC_ROLE_NAMES[r]}</option>`).join('')}
    </select>
    <select style="font-size:12px;padding:5px 10px;border:1.5px solid var(--border);border-radius:7px;font-family:inherit;outline:none;color:var(--text);background:#fff"
      onchange="acState.phaseFilter=this.value;renderMain()">
      <option value="" ${!acState.phaseFilter?'selected':''}>All Phases</option>
      ${AC_PHASE_ORDER.map(p=>`<option value="${p}" ${acState.phaseFilter===p?'selected':''}>${AC_PHASE_LABELS[p]}</option>`).join('')}
    </select>
    <select style="font-size:12px;padding:5px 10px;border:1.5px solid var(--border);border-radius:7px;font-family:inherit;outline:none;color:var(--text);background:#fff"
      onchange="acState.ratingFilter=this.value;renderMain()">
      <option value="" ${!acState.ratingFilter?'selected':''}>All Ratings</option>
      <option value="unset"            ${acState.ratingFilter==='unset'?'selected':''}>Unset (missing scenarios)</option>
      <option value="has-na"           ${acState.ratingFilter==='has-na'?'selected':''}>Has not-applicable</option>
      <option value="has-inappropriate"${acState.ratingFilter==='has-inappropriate'?'selected':''}>Has inappropriate</option>
      <option value="changed"          ${acState.ratingFilter==='changed'?'selected':''}>Unsaved changes</option>
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

</div>

${acState.adding ? acRenderAddModal() : ''}`;
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

  const bodyPreview = (card.body || '').slice(0, 90) + ((card.body || '').length > 90 ? '…' : '');

  return `<tr style="${borderStyle}" onmouseenter="this.style.background='#f8f9fc'" onmouseleave="this.style.background=''">
    <td style="padding:6px 10px;${borderStyle};white-space:nowrap;vertical-align:top">
      <span style="font-size:10px;font-weight:700;color:var(--muted);font-family:monospace">${card.id}</span>
      ${hasPending ? `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--amber);margin-left:4px;vertical-align:middle" title="Unsaved changes"></span>` : ''}
      ${card.curated ? `<span style="display:block;font-size:9px;font-weight:700;color:#15803d;margin-top:2px">✓ curated</span>` : ''}
    </td>
    <td style="padding:6px 10px;${borderStyle};vertical-align:top">
      <div style="font-size:12px;font-weight:600;color:var(--text)">${card.title}</div>
      ${bodyPreview ? `<div style="font-size:10px;color:var(--muted);margin-top:2px;max-width:220px;line-height:1.4">${bodyPreview}</div>` : ''}
    </td>
    ${scenarioCells}
    <td style="padding:6px 10px;${borderStyle};white-space:nowrap;vertical-align:top">
      <button class="btn btn-primary btn-sm" onclick="acSaveCard('${card.id}')">Save</button>
    </td>
  </tr>`;
}

// ── Add Card Modal ────────────────────────────────────────────

function acRenderAddModal() {
  const n = acState.newCard;
  const suggestedId = acSuggestId(n.role_id, n.nist_phase);
  const displayId   = n.id || suggestedId;

  return `
<div id="acAddOverlay" style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px"
  onclick="if(event.target===this)acCloseAddModal()">
  <div class="card" style="width:100%;max-width:640px;max-height:90vh;overflow-y:auto;padding:0;border-radius:14px">

    <!-- Modal header -->
    <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-size:15px;font-weight:700;color:var(--navy)">Add Response Card</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">New card will be <strong>curated=false</strong> by default — flip it in the table when ready</div>
      </div>
      <button onclick="acCloseAddModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted);padding:4px 8px">×</button>
    </div>

    <!-- Modal body -->
    <div style="padding:20px;display:flex;flex-direction:column;gap:14px">

      <!-- Role + Phase row -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:4px">Role</label>
          <select id="acNewRole" style="width:100%;padding:7px 10px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;outline:none;color:var(--text)"
            onchange="acNewRoleOrPhaseChange()">
            ${AC_ROLE_ORDER.map(r=>`<option value="${r}" ${n.role_id===r?'selected':''}>${AC_ROLE_NAMES[r]}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:4px">NIST Phase</label>
          <select id="acNewPhase" style="width:100%;padding:7px 10px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;outline:none;color:var(--text)"
            onchange="acNewRoleOrPhaseChange()">
            ${AC_PHASE_ORDER.map(p=>`<option value="${p}" ${n.nist_phase===p?'selected':''}>${AC_PHASE_LABELS[p]}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Card ID -->
      <div>
        <label style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:4px">
          Card ID
          <span style="font-weight:400;text-transform:none;letter-spacing:0;margin-left:6px;color:#94a3b8">auto-suggested — edit if needed</span>
        </label>
        <input id="acNewId" type="text" value="${displayId}"
          oninput="acState.newCard.id=this.value"
          style="width:100%;padding:7px 10px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:monospace;outline:none;color:var(--navy);font-weight:700;box-sizing:border-box"/>
      </div>

      <!-- Title -->
      <div>
        <label style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:4px">Title <span style="color:#ef4444">*</span></label>
        <input type="text" placeholder="Short action title shown on the card face…"
          value="${(n.title||'').replace(/"/g,'&quot;')}"
          oninput="acState.newCard.title=this.value"
          style="width:100%;padding:7px 10px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;outline:none;color:var(--text);box-sizing:border-box"/>
      </div>

      <!-- Body -->
      <div>
        <label style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:4px">Body <span style="color:#ef4444">*</span></label>
        <textarea placeholder="Full card text — what the player is instructed to do…" rows="4"
          oninput="acState.newCard.body=this.value"
          style="width:100%;padding:7px 10px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;outline:none;color:var(--text);resize:vertical;box-sizing:border-box">${(n.body||'').replace(/</g,'&lt;')}</textarea>
      </div>

      <!-- Scenario types (correct-action scenarios for scoring) -->
      <div>
        <label style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:6px">
          scenario_types
          <span style="font-weight:400;text-transform:none;letter-spacing:0;margin-left:6px;color:#94a3b8">scenarios where this is a CORRECT action (used by TB10 scoring — not a dealing filter)</span>
        </label>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${AC_SCENARIOS.map(s=>{
            const checked = (n.scenario_types||[]).includes(s);
            return `<label style="display:flex;align-items:center;gap:5px;padding:5px 12px;border:1.5px solid ${checked?'var(--cyan)':'var(--border)'};border-radius:20px;cursor:pointer;background:${checked?'#e0f9ff':'#fff'};font-size:12px;font-weight:600;color:${checked?'var(--cyan2)':'var(--muted)'};transition:.15s">
              <input type="checkbox" ${checked?'checked':''} onchange="acToggleScenarioType('${s}',this.checked)" style="display:none"/>
              ${AC_SCENARIO_LABELS[s]}
            </label>`;
          }).join('')}
        </div>
      </div>

      <!-- Curated -->
      <div style="display:flex;align-items:center;gap:10px">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;font-weight:600;color:var(--text)">
          <input type="checkbox" ${n.curated?'checked':''} onchange="acState.newCard.curated=this.checked"
            style="width:16px;height:16px;cursor:pointer;accent-color:var(--navy)"/>
          Mark as curated immediately
        </label>
        <span style="font-size:11px;color:var(--muted)">(only curated cards are dealt in live TB9 sessions)</span>
      </div>

    </div>

    <!-- Modal footer -->
    <div style="padding:14px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:10px">
      <button class="btn btn-outline" onclick="acCloseAddModal()">Cancel</button>
      <button class="btn btn-primary" onclick="acSaveNewCard()">Create Card</button>
    </div>

  </div>
</div>`;
}

// ── Add Card handlers ─────────────────────────────────────────

function acOpenAddModal() {
  const suggested = acSuggestId(acState.newCard.role_id, acState.newCard.nist_phase);
  acState.newCard.id = suggested;
  acState.adding = true;
  renderMain();
}

function acCloseAddModal() {
  acState.adding  = false;
  acState.newCard = { role_id:'ic', nist_phase:'detect_analyze', id:'', title:'', body:'', scenario_types:[], curated:false };
  renderMain();
}

function acNewRoleOrPhaseChange() {
  const roleEl  = document.getElementById('acNewRole');
  const phaseEl = document.getElementById('acNewPhase');
  if (!roleEl || !phaseEl) return;
  acState.newCard.role_id    = roleEl.value;
  acState.newCard.nist_phase = phaseEl.value;
  // only auto-update ID if user hasn't manually edited it
  const suggested = acSuggestId(acState.newCard.role_id, acState.newCard.nist_phase);
  acState.newCard.id = suggested;
  // re-render just the ID field to show the new suggestion
  const idEl = document.getElementById('acNewId');
  if (idEl) idEl.value = suggested;
}

function acToggleScenarioType(scenario, checked) {
  const types = acState.newCard.scenario_types || [];
  if (checked) {
    if (!types.includes(scenario)) types.push(scenario);
  } else {
    const i = types.indexOf(scenario);
    if (i > -1) types.splice(i, 1);
  }
  acState.newCard.scenario_types = types;
  // re-render just the chips without closing modal
  renderMain();
}

async function acSaveNewCard() {
  const n = acState.newCard;
  const id = (document.getElementById('acNewId')?.value || n.id || '').trim();
  if (!id)       { showToast('Card ID is required', true); return; }
  if (!n.title?.trim())  { showToast('Title is required', true); return; }
  if (!n.body?.trim())   { showToast('Body is required', true); return; }
  if ((acState.cards || []).find(c => c.id === id)) {
    showToast('ID "' + id + '" already exists — choose a different ID', true); return;
  }

  const payload = {
    id,
    role_id:        n.role_id,
    nist_phase:     n.nist_phase,
    track:          'ir',
    title:          n.title.trim(),
    body:           n.body.trim(),
    scenario_types: n.scenario_types || [],
    appropriateness:{},
    curated:        !!n.curated,
  };

  try {
    await sbFetch('tt_response_cards', {
      method:  'POST',
      headers: { 'Prefer': 'return=minimal' },
      body:    JSON.stringify(payload),
    });
    // Push into local state so it appears immediately without a reload
    if (!acState.cards) acState.cards = [];
    acState.cards.push(payload);
    // Sort: role_id → nist_phase → id
    acState.cards.sort((a,b) => {
      const ro = AC_ROLE_ORDER.indexOf(a.role_id) - AC_ROLE_ORDER.indexOf(b.role_id);
      if (ro) return ro;
      const po = AC_PHASE_ORDER.indexOf(a.nist_phase) - AC_PHASE_ORDER.indexOf(b.nist_phase);
      if (po) return po;
      return a.id.localeCompare(b.id);
    });
    showToast('Created ' + id);
    acCloseAddModal();
    // Auto-filter to the new card's role+phase so Mark can see it
    acState.roleFilter  = payload.role_id;
    acState.phaseFilter = payload.nist_phase;
    renderMain();
  } catch(e) {
    showToast('Error creating card: ' + e.message, true);
  }
}

// ── Existing card event handlers ──────────────────────────────

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
      body: JSON.stringify({ appropriateness: pending.appropriateness }),
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
        body: JSON.stringify({ appropriateness: acState.changed[id].appropriateness }),
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
window.acEnsureData        = acEnsureData;
window.acSaveCard          = acSaveCard;
window.acSaveAll           = acSaveAll;
window.acOnRatingChange    = acOnRatingChange;
window.acOnWeightChange    = acOnWeightChange;
window.acOpenAddModal      = acOpenAddModal;
window.acCloseAddModal     = acCloseAddModal;
window.acNewRoleOrPhaseChange = acNewRoleOrPhaseChange;
window.acToggleScenarioType   = acToggleScenarioType;
window.acSaveNewCard       = acSaveNewCard;
