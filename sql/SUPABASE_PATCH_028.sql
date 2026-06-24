-- SUPABASE_PATCH_028.sql
-- Expands tool_type CHECK constraint on pricing_schedule to include 19 new types
-- Drops the old inline constraint (system-named) and recreates as a named constraint
--
-- Run manually in the Supabase SQL Editor.

ALTER TABLE pricing_schedule
  DROP CONSTRAINT IF EXISTS pricing_schedule_tool_type_check;

ALTER TABLE pricing_schedule
  ADD CONSTRAINT pricing_schedule_tool_type_check
  CHECK (tool_type IN (
    -- Identity & Access
    'mfa', 'pam',
    -- Endpoint & Detection
    'edr', 'mdr_device', 'mdr_identity', 'mdr_soc',
    -- Email & Messaging
    'email', 'email_backup', 'email_archive', 'email_dlp', 'email_encryption',
    -- Network & Infrastructure
    'ngfw', 'cspm', 'vuln_scanner', 'vuln_external', 'vuln_internal', 'asc_external',
    -- Data Protection
    'dlp', 'pii_scan',
    -- Training & Awareness
    'sat',
    -- Professional Services
    'pentest_internal', 'pentest_external', 'vciso', 'security_assessment', 'tabletop'
  ));
