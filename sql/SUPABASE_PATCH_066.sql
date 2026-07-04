-- SUPABASE_PATCH_066.sql
-- Add authenticated UPDATE / INSERT RLS policies for curator tables.
--
-- Root cause: tt_inject_cards and tt_response_cards only had anon SELECT policies
-- (see PATCH_061). Without an UPDATE policy for the authenticated role, PostgREST
-- accepts the PATCH request but RLS discards the write — 0 rows updated, no error.
-- This is why the Inject Card Curator "curated" toggle and the Response Card Curator
-- saves appeared to work but were lost on reload.
--
-- Run in the Supabase SQL Editor.
-- Safe to re-run (DROP IF EXISTS before each CREATE).

-- ── tt_inject_cards ───────────────────────────────────────────────────────────
-- Authenticated users (Platform Admin) can flip the curated flag and edit bodies.

DROP POLICY IF EXISTS "auth_update_tt_inject_cards" ON public.tt_inject_cards;
CREATE POLICY "auth_update_tt_inject_cards"
  ON public.tt_inject_cards
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── tt_response_cards ─────────────────────────────────────────────────────────
-- Authenticated users can update appropriateness / curated and insert new cards
-- via the Response Card Curator "Add card" modal.

DROP POLICY IF EXISTS "auth_update_tt_response_cards" ON public.tt_response_cards;
CREATE POLICY "auth_update_tt_response_cards"
  ON public.tt_response_cards
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_tt_response_cards" ON public.tt_response_cards;
CREATE POLICY "auth_insert_tt_response_cards"
  ON public.tt_response_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
