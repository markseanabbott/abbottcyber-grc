// ============================================================
// FRAMEWORK PREFILL — derive CIS and Insurance answers from Tech Stack
// Run after techstack.js, insurance.js, and cis.js are loaded.
// ============================================================

// Internal helpers
function _tsRank(ans) {
  return ans === 'yes' ? 2 : ans === 'partial' ? 1 : ans === 'no' ? 0 : -1;
}

function _tsBestAns(qids, tsAnswers) {
  let best = -1;
  qids.forEach(qid => {
    const a = tsAnswers[qid] && tsAnswers[qid].ans;
    if (a && a !== 'na') best = Math.max(best, _tsRank(a));
  });
  return best === 2 ? 'yes' : best === 1 ? 'partial' : best === 0 ? 'no' : null;
}

// All mapped TS questions must be yes/partial for 'yes'/'partial'; any gap → partial or no
function _tsAllAns(qids, tsAnswers) {
  const ans = qids.map(qid => tsAnswers[qid] && tsAnswers[qid].ans).filter(a => a && a !== 'na');
  if (!ans.length) return null;
  if (ans.every(a => a === 'yes')) return 'yes';
  if (ans.some(a => a === 'yes' || a === 'partial')) return 'partial';
  return 'no';
}

// Convert TS yes/partial/no to the appropriate Insurance option score for a given question
function _tsToInsScore(tsAns, insQuestion) {
  const opts = insQuestion.options;
  if (tsAns === 'yes') return opts[0].s;
  if (tsAns === 'partial') return opts[Math.min(1, opts.length - 1)].s;
  return opts[opts.length - 1].s;
}

// ─── INSURANCE MAPPING ────────────────────────────────────────
// Maps Insurance question IDs → Tech Stack question IDs
// strategy 'best': highest TS answer wins (any yes = yes, any partial = partial)
// strategy 'all':  all mapped TS questions must be yes for a yes answer
// q12 (Documented IR Plan) intentionally excluded — no TS question directly evidences a written plan
const _INS_TS_MAP = [
  { ins: 'q1',  ts: ['mfa_users', 'vpn_mfa'],   strategy: 'best' }, // MFA for remote access
  { ins: 'q2',  ts: ['mfa_admin'],               strategy: 'best' }, // MFA for admin accounts
  { ins: 'q3',  ts: ['mfa_admin'],               strategy: 'best' }, // MFA type (yes=phishing-resistant=authenticator/token)
  { ins: 'q4',  ts: ['backup_tool'],             strategy: 'best' }, // Daily backups
  { ins: 'q5',  ts: ['backup_immutable'],        strategy: 'best' }, // Isolated / offline backups
  { ins: 'q6',  ts: ['restore_test'],            strategy: 'best' }, // Restore testing
  { ins: 'q7',  ts: ['edr'],                     strategy: 'best' }, // EDR on all endpoints
  { ins: 'q8a', ts: ['patching'],                strategy: 'best' }, // OS / Microsoft patches
  { ins: 'q8b', ts: ['patching'],                strategy: 'best' }, // 3rd-party software patches
  { ins: 'q10', ts: ['esg', 'dmarc'],            strategy: 'all'  }, // Email security (needs gateway + DMARC for top score)
  { ins: 'q11', ts: ['phishsim'],                strategy: 'best' }, // Security awareness + phishing sims
  { ins: 'q14', ts: ['ir_retainer'],             strategy: 'best' }, // Designated IR contact or retainer
  { ins: 'q15', ts: ['pam', 'jml'],              strategy: 'best' }, // Least privilege enforced
  { ins: 'q16', ts: ['pam', 'mfa_admin'],        strategy: 'best' }, // Privileged accounts separated
];

// ─── CIS DERIVATION ───────────────────────────────────────────
function tsDeriveCIS(tsAnswers) {
  const derived = {};
  TS_CATS.forEach(cat => {
    cat.questions.forEach(q => {
      const a = tsAnswers[q.id] && tsAnswers[q.id].ans;
      if (!a || a === 'na') return;
      const cisAns = a === 'yes' ? 'yes' : a === 'partial' ? 'partial' : 'no';
      (q.mappings.cis || []).forEach(m => {
        // If multiple TS questions map to the same CIS safeguard, keep the better answer
        if (derived[m.id] === undefined || _tsRank(a) > _tsRank(derived[m.id])) {
          derived[m.id] = cisAns;
        }
      });
    });
  });
  return derived;
}

