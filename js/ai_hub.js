// ============================================================
// AI Pyramid — shared constants (Hub + Rapid Pre-Assessment)
// ============================================================
const AI_PYR_CATALOGUE = {
  'AI Policy & Accountability':              { rmf:'GOVERN 1.1', iso:'ISO 42001 §5.2 / §6.1', tier:'Governing', commentary:`The foundation of responsible AI begins with formal policy. Without documented policies that assign clear accountability for AI systems — who owns them, who is responsible when they fail, and what values they must uphold — risk cannot be systematically managed. NIST AI RMF GOVERN 1.1 requires organisations to establish and maintain policies covering AI risk management roles, responsibilities, and authorities. This means naming an AI owner for each deployed system, defining acceptable use, and establishing a process for escalating AI-related concerns. For businesses deploying AI in customer-facing or operational roles, a policy gap is a liability gap.`, remediation:`Draft an AI governance policy naming a responsible AI owner per deployed system and defining acceptable use, escalation paths, and accountability structures. Align to NIST AI RMF GOVERN 1.1 and schedule annual review. Compensating control: document AI use-case decisions in signed meeting minutes with a named owner until the formal policy is adopted.` },
  'AI Roles & Training':                     { rmf:'GOVERN 2.2', iso:'ISO 42001 §7.2 / §7.3', tier:'Governing', commentary:`AI systems are only as trustworthy as the people overseeing them. NIST AI RMF GOVERN 2.2 requires that staff with AI responsibilities receive appropriate training to understand AI risks, limitations, and their own role in governance. Without role-appropriate AI literacy, policies become paper exercises and risks go unrecognised. Building foundational AI awareness across the organisation is the single most scalable investment in responsible AI you can make.`, remediation:`Define AI roles (AI Owner, AI Risk Lead) in job descriptions and deliver role-appropriate AI literacy training on a quarterly cadence. Use NIST AI RMF role competency profiles as a guide. Compensating control: designate an AI point of contact from existing IT or legal staff and assign them to a published industry training programme while formal roles are being created.` },
  'Trustworthy AI Principles':               { rmf:'GOVERN 1.7', iso:'ISO 42001 §4.1 / Annex A.2.2', tier:'Governing', commentary:`NIST AI RMF is built on a framework of AI trustworthiness characteristics: valid, reliable, safe, secure, explainable, fair, privacy-preserving, and accountable. GOVERN 1.7 requires organisations to formally adopt and communicate their AI values and principles as operational commitments that shape how AI is evaluated, deployed, and retired.`, remediation:`Develop a published AI principles statement covering the NIST trustworthiness characteristics. Adopt and communicate it to all staff and include it in AI supplier contracts. Compensating control: extend existing organisational ethics or values policies to explicitly cover AI decisions as an interim measure — document the extension in writing.` },
  'AI Supplier Transparency Requirements':   { rmf:'GOVERN 6.1', iso:'ISO 42001 §8.4 / Annex A.10.2', tier:'Governing', commentary:`Organisations deploying AI are increasingly responsible for ensuring the systems they procure meet minimum transparency and documentation standards. NIST AI RMF GOVERN 6.1 requires that AI risk management expectations be flowed down to AI providers — through contractual requirements, due diligence questionnaires, and ongoing attestation.`, remediation:`Add AI disclosure clauses to vendor contracts covering training data provenance, model drift SLAs, and incident notification timelines. Build a standard AI supplier questionnaire for new vendor onboarding. Compensating control: require SOC 2 Type II or ISO 27001 certification from AI vendors as a proxy for governance maturity while a formal questionnaire is developed.` },
  'AI Acceptable Use Policy':                { rmf:'GOVERN 1.1', iso:'ISO 42001 §5.2 / §6.1.2', tier:'Governing', commentary:`An AI Acceptable Use Policy defines the boundaries within which staff, contractors, and systems may deploy or interact with AI tools — covering permitted use cases, prohibited applications, data handling expectations, and accountability for outputs. Without an acceptable use policy, AI adoption outpaces governance.`, remediation:`Draft an AUP covering approved AI tools, prohibited use cases (e.g. generating regulated decisions without review), data handling expectations, and accountability for AI-assisted outputs. Distribute to all staff and collect signed acknowledgements. Compensating control: apply existing internet/email AUP principles to AI tools as an interim measure and document the extension.` },
  'Data Classification Policy':              { rmf:'GOVERN 1.6 / MAP 3.2', iso:'ISO 42001 §8.4 / Annex A.8.3', tier:'Governing', commentary:`A data classification policy establishes categories of data sensitivity — defining what constitutes personal, confidential, regulated, or public information — and sets handling rules for each category. For organisations where AI may process guest PII, payment data, and behavioural analytics simultaneously, data classification is the policy layer that determines what AI systems are permitted to access.`, remediation:`Implement a data classification scheme with at minimum three tiers (public, internal, confidential/PII). Define what AI systems are permitted to access at each tier and enforce via access controls. Compensating control: apply least-privilege access controls to all AI system data feeds pending the formal classification policy.` },
  'Information Security Policy (AI scope)':  { rmf:'GOVERN 1.1', iso:'ISO 42001 §5.1 / Annex A.6.2', tier:'Governing', commentary:`Existing information security policies must be explicitly scoped to address AI systems. AI introduces unique security considerations: model extraction attacks, adversarial inputs, training data poisoning, and the risk of sensitive data being embedded in model weights. NIST AI RMF GOVERN 1.1 requires that AI risk management be integrated with existing organisational security frameworks.`, remediation:`Extend your existing information security policy with an AI-specific addendum covering model access controls, training data handling, adversarial input protection, and model weight security. Review the addendum annually. Compensating control: apply existing data handling and access control policies to AI inputs and outputs while the addendum is being drafted.` },
  'AI Ethics & Principles Statement':        { rmf:'GOVERN 1.7', iso:'ISO 42001 §4.1 / Annex A.2.2', tier:'Governing', commentary:`An AI Ethics and Principles Statement articulates the values that govern how your organisation develops, deploys, and retires AI — covering fairness, transparency, accountability, privacy, and human oversight. A published principles statement serves as the reference point for all governance decisions and signals your commitment to responsible AI to customers, regulators, and partners.`, remediation:`Formalise your AI ethics position as a published document aligned to NIST AI RMF trustworthiness characteristics and ISO 42001 Annex A.2.2. Obtain executive sign-off and publish internally and externally. Compensating control: require written approval from legal and the executive sponsor on all new AI deployments until the ethics statement is published.` },
  'AI Inventory & Use-Case Register':        { rmf:'MAP 1.1', iso:'ISO 42001 §8.2 / Annex A.5.1', tier:'Mapping', commentary:`You cannot govern what you have not mapped. NIST AI RMF MAP 1.1 requires organisations to identify and document all AI systems in use — including third-party AI embedded in SaaS tools — along with their intended purpose, data inputs, and decision scope. An AI inventory is not bureaucracy; it is the prerequisite for every other governance activity.`, remediation:`Build a register of all AI systems in use including SaaS tools with embedded AI features. Document system name, vendor, purpose, data inputs, decision scope, risk tier, and named owner for each entry. Review quarterly. Compensating control: route all AI procurement requests through a named approver to capture new AI systems progressively as you build the inventory.` },
  'Contextual Risk & Impact Assessment':     { rmf:'MAP 2.1 / MAP 3.5', iso:'ISO 42001 §6.1 / Annex A.5.4', tier:'Mapping', commentary:`Not all AI risk is equal, and not all AI contexts carry the same stakes. NIST AI RMF MAP 2.1 and MAP 3.5 require organisations to assess the context in which each AI system operates — including the potential for harm to individuals, groups, or operations if the system behaves unexpectedly. Impact assessments ground risk management in real-world consequences rather than abstract checklists.`, remediation:`Conduct a risk and impact assessment for each AI system in your inventory using a consistent template covering likelihood, affected parties, potential harms, and current mitigations. Review on any significant change to model, data, or deployment context. Compensating control: use a simple high/medium/low risk triage for all new AI deployments while a full assessment template is being developed.` },
  'Third-Party AI Risk':                     { rmf:'MAP 5.1', iso:'ISO 42001 §8.4 / Annex A.10.1', tier:'Mapping', commentary:`Most organisations use far more third-party AI than they build themselves — through SaaS platforms, embedded analytics, and vendor-supplied tools. NIST AI RMF MAP 5.1 requires organisations to assess AI risk in their supply chain. Third-party AI risk assessments should be part of every vendor onboarding and renewal process.`, remediation:`Integrate AI risk questions into your vendor onboarding and renewal workflow. Assess each third-party AI system against data handling transparency, incident notification, bias testing, and contractual accountability criteria. Use the TPRA module to capture findings formally. Compensating control: request SOC 2 Type II or ISO 27001 certificates from AI vendors as an interim risk signal while formal questionnaires are developed.` },
  'Data Governance for AI':                  { rmf:'MAP 3.2', iso:'ISO 42001 §8.4 / Annex A.8.3', tier:'Mapping', commentary:`AI systems are only as trustworthy as the data they are built on and operate with. NIST AI RMF MAP 3.2 requires organisations to understand the provenance, quality, and representativeness of data used in AI systems. Poor data governance leads to biased models, inaccurate outputs, and privacy violations.`, remediation:`Establish data lineage tracking for all AI training and inference datasets. Define data quality standards and review cadence. Implement data retention and deletion policies that explicitly cover AI model inputs and outputs. Compensating control: apply existing data governance and classification controls to AI-specific data assets and document the extension.` },
  'AI Risk Register':                        { rmf:'MAP 5.2', iso:'ISO 42001 §6.1', tier:'Mapping', commentary:`Risk cannot be managed from memory. NIST AI RMF MAP 5.2 requires organisations to document identified AI risks in a structured register — capturing the risk description, likelihood, potential impact, current controls, and ownership. An AI risk register is the operational backbone of an AI governance programme.`, remediation:`Create a dedicated AI risk register with fields for risk description, likelihood, impact, current controls, owner, and review date. Link AI risks to your main organisational risk register and report on top AI risks quarterly to senior leadership. Compensating control: add an AI risk section to your existing risk register as an interim measure while a standalone AI register is being designed.` },
  'Bias & Fairness Testing':                 { rmf:'MEASURE 2.5', iso:'ISO 42001 §9.1 / Annex A.6.1', tier:'Measuring', commentary:`AI systems can encode and amplify biases present in training data, producing outcomes that are unfair, discriminatory, or simply inaccurate for certain groups. NIST AI RMF MEASURE 2.5 requires organisations to test AI systems for bias and fairness relevant to their deployment context. Bias testing is not a one-time exercise — models drift, data changes, and context evolves.`, remediation:`Define bias-relevant demographic and contextual groups for each deployed AI system based on its decision scope. Conduct baseline fairness testing before deployment and on a scheduled post-deployment cadence. Document test methodology and results. Compensating control: implement mandatory human review checkpoints for all high-stakes AI-assisted decisions pending automated bias testing infrastructure.` },
  'Explainability & Transparency':           { rmf:'MEASURE 2.6', iso:'ISO 42001 §8.5 / Annex A.6.2', tier:'Measuring', commentary:`When an AI system makes or informs a consequential decision, the people affected and those accountable for outcomes need to understand why. NIST AI RMF MEASURE 2.6 addresses explainability — the ability to describe, in meaningful terms, how an AI system reached an output. Explainability also supports compliance with privacy regulations that require meaningful information about automated decision-making.`, remediation:`Identify which AI decisions require explainability (regulatory, contractual, or ethical grounds). Select interpretability methods appropriate for each model type — SHAP values, LIME, rule extraction, or plain-language decision documentation. Compensating control: document AI decision logic in plain language for all high-stakes use cases as an interim explainability measure until tooling is implemented.` },
  'Performance Monitoring & KPIs':           { rmf:'MEASURE 1.1 / MEASURE 2.1', iso:'ISO 42001 §9.1 / §10.1', tier:'Measuring', commentary:`AI systems degrade. Models trained on yesterday's data may perform poorly on today's reality — a phenomenon known as model drift. NIST AI RMF MEASURE 1.1 and MEASURE 2.1 require organisations to establish measurable performance indicators for AI systems and monitor them on an ongoing basis. Proactive monitoring is the difference between catching drift early and discovering it through a failure.`, remediation:`Define KPIs for each AI system covering accuracy, latency, drift indicators, and business outcome alignment. Implement automated monitoring with alert thresholds and assign a named owner to review results quarterly and after any significant data distribution change. Compensating control: establish manual monthly performance spot-checks until automated monitoring is in place.` },
  'Red-Teaming & Adversarial Testing':       { rmf:'MEASURE 2.7 / MEASURE 2.9', iso:'ISO 42001 §9.1 / Annex A.9.2', tier:'Measuring', commentary:`AI systems can be deliberately manipulated through adversarial inputs — crafted data designed to cause misclassification, extract sensitive information, or trigger harmful outputs. NIST AI RMF MEASURE 2.7 and MEASURE 2.9 address the need for adversarial testing — structured attempts to find and exploit weaknesses in AI systems before they are discovered by malicious actors.`, remediation:`Schedule annual adversarial testing exercises for AI systems handling sensitive data or decisions. Use OWASP ML Security Top 10 and MITRE ATLAS as threat model frameworks. Document findings and remediate before the next production release. Compensating control: apply standard penetration testing scope to AI API endpoints and data pipelines as a bridging measure while AI-specific red-team capability is built.` },
  'AI Incident Response':                    { rmf:'MANAGE 3.1', iso:'ISO 42001 §10.1 / Annex A.9.3', tier:'Managing', commentary:`AI systems will fail, behave unexpectedly, or produce harmful outputs — the question is whether your organisation is prepared to respond. NIST AI RMF MANAGE 3.1 requires organisations to have documented processes for detecting, escalating, and responding to AI incidents, including the ability to disable or override AI systems when necessary.`, remediation:`Add an AI-specific annex to your incident response plan covering AI failure modes: unexpected outputs, model poisoning, adversarial misuse, and regulatory breach triggers. Define clear escalation paths and documented AI shutdown/override procedures. Compensating control: apply existing IR plan escalation procedures to AI incidents and document AI-specific scenarios for the next IR plan review cycle.` },
  'Human Oversight Controls':                { rmf:'MANAGE 2.4', iso:'ISO 42001 §8.5 / Annex A.8.1', tier:'Managing', commentary:`Automation should amplify human judgement, not replace it in contexts where human oversight is critical. NIST AI RMF MANAGE 2.4 requires organisations to implement controls ensuring that humans can intervene in AI-assisted decisions — particularly where outcomes are high-stakes or irreversible.`, remediation:`Define which AI-assisted decisions require mandatory human review before action is taken. Implement workflow controls enforcing human checkpoints and maintain audit logs comparing AI recommendations to human decisions. Review the log quarterly for drift. Compensating control: document human review expectations informally for all high-stakes AI use cases until system-level controls are implemented.` },
  'Decommission & Model Lifecycle':          { rmf:'MANAGE 4.1', iso:'ISO 42001 §8.6 / Annex A.9.4', tier:'Managing', commentary:`AI systems have lifecycles. Models that were fit for purpose when deployed may become outdated, biased, or misaligned with changed business context over time. NIST AI RMF MANAGE 4.1 requires organisations to have processes for retiring AI systems that no longer meet performance, fairness, or risk standards.`, remediation:`Create a formal AI decommission procedure including: performance thresholds that trigger a lifecycle review, data deletion requirements on retirement, model weight archival policy, and transition planning for dependent processes. Compensating control: log all AI system retirement decisions in an AI change log and apply existing IT change management procedures to AI system retirement while the formal procedure is drafted.` },
  'Continuous Improvement & Feedback Loops': { rmf:'GOVERN (continuous)', iso:'ISO 42001 §10.2 / §10.3', tier:'Optimizing', commentary:`Mature AI governance is not static. NIST AI RMF's GOVERN function includes requirements for continuous improvement — using incident data, audit findings, stakeholder feedback, and performance metrics to iteratively refine both AI systems and the governance processes surrounding them.`, remediation:`Establish a quarterly AI governance review cycle that incorporates incident data, audit findings, stakeholder feedback, and performance metrics. Use outcomes to update AI policies, training programmes, and technical controls. Compensating control: add AI governance as a standing agenda item in existing risk committee meetings while a dedicated review cycle is being formalised.` },
  'AI Governance Board / RACI':              { rmf:'GOVERN 1.2', iso:'ISO 42001 §5.3 / §6.2', tier:'Optimizing', commentary:`At the optimising level of AI maturity, governance is embedded in organisational structure. NIST AI RMF GOVERN 1.2 calls for defined, cross-functional accountability for AI risk — including executive sponsorship, legal and compliance involvement, and operational representation.`, remediation:`Establish an AI governance committee with executive sponsorship, legal/compliance, and operational representation. Define the RACI for AI governance decisions and report AI risk posture to the board quarterly. Compensating control: assign existing C-suite responsibilities (CISO, CTO, CPO) to cover AI risk oversight and formalise it in writing until a dedicated committee is established.` }
};

