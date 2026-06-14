// ============================================================
// AI TABLETOP — AI Governance Discussion Exercise Engine
// US data privacy & AI governance focus
// ============================================================

const AITT_NIST_LABELS = {
  'GV-1.1': 'AI Risk Policies & Accountabilities',
  'GV-1.4': 'Organizational AI Responsibilities',
  'GV-1.5': 'AI Inventory & Lifecycle Management',
  'GV-1.7': 'Human Oversight Requirements',
  'GV-2.1': 'AI Governance Documentation',
  'GV-4.1': 'AI Risk Culture & Awareness',
  'GV-6.1': 'Third-Party AI Risk Management',
  'MP-1.1': 'AI Use Case Categorization',
  'MP-1.2': 'AI Context & Environment Mapping',
  'MP-2.3': 'AI Bias & Fairness Assessment',
  'MP-3.5': 'AI Vulnerability Assessment',
  'MP-4.1': 'AI Risk Evaluation & Prioritization',
  'MP-5.1': 'AI Decision Transparency',
  'MS-2.1': 'AI Output Quality Testing',
  'MS-2.5': 'AI Hallucination & Error Detection',
  'MS-2.6': 'AI Monitoring & Anomaly Detection',
  'MS-4.1': 'AI Incident Documentation',
  'MG-1.3': 'AI Incident Response Plans',
  'MG-2.2': 'AI Containment & Recovery',
  'MG-4.1': 'AI Vendor Risk Management',
  'MG-4.2': 'AI Vendor Contract Requirements',
};

const AITT_ISO_LABELS = {
  '6.1.2': 'AI Risk Assessment Process',
  '7.4':   'Communication on AI Systems',
  '8.2':   'AI System Design & Development',
  '8.2.3': 'Data for AI Systems',
  '8.2.4': 'AI System Testing & Validation',
  '8.2.5': 'AI System Deployment',
  '8.3':   'AI System Operation & Monitoring',
  '8.4':   'AI System Documentation',
  '8.5':   'AI System Impact Assessment',
  '8.5.1': 'AI Performance Evaluation',
  '8.5.3': 'Human Oversight of AI Systems',
  '8.5.5': 'AI Incident Management',
  '8.6':   'Outsourced AI Components',
  '9.1':   'Monitoring, Measurement & Evaluation',
  '9.3':   'Management Review of AI Systems',
};

// US-focused regulatory notification checklist
const AITT_NOTIF_ITEMS = [
  { id: 'carrier',     label: 'Cyber insurance carrier notified',       detail: 'Most policies require notice within 24–72h of discovery. Triggers panel IR firm and activates coverage.', clock: '24–72h' },
  { id: 'counsel',     label: 'Outside cyber counsel engaged',           detail: 'Establishes legal privilege over all incident communications. Engage before any external notifications.', clock: 'ASAP' },
  { id: 'irfirm',      label: 'Forensic / IR firm activated',            detail: 'Via carrier panel preferred. Required if technical breach scope needs independent determination.', clock: 'ASAP' },
  { id: 'ftc',         label: 'FTC / sector regulator reviewed',         detail: 'FTC Act §5 covers unfair or deceptive AI practices. CFPB if financial data. FCC if telecoms. Assess by sector.', clock: 'Varies' },
  { id: 'stateag',     label: 'State AG / breach notification assessed', detail: 'All 50 states have breach notification laws. Timelines vary: CA 72h, TX 60 days. Assess by affected-resident state.', clock: '30–72h' },
  { id: 'ccpa',        label: 'CCPA / CPRA — California consumers',      detail: 'If CA residents\' personal information was exposed, evaluate CCPA/CPRA notification obligation and private right of action exposure.', clock: 'Expedient' },
  { id: 'hipaa',       label: 'HIPAA / HHS — if health data in scope',   detail: 'Covered entities: notify HHS and individuals within 60 days of discovery. Breaches affecting ≥500 state residents also require local media notice.', clock: '60 days' },
  { id: 'sec',         label: 'SEC disclosure — if public company',       detail: 'New SEC cybersecurity rules (2023): material incidents require Form 8-K within 4 business days of materiality determination.', clock: '4 bus. days' },
  { id: 'individuals', label: 'Affected individuals notification planned', detail: 'Required by most state breach notification laws where personal information is involved. Consider credit monitoring if SSN or financial data exposed.', clock: 'Per state law' },
  { id: 'le',          label: 'FBI / IC3 referral considered',            detail: 'Report to FBI field office or ic3.gov. Not mandatory but aids investigation and may support insurance claim documentation.', clock: 'Recommended' },
];

