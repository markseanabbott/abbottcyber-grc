-- SUPABASE_PATCH_039.sql
-- Adds threat_source column to risk_register (r6: Threat Source field).
-- Values: Internal / External / Natural / Third-Party. Nullable — practitioners
-- fill this in per risk; no default applied to avoid misleading existing rows.
-- Run manually in the Supabase SQL Editor. Safe — adds a nullable column only.

ALTER TABLE risk_register
  ADD COLUMN IF NOT EXISTS threat_source text
    CHECK (threat_source IN ('Internal', 'External', 'Natural', 'Third-Party'));
