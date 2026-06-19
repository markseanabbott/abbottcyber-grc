-- ============================================================
-- SUPABASE_PATCH_021.sql
-- Purpose: Remove all anon RLS policies — authenticated users only
--
-- Run in: Supabase Dashboard → SQL Editor → New Query
--
-- What this does:
--   1. Drops every RLS policy granted to the 'anon' role across
--      ALL tables in the public schema. Uses pg_policies to find
--      them dynamically — catches everything regardless of name.
--   2. Revokes EXECUTE on helper functions from anon.
--   3. Does NOT touch authenticated policies — app continues
--      working normally for logged-in users.
--   4. Does NOT modify any data, tables, or columns.
--
-- Effect:
--   Before: unauthenticated callers with the anon key can read/write
--           all tables directly via the Supabase REST API.
--   After:  anon key returns 0 rows on SELECT, 401 on INSERT/UPDATE.
--           Only users with a valid Supabase Auth session can access data.
--
-- Safe to run: fully reversible (re-add anon policies if needed).
-- ============================================================

-- ── 1. Drop all anon RLS policies (dynamic — catches every table) ──────────

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND roles @> ARRAY['anon']::name[]
    ORDER BY tablename, policyname
  LOOP
    RAISE NOTICE 'Dropping anon policy: % ON %.%', r.policyname, r.schemaname, r.tablename;
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END;
$$;

-- ── 2. Revoke anon execute on all helper/sync functions ────────────────────

REVOKE EXECUTE ON FUNCTION generate_session_code()
  FROM anon;

REVOKE EXECUTE ON FUNCTION get_current_user_role()
  FROM anon;

REVOKE EXECUTE ON FUNCTION get_current_user_org_id()
  FROM anon;

REVOKE EXECUTE ON FUNCTION get_current_user_profile()
  FROM anon;

REVOKE EXECUTE ON FUNCTION sync_cis_poam_to_risk_register(uuid, uuid)
  FROM anon;

REVOKE EXECUTE ON FUNCTION sync_ai_poam_to_risk_register(uuid, uuid, jsonb)
  FROM anon;

-- ── 3. Verify: show remaining policies (should be authenticated only) ───────
--
-- Uncomment and run this SELECT after the patch to confirm:
--
-- SELECT tablename, policyname, roles, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- ============================================================
-- END OF PATCH_021
-- ============================================================
