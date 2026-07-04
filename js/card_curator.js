// ============================================================
// INJECT CARD CURATOR — Platform Admin only
// Browse tt_stories + tt_inject_cards by archetype/stage.
// Flip curated = true/false live to gate cards from live sessions.
// ============================================================

let ccState = {
  cards:    null,   // all tt_inject_cards rows
  stories:  null,   // all tt_stories rows
  loading:  false,
  arch:     'ransomware',
  stage:    1,
  stageView: 'cards', // 'cards' | 'stories'
};

const CC_ARCHETYPES = [
  { id: 'ransomware',       label: 'Ransomware',  stages: 6 },
  { id: 'bec',              label: 'BEC',          stages: 5 },
  { id: 'insider',          label: 'Insider',      stages: 5 },
  { id: 'vendor_compromise',label: 'Vendor',       stages: 5 },
];

const CC_STAGE_LABELS = {
  ransomware:        ['Initial Access','Execution & C2','Credential Access','Priv Esc & Lateral','Pre-Impact','Impact'],
  bec:               ['Initial Access','Reconnaissance','Impersonation','Fraud Execution','Financial Impact'],
  insider:           ['Initial Act','Recon & Data Mapping','Data Staging','Exfiltration','Impact'],
  vendor_compromise: ['Vendor Compromise','Vendor Recon','Client Pivot','Client Discovery','Impact'],
};

const CC_NIST = ['Prepare','Detect/Analyze','Contain','Eradicate','Recover','Post-Incident'];

const CC_ROLE_COLORS = {
  ic: { bg:'#eff6ff', color:'#1d4ed8', border:'#bfdbfe' },
  tl: { bg:'#f0fdf4', color:'#15803d', border:'#bbf7d0' },
  cl: { bg:'#fff7ed', color:'#c2410c', border:'#fed7aa' },
  lc: { bg:'#faf5ff', color:'#7c3aed', border:'#ddd6fe' },
  es: { bg:'#fdf2f8', color:'#be185d', border:'#fbcfe8' },
};

// ── Data loading ────────────────────────────────────────────

async function ccEnsureData() {
  if ((ccState.cards && ccState.stories) || ccState.loading) return;
  ccState.loading = true;
  try {
    const [cards, stories] = await Promise.all([
      sbFetch('tt_inject_cards?select=*&order=archetype,chain_stage,id&limit=200'),
      sbFetch('tt_stories?select=*&order=archetype,id&limit=200'),
    ]);
    ccState.cards   = Array.isArray(cards)   ? cards   : [];
    ccState.stories = Array.isArray(stories) ? stories : [];
  } catch(e) {
    ccState.cards   = [];
    ccState.stories = [];
  }
  ccState.loading = false;
  if (activeNav === 'card_curator') renderMain();
}

// ── Main render ─────────────────────────────────────────────

function renderCardCurator() {
  if (!ccState.cards) {
    ccEnsureData();
    return `<div style="text-align:center;padding:3rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,.15);border-top-color:var(--navy);width:22px;height:22px;margin:0 auto 0.75rem"></div>
      <div style="font-size:12px">Loading inject cards…</div>
    </div>`;
  }

  const totalCards   = ccState.cards.length;
  const curatedCount = ccState.cards.filter(c => c.curated).length;
  const pct          = totalCards ? Math.round(curatedCount / totalCards * 100) : 0;

  const archCards = ccState.cards.filter(c => c.archetype === ccState.arch);
  const archStories = (ccState.stories || []).filter(s => s.archetype === ccState.arch);
  const stageCards  = archCards.filter(c => c.chain_stage === ccState.stage);

  const archDef = CC_ARCHETYPES.find(a => a.id === ccState.arch);
  const stages  = archDef ? archDef.stages : 5;
  const stageLabels = CC_STAGE_LABELS[ccState.arch] || [];

  return `
<div style="padding:16px 20px;max-width:860px">

  <!-- Header bar -->
  <div class="card" style="padding:14px 18px;margin-bottom:16px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
    <div>
      <div style="font-size:15px;font-weight:700;color:var(--navy)">Inject Card Curator</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">Platform Admin · Review inject bodies, role prompts, and approve cards for live sessions</div>
    </div>
    <div style="margin-left:auto;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <div style="text-align:right">
        <div style="font-size:20px;font-weight:700;color:${pct===100?'var(--green)':'var(--navy)'}">${curatedCount}<span style="font-size:12px;font-weight:400;color:var(--muted)"> / ${totalCards}</span></div>
        <div style="font-size:10px;color:var(--muted);font-weight:600">CURATED</div>
      </div>
      <div style="width:80px;height:6px;background:#e5e7eb;border-radius:3px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${pct===100?'var(--green)':'var(--cyan)'};transition:.3s"></div>
      </div>
    </div>
  </div>

  <!-- Archetype tabs -->
  <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
    ${CC_ARCHETYPES.map(a => {
      const ac = ccState.cards.filter(c => c.archetype === a.id);
      const cur = ac.filter(c => c.curated).length;
      const active = a.id === ccState.arch;
      return `<button onclick="ccSetArch('${a.id}')" class="btn${active?' btn-primary':' btn-outline'}" style="font-size:12px;padding:6px 14px;position:relative">
        ${a.label}
        <span style="margin-left:6px;font-size:10px;opacity:.75">${cur}/${ac.length}</span>
      </button>`;
    }).join('')}
    <button onclick="ccSetView('stories')" class="btn${ccState.stageView==='stories'?' btn-cyan':' btn-outline'}" style="font-size:12px;padding:6px 14px;margin-left:auto">
      📖 Opener Stories (${archStories.length})
    </button>
  </div>

  ${ccState.stageView === 'stories' ? ccRenderStories(archStories) : ccRenderStageView(stages, stageLabels, stageCards)}

</div>`;
}

