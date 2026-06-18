// ============================================================
// AI Governance — Unified Assessment
// 44 questions cross-walking NIST AI RMF v1.0 + ISO/IEC 42001:2023
// Weighted scoring (1–5) · Gap prioritisation · POAM · Exec report
// ============================================================

const AI_UNIFIED_CONTROLS = [

  // ── GROUP 1: Governance & Policy ─────────────────────────────────────────────
  { grp: 'g1', id: 'AIG-1.1', weight: 5, frameworks: 'both',
    title: 'AI governance policy documented',
    desc: 'A written AI governance policy or acceptable use policy exists, covering the organization\'s principles for responsible AI adoption, permitted use cases, and risk management commitments.',
    nist: ['GOVERN-1.1', 'GOVERN-6.1'], iso: ['5.2', '4.4'] },

  { grp: 'g1', id: 'AIG-1.2', weight: 4, frameworks: 'both',
    title: 'Leadership commitment to AI management',
    desc: 'Top management demonstrates active commitment to responsible AI — championing a safety-first culture, allocating resources, and integrating AI risk into business decisions.',
    nist: ['GOVERN-4.1'], iso: ['5.1'] },

  { grp: 'g1', id: 'AIG-1.3', weight: 4, frameworks: 'both',
    title: 'AI roles and accountability assigned',
    desc: 'Roles and responsibilities for AI risk management are formally defined and assigned, with clear accountability at the ownership level and for anyone deploying or using AI systems.',
    nist: ['GOVERN-1.2', 'GOVERN-2.1'], iso: ['5.3', 'A.3.2'] },

  { grp: 'g1', id: 'AIG-1.4', weight: 4, frameworks: 'both',
    title: 'AI risk tolerance and appetite defined',
    desc: 'The organization\'s risk tolerance for AI is explicitly defined — what risks are acceptable, what requires escalation, and how AI risk appetite aligns with overall business strategy.',
    nist: ['MAP-1.3', 'MAP-1.6', 'GOVERN-5.1'], iso: ['6.2'] },

  { grp: 'g1', id: 'AIG-1.5', weight: 3, frameworks: 'both',
    title: 'AI program scope and context established',
    desc: 'The scope of AI in use is documented: which AI systems are in scope, who the affected stakeholders are, what the organization\'s context is, and what external requirements apply.',
    nist: ['MAP-1.1', 'MAP-1.5'], iso: ['4.1', '4.2', '4.3'] },

  // ── GROUP 2: Risk Assessment & Planning ───────────────────────────────────────
  { grp: 'g2', id: 'AIG-2.1', weight: 5, frameworks: 'both',
    title: 'AI risk assessment process in place',
    desc: 'A repeatable process exists for identifying, assessing, and prioritizing AI risks — covering technical, ethical, operational, and third-party risks — before and during AI deployment.',
    nist: ['MAP-3.1', 'MAP-1.5', 'MAP-3.4'], iso: ['6.1', '8.2'] },

  { grp: 'g2', id: 'AIG-2.2', weight: 4, frameworks: 'both',
    title: 'AI risks documented and tracked',
    desc: 'Identified AI risks are recorded in a management system or risk register, assigned owners, and reviewed regularly to track status and emerging changes.',
    nist: ['MAP-3.4', 'GOVERN-4.2'], iso: ['7.5', '8.4'] },

  { grp: 'g2', id: 'AIG-2.3', weight: 4, frameworks: 'both',
    title: 'AI risk treatment plan documented',
    desc: 'For identified AI risks, treatment options (accept, mitigate, transfer, avoid) are selected and documented, with a plan that assigns ownership and target resolution dates.',
    nist: ['MANAGE-1.2', 'MANAGE-1.3'], iso: ['8.3'] },

  { grp: 'g2', id: 'AIG-2.4', weight: 3, frameworks: 'both',
    title: 'AI impact assessment conducted',
    desc: 'Before deploying AI systems, the organization assesses potential impacts on individuals, clients, and communities — documenting both positive benefits and potential harms.',
    nist: ['MAP-3.3', 'MAP-3.5'], iso: ['8.5', 'A.5.2'] },

  { grp: 'g2', id: 'AIG-2.5', weight: 4, frameworks: 'both',
    title: 'AI vendor and supply chain risks evaluated',
    desc: 'AI tools, platforms, and data providers are evaluated for risk before adoption, including security posture, data handling practices, jurisdictional issues, and contractual protections.',
    nist: ['GOVERN-1.6', 'MAP-2.3', 'MEASURE-2.6'], iso: ['8.6', 'A.10.2', 'A.10.3'] },

  // ── GROUP 3: Human Oversight & Culture ────────────────────────────────────────
  { grp: 'g3', id: 'AIG-3.1', weight: 5, frameworks: 'both',
    title: 'Human review of AI outputs before use',
    desc: 'AI outputs are reviewed by a qualified human before being used in client-facing work, decisions, or communications — with clear accountability for the final output.',
    nist: ['GOVERN-3.2', 'MAP-3.2'], iso: ['A.6.10'] },

  { grp: 'g3', id: 'AIG-3.2', weight: 4, frameworks: 'both',
    title: 'Responsible AI culture and ethics',
    desc: 'The organization operates with a safety-first, ethics-aware AI culture — staff understand the limits of AI, actively question AI outputs, and do not over-rely on AI for critical decisions.',
    nist: ['GOVERN-4.1', 'GOVERN-1.3'], iso: ['A.9.2'] },

  { grp: 'g3', id: 'AIG-3.3', weight: 3, frameworks: 'both',
    title: 'AI competence and awareness program',
    desc: 'Personnel who use or deploy AI receive appropriate training on AI risks, limitations, ethical use, and the organization\'s AI policies — with competence records maintained.',
    nist: ['GOVERN-2.2', 'GOVERN-3.1'], iso: ['7.2', '7.3'] },

  { grp: 'g3', id: 'AIG-3.4', weight: 3, frameworks: 'both',
    title: 'AI use disclosed to clients and users',
    desc: 'Clients and end users are informed when AI is used in work that affects them — including what AI was used for, its limitations, and how human review was applied.',
    nist: ['GOVERN-4.2'], iso: ['A.8.2', 'A.8.3'] },

  { grp: 'g3', id: 'AIG-3.5', weight: 2, frameworks: 'both',
    title: 'Stakeholder feedback on AI collected',
    desc: 'A mechanism exists to collect, review, and act on feedback from clients, users, or affected parties about AI use — informing improvements to AI governance practices.',
    nist: ['GOVERN-1.5', 'GOVERN-5.1', 'GOVERN-5.2'], iso: ['5.1'] },

  // ── GROUP 4: Data & Privacy ───────────────────────────────────────────────────
  { grp: 'g4', id: 'AIG-4.1', weight: 4, frameworks: 'both',
    title: 'Data governance for AI inputs',
    desc: 'Data used with AI systems is governed: sources are validated, quality is assessed, sensitive data is controlled, and data handling complies with privacy requirements before being fed to AI.',
    nist: ['MAP-2.3'], iso: ['A.4.3', 'A.6.6', 'A.7.3', 'A.7.4'] },

  { grp: 'g4', id: 'AIG-4.2', weight: 4, frameworks: 'both',
    title: 'Privacy risks from AI evaluated',
    desc: 'Privacy risks specific to AI use are assessed — including risks of unintended data disclosure, inference attacks, AI retaining training data, and client data being used beyond its intended scope.',
    nist: ['MEASURE-2.10'], iso: ['A.6.4'] },

  { grp: 'g4', id: 'AIG-4.3', weight: 2, frameworks: 'both',
    title: 'Data provenance and lineage tracked',
    desc: 'The origin, transformations, and limitations of data used in AI systems are documented — enabling traceability and helping identify bias or quality issues in AI outputs.',
    nist: ['MAP-3.4'], iso: ['A.7.4', 'A.7.5'] },

  { grp: 'g4', id: 'AIG-4.4', weight: 3, frameworks: 'both',
    title: 'AI infrastructure secured and managed',
    desc: 'Tools, platforms, and computing infrastructure used for AI are selected, configured, and managed with security in mind — including access controls, version management, and vulnerability awareness.',
    nist: ['MEASURE-2.7'], iso: ['A.4.2', 'A.4.4'] },

  // ── GROUP 5: AI System Lifecycle ──────────────────────────────────────────────
  { grp: 'g5', id: 'AIG-5.1', weight: 3, frameworks: 'both',
    title: 'AI system intended use documented',
    desc: 'For each AI system in use, the intended purpose, authorized use cases, known limitations, and appropriate user context are documented and communicated to those using it.',
    nist: ['MAP-1.1'], iso: ['A.6.1', 'A.6.2'] },

  { grp: 'g5', id: 'AIG-5.2', weight: 3, frameworks: 'both',
    title: 'AI system requirements and acceptance criteria defined',
    desc: 'Performance criteria, quality thresholds, and acceptance requirements are defined for AI systems before deployment — establishing clear standards for when an AI tool is fit for purpose.',
    nist: ['MEASURE-2.1'], iso: ['A.6.3', 'A.6.4'] },

  { grp: 'g5', id: 'AIG-5.3', weight: 3, frameworks: 'both',
    title: 'AI system verification and validation',
    desc: 'AI systems are evaluated before use to confirm they meet requirements — including testing for accuracy, reliability, safety, and fitness for the intended deployment context.',
    nist: ['MEASURE-2.3'], iso: ['A.6.8'] },

  { grp: 'g5', id: 'AIG-5.4', weight: 3, frameworks: 'both',
    title: 'AI system performance monitored post-deployment',
    desc: 'Deployed AI systems are actively monitored for quality, drift, unexpected behaviour, and emerging risks — with monitoring results reviewed and acted upon.',
    nist: ['MANAGE-2.2', 'MANAGE-4.1'], iso: ['A.6.9', '9.1'] },

  { grp: 'g5', id: 'AIG-5.5', weight: 2, frameworks: 'both',
    title: 'AI system decommissioning managed',
    desc: 'When AI tools or systems are retired, there is a process for safely stopping use — including data deletion, notifying affected users, and preventing unauthorized reactivation.',
    nist: ['GOVERN-1.7'], iso: ['A.6.11'] },

  // ── GROUP 6: Testing & Measurement ────────────────────────────────────────────
  { grp: 'g6', id: 'AIG-6.1', weight: 3, frameworks: 'both',
    title: 'AI risk metrics and measurement defined',
    desc: 'Measurable indicators are defined for key AI risks — enabling objective tracking of risk levels, performance trends, and the effectiveness of governance controls over time.',
    nist: ['MEASURE-1.1', 'MEASURE-1.2', 'MAP-4.1'], iso: ['9.1'] },

  { grp: 'g6', id: 'AIG-6.2', weight: 3, frameworks: 'both',
    title: 'AI systems tested and evaluated',
    desc: 'AI tools and systems are formally evaluated before and during use — including testing against known failure modes, checking for alignment with intended use, and post-deployment evaluation.',
    nist: ['MEASURE-2.1', 'MEASURE-2.4'], iso: ['A.6.8'] },

  { grp: 'g6', id: 'AIG-6.3', weight: 3, frameworks: 'nist',
    title: 'Adversarial testing and red-teaming conducted',
    desc: 'AI systems are subjected to adversarial testing — including prompt injection attempts, misuse scenarios, and red-team exercises — to uncover failure modes before they cause harm.',
    nist: ['MEASURE-2.3', 'MEASURE-2.5'], iso: null },

  { grp: 'g6', id: 'AIG-6.4', weight: 3, frameworks: 'nist',
    title: 'Bias and fairness testing conducted',
    desc: 'AI systems are tested for bias and fairness across relevant demographic groups or decision contexts — with results documented and used to guide remediation or usage restrictions.',
    nist: ['MEASURE-2.9', 'MEASURE-2.11'], iso: null },

  { grp: 'g6', id: 'AIG-6.5', weight: 3, frameworks: 'both',
    title: 'Risk mitigation effectiveness tracked',
    desc: 'Controls and mitigations put in place to address AI risks are evaluated to confirm they are working as intended — with ineffective mitigations revised or escalated.',
    nist: ['MEASURE-2.13', 'MANAGE-1.4'], iso: ['9.1'] },

  { grp: 'g6', id: 'AIG-6.6', weight: 2, frameworks: 'both',
    title: 'Independent review of AI practices',
    desc: 'AI practices and controls are periodically reviewed by someone independent of the team implementing them — providing an objective check on whether governance is effective.',
    nist: ['MEASURE-1.3'], iso: ['9.2'] },

  // ── GROUP 7: Incident Management & Improvement ────────────────────────────────
  { grp: 'g7', id: 'AIG-7.1', weight: 4, frameworks: 'both',
    title: 'AI incident detection and response',
    desc: 'A process exists for detecting, responding to, and learning from AI-related incidents — including AI errors causing harm, unexpected outputs, data leakage via AI, or misuse of AI tools.',
    nist: ['MANAGE-2.3', 'MANAGE-4.1'], iso: ['10.1'] },

  { grp: 'g7', id: 'AIG-7.2', weight: 3, frameworks: 'both',
    title: 'AI models and tools monitored for changes',
    desc: 'AI tool vendors and pre-trained models in use are actively monitored for material updates, vulnerabilities, policy changes, and behaviour drift that could affect outputs or risk posture.',
    nist: ['MANAGE-3.2'], iso: ['A.6.9'] },

  { grp: 'g7', id: 'AIG-7.3', weight: 3, frameworks: 'both',
    title: 'AI risks communicated to stakeholders',
    desc: 'AI-related risks, limitations, and incidents are communicated to relevant stakeholders — including clients, partners, or regulators — with appropriate transparency and timeliness.',
    nist: ['MANAGE-3.1'], iso: ['A.8.2'] },

  { grp: 'g7', id: 'AIG-7.4', weight: 3, frameworks: 'both',
    title: 'Continual improvement of AI practices',
    desc: 'The organization systematically learns from AI incidents, near-misses, feedback, and evaluation results — driving formal improvements to AI governance practices and controls.',
    nist: ['MANAGE-4.2'], iso: ['10.2'] },

  { grp: 'g7', id: 'AIG-7.5', weight: 3, frameworks: 'both',
    title: 'Management review of AI program',
    desc: 'Leadership formally reviews the AI management program at planned intervals — assessing risk status, audit results, performance against objectives, and opportunities for improvement.',
    nist: ['GOVERN-5.1'], iso: ['9.3'] },

  { grp: 'g7', id: 'AIG-7.6', weight: 3, frameworks: 'nist',
    title: 'AI program effectiveness assessed',
    desc: 'The organization periodically assesses whether its AI systems are achieving their intended purpose and whether the overall AI risk management program is delivering its intended value.',
    nist: ['MANAGE-1.1'], iso: null },

  // ── GROUP 8: ISO Management System Addons (ISO-only) ─────────────────────────
  { grp: 'g8', id: 'AIG-8.1', weight: 2, frameworks: 'iso',
    title: 'AIMS documented information system',
    desc: 'The organization maintains a structured set of documented information required by ISO 42001 — including the AIMS scope, policy, risk assessments, objectives, and treatment plans.',
    nist: null, iso: ['7.5'] },

  { grp: 'g8', id: 'AIG-8.2', weight: 3, frameworks: 'iso',
    title: 'AI objectives formally established',
    desc: 'Measurable AI management objectives are established, communicated, and tracked — aligned with the AI policy and with clear plans for how they will be achieved and evaluated.',
    nist: null, iso: ['6.2'] },

  { grp: 'g8', id: 'AIG-8.3', weight: 2, frameworks: 'iso',
    title: 'Resources formally allocated for AIMS',
    desc: 'The resources needed to establish, implement, and maintain the AI management system — including budget, personnel, tools, and time — are formally determined and provided.',
    nist: null, iso: ['7.1'] },

  { grp: 'g8', id: 'AIG-8.4', weight: 2, frameworks: 'iso',
    title: 'Internal audit of AI management system',
    desc: 'Internal audits of the AI management system are conducted at planned intervals, with findings reported to management and nonconformities addressed through corrective action.',
    nist: null, iso: ['9.2'] },

  // ── GROUP 9: NIST Measurement Addons (NIST-only) ─────────────────────────────
  { grp: 'g9', id: 'AIG-9.1', weight: 2, frameworks: 'nist',
    title: 'AI risk research incorporated into practices',
    desc: 'Emerging research on AI risks, attack vectors, failure modes, and best practices is actively monitored and incorporated into the organization\'s AI governance and procurement practices.',
    nist: ['MAP-2.1', 'MAP-2.2'], iso: null },

  { grp: 'g9', id: 'AIG-9.2', weight: 3, frameworks: 'nist',
    title: 'Dedicated resources for AI risk management',
    desc: 'Specific resources — time, budget, or expertise — are dedicated to AI risk management activities, rather than treating AI risk as an incidental part of other responsibilities.',
    nist: ['MAP-1.4', 'MANAGE-2.1'], iso: null },

  { grp: 'g9', id: 'AIG-9.3', weight: 2, frameworks: 'nist',
    title: 'End-user feedback incorporated into AI evaluation',
    desc: 'Feedback from end users and affected parties about AI system performance, errors, and impacts is systematically collected and incorporated into AI evaluation and improvement cycles.',
    nist: ['MEASURE-3.3'], iso: null },

  { grp: 'g9', id: 'AIG-9.4', weight: 2, frameworks: 'nist',
    title: 'AI risk measurement connected to deployment context',
    desc: 'Risk measurement approaches are tailored to the specific deployment context and use case — rather than applying generic metrics that may not reflect actual risk in the operational environment.',
    nist: ['MEASURE-4.1', 'MAP-4.2'], iso: null },
];

