// ============================================================
// TABLETOP â€” Operational Track (full engine, wired to Supabase)
// ============================================================
// State persists across re-renders via in-memory ttState; Supabase rows mirror it.
// Page reload mid-exercise will lose in-memory state â€” multiplayer / resume is the
// next backlog item (mp1..mp15) and will add code-based session rehydration.

const TT_ROLES = [
  { id: 'ic', name: 'Incident Commander', icon: 'ðŸ§­', desc: 'vCISO. Owns coordination, calls the shots, signs the breach.' },
  { id: 'tl', name: 'Technical Lead',     icon: 'ðŸ› ï¸', desc: 'Senior tech. Drives containment, eradication, root cause.' },
  { id: 'cl', name: 'Communications Lead',icon: 'ðŸ“£', desc: 'Internal + external messaging, holding statements.' },
  { id: 'lc', name: 'Legal / Compliance', icon: 'âš–ï¸', desc: 'Privacy regs, breach clocks, evidence preservation.' },
  { id: 'es', name: 'Executive Sponsor',  icon: 'ðŸ‘”', desc: 'Assumed role. Business decisions, co-signs the breach.' },
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
      source: 'The Grand Hotel â€” front desk supervisor',
      raw: 'Front desk PC is showing pop-ups demanding payment. Files won\'t open and have weird extensions. Two other front desk machines look the same. Guests waiting to check in.',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'SOC alert',
        title: 'EDR confirms ransomware behaviour across 4 hosts',
        body: 'CrowdStrike has quarantined a LockBit-style payload (sha256 a93fâ€¦e612) on FRONT-DESK-02. Telemetry shows the same parent process tree (winword.exe â†’ powershell.exe â†’ rundll32.exe) on FRONT-DESK-01, FRONT-DESK-03 and BO-PMS-01. Encrypted files carry the .lockd extension.',
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
        body: 'Domain controller logs show unusual Kerberos TGT activity from a front-desk service account. PMS (Property Management System â€” reservations + folio) server is showing the same parent process tree. EDR has isolated BO-PMS-01. Reservations are offline.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0008 Lateral Movement', technique: 'T1021.002 SMB / Windows Admin Shares' },
        rolePrompts: {
          ic: 'Containment posture: full network segmentation vs targeted isolation? Coordinate with TL and brief ES on revenue impact.',
          tl: 'Disable the compromised service account. Emergency ACLs. Verify AD, file server, backup server. Action plan?',
          cl: 'Front desk fully down. What goes out internally? Guests still in the dark â€” for how long?',
          lc: 'Formal evidence chain. Outside counsel engaged? Carrier notification on standby â€” what threshold trips it?',
          es: 'Authorise manual check-in / check-out. Notify the GM. Approve staff overtime.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Ransom note found â€” exfiltration claim',
        body: 'Ransom note on encrypted hosts: $250,000 USD in BTC, 72-hour clock. The note claims 80GB of guest data exfiltrated including PII and stored credit card tokens from the PMS database. A sample file tree is provided as proof.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1567 Exfiltration Over Web Service' },
        rolePrompts: {
          ic: 'Frame the ransom decision input for the ES â€” do not negotiate yourself. Validate the exfil claim with TL.',
          tl: 'Egress log review. Did any large outbound transfers actually happen, and where to? Pull firewall + proxy logs for the last 72 hours.',
          cl: 'Draft guest notification template now â€” do not send. Get legal sign-off lined up.',
          lc: 'PIPEDA breach-of-security-safeguards assessment is now live. Real risk of significant harm? Engage cyber counsel formally.',
          es: 'Convene the exec call. Ransom decision is yours. Insurance carrier on the line.',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'Exfiltration confirmed â€” 78GB to mega.nz',
        body: 'Firewall logs confirm 78GB outbound to mega.nz endpoints over a 6-hour window yesterday between 02:00â€“08:00. PMS DB export of similar size matches. Guest PII and tokenised cards within scope. This is a breach.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1041 Exfiltration Over C2 Channel' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'Trigger the breach declaration gate. Coordinate co-sign with ES below. Once declared, the notification clock starts.',
          tl: 'Scope the exfiltrated dataset: exact records, fields, time range. Forensic image of affected hosts.',
          cl: 'Activate the guest notification plan. Prepare a media holding statement.',
          lc: 'Notification clocks: federal PIPEDA + BC OIPC. 72h to carrier per policy. Engage breach coach.',
          es: 'Co-sign breach declaration with IC. Brief GM and ownership. Authorise carrier engagement.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Recovery decision â€” restore or rebuild',
        body: 'All hotel operations on manual. 247 reservations in the next 7 days, 89 guests in-house. PMS backup from 18 hours ago verified clean by IR firm. Restore-to-clean window: ~4 hours. Full rebuild from baseline: ~36 hours.',
        phaseIdx: 4,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A â€” Recovery phase', technique: 'NIST SP 800-61 Recovery' },
        rolePrompts: {
          ic: 'Restore vs rebuild decision. Trade off uptime vs residual risk. Recommend to ES.',
          tl: 'Backup integrity verification, restoration sequence, AD password reset campaign, EDR re-baseline.',
          cl: 'Guest-facing script for tonight. Social media holding pattern. Loyalty programme members?',
          lc: 'Documentation pack for the insurance claim. Preserve forensic image regardless of restore choice.',
          es: 'Approve recovery path. Confirm financial sign-off. Brief carrier on restore plan.',
        },
      },
    ],
  },
  bec_wire: {
    id: 'bec_wire',
    title: 'Business Email Compromise â€” Wire Fraud',
    industry: 'Technology / SaaS',
    duration: '~45 min',
    difficulty: 'Medium',
    summary: 'CEO M365 account compromised via MFA fatigue. Fraudulent $47K wire authorised through hijacked Teams + email. Recall window closing.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'CloudStack Inc. â€” CFO assistant',
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
          cl: 'Internal-only at this stage. Brief the leadership team via a secure channel â€” not email.',
          lc: 'Bank fraud reporting clock (24â€“48h for any wire recall hope). RCMP cyber crime report. Cyber insurance carrier notification (crime + funds-transfer-fraud rider). SEC implications if material.',
          es: 'Call the bank now â€” invoke wire recall. Notify the board chair. Confirm coverage with carrier.',
        },
      },
      {
        ingest: 'Bank + finance team',
        title: 'Wire recall window closing â€” bank requests decision',
        body: 'The bank has reached the correspondent institution. The $47K has landed in a receiving account but has not yet been withdrawn. The bank can attempt a SWIFT gpi recall but requires written authorisation from an account signatory within 90 minutes. In parallel, M365 forensics reveals two other executive accounts (CFO, VP Sales) also received MFA fatigue push attempts in the same window â€” one (CFO) shows a successful login from the same Eastern European IP range.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0040 Impact + TA0006 Credential Access', technique: 'T1657 Financial Theft + T1621 MFA Request Generation' },
        triggersBreach: false,
        rolePrompts: {
          ic: 'Two decisions in parallel: authorise the wire recall within 90 min, and decide on scope â€” the CFO account is also compromised. Do you broaden the incident?',
          tl: 'CFO account is confirmed compromised â€” revoke immediately. Audit all financial system access that used CFO credentials in the past 48 hours. Check for any additional wire instructions or approvals.',
          cl: 'Wire recall authorisation needs a company signatory on record with the bank â€” co-ordinate with finance. Ensure no email is used for this communication. Document everything for the insurance claim.',
          lc: 'SEC material event analysis: two executive accounts and a confirmed wire loss. If the company is public, assess disclosure obligation. Prepare holding statement for the board.',
          es: 'Provide signatory authorisation to the bank for the recall attempt. Notify the board of the expanded compromise scope. Confirm whether the cyber crime + funds-transfer-fraud insurance riders both apply.',
        },
      },
      {
        ingest: 'IT security + finance',
        title: 'Second fraudulent payment instruction intercepted',
        body: 'Finance flags a second wire request for $118K submitted via email late last night â€” sent from the CFO account, citing an urgent supplier settlement. The wire has not yet been processed because a junior AP clerk noticed the bank details did not match the supplier\'s master record. Full M365 forensics is back: both CEO and CFO accounts had attacker-controlled inbox rules in place for at least 6 days. All email sent to or from those accounts during that window should be treated as potentially read or manipulated by the attacker.',
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
        title: 'Attacker evicted â€” notification and recovery decisions',
        body: 'All attacker access has been revoked. MFA has been reset for all executives and legacy auth blocked. The wire recall attempt on the $47K was partially successful â€” $31K has been returned, $16K is unrecoverable as it was withdrawn. The $118K attempt was blocked. Total confirmed loss is $16K. The cyber insurer has accepted the claim in principle under the funds-transfer-fraud rider. However, the insurer\'s forensic team has flagged that the MFA policy at the time did not require number-matching, which they may cite as a contributing control failure when settling.',
        phaseIdx: 3,
        correctCriticality: 'Medium',
        mitre: { tactic: 'TA0043 Reconnaissance', technique: 'T1589 Gather Victim Identity Information' },
        triggersBreach: false,
        rolePrompts: {
          ic: 'Claim is in principle accepted but the insurer may dispute the settlement amount due to the MFA control gap. Do you fight it or accept? What controls are you committing to in the AAR?',
          tl: 'Implement number-matching MFA org-wide immediately. Remove all legacy authentication. Deploy conditional access policies blocking overseas logins. Provide IC with a written hardening plan.',
          cl: 'Review the insurer\'s reservation about the MFA control gap â€” assess whether it represents a coverage dispute or a negotiation. Advise whether to contest or settle. Confirm notification obligations to any counterparties whose contracts may have been affected.',
          lc: 'Prepare the post-incident narrative for internal and (if required) external communication: losses minimised, attacker evicted, controls strengthened. No proactive public disclosure required at this loss level, but draft a reactive statement.',
          es: 'Close the loop with the board: final loss is $16K net of recovery, claim accepted in principle. Present the hardening roadmap. Confirm whether D&O or crime coverage has any additional applicability.',
        },
      },
    ],
  },
  overnight_vishing: {
    id: 'overnight_vishing',
    title: 'Overnight Vishing â€” Fake PMS Support Call',
    industry: 'Hospitality',
    duration: '~45 min',
    difficulty: 'Medium',
    summary: 'Front desk staffer receives a 3am call from a convincing "Agilysys support" caller and grants remote access. Attacker installs a RAT, harvests domain admin credentials, and queries the guest database before the morning shift arrives.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'The Grand Hotel â€” Night Manager',
      raw: 'Front desk called me at 3:20am. One of the overnight staff got a call from someone claiming to be Agilysys support â€” they said there was a critical crash coming in the next hour. They asked her to download a remote support tool and let them in to fix it. She did. I don\'t know if it was legitimate. The caller ID showed a 1-800 number. The session was open for about 40 minutes.',
      correctSeverity: 'P2',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'Technician anomaly',
        title: 'Remote access tool confirmed â€” RAT installed',
        body: 'IR triage on FRONT-DESK-04 (overnight workstation) finds AnyDesk installed at 03:22 with a silent-install flag. A second process, svchost32.exe (not a legitimate Windows binary), was launched from the AnyDesk session and persists via a scheduled task. VirusTotal flags it as a commodity RAT with C2 callout to a Ukraine-hosted IP. AnyDesk session log shows the remote party browsed the file system for 38 minutes.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access', technique: 'T1566.004 Phishing â€” Vishing' },
        rolePrompts: {
          ic: 'Is this isolated to one workstation, or did the attacker pivot during those 38 minutes? Contain the host and stand up the war room. What do you need confirmed in the next 15 minutes?',
          tl: 'Isolate FRONT-DESK-04 immediately. Pull the AnyDesk session log for exact file and folder access. Check whether the service account on that machine has access to the PMS. Any other hosts phoning home to the same C2 IP?',
          cl: 'Night staff are shaken. What do you communicate internally right now, and to whom? Nothing external yet â€” what is your holding position?',
          lc: 'You have a live attacker with a RAT still running. Evidence preservation before containment, or containment first? What is your legal instruction to the TL?',
          es: 'Night Manager is asking whether to wake the GM. What is your call? Operational risk: overnight shift has one person on front desk.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Credential harvesting confirmed â€” domain admin captured',
        body: 'Memory forensics on FRONT-DESK-04 reveals a keylogger module embedded in the RAT payload. Captured credentials include the PMS service account (HOTEL\\pms_svc) and a domain admin account used by the night IT supervisor earlier that evening. Active Directory shows both accounts used from the C2 IP at 04:01 â€” 19 minutes after the AnyDesk session closed. The attacker is still in the environment.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0006 Credential Access', technique: 'T1056.001 Keylogging' },
        rolePrompts: {
          ic: 'The attacker has domain admin credentials and is actively using them. Full segmentation or targeted account lockout? Co-ordinate with TL immediately â€” every minute increases scope.',
          tl: 'Disable HOTEL\\pms_svc and the domain admin account now â€” accept the PMS downtime. Force a global AD password reset for all privileged accounts. Enumerate every login from the C2 IP in the last 6 hours.',
          cl: 'Morning shift starts in 3 hours. Front desk will have no PMS access at handover. What is the internal comms plan for arriving staff?',
          lc: 'Domain admin compromise expands blast radius significantly. What data could a domain admin reach? Begin a formal record of every action taken since 03:22.',
          es: 'Authorise emergency PMS downtime. Manual check-in procedures. Wake the GM â€” you are out of time.',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'PMS database queried â€” 6,200 guest records accessed',
        body: 'PMS query logs show the pms_svc account ran a bulk SELECT on guest_profiles and folio_transactions between 04:03 and 04:41, returning 6,200 rows. Fields include: full name, email, phone, nationality, passport number, loyalty ID, and tokenised card references. Logs also show a compressed archive (guests_export.7z) created on the PMS server at 04:44.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1005 Data from Local System' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'This is a breach. Trigger the breach declaration gate â€” co-sign with ES. The notification clock starts from the moment you confirm this. Coordinate the timeline.',
          tl: 'Was guests_export.7z exfiltrated? Pull firewall egress logs for the pms_svc account between 04:44 and now. Determine if the file left the building.',
          cl: 'Guest notification is now a matter of when, not if. Begin drafting the notification template. Do not send without legal sign-off.',
          lc: 'PIPEDA real risk of significant harm: passport numbers and tokenised cards for 6,200 guests. RROSH is near-certain. 72-hour OPC clock is starting. Engage cyber counsel now.',
          es: 'Co-sign the breach declaration with IC. Brief the GM and ownership. Confirm the cyber insurance carrier has been notified â€” crime and privacy coverage.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Agilysys confirms no outbound support call was made',
        body: 'Agilysys support confirms they have no record of any outbound call to the hotel last night. The 1-800 number was a spoofed VOIP line. The attack was fully manufactured â€” no legitimate vendor involvement. The staff member acted in good faith. The caller had detailed knowledge of the hotel\'s PMS version and support processes, suggesting prior reconnaissance.',
        phaseIdx: 5,
        correctCriticality: 'High',
        mitre: { tactic: 'TA0043 Reconnaissance', technique: 'T1598 Phishing for Information' },
        rolePrompts: {
          ic: 'Wrap your incident timeline for the AAR. Root cause is a process gap â€” no callback verification for vendor support. What is your immediate procedural recommendation?',
          tl: 'Technical hardening list: what controls would have caught or blocked this? Caller ID verification policy, AnyDesk block list, PMS DB activity monitoring. Prioritise top 3 for the AAR.',
          cl: 'The staff member is likely distressed. How do you communicate internally that this was not her fault, while still documenting the process failure?',
          lc: 'Insurance claim documentation. Staff training records. Vendor impersonation is a growing attack vector â€” does your incident policy cover social engineering losses?',
          es: 'What is the hotel\'s liability to the 6,200 affected guests? Loyalty programme impact? Review third-party breach notification obligations with counsel.',
        },
      },
    ],
  },
  pos_compromise: {
    id: 'pos_compromise',
    title: 'POS Skimmer â€” F&B and Spa Terminals',
    industry: 'Hospitality',
    duration: '~50 min',
    difficulty: 'Hard',
    summary: 'Bank fraud alerts flag unusual card activity traced to hotel restaurant and spa POS terminals. Memory-scraping malware has been running silently for 11 days. PCI DSS notification obligations are immediate.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'The Grand Hotel â€” F&B Manager',
      raw: 'Three guests called today saying their card was fraudulently charged elsewhere within hours of paying at our restaurant. We also got a call from Moneris â€” our acquiring bank â€” saying they have received a Common Point of Purchase alert and are asking us to initiate a PCI incident response. I have no idea what that means.',
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
          cl: 'Restaurant and spa are still open. Staff do not know. What do you tell operations management right now, and what customer-facing steps â€” if any â€” do you take tonight?',
          lc: 'PCI DSS requires you notify your acquirer immediately upon confirmation of cardholder data compromise. Moneris already called. What is your response to them in the next 30 minutes?',
          es: 'Dinner service in 2 hours. Do you close the restaurant, switch to cash-only, or continue with monitoring in place? Revenue vs liability. Your call.',
        },
      },
      {
        ingest: 'SOC alert',
        title: '11 days of dwell time â€” 2,400 cards estimated captured',
        body: 'Forensic analysis of the malware\'s exfiltration logs estimates 2,412 unique payment cards captured: PAN, expiry, cardholder name, service code. No PIN data in scope. Guest names are not directly linked, but cross-referencing PMS folio data could identify many cardholders. The attack has been running since before the last quarterly PCI vulnerability scan.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1020 Automated Exfiltration' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'Trigger the breach declaration. 2,400+ cards is a PCI reportable incident. Coordinate co-sign with ES and begin the formal notification sequence.',
          tl: '11 days of compromise means the breach window predates our last PCI scan. How did the malware get installed? Check for any external-facing management interfaces on the POS network segment.',
          cl: 'The acquiring bank is waiting. Media will follow if 2,400 cardholders start reporting fraud. Draft a holding statement and brief the communications chain for possible public disclosure.',
          lc: 'PCI DSS Level 1 incident: acquirer notified within 24h, card brands within 24â€“72h. Engage a forensic QSA via carrier. PIPEDA may also apply if guest data links. Brief the board on liability exposure.',
          es: 'Authorise the QSA engagement. Confirm cyber insurance covers PCI â€” crime and fines rider. Estimated card replacement cost for 2,400 cards is significant. Get a number.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Initial access vector â€” unpatched VPN management console',
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
        body: 'Visa and Mastercard have each issued formal demand letters requiring a completed PFI (Payment Forensic Investigator) report within 5 business days. Failure to comply risks escalation to a Level 1 on-site audit and potential card acceptance suspension. The QSA says a full PFI typically takes 2â€“4 weeks. A conflict exists between the demand timeline and forensic reality.',
        phaseIdx: 5,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A â€” Post-Incident', technique: 'PCI DSS Forensic Investigation' },
        rolePrompts: {
          ic: 'You cannot deliver a full PFI in 5 days. How do you respond to the card brands? Who owns the Visa and Mastercard relationship during this period?',
          tl: 'Prepare an interim technical findings summary the QSA can submit as a progress report. What can be documented and verified within 5 days?',
          cl: 'Operations wants to know when the restaurant and spa will be normal. What is your answer without disclosing legally sensitive information?',
          lc: 'Outside counsel should manage all card brand communications â€” this is legally privileged. What immediate actions do you instruct for the 5-day response window?',
          es: 'Authorise outside counsel to respond to card brands directly. Confirm cyber insurance is covering QSA costs and card replacement reimbursement. What is the total estimated exposure?',
        },
      },
    ],
  },
  msp_rma_pivot: {
    id: 'msp_rma_pivot',
    title: 'RMM Compromise â€” MSP Supply Chain Pivot',
    industry: 'MSP',
    duration: '~60 min',
    difficulty: 'Hard',
    summary: 'The MSP\'s RMM agent is backdoored via a compromised vendor update. The attacker has silent admin access to 14 client endpoints across 6 organisations. The MSP must triage blast radius, notify all clients simultaneously, and manage reputational risk.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'Abbott Cyber MSP â€” SOC Analyst',
      raw: 'The Grand Hotel just called â€” their EDR flagged our RMM agent (ConnectWise Automate) making unexpected registry changes and spawning a child process at 02:00 last night. I pulled the Automate logs and found the same behaviour across 14 of our managed endpoints. It looks like a bad update came through our own RMM platform. This might not just be one client.',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'SOC alert',
        title: 'Backdoored RMM update confirmed â€” 14 endpoints, 6 client orgs',
        body: 'ConnectWise confirms a plugin update pushed 18 hours ago contained a backdoored component. The malicious update installed a Cobalt Strike beacon on every endpoint that auto-applied the update. Scope: 14 client endpoints across 6 organisations â€” hospitality, professional services, and one healthcare-adjacent client. The beacon has been active up to 18 hours with full system privileges via the RMM agent.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access', technique: 'T1195.002 Compromise Software Supply Chain' },
        rolePrompts: {
          ic: 'You are the incident â€” your tool is the vector. Decide now: notify all 14 clients before you know the full scope, or contain and assess first? Every minute of delay is attacker dwell time in client environments.',
          tl: 'Emergency: shut down the ConnectWise update channel for all clients. Identify which of the 14 endpoints show active C2 beacon activity vs dormant installs. Prioritise the healthcare-adjacent client first.',
          cl: '14 clients need to hear from you. Draft the client notification â€” be direct, factual, take ownership. Who makes the calls and in what order?',
          lc: 'Your tool caused the breach. Review the MSA for each of the 14 clients. Healthcare-adjacent client may have HIPAA implications. Does your cyber insurance cover third-party vendor compromise as the source vector?',
          es: 'This is an existential reputational event. Personally call the top 3 clients before they find out from their own alerts. What is your posture to the other 3?',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'Active exfiltration from 3 client environments',
        body: 'EDR and network monitoring show active Cobalt Strike C2 traffic from 3 of the 14 endpoints: The Grand Hotel, a law firm (Morrison & Webb), and a regional accounting firm. File staging is visible on all three â€” compressed archives being assembled. The Grand Hotel endpoint is querying the PMS server. Morrison & Webb has accessed the client matter database. The exfiltration window is open right now.',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1041 Exfiltration Over C2 Channel' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'Three simultaneous active breaches in client environments. Breach declaration triggers for all three. Triage: isolate all three endpoints now accepting full service disruption, or stagger to minimise operational impact?',
          tl: 'Kill the C2 channel at the network level and force-isolate the three active endpoints via EDR. What forensic evidence can you capture before isolation? The 11 dormant endpoints are secondary.',
          cl: 'Morrison & Webb has client-privileged data at risk. The Grand Hotel has guest PII. The accounting firm has client financial records. Three different conversations, three different obligations. Who do you call first?',
          lc: 'Three confirmed breaches via your platform. Notification obligations to each client and potentially to regulators. Engage external cyber counsel immediately â€” your insurance and your clients\' claims may conflict.',
          es: 'Authorise emergency IR firm deployment to all three active sites simultaneously. Cost is secondary. Prepare a board-level briefing â€” this will become public.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'Media inquiry â€” reporter asking about the RMM backdoor',
        body: 'A reporter from BleepingComputer has emailed the MSP\'s general contact: "We\'ve received reports of a ConnectWise Automate supply chain compromise affecting multiple Canadian MSPs. Can you confirm whether your clients were affected?" ConnectWise has just posted a public security advisory naming the compromised plugin version. Your clients\' IT teams are reading it now.',
        phaseIdx: 2,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A â€” Reputational', technique: 'Media and Disclosure Management' },
        rolePrompts: {
          ic: 'The media inquiry does not change your technical response â€” but it changes your communication timeline. Clients must hear from you before they read it online. Does your prioritisation change?',
          tl: 'ConnectWise\'s public advisory is now the technical narrative. Does it accurately describe what you observed? Any gaps that affect your client communications?',
          cl: 'Do you respond to the reporter? Draft a one-paragraph holding statement for legal approval. No specific client impacts, no speculation about scope.',
          lc: 'Media engagement during an active incident creates discovery risk. Advise the IC on whether to engage the reporter at all, and what litigation hold implications exist for your written communications today.',
          es: 'Some clients will read the advisory and call you before you call them. Who are they? Do you have a script ready? Prepare for the possibility that one client terminates the MSA today.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'ConnectWise releases emergency patch â€” 14-endpoint remediation window',
        body: 'ConnectWise has released an emergency out-of-band patch removing the backdoored component and resetting agent permissions. Estimated deployment: 2 hours per client via their remediation tool, or 4â€“6 hours manual per endpoint. 14 endpoints across 6 clients need remediation plus attacker persistence verification. Some clients are asking whether they should just uninstall the RMM agent entirely.',
        phaseIdx: 3,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A â€” Eradication', technique: 'Supply Chain Remediation' },
        rolePrompts: {
          ic: 'Remediation sequence: healthcare-adjacent client first, then three active-breach clients, then 8 dormant endpoints. Communicate ETAs to all 6 clients before you start.',
          tl: 'For the 3 active-breach clients: manual persistence verification before re-enabling RMM. For the rest: remediation tool. What is the total timeline?',
          cl: 'Clients asking whether to uninstall the agent: what is your answer? Some may want to pause the MSA during remediation. How do you retain trust through the remediation window?',
          lc: 'Document every remediation action with timestamps per client. This becomes the incident record for insurance claims, potential litigation, and regulatory response.',
          es: 'Offer each client a dedicated remediation technician at no charge â€” bill it to the incident, not the client. This is a trust-recovery investment. Confirm the cyber insurance claim is filed.',
        },
      },
    ],
  },
  reservation_data_leak: {
    id: 'reservation_data_leak',
    title: 'Reservation System Breach â€” Guest PII on Dark Web',
    industry: 'Hospitality',
    duration: '~55 min',
    difficulty: 'Hard',
    summary: 'A threat intelligence feed flags a dark web listing selling 40,000 guest records from the hotel PMS â€” passport numbers, loyalty IDs, stay history. The breach occurred 22 days ago via a third-party booking widget vendor who was themselves compromised.',
    declaration: {
      ingest: 'Technician anomaly',
      source: 'Abbott Cyber MSP â€” Threat Intel Feed',
      raw: 'Our threat intelligence platform flagged a listing on a dark web marketplace selling what appears to be guest data from a Canadian hotel. The sample data includes fields that match the Grand Hotel PMS schema exactly â€” loyalty tier, reservation source code, and a property code that maps to this client. Listed price: $4,000 for 40,000 records. Posting date: 3 days ago.',
      correctSeverity: 'P1',
      correctDeclare: true,
    },
    injects: [
      {
        ingest: 'SOC alert',
        title: 'Records confirmed as ours â€” 40,000 guests including passport numbers',
        body: 'Cross-referencing the 6-record sample against the PMS: all 6 match exactly. Fields confirmed in the full dataset: full name, email, phone, nationality, passport number (international guests), loyalty ID and tier, stay history, and a hashed PMS account PIN. Total: 40,847 records. International guests represent ~31% â€” GDPR may be in scope for EU and UK residents.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0010 Exfiltration', technique: 'T1567 Exfiltration Over Web Service' },
        rolePrompts: {
          ic: 'Confirmed PII on a dark web marketplace â€” this is a breach. Stand up the IR team, engage the insurer, brief the GM. Declare and start the clock. Who needs to know in the next 30 minutes?',
          tl: 'We do not know the vector yet. Priority: PMS access logs for the last 60 days, API gateway logs, and any third-party integrations with read access to guest profiles. Start building the access map.',
          cl: '40,000 affected guests will need to be notified. You cannot notify until scope is confirmed and legal has signed off. Draft the notification template now so you are ready to move.',
          lc: 'Passport numbers are high-sensitivity PII under PIPEDA. 31% international guests means GDPR may apply. Two regulatory regimes with different clocks. What is your immediate priority action?',
          es: 'The GM must be briefed before any public disclosure. 40,000 affected loyalty members. Call the GM now. Confirm insurance. Brief ownership.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: 'PMS API logs â€” third-party booking widget ran bulk guest export 22 days ago',
        body: 'The PMS vendor (Opera Cloud) API gateway logs show an authorised API key belonging to a third-party booking widget integration â€” "FastBook Widget v2" â€” executed a bulk export query 22 days ago at 02:40am returning 40,847 rows. FastBook Widget is embedded on the hotel website for direct bookings. The API key is still active.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access', technique: 'T1078.004 Cloud Accounts' },
        rolePrompts: {
          ic: 'The API key is still live â€” revoke it immediately. TL to execute. The vector is a third-party vendor. What do we know about FastBook Widget\'s security posture?',
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
          cl: 'FastBook wants silence. PIPEDA requires disclosure. Draft the regulatory notification and the guest notification â€” legal must clear both. Guest notification should not reference FastBook by name initially.',
          lc: 'FastBook\'s confidentiality request has no legal force once you have a regulatory obligation to disclose. Notify OPC and BC OIPC. GDPR supervisory authority if EU guests confirmed. Preserve all communications with FastBook.',
          es: 'FastBook has no insurance and 8 employees. Recovery from them is unlikely. What is the hotel\'s standalone exposure â€” fines, guest remediation, loyalty programme goodwill spend? Brief ownership.',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'Guests self-discovering breach on social media before notification sent',
        body: 'Three days after discovery, before formal guest notification has been sent (still in legal review), guests are calling the front desk directly. TripAdvisor posts appear: "I received a phishing email using my exact stay dates and room type â€” did you leak my data?" The loyalty app is showing ~200 abnormal login attempts. The story is breaking publicly without your notification landing first.',
        phaseIdx: 5,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A â€” Post-Incident', technique: 'Downstream Fraud and Media Escalation' },
        rolePrompts: {
          ic: 'Legal review is taking too long â€” guests are self-discovering on social media. Do you push legal to approve an expedited notice, or issue a public holding statement first? Decide now.',
          tl: 'The loyalty account brute-force attempts confirm attackers are using the leaked data for credential stuffing. Force a password reset for all 40,000 loyalty accounts. Confirm 2FA is available.',
          cl: 'TripAdvisor posts are live. Your holding statement needs to be published today: acknowledge the incident, take responsibility, commit to notification, provide a direct contact number. No finger-pointing at FastBook.',
          lc: 'The delay in guest notification may itself become a regulatory finding. Document the legal review timeline. Once notification goes out, file formally with OPC. Class action risk is real â€” preserve all evidence.',
          es: 'Offer 12 months of credit monitoring to all 40,000 affected guests. Confirm the budget. The loyalty programme needs a goodwill gesture â€” points top-up or waived annual fees. This is the brand recovery investment.',
        },
      },
    ],
  },
  ddos_extortion: {
    id: 'ddos_extortion',
    title: 'DDoS Extortion â€” Booking Engine Down at Peak',
    industry: 'Hospitality',
    duration: '~45 min',
    difficulty: 'Medium',
    summary: 'The hotel\'s online booking engine goes offline during a long-weekend surge. An extortion demand of $25k BTC arrives with a 6-hour clock. Mid-incident the attacker sends "proof of access" containing real reservation records, escalating from a service disruption to a potential breach.',
    declaration: {
      ingest: 'PSA ticket',
      source: 'The Grand Hotel â€” Revenue Manager',
      raw: 'Our online booking engine has been down for 40 minutes. It is the Friday of a long weekend â€” one of our highest-booking windows of the year. The website host says it is a DDoS attack. We also just received an email demanding $25,000 in Bitcoin to stop the attack. I don\'t know if we should pay or who to call.',
      correctSeverity: 'P2',
      correctDeclare: false,
    },
    injects: [
      {
        ingest: 'Technician anomaly',
        title: 'Layer 7 DDoS confirmed â€” CDN mitigation failing',
        body: 'The booking engine (AWS behind Cloudflare) is under a Layer 7 application-layer DDoS: 280,000 requests per minute to /search and /availability endpoints, mimicking real browser behaviour with JS challenge bypass. Cloudflare\'s automated mitigation blocks 60% but the remainder overwhelms the application servers. Attack originates from a botnet across 43 countries. Manual WAF rules are being tried but the attacker is adapting in real time.',
        phaseIdx: 1,
        correctCriticality: 'High',
        mitre: { tactic: 'TA0040 Impact', technique: 'T1498.001 Direct Network Flood' },
        rolePrompts: {
          ic: 'Do not pay the ransom. Focus on mitigation. Who are your contacts at Cloudflare for emergency DDoS escalation? Stand up the incident â€” revenue, legal, and communications need to be briefed now.',
          tl: 'Escalate to Cloudflare\'s DDoS response team immediately. Emergency measure: rate-limit the targeted endpoints to zero for non-Canadian IPs â€” accept lost international bookings to restore domestic service.',
          cl: 'The booking engine is visibly down. Social media will notice within minutes. Post a holding statement now: "We\'re experiencing a technical issue affecting online bookings â€” please call us directly at [number]."',
          lc: 'The extortion email is evidence. Do not respond to it. Forward to counsel and law enforcement immediately. Paying ransoms may have legal implications under Canadian sanctions law.',
          es: 'Activate the manual booking fallback: direct the revenue team to field calls. Estimate revenue loss per hour â€” the GM and ownership need a financial impact figure now.',
        },
      },
      {
        ingest: 'SOC alert',
        title: 'Second wave â€” PMS API and loyalty portal now targeted',
        body: 'At 90 minutes, the attacker expands scope. The PMS API (used by online check-in and the loyalty app) is now under volumetric attack. The loyalty member portal is down. The booking engine has partially recovered via Cloudflare emergency rules. A new email: "We warned you. Now your guests can\'t check in online either. Clock is at 4.5 hours. $25k or we go to media with your security failures."',
        phaseIdx: 2,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0040 Impact', technique: 'T1498 Network Denial of Service' },
        rolePrompts: {
          ic: 'The attacker is escalating. Two systems now down. The 4.5-hour deadline is psychological pressure â€” do not react to the clock. Is the PMS API outage an extension of the DDoS, or a separate intrusion? Your response differs entirely.',
          tl: 'Is the PMS API attack the same botnet (volumetric) or a different vector (potential exploit)? Check for signs of actual intrusion alongside the DDoS traffic. This is the most important technical question right now.',
          cl: 'Loyalty portal down affects members arriving for check-in this weekend. Front desk needs talking points. Social media is picking this up. Time to activate your media response.',
          lc: 'The extortion email mentions "your security failures" â€” language that could precede a data leak claim. Begin evidence preservation as if exfiltration is possible.',
          es: 'The attacker is threatening to go to media. Proactive disclosure may be better than reactive. Brief the GM and consider whether to issue a press statement before the attacker does.',
        },
      },
      {
        ingest: 'Technician anomaly',
        title: '"Proof of access" â€” attacker sends real reservation records',
        body: 'A third email arrives at hour 3. Attached PDF contains: 12 guest reservation records (names, dates, room numbers, rates), a screenshot of the internal revenue management dashboard, and a partial employee list with emails and titles. Demand is now $50,000 â€” doubled. This is either a real breach or a sophisticated bluff using a cached browser session. You have 30 minutes to determine which.',
        phaseIdx: 1,
        correctCriticality: 'Critical',
        mitre: { tactic: 'TA0001 Initial Access', technique: 'T1059 Command and Scripting Interpreter' },
        triggersBreach: true,
        rolePrompts: {
          ic: 'This changes the threat classification. The DDoS may be a distraction for a network intrusion. Trigger the breach declaration gate if TL confirms the data is authentic. What do you need from TL in the next 15 minutes?',
          tl: 'Verify the proof data: are these real reservation records in the PMS? Is the revenue dashboard screenshot current and from inside the network? If authentic, you have a breach alongside the DDoS. Full forensics now.',
          cl: 'Remove any "we have no evidence of a data breach" language from your public holding statement immediately â€” pending TL\'s verification. Update your media position to "we are investigating a security matter."',
          lc: 'If the proof data is authentic, you have a PIPEDA breach event running concurrently with the extortion. Two separate regulatory obligations with different timelines. Begin the breach assessment in parallel.',
          es: 'The $50k demand is secondary â€” if they are inside the network, the data exposure is the primary risk. Confirm you are not paying. Engage the carrier\'s incident response team now.',
        },
      },
      {
        ingest: 'PSA ticket',
        title: 'Attack subsides at hour 6 â€” proof data partially verified',
        body: 'At the 6-hour deadline, DDoS traffic drops to zero. No further attacker contact. Booking engine and PMS API recover fully. Revenue Manager estimates $34,000 in lost bookings. Forensic result: 10 of 12 reservation records are authentic; the revenue dashboard screenshot matches a browser-cached session left open on a shared hotel computer; the employee list is partially sourced from LinkedIn.',
        phaseIdx: 5,
        correctCriticality: 'High',
        mitre: { tactic: 'N/A â€” Post-Incident', technique: 'NIST SP 800-61 Post-Incident Activity' },
        rolePrompts: {
          ic: 'Attack is over. Did they actually breach the network, or was the proof assembled from a cached browser session and LinkedIn? TL\'s forensic answer determines your regulatory obligations. You have 72 hours to conclude.',
          tl: 'Full forensic sweep: any signs of persistent access, malware, or exfiltration beyond what the cached session could explain? Document the forensic conclusion â€” it determines the PIPEDA notification obligation.',
          cl: 'Systems are back online. Issue a positive update: "Our systems are fully restored. We apologise for the disruption and are grateful for your patience." Do not mention the extortion or data proof.',
          lc: 'If the proof came from a browser-cached session rather than a network intrusion, the breach analysis changes significantly. Document the forensic conclusion carefully.',
          es: '$34,000 in lost revenue plus IR costs. Confirm DDoS extortion is covered under your policy â€” crime and business interruption. Board AAR question: what hardening investment prevents or shortens this next time?',
        },
      },
    ],
  },

};

