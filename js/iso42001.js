// ============================================================
// ISO/IEC 42001:2023 — AI Management System
// 53 items · 7 clauses (4–10) + Annex A controls
// ============================================================

const ISO42001_CONTROLS = [
  // ── CLAUSE 4: Context of the Organization ────────────────────────────────────
  { clause: '4', clauseName: 'Context of the Organization', id: '4.1',
    title: 'Understanding the organization and its context',
    desc: 'The organization shall determine external and internal issues relevant to its purpose and that affect its ability to achieve the intended outcome(s) of its AI management system, including issues arising from legal, regulatory, financial, operational, competitive, and societal contexts.' },
  { clause: '4', clauseName: 'Context of the Organization', id: '4.2',
    title: 'Understanding the needs and expectations of interested parties',
    desc: 'The organization shall determine relevant interested parties (customers, regulators, employees, suppliers, affected individuals) and their relevant requirements relating to the AI management system, including legal and regulatory obligations.' },
  { clause: '4', clauseName: 'Context of the Organization', id: '4.3',
    title: 'Determining the scope of the AI management system',
    desc: 'The organization shall determine the boundaries and applicability of the AI management system, considering external/internal issues, interested party requirements, and which AI systems the AIMS covers. Scope shall be documented.' },
  { clause: '4', clauseName: 'Context of the Organization', id: '4.4',
    title: 'AI management system',
    desc: 'The organization shall establish, implement, maintain, and continually improve an AI management system, including the processes needed and their interactions, in accordance with ISO 42001.' },

  // ── CLAUSE 5: Leadership ──────────────────────────────────────────────────────
  { clause: '5', clauseName: 'Leadership', id: '5.1',
    title: 'Leadership and commitment',
    desc: 'Top management shall demonstrate leadership and commitment to the AI management system by taking accountability for its effectiveness, ensuring the AI policy and objectives are established, and integrating AI management system requirements into business processes.' },
  { clause: '5', clauseName: 'Leadership', id: '5.2',
    title: 'AI policy',
    desc: 'Top management shall establish an AI policy that is appropriate to the organization\'s purpose, includes a commitment to satisfy applicable requirements and to continual improvement, and provides a framework for setting AI objectives. The policy shall be documented, communicated, and available to interested parties.' },
  { clause: '5', clauseName: 'Leadership', id: '5.3',
    title: 'Organizational roles, responsibilities and authorities',
    desc: 'Top management shall ensure that responsibilities and authorities for relevant roles are assigned, communicated, and understood. This includes assigning responsibility for ensuring the AI management system conforms to ISO 42001 and reporting on AI management system performance to top management.' },

  // ── CLAUSE 6: Planning ────────────────────────────────────────────────────────
  { clause: '6', clauseName: 'Planning', id: '6.1',
    title: 'Actions to address risks and opportunities',
    desc: 'The organization shall determine risks and opportunities relevant to the AI management system, plan actions to address them, and integrate and implement those actions. This includes AI risk assessments and risk treatment processes specific to AI systems.' },
  { clause: '6', clauseName: 'Planning', id: '6.2',
    title: 'AI objectives and planning to achieve them',
    desc: 'The organization shall establish AI objectives at relevant functions, levels, and processes. Objectives shall be measurable, monitored, communicated, updated as appropriate, and documented. Plans to achieve them shall address what, resources, who, when, and how results will be evaluated.' },

  // ── CLAUSE 7: Support ─────────────────────────────────────────────────────────
  { clause: '7', clauseName: 'Support', id: '7.1',
    title: 'Resources',
    desc: 'The organization shall determine and provide the resources needed for the establishment, implementation, maintenance, and continual improvement of the AI management system, including human resources, infrastructure, and financial resources.' },
  { clause: '7', clauseName: 'Support', id: '7.2',
    title: 'Competence',
    desc: 'The organization shall determine the necessary competence of persons doing work that affects AI management system performance, ensure those persons are competent, take actions to acquire necessary competence, and retain documented evidence of competence.' },
  { clause: '7', clauseName: 'Support', id: '7.3',
    title: 'Awareness',
    desc: 'Persons doing work under the organization\'s control shall be made aware of the AI policy, their contribution to the effectiveness of the AI management system, and the implications of not conforming to requirements.' },
  { clause: '7', clauseName: 'Support', id: '7.4',
    title: 'Communication',
    desc: 'The organization shall determine the internal and external communications relevant to the AI management system, including what to communicate, when, with whom, and how.' },
  { clause: '7', clauseName: 'Support', id: '7.5',
    title: 'Documented information',
    desc: 'The AI management system shall include documented information required by ISO 42001 and determined by the organization as necessary for effectiveness. Processes shall be in place for creating, updating, and controlling documented information.' },

  // ── CLAUSE 8: Operation ───────────────────────────────────────────────────────
  { clause: '8', clauseName: 'Operation', id: '8.1',
    title: 'Operational planning and control',
    desc: 'The organization shall plan, implement, control, monitor, and review the processes needed to meet AI management system requirements. Criteria for processes shall be documented, and documented information shall be retained to demonstrate processes have been carried out as planned.' },
  { clause: '8', clauseName: 'Operation', id: '8.2',
    title: 'AI risk assessment',
    desc: 'The organization shall perform AI risk assessments at planned intervals or when significant changes are proposed, identifying risks associated with AI systems, assessing likelihood and impact, and prioritizing risks for treatment. Results shall be retained as documented information.' },
  { clause: '8', clauseName: 'Operation', id: '8.3',
    title: 'AI risk treatment',
    desc: 'The organization shall implement the AI risk treatment plan, retain documented information on results, and implement appropriate controls selected from Annex A or other sources. A statement of applicability shall be produced documenting applicable controls and justification for inclusions/exclusions.' },
  { clause: '8', clauseName: 'Operation', id: '8.4',
    title: 'Documentation related to AI systems',
    desc: 'The organization shall document information about AI systems within scope of the AIMS, including the AI system\'s intended purpose, known limitations, technical specifications, data used, and any impact assessments completed.' },
  { clause: '8', clauseName: 'Operation', id: '8.5',
    title: 'AI system impact assessment',
    desc: 'The organization shall assess the impact of AI systems on individuals and affected communities, including assessment of potential harms, benefits, and mitigation measures. Impact assessments shall be documented and reviewed when significant changes occur.' },
  { clause: '8', clauseName: 'Operation', id: '8.6',
    title: 'AI supplier relationships',
    desc: 'The organization shall establish processes to manage AI-related supplier relationships, ensuring that externally provided AI systems, components, and data meet organizational requirements and that supplier AI risk management practices are assessed.' },

  // ── CLAUSE 9: Performance Evaluation ─────────────────────────────────────────
  { clause: '9', clauseName: 'Performance Evaluation', id: '9.1',
    title: 'Monitoring, measurement, analysis and evaluation',
    desc: 'The organization shall determine what needs to be monitored and measured in the AI management system, the methods for doing so, when analysis and evaluation shall be performed, and who shall analyze and evaluate results. Results shall be retained as documented information.' },
  { clause: '9', clauseName: 'Performance Evaluation', id: '9.2',
    title: 'Internal audit',
    desc: 'The organization shall conduct internal audits at planned intervals to determine whether the AI management system conforms to organizational and ISO 42001 requirements, and is effectively implemented and maintained. Audit results shall be reported to relevant management.' },
  { clause: '9', clauseName: 'Performance Evaluation', id: '9.3',
    title: 'Management review',
    desc: 'Top management shall review the AI management system at planned intervals to ensure its continuing suitability, adequacy, and effectiveness. Reviews shall include consideration of audit results, AI risk status, performance against objectives, and opportunities for continual improvement.' },

  // ── CLAUSE 10: Improvement ────────────────────────────────────────────────────
  { clause: '10', clauseName: 'Improvement', id: '10.1',
    title: 'Nonconformity and corrective action',
    desc: 'When a nonconformity occurs, the organization shall react to it, evaluate the need for corrective action, implement action, review effectiveness, and update risks and opportunities if necessary. Results shall be retained as documented information.' },
  { clause: '10', clauseName: 'Improvement', id: '10.2',
    title: 'Continual improvement',
    desc: 'The organization shall continually improve the suitability, adequacy, and effectiveness of the AI management system, considering the results of analysis and evaluation, management reviews, and opportunities for improvement.' },

  // ── ANNEX A: AI Controls ──────────────────────────────────────────────────────
  // A.2 AI Policies
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.2.2',
    title: 'AI policies and responsible use',
    desc: 'The organization shall establish policies for the responsible development and use of AI systems, addressing intended use, ethical considerations, bias prevention, transparency, and accountability for AI decisions.' },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.2.3',
    title: 'Communicating AI policies',
    desc: 'AI policies shall be communicated to all relevant personnel, including AI developers, deployers, and users, and shall be available to relevant interested parties.' },

  // A.3 Internal Organization
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.3.2',
    title: 'AI roles and responsibilities',
    desc: 'The organization shall assign AI-related roles and responsibilities, including roles for AI system development, deployment, monitoring, oversight, and risk management. Role holders shall have appropriate competence and authority.' },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.3.3',
    title: 'Reporting on AI to management',
    desc: 'Processes shall be in place to regularly report on AI system performance, risks, incidents, and compliance status to management, enabling informed governance decisions.' },

  // A.4 Resources for AI Systems
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.4.2',
    title: 'Processes and infrastructure for AI systems',
    desc: 'The organization shall establish and maintain processes and infrastructure (computing, storage, networking) necessary to develop, deploy, operate, monitor, and maintain AI systems securely and reliably.' },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.4.3',
    title: 'Data management for AI systems',
    desc: 'The organization shall implement data management processes covering data acquisition, quality assurance, labelling, storage, and access controls for data used in AI systems, consistent with privacy requirements.' },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.4.4',
    title: 'Tool and computing infrastructure management',
    desc: 'Tools, frameworks, and computing infrastructure used for AI development and operation shall be managed, version-controlled, secured, and maintained to ensure reliability and reproducibility of AI systems.' },

  // A.5 Assessing Impacts
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.5.2',
    title: 'Identification of impacts on individuals and communities',
    desc: 'The organization shall identify and document potential positive and negative impacts of AI systems on individuals, groups, and communities, including impacts from AI errors, bias, or misuse, before and during AI system operation.' },

  // A.6 AI System Life Cycle
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.6.1',
    title: 'AI system life cycle general',
    desc: 'The organization shall manage AI systems across their complete lifecycle, from requirements definition through design, development, testing, deployment, monitoring, and decommissioning, with appropriate controls at each stage.',
    providerManaged: true },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.6.2',
    title: 'Intended use documentation',
    desc: 'The intended purpose, intended use context, and intended users of each AI system shall be clearly defined and documented before development or procurement begins, providing a baseline for all subsequent design and risk decisions.',
    providerManaged: true },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.6.3',
    title: 'AI system requirements',
    desc: 'Functional and non-functional requirements for AI systems shall be established, documented, and validated, including performance requirements, safety constraints, ethical requirements, and regulatory compliance requirements.',
    providerManaged: true },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.6.4',
    title: 'AI system performance requirements',
    desc: 'Performance criteria for AI systems shall be defined, including accuracy, reliability, robustness, and fairness thresholds, with clear acceptance criteria that must be met before deployment.',
    providerManaged: true },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.6.5',
    title: 'AI system design',
    desc: 'AI system design shall address safety, security, privacy, fairness, and explainability requirements, with design decisions documented and reviewed by appropriate subject matter experts.',
    providerManaged: true },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.6.6',
    title: 'Data acquisition and preparation',
    desc: 'Processes for acquiring, curating, and preparing data used in AI systems shall be documented and controlled, including data source validation, quality assessment, bias analysis, and privacy compliance checks.' },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.6.7',
    title: 'AI model training',
    desc: 'AI model training processes shall be documented and controlled, including training data management, hyperparameter configuration, training infrastructure, reproducibility measures, and validation against performance criteria.' },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.6.8',
    title: 'Verification and validation of AI systems',
    desc: 'AI systems shall undergo systematic verification and validation before deployment, including testing for intended performance, safety, security, fairness, robustness, and compliance with requirements. Results shall be documented.' },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.6.9',
    title: 'Operation and monitoring of AI systems',
    desc: 'Deployed AI systems shall be monitored for performance, drift, unexpected behaviour, and emerging risks. Operational procedures shall be documented and monitoring results reviewed at defined intervals.' },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.6.10',
    title: 'Human oversight of AI systems',
    desc: 'Mechanisms shall be in place for appropriate human oversight of AI systems, commensurate with the risk level of the AI application, including human review of AI outputs, override capabilities, and clear accountability for AI-assisted decisions.' },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.6.11',
    title: 'AI system retirement and decommissioning',
    desc: 'Processes shall be in place for the safe retirement of AI systems, including responsible data deletion, notification of affected users and stakeholders, archiving of system documentation, and prevention of unauthorized reactivation.' },

  // A.7 Data for AI Systems
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.7.2',
    title: 'Data for AI development and testing',
    desc: 'Data used for AI development, training, and testing shall be appropriate, representative, and sufficient for the intended purpose, with documented provenance, licensing, and any known quality limitations.',
    providerManaged: true },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.7.3',
    title: 'Data acquisition and sourcing',
    desc: 'Processes shall govern how data is acquired for AI systems, ensuring ethical sourcing, appropriate consent or licensing, compliance with privacy regulations, and suitability for the intended AI application.',
    providerManaged: true },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.7.4',
    title: 'Data quality management',
    desc: 'Data quality processes shall be established for AI systems, covering accuracy, completeness, consistency, timeliness, and representativeness, with quality issues documented and addressed before use in training or deployment.',
    providerManaged: true },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.7.5',
    title: 'Data provenance and lineage',
    desc: 'The provenance and lineage of data used in AI systems shall be documented, enabling traceability of training data sources, transformations, and any known biases or limitations that may affect AI system outputs.' },

  // A.8 Information for Interested Parties
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.8.2',
    title: 'Transparency of AI systems',
    desc: 'The organization shall provide appropriate information about AI systems to relevant interested parties, including intended use, known limitations, decision-making processes, and available recourse mechanisms, consistent with confidentiality requirements.',
    providerManaged: true },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.8.3',
    title: 'Communication to users of AI systems',
    desc: 'Users of AI systems shall be informed when they are interacting with or subject to decisions from an AI system, and shall be provided with sufficient information to understand AI outputs and exercise appropriate judgment.' },

  // A.9 Use of AI Systems
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.9.2',
    title: 'Responsible use of AI systems',
    desc: 'The organization shall establish controls ensuring that AI systems are used only for their intended purpose, by authorized users, and in compliance with applicable policies, laws, and ethical guidelines. Misuse or out-of-scope use shall be detected and addressed.' },

  // A.10 Third-Party Relationships
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.10.2',
    title: 'Management of supplier-provided AI systems',
    desc: 'The organization shall evaluate, select, and manage AI systems or components provided by suppliers, ensuring that supplier AI risk management practices, data governance, and compliance commitments are assessed and meet organizational requirements.' },
  { clause: 'A', clauseName: 'Annex A — AI Controls', id: 'A.10.3',
    title: 'Customer and partner data in AI systems',
    desc: 'When customer or partner data is used in AI systems, the organization shall establish appropriate contractual agreements, data handling controls, and transparency mechanisms, ensuring data is used only for agreed purposes.' },
];

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const ISO42001_CLAUSE_META = {
  '4':  { label: 'Clause 4',  name: 'Context',              icon: '🔎', color: '#152168', light: '#dbeafe', txt: '#1e40af' },
  '5':  { label: 'Clause 5',  name: 'Leadership',           icon: '👤', color: '#4f46e5', light: '#ede9fe', txt: '#4338ca' },
  '6':  { label: 'Clause 6',  name: 'Planning',             icon: '📐', color: '#0e7490', light: '#cffafe', txt: '#0e7490' },
  '7':  { label: 'Clause 7',  name: 'Support',              icon: '🛠️', color: '#b45309', light: '#fef3c7', txt: '#92400e' },
  '8':  { label: 'Clause 8',  name: 'Operation',            icon: '⚙️', color: '#15803d', light: '#dcfce7', txt: '#166534' },
  '9':  { label: 'Clause 9',  name: 'Performance',          icon: '📊', color: '#7c3aed', light: '#ede9fe', txt: '#6d28d9' },
  '10': { label: 'Clause 10', name: 'Improvement',          icon: '📈', color: '#dc2626', light: '#fee2e2', txt: '#b91c1c' },
  'A':  { label: 'Annex A',   name: 'AI Controls',          icon: '🔗', color: '#0f766e', light: '#ccfbf1', txt: '#0f766e' },
};

