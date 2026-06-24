-- SUPABASE_PATCH_030.sql
-- Adds one_time_model to pricing_schedule so one-time costs can be
-- flat (fixed), per user, or per device/endpoint — matching the recurring rate model.
--
-- Run manually in the Supabase SQL Editor.

ALTER TABLE pricing_schedule
  ADD COLUMN IF NOT EXISTS one_time_model text DEFAULT 'fixed'
  CHECK (one_time_model IN ('fixed', 'perUser', 'perEndpoint'));
