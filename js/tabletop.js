// ============================================================
// TABLETOP — Operational Track (full engine, wired to Supabase)
// ============================================================
// State persists across re-renders via in-memory ttState; Supabase rows mirror it.
// Page reload mid-exercise will lose in-memory state — multiplayer / resume is the
// next backlog item (mp1..mp15) and will add code-based session rehydration.

const TT_ROLES = [
  { id: 'ic', name: 'Incident Commander', icon: '&#x1F9ED;', desc: 'vCISO. Owns coordination, calls the shots, signs the breach.' },
  { id: 'tl', name: 'Technical Lead',     icon: '&#x1F6E0;&#xFE0F;', desc: 'Senior tech. Drives containment, eradication, root cause.' },
  { id: 'cl', name: 'Communications Lead',icon: '&#x1F4E3;', desc: 'Internal + external messaging, holding statements.' },
  { id: 'lc', name: 'Legal / Compliance', icon: '&#x2696;&#xFE0F;', desc: 'Privacy regs, breach clocks, evidence preservation.' },
  { id: 'es', name: 'Executive Sponsor',  icon: '&#x1F454;', desc: 'Assumed role. Business decisions, co-signs the breach.' },
];

const TT_NIST_PHASES = ['Preparation','Detection & Analysis','Containment','Eradication','Recovery','Post-Incident'];

// Standard MITRE ATT&CK Enterprise tactic ordering (left to right)
const MITRE_TACTICS_LIST = [
  { id: 'TA0043', name: 'Reconnaissance' },
  { id: 'TA0042', name: 'Resource Development' },
  { id: 'TA0001', name: 'Initial Access' },
  { id: 'TA0002', name: 'Execution' },
  { id: 'TA0003', name: 'Persistence' },
  { id: 'TA0004', name: 'Privilege Escalation' },
  { id: 'TA0005', name: 'Defense Evasion' },
  { id: 'TA0006', name: 'Credential Access' },
  { id: 'TA0007', name: 'Discovery' },
  { id: 'TA0008', name: 'Lateral Movement' },
  { id: 'TA0009', name: 'Collection' },
  { id: 'TA0011', name: 'Command & Control' },
  { id: 'TA0010', name: 'Exfiltration' },
  { id: 'TA0040', name: 'Impact' },
];

// Derive ordered inject index sequence from tteState.injectPath (shared by path map + matrix)
function ttGetDisplayPath() {
  const ip = tteState.injectPath || [];
  if (ip.length === 0) return [];
  const path = ip.map(p => p.index);
  const last = ip[ip.length - 1];
  const sc = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  const lastInj = sc && sc.injects[last.index];
  const br = lastInj && lastInj.branches
    ? (lastInj.branches.find(b => b.id === last.branchTaken) || lastInj.branches[0])
    : null;
  if (br && br.next_index != null) path.push(br.next_index);
  return path;
}

// Parse tactic/technique strings from inject.mitre (handles "TA0001 Name + TA0002 Name" format)
function ttParseMitreInject(mitre) {
  const out = { tactics: [], techniques: [] };
  if (!mitre) return out;
  (mitre.tactic || '').split(/\s*\+\s*/).forEach(t => {
    const m = t.trim().match(/^(TA\d{4})\s+(.+)$/);
    if (m) out.tactics.push({ id: m[1], name: m[2].trim() });
  });
  (mitre.technique || '').split(/\s*\+\s*/).forEach(t => {
    const m = t.trim().match(/^(T\d{4}(?:\.\d{3})?)\s+(.+)$/);
    if (m) out.techniques.push({ id: m[1], name: m[2].trim() });
  });
  return out;
}