// ── GROUP META ────────────────────────────────────────────────────────────────

const AI_GROUP_META = {
  g1: { label: 'Governance & Policy',         icon: '🏛️', color: '#152168', light: '#dbeafe', txt: '#1e40af' },
  g2: { label: 'Risk Assessment & Planning',  icon: '🗺️', color: '#0e7490', light: '#cffafe', txt: '#0e7490' },
  g3: { label: 'Human Oversight & Culture',   icon: '👁️', color: '#15803d', light: '#dcfce7', txt: '#166534' },
  g4: { label: 'Data & Privacy',              icon: '🔒', color: '#7c3aed', light: '#ede9fe', txt: '#6d28d9' },
  g5: { label: 'AI System Lifecycle',         icon: '⚙️', color: '#b45309', light: '#fef3c7', txt: '#92400e' },
  g6: { label: 'Testing & Measurement',       icon: '📏', color: '#dc2626', light: '#fee2e2', txt: '#b91c1c' },
  g7: { label: 'Incident Mgmt & Improvement', icon: '🔄', color: '#4f46e5', light: '#e0e7ff', txt: '#4338ca' },
  g8: { label: 'ISO Management System',       icon: '📋', color: '#0f766e', light: '#ccfbf1', txt: '#0f766e' },
  g9: { label: 'NIST Measurement Framework',  icon: '📐', color: '#1e40af', light: '#dbeafe', txt: '#1e40af' },
};

const AI_GROUP_ORDER = ['g1','g2','g3','g4','g5','g6','g7','g8','g9'];

const AI_REMEDIATION = {
  'AIG-1.1': 'Draft and publish an AI Acceptable Use Policy. Use an industry template (NIST AI RMF or ISO 42001 aligned), get legal/leadership sign-off, and communicate it to all staff.',
  'AIG-1.2': 'Schedule quarterly AI risk briefings for leadership. Assign a senior sponsor, include AI risk on exec/board agendas, and set annual AI governance goals.',
  'AIG-1.3': 'Define AI responsibilities in your RACI. Assign a named AI Risk Owner and document who is accountable for each AI system in use.',
  'AIG-1.4': 'Define your AI risk appetite in writing. Specify permitted, conditional, and prohibited AI use cases and align this to your enterprise risk framework.',
  'AIG-1.5': 'Run an AI inventory exercise. List every AI tool in use, document its purpose, affected stakeholders, and applicable regulatory requirements.',
  'AIG-2.1': 'Implement a repeatable AI risk assessment template. Assess technical, ethical, operational, and third-party risks for each AI system before and during deployment.',
  'AIG-2.2': 'Add an AI section to your risk register. Record each identified AI risk with owner, likelihood, impact, and current treatment status.',
  'AIG-2.3': 'Create an AI risk treatment plan. For each risk, document the chosen treatment (accept/mitigate/transfer/avoid), assign an owner, and set a target completion date.',
  'AIG-2.4': 'Conduct AI impact assessments before deploying AI in client-facing or decision-making contexts. Document potential harms and mitigations.',
  'AIG-2.5': 'Integrate AI vendor evaluation into procurement. Assess each AI vendor\'s security posture, data handling, jurisdiction, and contractual protections before signing.',
  'AIG-3.1': 'Establish a human-in-the-loop policy. Require review and sign-off by a qualified person before any AI output is used in client work or high-stakes decisions.',
  'AIG-3.2': 'Run AI ethics and awareness sessions. Publish guidelines on responsible AI use and foster a culture of constructive skepticism about AI outputs.',
  'AIG-3.3': 'Create an AI awareness training module covering risks, limitations, ethical use, and your AI policy. Track completions and refresh annually.',
  'AIG-3.4': 'Add an AI use disclosure to engagement letters or terms of service. Be transparent about what AI is used for and how human review is applied.',
  'AIG-3.5': 'Add an AI feedback channel (shared inbox or survey). Review feedback quarterly and use findings to improve AI governance practices.',
  'AIG-4.1': 'Classify data before feeding it to AI tools. Restrict sensitive or regulated data from public AI platforms and document your AI data handling policy.',
  'AIG-4.2': 'Conduct a privacy impact assessment for each AI system that handles personal data. Apply data minimization controls and document risks.',
  'AIG-4.3': 'Implement data lineage tracking for AI inputs. Document data sources, transformations applied, and any known quality or bias limitations.',
  'AIG-4.4': 'Extend your information security program to cover AI infrastructure. Ensure AI endpoints, APIs, and pipelines have appropriate access controls and a patching cadence.',
  'AIG-5.1': 'Create an AI system register. For each AI tool in use, document intended purpose, authorized use cases, known limitations, and who is permitted to use it.',
  'AIG-5.2': 'Define acceptance criteria before deploying AI. Specify performance thresholds and require documented sign-off before any AI system goes to production.',
  'AIG-5.3': 'Validate AI systems before use. Test for accuracy, reliability, and fitness for the intended context; document results and address failures before deployment.',
  'AIG-5.4': 'Set up AI performance monitoring. Define KPIs for each deployed AI system, establish alert thresholds, and review metrics on a scheduled cadence.',
  'AIG-5.5': 'Create an AI decommissioning procedure. Define how tools are retired, how data is handled at end-of-life, and who approves decommissioning.',
  'AIG-6.1': 'Define measurable AI risk indicators. Track error rates, bias metrics, governance coverage, and control effectiveness on a regular basis.',
  'AIG-6.2': 'Formalize AI system evaluation. Conduct structured testing against known failure modes and post-deployment evaluations; document results and track trends.',
  'AIG-6.3': 'Conduct regular adversarial testing on AI systems. Test for prompt injection, misuse scenarios, and evasion; document findings and remediate before the next cycle.',
  'AIG-6.4': 'Conduct bias and fairness testing on AI systems that inform decisions about people. Use a structured framework and document findings with remediation actions.',
  'AIG-6.5': 'Periodically evaluate whether AI risk mitigations are working as intended. Revise or escalate controls that are ineffective.',
  'AIG-6.6': 'Schedule an annual independent review of AI practices. Use an external reviewer or a cross-functional internal team to assess governance objectively.',
  'AIG-7.1': 'Extend your incident response playbook to cover AI incidents. Define what constitutes an AI incident, assign an IR owner, and run a tabletop exercise.',
  'AIG-7.2': 'Monitor AI vendor changelogs and model updates. Subscribe to vendor notifications and assess the impact of material changes on your risk posture.',
  'AIG-7.3': 'Establish a process for communicating AI risks to clients and partners. Define disclosure triggers and assign responsibility for stakeholder communications.',
  'AIG-7.4': 'Implement a lessons-learned process for AI incidents. Conduct retrospectives after each significant event and formally update governance documentation.',
  'AIG-7.5': 'Schedule annual management reviews of the AI program. Cover risk status, audit results, performance against objectives, and improvement priorities.',
  'AIG-7.6': 'Define AI program effectiveness metrics. Assess annually whether AI systems are delivering intended value and whether governance controls are functioning.',
  'AIG-8.1': 'Establish an AIMS documentation set. Create and maintain the scope statement, AI policy, risk register, objectives, and treatment plans required by ISO 42001.',
  'AIG-8.2': 'Set measurable AI management objectives. Align them to your AI policy, assign owners, and report on progress at management reviews.',
  'AIG-8.3': 'Formally allocate resources for AI management. Document the budget, roles, and tools dedicated to the AI management system in your resource planning.',
  'AIG-8.4': 'Schedule and conduct internal audits of the AI management system. Report findings to management and address nonconformities through corrective action.',
  'AIG-9.1': 'Subscribe to AI risk research feeds (NIST, ENISA, MITRE ATLAS). Assign someone to monitor developments and update governance practices at least annually.',
  'AIG-9.2': 'Formally allocate time and budget for AI risk management. Create a dedicated role or assign explicit hours rather than treating it as an afterthought.',
  'AIG-9.3': 'Implement structured end-user feedback for AI systems. Use surveys or check-ins to collect insights and feed them into your evaluation cycle.',
  'AIG-9.4': 'Tailor AI risk metrics to each deployment context. Avoid generic indicators — define measures that reflect the actual risks in your operational environment.',
};

const AI_WEIGHT_LABELS = { 5: 'Critical', 4: 'High', 3: 'Medium', 2: 'Low', 1: 'Info' };
const AI_WEIGHT_COLORS = { 5: '#dc2626', 4: '#ea580c', 3: '#b45309', 2: '#4f46e5', 1: '#6b7280' };

// ── HELPERS ───────────────────────────────────────────────────────────────────

function aiuActiveControls(frameworks) {
  const nist = frameworks?.nist !== false;
  const iso  = frameworks?.iso  !== false;
  return AI_UNIFIED_CONTROLS.filter(c =>
    (c.frameworks === 'both') ||
    (c.frameworks === 'nist' && nist) ||
    (c.frameworks === 'iso'  && iso)
  );
}

function aiuCalcScore(answers, frameworks) {
  const nistOn = frameworks?.nist !== false;
  const isoOn  = frameworks?.iso  !== false;
  let totalW = 0, earnedW = 0;
  let nistW = 0, nistEarned = 0;
  let isoW  = 0, isoEarned  = 0;

  AI_UNIFIED_CONTROLS.forEach(c => {
    const v = answers[c.id];
    const val = v === 'yes' ? 1 : v === 'partial' ? 0.5 : v === 'no' ? 0 : null;
    if (val === null) return; // unanswered or na

    const hasNist = c.nist && c.nist.length > 0;
    const hasIso  = c.iso  && c.iso.length  > 0;
    const inScope = (c.frameworks === 'both') ||
                    (c.frameworks === 'nist' && nistOn) ||
                    (c.frameworks === 'iso'  && isoOn);
    if (!inScope) return;

    totalW  += c.weight;
    earnedW += val * c.weight;
    if (hasNist && nistOn && c.frameworks !== 'iso') {
      nistW += c.weight; nistEarned += val * c.weight;
    }
    if (hasIso && isoOn && c.frameworks !== 'nist') {
      isoW  += c.weight; isoEarned  += val * c.weight;
    }
  });

  return {
    overall: totalW  > 0 ? Math.round(earnedW  / totalW  * 100) : null,
    nist:    nistW   > 0 ? Math.round(nistEarned / nistW  * 100) : null,
    iso:     isoW    > 0 ? Math.round(isoEarned  / isoW   * 100) : null,
    totalW, earnedW, nistW, isoW,
  };
}

