// ============================================================
// TECHNOLOGY STACK SURVEY — tooling-focused, drives MSP catalog match + framework auto-scoping
// ============================================================
//
// Each question carries three machine tags (not rendered to surveying user, exposed in export):
//   tool_category   — joins against MSP portfolio (drives sell / upgrade / replace classification)
//   question_type   — 'presence' | 'coverage' | 'feature' | 'process'
//                     drives whether a gap is a tool sale, an upgrade, or a services engagement
//   derive_strategy — how this answer propagates into CIS / NIST / Insurance surveys
//                     'standard' = yes→implemented, partial→partial, no→not_implemented, na→skip
//
// NIST uses CSF 2.0 IDs (PR.AA, PR.PS, PR.DS, DE.CM, ID.RA, PR.AT).

const TS_CATS = [
  {
    id: 'endpoint', icon: '💻', title: 'Endpoint Protection',
    desc: 'Workstations, laptops and servers — agents, patching, encryption.',
    questions: [
      { id: 'edr', tool_category: 'EDR', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is EDR (Endpoint Detection & Response) deployed and active on all servers and endpoints?',
        suggestion: 'CrowdStrike Falcon, SentinelOne Singularity, Microsoft Defender for Endpoint P2, Sophos Intercept X. Coverage matters more than brand.',
        mappings: {
          cis: [{ id: '10.7', title: 'Use behaviour-based anti-malware software', ig: '2' }, { id: '13.7', title: 'Deploy a host-based intrusion detection (or EDR) solution', ig: '2' }],
          nist: [{ id: 'PR.PS-05', title: 'Installation and execution of unauthorised software is prevented' }, { id: 'DE.CM-09', title: 'Computing hardware and software, runtime environments, and their data are monitored' }],
          insurance: { impact: 'high', note: 'EDR is on virtually every cyber insurance application. Lack of EDR routinely drives 15-40% premium uplift or outright declination.' },
        }
      },
      { id: 'patching', tool_category: 'Patch_Management', question_type: 'feature', derive_strategy: 'standard',
        text: 'Is centralised patch management in place for OS, browsers and third-party software (critical CVEs closed within 30 days)?',
        suggestion: 'Action1, Automox, NinjaOne, Intune, ManageEngine Patch Manager. Vendor auto-update without central visibility does not count as Yes.',
        mappings: {
          cis: [{ id: '7.3', title: 'Perform automated OS patch management', ig: '1' }, { id: '7.4', title: 'Perform automated application patch management', ig: '1' }],
          nist: [{ id: 'ID.RA-01', title: 'Vulnerabilities in assets are identified, validated, and recorded' }, { id: 'PR.PS-02', title: 'Software is maintained, replaced, and removed commensurate with risk' }],
          insurance: { impact: 'mid', note: 'Patch cadence is asked on most renewal applications. Outstanding critical CVEs beyond 30 days is a flag for most carriers.' },
        }
      },
      { id: 'fde', tool_category: 'Disk_Encryption', question_type: 'coverage', derive_strategy: 'standard',
        text: 'Is full-disk encryption enforced on every laptop, with recovery keys escrowed centrally?',
        suggestion: 'BitLocker with keys in Intune / Entra ID, or FileVault with Jamf escrow. Self-managed PGP / VeraCrypt does not count.',
        mappings: {
          cis: [{ id: '3.6', title: 'Encrypt data on end-user devices', ig: '1' }],
          nist: [{ id: 'PR.DS-01', title: 'The confidentiality, integrity, and availability of data-at-rest are protected' }],
          insurance: { impact: 'mid', note: 'Required wherever portable devices carry PII or cardholder data. A single lost-laptop incident without FDE can be a notifiable breach under PIPA BC.' },
        }
      },
      { id: 'app_allowlist', tool_category: 'App_Allowlisting', question_type: 'feature', derive_strategy: 'standard',
        text: 'Is application allowlisting enforced on critical servers (only approved binaries can execute)?',
        suggestion: 'Windows Defender Application Control / AppLocker, ThreatLocker, Airlock Digital. IG3-level maturity — typically only critical servers, not user endpoints.',
        mappings: {
          cis: [{ id: '2.5', title: 'Allowlist authorised software', ig: '3' }, { id: '2.6', title: 'Allowlist authorised libraries', ig: '3' }, { id: '2.7', title: 'Allowlist authorised scripts', ig: '3' }],
          nist: [{ id: 'PR.PS-05', title: 'Installation and execution of unauthorised software is prevented' }],
          insurance: { impact: 'low', note: 'Not commonly asked at SMB level but a strong differentiator at IG3 maturity. Increasingly relevant for OT / payment processing environments.' },
        }
      },
    ]
  },
  {
    id: 'identity', icon: '🔒', title: 'Identity & Access',
    desc: 'MFA, SSO, privileged access, joiner-mover-leaver.',
    questions: [
      { id: 'mfa_admin', tool_category: 'MFA_Phishing_Resistant', question_type: 'coverage', derive_strategy: 'standard',
        text: 'Is phishing-resistant MFA (FIDO2 / passkey / hardware token) enforced on all admin and privileged accounts?',
        suggestion: 'YubiKey, Windows Hello for Business, Duo with verified push, Okta FastPass. SMS and email OTP do NOT count as phishing-resistant.',
        mappings: {
          cis: [{ id: '6.5', title: 'Require MFA for administrative access', ig: '1' }],
          nist: [{ id: 'PR.AA-01', title: 'Identities and credentials for authorised users, services, and hardware are managed' }, { id: 'PR.AA-03', title: 'Users, services, and hardware are authenticated' }],
          insurance: { impact: 'high', note: 'MFA on admins is a non-negotiable for virtually all cyber carriers in 2026. Push-fatigue-vulnerable MFA is increasingly being treated as insufficient.' },
        }
      },
      { id: 'mfa_users', tool_category: 'MFA_All_Users', question_type: 'coverage', derive_strategy: 'standard',
        text: 'Is MFA enforced on all standard user accounts (not just admins) for all externally-accessible apps?',
        suggestion: 'Same providers as admin MFA, broader rollout. Conditional-access policy gates by app, location, device trust. Push acceptable for users where phishing-resistant is impractical.',
        mappings: {
          cis: [{ id: '6.3', title: 'Require MFA for externally-exposed apps', ig: '1' }],
          nist: [{ id: 'PR.AA-01', title: 'Identities and credentials for authorised users, services, and hardware are managed' }, { id: 'PR.AA-03', title: 'Users, services, and hardware are authenticated' }],
          insurance: { impact: 'high', note: 'Many carriers now require MFA on ALL users for renewal, not just admins. Coverage exclusions on accounts missing MFA are common.' },
        }
      },
      { id: 'sso', tool_category: 'SSO', question_type: 'coverage', derive_strategy: 'standard',
        text: 'Is SSO covering 90%+ of the SaaS apps the business actually uses?',
        suggestion: 'Microsoft Entra ID, Okta, Google Workspace SSO. Shadow IT apps with local logins count against your coverage.',
        mappings: {
          cis: [{ id: '6.7', title: 'Centralise access control', ig: '2' }],
          nist: [{ id: 'PR.AA-01', title: 'Identities and credentials for authorised users, services, and hardware are managed' }, { id: 'PR.AA-05', title: 'Access permissions, entitlements, and authorisations are defined and managed' }],
          insurance: { impact: 'mid', note: 'Not directly rated but evidence of mature identity hygiene. Impacts deprovisioning timeliness which IS rated.' },
        }
      },
      { id: 'pam', tool_category: 'PAM', question_type: 'feature', derive_strategy: 'standard',
        text: 'Is a PAM tool managing privileged credentials (vaulted, session-recorded, just-in-time access)?',
        suggestion: 'CyberArk, Delinea, BeyondTrust, Microsoft Entra PIM. For SMBs, even a vault + documented JIT process beats nothing.',
        mappings: {
          cis: [{ id: '5.6', title: 'Centralise account management', ig: '2' }, { id: '6.8', title: 'Define and maintain role-based access control', ig: '3' }],
          nist: [{ id: 'PR.AA-03', title: 'Users, services, and hardware are authenticated' }, { id: 'PR.AA-05', title: 'Access permissions, entitlements, and authorisations are defined and managed' }],
          insurance: { impact: 'mid', note: 'PAM presence is rated favourably by most carriers — especially for orgs with shared admin credentials in scope.' },
        }
      },
      { id: 'jml', tool_category: 'JML_Automation', question_type: 'process', derive_strategy: 'standard',
        text: 'Is there an automated joiner-mover-leaver workflow with deprovisioning within 24 hours of termination?',
        suggestion: 'HRIS-driven flows via Entra ID / Okta Lifecycle, Workato, BetterCloud. Manual ticket-driven offboarding does not count for "automated".',
        mappings: {
          cis: [{ id: '5.3', title: 'Disable dormant accounts', ig: '1' }, { id: '6.2', title: 'Establish an access revocation process', ig: '1' }],
          nist: [{ id: 'PR.AA-01', title: 'Identities and credentials for authorised users, services, and hardware are managed' }],
          insurance: { impact: 'mid', note: 'Stale accounts are a common breach root cause — carriers ask about leaver SLA. >24h is a yellow flag, >7d a red flag.' },
        }
      },
    ]
  },
  {
    id: 'email', icon: '📧', title: 'Email Security',
    desc: 'Gateway filtering, domain authentication, user awareness.',
    questions: [
      { id: 'esg', tool_category: 'Email_Security_Gateway', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is an email security gateway with attachment sandboxing in front of the mail server?',
        suggestion: 'Microsoft Defender for Office 365 P2, Mimecast, Proofpoint, Abnormal Security. Native Microsoft EOP alone is below baseline.',
        mappings: {
          cis: [{ id: '9.6', title: 'Block unnecessary file types at the email gateway', ig: '2' }, { id: '9.7', title: 'Deploy email server anti-malware protections', ig: '2' }],
          nist: [{ id: 'DE.CM-09', title: 'Computing hardware and software, runtime environments, and their data are monitored' }, { id: 'PR.PS-05', title: 'Installation and execution of unauthorised software is prevented' }],
          insurance: { impact: 'high', note: 'Phishing remains the #1 ransomware vector. ESG presence and brand specifics are frequently asked on renewals.' },
        }
      },
      { id: 'dmarc', tool_category: 'Email_Authentication', question_type: 'feature', derive_strategy: 'standard',
        text: 'Is DMARC enforced at p=reject on all owned domains, with SPF and DKIM aligned?',
        suggestion: 'Start at p=none, monitor 2-4 weeks via Valimail / Dmarcian / EasyDMARC, move to p=quarantine then p=reject.',
        mappings: {
          cis: [{ id: '9.5', title: 'Implement DMARC', ig: '2' }],
          nist: [{ id: 'PR.DS-02', title: 'The confidentiality, integrity, and availability of data-in-transit are protected' }],
          insurance: { impact: 'mid', note: 'BEC and crime riders increasingly require DMARC enforcement. Reduces brand-spoofing successful exfil paths.' },
        }
      },
      { id: 'phishsim', tool_category: 'Phishing_Simulation', question_type: 'process', derive_strategy: 'standard',
        text: 'Is a phishing simulation programme running at least quarterly, with assigned remediation training?',
        suggestion: 'KnowBe4, Hoxhunt, Proofpoint Security Awareness, Cofense. Click-through-rate trending matters more than absolute number.',
        mappings: {
          cis: [{ id: '14.1', title: 'Establish and maintain a security awareness programme', ig: '1' }, { id: '14.2', title: 'Train workforce on social engineering attacks', ig: '1' }],
          nist: [{ id: 'PR.AT-01', title: 'Personnel are provided with awareness and training' }, { id: 'PR.AT-02', title: 'Individuals in specialised roles are provided with awareness and training' }],
          insurance: { impact: 'mid', note: 'Asked on most applications. Some carriers offer premium credits for documented programmes with measured outcomes.' },
        }
      },
      { id: 'banner', tool_category: 'External_Sender_Banner', question_type: 'feature', derive_strategy: 'standard',
        text: 'Is an external-sender banner / safety tip enforced on all inbound email from outside the org?',
        suggestion: 'Built into Microsoft 365 (transport rule or built-in toggle) and Google Workspace. Visible warning helps users spot impersonation in display-name spoofing.',
        mappings: {
          cis: [{ id: '14.3', title: 'Train workforce members on authentication best practices', ig: '1' }],
          nist: [{ id: 'PR.AT-01', title: 'Personnel are provided with awareness and training' }],
          insurance: { impact: 'low', note: 'Not directly rated but signals operational discipline. Free to enable — no excuse to skip.' },
        }
      },
    ]
  },
  {
    id: 'network', icon: '🌐', title: 'Network Security',
    desc: 'Firewall, remote access, segmentation, DNS/web filtering.',
    questions: [
      { id: 'ngfw', tool_category: 'NGFW', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is a next-gen firewall with IPS enabled at the perimeter?',
        suggestion: 'Palo Alto, Fortinet FortiGate, Cisco Firepower, Sophos XGS, WatchGuard. Stateful-only firewalls are below baseline in 2026.',
        mappings: {
          cis: [{ id: '13.10', title: 'Perform application layer filtering', ig: '3' }, { id: '13.3', title: 'Deploy a network intrusion detection solution', ig: '2' }],
          nist: [{ id: 'PR.IR-01', title: 'Networks and environments are protected from unauthorised logical access' }, { id: 'DE.CM-01', title: 'Networks and network services are monitored' }],
          insurance: { impact: 'mid', note: 'Brand and model often asked on applications. End-of-life firewalls are a frequent flag.' },
        }
      },
      { id: 'ztna', tool_category: 'ZTNA', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is ZTNA or a modern VPN deployed for remote access (replacing legacy VPN concentrators)?',
        suggestion: 'Cloudflare Access, Zscaler ZPA, Twingate, Tailscale, Cisco Secure Access, Palo Alto Prisma Access. Legacy IPSec-only is below baseline.',
        mappings: {
          cis: [{ id: '12.7', title: 'Ensure remote devices use a VPN and connect to an enterprise infrastructure', ig: '2' }],
          nist: [{ id: 'PR.AA-06', title: 'Physical access to assets is managed and protected' }, { id: 'PR.IR-01', title: 'Networks and environments are protected from unauthorised logical access' }],
          insurance: { impact: 'mid', note: 'ZTNA is increasingly favourable; legacy VPN concentrators with broad network access are a flagged risk.' },
        }
      },
      { id: 'vpn_mfa', tool_category: 'MFA_VPN', question_type: 'feature', derive_strategy: 'standard',
        text: 'Is MFA enforced on every VPN / remote-access login (no MFA bypass for any account)?',
        suggestion: 'Native to most ZTNA platforms. For legacy VPN: Duo, Cisco DUO integration, RADIUS+MFA. Service-account exceptions count as No.',
        mappings: {
          cis: [{ id: '6.4', title: 'Require MFA for remote network access', ig: '1' }],
          nist: [{ id: 'PR.AA-03', title: 'Users, services, and hardware are authenticated' }, { id: 'PR.IR-01', title: 'Networks and environments are protected from unauthorised logical access' }],
          insurance: { impact: 'high', note: 'Remote-access without MFA is one of the most common pre-conditions for ransomware. Carriers ask this question independently of "MFA on apps".' },
        }
      },
      { id: 'segmentation', tool_category: 'Network_Segmentation', question_type: 'feature', derive_strategy: 'standard',
        text: 'Is the network segmented (user / server / guest-IoT) so a compromised user device cannot reach servers directly?',
        suggestion: 'VLANs + ACLs, or microsegmentation via Illumio, Akamai Guardicore, VMware NSX. Flat networks where any device can reach any other are below baseline.',
        mappings: {
          cis: [{ id: '12.2', title: 'Establish and maintain a secure network architecture', ig: '2' }, { id: '12.8', title: 'Establish and maintain dedicated computing resources for administrative work', ig: '3' }],
          nist: [{ id: 'PR.IR-01', title: 'Networks and environments are protected from unauthorised logical access' }],
          insurance: { impact: 'mid', note: 'Flat networks are increasingly called out as a contributing factor in ransomware claims. Segmentation evidence is increasingly requested.' },
        }
      },
      { id: 'dns_filter', tool_category: 'DNS_Filtering', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is DNS filtering or a secure web gateway in front of outbound traffic, blocking known-malicious domains?',
        suggestion: 'Cisco Umbrella, Cloudflare Gateway, DNSFilter, Webroot DNS Protection, Zscaler ZIA. Built-in OS DNS does not count.',
        mappings: {
          cis: [{ id: '9.2', title: 'Use DNS filtering services', ig: '1' }, { id: '9.3', title: 'Maintain and enforce network-based URL filters', ig: '2' }],
          nist: [{ id: 'DE.CM-01', title: 'Networks and network services are monitored' }, { id: 'PR.IR-01', title: 'Networks and environments are protected from unauthorised logical access' }],
          insurance: { impact: 'mid', note: 'Cheap and effective. Asked on most applications under "web filtering" or "DNS-layer protection".' },
        }
      },
      { id: 'wifi_guest', tool_category: 'Wireless_Segmentation', question_type: 'feature', derive_strategy: 'standard',
        text: 'Is wireless segmented with a fully isolated guest network (no path to internal systems or PoS/PMS)?',
        suggestion: 'Separate SSID with client isolation, distinct VLAN, no back-haul to corporate. Critical in hospitality where guests share air with payment terminals and PMS.',
        mappings: {
          cis: [{ id: '12.6', title: 'Use of secure network management and communication protocols', ig: '1' }, { id: '12.2', title: 'Establish and maintain a secure network architecture', ig: '2' }],
          nist: [{ id: 'PR.IR-01', title: 'Networks and environments are protected from unauthorised logical access' }],
          insurance: { impact: 'mid', note: 'Particularly weighted for hospitality / retail clients with guest-facing wireless adjacent to cardholder environments (PCI DSS Req 1).' },
        }
      },
    ]
  },
  {
    id: 'backup', icon: '💾', title: 'Backup & Recovery',
    desc: 'Backup tooling, immutability, restore testing, RTO/RPO.',
    questions: [
      { id: 'backup_tool', tool_category: 'Backup_Tool', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is a backup tool covering all critical systems on a defined schedule (servers, M365, SaaS data)?',
        suggestion: 'Veeam, Datto, Cove, Acronis, Rubrik, Cohesity. M365 needs explicit third-party backup — native retention is not backup.',
        mappings: {
          cis: [{ id: '11.1', title: 'Establish and maintain a data recovery process', ig: '1' }, { id: '11.2', title: 'Perform automated backups', ig: '1' }],
          nist: [{ id: 'PR.DS-11', title: 'Backups of data are created, protected, maintained, and tested' }, { id: 'RC.RP-01', title: 'The recovery plan is executed' }],
          insurance: { impact: 'high', note: 'Backup tooling is asked on every renewal. Brand specifics matter to some carriers (e.g. Veeam Hardened Repository, Datto SIRIS get favourable mentions).' },
        }
      },
      { id: 'backup_immutable', tool_category: 'Backup_Immutability', question_type: 'feature', derive_strategy: 'standard',
        text: 'Is at least one backup copy immutable or air-gapped (3-2-1-1-0 principle satisfied)?',
        suggestion: 'Object-lock S3, Veeam Hardened Repository, Datto Infinite Cloud Retention, tape rotation, or air-gapped offsite copy. Replication alone is NOT immutability.',
        mappings: {
          cis: [{ id: '11.3', title: 'Protect recovery data', ig: '1' }, { id: '11.4', title: 'Establish and maintain an isolated instance of recovery data', ig: '2' }],
          nist: [{ id: 'PR.DS-11', title: 'Backups of data are created, protected, maintained, and tested' }],
          insurance: { impact: 'high', note: 'Immutability has become a near-universal requirement post-2023. Ransomware coverage is increasingly conditional on it.' },
        }
      },
      { id: 'restore_test', tool_category: 'Restore_Testing', question_type: 'process', derive_strategy: 'standard',
        text: 'Is restore testing performed at least quarterly with documented results (not just backup-job success metrics)?',
        suggestion: 'Actual restore of a non-trivial dataset to a clean environment, signed off, time-to-restore captured. Most backup tools have orchestration to automate this.',
        mappings: {
          cis: [{ id: '11.5', title: 'Test data recovery', ig: '2' }],
          nist: [{ id: 'PR.DS-11', title: 'Backups of data are created, protected, maintained, and tested' }, { id: 'RC.RP-02', title: 'Recovery actions are selected, scoped, prioritised, and performed' }],
          insurance: { impact: 'mid', note: 'Asked on most applications. "Last successful restore test" date is a common follow-up question.' },
        }
      },
      { id: 'rto_rpo', tool_category: 'RTO_RPO_Defined', question_type: 'process', derive_strategy: 'standard',
        text: 'Are RTO and RPO defined per critical system, with business-owner sign-off?',
        suggestion: 'Documented in BCP / IR Plan. Business-owner sign-off is what makes it real — IT-only definitions tend to be wishful.',
        mappings: {
          cis: [{ id: '11.1', title: 'Establish and maintain a data recovery process', ig: '1' }],
          nist: [{ id: 'GV.RM-04', title: 'Strategic direction that describes appropriate risk response options is established and communicated' }, { id: 'RC.RP-04', title: 'Critical mission functions and cybersecurity risk management are considered to establish post-incident operational norms' }],
          insurance: { impact: 'low', note: 'Process / governance question more than tooling. Not heavily weighted on cyber renewal but relevant for BCDR-aware carriers.' },
        }
      },
    ]
  },
  {
    id: 'secops', icon: '📡', title: 'Logging, Monitoring & SecOps',
    desc: 'Log aggregation, SIEM/XDR, retention, 24×7 monitoring.',
    questions: [
      { id: 'log_agg', tool_category: 'Log_Aggregation', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is centralised log aggregation in place across endpoints, servers, identity provider, and network gear?',
        suggestion: 'Splunk, Microsoft Sentinel, Elastic, Datadog, Sumo Logic, Graylog. Vendor-siloed logs that nobody correlates do not count.',
        mappings: {
          cis: [{ id: '8.2', title: 'Collect audit logs', ig: '1' }, { id: '8.9', title: 'Centralise audit logs', ig: '2' }],
          nist: [{ id: 'DE.AE-03', title: 'Information is correlated from multiple sources' }, { id: 'DE.CM-01', title: 'Networks and network services are monitored' }],
          insurance: { impact: 'mid', note: 'Log centralisation is asked on most applications. Common gap for SMBs that drives carrier scrutiny.' },
        }
      },
      { id: 'siem_xdr', tool_category: 'SIEM_XDR_MDR', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is detection running on the aggregated logs (SIEM rules, XDR correlation, or MDR provider doing it for you)?',
        suggestion: 'Microsoft Sentinel, Splunk ES, Elastic Security, Arctic Wolf, Huntress, Blackpoint Cyber, Red Canary. Log collection without detection is half a solution.',
        mappings: {
          cis: [{ id: '8.11', title: 'Conduct audit log reviews', ig: '2' }, { id: '13.1', title: 'Centralise security event alerting', ig: '2' }],
          nist: [{ id: 'DE.AE-02', title: 'Potentially adverse events are analysed to better understand associated activities' }, { id: 'DE.CM-09', title: 'Computing hardware and software, runtime environments, and their data are monitored' }],
          insurance: { impact: 'high', note: 'Active detection (in-house or MDR) is heavily favoured by carriers. Premium credits common for clients with named MDR providers.' },
        }
      },
      { id: 'log_retention', tool_category: 'Log_Retention', question_type: 'feature', derive_strategy: 'standard',
        text: 'Is log retention at least 12 months (or longer if regulatory / contract requires)?',
        suggestion: 'Hot tier ~90 days, cold storage to 12+ months. PCI requires 1 year minimum, some EU contracts demand longer. Check your insurance policy too.',
        mappings: {
          cis: [{ id: '8.10', title: 'Retain audit logs', ig: '2' }],
          nist: [{ id: 'DE.AE-03', title: 'Information is correlated from multiple sources' }],
          insurance: { impact: 'mid', note: 'Retention duration asked on most applications. <90 days is a near-universal red flag.' },
        }
      },
      { id: 'mdr_24x7', tool_category: 'Monitoring_24x7', question_type: 'process', derive_strategy: 'standard',
        text: 'Is 24×7 monitoring coverage in place (in-house SOC, MDR provider, or hybrid)?',
        suggestion: 'Most SMBs use MDR (Arctic Wolf, Huntress, Blackpoint, Expel). In-house 24×7 needs at least 6-8 analysts to be honest.',
        mappings: {
          cis: [{ id: '17.4', title: 'Establish and maintain an incident response process', ig: '1' }],
          nist: [{ id: 'DE.CM-09', title: 'Computing hardware and software, runtime environments, and their data are monitored' }, { id: 'RS.MA-01', title: 'The incident response plan is executed in coordination with relevant third parties' }],
          insurance: { impact: 'high', note: 'Heavy weight on most renewals. Named MDR provider is increasingly a near-requirement for ransomware coverage.' },
        }
      },
    ]
  },
  {
    id: 'vulnmgmt', icon: '🐛', title: 'Vulnerability Management',
    desc: 'Scanning, attack-surface, remediation SLA, pen testing.',
    questions: [
      { id: 'vuln_scan', tool_category: 'Vuln_Scanner', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is authenticated vulnerability scanning of internal hosts performed at a defined cadence?',
        suggestion: 'Tenable Nessus, Qualys VMDR, Rapid7 InsightVM, Microsoft Defender Vulnerability Management. Unauthenticated scans miss ~70% of findings.',
        mappings: {
          cis: [{ id: '7.5', title: 'Perform automated vulnerability scans of internal enterprise assets', ig: '2' }, { id: '7.6', title: 'Perform automated vulnerability scans of externally-exposed assets', ig: '2' }],
          nist: [{ id: 'ID.RA-01', title: 'Vulnerabilities in assets are identified, validated, and recorded' }],
          insurance: { impact: 'mid', note: 'Scanning cadence is asked on most renewals. Frequency expected: monthly minimum, quarterly is the floor.' },
        }
      },
      { id: 'asm', tool_category: 'Attack_Surface_Mgmt', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is external attack surface monitoring in place (continuous discovery of internet-facing assets and exposures)?',
        suggestion: 'Tenable ASM, Microsoft Defender External Attack Surface Management, Bitsight, SecurityScorecard, Censys ASM, runZero.',
        mappings: {
          cis: [{ id: '7.6', title: 'Perform automated vulnerability scans of externally-exposed assets', ig: '2' }, { id: '13.4', title: 'Perform traffic filtering between network segments', ig: '2' }],
          nist: [{ id: 'ID.RA-01', title: 'Vulnerabilities in assets are identified, validated, and recorded' }, { id: 'DE.CM-09', title: 'Computing hardware and software, runtime environments, and their data are monitored' }],
          insurance: { impact: 'mid', note: 'Several carriers now run their own ASM scans on applicants. Their findings vs your findings can affect quote.' },
        }
      },
      { id: 'remediation_sla', tool_category: 'Vuln_Remediation_Process', question_type: 'process', derive_strategy: 'standard',
        text: 'Is there a documented remediation SLA by severity, tracked to closure (critical < 7d, high < 30d, etc.)?',
        suggestion: 'Tracked in your ticketing tool (Jira, ServiceNow, Halo PSA) or vuln tool. "We patch when we can" is not an SLA.',
        mappings: {
          cis: [{ id: '7.7', title: 'Remediate detected vulnerabilities', ig: '1' }],
          nist: [{ id: 'ID.RA-06', title: 'Risk responses are chosen, prioritised, planned, tracked, and communicated' }],
          insurance: { impact: 'mid', note: 'Asked on most renewals. Open critical CVEs older than 30 days = strong negative signal.' },
        }
      },
      { id: 'pentest', tool_category: 'Penetration_Testing', question_type: 'process', derive_strategy: 'standard',
        text: 'Has a third-party penetration test been performed within the last 12 months?',
        suggestion: 'External network + web app annually. Internal / red-team for higher-maturity clients. Look for OSCP / OSCE / GIAC-certified testers.',
        mappings: {
          cis: [{ id: '18.1', title: 'Establish and maintain a penetration testing program', ig: '2' }, { id: '18.2', title: 'Perform periodic external penetration tests', ig: '2' }],
          nist: [{ id: 'ID.RA-01', title: 'Vulnerabilities in assets are identified, validated, and recorded' }, { id: 'ID.IM-02', title: 'Improvements are identified from security tests and exercises' }],
          insurance: { impact: 'mid', note: 'Asked on most cyber renewals. Frequency and last-test-date both relevant. Findings status (remediated vs open) often requested.' },
        }
      },
    ]
  },
  {
    id: 'dataprot', icon: '🔑', title: 'Data Protection & DLP',
    desc: 'Classification, DLP enforcement, key management.',
    questions: [
      { id: 'data_classification', tool_category: 'Data_Classification', question_type: 'feature', derive_strategy: 'standard',
        text: 'Is a data classification scheme applied to file / email content (Public / Internal / Confidential / Restricted)?',
        suggestion: 'Microsoft Purview Information Protection, Google Drive labels, Varonis. Labels at minimum; auto-classification preferred.',
        mappings: {
          cis: [{ id: '3.7', title: 'Establish and maintain a data classification scheme', ig: '2' }],
          nist: [{ id: 'PR.DS-01', title: 'The confidentiality, integrity, and availability of data-at-rest are protected' }, { id: 'GV.OC-03', title: 'Legal, regulatory, and contractual requirements regarding cybersecurity are understood and managed' }],
          insurance: { impact: 'low', note: 'Foundation for DLP. Not directly rated but maturity signal for higher-coverage policies.' },
        }
      },
      { id: 'dlp', tool_category: 'DLP', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is DLP tooling enforcing the classification on egress channels (email, USB, cloud uploads, copy-paste)?',
        suggestion: 'Microsoft Purview DLP, Forcepoint, Symantec DLP, Netskope, Proofpoint. Native Outlook rules are NOT DLP.',
        mappings: {
          cis: [{ id: '3.13', title: 'Deploy a data loss prevention solution', ig: '3' }],
          nist: [{ id: 'PR.DS-01', title: 'The confidentiality, integrity, and availability of data-at-rest are protected' }, { id: 'PR.DS-02', title: 'The confidentiality, integrity, and availability of data-in-transit are protected' }],
          insurance: { impact: 'mid', note: 'Increasingly asked for clients with regulated data (PHI, cardholder, PII). Not yet universal at SMB level.' },
        }
      },
      { id: 'key_mgmt', tool_category: 'Key_Management', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is key management (HSM or cloud KMS) used for sensitive data encryption keys, with rotation policy?',
        suggestion: 'AWS KMS, Azure Key Vault, Google Cloud KMS, HashiCorp Vault, YubiHSM, Thales Luna. Keys-in-config-files do not count.',
        mappings: {
          cis: [{ id: '3.11', title: 'Encrypt sensitive data at rest', ig: '2' }],
          nist: [{ id: 'PR.DS-01', title: 'The confidentiality, integrity, and availability of data-at-rest are protected' }, { id: 'PR.DS-02', title: 'The confidentiality, integrity, and availability of data-in-transit are protected' }],
          insurance: { impact: 'low', note: 'Not commonly rated at SMB. Relevant for clients with sensitive data warehouses or custom applications.' },
        }
      },
    ]
  },
  {
    id: 'opres', icon: '🚨', title: 'Operational Resilience & IR Tooling',
    desc: 'On-call paging, runbook automation, IR retainer, EDR-IR integration.',
    questions: [
      { id: 'paging', tool_category: 'On_Call_Paging', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is an on-call paging tool in place with documented escalation paths?',
        suggestion: 'PagerDuty, Opsgenie, Splunk On-Call (VictorOps), incident.io. WhatsApp groups are not a paging tool.',
        mappings: {
          cis: [{ id: '17.3', title: 'Establish and maintain an enterprise process for reporting incidents', ig: '1' }],
          nist: [{ id: 'RS.MA-01', title: 'The incident response plan is executed in coordination with relevant third parties' }, { id: 'RS.CO-02', title: 'Internal and external stakeholders are notified of incidents' }],
          insurance: { impact: 'low', note: 'Process tooling; weighted lightly on cyber renewals but expected for clients with 24×7 SLAs to their customers.' },
        }
      },
      { id: 'soar_runbook', tool_category: 'SOAR_Runbook', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is a runbook or SOAR platform in place for repeatable IR actions (isolate host, reset password, revoke session)?',
        suggestion: 'Tines, Torq, Splunk SOAR (Phantom), Microsoft Sentinel playbooks, n8n. Markdown runbooks in Confluence count for "documented" but not "automated".',
        mappings: {
          cis: [{ id: '17.5', title: 'Assign key roles and responsibilities for incident response', ig: '2' }, { id: '17.6', title: 'Define mechanisms for communicating during incident response', ig: '2' }],
          nist: [{ id: 'RS.MA-02', title: 'Incident reports are triaged and validated' }, { id: 'RS.MA-04', title: 'Incidents are escalated or elevated as needed' }],
          insurance: { impact: 'low', note: 'Maturity differentiator. Weighted for clients with named MDR providers, where SOAR integration is expected.' },
        }
      },
      { id: 'ir_retainer', tool_category: 'IR_Retainer', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is an external IR firm on retainer (or accessible via cyber-insurance panel)?',
        suggestion: 'Mandiant, CrowdStrike Services, Kroll, Arete, Coveware. Carrier-panel access counts; many policies include 24h response SLA.',
        mappings: {
          cis: [{ id: '17.1', title: 'Designate personnel to manage incident handling', ig: '1' }, { id: '17.5', title: 'Assign key roles and responsibilities for incident response', ig: '2' }],
          nist: [{ id: 'RS.MA-01', title: 'The incident response plan is executed in coordination with relevant third parties' }],
          insurance: { impact: 'mid', note: 'Carriers prefer their own panel firms. Bring-your-own retainer is fine but check carrier pre-approval to avoid coverage friction at claim time.' },
        }
      },
      { id: 'edr_ir', tool_category: 'EDR_IR_Integration', question_type: 'feature', derive_strategy: 'standard',
        text: 'Does the EDR enable remote forensic acquisition (live response, host isolation, memory capture)?',
        suggestion: 'CrowdStrike Real Time Response, SentinelOne Singularity RemoteOps, Defender for Endpoint Live Response. All modern EDRs have it; question is whether you have it enabled and tested.',
        mappings: {
          cis: [{ id: '13.6', title: 'Collect network traffic flow logs', ig: '2' }, { id: '13.7', title: 'Deploy a host-based intrusion detection (or EDR) solution', ig: '2' }],
          nist: [{ id: 'RS.AN-03', title: 'Analysis is performed to establish what has taken place during an incident' }],
          insurance: { impact: 'low', note: 'Maturity differentiator. Forensic capability via EDR can reduce IR firm engagement time and therefore claim cost.' },
        }
      },
    ]
  },
  {
    id: 'assetmgmt', icon: '📦', title: 'Asset & Configuration Management',
    desc: 'Hardware + software inventory, configuration baselines.',
    questions: [
      { id: 'hw_inventory', tool_category: 'HW_Inventory', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is hardware inventory maintained with discovered + reconciled state (not just a spreadsheet)?',
        suggestion: 'Intune / Jamf / Kandji / Workspace ONE (endpoints) + runZero / Lansweeper / Device42 (network discovery). Reconciliation against AD/Entra is the key bit.',
        mappings: {
          cis: [{ id: '1.1', title: 'Establish and maintain detailed enterprise asset inventory', ig: '1' }, { id: '1.2', title: 'Address unauthorised assets', ig: '1' }],
          nist: [{ id: 'ID.AM-01', title: 'Inventories of hardware managed by the organisation are maintained' }],
          insurance: { impact: 'low', note: 'Foundational. Lack of inventory predicts every other tooling gap, but not directly rated.' },
        }
      },
      { id: 'sw_inventory', tool_category: 'SW_Inventory', question_type: 'presence', derive_strategy: 'standard',
        text: 'Is software inventory maintained across endpoints and servers (what is installed, what version)?',
        suggestion: 'Intune / Jamf, RMM tools (NinjaOne, Datto RMM, Kaseya), or dedicated (Lansweeper, ManageEngine AssetExplorer).',
        mappings: {
          cis: [{ id: '2.1', title: 'Establish and maintain a software inventory', ig: '1' }, { id: '2.3', title: 'Address unauthorised software', ig: '1' }],
          nist: [{ id: 'ID.AM-02', title: 'Inventories of software, services, and systems managed by the organisation are maintained' }],
          insurance: { impact: 'low', note: 'Foundational. Often a gap that surfaces other tooling weaknesses; not directly rated.' },
        }
      },
      { id: 'config_baselines', tool_category: 'Config_Baseline_Enforcement', question_type: 'feature', derive_strategy: 'standard',
        text: 'Are configuration baselines enforced via MDM / GPO / DSC (CIS Benchmarks or equivalent)?',
        suggestion: 'Intune configuration profiles, GPO from a hardened baseline, PowerShell DSC, Ansible, Puppet. CIS Benchmarks or Microsoft Security Baselines as the source.',
        mappings: {
          cis: [{ id: '4.1', title: 'Establish and maintain a secure configuration process', ig: '1' }, { id: '4.2', title: 'Establish and maintain a secure configuration process for network infrastructure', ig: '1' }],
          nist: [{ id: 'PR.PS-01', title: 'Configuration management practices are established and applied' }],
          insurance: { impact: 'mid', note: 'Increasingly asked on renewals — "do you enforce a hardening baseline" is becoming standard.' },
        }
      },
    ]
  },
];

