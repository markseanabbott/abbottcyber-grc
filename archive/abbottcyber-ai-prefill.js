// ============================================================
// Abbott Cyber Consulting — AI Framework Pre-Population Script
// Organisation:  Abbott Cyber Consulting (vCISO/vCIO consulting, Surrey BC)
// Assessor:      Mark Abbott — Founder & vCISO
// Date:          2026-06-10
// AI Risk Profile: Developing (uses AI tools; zero formal AI governance yet)
//
// HOW TO USE:
//   1. Open the GRC platform in your browser
//   2. Select "Abbott Cyber Consulting" in the org switcher
//   3. Open browser DevTools (F12) → Console tab
//   4. Paste this entire script and press Enter
//   5. It will land you on the NIST AI RMF form — review and click Save
//   6. Then click ISO 42001 in the nav and click Save there too
//
// EXPECTED SCORES:
//   NIST AI RMF v1.0 : ~30%  (Elevated Risk)
//   ISO/IEC 42001    : ~33%  (Elevated Risk)
//
// RATIONALE:
//   Strong: human oversight of all outputs, safety-first culture, AI aligned to
//   mission, technical understanding, vendor evaluation capability (TPRA),
//   communicates AI use to clients, monitors AI quality informally.
//   Partial: most operational practices — exist in spirit but not formally
//   documented, not formally assigned, no written policy.
//   No: formal policies, written risk register, training programs, red-teaming,
//   formal metrics, documented roles, incident tracking.
// ============================================================

const _date = '2026-06-10';
const _assessor = 'Mark Abbott — Founder & vCISO, Abbott Cyber Consulting';

// ── NIST AI RMF v1.0 ─────────────────────────────────────────────────────────
// 68 sub-categories across GOVERN (17) / MAP (18) / MEASURE (21) / MANAGE (12)