const TT_SCENARIOS = {
  ransom_phish: {
    id: 'ransom_phish',
    title: 'Ransomware via Phishing',
    industry: 'Hospitality',
    duration: '~90 min',
    difficulty: 'Hard',
    summary: 'Front-desk workstation triggers ransomware behaviour. Lateral movement to PMS server. Exfiltration claim. Recovery decision under operational pressure.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'The Grand Hotel — front desk supervisor',
      raw: 'Front desk PC is showing pop-ups demanding payment. Files won\'t open and have weird extensions. Two other front desk machines look the same. Guests waiting to check in.',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'SOC alert',
        title: 'EDR confirms ransomware behaviour across 4 hosts',
        body: 'CrowdStrike has quarantined a LockBit-style payload (sha256 a93f…e612) on FRONT-DESK-02. Telemetry shows the same parent process tree (winword.exe → powershell.exe → rundll32.exe) on FRONT-DESK-01, FRONT-DESK-03 and BO-PMS-01. Encrypted files carry the .lockd extension.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0040 Impact', technique: 'T1486 Data Encrypted for Impact' },
        rolePrompts: {
          ic: 'Formally declare and activate the IR plan. Stand up war room, channels, cadence. Who owns what for the next 60 min?',
          tl: 'Containment priorities: kill switches, EDR isolation, segmentation. Confirm scope. Technical actions in the next 15 min?',
          cl: 'Holding-statement scope. Anything to guests yet? Internal staff comms now?',
          lc: 'Evidence preservation triggers. Has the privacy clock started yet? What are you logging now for downstream disclosure?',
          es: 'Operational continuity: front desk has stopped check-in. Authorise manual fallback?',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Lateral movement to PMS server suspected',
        body: 'Domain controller logs show unusual Kerberos TGT activity from a front-desk service account. PMS (Property Management System — reservations + folio) server is showing the same parent process tree. EDR has isolated BO-PMS-01. Reservations are offline.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0008 Lateral Movement', technique: 'T1021.002 SMB / Windows Admin Shares' },
        rolePrompts: {
          ic: 'Containment posture: full network segmentation vs targeted isolation? Coordinate with TL and brief ES on revenue impact.',
          tl: 'Disable the compromised service account. Emergency ACLs. Verify AD, file server, backup server. Action plan?',
          cl: 'Front desk fully down. What goes out internally? Guests still in the dark — for how long?',
          lc: 'Formal evidence chain. Outside counsel engaged? Carrier notification on standby — what threshold trips it?',
          es: 'Authorise manual check-in / check-out. Notify the GM. Approve staff overtime.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Ransom note found — exfiltration claim',
        body: 'Ransom note on encrypted hosts: $250,000 USD in BTC, 72-hour clock. The note claims 80GB of guest data exfiltrated including PII and stored credit card tokens from the PMS database. A sample file tree is provided as proof.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1567 Exfiltration Over Web Service' },
        rolePrompts: {
          ic: 'Frame the ransom decision input for the ES — do not negotiate yourself. Validate the exfil claim with TL.',
          tl: 'Egress log review. Did any large outbound transfers actually happen, and where to? Pull firewall + proxy logs for the last 72 hours.',
          cl: 'Draft guest notification template now — do not send. Get legal sign-off lined up.',
          lc: 'US breach notification assessment is now live. Is there a risk of harm to affected individuals? Engage cyber counsel formally.',
          es: 'Convene the exec call. Ransom decision is yours. Insurance carrier on the line.',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'Exfiltration confirmed — 78GB to mega.nz',
        body: 'Firewall logs confirm 78GB outbound to mega.nz endpoints over a 6-hour window yesterday between 02:00–08:00. PMS DB export of similar size matches. Guest PII and tokenized cards within scope. This is a breach.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1041 Exfiltration Over C2 Channel' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'Trigger the breach declaration gate. Coordinate co-sign with ES below. Once declared, the notification clock starts.',
          tl: 'Scope the exfiltrated dataset: exact records, fields, time range. Forensic image of affected hosts.',
          cl: 'Activate the guest notification plan. Prepare a media holding statement.',
          lc: 'Notification clocks: FTC and applicable state law. 72h to carrier per policy. Engage breach coach.',
          es: 'Co-sign breach declaration with IC. Brief GM and ownership. Authorise carrier engagement.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Recovery decision — restore or rebuild',
        body: 'All hotel operations on manual. 247 reservations in the next 7 days, 89 guests in-house. PMS backup from 18 hours ago verified clean by IR firm. Restore-to-clean window: ~4 hours. Full rebuild from baseline: ~36 hours.',
        phaseIdx: 4,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Recovery phase', technique: 'NIST SP 800-61 Recovery' },
        rolePrompts: {
          ic: 'Restore vs rebuild decision. Trade off uptime vs residual risk. Recommend to ES.',
          tl: 'Backup integrity verification, restoration sequence, AD password reset campaign, EDR re-baseline.',
          cl: 'Guest-facing script for tonight. Social media holding pattern. Loyalty program members?',
          lc: 'Documentation pack for the insurance claim. Preserve forensic image regardless of restore choice.',
          es: 'Approve recovery path. Confirm financial sign-off. Brief carrier on restore plan.',
        },
      },
    ],
  },
  bec_wire: {
    id: 'bec_wire',
    title: 'Business Email Compromise — Wire Fraud',
    industry: 'Technology / SaaS',
    duration: '~45 min',
    difficulty: 'Medium',
    summary: 'CEO M365 account compromised via MFA fatigue. Fraudulent $47K wire authorised through hijacked Teams + email. Recall window closing.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'CloudStack Inc. — CFO assistant',
      raw: 'CEO is asking why we paid a $47,000 invoice he says he never approved. Wire went out yesterday afternoon to a bank account he doesn\'t recognise. Finance says they got a Teams message and email from him approving it.',
      correctSeverity: 'P2',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'SOC + technician',
        title: 'CEO M365 account compromise confirmed',
        body: 'M365 audit log shows successful sign-in to CEO account from an IP geolocated in Eastern Europe yesterday at 02:14 local. MFA was satisfied via push (one-tap fatigue suspected). An inbox rule is auto-deleting messages from the real CFO and forwarding to an external address. Teams session token was active for 9 hours.',
        phaseIdx: 1,
        correctCriticality: 'High',
        mitre: { tactic: 'TA0001 Initial Access + TA0006 Credential Access', technique: 'T1566 Phishing + T1078 Valid Accounts' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'Scope assessment: just the CEO account, or wider compromise? Decide on global session revocation + MFA reset campaign.',
          tl: 'M365 audit: every login location for all execs in the last 30 days. Revoke tokens. Remove inbox rules. Check OAuth app grants.',
          cl: 'Internal-only at this stage. Brief the leadership team via a secure channel — not email.',
          lc: 'Bank fraud reporting clock (24–48h for any wire recall hope). FBI IC3 cyber crime report. Cyber insurance carrier notification (crime + funds-transfer-fraud rider). SEC implications if material.',
          es: 'Call the bank now — invoke wire recall. Notify the board chair. Confirm coverage with carrier.',
        },
      },
      {
        ingest: 'Bank + finance team',
        title: 'Wire recall window closing — bank requests decision',
        body: 'The bank has reached the correspondent institution. The $47K has landed in a receiving account but has not yet been withdrawn. The bank can attempt a SWIFT gpi recall but requires written authorisation from an account signatory within 90 minutes. In parallel, M365 forensics reveals two other executive accounts (CFO, VP Sales) also received MFA fatigue push attempts in the same window — one (CFO) shows a successful login from the same Eastern European IP range.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0040 Impact + TA0006 Credential Access', technique: 'T1657 Financial Theft + T1621 MFA Request Generation' },
        triggersBreach: false,
        rolePrompts: {
          ic: 'Two decisions in parallel: authorise the wire recall within 90 min, and decide on scope — the CFO account is also compromised. Do you broaden the incident?',
          tl: 'CFO account is confirmed compromised — revoke immediately. Audit all financial system access that used CFO credentials in the past 48 hours. Check for any additional wire instructions or approvals.',
          cl: 'Wire recall authorisation needs a company signatory on record with the bank — co-ordinate with finance. Ensure no email is used for this communication. Document everything for the insurance claim.',
          lc: 'SEC material event analysis: two executive accounts and a confirmed wire loss. If the company is public, assess disclosure obligation. Prepare holding statement for the board.',
          es: 'Provide signatory authorisation to the bank for the recall attempt. Notify the board of the expanded compromise scope. Confirm whether the cyber crime + funds-transfer-fraud insurance riders both apply.',
        },
      },
      {
        ingest: 'IT security + finance',
        title: 'Second fraudulent payment instruction intercepted',
        body: 'Finance flags a second wire request for $118K submitted via email late last night — sent from the CFO account, citing an urgent supplier settlement. The wire has not yet been processed because a junior AP clerk noticed the bank details did not match the supplier\'s master record. Full M365 forensics is back: both CEO and CFO accounts had attacker-controlled inbox rules in place for at least 6 days. All email sent to or from those accounts during that window should be treated as potentially read or manipulated by the attacker.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0009 Collection + TA0040 Impact', technique: 'T1114 Email Collection + T1657 Financial Theft' },
        triggersBreach: false,
        rolePrompts: {
          ic: 'The attacker had eyes on executive email for 6 days. Treat all decisions made via those accounts in that window as potentially poisoned. What do you freeze, re-verify, or escalate to the board?',
          tl: 'Pull every outbound email sent from CEO and CFO accounts in the 6-day window. Identify any other payment instructions, contract approvals, or sensitive data disclosures. Produce a list for legal review.',
          cl: 'Six days of email access means privilege may be compromised if legal counsel emailed those accounts. Identify all sensitive communications at risk. Advise IC on whether affected business decisions need to be unwound.',
          lc: 'Prepare a communication to affected suppliers and counterparties: do not act on any payment or contract instruction received from CEO or CFO email in the defined window without verbal re-confirmation.',
          es: 'Brief the board: the scope has materially expanded. Two executives, 6 days of access, one confirmed loss, one intercepted attempt. Request emergency board session to assess potential business decision impact.',
        },
      },
      {
        ingest: 'Legal + IT security + insurance',
        title: 'Attacker evicted — notification and recovery decisions',
        body: 'All attacker access has been revoked. MFA has been reset for all executives and legacy auth blocked. The wire recall attempt on the $47K was partially successful — $31K has been returned, $16K is unrecoverable as it was withdrawn. The $118K attempt was blocked. Total confirmed loss is $16K. The cyber insurer has accepted the claim in principle under the funds-transfer-fraud rider. However, the insurer\'s forensic team has flagged that the MFA policy at the time did not require number-matching, which they may cite as a contributing control failure when settling.',
        phaseIdx: 3,
        correctCriticality: 'Medium',
        mitre: { tactic: 'TA0043 Reconnaissance', technique: 'T1589 Gather Victim Identity Information' },
        triggersBreach: false,
        rolePrompts: {
          ic: 'Claim is in principle accepted but the insurer may dispute the settlement amount due to the MFA control gap. Do you fight it or accept? What controls are you committing to in the AAR?',
          tl: 'Implement number-matching MFA org-wide immediately. Remove all legacy authentication. Deploy conditional access policies blocking overseas logins. Provide IC with a written hardening plan.',
          cl: 'Review the insurer\'s reservation about the MFA control gap — assess whether it represents a coverage dispute or a negotiation. Advise whether to contest or settle. Confirm notification obligations to any counterparties whose contracts may have been affected.',
          lc: 'Prepare the post-incident narrative for internal and (if required) external communication: losses minimised, attacker evicted, controls strengthened. No proactive public disclosure required at this loss level, but draft a reactive statement.',
          es: 'Close the loop with the board: final loss is $16K net of recovery, claim accepted in principle. Present the hardening roadmap. Confirm whether D&O or crime coverage has any additional applicability.',
        },
      },
    ],
  },
  overnight_vishing: {
    id: 'overnight_vishing',
    title: 'Overnight Vishing — Fake PMS Support Call',
    industry: 'Hospitality',
    duration: '~45 min',
    difficulty: 'Medium',
    summary: 'Front desk staffer receives a 3am call from a convincing "Agilysys support" caller and grants remote access. Attacker installs a RAT, harvests domain admin credentials, and queries the guest database before the morning shift arrives.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'The Grand Hotel — Night Manager',
      raw: 'Front desk called me at 3:20am. One of the overnight staff got a call from someone claiming to be Agilysys support — they said there was a critical crash coming in the next hour. They asked her to download a remote support tool and let them in to fix it. She did. I don\'t know if it was legitimate. The caller ID showed a 1-800 number. The session was open for about 40 minutes.',
      correctSeverity: 'P2',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'Technician anomaly',
        title: 'Remote access tool confirmed — RAT installed',
        body: 'IR triage on FRONT-DESK-04 (overnight workstation) finds AnyDesk installed at 03:22 with a silent-install flag. A second process, svchost32.exe (not a legitimate Windows binary), was launched from the AnyDesk session and persists via a scheduled task. VirusTotal flags it as a commodity RAT with C2 callout to a Ukraine-hosted IP. AnyDesk session log shows the remote party browsed the file system for 38 minutes.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access', technique: 'T1566.004 Phishing — Vishing' },
        rolePrompts: {
          ic: 'Is this isolated to one workstation, or did the attacker pivot during those 38 minutes? Contain the host and stand up the war room. What do you need confirmed in the next 15 minutes?',
          tl: 'Isolate FRONT-DESK-04 immediately. Pull the AnyDesk session log for exact file and folder access. Check whether the service account on that machine has access to the PMS. Any other hosts phoning home to the same C2 IP?',
          cl: 'Night staff are shaken. What do you communicate internally right now, and to whom? Nothing external yet — what is your holding position?',
          lc: 'You have a live attacker with a RAT still running. Evidence preservation before containment, or containment first? What is your legal instruction to the TL?',
          es: 'Night Manager is asking whether to wake the GM. What is your call? Operational risk: overnight shift has one person on front desk.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Credential harvesting confirmed — domain admin captured',
        body: 'Memory forensics on FRONT-DESK-04 reveals a keylogger module embedded in the RAT payload. Captured credentials include the PMS service account (HOTEL\\pms_svc) and a domain admin account used by the night IT supervisor earlier that evening. Active Directory shows both accounts used from the C2 IP at 04:01 — 19 minutes after the AnyDesk session closed. The attacker is still in the environment.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0006 Credential Access', technique: 'T1056.001 Keylogging' },
        rolePrompts: {
          ic: 'The attacker has domain admin credentials and is actively using them. Full segmentation or targeted account lockout? Co-ordinate with TL immediately — every minute increases scope.',
          tl: 'Disable HOTEL\\pms_svc and the domain admin account now — accept the PMS downtime. Force a global AD password reset for all privileged accounts. Enumerate every login from the C2 IP in the last 6 hours.',
          cl: 'Morning shift starts in 3 hours. Front desk will have no PMS access at handover. What is the internal comms plan for arriving staff?',
          lc: 'Domain admin compromise expands blast radius significantly. What data could a domain admin reach? Begin a formal record of every action taken since 03:22.',
          es: 'Authorise emergency PMS downtime. Manual check-in procedures. Wake the GM — you are out of time.',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'PMS database queried — 6,200 guest records accessed',
        body: 'PMS query logs show the pms_svc account ran a bulk SELECT on guest_profiles and folio_transactions between 04:03 and 04:41, returning 6,200 rows. Fields include: full name, email, phone, nationality, passport number, loyalty ID, and tokenized card references. Logs also show a compressed archive (guests_export.7z) created on the PMS server at 04:44.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1005 Data from Local System' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'This is a breach. Trigger the breach declaration gate — co-sign with ES. The notification clock starts from the moment you confirm this. Coordinate the timeline.',
          tl: 'Was guests_export.7z exfiltrated? Pull firewall egress logs for the pms_svc account between 04:44 and now. Determine if the file left the building.',
          cl: 'Guest notification is now a matter of when, not if. Begin drafting the notification template. Do not send without legal sign-off.',
          lc: 'US breach notification: passport numbers and tokenized cards for 6,200 guests. Risk of harm is near-certain. 72-hour FTC/state clock is starting. Engage cyber counsel now.',
          es: 'Co-sign the breach declaration with IC. Brief the GM and ownership. Confirm the cyber insurance carrier has been notified — crime and privacy coverage.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Agilysys confirms no outbound support call was made',
        body: 'Agilysys support confirms they have no record of any outbound call to the hotel last night. The 1-800 number was a spoofed VOIP line. The attack was fully manufactured — no legitimate vendor involvement. The staff member acted in good faith. The caller had detailed knowledge of the hotel\'s PMS version and support processes, suggesting prior reconnaissance.',
        phaseIdx: 5,
        correctCriticality: 'High',
        mitre: { tactic: 'TA0043 Reconnaissance', technique: 'T1598 Phishing for Information' },
        rolePrompts: {
          ic: 'Wrap your incident timeline for the AAR. Root cause is a process gap — no callback verification for vendor support. What is your immediate procedural recommendation?',
          tl: 'Technical hardening list: what controls would have caught or blocked this? Caller ID verification policy, AnyDesk block list, PMS DB activity monitoring. Prioritise top 3 for the AAR.',
          cl: 'The staff member is likely distressed. How do you communicate internally that this was not her fault, while still documenting the process failure?',
          lc: 'Insurance claim documentation. Staff training records. Vendor impersonation is a growing attack vector — does your incident policy cover social engineering losses?',
          es: 'What is the hotel\'s liability to the 6,200 affected guests? Loyalty program impact? Review third-party breach notification obligations with counsel.',
        },
      },
    ],
  },
  pos_compromise: {
    id: 'pos_compromise',
    title: 'POS Skimmer — F&B and Spa Terminals',
    industry: 'Hospitality',
    duration: '~50 min',
    difficulty: 'Hard',
    summary: 'Bank fraud alerts flag unusual card activity traced to hotel restaurant and spa POS terminals. Memory-scraping malware has been running silently for 11 days. PCI DSS notification obligations are immediate.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'The Grand Hotel — F&B Manager',
      raw: 'Three guests called today saying their card was fraudulently charged elsewhere within hours of paying at our restaurant. We also got a call from Moneris — our acquiring bank — saying they have received a Common Point of Purchase alert and are asking us to initiate a PCI incident response. I have no idea what that means.',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'Technician anomaly',
        title: 'Memory-scraping malware found on 4 POS terminals',
        body: 'IR review of restaurant and spa POS terminals (Windows Embedded, Micros Simphony) finds a memory-scraper process (posprint.exe) injected into the payment application on 4 of 6 terminals. The malware harvests Track 1 and Track 2 card data from RAM at the moment of swipe, before encryption. Log timestamps show first execution 11 days ago. An encrypted batch file is exfiltrated to an external IP every 6 hours.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0006 Credential Access', technique: 'T1185 Browser Session Hijacking' },
        rolePrompts: {
          ic: 'Containment vs monitoring trade-off: shutting down terminals tips off the attacker. Leaving them running means more cards captured. Dinner service is in 2 hours. What is your call?',
          tl: 'How do you isolate the 4 infected terminals without alerting the attacker and without shutting down F&B operations? Network segmentation options on the POS VLAN?',
          cl: 'Restaurant and spa are still open. Staff do not know. What do you tell operations management right now, and what customer-facing steps — if any — do you take tonight?',
          lc: 'PCI DSS requires you notify your acquirer immediately upon confirmation of cardholder data compromise. Moneris already called. What is your response to them in the next 30 minutes?',
          es: 'Dinner service in 2 hours. Do you close the restaurant, switch to cash-only, or continue with monitoring in place? Revenue vs liability. Your call.',
        },
      },
      {
        ingest: 'SOC alert',
        title: '11 days of dwell time — 2,400 cards estimated captured',
        body: 'Forensic analysis of the malware\'s exfiltration logs estimates 2,412 unique payment cards captured: PAN, expiry, cardholder name, service code. No PIN data in scope. Guest names are not directly linked, but cross-referencing PMS folio data could identify many cardholders. The attack has been running since before the last quarterly PCI vulnerability scan.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1020 Automated Exfiltration' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'Trigger the breach declaration. 2,400+ cards is a PCI reportable incident. Coordinate co-sign with ES and begin the formal notification sequence.',
          tl: '11 days of compromise means the breach window predates our last PCI scan. How did the malware get installed? Check for any external-facing management interfaces on the POS network segment.',
          cl: 'The acquiring bank is waiting. Media will follow if 2,400 cardholders start reporting fraud. Draft a holding statement and brief the communications chain for possible public disclosure.',
          lc: 'PCI DSS Level 1 incident: acquirer notified within 24h, card brands within 24–72h. Engage a forensic QSA via carrier. State breach notification law may apply if guest data links. Brief the board on liability exposure.',
          es: 'Authorise the QSA engagement. Confirm cyber insurance covers PCI — crime and fines rider. Estimated card replacement cost for 2,400 cards is significant. Get a number.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Initial access vector — unpatched VPN management console',
        body: 'The QSA identifies the infection vector: the POS network had an internet-facing GlobalProtect VPN console running a version vulnerable to CVE-2024-3400, unpatched. The attacker exploited it 12 days ago, landed on the POS VLAN, and deployed the scraper. The CVE was in the public advisory list 6 weeks prior. PCI DSS Requirement 6.3.3 (timely patching) was not met.',
        phaseIdx: 3,
        correctCriticality: 'High',
        mitre: { tactic: 'TA0001 Initial Access', technique: 'T1190 Exploit Public-Facing Application' },
        rolePrompts: {
          ic: 'Root cause is a known patchable CVE we missed. How does this affect your narrative with card brands, the insurer, and any regulatory response?',
          tl: 'Eradication plan: patch the VPN, wipe and rebuild all POS terminals, rotate all in-scope credentials, re-segment the POS VLAN. Timeline and ownership?',
          cl: 'The patching failure may become public if card brands conduct a formal investigation. Brief the GM on the possibility of press coverage referencing a security gap.',
          lc: 'Failure to patch a known CVE is a PCI DSS finding. This may affect your SAQ/ROC status and could attract card brand fines. What is the insurance coverage position on regulatory fines?',
          es: 'Terminal replacement budget approval. POS vendor emergency deployment timeline. Confirm downtime estimate for restaurant and spa with the GM.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Card brands demand forensic report within 5 business days',
        body: 'Visa and Mastercard have each issued formal demand letters requiring a completed PFI (Payment Forensic Investigator) report within 5 business days. Failure to comply risks escalation to a Level 1 on-site audit and potential card acceptance suspension. The QSA says a full PFI typically takes 2–4 weeks. A conflict exists between the demand timeline and forensic reality.',
        phaseIdx: 5,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Post-Incident', technique: 'PCI DSS Forensic Investigation' },
        rolePrompts: {
          ic: 'You cannot deliver a full PFI in 5 days. How do you respond to the card brands? Who owns the Visa and Mastercard relationship during this period?',
          tl: 'Prepare an interim technical findings summary the QSA can submit as a progress report. What can be documented and verified within 5 days?',
          cl: 'Operations wants to know when the restaurant and spa will be normal. What is your answer without disclosing legally sensitive information?',
          lc: 'Outside counsel should manage all card brand communications — this is legally privileged. What immediate actions do you instruct for the 5-day response window?',
          es: 'Authorise outside counsel to respond to card brands directly. Confirm cyber insurance is covering QSA costs and card replacement reimbursement. What is the total estimated exposure?',
        },
      },
    ],
  },
  msp_rma_pivot: {
    id: 'msp_rma_pivot',
    title: 'RMM Compromise — MSP Supply Chain Pivot',
    industry: 'MSP',
    duration: '~60 min',
    difficulty: 'Hard',
    summary: 'The MSP\'s RMM agent is backdoored via a compromised vendor update. The attacker has silent admin access to 14 client endpoints across 6 organizations. The MSP must triage blast radius, notify all clients simultaneously, and manage reputational risk.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'Abbott Cyber MSP — SOC Analyst',
      raw: 'The Grand Hotel just called — their EDR flagged our RMM agent (ConnectWise Automate) making unexpected registry changes and spawning a child process at 02:00 last night. I pulled the Automate logs and found the same behaviour across 14 of our managed endpoints. It looks like a bad update came through our own RMM platform. This might not just be one client.',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'SOC alert',
        title: 'Backdoored RMM update confirmed — 14 endpoints, 6 client orgs',
        body: 'ConnectWise confirms a plugin update pushed 18 hours ago contained a backdoored component. The malicious update installed a Cobalt Strike beacon on every endpoint that auto-applied the update. Scope: 14 client endpoints across 6 organizations — hospitality, professional services, and one healthcare-adjacent client. The beacon has been active up to 18 hours with full system privileges via the RMM agent.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access', technique: 'T1195.002 Compromise Software Supply Chain' },
        rolePrompts: {
          ic: 'You are the incident — your tool is the vector. Decide now: notify all 14 clients before you know the full scope, or contain and assess first? Every minute of delay is attacker dwell time in client environments.',
          tl: 'Emergency: shut down the ConnectWise update channel for all clients. Identify which of the 14 endpoints show active C2 beacon activity vs dormant installs. Prioritise the healthcare-adjacent client first.',
          cl: '14 clients need to hear from you. Draft the client notification — be direct, factual, take ownership. Who makes the calls and in what order?',
          lc: 'Your tool caused the breach. Review the MSA for each of the 14 clients. Healthcare-adjacent client may have HIPAA implications. Does your cyber insurance cover third-party vendor compromise as the source vector?',
          es: 'This is an existential reputational event. Personally call the top 3 clients before they find out from their own alerts. What is your posture to the other 3?',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'Active exfiltration from 3 client environments',
        body: 'EDR and network monitoring show active Cobalt Strike C2 traffic from 3 of the 14 endpoints: The Grand Hotel, a law firm (Morrison & Webb), and a regional accounting firm. File staging is visible on all three — compressed archives being assembled. The Grand Hotel endpoint is querying the PMS server. Morrison & Webb has accessed the client matter database. The exfiltration window is open right now.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1041 Exfiltration Over C2 Channel' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'Three simultaneous active breaches in client environments. Breach declaration triggers for all three. Triage: isolate all three endpoints now accepting full service disruption, or stagger to minimise operational impact?',
          tl: 'Kill the C2 channel at the network level and force-isolate the three active endpoints via EDR. What forensic evidence can you capture before isolation? The 11 dormant endpoints are secondary.',
          cl: 'Morrison & Webb has client-privileged data at risk. The Grand Hotel has guest PII. The accounting firm has client financial records. Three different conversations, three different obligations. Who do you call first?',
          lc: 'Three confirmed breaches via your platform. Notification obligations to each client and potentially to regulators. Engage external cyber counsel immediately — your insurance and your clients\' claims may conflict.',
          es: 'Authorise emergency IR firm deployment to all three active sites simultaneously. Cost is secondary. Prepare a board-level briefing — this will become public.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Media inquiry — reporter asking about the RMM backdoor',
        body: 'A reporter from BleepingComputer has emailed the MSP\'s general contact: "We\'ve received reports of a ConnectWise Automate supply chain compromise affecting multiple Canadian MSPs. Can you confirm whether your clients were affected?" ConnectWise has just posted a public security advisory naming the compromised plugin version. Your clients\' IT teams are reading it now.',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Reputational', technique: 'Media and Disclosure Management' },
        rolePrompts: {
          ic: 'The media inquiry does not change your technical response — but it changes your communication timeline. Clients must hear from you before they read it online. Does your prioritisation change?',
          tl: 'ConnectWise\'s public advisory is now the technical narrative. Does it accurately describe what you observed? Any gaps that affect your client communications?',
          cl: 'Do you respond to the reporter? Draft a one-paragraph holding statement for legal approval. No specific client impacts, no speculation about scope.',
          lc: 'Media engagement during an active incident creates discovery risk. Advise the IC on whether to engage the reporter at all, and what litigation hold implications exist for your written communications today.',
          es: 'Some clients will read the advisory and call you before you call them. Who are they? Do you have a script ready? Prepare for the possibility that one client terminates the MSA today.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'ConnectWise releases emergency patch — 14-endpoint remediation window',
        body: 'ConnectWise has released an emergency out-of-band patch removing the backdoored component and resetting agent permissions. Estimated deployment: 2 hours per client via their remediation tool, or 4–6 hours manual per endpoint. 14 endpoints across 6 clients need remediation plus attacker persistence verification. Some clients are asking whether they should just uninstall the RMM agent entirely.',
        phaseIdx: 3,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Eradication', technique: 'Supply Chain Remediation' },
        rolePrompts: {
          ic: 'Remediation sequence: healthcare-adjacent client first, then three active-breach clients, then 8 dormant endpoints. Communicate ETAs to all 6 clients before you start.',
          tl: 'For the 3 active-breach clients: manual persistence verification before re-enabling RMM. For the rest: remediation tool. What is the total timeline?',
          cl: 'Clients asking whether to uninstall the agent: what is your answer? Some may want to pause the MSA during remediation. How do you retain trust through the remediation window?',
          lc: 'Document every remediation action with timestamps per client. This becomes the incident record for insurance claims, potential litigation, and regulatory response.',
          es: 'Offer each client a dedicated remediation technician at no charge — bill it to the incident, not the client. This is a trust-recovery investment. Confirm the cyber insurance claim is filed.',
        },
      },
    ],
  },
  reservation_data_leak: {
    id: 'reservation_data_leak',
    title: 'Reservation System Breach — Guest PII on Dark Web',
    industry: 'Hospitality',
    duration: '~55 min',
    difficulty: 'Hard',
    summary: 'A threat intelligence feed flags a dark web listing selling 40,000 guest records from the hotel PMS — passport numbers, loyalty IDs, stay history. The breach occurred 22 days ago via a third-party booking widget vendor who was themselves compromised.',
    declaration: {
      ingest: 'Technician anomaly',
      source: 'Abbott Cyber MSP — Threat Intel Feed',
      raw: 'Our threat intelligence platform flagged a listing on a dark web marketplace selling what appears to be guest data from a Canadian hotel. The sample data includes fields that match the Grand Hotel PMS schema exactly — loyalty tier, reservation source code, and a property code that maps to this client. Listed price: $4,000 for 40,000 records. Posting date: 3 days ago.',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'SOC alert',
        title: 'Records confirmed as ours — 40,000 guests including passport numbers',
        body: 'Cross-referencing the 6-record sample against the PMS: all 6 match exactly. Fields confirmed in the full dataset: full name, email, phone, nationality, passport number (international guests), loyalty ID and tier, stay history, and a hashed PMS account PIN. Total: 40,847 records. International guests represent ~31% — GDPR may be in scope for EU and UK residents.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1567 Exfiltration Over Web Service' },
        rolePrompts: {
          ic: 'Confirmed PII on a dark web marketplace — this is a breach. Stand up the IR team, engage the insurer, brief the GM. Declare and start the clock. Who needs to know in the next 30 minutes?',
          tl: 'We do not know the vector yet. Priority: PMS access logs for the last 60 days, API gateway logs, and any third-party integrations with read access to guest profiles. Start building the access map.',
          cl: '40,000 affected guests will need to be notified. You cannot notify until scope is confirmed and legal has signed off. Draft the notification template now so you are ready to move.',
          lc: 'Passport numbers are high-sensitivity PII under US federal and state law. 31% international guests means GDPR may apply. Two regulatory regimes with different clocks. What is your immediate priority action?',
          es: 'The GM must be briefed before any public disclosure. 40,000 affected loyalty members. Call the GM now. Confirm insurance. Brief ownership.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'PMS API logs — third-party booking widget ran bulk guest export 22 days ago',
        body: 'The PMS vendor (Opera Cloud) API gateway logs show an authorised API key belonging to a third-party booking widget integration — "FastBook Widget v2" — executed a bulk export query 22 days ago at 02:40am returning 40,847 rows. FastBook Widget is embedded on the hotel website for direct bookings. The API key is still active.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access', technique: 'T1078.004 Cloud Accounts' },
        rolePrompts: {
          ic: 'The API key is still live — revoke it immediately. TL to execute. The vector is a third-party vendor. What do we know about FastBook Widget\'s security posture?',
          tl: 'Revoke the FastBook API key now. Confirm no other third-party integration API keys show unusual query patterns. Review the Opera Cloud API audit log for all keys over the last 60 days.',
          cl: 'Revoking the FastBook key may break the hotel website booking widget. Operations will notice. How do you communicate the widget takedown internally without triggering questions you cannot answer yet?',
          lc: 'A third-party vendor\'s API key executed the export. Is the breach the vendor\'s fault, the hotel\'s fault for granting the key, or shared? Review the MSA with FastBook Widget for data processing and security provisions.',
          es: 'Do we know who runs FastBook Widget? Is it a major vendor or a small shop? The answer shapes your communication and liability strategy. Get their leadership on the phone.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'FastBook Widget vendor confirms they were breached 27 days ago',
        body: 'FastBook Widget Ltd (an 8-person SaaS company) responds: they were breached 27 days ago via a code injection in their admin portal. An attacker accessed their API key management console and extracted keys for all 340 of their hotel clients worldwide. They have not yet publicly disclosed. They are asking the Grand Hotel to "keep this confidential while we assess the scope." FastBook has no cyber insurance.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access', technique: 'T1195.002 Compromise Software Supply Chain' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'FastBook\'s request for confidentiality conflicts with your regulatory obligations. You cannot honour it. Trigger the formal breach declaration. Coordinate co-sign with ES.',
          tl: 'FastBook was breached 27 days ago. 340 hotel clients may have been hit. This is a global hospitality supply chain incident. Does our IR firm have visibility into the wider scope?',
          cl: 'FastBook wants silence. US breach notification law requires disclosure. Draft the regulatory notification and the guest notification — legal must clear both. Guest notification should not reference FastBook by name initially.',
          lc: 'FastBook\'s confidentiality request has no legal force once you have a regulatory obligation to disclose. Notify the FTC and applicable state AG. GDPR supervisory authority if EU guests confirmed. Preserve all communications with FastBook.',
          es: 'FastBook has no insurance and 8 employees. Recovery from them is unlikely. What is the hotel\'s standalone exposure — fines, guest remediation, loyalty program goodwill spend? Brief ownership.',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'Guests self-discovering breach on social media before notification sent',
        body: 'Three days after discovery, before formal guest notification has been sent (still in legal review), guests are calling the front desk directly. TripAdvisor posts appear: "I received a phishing email using my exact stay dates and room type — did you leak my data?" The loyalty app is showing ~200 abnormal login attempts. The story is breaking publicly without your notification landing first.',
        phaseIdx: 5,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Post-Incident', technique: 'Downstream Fraud and Media Escalation' },
        rolePrompts: {
          ic: 'Legal review is taking too long — guests are self-discovering on social media. Do you push legal to approve an expedited notice, or issue a public holding statement first? Decide now.',
          tl: 'The loyalty account brute-force attempts confirm attackers are using the leaked data for credential stuffing. Force a password reset for all 40,000 loyalty accounts. Confirm 2FA is available.',
          cl: 'TripAdvisor posts are live. Your holding statement needs to be published today: acknowledge the incident, take responsibility, commit to notification, provide a direct contact number. No finger-pointing at FastBook.',
          lc: 'The delay in guest notification may itself become a regulatory finding. Document the legal review timeline. Once notification goes out, file formally with the FTC. Class action risk is real — preserve all evidence.',
          es: 'Offer 12 months of credit monitoring to all 40,000 affected guests. Confirm the budget. The loyalty program needs a goodwill gesture — points top-up or waived annual fees. This is the brand recovery investment.',
        },
      },
    ],
  },
  ddos_extortion: {
    id: 'ddos_extortion',
    title: 'DDoS Extortion — Booking Engine Down at Peak',
    industry: 'Hospitality',
    duration: '~45 min',
    difficulty: 'Medium',
    summary: 'The hotel\'s online booking engine goes offline during a long-weekend surge. An extortion demand of $25k BTC arrives with a 6-hour clock. Mid-incident the attacker sends "proof of access" containing real reservation records, escalating from a service disruption to a potential breach.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'The Grand Hotel — Revenue Manager',
      raw: 'Our online booking engine has been down for 40 minutes. It is the Friday of a long weekend — one of our highest-booking windows of the year. The website host says it is a DDoS attack. We also just received an email demanding $25,000 in Bitcoin to stop the attack. I don\'t know if we should pay or who to call.',
      correctSeverity: 'P2',
      correctDeclare: false,
    },
    injects: [
      {
        ingest: 'Technician anomaly',
        title: 'Layer 7 DDoS confirmed — CDN mitigation failing',
        body: 'The booking engine (AWS behind Cloudflare) is under a Layer 7 application-layer DDoS: 280,000 requests per minute to /search and /availability endpoints, mimicking real browser behaviour with JS challenge bypass. Cloudflare\'s automated mitigation blocks 60% but the remainder overwhelms the application servers. Attack originates from a botnet across 43 countries. Manual WAF rules are being tried but the attacker is adapting in real time.',
        phaseIdx: 1,
        correctCriticality: 'High',
        mitre: { tactic: 'TA0040 Impact', technique: 'T1498.001 Direct Network Flood' },
        rolePrompts: {
          ic: 'Do not pay the ransom. Focus on mitigation. Who are your contacts at Cloudflare for emergency DDoS escalation? Stand up the incident — revenue, legal, and communications need to be briefed now.',
          tl: 'Escalate to Cloudflare\'s DDoS response team immediately. Emergency measure: rate-limit the targeted endpoints to zero for non-Canadian IPs — accept lost international bookings to restore domestic service.',
          cl: 'The booking engine is visibly down. Social media will notice within minutes. Post a holding statement now: "We\'re experiencing a technical issue affecting online bookings — please call us directly at [number]."',
          lc: 'The extortion email is evidence. Do not respond to it. Forward to counsel and law enforcement immediately. Paying ransoms may have legal implications under Canadian sanctions law.',
          es: 'Activate the manual booking fallback: direct the revenue team to field calls. Estimate revenue loss per hour — the GM and ownership need a financial impact figure now.',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'Second wave — PMS API and loyalty portal now targeted',
        body: 'At 90 minutes, the attacker expands scope. The PMS API (used by online check-in and the loyalty app) is now under volumetric attack. The loyalty member portal is down. The booking engine has partially recovered via Cloudflare emergency rules. A new email: "We warned you. Now your guests can\'t check in online either. Clock is at 4.5 hours. $25k or we go to media with your security failures."',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0040 Impact', technique: 'T1498 Network Denial of Service' },
        rolePrompts: {
          ic: 'The attacker is escalating. Two systems now down. The 4.5-hour deadline is psychological pressure — do not react to the clock. Is the PMS API outage an extension of the DDoS, or a separate intrusion? Your response differs entirely.',
          tl: 'Is the PMS API attack the same botnet (volumetric) or a different vector (potential exploit)? Check for signs of actual intrusion alongside the DDoS traffic. This is the most important technical question right now.',
          cl: 'Loyalty portal down affects members arriving for check-in this weekend. Front desk needs talking points. Social media is picking this up. Time to activate your media response.',
          lc: 'The extortion email mentions "your security failures" — language that could precede a data leak claim. Begin evidence preservation as if exfiltration is possible.',
          es: 'The attacker is threatening to go to media. Proactive disclosure may be better than reactive. Brief the GM and consider whether to issue a press statement before the attacker does.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: '"Proof of access" — attacker sends real reservation records',
        body: 'A third email arrives at hour 3. Attached PDF contains: 12 guest reservation records (names, dates, room numbers, rates), a screenshot of the internal revenue management dashboard, and a partial employee list with emails and titles. Demand is now $50,000 — doubled. This is either a real breach or a sophisticated bluff using a cached browser session. You have 30 minutes to determine which.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access', technique: 'T1059 Command and Scripting Interpreter' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'This changes the threat classification. The DDoS may be a distraction for a network intrusion. Trigger the breach declaration gate if TL confirms the data is authentic. What do you need from TL in the next 15 minutes?',
          tl: 'Verify the proof data: are these real reservation records in the PMS? Is the revenue dashboard screenshot current and from inside the network? If authentic, you have a breach alongside the DDoS. Full forensics now.',
          cl: 'Remove any "we have no evidence of a data breach" language from your public holding statement immediately — pending TL\'s verification. Update your media position to "we are investigating a security matter."',
          lc: 'If the proof data is authentic, you have a US breach notification event running concurrently with the extortion. Two separate regulatory obligations with different timelines. Begin the breach assessment in parallel.',
          es: 'The $50k demand is secondary — if they are inside the network, the data exposure is the primary risk. Confirm you are not paying. Engage the carrier\'s incident response team now.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Attack subsides at hour 6 — proof data partially verified',
        body: 'At the 6-hour deadline, DDoS traffic drops to zero. No further attacker contact. Booking engine and PMS API recover fully. Revenue Manager estimates $34,000 in lost bookings. Forensic result: 10 of 12 reservation records are authentic; the revenue dashboard screenshot matches a browser-cached session left open on a shared hotel computer; the employee list is partially sourced from LinkedIn.',
        phaseIdx: 5,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Post-Incident', technique: 'NIST SP 800-61 Post-Incident Activity' },
        rolePrompts: {
          ic: 'Attack is over. Did they actually breach the network, or was the proof assembled from a cached browser session and LinkedIn? TL\'s forensic answer determines your regulatory obligations. You have 72 hours to conclude.',
          tl: 'Full forensic sweep: any signs of persistent access, malware, or exfiltration beyond what the cached session could explain? Document the forensic conclusion — it determines the breach notification obligation.',
          cl: 'Systems are back online. Issue a positive update: "Our systems are fully restored. We apologise for the disruption and are grateful for your patience." Do not mention the extortion or data proof.',
          lc: 'If the proof came from a browser-cached session rather than a network intrusion, the breach analysis changes significantly. Document the forensic conclusion carefully.',
          es: '$34,000 in lost revenue plus IR costs. Confirm DDoS extortion is covered under your policy — crime and business interruption. Board AAR question: what hardening investment prevents or shortens this next time?',
        },
      },
    ],
  },

  aitm_cred_theft: {
    id: 'aitm_cred_theft',
    title: 'AiTM Phishing — Session Token Hijack',
    industry: 'All',
    duration: '~55 min',
    difficulty: 'Hard',
    summary: 'A convincing phishing email routes a senior accountant through an Adversary-in-the-Middle proxy. MFA is bypassed. The attacker uses the stolen session cookie to access M365, exfiltrate HR data from SharePoint, and pivot to impersonate the victim via Teams — triggering a secondary phishing wave targeting the CFO.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'Finance team — Senior Accountant',
      raw: 'I clicked a DocuSign link in an email and it took me to what looked like my Microsoft login. I typed in my password and did the MFA. But the URL looked weird — it wasn\'t microsoft.com. I don\'t know if I was phished. I\'m logged in fine now. Should I be worried?',
      correctSeverity: 'P2',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'SOC alert',
        title: 'AiTM proxy confirmed — session token stolen, MFA bypassed',
        body: 'The suspicious URL resolves to a known Evilginx v3 AiTM infrastructure node. M365 sign-in logs show a successful token issuance for the accountant\'s account from the proxy IP at 09:47, followed immediately by a sign-in from a Ukraine-hosted IP at 09:47:18 — 18 seconds later. No MFA challenge was presented at the second sign-in because the stolen session cookie is already authenticated. The attacker has a live M365 session right now.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access + TA0006 Credential Access', technique: 'T1557 Adversary-in-the-Middle + T1539 Steal Web Session Cookie' },
        rolePrompts: {
          ic: 'The attacker has an active authenticated M365 session. Primary decision: revoke all sessions immediately (accepting visible disruption) or monitor and scope first? Every second of inaction is attacker access time.',
          tl: 'Revoke all active M365 sessions for the compromised account via Entra ID — use the "Sign out everywhere" function. Preserve the token log before revocation. Check which M365 services were accessed in the last 20 minutes.',
          cl: 'Is this isolated to one user? Your internal communication at this stage should be minimal — do not use email. Secure channel only. Brief the IC.',
          lc: 'AiTM attacks are increasingly common — do your MFA policies require phishing-resistant MFA (FIDO2/passkeys)? Assess whether the current MFA posture contributes to regulatory exposure.',
          es: 'Do you know what data that M365 account can access? If the answer is "everything," you have a business decision to make about acceptable disruption during revocation.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'SharePoint HR folder accessed — employee records downloaded',
        body: 'Unified Audit Log (UAL) shows the attacker browsed to the HR SharePoint site within 4 minutes of gaining access. The following operations were logged: FileAccessed and FileDownloaded events on 34 files including employee contracts, compensation bands, disciplinary records, and a payroll export (847 employee rows: name, title, salary, banking sort codes). The attacker also sent one Teams message from the victim account to a known HR admin: "Can you share the updated org chart including personal mobile numbers?"',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0009 Collection', technique: 'T1213 Data from Information Repositories' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'Employee banking data and compensation records are in scope. This is a breach. Trigger the breach declaration gate — co-sign with ES. You also have a live social-engineering attempt via Teams happening now.',
          tl: 'Block the attacker\'s M365 session immediately if you haven\'t already. Download the full UAL for the last 2 hours. Identify every file accessed, every message sent, and every Teams action taken from the compromised session.',
          cl: 'The attacker sent a Teams message posing as the employee to request personal data. Locate and brief the HR admin before they respond. Prevent secondary exfiltration.',
          lc: 'Employee payroll data including banking sort codes is high-sensitivity PII. Breach notification obligation assessment: your own staff are the affected individuals. HIPAA does not apply, but state employment privacy law may. Assess risk of harm.',
          es: 'Co-sign the breach declaration with IC. 847 employees need to be notified. Brief HR leadership before this leaks internally. Confirm the cyber insurance carrier is on notice.',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'Internal phishing wave launched from compromised account',
        body: 'The attacker sent 12 additional emails from the compromised accountant\'s M365 account before revocation completed. Targets include the CFO (with a fake invoice approval request for $78K), the CEO executive assistant (with a meeting reschedule request containing a malicious link), and 10 other staff. The CFO has already replied to the invoice request. The EA clicked the link.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access', technique: 'T1534 Internal Spearphishing' },
        rolePrompts: {
          ic: 'The incident has metastasised. The CFO replied to a $78K invoice fraud attempt. The EA may have just given the attacker a second foothold. Declare an expanded scope and brief both immediately via phone — not email.',
          tl: 'Check whether the EA\'s link click resulted in a new AiTM session capture. Pull the M365 UAL for the CFO account. Was the $78K wire instruction received by accounts payable — and has any action been taken?',
          cl: 'Brief all 12 email recipients via phone or Slack. Do not use email. Message: "You received a suspicious email from [name] — do not click any links or approve any requests. Call IT immediately." Who owns the internal broadcast?',
          lc: 'If the CFO approved a $78K wire, you now have a concurrent wire fraud event. FBI IC3 report. Bank contact for recall — time is critical. Wire fraud and credential theft may both be covered under your cyber policy.',
          es: 'Contact the bank immediately regarding the CFO wire request. Invoke recall. Brief the CFO and CEO personally. This has expanded from a credential incident to potential financial fraud.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Attacker scope confirmed — 3 accounts, session-cookie attack vector identified',
        body: 'Full forensics complete. Three M365 accounts compromised via the same Evilginx infrastructure: the accountant (initial victim), the EA (second-wave), and a junior HR analyst who clicked a Teams link from the EA\'s account. Total data exfiltrated: 34 HR files, 2 draft board reports, 1 strategic acquisition memo (marked Confidential). The $78K wire was not processed — AP flagged it for verbal confirmation per their change-of-vendor procedure. M365 now reports all three sessions revoked. Number-matching MFA was not enabled; conditional access had no block on token reuse from new geographic locations.',
        phaseIdx: 3,
        correctCriticality: 'High',
        mitre: { tactic: 'TA0006 Credential Access', technique: 'T1539 Steal Web Session Cookie' },
        rolePrompts: {
          ic: 'The financial loss was avoided. Three accounts compromised, significant sensitive data exfiltrated. Frame the AAR narrative: what controls failed, what saved you, what changes are being made?',
          tl: 'Immediate hardening list: (1) Enable number-matching MFA org-wide, (2) Enable FIDO2 passkeys for all executives and finance staff, (3) Conditional access policy: block token reuse from new country/IP. Timeline to implementation?',
          cl: 'Draft the employee notification: 847 staff whose payroll data was exfiltrated. Separate message to the 3 compromised account holders. Legal sign-off required on both.',
          lc: 'A strategic acquisition memo marked Confidential was accessed. If you are a public company, assess SEC material non-public information implications. Board must be briefed on the data exposure, not just the credential incident.',
          es: 'This is the AAR moment: how close did you come to losing $78K and having a competitor read your acquisition plans? Present the hardening plan to the board with a budget ask for phishing-resistant MFA.',
        },
      },
    ],
  },
  reg_audit_surprise: {
    id: 'reg_audit_surprise',
    title: 'Regulatory Audit — Surprise State AG Privacy Inquiry',
    industry: 'All',
    duration: '~40 min',
    difficulty: 'Medium',
    summary: 'A formal data inquiry letter arrives from a state Attorney General\'s office after a former employee filed a privacy complaint. The team has 90 days to respond — but documentation audits reveal three undocumented incidents, 14-month-old training records, and an outdated privacy policy that references a decommissioned vendor. The AG then escalates to a 30-day meeting request.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'Operations — Office Manager',
      raw: 'We received a registered letter this morning from the State Attorney General\'s office. It says we have 90 days to respond to a "data privacy inquiry" initiated after a complaint from a former employee. It\'s asking for documentation of our privacy practices, breach history for the last 3 years, and training records. I don\'t know what to do with this. Should we be worried?',
      correctSeverity: 'P2',
      correctDeclare: false,
    },
    injects: [
      {
        ingest: 'PSA ticket',
        title: 'Legal counsel reviews the inquiry letter — scope is broad',
        body: 'Outside counsel has reviewed the letter. The State AG is conducting a Civil Investigative Demand (CID) under the state consumer privacy act. The inquiry covers: (1) all personal data processing activities for employees and customers in the last 36 months, (2) all security incidents and breach notifications in the last 36 months, (3) evidence of staff privacy training, (4) copies of all privacy policies, DPAs with vendors, and retention schedules. The complainant (a former employee) alleges their personal data was shared with a third party without consent. The 90-day clock starts today. Counsel notes: failure to respond is itself a violation.',
        phaseIdx: 0,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Regulatory', technique: 'Civil Investigative Demand Response' },
        rolePrompts: {
          ic: 'This is not an incident response — it is a regulatory response. Assign a response lead (likely Legal), establish a document collection team, and set internal deadlines with 30-day buffers. Who owns what?',
          tl: 'Your job in this exercise: produce a complete inventory of all systems that process personal data, all vendors with data access, and all security incidents (even minor) in the last 36 months. How long will that take, and what gaps do you already know about?',
          cl: 'The former employee filed a complaint. Before responding to the AG, brief leadership: this will likely become public at some point. If the outcome is a consent decree or fine, have a holding statement ready. No external communication until legal advises.',
          lc: 'Instruct the team to implement a litigation hold immediately: preserve all communications, records, and system logs from today forward. Assign yourself as primary point of contact for all AG communications. Nothing goes to the AG without your sign-off.',
          es: 'This is a regulatory event with potential fines, enforcement action, and public disclosure. Brief the board immediately. Authorise outside counsel to lead the response. Confirm your D&O and cyber insurance carriers are notified.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Documentation audit reveals three gaps',
        body: 'Internal review of the last 36 months surfaces three incidents that were handled operationally but never formally documented as privacy/security events: (1) A laptop was reported stolen 22 months ago — IT wiped it remotely, no formal breach assessment was conducted. (2) An email containing 40 customer records was sent to the wrong address 14 months ago — the recipient replied confirming deletion, but no breach assessment or notification was filed. (3) A cloud storage bucket containing employee contracts was publicly accessible for 9 days, discovered internally, corrected — no record exists. Training records show that 60% of staff completed privacy training 14 months ago; 40% have no training record at all.',
        phaseIdx: 0,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Compliance Gap', technique: 'Incident Recordkeeping Failure' },
        rolePrompts: {
          ic: 'Three undocumented incidents. The AG will ask about all three. Your options: (1) disclose proactively with context, (2) disclose only what they specifically ask for. Legal must advise. What is your instinct on the disclosure posture?',
          tl: 'You need to reconstruct the incident timelines from logs, email records, and ticket history. How complete are your audit logs for events 14–22 months ago? Produce a written factual reconstruction for each incident for legal review.',
          cl: 'If any of these incidents become public as part of the AG investigation, the framing matters enormously. Brief leadership now: these were handled in good faith, but documentation fell short. Prepare an internal narrative that acknowledges the gap without overstating the risk.',
          lc: 'Assess whether any of the three incidents should have triggered a breach notification at the time. If yes, you have a late-notification problem — which is a separate violation. Advise the IC on how to frame this in the AG response. Proactive disclosure of late notifications often receives more lenient treatment.',
          es: 'The training gap is a compliance failure — 40% of staff have no privacy training record. Authorise an emergency training program to be completed before the AG response is filed. Document completion. This demonstrates good faith.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Former employee\'s complaint specifics — HR data shared with background check firm',
        body: 'Outside counsel has obtained a copy of the former employee\'s complaint. They allege: when they left the company 18 months ago, their performance reviews, disciplinary records, and personal email address were shared with a third-party background check firm without their knowledge or a lawful basis — specifically for a reference check requested by a prospective employer, where the company did not notify them a reference was being provided. The background check firm (CheckHire Inc.) is listed in your current vendor list but there is no Data Processing Agreement (DPA) in place. The privacy policy published at the time did not disclose sharing data with background check vendors.',
        phaseIdx: 0,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — Regulatory', technique: 'Unlawful Data Sharing' },
        triggersBreach: false,
        rolePrompts: {
          ic: 'The complaint has merit. You shared personal data with a vendor you have no DPA with, in a way your privacy policy didn\'t disclose. This is the core violation. How do you want to respond — full acknowledgement, partial, or defend?',
          tl: 'Pull all data shared with CheckHire Inc. in the last 36 months: who requested it, what was shared, and whether consent or a lawful basis was established. Produce a complete log for legal.',
          cl: 'If the AG investigation produces a finding, it may be reported publicly. The former employee may pursue a private right of action in addition to the AG complaint. Draft a holding statement for the scenario where this becomes public. No finger-pointing at HR.',
          lc: 'The absence of a DPA with a data processor is a clear compliance gap. Remediate immediately: sign a retrospective DPA with CheckHire Inc. or cease using them. Advise on whether to attempt a settlement with the former employee before the AG proceeding concludes.',
          es: 'Assess whether to engage the former employee directly to offer a settlement. Early resolution may close the complaint before the AG issues findings. Authorise legal to explore this option. Confirm what your privacy practices need to look like going forward — this scenario will recur.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'AG escalates — requests a meeting within 30 days',
        body: 'With 52 days remaining on the 90-day response window, the AG\'s office sends a follow-up letter requesting an in-person meeting with "appropriate company representatives including legal counsel and the individual responsible for data protection" within 30 days. This is unusual and suggests the AG has additional information — possibly from the former employee\'s counsel. Separately, a local tech journalist has emailed asking if the company has received "any regulatory inquiries related to data privacy" following a tip from an unnamed source.',
        phaseIdx: 5,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Post-Incident', technique: 'Regulatory Escalation' },
        rolePrompts: {
          ic: 'Two things happening simultaneously: the AG is escalating, and the press has a tip. Two separate responses required. Who speaks to the AG, and who owns the media strategy?',
          tl: 'Prepare a technical briefing document for the AG meeting: what systems you use, what data you hold, retention schedules, access controls, and the three incidents reconstructed with full timelines. Legal must review everything.',
          cl: 'The journalist has a tip. If you say nothing and the story runs, it will be unflattering. If you engage, you risk saying the wrong thing. Draft a non-confirming holding statement: "We take data privacy seriously. We are not able to comment on communications with regulatory bodies."',
          lc: 'The AG meeting escalation is not necessarily adverse — it may be an opportunity to present your remediation plan and good-faith posture. Brief the IC and ES on what to say and, critically, what not to say. Prepare a formal remediation commitment document: DPAs executed, training completed, incident register established, privacy policy updated.',
          es: 'This regulatory action now has media attention. Brief the board chair today. Prepare for the possibility of a consent decree or civil penalty. Confirm your legal budget and D&O coverage. The board will want to know: who was responsible for the data protection program, and what is the accountability structure going forward?',
        },
      },
    ],
  },

  insider_threat: {
    id: 'insider_threat',
    title: 'Insider Threat — Departing Employee Data Exfiltration',
    industry: 'All',
    duration: '~60 min',
    difficulty: 'Medium',
    track: 'operational',
    summary: 'DLP alerts fire hours before a sales manager\'s last day. Logs reveal three weeks of systematic exfiltration: client list, pricing schedules, and shared credentials. HR, legal, and technical response must coordinate under time pressure.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'IT Manager — internal DLP alert',
      raw: 'DLP flagged a 4.2GB upload to a personal Google Drive at 11:47 PM last night. The account belongs to a sales manager whose last day is today. HR says the exit interview is already scheduled for 2 PM. The uploaded folder is named "client_list_2026_FINAL".',
      correctSeverity: 'P2',
      correctDeclare: false,
    },
    injects: [
      {
        ingest: 'Technician anomaly',
        title: 'Endpoint forensics reveal 21 days of systematic exfiltration',
        body: 'Endpoint log review shows the employee began exfiltrating data three weeks ago. Confirmed transfers: full CRM export (4,800 client records with contact details and account history), two active RFP proposals valued at $2.1M, internal pricing schedules, and a credential dump from a shared sales team password manager. Total volume: ~18GB across personal Dropbox, Gmail attachments, and a USB device checked out from IT two weeks ago.',
        phaseIdx: 1,
        correctCriticality: 'High',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1052.001 Exfiltration over USB + T1567 Exfiltration over Web Service' },
        rolePrompts: {
          ic: 'This is now a formal IR, not just an HR matter. Coordinate timing of credential revocation and access termination with HR and legal before acting — alerting the employee too early may destroy evidence on personal devices.',
          tl: 'Preserve all endpoint and cloud activity logs under legal hold now. Audit every account the employee had access to. Identify and rotate every credential in that password manager export immediately after HR terminates.',
          cl: 'Internal communications only — no external notice until legal completes the breach assessment. If clients contact the employee\'s accounts today, redirect to their new contact without explanation.',
          lc: 'The CRM export likely contains customer PII triggering state breach notification requirements. Begin a formal breach assessment. Is there an NDA and non-solicitation in force? Document the evidentiary chain for potential civil or criminal action.',
          es: 'Brief the CEO and VP Sales now. Decide whether today\'s exit interview proceeds as planned or is accelerated. The employee must not be tipped off before credentials are revoked.',
        },
      },
      {
        ingest: 'HR + management',
        title: 'Employee terminated — denies wrongdoing, attorney threatens litigation',
        body: 'The employee was confronted and terminated at 10 AM. They stated "I was just making sure I could do my job" and denied any intent to share data with a competitor. Within 90 minutes, their personal attorney emailed HR alleging wrongful termination and demanding a litigation hold on all records. The employee still has an active OAuth session on the mobile CRM app and their personal laptop may contain company data. A competing firm posted a job listing for a "Senior Sales Manager" role this morning with qualifications matching the employee\'s exact profile.',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — HR/Legal', technique: 'Post-termination access risk' },
        rolePrompts: {
          ic: 'Revoke all remaining sessions including mobile OAuth tokens immediately. Do not contact the employee or their attorney directly. Ensure the forensic image is made before any device is returned or wiped.',
          tl: 'Terminate all active sessions. Confirm USB device is accounted for. Check whether the competing firm has accessed any of the exfiltrated data — look for known competitor IP ranges in CRM access logs.',
          cl: 'No external statement. If clients ask why their contact changed, use standard transition language only — never reference the investigation.',
          lc: 'Accept the litigation hold demand and respond formally. Assess CFAA criminal referral. Engage outside counsel — both employment and data theft specialists. The competing firm job posting is circumstantial but document it.',
          es: 'Decision required: criminal referral to FBI or civil suit to recover data and seek injunction? Brief the board. Consider proactive outreach to the clients most at risk — those the employee managed personally.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Breach assessment complete — notification obligation confirmed',
        body: 'Legal has completed the breach assessment. The CRM export includes full name, email, phone, and in 340 customer records, billing address with last-4 card digit — sufficient to trigger notification under applicable state law within 30 days. Cyber insurance carrier has been briefed and confirmed coverage for notification costs. Outside counsel recommends proactive notification over regulatory minimum. A competing firm has signed two of the exfiltrated clients in the past week.',
        phaseIdx: 3,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Post-incident', technique: 'Breach notification' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'Frame the notification approach for the executive: proactive broad notification vs regulatory minimum. The two lost clients are already gone — notification focus is on retaining the remaining 4,798.',
          tl: 'Prepare the full technical scope report for the notification package. Confirm no systems were compromised beyond the employee\'s own access — this should be a data theft, not a systems breach.',
          cl: 'Draft the client notification. Tone: transparent and proactive. Emphasise what was taken (contact data only, not financial records) and what is being done. Key accounts get a personal call from their relationship manager before the written notice.',
          lc: 'File with applicable state AG if required. Confirm carrier notification timeline met. Preserve all investigation materials for the civil case.',
          es: 'Authorise the notification program and the civil litigation budget. Approve customer retention measures for at-risk accounts. Consider whether the competitor\'s rapid client wins constitute evidence of tortious interference.',
        },
      },
    ],
  },

  cloud_misconfig: {
    id: 'cloud_misconfig',
    title: 'Cloud Misconfiguration — Public S3 Bucket Exposure',
    industry: 'Technology / SaaS',
    duration: '~60 min',
    difficulty: 'Medium',
    track: 'operational',
    summary: 'A security researcher emails your CEO: a public S3 bucket containing customer contracts, support tickets, and employee compensation data has been indexed by Google. The bucket has been accessible for 14 months. Exposure scope unknown.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'CEO — forwarded researcher email',
      raw: 'CEO forwarded an email from someone claiming to be a security researcher. They found a publicly accessible S3 bucket named "acme-support-prod-backup" with no authentication. The email includes a Google cache link showing a customer contract PDF and what appears to be an HR salary document. They\'re asking if there\'s a bug bounty.',
      correctSeverity: 'P1',
      correctDeclare: false,
    },
    injects: [
      {
        ingest: 'Technician anomaly',
        title: 'Bucket confirmed public — 47GB exposed for 14 months, Google has indexed 212 documents',
        body: 'AWS confirms the bucket has had public-read ACL since creation 14 months ago. Contents: 3,200 customer contract PDFs (including pricing and SLA terms), 18 months of support ticket exports containing customer PII and technical environment details, HR compensation data for all 87 staff members, and infrastructure runbooks with partial API keys and internal IP ranges. CloudTrail was not enabled. Google has indexed 212 documents. The bucket creation was logged to a decommissioned Slack channel — the alert was never seen.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0009 Collection', technique: 'T1530 Data from Cloud Storage Object' },
        rolePrompts: {
          ic: 'Make the bucket private immediately — do not delete anything. Assess: was this URL ever shared externally (in emails, support tickets, docs)? Enable CloudTrail across all S3 buckets now. Audit for other misconfigured resources.',
          tl: 'Set bucket to private now. Pull all public-facing AWS resources with AWS Config. Rotate any API keys referenced in the runbooks — treat them as compromised. Check CloudTrail for other accounts that accessed the bucket.',
          cl: 'Do not respond to the researcher yet — legal must review first. No public statement. Brief internal leadership only. The researcher email stays confidential until we have a response strategy.',
          lc: 'This is a potential multi-category breach: customer PII, employee salary data, proprietary business terms. 14-month window. Notification obligations likely in multiple states. Begin breach assessment now. EU customers in the dataset trigger GDPR 72-hour clock.',
          es: 'Brief the board immediately. This is a serious disclosure — customer contract terms, employee salaries, and infrastructure details are all exposed. The reputational risk is significant if this reaches press.',
        },
      },
      {
        ingest: 'SOC alert',
        title: '14 external IPs accessed the bucket — 2.1GB downloaded, 90-day log window only',
        body: 'Third-party forensic review of available access logs (90 days only — no earlier CloudTrail): 14 unique external IPs downloaded 2.1GB. Three IPs match registered security research firms, including the reporter. Two are VPN endpoints — unattributable. The remaining nine accessed only runbooks and internal configs, not customer data. The 14-month pre-CloudTrail window has no log coverage — external access before 90 days ago is unknown. A Google cache of a customer contract (TechCorp Inc.) is still indexed.',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1530 Data from Cloud Storage' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'With confirmed external access to customer data, breach declaration is required. The two unattributed VPN IPs are your highest risk — treat their access as a confirmed data theft until proven otherwise. Contact the researcher formally: thank them, confirm remediation, explain no retroactive bounty but their report will be acknowledged.',
          tl: 'Rotate all API keys from the runbooks immediately if not done. Run AWS Trusted Advisor and Security Hub across all accounts. Submit Google takedown requests for indexed documents — use the legal removal process for sensitive data.',
          cl: 'Prepare tiered customer notifications: customers whose contracts were accessed get a direct communication. Employees get a separate notice about salary data. Two different messages, different tone.',
          lc: 'Formal breach notification program: identify all affected customers by name, confirm applicable state laws, file with AG offices as required. GDPR: identify EU customers, file with supervisory authority. Cyber insurance carrier notification today. Employee salary data is also a breach — notify employees.',
          es: 'Authorise the notification program. Decide whether to issue a public statement proactively before the researcher publishes their disclosure — getting ahead of this controls the narrative.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Researcher publishes disclosure — press coverage, enterprise clients requesting CISO briefing',
        body: 'The researcher published a technical disclosure blog post (5-day responsible disclosure window honoured). The post names the company, describes the exposure in detail, and has been shared 600 times on LinkedIn. Two tech news outlets have published articles. Customer support received 31 inbound calls in two hours. Three enterprise clients (combined ARR $2.1M) have emailed requesting a call with the CISO within 24 hours. Your second-largest customer has asked for a copy of your AWS security audit.',
        phaseIdx: 3,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Reputational', technique: 'N/A' },
        rolePrompts: {
          ic: 'All press enquiries through comms lead only. CISO available for the three enterprise client calls — schedule them today. Prepare a technical remediation brief for those calls: what was exposed, what was fixed, what controls are now in place.',
          tl: 'Prepare the remediation summary: bucket secured, CloudTrail enabled, API keys rotated, full S3 audit complete, new bucket policy requiring encryption and block-public-access across all accounts. This is what clients will ask for.',
          cl: 'Issue press statement within 2 hours. Acknowledge, take responsibility, describe remediation, and outline new controls. Do not minimise. Reply to both news outlets directly with the same statement. Post to company blog and LinkedIn.',
          lc: 'Confirm all regulatory notifications are in progress before the public statement makes specific claims about notification. Do not confirm or deny specifics to press — direct to public statement.',
          es: 'Approve the press statement. Decide on customer retention measures for the three enterprise accounts — offer a security briefing, free penetration test, or extended SLA as goodwill. Brief the board on total exposure: notification costs, potential customer churn, regulatory risk.',
        },
      },
    ],
  },

  supply_chain_sw: {
    id: 'supply_chain_sw',
    title: 'Supply Chain Attack — Compromised MSP Management Tool',
    industry: 'MSP',
    duration: '~90 min',
    difficulty: 'Hard',
    track: 'operational',
    summary: 'Your RMM vendor sends an emergency alert: their platform has been compromised. Attackers are using your authenticated agent to push malicious scripts to client endpoints. You are the pivot point for an attack on your entire client base.',
    declaration: {
      ingest: 'SOC alert',
      source: 'RMM vendor emergency notification + two client calls',
      raw: 'RMM vendor sent an emergency email: "Sophisticated threat actor has gained access to our platform. Malicious scripts are being deployed via authenticated agent sessions. Suspend all automated scripts and patch pushes immediately." Two clients are already calling — their AV is flagging a PowerShell script pushed from your agent 40 minutes ago.',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'SOC alert',
        title: 'Malicious script confirmed on 3 client networks — ransomware and C2 beacons active',
        body: 'EDR telemetry across three managed clients confirms the malicious PowerShell (sha256 c8f1…a042) ran with SYSTEM privileges via your RMM agent. Client A (law firm, 120 endpoints): new local admin account created, C2 beacon to 185.220.101.47. Client B (accounting firm, 180 endpoints): file encryption underway, .lockd extensions appearing. Client C (medical clinic, 45 endpoints): same C2 beacon active, no lateral movement yet. Seven other clients have the agent installed and are unconfirmed.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access + TA0040 Impact', technique: 'T1195.002 Supply Chain Compromise + T1059.001 PowerShell' },
        rolePrompts: {
          ic: 'Disable your RMM agent across ALL client environments immediately — unilaterally if needed. You cannot wait for client approval. Stand up a war room and assign a dedicated technical lead to each affected client. You are running multiple simultaneous IR responses.',
          tl: 'Kill the RMM agent service on every client endpoint in your environment now. Block the C2 IP (185.220.101.47) at all client firewalls. Client B is your most urgent — scope the ransomware before it spreads further. Client C has a window — isolate before lateral movement starts.',
          cl: 'You must notify all 10 clients now — including the 7 unconfirmed. They have a right to know their infrastructure is at risk. Draft a clear factual notification: what happened, what you\'ve done, what you need from them. Do not bury the lead.',
          lc: 'You have potential contractual liability across all 10 client agreements. Notify your MSP cyber insurance carrier immediately — professional liability and cyber policy both apply. Client B and C may have specific regulatory exposure depending on their data.',
          es: 'Invoke your IR retainer if you have one. Brief all partners and leadership. Every client will hear about this by end of business — control that communication or lose the relationship.',
        },
      },
      {
        ingest: 'HR + management',
        title: 'Client B\'s managing partner calls your CEO — demands you cover the ransom',
        body: 'Client B (accounting firm) has 180 endpoints encrypted. The managing partner called your CEO directly: "Your software did this to us. We have payroll to run in 3 days and nothing works. You are paying for this." The ransom demand is $250K. Their cyber insurance has a $50K sub-limit for ransomware events. No clean backups exist — your agent was responsible for their backup automation, which the attacker also disabled. Your MSA with Client B caps your liability at $10K.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0040 Impact', technique: 'T1486 Data Encrypted for Impact' },
        rolePrompts: {
          ic: 'Do not admit liability verbally — direct all substantive client communication through legal. Assign your most senior IR engineer to Client B recovery. Explore every backup alternative before the ransom conversation: shadow copies, cloud sync, email-based data, third-party backups.',
          tl: 'Is there ANY clean recovery path for Client B? Check VSS shadow copies on individual machines, cloud-synced OneDrive/SharePoint data, accounting software cloud backups. Payroll data specifically — is it in a cloud payroll platform or local-only?',
          cl: 'Prepare written updates to Client B — factual, empathetic, no admission of fault. Your CEO should express genuine concern but avoid language like "our fault" or "we\'re responsible" until legal has assessed the situation.',
          lc: 'Review the MSA immediately. The $10K cap may or may not be enforceable depending on gross negligence standards in your jurisdiction. Engage coverage counsel now. Your professional liability and cyber policy both need to be on notice. Client B\'s ransom decision is theirs — do not advise them to pay or not pay.',
          es: 'The ransom decision is Client B\'s, but your relationship depends on how you support them. What can you offer: dedicated IR resources, negotiated ransom support, cost-sharing, billing credits? This is both a client retention and a liability management decision.',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'Medical clinic confirms PHI exfiltration — HIPAA breach in play',
        body: 'Client C (medical clinic) forensics reveal the C2 beacon was active for 3.5 hours before containment. Network egress logs show 340MB transferred to 185.220.101.47. The clinic\'s IT coordinator has identified the exfiltrated folder includes electronic patient records — approximately 2,200 PHI records including diagnoses, treatment history, and insurance details. The clinic is a HIPAA Covered Entity. Your MSP holds a Business Associate Agreement (BAA) with them.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1041 Exfiltration over C2 Channel' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'This is a confirmed HIPAA breach. The 60-day breach notification clock begins from today\'s discovery date. Your obligations under the BAA are separate from and in addition to the clinic\'s Covered Entity obligations. Coordinate with the clinic\'s Privacy Officer immediately.',
          tl: 'Provide the clinic\'s team with all network logs, timestamps, and egress data for the HHS notification package. Confirm the C2 is fully blocked and no further exfiltration is occurring. Preserve all forensic evidence under legal hold.',
          cl: 'Do not reference the clinic, HIPAA, or PHI in any external communications about this incident. The breach notification for the clinic\'s patients is the clinic\'s responsibility as the Covered Entity — not yours to announce.',
          lc: 'Review your BAA with the clinic for your specific notification obligations. Engage a HIPAA-specialised attorney today. HHS breach notification and patient notification are the clinic\'s obligations, but your BAA likely requires you to notify them within a specified window — check it. Notify your carrier of the PHI exposure.',
          es: 'Financial exposure: HIPAA civil penalties can reach $2M+ per violation category. The clinic has a claim against you under the BAA. This is your highest-severity client incident. Brief the board. Ensure legal has full authority to respond.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Seven unaffected clients demanding assurance — two threatening to terminate',
        body: 'The seven clients with the RMM agent but no confirmed infection have all been notified. Two have issued formal contract review notices. One enterprise client (financial services firm, your second-largest account) will not permit the RMM agent back on their network until they receive an independent third-party forensic report confirming your environment is clean. Your RMM vendor has issued an emergency patch and certified their platform clean, but three clients want independent verification. A tech reporter has left a voicemail for your main line asking about "the MSP breach."',
        phaseIdx: 3,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — Recovery and reputation', technique: 'N/A' },
        rolePrompts: {
          ic: 'Develop a client-by-client re-engagement plan. The forensic report request from the financial services client is reasonable — scope and fund it. Every client needs a specific status update this week, not a group email.',
          tl: 'Prepare a technical attestation package: what happened in your environment, what was compromised, what was remediated, and what new controls are in place. This answers what every client and the reporter will ask. Include the new vendor vetting controls you are implementing.',
          cl: 'Issue a public statement before the reporter\'s story runs. Acknowledge the vendor compromise, describe your response, and outline the new controls. Proactive is always better than reactive. The reporter will quote whatever they have — give them something accurate.',
          lc: 'Respond formally to the two contract review notices. Confirm your carrier is engaged and a claim is in progress. Identify which client agreements have termination-for-cause clauses that could be triggered and assess the risk.',
          es: 'The vendor relationship decision: do you stay with this RMM platform or migrate? What is the migration cost, timeline, and disruption to clients? This is a strategic decision that affects every client relationship. The board needs a recommendation.',
        },
      },
    ],
  },

  // ── BCDR TRACK ─────────────────────────────────────────────────────────────

  bcdr_dc_outage: {
    id: 'bcdr_dc_outage',
    track: 'bcdr',
    title: 'Datacenter Outage',
    industry: 'All',
    duration: '~90 min',
    difficulty: 'Hard',
    summary: 'Fire suppression system discharges in the server room. All on-premises systems offline. Six-hour minimum wait for air quality clearance before re-entry. Hardware damage unknown.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'Facilities Manager',
      raw: 'The FM-200 suppression system discharged in Server Room B at 02:14. All servers have shut down. Facilities has sealed the room — fire marshal will not allow re-entry until air quality clears. We do not know what triggered it. No fire visible. Estimated clearance: 4–6 hours minimum.',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'Technician anomaly',
        title: 'All on-premises systems confirmed offline',
        body: 'Network Operations confirms all on-premises systems are unreachable: ERP, file servers, email gateway, VOIP, backup appliance. Cloud-hosted systems (Microsoft 365, Salesforce) are up. Staff arriving for the morning shift have no access to core business systems. Helpdesk is overwhelmed with calls. The suppression cause is still unknown — facilities suspect a faulty sensor but cannot confirm until re-entry.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Activation & Assessment', technique: 'NIST SP 800-34 Rev.1 Section 4' },
        rolePrompts: {
          ic: 'Formally activate the Business Continuity Plan. Identify your BC Team leads and stand up the command structure. What is your first priority — staff communication or DR activation?',
          tl: 'Confirm exactly what is down and what is cloud-based. Start the DR runbook. What is the RTO and RPO for each critical system and can they be met?',
          cl: 'Staff have no systems. What do you communicate to employees right now? What about clients or customers expecting service this morning?',
          lc: 'Review any SLA or contractual commitments that may be in breach due to this outage. What is your notification obligation to counterparties?',
          es: 'Invoke the BC Plan formally. Brief the board. What manual operations can sustain the business while systems are down?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'BC Plan formal activation — authority, triggers, and what declaration unlocks',
        body: 'All on-premises systems have been offline since 02:14 due to FM-200 suppression discharge. The BC Team is assembled and responding. Before proceeding to recovery actions, one foundational question must be answered: has the BC Plan been formally activated, by whom, and under what authority? Formal BC Plan activation is distinct from responding to an incident. Your BC Plan should contain documented trigger criteria — the objective thresholds that, when met, require formal declaration. Common criteria include: critical system downtime exceeding a defined threshold, simultaneous loss of multiple business-critical functions, or an event declared by a civil authority such as a fire marshal. Formal activation unlocks three critical permissions: emergency expenditure authority up to a pre-approved limit without normal procurement sign-off, authority to invoke BC vendor contracts (DR site, specialist recovery firms, alternate site providers), and authorised external communications on behalf of the organisation. Without formal activation, every emergency cost requires normal approval chains — slowing response and creating governance risk.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Formal Plan Activation', technique: 'NIST SP 800-34 Rev.1 Section 4.2' },
        rolePrompts: {
          ic: 'You are the BC Plan Owner and formal Incident Commander. State the documented trigger criteria in your BC Plan for this event type. Does the current situation — all on-premises systems offline since 02:14, fire marshal entry prohibition, unknown hardware damage — meet those criteria? If yes, formally declare now and confirm: (1) your emergency expenditure limit requiring no further approval, (2) which BC vendor contracts you are now authorised to invoke, and (3) who on this call is the Deputy IC if you become unavailable.',
          tl: 'Your role in formal activation is to provide the objective technical assessment that becomes the documented basis for the IC\'s declaration. State the confirmed facts: how many systems are offline, which are cloud-accessible, and what the estimated restoration window is. Once the IC formally declares, confirm you are operating under declared BC conditions and that your DR runbook invocation is authorised without a separate purchase order.',
          cl: 'Formal BC Plan activation changes your communications authority. Under declared BC conditions, who is authorised to issue client communications, staff notifications, and media statements without individual approval per message? If activation has not been formally declared, your communications are governed by normal sign-off chains — potentially too slow for this event. Confirm with the IC: are you operating under formal BC authority right now?',
          lc: 'The legal distinction between formal BC Plan activation and informal incident response matters for two reasons: (1) decisions made under declared BC conditions are more defensible if later challenged — they were made under a documented emergency framework; (2) formal activation may be required to trigger business interruption insurance cover. Review your BI policy: does it require a formal internal declaration as a claim precondition? If so, the IC\'s declaration is also a precondition to a valid insurance claim.',
          es: 'The Executive Sponsor co-authorises formal BC Plan activation at the P1 threshold. Formally co-sign the declaration with the IC now. State the emergency expenditure limit — the specific amount that can be committed without a separate board approval during this declared event. Communicate that number to every decision-maker on this call so emergency procurement is not held up by approval uncertainty.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'RTO/RPO alignment required before DR activation',
        body: 'Before initiating DR failover, the BC Team must align on documented Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) for each affected system. The following are confirmed offline: ERP system (finance, operations, billing — primary business application), File Servers (shared drives, departmental data), Email Gateway (inbound/outbound mail flow halted), VoIP Phone System (all handsets and PBX unreachable), Backup Appliance (non-responsive — last verified backup run unknown). Your BC Plan should specify the maximum acceptable downtime (RTO) and maximum acceptable data loss in hours (RPO) for each. The DR decision must be based on these commitments — not on what is technically convenient to recover first.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Business Impact Analysis', technique: 'NIST SP 800-34 Rev.1 Section 3' },
        rolePrompts: {
          ic: 'State the documented RTO for each offline system from memory or from the BC Plan in front of you right now. If you cannot state them without looking it up, that is your finding — the plan exists on paper but not in the team\'s operational knowledge. What is the RTO for the ERP specifically, and does the current DR timeline meet it?',
          tl: 'For each offline system, state its RTO and its RPO. Then assess: given the hardware damage and DR environment readiness, can each objective actually be met? Identify every system where the RTO or RPO is already at risk of being missed before DR failover even starts.',
          cl: 'The business-facing RTO for the ERP may be tighter than the technical RTO — clients expecting service this morning have their own tolerance for downtime. What do clients and staff need to know, and by when, so they can manage their own operations during this window?',
          lc: 'Some of your contracts contain uptime SLA commitments that function as a contractual RTO. Identify any contract where the current ERP or email downtime creates a breach exposure. The clock on those SLAs started when the systems went offline at 02:14.',
          es: 'You approved the BC Plan that set these RTO and RPO targets. This event will determine whether the investment in DR infrastructure actually matches those commitments. If the ERP RTO cannot be met with the current DR environment, that is a planning failure — not just an operational one.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Business impact cascade — what fails first, and what does it cost?',
        body: 'The ERP has been offline since 02:14. As downtime extends, business processes fail in sequence. In the first hour: helpdesk is overwhelmed and non-cloud staff are idle. By hour four: order processing and sales quoting are blocked, new revenue cannot be captured, and project delivery teams have no access to client data. By hour 24: billing and accounts receivable runs are missed, payroll preparation is blocked if this falls on a cycle, and client escalations begin arriving. The financial impact compounds hourly — idle staff cost, delayed invoicing means delayed collections, and each day of ERP downtime extends accounts receivable aging for every outstanding invoice. Your BC Plan\'s Business Impact Analysis should have quantified this cascade before you were in it.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Business Impact Analysis', technique: 'NIST SP 800-34 Rev.1 Section 2.3' },
        rolePrompts: {
          ic: 'What is the hourly cost of this outage? Idle staff across all non-cloud-capable roles, delayed order processing, suspended billing — put a number on it. If you cannot state the hourly cost, you cannot make a cost-justified decision about emergency DR spend. That number is what authorises tonight\'s recovery budget.',
          tl: 'Map the process failure sequence: which applications are failing right now, and what manual workarounds exist for each? ERP is the core — but which downstream systems (billing, purchasing, CRM reporting) are also affected that are not on your immediate radar?',
          cl: 'At what hour does this outage hit the first client deliverable, scheduled client call, or proposal deadline? That is your external business impact clock — not the technical recovery timeline. Identify the first three client-facing impacts and when they occur.',
          lc: 'SLA exposure, late-payment clauses, and force majeure provisions all have financial implications. What is the worst-case contractual exposure if the ERP is down for 24 hours? 48 hours? Quantify it for the board.',
          es: 'What is the board-level financial exposure so far — idle staff cost, delayed billing, and potential SLA credits? Approve emergency DR spending on the basis of this number, not on instinct. At what daily cost of downtime does the DR investment break even?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Communication tree — who has been notified, and where is the contact list?',
        body: 'Three hours into the outage, all on-premises systems remain offline. Staff arriving for the morning shift have no access. Clients may be expecting service. The BI insurer has not been notified. The board has not yet been briefed. This inject audits the communication tree: who has been told what, who has not been told, and who is responsible for each call. A BCDR communication tree has four tiers: (1) Internal — all staff need to know their working status and what to do right now; (2) Operational — clients and key suppliers whose service is affected need a factual update with a realistic timeline; (3) Financial and legal — your BI insurer, your bank if cash flow is at risk, and any retained legal counsel; (4) Regulatory — any authority where the outage affects a regulated service or data. The most common failure exposed by this inject: the staff emergency contact list is stored in the ERP\'s HR module — which has been offline since 02:14.',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Stakeholder Communications', technique: 'NIST SP 800-34 Rev.1 Section 4.4' },
        rolePrompts: {
          ic: 'Walk through the stakeholder notification log right now. Who has been called, what was communicated, and at what time? For each of the four tiers — staff, operational clients, financial and legal, regulatory — confirm: notified, not yet notified, or not applicable. Then: where is the staff emergency contact list? If it lives in the ERP or on a shared drive, it is offline right now. How are you notifying 40-plus staff that their working day has fundamentally changed?',
          tl: 'You are managing the technical response, but you own one critical communication: the honest restoration timeline estimate to the IC. The IC cannot give staff, clients, and the insurer a credible recovery window without it. Right now — not in an hour — what is your best estimate of when systems will be restored? Give a range with your confidence level. That estimate is what every other stakeholder communication is built on.',
          cl: 'Three communications need to go out in the next 30 minutes: (1) an all-staff notification about the outage and their working status today; (2) a holding message to clients expecting service this morning; (3) an update to the board or ownership. What channel are you using for each — phone tree, personal text, email from home? The all-staff contact list: where is it and can you access it right now?',
          lc: 'Identify all time-bound notification obligations triggered by this outage: (1) BI insurance notification window — what does the policy require and when does it expire?; (2) any client contract with a service disruption notification clause; (3) any regulatory reporting obligation if the ERP holds data subject to breach or outage notification requirements. For each, state the deadline and confirm whether you are within it.',
          es: 'Have you personally briefed the board or ownership? If not, that call happens now. The message is two sentences: what happened and the current best-case restoration timeline. Then confirm: have you authorised the Communications Lead to issue client communications without your approval on each message? That authorisation needs to be explicit — the approval delay is too slow for this event.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'DR site failover — is the secondary environment ready for production load?',
        body: 'The air quality clearance is 4–6 hours away and hardware damage is unknown. The BC Team cannot wait for re-entry before making the DR activation decision. Before initiating DR failover, the team must assess what the secondary environment actually contains and whether it can carry the production workload. Many DR environments are designed to specification but have never been tested at full production load — this is the moment that assumption is tested. Key questions before failover: what systems are replicated to the DR site and when was the last successful replication? Can the DR environment carry 100% of normal ERP, email, and file server workload simultaneously? Is the DR environment a cloud console, a secondary physical site, or co-location? What is the access path and who holds the credentials?',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Alternate Site / Failover', technique: 'NIST SP 800-34 Rev.1 Section 5 + ISO 22301:2019 Section 8.3' },
        rolePrompts: {
          ic: 'Formally authorise DR failover. Before you do: confirm with the TL that the DR environment has been tested at production load — not just existence-checked. State the DR site location and access method. Who is the named DR site manager or technical contact? If the DR environment fails to carry production load after failover, what is the fallback? That answer needs to be on the table before you authorise the switch.',
          tl: 'DR readiness assessment before initiating failover: (1) when was the last full DR test at production load — not a connectivity check, but a full workload test?; (2) what is the replication lag — how many hours of transactions are in the DR environment right now?; (3) which systems are in DR scope and which are not?; (4) who needs to remotely manage or physically access the DR environment, and do they all have current credentials? State your confidence level: is this a DR environment you are confident in, or one that has only been assumed to work?',
          cl: 'Staff arriving this morning need to know two things: (1) working from home on cloud-accessible systems is the current model; (2) when DR is live, the ERP will be accessible via a specific URL or VPN endpoint — not the usual one. Who communicates the DR access details to staff, and is there documentation of what the DR environment looks like from a user perspective?',
          lc: 'If the DR environment is hosted in a different jurisdiction from the primary site, data sovereignty questions arise — particularly for client data, financial records, or any data subject to residency requirements under contracts or regulatory obligations. Confirm the DR environment location and check it against any data jurisdiction commitments in client agreements.',
          es: 'Authorise DR activation. The daily cost of operating without the ERP — idle staff, blocked billing, paused operations — is the break-even calculation for DR spend. If DR costs less per day than the operational loss, the decision is made. State the authorised DR spend cap for this event and confirm it covers vendor engagement, DR site costs, and specialist recovery if hardware proves unrecoverable.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Air quality clears — hardware damage found',
        body: 'Re-entry permitted at 08:30 — 6 hours after discharge. Initial inspection: 3 of 8 servers show visible corrosion on exposed boards from the suppression agent. The backup appliance is non-responsive. The primary storage array powers on but throws errors. IR team estimates 40–60% of hardware is unrecoverable without specialist restoration. Vendor hardware replacement lead time: 5–7 business days.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Damage Assessment', technique: 'ISO 22301:2019 Section 8.4' },
        rolePrompts: {
          ic: 'Hardware restoration is 5–7 days at best. Is your DR environment capable of carrying full production load for that period? What do you tell the business?',
          tl: 'Assess the storage array errors — is data intact? Can you recover from off-site backup? What is the actual RPO gap? Begin DR failover sequence if data is confirmed accessible.',
          cl: 'Staff are waiting for an update. Clients may be chasing deliverables. What is the revised communication — how long is this outage?',
          lc: 'Hardware replacement is 5–7 days. SLA exposure is now significant. Brief the IC on contractual notification obligations and force majeure applicability.',
          es: 'Approve emergency hardware procurement. Authorise DR environment cost. Should you engage a specialist data recovery firm for the storage array?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'DR failover attempted — RPO gap identified',
        body: 'DR failover to the secondary site has been initiated. Cloud replication was intact for most systems. However, the last successful backup of the ERP database is 26 hours old — the nightly backup job failed silently for the past three nights due to a disk quota error on the backup appliance. Transactions from the last 26 hours are not in the DR environment. Finance estimates 200–300 transactions unaccounted for.',
        phaseIdx: 3,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Recovery Initiation', technique: 'NIST SP 800-34 Rev.1 RTO/RPO' },
        rolePrompts: {
          ic: 'The backup failure is a separate systemic issue exposed by this event. How do you handle the 26-hour data gap — reconstruct manually, accept the loss, or delay DR activation while you investigate?',
          tl: 'Check whether the ERP transaction logs on the corrupted storage array can be extracted. If the array has readable sectors, you may be able to close the RPO gap. What are the options and timelines?',
          cl: 'Finance and operations need to know about the data gap. What do you tell them? Are any client deliverables or payments in that 26-hour window?',
          lc: 'A 26-hour financial data gap may have regulatory implications depending on your industry. Assess record-keeping obligations. Does the backup failure trigger any reporting requirement?',
          es: 'Approve the data reconstruction effort or accept the gap. What is the financial exposure of the missing 26-hour transaction window? Notify the board.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'DR environment stable — recovery prioritization required',
        body: 'DR environment is up and carrying core workloads. Staff can access email, file shares and the ERP (with the 26-hour data caveat). However, the DR environment was sized for 60% of normal load — performance is degraded on the ERP and the VoIP system is not available in DR (not in scope at last review). Hardware replacement is confirmed at 6 business days. The team must decide which workloads to prioritize and which to defer.',
        phaseIdx: 4,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Continuity Operations', technique: 'BCI GPG 2023 Section 7' },
        rolePrompts: {
          ic: 'Six days in DR with degraded performance and no VoIP. Define the priority tier list: which processes must run at full capacity, which can tolerate degradation, and which can be suspended?',
          tl: 'DR is at 60% capacity. Can you optimise workload distribution to reduce ERP degradation? VoIP workaround — redirect to mobile or a cloud softphone? What will it take to get to 100% in DR?',
          cl: 'Clients need a realistic timeline. What do you communicate about the 6-day recovery window? Is there anything that needs to be escalated to key accounts directly?',
          lc: 'Six days of degraded operations may trigger contractual remedies for affected clients. Identify which contracts include uptime commitments and prepare a remediation offer.',
          es: 'Approve the workload priority tiers. What is the total cost of this event so far — hardware replacement, DR activation, staff overtime, potential SLA credits? Present to the board.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Hardware restored — return to primary site decisions',
        body: 'Replacement hardware has arrived and been racked. IT team has rebuilt the primary environment from DR replication — estimated 8-hour migration window. However, the original suppression system fault has not been fully resolved: the fire marshal has approved conditional re-entry but requires a suppression system audit within 30 days. The team must decide the return-to-primary timeline and whether to accept the residual suppression risk during the audit period.',
        phaseIdx: 5,
        correctCriticality: 'Medium',
        mitre: { tactic: 'N/A — BCDR: Return to Normal', technique: 'ISO 22301:2019 Section 8.5' },
        rolePrompts: {
          ic: 'Plan the cut-over back to primary. 8 hours of downtime — schedule it to minimise business impact. Conditional re-entry with a suppression audit outstanding: acceptable risk or wait?',
          tl: 'Migration from DR back to primary: what is the sequence? ERP first or file servers? How do you handle the 26-hour data gap — is it fully reconciled?',
          cl: 'Prepare a close-out communication to staff and clients. Acknowledge the outage, thank for patience, confirm systems are restored, and outline the improvements being made.',
          lc: 'Document the full timeline and costs for the insurance claim and board report. Assess whether the suppression system fault constitutes a building defect claim against facilities.',
          es: 'Sign off on the return to primary plan. Commission a full BC Plan review — the backup failure and the VoIP DR gap both need to be addressed before this happens again.',
        },
      },
    ],
  },

  bcdr_power_failure: {
    id: 'bcdr_power_failure',
    track: 'bcdr',
    title: 'Extended Power Failure',
    industry: 'Hospitality',
    duration: '~60 min',
    difficulty: 'Hard',
    summary: 'Major grid outage hits the building. UPS holds critical systems for 45 minutes. Emergency generator fails to start — maintenance was overdue. Manual operations with 247 guests in-house.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'Hotel Engineering — Chief Engineer',
      raw: 'Grid power went down at 19:47. UPS kicked in but the emergency generator is not starting — the maintenance vendor flagged a fuel injector issue two weeks ago and the work order was not actioned. UPS capacity is approximately 45 minutes. We have 247 guests in-house, lifts are on emergency power only, kitchen is gas so food service can continue. I need a decision now.',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'PSA ticket',
        title: 'UPS critically low — 15 minutes remaining',
        body: 'Engineering advises UPS has 12–15 minutes of runtime remaining. Server room is on UPS circuit — controlled shutdown must begin now or the systems will crash ungracefully. The generator repair crew have been called but cannot arrive for at least 90 minutes. The emergency generator fuel injector part is not in local stock — it is being sourced from a supplier 60km away. Lifts have transitioned to manual rescue mode. Guests on upper floors with mobility issues have been identified.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Activation & Assessment', technique: 'NIST SP 800-34 Rev.1 Section 4' },
        rolePrompts: {
          ic: 'Order a controlled shutdown of non-critical servers now before UPS fails. What stays up on UPS for the 90-minute generator repair window? Declare the BC event and activate the BC Team.',
          tl: 'Define the UPS priority list: PMS, fire suppression controller, security cameras, door lock system. Everything else goes down. Confirm the shutdown sequence and who executes it.',
          cl: 'Guests need to know now. PA announcement, front desk scripting for complaints, and a social media holding position. What is your message — "temporary power disruption" or more specific?',
          lc: 'Guests with accessibility needs on upper floors must be managed actively. Document every action taken for duty-of-care and insurance purposes.',
          es: 'Authorise the engineering team to action the repair immediately, including expediting the part courier. What is the cost authorisation limit you are granting without further approval?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'BC Plan formal activation — generator failure qualifies, who declares?',
        body: 'UPS is critically low with 12–15 minutes of runtime remaining. Generator repair ETA is 90 minutes minimum. All guest-facing hotel systems will be offline within the hour. This event meets the documented P1 threshold in any standard BC Plan — simultaneous loss of PMS, door lock system, and VoIP with 247 guests in-house is unambiguously a Business Continuity event. The question before this team is whether the BC Plan has been formally activated and by whom. Formal activation triggers three critical permissions: emergency expenditure authority up to a pre-approved limit without normal sign-off chains, authority to invoke BC vendors and emergency suppliers without a purchase order, and external communications authority for the IC and Communications Lead. Without formal activation, every expenditure decision in the next 90 minutes runs through normal approval chains — too slow for an active guest emergency. The portable generator hire, the part courier, and any emergency guest relocations all need this authority confirmed before the engineering team can act without delays.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Formal Plan Activation', technique: 'NIST SP 800-34 Rev.1 Section 4.2' },
        rolePrompts: {
          ic: 'State the documented trigger criteria in your BC Plan for a hotel operational emergency of this type. Does loss of grid power, generator failure, and imminent PMS outage with 247 guests in-house meet those criteria? Formally declare now and confirm: (1) your emergency expenditure limit authorised under declaration, (2) which BC vendors or emergency suppliers you are now authorised to invoke without a separate purchase order, and (3) that the Engineering team is authorised to commit to the portable generator hire and the part courier immediately without waiting for ownership sign-off.',
          tl: 'Your technical assessment — UPS at 12–15 minutes, generator failed to start, portable generator ETA 90 minutes — is the objective basis for the IC\'s activation declaration. Present it as a formal assessment and hand it to the IC as the documented activation trigger. Once the IC declares, your shutdown sequence and recovery actions are all authorised under declared BC conditions and do not require individual approval for each step.',
          cl: 'Under declared BC conditions, the Communications Lead has named authority to issue guest communications, holding statements, and staff briefings without seeking individual sign-off per message. If the BC Plan has not been formally declared, every guest announcement requires approval — that is not workable in a 15-minute window before systems go dark. Confirm with the IC: is the plan formally activated and do you have external communications authority right now?',
          lc: 'The deferred generator maintenance creates a negligence exposure. Formal BC Plan activation creates a documented record that the organisation responded appropriately under an emergency framework once the failure became apparent — important for both liability management if a guest is harmed, and for business interruption insurance. Confirm whether your BI policy requires formal internal declaration as a claim precondition. If so, the clock on that notification starts now.',
          es: 'Formally co-sign the BC Plan activation with the IC. State the emergency expenditure limit — a specific dollar amount. The portable generator hire, the part courier, and any emergency guest relocations are all approved within that limit. Remove the approval constraint from the Engineering team for the next 4 hours so they can act without confirmation delays.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Critical systems RTO — restoration priority sequence',
        body: 'With UPS failing and no generator, the team must establish the maximum tolerable downtime for each critical hotel system before they go dark. Once power is lost, restoration sequence when it returns will be governed by the RTO for each system — not by what is technically easiest to restart. Systems at risk: Property Management System / PMS (reservations, check-in, billing, folios — 247 guests in-house), Point of Sale terminals (F&B, gift shop, all cashless payments), Door Lock System (electronic key cards for all guest rooms), CCTV and Security Cameras (all locations), VoIP and Front Desk Phones (guest room handsets and switchboard), HVAC and Building Automation (temperature monitoring and refrigeration alerts). Each has a different RTO based on guest safety, operational obligation, and revenue impact. The BC Plan should specify which systems are restored first and what the manual workaround is while each is down.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Business Impact Analysis', technique: 'NIST SP 800-34 Rev.1 Section 3' },
        rolePrompts: {
          ic: 'Rank each system by restoration priority. Guest safety systems are non-negotiable. Define your three restoration tiers: must be up within 1 hour, within 4 hours, and within 24 hours. For each system not in the first tier, what is the manual workaround while power is out?',
          tl: 'State the RTO for each system from the BC Plan or DR runbook. The portable generator can power only the server room — that means PMS and back-office systems recover first. Is that the right priority order, or should the door lock system be given generator priority over the PMS?',
          cl: 'Guests cannot unlock their rooms if the door lock system is down — that is a safety and duty-of-care issue, not just an inconvenience. What is the manual process for guests locked out of their rooms, and what do you communicate to all 247 guests right now about the situation?',
          lc: 'The hotel\'s operating licence and duty-of-care obligations define a de facto RTO for guest safety systems. If door locks are inoperable beyond a certain period, what are your regulatory notification obligations and potential guest relocation duties under your licence conditions?',
          es: 'The generator maintenance flag was raised 18 days ago and not actioned. The RTO assumptions in your BC Plan were built on generator availability within 45 minutes — that assumption has now failed. Approve whatever emergency cost is needed to restore guest safety systems first. The business case for backup power investment writes itself tonight.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Revenue impact per hour — what is this outage actually costing?',
        body: 'The hotel has been operating without PMS and POS since 20:41. With 247 guests in-house, the financial impact is immediate and measurable. POS terminals are offline — all F&B and retail revenue is cash only, and most guests do not carry cash. The restaurant is operating at reduced capacity. Room service orders cannot be processed. Charge-to-room is unavailable at the bar and gift shop. Each hour without POS is direct lost F&B revenue and charge-to-room transactions that will not be recovered. The PMS outage means check-in queues are building for tonight\'s arrivals — some guests will choose not to wait, and walk-in room enquiries are going elsewhere. The business impact is not theoretical: it is happening transaction by transaction right now.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Business Impact Analysis', technique: 'NIST SP 800-34 Rev.1 Section 2.3' },
        rolePrompts: {
          ic: 'What is the direct revenue loss per hour of this outage? F&B revenue on a fully booked Friday night, charge-to-room transactions that cannot be posted, and walk-in rooms that are going vacant. State the number. That figure justifies the emergency generator hire cost and every other recovery expense tonight.',
          tl: 'When power is restored and systems come back online, is all manual charge data recoverable? What has been captured on paper tonight that must be entered into PMS and POS on restoration? Who owns that reconciliation and what is the timeline — if night audit cannot run, tomorrow\'s revenue reporting is also affected.',
          cl: 'Guests who cannot check in or cannot pay for dinner are having a poor experience that will appear in reviews tomorrow. What is the reputational cost of this outage, and what is your guest recovery offer — F&B credit, room discount, complimentary upgrade? Who has authority to approve compensation on the spot?',
          lc: 'OTA bookings have cancellation and no-show policies that require PMS to process correctly. If guests check in manually tonight and the PMS record is lost or corrupted on restoration, what is the revenue and contractual exposure with Booking.com, Expedia, and your direct booking engine?',
          es: 'What is the total financial exposure of this event: direct F&B revenue lost, room charges not captured, guest compensation authorised, and potential OTA penalty exposure? Brief ownership now. This number also writes the maintenance investment case — the generator repair deferred 18 days ago cost less than an hour of this outage.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Communication tree — guests in-house, OTA platforms, and the offline PMS contact list',
        body: 'Power has been off since 19:47. PMS is offline. Two hundred and forty-seven guests are in-house and no consistent message has reached them — individual staff members have told guests different things. Arriving guests for tonight have not been contacted. OTA platforms — Booking.com and Expedia — still show the hotel as fully operational. The BI insurer has not been notified. The engineer has been called but no formal incident log has been started. This inject audits the full communication tree for a hotel operational emergency with guests in-house. The critical gap: guest contact details for arriving and in-house guests are stored in the PMS, which has been offline since 20:41. Without that list, direct guest notification depends on physical presence alone.',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Stakeholder Communications', technique: 'NIST SP 800-34 Rev.1 Section 4.4' },
        rolePrompts: {
          ic: 'Walk through the communication log. In-house guests: is there a consistent message from the hotel, or has each staff member said something different? Tonight\'s arriving guests: have any been contacted before they walk into a building with no power? OTA platforms: Booking.com and Expedia currently show the hotel as fully operational for tonight\'s arriving guests — is that accurate and should it remain so? BI insurer: notified? Map every stakeholder group: confirmed communicated, not yet notified, or not applicable.',
          tl: 'The recovery timeline estimate is the foundation of every communication tonight. When will PMS be back, when will power be restored, when will full operations resume? If you cannot give a number, the Communications Lead cannot give guests or OTA platforms a credible update. Give a range with your confidence level. That number drives everything else in this communication tree.',
          cl: 'Three communications must go out tonight: (1) a consistent message to all 247 in-house guests — one script, one source of truth, replacing whatever individuals have said so far; (2) notification to tonight\'s arriving guests about the reduced operations — how do you reach them without the PMS contact list?; (3) an accurate status update to OTA platforms. What channel reaches every in-house guest simultaneously when room phones are offline?',
          lc: 'Three legal obligations are live tonight: (1) BI insurance notification — what does the policy require and when is the deadline?; (2) duty of care to in-house guests, particularly those with accessibility needs or medical requirements who are affected by the elevator situation; (3) OTA contractual notification requirements — Booking.com and Expedia contracts typically include clauses requiring notification if operational status changes materially. State the most time-sensitive of the three.',
          es: 'Have you briefed the hotel owner? What is the financial exposure summary you are providing? Confirm that the Communications Lead has authority to issue the guest message and OTA notification without waiting for your sign-off on the specific wording. At what total cost of guest compensation does tonight\'s event become a reputational risk requiring a formal management response beyond individual front-desk conversations?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Manual operations model — command location, staff positions, and system workarounds',
        body: 'UPS has failed and the portable generator is 90-plus minutes away. The hotel is operating on candlelight and manual procedures. The question is no longer whether to operate manually — it is how. With PMS, VoIP, and electronic door lock management all offline, the hotel requires a complete switch to paper-based and physical processes that staff may not have rehearsed. This inject maps the alternate operations model: where is each operational team physically located, what manual process replaces each offline system, and how are departments coordinated across a hotel with no electronic communication systems?',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Alternate Site / Failover', technique: 'NIST SP 800-34 Rev.1 Section 5 + ISO 22301:2019 Section 8.3' },
        rolePrompts: {
          ic: 'Define the physical command centre for the next 90 minutes: where is the BC Team based and how does each department head report in? With VoIP offline, what is the communication method — walkie-talkies, physical runners, personal mobile phones? State the cadence: how often does each department head check in, and what is the escalation path if something goes wrong in a part of the building you cannot electronically monitor?',
          tl: 'When the portable generator arrives at 22:15, who physically needs to be in the server room to manage the startup sequence? Confirm: is the server room on the same door lock circuit as guest areas, or does it have a physical key override? Who holds that key right now? If the answer is a staff member who has already gone home, that is an access problem you need to solve before 22:15.',
          cl: 'Manual check-in is now the guest experience for all 247 in-house guests and tonight\'s arriving guests. Where does manual check-in happen? Do staff have access to the paper reservation backup — a physical printout of tonight\'s arrivals, room assignments, and rates? If no paper backup exists or it is not current, what is the manual check-in process for a guest whose reservation exists only in the PMS?',
          lc: 'Every manual operations decision made tonight should be logged with a timestamp — who authorised each workaround, when, and on what basis. If a guest is harmed or a charge dispute arises, the manual operations log is the evidence record. Assign one person to maintain a physical incident log right now. That log is also the basis of the insurance claim narrative.',
          es: 'What is the senior management presence on-site for the next 90 minutes? If the GM or owner is not physically in the hotel, they need to be updated at least every 30 minutes. Manual hotel operations with 247 guests in-house is a duty-of-care and reputational event — ownership must be reachable to authorise escalations such as guest relocation, emergency room discounts, or a media response without delays.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Systems down — generator repair delayed to 3+ hours',
        body: 'UPS failed at 20:41. PMS is offline — all reservations, folios and check-in systems inaccessible. The generator part courier is delayed — revised ETA is 23:30 (3 hours away). Engineering has sourced a portable generator from a hire company but it will not be on-site until 22:15 and can only power the server room, not the full building. Guest lifts remain on emergency battery — limited trips available. The restaurant has switched to candlelight service but kitchen gas supply is unaffected.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Continuity Operations', technique: 'BCI GPG 2023 Section 7' },
        rolePrompts: {
          ic: 'Three hours of no PMS. Define manual check-in/check-out procedures. What is the escalation protocol for guests arriving for confirmed bookings tonight? How do you handle late check-outs tomorrow if PMS is not up by morning?',
          tl: 'When the portable generator arrives at 22:15, what is the startup sequence? PMS first — confirm the startup procedure and data integrity check. Who is on-site to execute this?',
          cl: 'Check-in queues will build. Front desk need a script that is honest without being alarming. What compensation policy applies tonight — F&B credit, room discount, no charge? Who authorises on the spot?',
          lc: 'Guests with pre-paid bookings who cannot check in have a legal right to a refund or alternate accommodation. Identify how many tonight\'s arrivals are in this category and what your obligation is.',
          es: 'Authorise the portable generator hire cost and expedite the delivery. What is the GM\'s authority level tonight for guest compensation? Brief ownership on the exposure.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Portable generator online — PMS recovery decision',
        body: 'Portable generator is online at 22:20. Server room power is restored. PMS is booting — estimated 25 minutes to be operational. However, the PMS came down ungracefully when UPS failed: the database requires a consistency check before accepting transactions. IT estimates the check will take 45 minutes. Options: (a) wait for the full check — PMS operational by 23:30 minimum; (b) override the check and bring PMS up now — risk of data corruption or transaction errors; (c) continue manual operations until the main generator is repaired (23:30 estimated).',
        phaseIdx: 3,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Recovery Initiation', technique: 'NIST SP 800-34 Rev.1 RTO/RPO' },
        rolePrompts: {
          ic: 'Three options — wait for the integrity check, override, or continue manual until main generator. What is your recommendation to ES and what is the risk of each?',
          tl: 'The database consistency check is non-negotiable if you want data integrity. What is the actual risk of the override option — have you seen this database handle a dirty shutdown before? What does the vendor say?',
          cl: 'Guests still waiting to check in at 22:30. What is your communication now that power is partially restored? How honest are you about the PMS delay?',
          lc: 'A corrupted PMS database post-override could lead to billing errors, double-charging, or lost reservations. Document the decision and whoever makes it. This may feature in insurance or legal proceedings.',
          es: 'Make the call: wait or override? You have guests in the lobby. What is your risk tolerance for data corruption versus guest experience at 22:30 on a fully booked night?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Main generator restored — full debrief and prevention',
        body: 'Main generator repaired and online at 23:45. Full building power restored. PMS integrity check completed and system is operational with no data corruption detected. Night audit has run successfully. The engineering report confirms the generator fuel injector failure was flagged as a maintenance risk on 14 October — 18 days ago — and the work order was not completed. Total impact: 4 hours of disrupted operations, manual check-in for 67 arriving guests, 12 guests compensated with F&B credits, 2 guests relocated to a nearby property at the hotel\'s expense. Estimated direct cost: $8,400.',
        phaseIdx: 5,
        correctCriticality: 'Medium',
        mitre: { tactic: 'N/A — BCDR: Return to Normal', technique: 'ISO 22301:2019 Section 10' },
        rolePrompts: {
          ic: 'The root cause is a missed maintenance work order. How do you prevent recurrence? Who is accountable for the work order backlog and what process change is required?',
          tl: 'Review the UPS runtime assumptions in the BC Plan — 45 minutes was insufficient for a 90-minute generator repair window. What is the correct UPS sizing, and should the PMS be added to the generator priority circuit?',
          cl: 'Draft a guest apology communication for the 67 manually checked-in guests and the 2 relocated guests. What is your social media monitoring plan for the next 48 hours?',
          lc: 'The documented maintenance risk that was not actioned is a liability exposure. Prepare a brief for ownership on the legal risk and ensure the engineering report is preserved.',
          es: 'Commission an immediate review of all outstanding maintenance work orders with a safety or BC impact. What is the acceptable response time standard for critical infrastructure maintenance flags?',
        },
      },
    ],
  },

  bcdr_keyman: {
    id: 'bcdr_keyman',
    track: 'bcdr',
    title: 'Key Person Loss',
    industry: 'MSP',
    duration: '~45 min',
    difficulty: 'Medium',
    summary: 'The sole IT Director — who holds all admin credentials and undocumented system knowledge — is hospitalised unexpectedly. No succession plan exists. Client systems need maintenance and a critical renewal is overdue.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'HR Director',
      raw: 'James Park, our IT Director, was admitted to hospital this morning with a serious medical episode. His family say it could be weeks before he returns, if at all. He is our only person with admin access to most client systems, the RMM platform, the billing system, and our Entra ID tenant. His laptop is at his home. I don\'t know who else knows any of these passwords.',
      correctSeverity: 'P2',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'Technician anomaly',
        title: 'Credential and access inventory — critical gaps found',
        body: 'IT team audit reveals: no documented admin password for the RMM platform (ConnectWise Automate), no secondary owner on 14 of 23 client Microsoft 365 tenants, root access to 6 Linux servers held only in James\'s personal KeePass file (on his home laptop), SSL certificate renewal on a client\'s e-commerce platform expires in 3 days. James\'s work phone (with Microsoft Authenticator) is also at his home. His family have been contacted and are cooperative but distressed.',
        phaseIdx: 1,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Activation & Assessment', technique: 'NIST SP 800-34 Rev.1 Section 3' },
        rolePrompts: {
          ic: 'Triage by urgency: SSL certificate expiry in 3 days is your immediate crisis. RMM access is your operational crisis. What is your 24-hour priority sequence?',
          tl: 'Start the vendor escalation process immediately for RMM admin recovery — ConnectWise has an emergency account recovery process. For the 14 M365 tenants with no secondary owner, engage Microsoft support for tenant recovery options. Who on your team has the most knowledge overlap with James?',
          cl: 'Clients do not need to know about James\'s situation — this is an internal operational matter. However, if the SSL cert expires and the e-commerce site goes down, the client will know. How do you proactively manage this?',
          lc: 'James\'s personal laptop holds company data (KeePass file). Can you legally require his family to provide it? What is your employment agreement with James? Does it address personal device use?',
          es: 'Who is appointed acting IT Director as of now? What authority do they have to engage vendors, approve emergency expenditure, and access James\'s accounts if legally permitted?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Key person loss — does your BC Plan define this as a formal BC event?',
        body: 'James Park has been hospitalised indefinitely. All critical system credentials are inaccessible. An SSL certificate expires in 3 days. SLA clocks are running across 23 managed client accounts. This is not an IT operational problem — it is a Business Continuity event. The question for this inject is whether your BC Plan defines key person dependency failure as a formal BC Plan trigger, and if so, who has authority to declare. Many organisations build BC Plans exclusively around technology outages and do not include key person loss as a named trigger. That gap means the formal protections — expenditure authority, vendor invocation rights, and governance framework — that come with BC declaration are never invoked. The team responds reactively, without authority clarity. Key person loss typically meets BC trigger criteria under any standard that includes: single-point-of-failure dependency failure, loss of access to business-critical systems beyond a defined threshold, or an event with direct client SLA impact across more than a defined number of accounts. All three apply here.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Formal Plan Activation', technique: 'NIST SP 800-34 Rev.1 Section 4.2' },
        rolePrompts: {
          ic: 'Review your BC Plan: is key person dependency failure listed as a formal BC trigger event? If yes, does the current situation meet the threshold — one employee, all critical credentials inaccessible, 23 client SLAs at risk? Formally declare now if it qualifies. If key person loss is not defined in your BC Plan, that is the most important finding from this exercise — the plan has a gap this event just exposed. Even without a documented trigger, you can invoke BC Plan governance by decision: state that decision to this team now, with timestamp.',
          tl: 'Under formally declared BC conditions, you have explicit authority to engage BC vendors and emergency service providers — including ConnectWise emergency account recovery and Microsoft support for tenant recovery — without going through normal procurement. If the IC has declared, your vendor recovery requests are authorised immediately. If they have not, your authority to commit to those engagements depends on normal approval chains. Clarify with the IC: what operating mode are you in?',
          cl: 'A formal BC declaration changes when and how you communicate with clients. Under declared conditions, the Communications Lead has authority to make proactive client contact about reduced-capability status — before a P1 occurs and forces a reactive conversation. If the IC has declared, identify the three highest-risk client accounts and draft a proactive disclosure call script. A controlled disclosure call is a far better client experience than a missed SLA with no warning.',
          lc: 'Advise the IC whether key person loss triggers notification obligations to your professional indemnity insurer. If the access gap results in a missed SLA before recovery, the insurer should know about the vulnerability before it becomes a claim. Formal BC declaration also protects the governance position: the response is documented as proportionate and structured, not reactive. Review whether your MSAs include any notification obligation to clients for operational events that materially affect your ability to meet contracted SLA terms.',
          es: 'Formally co-declare this as a BC event if the IC requests. Name the acting BC authority for James\'s absence — who is empowered to approve BC expenditure: vendor recovery costs, emergency contractor engagement, and credential management remediation? State that authority explicitly to the whole team right now. Ambiguity about who can approve emergency spend is what turns 3-hour problems into 3-day delays.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Service continuity objectives — client RTO exposure',
        body: 'With the IT Director hospitalised indefinitely, the team must assess the Recovery Time Objective (RTO) for each affected operational capability. Unlike a technical outage, this is a knowledge and access gap — recovery is vendor-assisted account recovery and credential reconstruction, not a hardware restart. The RTO for each system is defined by how long your managed clients can tolerate the MSP having limited or no access to their environment. Systems with no documented secondary access: RMM platform / ConnectWise Automate (all 23 managed client endpoints), 14 of 23 client Microsoft 365 tenants (no secondary admin owner registered), 6 critical client Linux servers (root credentials in personal KeePass only), SSL certificate renewal queue (one expiry confirmed in 3 days), Billing system (invoicing, collections, contract renewals). Your SLA response time commitments to clients apply regardless of the reason you are unable to access their environment.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Business Impact Analysis', technique: 'NIST SP 800-34 Rev.1 Section 3' },
        rolePrompts: {
          ic: 'What is your contracted SLA response time for a P1 incident? Your RMM platform is inaccessible — you cannot remotely respond to any managed client right now. For each of the 14 inaccessible M365 tenants: what is the probability of a P1 occurring before access is restored, and what is your fallback response if it does?',
          tl: 'Vendor-assisted account recovery has defined timelines: ConnectWise emergency account recovery is 24–48 hours; Microsoft 365 tenant recovery via domain verification is 48–72 hours. These are your hard RTOs for those systems. Map each inaccessible system to its vendor recovery timeline. Which client has the highest risk of needing support before you can reach their environment?',
          cl: 'At what point do you proactively contact each client to disclose that your access to their environment is temporarily limited? If a client experiences a P1 and you cannot respond within SLA, they will find out you lacked access regardless. When does silence become a bigger reputational risk than the disclosure conversation?',
          lc: 'Your MSAs likely include response time SLAs. The unavailability of one employee does not constitute force majeure for contractual purposes — the obligation runs to the company, not the individual. If a client raises a P1 and you miss the SLA response time because of this access gap, that is a breach. Does your professional indemnity insurer need to know today?',
          es: 'The RTO for restoring full operational capability across all affected clients is measured in days, not hours. How many days can this business operate at reduced capability before clients begin to escalate or churn? That answer defines the minimum investment required in succession planning and credential management.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Client impact quantification — what is this access gap costing per hour?',
        body: 'The MSP has been operating with reduced access capability since this morning. Unlike a systems outage, the financial impact is realised through SLA breaches, client churn risk, and deferred revenue rather than immediate lost transactions. P1 response SLA clocks are running across all 23 managed clients — if a P1 occurs on any of the 14 inaccessible tenants, the SLA is missed the moment the ticket is raised. Most MSP agreements include SLA credit provisions: a missed P1 response SLA typically triggers a credit worth one month of managed services for that client. With 14 inaccessible tenants, credit exposure compounds with every hour the access gap remains open. Beyond SLA credits, client confidence erodes with each hour a client cannot reach effective support.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Business Impact Analysis', technique: 'NIST SP 800-34 Rev.1 Section 2.3' },
        rolePrompts: {
          ic: 'What is the monthly managed services revenue for the 14 inaccessible client tenants combined? That is your maximum SLA credit exposure per P1 missed on each client. If two clients raise P1s before access is restored, what is the total credit liability? State the number and share it with the ES now.',
          tl: 'Rank the 14 inaccessible tenants by P1 risk — which clients have the most active environments, the most users, or the highest historical incident rate? The BIA is not equal across all 14. Prioritise vendor recovery for the highest-risk tenants first and be explicit about your ranking rationale.',
          cl: 'At what point does client frustration become client churn? An MSP that cannot access a client environment and does not proactively communicate is one conversation away from losing that contract. What is the average client lifetime value, and how many clients can this business afford to lose before this event is existential?',
          lc: 'Review the 14 affected MSAs for SLA credit provisions and liability caps. What is the maximum aggregate credit exposure if every affected client raises a P1 today? Confirm whether caps apply per-incident or per-period — that changes the total exposure significantly.',
          es: 'Total risk exposure: SLA credit liability across 14 clients, churn value of the highest-risk relationships, and cost of the credential management remediation you will now commission. The remediation cost is almost certainly lower than the downside. Approve the credential management project today with a timeline and budget.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Client communication strategy — what do you tell 23 clients without disclosing James\'s situation?',
        body: 'James has been hospitalised for more than 24 hours. The MSP is operating at reduced capability: RMM access restored, 5 client tenants still inaccessible, and one client e-commerce site has already gone down due to a missed SSL renewal. No proactive client communication has been issued. The 23 managed clients do not know the MSP had a capability gap — they know only what they experienced: a delayed response, an expired certificate, an unfamiliar voice on the phone. This inject audits the client communication strategy. The challenge is specific: communicate honestly about a reduced-capability period without disclosing the private medical details of a named employee, and without making statements that create legal liability for the SSL failure or the access gap.',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Stakeholder Communications', technique: 'NIST SP 800-34 Rev.1 Section 4.4' },
        rolePrompts: {
          ic: 'Map your 23 clients into three communication tiers: (1) clients who have already experienced a service failure — these need a personal call today; (2) clients with high-risk environments where a P1 is likely before full access is restored — these need a proactive call before something goes wrong; (3) clients where no impact has occurred and risk is low. Who is in tier 1 and tier 2, and who makes those calls? Do not wait for a problem to force the conversation.',
          tl: 'The client contact list — where is it? Is it in ConnectWise (now accessible), in James\'s email on the recovered laptop, or elsewhere? For each of the 5 still-inaccessible tenants: what is the technical contact name, phone number, and escalation path if a P1 occurs in the next 24 hours? If you cannot answer without a system James controlled, you have a second key-person dependency you did not know about.',
          cl: 'Draft the tier-1 call script — the conversation with the client whose e-commerce site went down. It must acknowledge the service failure honestly, not disclose James\'s medical situation (that is private), avoid admissions of a structural credential management failure (that creates legal liability), and offer a credible remediation. Then draft the tier-2 proactive message — the confidence-building call to your highest-risk clients before a problem forces the conversation.',
          lc: 'Two legal constraints shape all communications: (1) James\'s medical situation is private health information — do not disclose it to clients and instruct all staff accordingly; (2) the SSL failure and access gap may constitute SLA breaches — avoid admissions of liability in any client message. The safe framing is: a temporary operational constraint has been resolved. That is accurate and defensible. Advise the ES on whether the professional indemnity insurer should be notified proactively today.',
          es: 'Who is the named executive contact for the two or three most sensitive client relationships? Those clients should hear from the most senior person available — not a support technician. Who makes those calls, and what is the executive-level message? Then: have you notified the professional indemnity insurer of the SSL failure and access gap? An insurer notified before a claim is filed is in a far stronger position to support you than one who learns about it after the fact.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Alternate capability map — who covers James, what tools exist, what is the P1 fallback?',
        body: 'James is hospitalised indefinitely. The BC Plan addresses physical and technology outages but does not define a key person dependency response. This inject maps the alternate operational capability that exists without James: the people who can partially cover his functions, the tools available without his credentials, and the fallback procedure for a P1 on any of the 5 still-inaccessible client tenants. An alternate capability map is the key person equivalent of a DR site plan — it answers the same questions for people that a DR plan answers for infrastructure: what is the substitute, what does it actually provide, and where are the gaps?',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Alternate Site / Failover', technique: 'NIST SP 800-34 Rev.1 Section 5 + ISO 22301:2019 Section 8.3' },
        rolePrompts: {
          ic: 'Map every function James owned against an alternate owner or a documented workaround: RMM platform administration, M365 tenant administration for the 14 affected clients, SSL renewal management, billing system access, and Entra ID administration. For each, name the person who now owns it or describe the workaround. If a function has no named alternate and no workaround, that is a critical gap. Prioritise by P1 risk: which function failure would be most immediately client-impacting if it occurred in the next 24 hours?',
          tl: 'Now that RMM is partially restored: (1) what monitoring coverage do you have across all 23 clients — are alerts configured and routing to someone who can respond?; (2) for the 5 still-inaccessible tenants, what is the technical fallback if a P1 occurs — who do you call and what can they actually do without tenant access?; (3) are there other single-person tool dependencies discovered in this audit that were not known before James was hospitalised? Name them.',
          cl: 'Who is the alternate client-facing contact for the accounts James managed directly? Most MSP clients have a primary named contact — if that is James, the client is now calling a number that reaches voicemail or an unfamiliar team member who does not know the account. Identify all James-managed accounts and assign interim contacts today. Each affected client should receive an introduction from the interim contact by end of business.',
          lc: 'What documentation of James\'s institutional knowledge exists in written or recorded form? Knowledge held by a single person with no backup is a business continuity liability. For the 8–12 week absence period, what knowledge transfer is possible — can James provide written guidance for critical processes while recovering? That documentation also reduces legal risk if a client later claims the MSP lacked the capability it was contracted to provide.',
          es: 'Commission two projects before James returns: (1) a centralised credential management migration — all shared credentials into a team-managed vault with mandatory secondary owners on every client account; (2) a knowledge transfer programme — all undocumented processes documented, all client environments with a named secondary engineer. Set the timeline and budget now. The cost of these projects is the insurance premium against the next key person event.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'SSL certificate expired — client e-commerce site down',
        body: 'The SSL certificate on the client\'s e-commerce platform expired at 00:01 — renewal was in James\'s personal task list, not the company ticketing system. The client\'s online store is showing browser security warnings and checkout is blocked. The client has called three times and is escalating to the owner. RMM admin recovery from ConnectWise is in progress but will take 24–48 hours. James\'s family have agreed to allow IT to collect the laptop — a team member is en route.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Continuity Operations', technique: 'BCI GPG 2023 Section 6' },
        rolePrompts: {
          ic: 'The client e-commerce site is down and the client is escalating. This is now a client relationship crisis as well as a technical one. Who calls the client\'s owner and what do they say?',
          tl: 'SSL renewal does not require the original IT Director — most CAs allow renewal via account recovery or DNS validation. What is your fastest path to restoring SSL on this site and who can execute it without James\'s credentials?',
          cl: 'The client will ask why their renewal was missed. Your answer must be honest but careful. What do you say about the root cause without creating legal liability?',
          lc: 'Missed renewal causing client downtime is a potential SLA breach. Review the MSA with this client. Does it include an uptime SLA? What is the remediation provision?',
          es: 'Approve emergency procurement of a new SSL certificate if the existing renewal is blocked. What is your commercial offer to the client to acknowledge the failure?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'KeePass file recovered — succession plan needed',
        body: 'James\'s laptop has been retrieved. The KeePass database requires James\'s master password — his family do not know it. IT has contacted James via his family; he is conscious and willing to help but is on medication and communication is limited. He has provided a partial password verbally via his wife (who is relaying by phone) — the team is attempting to reconstruct it. RMM admin access has been restored via vendor escalation. The acting IT lead has now mapped 18 of 23 client tenants but 5 remain inaccessible.',
        phaseIdx: 3,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Recovery Initiation', technique: 'ISO 22301:2019 Section 8.3' },
        rolePrompts: {
          ic: 'You now have RMM access and partial credential recovery. Define the 48-hour priority: which of the 5 remaining client tenants are highest risk and what are you doing for each?',
          tl: 'For the 5 inaccessible tenants: work through Microsoft\'s tenant recovery process using domain ownership verification. What documentation do you have for each client that establishes your administrative authority?',
          cl: 'How long do you wait before proactively calling each of the 5 affected clients to warn them you may have limited access to their tenant? What is the threshold — before or after a problem occurs?',
          lc: 'Relaying company credentials through a personal family member of a sick employee creates significant liability. Document this entire process carefully. What policy change prevents this scenario from recurring?',
          es: 'Commission a full credential audit and centralised password manager migration as the top-priority IT project when this is resolved. What is the timeline and budget?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Operations stabilised — process gaps exposed',
        body: 'All critical client systems are now accessible. RMM restored. 4 of 5 inaccessible tenants recovered via Microsoft support; one required a 72-hour domain verification process. James is expected to be on medical leave for 8–12 weeks. The acting IT lead has created a temporary succession framework. The full audit reveals: 31% of company credentials were held by a single person, no formal knowledge-transfer process exists, and succession is not addressed in any employment contract. The SSL client has accepted an F&B-equivalent credit; no SLA claim pursued.',
        phaseIdx: 5,
        correctCriticality: 'Low',
        mitre: { tactic: 'N/A — BCDR: Post-Incident Review', technique: 'ISO 22301:2019 Section 10' },
        rolePrompts: {
          ic: 'The single-point-of-failure is systemic, not personal. What are the three process changes you commit to before James returns? What is the 90-day plan?',
          tl: 'Design the credential management remediation: centralised password manager (e.g., IT Glue, 1Password Teams), documented secondary owners for all client tenants, SSL renewal in the ticketing system with automated alerts 60 days out. Realistic timeline?',
          cl: 'Should you proactively communicate the operational improvement plan to clients — or does that draw attention to a vulnerability they did not know existed?',
          lc: 'Review employment agreements to address personal device storage of company credentials, knowledge-transfer obligations, and succession trigger clauses. This is a standard MSA and employment law matter.',
          es: 'Commission a business continuity review for all single-person dependencies across the company — not just IT. Who else holds knowledge or access that only they have?',
        },
      },
    ],
  },

  bcdr_supplier: {
    id: 'bcdr_supplier',
    track: 'bcdr',
    title: 'Critical Supplier Failure',
    industry: 'All',
    duration: '~60 min',
    difficulty: 'Hard',
    summary: 'Primary managed hosting provider sends a 4-hour shutdown notice after entering receivership. All production systems are hosted there. Data must be evacuated before the plug is pulled.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'CFO — forwarded supplier notice',
      raw: 'We just received an email from CloudHost Pro stating they have entered voluntary receivership effective immediately. They will maintain services for 4 hours to allow data extraction and then all hosted environments will be powered down. Our ERP, client portal, and development environment are all on their infrastructure. We do not have a current full backup outside their platform.',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'Technician anomaly',
        title: 'Hosted systems inventory — 4 hours to evacuate',
        body: 'IT team confirms the following are hosted exclusively with CloudHost Pro: ERP system (production database 180GB), client portal (120GB, active sessions currently live), CI/CD development environment (60GB), email archive (last 3 years, 40GB). CloudHost Pro\'s API is still responding. The receiver\'s notice states services terminate at 14:00 — 3h 47m from now. No alternative hosting environment is provisioned. AWS and Azure accounts exist but only for dev/test workloads. Last full backup from CloudHost Pro\'s own backup tool: 6 days ago.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Activation & Assessment', technique: 'NIST SP 800-34 Rev.1 Section 4' },
        rolePrompts: {
          ic: 'You have 3h 47m. Define the evacuation priority order: ERP production data first, then client portal, then archives. Assign a team member to each. What is your fallback if you cannot get everything out in time?',
          tl: 'Start data pulls immediately — ERP database dump, client portal database, file exports. Do you have sufficient bandwidth and target storage to absorb 400GB in 3.5 hours? What is the real transfer rate you can achieve? Prioritise ruthlessly.',
          cl: 'Clients with active portal sessions will lose access at 14:00. What do you communicate, to whom, and when? Do not wait until 13:50.',
          lc: 'CloudHost Pro holds your data under a contractual agreement. Receivership does not extinguish your data rights — you are entitled to your data. Contact the receiver directly to confirm data rights and get the shutdown notice in writing.',
          es: 'Authorise emergency provisioning of a new hosting environment immediately. AWS/Azure on-demand — cost is not the constraint. Who has authority to commit to a new hosting contract in the next 30 minutes?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Supplier insolvency — BC activation authority for a third-party failure event',
        body: 'CloudHost Pro has entered receivership and issued a 4-hour service termination notice. All production systems — ERP, client portal, development environment, email archive — will be offline at 14:00. Before proceeding to data evacuation, one question must be answered: is this a formally declared BC event, and who has authority to make that call? Third-party supplier failure is frequently overlooked as a BC trigger in plans that focus on internal technology outages. Your BC Plan may define triggers as: loss of access to business-critical systems regardless of cause, an event with less than 24 hours to business impact, or a supplier failure affecting revenue-generating operations. All three criteria are met right now. Formal BC activation unlocks emergency procurement authority — AWS provisioning, emergency legal engagement with the receiver, and external client communications — without normal purchase-order sign-off. Without formal activation, each of those actions requires approval chains that will consume time you do not have.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Formal Plan Activation', technique: 'NIST SP 800-34 Rev.1 Section 4.2' },
        rolePrompts: {
          ic: 'You have 3h 47m until all production systems go offline. Does supplier insolvency meet your BC Plan trigger criteria? State the criteria and confirm. Formally declare now and communicate three things to this team: (1) AWS emergency provisioning is authorised under emergency expenditure authority — no purchase order required; (2) legal is authorised to engage the receiver directly; (3) all data evacuation actions by the tech team operate under declared BC conditions and do not require individual approvals. The clock is the constraint — formal declaration removes approval friction for the next 4 hours.',
          tl: 'Under declared BC conditions, your authority to provision cloud infrastructure and commit to AWS costs is explicit. If the IC has formally declared, begin AWS provisioning immediately — do not wait for a purchase order. If the IC has not declared, you need explicit approval for each cost incurred in the next 4 hours. Get clarity from the IC before starting any external provisioning — an unclear authority position creates a governance problem on top of a technical one.',
          cl: 'Clients with active portal sessions need to be notified before 14:00. Under formally declared BC conditions, the Communications Lead has authority to issue that notification without approval on the message content. If the plan has not been formally declared, every communication requires sign-off — and that delay affects client experience and potentially SLA compliance. Confirm with the IC: are you operating under formal BC communications authority right now?',
          lc: 'Contact the receiver immediately on two grounds: (1) your data rights are intact under the contractual agreement regardless of CloudHost Pro\'s insolvency — the receiver cannot lawfully impair your access to your own data; (2) formal BC declaration may be a precondition for your business interruption insurance claim. Review the BI policy trigger language now: does it require a named internal trigger event, or does supplier failure qualify automatically? Advise the IC on the insurance notification timeline.',
          es: 'Formally declare this a BC event and co-sign with the IC. State the emergency expenditure limit — a specific dollar amount that can be committed in the next 4 hours without a separate board approval. AWS provisioning, emergency legal engagement, and staff overtime are all within scope. Remove every approval gate for the next 4 hours so the team moves at the speed the situation demands.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Recovery sequence — RTO/RPO governs evacuation priority',
        body: 'With 3h 47m until CloudHost Pro terminates all services, the team must establish the RTO and RPO for each hosted system. You cannot extract everything in time — these objectives determine what you save and what you accept losing. Systems hosted exclusively with CloudHost Pro: ERP production database (180GB — finance, operations, client data), Client Portal (120GB — live client sessions, documents, support tickets), CI/CD development environment (60GB — build pipelines, deployment configs, artefacts outside source control), Email archive (40GB — 3 years of client correspondence, contracts, and proposals). Recovery Time Objective: the maximum time the business can operate without this system before unacceptable damage occurs. Recovery Point Objective: the maximum acceptable data loss measured in time. The last full backup from CloudHost Pro is 6 days old — that is your worst-case RPO baseline before evacuation even begins.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Business Impact Analysis', technique: 'NIST SP 800-34 Rev.1 Section 3' },
        rolePrompts: {
          ic: 'State the RTO for each system: when does the business stop functioning if it is unavailable? ERP gone for 4 hours — acceptable? 24 hours? Client portal gone for 8 hours — what is the inbound call volume at hour two? Rank the four systems in evacuation priority order based on these RTOs. Your priority list must be agreed by this team in the next 10 minutes.',
          tl: 'Match each system to its RPO. The 6-day-old backup is your current RPO — already a failure against most BC Plan standards. Which systems have independent backups more recent than 6 days? Evacuation priority should weight RTO urgency first, then RPO risk. State your extraction sequence and the bandwidth you need to complete it in 3.5 hours.',
          cl: 'Clients with active portal sessions have an immediate RTO — right now, from their perspective. They are logged in and working. What communication goes out to clients before the 14:00 cut-off? Do not wait until services terminate to inform them.',
          lc: 'The email archive may be subject to regulatory record-keeping obligations. Depending on your industry, loss of 3 years of business correspondence could constitute a compliance breach independent of the supplier\'s failure. What is the RPO requirement for business communications under your applicable data retention laws, and is email archive in scope?',
          es: 'No RTO/RPO analysis was conducted when this supplier was selected — that is the root cause of this prioritisation crisis. Approve the evacuation sequence now. Going forward, any critical system hosted externally must have a documented RTO/RPO requirement and contractual proof the supplier can meet it, including exit and data portability provisions.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Financial exposure — what does each hour of this disruption cost?',
        body: 'CloudHost Pro terminated services 7 minutes ago. The business is now operating with partial recovery: ERP is online in AWS, the client portal is being restored (2 hours estimated), the development environment is lost, and the email archive is gone. The financial impact falls across three categories. Direct operational cost: AWS emergency provisioning, staff overtime through the night, and development sprint work that cannot be recovered. Deferred revenue: every hour the client portal is down is an hour clients cannot access deliverables or raise new requests — depending on the billing model, this directly delays collections. Indirect exposure: the email archive loss affects 3 years of contract correspondence, which may complicate any billing dispute, legal claim, or regulatory inquiry that arises in that period.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Business Impact Analysis', technique: 'NIST SP 800-34 Rev.1 Section 2.3' },
        rolePrompts: {
          ic: 'What is the hourly revenue impact of the client portal being down? If clients cannot submit requests, approve work, or access deliverables, what does an hour of portal downtime cost in delayed billing and collections? State the number and use it to justify the AWS emergency spend you are authorising right now.',
          tl: 'The dev environment is lost — rebuild from source control. What sprint work is unrecoverable? Put it in hours, then multiply by average developer cost per hour. That is the direct cost of the dev environment loss. Is any partial recovery from CloudHost Pro still possible before they fully wind down infrastructure?',
          cl: 'Clients will ask two separate questions: is my data safe, and why did this happen? Prepare honest answers to both. Which clients had active engagements in the lost email archive period? They may raise contract disputes or billing challenges where you no longer have the correspondence to support your position.',
          lc: 'Quantify the email archive loss as a legal liability. Three years of contracts, proposals, and correspondence: how many active or recently closed contracts fall in that window? Any dispute that arises in the next three years will be harder to defend without your side of the record. Does your professional indemnity policy cover data loss from supplier failure?',
          es: 'Commission a total cost-of-event analysis: AWS emergency setup, staff overtime, developer sprint loss, SLA exposure on portal downtime, and an email archive legal risk provision. This number goes to the board and CFO. It also becomes the business case for the backup architecture and multi-vendor strategy you will now mandate.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Communication tree — active portal clients, the receiver, and notifications before 14:00',
        body: 'CloudHost Pro terminates services in under 4 hours. Clients with active portal sessions do not know they are about to lose access. The receiver has not been formally engaged in writing about your data rights. Your BI insurer has not been notified of a claim-triggering event. The board has not been briefed on the financial exposure. This inject audits the communication tree at the 2-hour mark of the evacuation. Two hard deadlines govern the window: all client notifications must go out before 14:00 through channels that do not depend on CloudHost Pro infrastructure, and the BI insurer notification clock may already be running from the moment the receivership notice was received. The critical gap: the primary client notification tool — the portal itself — goes dark at 14:00.',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Stakeholder Communications', technique: 'NIST SP 800-34 Rev.1 Section 4.4' },
        rolePrompts: {
          ic: 'At 14:00, clients with active portal sessions lose access with no warning unless you communicate now. How many clients have active sessions? What channel reaches them without depending on CloudHost Pro infrastructure? Your cloud-hosted Microsoft 365 email is available and should be used immediately. Get the client notification drafted and sent before 13:30. Beyond clients: the receiver, the BI insurer, and the board all need contact today. Who owns each call and when is it being made?',
          tl: 'Before 14:00, export the client contact list from whatever system holds it — CRM, billing system, or the portal database you are currently evacuating. That list is your primary communication channel after cut-over. If the contact list exists only within the portal, what is the fallback for reaching clients after 14:00? This is the most common supplier-failure communication gap: the notification tooling is on the same platform as the failed service.',
          cl: 'Two communications go out before 14:00: (1) a client notification — factual and controlled: the portal will be temporarily unavailable, estimated restoration by [time], your data is safe; (2) an internal update to staff about emergency operating procedures for the next 24–48 hours. Do not name CloudHost Pro or reference receivership in the client message — it creates more anxiety than it resolves. Draft both now. What is the send channel for each, and who approves?',
          lc: 'Contact the receiver in writing before 14:00 with a formal notice of your data rights — the receiver has an obligation to preserve your access to your own data and cannot lawfully impair data extraction as part of wind-down operations. Also notify the BI insurer today. The claim trigger may be the receivership notice received this morning — check the policy for the notification window and confirm whether it has already started. Document every communication with the receiver with timestamps.',
          es: 'Brief the board now. Three sentences: a critical supplier has entered receivership, services terminate at 14:00, recovery is underway to AWS with an estimated restoration timeline of [X] hours. Then authorise the Communications Lead to issue the client notification without your sign-off on the content — you have 2 hours and approval loops will cost you the window. What is the total financial exposure number you are providing to the board right now?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'AWS environment readiness — what is available at cut-over and what will be missing?',
        body: 'Data evacuation is underway and AWS provisioning has been authorised. Before cut-over at 14:00, the team must assess what the AWS environment will actually provide at the moment of transition — and what it will not. Today, AWS hosts only dev/test workloads for this organisation. Production configuration under time pressure is not the same as a pre-planned DR migration. At cut-over, clients will attempt to access the portal, finance staff will try to run the ERP, and developers will look for their build pipelines. Not all of these will be operational on day one. Managing expectations requires an honest assessment of what works at cut-over, what is degraded, and what is absent.',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Alternate Site / Failover', technique: 'NIST SP 800-34 Rev.1 Section 5 + ISO 22301:2019 Section 8.3' },
        rolePrompts: {
          ic: 'Before 14:00, the IC needs a three-tier capability statement from the TL: what works at cut-over, what works by end of today, and what works by end of this week. That statement drives every commitment made to clients and staff about when their services will be restored. If the TL cannot provide it, the IC cannot give stakeholders a credible timeline — and silence at 14:01 is worse than an honest staged-recovery plan communicated in advance.',
          tl: 'AWS readiness assessment: (1) ERP — is it being provisioned from the extracted database and what is the estimated time to production-ready? Does the ERP vendor need to be engaged for licence transfer or reconfiguration?; (2) client portal — 94% extracted, but does the 6% session data gap affect portal functionality at launch?; (3) development environment — rebuilding from source control: what is the timeline and what sprint work is unrecoverable?; (4) email — Microsoft 365 is cloud-native and unaffected by this event, confirm it is fully excluded from the CloudHost Pro impact. State a go-live estimate for each workload.',
          cl: 'Clients accessing the portal at 14:01 will get an error even if they received the notification — access attempts from habit are inevitable. What is the error page or maintenance message on the portal domain, and who updates it before 14:00? After cut-over, what is the client-facing expectation for when they can log in? Set that expectation before the cut-over, not after.',
          lc: 'The AWS environment being provisioned may be in a different region than where CloudHost Pro was hosting data. Confirm the AWS region and check it against any data residency commitments in client contracts or applicable regulatory requirements. If client data was held in a specific jurisdiction under CloudHost Pro and is now being provisioned in a different AWS region, that may require client notification under contract terms before data is written to the new environment.',
          es: 'AWS on-demand running costs will be materially higher than CloudHost Pro contracted pricing. Authorise the first 30 days at on-demand rates and direct the TL to schedule a reserved instance review once the environment is stable. The emergency AWS cost is also a recoverable item in the business interruption claim — confirm with LC that all AWS costs from today are documented against the claim from the first dollar spent.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Data extraction partially complete — transfer slower than expected',
        body: 'Two hours in: ERP database (180GB) extracted and confirmed intact on local NAS. Client portal database (120GB) extraction is at 67% — estimated 45 more minutes. Development environment extraction has not started. Email archive has not started. CloudHost Pro\'s API is responding but degraded — receiver has apparently initiated a network throttle as part of wind-down operations. Transfer rate has dropped from 180Mbps to 40Mbps. At current rate, the client portal extraction will complete by 13:40 — leaving 20 minutes for the remaining 100GB. That is not achievable.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Continuity Operations', technique: 'ISO 22301:2019 Section 8.4' },
        rolePrompts: {
          ic: 'You cannot get everything out. Make the call: complete the client portal extraction and accept losing the dev environment and email archive, or attempt a partial of everything. What is the business impact of each loss?',
          tl: 'Contact CloudHost Pro\'s technical team directly and request the throttle be lifted for data extraction — this is a legitimate data portability request. Simultaneously, can you spin up an EC2 instance in the same region as CloudHost Pro and do a server-to-server transfer? That would bypass the bandwidth constraint.',
          cl: 'The development environment may be a secondary concern but the email archive contains 3 years of client correspondence. What is the business impact of losing that? Who needs to be told?',
          lc: 'The receiver is throttling your data transfer, effectively impairing your ability to recover your own data. This may be actionable. Document everything: times, speeds, correspondence. Prepare for a legal claim against the estate.',
          es: 'Escalate to the receiver directly — CEO level if needed. Your data rights are being impaired by the throttle. Meanwhile, approve the AWS server-to-server transfer approach if technically viable.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Services terminated — data partially recovered',
        body: 'CloudHost Pro terminated all services at 14:07 — 7 minutes late. Final recovery status: ERP production database — complete. Client portal — 94% complete (6GB missing, believed to be session data from the last 30 minutes of operation — content unknown). Development environment — not recovered (rebuild required from source control). Email archive — not recovered (last 3 years of email correspondence lost). The email archive was not covered by any other backup. AWS hosting environment is provisioned. ERP is online in AWS. Client portal is being restored — estimated 2 hours.',
        phaseIdx: 3,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Recovery Initiation', technique: 'NIST SP 800-34 Rev.1 Section 5' },
        rolePrompts: {
          ic: 'ERP is up. Client portal is 2 hours away. The 6GB client portal gap and the email archive loss are your two residual risks. What do you do about each?',
          tl: 'The 6GB portal gap — what could it contain? User uploads, payment records, support tickets? You need to know before you can assess risk. For the dev environment, how long to rebuild from source control and what is the impact on development delivery?',
          cl: 'Clients have had no portal access for 2+ hours. Prepare an incident summary for clients — honest, professional, with timeline and next steps. What do you say about the service disruption?',
          lc: 'The email archive loss is significant. Three years of client correspondence, contracts, and negotiations are gone. What are the legal and regulatory retention obligations you may now be in breach of? Assess the exposure.',
          es: 'Commission an immediate assessment of all supplier single-points-of-failure. What other critical suppliers could do this to you? What is your multi-vendor strategy from today?',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Recovery complete — supply chain resilience review',
        body: 'ERP and client portal fully operational in AWS. Development environment rebuilt from source control — 18 hours of sprint work was not committed and is lost. The email archive loss has been assessed: no regulated data (HIPAA, PCI) was in that archive, but 3 years of client contracts and correspondence is gone. The receiver\'s office has confirmed a $12,000 credit from prepaid hosting fees will be returned in the receivership process (timeline: 12–18 months). Legal counsel is reviewing a data portability claim against the estate for the email archive. Total recovery cost (AWS setup, staff overtime, dev sprint loss): est. $31,000.',
        phaseIdx: 5,
        correctCriticality: 'Low',
        mitre: { tactic: 'N/A — BCDR: Post-Incident Review', technique: 'BCI GPG 2023 Section 9' },
        rolePrompts: {
          ic: 'Three gaps exposed: no offsite backup independent of the supplier, no alternative hosting pre-provisioned, email archive not in backup scope. What are your three commitments before the next quarter?',
          tl: 'Design the new backup architecture: daily snapshots to an independent S3 bucket not under the same provider, email archive to a separate Microsoft 365 backup tool, 30-day RTO for full DR to AWS. What is the implementation timeline and cost?',
          cl: 'Prepare a client communication about the email archive loss — specifically whether any client-provided data was affected. Clients may ask for confirmation that their data is safe.',
          lc: 'Pursue the data portability claim against the receiver and track the $12K credit. For the email archive: identify which contracts are missing and request counterparties to provide their copies. This is a recoverable position — but time-sensitive.',
          es: 'Supplier due diligence must now include financial health and exit provisions. Commission a review of all critical supplier contracts for data portability, exit assistance, and financial stability clauses.',
        },
      },
    ],
  },

  bcdr_site_loss: {
    id: 'bcdr_site_loss',
    track: 'bcdr',
    title: 'Physical Site Loss',
    industry: 'All',
    duration: '~90 min',
    difficulty: 'Hard',
    summary: 'Fire at the primary office building. All staff evacuated safely. Fire marshal declares the building inaccessible for an indeterminate period — minimum two weeks, possibly total loss. No alternate site is pre-arranged.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'Office Manager — on-site',
      raw: 'There has been a fire in the building. All staff are out and accounted for — everyone is safe. Fire brigade is on scene. The fire marshal has told us we cannot re-enter the building — they are calling it a significant structural event. We do not have an alternate site. Servers are in the server room on Level 2. Nobody knows when or if we can go back in. What do we do?',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'Technician anomaly',
        title: 'Building confirmed inaccessible — immediate needs assessment',
        body: 'Fire marshal has issued a formal prohibition notice. Minimum inaccessibility period: 14 days pending structural engineering inspection. Potentially total loss — assessment tomorrow. Staff count: 34 employees. Laptops: 21 staff took laptops home last night (company policy allows it), 13 staff have no device. Servers in the Level 2 server room are believed intact — the fire originated on Level 3 — but inaccessible. VPN infrastructure runs from those on-premises servers. Cloud systems (M365, Salesforce, Xero accounting) are all accessible. The company has no formal alternate site arrangement.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Activation & Assessment', technique: 'NIST SP 800-34 Rev.1 Section 4' },
        rolePrompts: {
          ic: 'Immediate priorities: 13 staff with no device, VPN infrastructure on inaccessible on-premises servers, and no alternate site. Define your 24-hour survival plan. What can you operate with M365 and cloud systems alone?',
          tl: 'VPN is down because it runs on the on-premises server. Cloud systems are accessible without VPN. Map what each of the 34 staff needs to do their job — who can work on cloud-only and who is blocked without on-premises access?',
          cl: 'Staff are standing on the pavement outside a burning building. What do you communicate to them right now? Many will be worried about their jobs, their data, and what happens next.',
          lc: 'Building insurance, contents insurance, and business interruption insurance are all likely triggered. Who holds these policies and who is making the notifications right now? Clock starts at the fire marshal\'s prohibition notice.',
          es: 'Declare a business continuity event. Identify the four most time-sensitive business commitments in the next 7 days. Which are at risk if you are operating at reduced capacity for 2 weeks?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Formal site loss declaration — authority chain and what activation unlocks',
        body: 'A fire marshal prohibition notice has been issued. The building is inaccessible for a minimum of 14 days. All 34 staff are locked out. This is the clearest possible BC Plan trigger event — a civil authority declaration has removed access to your primary place of operations. The question for this inject is not whether to activate, but whether activation has been formally declared, by whom, and whether the team understands what formal declaration now unlocks. Formal BC Plan activation under a civil authority prohibition notice: removes the spending approval constraint up to a pre-agreed emergency limit, authorises the BC Plan Owner to sign service agreements with alternate site providers and co-location facilities without a purchase order, triggers the business interruption insurance notification obligation, and establishes the governance record for all emergency decisions made during the declared period. Without formal activation on record, emergency expenditure is at governance risk and insurance eligibility may be compromised.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Formal Plan Activation', technique: 'NIST SP 800-34 Rev.1 Section 4.2' },
        rolePrompts: {
          ic: 'Formally declare BC Plan activation. State the trigger on the record: fire marshal prohibition notice issued, building inaccessible, all on-premises systems offline, 34 staff displaced, no alternate site arrangement. Record the declaration with a timestamp — this is the reference point for insurance, governance, and any legal proceedings. Then state your emergency expenditure limit and confirm that device procurement, co-location provisioning, and alternate site arrangements are all authorised within that limit effective immediately.',
          tl: 'Under formally declared BC conditions, you have explicit authority to invoke BC vendor contracts without a purchase order. If no BC vendors are pre-contracted for alternate site or co-location, that planning gap is now live. With IC declaration in place, you are authorised to provision co-location and emergency devices on a quote-and-go basis within the declared emergency limit. What is your first call, and what are you authorised to commit to on that call?',
          cl: 'Formal BC declaration establishes your external communications authority. You can now issue staff notifications, client communications, and a building incident statement without seeking individual approvals per message. Draft the staff communication first — 34 people are standing outside a building that is inaccessible for 14 days. They need to know the company is in control, what the continuity plan is, and what their working arrangements are for the next two weeks.',
          lc: 'Business interruption insurance notification is time-critical. Most BI policies require notification within 24–72 hours of the triggering event — the fire marshal\'s prohibition notice is the triggering event, and the clock starts now. Call the insurer today, confirm the policy activation process, and obtain a claim reference number. The formal BC Plan activation and documented timeline of decisions made under declaration will be required by the loss assessor — start that log immediately.',
          es: 'Formally co-sign the BC Plan activation. State the emergency expenditure limit — a specific dollar amount the IC and BC Team can commit without further approval. In the next hour, someone needs to call a co-location facility and commit to rack space. That call requires spending authority. Remove the friction: state the number, confirm it covers device procurement, co-location, temporary office, and emergency staffing, and put it on the record now.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Alternate operations RTO — what must be running, and when?',
        body: 'With 34 staff locked out of the building for a minimum of 14 days and all on-premises systems inaccessible, the team must establish the Recovery Time Objective (RTO) for each critical business function. The BC Plan should specify the maximum time each function can be offline before the impact is unacceptable. Current capability split: cloud systems are accessible now (M365, Salesforce, Xero accounting); 21 staff have laptops at home and can work immediately; 13 staff have no device and cannot work until hardware is sourced; on-premises servers on Level 2 are inaccessible (VPN infrastructure, legacy ERP billing module, on-site file shares). No alternate site arrangement exists. Every RTO estimate must account for the time to source workspace, equipment, and connectivity — the standard assumptions in your BC Plan may not hold without a pre-arranged alternate site.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Business Impact Analysis', technique: 'NIST SP 800-34 Rev.1 Section 3' },
        rolePrompts: {
          ic: 'Define the operational RTO by business function: client delivery, finance and invoicing, sales, and internal operations. For each function currently blocked by on-premises dependencies or device shortages, state the maximum days before the business impact is unacceptable. Which function has the shortest RTO and is it currently at risk?',
          tl: 'Map each on-premises dependency to a workaround and its implementation time: VPN infrastructure (cloud VPN or zero-trust provisioned same day?), legacy ERP billing module (manual cloud alternative or workaround process?), on-site file shares (are critical files also in SharePoint, or local only?). The workaround implementation time is your effective RTO for each blocked function.',
          cl: 'The 13 staff without devices include people who may own critical client deliverables due in the next 48 hours. Identify those individuals now and prioritise getting hardware to them first — their personal RTO for becoming operational is immediate.',
          lc: 'A 14-day building prohibition triggers business interruption insurance notification obligations. Most policies require notice within 24–72 hours of the triggering event — the RTO for your insurance notification is today. Identify every client contract with an uptime or delivery SLA falling due in the next 5 business days and assess breach exposure.',
          es: 'The company has no alternate site arrangement — that gap is now the primary constraint on recovery. Approve same-day device procurement for all 13 unequipped staff with no purchase-order process. Approve investigation of a serviced office or co-location facility for the on-premises dependencies. What is the financial exposure of the highest-priority blocked function running at zero capacity right now?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Operational impact map — which processes are failing, and what is the daily cost?',
        body: 'The building has been inaccessible since this morning. The business is operating at reduced capacity: 21 staff are working from home on cloud systems, 13 staff have no device and are completely idle, and on-premises ERP dependencies are blocking the monthly invoicing run due in 6 days. The impact is immediate and quantifiable. Thirteen idle staff represents direct payroll cost with zero productive output. The blocked invoicing run defers cash inflow on the full AR batch — every day of delay extends collection timelines and increases the risk of late-payment provisions triggering with key clients. Client delivery is at risk for any unequipped staff member who owns an active deliverable. With no alternate site arrangement, every on-premises dependency is a hard blocker until co-location or an alternate site is provisioned.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Business Impact Analysis', technique: 'NIST SP 800-34 Rev.1 Section 2.3' },
        rolePrompts: {
          ic: 'Quantify the current impact: 13 idle staff at average daily cost, invoicing run deferred with total AR value at risk, and any client deliverables now at risk of missing a deadline. State the total daily cost of operating at this reduced capacity. That figure is the budget for emergency device procurement and co-location — compare them directly.',
          tl: 'The on-premises ERP billing module is the highest-value blocker. What is the total value of the invoicing batch due in 6 days? If co-location provisioning takes 3 days, the run is delayed by at least 3 days. What is the cost of that AR aging extension, and is there any manual cloud workaround that could run even a partial billing cycle?',
          cl: 'Which of the 13 unequipped staff are in client-facing roles — account management, project delivery, customer support? For each: what is the client impact of them being unreachable today, and does any client have a deliverable or meeting scheduled that is now at risk of being missed without notice?',
          lc: 'Business interruption insurance is triggered. The insurer will require a quantified loss statement — daily revenue impact, cost of alternate arrangements, and incremental staff costs from the moment of the prohibition notice. Start documenting those figures now with timestamps. The more precisely the impact is recorded per day, the stronger the insurance claim.',
          es: 'What is the daily cost of operating at this reduced capacity versus the cost of full recovery — device procurement for 13 staff, co-location setup, and a serviced office for those who cannot work effectively from home? The recovery cost is almost certainly lower than the daily operational loss. Approve everything that closes the gap faster than the insurance excess.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Communication tree — 34 displaced staff, clients, insurer, and the emergency contact list',
        body: 'The building was condemned this morning. Thirty-four staff are displaced. Twenty-one have devices and are nominally working remotely; 13 have no device. No formal all-staff communication has gone out beyond what people heard standing on the pavement this morning. Clients with active engagements do not know whether their account manager is reachable today. The BI insurer has not been notified — the policy notification window may already be running. The landlord has been informed by the fire marshal but has not received formal written notice from the tenant. The bank does not know payroll may be disrupted. This inject audits the full communication tree for a site loss event. The critical question: where is the staff emergency contact list? If it is on an on-premises server, it is inaccessible right now.',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Stakeholder Communications', technique: 'NIST SP 800-34 Rev.1 Section 4.4' },
        rolePrompts: {
          ic: 'Four stakeholder groups require contact today, in this order: (1) all 34 staff — confirmed working status and next check-in point; (2) clients with active engagements — personal call for priority accounts, general notice for others; (3) BI insurer — notification within the policy window; (4) board or ownership — briefed and aligned on the continuity plan. Walk through each: confirmed notified, not yet notified, or not applicable. Who owns each call and when is it being made?',
          tl: 'Where is the staff emergency contact list? If it is on an on-premises server, it is inaccessible. Is there a copy in Microsoft 365, SharePoint, or a personal device held by HR? This is the most common gap exposed by a site loss event. If you cannot reach your own staff in an emergency because the contact list is offline, that is the most urgent planning failure this exercise has revealed. What is your actual method of reaching the 13 staff with no device right now?',
          cl: 'Draft the all-staff communication — the definitive message replacing what people heard informally outside the building. It must confirm: (1) the building is inaccessible for a minimum of 14 days; (2) working arrangements for each group — remote-capable, device incoming, or temporarily stood down; (3) a single point of contact for questions; (4) the time of the next update. Then draft the client message: brief, confident, no detail about the cause. Which clients need a personal call from a named account manager today versus a general notice?',
          lc: 'BI insurance: what is the notification window and has it started? Most policies require notification within 24–72 hours of the triggering event — the fire marshal\'s prohibition notice. If the window is 24 hours, it may already be closing. Get the policy document — if it is in a filing cabinet inside the condemned building, that is a second urgent problem. Also send the landlord a formal written notice of the event today for the lease and insurance record.',
          es: 'Have you briefed the board? Have you contacted the bank to flag potential payroll disruption if this event extends beyond two weeks? A proactive two-sentence call to your banker today prevents a payroll crisis from compounding a site crisis. Of the four calls — board, bank, insurer, landlord — which has not yet been made, and who is making it in the next hour?',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Alternate site decision — where do 34 staff work and what does each option provide?',
        body: 'The building is condemned. 34 staff need a place to work tomorrow morning. The BC Plan\'s alternate site section lists three options: a serviced office in the business park (8 desks, available), a co-working space downtown (25 desks, available with 48-hour setup), and a split model using manager home offices plus a hoteling arrangement at a client location. None of these options fully accommodates 34 staff simultaneously. The alternate site decision is not which option is best in the abstract — it is which combination of options enables the most critical functions to operate by 08:00 tomorrow, and how the remaining functions are managed until full capacity is restored.',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Alternate Site / Failover', technique: 'NIST SP 800-34 Rev.1 Section 5 + ISO 22301:2019 Section 8.3' },
        rolePrompts: {
          ic: 'Declare the alternate site arrangement now and communicate it to all staff before 18:00 today. The announcement must answer four questions every employee needs: where do I go tomorrow, at what time, what should I bring, and who do I contact if I have a problem. Employees who do not receive a clear answer will make their own decisions — some will not show up. Triage staffing by function: which roles must be on-site, which can work remotely, and which are non-critical for the first 48 hours?',
          tl: 'Connectivity assessment: (1) the serviced office — confirm internet capacity and whether the existing VPN concentrator can be pointed at that location or whether a temporary cloud VPN must be stood up; (2) co-working space — same questions, plus confirm whether the 48-hour setup window is a hard constraint or negotiable with an emergency fee; (3) home offices — how many staff have company-issued laptops versus desktop-only setups, and what is the VPN client deployment status on home machines? The connectivity gap at each option determines which functions can operate there on day one.',
          cl: 'Client communication for tomorrow: any client with a scheduled on-site meeting, delivery, or visit must be contacted today to reschedule or redirect. Which clients have confirmed appointments for tomorrow and the next week? Each needs a personal call — not an email — from their primary contact before close of business. Clients who learn about the building loss from a news alert or a missed appointment will lose confidence in a way that a proactive call prevents.',
          lc: 'The insurer\'s property claim requires a structural report from the city condemning authority, the fire/safety inspection report, and an inventory of assets inside the building that are now inaccessible. Begin the claim today — the 72-hour notification window under most property policies starts from the event, not from when the claim is filed. Confirm that the lease agreement has a force majeure or business interruption clause that suspends rent obligations from the date of condemnation. If not, the landlord may still expect rent for the remainder of the term.',
          es: 'Authorise the alternate site arrangements now — serviced office deposit, co-working emergency onboarding fee, and an equipment procurement budget for the device gap the TL will identify. Then brief the board: the building is condemned, staff are being redirected, the business is operational, and the board should expect a recovery plan with timeline and cost estimate within 24 hours. One board member who learns about this from LinkedIn before you call them is a governance failure — brief them all before you brief anyone else.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Device shortage and VPN gap — remote work feasibility',
        body: 'Day 1 assessment: 13 staff without devices, including 4 in customer-facing roles. Purchasing has identified 8 laptops available for same-day or next-day delivery from local suppliers. 5 staff will need to wait 3–4 days. The on-premises VPN server (Cisco ASA) hosted apps that 9 staff used daily — including the legacy ERP billing module that is not cloud-accessible. The cloud-accessible ERP module covers 80% of operations. The remaining 20% (invoicing run, inventory management) requires on-premises access. Monthly invoicing run is due in 6 days.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'N/A — BCDR: Continuity Operations', technique: 'ISO 22301:2019 Section 8.4' },
        rolePrompts: {
          ic: 'VPN and on-premises ERP access is the critical blocker. Options: (a) emergency cloud migration of the billing module, (b) provision a temporary server at a co-location facility, (c) negotiate early access to the building to recover the server. Which is fastest and what does it cost?',
          tl: 'Assess the temporary server option: can you rent rack space at a co-location facility by tomorrow, provision a new VPN appliance, and restore the ERP billing module from backup? What is the realistic timeline — the invoicing run is in 6 days.',
          cl: 'What do you tell clients and suppliers about your operating status? You want to project confidence while being honest that you are operating from temporary arrangements.',
          lc: 'Business interruption insurance should cover the cost of alternate site arrangements. Confirm the coverage with the insurer today and get authorisation for the co-lo spend before committing.',
          es: 'Approve emergency device procurement immediately — no procurement process for this event. Approve the co-location facility investigation. What is the financial exposure of missing the 6-day invoicing run?',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Structural assessment — building is total loss',
        body: 'Structural engineer\'s assessment delivered: the building is condemned. All contents are accessible only with a supervised salvage escort — one 4-hour window in 3 days, strictly limited items. The server from Level 2 can be recovered in the salvage window. Personal items (ID, personal effects) can also be retrieved. Company must vacate the lease — 30-day notice was standard but the landlord has invoked the destruction clause and the tenancy is terminated. A co-location facility has been provisioned — the temporary server will be live tomorrow morning. The invoicing run is in 4 days.',
        phaseIdx: 3,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A — BCDR: Recovery Initiation', technique: 'NIST SP 800-34 Rev.1 Section 5' },
        rolePrompts: {
          ic: 'Building is a total loss. This is now a permanent relocation event, not a temporary disruption. What does a permanent remote-first model look like for your business, and what are the alternatives to a new office?',
          tl: 'Salvage window in 3 days: priority list for the 4-hour window. On-premises server first, then backup tapes or external drives, then any specialist equipment. Who attends the salvage window and what do they bring to extract the server safely?',
          cl: 'Staff need to know the building is condemned. This is a major announcement — some staff will be distressed, some will have personal items in the building. How do you communicate this compassionately and practically?',
          lc: 'The lease termination by the landlord on the destruction clause: review whether the destruction clause requires the landlord to provide alternate accommodation or compensation. This may be a claim.',
          es: 'Commission a real estate search for a new office immediately — or make the decision to go permanently remote. This is a strategic decision: what are the cost implications and staff preferences? Get input today.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Salvage complete — alternate arrangements crystallising',
        body: 'Salvage window completed successfully. On-premises server recovered and transported to the co-location facility — IT estimates 6 hours to restore connectivity. Personal items retrieved for all staff who requested them. Co-location VPN is live: all 34 staff now have device access and connectivity. The invoicing run was executed 1 day late using manual cloud workarounds — all clients notified in advance, no commercial complaints received. Business interruption insurance claim submitted: insurer has acknowledged receipt and assigned an assessor. A temporary serviced office (10 desks) has been secured for staff who cannot work effectively from home.',
        phaseIdx: 5,
        correctCriticality: 'Medium',
        mitre: { tactic: 'N/A — BCDR: Post-Incident Review', technique: 'ISO 22301:2019 Section 10' },
        rolePrompts: {
          ic: 'The immediate crisis is resolved. Document the full BC event timeline for the insurer and the board. What did the BC Plan cover well and where were the critical gaps?',
          tl: 'Three gaps exposed: no pre-arranged alternate site, VPN on on-premises hardware with no cloud failover, and device policy that left 13 staff without equipment. What is the architecture change proposal?',
          cl: 'Prepare a client communication: the company has navigated a serious incident professionally, services are fully restored, and here is what you have done to strengthen your resilience. Turn this into a trust-building moment.',
          lc: 'Work with the insurer\'s assessor on the business interruption claim. Scope: device replacement, co-location costs, temporary office, staff overtime, and any client SLA credits. Engage a public loss adjuster if the claim is large.',
          es: 'Commission a full BC Plan rewrite incorporating the lessons from this event. Set a board-level resilience policy: minimum RTO for alternate site, device policy (100% take-home), and VPN cloud-first architecture.',
        },
      },
    ],
  },

};

const TT_NOTIF_ITEMS = [
  { id: 'carrier',  label: 'Cyber insurance carrier — primary notification', detail: 'Most policies require notice within 24-48h. Triggers panel firm.', clockHr: 24 },
  { id: 'counsel',  label: 'Outside cyber counsel engaged',                  detail: 'Privilege wrapper for the rest of the response.',                clockHr: 4  },
  { id: 'irfirm',   label: 'Forensic IR firm activated',                     detail: 'Via carrier panel if available, else direct retainer.',          clockHr: 4  },
  { id: 'le',       label: 'Law enforcement — FBI Cyber Division / IC3',     detail: 'Reportable but does not pause private response.',                clockHr: 24 },
  { id: 'opc',      label: 'Federal Trade Commission (FTC)',                  detail: 'FTC / applicable federal law — notify as soon as feasible after determining risk of harm.',  clockHr: 72 },
  { id: 'oipc',     label: 'State Attorney General — privacy notification',   detail: 'For residents under applicable state privacy law.',               clockHr: 72 },
  { id: 'pci',      label: 'Card networks — PCI DSS incident reporting',     detail: 'If cardholder data in scope. Acquirer first.',                   clockHr: 24 },
  { id: 'affected', label: 'Affected individuals — notification plan',       detail: 'Direct notice required under applicable federal/state law where risk of harm is determined.',    clockHr: 72 },
];

// In-memory state mirror — Supabase rows are the source of truth on reload.
let ttState = null;
function ttInit() {
  ttState = {
    view: 'setup',                     // setup | commentary | declaration | inject | breach | notif | aar | history_aar | mitre_matrix | mitre_playback
    scenarioId: null,
    facilitatorName: '',
    mode: 'local',                     // 'local' | 'remote' | 'autonomous'
    lobbyTimerMinutes: 10,
    injectTimerMinutes: 10,
    timerMultiplier: 1,
    sessionId: null,
    sessionCode: null,
    currentInject: 0,
    declaration: { signal: '', severity: '', declare: null, assessment: '' },
    responses: {},                     // { [injectIdx]: { [roleId]: { text, criticality } } }
    breach: { declared: false, ic_sign_time: null, es_sign_time: null, rationale: '' },
    notifChecks: {},                   // { [itemId]: { checked, checkedAt } }
    notifStartTime: null,
    exerciseLog: [],
    completedSessions: null,           // null = not yet loaded; [] = loaded, empty
    historicalSession: null,           // set when view = 'history_aar'
    playbackStep: 0,                   // current step index in mitre_playback view
    actionItems: null,                 // null = not yet loaded; [] = empty; [...] = loaded
    actionItemForm: null,              // null = hidden; {} = new; {id,...} = edit
    irComparison: null,               // saved IR plan comparison result (jsonb from DB)
  };
  tteClearRubric();
  tteLoadDbScenarios();
  // _rubricEditing: true shows the scoring form even after scores are saved (edit mode)
  ttState._rubricEditing = false;
}

// Capture any in-DOM textarea/input values into ttState before re-rendering destroys them.
function ttSnapshot() {
  if (!ttState) return;
  const fac = document.getElementById('ttFacName');     if (fac) ttState.facilitatorName        = fac.value;
  const da  = document.getElementById('ttDeclAss');     if (da)  ttState.declaration.assessment = da.value;
  const br  = document.getElementById('ttBreachRat');   if (br)  ttState.breach.rationale       = br.value;
  if (ttState.currentInject != null) {
    const idx = ttState.currentInject;
    TT_ROLES.forEach(r => {
      const ta = document.getElementById(`ttResp_${idx}_${r.id}`);
      if (!ta) return;
      ttState.responses[idx] = ttState.responses[idx] || {};
      ttState.responses[idx][r.id] = ttState.responses[idx][r.id] || {};
      ttState.responses[idx][r.id].text = ta.value;
    });
  }
}

function ttRender() {
  document.getElementById('mainContent').innerHTML = renderTabletop();
  // After render, refresh dynamic multiplayer panels without full re-render
  setTimeout(() => {
    if (!ttState) return;
    if (ttState.view === 'commentary' || ttState.view === 'inject') ttFacRefreshLobby();
    if (ttState.view === 'inject') ttFacRefreshResponses(ttState.currentInject);
  }, 80);
}

async function ttLog(type, detail) {
  if (!ttState || !ttState.sessionId) return;
  const entry = { ts: new Date().toISOString(), type, detail };
  ttState.exerciseLog.push(entry);
  try { await sb.tt.appendLog(ttState.sessionId, ttState.exerciseLog); }
  catch (e) { console.warn('TT log save failed', e); }
}

function renderTabletop() {
  if (!ttState) ttInit();
  switch (ttState.view) {
    case 'setup':             return ttRenderSetup();
    case 'auto_lobby_monitor': return ttRenderAutoLobbyMonitor();
    case 'commentary':        return ttRenderCommentary();
    case 'declaration': return ttRenderDeclaration();
    case 'inject':      return ttRenderInject();
    case 'breach':      return ttRenderBreachGate();
    case 'notif':       return ttRenderNotif();
    case 'aar':           return ttRenderAAR();
    case 'history_aar':   return ttRenderHistoryAAR();
    case 'mitre_matrix':    return ttRenderMitreMatrix();
    case 'mitre_playback':  return ttRenderMitrePlayback();
    default:                return '<div class="card">Unknown tabletop view.</div>';
  }
}

// ---- Shared header (shown on every view after setup) ----
function ttHeaderBar() {
  const scenario = TT_SCENARIOS[ttState.scenarioId];
  return `<div class="card" style="padding:0.7rem 1rem;margin-bottom:0.5rem;display:flex;align-items:center;gap:10px">
    <span style="font-size:14px">&#x1F3AF;</span>
    <div style="flex:1">
      <div style="font-size:13px;font-weight:700">${scenario ? scenario.title : 'Tabletop'}</div>
      <div style="font-size:10px;color:var(--muted)">Facilitator: ${ttState.facilitatorName || '—'}</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:9px;color:var(--muted);letter-spacing:0.06em;text-transform:uppercase">Session code</div>
      <div style="font-size:14px;font-weight:700;color:var(--cyan);letter-spacing:0.1em">${ttState.sessionCode || '—'}</div>
    </div>
  </div>`;
}

function ttNistTrack(activeIdx, declStep) {
  return `<div class="nist-track">
    ${declStep ? `<div class="nist-step decl-step">Step 0 · TL Declare</div>` : ''}
    ${TT_NIST_PHASES.map((s, i) => `<div class="nist-step ${i === activeIdx ? 'active' : (i < activeIdx ? 'complete' : '')}">${s}</div>`).join('')}
  </div>`;
}

function ttGoto(view) { ttSnapshot(); ttState.view = view; ttRender(); }
function ttBack(view) { ttSnapshot(); ttState.view = view; ttRender(); }

// ---- SETUP ----
function ttRenderSetup() {
  const orgOk = !!currentOrg;
  return `${renderTierBanner()}
  <div style="font-size:17px;font-weight:700;margin-bottom:0.85rem">&#x1F3AF; Tabletop — Operational</div>
  <div class="commentary-card">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan2);margin-bottom:6px">vCISO facilitator console</div>
    <div style="font-size:14px;color:#fff;font-weight:700;margin-bottom:0.4rem">Operational track — IT / security team</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.5">Pick a scenario and your facilitator name. The session gets a 6-character code and live state in Supabase. Triage is not part of this exercise — Step 0 starts <i>after</i> the Technical Lead declares.</div>
  </div>
  <div class="card">
    <div class="card-title">New exercise</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
      <div><div class="field-lbl">Organization</div>
        <input type="text" value="${orgOk ? currentOrg.name : ''}" disabled style="opacity:0.6"/></div>
      <div><div class="field-lbl">Facilitator</div>
        <input type="text" id="ttFacName" placeholder="e.g. Mark Abbott" value="${ttState.facilitatorName || ''}"/></div>
    </div>
    <div class="field-lbl" style="margin-bottom:5px">Session mode</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
      <div class="mini-opt${ttState.mode === 'local' ? ' sel' : ''}" onclick="ttSetMode('local')" style="align-items:flex-start;padding:10px 12px;cursor:pointer">
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700;color:var(--text)">&#x1F4BB; Local (Facilitated)</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">Facilitator runs on one screen. Group participates verbally.</div>
        </div>
      </div>
      <div class="mini-opt${ttState.mode === 'remote' ? ' sel' : ''}" onclick="ttSetMode('remote')" style="align-items:flex-start;padding:10px 12px;cursor:pointer">
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700;color:var(--text)">&#x1F517; Remote (Session Code)</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">Participants join on their own devices via a 6-char code.</div>
        </div>
      </div>
    </div>
    <div class="mini-opt${ttState.mode === 'autonomous' ? ' sel' : ''}" onclick="ttSetMode('autonomous')" style="align-items:center;padding:10px 14px;cursor:pointer;margin-bottom:${ttState.mode === 'autonomous' ? '8px' : '12px'}">
      <div style="flex:1">
        <div style="font-size:13px;font-weight:700;color:var(--text)">&#x1F916; Autonomous (Jackbox-style)</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">No facilitator needed. Participants self-run. Set timers and share the code.</div>
      </div>
      <span class="badge b-cyan" style="font-size:9px;white-space:nowrap;margin-left:8px">New</span>
    </div>
    ${ttState.mode === 'autonomous' ? `
    <div style="background:rgba(7,180,217,0.06);border:1px solid rgba(7,180,217,0.18);border-radius:10px;padding:12px 14px;margin-bottom:12px">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--cyan);margin-bottom:10px">Autonomous settings</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div>
          <div class="field-lbl" style="margin-bottom:5px">Lobby wait</div>
          <div style="display:flex;gap:4px">
            ${[5,10,15].map(n=>`<button class="btn btn-sm ${ttState.lobbyTimerMinutes===n?'btn-cyan':'btn-outline'}" onclick="ttSetLobbyTimer(${n})">${n}m</button>`).join('')}
          </div>
        </div>
        <div>
          <div class="field-lbl" style="margin-bottom:5px">Inject timer</div>
          <div style="display:flex;gap:4px">
            ${[5,10,15].map(n=>`<button class="btn btn-sm ${ttState.injectTimerMinutes===n?'btn-cyan':'btn-outline'}" onclick="ttSetInjectTimer(${n})">${n}m</button>`).join('')}
          </div>
        </div>
        <div>
          <div class="field-lbl" style="margin-bottom:5px">Speed</div>
          <div style="display:flex;gap:4px">
            ${[1,2,5].map(n=>`<button class="btn btn-sm ${ttState.timerMultiplier===n?'btn-cyan':'btn-outline'}" onclick="ttSetTimerMult(${n})">${n}x</button>`).join('')}
          </div>
        </div>
      </div>
      <div style="font-size:10px;color:var(--muted);margin-top:8px">&#x23F1; Each inject: <strong>${Math.round(ttState.injectTimerMinutes * 60 / ttState.timerMultiplier / 60 * 10) / 10} min</strong> at ${ttState.timerMultiplier}x speed &mdash; lobby auto-launches after ${ttState.lobbyTimerMinutes} min or all roles filled.</div>
    </div>` : ''}
    <div class="field-lbl" style="margin-bottom:5px">Scenario</div>
    ${(() => {
      const dbScens = (tteState.dbScenarios || []).filter(s => (s.track || 'operational') === 'operational');
      const builtins = Object.values(TT_SCENARIOS);
      const allScens = [...dbScens, ...builtins];
      return allScens.map(s => `
        <div class="mini-opt${ttState.scenarioId === s.id ? ' sel' : ''}" onclick="ttPickScenario('${s.id}')" style="align-items:flex-start;padding:10px 12px">
          <div style="flex:1">
            <div style="font-size:13px;font-weight:700;color:var(--text)">${s.title}${s._source === 'db' ? ' <span class="badge b-purple" style="font-size:9px">Custom</span>' : ''}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px">${s.summary || s.description || ''}</div>
            <div style="display:flex;gap:6px;margin-top:5px;flex-wrap:wrap">
              ${s.industry ? `<span class="badge b-gray">${s.industry}</span>` : ''}
              ${s.duration || s.duration_mins ? `<span class="badge b-cyan">${s.duration || (s.duration_mins + ' min')}</span>` : ''}
              ${s.difficulty ? `<span class="badge ${s.difficulty === 'Hard' || s.difficulty === 'Advanced' ? 'b-red' : 'b-amber'}">${s.difficulty}</span>` : ''}
              <span class="badge b-purple">${(s.injects || []).length} injects + Step 0</span>
            </div>
          </div>
        </div>`).join('');
    })()}
    <div style="margin-top:14px;display:flex;gap:8px;justify-content:flex-end">
      <button class="btn btn-primary" onclick="ttLaunchSession()" ${!orgOk ? 'disabled' : ''}>Create session →</button>
    </div>
  </div>
  ${ttRenderHistoryList()}`;

}

function ttPickScenario(id) { ttSnapshot(); ttState.scenarioId = id; ttRender(); }
function ttSetMode(m) { ttSnapshot(); ttState.mode = m; ttRender(); }
function ttSetLobbyTimer(n) { ttSnapshot(); ttState.lobbyTimerMinutes = n; ttRender(); }
function ttSetInjectTimer(n) { ttSnapshot(); ttState.injectTimerMinutes = n; ttRender(); }
function ttSetTimerMult(n) { ttSnapshot(); ttState.timerMultiplier = n; ttRender(); }

function _ttFmtTime(secs) {
  const m = Math.floor(Math.max(0,secs) / 60);
  const s = Math.max(0,secs) % 60;
  return m + ':' + String(s).padStart(2, '0');
}

// ---- AUTO LOBBY MONITOR (vCISO view for autonomous sessions) ----
function ttRenderAutoLobbyMonitor() {
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  const code = ttState.sessionCode || '------';
  const joinUrl = window.location.origin + window.location.pathname + '?join=' + code;
  const lobbyMs = ttState.lobbyTimerMinutes * 60 * 1000;
  const lobbyEnd = (ttState._lobbyStartedAt || Date.now()) + lobbyMs;
  const effectiveMins = Math.round((ttState.injectTimerMinutes * 60 / ttState.timerMultiplier) / 60 * 10) / 10;

  // Start/restart the monitor interval
  if (window._ttAutoMonitorInterval) clearInterval(window._ttAutoMonitorInterval);
  setTimeout(async () => {
    let pollCount = 0;
    async function tick() {
      // Update countdown
      const secsLeft = Math.max(0, Math.round((lobbyEnd - Date.now()) / 1000));
      const cdEl = document.getElementById('ttAutoLobbyCountdown');
      if (cdEl) { cdEl.textContent = _ttFmtTime(secsLeft); if (secsLeft===0) cdEl.style.color='#f87171'; }
      // Refresh roster every 4 ticks (~4s)
      if (pollCount % 4 === 0) {
        try {
          const parts = await sb.tt.getParticipants(ttState.sessionId);
          const rosterEl = document.getElementById('ttAutoMonitorRoster');
          if (rosterEl) {
            rosterEl.innerHTML = TT_ROLES.map(role => {
              const p = parts.find(x => x.role_id === role.id);
              return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
                <span style="font-size:16px">${role.icon}</span>
                <div style="flex:1;font-size:12px;font-weight:${p?'700':'400'};color:${p?'var(--navy)':'var(--muted)'}">${p?p.player_name:'Open seat'}</div>
                <span style="font-size:10px;font-weight:700;color:${p?'#15803d':'var(--muted)'}">${p?'&#10003; '+role.name:role.name}</span>
              </div>`;
            }).join('');
            const count = parts.length;
            const countEl = document.getElementById('ttAutoMonitorCount');
            if (countEl) countEl.textContent = count + ' / ' + TT_ROLES.length + ' joined';
          }
          // Check if session launched (declaration_logged set by participant clients)
          const sess = await sb.tt.getSession(ttState.sessionId);
          if (sess && sess.declaration_logged) {
            clearInterval(window._ttAutoMonitorInterval);
            const statusEl = document.getElementById('ttAutoMonitorStatus');
            if (statusEl) statusEl.innerHTML = '<div style="color:#15803d;font-weight:700;font-size:13px">&#10003; Session launched — participants are running the exercise</div>';
          }
        } catch {}
      }
      pollCount++;
    }
    tick(); // immediate first tick
    window._ttAutoMonitorInterval = setInterval(tick, 1000);
  }, 50);

  return `${renderTierBanner()}
  <div class="card" style="border:2px solid var(--cyan);background:rgba(7,180,217,0.04)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <div style="font-size:28px">&#x1F916;</div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--cyan);margin-bottom:2px">Autonomous Exercise — Lobby Open</div>
        <div style="font-size:16px;font-weight:700;color:var(--navy)">${scenario ? scenario.title : 'Tabletop Exercise'}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:4px">Session code</div>
        <div style="font-size:26px;font-weight:700;letter-spacing:0.2em;color:var(--navy);font-family:monospace">${code}</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:4px">Auto-launch in</div>
        <div id="ttAutoLobbyCountdown" style="font-size:26px;font-weight:700;color:var(--cyan)">—</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:4px">Participants</div>
        <div id="ttAutoMonitorCount" style="font-size:18px;font-weight:700;color:var(--text)">— / ${TT_ROLES.length}</div>
      </div>
    </div>
    <div id="ttAutoMonitorStatus" style="min-height:18px;margin-bottom:12px"></div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:12px">&#x23F1; Each inject: <strong>${effectiveMins} min</strong> at ${ttState.timerMultiplier}x speed &mdash; launches when all ${TT_ROLES.length} roles fill or timer expires.</div>
    <div id="ttAutoMonitorRoster" style="margin-bottom:14px"><div style="font-size:11px;color:var(--muted)">Loading participants…</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="ttAutoLaunchNow()">Launch now</button>
      <button class="btn btn-outline btn-sm" onclick="navigator.clipboard.writeText('${joinUrl}').then(()=>toast('Join link copied','#15803d'))">Copy join link</button>
      <button class="btn btn-outline btn-sm" onclick="ttGoHome()">Back to setup</button>
    </div>
  </div>`;
}

async function ttAutoLaunchNow() {
  const btn = document.querySelector('[onclick="ttAutoLaunchNow()"]');
  if (btn) { btn.disabled=true; btn.textContent='Launching…'; }
  try {
    await sb.tt.updateSession(ttState.sessionId, {
      declaration_logged: true,
      inject_started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    const statusEl = document.getElementById('ttAutoMonitorStatus');
    if (statusEl) statusEl.innerHTML = '<div style="color:#15803d;font-weight:700;font-size:13px">&#10003; Session launched</div>';
    if (window._ttAutoMonitorInterval) { clearInterval(window._ttAutoMonitorInterval); window._ttAutoMonitorInterval = null; }
    toast('Exercise launched — participants are now running the exercise', '#15803d');
  } catch(e) {
    if (btn) { btn.disabled=false; btn.textContent='Launch now'; }
    toast('Launch failed: ' + e.message, '#dc2626');
  }
}

function ttGoHome() {
  if (window._ttAutoMonitorInterval) { clearInterval(window._ttAutoMonitorInterval); window._ttAutoMonitorInterval = null; }
  ttState.view = 'setup';
  ttRender();
}

async function ttLaunchSession() {
  ttSnapshot();
  if (!currentOrg) { toast('Select an organization first', '#dc2626'); return; }
  if (!ttState.scenarioId) { toast('Pick a scenario', '#dc2626'); return; }
  if (ttState.mode !== 'autonomous' && !ttState.facilitatorName.trim()) { toast('Enter facilitator name', '#dc2626'); return; }
  // Load scenario through engine (DB first, then built-in fallback)
  const scenario = await tteLoadScenario(ttState.scenarioId) || TT_SCENARIOS[ttState.scenarioId];
  if (!scenario) { toast('Scenario not found', '#dc2626'); return; }
  tteInitEngine(scenario, ttState.mode);
  try {
    const code = await sb.tt.newCode();
    if (!code) throw new Error('Session code RPC returned empty');
    const sessionBody = {
      org_id: currentOrg.id,
      scenario_id: scenario.id,
      scenario_title: scenario.title,
      session_code: code,
      status: 'active',
      facilitator_name: ttState.facilitatorName.trim() || 'Autonomous',
      current_inject: 0,
      exercise_log: [],
      mode: ttState.mode,
      inject_path: [],
    };
    if (ttState.mode === 'autonomous') {
      sessionBody.lobby_timer_minutes  = ttState.lobbyTimerMinutes;
      sessionBody.lobby_started_at     = new Date().toISOString();
      sessionBody.inject_timer_minutes = ttState.injectTimerMinutes;
      sessionBody.timer_multiplier     = ttState.timerMultiplier;
    }
    const created = await sb.tt.createSession(sessionBody);
    ttState.sessionId   = created.id;
    ttState.sessionCode = created.session_code;
    if (ttState.mode === 'autonomous') {
      ttState._lobbyStartedAt = new Date(created.lobby_started_at || sessionBody.lobby_started_at).getTime();
      ttState.view = 'auto_lobby_monitor';
      await ttLog('session_created', { code: created.session_code, scenario: scenario.title, mode: 'autonomous', lobbyTimer: ttState.lobbyTimerMinutes, injectTimer: ttState.injectTimerMinutes, speed: ttState.timerMultiplier });
      toast('Autonomous session ' + created.session_code + ' created', '#15803d');
      ttRender();
    } else {
      ttState.view = 'commentary';
      await ttLog('session_created', { code: created.session_code, scenario: scenario.title, facilitator: ttState.facilitatorName });
      toast('Session ' + created.session_code + ' created', '#15803d');
      ttStartFacPoll();
      ttRender();
    }
  } catch (e) {
    toast('Could not create session — ' + e.message, '#dc2626');
    console.error(e);
  }
}

// ---- COMMENTARY ----
function ttRenderCommentary() {
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  return `${renderTierBanner()}
  ${ttHeaderBar()}
  <div class="commentary-card">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan2);margin-bottom:6px">vCISO commentary — before we start</div>
    <div style="font-size:14px;color:#fff;font-weight:700;margin-bottom:0.5rem">${scenario.title}</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.75);line-height:1.6">
      ${scenario.summary}
      <br/><br/>
      <b>How this runs:</b><br/>
      1. <b>Step 0 — TL declaration.</b> A raw signal comes in. The Technical Lead assigns severity (P1–P4) and recommends declare or monitor. Triage is not part of tabletop. The exercise begins after declaration.<br/>
      2. <b>Role-filtered injects.</b> Each role sees the same situation framed for their job. IC coordinates, TL acts, Comms shapes messages, Legal watches clocks, ES makes business calls.<br/>
      3. <b>Breach gate.</b> Some injects trigger a formal breach determination. IC and ES <i>both</i> co-sign before the disclosure clock starts.<br/>
      4. <b>Notification checklist.</b> Once breach is declared, an 8-item checklist with a 72-hour clock tracks regulatory + contractual notifications.<br/>
      5. <b>After Action Report.</b> MITRE ATT&CK mapping and correct criticality are revealed <i>only</i> here — never during the exercise.
    </div>
  </div>
  ${ttRenderLobbyPanel()}
  <div style="display:flex;gap:8px;justify-content:space-between;align-items:center;margin-top:10px;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" id="ttDemoBtn" onclick="ttAddDemoPlayers()">&#x2795; Add demo players</button>
    <div style="display:flex;gap:8px">
      <button class="btn btn-outline" onclick="ttBack('setup')">← Back to setup</button>
      <button class="btn btn-primary" onclick="ttGoto('declaration')">Begin Step 0 →</button>
    </div>
  </div>`;
}

// ---- DECLARATION (Step 0) ----
function ttRenderDeclaration() {
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  const d = scenario.declaration;
  const tlSev = ttState.declaration.severity;
  const tlDec = ttState.declaration.declare;
  return `${renderTierBanner()}
  ${ttHeaderBar()}
  ${ttNistTrack(-1, true)}
  <div class="declaration-step">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan);margin-bottom:6px">Step 0 — Technical Lead declaration</div>
    <div style="font-size:14px;font-weight:700;margin-bottom:6px">Raw signal — ${d.ingest} from ${d.source}</div>
    <div class="signal-box" style="font-size:13px;line-height:1.5">"${d.raw}"</div>
    <div class="field-lbl" style="margin-top:10px">TL — initial technical assessment</div>
    <textarea id="ttDeclAss" placeholder="In plain language: what is going on? Working hypothesis?">${ttState.declaration.assessment || ''}</textarea>
    <div class="field-lbl" style="margin-top:10px">Severity</div>
    <div>
      ${['P1','P2','P3','P4'].map(s => `<button class="sev-btn ${tlSev === s ? 'sel-' + s : ''}" onclick="ttSetSev('${s}')">${s} — ${({P1:'Critical',P2:'High',P3:'Medium',P4:'Low'})[s]}</button>`).join('')}
    </div>
    <div class="field-lbl" style="margin-top:10px">Recommendation</div>
    <div style="display:flex;gap:6px">
      <button class="btn ${tlDec === true  ? 'btn-red'   : 'btn-outline'} btn-sm" onclick="ttSetDec(true)">Declare incident</button>
      <button class="btn ${tlDec === false ? 'btn-amber' : 'btn-outline'} btn-sm" onclick="ttSetDec(false)">Monitor only</button>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px">
      <button class="btn btn-outline" onclick="ttBack('commentary')">← Back</button>
      <button class="btn btn-primary" onclick="ttSubmitDeclaration()">Submit declaration →</button>
    </div>
  </div>`;
}

function ttSetSev(s) { ttSnapshot(); ttState.declaration.severity = s; ttRender(); }
function ttSetDec(b) { ttSnapshot(); ttState.declaration.declare  = b; ttRender(); }

async function ttSubmitDeclaration() {
  ttSnapshot();
  if (!ttState.declaration.severity) { toast('Pick a severity', '#dc2626'); return; }
  if (ttState.declaration.declare === null) { toast('Declare or monitor?', '#dc2626'); return; }
  if (!ttState.declaration.assessment.trim()) { toast('Add a brief technical assessment', '#dc2626'); return; }
  try {
    await sb.tt.updateSession(ttState.sessionId, {
      declaration_logged: true,
      tl_assessment: ttState.declaration.assessment,
      tl_severity: ttState.declaration.severity,
      tl_declare: ttState.declaration.declare,
      updated_at: new Date().toISOString(),
    });
    await ttLog('declaration', { severity: ttState.declaration.severity, declare: ttState.declaration.declare });
    if (ttState.declaration.declare === false) {
      toast('TL chose to monitor — exercise ending', '#b45309');
      ttState.view = 'aar';
    } else {
      ttState.view = 'inject';
      ttState.currentInject = 0;
    }
    ttRender();
  } catch (e) { toast('Could not save declaration — ' + e.message, '#dc2626'); }
}

// ---- INJECT (redesigned) ----

const TT_NIST_SHORT = ['Preparation','Detection','Containment','Eradication','Recovery','Post-incident'];
const TT_PHASE_CLASSES = ['prep','detection','containment','eradication','recovery','post'];

function ttNewAppBar(scenario, pathNum, totalInj) {
  return `<div class="tt-app-bar">
    <div>
      <div class="tt-app-bar-title">${scenario.title} <span style="opacity:0.5;font-weight:400">· ${ttState.facilitatorName || '—'}</span></div>
      <div class="tt-app-bar-sub">Session: ${ttState.sessionCode || '—'}</div>
    </div>
    <div style="display:flex;align-items:center;gap:10px">
      <span class="tt-inject-counter">Inject ${pathNum} of ${totalInj}</span>
      <span class="tt-live-pill">LIVE</span>
    </div>
  </div>`;
}

function ttNewNistBar(activeIdx) {
  let html = '<div class="tt-nist-bar">';
  TT_NIST_SHORT.forEach((label, i) => {
    const isDone = i < activeIdx;
    const isNow  = i === activeIdx;
    html += `<div class="tt-nist-step">
      <div class="tt-nist-dot ${isDone ? 'done' : isNow ? 'now' : ''}">${isDone ? '✓' : (i + 1)}</div>
      <span class="tt-nist-label ${isNow ? 'now' : ''}">${label}</span>
    </div>`;
    if (i < TT_NIST_SHORT.length - 1) html += `<div class="tt-nist-line ${isDone ? 'done' : ''}"></div>`;
  });
  html += '</div>';
  return html;
}

function ttRenderGameCard(inj, pathNum) {
  const phaseClass  = TT_PHASE_CLASSES[inj.phaseIdx] || 'detection';
  const phaseLabel  = TT_NIST_PHASES[inj.phaseIdx] || 'Detection & Analysis';
  const ingestRaw   = (inj.ingest || '').toLowerCase();
  const ingestClass = ingestRaw.includes('psa') ? 'psa' : ingestRaw.includes('soc') ? 'soc' : 'technician';
  const ingestLabel = ingestRaw.includes('psa') ? 'PSA' : ingestRaw.includes('soc') ? 'SOC' : 'TECH';
  const cardCode    = `INJ-${String(pathNum).padStart(2, '0')}`;
  const primaryRoles = inj.primaryRoles || ['ic','tl','cl','lc','es'];

  // Normalise MITRE — supports single object or array
  const mitreRaw  = inj.mitre;
  const mitreList = Array.isArray(mitreRaw)
    ? mitreRaw
    : (mitreRaw ? [{ tactic: mitreRaw.tactic, tech: mitreRaw.technique }] : []);

  const mitreHtml = mitreList.length ? `
    <div class="tt-card-section-label">MITRE ATT&amp;CK</div>
    <div class="tt-mitre-list">
      ${mitreList.map(m => {
        const tacticId = (m.tactic || '').split(' ')[0];
        const techText = m.tech || m.technique || '';
        return `<div class="tt-mitre-row">
          <span class="tt-mitre-tactic">${tacticId}</span>
          <span class="tt-mitre-tech">${techText}</span>
        </div>`;
      }).join('')}
    </div>` : '';

  const pipHtml = TT_ROLES.map(r =>
    `<div class="tt-pip ${r.id} ${primaryRoles.includes(r.id) ? 'primary' : ''}" title="${r.name}">${r.icon}</div>`
  ).join('');

  return `<div class="tt-game-card">
    <div class="tt-card-head ${phaseClass}">
      <div class="tt-card-phase">${phaseLabel}</div>
      <div class="tt-card-title">${inj.title}</div>
      <div class="tt-card-badge">
        <span class="tt-ingest-label ${ingestClass}">${ingestLabel}</span>
        Inject ${pathNum}
      </div>
    </div>
    <div class="tt-card-body">
      <div class="tt-card-desc">${inj.body}</div>
      ${mitreHtml}
      <div class="tt-card-section-label">Roles</div>
      <div class="tt-role-pips">${pipHtml}</div>
    </div>
    <div class="tt-card-footer">
      <span class="tt-card-code">${cardCode}</span>
      ${inj.triggersBreach ? '<span style="color:#ef4444;font-size:12px">&#x26A0;</span>' : ''}
    </div>
  </div>`;
}

function ttRenderRoleRows(idx, responses, inj) {
  const primaryRoles = inj.primaryRoles || ['ic','tl','cl','lc','es'];
  return `<div class="tt-response-area">
    <div class="tt-response-label">Responses</div>
    ${TT_ROLES.map(r => {
      const rr      = responses[r.id] || {};
      const crit    = rr.criticality || '';
      const primary = primaryRoles.includes(r.id);
      const placeholder = primary
        ? (inj.rolePrompts && inj.rolePrompts[r.id] ? inj.rolePrompts[r.id] : r.name + ' response…')
        : 'Not primary this inject';
      const safeVal = (rr.text || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
      return `<div class="tt-role-row${primary ? '' : ' dimmed'}">
        <div class="tt-role-icon ${r.id}" title="${r.name}">${r.icon}</div>
        <span class="tt-role-name">${r.name}</span>
        <textarea class="tt-role-input" id="ttResp_${idx}_${r.id}"
          placeholder="${placeholder.replace(/"/g, '&quot;')}" rows="2">${safeVal}</textarea>
        <button class="tt-crit-btn ${crit.toLowerCase()}"
          onclick="ttCycleCrit(${idx},'${r.id}','${crit}')">${crit || '—'}</button>
      </div>`;
    }).join('')}
  </div>`;
}

function ttRenderInject() {
  const scenario = (tteState.scenario) || TT_SCENARIOS[ttState.scenarioId];
  const idx      = ttState.currentInject;
  const inj      = (tteState.scenario ? tteCurrentInject() : null) || scenario.injects[idx];
  if (!inj) {
    ttState.view = ttState.breach.declared ? 'notif' : 'aar';
    return renderTabletop();
  }
  const responses = ttState.responses[idx] || {};
  const pathNum   = (tteState.injectPath || []).length + 1;
  const totalInj  = (scenario.injects || []).length;
  const canGoBack = tteCanGoBack() || idx > 0;

  return `${renderTierBanner()}
  <div class="tt-inject-frame">
    ${ttNewAppBar(scenario, pathNum, totalInj)}
    ${ttNewNistBar(inj.phaseIdx)}
    <div class="tt-inject-body">
      ${ttRenderGameCard(inj, pathNum)}
      ${ttRenderRoleRows(idx, responses, inj)}
    </div>
    ${tteRenderBranchPanel('ttSaveAndBranch')}
    <div class="tt-action-bar">
      <button class="tt-btn tt-btn-ghost" onclick="ttPrevInject()" ${!canGoBack ? 'disabled' : ''}>← Previous inject</button>
      <div style="display:flex;gap:8px">
        <button class="tt-btn tt-btn-outline" onclick="ttSaveResponses(${idx}, false)">Save responses</button>
        <button class="tt-btn tt-btn-primary" onclick="ttSaveResponses(${idx}, true)">Save &amp; continue →</button>
      </div>
    </div>
  </div>
  ${ttRenderLobbyPanel()}
  ${ttRenderResponseFeedPanel(idx)}`;
}

function ttCycleCrit(idx, roleId, current) {
  const order = ['','Critical','High','Medium','Low'];
  const next = order[(order.indexOf(current) + 1) % order.length];
  ttSetCrit(idx, roleId, next);
}

function ttSetCrit(idx, roleId, c) {
  ttSnapshot();
  ttState.responses[idx] = ttState.responses[idx] || {};
  ttState.responses[idx][roleId] = ttState.responses[idx][roleId] || {};
  ttState.responses[idx][roleId].criticality = c;
  ttRender();
}

function ttPrevInject() {
  ttSnapshot();
  if (tteCanGoBack()) {
    ttePrev();
    ttState.currentInject = tteState.currentIndex;
    ttRender();
  } else if (ttState.currentInject > 0) {
    ttState.currentInject -= 1;
    ttRender();
  }
}

async function ttSaveResponses(idx, advance) {
  ttSnapshot();
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  const inj = (tteState.scenario ? tteCurrentInject() : null) || scenario.injects[idx];
  for (const r of TT_ROLES) {
    const rr = (ttState.responses[idx] && ttState.responses[idx][r.id]) || {};
    const text = (rr.text || '').trim();
    if (!text && !rr.criticality) continue;
    try {
      await sb.tt.upsertResponse({
        session_id: ttState.sessionId,
        inject_index: idx,
        role_id: r.id,
        response_text: text || null,
        criticality: rr.criticality || null,
      });
    } catch (e) { console.warn('response save failed for', r.id, e); }
  }
  await ttLog('inject_responses_saved', { inject: idx });
  toast('Responses saved', '#15803d');
  if (!advance) { ttRender(); return; }
  // Advance via default branch
  await _ttAdvance(idx, 'default', inj);
}

// Shared advance logic — used by ttSaveResponses AND ttSaveAndBranch
async function _ttAdvance(idx, branchId, inj) {
  const resolvedInj = inj || (tteState.scenario ? tteCurrentInject() : TT_SCENARIOS[ttState.scenarioId].injects[idx]);
  if (resolvedInj && resolvedInj.triggersBreach && !ttState.breach.declared) {
    ttState.view = 'breach';
  } else {
    const nextIndex = tteState.scenario
      ? tteNavigate(branchId)
      : (idx + 1 < TT_SCENARIOS[ttState.scenarioId].injects.length ? idx + 1 : null);
    if (nextIndex !== null && nextIndex !== undefined) {
      ttState.currentInject = nextIndex;
    } else if (ttState.breach.declared) {
      ttState.view = 'notif';
    } else {
      ttState.view = 'aar';
    }
  }
  try {
    await sb.tt.updateSession(ttState.sessionId, {
      current_inject: ttState.currentInject,
      inject_path: ttePathJson(),
      updated_at: new Date().toISOString(),
    });
  } catch (e) { console.warn('session pointer save failed', e); }
  ttRender();
}

// Called by branch panel buttons — saves responses then navigates via chosen branch
async function ttSaveAndBranch(branchId) {
  ttSnapshot();
  const idx = ttState.currentInject;
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  const inj = (tteState.scenario ? tteCurrentInject() : null) || scenario.injects[idx];
  for (const r of TT_ROLES) {
    const rr = (ttState.responses[idx] && ttState.responses[idx][r.id]) || {};
    const text = (rr.text || '').trim();
    if (!text && !rr.criticality) continue;
    try {
      await sb.tt.upsertResponse({
        session_id: ttState.sessionId,
        inject_index: idx,
        role_id: r.id,
        response_text: text || null,
        criticality: rr.criticality || null,
      });
    } catch (e) { console.warn('response save failed for', r.id, e); }
  }
  await ttLog('inject_responses_saved', { inject: idx, branch: branchId });
  toast('Responses saved', '#15803d');
  await _ttAdvance(idx, branchId, inj);
}

// ---- BREACH GATE ----
function ttRenderBreachGate() {
  const b = ttState.breach;
  return `${renderTierBanner()}
  ${ttHeaderBar()}
  <div class="erc-box">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#92400e;margin-bottom:5px">Executive Sponsor — assumed-role reminder</div>
    <div style="font-size:12px;color:#7c4a05;line-height:1.5">The Executive Sponsor is assumed by an ops participant. Step into the seat — you are not playing yourself. You authorise externally-visible action: customer notification, ransom decisions, formal breach declaration, regulatory disclosure. You are accountable.</div>
  </div>
  <div class="breach-gate" style="color:#fff">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#fca5a5;margin-bottom:6px">Breach declaration gate</div>
    <div style="font-size:15px;font-weight:700;margin-bottom:0.5rem">Declare a security breach</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.75);line-height:1.5;margin-bottom:0.9rem">Both the Incident Commander <i>and</i> the Executive Sponsor must co-sign. Neither signature alone is sufficient. Once declared, regulatory and contractual notification clocks start.</div>
    <div class="field-lbl" style="color:rgba(255,255,255,0.6)">Rationale for breach determination</div>
    <textarea id="ttBreachRat" placeholder="Why are we declaring? Cite the indicator (e.g. confirmed exfiltration of guest PII)." style="background:rgba(255,255,255,0.05);color:#fff;border-color:rgba(255,255,255,0.2)">${b.rationale || ''}</textarea>
    <div class="co-sign-grid" style="margin-top:10px">
      <div class="co-sign-card">
        <div style="font-size:11px;font-weight:700;color:#fff;margin-bottom:3px">&#x1F9ED; Incident Commander</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:5px">${b.ic_sign_time ? 'Signed ' + new Date(b.ic_sign_time).toLocaleTimeString() : 'Not signed'}</div>
        <button class="btn ${b.ic_sign_time ? 'btn-green' : 'btn-cyan'} btn-sm" onclick="ttSignBreach('ic')" ${b.ic_sign_time ? 'disabled' : ''}>${b.ic_sign_time ? '&#x2713; Signed' : 'Sign as IC'}</button>
      </div>
      <div class="co-sign-card">
        <div style="font-size:11px;font-weight:700;color:#fff;margin-bottom:3px">&#x1F454; Executive Sponsor</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:5px">${b.es_sign_time ? 'Signed ' + new Date(b.es_sign_time).toLocaleTimeString() : 'Not signed'}</div>
        <button class="btn ${b.es_sign_time ? 'btn-green' : 'btn-cyan'} btn-sm" onclick="ttSignBreach('es')" ${b.es_sign_time ? 'disabled' : ''}>${b.es_sign_time ? '&#x2713; Signed' : 'Sign as ES'}</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">
      <button class="btn btn-outline btn-sm" onclick="ttCancelBreach()" style="color:#fff;border-color:rgba(255,255,255,0.3)">Back to inject</button>
      <button class="btn btn-red" onclick="ttDeclareBreach()" ${!(b.ic_sign_time && b.es_sign_time) ? 'disabled' : ''}>Declare breach →</button>
    </div>
  </div>`;
}

function ttSignBreach(role) {
  ttSnapshot();
  const ts = new Date().toISOString();
  if (role === 'ic') ttState.breach.ic_sign_time = ts;
  if (role === 'es') ttState.breach.es_sign_time = ts;
  ttRender();
}

function ttCancelBreach() {
  ttSnapshot();
  ttState.breach.ic_sign_time = null;
  ttState.breach.es_sign_time = null;
  ttState.view = 'inject';
  ttRender();
}

async function ttDeclareBreach() {
  ttSnapshot();
  if (!ttState.breach.rationale.trim()) { toast('Add a rationale', '#dc2626'); return; }
  const ts = new Date().toISOString();
  ttState.breach.declared = true;
  ttState.notifStartTime = ts;
  try {
    await sb.tt.updateSession(ttState.sessionId, {
      breach_declared: true,
      breach_timestamp: ts,
      breach_rationale: ttState.breach.rationale,
      ic_sign_time: ttState.breach.ic_sign_time,
      es_sign_time: ttState.breach.es_sign_time,
      updated_at: ts,
    });
    await ttLog('breach_declared', { ts, rationale: ttState.breach.rationale });
    toast('Breach declared — notification clock started', '#b91c1c');
    // Advance to next inject via engine (or fallback to index+1)
    const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
    const nextIndex = tteState.scenario
      ? tteNavigate('default')
      : (ttState.currentInject + 1 < scenario.injects.length ? ttState.currentInject + 1 : null);
    if (nextIndex !== null && nextIndex !== undefined) {
      ttState.currentInject = nextIndex;
      ttState.view = 'inject';
    } else {
      ttState.view = 'notif';
    }
    try {
      await sb.tt.updateSession(ttState.sessionId, { inject_path: ttePathJson(), updated_at: new Date().toISOString() });
    } catch (e) { console.warn('inject path save failed', e); }
    ttRender();
  } catch (e) { toast('Could not save breach — ' + e.message, '#dc2626'); }
}

// ---- NOTIF CHECKLIST ----
function ttRenderNotif() {
  const elapsedHr = ttState.notifStartTime ? Math.floor((Date.now() - new Date(ttState.notifStartTime).getTime()) / 36e5) : 0;
  const remaining = Math.max(0, 72 - elapsedHr);
  return `${renderTierBanner()}
  ${ttHeaderBar()}
  <div class="notif-card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
      <div>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--amber);margin-bottom:3px">Insurer + regulatory notification</div>
        <div style="font-size:14px;font-weight:700">8-item checklist · 72-hour clock</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:9px;color:var(--muted);letter-spacing:0.06em;text-transform:uppercase">Time remaining</div>
        <div style="font-size:18px;font-weight:700;color:${remaining < 24 ? 'var(--red)' : 'var(--amber)'}">${remaining}h</div>
      </div>
    </div>
    ${TT_NOTIF_ITEMS.map(it => {
      const c = ttState.notifChecks[it.id];
      const checked = c && c.checked;
      return `<div class="notif-item">
        <div class="notif-check ${checked ? 'checked' : ''}" onclick="ttToggleNotif('${it.id}')">${checked ? '&#x2713;' : ''}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:700">${it.label}</div>
          <div style="font-size:10px;color:var(--muted)">${it.detail}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px">Target window: ${it.clockHr}h</div>
        </div>
        ${checked && c.checkedAt ? `<span class="badge b-green">&#x2713; ${new Date(c.checkedAt).toLocaleTimeString()}</span>` : ''}
      </div>`;
    }).join('')}
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
      <button class="btn btn-outline btn-sm" onclick="ttBackToLastInject()">← Back to injects</button>
      <button class="btn btn-primary" onclick="ttGoto('aar')">Generate AAR →</button>
    </div>
  </div>`;
}

function ttBackToLastInject() {
  ttSnapshot();
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  ttState.currentInject = Math.min(ttState.currentInject, scenario.injects.length - 1);
  ttState.view = 'inject';
  ttRender();
}

async function ttToggleNotif(itemId) {
  ttSnapshot();
  const cur = ttState.notifChecks[itemId] && ttState.notifChecks[itemId].checked;
  const checked = !cur;
  const ts = new Date().toISOString();
  ttState.notifChecks[itemId] = { checked, checkedAt: checked ? ts : null };
  try {
    await sb.tt.upsertNotif({
      session_id: ttState.sessionId,
      item_id: itemId,
      checked,
      checked_at: checked ? ts : null,
    });
    await ttLog('notif_toggle', { item: itemId, checked });
  } catch (e) { console.warn('notif save failed', e); }
  ttRender();
}

// ---- RUBRIC SCORING ----

function ttRenderRubricCard() {
  const dims   = tteRubricDimensions();
  const rubric = tteGetRubric();
  const grade  = tteRubricGrade();
  const scored = tteRubricComplete();

  // Compact summary view — show after saving unless edit mode is active
  if (scored && !ttState._rubricEditing) {
    return `<div class="card" style="margin-bottom:0.85rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="card-title" style="margin-bottom:0">&#x1F3AF; Performance Rubric</div>
        <button class="btn btn-outline btn-sm" onclick="ttEditRubric()">Edit scores</button>
      </div>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
        <div style="width:52px;height:52px;border-radius:50%;background:${grade.bg};display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:${grade.color};flex-shrink:0">${grade.letter}</div>
        <div>
          <div style="font-size:15px;font-weight:700;color:${grade.color}">Grade ${grade.letter} &mdash; ${grade.pct}%</div>
          <div style="font-size:11px;color:var(--muted)">Facilitator-judged performance score</div>
        </div>
      </div>
      <div style="display:grid;gap:5px">
        ${dims.map(d => {
          const r = rubric[d.id] || {};
          return `<div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid var(--border)">
            <span style="color:var(--text);font-weight:600">${d.label}</span>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="display:flex;gap:2px">${[1,2,3,4,5].map(n => `<span style="width:16px;height:16px;border-radius:50%;background:${n <= (r.score||0) ? grade.color : '#e5e7eb'};display:inline-block"></span>`).join('')}</div>
              <span style="font-weight:700;color:${grade.color};min-width:12px">${r.score || '—'}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  // Scoring form
  return `<div class="card" style="margin-bottom:0.85rem">
    <div class="card-title">&#x1F3AF; Facilitator Performance Rubric</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:14px;line-height:1.5">
      Score this exercise across 5 dimensions <strong>(1 = poor &nbsp;·&nbsp; 5 = excellent)</strong>. Your scores generate the A&ndash;F grade shown on the exercises dashboard trend line.
    </div>
    <div style="display:grid;gap:16px">
      ${dims.map(d => {
        const r = rubric[d.id] || {};
        return `<div style="padding-bottom:14px;border-bottom:1px solid var(--border)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;flex-wrap:wrap;gap:6px">
            <div style="font-size:12px;font-weight:700;color:var(--text)">${d.label}</div>
            <div style="display:flex;gap:3px">
              ${[1,2,3,4,5].map(n => `<button class="crit-btn${r.score === n ? ' sel-Critical' : ''}" onclick="ttSetRubricDim('${d.id}',${n})" style="min-width:30px;font-weight:700">${n}</button>`).join('')}
            </div>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">${d.desc || ''}</div>
          <input type="text" id="ttRubric_${d.id}" placeholder="Notes (optional)" value="${(r.notes || '').replace(/"/g,'&quot;')}" style="font-size:11px;padding:6px 9px">
        </div>`;
      }).join('')}
    </div>
    ${grade ? `<div style="margin-top:12px;padding:10px 14px;background:${grade.bg};border-radius:8px;display:flex;align-items:center;gap:12px">
      <div style="width:38px;height:38px;border-radius:50%;background:${grade.color};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#fff;flex-shrink:0">${grade.letter}</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:${grade.color}">Grade ${grade.letter} &mdash; ${grade.pct}%</div>
        <div style="font-size:11px;color:${grade.color};opacity:0.8">${grade.pct>=90?'Excellent response':''}${grade.pct>=75&&grade.pct<90?'Strong performance':''}${grade.pct>=60&&grade.pct<75?'Adequate — some gaps identified':''}${grade.pct>=45&&grade.pct<60?'Below standard — significant gaps':''}${grade.pct<45?'Poor performance — intervention needed':''}</div>
      </div>
    </div>` : `<div style="margin-top:12px;font-size:11px;color:var(--muted)">Score all 5 dimensions to preview your grade.</div>`}
    <div style="display:flex;justify-content:flex-end;margin-top:12px">
      <button class="btn btn-primary btn-sm" onclick="ttSaveRubric()" ${!scored ? 'disabled title="Score all 5 dimensions first"' : ''}>Save rubric scores →</button>
    </div>
  </div>`;
}

function ttSetRubricDim(dimId, score) {
  // Capture any typed notes before re-render
  tteRubricDimensions().forEach(d => {
    const el = document.getElementById('ttRubric_' + d.id);
    if (el) {
      const existing = tteGetRubric()[d.id];
      if (existing && existing.score) tteSetRubricScore(d.id, existing.score, el.value);
    }
  });
  tteSetRubricScore(dimId, score);
  ttRender();
}

function ttEditRubric() { ttState._rubricEditing = true; ttRender(); }

async function ttSaveRubric() {
  // Final note capture
  tteRubricDimensions().forEach(d => {
    const el = document.getElementById('ttRubric_' + d.id);
    if (el) {
      const existing = tteGetRubric()[d.id];
      if (existing && existing.score) tteSetRubricScore(d.id, existing.score, el.value);
    }
  });
  if (!tteRubricComplete()) { toast('Score all 5 dimensions first', '#dc2626'); return; }
  const rubric    = tteGetRubric();
  const grade     = tteRubricGrade();
  const sessionId = ttState.sessionId || (ttState.historicalSession && ttState.historicalSession.id);
  if (!sessionId) { toast('No session to save to', '#dc2626'); return; }
  try {
    await sb.tt.updateSession(sessionId, { rubric_scores: rubric, updated_at: new Date().toISOString() });
    // Keep historical session object in sync so re-render shows the saved scores
    if (ttState.historicalSession) ttState.historicalSession.rubric_scores = rubric;
    await ttLog('rubric_scored', { grade: grade.letter, pct: grade.pct });
    toast('Rubric saved — Grade: ' + grade.letter, '#15803d');
    ttState._rubricEditing = false;
    ttRender();
  } catch (e) { toast('Could not save rubric — ' + e.message, '#dc2626'); }
}

// ---- MITRE ATT&CK Path Map ----
function ttRenderMitrePath() {
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  if (!scenario || !scenario.injects || scenario.injects.length === 0) return '';

  // For sessions without path data, show a placeholder
  if ((tteState.injectPath || []).length === 0) {
    return `<div class="card">
      <div class="card-title">&#x2694;&#xFE0F; MITRE ATT&CK Path Map</div>
      <div style="font-size:12px;color:var(--muted);padding:.5rem 0">Path data is not available for this session. Path tracking was added in a later platform version — future sessions will display the full attack chain here.</div>
    </div>`;
  }

  const displayPath = ttGetDisplayPath();
  const visitedSet = new Set(displayPath);
  const injectPath = tteState.injectPath || [];
  const branchTakenMap = {};
  injectPath.forEach(p => { branchTakenMap[p.index] = p.branchTaken; });

  // Avoided: alternative branches from visited injects that pointed to unvisited injects
  const avoidedSet = new Set();
  displayPath.forEach(idx => {
    const inj = scenario.injects[idx];
    if (!inj || !inj.branches) return;
    const taken = branchTakenMap[idx];
    inj.branches.forEach(b => {
      if (b.id !== taken && b.next_index != null && !visitedSet.has(b.next_index)) avoidedSet.add(b.next_index);
    });
  });

  // Unreached: not visited and not an avoided branch target
  const unreachedIndices = scenario.injects.map((_, i) => i).filter(i => !visitedSet.has(i) && !avoidedSet.has(i));

  function nodeCard(idx, type, stepNum) {
    const inj = scenario.injects[idx];
    if (!inj) return '';
    const mitre = inj.mitre || {};
    const nist = TT_NIST_PHASES[inj.phaseIdx] || '';
    const takenBranchId = branchTakenMap[idx];
    const takenBranch = inj.branches && takenBranchId ? inj.branches.find(b => b.id === takenBranchId) : null;

    if (type === 'taken') {
      return `<div style="width:185px;background:#eef8ff;border:2px solid var(--cyan);border-radius:10px;padding:.75rem;box-shadow:0 2px 8px rgba(7,180,217,.12);flex-shrink:0">
        <div style="font-size:10px;font-weight:700;color:var(--cyan);text-transform:uppercase;margin-bottom:.3rem;letter-spacing:.05em">Step ${stepNum} &nbsp;&#x2713; Taken</div>
        <div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:.5rem;line-height:1.35">${inj.title}</div>
        ${mitre.tactic ? `<div style="font-size:10px;font-weight:700;color:var(--navy);background:rgba(21,33,104,.1);padding:2px 7px;border-radius:4px;margin-bottom:.25rem;display:inline-block">${mitre.tactic}</div>` : ''}
        ${mitre.technique ? `<div style="font-size:10px;color:var(--muted);margin-top:.2rem;margin-bottom:.35rem">${mitre.technique}</div>` : ''}
        ${nist ? `<div style="font-size:10px;color:var(--muted);border-top:1px solid rgba(7,180,217,.25);padding-top:.3rem;margin-top:.25rem">NIST: ${nist}</div>` : ''}
        ${takenBranch && takenBranch.label !== 'Continue →' ? `<div style="font-size:10px;color:var(--cyan);margin-top:.3rem;font-weight:600">&#x2192; ${takenBranch.label}</div>` : ''}
      </div>`;
    }
    if (type === 'avoided') {
      return `<div style="width:185px;background:var(--card);border:1.5px dashed var(--border);border-radius:10px;padding:.6rem .75rem;opacity:.6;margin-top:.4rem;flex-shrink:0">
        <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:.25rem">&#x2717; Not taken</div>
        <div style="font-size:11px;color:var(--muted);line-height:1.3;margin-bottom:.3rem">${inj.title}</div>
        ${mitre.tactic ? `<div style="font-size:10px;color:var(--muted)">${mitre.tactic}</div>` : ''}
      </div>`;
    }
    // unreached
    return `<div style="width:165px;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:.6rem .75rem;opacity:.45">
      <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:.25rem">&#x2205; Not reached</div>
      <div style="font-size:11px;color:var(--muted);line-height:1.3;margin-bottom:.3rem">${inj.title}</div>
      ${mitre.tactic ? `<div style="font-size:10px;color:var(--muted)">${mitre.tactic}</div>` : ''}
    </div>`;
  }

  const arrow = `<div style="display:flex;align-items:center;padding:0 .15rem;margin-top:1.25rem;flex-shrink:0">
    <div style="width:24px;height:2px;background:linear-gradient(90deg,var(--cyan),var(--navy));position:relative">
      <div style="position:absolute;right:-7px;top:-5px;color:var(--navy);font-size:16px;line-height:1">&#x203A;</div>
    </div>
  </div>`;

  // Build columns: taken node + any avoided alternatives stacked below it
  const columns = displayPath.map((idx, i) => {
    const inj = scenario.injects[idx];
    if (!inj) return '';
    const taken = branchTakenMap[idx];
    const avoidedFromHere = [];
    if (inj.branches) {
      inj.branches.forEach(b => {
        if (b.id !== taken && b.next_index != null && avoidedSet.has(b.next_index)) avoidedFromHere.push(b.next_index);
      });
    }
    return `<div style="display:flex;flex-direction:column;align-items:flex-start;flex-shrink:0">
      ${nodeCard(idx, 'taken', i + 1)}
      ${avoidedFromHere.map(ai => nodeCard(ai, 'avoided', 0)).join('')}
    </div>`;
  });

  const pathRow = columns.reduce((acc, col, i) => i === 0 ? col : acc + arrow + col, '');

  const unreachedSection = unreachedIndices.length === 0 ? '' : `
    <div style="margin-top:1rem;padding-top:.75rem;border-top:1px solid var(--border)">
      <div style="font-size:12px;font-weight:600;color:var(--muted);margin-bottom:.5rem">&#x26A0;&#xFE0F; Paths Not Explored During This Exercise</div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">${unreachedIndices.map(i => nodeCard(i, 'unreached', 0)).join('')}</div>
    </div>`;

  return `<div class="card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:.5rem">
      <div class="card-title" style="margin-bottom:0">&#x2694;&#xFE0F; MITRE ATT&CK Path Map</div>
      <div style="display:flex;gap:.4rem">
        <button class="btn btn-outline btn-sm" onclick="ttState.playbackStep=0;ttState.view='mitre_playback';ttRender()" style="font-size:11px">&#x25B6;&#xFE0F; Playback</button>
        <button class="btn btn-outline btn-sm" onclick="ttState.view='mitre_matrix';ttRender()" style="font-size:11px">&#x1F5FA;&#xFE0F; Full Matrix</button>
      </div>
    </div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:1rem">
      Attack chain as it unfolded during this exercise. &nbsp;
      <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:3px;border:2px solid var(--cyan);background:#eef8ff;display:inline-block"></span> Path taken</span> &nbsp;
      <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:3px;border:1.5px dashed var(--border);display:inline-block;opacity:.6"></span> Branch avoided</span> &nbsp;
      <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:3px;border:1.5px solid var(--border);background:var(--bg);display:inline-block;opacity:.45"></span> Not reached</span>
    </div>
    <div style="overflow-x:auto;padding-bottom:.5rem;-webkit-overflow-scrolling:touch">
      <div style="display:flex;align-items:flex-start;gap:0;min-width:max-content">${pathRow}</div>
    </div>
    ${unreachedSection}
  </div>`;
}

// ---- MITRE ATT&CK Full Matrix View ----
function ttRenderMitreMatrix() {
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  if (!scenario) return '';
  const title = (tteState.scenario || {}).title || (TT_SCENARIOS[ttState.scenarioId] || {}).title || 'Tabletop';

  const displayPath = ttGetDisplayPath();
  const visitedSet = new Set(displayPath);

  // Build matrix: tacticId → { techniques: [{ id, name, encountered, injectNums }] }
  const matrix = {};
  MITRE_TACTICS_LIST.forEach(t => { matrix[t.id] = { techniques: [] }; });

  scenario.injects.forEach((inj, idx) => {
    const parsed = ttParseMitreInject(inj.mitre);
    const encountered = visitedSet.has(idx);
    const injectNum = idx + 1;
    // Assign all techniques to all tactics mentioned in this inject
    parsed.tactics.forEach(tac => {
      if (!matrix[tac.id]) matrix[tac.id] = { techniques: [] };
      parsed.techniques.forEach(tech => {
        let existing = matrix[tac.id].techniques.find(t => t.id === tech.id);
        if (!existing) {
          existing = { id: tech.id, name: tech.name, encountered: false, injectNums: [] };
          matrix[tac.id].techniques.push(existing);
        }
        if (!existing.injectNums.includes(injectNum)) existing.injectNums.push(injectNum);
        if (encountered) existing.encountered = true;
      });
    });
  });

  // Summary stats
  let totalTechs = 0, encTechs = 0;
  MITRE_TACTICS_LIST.forEach(t => {
    (matrix[t.id] || {techniques:[]}).techniques.forEach(tech => {
      totalTechs++;
      if (tech.encountered) encTechs++;
    });
  });

  const cols = MITRE_TACTICS_LIST.map(tac => {
    const techs = (matrix[tac.id] || {techniques:[]}).techniques;
    const hasAny = techs.length > 0;
    const hasEnc = techs.some(t => t.encountered);
    const headerBg = hasEnc ? 'var(--navy)' : (hasAny ? '#6b7280' : '#d1d5db');
    const headerColor = (hasEnc || hasAny) ? '#fff' : 'var(--muted)';
    return `<div style="flex-shrink:0;width:128px">
      <div style="font-size:9px;font-weight:700;text-align:center;padding:.4rem .3rem;border-radius:6px 6px 0 0;background:${headerBg};color:${headerColor};text-transform:uppercase;letter-spacing:.05em;line-height:1.3;min-height:2.6rem;display:flex;align-items:center;justify-content:center">
        ${tac.name}${hasEnc ? '<br/><span style="font-size:8px;opacity:.8;font-weight:400">' + techs.filter(t=>t.encountered).length + ' triggered</span>' : ''}
      </div>
      <div style="display:flex;flex-direction:column;gap:2px;margin-top:2px;min-height:28px">
        ${techs.length === 0
          ? `<div style="font-size:10px;color:var(--border);text-align:center;padding:.5rem .25rem;border:1px solid var(--border);border-radius:4px;margin-top:2px">—</div>`
          : techs.map(tech => {
              const enc = tech.encountered;
              return `<div style="font-size:10px;padding:.3rem .4rem;border-radius:4px;line-height:1.3;
                background:${enc ? 'var(--navy)' : 'var(--bg)'};
                color:${enc ? '#fff' : 'var(--muted)'};
                border:1px solid ${enc ? 'var(--cyan)' : 'var(--border)'};
                font-weight:${enc ? '600' : '400'};
                border-left:${enc ? '3px solid var(--cyan)' : '1px solid var(--border)'}
              " title="Inject ${tech.injectNums.join(', ')}">
                <div style="font-size:8px;opacity:.7;margin-bottom:1px">${tech.id}</div>
                ${tech.name}
                ${enc ? '' : `<div style="font-size:8px;opacity:.6;margin-top:1px">Inj ${tech.injectNums.join(',')}</div>`}
              </div>`;
            }).join('')
        }
      </div>
    </div>`;
  }).join('<div style="flex-shrink:0;width:3px;background:var(--border);border-radius:2px;margin:0 1px"></div>');

  return `${renderTierBanner()}
  <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" onclick="ttState.view='aar';ttRender()">← Back to AAR</button>
    <div style="font-size:17px;font-weight:700;flex:1">&#x2694;&#xFE0F; MITRE ATT&CK Matrix — ${title}</div>
    <button class="btn btn-primary btn-sm" onclick="ttState.playbackStep=0;ttState.view='mitre_playback';ttRender()">&#x25B6;&#xFE0F; Step Through</button>
  </div>
  <div class="card" style="padding:.75rem">
    <div style="display:flex;gap:1.5rem;margin-bottom:.75rem;font-size:12px;align-items:center;flex-wrap:wrap">
      <span style="color:var(--muted)">${scenario.injects.length}-inject scenario &nbsp;·&nbsp; ${encTechs} of ${totalTechs} technique${totalTechs !== 1 ? 's' : ''} triggered</span>
      <span style="display:inline-flex;align-items:center;gap:5px">
        <span style="width:14px;height:14px;background:var(--navy);border-radius:3px;border-left:3px solid var(--cyan);display:inline-block"></span>
        <span style="font-size:11px">Encountered</span>
      </span>
      <span style="display:inline-flex;align-items:center;gap:5px">
        <span style="width:14px;height:14px;background:var(--bg);border:1px solid var(--border);border-radius:3px;display:inline-block"></span>
        <span style="font-size:11px;color:var(--muted)">In scenario, not triggered</span>
      </span>
      <span style="display:inline-flex;align-items:center;gap:5px">
        <span style="width:14px;height:14px;background:#d1d5db;border-radius:3px;display:inline-block"></span>
        <span style="font-size:11px;color:var(--muted)">Tactic not used</span>
      </span>
    </div>
    <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:.5rem">
      <div style="display:flex;align-items:flex-start;gap:0;min-width:max-content">
        ${cols}
      </div>
    </div>
    <div style="margin-top:.75rem;padding-top:.5rem;border-top:1px solid var(--border);font-size:11px;color:var(--muted)">
      Hover over a cell to see which inject triggered it. Techniques are assigned to all tactics referenced in the same inject.
    </div>
  </div>`;
}

// ---- MITRE Playback ----
function ttPlaybackNext() {
  const path = ttGetDisplayPath();
  ttState.playbackStep = Math.min((ttState.playbackStep || 0) + 1, path.length - 1);
  ttRender();
}

function ttPlaybackPrev() {
  ttState.playbackStep = Math.max((ttState.playbackStep || 0) - 1, 0);
  ttRender();
}

function ttRenderMitrePlayback() {
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  if (!scenario) return '';
  const title = (tteState.scenario || {}).title || (TT_SCENARIOS[ttState.scenarioId] || {}).title || 'Tabletop';

  const displayPath = ttGetDisplayPath();
  if (displayPath.length === 0) {
    return `${renderTierBanner()}
    <div class="card"><div class="card-title">&#x25B6;&#xFE0F; Playback unavailable</div>
    <div style="font-size:12px;color:var(--muted);padding:.5rem 0">Path data is not available for this session.</div></div>`;
  }

  const total = displayPath.length;
  const step = Math.max(0, Math.min(ttState.playbackStep || 0, total - 1));
  const currentIdx = displayPath[step];
  const currentInj = scenario.injects[currentIdx];

  // Branch taken at current inject
  const injectPath = tteState.injectPath || [];
  const branchTakenMap = {};
  injectPath.forEach(p => { branchTakenMap[p.index] = p.branchTaken; });
  const takenBranchId = branchTakenMap[currentIdx];
  const takenBranch = currentInj && currentInj.branches && takenBranchId
    ? currentInj.branches.find(b => b.id === takenBranchId)
    : null;

  // Role responses + criticality accuracy for this inject
  const responses = (ttState.responses || {})[currentIdx] || {};
  let critTotal = 0, critCorrect = 0;
  TT_ROLES.forEach(r => {
    const cr = responses[r.id] && responses[r.id].criticality;
    if (cr) { critTotal++; if (cr === (currentInj && currentInj.correctCriticality)) critCorrect++; }
  });
  const critAccPct = critTotal ? Math.round(critCorrect / critTotal * 100) : null;
  const nistLabel = TT_NIST_PHASES[(currentInj && currentInj.phaseIdx)] || '';
  const currentMitre = ttParseMitreInject(currentInj && currentInj.mitre);

  // Build matrix with 3 states: current | past | future
  const matrix = {};
  MITRE_TACTICS_LIST.forEach(t => { matrix[t.id] = { techniques: [] }; });
  const stateRank = { current: 2, past: 1, future: 0 };

  displayPath.forEach((idx, pos) => {
    const inj = scenario.injects[idx];
    if (!inj) return;
    const techState = pos < step ? 'past' : (pos === step ? 'current' : 'future');
    const parsed = ttParseMitreInject(inj.mitre);
    parsed.tactics.forEach(tac => {
      if (!matrix[tac.id]) matrix[tac.id] = { techniques: [] };
      parsed.techniques.forEach(tech => {
        let ex = matrix[tac.id].techniques.find(t => t.id === tech.id);
        if (!ex) {
          ex = { id: tech.id, name: tech.name, state: 'future', stepNum: pos + 1 };
          matrix[tac.id].techniques.push(ex);
        }
        if (stateRank[techState] > stateRank[ex.state]) { ex.state = techState; ex.stepNum = pos + 1; }
      });
    });
  });

  // Matrix columns
  const cols = MITRE_TACTICS_LIST.map(tac => {
    const techs = matrix[tac.id].techniques;
    const hasCur = techs.some(t => t.state === 'current');
    const hasPast = techs.some(t => t.state === 'past');
    const hasAny = techs.length > 0;
    const hdrBg = hasCur ? 'var(--cyan)' : (hasPast ? 'var(--navy)' : (hasAny ? '#6b7280' : '#d1d5db'));
    return `<div style="flex-shrink:0;width:128px">
      <div style="font-size:9px;font-weight:700;text-align:center;padding:.4rem .3rem;border-radius:6px 6px 0 0;background:${hdrBg};color:#fff;text-transform:uppercase;letter-spacing:.05em;line-height:1.3;min-height:2.6rem;display:flex;align-items:center;justify-content:center">
        ${tac.name}${hasCur ? '<br/><span style="font-size:8px;opacity:.9;font-weight:400">▲ triggered now</span>' : ''}
      </div>
      <div style="display:flex;flex-direction:column;gap:2px;margin-top:2px;min-height:28px">
        ${techs.length === 0
          ? `<div style="font-size:10px;color:var(--border);text-align:center;padding:.5rem .25rem;border:1px solid var(--border);border-radius:4px;margin-top:2px">—</div>`
          : techs.map(tech => {
              const cur = tech.state === 'current';
              const past = tech.state === 'past';
              return `<div style="font-size:10px;padding:.3rem .4rem;border-radius:4px;line-height:1.3;
                background:${cur ? 'var(--cyan)' : (past ? 'var(--navy)' : 'var(--bg)')};
                color:${(cur || past) ? '#fff' : 'var(--muted)'};
                border:1px solid ${cur ? 'var(--cyan)' : (past ? 'var(--navy)' : 'var(--border)')};
                border-left:${cur ? '3px solid #fff' : (past ? '3px solid var(--cyan)' : '1px solid var(--border)')};
                font-weight:${(cur || past) ? '600' : '400'};
                opacity:${tech.state === 'future' ? '.35' : '1'};
                ${cur ? 'box-shadow:0 0 10px rgba(7,180,217,.5);' : ''}
              " title="Step ${tech.stepNum}">
                <div style="font-size:8px;opacity:.8;margin-bottom:1px">${tech.id}</div>
                ${tech.name}
                ${tech.state === 'future' ? '<div style="font-size:8px;opacity:.5;margin-top:1px">upcoming</div>' : ''}
              </div>`;
            }).join('')
        }
      </div>
    </div>`;
  }).join('<div style="flex-shrink:0;width:3px;background:var(--border);border-radius:2px;margin:0 1px"></div>');

  // Inject detail: MITRE badges
  const mitreBadges = [
    ...currentMitre.tactics.map(t => `<span style="font-size:10px;font-weight:700;background:rgba(7,180,217,.15);color:var(--navy);padding:2px 8px;border-radius:4px;border:1px solid rgba(7,180,217,.35)">${t.id} ${t.name}</span>`),
    ...currentMitre.techniques.map(t => `<span style="font-size:10px;color:var(--muted);padding:2px 6px;border-radius:4px;border:1px solid var(--border)">${t.id} ${t.name}</span>`),
  ].join('');

  // Role response rows
  const roleRows = TT_ROLES.map(r => {
    const rr = responses[r.id];
    if (!rr || (!rr.text && !rr.criticality)) return '';
    const cr = rr.criticality || '';
    const ok = cr && cr === (currentInj && currentInj.correctCriticality);
    return `<div style="display:flex;align-items:flex-start;gap:6px;font-size:11px;padding:.25rem 0;border-bottom:1px solid var(--border)">
      <span style="font-size:13px;flex-shrink:0">${r.icon}</span>
      <span style="font-weight:600;min-width:28px;color:var(--text);flex-shrink:0">${r.id.toUpperCase()}</span>
      ${cr ? `<span class="badge ${ok ? 'b-green' : 'b-red'}" style="font-size:10px;flex-shrink:0">${cr}${ok ? ' ✓' : ' ✗'}</span>` : ''}
      ${rr.text ? `<span style="color:var(--muted);font-size:10px;line-height:1.4">${rr.text.substring(0, 100)}${rr.text.length > 100 ? '…' : ''}</span>` : ''}
    </div>`;
  }).filter(Boolean).join('');

  // Dot progress strip
  const dots = displayPath.map((_, i) =>
    `<span style="display:inline-block;width:${i === step ? 14 : 10}px;height:${i === step ? 14 : 10}px;border-radius:50%;margin:0 2px;vertical-align:middle;background:${i < step ? 'var(--navy)' : (i === step ? 'var(--cyan)' : 'var(--border)')};transition:all .2s"></span>`
  ).join('');

  return `${renderTierBanner()}
  <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" onclick="ttState.view='aar';ttRender()">← Back to AAR</button>
    <div style="font-size:15px;font-weight:700;flex:1">&#x25B6;&#xFE0F; MITRE Playback — ${title}</div>
    <button class="btn btn-outline btn-sm" onclick="ttState.view='mitre_matrix';ttRender()" style="font-size:11px">&#x1F5FA;&#xFE0F; Full Matrix</button>
  </div>

  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:.65rem 1rem;gap:.5rem">
    <button class="btn btn-outline btn-sm" onclick="ttPlaybackPrev()" ${step === 0 ? 'disabled' : ''} style="min-width:90px">◄ Previous</button>
    <div style="text-align:center">
      <div style="font-size:22px;font-weight:700;color:var(--navy);line-height:1">
        Step ${step + 1} <span style="font-size:13px;color:var(--muted);font-weight:400">of ${total}</span>
      </div>
      <div style="margin-top:.3rem">${dots}</div>
    </div>
    <button class="btn ${step === total - 1 ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="ttPlaybackNext()" ${step === total - 1 ? 'disabled' : ''} style="min-width:90px">Next ►</button>
  </div>

  <div class="card" style="border-left:4px solid var(--cyan);margin-bottom:1rem">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem">
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--cyan);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.2rem">Inject ${step + 1}${nistLabel ? ' · ' + nistLabel : ''}</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);line-height:1.3">${currentInj ? currentInj.title : '—'}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        ${currentInj && currentInj.correctCriticality ? `<span class="badge b-navy" style="font-size:10px">${currentInj.correctCriticality}</span>` : ''}
        ${critAccPct !== null ? `<div style="font-size:11px;color:${critAccPct >= 70 ? 'var(--green)' : 'var(--red)'};margin-top:.3rem;font-weight:700">${critAccPct}% accuracy</div>` : ''}
      </div>
    </div>
    ${mitreBadges ? `<div style="display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.5rem">${mitreBadges}</div>` : ''}
    ${takenBranch && takenBranch.label !== 'Continue →' ? `<div style="font-size:11px;color:var(--cyan);font-weight:600;margin-bottom:.5rem">&#x2192; Branch: ${takenBranch.label}</div>` : ''}
    ${roleRows
      ? `<div style="margin-top:.35rem">${roleRows}</div>`
      : `<div style="font-size:11px;color:var(--muted);font-style:italic;margin-top:.35rem">No responses recorded for this inject.</div>`}
  </div>

  <div class="card" style="padding:.75rem">
    <div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:.6rem;display:flex;align-items:center;gap:.75rem;flex-wrap:wrap">
      MITRE ATT&CK
      <span style="display:inline-flex;align-items:center;gap:4px;font-weight:400;font-size:11px"><span style="width:12px;height:12px;background:var(--cyan);border-radius:3px;display:inline-block"></span> Triggered this step</span>
      <span style="display:inline-flex;align-items:center;gap:4px;font-weight:400;font-size:11px"><span style="width:12px;height:12px;background:var(--navy);border-radius:3px;display:inline-block"></span> Already triggered</span>
      <span style="display:inline-flex;align-items:center;gap:4px;font-weight:400;font-size:11px"><span style="width:12px;height:12px;background:var(--bg);border:1px solid var(--border);border-radius:3px;display:inline-block;opacity:.35"></span> Upcoming</span>
    </div>
    <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:.5rem">
      <div style="display:flex;align-items:flex-start;gap:0;min-width:max-content">${cols}</div>
    </div>
  </div>`;
}

// ---- Action Items ----
const TT_STATUS_TO_RR = { open: 'Open', in_progress: 'In Progress', closed: 'Closed' };
const TT_STATUS_FROM_RR = { 'Open': 'open', 'In Progress': 'in_progress', 'Accepted': 'closed', 'Closed': 'closed', 'Transferred': 'closed' };

async function ttLoadActionItems() {
  if (!ttState || !ttState.sessionId) return;
  try {
    const items = await sb.tt.listActionItems(ttState.sessionId);
    // Sync from linked RR entries — pull current RR state back into action items
    const pushed = items.filter(i => i.pushed_to_rr && i.rr_entry_id);
    if (pushed.length) {
      const rrRows = await sb.riskRegister.getByIds(pushed.map(i => i.rr_entry_id));
      for (const item of pushed) {
        const rr = rrRows.find(r => r.id === item.rr_entry_id);
        if (!rr) {
          // RR entry deleted — heal: reset push state
          await sb.tt.updateActionItem(item.id, { pushed_to_rr: false, rr_entry_id: null, updated_at: new Date().toISOString() });
          item.pushed_to_rr = false;
          item.rr_entry_id  = null;
        } else {
          // Sync RR fields back to action item
          const rrStatus = TT_STATUS_FROM_RR[rr.risk_status] || item.status;
          const patch = {};
          if (rrStatus       !== item.status)   patch.status   = rrStatus;
          if ((rr.risk_owner || '') !== (item.owner || ''))     patch.owner    = rr.risk_owner || '';
          if ((rr.due_date   || '') !== (item.due_date || ''))  patch.due_date = rr.due_date   || null;
          if ((rr.inherent_risk_rating || '') !== (item.priority || '')) patch.priority = rr.inherent_risk_rating || item.priority;
          if (Object.keys(patch).length) {
            patch.updated_at = new Date().toISOString();
            await sb.tt.updateActionItem(item.id, patch);
            Object.assign(item, patch);
          }
        }
      }
    }
    ttState.actionItems = items;
  } catch(e) {
    ttState.actionItems = [];
  }
  ttRender();
}

function ttOpenActionForm() {
  ttState.actionItemForm = { description: '', owner: '', due_date: '', priority: 'High', source_inject_idx: null, notes: '' };
  ttRender();
}

function ttOpenActionFormSuggested(desc) {
  ttState.actionItemForm = { description: desc, owner: '', due_date: '', priority: 'High', source_inject_idx: null, notes: '' };
  ttRender();
}

function ttCancelActionForm() {
  ttState.actionItemForm = null;
  ttRender();
}

function ttEditActionItem(id) {
  const item = (ttState.actionItems || []).find(i => i.id === id);
  if (!item) return;
  ttState.actionItemForm = { ...item };
  ttRender();
}

async function ttSaveActionItem() {
  if (!ttState || !ttState.actionItemForm) return;
  const form = ttState.actionItemForm;
  const desc     = (document.getElementById('ttAiDesc')     || {}).value || '';
  const owner    = (document.getElementById('ttAiOwner')    || {}).value || '';
  const due      = (document.getElementById('ttAiDue')      || {}).value || null;
  const priority = (document.getElementById('ttAiPriority') || {}).value || 'High';
  const srcRaw   = (document.getElementById('ttAiInject')   || {}).value;
  const notes    = (document.getElementById('ttAiNotes')    || {}).value || '';
  const srcIdx   = srcRaw !== '' && srcRaw !== undefined ? parseInt(srcRaw) : null;
  if (!desc.trim()) { toast('Description is required', '#dc2626'); return; }
  try {
    if (form.id) {
      await sb.tt.updateActionItem(form.id, {
        description: desc.trim(), owner: owner.trim(),
        due_date: due || null, priority,
        source_inject_idx: srcIdx,
        notes: notes.trim(), updated_at: new Date().toISOString(),
      });
      // Sync to linked RR entry if one exists
      if (form.pushed_to_rr && form.rr_entry_id) {
        try {
          await sb.riskRegister.update(form.rr_entry_id, {
            risk_title:           desc.trim(),
            inherent_risk_rating: priority,
            risk_owner:           owner.trim() || null,
            due_date:             due || null,
            treatment_notes:      notes.trim() || null,
          });
        } catch(rrErr) { console.warn('RR sync on edit failed:', rrErr); }
      }
      auditLog('tabletop_action_item_update', { id: form.id });
      toast('Action item updated', '#15803d');
    } else {
      await sb.tt.createActionItem({
        session_id: ttState.sessionId, org_id: currentOrg.id,
        description: desc.trim(), owner: owner.trim(),
        due_date: due || null, priority,
        source_inject_idx: srcIdx, notes: notes.trim(),
      });
      auditLog('tabletop_action_item_create', { session_id: ttState.sessionId });
      toast('Action item added', '#15803d');
    }
    ttState.actionItemForm = null;
    ttState.actionItems = null;
    await ttLoadActionItems();
  } catch(e) { toast('Save failed — ' + e.message, '#dc2626'); }
}

async function ttDeleteActionItem(id) {
  if (!confirm('Delete this action item?')) return;
  try {
    await sb.tt.deleteActionItem(id);
    auditLog('tabletop_action_item_delete', { id });
    toast('Deleted', '#dc2626');
    ttState.actionItems = null;
    await ttLoadActionItems();
  } catch(e) { toast('Delete failed — ' + e.message, '#dc2626'); }
}

async function ttPushToRiskRegister(id) {
  const item = (ttState.actionItems || []).find(i => i.id === id);
  if (!item) return;
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  const scenarioTitle = (scenario && scenario.title) || 'Tabletop Exercise';
  const injectRef = (item.source_inject_idx !== null && item.source_inject_idx !== undefined && scenario)
    ? `Inject ${item.source_inject_idx + 1}: ${scenario.injects[item.source_inject_idx]?.title || ''}.`
    : '';
  const desc = [item.notes, `Identified during tabletop exercise: ${scenarioTitle}.`, injectRef]
    .filter(Boolean).join(' ');
  try {
    const result = await sb.riskRegister.add({
      org_id:               currentOrg.id,
      source:               'tabletop',
      risk_title:           item.description,
      risk_description:     desc,
      inherent_risk_rating: item.priority,
      risk_owner:           item.owner || null,
      due_date:             item.due_date || null,
      risk_status:          'Open',
    });
    const rrRow = Array.isArray(result) ? result[0] : result;
    await sb.tt.updateActionItem(id, {
      pushed_to_rr: true,
      rr_entry_id:  rrRow?.id || null,
      updated_at:   new Date().toISOString(),
    });
    auditLog('tabletop_action_item_pushed_to_rr', { id, rr_entry_id: rrRow?.id });
    // Invalidate risk register cache so next visit fetches fresh data
    if (typeof rrState !== 'undefined') rrState.orgId = null;
    toast('Added to risk register', '#15803d');
    ttState.actionItems = null;
    await ttLoadActionItems();
  } catch(e) { toast('Push failed — ' + e.message, '#dc2626'); }
}

async function ttCycleActionStatus(id, current) {
  const next = { open: 'in_progress', in_progress: 'closed', closed: 'open' }[current] || 'open';
  try {
    await sb.tt.updateActionItem(id, { status: next, updated_at: new Date().toISOString() });
    // Sync status to linked RR entry
    const item = (ttState.actionItems || []).find(i => i.id === id);
    if (item && item.pushed_to_rr && item.rr_entry_id) {
      try {
        await sb.riskRegister.update(item.rr_entry_id, { risk_status: TT_STATUS_TO_RR[next] || 'Open' });
      } catch(rrErr) { console.warn('RR status sync failed:', rrErr); }
    }
    auditLog('tabletop_action_item_status', { id, status: next });
    ttState.actionItems = null;
    await ttLoadActionItems();
  } catch(e) { toast('Update failed', '#dc2626'); }
}

function ttRenderActionItems() {
  if (!ttState.sessionId) return '';
  if (ttState.actionItems === null) {
    ttLoadActionItems();
    return `<div class="card" style="margin-bottom:.75rem"><div style="font-size:12px;color:var(--muted)">Loading action items…</div></div>`;
  }

  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  const items    = ttState.actionItems;
  const form     = ttState.actionItemForm;

  const PRIO_ORDER  = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const PRIO_COLOR  = { Critical: '#dc2626', High: '#ea580c', Medium: '#d97706', Low: '#6b7280' };
  const STAT_LABEL  = { open: 'Open', in_progress: 'In Progress', closed: 'Closed' };
  const STAT_COLOR  = { open: '#d97706', in_progress: 'var(--cyan)', closed: '#15803d' };

  const sorted = [...items].sort((a, b) => {
    const pd = PRIO_ORDER[a.priority] - PRIO_ORDER[b.priority];
    return pd !== 0 ? pd : new Date(a.created_at) - new Date(b.created_at);
  });

  // Suggested gaps from exercise data
  const suggestions = [];
  if (scenario) {
    scenario.injects.forEach((inj, i) => {
      const r = ttState.responses[i] || {};
      const misses = TT_ROLES.filter(role => {
        const cr = r[role.id] && r[role.id].criticality;
        return cr && cr !== inj.correctCriticality;
      });
      if (misses.length) suggestions.push(`Improve criticality classification — Inject ${i+1}: ${inj.title} (${misses.length} role${misses.length > 1 ? 's' : ''} miscategorized)`);
    });
    TT_NOTIF_ITEMS.forEach(it => {
      const c = ttState.notifChecks[it.id];
      if (!c || !c.checked) suggestions.push(`Establish procedure: ${it.label}`);
    });
    const sevMatch  = ttState.declaration.severity === scenario.declaration.correctSeverity;
    const declMatch = ttState.declaration.declare  === scenario.declaration.correctDeclare;
    if (!sevMatch || !declMatch) suggestions.push('Review and document severity classification and breach declaration criteria');
  }
  const existingDescs   = new Set(items.map(i => i.description.toLowerCase().trim()));
  const freshSuggestions = suggestions.filter(s => !existingDescs.has(s.toLowerCase().trim())).slice(0, 6);

  // Inject source options
  const injectOpts = scenario
    ? scenario.injects.map((inj, i) => `<option value="${i}" ${form && form.source_inject_idx === i ? 'selected' : ''}>Inject ${i+1} — ${inj.title}</option>`).join('')
    : '';

  // Inline form
  const formHtml = form ? `
    <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:.75rem">
      <div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:.65rem">${form.id ? 'Edit Action Item' : 'New Action Item'}</div>
      <div style="display:flex;flex-direction:column;gap:.5rem">
        <div>
          <label style="font-size:11px;font-weight:600;color:var(--muted)">Gap / Action Description *</label>
          <textarea id="ttAiDesc" rows="2" style="width:100%;padding:.4rem .6rem;border:1px solid var(--border);border-radius:6px;font-size:12px;font-family:inherit;resize:vertical;margin-top:2px;box-sizing:border-box">${form.description || ''}</textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem">
          <div>
            <label style="font-size:11px;font-weight:600;color:var(--muted)">Owner</label>
            <input id="ttAiOwner" type="text" value="${(form.owner || '').replace(/"/g,'&quot;')}" placeholder="Name or role" style="width:100%;padding:.35rem .6rem;border:1px solid var(--border);border-radius:6px;font-size:12px;margin-top:2px;box-sizing:border-box">
          </div>
          <div>
            <label style="font-size:11px;font-weight:600;color:var(--muted)">Due Date</label>
            <input id="ttAiDue" type="date" value="${form.due_date || ''}" style="width:100%;padding:.35rem .6rem;border:1px solid var(--border);border-radius:6px;font-size:12px;margin-top:2px;box-sizing:border-box">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem">
          <div>
            <label style="font-size:11px;font-weight:600;color:var(--muted)">Priority</label>
            <select id="ttAiPriority" style="width:100%;padding:.35rem .6rem;border:1px solid var(--border);border-radius:6px;font-size:12px;margin-top:2px;box-sizing:border-box">
              ${['Critical','High','Medium','Low'].map(p => `<option value="${p}" ${(form.priority || 'High') === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          ${injectOpts ? `<div>
            <label style="font-size:11px;font-weight:600;color:var(--muted)">Source Inject</label>
            <select id="ttAiInject" style="width:100%;padding:.35rem .6rem;border:1px solid var(--border);border-radius:6px;font-size:12px;margin-top:2px;box-sizing:border-box">
              <option value="">— Not linked —</option>
              ${injectOpts}
            </select>
          </div>` : ''}
        </div>
        <div>
          <label style="font-size:11px;font-weight:600;color:var(--muted)">Notes</label>
          <textarea id="ttAiNotes" rows="1" placeholder="Optional context or remediation steps" style="width:100%;padding:.4rem .6rem;border:1px solid var(--border);border-radius:6px;font-size:12px;font-family:inherit;resize:vertical;margin-top:2px;box-sizing:border-box">${form.notes || ''}</textarea>
        </div>
      </div>
      <div style="display:flex;gap:.5rem;margin-top:.65rem;justify-content:flex-end">
        <button class="btn btn-outline btn-sm" onclick="ttCancelActionForm()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="ttSaveActionItem()">Save</button>
      </div>
    </div>` : '';

  // Suggestion chips
  const suggestHtml = (!form && freshSuggestions.length) ? `
    <div style="margin-bottom:.75rem">
      <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.4rem">Suggested from exercise gaps</div>
      <div style="display:flex;flex-direction:column;gap:.3rem">
        ${freshSuggestions.map(s => `
          <button onclick="ttOpenActionFormSuggested(${JSON.stringify(s).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')})" style="text-align:left;font-size:11px;color:var(--navy);padding:.3rem .65rem;border:1px dashed var(--cyan);border-radius:6px;background:rgba(7,180,217,.05);cursor:pointer;font-family:inherit;line-height:1.4;white-space:normal">
            <span style="color:var(--cyan);font-weight:700;margin-right:4px">+ Add:</span>${s}
          </button>`).join('')}
      </div>
    </div>` : '';

  // Item rows
  const itemRowsHtml = sorted.length ? sorted.map(item => {
    const pushed = !!item.pushed_to_rr;
    const injectLabel = item.source_inject_idx !== null && item.source_inject_idx !== undefined && scenario
      ? ` <span style="color:var(--muted);font-weight:400"> — Inject ${item.source_inject_idx + 1}</span>` : '';
    const dueDate = item.due_date ? new Date(item.due_date + 'T00:00:00').toLocaleDateString() : null;
    const overdue = item.due_date && item.status !== 'closed' && new Date(item.due_date + 'T00:00:00') < new Date();
    return `<div style="border:1px solid var(--border);border-left:4px solid ${PRIO_COLOR[item.priority] || 'var(--muted)'};border-radius:6px;padding:.65rem .75rem;margin-bottom:.4rem">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem">
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:600;color:var(--text);line-height:1.4;margin-bottom:.3rem">${item.description}${injectLabel}</div>
          <div style="display:flex;flex-wrap:wrap;gap:.3rem;align-items:center">
            <span style="font-size:10px;font-weight:700;color:${PRIO_COLOR[item.priority]};padding:1px 7px;border:1px solid ${PRIO_COLOR[item.priority]};border-radius:4px">${item.priority}</span>
            <button onclick="ttCycleActionStatus('${item.id}','${item.status}')" style="font-size:10px;font-weight:600;color:${STAT_COLOR[item.status]};padding:1px 7px;border:1px solid ${STAT_COLOR[item.status]};border-radius:4px;background:none;cursor:pointer;font-family:inherit">${STAT_LABEL[item.status]} ↻</button>
            ${pushed ? `<span style="font-size:10px;font-weight:700;color:#15803d;padding:1px 8px;border:1px solid #15803d;border-radius:4px;background:#dcfce7">&#x2713; Risk Register</span>` : ''}
            ${item.owner ? `<span style="font-size:10px;color:var(--muted)">&#x1F464; ${item.owner}</span>` : ''}
            ${dueDate ? `<span style="font-size:10px;color:${overdue ? '#dc2626' : 'var(--muted)'}">&#x1F4C5; ${dueDate}${overdue ? ' — Overdue' : ''}</span>` : ''}
          </div>
          ${item.notes ? `<div style="font-size:11px;color:var(--muted);margin-top:.3rem;font-style:italic">${item.notes}</div>` : ''}
        </div>
        <div style="display:flex;gap:.3rem;flex-shrink:0">
          ${!pushed ? `<button class="btn btn-cyan btn-sm" onclick="ttPushToRiskRegister('${item.id}')" style="font-size:11px;padding:.2rem .6rem">&#x2192; Risk Register</button>` : ''}
          <button class="btn btn-outline btn-sm" onclick="ttEditActionItem('${item.id}')" style="font-size:11px;padding:.2rem .5rem">Edit</button>
          <button class="btn btn-red btn-sm" onclick="ttDeleteActionItem('${item.id}')" style="font-size:11px;padding:.2rem .5rem">&#x1F5D1;</button>
        </div>
      </div>
    </div>`;
  }).join('') : (!form ? `<div style="font-size:12px;color:var(--muted);font-style:italic;padding:.25rem 0">No action items yet — add items from the suggestions above or click the button.</div>` : '');

  const openCount   = items.filter(i => i.status !== 'closed').length;
  const closedCount = items.filter(i => i.status === 'closed').length;

  return `<div class="card" style="margin-bottom:.75rem">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:.5rem">
      <div>
        <div class="card-title" style="margin-bottom:.15rem">&#x1F4CB; Action Items</div>
        ${items.length ? `<div style="font-size:11px;color:var(--muted)">${openCount} open &bull; ${closedCount} closed</div>` : ''}
      </div>
      <div style="display:flex;gap:.4rem;flex-shrink:0">
        ${items.length ? `<button class="btn btn-outline btn-sm" onclick="ttExportActionItemsXlsx()" title="Export to Excel">&#x1F4C5; Export</button>` : ''}
        ${!form ? `<button class="btn btn-primary btn-sm" onclick="ttOpenActionForm()">+ Add Action Item</button>` : ''}
      </div>
    </div>
    ${formHtml}
    ${suggestHtml}
    ${itemRowsHtml}
  </div>`;
}

// ---- EXERCISE SCORING ----
function ttComputeExerciseScore() {
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  if (!scenario) return { total: 0, critScore: 0, declScore: 0, phaseScore: 0, notifScore: 0, critCorrect: 0, critTotal: 0, phasesHit: 0, phasesTotal: 0, notifChecked: 0, notifTotal: TT_NOTIF_ITEMS.length };

  // (1) Criticality accuracy — 35%
  let critTotal = 0, critCorrect = 0;
  scenario.injects.forEach((inj, idx) => {
    const r = ttState.responses[idx] || {};
    TT_ROLES.forEach(role => {
      const cr = r[role.id] && r[role.id].criticality;
      if (cr) { critTotal++; if (cr === inj.correctCriticality) critCorrect++; }
    });
  });
  const critScore = critTotal ? (critCorrect / critTotal) * 100 : 0;

  // (2) Breach declaration quality — 30% (severity 15pt + declare/monitor 15pt)
  const sevMatch = ttState.declaration.severity === scenario.declaration.correctSeverity;
  const declMatch = ttState.declaration.declare === scenario.declaration.correctDeclare;
  const declScore = ((sevMatch ? 1 : 0) + (declMatch ? 1 : 0)) * 50;

  // (3) IR phase coverage — 20%
  const phasesInScenario = new Set(scenario.injects.map(inj => inj.phaseIdx));
  const phasesWithResponses = new Set(
    scenario.injects
      .filter((inj, idx) => {
        const r = ttState.responses[idx] || {};
        return TT_ROLES.some(role => r[role.id] && (r[role.id].text || r[role.id].criticality));
      })
      .map(inj => inj.phaseIdx)
  );
  const phaseScore = phasesInScenario.size > 0
    ? (phasesWithResponses.size / phasesInScenario.size) * 100 : 100;

  // (4) Insurer notification completeness — 15%
  const notifChecked = Object.values(ttState.notifChecks).filter(n => n.checked).length;
  const notifScore = TT_NOTIF_ITEMS.length > 0
    ? (notifChecked / TT_NOTIF_ITEMS.length) * 100 : 100;

  const total = Math.max(0, Math.min(100, Math.round(
    critScore * 0.35 + declScore * 0.30 + phaseScore * 0.20 + notifScore * 0.15
  )));
  return { total, critScore: Math.round(critScore), declScore: Math.round(declScore), phaseScore: Math.round(phaseScore), notifScore: Math.round(notifScore), critCorrect, critTotal, phasesHit: phasesWithResponses.size, phasesTotal: phasesInScenario.size, notifChecked, notifTotal: TT_NOTIF_ITEMS.length, sevMatch, declMatch };
}

function ttScoreColor(score) {
  return score >= 70 ? '#15803d' : score >= 40 ? '#d97706' : '#dc2626';
}

// Semicircle dial for IRP section — larger than the home widget version
function _irpDialSvg(score, label, color) {
  const cx = 40, cy = 38, r = 28, sw = 7;
  const bgPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  let fillPath = '';
  if (typeof score === 'number' && score > 0) {
    const endRad = Math.PI * (1 - Math.min(score, 100) / 100);
    const ex = +(cx + r * Math.cos(endRad)).toFixed(2);
    const ey = +(cy - r * Math.sin(endRad)).toFixed(2);
    fillPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${ex} ${ey}`;
  }
  return `<svg viewBox="0 0 80 44" width="80" height="44" style="display:block;overflow:visible;flex-shrink:0">
    <path d="${bgPath}" fill="none" stroke="#e5e7eb" stroke-width="${sw}" stroke-linecap="round"/>
    ${fillPath ? `<path d="${fillPath}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>` : ''}
    <text x="${cx}" y="36" text-anchor="middle" font-size="16" font-weight="800" fill="${color}" font-family="Inter,sans-serif">${label}</text>
  </svg>`;
}

// ---- AAR ----
function ttRenderAAR() {
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  const totalInjects = scenario.injects.length;
  const injectsAnswered = Object.keys(ttState.responses).length;
  const sc = ttComputeExerciseScore();
  const scoreCol = ttScoreColor(sc.total);
  return `${renderTierBanner()}
  ${ttHeaderBar()}
  <div style="font-size:17px;font-weight:700;margin-bottom:0.85rem">&#x1F4C4; After Action Report — ${scenario.title}</div>

  <div class="card" style="margin-bottom:1rem;border-left:4px solid ${scoreCol}">
    <div style="display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap">
      <div style="text-align:center;min-width:72px">
        <div style="font-size:40px;font-weight:800;color:${scoreCol};line-height:1">${sc.total}</div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-top:2px">Exercise score</div>
      </div>
      <div style="flex:1;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px">
        <div style="font-size:12px"><span style="color:var(--muted)">Criticality accuracy</span><br/><b style="color:${ttScoreColor(sc.critScore)}">${sc.critScore}%</b> <span style="color:var(--muted);font-size:10px">(${sc.critCorrect}/${sc.critTotal} ratings)</span> <span style="color:var(--muted);font-size:10px">· 35% weight</span></div>
        <div style="font-size:12px"><span style="color:var(--muted)">Declaration quality</span><br/><b style="color:${ttScoreColor(sc.declScore)}">${sc.declScore}%</b> <span style="color:var(--muted);font-size:10px">(severity + declare/monitor)</span> <span style="color:var(--muted);font-size:10px">· 30% weight</span></div>
        <div style="font-size:12px"><span style="color:var(--muted)">IR phase coverage</span><br/><b style="color:${ttScoreColor(sc.phaseScore)}">${sc.phaseScore}%</b> <span style="color:var(--muted);font-size:10px">(${sc.phasesHit}/${sc.phasesTotal} phases)</span> <span style="color:var(--muted);font-size:10px">· 20% weight</span></div>
        <div style="font-size:12px"><span style="color:var(--muted)">Notification completeness</span><br/><b style="color:${ttScoreColor(sc.notifScore)}">${sc.notifScore}%</b> <span style="color:var(--muted);font-size:10px">(${sc.notifChecked}/${sc.notifTotal} filed)</span> <span style="color:var(--muted);font-size:10px">· 15% weight</span></div>
      </div>
    </div>
  </div>

  ${ttRenderRubricCard()}
  <div class="summary-metrics">
    <div class="sm-card"><div class="sm-val">${sc.critScore}%</div><div class="sm-lbl">Criticality acc.</div></div>
    <div class="sm-card"><div class="sm-val">${injectsAnswered}/${totalInjects}</div><div class="sm-lbl">Injects answered</div></div>
    <div class="sm-card"><div class="sm-val">${sc.phasesHit}/${sc.phasesTotal}</div><div class="sm-lbl">NIST phases hit</div></div>
    <div class="sm-card"><div class="sm-val">${sc.notifChecked}/${sc.notifTotal}</div><div class="sm-lbl">Notifs filed</div></div>
  </div>

  ${ttRenderMitrePath()}

  <div class="card">
    <div class="card-title">Step 0 — Declaration accuracy</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div>
        <div style="font-size:11px;color:var(--muted)">TL severity called</div>
        <div style="font-size:14px;font-weight:700">${ttState.declaration.severity || '—'}
          <span style="font-size:11px;color:${sc.sevMatch ? 'var(--green)' : 'var(--red)'};font-weight:700">${sc.sevMatch ? '&#x2713; matches' : '&#x2717; correct was ' + scenario.declaration.correctSeverity}</span>
        </div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--muted)">TL recommendation</div>
        <div style="font-size:14px;font-weight:700">${ttState.declaration.declare === null ? '—' : (ttState.declaration.declare ? 'Declare' : 'Monitor')}
          <span style="font-size:11px;color:${sc.declMatch ? 'var(--green)' : 'var(--red)'};font-weight:700">${sc.declMatch ? '&#x2713; matches' : '&#x2717; correct was ' + (scenario.declaration.correctDeclare ? 'Declare' : 'Monitor')}</span>
        </div>
      </div>
    </div>
    <div style="margin-top:8px;font-size:12px;color:var(--muted)"><b>TL written assessment:</b><br/>${ttState.declaration.assessment || '<i>not provided</i>'}</div>
  </div>

  <div class="card">
    <div class="card-title">MITRE ATT&CK mapping (revealed)</div>
    ${scenario.injects.map((inj, i) => `
      <div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div><b>Inject ${i+1}</b> — ${inj.title}</div>
        <div style="color:var(--muted);font-size:11px;margin-top:2px">${inj.mitre.tactic} · ${inj.mitre.technique}</div>
      </div>`).join('')}
  </div>

  <div class="card">
    <div class="card-title">Criticality accuracy by inject</div>
    ${scenario.injects.map((inj, i) => {
      const r = ttState.responses[i] || {};
      return `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap">
          <span><b>Inject ${i+1}</b> — ${inj.title}</span>
          <span class="badge b-navy">Correct: ${inj.correctCriticality}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:5px">
          ${TT_ROLES.map(role => {
            const cr = r[role.id] && r[role.id].criticality;
            if (!cr) return `<span style="font-size:10px;color:var(--muted)">${role.icon} ${role.id.toUpperCase()}: —</span>`;
            const ok = cr === inj.correctCriticality;
            return `<span class="badge ${ok ? 'b-green' : 'b-red'}">${role.icon} ${role.id.toUpperCase()}: ${cr}${ok ? ' &#x2713;' : ' &#x2717;'}</span>`;
          }).join(' ')}
        </div>
      </div>`;
    }).join('')}
  </div>

  <div class="card">
    <div class="card-title">Breach declaration record</div>
    ${ttState.breach.declared ? `
      <div style="font-size:12px;line-height:1.6">
        <div><b>Declared:</b> ${new Date(ttState.notifStartTime).toLocaleString()}</div>
        <div><b>IC signed:</b> ${new Date(ttState.breach.ic_sign_time).toLocaleString()}</div>
        <div><b>ES signed:</b> ${new Date(ttState.breach.es_sign_time).toLocaleString()}</div>
        <div style="margin-top:6px"><b>Rationale:</b> ${ttState.breach.rationale}</div>
      </div>` : `<div style="font-size:12px;color:var(--muted)">No formal breach was declared during this exercise.</div>`}
  </div>

  <div class="card">
    <div class="card-title">Insurer / regulatory notifications</div>
    ${TT_NOTIF_ITEMS.map(it => {
      const c = ttState.notifChecks[it.id];
      return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-size:14px">${c && c.checked ? '&#x2705;' : '&#x2B1C;'}</span>
        <span style="flex:1">${it.label}</span>
        <span style="font-size:11px;color:var(--muted)">${c && c.checked && c.checkedAt ? new Date(c.checkedAt).toLocaleTimeString() : 'Not filed'}</span>
      </div>`;
    }).join('')}
  </div>

  <div class="card">
    <div class="card-title">Full event timeline</div>
    ${ttState.exerciseLog.length ? ttState.exerciseLog.map(e => `
      <div class="aar-log-item">
        <div>${new Date(e.ts).toLocaleTimeString()}</div>
        <div style="color:var(--muted);text-transform:uppercase;font-size:10px;letter-spacing:0.06em">${e.type}</div>
        <div>${ttFmtLogDetail(e.type, e.detail)}</div>
      </div>`).join('') : '<div style="font-size:12px;color:var(--muted)">No log entries.</div>'}
  </div>

  ${ttRenderIrpSection(ttState.sessionId, ttState.irComparison, true)}

  ${ttRenderActionItems()}

  ${ttState.readonly ? `
  <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
    <button class="btn btn-outline" onclick="setNav('scenario_library')">← Back to Exercises</button>
    <button class="btn btn-primary" onclick="ttSaveAAR()">&#x1F4BE; Save AAR</button>
  </div>` : `
  <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
    <button class="btn btn-outline" onclick="ttFinalise()">Mark exercise complete</button>
    <button class="btn btn-primary" onclick="ttSaveAAR()">&#x1F4BE; Save AAR</button>
    <button class="btn btn-cyan" onclick="ttRestart()">Start new exercise</button>
  </div>`}`;
}

async function ttSaveAAR() {
  const sessionId = ttState.sessionId;
  if (!sessionId) { toast('No session to save to', '#dc2626'); return; }
  const patch = { updated_at: new Date().toISOString() };

  // Capture rubric if complete
  tteRubricDimensions().forEach(d => {
    const el = document.getElementById('ttRubric_' + d.id);
    const existing = tteGetRubric()[d.id];
    if (el && existing && existing.score) tteSetRubricScore(d.id, existing.score, el.value);
  });
  if (tteRubricComplete()) {
    patch.rubric_scores = tteGetRubric();
  }

  // Capture IR comparison paste if present
  const irEl = document.getElementById('irpPasteArea');
  if (irEl && irEl.value.trim()) {
    try {
      let raw = irEl.value.trim();
      const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fence) raw = fence[1].trim();
      patch.ir_comparison = JSON.parse(raw);
    } catch(e) {
      toast('IR comparison JSON is invalid — fix it or clear the field before saving', '#dc2626');
      return;
    }
  }

  try {
    await sb.tt.updateSession(sessionId, patch);
    if (patch.rubric_scores) {
      ttState.irComparison = patch.ir_comparison ?? ttState.irComparison;
    }
    if (patch.ir_comparison) {
      ttState.irComparison = patch.ir_comparison;
    }
    ttState._rubricEditing = false;
    ttRender();
    toast('AAR saved', '#15803d');
    await auditLog('tabletop_aar_saved', { session_id: sessionId, rubric: !!patch.rubric_scores, ir_comparison: !!patch.ir_comparison });
  } catch(e) {
    toast('Save failed — ' + e.message, '#dc2626');
  }
}

async function ttFinalise() {
  if (!ttState || !ttState.sessionId) { toast('No active session', '#dc2626'); return; }
  try {
    const sc = ttComputeExerciseScore();
    await sb.tt.updateSession(ttState.sessionId, {
      status: 'complete',
      notif_filed: Object.values(ttState.notifChecks).some(n => n.checked),
      exercise_score: sc.total,
      updated_at: new Date().toISOString(),
    });
    await ttLog('exercise_complete', { totalInjects: (tteState.scenario || TT_SCENARIOS[ttState.scenarioId]).injects.length, exercise_score: sc.total });
    toast('Exercise marked complete — score: ' + sc.total + '/100', '#15803d');
  } catch (e) { toast('Save failed — ' + e.message, '#dc2626'); }
}

function ttRestart() { ttInit(); ttRender(); }

// ---- EXERCISE HISTORY ----

function ttRenderHistoryList() {
  if (!currentOrg) return '';
  // Trigger load if not yet fetched
  if (ttState.completedSessions === null) {
    ttEnsureHistory();
    return '';
  }
  const sessions = ttState.completedSessions;
  if (!sessions.length) return '';

  return `<div style="margin-top:1.5rem">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:0.75rem">Past exercises</div>
    ${sessions.map(s => {
      const scenario = TT_SCENARIOS[s.scenario_id];
      const date = s.created_at ? new Date(s.created_at).toLocaleDateString('en-CA') : '—';
      const sev = s.tl_severity || '—';
      const sevColor = sev === 'P1' ? '#dc2626' : sev === 'P2' ? '#d97706' : '#5a6a8a';
      const breachBadge = s.breach_declared
        ? `<span class="badge b-red">Breach declared</span>`
        : `<span class="badge b-gray">No breach</span>`;
      const logLen = Array.isArray(s.exercise_log) ? s.exercise_log.length : 0;
      const hasScore = typeof s.exercise_score === 'number';
      const scoreCol = hasScore ? ttScoreColor(s.exercise_score) : '#5a6a8a';
      return `<div class="card" style="margin-bottom:0.5rem;padding:0.85rem 1rem">
        <div style="display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap">
          ${hasScore ? `<div style="text-align:center;min-width:52px;padding-top:2px"><div style="font-size:22px;font-weight:800;color:${scoreCol};line-height:1">${s.exercise_score}</div><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted)">score</div></div>` : ''}
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:3px">${s.scenario_title || scenario?.title || s.scenario_id}</div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:6px">${date} · ${s.facilitator_name || '—'} · Code: <code style="font-size:10px;background:#f0f4fa;padding:1px 4px;border-radius:3px">${s.session_code}</code></div>
            <div style="display:flex;gap:5px;flex-wrap:wrap">
              <span class="badge" style="background:${sevColor};color:#fff">${sev}</span>
              ${s.tl_declare ? `<span class="badge b-red">Declared</span>` : `<span class="badge b-gray">Monitor</span>`}
              ${breachBadge}
              ${s.notif_filed ? `<span class="badge b-green">Notifications filed</span>` : ''}
              <span class="badge b-navy">${logLen} log entries</span>
            </div>
          </div>
          <button class="btn btn-sm btn-outline" onclick="ttViewHistoricalAAR('${s.id}')">View AAR →</button>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

async function ttEnsureHistory() {
  if (!currentOrg || ttState.completedSessions !== null) return;
  try {
    ttState.completedSessions = await sb.tt.listCompletedForOrg(currentOrg.id);
  } catch(e) {
    ttState.completedSessions = [];
  }
  ttRender();
}

function ttViewHistoricalAAR(sessionId) {
  const session = (ttState.completedSessions || []).find(s => s.id === sessionId);
  if (!session) return;
  ttState.historicalSession = session;
  ttState.view = 'history_aar';
  ttState._rubricEditing = false;
  // Preload any saved rubric scores into engine state so the card renders correctly
  tteClearRubric();
  if (session.rubric_scores && typeof session.rubric_scores === 'object') {
    Object.entries(session.rubric_scores).forEach(([dimId, data]) => {
      if (data && data.score) tteSetRubricScore(dimId, data.score, data.notes || '');
    });
  }
  ttRender();
}

function ttRenderHistoryAAR() {
  const s = ttState.historicalSession;
  if (!s) return '<div class="card">Session not found.</div>';
  const scenario = TT_SCENARIOS[s.scenario_id];
  const date = s.created_at ? new Date(s.created_at).toLocaleDateString('en-CA') : '—';
  const sev = s.tl_severity || '—';
  const sevColor = sev === 'P1' ? '#dc2626' : sev === 'P2' ? '#d97706' : '#5a6a8a';
  const sevMatch = scenario && sev === scenario.declaration?.correctSeverity;
  const declareMatch = scenario && (s.tl_declare === scenario.declaration?.correctDeclare);
  const log = Array.isArray(s.exercise_log) ? s.exercise_log : (typeof s.exercise_log === 'string' ? JSON.parse(s.exercise_log) : []);

  return `${renderTierBanner()}
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:0.85rem;flex-wrap:wrap">
    <button class="btn btn-sm btn-outline" onclick="ttState.view='setup';ttRender()">← Back</button>
    <div style="font-size:17px;font-weight:700">After Action Report</div>
  </div>

  <div class="commentary-card" style="margin-bottom:1rem">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan2);margin-bottom:6px">Historical record · ${date}</div>
    <div style="font-size:15px;color:#fff;font-weight:700;margin-bottom:4px">${s.scenario_title || scenario?.title || s.scenario_id}</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.6)">Facilitator: ${s.facilitator_name || '—'} · Session code: <strong style="color:rgba(255,255,255,0.85)">${s.session_code}</strong></div>
  </div>

  <div class="summary-metrics" style="margin-bottom:1rem">
    ${typeof s.exercise_score === 'number' ? `<div class="sm-card"><div class="sm-val" style="color:${ttScoreColor(s.exercise_score)}">${s.exercise_score}</div><div class="sm-lbl">Exercise score</div></div>` : ''}
    <div class="sm-card">
      <div class="sm-val" style="color:${sevColor}">${sev}</div>
      <div class="sm-lbl">Severity called${scenario ? (sevMatch ? ' ✓' : ' ✗') : ''}</div>
    </div>
    <div class="sm-card">
      <div class="sm-val">${s.tl_declare ? 'Declare' : 'Monitor'}</div>
      <div class="sm-lbl">TL decision${scenario ? (declareMatch ? ' ✓' : ' ✗') : ''}</div>
    </div>
    <div class="sm-card">
      <div class="sm-val" style="color:${s.breach_declared ? '#dc2626' : '#15803d'}">${s.breach_declared ? 'Yes' : 'No'}</div>
      <div class="sm-lbl">Breach declared</div>
    </div>
    <div class="sm-card">
      <div class="sm-val">${log.length}</div>
      <div class="sm-lbl">Log entries</div>
    </div>
  </div>

  <div class="card" style="margin-bottom:0.75rem">
    <div class="card-title">Step 0 — Technical Lead assessment</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px">
      <div>
        <div style="font-size:11px;color:var(--muted)">Severity called</div>
        <div style="font-size:14px;font-weight:700;color:${sevColor}">${sev}
          ${scenario ? `<span style="font-size:11px;font-weight:700;color:${sevMatch ? '#15803d' : '#dc2626'}">${sevMatch ? '✓ correct' : '✗ correct: ' + scenario.declaration.correctSeverity}</span>` : ''}
        </div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--muted)">Decision</div>
        <div style="font-size:14px;font-weight:700">${s.tl_declare ? 'Declare' : 'Monitor'}
          ${scenario ? `<span style="font-size:11px;font-weight:700;color:${declareMatch ? '#15803d' : '#dc2626'}">${declareMatch ? '✓ correct' : '✗ correct: ' + (scenario.declaration.correctDeclare ? 'Declare' : 'Monitor')}</span>` : ''}
        </div>
      </div>
    </div>
    ${s.tl_assessment ? `<div style="font-size:12px;color:var(--muted);line-height:1.5;border-top:1px solid var(--border);padding-top:8px"><b>Written assessment:</b><br/>${s.tl_assessment}</div>` : ''}
  </div>

  ${s.breach_declared ? `<div class="card" style="margin-bottom:0.75rem">
    <div class="card-title">Breach declaration record</div>
    <div style="font-size:12px;line-height:1.8">
      <div><b>Declared:</b> ${s.breach_timestamp ? new Date(s.breach_timestamp).toLocaleString() : '—'}</div>
      ${s.ic_sign_time ? `<div><b>IC signed:</b> ${new Date(s.ic_sign_time).toLocaleString()}</div>` : ''}
      ${s.es_sign_time ? `<div><b>ES signed:</b> ${new Date(s.es_sign_time).toLocaleString()}</div>` : ''}
      ${s.breach_rationale ? `<div style="margin-top:6px"><b>Rationale:</b> ${s.breach_rationale}</div>` : ''}
    </div>
  </div>` : ''}

  ${scenario ? `<div class="card" style="margin-bottom:0.75rem">
    <div class="card-title">MITRE ATT&CK mapping</div>
    ${scenario.injects.map((inj, i) => `
      <div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div><b>Inject ${i+1}</b> — ${inj.title}</div>
        <div style="color:var(--muted);font-size:11px;margin-top:2px">${inj.mitre.tactic} · ${inj.mitre.technique}</div>
      </div>`).join('')}
  </div>` : ''}

  ${ttRenderRubricCard()}

  <div class="card">
    <div class="card-title">Exercise timeline</div>
    ${log.length ? log.map(e => {
      // Handle both seed format {time, role, action} and live format {ts, type, detail}
      const timeStr = e.time || (e.ts ? new Date(e.ts).toLocaleTimeString() : '—');
      const roleStr = e.role || e.type || '';
      const actionStr = e.action || ttFmtLogDetail(e.type || e.role, e.detail);
      return `<div class="aar-log-item">
        <div style="font-weight:600;white-space:nowrap">${timeStr}</div>
        <div style="color:var(--muted);text-transform:uppercase;font-size:10px;letter-spacing:0.06em;white-space:nowrap">${roleStr}</div>
        <div style="font-size:12px">${actionStr}</div>
      </div>`;
    }).join('') : '<div style="font-size:12px;color:var(--muted)">No log entries recorded.</div>'}
  </div>

  ${ttRenderIrpSection(s.id, s.ir_comparison || null, false)}`;
}

// ---- Event log formatting ----
function ttFmtLogDetail(type, detail) {
  const d = (typeof detail === 'object' && detail !== null) ? detail : {};
  const NOTIF_LABELS = {
    carrier:  'Cyber insurance carrier',
    counsel:  'Outside cyber counsel',
    irfirm:   'Forensic IR firm',
    le:       'Law enforcement (FBI / IC3)',
    opc:      'FTC (federal privacy)',
    oipc:     'State Attorney General',
    pci:      'Card networks (PCI DSS)',
    affected: 'Affected individuals notification',
  };
  switch ((type || '').toLowerCase()) {
    case 'session_created':
      return `Started — ${d.scenario || ''}${d.facilitator ? ' · Facilitator: ' + d.facilitator : ''}${d.code ? ' · Code: ' + d.code : ''}`;
    case 'declaration':
      return `TL called ${d.severity || '—'} · ${d.declare ? 'Recommend Declare' : 'Recommend Monitor'}`;
    case 'inject_responses_saved':
      return `Inject ${(d.inject != null ? d.inject : d.inject_index) != null ? (d.inject != null ? d.inject : d.inject_index) + 1 : '—'} responses saved${d.branch ? ' (branch: ' + d.branch + ')' : ''}`;
    case 'breach_declared':
      return `Breach declared${d.rationale ? ' — ' + d.rationale : ''}`;
    case 'notif_toggle':
      return `${d.checked ? '✓ Filed' : '✗ Unfiled'}: ${NOTIF_LABELS[d.item] || d.item || '—'}`;
    case 'exercise_complete':
      return `Exercise completed — ${d.totalInjects || '—'} injects${d.exercise_score != null ? ' · Score: ' + d.exercise_score + '/100' : ''}`;
    case 'rubric_scored':
      return `Facilitator rubric scored — ${d.grade || '—'}${d.pct != null ? ' (' + d.pct + '%)' : ''}`;
    default:
      return typeof detail === 'object' ? JSON.stringify(detail) : (detail || '');
  }
}

// ---- IR Plan Comparison ----

function ttBuildIrpPrompt() {
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  if (!scenario) return '';
  const sc = ttComputeExerciseScore();
  const logText = ttState.exerciseLog.length
    ? ttState.exerciseLog.map(e => {
        const t = new Date(e.ts).toLocaleTimeString();
        const d = typeof e.detail === 'object' ? JSON.stringify(e.detail) : (e.detail || '');
        return `[${t}] ${e.type}: ${d}`;
      }).join('\n')
    : 'No log entries recorded.';
  const breachText = ttState.breach.declared
    ? `Breach declared at ${new Date(ttState.notifStartTime).toLocaleString()}. Rationale: ${ttState.breach.rationale}`
    : 'No breach declared during this exercise.';
  const notifText = TT_NOTIF_ITEMS.map(it => {
    const c = ttState.notifChecks[it.id];
    return `${c && c.checked ? '✓' : '✗'} ${it.label}`;
  }).join('\n');
  return ttBuildIrpPromptText({
    scenarioTitle: scenario.title,
    scenarioSummary: scenario.summary,
    date: new Date().toLocaleDateString('en-CA'),
    score: `${sc.total}/100\n- Criticality accuracy: ${sc.critScore}% (${sc.critCorrect}/${sc.critTotal} ratings correct, 35% weight)\n- Declaration quality: ${sc.declScore}% (30% weight)\n- IR phase coverage: ${sc.phaseScore}% (${sc.phasesHit}/${sc.phasesTotal} phases, 20% weight)\n- Notification completeness: ${sc.notifScore}% (${sc.notifChecked}/${sc.notifTotal} items, 15% weight)`,
    severity: `${ttState.declaration.severity || 'not set'} (correct: ${scenario.declaration.correctSeverity} — ${sc.sevMatch ? 'correct' : 'incorrect'})`,
    decision: `${ttState.declaration.declare === null ? 'not set' : (ttState.declaration.declare ? 'Declare' : 'Monitor')} (correct: ${scenario.declaration.correctDeclare ? 'Declare' : 'Monitor'} — ${sc.declMatch ? 'correct' : 'incorrect'})`,
    assessment: ttState.declaration.assessment || 'none provided',
    breach: breachText,
    notif: notifText,
    log: logText,
  });
}

function ttBuildIrpPromptFromSession(s) {
  const scenario = TT_SCENARIOS[s.scenario_id];
  const log = Array.isArray(s.exercise_log) ? s.exercise_log : [];
  const logText = log.length
    ? log.map(e => {
        const t = e.time || (e.ts ? new Date(e.ts).toLocaleTimeString() : '—');
        const role = e.role || e.type || '';
        const action = e.action || (typeof e.detail === 'object' ? JSON.stringify(e.detail) : (e.detail || ''));
        return `[${t}] ${role}: ${action}`;
      }).join('\n')
    : 'No log entries recorded.';
  const breachText = s.breach_declared
    ? `Breach declared${s.breach_timestamp ? ' at ' + new Date(s.breach_timestamp).toLocaleString() : ''}${s.breach_rationale ? '. Rationale: ' + s.breach_rationale : ''}`
    : 'No breach declared during this exercise.';
  const sevMatch = scenario && s.tl_severity === scenario.declaration?.correctSeverity;
  const declMatch = scenario && s.tl_declare === scenario.declaration?.correctDeclare;
  return ttBuildIrpPromptText({
    scenarioTitle: scenario?.title || s.scenario_title || s.scenario_id,
    scenarioSummary: scenario?.summary || '',
    date: s.created_at ? new Date(s.created_at).toLocaleDateString('en-CA') : '—',
    score: typeof s.exercise_score === 'number' ? `${s.exercise_score}/100` : 'not recorded',
    severity: `${s.tl_severity || 'not recorded'}${scenario ? ` (correct: ${scenario.declaration.correctSeverity} — ${sevMatch ? 'correct' : 'incorrect'})` : ''}`,
    decision: `${s.tl_declare == null ? 'not recorded' : (s.tl_declare ? 'Declare' : 'Monitor')}${scenario ? ` (correct: ${scenario.declaration.correctDeclare ? 'Declare' : 'Monitor'} — ${declMatch ? 'correct' : 'incorrect'})` : ''}`,
    assessment: s.tl_assessment || 'none provided',
    breach: breachText,
    notif: 'Notification checklist data not available in historical view.',
    log: logText,
  });
}

function ttBuildIrpPromptText(d) {
  return `You are a senior cybersecurity consultant and vCISO providing post-exercise analysis for a client's incident response capability.

Below is the output from a tabletop exercise conducted through Abbott Cyber GRC. Following the exercise data, you will find the client's documented Incident Response Plan.

Your task is to evaluate two things:
A) How closely did the team follow their own documented IR plan during the exercise?
B) How well does the IR plan itself align with NIST SP 800-61 Rev 2 (Computer Security Incident Handling Guide)?

Be balanced and constructive. The goal is not to score the team harshly — it is to identify whether the plan was useful, whether it was followed, and where it needs strengthening.

## Exercise Data

**Scenario:** ${d.scenarioTitle}
${d.scenarioSummary}

**Date:** ${d.date}
**Exercise Score:** ${d.score}

**Step 0 — Technical Lead Declaration**
- Severity assigned: ${d.severity}
- Decision: ${d.decision}
- Written assessment: ${d.assessment}

**Breach Declaration**
${d.breach}

**Insurer/Regulatory Notifications**
${d.notif}

**Exercise Event Log**
${d.log}

---

## Response Format

Return ONLY a valid JSON object. No markdown fences, no prose, no explanation — just the raw JSON:

{
  "follows_plan_score": <integer 0-100>,
  "follows_plan_summary": "<2-3 sentences on how well the team followed their documented plan, noting where they diverged or where the plan was silent>",
  "nist_alignment_score": <integer 0-100>,
  "nist_alignment_summary": "<2-3 sentences on how well the IR plan aligns to NIST SP 800-61 phases: Preparation, Detection & Analysis, Containment/Eradication/Recovery, Post-Incident Activity>",
  "strengths": ["<observed strength>", ...],
  "gaps": ["<gap or improvement area>", ...]
}

---

## Client Incident Response Plan

[PASTE YOUR IR PLAN BELOW THIS LINE]
`;
}

function ttRenderIrpSection(sessionId, saved, isLive) {
  if (!sessionId) return '';

  if (saved && typeof saved === 'object') {
    const fpScore   = saved.follows_plan_score    ?? 0;
    const nistScore = saved.nist_alignment_score  ?? 0;
    const fpGrade   = exGrade(fpScore);
    const nistGrade = exGrade(nistScore);
    const strengthsHtml = Array.isArray(saved.strengths) && saved.strengths.length
      ? saved.strengths.map(s => `<div style="display:flex;gap:6px;font-size:12px;margin-bottom:5px"><span style="color:#15803d;flex-shrink:0;margin-top:1px">&#x2713;</span><span>${escH(s)}</span></div>`).join('')
      : '<div style="font-size:12px;color:var(--muted)">None noted.</div>';
    const gapsHtml = Array.isArray(saved.gaps) && saved.gaps.length
      ? saved.gaps.map(g => `<div style="display:flex;gap:6px;font-size:12px;margin-bottom:5px"><span style="color:#d97706;flex-shrink:0;margin-top:1px">&#x26A0;</span><span>${escH(g)}</span></div>`).join('')
      : '<div style="font-size:12px;color:var(--muted)">None noted.</div>';
    return `<div class="card" style="margin-bottom:0.75rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
        <div class="card-title" style="margin:0">&#x1F4CB; IR Plan Comparison</div>
        <button class="btn btn-outline btn-sm" onclick="ttIrpClearResult('${sessionId}',${isLive})">Re-paste &#x21BA;</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div style="padding:0.85rem;background:var(--bg);border-radius:8px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted);margin-bottom:10px">Follows Own Plan</div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            ${_irpDialSvg(fpScore, fpGrade.letter, fpGrade.color)}
            <div style="line-height:1"><span style="font-size:24px;font-weight:800;color:${fpGrade.color}">${fpScore}</span><span style="font-size:13px;font-weight:600;color:var(--muted)">/100</span></div>
          </div>
          <div style="font-size:11px;color:var(--muted);line-height:1.55">${escH(saved.follows_plan_summary || '')}</div>
        </div>
        <div style="padding:0.85rem;background:var(--bg);border-radius:8px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted);margin-bottom:10px">NIST 800-61 Alignment</div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            ${_irpDialSvg(nistScore, nistGrade.letter, nistGrade.color)}
            <div style="line-height:1"><span style="font-size:24px;font-weight:800;color:${nistGrade.color}">${nistScore}</span><span style="font-size:13px;font-weight:600;color:var(--muted)">/100</span></div>
          </div>
          <div style="font-size:11px;color:var(--muted);line-height:1.55">${escH(saved.nist_alignment_summary || '')}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">Strengths</div>
          ${strengthsHtml}
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">Gaps</div>
          ${gapsHtml}
        </div>
      </div>
    </div>`;
  }

  return `<div class="card" style="margin-bottom:0.75rem">
    <div class="card-title">&#x1F4CB; IR Plan Comparison</div>
    <div style="font-size:12px;color:var(--muted);line-height:1.6;margin-bottom:0.85rem">Compare this exercise against the client's documented IR plan and NIST SP 800-61. Copy the prompt, take it to Claude with the IR plan pasted below it, then paste the JSON response back here.</div>
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:0.85rem">
      <button class="btn btn-cyan btn-sm" onclick="ttCopyIrpPrompt(${isLive})">&#x1F4CB; Copy Prompt for Claude</button>
      <span style="font-size:11px;color:var(--muted)">1. Copy prompt &rarr; 2. Paste into Claude with your IR plan &rarr; 3. Paste JSON response below</span>
    </div>
    <textarea id="irpPasteArea" placeholder="Paste Claude's JSON response here&hellip;" rows="6"
      style="width:100%;box-sizing:border-box;padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:12px;font-family:monospace;color:var(--text);resize:vertical;outline:none"
      onfocus="this.style.borderColor='var(--cyan)'" onblur="this.style.borderColor='var(--border)'"></textarea>
    <div style="display:flex;justify-content:flex-end;margin-top:8px">
      <button class="btn btn-primary btn-sm" onclick="ttSaveIrComparison('${sessionId}',${isLive})">Save Comparison</button>
    </div>
  </div>`;
}

function ttCopyIrpPrompt(isLive) {
  const prompt = isLive ? ttBuildIrpPrompt() : ttBuildIrpPromptFromSession(ttState.historicalSession);
  if (!prompt) { toast('Could not build prompt — session data missing', '#dc2626'); return; }
  navigator.clipboard.writeText(prompt)
    .then(() => toast('Prompt copied to clipboard', '#15803d'))
    .catch(() => toast('Copy failed — please select the prompt text manually', '#dc2626'));
}

async function ttSaveIrComparison(sessionId, isLive) {
  const el = document.getElementById('irpPasteArea');
  if (!el || !el.value.trim()) { toast('Paste the Claude JSON response first', '#d97706'); return; }
  let parsed;
  try {
    let raw = el.value.trim();
    const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) raw = fence[1].trim();
    parsed = JSON.parse(raw);
  } catch(e) {
    toast('Invalid JSON — check the pasted response and try again', '#dc2626');
    return;
  }
  try {
    await sb.tt.updateSession(sessionId, { ir_comparison: parsed });
    if (isLive) {
      ttState.irComparison = parsed;
    } else {
      if (ttState.historicalSession) ttState.historicalSession.ir_comparison = parsed;
    }
    ttRender();
    toast('IR plan comparison saved', '#15803d');
    await auditLog('tabletop_ir_comparison_saved', { session_id: sessionId });
  } catch(e) {
    toast('Save failed — ' + e.message, '#dc2626');
  }
}

async function ttIrpClearResult(sessionId, isLive) {
  try {
    await sb.tt.updateSession(sessionId, { ir_comparison: null });
    if (isLive) {
      ttState.irComparison = null;
    } else {
      if (ttState.historicalSession) ttState.historicalSession.ir_comparison = null;
    }
    ttRender();
  } catch(e) {
    toast('Could not clear — ' + e.message, '#dc2626');
  }
}

// ---- Excel export ----
function ttLoadXlsxScript(src) {
  return new Promise((resolve, reject) => {
    if (typeof XLSX !== 'undefined') { resolve(); return; }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) { existing.addEventListener('load', resolve); existing.addEventListener('error', () => reject(new Error('load failed'))); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = () => reject(new Error('load failed'));
    document.head.appendChild(s);
  });
}

async function ttEnsureXLSX() {
  if (typeof XLSX !== 'undefined') return;
  for (const url of ['js/xlsx.full.min.js', 'https://cdn.jsdelivr.net/npm/xlsx@0.20.3/dist/xlsx.full.min.js', 'https://unpkg.com/xlsx@0.20.3/dist/xlsx.full.min.js']) {
    try { await ttLoadXlsxScript(url); if (typeof XLSX !== 'undefined') return; } catch(e) {}
  }
  throw new Error('Could not load Excel library — check your internet connection');
}

async function ttExportActionItemsXlsx() {
  const items = ttState.actionItems;
  if (!items || !items.length) { toast('No action items to export', '#ea580c'); return; }
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  const scenarioTitle = (scenario && scenario.title) || 'Tabletop Exercise';
  const today = new Date().toISOString().split('T')[0];
  const orgName = (currentOrg && currentOrg.name) || 'Organization';
  const STAT_LABEL = { open: 'Open', in_progress: 'In Progress', closed: 'Closed' };
  try {
    await ttEnsureXLSX();
    const wb = XLSX.utils.book_new();
    const aoa = [
      ['TABLETOP EXERCISE — ACTION ITEMS', '', '', '', '', '', '', ''],
      ['Organization:', orgName, '', 'Scenario:', scenarioTitle, '', 'Exported:', today],
      ['Facilitator:', ttState.facilitatorName || '—', '', 'Total Items:', items.length, '', '', ''],
      [],
      ['#', 'Description', 'Priority', 'Status', 'Owner', 'Due Date', 'Source Inject', 'In Risk Register'],
    ];
    const PRIO_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    const sorted = [...items].sort((a, b) => (PRIO_ORDER[a.priority] ?? 9) - (PRIO_ORDER[b.priority] ?? 9));
    sorted.forEach((item, i) => {
      const injectLabel = item.source_inject_idx !== null && item.source_inject_idx !== undefined && scenario
        ? `Inject ${item.source_inject_idx + 1}: ${scenario.injects[item.source_inject_idx]?.title || ''}`
        : '';
      aoa.push([
        i + 1,
        item.description,
        item.priority,
        STAT_LABEL[item.status] || item.status,
        item.owner || '',
        item.due_date || '',
        injectLabel,
        item.pushed_to_rr ? 'Yes' : 'No',
      ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = [
      { wch: 4 }, { wch: 52 }, { wch: 10 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 38 }, { wch: 16 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Action Items');
    const slug = orgName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    XLSX.writeFile(wb, `ActionItems_${slug}_${today}.xlsx`);
    toast('Action items exported', '#15803d');
  } catch(e) { toast('Export failed: ' + e.message, '#dc2626'); }
}

// ---- Window exports ----
window.ttPlaybackNext = ttPlaybackNext;
window.ttPlaybackPrev = ttPlaybackPrev;
window.ttOpenActionForm = ttOpenActionForm;
window.ttOpenActionFormSuggested = ttOpenActionFormSuggested;
window.ttCancelActionForm = ttCancelActionForm;
window.ttEditActionItem = ttEditActionItem;
window.ttSaveActionItem = ttSaveActionItem;
window.ttDeleteActionItem = ttDeleteActionItem;
window.ttCycleActionStatus = ttCycleActionStatus;
window.ttPushToRiskRegister = ttPushToRiskRegister;
window.ttExportActionItemsXlsx = ttExportActionItemsXlsx;
window.ttSetLobbyTimer = ttSetLobbyTimer;
window.ttSetInjectTimer = ttSetInjectTimer;
window.ttSetTimerMult = ttSetTimerMult;
window.ttAutoLaunchNow = ttAutoLaunchNow;
window.ttGoHome = ttGoHome;
window.ttSaveAAR = ttSaveAAR;
window.ttCopyIrpPrompt = ttCopyIrpPrompt;
window.ttSaveIrComparison = ttSaveIrComparison;
window.ttIrpClearResult = ttIrpClearResult;