function ccRenderStories(stories) {
  if (!stories.length) return `<div class="card" style="padding:24px;text-align:center;color:var(--muted);font-size:12px">No opener stories seeded for this archetype yet.</div>`;
  return stories.map(s => `
<div class="card" style="margin-bottom:12px;overflow:hidden">
  <div style="padding:12px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)">
    <span style="font-size:10px;font-weight:700;background:var(--navy);color:#fff;padding:2px 8px;border-radius:4px;letter-spacing:.5px">${s.id}</span>
    <span style="font-size:13px;font-weight:700;flex:1">${s.title || '—'}</span>
    ${s.detection_maturity ? `<span style="font-size:10px;padding:2px 8px;border-radius:4px;background:#f5f3ff;color:#7c3aed;border:1px solid #ddd6fe">${s.detection_maturity}</span>` : ''}
    ${s.entry_card_id ? `<span style="font-size:10px;padding:2px 8px;border-radius:4px;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0">entry: ${s.entry_card_id}</span>` : ''}
  </div>
  <div style="padding:14px 16px">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:6px">Opener Text</div>
    <div style="font-size:13px;line-height:1.65;margin-bottom:${s.business_context?'12px':'0'}">${s.opener_text || '<em style="color:var(--muted)">No opener text</em>'}</div>
    ${s.business_context ? `
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:6px">Business Context</div>
      <div style="font-size:12px;line-height:1.6;color:var(--muted)">${s.business_context}</div>
    ` : ''}
  </div>
</div>`).join('');
}

function ccRenderStageView(stages, stageLabels, stageCards) {
  const stageButtons = Array.from({length: stages}, (_, i) => {
    const n = i + 1;
    const label = stageLabels[i] || `Stage ${n}`;
    const active = n === ccState.stage;
    return `<button onclick="ccSetStage(${n})" class="btn${active?' btn-primary':' btn-outline'}" style="font-size:11px;padding:5px 12px">${n}. ${label}</button>`;
  }).join('');

  const curatedStage = stageCards.filter(c => c.curated).length;

  return `
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
    ${stageButtons}
  </div>
  <div style="font-size:11px;color:var(--muted);margin-bottom:10px">${curatedStage}/${stageCards.length} cards curated at this stage</div>
  ${stageCards.length ? stageCards.map(ccRenderCard).join('') : `<div class="card" style="padding:24px;text-align:center;color:var(--muted);font-size:12px">No cards at this stage.</div>`}`;
}