const AITT_SCENARIOS = [
  {
    id: 'AI-01', name: 'The Phantom Tool', tag: 'All Industries',
    duration: '~50 min', difficulty: 'Medium', injectCount: 4,
    summary: 'Unapproved browser AI extension active on 15 finance machines for 6 weeks. PII exposure confirmed. CFO machine affected.',
    setup: 'An employee discovers a browser extension called "WorkflowAI Pro" installed across 15 machines in the finance department. Nobody in IT approved it. Investigation reveals it has been active for 6 weeks and has access to clipboard contents and browser tabs.',
    injects: [
      'The extension\'s privacy policy routes data to servers in a foreign jurisdiction without adequate contractual data protections.',
      'Three employees confirm they used it to summarize financial reports, including one containing client PII.',
      'The vendor has no security contact and no SOC 2 or equivalent certification.',
      'One of the affected machines belongs to the CFO.',
    ],
    discussion: [
      'How do you scope the potential exposure and determine notification obligations under applicable state breach notification laws — and CCPA if California consumers are affected?',
      'How do you remove the extension without tipping off a potential insider threat?',
      'Where did the approved tool intake process fail?',
      'What evidence do you preserve and in what order?',
    ],
    nist: ['GV-1.5', 'GV-4.1', 'MP-1.1', 'MG-2.2'],
    iso: ['8.2', '8.3', '8.4'],
  },
  {
    id: 'AI-02', name: 'The Hallucination That Went Live', tag: 'Professional Services / Legal',
    duration: '~45 min', difficulty: 'Medium', injectCount: 4,
    summary: 'AI-drafted regulatory submission cites a non-existent regulation. Regulator flags it. Media picks it up before you can respond.',
    setup: 'Your legal team used an AI tool to draft a compliance submission to a regulator. The tool hallucinated a citation to a regulation that does not exist. The submission was filed without human review of the cited sources. The regulator flags it three weeks later.',
    injects: [
      'The regulator is now questioning the organization\'s due diligence practices broadly.',
      'The AI tool used was technically on the approved list but had no usage guidelines attached.',
      'The employee who filed it genuinely believed the output had been verified by a colleague.',
      'A trade publication reporter contacts your communications team for comment.',
    ],
    discussion: [
      'Where did the human-in-the-loop control fail and who is accountable?',
      'What is your crisis communications response in the first 4 hours?',
      'Does this trigger professional liability for the organization or the individual?',
      'How do you update policy and training without creating a scapegoat?',
    ],
    nist: ['GV-1.1', 'GV-4.1', 'MS-2.5', 'MG-1.3'],
    iso: ['7.4', '8.3', '8.5.1', '8.5.5'],
  },
  {
    id: 'AI-03', name: 'The Deepfake Executive', tag: 'All Industries',
    duration: '~60 min', difficulty: 'Hard', injectCount: 5,
    summary: 'AI voice clone of CEO authorizes urgent wire transfer. Transfer clears before IT is notified. Second attempt hits a different finance employee same afternoon.',
    setup: 'Your CFO receives a voicemail from what sounds exactly like the CEO requesting an urgent wire transfer before end of day. The number spoofs the CEO\'s mobile. A follow-up email arrives, well-written, containing accurate internal context details. The CFO initiates the transfer.',
    injects: [
      'The internal context in the email was sourced from a LinkedIn post and a board meeting summary found on a public file-sharing site.',
      'The transfer clears before IT is notified. The real CEO is traveling and unreachable for 90 minutes.',
      'A second attempt targets a different finance employee the same afternoon using the same voice clone.',
      'Your cyber insurer requires notification within 72 hours of discovery of a potential covered event.',
      'A forensic vendor confirms the voicemail was AI-generated. The wire destination is an overseas account that has already been emptied.',
    ],
    discussion: [
      'What is your out-of-band verification protocol for financial instructions and does one exist today?',
      'How did the attacker obtain accurate internal context and what does that tell you about your data exposure?',
      'What is your cyber insurance notification requirement and timeline?',
      'How do you preserve evidence while simultaneously stopping the second attempt?',
      'What do you tell the CFO and how do you handle internal communications?',
    ],
    nist: ['GV-1.1', 'GV-4.1', 'MG-1.3', 'MG-2.2', 'MP-5.1'],
    iso: ['7.4', '8.2.4', '8.3', '8.5'],
  },
  {
    id: 'AI-04', name: 'Vendor AI Gone Wrong', tag: 'HR / All Industries',
    duration: '~55 min', difficulty: 'Hard', injectCount: 5,
    summary: 'HR platform silently enables AI employee surveillance feature. Employment decisions challenged in three separate complaints. Legal action filed.',
    setup: 'Your HR platform vendor quietly rolled out an AI feature in their latest update that analyzes employee communications to flag disengagement risk. You did not know it was active. An employee files a complaint after being placed on a performance plan, alleging the decision was driven by AI surveillance they never consented to.',
    injects: [
      'The vendor\'s updated terms of service buried the AI feature in an appendix released four months ago.',
      'Your jurisdiction requires disclosure of automated decision-making affecting individuals.',
      'The employee has retained legal counsel and is referencing CCPA consent provisions and applicable state employment law.',
      'Three additional employees file similar complaints within 48 hours.',
      'The vendor\'s response is slow and their legal team is deflecting liability back to you as the data controller.',
    ],
    discussion: [
      'How does your vendor AI addendum — or lack of one — affect your liability exposure?',
      'What is your employee notification obligation and what does the timeline look like?',
      'How do you audit what the AI system actually flagged, when, and for whom?',
      'How does this affect your CCPA/CPRA compliance posture and your relationship with the FTC or state AG?',
      'What do you do with the HR decisions that were already made based on AI output?',
    ],
    nist: ['GV-1.5', 'GV-1.7', 'GV-6.1', 'MP-2.3', 'MG-4.1'],
    iso: ['7.4', '8.4', '8.5.3', '8.5.5'],
  },
  {
    id: 'AI-05', name: 'The Poisoned Prompt', tag: 'Technology / Retail',
    duration: '~45 min', difficulty: 'Medium', injectCount: 4,
    summary: 'Customer-facing chatbot vulnerable to prompt injection. 40+ exploitation events logged over 3 weeks. Security researcher goes public before you patch.',
    setup: 'Your organization uses an AI-powered customer service chatbot. A security researcher publicly posts that the bot can be manipulated via prompt injection to reveal internal pricing logic and support escalation procedures. The post goes semi-viral in a niche industry forum your competitors watch.',
    injects: [
      'Internal review confirms the vulnerability is real and has existed since deployment.',
      'Logs show 40+ external interactions that appear to have exploited it over the past three weeks.',
      'The chatbot vendor says a patch will take two weeks minimum and recommends taking the bot offline.',
      'A journalist from a trade publication contacts your communications team for comment within the hour.',
    ],
    discussion: [
      'Do you take the chatbot offline and absorb the customer service impact, or leave it running with monitoring?',
      'What is your disclosure obligation to customers whose interactions may have been exploited?',
      'How do you manage the vendor relationship and document their response timeline for future reference?',
      'Does your AI incident response playbook cover this scenario, and if not, what are you improvising?',
    ],
    nist: ['MP-3.5', 'MS-2.6', 'MG-1.3', 'MG-2.2', 'GV-4.1'],
    iso: ['8.2.4', '8.3', '9.1'],
  },
  {
    id: 'AI-06', name: 'The Shadow Agent', tag: 'Technology / SaaS',
    duration: '~45 min', difficulty: 'Medium', injectCount: 4,
    summary: 'Developer built an unsanctioned internal AI agent using company API keys. It has been handling real customer data for 3 months. No one in IT or legal knew it existed.',
    setup: 'A developer on the product team built an internal AI agent using the company\'s OpenAI API key to automate customer onboarding emails. It has been running in production for 3 months. Nobody in IT, legal, or security knew. A customer replies to an AI-generated email with sensitive financial information, treating it as a human conversation and requesting advice.',
    injects: [
      'The agent has sent over 2,400 emails to customers. None disclosed they were AI-generated.',
      'The OpenAI API key used has broad permissions and was not scoped to this use case.',
      'Customer financial data shared in the reply thread is stored in a personal developer Notion workspace with no access controls.',
      'The developer believed they were being innovative and had no idea this required review or approval.',
    ],
    discussion: [
      'What are your immediate containment actions and in what order do you execute them?',
      'What is your disclosure obligation to the 2,400+ customers who received undisclosed AI-generated communications?',
      'How does this affect your AI inventory and what does it tell you about your developer governance controls?',
      'How do you address the culture issue without punishing initiative in a way that drives the next shadow agent further underground?',
    ],
    nist: ['GV-1.1', 'GV-1.7', 'MP-1.1', 'MG-2.2', 'GV-4.1'],
    iso: ['7.4', '8.2', '8.3', '8.6'],
  },
  {
    id: 'AI-07', name: 'The Training Data Leak', tag: 'All Industries',
    duration: '~50 min', difficulty: 'Hard', injectCount: 4,
    summary: 'Vendor AI model was trained on your employee records from a forgotten 2021 data share. The model has since been licensed to three of your competitors.',
    setup: 'A vendor your company uses for HR screening discloses that their AI model was trained on a dataset that included your employee records, sourced from a data share agreement signed in 2021 that has since expired. The model has been commercially licensed to three other organizations, two of which are direct competitors.',
    injects: [
      'The 2021 agreement did not explicitly prohibit use of shared data for AI model training. Legal is reviewing whether this constitutes a breach.',
      'The vendor cannot confirm what specific employee data was used or whether it can be isolated and removed from the model.',
      'One competitor has already used the vendor\'s screening tool to evaluate candidates who previously worked for you.',
      'A former employee who was declined by the competitor contacts you asking if you had anything to do with the decision.',
    ],
    discussion: [
      'What are your obligations to current and former employees whose data may have been used without consent under applicable US state privacy laws?',
      'Can you compel the vendor to retrain or deprecate the model and what does that process look like legally?',
      'What does this mean for your vendor AI addendum and data use clauses going forward?',
      'How do you respond to the former employee and what does that response expose you to?',
    ],
    nist: ['GV-1.5', 'GV-6.1', 'MP-4.1', 'MG-4.1'],
    iso: ['8.2.3', '8.4', '8.5.3'],
  },
  {
    id: 'AI-08', name: 'The Regulator Arrives', tag: 'All Industries',
    duration: '~60 min', difficulty: 'Hard', injectCount: 5,
    summary: 'Privacy regulator demands a full audit of AI systems used in customer-facing decisions over the past 24 months. You have 10 business days. Your inventory is incomplete and two vendors are defunct.',
    setup: 'A privacy regulator contacts you requesting documentation of all AI systems used in decisions affecting customers or employees over the past 24 months. You have 10 business days to respond. Your AI inventory was started 6 months ago and does not cover the full period. Two of the vendors whose tools were in use during that time have since shut down.',
    injects: [
      'The regulator\'s request specifically includes AI features embedded in third-party SaaS tools, not just standalone AI systems.',
      'You discover that a customer-facing recommendation engine was running during the period that was never added to the inventory.',
      'One of the defunct vendors has no accessible data processing agreement or data deletion confirmation on file.',
      'Your legal team advises that incomplete responses carry greater regulatory risk than requesting an extension.',
      'A staff member who managed the now-defunct vendor relationship has left the organization and is unresponsive.',
    ],
    discussion: [
      'How do you triage 24 months of AI system usage with 10 business days and an incomplete inventory?',
      'What is your approach to the defunct vendors and the missing data deletion evidence?',
      'Do you request an extension and how do you frame that request to the regulator?',
      'What does this exercise tell you about the gaps in your AI governance program and what do you fix first?',
      'How do you prevent this scenario from recurring and what does that require you to build?',
    ],
    nist: ['GV-1.4', 'GV-2.1', 'MP-1.1', 'MP-1.2', 'MS-4.1'],
    iso: ['6.1.2', '8.2', '9.1', '9.3'],
  },
  {
    id: 'AI-09', name: 'The Model Update Nobody Noticed', tag: 'All Industries',
    duration: '~40 min', difficulty: 'Medium', injectCount: 3,
    summary: 'An approved AI writing tool silently pushed a model update. Post-update outputs shift in tone, occasionally reference a competitor favorably, and once included fabricated product claims. A client flags it before you do.',
    setup: 'Your organization uses an approved AI writing tool for marketing and client communications. The vendor pushed a silent model update three weeks ago. Since then, outputs have been measurably different in tone, occasionally reference a competitor favorably, and in one instance included fabricated product specifications that were sent to a client before review.',
    injects: [
      'The client who received the fabricated product specs is now questioning the accuracy of all materials you have sent them in the past 6 months.',
      'Your vendor contract does not include notification requirements for model updates or output quality SLAs.',
      'Internal review finds 14 additional documents that went out post-update without human review, across 6 different client accounts.',
    ],
    discussion: [
      'What is your immediate response to the client who received fabricated specifications?',
      'What do you do about the 14 other documents that may contain post-update content?',
      'What contractual remedies do you have against the vendor and what does your contract actually say?',
      'What does this scenario require you to add to your AI vendor governance and output review process?',
    ],
    nist: ['GV-1.5', 'MS-2.1', 'MS-2.5', 'MG-4.2'],
    iso: ['8.2.5', '8.4', '8.5.1', '9.1'],
  },
  {
    id: 'AI-10', name: 'The Insider Prompt', tag: 'All Industries',
    duration: '~45 min', difficulty: 'Medium', injectCount: 4,
    summary: 'An employee has been systematically prompt-engineering your internal AI assistant to surface HR records, salary bands, and performance notes accessible to the system but not intended for general staff.',
    setup: 'A manager in your finance team is discovered to have spent six weeks systematically crafting prompts to extract colleague performance reviews, salary band data, and HR case notes from your internal AI assistant. The system technically had access to this data through its underlying integrations. No access control prevented the queries. The manager has now shared some of what they found with two colleagues.',
    injects: [
      'The AI assistant vendor confirms the queries were within normal usage parameters. No system rules were broken.',
      'Three employees whose data was accessed without consent are now aware and are asking HR what happened.',
      'Legal advises that the manager\'s actions may constitute unauthorized access to personal data under applicable US state privacy law, regardless of the technical access pathway.',
      'You have no logging that captures what the AI assistant returned in its responses, only what was queried.',
    ],
    discussion: [
      'Is this a reportable data incident under applicable US state law and what triggers your notification obligation?',
      'What do you tell the three employees whose data was accessed and what are you obligated to tell them?',
      'What does this reveal about your AI assistant\'s permission model and data access controls?',
      'What disciplinary posture do you take toward the manager given the technical access was not blocked?',
    ],
    nist: ['GV-1.1', 'GV-1.7', 'MP-2.3', 'MS-2.6', 'MG-2.2'],
    iso: ['7.4', '8.2.4', '8.5.5', '9.1'],
  },
];

