-- SUPABASE_PATCH_026.sql
-- Adds ma_pricing JSONB column to organisation_profiles
-- Stores per-org M&A tooling price overrides (SKU names + rates)
-- Resolution chain in app: Father org → Grandfather org → hardcoded MA_TOOLING defaults
--
-- Run manually in the Supabase SQL Editor. Safe — adds a nullable column only.

ALTER TABLE organisation_profiles
  ADD COLUMN IF NOT EXISTS ma_pricing jsonb;

COMMENT ON COLUMN organisation_profiles.ma_pricing IS
  'Per-org M&A tooling price catalog. Grandfather (MSP) sets SKU names + rates for their portfolio. Father orgs can override per-tool. Structure: { "I1": { "name": "Duo (Pax8)", "model": "perUser", "low": 30, "high": 48 }, ... }';
