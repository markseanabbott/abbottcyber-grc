-- SYNC_BACKLOG_PART_3.sql -- items 81-120 of 396
-- Run all 10 parts. Safe to re-run.

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth16', 'auth', 'Authentication & User Management', 1, 15, 'Self-service password reset â€” allow users to reset their own password from the login screen (Supabase Auth email reset flow) or from their profile in-app. Reduces admin burden for password management.', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth17', 'auth', 'Authentication & User Management', 1, 16, 'Dedicated Audit Log Viewer (Platform Admin) â€” standalone page in Platform Admin nav showing platform-wide activity from audit_log table. Login events captured at auth time. Filterable by event type, date range, and actor email. Color-coded event badges, day-grouped rows, click-to-expand details JSON. Stats strip: total events, logins, unique actors, deletes.', true, 'High', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('blm2', 'auth', 'Authentication & User Management', 1, 17, 'Backlog Manager status tabs â€” 4 lifecycle states (Add / Edit / Completed / Cancelled) replacing the binary done/pending toggle; per-status pill tabs with live counts, item rows styled by status, inline status select dropdown', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux1', 'auth', 'Authentication & User Management', 1, 18, 'American spelling standardization â€” all user-facing display text (labels, headings, nav, toasts) changed from Organisation to Organization throughout. JS variables, CSS classes, Supabase names unchanged.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux2', 'auth', 'Authentication & User Management', 1, 19, 'Admin consolidation â€” removed Organization Manager and User Management from avatar dropdown; added both as nav items inside Settings sidebar section (platform admin gated). Settings is the single admin entry point.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux3', 'auth', 'Authentication & User Management', 1, 20, 'Exercises hub â€” collapsed sidebar from 6 sub-items to single Exercises nav item. Clicking loads a card grid hub (same layout as Assessments). Cards: Exercise Hub, Tabletop Operational, Tabletop AI, Tabletop Executive/Vendor/BCDR (coming soon). Navigates to existing views.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux4', 'auth', 'Authentication & User Management', 1, 21, 'AI Readiness absorbed into Assessments hub â€” removed as standalone sidebar section. Added as a card in ASSESSMENT_CATALOG with AI badge. Hub button navigates to existing ai_readiness view. Internal sub-page routes unchanged.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod1', 'auth', 'Authentication & User Management', 1, 22, 'Module Management â€” sellable feature package system. PATCH_032.sql creates modules, page_module_map, user_module_access tables. Admin page (Settings sidebar, platform admin only) with 2 tabs: (1) Modules CRUD table + Add/Edit modal, seed AI Readiness on first load; (2) Page Access tree with module dropdown per nav page, saves to page_module_map.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod2', 'auth', 'Authentication & User Management', 1, 23, 'Module access enforcement â€” nav hiding, page load guard, and hub card gating driven by page_module_map + user_module_access tables. Platform admin bypasses all checks. modAccessLoad() runs at boot and on view-as changes.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod3', 'auth', 'Authentication & User Management', 1, 24, 'Module access in Edit User modal â€” add Module Access section below role field. List all active modules as toggles (name, description, cost). Toggle reads from and writes to user_module_access on form save.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux5', 'auth', 'Authentication & User Management', 1, 25, 'Getting Started banner â€” data-driven checklist on Dashboard: Organization Profile (employee_count_band populated) + Technology Stack (techstack assessment run). Amber left-border panel, disappears when both complete.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux6', 'auth', 'Authentication & User Management', 1, 26, 'Governance hub â€” replaced Risk & Vendors + Policies nav sections. Single Governance sidebar item loads card grid: Risk Register, Policy Library, Application Inventory (soon), Vendor Directory (soon). Note in code: Vendor Directory links to TPRA via vendor_directory_id FK on vendor_assessments.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux7', 'auth', 'Authentication & User Management', 1, 27, 'TPRA moved to Assessments hub â€” card in ASSESSMENT_CATALOG with noScore:true flag (no score dot, shows View Assessments button). Start Here retired â€” company_profile moved to Settings sidebar as Organization Profile.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod4', 'auth', 'Authentication & User Management', 1, 28, 'page_module_map many-to-many â€” composite PK (page_key, module_id). A page can belong to multiple modules. PATCH_033 drops old single-PK table and recreates it.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod5', 'auth', 'Authentication & User Management', 1, 29, 'Edit User â€” remove hardcoded Section Access; Module Access section driven by modules table. When a new module is added in Module Management it automatically appears as a toggle in Edit User. module_access JSON column on users always written as null to clear legacy restrictions.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod6', 'auth', 'Authentication & User Management', 1, 30, 'PAGE_REGISTRY in modules.js â€” static list of all 21 routable pages grouped by section (Home, Assessments, AI Readiness, Governance, Exercises, Reports, M&A). modGetPages() returns PAGE_REGISTRY directly instead of deriving from NAV. Page Access tab now shows individual pages, not just hub-level items.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod7', 'auth', 'Authentication & User Management', 1, 31, 'Edit Module modal â€” widened from 480px to 620px; description textarea taller (4 rows, min-height 80px).', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod8', 'auth', 'Authentication & User Management', 1, 32, 'hasPageAccess() whitelist mode â€” users with any module grants can ONLY access pages in their granted modules. Unassigned pages are blocked for grant-restricted users. Users with no grants are unrestricted. Org admins bypass module gating.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod9', 'auth', 'Authentication & User Management', 1, 33, 'Platform Admin nav section â€” Module Management and Feature Backlog moved from Settings into a dedicated g_platform group (platformAdminOnly: true, no tierOnly items). Org admins at grandfather/father tiers can no longer access these via the pricing_schedule tierOnly loophole.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod10', 'auth', 'Authentication & User Management', 1, 34, 'PAGE_REGISTRY â€” 21 routable pages listed by section (Home, Assessments, AI Readiness, Governance, Exercises, Reports, M&A). modGetPages() returns PAGE_REGISTRY instead of NAV items. Page Access tab now shows individual pages not just hub-level items.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod11', 'auth', 'Authentication & User Management', 1, 35, 'Add/Edit Module modal padding â€” content was flush with modal edges. Added 1.5rem padding wrapper. Description textarea increased to 4 rows with min-height 80px. Modal widened from 480px to 620px.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod12', 'auth', 'Authentication & User Management', 1, 36, 'hasPageAccess() â€” use PAGE_REGISTRY as module gate boundary. Pages not in PAGE_REGISTRY (Settings, admin tools) bypass module gating entirely and are controlled by adminOnly/platformAdminOnly flags only. Removed org_admin role bypass â€” org admins at client orgs are now module-restricted like all other users. Only platform_admin is fully exempt.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod13', 'auth', 'Authentication & User Management', 1, 37, 'ACL hardening â€” fix ''default on'' ACL holes: (1) _GROUP_MODULE key mismatch where g_governance used key ''governance'' but JSONB stores it as ''risk'' (unchecking Risk & Vendors never blocked Governance nav group); (2) pricing_schedule had no adminOnly flag and was not in PAGE_REGISTRY or _GROUP_MODULE, so it showed to any grandfather/father tier user regardless of module access; (3) Added Pricing Schedule checkbox (unchecked by default) to Create User modal.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux8', 'auth', 'Authentication & User Management', 1, 38, 'Exercises hub section grid â€” add bordered bucket layout above the stats strip, matching Governance hub design. Two buckets side by side: Cybersecurity Exercises (â†’ Cybersecurity Tabletop) and AI Governance Exercises (â†’ AI Governance Tabletop). History table gains a section label header. Empty history no longer shows a redundant empty-state card (sections always visible).', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux9', 'auth', 'Authentication & User Management', 1, 39, 'Dashboard widget module gating â€” widgets on the home dashboard are filtered by both hasPageAccess (grants table) AND hasModuleAccess (JSONB module_access). Fixes ''default on'' dashboard: users restricted to e.g. Assessments-only no longer see Risk Register, Gap Register, or Tabletop widgets. Customize panel also filtered.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux10', 'auth', 'Authentication & User Management', 1, 40, 'Exercise scoring â€” Aâ€“F grade per completed exercise, performance trend sparkline at top of exercises page, tabletop dashboard widget upgraded from generic link card to score/grade/sparkline widget matching CIS/Insurance style.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp1', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 0, 'Vendor intake: name, product, website, assessor, data categories with sensitivity labels, jurisdiction, data residency, provided docs', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp2', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 1, 'Vendor profile: company intelligence fields (legal entity, size, HQ, certifications, breach history, etc.) with Verified / Inferred / Unknown confidence labels', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp3', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 2, 'Risk findings: area, severity (Criticalâ€“Info), confidence, applies-to, detail, recommendation; vendor follow-up items list', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp4', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 3, 'Auto-suggested risk tier: data sensitivity Ã— vendor signals matrix â†’ Critical / High / Moderate / Low with manual override and rationale field', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp5', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 4, 'Review & publish: assessment summary, save as draft, complete, edit, delete from list', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp6', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 5, 'Supabase persistence: full CRUD against vendor_assessments table (PATCH_005)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp7', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 6, 'Copy report prompt for Claude: pre-filled prompt to generate a .docx vendor risk report', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp8', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 7, 'Push High/Critical findings to Risk Register as Third-Party risk entries on completion', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp9', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 8, 'Native PDF export of completed vendor risk assessment (Abbott Cyber branded)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp10', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 9, 'Vendor register: filter and sort assessment list by tier, status, data sensitivity, or assessor', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp11', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 10, 'Technical OSINT Layer: structured sub-step for active public-surface checks â€” port/TLS exposure (Shodan/Censys), certificate hygiene (crt.sh), email security records (SPF/DKIM/DMARC DNS lookup), and credential leak history (HIBP). Makes technical findings independently defensible rather than reliant on vendor self-reporting.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp12', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 11, 'Structured CVE Pass: dedicated NVD/CVE search step against the product name, GitHub security advisories, and vendor changelog. Current skill catches CVEs opportunistically; a structured pass catches quieter vulnerabilities.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp13', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 12, 'Risk Rating Framework Anchor: add one methodology note anchoring the impact/likelihood matrix to NIST SP 800-30. No workflow change â€” purely a defensibility and audit-readiness addition.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp14', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 13, 'Data Taxonomy Expansion: add CUI, ITAR-controlled technical data, IP/source code, and OT/SCADA to the default data category checklist. Expands TAM to CMMC clients, defense-adjacent, and industrial verticals. ITAR and Canadian frameworks are currently absent from all competing platforms.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
