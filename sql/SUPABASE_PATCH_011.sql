-- SUPABASE_PATCH_011.sql
-- Adds audit_log table for tracking user, assessment, TPRA, org, and POAM changes.
-- Events are stored for up to 90 days (UI enforces the window; no automatic purge is configured).
-- Run manually in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS audit_log (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id       uuid REFERENCES organisations(id) ON DELETE SET NULL,
  actor_name   text,
  actor_email  text,
  event_type   text NOT NULL,
  target_type  text,   -- 'user' | 'assessment' | 'tpra' | 'org' | 'poam'
  target_name  text,
  details      jsonb,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_log_org_id_idx    ON audit_log (org_id);
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log (created_at DESC);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Anon read (will be restricted in a later patch once auth is fully enforced)
CREATE POLICY "audit_log_anon_select" ON audit_log
  FOR SELECT TO anon USING (true);

CREATE POLICY "audit_log_anon_insert" ON audit_log
  FOR INSERT TO anon WITH CHECK (true);

-- Authenticated users: full access (RLS on other tables gates what data is visible)
CREATE POLICY "audit_log_auth_all" ON audit_log
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