// ─── INSURANCE DERIVATION ─────────────────────────────────────
function tsDeriveInsurance(tsAnswers) {
  const derived = {};
  _INS_TS_MAP.forEach(function(mapping) {
    var ins = mapping.ins, ts = mapping.ts, strategy = mapping.strategy;
    var tsAns = strategy === 'all' ? _tsAllAns(ts, tsAnswers) : _tsBestAns(ts, tsAnswers);
    if (!tsAns) return;
    var question = null;
    for (var i = 0; i < INS_SECTIONS.length; i++) {
      var found = INS_SECTIONS[i].questions.find(function(q) { return q.id === ins; });
      if (found) { question = found; break; }
    }
    if (!question) return;
    derived[ins] = _tsToInsScore(tsAns, question);
  });
  return derived;
}

// ─── CMMC DERIVATION ──────────────────────────────────────────
// Maps CMMC L1 practice IDs → Tech Stack question IDs
const _CMMC_TS_MAP = [
  { cmmc: 'IA.L1-3.5.1',  ts: ['jml'],                    strategy: 'best' }, // Identification — JML means accounts are managed/identified
  { cmmc: 'IA.L1-3.5.2',  ts: ['mfa_users', 'mfa_admin'], strategy: 'best' }, // Authentication — any MFA = partial; phishing-resistant = yes
  { cmmc: 'AC.L1-3.1.1',  ts: ['mfa_users', 'jml'],       strategy: 'best' }, // Authorized Access Control — MFA + JML evidences access limits
  { cmmc: 'AC.L1-3.1.2',  ts: ['pam'],                    strategy: 'best' }, // Transaction & Function Control — PAM enforces least-privilege
  { cmmc: 'SC.L1-3.13.1', ts: ['ngfw'],                   strategy: 'best' }, // Boundary Protection — NGFW monitors comms at boundary
  { cmmc: 'SC.L1-3.13.5', ts: ['ngfw', 'dns_filter'],     strategy: 'best' }, // Public-Access Separation — NGFW/DNS = evidence of segmentation
  { cmmc: 'SI.L1-3.14.1', ts: ['patching'],               strategy: 'best' }, // Flaw Remediation — patch management evidences flaw remediation
  { cmmc: 'SI.L1-3.14.2', ts: ['edr'],                    strategy: 'best' }, // Malicious Code Protection — EDR is the primary control
  { cmmc: 'SI.L1-3.14.4', ts: ['edr'],                    strategy: 'best' }, // Update Protection — EDR with auto-update = yes
  { cmmc: 'SI.L1-3.14.5', ts: ['edr'],                    strategy: 'best' }, // System Scanning — EDR real-time scan = yes
];

function tsDeriveCMMC(tsAnswers) {
  const derived = {};
  _CMMC_TS_MAP.forEach(mapping => {
    const tsAns = mapping.strategy === 'all'
      ? _tsAllAns(mapping.ts, tsAnswers)
      : _tsBestAns(mapping.ts, tsAnswers);
    if (!tsAns) return;
    derived[mapping.cmmc] = tsAns;
  });
  return derived;
}

