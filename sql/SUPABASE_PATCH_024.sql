-- SUPABASE_PATCH_024.sql
-- Adds a status column to backlog_items with 4 lifecycle states.
-- Migrates the existing boolean done column to the new status values.
-- Run manually in the Supabase SQL Editor.

ALTER TABLE backlog_items
  ADD COLUMN IF NOT EXISTS status text
    CHECK (status IN ('add','edit','completed','cancelled'))
    DEFAULT 'add';

-- Migrate existing data (only rows not yet assigned a status)
UPDATE backlog_items SET status = 'completed' WHERE done = true  AND status IS NULL;
UPDATE backlog_items SET status = 'add'       WHERE done = false AND status IS NULL;

-- Verify distribution
SELECT status, count(*) AS count FROM backlog_items GROUP BY status ORDER BY status;
