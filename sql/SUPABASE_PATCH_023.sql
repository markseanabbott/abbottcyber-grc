-- SUPABASE_PATCH_023.sql
-- Adds device count, user count, and primary MSP fields to organisation_profiles
-- Run manually in Supabase SQL Editor

ALTER TABLE organisation_profiles
  ADD COLUMN IF NOT EXISTS approx_device_count integer,
  ADD COLUMN IF NOT EXISTS approx_user_count   integer,
  ADD COLUMN IF NOT EXISTS primary_msp         text;

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'organisation_profiles'
  AND column_name IN ('approx_device_count','approx_user_count','primary_msp');
