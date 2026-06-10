// ============================================================
// NIST AI RMF v1.0 — AI Risk Management Framework
// 68 sub-categories · 4 functions: Govern, Map, Measure, Manage
// ============================================================

const NIST_AI_CONTROLS = [
  // ── GOVERN ───────────────────────────────────────────────────────────────────
  { fn: 'govern', fnName: 'Govern', grp: 1, grpName: 'Policies, Processes & Accountability', id: 'GOVERN-1.1',
    title: 'AI risk management policies are in place',
    desc: 'Policies, processes, procedures, and practices across the organization related to the mapping, measuring, and managing of AI risks are in place, transparent, and implemented effectively.' },
  { fn: 'govern', fnName: 'Govern', grp: 1, grpName: 'Policies, Processes & Accountability', id: 'GOVERN-1.2',
    title: 'AI risk accountability is defined',
    desc: 'Accountability and responsibility for AI risk management are in place, with accountability structures established and clear roles identified at the senior leadership, executive, and operational levels.' },
  { fn: 'govern', fnName: 'Govern', grp: 1, grpName: 'Policies, Processes & Accountability', id: 'GOVERN-1.3',
    title: 'Organizational culture considers AI risk',
    desc: 'Organizational teams are committed to a culture that considers and communicates AI risk, including awareness of bias, equity, and ethical implications in AI systems.' },
  { fn: 'govern', fnName: 'Govern', grp: 1, grpName: 'Policies, Processes & Accountability', id: 'GOVERN-1.4',
    title: 'Diverse perspectives inform AI risk management',
    desc: 'Organizational teams include AI development and deployment considerations that arise from diverse perspectives, including domain experts, affected communities, and human factors specialists.' },
  { fn: 'govern', fnName: 'Govern', grp: 1, grpName: 'Policies, Processes & Accountability', id: 'GOVERN-1.5',
    title: 'External feedback on AI is collected and integrated',
    desc: 'Organizational policies and practices are in place to collect, consider, prioritize, and integrate feedback from those external to the team that developed or deployed the AI system, including end users and affected communities.' },
  { fn: 'govern', fnName: 'Govern', grp: 1, grpName: 'Policies, Processes & Accountability', id: 'GOVERN-1.6',
    title: 'AI supply chain risks are addressed',
    desc: 'Policies and procedures are in place to address AI risks and benefits arising from third-party software and data and other supply chain issues, including pre-trained models and external datasets.' },
  { fn: 'govern', fnName: 'Govern', grp: 1, grpName: 'Policies, Processes & Accountability', id: 'GOVERN-1.7',
    title: 'AI system decommissioning is managed safely',
    desc: 'Processes and procedures are in place for decommissioning and phasing out AI systems safely and in a manner that does not increase risks or decrease the organization\'s trustworthiness.' },

  { fn: 'govern', fnName: 'Govern', grp: 2, grpName: 'Roles & Responsibilities', id: 'GOVERN-2.1',
    title: 'Cross-functional AI teams are established',
    desc: 'Roles and responsibilities and organizational structures to support effective cross-functional teams are established for teams developing, deploying, evaluating, and auditing AI systems.' },
  { fn: 'govern', fnName: 'Govern', grp: 2, grpName: 'Roles & Responsibilities', id: 'GOVERN-2.2',
    title: 'AI risk management training is provided',
    desc: 'The organization\'s personnel and partners receive AI risk management training to enable them to perform their duties and responsibilities consistent with related policies, procedures, and agreements.' },

  { fn: 'govern', fnName: 'Govern', grp: 3, grpName: 'Team Diversity & Human Oversight', id: 'GOVERN-3.1',
    title: 'Diverse team input informs AI risk decisions',
    desc: 'Decision-making related to mapping, measuring, and managing AI risks is informed by a diverse team that includes domain experts, affected communities, and others with relevant expertise.' },
  { fn: 'govern', fnName: 'Govern', grp: 3, grpName: 'Team Diversity & Human Oversight', id: 'GOVERN-3.2',
    title: 'Human oversight roles for AI are defined',
    desc: 'Policies and procedures are in place to define and differentiate roles and responsibilities for human-AI configurations and oversight of AI systems, including human-in-the-loop, human-on-the-loop, and human-out-of-the-loop scenarios.' },

  { fn: 'govern', fnName: 'Govern', grp: 4, grpName: 'Risk Documentation & Communication', id: 'GOVERN-4.1',
    title: 'Safety-first mindset is fostered in AI development',
    desc: 'Organizational policies and practices are in place to foster a critical thinking and safety-first mindset in the design, development, deployment, and uses of AI systems to minimize potential negative impacts.' },
  { fn: 'govern', fnName: 'Govern', grp: 4, grpName: 'Risk Documentation & Communication', id: 'GOVERN-4.2',
    title: 'AI risks and impacts are documented and communicated',
    desc: 'Organizational teams document the risks and potential impacts of the AI technology they design, develop, deploy, evaluate, and use, and communicate about those impacts broadly to relevant stakeholders.' },

  { fn: 'govern', fnName: 'Govern', grp: 5, grpName: 'Stakeholder Feedback', id: 'GOVERN-5.1',
    title: 'Stakeholder feedback practices are in place',
    desc: 'Organizational policies and practices are in place to collect, consider, prioritize, and integrate feedback from relevant stakeholders during the design, development, deployment, and operation of AI systems.' },
  { fn: 'govern', fnName: 'Govern', grp: 5, grpName: 'Stakeholder Feedback', id: 'GOVERN-5.2',
    title: 'Stakeholder feedback is incorporated into AI systems',
    desc: 'Mechanisms are established to enable the team that developed or deployed an AI system to regularly incorporate adjudicated feedback from relevant stakeholders into system design and implementation.' },

  { fn: 'govern', fnName: 'Govern', grp: 6, grpName: 'Contingency & Incident Readiness', id: 'GOVERN-6.1',
    title: 'Policies address internal and external AI use cases',
    desc: 'Policies and procedures are in place to address risks and opportunities from external and internal use cases or sources, including the organization\'s own use of AI and AI systems used by partners or customers.' },
  { fn: 'govern', fnName: 'Govern', grp: 6, grpName: 'Contingency & Incident Readiness', id: 'GOVERN-6.2',
    title: 'AI system failure contingency processes exist',
    desc: 'Contingency processes are in place to handle failures or incidents in AI systems, including documented response plans, escalation paths, and rollback or shutdown procedures.' },

  // ── MAP ───────────────────────────────────────────────────────────────────────
  { fn: 'map', fnName: 'Map', grp: 1, grpName: 'Context Establishment', id: 'MAP-1.1',
    title: 'Context is established for AI risk assessment',
    desc: 'Context is established for the AI risk assessment and management process, including the risk or opportunity and the relevant data, output, and decisions that the AI system will affect.' },
  { fn: 'map', fnName: 'Map', grp: 1, grpName: 'Context Establishment', id: 'MAP-1.2',
    title: 'AI RMF implementation methods are documented',
    desc: 'The specific tasks and methods used to implement the principles of the AI RMF and its practices are documented, communicated, and available for review and update.' },
  { fn: 'map', fnName: 'Map', grp: 1, grpName: 'Context Establishment', id: 'MAP-1.3',
    title: 'AI risk tolerance reflects organizational mission',
    desc: 'The organization\'s mission and relevant priorities are used to inform and determine AI risk tolerance, ensuring that risk management decisions are aligned with strategic goals.' },
  { fn: 'map', fnName: 'Map', grp: 1, grpName: 'Context Establishment', id: 'MAP-1.4',
    title: 'Resources are dedicated to AI risk management',
    desc: 'Organizational teams dedicate time and resources to the mapping, measuring, and managing of AI risks, with appropriate budget, staffing, and tooling allocated.' },
  { fn: 'map', fnName: 'Map', grp: 1, grpName: 'Context Establishment', id: 'MAP-1.5',
    title: 'AI risk priorities align with business strategy',
    desc: 'Organizational risk priorities are established in relation to business strategy and stakeholder needs, ensuring that AI risk management is integrated with enterprise risk management.' },
  { fn: 'map', fnName: 'Map', grp: 1, grpName: 'Context Establishment', id: 'MAP-1.6',
    title: 'Risk tolerance is documented and reviewed',
    desc: 'Risk tolerance is established in relation to organizational risk priorities and is documented, communicated, and reviewed regularly to reflect changes in the risk environment.' },

  { fn: 'map', fnName: 'Map', grp: 2, grpName: 'Categorization of AI Systems', id: 'MAP-2.1',
    title: 'Scientific AI risk findings inform policy',
    desc: 'Scientific findings related to AI risk are reviewed and used to drive policy, guidelines, and procedures, ensuring that risk management practices reflect the current state of knowledge.' },
  { fn: 'map', fnName: 'Map', grp: 2, grpName: 'Categorization of AI Systems', id: 'MAP-2.2',
    title: 'AI risk research is incorporated into practices',
    desc: 'Scientific findings related to AI risk are reviewed and incorporated into policies and procedures for alignment with internal practice, including updates to training materials and evaluation criteria.' },
  { fn: 'map', fnName: 'Map', grp: 2, grpName: 'Categorization of AI Systems', id: 'MAP-2.3',
    title: 'Third-party AI actor risks are mapped',
    desc: 'AI risks and benefits related to third parties (AI actors) are mapped, including risks from data providers, model developers, system integrators, and downstream users.' },

  { fn: 'map', fnName: 'Map', grp: 3, grpName: 'AI Risk Identification', id: 'MAP-3.1',
    title: 'AI risks are identified with expert input',
    desc: 'AI risks and benefits are identified with input from domain experts and relevant AI actors, ensuring comprehensive coverage of technical, operational, and societal risks.' },
  { fn: 'map', fnName: 'Map', grp: 3, grpName: 'AI Risk Identification', id: 'MAP-3.2',
    title: 'Human oversight practices are defined',
    desc: 'The organization defines practices for human oversight of AI systems, including review processes, intervention mechanisms, and accountability structures for AI-assisted decisions.' },
  { fn: 'map', fnName: 'Map', grp: 3, grpName: 'AI Risk Identification', id: 'MAP-3.3',
    title: 'Impact assessments are completed for high-risk AI',
    desc: 'Impact assessments are completed for high-risk AI applications, documenting potential harms to individuals, communities, and the organization before deployment.' },
  { fn: 'map', fnName: 'Map', grp: 3, grpName: 'AI Risk Identification', id: 'MAP-3.4',
    title: 'AI risks are documented in a management system',
    desc: 'Risks are documented in a management system or process, ensuring that identified AI risks are tracked, assigned ownership, and monitored over time.' },
  { fn: 'map', fnName: 'Map', grp: 3, grpName: 'AI Risk Identification', id: 'MAP-3.5',
    title: 'AI system impacts are understood and documented',
    desc: 'Practices and procedures are in place to understand and document the impact of AI systems on affected individuals, communities, and the broader environment.' },

  { fn: 'map', fnName: 'Map', grp: 4, grpName: 'Risk Measurement Approaches', id: 'MAP-4.1',
    title: 'AI risk likelihood and impact measurement is documented',
    desc: 'Approaches for measuring the likelihood and impact of AI risks are documented and applied, enabling consistent, evidence-based risk prioritization.' },
  { fn: 'map', fnName: 'Map', grp: 4, grpName: 'Risk Measurement Approaches', id: 'MAP-4.2',
    title: 'Risk measurement approaches are reviewed and updated',
    desc: 'AI risk measurement approaches are reviewed and updated periodically to reflect changes in the risk environment, new research findings, and lessons learned from incidents.' },

  { fn: 'map', fnName: 'Map', grp: 5, grpName: 'Harm Anticipation & Response', id: 'MAP-5.1',
    title: 'Practices anticipate and document AI harms',
    desc: 'Practices and procedures are in place to anticipate, identify, and document risks or harms from AI systems before and during deployment, including technical, societal, and ethical harms.' },
  { fn: 'map', fnName: 'Map', grp: 5, grpName: 'Harm Anticipation & Response', id: 'MAP-5.2',
    title: 'Practices address identified AI harms',
    desc: 'Practices and procedures are in place to address risks or harms from AI systems, including remediation procedures, communication plans, and mechanisms to prevent recurrence.' },

  // ── MEASURE ───────────────────────────────────────────────────────────────────
  { fn: 'measure', fnName: 'Measure', grp: 1, grpName: 'Risk Measurement Selection', id: 'MEASURE-1.1',
    title: 'AI risk metrics are selected and implemented',
    desc: 'Approaches and metrics for measurement of AI risks, impacts, and related effects are selected for implementation starting with the most significant risks, based on context and available data.' },
  { fn: 'measure', fnName: 'Measure', grp: 1, grpName: 'Risk Measurement Selection', id: 'MEASURE-1.2',
    title: 'Teams use varied methods to identify AI risk',
    desc: 'Appropriately trained teams use a variety of methods to identify and assess AI risk, including both quantitative and qualitative approaches.' },
  { fn: 'measure', fnName: 'Measure', grp: 1, grpName: 'Risk Measurement Selection', id: 'MEASURE-1.3',
    title: 'Independent experts evaluate AI systems',
    desc: 'Internal experts who did not develop the AI system are involved in its testing and evaluation, providing an independent perspective on risks and potential failures.' },

  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.1',
    title: 'Test sets reflect deployment context',
    desc: 'Test sets, metrics, and details about the testing process reasonably reflect deployment context and environment, including realistic data distributions and use cases.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.2',
    title: 'AI risk research informs testing approach',
    desc: 'Scientific findings about AI risks are incorporated into the testing approach, ensuring that known failure modes, biases, and attack vectors are specifically tested.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.3',
    title: 'AI systems undergo pre-deployment testing',
    desc: 'AI systems to be deployed undergo testing, including adversarial testing (e.g., red-teaming), to identify potential failures and vulnerabilities before deployment.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.4',
    title: 'Post-deployment evaluation processes are documented',
    desc: 'The organization has documented processes for evaluating AI system performance post-deployment, including criteria for determining when remediation or decommissioning is required.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.5',
    title: 'Red-teaming is conducted on AI systems',
    desc: 'AI systems to be deployed undergo appropriate red-teaming by internal or external teams, specifically targeting adversarial inputs, prompt injection, and other attack scenarios.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.6',
    title: 'Third-party AI component risks are considered',
    desc: 'The risk or impact from third-party systems or AI components is considered in the overall AI risk assessment, including risks from pre-trained models, APIs, and external data pipelines.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.7',
    title: 'AI system security and resilience are evaluated',
    desc: 'AI system security and resilience are evaluated and documented, including resistance to adversarial attacks, data poisoning, model extraction, and denial-of-service scenarios.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.8',
    title: 'AI user interface risks are evaluated',
    desc: 'Risks associated with AI system user interfaces are evaluated and documented, including risks from user misunderstanding, over-reliance, and inappropriate trust in AI outputs.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.9',
    title: 'AI systems are tested for bias and fairness',
    desc: 'The AI system and the data it depends on are tested for bias, fairness, and other relevant trustworthy characteristics across demographic groups and deployment contexts.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.10',
    title: 'Privacy risks of AI systems are evaluated',
    desc: 'Privacy risk is evaluated and documented for AI systems, including risks from training data, inference attacks, and unintended disclosure of personal information.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.11',
    title: 'Fairness and bias documentation is evaluated',
    desc: 'Fairness and bias documentation of AI systems is evaluated for completeness and accuracy, including model cards, datasheets, and other transparency artifacts.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.12',
    title: 'Environmental impact of AI is evaluated',
    desc: 'Environmental impact and sustainability of AI systems are evaluated, including energy consumption during training and inference, carbon footprint, and hardware lifecycle.' },
  { fn: 'measure', fnName: 'Measure', grp: 2, grpName: 'Testing & Evaluation', id: 'MEASURE-2.13',
    title: 'Risk mitigation effectiveness is evaluated',
    desc: 'Effectiveness of risk or impact mitigation efforts are evaluated and documented, enabling evidence-based decisions about whether deployed mitigations are working as intended.' },

  { fn: 'measure', fnName: 'Measure', grp: 3, grpName: 'Ongoing Measurement Mechanisms', id: 'MEASURE-3.1',
    title: 'AI evaluation documentation is in place',
    desc: 'Approaches, metrics, and documentation are in place for testing, evaluating, verifying, and validating AI systems throughout the lifecycle, from development through decommissioning.' },
  { fn: 'measure', fnName: 'Measure', grp: 3, grpName: 'Ongoing Measurement Mechanisms', id: 'MEASURE-3.2',
    title: 'Risk tracking is applied to all AI systems',
    desc: 'Risk tracking approaches are considered for all AI systems, ensuring that risks identified during evaluation are monitored over time and that new risks are detected promptly.' },
  { fn: 'measure', fnName: 'Measure', grp: 3, grpName: 'Ongoing Measurement Mechanisms', id: 'MEASURE-3.3',
    title: 'End user feedback is incorporated into AI evaluation',
    desc: 'Feedback processes for end users and impacted communities are in place and incorporated into AI system evaluation metrics, enabling continuous improvement based on real-world experience.' },

  { fn: 'measure', fnName: 'Measure', grp: 4, grpName: 'Risk Tracking & Reporting', id: 'MEASURE-4.1',
    title: 'Risk measurement is connected to deployment context',
    desc: 'Measurement approaches for identifying AI risks are connected to deployment context or use case and informed by organizational risk tolerance, ensuring measurements are relevant and actionable.' },
  { fn: 'measure', fnName: 'Measure', grp: 4, grpName: 'Risk Tracking & Reporting', id: 'MEASURE-4.2',
    title: 'Deployed AI system measurement results are documented',
    desc: 'Measurement results regarding deployed AI systems are documented and communicated to relevant stakeholders, providing evidence for governance decisions and audit purposes.' },

  // ── MANAGE ────────────────────────────────────────────────────────────────────
  { fn: 'manage', fnName: 'Manage', grp: 1, grpName: 'Risk Response', id: 'MANAGE-1.1',
    title: 'AI system purpose achievement is assessed',
    desc: 'A determination is made as to whether the AI system achieves its intended purpose and stated objectives, considering both technical performance and real-world impacts.' },
  { fn: 'manage', fnName: 'Manage', grp: 1, grpName: 'Risk Response', id: 'MANAGE-1.2',
    title: 'AI risk response options are considered',
    desc: 'Treatment of AI risks includes consideration of available risk response options — acceptance, transfer, mitigation, and avoidance — with selection based on organizational risk tolerance.' },
  { fn: 'manage', fnName: 'Manage', grp: 1, grpName: 'Risk Response', id: 'MANAGE-1.3',
    title: 'High-priority AI risk responses are developed',
    desc: 'Responses to AI risks deemed high priority are developed, documented, and assigned to responsible parties with target resolution dates.' },
  { fn: 'manage', fnName: 'Manage', grp: 1, grpName: 'Risk Response', id: 'MANAGE-1.4',
    title: 'Residual AI risks are documented',
    desc: 'Negative residual risks — risks that cannot be fully mitigated — are documented, communicated to decision-makers, and reviewed on a regular basis.' },

  { fn: 'manage', fnName: 'Manage', grp: 2, grpName: 'Sustaining & Improving AI Value', id: 'MANAGE-2.1',
    title: 'Resources for AI risk management are allocated',
    desc: 'Resources required to manage AI risks are taken into account, with ongoing investment in risk management capabilities and tools rather than treating it as a one-time activity.' },
  { fn: 'manage', fnName: 'Manage', grp: 2, grpName: 'Sustaining & Improving AI Value', id: 'MANAGE-2.2',
    title: 'Mechanisms sustain deployed AI system value',
    desc: 'Mechanisms are in place and applied to sustain the value of deployed AI systems, including performance monitoring, model drift detection, data quality management, and periodic retraining.' },
  { fn: 'manage', fnName: 'Manage', grp: 2, grpName: 'Sustaining & Improving AI Value', id: 'MANAGE-2.3',
    title: 'AI incidents and errors are evaluated',
    desc: 'Incidents and errors related to AI systems are evaluated and documented, with root cause analysis, lessons learned, and corrective actions recorded and communicated.' },
  { fn: 'manage', fnName: 'Manage', grp: 2, grpName: 'Sustaining & Improving AI Value', id: 'MANAGE-2.4',
    title: 'Mechanisms improve AI outcomes',
    desc: 'Mechanisms are in place to improve AI system outcomes and user experience, incorporating feedback from users, monitoring data, and evolving best practices.' },

  { fn: 'manage', fnName: 'Manage', grp: 3, grpName: 'AI Risk Communication', id: 'MANAGE-3.1',
    title: 'AI risks are communicated to relevant actors',
    desc: 'AI risks and benefits are communicated to relevant AI actors upstream or downstream in the AI supply chain, ensuring all parties have the information needed to manage risks effectively.' },
  { fn: 'manage', fnName: 'Manage', grp: 3, grpName: 'AI Risk Communication', id: 'MANAGE-3.2',
    title: 'Pre-trained models are monitored',
    desc: 'Pre-trained models used for development are monitored as part of AI system maintenance, including tracking for vendor updates, vulnerabilities, and changes in model behavior.' },

  { fn: 'manage', fnName: 'Manage', grp: 4, grpName: 'Post-Deployment Monitoring', id: 'MANAGE-4.1',
    title: 'Post-deployment monitoring plans are implemented',
    desc: 'Post-deployment AI system monitoring plans are implemented, including mechanisms for capturing and evaluating input from users and other relevant AI actors to detect performance degradation and emerging risks.' },
  { fn: 'manage', fnName: 'Manage', grp: 4, grpName: 'Post-Deployment Monitoring', id: 'MANAGE-4.2',
    title: 'Performance changes are documented and corrected',
    desc: 'Measurable performance improvements or declines and associated targeted corrections are documented and evaluated, creating a continuous improvement loop for deployed AI systems.' },
];

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const NIST_FN_META = {
  govern:  { label: 'GOVERN',  icon: '🏛️', color: '#152168', light: '#dbeafe', txt: '#1e40af', count: 17 },
  map:     { label: 'MAP',     icon: '🗺️', color: '#0e7490', light: '#cffafe', txt: '#0e7490', count: 18 },
  measure: { label: 'MEASURE', icon: '📏', color: '#b45309', light: '#fef3c7', txt: '#92400e', count: 21 },
  manage:  { label: 'MANAGE',  icon: '⚙️', color: '#15803d', light: '#dcfce7', txt: '#166534', count: 12 },
};

