-- SYNC_BACKLOG_PART_1.sql -- items 1-40 of 396
-- Run all 10 parts. Safe to re-run.

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s1', 'core', 'Core Concept', 1, 0, 'Security posture scoring for organisations / clients', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s2', 'core', 'Core Concept', 1, 1, 'Phase 1: Survey-based input (quick start, no tooling required)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s3', 'core', 'Core Concept', 1, 2, 'Phase 2: Ingest vuln scan results (Nessus, Qualys, etc.)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s4', 'core', 'Core Concept', 1, 3, 'Phase 3: Pen test findings integration', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s5', 'core', 'Core Concept', 1, 4, 'Unified score across all data sources', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d1', 'dashboard_shell', 'Platform Dashboard Shell', 1, 0, 'Sidebar navigation with grouped modules (Assessments, Risk Management, Compliance, Exercises, Reporting)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d2', 'dashboard_shell', 'Platform Dashboard Shell', 1, 1, 'Org switcher dropdown: Platform / Grandfather / Father / Child four-tier selector with tier-scoped visibility', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d3', 'dashboard_shell', 'Platform Dashboard Shell', 1, 2, 'Dashboard home: org tier card, assessments run, avg posture score, quick links', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d9', 'dashboard_shell', 'Platform Dashboard Shell', 1, 3, 'Company Profile page --- consolidates organisation_profiles + new fields (device count, user count, primary IT provider); becomes ''Start Here'' intake; feeds framework auto-scoping', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d4', 'dashboard_shell', 'Platform Dashboard Shell', 1, 4, 'Module routing: live modules open inline, unbuilt modules show phase/coming-soon card', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d5', 'dashboard_shell', 'Platform Dashboard Shell', 1, 5, 'Score dot indicators on sidebar nav items (green/amber/red based on latest score)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d6', 'dashboard_shell', 'Platform Dashboard Shell', 1, 6, 'Topbar breadcrumb and active org pill', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d7', 'dashboard_shell', 'Platform Dashboard Shell', 1, 7, 'Per-org assessment history with trend line (2+ assessments)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d10', 'dashboard_shell', 'Platform Dashboard Shell', 1, 8, 'Browser back/forward navigation --- clicking nav items pushes a URL hash state so back/forward buttons work correctly. Refreshing the page lands on the same section.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d8', 'dashboard_shell', 'Platform Dashboard Shell', 1, 9, 'Nav rebuild --- topbar org switcher, user avatar dropdown, regrouped nav sections', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d11', 'dashboard_shell', 'Platform Dashboard Shell', 1, 10, 'Dashboard top bar redesign --- portfolio-aware 4-card stat bar replacing the static single-org view with live cross-org metrics', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d16', 'dashboard_shell', 'Platform Dashboard Shell', 1, 11, 'Custom configurable dashboard --- users select which modules appear as widgets, set display priority (1 = first), and choose 1--/2--/3-- column width on a 3-column CSS grid. Config persisted per org in organisation_profiles.dashboard_config (jsonb).', true, 'High', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d13', 'dashboard_shell', 'Platform Dashboard Shell', 1, 12, 'Home dashboard --- hide assessment panels with no data: Assessments chicklet (CIS/Insurance/TechStack) only shows modules with at least one completed run; AI Readiness panel hidden entirely when no assessment exists', true, 'Medium', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d14', 'dashboard_shell', 'Platform Dashboard Shell', 1, 13, 'Home dashboard --- Missing Tools panel: dynamic gap-filtered list showing up to 5 tool types that are actually missing (not deployed) based on current assessments, in risk-priority order. Only shows tools identified as gaps.', true, 'Medium', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d15', 'dashboard_shell', 'Platform Dashboard Shell', 1, 14, 'Assessments Hub redesign --- 5-column chicklet grid replacing table view; individual assessment sidebar items removed (single ''Assessments'' nav item remains); M&A Due Diligence added to catalog', true, 'Medium', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d12', 'dashboard_shell', 'Platform Dashboard Shell', 1, 15, 'Tier display rename --- grandfather --- Group, father --- Company, child --- Entity; display layer only (DB values unchanged)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6', 'survey', 'Phase 1 --- Survey Engine', 1, 0, 'Build CIS Controls v8 survey question set', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6a', 'survey', 'Phase 1 --- Survey Engine', 1, 1, 'Insurance Readiness Assessment: dual-weighted scoring (security + insurance premium impact)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6b', 'survey', 'Phase 1 --- Survey Engine', 1, 2, 'Accordion-style survey panels per category, inline scoring', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6c', 'survey', 'Phase 1 --- Survey Engine', 1, 3, 'Save & record score: each submission appends to org assessment history', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6d', 'survey', 'Phase 1 --- Survey Engine', 1, 4, 'Trend line chart: score history per module per org', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6e', 'survey', 'Phase 1 --- Survey Engine', 1, 5, 'Premium savings estimator: gap-based insurance cost reduction estimates', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ins_redesign', 'survey', 'Phase 1 --- Survey Engine', 1, 6, 'Insurance Readiness UX redesign: CIS-style dashboard/form split with assessment history table, conducted-by + date fields, newest-first sorting, Edit from history, and view-router state machine', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s7', 'survey', 'Phase 1 --- Survey Engine', 1, 7, 'Weighted scoring per control / IG tier (CIS)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s8', 'survey', 'Phase 1 --- Survey Engine', 1, 8, 'Role-based survey routing (IT admin, exec, etc.)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s9', 'survey', 'Phase 1 --- Survey Engine', 1, 9, 'Gap analysis output with remediation priorities', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s10', 'survey', 'Phase 1 --- Survey Engine', 1, 10, 'Export: PDF scorecard report', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts1', 'technology_stack', 'Technology Stack Survey', 1, 0, 'Tool inventory: categorised list of security and security-adjacent tools (EDR, SIEM, email gateway, identity, backup, firewall, PAM, MFA, SOAR, etc.)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts2', 'technology_stack', 'Technology Stack Survey', 1, 1, 'Per-tool selection auto-maps to CIS Controls, NIST CSF, and Insurance Readiness scoring', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts3', 'technology_stack', 'Technology Stack Survey', 1, 2, 'Technical maturity score: pre-populated baseline before manual survey questions are answered', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts4', 'technology_stack', 'Technology Stack Survey', 1, 3, 'Gap view: which framework controls have no tool coverage', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts5', 'technology_stack', 'Technology Stack Survey', 1, 4, 'Tool stack summary card: exportable for client-facing technology posture review', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts6', 'technology_stack', 'Technology Stack Survey', 1, 5, 'Optional category toggles (Cloud Security Posture, Application Security) --- show only when client has cloud / SaaS scope', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts7', 'technology_stack', 'Technology Stack Survey', 1, 6, 'Move questions from JS const into Supabase techstack_questions table so MSPs can manage their own question sets without code deploys', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts8', 'technology_stack', 'Technology Stack Survey', 1, 7, 'MSP tool catalog (msp_tools table) + join logic to classify each client answer as sell / upgrade / replace opportunity', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