const AI_PYR_TIERS = [
  { label:'Optimizing', rmfColor:'#6b35c8', cols:[
    { type:'seg', id:'cont_improve', name:'Continuous Improvement',  sku:'Continuous Improvement & Feedback Loops' },
    { type:'seg', id:'gov_board',    name:'Board RACI',               sku:'AI Governance Board / RACI' }
  ]},
  { label:'Managing', rmfColor:'#2e7ab0', cols:[
    { type:'seg', id:'ai_irt',   name:'AI Incident Response',           sku:'AI Incident Response' },
    { type:'seg', id:'human_ctl',name:'Human Oversight Controls',       sku:'Human Oversight Controls' },
    { type:'seg', id:'decom',    name:'Decommission & Model Lifecycle', sku:'Decommission & Model Lifecycle' }
  ]},
  { label:'Measuring', rmfColor:'#d97706', cols:[
    { type:'seg', id:'bias_fair', name:'Bias & Fairness Testing',           sku:'Bias & Fairness Testing' },
    { type:'seg', id:'explain',   name:'Explainability & Transparency',     sku:'Explainability & Transparency' },
    { type:'seg', id:'perf_mon',  name:'Performance Monitoring & KPIs',     sku:'Performance Monitoring & KPIs' },
    { type:'seg', id:'red_team',  name:'Red-Teaming & Adversarial Testing', sku:'Red-Teaming & Adversarial Testing' }
  ]},
  { label:'Mapping', rmfColor:'#0d9488', cols:[
    { type:'seg', id:'ai_inv',  name:'AI Inventory & Use-Case Register',    sku:'AI Inventory & Use-Case Register' },
    { type:'seg', id:'ctx_risk',name:'Contextual Risk & Impact Assessment', sku:'Contextual Risk & Impact Assessment' },
    { type:'seg', id:'tp_ai',   name:'Third-Party AI Risk',                 sku:'Third-Party AI Risk' },
    { type:'seg', id:'data_gov',name:'Data Governance for AI',              sku:'Data Governance for AI' },
    { type:'seg', id:'ai_reg',  name:'AI Risk Register',                    sku:'AI Risk Register' }
  ]},
  { label:'Governing', rmfColor:'#3730a3', cols:[
    { type:'seg', id:'ai_policy',   name:'AI Policy & Accountability',             sku:'AI Policy & Accountability' },
    { type:'seg', id:'ai_roles',    name:'AI Roles & Training',                    sku:'AI Roles & Training' },
    { type:'seg', id:'ai_princ',    name:'Trustworthy AI Principles',              sku:'Trustworthy AI Principles' },
    { type:'seg', id:'ai_supplier', name:'AI Supplier Transparency',               sku:'AI Supplier Transparency Requirements' },
    { type:'seg', id:'ai_aup',      name:'AI Acceptable Use Policy',               sku:'AI Acceptable Use Policy' },
    { type:'seg', id:'data_class',  name:'Data Classification Policy',             sku:'Data Classification Policy' },
    { type:'seg', id:'infosec_ai',  name:'InfoSec Policy (AI scope)',               sku:'Information Security Policy (AI scope)' },
    { type:'seg', id:'ai_ethics',   name:'AI Ethics & Principles',                 sku:'AI Ethics & Principles Statement' }
  ]}
];

