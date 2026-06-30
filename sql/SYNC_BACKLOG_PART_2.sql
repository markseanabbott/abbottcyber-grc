-- SYNC_BACKLOG_PART_2.sql -- items 41-80 of 396
-- Run all 10 parts. Safe to re-run.

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts9', 'technology_stack', 'Technology Stack Survey', 1, 8, 'Framework auto-scoping: tech stack answers pre-populate CIS / NIST / Insurance survey questions via derive_strategy', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis1', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 0, 'Per-safeguard assessor comments: free-text note field per safeguard in the assessment form, persisted in the answers jsonb or a dedicated table. Display inline in form and read-only in assessment detail view.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis2', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 1, 'Per-safeguard evidence upload: file attachment (PDF, screenshot, doc) linked to a safeguard and an assessment run. Store in Supabase Storage; show filename + download link in form and detail view. New SQL patch required.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_quick', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 2, 'CIS Quick Check: 47 plain-language questions across all 18 CIS control groups. No evidence required. Fast posture read for client intake. Lives inside the CIS module dashboard. Saves to assessments table as module=cis_quick.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_poam', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 3, 'CIS POAM (Plan of Action & Milestones): per-assessment gap report with Assigned To, Target Date, Risk Decision (Remediate/Accept/Transfer), Rationale, Status columns. Excel export with logo placeholder row. POAM button on each assessment history row.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_ux1', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 4, 'CIS control scope descriptions in Gap Report and POAM --- CIS_CONTROL_SCOPE descriptions are shown in the assessment accordion (session 27) but not yet in cisOpenGapReport() or renderCISPoam(). Add scope as a sub-line under each control group header in both views.', true, 'Low', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_poam_rem', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 5, 'CIS POAM remediation suggestions --- add a ''---- Suggested Action'' block to each safeguard row in the CIS POAM, giving practitioners specific implementation guidance rather than just a gap reference. Same pattern as AI Unified POAM (AI_REMEDIATION lookup). Requires a CIS_REMEDIATION object or per-safeguard field added to CIS_SAFEGUARDS.', true, 'Medium', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_poam_logo', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 6, 'Client logo upload for POAM and report exports: allow logo upload in Organisation Manager, stored in Supabase Storage, embedded in Excel/PDF exports at top of document.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis3', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 7, 'CIS assessment PDF/Excel export: produce a formatted report card showing score, IG progress, per-control summary, and gap list --- branded Abbott Cyber.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('exec_prompt_v2', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 8, 'Exec report copy-prompt improvements (all 4 modules): enrich AI prompt with trend delta vs previous run, named improvement and regression areas, and explicit instruction to call out progress by domain.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_report_print', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 9, 'CIS exec report Print / Save as PDF button: add a ''Print'' button on the exec report view that calls window.print() with @media print CSS to hide nav/buttons and produce a clean client-presentable PDF directly from the browser, without needing to open the Word download.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_exec_report', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 10, 'CIS Executive Report: per-assessment report view with gauge/speedometer chart, answer distribution donut, score trend line, IG tier progress bars, control group coverage bars, top gaps table, and executive commentary section with ''Generate AI Prompt'' button to produce AI-written narrative via Claude.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_ig_filter', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 11, 'CIS assessment form: IG filter bar (All / IG1 / IG2 / IG3) to narrow visible safeguards by implementation group tier.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis4', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 12, 'CIS gap report: dedicated view listing all unanswered or ''No'' safeguards for the selected IG goal, sorted by control group, with recommended remediation priority.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_partial_save', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 13, 'CIS assessment form: partial save --- allow saving an in-progress assessment at any point, not only when all in-scope safeguards are answered.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_cc', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 14, 'CIS assessment form: Compensating Control answer option --- 5th answer alongside Yes/Partial/No/N/A. Teal colour (distinct from green Yes). Scores as Yes for all calculations. Shows inline note prompting documenter to capture provider AUP and control evidence.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_partial_badge', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 15, 'CIS dashboard history table: show ''In Progress'' badge on saved assessments that have unanswered in-scope safeguards (answered < scoreable). Helps distinguish interim saves from complete assessments at a glance.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_close', 'cis_controls', 'CIS Controls v8 --- Enhancements', 1, 16, 'CIS assessment close/finalise --- explicit ''Mark as Complete'' action on a saved assessment. Sets a completed flag so In Progress vs Complete is unambiguous. Closed assessments are read-only (no further edits without re-opening). Works alongside cis_partial_badge --- In Progress = unanswered questions OR not yet closed; Complete = explicitly finalised by assessor.', true, 'Medium', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cmmc1', 'cmmc_l1', 'CMMC Level 1 Assessment', 1, 0, 'CMMC L1 module: 17 practices, 6 domains, dashboard, assessment form with domain-grouped accordion, POAM (stored in answers._poam blob, no new table), SPRS extension tab, Tech Stack prefill (10 of 17 practices mapped), Assessments Hub card with Re-up. Built on assessment_core.js shared chrome.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cmmc2', 'cmmc_l1', 'CMMC Level 1 Assessment', 1, 1, 'CMMC L1 Executive Report: Score Breakdown 2-col grid (score breakdown card left + domain coverage bars + trend canvas right), 6-domain radar chart, Priority Gaps table, Executive Commentary card with paste textarea, Generate AI Prompt button, Save Commentary (persists _exec_commentary to answers JSONB), Export Word (gauge + radar canvases --- PNG embedded in .doc). Two new shared assessment_core.js functions: acExecScoreBreakdownHtml and acExecCommentaryHtml.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cmmc3', 'cmmc_l1', 'CMMC Level 1 Assessment', 1, 2, 'CMMC Tech Stack mapping expansion: add PE/MP/AC-external questions to the Technology Stack survey so all 17 L1 practices can be pre-populated from TS data. Currently 7 practices (AC.L1-3.1.20, AC.L1-3.1.22, MP.L1-3.8.3, all 4 PE practices) require manual entry because they cover physical security --- no TS questions exist for those areas.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cmmc4', 'cmmc_l1', 'CMMC Level 1 Assessment', 1, 3, 'NIST CSF 2.0 assessment module using assessment_core.js: next logical framework module after CMMC. 6 Functions (Govern/Identify/Protect/Detect/Respond/Recover), subcategory scoring, maturity tier, Tech Stack prefill, exec report + Word export. Would be the third module to use the shared assessment engine.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cl2_1', 'cmmc_l2', 'CMMC Level 2 Assessment', 1, 0, 'CMMC L2 full module: 110 NIST SP 800-171 Rev 2 practices, 14 domains, dashboard, assessment form (domain-grouped accordion with L1 subset badges), SPRS score (110 --- deductions), POAM (stored in answers._poam blob), exec report (gauge, 14-domain radar, domain coverage table, trend, priority gaps by SPRS impact, commentary), Word export (CIS-pattern: Executive Summary first, fmtCommentary KEY FINDINGS + PRIORITY RECOMMENDATIONS, gauge+table side-by-side, radar, trend PNG, domain coverage, top 15 gaps, full 110-practice listing page-break section), Assessments Hub card with Re-up. Built on assessment_core.js shared engine.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cl2_2', 'cmmc_l2', 'CMMC Level 2 Assessment', 1, 1, 'CMMC L2 Tech Stack prefill --- map relevant Technology Stack survey answers to CMMC Level 2 practices via derive_strategy, pre-populating L2 form where TS data covers the control. Extends the existing _CMMC_TS_MAP in prefill.js.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cl2_3', 'cmmc_l2', 'CMMC Level 2 Assessment', 1, 2, 'CMMC L1 --- L2 pre-fill --- when starting a CMMC L2 assessment, offer to pre-populate the 17 overlapping L1 practices from the most recent CMMC L1 assessment for the same org.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth1', 'auth', 'Authentication & User Management', 1, 0, 'Supabase Auth email/password login screen --- gates entire app before init(). Session token stored in sessionStorage. Token refresh on expiry.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth2', 'auth', 'Authentication & User Management', 1, 1, '4-role model: platform_admin, org_admin, analyst, viewer. Visibility scoping per role. Viewer role is read-only (write ops blocked at sbFetch level).', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth3', 'auth', 'Authentication & User Management', 1, 2, 'User Management module --- list, create, edit, delete users. Multi-org access assignment for analyst/viewer. user_org_access junction table.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth4', 'auth', 'Authentication & User Management', 1, 3, 'Remove anon RLS policies --- tighten to authenticated-only once auth is confirmed stable.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth5', 'auth', 'Authentication & User Management', 1, 4, 'First-run setup screen --- allow platform admin account creation from login screen when no platform_admin users exist, eliminating need for Supabase dashboard bootstrap.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth6', 'auth', 'Authentication & User Management', 1, 5, 'Audit log --- cross-module activity tracking with 7/30/90 day filter. Covers user, assessment, TPRA, org, and POAM events. Displayed as a tab in User Management.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth7', 'auth', 'Authentication & User Management', 1, 6, 'Wire auditLog() into Technology Stack save --- currently the only module without an audit call.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth8', 'auth', 'Authentication & User Management', 1, 7, 'Export audit log to CSV --- allow platform admins to download the filtered audit log as a spreadsheet.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth13', 'auth', 'Authentication & User Management', 1, 8, 'Verify RLS UPDATE policy on organisation_profiles --- CIS IG goal upsert was returning 409 duplicate key error.', true, 'High', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth9', 'auth', 'Authentication & User Management', 1, 9, 'Module-level access control --- add module_access jsonb column to users table (PATCH_012); restrict nav group visibility per analyst/viewer based on assigned modules (AI Readiness, Assessments, Risk & Vendors, Exercises, Reports). platform_admin and org_admin always see all. UI reads module_access in buildNav() to filter groups.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth10', 'auth', 'Authentication & User Management', 1, 10, 'View As User --- platform_admin can impersonate any user to preview their exact nav, org scope, and module access. Amber banner shows who is being viewed. All writes disabled in preview mode. Exit returns to own account.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth11', 'auth', 'Authentication & User Management', 1, 11, 'Delete user now removes Supabase Auth account --- requires SB_SERVICE_KEY in js/supabase.js (service role key from Supabase Dashboard --- Settings --- API). Graceful fallback if key not set.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth12', 'auth', 'Authentication & User Management', 1, 12, 'Move SB_SERVICE_KEY out of client-side code before any hosting or deployment --- service role key bypasses all RLS and must never be in a publicly accessible file.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth14', 'auth', 'Authentication & User Management', 1, 13, 'Local-only Supabase admin tool --- standalone HTML file (like backlog-manager.html, never deployed) with service role key hardcoded locally. Shows orphaned auth.users rows (auth account with no matching app users row) and lets admin delete them with one click. Replaces the in-app auth-delete flow safely.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth15', 'auth', 'Authentication & User Management', 1, 14, 'Dynamic Backlog Manager (platform admin only) --- Supabase-backed feature backlog in the Settings nav. Seed from backlog.json paste. Filter by phase/status/section/search. Toggle done/pending inline. Per-item ''AI Prompt'' button generates a complete Claude Code build prompt (feature text, build context, section file references, done/pending sibling items, project conventions). PATCH_022 required.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
