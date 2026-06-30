-- SUPABASE_PATCH_055.sql
-- Adds tabletop_action_items table for AAR action item tracking (t35).
-- Run manually in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS tabletop_action_items (
  id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id         uuid REFERENCES tabletop_sessions(id) ON DELETE CASCADE NOT NULL,
  org_id             uuid REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
  description        text NOT NULL,
  owner              text NOT NULL DEFAULT '',
  due_date           date,
  priority           text NOT NULL DEFAULT 'High'
                       CHECK (priority IN ('Critical','High','Medium','Low')),
  status             text NOT NULL DEFAULT 'open'
                       CHECK (status IN ('open','in_progress','closed')),
  source_inject_idx  integer,   -- 0-based index into scenario.injects
  notes              text NOT NULL DEFAULT '',
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on row change
CREATE TRIGGER tg_touch_action_items
  BEFORE UPDATE ON tabletop_action_items
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();

-- RLS (matching pattern from other tabletop tables)
ALTER TABLE tabletop_action_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all" ON tabletop_action_items
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "auth_all" ON tabletop_action_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