const TT_NOTIF_ITEMS = [
  { id: 'carrier',  label: 'Cyber insurance carrier â€” primary notification', detail: 'Most policies require notice within 24-48h. Triggers panel firm.', clockHr: 24 },
  { id: 'counsel',  label: 'Outside cyber counsel engaged',                  detail: 'Privilege wrapper for the rest of the response.',                clockHr: 4  },
  { id: 'irfirm',   label: 'Forensic IR firm activated',                     detail: 'Via carrier panel if available, else direct retainer.',          clockHr: 4  },
  { id: 'le',       label: 'Law enforcement â€” RCMP cyber crimes',            detail: 'Reportable but does not pause private response.',                clockHr: 24 },
  { id: 'opc',      label: 'Office of the Privacy Commissioner (Canada)',    detail: 'PIPEDA â€” notify as soon as feasible after determining RROSH.',  clockHr: 72 },
  { id: 'oipc',     label: 'BC Office of the Information & Privacy Commissioner', detail: 'For BC residents\' PI under PIPA BC.',                     clockHr: 72 },
  { id: 'pci',      label: 'Card networks â€” PCI DSS incident reporting',     detail: 'If cardholder data in scope. Acquirer first.',                   clockHr: 24 },
  { id: 'affected', label: 'Affected individuals â€” notification plan',       detail: 'Direct notice required under PIPEDA where RROSH determined.',    clockHr: 72 },
];