const NIST_PROFILES = {
  developing:    { label: 'Developing',    desc: 'Early-stage AI use; focus on policies and context mapping',         bg: '#f1f5f9', txt: '#475569' },
  implementing:  { label: 'Implementing',  desc: 'Active AI deployment; operational governance across all functions', bg: '#dbeafe', txt: '#1d4ed8' },
  optimizing:    { label: 'Optimizing',    desc: 'Mature AI program; continuous improvement and advanced governance',  bg: '#dcfce7', txt: '#15803d' },
};

const NIST_PRIORITY = { govern: 'Critical', map: 'High', measure: 'Medium', manage: 'Medium' };

// ── HELPERS ───────────────────────────────────────────────────────────────────

function nistAiCalcScore(answers) {
  const controls = NIST_AI_CONTROLS;
  let yes = 0, partial = 0, no = 0, answered = 0;
  controls.forEach(c => {
    const v = answers[c.id];
    if (!v || v === 'na') return;
    answered++;
    if (v === 'yes') yes++;
    else if (v === 'partial') partial++;
    else if (v === 'no') no++;
  });
  const total = controls.length;
  const score = answered > 0 ? Math.round((yes + partial * 0.5) / total * 100) : 0;
  return { score, yes, partial, no, answered, total };
}

function nistAiCalcFnScores(answers) {
  const fns = ['govern', 'map', 'measure', 'manage'];
  return fns.map(fn => {
    const controls = NIST_AI_CONTROLS.filter(c => c.fn === fn);
    let yes = 0, partial = 0, answered = 0;
    controls.forEach(c => {
      const v = answers[c.id];
      if (!v || v === 'na') return;
      answered++;
      if (v === 'yes') yes++;
      else if (v === 'partial') partial++;
    });
    const total = controls.length;
    const pct = answered > 0 ? Math.round((yes + partial * 0.5) / total * 100) : 0;
    return { fn, yes, partial, answered, total, pct };
  });
}

