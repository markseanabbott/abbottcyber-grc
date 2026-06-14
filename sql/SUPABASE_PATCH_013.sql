-- SUPABASE_PATCH_013.sql
-- Platform Settings — singleton row table for platform-wide security configuration
-- Run once in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS platform_settings (
  id                       uuid     PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton                boolean  UNIQUE DEFAULT true,          -- enforces a single row
  session_timeout_minutes  integer  NOT NULL DEFAULT 60,
  password_min_length      integer  NOT NULL DEFAULT 8,
  password_require_upper   boolean  NOT NULL DEFAULT true,
  password_require_number  boolean  NOT NULL DEFAULT true,
  password_require_special boolean  NOT NULL DEFAULT false,
  updated_by               text,
  updated_at               timestamptz DEFAULT now()
);

-- Seed default row
INSERT INTO platform_settings (
  singleton, session_timeout_minutes, password_min_length,
  password_require_upper, password_require_number, password_require_special, updated_by
)
VALUES (true, 60, 8, true, true, false, 'system')
ON CONFLICT (singleton) DO NOTHING;

-- RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read (needed to enforce policy at user-create time)
CREATE POLICY "auth_read_platform_settings"
  ON platform_settings FOR SELECT
  TO authenticated USING (true);

-- Authenticated users can update (app-layer restricts to platform_admin)
CREATE POLICY "auth_update_platform_settings"
  ON platform_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
