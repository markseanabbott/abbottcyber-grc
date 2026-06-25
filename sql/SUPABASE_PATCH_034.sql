-- SUPABASE_PATCH_034.sql
-- Adds dashboard_config jsonb column to organisation_profiles.
-- Stores per-org custom dashboard widget layout: enabled widgets, order, and width.
-- Structure: { "widgets": [{ "id": "cis", "width": 2, "priority": 1 }, ...] }
-- Run manually in the Supabase SQL Editor. No destructive changes.

ALTER TABLE organisation_profiles
  ADD COLUMN IF NOT EXISTS dashboard_config jsonb;
