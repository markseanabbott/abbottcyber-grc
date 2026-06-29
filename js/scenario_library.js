// ============================================================
// SCENARIO LIBRARY — Browse and launch tabletop scenarios
// Platform-layer library with compliance frequency tracking
// and org-aware role hints from onboarding profile data.
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
};

// ── Frequency recommendation labels ───────────────────────────────
const SL_FREQ = {
  annual:      { label: 'Annual',             months: 12 },
  semi_annual: { label: 'Semi-annual',        months: 6  },
  quarterly:   { label: 'Quarterly',          months: 3  },
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
      const rows = await sbFetch(`/rest/v1/tabletop_scenarios?status=eq.published&select=id,title,industry,difficulty,duration,summary,tags,injects,compliance_tags`, 'GET');
      slState.dbScenarios = Array.isArray(rows) ? rows : [];
    } catch (e) {
      slState.dbScenarios = [];
    }
    changed = true;
  }

  if (changed && activeNav === 'scenario_library') {
    document.getElementById('mainContent').innerHTML = renderScenarioLibrary();
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
    _source:  'db',
    _meta: {
      threatProfiles: [],
      industries:     s.industry ? [s.industry] : ['All'],
      compliance:     Array.isArray(s.tags) ? s.tags.filter(t => SL_COMPLIANCE[t]) : [],
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
  slEnsureData();
}

// ──────────────────────────────────────────────────────────────────
// COMPLIANCE ALERT BANNER
// ──────────────────────────────────────────────────────────────────

function slComplianceAlerts(scenarios) {
  if (!slState.sessions) return '';
  const profile = currentOrg ? (orgProfiles[currentOrg.id] || null) : null;

  // Determine which compliance programs are relevant to this org
  const relevantPrograms = new Set();
  const orgCompliance = profile ? (profile.regulatory_scope || []) : [];
  if (Array.isArray(orgCompliance)) orgCompliance.forEach(c => relevantPrograms.add(c));
  if (profile?.handles_health_data)   relevantPrograms.add('hipaa');
  if (profile?.handles_payment_data)  relevantPrograms.add('pci_dss');
  relevantPrograms.add('cyber_insurance'); // always relevant

  // Find overdue compliance programs across all scenarios for this org
  const overdue = [];
  relevantPrograms.forEach(prog => {
    if (!SL_COMPLIANCE[prog]) return;
    const cfg = SL_COMPLIANCE[prog];
    // Find the most recent run of ANY scenario tagged with this program
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
    <!-- Card header -->
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

    <!-- Card body -->
    <div style="padding:12px 14px;flex:1;display:flex;flex-direction:column;gap:8px">
      <!-- Summary -->
      <div style="font-size:11px;color:var(--muted);line-height:1.5">${escH((s.summary || '').slice(0, 180))}${(s.summary || '').length > 180 ? '…' : ''}</div>

      <!-- Threat chips -->
      ${threatChips ? `<div style="display:flex;flex-wrap:wrap;gap:4px">${threatChips}</div>` : ''}

      <!-- Compliance badges -->
      ${complianceBadges ? `<div style="display:flex;flex-wrap:wrap;gap:4px">${complianceBadges}</div>` : ''}

      <!-- Freq + last run -->
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

      <!-- Role hints -->
      ${hintHtml}
    </div>

    <!-- Launch footer -->
    <div style="border-top:1px solid var(--border);padding:10px 14px;display:flex;gap:6px;align-items:center">
      <button class="btn btn-primary btn-sm" style="flex:1" onclick="slLaunchScenario('${s.id}')">Launch →</button>
    </div>
  </div>`;
}

// ──────────────────────────────────────────────────────────────────
// FILTER BAR
// ──────────────────────────────────────────────────────────────────

function slRenderFilterBar(scenarios) {
  const f = slState.filter;

  const industries = [...new Set(scenarios.flatMap(s => s._meta?.industries || []))].sort();
  const threats    = [...new Set(scenarios.flatMap(s => s._meta?.threatProfiles || []))].sort();
  const programs   = [...new Set(scenarios.flatMap(s => s._meta?.compliance || []))].sort();
  const diffs      = ['Easy', 'Medium', 'Hard'];

  function sel(key, val, label) {
    const active = f[key] === val;
    return `<button onclick="slSetFilter('${key}','${val}')"
      style="font-size:11px;font-weight:${active ? '700' : '500'};padding:4px 10px;border-radius:20px;border:1.5px solid ${active ? 'var(--navy)' : 'var(--border)'};background:${active ? 'var(--navy)' : '#fff'};color:${active ? '#fff' : 'var(--text)'};cursor:pointer;white-space:nowrap">
      ${label}
    </button>`;
  }

  return `<div style="margin-bottom:1.25rem">
    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:8px">
      <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;white-space:nowrap">Industry</span>
      ${sel('industry', 'all', 'All')}
      ${industries.filter(i => i !== 'All').map(i => sel('industry', i, i)).join('')}
      ${industries.includes('All') ? sel('industry', 'All', 'All verticals') : ''}
    </div>
    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:6px">
      <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;white-space:nowrap">Threat</span>
      ${sel('threat', 'all', 'All')}
      ${threats.map(t => sel('threat', t, SL_THREAT_LABELS[t] || t)).join('')}
    </div>
    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:6px">
      <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;white-space:nowrap">Compliance</span>
      ${sel('compliance', 'all', 'All')}
      ${programs.map(p => {
        const cfg = SL_COMPLIANCE[p] || {};
        return sel('compliance', p, (cfg.icon ? cfg.icon + ' ' : '') + (cfg.label || p));
      }).join('')}
    </div>
    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:6px">
      <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;white-space:nowrap">Difficulty</span>
      ${sel('difficulty', 'all', 'All')}
      ${diffs.map(d => sel('difficulty', d, d)).join('')}
    </div>
  </div>`;
}

// ──────────────────────────────────────────────────────────────────
// MAIN RENDER
// ──────────────────────────────────────────────────────────────────

function renderScenarioLibrary() {
  if (!currentOrg) return `<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">Select an organization to browse scenarios.</div>`;

  const allScenarios  = slBuildScenarioList();
  const filtered      = slApplyFilter(allScenarios);
  const loading       = slState.sessions === null;

  const profile = orgProfiles[currentOrg.id] || null;
  const orgIndustry = profile?.industry || currentOrg.industry || '';

  return `${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📚 Scenario Library</div>
      <div style="font-size:12px;color:var(--muted)">${allScenarios.length} scenarios available · ${filtered.length} shown · ${currentOrg.name}</div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-outline btn-sm" onclick="setNav('exercises')">← Exercises</button>
      <button class="btn btn-outline btn-sm" onclick="setNav('tabletop')">Run exercise</button>
    </div>
  </div>

  ${slComplianceAlerts(allScenarios)}

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
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem">
      ${filtered.map(s => slRenderCard(s)).join('')}
    </div>
  `}

  ${!loading && filtered.length > 0 ? `
    <div style="margin-top:1.5rem;padding:12px 16px;background:#f8fafc;border-radius:10px;border:1px solid var(--border)">
      <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:4px">💡 Frequency guidance</div>
      <div style="font-size:11px;color:var(--muted);line-height:1.6">
        <strong>Cyber insurance</strong> underwriters typically require annual tabletop evidence.
        <strong>CMMC L2</strong> requires annual incident response exercises (3.6.2).
        <strong>HIPAA</strong> Security Rule §164.308(a)(8) requires periodic testing and revision of contingency plans.
        <strong>PCI DSS</strong> Req 12.10.2 requires annual IR plan testing.
        Exercise history is tracked per organization and visible in the <a href="#" onclick="setNav('exercises');return false" style="color:var(--cyan)">Exercises hub</a>.
      </div>
    </div>
  ` : ''}`;
}

// ──────────────────────────────────────────────────────────────────
// LAUNCH ACTION
// ──────────────────────────────────────────────────────────────────

function slLaunchScenario(scenarioId) {
  if (!ttState) ttInit();
  ttState.view = 'setup';
  ttState.scenarioId = scenarioId;
  setNav('tabletop');
}

// ──────────────────────────────────────────────────────────────────
// WINDOW EXPORTS
// ──────────────────────────────────────────────────────────────────

window.renderScenarioLibrary = renderScenarioLibrary;
window.slEnsureData          = slEnsureData;
window.slSetFilter           = slSetFilter;
window.slLaunchScenario      = slLaunchScenario;
