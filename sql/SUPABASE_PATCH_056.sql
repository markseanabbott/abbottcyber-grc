-- SUPABASE_PATCH_056.sql
-- Links tabletop action items to the risk register (t36).
-- Run manually in Supabase SQL Editor.

-- 1. Extend the risk_register source CHECK to include 'tabletop'
ALTER TABLE risk_register DROP CONSTRAINT IF EXISTS risk_register_source_check;
ALTER TABLE risk_register ADD CONSTRAINT risk_register_source_check
  CHECK (source IN ('cis_poam', 'manual', 'tpra', 'ai_poam', 'tabletop'));

-- 2. Track push state on each action item
ALTER TABLE tabletop_action_items
  ADD COLUMN IF NOT EXISTS pushed_to_rr  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rr_entry_id   uuid REFERENCES risk_register(id) ON DELETE SET NULL;
