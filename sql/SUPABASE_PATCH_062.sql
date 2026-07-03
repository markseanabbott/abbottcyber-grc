-- SUPABASE_PATCH_062.sql
-- Fix nist_phase_idx on all IR archetype inject cards in tt_inject_cards
-- Corrected mapping:
--   Ransomware (6 stages): 1-2 = Detect/Analyze, 3-4 = Contain, 5-6 = Eradicate
--   BEC        (5 stages): 1-2 = Detect/Analyze, 3-4 = Contain, 5   = Eradicate
--   Insider    (5 stages): 1-2 = Detect/Analyze, 3   = Contain, 4-5 = Eradicate
--   Vendor     (5 stages): 1-2 = Detect/Analyze, 3   = Contain, 4-5 = Eradicate
-- Recover (4) and Post-Incident (5) are exercised in the post-terminal wrap-up round (TB10b).
-- Run in the Supabase SQL Editor.

UPDATE public.tt_inject_cards
SET
  nist_phase_idx = CASE
    -- Ransomware: stages 1-2 Detect, 3-4 Contain, 5-6 Eradicate
    WHEN archetype = 'ransomware' AND chain_stage <= 2 THEN 1
    WHEN archetype = 'ransomware' AND chain_stage <= 4 THEN 2
    WHEN archetype = 'ransomware' AND chain_stage >= 5 THEN 3
    -- BEC: stages 1-2 Detect, 3-4 Contain, 5 Eradicate
    WHEN archetype = 'bec' AND chain_stage <= 2 THEN 1
    WHEN archetype = 'bec' AND chain_stage <= 4 THEN 2
    WHEN archetype = 'bec' AND chain_stage =  5 THEN 3
    -- Insider: stages 1-2 Detect, 3 Contain, 4-5 Eradicate
    WHEN archetype = 'insider' AND chain_stage <= 2 THEN 1
    WHEN archetype = 'insider' AND chain_stage =  3 THEN 2
    WHEN archetype = 'insider' AND chain_stage >= 4 THEN 3
    -- Vendor Compromise: stages 1-2 Detect, 3 Contain, 4-5 Eradicate
    WHEN archetype = 'vendor_compromise' AND chain_stage <= 2 THEN 1
    WHEN archetype = 'vendor_compromise' AND chain_stage =  3 THEN 2
    WHEN archetype = 'vendor_compromise' AND chain_stage >= 4 THEN 3
    ELSE nist_phase_idx
  END,
  updated_at = now()
WHERE archetype IN ('ransomware', 'bec', 'insider', 'vendor_compromise');