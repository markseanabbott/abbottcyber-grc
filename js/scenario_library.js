// ============================================================
// SCENARIO LIBRARY — Browse and launch tabletop scenarios
// Landing page for the Exercises nav section.
// Includes exercise performance stats (chart + stat cards) at
// top, then dropdown filters and scenario selection cards below.
// ============================================================

// ── Library metadata (maps TT_SCENARIOS IDs → program tags) ──────
const TT_SCENARIO_LIBRARY_META = {
  ransom_phish: {
    threatProfiles: ['ransomware', 'phishing', 'data-exfiltration'],
    industries:     ['Hospitality'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Impact', 'Lateral Movement', 'Exfiltration'],
  },
  bec_wire: {
    threatProfiles: ['bec', 'wire-fraud', 'mfa-bypass', 'social-engineering'],
    industries:     ['Technology / SaaS'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Initial Access', 'Credential Access', 'Impact'],
  },
  overnight_vishing: {
    threatProfiles: ['vishing', 'social-engineering', 'credential-theft'],
    industries:     ['Hospitality'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Initial Access', 'Credential Access', 'Exfiltration'],
  },
  pos_compromise: {
    threatProfiles: ['pos-malware', 'card-theft', 'supply-chain'],
    industries:     ['Hospitality'],
    compliance:     ['pci_dss', 'cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Credential Access', 'Exfiltration'],
  },
  msp_rma_pivot: {
    threatProfiles: ['supply-chain', 'ransomware', 'lateral-movement'],
    industries:     ['MSP'],
    compliance:     ['cyber_insurance', 'cmmc'],
    recommendedFrequency: 'semi_annual',
    mitreGroups:    ['Initial Access', 'Exfiltration', 'Impact'],
  },
  reservation_data_leak: {
    threatProfiles: ['data-breach', 'third-party', 'supply-chain'],
    industries:     ['Hospitality'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Initial Access', 'Exfiltration'],
  },
  ddos_extortion: {
    threatProfiles: ['ddos', 'extortion', 'social-engineering'],
    industries:     ['Hospitality'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Impact'],
  },
  aitm_cred_theft: {
    threatProfiles: ['aitm', 'mfa-bypass', 'credential-theft', 'phishing'],
    industries:     ['All'],
    compliance:     ['cyber_insurance', 'cmmc'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Initial Access', 'Credential Access', 'Collection'],
  },
  reg_audit_surprise: {
    threatProfiles: ['regulatory', 'compliance-response'],
    industries:     ['All'],
    compliance:     ['hipaa', 'cmmc', 'pci_dss', 'cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    [],
  },
  insider_threat: {
    threatProfiles: ['insider-threat', 'data-exfiltration', 'credential-theft'],
    industries:     ['All'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Exfiltration'],
  },
  cloud_misconfig: {
    threatProfiles: ['cloud-exposure', 'data-breach', 'data-exfiltration'],
    industries:     ['Technology / SaaS'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Collection', 'Exfiltration'],
  },
  supply_chain_sw: {
    threatProfiles: ['supply-chain', 'ransomware', 'lateral-movement', 'data-exfiltration'],
    industries:     ['MSP'],
    compliance:     ['cyber_insurance', 'hipaa'],
    recommendedFrequency: 'semi_annual',
    mitreGroups:    ['Initial Access', 'Lateral Movement', 'Exfiltration', 'Impact'],
  },
  bcdr_dc_failure: {
    threatProfiles: ['bcdr', 'availability'],
    industries:     ['All'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    [],
  },
  bcdr_critical_vendor: {
    threatProfiles: ['bcdr', 'third-party', 'availability'],
    industries:     ['All'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    [],
  },
  exec_ransom_decision: {
    threatProfiles: ['ransomware', 'extortion'],
    industries:     ['All'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Impact'],
  },
  exec_breach_comm: {
    threatProfiles: ['data-breach', 'regulatory', 'social-engineering'],
    industries:     ['All'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Exfiltration'],
  },
  ai_tool_shadow: {
    threatProfiles: ['ai-governance', 'insider-threat', 'data-exfiltration'],
    industries:     ['All'],
    compliance:     ['cyber_insurance', 'hipaa'],
    recommendedFrequency: 'annual',
    mitreGroups:    [],
  },
  ai_deepfake_fraud: {
    threatProfiles: ['ai-governance', 'bec', 'wire-fraud', 'social-engineering'],
    industries:     ['All'],
    compliance:     ['cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Initial Access', 'Impact'],
  },
  pci_card_skimmer: {
    threatProfiles: ['card-theft', 'pos-malware', 'supply-chain'],
    industries:     ['Hospitality'],
    compliance:     ['pci_dss', 'cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Credential Access', 'Exfiltration'],
  },
  pci_pan_in_logs: {
    threatProfiles: ['card-theft', 'compliance-response', 'data-breach'],
    industries:     ['Technology / SaaS'],
    compliance:     ['pci_dss', 'cyber_insurance'],
    recommendedFrequency: 'annual',
    mitreGroups:    ['Collection'],
  },
};

// ── Track (exercise type) labels ──────────────────────────────────
const SL_TRACK_LABELS = {
  operational: 'Security Operations',
  executive:   'Executive',
  bcdr:        'BCDR',
  ai:          'AI & Technology',
  pci:         'PCI / Payment',
  vendor:      'Vendor Risk',
};

// ── Compliance program display config ─────────────────────────────
const SL_COMPLIANCE = {
  cyber_insurance: { label: 'Cyber Insurance', color: '#1d4ed8', bg: '#dbeafe',  icon: '🛡️', freqMonths: 12, freqLabel: 'Annual'     },
  hipaa:           { label: 'HIPAA',            color: '#15803d', bg: '#dcfce7',  icon: '🏥', freqMonths: 12, freqLabel: 'Annual'     },
  cmmc:            { label: 'CMMC',             color: '#7c3aed', bg: '#ede9fe',  icon: '🔐', freqMonths: 12, freqLabel: 'Annual'     },
  pci_dss:         { label: 'PCI DSS',          color: '#b45309', bg: '#fef3c7',  icon: '💳', freqMonths: 12, freqLabel: 'Annual'     },
};

// ── Threat profile display labels ──────────────────────────────────
const SL_THREAT_LABELS = {
  'ransomware':          'Ransomware',
  'phishing':            'Phishing',
  'bec':                 'BEC',
  'wire-fraud':          'Wire Fraud',
  'aitm':                'AiTM',
  'mfa-bypass':          'MFA Bypass',
  'vishing':             'Vishing',
  'social-engineering':  'Social Engineering',
  'credential-theft':    'Credential Theft',
  'pos-malware':         'POS Malware',
  'card-theft':          'Card Theft',
  'supply-chain':        'Supply Chain',
  'lateral-movement':    'Lateral Movement',
  'data-breach':         'Data Breach',
  'third-party':         'Third-Party',
  'data-exfiltration':   'Exfiltration',
  'ddos':                'DDoS',
  'extortion':           'Extortion',
  'regulatory':          'Regulatory',
  'compliance-response': 'Compliance Response',
  'insider-threat':      'Insider Threat',
  'cloud-exposure':      'Cloud Exposure',
  'bcdr':                'BCDR',
  'availability':        'Availability',
  'ai-governance':       'AI Governance',
};

// ── Frequency recommendation labels ───────────────────────────────
const SL_FREQ = {
  annual:      { label: 'Annual',      months: 12 },
  semi_annual: { label: 'Semi-annual', months: 6  },
  quarterly:   { label: 'Quarterly',   months: 3  },
};

// ──────────────────────────────────────────────────────────────────
// DATA LOADING
// ──────────────────────────────────────────────────────────────────

async function slEnsureData() {
  let changed = false;

  if (!slState.sessions) {
    try {
      slState.sessions = await sb.tt.listCompletedForOrg(currentOrg.id);
    } catch (e) {
      slState.sessions = [];
    }
    changed = true;
  }

  if (!slState.dbScenarios) {
    try {
      const rows = await sbFetch(`tabletop_scenarios?status=eq.published&select=id,title,track,industry,difficulty,duration,summary,tags,injects,compliance_tags,source_id`, 'GET');
      slState.dbScenarios = Array.isArray(rows) ? rows : [];
    } catch (e) {
      slState.dbScenarios = [];
    }
    changed = true;
  }

  // Ensure ex_hub operational sessions are loaded for stats
  if (typeof exHubEnsureOp === 'function') exHubEnsureOp();

  if (changed && (activeNav === 'scenario_library' || activeNav === 'exercises')) {
    document.getElementById('mainContent').innerHTML = renderScenarioLibrary();
    setTimeout(drawExPageCharts, 80);
  }
}

// ──────────────────────────────────────────────────────────────────
// HELPERS — last-run tracking
// ──────────────────────────────────────────────────────────────────

function slLastRun(scenarioId) {
  const sessions = slState.sessions || [];
  const matches = sessions.filter(s => s.scenario_id === scenarioId || s.scenario_title === (TT_SCENARIOS[scenarioId] || {}).title);
  if (!matches.length) return null;
  matches.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return matches[0].created_at.substring(0, 10);
}

function slMonthsAgo(dateStr) {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr);
  const now = new Date();
  return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
}

function slFreqStatus(lastRunDate, freqMonths) {
  const months = slMonthsAgo(lastRunDate);
  if (months === Infinity) return 'never';
  if (months >= freqMonths)     return 'overdue';
  if (months >= freqMonths - 2) return 'due_soon';
  return 'ok';
}

function slFreqBadge(lastRunDate, freqMonths, freqLabel) {
  const status = slFreqStatus(lastRunDate, freqMonths);
  const months  = slMonthsAgo(lastRunDate);
  if (status === 'never')    return `<span style="font-size:10px;font-weight:700;color:#dc2626">Never run</span>`;
  if (status === 'overdue')  return `<span style="font-size:10px;font-weight:700;color:#dc2626">⚠ ${months}mo ago — overdue (${freqLabel})</span>`;
  if (status === 'due_soon') return `<span style="font-size:10px;font-weight:700;color:#d97706">${months}mo ago — due soon</span>`;
  return `<span style="font-size:10px;color:#15803d">✓ ${months}mo ago</span>`;
}

// ──────────────────────────────────────────────────────────────────
// HELPERS — role hints from org profile
// ──────────────────────────────────────────────────────────────────

function slRoleHints(scenarioId, profile) {
  if (!profile) return [];
  const hints = [];
  const meta = TT_SCENARIO_LIBRARY_META[scenarioId] || {};

  if (profile.handles_health_data && meta.compliance && meta.compliance.includes('hipaa')) {
    hints.push({ role: 'LC', text: 'HIPAA counsel critical — this org handles health data' });
  }
  if (profile.handles_payment_data && (meta.threatProfiles || []).some(t => ['pos-malware', 'card-theft'].includes(t))) {
    hints.push({ role: 'TL', text: 'PCI QSA context recommended — payment data in scope' });
  }
  if ((profile.industry || '').toLowerCase().includes('hospitality')) {
    if (['ransom_phish', 'overnight_vishing', 'pos_compromise', 'reservation_data_leak', 'ddos_extortion'].includes(scenarioId)) {
      hints.push({ role: 'CL', text: 'Guest-facing comms are a major IR dimension — CL is critical' });
    }
  }
  if ((profile.industry || '').toLowerCase().includes('msp') && scenarioId === 'msp_rma_pivot') {
    hints.push({ role: 'IC', text: 'Multi-client blast radius — IC must manage client notifications simultaneously' });
  }
  const empBand = profile.employee_count_band || '';
  if (['1-10', '11-25'].includes(empBand)) {
    hints.push({ role: 'All', text: 'Small team: roles may be doubled up — consider merging IC + ES' });
  }
  return hints;
}

// ──────────────────────────────────────────────────────────────────
// HELPERS — build unified scenario list
// ──────────────────────────────────────────────────────────────────

function slBuildScenarioList() {
  const builtins = Object.values(TT_SCENARIOS).map(s => ({
    ...s,
    _source:  'builtin',
    _meta:    TT_SCENARIO_LIBRARY_META[s.id] || {},
    _lastRun: slLastRun(s.id),
  }));

  const dbItems = (slState.dbScenarios || []).map(s => ({
    ...s,
    track:    s.track === 'exec' ? 'executive' : (s.track || 'operational'),
    _source:  'db',
    _meta: {
      threatProfiles: Array.isArray(s.tags) ? s.tags.filter(t => SL_THREAT_LABELS[t]) : [],
      industries:     s.industry ? [s.industry] : ['All'],
      compliance:     Array.isArray(s.compliance_tags) ? s.compliance_tags.filter(t => SL_COMPLIANCE[t])
                    : Array.isArray(s.tags) ? s.tags.filter(t => SL_COMPLIANCE[t]) : [],
      recommendedFrequency: 'annual',
    },
    _lastRun: slLastRun(s.id),
  }));

  return [...builtins, ...dbItems];
}

// ──────────────────────────────────────────────────────────────────
// FILTER LOGIC
// ──────────────────────────────────────────────────────────────────

function slApplyFilter(scenarios) {
  const f = slState.filter;
  return scenarios.filter(s => {
    const meta = s._meta || {};
    const inds = meta.industries || [];
    if (f.track !== 'all' && (s.track || 'operational') !== f.track) return false;
    if (f.industry !== 'all' && !inds.includes(f.industry) && !inds.includes('All')) return false;
    if (f.threat !== 'all' && !(meta.threatProfiles || []).includes(f.threat)) return false;
    if (f.compliance !== 'all' && !(meta.compliance || []).includes(f.compliance)) return false;
    if (f.difficulty !== 'all' && (s.difficulty || '').toLowerCase() !== f.difficulty.toLowerCase()) return false;
    return true;
  });
}

function slSetFilter(key, val) {
  slState.filter[key] = val;
  document.getElementById('mainContent').innerHTML = renderScenarioLibrary();
  setTimeout(drawExPageCharts, 80);
  slEnsureData();
}

function slClearFilters() {
  slState.filter = { track: 'all', industry: 'all', threat: 'all', compliance: 'all', difficulty: 'all' };
  document.getElementById('mainContent').innerHTML = renderScenarioLibrary();
  setTimeout(drawExPageCharts, 80);
  slEnsureData();
}

// ──────────────────────────────────────────────────────────────────
// COMPLIANCE ALERT BANNER
// ──────────────────────────────────────────────────────────────────

function slComplianceAlerts(scenarios) {
  if (!slState.sessions) return '';
  const profile = currentOrg ? (orgProfiles[currentOrg.id] || null) : null;

  const relevantPrograms = new Set();
  const orgCompliance = profile ? (profile.regulatory_scope || []) : [];
  if (Array.isArray(orgCompliance)) orgCompliance.forEach(c => relevantPrograms.add(c));
  if (profile?.handles_health_data)  relevantPrograms.add('hipaa');
  if (profile?.handles_payment_data) relevantPrograms.add('pci_dss');
  relevantPrograms.add('cyber_insurance');

  const overdue = [];
  relevantPrograms.forEach(prog => {
    if (!SL_COMPLIANCE[prog]) return;
    const cfg = SL_COMPLIANCE[prog];
    const tagged = scenarios.filter(s => (s._meta?.compliance || []).includes(prog));
    const lastRunDates = tagged.map(s => s._lastRun).filter(Boolean);
    lastRunDates.sort((a, b) => b.localeCompare(a));
    const lastRun = lastRunDates[0] || null;
    const status  = slFreqStatus(lastRun, cfg.freqMonths);
    const months  = slMonthsAgo(lastRun);
    if (status === 'never' || status === 'overdue') {
      overdue.push({ prog, cfg, lastRun, months, status });
    }
  });

  if (!overdue.length) return '';
  return `<div style="background:#fff8f0;border:1.5px solid #f59e0b;border-radius:10px;padding:12px 16px;margin-bottom:1.25rem">
    <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:6px">⚠ Compliance Exercise Gaps</div>
    ${overdue.map(({ prog, cfg, status, months }) => `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <span style="font-size:11px;font-weight:700;padding:1px 7px;border-radius:8px;background:${cfg.bg};color:${cfg.color}">${cfg.icon} ${cfg.label}</span>
        <span style="font-size:11px;color:#92400e">
          ${status === 'never' ? 'No exercise recorded for this program' : `Last exercise ${months} months ago — ${cfg.freqLabel} requirement`}
        </span>
      </div>
    `).join('')}
  </div>`;
}

// ──────────────────────────────────────────────────────────────────
// EXERCISE STATS SECTION — performance chart + stat cards
// Pulls from exHubState and orgAssessments (same source as ex_hub.js)
// ──────────────────────────────────────────────────────────────────

function _slExStatsHtml() {
  const aiRuns     = ((orgAssessments[currentOrg?.id] || {})['ai_tabletop'] || []);
  const opSessions = exHubState?.opSessions ?? null;
  const rows       = [];

  aiRuns.forEach(r => {
    const a = r.answers || {};
    rows.push({ type: 'ai', date: r.date || r.assessed_at || '', scenario: a.scenarioName || a.scenarioId || '—', breach: null, severity: null, rubric_scores: null });
  });
  if (opSessions) {
    opSessions.forEach(s => {
      const log = Array.isArray(s.exercise_log) ? s.exercise_log : [];
      rows.push({ type: 'op', date: s.created_at ? s.created_at.substring(0, 10) : '', scenario: s.scenario_title || '—', breach: s.breach_declared, severity: s.tl_severity || '—', injectCount: log.length, id: s.id, rubric_scores: s.rubric_scores || null });
    });
  }
  rows.sort((a, b) => b.date.localeCompare(a.date));

  const scoredRows  = rows.map(r => ({ ...r, score: typeof exCalcScore === 'function' ? exCalcScore(r) : 80 }));
  const total       = scoredRows.length;
  const breachCount = scoredRows.filter(r => r.breach === true).length;
  const aiCount     = scoredRows.filter(r => r.type === 'ai').length;
  const opCount     = scoredRows.filter(r => r.type === 'op').length;
  const loading     = opSessions === null;
  const avgScore    = total > 0 ? Math.round(scoredRows.reduce((s, r) => s + r.score, 0) / total) : 0;
  const latestScore = total > 0 ? scoredRows[0].score : 0;
  const latestGrade = typeof exGrade === 'function' ? exGrade(latestScore) : { letter: 'A', color: '#15803d' };
  const chronoScores = [...scoredRows].reverse().map(r => r.score);

  const statGrid = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;flex-shrink:0;align-content:start">
      <div class="sm-card" style="padding:8px 10px;margin:0"><div class="sm-val" style="font-size:1.1rem">${loading ? '…' : total}</div><div class="sm-lbl">Total</div></div>
      <div class="sm-card" style="padding:8px 10px;margin:0"><div class="sm-val" style="font-size:1.1rem">${loading ? '…' : opCount}</div><div class="sm-lbl">Cyber</div></div>
      <div class="sm-card" style="padding:8px 10px;margin:0"><div class="sm-val" style="font-size:1.1rem">${loading ? '…' : aiCount}</div><div class="sm-lbl">AI Gov</div></div>
      <div class="sm-card" style="padding:8px 10px;margin:0"><div class="sm-val" style="font-size:1.1rem;color:${breachCount > 0 ? '#dc2626' : 'inherit'}">${loading ? '…' : breachCount}</div><div class="sm-lbl">Breaches</div></div>
    </div>`;

  if (total === 0) {
    return `<div style="display:flex;gap:.75rem;margin-bottom:1.25rem;align-items:stretch">${statGrid}</div>`;
  }

  return `
  <div style="display:flex;gap:.75rem;margin-bottom:1.25rem;align-items:stretch">
    <div style="flex:1;background:#fff;border:1px solid var(--border);border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:12px;min-width:0">
      <div style="text-align:center;flex-shrink:0;min-width:44px">
        <div style="font-size:2rem;font-weight:800;color:${latestGrade.color};line-height:1">${latestGrade.letter}</div>
        <div style="font-size:9px;font-weight:700;color:${latestGrade.color};margin-top:1px">${latestScore}%</div>
      </div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
          <div style="font-size:11px;font-weight:700;color:var(--text)">Exercise Performance</div>
          <div style="font-size:10px;color:var(--muted)">${total} run${total !== 1 ? 's' : ''} · ${avgScore}% avg</div>
        </div>
        <canvas id="ex-trend-chart" height="28" data-scores='${JSON.stringify(chronoScores)}' style="width:100%;display:block"></canvas>
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--muted);margin-top:2px">
          <span>${scoredRows[scoredRows.length - 1]?.date || ''}</span>
          <span>${scoredRows[0]?.date || ''}</span>
        </div>
      </div>
    </div>
    ${statGrid}
  </div>`;
}

// ──────────────────────────────────────────────────────────────────
// FILTER BAR — four dropdowns
// ──────────────────────────────────────────────────────────────────

function slRenderFilterBar(scenarios) {
  const f = slState.filter;
  const tracks     = [...new Set(scenarios.map(s => s.track || 'operational'))].sort((a,b) => {
    const order = ['operational','executive','bcdr','ai','pci','vendor'];
    return (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 99 : order.indexOf(b));
  });
  const industries = [...new Set(scenarios.flatMap(s => (s._meta?.industries || []).filter(i => i !== 'All')))].sort();
  const threats    = [...new Set(scenarios.flatMap(s => s._meta?.threatProfiles || []))].sort();
  const programs   = [...new Set(scenarios.flatMap(s => s._meta?.compliance || []))].sort();
  const diffs      = ['Easy', 'Medium', 'Hard'];

  const anyActive  = f.track !== 'all' || f.industry !== 'all' || f.threat !== 'all' || f.compliance !== 'all' || f.difficulty !== 'all';
  const selStyle   = `font-family:inherit;font-size:12px;padding:7px 10px;border:1.5px solid var(--border);border-radius:8px;background:#fff;color:var(--text);cursor:pointer;outline:none`;

  const selW = `width:100%;${selStyle}`;
  return `<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr${anyActive?' auto':''};gap:8px;align-items:center;margin-bottom:1.25rem">
    <select style="${selW}" onchange="slSetFilter('track',this.value)">
      <option value="all" ${f.track==='all'?'selected':''}>All Exercise Types</option>
      ${tracks.map(t => `<option value="${t}" ${f.track===t?'selected':''}>${SL_TRACK_LABELS[t]||t}</option>`).join('')}
    </select>
    <select style="${selW}" onchange="slSetFilter('industry',this.value)">
      <option value="all" ${f.industry==='all'?'selected':''}>All Industries</option>
      ${industries.map(i => `<option value="${escH(i)}" ${f.industry===i?'selected':''}>${escH(i)}</option>`).join('')}
    </select>
    <select style="${selW}" onchange="slSetFilter('threat',this.value)">
      <option value="all" ${f.threat==='all'?'selected':''}>All Threats</option>
      ${threats.map(t => `<option value="${t}" ${f.threat===t?'selected':''}>${SL_THREAT_LABELS[t]||t}</option>`).join('')}
    </select>
    <select style="${selW}" onchange="slSetFilter('compliance',this.value)">
      <option value="all" ${f.compliance==='all'?'selected':''}>All Compliance</option>
      ${programs.map(p => { const cfg = SL_COMPLIANCE[p]||{}; return `<option value="${p}" ${f.compliance===p?'selected':''}>${cfg.label||p}</option>`; }).join('')}
    </select>
    <select style="${selW}" onchange="slSetFilter('difficulty',this.value)">
      <option value="all" ${f.difficulty==='all'?'selected':''}>All Difficulties</option>
      ${diffs.map(d => `<option value="${d}" ${f.difficulty===d?'selected':''}>${d}</option>`).join('')}
    </select>
    ${anyActive ? `<button class="btn btn-outline btn-sm" style="white-space:nowrap" onclick="slClearFilters()">Clear</button>` : ''}
  </div>`;
}

// ──────────────────────────────────────────────────────────────────
// SCENARIO CARD
// ──────────────────────────────────────────────────────────────────

function slRenderCard(s) {
  const meta      = s._meta || {};
  const profile   = currentOrg ? (orgProfiles[currentOrg.id] || null) : null;
  const roleHints = slRoleHints(s.id, profile);
  const freq      = SL_FREQ[meta.recommendedFrequency] || SL_FREQ.annual;
  const lastRun   = s._lastRun;
  const freqBadge = slFreqBadge(lastRun, freq.months, freq.label);

  const diffColor = s.difficulty === 'Hard' ? '#dc2626' : s.difficulty === 'Medium' ? '#d97706' : '#15803d';

  const complianceBadges = (meta.compliance || []).map(c => {
    const cfg = SL_COMPLIANCE[c];
    if (!cfg) return '';
    return `<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;background:${cfg.bg};color:${cfg.color}">${cfg.icon} ${cfg.label}</span>`;
  }).join('');

  const threatChips = (meta.threatProfiles || []).slice(0, 4).map(t =>
    `<span style="font-size:9px;padding:1px 6px;border-radius:3px;background:#f0f4fa;color:var(--navy)">${SL_THREAT_LABELS[t] || t}</span>`
  ).join('');

  const injectCount = Array.isArray(s.injects) ? s.injects.length : '—';

  const hintHtml = roleHints.length ? `
    <div style="margin-top:8px;padding-top:8px;border-top:0.5px solid var(--border)">
      ${roleHints.map(h => `
        <div style="display:flex;gap:5px;align-items:baseline;font-size:10px;color:var(--muted);margin-bottom:2px">
          <span style="font-weight:700;color:var(--navy);flex-shrink:0">${h.role}</span>
          <span>${h.text}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  const isDbScen = s._source === 'db';

  return `
  <div style="background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:0;overflow:hidden;display:flex;flex-direction:column">
    <div style="background:linear-gradient(135deg,var(--navy),var(--navy2));padding:12px 14px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px">
        <div style="font-size:13px;font-weight:700;color:#fff;line-height:1.3">${escH(s.title)}${isDbScen ? ' <span style="font-size:9px;opacity:0.7;font-weight:400">(Custom)</span>' : ''}</div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <span style="font-size:10px;color:rgba(255,255,255,0.7)">${escH(s.industry || 'All')}</span>
        <span style="font-size:10px;color:rgba(255,255,255,0.4)">·</span>
        <span style="font-size:10px;font-weight:700;color:${diffColor === '#dc2626' ? '#fca5a5' : diffColor === '#d97706' ? '#fde68a' : '#86efac'}">${s.difficulty || '—'}</span>
        <span style="font-size:10px;color:rgba(255,255,255,0.4)">·</span>
        <span style="font-size:10px;color:rgba(255,255,255,0.7)">${s.duration || '—'}</span>
        <span style="font-size:10px;color:rgba(255,255,255,0.4)">·</span>
        <span style="font-size:10px;color:rgba(255,255,255,0.7)">${injectCount} inject${injectCount !== 1 ? 's' : ''}</span>
      </div>
    </div>

    <div style="padding:12px 14px;flex:1;display:flex;flex-direction:column;gap:8px">
      <div style="font-size:11px;color:var(--muted);line-height:1.5">${escH((s.summary || '').slice(0, 180))}${(s.summary || '').length > 180 ? '…' : ''}</div>
      ${threatChips ? `<div style="display:flex;flex-wrap:wrap;gap:4px">${threatChips}</div>` : ''}
      ${complianceBadges ? `<div style="display:flex;flex-wrap:wrap;gap:4px">${complianceBadges}</div>` : ''}
      <div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
        <div>
          <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:2px">Recommended</div>
          <div style="font-size:10px;font-weight:600;color:var(--text)">${freq.label}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:2px">Last run</div>
          ${slState.sessions === null
            ? `<span style="font-size:10px;color:var(--muted)">…</span>`
            : freqBadge}
        </div>
      </div>
      ${hintHtml}
    </div>

    <div style="border-top:1px solid var(--border);padding:10px 14px">
      <button class="btn btn-primary btn-sm" style="width:100%" onclick="slLaunchScenario('${s.id}')">Launch →</button>
    </div>
  </div>`;
}

// ──────────────────────────────────────────────────────────────────
// LAUNCH MODAL — choose run mode before entering exercise
// ──────────────────────────────────────────────────────────────────

function slLaunchScenario(scenarioId) {
  slShowLaunchModal(scenarioId);
}

function slShowLaunchModal(scenarioId) {
  const s     = TT_SCENARIOS[scenarioId] || (slState.dbScenarios || []).find(d => d.id === scenarioId) || {};
  const title = s.title || scenarioId;

  const existing = document.getElementById('slLaunchModal');
  if (existing) existing.remove();

  function modeCard(mode, icon, heading, sub, live) {
    const needsName = live && (mode === 'human_local' || mode === 'human_remote');
    const action = needsName
      ? `_slModalNameStep('${scenarioId}','${mode}')`
      : `slDoLaunch('${scenarioId}','${mode}')`;
    const clickAttr = live
      ? `onclick="${action}" onmouseenter="this.style.borderColor='var(--cyan)'" onmouseleave="this.style.borderColor='var(--border)'"`
      : '';
    return `<div ${clickAttr}
      style="flex:1;min-width:180px;padding:16px 14px;border-radius:12px;border:2px solid ${live ? 'var(--border)' : '#e5e7eb'};background:${live ? '#fff' : '#f9fafb'};cursor:${live ? 'pointer' : 'default'};transition:border-color .15s;position:relative;${live ? '' : 'opacity:.5'}">
      <div style="font-size:1.6rem;margin-bottom:6px">${icon}</div>
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:3px">${heading}</div>
      <div style="font-size:11px;color:var(--muted);line-height:1.5">${sub}</div>
      ${!live ? `<span style="position:absolute;top:8px;right:8px;font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;background:#e5e7eb;color:#6b7280">Coming soon</span>` : ''}
    </div>`;
  }

  const html = `
  <div id="slLaunchModal" onclick="if(event.target===this)slCloseLaunchModal()"
    style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem">
    <div id="slLaunchModalBox" style="background:#fff;border-radius:16px;max-width:600px;width:100%;padding:1.75rem;box-shadow:0 20px 60px rgba(0,0,0,0.25)">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem">
        <div>
          <div style="font-size:16px;font-weight:700;color:var(--text)">🚀 Launch Exercise</div>
          <div style="font-size:12px;color:var(--muted);margin-top:3px">${escH(title)}</div>
        </div>
        <button onclick="slCloseLaunchModal()" style="background:none;border:none;font-size:22px;color:var(--muted);cursor:pointer;line-height:1;padding:0">&times;</button>
      </div>
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:10px">How would you like to run this exercise?</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        ${modeCard('ai_local',     '🤖', 'AI Run — Local',           'AI acts as game master. Participants are in the same room.',                             true)}
        ${modeCard('ai_remote',    '🤖', 'AI Run — Remote',          'AI-facilitated with remote participants joining via session code.',                     false)}
        ${modeCard('human_local',  '👥', 'Facilitator — Local',      'Human facilitator runs injects live. All participants in the same room.',               true)}
        ${modeCard('human_remote', '👥', 'Facilitator — Remote',     'Jackbox-style: participants join from any device via a session code.',                  true)}
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
}

function _slModalNameStep(scenarioId, mode) {
  const box = document.getElementById('slLaunchModalBox');
  if (!box) return;
  const s     = TT_SCENARIOS[scenarioId] || (slState.dbScenarios || []).find(d => d.id === scenarioId) || {};
  const title = s.title || scenarioId;
  const modeLabel = mode === 'human_local' ? 'Facilitator — Local' : 'Facilitator — Remote';

  box.innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem">
      <div>
        <div style="font-size:16px;font-weight:700;color:var(--text)">👥 ${escH(modeLabel)}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:3px">${escH(title)}</div>
      </div>
      <button onclick="slCloseLaunchModal()" style="background:none;border:none;font-size:22px;color:var(--muted);cursor:pointer;line-height:1;padding:0">&times;</button>
    </div>
    <div style="margin-bottom:1.25rem">
      <label style="display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--text);margin-bottom:6px">Your name (facilitator)</label>
      <input id="slFacNameInput" type="text" placeholder="e.g. Mark Abbott"
        style="width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px;color:var(--text);box-sizing:border-box;outline:none"
        onfocus="this.style.borderColor='var(--cyan)'" onblur="this.style.borderColor='var(--border)'"
        onkeydown="if(event.key==='Enter')_slNameLaunch('${scenarioId}','${mode}')">
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button class="btn btn-outline" onclick="slShowLaunchModal('${scenarioId}')">← Back</button>
      <button class="btn btn-primary" onclick="_slNameLaunch('${scenarioId}','${mode}')">Launch exercise →</button>
    </div>`;

  setTimeout(() => document.getElementById('slFacNameInput')?.focus(), 50);
}

async function _slNameLaunch(scenarioId, mode) {
  const name = (document.getElementById('slFacNameInput')?.value || '').trim();
  if (!name) {
    const el = document.getElementById('slFacNameInput');
    if (el) { el.style.borderColor = '#dc2626'; el.focus(); }
    return;
  }

  slCloseLaunchModal();

  // Prime ttState and jump straight to the exercise — skip the setup screen
  if (!ttState) ttInit();
  ttState.scenarioId     = scenarioId;
  ttState.facilitatorName = name;
  ttState.mode           = mode === 'human_remote' ? 'remote' : 'local';

  // Switch nav so sidebar reflects tabletop as active
  activeNav = 'tabletop';
  if (typeof buildNav === 'function') buildNav();

  // Launch the session directly (creates Supabase record, moves to commentary / Step 0)
  await ttLaunchSession();
}

function slCloseLaunchModal() {
  const el = document.getElementById('slLaunchModal');
  if (el) el.remove();
}

function slDoLaunch(scenarioId, mode, facilitatorName) {
  slCloseLaunchModal();

  if (mode === 'ai_local') {
    if (!aittState) aittInit();
    aittState.scenarioId = scenarioId;
    aittState.view = 'setup';
    setNav('tt_ai');
    return;
  }

  if (mode === 'human_local' || mode === 'human_remote') {
    if (!ttState) ttInit();
    ttState.scenarioId = scenarioId;
    if (facilitatorName) ttState.facilitatorName = facilitatorName;
    ttState.view = 'setup';
    setNav('tabletop');
    return;
  }
}

// ──────────────────────────────────────────────────────────────────
// MAIN RENDER
// ──────────────────────────────────────────────────────────────────

function renderScenarioLibrary() {
  if (!currentOrg) return `<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">Select an organization to browse scenarios.</div>`;

  if (typeof exHubEnsureOp === 'function') exHubEnsureOp();

  const allScenarios = slBuildScenarioList();
  const filtered     = slApplyFilter(allScenarios);
  const loading      = slState.sessions === null;

  return `${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">🎯 Exercises</div>
      <div style="font-size:12px;color:var(--muted)">Tabletop exercises and scenario simulations for ${escH(currentOrg.name)}</div>
    </div>
  </div>

  ${_slExStatsHtml()}

  ${slComplianceAlerts(allScenarios)}

  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">${allScenarios.length} scenarios · ${filtered.length} shown</div>
  </div>

  ${slRenderFilterBar(allScenarios)}

  ${loading ? `
    <div style="text-align:center;padding:2rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,.2);border-top-color:var(--navy);width:20px;height:20px;margin:0 auto .75rem"></div>
      <div style="font-size:12px">Loading exercise history…</div>
    </div>
  ` : filtered.length === 0 ? `
    <div style="text-align:center;padding:3rem;color:var(--muted);border:2px dashed var(--border);border-radius:12px">
      <div style="font-size:2rem;margin-bottom:.5rem">🔍</div>
      <div style="font-size:13px;font-weight:700;margin-bottom:4px">No scenarios match</div>
      <div style="font-size:12px">Try clearing a filter above.</div>
    </div>
  ` : `
    <div style="display:flex;gap:.75rem;overflow-x:auto;padding-bottom:.5rem;-webkit-overflow-scrolling:touch">
      ${filtered.map(s => `<div style="flex-shrink:0;width:230px">${slRenderCard(s)}</div>`).join('')}
    </div>
  `}

  ${slRenderPastTests()}`;
}

// ──────────────────────────────────────────────────────────────────
// VIEW PAST AAR
// ──────────────────────────────────────────────────────────────────

async function slViewAAR(sessionId) {
  try {
    const [session, responses, notifChecks] = await Promise.all([
      sb.tt.getSession(sessionId),
      sbFetch(`tabletop_responses?session_id=eq.${sessionId}&select=*`),
      sbFetch(`tabletop_notif_checks?session_id=eq.${sessionId}&select=*`),
    ]);
    if (!session) { toast('Session not found', '#dc2626'); return; }
    const scenario = await tteLoadScenario(session.scenario_id);
    if (!scenario) { toast('Scenario data not found', '#dc2626'); return; }

    if (!ttState) ttInit();
    ttState.scenarioId      = session.scenario_id;
    ttState.sessionId       = session.id;
    ttState.sessionCode     = session.session_code;
    ttState.facilitatorName = session.facilitator_name || '';
    ttState.view            = 'aar';
    ttState.readonly        = true;
    ttState.declaration     = { severity: session.tl_severity || null, declare: session.tl_declare ?? null, assessment: session.tl_assessment || '' };
    ttState.breach          = { declared: session.breach_declared || false, rationale: session.breach_rationale || '', ic_sign_time: session.ic_sign_time || null, es_sign_time: session.es_sign_time || null };
    ttState.notifStartTime  = session.breach_timestamp || null;
    ttState.exerciseLog     = Array.isArray(session.exercise_log) ? session.exercise_log : [];
    ttState.irComparison    = session.ir_comparison || null;
    // Restore rubric scores into engine state so the card renders correctly
    tteClearRubric();
    if (session.rubric_scores && typeof session.rubric_scores === 'object') {
      Object.entries(session.rubric_scores).forEach(([dimId, data]) => {
        if (data && data.score) tteSetRubricScore(dimId, data.score, data.notes || '');
      });
    }

    ttState.responses = {};
    (responses || []).forEach(r => {
      if (!ttState.responses[r.inject_index]) ttState.responses[r.inject_index] = {};
      ttState.responses[r.inject_index][r.role_id] = { criticality: r.criticality, text: r.response_text };
    });

    ttState.notifChecks = {};
    (notifChecks || []).forEach(n => {
      ttState.notifChecks[n.item_id] = { checked: n.checked, checkedAt: n.checked_at };
    });

    tteInitEngine(scenario, 'local');
    // Restore the path the team actually took so the MITRE path map renders correctly
    if (Array.isArray(session.inject_path) && session.inject_path.length > 0) {
      tteState.injectPath = session.inject_path;
    }

    activeNav = 'tabletop';
    if (typeof buildNav === 'function') buildNav();
    ttRender();
  } catch (e) {
    toast('Could not load AAR — ' + e.message, '#dc2626');
    console.error(e);
  }
}

// ──────────────────────────────────────────────────────────────────
// PAST EXERCISES TABLE
// ──────────────────────────────────────────────────────────────────

function slRenderPastTests() {
  const aiRuns     = ((orgAssessments[currentOrg?.id] || {})['ai_tabletop'] || []);
  const opSessions = exHubState?.opSessions ?? null;
  if (opSessions === null) return '';

  const rows = [];
  aiRuns.forEach(r => {
    const a = r.answers || {};
    rows.push({ type: 'AI Run', date: r.date || r.assessed_at || '', scenario: a.scenarioName || a.scenarioId || '—', breach: null, severity: '—', score: typeof exCalcScore === 'function' ? exCalcScore({ type:'ai', rubric_scores: null }) : '—' });
  });
  opSessions.forEach(s => {
    rows.push({ type: 'Facilitator', date: s.created_at ? s.created_at.substring(0, 10) : '', scenario: s.scenario_title || '—', breach: s.breach_declared, severity: s.tl_severity || '—', id: s.id });
  });
  rows.sort((a, b) => b.date.localeCompare(a.date));

  if (rows.length === 0) return `
    <div style="margin-top:1.5rem">
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:.6rem">Past Exercises</div>
      <div style="padding:1.5rem;text-align:center;color:var(--muted);border:2px dashed var(--border);border-radius:10px;font-size:12px">No exercises run yet for ${escH(currentOrg?.name || '')}.</div>
    </div>`;

  const sevColor = s => s === 'P1' ? '#dc2626' : s === 'P2' ? '#d97706' : s === 'P3' ? '#2563eb' : '#6b7280';

  return `
  <div style="margin-top:1.5rem">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:.6rem">Past Exercises <span style="font-weight:400;color:var(--muted);font-size:11px">(${rows.length})</span></div>
    <div class="card" style="padding:0;overflow:hidden">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:#f8fafc;border-bottom:1px solid var(--border)">
            <th style="padding:9px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)">Date</th>
            <th style="padding:9px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)">Scenario</th>
            <th style="padding:9px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)">Type</th>
            <th style="padding:9px 14px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)">Severity</th>
            <th style="padding:9px 14px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)">Breach</th>
            <th style="padding:9px 14px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)"></th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => {
            const clickable = !!r.id;
            const rowStyle = `border-bottom:1px solid var(--border);${i % 2 === 1 ? 'background:#fafbfc;' : ''}${clickable ? 'cursor:pointer;' : ''}`;
            const click = clickable ? `onclick="slViewAAR('${r.id}')" onmouseenter="this.style.background='#eef2ff'" onmouseleave="this.style.background='${i % 2 === 1 ? '#fafbfc' : '#fff'}'"`  : '';
            return `<tr style="${rowStyle}" ${click}>
              <td style="padding:9px 14px;color:var(--muted);white-space:nowrap">${r.date}</td>
              <td style="padding:9px 14px;font-weight:600;color:var(--text);max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escH(r.scenario)}</td>
              <td style="padding:9px 14px;color:var(--muted)">${r.type}</td>
              <td style="padding:9px 14px;text-align:center">
                ${r.severity && r.severity !== '—' ? `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;background:${sevColor(r.severity)}1a;color:${sevColor(r.severity)}">${r.severity}</span>` : '<span style="color:var(--muted)">—</span>'}
              </td>
              <td style="padding:9px 14px;text-align:center">
                ${r.breach === true ? '<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;background:#fee2e2;color:#dc2626">Declared</span>' : r.breach === false ? '<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;background:#dcfce7;color:#15803d">Contained</span>' : '<span style="color:var(--muted)">—</span>'}
              </td>
              <td style="padding:9px 14px;text-align:center;color:var(--muted);font-size:11px">${clickable ? '→ AAR' : ''}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ──────────────────────────────────────────────────────────────────
// WINDOW EXPORTS
// ──────────────────────────────────────────────────────────────────

window.renderScenarioLibrary = renderScenarioLibrary;
window.slEnsureData          = slEnsureData;
window.slSetFilter           = slSetFilter;
window.slClearFilters        = slClearFilters;
window.slLaunchScenario      = slLaunchScenario;
window.slShowLaunchModal     = slShowLaunchModal;
window.slViewAAR             = slViewAAR;
window.slCloseLaunchModal    = slCloseLaunchModal;
window.slDoLaunch            = slDoLaunch;
window._slModalNameStep      = _slModalNameStep;
window._slNameLaunch         = _slNameLaunch;
