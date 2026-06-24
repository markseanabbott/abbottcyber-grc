-- SUPABASE_PATCH_033.sql
-- Rework page_module_map to support many-to-many (page ↔ module).
--
-- BEFORE: page_key was the PRIMARY KEY → one module per page.
-- AFTER:  (page_key, module_id) composite PK → one page can belong to
--         multiple modules. A user gets access to all pages belonging to
--         any module they've been granted.
--
-- Also changes ON DELETE SET NULL → ON DELETE CASCADE: deleting a module
-- removes its page assignments rather than leaving orphaned NULL rows.
--
-- Run manually in the Supabase SQL Editor. Do NOT run automatically.

-- ── 1. Preserve any existing assignments (ignore nulled rows from old SET NULL) ──
CREATE TEMP TABLE _pmm_backup AS
  SELECT page_key, module_id
  FROM page_module_map
  WHERE module_id IS NOT NULL;

-- ── 2. Drop old table (RLS policies and constraints drop with it) ─────────────
DROP TABLE page_module_map;

-- ── 3. Recreate with composite PK and CASCADE delete ─────────────────────────
CREATE TABLE page_module_map (
  page_key  text NOT NULL,
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  PRIMARY KEY (page_key, module_id)
);

-- ── 4. Restore existing assignments ──────────────────────────────────────────
INSERT INTO page_module_map (page_key, module_id)
  SELECT page_key, module_id FROM _pmm_backup;

-- ── 5. Re-enable RLS ─────────────────────────────────────────────────────────
ALTER TABLE page_module_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_all_page_module_map" ON page_module_map
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
