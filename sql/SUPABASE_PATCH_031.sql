-- SUPABASE_PATCH_031.sql
-- Adds 5 new tool types to pricing_schedule:
--   dns_filter, password_vault, dark_web_monitoring, mdm, ztna_vpn
--
-- Run manually in the Supabase SQL Editor.

ALTER TABLE pricing_schedule DROP CONSTRAINT IF EXISTS pricing_schedule_tool_type_check;

ALTER TABLE pricing_schedule ADD CONSTRAINT pricing_schedule_tool_type_check CHECK (tool_type IN (
  -- Identity & Access
  'mfa', 'pam', 'password_vault', 'dark_web_monitoring',
  -- Endpoint & Detection
  'edr', 'mdr_device', 'mdr_identity', 'mdr_soc', 'mdm',
  -- Email & Messaging
  'email', 'email_backup', 'email_archive', 'email_dlp', 'email_encryption',
  -- Network & Infrastructure
  'ngfw', 'cspm', 'dns_filter', 'ztna_vpn',
  'vuln_external', 'vuln_internal', 'vuln_scanner', 'asc_external',
  -- Data Protection
  'dlp', 'pii_scan',
  -- Training & Awareness
  'sat',
  -- Professional Services
  'pentest_internal', 'pentest_external', 'vciso', 'security_assessment', 'tabletop'
));