// ============================================================
// State
// ============================================================
let aittState = null;

function aittInit() {
  aittState = {
    view: 'setup',
    scenarioId: null,
    facilitatorName: '',
    currentInject: 0,
    injectNotes: {},
    discussionNotes: {},
    notifChecks: {},
    startTime: null,
    savedId: null,   // set when viewing a historical run
  };
}

function aittSnapshot() {
  if (!aittState) return;
  const fn = document.getElementById('aittFacName');
  if (fn) aittState.facilitatorName = fn.value;
  if (aittState.view === 'inject') {
    const idx = aittState.currentInject;
    const nt = document.getElementById(`aittNote_${idx}`);
    if (nt) aittState.injectNotes[idx] = nt.value;
  }
  if (aittState.view === 'discussion') {
    const sc = AITT_SCENARIOS.find(s => s.id === aittState.scenarioId);
    if (sc) sc.discussion.forEach((_, qi) => {
      const nt = document.getElementById(`aittDQ_${qi}`);
      if (nt) aittState.discussionNotes[qi] = nt.value;
    });
  }
}

function aittRender() {
  document.getElementById('mainContent').innerHTML = renderAiTabletop();
}

function renderAiTabletop() {
  if (!aittState) aittInit();
  switch (aittState.view) {
    case 'setup':      return aittRenderSetup();
    case 'briefing':   return aittRenderBriefing();
    case 'inject':     return aittRenderInject();
    case 'discussion': return aittRenderDiscussion();
    case 'notif':      return aittRenderNotif();
    case 'aar':        return aittRenderAAR();
    default:           return '<div class="card">Unknown view.</div>';
  }
}

