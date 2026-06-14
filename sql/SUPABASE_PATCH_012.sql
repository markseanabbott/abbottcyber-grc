-- SUPABASE_PATCH_012.sql
-- Purpose: Module-level access control for analyst and viewer users.
--          Adds module_access jsonb column to users table.
-- Run in: Supabase Dashboard → SQL Editor

-- Adds a module_access jsonb column to users.
-- platform_admin and org_admin ignore this column entirely (full access always).
-- For analyst and viewer:
--   NULL          = full access (no restrictions — existing users unaffected)
--   { "assessments": true, "ai": false, ... } = explicit per-module grant
-- Keys: assessments | ai | risk | exercises | reports
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS module_access jsonb;

-- ============================================================
-- END OF PATCH_012
-- ============================================================
