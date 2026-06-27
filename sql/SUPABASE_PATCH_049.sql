-- SUPABASE_PATCH_049.sql
-- Tabletop Engine: reusable scenario framework
-- Adds: tabletop_scenarios table (custom scenario storage)
--       Adds mode, scenario_db_id, inject_path, rubric_scores to tabletop_sessions
-- Safe: CREATE TABLE IF NOT EXISTS + ALTER TABLE ADD COLUMN IF NOT EXISTS
-- Run manually in Supabase SQL Editor.

-- ─── NEW TABLE: tabletop_scenarios ───────────────────────────────────────────
-- Stores custom scenario definitions created by the facilitator (Mark).
-- Built-in scenarios (ransomware, BEC, etc.) remain in code (TT_SCENARIOS).
-- This table is for new scenarios created via the scenario builder UI (next phase).

CREATE TABLE IF NOT EXISTS tabletop_scenarios (
  id                 uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id             uuid        REFERENCES organisations(id) ON DELETE CASCADE,
  track              text        NOT NULL DEFAULT 'operational'
                                 CHECK (track IN ('operational','ai_governance','executive','vendor','bcdr')),
  title              text        NOT NULL,
  description        text,
  difficulty         text        CHECK (difficulty IN ('Easy','Medium','Hard','Introductory','Intermediate','Advanced')),
  industry_tags      text[]      DEFAULT '{}',
  duration_mins      integer,
  opening_context    text,
  declaration_config jsonb,                       -- { ingest, source, raw, correctSeverity, correctDeclare }
  roles              jsonb       NOT NULL DEFAULT '[]',
  injects            jsonb       NOT NULL DEFAULT '[]',  -- inject nodes with branches[]
  decision_gates     jsonb       DEFAULT '[]',
  notification_items jsonb       DEFAULT '[]',
  rubric_dimensions  jsonb       DEFAULT '[]',
  is_shared          boolean     NOT NULL DEFAULT true,  -- visible to all orgs in scope
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE TRIGGER tg_tabletop_scenarios_updated_at
  BEFORE UPDATE ON tabletop_scenarios
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();

-- RLS (match existing tabletop table policies — open anon for now)
ALTER TABLE tabletop_scenarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tabletop_scenarios" ON tabletop_scenarios;
CREATE POLICY "anon_select_tabletop_scenarios"
  ON tabletop_scenarios FOR SELECT USING (true);

DROP POLICY IF EXISTS "anon_insert_tabletop_scenarios" ON tabletop_scenarios;
CREATE POLICY "anon_insert_tabletop_scenarios"
  ON tabletop_scenarios FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tabletop_scenarios" ON tabletop_scenarios;
CREATE POLICY "anon_update_tabletop_scenarios"
  ON tabletop_scenarios FOR UPDATE USING (true);

DROP POLICY IF EXISTS "anon_delete_tabletop_scenarios" ON tabletop_scenarios;
CREATE POLICY "anon_delete_tabletop_scenarios"
  ON tabletop_scenarios FOR DELETE USING (true);

-- ─── ALTER tabletop_sessions ─────────────────────────────────────────────────
ALTER TABLE tabletop_sessions
  -- 'local' = facilitator controls one screen; 'remote' = session code + participant devices
  ADD COLUMN IF NOT EXISTS mode           text DEFAULT 'local'
    CHECK (mode IN ('local','remote')),

  -- FK to tabletop_scenarios for custom scenarios (NULL for built-in hard-coded scenarios)
  ADD COLUMN IF NOT EXISTS scenario_db_id uuid REFERENCES tabletop_scenarios(id) ON DELETE SET NULL,

  -- Path taken through inject graph: [{index, branchTaken}]
  -- Enables AAR replay and "choose your own adventure" tracking
  ADD COLUMN IF NOT EXISTS inject_path    jsonb DEFAULT '[]',

  -- Facilitator rubric scores post-exercise: {dimensionId: {score, notes}}
  ADD COLUMN IF NOT EXISTS rubric_scores  jsonb;