nistAiState.answers = {

  // ── GOVERN (17) ─────────────────────────────────────────────────────────────
  // Group 1: Policies, Processes & Accountability
  'GOVERN-1.1': 'no',       // AI risk management policies in place — none written
  'GOVERN-1.2': 'partial',  // Accountability/responsibility defined — Mark owns everything; no formal structure
  'GOVERN-1.3': 'yes',      // Culture considers AI risk — vCISO ethos; bias/ethics integral to practice
  'GOVERN-1.4': 'no',       // Diverse perspectives (domain experts, communities) — sole operator; N/A
  'GOVERN-1.5': 'partial',  // External feedback collected — client feedback received; no formal process
  'GOVERN-1.6': 'partial',  // AI supply chain risks addressed — TPRA process applied to AI vendors informally
  'GOVERN-1.7': 'no',       // Decommissioning/phase-out managed — SaaS tools; no formal process

  // Group 2: Roles & Responsibilities
  'GOVERN-2.1': 'no',       // Cross-functional AI teams established — sole operator; no cross-functional structure
  'GOVERN-2.2': 'no',       // AI risk management training provided — no formal training program

  // Group 3: Team Diversity & Human Oversight
  'GOVERN-3.1': 'no',       // Diverse team input informs AI risk decisions — sole operator
  'GOVERN-3.2': 'partial',  // Human oversight roles for AI defined — Mark reviews all outputs; not formally defined

  // Group 4: Risk Documentation & Communication
  'GOVERN-4.1': 'yes',      // Safety-first mindset fostered — core vCISO philosophy; this IS the operating culture
  'GOVERN-4.2': 'partial',  // AI risks/impacts documented and communicated — discussed with clients; limited docs

  // Group 5: Stakeholder Feedback
  'GOVERN-5.1': 'partial',  // Stakeholder feedback practices in place — client feedback received; no formal channel
  'GOVERN-5.2': 'no',       // Feedback incorporated into AI system design — uses off-the-shelf AI; no development

  // Group 6: Contingency & Incident Readiness
  'GOVERN-6.1': 'partial',  // Policies address internal and external AI use — use cases known; no written policy
  'GOVERN-6.2': 'partial',  // AI failure contingency processes exist — strong IR background; AI fallback is informal

  // ── MAP (18) ─────────────────────────────────────────────────────────────────
  // Group 1: Context Establishment
  'MAP-1.1': 'partial',     // Context established for AI risk assessment — understood well; not formally documented
  'MAP-1.2': 'no',          // AI RMF implementation methods documented — this assessment is the first formal step
  'MAP-1.3': 'partial',     // AI risk tolerance reflects org mission — vCISO risk mindset applied; not written
  'MAP-1.4': 'partial',     // Resources dedicated to AI risk management — time invested; not formally allocated
  'MAP-1.5': 'partial',     // AI risk priorities align with business strategy — priorities understood informally
  'MAP-1.6': 'no',          // Risk tolerance documented and reviewed — not written down

  // Group 2: Categorization of AI Systems
  'MAP-2.1': 'no',          // Scientific AI risk findings inform policy — no policy to inform
  'MAP-2.2': 'partial',     // AI risk research incorporated into practices — stays current on LLM/AI risks; informal
  'MAP-2.3': 'partial',     // Third-party AI actor risks mapped — TPRA capability applied to AI tool vendors

  // Group 3: AI Risk Identification
  'MAP-3.1': 'partial',     // AI risks identified with expert input — Mark is the expert; identifies in tool selection
  'MAP-3.2': 'partial',     // Human oversight practices defined — reviews all AI outputs; not a written practice
  'MAP-3.3': 'no',          // Impact assessments completed for high-risk AI — not formally conducted
  'MAP-3.4': 'no',          // AI risks documented in a management system — no AI risk register
  'MAP-3.5': 'partial',     // AI system impacts understood and documented — understood; not documented

  // Group 4: Risk Measurement Approaches
  'MAP-4.1': 'no',          // AI risk likelihood/impact measurement documented — not formalised
  'MAP-4.2': 'no',          // Risk measurement approaches reviewed and updated — not formalised

  // Group 5: Harm Anticipation & Response
  'MAP-5.1': 'partial',     // Practices anticipate and document AI harms — anticipates in tool selection; no docs
  'MAP-5.2': 'partial',     // Practices address identified AI harms — when issues arise, addressed; informal

  // ── MEASURE (21) ─────────────────────────────────────────────────────────────
  // Group 1: Risk Measurement Selection
  'MEASURE-1.1': 'no',      // AI risk metrics selected and implemented — none defined
  'MEASURE-1.2': 'partial', // Teams use varied methods to identify AI risk — Mark uses multiple approaches informally
  'MEASURE-1.3': 'no',      // Independent experts evaluate AI systems — Mark IS the evaluator; no independence

  // Group 2: Testing & Evaluation
  'MEASURE-2.1': 'no',      // Test sets reflect deployment context — user of AI tools, not deploying systems
  'MEASURE-2.2': 'partial', // AI risk research informs testing approach — stays current on AI attack vectors
  'MEASURE-2.3': 'no',      // AI systems undergo pre-deployment testing/red-teaming — not conducted
  'MEASURE-2.4': 'no',      // Post-deployment evaluation processes documented — not written
  'MEASURE-2.5': 'no',      // Red-teaming conducted on AI systems — not conducted
  'MEASURE-2.6': 'partial', // Third-party AI component risks considered — evaluates AI tool vendors before adopting
  'MEASURE-2.7': 'partial', // AI system security and resilience evaluated — security-conscious in tool selection
  'MEASURE-2.8': 'partial', // AI user interface risks evaluated — aware of over-reliance risks; informal
  'MEASURE-2.9': 'no',      // AI systems tested for bias and fairness — not formally tested
  'MEASURE-2.10': 'partial',// Privacy risks of AI systems evaluated — strong privacy practice applied to AI tools
  'MEASURE-2.11': 'no',     // Fairness/bias documentation evaluated — not reviewed for adopted tools
  'MEASURE-2.12': 'no',     // Environmental impact of AI evaluated — not a priority for small firm
  'MEASURE-2.13': 'no',     // Risk mitigation effectiveness evaluated — not formally tracked

  // Group 3: Ongoing Measurement Mechanisms
  'MEASURE-3.1': 'no',      // AI evaluation documentation in place — not written
  'MEASURE-3.2': 'no',      // Risk tracking applied to all AI systems — no AI risk tracking
  'MEASURE-3.3': 'partial', // End user/client feedback incorporated into AI evaluation — client feedback shapes usage

  // Group 4: Risk Tracking & Reporting
  'MEASURE-4.1': 'no',      // Risk measurement connected to deployment context — not formalised
  'MEASURE-4.2': 'no',      // Deployed AI system measurement results documented — not written

  // ── MANAGE (12) ──────────────────────────────────────────────────────────────
  // Group 1: Risk Response
  'MANAGE-1.1': 'yes',      // AI system purpose achievement assessed — regularly evaluates if AI is actually helping
  'MANAGE-1.2': 'partial',  // AI risk response options considered — accept/avoid/mitigate applied informally
  'MANAGE-1.3': 'no',       // High-priority AI risk responses developed/documented — not formalised
  'MANAGE-1.4': 'no',       // Residual AI risks documented — not written

  // Group 2: Sustaining & Improving AI Value
  'MANAGE-2.1': 'partial',  // Resources for AI risk management allocated — investing time in AI risk knowledge
  'MANAGE-2.2': 'partial',  // Mechanisms sustain deployed AI system value — monitors AI quality; informal
  'MANAGE-2.3': 'partial',  // AI incidents and errors evaluated — errors corrected before client delivery; not logged
  'MANAGE-2.4': 'yes',      // Mechanisms improve AI outcomes — continuously improves prompting/usage from experience

  // Group 3: AI Risk Communication
  'MANAGE-3.1': 'partial',  // AI risks communicated to relevant actors — communicates AI use/limits to clients
  'MANAGE-3.2': 'partial',  // Pre-trained models monitored — tracks Claude/AI vendor releases and changes

  // Group 4: Post-Deployment Monitoring
  'MANAGE-4.1': 'no',       // Post-deployment monitoring plans implemented — not formalised
  'MANAGE-4.2': 'partial',  // Performance changes documented and corrected — corrects when quality declines; informal
};

