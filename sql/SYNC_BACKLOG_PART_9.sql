-- SYNC_BACKLOG_PART_9.sql -- items 321-360 of 396
-- Run all 10 parts. Safe to re-run.

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl5', 'policy_library', 'Policy Library', 1, 5, 'Policy request / notify â€” when a template is still a placeholder, allow users to flag which policies they need most urgently (stored as a simple counter or email notification to Mark)', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl6', 'policy_library', 'Policy Library', 1, 6, 'Policy version tracking â€” add version number and last-reviewed date to each template card; flag policies that haven''t been reviewed in 12+ months', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl7', 'policy_library', 'Policy Library', 1, 7, 'AI Acceptable Use Policy card â€” added pol_aiaup entry (NIST AI RMF / GOVERN, controls GV-1.1 GV-5.1 GV-6.1); currently Placeholder status, no Word doc yet', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl8', 'policy_library', 'Policy Library', 1, 8, 'AI Acceptable Use Policy Word doc â€” produce and add downloadable Comprehensive/SMB versions to the pol_aiaup card (same pattern as AI Governance)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl9', 'policy_library', 'Policy Library', 1, 9, 'All NIST AI RMF policy Word docs wired â€” Comprehensive and SMB downloads added to all 5 remaining cards: AI Risk Management, AI Use Case Inventory, AI Incident Response, AI Transparency & Accountability, AI Data Quality & Bias Management', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl10', 'policy_library', 'Policy Library', 1, 10, 'All NIST CSF 2.0 policy Word docs wired â€” Comprehensive and SMB downloads added to all 10 NIST CSF 2.0 cards: Information Security, Risk Management, Access Control, Incident Response, Asset Management, Data Classification & Handling, Vulnerability Management, Third-Party & Vendor Risk, Security Awareness & Training, Business Continuity & DR', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl11', 'policy_library', 'Policy Library', 1, 11, 'Policy Library â€” Insurance Readiness tab: 8 existing policies tagged insurance:true (isp, acp, irp, dcp, vmp, tprp, satp, bcrp); 4 new placeholder cards added (Email Security, Backup & Recovery, Privileged Access Management, Endpoint Security). Green accent colour for insurance-framework cards. Insurance badge shown on cross-framework cards when viewed in insurance tab.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl12', 'policy_library', 'Policy Library', 1, 12, 'Policy Library â€” Word doc templates for 4 insurance placeholder cards (Email Security & Anti-Phishing, Backup & Recovery, Privileged Access Management, Endpoint Security). Comprehensive + SMB variants (8 docs total). Generator tool at generate-insurance-policies.html.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl13', 'policy_library', 'Policy Library', 1, 13, 'Policy Library â€” native in-app policy doc generator: ''Generate Policy'' button on each card that produces the Word doc on the fly from template content defined in code, without needing to open a separate generator HTML file. Eliminates the external generate-insurance-policies.html dependency.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rp1', 'policy_library', 'Policy Library', 1, 14, 'Exec report trend chart in Word export for AI modules: AI Unified, NIST AI RMF, and ISO 42001 Word exports currently have no trend chart. Add equivalent score trend line chart (matching the CIS cisDrawTrendLine() approach) to all three AI module Word exports.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai1', 'ai_readiness', 'AI Readiness', 1, 0, 'NIST AI RMF v1.0 assessment â€” 68 sub-categories across GOVERN, MAP, MEASURE, MANAGE functions; dashboard, accordion form, gap report, exec report, AI prompt export', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai2', 'ai_readiness', 'AI Readiness', 1, 1, 'ISO/IEC 42001:2023 assessment â€” 53 items across clauses 4â€“10 and Annex A; dashboard, accordion form, gap report, exec report, AI prompt export', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai3', 'ai_readiness', 'AI Readiness', 1, 2, 'AI Readiness Hub â€” aggregated view of NIST AI RMF + ISO 42001 scores with combined score, per-framework score cards, clause/function bars, quick-start buttons', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai4', 'ai_readiness', 'AI Readiness', 1, 3, 'framework_notes table (PATCH_010) â€” generic org-scoped notes for AI framework controls; ai_rmf_profile column on organisation_profiles', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai5', 'ai_readiness', 'AI Readiness', 1, 4, 'Unified AI Governance Assessment â€” 44-question NIST AI RMF Ã— ISO 42001 cross-walk module; weighted gap prioritisation (weight Ã— deficit), top-5 gap view, POAM, exec report, framework toggles (NIST on/off, ISO on/off), AI prompt export; replaces separate NIST and ISO modules in nav', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai6', 'ai_readiness', 'AI Readiness', 1, 5, 'Sidebar score dot for ai_unified â€” getModuleDot() currently skips ai_unified; wire it to show green/amber/red based on latest unified score', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai9', 'ai_readiness', 'AI Readiness', 1, 6, 'AI Governance Maturity Pyramid â€” interactive SVG pyramid in AI Readiness Hub; 22 NIST AI RMF segments across 5 tiers (Governingâ†’Optimizing); click-to-cycle status (Not Addressed/Partial/In Progress/Implemented); detail panel with NIST/ISO standard links; live score footer', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai12', 'ai_readiness', 'AI Readiness', 1, 7, 'AI Governance Executive Report â€” maturity pyramid (read-only, status derived from AIG answers) + 9-spoke domain radar chart replacing group breakdown bars; pyramid and radar both init from app.js setTimeout on report view load', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai10', 'ai_readiness', 'AI Readiness', 1, 8, 'AI Maturity Pyramid â€” persist segment statuses per org to Supabase so state is saved between sessions and can be used in reporting', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai11', 'ai_readiness', 'AI Readiness', 1, 9, 'Rapid Pre-Assessment â€” interactive pyramid, click segments to set maturity status, save to DB as module=rapid_pyramid, history with load/delete, no comments or evidence required', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai7', 'ai_readiness', 'AI Readiness', 1, 10, 'EU AI Act assessment module â€” risk classification, prohibited uses, high-risk system obligations', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai7', 'ai_readiness', 'AI Readiness', 1, 11, 'AI Readiness Hub â€” consolidated visual dashboard with radar/spider chart across all AI frameworks', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai8', 'ai_readiness', 'AI Readiness', 1, 12, 'AI framework auto-scoping â€” cross-map ISO 42001 and NIST AI RMF findings to identify overlapping gaps and common remediation', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai13', 'ai_readiness', 'AI Readiness', 1, 13, 'AI governance control templates â€” for any AI governance control gap, provide a downloadable template (policy doc, register, tracking spreadsheet) so clients can immediately act on a finding. Could be in-app templates or generated Excel/Word artifacts. Long-term: build these trackers natively into the platform (e.g. AI inventory register, AI incident log, AI risk register).', true, 'High', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai14', 'ai_readiness', 'AI Readiness', 1, 14, 'AI phishing and attack simulation â€” module or integration to run AI-specific attack scenarios: prompt injection tests, model manipulation attempts, AI-generated phishing campaigns targeting staff. Assesses practical AI security posture beyond governance controls.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai22', 'ai_readiness', 'AI Readiness', 1, 15, 'AI Simulation Tracker â€” lightweight module to record AI attack simulation campaigns (prompt injection tests, deepfake phishing, AI data exfiltration drills). Fields: scenario type, date run, facilitator, staff count tested, pass rate, outcome notes, remediation actions. Dashboard shows coverage map and history. Provides audit/insurance evidence that the org actively tests its AI defences.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai15', 'ai_readiness', 'AI Readiness', 1, 16, 'AI tabletop exercises â€” scenario track focused on AI-specific incidents: AI model producing harmful output, prompt injection leading to data exfiltration, AI vendor breach, AI-generated misinformation impacting operations. Complements the operational tabletop track with AI-specific injects and role considerations.', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai15a', 'ai_readiness', 'AI Readiness', 1, 17, 'AI tabletop exercise history â€” list view of completed exercises per org (scenario name, date, facilitator) with load/view and delete. Same pattern as TPRA list. Reads from assessments table where module=ai_tabletop.', true, 'Medium', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai15b', 'ai_readiness', 'AI Readiness', 1, 18, 'AI tabletop PDF/Word export â€” export the AAR as a branded Word or PDF document directly from the AAR view, without requiring the user to paste into Claude. Same output as the Claude-generated report but produced natively.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai16', 'ai_readiness', 'AI Readiness', 1, 19, 'AI governance crosswalk with recommendations â€” map AI Governance Assessment gaps across NIST AI RMF, ISO 42001, EU AI Act, and PIPEDA/provincial AI obligations. For each gap, surface which frameworks require remediation and provide a prioritised recommendation. Builds on AI_REMEDIATION and existing framework mappings.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai17', 'ai_readiness', 'AI Readiness', 1, 20, 'AI Governance exec report Print / Save as PDF button â€” add a ''Print'' button on the exec report view that calls window.print() with @media print CSS. Same pattern as cis_report_print backlog item. Pyramid and radar charts already rendered as canvases so they will print correctly.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai18', 'ai_readiness', 'AI Readiness', 1, 21, 'Wire auditLog() into AI Governance assessment saves â€” aiuSave(), aiuSavePoam(), and aiuDeleteConfirm() currently have no audit trail. Pattern is identical to cis.js audit calls (session 17). Needed for full platform audit coverage.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai19', 'ai_readiness', 'AI Readiness', 1, 22, 'Update AI Governance ''Copy AI Prompt'' button to instruct Claude to output commentary with KEY FINDINGS and PRIORITY RECOMMENDATIONS as exact section headers on their own lines â€” so fmtCommentary() in the Word export automatically formats them as styled tables. Closes the prompt â†’ save â†’ export loop.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai20', 'ai_readiness', 'AI Readiness', 1, 23, 'Abbott Executive Report Template â€” ma-executive-report-generator skill created; template shell saved to templates/Abbott_Executive_Report_Template.doc. Future: build a native report generator view in the platform that pre-populates the template from live assessment data and allows one-click download without needing Claude.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai21', 'ai_readiness', 'AI Readiness', 1, 24, 'AI Security Assessment â€” dedicated assessment module covering the technical security posture of an organisation''s AI usage, distinct from the governance/compliance focus of NIST AI RMF and ISO 42001. Scope to cover: prompt injection controls, model access and API key management, data sent to AI providers (data leakage risk), AI output validation and human-in-the-loop controls, AI tool inventory and shadow AI, vendor security posture for AI providers, adversarial input handling, and AI-specific incident response. Likely a survey-based format similar to Insurance Readiness or Tech Stack, with scored output and gap report. Ties into TPRA for AI vendor assessment and the AI Tabletop track for incident readiness.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai_pyr_2', 'ai_readiness', 'AI Readiness', 1, 25, 'Add a colour key below the AI maturity pyramid showing all five statuses with their colours: Implemented (green), Partial (yellow), Compensating Control (amber), N/A (grey), Not Addressed (red). Especially needed now that CC and N/A are visually distinct â€” clients need to know what each colour means.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai_pyr_3', 'ai_readiness', 'AI Readiness', 1, 26, 'Add a question in the AI Readiness setup or org profile: does this org build AI (developer/vendor) or use AI from third-party vendors? If "user", auto-mark Model Development, Training, and related build-side sections as N/A so they render grey instead of red on the pyramid. Prevents misrepresenting AI consumers as having gaps in controls that simply do not apply to them.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ma1', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 0, 'M&A Cyber Due Diligence core module â€” 28-question wizard across 4 scored categories (Governance, IAM/Endpoint, Data/Cloud, Incident History) with optional AI Exposure Screen (6q) and Cyber Insurance Review (4q) add-ons; risk-tolerance-adjusted scoring (Conservative/Moderate/Aggressive); deal-breaker detection with hard stops for undisclosed breaches and active regulatory action; cost-to-remediate with Labor + Tooling columns scaled by employee band; Cyber Discount Factor when deal value entered; POAM with owner/date/decision fields; Add Entity flow to create child org at close linked to assessment as founding baseline; AI prompt copy for deal memo generation', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ma2', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 1, 'M&A deal memo Word export â€” export full assessment as Abbott-branded .doc: score hero, deal-breaker table, category scores, findings list, cost-to-remediate breakdown, POAM summary. Same pattern as CIS/AI Unified Word exports.', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ma3', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 2, 'Tech stack prefill for M&A â€” auto-map existing Technology Stack survey answers to M&A control questions where derive_strategy applies (I1/MFA, I4/EDR, I6/VPN, I7/Email, D4/Backup). Show pre-filled indicator on answered questions so assessor knows the source.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
