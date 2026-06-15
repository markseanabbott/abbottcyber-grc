-- ============================================================
-- SUPABASE_PATCH_014.sql
-- Risk Register — framework abstraction layer, CIS control
-- categories, sub-controls, risk register, acceptance log,
-- IG change log, scoring functions, and trigger.
--
-- Run in: Supabase Dashboard → SQL Editor
-- Safe to run multiple times (IF NOT EXISTS / ON CONFLICT DO NOTHING)
-- Does NOT touch any existing tables.
-- ============================================================


-- ============================================================
-- 1. TABLES
-- ============================================================

-- Framework abstraction layer.
-- Seed with CIS_V8. Future: NIST_CSF, NIST_AI_RMF, CMMC.
CREATE TABLE IF NOT EXISTS risk_frameworks (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text        UNIQUE NOT NULL,   -- e.g. 'CIS_V8'
  name        text        NOT NULL,
  version     text        NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- Top-level control groups (18 for CIS v8; equivalent for other frameworks).
CREATE TABLE IF NOT EXISTS risk_control_categories (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id         uuid        NOT NULL REFERENCES risk_frameworks(id),
  control_number       text        NOT NULL,  -- '01' .. '18'
  control_name         text        NOT NULL,
  threat_scenario      text,
  inherent_risk_rating text        NOT NULL CHECK (inherent_risk_rating IN ('Critical','High','Medium','Low')),
  inherent_risk_score  integer     NOT NULL CHECK (inherent_risk_score BETWEEN 1 AND 4),
  minimum_ig_level     integer     NOT NULL CHECK (minimum_ig_level IN (1,2,3)),
  display_order        integer     NOT NULL DEFAULT 0,
  created_at           timestamptz DEFAULT now(),
  UNIQUE (framework_id, control_number)
);

-- Individual sub-controls (153 for CIS v8).
CREATE TABLE IF NOT EXISTS risk_subcontrols (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  control_category_id  uuid        NOT NULL REFERENCES risk_control_categories(id),
  framework_id         uuid        NOT NULL REFERENCES risk_frameworks(id),
  subcontrol_number    text        NOT NULL,  -- '6.1', '6.2' etc.
  subcontrol_name      text        NOT NULL,
  ig_level             integer     NOT NULL CHECK (ig_level IN (1,2,3)),
  inherent_weight      numeric     NOT NULL,  -- equal weighting within control; all weights in a control sum to 1.0
  asset_type           text,                  -- 'Devices'/'Software'/'Network'/'Data'/'Users'/'Applications'/'N/A'
  created_at           timestamptz DEFAULT now(),
  UNIQUE (framework_id, subcontrol_number)
);

-- One row per org per control category. Permanent — never deleted.
-- assessment_id always points to the latest assessment that refreshed this row.
CREATE TABLE IF NOT EXISTS risk_register (
  id                          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                      uuid        NOT NULL REFERENCES organisations(id),
  assessment_id               uuid        REFERENCES assessments(id),
  framework_id                uuid        NOT NULL REFERENCES risk_frameworks(id),
  control_category_id         uuid        NOT NULL REFERENCES risk_control_categories(id),
  client_ig_level             integer,
  in_scope                    boolean     NOT NULL DEFAULT true,
  inherent_risk_rating        text,
  inherent_risk_score         integer,
  calculated_risk_score       numeric,
  calculated_risk_rating      text        CHECK (calculated_risk_rating IN
                                ('Critical','High','Medium','Low','Minimal','Out of Scope','No Findings')),
  finding_count_total         integer     NOT NULL DEFAULT 0,
  finding_count_fail          integer     NOT NULL DEFAULT 0,
  finding_count_pass          integer     NOT NULL DEFAULT 0,
  finding_count_compensating  integer     NOT NULL DEFAULT 0,
  risk_status                 text        NOT NULL DEFAULT 'Active'
                                          CHECK (risk_status IN
                                          ('Active','Out of Scope','Accepted','Accepted - OOS','Pending Review')),
  accepted_by                 text,
  acceptance_date             timestamptz,
  acceptance_review_date      timestamptz,
  acceptance_rationale        text,
  last_calculated_at          timestamptz,
  created_at                  timestamptz DEFAULT now(),
  updated_at                  timestamptz DEFAULT now(),
  UNIQUE (org_id, control_category_id)   -- one living row per org per control
);

-- Append-only audit trail for all risk acceptance decisions.
CREATE TABLE IF NOT EXISTS risk_acceptance_log (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_register_id       uuid        NOT NULL REFERENCES risk_register(id),
  org_id                 uuid        NOT NULL,
  action                 text        NOT NULL CHECK (action IN ('Accepted','Renewed','Revoked','Expired','OOS Flagged')),
  accepted_by            text,
  acceptance_rationale   text,
  acceptance_date        timestamptz,
  acceptance_review_date timestamptz,
  previous_status        text,
  new_status             text,
  ig_level_at_time       integer,
  created_at             timestamptz DEFAULT now()
);

-- Append-only audit trail for every IG level change.
CREATE TABLE IF NOT EXISTS ig_change_log (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                   uuid        NOT NULL,
  assessment_id            uuid,
  previous_ig_level        integer,
  new_ig_level             integer     NOT NULL,
  changed_at               timestamptz DEFAULT now(),
  changed_by               text,
  recalculation_triggered  boolean     NOT NULL DEFAULT true,
  rows_affected            integer
);


-- ============================================================
-- 2. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS risk_register_org_id_idx
  ON risk_register (org_id);

CREATE INDEX IF NOT EXISTS risk_register_assessment_id_idx
  ON risk_register (assessment_id);

CREATE INDEX IF NOT EXISTS risk_register_framework_id_idx
  ON risk_register (framework_id);

CREATE INDEX IF NOT EXISTS risk_acceptance_log_register_id_idx
  ON risk_acceptance_log (risk_register_id);

CREATE INDEX IF NOT EXISTS ig_change_log_org_id_idx
  ON ig_change_log (org_id);

CREATE INDEX IF NOT EXISTS risk_subcontrols_category_id_idx
  ON risk_subcontrols (control_category_id);


-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================
-- Matches the open anon pattern used by all other tables in this
-- project. Will be tightened to authenticated-only in PATCH_010.

ALTER TABLE risk_frameworks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_control_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_subcontrols       ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_register          ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_acceptance_log    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ig_change_log          ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_risk_frameworks"         ON risk_frameworks         FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_risk_control_categories" ON risk_control_categories FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_risk_subcontrols"        ON risk_subcontrols        FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_risk_register"           ON risk_register           FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_risk_acceptance_log"     ON risk_acceptance_log     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_ig_change_log"           ON ig_change_log           FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_risk_frameworks"         ON risk_frameworks         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_risk_control_categories" ON risk_control_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_risk_subcontrols"        ON risk_subcontrols        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_risk_register"           ON risk_register           FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_risk_acceptance_log"     ON risk_acceptance_log     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_ig_change_log"           ON ig_change_log           FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ============================================================
-- 4. SEED — risk_frameworks
-- ============================================================

INSERT INTO risk_frameworks (code, name, version)
VALUES ('CIS_V8', 'CIS Controls', '8.0')
ON CONFLICT (code) DO NOTHING;


-- ============================================================
-- 5. SEED — risk_control_categories (18 CIS Controls)
-- ============================================================

INSERT INTO risk_control_categories
  (framework_id, control_number, control_name, threat_scenario, inherent_risk_rating, inherent_risk_score, minimum_ig_level, display_order)
SELECT
  (SELECT id FROM risk_frameworks WHERE code = 'CIS_V8'),
  v.ctrl_num, v.ctrl_name, v.threat, v.rating, v.score, v.min_ig, v.ord
FROM (VALUES
  ('01', 'Inventory of Enterprise Assets',
   'Unmanaged or unknown devices connect to the network and become entry points for attackers or compliance gaps.',
   'High', 3, 1, 1),
  ('02', 'Inventory of Software Assets',
   'Unauthorized or unlicensed software operates undetected, introducing vulnerabilities or data exfiltration tools.',
   'High', 3, 1, 2),
  ('03', 'Data Protection',
   'Sensitive data is stored, transmitted, or disposed of without encryption or classification controls, resulting in regulatory breach or data loss.',
   'Critical', 4, 1, 3),
  ('04', 'Secure Configuration',
   'Default or weak configurations on devices and software provide trivial footholds for attackers via known exploit paths.',
   'Critical', 4, 1, 4),
  ('05', 'Account Management',
   'Orphaned, shared, or over-privileged accounts are compromised or abused, enabling unauthorized access across systems.',
   'Critical', 4, 1, 5),
  ('06', 'Access Control Management',
   'Lack of least-privilege and MFA allows credential compromise or insider abuse to propagate laterally without friction.',
   'Critical', 4, 1, 6),
  ('07', 'Continuous Vulnerability Management',
   'Known vulnerabilities in systems and software go unpatched, providing attackers with documented and weaponized exploit paths.',
   'Critical', 4, 1, 7),
  ('08', 'Audit Log Management',
   'Absence of logs prevents detection of breaches in progress and eliminates forensic evidence needed for incident response and regulatory reporting.',
   'High', 3, 1, 8),
  ('09', 'Email and Web Browser Protections',
   'Phishing, malicious attachments, and drive-by downloads successfully deliver malware or harvest credentials through unprotected channels.',
   'Critical', 4, 1, 9),
  ('10', 'Malware Defenses',
   'Malware including ransomware executes and propagates across endpoints and servers without detection or containment.',
   'Critical', 4, 1, 10),
  ('11', 'Data Recovery',
   'Ransomware or destructive attack results in permanent data loss due to absent, untested, or compromised backup systems.',
   'Critical', 4, 1, 11),
  ('12', 'Network Infrastructure Management',
   'Flat or poorly segmented networks allow attackers to move freely between systems once initial access is gained.',
   'High', 3, 2, 12),
  ('13', 'Network Monitoring and Defense',
   'Attacker activity within the network goes undetected due to absence of traffic monitoring or network defense capability.',
   'High', 3, 2, 13),
  ('14', 'Security Awareness and Skills Training',
   'Employees fall for phishing or social engineering due to lack of training, enabling initial access or data mishandling.',
   'High', 3, 1, 14),
  ('15', 'Service Provider Management',
   'Third-party vendors with privileged access or data custody introduce breach risk that bypasses the organization''s own controls.',
   'High', 3, 2, 15),
  ('16', 'Application Software Security',
   'Custom or third-party applications contain exploitable vulnerabilities that expose sensitive data or provide system access.',
   'Medium', 2, 2, 16),
  ('17', 'Incident Response Management',
   'Absence of an incident response plan results in chaotic, slow, and costly response to breaches, extending damage and regulatory exposure.',
   'High', 3, 1, 17),
  ('18', 'Penetration Testing',
   'Exploitable vulnerabilities and attack paths remain unknown and unaddressed because they have never been validated through adversarial testing.',
   'Medium', 2, 3, 18)
) AS v(ctrl_num, ctrl_name, threat, rating, score, min_ig, ord)
ON CONFLICT (framework_id, control_number) DO NOTHING;


-- ============================================================
-- 6. SEED — risk_subcontrols (153 CIS v8 safeguards)
-- Weights are equal within each control group (1 / count of safeguards).
-- ============================================================

INSERT INTO risk_subcontrols
  (control_category_id, framework_id, subcontrol_number, subcontrol_name, ig_level, inherent_weight, asset_type)
SELECT
  (SELECT rcc.id FROM risk_control_categories rcc
   WHERE rcc.control_number = v.ctrl_num
     AND rcc.framework_id = (SELECT id FROM risk_frameworks WHERE code = 'CIS_V8')),
  (SELECT id FROM risk_frameworks WHERE code = 'CIS_V8'),
  v.sf, v.sfname, v.ig, v.wt, v.at
FROM (VALUES
  -- Control 1 (5 safeguards, weight = 0.2000)
  ('01','1.1','Establish & Maintain Detailed Enterprise Asset Inventory',1,0.2000,'Devices'),
  ('01','1.2','Address Unauthorised Assets',1,0.2000,'Devices'),
  ('01','1.3','Utilise an Active Discovery Tool',2,0.2000,'Devices'),
  ('01','1.4','Use DHCP Logging to Update Enterprise Asset Inventory',2,0.2000,'Devices'),
  ('01','1.5','Use a Passive Asset Discovery Tool',3,0.2000,'Devices'),
  -- Control 2 (7 safeguards, weight ≈ 0.1429)
  ('02','2.1','Establish & Maintain a Software Inventory',1,0.1429,'Software'),
  ('02','2.2','Ensure Authorised Software is Currently Supported',1,0.1429,'Software'),
  ('02','2.3','Address Unauthorised Software',1,0.1429,'Software'),
  ('02','2.4','Utilise Automated Software Inventory Tools',2,0.1429,'Software'),
  ('02','2.5','Allowlist Authorised Software',2,0.1429,'Software'),
  ('02','2.6','Allowlist Authorised Libraries',2,0.1429,'Software'),
  ('02','2.7','Allowlist Authorised Scripts',3,0.1429,'Software'),
  -- Control 3 (14 safeguards, weight ≈ 0.0714)
  ('03','3.1','Establish & Maintain a Data Management Process',1,0.0714,'Data'),
  ('03','3.2','Establish & Maintain a Data Inventory',1,0.0714,'Data'),
  ('03','3.3','Configure Data Access Control Lists',1,0.0714,'Data'),
  ('03','3.4','Enforce Data Retention',1,0.0714,'Data'),
  ('03','3.5','Securely Dispose of Data',1,0.0714,'Data'),
  ('03','3.6','Encrypt Data on End-User Devices',2,0.0714,'Data'),
  ('03','3.7','Establish & Maintain a Data Classification Scheme',2,0.0714,'Data'),
  ('03','3.8','Document Data Flows',2,0.0714,'Data'),
  ('03','3.9','Encrypt Data on Removable Media',2,0.0714,'Data'),
  ('03','3.10','Encrypt Sensitive Data in Transit',2,0.0714,'Data'),
  ('03','3.11','Encrypt Sensitive Data at Rest',2,0.0714,'Data'),
  ('03','3.12','Segment Data Processing & Storage Based on Sensitivity',3,0.0714,'Data'),
  ('03','3.13','Deploy a Data Loss Prevention Solution',3,0.0714,'Data'),
  ('03','3.14','Log Sensitive Data Access',3,0.0714,'Data'),
  -- Control 4 (12 safeguards, weight ≈ 0.0833)
  ('04','4.1','Establish & Maintain a Secure Configuration Process',1,0.0833,'Devices'),
  ('04','4.2','Establish & Maintain a Secure Configuration Process for Network Infrastructure',1,0.0833,'Network'),
  ('04','4.3','Configure Automatic Session Locking on Enterprise Assets',1,0.0833,'Devices'),
  ('04','4.4','Implement & Manage a Firewall on Servers',1,0.0833,'Devices'),
  ('04','4.5','Implement & Manage a Firewall on End-User Devices',1,0.0833,'Devices'),
  ('04','4.6','Securely Manage Enterprise Assets & Software',2,0.0833,'Devices'),
  ('04','4.7','Manage Default Accounts on Enterprise Assets & Software',2,0.0833,'Devices'),
  ('04','4.8','Uninstall or Disable Unnecessary Services on Enterprise Assets & Software',2,0.0833,'Devices'),
  ('04','4.9','Configure Trusted DNS Servers on Enterprise Assets',2,0.0833,'Devices'),
  ('04','4.10','Enforce Automatic Device Lockout on Portable End-User Devices',2,0.0833,'Devices'),
  ('04','4.11','Enforce Remote Wipe Capability on Portable End-User Devices',2,0.0833,'Devices'),
  ('04','4.12','Separate Enterprise Workspaces on Mobile End-User Devices',3,0.0833,'Devices'),
  -- Control 5 (6 safeguards, weight ≈ 0.1667)
  ('05','5.1','Establish & Maintain an Inventory of Accounts',1,0.1667,'Users'),
  ('05','5.2','Use Unique Passwords',1,0.1667,'Users'),
  ('05','5.3','Disable Dormant Accounts',1,0.1667,'Users'),
  ('05','5.4','Restrict Administrator Privileges to Dedicated Admin Accounts',1,0.1667,'Users'),
  ('05','5.5','Establish & Maintain an Inventory of Service Accounts',2,0.1667,'Users'),
  ('05','5.6','Centralise Account Management',3,0.1667,'Users'),
  -- Control 6 (8 safeguards, weight = 0.1250)
  ('06','6.1','Establish an Access Granting Process',1,0.1250,'Users'),
  ('06','6.2','Establish an Access Revoking Process',1,0.1250,'Users'),
  ('06','6.3','Require MFA for Externally-Exposed Applications',1,0.1250,'Users'),
  ('06','6.4','Require MFA for Remote Network Access',1,0.1250,'Users'),
  ('06','6.5','Require MFA for Administrative Access',2,0.1250,'Users'),
  ('06','6.6','Establish & Maintain an Inventory of Authentication & Authorisation Systems',2,0.1250,'Users'),
  ('06','6.7','Centralise Access Control',2,0.1250,'Users'),
  ('06','6.8','Define & Maintain Role-Based Access Control',3,0.1250,'Users'),
  -- Control 7 (7 safeguards, weight ≈ 0.1429)
  ('07','7.1','Establish & Maintain a Vulnerability Management Process',2,0.1429,'N/A'),
  ('07','7.2','Establish & Maintain a Remediation Process',2,0.1429,'N/A'),
  ('07','7.3','Perform Automated Operating System Patch Management',2,0.1429,'Devices'),
  ('07','7.4','Perform Automated Application Patch Management',2,0.1429,'Software'),
  ('07','7.5','Perform Automated Vulnerability Scans of Internal Enterprise Assets',2,0.1429,'Devices'),
  ('07','7.6','Perform Automated Vulnerability Scans of Externally-Exposed Enterprise Assets',3,0.1429,'Devices'),
  ('07','7.7','Remediate Detected Vulnerabilities',3,0.1429,'Software'),
  -- Control 8 (12 safeguards, weight ≈ 0.0833)
  ('08','8.1','Establish & Maintain an Audit Log Management Process',1,0.0833,'N/A'),
  ('08','8.2','Collect Audit Logs',1,0.0833,'Devices'),
  ('08','8.3','Ensure Adequate Audit Log Storage',2,0.0833,'Devices'),
  ('08','8.4','Standardise Time Synchronisation',2,0.0833,'Devices'),
  ('08','8.5','Collect Detailed Audit Logs',2,0.0833,'Devices'),
  ('08','8.6','Collect DNS Query Audit Logs',2,0.0833,'Network'),
  ('08','8.7','Collect URL Request Audit Logs',2,0.0833,'Network'),
  ('08','8.8','Collect Command-Line Audit Logs',2,0.0833,'Devices'),
  ('08','8.9','Centralise Audit Logs',3,0.0833,'Devices'),
  ('08','8.10','Retain Audit Logs',3,0.0833,'Devices'),
  ('08','8.11','Conduct Audit Log Reviews',3,0.0833,'Devices'),
  ('08','8.12','Collect Service Provider Logs',3,0.0833,'Devices'),
  -- Control 9 (7 safeguards, weight ≈ 0.1429)
  ('09','9.1','Ensure Use of Only Fully Supported Browsers & Email Clients',1,0.1429,'Devices'),
  ('09','9.2','Use DNS Filtering Services',1,0.1429,'Network'),
  ('09','9.3','Maintain & Enforce Network-Based URL Filters',2,0.1429,'Network'),
  ('09','9.4','Restrict Use of Browser & Email Client Extensions',2,0.1429,'Software'),
  ('09','9.5','Implement DMARC',2,0.1429,'Network'),
  ('09','9.6','Block Unnecessary File Types',3,0.1429,'Network'),
  ('09','9.7','Deploy & Maintain Email Server Anti-Malware Protections',3,0.1429,'Network'),
  -- Control 10 (7 safeguards, weight ≈ 0.1429)
  ('10','10.1','Deploy & Maintain Anti-Malware Software',1,0.1429,'Devices'),
  ('10','10.2','Configure Automatic Anti-Malware Signature Updates',1,0.1429,'Devices'),
  ('10','10.3','Disable Autorun & Autoplay for Removable Media',2,0.1429,'Devices'),
  ('10','10.4','Configure Automatic Anti-Malware Scanning of Removable Media',2,0.1429,'Devices'),
  ('10','10.5','Enable Anti-Exploitation Features',2,0.1429,'Devices'),
  ('10','10.6','Centrally Manage Anti-Malware Software',3,0.1429,'Devices'),
  ('10','10.7','Use Behaviour-Based Anti-Malware Software',3,0.1429,'Devices'),
  -- Control 11 (5 safeguards, weight = 0.2000)
  ('11','11.1','Establish & Maintain a Data Recovery Process',1,0.2000,'Data'),
  ('11','11.2','Perform Automated Backups',1,0.2000,'Data'),
  ('11','11.3','Protect Recovery Data',1,0.2000,'Data'),
  ('11','11.4','Establish & Maintain an Isolated Instance of Recovery Data',2,0.2000,'Data'),
  ('11','11.5','Test Data Recovery',3,0.2000,'Data'),
  -- Control 12 (8 safeguards, weight = 0.1250)
  ('12','12.1','Ensure Network Infrastructure is Up-to-Date',2,0.1250,'Network'),
  ('12','12.2','Establish & Maintain a Secure Network Architecture',2,0.1250,'Network'),
  ('12','12.3','Securely Manage Network Infrastructure',2,0.1250,'Network'),
  ('12','12.4','Establish & Maintain Architecture Diagram(s)',2,0.1250,'Network'),
  ('12','12.5','Centralise Network Authentication, Authorisation & Auditing (AAA)',2,0.1250,'Network'),
  ('12','12.6','Use Secure Network Management & Communication Protocols',3,0.1250,'Network'),
  ('12','12.7','Ensure Remote Devices Utilise a VPN & Connect to Enterprise AAA Infrastructure',3,0.1250,'Network'),
  ('12','12.8','Establish & Maintain Dedicated Computing Resources for All Administrative Work',3,0.1250,'Network'),
  -- Control 13 (11 safeguards, weight ≈ 0.0909)
  ('13','13.1','Centralise Security Event Alerting',2,0.0909,'Network'),
  ('13','13.2','Deploy a Host-Based Intrusion Detection Solution',2,0.0909,'Network'),
  ('13','13.3','Deploy a Network Intrusion Detection Solution',2,0.0909,'Network'),
  ('13','13.4','Perform Traffic Filtering Between Network Segments',2,0.0909,'Network'),
  ('13','13.5','Manage Access Control for Remote Assets',2,0.0909,'Network'),
  ('13','13.6','Collect Network Traffic Flow Logs',3,0.0909,'Network'),
  ('13','13.7','Deploy a Host-Based Intrusion Prevention Solution',3,0.0909,'Network'),
  ('13','13.8','Deploy a Network Intrusion Prevention Solution',3,0.0909,'Network'),
  ('13','13.9','Deploy Port-Level Access Control',3,0.0909,'Network'),
  ('13','13.10','Perform Application Layer Filtering',3,0.0909,'Network'),
  ('13','13.11','Tune Security Event Alerting Thresholds',3,0.0909,'Network'),
  -- Control 14 (9 safeguards, weight ≈ 0.1111)
  ('14','14.1','Establish & Maintain a Security Awareness Program',1,0.1111,'Users'),
  ('14','14.2','Train Workforce Members to Recognise Social Engineering Attacks',1,0.1111,'Users'),
  ('14','14.3','Train Workforce Members on Authentication Best Practices',1,0.1111,'Users'),
  ('14','14.4','Train Workforce on Data Handling Best Practices',2,0.1111,'Users'),
  ('14','14.5','Train Workforce Members on Causes of Unintentional Data Exposure',2,0.1111,'Users'),
  ('14','14.6','Train Workforce Members on Recognising & Reporting Security Incidents',2,0.1111,'Users'),
  ('14','14.7','Train Workforce on Identifying & Reporting Missing Security Updates',2,0.1111,'Users'),
  ('14','14.8','Train Workforce on Dangers of Insecure Networks',2,0.1111,'Users'),
  ('14','14.9','Conduct Role-Specific Security Awareness & Skills Training',3,0.1111,'Users'),
  -- Control 15 (7 safeguards, weight ≈ 0.1429)
  ('15','15.1','Establish & Maintain an Inventory of Service Providers',2,0.1429,'N/A'),
  ('15','15.2','Establish & Maintain a Policy to Classify Service Providers',2,0.1429,'N/A'),
  ('15','15.3','Classify Service Providers',2,0.1429,'N/A'),
  ('15','15.4','Ensure Service Provider Contracts Include Security Requirements',2,0.1429,'N/A'),
  ('15','15.5','Assess Service Providers',2,0.1429,'N/A'),
  ('15','15.6','Monitor Service Providers',3,0.1429,'N/A'),
  ('15','15.7','Securely Decommission Service Providers',3,0.1429,'N/A'),
  -- Control 16 (14 safeguards, weight ≈ 0.0714)
  ('16','16.1','Establish & Maintain a Secure Application Development Process',2,0.0714,'Applications'),
  ('16','16.2','Establish & Maintain a Process to Accept & Address Software Vulnerabilities',2,0.0714,'Applications'),
  ('16','16.3','Perform Root Cause Analysis on Security Vulnerabilities',2,0.0714,'Applications'),
  ('16','16.4','Establish & Manage an Application Inventory',2,0.0714,'Applications'),
  ('16','16.5','Use Up-to-Date & Trusted Third-Party Software Components',2,0.0714,'Applications'),
  ('16','16.6','Establish & Maintain a Severity Rating System for Application Vulnerabilities',2,0.0714,'Applications'),
  ('16','16.7','Use Standard Hardening Configuration Templates for Application Infrastructure',2,0.0714,'Applications'),
  ('16','16.8','Separate Production & Non-Production Systems',3,0.0714,'Applications'),
  ('16','16.9','Train Developers in Application Security Concepts & Secure Coding',3,0.0714,'Applications'),
  ('16','16.10','Apply Secure Design Principles in Application Architectures',3,0.0714,'Applications'),
  ('16','16.11','Leverage Vetted Modules or Services for Application Security Components',3,0.0714,'Applications'),
  ('16','16.12','Implement Code-Level Security Checks',3,0.0714,'Applications'),
  ('16','16.13','Conduct Application Penetration Testing',3,0.0714,'Applications'),
  ('16','16.14','Conduct Threat Modelling',3,0.0714,'Applications'),
  -- Control 17 (9 safeguards, weight ≈ 0.1111)
  ('17','17.1','Designate Personnel to Manage Incident Handling',2,0.1111,'N/A'),
  ('17','17.2','Establish & Maintain Contact Information for Reporting Security Incidents',2,0.1111,'N/A'),
  ('17','17.3','Establish & Maintain an Enterprise Process for Reporting Incidents',2,0.1111,'N/A'),
  ('17','17.4','Establish & Maintain an Incident Response Process',2,0.1111,'N/A'),
  ('17','17.5','Assign Key Roles & Responsibilities',2,0.1111,'N/A'),
  ('17','17.6','Define Mechanisms for Communicating During Incident Response',2,0.1111,'N/A'),
  ('17','17.7','Conduct Routine Incident Response Exercises',3,0.1111,'N/A'),
  ('17','17.8','Conduct Post-Incident Reviews',3,0.1111,'N/A'),
  ('17','17.9','Establish & Maintain Security Incident Thresholds',3,0.1111,'N/A'),
  -- Control 18 (5 safeguards, weight = 0.2000)
  ('18','18.1','Establish & Maintain a Penetration Testing Program',3,0.2000,'N/A'),
  ('18','18.2','Perform Periodic External Penetration Tests',3,0.2000,'N/A'),
  ('18','18.3','Remediate Penetration Test Findings',3,0.2000,'N/A'),
  ('18','18.4','Validate Security Measures',3,0.2000,'N/A'),
  ('18','18.5','Perform Periodic Internal Penetration Tests',3,0.2000,'N/A')
) AS v(ctrl_num, sf, sfname, ig, wt, at)
ON CONFLICT (framework_id, subcontrol_number) DO NOTHING;


-- ============================================================
-- 7. FUNCTION: initialize_risk_register
-- Creates the 18 risk_register rows for a given org.
-- Called by the trigger on first CIS assessment INSERT.
-- Uses ON CONFLICT to update the assessment_id pointer on
-- subsequent assessments without disturbing risk_status or
-- acceptance fields.
-- ============================================================

CREATE OR REPLACE FUNCTION initialize_risk_register(
  p_org_id       uuid,
  p_assessment_id uuid,
  p_ig_level     integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_fw_id  uuid;
  v_cat    RECORD;
  v_scope  boolean;
  v_status text;
BEGIN
  SELECT id INTO v_fw_id FROM risk_frameworks WHERE code = 'CIS_V8';

  FOR v_cat IN
    SELECT * FROM risk_control_categories
    WHERE framework_id = v_fw_id
    ORDER BY display_order
  LOOP
    v_scope  := p_ig_level >= v_cat.minimum_ig_level;
    v_status := CASE WHEN v_scope THEN 'Active' ELSE 'Out of Scope' END;

    INSERT INTO risk_register (
      org_id, assessment_id, framework_id, control_category_id,
      client_ig_level, in_scope,
      inherent_risk_rating, inherent_risk_score,
      calculated_risk_score, calculated_risk_rating,
      finding_count_total, finding_count_fail, finding_count_pass, finding_count_compensating,
      risk_status, last_calculated_at, created_at, updated_at
    ) VALUES (
      p_org_id, p_assessment_id, v_fw_id, v_cat.id,
      p_ig_level, v_scope,
      v_cat.inherent_risk_rating, v_cat.inherent_risk_score,
      NULL, CASE WHEN v_scope THEN 'No Findings' ELSE 'Out of Scope' END,
      0, 0, 0, 0,
      v_status, NOW(), NOW(), NOW()
    )
    ON CONFLICT (org_id, control_category_id) DO UPDATE SET
      assessment_id   = EXCLUDED.assessment_id,
      client_ig_level = EXCLUDED.client_ig_level,
      in_scope        = EXCLUDED.in_scope,
      -- Preserve acceptance state; only reset status for plain Active/OOS rows
      risk_status = CASE
        WHEN risk_register.risk_status IN ('Accepted','Accepted - OOS','Pending Review')
          THEN risk_register.risk_status
        ELSE EXCLUDED.risk_status
      END,
      updated_at = NOW();
  END LOOP;
END;
$$;


-- ============================================================
-- 8. FUNCTION: recalculate_risk_register
-- Reads assessments.answers (jsonb) for the given assessment,
-- joins against risk_subcontrols for weights and IG levels,
-- filters to the org's current IG goal, and updates all 18
-- risk_register rows with fresh scores and finding counts.
-- ============================================================

CREATE OR REPLACE FUNCTION recalculate_risk_register(
  p_org_id        uuid,
  p_assessment_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_ig_level           integer;
  v_answers            jsonb;
  v_rr                 RECORD;
  v_sc                 RECORD;
  v_answer             text;
  v_active_weight_sum  numeric;
  v_pass_weight_sum    numeric;
  v_weighted_pass_rate numeric;
  v_calc_score         numeric;
  v_calc_rating        text;
  v_total              integer;
  v_pass               integer;
  v_fail               integer;
  v_comp               integer;
  v_new_status         text;
  v_min_ig             integer;
BEGIN
  -- Resolve current IG level from organisation_profiles
  SELECT
    CASE cis_goal WHEN 'ig1' THEN 1 WHEN 'ig2' THEN 2 WHEN 'ig3' THEN 3 ELSE 1 END
  INTO v_ig_level
  FROM organisation_profiles
  WHERE org_id = p_org_id;

  IF v_ig_level IS NULL THEN v_ig_level := 1; END IF;

  -- Get the answer blob for this assessment
  SELECT answers INTO v_answers
  FROM assessments
  WHERE id = p_assessment_id;

  IF v_answers IS NULL THEN RETURN; END IF;

  -- Process each risk_register row for this org
  FOR v_rr IN
    SELECT rr.*, rcc.minimum_ig_level AS min_ig
    FROM risk_register rr
    JOIN risk_control_categories rcc ON rcc.id = rr.control_category_id
    WHERE rr.org_id = p_org_id
  LOOP
    v_active_weight_sum := 0;
    v_pass_weight_sum   := 0;
    v_total := 0; v_pass := 0; v_fail := 0; v_comp := 0;
    v_min_ig := v_rr.min_ig;

    -- Accumulate weighted scores from active sub-controls
    FOR v_sc IN
      SELECT * FROM risk_subcontrols
      WHERE control_category_id = v_rr.control_category_id
        AND ig_level <= v_ig_level
    LOOP
      v_answer := v_answers ->> v_sc.subcontrol_number;
      IF v_answer IS NULL THEN CONTINUE; END IF;

      v_total := v_total + 1;
      IF v_answer = 'na' THEN CONTINUE; END IF;  -- excluded from denominator

      v_active_weight_sum := v_active_weight_sum + v_sc.inherent_weight;

      IF v_answer = 'yes' THEN
        v_pass := v_pass + 1;
        v_pass_weight_sum := v_pass_weight_sum + v_sc.inherent_weight;
      ELSIF v_answer = 'partial' THEN
        v_comp := v_comp + 1;
        v_pass_weight_sum := v_pass_weight_sum + (v_sc.inherent_weight * 0.5);
      ELSIF v_answer = 'no' THEN
        v_fail := v_fail + 1;
        -- 0 contribution
      END IF;
    END LOOP;

    -- Derive score and rating
    IF v_ig_level < v_min_ig THEN
      v_calc_score  := NULL;
      v_calc_rating := 'Out of Scope';
    ELSIF v_active_weight_sum = 0 THEN
      v_calc_score  := NULL;
      v_calc_rating := 'No Findings';
    ELSE
      v_weighted_pass_rate := v_pass_weight_sum / v_active_weight_sum;
      v_calc_score := ROUND((v_rr.inherent_risk_score * (1.0 - v_weighted_pass_rate))::numeric, 2);
      v_calc_rating := CASE
        WHEN v_calc_score >= 3.5 THEN 'Critical'
        WHEN v_calc_score >= 2.5 THEN 'High'
        WHEN v_calc_score >= 1.5 THEN 'Medium'
        WHEN v_calc_score >= 0.5 THEN 'Low'
        ELSE 'Minimal'
      END;
    END IF;

    -- Determine new status without disturbing acceptance fields
    v_new_status := v_rr.risk_status;
    IF v_rr.risk_status IN ('Active', 'Out of Scope', 'No Findings') THEN
      v_new_status := CASE
        WHEN v_ig_level >= v_min_ig THEN 'Active'
        ELSE 'Out of Scope'
      END;
    ELSIF v_rr.risk_status = 'Accepted' THEN
      -- Flag for review if residual score has moved materially
      IF v_rr.calculated_risk_score IS NOT NULL
         AND v_calc_score IS NOT NULL
         AND ABS(v_calc_score - v_rr.calculated_risk_score) > 0.5 THEN
        v_new_status := 'Pending Review';
      END IF;
    END IF;

    UPDATE risk_register SET
      assessment_id            = p_assessment_id,
      client_ig_level          = v_ig_level,
      in_scope                 = (v_ig_level >= v_min_ig),
      calculated_risk_score    = v_calc_score,
      calculated_risk_rating   = v_calc_rating,
      finding_count_total      = v_total,
      finding_count_fail       = v_fail,
      finding_count_pass       = v_pass,
      finding_count_compensating = v_comp,
      risk_status              = v_new_status,
      last_calculated_at       = NOW(),
      updated_at               = NOW()
    WHERE id = v_rr.id;
  END LOOP;
END;
$$;


-- ============================================================
-- 9. FUNCTION: handle_ig_change
-- Called by the app when cisSetGoal() changes IG level.
-- Logs the change, re-evaluates scope on all 18 rows, and
-- triggers a full recalculation.
-- ============================================================

CREATE OR REPLACE FUNCTION handle_ig_change(
  p_org_id        uuid,
  p_assessment_id uuid,
  p_new_ig_level  integer,
  p_changed_by    text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_prev_ig  integer;
  v_rr       RECORD;
  v_new_status text;
BEGIN
  -- Snapshot the current IG level from any existing risk_register row
  SELECT client_ig_level INTO v_prev_ig
  FROM risk_register
  WHERE org_id = p_org_id
  LIMIT 1;

  -- Log the change
  INSERT INTO ig_change_log (
    org_id, assessment_id, previous_ig_level, new_ig_level,
    changed_at, changed_by, recalculation_triggered, rows_affected
  ) VALUES (
    p_org_id, p_assessment_id, v_prev_ig, p_new_ig_level,
    NOW(), p_changed_by, true, 18
  );

  -- Re-evaluate in_scope and risk_status on every risk_register row for this org
  FOR v_rr IN
    SELECT rr.*, rcc.minimum_ig_level AS min_ig
    FROM risk_register rr
    JOIN risk_control_categories rcc ON rcc.id = rr.control_category_id
    WHERE rr.org_id = p_org_id
  LOOP
    IF p_new_ig_level >= v_rr.min_ig THEN
      -- Control is now in scope
      v_new_status := CASE v_rr.risk_status
        WHEN 'Out of Scope'   THEN 'Active'
        WHEN 'Accepted - OOS' THEN 'Pending Review'
        ELSE v_rr.risk_status
      END;
    ELSE
      -- Control is now out of scope
      v_new_status := CASE v_rr.risk_status
        WHEN 'Accepted' THEN 'Accepted - OOS'
        ELSE 'Out of Scope'
      END;
    END IF;

    UPDATE risk_register SET
      in_scope        = (p_new_ig_level >= v_rr.min_ig),
      client_ig_level = p_new_ig_level,
      risk_status     = v_new_status,
      updated_at      = NOW()
    WHERE id = v_rr.id;
  END LOOP;

  -- Recalculate scores with the new IG filter applied
  IF p_assessment_id IS NOT NULL THEN
    PERFORM recalculate_risk_register(p_org_id, p_assessment_id);
  END IF;
END;
$$;


-- ============================================================
-- 10. FUNCTION: accept_risk
-- Formally accepts a risk. Writes to the audit log and
-- updates the risk_register row.
-- ============================================================

CREATE OR REPLACE FUNCTION accept_risk(
  p_risk_register_id uuid,
  p_accepted_by      text,
  p_rationale        text,
  p_review_date      timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rr RECORD;
BEGIN
  SELECT * INTO v_rr FROM risk_register WHERE id = p_risk_register_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'risk_register row % not found', p_risk_register_id;
  END IF;

  INSERT INTO risk_acceptance_log (
    risk_register_id, org_id, action,
    accepted_by, acceptance_rationale,
    acceptance_date, acceptance_review_date,
    previous_status, new_status,
    ig_level_at_time, created_at
  ) VALUES (
    p_risk_register_id, v_rr.org_id, 'Accepted',
    p_accepted_by, p_rationale,
    NOW(), p_review_date,
    v_rr.risk_status, 'Accepted',
    v_rr.client_ig_level, NOW()
  );

  UPDATE risk_register SET
    risk_status            = 'Accepted',
    accepted_by            = p_accepted_by,
    acceptance_date        = NOW(),
    acceptance_review_date = p_review_date,
    acceptance_rationale   = p_rationale,
    updated_at             = NOW()
  WHERE id = p_risk_register_id;
END;
$$;


-- ============================================================
-- 11. TRIGGER — recalculate on CIS assessment save
-- Fires AFTER INSERT OR UPDATE OF answers on assessments.
-- Only processes rows where module = 'cis'.
-- On INSERT: calls initialize first (creates or refreshes the
--   18 risk_register rows), then recalculates.
-- On UPDATE: recalculates only (rows already exist).
-- ============================================================

CREATE OR REPLACE FUNCTION tg_cis_assessment_recalculate()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_ig integer;
BEGIN
  IF NEW.module <> 'cis' THEN RETURN NEW; END IF;

  IF TG_OP = 'INSERT' THEN
    -- Resolve IG level from profile; default 1 if not set
    SELECT
      CASE cis_goal WHEN 'ig1' THEN 1 WHEN 'ig2' THEN 2 WHEN 'ig3' THEN 3 ELSE 1 END
    INTO v_ig
    FROM organisation_profiles
    WHERE org_id = NEW.org_id;

    IF v_ig IS NULL THEN v_ig := 1; END IF;

    PERFORM initialize_risk_register(NEW.org_id, NEW.id, v_ig);
  END IF;

  -- Always recalculate (covers both INSERT and UPDATE)
  PERFORM recalculate_risk_register(NEW.org_id, NEW.id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tg_cis_assessment_risk ON assessments;
CREATE TRIGGER tg_cis_assessment_risk
  AFTER INSERT OR UPDATE OF answers
  ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION tg_cis_assessment_recalculate();


-- ============================================================
-- 12. VERIFICATION QUERIES
-- Run these after the patch to confirm everything seeded correctly.
-- ============================================================

-- Should return 1 row: CIS_V8
-- SELECT code, name, version FROM risk_frameworks;

-- Should return 18 rows
-- SELECT control_number, control_name, inherent_risk_rating, minimum_ig_level
-- FROM risk_control_categories ORDER BY display_order;

-- Should return 153 rows
-- SELECT COUNT(*) FROM risk_subcontrols;

-- After saving a CIS assessment in the app, run this to see populated rows:
-- SELECT rcc.control_number, rcc.control_name, rr.risk_status,
--        rr.calculated_risk_rating, rr.calculated_risk_score,
--        rr.finding_count_pass, rr.finding_count_fail, rr.finding_count_compensating
-- FROM risk_register rr
-- JOIN risk_control_categories rcc ON rcc.id = rr.control_category_id
-- WHERE rr.org_id = '<your-org-uuid>'
-- ORDER BY rcc.display_order;

-- ============================================================
-- END OF PATCH_014
-- ============================================================