const AI_PYR_TIER_COLORS = {
  'Optimizing':{ bg:'#6b35c8', border:'#4e228f', text:'#fff' },
  'Managing':  { bg:'#2e7ab0', border:'#1e5a8a', text:'#fff' },
  'Measuring': { bg:'#b45309', border:'#92400e', text:'#fff' },
  'Mapping':   { bg:'#0d9488', border:'#0f766e', text:'#fff' },
  'Governing': { bg:'#3730a3', border:'#1e1a78', text:'#fff' }
};

const AI_PYR_SEGS = [];
AI_PYR_TIERS.forEach(t => t.cols.forEach(c => {
  if (c.type === 'seg') AI_PYR_SEGS.push({ id: c.id, name: c.name, sku: c.sku });
}));

const AI_PYR_MAP = {
  'ai_policy':    'AIG-1.1',  'ai_roles':     'AIG-3.3',  'ai_princ':     'AIG-3.2',
  'ai_supplier':  'AIG-2.5',  'ai_aup':       'AIG-1.1',  'data_class':   'AIG-4.1',
  'infosec_ai':   'AIG-4.4',  'ai_ethics':    'AIG-3.2',  'ai_inv':       'AIG-1.5',
  'ctx_risk':     'AIG-2.4',  'tp_ai':        'AIG-2.5',  'data_gov':     'AIG-4.1',
  'ai_reg':       'AIG-2.2',  'bias_fair':    'AIG-6.4',  'explain':      'AIG-3.1',
  'perf_mon':     'AIG-5.4',  'red_team':     'AIG-6.3',  'ai_irt':       'AIG-7.1',
  'human_ctl':    'AIG-3.1',  'decom':        'AIG-5.5',  'cont_improve': 'AIG-7.4',
  'gov_board':    'AIG-1.3'
};