function nistAiLatestIdx(runs) {
  if (!runs.length) return -1;
  return runs.reduce((best, r, i) => ((r.date || '') > (runs[best].date || '') ? i : best), 0);
}

function nistAiGetProfile() {
  return (orgProfiles[currentOrg?.id] || {}).ai_rmf_profile || null;
}

// ── RENDER ROUTER ─────────────────────────────────────────────────────────────

function renderNistAi() {
  switch (nistAiState.view) {
    case 'form':    return renderNistAiForm();
    case 'gap':     return renderNistAiGapReport();
    case 'report':  return renderNistAiExecReport();
    default:        return renderNistAiDashboard();
  }
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

function renderNistAiDashboard() {
  const orgId = currentOrg?.id;
  const runs = (orgAssessments[orgId] || {})['nist_ai'] || [];
  const latestIdx = nistAiLatestIdx(runs);
  const latest = latestIdx >= 0 ? runs[latestIdx] : null;
  const answers = latest
    ? Object.fromEntries(Object.entries(latest.answers || {}).filter(([k]) => !k.startsWith('_')))
    : {};
  const { score, answered, total } = nistAiCalcScore(answers);
  const fnScores = latest ? nistAiCalcFnScores(answers) : [];
  const profile = nistAiGetProfile();
  const profMeta = profile ? NIST_PROFILES[profile] : null;
  const band = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const bandCol = score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : score >= 40 ? '#ea580c' : '#dc2626';

  const profilePicker = Object.entries(NIST_PROFILES).map(([k, p]) => {
    const active = k === profile;
    return `<button class="btn btn-sm" onclick="nistAiSetProfile('${k}')"
      style="padding:5px 14px;font-size:12px;font-weight:700;border-radius:20px;transition:all .15s;
      ${active ? `background:${p.bg === '#f1f5f9' ? '#94a3b8' : p.bg};color:${p.txt};border:2px solid ${p.txt}` : 'background:rgba(255,255,255,.1);color:rgba(255,255,255,.7);border:2px solid rgba(255,255,255,.2)'}">
      ${p.label}${active ? ' ✓' : ''}
    </button>`;
  }).join('');

  const fnBarsHtml = fnScores.map(f => {
    const m = NIST_FN_META[f.fn];
    return `<div style="flex:1;min-width:100px">
      <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:3px">
        <span style="font-size:10px;font-weight:700;color:${m.light}">${m.icon} ${m.label}</span>
        <span style="font-size:10px;color:rgba(255,255,255,.6);margin-left:auto">${f.answered}/${f.total}</span>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.12);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${f.pct}%;background:${m.light};border-radius:2px;transition:width .4s"></div>
      </div>
      <div style="font-size:9px;color:rgba(255,255,255,.4);margin-top:2px">${f.pct}%</div>
    </div>`;
  }).join('');

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🏛️ NIST AI RMF v1.0</div>
      <div style="font-size:12px;color:var(--muted)">68 sub-categories · 4 functions: Govern, Map, Measure, Manage · NIST AI Risk Management Framework</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="setNav('ai_readiness')">← Hub</button>
      <button class="btn btn-cyan btn-sm" onclick="nistAiStartNew()">+ New Assessment</button>
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
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px">AI Risk Profile</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">${profilePicker}</div>
          ${fnScores.length > 0
            ? `<div style="display:flex;gap:12px;flex-wrap:wrap">${fnBarsHtml}</div>`
            : `<div style="font-size:11px;color:rgba(255,255,255,.3)">Run an assessment to see function coverage</div>`}
        </div>
      </div>
    </div>
    <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:8px">
      ${runs.length >= 2
        ? `<div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">Score Trend</div>
           <canvas id="nistAiTrendChart" width="200" height="60"></canvas>`
        : `<div style="font-size:11px;color:rgba(255,255,255,.3);text-align:right">${runs.length === 1 ? '1 run recorded<br>trend after 2nd save' : 'No assessments yet'}</div>`}
      <div style="font-size:10px;color:rgba(255,255,255,.35);text-align:right;margin-top:6px">
        ${runs.length} assessment${runs.length !== 1 ? 's' : ''} recorded
      </div>
    </div>
  </div>

  <div class="card" style="padding:1.25rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.1rem">
      <div style="font-size:14px;font-weight:700;color:var(--text)">Assessment History</div>
      <button class="btn btn-cyan btn-sm" onclick="nistAiStartNew()">+ New Assessment</button>
    </div>`;

  if (runs.length === 0) {
    html += `<div style="text-align:center;padding:2.5rem 1rem;color:var(--muted)">
      <div style="font-size:32px;margin-bottom:.75rem">🏛️</div>
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:6px">No assessments yet</div>
      <div style="font-size:12px;margin-bottom:1.25rem">Run your first NIST AI RMF assessment to start tracking your AI risk posture.</div>
      <button class="btn btn-cyan btn-sm" onclick="nistAiStartNew()">+ Start First Assessment</button>
    </div>`;
  } else {
    const fnCols = { govern: '#1e40af', map: '#0e7490', measure: '#92400e', manage: '#166534' };
    const fnBg   = { govern: '#dbeafe', map: '#cffafe', measure: '#fef3c7', manage: '#dcfce7' };
    html += `<table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="border-bottom:2px solid var(--border)">
          <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Date</th>
          ${Object.entries(NIST_FN_META).map(([k,m]) => `<th style="text-align:center;padding:7px 8px;font-size:10px;font-weight:700;color:${fnCols[k]};text-transform:uppercase;letter-spacing:.05em">${m.label}</th>`).join('')}
          <th style="text-align:center;padding:7px 8px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Score</th>
          <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Profile</th>
          <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Conducted By</th>
          <th style="text-align:right;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Actions</th>
        </tr>
      </thead>
      <tbody>`;

    runs.forEach((r, i) => {
      const cleanAns = Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_')));
      const fns = nistAiCalcFnScores(cleanAns);
      const { score: sc } = nistAiCalcScore(cleanAns);
      const scCol = sc >= 75 ? '#15803d' : sc >= 50 ? '#b45309' : '#dc2626';
      const prof = (r.answers || {})._profile || '';
      const pm = NIST_PROFILES[prof];
      const isLatest = i === latestIdx;

      const fnCell = (f) => {
        const pct = f.pct;
        const col = pct >= 75 ? '#15803d' : pct >= 50 ? '#b45309' : '#dc2626';
        return `<span style="font-size:13px;font-weight:700;color:${col}">${pct}</span><span style="font-size:10px;color:var(--muted)">%</span>`;
      };

      html += `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px;font-weight:${isLatest ? '700' : '400'};white-space:nowrap">
          ${r.date || '—'}
          ${isLatest ? '<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;background:#dbeafe;color:#1d4ed8;margin-left:6px">Latest</span>' : ''}
        </td>
        ${fns.map(f => `<td style="padding:8px 8px;text-align:center">${fnCell(f)}</td>`).join('')}
        <td style="padding:8px 8px;text-align:center"><span style="font-size:14px;font-weight:700;color:${scCol}">${sc}</span><span style="font-size:11px;color:var(--muted)">%</span></td>
        <td style="padding:8px 10px">${pm ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;background:${pm.bg === '#f1f5f9' ? '#e2e8f0' : pm.bg};color:${pm.txt}">${pm.label}</span>` : '<span style="color:var(--muted)">—</span>'}</td>
        <td style="padding:8px 10px;color:var(--muted)">${escH(r.conductedBy || '—')}</td>
        <td style="padding:8px 10px;text-align:right">
          <div style="display:flex;gap:4px;justify-content:flex-end;flex-wrap:wrap">
            <button class="btn btn-outline btn-sm" onclick="nistAiOpenAssessment(${i})" style="font-size:11px;padding:3px 8px">✏️ Edit</button>
            <button class="btn btn-outline btn-sm" onclick="nistAiOpenGapReport(${i})" style="font-size:11px;padding:3px 8px">🔍 Gaps</button>
            <button class="btn btn-outline btn-sm" onclick="nistAiOpenReport(${i})" style="font-size:11px;padding:3px 8px">📊 Report</button>
            <button class="btn btn-red btn-sm" onclick="nistAiDeleteConfirm(${i})" style="font-size:11px;padding:3px 8px">🗑</button>
          </div>
        </td>
      </tr>`;
    });

    html += `</tbody></table>`;
  }
  html += `</div>`;
  return html;
}

function nistAiTrendDraw() {
  const canvas = document.getElementById('nistAiTrendChart');
  if (!canvas) return;
  const runs = (orgAssessments[currentOrg?.id] || {})['nist_ai'] || [];
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  if (sorted.length < 2) return;
  const scores = sorted.map(r => {
    const ans = Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_')));
    return nistAiCalcScore(ans).score;
  });
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const min = 0, max = 100;
  const pad = 6;
  const pts = scores.map((s, i) => ({
    x: pad + (i / (scores.length - 1)) * (W - pad * 2),
    y: H - pad - ((s - min) / (max - min)) * (H - pad * 2),
  }));
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  [20, 40, 60, 80].forEach(v => {
    const y = H - pad - ((v - min) / (max - min)) * (H - pad * 2);
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

function renderNistAiForm() {
  const isEdit = !!nistAiState.editId;
  const orgId = currentOrg?.id;
  const profile = nistAiGetProfile();
  const profMeta = profile ? NIST_PROFILES[profile] : null;

  const fns = ['govern', 'map', 'measure', 'manage'];
  const fnGroups = {};
  fns.forEach(fn => {
    fnGroups[fn] = {};
    NIST_AI_CONTROLS.filter(c => c.fn === fn).forEach(c => {
      if (!fnGroups[fn][c.grp]) fnGroups[fn][c.grp] = { grpName: c.grpName, controls: [] };
      fnGroups[fn][c.grp].controls.push(c);
    });
  });

  const fnScore = (fn) => {
    const controls = NIST_AI_CONTROLS.filter(c => c.fn === fn);
    let yes = 0, partial = 0, answered = 0;
    controls.forEach(c => {
      const v = nistAiState.answers[c.id];
      if (!v || v === 'na') return;
      answered++;
      if (v === 'yes') yes++;
      else if (v === 'partial') partial++;
    });
    const total = controls.length;
    const pct = answered > 0 ? Math.round((yes + partial * 0.5) / total * 100) : null;
    return { answered, total, pct };
  };

  const { score, answered, total } = nistAiCalcScore(nistAiState.answers);

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🏛️ NIST AI RMF — ${isEdit ? 'Edit Assessment' : 'New Assessment'}</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name || '')} · 68 sub-categories across 4 functions</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="nistAiNavToDashboard()">← Back</button>
      <button class="btn btn-cyan btn-sm" onclick="nistAiSave()" id="nistAiSaveBtn">Save Assessment</button>
    </div>
  </div>

  <div class="card" style="padding:1rem;margin-bottom:1rem">
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end">
      <div style="flex:1;min-width:180px">
        <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px">ASSESSMENT DATE</label>
        <input type="date" id="nistAiDate" value="${nistAiState.date || new Date().toISOString().slice(0,10)}"
          style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px;font-size:13px">
      </div>
      <div style="flex:1;min-width:180px">
        <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px">CONDUCTED BY</label>
        <input type="text" id="nistAiConductedBy" placeholder="Name or role…" value="${escH(nistAiState.conductedBy || '')}"
          style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px;font-size:13px">
      </div>
      <div style="min-width:160px">
        <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px">SCORE SO FAR</label>
        <div style="font-size:24px;font-weight:800;color:var(--navy)">${answered > 0 ? score + '%' : '—'}</div>
        <div style="font-size:10px;color:var(--muted)">${answered}/${total} answered</div>
      </div>
    </div>
    ${profMeta ? `<div style="margin-top:10px;padding:8px 12px;border-radius:6px;background:${profMeta.bg === '#f1f5f9' ? '#f8fafc' : profMeta.bg};border:1px solid ${profMeta.txt}22;font-size:11px;color:${profMeta.txt}"><strong>${profMeta.label} profile:</strong> ${profMeta.desc}</div>` : ''}
  </div>`;

  fns.forEach(fn => {
    const m = NIST_FN_META[fn];
    const sc = fnScore(fn);
    const panelOpen = nistAiState.openPanels[fn] !== false;
    html += `
    <div class="card" style="margin-bottom:.75rem;overflow:hidden">
      <div onclick="nistAiTogglePanel('${fn}')" style="cursor:pointer;padding:.9rem 1.1rem;display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,${m.color},${m.color}dd)">
        <span style="font-size:16px">${m.icon}</span>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700;color:#fff">${m.label}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.6)">${m.count} sub-categories</div>
        </div>
        <div style="text-align:right">
          ${sc.pct !== null
            ? `<div style="font-size:18px;font-weight:800;color:#fff">${sc.pct}%</div><div style="font-size:10px;color:rgba(255,255,255,.5)">${sc.answered}/${sc.total} answered</div>`
            : `<div style="font-size:11px;color:rgba(255,255,255,.4)">Not started</div>`}
        </div>
        <span style="font-size:14px;color:rgba(255,255,255,.6);margin-left:8px">${panelOpen ? '▲' : '▼'}</span>
      </div>
      ${panelOpen ? `<div style="padding:.75rem 1rem">` : `<div style="display:none">`}`;

    const grpKeys = Object.keys(fnGroups[fn]).sort((a, b) => +a - +b);
    grpKeys.forEach(grpKey => {
      const grp = fnGroups[fn][grpKey];
      html += `<div style="margin-bottom:.75rem">
        <div style="font-size:11px;font-weight:700;color:${m.color};text-transform:uppercase;letter-spacing:.06em;margin-bottom:.5rem;padding-bottom:4px;border-bottom:2px solid ${m.color}22">${escH(grp.grpName)}</div>`;

      grp.controls.forEach(ctrl => {
        const val = nistAiState.answers[ctrl.id] || '';
        const note = (nistAiState.notes[ctrl.id] || '');
        const commentOpen = nistAiState.openComments[ctrl.id];
        const ansColors = { yes: '#15803d', partial: '#b45309', no: '#dc2626', na: '#5a6a8a' };
        const ansLabels = { yes: 'Yes', partial: 'Partial', no: 'No', na: 'N/A' };
        html += `
        <div style="margin-bottom:.75rem;padding:.65rem .75rem;border-radius:6px;border:1px solid ${val ? (val === 'yes' ? '#dcfce7' : val === 'partial' ? '#fef3c7' : val === 'no' ? '#fee2e2' : '#f1f5f9') : 'var(--border)'};background:${val === 'yes' ? '#f0fdf4' : val === 'partial' ? '#fffbeb' : val === 'no' ? '#fef2f2' : val === 'na' ? '#f8fafc' : '#fff'}">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap">
            <div style="flex:1;min-width:200px">
              <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:3px">
                <span style="font-size:10px;font-weight:700;color:${m.color};white-space:nowrap">${escH(ctrl.id)}</span>
                <span style="font-size:12px;font-weight:700;color:var(--text)">${escH(ctrl.title)}</span>
              </div>
              <div style="font-size:11px;color:var(--muted);line-height:1.45">${escH(ctrl.desc)}</div>
              ${note ? `<div style="margin-top:4px;font-size:11px;color:var(--muted);font-style:italic">📝 ${escH(note)}</div>` : ''}
            </div>
            <div style="display:flex;gap:4px;flex-shrink:0;align-items:center">
              ${['yes','partial','no','na'].map(a => `<button onclick="nistAiAnswer('${ctrl.id}','${a}')"
                style="padding:4px 9px;font-size:11px;font-weight:700;border-radius:6px;cursor:pointer;border:2px solid ${val === a ? ansColors[a] : '#dde3ef'};background:${val === a ? ansColors[a] : 'transparent'};color:${val === a ? '#fff' : '#5a6a8a'};transition:all .12s">${ansLabels[a]}</button>`).join('')}
              <button onclick="nistAiToggleComment('${ctrl.id}')" title="Add note"
                style="padding:4px 8px;font-size:11px;border-radius:6px;cursor:pointer;border:1px solid var(--border);background:${commentOpen || note ? '#f0f4ff' : 'transparent'};color:${commentOpen || note ? 'var(--navy)' : 'var(--muted)'}">💬</button>
            </div>
          </div>
          ${commentOpen ? `<div style="margin-top:8px">
            <textarea id="note_${ctrl.id.replace(/-/g,'_')}" placeholder="Add assessor note…"
              style="width:100%;min-height:56px;padding:6px 9px;border:1px solid var(--border);border-radius:6px;font-size:12px;resize:vertical"
              onblur="nistAiSaveNote('${ctrl.id}',this.value)">${escH(note)}</textarea>
          </div>` : ''}
        </div>`;
      });

      html += `</div>`;
    });

    html += `</div></div>`;
  });

  html += `
  <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:1rem">
    <button class="btn btn-outline btn-sm" onclick="nistAiNavToDashboard()">← Cancel</button>
    <button class="btn btn-cyan" onclick="nistAiSave()" id="nistAiSaveBtn2">Save Assessment</button>
  </div>`;

  return html;
}

// ── GAP REPORT ────────────────────────────────────────────────────────────────

function renderNistAiGapReport() {
  const run = nistAiState.reportRun;
  if (!run) return `<div class="card" style="padding:2rem;text-align:center"><button class="btn btn-outline btn-sm" onclick="nistAiNavToDashboard()">← Back</button></div>`;

  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const gaps = NIST_AI_CONTROLS.filter(c => answers[c.id] === 'no' || answers[c.id] === 'partial');
  const { score } = nistAiCalcScore(answers);

  const fnCount = {};
  const fnCrit = {};
  gaps.forEach(c => {
    fnCount[c.fn] = (fnCount[c.fn] || 0) + 1;
  });
  const noCount = gaps.filter(c => answers[c.id] === 'no').length;
  const partCount = gaps.filter(c => answers[c.id] === 'partial').length;

  const fnBadgeBg = { govern: '#dbeafe', map: '#cffafe', measure: '#fef3c7', manage: '#dcfce7' };
  const fnBadgeTxt = { govern: '#1d4ed8', map: '#0e7490', measure: '#92400e', manage: '#166534' };

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">🔍 NIST AI RMF Gap Report</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name || '')} · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''} · Score: ${score}%</div>
    </div>
    <div style="display:flex;gap:6px">
      <button class="btn btn-outline btn-sm" onclick="nistAiNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="nistAiCopyGapPrompt()">📋 Copy AI Prompt</button>
    </div>
  </div>

  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem">
    ${[
      { label: 'Total Gaps', val: gaps.length, col: 'var(--navy)' },
      { label: 'No', val: noCount, col: '#dc2626' },
      { label: 'Partial', val: partCount, col: '#b45309' },
      ...Object.entries(fnCount).map(([fn, n]) => ({ label: NIST_FN_META[fn]?.label || fn, val: n, col: fnBadgeTxt[fn] || 'var(--navy)' }))
    ].map(s => `<div style="padding:8px 14px;border-radius:8px;background:var(--card);border:1px solid var(--border);text-align:center;min-width:70px">
      <div style="font-size:20px;font-weight:800;color:${s.col}">${s.val}</div>
      <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-top:1px">${s.label}</div>
    </div>`).join('')}
  </div>`;

  if (gaps.length === 0) {
    html += `<div class="card" style="text-align:center;padding:3rem 1rem">
      <div style="font-size:32px;margin-bottom:.75rem">🎉</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:4px">No gaps found</div>
      <div style="font-size:12px;color:var(--muted)">All assessed sub-categories are marked Yes or N/A.</div>
    </div>`;
  } else {
    const fns = ['govern', 'map', 'measure', 'manage'];
    fns.forEach(fn => {
      const fnGaps = gaps.filter(c => c.fn === fn);
      if (!fnGaps.length) return;
      const m = NIST_FN_META[fn];
      html += `<div class="card" style="margin-bottom:.75rem;overflow:hidden">
        <div style="background:linear-gradient(135deg,${m.color},${m.color}dd);padding:.75rem 1rem;display:flex;align-items:center;gap:8px">
          <span style="font-size:14px">${m.icon}</span>
          <span style="font-size:13px;font-weight:700;color:#fff">${m.label}</span>
          <span style="font-size:11px;color:rgba(255,255,255,.6)">${fnGaps.length} gap${fnGaps.length !== 1 ? 's' : ''}</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="background:var(--bg)">
              <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">ID</th>
              <th style="padding:7px 8px;text-align:center;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Gap</th>
              <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Sub-Category</th>
              <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Note</th>
            </tr>
          </thead>
          <tbody>
            ${fnGaps.map(c => {
              const ans = answers[c.id];
              const note = nistAiState.gapNotes?.[c.id] || '';
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
                <td style="padding:8px 10px;font-size:11px;color:var(--muted);vertical-align:top;font-style:italic">${escH(note)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
    });
  }

  html += `<div style="margin-top:.75rem;display:flex;gap:8px">
    <button class="btn btn-outline btn-sm" onclick="nistAiNavToDashboard()">← Back</button>
    <button class="btn btn-outline btn-sm" onclick="nistAiCopyGapPrompt()">📋 Copy AI Prompt</button>
  </div>`;
  return html;
}

// ── EXECUTIVE REPORT ──────────────────────────────────────────────────────────

function renderNistAiExecReport() {
  const run = nistAiState.reportRun;
  if (!run) return `<div class="card" style="padding:2rem;text-align:center"><button class="btn btn-outline btn-sm" onclick="nistAiNavToDashboard()">← Back</button></div>`;

  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { score, yes, partial, no, answered, total } = nistAiCalcScore(answers);
  const fnScores = nistAiCalcFnScores(answers);
  const band = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const bandCol = score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : score >= 40 ? '#ea580c' : '#dc2626';
  const prof = (run.answers || {})._profile || '';
  const pm = NIST_PROFILES[prof];
  const commentary = nistAiState.reportCommentary || (run.answers || {})._exec_commentary || '';

  const runs = (orgAssessments[currentOrg?.id] || {})['nist_ai'] || [];
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const prevRun = sorted.length >= 2 ? sorted[sorted.length - 2] : null;
  const prevScore = prevRun ? nistAiCalcScore(Object.fromEntries(Object.entries(prevRun.answers || {}).filter(([k]) => !k.startsWith('_')))).score : null;
  const scoreChange = prevScore !== null ? score - prevScore : null;

  const fnBarsHtml = fnScores.map(f => {
    const m = NIST_FN_META[f.fn];
    const col = f.pct >= 75 ? '#15803d' : f.pct >= 50 ? '#b45309' : '#dc2626';
    return `<div style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px">
        <span style="font-size:12px;font-weight:700;color:var(--text)">${m.icon} ${m.label}</span>
        <span style="font-size:12px;font-weight:700;color:${col}">${f.pct}%</span>
      </div>
      <div style="height:8px;background:var(--bg);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${f.pct}%;background:${m.color};border-radius:4px;transition:width .4s"></div>
      </div>
      <div style="font-size:10px;color:var(--muted);margin-top:2px">${f.answered}/${f.total} answered</div>
    </div>`;
  }).join('');

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📊 NIST AI RMF Executive Report</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name || '')} · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="nistAiNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="nistAiCopyReportPrompt()">📋 Copy AI Prompt</button>
      <button class="btn btn-cyan btn-sm" onclick="nistAiSaveCommentary()">Save Commentary</button>
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
      ${pm ? `<div style="margin-top:8px;padding:6px 10px;border-radius:6px;background:${pm.bg === '#f1f5f9' ? '#f8fafc' : pm.bg};font-size:11px;color:${pm.txt}"><strong>Profile:</strong> ${pm.label}</div>` : ''}
    </div>
    <div class="card" style="padding:1.25rem">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">Function Breakdown</div>
      ${fnBarsHtml}
    </div>
  </div>

  <div class="card" style="padding:1.25rem;margin-bottom:1rem">
    <div style="font-size:13px;font-weight:700;margin-bottom:.75rem;color:var(--text)">Top Gaps (No / Partial)</div>
    ${(() => {
      const gaps = NIST_AI_CONTROLS.filter(c => {
        const v = answers[c.id];
        return v === 'no' || v === 'partial';
      }).slice(0, 12);
      if (!gaps.length) return `<div style="font-size:13px;color:var(--muted)">No gaps — all answered Sub-Categories are Yes or N/A.</div>`;
      return `<table style="width:100%;border-collapse:collapse;font-size:12px">
        ${gaps.map(c => {
          const v = answers[c.id];
          const m = NIST_FN_META[c.fn];
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
    <div style="font-size:13px;font-weight:700;margin-bottom:.5rem;color:var(--text)">Executive Commentary</div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:.75rem">Write or paste an AI-generated executive summary below. Use "Copy AI Prompt" to generate one via Claude.</div>
    <textarea id="nistAiReportCommentary" placeholder="Executive summary and narrative commentary…"
      style="width:100%;min-height:140px;padding:10px;border:1px solid var(--border);border-radius:6px;font-size:13px;line-height:1.6;resize:vertical">${escH(commentary)}</textarea>
    <div style="margin-top:.5rem;display:flex;gap:6px;justify-content:flex-end">
      <button class="btn btn-outline btn-sm" onclick="nistAiCopyReportPrompt()">📋 Copy AI Prompt</button>
      <button class="btn btn-cyan btn-sm" onclick="nistAiSaveCommentary()">Save Commentary</button>
    </div>
  </div>`;
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────

function nistAiStartNew() {
  nistAiState.answers = {};
  nistAiState.notes = {};
  nistAiState.openComments = {};
  nistAiState.openPanels = {};
  nistAiState.editId = null;
  nistAiState.date = new Date().toISOString().slice(0, 10);
  nistAiState.conductedBy = '';
  nistAiState.view = 'form';
  renderMain();
}

function nistAiOpenAssessment(idx) {
  const orgId = currentOrg?.id;
  const runs = (orgAssessments[orgId] || {})['nist_ai'] || [];
  const run = runs[idx];
  if (!run) return;
  const cleanAns = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  nistAiState.answers = cleanAns;
  nistAiState.notes = {};
  nistAiState.openComments = {};
  nistAiState.openPanels = {};
  nistAiState.editId = run.id || null;
  nistAiState.date = run.date || '';
  nistAiState.conductedBy = run.conductedBy || '';
  nistAiState.view = 'form';
  renderMain();
}

async function nistAiSave() {
  const orgId = currentOrg?.id;
  if (!orgId) return;
  const date = document.getElementById('nistAiDate')?.value || nistAiState.date || new Date().toISOString().slice(0, 10);
  const conductedBy = document.getElementById('nistAiConductedBy')?.value?.trim() || nistAiState.conductedBy || '';
  const profile = nistAiGetProfile() || '';
  const answers = { ...nistAiState.answers, _profile: profile };

  const { score, answered } = nistAiCalcScore(nistAiState.answers);
  if (answered === 0) { toast('Answer at least one sub-category before saving', '#b45309'); return; }

  const btn = document.getElementById('nistAiSaveBtn') || document.getElementById('nistAiSaveBtn2');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  try {
    let savedId = nistAiState.editId;
    if (savedId) {
      await sb.updateAssessment(savedId, { score, answers, assessed_at: date, conducted_by: conductedBy });
    } else {
      const row = { org_id: orgId, module: 'nist_ai', score, answers, assessed_at: date, conducted_by: conductedBy };
      const res = await sb.saveAssessment(row);
      savedId = Array.isArray(res) ? res[0]?.id : res?.id;
    }

    // Save notes to framework_notes
    const noteRows = Object.entries(nistAiState.notes)
      .filter(([, v]) => v.trim())
      .map(([item_id, note]) => ({ org_id: orgId, module: 'nist_ai', item_id, note }));
    if (noteRows.length) await sb.frameworkNotes.upsert(noteRows);

    delete orgAssessments[orgId];
    await loadAssessments(orgId);
    nistAiState.editId = savedId;
    nistAiState.view = 'dashboard';
    toast('✓ NIST AI RMF assessment saved', '#15803d');
    buildNav(); renderMain();
    setTimeout(nistAiTrendDraw, 80);
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Save Assessment'; }
  }
}

async function nistAiDeleteConfirm(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['nist_ai'] || [];
  const run = runs[idx];
  if (!run?.id) return;
  if (!confirm(`Delete NIST AI RMF assessment from ${run.date || 'unknown date'}? This cannot be undone.`)) return;
  try {
    await sb.deleteAssessment(run.id);
    delete orgAssessments[currentOrg.id];
    await loadAssessments(currentOrg.id);
    toast('Assessment deleted', '#b45309');
    buildNav(); renderMain();
    setTimeout(nistAiTrendDraw, 80);
  } catch(e) { toast('Delete failed: ' + e.message, '#dc2626'); }
}

function nistAiNavToDashboard() {
  nistAiState.view = 'dashboard';
  nistAiState.reportRun = null;
  renderMain();
  setTimeout(nistAiTrendDraw, 80);
}

function nistAiAnswer(id, val) {
  nistAiState.answers[id] = val;
  const form = document.querySelector(`[data-ctrl-id="${id}"]`);
  if (form) {
    // Fast re-render of just the score header without full re-render
    const scoreEl = document.getElementById('nistAiFormScore');
    if (scoreEl) {
      const { score, answered, total } = nistAiCalcScore(nistAiState.answers);
      scoreEl.innerHTML = `<div style="font-size:24px;font-weight:800;color:var(--navy)">${answered > 0 ? score + '%' : '—'}</div><div style="font-size:10px;color:var(--muted)">${answered}/${total} answered</div>`;
    }
  }
  // Full re-render to update button states
  nistAiState.view = 'form';
  renderMain();
}

function nistAiTogglePanel(fn) {
  nistAiState.openPanels[fn] = nistAiState.openPanels[fn] === false ? true : false;
  renderMain();
}

function nistAiToggleComment(id) {
  nistAiState.openComments[id] = !nistAiState.openComments[id];
  renderMain();
}

function nistAiSaveNote(id, value) {
  nistAiState.notes[id] = value.trim();
}

async function nistAiSetProfile(profile) {
  const orgId = currentOrg?.id;
  if (!orgId) return;
  try {
    await sb.profiles.upsert({ org_id: orgId, ai_rmf_profile: profile });
    orgProfiles[orgId] = { ...(orgProfiles[orgId] || {}), ai_rmf_profile: profile };
    renderMain();
    setTimeout(nistAiTrendDraw, 80);
  } catch(e) { toast('Profile save failed: ' + e.message, '#dc2626'); }
}

function nistAiOpenGapReport(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['nist_ai'] || [];
  const run = runs[idx];
  if (!run) return;
  nistAiState.reportRun = run;
  nistAiState.gapNotes = {};
  const orgId = currentOrg?.id;
  nistAiState.view = 'gap';
  renderMain();
  // Load notes for display
  if (orgId) {
    sb.frameworkNotes.get(orgId, 'nist_ai').then(rows => {
      (rows || []).forEach(r => { nistAiState.gapNotes[r.item_id] = r.note || ''; });
      if (nistAiState.view === 'gap') renderMain();
    }).catch(() => {});
  }
}

function nistAiOpenReport(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['nist_ai'] || [];
  const run = runs[idx];
  if (!run) return;
  nistAiState.reportRun = run;
  nistAiState.reportCommentary = (run.answers || {})._exec_commentary || '';
  nistAiState.view = 'report';
  renderMain();
}

async function nistAiSaveCommentary() {
  const run = nistAiState.reportRun;
  if (!run?.id) { toast('Cannot save — assessment ID missing', '#dc2626'); return; }
  const commentary = (document.getElementById('nistAiReportCommentary')?.value || '').trim();
  try {
    const updatedAnswers = { ...(run.answers || {}), _exec_commentary: commentary };
    await sb.updateAssessment(run.id, { answers: updatedAnswers });
    nistAiState.reportRun = { ...run, answers: updatedAnswers };
    nistAiState.reportCommentary = commentary;
    const runs = (orgAssessments[currentOrg?.id] || {})['nist_ai'] || [];
    const idx = runs.findIndex(r => r.id === run.id);
    if (idx !== -1) runs[idx] = { ...runs[idx], answers: updatedAnswers };
    toast('✓ Commentary saved', '#15803d');
  } catch(e) { toast('Save failed: ' + e.message, '#dc2626'); }
}

function nistAiCopyReportPrompt() {
  const run = nistAiState.reportRun;
  if (!run) return;
  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { score, yes, partial, no } = nistAiCalcScore(answers);
  const fnScores = nistAiCalcFnScores(answers);
  const band = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const prof = (run.answers || {})._profile || 'Not set';
  const runs = (orgAssessments[currentOrg?.id] || {})['nist_ai'] || [];
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const trend = sorted.map(r => `${r.date}: ${r.score}%`).join(' → ');
  const noGaps = NIST_AI_CONTROLS.filter(c => answers[c.id] === 'no').slice(0, 8)
    .map(c => `- ${c.id} [${NIST_FN_META[c.fn]?.label}]: ${c.title}`).join('\n');
  const partGaps = NIST_AI_CONTROLS.filter(c => answers[c.id] === 'partial').slice(0, 5)
    .map(c => `- ${c.id} [${NIST_FN_META[c.fn]?.label}]: ${c.title}`).join('\n');
  const fnBreakdown = fnScores.map(f => `  ${NIST_FN_META[f.fn]?.label}: ${f.pct}% (${f.answered}/${f.total} answered)`).join('\n');

  const prompt = `Please write a professional executive AI risk management report. This will be presented to a CEO or board — avoid jargon, focus on business risk and practical AI governance outcomes.

ORGANISATION: ${currentOrg?.name}
ASSESSMENT DATE: ${run.date || 'Unknown'}
ASSESSOR: ${run.conductedBy || 'Not specified'}
FRAMEWORK: NIST AI Risk Management Framework (AI RMF v1.0)
OVERALL SCORE: ${score}% — Risk Band: ${band}
AI RISK PROFILE: ${prof}
RESPONSES: ${yes} Yes, ${partial} Partial, ${no} No
SCORE TREND: ${trend || 'First assessment — no trend available'}

FUNCTION BREAKDOWN:
${fnBreakdown}

TOP CONTROL FAILURES (No answers — highest priority):
${noGaps || '— None —'}

PARTIALLY ADDRESSED CONTROLS:
${partGaps || '— None —'}

Please write:
1. EXECUTIVE SUMMARY (2–3 paragraphs): Overall AI risk posture, what the score means in business terms, and the key message for leadership about AI governance maturity.
2. KEY FINDINGS (3–4 bullets): The most significant AI governance gaps, written as business exposure — what is the real-world risk if these gaps remain?
3. PRIORITY RECOMMENDATIONS (3 actions): Each with a one-sentence business rationale.

Keep the total to one printed page. Write in flowing professional prose — no section headers in the output.`;

  navigator.clipboard.writeText(prompt)
    .then(() => toast('✓ AI prompt copied — paste into Claude to generate commentary', '#152168'))
    .catch(() => toast('Clipboard blocked — please copy the prompt manually', '#b45309'));
}

function nistAiCopyGapPrompt() {
  const run = nistAiState.reportRun;
  if (!run) return;
  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const gaps = NIST_AI_CONTROLS.filter(c => answers[c.id] === 'no' || answers[c.id] === 'partial');
  const { score } = nistAiCalcScore(answers);

  const gapList = gaps.map(c => `- [${answers[c.id].toUpperCase()}] ${c.id} (${NIST_FN_META[c.fn]?.label}): ${c.title}`).join('\n');

  const prompt = `I need a prioritised AI risk remediation roadmap for an organisation assessed against the NIST AI RMF v1.0.

ORGANISATION: ${currentOrg?.name}
ASSESSMENT DATE: ${run.date || 'Unknown'}
OVERALL SCORE: ${score}%

IDENTIFIED GAPS (${gaps.length} total):
${gapList || '— No gaps —'}

Please produce:
1. A prioritised remediation roadmap grouping gaps by function (GOVERN/MAP/MEASURE/MANAGE), ranked by business impact.
2. For each gap, a 1–2 sentence plain-language explanation of the business risk if left unaddressed.
3. Quick wins (actions achievable within 30 days) vs. strategic initiatives (3–12 months).

Write for a non-technical audience. Focus on practical, actionable steps.`;

  navigator.clipboard.writeText(prompt)
    .then(() => toast('✓ Gap prompt copied — paste into Claude', '#152168'))
    .catch(() => toast('Clipboard blocked', '#b45309'));
}
