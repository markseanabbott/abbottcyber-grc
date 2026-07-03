-- SEED_TT_INJECT_CHAINS.sql
-- TB2 -- Branching inject chain skeleton rows for all 4 IR archetypes
-- Ransomware (21) | BEC (16) | Insider (19) | Vendor Compromise (17) = 73 cards total
-- body = 'DRAFT - authored in TB4' for all cards; role_prompts authored in TB4
-- nist_phase_idx mapping per archetype (see TABLETOP_CHAINS.md):
--   Ransomware: stages 1-2=1, 3-4=2, 5-6=3
--   BEC:        stages 1-2=1, 3-4=2, 5=3
--   Insider:    stages 1-2=1, 3=2, 4-5=3
--   Vendor:     stages 1-2=1, 3=2, 4-5=3
-- Recover (4) and Post-Incident (5) exercised in post-terminal wrap-up round (TB10b).
-- Safe to re-run (ON CONFLICT DO UPDATE).
-- Run in the Supabase SQL Editor.

-- ============================================================
-- RANSOMWARE -- 21 cards, 6 stages
-- ============================================================
INSERT INTO public.tt_inject_cards
  (id, archetype, track, chain_stage, requires, grants, weight,
   title, body, role_prompts,
   mitre_tactic, mitre_technique, correct_criticality, nist_phase_idx)