// ============================================================
// renderAiPyramidCard — reusable pyramid card HTML (Hub + Rapid Pre-Assessment)
// ============================================================
function renderAiPyramidCard(idPrefix, editable) {
  const hintText = editable
    ? 'click any segment to cycle status · use the panel buttons to set a specific status'
    : 'click any segment to view NIST AI RMF details and remediation guidance';
  return `
  <div class="card" style="padding:1.1rem;margin-bottom:1.25rem">
    <div style="font-size:13px;font-weight:700;margin-bottom:.75rem">🔺 AI Governance Maturity Pyramid <span style="font-size:10px;font-weight:400;color:var(--muted);margin-left:6px">NIST AI RMF · ${hintText}</span></div>
    <div style="display:grid;grid-template-columns:1fr 340px;border:1px solid var(--border);border-radius:8px;overflow:hidden">
      <div style="padding:10px 14px;background:var(--bg);display:flex;flex-direction:column;min-height:480px">
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:6px">
          <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid #6b35c8;color:#6b35c8;background:rgba(107,53,200,.08);font-family:monospace;text-transform:uppercase;letter-spacing:.05em">GOVERN</span>
          <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid #0d9488;color:#0d9488;background:rgba(13,148,136,.08);font-family:monospace;text-transform:uppercase;letter-spacing:.05em">MAP</span>
          <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid #d97706;color:#d97706;background:rgba(217,119,6,.08);font-family:monospace;text-transform:uppercase;letter-spacing:.05em">MEASURE</span>
          <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid #2e7ab0;color:#2e7ab0;background:rgba(46,122,176,.08);font-family:monospace;text-transform:uppercase;letter-spacing:.05em">MANAGE</span>
          <span style="flex:1;min-width:12px"></span>
          <span style="font-size:10px;color:var(--muted);display:flex;gap:10px;flex-wrap:wrap">
            <span><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#c00000;margin-right:3px;vertical-align:middle"></span>Not Addressed</span>
            <span><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#e8a000;margin-right:3px;vertical-align:middle"></span>Partial</span>
            <span><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#2e7ab0;margin-right:3px;vertical-align:middle"></span>In Progress</span>
            <span><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:#00af50;margin-right:3px;vertical-align:middle"></span>Implemented</span>
          </span>
        </div>
        <svg id="${idPrefix}-pyr" viewBox="-120 0 1540 710" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="flex:1;min-height:380px;width:100%;display:block"></svg>
        <p style="font-size:10px;color:var(--muted);margin-top:4px;text-align:center;font-family:monospace">${hintText}</p>
      </div>
      <div style="background:var(--card);border-left:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden">
        <div id="${idPrefix}-detail-panel" style="flex:1;overflow-y:auto;display:flex;flex-direction:column">
          <div id="${idPrefix}-detail-empty" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--muted);font-size:11px;padding:24px;text-align:center">
            <div style="font-size:28px;opacity:.25">🔺</div>
            <div>Select a segment from the pyramid</div>
            <div style="font-size:9px;margin-top:2px;opacity:.6;font-family:monospace">to view NIST AI RMF details and remediation guidance</div>
          </div>
          <div id="${idPrefix}-detail-content" style="display:none;padding:14px;flex:1;flex-direction:column;gap:10px">
            <div id="${idPrefix}-d-name" style="font-size:14px;font-weight:700;color:var(--text);line-height:1.3"></div>
            <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
              <span id="${idPrefix}-d-tier-badge" style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid;font-family:monospace;text-transform:uppercase;letter-spacing:.06em"></span>
              <span id="${idPrefix}-d-rmf-badge" style="font-size:9px;font-weight:600;padding:2px 7px;border-radius:4px;border:1px solid var(--border);color:var(--muted);font-family:monospace;background:var(--bg)"></span>
              <span id="${idPrefix}-d-iso-badge" style="font-size:9px;font-weight:600;padding:2px 7px;border-radius:4px;border:1px solid #0d9488;color:#0d9488;font-family:monospace;background:rgba(13,148,136,.08)"></span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:6px">
              <span style="font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);min-width:42px;padding-top:5px;font-family:monospace">Status</span>
              <div id="${idPrefix}-d-status-area" style="display:flex;gap:4px;flex-wrap:wrap"></div>
            </div>
            <div style="height:1px;background:var(--border)"></div>
            <div>
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:5px;font-family:monospace">Why this matters</div>
              <div id="${idPrefix}-d-commentary" style="font-size:11px;color:var(--muted);line-height:1.7"></div>
            </div>
            <div style="height:1px;background:var(--border)"></div>
            <div>
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#0f766e;margin-bottom:5px;font-family:monospace">How to Address This</div>
              <div id="${idPrefix}-d-remediation" style="font-size:11px;color:var(--text);line-height:1.7"></div>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid var(--border);padding:10px 12px;flex-shrink:0">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:6px">
            <div style="border-radius:5px;padding:5px 2px;text-align:center;background:#c00000;border:2px solid #960000">
              <div id="${idPrefix}-s-r" style="font-size:15px;font-weight:700;font-family:monospace;color:#fff">0</div>
              <div style="font-size:8px;color:rgba(255,255,255,.8);line-height:1.2">Not Addressed</div>
            </div>
            <div style="border-radius:5px;padding:5px 2px;text-align:center;background:#e8a000;border:2px solid #b87800">
              <div id="${idPrefix}-s-y" style="font-size:15px;font-weight:700;font-family:monospace;color:#fff">0</div>
              <div style="font-size:8px;color:rgba(255,255,255,.8);line-height:1.2">Partial</div>
            </div>
            <div style="border-radius:5px;padding:5px 2px;text-align:center;background:#2e7ab0;border:2px solid #1e5a8a">
              <div id="${idPrefix}-s-b" style="font-size:15px;font-weight:700;font-family:monospace;color:#fff">0</div>
              <div style="font-size:8px;color:rgba(255,255,255,.8);line-height:1.2">In Progress</div>
            </div>
            <div style="border-radius:5px;padding:5px 2px;text-align:center;background:#00af50;border:2px solid #007a38">
              <div id="${idPrefix}-s-g" style="font-size:15px;font-weight:700;font-family:monospace;color:#fff">0</div>
              <div style="font-size:8px;color:rgba(255,255,255,.8);line-height:1.2">Implemented</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="flex:1;height:5px;background:var(--bg);border-radius:3px;overflow:hidden">
              <div id="${idPrefix}-mat-fill" style="height:100%;width:0%;background:linear-gradient(90deg,#c00000,#e8a000,#2e7ab0,#00af50);border-radius:3px;transition:width .35s ease"></div>
            </div>
            <div id="${idPrefix}-mat-pct" style="font-size:11px;font-weight:700;font-family:monospace;color:var(--text);min-width:28px;text-align:right">0%</div>
          </div>
          <div id="${idPrefix}-data-src" style="font-size:9px;color:var(--muted);margin-top:5px;text-align:center;font-style:italic"></div>
        </div>
      </div>
    </div>
  </div>
  <div id="${idPrefix}-tip" style="position:fixed;background:var(--card);border:1px solid var(--border);color:var(--text);font-size:11px;padding:4px 8px;border-radius:5px;pointer-events:none;display:none;z-index:9999;box-shadow:0 4px 14px rgba(0,0,0,.15);max-width:200px;line-height:1.4"></div>`;
}

// ============================================================
// AI Readiness Hub — aggregated view of the unified AI governance assessment
// ============================================================

