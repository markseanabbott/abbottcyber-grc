-- SUPABASE_PATCH_042.sql
-- Creates the vendor_directory table for the Vendor Directory module (gov5).
-- Safe: creates new table only. No existing tables are modified.
-- Run manually in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS vendor_directory (
  id              uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id          uuid        NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  vendor_name     text        NOT NULL,
  product_service text,
  website         text,
  category        text        CHECK (category IN (
                                'Cloud Infrastructure','SaaS','Managed Services',
                                'Professional Services','Hardware','Telecom','Other'
                              )),
  contact_name    text,
  contact_email   text,
  status          text        NOT NULL DEFAULT 'Active'
                              CHECK (status IN ('Active','Inactive','Under Review')),
  date_added      date        NOT NULL DEFAULT CURRENT_DATE,
  last_reviewed   date,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_directory_org_id ON vendor_directory(org_id);

CREATE TRIGGER tg_vendor_directory_updated_at
  BEFORE UPDATE ON vendor_directory
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();

ALTER TABLE vendor_directory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_vendor_directory" ON vendor_directory FOR SELECT USING (true);
CREATE POLICY "anon_insert_vendor_directory" ON vendor_directory FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_vendor_directory" ON vendor_directory FOR UPDATE USING (true);
CREATE POLICY "anon_delete_vendor_directory" ON vendor_directory FOR DELETE USING (true);
