-- SUPABASE_PATCH_037.sql
-- Creates ai_org_tools table: per-org AI tool inventory.
-- Each org builds their own list of AI tools in use — selecting from the seeded
-- catalog (ai_tool_catalog) or adding fully custom tools not in the catalog.
-- Status tracks whether each tool is approved, conditional, flagged, or Shadow IT.
-- Run in Supabase SQL Editor. No destructive changes.

CREATE TABLE IF NOT EXISTS ai_org_tools (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  tool_catalog_id   uuid REFERENCES ai_tool_catalog(id),   -- null for custom tools
  is_custom         boolean DEFAULT false,
  -- Custom tool fields (used when tool_catalog_id is null):
  custom_name       text,
  custom_vendor     text,
  custom_category   text,
  custom_data_scope text[],
  -- Org-specific fields:
  org_status        text CHECK (org_status IN (
                      'approved','conditional','not_approved','shadow_it'
                    )) DEFAULT 'shadow_it',
  notes             text,
  added_by          text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  -- Prevent the same catalog tool being added twice per org:
  UNIQUE(org_id, tool_catalog_id)
);

CREATE OR REPLACE FUNCTION tg_touch_ai_org_tools()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_ai_org_tools_updated ON ai_org_tools;
CREATE TRIGGER trg_ai_org_tools_updated
  BEFORE UPDATE ON ai_org_tools
  FOR EACH ROW EXECUTE FUNCTION tg_touch_ai_org_tools();

ALTER TABLE ai_org_tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_ai_org_tools"  ON ai_org_tools;
DROP POLICY IF EXISTS "anon_write_ai_org_tools" ON ai_org_tools;
DROP POLICY IF EXISTS "auth_all_ai_org_tools"   ON ai_org_tools;

CREATE POLICY "anon_read_ai_org_tools"  ON ai_org_tools FOR SELECT TO anon  USING (true);
CREATE POLICY "anon_write_ai_org_tools" ON ai_org_tools FOR ALL    TO anon  USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_ai_org_tools"   ON ai_org_tools FOR ALL    TO authenticated USING (true) WITH CHECK (true);
