// ============================================================
// TB9 — Card Hand Dealing and Submission
// Extends the TB Storyboard running view with role-by-role
// card hand rounds (IC → TL → CL → LC → ES).
// Single shared screen — war-room collaboration model.
// No fog of war by design.
// ============================================================

const TB9_NIST_PHASES = {
  1: 'detect_analyze', 2: 'contain', 3: 'eradicate',
  4: 'recover',        5: 'post_incident',
};

const TB9_PHASE_LABELS = {
  detect_analyze: 'Detect / Analyze', contain:       'Contain',
  eradicate:      'Eradicate',        recover:       'Recover',
  post_incident:  'Post-Incident',
};

const TB9_ROLE_ORDER = ['ic', 'tl', 'cl', 'lc', 'es'];

const TB9_HOLD_CARD = {
  id:   'HOLD',
  title: 'Hold — No Action',
  body:  'Deliberately take no action at this stage. Choose this card if your role has nothing meaningful to add right now. Restraint is a valid and scorable play.',
};

// Compact score + play-type breakdown for AAR table cells (used by _tsbRenderAAR in tt_storyboard.js)
function _tb9FormatBreakdown(score, graded) {
  const nonHold = (graded || []).filter(g => g.id !== 'HOLD');
  if (!nonHold.length) return `<span style="color:var(--muted);font-size:11px">Hold</span>`;
  const correct  = nonHold.filter(g => g.rating === 'correct' && g.weight === 1).length;
  const critical = nonHold.filter(g => g.rating === 'correct' && g.weight === 2).length;
  const partial  = nonHold.filter(g => g.rating === 'defensible_partial').length;
  const wrong    = nonHold.filter(g => g.rating === 'inappropriate').length;
  const parts = [];
  if (correct)  parts.push(`${correct}✓`);
  if (critical) parts.push(`${critical}★`);
  if (partial)  parts.push(`${partial}~`);
  if (wrong)    parts.push(`${wrong}✗`);
  const scoreColor = score > 0 ? '#15803d' : score < 0 ? '#dc2626' : 'var(--muted)';
  const scoreStr   = score > 0 ? `+${score}` : String(score);
  return `<span style="color:${scoreColor};font-weight:700;font-size:12px">${scoreStr}</span>` +
    (parts.length ? `<span style="color:var(--muted);font-size:10px;margin-left:3px">${parts.join(' ')}</span>` : '');
}

let tb9State = {
  mode:        null,    // null | 'loading' | 'dealing' | 'round_complete'
  roleIdx:     0,       // 0–4 within TB9_ROLE_ORDER
  hands:       {},      // roleId → [card, ...]
  selections:  {},      // roleId → [card_id, ...]
  comments:    {},      // roleId → string
  submitted:   {},      // roleId → bool
  holdPrompt:  false,   // show "did you mean to hold?" confirmation
  saving:      false,
  scores:         {},   // roleId → { score, graded } — populated by tb9ScoreRound
  insightAwarded: {},   // roleId → bool — resets each inject round
};

function tb9Init() {
  tb9State = {
    mode: null, roleIdx: 0, hands: {},
    selections: {}, comments: {}, submitted: {},
    holdPrompt: false, saving: false,
    scores: {}, insightAwarded: {},
  };
}

// ── Hand loading ──────────────────────────────────────────────

async function tb9StartRound() {
  const injectCard = tsbState.currentCard;
  if (!injectCard) return;

  const nistPhaseKey = TB9_NIST_PHASES[injectCard.nist_phase_idx] || 'detect_analyze';
  const archetype    = tsbState.archetype;

  tb9State.mode       = 'loading';
  tb9State.roleIdx    = 0;
  tb9State.selections = {};
  tb9State.comments   = {};
  tb9State.submitted  = {};
  tb9State.holdPrompt = false;
  tsbRender();

  try {
    const cards = await sbFetch(
      `tt_response_cards?nist_phase=eq.${nistPhaseKey}&curated=eq.true` +
      `&select=id,role_id,title,body,appropriateness&order=role_id.asc,id.asc`
    );
    const all = Array.isArray(cards) ? cards : [];

    const hands = {};
    for (const roleId of TB9_ROLE_ORDER) {
      const roleCards = all.filter(c =>
        c.role_id === roleId &&
        c.appropriateness?.[archetype]?.rating !== 'not-applicable'
      );
      hands[roleId] = [TB9_HOLD_CARD, ...roleCards];
    }

    tb9State.hands = hands;
    tb9State.mode  = 'dealing';
  } catch (e) {
    toast('Could not load response cards: ' + e.message, '#dc2626');
    tb9State.mode = null;
  }

  tsbRender();
}

