-- SUPABASE_PATCH_032.sql
-- Module Management — three new tables for sellable feature packages.
--
-- modules           — the sellable packages (e.g. "AI Readiness")
-- page_module_map   — maps each app page_key to a module
-- user_module_access — grants a specific user access to a module
--
-- Run manually in the Supabase SQL Editor. Do NOT run automatically.

-- ── modules ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS modules (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  description  text,
  monthly_cost numeric(10,2) NOT NULL DEFAULT 0,
  is_active    boolean     NOT NULL DEFAULT true,
  sort_order   integer     NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_all_modules" ON modules
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER tg_touch_modules
  BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();

-- ── page_module_map ───────────────────────────────────────────────────────────
-- Maps each page key (e.g. 'ai_readiness') to a module.
-- Pages with no row are always accessible to everyone.
CREATE TABLE IF NOT EXISTS page_module_map (
  page_key  text PRIMARY KEY,
  module_id uuid REFERENCES modules(id) ON DELETE SET NULL
);

ALTER TABLE page_module_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_all_page_module_map" ON page_module_map
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── user_module_access ────────────────────────────────────────────────────────
-- Grants a user access to a module. Absence of a row = no access
-- (unless the page has no module assigned at all).
CREATE TABLE IF NOT EXISTS user_module_access (
  user_id    uuid REFERENCES users(id) ON DELETE CASCADE,
  module_id  uuid REFERENCES modules(id) ON DELETE CASCADE,
  granted_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, module_id)
);

ALTER TABLE user_module_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_all_user_module_access" ON user_module_access
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