// In-memory state mirror â€” Supabase rows are the source of truth on reload.
let ttState = null;
function ttInit() {
  ttState = {
    view: 'setup',                     // setup | commentary | declaration | inject | breach | notif | aar
    scenarioId: null,
    facilitatorName: '',
    sessionId: null,
    sessionCode: null,
    currentInject: 0,
    declaration: { signal: '', severity: '', declare: null, assessment: '' },
    responses: {},                     // { [injectIdx]: { [roleId]: { text, criticality } } }
    breach: { declared: false, ic_sign_time: null, es_sign_time: null, rationale: '' },
    notifChecks: {},                   // { [itemId]: { checked, checkedAt } }
    notifStartTime: null,
    exerciseLog: [],
  };
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
    default:            return '<div class="card">Unknown tabletop view.</div>';
  }
}

// ---- Shared header (shown on every view after setup) ----
function ttHeaderBar() {
  const scenario = TT_SCENARIOS[ttState.scenarioId];
  return `<div class="card" style="padding:0.7rem 1rem;margin-bottom:0.5rem;display:flex;align-items:center;gap:10px">
    <span style="font-size:14px">ðŸŽ¯</span>
    <div style="flex:1">
      <div style="font-size:13px;font-weight:700">${scenario ? scenario.title : 'Tabletop'}</div>
      <div style="font-size:10px;color:var(--muted)">Facilitator: ${ttState.facilitatorName || 'â€”'}</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:9px;color:var(--muted);letter-spacing:0.06em;text-transform:uppercase">Session code</div>
      <div style="font-size:14px;font-weight:700;color:var(--cyan);letter-spacing:0.1em">${ttState.sessionCode || 'â€”'}</div>
    </div>
  </div>`;
}