nistAiState.date = _date;
nistAiState.conductedBy = _assessor;
nistAiState.view = 'form';

// Set AI Risk Profile: Developing (uses AI; building toward formal governance)
if (typeof orgProfiles !== 'undefined' && currentOrg?.id) {
  orgProfiles[currentOrg.id] = orgProfiles[currentOrg.id] || {};
  orgProfiles[currentOrg.id].ai_rmf_profile = 'developing';
}

// ── ISO/IEC 42001:2023 ───────────────────────────────────────────────────────
// 53 items · Clauses 4–10 (25) + Annex A controls (28)
// NA used for: designing/training AI systems, A.3.3 (Mark IS management),
//              AI system decommissioning (SaaS = cancel subscription)

iso42001State.answers = {

  // ── Clause 4: Context of the Organization ───────────────────────────────────
  '4.1': 'partial',  // Context understood — well known; AIMS scope not formally defined
  '4.2': 'partial',  // Interested parties (clients, regulators) — considered; not formally for AIMS
  '4.3': 'no',       // AIMS scope documented — none written
  '4.4': 'no',       // AI Management System established — none

  // ── Clause 5: Leadership ────────────────────────────────────────────────────
  '5.1': 'partial',  // Leadership commitment — Mark is committed in practice; formal structures don't apply (micro-firm)
  '5.2': 'no',       // AI policy established — none written
  '5.3': 'partial',  // Roles, responsibilities, authorities — Mark informally holds all; nothing documented

  // ── Clause 6: Planning ──────────────────────────────────────────────────────
  '6.1': 'partial',  // Actions to address risks/opportunities — risk thinking applied; not formal AIMS risk process
  '6.2': 'no',       // AI objectives established and documented — not written

  // ── Clause 7: Support ───────────────────────────────────────────────────────
  '7.1': 'partial',  // Resources — AI tool subscriptions and time allocated; not formally resourced
  '7.2': 'partial',  // Competence — Mark is highly competent; no formal evidence of competence recorded
  '7.3': 'partial',  // Awareness — self-aware; no formal awareness program
  '7.4': 'partial',  // Communication — communicates about AI with clients; no internal formal process
  '7.5': 'no',       // Documented information (AIMS docs) — none

  // ── Clause 8: Operation ─────────────────────────────────────────────────────
  '8.1': 'no',       // Operational planning and control — not formalised
  '8.2': 'partial',  // AI risk assessment — TPRA capability applied to AI vendors; no formal AIMS risk assessment
  '8.3': 'no',       // AI risk treatment and statement of applicability — not written
  '8.4': 'no',       // AI system documentation (intended purpose, specs, data, impact) — not formally maintained
  '8.5': 'partial',  // AI system impact assessment — considers client impact; not formal
  '8.6': 'partial',  // AI supplier relationships — evaluates AI tool suppliers; informal

  // ── Clause 9: Performance Evaluation ────────────────────────────────────────
  '9.1': 'no',       // Monitoring, measurement, analysis, evaluation — not formalised
  '9.2': 'no',       // Internal audit of AIMS — not conducted
  '9.3': 'partial',  // Management review — Mark reviews how AI is working; informal self-review

  // ── Clause 10: Improvement ──────────────────────────────────────────────────
  '10.1': 'partial', // Nonconformity and corrective action — when AI fails, corrects; not formally tracked
  '10.2': 'partial', // Continual improvement — continuously improves AI usage; informal

  // ── Annex A: AI Controls ─────────────────────────────────────────────────────
  // A.2 — AI Policies
  'A.2.2': 'no',       // AI policies and responsible use — no written policy
  'A.2.3': 'no',       // Communicating AI policies — no policy to communicate

  // A.3 — Internal Organization
  'A.3.2': 'partial',  // AI roles and responsibilities — Mark informally holds all AI roles; nothing documented
  'A.3.3': 'na',       // Reporting on AI to management — Mark IS management (sole operator; N/A)

  // A.4 — Resources for AI Systems
  'A.4.2': 'partial',  // Processes and infrastructure for AI systems — Claude API/subscriptions maintained; informal
  'A.4.3': 'partial',  // Data management for AI systems — careful about data in AI; no formal data management policy
  'A.4.4': 'partial',  // Tool and computing infrastructure management — manages AI tool subscriptions; informal

  // A.5 — Assessing Impacts
  'A.5.2': 'partial',  // Identification of impacts on individuals and communities — considers client impact; not formal

  // A.6 — AI System Life Cycle
  'A.6.1': 'partial',  // AI system lifecycle general — manages AI tools from adoption to use; no formal lifecycle
  'A.6.2': 'partial',  // Intended use documentation — intended use clear; not formally documented
  'A.6.3': 'no',       // AI system requirements — no formal requirements documentation for AI tools used
  'A.6.4': 'no',       // AI system performance requirements — no acceptance criteria defined
  'A.6.5': 'na',       // AI system design — using off-the-shelf AI tools; not designing AI systems
  'A.6.6': 'partial',  // Data acquisition and preparation — careful about data fed to AI; informal
  'A.6.7': 'na',       // AI model training — not training AI models
  'A.6.8': 'partial',  // Verification and validation — evaluates AI tools before adopting; reviews outputs; informal
  'A.6.9': 'partial',  // Operation and monitoring of AI systems — monitors AI quality informally
  'A.6.10': 'yes',     // Human oversight — Mark reviews ALL AI outputs before client delivery; strong control
  'A.6.11': 'na',      // AI system retirement/decommissioning — SaaS tools; retirement = cancel subscription

  // A.7 — Data for AI Systems
  'A.7.2': 'na',       // Data for AI development and testing — not developing/training AI models
  'A.7.3': 'partial',  // Data acquisition and sourcing — careful about data sources and licensing; informal
  'A.7.4': 'partial',  // Data quality management — ensures quality of data fed to AI; informal
  'A.7.5': 'no',       // Data provenance and lineage — no formal tracking

  // A.8 — Information for Interested Parties
  'A.8.2': 'partial',  // Transparency of AI systems — discloses AI use to clients when appropriate; informal
  'A.8.3': 'partial',  // Communication to users of AI systems — clients informed when AI is used; informal

  // A.9 — Use of AI Systems
  'A.9.2': 'yes',      // Responsible use — strong ethical commitment; only uses AI for legitimate purposes; vCISO ethic

  // A.10 — Third-Party Relationships
  'A.10.2': 'partial', // Management of supplier-provided AI systems — TPRA capability applied; informal
  'A.10.3': 'partial', // Customer and partner data in AI systems — careful about client data; no formal agreement
};

iso42001State.date = _date;
iso42001State.conductedBy = _assessor;
iso42001State.view = 'form';

// ── Navigate to NIST AI RMF form and render ──────────────────────────────────
setNav('nist_ai');
renderMain();

console.log('%c✓ Abbott Cyber — AI framework pre-population complete', 'color:#07B4D9;font-weight:bold');
console.log('  NIST AI RMF : 68 controls set  · Expected score ~30% (Elevated Risk)');
console.log('  ISO 42001   : 53 controls set  · Expected score ~33% (Elevated Risk)');
console.log('');
console.log('  Next steps:');
console.log('  1. Review the NIST AI RMF form — adjust any answers that don\'t fit');
console.log('  2. Click "Save Assessment" on the NIST form');
console.log('  3. Navigate to ISO 42001 in the nav');
console.log('  4. Click "Save Assessment" on the ISO form');
console.log('  5. Visit AI Readiness Hub to see the combined score');
