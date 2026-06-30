-- SYNC_BACKLOG_PART_5.sql -- items 161-200 of 396
-- Run all 10 parts. Safe to re-run.

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s23', 'pentest', 'Pen Test Integration', 3, 3, 'Remediation tracking: open / in progress / closed', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s24', 'reporting', 'Reporting & Output', 2, 0, 'Executive dashboard: single score + risk summary', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s25', 'reporting', 'Reporting & Output', 2, 1, 'Technical drill-down per control / domain', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s26', 'reporting', 'Reporting & Output', 2, 2, 'Branded PDF report export (client-facing)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s27', 'reporting', 'Reporting & Output', 2, 3, 'Comparison view: current vs previous assessment', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s28', 'reporting', 'Reporting & Output', 2, 4, 'Roadmap recommendations sorted by impact vs effort', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('vciso1', 'vciso_program', 'vCISO Program Record System', 2, 0, 'Client Record & Program History Store: per-client record holding all uploaded artifacts organized by month and type (monthly report, assessment, TPRA, policy, tabletop, meeting notes). Builds a program timeline automatically from ingestion date and document type. No data entry beyond the upload itself.', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('vciso2', 'vciso_program', 'vCISO Program Record System', 2, 1, 'Monthly Report Ingestion & Signal Extraction: on upload of a monthly report (Word/PDF), extract key signals via AI â€” risk posture indicators, open action items, framework areas touched, deliverables referenced. Present extracted signals to the vCISO for a quick confirm/correct step before storing.', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('vciso3', 'vciso_program', 'vCISO Program Record System', 2, 2, 'Hours Input â€” Lightweight, Not a Timesheet: single input per month per client â€” hours consumed, hours budgeted, optional activity tag. No timesheets, no per-task logging. The vCISO loads the number however they track it; the tool stores the result.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('vciso4', 'vciso_program', 'vCISO Program Record System', 2, 3, 'Client Health Dashboard (practitioner-facing): portfolio view showing all clients at a glance â€” burn rate vs. retainer, last activity date, open action items count, months of program history. Surfaces clients burning hot or going dark before it becomes a problem.', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('vciso5', 'vciso_program', 'vCISO Program Record System', 2, 4, 'Client Portal â€” Program View (client-facing): thin read-only view for the client â€” program timeline, deliverables received, risk posture trend, open action items, document library. Derived entirely from ingested artifacts â€” no additional data entry to populate it. Answers ''what are we paying for?'' before it gets asked.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r1', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 0, 'Risk ID: auto-generated unique identifier per risk entry (e.g. RSK-0042)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r2', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 1, 'Risk Title: short descriptive name of the risk', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r3', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 2, 'Risk Description: full narrative of what the risk is and how it arises', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r4', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 3, 'Risk Category: dropdown (Operational / Technical / Compliance / Third-Party / Physical / Strategic)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r5', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 4, 'Affected Asset / System: what is exposed (server, app, process, data type)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r6', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 5, 'Threat Source: internal / external / natural / third-party', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r7', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 6, 'Likelihood: scored 1â€“5 (Rare / Unlikely / Possible / Likely / Almost Certain)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r8', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 7, 'Impact: scored 1â€“5 (Negligible / Minor / Moderate / Major / Critical)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r9', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 8, 'Inherent Risk Score: auto-calculated Likelihood Ã— Impact (1â€“25)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r10', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 9, 'Current Controls: describe existing mitigations in place', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r11', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 10, 'Control Effectiveness: rated Low / Medium / High', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r12', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 11, 'Residual Risk Score: adjusted score after control effectiveness applied', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r13', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 12, 'Risk Treatment: dropdown (Accept / Mitigate / Transfer / Avoid)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r14', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 13, 'Treatment Plan / Notes: free-text field for planned remediation actions', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r15', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 14, 'Risk Owner: person or role accountable for this risk', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r16', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 15, 'Review Date: scheduled next review date', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r17', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 16, 'Date Identified: when the risk was first logged', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r18', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 17, 'Last Updated: timestamp of most recent edit', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r19', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 18, 'Status: Open / In Remediation / Accepted / Closed', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r20', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 19, 'Framework Mapping: link risk to CIS control / NIST CSF function / ISO domain', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r21', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 20, 'Org Tier: tag risk to Child / Father / Grandfather level (for hierarchy rollup)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r22', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 0, 'Inline editable rows â€” edit any field without opening a separate modal', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r23', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 1, 'Risk matrix heatmap view: plot all risks on a 5Ã—5 likelihood vs impact grid', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r24', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 2, 'Filter/sort by category, status, owner, residual score, or date', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r25', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 3, 'Bulk status update: mark multiple risks accepted or closed at once', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r26', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 4, 'Risk aging alert: flag risks not reviewed within defined period (e.g. 90 days)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r27', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 5, 'Auto-populate risks from assessment findings (vuln scan, pen test, survey gaps)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r28', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 6, 'Link risks to open remediation tasks or roadmap items', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r29', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 7, 'Grandfather/Father can view child org risk registers in read-only mode', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