function ttNistTrack(activeIdx, declStep) {
  return `<div class="nist-track">
    ${declStep ? `<div class="nist-step decl-step">Step 0 Â· TL Declare</div>` : ''}
    ${TT_NIST_PHASES.map((s, i) => `<div class="nist-step ${i === activeIdx ? 'active' : (i < activeIdx ? 'complete' : '')}">${s}</div>`).join('')}
  </div>`;
}

function ttGoto(view) { ttSnapshot(); ttState.view = view; ttRender(); }
function ttBack(view) { ttSnapshot(); ttState.view = view; ttRender(); }

// ---- SETUP ----
function ttRenderSetup() {
  const orgOk = !!currentOrg;
  return `${renderTierBanner()}
  <div style="font-size:17px;font-weight:700;margin-bottom:0.85rem">ðŸŽ¯ Tabletop â€” Operational</div>
  <div class="commentary-card">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan2);margin-bottom:6px">vCISO facilitator console</div>
    <div style="font-size:14px;color:#fff;font-weight:700;margin-bottom:0.4rem">Operational track â€” IT / security team</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.5">Pick a scenario and your facilitator name. The session gets a 6-character code and live state in Supabase. Triage is not part of this exercise â€” Step 0 starts <i>after</i> the Technical Lead declares.</div>
  </div>
  <div class="card">
    <div class="card-title">New exercise</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
      <div><div class="field-lbl">Organisation</div>
        <input type="text" value="${orgOk ? currentOrg.name : ''}" disabled style="opacity:0.6"/></div>
      <div><div class="field-lbl">Facilitator</div>
        <input type="text" id="ttFacName" placeholder="e.g. Mark Abbott" value="${ttState.facilitatorName || ''}"/></div>
    </div>
    <div class="field-lbl" style="margin-bottom:5px">Scenario</div>
    ${Object.values(TT_SCENARIOS).map(s => `
      <div class="mini-opt${ttState.scenarioId === s.id ? ' sel' : ''}" onclick="ttPickScenario('${s.id}')" style="align-items:flex-start;padding:10px 12px">
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700;color:var(--text)">${s.title}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${s.summary}</div>
          <div style="display:flex;gap:6px;margin-top:5px;flex-wrap:wrap">
            <span class="badge b-gray">${s.industry}</span>
            <span class="badge b-cyan">${s.duration}</span>
            <span class="badge ${s.difficulty === 'Hard' ? 'b-red' : 'b-amber'}">${s.difficulty}</span>
            <span class="badge b-purple">${s.injects.length} injects + Step 0</span>
          </div>
        </div>
      </div>`).join('')}
    <div style="margin-top:14px;display:flex;gap:8px;justify-content:flex-end">
      <button class="btn btn-primary" onclick="ttLaunchSession()" ${!orgOk ? 'disabled' : ''}>Create session â†’</button>
    </div>
  </div>`;
}