function ccRenderCard(card) {
  const rp = (typeof card.role_prompts === 'string') ? JSON.parse(card.role_prompts) : (card.role_prompts || {});
  const curated = !!card.curated;
  const nist = CC_NIST[card.nist_phase_idx] || `Phase ${card.nist_phase_idx}`;

  const criticColors = {
    Critical: {bg:'#fef2f2',color:'#dc2626',border:'#fca5a5'},
    High:     {bg:'#fff7ed',color:'#ea580c',border:'#fdba74'},
    Medium:   {bg:'#fefce8',color:'#ca8a04',border:'#fde047'},
    Low:      {bg:'#f0fdf4',color:'#16a34a',border:'#86efac'},
  };
  const cc = criticColors[card.correct_criticality] || {bg:'#f9fafb',color:'#6b7280',border:'#e5e7eb'};

  const rolesHtml = ['ic','tl','cl','lc','es'].map(r => {
    const prompt = rp[r] || '';
    const mon = prompt === 'Monitor situation. No action required at this inject.';
    const rc = CC_ROLE_COLORS[r] || {};
    return `<div style="display:grid;grid-template-columns:50px 1fr;gap:0;margin-bottom:5px;align-items:flex-start">
      <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:3px;background:${rc.bg};color:${rc.color};border:1px solid ${rc.border};text-transform:uppercase;letter-spacing:.05em;margin-top:1px;text-align:center">${r.toUpperCase()}</span>
      <div style="font-size:12px;line-height:1.55;padding:0 0 0 8px;color:${mon?'var(--muted)':'var(--text)'};font-style:${mon?'italic':'normal'}">${prompt || '<em>—</em>'}</div>
    </div>`;
  }).join('');

  return `<div class="card" style="margin-bottom:12px;overflow:hidden" id="cc-card-${card.id}">
    <div style="padding:10px 16px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;border-bottom:1px solid var(--border)">
      <span style="font-size:10px;font-weight:700;background:var(--navy);color:#fff;padding:2px 8px;border-radius:4px;letter-spacing:.5px">${card.id}</span>
      <span style="font-size:13px;font-weight:700;flex:1;min-width:0">${card.title}</span>
      <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;background:${cc.bg};color:${cc.color};border:1px solid ${cc.border}">${card.correct_criticality || '—'}</span>
      <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:#f5f3ff;color:#7c3aed;border:1px solid #ddd6fe">${nist}</span>
      <button onclick="ccToggleCurated('${card.id}', ${!curated})" class="btn btn-sm ${curated ? 'btn-cyan' : 'btn-outline'}" style="font-size:10px;padding:3px 10px;min-width:72px" id="cc-btn-${card.id}">
        ${curated ? '✓ Curated' : 'Draft'}
      </button>
    </div>
    <div style="padding:12px 16px;border-bottom:1px solid var(--border)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:5px">Body</div>
      <div style="font-size:13px;line-height:1.65">${card.body || '<em style="color:var(--muted)">No body seeded yet</em>'}</div>
    </div>
    <div style="padding:12px 16px;border-bottom:1px solid var(--border)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px">Role Prompts</div>
      ${rolesHtml}
    </div>
    <div style="padding:8px 16px;display:flex;gap:8px;flex-wrap:wrap">
      <span style="font-size:10px;padding:2px 8px;background:var(--bg);border:1px solid var(--border);border-radius:4px;color:var(--muted)">${card.mitre_tactic || '—'}</span>
      <span style="font-size:10px;padding:2px 8px;background:var(--bg);border:1px solid var(--border);border-radius:4px;color:var(--muted)">${card.mitre_technique || '—'}</span>
      <span style="font-size:10px;padding:2px 8px;background:var(--bg);border:1px solid var(--border);border-radius:4px;color:var(--muted)">Stage ${card.chain_stage} · Weight ${card.weight}</span>
    </div>
  </div>`;
}

// ── Controls ────────────────────────────────────────────────

function ccSetArch(arch) {
  ccState.arch      = arch;
  ccState.stage     = 1;
  ccState.stageView = 'cards';
  renderMain();
}

function ccSetStage(n) {
  ccState.stage     = n;
  ccState.stageView = 'cards';
  renderMain();
}

function ccSetView(v) {
  ccState.stageView = v;
  renderMain();
}

async function ccToggleCurated(id, newVal) {
  // Optimistic UI — update state then re-render
  const card = ccState.cards && ccState.cards.find(c => c.id === id);
  if (card) card.curated = newVal;
  ccUpdateCounter();

  try {
    const r = await sbFetch(`tt_inject_cards?id=eq.${id}`, 'PATCH', { curated: newVal }, { Prefer: 'return=representation' });
    if (!Array.isArray(r) || r.length === 0) {
      // RLS silently blocked — no UPDATE policy in place yet (run SUPABASE_PATCH_066.sql)
      if (card) card.curated = !newVal;
      ccUpdateCounter();
      toast(`Save blocked — run SUPABASE_PATCH_066.sql to enable curator writes`, '#dc2626');
    } else {
      toast(newVal ? `${id} — marked Curated` : `${id} — reverted to Draft`, newVal ? '#16a34a' : '#6b7280');
    }
  } catch(e) {
    if (card) card.curated = !newVal;
    ccUpdateCounter();
    toast('Save failed for ' + id + ': ' + e.message, '#dc2626');
  }
}

function ccUpdateCounter() {
  if (!ccState.cards) return;
  const total   = ccState.cards.length;
  const curated = ccState.cards.filter(c => c.curated).length;
  const pct     = total ? Math.round(curated / total * 100) : 0;
  const numEl   = document.querySelector('[data-cc-count]');
  const barEl   = document.querySelector('[data-cc-bar]');
  // Re-render header only if elements are present
  // Simple approach: re-render full page to keep count accurate
  // (lightweight enough — no data fetch needed)
  if (activeNav === 'card_curator') {
    const el = document.getElementById('mainContent');
    if (el) el.innerHTML = renderCardCurator();
  }
}
