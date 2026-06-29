-- SUPABASE_PATCH_050.sql
-- Adds tabletop_scenarios table for the Scenario Builder (backlog: t3)
-- Run in the Supabase SQL Editor. Creates the table, enables RLS,
-- and attaches the existing tg_touch_updated_at() trigger.

CREATE TABLE IF NOT EXISTS tabletop_scenarios (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id       uuid REFERENCES organisations(id) ON DELETE CASCADE,
  title        text NOT NULL,
  industry     text,
  difficulty   text CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  duration     text,
  track        text NOT NULL DEFAULT 'operational',
  summary      text,
  tags         text[],
  declaration  jsonb NOT NULL DEFAULT '{}',
  injects      jsonb NOT NULL DEFAULT '[]',
  status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  source_id    text,
  source_title text,
  created_by   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tabletop_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ts_anon_select" ON tabletop_scenarios
  FOR SELECT TO anon USING (true);

CREATE POLICY "ts_anon_all" ON tabletop_scenarios
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "ts_auth_select" ON tabletop_scenarios
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "ts_auth_all" ON tabletop_scenarios
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER tg_touch_tabletop_scenarios
  BEFORE UPDATE ON tabletop_scenarios
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();