function ttPickScenario(id) { ttSnapshot(); ttState.scenarioId = id; ttRender(); }

async function ttLaunchSession() {
  ttSnapshot();
  if (!currentOrg) { toast('Select an organisation first', '#dc2626'); return; }
  if (!ttState.scenarioId) { toast('Pick a scenario', '#dc2626'); return; }
  if (!ttState.facilitatorName.trim()) { toast('Enter facilitator name', '#dc2626'); return; }
  const scenario = TT_SCENARIOS[ttState.scenarioId];
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
    });
    ttState.sessionId = created.id;
    ttState.sessionCode = created.session_code;
    ttState.view = 'commentary';
    await ttLog('session_created', { code: created.session_code, scenario: scenario.title, facilitator: ttState.facilitatorName });
    toast('Session ' + created.session_code + ' created', '#15803d');
    ttStartFacPoll();
    ttRender();
  } catch (e) {
    toast('Could not create session â€” ' + e.message, '#dc2626');
    console.error(e);
  }
}

// ---- COMMENTARY ----
function ttRenderCommentary() {
  const scenario = TT_SCENARIOS[ttState.scenarioId];
  return `${renderTierBanner()}
  ${ttHeaderBar()}
  <div class="commentary-card">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan2);margin-bottom:6px">vCISO commentary â€” before we start</div>
    <div style="font-size:14px;color:#fff;font-weight:700;margin-bottom:0.5rem">${scenario.title}</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.75);line-height:1.6">
      ${scenario.summary}
      <br/><br/>
      <b>How this runs:</b><br/>
      1. <b>Step 0 â€” TL declaration.</b> A raw signal comes in. The Technical Lead assigns severity (P1â€“P4) and recommends declare or monitor. Triage is not part of tabletop. The exercise begins after declaration.<br/>
      2. <b>Role-filtered injects.</b> Each role sees the same situation framed for their job. IC coordinates, TL acts, Comms shapes messages, Legal watches clocks, ES makes business calls.<br/>
      3. <b>Breach gate.</b> Some injects trigger a formal breach determination. IC and ES <i>both</i> co-sign before the disclosure clock starts.<br/>
      4. <b>Notification checklist.</b> Once breach is declared, an 8-item checklist with a 72-hour clock tracks regulatory + contractual notifications.<br/>
      5. <b>After Action Report.</b> MITRE ATT&CK mapping and correct criticality are revealed <i>only</i> here â€” never during the exercise.
    </div>
  </div>
  ${ttRenderLobbyPanel()}
  <div style="display:flex;gap:8px;justify-content:space-between;align-items:center;margin-top:10px;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" id="ttDemoBtn" onclick="ttAddDemoPlayers()">âž• Add demo players</button>
    <div style="display:flex;gap:8px">
      <button class="btn btn-outline" onclick="ttBack('setup')">â† Back to setup</button>
      <button class="btn btn-primary" onclick="ttGoto('declaration')">Begin Step 0 â†’</button>
    </div>
  </div>`;
}

