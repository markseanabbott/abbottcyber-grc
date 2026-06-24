// ============================================================
// M&A CYBER DUE DILIGENCE (ma_cdd.js)
// ============================================================

const MA_DEAL_TYPES = [
  'Strategic Acquisition','Financial Acquisition','Distressed Asset',
  'Merger','Minority Stake','Asset Purchase',
];

const MA_CATS = [
  {
    id:'gov', label:'Governance & Compliance', icon:'📋', color:'#1d4ed8',
    questions:[
      { id:'G1', text:'Documented Information Security Policy exists and is reviewed at least annually', weight:2, costBand:'Low', priority:'year1',
        note:'Look for a signed, dated policy with a change log showing annual review. Key sections: acceptable use, data classification, incident response, and access control. A policy that was written once and never updated is a gap.' },
      { id:'G2', text:'Target holds an active security certification (SOC 2 Type II, ISO 27001, PCI DSS, or HIPAA attestation)', weight:2, costBand:'Medium', priority:'strategic',
        note:'Request the current certificate or attestation letter. Check the scope — a SOC 2 covering a single product line may not include the systems being acquired. Type II (audit over time) is more rigorous than Type I (point-in-time).' },
      { id:'G3', text:'Dedicated security function or named security owner in role (CISO, Security Manager, or equivalent)', weight:2, costBand:'Low', priority:'year1',
        note:'Security should be someone\'s primary job, not an add-on to a generalist IT role. For small targets, a part-time CISO or vCISO arrangement is acceptable. Red flag: "the IT guy handles security" with no formal mandate.' },
      { id:'G4', text:'Target is subject to breach notification regulations (PIPEDA, GDPR, HIPAA, CCPA, or US state breach laws)', weight:1, costBand:null, priority:null, contextOnly:true,
        note:'Context only — determines whether a past or future breach triggers mandatory regulatory notifications and reporting timelines. Affects deal risk and post-close insurance obligations.' },
      { id:'G5', text:'No current or pending regulatory investigations, fines, or enforcement actions relating to data security or privacy', weight:3, costBand:'High', priority:'preclose', dealBreaker:'all',
        note:'Require a legal declaration and search publicly available regulatory databases (OPC Canada, SEC, FTC, ICO). Any active matter must be fully disclosed in the data room. Undisclosed regulatory action is a deal-breaker — it creates liability that transfers with the acquisition.' },
      { id:'G6', text:'Independent third-party security audit or penetration test completed within the last 24 months', weight:2, costBand:'Medium', priority:'year1',
        note:'Request the most recent report. Scope matters — a web application pen test alone may leave internal networks and cloud environments untested. Also look for a remediation log showing critical findings were closed, not just noted.' },
    ],
  },
  {
    id:'iam', label:'Identity, Access & Endpoint', icon:'🔐', color:'#7c3aed',
    questions:[
      { id:'I1', text:'Multi-Factor Authentication (MFA) enforced for all user accounts including remote access and admin portals', weight:3, costBand:'Low', priority:'preclose',
        note:'MFA should cover: corporate email, VPN/remote access, cloud consoles (AWS, Azure, GCP), and financial or admin systems. Ask for MFA enrollment rates — below 90% is a gap. "MFA available but not enforced" is a No, not a Partial.' },
      { id:'I2', text:'Privileged access managed through a PAM solution or equivalent — no shared or generic admin credentials in use', weight:3, costBand:'Medium', priority:'year1',
        note:'Red flags: shared "admin" or "root" accounts, credentials stored in spreadsheets or a shared password document, no audit log of privileged actions. A basic PAM approach can be a properly configured password manager with access controls — a standalone CyberArk is not required for smaller targets.' },
      { id:'I3', text:'Formal user lifecycle process (joiner / mover / leaver) with periodic access reviews documented', weight:2, costBand:'Low', priority:'year1',
        note:'Ask for a sample offboarding checklist. Check that departing employees are disabled in Active Directory/Entra within 24–48 hours. Access reviews should be documented — quarterly for privileged accounts, annual for standard users is the baseline.' },
      { id:'I4', text:'All endpoints protected by an Endpoint Detection & Response (EDR) solution with central management console', weight:2, costBand:'Medium', priority:'year1',
        note:'Antivirus is not EDR. EDR tools (CrowdStrike, SentinelOne, Microsoft Defender for Endpoint) have behavioural detection, threat hunting, and incident response capabilities. Request a screenshot of the EDR console showing endpoint coverage percentage.' },
      { id:'I5', text:'Documented patching policy with critical/high severity patches applied within defined SLA (≤30 days for critical)', weight:2, costBand:'Low', priority:'year1',
        note:'Request patching reports for the last 3 months. Focus on servers and internet-facing systems first. Unpatched critical CVEs on internet-facing systems are a pre-close red flag regardless of overall score.' },
      { id:'I6', text:'Remote access secured via VPN or Zero Trust — no direct RDP or SMB exposure to the public internet', weight:3, costBand:'Low', priority:'preclose', dealBreaker:'conservative',
        note:'Run a quick check: use Shodan.io or Censys to scan the target\'s public IP ranges for open RDP (port 3389) or SMB (port 445). Direct exposure to the internet is one of the most common ransomware entry vectors and should be closed pre-close.' },
      { id:'I7', text:'Email security controls active: DMARC, DKIM, SPF enforced; anti-phishing gateway in place', weight:2, costBand:'Low', priority:'year1',
        note:'Check MX Toolbox (mxtoolbox.com) using the target\'s domain — it\'s free and takes 30 seconds. DMARC should be at p=reject or p=quarantine enforcement, not p=none (monitoring only). Missing DKIM or SPF makes the domain spoofable.' },
      { id:'I8', text:'No standing shared or generic privileged credentials in use across systems or environments', weight:3, costBand:'Medium', priority:'preclose',
        note:'Common examples: shared "administrator" Windows local accounts across servers, a single root AWS access key shared by the dev team, a generic "admin" account on the firewall with no individual accountability. Any found should be inventoried and a remediation plan agreed pre-close.' },
    ],
  },
  {
    id:'data', label:'Data Protection & Cloud', icon:'🔒', color:'#0f766e',
    questions:[
      { id:'D1', text:'Data classification policy identifies and categorises sensitive data assets (PII, financial, health, IP, credentials)', weight:2, costBand:'Low', priority:'year1',
        note:'A data map or data flow diagram is the gold standard. At minimum there should be a documented list of where PII, financial data, IP, and credentials are stored and who has access. "We know where our data is" without documentation is a gap.' },
      { id:'D2', text:'Sensitive data encrypted at rest and in transit using current standards (AES-256, TLS 1.2+ minimum)', weight:3, costBand:'Medium', priority:'preclose',
        note:'Check: are databases encrypted at rest? Is data transmitted only over HTTPS/TLS? Are TLS certificates current and not self-signed in production? Partial credit applies if one direction (at-rest or in-transit) is covered but not both.' },
      { id:'D3', text:'Cloud environments configured to a documented security baseline (CIS Benchmarks or CSP-native security defaults)', weight:2, costBand:'Medium', priority:'year1',
        note:'Key checks: MFA on cloud console accounts, no public S3 buckets or Azure Blob Storage with open access, no overly permissive IAM policies, logging enabled. Request a cloud security posture report (CSPM output) if available. N/A if the target has no cloud presence.' },
      { id:'D4', text:'Backups taken regularly, tested for restorability, and stored offline or immutably (resistant to ransomware deletion)', weight:3, costBand:'Low', priority:'preclose',
        note:'Key question: can ransomware delete the backups? They should be either offline (disconnected media) or immutable (write-once S3, Azure Immutable Blob). Test evidence: a documented restore test in the last 12 months. Untested backups are not a backup strategy.' },
      { id:'D5', text:'Documented DR plan with tested and validated RTO/RPO targets', weight:2, costBand:'Low', priority:'year1',
        note:'RTO = how fast systems must be recovered. RPO = maximum acceptable data loss. Both should be documented, agreed with the business, and tested — not just estimated. Untested DR plans are extremely common and a significant post-close integration risk.' },
      { id:'D6', text:'Complete software and SaaS asset inventory maintained and regularly reconciled', weight:1, costBand:'Low', priority:'strategic',
        note:'An asset inventory should cover servers, workstations, network devices, and all SaaS applications. Shadow IT (tools staff use without IT approval) is a common gap. Integration complexity and licence costs map directly to this inventory — missing it creates post-close surprises.' },
      { id:'D7', text:'Critical third-party and vendor dependencies inventoried; key vendors risk-assessed and contractually bound to security obligations', weight:2, costBand:'Medium', priority:'year1',
        note:'Ask for a vendor list. Prioritise vendors with access to sensitive data or critical systems. Key contracts should include data processing agreements (DPAs), breach notification obligations, and right-to-audit clauses. Missing contracts for critical vendors is a risk.' },
    ],
  },
  {
    id:'incident', label:'Incident History & Response', icon:'🚨', color:'#dc2626',
    questions:[
      { id:'H1', text:'No material data breach, ransomware attack, or significant security incident in the last 3 years', weight:3, costBand:'High', priority:'preclose',
        note:'Three years is the standard lookback. A disclosed, remediated breach that demonstrably improved the target\'s security posture is NOT a deal-breaker — it requires the sub-questions below. The real concern is undisclosed incidents or ongoing threat actor presence (H2).' },
      { id:'H1a', text:'(If breach) Incident was disclosed to affected parties and regulators as legally required', weight:2, costBand:null, priority:'preclose', dealBreaker:'all', conditional:{ questionId:'H1', value:'no' },
        note:'Mandatory under PIPEDA (Canada), GDPR (EU), most US state laws, and HIPAA. Failure to notify is itself a separate regulatory violation — potentially creating ongoing legal liability that transfers with the deal.' },
      { id:'H1b', text:'(If breach) Root cause has been fully remediated and independently verified', weight:2, costBand:'Medium', priority:'preclose', dealBreaker:'moderate', conditional:{ questionId:'H1', value:'no' },
        note:'Root cause fix should be independently verified — via a follow-up penetration test, a remediation validation from the original tester, or an updated security audit. Self-attestation by management alone is not sufficient evidence.' },
      { id:'H1c', text:'(If breach) Security posture has materially improved since the incident (controls, process, staffing)', weight:2, costBand:'Medium', priority:'year1', conditional:{ questionId:'H1', value:'no' },
        note:'Positive indicators: security owner hired post-incident, MFA and EDR added, backup strategy overhauled, staff training introduced. A well-managed post-breach improvement program actually signals a more mature security culture than a company that has never been tested.' },
      { id:'H1d', text:'(If breach) No ongoing litigation or active regulatory action arising directly from the incident', weight:2, costBand:null, priority:'preclose', dealBreaker:'all', conditional:{ questionId:'H1', value:'no' },
        note:'Check court records (PACER for US federal cases), provincial/federal regulatory registries, and require a legal declaration in the data room. Active litigation creates contingent liabilities that affect deal valuation and may not be fully quantifiable pre-close.' },
      { id:'H2', text:'No undisclosed incidents, known active vulnerabilities under exploitation, or threat actor presence in environment', weight:3, costBand:'Significant', priority:'preclose', dealBreaker:'all',
        note:'This is the hard stop. An undisclosed incident or known active threat actor presence (e.g. ransomware precursor activity detected but not shared) invalidates the basis for the deal\'s risk assumptions. Immediate escalation to legal counsel is required — do not proceed without full disclosure and third-party forensic validation.' },
      { id:'H3', text:'Vulnerability scanning runs on a regular cadence; critical and high CVEs remediated within defined SLA', weight:2, costBand:'Medium', priority:'year1',
        note:'Request a sample scan report from the last 90 days. Look for critical and high CVEs, particularly on internet-facing systems. Scan cadence should be at least monthly. No scanning program at all is a significant gap — the target has no visibility into its own exposure.' },
      { id:'H4', text:'Documented IR plan with defined roles, tested procedures, and external contacts (legal, insurer, PR)', weight:2, costBand:'Low', priority:'year1',
        note:'A real IR plan names who declares an incident, who calls legal, who calls the insurer, and who handles communications. Tabletop exercises give confidence the plan works under pressure. A plan that has never been tested is better than nothing but not a strong positive.' },
      { id:'H5', text:'No end-of-life or vendor-unsupported software running in production environments', weight:2, costBand:'Medium', priority:'year1',
        note:'Common EOL risks: Windows Server 2012 (EOL Oct 2023), Windows 10 (EOL Oct 2025), SQL Server 2012 (EOL Jul 2022), end-of-life network hardware. EOL systems cannot receive security patches — they are permanent vulnerabilities that cannot be fully mitigated without replacement.' },
      { id:'H6', text:'Integration complexity is manageable — no undisclosed legacy systems, proprietary protocols, or material shadow IT', weight:1, costBand:null, priority:'strategic',
        note:'Ask for a systems inventory and network diagram. Red flags: mainframe systems, bespoke ERP with no support contract, large on-premise infrastructure in a cloud-first deal, or staff using unapproved tools for core business functions. Complexity here drives post-close integration cost.' },
      { id:'H7', text:'Employee security awareness training program in place with documented completion tracking', weight:1, costBand:'Low', priority:'strategic',
        note:'Training evidence: LMS completion logs, phishing simulation reports, or signed training acknowledgements. Annual training covering phishing, password hygiene, and data handling is the baseline. Quarterly phishing simulations are the gold standard. No program = high and persistent human risk.' },
    ],
  },
];