// ─── CMMC L2 DERIVATION ───────────────────────────────────────
// Maps CMMC L2 practice IDs (plain form, e.g. '3.1.3') → Tech Stack question IDs
const _CMMC2_TS_MAP = [
  // ACCESS CONTROL
  { cmmc: '3.1.3',  ts: ['dlp', 'data_classification'],  strategy: 'best' }, // Control CUI flow
  { cmmc: '3.1.5',  ts: ['pam', 'jml'],                  strategy: 'all'  }, // Least privilege
  { cmmc: '3.1.6',  ts: ['pam'],                          strategy: 'best' }, // Non-privileged account use
  { cmmc: '3.1.7',  ts: ['pam'],                          strategy: 'best' }, // Prevent privileged function execution
  { cmmc: '3.1.12', ts: ['ztna', 'vpn_mfa'],             strategy: 'best' }, // Control remote access
  { cmmc: '3.1.13', ts: ['ztna', 'vpn_mfa'],             strategy: 'best' }, // Remote access cryptography
  { cmmc: '3.1.14', ts: ['ztna'],                         strategy: 'best' }, // Route remote access via managed control points
  { cmmc: '3.1.17', ts: ['wifi_guest'],                   strategy: 'best' }, // Protect wireless access (auth + encryption)
  { cmmc: '3.1.19', ts: ['fde'],                          strategy: 'best' }, // Encrypt CUI on mobile devices
  // AWARENESS & TRAINING
  { cmmc: '3.2.1',  ts: ['phishsim'],                     strategy: 'best' }, // Role-based risk awareness
  { cmmc: '3.2.2',  ts: ['phishsim'],                     strategy: 'best' }, // Role-based security training
  { cmmc: '3.2.3',  ts: ['phishsim'],                     strategy: 'best' }, // Insider threat awareness
  // AUDIT & ACCOUNTABILITY
  { cmmc: '3.3.1',  ts: ['log_agg'],                      strategy: 'best' }, // System audit logging
  { cmmc: '3.3.2',  ts: ['siem_xdr', 'log_agg'],         strategy: 'best' }, // User action traceability
  { cmmc: '3.3.3',  ts: ['siem_xdr'],                     strategy: 'best' }, // Review logged events
  { cmmc: '3.3.4',  ts: ['siem_xdr'],                     strategy: 'best' }, // Alert on audit failure
  { cmmc: '3.3.5',  ts: ['siem_xdr'],                     strategy: 'best' }, // Correlate audit records
  { cmmc: '3.3.8',  ts: ['log_retention'],                strategy: 'best' }, // Protect audit information
  // CONFIGURATION MANAGEMENT
  { cmmc: '3.4.1',  ts: ['config_baselines'],             strategy: 'best' }, // Baseline configurations
  { cmmc: '3.4.2',  ts: ['config_baselines'],             strategy: 'best' }, // Security configuration settings
  { cmmc: '3.4.3',  ts: ['hw_inventory', 'sw_inventory'], strategy: 'best' }, // Track and document changes
  { cmmc: '3.4.6',  ts: ['app_allowlist'],                strategy: 'best' }, // Least functionality
  { cmmc: '3.4.7',  ts: ['app_allowlist', 'ngfw'],        strategy: 'best' }, // Restrict functions, ports, protocols
  { cmmc: '3.4.8',  ts: ['app_allowlist'],                strategy: 'best' }, // Application execution control (deny-by-exception)
  { cmmc: '3.4.9',  ts: ['app_allowlist'],                strategy: 'best' }, // Control user-installed software
  // IDENTIFICATION & AUTHENTICATION
  { cmmc: '3.5.3',  ts: ['mfa_users', 'mfa_admin'],      strategy: 'all'  }, // Multi-factor authentication (both user + admin)
  { cmmc: '3.5.4',  ts: ['mfa_admin'],                    strategy: 'best' }, // Replay-resistant authentication
  { cmmc: '3.5.5',  ts: ['jml'],                          strategy: 'best' }, // Identifier management
  { cmmc: '3.5.6',  ts: ['jml'],                          strategy: 'best' }, // Disable inactive identifiers
  // INCIDENT RESPONSE
  { cmmc: '3.6.1',  ts: ['ir_retainer', 'paging'],       strategy: 'all'  }, // IR capability (retainer + escalation path)
  { cmmc: '3.6.2',  ts: ['soar_runbook', 'ir_retainer'], strategy: 'best' }, // Track, document, report incidents
  { cmmc: '3.6.3',  ts: ['ir_retainer'],                  strategy: 'best' }, // Test incident response capability
  // MAINTENANCE
  { cmmc: '3.7.5',  ts: ['mfa_admin', 'vpn_mfa'],        strategy: 'best' }, // MFA for remote maintenance
  // MEDIA PROTECTION
  { cmmc: '3.8.9',  ts: ['backup_immutable'],             strategy: 'best' }, // Protect CUI on backup media
  // RISK ASSESSMENT
  { cmmc: '3.11.2', ts: ['vuln_scan', 'asm'],             strategy: 'best' }, // Vulnerability scanning
  { cmmc: '3.11.3', ts: ['remediation_sla'],              strategy: 'best' }, // Remediate vulnerabilities
  // SECURITY ASSESSMENT
  { cmmc: '3.12.1', ts: ['pentest'],                      strategy: 'best' }, // Periodically assess security controls
  { cmmc: '3.12.3', ts: ['siem_xdr', 'mdr_24x7'],        strategy: 'best' }, // Monitor security controls ongoing
  // SYSTEM & COMMUNICATIONS PROTECTION
  { cmmc: '3.13.2', ts: ['segmentation'],                 strategy: 'best' }, // Architect for security (network segmentation)
  { cmmc: '3.13.6', ts: ['ngfw'],                         strategy: 'best' }, // Deny by default / allow by exception
  { cmmc: '3.13.7', ts: ['ztna'],                         strategy: 'best' }, // Prevent split tunneling (ZTNA routes all traffic)
  { cmmc: '3.13.8', ts: ['ztna', 'vpn_mfa'],             strategy: 'best' }, // Encrypt CUI in transit
  { cmmc: '3.13.10',ts: ['key_mgmt'],                     strategy: 'best' }, // Cryptographic key management
  { cmmc: '3.13.15',ts: ['dmarc', 'esg'],                 strategy: 'best' }, // Protect authenticity of communications (DMARC/ESG)
  { cmmc: '3.13.16',ts: ['fde'],                          strategy: 'best' }, // Protect CUI at rest
  // SYSTEM & INFORMATION INTEGRITY
  { cmmc: '3.14.3', ts: ['siem_xdr', 'mdr_24x7'],        strategy: 'best' }, // Security alerts and advisories
  { cmmc: '3.14.6', ts: ['siem_xdr', 'mdr_24x7'],        strategy: 'best' }, // Monitor for attacks and unauthorized use
  { cmmc: '3.14.7', ts: ['siem_xdr', 'mdr_24x7'],        strategy: 'best' }, // Identify unauthorized use
];

