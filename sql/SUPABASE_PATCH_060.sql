-- SUPABASE_PATCH_060.sql
-- t34a: Add ir_comparison column to tabletop_sessions.
-- Stores the parsed JSON result from the manual IR plan vs exercise comparison.
-- Safe: IF NOT EXISTS — no-op if already present.
-- Run manually in the Supabase SQL Editor.

ALTER TABLE tabletop_sessions
  ADD COLUMN IF NOT EXISTS ir_comparison jsonb;
