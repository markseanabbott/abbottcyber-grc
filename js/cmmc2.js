// cmmc2.js — CMMC Level 2 Assessment Module
// NIST SP 800-171 Rev 2 — 110 practices across 14 domains.
// SPRS score: 110 − Σ(deductions). Not Met = full weight; Partial = ceil(weight/2); Met/NA = 0.
// Score can be negative. Stored in 'assessments' table with module: 'cmmc2'.

'use strict';

// ── DOMAIN META ───────────────────────────────────────────────────────────────

const CMMC2_DOMAIN_META = {
  AC: { label: 'Access Control',                  color: '#1d4ed8', bg: '#dbeafe' },
  AT: { label: 'Awareness & Training',            color: '#0f766e', bg: '#f0fdfa' },
  AU: { label: 'Audit & Accountability',          color: '#7c3aed', bg: '#ede9fe' },
  CM: { label: 'Configuration Management',        color: '#b45309', bg: '#fef3c7' },
  IA: { label: 'Identification & Authentication', color: '#4f46e5', bg: '#e0e7ff' },
  IR: { label: 'Incident Response',               color: '#dc2626', bg: '#fee2e2' },
  MA: { label: 'Maintenance',                     color: '#d97706', bg: '#fffbeb' },
  MP: { label: 'Media Protection',                color: '#92400e', bg: '#fdf6e3' },
  PS: { label: 'Personnel Security',              color: '#475569', bg: '#f1f5f9' },
  PE: { label: 'Physical Protection',             color: '#15803d', bg: '#dcfce7' },
  RA: { label: 'Risk Assessment',                 color: '#0369a1', bg: '#e0f2fe' },
  CA: { label: 'Security Assessment',             color: '#152168', bg: '#e8ecf4' },
  SC: { label: 'System & Communications',         color: '#0891b2', bg: '#ecfeff' },
  SI: { label: 'System & Information Integrity',  color: '#065f46', bg: '#d1fae5' },
};

// ── PRACTICES DATA ────────────────────────────────────────────────────────────