function aiuWeightedGaps(answers, frameworks) {
  const active = aiuActiveControls(frameworks);
  return active
    .filter(c => answers[c.id] === 'no' || answers[c.id] === 'partial')
    .map(c => {
      const v = answers[c.id];
      const deficit = v === 'no' ? 1 : 0.5;
      return { ...c, answer: v, priorityScore: c.weight * deficit };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

function aiuCalcGroupScores(answers, frameworks) {
  return AI_GROUP_ORDER.map(grp => {
    const controls = aiuActiveControls(frameworks).filter(c => c.grp === grp);
    let totalW = 0, earnedW = 0;
    controls.forEach(c => {
      const v = answers[c.id];
      const val = v === 'yes' ? 1 : v === 'partial' ? 0.5 : null;
      if (val === null) return;
      totalW += c.weight; earnedW += val * c.weight;
    });
    return { grp, pct: totalW > 0 ? Math.round(earnedW / totalW * 100) : null,
             answered: controls.filter(c => answers[c.id] && answers[c.id] !== 'na').length,
             total: controls.length };
  }).filter(g => g.total > 0);
}

function aiuLatestIdx(runs) {
  if (!runs.length) return -1;
  return runs.reduce((best, r, i) => ((r.date || '') > (runs[best].date || '') ? i : best), 0);
}

function aiuFrameworksFromRun(run) {
  try {
    const f = (run?.answers || {})._frameworks;
    return f ? JSON.parse(f) : { nist: true, iso: true };
  } catch { return { nist: true, iso: true }; }
}

function aiuScoreColor(s) {
  if (s === null || s === undefined) return 'var(--muted)';
  return s >= 75 ? '#15803d' : s >= 60 ? '#b45309' : s >= 40 ? '#ea580c' : '#dc2626';
}

function aiuScoreBand(s) {
  if (s === null) return 'No data';
  return s >= 75 ? 'Strong' : s >= 60 ? 'Moderate' : s >= 40 ? 'Elevated Risk' : 'High Risk';
}

// ── RENDER ROUTER ─────────────────────────────────────────────────────────────

function renderAiUnified() {
  switch (aiUnifiedState.view) {
    case 'form':   return renderAiUnifiedForm();
    case 'gap':    return renderAiUnifiedGapReport();
    case 'poam':   return renderAiUnifiedPoam();
    case 'report': return renderAiUnifiedExecReport();
    case 'matrix': return renderAiUnifiedMatrix();
    default:       return renderAiUnifiedDashboard();
  }
}

// ── FRAMEWORK TOGGLE CHIPS ────────────────────────────────────────────────────

function aiuFrameworkChips(fw, onToggle) {
  const n = fw?.nist !== false;
  const i = fw?.iso  !== false;
  return `<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
    <span style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em">Frameworks:</span>
    <button onclick="${onToggle}('nist')"
      style="padding:3px 10px;font-size:11px;font-weight:700;border-radius:12px;cursor:pointer;border:2px solid ${n?'#152168':'#dde3ef'};background:${n?'#152168':'transparent'};color:${n?'#fff':'var(--muted)'}">
      🏛️ NIST AI RMF
    </button>
    <button onclick="${onToggle}('iso')"
      style="padding:3px 10px;font-size:11px;font-weight:700;border-radius:12px;cursor:pointer;border:2px solid ${i?'#0f766e':'#dde3ef'};background:${i?'#0f766e':'transparent'};color:${i?'#fff':'var(--muted)'}">
      📋 ISO 42001
    </button>
    ${(!n&&!i)?'<span style="font-size:11px;color:#dc2626;font-weight:700">Select at least one framework</span>':''}
  </div>`;
}

function aiuToggleDashFw(fw) {
  const f = aiUnifiedState.frameworks;
  if (fw === 'nist') f.nist = !f.nist;
  else f.iso = !f.iso;
  if (!f.nist && !f.iso) { f.nist = true; f.iso = true; } // prevent both off
  renderMain(); setTimeout(aiuTrendDraw, 80);
}

function aiuToggleFormFw(fw) {
  const f = aiUnifiedState.frameworks;
  if (fw === 'nist') f.nist = !f.nist;
  else f.iso = !f.iso;
  if (!f.nist && !f.iso) { f.nist = true; f.iso = true; }
  renderMain();
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

function renderAiUnifiedDashboard() {
  const orgId = currentOrg?.id;
  const runs = (orgAssessments[orgId] || {})['ai_unified'] || [];
  const latestIdx = aiuLatestIdx(runs);
  const latest = latestIdx >= 0 ? runs[latestIdx] : null;
  const answers = latest
    ? Object.fromEntries(Object.entries(latest.answers || {}).filter(([k]) => !k.startsWith('_')))
    : {};
  const fw = aiUnifiedState.frameworks;
  const scores = latest ? aiuCalcScore(answers, fw) : { overall: null, nist: null, iso: null };
  const groupScores = latest ? aiuCalcGroupScores(answers, fw) : [];
  const prevRuns = [...runs].sort((a,b) => (a.date||'').localeCompare(b.date||''));
  const prevRun = prevRuns.length >= 2 ? prevRuns[prevRuns.length - 2] : null;
  const prevScores = prevRun ? aiuCalcScore(
    Object.fromEntries(Object.entries(prevRun.answers||{}).filter(([k])=>!k.startsWith('_'))), fw
  ) : null;
  const scoreChange = (scores.overall !== null && prevScores?.overall != null) ? scores.overall - prevScores.overall : null;

  const groupBarsHtml = groupScores.filter(g => g.pct !== null).map(g => {
    const m = AI_GROUP_META[g.grp];
    return `<div style="flex:1;min-width:70px">
      <div style="font-size:9px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.icon} ${m.label.split(' ')[0]}</div>
      <div style="height:4px;background:rgba(255,255,255,.12);border-radius:2px">
        <div style="height:100%;width:${g.pct}%;background:${m.light};border-radius:2px;transition:width .4s"></div>
      </div>
      <div style="font-size:9px;color:rgba(255,255,255,.4);margin-top:2px">${g.pct}%</div>
    </div>`;
  }).join('');

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🤖 AI Governance Assessment</div>
      <div style="font-size:12px;color:var(--muted)">44 questions · NIST AI RMF v1.0 × ISO/IEC 42001:2023 cross-walk · Weighted gap prioritisation</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="setNav('ai_readiness')">← Hub</button>
      <button class="btn btn-cyan btn-sm" onclick="aiuStartNew()">+ New Assessment</button>
    </div>
  </div>

  <div class="score-hero-ins" style="margin-bottom:1.25rem">
    <div style="flex:1;display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        ${aiuFrameworkChips(fw, 'aiuToggleDashFw')}
        ${latest ? `<div style="font-size:10px;color:rgba(255,255,255,.4)">${runs.length} assessment${runs.length!==1?'s':''} recorded</div>` : ''}
      </div>
      <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start">
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">Overall Score</div>
          <div class="score-big" style="color:#fff">${scores.overall !== null ? scores.overall : '—'}<span style="font-size:18px">${scores.overall!==null?'%':''}</span></div>
          ${scores.overall !== null ? `<div style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;display:inline-block;margin-top:6px;background:rgba(255,255,255,.08);color:${aiuScoreColor(scores.overall)}">${aiuScoreBand(scores.overall)}</div>` : ''}
          ${scoreChange !== null ? `<div style="font-size:11px;color:${scoreChange>=0?'#4ade80':'#f87171'};margin-top:4px">${scoreChange>=0?'▲':'▼'} ${Math.abs(scoreChange)}% vs previous</div>` : ''}
          ${!latest ? `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">No assessments yet</div>` : ''}
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          ${fw.nist !== false ? `<div>
            <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">NIST AI RMF</div>
            <div style="font-size:28px;font-weight:800;color:#93c5fd;line-height:1">${scores.nist!==null?scores.nist+'%':'—'}</div>
          </div>` : ''}
          ${fw.iso !== false ? `<div>
            <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">ISO 42001</div>
            <div style="font-size:28px;font-weight:800;color:#6ee7b7;line-height:1">${scores.iso!==null?scores.iso+'%':'—'}</div>
          </div>` : ''}
        </div>
        ${groupBarsHtml ? `<div style="flex:1;min-width:280px"><div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px">Group Coverage</div><div style="display:flex;gap:6px;flex-wrap:wrap">${groupBarsHtml}</div></div>` : ''}
      </div>
    </div>
    <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:8px">
      ${runs.length >= 2 ? `<div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">Score Trend</div>
        <canvas id="aiuTrendChart" width="200" height="60"></canvas>` : ''}
    </div>
  </div>

  <div class="card" style="padding:1.25rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.1rem;flex-wrap:wrap;gap:8px">
      <div style="font-size:14px;font-weight:700;color:var(--text)">Assessment History</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" onclick="aiuOpenMatrix()">⊞ Compare Matrix</button>
        <button class="btn btn-outline btn-sm" onclick="aiuOpenPoam(-1)">📋 POAM</button>
        <button class="btn btn-cyan btn-sm" onclick="aiuStartNew()">+ New Assessment</button>
      </div>
    </div>`;

  if (!runs.length) {
    html += `<div style="text-align:center;padding:2.5rem 1rem;color:var(--muted)">
      <div style="font-size:32px;margin-bottom:.75rem">🤖</div>
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:6px">No assessments yet</div>
      <div style="font-size:12px;margin-bottom:1.25rem">Run your first AI governance assessment to benchmark your NIST AI RMF and ISO 42001 posture.</div>
      <button class="btn btn-cyan btn-sm" onclick="aiuStartNew()">+ Start First Assessment</button>
    </div>`;
  } else {
    html += `<table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="border-bottom:2px solid var(--border)">
        <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Date</th>
        <th style="text-align:center;padding:7px 8px;font-size:11px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.05em">Overall</th>
        <th style="text-align:center;padding:7px 8px;font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.05em">NIST</th>
        <th style="text-align:center;padding:7px 8px;font-size:11px;font-weight:700;color:#0f766e;text-transform:uppercase;letter-spacing:.05em">ISO</th>
        <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Conducted By</th>
        <th style="text-align:right;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Actions</th>
      </tr></thead>
      <tbody>`;

    // Sort newest-first for display; preserve original index for action button callbacks
    const sortedRuns = runs.map((r, origIdx) => ({ r, origIdx }))
      .sort((a, b) => (b.r.date||'').localeCompare(a.r.date||''));
    sortedRuns.forEach(({ r, origIdx }) => {
      const cleanAns = Object.fromEntries(Object.entries(r.answers||{}).filter(([k])=>!k.startsWith('_')));
      const runFw = aiuFrameworksFromRun(r);
      const sc = aiuCalcScore(cleanAns, runFw);
      const isLatest = origIdx === latestIdx;
      html += `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px;font-weight:${isLatest?'700':'400'};white-space:nowrap">
          ${r.date||'—'}
          ${isLatest?'<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;background:#dbeafe;color:#1d4ed8;margin-left:6px">Latest</span>':''}
        </td>
        <td style="padding:8px 8px;text-align:center">
          <span style="font-size:14px;font-weight:700;color:${aiuScoreColor(sc.overall)}">${sc.overall??'—'}</span>${sc.overall!==null?'<span style="font-size:11px;color:var(--muted)">%</span>':''}
        </td>
        <td style="padding:8px 8px;text-align:center">
          ${runFw.nist!==false && sc.nist!==null ? `<span style="font-size:12px;font-weight:700;color:#1d4ed8">${sc.nist}%</span>` : '<span style="color:var(--muted);font-size:11px">—</span>'}
        </td>
        <td style="padding:8px 8px;text-align:center">
          ${runFw.iso!==false && sc.iso!==null ? `<span style="font-size:12px;font-weight:700;color:#0f766e">${sc.iso}%</span>` : '<span style="color:var(--muted);font-size:11px">—</span>'}
        </td>
        <td style="padding:8px 10px;color:var(--muted)">${escH(r.conductedBy||'—')}</td>
        <td style="padding:8px 10px;text-align:right">
          <div style="display:flex;gap:4px;justify-content:flex-end;flex-wrap:wrap">
            <button class="btn btn-outline btn-sm" onclick="aiuOpenAssessment(${origIdx})">✏️ Edit</button>
            <button class="btn btn-outline btn-sm" onclick="aiuOpenGapReport(${origIdx})">🔍 Gaps</button>
            <button class="btn btn-outline btn-sm" onclick="aiuOpenPoam(${origIdx})">📋 POAM</button>
            <button class="btn btn-outline btn-sm" onclick="aiuOpenReport(${origIdx})">📊 Report</button>
            <button class="btn btn-red btn-sm" onclick="aiuDeleteConfirm(${origIdx})">🗑</button>
          </div>
        </td>
      </tr>`;
    });
    html += `</tbody></table>`;
  }
  html += `</div>`;
  return html;
}

function aiuTrendDraw() {
  const canvas = document.getElementById('aiuTrendChart');
  if (!canvas) return;
  const runs = (orgAssessments[currentOrg?.id]||{})['ai_unified'] || [];
  const fw = aiUnifiedState.frameworks;
  const sorted = [...runs].sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  if (sorted.length < 2) return;
  const scores = sorted.map(r => {
    const ans = Object.fromEntries(Object.entries(r.answers||{}).filter(([k])=>!k.startsWith('_')));
    return aiuCalcScore(ans, aiuFrameworksFromRun(r)).overall ?? 0;
  });
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height, pad = 6;
  ctx.clearRect(0,0,W,H);
  const pts = scores.map((s,i) => ({
    x: pad + (i/(scores.length-1))*(W-pad*2),
    y: H - pad - (s/100)*(H-pad*2),
  }));
  ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=1;
  [20,40,60,80].forEach(v => {
    const y = H-pad-(v/100)*(H-pad*2);
    ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(W-pad,y); ctx.stroke();
  });
  const grad = ctx.createLinearGradient(0,0,W,0);
  grad.addColorStop(0,'rgba(7,180,217,0.4)'); grad.addColorStop(1,'rgba(7,180,217,1)');
  ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
  pts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
  ctx.strokeStyle=grad; ctx.lineWidth=2.5; ctx.lineJoin='round'; ctx.stroke();
  pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2); ctx.fillStyle='#07D1F2'; ctx.fill(); });
}

// ── ASSESSMENT FORM ───────────────────────────────────────────────────────────

function renderAiUnifiedForm() {
  const isEdit = !!aiUnifiedState.editId;
  const fw = aiUnifiedState.frameworks;
  const active = aiuActiveControls(fw);
  const scores = aiuCalcScore(aiUnifiedState.answers, fw);
  const answered = active.filter(c => aiUnifiedState.answers[c.id] && aiUnifiedState.answers[c.id] !== 'na').length;

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🤖 AI Governance — ${isEdit?'Edit Assessment':'New Assessment'}</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name||'')} · ${active.length} questions in scope</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button>
      <button class="btn btn-cyan btn-sm" id="aiuSaveBtn" onclick="aiuSave()">Save Assessment</button>
    </div>
  </div>

  <div class="card" style="padding:1rem;margin-bottom:1rem">
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end;margin-bottom:12px">
      <div style="flex:1;min-width:180px">
        <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px">ASSESSMENT DATE</label>
        <input type="date" id="aiuDate" value="${aiUnifiedState.date||new Date().toISOString().slice(0,10)}"
          style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px;font-size:13px">
      </div>
      <div style="flex:1;min-width:180px">
        <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px">CONDUCTED BY</label>
        <input type="text" id="aiuConductedBy" placeholder="Name or role…" value="${escH(aiUnifiedState.conductedBy||'')}"
          style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px;font-size:13px">
      </div>
      <div style="min-width:160px;display:flex;gap:16px">
        ${fw.nist!==false ? `<div><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:2px">NIST Score</div><div style="font-size:22px;font-weight:800;color:#1d4ed8">${scores.nist!==null?scores.nist+'%':'—'}</div></div>` : ''}
        ${fw.iso!==false  ? `<div><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:2px">ISO Score</div><div style="font-size:22px;font-weight:800;color:#0f766e">${scores.iso!==null?scores.iso+'%':'—'}</div></div>` : ''}
        <div><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:2px">Answered</div><div style="font-size:22px;font-weight:800;color:var(--navy)">${answered}/${active.length}</div></div>
      </div>
    </div>
    ${aiuFrameworkChips(fw, 'aiuToggleFormFw')}
    <div style="margin-top:10px;padding:8px 12px;border-radius:6px;background:#f0f9ff;border:1px solid #bae6fd;font-size:11px;color:#0369a1">
      <strong>Cross-walk:</strong> Each question maps to one or more NIST AI RMF sub-categories and/or ISO 42001 clauses, shown as reference badges. Groups 8 &amp; 9 are framework-specific addon questions shown based on your selection above.
    </div>
  </div>`;

  AI_GROUP_ORDER.forEach(grpKey => {
    const controls = aiuActiveControls(fw).filter(c => c.grp === grpKey);
    if (!controls.length) return;
    const m = AI_GROUP_META[grpKey];
    const panelOpen = aiUnifiedState.openPanels[grpKey] !== false;
    let grpW = 0, grpEarned = 0;
    controls.forEach(c => {
      const v = aiUnifiedState.answers[c.id];
      const val = v==='yes'?1:v==='partial'?0.5:null;
      if (val===null) return;
      grpW += c.weight; grpEarned += val*c.weight;
    });
    const grpPct = grpW > 0 ? Math.round(grpEarned/grpW*100) : null;

    html += `
    <div class="card" style="margin-bottom:.75rem;overflow:hidden">
      <div onclick="aiuTogglePanel('${grpKey}')" style="cursor:pointer;padding:.9rem 1.1rem;display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,${m.color},${m.color}dd)">
        <span style="font-size:16px">${m.icon}</span>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700;color:#fff">${m.label}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.6)">${controls.length} question${controls.length!==1?'s':''}</div>
        </div>
        <div style="text-align:right">
          ${grpPct!==null ? `<div style="font-size:18px;font-weight:800;color:#fff">${grpPct}%</div>` : `<div style="font-size:11px;color:rgba(255,255,255,.4)">Not started</div>`}
        </div>
        <span style="font-size:14px;color:rgba(255,255,255,.6);margin-left:8px">${panelOpen?'▲':'▼'}</span>
      </div>
      <div style="${panelOpen?'':'display:none'}padding:.75rem 1rem">`;

    controls.forEach(ctrl => {
      const val = aiUnifiedState.answers[ctrl.id] || '';
      const note = aiUnifiedState.notes[ctrl.id] || '';
      const commentOpen = aiUnifiedState.openComments[ctrl.id];
      const ansColors = { yes:'#15803d', partial:'#b45309', no:'#dc2626', na:'#5a6a8a' };
      const ansLabels = { yes:'Yes', partial:'Partial', no:'No', na:'N/A' };
      const wLabel = AI_WEIGHT_LABELS[ctrl.weight];
      const wColor = AI_WEIGHT_COLORS[ctrl.weight];
      const bgColor = val==='yes'?'#f0fdf4':val==='partial'?'#fffbeb':val==='no'?'#fef2f2':val==='na'?'#f8fafc':'#fff';
      const borderColor = val==='yes'?'#dcfce7':val==='partial'?'#fef3c7':val==='no'?'#fee2e2':val==='na'?'#e2e8f0':'var(--border)';

      const nistBadges = ctrl.nist ? ctrl.nist.map(id => `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:#dbeafe;color:#1e40af">${id}</span>`).join(' ') : '';
      const isoBadges  = ctrl.iso  ? ctrl.iso.map(id  => `<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:#ccfbf1;color:#0f766e">${id}</span>`).join(' ')  : '';

      html += `
      <div style="margin-bottom:.75rem;padding:.65rem .75rem;border-radius:6px;border:1px solid ${borderColor};background:${bgColor}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap">
          <div style="flex:1;min-width:220px">
            <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:3px;flex-wrap:wrap">
              <span style="font-size:10px;font-weight:700;color:${m.color};white-space:nowrap">${ctrl.id}</span>
              <span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;background:${wColor}22;color:${wColor}">${wLabel}</span>
              <span style="font-size:12px;font-weight:700;color:var(--text)">${escH(ctrl.title)}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);line-height:1.45;margin-bottom:4px">${escH(ctrl.desc)}</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap">
              ${nistBadges}${isoBadges}
            </div>
            ${note ? `<div style="margin-top:4px;font-size:11px;color:var(--muted);font-style:italic">📝 ${escH(note)}</div>` : ''}
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;align-items:center;flex-wrap:wrap">
            ${['yes','partial','no','na'].map(a => `<button onclick="aiuAnswer('${ctrl.id}','${a}')"
              style="padding:4px 9px;font-size:11px;font-weight:700;border-radius:6px;cursor:pointer;border:2px solid ${val===a?ansColors[a]:'#dde3ef'};background:${val===a?ansColors[a]:'transparent'};color:${val===a?'#fff':'#5a6a8a'};transition:all .12s">${ansLabels[a]}</button>`).join('')}
            <button onclick="aiuToggleComment('${ctrl.id}')" title="Add note"
              style="padding:4px 8px;font-size:11px;border-radius:6px;cursor:pointer;border:1px solid var(--border);background:${commentOpen||note?'#f0f4ff':'transparent'};color:${commentOpen||note?'var(--navy)':'var(--muted)'}">💬</button>
          </div>
        </div>
        ${commentOpen ? `<div style="margin-top:8px">
          <textarea id="aiu_note_${ctrl.id.replace(/-/g,'_')}" placeholder="Assessor note or evidence reference…"
            style="width:100%;min-height:56px;padding:6px 9px;border:1px solid var(--border);border-radius:6px;font-size:12px;resize:vertical"
            onblur="aiuSaveNote('${ctrl.id}',this.value)">${escH(note)}</textarea>
        </div>` : ''}
      </div>`;
    });

    html += `</div></div>`;
  });

  html += `<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:1rem">
    <button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Cancel</button>
    <button class="btn btn-cyan" onclick="aiuSave()">Save Assessment</button>
  </div>`;
  return html;
}