function aittGoto(view) { aittSnapshot(); aittState.view = view; aittRender(); }

// ============================================================
// Shared header bar
// ============================================================
function aittHeaderBar() {
  const sc = AITT_SCENARIOS.find(s => s.id === aittState.scenarioId);
  return `<div class="card" style="padding:0.7rem 1rem;margin-bottom:0.5rem;display:flex;align-items:center;gap:10px">
    <span style="font-size:14px">🤖</span>
    <div style="flex:1;min-width:0">
      <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${sc ? escH(sc.id + ': ' + sc.name) : 'AI Tabletop'}</div>
      <div style="font-size:10px;color:var(--muted)">Facilitator: ${escH(aittState.facilitatorName || '—')}</div>
    </div>
    ${sc ? `<span class="badge b-cyan" style="flex-shrink:0">${sc.duration}</span>
    <span class="badge ${sc.difficulty === 'Hard' ? 'b-red' : 'b-amber'}" style="flex-shrink:0">${sc.difficulty}</span>` : ''}
  </div>`;
}

// Phase tracker
function aittPhaseBar(active) {
  const phases = ['Briefing', 'Injects', 'Discussion', 'US Regulatory', 'AAR'];
  const order  = { Briefing: 0, Injects: 1, Discussion: 2, 'US Regulatory': 3, AAR: 4 };
  const ai = order[active] ?? 0;
  return `<div class="nist-track">${phases.map((p, i) =>
    `<div class="nist-step ${p === active ? 'active' : i < ai ? 'complete' : ''}">${p}</div>`
  ).join('')}</div>`;
}

