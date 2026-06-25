-- SUPABASE_PATCH_040.sql
-- Creates the app_inventory table for the Application Inventory module (gov1).
-- Safe: creates new table only. No existing tables are modified.
-- Run manually in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS app_inventory (
  id                  uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id              uuid        NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  app_name            text        NOT NULL,
  description         text,
  business_owner      text,
  vendor              text,
  hosting_type        text        CHECK (hosting_type IN ('SaaS','Cloud','On-Prem','Hybrid')),
  status              text        NOT NULL DEFAULT 'Active'
                                  CHECK (status IN ('Active','Decommissioned','Under Review')),
  auth_mfa            boolean     NOT NULL DEFAULT false,
  auth_sso            boolean     NOT NULL DEFAULT false,
  data_classification jsonb       NOT NULL DEFAULT '[]'::jsonb,
  date_added          date        NOT NULL DEFAULT CURRENT_DATE,
  last_reviewed       date,
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Index for org-scoped queries
CREATE INDEX IF NOT EXISTS idx_app_inventory_org_id ON app_inventory(org_id);

-- Auto-update updated_at (reuses trigger function from PATCH_002)
CREATE TRIGGER tg_app_inventory_updated_at
  BEFORE UPDATE ON app_inventory
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();

-- RLS (matches pattern from other tables — anon policies active until PATCH_010 auth rollout)
ALTER TABLE app_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_app_inventory" ON app_inventory FOR SELECT USING (true);
CREATE POLICY "anon_insert_app_inventory" ON app_inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_app_inventory" ON app_inventory FOR UPDATE USING (true);
CREATE POLICY "anon_delete_app_inventory" ON app_inventory FOR DELETE USING (true);