function renderAiHub() {
  const orgId = currentOrg?.id;
  const runs = (orgAssessments[orgId] || {})['ai_unified'] || [];

  function latestRun(arr) {
    if (!arr.length) return null;
    return [...arr].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
  }

  const latest = latestRun(runs);
  const answers = latest
    ? Object.fromEntries(Object.entries(latest.answers || {}).filter(([k]) => !k.startsWith('_')))
    : {};
  const fw = latest ? aiuFrameworksFromRun(latest) : { nist: true, iso: true };
  const scores = latest ? aiuCalcScore(answers, fw) : { overall: null, nist: null, iso: null };
  const groupScores = latest ? aiuCalcGroupScores(answers, fw) : [];
  const gaps = latest ? aiuWeightedGaps(answers, fw) : [];
  const top5 = gaps.slice(0, 5);

  const scoreColor = aiuScoreColor;
  const scoreBand  = aiuScoreBand;

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🤖 AI Readiness Hub</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name || '')} · NIST AI RMF v1.0 × ISO/IEC 42001:2023 cross-walk assessment</div>
    </div>
    <button class="btn btn-cyan btn-sm" onclick="setNav('ai_unified')">
      ${latest ? '📊 Open Assessment' : '+ Start AI Assessment'}
    </button>
  </div>

  <!-- Score hero -->
  <div class="score-hero-ins" style="margin-bottom:1.25rem">
    <div style="flex:1">
      <div style="font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:6px">Combined AI Governance Score</div>
      <div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap">
        <div>
          <div class="score-big" style="color:#fff">${scores.overall !== null ? scores.overall : '—'}<span style="font-size:18px">${scores.overall !== null ? '%' : ''}</span></div>
          ${scores.overall !== null
            ? `<div style="font-size:11px;font-weight:700;margin-top:4px;padding:3px 10px;border-radius:20px;display:inline-block;background:rgba(255,255,255,.08);color:${scoreColor(scores.overall)}">${scoreBand(scores.overall)}</div>`
            : `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">Run your first AI governance assessment to see your score</div>`}
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          ${fw.nist !== false && scores.nist !== null
            ? `<div>
                <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">NIST AI RMF</div>
                <div style="font-size:26px;font-weight:800;color:#93c5fd;line-height:1">${scores.nist}%</div>
               </div>` : ''}
          ${fw.iso !== false && scores.iso !== null
            ? `<div>
                <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">ISO 42001</div>
                <div style="font-size:26px;font-weight:800;color:#6ee7b7;line-height:1">${scores.iso}%</div>
               </div>` : ''}
          ${runs.length > 0
            ? `<div>
                <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">Assessments</div>
                <div style="font-size:26px;font-weight:800;color:rgba(255,255,255,.7);line-height:1">${runs.length}</div>
               </div>` : ''}
        </div>
      </div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.25rem">`;

  // ── NIST AI RMF radar card ────────────────────────────────────
  const nistAxes = latest ? aiuCalcNistFunctionScores(answers, fw) : [];
  const isoAxes  = latest ? aiuCalcIsoClauseScores(answers, fw) : [];
  const hasNist  = nistAxes.some(a => a.pct !== null);
  const hasIso   = isoAxes.some(a => a.pct !== null);

  if (hasNist || hasIso) {
    if (hasNist) {
      const nistLegend = nistAxes.filter(a => a.pct !== null).map(a =>
        `<tr><td style="padding:2px 8px 2px 0;font-size:11px;color:var(--muted)">${a.label}</td><td style="padding:2px 0;font-size:11px;font-weight:700;color:${a.pct>=70?'#15803d':a.pct>=40?'#d97706':'#dc2626'};text-align:right">${a.pct}%</td></tr>`
      ).join('');
      html += `
      <div class="card" style="padding:1.1rem">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:.9rem">
          <div style="width:10px;height:10px;border-radius:2px;background:#1d4ed8;flex-shrink:0"></div>
          <div style="font-size:13px;font-weight:700">NIST AI RMF</div>
          <div style="margin-left:auto;font-size:18px;font-weight:800;color:#1d4ed8">${scores.nist !== null ? scores.nist + '%' : '—'}</div>
        </div>
        <canvas id="aihub-nist-radar" width="260" height="260" style="display:block;margin:0 auto .9rem"></canvas>
        <table style="width:100%;border-collapse:collapse">${nistLegend}</table>
        <div style="margin-top:.9rem;display:flex;gap:6px">
          <button class="btn btn-cyan btn-sm" onclick="setNav('ai_unified')">📊 Open Assessment</button>
        </div>
      </div>`;
    }
    if (hasIso) {
      const isoLegend = isoAxes.filter(a => a.pct !== null).map(a =>
        `<tr><td style="padding:2px 8px 2px 0;font-size:11px;color:var(--muted)">${a.label}</td><td style="padding:2px 0;font-size:11px;font-weight:700;color:${a.pct>=70?'#15803d':a.pct>=40?'#d97706':'#dc2626'};text-align:right">${a.pct}%</td></tr>`
      ).join('');
      html += `
      <div class="card" style="padding:1.1rem">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:.9rem">
          <div style="width:10px;height:10px;border-radius:2px;background:#0f766e;flex-shrink:0"></div>
          <div style="font-size:13px;font-weight:700">ISO/IEC 42001</div>
          <div style="margin-left:auto;font-size:18px;font-weight:800;color:#0f766e">${scores.iso !== null ? scores.iso + '%' : '—'}</div>
        </div>
        <canvas id="aihub-iso-radar" width="260" height="260" style="display:block;margin:0 auto .9rem"></canvas>
        <table style="width:100%;border-collapse:collapse">${isoLegend}</table>
        <div style="margin-top:.9rem;display:flex;gap:6px">
          <button class="btn btn-outline btn-sm" onclick="setNav('ai_unified');aiuOpenGapReport(0)">🔍 Gap Report</button>
        </div>
      </div>`;
    }
  } else {
    html += `
    <div class="card" style="padding:1.1rem">
      <div style="font-size:13px;font-weight:700;margin-bottom:.9rem">Framework Breakdown</div>
      <div style="text-align:center;padding:1.5rem 0;color:var(--muted)">
        <div style="font-size:24px;margin-bottom:.5rem">🤖</div>
        <div style="font-size:11px;margin-bottom:.9rem">No assessments yet</div>
        <button class="btn btn-cyan btn-sm" onclick="setNav('ai_unified')">+ Start Now</button>
      </div>
    </div>`;
  }

  // ── Top priority gaps card ────────────────────────────────────
  html += `
    <div class="card" style="padding:1.1rem">
      <div style="font-size:13px;font-weight:700;margin-bottom:.9rem">⭐ Top 5 Priority Gaps</div>
      ${top5.length
        ? top5.map((g, i) => {
            const m = AI_GROUP_META[g.grp];
            const wColor = AI_WEIGHT_COLORS[g.weight];
            return `<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:.65rem;padding:.5rem .6rem;border-radius:6px;background:${g.answer==='no'?'#fff7f7':'#fffbeb'};border:1px solid ${g.answer==='no'?'#fecaca':'#fde68a'}">
              <div style="font-size:15px;font-weight:900;color:${wColor};min-width:18px;text-align:center;line-height:1.3">${i+1}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:10px;font-weight:700;color:${m.color};margin-bottom:1px">${g.id} · <span style="color:${wColor}">${AI_WEIGHT_LABELS[g.weight]}</span></div>
                <div style="font-size:11px;font-weight:700;color:var(--text)">${escH(g.title)}</div>
                <div style="display:flex;gap:3px;margin-top:3px;flex-wrap:wrap">
                  ${(g.nist||[]).map(id=>`<span style="font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;background:#dbeafe;color:#1e40af">${id}</span>`).join('')}
                  ${(g.iso||[]).map(id=>`<span style="font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;background:#ccfbf1;color:#0f766e">${id}</span>`).join('')}
                </div>
              </div>
            </div>`;
          }).join('')
        : `<div style="text-align:center;padding:1.5rem 0;color:var(--muted)">
            ${latest
              ? `<div style="font-size:11px">🎉 No gaps found in latest assessment</div>`
              : `<div style="font-size:11px">Complete an assessment to see priority gaps</div>`}
          </div>`}
      ${gaps.length > 3
        ? `<div style="font-size:10px;color:var(--muted);margin-top:.5rem">+ ${gaps.length - 3} more gaps — open the full Gap Report</div>` : ''}
    </div>`;

  html += `</div>`;

  // ── Framework info bar ────────────────────────────────────────
  html += `
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:.75rem;margin-bottom:1.25rem">
    <div style="padding:.85rem;border-radius:8px;background:var(--card);border:1px solid var(--border)">
      <div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:4px">🏛️ NIST AI RMF v1.0</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:.65rem">AI Risk Management Framework by NIST — covers GOVERN, MAP, MEASURE, and MANAGE functions. 68 sub-categories.</div>
      <div style="font-size:11px;font-weight:700;color:${scores.nist!==null ? scoreColor(scores.nist) : 'var(--muted)'}">
        ${scores.nist !== null ? scores.nist + '% — ' + scoreBand(scores.nist) : 'Not yet assessed'}
      </div>
    </div>
    <div style="padding:.85rem;border-radius:8px;background:var(--card);border:1px solid var(--border)">
      <div style="font-size:12px;font-weight:700;color:#0f766e;margin-bottom:4px">📋 ISO/IEC 42001:2023</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:.65rem">AI Management System standard — defines requirements for an AIMS covering governance, risk, performance, and continual improvement.</div>
      <div style="font-size:11px;font-weight:700;color:${scores.iso!==null ? scoreColor(scores.iso) : 'var(--muted)'}">
        ${scores.iso !== null ? scores.iso + '% — ' + scoreBand(scores.iso) : 'Not yet assessed'}
      </div>
    </div>
    <div style="padding:.85rem;border-radius:8px;background:var(--card);border:1px solid var(--border)">
      <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px">🧩 Unified Cross-Walk</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:.65rem">44 harmonized questions map to both frameworks simultaneously. Each answer contributes to both NIST AI RMF and ISO 42001 scores via weighted gap analysis.</div>
      <button class="btn btn-outline btn-sm" onclick="setNav('ai_unified')">${latest ? '📊 View Latest' : '+ Start Assessment'} →</button>
    </div>
  </div>`;

  // ── AI Maturity Pyramid ──────────────────────────────────────
  html += renderAiPyramidCard('aihub', false);

  // ── History table ──────────────────────────────────────────────
  if (runs.length) {
    html += `<div class="card" style="padding:1.1rem">
      <div style="font-size:13px;font-weight:700;margin-bottom:.75rem">Assessment History</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="border-bottom:2px solid var(--border)">
          <th style="text-align:left;padding:6px 10px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Date</th>
          <th style="text-align:center;padding:6px 8px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Overall</th>
          <th style="text-align:center;padding:6px 8px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">NIST</th>
          <th style="text-align:center;padding:6px 8px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">ISO</th>
          <th style="text-align:left;padding:6px 10px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Conducted By</th>
          <th style="text-align:right;padding:6px 10px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Actions</th>
        </tr></thead>
        <tbody>
          ${[...runs].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map((r, i) => {
            const cleanAns = Object.fromEntries(Object.entries(r.answers||{}).filter(([k])=>!k.startsWith('_')));
            const runFw = aiuFrameworksFromRun(r);
            const sc = aiuCalcScore(cleanAns, runFw);
            return `<tr style="border-bottom:1px solid var(--border)">
              <td style="padding:7px 10px;font-weight:700">${r.date||'—'}</td>
              <td style="padding:7px 8px;text-align:center">
                <span style="font-size:14px;font-weight:700;color:${scoreColor(sc.overall)}">${sc.overall??'—'}</span>${sc.overall!==null?'<span style="font-size:10px;color:var(--muted)">%</span>':''}
              </td>
              <td style="padding:7px 8px;text-align:center">
                ${runFw.nist!==false && sc.nist!==null ? `<span style="font-size:12px;font-weight:700;color:#1d4ed8">${sc.nist}%</span>` : '<span style="color:var(--muted)">—</span>'}
              </td>
              <td style="padding:7px 8px;text-align:center">
                ${runFw.iso!==false && sc.iso!==null ? `<span style="font-size:12px;font-weight:700;color:#0f766e">${sc.iso}%</span>` : '<span style="color:var(--muted)">—</span>'}
              </td>
              <td style="padding:7px 10px;color:var(--muted)">${escH(r.conductedBy||'—')}</td>
              <td style="padding:7px 10px;text-align:right">
                <button class="btn btn-outline btn-sm" onclick="setNav('ai_unified')" style="font-size:11px;padding:3px 8px">Open →</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
  }

  return html;
}

