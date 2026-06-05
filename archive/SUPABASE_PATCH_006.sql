-- SUPABASE_PATCH_006.sql
-- Adds cis_goal column to organisation_profiles
-- Stores the client's target CIS Implementation Group level, driving scoring scope and gap reporting
-- Run manually in the Supabase SQL Editor before launching the updated CIS module
-- Safe to run multiple times (IF NOT EXISTS)

ALTER TABLE organisation_profiles
  ADD COLUMN IF NOT EXISTS cis_goal text
  CHECK (cis_goal IN ('ig1', 'ig2', 'ig3'));

COMMENT ON COLUMN organisation_profiles.cis_goal
  IS 'Target CIS Controls v8 Implementation Group for this org. Drives which safeguards are in scope for scoring and gap analysis.';