VALUES
-- Stage 1 - Initial Access (Detect/Analyze = 1)
('R1a','ransomware','ir',1,'[]'::jsonb,'["access:email","foothold:achieved"]'::jsonb,10,
 'Phishing attachment delivered to employee - macro enabled',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Phishing: Spearphishing Attachment','High',1),

('R1b','ransomware','ir',1,'[]'::jsonb,'["access:web","foothold:achieved"]'::jsonb,10,
 'VPN / edge appliance exploit on unpatched CVE',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Exploit Public-Facing Application','Critical',1),

('R1c','ransomware','ir',1,'[]'::jsonb,'["access:interactive","foothold:achieved"]'::jsonb,10,
 'RDP brute force on externally exposed port',
 'DRAFT - authored in TB4','{}',
 'Initial Access','External Remote Services','High',1),

-- Stage 2 - Execution & C2 (Detect/Analyze = 1)
('R2a','ransomware','ir',2,'["access:email"]'::jsonb,'["c2:established","c2:beaconing"]'::jsonb,10,
 'Macro executes - Cobalt Strike beacon dropped in memory',
 'DRAFT - authored in TB4','{}',
 'Command and Control','Application Layer Protocol','Critical',1),

('R2b','ransomware','ir',2,'["access:web"]'::jsonb,'["c2:established","c2:webshell"]'::jsonb,10,
 'Web shell planted on compromised edge device',
 'DRAFT - authored in TB4','{}',
 'Persistence','Server Software Component: Web Shell','Critical',1),

('R2c','ransomware','ir',2,'["access:interactive"]'::jsonb,'["c2:established","c2:interactive"]'::jsonb,10,
 'Attacker deploys tooling via live RDP session',
 'DRAFT - authored in TB4','{}',
 'Execution','Command and Scripting Interpreter','Critical',1),

('R2d','ransomware','ir',2,'["foothold:achieved"]'::jsonb,'["c2:established","persistence:established"]'::jsonb,7,
 'LOTL - PowerShell scheduled task, no beacon',
 'DRAFT - authored in TB4','{}',
 'Persistence','Scheduled Task/Job','High',1),

-- Stage 3 - Credential Access (Contain = 2)
('R3a','ransomware','ir',3,'["c2:established"]'::jsonb,'["creds:domain_user"]'::jsonb,10,
 'LSASS dump via Mimikatz or equivalent',
 'DRAFT - authored in TB4','{}',
 'Credential Access','OS Credential Dumping: LSASS Memory','Critical',2),

('R3b','ransomware','ir',3,'["c2:established"]'::jsonb,'["creds:service_account","creds:domain_user"]'::jsonb,10,
 'Kerberoasting - service account TGS tickets cracked offline',
 'DRAFT - authored in TB4','{}',
 'Credential Access','Steal or Forge Kerberos Tickets','Critical',2),

('R3c','ransomware','ir',3,'["c2:established"]'::jsonb,'["creds:local_admin"]'::jsonb,10,
 'NTLM hash stolen from local SAM - pass-the-hash prepared',
 'DRAFT - authored in TB4','{}',
 'Credential Access','OS Credential Dumping: SAM','High',2),

('R3d','ransomware','ir',3,'["persistence:established"]'::jsonb,'["creds:domain_user"]'::jsonb,10,
 'Browser credential harvest and stored password dump',
 'DRAFT - authored in TB4','{}',
 'Credential Access','Credentials from Password Stores','High',2),

-- Stage 4 - Privilege Escalation & Lateral Movement (Contain = 2)
('R4a','ransomware','ir',4,'["creds:service_account"]'::jsonb,'["priv:domain_admin","lateral:complete"]'::jsonb,10,
 'Service account pivots to domain controller',
 'DRAFT - authored in TB4','{}',
 'Lateral Movement','Use Alternate Authentication Material','Critical',2),

('R4b','ransomware','ir',4,'["creds:domain_user"]'::jsonb,'["priv:domain_admin","lateral:complete"]'::jsonb,10,
 'Pass-the-hash to domain controller',
 'DRAFT - authored in TB4','{}',
 'Lateral Movement','Use Alternate Authentication Material','Critical',2),

('R4c','ransomware','ir',4,'["creds:local_admin"]'::jsonb,'["lateral:partial"]'::jsonb,10,
 'Local admin relay - spreads to nearby hosts, stops short of DC',
 'DRAFT - authored in TB4','{}',
 'Lateral Movement','Remote Services','High',2),

-- Stage 5 - Pre-Impact (Eradicate = 3)
('R5a','ransomware','ir',5,'["priv:domain_admin"]'::jsonb,'["backups:disabled","impact:imminent"]'::jsonb,10,
 'Shadow copy deletion and backup agent disabled',
 'DRAFT - authored in TB4','{}',
 'Impact','Inhibit System Recovery','Critical',3),

('R5b','ransomware','ir',5,'["lateral:complete"]'::jsonb,'["exfil:complete","extortion:leverage","impact:imminent"]'::jsonb,10,
 '80 GB data staged and exfiltrated - double extortion lever armed',
 'DRAFT - authored in TB4','{}',
 'Exfiltration','Exfiltration Over C2 Channel','Critical',3),

('R5c','ransomware','ir',5,'["lateral:partial"]'::jsonb,'["payload:staged","impact:imminent"]'::jsonb,10,
 'Ransomware payload pre-staged across all reachable hosts',
 'DRAFT - authored in TB4','{}',
 'Defense Evasion','Indicator Removal','Critical',3),

('R5d','ransomware','ir',5,'["priv:domain_admin"]'::jsonb,'["defense:blind","impact:imminent"]'::jsonb,10,
 'EDR and AV disabled domain-wide via GPO',
 'DRAFT - authored in TB4','{}',
 'Defense Evasion','Impair Defenses: Disable or Modify Tools','Critical',3),

('R5e','ransomware','ir',5,'["lateral:partial"]'::jsonb,'["defense:blind","impact:imminent"]'::jsonb,10,
 'EDR silenced on reachable hosts (partial blind)',
 'DRAFT - authored in TB4','{}',
 'Defense Evasion','Impair Defenses: Disable or Modify Tools','High',3),

-- Stage 6 - Impact / terminal (Eradicate = 3)
('R6a','ransomware','ir',6,'["impact:imminent"]'::jsonb,'[]'::jsonb,10,
 'Ransomware deployed via GPO or remote execution script',
 'DRAFT - authored in TB4','{}',
 'Impact','Data Encrypted for Impact','Critical',3),

('R6b','ransomware','ir',6,'["exfil:complete"]'::jsonb,'[]'::jsonb,10,
 'Encrypt and threaten public data leak (double extortion)',
 'DRAFT - authored in TB4','{}',
 'Impact','Data Encrypted for Impact','Critical',3),

('R6c','ransomware','ir',6,'["backups:disabled"]'::jsonb,'[]'::jsonb,10,
 'Backup destruction first, then encrypt - no clean recovery path',
 'DRAFT - authored in TB4','{}',
 'Impact','Data Encrypted for Impact','Critical',3)

ON CONFLICT (id) DO UPDATE SET
  chain_stage         = EXCLUDED.chain_stage,
  requires            = EXCLUDED.requires,
  grants              = EXCLUDED.grants,
  weight              = EXCLUDED.weight,
  title               = EXCLUDED.title,
  body                = EXCLUDED.body,
  mitre_tactic        = EXCLUDED.mitre_tactic,
  mitre_technique     = EXCLUDED.mitre_technique,
  correct_criticality = EXCLUDED.correct_criticality,
  nist_phase_idx      = EXCLUDED.nist_phase_idx,
  updated_at          = now();

-- ============================================================
-- BEC -- 16 cards, 5 stages
-- ============================================================
INSERT INTO public.tt_inject_cards
  (id, archetype, track, chain_stage, requires, grants, weight,
   title, body, role_prompts,
   mitre_tactic, mitre_technique, correct_criticality, nist_phase_idx)
VALUES
-- Stage 1 - Initial Access / Infiltration (Detect/Analyze = 1)
('B1a','bec','ir',1,'[]'::jsonb,'["access:phishing","email:account_compromised"]'::jsonb,10,
 'IT help-desk spear phish harvests executive O365 credentials',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Phishing: Spearphishing Link','High',1),

('B1b','bec','ir',1,'[]'::jsonb,'["access:lookalike","email:lookalike_active"]'::jsonb,10,
 'Attacker registers typosquat domain - one character off from client domain',
 'DRAFT - authored in TB4','{}',
 'Resource Development','Acquire Infrastructure: Domains','Medium',1),

('B1c','bec','ir',1,'[]'::jsonb,'["access:credential_stuffing","email:account_compromised"]'::jsonb,7,
 'Finance team password found in credential database from prior breach',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Valid Accounts','High',1),

-- Stage 2 - Reconnaissance (Detect/Analyze = 1)
('B2a','bec','ir',2,'["email:account_compromised"]'::jsonb,'["recon:complete","recon:inbox_monitored"]'::jsonb,10,
 'Hidden inbox rules set - attacker monitors payment approvals in real time',
 'DRAFT - authored in TB4','{}',
 'Collection','Email Collection','High',1),

('B2b','bec','ir',2,'["access:lookalike"]'::jsonb,'["recon:complete","recon:osint_only"]'::jsonb,10,
 'OSINT sweep reveals CFO name, approval thresholds, and active vendor relationships',
 'DRAFT - authored in TB4','{}',
 'Reconnaissance','Gather Victim Org Information','Medium',1),

('B2c','bec','ir',2,'["email:account_compromised"]'::jsonb,'["recon:complete","recon:thread_harvested","vendor:identified"]'::jsonb,10,
 'Attacker reads live payment threads - vendor relationships and pending invoices catalogued',
 'DRAFT - authored in TB4','{}',
 'Collection','Email Collection','High',1),

-- Stage 3 - Account Position / Impersonation (Contain = 2)
('B3a','bec','ir',3,'["recon:complete"]'::jsonb,'["trust:established","exec:impersonated"]'::jsonb,10,
 'Attacker poses as CEO - targets CFO with confidential wire framing',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Phishing: Spearphishing via Service','High',2),

('B3b','bec','ir',3,'["recon:complete"]'::jsonb,'["trust:established","vendor:impersonated"]'::jsonb,10,
 'Attacker impersonates vendor - sends updated banking details from lookalike address',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Phishing: Spearphishing via Service','High',2),

('B3c','bec','ir',3,'["recon:thread_harvested"]'::jsonb,'["trust:established","thread:hijacked","exec:impersonated"]'::jsonb,10,
 'Thread hijack - attacker replies inline to active payment thread from compromised account',
 'DRAFT - authored in TB4','{}',
 'Collection','Email Collection','Critical',2),

-- Stage 4 - Social Engineering / Fraud Execution (Contain = 2)
('B4a','bec','ir',4,'["exec:impersonated"]'::jsonb,'["urgency:applied","wire:requested","fraud:submitted"]'::jsonb,10,
 'Urgent same-day wire request - CEO cites confidential acquisition, instructs CFO not to call',
 'DRAFT - authored in TB4','{}',
 'Impact','Financial Theft','Critical',2),

('B4b','bec','ir',4,'["vendor:impersonated"]'::jsonb,'["invoice:substituted","wire:requested","fraud:submitted"]'::jsonb,10,
 'Invoice arrives with updated ACH / wire details - existing vendor relationship exploited',
 'DRAFT - authored in TB4','{}',
 'Impact','Financial Theft','High',2),

('B4c','bec','ir',4,'["trust:established"]'::jsonb,'["payroll:diverted","fraud:submitted"]'::jsonb,7,
 'Payroll diversion - attacker impersonates employee and submits direct-deposit change to HR',
 'DRAFT - authored in TB4','{}',
 'Impact','Financial Theft','High',2),

('B4d','bec','ir',4,'["thread:hijacked"]'::jsonb,'["urgency:applied","wire:requested","fraud:submitted"]'::jsonb,10,
 'Thread hijack wire request - real payment thread continued with changed banking details',
 'DRAFT - authored in TB4','{}',
 'Impact','Financial Theft','Critical',2),

-- Stage 5 - Financial Impact / terminal (Eradicate = 3)
('B5a','bec','ir',5,'["fraud:submitted"]'::jsonb,'[]'::jsonb,10,
 'Wire transfer authorized and processed - funds reach mule account within 90 minutes',
 'DRAFT - authored in TB4','{}',
 'Impact','Financial Theft','Critical',3),

('B5b','bec','ir',5,'["urgency:applied"]'::jsonb,'[]'::jsonb,10,
 'Attacker calls back posing as bank to verify the transfer - cancellation window closes',
 'DRAFT - authored in TB4','{}',
 'Impact','Financial Theft','Critical',3),

('B5c','bec','ir',5,'["payroll:diverted"]'::jsonb,'[]'::jsonb,7,
 'Payroll diversion runs silently for three pay cycles before discovered on reconciliation',
 'DRAFT - authored in TB4','{}',
 'Impact','Financial Theft','High',3)

ON CONFLICT (id) DO UPDATE SET
  chain_stage         = EXCLUDED.chain_stage,
  requires            = EXCLUDED.requires,
  grants              = EXCLUDED.grants,
  weight              = EXCLUDED.weight,
  title               = EXCLUDED.title,
  body                = EXCLUDED.body,
  mitre_tactic        = EXCLUDED.mitre_tactic,
  mitre_technique     = EXCLUDED.mitre_technique,
  correct_criticality = EXCLUDED.correct_criticality,
  nist_phase_idx      = EXCLUDED.nist_phase_idx,
  updated_at          = now();

-- ============================================================
-- INSIDER -- 19 cards, 5 stages
-- ============================================================
INSERT INTO public.tt_inject_cards
  (id, archetype, track, chain_stage, requires, grants, weight,
   title, body, role_prompts,
   mitre_tactic, mitre_technique, correct_criticality, nist_phase_idx)
VALUES
-- Stage 1 - Initial Act / Motivation (Detect/Analyze = 1)
('I1a','insider','ir',1,'[]'::jsonb,'["motive:grievance","access:privileged","insider:active"]'::jsonb,10,
 'Disgruntled IT admin queries HR and finance records outside job scope after being passed over',
 'DRAFT - authored in TB4','{}',
 'Privilege Abuse',NULL,'High',1),

('I1b','insider','ir',1,'[]'::jsonb,'["motive:competitive","access:standard","insider:active"]'::jsonb,10,
 'Sales rep accepts position at competitor - begins archiving client contact and pricing data',
 'DRAFT - authored in TB4','{}',
 'Privilege Abuse',NULL,'High',1),

('I1c','insider','ir',1,'[]'::jsonb,'["motive:financial","access:standard","insider:active"]'::jsonb,7,
 'Finance analyst approached by external party and agrees to exfiltrate data for payment',
 'DRAFT - authored in TB4','{}',
 'Privilege Abuse',NULL,'Critical',1),

('I1d','insider','ir',1,'[]'::jsonb,'["motive:grievance","access:deprovision_missed","insider:active"]'::jsonb,7,
 'Terminated employee AD account not disabled - remote access continues 48 hours post-termination',
 'DRAFT - authored in TB4','{}',
 'Privilege Abuse',NULL,'Critical',1),

-- Stage 2 - Reconnaissance & Data Mapping (Detect/Analyze = 1)
('I2a','insider','ir',2,'["access:privileged"]'::jsonb,'["recon:data_mapped","recon:db_queried"]'::jsonb,10,
 'Privileged user runs broad database queries - maps tables containing PII, financials, and IP',
 'DRAFT - authored in TB4','{}',
 'Discovery','Data from Local System','High',1),

('I2b','insider','ir',2,'["access:standard"]'::jsonb,'["recon:data_mapped","recon:share_browsed"]'::jsonb,10,
 'Standard user browses file shares - identifies folders with insufficient access controls',
 'DRAFT - authored in TB4','{}',
 'Discovery','File and Directory Discovery','Medium',1),

('I2c','insider','ir',2,'["access:standard"]'::jsonb,'["recon:dlp_gap","recon:data_mapped"]'::jsonb,7,
 'Insider tests DLP behavior with small transfers - confirms personal cloud storage is not scanned',
 'DRAFT - authored in TB4','{}',
 'Discovery','File and Directory Discovery','High',1),

('I2d','insider','ir',2,'["access:deprovision_missed"]'::jsonb,'["recon:data_mapped","recon:remote_access"]'::jsonb,10,
 'Terminated employee uses stale VPN credentials to re-enter environment and navigate shared drives',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Valid Accounts: Domain Accounts','Critical',1),

-- Stage 3 - Data Staging (Contain = 2)
('I3a','insider','ir',3,'["recon:data_mapped"]'::jsonb,'["data:staged_local","data:volume_high","data:ready"]'::jsonb,10,
 'Insider runs bulk export of customer database to local Downloads folder - 3.2 GB',
 'DRAFT - authored in TB4','{}',
 'Collection','Data Staged: Local Data Staging','High',2),

('I3b','insider','ir',3,'["recon:dlp_gap"]'::jsonb,'["data:staged_cloud","data:volume_moderate","data:ready"]'::jsonb,10,
 'Files copied to personal Dropbox via browser - DLP gap confirmed exploited',
 'DRAFT - authored in TB4','{}',
 'Exfiltration','Exfiltration to Cloud Storage','High',2),

('I3c','insider','ir',3,'["recon:data_mapped"]'::jsonb,'["data:staged_usb","data:volume_high","data:ready"]'::jsonb,7,
 'USB device plugged in - 6 GB copied in 20 minutes; endpoint protection does not block USB',
 'DRAFT - authored in TB4','{}',
 'Exfiltration','Exfiltration over Physical Medium','High',2),

('I3d','insider','ir',3,'["recon:data_mapped"]'::jsonb,'["data:staged_cloud","data:volume_moderate","data:ready"]'::jsonb,7,
 'Files emailed to personal Gmail in small batches over two weeks - under size threshold',
 'DRAFT - authored in TB4','{}',
 'Exfiltration','Exfiltration Over Web Service','High',2),

-- Stage 4 - Exfiltration (Eradicate = 3)
('I4a','insider','ir',4,'["data:staged_usb"]'::jsonb,'["impact:data_loss"]'::jsonb,10,
 'Insider resigns and walks out with USB containing client database - discovered during exit interview',
 'DRAFT - authored in TB4','{}',
 'Exfiltration','Exfiltration over Physical Medium: USB','High',3),

('I4b','insider','ir',4,'["data:staged_cloud"]'::jsonb,'["impact:data_loss"]'::jsonb,10,
 'Cloud sync completes overnight - 4.7 GB confirmed downloaded to personal device',
 'DRAFT - authored in TB4','{}',
 'Exfiltration','Exfiltration to Cloud Storage','High',3),

('I4c','insider','ir',4,'["data:staged_local"]'::jsonb,'["impact:data_loss"]'::jsonb,10,
 'IR team locates local staging file - but forensics confirms a prior USB copy was already made',
 'DRAFT - authored in TB4','{}',
 'Exfiltration','Exfiltration over Physical Medium','High',3),

('I4d','insider','ir',4,'["motive:competitive","data:ready"]'::jsonb,'["impact:data_loss"]'::jsonb,7,
 'Insider transfers data directly to competitor via secure file transfer - large outbound transfer logged',
 'DRAFT - authored in TB4','{}',
 'Exfiltration','Exfiltration Over Web Service','Critical',3),

-- Stage 5 - Impact / terminal (Eradicate = 3)
('I5a','insider','ir',5,'["impact:data_loss"]'::jsonb,'[]'::jsonb,10,
 'Competitor announces product matching stolen IP within 90 days - data confirmed used',
 'DRAFT - authored in TB4','{}',
 'Impact','Data Theft','High',3),

('I5b','insider','ir',5,'["impact:data_loss"]'::jsonb,'[]'::jsonb,10,
 'Regulatory notification required - PII of 50,000+ individuals confirmed exfiltrated',
 'DRAFT - authored in TB4','{}',
 'Impact','Data Theft','Critical',3),

('I5c','insider','ir',5,'["data:staged_usb"]'::jsonb,'[]'::jsonb,7,
 'Insider arrested at airport with USB - criminal referral filed, data partially recovered',
 'DRAFT - authored in TB4','{}',
 'Impact','Data Theft','High',3)

ON CONFLICT (id) DO UPDATE SET
  chain_stage         = EXCLUDED.chain_stage,
  requires            = EXCLUDED.requires,
  grants              = EXCLUDED.grants,
  weight              = EXCLUDED.weight,
  title               = EXCLUDED.title,
  body                = EXCLUDED.body,
  mitre_tactic        = EXCLUDED.mitre_tactic,
  mitre_technique     = EXCLUDED.mitre_technique,
  correct_criticality = EXCLUDED.correct_criticality,
  nist_phase_idx      = EXCLUDED.nist_phase_idx,
  updated_at          = now();

-- ============================================================
-- VENDOR COMPROMISE -- 17 cards, 5 stages
-- ============================================================
INSERT INTO public.tt_inject_cards
  (id, archetype, track, chain_stage, requires, grants, weight,
   title, body, role_prompts,
   mitre_tactic, mitre_technique, correct_criticality, nist_phase_idx)
VALUES
-- Stage 1 - Vendor Compromise (Detect/Analyze = 1)
('V1a','vendor_compromise','ir',1,'[]'::jsonb,'["vendor:compromised","vendor:msp_access","access:credential_stuffing"]'::jsonb,10,
 'MSP management console accessed via credential stuffing on reused password',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Valid Accounts','Critical',1),

('V1b','vendor_compromise','ir',1,'[]'::jsonb,'["vendor:compromised","vendor:msp_access","access:phishing"]'::jsonb,10,
 'MSP technician spear-phished - RAT installed on their workstation',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Phishing: Spearphishing Attachment','Critical',1),

('V1c','vendor_compromise','ir',1,'[]'::jsonb,'["vendor:compromised","vendor:api_access","access:credential_exposure"]'::jsonb,10,
 'SaaS vendor API key exposed in a public GitHub repository',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Valid Accounts: Cloud Accounts','High',1),

('V1d','vendor_compromise','ir',1,'[]'::jsonb,'["vendor:compromised","vendor:software_update","access:supply_chain"]'::jsonb,7,
 'Trojanized software update - backdoor inserted into signed patch pushed to all managed clients',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Supply Chain Compromise: Software Supply Chain','Critical',1),

-- Stage 2 - Vendor Reconnaissance (Detect/Analyze = 1)
('V2a','vendor_compromise','ir',2,'["vendor:msp_access"]'::jsonb,'["recon:complete","recon:client_list","trust:elevated"]'::jsonb,10,
 'Attacker maps all client orgs in MSP console - identifies clients with admin-level RMM agents',
 'DRAFT - authored in TB4','{}',
 'Discovery','Remote System Discovery','High',1),

('V2b','vendor_compromise','ir',2,'["vendor:api_access"]'::jsonb,'["recon:complete","recon:api_scope"]'::jsonb,10,
 'API documentation and live traffic reviewed - accessible client endpoints and data understood',
 'DRAFT - authored in TB4','{}',
 'Discovery','Cloud Service Discovery','Medium',1),

('V2c','vendor_compromise','ir',2,'["vendor:software_update"]'::jsonb,'["recon:complete","recon:update_targets"]'::jsonb,10,
 'Update server analysis confirms which clients have auto-update enabled and next push schedule',
 'DRAFT - authored in TB4','{}',
 'Discovery','Software Discovery','High',1),

-- Stage 3 - Client Pivot (Contain = 2)
('V3a','vendor_compromise','ir',3,'["vendor:msp_access","recon:client_list"]'::jsonb,'["pivot:via_rmm","client:foothold"]'::jsonb,10,
 'RMM tool executes PowerShell across all managed clients - legitimate tool, no alerts triggered',
 'DRAFT - authored in TB4','{}',
 'Lateral Movement','Remote Services: Remote Management Software','Critical',2),

('V3b','vendor_compromise','ir',3,'["vendor:api_access","recon:api_scope"]'::jsonb,'["pivot:via_api","client:foothold"]'::jsonb,10,
 'API token used to pull live customer PII from client via existing trusted integration',
 'DRAFT - authored in TB4','{}',
 'Lateral Movement','Trusted Relationship','High',2),

('V3c','vendor_compromise','ir',3,'["vendor:software_update","recon:update_targets"]'::jsonb,'["pivot:via_update","client:foothold"]'::jsonb,10,
 'Trojanized update auto-installs on 23 client endpoints - backdoor active in production',
 'DRAFT - authored in TB4','{}',
 'Initial Access','Supply Chain Compromise','Critical',2),

('V3d','vendor_compromise','ir',3,'["trust:elevated","recon:client_list"]'::jsonb,'["pivot:via_rmm","client:foothold","client:targeted"]'::jsonb,7,
 'Attacker selects highest-value client from MSP console and pivots via privileged RMM agent',
 'DRAFT - authored in TB4','{}',
 'Lateral Movement','Trusted Relationship','Critical',2),

-- Stage 4 - Client Discovery & Pre-Impact (Eradicate = 3)
('V4a','vendor_compromise','ir',4,'["pivot:via_rmm"]'::jsonb,'["client:admin_creds","impact:imminent"]'::jsonb,10,
 'BloodHound-equivalent run via RMM - full AD map acquired, domain admin path confirmed',
 'DRAFT - authored in TB4','{}',
 'Discovery','Domain Trust Discovery','Critical',3),

('V4b','vendor_compromise','ir',4,'["pivot:via_api"]'::jsonb,'["exfil:staging","impact:imminent"]'::jsonb,10,
 'API pivot exposes complete customer PII dataset - attacker begins staged exfiltration',
 'DRAFT - authored in TB4','{}',
 'Collection','Data from Cloud Storage','High',3),

('V4c','vendor_compromise','ir',4,'["pivot:via_update"]'::jsonb,'["client:admin_creds","impact:imminent"]'::jsonb,10,
 'Backdoor on 23 endpoints begins silent credential harvesting and lateral reconnaissance',
 'DRAFT - authored in TB4','{}',
 'Credential Access','Input Capture: Keylogging','Critical',3),

-- Stage 5 - Impact / terminal (Eradicate = 3)
('V5a','vendor_compromise','ir',5,'["impact:imminent"]'::jsonb,'[]'::jsonb,10,
 'Ransomware deployed across client environment via RMM - all managed clients encrypted simultaneously',
 'DRAFT - authored in TB4','{}',
 'Impact','Data Encrypted for Impact','Critical',3),

('V5b','vendor_compromise','ir',5,'["exfil:staging"]'::jsonb,'[]'::jsonb,10,
 'Complete customer PII exfiltrated silently via API - discovered weeks later via dark web alert',
 'DRAFT - authored in TB4','{}',
 'Impact','Data Theft','Critical',3),

('V5c','vendor_compromise','ir',5,'["client:admin_creds"]'::jsonb,'[]'::jsonb,7,
 'Client admin credentials sold on dark web - multiple threat actors gain independent access',
 'DRAFT - authored in TB4','{}',
 'Impact','Account Access Removal','Critical',3)

ON CONFLICT (id) DO UPDATE SET
  chain_stage         = EXCLUDED.chain_stage,
  requires            = EXCLUDED.requires,
  grants              = EXCLUDED.grants,
  weight              = EXCLUDED.weight,
  title               = EXCLUDED.title,
  body                = EXCLUDED.body,
  mitre_tactic        = EXCLUDED.mitre_tactic,
  mitre_technique     = EXCLUDED.mitre_technique,
  correct_criticality = EXCLUDED.correct_criticality,
  nist_phase_idx      = EXCLUDED.nist_phase_idx,
  updated_at          = now();