// ============================================================
// initAiPyramid — generic pyramid initialiser (Hub + Rapid Pre-Assessment)
// idPrefix   : string — matches IDs from renderAiPyramidCard
// editable   : bool — true shows status buttons in detail panel
// externalState : object|null — pre-built {segId:'color',...}; null means auto-load or blank
// autoLoad   : bool — when externalState is null AND autoLoad=true, load from latest ai_unified
// Returns the live state object (caller can read it at any time for saving)
// ============================================================
function initAiPyramid(idPrefix, editable, externalState, autoLoad) {
  const svg = document.getElementById(idPrefix + '-pyr');
  if (!svg) return {};
  const $ = id => document.getElementById(idPrefix + '-' + id);

  // ── Initialise state ────────────────────────────────────────
  let _hasAssessment = false, _latestDate = null;
  const ANSWER_STATUS = { yes: 'green', partial: 'yellow', no: 'red' };
  const state = {};

  if (externalState) {
    AI_PYR_SEGS.forEach(s => { state[s.id] = externalState[s.id] || 'red'; });
  } else if (autoLoad) {
    const _orgId = currentOrg?.id;
    const _runs = (orgAssessments[_orgId] || {})['ai_unified'] || [];
    const _latest = _runs.length ? [..._runs].sort((a, b) => (b.date||'').localeCompare(a.date||''))[0] : null;
    const _answers = _latest ? Object.fromEntries(Object.entries(_latest.answers||{}).filter(([k]) => !k.startsWith('_'))) : {};
    AI_PYR_SEGS.forEach(s => { state[s.id] = ANSWER_STATUS[_answers[AI_PYR_MAP[s.id]]] || 'red'; });
    _hasAssessment = _latest !== null;
    _latestDate = _latest?.date || null;
  } else {
    AI_PYR_SEGS.forEach(s => { state[s.id] = 'red'; });
  }

  let selectedId = null;

  // ── Helpers ─────────────────────────────────────────────────
  function getStatusFill(st) { return { red:'#c00000', yellow:'#e8a000', blue:'#2e7ab0', green:'#00af50' }[st] || '#888'; }
  function getStatusStroke(st) { return { red:'#960000', yellow:'#b87800', blue:'#1e5a8a', green:'#007a38' }[st] || '#555'; }

  const W = 1400, TIP_Y = 28, BASE_Y = 690, HALF_W = 460, PAD = 5;
  const NT = AI_PYR_TIERS.length, TH = (BASE_Y - TIP_Y) / NT;

  function tierBounds(ti) {
    const topY = TIP_Y + ti * TH, botY = topY + TH;
    const ft = (topY - TIP_Y) / (BASE_Y - TIP_Y), fb = (botY - TIP_Y) / (BASE_Y - TIP_Y);
    return { topY, botY, topHW: ft * HALF_W, botHW: fb * HALF_W };
  }

  function ns(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }

  function wrap(text, maxW, fs) {
    const max = Math.max(4, Math.floor(maxW / (fs * 0.52)));
    const words = text.split(' '); const lines = []; let cur = '';
    words.forEach(w => { const t = cur ? cur + ' ' + w : w; if (t.length > max && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur);
    return lines;
  }

  function drawWrapped(g, cx, cy, text, maxW, fs) {
    const lines = wrap(text, maxW, fs);
    const lh = fs * 1.25, tot = lines.length * lh;
    lines.forEach((line, li) => {
      const t = ns('text');
      t.setAttribute('x', cx); t.setAttribute('y', cy - tot / 2 + li * lh + lh * 0.78);
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#ffffff');
      t.setAttribute('font-size', fs); t.setAttribute('font-weight', '600');
      t.setAttribute('font-family', 'Kanit,sans-serif'); t.style.pointerEvents = 'none';
      t.textContent = line; g.appendChild(t);
    });
  }

  const tipEl = $('tip');
  function moveTip(e) { if (!tipEl) return; tipEl.style.left = (e.clientX + 14) + 'px'; tipEl.style.top = (e.clientY - 32) + 'px'; }

  // ── Render ───────────────────────────────────────────────────
  function renderPyramid() {
    svg.innerHTML = '';
    const cx = W / 2;
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
        const isSelected = selectedId === col.id;
        const g = ns('g');
        const poly = ns('polygon');
        poly.setAttribute('points', `${xtl},${yt} ${xtr},${yt} ${xbr},${yb} ${xbl},${yb}`);
        poly.setAttribute('fill', getStatusFill(state[col.id]));
        poly.setAttribute('stroke', isSelected ? '#ffffff' : getStatusStroke(state[col.id]));
        poly.setAttribute('stroke-width', isSelected ? '3.5' : '1');
        g.appendChild(poly);
        const midY = (yt + yb) / 2;
        const fs = Math.min(11, Math.max(7, (yb - yt) / 4.5));
        drawWrapped(g, midX, midY, col.name, colW - 6, fs);
        g.style.cursor = 'pointer';
        g.addEventListener('click', () => selectSeg(col.id));
        g.addEventListener('mouseenter', e => { if (tipEl) { tipEl.style.display = 'block'; tipEl.textContent = col.name; moveTip(e); } });
        g.addEventListener('mousemove', moveTip);
        g.addEventListener('mouseleave', () => { if (tipEl) tipEl.style.display = 'none'; });
        svg.appendChild(g);
      });
      const { topY: ty, botY: by, topHW: thw } = tierBounds(ti);
      const lblY = (ty + by) / 2;
      const lt = ns('text');
      lt.setAttribute('x', cx - Math.max(thw, 0) - 80); lt.setAttribute('y', lblY + 4);
      lt.setAttribute('text-anchor', 'end'); lt.setAttribute('fill', '#5a3a9a');
      lt.setAttribute('font-size', '13'); lt.setAttribute('font-weight', '700');
      lt.setAttribute('font-family', 'Kanit,sans-serif'); lt.setAttribute('letter-spacing', '0.06em');
      lt.textContent = tier.label.toUpperCase(); svg.appendChild(lt);
    });
  }

  function getTierForId(id) {
    for (const tier of AI_PYR_TIERS) { if (tier.cols.find(c => c.id === id)) return tier; }
    return null;
  }

  // Click selects segment; in editable mode also cycles status for quick entry
  const STATUS_CYCLE = ['red','yellow','blue','green'];
  function selectSeg(id) {
    if (editable) {
      state[id] = STATUS_CYCLE[(STATUS_CYCLE.indexOf(state[id]) + 1) % STATUS_CYCLE.length];
    }
    selectedId = id;
    renderPyramid();
    updateStats();
    showDetail(id);
  }

  function showDetail(id) {
    const seg = AI_PYR_SEGS.find(s => s.id === id);
    if (!seg) return;
    const cat = AI_PYR_CATALOGUE[seg.sku] || {};
    const tier = getTierForId(id);
    const status = state[id];
    const tc = AI_PYR_TIER_COLORS[tier?.label] || { bg:'#666', border:'#444', text:'#fff' };
    $('detail-empty').style.display = 'none';
    const dc = $('detail-content');
    dc.style.display = 'flex';
    $('d-name').textContent = seg.name;
    const tb = $('d-tier-badge');
    tb.textContent = tier?.label || ''; tb.style.background = tc.bg; tb.style.borderColor = tc.border; tb.style.color = tc.text;
    const rmfBadge = $('d-rmf-badge');
    if (cat.rmf) {
      rmfBadge.innerHTML = `<a href="https://airc.nist.gov/Home" target="_blank" rel="noopener" title="Open NIST AI RMF Resource Centre" style="color:inherit;text-decoration:none">${cat.rmf} ↗</a>`;
      rmfBadge.style.display = '';
    } else { rmfBadge.innerHTML = ''; rmfBadge.style.display = 'none'; }
    const isoBadge = $('d-iso-badge');
    if (cat.iso) {
      isoBadge.innerHTML = `<a href="https://www.iso.org/standard/81230.html" target="_blank" rel="noopener" title="Open ISO/IEC 42001:2023 standard page" style="color:inherit;text-decoration:none">${cat.iso} ↗</a>`;
      isoBadge.style.display = '';
    } else { isoBadge.style.display = 'none'; }

    // Status area: interactive buttons (editable) or readonly badge (hub)
    const statusArea = $('d-status-area');
    statusArea.innerHTML = '';
    if (editable) {
      [['red','Not Addressed','#c00000'],['yellow','Partial','#e8a000'],['blue','In Progress','#2e7ab0'],['green','Implemented','#00af50']].forEach(([v, label, col]) => {
        const btn = document.createElement('button');
        btn.style.cssText = `padding:3px 9px;border-radius:5px;border:1.5px solid ${status===v?col:'var(--border)'};background:${status===v?col:'transparent'};cursor:pointer;font-size:10px;font-weight:500;color:${status===v?'#fff':'var(--muted)'};transition:all .12s`;
        btn.textContent = label;
        btn.onclick = () => { state[id] = v; renderPyramid(); updateStats(); showDetail(id); };
        statusArea.appendChild(btn);
      });
    } else {
      const STATUS_LABELS = { red:'Not Addressed', yellow:'Partial', blue:'In Progress', green:'Implemented' };
      const STATUS_COLS   = { red:'#c00000', yellow:'#e8a000', blue:'#2e7ab0', green:'#00af50' };
      const badge = document.createElement('span');
      badge.style.cssText = `display:inline-block;padding:3px 10px;border-radius:5px;font-size:10px;font-weight:700;color:#fff;background:${STATUS_COLS[status]||'#888'}`;
      badge.textContent = STATUS_LABELS[status] || status;
      statusArea.appendChild(badge);
    }

    $('d-commentary').textContent = cat.commentary || '';
    const remEl = $('d-remediation');
    if (remEl) remEl.textContent = cat.remediation || '';
  }

  function updateStats() {
    const vals = AI_PYR_SEGS.map(s => state[s.id]);
    $('s-r').textContent = vals.filter(v => v === 'red').length;
    $('s-y').textContent = vals.filter(v => v === 'yellow').length;
    $('s-b').textContent = vals.filter(v => v === 'blue').length;
    $('s-g').textContent = vals.filter(v => v === 'green').length;
    const g = vals.filter(v => v === 'green').length;
    const b = vals.filter(v => v === 'blue').length;
    const y = vals.filter(v => v === 'yellow').length;
    const pct = Math.round((g + b * 0.5 + y * 0.25) / vals.length * 100);
    $('mat-pct').textContent = pct + '%';
    $('mat-fill').style.width = pct + '%';
    const srcEl = $('data-src');
    if (srcEl) {
      if (editable && !externalState) {
        srcEl.textContent = 'Click a segment to select it, then use the panel buttons to set maturity status';
      } else if (editable && externalState) {
        srcEl.textContent = 'Loaded from saved pre-assessment — modify and save as new';
      } else if (_hasAssessment) {
        srcEl.textContent = `Auto-populated from AI Governance assessment (${_latestDate || 'latest'})`;
      } else {
        srcEl.textContent = 'No AI Governance assessment on file — run an assessment to populate this view';
      }
    }
  }

  renderPyramid();
  updateStats();
  return state; // live reference — caller can read current values at any time
}

