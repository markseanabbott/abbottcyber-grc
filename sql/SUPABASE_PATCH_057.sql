-- SUPABASE_PATCH_057.sql
-- ex1: Add exercise_score column to tabletop_sessions.
-- Stores the computed 0-100 objective score at session completion.
-- Safe: IF NOT EXISTS — no-op if already added manually.
-- Run manually in the Supabase SQL Editor.

ALTER TABLE tabletop_sessions
  ADD COLUMN IF NOT EXISTS exercise_score integer;
