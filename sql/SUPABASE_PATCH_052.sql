-- SUPABASE_PATCH_052.sql
-- Ensures tabletop_scenarios has correct RLS policies.
-- PATCH_050 tried CREATE POLICY on a pre-existing table; if those policies
-- already existed the CREATE POLICY failed, leaving RLS enabled but with
-- no active policy — which hides all rows from every query.
-- This patch drops and recreates the policies idempotently.
-- Run in the Supabase SQL Editor. Safe to re-run.

-- Step 1: Enable RLS (idempotent — no-op if already on)
ALTER TABLE tabletop_scenarios ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies so we can recreate them clean
DROP POLICY IF EXISTS "ts_anon_select"  ON tabletop_scenarios;
DROP POLICY IF EXISTS "ts_anon_all"     ON tabletop_scenarios;
DROP POLICY IF EXISTS "ts_auth_select"  ON tabletop_scenarios;
DROP POLICY IF EXISTS "ts_auth_all"     ON tabletop_scenarios;

-- Step 3: Recreate policies — allow all reads and writes
-- (Auth-gating per org is Phase 2)
CREATE POLICY "ts_anon_select" ON tabletop_scenarios
  FOR SELECT TO anon        USING (true);

CREATE POLICY "ts_anon_all"    ON tabletop_scenarios
  FOR ALL    TO anon        USING (true) WITH CHECK (true);

CREATE POLICY "ts_auth_select" ON tabletop_scenarios
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "ts_auth_all"    ON tabletop_scenarios
  FOR ALL    TO authenticated USING (true) WITH CHECK (true);

-- Verification: should return 8 rows (the PATCH_051 seeds)
SELECT id, title, track, status, source_id
FROM tabletop_scenarios
WHERE status = 'published'
ORDER BY created_at;