// ============================================================
// SETUP
// ============================================================
function aittRenderSetup() {
  return `${renderTierBanner()}
  <div style="font-size:17px;font-weight:700;margin-bottom:0.85rem">🤖 AI Tabletop Exercises</div>
  <div class="commentary-card">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan2);margin-bottom:6px">vCISO facilitator console</div>
    <div style="font-size:14px;color:#fff;font-weight:700;margin-bottom:0.4rem">AI Governance — Discussion Track</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.6">Ten AI-specific tabletop scenarios covering shadow AI, deepfakes, vendor AI risk, prompt injection, and regulatory response. US data privacy law focus (CCPA, FTC Act, state breach notification). Designed for cross-functional teams — no role assignment required. The facilitator guides the group through sequential information injects followed by structured discussion questions.</div>
  </div>
  <div class="card">
    <div class="card-title">New exercise</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div>
        <div class="field-lbl">Organisation</div>
        <input type="text" value="${currentOrg ? escH(currentOrg.name) : ''}" disabled style="opacity:0.6"/>
      </div>
      <div>
        <div class="field-lbl">Facilitator name</div>
        <input type="text" id="aittFacName" placeholder="e.g. Mark Abbott" value="${escH(aittState.facilitatorName || '')}"/>
      </div>
    </div>
    <div class="field-lbl" style="margin-bottom:6px">Select scenario</div>
    ${AITT_SCENARIOS.map(s => `
      <div class="mini-opt${aittState.scenarioId === s.id ? ' sel' : ''}" onclick="aittPickScenario('${s.id}')" style="align-items:flex-start;padding:10px 12px">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
            <span style="font-size:10px;font-weight:700;color:var(--cyan);letter-spacing:0.05em">${s.id}</span>
            <span style="font-size:13px;font-weight:700;color:var(--text)">${escH(s.name)}</span>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;line-height:1.4">${escH(s.summary)}</div>
          <div style="display:flex;gap:5px;margin-top:5px;flex-wrap:wrap">
            <span class="badge b-gray">${escH(s.tag)}</span>
            <span class="badge b-cyan">${s.duration}</span>
            <span class="badge ${s.difficulty === 'Hard' ? 'b-red' : 'b-amber'}">${s.difficulty}</span>
            <span class="badge b-purple">${s.injectCount} injects</span>
          </div>
        </div>
      </div>`).join('')}
    <div style="margin-top:14px;display:flex;justify-content:flex-end">
      <button class="btn btn-primary" onclick="aittLaunch()">Begin exercise →</button>
    </div>
  </div>
  ${aittRenderHistory()}`;

}

