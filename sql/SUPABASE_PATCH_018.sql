-- ============================================================
-- SUPABASE_PATCH_018.sql
-- Add authenticated RLS policies to tables that only have anon policies.
--
-- Root cause: PATCH_009 added auth (Supabase Auth integration), so
-- authenticated users now send a user JWT in the Authorization header.
-- PostgREST resolves this to the `authenticated` role. Tables with
-- only `TO anon` policies block all authenticated writes/reads.
-- This patch mirrors the existing anon policies for authenticated users.
--
-- Tables NOT covered here (already have authenticated policies):
--   risk_register        ← PATCH_016
--   user_org_access      ← PATCH_009
--   framework_notes      ← PATCH_010
--   (ai readiness tables) ← PATCH_011 / PATCH_013
--
-- Tables with no RLS at all (leave untouched — all roles have access):
--   cis_safeguard_notes, cis_poam_items
--
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================


-- ─── 1. organisations ─────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "auth full access orgs" ON organisations;
CREATE POLICY "auth full access orgs"
  ON organisations FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ─── 2. users ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "auth full access users" ON users;
CREATE POLICY "auth full access users"
  ON users FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ─── 3. assessments ───────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "auth full access assessments" ON assessments;
CREATE POLICY "auth full access assessments"
  ON assessments FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ─── 4. tabletop_sessions ─────────────────────────────────────────────────────

DROP POLICY IF EXISTS "auth full access tt_sessions" ON tabletop_sessions;
CREATE POLICY "auth full access tt_sessions"
  ON tabletop_sessions FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ─── 5. tabletop_participants ─────────────────────────────────────────────────

DROP POLICY IF EXISTS "auth full access tt_participants" ON tabletop_participants;
CREATE POLICY "auth full access tt_participants"
  ON tabletop_participants FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ─── 6. tabletop_responses ────────────────────────────────────────────────────

DROP POLICY IF EXISTS "auth full access tt_responses" ON tabletop_responses;
CREATE POLICY "auth full access tt_responses"
  ON tabletop_responses FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ─── 7. tabletop_notif_checks ─────────────────────────────────────────────────

DROP POLICY IF EXISTS "auth full access tt_notif" ON tabletop_notif_checks;
CREATE POLICY "auth full access tt_notif"
  ON tabletop_notif_checks FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ─── 8. techstack_responses ───────────────────────────────────────────────────

DROP POLICY IF EXISTS "auth full access techstack_responses" ON techstack_responses;
CREATE POLICY "auth full access techstack_responses"
  ON techstack_responses FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ─── 9. organisation_profiles ─────────────────────────────────────────────────

DROP POLICY IF EXISTS "auth full access org_profiles" ON organisation_profiles;
CREATE POLICY "auth full access org_profiles"
  ON organisation_profiles FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ─── VERIFICATION ─────────────────────────────────────────────────────────────
-- After running, confirm policies exist:
--
-- SELECT schemaname, tablename, policyname, roles, cmd
-- FROM pg_policies
-- WHERE roles @> ARRAY['authenticated']
-- ORDER BY tablename;
--
-- Should show all 9 tables above plus the ones already covered
-- (risk_register, user_org_access, framework_notes, etc.).
--
-- Then reload the app and retry the tech stack save — should succeed.
-- ============================================================
-- END OF PATCH_018
-- ============================================================