function tsDeriveCMMC2(tsAnswers) {
  const derived = {};
  _CMMC2_TS_MAP.forEach(mapping => {
    const tsAns = mapping.strategy === 'all'
      ? _tsAllAns(mapping.ts, tsAnswers)
      : _tsBestAns(mapping.ts, tsAnswers);
    if (!tsAns) return;
    derived[mapping.cmmc] = tsAns;
  });
  return derived;
}

// ─── PUBLIC ───────────────────────────────────────────────────
function tsHasTechStackData() {
  return !!(tsState && Object.keys(tsState.answers || {}).length > 0);
}

// Ensure tech stack data is in memory — loads from Supabase if needed
async function tsEnsureLoaded() {
  if (!currentOrg) return false;
  if (tsState && !tsState.loading && Object.keys(tsState.answers || {}).length > 0) return true;
  if (!tsState) tsInit();
  tsState.orgId = currentOrg.id;
  await tsLoadResponses();
  return Object.keys(tsState.answers || {}).length > 0;
}

function tsDerive() {
  const tsAnswers = (tsState && tsState.answers) || {};
  const cis = tsDeriveCIS(tsAnswers);
  const insurance = tsDeriveInsurance(tsAnswers);
  return { cis, insurance, count: { cis: Object.keys(cis).length, insurance: Object.keys(insurance).length } };
}

