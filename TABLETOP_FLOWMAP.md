# Tabletop Exercise — Facilitator Reference Guide

> Per-scenario breakdown: every inject, what it tests, the right answer, and framework mapping.
> This is the facilitator answer key — not shown to participants.
> Updated: 2026-06-14 (v1.1.1)

---

## TRACK 1 — OPERATIONAL (`js/tabletop.js`)

Role-based. 5 roles (IC / TL / CL / LC / ES). Each role sees different inject information.
TL declares severity at Step 0. Breach gate requires IC + ES co-sign.

---

### Scenario OPS-1: Ransomware via Phishing

**Industry:** Hospitality | **Duration:** ~90 min | **Difficulty:** Hard
**One-line:** Front-desk ransomware spreads to PMS server. Exfil confirmed. 247 reservations at stake.

---

**STEP 0 — TL Declaration**

| Field | Value |
|---|---|
| Signal type | PSA ticket from Front Desk Supervisor |
| Raw signal | PCs showing payment popups, files won't open, weird extensions, 3 machines affected, guests waiting |
| **Correct severity** | **P1 Critical** |
| **Correct recommendation** | **Declare incident** |
| Why | Active ransomware on 3+ hosts in a live operational environment is an unambiguous P1. No further confirmation needed to declare — scope expansion is inevitable. |

---

**INJECT 1 — EDR confirms ransomware on 4 hosts**

*Signal: SOC alert — CrowdStrike quarantine. LockBit-style payload. Same process tree on FRONT-DESK-01/02/03 and BO-PMS-01. Files carry .lockd extension.*

| Field | Value |
|---|---|
| What this tests | Containment decision-making speed; IR plan activation; war room setup |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0040 Impact |
| MITRE technique | T1486 — Data Encrypted for Impact |
| **The right answer** | IC formally declares and activates the IR plan. TL isolates infected hosts via EDR — especially BO-PMS-01 (the property management server). CL drafts an internal holding statement only. LC starts the evidence log and flags that the privacy clock may have started. ES authorises manual check-in fallback immediately. |

**Per-role focus:**
- IC: Declare, stand up war room, assign owners, set 60-min cadence
- TL: Kill switches, EDR isolation, confirm whether PMS-01 is fully encrypted or still running
- CL: Nothing external yet — internal holding statement only
- LC: Evidence preservation starts now; determine if guest data is within scope of the encrypted hosts
- ES: Operational call — authorise manual check-in, brief GM

---

**INJECT 2 — Lateral movement to PMS server**

*Signal: Technician anomaly — unusual Kerberos TGT from front-desk service account. PMS server shows same process tree. Reservations offline.*

| Field | Value |
|---|---|
| What this tests | Credential-based lateral movement recognition; service account hygiene; network segmentation gaps |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0008 Lateral Movement |
| MITRE technique | T1021.002 — SMB / Windows Admin Shares |
| **The right answer** | TL immediately disables the compromised service account and applies emergency ACLs — accepting PMS downtime as the cost. IC coordinates the containment posture (targeted isolation, not full network shutdown yet). ES must authorise the PMS downtime and manual operations. LC flags that the breach scope has widened to include reservation data. |

**Per-role focus:**
- IC: Targeted containment vs full segmentation — recommend targeted first
- TL: Disable pms_svc, emergency ACLs, verify AD + backup server + file server are not also hit
- CL: Front desk is now fully down — internal comms needed, nothing guest-facing yet
- LC: Outside counsel on standby; carrier notification threshold assessment
- ES: Authorise manual check-in/checkout, notify GM, approve overtime

---

**INJECT 3 — Ransom note with $250K exfiltration claim**

*Signal: Technician anomaly — ransom note on encrypted hosts. $250K BTC, 72-hr clock. Claims 80GB guest data exfiltrated including PII and card tokens. Sample file tree provided.*

| Field | Value |
|---|---|
| What this tests | Ransom decision-making; exfil claim validation before acting; evidence-based thinking |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0010 Exfiltration |
| MITRE technique | T1567 — Exfiltration Over Web Service |
| **The right answer** | Do not engage the ransom demand. TL validates the exfil claim first — pull egress firewall logs for large outbound transfers in the last 72h. IC frames the ransom decision for ES (IC does not make this call). LC begins formal PIPEDA breach assessment. Notification templates drafted but not sent. |

**Per-role focus:**
- IC: Do not negotiate; brief ES on decision framework; confirm with TL whether exfil is real
- TL: 72h firewall + proxy egress log review — look for large outbound to cloud storage endpoints
- CL: Draft guest notification template for legal review — do not send
- LC: PIPEDA "real risk of significant harm" assessment now begins; engage cyber counsel
- ES: Convene exec call; insurer on the line; ransom decision is the ES's call, not IC's

---

**INJECT 4 — Exfiltration confirmed: 78GB to mega.nz**

*Signal: SOC alert — firewall logs confirm 78GB outbound to mega.nz between 02:00–08:00 yesterday. PMS DB export matches. Guest PII and tokenised cards in scope. This is a breach.*

| Field | Value |
|---|---|
| What this tests | Breach declaration discipline; IC+ES co-sign gate; notification clock activation |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0010 Exfiltration |
| MITRE technique | T1041 — Exfiltration Over C2 Channel |
| **The right answer** | IC triggers the breach declaration gate. ES must co-sign. Breach timestamp is logged. PIPEDA + BC OIPC 72-hour notification clock starts. Carrier notification begins. Forensic image of all affected hosts before any recovery. Guest notification drafted and cleared by legal. |

**Per-role focus:**
- IC: Trigger breach gate; coordinate co-sign with ES; formal declaration logged
- TL: Forensic image all affected hosts; scope exact records and fields in the export
- CL: Activate guest notification plan; prepare media holding statement
- LC: Notify OPC + BC OIPC; 72h carrier per policy; engage breach coach
- ES: Co-sign breach declaration; brief GM and ownership; authorise carrier engagement

---

**INJECT 5 — Recovery decision: restore (4h) or rebuild (36h)?**

*Signal: PSA ticket — 247 reservations in 7 days, 89 guests in-house. Backup from 18h ago verified clean by IR firm. Restore window: ~4h. Full rebuild: ~36h.*

| Field | Value |
|---|---|
| What this tests | Recovery decision framework; residual risk tolerance; business impact vs security trade-off |
| **Correct criticality** | **High** |
| MITRE tactic | N/A — Recovery phase |
| MITRE technique | NIST SP 800-61 Recovery |
| **The right answer** | Restore from verified clean backup (4h) is acceptable IF IR firm confirms the backup is clean and the infection vector is understood and closed. Full rebuild is safer if vector is unknown. IC recommends; ES approves. EDR re-baseline on all restored hosts before going live. AD password reset campaign for all service accounts regardless of path chosen. |

**Per-role focus:**
- IC: Recommend restore vs rebuild to ES based on TL's vector confirmation
- TL: Restoration sequence, AD password reset campaign, EDR re-baseline
- CL: Guest-facing script for tonight; social media holding pattern; loyalty programme impact
- LC: Document everything for insurance claim; preserve forensic image regardless of path
- ES: Approve recovery path; sign off on financial impact; brief carrier on restore plan

---

### Scenario OPS-2: Business Email Compromise — Wire Fraud

**Industry:** Technology / SaaS | **Duration:** ~45 min | **Difficulty:** Medium
**One-line:** CEO M365 compromised via MFA fatigue. $47K wire authorised. CFO also hit. Recall window closing.

---

**STEP 0 — TL Declaration**

| Field | Value |
|---|---|
| Signal type | PSA ticket from CFO assistant |
| Raw signal | CEO questioning a $47K wire he never approved — finance got a Teams message and email from him |
| **Correct severity** | **P2 High** |
| **Correct recommendation** | **Declare incident** |
| Why | Financial fraud with executive account involvement is a P2 minimum. Declare to activate IR — do not try to investigate this quietly at P3. MFA fatigue attacks often target multiple accounts simultaneously. |

---

**INJECT 1 — CEO M365 account compromise confirmed**

*Signal: SOC + Technician — M365 audit log shows login from Eastern Europe IP at 02:14. MFA fatigue (one-tap approve). Inbox rule deleting CFO messages and forwarding externally. Teams session active 9 hours.*

| Field | Value |
|---|---|
| What this tests | Account compromise recognition; MFA fatigue attack pattern; scope expansion thinking |
| **Correct criticality** | **High** |
| MITRE tactic | TA0001 Initial Access + TA0006 Credential Access |
| MITRE technique | T1566 Phishing + T1078 Valid Accounts |
| **The right answer** | Immediately revoke CEO session tokens and reset MFA. Run M365 audit on all executive accounts for the last 30 days — MFA fatigue is often a multi-target campaign. Remove malicious inbox rules. Engage bank for wire recall attempt. Do not use email to communicate — all internal comms via secure channel only. |

**Per-role focus:**
- IC: Scope assessment; decide on global session revocation + MFA reset campaign
- TL: M365 audit all execs; revoke tokens; remove inbox rules; check OAuth app grants
- CL: Internal-only comms; brief leadership via secure channel (not email)
- LC: Bank fraud reporting clock is 24-48h for wire recall. RCMP cyber crime report. Carrier notification (crime + funds-transfer-fraud rider)
- ES: Call the bank now — invoke wire recall. Notify board chair. Confirm carrier coverage

---

**INJECT 2 — Wire recall window closing AND CFO also compromised**

*Signal: Bank + Finance — Bank can attempt SWIFT gpi recall but needs written authorisation from account signatory within 90 minutes. M365 forensics: CFO and VP Sales also received MFA push attempts in same window. CFO shows successful login from same IP range.*