const MA_AI_QUESTIONS = [
  { id:'A1', text:'AI tools that process customer, employee, or regulated data are used under documented governance controls', weight:2, costBand:'Medium', priority:'year1',
    note:'AI tools processing regulated data include: ChatGPT/Claude/Copilot used with customer PII, AI-assisted CRM tools, AI-powered HR platforms. Governance controls means an approval process, documented data handling rules, and an audit trail of what was processed. "Staff use AI tools" without controls is a gap.' },
  { id:'A2', text:'Policy exists governing employee use of AI tools — including prohibition on uploading confidential data to unapproved services', weight:2, costBand:'Low', priority:'year1',
    note:'The most common AI risk is staff uploading confidential documents, customer PII, or proprietary IP into public AI tools (ChatGPT, etc.). A policy should name prohibited uses explicitly, have been communicated to all staff, and be enforced — not just documented.' },
  { id:'A3', text:'AI is not used in regulated processes (credit, hiring, clinical, safety-critical) without documented oversight and audit trail', weight:3, costBand:'High', priority:'preclose', dealBreaker:'conservative',
    note:'EU AI Act and emerging US/Canadian regulations treat AI in these use cases as high-risk. Using AI for hiring decisions, credit scoring, clinical recommendations, or safety-critical systems without documented human oversight creates regulatory and legal liability.' },
  { id:'A4', text:'No AI products or features developed by the target would be classified as high-risk under EU AI Act', weight:2, costBand:null, priority:'preclose',
    note:'EU AI Act applies if the target operates in the EU or sells to EU customers. High-risk AI systems (biometric ID, credit scoring, employment AI, education AI, critical infrastructure) require conformity assessments, human oversight, and extensive documentation before deployment. N/A if the target does not develop AI products.' },
  { id:'A5', text:'No known AI-related liability exposure (biased outputs, IP infringement from training data, harmful generated content)', weight:3, costBand:'High', priority:'preclose', dealBreaker:'moderate',
    note:'Known exposure areas: AI trained on copyrighted data without a license (NYT vs OpenAI-style claims), AI-generated content that caused reputational harm, biased AI outputs in regulated decisions (hiring, credit). Any known claims or complaints should be disclosed in the data room.' },
  { id:'A6', text:'Target has a documented AI incident response process covering model failure, prompt injection, and data exfiltration scenarios', weight:1, costBand:'Low', priority:'year1',
    note:'AI-specific incidents include: model producing harmful or biased output, prompt injection attack leading to data disclosure, AI vendor breach exposing training data or outputs. An AI-specific IR plan is still rare but increasingly expected by cyber insurers and regulators.' },
];

const MA_INS_QUESTIONS = [
  { id:'INS1', text:'Target holds active cyber liability insurance with current policy documentation available for review', weight:2, costBand:'Low', priority:'preclose',
    note:'Request the current declarations page and full policy document. Check: policy limits, deductible, coverage trigger (claims-made vs occurrence — claims-made is standard for cyber), named insured, and renewal date. An expired or lapsed policy means there is a coverage gap that may already exist.' },
  { id:'INS2', text:"Policy does NOT contain a change-of-control clause that would void or limit coverage at deal close", weight:3, costBand:null, priority:'preclose', dealBreaker:'all',
    note:'Change-of-control clauses are common in cyber policies. They may require the insurer to be notified of the acquisition and can void coverage or require a fresh application and underwriting at close. This must be reviewed by the acquiring company\'s insurance broker before the deal signs — not after.' },
  { id:'INS3', text:"Coverage limit is appropriate for the target's data footprint and regulatory exposure (not materially underinsured)", weight:2, costBand:'Low', priority:'year1',
    note:'Rule of thumb: coverage limit should represent 5–10% of annual revenue for companies with significant data exposure. A $1M limit for a company processing large volumes of PII or operating in regulated sectors is likely underinsured. Compare against breach cost benchmarks for the target\'s industry.' },
  { id:'INS4', text:'No known policy exclusions that would prevent a claim for the security gaps identified in this assessment', weight:2, costBand:null, priority:'year1',
    note:'Common exclusions to check: nation-state attack exclusion (increasingly asserted by insurers), prior known incidents exclusion (any gap identified here could be argued as "known"), war exclusion (Lloyd\'s of London has been actively asserting this). Review exclusions against the specific findings from this assessment.' },
];

const MA_LABOR_COSTS = {
  '<50':      { Low:[2000,5000],     Medium:[8000,20000],    High:[30000,80000],    Significant:[80000,200000]   },
  '50-250':   { Low:[5000,15000],    Medium:[20000,60000],   High:[75000,200000],   Significant:[200000,500000]  },
  '250-1000': { Low:[15000,40000],   Medium:[50000,150000],  High:[200000,500000],  Significant:[500000,1000000] },
  '1000+':    { Low:[40000,100000],  Medium:[150000,400000], High:[500000,1500000], Significant:[1000000,3000000]},
};

const MA_TOOLING = {
  I1: { name:'MFA (e.g. Entra ID / Duo / Okta)',                   perUserYear:[36,72],
        note:'~$3–6/user/mo. Often included in M365 Business Premium. Entra ID P1=$6, Duo Essentials=$3.' },
  I2: { name:'PAM (e.g. 1Password Business / BeyondTrust)',         perUserYear:[48,120],
        note:'SMB-tier: 1Password or Keeper ~$4/user/mo. Enterprise PAM (CyberArk, BeyondTrust) is significantly more.',
        manualAlt:'PAM gaps can be mitigated for SMB targets via operational controls: documented credential policy + business-grade password manager + quarterly access reviews. Toggle off tooling cost if a manual control approach is confirmed and documented in the POAM.' },
  I4: { name:'EDR (e.g. CrowdStrike / SentinelOne / Defender)',    perEndpointYear:[48,144],
        note:'CrowdStrike Falcon Go ~$60/endpoint/yr. Microsoft Defender for Endpoint Plan 1 is included with M365 Business Premium.' },
  I7: { name:'Email security (e.g. Defender / Proofpoint)',         perUserYear:[24,60],
        note:'Defender for Office 365 Plan 1 ~$2/user/mo. Proofpoint Essentials ~$3–5/user/mo. Often already bundled with M365.' },
  D3: { name:'CSPM (e.g. Defender for Cloud / Wiz)',                fixedYear:[1500,8000],
        note:'Defender for Cloud basic tier is free; enhanced ~$0.02/server/hr. Mid-market CSPM starts ~$1,500/yr. Enterprise tools (Wiz, Orca) exceed $10K. Mark N/A if target has no cloud presence.' },
  H3: { name:'Vulnerability scanner (e.g. Nessus Pro / Tenable)',  fixedYear:[1500,5000],
        note:'Nessus Professional ~$3,500/yr (unlimited internal assets). Tenable.io starts ~$2,500/yr for 65 assets. OpenVAS covers the gap at near-zero tooling cost for budget-sensitive situations.' },
};

const MA_HEADCOUNT = {
  '<50':      { users:25,   endpoints:30   },
  '50-250':   { users:150,  endpoints:175  },
  '250-1000': { users:600,  endpoints:700  },
  '1000+':    { users:1500, endpoints:1800 },
};

const MA_ANS_OPTS = [
  { value:'yes',     label:'Yes',     color:'#15803d', bg:'#f0fdf4', border:'#86efac' },
  { value:'partial', label:'Partial', color:'#b45309', bg:'#fffbeb', border:'#fde68a' },
  { value:'no',      label:'No',      color:'#dc2626', bg:'#fef2f2', border:'#fca5a5' },
  { value:'na',      label:'N/A',     color:'#7c3aed', bg:'#faf5ff', border:'#ddd6fe' },
  { value:'unknown', label:'Unknown', color:'#6b7280', bg:'#f9fafb', border:'#e5e7eb' },
];

const MA_DATA_SOURCES = ['Management questionnaire','Document review','On-site review','Technical scan','Third-party audit report'];
const MA_EMP_BANDS    = ['<50','50-250','250-1000','1000+'];
const MA_VALUE_BANDS  = ['<$1M','$1M–$10M','$10M–$50M','$50M–$250M','$250M+'];

// --- STATE ---

let maState = {
  view:'list', stepIdx:0, editId:null, list:[], listLoaded:false, saving:false,
  detailTab:'summary', expandedFindings:{},
  framing:{ target_name:'', deal_type:'', target_industry:'', target_employee_band:'',
            deal_value_band:'', risk_tolerance:'moderate', assessor:'', assessed_at:'',
            user_count:'', endpoint_count:'',
            data_sources:[], include_ai_screen:false, include_insurance_review:false },
  answers:{}, poamItems:{}, currentAssessment:null,
  pricingCatalog:{}, parentPricingCatalog:{}, pricingLoaded:false,
};

// --- HELPERS ---

function _maAllCats(framing) {
  const cats = [...MA_CATS];
  if (framing?.include_ai_screen)        cats.push({ id:'ai_screen', label:'AI Exposure Screen',      icon:'🤖', color:'#6d28d9', questions:MA_AI_QUESTIONS });
  if (framing?.include_insurance_review) cats.push({ id:'ins_review', label:'Cyber Insurance Review', icon:'🛡️', color:'#0369a1', questions:MA_INS_QUESTIONS });
  return cats;
}

function _maStepDefs(framing) {
  const s = [{ id:'framing', label:'Deal Framing' },{ id:'gov', label:'Governance' },{ id:'iam', label:'Identity & Access' },{ id:'data', label:'Data & Cloud' },{ id:'incident', label:'Incident History' }];
  if (framing?.include_ai_screen)        s.push({ id:'ai_screen', label:'AI Exposure' });
  if (framing?.include_insurance_review) s.push({ id:'ins_review', label:'Insurance' });
  return s;
}