// ---- DECLARATION (Step 0) ----
function ttRenderDeclaration() {
  const scenario = TT_SCENARIOS[ttState.scenarioId];
  const d = scenario.declaration;
  const tlSev = ttState.declaration.severity;
  const tlDec = ttState.declaration.declare;
  return `${renderTierBanner()}
  ${ttHeaderBar()}
  ${ttNistTrack(-1, true)}
  <div class="declaration-step">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan);margin-bottom:6px">Step 0 â€” Technical Lead declaration</div>
    <div style="font-size:14px;font-weight:700;margin-bottom:6px">Raw signal â€” ${d.ingest} from ${d.source}</div>
    <div class="signal-box" style="font-size:13px;line-height:1.5">"${d.raw}"</div>
    <div class="field-lbl" style="margin-top:10px">TL â€” initial technical assessment</div>
    <textarea id="ttDeclAss" placeholder="In plain language: what is going on? Working hypothesis?">${ttState.declaration.assessment || ''}</textarea>
    <div class="field-lbl" style="margin-top:10px">Severity</div>
    <div>
      ${['P1','P2','P3','P4'].map(s => `<button class="sev-btn ${tlSev === s ? 'sel-' + s : ''}" onclick="ttSetSev('${s}')">${s} â€” ${({P1:'Critical',P2:'High',P3:'Medium',P4:'Low'})[s]}</button>`).join('')}
    </div>
    <div class="field-lbl" style="margin-top:10px">Recommendation</div>
    <div style="display:flex;gap:6px">
      <button class="btn ${tlDec === true  ? 'btn-red'   : 'btn-outline'} btn-sm" onclick="ttSetDec(true)">Declare incident</button>
      <button class="btn ${tlDec === false ? 'btn-amber' : 'btn-outline'} btn-sm" onclick="ttSetDec(false)">Monitor only</button>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px">
      <button class="btn btn-outline" onclick="ttBack('commentary')">â† Back</button>
      <button class="btn btn-primary" onclick="ttSubmitDeclaration()">Submit declaration â†’</button>
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
      toast('TL chose to monitor â€” exercise ending', '#b45309');
      ttState.view = 'aar';
    } else {
      ttState.view = 'inject';
      ttState.currentInject = 0;
    }
    ttRender();
  } catch (e) { toast('Could not save declaration â€” ' + e.message, '#dc2626'); }
}

// ---- INJECT ----
function ttRenderInject() {
  const scenario = TT_SCENARIOS[ttState.scenarioId];
  const idx = ttState.currentInject;
  const inj = scenario.injects[idx];
  if (!inj) {
    // Past the last inject â€” pick next gate
    ttState.view = ttState.breach.declared ? 'notif' : 'aar';
    return renderTabletop();
  }
  const responses = ttState.responses[idx] || {};
  return `${renderTierBanner()}
  ${ttHeaderBar()}
  ${ttNistTrack(inj.phaseIdx)}
  <div class="inject-card">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">
      <span class="badge b-cyan">Inject ${idx + 1} of ${scenario.injects.length}</span>
      <span class="badge b-gray">${inj.ingest}</span>
      <span class="badge b-navy">${TT_NIST_PHASES[inj.phaseIdx]}</span>
    </div>
    <div style="font-size:14px;font-weight:700;margin-bottom:6px">${inj.title}</div>
    <div class="inject-body-box">${inj.body}</div>
    <div class="role-grid">
      ${TT_ROLES.map(r => {
        const rr = responses[r.id] || {};
        const crit = rr.criticality || '';
        return `<div class="role-resp">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
            <span style="font-size:14px">${r.icon}</span>
            <div style="font-size:11px;font-weight:700;color:var(--navy)">${r.name}</div>
          </div>
          <div style="font-size:11px;color:var(--muted);line-height:1.4;margin-bottom:6px"><b>Prompt:</b> ${inj.rolePrompts[r.id]}</div>
          <textarea id="ttResp_${idx}_${r.id}" placeholder="Action / decision taken" style="min-height:48px;font-size:11px">${(rr.text || '').replace(/</g,'&lt;')}</textarea>
          <div style="margin-top:5px">
            ${['Critical','High','Medium','Low'].map(c => `<button class="crit-btn ${crit === c ? 'sel-' + c : ''}" onclick="ttSetCrit(${idx},'${r.id}','${c}')">${c}</button>`).join(' ')}
          </div>
        </div>`;
      }).join('')}
    </div>
    ${inj.triggersBreach && !ttState.breach.declared ? `<div class="fn-box" style="font-size:12px"><b>âš ï¸ Breach trigger.</b> This inject contains a breach indicator. After responses are saved, the breach declaration gate opens.</div>` : ''}
    <div style="display:flex;gap:8px;justify-content:space-between;align-items:center">
      <button class="btn btn-outline btn-sm" onclick="ttPrevInject()" ${idx === 0 ? 'disabled' : ''}>â† Previous inject</button>
      <div style="display:flex;gap:6px">
        <button class="btn btn-cyan btn-sm" onclick="ttSaveResponses(${idx}, false)">Save responses</button>
        <button class="btn btn-primary" onclick="ttSaveResponses(${idx}, true)">Save & continue â†’</button>
      </div>
    </div>
  </div>
  ${ttRenderLobbyPanel()}
  ${ttRenderResponseFeedPanel(idx)}`;
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
  if (ttState.currentInject > 0) { ttState.currentInject -= 1; ttRender(); }
}

async function ttSaveResponses(idx, advance) {
  ttSnapshot();
  const scenario = TT_SCENARIOS[ttState.scenarioId];
  const inj = scenario.injects[idx];
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
  // Advance
  if (inj.triggersBreach && !ttState.breach.declared) {
    ttState.view = 'breach';
  } else if (idx + 1 < scenario.injects.length) {
    ttState.currentInject = idx + 1;
  } else if (ttState.breach.declared) {
    ttState.view = 'notif';
  } else {
    ttState.view = 'aar';
  }
  try {
    await sb.tt.updateSession(ttState.sessionId, { current_inject: ttState.currentInject, updated_at: new Date().toISOString() });
  } catch (e) { console.warn('session pointer save failed', e); }
  ttRender();
}

// ---- BREACH GATE ----
function ttRenderBreachGate() {
  const b = ttState.breach;
  return `${renderTierBanner()}
  ${ttHeaderBar()}
  <div class="erc-box">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#92400e;margin-bottom:5px">Executive Sponsor â€” assumed-role reminder</div>
    <div style="font-size:12px;color:#7c4a05;line-height:1.5">The Executive Sponsor is assumed by an ops participant. Step into the seat â€” you are not playing yourself. You authorise externally-visible action: customer notification, ransom decisions, formal breach declaration, regulatory disclosure. You are accountable.</div>
  </div>
  <div class="breach-gate" style="color:#fff">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#fca5a5;margin-bottom:6px">Breach declaration gate</div>
    <div style="font-size:15px;font-weight:700;margin-bottom:0.5rem">Declare a security breach</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.75);line-height:1.5;margin-bottom:0.9rem">Both the Incident Commander <i>and</i> the Executive Sponsor must co-sign. Neither signature alone is sufficient. Once declared, regulatory and contractual notification clocks start.</div>
    <div class="field-lbl" style="color:rgba(255,255,255,0.6)">Rationale for breach determination</div>
    <textarea id="ttBreachRat" placeholder="Why are we declaring? Cite the indicator (e.g. confirmed exfiltration of guest PII)." style="background:rgba(255,255,255,0.05);color:#fff;border-color:rgba(255,255,255,0.2)">${b.rationale || ''}</textarea>
    <div class="co-sign-grid" style="margin-top:10px">
      <div class="co-sign-card">
        <div style="font-size:11px;font-weight:700;color:#fff;margin-bottom:3px">ðŸ§­ Incident Commander</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:5px">${b.ic_sign_time ? 'Signed ' + new Date(b.ic_sign_time).toLocaleTimeString() : 'Not signed'}</div>
        <button class="btn ${b.ic_sign_time ? 'btn-green' : 'btn-cyan'} btn-sm" onclick="ttSignBreach('ic')" ${b.ic_sign_time ? 'disabled' : ''}>${b.ic_sign_time ? 'âœ“ Signed' : 'Sign as IC'}</button>
      </div>
      <div class="co-sign-card">
        <div style="font-size:11px;font-weight:700;color:#fff;margin-bottom:3px">ðŸ‘” Executive Sponsor</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:5px">${b.es_sign_time ? 'Signed ' + new Date(b.es_sign_time).toLocaleTimeString() : 'Not signed'}</div>
        <button class="btn ${b.es_sign_time ? 'btn-green' : 'btn-cyan'} btn-sm" onclick="ttSignBreach('es')" ${b.es_sign_time ? 'disabled' : ''}>${b.es_sign_time ? 'âœ“ Signed' : 'Sign as ES'}</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">
      <button class="btn btn-outline btn-sm" onclick="ttCancelBreach()" style="color:#fff;border-color:rgba(255,255,255,0.3)">Back to inject</button>
      <button class="btn btn-red" onclick="ttDeclareBreach()" ${!(b.ic_sign_time && b.es_sign_time) ? 'disabled' : ''}>Declare breach â†’</button>
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
    toast('Breach declared â€” notification clock started', '#b91c1c');
    const scenario = TT_SCENARIOS[ttState.scenarioId];
    if (ttState.currentInject + 1 < scenario.injects.length) {
      ttState.currentInject += 1;
      ttState.view = 'inject';
    } else {
      ttState.view = 'notif';
    }
    ttRender();
  } catch (e) { toast('Could not save breach â€” ' + e.message, '#dc2626'); }
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
        <div style="font-size:14px;font-weight:700">8-item checklist Â· 72-hour clock</div>
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
        <div class="notif-check ${checked ? 'checked' : ''}" onclick="ttToggleNotif('${it.id}')">${checked ? 'âœ“' : ''}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:700">${it.label}</div>
          <div style="font-size:10px;color:var(--muted)">${it.detail}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px">Target window: ${it.clockHr}h</div>
        </div>
        ${checked && c.checkedAt ? `<span class="badge b-green">âœ“ ${new Date(c.checkedAt).toLocaleTimeString()}</span>` : ''}
      </div>`;
    }).join('')}
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
      <button class="btn btn-outline btn-sm" onclick="ttBackToLastInject()">â† Back to injects</button>
      <button class="btn btn-primary" onclick="ttGoto('aar')">Generate AAR â†’</button>
    </div>
  </div>`;
}

