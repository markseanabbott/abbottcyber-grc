-- ============================================================
-- SUPABASE_PATCH_016.sql
-- RLS policies for risk_register table.
--
-- risk_register was created in PATCH_014 after PATCH_009 added
-- RLS policies to earlier tables, so it has no policies.
-- If RLS is enabled on this table, all operations are blocked
-- until explicit policies are added.
--
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable RLS (safe to run even if already enabled)
ALTER TABLE risk_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_acceptance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ig_change_log ENABLE ROW LEVEL SECURITY;

-- ─── risk_register policies ───────────────────────────────────────────────────

-- Anon: full access (temporary — matches current posture on other tables)
CREATE POLICY "anon_risk_register_select"
  ON risk_register FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "anon_risk_register_insert"
  ON risk_register FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon_risk_register_update"
  ON risk_register FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "anon_risk_register_delete"
  ON risk_register FOR DELETE
  TO anon
  USING (true);

-- Authenticated: full access (will be tightened to org-scope in PATCH_010)
CREATE POLICY "auth_risk_register_select"
  ON risk_register FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "auth_risk_register_insert"
  ON risk_register FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "auth_risk_register_update"
  ON risk_register FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "auth_risk_register_delete"
  ON risk_register FOR DELETE
  TO authenticated
  USING (true);

-- ─── risk_acceptance_log policies ────────────────────────────────────────────

CREATE POLICY "anon_risk_acceptance_log_all"
  ON risk_acceptance_log FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "auth_risk_acceptance_log_all"
  ON risk_acceptance_log FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── ig_change_log policies ───────────────────────────────────────────────────

CREATE POLICY "anon_ig_change_log_all"
  ON ig_change_log FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "auth_ig_change_log_all"
  ON ig_change_log FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── Grant EXECUTE on sync function to both roles ─────────────────────────────
-- Ensures PostgREST can call the function via /rest/v1/rpc/

GRANT EXECUTE ON FUNCTION sync_cis_poam_to_risk_register(uuid, uuid) TO anon;
GRANT EXECUTE ON FUNCTION sync_cis_poam_to_risk_register(uuid, uuid) TO authenticated;

-- ============================================================
-- END OF PATCH_016
-- ============================================================
