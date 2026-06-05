-- ============================================================
-- Abbott Cyber GRC Platform — Supabase Patch 004
-- Multiplayer tabletop: unique constraint on role claiming
-- Run in Supabase SQL Editor before using the multiplayer join flow
-- ============================================================

-- Prevent two players from claiming the same role in the same session.
-- The app does an optimistic check first, but this DB constraint is the safety net.
ALTER TABLE tabletop_participants
  ADD CONSTRAINT unique_session_role UNIQUE (session_id, role_id);

-- ============================================================
-- Done. Multiplayer role claiming is now safely enforced.
-- ============================================================
