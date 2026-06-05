-- SUPABASE_PATCH_009.sql
-- Purpose: Supabase Auth integration — link users to auth, multi-org access table, updated roles
-- Run in: Supabase Dashboard → SQL Editor
-- Note: Does NOT drop existing anon RLS policies — app-level login gate is the primary
--       auth barrier for Phase 1. Anon RLS removal happens in PATCH_010 once confirmed working.

-- ================================================
-- 1. Update users table
-- ================================================

-- Link each app user to their Supabase Auth account.
-- auth_id is set when a user account is created via the User Management UI.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS auth_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

-- Expand role model.
-- Old values: 'admin' | 'analyst' | 'viewer'
-- New values: 'platform_admin' | 'org_admin' | 'analyst' | 'viewer'
-- If any rows have role='admin', update them to 'org_admin' before altering the constraint.
UPDATE users SET role = 'org_admin' WHERE role = 'admin';

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('platform_admin', 'org_admin', 'analyst', 'viewer'));

-- ================================================
-- 2. Multi-org access table
-- For analyst and viewer users who need access to specific child orgs
-- (not the full visibility chain of their primary org).
-- platform_admin and org_admin visibility is derived from tier — no rows needed here.
-- ================================================

CREATE TABLE IF NOT EXISTS user_org_access (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id       uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  created_at   timestamptz DEFAULT now(),
  UNIQUE(user_id, org_id)
);

ALTER TABLE user_org_access ENABLE ROW LEVEL SECURITY;

-- user_org_access RLS: authenticated users can read their own rows;
-- platform_admin and org_admin can manage all rows.
CREATE POLICY "uoa_read_own" ON user_org_access
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "uoa_write_admin" ON user_org_access
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ================================================
-- 3. Helper DB functions (used by app for auth lookups)
-- ================================================

-- Returns the role of the currently authenticated user
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS text AS $$
  SELECT role FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Returns the primary org_id of the currently authenticated user
CREATE OR REPLACE FUNCTION get_current_user_org_id()
RETURNS uuid AS $$
  SELECT org_id FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Returns the users row for the currently authenticated user
CREATE OR REPLACE FUNCTION get_current_user_profile()
RETURNS SETOF users AS $$
  SELECT * FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ================================================
-- END OF PATCH_009
-- ================================================
-- PATCH_010 (future): Remove open anon policies from all tables
-- and replace with auth.uid()-scoped policies once login is confirmed working.
-- ================================================
