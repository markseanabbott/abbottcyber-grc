-- SUPABASE_PATCH_022.sql
-- Dynamic Backlog Manager: backlog_items table (platform_admin only)
-- Run manually in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS backlog_items (
  id              text        PRIMARY KEY,
  section_id      text        NOT NULL,
  section_title   text        NOT NULL,
  section_phase   integer,
  sort_order      integer     DEFAULT 0,
  text            text        NOT NULL,
  done            boolean     DEFAULT false,
  priority        text,
  notes           text,
  dependencies    jsonb       DEFAULT '[]',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Reuse the existing trigger function from PATCH_003
CREATE TRIGGER tg_backlog_touch
  BEFORE UPDATE ON backlog_items
  FOR EACH ROW EXECUTE PROCEDURE tg_touch_updated_at();

-- RLS: platform_admin role only (checked via users.auth_id)
ALTER TABLE backlog_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "backlog_platform_admin_all"
  ON backlog_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
        AND role = 'platform_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
        AND role = 'platform_admin'
    )
  );