// ── Selection handlers ────────────────────────────────────────

function tb9ToggleCard(cardId) {
  const roleId = TB9_ROLE_ORDER[tb9State.roleIdx];
  const sel    = tb9State.selections[roleId] || [];
  const idx    = sel.indexOf(cardId);
  tb9State.selections[roleId] = idx === -1 ? [...sel, cardId] : sel.filter(id => id !== cardId);
  tb9State.holdPrompt = false;
  tsbRender();
}

function tb9SetComment(val) {
  const roleId = TB9_ROLE_ORDER[tb9State.roleIdx];
  tb9State.comments[roleId] = val;
}

// ── Submit ────────────────────────────────────────────────────

function tb9TrySubmit() {
  const roleId = TB9_ROLE_ORDER[tb9State.roleIdx];
  const sel    = tb9State.selections[roleId] || [];
  if (!sel.length) {
    tb9State.holdPrompt = true;
    tsbRender();
    return;
  }
  tb9DoSubmit();
}

function tb9ConfirmHold() {
  const roleId = TB9_ROLE_ORDER[tb9State.roleIdx];
  tb9State.selections[roleId] = ['HOLD'];
  tb9State.holdPrompt = false;
  tb9DoSubmit();
}

function tb9CancelHold() {
  tb9State.holdPrompt = false;
  tsbRender();
}

async function tb9DoSubmit() {
  const roleId  = TB9_ROLE_ORDER[tb9State.roleIdx];
  const cardIds = tb9State.selections[roleId] || [];
  const comment = (tb9State.comments[roleId] || '').trim() || null;

  tb9State.saving = true;
  tsbRender();

  if (tsbState.sessionId) {
    try {
      await sb.tt.upsertCardPlay({
        session_id:   tsbState.sessionId,
        inject_index: tsbState.currentStage,
        role_id:      roleId,
        player_name:  TSB_ROLE_LABELS[roleId],
        card_ids:     cardIds,
        comment:      comment,
      });
    } catch (e) {
      toast('Save failed: ' + (e.message || e) + ' — play not persisted', '#d97706');
    }
  }

  tb9State.submitted[roleId] = true;
  tb9State.saving = false;

  if (tb9State.roleIdx < TB9_ROLE_ORDER.length - 1) {
    tb9State.roleIdx++;
  } else {
    tb9ScoreRound();
    tb9State.mode = 'round_complete';
  }

  tsbRender();
}

// ── Back ─────────────────────────────────────────────────────

function tb9StepBack() {
  if (tb9State.roleIdx === 0) return;
  tb9State.roleIdx--;
  const prevRole = TB9_ROLE_ORDER[tb9State.roleIdx];
  tb9State.submitted[prevRole] = false;
  tb9State.holdPrompt = false;
  tsbRender();
}

// ── TB10 scoring ──────────────────────────────────────────────

