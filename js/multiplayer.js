// ============================================================

function mpHideApp() {
  const layout = document.querySelector('.layout');
  const toastEl = document.getElementById('toast');
  if (layout)  layout.style.display = 'none';
  if (toastEl) toastEl.style.display = 'none';
}
function mpScreenHTML(body) {
  return `<div class="mp-header"><div class="mp-brand">Abbott Cyber &mdash; Tabletop Exercise</div></div><div class="mp-body">${body}</div>`;
}
function mpErrorScreen(msg) {
  return mpScreenHTML(`<div class="mp-card" style="text-align:center;padding:2rem"><div style="font-size:32px;margin-bottom:0.75rem">&#9888;</div><div style="font-size:15px;font-weight:700;color:#fff;margin-bottom:0.5rem">Cannot join session</div><div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.5">${msg}</div></div>`);
}
function mpNistBar(activeIdx) {
  return `<div style="display:flex;gap:3px;margin-bottom:0.85rem">${TT_NIST_PHASES.map((s,i)=>`<div title="${s}" style="flex:1;border-radius:4px;height:5px;background:${i===activeIdx?'var(--cyan)':i<activeIdx?'#15803d':'rgba(255,255,255,0.1)'}"></div>`).join('')}</div>`;
}

async function mpBoot(code) {
  mpHideApp();
  const wrap = document.createElement('div');
  wrap.id='mpScreen'; wrap.className='mp-screen';
  document.body.appendChild(wrap);
  const saved = mpLoadState();
  if (saved && saved.sessionCode===code) { await mpResume(wrap,saved); }
  else { mpClearState(); await mpShowJoinLobby(wrap,code); }
}

async function mpResume(wrap, saved) {
  try {
    const session = await sb.tt.getSessionByCode(saved.sessionCode);
    if (!session) { mpClearState(); wrap.innerHTML=mpErrorScreen('Session not found. The code may have expired.'); return; }
    mpRenderFull(wrap,session,saved); mpStartPoll(wrap,saved);
  } catch(e) { wrap.innerHTML=mpErrorScreen('Could not connect: '+e.message); }
}

let mpSelectedRole = null;

async function mpShowJoinLobby(wrap, code) {
  wrap.innerHTML = mpScreenHTML(`
    <div class="mp-card"><div class="mp-label">Session code</div><div class="mp-code">${code}</div>
      <div id="mpSessionTitle" style="text-align:center;font-size:13px;color:rgba(255,255,255,0.55);margin-top:4px">Loading...</div></div>
    <div class="mp-card"><div class="mp-label" style="margin-bottom:8px">Your name</div>
      <input class="mp-input" id="mpName" placeholder="e.g. Sarah Chen" autocomplete="off" autofocus/></div>
    <div class="mp-card"><div class="mp-label" style="margin-bottom:10px">Choose your role</div>
      <div class="mp-role-grid" id="mpRoleGrid">
        ${TT_ROLES.map(r=>`<div class="mp-role-card" id="mpRole_${r.id}" onclick="mpPickRole('${r.id}')">
          <div style="font-size:20px">${r.icon}</div><div class="mp-role-name">${r.name}</div>
          <div class="mp-role-desc">${r.desc}</div>
          <div style="margin-top:5px"><span class="mp-role-badge avail" id="mpBadge_${r.id}">Available</span></div>
        </div>`).join('')}
      </div></div>
    <button class="mp-btn mp-btn-primary" id="mpJoinBtn" onclick="mpDoJoin('${code}')" disabled>Pick a role to continue</button>
    <div id="mpJoinErr" style="text-align:center;font-size:12px;color:#fca5a5;margin-top:8px;min-height:16px"></div>`);
  try {
    const session = await sb.tt.getSessionByCode(code);
    if (!session) { wrap.innerHTML=mpErrorScreen(`Session "${code}" not found. Check the code and try again.`); return; }
    const scenario = TT_SCENARIOS[session.scenario_id];
    const titleEl = document.getElementById('mpSessionTitle');
    if (titleEl && scenario) titleEl.textContent = scenario.title;
    wrap._sessionData = session;
    const participants = await sb.tt.getParticipants(session.id);
    participants.forEach(p => {
      const card=document.getElementById('mpRole_'+p.role_id); const badge=document.getElementById('mpBadge_'+p.role_id);
      if (card) card.classList.add('taken');
      if (badge) { badge.classList.remove('avail'); badge.textContent='Taken'; }
    });
  } catch(e) { wrap.innerHTML=mpErrorScreen('Could not load session: '+e.message); }
}

function mpPickRole(rid) {
  mpSelectedRole = rid;
  document.querySelectorAll('.mp-role-card').forEach(el=>el.classList.remove('sel'));
  const card = document.getElementById('mpRole_'+rid);
  if (card && !card.classList.contains('taken')) card.classList.add('sel');
  const role = TT_ROLES.find(r=>r.id===rid);
  const btn = document.getElementById('mpJoinBtn');
  if (btn && role) { btn.disabled=false; btn.textContent=`Join as ${role.name} →`; }
}

async function mpDoJoin(code) {
  const nameEl=document.getElementById('mpName'); const errEl=document.getElementById('mpJoinErr');
  const btn=document.getElementById('mpJoinBtn'); const wrap=document.getElementById('mpScreen');
  const name=nameEl?nameEl.value.trim():'';
  if (!name)           { if(errEl) errEl.textContent='Enter your name before joining.'; return; }
  if (!mpSelectedRole) { if(errEl) errEl.textContent='Pick a role before joining.'; return; }
  const session = wrap&&wrap._sessionData;
  if (!session)        { if(errEl) errEl.textContent='Session data missing — refresh and try again.'; return; }
  if (btn) { btn.disabled=true; btn.textContent='Joining...'; }
  try {
    const existing = await sb.tt.getParticipants(session.id);
    if (existing.find(p=>p.role_id===mpSelectedRole)) {
      // Allow same-name player to reclaim their own role (rejoin)
      const takenByMe = existing.find(p=>p.role_id===mpSelectedRole && p.player_name.toLowerCase()===name.toLowerCase());
      if (takenByMe) {
        const role = TT_ROLES.find(r=>r.id===mpSelectedRole);
        const playerState = {sessionId:session.id,sessionCode:code,roleId:mpSelectedRole,roleName:role.name,roleIcon:role.icon,playerName:takenByMe.player_name,participantId:takenByMe.id};
        mpSaveState(playerState); mpSelectedRole=null; _mpCrit=null;
        mpRenderFull(wrap,session,playerState); mpStartPoll(wrap,playerState); return;
      }
      if(errEl) errEl.textContent='That role was just taken — pick another.';
      if(btn) { btn.disabled=false; btn.textContent='Try again'; }
      const card=document.getElementById('mpRole_'+mpSelectedRole); const badge=document.getElementById('mpBadge_'+mpSelectedRole);
      if(card) card.classList.add('taken'); if(badge) { badge.classList.remove('avail'); badge.textContent='Taken'; }
      mpSelectedRole=null; return;
    }
    const role = TT_ROLES.find(r=>r.id===mpSelectedRole);
    const participant = await sb.tt.claimRole({session_id:session.id,role_id:mpSelectedRole,role_name:role.name,player_name:name});
    const playerState = {sessionId:session.id,sessionCode:code,roleId:mpSelectedRole,roleName:role.name,roleIcon:role.icon,playerName:name,participantId:participant&&participant.id};
    mpSaveState(playerState); mpSelectedRole=null; _mpCrit=null;
    mpRenderFull(wrap,session,playerState); mpStartPoll(wrap,playerState);
  } catch(e) {
    if(errEl) errEl.textContent='Join failed: '+e.message;
    if(btn) { btn.disabled=false; btn.textContent='Try again'; }
  }
}

function mpRenderFull(wrap, session, playerState) {
  const scenario = TT_SCENARIOS[session.scenario_id];
  if (session.status==='complete') {
    wrap.innerHTML=mpScreenHTML(`<div style="text-align:center;padding:3rem 1rem"><div style="font-size:40px;margin-bottom:0.75rem">&#10003;</div><div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:0.5rem">Exercise complete</div><div style="font-size:13px;color:rgba(255,255,255,0.55)">The facilitator is reviewing the After Action Report. Well done, ${playerState.playerName}.</div></div>`);
    return;
  }
  if (!session.declaration_logged) {
    const isIC = playerState.roleId==='ic';
    wrap.innerHTML=mpScreenHTML(`
      <div class="mp-card"><div class="mp-label">Waiting for the exercise to begin</div>
        <div style="font-size:15px;font-weight:700;color:#fff;margin:6px 0">${scenario?scenario.title:'Tabletop Exercise'}</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.6);line-height:1.5">${isIC?'You are the Incident Commander. Press Begin below when your team is ready.':'Waiting for the Incident Commander to start the exercise.'}</div></div>
      <div class="mp-card"><div class="mp-label" style="margin-bottom:10px">Your role</div>
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:30px">${playerState.roleIcon}</span>
          <div><div style="font-size:15px;font-weight:700;color:#fff">${playerState.roleName}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.5)">${(TT_ROLES.find(r=>r.id===playerState.roleId)||{}).desc||''}</div></div>
        </div></div>
      <div class="mp-card"><div class="mp-label" style="margin-bottom:8px">In the room</div>
        <div class="mp-roster" id="mpRosterList"><div style="font-size:12px;color:rgba(255,255,255,0.35)">Loading...</div></div></div>
      ${isIC?`<button class="mp-btn mp-btn-primary" style="font-size:15px;padding:14px;margin-top:0.5rem" id="mpBeginBtn" onclick="mpIcStartExercise('${session.id}')">&#128640; Begin Exercise</button>`:''}
      <div style="text-align:center;margin-top:1rem">
        <div class="mp-spinner"></div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4)">${isIC?'Or wait for the facilitator to begin from their screen.':'Polling for exercise start…'}</div></div>
      <div style="margin-top:1.5rem;background:rgba(0,0,0,0.2);border-radius:8px;padding:0.85rem 1rem;border:1px solid rgba(255,255,255,0.06)">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.32);margin-bottom:5px">&#128274; Rejoin code</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6">Session <span style="color:var(--cyan2);font-weight:700;letter-spacing:0.1em">${session.session_code}</span> &mdash; if you get disconnected, return to this URL and enter your name as <span style="color:var(--cyan2);font-weight:700">${playerState.playerName}</span> then pick <span style="color:var(--cyan2)">${playerState.roleName}</span>.</div>
      </div>`);
    wrap.dataset.phase='waiting'; mpRefreshRoster(session.id); return;
  }
  wrap.dataset.phase='inject'; mpRenderInjectView(wrap,session,playerState);
}

async function mpRenderInjectView(wrap, session, playerState) {
  const scenario = TT_SCENARIOS[session.scenario_id];
  const idx = session.current_inject;
  const inj = scenario&&scenario.injects[idx];
  if (!inj) {
    wrap.innerHTML=mpScreenHTML(`<div style="text-align:center;padding:3rem 1rem"><div style="font-size:36px;margin-bottom:0.75rem">&#x1F3C1;</div><div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:0.5rem">All injects complete</div><div style="font-size:12px;color:rgba(255,255,255,0.6)">The facilitator is preparing the After Action Report. Stand by.</div></div>`);
    return;
  }
  const prompt = inj.rolePrompts[playerState.roleId]||'No specific prompt for your role on this inject.';
  let savedResp=null;
  try { const all=await sb.tt.getResponses(session.id,idx); savedResp=all.find(r=>r.role_id===playerState.roleId)||null; } catch {}
  _mpCrit = savedResp?savedResp.criticality:null;
  _mpSelCard = null;
  const safePN = playerState.playerName.replace(/'/g,"\\'");
  // Get option cards for this role/inject if available
  const cards = (TT_OPTIONS[session.scenario_id]||[])[idx]?.[playerState.roleId]||null;
  const savedText = savedResp?(savedResp.response_text||''):'';
  // Detect if saved response matches a card value
  let savedCardIdx = null;
  if (cards && savedText) { savedCardIdx = cards.findIndex(c=>c.v===savedText); }
  if (savedCardIdx >= 0) _mpSelCard = savedCardIdx;

  const cardGrid = cards ? `
    <div class="mp-label" style="margin-bottom:8px">Choose your action — tap a card to learn more</div>
    <div class="mp-sel-badge" id="mpSelBadge">${savedCardIdx>=0?'âœ“ '+cards[savedCardIdx].label+' selected':'No card selected yet'}</div>
    <div class="mp-cgrid" id="mpCardGrid">
      ${cards.map((card,i)=>`
      <div class="mp-couter${savedCardIdx===i?' sel-card':''}" id="mpCard_${i}" data-v="${card.v.replace(/"/g,'&quot;')}" onclick="mpFlipCard(${i})">
        <div class="mp-cinner">
          <div class="mp-cface">
            <div>
              <div class="mp-ctit">${card.label}</div>
              <div class="mp-csub">${card.sub}</div>
            </div>
            <div class="mp-ctapehint">Tap for details ↩</div>
          </div>
          <div class="mp-cbk">
            <div>
              <div class="mp-cbrow"><div class="mp-cbdot" style="background:#4ade80"></div><div class="mp-cbtxt"><b>Pro:</b> ${card.pro}</div></div>
              <div class="mp-cbrow"><div class="mp-cbdot" style="background:#f87171"></div><div class="mp-cbtxt"><b>Risk:</b> ${card.con}</div></div>
              <div class="mp-cbrow"><div class="mp-cbdot" style="background:#60a5fa"></div><div class="mp-cbtxt"><b>Ref:</b> ${card.ref}</div></div>
            </div>
            <button class="mp-cplaybtn" onclick="event.stopPropagation();mpPlayCard(${i})">â–¶ Play this card</button>
          </div>
        </div>
      </div>`).join('')}
    </div>
    <div class="mp-custom-link" onclick="mpPlayCustom()">or write a custom response instead ↓</div>
    <div id="mpCustomArea" style="display:none">
      <textarea class="mp-input" id="mpRespText" placeholder="Write your own response..." style="min-height:70px;resize:vertical;line-height:1.5" oninput="checkMpReady()"></textarea>
    </div>` : `
    <div class="mp-label" style="margin-bottom:6px">Your response</div>
    <textarea class="mp-input" id="mpRespText" placeholder="What are you doing / deciding?" style="min-height:80px;resize:vertical;line-height:1.5">${savedText}</textarea>`;

  wrap.innerHTML=mpScreenHTML(`
    ${mpNistBar(inj.phaseIdx)}
    <div class="mp-card" style="padding:0.75rem 1rem;display:flex;align-items:center;gap:10px;margin-bottom:0.75rem">
      <span style="font-size:22px">${playerState.roleIcon}</span>
      <div style="flex:1"><div style="font-size:12px;font-weight:700;color:#fff">${playerState.roleName}</div><div style="font-size:10px;color:rgba(255,255,255,0.45)">${playerState.playerName}</div></div>
      <div style="text-align:right"><div style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em">Inject</div><div style="font-size:14px;font-weight:700;color:var(--cyan2)">${idx+1} / ${scenario.injects.length}</div></div>
    </div>
    <div class="mp-card" style="padding:1.1rem 1.25rem">
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px">
        <span class="badge b-cyan">${inj.ingest}</span>
        <span class="badge b-navy">${TT_NIST_PHASES[inj.phaseIdx]}</span>
      </div>
      <div class="mp-inject-title">${inj.title}</div>
      <div class="mp-inject-body">${inj.body}</div>
      <div class="mp-prompt-box"><b>Your prompt:</b> ${prompt}</div>
    </div>
    <div class="mp-card">
      ${cardGrid}
      <div class="mp-label" style="margin:12px 0 5px">Criticality rating</div>
      <div class="mp-crit-row">
        ${['Critical','High','Medium','Low'].map(c=>`<button class="mp-crit-btn${_mpCrit===c?' sel-'+c:''}" id="mpCrit_${c}" onclick="mpSetCrit('${c}')">${c}</button>`).join('')}
      </div>
      <button class="mp-btn mp-btn-primary" style="margin-top:12px;opacity:0.45" id="mpRespBtn" disabled
        onclick="mpSubmitResponse('${session.id}',${idx},'${playerState.roleId}','${safePN}')">
        ${savedResp?'Update response':'Submit response'}</button>
      <div id="mpRespMsg" style="text-align:center;font-size:11px;color:rgba(255,255,255,0.45);margin-top:6px;min-height:14px">
        ${savedResp?'Response saved — waiting for facilitator to advance.':''}</div>
    </div>`);
  wrap.dataset.injectIdx=idx;
  // If we have saved state, re-enable the button
  if (savedResp) { checkMpReady(); }
}

