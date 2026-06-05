-- ============================================================
-- Abbott Cyber GRC Platform — Patch 001
-- Adds platform tier, fixes parent_id links throughout
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Update the tier check constraint to include 'platform'
ALTER TABLE organisations
  DROP CONSTRAINT IF EXISTS organisations_tier_check;

ALTER TABLE organisations
  ADD CONSTRAINT organisations_tier_check
  CHECK (tier IN ('platform', 'grandfather', 'father', 'child'));

-- 2. Insert Abbott Cyber as the platform owner
--    (skip if already exists)
INSERT INTO organisations (id, name, tier, parent_id, industry)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Abbott Cyber Consulting',
  'platform',
  NULL,
  'Cybersecurity Consulting'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Link existing grandfather to platform owner
UPDATE organisations
SET parent_id = '00000000-0000-0000-0000-000000000000'
WHERE tier = 'grandfather'
  AND parent_id IS NULL;

-- 4. Verify parent links are correct for all tiers
--    Father → Grandfather, Child → Father
--    (these should already be set from seed, this just confirms)
--    Run this SELECT to check — should return 0 rows if all good:
SELECT id, name, tier, parent_id
FROM organisations
WHERE
  (tier = 'grandfather' AND parent_id IS NULL)
  OR (tier = 'father'      AND parent_id IS NULL)
  OR (tier = 'child'       AND parent_id IS NULL);

-- 5. Show the full hierarchy to confirm
SELECT
  o.name,
  o.tier,
  p.name AS parent_name,
  p.tier AS parent_tier
FROM organisations o
LEFT JOIN organisations p ON o.parent_id = p.id
ORDER BY
  CASE o.tier
    WHEN 'platform'     THEN 1
    WHEN 'grandfather'  THEN 2
    WHEN 'father'       THEN 3
    WHEN 'child'        THEN 4
  END,
  o.name;

-- ============================================================
-- Expected result:
-- Abbott Cyber Consulting  | platform     | (null)          | (null)
-- Abbott Cyber MSP         | grandfather  | Abbott Cyber... | platform
-- Hospitality Group        | father       | Abbott Cyber MSP| grandfather
-- Tech & SaaS Clients      | father       | Abbott Cyber MSP| grandfather
-- CloudStack Inc.          | child        | Tech & SaaS...  | father
-- Harbour Inn & Suites     | child        | Hospitality...  | father
-- The Grand Hotel          | child        | Hospitality...  | father
-- ============================================================