function tb9ScoreRound() {
  const archetype    = tsbState.archetype;
  const stage        = tsbState.currentStage;
  const cardId       = tsbState.currentCard?.id;
  const nistPhaseKey = TB9_NIST_PHASES[tsbState.currentCard?.nist_phase_idx] || 'detect_analyze';

  const roleScores = {};
  for (const roleId of TB9_ROLE_ORDER) {
    const hand    = tb9State.hands[roleId] || [];
    const cardIds = tb9State.selections[roleId] || [];
    const graded  = [];
    let score     = 0;

    for (const cid of cardIds) {
      if (cid === 'HOLD') {
        graded.push({ id: 'HOLD', title: 'Hold', rating: 'hold', weight: 0, pts: 0 });
        continue;
      }
      const card = hand.find(c => c.id === cid);
      if (!card) continue;
      const appr  = card.appropriateness?.[archetype];
      if (!appr) continue;
      const rating = appr.rating;
      const weight = appr.weight || 1;
      let pts = 0;
      if (rating === 'correct')       pts =  weight;
      if (rating === 'inappropriate') pts = -weight;
      // defensible_partial → 0 (neutral; precision over volume by design)
      graded.push({ id: cid, title: card.title || cid, rating, weight, pts });
      score += pts;
    }

    roleScores[roleId] = { score, graded };
  }

  // Accumulate into session-level AAR
  if (tsbState.aarData) {
    tsbState.aarData.perInject.push({ stage, cardId, nistPhaseKey, roleScores });
    for (const roleId of TB9_ROLE_ORDER) {
      tsbState.aarData.roleTotals[roleId] =
        (tsbState.aarData.roleTotals[roleId] || 0) + (roleScores[roleId]?.score || 0);
    }
  }

  tb9State.scores         = roleScores;
  tb9State.insightAwarded = {};

  // Persist grade map to DB async (non-blocking; TB10 record-keeping)
  if (tsbState.sessionId) {
    for (const roleId of TB9_ROLE_ORDER) {
      const gradesMap = {};
      for (const g of (roleScores[roleId]?.graded || [])) {
        if (g.id !== 'HOLD') gradesMap[g.id] = g.rating;
      }
      if (Object.keys(gradesMap).length) {
        sb.tt.gradeCardPlay(tsbState.sessionId, stage, roleId, gradesMap)
          .catch(e => console.warn('TB10: grade write failed:', e.message || e));
      }
    }
  }
}

function tb9AwardInsight(roleId) {
  if (tb9State.insightAwarded[roleId]) return;
  tb9State.insightAwarded[roleId] = true;
  if (tsbState.aarData) {
    tsbState.aarData.insightTotals[roleId] =
      (tsbState.aarData.insightTotals[roleId] || 0) + 1;
  }
  tsbRender();
}

// ── Next inject / end ─────────────────────────────────────────

function tb9NextInject() {
  tb9State.mode       = null;
  tb9State.roleIdx    = 0;
  tb9State.selections = {};
  tb9State.comments   = {};
  tb9State.submitted  = {};
  tb9State.holdPrompt = false;
  tsbAdvance();
}

// ── Render ────────────────────────────────────────────────────

function renderTB9Round() {
  if (tb9State.mode === 'loading') {
    return `<div style="max-width:760px;margin:2rem auto;text-align:center;padding:3rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,.15);border-top-color:var(--navy);width:26px;height:26px;margin:0 auto 1rem"></div>
      <div style="font-size:13px">Dealing response card hands…</div>
    </div>`;
  }
  if (tb9State.mode === 'round_complete') return _tb9RenderComplete();
  return _tb9RenderDealing();
}