// ── GAP REPORT ────────────────────────────────────────────────────────────────

function renderAiUnifiedGapReport() {
  const run = aiUnifiedState.reportRun;
  if (!run) return `<div class="card" style="padding:2rem;text-align:center"><button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button></div>`;
  const answers = Object.fromEntries(Object.entries(run.answers||{}).filter(([k])=>!k.startsWith('_')));
  const fw = aiuFrameworksFromRun(run);
  const gaps = aiuWeightedGaps(answers, fw);
  const top5 = gaps.slice(0, 5);
  const scores = aiuCalcScore(answers, fw);
  const noCount = gaps.filter(g => g.answer === 'no').length;
  const partCount = gaps.filter(g => g.answer === 'partial').length;

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">🔍 AI Governance Gap Report</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name||'')} · ${run.date||'—'} · Overall: ${scores.overall??'—'}%${fw.nist!==false&&scores.nist!==null?' · NIST: '+scores.nist+'%':''}${fw.iso!==false&&scores.iso!==null?' · ISO: '+scores.iso+'%':''}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="aiuOpenPoam(-1)">📋 Open POAM</button>
      <button class="btn btn-outline btn-sm" onclick="aiuCopyGapPrompt()">📋 AI Prompt</button>
    </div>
  </div>

  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem">
    ${[{label:'Total Gaps',val:gaps.length,col:'var(--navy)'},{label:'No',val:noCount,col:'#dc2626'},{label:'Partial',val:partCount,col:'#b45309'}]
      .map(s=>`<div style="padding:8px 14px;border-radius:8px;background:var(--card);border:1px solid var(--border);text-align:center;min-width:70px">
        <div style="font-size:20px;font-weight:800;color:${s.col}">${s.val}</div>
        <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-top:1px">${s.label}</div>
      </div>`).join('')}
  </div>`;

  if (!gaps.length) {
    html += `<div class="card" style="text-align:center;padding:3rem 1rem">
      <div style="font-size:32px;margin-bottom:.75rem">🎉</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:4px">No gaps found</div>
      <div style="font-size:12px;color:var(--muted)">All assessed items are marked Yes or N/A.</div>
    </div>`;
    return html + `<div style="margin-top:.75rem"><button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button></div>`;
  }

  // Top 5 priority gaps
  html += `<div class="card" style="padding:1.1rem;margin-bottom:1rem;border:2px solid #fbbf24">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:.85rem">
      <span style="font-size:16px">⭐</span>
      <div style="font-size:14px;font-weight:700;color:var(--text)">Top 5 Priority Gaps — Close These First</div>
      <span style="font-size:10px;color:var(--muted)">(ranked by weight × severity)</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:.5rem">
      ${top5.map((g, rank) => {
        const m = AI_GROUP_META[g.grp];
        const wColor = AI_WEIGHT_COLORS[g.weight];
        const ansCol = g.answer === 'no' ? '#dc2626' : '#b45309';
        return `<div style="display:flex;align-items:flex-start;gap:10px;padding:.6rem .75rem;border-radius:6px;background:${g.answer==='no'?'#fff7f7':'#fffbeb'};border:1px solid ${g.answer==='no'?'#fecaca':'#fde68a'}">
          <div style="font-size:20px;font-weight:900;color:${ansCol};min-width:24px;text-align:center;line-height:1.2">${rank+1}</div>
          <div style="flex:1">
            <div style="display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;margin-bottom:2px">
              <span style="font-size:10px;font-weight:700;color:${m.color}">${g.id}</span>
              <span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;background:${wColor}22;color:${wColor}">${AI_WEIGHT_LABELS[g.weight]}</span>
              <span style="font-size:12px;font-weight:700;color:var(--text)">${escH(g.title)}</span>
              <span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:6px;background:${g.answer==='no'?'#fee2e2':'#fef3c7'};color:${ansCol}">${g.answer==='no'?'No':'Partial'}</span>
            </div>
            <div style="font-size:11px;color:var(--muted)">${escH(g.desc)}</div>
            <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap">
              ${g.nist ? g.nist.map(id=>`<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:#dbeafe;color:#1e40af">${id}</span>`).join('') : ''}
              ${g.iso  ? g.iso.map(id =>`<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:#ccfbf1;color:#0f766e">${id}</span>`).join('') : ''}
            </div>
          </div>
          <div style="font-size:13px;font-weight:800;color:${ansCol};white-space:nowrap">${g.priorityScore.toFixed(1)}</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;

  // Full gap list by group
  AI_GROUP_ORDER.forEach(grpKey => {
    const grpGaps = gaps.filter(g => g.grp === grpKey);
    if (!grpGaps.length) return;
    const m = AI_GROUP_META[grpKey];
    html += `<div class="card" style="margin-bottom:.75rem;overflow:hidden">
      <div style="background:linear-gradient(135deg,${m.color},${m.color}dd);padding:.75rem 1rem;display:flex;align-items:center;gap:8px">
        <span style="font-size:14px">${m.icon}</span>
        <span style="font-size:13px;font-weight:700;color:#fff">${m.label}</span>
        <span style="font-size:11px;color:rgba(255,255,255,.6)">${grpGaps.length} gap${grpGaps.length!==1?'s':''}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="background:var(--bg)">
          <th style="padding:6px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase">ID</th>
          <th style="padding:6px 6px;text-align:center;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase">Priority</th>
          <th style="padding:6px 6px;text-align:center;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase">Gap</th>
          <th style="padding:6px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase">Requirement</th>
          <th style="padding:6px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase">Maps To</th>
        </tr></thead>
        <tbody>
          ${grpGaps.map(g => {
            const wColor = AI_WEIGHT_COLORS[g.weight];
            const ansCol = g.answer==='no'?'#dc2626':'#b45309';
            return `<tr style="border-bottom:1px solid var(--border)">
              <td style="padding:7px 10px;font-weight:700;color:${m.color};white-space:nowrap;vertical-align:top">${g.id}</td>
              <td style="padding:7px 6px;text-align:center;vertical-align:top">
                <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;background:${wColor}22;color:${wColor}">${AI_WEIGHT_LABELS[g.weight]}</span>
              </td>
              <td style="padding:7px 6px;text-align:center;vertical-align:top">
                <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;background:${g.answer==='no'?'#fee2e2':'#fef3c7'};color:${ansCol}">${g.answer==='no'?'No':'Partial'}</span>
              </td>
              <td style="padding:7px 10px;vertical-align:top">
                <div style="font-weight:700;margin-bottom:2px">${escH(g.title)}</div>
                <div style="color:var(--muted);font-size:11px;line-height:1.4">${escH(g.desc)}</div>
              </td>
              <td style="padding:7px 10px;vertical-align:top">
                <div style="display:flex;gap:3px;flex-wrap:wrap">
                  ${g.nist ? g.nist.map(id=>`<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:#dbeafe;color:#1e40af;white-space:nowrap">${id}</span>`).join('') : ''}
                  ${g.iso  ? g.iso.map(id =>`<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:#ccfbf1;color:#0f766e;white-space:nowrap">${id}</span>`).join('')  : ''}
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
  });

  html += `<div style="margin-top:.75rem;display:flex;gap:8px">
    <button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button>
    <button class="btn btn-outline btn-sm" onclick="aiuOpenPoam(-1)">📋 Open POAM</button>
    <button class="btn btn-outline btn-sm" onclick="aiuCopyGapPrompt()">📋 AI Prompt</button>
  </div>`;
  return html;
}

// ── POAM ──────────────────────────────────────────────────────────────────────

function renderAiUnifiedPoam() {
  const run = aiUnifiedState.poamRun || aiUnifiedState.reportRun;
  if (!run) return `<div class="card" style="padding:2rem;text-align:center"><button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button></div>`;
  const answers = Object.fromEntries(Object.entries(run.answers||{}).filter(([k])=>!k.startsWith('_')));
  const fw = aiuFrameworksFromRun(run);
  const gaps = aiuWeightedGaps(answers, fw);
  const poamData = aiUnifiedState.poamItems;
  const statuses = { open:'🔴 Open', in_progress:'🟡 In Progress', complete:'🟢 Complete', accepted:'⚪ Accepted' };
  const statColors = { open:'#fee2e2', in_progress:'#fef3c7', complete:'#dcfce7', accepted:'#f1f5f9' };

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📋 AI Governance — Plan of Action & Milestones</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name||'')} · ${run.date||'—'} · ${gaps.length} gap${gaps.length!==1?'s':''} prioritised by maturity weight</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button>
      <button class="btn btn-cyan btn-sm" onclick="aiuSavePoam()">Save POAM</button>
    </div>
  </div>`;

  if (!gaps.length) {
    html += `<div class="card" style="text-align:center;padding:3rem 1rem">
      <div style="font-size:32px;margin-bottom:.75rem">🎉</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:4px">No gaps to action</div>
      <div style="font-size:12px;color:var(--muted)">All assessed items are marked Yes or N/A.</div>
    </div>`;
    return html;
  }

  html += `<div class="card" style="padding:1rem;margin-bottom:1rem;background:#f0f9ff;border:1px solid #bae6fd">
    <div style="font-size:12px;color:#0369a1">
      <strong>How to use:</strong> Set status, owner, and target date for each gap. Rows are sorted by priority score (weight × severity) — focus on the top items first. Click <strong>Save POAM</strong> to persist your plan.
    </div>
  </div>

  <div class="card" style="padding:0;overflow:hidden">
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr style="background:var(--navy)">
        <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;color:rgba(255,255,255,.8);text-transform:uppercase;letter-spacing:.05em">Priority</th>
        <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;color:rgba(255,255,255,.8);text-transform:uppercase;letter-spacing:.05em">Gap</th>
        <th style="padding:8px 8px;text-align:center;font-size:10px;font-weight:700;color:rgba(255,255,255,.8);text-transform:uppercase;letter-spacing:.05em">Status</th>
        <th style="padding:8px 8px;text-align:left;font-size:10px;font-weight:700;color:rgba(255,255,255,.8);text-transform:uppercase;letter-spacing:.05em">Owner</th>
        <th style="padding:8px 8px;text-align:left;font-size:10px;font-weight:700;color:rgba(255,255,255,.8);text-transform:uppercase;letter-spacing:.05em">Target Date</th>
        <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;color:rgba(255,255,255,.8);text-transform:uppercase;letter-spacing:.05em">Notes</th>
      </tr></thead>
      <tbody>
        ${gaps.map((g, rank) => {
          const item = poamData[g.id] || {};
          const status = item.status || 'open';
          const wColor = AI_WEIGHT_COLORS[g.weight];
          const m = AI_GROUP_META[g.grp];
          const remediation = AI_REMEDIATION[g.id] || '';
          return `<tr style="border-bottom:1px solid var(--border);background:${statColors[status]||'#fff'}">
            <td style="padding:8px 10px;vertical-align:top;white-space:nowrap">
              <div style="font-size:16px;font-weight:900;color:${AI_WEIGHT_COLORS[g.weight]};text-align:center">#${rank+1}</div>
              <div style="text-align:center;margin-top:2px"><span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:6px;background:${wColor}22;color:${wColor}">${AI_WEIGHT_LABELS[g.weight]}</span></div>
            </td>
            <td style="padding:8px 10px;vertical-align:top">
              <div style="display:flex;align-items:baseline;gap:5px;margin-bottom:2px;flex-wrap:wrap">
                <span style="font-size:10px;font-weight:700;color:${m.color}">${g.id}</span>
                <span style="font-size:12px;font-weight:700;color:var(--text)">${escH(g.title)}</span>
                <span style="font-size:10px;font-weight:700;padding:1px 5px;border-radius:4px;background:${g.answer==='no'?'#fee2e2':'#fef3c7'};color:${g.answer==='no'?'#dc2626':'#b45309'}">${g.answer==='no'?'No':'Partial'}</span>
              </div>
              <div style="display:flex;gap:3px;flex-wrap:wrap">
                ${g.nist ? g.nist.map(id=>`<span style="font-size:9px;font-weight:700;padding:1px 4px;border-radius:3px;background:#dbeafe;color:#1e40af">${id}</span>`).join('') : ''}
                ${g.iso  ? g.iso.map(id =>`<span style="font-size:9px;font-weight:700;padding:1px 4px;border-radius:3px;background:#ccfbf1;color:#0f766e">${id}</span>`).join('') : ''}
              </div>
              ${remediation ? `<div style="font-size:10px;color:#0369a1;background:#f0f9ff;border:1px solid #bae6fd;border-radius:4px;padding:4px 6px;margin-top:5px"><strong>💡 Suggested Action:</strong> ${escH(remediation)}</div>` : ''}
            </td>
            <td style="padding:8px 8px;vertical-align:top;text-align:center">
              <select onchange="aiuPoamUpdate('${g.id}','status',this.value)"
                style="width:100%;padding:4px 6px;border:1px solid var(--border);border-radius:5px;font-size:11px;font-weight:700;background:#fff">
                ${Object.entries(statuses).map(([k,v])=>`<option value="${k}"${status===k?' selected':''}>${v}</option>`).join('')}
              </select>
            </td>
            <td style="padding:8px 8px;vertical-align:top">
              <input type="text" placeholder="Owner…" value="${escH(item.owner||'')}"
                onblur="aiuPoamUpdate('${g.id}','owner',this.value)"
                style="width:100%;padding:4px 6px;border:1px solid var(--border);border-radius:5px;font-size:11px">
            </td>
            <td style="padding:8px 8px;vertical-align:top">
              <input type="date" value="${item.targetDate||''}"
                onblur="aiuPoamUpdate('${g.id}','targetDate',this.value)"
                style="width:100%;padding:4px 6px;border:1px solid var(--border);border-radius:5px;font-size:11px">
            </td>
            <td style="padding:8px 10px;vertical-align:top">
              <textarea placeholder="Action notes…" rows="2"
                onblur="aiuPoamUpdate('${g.id}','notes',this.value)"
                style="width:100%;padding:4px 6px;border:1px solid var(--border);border-radius:5px;font-size:11px;resize:vertical">${escH(item.notes||'')}</textarea>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>
  <div style="margin-top:.75rem;display:flex;gap:8px;justify-content:flex-end">
    <button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button>
    <button class="btn btn-cyan btn-sm" onclick="aiuSavePoam()">Save POAM</button>
  </div>`;

  return html;
}

// ── EXECUTIVE REPORT ──────────────────────────────────────────────────────────

function renderAiUnifiedExecReport() {
  const run = aiUnifiedState.reportRun;
  if (!run) return `<div class="card" style="padding:2rem;text-align:center"><button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button></div>`;
  const answers = Object.fromEntries(Object.entries(run.answers||{}).filter(([k])=>!k.startsWith('_')));
  const fw = aiuFrameworksFromRun(run);
  const scores = aiuCalcScore(answers, fw);
  const nistAxes = aiuCalcNistFunctionScores(answers, fw);
  const isoAxes  = aiuCalcIsoClauseScores(answers, fw);
  const gaps = aiuWeightedGaps(answers, fw);
  const top5 = gaps.slice(0, 5);
  const commentary = aiUnifiedState.reportCommentary || (run.answers||{})._exec_commentary || '';

  const runs = (orgAssessments[currentOrg?.id]||{})['ai_unified']||[];
  const sorted = [...runs].sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  const prevRun = sorted.length>=2 ? sorted[sorted.length-2] : null;
  const prevScores = prevRun ? aiuCalcScore(Object.fromEntries(Object.entries(prevRun.answers||{}).filter(([k])=>!k.startsWith('_'))), fw) : null;
  const scoreChange = (scores.overall!==null && prevScores?.overall!=null) ? scores.overall - prevScores.overall : null;

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📊 AI Governance Executive Report</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name||'')} · ${run.date||'—'}${run.conductedBy?' · '+escH(run.conductedBy):''}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="aiuExportWord()">📄 Export Word</button>
      <button class="btn btn-outline btn-sm" onclick="aiuCopyReportPrompt()">📋 AI Prompt</button>
      <button class="btn btn-cyan btn-sm" onclick="aiuSaveCommentary()">Save Commentary</button>
    </div>
  </div>

  <div class="score-hero-ins" style="margin-bottom:1.25rem">
    <div style="flex:1;display:flex;flex-direction:column;gap:12px">
      <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4)">AI Governance Assessment</div>
      <div style="display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start">
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">Overall Score</div>
          <div class="score-big" style="color:#fff">${scores.overall!==null?scores.overall:'—'}<span style="font-size:18px">${scores.overall!==null?'%':''}</span></div>
          ${scores.overall!==null?`<div style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;display:inline-block;margin-top:6px;background:rgba(255,255,255,.08);color:${aiuScoreColor(scores.overall)}">${aiuScoreBand(scores.overall)}</div>`:''}
          ${scoreChange!==null?`<div style="font-size:11px;color:${scoreChange>=0?'#4ade80':'#f87171'};margin-top:4px">${scoreChange>=0?'▲':'▼'} ${Math.abs(scoreChange)}% vs previous</div>`:''}
        </div>
        <div style="display:flex;gap:20px;flex-wrap:wrap">
          ${fw.nist!==false&&scores.nist!==null?`<div><div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">NIST AI RMF</div><div style="font-size:28px;font-weight:800;color:#93c5fd;line-height:1">${scores.nist}%</div></div>`:''}
          ${fw.iso!==false&&scores.iso!==null?`<div><div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">ISO 42001</div><div style="font-size:28px;font-weight:800;color:#6ee7b7;line-height:1">${scores.iso}%</div></div>`:''}
          <div><div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">Total Gaps</div><div style="font-size:28px;font-weight:800;color:#f87171;line-height:1">${gaps.length}</div></div>
          <div><div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">Assessed</div><div style="font-size:13px;font-weight:700;color:#fff;margin-top:4px">${run.date||'—'}</div>${run.conductedBy?`<div style="font-size:11px;color:rgba(255,255,255,.5)">${escH(run.conductedBy)}</div>`:''}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="card" style="padding:1.25rem;margin-bottom:1rem">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:1rem">Framework Breakdown</div>
    <div style="display:flex;gap:2rem;flex-wrap:wrap;justify-content:space-around;align-items:flex-start">
      ${fw.nist!==false?`<div style="text-align:center;flex:1;min-width:200px">
        <div style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">🏛️ NIST AI RMF</div>
        <canvas id="aiurep-nist-radar" width="260" height="240" style="max-width:100%;display:block;margin:0 auto"></canvas>
        ${scores.nist!==null?`<div style="font-size:12px;font-weight:700;color:#1d4ed8;margin-top:6px">${scores.nist}% overall</div>`:''}
        <div style="display:flex;justify-content:center;gap:10px;margin-top:8px;flex-wrap:wrap">
          ${nistAxes.filter(a=>a.pct!==null).map(a=>`<div style="font-size:10px;text-align:center"><div style="font-weight:700;color:#1d4ed8">${a.pct}%</div><div style="color:var(--muted)">${a.label}</div></div>`).join('')}
        </div>
      </div>`:''}
      ${fw.iso!==false?`<div style="text-align:center;flex:1;min-width:200px">
        <div style="font-size:11px;font-weight:700;color:#0f766e;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">📋 ISO 42001</div>
        <canvas id="aiurep-iso-radar" width="260" height="240" style="max-width:100%;display:block;margin:0 auto"></canvas>
        ${scores.iso!==null?`<div style="font-size:12px;font-weight:700;color:#0f766e;margin-top:6px">${scores.iso}% overall</div>`:''}
        <div style="display:flex;justify-content:center;gap:10px;margin-top:8px;flex-wrap:wrap">
          ${isoAxes.filter(a=>a.pct!==null).map(a=>`<div style="font-size:10px;text-align:center"><div style="font-weight:700;color:#0f766e">${a.pct}%</div><div style="color:var(--muted)">${a.label}</div></div>`).join('')}
        </div>
      </div>`:''}
    </div>
  </div>

  ${renderAiPyramidCard('aiurep', false)}

  <div class="card" style="padding:1.25rem;margin-bottom:1rem">
    <div style="font-size:13px;font-weight:700;margin-bottom:.75rem">⭐ Top Priority Gaps</div>
    ${top5.length ? `<table style="width:100%;border-collapse:collapse;font-size:12px">
      ${top5.map((g,i) => {
        const m = AI_GROUP_META[g.grp];
        const wColor = AI_WEIGHT_COLORS[g.weight];
        return `<tr style="border-bottom:1px solid var(--border)">
          <td style="padding:6px 8px;font-weight:900;color:${AI_WEIGHT_COLORS[g.weight]};text-align:center;font-size:14px">${i+1}</td>
          <td style="padding:6px 8px;vertical-align:top">
            <span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:${m.light};color:${m.txt}">${m.label.split(' ')[0]}</span>
          </td>
          <td style="padding:6px 8px;vertical-align:top">
            <span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;background:${wColor}22;color:${wColor}">${AI_WEIGHT_LABELS[g.weight]}</span>
          </td>
          <td style="padding:6px 8px;vertical-align:top;font-weight:700;font-size:10px;color:${m.color};white-space:nowrap">${g.id}</td>
          <td style="padding:6px 8px;vertical-align:top">${escH(g.title)}</td>
          <td style="padding:6px 8px;vertical-align:top">
            <span style="font-size:10px;font-weight:700;padding:1px 5px;border-radius:4px;background:${g.answer==='no'?'#fee2e2':'#fef3c7'};color:${g.answer==='no'?'#dc2626':'#b45309'}">${g.answer==='no'?'No':'Partial'}</span>
          </td>
        </tr>`;
      }).join('')}
    </table>` : `<div style="font-size:12px;color:var(--muted)">No gaps found.</div>`}
  </div>

  <div class="card" style="padding:1.25rem">
    <div style="font-size:13px;font-weight:700;margin-bottom:.5rem">Executive Commentary</div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:.75rem">Write or paste an AI-generated narrative. Use "Copy AI Prompt" to generate one via Claude.</div>
    <textarea id="aiuReportCommentary" placeholder="Executive summary and narrative…"
      style="width:100%;min-height:140px;padding:10px;border:1px solid var(--border);border-radius:6px;font-size:13px;line-height:1.6;resize:vertical">${escH(commentary)}</textarea>
    <div style="margin-top:.5rem;display:flex;gap:6px;justify-content:flex-end">
      <button class="btn btn-outline btn-sm" onclick="aiuCopyReportPrompt()">📋 Copy AI Prompt</button>
      <button class="btn btn-cyan btn-sm" onclick="aiuSaveCommentary()">Save Commentary</button>
    </div>
  </div>`;
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────

function aiuStartNew() {
  aiUnifiedState.answers = {};
  aiUnifiedState.notes = {};
  aiUnifiedState.openComments = {};
  aiUnifiedState.openPanels = {};
  aiUnifiedState.editId = null;
  aiUnifiedState.date = new Date().toISOString().slice(0, 10);
  aiUnifiedState.conductedBy = '';
  aiUnifiedState.view = 'form';
  aiUnifiedState.poamItems = {};
  renderMain();
}

function aiuOpenAssessment(idx) {
  const runs = (orgAssessments[currentOrg?.id]||{})['ai_unified'] || [];
  const run = runs[idx];
  if (!run) return;
  const cleanAns = Object.fromEntries(Object.entries(run.answers||{}).filter(([k])=>!k.startsWith('_')));
  aiUnifiedState.answers = cleanAns;
  aiUnifiedState.notes = {};
  aiUnifiedState.openComments = {};
  aiUnifiedState.openPanels = {};
  aiUnifiedState.editId = run.id || null;
  aiUnifiedState.date = run.date || '';
  aiUnifiedState.conductedBy = run.conductedBy || '';
  aiUnifiedState.frameworks = aiuFrameworksFromRun(run);
  aiUnifiedState.view = 'form';
  aiUnifiedState.poamItems = run.answers?._poam ? JSON.parse(run.answers._poam) : {};
  renderMain();
}

async function aiuSave() {
  const orgId = currentOrg?.id;
  if (!orgId) return;
  const date = document.getElementById('aiuDate')?.value || aiUnifiedState.date || new Date().toISOString().slice(0,10);
  const conductedBy = document.getElementById('aiuConductedBy')?.value?.trim() || '';
  const fw = aiUnifiedState.frameworks;
  const active = aiuActiveControls(fw);
  const answered = active.filter(c => aiUnifiedState.answers[c.id] && aiUnifiedState.answers[c.id] !== 'na').length;
  if (answered === 0) { toast('Answer at least one question before saving', '#b45309'); return; }

  const scores = aiuCalcScore(aiUnifiedState.answers, fw);
  const answers = {
    ...aiUnifiedState.answers,
    _frameworks: JSON.stringify(fw),
  };

  const btn = document.getElementById('aiuSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  try {
    let savedId = aiUnifiedState.editId;
    if (savedId) {
      await sb.updateAssessment(savedId, { score: scores.overall ?? 0, answers, assessed_at: date, conducted_by: conductedBy });
    } else {
      const row = { org_id: orgId, module: 'ai_unified', score: scores.overall ?? 0, answers, assessed_at: date, conducted_by: conductedBy };
      const res = await sb.saveAssessment(row);
      savedId = Array.isArray(res) ? res[0]?.id : res?.id;
    }
    const noteRows = Object.entries(aiUnifiedState.notes)
      .filter(([,v]) => v.trim())
      .map(([item_id, note]) => ({ org_id: orgId, module: 'ai_unified', item_id, note }));
    if (noteRows.length) await sb.frameworkNotes.upsert(noteRows);

    delete orgAssessments[orgId];
    await loadAssessments(orgId);
    aiUnifiedState.editId = savedId;
    aiUnifiedState.view = 'dashboard';
    toast('✓ AI Governance assessment saved', '#15803d');
    buildNav(); renderMain();
    setTimeout(aiuTrendDraw, 80);
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Save Assessment'; }
  }
}

async function aiuDeleteConfirm(idx) {
  const runs = (orgAssessments[currentOrg?.id]||{})['ai_unified']||[];
  const run = runs[idx];
  if (!run?.id) return;
  if (!confirm(`Delete AI Governance assessment from ${run.date||'unknown date'}? This cannot be undone.`)) return;
  try {
    await sb.deleteAssessment(run.id);
    delete orgAssessments[currentOrg.id];
    await loadAssessments(currentOrg.id);
    toast('Assessment deleted', '#b45309');
    buildNav(); renderMain();
  } catch(e) { toast('Delete failed: ' + e.message, '#dc2626'); }
}

function aiuNavToDashboard() {
  aiUnifiedState.view = 'dashboard';
  aiUnifiedState.reportRun = null;
  aiUnifiedState.poamRun = null;
  renderMain();
  setTimeout(aiuTrendDraw, 80);
}

function aiuAnswer(id, val) {
  aiUnifiedState.answers[id] = val;
  renderMain();
}

function aiuTogglePanel(grp) {
  aiUnifiedState.openPanels[grp] = aiUnifiedState.openPanels[grp] === false ? true : false;
  renderMain();
}

function aiuToggleComment(id) {
  aiUnifiedState.openComments[id] = !aiUnifiedState.openComments[id];
  renderMain();
}

function aiuSaveNote(id, value) {
  aiUnifiedState.notes[id] = value.trim();
}

function aiuPoamUpdate(id, field, value) {
  if (!aiUnifiedState.poamItems[id]) aiUnifiedState.poamItems[id] = {};
  aiUnifiedState.poamItems[id][field] = value;
}

function _aiuBuildRrItems() {
  const items = [];
  for (const [ctrlId, poamItem] of Object.entries(aiUnifiedState.poamItems || {})) {
    if (!poamItem?.status) continue;
    const ctrl = (typeof AI_UNIFIED_CONTROLS !== 'undefined' ? AI_UNIFIED_CONTROLS : []).find(c => c.id === ctrlId);
    if (!ctrl) continue;
    const riskStatus = poamItem.status === 'complete' ? 'Closed'
      : poamItem.status === 'accepted' ? 'Accepted'
      : poamItem.status === 'in_progress' ? 'In Progress'
      : 'Open';
    const w = ctrl.weight || 3;
    const inherent = w >= 5 ? 'Critical' : w >= 4 ? 'High' : w >= 3 ? 'Medium' : 'Low';
    items.push({
      safeguard_id:         ctrlId,
      risk_title:           ctrl.title,
      risk_description:     ctrl.desc || ctrl.title,
      inherent_risk_rating: inherent,
      risk_status:          riskStatus,
      risk_owner:           poamItem.owner || '',
      treatment_notes:      poamItem.notes || '',
      due_date:             poamItem.targetDate || '',
    });
  }
  return items;
}

async function aiuSavePoam() {
  const run = aiUnifiedState.poamRun || aiUnifiedState.reportRun;
  if (!run?.id) { toast('Cannot save — assessment ID missing', '#dc2626'); return; }
  try {
    const updatedAnswers = { ...(run.answers||{}), _poam: JSON.stringify(aiUnifiedState.poamItems) };
    await sb.updateAssessment(run.id, { answers: updatedAnswers });
    const target = aiUnifiedState.poamRun || aiUnifiedState.reportRun;
    if (target) target.answers = updatedAnswers;
    const runs = (orgAssessments[currentOrg?.id]||{})['ai_unified']||[];
    const idx = runs.findIndex(r=>r.id===run.id);
    if (idx!==-1) runs[idx].answers = updatedAnswers;
    toast('✓ POAM saved', '#15803d');
    // Fire-and-forget: sync to risk register (PATCH_020)
    if (run.id && currentOrg?.id) {
      const items = _aiuBuildRrItems();
      if (items.length) {
        sb.riskRegister.syncAi(currentOrg.id, run.id, items)
          .then(() => { if (typeof rrState !== 'undefined') rrState.orgId = null; })
          .catch(e => {
            console.error('AI POAM → risk register sync failed:', e);
            toast('Risk Register sync failed: ' + e.message, '#dc2626');
          });
      }
    }
  } catch(e) { toast('Save failed: ' + e.message, '#dc2626'); }
}

function aiuOpenGapReport(idx) {
  const runs = (orgAssessments[currentOrg?.id]||{})['ai_unified']||[];
  const run = runs[idx];
  if (!run) return;
  aiUnifiedState.reportRun = run;
  aiUnifiedState.view = 'gap';
  renderMain();
}

function aiuOpenPoam(idx) {
  const runs = (orgAssessments[currentOrg?.id]||{})['ai_unified']||[];
  const latestIdx = aiuLatestIdx(runs);
  const run = idx >= 0 ? runs[idx] : (aiUnifiedState.reportRun || runs[latestIdx]);
  if (!run) return;
  aiUnifiedState.poamRun = run;
  aiUnifiedState.poamItems = run.answers?._poam ? (() => { try { return JSON.parse(run.answers._poam); } catch { return {}; } })() : {};
  aiUnifiedState.view = 'poam';
  renderMain();
}

function aiuOpenReport(idx) {
  const runs = (orgAssessments[currentOrg?.id]||{})['ai_unified']||[];
  const run = runs[idx];
  if (!run) return;
  aiUnifiedState.reportRun = run;
  aiUnifiedState.reportCommentary = (run.answers||{})._exec_commentary || '';
  aiUnifiedState.view = 'report';
  renderMain();
  const answers = Object.fromEntries(Object.entries(run.answers||{}).filter(([k])=>!k.startsWith('_')));
  const fw = aiuFrameworksFromRun(run);
  const nistAxes = aiuCalcNistFunctionScores(answers, fw);
  const isoAxes  = aiuCalcIsoClauseScores(answers, fw);
  setTimeout(() => {
    if (fw.nist !== false) aiuDrawFrameworkRadar(document.getElementById('aiurep-nist-radar'), nistAxes, 'rgba(29,78,216,0.12)', '#1d4ed8');
    if (fw.iso  !== false) aiuDrawFrameworkRadar(document.getElementById('aiurep-iso-radar'),  isoAxes,  'rgba(15,118,110,0.12)', '#0f766e');
  }, 80);
}

// ── RADAR + PYRAMID HELPERS ───────────────────────────────────────────────────

function aiuDrawRadar(canvasId, groupScores) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const valid = groupScores.filter(g => g.pct !== null);
  const N = valid.length;
  if (!N) return;

  const cx = W / 2, cy = H / 2 + 8;
  const R = Math.min(W, H) * 0.28;
  const labelPad = 44;

  function angle(i) { return (Math.PI * 2 * i / N) - Math.PI / 2; }
  function ptR(i, r) { return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))]; }
  function pt(i, val) { return ptR(i, (val / 100) * R); }

  // Grid rings
  [0.25, 0.5, 0.75, 1].forEach(level => {
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const p = ptR(i, level * R);
      i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
    }
    ctx.closePath();
    ctx.strokeStyle = level === 1 ? '#9ca3af' : '#e5e7eb';
    ctx.lineWidth = level === 1 ? 1.5 : 0.8;
    if (level === 1) ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    if (level < 1) {
      const lp = ptR(0, level * R);
      ctx.fillStyle = '#9ca3af'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
      ctx.fillText(Math.round(level * 100) + '%', lp[0] + 14, lp[1] + 3);
    }
  });

  // Spokes
  for (let i = 0; i < N; i++) {
    const op = ptR(i, R);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(op[0], op[1]);
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 0.8; ctx.stroke();
  }

  // Score polygon
  ctx.beginPath();
  valid.forEach((g, i) => {
    const p = pt(i, g.pct ?? 0);
    i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(21, 33, 104, 0.1)'; ctx.fill();
  ctx.strokeStyle = '#152168'; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();

  // Score dots
  valid.forEach((g, i) => {
    const p = pt(i, g.pct ?? 0);
    ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
    ctx.fillStyle = g.pct >= 70 ? '#15803d' : g.pct >= 40 ? '#d97706' : '#dc2626';
    ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
  });

  // Spoke labels
  for (let i = 0; i < N; i++) {
    const m = AI_GROUP_META[valid[i].grp];
    const ang = angle(i);
    const lp = [cx + (R + labelPad) * Math.cos(ang), cy + (R + labelPad) * Math.sin(ang)];
    const xOff = Math.cos(ang);
    ctx.textAlign = xOff > 0.15 ? 'left' : xOff < -0.15 ? 'right' : 'center';
    ctx.font = 'bold 9px Inter, sans-serif'; ctx.fillStyle = '#374151';
    ctx.fillText(m.label.split(' ')[0], lp[0], lp[1]);
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = valid[i].pct >= 70 ? '#15803d' : valid[i].pct >= 40 ? '#d97706' : '#dc2626';
    ctx.fillText((valid[i].pct ?? '—') + '%', lp[0], lp[1] + 12);
  }
}

function aiuBuildPyramidState(answers) {
  const ANSWER_TO_STATUS = { yes: 'green', partial: 'yellow', no: 'red' };
  const state = {};
  Object.entries(AI_PYR_MAP).forEach(([segId, ctrlId]) => {
    state[segId] = ANSWER_TO_STATUS[answers[ctrlId]] || 'red';
  });
  return state;
}

function aiuBuildPyramidSvgStr(pyrState) {
  const W = 1400, TIP_Y = 28, BASE_Y = 690, HALF_W = 460, PAD = 5;
  const NT = AI_PYR_TIERS.length, TH = (BASE_Y - TIP_Y) / NT;
  const cx = W / 2;
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function getFill(st) { return {red:'#c00000',yellow:'#e8a000',blue:'#2e7ab0',green:'#00af50'}[st]||'#888'; }
  function getStroke(st) { return {red:'#960000',yellow:'#b87800',blue:'#1e5a8a',green:'#007a38'}[st]||'#555'; }
  function tierBounds(ti) {
    const topY = TIP_Y + ti * TH, botY = topY + TH;
    const ft = (topY - TIP_Y) / (BASE_Y - TIP_Y), fb = (botY - TIP_Y) / (BASE_Y - TIP_Y);
    return { topY, botY, topHW: ft * HALF_W, botHW: fb * HALF_W };
  }
  function wrapText(text, maxW, fs) {
    const max = Math.max(4, Math.floor(maxW / (fs * 0.52)));
    const words = text.split(' '); const lines = []; let cur = '';
    words.forEach(w => { const t = cur ? cur + ' ' + w : w; if (t.length > max && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur);
    return lines;
  }
  let s = '';
  AI_PYR_TIERS.forEach((tier, ti) => {
    const { topY, botY, topHW, botHW } = tierBounds(ti);
    const tierWtop = topHW * 2, tierWbot = botHW * 2;
    const nCols = tier.cols.length;
    const colXtop = [], colXbot = [];
    for (let i = 0; i <= nCols; i++) {
      colXtop.push(cx - topHW + (i / nCols) * tierWtop);
      colXbot.push(cx - botHW + (i / nCols) * tierWbot);
    }
    const yt = topY + PAD, yb = botY - PAD;
    const APEX_GAP = 12;
    tier.cols.forEach((col, ci) => {
      const colFracL = ci / nCols - 0.5, colFracR = (ci + 1) / nCols - 0.5;
      const apexOffL = colFracL * APEX_GAP * 2, apexOffR = colFracR * APEX_GAP * 2;
      const _xtl = colXtop[ci] + PAD + apexOffL * Math.max(0, 1 - topHW / 40);
      const _xtr = colXtop[ci + 1] - PAD + apexOffR * Math.max(0, 1 - topHW / 40);
      const xtl = Math.min(_xtl, _xtr), xtr = Math.max(_xtl, _xtr);
      const xbl = colXbot[ci] + PAD, xbr = colXbot[ci + 1] - PAD;
      const midX = (xtl + xtr + xbl + xbr) / 4;
      const colW = (xtr - xtl + xbr - xbl) / 2;
      const fill = getFill(pyrState[col.id] || 'red');
      const stroke = getStroke(pyrState[col.id] || 'red');
      s += `<polygon points="${xtl},${yt} ${xtr},${yt} ${xbr},${yb} ${xbl},${yb}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
      const fs = Math.min(11, Math.max(7, (yb - yt) / 4.5));
      const midY = (yt + yb) / 2;
      const lines = wrapText(col.name, colW - 6, fs);
      const lh = fs * 1.25, tot = lines.length * lh;
      lines.forEach((line, li) => {
        const ty = midY - tot / 2 + li * lh + lh * 0.78;
        s += `<text x="${midX}" y="${ty}" text-anchor="middle" fill="#ffffff" font-size="${fs}" font-weight="600" font-family="Arial,sans-serif">${esc(line)}</text>`;
      });
    });
    const { topY: ty2, botY: by2, topHW: thw } = tierBounds(ti);
    const lblY = (ty2 + by2) / 2;
    s += `<text x="${cx - Math.max(thw, 0) - 80}" y="${lblY + 4}" text-anchor="end" fill="#5a3a9a" font-size="13" font-weight="700" font-family="Arial,sans-serif" letter-spacing="0.06em">${esc(tier.label.toUpperCase())}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 0 1540 710" width="520" height="222" style="display:block;margin:0 auto">${s}</svg>`;
}

