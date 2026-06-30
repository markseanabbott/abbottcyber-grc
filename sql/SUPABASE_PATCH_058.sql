-- SUPABASE_PATCH_058.sql
-- tt_auto_2 / tt_auto_4: Autonomous tabletop mode timer columns.
-- Adds lobby countdown, inject timer, and speed multiplier fields to tabletop_sessions.
-- Safe: all ADD COLUMN IF NOT EXISTS — no-op if already present.
-- Run manually in the Supabase SQL Editor.

ALTER TABLE tabletop_sessions
  ADD COLUMN IF NOT EXISTS lobby_timer_minutes  integer DEFAULT 10,
  ADD COLUMN IF NOT EXISTS lobby_started_at     timestamptz,
  ADD COLUMN IF NOT EXISTS inject_timer_minutes integer DEFAULT 10,
  ADD COLUMN IF NOT EXISTS timer_multiplier     integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS inject_started_at    timestamptz;