function _tb9RenderDealing() {
  const roleId     = TB9_ROLE_ORDER[tb9State.roleIdx];
  const roleLabel  = TSB_ROLE_LABELS[roleId];
  const roleColor  = TSB_ROLE_COLORS[roleId];
  const hand       = tb9State.hands[roleId] || [];
  const sel        = tb9State.selections[roleId] || [];
  const comment    = tb9State.comments[roleId] || '';
  const injectCard = tsbState.currentCard;
  const archetype  = tsbState.archetype;
  const archMeta   = TSB_ARCHETYPES[archetype] || {};
  const nistKey    = TB9_NIST_PHASES[injectCard?.nist_phase_idx] || 'detect_analyze';
  const nistLabel  = TB9_PHASE_LABELS[nistKey];
  const totalStages = tsbMaxStage();
  const isTerminal = typeof tsbIsTerminal === 'function' && tsbIsTerminal(injectCard);

  // Role stepper
  const stepper = TB9_ROLE_ORDER.map((rid, i) => {
    const isCurrent = i === tb9State.roleIdx;
    const isDone    = !!tb9State.submitted[rid];
    const rc = TSB_ROLE_COLORS[rid];
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1">
      <div style="width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;
        border:2px solid ${isCurrent ? rc : isDone ? '#16a34a' : 'var(--border)'};
        background:${isCurrent ? rc : isDone ? '#dcfce7' : 'var(--bg)'};
        color:${isCurrent ? '#fff' : isDone ? '#15803d' : 'var(--muted)'}"
      >${isDone ? '✓' : rid.toUpperCase()}</div>
      <div style="font-size:9px;font-weight:${isCurrent ? '700' : '400'};color:${isCurrent ? rc : 'var(--muted)'};text-align:center;line-height:1.2">
        ${TSB_ROLE_LABELS[rid].split(' ')[0]}
      </div>
    </div>`;
  });

  const stepperHtml = stepper.reduce((acc, s, i) =>
    i === 0 ? s : acc + `<div style="flex:0 0 16px;height:2px;background:var(--border);margin-top:17px"></div>` + s
  , '');

  // Card tiles
  const cardTiles = hand.map(c => {
    const isSelected = sel.includes(c.id);
    const isHold     = c.id === 'HOLD';
    return `<div onclick="tb9ToggleCard('${c.id}')"
      style="padding:12px 14px;border-radius:10px;cursor:pointer;transition:.12s;user-select:none;position:relative;
        border:2px solid ${isSelected ? 'var(--navy)' : isHold ? 'var(--border)' : 'var(--border)'};
        border-style:${isHold ? 'dashed' : 'solid'};
        background:${isSelected ? 'rgba(21,33,104,.06)' : '#fff'};
        box-shadow:${isSelected ? '0 0 0 2px rgba(21,33,104,.1)' : 'none'}"
      onmouseenter="this.style.borderColor='${isSelected ? 'var(--navy)' : 'var(--cyan)'}'"
      onmouseleave="this.style.borderColor='${isSelected ? 'var(--navy)' : 'var(--border)'}'">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px">
        <div style="font-size:12px;font-weight:700;color:${isSelected ? 'var(--navy)' : 'var(--text)'};line-height:1.3">${c.title}</div>
        <div style="flex-shrink:0;width:18px;height:18px;border-radius:50%;
          border:${isSelected ? 'none' : '1.5px solid var(--border)'};
          background:${isSelected ? 'var(--navy)' : 'transparent'};
          color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">
          ${isSelected ? '✓' : ''}
        </div>
      </div>
      <div style="font-size:11px;color:var(--muted);line-height:1.5">${c.body}</div>
    </div>`;
  }).join('');

  // Hold prompt
  const holdPromptHtml = tb9State.holdPrompt ? `
    <div style="padding:12px 16px;background:#fef3c7;border:1.5px solid #fcd34d;border-radius:8px;margin-bottom:12px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <span style="font-size:13px;font-weight:600;color:#92400e">⚠ No cards selected — submit Hold (no action)?</span>
      <div style="display:flex;gap:8px;margin-left:auto">
        <button onclick="tb9CancelHold()" style="padding:5px 14px;border:1.5px solid var(--border);border-radius:6px;cursor:pointer;font-family:inherit;font-size:12px;background:#fff;color:var(--text)">Cancel</button>
        <button onclick="tb9ConfirmHold()" style="padding:5px 14px;background:#92400e;border:none;border-radius:6px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;color:#fff">Yes — Submit Hold</button>
      </div>
    </div>` : '';

  const nextRoleLabel = tb9State.roleIdx < TB9_ROLE_ORDER.length - 1
    ? 'Next: ' + TSB_ROLE_LABELS[TB9_ROLE_ORDER[tb9State.roleIdx + 1]].split(' ')[0]
    : 'Finish round';

  return `
<div style="max-width:760px;margin:2rem auto">

  <!-- Compact running header -->
  <div style="display:flex;align-items:center;gap:0.625rem;margin-bottom:1rem;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" onclick="tsbReset()">← Setup</button>
    <span style="font-size:13px;color:var(--muted)">${archMeta.icon || ''} ${archMeta.label || archetype}</span>
    <span class="badge b-navy">Stage ${tsbState.currentStage} / ${totalStages}</span>
    <span class="badge" style="background:var(--navy2);color:#fff;font-size:11px">NIST: ${nistLabel}</span>
    ${isTerminal ? `<span class="badge" style="background:#dc2626;color:#fff;font-size:11px">⛔ Terminal</span>` : ''}
    <span style="font-size:11px;color:var(--muted);font-family:monospace;margin-left:auto">${injectCard?.id || ''}</span>
  </div>

  <!-- Inject context (slim) — role prompts omitted so they don't tip off card choices -->
  <div class="card" style="margin-bottom:0.875rem;border-left:3px solid var(--cyan);padding:12px 16px">
    <div style="font-size:13px;font-weight:700;color:var(--navy)">${injectCard?.title || ''}</div>
  </div>

  <!-- Progress: role stepper -->
  <div class="card" style="margin-bottom:0.875rem;padding:14px 18px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
      <span style="font-size:14px;font-weight:700;color:${roleColor}">${roleLabel}</span>
      <span style="font-size:12px;color:var(--muted)">
        Role ${tb9State.roleIdx + 1} of ${TB9_ROLE_ORDER.length} · Inject ${tsbState.currentStage} of ~${totalStages}
      </span>
    </div>
    <div style="display:flex;align-items:center;gap:0">${stepperHtml}</div>
  </div>

  <!-- Hand grid -->
  <div style="margin-bottom:0.875rem">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px">
      ${roleLabel}'s hand — ${hand.length} card${hand.length !== 1 ? 's' : ''} — select all that apply, then submit
    </div>
    ${hand.length > 1
      ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px">${cardTiles}</div>`
      : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px">${cardTiles}
           <div style="padding:12px 14px;border-radius:10px;border:1px dashed var(--border);background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px">
             No phase-specific cards for this role — Hold is the expected play
           </div>
         </div>`
    }
  </div>

  <!-- Comment -->
  <div style="margin-bottom:12px">
    <textarea
      placeholder="Add a comment or reasoning for this role's play (optional)…"
      oninput="tb9SetComment(this.value)"
      rows="2"
      style="width:100%;padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);resize:vertical;outline:none;box-sizing:border-box"
    >${comment.replace(/</g, '&lt;').replace(/"/g, '&quot;')}</textarea>
  </div>

  ${holdPromptHtml}

  ${!tsbState.sessionId ? `<div style="font-size:11px;color:var(--amber);margin-bottom:8px">⚠ Session not yet created — plays will not be saved until the session ID is available</div>` : ''}

  <!-- Action bar -->
  <div style="display:flex;gap:0.75rem;align-items:center">
    ${tb9State.roleIdx > 0
      ? `<button class="btn btn-outline btn-sm" onclick="tb9StepBack()" ${tb9State.saving ? 'disabled' : ''}>← Back</button>`
      : ''}
    <div style="margin-left:auto;display:flex;gap:0.75rem;align-items:center">
      ${sel.length ? `<span style="font-size:12px;color:var(--muted)">${sel.length} card${sel.length !== 1 ? 's' : ''} selected</span>` : ''}
      <button class="btn btn-primary" onclick="tb9TrySubmit()"
        ${tb9State.saving ? 'disabled' : ''}
        style="font-size:14px;padding:0.5rem 1.5rem">
        ${tb9State.saving ? 'Saving…' : 'Submit → ' + nextRoleLabel}
      </button>
    </div>
  </div>

</div>`;
}

function _tb9RenderComplete() {
  const injectCard = tsbState.currentCard;
  const archetype  = tsbState.archetype;
  const archMeta   = TSB_ARCHETYPES[archetype] || {};
  const isTerminal = typeof tsbIsTerminal === 'function' && tsbIsTerminal(injectCard);

  const summaryRows = TB9_ROLE_ORDER.map(roleId => {
    const sel       = tb9State.selections[roleId] || [];
    const comment   = (tb9State.comments[roleId] || '').trim();
    const rc        = TSB_ROLE_COLORS[roleId];
    const hasHold   = sel.includes('HOLD');
    const realCards = sel.filter(id => id !== 'HOLD');
    const label     = sel.length === 0 ? '—'
      : hasHold && realCards.length === 0 ? 'Hold'
      : hasHold ? `Hold + ${realCards.length} card${realCards.length !== 1 ? 's' : ''}`
      : `${sel.length} card${sel.length !== 1 ? 's' : ''}`;
    const injectScore = tb9State.scores[roleId]?.score;
    const scoreHtml   = injectScore !== undefined
      ? (typeof _tsbScorePill === 'function' ? _tsbScorePill(injectScore) : String(injectScore))
      : '<span style="color:var(--muted)">—</span>';
    return `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:8px 12px;white-space:nowrap">
        <span style="font-size:11px;font-weight:700;color:${rc};background:${rc}18;padding:2px 8px;border-radius:10px">${roleId.toUpperCase()}</span>
      </td>
      <td style="padding:8px 12px;font-size:13px;color:var(--text);font-weight:500">${TSB_ROLE_LABELS[roleId]}</td>
      <td style="padding:8px 12px;font-size:12px;color:var(--text)">${label}</td>
      <td style="padding:8px 12px;font-size:12px;color:var(--muted);max-width:200px">${comment || '—'}</td>
      <td style="padding:8px 12px;text-align:center">${scoreHtml}</td>
    </tr>`;
  }).join('');

  return `
<div style="max-width:760px;margin:2rem auto">

  <!-- Compact header -->
  <div style="display:flex;align-items:center;gap:0.625rem;margin-bottom:1rem;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" onclick="tsbReset()">← Setup</button>
    <span style="font-size:13px;color:var(--muted)">${archMeta.icon || ''} ${archMeta.label || archetype}</span>
    <span class="badge b-navy">Stage ${tsbState.currentStage} / ${tsbMaxStage()}</span>
    ${isTerminal ? `<span class="badge" style="background:#dc2626;color:#fff;font-size:11px">⛔ Terminal</span>` : ''}
    <span style="font-size:11px;color:var(--muted);font-family:monospace;margin-left:auto">${injectCard?.id || ''}</span>
  </div>

  <!-- Round complete banner -->
  <div class="card" style="margin-bottom:0.875rem;border-left:4px solid #16a34a;padding:14px 18px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
      <span style="font-size:16px">✅</span>
      <span style="font-size:15px;font-weight:700;color:var(--navy)">All roles submitted — Inject ${tsbState.currentStage} complete</span>
    </div>
    <div style="font-size:12px;color:var(--muted)">
      ${tsbState.sessionId ? 'Plays scored and persisted to Supabase.' : '⚠ No session — plays were not persisted.'}
    </div>
  </div>

  <!-- Summary table -->
  <div class="card" style="margin-bottom:1rem;padding:0;overflow:hidden">
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="border-bottom:2px solid var(--border);background:var(--bg)">
          <th style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);text-align:left;width:52px">Role</th>
          <th style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);text-align:left">Name</th>
          <th style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);text-align:left">Played</th>
          <th style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);text-align:left">Comment</th>
          <th style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);text-align:center">Score</th>
        </tr>
      </thead>
      <tbody>${summaryRows}</tbody>
    </table>
  </div>

  <!-- TB10: Insight awards — facilitator discretionary +1 per role per inject -->
  <div style="margin-bottom:0.875rem;padding:12px 16px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:8px">
      Insight +1 — award for strong commentary or reasoning (one per role)
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${TB9_ROLE_ORDER.map(r => {
        const awarded = tb9State.insightAwarded[r];
        const rc = TSB_ROLE_COLORS[r];
        return `<button onclick="tb9AwardInsight('${r}')" ${awarded ? 'disabled' : ''}
          style="padding:5px 12px;border:1.5px solid ${awarded ? '#bbf7d0' : rc};border-radius:6px;
          background:${awarded ? '#f0fdf4' : '#fff'};color:${awarded ? '#15803d' : rc};
          font-family:inherit;font-size:11px;font-weight:700;cursor:${awarded ? 'default' : 'pointer'}">
          ${r.toUpperCase()} ${awarded ? '★ Insight' : '+1 Insight'}
        </button>`;
      }).join('')}
    </div>
  </div>

  <!-- Next action -->
  <div style="display:flex;gap:0.75rem;align-items:center">
    ${isTerminal
      ? `<button class="btn btn-primary" onclick="tb9NextInject()" style="background:#dc2626;font-size:14px;padding:0.6rem 1.5rem">⛔ End — view debrief</button>`
      : `<button class="btn btn-primary" onclick="tb9NextInject()" style="font-size:14px;padding:0.6rem 1.5rem">▶ Next inject</button>`}
  </div>

</div>`;
}

// ── Window exports ────────────────────────────────────────────
window.tb9Init        = tb9Init;
window.tb9StartRound  = tb9StartRound;
window.tb9ToggleCard  = tb9ToggleCard;
window.tb9SetComment  = tb9SetComment;
window.tb9TrySubmit   = tb9TrySubmit;
window.tb9ConfirmHold = tb9ConfirmHold;
window.tb9CancelHold  = tb9CancelHold;
window.tb9StepBack       = tb9StepBack;
window.tb9ScoreRound     = tb9ScoreRound;
window.tb9AwardInsight   = tb9AwardInsight;
window.tb9NextInject     = tb9NextInject;
window.renderTB9Round    = renderTB9Round;