async function aiuSaveCommentary() {
  const run = aiUnifiedState.reportRun;
  if (!run?.id) { toast('Cannot save — assessment ID missing', '#dc2626'); return; }
  const commentary = (document.getElementById('aiuReportCommentary')?.value||'').trim();
  try {
    const updatedAnswers = { ...(run.answers||{}), _exec_commentary: commentary };
    await sb.updateAssessment(run.id, { answers: updatedAnswers });
    aiUnifiedState.reportRun = { ...run, answers: updatedAnswers };
    aiUnifiedState.reportCommentary = commentary;
    const runs = (orgAssessments[currentOrg?.id]||{})['ai_unified']||[];
    const idx = runs.findIndex(r=>r.id===run.id);
    if (idx!==-1) runs[idx].answers = updatedAnswers;
    toast('✓ Commentary saved', '#15803d');
  } catch(e) { toast('Save failed: ' + e.message, '#dc2626'); }
}

function aiuCopyReportPrompt() {
  const run = aiUnifiedState.reportRun;
  if (!run) return;
  const answers = Object.fromEntries(Object.entries(run.answers||{}).filter(([k])=>!k.startsWith('_')));
  const fw = aiuFrameworksFromRun(run);
  const scores = aiuCalcScore(answers, fw);
  const gaps = aiuWeightedGaps(answers, fw);
  const nistAxes = aiuCalcNistFunctionScores(answers, fw);
  const isoAxes  = aiuCalcIsoClauseScores(answers, fw);
  const score = scores.overall ?? 0;
  const band = aiuScoreBand(score);

  const allRuns = (orgAssessments[currentOrg?.id]||{})['ai_unified']||[];
  const sorted = [...allRuns].sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  const hasTrend = sorted.length >= 2;
  const trendStr = hasTrend ? sorted.map(r=>`${r.date}: ${r.score}%`).join(' → ') : 'First assessment — no trend data';

  const fwLabel = [fw.nist!==false?'NIST AI RMF v1.0':'', fw.iso!==false?'ISO/IEC 42001:2023':''].filter(Boolean).join(' + ');

  const nistBreakdown = nistAxes.filter(a=>a.pct!==null).map(a=>`  ${a.label}: ${a.pct}%`).join('\n');
  const isoBreakdown  = isoAxes.filter(a=>a.pct!==null).map(a=>`  ${a.label}: ${a.pct}%`).join('\n');

  const noGaps = gaps.filter(g=>g.answer==='no').slice(0,8)
    .map(g=>`• ${g.id} (${AI_WEIGHT_LABELS[g.weight]}) [${AI_GROUP_META[g.grp].label}]: ${g.title}`).join('\n');
  const partGaps = gaps.filter(g=>g.answer==='partial').slice(0,5)
    .map(g=>`• ${g.id} (${AI_WEIGHT_LABELS[g.weight]}) [${AI_GROUP_META[g.grp].label}]: ${g.title}`).join('\n');

  const pyrState = aiuBuildPyramidState(answers);
  const PYR_STATUS_LABEL = { green:'Implemented', yellow:'Partial', blue:'In Progress', red:'Not Addressed' };
  const pyrSummary = AI_PYR_TIERS.map(tier => {
    const segs = tier.cols.filter(c=>c.type==='seg');
    const counts = { green:0, yellow:0, blue:0, red:0 };
    segs.forEach(s => { counts[pyrState[s.id]||'red']++; });
    return `  ${tier.label}: ${counts.green} Implemented / ${counts.yellow} Partial / ${counts.blue} In Progress / ${counts.red} Not Addressed`;
  }).join('\n');

  const prompt = `Write a professional AI governance executive report commentary for ${currentOrg?.name}. Target audience: non-technical CEO or board. Focus on business risk and practical outcomes — avoid jargon.

ORGANISATION: ${currentOrg?.name}
ASSESSMENT DATE: ${run.date||'Unknown'}
ASSESSOR: ${run.conductedBy||'Not specified'}
FRAMEWORKS: ${fwLabel}
OVERALL SCORE: ${score}% — Risk Band: ${band}
GAPS: ${gaps.filter(g=>g.answer==='no').length} Not Addressed, ${gaps.filter(g=>g.answer==='partial').length} Partial, ${gaps.length} total controls need attention

${fw.nist!==false&&nistBreakdown?`NIST AI RMF FUNCTION SCORES:\n${nistBreakdown}\n`:''}${fw.iso!==false&&isoBreakdown?`ISO 42001 CLAUSE SCORES:\n${isoBreakdown}\n`:''}
MATURITY PYRAMID (by tier):
${pyrSummary}

SCORE TREND: ${trendStr}

PRIORITY GAPS (Not Addressed, highest weight first):
${noGaps||'— None —'}

PARTIALLY ADDRESSED:
${partGaps||'— None —'}

─────────────────────────────────────────────
CRITICAL FORMATTING RULES — non-negotiable:

This text is parsed by a Word export engine and placed into sections of the document. Follow these rules exactly or the output will be broken.

1. NO MARKDOWN. No **, no *, no ##, no -, no _. These appear literally in the printed report.
2. BULLETS: Use the actual • character at the start of each line. Never use - or * for lists.
3. PARAGRAPH BREAKS: Separate paragraphs and bullet blocks with exactly one blank line.
4. NO SECTION LABELS in the prose. Do not write "Executive Summary:", "Key Findings:", etc. Write the content only — the report template adds all headings.
5. USE THE EXACT SECTION MARKERS below. They are parsed by the export engine to place content in specific report sections. Do not alter, rename, or omit them.
─────────────────────────────────────────────

OUTPUT STRUCTURE — write EXACTLY in this order with EXACTLY these markers:

Write 2–3 paragraphs of executive summary prose. Plain sentences. What does this ${score}% ${band} score mean for AI governance maturity and business readiness? What is working? Where is the primary risk exposure if gaps are not addressed? Reference the framework context (${fwLabel}) without being technical about it.

Close the executive summary with 1–2 sentences on the recommended next step — whether to close existing gaps before expanding the programme scope, or to begin preparing for a formal certification or regulatory submission. Frame it as forward-looking business strategy, not a technical gap list.

KEY FINDINGS
• [Risk described as business impact — what could go wrong if this gap is not addressed — one sentence]
• [3 to 4 findings total]
• [Focus on consequence for the business, not on the control ID]
• [Optional 4th finding]

PRIORITY RECOMMENDATIONS
• [Specific action with a one-sentence business rationale — why now, not later]
• [2 to 3 recommendations total]
• [Actionable, owner-assignable, not vague]`;

  navigator.clipboard.writeText(prompt)
    .then(() => toast('✓ AI prompt copied — paste into Claude to generate commentary', '#152168'))
    .catch(() => {
      const ta = document.getElementById('aiuReportCommentary');
      if (ta) { ta.value = prompt; ta.select(); ta.scrollIntoView(); }
      toast('Clipboard blocked — prompt placed in commentary field', '#b45309');
    });
}