function mpFlipCard(idx) {
  const el = document.getElementById('mpCard_'+idx);
  if (!el) return;
  el.classList.toggle('flipped');
}

function mpPlayCard(idx) {
  const grid = document.getElementById('mpCardGrid');
  if (!grid) return;
  // Deselect all, select chosen
  grid.querySelectorAll('.mp-couter').forEach((el,i)=>{
    el.classList.remove('sel-card','flipped');
    if(i===idx) el.classList.add('sel-card');
  });
  _mpSelCard = idx;
  const badge = document.getElementById('mpSelBadge');
  // Read the label from the card face
  const cardTit = grid.querySelectorAll('.mp-ctit')[idx];
  if(badge && cardTit) badge.textContent = 'âœ“ '+cardTit.textContent+' selected';
  checkMpReady();
}

function mpPlayCustom() {
  const area = document.getElementById('mpCustomArea');
  if (area) { area.style.display='block'; area.scrollIntoView({behavior:'smooth',block:'nearest'}); }
  _mpSelCard = null;
  checkMpReady();
}

function checkMpReady() {
  const btn = document.getElementById('mpRespBtn');
  if (!btn) return;
  const hasCard = _mpSelCard !== null;
  const hasText = (document.getElementById('mpRespText')||{value:''}).value.trim().length > 0;
  const ready = hasCard || hasText;
  btn.disabled = !ready;
  btn.style.opacity = ready ? '1' : '0.45';
}

function mpSetCrit(c) {
  _mpCrit=c;
  ['Critical','High','Medium','Low'].forEach(x=>{
    const btn=document.getElementById('mpCrit_'+x);
    if(btn) btn.className='mp-crit-btn'+(x===c?' sel-'+x:'');
  });
}

async function mpSubmitResponse(sessionId, injectIdx, roleId, playerName) {
  const msgEl=document.getElementById('mpRespMsg');
  const btn=document.getElementById('mpRespBtn');
  // Determine response text: card data-v value or custom textarea
  let text = '';
  if (_mpSelCard !== null) {
    const cardEl = document.getElementById('mpCard_'+_mpSelCard);
    text = cardEl ? (cardEl.dataset.v||'') : '';
  }
  if (!text) {
    const textEl = document.getElementById('mpRespText');
    text = textEl ? textEl.value.trim() : '';
  }
  if (!text) { if(msgEl) msgEl.textContent='Select a card or write a response before submitting.'; return; }
  if(btn) btn.disabled=true; if(msgEl) msgEl.textContent='Saving...';
  try {
    await sb.tt.upsertResponse({session_id:sessionId,inject_index:injectIdx,role_id:roleId,player_name:playerName,response_text:text,criticality:_mpCrit||null});
    if(btn) { btn.disabled=false; btn.textContent='Update response'; }
    if(msgEl) msgEl.textContent='Response saved — waiting for facilitator to advance.';
  } catch(e) {
    if(btn) btn.disabled=false;
    if(msgEl) msgEl.textContent='Save failed: '+e.message;
  }
}

function mpStartPoll(wrap, playerState) {
  if (mpPollTimer) clearInterval(mpPollTimer);
  mpPollTimer = setInterval(async ()=>{
    try {
      const session = await sb.tt.getSessionByCode(playerState.sessionCode);
      if (!session) return;
      const prevPhase=wrap.dataset.phase; const prevInject=wrap.dataset.injectIdx;
      const prevDecl=wrap.dataset.declared;
      const nowDecl=String(session.declaration_logged); const nowInject=String(session.current_inject);
      const nowComplete=session.status==='complete';
      if (prevPhase==='waiting') mpRefreshRoster(session.id);
      if (nowDecl!==prevDecl||nowInject!==prevInject||nowComplete) {
        wrap.dataset.declared=nowDecl; wrap.dataset.injectIdx=nowInject; _mpCrit=null;
        mpRenderFull(wrap,session,playerState);
      }
    } catch {}
  }, 4000);
}

async function mpRefreshRoster(sessionId) {
  const list=document.getElementById('mpRosterList');
  if (!list) return;
  try {
    const participants = await sb.tt.getParticipants(sessionId);
    if (!participants.length) { list.innerHTML='<div style="font-size:12px;color:rgba(255,255,255,0.35)">No other players have joined yet.</div>'; return; }
    list.innerHTML=participants.map(p=>{
      const role=TT_ROLES.find(r=>r.id===p.role_id);
      return `<div class="mp-roster-item"><span class="mp-roster-icon">${role?role.icon:'?'}</span><div><div class="mp-roster-name">${p.player_name}</div><div class="mp-roster-role">${p.role_name}</div></div></div>`;
    }).join('');
  } catch {}
}

// ============================================================
// MULTIPLAYER — Display screen (?display=CODE)
// ============================================================

async function dispBoot(code) {
  mpHideApp();
  const wrap=document.createElement('div');
  wrap.id='dispScreen'; wrap.className='disp-screen';
  document.body.appendChild(wrap);
  wrap.innerHTML=`
    <div class="disp-header"><div class="disp-brand">Abbott Cyber &mdash; Tabletop Exercise</div>
      <div style="text-align:right"><div class="disp-code-label">Join code</div><div class="disp-code">${code}</div></div></div>
    <div class="disp-body" style="align-items:center;justify-content:center">
      <div style="text-align:center"><div class="mp-spinner" style="width:36px;height:36px;margin:0 auto 1rem"></div>
      <div style="font-size:14px;color:rgba(255,255,255,0.6);font-weight:700">Connecting to session ${code}...</div></div></div>`;
  try {
    const session=await sb.tt.getSessionByCode(code);
    if (!session) { wrap.querySelector('.disp-body').innerHTML=`<div style="text-align:center;color:#fca5a5;font-size:14px;font-weight:700">Session "${code}" not found.</div>`; return; }
    wrap._sessionCode=code; await dispRender(wrap,session); dispStartPoll(wrap,code);
  } catch(e) {
    const body=wrap.querySelector('.disp-body');
    if(body) body.innerHTML=`<div style="text-align:center;color:#fca5a5;font-size:14px">Connection failed: ${e.message}</div>`;
  }
}