const ISO42001_CLAUSE_ORDER = ['4', '5', '6', '7', '8', '9', '10', 'A'];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function iso42001CalcScore(answers) {
  let yes = 0, partial = 0, no = 0, answered = 0;
  ISO42001_CONTROLS.forEach(c => {
    const v = answers[c.id];
    if (!v || v === 'na') return;
    answered++;
    if (v === 'yes' || v === 'cc') yes++;
    else if (v === 'partial') partial++;
    else if (v === 'no') no++;
  });
  const total = ISO42001_CONTROLS.length;
  const score = answered > 0 ? Math.round((yes + partial * 0.5) / total * 100) : 0;
  return { score, yes, partial, no, answered, total };
}

function iso42001CalcClauseScores(answers) {
  return ISO42001_CLAUSE_ORDER.map(clause => {
    const controls = ISO42001_CONTROLS.filter(c => c.clause === clause);
    let yes = 0, partial = 0, answered = 0;
    controls.forEach(c => {
      const v = answers[c.id];
      if (!v || v === 'na') return;
      answered++;
      if (v === 'yes' || v === 'cc') yes++;
      else if (v === 'partial') partial++;
    });
    const total = controls.length;
    const pct = answered > 0 ? Math.round((yes + partial * 0.5) / total * 100) : null;
    return { clause, yes, partial, answered, total, pct };
  });
}