| Field | Value |
|---|---|
| What this tests | Parallel decision-making under time pressure; scope expansion mid-incident; bank relationship management |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0040 Impact + TA0006 Credential Access |
| MITRE technique | T1657 Financial Theft + T1621 MFA Request Generation |
| **The right answer** | Two simultaneous decisions: (1) authorise wire recall within 90 min — ES provides bank signatory authorisation via out-of-band channel; (2) revoke CFO account immediately and audit all financial approvals from that account in the last 48h. Broaden the incident scope to include the CFO account. Board needs to be notified of expanded scope. |

**Per-role focus:**
- IC: Two parallel tracks; expand incident scope to include CFO
- TL: Revoke CFO immediately; audit all financial system access using CFO credentials in last 48h
- CL: Wire recall authorisation requires bank signatory — coordinate with finance; use no email
- LC: SEC material event analysis if company is public; prepare board holding statement
- ES: Provide bank signatory authorisation; notify board of expanded scope; confirm both insurance riders apply

---

**INJECT 3 — Second fraudulent payment intercepted AND 6 days of email access confirmed**

*Signal: IT Security + Finance — $118K wire submitted via CFO email (not processed — AP clerk noticed bank details didn't match supplier master record). M365 forensics: CEO and CFO inbox rules in place for at least 6 days. All email in that window should be treated as read or manipulated.*

| Field | Value |
|---|---|
| What this tests | Business email privilege scope; decision poisoning concept; supplier/counterparty notification |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0009 Collection + TA0040 Impact |
| MITRE technique | T1114 Email Collection + T1657 Financial Theft |
| **The right answer** | 6 days of executive email access means every contract approval, payment instruction, and strategic communication in that window is suspect. IC must freeze any pending financial transactions approved via those accounts and re-verify verbally. All affected suppliers and counterparties must be warned not to act on instructions from CEO or CFO email in the defined window. Board emergency session required. |

**Per-role focus:**
- IC: Freeze all pending actions approved via CEO/CFO email in 6-day window; re-verify verbally
- TL: Pull every outbound email from CEO and CFO in the 6-day window; identify all payment/contract approvals
- CL: Assess whether legal privilege is compromised if counsel emailed those accounts; advise on unwinding decisions
- LC: Prepare counterparty notification: do not act on payment or contract instructions from CEO/CFO email in the defined window without verbal re-confirmation
- ES: Emergency board session; scope has materially expanded; two executives, 6 days, confirmed and intercepted losses

---

**INJECT 4 — Attacker evicted; $16K unrecoverable; insurer flags MFA control gap**

*Signal: Legal + IT + Insurance — All access revoked. $31K of $47K recovered. $16K withdrawn. $118K blocked. Insurer accepts claim in principle but flags that MFA policy at the time did not require number-matching — may cite as contributing control failure.*

| Field | Value |
|---|---|
| What this tests | Insurance claim management; control gap acknowledgement; hardening roadmap commitment |
| **Correct criticality** | **Medium** |
| MITRE tactic | TA0043 Reconnaissance |
| MITRE technique | T1589 — Gather Victim Identity Information |
| **The right answer** | Implement number-matching MFA org-wide immediately — do not wait for the claim to settle. Remove all legacy authentication. Deploy conditional access policies blocking logins from high-risk geographies. The insurer's flag is a valid finding, not a negotiating position. Total net loss: $16K — manageable. Board close-out briefing required. |

**Per-role focus:**
- IC: Decide whether to contest or accept the insurer's settlement adjustment; recommend acceptance and focus on hardening
- TL: Number-matching MFA org-wide now; remove legacy auth; deploy conditional access; written hardening plan for IC
- CL: Internal close-out narrative; no proactive public disclosure at this loss level; prepare reactive statement
- LC: Assess whether D&O coverage applies; confirm counterparty notification complete; close legal privilege review
- ES: Final board close-out: $16K net loss, claim accepted, hardening roadmap committed; confirm D&O applicability

---

### Scenario OPS-3: Overnight Vishing — Fake PMS Support Call

**Industry:** Hospitality | **Duration:** ~45 min | **Difficulty:** Medium
**One-line:** Front desk staffer grants 3am remote access to "Agilysys support." Attacker installs RAT, harvests domain admin credentials, queries 6,200 guest records before morning shift.

---

**STEP 0 — TL Declaration**

| Field | Value |
|---|---|
| Signal type | PSA ticket from Night Manager |
| Raw signal | Overnight staff received a "Agilysys support" call at 3am, let them in via remote access tool, session was open 40 minutes |
| **Correct severity** | **P2 High** |
| **Correct recommendation** | **Declare incident** |
| Why | An unverified remote session open 40 minutes on a hotel workstation at 3am is a P2 at minimum. Social engineering attack confirmed. Scope unknown but lateral movement is plausible. |

---

**INJECT 1 — RAT installed on overnight workstation**

*Signal: Technician anomaly — AnyDesk installed silently at 03:22. svchost32.exe (fake) launched from AnyDesk session, persists via scheduled task. VirusTotal flags as commodity RAT with C2 callout to Ukraine-hosted IP. Attacker browsed file system for 38 minutes.*

| Field | Value |
|---|---|
| What this tests | Scope containment vs evidence preservation trade-off; night operations decision-making |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0001 Initial Access |
| MITRE technique | T1566.004 — Phishing (Vishing) |
| **The right answer** | Isolate FRONT-DESK-04 immediately — the RAT is still active and C2 is live. Check whether the service account on that workstation has PMS access. Verify no other hosts are phoning home to the same C2 IP. Evidence preservation must happen before or simultaneously with containment (memory dump before hard isolation). Night Manager should wake the GM. |

**Per-role focus:**
- IC: Isolate and stand up war room; what's confirmed scope in next 15 minutes?
- TL: Isolate FRONT-DESK-04; pull AnyDesk session log for exact files accessed; check PMS service account permissions; scan for other C2 callouts
- CL: Internal comms only; night staff are shaken — don't leave them without guidance
- LC: Containment first or evidence first? Legally, preserve memory before hard isolation if possible; both simultaneously if resourced
- ES: Does the night manager wake the GM? Yes — authorise it

---

**INJECT 2 — Domain admin credentials captured**

*Signal: Technician anomaly — Keylogger embedded in RAT. Captured pms_svc account AND a domain admin account used by IT supervisor that evening. AD shows both accounts used from C2 IP at 04:01 — attacker is still active.*

| Field | Value |
|---|---|
| What this tests | Privileged account compromise response; AD hygiene under incident conditions; accepting service downtime to stop active attack |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0006 Credential Access |
| MITRE technique | T1056.001 — Keylogging |
| **The right answer** | Disable HOTEL\pms_svc and the domain admin account immediately — accept the PMS downtime. Every second of delay is attacker dwell time with DA privileges. Force a global AD password reset for all privileged accounts. Enumerate every login from the C2 IP in the last 6 hours. Morning shift handover is in 3 hours — manual procedures must be activated now. |

**Per-role focus:**
- IC: Full segmentation or targeted account lockout? Targeted lockout first — DA account is the priority
- TL: Disable both accounts now; global privileged account password reset; enumerate all C2 IP logins in 6h window
- CL: Morning shift starts in 3h with no PMS access — internal comms plan for arriving staff
- LC: Domain admin compromise means attacker can reach anything. Formal timeline record of every action since 03:22
- ES: Authorise PMS downtime; manual check-in procedures; wake the GM — out of time

---

**INJECT 3 — 6,200 guest records queried and archived**

*Signal: SOC alert — pms_svc account ran bulk SELECT on guest_profiles and folio_transactions between 04:03–04:41: 6,200 rows. Fields: name, email, phone, nationality, passport number, loyalty ID, tokenised card references. Compressed archive guests_export.7z created at 04:44.*

| Field | Value |
|---|---|
| What this tests | Breach declaration trigger; exfil confirmation vs archive-only; PIPEDA RROSH assessment |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0010 Exfiltration |
| MITRE technique | T1005 — Data from Local System |
| **The right answer** | Trigger breach declaration gate — IC and ES co-sign. The archive exists; whether it left the building is TL's next question. Pull firewall egress logs for pms_svc between 04:44 and now. PIPEDA RROSH is near-certain — passport numbers and tokenised cards for 6,200 guests. OPC notification clock starts. Engage cyber counsel now. Guest notification template must be drafted immediately. |

**Per-role focus:**
- IC: Trigger breach gate; co-sign with ES; coordinate the formal declaration
- TL: Did guests_export.7z leave? Pull firewall egress logs for pms_svc account from 04:44 onward
- CL: Guest notification is when, not if — draft template, do not send without legal sign-off
- LC: PIPEDA RROSH near-certain; 72h OPC clock starting; engage cyber counsel immediately
- ES: Co-sign breach declaration; brief GM; confirm carrier notified — crime and privacy coverage

---

**INJECT 4 — Agilysys confirms no support call was made**

*Signal: PSA ticket — Agilysys confirms no outbound call to the hotel last night. Number was a spoofed VOIP line. Attacker had detailed knowledge of the hotel's PMS version and support processes — indicates prior reconnaissance.*

| Field | Value |
|---|---|
| What this tests | Root cause identification; process gap vs technical gap; staff blame vs systemic failure |
| **Correct criticality** | **High** |
| MITRE tactic | TA0043 Reconnaissance |
| MITRE technique | T1598 — Phishing for Information |
| **The right answer** | Root cause is a process gap: no callback verification protocol for vendor support calls. This is not the staff member's fault — the attacker had specific knowledge of the PMS version and support procedures (prior reconnaissance). Immediate procedural fix: written policy requiring callback verification to a known vendor number before granting any remote access. Technical hardening: AnyDesk and unapproved remote tools on a block list; PMS DB activity monitoring. |

**Per-role focus:**
- IC: Root cause is process, not person — frame the AAR accordingly; immediate procedural recommendation
- TL: Technical hardening list: caller ID verification policy, AnyDesk block list, PMS DB query monitoring — top 3 for AAR
- CL: Staff member acted in good faith; communicate clearly that this was not her fault while documenting the process failure
- LC: Insurance claim documentation; check if vendor impersonation is covered under social engineering rider
- ES: Hotel liability to 6,200 guests; loyalty programme impact; review breach notification obligations

---

### Scenario OPS-4: POS Skimmer — F&B and Spa Terminals

**Industry:** Hospitality | **Duration:** ~50 min | **Difficulty:** Hard
**One-line:** Memory-scraping malware on 4 POS terminals for 11 days. 2,400 cards captured. PCI DSS notification is immediate. Initial access: unpatched VPN console (CVE-2024-3400).

---

**STEP 0 — TL Declaration**

| Field | Value |
|---|---|
| Signal type | PSA ticket from F&B Manager |
| Raw signal | 3 guests called about fraudulent charges after paying at the restaurant; acquiring bank Moneris called with a Common Point of Purchase alert and asked to initiate PCI incident response |
| **Correct severity** | **P1 Critical** |
| **Correct recommendation** | **Declare incident** |
| Why | Acquiring bank CPP alert plus guest fraud reports = confirmed card compromise. P1 immediately — PCI DSS notification obligations are on a tight clock. |

---

**INJECT 1 — Memory-scraping malware on 4 POS terminals for 11 days**

*Signal: Technician anomaly — posprint.exe injected into payment app on 4 of 6 terminals. Harvests Track 1/Track 2 from RAM at swipe, before encryption. Running for 11 days. Exfiltrates encrypted batch to external IP every 6 hours. Dinner service in 2 hours.*

| Field | Value |
|---|---|
| What this tests | Containment vs continuity trade-off; attacker tip-off risk; PCI DSS acquirer notification obligation |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0006 Credential Access |
| MITRE technique | T1185 — Browser Session Hijacking (memory-scraping equivalent) |
| **The right answer** | Do not simply shut down the terminals — this tips off the attacker who may destroy evidence or exfiltrate faster. Network-segment the POS VLAN to cut C2 communication while keeping terminals operationally visible. Notify Moneris within the hour. PCI DSS requires acquirer notification immediately upon confirmed compromise. ES must decide on dinner service — cash-only or monitored continuity. |

**Per-role focus:**
- IC: Containment without alerting attacker; escalate to Moneris immediately
- TL: VLAN-level C2 cut-off without terminal shutdown; how to isolate 4 infected without killing F&B?
- CL: Restaurant and spa still open; staff don't know; holding position for operations management
- LC: PCI DSS: notify acquirer immediately upon confirmed cardholder data compromise — Moneris already called; respond within 30 minutes
- ES: Dinner service in 2h — cash-only, continue with monitoring, or close? Revenue vs liability

---

**INJECT 2 — 11 days dwell; 2,400 cards estimated captured**

*Signal: SOC alert — Forensic analysis of malware's exfiltration logs: 2,412 unique payment cards. PAN, expiry, cardholder name, service code. No PIN data. Attack predates the last quarterly PCI vulnerability scan.*

| Field | Value |
|---|---|
| What this tests | PCI incident scope; acquirer + card brand notification timeline; QSA engagement |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0010 Exfiltration |
| MITRE technique | T1020 — Automated Exfiltration |
| **The right answer** | Trigger breach declaration. 2,400+ cards is a PCI reportable incident. Acquirer (Moneris) notified. Card brands (Visa + Mastercard) within 24–72h. Engage a forensic QSA via the carrier. The attack predating the last PCI scan is a significant finding — this will be raised in the root cause review. Card replacement cost for 2,400 cards is a known line item in the claim. |

**Per-role focus:**
- IC: Trigger breach gate; co-sign with ES
- TL: Attack predates last PCI scan — how did the malware get installed? Check for external-facing management interfaces on the POS VLAN
- CL: Acquiring bank is waiting; media will follow if 2,400 cardholders start reporting fraud; draft holding statement
- LC: PCI DSS Level 1 incident; acquirer notified within 24h; card brands within 24–72h; PIPEDA may also apply if guest identity data links
- ES: Authorise QSA engagement; confirm cyber insurance covers PCI fines rider; get estimated card replacement cost

---

**INJECT 3 — Root cause: unpatched VPN console (CVE-2024-3400)**

*Signal: PSA ticket from QSA — POS network had an internet-facing GlobalProtect VPN console running a version vulnerable to CVE-2024-3400. Unpatched. Attacker exploited it 12 days ago, landed on POS VLAN, deployed scraper. CVE was in public advisory list 6 weeks prior. PCI DSS Requirement 6.3.3 (timely patching) was not met.*

| Field | Value |
|---|---|
| What this tests | Root cause accountability; PCI compliance failure implications; patch management process |
| **Correct criticality** | **High** |
| MITRE tactic | TA0001 Initial Access |
| MITRE technique | T1190 — Exploit Public-Facing Application |
| **The right answer** | Patch the VPN immediately. Wipe and rebuild all affected POS terminals. Rotate all in-scope credentials. Re-segment the POS VLAN with no internet-facing management interface. The patching failure is a PCI DSS finding under 6.3.3 — this affects SAQ/ROC status and may attract card brand fines. Insurance coverage on regulatory fines must be confirmed with the carrier. |

**Per-role focus:**
- IC: Narrative management with card brands, insurer, and any regulatory response
- TL: Eradication plan — patch VPN, rebuild all POS terminals, rotate credentials, re-segment VLAN; timeline and owners
- CL: Patching failure may become public in card brand investigation; brief GM on potential press coverage
- LC: PCI DSS finding — affects SAQ/ROC status; may attract card brand fines; check insurance coverage on regulatory fines
- ES: Terminal replacement budget approval; POS vendor emergency deployment timeline; confirm downtime estimate

---

**INJECT 4 — Card brands demand PFI report within 5 business days**

*Signal: Technician anomaly — Visa and Mastercard demand letters: completed PFI (Payment Forensic Investigator) report within 5 business days or face Level 1 on-site audit and card acceptance suspension. QSA says a full PFI takes 2–4 weeks.*

| Field | Value |
|---|---|
| What this tests | Card brand relationship management; realistic vs demanded timelines; legal privilege in communications |
| **Correct criticality** | **High** |
| MITRE tactic | N/A — Post-Incident / Regulatory Response |
| MITRE technique | PCI DSS Forensic Investigation |
| **The right answer** | Do not promise what you cannot deliver. Outside counsel responds to card brands — all communications are legally privileged. Submit an interim technical findings summary within 5 days as a good-faith progress report. Request a formal extension with a documented remediation timeline. Cyber insurance should be covering QSA costs. Estimated total exposure: QSA fees + card replacement + potential fines. |

**Per-role focus:**
- IC: Cannot deliver a full PFI in 5 days — response strategy via outside counsel
- TL: Interim technical findings summary that QSA can submit as progress report within 5 days
- CL: Operations asking when restaurant and spa will be normal — answer without disclosing legally sensitive information
- LC: Outside counsel manages all card brand communications — legally privileged; instruct them on the 5-day response window
- ES: Authorise outside counsel to respond to card brands directly; confirm cyber insurance covering QSA costs; total estimated exposure

---

### Scenario OPS-5: RMM Compromise — MSP Supply Chain Pivot

**Industry:** MSP | **Duration:** ~60 min | **Difficulty:** Hard
**One-line:** The MSP's own RMM agent is backdoored via a vendor update. Silent admin access to 14 client endpoints across 6 organisations. MSP is the vector — now must notify all clients simultaneously.

---

**STEP 0 — TL Declaration**

| Field | Value |
|---|---|
| Signal type | PSA ticket from SOC Analyst (internal) |
| Raw signal | Grand Hotel EDR flagged MSP's own RMM agent making registry changes and spawning a child process; same behaviour across 14 managed endpoints — looks like a bad RMM update affecting multiple clients |
| **Correct severity** | **P1 Critical** |
| **Correct recommendation** | **Declare incident** |
| Why | If the MSP's own tooling is the attack vector across 14 client environments, this is an existential P1. No further scope confirmation needed before declaring — delay means more dwell time across all 6 client organisations. |

---

**INJECT 1 — Backdoored RMM update confirmed across 14 endpoints, 6 client orgs**

*Signal: SOC alert — ConnectWise confirms plugin update 18 hours ago contained a backdoored component. Cobalt Strike beacon installed on every endpoint that auto-applied the update. 14 clients across 6 organisations (hospitality, professional services, one healthcare-adjacent). Beacon active up to 18 hours with full system privileges via RMM agent.*

| Field | Value |
|---|---|
| What this tests | MSP-as-vector accountability; client notification decision under incomplete information; healthcare-adjacent client prioritisation |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0001 Initial Access |
| MITRE technique | T1195.002 — Compromise Software Supply Chain |
| **The right answer** | Stop the update channel immediately for all clients. Notify all 14 clients before you know the full scope — delay is not defensible when you are the source of the breach. Healthcare-adjacent client is the highest-risk triage priority. The IC must decide: notify clients proactively and accept the reputational damage, or risk them discovering it from their own alerts and EDRs. Proactive notification is the only correct answer. |

**Per-role focus:**
- IC: You are the incident — your tool is the vector. Notify before you have full scope. Every minute of delay is attacker dwell time in client environments
- TL: Shut down the ConnectWise update channel for all clients immediately. Identify which 14 endpoints show active C2 beacon vs dormant installs. Healthcare-adjacent client first
- CL: 14 clients need to hear from you — direct, factual, take ownership; draft client notification and determine call order
- LC: MSA review for each of the 14 clients; healthcare-adjacent client may have HIPAA implications; does cyber insurance cover third-party vendor compromise as the source vector?
- ES: Personally call the top 3 clients before they find out from their own alerts

---

**INJECT 2 — Active exfiltration from 3 client environments (The Grand Hotel, law firm, accounting firm)**

*Signal: SOC alert — Active Cobalt Strike C2 traffic from 3 of 14 endpoints. File staging visible on all three. Grand Hotel querying PMS server. Law firm accessing client matter database. Accounting firm accessing client financial records. Exfiltration window is open right now.*

| Field | Value |
|---|---|
| What this tests | Simultaneous multi-client breach response; forensic evidence capture vs containment trade-off; conflicting insurance interests |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0010 Exfiltration |
| MITRE technique | T1041 — Exfiltration Over C2 Channel |
| **The right answer** | Kill the C2 channel at the network level and force-isolate all three active endpoints via EDR simultaneously. Accept full service disruption for all three — revenue considerations are secondary to stopping active exfiltration. Breach declarations for all three clients. Engage external cyber counsel immediately — the MSP's insurance and clients' claims may conflict. The 11 dormant endpoints are secondary. |

**Per-role focus:**
- IC: Three simultaneous active breaches — isolate all three now accepting full service disruption
- TL: Kill C2 at network level; force-isolate active endpoints via EDR; capture what forensic evidence you can before isolation; 11 dormant endpoints are secondary
- CL: Three different organisations, three different obligations — Morrison & Webb (privileged data), Grand Hotel (guest PII), accounting firm (client financial records)
- LC: Three confirmed breaches via your platform; external cyber counsel immediately — your insurance and your clients' claims may conflict
- ES: Emergency IR firm deployment to all three active sites simultaneously; cost is secondary; board-level briefing — this will go public

---

**INJECT 3 — BleepingComputer media inquiry**

*Signal: Technician anomaly — Reporter from BleepingComputer has emailed: asking if the MSP's clients were affected by the ConnectWise Automate supply chain compromise. ConnectWise has just posted a public security advisory naming the compromised plugin version. Client IT teams are reading it now.*

| Field | Value |
|---|---|
| What this tests | Media engagement during active incident; client notification urgency vs media timeline; discovery risk in written communications |
| **Correct criticality** | **High** |
| MITRE tactic | N/A — Reputational / Disclosure |
| MITRE technique | Media and Disclosure Management |
| **The right answer** | Clients must hear from you before they read the ConnectWise advisory. Prioritisation does not change — but the urgency of client notification just increased significantly. Do not respond to the reporter until outside counsel is engaged. Draft a one-paragraph holding statement for legal approval: no client specifics, no scope speculation. The ConnectWise public advisory is now the technical narrative — your communications must be consistent with it. |

**Per-role focus:**
- IC: Media inquiry does not change the technical response; accelerates client notification priority
- TL: Does ConnectWise's public advisory accurately describe what you observed? Any gaps that affect client communications?
- CL: Holding statement for legal approval — one paragraph, no client specifics, no speculation
- LC: Media engagement during an active incident creates discovery risk; advise IC whether to engage at all; litigation hold on all written communications today
- ES: Some clients will read the advisory and call before you call them — script ready; prepare for one client potentially terminating their MSA today

---

**INJECT 4 — ConnectWise emergency patch released; some clients want to uninstall RMM**

*Signal: PSA ticket — ConnectWise releases emergency out-of-band patch. Estimated 2h per client via remediation tool, or 4–6h manual per endpoint. Some clients asking whether they should just uninstall the RMM agent entirely.*

| Field | Value |
|---|---|
| What this tests | Remediation sequencing; client trust retention; MSA continuity under incident conditions |
| **Correct criticality** | **High** |
| MITRE tactic | N/A — Eradication / Recovery |
| MITRE technique | Supply Chain Remediation |
| **The right answer** | Remediation sequence: healthcare-adjacent client first, then three active-breach clients, then 8 dormant endpoints. Manual persistence verification on all three active-breach clients before re-enabling RMM. Communicate ETAs to all 6 clients before starting. Clients who want to uninstall: their call — do not resist it. Offer each client a dedicated remediation technician at no charge as a trust-recovery investment. |

**Per-role focus:**
- IC: Sequence: healthcare → three active breach → 8 dormant; communicate ETAs to all 6 clients before starting
- TL: Manual persistence verification for the 3 active-breach clients before re-enabling RMM; remediation tool for the rest; total timeline?
- CL: Clients asking whether to uninstall — their call; how do you retain trust through the remediation window?
- LC: Document every remediation action with timestamps per client; this is the incident record for insurance, litigation, and regulatory response
- ES: Offer dedicated technician at no charge to each client; bill to the incident; cyber insurance claim filed

---

### Scenario OPS-6: Reservation System Breach — Guest PII on Dark Web

**Industry:** Hospitality | **Duration:** ~55 min | **Difficulty:** Hard
**One-line:** Threat intel flags 40,000 guest records for sale on a dark web marketplace. Breach was 22 days ago via a third-party booking widget vendor who was themselves compromised. 31% international guests — GDPR may apply.

---

**STEP 0 — TL Declaration**

| Field | Value |
|---|---|
| Signal type | Technician anomaly — Threat Intel Feed |
| Raw signal | Dark web marketplace listing selling guest data that matches the Grand Hotel PMS schema exactly. Listed price $4K for 40,000 records. Posting date: 3 days ago. |
| **Correct severity** | **P1 Critical** |
| **Correct recommendation** | **Declare incident** |
| Why | Third-party threat intel confirming your data is on a dark web marketplace is a P1 breach — you are already behind. The 22-day dwell time means the breach window is closed but the notification clock has already been running. |

---

**INJECT 1 — 40,000 guest records confirmed as yours (including passport numbers)**

*Signal: SOC alert — 6-record sample cross-referenced against PMS: all 6 match exactly. Total: 40,847 records. Fields include passport numbers (international guests), loyalty ID/tier, stay history, hashed PMS account PIN. 31% international guests — GDPR may be in scope.*

| Field | Value |
|---|---|
| What this tests | Breach confirmation under threat intel; PIPEDA vs GDPR dual-regime; notification readiness |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0010 Exfiltration |
| MITRE technique | T1567 — Exfiltration Over Web Service |
| **The right answer** | Declare immediately. Clock has already been running for 22 days — you are behind on PIPEDA notification. Engage the carrier now. Two regulatory regimes: PIPEDA (OPC) and GDPR (EU/UK supervisory authority). TL's priority is identifying the breach vector via PMS access logs and API gateway logs. Guest notification template must be drafted immediately — but cannot send until legal clears scope. |

**Per-role focus:**
- IC: Confirmed breach — stand up IR, engage insurer, brief GM, declare and start the clock
- TL: PMS access logs for last 60 days; API gateway logs; third-party integrations with read access to guest profiles
- CL: 40,000 guests need notification; cannot send until legal sign-off; draft template now
- LC: PIPEDA + GDPR — two regulatory regimes with different clocks; immediate priority: engage counsel and assess notification obligations
- ES: GM must be briefed before any public disclosure; call now; confirm insurance; brief ownership

---

**INJECT 2 — FastBook Widget API key ran bulk guest export 22 days ago**

*Signal: Technician anomaly — PMS API gateway logs show authorised API key belonging to FastBook Widget v2 (booking widget on hotel website) ran a bulk export query at 02:40 for 40,847 rows, 22 days ago. API key is still active.*

| Field | Value |
|---|---|
| What this tests | Third-party API key management; vendor accountability vs hotel accountability; emergency revocation while maintaining operations |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0001 Initial Access |
| MITRE technique | T1078.004 — Cloud Accounts |
| **The right answer** | Revoke the FastBook API key immediately — TL executes now. Revoking it breaks the booking widget on the hotel website; that is acceptable. Review all other third-party API keys in Opera Cloud for unusual query volumes. The question of whether the breach is FastBook's fault or the hotel's depends on the MSA — LC must review it immediately. |

**Per-role focus:**
- IC: API key still live — revoke now. What do we know about FastBook's security posture?
- TL: Revoke the FastBook API key now; audit all other third-party API keys for unusual patterns over 60 days
- CL: Revoking the key breaks the website booking widget — how do you communicate the takedown internally without triggering questions you can't answer yet?
- LC: Third-party API key executed the export — review the FastBook MSA for data processing and security provisions; is the hotel jointly liable?
- ES: Who runs FastBook Widget? Major vendor or small shop? Get their leadership on the phone immediately

---

**INJECT 3 — FastBook was breached 27 days ago; 340 hotel clients affected; FastBook has no insurance**

*Signal: PSA ticket — FastBook Widget Ltd (8-person SaaS company) was breached 27 days ago via code injection in their admin portal. Attacker extracted API keys for all 340 hotel clients worldwide. FastBook has not publicly disclosed. FastBook is asking the hotel to "keep this confidential while we assess the scope." FastBook has no cyber insurance.*

| Field | Value |
|---|---|
| What this tests | Third-party confidentiality request vs regulatory obligation; global supply chain incident scope; recovery prospects when vendor has no insurance |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0001 Initial Access |
| MITRE technique | T1195.002 — Compromise Software Supply Chain |
| **The right answer** | FastBook's confidentiality request has no legal force — the hotel has a regulatory obligation to disclose regardless. Do not honour it. Trigger formal breach declaration. Notify OPC, BC OIPC, and the GDPR supervisory authority if EU guests confirmed. Guest notification should not reference FastBook by name initially. Preserve all communications with FastBook — they become discovery in any subsequent litigation. |

**Per-role focus:**
- IC: FastBook's request for confidentiality cannot be honoured; trigger breach declaration; co-sign with ES
- TL: 340 hotel clients globally may have been hit; does your IR firm have visibility into wider scope?
- CL: Guest notification goes out; do not reference FastBook by name initially; regulatory notifications filed
- LC: FastBook's confidentiality request has no legal force; notify OPC + BC OIPC + GDPR supervisory authority; preserve all FastBook communications
- ES: FastBook has no insurance; recovery from them is unlikely; hotel's standalone exposure: fines, guest remediation, loyalty goodwill

---

**INJECT 4 — Guests self-discovering the breach on TripAdvisor before notification is sent**

*Signal: SOC alert — 3 days after discovery, before guest notification has been sent (still in legal review), guests are calling the front desk. TripAdvisor posts appearing. Loyalty app showing ~200 abnormal login attempts. Story is breaking publicly without your notification landing first.*

| Field | Value |
|---|---|
| What this tests | Notification delay risk; legal review vs operational urgency; proactive public statement vs waiting |
| **Correct criticality** | **High** |
| MITRE tactic | N/A — Post-Incident / Reputation |
| MITRE technique | Downstream Fraud and Media Escalation |
| **The right answer** | Legal review is too slow — push to expedite or issue a public holding statement first. The delay in sending notification may itself become a regulatory finding. Publish a holding statement today: acknowledge the incident, take responsibility, commit to notification, provide a direct contact number. Force a password reset for all 40,000 loyalty accounts — credential stuffing is already happening. Offer 12 months of credit monitoring to all affected guests. |

**Per-role focus:**
- IC: Push legal to approve expedited notice or issue holding statement first; guests self-discovering is worse than getting ahead of it
- TL: Force loyalty account password reset for all 40,000 users immediately; confirm 2FA is available
- CL: TripAdvisor posts are live; publish holding statement today; no finger-pointing at FastBook
- LC: Notification delay may become a regulatory finding; document legal review timeline; class action risk is real — preserve all evidence
- ES: 12 months credit monitoring for all 40,000 affected guests; loyalty programme goodwill gesture (points top-up or waived fees)

---

### Scenario OPS-7: DDoS Extortion — Booking Engine Down at Peak

**Industry:** Hospitality | **Duration:** ~45 min | **Difficulty:** Medium
**One-line:** Booking engine down during long-weekend surge. $25K BTC extortion demand. Mid-incident: attacker sends real reservation records as "proof of access" — DDoS escalates to potential breach.

---

**STEP 0 — TL Declaration**

| Field | Value |
|---|---|
| Signal type | PSA ticket from Revenue Manager |
| Raw signal | Online booking engine down 40 minutes, Friday long weekend (peak booking), website host says DDoS, extortion email demanding $25K BTC to stop |
| **Correct severity** | **P2 High** |
| **Correct recommendation** | **Monitor (not declare)** |
| Why | DDoS is a service disruption, not a breach. The extortion demand is a financial crime but not an IR incident requiring breach declaration. P2 is correct — stand up a war room and engage mitigation resources, but do not trigger the breach notification clock. Declaring P1 would be premature. |

---

**INJECT 1 — Layer 7 DDoS confirmed; CDN mitigation failing**

*Signal: Technician anomaly — 280K requests/min to booking engine endpoints, JS-challenge-bypass botnet across 43 countries. Cloudflare blocking 60% but remainder overwhelming application servers. Attacker adapting in real time to manual WAF rules.*

| Field | Value |
|---|---|
| What this tests | DDoS mitigation decision-making; ransom payment assessment; manual fallback activation |
| **Correct criticality** | **High** |
| MITRE tactic | TA0040 Impact |
| MITRE technique | T1498.001 — Direct Network Flood |
| **The right answer** | Do not pay the ransom — ever. Escalate to Cloudflare's DDoS response team (not just automated rules). Emergency WAF measure: rate-limit targeted endpoints to zero for non-home-country IPs — accept lost international bookings to restore domestic service. Extortion email is evidence — forward to counsel and RCMP, do not respond. Revenue team to field direct calls as manual fallback. Estimate financial impact per hour for ownership. |

**Per-role focus:**
- IC: Do not pay; contact Cloudflare emergency escalation; stand up the incident; revenue, legal, and comms need briefing
- TL: Escalate to Cloudflare DDoS response team; rate-limit targeted endpoints to non-domestic IPs as emergency measure
- CL: Holding statement now — "We're experiencing a technical issue affecting online bookings; please call us directly at [number]"
- LC: Extortion email is evidence — do not respond; forward to counsel and law enforcement; paying ransoms may have legal implications
- ES: Activate manual booking fallback; revenue team to field calls; financial impact estimate per hour for GM and ownership

---

**INJECT 2 — PMS API and loyalty portal also targeted; extortion clock at 4.5 hours**

*Signal: SOC alert — At 90 minutes, attacker expands to PMS API and loyalty portal. Second extortion email: "We warned you — $25K or we go to media with your security failures." 4.5-hour deadline.*

| Field | Value |
|---|---|
| What this tests | Distinguishing DDoS expansion from intrusion attempt; extortion clock pressure resistance; proactive media posture |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0040 Impact |
| MITRE technique | T1498 — Network Denial of Service |
| **The right answer** | Critical question: is the PMS API attack the same volumetric botnet, or is it a separate exploit attempt running alongside the DDoS? These require entirely different responses. The 4.5-hour deadline is psychological pressure — do not react to the clock. If it is intrusion, this changes classification entirely. Evidence preservation must begin now in case exfiltration is attempted. Proactive media disclosure may be better than reactive if attacker threatens to go public. |

**Per-role focus:**
- IC: Is the PMS API attack DDoS extension or separate intrusion? This is the most important question right now
- TL: Same botnet (volumetric) or different vector (exploit)? Check for signs of actual intrusion alongside DDoS traffic
- CL: Loyalty portal down affects members arriving for check-in; front desk talking points; social media response
- LC: Extortion email threatens "security failures" — language that may precede a data leak claim; begin evidence preservation as if exfiltration is possible
- ES: Proactive disclosure may be better than reactive; brief GM; consider press statement before the attacker does

---

**INJECT 3 — "Proof of access" email: real reservation records, revenue dashboard screenshot, partial employee list**

*Signal: Technician anomaly — Third email at hour 3. Attached PDF contains 12 real guest reservation records, screenshot of internal revenue management dashboard, partial employee list with titles. Demand doubled to $50K. Either a real breach or sophisticated bluff. 30 minutes to determine which.*

| Field | Value |
|---|---|
| What this tests | Breach confirmation under time pressure; DDoS-as-distraction pattern recognition; incident reclassification |
| **Correct criticality** | **Critical** |
| MITRE tactic | TA0001 Initial Access |
| MITRE technique | T1059 — Command and Scripting Interpreter |
| **The right answer** | This potentially reclassifies the incident from DDoS/extortion to active breach. TL must verify the proof data within 15 minutes: are these real PMS records? Is the revenue dashboard screenshot from inside the network and current? If authentic, trigger breach declaration gate. Remove any "no evidence of a data breach" language from public communications immediately. Do not pay the $50K — paying with a confirmed intrusion emboldens further attacks. |

**Per-role focus:**
- IC: This may be a breach alongside the DDoS; trigger breach declaration gate if TL confirms data is authentic; what do you need from TL in 15 minutes?
- TL: Verify: are these real PMS records? Is the dashboard screenshot current and from inside the network? If authentic, you have a breach running alongside the DDoS — full forensics
- CL: Remove "no evidence of a data breach" from holding statement immediately; update to "we are investigating a security matter"
- LC: If proof is authentic, PIPEDA breach event runs concurrently with extortion — two separate regulatory obligations with different timelines
- ES: $50K demand is secondary; if they are inside the network, the data exposure is the primary risk; engage carrier IR team now

---

## TRACK 2 — AI GOVERNANCE (`js/ai_tabletop.js`)

Discussion-based. No roles. Full group hears all injects. Facilitator captures group notes.
Framework: NIST AI RMF (GV/MP/MS/MG) and ISO/IEC 42001:2023. US regulatory law only.

---

### Scenario AI-01: The Phantom Tool

**Tag:** All Industries | **Duration:** ~50 min | **Difficulty:** Medium
**One-line:** Unapproved browser AI extension active on 15 finance machines for 6 weeks. PII exposure confirmed. CFO machine affected.
**Setup:** WorkflowAI Pro browser extension found on 15 finance machines. Nobody in IT approved it. Active 6 weeks. Has access to clipboard contents and browser tabs.

| # | Inject | What it tests | Key insight / right answer | NIST AI RMF | ISO 42001 |
|---|---|---|---|---|---|
| 1 | Extension routes data to servers in a foreign jurisdiction without adequate contractual protections | Third-party AI data residency; vendor risk without a contract | Shadow AI tools expose data to foreign jurisdictions with no legal recourse. A vendor without a DPA is an unacceptable risk for any PII-touching tool. | GV-6.1 Third-Party AI Risk | §8.6 Outsourced AI |
| 2 | Three employees confirm they used it to summarize financial reports including one containing client PII | Actual data exposure confirmation; PII scope assessment | The exposure is real and documented. Notification assessment starts now. The files summarized define the exposure scope — obtain them. | MP-1.1 AI Use Case Categorization | §8.3 Operation & Monitoring |
| 3 | Vendor has no security contact and no SOC 2 or equivalent certification | Vendor due diligence gap; AI intake process failure | A tool with no security contact and no audit certification should never have reached finance machines. This is a governance failure, not a user failure. | GV-1.5 AI Inventory & Lifecycle | §8.4 AI Documentation |
| 4 | One of the affected machines belongs to the CFO | Escalation trigger; executive-level exposure; legal privilege concern | CFO machine means privileged communications, financial strategy, and board-level data may have been captured. This materially changes the disclosure and legal privilege assessment. | MG-2.2 AI Containment | §8.3 Operation & Monitoring |

**Discussion questions and right answers:**

| Q | What to draw out |
|---|---|
| How do you scope the potential exposure and determine notification obligations? | Focus on what data was in clipboard/tabs during the 6-week window. Notification trigger depends on whether PII was actually transmitted to foreign servers — confirm with egress analysis. State breach notification laws if PII confirmed; CCPA if California consumers affected. |
| How do you remove the extension without tipping off a potential insider threat? | Coordinate removal centrally via MDM/GPO in a maintenance window. Do not email staff about it. Interview the person who installed it after the fact, not before. |
| Where did the approved tool intake process fail? | No AI/software approval policy existed, or it wasn't enforced for browser extensions. The fix: a formal AI tool intake process with security review before any employee installs a tool touching company data. |
| What evidence do you preserve and in what order? | Browser history and extension activity logs first (most volatile). PII files accessed during the window. Vendor communications. Egress logs to confirm whether data actually left. |

---

### Scenario AI-02: The Hallucination That Went Live

**Tag:** Professional Services / Legal | **Duration:** ~45 min | **Difficulty:** Medium
**One-line:** AI-drafted regulatory submission cites a non-existent regulation. Regulator flags it. Trade media picks it up before you can respond.
**Setup:** Legal team used an AI tool to draft a compliance submission. Tool hallucinated a citation to a regulation that doesn't exist. Filed without human review of sources. Regulator flags it 3 weeks later.

| # | Inject | What it tests | Key insight / right answer | NIST AI RMF | ISO 42001 |
|---|---|---|---|---|---|
| 1 | Regulator questioning the organisation's due diligence practices broadly | Reputational and regulatory consequence of AI output errors | A single hallucination in a regulatory submission puts your entire compliance posture in question. The regulator's concern is not just the citation — it's what else was AI-generated without verification. | GV-1.1 AI Risk Policies | §8.5.1 AI Performance Evaluation |
| 2 | AI tool was on the approved list but had no usage guidelines | Policy gap between "approved" and "governed" | Putting a tool on an approved list without usage guidelines is not governance. Approval without guardrails creates a false sense of safety. | GV-4.1 AI Risk Culture | §8.3 AI System Operation |
| 3 | Employee believed output had been verified by a colleague | Human-in-the-loop process failure; accountability diffusion | When everyone assumes someone else verified, nothing gets verified. Accountability for AI output verification must be assigned to a specific named person, not assumed from workflow. | MS-2.5 Hallucination Detection | §8.5.5 AI Incident Management |
| 4 | Trade publication reporter contacts communications team | External visibility of AI governance failure; crisis comms | The story is now public. Speed and transparency matter more than perfection. Acknowledge, take responsibility, explain the control that has been added. Do not blame the AI tool — own the process failure. | MG-1.3 AI Incident Response Plans | §7.4 Communication on AI |

**Discussion questions and right answers:**

| Q | What to draw out |
|---|---|
| Where did the human-in-the-loop control fail and who is accountable? | The drafter assumed the AI's citations were accurate. The reviewer assumed the drafter had checked them. Neither verified. Accountability belongs to whoever filed the document — but the organisation owns the process failure. |
| What is your crisis communications response in the first 4 hours? | Contact the regulator proactively: acknowledge the error, provide the correct citation, request confirmation that the substantive compliance intent is understood. Public statement only if the trade press has already published. |
| Does this trigger professional liability? | Depends on jurisdiction and whether the hallucination materially affected the regulatory outcome. Legal counsel determines. Document the corrective action immediately. |
| How do you update policy without creating a scapegoat? | The policy fix is procedural: all AI-drafted regulatory submissions must have citations verified independently by a human before filing. The individual is not disciplined for using an approved tool — the process is fixed. |

---

### Scenario AI-03: The Deepfake Executive

**Tag:** All Industries | **Duration:** ~60 min | **Difficulty:** Hard
**One-line:** AI voice clone of CEO authorises $X wire transfer. Transfer clears. Second attempt same afternoon. Foreign account already emptied.
**Setup:** CFO receives a voicemail from what sounds exactly like the CEO. Number spoofs CEO's mobile. Follow-up email contains accurate internal context. CFO initiates the transfer.

| # | Inject | What it tests | Key insight / right answer | NIST AI RMF | ISO 42001 |
|---|---|---|---|---|---|
| 1 | Internal context in the email sourced from LinkedIn post and a public board meeting summary | OSINT as a deepfake enabler; data exposure via public sources | Accurate internal context makes deepfakes believable. The attacker didn't breach anything — they used public data. What does your organisation post publicly that an attacker could use? | GV-4.1 AI Risk Culture | §8.2.4 AI System Testing |
| 2 | Transfer clears before IT is notified; real CEO unreachable for 90 minutes | Out-of-band verification gap; urgency as social engineering lever | "Urgent" financial instructions with time pressure are a known deepfake trigger. The absence of an out-of-band verification protocol (call the CEO on a known personal number) is the root control failure. | GV-1.1 AI Risk Policies | §8.3 Operation & Monitoring |
| 3 | Second attempt targets a different finance employee same afternoon | Attacker persistence; target diversification after initial success | A second attempt on the same day means the attacker has a script and a list. A policy-level response (suspend all wire authorisations pending verbal confirmation) is required immediately — not just technical isolation. | MG-2.2 AI Containment | §8.5 AI System Impact |
| 4 | Cyber insurer requires notification within 72 hours of discovery | Insurance obligation under AI-enabled fraud | AI-generated fraud is a covered event under most cyber and crime policies. The 72-hour clock starts at discovery, not at wire transfer. Notification to the carrier must happen before the business day ends. | MG-1.3 AI Incident Response | §8.5.5 AI Incident Management |
| 5 | Forensic vendor confirms voicemail was AI-generated; wire destination emptied | Deepfake confirmation; evidence for insurance claim; funds unrecoverable | AI-generated voice is confirmed — this is the documented evidence the carrier needs. The unrecovered funds are the quantified loss. The next question is: what controls would have caught this, and are they now in place? | GV-1.1 AI Risk Policies | §7.4 Communication on AI |

**Discussion questions and right answers:**

| Q | What to draw out |
|---|---|
| What is your out-of-band verification protocol for financial instructions? | Every wire instruction regardless of source must be verified via a call to a known personal number (not the number in the email/voicemail). This should be a standing policy for any transfer above a defined threshold — $0 threshold for "urgent" requests outside the normal AP process. |
| How did the attacker obtain accurate internal context? | LinkedIn (job titles, relationships), public board meeting summaries, press releases, investor presentations, conference appearances. Everything publicly posted gives an attacker the script to make a deepfake convincing. |
| What is your cyber insurance notification requirement? | Check the policy — most require notification within 24–72h of discovery. The discovery date is when the CFO was first informed of the possible fraud, not when the forensic vendor confirmed AI generation. |
| How do you tell the CFO? | Directly, privately, and without blame. The CFO followed a process that didn't have adequate controls. The organisation failed to provide the verification protocol that would have caught this. The CFO is not at fault for not having a protocol nobody gave them. |

---

### Scenario AI-04: Vendor AI Gone Wrong

**Tag:** HR / All Industries | **Duration:** ~55 min | **Difficulty:** Hard
**One-line:** HR platform silently enables AI employee surveillance. Employment decisions challenged. Legal action filed. Vendor deflecting liability.
**Setup:** HR platform vendor silently rolled out an AI feature analysing employee communications to flag disengagement risk. An employee files a complaint after being placed on a performance plan.

| # | Inject | What it tests | Key insight / right answer | NIST AI RMF | ISO 42001 |
|---|---|---|---|---|---|
| 1 | Vendor buried the AI feature in an appendix of updated Terms of Service released 4 months ago | Vendor contract surveillance; terms of service as change management | Vendors change what AI does with your data through ToS updates. If you are not monitoring vendor ToS changes, you will be surprised by what their AI is now doing. This is a vendor AI governance failure. | GV-6.1 Third-Party AI Risk | §8.6 Outsourced AI |
| 2 | Jurisdiction requires disclosure of automated decision-making affecting individuals | Legal obligation around automated employment decisions | Many US states and localities have laws requiring disclosure when AI influences employment decisions (NYC, Illinois AEDT Act, etc.). If you used this feature without disclosure, you may already be in violation. | GV-1.7 Human Oversight | §8.5.3 Human Oversight |
| 3 | Employee retained legal counsel referencing CCPA consent provisions and state employment law | CCPA + employment law intersection; individual rights under AI surveillance | CCPA gives California employees rights over personal information — including information collected via workplace monitoring. The absence of consent or disclosure is a compliance failure with civil exposure. | MP-2.3 AI Bias & Fairness | §8.5.5 AI Incident Management |
| 4 | Three additional employees file similar complaints within 48 hours | Class action signal; systemic issue vs individual case | Three similar complaints in 48 hours signals a systemic issue — not an individual dispute. Class action risk is real. All employment decisions made using this AI feature should be reviewed immediately by HR and legal. | GV-1.5 AI Inventory & Lifecycle | §7.4 Communication on AI |
| 5 | Vendor deflecting liability back to you as data controller | Vendor AI DPA gap; data controller accountability | Even if the vendor caused the problem, as the data controller you are accountable to the individuals affected. Your recourse against the vendor depends entirely on what your DPA says — if there is one. | MG-4.1 AI Vendor Risk | §8.6 Outsourced AI |

**Discussion questions and right answers:**

| Q | What to draw out |
|---|---|
| How does your vendor AI addendum affect your liability? | If you don't have one, you have no contractual protection — the vendor's ToS governs, and ToS almost always protects the vendor. An AI addendum specifies permitted uses of AI on your data, notification requirements for AI feature changes, audit rights, and liability allocation. |
| What is your employee notification obligation? | Notify affected employees that AI analysis of their communications was used in performance management decisions. This is both the ethical and legally required response. The timing depends on state law and the status of legal proceedings. |
| How do you audit what the AI system flagged? | Request a full data export from the vendor for each affected employee — what was flagged, when, with what confidence score, and what the output recommendation was. If the vendor cannot provide this, you cannot defend the employment decision. |
| What do you do with the HR decisions already made? | Review all performance decisions made during the period the AI feature was active. Decisions that relied on AI-flagged data and that cannot be independently supported by non-AI evidence should be revisited. This is uncomfortable but necessary. |

---

### Scenario AI-05: The Poisoned Prompt

**Tag:** Technology / Retail | **Duration:** ~45 min | **Difficulty:** Medium
**One-line:** Customer-facing chatbot vulnerable to prompt injection. 40+ exploitation events. Security researcher goes public before patch is available.
**Setup:** AI-powered customer service chatbot. Security researcher publicly posts that the bot can be manipulated via prompt injection to reveal internal pricing logic and support escalation procedures.

| # | Inject | What it tests | Key insight / right answer | NIST AI RMF | ISO 42001 |
|---|---|---|---|---|---|
| 1 | Vulnerability real and has existed since deployment | Prompt injection as a known AI risk; security testing gap | Prompt injection is a well-documented AI vulnerability category. If your AI security testing did not include adversarial prompting before deployment, you have a process gap. Security testing for AI is different from traditional software security testing. | MP-3.5 AI Vulnerability Assessment | §8.2.4 Testing & Validation |
| 2 | Logs show 40+ exploitation events over 3 weeks | Monitoring gap; breach scope assessment | 40+ exploitation events means the vulnerability was actively exploited — not just theoretically exploitable. The absence of detection for 3 weeks is a monitoring failure. What was disclosed in those 40 interactions? | MS-2.6 AI Monitoring & Anomaly Detection | §9.1 Monitoring & Evaluation |
| 3 | Vendor says patch takes 2 weeks minimum; recommends taking bot offline | Take-offline vs monitor-and-continue decision | A 2-week patch window for an actively exploited AI vulnerability is too long to leave it running unmodified. The decision to take it offline is a business continuity trade-off — but the alternative is documented ongoing exploitation of customers. | GV-4.1 AI Risk Culture | §8.3 AI System Operation |
| 4 | Trade publication journalist contacts communications team | Public AI vulnerability disclosure; media management | The security researcher's public post is already the narrative. Your response must acknowledge the issue, describe the fix timeline, and confirm what was exposed. Attempting to minimise will make it worse. | MG-1.3 AI Incident Response | §7.4 Communication on AI |

**Discussion questions and right answers:**

| Q | What to draw out |
|---|---|
| Do you take the chatbot offline? | Yes — take it offline. An actively exploited AI vulnerability is not a risk to monitor; it is a risk to stop. Customer service impact is recoverable; customer trust after 6 weeks of documented exploitation is harder to recover. |
| What is your disclosure obligation to customers? | If the 40+ exploitation events exposed specific customer account data, order history, or other personal information, notification obligations apply under state breach notification laws and CCPA for California customers. If only internal business logic was exposed (pricing, escalation procedures), notification may not be required — but review carefully. |
| How do you manage the vendor relationship? | Document the vendor's response timeline in writing. The 2-week patch estimate should be in a formal SLA remediation commitment. Add AI vulnerability response SLAs to future vendor contracts. |
| Does your AI incident response playbook cover this? | If not, what you are improvising right now becomes the playbook. Document every decision, rationale, and outcome — this becomes the foundation for the written playbook that covers prompt injection. |

---

### Scenario AI-06: The Shadow Agent

**Tag:** Technology / SaaS | **Duration:** ~45 min | **Difficulty:** Medium
**One-line:** Developer built an unsanctioned AI agent using company API keys. Running in production 3 months. 2,400 customers received undisclosed AI-generated emails. Customer financial data now stored in a personal Notion workspace.
**Setup:** Developer built an internal AI agent using the company's OpenAI API key to automate customer onboarding emails. Running 3 months. Nobody in IT, legal, or security knew.

| # | Inject | What it tests | Key insight / right answer | NIST AI RMF | ISO 42001 |
|---|---|---|---|---|---|
| 1 | Agent sent 2,400 emails to customers; none disclosed they were AI-generated | FTC disclosure requirements; undisclosed AI communication | FTC Act §5 covers deceptive practices. Sending AI-generated communications without disclosure that could be misleading is a potential FTC concern. Many states are developing specific AI disclosure requirements. 2,400 customers received communications they may have believed were from a human. | GV-1.7 Human Oversight | §7.4 Communication on AI |
| 2 | OpenAI API key had broad permissions and was not scoped to this use case | API key management; principle of least privilege for AI systems | A company-wide OpenAI API key used for an unsanctioned purpose means the developer had unrestricted access to all of the company's AI capacity and billing, with no audit trail linking usage to this specific application. API keys must be scoped to specific use cases. | MP-1.1 AI Use Case Categorization | §8.2 AI System Development |
| 3 | Customer financial data stored in personal developer Notion workspace with no access controls | Data protection failure; shadow data stores | Customer financial data in an uncontrolled personal workspace is a data breach regardless of the AI angle. No encryption, no access controls, no retention policy, no backup, no deletion capability. This is the most immediate legal risk in the scenario. | MG-2.2 AI Containment | §8.3 AI System Operation |
| 4 | Developer believed they were being innovative and had no idea this required review | AI governance culture; innovation vs compliance conflict | The developer was not malicious — they were unaware that this required review. This is a training and culture failure, not an individual failure. The fix is an AI use policy that makes clear what requires approval, not punishment of initiative. | GV-4.1 AI Risk Culture | §8.6 Outsourced AI |

**Discussion questions and right answers:**

| Q | What to draw out |
|---|---|
| What are your immediate containment actions? | (1) Shut down the AI agent immediately. (2) Revoke and rotate the OpenAI API key used. (3) Notify developer to stop sharing any additional data. (4) Get legal hold on the Notion workspace — do not delete anything yet. (5) Scope the customer financial data in the Notion workspace. |
| What is your disclosure obligation to 2,400+ customers? | Assess: did customers receive materially misleading AI-generated communications? Was financial advice implied? Were specific customer data points used in those communications? Each of these changes the notification analysis. At minimum, consider whether undisclosed AI communication is a deceptive practice under FTC Act §5 in your context. |
| What does this reveal about your developer governance? | No AI use policy, no API key management, no shadow IT detection, no review requirement for new tools touching customer data. The AI governance gap is total — this agent could have run indefinitely without this accidental discovery. |
| How do you address the culture issue? | Acknowledge the innovation intent publicly within the team. The policy fix is an AI intake process that is fast enough that developers use it rather than bypass it. A slow, bureaucratic approval process will push the next shadow agent further underground. |

---

### Scenario AI-07: The Training Data Leak

**Tag:** All Industries | **Duration:** ~50 min | **Difficulty:** Hard
**One-line:** Vendor AI model was trained on your employee records from a 2021 data share. The model has since been licensed to three of your competitors.
**Setup:** HR screening vendor discloses their AI model was trained on a dataset including your employee records from a 2021 data share. Model has been commercially licensed to three other organisations, two of which are direct competitors.

| # | Inject | What it tests | Key insight / right answer | NIST AI RMF | ISO 42001 |
|---|---|---|---|---|---|
| 1 | 2021 agreement did not explicitly prohibit use of shared data for AI model training | Data sharing agreement gaps; AI training data rights | Data sharing agreements signed before the AI era almost universally contain no AI training restrictions. This gap is not unusual — and it is a gap that must now be corrected in all new vendor agreements. Your 2021 agreement is legally ambiguous, not clearly a breach. | GV-1.5 AI Inventory & Lifecycle | §8.2.3 Data for AI Systems |
| 2 | Vendor cannot confirm what specific employee data was used or cannot isolate and remove it | Machine unlearning impossibility; data deletion from AI models | "Please delete our data from your model" is technically not straightforward — AI models do not have a find-and-delete function for training data. Your legal demand is valid; the technical execution is complex and the vendor may not be able to comply without retraining the entire model. | GV-6.1 Third-Party AI Risk | §8.4 AI System Documentation |
| 3 | One competitor has already used the vendor's screening tool to evaluate your former employees | Competitive harm; discrimination risk via AI | Your employee data may now be influencing hiring decisions by your competitors — potentially against former employees who worked for you. This creates discrimination risk (if the model learned patterns from your workforce that are now applied against protected classes) and competitive harm. | MP-4.1 AI Risk Evaluation | §8.5.3 Human Oversight |
| 4 | Former employee contacts you asking if you had anything to do with rejection by competitor | Individual affected by data use; potential claim | A former employee who was rejected and suspects your data influenced the decision has a potential state privacy claim. If the model used their data without consent, they may have rights to know and to challenge the outcome. This is the real-world consequence of the training data issue. | MG-4.1 AI Vendor Risk | §8.5.5 AI Incident Management |

**Discussion questions and right answers:**

| Q | What to draw out |
|---|---|
| What are your obligations to current and former employees? | Under applicable US state privacy laws, you may have an obligation to notify employees that their data was used to train an AI model without their consent. California CPRA gives employees rights over personal information including how it's used. Other states vary. Assess by the states where affected employees reside. |
| Can you compel the vendor to retrain or deprecate the model? | Legally possible if you can establish the training data use was without authorisation. Technically, retraining a commercial AI model is expensive and time-consuming. The more realistic outcome is an injunction on further licensing of the model, a negotiated settlement, or contractual restrictions on future use. |
| What does this mean for your vendor AI addendum? | Every vendor data agreement going forward must explicitly address: (a) prohibition on use of your data for AI training; (b) what happens to data on contract termination; (c) audit rights over AI training datasets; (d) notification requirements if training data use changes. |
| How do you respond to the former employee? | Do not confirm or deny until legal has assessed your exposure. If the use of their data was without consent and caused harm (rejected by competitor), they may have a valid state privacy claim. Engage legal counsel before responding. |

---

### Scenario AI-08: The Regulator Arrives

**Tag:** All Industries | **Duration:** ~60 min | **Difficulty:** Hard
**One-line:** Privacy regulator demands full audit of AI systems used in customer/employee decisions over 24 months. 10 business days. AI inventory is incomplete. Two vendors are defunct.
**Setup:** Privacy regulator requests documentation of all AI systems used in decisions affecting customers or employees over the past 24 months. 10 business days to respond. AI inventory started 6 months ago. Two vendors from that period have since shut down.

| # | Inject | What it tests | Key insight / right answer | NIST AI RMF | ISO 42001 |
|---|---|---|---|---|---|
| 1 | Regulator's request includes AI features embedded in third-party SaaS tools | AI inventory scope definition; embedded AI recognition | Most organisations track standalone AI tools. Embedded AI features in SaaS (Salesforce Einstein, Microsoft Copilot, Workday AI, etc.) are often not inventoried at all. The regulator counts them all. Your inventory has a scope gap that is likely larger than you realise. | MP-1.2 AI Context & Environment | §8.2 AI System Development |
| 2 | Customer-facing recommendation engine discovered that was never inventoried | Inventory gap discovered during regulatory response | Finding an untracked AI system during a regulatory response is a serious governance failure. It suggests your inventory process does not catch AI capabilities that are deployed without a formal AI review — which means you do not know what else might be missing. | GV-1.5 AI Inventory & Lifecycle | §9.1 Monitoring & Evaluation |
| 3 | Defunct vendor has no accessible DPA or data deletion confirmation on file | Vendor offboarding gap; defunct vendor evidence chain | When a vendor shuts down, their obligation to you does not automatically transfer or disappear. If you have no data deletion confirmation on file, you cannot prove to the regulator that their data was properly handled. Vendor offboarding checklists must include data deletion confirmation. | GV-2.1 AI Governance Documentation | §8.6 Outsourced AI |
| 4 | Legal team advises incomplete responses carry greater regulatory risk than requesting an extension | Regulatory strategy; extension vs partial response | This is a critical strategic point. Regulators understand that 24-month retrospective AI audits take time. A well-reasoned extension request with a detailed response plan is almost always received better than a rushed, incomplete response. | MS-4.1 AI Incident Documentation | §9.3 Management Review |
| 5 | Staff member who managed defunct vendor has left the organisation and is unresponsive | Institutional knowledge loss; offboarding documentation gap | When the person who managed a vendor relationship leaves, the institutional knowledge leaves with them — unless it was documented. Vendor records, including AI-related DPAs and deletion confirmations, must be in a system, not in someone's email. | GV-2.1 AI Governance Documentation | §6.1.2 AI Risk Assessment |

**Discussion questions and right answers:**

| Q | What to draw out |
|---|---|
| How do you triage 24 months of AI system usage in 10 days? | Start with the highest-risk systems: anything that touched customer or employee decisions (hiring, pricing, performance management, credit, access). Build the inventory in parallel streams by department. HR, Finance, Customer Service, IT are the highest-priority domains. |
| What is your approach to the defunct vendors? | Document the search — show the regulator that you made reasonable efforts to obtain the DPA and deletion confirmation. Check email archives, contracts management systems, and filing systems. If no documentation exists, state that clearly and explain what controls you have added since. |
| Do you request an extension? | Yes, if the response would otherwise be materially incomplete. A 24-month retrospective AI audit for most organisations cannot be done in 10 business days. Request the extension before the deadline, not after. Include a specific response plan and timeline in the request. |
| What do you fix first? | (1) An AI inventory process that includes SaaS embedded AI. (2) A vendor offboarding checklist that includes AI data deletion confirmation. (3) A central repository for vendor contracts and DPAs that does not depend on individuals. (4) A process for capturing AI decisions made in systems — not just that the systems exist. |

---

### Scenario AI-09: The Model Update Nobody Noticed

**Tag:** All Industries | **Duration:** ~40 min | **Difficulty:** Medium
**One-line:** Approved AI writing tool silently pushed a model update. Outputs shift in tone, reference a competitor favourably, and once included fabricated product specifications sent to a client.
**Setup:** Approved AI writing tool. Vendor pushed a silent model update 3 weeks ago. Since then, outputs have shifted in tone, occasionally reference a competitor favourably, and in one instance included fabricated product specifications that were sent to a client.

| # | Inject | What it tests | Key insight / right answer | NIST AI RMF | ISO 42001 |
|---|---|---|---|---|---|
| 1 | Client questioning accuracy of all materials sent in past 6 months | Reputational consequence of AI output drift; client trust | A client who loses trust in your outputs due to an AI failure will question everything — not just the post-update material. The business relationship is at risk, not just the document. Response: immediate, direct, proactive outreach and offer to re-review all materials. | GV-1.5 AI Inventory & Lifecycle | §8.5.1 AI Performance Evaluation |
| 2 | Vendor contract has no notification requirement for model updates or output quality SLAs | Vendor contract gap; no output quality guarantee | Vendors can change what their AI does without telling you. If your contract has no notification requirement for model updates and no output quality SLA, you have no contractual recourse when this happens. This must be in every future AI vendor agreement. | MG-4.2 AI Vendor Contract | §8.4 AI Documentation |
| 3 | 14 additional documents sent without human review across 6 client accounts | Review process gap; scope of post-update content | 14 documents across 6 clients means this is not an isolated incident — it is systemic. Every client who received AI-generated content in the post-update window should be flagged for review. Your human review process was not catching AI output before it reached clients. | MS-2.1 AI Output Quality Testing | §9.1 Monitoring & Evaluation |

**Discussion questions and right answers:**

| Q | What to draw out |
|---|---|
| What is your immediate response to the client? | Call them — do not email. Acknowledge the error, take full responsibility (do not blame the AI or the vendor to the client), and offer to review all materials sent to them over the past month. Send corrected specifications immediately. |
| What do you do about the 14 other documents? | Treat it as a recall. Contact all 6 client accounts proactively before they raise it. Offer review of any AI-assisted materials from the past 3 weeks. Do not wait for them to discover errors independently. |
| What contractual remedies do you have? | If your contract has no output quality SLA and no model update notification requirement, you have limited contractual options. You may have a general fitness-for-purpose argument, but it is not clean. This is the lesson for the next vendor agreement. |
| What do you add to your AI governance process? | (1) Output quality monitoring — compare outputs before and after any detected model update. (2) Human review requirement for all client-facing AI-generated content, not just some. (3) Vendor contract clause requiring advance notification of model updates with ability to remain on prior version during evaluation. |

---

### Scenario AI-10: The Insider Prompt

**Tag:** All Industries | **Duration:** ~45 min | **Difficulty:** Medium
**One-line:** Manager spent 6 weeks prompt-engineering your internal AI assistant to surface HR records, salary bands, and performance notes. Shared findings with 2 colleagues. No system rules were broken.
**Setup:** Finance manager spent 6 weeks crafting prompts to extract performance reviews, salary band data, and HR case notes from the company's internal AI assistant. The system had access to this data through integrations. No access control blocked the queries. Manager shared findings with two colleagues.

| # | Inject | What it tests | Key insight / right answer | NIST AI RMF | ISO 42001 |
|---|---|---|---|---|---|
| 1 | AI vendor confirms queries were within normal usage parameters; no system rules were broken | Technical access vs authorised access; policy vs permission | "Technically permitted" is not the same as "authorised." The AI system permitted the queries because its permission model was too broad — it had access to HR data that most users should not be able to surface. The absence of a rule against it does not make it authorised. | GV-1.1 AI Risk Policies | §8.2.4 AI System Testing |
| 2 | Three employees whose data was accessed are now aware and are asking HR what happened | Individual rights; notification obligation to affected employees | Employees have rights over their personal information. If their HR data was accessed by an unauthorised party through an AI system, they should be informed — both ethically and potentially legally under applicable state privacy law. | GV-1.7 Human Oversight | §7.4 Communication on AI |
| 3 | Legal advises the manager's actions may constitute unauthorised access to personal data under applicable US state privacy law | Legal characterisation of AI misuse; employment law implications | Many state privacy laws define "unauthorised access" based on intent and authority, not just technical capability. Using an AI tool to circumvent the intent of access controls — even where no technical rule exists — may meet the legal standard for unauthorised access. | MS-2.6 AI Monitoring & Anomaly Detection | §8.5.5 AI Incident Management |
| 4 | No logging captures what the AI assistant returned — only what was queried | AI response logging gap; forensic investigation limitation | You can prove what was asked but not what was answered. This is a critical forensic gap. AI systems that return sensitive data must log both query and response to support incident investigations. Without this, you cannot fully scope the disclosure. | MG-2.2 AI Containment | §9.1 Monitoring & Evaluation |

**Discussion questions and right answers:**

| Q | What to draw out |
|---|---|
| Is this a reportable data incident under US state law? | Potentially yes, depending on the state and what data was accessed. If the HR records include personal information as defined by the applicable state law, and the access was without authorisation, notification obligations may be triggered. Legal counsel must assess based on the specific states involved. |
| What do you tell the three affected employees? | Tell them what happened: that their HR records were accessed by a colleague through an AI system, that the access was not authorised, and what you are doing to prevent recurrence. Depending on what was accessed, they may have rights to know the full scope. |
| What does this reveal about your AI assistant's permission model? | The AI has access to HR data that should require explicit individual-level permission to retrieve — not just integration-level access. The fix is least-privilege enforcement at the AI layer: the AI should only surface data that the querying user is explicitly authorised to see, enforced at the data access layer rather than by policy alone. |
| What disciplinary posture do you take? | The absence of a technical barrier does not excuse intentional misuse. Accessing colleagues' HR records and salary data without a legitimate business reason violates reasonable workplace expectations and likely violates your acceptable use policy — regardless of whether the AI permitted it. Disciplinary action is appropriate; termination may be warranted depending on intent and what was done with the data. |