async function dispRender(wrap, session) {
  const scenario=TT_SCENARIOS[session.scenario_id];
  const participants=await sb.tt.getParticipants(session.id);
  const idx=session.current_inject; const inj=scenario&&scenario.injects[idx];
  let responses=[];
  if (session.declaration_logged&&inj) { try { responses=await sb.tt.getResponses(session.id,idx); } catch {} }
  const rosterHTML=`
    <div class="disp-roster-title">Participants (${participants.length} / 5)</div>
    ${TT_ROLES.map(role=>{
      const p=participants.find(x=>x.role_id===role.id);
      const resp=session.declaration_logged?responses.find(r=>r.role_id===role.id):null;
      return `<div class="disp-roster-row">
        <span style="font-size:20px">${role.icon}</span>
        <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;color:${p?'#fff':'rgba(255,255,255,0.22)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p?p.player_name:'Open seat'}</div>
          <div style="font-size:9px;color:rgba(255,255,255,0.35)">${role.name}</div></div>
        ${session.declaration_logged?`<div class="mp-status-dot ${resp?'mp-status-answered':'mp-status-pending'}"></div>`:''}
      </div>`;
    }).join('')}`;
  let mainHTML='';
  if (session.status==='complete') {
    mainHTML=`<div class="disp-inject-card" style="text-align:center;padding:3rem 2rem"><div style="font-size:44px;margin-bottom:0.75rem">&#x1F3C1;</div><div style="font-size:24px;font-weight:700;color:#fff;margin-bottom:0.5rem">Exercise Complete</div><div style="font-size:14px;color:rgba(255,255,255,0.55)">After Action Report is underway with the facilitator.</div></div>`;
  } else if (!session.declaration_logged) {
    mainHTML=`<div class="disp-scenario-title">${scenario?scenario.title:'Tabletop Exercise'}</div>
      <div class="disp-scenario-sub">${scenario?scenario.summary:''}</div>
      <div class="disp-inject-card" style="text-align:center;padding:2.5rem 2rem">
        <div class="mp-spinner" style="width:28px;height:28px;margin:0 auto 1rem"></div>
        <div style="font-size:17px;font-weight:700;color:#fff;margin-bottom:6px">Waiting for Step 0 &mdash; TL Declaration</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5)">The facilitator is completing the TL severity assessment.</div></div>
      <div style="margin-top:0.75rem;font-size:12px;color:rgba(255,255,255,0.35);text-align:center">
        Players join at: <span style="color:var(--cyan2);font-family:monospace">${window.location.origin}${window.location.pathname}?join=${session.session_code}</span></div>`;
  } else if (!inj) {
    mainHTML=`<div class="disp-inject-card" style="text-align:center;padding:2rem"><div style="font-size:14px;color:rgba(255,255,255,0.55)">All injects complete &mdash; transitioning to After Action Report.</div></div>`;
  } else {
    mainHTML=`<div class="disp-scenario-title">${scenario.title}</div>
      <div class="disp-nist">${TT_NIST_PHASES.map((s,i)=>`<div class="disp-nist-step ${i===inj.phaseIdx?'active':i<inj.phaseIdx?'done':''}">${s}</div>`).join('')}</div>
      <div class="disp-inject-card">
        <div style="margin-bottom:8px"><span class="disp-inject-badge">Inject ${idx+1} of ${scenario.injects.length}</span> <span style="font-size:11px;color:rgba(255,255,255,0.4)">${inj.ingest}</span></div>
        <div class="disp-inject-title">${inj.title}</div>
        <div class="disp-inject-body">${inj.body}</div></div>
      <div><div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:8px">Response status</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${TT_ROLES.map(role=>{const resp=responses.find(r=>r.role_id===role.id);
            return `<div style="background:${resp?'rgba(21,128,61,0.2)':'rgba(255,255,255,0.04)'};border:1px solid ${resp?'rgba(21,128,61,0.4)':'rgba(255,255,255,0.08)'};border-radius:8px;padding:6px 12px;display:flex;align-items:center;gap:7px">
              <span style="font-size:16px">${role.icon}</span>
              <span style="font-size:11px;font-weight:700;color:${resp?'#86efac':'rgba(255,255,255,0.35)'}">${resp?'Submitted':'Pending...'}</span></div>`;}).join('')}
        </div></div>`;
  }
  let bodyEl=wrap.querySelector('.disp-body');
  if (!bodyEl) { bodyEl=document.createElement('div'); bodyEl.className='disp-body'; wrap.appendChild(bodyEl); }
  bodyEl.innerHTML=`<div class="disp-main">${mainHTML}</div><div class="disp-sidebar">${rosterHTML}</div>`;
}

function dispStartPoll(wrap, code) {
  if (dispPollTimer) clearInterval(dispPollTimer);
  dispPollTimer=setInterval(async()=>{
    try { const s=await sb.tt.getSessionByCode(code); if(s) await dispRender(wrap,s); } catch {}
  },5000);
}

// ============================================================
// FACILITATOR LOBBY HELPERS
// ============================================================

function ttGetJoinUrl() { return ttState&&ttState.sessionCode?`${window.location.origin}${window.location.pathname}?join=${ttState.sessionCode}`:''; }
function ttGetDisplayUrl() { return ttState&&ttState.sessionCode?`${window.location.origin}${window.location.pathname}?display=${ttState.sessionCode}`:''; }
function ttCopyUrl(which) {
  const url=which==='join'?ttGetJoinUrl():ttGetDisplayUrl();
  if (navigator.clipboard) { navigator.clipboard.writeText(url).then(()=>toast('Link copied!','#15803d')).catch(()=>ttCopyFallback(url)); }
  else { ttCopyFallback(url); }
}
function ttCopyFallback(url) {
  const ta=document.createElement('textarea'); ta.value=url; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
  toast('Link copied!','#15803d');
}

function ttRenderLobbyPanel() {
  if (!ttState||!ttState.sessionCode) return '';
  const showBegin = ttState.view==='commentary';
  return `<div class="fac-lobby-panel">
    <div style="font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan2);margin-bottom:12px">Multiplayer lobby &mdash; Session ${ttState.sessionCode}</div>
    <div style="margin-bottom:10px">
      <div class="field-lbl" style="font-size:12px;color:rgba(255,255,255,0.65);margin-bottom:5px">Player join link</div>
      <div class="fac-share-row"><div class="fac-url-box">${ttGetJoinUrl()}</div><button class="btn btn-cyan btn-sm" onclick="ttCopyUrl('join')">Copy</button></div>
    </div>
    <div style="margin-bottom:14px">
      <div class="field-lbl" style="font-size:12px;color:rgba(255,255,255,0.65);margin-bottom:5px">Display screen link (projector / TV)</div>
      <div class="fac-share-row"><div class="fac-url-box">${ttGetDisplayUrl()}</div><button class="btn btn-outline btn-sm" onclick="ttCopyUrl('display')">Copy</button></div>
    </div>
    <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:10px">Participants (refreshes every 5s)</div>
    <div id="facParticipantList"><div style="font-size:13px;color:rgba(255,255,255,0.3);padding:0.5rem 0">Loading roster...</div></div>
    ${showBegin?`<div style="margin-top:14px;border-top:1px solid rgba(255,255,255,0.09);padding-top:13px">
      <button class="btn btn-cyan" style="width:100%;font-size:14px;padding:10px 16px;letter-spacing:0.02em" onclick="ttFacBeginExercise()">&#128640; Begin Exercise</button>
      <div style="font-size:11px;color:rgba(255,255,255,0.35);text-align:center;margin-top:7px">Or the IC player can start it from their device</div>
    </div>`:''}
  </div>`;
}

function ttRenderResponseFeedPanel(idx) {
  return `<div class="card"><div class="card-title">Live player responses &mdash; inject ${idx+1}</div>
    <div class="fac-resp-feed" id="facRespFeed"><div style="font-size:11px;color:var(--muted)">Loading...</div></div></div>`;
}

async function ttFacRefreshLobby() {
  const listEl=document.getElementById('facParticipantList');
  if (!listEl||!ttState||!ttState.sessionId) return;
  try {
    const participants=await sb.tt.getParticipants(ttState.sessionId);
    facParticipants=participants;
    if (!participants.length) { listEl.innerHTML='<div style="font-size:12px;color:rgba(255,255,255,0.35);text-align:center;padding:0.5rem 0">No players have joined yet &mdash; share the join link above.</div>'; return; }
    listEl.innerHTML=TT_ROLES.map(role=>{
      const p=participants.find(x=>x.role_id===role.id);
      return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
        <span style="font-size:18px">${role.icon}</span>
        <div style="flex:1"><div style="font-size:13px;font-weight:700;color:${p?'#fff':'rgba(255,255,255,0.28)'}">${p?p.player_name:'Open seat'}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.45)">${role.name}</div></div>
        ${p?'<span style="font-size:10px;font-weight:700;color:#86efac;background:rgba(21,128,61,0.3);padding:2px 8px;border-radius:99px">JOINED</span>':'<span style="font-size:10px;color:rgba(255,255,255,0.25)">—</span>'}
      </div>`;
    }).join('');
  } catch {}
}

async function ttFacRefreshResponses(injectIdx) {
  const feedEl=document.getElementById('facRespFeed');
  if (!feedEl||!ttState||!ttState.sessionId) return;
  try {
    const responses=await sb.tt.getResponses(ttState.sessionId,injectIdx);
    if (!responses.length) { feedEl.innerHTML='<div style="font-size:11px;color:var(--muted);padding:0.25rem 0">No responses submitted yet.</div>'; return; }
    feedEl.innerHTML=responses.map(r=>{
      const role=TT_ROLES.find(x=>x.id===r.role_id);
      const critColor=r.criticality==='Critical'?'#dc2626':r.criticality==='High'?'#ea580c':r.criticality==='Medium'?'#d97706':'#15803d';
      return `<div class="fac-resp-item">
        <div class="fac-resp-role">${role?role.icon+' '+role.name:r.role_id}${r.player_name?' &middot; <span style="font-weight:400;color:var(--muted)">'+r.player_name+'</span>':''}${r.criticality?' &mdash; <span style="color:'+critColor+';font-weight:700">'+r.criticality+'</span>':''}</div>
        <div class="fac-resp-text">${r.response_text||'<em style="color:var(--muted)">No text submitted</em>'}</div>
      </div>`;
    }).join('');
  } catch {}
}

function ttStartFacPoll() {
  if (facPollTimer) clearInterval(facPollTimer);
  facPollTimer=setInterval(async ()=>{
    ttFacRefreshLobby();
    if (ttState&&ttState.view==='inject') ttFacRefreshResponses(ttState.currentInject);
    // If IC player triggered exercise start from their device, auto-advance
    if (ttState&&ttState.view==='commentary'&&ttState.sessionId) {
      try {
        const sess=await sb.tt.getSession(ttState.sessionId);
        if (sess&&sess.status==='active') { ttState.view='declaration'; ttRender(); }
      } catch {}
    }
  },5000);
}
function ttFacBeginExercise() {
  if (!ttState) return;
  ttState.view='declaration';
  ttRender();
}
function ttStopFacPoll() { if (facPollTimer) { clearInterval(facPollTimer); facPollTimer=null; } }

async function ttAddDemoPlayers() {
  if (!ttState||!ttState.sessionId) return;
  const demoNames=['Alice (Demo)','Bob (Demo)','Carol (Demo)','David (Demo)','Eve (Demo)'];
  const btn=document.getElementById('ttDemoBtn');
  if(btn) { btn.disabled=true; btn.textContent='Adding...'; }
  try {
    const existing=await sb.tt.getParticipants(ttState.sessionId);
    const takenRoles=existing.map(p=>p.role_id);
    let added=0;
    for (let i=0;i<TT_ROLES.length;i++) {
      const role=TT_ROLES[i];
      if (takenRoles.includes(role.id)) continue;
      await sb.tt.claimRole({session_id:ttState.sessionId,role_id:role.id,role_name:role.name,player_name:demoNames[i]});
      added++;
    }
    toast(`${added} demo player${added!==1?'s':''} added`,'#15803d');
    ttFacRefreshLobby();
    if(btn) { btn.disabled=false; btn.textContent='Add demo players'; }
  } catch(e) {
    toast('Demo fill failed: '+e.message,'#dc2626');
    if(btn) { btn.disabled=false; btn.textContent='Add demo players'; }
  }
}

async function mpIcStartExercise(sessionId) {
  const btn=document.getElementById('mpBeginBtn');
  if(btn){btn.disabled=true;btn.textContent='Starting…';}
  try {
    await sb.tt.updateSession(sessionId,{status:'active',updated_at:new Date().toISOString()});
    if(btn){btn.textContent='âœ“ Exercise started — facilitator will advance shortly…';}
  } catch(e) {
    if(btn){btn.disabled=false;btn.textContent='ðŸš€ Begin Exercise';}
    const err=document.createElement('div');
    err.style.cssText='text-align:center;font-size:12px;color:#fca5a5;margin-top:8px';
    err.textContent='Start failed: '+e.message;
    if(btn&&btn.parentNode) btn.parentNode.insertBefore(err,btn.nextSibling);
  }
}

const TT_OPTIONS = {
  ransom_phish:[
    {ic:[{label:'Declare P1',sub:'Issue P1 declaration now',v:'Declaring P1. Activating IRP, standing up the bridge, notifying exec team immediately.',pro:'Fast command structure',con:'May over-escalate if scope is small',ref:'NIST IR.1 - Incident Declaration'},{label:'Scope First',sub:'Triage 15 min before escalating',v:'Holding declaration. Asking IT to confirm spread before I escalate to exec leadership.',pro:'Avoids false-alarm fatigue',con:'Delay allows further encryption',ref:'NIST DE.AE-2 - Event Analysis'},{label:'Isolate & Declare',sub:'Contain hosts then declare P1',v:'Directing IT to isolate encrypted hosts immediately. Declaring P1 once isolation confirmed.',pro:'Containment starts while command spins up',con:'IT may resist without full authorization',ref:'NIST RS.MI-1 - Incident Mitigation'}],tl:[{label:'Kill the Network',sub:'Segment affected systems now',v:'Isolating all affected workstations from the network. Blocking lateral movement paths.',pro:'Stops spread fast',con:'Disrupts legitimate operations',ref:'NIST RS.MI-1'},{label:'Preserve Evidence',sub:'Image drives before isolating',v:'Capturing forensic images before isolating. Documenting chain of custody.',pro:'Preserves evidence for investigation',con:'Delay means ransomware spreads more',ref:'NIST RS.AN-1 - Forensic Analysis'},{label:'Check Backups',sub:'Verify backup integrity right now',v:'Pulling backup status for all encrypted systems. Checking last known-good snapshot timestamps.',pro:'Recovery timeline becomes clear immediately',con:'Does not stop current spread',ref:'NIST RC.RP-1 - Recovery Planning'}],cl:[{label:'Legal Hold',sub:'Issue legal hold on all logs',v:'Issuing immediate legal hold notice to IT and HR. Preserving all email, logs, and system artifacts.',pro:'Protects evidence for litigation/insurance',con:'Ops may push back on log freeze',ref:'NIST RS.CO-3 / eDiscovery standards'},{label:'Notify Carrier',sub:'Alert cyber insurance carrier now',v:'Notifying cyber insurer within the required window. Briefing on known scope. Requesting breach coach.',pro:'Preserves coverage, activates carrier resources',con:'Carrier gains involvement in decisions',ref:'Cyber policy SLA - typically 24-72hr'},{label:'Assess Exfil',sub:'Determine if data was exfiltrated',v:'Instructing IR team to determine whether data was exfiltrated before encryption. Affects notification obligations.',pro:'Guides regulatory notification decisions',con:'Investigation takes time; clock may be running',ref:'State breach statutes, HIPAA Â§164.410'}],lc:[{label:'Draft Hold Stmt',sub:'Prepare internal comms now',v:'Drafting holding statement for internal teams: what we know, what we&#39;re doing, what to do if media calls.',pro:'Controls narrative, reduces rumour',con:'Premature detail can leak to press',ref:'NIST RS.CO-1 - Communications'},{label:'Media Blackout',sub:'Implement strict media silence',v:'Instructing all staff: zero external communication. All inquiries routed to comms team only.',pro:'Prevents premature disclosure',con:'Employees may post on social anyway',ref:'NIST RS.CO-2'},{label:'Exec Brief',sub:'Brief CEO and board on status',v:'Preparing 5-minute exec brief: confirmed scope, current actions, decision points needed from leadership.',pro:'Leadership has accurate picture to authorise resources',con:'May trigger premature board-level panic',ref:'SEC Cybersecurity Disclosure guidance'}],es:[{label:'Engage IR Firm',sub:'Activate retainer IR firm now',v:'Calling the retainer IR firm. Providing initial scope. Requesting on-site team within 4 hours.',pro:'Expert resources mobilised fast',con:'Cost and coordination overhead',ref:'NIST RS.CO-3, retainer SLA'},{label:'Vendor Audit',sub:'Review all third-party access logs',v:'Pulling all third-party vendor access logs. Checking whether any vendor RDP/VPN could be the vector.',pro:'Identifies potential source and liability',con:'Diverts attention from containment',ref:'NIST ID.SC - Supply Chain Risk'},{label:'Exec Notification',sub:'Notify C-suite and ownership',v:'Escalating to CEO and ownership. Providing known scope and identifying resource decisions needed.',pro:'Enables executive resource authorisation',con:'Creates pressure that can rush decisions',ref:'NIST RS.CO-1'}]},
    {ic:[{label:'No Negotiation',sub:'Maintain no-pay stance firmly',v:'Setting official position: we do not negotiate with threat actors. Backup recovery is the path forward.',pro:'No incentive for future attacks',con:'Recovery may be slow or incomplete',ref:'FBI guidance - paying does not guarantee decryption'},{label:'FBI Notification',sub:'Notify FBI and CISA now',v:'Filing IC3 complaint and notifying CISA. Requesting FBI threat intel on this ransomware variant.',pro:'Law enforcement intel; potential known decryptor',con:'May require sharing evidence with LE',ref:'NIST RS.CO-5, 18 U.S.C. Â§1030'},{label:'Recovery Timeline',sub:'Get IT recovery estimate in 2 hrs',v:'Requiring IT to produce realistic recovery-from-backup timeline within 2 hours. Making BCP decisions based on that.',pro:'Drives resolution, stops decision paralysis',con:'Timeline may be optimistic',ref:'NIST RC.RP-1'}],tl:[{label:'Variant ID',sub:'Identify the ransomware variant',v:'Submitting ransom note and samples to ID Ransomware. Checking for a known free decryptor.',pro:'May find free decryptor - saves cost',con:'Takes time; known variants often lack decryptors',ref:'No More Ransom Project'},{label:'Restore Backup',sub:'Begin clean restore now',v:'Initiating restore of encrypted servers from last verified clean backup. Building rebuild checklist.',pro:'Direct path to recovery',con:'Backup may be stale; restore takes hours',ref:'NIST RC.RP-1'},{label:'Threat Hunt',sub:'Hunt for attacker persistence',v:'Running threat hunt across all endpoints for C2 beacons, persistence, and lateral movement. Can&#39;t rebuild until attacker is out.',pro:'Avoids re-infection of restored systems',con:'Takes time; delays recovery start',ref:'MITRE ATT&CK TA0003 - Persistence'}],cl:[{label:'OFAC Check',sub:'Verify ransom recipient not sanctioned',v:'Checking OFAC SDN list against known threat actor affiliation. Paying a sanctioned entity is a federal offense.',pro:'Avoids federal sanctions violation',con:'OFAC lookup takes time; attribution uncertain',ref:'OFAC FAQ 901, Treasury guidance Mar 2021'},{label:'Coverage Review',sub:'Confirm ransomware sublimits',v:'Reviewing policy for ransomware sublimits, waiting periods, and approval requirements for any potential payment.',pro:'Ensures payment is covered if authorised',con:'Carrier may require pre-approval',ref:'Cyber insurance policy terms'},{label:'Notification Clock',sub:'Assess state notification triggers',v:'Assessing whether encrypted PII triggers notification obligations even without confirmed exfiltration.',pro:'Gets ahead of notification deadlines',con:'Premature notification before scope is known',ref:'State breach notification laws, CCPA, NY SHIELD'}],lc:[{label:'Staff FAQ',sub:'Publish internal FAQ for employees',v:'Drafting and distributing staff FAQ: what happened, what we&#39;re doing, what employees should and should not do.',pro:'Reduces misinformation, keeps staff calm',con:'Detail may be over-disclosed',ref:'NIST RS.CO-1'},{label:'Stakeholder Brief',sub:'Brief key customers directly',v:'Identifying top-tier customers who need direct outreach. Preparing individualised brief for each.',pro:'Maintains trust with key relationships',con:'Premature notification before scope confirmed',ref:'NIST RS.CO-2'},{label:'Media Draft',sub:'Prepare reactive press statement',v:'Drafting reactive media statement in case story leaks externally. Holding - not issuing proactively.',pro:'Ready to respond without scrambling',con:'None if held in reserve',ref:'Crisis comms best practice'}],es:[{label:'BCP Activate',sub:'Activate manual fallback procedures',v:'Activating business continuity plan. Switching to manual processes where digital systems are unavailable.',pro:'Keeps operations running during outage',con:'Manual processes are slow and error-prone',ref:'NIST RC.IM-1'},{label:'Insurer Loop',sub:'Keep insurer updated on decisions',v:'Briefing insurer on recovery timeline and restoration approach. Getting pre-approval for IR costs above threshold.',pro:'Ensures costs are covered',con:'Slows some operational decisions',ref:'Cyber insurance policy SLA'},{label:'Exec Auth Spend',sub:'Secure exec auth for recovery spend',v:'Getting exec authorisation for emergency IT spend: new hardware, IR firm fees, potential cloud rebuild costs.',pro:'Removes financial bottlenecks',con:'Executive involvement can slow ops decisions',ref:'NIST RS.CO-1'}]},
    {ic:[{label:'No Comment',sub:'Maintain strict information blackout',v:'Official position: no comment to threat actor or public on any exfiltration claim. Consulting legal before any response.',pro:'Avoids any admission of liability',con:'Silence may embolden the attacker',ref:'FBI guidance - don&#39;t engage with threat actors'},{label:'Breach Counsel',sub:'Engage external breach counsel',v:'Activating breach counsel immediately. Dual extortion changes the legal calculus significantly.',pro:'Expert legal guidance on dual-extortion',con:'Cost; adds a decision-making layer',ref:'Attorney-client privilege, breach response protocols'},{label:'Data Inventory',sub:'Establish what data they may have',v:'Directing IR team to identify data types potentially exfiltrated: volume, classification, and affected individuals.',pro:'Informs notification and negotiation posture',con:'Time consuming during active incident',ref:'NIST ID.AM-5 - Data Classification'}],tl:[{label:'Exfil Evidence',sub:'Collect evidence of data theft',v:'Running DLP and SIEM queries for data staging or exfiltration activity prior to encryption. Documenting all findings.',pro:'Establishes exfiltration scope for legal',con:'May lack full visibility into older activity',ref:'MITRE ATT&CK TA0010 - Exfiltration'},{label:'Dark Web Watch',sub:'Monitor dark web for our data',v:'Engaging threat intel service to monitor dark web for our data appearing for sale or publication.',pro:'Early warning if data is published',con:'Reactive, not preventive',ref:'Threat intelligence - dark web monitoring'},{label:'Network Rebuild',sub:'Accelerate clean network rebuild',v:'Prioritising clean rebuild to evict attacker. Every hour in-network is another exfiltration opportunity.',pro:'Removes exfiltration capability',con:'Rushed rebuild may miss persistence mechanisms',ref:'NIST RS.MI-2 - Incident Mitigation'}],cl:[{label:'Dual Extortion',sub:'Legal strategy for dual extortion',v:'Advising no payment without board and carrier approval. Preparing for mandatory notification if exfiltration confirmed.',pro:'Establishes defensible decision trail',con:'Rigid stance may increase data exposure risk',ref:'ABA Cyber Task Force guidelines'},{label:'Reg Notice Prep',sub:'Draft regulatory notifications now',v:'Preparing draft notifications for relevant regulators. Ready to file within required windows once scope confirmed.',pro:'Gets ahead of notification deadlines',con:'Premature filing if scope still uncertain',ref:'HIPAA Â§164.410, FTC Health Breach Notification'},{label:'Ransom Legal Memo',sub:'Analyse legality of potential payment',v:'Conducting OFAC/Treasury analysis. Consulting breach counsel on risk calculus of payment vs. non-payment.',pro:'Makes any payment decision defensible',con:'Analysis takes time',ref:'OFAC ransomware advisory Oct 2020'}],lc:[{label:'Reactive Comms',sub:'Prep comms if data goes public',v:'Drafting reactive communications package ready to deploy if/when threat actor publishes data externally.',pro:'Ready to respond immediately to a data leak',con:'None if held in reserve',ref:'Crisis comms - reactive hold strategy'},{label:'Regulator Brief',sub:'Proactively brief key regulators',v:'Making proactive outreach to key regulators to brief them before media or public discovery.',pro:'Establishes goodwill with regulators',con:'Starts notification clock and creates formal record',ref:'NIST RS.CO-3'},{label:'ISAC Alert',sub:'Share threat intel via ISAC',v:'Sharing sanitised threat intel via the appropriate ISAC to warn industry peers of the threat actor TTPs.',pro:'Protects the broader industry ecosystem',con:'Sensitive info may spread beyond intended audience',ref:'FS-ISAC / H-ISAC guidance'}],es:[{label:'Claim File',sub:'Formally open insurance claim',v:'Filing formal cyber insurance claim. Dual extortion may trigger extortion coverage rider.',pro:'Starts the claim clock, unlocks additional resources',con:'Increases carrier involvement in decisions',ref:'Cyber policy - extortion coverage rider'},{label:'Board Decision',sub:'Brief board on pay vs. no-pay',v:'Preparing board decision brief on dual extortion: pay, rebuild, or hybrid. Covering legal, financial, and reputational factors.',pro:'Board has facts to make informed decision',con:'Board may make wrong call under pressure',ref:'NIST RS.CO-1 - Executive Communications'},{label:'Recovery Budget',sub:'Authorise emergency recovery spend',v:'Authorising emergency budget for rapid rebuild: new hardware, additional IR resources, cloud migration if needed.',pro:'Speeds recovery, reduces threat actor leverage',con:'Expensive; may set a precedent',ref:'NIST RC.IM-2'}]},
    {ic:[{label:'AAR Schedule',sub:'Schedule After Action Review',v:'Scheduling formal AAR for 5 business days post-recovery. All core team members required to attend.',pro:'Captures lessons while details are fresh',con:'Team is exhausted; quality may suffer',ref:'NIST RC.IM-1 - Recovery Improvements'},{label:'RCA Mandate',sub:'Mandate root cause analysis',v:'Directing IT to produce RCA identifying initial infection vector, dwell time, and all lateral movement paths.',pro:'Identifies specific control gaps',con:'IT may minimise findings to avoid blame',ref:'NIST ID.RA-3 - Risk Assessment'},{label:'Security Spend',sub:'Authorise post-incident improvements',v:'Approving emergency budget for: EDR deployment, backup hardening, phishing simulation, and MFA rollout.',pro:'Addresses known gaps immediately',con:'Rushed changes can introduce new vulnerabilities',ref:'NIST PR.IP-10 - Response/Recovery Plans'}],tl:[{label:'Rebuild Verify',sub:'Verify clean rebuild before go-live',v:'Requiring IT to produce written verification that all restored systems are clean and hardened before reconnecting.',pro:'Prevents re-infection on restored systems',con:'Delays go-live by hours',ref:'NIST RC.RP-1'},{label:'Pen Test',sub:'Commission post-incident pen test',v:'Commissioning an external penetration test within 30 days to validate that the infection vector is fully closed.',pro:'Independent verification of control effectiveness',con:'Cost; takes weeks to schedule',ref:'NIST PR.IP-10'},{label:'Backup Hardening',sub:'Harden backup architecture',v:'Designing immutable/air-gapped backup architecture to prevent future encryption of backup sets.',pro:'Dramatically improves ransomware resilience',con:'Takes weeks to fully implement',ref:'NIST PR.IP-4 - Backups'}],cl:[{label:'Notification File',sub:'File all required notifications',v:'Filing breach notifications with all applicable regulators and affected individuals within required windows.',pro:'Legal compliance',con:'Notifications may trigger regulatory investigation',ref:'State statutes, HIPAA, GDPR Art. 33/34'},{label:'Lessons to Policy',sub:'Update IRP from lessons learned',v:'Updating the Incident Response Plan to reflect gaps identified in this incident. Assigning owners for each improvement.',pro:'IRP improves for next event',con:'Time-consuming; easy to deprioritise post-recovery',ref:'NIST PR.IP-9 - Response Plans'},{label:'Insurance Debrief',sub:'Complete insurer post-incident debrief',v:'Scheduling required post-incident debrief with insurer. Providing all documentation they need to close the claim.',pro:'Closes the claim and preserves relationship',con:'Carrier findings may affect future premiums',ref:'Cyber insurance claim process'}],lc:[{label:'Staff Training',sub:'Launch phishing awareness campaign',v:'Commissioning updated phishing simulation and training campaign targeting the specific lure used in this incident.',pro:'Addresses root human factor',con:'Training fatigue if done too soon',ref:'NIST PR.AT-1 - User Awareness'},{label:'Media Close',sub:'Issue public close-out statement',v:'Issuing brief public statement that the incident has been contained and systems restored. Transparent but not detailed.',pro:'Closes the news cycle',con:'Invites follow-up questions',ref:'Crisis comms - incident close'},{label:'Exec Report',sub:'Deliver post-incident exec report',v:'Delivering written post-incident report to board and ownership: timeline, impact, root cause, and remediation roadmap.',pro:'Board oversight fulfilled',con:'Findings create a record',ref:'SEC/board governance guidance'}],es:[{label:'Vendor Review',sub:'Review and harden vendor access',v:'Auditing all third-party vendor access: removing unused credentials, implementing least-privilege, adding MFA.',pro:'Closes a common initial access vector',con:'Takes time to coordinate with vendors',ref:'NIST ID.SC - Supply Chain Risk'},{label:'IR Retainer Review',sub:'Review and update IR retainer',v:'Reviewing IR firm retainer terms: SLA, scope, and cost. Ensuring retainer is right-sized for current risk profile.',pro:'Faster response in future incidents',con:'Cost of upgraded retainer',ref:'NIST RS.CO-3'},{label:'Insurance Review',sub:'Review cyber policy for gaps',v:'Working with broker to review policy: sublimits, waiting periods, and coverage for newly identified risk scenarios.',pro:'Closes coverage gaps',con:'Potential premium increase',ref:'Cyber insurance policy review'}]}
  ],
  bec_wire:[
    {ic:[{label:'Hold the Wire',sub:'Stop any pending transfer now',v:'Immediately contacting accounts payable and the bank to place a hold on any pending transfer requests.',pro:'Stops financial loss before it occurs',con:'Transfer may already be processed',ref:'FinCEN guidance on BEC'},{label:'Verify the CEO',sub:'Confirm request via out-of-band call',v:'Calling the CEO directly on a known phone number to verify the wire request. Never reply-all to the email.',pro:'Definitively confirms fraud with minimal delay',con:'CEO may be unavailable',ref:'FBI IC3 BEC guidance'},{label:'Preserve Evidence',sub:'Screenshot and preserve the email',v:'Preserving the fraudulent email headers, timestamps, and display name. Notifying IT to image the mailbox.',pro:'Intact evidence chain for investigation',con:'Takes time while wire may be pending',ref:'NIST RS.AN-1'}],tl:[{label:'Email Forensics',sub:'Analyse email headers for origin',v:'Pulling full email headers to identify the sending server, reply-to address, and spoofing indicators.',pro:'Reveals attack method and scope',con:'Takes time; transfer window closing',ref:'Email forensics best practice'},{label:'Mailbox Audit',sub:'Check all mailboxes for compromise',v:'Auditing Microsoft 365 / Google Workspace sign-in logs for anomalous access to executive mailboxes.',pro:'Identifies whether mailbox is compromised',con:'Scope creep during urgent window',ref:'Microsoft Secure Score / Azure AD logs'},{label:'Block Sender',sub:'Block the spoofed domain now',v:'Blocking the spoofed sending domain at email gateway. Alerting all staff to disregard similar requests.',pro:'Stops additional BEC attempts today',con:'Attacker will rotate to new domain',ref:'NIST PR.PT-3 - Access Control'}],cl:[{label:'Internal Alert',sub:'Alert finance and AP team',v:'Issuing immediate alert to all finance and AP staff: do not process wire requests without verbal confirmation.',pro:'Prevents additional fraudulent transfers',con:'Alert fatigue if over-used',ref:'NIST RS.CO-1'},{label:'Policy Review',sub:'Review wire approval policy',v:'Reviewing current wire transfer policy for dual-authorisation requirements and out-of-band verification gaps.',pro:'Identifies the control gap that was exploited',con:'Doesn&#39;t stop current incident',ref:'NIST PR.IP-9 - Response Plans'},{label:'Carrier Notice',sub:'Notify cyber insurer of potential BEC',v:'Notifying cyber insurer of a potential BEC event. Requesting breach coach and coverage confirmation.',pro:'Activates coverage before loss is confirmed',con:'Carrier involvement in decisions',ref:'Cyber policy - social engineering coverage'}],lc:[{label:'Exec Comms',sub:'Brief CFO and CEO directly',v:'Briefing CFO and CEO in person or by secure call on the suspected fraud. Aligning on comms posture.',pro:'Leadership aligned before story spreads',con:'May create premature alarm',ref:'NIST RS.CO-1'},{label:'Media Silence',sub:'Implement strict media blackout',v:'Instructing all staff that there is zero external communication. All queries route to comms lead only.',pro:'Controls narrative while facts are gathered',con:'Employees may speculate on social media',ref:'NIST RS.CO-2'},{label:'Internal Brief',sub:'Draft internal holding statement',v:'Drafting brief internal comms: suspected fraud attempt, investigation underway, no customer impact confirmed.',pro:'Keeps staff informed without over-disclosing',con:'Detail could leak externally',ref:'Crisis comms best practice'}],es:[{label:'Bank Contact',sub:'Call bank fraud team directly',v:'Calling the bank&#39;s commercial fraud hotline. Reporting the BEC attempt and requesting any transfer be flagged.',pro:'Direct path to stopping or recalling wire',con:'Bank may require account holder contact',ref:'FinCEN, bank fraud SOP'},{label:'Fraud Report',sub:'File FBI IC3 report now',v:'Filing IC3 complaint immediately. BEC cases benefit from rapid reporting — funds may be recoverable in the wire window.',pro:'Enables possible SWIFT recall via FinCEN',con:'Reporting takes time',ref:'FBI IC3 BEC guidance'},{label:'AP Freeze',sub:'Freeze all pending AP activity',v:'Temporarily suspending all outbound wire activity above threshold until investigation is complete.',pro:'Prevents any additional loss',con:'Business disruption to AP operations',ref:'Internal controls best practice'}]},
    {ic:[{label:'Wire Recall',sub:'Invoke wire recall immediately',v:'Contacting our bank&#39;s fraud team to initiate a wire recall under the SWIFT gpi recall mechanism. Every minute counts.',pro:'Best chance of fund recovery in 24-hr window',con:'Success rate is low; banks vary',ref:'SWIFT gpi Recall, FinCEN FIN-2016-A003'},{label:'FBI Escalate',sub:'Escalate to FBI financial crimes',v:'Escalating IC3 report to FBI financial crimes unit. Providing wire details, timestamps, and destination account info.',pro:'LE may issue a hold via correspondent bank',con:'Coordination takes time',ref:'FBI IC3 BEC guidance'},{label:'Destination Bank',sub:'Contact destination bank directly',v:'Calling the destination bank&#39;s fraud team directly to flag the receiving account as fraudulent.',pro:'May freeze funds at destination',con:'Destination bank may be uncooperative',ref:'FinCEN, ABA fraud guidance'}],tl:[{label:'Transaction Log',sub:'Pull full wire transaction log',v:'Pulling complete wire transaction records: amount, beneficiary account, SWIFT codes, timestamps.',pro:'Provides all data needed for recall and LE',con:'Doesn&#39;t recover funds on its own',ref:'Internal finance controls'},{label:'Mailbox Sweep',sub:'Full compromise sweep of email',v:'Conducting full Microsoft 365 audit: inbox rules, forwarding rules, OAuth grants, and sign-in anomalies.',pro:'Finds persistence if mailbox was compromised',con:'Takes time; scope may be large',ref:'Microsoft Secure Score, Azure AD Sign-in Logs'},{label:'Password Reset',sub:'Force reset of potentially compromised accounts',v:'Forcing password resets and revoking active sessions on all potentially compromised executive accounts.',pro:'Closes attacker mailbox access',con:'Disrupts legitimate users temporarily',ref:'NIST PR.AC-1 - Identity Management'}],cl:[{label:'Insurance Claim',sub:'Open formal insurance claim',v:'Filing formal social engineering / funds transfer fraud claim with cyber insurer. Starting the loss documentation.',pro:'Activates coverage for wire loss',con:'Carrier involvement in recovery strategy',ref:'Cyber policy - funds transfer fraud rider'},{label:'Legal Hold',sub:'Issue legal hold for all evidence',v:'Issuing legal hold on all emails, wire records, and system logs related to the BEC event.',pro:'Preserves evidence for recovery litigation',con:'Operational overhead',ref:'eDiscovery standards, NIST RS.AN-1'},{label:'Notification Check',sub:'Assess customer notification duty',v:'Determining whether any customer accounts or data were affected, triggering notification obligations.',pro:'Stays ahead of regulatory requirements',con:'Premature if investigation ongoing',ref:'State breach notification statutes'}],lc:[{label:'Loss Notification',sub:'Notify board of confirmed loss',v:'Briefing board and ownership on confirmed wire loss: amount, circumstances, and recovery prospects.',pro:'Board has accurate picture for fiduciary duty',con:'Creates pressure on management',ref:'SEC, board governance guidance'},{label:'Media Draft',sub:'Prepare reactive media statement',v:'Drafting reactive holding statement in case the fraud becomes public. Not issuing proactively.',pro:'Ready to respond without scrambling',con:'None if held in reserve',ref:'Crisis comms best practice'},{label:'Staff Alert',sub:'Warn all staff of BEC pattern',v:'Issuing staff-wide alert about the specific BEC pattern used: sender spoofing, urgency language, wire request.',pro:'Prevents secondary fraud attempts',con:'Causes alarm; may over-sensitise',ref:'NIST PR.AT-1 - Awareness'}],es:[{label:'Correspondent Contact',sub:'Work bank to contact correspondent',v:'Working with our bank to contact the correspondent bank in the wire chain to flag the transaction.',pro:'Additional recovery pathway',con:'Slow; international banks vary in responsiveness',ref:'FinCEN, SWIFT correspondent banking'},{label:'Broker Engage',sub:'Engage broker for insurance coordination',v:'Looping in our broker to coordinate the social engineering claim. Ensuring all documentation requirements are met.',pro:'Expert claims navigation',con:'Adds a communication layer',ref:'Cyber insurance broker SOP'},{label:'Exec Brief Update',sub:'Provide updated recovery brief',v:'Providing updated brief to CEO/CFO: recovery status, LE engagement, insurer status, and expected timeline.',pro:'Leadership aligned on realistic expectations',con:'May trigger micromanagement of recovery',ref:'NIST RS.CO-1'}]},
    {ic:[{label:'Recall Escalate',sub:'Escalate recall via FinCEN',v:'Escalating wire recall via FinCEN&#39;s Financial Fraud Kill Chain. Providing all wire details and requesting emergency hold.',pro:'Highest-authority recall pathway',con:'Success depends on timing and destination country',ref:'FinCEN FIN-2016-A003'},{label:'Litigation Prep',sub:'Prepare for civil recovery action',v:'Consulting with litigation counsel on civil recovery options if wire recall fails: tracing funds, freezing assets.',pro:'Alternative recovery pathway if recall fails',con:'Costly and time-consuming',ref:'UCC Article 4A, civil recovery law'},{label:'Loss Acceptance',sub:'Accept loss and focus on controls',v:'If 24-hr recall window has passed, accepting loss and pivoting fully to control improvements and insurance claim.',pro:'Focuses team on what is actionable',con:'Loss is painful but definitive',ref:'Financial fraud risk management'}],tl:[{label:'Deep Forensics',sub:'Full mailbox and endpoint forensics',v:'Commissioning full forensic analysis: how attacker gained access, dwell time, whether other accounts were compromised.',pro:'Closes unknown attack vector',con:'Takes time; expensive',ref:'NIST RS.AN-1, email forensics'},{label:'MFA Enforce',sub:'Enforce MFA on all email accounts',v:'Mandating MFA on all Microsoft 365 / Google Workspace accounts. Blocking legacy auth protocols immediately.',pro:'Closes the most common mailbox compromise vector',con:'Short-term user disruption',ref:'NIST PR.AC-7 - Authenticators'},{label:'Wire Controls',sub:'Implement dual-auth wire controls',v:'Implementing dual-authorisation requirement for all wire transfers above threshold. No exceptions.',pro:'Prevents BEC class of attack going forward',con:'Slows AP operations',ref:'NIST PR.AC-4 - Access Permissions'}],cl:[{label:'Reg Assessment',sub:'Assess regulatory reporting duty',v:'Determining whether the wire fraud constitutes a material event requiring SEC disclosure or state reporting.',pro:'Stays ahead of regulatory requirements',con:'Premature disclosure before investigation complete',ref:'SEC material event guidance, state statutes'},{label:'Board Report',sub:'Deliver formal board loss report',v:'Delivering formal written report to board: fraud mechanics, confirmed loss, recovery status, and control failures.',pro:'Board oversight fulfilled; fiduciary duty met',con:'Creates a permanent record of the loss',ref:'Corporate governance requirements'},{label:'Insurer Docs',sub:'Submit full insurer documentation',v:'Compiling and submitting all required claim documentation: wire records, LE reports, forensic findings.',pro:'Maximises insurance recovery',con:'Extensive documentation burden',ref:'Cyber insurance claim requirements'}],lc:[{label:'Public Statement',sub:'Issue controlled public statement',v:'If story has leaked, issuing a brief, factual public statement acknowledging the incident and confirming investigation.',pro:'Controls narrative if story is already out',con:'Invites further media scrutiny',ref:'Crisis comms best practice'},{label:'Vendor Comms',sub:'Brief key vendors on BEC risk',v:'Alerting key vendors and suppliers to the BEC pattern. Establishing out-of-band verification protocols for payments.',pro:'Prevents vendor-side fraud in the same wave',con:'Creates some alarm',ref:'NIST PR.AT-2 - Privileged Users'},{label:'Training Launch',sub:'Launch BEC awareness training',v:'Commissioning targeted BEC awareness training for finance and executive teams immediately.',pro:'Addresses root human factor',con:'Training fatigue post-incident',ref:'NIST PR.AT-1 - User Awareness'}],es:[{label:'CFO Debrief',sub:'Debrief CFO on control failures',v:'Conducting private debrief with CFO on the specific control failures that enabled the fraud.',pro:'Ensures CFO owns the improvement roadmap',con:'Sensitive conversation',ref:'Internal audit / control review'},{label:'Recovery Status',sub:'Provide full recovery status update',v:'Providing complete recovery status to ownership: recall outcome, insurer status, LE status, and realistic expectations.',pro:'Transparency with ownership',con:'Painful if outlook is poor',ref:'NIST RS.CO-1'},{label:'Policy Update',sub:'Update AP and wire transfer policy',v:'Rewriting AP wire transfer policy to mandate verbal confirmation, dual-auth, and callback to known numbers only.',pro:'Closes the primary control gap',con:'Takes time to socialise and enforce',ref:'NIST PR.IP-9 - Response Plans'}]},
    {ic:[{label:'AAR Complete',sub:'Complete formal after-action review',v:'Facilitating AAR with all incident stakeholders. Documenting timeline, root cause, control failures, and improvement actions.',pro:'Permanent record of lessons learned',con:'Team exhaustion; may rush findings',ref:'NIST RC.IM-1'},{label:'Control Roadmap',sub:'Build prioritised control roadmap',v:'Prioritising control improvements: MFA, dual-auth, email filtering, and DMARC enforcement. Assigning owners and dates.',pro:'Clear accountability for each improvement',con:'Resource contention with other priorities',ref:'NIST PR.IP-9'},{label:'Insurance Close',sub:'Close insurance claim formally',v:'Finalising claim with insurer. Providing all supplemental documentation. Confirming recovery amount and payment timeline.',pro:'Maximises financial recovery',con:'Carrier may dispute elements',ref:'Cyber insurance claim close'}],tl:[{label:'DMARC Deploy',sub:'Deploy DMARC/DKIM/SPF controls',v:'Mandating IT to implement DMARC enforcement, DKIM signing, and SPF hardening on all company email domains.',pro:'Eliminates domain spoofing vector',con:'Implementation complexity for multi-domain orgs',ref:'RFC 7489 - DMARC, email authentication'},{label:'Email Gateway',sub:'Tune email gateway anti-spoofing',v:'Configuring email gateway to flag external emails that appear to be from internal executives.',pro:'Reduces BEC lure effectiveness',con:'Some legitimate mail may be flagged',ref:'Email security best practice'},{label:'Sim Exercise',sub:'Run BEC tabletop simulation',v:'Scheduling a BEC-specific tabletop exercise within 60 days to test new controls and train the team.',pro:'Validates control effectiveness',con:'Takes time to organise',ref:'NIST PR.IP-10 - Response/Recovery'}],cl:[{label:'Reg Filings',sub:'Complete all regulatory filings',v:'Filing all required regulatory notifications and disclosures. Confirming compliance with all applicable statutes.',pro:'Legal compliance',con:'May trigger regulatory follow-up',ref:'State statutes, SEC, FinCEN'},{label:'Legal Close',sub:'Close legal matters',v:'Working with counsel to close out any open legal matters: recovery litigation, insurance disputes, regulatory correspondence.',pro:'Clears legal uncertainty',con:'Legal matters take time',ref:'Legal risk management'},{label:'Policy Publish',sub:'Publish updated AP policy',v:'Publishing updated AP and wire transfer policy. Communicating to all relevant staff. Confirming acknowledgement.',pro:'Formalises new controls',con:'Socialisation takes time',ref:'Internal controls, NIST PR.IP-9'}],lc:[{label:'Board Close',sub:'Deliver board close-out report',v:'Delivering final board report: incident closed, losses confirmed, recovery summary, and forward control roadmap.',pro:'Board governance fulfilled',con:'Creates permanent record',ref:'Corporate governance'},{label:'Media Close',sub:'Issue final close-out statement',v:'If public disclosure was made, issuing final statement: incident resolved, controls enhanced, no further risk.',pro:'Closes news cycle',con:'May invite follow-up questions',ref:'Crisis comms close'},{label:'Staff Brief',sub:'Brief all staff on outcome',v:'Issuing brief all-staff communication: incident resolved, new procedures in place, what to do if they see something suspicious.',pro:'Keeps staff informed and engaged',con:'Could cause residual alarm',ref:'NIST PR.AT-1'}],es:[{label:'Vendor Confirm',sub:'Confirm vendor controls updated',v:'Following up with key vendors to confirm they have implemented out-of-band payment verification on their side.',pro:'Closes vendor-side risk',con:'Vendors may not comply quickly',ref:'NIST ID.SC - Supply Chain Risk'},{label:'IR Retainer',sub:'Review IR and legal retainers',v:'Reviewing IR firm and outside counsel retainers to ensure they are appropriately scoped for BEC-class events.',pro:'Faster response in future events',con:'Cost of enhanced retainers',ref:'NIST RS.CO-3'},{label:'Premium Review',sub:'Expect premium change; brief exec',v:'Briefing ownership that cyber insurance premium is likely to increase at renewal. Preparing justification for spend.',pro:'Prevents surprise at renewal',con:'Uncomfortable conversation',ref:'Cyber insurance renewal process'}]}
  ],
  overnight_vishing:[
    {ic:[{label:'Suspend Creds',sub:'Suspend PMS credentials now',v:'Immediately suspending PMS credentials shared with the caller. Forcing password reset for all night audit accounts.',pro:'Stops further access before damage spreads',con:'Disrupts night audit operations',ref:'NIST RS.MI-1 - Incident Mitigation'},{label:'Declare Incident',sub:'Declare P2 security incident',v:'Declaring P2 incident. Activating on-call security contact. Notifying GM and duty manager.',pro:'Formal incident response begins',con:'May over-escalate if scope is limited',ref:'NIST IR.1 - Incident Declaration'},{label:'Interview Audit',sub:'Debrief night audit staff now',v:'Conducting immediate debrief with night auditor: exact caller questions, information provided, time of call, and caller ID.',pro:'Captures perishable witness testimony',con:'Staff may minimise what they disclosed',ref:'NIST RS.AN-2 - Incident Analysis'}],tl:[{label:'PMS Access Log',sub:'Pull PMS access logs for the night',v:'Pulling PMS access logs for the past 12 hours. Looking for anomalous logins, guest record access, or reservation changes.',pro:'Establishes what the attacker actually accessed',con:'PMS logs may lack detail',ref:'NIST RS.AN-1 - Forensic Analysis'},{label:'Caller ID Trace',sub:'Trace the caller ID origin',v:'Capturing caller ID details and asking phone provider to pull call records. Spoofed numbers can sometimes be traced.',pro:'May identify attacker infrastructure',con:'Caller ID spoofing is trivial and often untraceable',ref:'NIST RS.AN-2'},{label:'PMS Audit',sub:'Full PMS permission audit',v:'Auditing all PMS user accounts: last login, permission levels, and whether any accounts were created overnight.',pro:'Finds any accounts the attacker may have created',con:'Takes time while investigation is active',ref:'NIST PR.AC-1 - Identity Management'}],cl:[{label:'Legal Hold',sub:'Issue legal hold on call logs',v:'Preserving all phone system logs, PMS access logs, and any CCTV footage for the overnight period.',pro:'Protects evidence chain',con:'Operational overhead',ref:'NIST RS.CO-3, eDiscovery standards'},{label:'Carrier Alert',sub:'Notify cyber insurance carrier',v:'Alerting cyber insurer of a potential vishing incident involving credential disclosure. Requesting breach coach.',pro:'Activates coverage; breach coach assigned',con:'Carrier involvement in decisions',ref:'Cyber policy notification SLA'},{label:'Notification Check',sub:'Assess guest notification requirement',v:'Determining whether any guest PII was accessed, which triggers notification obligations under applicable statutes.',pro:'Stays ahead of notification clock',con:'Premature if PMS log review ongoing',ref:'State breach notification statutes'}],lc:[{label:'GM Brief',sub:'Brief GM and property ownership',v:'Briefing GM and ownership on the vishing call: what was disclosed, current actions, and potential guest impact.',pro:'Leadership aligned on situation',con:'May create premature alarm',ref:'NIST RS.CO-1'},{label:'Media Hold',sub:'Implement strict media silence',v:'Instructing all staff: zero external communication. All inquiries route to GM or comms lead.',pro:'Controls narrative while facts are gathered',con:'Staff may discuss on social media',ref:'NIST RS.CO-2'},{label:'Guest Comms Draft',sub:'Draft holding statement for guests',v:'Drafting holding statement for potential guest notification: factual, calm, and focused on what we are doing.',pro:'Ready to deploy if notification is required',con:'Premature issuance before scope is known',ref:'Crisis comms best practice'}],es:[{label:'PMS Vendor',sub:'Alert PMS vendor of credential abuse',v:'Notifying the PMS vendor that credentials may have been obtained via vishing. Requesting log assistance.',pro:'Vendor may have additional audit capability',con:'Vendor responsiveness varies',ref:'NIST ID.SC - Third-Party Risk'},{label:'Chain Alert',sub:'Alert brand / chain security team',v:'Notifying the hotel brand or management company security team of the vishing pattern. Other properties may be targeted.',pro:'Protects sister properties',con:'Brand involvement may change incident ownership',ref:'Brand security / franchise agreement'},{label:'Exec Notification',sub:'Notify ownership and exec team',v:'Escalating to property ownership. Briefing on confirmed vishing event and potential PMS credential compromise.',pro:'Enables resource authorisation',con:'Creates pressure on GM and security',ref:'NIST RS.CO-1'}]},
    {ic:[{label:'Scope the Access',sub:'Determine what data was accessed',v:'Using PMS logs to identify every guest record, reservation, and card token the attacker accessed or queried.',pro:'Establishes precise notification scope',con:'PMS logs may be limited in granularity',ref:'NIST RS.AN-1 - Forensic Analysis'},{label:'Revoke All Sessions',sub:'Force PMS session revocation',v:'Forcing logout of all active PMS sessions and revoking all API tokens. Resetting credentials for all front-desk accounts.',pro:'Closes attacker access path',con:'Disrupts front-desk operations',ref:'NIST RS.MI-1'},{label:'Payment Token Audit',sub:'Check tokenised card data access',v:'Working with payment processor to determine whether tokenised card data or PANs were accessible via PMS.',pro:'Establishes PCI DSS breach scope',con:'Payment processor response may be slow',ref:'PCI DSS Req. 12.10 - Incident Response'}],tl:[{label:'Chain-wide Alert',sub:'Issue chain-wide property alert',v:'Alerting all properties in the management portfolio: vishing pattern in use, do not provide credentials by phone.',pro:'Prevents identical attack at sister properties',con:'May cause alarm across portfolio',ref:'Brand security / franchise agreement'},{label:'Forensic Image',sub:'Image PMS server and logs',v:'Engaging IR firm to forensically image the PMS server and all relevant log files for in-depth analysis.',pro:'Preserves evidence for full investigation',con:'Takes time; requires IR firm engagement',ref:'NIST RS.AN-1'},{label:'Access Timeline',sub:'Build attack access timeline',v:'Constructing a complete timeline: call time, credential use, records accessed, and session end.',pro:'Precise scope for notification and legal',con:'Requires full log correlation',ref:'MITRE ATT&CK TA0007 - Discovery'}],cl:[{label:'PCI Notification',sub:'Notify payment brands if card data at risk',v:'If card data was accessible, notifying card brands and acquirer within PCI DSS Req. 12.10 window.',pro:'Meets PCI DSS notification obligation',con:'Triggers PCI forensic investigation (PFI)',ref:'PCI DSS Req. 12.10'},{label:'Breach Analysis',sub:'Formal breach legal analysis',v:'Engaging breach counsel to analyse whether the PMS access constitutes a breach under applicable statutes.',pro:'Determines notification obligation precisely',con:'Takes time; notification clock may be running',ref:'State breach notification statutes'},{label:'Guest Impact List',sub:'Build list of impacted guests',v:'Compiling list of all guests whose records were accessed: name, contact, stay dates, and data elements exposed.',pro:'Prerequisite for notification letters',con:'Sensitive data; list must be secured',ref:'GDPR Art. 33/34, state breach statutes'}],lc:[{label:'Ownership Update',sub:'Update ownership on breach scope',v:'Providing updated brief to ownership: confirmed access scope, potential notification obligation, and estimated guest count.',pro:'Ownership aligned for resource and legal decisions',con:'May increase pressure',ref:'NIST RS.CO-1'},{label:'Brand Liaison',sub:'Coordinate with brand legal and comms',v:'Engaging brand legal and communications teams to coordinate any joint notification or media response.',pro:'Brand resources and expertise',con:'Brand may override property decisions',ref:'Brand franchise agreement'},{label:'Media Brief',sub:'Prepare reactive media brief',v:'Drafting reactive statement for if/when a guest or media outlet enquires about a data breach.',pro:'Ready to respond without scrambling',con:'None if held in reserve',ref:'Crisis comms best practice'}],es:[{label:'PFI Engage',sub:'Engage PCI Forensic Investigator',v:'If card data scope is confirmed, engaging a qualified PFI immediately as required by PCI DSS.',pro:'Meets PCI compliance requirement',con:'Expensive; disruptive to operations',ref:'PCI DSS Req. 12.10'},{label:'Insurer Update',sub:'Update insurer on confirmed breach scope',v:'Providing insurer with updated scope: records accessed, guest count, and likely notification requirement.',pro:'Keeps claim active and accurate',con:'Carrier may adjust coverage position',ref:'Cyber insurance claim SOP'},{label:'Notification Draft',sub:'Draft guest notification letters',v:'Drafting guest notification letters for legal review. Tailoring content to jurisdiction requirements.',pro:'Ready to send once legal approves',con:'Premature if final scope not confirmed',ref:'State statutes, GDPR notification requirements'}]},
    {ic:[{label:'Freeze Fraudulent Res',sub:'Cancel fraudulent reservations',v:'Identifying and cancelling any reservations created or modified by the attacker. Flagging affected booking refs.',pro:'Prevents fraudulent check-in',con:'Staff must manually verify each booking',ref:'NIST RS.MI-2'},{label:'PMS Lockdown',sub:'Implement PMS emergency controls',v:'Enforcing MFA for all PMS access. Restricting remote access to PMS to known IP ranges only.',pro:'Closes the vishing credential vector',con:'Disrupts remote front-desk access',ref:'NIST PR.AC-7 - Authenticators'},{label:'Verify All Res',sub:'Manual verification of upcoming arrivals',v:'Initiating manual call-back to all guests with upcoming reservations to verify booking details.',pro:'Identifies tampered bookings before arrival',con:'Labour-intensive; guest experience impact',ref:'Hospitality operations best practice'}],tl:[{label:'Reservation Audit',sub:'Full audit of reservation changes',v:'Pulling change log for all reservations modified in the attack window. Identifying and reverting unauthorised changes.',pro:'Restores reservation data integrity',con:'PMS change logs may lack detail',ref:'NIST RS.AN-1'},{label:'Front Desk Alert',sub:'Brief all front desk staff',v:'Conducting shift briefing: do not accept phone requests to change reservations or payment details without manager callback.',pro:'Prevents social engineering of front desk',con:'Shift change means message must be repeated',ref:'Security awareness training'},{label:'Channel Manager',sub:'Audit OTA channel manager',v:'Checking the channel manager (OTA connections) for unauthorised rate or availability changes originating from the attacker.',pro:'Identifies revenue manipulation',con:'Channel manager logs may be limited',ref:'Revenue management / OTA security'}],cl:[{label:'Legal Review',sub:'Legal review of notification package',v:'Submitting draft notification letters and breach scope to legal for final review and sign-off.',pro:'Ensures legally compliant notifications',con:'Legal review takes time',ref:'State statutes, GDPR Art. 34'},{label:'Regulator Notice',sub:'File regulator notification',v:'Filing notification with applicable regulators (state AG, DPA under GDPR) within the required statutory window.',pro:'Legal compliance',con:'Triggers regulatory inquiry',ref:'State breach statutes, GDPR Art. 33'},{label:'Payment Review',sub:'Review any fraudulent charges',v:'Checking guest folios for any fraudulent charges or upgrades applied by the attacker via the PMS.',pro:'Identifies financial fraud in addition to data breach',con:'Takes time to review all impacted folios',ref:'PCI DSS, hospitality fraud controls'}],lc:[{label:'Guest Notification',sub:'Send approved guest notifications',v:'Sending approved notification letters/emails to all confirmed impacted guests. Providing contact details for questions.',pro:'Meets legal notification obligation',con:'May generate press coverage',ref:'State statutes, GDPR Art. 34'},{label:'PR Brief',sub:'Brief brand PR team',v:'Briefing the brand PR and communications team on the notification. Coordinating on any joint statement.',pro:'Consistent messaging across brand',con:'Brand may take control of messaging',ref:'Brand franchise agreement'},{label:'Media Response',sub:'Issue media response if queried',v:'If contacted by media, providing brief factual statement: incident identified, guests notified, enhanced controls in place.',pro:'Controls narrative',con:'Invites follow-up questions',ref:'Crisis comms best practice'}],es:[{label:'Fraud Monitoring',sub:'Monitor guest accounts for fraud',v:'Setting up monitoring for fraud complaints from notified guests: card misuse, identity theft, or phishing follow-up.',pro:'Early detection of downstream fraud',con:'Labour-intensive to maintain',ref:'Consumer protection best practice'},{label:'Regulatory Liaison',sub:'Engage regulator proactively',v:'If GDPR applies, proactively engaging the relevant DPA to manage the investigation cooperatively.',pro:'Demonstrates good faith; may reduce fines',con:'Opens regulatory dialogue',ref:'GDPR Art. 58 - Supervisory Authority Powers'},{label:'Insurer Coordination',sub:'Coordinate notification costs with insurer',v:'Confirming all notification costs (postage, credit monitoring, call centre) are pre-approved by insurer for reimbursement.',pro:'Maximises insurance recovery',con:'Carrier may dispute certain costs',ref:'Cyber insurance claim - notification expense coverage'}]},
    {ic:[{label:'Control Overhaul',sub:'Redesign PMS authentication',v:'Mandating MFA on all PMS accounts, eliminating phone-based password resets, and implementing IP allowlisting.',pro:'Closes the specific vishing vector',con:'Change management required',ref:'NIST PR.AC-7, PCI DSS Req. 8'},{label:'Vishing Training',sub:'Run vishing awareness training',v:'Commissioning vishing-specific training for all front-desk, reservations, and night audit staff.',pro:'Addresses root human factor',con:'Training fatigue if done poorly',ref:'NIST PR.AT-1 - User Awareness'},{label:'AAR Facilitate',sub:'Facilitate full after-action review',v:'Running AAR with all stakeholders: timeline, control failures, guest impact, and improvement owners.',pro:'Permanent lessons-learned record',con:'Team fatigue; may rush',ref:'NIST RC.IM-1'}],tl:[{label:'PMS Hardening',sub:'Full PMS hardening assessment',v:'Commissioning a PMS security assessment: authentication, audit logging, API security, and remote access controls.',pro:'Comprehensive view of PMS risk posture',con:'Takes weeks; cost',ref:'PCI DSS Req. 6, hospitality security standards'},{label:'Chain Debrief',sub:'Share lessons with chain security',v:'Sharing full incident report (sanitised) with brand / chain security team for portfolio-wide learning.',pro:'Prevents identical incident chain-wide',con:'Sensitive information shared with brand',ref:'Brand security / franchise agreement'},{label:'Backup Verify',sub:'Verify PMS backup and recovery',v:'Testing PMS backup and restore capability. Ensuring clean backups predate the incident.',pro:'Recovery assurance for future incidents',con:'Takes time to test properly',ref:'NIST RC.RP-1'}],cl:[{label:'Notification Close',sub:'Confirm all notifications sent',v:'Confirming all required guest and regulatory notifications have been sent. Archiving proof of notification.',pro:'Legal compliance documented',con:'Administrative overhead',ref:'State statutes, GDPR recordkeeping'},{label:'Reg Response',sub:'Respond to regulatory enquiries',v:'Responding promptly to any regulatory requests for information. Providing all required documentation.',pro:'Cooperative engagement may reduce penalties',con:'Ongoing resource demand',ref:'GDPR Art. 58, state regulatory response'},{label:'Insurance Close',sub:'Close the insurance claim',v:'Submitting final claim documentation to insurer. Confirming reimbursement for notification, IR, and legal costs.',pro:'Maximises financial recovery',con:'Carrier may dispute line items',ref:'Cyber insurance claim close'}],lc:[{label:'Media Close',sub:'Issue post-incident statement if needed',v:'If story received media coverage, issuing brief statement: incident resolved, all obligations met, security enhanced.',pro:'Closes the news cycle',con:'Invites follow-on questions',ref:'Crisis comms close'},{label:'Guest Redress',sub:'Offer affected guests redress',v:'Providing impacted guests with identity monitoring and a goodwill gesture (e.g. loyalty points, rate discount).',pro:'Reduces litigation and reputational damage',con:'Cost',ref:'Consumer protection, brand loyalty best practice'},{label:'Policy Publish',sub:'Publish updated verification policy',v:'Publishing and distributing updated policy: no PMS credentials or guest data over the phone, ever.',pro:'Formalises the control change',con:'Requires re-training all new hires',ref:'NIST PR.IP-9'}],es:[{label:'Exec Report',sub:'Deliver board/ownership final report',v:'Delivering final written report to board and ownership: incident closed, cost summary, and forward control roadmap.',pro:'Board governance fulfilled',con:'Permanent record',ref:'Corporate governance'},{label:'Retainer Review',sub:'Review IR and legal retainers',v:'Reviewing whether current retainers adequately cover hospitality-specific threats like vishing.',pro:'Right-sizes future response capability',con:'Cost',ref:'NIST RS.CO-3'},{label:'Benchmark',sub:'Benchmark against peer incidents',v:'Reviewing public hospitality sector incident reports to benchmark response and identify any missed best practices.',pro:'External perspective on gaps',con:'Takes time',ref:'Hospitality ISAC, public breach disclosures'}]}
  ],
  pos_compromise:[
    {ic:[{label:'Swipe to Chip',sub:'Disable mag-stripe, force chip',v:'Disabling magnetic stripe acceptance on all POS terminals. Card-present transactions to chip/tap only.',pro:'Eliminates the memory scraper&#39;s data source',con:'May decline some cards; guest friction',ref:'PCI DSS Req. 12.10'},{label:'Declare P1',sub:'Declare P1 and activate IRP',v:'Declaring P1 incident. POS compromise with card fraud reports is a confirmed breach indicator. Activating IRP.',pro:'Formal response structure established',con:'May over-escalate if reports are unrelated',ref:'NIST IR.1'},{label:'Isolate POS',sub:'Network-segment POS systems',v:'Isolating all POS terminals from the corporate network. POS systems should be on their own VLAN.',pro:'Limits attacker lateral movement',con:'Disrupts payment processing',ref:'PCI DSS Req. 1 - Network Segmentation'}],tl:[{label:'Malware Hunt',sub:'Hunt for POS malware',v:'Deploying AV/EDR to all POS terminals. Looking for memory-scraping malware signatures.',pro:'Identifies which terminals are affected',con:'POS AV coverage is often poor',ref:'PCI DSS Req. 5, MITRE ATT&CK TA0001'},{label:'Log Correlation',sub:'Correlate POS logs with fraud timeline',v:'Pulling POS transaction logs and correlating with confirmed fraud dates from cardholders.',pro:'Establishes which terminals and dates are in scope',con:'Log retention may be insufficient',ref:'PCI DSS Req. 10 - Audit Logging'},{label:'P2PE Check',sub:'Verify P2PE scope of protection',v:'Confirming whether the POS terminals in scope use point-to-point encryption. P2PE removes PANs from POS memory.',pro:'If P2PE confirmed, scope is dramatically reduced',con:'P2PE solutions vary in implementation',ref:'PCI DSS P2PE standard'}],cl:[{label:'Acquirer Notify',sub:'Notify acquirer of suspected compromise',v:'Calling acquirer&#39;s fraud team. This is required by PCI DSS and starts the PFI clock.',pro:'Meets PCI DSS Req. 12.10 obligation',con:'PFI investigation is disruptive and expensive',ref:'PCI DSS Req. 12.10'},{label:'Legal Hold',sub:'Issue legal hold on all POS data',v:'Preserving all POS logs, transaction records, and network logs for the breach period.',pro:'Evidence preserved for PCI forensics and litigation',con:'Operational overhead',ref:'NIST RS.CO-3, PCI DSS PFI requirements'},{label:'Carrier Notify',sub:'Notify cyber insurer',v:'Notifying cyber insurer of a potential POS compromise. This is a PCI-scope event; specific riders may apply.',pro:'Activates coverage; carrier may have PCI resources',con:'Carrier involvement in PFI selection',ref:'Cyber policy - PCI/card brand coverage'}],lc:[{label:'GM Brief',sub:'Brief GM and ownership',v:'Briefing GM and ownership on confirmed card fraud reports linked to the property. Providing known facts and actions.',pro:'Leadership aligned for resource decisions',con:'May create alarm before scope is confirmed',ref:'NIST RS.CO-1'},{label:'Media Hold',sub:'Implement strict media silence',v:'Instructing all staff: zero external communication. Any card fraud inquiry routes to management only.',pro:'Controls narrative while facts are gathered',con:'Employees may discuss with guests',ref:'NIST RS.CO-2'},{label:'Guest Comms Draft',sub:'Draft guest notification holding statement',v:'Drafting guest-facing notification for legal review: factual, calm, recommending card monitoring.',pro:'Ready to deploy when legally required',con:'Premature issuance before scope confirmed',ref:'PCI DSS, state breach notification'}],es:[{label:'PFI Engage',sub:'Engage a qualified PFI',v:'Pre-authorising engagement of a PCI Forensic Investigator. Card brands will require this.',pro:'Meets PCI mandatory requirement',con:'Expensive; disruptive to operations',ref:'PCI DSS Req. 12.10, card brand rules'},{label:'Brand Alert',sub:'Notify card brands',v:'Notifying Visa/Mastercard/AmEx via acquirer that a compromise is suspected. Card brands drive the PFI requirement.',pro:'Legal obligation; brands may issue emergency re-issuance',con:'Card brand rules are strict',ref:'Visa / Mastercard Operating Regulations'},{label:'Exec Auth',sub:'Authorise emergency response spend',v:'Securing exec authorisation for emergency spend: PFI fees, forensic tools, potential POS replacement.',pro:'Removes financial bottleneck',con:'Spend may be large',ref:'NIST RS.CO-1'}]},
    {ic:[{label:'Scope All Terminals',sub:'Determine all affected terminals',v:'Working with PFI to scope every POS terminal across the property. Identifying which were infected and for how long.',pro:'Establishes precise card-at-risk window',con:'Thorough scoping takes days',ref:'PCI DSS Req. 12.10, PFI scope definition'},{label:'Malware Analysis',sub:'Analyse the memory scraper',v:'Submitting the malware sample to PFI and threat intel service for analysis: capabilities, C2, exfiltration method.',pro:'Informs card-at-risk scope and attacker attribution',con:'Takes time; PFI engagement required',ref:'MITRE ATT&CK TA0009 - Collection'},{label:'Card-at-Risk List',sub:'Build card-at-risk list',v:'Building the list of all PANs transacted at affected terminals during the infection window.',pro:'Prerequisite for card brand notification and re-issuance',con:'Requires accurate POS logs',ref:'PCI DSS card brand notification rules'}],tl:[{label:'Replace POS',sub:'Replace all compromised terminals',v:'Taking all confirmed-infected terminals out of service. Deploying clean replacement hardware or software.',pro:'Definitively removes malware from operation',con:'Expensive; operationally disruptive',ref:'PCI DSS Req. 12.10'},{label:'Forensic Image',sub:'Image all affected POS terminals',v:'Forensically imaging all affected POS terminal storage before any remediation. Chain of custody documented.',pro:'Required by PFI; preserves evidence',con:'Cannot image and continue using terminal',ref:'PCI DSS PFI requirements'},{label:'Network Forensics',sub:'Full network traffic analysis',v:'Capturing and analysing network traffic for C2 communication, data exfiltration destination, and lateral movement.',pro:'Identifies how attacker maintained access and exfiltrated',con:'Requires full packet capture capability',ref:'MITRE ATT&CK TA0011 - C2'}],cl:[{label:'Card Brand Submission',sub:'Submit card-at-risk data to brands',v:'Submitting the PAN-at-risk list to Visa/Mastercard/AmEx for emergency re-issuance to affected cardholders.',pro:'Card brands notify their issuing banks; cards replaced',con:'Brands drive this process; timing varies',ref:'Visa/Mastercard/AmEx Operating Regulations'},{label:'PCI Notification',sub:'File all PCI DSS notifications',v:'Completing all required PCI DSS incident notifications: acquirer, card brands, and QSA.',pro:'Meets mandatory PCI notification obligations',con:'Opens formal PFI investigation',ref:'PCI DSS Req. 12.10'},{label:'Issuer Alert',sub:'Alert issuing banks directly',v:'Working with acquirer to alert issuing banks on the card-at-risk list so they can flag accounts for fraud monitoring.',pro:'Issuers can monitor for fraud in real time',con:'Process goes through card brands, not direct',ref:'Card brand operating rules'}],lc:[{label:'Guest Notification',sub:'Notify affected cardholders',v:'Once card-at-risk list and legal review complete, sending written notifications to affected cardholders.',pro:'Legal obligation under state statutes',con:'Must be coordinated with card brands',ref:'State breach notification statutes, PCI'},{label:'Regulatory Filing',sub:'File regulatory breach notifications',v:'Filing notifications with applicable state AGs and regulators within the statutory window.',pro:'Legal compliance',con:'Triggers potential regulatory investigation',ref:'State breach notification laws'},{label:'Brand Comms',sub:'Coordinate comms with brand',v:'Aligning with hotel brand/franchisor on joint or complementary guest communications.',pro:'Consistent messaging across the brand',con:'Brand may take control of narrative',ref:'Brand franchise / management agreement'}],es:[{label:'PFI Report',sub:'Review interim PFI report',v:'Reviewing PFI interim findings: infection vector, dwell time, affected systems, and control failures identified.',pro:'Informs remediation and regulatory response',con:'PFI findings are owned by acquirer',ref:'PCI DSS PFI process'},{label:'Insurer Coordinate',sub:'Coordinate PCI costs with insurer',v:'Confirming PFI fees, notification costs, and card replacement liability with insurer. Getting pre-approval.',pro:'Maximises insurance recovery',con:'Carrier may dispute PCI fines',ref:'Cyber insurance - PCI coverage'},{label:'Exec Update',sub:'Update exec on breach scope',v:'Providing exec team with updated breach scope: terminals affected, card count, notification status, and estimated fines.',pro:'Leadership aligned for financial and reputational decisions',con:'Scope may still be evolving',ref:'NIST RS.CO-1'}]},
    {ic:[{label:'Full Remediation',sub:'Complete POS environment remediation',v:'Completing full remediation per PFI guidance: clean builds, hardened configurations, and network re-segmentation.',pro:'Closes all identified attack vectors',con:'Time-consuming; must follow PFI protocol',ref:'PCI DSS Req. 12.10'},{label:'PCI Scope Reduction',sub:'Implement P2PE to reduce PCI scope',v:'Deploying a validated P2PE solution on all POS terminals. Future compromise would not expose PANs.',pro:'Dramatically reduces PCI scope going forward',con:'Deployment takes weeks; cost',ref:'PCI DSS P2PE standard'},{label:'Vulnerability Scan',sub:'Run post-remediation PCI ASV scan',v:'Running ASV (Approved Scanning Vendor) external vulnerability scan post-remediation. Required to validate clean status.',pro:'Required step in PCI DSS compliance restoration',con:'Scan may find additional vulnerabilities',ref:'PCI DSS Req. 11 - Security Testing'}],tl:[{label:'Pen Test POS',sub:'Commission POS environment pen test',v:'Commissioning a PCI-scoped penetration test of the POS environment to validate remediation completeness.',pro:'Independent validation of clean state',con:'Takes weeks to schedule and complete',ref:'PCI DSS Req. 11.3 - Penetration Testing'},{label:'Segmentation Test',sub:'Test POS network segmentation',v:'Commissioning a segmentation test to confirm POS VLAN is properly isolated from the corporate network.',pro:'Validates a critical PCI control',con:'Requires specialist tester',ref:'PCI DSS Req. 11.4 - Network Testing'},{label:'IOC Hunt',sub:'Threat hunt for IOC persistence',v:'Running threat hunt across all in-scope systems using IOCs from the PFI malware analysis report.',pro:'Confirms no residual attacker presence',con:'Requires IOC list from PFI',ref:'MITRE ATT&CK TA0003 - Persistence'}],cl:[{label:'Card Fines',sub:'Assess and dispute card brand fines',v:'Reviewing card brand non-compliance fines. Working with acquirer and legal counsel to dispute excessive assessments.',pro:'Potentially reduces financial penalty',con:'Dispute process is lengthy',ref:'Visa/Mastercard fine and appeals process'},{label:'QSA Engage',sub:'Engage QSA for compliance restoration',v:'Engaging a PCI QSA to guide the path back to PCI DSS compliance and prepare for re-assessment.',pro:'Expert guidance on compliance restoration',con:'Cost; QSA engagement takes time',ref:'PCI DSS QSA requirements'},{label:'Insurance Claim',sub:'Submit full PCI insurance claim',v:'Submitting comprehensive claim: PFI fees, notification costs, card replacement liability, and brand fines.',pro:'Maximises financial recovery',con:'Carrier may dispute brand fines',ref:'Cyber insurance - PCI coverage'}],lc:[{label:'Breach Close',sub:'Confirm breach notification complete',v:'Confirming all state and federal breach notification obligations are met. Archiving proof of notification.',pro:'Legal compliance documented',con:'Administrative overhead',ref:'State statutes, PCI DSS'},{label:'Exec Report',sub:'Deliver exec breach cost report',v:'Delivering written report to exec: total cost of breach (PFI, fines, notification, card replacement), and lessons learned.',pro:'Ownership has full financial picture',con:'Painful if cost is large',ref:'Corporate governance'},{label:'Media Response',sub:'Respond to media enquiries',v:'If press coverage occurs, providing brief factual statement: incident contained, all obligations met, controls enhanced.',pro:'Controls narrative',con:'Invites follow-on questions',ref:'Crisis comms close'}],es:[{label:'Staff Training',sub:'Train all POS-adjacent staff',v:'Running POS security training: physical terminal inspection, skimmer detection, and social engineering awareness.',pro:'Addresses human detection gap',con:'Training fatigue',ref:'NIST PR.AT-1'},{label:'Vendor Review',sub:'Review POS vendor security',v:'Auditing the POS vendor&#39;s security practices and support access controls. If support access was the vector, addressing it.',pro:'Closes supply chain attack vector',con:'Vendor may resist scrutiny',ref:'PCI DSS Req. 12.8 - Third-Party Risk'},{label:'Brand Debrief',sub:'Debrief with brand security team',v:'Conducting post-incident debrief with brand security. Sharing PFI findings and remediation plan.',pro:'Brand may have additional resources',con:'Brand may apply pressure for controls',ref:'Brand franchise agreement'}]},
    {ic:[{label:'AAR Run',sub:'Run formal after-action review',v:'Facilitating AAR with all stakeholders. Producing a formal written report with improvement actions and owners.',pro:'Permanent lessons-learned record',con:'Team fatigue',ref:'NIST RC.IM-1'},{label:'PCI Compliance',sub:'Restore full PCI DSS compliance',v:'Completing all PCI DSS requirements: QSA assessment, ASV scan, pen test, and SAQ or ROC filing.',pro:'Restores formal PCI compliance',con:'Takes weeks to complete all requirements',ref:'PCI DSS compliance restoration'},{label:'P2PE Roadmap',sub:'Publish P2PE deployment roadmap',v:'Publishing a P2PE deployment roadmap for all properties in the portfolio. Assigning ownership and budget.',pro:'Systematic risk reduction across portfolio',con:'Significant cost',ref:'PCI DSS P2PE standard'}],tl:[{label:'Acquirer Debrief',sub:'Debrief with acquirer',v:'Conducting post-incident debrief with acquirer. Reviewing their satisfaction with the response and PFI outcome.',pro:'Preserves acquirer relationship',con:'Acquirer may apply additional monitoring',ref:'PCI DSS, acquirer relationship management'},{label:'QSA Assessment',sub:'Complete QSA re-assessment',v:'Completing the QSA-led PCI DSS re-assessment. Addressing any remaining findings.',pro:'Independent compliance validation',con:'Cost; time',ref:'PCI DSS re-certification'},{label:'Control Roadmap',sub:'Publish prioritised control roadmap',v:'Producing a prioritised roadmap of PCI and general security controls: P2PE, network segmentation, EDR, MFA.',pro:'Systematic security improvement',con:'Resource contention',ref:'NIST PR.IP-9'}],cl:[{label:'Fine Appeal',sub:'Complete card brand fine appeal',v:'Completing any outstanding appeals of card brand fines. Providing remediation evidence.',pro:'Potential cost reduction',con:'Lengthy process',ref:'Card brand fine appeals process'},{label:'Insurance Close',sub:'Close insurance claim',v:'Submitting final supplemental documentation. Confirming reimbursement and closing the claim file.',pro:'Maximises financial recovery',con:'Carrier disputes on fines',ref:'Cyber insurance claim close'},{label:'Staff Retrain',sub:'Complete mandatory POS security retraining',v:'Completing mandatory POS security retraining for all relevant staff. Documenting completion.',pro:'Addresses root human factor',con:'Training fatigue',ref:'PCI DSS Req. 12.6 - Security Awareness'}],lc:[{label:'Policy Update',sub:'Update POS security policy',v:'Publishing updated POS security policy: terminal inspection checklist, vendor access controls, incident reporting.',pro:'Formalises control improvements',con:'Socialisation required',ref:'PCI DSS, NIST PR.IP-9'},{label:'Vendor Contract',sub:'Update vendor contracts for security',v:'Revising POS vendor contracts to include security requirements, audit rights, and breach notification obligations.',pro:'Closes third-party accountability gap',con:'Legal negotiation takes time',ref:'NIST ID.SC, PCI DSS Req. 12.8'},{label:'Exec Report',sub:'Deliver final board report',v:'Delivering final report to board: incident closed, total cost, compliance restored, and forward roadmap.',pro:'Board governance fulfilled',con:'Permanent record',ref:'Corporate governance'}],es:[{label:'Reg Close',sub:'Close all regulatory matters',v:'Confirming all regulatory notifications complete and all follow-up requests responded to. Archiving all records.',pro:'Legal compliance documented',con:'Regulatory enquiries may take months',ref:'State statutes, PCI DSS'},{label:'Broker Review',sub:'Brief broker on premium impact',v:'Briefing insurance broker on claim outcome. Preparing for potential premium change at renewal.',pro:'Prevents surprise at renewal',con:'Uncomfortable conversation',ref:'Cyber insurance renewal process'},{label:'Peer Benchmark',sub:'Benchmark against POS incidents',v:'Reviewing other published hospitality POS breach outcomes to benchmark response quality and cost.',pro:'External perspective on gaps',con:'Takes time',ref:'PCI Security Standards Council resources'}]}
  ],
  msp_rma_pivot:[
    {ic:[{label:'Revoke RMM Access',sub:'Revoke all suspicious RMM sessions',v:'Revoking all active RMM sessions and re-authenticating all technician accounts. Blocking known-bad IPs.',pro:'Stops active attacker access',con:'Disrupts all managed client sessions',ref:'NIST RS.MI-1'},{label:'Declare P1',sub:'Declare P1 MSP-wide incident',v:'Declaring P1. A compromised RMM is a supply chain incident affecting all managed clients. Activating IRP.',pro:'Appropriate urgency for the threat level',con:'Large scope creates coordination challenge',ref:'NIST IR.1'},{label:'Client Alert',sub:'Issue immediate client security alert',v:'Notifying all managed clients of a security issue under investigation. Advising them to change credentials immediately.',pro:'Protects clients from further exploitation',con:'Creates client alarm before scope is known',ref:'NIST RS.CO-2'}],tl:[{label:'RMM Audit',sub:'Full audit of RMM activity logs',v:'Pulling all RMM activity logs for the past 90 days. Looking for anomalous automated jobs, script executions, or file transfers.',pro:'Establishes what the attacker did via RMM',con:'Log volume is large; analysis takes time',ref:'MITRE ATT&CK TA0008 - Lateral Movement'},{label:'Isolate RMM',sub:'Take RMM platform offline temporarily',v:'Taking the RMM platform offline or blocking all inbound connections while investigation proceeds.',pro:'Definitively stops attacker access via RMM',con:'Destroys MSP operational capability during outage',ref:'NIST RS.MI-1'},{label:'Vendor Contact',sub:'Contact RMM vendor security team',v:'Contacting the RMM vendor&#39;s security team immediately. They may have telemetry showing the compromise.',pro:'Vendor may have logs and indicators we lack',con:'Vendor responsiveness varies',ref:'Software supply chain incident response'}],cl:[{label:'Legal Hold',sub:'Issue legal hold on all RMM logs',v:'Preserving all RMM, ticketing, and endpoint logs for all clients.',pro:'Evidence chain preserved for litigation',con:'Operational overhead across all clients',ref:'NIST RS.CO-3'},{label:'Carrier Notify',sub:'Notify MSP cyber insurer',v:'Notifying insurer immediately. MSP supply chain incidents have large potential third-party liability.',pro:'Activates coverage; carrier assigns breach coach',con:'Carrier involvement in client notification decisions',ref:'Cyber policy - third-party liability coverage'},{label:'Client Contract Review',sub:'Review client contracts for notification duty',v:'Reviewing all client MSA/contracts for breach notification and incident response obligations.',pro:'Establishes notification timeline and liability',con:'Time-consuming across a large client base',ref:'Contract review best practice'}],lc:[{label:'Exec Brief',sub:'Brief MSP leadership team',v:'Briefing MSP owners and leadership on the RMM compromise. Providing known scope and client impact.',pro:'Leadership aligned for resource decisions',con:'May create panic',ref:'NIST RS.CO-1'},{label:'Media Blackout',sub:'Implement strict media silence',v:'Instructing all staff: zero external communication. Client enquiries route to account managers only.',pro:'Controls narrative during investigation',con:'Clients may share on LinkedIn',ref:'NIST RS.CO-2'},{label:'Client Liaison',sub:'Assign a liaison to each client',v:'Assigning a named account manager as the single point of contact for each client during the incident.',pro:'Consistent, controlled client communication',con:'Labour-intensive',ref:'NIST RS.CO-2 - Communications'}],es:[{label:'IR Firm',sub:'Engage specialist IR firm',v:'Activating IR retainer firm with MSP/supply chain experience. Requesting immediate scoping call.',pro:'Expert guidance for a complex multi-client incident',con:'Cost; coordination overhead',ref:'NIST RS.CO-3'},{label:'MFA Enforce',sub:'Enforce MFA on RMM immediately',v:'Mandating MFA on all RMM accounts as an emergency control, even before investigation is complete.',pro:'Closes the most common RMM takeover vector',con:'May lock out some technicians temporarily',ref:'NIST PR.AC-7'},{label:'Exec Notification',sub:'Notify MSP ownership of full impact',v:'Escalating full potential impact to MSP ownership: every managed client environment may be affected.',pro:'Enables appropriate resource authorisation',con:'Creates significant leadership pressure',ref:'NIST RS.CO-1'}]},
    {ic:[{label:'Client Scope Map',sub:'Map which clients were affected',v:'Using RMM logs to determine exactly which client environments the attacker accessed, and what actions were taken.',pro:'Precise scope drives notification and remediation priority',con:'Log analysis is time-consuming',ref:'MITRE ATT&CK TA0007 - Discovery'},{label:'IOC Distribute',sub:'Distribute IOCs to all clients',v:'Sharing IOCs from RMM forensics with all managed clients for immediate threat hunting on their own endpoints.',pro:'Rapid parallel threat hunting across portfolio',con:'Clients may not have capability to act on IOCs',ref:'Threat intelligence sharing, NIST RS.CO-5'},{label:'Threat Hunt All',sub:'Threat hunt all client environments',v:'Deploying threat hunt across all client environments using RMM to identify attacker persistence and lateral movement.',pro:'Finds attacker presence across entire portfolio',con:'Enormous scope; requires prioritisation',ref:'MITRE ATT&CK TA0003 - Persistence'}],tl:[{label:'Prioritise Clients',sub:'Triage clients by data sensitivity',v:'Prioritising IR response by client data sensitivity: healthcare, legal, and financial clients first.',pro:'Best use of limited IR capacity',con:'Deprioritised clients may have higher risk than apparent',ref:'NIST RS.AN-2 - Incident Analysis'},{label:'Persistence Hunt',sub:'Hunt for attacker persistence in RMM',v:'Checking RMM for backdoor accounts, scheduled tasks, and persistent scripts created by the attacker.',pro:'Ensures attacker is fully evicted from RMM',con:'Missed persistence means ongoing access',ref:'MITRE ATT&CK TA0003 - Persistence'},{label:'Endpoint Forensics',sub:'Forensic images of key client endpoints',v:'Engaging PFI/IR to image endpoints at the highest-risk client sites for full forensic analysis.',pro:'Deep forensic evidence for high-value clients',con:'Expensive; operationally disruptive to clients',ref:'NIST RS.AN-1'}],cl:[{label:'Client Notify',sub:'Issue formal client breach notification',v:'Issuing formal breach notification to all affected clients: what happened, what we know about their environment, and what we are doing.',pro:'Meets contractual and legal notification duty',con:'Clients may terminate; press may be notified',ref:'State breach statutes, client MSA'},{label:'Reg Assessment',sub:'Assess regulatory notification duties',v:'Determining which regulatory notifications are triggered: state statutes for MSP, and client-specific obligations (HIPAA, etc.).',pro:'Comprehensive regulatory compliance',con:'Complex multi-jurisdiction analysis',ref:'State statutes, HIPAA, GDPR'},{label:'Legal Triage',sub:'Legal triage of client liability',v:'Working with outside counsel to triage MSP liability exposure across all affected clients.',pro:'Establishes legal risk landscape',con:'Legal advice takes time',ref:'Professional liability / E&O insurance'}],lc:[{label:'E&O Claim',sub:'Notify E&O/professional liability insurer',v:'Notifying errors and omissions / professional liability insurer of the incident. MSP liability claims arise from client harm.',pro:'Activates E&O coverage',con:'E&O carrier involvement in communications',ref:'E&O insurance policy'},{label:'Client Comms',sub:'Coordinate client communications',v:'Coordinating all client communications through a single channel. Daily updates. Named contact for each client.',pro:'Controlled, consistent communication',con:'Labour-intensive at scale',ref:'NIST RS.CO-2'},{label:'Media Statement',sub:'Prepare reactive media statement',v:'Drafting reactive statement for if/when the incident is reported in the press or by a client.',pro:'Ready to respond without scrambling',con:'None if held in reserve',ref:'Crisis comms best practice'}],es:[
      {label:'Forensic Priority',sub:'Prioritise IR at highest-risk clients',v:'Directing IR resources to the highest-risk client environments first: healthcare, legal, and financial clients with the most sensitive data.',pro:'Best use of constrained IR capacity',con:'Lower-priority clients may be frustrated',ref:'NIST RS.AN-2'},
      {label:'Board Notification',sub:'Notify MSP board or ownership',v:'Escalating the confirmed exfiltration to MSP board or ownership. Full scope, client impact, and cost estimates to be presented.',pro:'Governance fulfilment; enables resource decisions',con:'Creates board pressure and scrutiny',ref:'NIST RS.CO-1'},
      {label:'Business Continuity',sub:'Activate BCP for managed client services',v:'Activating business continuity plan for managed services. Assessing which client services can continue, which must be suspended, and communicating timelines.',pro:'Manages client expectations and reduces churn risk',con:'BCP activation is operationally intensive',ref:'NIST RC.RP-1'}
    ]}
  ]
};


