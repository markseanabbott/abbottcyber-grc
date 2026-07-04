// ============================================================
// TB5 — TB Storyboard Precedence Selection Engine
// Branching inject chain runner for IR archetypes.
// Curated gate enforced at fetch (curated=eq.true).
// Seeded PRNG for reproducible preview + reroll.
// ============================================================

// ── Archetype metadata ────────────────────────────────────────────────────
const TSB_ARCHETYPES = {
  ransomware:        { label: 'Ransomware',                icon: '🔒' },
  bec:               { label: 'Business Email Compromise', icon: '📧' },
  insider:           { label: 'Insider Threat',            icon: '👤' },
  vendor_compromise: { label: 'Vendor Compromise',         icon: '🏢' },
};

const TSB_ROLE_LABELS = {
  ic: 'Incident Commander',
  tl: 'Technical Lead',
  cl: 'Communications Lead',
  lc: 'Legal Counsel',
  es: 'Executive Sponsor',
};
const TSB_ROLE_COLORS = {
  ic: '#dc2626', tl: '#2563eb', cl: '#16a34a', lc: '#7c3aed', es: '#d97706',
};
const TSB_NIST_LABELS = {
  1: 'Detect / Analyze', 2: 'Contain', 3: 'Eradicate', 4: 'Recover', 5: 'Post-Incident',
};

// ── Module state ──────────────────────────────────────────────────────────
let tsbState = {
  view:          'setup',   // 'setup' | 'running' | 'terminal'
  archetype:     null,
  allCards:      [],        // curated cards for current archetype (from DB)
  loading:       false,
  loadError:     null,
  seed:          null,      // 32-bit unsigned int — set on archetype load and reroll
  prngCallCount: 0,         // advances +1 per card drawn; reset to 0 on Start
  previewPath:   [],        // [{stage, card}] — simulated from seed, shown on setup
  tagState:      [],        // accumulated grant tags during live session
  currentStage:  1,
  currentCard:   null,
  path:          [],        // [{stage, card}] — actual path taken so far
  showPath:      false,
  sessionId:     null,     // set async when tsbStart() creates a tabletop_sessions row (TB9)
};

