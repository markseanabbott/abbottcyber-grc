-- SUPABASE_PATCH_063.sql
-- Add entry_card_id and detection_maturity to tt_stories
-- entry_card_id: first inject players see (detection point, not attacker stage-1 card)
-- detection_maturity: 'early'|'mid'|'late' -- difficulty selector for TB11
-- Run in the Supabase SQL Editor BEFORE running SEED_TT_STORIES.sql

ALTER TABLE public.tt_stories
  ADD COLUMN IF NOT EXISTS entry_card_id      text REFERENCES public.tt_inject_cards(id),
  ADD COLUMN IF NOT EXISTS detection_maturity text CHECK (detection_maturity IN ('early','mid','late'));
