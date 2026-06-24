-- SUPABASE_PATCH_029.sql
-- Three additions to pricing_schedule:
--   1. covers text[]   — other tool_types this SKU satisfies (e.g. Barracuda Premium Plus
--                         covers email + email_backup + email_archive + email_dlp)
--   2. one_time_low    — one-time vendor cost (setup fee, onboarding, engagement fee)
--   3. one_time_high   — upper bound of one-time cost (optional)
--
-- Run manually in the Supabase SQL Editor.

ALTER TABLE pricing_schedule
  ADD COLUMN IF NOT EXISTS covers      text[]  DEFAULT '{}';

ALTER TABLE pricing_schedule
  ADD COLUMN IF NOT EXISTS one_time_low  numeric DEFAULT 0;

ALTER TABLE pricing_schedule
  ADD COLUMN IF NOT EXISTS one_time_high numeric;
