-- SUPABASE_PATCH_043.sql
-- Adds department field to app_inventory and ai_org_tools tables (gov9).
-- Safe: adds nullable columns only. No existing data is modified.
-- Departments are free-text per row; autocomplete suggestions are derived
-- from existing entries for that org (no separate departments table needed).
-- Run manually in the Supabase SQL Editor.

ALTER TABLE app_inventory
  ADD COLUMN IF NOT EXISTS department text;

ALTER TABLE ai_org_tools
  ADD COLUMN IF NOT EXISTS department text;