// ---- TECH STACK — state, render, handlers ----

function tsInit() {
  tsState = {
    orgId: null,
    answers: {},        // { qid: { ans: 'yes'|'no'|'na'|'partial', detail: string } }
    openCats: { endpoint: true },
    loading: true,
    saving: false,
    dirty: false,       // unsaved changes since last load/save
  };
}

async function tsLoadResponses() {
  if (!tsState || !currentOrg) return;
  try {
    const rows = await sb.techstack.getResponses(currentOrg.id);
    tsState.answers = {};
    (rows || []).forEach(r => {
      tsState.answers[r.question_id] = { ans: r.answer, detail: r.partial_detail || '' };
    });
    tsState.loading = false;
    tsState.dirty = false;
  } catch (e) {
    tsState.loading = false;
    toast('Could not load tech stack — ' + e.message, '#dc2626');
    console.error(e);
  }
}

function tsFindQuestion(qid) {
  for (const c of TS_CATS) {
    const q = c.questions.find(q => q.id === qid);
    if (q) return Object.assign({}, q, { categoryId: c.id });
  }
  return null;
}

function tsCalcScore(questions) {
  let total = 0, scored = 0;
  questions.forEach(q => {
    const a = tsState.answers[q.id];
    if (!a || a.ans === 'na') return;
    scored++;
    if (a.ans === 'yes') total += 1;
    else if (a.ans === 'partial') total += 0.5;
  });
  if (scored === 0) return null;
  return Math.round((total / scored) * 100);
}