// Hub wrapper — read-only, auto-loads from latest ai_unified
function initAiMaturityPyramid() { initAiPyramid('aihub', false, null, true); }

function initAiReadinessHub() {
  initAiMaturityPyramid();
  const runs = (orgAssessments[currentOrg?.id]||{})['ai_unified']||[];
  const sorted = [...runs].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  const latest = sorted[0];
  if (!latest) return;
  const answers = Object.fromEntries(Object.entries(latest.answers||{}).filter(([k])=>!k.startsWith('_')));
  const fw = aiuFrameworksFromRun(latest);
  const nc = document.getElementById('aihub-nist-radar');
  if (nc) {
    const nistAxes = aiuCalcNistFunctionScores(answers, fw);
    if (nistAxes.some(a => a.pct !== null)) aiuDrawFrameworkRadar(nc, nistAxes, 'rgba(29,78,216,0.10)', '#1d4ed8');
  }
  const ic = document.getElementById('aihub-iso-radar');
  if (ic) {
    const isoAxes = aiuCalcIsoClauseScores(answers, fw);
    if (isoAxes.some(a => a.pct !== null)) aiuDrawFrameworkRadar(ic, isoAxes, 'rgba(15,118,110,0.10)', '#0f766e');
  }
}

// ============================================================
// Rapid Pre-Assessment — interactive pyramid that saves to DB
// ============================================================
let _rapidState = null;

function calcPyramidPct(stateObj) {
  const vals = AI_PYR_SEGS.map(s => (stateObj[s.id] || 'red'));
  const g = vals.filter(v => v === 'green').length;
  const b = vals.filter(v => v === 'blue').length;
  const y = vals.filter(v => v === 'yellow').length;
  return Math.round((g + b * 0.5 + y * 0.25) / vals.length * 100);
}