const CMMC2_PRACTICES = [
  // ACCESS CONTROL (22)
  { id: '3.1.1',  domain: 'AC', l1: true,  title: 'Authorized Access Control',            sprsWeight: 5, desc: 'Limit system access to authorized users, processes, and devices.' },
  { id: '3.1.2',  domain: 'AC', l1: true,  title: 'Transaction & Function Control',       sprsWeight: 3, desc: 'Limit system access to the types of transactions and functions authorized users are permitted to execute.' },
  { id: '3.1.3',  domain: 'AC', l1: false, title: 'Control CUI Flow',                    sprsWeight: 3, desc: 'Control the flow of CUI in accordance with approved authorizations.' },
  { id: '3.1.4',  domain: 'AC', l1: false, title: 'Separation of Duties',                sprsWeight: 3, desc: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.' },
  { id: '3.1.5',  domain: 'AC', l1: false, title: 'Least Privilege',                     sprsWeight: 3, desc: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.' },
  { id: '3.1.6',  domain: 'AC', l1: false, title: 'Non-Privileged Account Use',          sprsWeight: 1, desc: 'Use non-privileged accounts or roles when accessing non-security functions.' },
  { id: '3.1.7',  domain: 'AC', l1: false, title: 'Prevent Privileged Function Execution', sprsWeight: 1, desc: 'Prevent non-privileged users from executing privileged functions and capture execution in audit logs.' },
  { id: '3.1.8',  domain: 'AC', l1: false, title: 'Unsuccessful Logon Attempts',         sprsWeight: 1, desc: 'Limit unsuccessful logon attempts.' },
  { id: '3.1.9',  domain: 'AC', l1: false, title: 'Privacy & Security Notices',          sprsWeight: 1, desc: 'Provide privacy and security notices consistent with CUI rules.' },
  { id: '3.1.10', domain: 'AC', l1: false, title: 'Session Lock',                        sprsWeight: 1, desc: 'Use session lock with pattern-hiding displays after a period of inactivity.' },
  { id: '3.1.11', domain: 'AC', l1: false, title: 'Session Termination',                 sprsWeight: 1, desc: 'Terminate (automatically) a user session after a defined condition.' },
  { id: '3.1.12', domain: 'AC', l1: false, title: 'Control Remote Access',               sprsWeight: 3, desc: 'Monitor and control remote access sessions.' },
  { id: '3.1.13', domain: 'AC', l1: false, title: 'Remote Access Cryptography',          sprsWeight: 3, desc: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.' },
  { id: '3.1.14', domain: 'AC', l1: false, title: 'Route Remote Access',                 sprsWeight: 3, desc: 'Route remote access via managed access control points.' },
  { id: '3.1.15', domain: 'AC', l1: false, title: 'Privileged Remote Commands',          sprsWeight: 1, desc: 'Authorize remote execution of privileged commands for documented operational needs only.' },
  { id: '3.1.16', domain: 'AC', l1: false, title: 'Authorize Wireless Access',           sprsWeight: 1, desc: 'Authorize wireless access prior to allowing connections.' },
  { id: '3.1.17', domain: 'AC', l1: false, title: 'Protect Wireless Access',             sprsWeight: 1, desc: 'Protect wireless access using authentication and encryption.' },
  { id: '3.1.18', domain: 'AC', l1: false, title: 'Control Mobile Devices',              sprsWeight: 1, desc: 'Control connection of mobile devices.' },
  { id: '3.1.19', domain: 'AC', l1: false, title: 'Encrypt CUI on Mobile',              sprsWeight: 3, desc: 'Encrypt CUI on mobile devices and mobile computing platforms.' },
  { id: '3.1.20', domain: 'AC', l1: true,  title: 'External Connections',                sprsWeight: 3, desc: 'Verify and control/limit connections to external information systems.' },
  { id: '3.1.21', domain: 'AC', l1: false, title: 'Portable Storage Devices',            sprsWeight: 1, desc: 'Limit use of portable storage devices on external systems.' },
  { id: '3.1.22', domain: 'AC', l1: true,  title: 'Publicly Accessible Content',         sprsWeight: 1, desc: 'Control CUI posted or processed on publicly accessible information systems.' },

  // AWARENESS & TRAINING (3)
  { id: '3.2.1',  domain: 'AT', l1: false, title: 'Role-Based Risk Awareness',           sprsWeight: 3, desc: 'Ensure managers, system administrators, and users are aware of security risks associated with their activities.' },
  { id: '3.2.2',  domain: 'AT', l1: false, title: 'Role-Based Security Training',        sprsWeight: 3, desc: 'Ensure organizational personnel are adequately trained to carry out assigned information security responsibilities.' },
  { id: '3.2.3',  domain: 'AT', l1: false, title: 'Insider Threat Awareness',            sprsWeight: 1, desc: 'Provide security awareness training on recognizing and reporting potential insider threats.' },

  // AUDIT & ACCOUNTABILITY (9)
  { id: '3.3.1',  domain: 'AU', l1: false, title: 'System Audit Logging',                sprsWeight: 3, desc: 'Create and retain system audit logs to enable monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.' },
  { id: '3.3.2',  domain: 'AU', l1: false, title: 'User Action Traceability',            sprsWeight: 3, desc: 'Ensure that the actions of individual users can be traced to those users so they can be held accountable.' },
  { id: '3.3.3',  domain: 'AU', l1: false, title: 'Review Logged Events',                sprsWeight: 1, desc: 'Review and update logged events.' },
  { id: '3.3.4',  domain: 'AU', l1: false, title: 'Alert on Audit Failure',              sprsWeight: 1, desc: 'Alert in the event of an audit logging process failure.' },
  { id: '3.3.5',  domain: 'AU', l1: false, title: 'Correlate Audit Records',             sprsWeight: 1, desc: 'Correlate audit record review, analysis, and reporting processes for investigation and response.' },
  { id: '3.3.6',  domain: 'AU', l1: false, title: 'Audit Reduction & Reporting',         sprsWeight: 1, desc: 'Provide audit record reduction and report generation to support on-demand analysis and reporting.' },
  { id: '3.3.7',  domain: 'AU', l1: false, title: 'Authoritative Time Source',           sprsWeight: 1, desc: 'Provide system capability that compares and synchronizes internal clocks with an authoritative source.' },
  { id: '3.3.8',  domain: 'AU', l1: false, title: 'Protect Audit Information',           sprsWeight: 1, desc: 'Protect audit information and tools from unauthorized access, modification, and deletion.' },
  { id: '3.3.9',  domain: 'AU', l1: false, title: 'Limit Audit Management',              sprsWeight: 1, desc: 'Limit management of audit logging to a subset of privileged users.' },

  // CONFIGURATION MANAGEMENT (9)
  { id: '3.4.1',  domain: 'CM', l1: false, title: 'Baseline Configurations',             sprsWeight: 3, desc: 'Establish and maintain baseline configurations and inventories of organizational systems throughout their life cycles.' },
  { id: '3.4.2',  domain: 'CM', l1: false, title: 'Security Configuration Settings',     sprsWeight: 3, desc: 'Establish and enforce security configuration settings for information technology products employed in organizational systems.' },
  { id: '3.4.3',  domain: 'CM', l1: false, title: 'Track System Changes',                sprsWeight: 1, desc: 'Track, review, approve, and log changes to organizational systems.' },
  { id: '3.4.4',  domain: 'CM', l1: false, title: 'Analyze Security Impact',             sprsWeight: 1, desc: 'Analyze the security impact of changes prior to implementation.' },
  { id: '3.4.5',  domain: 'CM', l1: false, title: 'Access Restriction for Change',       sprsWeight: 1, desc: 'Define, document, approve, and enforce physical and logical access restrictions associated with system changes.' },
  { id: '3.4.6',  domain: 'CM', l1: false, title: 'Least Functionality',                 sprsWeight: 1, desc: 'Employ the principle of least functionality by configuring systems to provide only essential capabilities.' },
  { id: '3.4.7',  domain: 'CM', l1: false, title: 'Nonessential Functions',              sprsWeight: 1, desc: 'Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.' },
  { id: '3.4.8',  domain: 'CM', l1: false, title: 'Application Execution Policy',        sprsWeight: 1, desc: 'Apply deny-by-exception policy to prevent use of unauthorized software.' },
  { id: '3.4.9',  domain: 'CM', l1: false, title: 'User-Installed Software',             sprsWeight: 1, desc: 'Control and monitor user-installed software.' },

  // IDENTIFICATION & AUTHENTICATION (11)
  { id: '3.5.1',  domain: 'IA', l1: true,  title: 'Identification',                      sprsWeight: 3, desc: 'Identify information system users, processes, or devices.' },
  { id: '3.5.2',  domain: 'IA', l1: true,  title: 'Authentication',                      sprsWeight: 5, desc: 'Authenticate the identities of users, processes, or devices before allowing access.' },
  { id: '3.5.3',  domain: 'IA', l1: false, title: 'Multi-Factor Authentication',         sprsWeight: 5, desc: 'Use multi-factor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.' },
  { id: '3.5.4',  domain: 'IA', l1: false, title: 'Replay-Resistant Authentication',     sprsWeight: 1, desc: 'Employ replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts.' },
  { id: '3.5.5',  domain: 'IA', l1: false, title: 'Identifier Management',               sprsWeight: 1, desc: 'Employ identifier management practices.' },
  { id: '3.5.6',  domain: 'IA', l1: false, title: 'Disable Inactive Identifiers',        sprsWeight: 1, desc: 'Disable identifiers after a defined inactivity period.' },
  { id: '3.5.7',  domain: 'IA', l1: false, title: 'Password Complexity',                 sprsWeight: 1, desc: 'Enforce a minimum password complexity and change of characters when new passwords are created.' },
  { id: '3.5.8',  domain: 'IA', l1: false, title: 'Password Reuse',                      sprsWeight: 1, desc: 'Prohibit password reuse for a specified number of generations.' },
  { id: '3.5.9',  domain: 'IA', l1: false, title: 'Temporary Passwords',                 sprsWeight: 1, desc: 'Allow temporary password use with an immediate change requirement.' },
  { id: '3.5.10', domain: 'IA', l1: false, title: 'Cryptographic Password Protection',   sprsWeight: 1, desc: 'Store and transmit only cryptographically-protected passwords.' },
  { id: '3.5.11', domain: 'IA', l1: false, title: 'Obscure Authentication Feedback',     sprsWeight: 1, desc: 'Obscure feedback of authentication information.' },

  // INCIDENT RESPONSE (3)
  { id: '3.6.1',  domain: 'IR', l1: false, title: 'Incident-Handling Capability',        sprsWeight: 5, desc: 'Establish an operational incident-handling capability that includes preparation, detection, analysis, containment, recovery, and user response activities.' },
  { id: '3.6.2',  domain: 'IR', l1: false, title: 'Track, Document & Report Incidents',  sprsWeight: 3, desc: 'Track, document, and report incidents to designated officials and authorities both internal and external to the organization.' },
  { id: '3.6.3',  domain: 'IR', l1: false, title: 'Test Incident Response',              sprsWeight: 1, desc: 'Test the organizational incident response capability.' },

  // MAINTENANCE (6)
  { id: '3.7.1',  domain: 'MA', l1: false, title: 'System Maintenance',                  sprsWeight: 1, desc: 'Perform maintenance on organizational systems.' },
  { id: '3.7.2',  domain: 'MA', l1: false, title: 'Maintenance Controls',                sprsWeight: 1, desc: 'Provide controls on the tools, techniques, mechanisms, and personnel that perform maintenance.' },
  { id: '3.7.3',  domain: 'MA', l1: false, title: 'Equipment Sanitization',              sprsWeight: 1, desc: 'Ensure equipment removed for off-site maintenance is sanitized of any CUI.' },
  { id: '3.7.4',  domain: 'MA', l1: false, title: 'Check Media for Malicious Code',      sprsWeight: 1, desc: 'Check media containing diagnostic and test programs for malicious code before the media are used in organizational systems.' },
  { id: '3.7.5',  domain: 'MA', l1: false, title: 'MFA for Remote Maintenance',          sprsWeight: 3, desc: 'Require MFA to establish remote maintenance sessions via external networks and terminate sessions when maintenance is complete.' },
  { id: '3.7.6',  domain: 'MA', l1: false, title: 'Supervise Maintenance Personnel',     sprsWeight: 1, desc: 'Supervise the maintenance activities of personnel without required access authorization.' },

  // MEDIA PROTECTION (9)
  { id: '3.8.1',  domain: 'MP', l1: false, title: 'Protect System Media',                sprsWeight: 3, desc: 'Protect (physically control and securely store) system media containing CUI, both paper and digital.' },
  { id: '3.8.2',  domain: 'MP', l1: false, title: 'Limit Access to CUI Media',           sprsWeight: 3, desc: 'Limit access to CUI on system media to authorized users.' },
  { id: '3.8.3',  domain: 'MP', l1: true,  title: 'Media Disposal',                      sprsWeight: 3, desc: 'Sanitize or destroy system media containing CUI before disposal or reuse.' },
  { id: '3.8.4',  domain: 'MP', l1: false, title: 'Mark CUI Media',                      sprsWeight: 1, desc: 'Mark media with necessary CUI markings and distribution limitations.' },
  { id: '3.8.5',  domain: 'MP', l1: false, title: 'Control Access to Media',             sprsWeight: 1, desc: 'Control access to media containing CUI and maintain accountability for media during transport.' },
  { id: '3.8.6',  domain: 'MP', l1: false, title: 'Implement Protective Measures for CUI Transport', sprsWeight: 1, desc: 'Implement cryptographic mechanisms to protect CUI during transit unless protected by alternative physical safeguards.' },
  { id: '3.8.7',  domain: 'MP', l1: false, title: 'Control Removable Media',             sprsWeight: 1, desc: 'Control the use of removable media on system components.' },
  { id: '3.8.8',  domain: 'MP', l1: false, title: 'Prohibit Portable Storage',           sprsWeight: 1, desc: 'Prohibit the use of portable storage devices when such devices have no identifiable owner.' },
  { id: '3.8.9',  domain: 'MP', l1: false, title: 'Protect CUI Backups',                 sprsWeight: 1, desc: 'Protect the confidentiality of backup CUI at storage locations.' },

  // PERSONNEL SECURITY (2)
  { id: '3.9.1',  domain: 'PS', l1: false, title: 'Screen Individuals',                  sprsWeight: 3, desc: 'Screen individuals prior to authorizing access to organizational systems containing CUI.' },
  { id: '3.9.2',  domain: 'PS', l1: false, title: 'Protect CUI During Personnel Actions', sprsWeight: 3, desc: 'Ensure that CUI is protected during and after personnel actions such as terminations and transfers.' },

  // PHYSICAL PROTECTION (6)
  { id: '3.10.1', domain: 'PE', l1: true,  title: 'Limit Physical Access',               sprsWeight: 3, desc: 'Limit physical access to organizational systems, equipment, and operating environments to authorized individuals.' },
  { id: '3.10.2', domain: 'PE', l1: true,  title: 'Monitor Facility',                    sprsWeight: 1, desc: 'Protect and monitor the physical facility and support infrastructure for organizational systems.' },
  { id: '3.10.3', domain: 'PE', l1: true,  title: 'Escort Visitors',                     sprsWeight: 1, desc: 'Escort visitors and monitor visitor activity.' },
  { id: '3.10.4', domain: 'PE', l1: true,  title: 'Physical Access Logs',                sprsWeight: 1, desc: 'Maintain audit logs of physical access.' },
  { id: '3.10.5', domain: 'PE', l1: false, title: 'Manage Physical Access Devices',      sprsWeight: 1, desc: 'Control and manage physical access devices.' },
  { id: '3.10.6', domain: 'PE', l1: false, title: 'Alternate Work Site Safeguards',      sprsWeight: 1, desc: 'Enforce safeguarding measures for CUI at alternate work sites.' },

  // RISK ASSESSMENT (3)
  { id: '3.11.1', domain: 'RA', l1: false, title: 'Risk Assessment',                     sprsWeight: 5, desc: 'Periodically assess the risk to organizational operations, assets, and individuals resulting from the operation of organizational systems processing CUI.' },
  { id: '3.11.2', domain: 'RA', l1: false, title: 'Vulnerability Scanning',              sprsWeight: 5, desc: 'Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems are identified.' },
  { id: '3.11.3', domain: 'RA', l1: false, title: 'Remediate Vulnerabilities',           sprsWeight: 3, desc: 'Remediate vulnerabilities in accordance with risk assessments.' },

  // SECURITY ASSESSMENT (4)
  { id: '3.12.1', domain: 'CA', l1: false, title: 'Assess Security Controls',            sprsWeight: 3, desc: 'Periodically assess the security controls in organizational systems to determine if the controls are effective.' },
  { id: '3.12.2', domain: 'CA', l1: false, title: 'Develop Plans of Action',             sprsWeight: 3, desc: 'Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities.' },
  { id: '3.12.3', domain: 'CA', l1: false, title: 'Monitor Security Controls',           sprsWeight: 3, desc: 'Monitor security controls on an ongoing basis to ensure continued effectiveness.' },
  { id: '3.12.4', domain: 'CA', l1: false, title: 'System Security Plan',                sprsWeight: 1, desc: 'Develop, document, and periodically update system security plans that describe system boundaries and how security requirements are implemented.' },

  // SYSTEM & COMMUNICATIONS PROTECTION (16)
  { id: '3.13.1',  domain: 'SC', l1: true,  title: 'Boundary Protection',                sprsWeight: 5, desc: 'Monitor, control, and protect communications at external boundaries and key internal boundaries of information systems.' },
  { id: '3.13.2',  domain: 'SC', l1: false, title: 'Architect for Security',             sprsWeight: 3, desc: 'Employ architectural designs, software development techniques, and systems engineering principles promoting security.' },
  { id: '3.13.3',  domain: 'SC', l1: false, title: 'Separate User/System Functionality', sprsWeight: 1, desc: 'Separate user functionality from system management functionality.' },
  { id: '3.13.4',  domain: 'SC', l1: false, title: 'Prevent Unauthorized Information Transfer', sprsWeight: 1, desc: 'Prevent unauthorized and unintended information transfer via shared system resources.' },
  { id: '3.13.5',  domain: 'SC', l1: true,  title: 'Public-Access Separation',           sprsWeight: 3, desc: 'Implement subnetworks for publicly accessible components that are physically or logically separated from internal networks.' },
  { id: '3.13.6',  domain: 'SC', l1: false, title: 'Deny Communication by Default',      sprsWeight: 1, desc: 'Deny network communications by default and allow by exception (deny-all, permit-by-exception).' },
  { id: '3.13.7',  domain: 'SC', l1: false, title: 'Prevent Split Tunneling',            sprsWeight: 1, desc: 'Prevent remote devices from simultaneously connecting to the system and to resources in other domains.' },
  { id: '3.13.8',  domain: 'SC', l1: false, title: 'Implement Cryptography for CUI in Transit', sprsWeight: 5, desc: 'Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission.' },
  { id: '3.13.9',  domain: 'SC', l1: false, title: 'Terminate Network Connections',      sprsWeight: 1, desc: 'Terminate network connections after a defined period of inactivity.' },
  { id: '3.13.10', domain: 'SC', l1: false, title: 'Cryptographic Key Management',       sprsWeight: 3, desc: 'Establish and manage cryptographic keys for cryptography employed in organizational systems.' },
  { id: '3.13.11', domain: 'SC', l1: false, title: 'FIPS-Validated Cryptography',        sprsWeight: 3, desc: 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.' },
  { id: '3.13.12', domain: 'SC', l1: false, title: 'Prohibit Remote Activation of Collaborative Devices', sprsWeight: 1, desc: 'Prohibit remote activation of collaborative computing devices and provide indication of use to present users.' },
  { id: '3.13.13', domain: 'SC', l1: false, title: 'Control Mobile Code',                sprsWeight: 3, desc: 'Control and monitor the use of mobile code.' },
  { id: '3.13.14', domain: 'SC', l1: false, title: 'Control VoIP',                       sprsWeight: 3, desc: 'Control and monitor the use of VoIP technologies.' },
  { id: '3.13.15', domain: 'SC', l1: false, title: 'Protect Authenticity',               sprsWeight: 1, desc: 'Protect the authenticity of communications sessions.' },
  { id: '3.13.16', domain: 'SC', l1: false, title: 'Protect CUI at Rest',                sprsWeight: 3, desc: 'Protect the confidentiality of CUI at rest.' },

  // SYSTEM & INFORMATION INTEGRITY (7)
  { id: '3.14.1', domain: 'SI', l1: true,  title: 'Flaw Remediation',                   sprsWeight: 5, desc: 'Identify, report, and correct information and information system flaws in a timely manner.' },
  { id: '3.14.2', domain: 'SI', l1: true,  title: 'Malicious Code Protection',           sprsWeight: 5, desc: 'Provide protection from malicious code at appropriate locations within organizational systems.' },
  { id: '3.14.3', domain: 'SI', l1: false, title: 'Security Alerts & Advisories',        sprsWeight: 3, desc: 'Monitor system security alerts and advisories and take action in response.' },
  { id: '3.14.4', domain: 'SI', l1: true,  title: 'Update Malicious Code Protection',    sprsWeight: 3, desc: 'Update malicious code protection mechanisms when new releases are available.' },
  { id: '3.14.5', domain: 'SI', l1: true,  title: 'System Scanning',                    sprsWeight: 3, desc: 'Perform periodic scans of organizational systems and real-time scans of files from external sources.' },
  { id: '3.14.6', domain: 'SI', l1: false, title: 'Monitor for Attacks',                 sprsWeight: 5, desc: 'Monitor organizational systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.' },
  { id: '3.14.7', domain: 'SI', l1: false, title: 'Identify Unauthorized Use',           sprsWeight: 3, desc: 'Identify unauthorized use of organizational systems.' },
];

// ── STATE ─────────────────────────────────────────────────────────────────────

let cmmc2State = {
  answers: {}, notes: {}, openPanels: {},
  orgId: null, view: 'dashboard',
  conductedBy: '', date: '', editId: null,
  poamRun: null, poamItems: {},
  reportRun: null, reportCommentary: '',
};

function cmmc2Hydrate() {
  if (cmmc2State.orgId === currentOrg?.id) return;
  const runs = (orgAssessments[currentOrg?.id] || {})['cmmc2'] || [];
  const last  = runs.length ? runs[runs.length - 1] : null;
  const raw   = last ? Object.assign({}, last.answers || {}) : {};
  const ans   = Object.fromEntries(Object.entries(raw).filter(([k]) => !k.startsWith('_')));
  cmmc2State = {
    answers: ans, notes: {}, openPanels: {},
    orgId: currentOrg?.id, view: 'dashboard',
    conductedBy: '', date: '', editId: null,
    poamRun: null, poamItems: {},
    reportRun: null, reportCommentary: '',
  };
}

// ── SCORING ───────────────────────────────────────────────────────────────────

function cmmc2CalcScore(answers) {
  let yes = 0, partial = 0, no = 0, na = 0;
  CMMC2_PRACTICES.forEach(p => {
    const a = answers[p.id] || '';
    if (a === 'yes')          yes++;
    else if (a === 'partial') partial++;
    else if (a === 'no')      no++;
    else if (a === 'na')      na++;
  });
  const total     = CMMC2_PRACTICES.length;
  const scoreable = total - na;
  const score     = scoreable > 0 ? Math.round((yes + partial * 0.5) / scoreable * 100) : 0;
  const answered  = yes + partial + no + na;
  return { score, yes, partial, no, na, total, scoreable, answered };
}

function cmmc2GetGaps(answers) {
  return CMMC2_PRACTICES.filter(p => {
    const a = answers[p.id] || '';
    return a === 'no' || a === 'partial';
  });
}

function cmmc2DomainProgress(answers) {
  return Object.entries(CMMC2_DOMAIN_META).map(([key, meta]) => {
    const practices = CMMC2_PRACTICES.filter(p => p.domain === key);
    let yes = 0, partial = 0, no = 0, na = 0;
    practices.forEach(p => {
      const a = answers[p.id] || '';
      if (a === 'yes') yes++; else if (a === 'partial') partial++;
      else if (a === 'no') no++; else if (a === 'na') na++;
    });
    const scoreable = practices.length - na;
    const pct = scoreable > 0 ? Math.round((yes + partial * 0.5) / scoreable * 100) : 0;
    return { key, label: meta.label, color: meta.color, bg: meta.bg, yes, partial, no, na, total: practices.length, pct };
  });
}

function cmmc2SprsCalc(answers) {
  let deductions = 0;
  CMMC2_PRACTICES.forEach(p => {
    const a = answers[p.id] || '';
    if (a === 'no')           deductions += p.sprsWeight;
    else if (a === 'partial') deductions += Math.ceil(p.sprsWeight / 2);
  });
  const sprs = 110 - deductions;
  return { sprs, deductions, maxScore: 110 };
}

// ── RENDER ROUTER ─────────────────────────────────────────────────────────────

function renderCMMC2() {
  if (!currentOrg) return '';
  cmmc2Hydrate();
  if (cmmc2State.view === 'form')   return renderCMMC2Form();
  if (cmmc2State.view === 'poam')   return renderCMMC2Poam();
  if (cmmc2State.view === 'report') return renderCMMC2Exec();
  if (cmmc2State.view === 'sprs')   return renderCMMC2Sprs();
  return renderCMMC2Dashboard();
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

function renderCMMC2Dashboard() {
  const runs   = (orgAssessments[currentOrg.id] || {})['cmmc2'] || [];
  const sorted = [...runs].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const latest = sorted[0] || null;
  const latestAns = latest
    ? Object.fromEntries(Object.entries(latest.answers || {}).filter(([k]) => !k.startsWith('_')))
    : {};

  const { score, yes, partial, no, na, total, scoreable, answered } = latest
    ? cmmc2CalcScore(latestAns)
    : { score: 0, yes: 0, partial: 0, no: 0, na: 0, total: 110, scoreable: 110, answered: 0 };

  const { band, bandCol } = acScoreBand(score);
  const domainProgress    = latest ? cmmc2DomainProgress(latestAns) : [];

  const categoryBarsHtml = domainProgress.map(d => `
    <div style="flex:1;min-width:100px">
      <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:3px">
        <span style="font-size:10px;font-weight:700;color:${d.color}">${d.key}</span>
        <span style="font-size:9px;color:rgba(255,255,255,.5)">${d.total}p</span>
        <span style="font-size:10px;color:rgba(255,255,255,.7);margin-left:auto">${d.yes + d.partial}/${d.total - d.na}</span>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.12);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${d.pct}%;background:${d.color};border-radius:2px;transition:width .4s"></div>
      </div>
    </div>`).join('');

  const heroHtml = acScoreHeroHtml({
    score, hasData: !!latest && answered > 0, band, bandCol,
    badge: 'CMMC L2', badgeBg: '#e0e7ff', badgeTxt: '#4f46e5',
    answered, total: scoreable,
    date: latest?.date || '',
    trendCanvasId: 'cmmc2TrendChart',
    runCount: runs.length,
    categoryBarsHtml: latest && answered > 0 ? categoryBarsHtml : '',
  });

  const pctCell = (pct) => {
    const c = pct >= 75 ? '#15803d' : pct >= 50 ? '#b45309' : '#dc2626';
    return `<span style="font-size:13px;font-weight:700;color:${c}">${pct}%</span>`;
  };

  const historyHtml = acHistoryTableHtml({
    headerLabel: 'Assessment History',
    headerButtons: `
      <button class="btn btn-cyan btn-sm" onclick="cmmc2StartNew()">+ New Assessment</button>`,
    runs,
    emptyIcon: '🔐',
    emptyTitle: 'No CMMC Level 2 assessments yet',
    emptyBody: 'Run your first CMMC L2 / NIST SP 800-171 self-assessment to establish your CUI baseline and calculate your SPRS score.',
    emptyActionHtml: `<button class="btn btn-cyan btn-sm" onclick="cmmc2StartNew()">+ Start First Assessment</button>`,
    colHeaders: [
      { label: 'Date',         style: 'text-align:left;padding:7px 10px' },
      { label: 'Score',        style: 'text-align:center;padding:7px 8px' },
      { label: 'SPRS',         style: 'text-align:center;padding:7px 8px' },
      { label: 'Met',          style: 'text-align:center;padding:7px 8px' },
      { label: 'Partial',      style: 'text-align:center;padding:7px 8px' },
      { label: 'Not Met',      style: 'text-align:center;padding:7px 8px' },
      { label: 'Conducted By', style: 'text-align:left;padding:7px 10px' },
      { label: 'Actions',      style: 'text-align:right;padding:7px 10px' },
    ],
    rowFn: (run, _sortedIdx, origIdx) => {
      const ans  = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
      const s    = cmmc2CalcScore(ans);
      const sp   = cmmc2SprsCalc(ans);
      const isLatest = origIdx === runs.indexOf(latest);
      const sprsCol  = sp.sprs >= 88 ? '#15803d' : sp.sprs >= 60 ? '#b45309' : '#dc2626';
      return `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px;font-weight:${isLatest ? '700' : '400'}">
          ${run.date || '—'}
          ${isLatest ? '<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;background:#e0e7ff;color:#4f46e5;margin-left:6px">Latest</span>' : ''}
        </td>
        <td style="padding:8px 8px;text-align:center">${s.answered > 0 ? pctCell(s.score) : '<span style="color:var(--muted)">—</span>'}</td>
        <td style="padding:8px 8px;text-align:center"><span style="font-weight:700;font-family:monospace;color:${sprsCol}">${s.answered > 0 ? sp.sprs : '—'}</span></td>
        <td style="padding:8px 8px;text-align:center"><span style="font-weight:700;color:#15803d">${s.yes}</span></td>
        <td style="padding:8px 8px;text-align:center"><span style="font-weight:700;color:#b45309">${s.partial}</span></td>
        <td style="padding:8px 8px;text-align:center"><span style="font-weight:700;color:#dc2626">${s.no}</span></td>
        <td style="padding:8px 10px;color:var(--muted)">${escH(run.conductedBy || '—')}</td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap">
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cmmc2OpenReport(${origIdx})">📊 Report</button>
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cmmc2OpenPoam(${origIdx})">📋 POAM</button>
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cmmc2OpenSprs(${origIdx})">🏛 SPRS</button>
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cmmc2OpenAssessment(${origIdx})">View / Edit</button>
          <button class="btn btn-red btn-sm" onclick="cmmc2DeleteAssessment(${origIdx})">Delete</button>
        </td>
      </tr>`;
    },
  });

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🔐 CMMC Level 2</div>
      <div style="font-size:12px;color:var(--muted)">110 practices · 14 domains · NIST SP 800-171 Rev 2 · CUI protection · SPRS self-assessment</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="setNav('assessments')">← Hub</button>
      <button class="btn btn-cyan btn-sm" onclick="cmmc2StartNew()">+ New Assessment</button>
    </div>
  </div>
  ${heroHtml}
  ${historyHtml}
  <div class="card" style="padding:1.1rem;margin-top:1rem;border-left:4px solid #4f46e5">
    <div style="font-size:13px;font-weight:700;margin-bottom:6px;color:var(--text)">ℹ️ About CMMC Level 2</div>
    <div style="font-size:12px;color:var(--muted);line-height:1.7">
      CMMC Level 2 applies to DoD contractors handling <strong>Controlled Unclassified Information (CUI)</strong>. It is based on <strong>NIST SP 800-171 Rev 2</strong> — all 110 practices across 14 domains. The SPRS score ranges from <strong>−203 to 110</strong>; the DoD target is 110 (full compliance). Level 2 requires annual self-assessment and senior official attestation in SPRS.
      <br><br>
      <strong>Programs handling critical CUI</strong> may require a third-party CMMC Assessment Organization (C3PAO) assessment rather than self-assessment. Confirm with your contracting officer.
    </div>
  </div>`;
}

function cmmc2TrendDraw() {
  const runs = (orgAssessments[currentOrg?.id] || {})['cmmc2'] || [];
  acTrendDraw('cmmc2TrendChart', runs, '#4f46e5');
}

// ── ASSESSMENT FORM ───────────────────────────────────────────────────────────

function renderCMMC2Form() {
  const isEdit  = !!cmmc2State.editId;
  const runs    = (orgAssessments[currentOrg.id] || {})['cmmc2'] || [];
  const editRun = isEdit ? runs.find(r => r.id === cmmc2State.editId) : null;
  const answers = cmmc2State.answers;
  const today   = new Date().toISOString().split('T')[0];

  const { score, yes, partial, no, na, answered, total, scoreable } = cmmc2CalcScore(answers);
  const { band, bandCol } = acScoreBand(score);
  const sprs = cmmc2SprsCalc(answers);

  const domains = Object.keys(CMMC2_DOMAIN_META);

  const ansBtn = (practiceId, val, label, col) => {
    const active = answers[practiceId] === val;
    return `<button onclick="cmmc2SetAnswer('${practiceId}','${val}')"
      style="padding:5px 14px;font-size:11px;font-weight:700;border-radius:16px;border:2px solid ${active ? col : 'var(--border)'};
      background:${active ? col : '#fff'};color:${active ? '#fff' : 'var(--muted)'};cursor:pointer;transition:all .12s">
      ${label}
    </button>`;
  };

  const domainsHtml = domains.map(domKey => {
    const meta      = CMMC2_DOMAIN_META[domKey];
    const practices = CMMC2_PRACTICES.filter(p => p.domain === domKey);
    const dYes      = practices.filter(p => answers[p.id] === 'yes').length;
    const dTotal    = practices.length;
    const isOpen    = cmmc2State.openPanels[domKey] !== false;

    const practicesHtml = practices.map(p => {
      const ans   = answers[p.id] || '';
      const rowBg = ans === 'no' ? 'background:rgba(220,38,38,.03)' : ans === 'partial' ? 'background:rgba(180,83,9,.03)' : '';
      return `<div style="padding:12px 14px;border-bottom:1px solid var(--border);${rowBg}">
        <div style="display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap">
          <div style="flex:1;min-width:260px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
              <span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:8px;background:${meta.bg};color:${meta.color};white-space:nowrap">${escH(p.id)}</span>
              ${p.l1 ? '<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;background:#e0f2fe;color:#0369a1;white-space:nowrap">L1</span>' : ''}
              <span style="font-size:13px;font-weight:700;color:var(--text)">${escH(p.title)}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);line-height:1.55">${escH(p.desc)}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;flex-wrap:wrap">
            ${ansBtn(p.id, 'yes',     'Met',     '#15803d')}
            ${ansBtn(p.id, 'partial', 'Partial', '#b45309')}
            ${ansBtn(p.id, 'no',      'Not Met', '#dc2626')}
            ${ansBtn(p.id, 'na',      'N/A',     '#94a3b8')}
          </div>
        </div>
      </div>`;
    }).join('');

    return `<div class="card" style="padding:0;overflow:hidden;margin-bottom:0.75rem">
      <div onclick="cmmc2TogglePanel('${domKey}')" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:pointer;background:${meta.bg}">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:12px;font-weight:800;color:${meta.color}">${domKey}</span>
          <span style="font-size:13px;font-weight:700;color:var(--text)">${meta.label}</span>
          <span style="font-size:11px;color:${meta.color};font-weight:600">${dYes}/${dTotal} met</span>
        </div>
        <span style="font-size:13px;color:var(--muted)">${isOpen ? '▴' : '▾'}</span>
      </div>
      ${isOpen ? `<div>${practicesHtml}</div>` : ''}
    </div>`;
  }).join('');

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">🔐 CMMC Level 2 — Assessment</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · ${isEdit ? 'Editing ' + (editRun?.date || '') : 'New assessment'}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="cmmc2NavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" id="cmmc2PrefillBtn" onclick="cmmc2PrefillFromTS()" title="Pre-populate practices from your Technology Stack survey">&#8681; From Tech Stack</button>
      <button class="btn btn-cyan btn-sm" id="cmmc2SaveBtn" onclick="cmmc2SaveAssessment()">💾 Save Assessment</button>
    </div>
  </div>

  <div class="card" style="padding:1rem;margin-bottom:1rem;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
    <div style="display:flex;align-items:center;gap:12px;flex:1;flex-wrap:wrap">
      <div>
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:3px">Conducted By</div>
        <input type="text" id="cmmc2ConductedBy" value="${escH(cmmc2State.conductedBy)}" placeholder="Your name"
          oninput="cmmc2State.conductedBy=this.value"
          style="padding:6px 10px;border-radius:6px;border:1px solid var(--border);font-size:12px;font-family:Inter,sans-serif;width:180px">
      </div>
      <div>
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:3px">Assessment Date</div>
        <input type="date" id="cmmc2Date" value="${cmmc2State.date || today}"
          oninput="cmmc2State.date=this.value"
          style="padding:6px 10px;border-radius:6px;border:1px solid var(--border);font-size:12px;font-family:Inter,sans-serif">
      </div>
    </div>
    <div style="display:flex;gap:16px;padding:8px 16px;border-left:1px solid var(--border)">
      <div style="text-align:center">
        <div style="font-size:10px;color:var(--muted);margin-bottom:2px">Progress</div>
        <div style="font-size:20px;font-weight:800;color:${answered === total ? '#15803d' : bandCol}">${answered}/${total}</div>
        <div style="font-size:10px;font-weight:700;color:${bandCol}">${answered > 0 ? score + '%' : '—'}</div>
      </div>
      <div style="text-align:center">
        <div style="font-size:10px;color:var(--muted);margin-bottom:2px">SPRS Est.</div>
        <div style="font-size:20px;font-weight:800;font-family:monospace;color:${sprs.sprs >= 88 ? '#15803d' : sprs.sprs >= 60 ? '#b45309' : '#dc2626'}">${answered > 0 ? sprs.sprs : '—'}</div>
        <div style="font-size:10px;color:var(--muted)">of 110</div>
      </div>
    </div>
  </div>

  ${domainsHtml}`;
}

function cmmc2SetAnswer(id, val) {
  cmmc2State.answers[id] = val;
  renderMain();
}

function cmmc2TogglePanel(key) {
  cmmc2State.openPanels[key] = cmmc2State.openPanels[key] === false ? true : false;
  renderMain();
}

// ── POAM VIEW ─────────────────────────────────────────────────────────────────

function renderCMMC2Poam() {
  const run = cmmc2State.poamRun;
  if (!run) { cmmc2State.view = 'dashboard'; return renderCMMC2Dashboard(); }

  const answers  = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const poamItems = cmmc2State.poamItems || {};
  const gaps     = cmmc2GetGaps(answers);

  const assigned   = gaps.filter(g => poamItems[g.id]?.assigned_to).length;
  const dated      = gaps.filter(g => poamItems[g.id]?.target_date).length;
  const accepted   = gaps.filter(g => poamItems[g.id]?.risk_decision === 'Accept Risk').length;
  const remediated = gaps.filter(g => poamItems[g.id]?.status === 'Remediated').length;

  const stats = [
    { label: 'Total Gaps',  val: gaps.length,            col: 'var(--navy)' },
    { label: 'Unassigned',  val: gaps.length - assigned, col: '#dc2626' },
    { label: 'Assigned',    val: assigned,               col: '#b45309' },
    { label: 'Dates Set',   val: dated,                  col: '#1d4ed8' },
    { label: 'Accepted',    val: accepted,               col: '#7c3aed' },
    { label: 'Remediated',  val: remediated,             col: '#15803d' },
  ];

  const noGapsHtml = `<div class="card" style="text-align:center;padding:3rem 1rem">
    <div style="font-size:32px;margin-bottom:.75rem">🎉</div>
    <div style="font-size:14px;font-weight:700;margin-bottom:4px">No gaps found</div>
    <div style="font-size:12px;color:var(--muted)">All 110 CMMC Level 2 practices are answered Met or N/A.</div>
  </div>`;

  const inputSty = 'width:100%;padding:4px 6px;border-radius:5px;border:1px solid var(--border);font-family:Inter,sans-serif;font-size:11px;color:var(--text);background:#fff;box-sizing:border-box';

  let lastDomain = null;
  const groupHeaderFn = (gap, _last) => {
    if (gap.domain === lastDomain) return null;
    const meta = CMMC2_DOMAIN_META[gap.domain] || {};
    lastDomain = gap.domain;
    return {
      html: `<tr style="background:#f0f4fa;border-top:2px solid var(--navy)">
        <td colspan="9" style="padding:8px 12px">
          <span style="font-size:11px;font-weight:700;color:var(--navy)">${gap.domain}: ${escH(meta.label || '')}</span>
        </td>
      </tr>`,
      newGroup: gap.domain,
    };
  };

  const rowPrefixFn = (gap, _item) => {
    const meta   = CMMC2_DOMAIN_META[gap.domain] || {};
    const ans    = answers[gap.id] || '';
    const ansBadge = ans === 'no'
      ? '<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:#fee2e2;color:#dc2626">Not Met</span>'
      : '<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:#fef3c7;color:#b45309">Partial</span>';
    return `
      <td style="padding:8px 10px;font-weight:700;color:var(--navy);white-space:nowrap;vertical-align:top;font-size:11px">${escH(gap.id)}</td>
      <td style="padding:8px 6px;text-align:center;vertical-align:top">
        <span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:${meta.bg};color:${meta.color}">${gap.domain}</span>
      </td>
      <td style="padding:8px 6px;text-align:center;vertical-align:top">${ansBadge}</td>
      <td style="padding:8px 10px;font-size:11px;line-height:1.4;color:var(--text);vertical-align:top">
        <div style="font-weight:600;margin-bottom:2px">${escH(gap.title)}</div>
        <div style="color:var(--muted);font-size:10px">${escH(gap.desc)}</div>
      </td>`;
  };

  const tableHtml = acPoamTableHtml({
    gaps, items: poamItems, inputSty, noGapsHtml,
    colHeaders: [
      { label: 'ID',                    style: 'padding:8px 10px;text-align:left' },
      { label: 'Domain',                style: 'padding:8px 6px;text-align:center' },
      { label: 'Gap',                   style: 'padding:8px 6px;text-align:center' },
      { label: 'Practice Title & Desc', style: 'padding:8px 10px;text-align:left;min-width:240px' },
    ],
    rowPrefixFn,
    groupHeaderFn: gaps.length > 0 ? (gap, last) => groupHeaderFn(gap, last) : null,
  });

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📋 Plan of Action &amp; Milestones</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · CMMC L2 · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="cmmc2NavToDashboard()">← Back</button>
      <button class="btn btn-cyan btn-sm" id="cmmc2PoamSaveBtn" onclick="cmmc2SavePoam()">Save POAM</button>
    </div>
  </div>
  ${acStatsChipsHtml(stats)}
  ${tableHtml}`;
}

// ── EXEC REPORT ───────────────────────────────────────────────────────────────

function renderCMMC2Exec() {
  const run = cmmc2State.reportRun;
  if (!run) { cmmc2State.view = 'dashboard'; return renderCMMC2Dashboard(); }

  const answers    = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { score, yes, partial, no, na, total, scoreable, answered } = cmmc2CalcScore(answers);
  const { band, bandCol } = acScoreBand(score);
  const unanswered = total - (yes + partial + no + na);
  const fullImpl   = scoreable > 0 ? Math.round(yes / scoreable * 100) : 0;
  const fiCol      = fullImpl >= 75 ? '#15803d' : fullImpl >= 50 ? '#b45309' : '#dc2626';
  const domProg    = cmmc2DomainProgress(answers);
  const topGaps    = cmmc2GetGaps(answers).slice(0, 20);
  const runs       = (orgAssessments[currentOrg.id] || {})['cmmc2'] || [];
  const commentary = cmmc2State.reportCommentary || (run.answers || {})._exec_commentary || '';
  const sprs       = cmmc2SprsCalc(answers);
  const sprsCol    = sprs.sprs >= 88 ? '#15803d' : sprs.sprs >= 60 ? '#b45309' : '#dc2626';

  const base = total || 1;
  const yesPct  = (yes        / base * 100).toFixed(1);
  const partPct = (partial    / base * 100).toFixed(1);
  const noPct   = (no         / base * 100).toFixed(1);
  const naPct   = (na         / base * 100).toFixed(1);
  const unPct   = (unanswered / base * 100).toFixed(1);

  const scoreStripHtml = acExecScoreStripHtml({
    yes, partial, no, na, unanswered, scopedTotal: total,
    score, bandCol, fullImpl, fiCol, goalLabel: 'L2',
  });

  const scoreBreakdownHtml = acExecScoreBreakdownHtml({
    score, band, bandCol,
    yesPct, partPct, noPct, naPct, unPct,
    yesN: yes, partN: partial, noN: no, naN: na,
    fullImpl, fiCol, scoreable,
    scoreableLabel: 'scoreable practices',
    metLabel: 'Met', partLabel: 'Partial', noLabel: 'Not Met', naLabel: 'N/A',
  });

  const domCoverageHtml = `
  <div class="card" style="padding:1.1rem">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Domain Coverage</div>
    ${domProg.map(d => `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
          <span style="font-size:12px;font-weight:700;color:${d.color}">${d.key} <span style="font-size:10px;color:var(--muted);font-weight:400">— ${d.label}</span></span>
          <span style="font-size:13px;font-weight:800;color:${d.pct >= 75 ? '#15803d' : d.pct >= 50 ? '#b45309' : '#dc2626'};font-family:monospace">${d.pct}%</span>
        </div>
        <div style="height:8px;background:var(--bg);border-radius:4px;overflow:hidden;display:flex">
          <div style="width:${d.total > 0 ? (d.yes / d.total * 100).toFixed(1) : 0}%;background:${d.color}"></div>
          <div style="width:${d.total > 0 ? (d.partial / d.total * 100).toFixed(1) : 0}%;background:${d.color};opacity:.45"></div>
        </div>
        <div style="font-size:10px;color:var(--muted);margin-top:3px">${d.yes} met · ${d.partial} partial · ${d.no} not met${d.na ? ' · ' + d.na + ' N/A' : ''} · ${d.total} practices</div>
      </div>`).join('')}
    ${runs.length >= 2
      ? `<div style="margin-top:6px;padding-top:10px;border-top:1px solid var(--border)">
          <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">Score Trend</div>
          <canvas id="cmmc2ReportTrend" style="width:100%;display:block"></canvas>
         </div>`
      : ''}
  </div>`;

  const radarHtml = `
  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:6px">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--text)">🎯 Domain Radar — CMMC L2 (14 domains)</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">Score per domain · % of practices met or partial</div>
      </div>
    </div>
    <canvas id="cmmc2ReportRadar" width="600" height="380" style="width:100%;max-width:600px;display:block;margin:0 auto"></canvas>
  </div>`;

  const gapsHtml = topGaps.length ? `
  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Priority Gaps — Not Met or Partial (showing up to 20 of ${cmmc2GetGaps(answers).length})</div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <tbody>
        ${topGaps.map(g => {
          const meta = CMMC2_DOMAIN_META[g.domain] || {};
          const ans  = answers[g.id] || '';
          return `<tr style="border-bottom:1px solid var(--border)">
            <td style="padding:6px 10px;font-weight:700;color:${meta.color};white-space:nowrap;width:90px">${escH(g.id)}</td>
            <td style="padding:6px 6px;width:48px"><span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;background:${meta.bg};color:${meta.color}">${g.domain}</span></td>
            <td style="padding:6px 10px;color:var(--text)">${escH(g.title)}</td>
            <td style="padding:6px 8px;text-align:right"><span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;
              background:${ans === 'no' ? '#fee2e2' : '#fef3c7'};color:${ans === 'no' ? '#dc2626' : '#b45309'}">${ans === 'no' ? 'Not Met' : 'Partial'}</span></td>
            <td style="padding:6px 8px;text-align:right;font-size:10px;font-weight:700;color:#dc2626">−${ans === 'no' ? g.sprsWeight : Math.ceil(g.sprsWeight / 2)} SPRS</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>` : `
  <div class="card" style="padding:1.1rem;margin-bottom:1rem;text-align:center;color:#15803d">
    <div style="font-size:18px;margin-bottom:4px">✅</div>
    <div style="font-size:13px;font-weight:700">No gaps — all 110 Level 2 practices are Met or N/A</div>
  </div>`;

  const commentaryHtml = acExecCommentaryHtml({
    commentary,
    commentaryId: 'cmmc2ReportCommentary',
    copyFn: 'cmmc2CopyReportPrompt',
    saveFn: 'cmmc2SaveCommentary',
  });

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📊 CMMC L2 Executive Report</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="cmmc2NavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="cmmc2ExportReportWord()">📄 Export Word</button>
      <button class="btn btn-outline btn-sm" onclick="cmmc2OpenSprs(null)">🏛 SPRS →</button>
    </div>
  </div>
  ${scoreStripHtml}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
    ${scoreBreakdownHtml}
    ${domCoverageHtml}
  </div>
  ${radarHtml}
  ${gapsHtml}
  ${commentaryHtml}`;
}

// ── SPRS TAB ──────────────────────────────────────────────────────────────────

function renderCMMC2Sprs() {
  const run = cmmc2State.reportRun;
  if (!run) { cmmc2State.view = 'dashboard'; return renderCMMC2Dashboard(); }

  const answers  = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { yes, partial, no, na, total, scoreable, score } = cmmc2CalcScore(answers);
  const sprs     = cmmc2SprsCalc(answers);
  const sprsCol  = sprs.sprs >= 88 ? '#15803d' : sprs.sprs >= 60 ? '#b45309' : '#dc2626';
  const fullImpl = scoreable > 0 ? Math.round(yes / scoreable * 100) : 0;

  const domains = Object.keys(CMMC2_DOMAIN_META);

  const breakdownRows = CMMC2_PRACTICES.map(p => {
    const ans = answers[p.id] || '';
    const deduction = ans === 'no' ? p.sprsWeight : ans === 'partial' ? Math.ceil(p.sprsWeight / 2) : 0;
    const meta = CMMC2_DOMAIN_META[p.domain] || {};
    const statusColor = deduction === 0 ? '#15803d' : ans === 'partial' ? '#b45309' : '#dc2626';
    const statusLabel = deduction === 0
      ? (ans === 'na' ? 'N/A' : ans === 'yes' ? 'Met' : '—')
      : ans === 'partial' ? `Partial (−${deduction})` : `Not Met (−${deduction})`;
    return `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:6px 10px;font-size:10px;font-weight:700;color:${meta.color};white-space:nowrap">${escH(p.id)}</td>
      <td style="padding:6px 8px;font-size:11px">${escH(p.title)}</td>
      <td style="padding:6px 6px;text-align:center"><span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:6px;background:${meta.bg};color:${meta.color}">${p.domain}</span></td>
      <td style="padding:6px 8px;text-align:center;font-size:10px;font-weight:700;color:${statusColor}">${statusLabel}</td>
      <td style="padding:6px 8px;text-align:center;font-size:11px;font-weight:700;color:var(--text)">${p.sprsWeight}</td>
    </tr>`;
  }).join('');

  const attestChecklist = [
    'All 110 NIST SP 800-171 practices have been reviewed and assessed',
    'Assessment was conducted by a knowledgeable representative with system knowledge',
    'Assessment results are documented and retained for 3 years',
    'A senior company official (CEO, CISO, or authorized delegate) will attest',
    'Self-attestation will be submitted in the SPRS portal at https://www.sprs.csd.disa.mil/',
    'SPRS submission includes: company name, CAGE code, assessment date, and score',
    'Assessment will be renewed annually or when significant system changes occur',
    'A System Security Plan (SSP) exists or is in development covering all CUI systems',
    'A Plan of Action & Milestones (POAM) exists for any practices not fully met',
  ];

  return `
  ${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">🏛 SPRS Score — CMMC L2 / NIST SP 800-171</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · ${run.date || '—'} · Supplier Performance Risk System</div>
    </div>
    <div style="display:flex;gap:6px">
      <button class="btn btn-outline btn-sm" onclick="cmmc2NavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="cmmc2OpenReport(null)">📊 Report</button>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
    <div class="card" style="padding:1.1rem;text-align:center;border-top:4px solid ${sprsCol}">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:6px">SPRS Score</div>
      <div style="font-size:40px;font-weight:800;color:${sprsCol};font-family:monospace;line-height:1">${sprs.sprs}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">Max: 110 · Range: −203 to 110</div>
      <div style="margin-top:8px;height:6px;background:var(--bg);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${Math.max(0, Math.round((sprs.sprs + 203) / 313 * 100))}%;background:${sprsCol};border-radius:3px;transition:width .4s"></div>
      </div>
    </div>
    <div class="card" style="padding:1.1rem;text-align:center;border-top:4px solid #dc2626">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:6px">Total Deductions</div>
      <div style="font-size:40px;font-weight:800;color:#dc2626;font-family:monospace;line-height:1">−${sprs.deductions}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">${no} Not Met · ${partial} Partial</div>
    </div>
    <div class="card" style="padding:1.1rem;text-align:center;border-top:4px solid #4f46e5">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:6px">Practices Met</div>
      <div style="font-size:40px;font-weight:800;color:#4f46e5;font-family:monospace;line-height:1">${yes}<span style="font-size:18px">/${scoreable}</span></div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">${fullImpl}% fully implemented</div>
    </div>
  </div>

  <div class="card" style="padding:1rem;margin-bottom:1rem;border-left:4px solid #0369a1;background:#e0f2fe">
    <div style="font-size:12px;font-weight:700;color:#0369a1;margin-bottom:4px">ℹ️ About Your SPRS Score</div>
    <div style="font-size:11px;color:var(--text);line-height:1.65">
      This is your <strong>full NIST SP 800-171 SPRS score</strong> based on all 110 practices. The formula is <strong>110 − deductions</strong>: Not Met practices deduct their full point weight; Partial practices deduct ⌈weight/2⌉. The theoretical minimum is −203 (all practices Not Met). The DoD target for contractors handling CUI is a score trending toward 110. Annual self-attestation must be submitted at <strong>sprs.csd.disa.mil</strong>.
    </div>
  </div>

  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Practice Breakdown — SPRS Deductions</div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:12px;min-width:700px">
        <thead><tr style="background:var(--navy);color:#fff">
          <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700">Practice</th>
          <th style="padding:7px 8px;text-align:left;font-size:10px;font-weight:700">Title</th>
          <th style="padding:7px 8px;text-align:center;font-size:10px;font-weight:700">Domain</th>
          <th style="padding:7px 8px;text-align:center;font-size:10px;font-weight:700">Status / Deduction</th>
          <th style="padding:7px 8px;text-align:center;font-size:10px;font-weight:700">Pt Weight</th>
        </tr></thead>
        <tbody>${breakdownRows}</tbody>
        <tfoot><tr style="background:#f0f4fa;border-top:2px solid var(--navy)">
          <td colspan="3" style="padding:8px 10px;font-size:12px;font-weight:700">SPRS Score (110 − ${sprs.deductions})</td>
          <td colspan="2" style="padding:8px 10px;text-align:center;font-size:16px;font-weight:800;color:${sprsCol}">${sprs.sprs} / 110</td>
        </tfoot>
      </table>
    </div>
  </div>

  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="font-size:13px;font-weight:700;margin-bottom:10px">✅ Self-Attestation Checklist</div>
    ${attestChecklist.map((item, i) => `
      <div style="display:flex;align-items:flex-start;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)">
        <input type="checkbox" id="cmmc2_sprs_chk_${i}" style="margin-top:2px;flex-shrink:0">
        <label for="cmmc2_sprs_chk_${i}" style="font-size:12px;color:var(--text);cursor:pointer">${escH(item)}</label>
      </div>`).join('')}
    <div style="margin-top:12px;padding:10px;background:var(--bg);border-radius:6px;font-size:11px;color:var(--muted)">
      Submit your CMMC Level 2 self-attestation at <strong>sprs.csd.disa.mil</strong> using your company CAGE code. The affirming official must be a senior company representative with authority to attest on behalf of the organization. Note: some DoD programs require a third-party C3PAO assessment instead of self-attestation — confirm with your contracting officer.
    </div>
  </div>`;
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────

function cmmc2StartNew() {
  cmmc2State.answers     = {};
  cmmc2State.conductedBy = '';
  cmmc2State.date        = '';
  cmmc2State.editId      = null;
  cmmc2State.openPanels  = {};
  cmmc2State.view        = 'form';
  renderMain();
}

function cmmc2OpenAssessment(idx) {
  const runs = (orgAssessments[currentOrg.id] || {})['cmmc2'] || [];
  const run  = runs[idx];
  if (!run) return;
  const ans  = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  cmmc2State.answers     = Object.assign({}, ans);
  cmmc2State.conductedBy = run.conductedBy || '';
  cmmc2State.date        = run.date || '';
  cmmc2State.editId      = run.id;
  cmmc2State.view        = 'form';
  renderMain();
}

function cmmc2OpenPoam(idx) {
  const runs = (orgAssessments[currentOrg.id] || {})['cmmc2'] || [];
  const run  = idx != null ? runs[idx] : cmmc2State.reportRun;
  if (!run) return;
  const savedPoam = run.answers?._poam || {};
  cmmc2State.poamRun   = run;
  cmmc2State.poamItems = JSON.parse(JSON.stringify(savedPoam));
  cmmc2State.view      = 'poam';
  renderMain();
}

function cmmc2OpenReport(idx) {
  const runs = (orgAssessments[currentOrg.id] || {})['cmmc2'] || [];
  const run  = idx != null ? runs[idx] : cmmc2State.reportRun;
  if (!run) return;
  cmmc2State.reportRun = run;
  cmmc2State.view      = 'report';
  renderMain();
}

function cmmc2OpenSprs(idx) {
  const runs = (orgAssessments[currentOrg.id] || {})['cmmc2'] || [];
  const run  = idx != null ? runs[idx] : cmmc2State.reportRun;
  if (!run) return;
  cmmc2State.reportRun = run;
  cmmc2State.view      = 'sprs';
  renderMain();
}

function cmmc2NavToDashboard() {
  cmmc2State.view = 'dashboard';
  renderMain();
}

async function cmmc2SaveAssessment() {
  const btn = document.getElementById('cmmc2SaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  const conductedBy = (document.getElementById('cmmc2ConductedBy')?.value || cmmc2State.conductedBy || '').trim();
  const date        = (document.getElementById('cmmc2Date')?.value || cmmc2State.date || '').trim()
                    || new Date().toISOString().split('T')[0];
  const { score }   = cmmc2CalcScore(cmmc2State.answers);

  const answersToSave = { ...cmmc2State.answers, _conducted_by: conductedBy, _date: date };

  try {
    if (cmmc2State.editId) {
      await sb.updateAssessment(cmmc2State.editId, { score, answers: answersToSave, assessed_at: date, conducted_by: conductedBy });
      const runs = (orgAssessments[currentOrg.id] || {})['cmmc2'] || [];
      const idx  = runs.findIndex(r => r.id === cmmc2State.editId);
      if (idx >= 0) {
        runs[idx] = { ...runs[idx], score, answers: answersToSave, date, conductedBy };
      }
    } else {
      const saved = await sb.saveAssessment({
        org_id: currentOrg.id, module: 'cmmc2', score,
        answers: answersToSave, assessed_at: date, conducted_by: conductedBy,
      });
      const record = Array.isArray(saved) ? saved[0] : saved;
      if (!orgAssessments[currentOrg.id]) orgAssessments[currentOrg.id] = {};
      if (!orgAssessments[currentOrg.id]['cmmc2']) orgAssessments[currentOrg.id]['cmmc2'] = [];
      orgAssessments[currentOrg.id]['cmmc2'].push({
        id: record?.id, score, answers: answersToSave, date, conductedBy,
      });
    }
    toast('Assessment saved', '#15803d');
    cmmc2State.editId = null;
    cmmc2State.view   = 'dashboard';
  } catch (e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = '💾 Save Assessment'; }
    return;
  }
  renderMain();
}

async function cmmc2DeleteAssessment(idx) {
  const runs = (orgAssessments[currentOrg.id] || {})['cmmc2'] || [];
  const run  = runs[idx];
  if (!run) return;
  if (!confirm(`Delete the CMMC L2 assessment from ${run.date || '(no date)'}? This cannot be undone.`)) return;
  try {
    await sb.deleteAssessment(run.id);
    orgAssessments[currentOrg.id]['cmmc2'].splice(idx, 1);
    toast('Assessment deleted', '#15803d');
    renderMain();
  } catch (e) {
    toast('Delete failed: ' + e.message, '#dc2626');
  }
}

async function cmmc2SavePoam() {
  const run = cmmc2State.poamRun;
  if (!run) return;
  const btn = document.getElementById('cmmc2PoamSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  const poamData = {};
  document.querySelectorAll('.poam-assigned').forEach(el => {
    const id = el.dataset.id; if (!id) return;
    if (!poamData[id]) poamData[id] = {};
    poamData[id].assigned_to = el.value.trim();
  });
  document.querySelectorAll('.poam-date').forEach(el => {
    const id = el.dataset.id; if (!id) return;
    if (!poamData[id]) poamData[id] = {};
    poamData[id].target_date = el.value;
  });
  document.querySelectorAll('.poam-decision').forEach(el => {
    const id = el.dataset.id; if (!id) return;
    if (!poamData[id]) poamData[id] = {};
    poamData[id].risk_decision = el.value;
  });
  document.querySelectorAll('.poam-rationale').forEach(el => {
    const id = el.dataset.id; if (!id) return;
    if (!poamData[id]) poamData[id] = {};
    poamData[id].notes = el.value.trim();
  });
  document.querySelectorAll('.poam-status').forEach(el => {
    const id = el.dataset.id; if (!id) return;
    if (!poamData[id]) poamData[id] = {};
    poamData[id].status = el.value;
  });

  const updatedAnswers = { ...(run.answers || {}), _poam: poamData };
  try {
    await sb.updateAssessment(run.id, { answers: updatedAnswers });
    run.answers = updatedAnswers;
    cmmc2State.poamItems = poamData;
    toast('POAM saved', '#15803d');
  } catch (e) {
    toast('POAM save failed: ' + e.message, '#dc2626');
  }
  if (btn) { btn.disabled = false; btn.textContent = 'Save POAM'; }
}

function cmmc2CopyReportPrompt() {
  const run = cmmc2State.reportRun;
  if (!run) return;
  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { score, yes, partial, no, na, total, scoreable } = cmmc2CalcScore(answers);
  const { band } = acScoreBand(score);
  const gaps = cmmc2GetGaps(answers);
  const sprs = cmmc2SprsCalc(answers);

  const domainSummary = Object.entries(CMMC2_DOMAIN_META).map(([key, meta]) => {
    const practices = CMMC2_PRACTICES.filter(p => p.domain === key);
    const dYes = practices.filter(p => answers[p.id] === 'yes').length;
    const dNA  = practices.filter(p => answers[p.id] === 'na').length;
    const dSco = practices.length - dNA;
    const dPct = dSco > 0 ? Math.round(dYes / dSco * 100) : 100;
    return `${key} (${meta.label}): ${dPct}% — ${dYes}/${practices.length} met`;
  }).join('\n');

  const gapList = gaps.slice(0, 30).map(g =>
    `- ${g.id} [${g.domain}]: ${g.title} — ${answers[g.id] === 'partial' ? 'Partial' : 'Not Met'} (−${answers[g.id] === 'no' ? g.sprsWeight : Math.ceil(g.sprsWeight / 2)} SPRS pts)`
  ).join('\n');

  const prompt = `You are a cybersecurity consultant writing the EXECUTIVE COMMENTARY section of a client report. The report already contains score tables, domain charts, gap tables, and a full 110-practice listing generated from assessment data — you only need to write the narrative text that goes in the Executive Summary section.

IMPORTANT OUTPUT RULES:
- Output ONLY the three sections below, nothing else
- No title, no score summary table, no domain analysis section, no SPRS submission guidance, no next steps, no disclaimer
- Plain text only — no markdown, no asterisks, no pound signs, no bold markers
- Use exactly these section headings in ALL-CAPS on their own line
- Bullet points: start each with a hyphen and space "- "
- Numbered items: start each with "1." "2." etc. Do NOT write a number prefix AND a separate label

CLIENT: ${currentOrg.name}
FRAMEWORK: CMMC Level 2 / NIST SP 800-171 Rev 2 (110 practices, 14 domains)
DATE: ${run.date || '—'} | ASSESSOR: ${run.conductedBy || '—'}
MATURITY SCORE: ${score}% (${band}) | SPRS SCORE: ${sprs.sprs} / 110 (deductions: −${sprs.deductions})
MET: ${yes} | PARTIAL: ${partial} | NOT MET: ${no} | N/A: ${na}

DOMAIN SCORES (14 domains):
${domainSummary}

TOP GAPS BY SPRS IMPACT (${gaps.length} total — showing highest deduction first):
${gapList}
${gaps.length > 30 ? `... and ${gaps.length - 30} additional gaps not shown` : ''}

OUTPUT — write exactly these three sections:

EXECUTIVE SUMMARY
Write 4-6 sentences. State the assessment scope (CMMC L2, 110 NIST SP 800-171 Rev 2 practices, 14 domains). State the SPRS score and what it means. Name the 2 strongest and 2 weakest domains. Note the total number of gaps and overall risk posture.

KEY FINDINGS
5-7 bullet points. Each on its own line starting with "- ". Cover: highest-performing domains, domains with most gaps or worst SPRS deductions, any critical Not Met practices by name, and the overall SPRS interpretation. Be specific.

PRIORITY RECOMMENDATIONS
Top 7 numbered actions to improve SPRS fastest. Each on its own line starting with "1." through "7.". One sentence per item: what to do and the SPRS point impact. Order by deduction weight — highest deduction Not Met practices first.`;

  navigator.clipboard.writeText(prompt).then(() => {
    toast('Report prompt copied to clipboard', '#15803d');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = prompt;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    toast('Report prompt copied', '#15803d');
  });
}

async function cmmc2SaveCommentary() {
  const run = cmmc2State.reportRun;
  if (!run) return;
  const commentary = document.getElementById('cmmc2ReportCommentary')?.value || '';
  cmmc2State.reportCommentary = commentary;
  try {
    const updated = { ...(run.answers || {}), _exec_commentary: commentary };
    await sb.updateAssessment(run.id, { answers: updated });
    run.answers = updated;
    toast('Commentary saved', '#15803d');
  } catch (e) {
    toast('Save failed: ' + e.message, '#dc2626');
  }
}

// ── 14-POINT RADAR ────────────────────────────────────────────────────────────

function drawCmmc2Radar(canvasId, answers) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const W = canvas.offsetWidth || 600;
  const H = 380;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2, cy = H / 2, R = Math.min(cx, cy) - 55;
  const domains    = Object.keys(CMMC2_DOMAIN_META);
  const n          = domains.length; // 14
  const angleStep  = (Math.PI * 2) / n;
  const startAngle = -Math.PI / 2;

  const scores = domains.map(key => {
    const practices = CMMC2_PRACTICES.filter(p => p.domain === key);
    const yes  = practices.filter(p => answers[p.id] === 'yes').length;
    const part = practices.filter(p => answers[p.id] === 'partial').length;
    const na   = practices.filter(p => answers[p.id] === 'na').length;
    const sc   = practices.length - na;
    return sc > 0 ? (yes + part * 0.5) / sc : 0;
  });

  // Grid rings
  [0.2, 0.4, 0.6, 0.8, 1.0].forEach(level => {
    ctx.beginPath();
    domains.forEach((_, i) => {
      const angle = startAngle + i * angleStep;
      const x = cx + R * level * Math.cos(angle);
      const y = cy + R * level * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = '#e8edf5';
    ctx.lineWidth = 1;
    ctx.stroke();
    if (level < 1.0) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '8px Inter,Arial,sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(level * 100)}%`, cx + R * level + 3, cy);
    }
  });

  // Spokes
  domains.forEach((_, i) => {
    const angle = startAngle + i * angleStep;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
    ctx.strokeStyle = '#e8edf5';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Filled polygon
  ctx.beginPath();
  domains.forEach((_, i) => {
    const angle = startAngle + i * angleStep;
    const x = cx + R * scores[i] * Math.cos(angle);
    const y = cy + R * scores[i] * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(79,70,229,0.12)';
  ctx.fill();
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots + labels
  ctx.textBaseline = 'alphabetic';
  domains.forEach((key, i) => {
    const angle = startAngle + i * angleStep;
    const val   = scores[i];
    const meta  = CMMC2_DOMAIN_META[key];

    // Data dot
    const dx = cx + R * val * Math.cos(angle);
    const dy = cy + R * val * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = meta.color;
    ctx.fill();

    // Axis label
    const labelR = R + 30;
    const lx = cx + labelR * Math.cos(angle);
    const ly = cy + labelR * Math.sin(angle);
    ctx.font = 'bold 11px Inter,Arial,sans-serif';
    ctx.fillStyle = meta.color;
    ctx.textAlign    = lx < cx - 5 ? 'right' : lx > cx + 5 ? 'left' : 'center';
    ctx.textBaseline = ly < cy - 5 ? 'bottom' : ly > cy + 5 ? 'top' : 'middle';
    ctx.fillText(key, lx, ly);

    // Score sub-label
    ctx.font = '9px Inter,Arial,sans-serif';
    ctx.fillStyle = '#94a3b8';
    const sOffY = ly < cy - 5 ? -13 : 13;
    const prevBase = ctx.textBaseline;
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(val * 100)}%`, lx, ly + sOffY);
    ctx.textBaseline = prevBase;
  });
}

// ── REPORT CHART ORCHESTRATION ────────────────────────────────────────────────

function drawCmmc2ReportCharts() {
  const run = cmmc2State.reportRun;
  if (!run || cmmc2State.view !== 'report') return;
  const answers = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const runs    = (orgAssessments[currentOrg?.id] || {})['cmmc2'] || [];
  if (document.getElementById('cmmc2ReportTrend') && runs.length >= 2) {
    acTrendDraw('cmmc2ReportTrend', runs, '#4f46e5');
  }
  drawCmmc2Radar('cmmc2ReportRadar', answers);
}

// ── WORD EXPORT ───────────────────────────────────────────────────────────────

function cmmc2ExportReportWord() {
  const run = cmmc2State.reportRun;
  if (!run) return;

  const answers    = Object.fromEntries(Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_')));
  const { score, yes, partial, no, na, total, scoreable } = cmmc2CalcScore(answers);
  const { band, bandCol } = acScoreBand(score);
  const fullImpl   = scoreable > 0 ? Math.round(yes / scoreable * 100) : 0;
  const fiCol      = fullImpl >= 75 ? '#15803d' : fullImpl >= 50 ? '#b45309' : '#dc2626';
  const sprs       = cmmc2SprsCalc(answers);
  const sprsCol    = sprs.sprs >= 88 ? '#15803d' : sprs.sprs >= 60 ? '#b45309' : '#dc2626';
  const gaps       = cmmc2GetGaps(answers);
  const domProg    = cmmc2DomainProgress(answers);
  const rawCommentary = cmmc2State.reportCommentary || (run.answers || {})._exec_commentary || '';
  const exportDate = new Date().toLocaleDateString('en-CA');

  const runs   = (orgAssessments[currentOrg?.id] || {})['cmmc2'] || [];
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const prevRun     = sorted.length >= 2 ? sorted[sorted.length - 2] : null;
  const scoreChange = prevRun ? score - prevRun.score : null;
  const changeStr   = scoreChange === null ? 'First assessment' : (scoreChange > 0 ? '+' + scoreChange + '%' : scoreChange + '%');
  const prevSprs    = prevRun ? cmmc2SprsCalc(Object.fromEntries(Object.entries(prevRun.answers || {}).filter(([k]) => !k.startsWith('_')))).sprs : null;
  const sprsChange  = prevSprs !== null ? sprs.sprs - prevSprs : null;
  const sprsChangeStr = sprsChange === null ? '—' : (sprsChange > 0 ? '+' + sprsChange : String(sprsChange));

  // ── Commentary formatter — KEY FINDINGS (bullets), PRIORITY RECOMMENDATIONS (numbered),
  //    ALL-CAPS subheaders, prose bullets, numbered prose items ──────────────────────────
  function fmtCommentary(text, placeholder) {
    if (!text) return placeholder
      ? `<p style="color:#94a3b8;font-style:italic;font-size:10pt;margin:0 0 10pt 0">${placeholder}</p>`
      : '';

    const BULLET_TBL = items => '<table style="width:100%;border-collapse:collapse;margin:0 0 10pt 0">' +
      items.map(l => `<tr>
        <td style="width:14pt;vertical-align:top;padding:4pt 8pt 4pt 0;color:#152168;font-size:14pt;line-height:1">&#8226;</td>
        <td style="font-size:11pt;line-height:1.65;padding:4pt 0;vertical-align:top;border-bottom:1pt solid #f1f5f9">${escH(l)}</td>
      </tr>`).join('') + '</table>';

    const NUM_TBL = items => '<table style="width:100%;border-collapse:collapse;margin:0 0 10pt 0">' +
      items.map((l, i) => `<tr>
        <td style="background:#152168;color:#fff;width:24pt;text-align:center;font-size:11pt;font-weight:bold;vertical-align:top;padding:7pt 4pt;border-bottom:1pt solid #1e3080">${i + 1}</td>
        <td style="padding:7pt 10pt;border-bottom:1pt solid #e8ecf4;font-size:11pt;line-height:1.65;vertical-align:top">${escH(l)}</td>
      </tr>`).join('') + '</table>';

    const SUBHEAD = label => `<div style="font-size:9.5pt;color:#152168;font-weight:bold;text-transform:uppercase;letter-spacing:.5pt;margin:14pt 0 5pt 0;padding-bottom:3pt;border-bottom:1.5pt solid #152168">${label}</div>`;

    let html = '';
    let mode = 'prose'; // prose | findings | recommendations | bullets | numbered
    let items = [];

    function flushItems() {
      if (!items.length) return;
      if (mode === 'findings' || mode === 'bullets') html += BULLET_TBL(items);
      else if (mode === 'recommendations' || mode === 'numbered') html += NUM_TBL(items);
      items = [];
    }

    text.split('\n').map(l => l.trim()).forEach(line => {
      if (!line) {
        flushItems();
        mode = 'prose';
        return;
      }
      if (/^KEY FINDINGS$/i.test(line)) { flushItems(); html += SUBHEAD('Key Findings'); mode = 'findings'; return; }
      if (/^PRIORITY RECOMMENDATIONS?$/i.test(line)) { flushItems(); html += SUBHEAD('Priority Recommendations'); mode = 'recommendations'; return; }
      if (/^EXECUTIVE SUMMARY$/i.test(line)) { flushItems(); html += SUBHEAD('Executive Summary'); mode = 'prose'; return; }
      // Any other ALL-CAPS-only line → styled subheader
      if (/^[A-Z][A-Z\s\(\)\-\/&0-9\.]+$/.test(line) && line.length > 3 && !/^\d/.test(line)) {
        flushItems();
        html += SUBHEAD(line.charAt(0) + line.slice(1).toLowerCase());
        mode = 'prose'; return;
      }
      if (mode === 'findings' || mode === 'bullets') {
        items.push(line.replace(/^[•\-\*]\s*/, ''));
        return;
      }
      if (mode === 'recommendations' || mode === 'numbered') {
        items.push(line.replace(/^[•\-\*]\s*/, '').replace(/^\d+[\.\)]\s*/, ''));
        return;
      }
      // Prose: detect bullet lines
      if (/^[•\-\*]\s/.test(line)) {
        if (mode !== 'bullets') { flushItems(); mode = 'bullets'; }
        items.push(line.replace(/^[•\-\*]\s*/, ''));
        return;
      }
      // Prose: detect numbered lines "1. text"
      if (/^\d+[\.\)]\s/.test(line)) {
        if (mode !== 'numbered') { flushItems(); mode = 'numbered'; }
        items.push(line.replace(/^\d+[\.\)]\s*/, ''));
        return;
      }
      flushItems();
      mode = 'prose';
      html += `<p style="font-size:11pt;line-height:1.75;margin:0 0 8pt 0">${escH(line)}</p>`;
    });
    flushItems();
    return html;
  }

  // ── Gauge canvas → PNG ────────────────────────────────────────────────────
  let gaugeImg = null;
  {
    const _gc = document.createElement('canvas');
    _gc.width = 280; _gc.height = 155;
    _gc.style.cssText = 'position:fixed;left:-9999px;pointer-events:none';
    document.body.appendChild(_gc);
    const _ctx = _gc.getContext('2d');
    const cx = 140, cy = 130, r = 105, tw = 18;
    const t = Math.max(0.02, Math.min(0.98, score / 100));
    _ctx.beginPath(); _ctx.arc(cx, cy, r, Math.PI, 0, false);
    _ctx.strokeStyle = '#e8edf5'; _ctx.lineWidth = tw; _ctx.lineCap = 'butt'; _ctx.stroke();
    const _g = _ctx.createLinearGradient(cx - r, 0, cx + r, 0);
    _g.addColorStop(0, '#dc2626'); _g.addColorStop(0.30, '#f97316');
    _g.addColorStop(0.55, '#f59e0b'); _g.addColorStop(0.75, '#84cc16'); _g.addColorStop(1.00, '#15803d');
    _ctx.beginPath(); _ctx.arc(cx, cy, r, Math.PI, 0, false);
    _ctx.strokeStyle = _g; _ctx.lineWidth = tw; _ctx.lineCap = 'butt'; _ctx.stroke();
    const nx = cx + r * 0.84 * Math.cos(Math.PI + t * Math.PI);
    const ny = cy + r * 0.84 * Math.sin(Math.PI + t * Math.PI);
    _ctx.beginPath(); _ctx.moveTo(cx, cy); _ctx.lineTo(nx, ny);
    _ctx.strokeStyle = '#152168'; _ctx.lineWidth = 3.5; _ctx.lineCap = 'round'; _ctx.stroke();
    _ctx.beginPath(); _ctx.arc(cx, cy, 9, 0, Math.PI * 2); _ctx.fillStyle = '#152168'; _ctx.fill();
    _ctx.beginPath(); _ctx.arc(cx, cy, 5, 0, Math.PI * 2); _ctx.fillStyle = '#fff'; _ctx.fill();
    _ctx.textAlign = 'center';
    _ctx.font = 'bold 34px Arial,sans-serif'; _ctx.fillStyle = '#152168';
    _ctx.fillText(`${score}%`, cx, 82);
    _ctx.font = 'bold 12px Arial,sans-serif'; _ctx.fillStyle = bandCol;
    _ctx.fillText(band, cx, 100);
    _ctx.font = '9px Arial,sans-serif'; _ctx.fillStyle = '#94a3b8';
    _ctx.textAlign = 'left';  _ctx.fillText('Low',  cx - r + 2, 150);
    _ctx.textAlign = 'right'; _ctx.fillText('High', cx + r - 2, 150);
    gaugeImg = _gc.toDataURL('image/png');
    document.body.removeChild(_gc);
  }

  // ── Radar canvas → PNG ────────────────────────────────────────────────────
  let radarImg = null;
  {
    const _rc = document.createElement('canvas');
    _rc.id = '_cmmc2RadExp';
    _rc.width = 360; _rc.height = 360;
    _rc.style.cssText = 'position:fixed;left:-9999px;width:360px;height:360px;pointer-events:none';
    document.body.appendChild(_rc);
    drawCmmc2Radar('_cmmc2RadExp', answers);
    radarImg = _rc.toDataURL('image/png');
    document.body.removeChild(_rc);
  }

  // ── Trend canvas → PNG (only if 2+ runs) ─────────────────────────────────
  let trendImg = null;
  if (sorted.length >= 2) {
    const _tc = document.createElement('canvas');
    _tc.id = '_cmmc2TrExp';
    _tc.width = 560; _tc.height = 110;
    _tc.style.cssText = 'position:fixed;left:-9999px;pointer-events:none';
    document.body.appendChild(_tc);
    acTrendDraw('_cmmc2TrExp', sorted, '#1d4ed8');
    trendImg = _tc.toDataURL('image/png');
    document.body.removeChild(_tc);
  }

  // ── Domain rows ────────────────────────────────────────────────────────────
  const domRows = domProg.map(d =>
    `<tr>
      <td style="font-weight:bold;color:${d.color};white-space:nowrap;font-size:9pt">${d.key}</td>
      <td>${escH(d.label)}</td>
      <td style="text-align:center;color:#5a6a8a">${d.total}</td>
      <td style="text-align:center;font-weight:bold;color:#15803d">${d.yes}</td>
      <td style="text-align:center;font-weight:bold;color:#b45309">${d.partial}</td>
      <td style="text-align:center;font-weight:bold;color:${d.no > 0 ? '#dc2626' : '#15803d'}">${d.no}</td>
      <td style="text-align:center;color:#94a3b8">${d.na}</td>
      <td style="text-align:center;font-weight:bold;color:${d.pct>=75?'#15803d':d.pct>=50?'#b45309':'#dc2626'}">${d.pct}%</td>
    </tr>`
  ).join('');

  // ── Gap rows (top 15 by SPRS deduction impact) ────────────────────────────
  const topGaps = gaps.slice(0, 15);
  const gapRows = topGaps.map(g => {
    const ans  = answers[g.id] || '';
    const meta = CMMC2_DOMAIN_META[g.domain] || {};
    const ded  = ans === 'no' ? g.sprsWeight : Math.ceil(g.sprsWeight / 2);
    return `<tr>
      <td style="font-weight:bold;color:${meta.color};white-space:nowrap;font-size:9pt">${escH(g.id)}</td>
      <td><span style="font-size:9pt;font-weight:bold;padding:1pt 5pt;border-radius:7pt;background:${meta.bg};color:${meta.color}">${g.domain}</span></td>
      <td>${escH(g.title)}</td>
      <td style="font-weight:bold;color:${ans==='no'?'#dc2626':'#b45309'};white-space:nowrap">${ans === 'no' ? 'Not Met' : 'Partial'}</td>
      <td style="font-weight:bold;color:#dc2626;text-align:center">&#8722;${ded}</td>
    </tr>`;
  }).join('');

  // ── Full practice listing (all 110, grouped by domain) ────────────────────
  const _aL2 = { yes: 'Met', partial: 'Partial', no: 'Not Met', na: 'N/A' };
  const _aC2 = { yes: '#15803d', partial: '#b45309', no: '#dc2626', na: '#94a3b8' };
  const byDom2 = {};
  CMMC2_PRACTICES.forEach(p => { if (!byDom2[p.domain]) byDom2[p.domain] = []; byDom2[p.domain].push(p); });
  const practiceListHtml = Object.keys(byDom2).map(dom => {
    const meta = CMMC2_DOMAIN_META[dom] || {};
    const rows = byDom2[dom].map(p => {
      const ans = answers[p.id] || '';
      const ded = ans === 'no' ? p.sprsWeight : ans === 'partial' ? Math.ceil(p.sprsWeight / 2) : 0;
      return `<tr>
        <td style="font-weight:bold;color:${meta.color};white-space:nowrap;font-size:9pt">${escH(p.id)}</td>
        <td style="font-weight:bold;color:${_aC2[ans]||'#94a3b8'};text-align:center;white-space:nowrap;font-size:9pt">${_aL2[ans]||'—'}</td>
        <td style="text-align:center;font-size:9pt;color:${ded>0?'#dc2626':'#94a3b8'}">${ded > 0 ? '&#8722;' + ded : '—'}</td>
        <td><strong style="font-size:9.5pt">${escH(p.title)}</strong><br><span style="font-size:8pt;color:#5a6a8a">${escH(p.desc || '')}</span></td>
      </tr>`;
    }).join('');
    return `<tr><td colspan="4" style="background:#152168;color:#fff;font-weight:bold;font-size:9.5pt;padding:5pt 8pt;border:none">${dom} — ${escH(meta.label || dom)}</td></tr>${rows}`;
  }).join('');

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8">
<title>CMMC Level 2 — Executive Report — ${escH(currentOrg.name)}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11pt; color: #1a2340; margin: 0; padding: 0; }
  .page { padding: 2.5cm; max-width: 19cm; margin: 0 auto; }
  h1 { font-size: 20pt; color: #152168; margin: 0 0 4pt 0; font-weight: bold; }
  h2 { font-size: 11pt; color: #152168; margin: 20pt 0 6pt 0; font-weight: bold;
       border-bottom: 1.5pt solid #152168; padding-bottom: 3pt;
       text-transform: uppercase; letter-spacing: .5pt; }
  .sub { font-size: 10pt; color: #5a6a8a; margin: 0 0 20pt 0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10pt; font-size: 10pt; }
  th { background: #152168; color: #fff; text-align: left; padding: 5pt 8pt;
       font-size: 9pt; text-transform: uppercase; letter-spacing: .4pt; }
  td { padding: 5pt 8pt; border-bottom: 1pt solid #e8ecf4; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .footer { margin-top: 28pt; padding-top: 8pt; border-top: 1pt solid #dde3ef; font-size: 8pt; color: #94a3b8; }
</style>
</head>
<body>
<div class="page">

  <h1>CMMC Level 2 — Executive Security Report</h1>
  <div class="sub">
    ${escH(currentOrg.name)} &nbsp;&middot;&nbsp; CMMC Level 2 / NIST SP 800-171 Rev 2 (110 Practices) &nbsp;&middot;&nbsp; ${run.date || '&mdash;'}
    ${run.conductedBy ? ' &nbsp;&middot;&nbsp; Assessed by: ' + escH(run.conductedBy) : ''}
  </div>

  <h2>Executive Summary</h2>
  ${fmtCommentary(rawCommentary, 'No executive commentary saved. Use the Generate AI Prompt button in the exec report view, paste the prompt into Claude, then save the response before exporting.')}

  <h2>Overall Security Score</h2>
  <div style="display:flex;gap:24pt;margin-bottom:12pt;align-items:flex-start">
    <div style="flex-shrink:0;text-align:center">${gaugeImg ? `<img src="${gaugeImg}" style="width:240px;display:block">` : ''}</div>
    <div style="flex:1">
      <table style="margin:0;font-size:10pt">
        ${[
          ['Practices in scope',        '110 (NIST SP 800-171 Rev 2)',                              '#1a2340'],
          ['Met (Yes)',                  yes + ' (' + Math.round(yes / total * 100) + '%)',          '#15803d'],
          ['Partial',                    partial + ' (' + Math.round(partial / total * 100) + '%)',  '#b45309'],
          ['Not Met',                    no + ' (' + Math.round(no / total * 100) + '%)',            no > 0 ? '#dc2626' : '#15803d'],
          ['N/A',                        na,                                                          '#94a3b8'],
          ['Maturity Score',             score + '% — ' + band,                                      bandCol],
          ['Fully Implemented',          fullImpl + '%',                                              fiCol],
          ['SPRS Score',                 sprs.sprs + ' / 110',                                       sprsCol],
          ['SPRS Deductions',            '&#8722;' + sprs.deductions + ' pts',                       sprs.deductions > 0 ? '#dc2626' : '#15803d'],
          ['vs Prior assessment',        changeStr + (sprsChange !== null ? ' | SPRS ' + sprsChangeStr : ''), '#1a2340'],
          ['Date',                       run.date || '—',                                             '#5a6a8a'],
          ['Assessor',                   run.conductedBy || '—',                                      '#5a6a8a'],
        ].map(([l, v, c]) => `<tr>
          <td style="padding:4pt 8pt 4pt 0;border:none;color:#5a6a8a;font-size:9.5pt;white-space:nowrap">${l}</td>
          <td style="padding:4pt 0;border:none;font-weight:bold;font-size:9.5pt;color:${c}">${v}</td>
        </tr>`).join('')}
      </table>
    </div>
  </div>

  ${radarImg ? `
  <h2>Domain Radar</h2>
  <div style="text-align:center;margin-bottom:16pt">
    <img src="${radarImg}" style="max-width:300pt;width:65%;display:inline-block">
  </div>` : ''}

  <h2>Domain Coverage (14 Domains)</h2>
  <table>
    <thead><tr>
      <th style="width:36pt">Domain</th><th>Area</th>
      <th style="text-align:center">Total</th><th style="text-align:center">Met</th>
      <th style="text-align:center">Partial</th><th style="text-align:center">Not Met</th>
      <th style="text-align:center">N/A</th><th style="text-align:center">Score</th>
    </tr></thead>
    <tbody>${domRows}</tbody>
  </table>

  ${sorted.length >= 2 ? `
  <h2>Score Trend</h2>
  ${trendImg ? `<div style="margin-bottom:12pt"><img src="${trendImg}" style="width:100%;display:block"></div>` : ''}` : ''}

  <h2>Top ${topGaps.length} Priority Gaps by SPRS Impact</h2>
  ${topGaps.length ? `
  <table>
    <thead><tr>
      <th style="width:70pt">Practice</th><th style="width:36pt">Domain</th>
      <th>Title</th><th style="width:54pt">Status</th>
      <th style="width:44pt;text-align:center">SPRS Ded.</th>
    </tr></thead>
    <tbody>
      ${gapRows}
      ${gaps.length > 15 ? `<tr><td colspan="5" style="color:#94a3b8;font-style:italic;font-size:9pt">+ ${gaps.length - 15} more — see full POAM and practice listing below</td></tr>` : ''}
    </tbody>
  </table>` : `<p style="color:#15803d;font-weight:bold">&#10003; No gaps &mdash; all 110 practices are Met or N/A.</p>`}

  <h2>SPRS Submission Note</h2>
  <p style="font-size:10pt;line-height:1.65;color:#5a6a8a">The SPRS score of <strong style="color:${sprsCol}">${sprs.sprs}</strong> reflects this organization's NIST SP 800-171 Rev 2 posture. The score is calculated as 110 minus <strong>${sprs.deductions}</strong> weighted deduction points. Annual self-attestation must be submitted at <strong>sprs.csd.disa.mil</strong> by a senior company official with authority to attest on behalf of the organization. A System Security Plan (SSP) and Plan of Action &amp; Milestones (POAM) are required supporting artifacts. Certain DoD programs require third-party assessment by a CMMC Third-Party Assessment Organization (C3PAO) — confirm certification requirements with the contracting officer.</p>

  <div style="page-break-before: always">
    <h2>Full Assessment — All 110 CMMC Level 2 Practices</h2>
    <table>
      <thead><tr>
        <th style="width:80pt">Practice</th>
        <th style="width:44pt">Status</th>
        <th style="width:44pt;text-align:center">SPRS</th>
        <th>Title &amp; Description</th>
      </tr></thead>
      <tbody>${practiceListHtml}</tbody>
    </table>
  </div>

  <div class="footer">
    Generated by Abbott Cyber Consulting GRC Platform &nbsp;&middot;&nbsp;
    CMMC Level 2 / NIST SP 800-171 Rev 2 &nbsp;&middot;&nbsp; ${run.date || exportDate} &nbsp;&middot;&nbsp; Confidential — Do not distribute without authorization.
  </div>

</div>
</body>
</html>`;

  const blob = new Blob(['﻿' + html], { type: 'application/msword' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `CMMC-L2-Report-${(currentOrg.name || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}_${run.date || exportDate}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Word report downloaded', '#15803d');
}

// ── WINDOW EXPORTS ────────────────────────────────────────────────────────────

window.renderCMMC2              = renderCMMC2;
window.cmmc2State               = cmmc2State;
window.cmmc2StartNew            = cmmc2StartNew;
window.cmmc2OpenAssessment      = cmmc2OpenAssessment;
window.cmmc2OpenPoam            = cmmc2OpenPoam;
window.cmmc2OpenReport          = cmmc2OpenReport;
window.cmmc2OpenSprs            = cmmc2OpenSprs;
window.cmmc2NavToDashboard      = cmmc2NavToDashboard;
window.cmmc2SaveAssessment      = cmmc2SaveAssessment;
window.cmmc2DeleteAssessment    = cmmc2DeleteAssessment;
window.cmmc2SavePoam            = cmmc2SavePoam;
window.cmmc2CopyReportPrompt    = cmmc2CopyReportPrompt;
window.cmmc2SaveCommentary      = cmmc2SaveCommentary;
window.cmmc2SetAnswer           = cmmc2SetAnswer;
window.cmmc2TogglePanel         = cmmc2TogglePanel;
window.cmmc2TrendDraw           = cmmc2TrendDraw;
window.drawCmmc2Radar           = drawCmmc2Radar;
window.drawCmmc2ReportCharts    = drawCmmc2ReportCharts;
window.cmmc2ExportReportWord    = cmmc2ExportReportWord;
window.cmmc2CalcScore           = cmmc2CalcScore;
window.cmmc2GetGaps             = cmmc2GetGaps;
window.cmmc2DomainProgress      = cmmc2DomainProgress;
window.cmmc2SprsCalc            = cmmc2SprsCalc;
window.cmmc2Hydrate             = cmmc2Hydrate;
window.CMMC2_PRACTICES          = CMMC2_PRACTICES;
window.CMMC2_DOMAIN_META        = CMMC2_DOMAIN_META;