function aittRenderHistory() {
  const runs = ((orgAssessments[currentOrg?.id] || {})['ai_tabletop'] || []).slice().reverse();
  if (!runs.length) return '';
  return `<div class="card">
    <div class="card-title">Exercise history</div>
    ${runs.map(r => {
      const sc = AITT_SCENARIOS.find(s => s.id === r.answers?.scenarioId);
      const noteCount = Object.values(r.answers?.injectNotes || {}).filter(n => n?.trim()).length
                      + Object.values(r.answers?.discussionNotes || {}).filter(n => n?.trim()).length;
      const checked   = Object.values(r.answers?.notifChecks || {}).filter(Boolean).length;
      return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            <span class="badge b-cyan" style="margin-right:5px;font-size:9px">${escH(r.answers?.scenarioId || '—')}</span>${escH(r.answers?.scenarioName || 'Unknown scenario')}
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">
            ${escH(r.date)} · ${escH(r.conductedBy || '—')}
            ${noteCount ? ` · ${noteCount} note${noteCount !== 1 ? 's' : ''}` : ''}
            ${checked ? ` · ${checked}/${AITT_NOTIF_ITEMS.length} regulatory items` : ''}
          </div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="aittLoadRun('${r.id}')">View AAR</button>
        <button class="btn btn-red btn-sm" onclick="aittDeleteRun('${r.id}')">Delete</button>
      </div>`;
    }).join('')}
  </div>`;
}

function aittLoadRun(id) {
  const runs = (orgAssessments[currentOrg?.id] || {})['ai_tabletop'] || [];
  const r = runs.find(x => x.id === id);
  if (!r) return;
  const a = r.answers || {};
  aittState = {
    view: 'aar',
    scenarioId: a.scenarioId || null,
    facilitatorName: a.facilitator || r.conductedBy || '',
    currentInject: 0,
    injectNotes: a.injectNotes || {},
    discussionNotes: a.discussionNotes || {},
    notifChecks: a.notifChecks || {},
    startTime: null,
    savedId: id,
  };
  aittRender();
}

async function aittDeleteRun(id) {
  if (!confirm('Delete this exercise record? This cannot be undone.')) return;
  try {
    await sb.deleteAssessment(id);
    delete orgAssessments[currentOrg.id];
    await loadAssessments(currentOrg.id);
    toast('Exercise deleted', '#16a34a');
    aittRender();
  } catch (e) {
    toast('Delete failed — ' + e.message, '#dc2626');
  }
}

function aittPickScenario(id) { aittSnapshot(); aittState.scenarioId = id; aittRender(); }

function aittLaunch() {
  aittSnapshot();
  if (!currentOrg)                        { toast('Select an organisation first', '#dc2626'); return; }
  if (!aittState.scenarioId)              { toast('Select a scenario', '#dc2626'); return; }
  if (!aittState.facilitatorName.trim())  { toast('Enter your facilitator name', '#dc2626'); return; }
  aittState.startTime     = new Date().toISOString();
  aittState.currentInject = 0;
  aittState.injectNotes   = {};
  aittState.discussionNotes = {};
  aittState.notifChecks   = {};
  aittState.view = 'briefing';
  aittRender();
}

// ============================================================
// BRIEFING
// ============================================================
function aittRenderBriefing() {
  const sc = AITT_SCENARIOS.find(s => s.id === aittState.scenarioId);
  if (!sc) return aittRenderSetup();
  return `${aittHeaderBar()}${aittPhaseBar('Briefing')}
  <div class="commentary-card">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan2);margin-bottom:6px">vCISO facilitator note</div>
    <div style="font-size:13px;color:#fff;font-weight:700;margin-bottom:6px">Welcome to the AI Tabletop Exercise</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.8);line-height:1.65">This is a <strong style="color:var(--cyan2)">group discussion exercise</strong> — there are no wrong answers. The goal is to surface gaps in your AI governance posture, stress-test decision-making, and identify policy improvements before a real incident forces the question.<br><br>You will receive ${sc.injectCount} sequential information injects, followed by ${sc.discussion.length} structured discussion questions. After the discussion, the group reviews US regulatory obligations that may apply, then receives an After Action summary with NIST AI RMF and ISO 42001 references.</div>
  </div>
  <div class="card">
    <div class="card-title">Scenario setup — read aloud to the group</div>
    <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
      <span class="badge b-gray">${escH(sc.tag)}</span>
      <span class="badge b-cyan">${sc.duration}</span>
      <span class="badge ${sc.difficulty === 'Hard' ? 'b-red' : 'b-amber'}">${sc.difficulty}</span>
      <span class="badge b-purple">${sc.injectCount} injects</span>
    </div>
    <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:8px">${escH(sc.name)}</div>
    <div style="font-size:13px;color:var(--text);line-height:1.7;background:var(--bg);border-radius:8px;padding:14px 16px;border:1px solid var(--border)">${escH(sc.setup)}</div>
    <div style="margin-top:14px;display:flex;justify-content:space-between">
      <button class="btn btn-outline btn-sm" onclick="aittGoto('setup')">← Back</button>
      <button class="btn btn-primary" onclick="aittGoto('inject')">Begin injects →</button>
    </div>
  </div>`;
}

// ============================================================
// INJECTS
// ============================================================
function aittRenderInject() {
  const sc = AITT_SCENARIOS.find(s => s.id === aittState.scenarioId);
  if (!sc) return aittRenderSetup();
  const idx   = aittState.currentInject;
  const total = sc.injects.length;
  const isLast = idx === total - 1;
  return `${aittHeaderBar()}${aittPhaseBar('Injects')}
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.6rem">
    <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap">Inject ${idx + 1} of ${total}</div>
    <div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden">
      <div style="height:100%;width:${((idx + 1) / total) * 100}%;background:var(--cyan);border-radius:2px;transition:width 0.3s ease"></div>
    </div>
  </div>
  <div class="card" style="border-left:4px solid var(--cyan);margin-bottom:0.75rem">
    <div style="font-size:10px;font-weight:700;color:var(--cyan);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">🔔 New information — read aloud to the group</div>
    <div style="font-size:14px;color:var(--text);line-height:1.7;font-weight:500">${escH(sc.injects[idx])}</div>
  </div>
  <div class="card">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">Facilitator notes — inject ${idx + 1}</div>
    <textarea id="aittNote_${idx}" rows="3" style="font-size:12px" placeholder="Capture key points the group raised for this inject...">${escH(aittState.injectNotes[idx] || '')}</textarea>
    <div style="margin-top:10px;display:flex;justify-content:space-between">
      <button class="btn btn-outline btn-sm" onclick="aittPrevInject()">${idx === 0 ? '← Briefing' : '← Inject ' + idx}</button>
      <button class="btn btn-primary" onclick="aittNextInject()">${isLast ? 'Begin discussion →' : 'Inject ' + (idx + 2) + ' →'}</button>
    </div>
  </div>`;
}

function aittNextInject() {
  aittSnapshot();
  const sc = AITT_SCENARIOS.find(s => s.id === aittState.scenarioId);
  if (!sc) return;
  aittState.currentInject < sc.injects.length - 1
    ? (aittState.currentInject++, aittState.view = 'inject')
    : (aittState.view = 'discussion');
  aittRender();
}

function aittPrevInject() {
  aittSnapshot();
  aittState.currentInject > 0
    ? (aittState.currentInject--, aittState.view = 'inject')
    : (aittState.view = 'briefing');
  aittRender();
}

// ============================================================
// DISCUSSION
// ============================================================
function aittRenderDiscussion() {
  const sc = AITT_SCENARIOS.find(s => s.id === aittState.scenarioId);
  if (!sc) return aittRenderSetup();
  return `${aittHeaderBar()}${aittPhaseBar('Discussion')}
  <div class="commentary-card">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan2);margin-bottom:4px">Facilitator guide</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.8);line-height:1.6">Work through each question with the group. There is no single right answer — the goal is to expose assumptions, gaps, and decisions your organization would need to make. Capture key positions and agreed actions in the notes fields. Allow 5–8 minutes per question.</div>
  </div>
  <div class="card">
    <div class="card-title">Discussion questions</div>
    ${sc.discussion.map((q, qi) => `
      <div style="margin-bottom:14px;padding-bottom:14px;${qi < sc.discussion.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
        <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:7px">
          <div style="width:22px;height:22px;min-width:22px;border-radius:50%;background:var(--navy);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px">${qi + 1}</div>
          <div style="font-size:13px;font-weight:600;color:var(--text);line-height:1.5">${escH(q)}</div>
        </div>
        <div style="margin-left:30px">
          <textarea id="aittDQ_${qi}" rows="2" style="font-size:12px" placeholder="Group notes and agreed actions...">${escH(aittState.discussionNotes[qi] || '')}</textarea>
        </div>
      </div>`).join('')}
    <div style="display:flex;justify-content:space-between;margin-top:6px">
      <button class="btn btn-outline btn-sm" onclick="aittGoto('inject')">← Injects</button>
      <button class="btn btn-primary" onclick="aittGoto('notif')">US Regulatory →</button>
    </div>
  </div>`;
}

// ============================================================
// US REGULATORY CONSIDERATIONS
// ============================================================
function aittRenderNotif() {
  return `${aittHeaderBar()}${aittPhaseBar('US Regulatory')}
  <div class="commentary-card">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan2);margin-bottom:4px">US data privacy — regulatory considerations</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.8);line-height:1.6">Review the notification and regulatory obligations that may apply to this type of AI incident under US law. Which of these would be triggered by your scenario? Does your organization have the processes to meet these timelines? Check each item as the group confirms it is understood and applicable.</div>
  </div>
  <div class="card">
    <div class="card-title">Notification &amp; regulatory checklist</div>
    ${AITT_NOTIF_ITEMS.map(item => {
      const chk = !!aittState.notifChecks[item.id];
      return `<div onclick="aittToggleNotif('${item.id}')" style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);align-items:flex-start;cursor:pointer">
        <div style="width:20px;height:20px;min-width:20px;border-radius:4px;border:2px solid ${chk ? 'var(--cyan)' : 'var(--border)'};background:${chk ? 'var(--cyan)' : 'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
          ${chk ? '<span style="color:#fff;font-size:11px;line-height:1;font-weight:700">✓</span>' : ''}
        </div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:2px">${escH(item.label)}</div>
          <div style="font-size:11px;color:var(--muted);line-height:1.4">${escH(item.detail)}</div>
        </div>
        <span class="badge b-amber" style="flex-shrink:0;font-size:9px;white-space:nowrap;align-self:center">${escH(item.clock)}</span>
      </div>`;
    }).join('')}
    <div style="display:flex;justify-content:space-between;margin-top:12px">
      <button class="btn btn-outline btn-sm" onclick="aittGoto('discussion')">← Discussion</button>
      <button class="btn btn-primary" onclick="aittGoto('aar')">After Action →</button>
    </div>
  </div>`;
}

function aittToggleNotif(id) {
  aittState.notifChecks[id] = !aittState.notifChecks[id];
  aittRender();
}

// ============================================================
// AAR — After Action Review
// ============================================================
function aittRenderAAR() {
  const sc = AITT_SCENARIOS.find(s => s.id === aittState.scenarioId);
  if (!sc) return aittRenderSetup();
  const checkedCount   = AITT_NOTIF_ITEMS.filter(i => aittState.notifChecks[i.id]).length;
  const injectNoted    = sc.injects.filter((_, i) => (aittState.injectNotes[i] || '').trim()).length;
  const discussNoted   = sc.discussion.filter((_, i) => (aittState.discussionNotes[i] || '').trim()).length;
  const totalNotes     = injectNoted + discussNoted;
  const notifPct       = Math.round((checkedCount / AITT_NOTIF_ITEMS.length) * 100);
  const injectPct      = Math.round((injectNoted  / sc.injects.length) * 100);
  const discussPct     = Math.round((discussNoted / sc.discussion.length) * 100);
  const today          = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const statBox = (val, label, sub) => `
    <div style="text-align:center;padding:10px 8px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">
      <div style="font-size:20px;font-weight:800;color:var(--navy);line-height:1">${val}</div>
      <div style="font-size:10px;font-weight:700;color:var(--text);margin-top:3px">${label}</div>
      ${sub ? `<div style="font-size:9px;color:var(--muted);margin-top:1px">${sub}</div>` : ''}
    </div>`;

  return `${aittHeaderBar()}${aittPhaseBar('AAR')}

  <!-- STAT STRIP -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:0.75rem">
    ${statBox(sc.injectCount, 'Injects', 'delivered')}
    ${statBox(`${injectNoted}/${sc.injects.length}`, 'Inject notes', `${injectPct}% captured`)}
    ${statBox(`${discussNoted}/${sc.discussion.length}`, 'Discussion Qs', `${discussPct}% noted`)}
    ${statBox(`${checkedCount}/${AITT_NOTIF_ITEMS.length}`, 'Regulatory', `${notifPct}% reviewed`)}
  </div>

  <!-- REPORT HEADER -->
  <div class="card" style="border-top:4px solid var(--navy)">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">After Action Report — AI Governance Tabletop</div>
        <div style="font-size:18px;font-weight:800;color:var(--navy);margin-bottom:6px">${escH(sc.name)}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="badge b-cyan">${escH(sc.id)}</span>
          <span class="badge b-gray">${escH(sc.tag)}</span>
          <span class="badge ${sc.difficulty === 'Hard' ? 'b-red' : 'b-amber'}">${sc.difficulty}</span>
          <span class="badge b-purple">${sc.duration}</span>
        </div>
      </div>
      <div style="text-align:right;font-size:11px;color:var(--muted);white-space:nowrap">
        <div><strong style="color:var(--text)">${escH(currentOrg?.name || '—')}</strong></div>
        <div>Facilitator: ${escH(aittState.facilitatorName || '—')}</div>
        <div>${today}</div>
      </div>
    </div>
    <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
      <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">Scenario</div>
      <div style="font-size:13px;color:var(--text);line-height:1.65">${escH(sc.setup)}</div>
    </div>
  </div>

  <!-- INJECT RECAP -->
  <div class="card">
    <div class="card-title">Inject recap &amp; group notes</div>
    ${sc.injects.map((inj, i) => {
      const note = (aittState.injectNotes[i] || '').trim();
      return `<div style="margin-bottom:14px;padding-bottom:14px;${i < sc.injects.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <div style="width:22px;height:22px;min-width:22px;border-radius:50%;background:var(--navy);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center">${i + 1}</div>
          <div style="font-size:12px;color:var(--text);font-weight:500;line-height:1.5">${escH(inj)}</div>
        </div>
        ${note
          ? `<div style="margin-left:30px;font-size:12px;color:var(--text);background:var(--bg);border-radius:6px;padding:8px 10px;line-height:1.5;border-left:3px solid var(--cyan)">${escH(note)}</div>`
          : `<div style="margin-left:30px;font-size:11px;color:var(--muted);font-style:italic">No notes captured for this inject.</div>`}
      </div>`;
    }).join('')}
  </div>

  <!-- DISCUSSION OUTCOMES -->
  <div class="card">
    <div class="card-title">Discussion outcomes</div>
    ${sc.discussion.map((q, qi) => {
      const note = (aittState.discussionNotes[qi] || '').trim();
      return `<div style="margin-bottom:14px;padding-bottom:14px;${qi < sc.discussion.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
        <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:6px">
          <div style="width:22px;height:22px;min-width:22px;border-radius:50%;background:var(--cyan);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center">${qi + 1}</div>
          <div style="font-size:13px;font-weight:600;color:var(--text);line-height:1.5">${escH(q)}</div>
        </div>
        ${note
          ? `<div style="margin-left:30px;font-size:12px;color:var(--text);background:var(--bg);border-radius:6px;padding:8px 10px;line-height:1.5;border-left:3px solid var(--cyan)">${escH(note)}</div>`
          : `<div style="margin-left:30px;font-size:11px;color:var(--muted);font-style:italic">No notes captured for this question.</div>`}
      </div>`;
    }).join('')}
  </div>

  <!-- US REGULATORY REVIEW -->
  <div class="card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="card-title" style="margin:0">US regulatory items reviewed</div>
      <span class="badge ${checkedCount === AITT_NOTIF_ITEMS.length ? 'b-green' : checkedCount > 0 ? 'b-amber' : 'b-red'}">${checkedCount}/${AITT_NOTIF_ITEMS.length} confirmed</span>
    </div>
    ${AITT_NOTIF_ITEMS.map(item => {
      const chk = !!aittState.notifChecks[item.id];
      return `<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);align-items:flex-start">
        <div style="width:18px;height:18px;min-width:18px;border-radius:4px;border:2px solid ${chk ? 'var(--cyan)' : 'var(--border)'};background:${chk ? 'var(--cyan)' : 'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
          ${chk ? '<span style="color:#fff;font-size:10px;line-height:1;font-weight:700">✓</span>' : ''}
        </div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:700;color:${chk ? 'var(--text)' : 'var(--muted)'}">${escH(item.label)}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:1px;line-height:1.3">${escH(item.detail)}</div>
        </div>
        <span class="badge ${chk ? 'b-cyan' : 'b-gray'}" style="flex-shrink:0;font-size:9px;white-space:nowrap;align-self:center">${escH(item.clock)}</span>
      </div>`;
    }).join('')}
  </div>

  <!-- FRAMEWORK MAPPING -->
  <div class="card">
    <div class="card-title">Framework areas triggered</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">NIST AI RMF</div>
        ${sc.nist.map(ref => `<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:6px">
          <span class="badge b-cyan" style="font-size:9px;white-space:nowrap;flex-shrink:0">${ref}</span>
          <span style="font-size:11px;color:var(--muted);line-height:1.3">${AITT_NIST_LABELS[ref] || ref}</span>
        </div>`).join('')}
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">ISO/IEC 42001:2023</div>
        ${sc.iso.map(ref => `<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:6px">
          <span class="badge b-purple" style="font-size:9px;white-space:nowrap;flex-shrink:0">§${ref}</span>
          <span style="font-size:11px;color:var(--muted);line-height:1.3">${AITT_ISO_LABELS[ref] || ref}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- ACTIONS -->
  <div class="card">
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <button class="btn btn-cyan" onclick="aittCopyPrompt()">📋 Copy AAR prompt for Claude</button>
      ${aittState.savedId
        ? `<button class="btn btn-outline" onclick="aittInit();aittRender()">← Back to history</button>`
        : `<button class="btn btn-outline" onclick="aittSaveAndNew()">✓ Save &amp; run another</button>`}
    </div>
    <div style="font-size:11px;color:var(--muted);margin-top:8px;line-height:1.5">The AAR prompt bundles your scenario, captured inject notes, discussion takeaways, and framework references. Paste it into Claude to generate a formatted client-ready After Action Report.</div>
  </div>`;
}

// ============================================================
// Actions
// ============================================================
function aittCopyPrompt() {
  const sc = AITT_SCENARIOS.find(s => s.id === aittState.scenarioId);
  if (!sc) return;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const injectLines = sc.injects.map((inj, i) => {
    const n = (aittState.injectNotes[i] || '').trim();
    return `Inject ${i + 1}: "${inj}"${n ? `\nGroup notes: ${n}` : ''}`;
  }).join('\n\n');
  const discLines = sc.discussion.map((q, qi) => {
    const n = (aittState.discussionNotes[qi] || '').trim();
    return `Q${qi + 1}: ${q}${n ? `\nGroup notes: ${n}` : ''}`;
  }).join('\n\n');
  const notifReviewed = AITT_NOTIF_ITEMS.filter(i => aittState.notifChecks[i.id]).map(i => i.label).join(', ') || 'None checked';
  const prompt = `Generate a professional AI Governance Tabletop Exercise After Action Report.

Organisation: ${currentOrg ? currentOrg.name : '[Organisation]'}
Facilitator: ${aittState.facilitatorName}
Scenario: ${sc.id} — ${sc.name}
Industry/Audience: ${sc.tag}
Difficulty: ${sc.difficulty}
Date: ${today}

SCENARIO SETUP:
${sc.setup}

INJECTS AND GROUP NOTES:
${injectLines}

STRUCTURED DISCUSSION:
${discLines}

NIST AI RMF AREAS TRIGGERED: ${sc.nist.join(', ')}
ISO/IEC 42001:2023 CLAUSES TRIGGERED: ${sc.iso.join(', ')}
US REGULATORY ITEMS REVIEWED BY GROUP: ${notifReviewed}

Please generate an After Action Report that includes:
1. Executive Summary (2–3 paragraphs)
2. Key findings from the group discussion
3. Gaps and vulnerabilities identified during the exercise
4. Top 5 priority action items with suggested owners and timelines
5. NIST AI RMF and ISO/IEC 42001:2023 alignment notes
6. Applicable US regulatory considerations (CCPA/CPRA, FTC Act, state breach notification laws, HIPAA if health data, SEC if public company)
7. Recommended policy, process, and control improvements

Format professionally for client delivery. Use plain language. Avoid jargon.`;
  navigator.clipboard.writeText(prompt)
    .then(() => toast('AAR prompt copied to clipboard', '#16a34a'))
    .catch(() => toast('Clipboard access failed — try a different browser', '#dc2626'));
}

async function aittSaveAndNew() {
  const sc = AITT_SCENARIOS.find(s => s.id === aittState.scenarioId);
  if (sc && currentOrg) {
    try {
      await sb.saveAssessment({
        org_id: currentOrg.id,
        module: 'ai_tabletop',
        score: 0,
        answers: {
          scenarioId: sc.id,
          scenarioName: sc.name,
          facilitator: aittState.facilitatorName,
          injectNotes: aittState.injectNotes,
          discussionNotes: aittState.discussionNotes,
          notifChecks: aittState.notifChecks,
        },
        assessed_at: new Date().toISOString().slice(0, 10),
        conducted_by: aittState.facilitatorName,
      });
      auditLog('ai_tabletop_complete', 'exercise', sc.name, { scenarioId: sc.id, facilitator: aittState.facilitatorName });
      toast('Exercise saved', '#16a34a');
    } catch (e) {
      console.warn('AITT save failed', e);
      toast('Save failed — check Supabase connection', '#b45309');
    }
  }
  aittInit();
  aittRender();
}