function renderRapidPreAssessment() {
  const orgId = currentOrg?.id;
  const runs = [...((orgAssessments[orgId] || {})['rapid_pyramid'] || [])].sort((a, b) => (b.date||'').localeCompare(a.date||''));

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🔺 Rapid Pre-Assessment</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name || '')} · Quick AI governance maturity snapshot · no evidence required · saves to database</div>
    </div>
    <button class="btn btn-outline btn-sm" onclick="setNav('ai_unified')">Full Assessment →</button>
  </div>

  <div class="card" style="padding:1rem;margin-bottom:1.25rem">
    <div style="font-size:12px;font-weight:700;margin-bottom:.65rem">Assessment Details</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
      <div>
        <label style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:4px">Assessor Name</label>
        <input id="rapid-assessor" type="text" placeholder="Your name" style="width:100%;padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--text);background:var(--bg)">
      </div>
      <div>
        <label style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:4px">Assessment Date</label>
        <input id="rapid-date" type="date" style="width:100%;padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--text);background:var(--bg)">
      </div>
    </div>
  </div>

  ${renderAiPyramidCard('rapid', true)}

  <div style="display:flex;justify-content:flex-end;gap:.75rem;margin-bottom:1.25rem">
    <button id="rapid-save-btn" class="btn btn-cyan">📥 Save Pre-Assessment</button>
    <button class="btn btn-primary" onclick="promoteCurrentRapidToFull()" title="Copy pyramid statuses into a new AI Governance Assessment and open the evidence-based form">🔼 Promote to Full Assessment</button>
  </div>`;

  if (runs.length) {
    html += `<div class="card" style="padding:1.1rem">
      <div style="font-size:13px;font-weight:700;margin-bottom:.75rem">Pre-Assessment History</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="border-bottom:2px solid var(--border)">
          <th style="text-align:left;padding:6px 10px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Date</th>
          <th style="text-align:center;padding:6px 8px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Maturity</th>
          <th style="text-align:left;padding:6px 10px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Conducted By</th>
          <th style="text-align:right;padding:6px 10px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Actions</th>
        </tr></thead>
        <tbody>
          ${runs.map(r => {
            const pct = calcPyramidPct(r.answers || {});
            const col = pct >= 70 ? '#00af50' : pct >= 40 ? '#e8a000' : '#c00000';
            return `<tr style="border-bottom:1px solid var(--border)">
              <td style="padding:7px 10px;font-weight:700">${r.date||'—'}</td>
              <td style="padding:7px 8px;text-align:center">
                <span style="font-size:14px;font-weight:700;color:${col}">${pct}</span><span style="font-size:10px;color:var(--muted)">%</span>
              </td>
              <td style="padding:7px 10px;color:var(--muted)">${escH(r.conductedBy||'—')}</td>
              <td style="padding:7px 10px;text-align:right;display:flex;gap:4px;justify-content:flex-end">
                <button class="btn btn-outline btn-sm" style="font-size:11px;padding:3px 8px" onclick="loadRapidRun('${r.id}')">Load →</button>
                <button class="btn btn-primary btn-sm" style="font-size:11px;padding:3px 8px" onclick="promoteRunToFull('${r.id}')" title="Open a new full AI Governance Assessment pre-populated from this run">🔼 Promote</button>
                <button class="btn btn-red btn-sm" style="font-size:11px;padding:3px 8px" onclick="deleteRapidRun('${r.id}')">Delete</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
  }

  return html;
}

function initRapidPyramid(preloadRunId) {
  const orgId = currentOrg?.id;
  const runs = (orgAssessments[orgId] || {})['rapid_pyramid'] || [];
  let initialState = null, prefDate = new Date().toISOString().slice(0, 10), prefAssessor = '';

  if (preloadRunId) {
    const run = runs.find(r => r.id === preloadRunId);
    if (run) {
      initialState = {};
      AI_PYR_SEGS.forEach(s => { initialState[s.id] = (run.answers || {})[s.id] || 'red'; });
      prefDate = run.date || prefDate;
      prefAssessor = run.conductedBy || '';
    }
  }

  const dateInput = document.getElementById('rapid-date');
  if (dateInput) dateInput.value = prefDate;
  const assessorInput = document.getElementById('rapid-assessor');
  if (assessorInput && prefAssessor) assessorInput.value = prefAssessor;

  _rapidState = initAiPyramid('rapid', true, initialState, false);

  const saveBtn = document.getElementById('rapid-save-btn');
  if (saveBtn) saveBtn.onclick = doSaveRapidPyramid;
}

async function doSaveRapidPyramid() {
  if (!_rapidState) return;
  const orgId = currentOrg?.id;
  if (!orgId) return;
  const assessor = document.getElementById('rapid-assessor')?.value?.trim() || '';
  const date = document.getElementById('rapid-date')?.value || new Date().toISOString().slice(0, 10);
  const answers = { _type: 'rapid_pyramid' };
  AI_PYR_SEGS.forEach(s => { answers[s.id] = _rapidState[s.id]; });
  const pct = calcPyramidPct(answers);
  const saveBtn = document.getElementById('rapid-save-btn');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; }
  try {
    await sb.saveAssessment({ org_id: orgId, module: 'rapid_pyramid', score: pct, answers, conducted_by: assessor, assessed_at: date });
    delete orgAssessments[orgId];
    await loadAssessments(orgId);
    toast('Pre-assessment saved — ' + pct + '% maturity');
    const el = document.getElementById('mainContent');
    el.innerHTML = viewOnlyBanner() + renderRapidPreAssessment();
    setTimeout(() => initRapidPyramid(), 50);
  } catch(e) {
    toast('Save failed: ' + e.message, '#c00000');
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '📥 Save Pre-Assessment'; }
  }
}

function loadRapidRun(runId) {
  const el = document.getElementById('mainContent');
  el.innerHTML = viewOnlyBanner() + renderRapidPreAssessment();
  setTimeout(() => initRapidPyramid(runId), 50);
}

async function deleteRapidRun(runId) {
  if (!confirm('Delete this pre-assessment? This cannot be undone.')) return;
  try {
    await sb.deleteAssessment(runId);
    const orgId = currentOrg?.id;
    delete orgAssessments[orgId];
    await loadAssessments(orgId);
    toast('Pre-assessment deleted');
    const el = document.getElementById('mainContent');
    el.innerHTML = viewOnlyBanner() + renderRapidPreAssessment();
    setTimeout(() => initRapidPyramid(), 50);
  } catch(e) { toast('Delete failed: ' + e.message, '#c00000'); }
}

// Promote a rapid pre-assessment state into a new AI Governance Assessment (evidence-based)
function promoteRapidToFull(stateObj, conductedBy, date) {
  const STATUS_TO_ANSWER = { green: 'yes', blue: 'partial', yellow: 'partial', red: 'no' };
  const STATUS_RANK = { yes: 3, partial: 2, no: 1 };
  // Multiple pyramid segments can map to the same control — take the best answer
  const controlBest = {};
  AI_PYR_SEGS.forEach(s => {
    const ctrlId = AI_PYR_MAP[s.id];
    if (!ctrlId) return;
    const answer = STATUS_TO_ANSWER[stateObj[s.id] || 'red'] || 'no';
    if (!controlBest[ctrlId] || STATUS_RANK[answer] > STATUS_RANK[controlBest[ctrlId]]) {
      controlBest[ctrlId] = answer;
    }
  });
  const prePopCount = Object.keys(controlBest).length;
  // Inject into ai_unified state and open the form
  aiUnifiedState.answers        = { ...controlBest };
  aiUnifiedState.frameworks     = { nist: true, iso: true };
  aiUnifiedState.openPanels     = {};
  aiUnifiedState.openComments   = {};
  aiUnifiedState.notes          = {};
  aiUnifiedState.editId         = null;
  aiUnifiedState.date           = date || new Date().toISOString().slice(0, 10);
  aiUnifiedState.conductedBy    = conductedBy || '';
  aiUnifiedState.view           = 'form';
  aiUnifiedState.reportRun      = null;
  aiUnifiedState.reportCommentary = '';
  aiUnifiedState.poamRun        = null;
  aiUnifiedState.poamItems      = {};
  setNav('ai_unified');
  toast(`${prePopCount} controls pre-populated from rapid assessment — add evidence to complete`);
}

function promoteCurrentRapidToFull() {
  if (!_rapidState) { toast('No rapid assessment in progress', '#c00000'); return; }
  const assessor = document.getElementById('rapid-assessor')?.value?.trim() || '';
  const date = document.getElementById('rapid-date')?.value || '';
  promoteRapidToFull(_rapidState, assessor, date);
}

function promoteRunToFull(runId) {
  const orgId = currentOrg?.id;
  const runs = (orgAssessments[orgId] || {})['rapid_pyramid'] || [];
  const run = runs.find(r => r.id === runId);
  if (!run) return;
  promoteRapidToFull(run.answers || {}, run.conductedBy || '', run.date || '');
}