// ── Seeded PRNG (mulberry32) ──────────────────────────────────────────────
// Returns the nth value in [0,1) for a given seed. O(1) — jumps directly
// to position n using the fact that mulberry32 state at step k =
// (seed + k * 0x6D2B79F5) | 0.
function tsbPrngValue(seed, n) {
  const s = (seed + Math.imul(n + 1, 0x6D2B79F5)) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function tsbGenSeed() {
  return (Math.random() * 0xFFFFFFFF) >>> 0;
}

// ── Selection engine ──────────────────────────────────────────────────────

function tsbEligibleCards(stage, tagState) {
  return tsbState.allCards.filter(c =>
    c.chain_stage === stage &&
    (c.requires || []).every(t => tagState.includes(t))
  );
}

function tsbWeightedPick(eligible, randVal) {
  const total = eligible.reduce((s, c) => s + (c.weight || 10), 0);
  const r = randVal * total;
  let acc = 0;
  for (const c of eligible) {
    acc += (c.weight || 10);
    if (r < acc) return c;
  }
  return eligible[eligible.length - 1];
}

// Pick next card for a stage, consuming one PRNG value from the live session stream.
function tsbPickCard(stage) {
  const eligible = tsbEligibleCards(stage, tsbState.tagState);
  if (!eligible.length) return null;
  const randVal = tsbPrngValue(tsbState.seed, tsbState.prngCallCount);
  tsbState.prngCallCount++;
  return tsbWeightedPick(eligible, randVal);
}

// Simulate the full chain from seed on a copy of state (no side effects).
// Returns [{stage, card}]. Uses the same PRNG stream that live delivery will use.
function tsbSimulate(seed) {
  let simTags = [];
  let callCount = 0;
  const path = [];
  const maxStage = tsbMaxStage();
  if (!maxStage) return path;

  for (let stage = 1; stage <= maxStage; stage++) {
    const eligible = tsbEligibleCards(stage, simTags);
    if (!eligible.length) break;
    const randVal = tsbPrngValue(seed, callCount);
    callCount++;
    const card = tsbWeightedPick(eligible, randVal);
    path.push({ stage, card });
    const newTags = (card.grants || []).filter(t => !simTags.includes(t));
    simTags = [...simTags, ...newTags];
    if (!card.grants || card.grants.length === 0) break; // terminal card
  }
  return path;
}

function tsbMaxStage() {
  if (!tsbState.allCards.length) return 0;
  return Math.max(...tsbState.allCards.map(c => c.chain_stage));
}

function tsbIsTerminal(card) {
  return !card.grants || card.grants.length === 0;
}

// ── Data loading ──────────────────────────────────────────────────────────

async function tsbSetArchetype(arch) {
  tsbState.archetype  = arch;
  tsbState.view       = 'setup';
  tsbState.allCards   = [];
  tsbState.previewPath = [];
  tsbState.loadError  = null;
  tsbState.loading    = true;
  tsbState.seed       = tsbGenSeed();
  tsbRender();

  try {
    // curated=eq.true enforced at fetch — the gate that keeps draft cards out of client sessions
    const cards = await sbFetch(
      `tt_inject_cards?archetype=eq.${arch}&curated=eq.true&order=chain_stage.asc,id.asc`
    );
    tsbState.allCards   = Array.isArray(cards) ? cards : [];
    tsbState.loading    = false;
    tsbState.previewPath = tsbSimulate(tsbState.seed);
    tsbRender();
  } catch (e) {
    tsbState.loading   = false;
    tsbState.loadError = 'Could not load cards — check your connection and try again.';
    tsbRender();
  }
}

// ── Session control ───────────────────────────────────────────────────────

function tsbReroll() {
  tsbState.seed        = tsbGenSeed();
  tsbState.previewPath = tsbSimulate(tsbState.seed);
  tsbRender();
}

async function tsbStart() {
  if (!tsbState.allCards.length || !tsbState.seed) return;
  tsbState.view          = 'running';
  tsbState.tagState      = [];
  tsbState.currentStage  = 1;
  tsbState.path          = [];
  tsbState.prngCallCount = 0;  // reset so delivery starts at same PRNG position as preview
  tsbState.showPath      = false;
  tsbState.sessionId     = null;
  if (typeof tb9Init === 'function') tb9Init();

  const card = tsbPickCard(1);
  if (!card) {
    toast('No curated cards eligible for Stage 1. Check the Inject Card Curator.', '#dc2626');
    tsbState.view = 'setup';
    tsbRender();
    return;
  }
  tsbState.currentCard  = card;
  tsbState.currentStage = 1;
  tsbState.path.push({ stage: 1, card });
  tsbRender();

  // Create a tabletop_sessions row async (non-blocking) for TB9 card play persistence
  try {
    const code     = await sb.tt.newCode();
    const archMeta = TSB_ARCHETYPES[tsbState.archetype] || {};
    const sess     = await sb.tt.createSession({
      org_id:             (typeof currentOrg !== 'undefined' && currentOrg?.id) || null,
      scenario_id:        `tsb_${tsbState.archetype}`,
      scenario_title:     `${archMeta.label || tsbState.archetype} — Storyboard`,
      session_code:       code,
      status:             'active',
      facilitator_name:   (typeof authState !== 'undefined' && authState?.user?.user_metadata?.name) || 'Facilitator',
      current_inject:     1,
      declaration_logged: false,
      breach_declared:    false,
      notif_filed:        false,
      exercise_log:       [],
    });
    tsbState.sessionId = sess?.id || null;
  } catch (e) {
    console.warn('TB9: session creation failed — card plays will not persist:', e.message || e);
    tsbState.sessionId = null;
  }
}

function tsbAdvance() {
  const prevCard = tsbState.currentCard;
  if (!prevCard) return;

  // Accumulate grants from the card just reviewed into live tag state
  const newTags = (prevCard.grants || []).filter(t => !tsbState.tagState.includes(t));
  tsbState.tagState = [...tsbState.tagState, ...newTags];

  // Terminal card or end of chain
  if (tsbIsTerminal(prevCard) || tsbState.currentStage >= tsbMaxStage()) {
    tsbState.view = 'terminal';
    tsbRender();
    return;
  }

  const nextStage = tsbState.currentStage + 1;
  const card = tsbPickCard(nextStage);
  if (!card) {
    toast(`No eligible curated cards for Stage ${nextStage} with current tag state.`, '#dc2626');
    tsbState.view = 'terminal';
    tsbRender();
    return;
  }

  tsbState.currentStage = nextStage;
  tsbState.currentCard  = card;
  tsbState.path.push({ stage: nextStage, card });
  tsbRender();
}

function tsbReset() {
  tsbState.view          = 'setup';
  tsbState.tagState      = [];
  tsbState.currentStage  = 1;
  tsbState.currentCard   = null;
  tsbState.path          = [];
  tsbState.showPath      = false;
  tsbState.sessionId     = null;
  // Keep archetype + loaded cards + seed so user can reroll or re-start immediately
  tsbState.prngCallCount = 0;
  if (typeof tb9Init === 'function') tb9Init();
  tsbRender();
}

function tsbRunAgain() {
  // Same seed, fresh run — reproduces the same path if tags stay clean
  tsbStart();
}

function tsbTogglePath() {
  tsbState.showPath = !tsbState.showPath;
  tsbRender();
}

// ── Helpers ───────────────────────────────────────────────────────────────

function tsbSubOrg(text) {
  const name = (currentOrg && currentOrg.name) ? currentOrg.name : 'your organization';
  return (text || '').replace(/\{\{org_name\}\}/g, name);
}

function tsbCritBadge(crit) {
  const cols = { Critical: '#dc2626', High: '#d97706', Medium: '#2563eb', Low: '#16a34a' };
  const col = cols[crit] || '#6b7280';
  return `<span class="badge" style="background:${col};color:#fff;font-size:11px">${crit || '—'}</span>`;
}

function tsbNistBadge(idx) {
  const label = TSB_NIST_LABELS[idx] || '?';
  return `<span class="badge" style="background:var(--navy2);color:#fff;font-size:11px">NIST ${idx}: ${label}</span>`;
}

function tsbSeedHex(seed) {
  return '0x' + (seed >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

// ── Render router ─────────────────────────────────────────────────────────

function renderTTStoryboard() {
  if (tsbState.view === 'running')  return _tsbRenderRunning();
  if (tsbState.view === 'terminal') return _tsbRenderTerminal();
  return _tsbRenderSetup();
}

function tsbRender() {
  const el = document.getElementById('mainContent');
  if (el) el.innerHTML = renderTTStoryboard();
}

// ── Setup view ────────────────────────────────────────────────────────────

function _tsbRenderSetup() {
  const archButtons = Object.entries(TSB_ARCHETYPES).map(([id, a]) => `
    <button class="btn ${tsbState.archetype === id ? 'btn-primary' : 'btn-outline'} btn-sm"
      onclick="tsbSetArchetype('${id}')">
      ${a.icon} ${a.label}
    </button>`).join('');

  const noArch = `
    <div class="card" style="max-width:700px;margin:2rem auto">
      <div style="font-size:20px;font-weight:700;color:var(--navy);margin-bottom:0.5rem">🎲 Storyboard Exercise</div>
      <p style="color:var(--muted);margin-bottom:1.5rem">Pick an attack archetype to run a branching inject chain. Each run takes a semi-random path through the kill chain, governed by a seeded RNG and live tag state.</p>
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem">${archButtons}</div>
    </div>`;

  if (!tsbState.archetype) return noArch;

  const arch = tsbState.archetype;
  const meta = TSB_ARCHETYPES[arch];

  if (tsbState.loading) return `
    <div class="card" style="max-width:700px;margin:2rem auto">
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.25rem">${archButtons}</div>
      <p style="color:var(--muted)">Loading cards…</p>
    </div>`;

  if (tsbState.loadError) return `
    <div class="card" style="max-width:700px;margin:2rem auto">
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.25rem">${archButtons}</div>
      <p style="color:#dc2626">${tsbState.loadError}</p>
    </div>`;

  const cardCount = tsbState.allCards.length;
  const maxStage  = tsbMaxStage();

  const noCuratedWarning = cardCount === 0 ? `
    <div style="background:rgba(217,119,6,0.08);border:1px solid #d97706;border-radius:8px;padding:0.875rem 1rem;margin-bottom:1rem;font-size:13px;color:#92400e">
      ⚠ No curated cards for this archetype. Open <strong>Inject Card Curator</strong> under Platform Admin to review and publish cards before running a session.
    </div>` : '';

  // Preview path table
  const preview = tsbState.previewPath;
  const previewRows = preview.length
    ? preview.map(({ stage, card }, i) => `
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:6px 10px;font-size:12px;color:var(--muted);white-space:nowrap">Stage ${stage}</td>
        <td style="padding:6px 10px;font-size:12px;font-weight:700;color:var(--navy);white-space:nowrap;font-family:monospace">${card.id}</td>
        <td style="padding:6px 10px;font-size:13px;color:var(--text)">${card.title}</td>
        <td style="padding:6px 10px">${tsbCritBadge(card.correct_criticality)}</td>
        <td style="padding:6px 10px">${i === preview.length - 1 && tsbIsTerminal(card) ? '<span style="font-size:11px;color:#dc2626;font-weight:600">⛔ terminal</span>' : ''}</td>
      </tr>`).join('')
    : `<tr><td colspan="5" style="padding:10px;color:var(--muted);font-size:13px">No eligible path — check that Stage 1 cards are curated.</td></tr>`;

  const previewSection = cardCount > 0 ? `
    <div class="card" style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem">
        <div>
          <span style="font-weight:600;color:var(--navy);font-size:15px">Predicted path</span>
          <span style="font-size:12px;color:var(--muted);margin-left:0.75rem">seed ${tsbSeedHex(tsbState.seed)}</span>
        </div>
        <button class="btn btn-outline btn-sm" onclick="tsbReroll()">🎲 Reroll</button>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="border-bottom:2px solid var(--border)">
          <th style="text-align:left;font-size:11px;color:var(--muted);padding:4px 10px;text-transform:uppercase">Stage</th>
          <th style="text-align:left;font-size:11px;color:var(--muted);padding:4px 10px;text-transform:uppercase">Card</th>
          <th style="text-align:left;font-size:11px;color:var(--muted);padding:4px 10px;text-transform:uppercase">Title</th>
          <th style="text-align:left;font-size:11px;color:var(--muted);padding:4px 10px;text-transform:uppercase">Severity</th>
          <th></th>
        </tr></thead>
        <tbody>${previewRows}</tbody>
      </table>
    </div>` : '';

  return `
    <div style="max-width:740px;margin:2rem auto">
      <div class="card" style="margin-bottom:1rem">
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.25rem">${archButtons}</div>
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap">
          <span style="font-size:18px">${meta.icon}</span>
          <span style="font-size:17px;font-weight:700;color:var(--navy)">${meta.label}</span>
          <span class="badge b-navy">${cardCount} curated card${cardCount !== 1 ? 's' : ''}</span>
          <span class="badge" style="background:var(--cyan2);color:var(--navy);font-size:12px">${maxStage} stages</span>
        </div>
      </div>

      ${noCuratedWarning}
      ${previewSection}

      <button class="btn btn-primary" onclick="tsbStart()" ${cardCount === 0 || preview.length === 0 ? 'disabled' : ''}
        style="font-size:15px;padding:0.6rem 1.5rem">
        ▶ Start exercise
      </button>
    </div>`;
}

// ── Running view ──────────────────────────────────────────────────────────

function _tsbRenderRunning() {
  // TB9 card hand round — takes over the running view while active
  if (typeof tb9State !== 'undefined' && tb9State.mode !== null) return renderTB9Round();

  const card = tsbState.currentCard;
  if (!card) return '<p style="padding:2rem">No card loaded.</p>';

  const arch       = tsbState.archetype;
  const meta       = TSB_ARCHETYPES[arch] || {};
  const maxSt      = tsbMaxStage();
  const isTerminal = tsbIsTerminal(card);

  // Role prompts
  const rolePrompts = (() => {
    try {
      const rp = typeof card.role_prompts === 'string'
        ? JSON.parse(card.role_prompts)
        : (card.role_prompts || {});
      return Object.entries(TSB_ROLE_LABELS).map(([id, label]) => {
        const prompt = rp[id];
        if (!prompt) return '';
        const col = TSB_ROLE_COLORS[id];
        return `<div style="border-left:3px solid ${col};padding:0.5rem 0.75rem;background:rgba(0,0,0,0.02);border-radius:0 4px 4px 0;margin-bottom:0.5rem">
          <div style="font-size:11px;font-weight:700;color:${col};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px">${label}</div>
          <div style="font-size:13px;color:var(--text);line-height:1.55">${prompt}</div>
        </div>`;
      }).join('');
    } catch { return ''; }
  })();

  // Tag state display
  const tagHtml = tsbState.tagState.length
    ? tsbState.tagState.map(t => `<span class="badge" style="background:rgba(7,180,217,0.12);color:var(--navy);font-size:11px;font-weight:600">${t}</span>`).join(' ')
    : `<span style="font-size:12px;color:var(--muted)">none yet</span>`;

  const pendingGrants = isTerminal ? [] : (card.grants || []).filter(t => !tsbState.tagState.includes(t));
  const grantsHtml = isTerminal
    ? `<span style="font-size:12px;color:#dc2626;font-weight:600">⛔ Terminal — no grants</span>`
    : pendingGrants.length
      ? pendingGrants.map(t => `<span class="badge" style="background:rgba(7,180,217,0.22);color:var(--navy);font-size:11px">${t}</span>`).join(' ')
      : `<span style="font-size:12px;color:var(--muted)">none</span>`;

  // Path table
  const pathRows = tsbState.path.map(({ stage, card: c }, i) => {
    const active = i === tsbState.path.length - 1;
    return `<tr style="background:${active ? 'rgba(7,180,217,0.07)' : ''}">
      <td style="padding:5px 10px;font-size:12px;color:var(--muted)">Stage ${stage}</td>
      <td style="padding:5px 10px;font-size:12px;font-weight:700;color:var(--navy);font-family:monospace">${c.id}</td>
      <td style="padding:5px 10px;font-size:12px;color:var(--text)">${c.title}</td>
    </tr>`;
  }).join('');

  return `
    <div style="max-width:760px;margin:2rem auto">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:0.625rem;margin-bottom:1rem;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" onclick="tsbReset()">← Setup</button>
        <span style="font-size:13px;color:var(--muted)">${meta.icon || ''} ${meta.label || arch}</span>
        <span class="badge b-navy">Stage ${tsbState.currentStage} / ${maxSt}</span>
        ${tsbNistBadge(card.nist_phase_idx)}
        ${tsbCritBadge(card.correct_criticality)}
        <span style="font-size:11px;color:var(--muted);font-family:monospace;margin-left:auto">${card.id} · seed ${tsbSeedHex(tsbState.seed)}</span>
      </div>

      <!-- Inject card -->
      <div class="card" style="margin-bottom:0.875rem;border-left:4px solid ${isTerminal ? '#dc2626' : 'var(--cyan)'}">
        <div style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:0.75rem">${card.title}</div>
        <p style="font-size:14px;color:var(--text);line-height:1.7;margin:0 0 1.25rem">${tsbSubOrg(card.body || '')}</p>
        <div style="font-weight:600;color:var(--navy);font-size:13px;margin-bottom:0.5rem">Role prompts</div>
        ${rolePrompts || '<p style="color:var(--muted);font-size:13px;margin:0">No role prompts on this card.</p>'}
      </div>

      <!-- Tag state + grants -->
      <div class="card" style="margin-bottom:0.875rem;padding:0.875rem 1rem">
        <div style="display:flex;gap:2rem;flex-wrap:wrap">
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px">Current tags</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">${tagHtml}</div>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px">Grants on advance</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">${grantsHtml}</div>
          </div>
          ${card.mitre_tactic ? `<div>
            <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px">ATT&CK</div>
            <span style="font-size:12px;color:var(--text)">${card.mitre_tactic}${card.mitre_technique ? ' · ' + card.mitre_technique : ''}</span>
          </div>` : ''}
        </div>
      </div>

      <!-- Path so far -->
      <div class="card" style="margin-bottom:0.875rem;padding:0.875rem 1rem">
        <div style="display:flex;align-items:center;justify-content:space-between;cursor:pointer" onclick="tsbTogglePath()">
          <span style="font-weight:600;color:var(--navy);font-size:13px">Path so far (${tsbState.path.length} card${tsbState.path.length !== 1 ? 's' : ''})</span>
          <span style="color:var(--muted);font-size:12px">${tsbState.showPath ? '▲ hide' : '▼ show'}</span>
        </div>
        ${tsbState.showPath ? `<table style="width:100%;margin-top:0.625rem;border-collapse:collapse">
          <thead><tr>
            <th style="text-align:left;font-size:11px;color:var(--muted);padding:4px 10px;text-transform:uppercase">Stage</th>
            <th style="text-align:left;font-size:11px;color:var(--muted);padding:4px 10px;text-transform:uppercase">ID</th>
            <th style="text-align:left;font-size:11px;color:var(--muted);padding:4px 10px;text-transform:uppercase">Card</th>
          </tr></thead>
          <tbody>${pathRows}</tbody>
        </table>` : ''}
      </div>

      <!-- TB9 Deal Hands — replaces direct inject advance; inject advances after all roles submit -->
      <div style="display:flex;gap:0.75rem;align-items:center">
        <button class="btn btn-primary" onclick="tb9StartRound()" style="font-size:14px;padding:0.6rem 1.5rem">
          🃏 Deal response hands
        </button>
      </div>
    </div>`;
}

// ── Terminal view ─────────────────────────────────────────────────────────

function _tsbRenderTerminal() {
  const arch = tsbState.archetype;
  const meta = TSB_ARCHETYPES[arch] || {};

  const pathRows = tsbState.path.map(({ stage, card: c }) => `
    <tr style="border-bottom:1px solid var(--border)">
      <td style="padding:7px 10px;font-size:12px;color:var(--muted);white-space:nowrap">Stage ${stage}</td>
      <td style="padding:7px 10px;font-size:12px;font-weight:700;color:var(--navy);white-space:nowrap;font-family:monospace">${c.id}</td>
      <td style="padding:7px 10px;font-size:13px;color:var(--text)">${c.title}</td>
      <td style="padding:7px 10px">${tsbCritBadge(c.correct_criticality)}</td>
      <td style="padding:7px 10px">${tsbNistBadge(c.nist_phase_idx)}</td>
    </tr>`).join('');

  const finalTags = tsbState.tagState.map(t =>
    `<span class="badge" style="background:rgba(7,180,217,0.12);color:var(--navy);font-size:11px;font-weight:600">${t}</span>`
  ).join(' ');

  return `
    <div style="max-width:760px;margin:2rem auto">
      <div class="card" style="margin-bottom:1rem;border-left:4px solid #dc2626">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.375rem;flex-wrap:wrap">
          <span style="font-size:18px">⛔</span>
          <span style="font-size:17px;font-weight:700;color:var(--navy)">Exercise complete</span>
          <span class="badge b-navy">${meta.icon || ''} ${meta.label || arch}</span>
          <span style="font-size:12px;color:var(--muted);font-family:monospace;margin-left:auto">seed ${tsbSeedHex(tsbState.seed)}</span>
        </div>
        <p style="color:var(--muted);font-size:13px;margin:0">${tsbState.path.length}-card chain · ${tsbState.tagState.length} tag${tsbState.tagState.length !== 1 ? 's' : ''} accumulated</p>
      </div>

      <div class="card" style="margin-bottom:1rem">
        <div style="font-weight:600;color:var(--navy);margin-bottom:0.75rem">Chain replay</div>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="border-bottom:2px solid var(--border)">
            <th style="text-align:left;font-size:11px;color:var(--muted);padding:6px 10px;text-transform:uppercase">Stage</th>
            <th style="text-align:left;font-size:11px;color:var(--muted);padding:6px 10px;text-transform:uppercase">ID</th>
            <th style="text-align:left;font-size:11px;color:var(--muted);padding:6px 10px;text-transform:uppercase">Card</th>
            <th style="text-align:left;font-size:11px;color:var(--muted);padding:6px 10px;text-transform:uppercase">Severity</th>
            <th style="text-align:left;font-size:11px;color:var(--muted);padding:6px 10px;text-transform:uppercase">NIST</th>
          </tr></thead>
          <tbody>${pathRows}</tbody>
        </table>
      </div>

      <div class="card" style="margin-bottom:1.25rem;padding:0.875rem 1rem">
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px">Final tag state</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${finalTags || '<span style="color:var(--muted);font-size:13px">none</span>'}
        </div>
      </div>

      <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="tsbRunAgain()" style="font-size:14px">🔁 Run again (same seed)</button>
        <button class="btn btn-outline" onclick="tsbReset()" style="font-size:14px">← Setup</button>
      </div>
    </div>`;
}

// ── Window exports ────────────────────────────────────────────────────────
window.renderTTStoryboard = renderTTStoryboard;
window.tsbSetArchetype    = tsbSetArchetype;
window.tsbReroll          = tsbReroll;
window.tsbStart           = tsbStart;
window.tsbAdvance         = tsbAdvance;
window.tsbReset           = tsbReset;
window.tsbRunAgain        = tsbRunAgain;
window.tsbTogglePath      = tsbTogglePath;