function ttBackToLastInject() {
  ttSnapshot();
  const scenario = TT_SCENARIOS[ttState.scenarioId];
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

// ---- AAR ----
function ttRenderAAR() {
  const scenario = TT_SCENARIOS[ttState.scenarioId];
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
  <div style="font-size:17px;font-weight:700;margin-bottom:0.85rem">ðŸ“„ After Action Report â€” ${scenario.title}</div>
  <div class="summary-metrics">
    <div class="sm-card"><div class="sm-val">${score}</div><div class="sm-lbl">Exercise score</div></div>
    <div class="sm-card"><div class="sm-val">${critAccPct}%</div><div class="sm-lbl">Criticality acc.</div></div>
    <div class="sm-card"><div class="sm-val">${injectsAnswered}/${totalInjects}</div><div class="sm-lbl">Injects answered</div></div>
    <div class="sm-card"><div class="sm-val">${notifChecked}/${TT_NOTIF_ITEMS.length}</div><div class="sm-lbl">Notifs filed</div></div>
  </div>

  <div class="card">
    <div class="card-title">Step 0 â€” Declaration accuracy</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div>
        <div style="font-size:11px;color:var(--muted)">TL severity called</div>
        <div style="font-size:14px;font-weight:700">${ttState.declaration.severity || 'â€”'}
          <span style="font-size:11px;color:${sevMatch ? 'var(--green)' : 'var(--red)'};font-weight:700">${sevMatch ? 'âœ“ matches' : 'âœ— correct was ' + scenario.declaration.correctSeverity}</span>
        </div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--muted)">TL recommendation</div>
        <div style="font-size:14px;font-weight:700">${ttState.declaration.declare === null ? 'â€”' : (ttState.declaration.declare ? 'Declare' : 'Monitor')}
          <span style="font-size:11px;color:${declMatch ? 'var(--green)' : 'var(--red)'};font-weight:700">${declMatch ? 'âœ“ matches' : 'âœ— correct was ' + (scenario.declaration.correctDeclare ? 'Declare' : 'Monitor')}</span>
        </div>
      </div>
    </div>
    <div style="margin-top:8px;font-size:12px;color:var(--muted)"><b>TL written assessment:</b><br/>${ttState.declaration.assessment || '<i>not provided</i>'}</div>
  </div>

  <div class="card">
    <div class="card-title">MITRE ATT&CK mapping (revealed)</div>
    ${scenario.injects.map((inj, i) => `
      <div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div><b>Inject ${i+1}</b> â€” ${inj.title}</div>
        <div style="color:var(--muted);font-size:11px;margin-top:2px">${inj.mitre.tactic} Â· ${inj.mitre.technique}</div>
      </div>`).join('')}
  </div>

  <div class="card">
    <div class="card-title">Criticality accuracy by inject</div>
    ${scenario.injects.map((inj, i) => {
      const r = ttState.responses[i] || {};
      return `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap">
          <span><b>Inject ${i+1}</b> â€” ${inj.title}</span>
          <span class="badge b-navy">Correct: ${inj.correctCriticality}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:5px">
          ${TT_ROLES.map(role => {
            const cr = r[role.id] && r[role.id].criticality;
            if (!cr) return `<span style="font-size:10px;color:var(--muted)">${role.icon} ${role.id.toUpperCase()}: â€”</span>`;
            const ok = cr === inj.correctCriticality;
            return `<span class="badge ${ok ? 'b-green' : 'b-red'}">${role.icon} ${role.id.toUpperCase()}: ${cr}${ok ? ' âœ“' : ' âœ—'}</span>`;
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
        <span style="font-size:14px">${c && c.checked ? 'âœ…' : 'â¬œ'}</span>
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

  <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
    <button class="btn btn-outline" onclick="ttFinalise()">Mark exercise complete</button>
    <button class="btn btn-primary" onclick="ttRestart()">Start new exercise</button>
  </div>`;
}

async function ttFinalise() {
  if (!ttState || !ttState.sessionId) { toast('No active session', '#dc2626'); return; }
  try {
    await sb.tt.updateSession(ttState.sessionId, {
      status: 'complete',
      notif_filed: Object.values(ttState.notifChecks).some(n => n.checked),
      updated_at: new Date().toISOString(),
    });
    await ttLog('exercise_complete', { totalInjects: TT_SCENARIOS[ttState.scenarioId].injects.length });
    toast('Exercise marked complete', '#15803d');
  } catch (e) { toast('Save failed â€” ' + e.message, '#dc2626'); }
}

function ttRestart() { ttInit(); ttRender(); }