function tsRender() {
  document.getElementById('mainContent').innerHTML = renderTechStack();
}


// ---- Tech Stack helpers ----
function tsEscAttr(s) {
  return String(s).replace(/&/g,'&amp;').replace(/'/g,'&#39;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}

function tsRenderChips(q) {
  const m = q.mappings;
  const chips = [];
  (m.cis || []).forEach(c => chips.push({ cls:'chip-cis',  fw:'CIS',  id:c.id,  tip:`CIS Controls v8 — ${c.id}\n${c.title}\n(IG ${c.ig})` }));
  (m.nist || []).forEach(c => chips.push({ cls:'chip-nist', fw:'NIST', id:c.id,  tip:`NIST CSF 2.0 — ${c.id}\n${c.title}` }));
  if (m.insurance) {
    const insCls = m.insurance.impact==='high'?'chip-ins-high':m.insurance.impact==='mid'?'chip-ins-mid':'chip-ins-low';
    chips.push({ cls:insCls, fw:'Ins', id:m.insurance.impact.toUpperCase(), tip:`Insurance — ${m.insurance.impact.toUpperCase()} impact\n\n${m.insurance.note}` });
  }
  return `<div class="chip-row">${chips.map(c =>
    `<span class="chip ${c.cls}" title="${tsEscAttr(c.tip)}"><span class="chip-fw">${c.fw}</span>${c.id}</span>`
  ).join('')}</div>`;
}

function tsRenderQuestion(q) {
  const a = (tsState.answers && tsState.answers[q.id]) || {};
  const ans = a.ans || '';
  return `<div class="ts-question">
    <div class="ts-q-text">${q.text}</div>
    <div class="ts-q-suggestion">${q.suggestion}</div>
    ${tsRenderChips(q)}
    <div class="ts-ans-row">
      ${['yes','partial','no','na'].map(k => {
        const labels = { yes:'Yes', partial:'Partial', no:'No', na:'N/A' };
        return `<button class="ts-ans-btn ${ans===k?'sel-'+k:''}" onclick="tsSetAns('${q.id}','${k}')">${labels[k]}</button>`;
      }).join('')}
    </div>
    <div class="ts-partial ${ans==='partial'?'open':''}">
      <div class="ts-partial-lbl">What is partial? (required)</div>
      <textarea placeholder="e.g. EDR on servers only, not all laptops — planned Q3" oninput="tsSetDetail('${q.id}',this.value)">${(a.detail||'').replace(/</g,'&lt;')}</textarea>
    </div>
  </div>`;
}

function renderTechStack() {
  if (!tsState) return '<div class="card">Initialising...</div>';
  if (tsState.loading) return `<div style="text-align:center;padding:2rem"><div class="spinner" style="border-color:rgba(21,33,104,0.2);border-top-color:var(--navy);width:24px;height:24px;margin:0 auto 0.75rem"></div><div style="font-size:13px;font-weight:700;color:var(--text)">Loading tech stack responses...</div></div>`;
  const allQs = TS_CATS.flatMap(c => c.questions);
  const answered = allQs.filter(q => tsState.answers[q.id] && tsState.answers[q.id].ans).length;
  const gaps     = allQs.filter(q => tsState.answers[q.id] && tsState.answers[q.id].ans==='no').length;
  const partials = allQs.filter(q => tsState.answers[q.id] && tsState.answers[q.id].ans==='partial').length;
  const overall  = tsCalcScore(allQs);
  const dirtyBanner = tsState.dirty
    ? `<div style="background:#fef9c3;border:1px solid #fcd34d;border-radius:8px;padding:0.5rem 1rem;margin-bottom:0.75rem;display:flex;align-items:center;justify-content:space-between;font-size:12px;color:#92400e">
        <span>Unsaved changes</span>
        <button class="btn btn-amber btn-sm" onclick="tsSaveAllResponses()" ${tsState.saving?'disabled':''}>
          ${tsState.saving?'Saving...':'Save now'}</button></div>` : '';
  return `${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.85rem;flex-wrap:wrap;gap:8px">
    <div style="font-size:17px;font-weight:700">Technology Stack Survey</div>
    <div style="display:flex;gap:6px">
      <button class="btn btn-outline btn-sm" onclick="tsExportSnapshot()">Export JSON</button>
      <button class="btn btn-primary btn-sm" onclick="tsSaveAllResponses()" ${tsState.saving?'disabled':''}>
        ${tsState.saving?'Saving...':'Save all'}</button>
    </div>
  </div>
  ${dirtyBanner}
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:1rem">
    ${[
      {label:'Questions',val:`${answered}/${allQs.length}`,sub:'answered'},
      {label:'Score',val:overall===null?'--':`${overall}%`,sub:'overall'},
      {label:'Gaps',val:gaps,sub:'answered No'},
      {label:'Partial',val:partials,sub:'needs detail'},
    ].map(m => `<div class="wcard"><div class="wcard-label">${m.label}</div><div class="wcard-val">${m.val}</div><div class="wcard-sub">${m.sub}</div></div>`).join('')}
  </div>
  ${TS_CATS.map(cat => {
    const isOpen = !!(tsState.openCats && tsState.openCats[cat.id]);
    const catScore = tsCalcScore(cat.questions);
    const answeredHere = cat.questions.filter(q => tsState.answers[q.id] && tsState.answers[q.id].ans).length;
    const pillClass = catScore===null?'':catScore>=70?'band-high':catScore>=40?'band-mid':'band-low';
    return `<div class="survey-panel">
      <div class="sph" onclick="tsToggleCat('${cat.id}')">
        <div style="display:flex;align-items:center;gap:8px;flex:1">
          <span style="font-size:18px">${cat.icon}</span>
          <div><div style="font-size:13px;font-weight:700;color:var(--text)">${cat.title}</div>
          <div style="font-size:11px;color:var(--muted)">${cat.desc}</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
          <span style="font-size:10px;color:var(--muted)">${answeredHere}/${cat.questions.length}</span>
          ${catScore!==null?`<span class="score-band ${pillClass}" style="font-size:10px;padding:2px 8px">${catScore}%</span>`:''}
          <span style="font-size:12px;color:var(--muted);display:inline-block;${isOpen?'transform:rotate(180deg)':''}">&#9662;</span>
        </div>
      </div>
      <div class="spb ${isOpen?'open':''}">
        ${cat.questions.map(q => tsRenderQuestion(q)).join('')}
      </div>
    </div>`;
  }).join('')}`;
}

function tsToggleCat(catId) {
  if (!tsState) return;
  tsState.openCats = tsState.openCats || {};
  tsState.openCats[catId] = !tsState.openCats[catId];
  tsRender();
}

function tsSetAns(qid, ans) {
  if (!tsState) return;
  const prev = tsState.answers[qid] || {};
  tsState.answers[qid] = { ans, detail: prev.detail || '' };
  tsState.dirty = true;
  tsRender();
}

function tsSetDetail(qid, detail) {
  if (!tsState) return;
  if (!tsState.answers[qid]) tsState.answers[qid] = { ans:'partial', detail:'' };
  tsState.answers[qid].detail = detail;
  tsState.dirty = true;
}

async function tsSaveAllResponses() {
  if (!tsState || !currentOrg) { toast('Select an organisation first','#dc2626'); return; }
  if (tsState.saving) return;
  tsState.saving = true; tsRender();
  let saved = 0, failed = 0;
  const allQs = TS_CATS.flatMap(c => c.questions.map(q => ({ ...q, category_id: c.id })));
  for (const q of allQs) {
    const a = tsState.answers[q.id];
    if (!a || !a.ans) continue;
    try {
      await sb.techstack.upsertResponse({
        org_id: currentOrg.id, question_id: q.id,
        category_id: q.category_id,
        tool_category: q.tool_category, question_type: q.question_type,
        derive_strategy: q.derive_strategy, answer: a.ans,
        partial_detail: a.ans==='partial'?(a.detail||null):null,
        assessed_at: new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString(),
      });
      saved++;
    } catch(e) { console.warn('save failed',q.id,e); failed++; }
  }
  try {
    const score = tsCalcScore(allQs);
    if (score!==null) await sb.techstack.saveSnapshot({org_id:currentOrg.id,module:'techstack',score,assessed_at:new Date().toISOString().slice(0,10)});
  } catch {}
  tsState.saving = false; tsState.dirty = false;
  toast(failed?`Saved ${saved}, ${failed} failed`:`${saved} responses saved`, failed?'#dc2626':'#15803d');
  tsRender();
}

async function tsExportSnapshot() {
  if (!tsState) return;
  const allQs = TS_CATS.flatMap(c => c.questions);
  const snapshot = {
    org: currentOrg?{id:currentOrg.id,name:currentOrg.name,tier:currentOrg.tier}:null,
    module:'techstack', captured_at:new Date().toISOString(),
    overall_score:tsCalcScore(allQs),
    answers:TS_CATS.map(c=>({
      category:c.id, title:c.title, score:tsCalcScore(c.questions),
      questions:c.questions.map(q=>({
        id:q.id, text:q.text, tool_category:q.tool_category,
        question_type:q.question_type, derive_strategy:q.derive_strategy,
        answer:(tsState.answers[q.id]&&tsState.answers[q.id].ans)||null,
        partial_detail:(tsState.answers[q.id]&&tsState.answers[q.id].ans==='partial')?(tsState.answers[q.id].detail||''):null,
        maps_to:{cis:q.mappings.cis.map(c=>c.id),nist:q.mappings.nist.map(c=>c.id),insurance_impact:q.mappings.insurance.impact},
      })),
    })),
  };
  const json = JSON.stringify(snapshot,null,2);
  const blob = new Blob([json],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download=`techstack_${currentOrg?currentOrg.name.replace(/[^a-z0-9]/gi,'_'):'snapshot'}.json`; a.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// MULTIPLAYER — Player join experience (?join=CODE)
// ============================================================