function iso42001LatestIdx(runs) {
  if (!runs.length) return -1;
  return runs.reduce((best, r, i) => ((r.date || '') > (runs[best].date || '') ? i : best), 0);
}

// ── RENDER ROUTER ─────────────────────────────────────────────────────────────

function renderIso42001() {
  switch (iso42001State.view) {
    case 'form':    return renderIso42001Form();
    case 'gap':     return renderIso42001GapReport();
    case 'report':  return renderIso42001ExecReport();
    default:        return renderIso42001Dashboard();
  }
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

function renderIso42001Dashboard() {
  const orgId = currentOrg?.id;
  const runs = (orgAssessments[orgId] || {})['iso42001'] || [];
  const latestIdx = iso42001LatestIdx(runs);
  const latest = latestIdx >= 0 ? runs[latestIdx] : null;
  const answers = latest
    ? Object.fromEntries(Object.entries(latest.answers || {}).filter(([k]) => !k.startsWith('_')))
    : {};
  const { score, answered, total } = iso42001CalcScore(answers);
  const clauseScores = latest ? iso42001CalcClauseScores(answers) : [];
  const band = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const bandCol = score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : score >= 40 ? '#ea580c' : '#dc2626';

  const clauseBarsHtml = clauseScores.filter(c => c.pct !== null).map(c => {
    const m = ISO42001_CLAUSE_META[c.clause];
    return `<div style="flex:1;min-width:80px">
      <div style="display:flex;align-items:baseline;gap:3px;margin-bottom:3px">
        <span style="font-size:9px;font-weight:700;color:${m.light};white-space:nowrap">${m.label}</span>
        <span style="font-size:9px;color:rgba(255,255,255,.5);margin-left:auto">${c.answered}/${c.total}</span>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.12);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${c.pct}%;background:${m.light};border-radius:2px;transition:width .4s"></div>
      </div>
      <div style="font-size:9px;color:rgba(255,255,255,.4);margin-top:2px">${c.pct}%</div>
    </div>`;
  }).join('');

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">📋 ISO/IEC 42001:2023</div>
      <div style="font-size:12px;color:var(--muted)">53 items · 7 clauses (4–10) + Annex A controls · AI Management System standard</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="setNav('ai_readiness')">← Hub</button>
      <button class="btn btn-cyan btn-sm" onclick="iso42001StartNew()">+ New Assessment</button>
    </div>
  </div>

  <div class="score-hero-ins" style="margin-bottom:1.25rem">
    <div style="flex:1;display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap">
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">Latest Score</div>
          <div class="score-big" style="color:#fff">${latest && answered > 0 ? score : '—'}<span style="font-size:18px">${latest && answered > 0 ? '%' : ''}</span></div>
          ${latest && answered > 0 ? `<div style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;display:inline-block;margin-top:6px;color:${bandCol};background:rgba(255,255,255,.08)">${band}</div>` : ''}
          ${!latest
            ? `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">No assessments yet</div>`
            : `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">${answered}/${total} answered · ${latest.date}</div>`}
        </div>
        <div style="flex:1;min-width:260px">
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px">Clause Coverage</div>
          ${clauseScores.some(c => c.pct !== null)
            ? `<div style="display:flex;gap:8px;flex-wrap:wrap">${clauseBarsHtml}</div>`
            : `<div style="font-size:11px;color:rgba(255,255,255,.3)">Run an assessment to see clause coverage</div>`}
        </div>
      </div>
    </div>
    <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:8px">
      ${runs.length >= 2
        ? `<div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">Score Trend</div>
           <canvas id="iso42001TrendChart" width="200" height="60"></canvas>`
        : `<div style="font-size:11px;color:rgba(255,255,255,.3);text-align:right">${runs.length === 1 ? '1 run recorded<br>trend after 2nd save' : 'No assessments yet'}</div>`}
      <div style="font-size:10px;color:rgba(255,255,255,.35);text-align:right;margin-top:6px">
        ${runs.length} assessment${runs.length !== 1 ? 's' : ''} recorded
      </div>
    </div>
  </div>

  <div class="card" style="padding:1.25rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.1rem">
      <div style="font-size:14px;font-weight:700;color:var(--text)">Assessment History</div>
      <button class="btn btn-cyan btn-sm" onclick="iso42001StartNew()">+ New Assessment</button>
    </div>`;

  if (runs.length === 0) {
    html += `<div style="text-align:center;padding:2.5rem 1rem;color:var(--muted)">
      <div style="font-size:32px;margin-bottom:.75rem">📋</div>
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:6px">No assessments yet</div>
      <div style="font-size:12px;margin-bottom:1.25rem">Run your first ISO 42001 assessment to start tracking your AI management system maturity.</div>
      <button class="btn btn-cyan btn-sm" onclick="iso42001StartNew()">+ Start First Assessment</button>
    </div>`;
  } else {
    html += `<table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="border-bottom:2px solid var(--border)">
          <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Date</th>
          <th style="text-align:center;padding:7px 8px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Score</th>
          <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Conducted By</th>
          <th style="text-align:right;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Actions</th>
        </tr>
      </thead>
      <tbody>`;

    runs.forEach((r, i) => {
      const cleanAns = Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_')));
      const { score: sc, answered: ans, total: tot } = iso42001CalcScore(cleanAns);
      const scCol = sc >= 75 ? '#15803d' : sc >= 50 ? '#b45309' : '#dc2626';
      const isLatest = i === latestIdx;

      html += `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px;font-weight:${isLatest ? '700' : '400'};white-space:nowrap">
          ${r.date || '—'}
          ${isLatest ? '<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;background:#dbeafe;color:#1d4ed8;margin-left:6px">Latest</span>' : ''}
        </td>
        <td style="padding:8px 8px;text-align:center">
          <span style="font-size:14px;font-weight:700;color:${scCol}">${sc}</span><span style="font-size:11px;color:var(--muted)">%</span>
          <div style="font-size:10px;color:var(--muted)">${ans}/${tot} answered</div>
        </td>
        <td style="padding:8px 10px;color:var(--muted)">${escH(r.conductedBy || '—')}</td>
        <td style="padding:8px 10px;text-align:right">
          <div style="display:flex;gap:4px;justify-content:flex-end;flex-wrap:wrap">
            <button class="btn btn-outline btn-sm" onclick="iso42001OpenAssessment(${i})" style="font-size:11px;padding:3px 8px">✏️ Edit</button>
            <button class="btn btn-outline btn-sm" onclick="iso42001OpenGapReport(${i})" style="font-size:11px;padding:3px 8px">🔍 Gaps</button>
            <button class="btn btn-outline btn-sm" onclick="iso42001OpenReport(${i})" style="font-size:11px;padding:3px 8px">📊 Report</button>
            <button class="btn btn-red btn-sm" onclick="iso42001DeleteConfirm(${i})" style="font-size:11px;padding:3px 8px">🗑</button>
          </div>
        </td>
      </tr>`;
    });

    html += `</tbody></table>`;
  }
  html += `</div>`;
  return html;
}

function iso42001TrendDraw() {
  const canvas = document.getElementById('iso42001TrendChart');
  if (!canvas) return;
  const runs = (orgAssessments[currentOrg?.id] || {})['iso42001'] || [];
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  if (sorted.length < 2) return;
  const scores = sorted.map(r => {
    const ans = Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_')));
    return iso42001CalcScore(ans).score;
  });
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const pad = 6;
  const pts = scores.map((s, i) => ({
    x: pad + (i / (scores.length - 1)) * (W - pad * 2),
    y: H - pad - (s / 100) * (H - pad * 2),
  }));
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  [20, 40, 60, 80].forEach(v => {
    const y = H - pad - (v / 100) * (H - pad * 2);
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
  });
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, 'rgba(7,180,217,0.4)');
  grad.addColorStop(1, 'rgba(7,180,217,1)');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();
  pts.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#07D1F2'; ctx.fill();
  });
}

// ── ASSESSMENT FORM ───────────────────────────────────────────────────────────

function renderIso42001Form() {
  const isEdit = !!iso42001State.editId;
  const { score, answered, total } = iso42001CalcScore(iso42001State.answers);

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">📋 ISO 42001 — ${isEdit ? 'Edit Assessment' : 'New Assessment'}</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name || '')} · 53 items across 7 clauses and Annex A</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="iso42001NavToDashboard()">← Back</button>
      <button class="btn btn-cyan btn-sm" onclick="iso42001Save()" id="iso42001SaveBtn">Save Assessment</button>
    </div>
  </div>

  <div class="card" style="padding:1rem;margin-bottom:1rem">
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end">
      <div style="flex:1;min-width:180px">
        <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px">ASSESSMENT DATE</label>
        <input type="date" id="iso42001Date" value="${iso42001State.date || new Date().toISOString().slice(0,10)}"
          style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px;font-size:13px">
      </div>
      <div style="flex:1;min-width:180px">
        <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px">CONDUCTED BY</label>
        <input type="text" id="iso42001ConductedBy" placeholder="Name or role…" value="${escH(iso42001State.conductedBy || '')}"
          style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px;font-size:13px">
      </div>
      <div style="min-width:160px">
        <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px">SCORE SO FAR</label>
        <div style="font-size:24px;font-weight:800;color:var(--navy)">${answered > 0 ? score + '%' : '—'}</div>
        <div style="font-size:10px;color:var(--muted)">${answered}/${total} answered</div>
      </div>
    </div>
    <div style="margin-top:10px;padding:8px 12px;border-radius:6px;background:#f0f9ff;border:1px solid #bae6fd;font-size:11px;color:#0369a1">
      <strong>ISO 42001 scope:</strong> All clauses and Annex A controls apply to organizations seeking certification or conformance. Answer N/A only for controls that are genuinely out of scope for your AI use context.
    </div>
  </div>`;

  ISO42001_CLAUSE_ORDER.forEach(clauseKey => {
    const m = ISO42001_CLAUSE_META[clauseKey];
    const controls = ISO42001_CONTROLS.filter(c => c.clause === clauseKey);
    const panelOpen = iso42001State.openPanels[clauseKey] !== false;

    let yes = 0, partial = 0, answered = 0;
    controls.forEach(c => {
      const v = iso42001State.answers[c.id];
      if (!v || v === 'na') return;
      answered++;
      if (v === 'yes') yes++;
      else if (v === 'partial') partial++;
    });
    const pct = answered > 0 ? Math.round((yes + partial * 0.5) / controls.length * 100) : null;

    html += `
    <div class="card" style="margin-bottom:.75rem;overflow:hidden">
      <div onclick="iso42001TogglePanel('${clauseKey}')" style="cursor:pointer;padding:.9rem 1.1rem;display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,${m.color},${m.color}dd)">
        <span style="font-size:16px">${m.icon}</span>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700;color:#fff">${m.label} — ${m.name}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.6)">${controls.length} item${controls.length !== 1 ? 's' : ''}</div>
        </div>
        <div style="text-align:right">
          ${pct !== null
            ? `<div style="font-size:18px;font-weight:800;color:#fff">${pct}%</div><div style="font-size:10px;color:rgba(255,255,255,.5)">${answered}/${controls.length} answered</div>`
            : `<div style="font-size:11px;color:rgba(255,255,255,.4)">Not started</div>`}
        </div>
        <span style="font-size:14px;color:rgba(255,255,255,.6);margin-left:8px">${panelOpen ? '▲' : '▼'}</span>
      </div>
      ${panelOpen ? `<div style="padding:.75rem 1rem">` : `<div style="display:none">`}`;

    controls.forEach(ctrl => {
      const val = iso42001State.answers[ctrl.id] || '';
      const note = iso42001State.notes[ctrl.id] || '';
      const commentOpen = iso42001State.openComments[ctrl.id];
      const ansColors = { yes: '#15803d', partial: '#b45309', no: '#dc2626', na: '#5a6a8a', cc: '#0f766e' };
      const ansLabels = { yes: 'Yes', partial: 'Partial', no: 'No', na: 'N/A', cc: 'CC' };
      const cardBg = val==='yes'?'#f0fdf4':val==='partial'?'#fffbeb':val==='no'?'#fef2f2':val==='na'?'#f8fafc':val==='cc'?'#f0fdfa':'#fff';
      const cardBd = val==='yes'?'#dcfce7':val==='partial'?'#fef3c7':val==='no'?'#fee2e2':val==='na'?'#f1f5f9':val==='cc'?'#99f6e4':'var(--border)';
      const providerHint = ctrl.providerManaged ? `<div style="margin-bottom:6px;font-size:10px;color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:4px 8px;line-height:1.5">⚠️ <strong>Provider-managed:</strong> This control is implemented by your AI provider (e.g. Anthropic, OpenAI). As a consumer you cannot directly fulfil it — this is typically a <strong>Compensating Control</strong>. Document the provider's model card, AUP, and published safety/compliance materials as your evidence.</div>` : '';

      html += `
      <div style="margin-bottom:.75rem;padding:.65rem .75rem;border-radius:6px;border:1px solid ${cardBd};background:${cardBg}">
        ${providerHint}
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap">
          <div style="flex:1;min-width:200px">
            <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:3px">
              <span style="font-size:10px;font-weight:700;color:${m.color};white-space:nowrap">${escH(ctrl.id)}</span>
              <span style="font-size:12px;font-weight:700;color:var(--text)">${escH(ctrl.title)}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);line-height:1.45">${escH(ctrl.desc)}</div>
            ${note ? `<div style="margin-top:4px;font-size:11px;color:var(--muted);font-style:italic">📝 ${escH(note)}</div>` : ''}
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;align-items:center;flex-wrap:wrap">
            ${['yes','partial','no','na','cc'].map(a => `<button onclick="iso42001Answer('${ctrl.id}','${a}')"
              style="padding:4px 9px;font-size:11px;font-weight:700;border-radius:6px;cursor:pointer;border:2px solid ${val === a ? ansColors[a] : '#dde3ef'};background:${val === a ? ansColors[a] : 'transparent'};color:${val === a ? '#fff' : '#5a6a8a'};transition:all .12s">${ansLabels[a]}</button>`).join('')}
            <button onclick="iso42001ToggleComment('${ctrl.id}')" title="Add note"
              style="padding:4px 8px;font-size:11px;border-radius:6px;cursor:pointer;border:1px solid var(--border);background:${commentOpen || note ? '#f0f4ff' : 'transparent'};color:${commentOpen || note ? 'var(--navy)' : 'var(--muted)'}">💬</button>
          </div>
        </div>
        ${val === 'cc' ? `<div style="margin-top:6px;font-size:10px;color:#0f766e;background:#f0fdfa;border:1px solid #99f6e4;border-radius:6px;padding:4px 8px;line-height:1.4">Document the provider's AUP and control evidence. You manage compensating controls only.</div>` : ''}
        ${commentOpen ? `<div style="margin-top:8px">
          <textarea id="iso_note_${ctrl.id.replace(/\./g,'_')}" placeholder="Add assessor note…"
            style="width:100%;min-height:56px;padding:6px 9px;border:1px solid var(--border);border-radius:6px;font-size:12px;resize:vertical"
            onblur="iso42001SaveNote('${ctrl.id}',this.value)">${escH(note)}</textarea>
        </div>` : ''}
      </div>`;
    });

    html += `</div></div>`;
  });

  html += `
  <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:1rem">
    <button class="btn btn-outline btn-sm" onclick="iso42001NavToDashboard()">← Cancel</button>
    <button class="btn btn-cyan" onclick="iso42001Save()">Save Assessment</button>
  </div>`;

  return html;
}

// ── GAP REPORT ────────────────────────────────────────────────────────────────

function renderIso42001GapReport() {
  const run = iso42001State.reportRun;
  if (!run) return `<div class="card" style="padding:2rem;text-align:center"><button class="btn btn-outline btn-sm" onclick="iso42001NavToDashboard()">← Back</button></div>`;

  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const gaps = ISO42001_CONTROLS.filter(c => answers[c.id] === 'no' || answers[c.id] === 'partial');
  const { score } = iso42001CalcScore(answers);
  const noCount = gaps.filter(c => answers[c.id] === 'no').length;
  const partCount = gaps.filter(c => answers[c.id] === 'partial').length;

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">🔍 ISO 42001 Gap Report</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name || '')} · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''} · Score: ${score}%</div>
    </div>
    <div style="display:flex;gap:6px">
      <button class="btn btn-outline btn-sm" onclick="iso42001NavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="iso42001CopyGapPrompt()">📋 Copy AI Prompt</button>
    </div>
  </div>

  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem">
    ${[
      { label: 'Total Gaps', val: gaps.length, col: 'var(--navy)' },
      { label: 'No', val: noCount, col: '#dc2626' },
      { label: 'Partial', val: partCount, col: '#b45309' },
    ].map(s => `<div style="padding:8px 14px;border-radius:8px;background:var(--card);border:1px solid var(--border);text-align:center;min-width:70px">
      <div style="font-size:20px;font-weight:800;color:${s.col}">${s.val}</div>
      <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-top:1px">${s.label}</div>
    </div>`).join('')}
  </div>`;

  if (gaps.length === 0) {
    html += `<div class="card" style="text-align:center;padding:3rem 1rem">
      <div style="font-size:32px;margin-bottom:.75rem">🎉</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:4px">No gaps found</div>
      <div style="font-size:12px;color:var(--muted)">All assessed items are marked Yes or N/A.</div>
    </div>`;
  } else {
    ISO42001_CLAUSE_ORDER.forEach(clauseKey => {
      const clauseGaps = gaps.filter(c => c.clause === clauseKey);
      if (!clauseGaps.length) return;
      const m = ISO42001_CLAUSE_META[clauseKey];
      html += `<div class="card" style="margin-bottom:.75rem;overflow:hidden">
        <div style="background:linear-gradient(135deg,${m.color},${m.color}dd);padding:.75rem 1rem;display:flex;align-items:center;gap:8px">
          <span style="font-size:14px">${m.icon}</span>
          <span style="font-size:13px;font-weight:700;color:#fff">${m.label} — ${m.name}</span>
          <span style="font-size:11px;color:rgba(255,255,255,.6)">${clauseGaps.length} gap${clauseGaps.length !== 1 ? 's' : ''}</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead><tr style="background:var(--bg)">
            <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Clause</th>
            <th style="padding:7px 8px;text-align:center;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Gap</th>
            <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Requirement</th>
          </tr></thead>
          <tbody>
            ${clauseGaps.map(c => {
              const ans = answers[c.id];
              const ansBadge = ans === 'no'
                ? '<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:#fee2e2;color:#dc2626">No</span>'
                : '<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:#fef3c7;color:#b45309">Partial</span>';
              return `<tr style="border-bottom:1px solid var(--border)">
                <td style="padding:8px 10px;font-weight:700;color:${m.color};white-space:nowrap;vertical-align:top;font-size:11px">${escH(c.id)}</td>
                <td style="padding:8px 6px;text-align:center;vertical-align:top">${ansBadge}</td>
                <td style="padding:8px 10px;vertical-align:top">
                  <div style="font-weight:700;margin-bottom:2px">${escH(c.title)}</div>
                  <div style="color:var(--muted);font-size:11px;line-height:1.4">${escH(c.desc)}</div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
    });
  }

  html += `<div style="margin-top:.75rem;display:flex;gap:8px">
    <button class="btn btn-outline btn-sm" onclick="iso42001NavToDashboard()">← Back</button>
    <button class="btn btn-outline btn-sm" onclick="iso42001CopyGapPrompt()">📋 Copy AI Prompt</button>
  </div>`;
  return html;
}

// ── EXECUTIVE REPORT ──────────────────────────────────────────────────────────

function renderIso42001ExecReport() {
  const run = iso42001State.reportRun;
  if (!run) return `<div class="card" style="padding:2rem;text-align:center"><button class="btn btn-outline btn-sm" onclick="iso42001NavToDashboard()">← Back</button></div>`;

  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { score, yes, partial, no, answered, total } = iso42001CalcScore(answers);
  const clauseScores = iso42001CalcClauseScores(answers);
  const band = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const bandCol = score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : score >= 40 ? '#ea580c' : '#dc2626';
  const commentary = iso42001State.reportCommentary || (run.answers || {})._exec_commentary || '';

  const runs = (orgAssessments[currentOrg?.id] || {})['iso42001'] || [];
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const prevRun = sorted.length >= 2 ? sorted[sorted.length - 2] : null;
  const prevScore = prevRun ? iso42001CalcScore(Object.fromEntries(Object.entries(prevRun.answers || {}).filter(([k]) => !k.startsWith('_')))).score : null;
  const scoreChange = prevScore !== null ? score - prevScore : null;

  const clauseBarsHtml = clauseScores.filter(c => c.pct !== null).map(c => {
    const m = ISO42001_CLAUSE_META[c.clause];
    const col = c.pct >= 75 ? '#15803d' : c.pct >= 50 ? '#b45309' : '#dc2626';
    return `<div style="margin-bottom:7px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px">
        <span style="font-size:11px;font-weight:700;color:var(--text)">${m.icon} ${m.label} — ${m.name}</span>
        <span style="font-size:11px;font-weight:700;color:${col}">${c.pct}%</span>
      </div>
      <div style="height:6px;background:var(--bg);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${c.pct}%;background:${m.color};border-radius:3px;transition:width .4s"></div>
      </div>
    </div>`;
  }).join('');

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📊 ISO 42001 Executive Report</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name || '')} · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="iso42001NavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="iso42001CopyReportPrompt()">📋 Copy AI Prompt</button>
      <button class="btn btn-cyan btn-sm" onclick="iso42001SaveCommentary()">Save Commentary</button>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
    <div class="card" style="padding:1.25rem">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Overall Score</div>
      <div style="display:flex;align-items:baseline;gap:8px">
        <div style="font-size:48px;font-weight:800;color:var(--navy);line-height:1">${answered > 0 ? score : '—'}</div>
        ${answered > 0 ? `<div style="font-size:20px;color:var(--muted)">%</div>` : ''}
      </div>
      <div style="font-size:13px;font-weight:700;color:${bandCol};margin-top:4px">${answered > 0 ? band : 'No data'}</div>
      ${scoreChange !== null ? `<div style="font-size:11px;color:${scoreChange >= 0 ? '#15803d' : '#dc2626'};margin-top:4px">${scoreChange >= 0 ? '▲' : '▼'} ${Math.abs(scoreChange)}% vs previous</div>` : ''}
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
        ${[{l:'Yes',v:yes,c:'#15803d'},{l:'Partial',v:partial,c:'#b45309'},{l:'No',v:no,c:'#dc2626'},{l:'Answered',v:answered,c:'var(--navy)'}]
          .map(s => `<div style="text-align:center"><div style="font-size:16px;font-weight:700;color:${s.c}">${s.v}</div><div style="font-size:9px;color:var(--muted)">${s.l}</div></div>`).join('')}
      </div>
    </div>
    <div class="card" style="padding:1.25rem">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">Clause Breakdown</div>
      ${clauseBarsHtml || '<div style="font-size:12px;color:var(--muted)">No clause data yet</div>'}
    </div>
  </div>

  <div class="card" style="padding:1.25rem;margin-bottom:1rem">
    <div style="font-size:13px;font-weight:700;margin-bottom:.75rem">Top Gaps (No / Partial)</div>
    ${(() => {
      const gaps = ISO42001_CONTROLS.filter(c => { const v = answers[c.id]; return v === 'no' || v === 'partial'; }).slice(0, 12);
      if (!gaps.length) return `<div style="font-size:13px;color:var(--muted)">No gaps found.</div>`;
      return `<table style="width:100%;border-collapse:collapse;font-size:12px">
        ${gaps.map(c => {
          const v = answers[c.id];
          const m = ISO42001_CLAUSE_META[c.clause];
          const badge = v === 'no'
            ? '<span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;background:#fee2e2;color:#dc2626">No</span>'
            : '<span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;background:#fef3c7;color:#b45309">Partial</span>';
          return `<tr style="border-bottom:1px solid var(--border)">
            <td style="padding:6px 8px;white-space:nowrap;vertical-align:top">
              <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;background:${m.light};color:${m.txt}">${m.label}</span>
            </td>
            <td style="padding:6px 6px;vertical-align:top">${badge}</td>
            <td style="padding:6px 8px;vertical-align:top">
              <div style="font-weight:700;font-size:11px;color:var(--navy)">${escH(c.id)}</div>
              <div style="color:var(--text)">${escH(c.title)}</div>
            </td>
          </tr>`;
        }).join('')}
      </table>`;
    })()}
  </div>

  <div class="card" style="padding:1.25rem">
    <div style="font-size:13px;font-weight:700;margin-bottom:.5rem">Executive Commentary</div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:.75rem">Write or paste an AI-generated executive summary. Use "Copy AI Prompt" to generate one via Claude.</div>
    <textarea id="iso42001ReportCommentary" placeholder="Executive summary and narrative commentary…"
      style="width:100%;min-height:140px;padding:10px;border:1px solid var(--border);border-radius:6px;font-size:13px;line-height:1.6;resize:vertical">${escH(commentary)}</textarea>
    <div style="margin-top:.5rem;display:flex;gap:6px;justify-content:flex-end">
      <button class="btn btn-outline btn-sm" onclick="iso42001CopyReportPrompt()">📋 Copy AI Prompt</button>
      <button class="btn btn-cyan btn-sm" onclick="iso42001SaveCommentary()">Save Commentary</button>
    </div>
  </div>`;
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────

function iso42001StartNew() {
  iso42001State.answers = {};
  iso42001State.notes = {};
  iso42001State.openComments = {};
  iso42001State.openPanels = {};
  iso42001State.editId = null;
  iso42001State.date = new Date().toISOString().slice(0, 10);
  iso42001State.conductedBy = '';
  iso42001State.view = 'form';
  renderMain();
}

function iso42001OpenAssessment(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['iso42001'] || [];
  const run = runs[idx];
  if (!run) return;
  const cleanAns = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  iso42001State.answers = cleanAns;
  iso42001State.notes = {};
  iso42001State.openComments = {};
  iso42001State.openPanels = {};
  iso42001State.editId = run.id || null;
  iso42001State.date = run.date || '';
  iso42001State.conductedBy = run.conductedBy || '';
  iso42001State.view = 'form';
  renderMain();
}

async function iso42001Save() {
  const orgId = currentOrg?.id;
  if (!orgId) return;
  const date = document.getElementById('iso42001Date')?.value || iso42001State.date || new Date().toISOString().slice(0, 10);
  const conductedBy = document.getElementById('iso42001ConductedBy')?.value?.trim() || '';
  const answers = { ...iso42001State.answers };

  const { score, answered } = iso42001CalcScore(iso42001State.answers);
  if (answered === 0) { toast('Answer at least one item before saving', '#b45309'); return; }

  const btn = document.getElementById('iso42001SaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  try {
    let savedId = iso42001State.editId;
    if (savedId) {
      await sb.updateAssessment(savedId, { score, answers, assessed_at: date, conducted_by: conductedBy });
    } else {
      const row = { org_id: orgId, module: 'iso42001', score, answers, assessed_at: date, conducted_by: conductedBy };
      const res = await sb.saveAssessment(row);
      savedId = Array.isArray(res) ? res[0]?.id : res?.id;
    }

    const noteRows = Object.entries(iso42001State.notes)
      .filter(([, v]) => v.trim())
      .map(([item_id, note]) => ({ org_id: orgId, module: 'iso42001', item_id, note }));
    if (noteRows.length) await sb.frameworkNotes.upsert(noteRows);

    delete orgAssessments[orgId];
    await loadAssessments(orgId);
    iso42001State.editId = savedId;
    iso42001State.view = 'dashboard';
    toast('✓ ISO 42001 assessment saved', '#15803d');
    buildNav(); renderMain();
    setTimeout(iso42001TrendDraw, 80);
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Save Assessment'; }
  }
}

async function iso42001DeleteConfirm(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['iso42001'] || [];
  const run = runs[idx];
  if (!run?.id) return;
  if (!confirm(`Delete ISO 42001 assessment from ${run.date || 'unknown date'}? This cannot be undone.`)) return;
  try {
    await sb.deleteAssessment(run.id);
    delete orgAssessments[currentOrg.id];
    await loadAssessments(currentOrg.id);
    toast('Assessment deleted', '#b45309');
    buildNav(); renderMain();
  } catch(e) { toast('Delete failed: ' + e.message, '#dc2626'); }
}

function iso42001NavToDashboard() {
  iso42001State.view = 'dashboard';
  iso42001State.reportRun = null;
  renderMain();
  setTimeout(iso42001TrendDraw, 80);
}

function iso42001Answer(id, val) {
  iso42001State.answers[id] = val;
  iso42001State.view = 'form';
  renderMain();
}

function iso42001TogglePanel(clause) {
  iso42001State.openPanels[clause] = iso42001State.openPanels[clause] === false ? true : false;
  renderMain();
}

function iso42001ToggleComment(id) {
  iso42001State.openComments[id] = !iso42001State.openComments[id];
  renderMain();
}

function iso42001SaveNote(id, value) {
  iso42001State.notes[id] = value.trim();
}

function iso42001OpenGapReport(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['iso42001'] || [];
  const run = runs[idx];
  if (!run) return;
  iso42001State.reportRun = run;
  iso42001State.view = 'gap';
  renderMain();
}

function iso42001OpenReport(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['iso42001'] || [];
  const run = runs[idx];
  if (!run) return;
  iso42001State.reportRun = run;
  iso42001State.reportCommentary = (run.answers || {})._exec_commentary || '';
  iso42001State.view = 'report';
  renderMain();
}

async function iso42001SaveCommentary() {
  const run = iso42001State.reportRun;
  if (!run?.id) { toast('Cannot save — assessment ID missing', '#dc2626'); return; }
  const commentary = (document.getElementById('iso42001ReportCommentary')?.value || '').trim();
  try {
    const updatedAnswers = { ...(run.answers || {}), _exec_commentary: commentary };
    await sb.updateAssessment(run.id, { answers: updatedAnswers });
    iso42001State.reportRun = { ...run, answers: updatedAnswers };
    iso42001State.reportCommentary = commentary;
    const runs = (orgAssessments[currentOrg?.id] || {})['iso42001'] || [];
    const idx = runs.findIndex(r => r.id === run.id);
    if (idx !== -1) runs[idx] = { ...runs[idx], answers: updatedAnswers };
    toast('✓ Commentary saved', '#15803d');
  } catch(e) { toast('Save failed: ' + e.message, '#dc2626'); }
}

function iso42001CopyReportPrompt() {
  const run = iso42001State.reportRun;
  if (!run) return;
  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { score, yes, partial, no } = iso42001CalcScore(answers);
  const band = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const clauseScores = iso42001CalcClauseScores(answers);
  const runs = (orgAssessments[currentOrg?.id] || {})['iso42001'] || [];
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const trend = sorted.map(r => `${r.date}: ${r.score}%`).join(' → ');
  const hasTrend = sorted.length >= 2;

  // Delta vs immediately preceding run
  const runIdx = sorted.findIndex(r => r.id === run.id);
  const prevRun = runIdx > 0 ? sorted[runIdx - 1] : null;
  let trendDelta = 'N/A — first assessment';
  let improvedAreas = 'N/A — first assessment';
  let regressedAreas = 'N/A — first assessment';
  if (prevRun) {
    const prevAns = Object.fromEntries(Object.entries(prevRun.answers || {}).filter(([k]) => !k.startsWith('_')));
    const scoreDelta = score - prevRun.score;
    trendDelta = `${scoreDelta >= 0 ? '+' : ''}${scoreDelta}% vs ${prevRun.date} (was ${prevRun.score}%)`;
    const rank = v => ({ yes: 2, partial: 1, no: 0 }[v] ?? -1);
    const improvedClauses = new Map(), regressedClauses = new Map();
    ISO42001_CONTROLS.forEach(c => {
      const pv = rank(prevAns[c.id] || 'no');
      const cv = rank(answers[c.id] || 'no');
      if (pv < 0 || cv < 0) return;
      const clauseLabel = ISO42001_CLAUSE_META[c.clause]?.label || c.clause;
      if (cv > pv) improvedClauses.set(c.clause, clauseLabel);
      if (cv < pv) regressedClauses.set(c.clause, clauseLabel);
    });
    improvedAreas = improvedClauses.size ? [...improvedClauses.values()].join(', ') : 'None — no gains detected';
    regressedAreas = regressedClauses.size ? [...regressedClauses.values()].join(', ') : 'None';
  }
  const noGaps = ISO42001_CONTROLS.filter(c => answers[c.id] === 'no').slice(0, 8)
    .map(c => `- ${c.id} (${ISO42001_CLAUSE_META[c.clause]?.label}): ${c.title}`).join('\n');
  const partGaps = ISO42001_CONTROLS.filter(c => answers[c.id] === 'partial').slice(0, 5)
    .map(c => `- ${c.id} (${ISO42001_CLAUSE_META[c.clause]?.label}): ${c.title}`).join('\n');
  const clauseBreakdown = clauseScores.filter(c => c.pct !== null)
    .map(c => `  ${ISO42001_CLAUSE_META[c.clause]?.label} (${ISO42001_CLAUSE_META[c.clause]?.name}): ${c.pct}%`).join('\n');

  const prompt = `Please write a professional executive AI governance report. This will be presented to a CEO or board — avoid jargon, focus on business risk and practical outcomes.

ORGANISATION: ${currentOrg?.name}
ASSESSMENT DATE: ${run.date || 'Unknown'}
ASSESSOR: ${run.conductedBy || 'Not specified'}
FRAMEWORK: ISO/IEC 42001:2023 — AI Management System
OVERALL SCORE: ${score}% — Posture: ${band}
RESPONSES: ${yes} Yes, ${partial} Partial, ${no} No
SCORE TREND: ${trend || 'First assessment — no trend available'}
TREND DELTA (vs previous run): ${trendDelta}
IMPROVEMENT AREAS (ISO 42001 clauses with gains since last run): ${improvedAreas}
REGRESSION AREAS (clauses with losses since last run): ${regressedAreas}

CLAUSE BREAKDOWN:
${clauseBreakdown}

TOP NONCONFORMITIES (No answers):
${noGaps || '— None —'}

PARTIAL CONFORMITIES:
${partGaps || '— None —'}

─────────────────────────────────────────────
CRITICAL FORMATTING RULES — non-negotiable:
1. NO MARKDOWN. No **, no *, no ##, no -, no _. These appear literally in the report.
2. BULLETS: Use the actual • character. Never use - or * for lists.
3. PARAGRAPH BREAKS: Separate blocks with exactly one blank line.
4. NO SECTION LABELS in the prose — write the content only, no "Executive Summary:" headers.
─────────────────────────────────────────────

Write exactly in this order:

Write 2–3 paragraphs of executive summary prose. What does this ${score}% ${band} score mean for AI management system maturity and certification readiness? What has the organisation done well, and where is the primary risk if nonconformities are left unaddressed? ${hasTrend ? `Weave in 1–2 sentences on trend and momentum: the overall change was ${trendDelta}. ${improvedAreas && improvedAreas !== 'None — no gains detected' && improvedAreas !== 'N/A — first assessment' ? `Name the ISO 42001 clauses that showed progress (${improvedAreas}) — frame these as concrete steps toward conformance the organisation has already taken. ` : ''}${regressedAreas && regressedAreas !== 'None' && regressedAreas !== 'N/A — first assessment' ? `Acknowledge regressions (${regressedAreas}) factually. ` : ''}` : `Note that this is the first ISO 42001 baseline for ${currentOrg?.name} — frame it as the starting point for a structured conformance journey. `}Close with 1–2 forward-looking sentences on the recommended next step toward certification readiness.

KEY FINDINGS
• [The most significant nonconformity written as a business or audit risk — what is the real-world exposure]
• [3–4 findings total]
• [Focus on consequence, not the clause number]
• [Optional 4th finding]

PRIORITY RECOMMENDATIONS
• [Specific action with a one-sentence rationale tied to certification readiness or business risk]
• [2–3 recommendations total]
• [Actionable and owner-assignable]`;

  navigator.clipboard.writeText(prompt)
    .then(() => toast('✓ AI prompt copied — paste into Claude', '#152168'))
    .catch(() => toast('Clipboard blocked', '#b45309'));
}

function iso42001CopyGapPrompt() {
  const run = iso42001State.reportRun;
  if (!run) return;
  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const gaps = ISO42001_CONTROLS.filter(c => answers[c.id] === 'no' || answers[c.id] === 'partial');
  const { score } = iso42001CalcScore(answers);
  const gapList = gaps.map(c => `- [${answers[c.id].toUpperCase()}] ${c.id} (${ISO42001_CLAUSE_META[c.clause]?.label}): ${c.title}`).join('\n');

  const prompt = `I need a prioritised ISO 42001 remediation roadmap for an organisation assessed against ISO/IEC 42001:2023.

ORGANISATION: ${currentOrg?.name}
ASSESSMENT DATE: ${run.date || 'Unknown'}
OVERALL SCORE: ${score}%

NONCONFORMITIES AND PARTIAL CONFORMITIES (${gaps.length} total):
${gapList || '— No gaps —'}

Please produce:
1. A prioritised remediation roadmap grouping gaps by clause, ranked by business impact and certification criticality.
2. For each gap, a 1–2 sentence plain-language explanation of the business risk or audit finding if left unaddressed.
3. Quick wins (actions achievable within 30 days) vs. strategic initiatives (3–12 months) toward certification readiness.

Write for a non-technical audience. Focus on practical, actionable steps.`;

  navigator.clipboard.writeText(prompt)
    .then(() => toast('✓ Gap prompt copied — paste into Claude', '#152168'))
    .catch(() => toast('Clipboard blocked', '#b45309'));
}