function _maFmtK(n) {
  if (!n) return '$0';
  if (n >= 1000000) return '$' + (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + Math.round(n/1000) + 'K';
  return '$' + n.toLocaleString();
}

function _maCostRange(low, high) { return `${_maFmtK(low)} – ${_maFmtK(high)}`; }

// Maps M&A question IDs to Pricing Schedule tool_type tags
const MA_TOOL_TYPE_MAP = { I1:'mfa', I2:'pam', I4:'edr', I7:'email', D3:'cspm', H3:'vuln_scanner' };

// Resolves a tool definition:
//   1. Pricing Schedule catalog (own org → parent org via psGetForType)
//   2. Legacy ma_pricing JSONB on maState (deprecated, kept for backward compat)
//   3. MA_TOOLING hardcoded platform default
function maResolveTool(toolId) {
  const dflt = MA_TOOLING[toolId];
  if (!dflt) return null;
  // 1. Pricing Schedule (new — preferred)
  const toolType = MA_TOOL_TYPE_MAP[toolId];
  if (toolType && typeof psGetForType === 'function') {
    const ps = psGetForType(toolType);
    if (ps) {
      const resolved = { ...dflt, name: ps.name || dflt.name,
        source: ps.source, sourceLabel: ps.sourceLabel };
      // Pricing schedule rates are monthly → multiply × 12 for annual calcs
      const lo = (ps.rate_low  || 0) * 12;
      const hi = ((ps.rate_high > 0 ? ps.rate_high : ps.rate_low) || 0) * 12;
      if (ps.model === 'perUser')     { resolved.perUserYear = [lo, hi];     delete resolved.perEndpointYear; delete resolved.fixedYear; }
      if (ps.model === 'perEndpoint') { resolved.perEndpointYear = [lo, hi]; delete resolved.perUserYear;     delete resolved.fixedYear; }
      if (ps.model === 'fixed')       { resolved.fixedYear = [lo, hi];       delete resolved.perUserYear;     delete resolved.perEndpointYear; }
      resolved.oneTimeLow   = ps.one_time_low   || 0;
      resolved.oneTimeHigh  = ps.one_time_high  || ps.one_time_low || 0;
      resolved.oneTimeModel = ps.one_time_model || 'fixed';
      return resolved;
    }
  }
  // 2. Legacy ma_pricing JSONB (transitional fallback)
  const own    = (maState.pricingCatalog    || {})[toolId];
  const parent = (maState.parentPricingCatalog || {})[toolId];
  const over   = own || parent;
  if (over?.low > 0) {
    const resolved = { ...dflt, name: over.name || dflt.name,
      source: own ? 'org' : 'parent', sourceLabel: own ? currentOrg?.name : 'MSP' };
    const model = over.model || (dflt.perUserYear ? 'perUser' : dflt.perEndpointYear ? 'perEndpoint' : 'fixed');
    const hi = over.high > 0 ? over.high : over.low;
    if (model === 'perUser')     { resolved.perUserYear = [over.low, hi];     delete resolved.perEndpointYear; delete resolved.fixedYear; }
    if (model === 'perEndpoint') { resolved.perEndpointYear = [over.low, hi]; delete resolved.perUserYear;     delete resolved.fixedYear; }
    if (model === 'fixed')       { resolved.fixedYear = [over.low, hi];       delete resolved.perUserYear;     delete resolved.perEndpointYear; }
    return resolved;
  }
  // 3. Platform default
  return { ...dflt, source:'default', sourceLabel:'Platform default' };
}

// --- SCORING ---

function maCalcScore(answers, framing) {
  const allCats = _maAllCats(framing);
  let tw = 0, ts = 0;
  const catScores = {};
  for (const cat of allCats) {
    let cw = 0, cs = 0;
    for (const q of cat.questions) {
      if (q.contextOnly) continue;
      if (q.conditional && answers[q.conditional.questionId] !== q.conditional.value) continue;
      if (answers[q.id] === 'na') continue; // N/A excluded from scoring denominator
      const val = { yes:1, partial:0.5 }[answers[q.id]||'unknown'] || 0;
      cw += q.weight; cs += q.weight * val;
    }
    catScores[cat.id] = cw > 0 ? Math.round((cs/cw)*100) : null;
    tw += cw; ts += cs;
  }
  const score = tw > 0 ? Math.round((ts/tw)*100) : 0;
  const adj = framing?.risk_tolerance === 'conservative' ? 10 : framing?.risk_tolerance === 'aggressive' ? -10 : 0;
  const effective = Math.max(0, Math.min(100, score - adj));
  let rating, recommendation, ratingColor;
  if      (effective >= 75) { rating='Low Risk';      recommendation='Proceed';                              ratingColor='#15803d'; }
  else if (effective >= 50) { rating='Moderate Risk'; recommendation='Proceed with conditions';              ratingColor='#b45309'; }
  else if (effective >= 25) { rating='High Risk';     recommendation='Price adjustment + further diligence'; ratingColor='#dc2626'; }
  else                      { rating='Critical Risk'; recommendation='Material deal risk — pause';           ratingColor='#7f1d1d'; }
  return { score, effective, catScores, rating, recommendation, ratingColor, allCats };
}

function maGetDealBreakers(answers, framing) {
  const tol = framing?.risk_tolerance || 'moderate';
  const flags = [];
  for (const cat of _maAllCats(framing)) {
    for (const q of cat.questions) {
      if (!q.dealBreaker) continue;
      if (q.conditional && answers[q.conditional.questionId] !== q.conditional.value) continue;
      const ans = answers[q.id];
      if (!ans || ans === 'yes' || ans === 'na') continue;
      const applies = q.dealBreaker === 'all' ||
        (q.dealBreaker === 'conservative' && tol === 'conservative') ||
        (q.dealBreaker === 'moderate' && tol !== 'aggressive');
      if (applies) flags.push({ id:q.id, text:q.text, category:cat.label, answer:ans, color:cat.color });
    }
  }
  return flags;
}

function maCalcCosts(answers, framing) {
  const band     = framing?.target_employee_band || '50-250';
  const labor    = MA_LABOR_COSTS[band] || MA_LABOR_COSTS['50-250'];
  const bandHC   = MA_HEADCOUNT[band]   || MA_HEADCOUNT['50-250'];
  const uCount   = parseInt(framing?.user_count,     10) || 0;
  const eCount   = parseInt(framing?.endpoint_count, 10) || 0;
  const hc       = {
    users:     uCount || bandHC.users,
    endpoints: eCount || bandHC.endpoints,
    explicit:  !!(uCount || eCount),
  };
  const toolExcl = answers?._tooling_excludes || {};
  const mkBucket = () => ({ laborLow:0, laborHigh:0, toolLow:0, toolHigh:0, setupLow:0, setupHigh:0, items:[] });
  const result   = { preClose:mkBucket(), year1:mkBucket(), strategic:mkBucket() };
  for (const cat of _maAllCats(framing)) {
    for (const q of cat.questions) {
      if (q.contextOnly || !q.costBand || !q.priority) continue;
      if (q.conditional && answers[q.conditional.questionId] !== q.conditional.value) continue;
      const ans = answers[q.id] || 'unknown';
      if (ans === 'yes' || ans === 'na') continue;
      const lb   = labor[q.costBand] || labor['Low'];
      const tool = maResolveTool(q.id);
      let tLow = 0, tHigh = 0, sLow = 0, sHigh = 0, toolName = null, toolExcluded = false, toolSource = 'default';
      if (tool) {
        toolName   = tool.name;
        toolSource = tool.source || 'default';
        if (toolExcl[q.id]) {
          toolExcluded = true;
        } else {
          if (tool.perUserYear)          { tLow = tool.perUserYear[0]*hc.users;         tHigh = tool.perUserYear[1]*hc.users;         }
          else if (tool.perEndpointYear) { tLow = tool.perEndpointYear[0]*hc.endpoints; tHigh = tool.perEndpointYear[1]*hc.endpoints; }
          else if (tool.fixedYear)       { tLow = tool.fixedYear[0];                    tHigh = tool.fixedYear[1];                    }
          const otModel = tool.oneTimeModel || 'fixed';
          if (otModel === 'perUser')     { sLow = (tool.oneTimeLow||0)*hc.users;     sHigh = (tool.oneTimeHigh||0)*hc.users;     }
          else if (otModel === 'perEndpoint') { sLow = (tool.oneTimeLow||0)*hc.endpoints; sHigh = (tool.oneTimeHigh||0)*hc.endpoints; }
          else                           { sLow = tool.oneTimeLow||0;                sHigh = tool.oneTimeHigh||0;                }
        }
      }
      const bucket = ans === 'partial' ? 'year1' : (q.priority || 'year1');
      const dest = result[bucket] || result.year1;
      dest.laborLow  += lb[0]; dest.laborHigh  += lb[1];
      dest.toolLow   += tLow;  dest.toolHigh   += tHigh;
      dest.setupLow  += sLow;  dest.setupHigh  += sHigh;
      dest.items.push({ id:q.id, text:q.text, category:cat.label, answer:ans,
        laborLow:lb[0], laborHigh:lb[1], toolName, toolLow:tLow, toolHigh:tHigh,
        setupLow:sLow, setupHigh:sHigh,
        toolExcluded, toolSource, low:lb[0]+tLow, high:lb[1]+tHigh, priority:bucket });
    }
  }
  const sumLaborLow  = result.preClose.laborLow  + result.year1.laborLow  + result.strategic.laborLow;
  const sumLaborHigh = result.preClose.laborHigh + result.year1.laborHigh + result.strategic.laborHigh;
  const sumToolLow   = result.preClose.toolLow   + result.year1.toolLow   + result.strategic.toolLow;
  const sumToolHigh  = result.preClose.toolHigh  + result.year1.toolHigh  + result.strategic.toolHigh;
  const total = { laborLow:sumLaborLow, laborHigh:sumLaborHigh, toolLow:sumToolLow, toolHigh:sumToolHigh,
                  low:sumLaborLow+sumToolLow, high:sumLaborHigh+sumToolHigh };

  // 5-year schedule — implementation is one-time; licensing recurs each year tools are active
  // Pre-Close: preClose impl + preClose tools (year 1 of those licenses)
  // Year 1:    year1 impl + preClose tools + year1 tools
  // Year 2:    strategic impl + all tools
  // Year 3–5:  all tools recurring only
  const allToolLow  = sumToolLow;
  const allToolHigh = sumToolHigh;
  const pc = result.preClose, y1 = result.year1, st = result.strategic;
  const schedule = [
    { label:'Pre-Close',
      implLow:  pc.laborLow,  implHigh:  pc.laborHigh,
      setupLow: pc.setupLow,  setupHigh: pc.setupHigh,
      toolLow:  pc.toolLow,   toolHigh:  pc.toolHigh,
      rowLow:   pc.laborLow  + pc.setupLow  + pc.toolLow,
      rowHigh:  pc.laborHigh + pc.setupHigh + pc.toolHigh },
    { label:'Year 1',
      implLow:  y1.laborLow,  implHigh:  y1.laborHigh,
      setupLow: y1.setupLow,  setupHigh: y1.setupHigh,
      toolLow:  pc.toolLow  + y1.toolLow,  toolHigh: pc.toolHigh  + y1.toolHigh,
      rowLow:   y1.laborLow  + y1.setupLow  + pc.toolLow  + y1.toolLow,
      rowHigh:  y1.laborHigh + y1.setupHigh + pc.toolHigh + y1.toolHigh },
    { label:'Year 2',
      implLow:  st.laborLow,  implHigh:  st.laborHigh,
      setupLow: st.setupLow,  setupHigh: st.setupHigh,
      toolLow:  allToolLow,   toolHigh:  allToolHigh,
      rowLow:   st.laborLow  + st.setupLow  + allToolLow,
      rowHigh:  st.laborHigh + st.setupHigh + allToolHigh },
    { label:'Year 3', implLow:0, implHigh:0, setupLow:0, setupHigh:0, toolLow:allToolLow, toolHigh:allToolHigh, rowLow:allToolLow, rowHigh:allToolHigh },
    { label:'Year 4', implLow:0, implHigh:0, setupLow:0, setupHigh:0, toolLow:allToolLow, toolHigh:allToolHigh, rowLow:allToolLow, rowHigh:allToolHigh },
    { label:'Year 5', implLow:0, implHigh:0, setupLow:0, setupHigh:0, toolLow:allToolLow, toolHigh:allToolHigh, rowLow:allToolLow, rowHigh:allToolHigh },
  ];
  const fiveYearLow  = schedule.reduce((s,r)=>s+r.rowLow,  0);
  const fiveYearHigh = schedule.reduce((s,r)=>s+r.rowHigh, 0);

  return { ...result, total, hc, schedule, fiveYearLow, fiveYearHigh };
}

function maGetFindings(answers, framing) {
  const f = [];
  const pOrd = { preclose:0, year1:1, strategic:2 };
  for (const cat of _maAllCats(framing)) {
    for (const q of cat.questions) {
      if (q.contextOnly) continue;
      if (q.conditional && answers[q.conditional.questionId] !== q.conditional.value) continue;
      const ans = answers[q.id];
      if (!ans || ans === 'yes' || ans === 'na') continue;
      f.push({ id:q.id, text:q.text, note:q.note||'', category:cat.label, catColor:cat.color, answer:ans, weight:q.weight, priority:q.priority, isDealer:!!q.dealBreaker });
    }
  }
  return f.sort((a,b)=> a.isDealer!==b.isDealer ? (a.isDealer?-1:1) : b.weight-a.weight || (pOrd[a.priority]??3)-(pOrd[b.priority]??3));
}

// --- RENDER: LIST ---

function renderMACDD() {
  if (maState.view === 'wizard') return _renderMAWizard();
  if (maState.view === 'detail') return _renderMADetail();
  return _renderMAList();
}

function _renderMAList() {
  const list = maState.list || [];
  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">🤝 M&amp;A Cyber Due Diligence</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg?.name||'')} · ${list.length} assessment${list.length!==1?'s':''}</div>
    </div>
    <button class="btn btn-cyan" onclick="maNewAssessment()">+ New Assessment</button>
  </div>
  ${list.length === 0 ? `
    <div class="card" style="text-align:center;padding:2.5rem;color:var(--muted)">
      <div style="font-size:2rem;margin-bottom:0.5rem">🤝</div>
      <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px">No M&amp;A assessments yet</div>
      <div style="font-size:12px;margin-bottom:1.25rem">Start a new assessment to evaluate a target company's cybersecurity posture before close.</div>
      <button class="btn btn-cyan" onclick="maNewAssessment()">Start First Assessment</button>
    </div>` : `
    <div class="card" style="padding:0">
      ${list.map(a => {
        const scored = a.score != null && a.status === 'complete';
        const sCol = !scored ? '#6b7280' : a.score>=75 ? '#15803d' : a.score>=50 ? '#b45309' : '#dc2626';
        const tolMap = { conservative:'Conservative', moderate:'Moderate', aggressive:'Aggressive' };
        const tolCol = { conservative:'#dc2626', moderate:'#b45309', aggressive:'#15803d' }[a.risk_tolerance] || '#6b7280';
        return `
        <div style="display:flex;align-items:center;gap:12px;padding:11px 16px;border-bottom:1px solid var(--border);flex-wrap:wrap">
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:var(--text)">${escH(a.target_name)}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px">${escH(a.deal_type||'—')} · ${escH(a.target_industry||'—')} · ${a.assessed_at||'no date'}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
            <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;background:${tolCol}18;color:${tolCol};border:1px solid ${tolCol}40">${tolMap[a.risk_tolerance]||a.risk_tolerance||''}</span>
            ${scored?`<span style="font-size:15px;font-weight:800;color:${sCol}">${a.score}</span>`:''}
            <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;${a.status==='complete'?'background:#f0fdf4;color:#15803d;border:1px solid #86efac':'background:#f9fafb;color:#6b7280;border:1px solid #e5e7eb'}">${a.status==='complete'?'Complete':'Draft'}</span>
            <button class="btn btn-outline btn-sm" onclick="maViewAssessment('${a.id}')">View</button>
            <button class="btn btn-outline btn-sm" onclick="maEditAssessment('${a.id}')">Edit</button>
            <button class="btn btn-sm" style="background:#fee2e2;color:#b91c1c;border:1.5px solid #fca5a5" onclick="maDeleteAssessment('${a.id}','${escH(a.target_name)}')">✕</button>
          </div>
        </div>`;
      }).join('')}
    </div>`}`;
}

// --- RENDER: WIZARD ---

function _renderMAWizard() {
  const steps = _maStepDefs(maState.framing);
  const si = maState.stepIdx;
  const allCats = _maAllCats(maState.framing);
  let body = si === 0 ? _renderMAStep1() : _renderMAStepCat(allCats[si-1]);
  const pct = Math.round((si / steps.length) * 100);
  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:1rem">
    <button class="btn btn-outline btn-sm" onclick="maNavToList()">← All Assessments</button>
    <div style="flex:1;font-size:14px;font-weight:700">🤝 ${maState.editId?'Edit':'New'}: <em>${escH(maState.framing.target_name||'Untitled Target')}</em></div>
    <button class="btn btn-outline btn-sm" onclick="maSave('draft')" ${maState.saving?'disabled':''}>Save Draft</button>
  </div>
  <div style="display:flex;gap:4px;margin-bottom:1rem;overflow-x:auto;padding-bottom:2px">
    ${steps.map((s,i) => `
      <div onclick="maNavToStep(${i})" style="flex-shrink:0;padding:5px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;
        ${i===si?'background:var(--navy);color:#fff':i<si?'background:#e0f2fe;color:#0369a1':'background:#f1f5f9;color:#94a3b8'}">
        ${i+1}. ${s.label}
      </div>`).join('')}
  </div>
  <div style="height:4px;background:#e2e8f0;border-radius:2px;margin-bottom:1.25rem;overflow:hidden">
    <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--navy),var(--cyan));border-radius:2px;transition:width 0.3s"></div>
  </div>
  ${body}
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem;padding:12px 16px;background:#f8fafc;border-radius:10px;border:1px solid var(--border)">
    <button class="btn btn-outline" onclick="maPrev()" ${si===0?'disabled':''}>← Back</button>
    <div style="font-size:11px;color:var(--muted)">Step ${si+1} of ${steps.length}</div>
    ${si===steps.length-1
      ? `<button class="btn btn-cyan" onclick="maSave('complete')" ${maState.saving?'disabled':''}>Complete Assessment ✓</button>`
      : `<button class="btn btn-primary" onclick="maNext()">Next →</button>`}
  </div>`;
}

function _renderMAStep1() {
  const f = maState.framing;
  const industries = typeof ORG_INDUSTRIES !== 'undefined' ? ORG_INDUSTRIES : [];
  return `
  <div class="card">
    <div class="card-title">Deal Framing</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:1.25rem">Sets risk thresholds and cost estimates for the entire assessment. Not scored.</div>
    <div class="form-row">
      <div>
        <div class="field-lbl">Target company name *</div>
        <input type="text" value="${escH(f.target_name)}" placeholder="e.g. Maple Leaf Hotels Ltd" oninput="maFramingSet('target_name',this.value)"/>
      </div>
      <div>
        <div class="field-lbl">Deal type</div>
        <select onchange="maFramingSet('deal_type',this.value)">
          <option value="">— Select —</option>
          ${MA_DEAL_TYPES.map(t=>`<option value="${t}" ${f.deal_type===t?'selected':''}>${t}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div>
        <div class="field-lbl">Target industry</div>
        <select onchange="maFramingSet('target_industry',this.value)">
          <option value="">— Select —</option>
          ${industries.map(i=>`<option value="${i}" ${f.target_industry===i?'selected':''}>${i}</option>`).join('')}
        </select>
      </div>
      <div>
        <div class="field-lbl">Target employee count</div>
        <select onchange="maFramingSet('target_employee_band',this.value)">
          <option value="">— Select —</option>
          ${MA_EMP_BANDS.map(b=>`<option value="${b}" ${f.target_employee_band===b?'selected':''}>${b} employees</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div>
        <div class="field-lbl">Number of users <span style="font-weight:400;color:var(--muted)">(actual count)</span></div>
        <input type="number" min="1" value="${escH(f.user_count||'')}" placeholder="e.g. 85" oninput="maFramingSet('user_count',this.value)"
          style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:12px"/>
        <div style="font-size:10px;color:var(--muted);margin-top:3px">Total user accounts requiring licenses (MFA, PAM, email security)</div>
      </div>
      <div>
        <div class="field-lbl">Number of endpoints <span style="font-weight:400;color:var(--muted)">(actual count)</span></div>
        <input type="number" min="1" value="${escH(f.endpoint_count||'')}" placeholder="e.g. 92" oninput="maFramingSet('endpoint_count',this.value)"
          style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:12px"/>
        <div style="font-size:10px;color:var(--muted);margin-top:3px">Laptops, desktops, servers requiring EDR coverage</div>
      </div>
    </div>
    <div class="form-row">
      <div>
        <div class="field-lbl">Estimated deal value</div>
        <select onchange="maFramingSet('deal_value_band',this.value)">
          <option value="">— Optional —</option>
          ${MA_VALUE_BANDS.map(v=>`<option value="${v}" ${f.deal_value_band===v?'selected':''}>${v}</option>`).join('')}
        </select>
      </div>
      <div>
        <div class="field-lbl">Assessor</div>
        <input type="text" value="${escH(f.assessor)}" placeholder="Your name" oninput="maFramingSet('assessor',this.value)"/>
      </div>
    </div>
    <div class="form-row">
      <div>
        <div class="field-lbl">Assessment date</div>
        <input type="date" value="${f.assessed_at||''}" oninput="maFramingSet('assessed_at',this.value)"/>
      </div>
      <div></div>
    </div>

    <div style="margin-top:1.25rem">
      <div class="field-lbl">Acquirer risk tolerance</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Sets scoring thresholds and determines which gaps trigger deal-breaker flags.</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${[['conservative','Conservative','Stricter thresholds — material gaps are red flags','#dc2626'],
           ['moderate','Moderate','Standard M&A diligence thresholds','#b45309'],
           ['aggressive','Aggressive','Higher tolerance — acquirer accepts post-close remediation risk','#15803d']
          ].map(([val,lbl,desc,col])=>`
          <div onclick="maFramingSet('risk_tolerance','${val}')" style="cursor:pointer;flex:1;min-width:140px;padding:10px 14px;border-radius:8px;border:2px solid ${f.risk_tolerance===val?col:'var(--border)'};background:${f.risk_tolerance===val?col+'12':'#fff'}">
            <div style="font-size:12px;font-weight:700;color:${col}">${lbl}</div>
            <div style="font-size:10px;color:var(--muted);margin-top:2px">${desc}</div>
          </div>`).join('')}
      </div>
    </div>

    <div style="margin-top:1.25rem">
      <div class="field-lbl">Data sources used in this assessment</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
        ${MA_DATA_SOURCES.map(s=>`
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;padding:5px 10px;border-radius:6px;border:1px solid var(--border);background:${(f.data_sources||[]).includes(s)?'#e0f2fe':'#fff'}">
            <input type="checkbox" ${(f.data_sources||[]).includes(s)?'checked':''} onchange="maToggleDataSource('${escH(s)}')">${s}
          </label>`).join('')}
      </div>
    </div>

    <div style="margin-top:1.25rem;padding:12px 16px;background:#f8fafc;border-radius:8px;border:1px solid var(--border)">
      <div class="field-lbl" style="margin-bottom:8px">Optional add-ons</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:12px">
          <input type="checkbox" ${f.include_ai_screen?'checked':''} onchange="maToggleAddon('include_ai_screen',this.checked)">
          <div><strong>🤖 AI Exposure Screen</strong> (6 questions) — flags AI tool governance gaps, shadow AI risk, and EU AI Act exposure</div>
        </label>
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:12px">
          <input type="checkbox" ${f.include_insurance_review?'checked':''} onchange="maToggleAddon('include_insurance_review',this.checked)">
          <div><strong>🛡️ Cyber Insurance Review</strong> (4 questions) — checks change-of-control clauses, coverage adequacy, and known exclusions</div>
        </label>
      </div>
    </div>
  </div>`;
}

function _renderMAStepCat(cat) {
  if (!cat) return '<div class="card" style="padding:2rem;color:var(--muted)">Unknown step.</div>';
  const answers = maState.answers;
  const activeQs = cat.questions.filter(q => !q.conditional || answers[q.conditional.questionId] === q.conditional.value);
  const scored = activeQs.filter(q => !q.contextOnly);
  const answered = scored.filter(q => answers[q.id]).length;
  return `
  <div class="card">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:1rem">
      <span style="font-size:22px">${cat.icon}</span>
      <div>
        <div style="font-size:15px;font-weight:700">${cat.label}</div>
        <div style="font-size:11px;color:var(--muted)">${answered} of ${scored.length} answered</div>
      </div>
    </div>
    ${cat.questions.map(q => _renderMAQuestion(q, answers)).join('')}
  </div>`;
}

function _renderMAQuestion(q, answers) {
  if (q.conditional && answers[q.conditional.questionId] !== q.conditional.value) return '';
  const ans = answers[q.id] || '';
  const indent = q.conditional ? 'margin:6px 0 6px 20px;padding-left:12px;border-left:3px solid #e2e8f0' : 'margin:8px 0';
  return `
  <div style="${indent}">
    <div style="font-size:${q.conditional?'11px':'12px'};font-weight:${q.conditional?'600':'700'};color:${q.conditional?'var(--muted)':'var(--text)'}">
      ${q.dealBreaker?'<span style="font-size:9px;font-weight:800;color:#dc2626;padding:1px 5px;border-radius:3px;background:#fef2f2;border:1px solid #fca5a5;margin-right:4px">DEAL-BREAKER</span>':''}
      ${escH(q.text)}
    </div>
    ${!q.contextOnly && q.priority === 'preclose' ? `<div style="font-size:9px;color:#dc2626;font-weight:700;margin-top:2px">PRE-CLOSE priority</div>` : ''}
    ${q.contextOnly ? '<div style="font-size:10px;color:var(--muted);margin-top:2px">Context only — not scored. Calibrates findings for regulated data environments.</div>' : ''}
    ${q.note ? `<div style="font-size:10px;color:#5a6a8a;margin-top:4px;line-height:1.5;padding:5px 8px;background:#f8fafc;border-radius:5px;border-left:2px solid #cbd5e1">ℹ ${escH(q.note)}</div>` : ''}
    ${!q.contextOnly ? `
    <div style="display:flex;gap:6px;margin-top:7px;flex-wrap:wrap">
      ${MA_ANS_OPTS.map(opt=>`
        <button onclick="maSetAnswer('${q.id}','${opt.value}')"
          style="padding:4px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;border:1.5px solid ${ans===opt.value?opt.color:opt.border};background:${ans===opt.value?opt.bg:'#fff'};color:${ans===opt.value?opt.color:'#94a3b8'};transition:all 0.1s">
          ${opt.label}
        </button>`).join('')}
    </div>` : ''}
  </div>
  <div style="border-top:1px solid #f1f5f9;margin:6px 0"></div>`;
}

// --- RENDER: DETAIL ---

function _renderMADetail() {
  const a = maState.currentAssessment;
  if (!a) return '<div class="card" style="padding:2rem;color:var(--muted)">Assessment not found.</div>';
  const fr   = a.framing || {};
  const ans  = a.answers || {};
  const { score, catScores, rating, recommendation, ratingColor, allCats } = maCalcScore(ans, fr);
  const dealBreakers = maGetDealBreakers(ans, fr);
  const costs        = maCalcCosts(ans, fr);
  const findings     = maGetFindings(ans, fr);
  const sCol         = score>=75?'#15803d':score>=50?'#b45309':'#dc2626';
  const tolLabel     = { conservative:'Conservative', moderate:'Moderate', aggressive:'Aggressive' }[fr.risk_tolerance] || fr.risk_tolerance || '';
  const allCostItems = [...costs.preClose.items,...costs.year1.items,...costs.strategic.items];
  const tab          = maState.detailTab || 'summary';

  const tabs = [
    { id:'summary',  label:`Summary` },
    { id:'findings', label:`Findings (${findings.length})` },
    { id:'poam',     label:'POAM' },
    { id:'pricing',  label:'Cost Assumptions' },
  ];

  let tabBody = '';
  if (tab === 'summary')  tabBody = _renderMATabSummary(a, fr, ans, score, sCol, catScores, allCats, costs, dealBreakers, tolLabel, ratingColor, rating, recommendation);
  if (tab === 'findings') tabBody = _renderMATabFindings(findings, a);
  if (tab === 'poam')     tabBody = _renderMAPoam(a, findings, allCostItems);
  if (tab === 'pricing')  tabBody = _renderMATabPricing(costs, fr, ans);

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <button class="btn btn-outline btn-sm" onclick="maNavToList()">← All Assessments</button>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${a.status!=='complete'?`<button class="btn btn-primary btn-sm" onclick="maEditAssessment('${a.id}')">Edit Draft</button>`:''}
      ${a.status==='complete'&&!a.linked_org_id?`<button class="btn btn-cyan btn-sm" onclick="maShowAddEntity()">✚ Add as Entity</button>`:''}
      ${a.linked_org_id?`<span style="font-size:11px;font-weight:700;color:#15803d;padding:4px 10px;background:#f0fdf4;border-radius:6px;border:1px solid #86efac">✓ Entity linked</span>`:''}
      <button class="btn btn-outline btn-sm" onclick="maCopyPrompt()">Copy AI Prompt</button>
    </div>
  </div>

  <div class="card" style="background:linear-gradient(135deg,var(--navy),var(--navy2));color:#fff;margin-bottom:1rem">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <div style="font-size:20px;font-weight:800">${escH(fr.target_name||'Unnamed Target')}</div>
        <div style="font-size:12px;opacity:0.75;margin-top:4px">${[fr.deal_type,fr.target_industry,fr.deal_value_band].filter(Boolean).map(escH).join(' · ')}</div>
        <div style="font-size:11px;opacity:0.55;margin-top:2px">Assessed by ${escH(fr.assessor||'—')} · ${a.assessed_at||'no date'} · ${escH(fr.target_employee_band||'?')} employees</div>
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="text-align:center">
          <div style="font-size:38px;font-weight:800;color:${sCol}">${score}</div>
          <div style="font-size:9px;opacity:0.5;font-weight:700">/ 100</div>
        </div>
        <div>
          <div style="font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;background:${ratingColor}25;color:${ratingColor};border:1px solid ${ratingColor}60;margin-bottom:4px">${rating}</div>
          <div style="font-size:11px;opacity:0.8">${recommendation}</div>
          <div style="font-size:10px;opacity:0.45;margin-top:2px">Tolerance: ${tolLabel}</div>
        </div>
      </div>
    </div>
  </div>

  ${dealBreakers.length ? `
  <div class="card" style="border-left:4px solid #dc2626;background:#fef2f2;margin-bottom:1rem">
    <div style="font-size:13px;font-weight:700;color:#b91c1c;margin-bottom:6px">⚠️ Deal-Breaker Flags (${dealBreakers.length})</div>
    <div style="font-size:11px;color:#7f1d1d;margin-bottom:10px">Require resolution before deal close regardless of overall score.</div>
    ${dealBreakers.map(f=>`
      <div style="display:flex;gap:8px;padding:8px 0;border-top:1px solid #fca5a5">
        <span style="color:#dc2626;flex-shrink:0">●</span>
        <div>
          <div style="font-size:11px;font-weight:700;color:#b91c1c">${escH(f.text)}</div>
          <div style="font-size:10px;color:#7f1d1d;margin-top:2px">${escH(f.category)} · Answer: ${f.answer}</div>
        </div>
      </div>`).join('')}
  </div>` : score > 0 ? `
  <div class="card" style="border-left:4px solid #15803d;background:#f0fdf4;margin-bottom:1rem">
    <div style="font-size:12px;font-weight:700;color:#15803d">✓ No deal-breaker flags triggered at ${tolLabel} tolerance</div>
  </div>` : ''}

  <div class="view-tabs" style="margin-bottom:1rem">
    ${tabs.map(t=>`<div class="view-tab${tab===t.id?' active':''}" onclick="maSetDetailTab('${t.id}')">${t.label}</div>`).join('')}
  </div>

  ${tabBody}
  <div id="maAddEntityContainer"></div>`;
}

function _renderMATabSummary(a, fr, ans, score, sCol, catScores, allCats, costs, dealBreakers, tolLabel, ratingColor, rating, recommendation) {
  const dealMidMap = { '<$1M':500000,'$1M–$10M':5500000,'$10M–$50M':30000000,'$50M–$250M':150000000,'$250M+':300000000 };
  const dealMid    = fr.deal_value_band ? dealMidMap[fr.deal_value_band] : null;
  const cyberFactor = (dealMid && costs.total.low)
    ? { lo:((costs.total.low/dealMid)*100).toFixed(1), hi:((costs.total.high/dealMid)*100).toFixed(1) }
    : null;
  return `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
    <div class="card">
      <div class="card-title">Category Scores</div>
      ${allCats.map(cat=>{
        const s = catScores[cat.id];
        if (s === null || s === undefined) return '';
        const col = s>=75?'#15803d':s>=50?'#b45309':'#dc2626';
        return `<div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;margin-bottom:3px">
            <span>${cat.icon} ${cat.label}</span><span style="color:${col}">${s}%</span>
          </div>
          <div style="height:6px;background:#e2e8f0;border-radius:3px">
            <div style="height:100%;width:${s}%;background:${col};border-radius:3px"></div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div class="card">
      <div class="card-title">Cost to Remediate</div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:10px">Scaled to ${escH(fr.target_employee_band||'selected')} employee band (${costs.hc?.users||'?'} users / ${costs.hc?.endpoints||'?'} endpoints).</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px;font-size:11px">
        ${[['Pre-Close',costs.preClose,'#dc2626','#fef2f2'],['Year 1',costs.year1,'#b45309','#fffbeb'],['Strategic',costs.strategic,'#6b7280','#f9fafb']].map(([lbl,bkt,col,bg])=>
          !bkt.items.length ? '' : `
          <div style="grid-column:1/-1;padding:8px 10px;background:${bg};border-radius:6px;border-left:3px solid ${col}">
            <div style="font-size:10px;font-weight:700;color:${col};margin-bottom:4px">${lbl} (${bkt.items.length} item${bkt.items.length!==1?'s':''})</div>
            <div style="display:flex;justify-content:space-between">
              <div>
                <div style="font-size:9px;color:var(--muted)">One-time</div>
                <div style="font-size:11px;font-weight:700;color:${col}">${_maCostRange(bkt.laborLow,bkt.laborHigh)}</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:9px;color:var(--muted)">Annual licensing</div>
                <div style="font-size:11px;font-weight:700;color:${col}">${bkt.toolLow > 0 ? _maCostRange(bkt.toolLow,bkt.toolHigh)+'/yr' : '—'}</div>
              </div>
            </div>
          </div>`).join('')}
      </div>
      <div style="border-top:2px solid var(--border);padding-top:10px">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px">
          <span style="color:var(--muted)">Total one-time implementation</span>
          <span style="font-weight:700">${_maCostRange(costs.total.laborLow,costs.total.laborHigh)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:8px">
          <span style="color:var(--muted)">Total annual licensing</span>
          <span style="font-weight:700">${costs.total.toolLow > 0 ? _maCostRange(costs.total.toolLow,costs.total.toolHigh)+'/yr' : '—'}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;color:var(--text);padding-top:6px;border-top:1px solid var(--border)">
          <span>Total (Year 1 all-in)</span>
          <span>${_maCostRange(costs.total.low,costs.total.high)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0369a1;padding-top:5px">
          <span>5-Year Total Cost</span>
          <span>${_maCostRange(costs.fiveYearLow,costs.fiveYearHigh)}</span>
        </div>
      </div>
      ${cyberFactor ? `
      <div style="margin-top:10px;padding:8px 10px;background:#e0f2fe;border-radius:6px">
        <div style="font-size:10px;font-weight:700;color:#0369a1">Cyber Discount Factor</div>
        <div style="font-size:14px;font-weight:800;color:#0369a1">${cyberFactor.lo}% – ${cyberFactor.hi}% of deal value</div>
        <div style="font-size:9px;color:#0369a1;opacity:0.7">Year-1 all-in remediation as % of ${escH(fr.deal_value_band)}</div>
      </div>` : ''}
    </div>
  </div>`;
}

function _renderMATabFindings(findings, a) {
  if (!findings.length) return `<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">No findings — all answered questions passed.</div>`;
  const pOrd = { preclose:'Pre-Close', year1:'Year 1', strategic:'Strategic (Yr 2+)' };
  const expanded = maState.expandedFindings || {};
  return `
  <div class="card" style="padding:0;margin-bottom:1rem">
    <div style="display:flex;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border)">
      <div style="font-size:13px;font-weight:700">${findings.length} Findings</div>
      <button class="btn btn-outline btn-sm" onclick="maFindingsSave('${a.id}')">Save Observations</button>
    </div>
    ${findings.map(f=>{
      const wLbl = f.weight>=3?'High':f.weight>=2?'Medium':'Low';
      const wCol = f.weight>=3?'#dc2626':f.weight>=2?'#b45309':'#6b7280';
      const isOpen = !!expanded[f.id];
      const p = (maState.poamItems||{})[f.id] || {};
      return `
      <div style="border-bottom:1px solid #f1f5f9">
        <div onclick="maToggleFinding('${f.id}')" style="display:flex;align-items:flex-start;gap:10px;padding:10px 16px;cursor:pointer;${isOpen?'background:#f8fafc':''}">
          <div style="flex-shrink:0;margin-top:2px">
            ${f.isDealer
              ? `<span style="font-size:9px;font-weight:800;color:#dc2626;padding:2px 6px;background:#fef2f2;border-radius:4px;border:1px solid #fca5a5">DEAL-BREAKER</span>`
              : `<span style="font-size:9px;font-weight:700;color:${wCol};padding:2px 6px;background:${wCol}12;border-radius:4px">${wLbl}</span>`}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:11px;font-weight:700;color:var(--text)">${escH(f.text)}</div>
            <div style="font-size:10px;color:var(--muted);margin-top:2px">${escH(f.category)} · Answer: <strong>${f.answer}</strong> · ${pOrd[f.priority]||'—'}</div>
          </div>
          <span style="color:var(--muted);font-size:11px;flex-shrink:0;margin-left:6px">${isOpen?'▲':'▼'}</span>
        </div>
        ${isOpen ? `
        <div style="padding:12px 16px 16px;background:#f8fafc;border-top:1px solid #e2e8f0">
          ${f.note ? `
          <div style="margin-bottom:12px;padding:8px 12px;background:#fff;border-radius:6px;border-left:3px solid #94a3b8">
            <div style="font-size:10px;font-weight:700;color:#475569;margin-bottom:3px">ℹ WHY THIS MATTERS</div>
            <div style="font-size:11px;color:#334155;line-height:1.6">${escH(f.note)}</div>
          </div>` : ''}
          <div style="margin-bottom:10px">
            <div style="font-size:10px;font-weight:700;color:var(--muted);margin-bottom:4px">ASSESSOR OBSERVATION</div>
            <textarea placeholder="What did you find? Note specific evidence, documents reviewed, or gaps confirmed…"
              style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px;font-size:11px;font-family:inherit;resize:vertical;min-height:70px"
              onchange="maPoamField('${f.id}','observation',this.value)">${escH(p.observation||'')}</textarea>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--muted);margin-bottom:4px">RECOMMENDED ACTION</div>
            <textarea placeholder="What should the acquirer or target do to remediate this gap?"
              style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:6px;font-size:11px;font-family:inherit;resize:vertical;min-height:55px"
              onchange="maPoamField('${f.id}','recommendation',this.value)">${escH(p.recommendation||'')}</textarea>
          </div>
        </div>` : ''}
      </div>`;
    }).join('')}
  </div>`;
}

function _renderMAPoam(a, findings, allCostItems) {
  const rows = findings.filter(f => f.priority);
  if (!rows.length) return `<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">No findings to track.</div>`;
  const pOrd = { preclose:'Pre-Close', year1:'Year 1', strategic:'Strategic (Yr 2+)' };
  const pCol = { preclose:'#dc2626', year1:'#b45309', strategic:'#6b7280' };
  const DECISIONS = ['Remediate','Accept Risk','Transfer (Insurance)','Defer','Exclude'];
  return `
  <div class="card" style="margin-bottom:1rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
      <div class="card-title" style="margin:0">Plan of Action &amp; Milestones (POAM)</div>
      <button class="btn btn-outline btn-sm" onclick="maPoamSave('${a.id}')">Save POAM</button>
    </div>
    <div style="font-size:10px;color:var(--muted);margin-bottom:10px">Decisions: <strong>Remediate</strong> = fix it. <strong>Accept Risk</strong> = document and own it. <strong>Transfer</strong> = insure it. <strong>Defer</strong> = post-close Year 2+. <strong>Exclude</strong> = remove from report scope.</div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead>
          <tr style="background:#f8fafc">
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:200px">Finding</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700">Priority</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:110px">Assigned To</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:100px">Target Date</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700;min-width:150px">Decision</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700">Cost Est.</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((f,i)=>{
            const p   = (maState.poamItems||{})[f.id] || {};
            const ci  = allCostItems.find(x => x.id === f.id);
            const col = f.weight>=3?'#dc2626':f.weight>=2?'#b45309':'#6b7280';
            const decCol = { 'Remediate':'#15803d','Accept Risk':'#b45309','Transfer (Insurance)':'#0369a1','Defer':'#6b7280','Exclude':'#9ca3af' }[p.decision] || '';
            return `
            <tr style="border-bottom:1px solid #f1f5f9;${i%2?'background:#fafafa':''}">
              <td style="padding:6px 8px;vertical-align:top">
                <div style="font-weight:600;color:${f.isDealer?'#dc2626':col}">${f.isDealer?'⚠ ':''}${escH(f.text)}</div>
                <div style="color:var(--muted);font-size:10px">${f.id} · ${f.answer}</div>
                ${p.observation ? `<div style="font-size:10px;color:#334155;margin-top:3px;font-style:italic">"${escH(p.observation.substring(0,120))}${p.observation.length>120?'…':''}"</div>` : ''}
              </td>
              <td style="padding:6px 8px;vertical-align:top">
                <span style="font-size:10px;font-weight:700;color:${pCol[f.priority]||'#6b7280'};padding:2px 7px;background:${(pCol[f.priority]||'#6b7280')}12;border-radius:4px">${pOrd[f.priority]||''}</span>
              </td>
              <td style="padding:6px 8px;vertical-align:top">
                <input type="text" value="${escH(p.assignedTo||'')}" placeholder="Owner"
                  style="width:100%;padding:3px 6px;border:1px solid var(--border);border-radius:4px;font-size:11px"
                  onchange="maPoamField('${f.id}','assignedTo',this.value)"/>
              </td>
              <td style="padding:6px 8px;vertical-align:top">
                <input type="date" value="${p.targetDate||''}"
                  style="width:100%;padding:3px 6px;border:1px solid var(--border);border-radius:4px;font-size:11px"
                  onchange="maPoamField('${f.id}','targetDate',this.value)"/>
              </td>
              <td style="padding:6px 8px;vertical-align:top">
                <select style="width:100%;padding:3px 6px;border:1.5px solid ${decCol||'var(--border)'};border-radius:4px;font-size:11px;color:${decCol||'inherit'};font-weight:${decCol?'700':'400'}"
                  onchange="maPoamField('${f.id}','decision',this.value)">
                  <option value="">— Select —</option>
                  ${DECISIONS.map(d=>`<option value="${d}" ${p.decision===d?'selected':''}>${d}</option>`).join('')}
                </select>
              </td>
              <td style="padding:6px 8px;vertical-align:top">
                ${ci ? `
                <div style="font-size:10px;font-weight:700">${_maCostRange(ci.laborLow,ci.laborHigh)}</div>
                ${ci.toolLow > 0 && !ci.toolExcluded ? `<div style="font-size:9px;color:#0369a1">+${_maCostRange(ci.toolLow,ci.toolHigh)}/yr</div>` : ''}` : '—'}
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function _renderMATabPricing(costs, fr, ans) {
  const band     = fr.target_employee_band || '50-250';
  const hc       = costs.hc;
  const excludes = ans._tooling_excludes || {};
  const a        = maState.currentAssessment;

  const allItems = [...costs.preClose.items,...costs.year1.items,...costs.strategic.items];
  const toolRows = Object.entries(MA_TOOLING).map(([qId]) => {
    const tool      = maResolveTool(qId);
    if (!tool) return null;
    const matchItem = allItems.find(i => i.id === qId);
    const excluded  = !!excludes[qId];
    let unitModel = '', unitCount = 0, unitAnnual = 0, unitHigh = 0;
    if (tool.perUserYear)          { unitModel = `$${tool.perUserYear[0]}–${tool.perUserYear[1]}/user/yr`;           unitCount = hc.users;     unitAnnual = tool.perUserYear[0]*hc.users;         unitHigh = tool.perUserYear[1]*hc.users; }
    else if (tool.perEndpointYear) { unitModel = `$${tool.perEndpointYear[0]}–${tool.perEndpointYear[1]}/device/yr`; unitCount = hc.endpoints; unitAnnual = tool.perEndpointYear[0]*hc.endpoints;  unitHigh = tool.perEndpointYear[1]*hc.endpoints; }
    else if (tool.fixedYear)       { unitModel = `fixed/yr`; unitCount = 1; unitAnnual = tool.fixedYear[0]; unitHigh = tool.fixedYear[1]; }
    const applicable = !!matchItem;
    return { qId, tool, excluded, unitModel, unitCount, unitAnnual, unitHigh, applicable };
  }).filter(Boolean);

  const fiveYearLow  = costs.fiveYearLow  || 0;
  const fiveYearHigh = costs.fiveYearHigh || 0;
  const schedule     = costs.schedule     || [];

  return `
  <div class="card" style="margin-bottom:1rem">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <div class="card-title" style="margin:0">5-Year Cost Schedule</div>
    </div>
    <div style="font-size:10px;color:var(--muted);margin-bottom:10px">
      One-time implementation costs appear in the year they are expected. Licensing costs recur annually from the year each tool is deployed.
    </div>
    <div style="overflow-x:auto;margin-bottom:4px">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead>
          <tr style="background:#f8fafc">
            <th style="text-align:left;padding:6px 10px;border-bottom:2px solid var(--border);font-weight:700">Period</th>
            <th style="text-align:right;padding:6px 10px;border-bottom:2px solid var(--border);font-weight:700">One-time impl.</th>
            <th style="text-align:right;padding:6px 10px;border-bottom:2px solid var(--border);font-weight:700">Vendor setup</th>
            <th style="text-align:right;padding:6px 10px;border-bottom:2px solid var(--border);font-weight:700">Monthly licensing</th>
            <th style="text-align:right;padding:6px 10px;border-bottom:2px solid var(--border);font-weight:700;color:#0369a1">Period total</th>
          </tr>
        </thead>
        <tbody>
          ${schedule.map((row,i)=>{
            const isPreClose = row.label === 'Pre-Close';
            const hasImpl    = row.implLow  > 0;
            const hasSetup   = row.setupLow > 0;
            const hasTool    = row.toolLow  > 0;
            return `
            <tr style="border-bottom:1px solid #f1f5f9;${i%2?'background:#fafafa':''}">
              <td style="padding:7px 10px;font-weight:${isPreClose?'800':'600'};color:${isPreClose?'#dc2626':'var(--text)'}">
                ${isPreClose?'⚡ ':''}${row.label}
              </td>
              <td style="padding:7px 10px;text-align:right;color:${hasImpl?'#b45309':'var(--muted)'}">
                ${hasImpl ? _maCostRange(row.implLow,row.implHigh) : '—'}
              </td>
              <td style="padding:7px 10px;text-align:right;color:${hasSetup?'#7c3aed':'var(--muted)'}">
                ${hasSetup ? _maCostRange(row.setupLow,row.setupHigh) : '—'}
              </td>
              <td style="padding:7px 10px;text-align:right;color:${hasTool?'#0369a1':'var(--muted)'}">
                ${hasTool ? _maCostRange(row.toolLow,row.toolHigh)+'/mo×12' : '—'}
              </td>
              <td style="padding:7px 10px;text-align:right;font-weight:700">
                ${row.rowLow > 0 ? _maCostRange(row.rowLow,row.rowHigh) : '—'}
              </td>
            </tr>`;
          }).join('')}
        </tbody>
        <tfoot>
          <tr style="background:#eff6ff;border-top:2px solid #bfdbfe">
            <td colspan="4" style="padding:8px 10px;font-weight:800;color:#1e40af">5-Year Total</td>
            <td style="padding:8px 10px;text-align:right;font-weight:800;color:#1e40af;font-size:13px">${_maCostRange(fiveYearLow,fiveYearHigh)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div style="font-size:10px;color:var(--muted);margin-bottom:1.25rem">* Licensing costs held flat — excludes inflation, headcount growth, and any new tool deployments.</div>
  </div>

  <div class="card" style="margin-bottom:1rem">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
      <div class="card-title" style="margin:0">Cost Assumptions — Tooling</div>
      <button class="btn btn-outline btn-sm" onclick="maPricingSave('${a?.id||''}')">Save Assumptions</button>
    </div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:4px">
      Employee band: <strong>${escH(band)}</strong> ·
      <span style="color:${hc.explicit?'#15803d':'#b45309'}">
        ${hc.explicit
          ? `<strong style="color:#15803d">✓ ${hc.users} users / ${hc.endpoints} endpoints</strong> (entered in framing)`
          : `${hc.users} users / ${hc.endpoints} endpoints <em>(estimated from band — enter actual counts in framing for precise pricing)</em>`}
      </span>
    </div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:12px">
      Toggle off tools where manual controls are sufficient or the tool is already licensed. Excluded tools remove the licensing cost from the estimate (labor cost remains).
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead>
          <tr style="background:#f8fafc">
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700">Tool</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700">Rate</th>
            <th style="text-align:right;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700">Annual est.</th>
            <th style="text-align:center;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700">Applies</th>
            <th style="text-align:center;padding:6px 8px;border-bottom:2px solid var(--border);font-weight:700">Include</th>
          </tr>
        </thead>
        <tbody>
          ${toolRows.map((r,i)=>`
          <tr style="border-bottom:1px solid #f1f5f9;${i%2?'background:#fafafa':''}${!r.applicable?' opacity:0.45':''}">
            <td style="padding:7px 8px;vertical-align:top">
              <div style="font-weight:700;${r.excluded?'text-decoration:line-through;color:var(--muted)':''}">${escH(r.tool.name)}</div>
              <div style="display:flex;align-items:center;gap:6px;margin-top:2px">
                <span style="font-size:10px;color:var(--muted)">${escH(r.qId)}</span>
                ${r.tool.source === 'org'    ? `<span style="font-size:9px;font-weight:700;color:#0369a1;padding:1px 5px;background:#e0f2fe;border-radius:3px">Custom</span>` : ''}
                ${r.tool.source === 'parent' ? `<span style="font-size:9px;font-weight:700;color:#7c3aed;padding:1px 5px;background:#faf5ff;border-radius:3px">MSP</span>` : ''}
              </div>
              <div style="font-size:10px;color:var(--muted);margin-top:2px">${r.tool.note ? escH(r.tool.note) : ''}</div>
              ${(r.tool.oneTimeLow > 0 && !r.excluded) ? `<div style="font-size:10px;color:#7c3aed;margin-top:2px">⚡ One-time: ${_maCostRange(r.tool.oneTimeLow, r.tool.oneTimeHigh)}${r.tool.oneTimeModel==='perUser'?' / user':r.tool.oneTimeModel==='perEndpoint'?' / device':''}</div>` : ''}
              ${r.tool.manualAlt && !r.excluded ? `<div style="font-size:10px;color:#0369a1;margin-top:4px;padding:4px 7px;background:#e0f2fe;border-radius:4px">${escH(r.tool.manualAlt)}</div>` : ''}
            </td>
            <td style="padding:7px 8px;vertical-align:top;color:var(--muted);white-space:nowrap">${r.unitModel}${r.unitCount>1?' × '+r.unitCount:''}</td>
            <td style="padding:7px 8px;vertical-align:top;text-align:right;font-weight:700;${r.excluded?'color:var(--muted);text-decoration:line-through':''}">
              ${_maCostRange(r.unitAnnual,r.unitHigh)}${r.excluded?'':'/yr'}
              ${(!r.excluded && r.tool.source !== 'default' && r.unitAnnual > 0) ? `<div style="font-size:9px;color:var(--muted)">~$${Math.round(r.unitAnnual/12/Math.max(r.unitCount,1))}/unit/mo × ${r.unitCount}</div>` : ''}
            </td>
            <td style="padding:7px 8px;vertical-align:top;text-align:center">
              ${r.applicable
                ? `<span style="font-size:10px;font-weight:700;color:#15803d;padding:2px 7px;background:#f0fdf4;border-radius:4px;border:1px solid #86efac">Gap found</span>`
                : `<span style="font-size:10px;color:var(--muted)">Not triggered</span>`}
            </td>
            <td style="padding:7px 8px;vertical-align:top;text-align:center">
              <label style="display:inline-flex;align-items:center;cursor:pointer">
                <input type="checkbox" ${!r.excluded?'checked':''} onchange="maToggleTooling('${r.qId}',!this.checked)"
                  style="width:15px;height:15px;cursor:pointer"/>
              </label>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="margin-top:12px;padding:10px 12px;background:#fffbeb;border-radius:6px;border:1px solid #fde68a;font-size:11px;color:#92400e">
      <strong>Note on PAM:</strong> Privileged Access Management gaps can be mitigated for SMB targets through operational controls — documented credential policy, a business-grade password manager (1Password/Keeper, ~$4/user/mo), and quarterly access reviews. If the target agrees to this approach and it is documented in the POAM, toggle off the PAM tooling cost above.
    </div>
  </div>`;
}

// --- ACTIONS ---

function maSetDetailTab(tab) {
  maState.detailTab = tab;
  document.getElementById('mainContent').innerHTML = renderMACDD();
}

function maToggleFinding(id) {
  if (!maState.expandedFindings) maState.expandedFindings = {};
  maState.expandedFindings[id] = !maState.expandedFindings[id];
  document.getElementById('mainContent').innerHTML = renderMACDD();
}

function maToggleTooling(qId, exclude) {
  const a = maState.currentAssessment;
  if (!a) return;
  if (!a.answers) a.answers = {};
  if (!a.answers._tooling_excludes) a.answers._tooling_excludes = {};
  if (exclude) a.answers._tooling_excludes[qId] = true;
  else delete a.answers._tooling_excludes[qId];
  document.getElementById('mainContent').innerHTML = renderMACDD();
}

async function maPricingSave(assessmentId) {
  const a = maState.currentAssessment;
  if (!a || !assessmentId) return;
  const recalc = maCalcCosts(a.answers || {}, a.framing || {});
  try {
    await sbFetch(`ma_assessments?id=eq.${assessmentId}`, 'PATCH', {
      answers: a.answers,
      total_cost_low: recalc.total.low, total_cost_high: recalc.total.high,
    });
    const idx = maState.list.findIndex(x => x.id === assessmentId);
    if (idx >= 0) { maState.list[idx].answers = a.answers; maState.list[idx].total_cost_low = recalc.total.low; maState.list[idx].total_cost_high = recalc.total.high; }
    toast('Cost assumptions saved ✓', '#15803d');
  } catch (e) { toast('Save failed', '#dc2626'); }
}

async function maFindingsSave(assessmentId) {
  await maPoamSave(assessmentId);
}

function maNavToList() {
  maState.view = 'list'; maState.currentAssessment = null;
  maState.detailTab = 'summary'; maState.expandedFindings = {};
  document.getElementById('mainContent').innerHTML = renderMACDD();
}

function maNavToStep(idx) { maState.stepIdx = idx; document.getElementById('mainContent').innerHTML = renderMACDD(); }
function maNext() {
  const steps = _maStepDefs(maState.framing);
  if (maState.stepIdx < steps.length - 1) { maState.stepIdx++; document.getElementById('mainContent').innerHTML = renderMACDD(); window.scrollTo(0,0); }
}
function maPrev() {
  if (maState.stepIdx > 0) { maState.stepIdx--; document.getElementById('mainContent').innerHTML = renderMACDD(); window.scrollTo(0,0); }
}

function maNewAssessment() {
  maState.view = 'wizard'; maState.editId = null; maState.stepIdx = 0;
  maState.framing = { target_name:'', deal_type:'', target_industry:'', target_employee_band:'',
    deal_value_band:'', risk_tolerance:'moderate', assessor:'', assessed_at:'',
    data_sources:[], include_ai_screen:false, include_insurance_review:false };
  maState.answers = {}; maState.poamItems = {};
  document.getElementById('mainContent').innerHTML = renderMACDD();
}

function maEditAssessment(id) {
  const a = maState.list.find(x => x.id === id);
  if (!a) return;
  maState.view = 'wizard'; maState.editId = id; maState.stepIdx = 0;
  maState.framing = { ...(a.framing || {}) };
  maState.answers = Object.fromEntries(Object.entries(a.answers||{}).filter(([k])=>!k.startsWith('_')));
  maState.poamItems = a.answers?._poam || {};
  document.getElementById('mainContent').innerHTML = renderMACDD();
}

function maViewAssessment(id) {
  const a = maState.list.find(x => x.id === id);
  if (!a) return;
  maState.view = 'detail'; maState.currentAssessment = a;
  maState.poamItems = a.answers?._poam || {};
  document.getElementById('mainContent').innerHTML = renderMACDD();
}

function maFramingSet(field, value) {
  maState.framing[field] = value;
  if (['risk_tolerance','include_ai_screen','include_insurance_review'].includes(field)) {
    document.getElementById('mainContent').innerHTML = renderMACDD();
  }
}

function maToggleDataSource(val) {
  const ds = maState.framing.data_sources || [];
  const i = ds.indexOf(val);
  if (i >= 0) ds.splice(i,1); else ds.push(val);
  maState.framing.data_sources = ds;
}

function maToggleAddon(field, val) {
  maState.framing[field] = val;
  document.getElementById('mainContent').innerHTML = renderMACDD();
}

function maSetAnswer(qId, value) {
  maState.answers[qId] = value;
  document.getElementById('mainContent').innerHTML = renderMACDD();
}

function maPoamField(qId, field, value) {
  if (!maState.poamItems) maState.poamItems = {};
  if (!maState.poamItems[qId]) maState.poamItems[qId] = {};
  maState.poamItems[qId][field] = value;
}

async function maSave(status) {
  if (maState.saving) return;
  if (!maState.framing.target_name?.trim()) { toast('Target company name is required', '#dc2626'); return; }
  maState.saving = true;
  const { score, catScores, rating } = maCalcScore(maState.answers, maState.framing);
  const costs = maCalcCosts(maState.answers, maState.framing);
  const row = {
    org_id: currentOrg.id,
    framing: maState.framing,
    target_name: maState.framing.target_name,
    deal_type: maState.framing.deal_type || null,
    target_industry: maState.framing.target_industry || null,
    target_employee_band: maState.framing.target_employee_band || null,
    deal_value_band: maState.framing.deal_value_band || null,
    risk_tolerance: maState.framing.risk_tolerance || 'moderate',
    assessor: maState.framing.assessor || null,
    assessed_at: maState.framing.assessed_at || null,
    answers: { ...maState.answers, _poam: maState.poamItems || {} },
    score, category_scores: catScores,
    total_cost_low: costs.total.low, total_cost_high: costs.total.high,
    risk_rating: rating, status,
  };
  try {
    if (maState.editId) {
      const saved = await sbFetch(`ma_assessments?id=eq.${maState.editId}`, 'PATCH', row, { 'Prefer':'return=representation' });
      const updated = Array.isArray(saved) ? saved[0] : saved;
      const idx = maState.list.findIndex(x => x.id === maState.editId);
      if (idx >= 0 && updated) maState.list[idx] = updated;
      if (status === 'complete') { maState.view = 'detail'; maState.currentAssessment = maState.list[idx]; maState.poamItems = maState.currentAssessment?.answers?._poam || {}; }
    } else {
      const saved = await sbFetch('ma_assessments', 'POST', row, { 'Prefer':'return=representation' });
      const created = Array.isArray(saved) ? saved[0] : saved;
      if (created) { maState.editId = created.id; maState.list.unshift(created); }
      if (status === 'complete') { maState.view = 'detail'; maState.currentAssessment = created; maState.poamItems = created?.answers?._poam || {}; }
    }
    toast(status === 'complete' ? 'Assessment completed ✓' : 'Draft saved', '#15803d');
    if (status === 'draft') maState.view = 'list';
  } catch (e) {
    toast('Save failed — ' + (e.message||'unknown error'), '#dc2626');
  } finally {
    maState.saving = false;
    document.getElementById('mainContent').innerHTML = renderMACDD();
  }
}

async function maPoamSave(assessmentId) {
  const a = maState.list.find(x => x.id === assessmentId);
  if (!a) return;
  const answers = { ...(a.answers || {}), _poam: maState.poamItems || {} };
  try {
    await sbFetch(`ma_assessments?id=eq.${assessmentId}`, 'PATCH', { answers });
    a.answers = answers;
    toast('POAM saved ✓', '#15803d');
  } catch (e) { toast('POAM save failed', '#dc2626'); }
}

async function maDeleteAssessment(id, name) {
  if (!confirm(`Delete M&A assessment for "${name}"? This cannot be undone.`)) return;
  try {
    await sbFetch(`ma_assessments?id=eq.${id}`, 'DELETE');
    maState.list = maState.list.filter(x => x.id !== id);
    toast('Assessment deleted', '#b45309');
    if (maState.view === 'detail' && maState.currentAssessment?.id === id) maNavToList();
    else document.getElementById('mainContent').innerHTML = renderMACDD();
  } catch (e) { toast('Delete failed', '#dc2626'); }
}

function maShowAddEntity() {
  const a = maState.currentAssessment;
  if (!a) return;
  const container = document.getElementById('maAddEntityContainer');
  if (!container) return;
  const parentOrgs = (typeof allOrgs !== 'undefined' ? allOrgs : []).filter(o => ['grandfather','father'].includes(o.tier));
  container.innerHTML = `
  <div class="card" style="border-top:3px solid var(--cyan)">
    <div class="card-title">✚ Add as Entity</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:1rem">Creates a new child entity under the selected organisation and links this M&A assessment as its founding security baseline.</div>
    <div class="form-row">
      <div>
        <div class="field-lbl">Entity name</div>
        <input type="text" id="maEntityName" value="${escH(a.framing?.target_name||'')}" placeholder="Entity name in the platform"/>
      </div>
      <div>
        <div class="field-lbl">Parent organisation</div>
        <select id="maEntityParent">
          ${parentOrgs.map(o=>`<option value="${o.id}" ${currentOrg?.id===o.id?'selected':''}>${escH(o.name)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button class="btn btn-cyan" onclick="maConfirmAddEntity('${a.id}')">Create Entity</button>
      <button class="btn btn-outline" onclick="document.getElementById('maAddEntityContainer').innerHTML=''">Cancel</button>
    </div>
  </div>`;
  container.scrollIntoView({ behavior:'smooth' });
}

async function maConfirmAddEntity(assessmentId) {
  const name = document.getElementById('maEntityName')?.value?.trim();
  const parentId = document.getElementById('maEntityParent')?.value;
  if (!name) { toast('Entity name is required', '#dc2626'); return; }
  try {
    const newOrg = await sbFetch('organisations', 'POST',
      { name, tier:'child', parent_id: parentId || currentOrg.id, industry: maState.currentAssessment?.framing?.target_industry || null },
      { 'Prefer':'return=representation' });
    const org = Array.isArray(newOrg) ? newOrg[0] : newOrg;
    if (!org?.id) throw new Error('Organisation creation failed');
    await sbFetch(`ma_assessments?id=eq.${assessmentId}`, 'PATCH', { linked_org_id: org.id });
    const a = maState.list.find(x => x.id === assessmentId);
    if (a) { a.linked_org_id = org.id; maState.currentAssessment = a; }
    if (typeof allOrgs !== 'undefined') { const refreshed = await sbFetch('organisations?order=name.asc','GET'); if (refreshed) { allOrgs = refreshed; buildNav(); } }
    toast(`Entity "${name}" created and linked ✓`, '#15803d');
    document.getElementById('maAddEntityContainer').innerHTML = '';
    document.getElementById('mainContent').innerHTML = renderMACDD();
  } catch (e) { toast('Failed to create entity — ' + (e.message||'error'), '#dc2626'); }
}

function maCopyPrompt() {
  const a = maState.currentAssessment;
  if (!a) return;
  const fr = a.framing || {};
  const { score, rating, recommendation, catScores, allCats } = maCalcScore(a.answers||{}, fr);
  const db = maGetDealBreakers(a.answers||{}, fr);
  const costs = maCalcCosts(a.answers||{}, fr);
  const findings = maGetFindings(a.answers||{}, fr);
  const prompt = `You are a cybersecurity advisor preparing an M&A Cyber Due Diligence memo for Abbott Cyber Consulting.

TARGET: ${fr.target_name||'Target Company'}
DEAL TYPE: ${fr.deal_type||'—'} | INDUSTRY: ${fr.target_industry||'—'} | DEAL VALUE: ${fr.deal_value_band||'Not disclosed'}
RISK TOLERANCE: ${fr.risk_tolerance||'moderate'} | ASSESSED BY: ${fr.assessor||'—'} | DATE: ${a.assessed_at||'—'}

OVERALL CDD SCORE: ${score}/100 | RISK RATING: ${rating} | RECOMMENDATION: ${recommendation}

CATEGORY SCORES:
${allCats.map(c=>`${c.label}: ${catScores[c.id]??'—'}%`).join('\n')}

DEAL-BREAKER FLAGS:
${db.length ? db.map(f=>`- ${f.text}`).join('\n') : 'None triggered'}

TOP 10 FINDINGS:
${findings.slice(0,10).map(f=>`- [${(f.priority||'').toUpperCase()}] ${f.text} (Answer: ${f.answer})`).join('\n')}

COST TO REMEDIATE:
Pre-Close: ${_maCostRange(costs.preClose.low,costs.preClose.high)}
Year 1: ${_maCostRange(costs.year1.low,costs.year1.high)}
Strategic: ${_maCostRange(costs.strategic.low,costs.strategic.high)}
Total: ${_maCostRange(costs.total.low,costs.total.high)}

Write a 3-4 paragraph M&A cyber due diligence executive summary covering:
1. Overall cyber risk posture of the target
2. Deal-breaker flags and their materiality to this transaction
3. Key conditions or price adjustment recommendations
4. Post-close remediation roadmap and cost implications

Rules: Professional deal-memo tone. No markdown, no asterisks. Label sections KEY FINDINGS and PRIORITY RECOMMENDATIONS.`;
  const ta = document.createElement('textarea');
  ta.value = prompt; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
  document.body.appendChild(ta); ta.select(); document.execCommand('copy');
  document.body.removeChild(ta);
  toast('Report prompt copied to clipboard ✓', '#15803d');
}

async function maLoadList() {
  if (!currentOrg) return;
  try {
    const rows = await sbFetch(`ma_assessments?org_id=eq.${currentOrg.id}&order=created_at.desc`, 'GET');
    maState.list = rows || [];
    maState.listLoaded = true;
  } catch (e) { maState.list = []; maState.listLoaded = true; }
}

// --- WINDOW EXPORTS ---
window.renderMACDD          = renderMACDD;
window.maNewAssessment      = maNewAssessment;
window.maEditAssessment     = maEditAssessment;
window.maViewAssessment     = maViewAssessment;
window.maDeleteAssessment   = maDeleteAssessment;
window.maNavToList          = maNavToList;
window.maNavToStep          = maNavToStep;
window.maNext               = maNext;
window.maPrev               = maPrev;
window.maFramingSet         = maFramingSet;
window.maToggleDataSource   = maToggleDataSource;
window.maToggleAddon        = maToggleAddon;
window.maSetAnswer          = maSetAnswer;
window.maSave               = maSave;
window.maPoamField          = maPoamField;
window.maPoamSave           = maPoamSave;
window.maFindingsSave       = maFindingsSave;
window.maShowAddEntity      = maShowAddEntity;
window.maConfirmAddEntity   = maConfirmAddEntity;
window.maCopyPrompt         = maCopyPrompt;
window.maLoadList           = maLoadList;
window.maSetDetailTab       = maSetDetailTab;
window.maToggleFinding      = maToggleFinding;
window.maToggleTooling      = maToggleTooling;
window.maPricingSave        = maPricingSave;
