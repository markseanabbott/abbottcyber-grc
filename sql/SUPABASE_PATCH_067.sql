-- SUPABASE_PATCH_067.sql
-- TB inject content audit — story continuity fixes for the ransomware chain
-- All 10 fixes are in the Ransomware archetype only (BEC, Insider, Vendor chains are clean)
-- Changes:
--   R2a  — ties Stage 2 endpoint back to Stage 1 phishing document
--   R2c  — ties Stage 2 server back to Stage 1 RDP compromise
--   R2d  — "a workstation" → "a compromised {{org_name}} workstation"
--   R3a  — restructured to lead with the lateral pivot to IT helpdesk machine
--   R3b  — "a single workstation" → "the compromised endpoint"
--   R3c  — "a {{org_name}} workstation" → "the compromised endpoint"
--   R3d  — "a {{org_name}} workstation" → "the compromised endpoint"
--   R4b  — "a compromised workstation" → "the compromised workstation"
--   R4c  — "a {{org_name}} workstation" → "the compromised endpoint"
--   R5b  — duplicate word fix: "has sustained a sustained" → "has seen a sustained"
-- Safe to re-run (UPDATE by id — idempotent)
-- Run in the Supabase SQL Editor

-- R2a: Cobalt Strike beacon
-- Old: "...on a workstation."
-- New: "...on the endpoint where the phishing document was opened."
UPDATE public.tt_inject_cards SET
  body = $body$EDR telemetry at {{org_name}} has captured a PowerShell payload executing from winword.exe immediately after a macro fired on the endpoint where the phishing document was opened. The payload has injected a memory-resident beacon making encrypted outbound HTTPS connections to a domain registered 11 days ago. The beacon is communicating at irregular intervals consistent with a known C2 framework, and no file artifacts have been written to disk.$body$,
  updated_at = now()
WHERE id = 'R2a';

-- R2c: Attacker deploys tooling via live RDP session
-- Old: "Live RDP session logs on a {{org_name}} server show..."
-- New: "Live RDP session logs on the compromised server show..."
UPDATE public.tt_inject_cards SET
  body = $body$Live RDP session logs on the compromised server show an authenticated session has been actively used for over two hours. Process history from the session reveals that network scanning utilities and a credential harvesting tool were downloaded and executed. The tools were retrieved over HTTPS from a file-sharing service not currently blocked at the perimeter.$body$,
  updated_at = now()
WHERE id = 'R2c';

-- R2d: LOTL — PowerShell scheduled task
-- Old: "...on a workstation running encoded commands..."
-- New: "...on a compromised {{org_name}} workstation running encoded commands..."
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s SIEM has correlated a series of PowerShell executions on a compromised {{org_name}} workstation running encoded commands on a regular schedule. The scheduled task was created under a legitimate user account and uses only built-in Windows utilities, generating no EDR alerts. The commands are exfiltrating environment data to a cloud file-storage URI that appears in no other network logs.$body$,
  updated_at = now()
WHERE id = 'R2d';

-- R3a: LSASS dump
-- Old: "EDR has fired a high-severity alert on a workstation: [details]. The affected workstation belongs to a member of the IT helpdesk team."
-- New: Lead with the lateral pivot context so players understand this is a new, higher-value target — not the original endpoint.
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s EDR has fired a high-severity alert on a workstation belonging to an IT helpdesk team member — indicating the attacker has moved laterally from the initial foothold to a higher-value credential target. A process running with SYSTEM privileges opened a read handle to lsass.exe and copied its memory contents to a file on disk. The behavior matches the signature of a well-known credential-dumping tool, and the file was subsequently transferred via SMB before being deleted.$body$,
  updated_at = now()
WHERE id = 'R3a';

-- R3b: Kerberoasting — service account TGS tickets cracked offline
-- Old: "...Kerberos TGS requests from a single workstation — 47 requests..."
-- New: "...from the compromised endpoint — 47 requests..."
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s SIEM has detected an unusual volume of Kerberos TGS requests from the compromised endpoint — 47 requests for service tickets across service accounts within a 90-second window. This pattern is consistent with automated service account discovery and ticket harvesting for offline password cracking. None of the targeted service accounts have had their passwords rotated in the past 180 days, and several are members of elevated groups.$body$,
  updated_at = now()
WHERE id = 'R3b';

-- R3c: NTLM hash stolen from local SAM — pass-the-hash prepared
-- Old: "Forensic review of a {{org_name}} workstation has recovered evidence..."
-- New: "Forensic review of the compromised endpoint has recovered evidence..."
UPDATE public.tt_inject_cards SET
  body = $body$Forensic review of the compromised endpoint has recovered evidence that the local SAM database was accessed by an unauthorized process running with SeDebugPrivilege enabled. A second alert has flagged lateral NTLM authentication attempts from the same host against two other internal systems. The combination of SAM extraction and outbound authentication attempts is consistent with preparation for a pass-the-hash lateral movement campaign.$body$,
  updated_at = now()
WHERE id = 'R3c';

-- R3d: Browser credential harvest and stored password dump
-- Old: "Endpoint telemetry on a {{org_name}} workstation has logged..."
-- New: "Endpoint telemetry on the compromised endpoint has logged..."
UPDATE public.tt_inject_cards SET
  body = $body$Endpoint telemetry on the compromised endpoint has logged a script process reading the credential storage files for two installed browsers within the same process session. The harvested files contain saved usernames and passwords for internal portals, cloud services, and the remote access VPN. The script execution was triggered by a scheduled task using built-in Windows utilities, generating no individual high-severity alerts.$body$,
  updated_at = now()
WHERE id = 'R3d';

-- R4b: Pass-the-hash to domain controller
-- Old: "...NTLM pass-the-hash authentication from a compromised workstation to the domain controller."
-- New: "...from the compromised workstation to the domain controller." ("a" → "the")
UPDATE public.tt_inject_cards SET
  body = $body${{org_name}}'s SIEM has correlated NTLM pass-the-hash authentication from the compromised workstation to the domain controller. The source workstation has not previously made administrative connections to the DC, and the NTLM authentication bypassed the Kerberos flow entirely. A second alert has fired on the domain controller indicating that new local administrator credentials were provisioned via a remote command session.$body$,
  updated_at = now()
WHERE id = 'R4b';

-- R4c: Local admin relay — spreads to nearby hosts, stops short of DC
-- Old: "An automated lateral movement script on a {{org_name}} workstation has used local administrator credentials..."
-- New: "...on the compromised endpoint has used..."
UPDATE public.tt_inject_cards SET
  body = $body$An automated lateral movement script on the compromised endpoint has used local administrator credentials to authenticate via SMB to eleven other endpoints on the same subnet. Each targeted system had the same local administrator password, and the script has installed a persistent backdoor on all eleven hosts. The domain controller has not yet been reached, but the affected subnet includes systems with access to file shares containing sensitive data.$body$,
  updated_at = now()
WHERE id = 'R4c';

-- R5b: 80 GB data staged and exfiltrated — double extortion lever armed
-- Old: "...environment has sustained a sustained outbound transfer..." (duplicate word)
-- New: "...environment has seen a sustained outbound transfer..."
UPDATE public.tt_inject_cards SET
  body = $body$Netflow analysis has confirmed that {{org_name}}'s environment has seen a sustained outbound transfer totaling 80 GB to a cloud hosting provider over the past 14 hours. The data originated from file servers hosting customer records, financial data, and operational documents, and was transferred in encrypted archives. A threat intelligence feed has flagged the destination IP as associated with a ransomware group known for double-extortion campaigns.$body$,
  updated_at = now()
WHERE id = 'R5b';
