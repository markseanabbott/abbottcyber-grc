-- SEED_TT_INJECT_BODIES.sql
-- TB4 — authored inject bodies and role_prompts for all 74 tt_inject_cards
-- Ransomware (22) | BEC (16) | Insider (19) | Vendor Compromise (17)
-- curated = false on all cards — Mark reviews and flips to true before use in live sessions
-- TB5 card picker MUST filter WHERE curated = true (enforced gate)
-- TB11 note: entry card body sets detection context — must not duplicate the TB3 opener text
-- {{org_name}} token is substituted at runtime by the TB11 card renderer
-- Requires SUPABASE_PATCH_064.sql to have been run first
-- Safe to re-run (UPDATE by id — idempotent)
-- Run in the Supabase SQL Editor

-- ============================================================
-- RANSOMWARE -- 22 cards, 6 stages
-- ============================================================

-- R1a: Phishing attachment delivered to employee - macro enabled (Stage 1, High)
UPDATE public.tt_inject_cards SET
  body = $body$A phishing email impersonating a known supplier has been delivered to a {{org_name}} employee and opened. The attachment contained a macro-enabled Office document and the employee enabled macros when prompted by an in-document lure. EDR on the endpoint has logged a suspicious process spawn under winword.exe, and the alert has just been escalated to the security team.$body$,
  role_prompts = $rp${"ic": "Confirm the incident scope — determine how many staff received this email and whether any others opened it, and decide whether to quarantine the affected workstation now.", "tl": "Isolate the affected endpoint from the network immediately and preserve a forensic copy of the suspicious process tree from EDR telemetry before any remediation steps.", "cl": "Monitor situation. No action required at this inject.", "lc": "Monitor situation. No action required at this inject.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R1a';

-- R1b: VPN / edge appliance exploit on unpatched CVE (Stage 1, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$Network monitoring has flagged anomalous inbound traffic to {{org_name}}'s VPN gateway, which is running firmware publicly identified as vulnerable six weeks ago. A proof-of-concept exploit for the CVE has been available since the advisory was issued, and the source IP resolves to a Tor exit node. Session logs show the inbound connection reached an internal subnet before the alert fired.$body$,
  role_prompts = $rp${"ic": "Determine whether to take the VPN gateway offline immediately to stop further ingress, weighing the operational impact against the confirmed exploitation risk.", "tl": "Pull all session logs from the gateway for the past 48 hours and identify every internal destination reached through the exploited connection.", "cl": "Monitor situation. No action required at this inject.", "lc": "Monitor situation. No action required at this inject.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R1b';

-- R1c: RDP brute force on externally exposed port (Stage 1, High)
UPDATE public.tt_inject_cards SET
  body = $body$A perimeter alert has identified an RDP service on a {{org_name}} server exposed directly to the internet on port 3389. Authentication logs show 4,200 failed login attempts over 12 hours from a rotating set of IPs, followed by a successful authentication 40 minutes ago. The successful login used a local administrator account whose password has not been rotated in over two years.$body$,
  role_prompts = $rp${"ic": "Confirm the scope of the compromise — determine which systems are accessible from the entry point and decide whether to isolate the affected server or monitor the active session.", "tl": "Immediately review what the attacker's authenticated session has done since login and assess which other internal systems are reachable from the compromised server.", "cl": "Monitor situation. No action required at this inject.", "lc": "Monitor situation. No action required at this inject.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R1c';

-- R2a: Macro executes — Cobalt Strike beacon dropped in memory (Stage 2, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$EDR telemetry at {{org_name}} has captured a PowerShell payload executing from winword.exe immediately after a macro fired on a workstation. The payload has injected a memory-resident beacon making encrypted outbound HTTPS connections to a domain registered 11 days ago. The beacon is communicating at irregular intervals consistent with a known C2 framework, and no file artifacts have been written to disk.$body$,
  role_prompts = $rp${"ic": "Direct the technical team to sever the C2 channel immediately — confirm the scope of the beacon's activity and whether any lateral movement has occurred.", "tl": "Block the C2 domain at the DNS and perimeter firewall, then perform a memory dump of the affected process before the workstation is isolated.", "cl": "Monitor situation. No action required at this inject.", "lc": "Monitor situation. No action required at this inject.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R2a';

-- R2b: Web shell planted on compromised edge device (Stage 2, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$A hidden PHP file has been discovered on {{org_name}}'s edge appliance filesystem, planted in a directory that the web server process has write access to. The file accepts base64-encoded commands via HTTP POST and executes them in the context of the web server service account. Outbound connections from the appliance to an external IP have been observed every 15 minutes for the past several hours.$body$,
  role_prompts = $rp${"ic": "Determine whether to take the edge appliance offline immediately or maintain a monitored connection while the scope of attacker activity is established.", "tl": "Capture the web shell file and all associated access logs as forensic evidence, then remove the web shell and block the attacker's outbound C2 IP at the perimeter.", "cl": "Monitor situation. No action required at this inject.", "lc": "Monitor situation. No action required at this inject.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R2b';

-- R2c: Attacker deploys tooling via live RDP session (Stage 2, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$Live RDP session logs on a {{org_name}} server show an authenticated session has been actively used for over two hours. Process history from the session reveals that network scanning utilities and a credential harvesting tool were downloaded and executed. The tools were retrieved over HTTPS from a file-sharing service not currently blocked at the perimeter.$body$,
  role_prompts = $rp${"ic": "Decide whether to terminate the active RDP session now or allow brief continued monitoring to identify further attacker objectives before cutting access.", "tl": "Terminate the RDP session, block the file-sharing service at the perimeter, and collect all artifacts dropped on the server before they are cleared.", "cl": "Monitor situation. No action required at this inject.", "lc": "Monitor situation. No action required at this inject.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R2c';

-- R2d: LOTL — PowerShell scheduled task, no beacon (Stage 2, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s SIEM has correlated a series of PowerShell executions on a workstation running encoded commands on a regular schedule. The scheduled task was created under a legitimate user account and uses only built-in Windows utilities, generating no EDR alerts. The commands are exfiltrating environment data to a cloud file-storage URI that appears in no other network logs.$body$,
  role_prompts = $rp${"ic": "Determine whether to disable the scheduled task immediately or allow one further cycle to run under monitoring to capture the full scope of data being exfiltrated.", "tl": "Decode the PowerShell commands, identify what data is being collected and where it is going, and preserve the scheduled task artifact as forensic evidence.", "cl": "Monitor situation. No action required at this inject.", "lc": "Monitor situation. No action required at this inject.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R2d';

-- R3a: LSASS dump via Mimikatz or equivalent (Stage 3, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s EDR has fired a high-severity alert on a workstation: a process running with SYSTEM privileges opened a read handle to lsass.exe and copied its memory contents to a file on disk. The behavior matches the signature of a well-known credential-dumping tool, and the file was subsequently transferred via SMB before being deleted. The affected workstation belongs to a member of the IT helpdesk team.$body$,
  role_prompts = $rp${"ic": "Treat this as a confirmed credential compromise — direct the technical team to assess which accounts were active on that workstation and force password resets for all of them.", "tl": "Identify every account credential that may have been captured from lsass memory on this host and flag all of them for immediate rotation.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on whether the compromise of helpdesk credentials creates any regulatory notification exposure at this stage, particularly if those accounts had access to personal data systems.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R3a';

-- R3b: Kerberoasting — service account TGS tickets cracked offline (Stage 3, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s SIEM has detected an unusual volume of Kerberos TGS requests from a single workstation — 47 requests for service tickets across service accounts within a 90-second window. This pattern is consistent with automated service account discovery and ticket harvesting for offline password cracking. None of the targeted service accounts have had their passwords rotated in the past 180 days, and several are members of elevated groups.$body$,
  role_prompts = $rp${"ic": "Direct the team to identify which service accounts were targeted and prioritize rotating the passwords on those with elevated group memberships before cracking is completed.", "tl": "Pull the list of every service account whose TGS ticket was requested and confirm which accounts have weak or aged passwords that would be vulnerable to offline cracking.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on the exposure created if service accounts with access to personal data or financial systems have their credentials compromised.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R3b';

-- R3c: NTLM hash stolen from local SAM — pass-the-hash prepared (Stage 3, High)
UPDATE public.tt_inject_cards SET
  body = $body$Forensic review of a {{org_name}} workstation has recovered evidence that the local SAM database was accessed by an unauthorized process running with SeDebugPrivilege enabled. A second alert has flagged lateral NTLM authentication attempts from the same host against two other internal systems. The combination of SAM extraction and outbound authentication attempts is consistent with preparation for a pass-the-hash lateral movement campaign.$body$,
  role_prompts = $rp${"ic": "Assess which systems are reachable via local admin NTLM from the compromised host and determine whether network segmentation can limit the lateral movement path.", "tl": "Block SMB traffic from the compromised host and identify every system the attacker has already authenticated to using the harvested NTLM hashes.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on what the confirmed privilege escalation and lateral movement activity means for the organization's breach notification position.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R3c';

-- R3d: Browser credential harvest and stored password dump (Stage 3, High)
UPDATE public.tt_inject_cards SET
  body = $body$Endpoint telemetry on a {{org_name}} workstation has logged a script process reading the credential storage files for two installed browsers within the same process session. The harvested files contain saved usernames and passwords for internal portals, cloud services, and the remote access VPN. The script execution was triggered by a scheduled task using built-in Windows utilities, generating no individual high-severity alerts.$body$,
  role_prompts = $rp${"ic": "Force password resets for every service and portal whose credentials were stored in the affected browsers — prioritize VPN and cloud admin accounts first.", "tl": "Identify the complete list of credentials stored in the browsers on this host and cross-reference with privileged account inventories to determine the blast radius.", "cl": "Monitor situation. No action required at this inject.", "lc": "Assess whether any of the harvested credentials provide access to systems holding personal data, which could affect the breach notification position.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R3d';

-- R4a: Service account pivots to domain controller (Stage 4, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$An authentication event has been logged on {{org_name}}'s domain controller from a service account with no documented administrative purpose on the DC and no prior interactive login history. The account has successfully authenticated and opened a remote PowerShell session on the DC. DCSync behavior has been detected — the session is actively replicating directory contents including all domain account password hashes.$body$,
  role_prompts = $rp${"ic": "The domain controller is actively being drained — direct immediate isolation of the DC from the network and initiate full incident response activation.", "tl": "Kill the DCSync session and disable the service account immediately, then assess the full scope of directory data that has already been replicated out.", "cl": "Begin preparing internal stakeholder communications — this is a domain-level compromise and leadership will need to be briefed within the hour.", "lc": "Assess the regulatory implications of a confirmed domain controller compromise and advise on when notification obligations are triggered.", "es": "Authorize emergency IR resources and begin assessing business continuity options — a domain-wide compromise will affect all systems in the environment."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R4a';

-- R4b: Pass-the-hash to domain controller (Stage 4, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s SIEM has correlated NTLM pass-the-hash authentication from a compromised workstation to the domain controller. The source workstation has not previously made administrative connections to the DC, and the NTLM authentication bypassed the Kerberos flow entirely. A second alert has fired on the domain controller indicating that new local administrator credentials were provisioned via a remote command session.$body$,
  role_prompts = $rp${"ic": "Direct immediate containment of the domain controller — the attacker now has domain-level persistence and further access should be prevented before they pivot to other critical systems.", "tl": "Revoke the newly provisioned administrator account on the DC immediately and assess what the remote session accomplished before you can shut it down.", "cl": "Begin drafting internal and external communications — assess who needs to be informed and at what stage, including any client-facing systems under this domain.", "lc": "Confirm the regulatory notification position — a confirmed domain controller compromise is a material security event and the notification clock may already be running.", "es": "Authorize the emergency response posture and confirm that business continuity plans are ready to activate if domain services need to be taken offline."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R4b';

-- R4c: Local admin relay — spreads to nearby hosts, stops short of DC (Stage 4, High)
UPDATE public.tt_inject_cards SET
  body = $body$An automated lateral movement script on a {{org_name}} workstation has used local administrator credentials to authenticate via SMB to eleven other endpoints on the same subnet. Each targeted system had the same local administrator password, and the script has installed a persistent backdoor on all eleven hosts. The domain controller has not yet been reached, but the affected subnet includes systems with access to file shares containing sensitive data.$body$,
  role_prompts = $rp${"ic": "Isolate the affected subnet and direct the team to confirm the scope of the backdoor installations — eleven compromised hosts is a significant foothold if not contained now.", "tl": "Enumerate all eleven infected endpoints, remove the backdoor from each, and rotate the local administrator password on every host in the subnet using a unique password per machine.", "cl": "Assess which client-facing or partner-connected systems are in the affected subnet and prepare communications if data access is confirmed.", "lc": "Advise on the legal position if the eleven affected endpoints have accessed or stored personal data — the scope of the breach notification obligation depends on what those systems hold.", "es": "Authorize the resources needed to remediate eleven simultaneous endpoint infections and confirm that budget is available for an external IR firm if the remediation exceeds internal capacity."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R4c';

-- R5a: Shadow copy deletion and backup agent disabled (Stage 5, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s backup monitoring platform has raised a critical alert: the on-premises backup agent on all servers has been stopped and disabled via a domain Group Policy Object pushed 22 minutes ago. Simultaneously, all Volume Shadow Copy snapshots across the file servers have been deleted using a WMI command executed from the domain controller. The cloud backup tier shows the last successful sync was 18 hours ago.$body$,
  role_prompts = $rp${"ic": "This is a pre-ransomware preparation phase — escalate to full incident response immediately and determine whether encryption can be prevented by isolating key systems in the next few minutes.", "tl": "Assess whether any clean recovery point exists in the cloud backup tier and identify which systems still have accessible snapshots before the attacker moves to the encryption phase.", "cl": "Notify leadership immediately — the organization is likely minutes to hours from a ransomware detonation and communications preparation must begin now.", "lc": "Begin the breach notification assessment — the deliberate destruction of backups ahead of an anticipated encryption event is a material security incident regardless of whether encryption has occurred yet.", "es": "Authorize activation of the business continuity plan and confirm that executive leadership is briefed — this incident is likely to cause significant operational disruption within hours."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R5a';

-- R5b: 80 GB data staged and exfiltrated — double extortion lever armed (Stage 5, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$Netflow analysis has confirmed that {{org_name}}'s environment has sustained a sustained outbound transfer totaling 80 GB to a cloud hosting provider over the past 14 hours. The data originated from file servers hosting customer records, financial data, and operational documents, and was transferred in encrypted archives. A threat intelligence feed has flagged the destination IP as associated with a ransomware group known for double-extortion campaigns.$body$,
  role_prompts = $rp${"ic": "The exfiltration is complete — activate the full incident response team and begin assessing both the ransomware containment posture and the breach notification obligations simultaneously.", "tl": "Identify precisely which file servers were the source of the exfiltration and what categories of data — including personal data and financial records — were included in the 80 GB transfer.", "cl": "Begin drafting breach notifications for clients whose data may be in the exfiltrated dataset — the double-extortion model means public disclosure is a likely threat and proactive communication is preferable.", "lc": "Assess the regulatory notification obligations for the confirmed exfiltration of customer records and financial data, and identify which state and federal frameworks apply.", "es": "Authorize engagement of external legal counsel, the cyber insurer, and a public communications firm — this event will likely become public via the threat actor's leak site and the organization needs to be prepared."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R5b';

-- R5c: Ransomware payload pre-staged across all reachable hosts (Stage 5, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$Endpoint detection has flagged a dormant binary present in the Windows\Temp directory on 34 workstations across {{org_name}}'s network. The file is digitally signed with a recently revoked certificate and its hash matches a pre-encryption dropper associated with a known ransomware strain. The file has not yet executed, but its presence across 34 systems indicates a coordinated pre-detonation staging phase.$body$,
  role_prompts = $rp${"ic": "This is a narrow window to prevent encryption — direct the technical team to remove the payload from all 34 hosts simultaneously before the detonation trigger fires.", "tl": "Push an emergency endpoint script to remove the identified binary from all 34 hosts immediately and confirm successful removal on each before declaring the payload cleared.", "cl": "Brief leadership on the situation — the payload has not detonated yet but the window to prevent it is short and communications must be ready if the remediation does not succeed.", "lc": "Advise on the legal obligations that arise if the payload detonates on some but not all hosts, and assess the notification position for the pre-staging discovery itself.", "es": "Authorize any emergency change required to remove the payload outside normal change management windows — speed is the critical variable at this stage."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R5c';

-- R5d: EDR and AV disabled domain-wide via GPO (Stage 5, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$A Group Policy change pushed from {{org_name}}'s domain controller 30 minutes ago has disabled Windows Defender and the third-party EDR agent across all domain-joined systems. The GPO was created under a domain administrator account and applied to the default domain policy. Re-enabling the agents remotely is not possible while the GPO remains active, and the security team is now operating without endpoint telemetry across the entire environment.$body$,
  role_prompts = $rp${"ic": "The security team is now operating blind — determine whether seizing control of the domain controller to remove the GPO is feasible, and activate out-of-band monitoring capabilities immediately.", "tl": "Attempt to access the domain controller via an out-of-band management path, delete the malicious GPO, and confirm whether any attacker processes are executing on critical servers without EDR coverage.", "cl": "Inform leadership that the security team has lost visibility across the entire environment — communications must be prepared for the scenario where encryption follows shortly.", "lc": "This event represents a deliberate attack on the organization's defensive capability — assess whether the intentional disabling of security controls triggers any reporting obligations.", "es": "Authorize emergency acquisition of portable detection capabilities and confirm that offline business continuity procedures are ready to activate if the environment goes dark."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R5d';

-- R5e: EDR silenced on reachable hosts (partial blind) (Stage 5, High)
UPDATE public.tt_inject_cards SET
  body = $body$Endpoint telemetry from {{org_name}}'s EDR console has gone dark on 19 workstations simultaneously. Review of the affected hosts reveals that the EDR service was stopped via a remote command and service recovery options were cleared. The remaining monitored hosts continue to report normally, indicating the attacker has selectively blinded the portion of the environment they currently control.$body$,
  role_prompts = $rp${"ic": "Treat the 19 dark endpoints as fully compromised — determine what sensitive systems or data those hosts can reach and isolate them from the broader network.", "tl": "Attempt to restore EDR coverage on the affected hosts via out-of-band access; if that is not possible, network-isolate all 19 before the attacker extends their blind zone further.", "cl": "Alert leadership that an active attacker has selectively disabled endpoint monitoring — communications preparation should begin assuming a significant incident is developing.", "lc": "Advise on the notification obligations that arise from 19 hosts operating under confirmed attacker control without security monitoring, particularly if any hold personal data.", "es": "Authorize the operational disruption of isolating 19 endpoints — the risk of the attacker pivoting from those hosts to the domain controller outweighs the operational cost of taking them offline."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R5e';

-- R6a: Ransomware deployed via GPO or remote execution script (Stage 6, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s IT team has received a wave of reports from staff unable to access their files. A domain-wide Group Policy script has executed the ransomware payload on all domain-joined systems, and a ransom note has appeared on desktops across all sites. File servers hosting client data, financial records, and operational systems are encrypted and offline. The ransom demand includes a Tor-hosted portal link and a 72-hour contact deadline.$body$,
  role_prompts = $rp${"ic": "Formally declare the incident and activate the full IR plan — isolate the network perimeter, stand up your crisis team, and begin determining which systems may still be recoverable.", "tl": "Identify which servers are encrypted versus still running, prioritize systems with the highest recovery value, and confirm whether any clean backup copies exist and are accessible.", "cl": "Begin stakeholder communications immediately — clients, partners, and staff all need holding statements, and the ransom note will likely become public knowledge within hours.", "lc": "Begin assessing breach notification obligations — the encryption of customer data is a reportable event under multiple state laws and the notification clock is now running.", "es": "Authorize emergency spending for external IR services, legal counsel, and business continuity resources — confirm that the cyber insurance policy has been notified and that the insurer is engaged."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R6a';

-- R6b: Encrypt and threaten public data leak — double extortion (Stage 6, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s IT team has confirmed ransomware deployment across the production environment with all file servers encrypted. A ransom note on affected systems includes a link to a dark web site displaying a countdown timer and a sample of what the threat actors claim are files exfiltrated from the organization. The note threatens to publish the full dataset publicly within 96 hours if payment contact is not initiated.$body$,
  role_prompts = $rp${"ic": "Formally declare the incident and set the crisis response posture — the 96-hour publication threat creates a hard deadline and communications must begin immediately regardless of whether ransom is considered.", "tl": "Verify independently whether the files shown on the threat actor site are authentic and assess which systems and datasets are confirmed encrypted versus potentially recoverable.", "cl": "Prepare proactive client and stakeholder communications — it is better to notify affected parties directly before the data appears publicly on the threat actor site.", "lc": "Advise on whether paying the ransom creates any legal exposure, assess OFAC sanction screening obligations, and confirm the notification deadlines running from the confirmed breach.", "es": "Authorize external legal counsel and a public communications firm — the double-extortion model means this event will become public regardless of the payment decision, and the organization must be prepared."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R6b';

-- R6c: Backup destruction first, then encrypt — no clean recovery path (Stage 6, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$Encryption has been confirmed across {{org_name}}'s server infrastructure, and IT is reporting that no backup snapshots are available — both on-premises shadow copies and local backup agent data have been destroyed. The cloud backup tier shows a data gap beginning 20 hours ago, meaning the most recent recoverable state predates a full business day of transactions. A ransom note is present on all affected systems.$body$,
  role_prompts = $rp${"ic": "Formally declare the incident and begin assessing the full operational and financial impact — with no clean recovery path, the business continuity timeline must be established immediately.", "tl": "Confirm the absolute extent of the backup gap — identify every data source, test every potential recovery path, and give a realistic recovery time estimate for each critical system.", "cl": "Brief leadership on the severity — the loss of backup recovery options significantly changes the business impact profile and stakeholders need accurate information to make decisions.", "lc": "Assess all notification obligations and advise on the ransom payment decision — the lack of a recovery path changes the commercial calculus and legal counsel must be part of that conversation.", "es": "Authorize the full crisis response program and make a decision on the ransom payment question with legal counsel present — the absence of backup recovery makes this a genuine business continuity crisis."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'R6c';


-- ============================================================
-- BEC -- 16 cards, 5 stages
-- ============================================================

-- B1a: IT help-desk spear phish harvests executive M365 credentials (Stage 1, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s IT help-desk team has received a report that a senior executive cannot sign in to Microsoft 365. A review of sign-in logs reveals the account was successfully authenticated from an IP address in a foreign jurisdiction 90 minutes before the lockout, and a legacy authentication method not permitted under policy was used. The sign-in was followed by an immediate session token export consistent with adversary-in-the-middle credential capture.$body$,
  role_prompts = $rp${"ic": "Confirm the account is fully revoked across all active sessions and begin determining what the unauthorized session accessed in the 90-minute window before the lockout.", "tl": "Revoke all active sessions for the compromised account, disable legacy authentication for the tenant, and pull the full audit log of every action taken under that account in the past 24 hours.", "cl": "Monitor situation. No action required at this inject.", "lc": "Monitor situation. No action required at this inject.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B1a';

-- B1b: Attacker registers typosquat domain (Stage 1, Medium)
UPDATE public.tt_inject_cards SET
  body = $body$Domain monitoring has flagged the registration of a domain name differing from {{org_name}}'s own domain by a single character transposition. The domain was registered two days ago, has an active MX record configured to receive email, and carries an SSL certificate issued by a public CA. No inbound phishing attempts using this domain have been detected yet, but it has appeared in an OSINT feed associated with business email compromise campaigns.$body$,
  role_prompts = $rp${"ic": "Determine whether to take proactive action now — including alerting staff about the lookalike domain and notifying key financial and HR personnel to be vigilant for impersonation attempts.", "tl": "Submit a takedown request to the domain registrar and CA, and configure inbound mail filtering rules to flag or block email originating from the typosquat domain.", "cl": "Monitor situation. No action required at this inject.", "lc": "Monitor situation. No action required at this inject.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B1b';

-- B1c: Finance team password found in credential database (Stage 1, High)
UPDATE public.tt_inject_cards SET
  body = $body$A dark web monitoring alert has notified {{org_name}}'s security team that a valid email address and password belonging to a finance team member appear in a recently published credential database. The credential database originates from a breach at a third-party service provider, not from the organization's own systems. A check of Microsoft 365 sign-in logs confirms the affected account uses the same password and has no multi-factor authentication enrolled.$body$,
  role_prompts = $rp${"ic": "Force an immediate password reset on the affected account and confirm that MFA enrollment is completed before the account is returned to service.", "tl": "Audit the Microsoft 365 sign-in logs for the affected account over the past 30 days and check whether any suspicious access has already occurred using the compromised credential.", "cl": "Monitor situation. No action required at this inject.", "lc": "Monitor situation. No action required at this inject.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B1c';

-- B2a: Hidden inbox rules — attacker monitors payment approvals in real time (Stage 2, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s Microsoft 365 audit log has surfaced a new inbox rule on an executive account, created three days ago from an IP address outside the organization's known access locations. The rule silently forwards all emails containing payment, invoice, wire, and banking keywords to an external Hotmail address. The rule is configured to suppress forwarded messages from appearing in the Sent Items folder, making it invisible during a standard inbox review.$body$,
  role_prompts = $rp${"ic": "Treat the account as actively monitored by a threat actor — remove the inbox rule, revoke all active sessions, and assume all financial communications from that account for the past three days are compromised.", "tl": "Remove the forwarding rule, revoke all sessions, enable MFA if not active, and pull the complete list of emails forwarded to the external address to assess what intelligence the attacker has collected.", "cl": "Monitor situation. No action required at this inject.", "lc": "Assess whether the silent forwarding of email communications to an external party constitutes a reportable data breach under applicable state laws, particularly if the forwarded messages contained personal data.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B2a';

-- B2b: OSINT sweep reveals CFO name, approval thresholds, and vendor relationships (Stage 2, Medium)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s threat intelligence provider has observed an automated OSINT collection campaign targeting the organization's public web presence. The collected data includes the CFO's name and LinkedIn profile, board member relationships, annual report data including disclosed transaction volumes, and vendor names visible in press releases and regulatory filings. This profile is sufficient to construct a targeted social engineering attack without any direct system access.$body$,
  role_prompts = $rp${"ic": "Assess the organization's exposure — brief the CFO and finance team on the OSINT campaign and establish a verbal verification protocol for all wire or payment requests received via email.", "tl": "Review whether any of the harvested data points are accessible via automated scraping that could be removed or restricted without affecting legitimate public communications.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on whether the OSINT targeting constitutes a reportable precursor event and whether any disclosure obligations apply at this stage.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B2b';

-- B2c: Attacker reads live payment threads — vendor relationships and pending invoices catalogued (Stage 2, High)
UPDATE public.tt_inject_cards SET
  body = $body$Review of {{org_name}}'s compromised executive account has revealed that an unauthorized session has been actively reading email for the past six days. The session has accessed threads related to a pending vendor payment in the approval cycle, a construction project with an outstanding invoice, and a multi-year contract renewal currently under negotiation. No emails have been sent or deleted — the unauthorized activity has been read-only surveillance of live financial communications.$body$,
  role_prompts = $rp${"ic": "The attacker has six days of live payment intelligence — notify every counterparty in the accessed threads that their communications may have been read by an unauthorized party.", "tl": "Pull the complete list of threads accessed during the unauthorized session and determine whether any attachments containing bank account details or contract terms were opened.", "cl": "Monitor situation. No action required at this inject.", "lc": "Assess whether the read-only access to communications containing vendor and contract information constitutes a reportable data breach under applicable law.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B2c';

-- B3a: Attacker poses as CEO — targets CFO with confidential wire framing (Stage 3, High)
UPDATE public.tt_inject_cards SET
  body = $body$A {{org_name}} finance staff member has flagged a suspicious email appearing to come from the CEO requesting an urgent wire transfer. The email was sent from the CEO's personal Gmail address rather than the corporate domain, and it instructs the recipient to process a transfer as part of a confidential transaction that must not be discussed internally. The tone and writing style closely match the CEO's typical communication, and the email references real internal projects by name.$body$,
  role_prompts = $rp${"ic": "Confirm with the CEO directly via phone that this email was not sent by them, and brief the finance team immediately on the impersonation attempt.", "tl": "Investigate whether the CEO's corporate account or any other internal accounts show signs of compromise that could have provided the attacker with internal project names and communication context.", "cl": "Alert the finance team with specific guidance on verifying payment requests out-of-band, and assess whether a broader staff awareness notice is warranted.", "lc": "Advise on whether the social engineering attempt should be reported to law enforcement and what evidence preservation steps should be taken at this stage.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B3a';

-- B3b: Attacker impersonates vendor — sends updated banking details from lookalike address (Stage 3, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s accounts payable team has received an email requesting a banking details update for a legitimate vendor currently in an active payment cycle. The email was sent from a domain that differs from the vendor's actual domain by a single character substitution that is difficult to detect without close inspection. The message references the correct invoice number, the correct contact name at the vendor, and provides a plausible reason for the account change.$body$,
  role_prompts = $rp${"ic": "Direct the accounts payable team to halt all pending payments to this vendor until the banking change is verified out-of-band with the vendor using a contact number from your records, not from this email.", "tl": "Determine whether the level of internal detail in this email — invoice number, contact name — is consistent with information available from public sources, or whether it suggests internal email access.", "cl": "Issue an awareness notice to accounts payable and finance staff on the vendor impersonation pattern, including specific guidance on how to verify banking change requests.", "lc": "Advise on the organization's liability if a payment is processed to the fraudulent account before the verification step is completed.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B3b';

-- B3c: Thread hijack — attacker replies inline to active payment thread (Stage 3, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$A {{org_name}} finance team member has escalated a suspicious reply in an ongoing payment approval thread. The reply appears to originate from a senior executive's account using what appears to be an active authorized session, but it requests that an upcoming payment be redirected to a new bank account due to a temporary banking freeze. The reply is embedded inline within the existing conversation history, making it visually indistinguishable from a legitimate message.$body$,
  role_prompts = $rp${"ic": "Treat the executive account as actively compromised — freeze all pending payment approvals until account integrity is confirmed and the injected message is validated.", "tl": "Confirm whether the reply was sent from a legitimate authenticated session or injected via a compromised account; pull the full session log for the executive account at the time the message was sent.", "cl": "Alert all finance and accounts payable staff immediately — the thread hijack technique is highly convincing and any similar reply in an active payment thread should be flagged and verified out-of-band.", "lc": "Advise on the organization's liability exposure if any payments were redirected based on this message before the compromise was identified.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B3c';

-- B4a: Urgent same-day wire request — CEO cites confidential acquisition (Stage 4, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$A {{org_name}} finance team member has received a follow-up message from what appears to be the CEO, requesting same-day processing of a $285,000 wire transfer to a bank account in a new jurisdiction. The message states the transfer is related to a confidential acquisition that cannot be discussed with other staff, and explicitly instructs the recipient not to call to verify. The finance team member has never processed a same-day wire at this value without dual approval.$body$,
  role_prompts = $rp${"ic": "Confirm with the CEO directly by phone that this is a fraudulent request, and authorize the finance team to decline the transfer while the investigation is active.", "tl": "Determine how the attacker obtained sufficient internal context to reference a credible acquisition scenario, and assess whether any internal systems or email accounts have been compromised.", "cl": "Brief the finance team with clear guidance — any same-day wire request that bypasses normal approval process or prohibits phone verification is a fraud indicator and should never be processed.", "lc": "Advise on the steps to take if the transfer was partially processed before the fraud was identified, including bank recall procedures and law enforcement notification.", "es": "Confirm that no wire transfer is processed without dual approval and direct verification — authorize the finance team lead to enforce the hold without executive override until you have personally spoken with the CEO."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B4a';

-- B4b: Invoice arrives with updated ACH/wire details (Stage 4, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s accounts payable team has received what appears to be a reissued invoice from a regular vendor, arriving one week before a scheduled quarterly payment. The invoice amount matches the expected billing exactly, but the bank account and routing number have changed from the vendor's details on file. A follow-up email from the same address confirms the change is due to the vendor switching banking providers and requests the payment proceed as normal.$body$,
  role_prompts = $rp${"ic": "Halt the pending payment and direct the team to verify the banking change out-of-band with the vendor using only contact details from the organization's own records.", "tl": "Analyze the sender domain and email headers on the invoice and follow-up email to determine whether they originated from the legitimate vendor domain or a lookalike address.", "cl": "Issue guidance to accounts payable on the invoice substitution pattern — any banking detail change should require a callback verification using a known-good contact number before the payment is processed.", "lc": "Advise on the organization's liability and recovery options if the payment was processed to the fraudulent account, including bank recall timelines and any obligation to notify the legitimate vendor.", "es": "Confirm that the banking change verification protocol is enforced before any quarterly payment proceeds — authorize the accounts payable lead to hold the payment pending out-of-band confirmation."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B4b';

-- B4c: Payroll diversion — attacker impersonates employee to HR (Stage 4, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s HR department has received an email appearing to come from a mid-level employee requesting a direct-deposit account update effective from the next pay cycle. The email includes the employee's full name, employee ID number, and department, and cites a bank account closure as the reason for the urgent change. The HR staff member who received the request does not routinely verify direct-deposit changes by calling the employee directly.$body$,
  role_prompts = $rp${"ic": "Place a hold on all direct-deposit change requests submitted in the past week and direct HR to verify each one using a phone call to the employee's number on file, not the number in the request email.", "tl": "Determine whether the personal details in the request — employee ID, department — are available from any internal directory or HR system that may have been accessed externally.", "cl": "Issue an awareness notice to HR and payroll staff on the direct-deposit diversion pattern, and implement a policy requiring phone verification for all deposit change requests.", "lc": "Advise on the organization's obligations to affected employees if payroll funds were redirected, and assess whether the event requires regulatory or insurance notification.", "es": "Authorize a temporary hold on all payroll account changes until the verification procedure is confirmed to be in place — direct HR to implement the new control immediately."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B4c';

-- B4d: Thread hijack wire request — real payment thread continued with changed banking details (Stage 4, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$A thread hijack has been detected in {{org_name}}'s Microsoft 365 environment: a reply was inserted into an active vendor payment thread requesting that banking details be changed before the payment is processed. The reply was sent from within the legitimate conversation history and references the correct invoice amount and vendor contact name. The accounts payable staff member who received the message flagged it as suspicious because it arrived outside normal business hours.$body$,
  role_prompts = $rp${"ic": "Freeze all pending payments touched by this thread and confirm with the legitimate vendor by phone that the banking change request did not originate from them.", "tl": "Determine how the injected reply was inserted — confirm whether the originating account is compromised and pull the full session history for that account around the time of the suspicious reply.", "cl": "Alert accounts payable and finance staff broadly — the thread hijack technique exploits trusted conversation context and staff need to know that inline replies in payment threads can be fraudulent.", "lc": "Advise on liability exposure if any payment was processed based on the injected thread reply, and assess whether law enforcement notification is appropriate.", "es": "Authorize a cross-department communication to finance, accounts payable, and HR on the BEC threat patterns observed — this event indicates a sophisticated actor targeting the organization's payment processes."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B4d';

-- B5a: Wire transfer authorized and processed (Stage 5, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s finance team has confirmed that a wire transfer of $285,000 was authorized and processed this morning through the organization's banking portal. The receiving account is held at a bank in a jurisdiction with no prior vendor relationships on record. A callback to the vendor who appeared to request the transfer has confirmed they sent no such request — the fraud is confirmed, and the wire transfer processing window at the receiving bank closes in approximately 90 minutes.$body$,
  role_prompts = $rp${"ic": "Monitor situation. No action required at this inject.", "tl": "Monitor situation. No action required at this inject.", "cl": "Contact the bank immediately to initiate a wire recall and document every communication with the bank's fraud team with timestamps.", "lc": "Advise on the legal options available — including the bank recall window, law enforcement referral, and any notification obligation to regulators given the confirmed fraud amount.", "es": "Authorize the finance team to pursue every available bank recall channel simultaneously, and confirm that the cyber insurer is notified within the policy's required timeframe."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B5a';

-- B5b: Attacker calls back posing as bank to suppress cancellation (Stage 5, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$Following a suspicious wire transfer request at {{org_name}}, the CFO received an inbound phone call from a person identifying as the organization's bank relationship manager, claiming to call to verify the transfer and confirm everything is in order. The caller had the transfer amount, recipient account details, and the CFO's name correct. A call to the bank's published number has confirmed no such outbound verification call was initiated — the call was spoofed.$body$,
  role_prompts = $rp${"ic": "Monitor situation. No action required at this inject.", "tl": "Monitor situation. No action required at this inject.", "cl": "Contact the bank's published fraud hotline immediately — not the number that called in — and provide the details of the spoofed call alongside the wire transfer recall request.", "lc": "Advise on the law enforcement referral process for wire fraud and spoofed bank call combinations — this pattern may be reportable to IC3 and the FBI Cyber Division.", "es": "Authorize the finance team to initiate the wire recall through the bank's official fraud channel and confirm that all future bank communications are verified using published contact numbers only."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B5b';

-- B5c: Payroll diversion runs silently for three pay cycles before discovered (Stage 5, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s payroll audit has identified that an employee's direct-deposit account was changed three pay cycles ago and has been directing salary payments to an unrecognized external account. The affected employee reported non-receipt of pay after the third missed deposit, triggering the discovery. The cumulative amount diverted totals approximately $18,500, and the receiving account shows no activity between deposit dates, consistent with immediate withdrawal by a money mule.$body$,
  role_prompts = $rp${"ic": "Monitor situation. No action required at this inject.", "tl": "Monitor situation. No action required at this inject.", "cl": "Coordinate communications to the affected employee and determine whether a broader payroll audit is needed to confirm no other accounts were diverted in the same window.", "lc": "Advise on the law enforcement referral for the payroll fraud and assess whether the three-cycle delay in discovery creates any employer liability to the affected employee.", "es": "Authorize the payroll audit and confirm that the direct-deposit change verification protocol is now enforced for all future requests — this gap should be closed before the next pay cycle."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'B5c';


-- ============================================================
-- INSIDER THREAT -- 19 cards, 5 stages
-- ============================================================

-- I1a: Disgruntled IT admin queries HR and finance records outside job scope (Stage 1, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s SIEM has flagged an IT administrator account for abnormal database query activity over the past two weeks. The account has run 34 queries against HR and financial tables that fall entirely outside the documented scope of the IT function, and six of those queries were executed outside business hours. The administrator was informed last month that they had not been selected for a senior position, and a performance review is currently pending.$body$,
  role_prompts = $rp${"ic": "Open a covert internal investigation — assign a small team that excludes the subject's IT peers and determine the scope of the unauthorized data access without alerting the individual.", "tl": "Pull full database query logs for the flagged account for the past 30 days and preserve them as forensic evidence — do not make any access changes that could tip off the subject.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on the HR investigation framework, evidence preservation obligations, and what monitoring is permissible under applicable employment law before expanding surveillance.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I1a';

-- I1b: Sales rep accepts competitor position — begins archiving client data (Stage 1, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s DLP platform has triggered an alert on a sales representative's account that has accessed and exported client contact records, pricing schedules, and deal pipeline data over the past eight days. Cross-referencing with HR records shows the employee submitted a resignation letter two days ago with a four-week notice period. The volume and breadth of data accessed is significantly above the employee's established baseline activity.$body$,
  role_prompts = $rp${"ic": "Open a covert internal investigation focused on the scope of the data access — determine what has been accessed and whether any data has already left the network, without alerting the subject.", "tl": "Preserve forensic copies of endpoint activity and DLP logs for the subject's devices — check for USB connections, personal cloud sync activity, and outbound email forwarding.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on the employee's contractual obligations regarding confidential data and assess whether a legal hold and device return on last working day is appropriate.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I1b';

-- I1c: Finance analyst approached by external party for data-for-payment scheme (Stage 1, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s security team has received a tip that a finance analyst was approached via LinkedIn by someone posing as a recruiter who then pivoted to requesting internal financial data in exchange for payment. Review of the analyst's system access shows their permissions to financial reporting tables were expanded six weeks ago as part of a project. The analyst's recent access activity has been above baseline.$body$,
  role_prompts = $rp${"ic": "Treat this as a potential insider compromise in progress — open a covert investigation with legal counsel and determine whether any data has already been exfiltrated.", "tl": "Quietly review outbound transfer logs, cloud sync activity, and email forwarding for the analyst's devices over the past 30 days — preserve all logs without alerting the subject or their direct manager.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on the legal steps available at this stage, including whether law enforcement notification is appropriate, and what monitoring is permissible without tipping off the subject.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I1c';

-- I1d: Terminated employee AD account not disabled — remote access continues (Stage 1, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s HR system shows a network administrator's employment was terminated 48 hours ago following a disciplinary process. A routine access review has found the employee's Active Directory account is still enabled, VPN certificate valid, and Microsoft 365 license not revoked. Sign-in logs show two successful remote logins in the past 24 hours from a residential IP, with file access on shared drives occurring after the termination date.$body$,
  role_prompts = $rp${"ic": "Treat this as an active unauthorized access event — coordinate immediate account suspension across all systems and assess what the former employee has accessed since the termination date.", "tl": "Immediately disable the AD account, revoke the VPN certificate, and suspend the M365 license — then pull a full activity log of all actions performed under that account in the past 48 hours.", "cl": "Monitor situation. No action required at this inject.", "lc": "Assess the criminal exposure for the former employee and advise on the organization's reporting obligations — post-termination unauthorized access may constitute computer fraud.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I1d';

-- I2a: Privileged user runs broad database queries — maps PII and financial tables (Stage 2, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s database activity monitoring has generated a high-severity alert for a privileged service account that has been running iterative SELECT queries across every table in the production database over a 4-hour window. The queries follow a systematic pattern consistent with schema discovery and data volume mapping, rather than any defined application workflow. The account is linked to an IT administrator who normally accesses only two specific tables for maintenance purposes.$body$,
  role_prompts = $rp${"ic": "Convene the investigation team and determine whether this represents active data reconnaissance — decide whether to maintain covert observation or escalate to a containment action.", "tl": "Capture and preserve all database query logs from the flagged session — identify which tables containing PII, financial records, or intellectual property were accessed and in what volume.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on whether the scope of the database access triggers any breach assessment obligations at this stage, even before exfiltration is confirmed.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I2a';

-- I2b: Standard user browses restricted file shares (Stage 2, Medium)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s file server access logs show a standard user account has traversed file share directories well outside the scope of their job function over three consecutive days. The browsing pattern indicates the user has accessed folders containing executive compensation data, M&A documents, and employee personal records — none of which are accessible under the documented access policy for this role. No file downloads or bulk copies have been detected at this stage.$body$,
  role_prompts = $rp${"ic": "Assess whether the file share access represents a reconnaissance phase and decide whether to tighten access controls on the exposed folders immediately or hold to gather more investigation evidence.", "tl": "Determine which folders were accessed and what permission gap allowed a standard user account to reach restricted directories — document the finding for the investigation record.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise whether accessing executive compensation or M&A documents without authorization creates immediate legal liability for the individual or reporting obligations for the organization.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I2b';

-- I2c: Insider tests DLP behavior — confirms personal cloud storage is unscanned (Stage 2, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s endpoint monitoring has detected a pattern of small file transfers from a workstation to a personal cloud storage service over a 72-hour window. The files transferred are non-sensitive test documents, but the activity pattern is consistent with probing DLP enforcement boundaries to confirm which transfer methods pass undetected. The endpoint DLP policy does not currently scan personal cloud storage applications accessed through the browser.$body$,
  role_prompts = $rp${"ic": "Treat this as pre-exfiltration behavior and determine whether the DLP gap should be closed immediately or monitored to gather more evidence before taking action.", "tl": "Confirm the full extent of the DLP coverage gap for browser-based cloud storage transfers and assess whether any sensitive files have already moved through the same channel undetected.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on how long the investigation can proceed covertly before any legal or HR disclosure obligation is triggered by the observed behavior.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I2c';

-- I2d: Terminated employee uses stale VPN credentials to re-enter environment (Stage 2, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s VPN gateway has logged two successful remote access sessions from a residential IP using credentials assigned to an employee whose departure was processed by HR 11 days ago. The combined sessions total 3 hours and 20 minutes of file server navigation and document access. The account was not disabled at termination because the offboarding checklist was not fully completed and the AD account was not cross-referenced against the HR departure log.$body$,
  role_prompts = $rp${"ic": "This is unauthorized access by a former employee — determine what data was accessed across both sessions and assess whether immediate legal action is required.", "tl": "Disable all remaining access paths for the terminated account immediately and forensically preserve all activity logs from both VPN sessions before any remediation steps.", "cl": "Monitor situation. No action required at this inject.", "lc": "Assess the criminal exposure for the former employee and the organization's reporting obligations — advise on whether law enforcement notification is appropriate at this stage.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I2d';

-- I3a: Insider runs bulk export of customer database to local Downloads folder (Stage 3, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s database activity monitoring has captured a bulk data export from the production customer database to a local folder on the insider's workstation. The export contains 3.2 GB of structured data including customer names, addresses, email addresses, and transaction history, and was executed using a stored query that accessed every record in the table. The export occurred at 11:47 PM on a weeknight, and no business justification has been submitted.$body$,
  role_prompts = $rp${"ic": "The staging phase is confirmed — decide whether to move to containment now or allow continued observation to establish the full scope of the insider's intent before acting.", "tl": "Preserve a forensic image of the workstation's Downloads folder immediately and determine whether the exported file has been copied to any other location or device.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on breach notification timing — at what point does the staging of customer PII create a reportable incident, even before exfiltration has been confirmed?", "es": "Authorize the investigation team to move to active containment if counsel advises — this situation carries regulatory and commercial consequences that may require accelerated decision-making."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I3a';

-- I3b: Files copied to personal Dropbox via browser — DLP gap confirmed exploited (Stage 3, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s endpoint monitoring has confirmed that a previously identified DLP coverage gap has been actively exploited: a user has transferred files containing customer contact records and pricing schedules to a personal Dropbox account via the browser interface. The total volume transferred is 840 MB across 14 upload sessions over two days. The files include data categorized as confidential under the organization's data classification policy.$body$,
  role_prompts = $rp${"ic": "The DLP gap has been exploited — decide whether to block the cloud storage service at the perimeter immediately or allow continued observation under monitoring.", "tl": "Determine the full scope of what was uploaded to the Dropbox account and assess whether the organization has any ability to issue a data deletion request to Dropbox under its business terms.", "cl": "Monitor situation. No action required at this inject.", "lc": "Assess whether the confirmed transfer of confidential customer data to a personal cloud account triggers a breach notification obligation and what the notification timeline is.", "es": "Be prepared to authorize external legal counsel engagement — the confirmed exfiltration of classified data to a personal cloud account carries commercial and regulatory consequences."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I3b';

-- I3c: USB device plugged in — 6 GB copied in 20 minutes after hours (Stage 3, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s endpoint security platform has generated a data-at-rest alert for a USB mass storage device connected to a finance department workstation at 6:14 PM — 44 minutes after the documented badge-out time for that floor. The device was connected for 22 minutes, during which 6.1 GB of files were copied from the workstation's local drives. The copied files include customer database exports, contract templates, and a folder labeled with a client name.$body$,
  role_prompts = $rp${"ic": "This may be an in-progress staging event — determine whether physical containment of the device and the individual is feasible before they leave the building.", "tl": "Pull the full USB device log including device serial number and file copy manifest, and determine whether the same device has been connected to this workstation on any prior occasion.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on whether the circumstances — a large after-hours USB copy in a sensitive area — are sufficient grounds for a device search or employment suspension pending investigation.", "es": "If the individual is still on premises, you may need to authorize a physical security intervention — decide whether to engage building security now or escalate to HR and legal first."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I3c';

-- I3d: Files emailed to personal Gmail in small batches over two weeks (Stage 3, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s Microsoft 365 DLP policy has generated a low-confidence alert pattern that, when correlated across a 14-day window, reveals an employee sending 4 to 6 files per day to a personal Gmail address in batches small enough to fall below individual alert thresholds. The cumulative total is 312 files, and sampling of the attachment names indicates the files include client contracts, technical specifications, and employee HR records. The pattern became visible only on retrospective analysis.$body$,
  role_prompts = $rp${"ic": "Authorize an expanded forensic review of all email activity from this account over the past 30 days and determine whether a suspension pending investigation is appropriate.", "tl": "Pull the full list of files sent to the external Gmail address and prioritize identifying any that fall under categories triggering regulatory breach notification obligations.", "cl": "Monitor situation. No action required at this inject.", "lc": "Assess whether the confirmed transfer of HR records and client contracts to a personal email account creates immediate notification obligations or enables a legal hold action.", "es": "Authorize accelerated investigation — the slow-exfiltration pattern indicates sophisticated insider intent, and the longer observation continues without containment, the greater the cumulative exposure."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I3d';

-- I4a: Insider resigns and walks out with USB containing client database (Stage 4, High)
UPDATE public.tt_inject_cards SET
  body = $body$During an exit interview at {{org_name}}, a departing employee's bag was found to contain a USB drive after they mentioned uploading their work files during the conversation. Preliminary review confirms the USB contains the organization's customer database, competitive pricing models, and an employee directory with personal contact information. The departing employee is asserting the data is their own work product and declining to surrender the device voluntarily.$body$,
  role_prompts = $rp${"ic": "This is an active data recovery situation — determine your response posture and coordinate immediately with legal counsel on whether to involve law enforcement.", "tl": "Preserve forensic copies of all system logs documenting when and how the USB data was copied — this evidence package will be required for any legal or criminal action.", "cl": "Prepare for potential client disclosure — if the customer database is confirmed to have left the building, client notification may be required depending on the data content.", "lc": "Advise on immediate legal steps to recover the USB device, and assess the options including a civil injunction or criminal referral based on the evidence available.", "es": "Authorize legal counsel to proceed with the most appropriate escalation path — this situation carries significant regulatory and reputational impact and requires a senior decision on next steps."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I4a';

-- I4b: Cloud sync completes overnight — 4.7 GB confirmed on personal device (Stage 4, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s forensic review of a cloud storage account linked to an employee whose file access patterns triggered a DLP alert has confirmed that 4.7 GB of data synchronized to a personal device overnight. The data includes structured CRM exports, a complete copy of the contract management folder, and files tagged as containing payment card data. The cloud provider's logs show the download was made by a device registered in a different city from where the employee is known to work.$body$,
  role_prompts = $rp${"ic": "The data has confirmed left the network — move to the post-exfiltration response phase and assess what notification obligations and containment steps now apply.", "tl": "Preserve all cloud activity logs and determine whether the synchronized data has been further shared or downloaded to any other location from the personal device.", "cl": "Begin drafting external communications — client notification may be required given the confirmed exfiltration of CRM data and payment card-related files.", "lc": "Assess breach notification obligations for the confirmed exfiltration of payment card data and CRM records, and determine the regulatory timeline that applies.", "es": "Authorize engagement of external legal counsel and, if payment card data is confirmed in scope, initiate contact with the organization's cyber insurer immediately."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I4b';

-- I4c: IR team finds local staging file — forensics confirms prior USB copy already made (Stage 4, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s IR team has located a bulk data export file in a staging folder on a monitored workstation, but forensic analysis of the device's USB activity log has confirmed that a copy of the same dataset was made to an external drive three days earlier. The prior USB copy predates the current investigation window, meaning the data has already left the organization's control. The staged local file appears to be a second copy intended for a different exfiltration channel.$body$,
  role_prompts = $rp${"ic": "Reframe the investigation scope — the primary exfiltration has already occurred; focus now on confirming what was taken, when, and to whom it may have been provided.", "tl": "Recover the USB device activity log including device identifier and copy timestamps, then cross-reference with building badge records to establish a physical custody timeline.", "cl": "The confirmed data loss may require external notification — begin assessing which clients or individuals are affected based on the confirmed file content of the staging export.", "lc": "Advise on the notification obligations that now apply given confirmed data loss, even though the physical medium containing the data has not yet been recovered.", "es": "The situation now carries both regulatory and commercial notification risk — authorize legal counsel to begin the breach notification assessment process immediately."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I4c';

-- I4d: Insider transfers data directly to competitor via secure file transfer (Stage 4, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s network monitoring has detected a large outbound secure file transfer to a domain registered to a direct competitor, totaling 2.3 GB over a 40-minute window. The transfer was initiated from the workstation of a recently resigned employee whose last working day is two days away. The transferred data originated from a shared drive containing the client list, product roadmap, and current contract pricing — all classified as confidential under the organization's information security policy.$body$,
  role_prompts = $rp${"ic": "This is a suspected corporate espionage event in progress — determine whether to immediately revoke all system access for the employee or continue observation to gather further evidence.", "tl": "Preserve all transfer logs and attempt to identify the exact files sent — determine whether any additional transfers have been made to the same destination or to other external parties.", "cl": "Prepare for potential competitive harm disclosure — if client data was transferred, affected clients may need to be notified depending on the confirmed data content.", "lc": "Advise on immediate legal options to prevent further data transfer, including whether a civil injunction or law enforcement notification is warranted at this stage.", "es": "This event has direct competitive and commercial consequences — authorize legal counsel to take immediate protective action and assess whether proactively notifying affected clients is advisable."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I4d';

-- I5a: Competitor announces product matching stolen IP within 90 days (Stage 5, High)
UPDATE public.tt_inject_cards SET
  body = $body$A {{org_name}} product manager has flagged that a competitor has publicly announced a new product feature set that closely mirrors the organization's own internal roadmap documents. The feature names, architecture patterns, and pricing tiers in the competitor's announcement align with confidential documents confirmed to have been exfiltrated in a prior insider incident. Legal counsel has reviewed the announcement and assessed the similarity as unlikely to be coincidental.$body$,
  role_prompts = $rp${"ic": "Coordinate with legal counsel on whether to file a formal legal claim — this development represents potential evidence that exfiltrated intellectual property has been actively used.", "tl": "Prepare a technical evidence package documenting the provenance and content of the original roadmap documents for use in potential litigation.", "cl": "Assess whether a public statement is warranted — clients and partners may ask questions if the product similarity becomes public knowledge, and a proactive response may be preferable.", "lc": "Advise on the litigation strategy and whether an emergency injunction to halt the competitor's product launch is viable based on the available IP theft evidence.", "es": "Authorize legal counsel to file the appropriate action and assess whether public disclosure of the underlying incident is strategically advisable given the competitive context."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I5a';

-- I5b: Regulatory notification required — PII of 50,000+ individuals confirmed exfiltrated (Stage 5, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s forensic review has confirmed that the exfiltrated dataset contains personally identifiable information for 52,400 individuals, including names, email addresses, home addresses, and a subset of payment card data. Under applicable US state data breach notification laws, this volume and category of data triggers mandatory notification to affected individuals and in several states to the state attorney general within a defined window. The organization has not previously managed a notification event of this scale.$body$,
  role_prompts = $rp${"ic": "Confirm the breach scope with legal counsel and initiate the formal breach response protocol — this event meets the threshold for mandatory regulatory notification.", "tl": "Finalize the forensic evidence package documenting what data was exfiltrated, from which systems, and in what timeframe — this will be required for both regulatory filings and insurer notification.", "cl": "Begin planning the individual notification program — draft the notification letter template and identify the channel and timeline for delivery to 52,400 affected individuals.", "lc": "Identify which state notification requirements apply given the geographic distribution of affected individuals, and confirm the notification deadlines that are now running.", "es": "Authorize the budget for the notification program, external legal counsel, and any credit monitoring services that may be required — this event has defined regulatory costs that cannot be deferred."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I5b';

-- I5c: Insider arrested at airport — USB seized, criminal referral filed (Stage 5, High)
UPDATE public.tt_inject_cards SET
  body = $body$Law enforcement has notified {{org_name}}'s legal counsel that a former employee was stopped at an international airport and a USB device containing a copy of the organization's customer database was seized. A criminal referral previously filed by the organization has resulted in a formal arrest, and the USB is now in law enforcement custody as evidence. A forensic examination is underway, but the individual had been in possession of the data for 19 days prior to the seizure.$body$,
  role_prompts = $rp${"ic": "Coordinate with law enforcement on evidence access and ensure the organization's incident response aligns with the active criminal investigation process.", "tl": "Provide law enforcement with the complete forensic package documenting the original theft, chain of custody, and any evidence of data access or copying after the initial exfiltration event.", "cl": "Prepare a stakeholder communication plan — the arrest may become public, and clients whose data was confirmed on the recovered USB should be informed of the outcome.", "lc": "Coordinate with law enforcement to confirm the evidentiary status of the USB and advise on the organization's role in and obligations to the prosecution.", "es": "Assess whether the partial data recovery and criminal arrest enable a revised breach notification approach — legal counsel should advise on whether the seizure affects outstanding notification obligations."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'I5c';


-- ============================================================
-- VENDOR COMPROMISE -- 17 cards, 5 stages
-- ============================================================

-- V1a: MSP management console accessed via credential stuffing (Stage 1, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s managed service provider has notified the organization that their RMM management console was accessed by an unauthorized actor using valid credentials obtained through a credential stuffing attack. The MSP has confirmed the compromised account used a password found in a publicly known credential breach database, and the account did not have multi-factor authentication enabled. The RMM console provides agent-level access to all environments under MSP management, including the organization's own.$body$,
  role_prompts = $rp${"ic": "Assess the scope of exposure — determine what level of access the RMM agent has in the organization's environment and whether emergency isolation of the agent is feasible.", "tl": "Audit all RMM agent activity in the organization's environment over the past 72 hours and flag any unauthorized commands or connections executed under the compromised session.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on the organization's rights under the MSP contract in the event that the vendor's security failure has created an exposure — preserve documentation of the MSP's notification.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V1a';

-- V1b: MSP technician spear-phished — RAT installed on workstation (Stage 1, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s MSP has reported that a senior technician received a targeted phishing email and executed a malicious attachment, resulting in a remote access trojan being installed on their workstation. The technician's workstation has persistent, privileged access to all managed client environments, and the RAT has been communicating outbound for an estimated 36 hours before detection. The MSP is still assessing which client environments may have been accessed using the technician's credentials.$body$,
  role_prompts = $rp${"ic": "Treat this as a live threat in the organization's environment — begin immediately auditing all recent administrative actions taken via the MSP's tooling in the organization's systems.", "tl": "Pull all RMM session logs and remote connection records attributable to the compromised technician's credentials and flag any unusual commands or connections in the organization's environment.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on the notification obligations that may apply if it is confirmed that the third-party vendor's compromise has exposed the organization's systems or data.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V1b';

-- V1c: SaaS vendor API key exposed in public GitHub repository (Stage 1, High)
UPDATE public.tt_inject_cards SET
  body = $body$A security researcher has contacted {{org_name}}'s security team to report that an API key providing access to the organization's account on a SaaS platform was found in a public GitHub repository belonging to the SaaS vendor's development team. The key was committed six months ago and has not been rotated. GitHub's secret scanning service did not alert because the repository was initially private and was made public three weeks ago during a vendor repositioning exercise.$body$,
  role_prompts = $rp${"ic": "Determine the scope of what the exposed API key could access in the organization's account and prioritize revocation before assessing what may have been accessed during the exposure window.", "tl": "Revoke the exposed API key immediately and audit all API calls made using that key over the past three weeks for any unauthorized activity patterns.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on whether the vendor's failure to protect the API key constitutes a breach under the organization's contract and what the contractual notification obligations are.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V1c';

-- V1d: Trojanized software update — backdoor in signed patch pushed to all endpoints (Stage 1, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s endpoint management platform has flagged that a software update distributed by a trusted vendor last night included a component that does not match the vendor's published build hash. The update was digitally signed with the vendor's valid certificate and passed all automated verification checks at the perimeter. A threat intelligence alert published this morning has flagged the same update as containing a backdoor that establishes outbound connectivity on installation — and the update has already been applied to all endpoints on the organization's managed update policy.$body$,
  role_prompts = $rp${"ic": "Determine the scale of impact — identify all endpoints where the update has been installed and assess whether the backdoor is currently active on any of them.", "tl": "Immediately revoke the update policy and block the vendor's update server at the perimeter — begin endpoint scanning to identify and kill any active backdoor processes.", "cl": "Monitor situation. No action required at this inject.", "lc": "Review the vendor contract for warranty and indemnification provisions and advise on whether to formally notify the vendor that their update has compromised the organization's environment.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V1d';

-- V2a: Attacker maps all client orgs in MSP console (Stage 2, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s MSP has reported that further forensic analysis of the compromised console session confirmed the attacker ran a systematic enumeration of all client organizations registered in the platform. The enumeration collected each client's environment profile, installed agent versions, operating system inventory, and open service ports. The attacker now has a complete map of every managed environment, including the organization's full asset footprint and the administrative access paths available through the RMM agent.$body$,
  role_prompts = $rp${"ic": "Treat the asset enumeration as pre-attack reconnaissance — assess which of the organization's exposed assets are the highest-priority targets and begin hardening or isolating them before the next attacker action.", "tl": "Pull the organization's current RMM agent configuration and determine exactly what the agent is capable of executing in the environment — this represents the attacker's current operational capability.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on the organization's disclosure obligations if a full asset profile has been exposed to an unauthorized actor, particularly if the profile includes systems holding personal data.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V2a';

-- V2b: API documentation and live traffic reviewed — full customer PII scope confirmed (Stage 2, Medium)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s SaaS vendor has confirmed that the exposed API key was used to make authenticated API calls that accessed the account configuration object, the API reference documentation endpoint, and a paginated listing of all customer records within the key's permission scope. The calls were made programmatically from an IP address not associated with any known integration. The vendor has confirmed the key's read scope included the organization's complete customer PII dataset.$body$,
  role_prompts = $rp${"ic": "Treat this as a confirmed data exposure — the complete customer PII dataset has been accessed by an unauthorized party and must be treated as compromised pending full investigation.", "tl": "Obtain the complete API access log from the vendor and determine the exact records accessed, including timestamps and total record count.", "cl": "Monitor situation. No action required at this inject.", "lc": "Assess the breach notification obligations that apply given the confirmed unauthorized access to the full customer PII dataset via the vendor's system.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V2b';

-- V2c: Update server confirms client auto-update targets — 3-hour push window (Stage 2, High)
UPDATE public.tt_inject_cards SET
  body = $body$Threat intelligence analysts have confirmed that the compromised vendor's update server was used to analyze which client organizations had auto-update enabled and what the next scheduled push window was. {{org_name}} is among 31 client organizations identified as having auto-update active, and the trojanized update has been queued for distribution in the next automatic update cycle beginning in approximately 3 hours.$body$,
  role_prompts = $rp${"ic": "Determine whether to block the vendor's update server at the network perimeter immediately or accept the risk of the trojanized update installing during the 3-hour window.", "tl": "Identify all endpoints with automatic update enabled and assess whether an emergency manual block can be pushed to each device before the scheduled push window opens.", "cl": "Monitor situation. No action required at this inject.", "lc": "Advise on the organization's notification obligations to its own clients if the trojanized update installs and causes a downstream security incident.", "es": "Monitor situation. No action required at this inject."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V2c';

-- V3a: RMM tool executes unauthorized PowerShell across all managed clients (Stage 3, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s endpoint monitoring has detected a PowerShell command executed via the MSP's RMM agent that is not associated with any scheduled task or authorized change ticket. The command ran on all managed endpoints simultaneously, retrieving system configuration, active user sessions, and a listing of running processes. Execution used the RMM agent's SYSTEM-level context, generated no EDR alert because it originated from a trusted tool, and completed across the entire environment in under 4 minutes.$body$,
  role_prompts = $rp${"ic": "An unauthorized command has been executed across the entire environment — determine whether this represents intelligence gathering or the start of an active attack, and decide whether to disconnect the RMM agent immediately.", "tl": "Recover the full output of the PowerShell command if possible — identify what information was collected and to which external destination it may have been transmitted.", "cl": "Begin preparing for disclosure — assess what would need to be communicated to clients or regulators if this event is confirmed as a breach.", "lc": "Advise on the legal implications of an unauthorized command executed across all organization systems via a trusted third-party tool, and whether the MSP bears liability.", "es": "Authorize the security team to disconnect the RMM agent across the entire environment if the MSP cannot confirm the command was authorized — the risk of continued agent access outweighs the operational disruption."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V3a';

-- V3b: API token used to pull live customer PII via trusted integration (Stage 3, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s SaaS vendor has confirmed that a second series of API calls using the exposed key retrieved the organization's full customer PII dataset in a paginated download completed over a 2-hour session. The data includes names, addresses, email addresses, and transaction histories for all active customers. The API call pattern matched a legitimate integration workflow, meaning no rate-limiting or anomaly detection triggered during the download.$body$,
  role_prompts = $rp${"ic": "The complete customer PII dataset has been exfiltrated via the vendor's API — initiate the breach response protocol and begin preparing for regulatory notification.", "tl": "Obtain the full API activity log and confirm the exact records accessed — determine whether any data beyond the customer PII dataset was accessed during the same session.", "cl": "Begin drafting customer breach notification — if customer PII has been confirmed exfiltrated through a third-party vendor's system, individual notification will be required.", "lc": "Assess the notification obligations and timelines that apply to the confirmed exfiltration of customer PII from a vendor-managed integration.", "es": "Authorize immediate engagement of external legal counsel and the cyber insurer — this is a confirmed data breach with a defined and significant customer impact."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V3b';

-- V3c: Trojanized update auto-installs on 23 client endpoints — backdoor active (Stage 3, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s endpoint management has confirmed that a recently flagged malicious software update distributed via the vendor's update infrastructure has been installed on 23 endpoints across the environment. All 23 endpoints are now running the backdoor component, which has established outbound communication sessions to an external command-and-control server. The update arrived with the vendor's valid digital signature and all 23 installations passed certificate verification.$body$,
  role_prompts = $rp${"ic": "The backdoor is active on 23 production endpoints — determine whether to isolate all 23 immediately and accept the operational impact, or pursue targeted containment while investigation continues.", "tl": "Identify all 23 affected endpoints, their network segments, and their access to sensitive systems — begin isolating the most critical systems first.", "cl": "Prepare external communications — 23 compromised production endpoints may require disclosure to clients whose data those systems process or store.", "lc": "Advise on the disclosure obligations triggered by confirmed active malware on production systems, particularly for any systems handling personal data or payment information.", "es": "Authorize the operational impact of isolating all 23 affected endpoints — this is a contained active compromise and delay increases the risk of lateral movement to unaffected systems."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V3c';

-- V3d: Attacker selects highest-value client from MSP console — 47-minute targeted pivot (Stage 3, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s MSP has identified that the unauthorized actor narrowed their targeting from the full client list to a subset of three high-value clients, and the organization is among them. The targeting criteria appear to have been based on annual revenue figures visible in the MSP console's client profile fields. A privileged RMM agent session was opened to the organization's environment specifically and was active for 47 minutes before the MSP revoked the compromised credential.$body$,
  role_prompts = $rp${"ic": "The organization was specifically selected as a high-value target — treat this as a targeted attack and conduct a full audit of everything the attacker's 47-minute session may have accessed or modified.", "tl": "Reconstruct the complete activity log of the 47-minute RMM session — every command executed, every file accessed, every credential that may have been exposed or captured.", "cl": "Assess whether the targeted nature of this breach changes the disclosure posture — clients of the organization should be informed if their data was within scope of the accessed systems.", "lc": "Advise on the disclosure obligations that apply and whether the MSP's failure to revoke the compromised credential promptly creates contractual or legal liability.", "es": "This was a targeted attack on the organization specifically — authorize escalated response resources and assess whether the organization's own clients need proactive notification."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V3d';

-- V4a: BloodHound-equivalent run via RMM — full AD map acquired, two DA paths confirmed (Stage 4, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s Active Directory monitoring has detected that a BloodHound-style directory enumeration script was executed via the RMM agent in the past 24 hours, collecting a complete map of the AD environment including all users, groups, group memberships, service accounts, and delegation paths. The attacker has identified two service accounts with paths to domain administrator privileges. The collected data has been transmitted outbound over the RMM agent's existing C2 channel.$body$,
  role_prompts = $rp${"ic": "The attacker has a complete privilege escalation roadmap for this environment — this is one action away from domain-wide compromise and containment must begin immediately.", "tl": "Immediately rotate the passwords on the two service accounts with domain admin escalation paths and assess whether either account has already been used from an external source.", "cl": "Begin preparing breach notification drafts — if the full AD map has been exfiltrated and the environment is about to be compromised, client data systems may be affected within hours.", "lc": "Advise on the disclosure obligations at the pre-impact stage and whether proactive regulator notification is appropriate given the confirmed scope of the AD enumeration.", "es": "Authorize emergency external IR engagement and budget for specialist assistance — this is an active, targeted attack that is one step away from domain-level impact."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V4a';

-- V4b: API pivot — complete customer PII dataset staged for bulk export (Stage 4, High)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s SaaS vendor has confirmed that the unauthorized API session has accessed every customer-facing data object within the organization's account and has begun staging the full dataset for bulk export. The total dataset includes records for all active and former customers, encompassing names, contact information, purchase histories, and payment method metadata. The bulk export has not yet completed but is estimated to finish within 2 to 3 hours at the current transfer rate.$body$,
  role_prompts = $rp${"ic": "The exfiltration is in progress with a 2-to-3-hour window remaining — determine whether the API key can be revoked immediately to halt the export before it completes.", "tl": "Contact the SaaS vendor and request emergency revocation of the API key and interruption of the active session — simultaneously audit all other integration keys in the environment for similar exposure.", "cl": "Begin drafting customer breach notification in parallel with the containment effort — if the export completes, individual notification will be required for all affected customers.", "lc": "Confirm the regulatory notification timeline that applies if the export completes and advise on whether proactive regulator contact is warranted given the known exposure window.", "es": "Authorize emergency contact with the SaaS vendor at executive level to request immediate session termination — the window to prevent full exfiltration is closing."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V4b';

-- V4c: Backdoor on 23 endpoints begins silent credential harvesting for 72 hours (Stage 4, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$Forensic analysis of the backdoor component installed on {{org_name}}'s endpoints has confirmed it has been operating a keylogger and credential-harvesting module for the past 72 hours. Credentials captured include VPN authentication tokens, Active Directory service account passwords, and plaintext credentials for two internal web applications. All harvested credentials have been transmitted to the external C2 server already receiving the backdoor's command-and-control traffic.$body$,
  role_prompts = $rp${"ic": "Domain-level credentials have been exfiltrated — initiate emergency credential rotation across all affected accounts and begin planning for a post-credential-harvest attack as the next likely step.", "tl": "Identify every credential captured by the keylogger and prioritize rotation starting with privileged accounts — check whether any of the stolen credentials have already been used from an external source.", "cl": "Prepare for client disclosure — if any of the harvested credentials provide access to systems holding client data, the breach scope may extend beyond the organization's own systems.", "lc": "Assess the breach notification obligations triggered by the confirmed exfiltration of authentication credentials, particularly for service accounts with access to personal data systems.", "es": "Authorize the operational disruption required for emergency credential rotation across the domain — this is a necessary step to prevent a wider attack using the confirmed stolen credentials."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V4c';

-- V5a: Ransomware deployed across all managed client environments via RMM (Stage 5, Critical)
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s IT team and MSP have both confirmed simultaneous ransomware deployment across all managed client environments: the attacker used the RMM tool to distribute and execute a ransomware payload to every endpoint under management. File servers, workstations, and backup systems across all affected client environments are encrypted, and ransom notes demand payment within 48 hours. The attack has affected all MSP-managed clients simultaneously, and the MSP's own operations are also dealing with encrypted systems.$body$,
  role_prompts = $rp${"ic": "This is a mass-impact event affecting all clients simultaneously — coordinate with the MSP on the joint response posture and prioritize which client environments are most critical to restore first.", "tl": "Assess which systems have valid offline or air-gapped backups that predate the attack and begin recovery planning for the highest-priority client environments.", "cl": "Begin drafting client notifications immediately — all affected clients must be informed, and communications will need to be coordinated with the MSP's own public response.", "lc": "Assess the liability exposure for an event originating with a third-party vendor that has affected all clients simultaneously — regulatory notification obligations may span multiple client jurisdictions.", "es": "Authorize emergency resources for the simultaneous response across all affected client environments and initiate contact with the cyber insurer under a mass-impact event claim."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V5a';

-- V5b: Complete customer PII exfiltrated silently via API — discovered weeks later via dark web (Stage 5, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$A dark web monitoring alert has notified {{org_name}}'s security team that a dataset matching the organization's customer records has appeared on a threat actor forum. The dataset includes names, email addresses, physical addresses, and partial payment method information for all active customers. Internal investigation has confirmed the data was exfiltrated via the organization's SaaS vendor's API during a recent security incident, during which the export activity was not flagged because it matched a legitimate integration pattern.$body$,
  role_prompts = $rp${"ic": "The breach is confirmed and the data is already publicly accessible — shift focus to regulatory notification, customer communication, and root-cause remediation.", "tl": "Perform a full audit of API access logs for the identified exfiltration window and confirm the exact scope of records included in the leaked dataset.", "cl": "Begin drafting customer breach notification immediately — the data is circulating publicly, and proactive customer communication is essential before media coverage occurs.", "lc": "Assess the regulatory notification obligations now that a confirmed exfiltration has been verified via dark web discovery, and advise on the applicable filing timelines.", "es": "Authorize the full breach response program including customer notification, credit monitoring services, and external legal counsel — this event has confirmed regulatory and reputational consequences."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V5b';

-- V5c: Client admin credentials sold on dark web — multiple threat actors have independent access (Stage 5, Critical)
UPDATE public.tt_inject_cards SET
  body = $body$Threat intelligence has confirmed that domain administrator credentials harvested from {{org_name}}'s environment have been listed for sale on a dark web marketplace, and purchase activity indicates they have been acquired by at least two separate threat actors. The credentials have not yet been rotated, meaning the environment is currently accessible to multiple independent unauthorized parties. A new authentication event from an unrecognized IP address was observed on the domain controller 40 minutes ago.$body$,
  role_prompts = $rp${"ic": "Multiple threat actors now hold valid domain administrator credentials — initiate emergency credential rotation immediately and treat the environment as fully compromised.", "tl": "Immediately rotate all domain administrator passwords and revoke all active sessions — change the KRBTGT password twice to invalidate all existing Kerberos tickets in the environment.", "cl": "Prepare for client notification — if domain admin access is confirmed across multiple threat actors, client data systems under this domain are actively at risk and clients should be informed.", "lc": "Advise on the notification obligations that apply when credentials are confirmed for sale on the dark web and have potentially been acquired by multiple independent parties.", "es": "Authorize emergency external IR engagement immediately — multiple independent threat actors with valid domain admin credentials is a maximum-severity event requiring specialist response resources."}$rp$::jsonb,
  curated = false,
  updated_at = now()
WHERE id = 'V5c';