// ── COMPARE MATRIX ────────────────────────────────────────────────────────────

function aiuOpenMatrix() {
  const orgId = currentOrg?.id;
  const allRuns = [...((orgAssessments[orgId] || {})['ai_unified'] || [])]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 5);
  aiUnifiedState.matrixRuns = allRuns.map(r => ({
    id: r.id, date: r.date, conductedBy: r.conductedBy, score: r.score,
    cleanAnswers: Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_'))),
    metaAnswers:  Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) =>  k.startsWith('_'))),
  }));
  if (!aiUnifiedState.matrixGroup) aiUnifiedState.matrixGroup = 'g1';
  aiUnifiedState.view = 'matrix';
  renderMain();
}

function aiuSetMatrixGroup(grp) {
  aiUnifiedState.matrixGroup = grp;
  renderMain();
}

function renderAiUnifiedMatrix() {
  const runs = aiUnifiedState.matrixRuns || [];
  if (!runs.length) {
    return `${renderTierBanner()}
    <div class="card" style="padding:2rem;text-align:center">
      <div style="font-size:13px;color:var(--muted);margin-bottom:1rem">No assessments to compare.</div>
      <button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button>
    </div>`;
  }

  const grpKey = aiUnifiedState.matrixGroup || 'g1';
  const allControls = AI_UNIFIED_CONTROLS.filter(c => c.grp === grpKey);
  const m = AI_GROUP_META[grpKey];

  const CELL_NEXT = { yes: 'partial', partial: 'no', no: 'na', na: '__clear__' };
  const cellStyle = val => {
    if (val === 'yes')     return 'background:#dcfce7;color:#15803d;font-weight:700;border:1.5px solid #86efac';
    if (val === 'partial') return 'background:#fef3c7;color:#b45309;font-weight:700;border:1.5px solid #fcd34d';
    if (val === 'no')      return 'background:#fee2e2;color:#dc2626;font-weight:700;border:1.5px solid #fca5a5';
    if (val === 'na')      return 'background:#f1f5f9;color:#64748b;font-weight:700;border:1.5px solid #cbd5e1';
    return 'background:#f8fafc;color:var(--muted);border:1.5px dashed #dde3ef';
  };
  const cellLabel = { yes: 'Yes', partial: 'Par', no: 'No', na: 'N/A' };

  const runScores = runs.map(r => aiuCalcScore(r.cleanAnswers, { nist: true, iso: true }));

  const groupFilterHtml = Object.entries(AI_GROUP_META).map(([gk, gm]) => {
    const isActive = gk === grpKey;
    return `<button onclick="aiuSetMatrixGroup('${gk}')"
      style="padding:4px 10px;font-size:11px;font-weight:700;border-radius:20px;cursor:pointer;border:2px solid ${isActive?gm.color:'#dde3ef'};background:${isActive?gm.color:'transparent'};color:${isActive?'#fff':'var(--muted)'}">
      ${gm.icon} ${gm.label.split(' ')[0]}
    </button>`;
  }).join('');

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700">⊞ AI Governance — Compare Matrix</div>
      <div style="font-size:12px;color:var(--muted)">Last ${runs.length} assessments · click any cell to cycle (Yes → Partial → No → N/A → Clear) · auto-saves</div>
    </div>
    <button class="btn btn-outline btn-sm" onclick="aiuNavToDashboard()">← Back</button>
  </div>

  <div class="card" style="padding:1.25rem;overflow-x:auto">
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:.85rem">
      ${groupFilterHtml}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:12px;min-width:${260 + runs.length * 95}px">
      <thead>
        <tr style="border-bottom:2px solid var(--border)">
          <th style="text-align:left;padding:8px 10px;font-size:11px;font-weight:700;background:${m.light||'var(--bg)'};color:${m.txt||m.color};text-transform:uppercase;letter-spacing:.05em;min-width:220px">
            ${m.icon} ${m.label}
          </th>
          ${runs.map((r, i) => `<th style="text-align:center;padding:8px 6px;background:${m.light||'var(--bg)'};min-width:90px;border-left:1px solid var(--border)">
            <div style="font-weight:700;font-size:11px;color:var(--text)">${r.date||'—'}</div>
            ${r.conductedBy?`<div style="font-size:10px;color:var(--muted)">${escH(r.conductedBy)}</div>`:''}
            <div style="font-size:15px;font-weight:800;color:${aiuScoreColor(runScores[i].overall)};margin-top:2px">${runScores[i].overall??'—'}%</div>
          </th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${allControls.map(ctrl => {
          const wColor = AI_WEIGHT_COLORS[ctrl.weight];
          return `<tr style="border-bottom:1px solid var(--border)">
            <td style="padding:7px 10px;vertical-align:top">
              <div style="display:flex;align-items:baseline;gap:5px;margin-bottom:3px;flex-wrap:wrap">
                <span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:6px;background:${wColor}22;color:${wColor}">${AI_WEIGHT_LABELS[ctrl.weight]}</span>
                <span style="font-size:10px;font-weight:700;color:${m.color}">${ctrl.id}</span>
              </div>
              <div style="font-size:11px;font-weight:600;color:var(--text);line-height:1.3">${escH(ctrl.title)}</div>
            </td>
            ${runs.map(r => {
              const val = r.cleanAnswers[ctrl.id] || null;
              const nextVal = CELL_NEXT[val || 'na'] || 'yes';
              return `<td style="padding:5px 6px;text-align:center;vertical-align:middle;border-left:1px solid var(--border)">
                <button onclick="aiuMatrixAnswer('${r.id}','${ctrl.id}','${nextVal}')"
                  title="Click to cycle answer"
                  style="width:60px;padding:5px 3px;font-size:11px;border-radius:6px;cursor:pointer;${cellStyle(val)};transition:all .1s">
                  ${val ? cellLabel[val] : '<span style="font-size:10px;color:#cbd5e1">—</span>'}
                </button>
              </td>`;
            }).join('')}
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;

  return html;
}

async function aiuMatrixAnswer(runId, ctrlId, nextVal) {
  const run = aiUnifiedState.matrixRuns && aiUnifiedState.matrixRuns.find(r => r.id === runId);
  if (!run) return;
  if (nextVal === '__clear__') delete run.cleanAnswers[ctrlId];
  else run.cleanAnswers[ctrlId] = nextVal;
  // Update orgAssessments cache
  const orgId = currentOrg?.id;
  const allRuns = (orgAssessments[orgId] || {})['ai_unified'] || [];
  const cached = allRuns.find(r => r.id === runId);
  if (cached) {
    const merged = { ...run.metaAnswers, ...run.cleanAnswers };
    cached.answers = merged;
    const sc = aiuCalcScore(run.cleanAnswers, { nist: true, iso: true });
    cached.score = sc.overall ?? cached.score;
    run.score = cached.score;
  }
  renderMain();
  try {
    await sb.updateAssessment(runId, { answers: { ...run.metaAnswers, ...run.cleanAnswers } });
  } catch(e) { toast('Auto-save failed: ' + e.message, '#dc2626'); }
}

// ── WORD EXPORT ───────────────────────────────────────────────────────────────

function aiuDrawRadarOffscreen(canvas, groupScores) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const valid = groupScores.filter(g => g.pct !== null);
  const N = valid.length;
  if (!N) return;
  const cx = W / 2, cy = H / 2 + 8, R = Math.min(W, H) * 0.28, labelPad = 44;
  function angle(i) { return (Math.PI * 2 * i / N) - Math.PI / 2; }
  function ptR(i, r) { return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))]; }
  function pt(i, val) { return ptR(i, (val / 100) * R); }
  [0.25, 0.5, 0.75, 1].forEach(level => {
    ctx.beginPath();
    for (let i = 0; i < N; i++) { const p = ptR(i, level * R); i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); }
    ctx.closePath();
    ctx.strokeStyle = level === 1 ? '#9ca3af' : '#e5e7eb'; ctx.lineWidth = level === 1 ? 1.5 : 0.8;
    if (level === 1) ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
  });
  for (let i = 0; i < N; i++) {
    const op = ptR(i, R); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(op[0], op[1]);
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 0.8; ctx.stroke();
  }
  ctx.beginPath();
  valid.forEach((g, i) => { const p = pt(i, g.pct ?? 0); i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); });
  ctx.closePath(); ctx.fillStyle = 'rgba(21,33,104,0.1)'; ctx.fill();
  ctx.strokeStyle = '#152168'; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
  valid.forEach((g, i) => {
    const p = pt(i, g.pct ?? 0);
    ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
    ctx.fillStyle = g.pct >= 70 ? '#15803d' : g.pct >= 40 ? '#d97706' : '#dc2626';
    ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
  });
  for (let i = 0; i < N; i++) {
    const gm = AI_GROUP_META[valid[i].grp];
    const ang = angle(i);
    const lp = [cx + (R + labelPad) * Math.cos(ang), cy + (R + labelPad) * Math.sin(ang)];
    const xOff = Math.cos(ang);
    ctx.textAlign = xOff > 0.15 ? 'left' : xOff < -0.15 ? 'right' : 'center';
    ctx.font = 'bold 9px Arial'; ctx.fillStyle = '#374151';
    ctx.fillText(gm.label.split(' ')[0], lp[0], lp[1]);
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = valid[i].pct >= 70 ? '#15803d' : valid[i].pct >= 40 ? '#d97706' : '#dc2626';
    ctx.fillText((valid[i].pct ?? '—') + '%', lp[0], lp[1] + 12);
  }
}