// ─── INSURANCE PREFILL ACTION ─────────────────────────────────
async function insPrefillFromTS() {
  const btn = document.getElementById('insPrefillBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }
  const loaded = await tsEnsureLoaded();
  if (!loaded) {
    toast('No Tech Stack data found — complete a Tech Stack assessment first', '#b45309');
    if (btn) { btn.disabled = false; btn.innerHTML = '&#8681; From Tech Stack'; }
    return;
  }
  const result = tsDerive();
  const insurance = result.insurance;
  if (!Object.keys(insurance).length) {
    toast('No mappable Tech Stack answers found', '#b45309');
    if (btn) { btn.disabled = false; btn.innerHTML = '&#8681; From Tech Stack'; }
    return;
  }
  let filled = 0;
  Object.keys(insurance).forEach(function(qid) {
    if (insState.answers[qid] === undefined) {
      insState.answers[qid] = insurance[qid];
      filled++;
    }
  });
  // Open all sections that now have at least one answer
  INS_SECTIONS.forEach(function(sec) {
    if (sec.questions.some(function(q) { return insState.answers[q.id] !== undefined; })) {
      insState.openPanels[sec.id] = true;
    }
  });
  if (filled > 0) {
    toast('✓ ' + filled + ' insurance questions prefilled from Tech Stack — review and adjust before saving', '#152168');
  } else {
    toast('All questions already answered — nothing to prefill', '#b45309');
  }
  renderMain();
}

// ─── CIS PREFILL ACTION ───────────────────────────────────────
async function cisPrefillFromTS() {
  const btn = document.getElementById('cisPrefillBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }
  const loaded = await tsEnsureLoaded();
  if (!loaded) {
    toast('No Tech Stack data found — complete a Tech Stack assessment first', '#b45309');
    if (btn) { btn.disabled = false; btn.innerHTML = '&#8681; From Tech Stack'; }
    return;
  }
  const result = tsDerive();
  const cis = result.cis;
  if (!Object.keys(cis).length) {
    toast('No mappable Tech Stack answers found', '#b45309');
    if (btn) { btn.disabled = false; btn.innerHTML = '&#8681; From Tech Stack'; }
    return;
  }
  let filled = 0;
  Object.keys(cis).forEach(function(sf) {
    if (cisState.answers[sf] == null) {
      cisState.answers[sf] = cis[sf];
      filled++;
    }
  });
  if (filled > 0) {
    toast('✓ ' + filled + ' CIS safeguards prefilled from Tech Stack — review and adjust before saving', '#152168');
  } else {
    toast('All mapped safeguards already answered — nothing to prefill', '#b45309');
  }
  renderMain();
}

// ─── CMMC L2 PREFILL ACTION ───────────────────────────────────
async function cmmc2PrefillFromTS() {
  const btn = document.getElementById('cmmc2PrefillBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }
  const loaded = await tsEnsureLoaded();
  if (!loaded) {
    toast('No Tech Stack data found — complete a Tech Stack assessment first', '#b45309');
    if (btn) { btn.disabled = false; btn.innerHTML = '&#8681; From Tech Stack'; }
    return;
  }
  const tsAnswers = (tsState && tsState.answers) || {};
  const cmmc2 = tsDeriveCMMC2(tsAnswers);
  if (!Object.keys(cmmc2).length) {
    toast('No mappable Tech Stack answers found', '#b45309');
    if (btn) { btn.disabled = false; btn.innerHTML = '&#8681; From Tech Stack'; }
    return;
  }
  let filled = 0;
  Object.keys(cmmc2).forEach(practiceId => {
    if (cmmc2State.answers[practiceId] == null) {
      cmmc2State.answers[practiceId] = cmmc2[practiceId];
      filled++;
    }
  });
  if (filled > 0) {
    toast('✓ ' + filled + ' CMMC L2 practices prefilled from Tech Stack — review and adjust before saving', '#152168');
  } else {
    toast('All mapped practices already answered — nothing to prefill', '#b45309');
  }
  renderMain();
}

// ─── CMMC PREFILL ACTION ──────────────────────────────────────
async function cmmcPrefillFromTS() {
  const btn = document.getElementById('cmmcPrefillBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }
  const loaded = await tsEnsureLoaded();
  if (!loaded) {
    toast('No Tech Stack data found — complete a Tech Stack assessment first', '#b45309');
    if (btn) { btn.disabled = false; btn.innerHTML = '&#8681; From Tech Stack'; }
    return;
  }
  const tsAnswers = (tsState && tsState.answers) || {};
  const cmmc = tsDeriveCMMC(tsAnswers);
  if (!Object.keys(cmmc).length) {
    toast('No mappable Tech Stack answers found', '#b45309');
    if (btn) { btn.disabled = false; btn.innerHTML = '&#8681; From Tech Stack'; }
    return;
  }
  let filled = 0;
  Object.keys(cmmc).forEach(practiceId => {
    if (cmmcState.answers[practiceId] == null) {
      cmmcState.answers[practiceId] = cmmc[practiceId];
      filled++;
    }
  });
  if (filled > 0) {
    toast('✓ ' + filled + ' CMMC practices prefilled from Tech Stack — review and adjust before saving', '#152168');
  } else {
    toast('All mapped practices already answered — nothing to prefill', '#b45309');
  }
  renderMain();
}
