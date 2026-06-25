-- SUPABASE_PATCH_036.sql
-- Creates ai_risk_register table for AI-specific risk tracking.
-- Separate from the main risk_register; uses AI-prefixed IDs (AI-001, AI-002…).
-- risk_seq is per-org sequential; auto-assigned in the app layer via MAX(risk_seq)+1.
-- Run in Supabase SQL Editor. No destructive changes.

CREATE TABLE IF NOT EXISTS ai_risk_register (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id               uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  risk_seq             integer NOT NULL,            -- per-org sequence: 1, 2, 3…
  category             text,
  ai_tool_catalog_id   uuid REFERENCES ai_tool_catalog(id),
  ai_system_custom     text,                        -- free text when not in catalog
  vendor               text,
  data_classification  text,
  human_in_loop        boolean DEFAULT false,
  likelihood           text CHECK (likelihood IN ('Low','Medium','High','Critical')),
  impact               text CHECK (impact IN ('Low','Medium','High','Critical')),
  rating               text CHECK (rating IN ('Low','Medium','High','Critical')),
  status               text CHECK (status IN ('Open','In Progress','Closed')) DEFAULT 'Open',
  nist_controls        text[],
  iso_controls         text[],
  notes                text,
  source               text CHECK (source IN ('manual','ai_assessment')) DEFAULT 'manual',
  created_by           text,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now(),
  UNIQUE(org_id, risk_seq)
);

CREATE OR REPLACE FUNCTION tg_touch_ai_risk_register()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_ai_risk_register_updated ON ai_risk_register;
CREATE TRIGGER trg_ai_risk_register_updated
  BEFORE UPDATE ON ai_risk_register
  FOR EACH ROW EXECUTE FUNCTION tg_touch_ai_risk_register();

ALTER TABLE ai_risk_register ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_ai_risk_register"  ON ai_risk_register;
DROP POLICY IF EXISTS "anon_write_ai_risk_register" ON ai_risk_register;
DROP POLICY IF EXISTS "auth_all_ai_risk_register"   ON ai_risk_register;

CREATE POLICY "anon_read_ai_risk_register"  ON ai_risk_register FOR SELECT TO anon  USING (true);
CREATE POLICY "anon_write_ai_risk_register" ON ai_risk_register FOR ALL    TO anon  USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_ai_risk_register"   ON ai_risk_register FOR ALL    TO authenticated USING (true) WITH CHECK (true);
