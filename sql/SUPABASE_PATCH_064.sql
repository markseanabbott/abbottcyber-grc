-- SUPABASE_PATCH_064.sql
-- Adds curated boolean column to tt_inject_cards
-- curated = false (default) = draft, not eligible for live client sessions
-- curated = true = reviewed by Mark, eligible for use by the TB5 card picker
-- TB5 card picker MUST filter WHERE curated = true (enforced requirement)
-- Run this BEFORE running SEED_TT_INJECT_BODIES.sql
-- Safe to re-run (ADD COLUMN IF NOT EXISTS).

ALTER TABLE public.tt_inject_cards
  ADD COLUMN IF NOT EXISTS curated boolean NOT NULL DEFAULT false;
