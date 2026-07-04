-- SUPABASE_PATCH_065.sql
-- Adds curated boolean column to tt_response_cards.
-- Mirrors the curation gate on tt_inject_cards: curated = false = authoring draft,
-- never dealt in a live client session. TB9 hand dealer MUST filter WHERE curated = true.
-- Safe to re-run (IF NOT EXISTS guard). Run BEFORE SEED_TT_RESPONSE_CARDS.sql.

ALTER TABLE public.tt_response_cards
  ADD COLUMN IF NOT EXISTS curated boolean NOT NULL DEFAULT false;
