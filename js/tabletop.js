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
    view: 'setup',                     // setup | commentary | declaration | inject | breach | notif | aar | history_aar
    scenarioId: null,
    facilitatorName: '',
    mode: 'local',                     // 'local' (one screen) | 'remote' (session code + participant devices)
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
    case 'setup':       return ttRenderSetup();
    case 'commentary':  return ttRenderCommentary();
    case 'declaration': return ttRenderDeclaration();
    case 'inject':      return ttRenderInject();
    case 'breach':      return ttRenderBreachGate();
    case 'notif':       return ttRenderNotif();
    case 'aar':         return ttRenderAAR();
    case 'history_aar': return ttRenderHistoryAAR();
    default:            return '<div class="card">Unknown tabletop view.</div>';
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
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
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

async function ttLaunchSession() {
  ttSnapshot();
  if (!currentOrg) { toast('Select an organization first', '#dc2626'); return; }
  if (!ttState.scenarioId) { toast('Pick a scenario', '#dc2626'); return; }
  if (!ttState.facilitatorName.trim()) { toast('Enter facilitator name', '#dc2626'); return; }
  // Load scenario through engine (DB first, then built-in fallback)
  const scenario = await tteLoadScenario(ttState.scenarioId) || TT_SCENARIOS[ttState.scenarioId];
  if (!scenario) { toast('Scenario not found', '#dc2626'); return; }
  tteInitEngine(scenario, ttState.mode);
  try {
    const code = await sb.tt.newCode();
    if (!code) throw new Error('Session code RPC returned empty');
    const created = await sb.tt.createSession({
      org_id: currentOrg.id,
      scenario_id: scenario.id,
      scenario_title: scenario.title,
      session_code: code,
      status: 'active',
      facilitator_name: ttState.facilitatorName.trim(),
      current_inject: 0,
      exercise_log: [],
      mode: ttState.mode,
      inject_path: [],
    });
    ttState.sessionId = created.id;
    ttState.sessionCode = created.session_code;
    ttState.view = 'commentary';
    await ttLog('session_created', { code: created.session_code, scenario: scenario.title, facilitator: ttState.facilitatorName });
    toast('Session ' + created.session_code + ' created', '#15803d');
    ttStartFacPoll();
    ttRender();
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

  const injectPath = tteState.injectPath || [];

  // For sessions without path data, show a placeholder
  if (injectPath.length === 0) {
    return `<div class="card">
      <div class="card-title">&#x2694;&#xFE0F; MITRE ATT&CK Path Map</div>
      <div style="font-size:12px;color:var(--muted);padding:.5rem 0">Path data is not available for this session. Path tracking was added in a later platform version — future sessions will display the full attack chain here.</div>
    </div>`;
  }

  // Build the ordered sequence of inject indices the team visited
  const displayPath = injectPath.map(p => p.index);
  const lastStep = injectPath[injectPath.length - 1];
  const lastInj = scenario.injects[lastStep.index];
  const lastBranch = lastInj && lastInj.branches
    ? (lastInj.branches.find(b => b.id === lastStep.branchTaken) || lastInj.branches[0])
    : null;
  if (lastBranch && lastBranch.next_index != null) displayPath.push(lastBranch.next_index);

  const visitedSet = new Set(displayPath);
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
    <div class="card-title">&#x2694;&#xFE0F; MITRE ATT&CK Path Map</div>
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

// ---- AAR ----
function ttRenderAAR() {
  const scenario = tteState.scenario || TT_SCENARIOS[ttState.scenarioId];
  const totalInjects = scenario.injects.length;
  const injectsAnswered = Object.keys(ttState.responses).length;
  let critTotal = 0, critCorrect = 0;
  scenario.injects.forEach((inj, idx) => {
    const r = ttState.responses[idx] || {};
    TT_ROLES.forEach(role => {
      const cr = r[role.id] && r[role.id].criticality;
      if (cr) { critTotal++; if (cr === inj.correctCriticality) critCorrect++; }
    });
  });
  const critAccPct = critTotal ? Math.round(critCorrect / critTotal * 100) : 0;
  const sevMatch = ttState.declaration.severity === scenario.declaration.correctSeverity;
  const declMatch = ttState.declaration.declare === scenario.declaration.correctDeclare;
  const notifChecked = Object.values(ttState.notifChecks).filter(n => n.checked).length;
  // Composite score: severity match (25) + declare match (25) + criticality accuracy (50)
  const score = Math.round((sevMatch ? 25 : 0) + (declMatch ? 25 : 0) + (critAccPct * 0.5));
  return `${renderTierBanner()}
  ${ttHeaderBar()}
  <div style="font-size:17px;font-weight:700;margin-bottom:0.85rem">&#x1F4C4; After Action Report — ${scenario.title}</div>
  ${ttRenderRubricCard()}
  <div class="summary-metrics">
    <div class="sm-card"><div class="sm-val">${score}</div><div class="sm-lbl">Objective score</div></div>
    <div class="sm-card"><div class="sm-val">${critAccPct}%</div><div class="sm-lbl">Criticality acc.</div></div>
    <div class="sm-card"><div class="sm-val">${injectsAnswered}/${totalInjects}</div><div class="sm-lbl">Injects answered</div></div>
    <div class="sm-card"><div class="sm-val">${notifChecked}/${TT_NOTIF_ITEMS.length}</div><div class="sm-lbl">Notifs filed</div></div>
  </div>

  ${ttRenderMitrePath()}

  <div class="card">
    <div class="card-title">Step 0 — Declaration accuracy</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div>
        <div style="font-size:11px;color:var(--muted)">TL severity called</div>
        <div style="font-size:14px;font-weight:700">${ttState.declaration.severity || '—'}
          <span style="font-size:11px;color:${sevMatch ? 'var(--green)' : 'var(--red)'};font-weight:700">${sevMatch ? '&#x2713; matches' : '&#x2717; correct was ' + scenario.declaration.correctSeverity}</span>
        </div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--muted)">TL recommendation</div>
        <div style="font-size:14px;font-weight:700">${ttState.declaration.declare === null ? '—' : (ttState.declaration.declare ? 'Declare' : 'Monitor')}
          <span style="font-size:11px;color:${declMatch ? 'var(--green)' : 'var(--red)'};font-weight:700">${declMatch ? '&#x2713; matches' : '&#x2717; correct was ' + (scenario.declaration.correctDeclare ? 'Declare' : 'Monitor')}</span>
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
        <div>${typeof e.detail === 'object' ? JSON.stringify(e.detail) : (e.detail || '')}</div>
      </div>`).join('') : '<div style="font-size:12px;color:var(--muted)">No log entries.</div>'}
  </div>

  <div class="card">
    <div class="card-title">IR plan comparison</div>
    <div style="font-size:12px;color:var(--muted);line-height:1.6">
      Upload your ratified IR plan to auto-compare against this exercise's event log. The automated comparison is on the backlog (item t34a). For now, the facilitator reviews the timeline above against the plan manually and notes where decisions diverged from documented procedure or where the plan was silent.
    </div>
  </div>

  ${ttState.readonly ? `
  <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
    <button class="btn btn-outline" onclick="setNav('scenario_library')">← Back to Exercises</button>
  </div>` : `
  <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
    <button class="btn btn-outline" onclick="ttFinalise()">Mark exercise complete</button>
    <button class="btn btn-primary" onclick="ttRestart()">Start new exercise</button>
  </div>`}`;
}

async function ttFinalise() {
  if (!ttState || !ttState.sessionId) { toast('No active session', '#dc2626'); return; }
  try {
    await sb.tt.updateSession(ttState.sessionId, {
      status: 'complete',
      notif_filed: Object.values(ttState.notifChecks).some(n => n.checked),
      updated_at: new Date().toISOString(),
    });
    await ttLog('exercise_complete', { totalInjects: (tteState.scenario || TT_SCENARIOS[ttState.scenarioId]).injects.length });
    toast('Exercise marked complete', '#15803d');
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
      return `<div class="card" style="margin-bottom:0.5rem;padding:0.85rem 1rem">
        <div style="display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap">
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
      const actionStr = e.action || (typeof e.detail === 'object' ? JSON.stringify(e.detail) : (e.detail || ''));
      return `<div class="aar-log-item">
        <div style="font-weight:600;white-space:nowrap">${timeStr}</div>
        <div style="color:var(--muted);text-transform:uppercase;font-size:10px;letter-spacing:0.06em;white-space:nowrap">${roleStr}</div>
        <div style="font-size:12px">${actionStr}</div>
      </div>`;
    }).join('') : '<div style="font-size:12px;color:var(--muted)">No log entries recorded.</div>'}
  </div>`;
}