async function aiuExportWord() {
  const orgId = currentOrg?.id;
  const runs = (orgAssessments[orgId] || {})['ai_unified'] || [];
  const latestIdx = aiuLatestIdx(runs);
  const run = aiUnifiedState.reportRun || runs[latestIdx];
  if (!run) { toast('No assessment to export', '#b45309'); return; }

  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const fw = aiuFrameworksFromRun(run);
  const scores = aiuCalcScore(answers, fw);
  const nistAxes = aiuCalcNistFunctionScores(answers, fw);
  const isoAxes  = aiuCalcIsoClauseScores(answers, fw);
  const gaps = aiuWeightedGaps(answers, fw);
  const score = scores.overall ?? 0;
  const band = aiuScoreBand(score);
  const bandCol = aiuScoreColor(score);
  const rawCommentary = aiUnifiedState.reportCommentary || (run.answers || {})._exec_commentary || '';
  const fwLabel = [fw.nist !== false ? 'NIST AI RMF v1.0' : '', fw.iso !== false ? 'ISO/IEC 42001:2023' : ''].filter(Boolean).join(' + ');

  // ── Commentary parser — identical to CIS pattern ─────────────────────────────
  // Supports prose paragraphs, KEY FINDINGS bullet table, PRIORITY RECOMMENDATIONS numbered table
  function fmtCommentary(text, placeholder) {
    if (!text) return placeholder
      ? `<p style="color:#94a3b8;font-style:italic;font-size:10pt;margin:0 0 10pt 0">${placeholder}</p>`
      : '';
    let html = '';
    let mode = 'prose';
    let items = [];
    function flushItems() {
      if (!items.length) return;
      if (mode === 'findings') {
        html += '<table style="width:100%;border-collapse:collapse;margin:0 0 10pt 0">' +
          items.map(l => `<tr>
            <td style="width:14pt;vertical-align:top;padding:4pt 8pt 4pt 0;color:#152168;font-size:14pt;line-height:1">&#8226;</td>
            <td style="font-size:11pt;line-height:1.65;padding:4pt 0;vertical-align:top;border-bottom:1pt solid #f1f5f9">${escH(l)}</td>
          </tr>`).join('') + '</table>';
      } else if (mode === 'recommendations') {
        html += '<table style="width:100%;border-collapse:collapse;margin:0 0 10pt 0">' +
          items.map((l, i) => `<tr>
            <td style="background:#152168;color:#fff;width:24pt;text-align:center;font-size:11pt;font-weight:bold;vertical-align:top;padding:7pt 4pt;border-bottom:1pt solid #1e3080">${i + 1}</td>
            <td style="padding:7pt 10pt;border-bottom:1pt solid #e8ecf4;font-size:11pt;line-height:1.65;vertical-align:top">${escH(l)}</td>
          </tr>`).join('') + '</table>';
      }
      items = [];
    }
    text.split('\n').map(l => l.trim()).forEach(line => {
      if (!line) return;
      if (/^KEY FINDINGS$/i.test(line)) {
        flushItems();
        html += `<div style="font-size:9.5pt;color:#152168;font-weight:bold;text-transform:uppercase;letter-spacing:.5pt;margin:14pt 0 5pt 0;padding-bottom:3pt;border-bottom:1.5pt solid #152168">Key Findings</div>`;
        mode = 'findings'; return;
      }
      if (/^PRIORITY RECOMMENDATIONS$/i.test(line)) {
        flushItems();
        html += `<div style="font-size:9.5pt;color:#152168;font-weight:bold;text-transform:uppercase;letter-spacing:.5pt;margin:14pt 0 5pt 0;padding-bottom:3pt;border-bottom:1.5pt solid #152168">Priority Recommendations</div>`;
        mode = 'recommendations'; return;
      }
      const content = line.replace(/^[•\-]\s*/, '');
      if (mode === 'findings' || mode === 'recommendations') {
        items.push(content);
      } else {
        html += `<p style="font-size:11pt;line-height:1.75;margin:0 0 8pt 0">${escH(line)}</p>`;
      }
    });
    flushItems();
    return html;
  }

  // ── Canvas gauge ──────────────────────────────────────────────────────────────
  let gaugeImg = null;
  {
    const _gc = document.createElement('canvas');
    _gc.width = 280; _gc.height = 155;
    _gc.style.cssText = 'position:fixed;left:-9999px;pointer-events:none';
    document.body.appendChild(_gc);
    const _ctx = _gc.getContext('2d');
    const cx = 140, cy = 130, r = 105, tw = 18;
    const t = Math.max(0.02, Math.min(0.98, score / 100));
    _ctx.beginPath(); _ctx.arc(cx, cy, r, Math.PI, 0, false);
    _ctx.strokeStyle = '#e8edf5'; _ctx.lineWidth = tw; _ctx.lineCap = 'butt'; _ctx.stroke();
    const _grad = _ctx.createLinearGradient(cx - r, 0, cx + r, 0);
    _grad.addColorStop(0, '#dc2626'); _grad.addColorStop(0.30, '#f97316');
    _grad.addColorStop(0.55, '#f59e0b'); _grad.addColorStop(0.75, '#84cc16');
    _grad.addColorStop(1.00, '#15803d');
    _ctx.beginPath(); _ctx.arc(cx, cy, r, Math.PI, 0, false);
    _ctx.strokeStyle = _grad; _ctx.lineWidth = tw; _ctx.lineCap = 'butt'; _ctx.stroke();
    const nx = cx + r * 0.84 * Math.cos(Math.PI + t * Math.PI);
    const ny = cy + r * 0.84 * Math.sin(Math.PI + t * Math.PI);
    _ctx.beginPath(); _ctx.moveTo(cx, cy); _ctx.lineTo(nx, ny);
    _ctx.strokeStyle = '#152168'; _ctx.lineWidth = 3.5; _ctx.lineCap = 'round'; _ctx.stroke();
    _ctx.beginPath(); _ctx.arc(cx, cy, 9, 0, Math.PI * 2); _ctx.fillStyle = '#152168'; _ctx.fill();
    _ctx.beginPath(); _ctx.arc(cx, cy, 5, 0, Math.PI * 2); _ctx.fillStyle = '#fff'; _ctx.fill();
    _ctx.textAlign = 'center';
    _ctx.font = 'bold 34px Arial, sans-serif'; _ctx.fillStyle = '#152168';
    _ctx.fillText(score + '%', cx, 82);
    _ctx.font = 'bold 12px Arial, sans-serif'; _ctx.fillStyle = bandCol;
    _ctx.fillText(band, cx, 100);
    _ctx.font = '9px Arial, sans-serif'; _ctx.fillStyle = '#94a3b8';
    _ctx.textAlign = 'left';  _ctx.fillText('Low',  cx - r + 2,  150);
    _ctx.textAlign = 'right'; _ctx.fillText('High', cx + r - 2, 150);
    gaugeImg = _gc.toDataURL('image/png');
    document.body.removeChild(_gc);
  }

  // ── Off-screen framework radars ───────────────────────────────────────────────
  let nistRadarImg = null, isoRadarImg = null;
  if (fw.nist !== false && nistAxes.filter(a => a.pct !== null).length) {
    const _nc = document.createElement('canvas');
    _nc.width = 420; _nc.height = 380;
    _nc.style.cssText = 'position:fixed;left:-9999px;pointer-events:none';
    document.body.appendChild(_nc);
    aiuDrawFrameworkRadar(_nc, nistAxes, 'rgba(29,78,216,0.12)', '#1d4ed8');
    nistRadarImg = _nc.toDataURL('image/png');
    document.body.removeChild(_nc);
  }
  if (fw.iso !== false && isoAxes.filter(a => a.pct !== null).length) {
    const _ic = document.createElement('canvas');
    _ic.width = 420; _ic.height = 380;
    _ic.style.cssText = 'position:fixed;left:-9999px;pointer-events:none';
    document.body.appendChild(_ic);
    aiuDrawFrameworkRadar(_ic, isoAxes, 'rgba(15,118,110,0.12)', '#0f766e');
    isoRadarImg = _ic.toDataURL('image/png');
    document.body.removeChild(_ic);
  }

  // ── Pyramid maturity state table ──────────────────────────────────────────────
  const pyrState = aiuBuildPyramidState(answers);
  const PYR_STATUS = {
    green:  { label: 'Implemented',   bg: '#dcfce7', col: '#15803d' },
    yellow: { label: 'Partial',        bg: '#fef3c7', col: '#b45309' },
    blue:   { label: 'In Progress',    bg: '#dbeafe', col: '#1d4ed8' },
    red:    { label: 'Not Addressed',  bg: '#fee2e2', col: '#dc2626' },
  };
  const pyrRowsHtml = AI_PYR_TIERS.map(tier => {
    const tc = AI_PYR_TIER_COLORS[tier.label];
    const segs = tier.cols.filter(c => c.type === 'seg');
    const segRows = segs.map(seg => {
      const st = PYR_STATUS[pyrState[seg.id]] || PYR_STATUS.red;
      const cat = AI_PYR_CATALOGUE[seg.sku] || {};
      return `<tr>
        <td style="padding:4pt 8pt;font-size:9.5pt;font-weight:700">${escH(seg.name)}</td>
        <td style="padding:4pt 8pt;font-size:8pt;color:#5a6a8a">${escH(cat.rmf || '')}</td>
        <td style="padding:4pt 8pt;font-size:8pt;color:#5a6a8a">${escH(cat.iso || '')}</td>
        <td style="padding:4pt 8pt;text-align:center">
          <span style="background:${st.bg};color:${st.col};padding:2pt 8pt;border-radius:8pt;font-size:8.5pt;font-weight:bold;white-space:nowrap">${st.label}</span>
        </td>
      </tr>`;
    }).join('');
    return `<tr><td colspan="4" style="background:${tc.bg};color:${tc.text};font-weight:bold;font-size:9.5pt;padding:5pt 8pt;border:none;letter-spacing:.3pt">${escH(tier.label)}</td></tr>${segRows}`;
  }).join('');

  // ── Top 10 priority gaps ──────────────────────────────────────────────────────
  const top10 = gaps.slice(0, 10);
  const gapRowsHtml = top10.map((g, i) => {
    const gm = AI_GROUP_META[g.grp];
    const ansCol = g.answer === 'no' ? '#dc2626' : '#b45309';
    return `<tr>
      <td style="text-align:center;font-weight:900;color:${ansCol};font-size:13pt">${i + 1}</td>
      <td style="font-weight:bold;color:#152168;white-space:nowrap;font-size:9pt">${g.id}</td>
      <td style="font-size:9pt;font-weight:700;color:${gm.txt||gm.color}">${escH(gm.label)}</td>
      <td style="font-weight:700">${escH(g.title)}</td>
      <td style="text-align:center;font-weight:700;color:${ansCol}">${g.answer === 'no' ? 'No' : 'Partial'}</td>
      <td style="text-align:center;font-weight:700;color:${AI_WEIGHT_COLORS[g.weight]}">${AI_WEIGHT_LABELS[g.weight]}</td>
    </tr>`;
  }).join('');

  // ── Full 44-control assessment ────────────────────────────────────────────────
  const _aL = { yes: 'Yes', partial: 'Partial', no: 'No', na: 'N/A' };
  const _aC = { yes: '#15803d', partial: '#b45309', no: '#dc2626', na: '#94a3b8' };
  const byGrp = {};
  AI_UNIFIED_CONTROLS.forEach(c => {
    if (!byGrp[c.grp]) byGrp[c.grp] = [];
    byGrp[c.grp].push(c);
  });
  const fullTableHtml = AI_GROUP_ORDER.filter(g => byGrp[g]).map(grpKey => {
    const gm = AI_GROUP_META[grpKey];
    const sfRows = byGrp[grpKey].map(c => {
      const ans = answers[c.id] || '';
      const fwBadge = c.frameworks === 'nist' ? '<span style="background:#dbeafe;color:#1d4ed8;padding:1pt 5pt;border-radius:6pt;font-size:7.5pt;font-weight:bold">NIST</span>'
                    : c.frameworks === 'iso'  ? '<span style="background:#ccfbf1;color:#0f766e;padding:1pt 5pt;border-radius:6pt;font-size:7.5pt;font-weight:bold">ISO</span>'
                    : '<span style="background:#ede9fe;color:#6d28d9;padding:1pt 5pt;border-radius:6pt;font-size:7.5pt;font-weight:bold">Both</span>';
      return `<tr>
        <td style="font-weight:bold;color:#152168;white-space:nowrap;font-size:9pt">${c.id}</td>
        <td style="text-align:center">${fwBadge}</td>
        <td style="font-weight:bold;color:${_aC[ans]||'#94a3b8'};text-align:center;font-size:9pt">${_aL[ans]||'—'}</td>
        <td><strong style="font-size:9.5pt">${escH(c.title)}</strong><br>
            <span style="font-size:8pt;color:#5a6a8a">${escH(c.desc||'')}</span></td>
        <td style="text-align:center;font-size:8.5pt;font-weight:700;color:${AI_WEIGHT_COLORS[c.weight]}">${AI_WEIGHT_LABELS[c.weight]}</td>
      </tr>`;
    }).join('');
    return `<tr><td colspan="5" style="background:${gm.color};color:#fff;font-weight:bold;font-size:9.5pt;padding:5pt 8pt;border:none">${gm.icon} ${gm.label}</td></tr>${sfRows}`;
  }).join('');

  // ── Build HTML document ───────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8">
<title>AI Governance Assessment — Executive Report — ${escH(currentOrg?.name || '')}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11pt; color: #1a2340; margin: 0; padding: 0; }
  .page { padding: 2.5cm; max-width: 19cm; margin: 0 auto; }
  h1 { font-size: 20pt; color: #152168; margin: 0 0 4pt 0; font-weight: bold; }
  h2 { font-size: 11pt; color: #152168; margin: 20pt 0 6pt 0; font-weight: bold;
       border-bottom: 1.5pt solid #152168; padding-bottom: 3pt;
       text-transform: uppercase; letter-spacing: .5pt; }
  .sub { font-size: 10pt; color: #5a6a8a; margin: 0 0 20pt 0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10pt; font-size: 10pt; }
  th { background: #152168; color: #fff; text-align: left; padding: 5pt 8pt;
       font-size: 9pt; text-transform: uppercase; letter-spacing: .4pt; }
  td { padding: 5pt 8pt; border-bottom: 1pt solid #e8ecf4; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .footer { margin-top: 28pt; padding-top: 8pt; border-top: 1pt solid #dde3ef; font-size: 8pt; color: #94a3b8; }
</style>
</head>
<body>
<div class="page">

<h1>AI Governance Assessment — Executive Report</h1>
<div class="sub">
  ${escH(currentOrg?.name || '')} &nbsp;&middot;&nbsp; ${fwLabel} &nbsp;&middot;&nbsp; ${run.date || '&mdash;'}${run.conductedBy ? ' &nbsp;&middot;&nbsp; Assessed by: ' + escH(run.conductedBy) : ''}
</div>

<h2>Executive Summary</h2>
${fmtCommentary(rawCommentary, 'No executive commentary saved. Use the AI Prompt button in the exec report view to generate commentary, save it, then export.')}

<h2>Overall Security Score</h2>
<div style="display:flex;gap:24pt;margin-bottom:12pt;align-items:flex-start">
  <div style="flex-shrink:0;text-align:center">${gaugeImg ? `<img src="${gaugeImg}" style="width:240px;display:block">` : ''}</div>
  <div style="flex:1">
    <table style="margin:0;font-size:10pt">
      ${[
        ['Framework',         fwLabel,                                                           '#152168'],
        ['Overall Score',     score + '%  — ' + band,                                           bandCol],
        fw.nist !== false && scores.nist !== null ? ['NIST AI RMF', scores.nist + '%', '#1d4ed8'] : null,
        fw.iso  !== false && scores.iso  !== null ? ['ISO 42001',   scores.iso  + '%', '#0f766e'] : null,
        ['Total Gaps',        gaps.length + ' controls need attention',                         gaps.length > 0 ? '#dc2626' : '#15803d'],
        ['Assessed',          run.date || '—',                                                  '#5a6a8a'],
        ['Assessor',          run.conductedBy || '—',                                           '#5a6a8a'],
      ].filter(Boolean).map(([l, v, c]) => `<tr>
        <td style="padding:4pt 8pt 4pt 0;border:none;color:#5a6a8a;font-size:9.5pt;white-space:nowrap">${l}</td>
        <td style="padding:4pt 0;border:none;font-weight:bold;font-size:9.5pt;color:${c}">${v}</td>
      </tr>`).join('')}
    </table>
  </div>
</div>

<h2>Framework Breakdown</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:16pt">
  <tr valign="top">
    ${nistRadarImg ? `<td style="width:50%;text-align:center;padding:0 12pt 0 0;border:none">
      <div style="font-size:10pt;font-weight:bold;color:#1d4ed8;margin-bottom:6pt">NIST AI RMF</div>
      <img src="${nistRadarImg}" style="width:200pt;display:block;margin:0 auto">
      <table style="margin:8pt auto 0;border-collapse:collapse;font-size:9pt;width:auto">
        <tbody>${nistAxes.filter(a=>a.pct!==null).map(a=>`<tr>
          <td style="padding:2pt 16pt 2pt 0;color:#5a6a8a;border:none;text-align:left">${a.label}</td>
          <td style="font-weight:800;color:#1d4ed8;border:none;text-align:right">${a.pct}%</td>
        </tr>`).join('')}</tbody>
      </table>
    </td>` : '<td style="width:50%;border:none"></td>'}
    ${isoRadarImg ? `<td style="width:50%;text-align:center;padding:0 0 0 12pt;border:none">
      <div style="font-size:10pt;font-weight:bold;color:#0f766e;margin-bottom:6pt">ISO 42001</div>
      <img src="${isoRadarImg}" style="width:200pt;display:block;margin:0 auto">
      <table style="margin:8pt auto 0;border-collapse:collapse;font-size:9pt;width:auto">
        <tbody>${isoAxes.filter(a=>a.pct!==null).map(a=>`<tr>
          <td style="padding:2pt 16pt 2pt 0;color:#5a6a8a;border:none;text-align:left">${a.label}</td>
          <td style="font-weight:800;color:#0f766e;border:none;text-align:right">${a.pct}%</td>
        </tr>`).join('')}</tbody>
      </table>
    </td>` : '<td style="width:50%;border:none"></td>'}
  </tr>
</table>

<h2>AI Maturity Pyramid</h2>
${aiuBuildPyramidSvgStr(pyrState)}
<table style="width:auto;margin:8pt auto 0;border-collapse:collapse">
  <tbody><tr>
    <td style="padding:4pt 14pt;border:none;font-size:9pt"><span style="display:inline-block;width:10px;height:10px;background:#c00000;margin-right:5px;border-radius:2px;vertical-align:middle"></span>Not Addressed</td>
    <td style="padding:4pt 14pt;border:none;font-size:9pt"><span style="display:inline-block;width:10px;height:10px;background:#e8a000;margin-right:5px;border-radius:2px;vertical-align:middle"></span>Partial</td>
    <td style="padding:4pt 14pt;border:none;font-size:9pt"><span style="display:inline-block;width:10px;height:10px;background:#2e7ab0;margin-right:5px;border-radius:2px;vertical-align:middle"></span>In Progress</td>
    <td style="padding:4pt 14pt;border:none;font-size:9pt"><span style="display:inline-block;width:10px;height:10px;background:#00af50;margin-right:5px;border-radius:2px;vertical-align:middle"></span>Implemented</td>
  </tr></tbody>
</table>

<h2>Top ${top10.length} Priority Gaps</h2>
${top10.length ? `<table>
  <thead><tr><th style="width:20pt">#</th><th style="width:56pt">ID</th><th style="width:100pt">Domain</th><th>Gap</th><th style="width:44pt;text-align:center">Status</th><th style="width:56pt;text-align:center">Priority</th></tr></thead>
  <tbody>${gapRowsHtml}</tbody>
</table>` : '<p style="color:#15803d;font-weight:bold">&#10003; No gaps &mdash; all assessed controls are Yes or N/A.</p>'}

<div style="page-break-before: always">
  <h2>Full Assessment &mdash; All Controls</h2>
  <table>
    <thead><tr>
      <th style="width:52pt">Control</th>
      <th style="width:36pt">Framework</th>
      <th style="width:44pt">Answer</th>
      <th>Title &amp; Description</th>
      <th style="width:52pt;text-align:center">Priority</th>
    </tr></thead>
    <tbody>${fullTableHtml}</tbody>
  </table>
</div>

<div class="footer">
  Generated by Abbott Cyber Consulting GRC Platform &nbsp;&middot;&nbsp;
  ${fwLabel} &nbsp;&middot;&nbsp; ${run.date || '—'} &nbsp;&middot;&nbsp; ${escH(currentOrg?.name || '')} &nbsp;&middot;&nbsp; Confidential
</div>

</div>
</body>
</html>`;

  const blob = new Blob(['﻿' + html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const slug = (currentOrg?.name || 'AI').replace(/[^a-zA-Z0-9]/g, '_');
  a.download = `AI_Exec_Report_${slug}_${run.date || 'unknown'}.doc`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('✓ Word report downloaded', '#152168');
}

// ── FRAMEWORK RADAR HELPERS ───────────────────────────────────────────────────

function aiuCalcNistFunctionScores(answers, fw) {
  if (fw?.nist === false) return [];
  const fnDefs = [
    { fn: 'GOVERN', label: 'Govern'  },
    { fn: 'MAP',    label: 'Map'     },
    { fn: 'MEASURE',label: 'Measure' },
    { fn: 'MANAGE', label: 'Manage'  },
  ];
  return fnDefs.map(({ fn, label }) => {
    const controls = AI_UNIFIED_CONTROLS.filter(c =>
      c.nist && c.nist.some(id => id.startsWith(fn + '-')) && c.frameworks !== 'iso'
    );
    let totalW = 0, earnedW = 0;
    controls.forEach(c => {
      const v = answers[c.id];
      const val = v==='yes'?1:v==='partial'?0.5:v==='no'?0:null;
      if (val===null) return;
      totalW += c.weight; earnedW += val*c.weight;
    });
    return { fn, label, pct: totalW>0?Math.round(earnedW/totalW*100):null, total: controls.length };
  });
}

function aiuCalcIsoClauseScores(answers, fw) {
  if (fw?.iso === false) return [];
  const clauseDefs = [
    { cl:'4',  label:'Context'     },
    { cl:'5',  label:'Leadership'  },
    { cl:'6',  label:'Planning'    },
    { cl:'7',  label:'Support'     },
    { cl:'8',  label:'Operation'   },
    { cl:'9',  label:'Performance' },
    { cl:'10', label:'Improvement' },
    { cl:'A',  label:'Annex A'     },
  ];
  return clauseDefs.map(({ cl, label }) => {
    const prefix = cl==='A'?'A.':cl+'.';
    const controls = AI_UNIFIED_CONTROLS.filter(c =>
      c.iso && c.iso.some(id => id.startsWith(prefix)) && c.frameworks !== 'nist'
    );
    let totalW = 0, earnedW = 0;
    controls.forEach(c => {
      const v = answers[c.id];
      const val = v==='yes'?1:v==='partial'?0.5:v==='no'?0:null;
      if (val===null) return;
      totalW += c.weight; earnedW += val*c.weight;
    });
    return { cl, label, pct: totalW>0?Math.round(earnedW/totalW*100):null, total: controls.length };
  }).filter(c => c.total > 0);
}

function aiuDrawFrameworkRadar(canvas, axes, fillColor, strokeColor) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const valid = axes.filter(a => a.pct !== null);
  const N = valid.length;
  if (!N) return;
  const cx = W/2, cy = H/2+6, R = Math.min(W,H)*0.30, labelPad = 40;
  function angle(i) { return (Math.PI*2*i/N) - Math.PI/2; }
  function ptR(i, r) { return [cx + r*Math.cos(angle(i)), cy + r*Math.sin(angle(i))]; }
  function pt(i, val) { return ptR(i, (val/100)*R); }
  [0.25, 0.5, 0.75, 1].forEach(level => {
    ctx.beginPath();
    for (let i=0; i<N; i++) { const p=ptR(i,level*R); i===0?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]); }
    ctx.closePath();
    ctx.strokeStyle = level===1?'#9ca3af':'#e5e7eb'; ctx.lineWidth = level===1?1.5:0.8;
    if (level===1) ctx.setLineDash([4,3]); ctx.stroke(); ctx.setLineDash([]);
  });
  for (let i=0; i<N; i++) {
    const op = ptR(i, R); ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(op[0],op[1]);
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 0.8; ctx.stroke();
  }
  ctx.beginPath();
  valid.forEach((a,i) => { const p=pt(i,a.pct??0); i===0?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]); });
  ctx.closePath(); ctx.fillStyle = fillColor; ctx.fill();
  ctx.strokeStyle = strokeColor; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();
  valid.forEach((a,i) => {
    const p = pt(i, a.pct??0);
    ctx.beginPath(); ctx.arc(p[0],p[1],4,0,Math.PI*2);
    ctx.fillStyle = a.pct>=70?'#15803d':a.pct>=40?'#d97706':'#dc2626';
    ctx.fill(); ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.stroke();
  });
  for (let i=0; i<N; i++) {
    const ang = angle(i);
    const lp = [cx+(R+labelPad)*Math.cos(ang), cy+(R+labelPad)*Math.sin(ang)];
    const xOff = Math.cos(ang);
    ctx.textAlign = xOff>0.15?'left':xOff<-0.15?'right':'center';
    ctx.font = 'bold 9px Arial'; ctx.fillStyle = '#374151';
    ctx.fillText(valid[i].label, lp[0], lp[1]);
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = valid[i].pct>=70?'#15803d':valid[i].pct>=40?'#d97706':'#dc2626';
    ctx.fillText((valid[i].pct??'—')+'%', lp[0], lp[1]+12);
  }
}

function aiuCopyGapPrompt() {
  const run = aiUnifiedState.reportRun;
  if (!run) return;
  const answers = Object.fromEntries(Object.entries(run.answers||{}).filter(([k])=>!k.startsWith('_')));
  const fw = aiuFrameworksFromRun(run);
  const gaps = aiuWeightedGaps(answers, fw);
  const scores = aiuCalcScore(answers, fw);
  const gapList = gaps.map(g=>`- [${g.answer.toUpperCase()}] ${g.id} (${AI_WEIGHT_LABELS[g.weight]}, priority: ${g.priorityScore.toFixed(1)}): ${g.title}\n  Maps to: ${[...(g.nist||[]),...(g.iso||[])].join(', ')}`).join('\n');

  const prompt = `I need a prioritised AI governance remediation roadmap.

ORGANISATION: ${currentOrg?.name}
ASSESSMENT DATE: ${run.date||'Unknown'}
FRAMEWORKS: ${fw.nist!==false?'NIST AI RMF v1.0':''}${fw.nist!==false&&fw.iso!==false?' + ':''}${fw.iso!==false?'ISO/IEC 42001:2023':''}
OVERALL SCORE: ${scores.overall??'—'}%

GAPS (${gaps.length} total, sorted by priority score — weight × severity):
${gapList||'— No gaps —'}

Please produce:
1. A 90-day roadmap grouping gaps into: Quick Wins (< 2 weeks), Sprint 1 (30 days), Sprint 2 (90 days).
2. For each gap, a plain-language explanation of the business risk if left unaddressed.
3. For the top 5, specific first actions the organisation can take this week.

Write for a non-technical founder. Focus on practical, lowest-cost actions that close the most ground fastest.`;

  navigator.clipboard.writeText(prompt)
    .then(() => toast('✓ Gap prompt copied — paste into Claude', '#152168'))
    .catch(() => toast('Clipboard blocked', '#b45309'));
}
