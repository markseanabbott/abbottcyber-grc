-- SYNC_BACKLOG.sql -- generated 2026-06-30 (396 items)
-- Safe to re-run (ON CONFLICT DO UPDATE).
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s1', 'core', 'Core Concept', 1, 0, 'Security posture scoring for organisations / clients', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s2', 'core', 'Core Concept', 1, 1, 'Phase 1: Survey-based input (quick start, no tooling required)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s3', 'core', 'Core Concept', 1, 2, 'Phase 2: Ingest vuln scan results (Nessus, Qualys, etc.)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s4', 'core', 'Core Concept', 1, 3, 'Phase 3: Pen test findings integration', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s5', 'core', 'Core Concept', 1, 4, 'Unified score across all data sources', true, NULL, 'Session 75: Security Maturity widget in js/home.js. MATURITY_LEVELS (5 tiers: Initial/Developing/Defined/Managed/Optimizing at 0/25/50/70/85) and MATURITY_SOURCES (6 assessments: CIS, Insurance, TechStack, AI Readiness, CMMC L1, CMMC L2) declared as module-level consts. _maturityLevel(score) helper. _widgetMaturity(h) renders full card: header with Level badge + score, 5-zone colored maturity track bar with position marker and score callout, per-dimension rows with mini zone-segmented progress bars showing current vs 100% potential, unassessed rows with ''Start â†’'' links and ''100% possible'' label, footer with assessed count and points-to-next-level. WIDGET_CATALOG gets ''maturity'' type; DEFAULT_WIDGETS gets maturity at priority 0 width 4 (full-width, first widget). renderDashWidget() handles ''maturity'' case. loadHomePortfolio() updated to use all 6 MATURITY_SOURCES. _homeCard2 child composite updated to use all 6 sources.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d1', 'dashboard_shell', 'Platform Dashboard Shell', 1, 0, 'Sidebar navigation with grouped modules (Assessments, Risk Management, Compliance, Exercises, Reporting)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d2', 'dashboard_shell', 'Platform Dashboard Shell', 1, 1, 'Org switcher dropdown: Platform / Grandfather / Father / Child four-tier selector with tier-scoped visibility', true, NULL, 'Session 23b: buildOrgDropdown() rewritten to render a parentâ†’child tree instead of flat tier-labelled sections. renderNode() recurses from root orgs (no parent or parent outside visible set) through children, adding 14px indent per depth level and muted ''â€”'' dash prefixes. Tier-coloured avatars still indicate level. Roots sorted by TIER_ORDER then name; children sorted alphabetically.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d3', 'dashboard_shell', 'Platform Dashboard Shell', 1, 2, 'Dashboard home: org tier card, assessments run, avg posture score, quick links', true, NULL, 'Session 23f: Dashboard updated to 2-column equal-width chicklet grid (1fr 1fr). Each panel (Assessments, Risk Register, AI Readiness) is a compact card. Panels are role-scoped via hasModuleAccess() â€” users with no module access see a ''Limited access'' message; users with partial access see only their permitted panels. Quick links strip also filtered by module access. _homeAssessmentsChicklet(), _homeRiskChicklet(), _homeAiChicklet() are the three panel renderers. Session 23e: original redesign â€” two-column layout, live modules removed, sub-orgs removed, drawHomeCharts() draws sparklines + radar.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d9', 'dashboard_shell', 'Platform Dashboard Shell', 1, 3, 'Company Profile page â€” consolidates organisation_profiles + new fields (device count, user count, primary IT provider); becomes ''Start Here'' intake; feeds framework auto-scoping', true, NULL, 'Session 49: js/company_profile.js (new file). renderCompanyProfile() â€” 5-section form (Company Overview, People & Devices, Data & Regulatory, IT & Cloud, Vendors), completeness progress bar (filled fields / total fields), Risk Context card shown after save, Step 2 CTA linking to Tech Stack. cpSave() upserts to organisation_profiles and updates org.industry, calls loadOrgProfiles() to refresh cache. cpUpdateSubIndustry() cascades sub-industry dropdown on industry change. _cpRiskContext(p) derives CIS IG recommendation: High sensitivity/2+ regs â†’ IG2; medium/PII/1+ reg â†’ IG1 amber; low â†’ IG1 green. Uses cp_ prefixed IDs to avoid conflicts with orgs.js modal. config.js: separate g_company_profile nav group (single-item, renders as flat link below Dashboard). app.js: render route added. SUPABASE_PATCH_023 adds approx_device_count, approx_user_count (int), primary_msp (text) to organisation_profiles.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d4', 'dashboard_shell', 'Platform Dashboard Shell', 1, 4, 'Module routing: live modules open inline, unbuilt modules show phase/coming-soon card', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d5', 'dashboard_shell', 'Platform Dashboard Shell', 1, 5, 'Score dot indicators on sidebar nav items (green/amber/red based on latest score)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d6', 'dashboard_shell', 'Platform Dashboard Shell', 1, 6, 'Topbar breadcrumb and active org pill', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d7', 'dashboard_shell', 'Platform Dashboard Shell', 1, 7, 'Per-org assessment history with trend line (2+ assessments)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d10', 'dashboard_shell', 'Platform Dashboard Shell', 1, 8, 'Browser back/forward navigation â€” clicking nav items pushes a URL hash state so back/forward buttons work correctly. Refreshing the page lands on the same section.', true, NULL, 'Session 42: setNav(id, {pushState=true}) in js/app.js â€” calls history.pushState({nav:id}, '''', ''#''+id) on every navigation. popstate listener calls setNav(id, {pushState:false}) to avoid double-push. bootApp() reads location.hash.slice(1) on initial load and sets activeNav if it matches a valid nav ID. Deep sub-states (open POAM, form, etc.) do not push their own entries â€” only top-level module navigation.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d8', 'dashboard_shell', 'Platform Dashboard Shell', 1, 9, 'Nav rebuild â€” topbar org switcher, user avatar dropdown, regrouped nav sections', true, NULL, 'Nav regrouped into 6 groups (Home/Assessments/AI Readiness/Risk & Vendors/Exercises/Reports). Home rendered as flat single-item nav (no accordion). Org/company switcher moved from sidebar footer to topbar. User chip replaced with avatar dropdown containing Org Manager, User Management (admin only), and Sign Out. Admin pages removed from sidebar nav. js/config.js (NAV structure), js/app.js (buildNav flat items, _ADMIN_PAGES breadcrumb, setNav, click-outside), js/auth.js (renderUserMenu, toggleUserMenu, closeUserMenu), index.html (topbar org switcher, sidebar footer removed), css/core.css (.user-menu*, .nav-item-flat, .topbar-org-selector). Session 15 fix: dashboard org list now scoped to children of selected org (orgsUnderCurrent() in home.js) â€” platform handled separately, grandchildren included for grandfather/father tiers.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d11', 'dashboard_shell', 'Platform Dashboard Shell', 1, 10, 'Dashboard top bar redesign â€” portfolio-aware 4-card stat bar replacing the static single-org view with live cross-org metrics', true, NULL, 'Session 49: js/home.js fully rewritten. Card 1: Org Identity (unchanged). Card 2: Portfolio Risk Score â€” child: inline composite avg of CIS/Insurance/TechStack from orgAssessments; father+: async portfolio avg across all scope orgs with expandable breakdown table (homeToggleBreakdown). Card 3: Open Critical Risks â€” portfolio-wide count from targeted risk_register query (?org_id=in.(ids)&select=inherent_risk_rating). Card 4: Assessment Coverage â€” child: Last Assessed date; father+: assessed org count / total org count %. homePortfolioState tracks scopeKey, loading, loaded, orgScores, riskCounts, assessedCount, totalCount, breakdownOpen. loadHomePortfolio() loads all scope org assessments in parallel (reuses loadAssessments cache), computes per-org composites, queries risk counts, guards against stale loads via scope key mismatch. _homePortfolioBreakdown() renders expandable score table sorted by composite. _scoreColor(s) helper for green/amber/red. New window exports: homeToggleBreakdown, loadHomePortfolio.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d16', 'dashboard_shell', 'Platform Dashboard Shell', 1, 11, 'Custom configurable dashboard â€” users select which modules appear as widgets, set display priority (1 = first), and choose 1Ã—/2Ã—/3Ã— column width on a 3-column CSS grid. Config persisted per org in organisation_profiles.dashboard_config (jsonb).', true, 'High', 'Session 65: js/home.js. WIDGET_CATALOG (10 widgets: cis, insurance, techstack, cmmc, cmmc2, ai_unified, risk_register, gap_register, tpra, tabletop). DEFAULT_WIDGETS (cis 2Ã—, insurance 1Ã—, gap_register 1Ã—, risk_register 2Ã—, techstack 1Ã—). dashCustomize state. getDashConfig() reads orgProfiles[].dashboard_config or falls back to defaults. _widgetScore() â€” score card with big number, band, delta, sparkline (canvas wd-trend-{id}). _widgetLink() â€” description card for TPRA and Tabletop. renderDashWidget() dispatcher using hasPageAccess() for ACL. _renderWidgetGrid() â€” CSS grid repeat(3,1fr) with span N cells. _renderCustomizePanel() â€” checkbox, priority number input, 1Ã—/2Ã—/3Ã— width buttons per widget. toggleDashCustomize / dashToggleWidget / dashSetWidth / dashSetPriority / cancelDashConfig / saveDashConfig() wired to window. _drawWidgetTrends() draws sparklines for wd-trend-{id} canvases; called from drawHomeCharts(). sql/SUPABASE_PATCH_034.sql adds dashboard_config jsonb to organisation_profiles â€” needs to be run in Supabase SQL Editor.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d13', 'dashboard_shell', 'Platform Dashboard Shell', 1, 12, 'Home dashboard â€” hide assessment panels with no data: Assessments chicklet (CIS/Insurance/TechStack) only shows modules with at least one completed run; AI Readiness panel hidden entirely when no assessment exists', true, 'Medium', 'Session 53: js/home.js. _homeAssessmentsChicklet() now filters catalog to only modules with runs.length > 0; returns '''' if none. _homeAiChicklet() returns '''' instead of an empty-state card when no AI assessment run exists. renderHome() uses if-check on return value from each chicklet function.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d14', 'dashboard_shell', 'Platform Dashboard Shell', 1, 13, 'Home dashboard â€” Missing Tools panel: dynamic gap-filtered list showing up to 5 tool types that are actually missing (not deployed) based on current assessments, in risk-priority order. Only shows tools identified as gaps.', true, 'Medium', 'Session 53 (revised in 54, finalised in 55): js/home.js _homeTopToolsChicklet(). Reads grBuildGapList() (CIS + Insurance + Tech Stack merged) â€” same dataset as Tool Gap Register. RISK_RANK map covers all 30 PS_ALL_TYPES tool type IDs with correct keys (mdr_soc, ztna_vpn, dns_filter, pii_scan, etc.). Sorts all gap rows by risk rank, takes top 5. Rows show tool label from gap register + CIS/Ins/TS framework badges. Pricing pulled from t.ps on gap row. Three states: loading spinner, no-assessments catalog mode prompt, all-clear success.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d15', 'dashboard_shell', 'Platform Dashboard Shell', 1, 14, 'Assessments Hub redesign â€” 5-column chicklet grid replacing table view; individual assessment sidebar items removed (single ''Assessments'' nav item remains); M&A Due Diligence added to catalog', true, 'Medium', 'Session 55: js/home.js renderAssessmentsHub() rewritten â€” ASSESSMENT_CATALOG maps 7 assessments (added ma_cdd). Each chicklet: icon + name, description, last run date + score (colour-coded), Re-up + View/Run buttons. Coming Soon state for NIST CSF 2.0. Grid: grid-template-columns:repeat(3,1fr). js/config.js g_assessments group reduced to single item { id:''assessments'', label:''Assessments'' } â€” all individual nav items removed. All setNav() routing unchanged.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('d12', 'dashboard_shell', 'Platform Dashboard Shell', 1, 15, 'Tier display rename â€” grandfather â†’ Group, father â†’ Company, child â†’ Entity; display layer only (DB values unchanged)', true, NULL, 'Session 50: Display-only rename. js/config.js: TIER_LABELS updated (feeds renderTierBanner() in app.js â€” affects all module tier banners). js/orgs.js: org tree sub-labels (''Group Â· 2 Company groups'', ''Company Â· 3 entity clients''), badge text (Company/Entity), create modal select options, edit modal tier select (inline lookup map replaces charAt capitalise), parent and managed-by dropdown options, orphan card display. No DB changes, no CSS class changes, no JS conditional changes.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6', 'survey', 'Phase 1 â€” Survey Engine', 1, 0, 'Build CIS Controls v8 survey question set', true, NULL, 'Built. 153 safeguards across 18 control groups, IG1/IG2/IG3 tiering, full assessment form with Yes/Partial/No/NA answers, per-safeguard comments, Quick Check (47 questions), POAM, and Executive Report.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6a', 'survey', 'Phase 1 â€” Survey Engine', 1, 1, 'Insurance Readiness Assessment: dual-weighted scoring (security + insurance premium impact)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6b', 'survey', 'Phase 1 â€” Survey Engine', 1, 2, 'Accordion-style survey panels per category, inline scoring', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6c', 'survey', 'Phase 1 â€” Survey Engine', 1, 3, 'Save & record score: each submission appends to org assessment history', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6d', 'survey', 'Phase 1 â€” Survey Engine', 1, 4, 'Trend line chart: score history per module per org', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s6e', 'survey', 'Phase 1 â€” Survey Engine', 1, 5, 'Premium savings estimator: gap-based insurance cost reduction estimates', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ins_redesign', 'survey', 'Phase 1 â€” Survey Engine', 1, 6, 'Insurance Readiness UX redesign: CIS-style dashboard/form split with assessment history table, conducted-by + date fields, newest-first sorting, Edit from history, and view-router state machine', true, NULL, 'Session 24: renderInsurance() now routes to renderInsuranceDashboard() or renderInsuranceForm() via insState.view. Dashboard has navy score-hero (score, Sec%, Ins%, run count), trend chart, history table with Latest badge and Edit button, savings panel from latest run. insOpenAssessment(origIdx) loads past run into form. insBackToDashboard() returns to dashboard. insSave() saves conducted_by + assessed_at and reloads history before switching view. insState in config.js and selectOrg() in app.js updated; duplicateAssessment() in home.js updated to set view:form. Session 26: renderInsuranceForm() fully rewritten to match CIS form visual style â€” navy .score-hero-ins header with live ''Score So Far'' (computed from answered questions only), progress bar, date/conductor inputs right-aligned; section panels use b-green/b-amber/b-gray badges (Done/In progress/Not started); question rows use .cis-safeguard/.cis-sf-text/.cis-sf-sub; answer options use .cis-ans-btn buttons (full-width, stacked) with sel-yes/sel-partial/sel-no state by score tier (>=80/>=40/<40); footer bar always visible â€” Save button disabled (greyed) until all questions answered, active cyan when allDone; savings panel appears below footer when all done.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s7', 'survey', 'Phase 1 â€” Survey Engine', 1, 7, 'Weighted scoring per control / IG tier (CIS)', true, NULL, 'Built. cisCalcScore() applies Yes=1 / Partial=0.5 / No=0 weighting, filters safeguards by org''s IG goal (ig1/ig2/ig3), and returns score, yes/partial/answered/total counts. Score used in dashboard trend, exec report dials, and POAM.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s8', 'survey', 'Phase 1 â€” Survey Engine', 1, 8, 'Role-based survey routing (IT admin, exec, etc.)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s9', 'survey', 'Phase 1 â€” Survey Engine', 1, 9, 'Gap analysis output with remediation priorities', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s10', 'survey', 'Phase 1 â€” Survey Engine', 1, 10, 'Export: PDF scorecard report', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts1', 'technology_stack', 'Technology Stack Survey', 1, 0, 'Tool inventory: categorised list of security and security-adjacent tools (EDR, SIEM, email gateway, identity, backup, firewall, PAM, MFA, SOAR, etc.)', true, NULL, '10 categories, 41 questions delivered. Y/N/NA/Partial answer model with inline partial-detail capture. tool_category machine tag on every question for MSP catalog match. SUPABASE_PATCH_002.sql adds techstack_responses table.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts2', 'technology_stack', 'Technology Stack Survey', 1, 1, 'Per-tool selection auto-maps to CIS Controls, NIST CSF, and Insurance Readiness scoring', true, NULL, 'Each question carries mappings.cis (with IG tier), mappings.nist (CSF 2.0 IDs), mappings.insurance (impact rating + note). Rendered as individually-clickable chip-lets under each question.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts3', 'technology_stack', 'Technology Stack Survey', 1, 2, 'Technical maturity score: pre-populated baseline before manual survey questions are answered', true, NULL, 'Overall + per-category maturity computed live (Yes=1, Partial=0.5, No=0, NA=excluded). Snapshot writes to assessments table with module=''techstack'' on save, feeding the dashboard score dot. Session 26: full dashboard/form split added â€” renderTechStackDashboard() shows navy score hero with live maturity %, 8-cell category mini-grid, trend canvas (drawTsTrend, â‰¥2 runs), assessment history table with date/score/conductedBy/Delete, and 10-category breakdown bars. renderTechStackForm() extracted with back button + always-visible save footer. tsNavToDashboard(), tsStartNew(), tsDeleteSnapshot() added. tsSaveAllResponses() now saves conducted_by, reloads history via delete+loadAssessments, switches to dashboard view on success. Session 27: Edit button added to each history row â€” tsEditSnapshot(id) looks up run in orgAssessments, pre-fills date/conductedBy, sets tsState.editId, opens form. tsSaveAllResponses() PATCHes existing record (sb.updateAssessment) when editId is set, then clears it. Form subtitle and save button text reflect edit vs new mode. tsNavToDashboard() clears editId.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts4', 'technology_stack', 'Technology Stack Survey', 1, 3, 'Gap view: which framework controls have no tool coverage', false, NULL, 'Follow-up: dedicated view that inverts the mapping â€” shows CIS/NIST controls grouped by ''No'' or unanswered tech stack questions.', '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts5', 'technology_stack', 'Technology Stack Survey', 1, 4, 'Tool stack summary card: exportable for client-facing technology posture review', true, NULL, 'Export JSON button delivers full snapshot including tool_category, question_type, derive_strategy tags for downstream MSP catalog matching and framework auto-scoping.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts6', 'technology_stack', 'Technology Stack Survey', 1, 5, 'Optional category toggles (Cloud Security Posture, Application Security) â€” show only when client has cloud / SaaS scope', true, NULL, 'Two new TS_CATS entries with optional:true + scope field: cloud_security (â˜ï¸, 5 questions: CSPM, Cloud IAM/JIT, storage public-access block, control-plane logging, CIS cloud benchmarks) and app_security (ðŸ”§, 5 questions: SAST in CI, SCA/dependency scanning, DAST, WAF, secrets scanning). tsState gains scopeCloud/scopeAppSec booleans. tsVisibleCats() filters TS_CATS by optional+scope flags â€” used in form render, dashboard, and score calc. Scope toggle bar renders in survey form between score hero and categories. tsLoadResponses() auto-enables toggles if org already has answers for those questions. tsToggleScope(flag) toggles and re-renders. No SQL needed.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts7', 'technology_stack', 'Technology Stack Survey', 1, 6, 'Move questions from JS const into Supabase techstack_questions table so MSPs can manage their own question sets without code deploys', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts8', 'technology_stack', 'Technology Stack Survey', 1, 7, 'MSP tool catalog (msp_tools table) + join logic to classify each client answer as sell / upgrade / replace opportunity', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ts9', 'technology_stack', 'Technology Stack Survey', 1, 8, 'Framework auto-scoping: tech stack answers pre-populate CIS / NIST / Insurance survey questions via derive_strategy', true, NULL, 'Session 25: Pull model â€” ''From Tech Stack'' button appears on new assessments only (not edits). js/prefill.js contains tsDeriveCIS() (walks TS_CATS mappings.cis to derive yes/partial/no per safeguard; better answer wins when multiple TS questions map to same safeguard) and tsDeriveInsurance() (14-entry static map to Insurance question IDs; maps TS yes/partial/no to closest option score via option index). tsEnsureLoaded() silently loads TS from Supabase if not yet in memory. insPrefillFromTS() and cisPrefillFromTS() fill only unanswered questions (never overwrites). insState.fromNew=true set in insNew(); CIS button gated on !cisState.editId. q12 (IR Plan documented) intentionally excluded â€” no TS proxy for a written plan.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis1', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 0, 'Per-safeguard assessor comments: free-text note field per safeguard in the assessment form, persisted in the answers jsonb or a dedicated table. Display inline in form and read-only in assessment detail view.', true, NULL, 'Implemented. ðŸ’¬ Comment button toggles inline textarea per safeguard. Notes saved to cis_safeguard_notes table (PATCH_007). Evidence columns (evidence_url, evidence_filename) added to same table for Phase 2.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis2', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 1, 'Per-safeguard evidence upload: file attachment (PDF, screenshot, doc) linked to a safeguard and an assessment run. Store in Supabase Storage; show filename + download link in form and detail view. New SQL patch required.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_quick', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 2, 'CIS Quick Check: 47 plain-language questions across all 18 CIS control groups. No evidence required. Fast posture read for client intake. Lives inside the CIS module dashboard. Saves to assessments table as module=cis_quick.', true, NULL, 'Built. renderCISQuick() with score-so-far hero, progress bar, per-control group sections. cisSaveQuick() / cisOpenQuickAssessment() / cisDeleteQuickAssessment(). Dashboard shows Quick Check history card below full assessment history.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_poam', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 3, 'CIS POAM (Plan of Action & Milestones): per-assessment gap report with Assigned To, Target Date, Risk Decision (Remediate/Accept/Transfer), Rationale, Status columns. Excel export with logo placeholder row. POAM button on each assessment history row.', true, NULL, 'Built. cis_poam_items table (PATCH_008). renderCISPoam(), cisOpenPoam(), cisSavePoam(), cisExportPoam(). Logo row placeholder in Excel export (row 1) â€” full logo upload is backlogged.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_ux1', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 4, 'CIS control scope descriptions in Gap Report and POAM â€” CIS_CONTROL_SCOPE descriptions are shown in the assessment accordion (session 27) but not yet in cisOpenGapReport() or renderCISPoam(). Add scope as a sub-line under each control group header in both views.', true, 'Low', 'Two edits in js/cis.js. Gap Report: control group header div restructured to column layout; CIS_CONTROL_SCOPE[group.ctrl] rendered as italic white/70 sub-line below title. POAM: scope const added in group header IIFE; rendered as muted italic line between control name and suggested action/tool blocks.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_poam_rem', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 5, 'CIS POAM remediation suggestions â€” add a ''ðŸ’¡ Suggested Action'' block to each safeguard row in the CIS POAM, giving practitioners specific implementation guidance rather than just a gap reference. Same pattern as AI Unified POAM (AI_REMEDIATION lookup). Requires a CIS_REMEDIATION object or per-safeguard field added to CIS_SAFEGUARDS.', true, 'Medium', 'Session 42: CIS_REMEDIATION const added to js/cis.js (18 entries keyed by control group 1â€“18, each with action and tool strings). renderCISPoam() gaps rendering wrapped in IIFE with lastCtrl closure variable â€” each new control group inserts a full-width <tr colspan=9> header showing control name, ðŸ’¡ Suggested Action (blue chip), and ðŸ”§ Suggested Tool (purple chip). Grouped at control level rather than per-safeguard for cleaner POAM view.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_poam_logo', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 6, 'Client logo upload for POAM and report exports: allow logo upload in Organisation Manager, stored in Supabase Storage, embedded in Excel/PDF exports at top of document.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis3', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 7, 'CIS assessment PDF/Excel export: produce a formatted report card showing score, IG progress, per-control summary, and gap list â€” branded Abbott Cyber.', true, NULL, 'Session 28: Excel export (cisExportExcel) now includes Column H ''Comment'' populated with existing assessor notes; import (cisParseImportFile + cisImportSave) reads Column H back and saves to cis_safeguard_notes. Word exec report (cisExportReportWord) now embeds radar chart + dot/line trend chart as inline PNG images captured from cisReportRadar and cisReportTrend canvases, plus a page-break section with the full 18-control/153-safeguard detail listing showing each safeguard ID, IG tier, answer (colour-coded), title and description.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('exec_prompt_v2', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 8, 'Exec report copy-prompt improvements (all 4 modules): enrich AI prompt with trend delta vs previous run, named improvement and regression areas, and explicit instruction to call out progress by domain.', true, NULL, 'Session 44b: all 4 copy-prompt functions updated â€” cisCopyReportPrompt (cis.js), aiuCopyReportPrompt (ai_unified.js), nistAiCopyReportPrompt (nist_ai.js), iso42001CopyReportPrompt (iso42001.js). Each now computes: trendDelta (+/-% vs prior date), improvedAreas (CIS Controls / AI domains / NIST functions / ISO clauses that gained), regressedAreas (same for losses). All 3 fields added to prompt data section (TREND DELTA, IMPROVEMENT AREAS, REGRESSION AREAS). Trend instruction updated in each: CIS uses ---TREND--- marker and names improved controls; AI Unified weaves improvement into executive summary instruction; NIST AI + ISO 42001 fully restructured (formatting rules block added, output restructured to KEY FINDINGS + PRIORITY RECOMMENDATIONS markers matching AI Unified quality). Grouping: CIS by ctrl number/name, AI Unified by AI_GROUP_META label, NIST AI by NIST_FN_META label, ISO 42001 by ISO42001_CLAUSE_META label. Delta computed vs immediately preceding chronological run (not latest â€” handles historical report viewing correctly).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_report_print', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 9, 'CIS exec report Print / Save as PDF button: add a ''Print'' button on the exec report view that calls window.print() with @media print CSS to hide nav/buttons and produce a clean client-presentable PDF directly from the browser, without needing to open the Word download.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_exec_report', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 10, 'CIS Executive Report: per-assessment report view with gauge/speedometer chart, answer distribution donut, score trend line, IG tier progress bars, control group coverage bars, top gaps table, and executive commentary section with ''Generate AI Prompt'' button to produce AI-written narrative via Claude.', true, NULL, 'Built. cisOpenReport() opens report view, renderCISReport() renders full layout. cisDrawGauge(), cisDrawDonut(), cisDrawReportTrend() draw Canvas charts. cisGenerateReportPrompt() copies data-rich prompt to clipboard. cisSaveCommentary() persists commentary to assessment answers._exec_commentary via PATCH. Session 8 overhaul: added cisDrawRadar() 18-spoke canvas radar; accordion redesigned with CIS_REPORT_LAYERS. Session 28: cisDrawReportTrend() = stacked IG1/IG2/IG3 bar chart (in-browser only). cisDrawTrendLine() = new dot/line trend chart for Word export only (drawn off-screen). cisCaptureHeader() helper prevents date/assessor reverting on answer clicks. cisGenerateReportPrompt() rewritten with explicit no-markdown formatting rules. Session 29: cisExportReportWord() fully restructured â€” new section order: Executive Summary â†’ Overall Score (SVG gauge dial) â†’ Radar â†’ IG Progress (in-scope tiers only) â†’ Score Trend (line chart) â†’ Top 10 Priority Gaps â†’ Full Assessment page-break (IG-scoped safeguards only). Commentary parsed from ---CONTROLS---/---TREND---/---GAPS--- delimiters. cisDrawReportTrend() rewritten as proper stacked bar: IG1 bottom (green), IG2 middle (blue), IG3 top (purple); each zone fills from bottom by tier score%; score % label inside each zone; overall score label above bar; now draws with 1+ runs. fmtCommentary() rewritten line-by-line: KEY FINDINGS â†’ navy sub-heading + bullet table (â€¢ column); PRIORITY RECOMMENDATIONS â†’ navy sub-heading + numbered navy-cell table (1/2/3); handles AI output with single or double \n, with or without â€¢ characters. Radar and trend now drawn fresh on off-screen canvases at export time (not captured from in-page canvas which could be stale). Session 30: Gauge replaced SVG (unreliable in Word) with canvasâ†’PNG â€” full redâ†’orangeâ†’amberâ†’limeâ†’green spectrum track, needle, hub circle. Report title now dynamic: ''CIS IG2 Assessment â€” Executive Report''. IG progress table: N/A column added, gap count excludes N/A, score denominator excludes N/A. AI prompt: 80% advancement threshold logic â€” â‰¥80% recommends advancing to next IG; <80% recommends consolidating; exec summary instructed to close with next-year scope recommendation. JS script tags: ?v=20260618b cache-bust added to all modules.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_ig_filter', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 11, 'CIS assessment form: IG filter bar (All / IG1 / IG2 / IG3) to narrow visible safeguards by implementation group tier.', true, NULL, 'Session 30. cisSetIgFilter(val) updates cisState.igFilter and re-renders. Filter bar rendered above control panels in renderCISForm(). filterN applied to scopedSfs â€” controls with zero matching safeguards hidden entirely. Header stats remain based on full goal scope. Panel subtitle shows ''showing IGx only'' when filter active. Session 35: displaySfs changed from scopedSfs to ctrl.safeguards â€” all safeguards now always visible; out-of-scope ones (ig > goalN) shown at opacity:.4 with ''outside goal'' badge so IG2+IG3 are visible (greyed) when goal=IG1, IG3 visible (greyed) when goal=IG2. Session 36: dashboard history table IG2 column now also greyed (ig2Style = opacity:0.35) when org goal is IG1, matching existing IG3 behaviour. IG2/IG3 column header colors are also dynamic (#1d4ed8/#6d28d9 when in scope, #cbd5e1 when out of scope). IG2 cell has null guard (shows â€” when s2=0).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis4', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 12, 'CIS gap report: dedicated view listing all unanswered or ''No'' safeguards for the selected IG goal, sorted by control group, with recommended remediation priority.', true, NULL, 'Built. cisOpenGapReport(idx) opens gap view; renderCISGapReport() renders grouped-by-control table with priority badges (Critical/High/Medium/Low derived from IG tier Ã— answer status). cisGapPriority() matrix. cisGapCopyPrompt() copies a remediation roadmap prompt for Claude. ðŸ” Gaps button added to each assessment row in the dashboard. Includes summary stat chips and priority legend.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_partial_save', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 13, 'CIS assessment form: partial save â€” allow saving an in-progress assessment at any point, not only when all in-scope safeguards are answered.', true, NULL, 'Session 34: save button was gated on org having a CIS goal set (hidden entirely when no goal). cisSave() blocked with toast when no goal. Fix: save button always visible in form header and bottom bar; cisSave() now defaults to ig1 when no goal set (cisGetGoal() || ''ig1'') rather than returning. Hint text updated from ''answer all safeguards then save'' to ''save at any time â€” partial assessments recorded with answers so far''.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_cc', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 14, 'CIS assessment form: Compensating Control answer option â€” 5th answer alongside Yes/Partial/No/N/A. Teal colour (distinct from green Yes). Scores as Yes for all calculations. Shows inline note prompting documenter to capture provider AUP and control evidence.', true, NULL, 'Session 36. cisIsYes() helper (a === ''yes'' || a === ''cc'') replaces === ''yes'' checks in cisCalcScore(), cisIgProgress(), cisQuickCalcScore(), and exec report scoring loops. Button added to cis-ans-row with label ''âŸ³ Comp. Control'', value ''cc''. Teal style .cis-ans-btn.sel-cc in modules.css. Inline provider note shown when ans === ''cc''. Matrix cycle extended: na â†’ cc â†’ clear. CELL_LABEL.cc = ''CC'', CELL_STYLE.cc teal, ansColors.cc teal, sfSt() CC badge, exec report _aL.cc / _aC.cc mappings. Gap filter unchanged â€” cc is not a gap (filter is no/partial only).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_partial_badge', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 15, 'CIS dashboard history table: show ''In Progress'' badge on saved assessments that have unanswered in-scope safeguards (answered < scoreable). Helps distinguish interim saves from complete assessments at a glance.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cis_close', 'cis_controls', 'CIS Controls v8 â€” Enhancements', 1, 16, 'CIS assessment close/finalise â€” explicit ''Mark as Complete'' action on a saved assessment. Sets a completed flag so In Progress vs Complete is unambiguous. Closed assessments are read-only (no further edits without re-opening). Works alongside cis_partial_badge â€” In Progress = unanswered questions OR not yet closed; Complete = explicitly finalised by assessor.', true, 'Medium', 'Built. _closed flag stored in answers JSONB (no SQL patch needed). Dashboard shows ''Complete'' (green) / ''In Progress'' (amber) badge on each history row; ''View / Edit'' button becomes ''ðŸ‘ View'' when closed. Form shows green ''Assessment Finalised'' banner, all answer/comment/evidence buttons and date/assessor inputs are disabled when closed. Footer shows ''Re-open Assessment'' instead of Save. New functions: cisMarkComplete() (saves + sets _closed:true, returns to dashboard), cisReopenAssessment() (sets _closed:false, re-renders editable form). Both in js/cis.js near the Export section.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cmmc1', 'cmmc_l1', 'CMMC Level 1 Assessment', 1, 0, 'CMMC L1 module: 17 practices, 6 domains, dashboard, assessment form with domain-grouped accordion, POAM (stored in answers._poam blob, no new table), SPRS extension tab, Tech Stack prefill (10 of 17 practices mapped), Assessments Hub card with Re-up. Built on assessment_core.js shared chrome.', true, NULL, 'js/cmmc.js (CMMC_L1_PRACTICES, CMMC_DOMAIN_META, cmmcState, full render suite). js/assessment_core.js (acScoreBand, acScoreHeroHtml, acHistoryTableHtml, acPoamTableHtml, acExecScoreStripHtml, acTrendDraw, acTabExtBar). SPRS tab (renderCMMCSprs) shows L1 contribution ~55 of 110 pts with disclaimer. Tech Stack prefill via _CMMC_TS_MAP in prefill.js (IA/AC/SC/SI domains covered; PE/MP need manual entry). Session 44.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cmmc2', 'cmmc_l1', 'CMMC Level 1 Assessment', 1, 1, 'CMMC L1 Executive Report: Score Breakdown 2-col grid (score breakdown card left + domain coverage bars + trend canvas right), 6-domain radar chart, Priority Gaps table, Executive Commentary card with paste textarea, Generate AI Prompt button, Save Commentary (persists _exec_commentary to answers JSONB), Export Word (gauge + radar canvases â†’ PNG embedded in .doc). Two new shared assessment_core.js functions: acExecScoreBreakdownHtml and acExecCommentaryHtml.', true, NULL, 'renderCMMCExec(), cmmcSaveCommentary(), drawCmmcRadar(), drawCmmcReportCharts(), cmmcExportReportWord() all in js/cmmc.js. acExecScoreBreakdownHtml() and acExecCommentaryHtml() added to js/assessment_core.js and exported on window. Session 45. Session 46: cmmcExportReportWord() fully overhauled to match CIS export pattern â€” fmtCommentary() with KEY FINDINGS bulleted table + PRIORITY RECOMMENDATIONS numbered table; Executive Summary moved first; trend PNG added (if 2+ runs); score section gauge+table side-by-side; Domain Coverage table; Priority Gaps (top 15); full 17-practice listing (page-break section, grouped by domain, with status); SPRS note. Also fixed sbFetch signature errors (sb.updateAssessment/sb.deleteAssessment pattern) and added window export block.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cmmc3', 'cmmc_l1', 'CMMC Level 1 Assessment', 1, 2, 'CMMC Tech Stack mapping expansion: add PE/MP/AC-external questions to the Technology Stack survey so all 17 L1 practices can be pre-populated from TS data. Currently 7 practices (AC.L1-3.1.20, AC.L1-3.1.22, MP.L1-3.8.3, all 4 PE practices) require manual entry because they cover physical security â€” no TS questions exist for those areas.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cmmc4', 'cmmc_l1', 'CMMC Level 1 Assessment', 1, 3, 'NIST CSF 2.0 assessment module using assessment_core.js: next logical framework module after CMMC. 6 Functions (Govern/Identify/Protect/Detect/Respond/Recover), subcategory scoring, maturity tier, Tech Stack prefill, exec report + Word export. Would be the third module to use the shared assessment engine.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cl2_1', 'cmmc_l2', 'CMMC Level 2 Assessment', 1, 0, 'CMMC L2 full module: 110 NIST SP 800-171 Rev 2 practices, 14 domains, dashboard, assessment form (domain-grouped accordion with L1 subset badges), SPRS score (110 âˆ’ deductions), POAM (stored in answers._poam blob), exec report (gauge, 14-domain radar, domain coverage table, trend, priority gaps by SPRS impact, commentary), Word export (CIS-pattern: Executive Summary first, fmtCommentary KEY FINDINGS + PRIORITY RECOMMENDATIONS, gauge+table side-by-side, radar, trend PNG, domain coverage, top 15 gaps, full 110-practice listing page-break section), Assessments Hub card with Re-up. Built on assessment_core.js shared engine.', true, NULL, 'js/cmmc2.js (CMMC2_PRACTICES 110q, CMMC2_DOMAIN_META 14 domains, cmmc2State, full render suite). Key functions: cmmc2CalcScore, cmmc2SprsCalc, cmmc2GetGaps, cmmc2DomainProgress, renderCMMC2, renderCMMC2Dashboard, renderCMMC2Form, renderCMMC2Poam, renderCMMC2Exec, renderCMMC2Sprs, cmmc2SaveAssessment, cmmc2DeleteAssessment, cmmc2SavePoam, cmmc2SaveCommentary, cmmc2ExportReportWord, drawCmmc2Radar. SPRS scoring: 110 âˆ’ Î£ deductions (Not Met = full weight, Partial = ceil(weight/2), Met/NA = 0). sbFetch calls use sb.updateAssessment/sb.deleteAssessment pattern. All functions window-exported. config.js: cmmc2 nav entry. app.js: render route + trend/chart setTimeout. home.js: ASSESSMENT_CATALOG card + duplicateAssessment case. Script tag in index.html. Session 46.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cl2_2', 'cmmc_l2', 'CMMC Level 2 Assessment', 1, 1, 'CMMC L2 Tech Stack prefill â€” map relevant Technology Stack survey answers to CMMC Level 2 practices via derive_strategy, pre-populating L2 form where TS data covers the control. Extends the existing _CMMC_TS_MAP in prefill.js.', true, 'Low', 'prefill.js: added _CMMC2_TS_MAP (48 L2 practice mappings across all 14 NIST 800-171 domains), tsDeriveCMMC2(), cmmc2PrefillFromTS(). cmmc2.js: added ''From Tech Stack'' button in form header (id=cmmc2PrefillBtn). Practice IDs use plain format (3.1.3) not prefixed (AC.L2-3.1.3) to match cmmc2State.answers keys. Strategy: ''all'' for practices requiring paired controls (MFA both users+admin, IR retainer+paging, least privilege PAM+JML); ''best'' for all others. Practices with no TS signal (session lock, FIPS crypto, personnel security) intentionally omitted.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('cl2_3', 'cmmc_l2', 'CMMC Level 2 Assessment', 1, 2, 'CMMC L1 â†’ L2 pre-fill â€” when starting a CMMC L2 assessment, offer to pre-populate the 17 overlapping L1 practices from the most recent CMMC L1 assessment for the same org.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth1', 'auth', 'Authentication & User Management', 1, 0, 'Supabase Auth email/password login screen â€” gates entire app before init(). Session token stored in sessionStorage. Token refresh on expiry.', true, NULL, 'js/auth.js: authBootstrap(), authSignIn(), authSignOut(), loginSubmit(), renderLoginScreen(). sbFetch updated to use session token in Authorization header. startApp() replaces init() as entry point.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth2', 'auth', 'Authentication & User Management', 1, 1, '4-role model: platform_admin, org_admin, analyst, viewer. Visibility scoping per role. Viewer role is read-only (write ops blocked at sbFetch level).', true, NULL, 'visibleOrgs() updated to be auth-aware. viewOnlyBanner() shown on assessment modules. sbFetch blocks POST/PATCH/DELETE for viewer role. adminOnly flag on User Management nav item.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth3', 'auth', 'Authentication & User Management', 1, 2, 'User Management module â€” list, create, edit, delete users. Multi-org access assignment for analyst/viewer. user_org_access junction table.', true, NULL, 'js/users.js: renderUserManagement(), openCreateUserModal(), openEditUserModal(). Auth account created via /auth/v1/signup (anon key). SUPABASE_PATCH_009.sql adds auth_id to users, user_org_access table, authenticated RLS policies.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth4', 'auth', 'Authentication & User Management', 1, 3, 'Remove anon RLS policies â€” tighten to authenticated-only once auth is confirmed stable.', true, NULL, 'Session 40: SUPABASE_PATCH_021.sql â€” dynamic DO block drops all anon policies across all tables via pg_policies. Revokes anon EXECUTE on all helper/sync functions. Site deployed to grc.abbottcyber.com via Cloudflare. Auth gate confirmed: private window hits login screen before any data. Supabase Auth Site URL set to https://grc.abbottcyber.com.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth5', 'auth', 'Authentication & User Management', 1, 4, 'First-run setup screen â€” allow platform admin account creation from login screen when no platform_admin users exist, eliminating need for Supabase dashboard bootstrap.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth6', 'auth', 'Authentication & User Management', 1, 5, 'Audit log â€” cross-module activity tracking with 7/30/90 day filter. Covers user, assessment, TPRA, org, and POAM events. Displayed as a tab in User Management.', true, NULL, 'SUPABASE_PATCH_011.sql: audit_log table (org_id, actor_name, actor_email, event_type, target_type, target_name, details jsonb, created_at). js/supabase.js: sb.auditLog.insert(), sb.auditLog.getRecent(), global auditLog() fire-and-forget helper. js/users.js: Audit Log tab with renderAuditShell(), auditTabLoad(), setAuditDays(). Audit calls wired in users.js (create/edit/delete), cis.js (save/update/POAM/delete), insurance.js (save), tpra.js (publish/delete), orgs.js (create/update/delete).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth7', 'auth', 'Authentication & User Management', 1, 6, 'Wire auditLog() into Technology Stack save â€” currently the only module without an audit call.', true, NULL, 'Session 75: tsSaveAllResponses() in js/techstack.js. Added const wasEdit = !!tsState.editId at function top (before editId is cleared mid-save). After toast, if saved > 0: auditLog(wasEdit ? ''assessment_updated'' : ''assessment_saved'', ''assessment'', ''Technology Stack'', { score, responses: saved, org_id }). Matches the CIS/Insurance audit pattern.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth8', 'auth', 'Authentication & User Management', 1, 7, 'Export audit log to CSV â€” allow platform admins to download the filtered audit log as a spreadsheet.', true, NULL, 'Built. exportAuditCsv() in js/users.js â€” uses already-fetched userMgmtState.auditLogs, no extra API call. 7-column CSV (Date/Time UTC, Actor, Actor Email, Event, Target, Organization, Details). BOM prefix for clean Excel open. Filename includes day filter and date. ''â†“ Export CSV'' button added to renderAuditShell() header alongside day pills. Also added assessment_finalised and assessment_reopened to EVENT_LABELS and EVENT_COLORS in renderAuditShell().', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth13', 'auth', 'Authentication & User Management', 1, 8, 'Verify RLS UPDATE policy on organisation_profiles â€” CIS IG goal upsert was returning 409 duplicate key error.', true, 'High', 'Session 19: Root cause was sb.profiles.upsert() calling POST without specifying the conflict column â€” PostgREST defaulted to PK (id) but id was not in the payload, so the ON CONFLICT clause never fired and it tried to INSERT a duplicate org_id. Fixed by adding ?on_conflict=org_id to the URL in supabase.js. No SQL patch required.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth9', 'auth', 'Authentication & User Management', 1, 9, 'Module-level access control â€” add module_access jsonb column to users table (PATCH_012); restrict nav group visibility per analyst/viewer based on assigned modules (AI Readiness, Assessments, Risk & Vendors, Exercises, Reports). platform_admin and org_admin always see all. UI reads module_access in buildNav() to filter groups.', true, NULL, 'SUPABASE_PATCH_012.sql adds module_access jsonb to users. js/app.js: _GROUP_MODULE map, hasModuleAccess(groupId) â€” only platform_admin bypasses unconditionally; all other roles (including org_admin) are gated by module_access jsonb. NULL = full access (existing users unaffected). buildNav() calls hasModuleAccess() per group. js/users.js: Module Access checkboxes always visible in create/edit modals â€” active for all roles except platform_admin (greyed/disabled for platform_admin only). submitCreateUser/submitEditUser save module_access for role !== ''platform_admin''. Org access (user_org_access) still only saved for analyst/viewer. Run PATCH_012 in Supabase SQL Editor to activate.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth10', 'auth', 'Authentication & User Management', 1, 10, 'View As User â€” platform_admin can impersonate any user to preview their exact nav, org scope, and module access. Amber banner shows who is being viewed. All writes disabled in preview mode. Exit returns to own account.', true, NULL, 'js/config.js: viewAsState global + _orgScopeForRole() helper refactors visibleOrgs(). js/auth.js: isAdmin/isViewOnly check viewAsState first; isPlatformAdmin() always uses real role. js/supabase.js: writes blocked when viewAsState active. js/app.js: viewAsUser(userId), exitViewAs(), updateViewAsBanner(). hasModuleAccess() checks viewAsState. js/users.js: ''ðŸ‘ View As'' button per user row (platform_admin only, not in view-as mode). index.html: #viewAsBanner div between topbar and content. css/core.css: .view-as-banner amber styles. Session 15b fixes: renderUserMenu() now shows viewed user name/role/avatar (amber) in view-as mode; viewAsUser()/exitViewAs() call updateOrgUI() + re-render user chip. activeNavSection default changed to null (no section pre-opened). Module Access always visible in user modals â€” greyed/disabled for admin roles with explanatory note, active for analyst/viewer.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth11', 'auth', 'Authentication & User Management', 1, 11, 'Delete user now removes Supabase Auth account â€” requires SB_SERVICE_KEY in js/supabase.js (service role key from Supabase Dashboard â†’ Settings â†’ API). Graceful fallback if key not set.', true, NULL, 'js/supabase.js: SB_SERVICE_KEY constant. js/auth.js: authAdminDeleteUser(authId) calls DELETE /auth/v1/admin/users/{id} with service role key. js/users.js: deleteUser() retrieves auth_id from userMgmtState, calls authAdminDeleteUser after app record deleted. Soft failure: if auth delete fails, shows warning toast and audit logs the failure rather than crashing. 404 from auth treated as success. Session 15b: service role key populated in SB_SERVICE_KEY.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth12', 'auth', 'Authentication & User Management', 1, 12, 'Move SB_SERVICE_KEY out of client-side code before any hosting or deployment â€” service role key bypasses all RLS and must never be in a publicly accessible file.', true, NULL, 'Session 40: Service role key blanked from js/secrets.js. authAdminDeleteUser() in auth.js still exists but returns a config error when called (key is empty string). App user record + org access still delete cleanly; only the auth.users orphan cleanup is affected. Managed via Supabase dashboard (Authentication â†’ Users) or the planned local admin tool (auth14).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth14', 'auth', 'Authentication & User Management', 1, 13, 'Local-only Supabase admin tool â€” standalone HTML file (like backlog-manager.html, never deployed) with service role key hardcoded locally. Shows orphaned auth.users rows (auth account with no matching app users row) and lets admin delete them with one click. Replaces the in-app auth-delete flow safely.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth15', 'auth', 'Authentication & User Management', 1, 14, 'Dynamic Backlog Manager (platform admin only) â€” Supabase-backed feature backlog in the Settings nav. Seed from backlog.json paste. Filter by phase/status/section/search. Toggle done/pending inline. Per-item ''AI Prompt'' button generates a complete Claude Code build prompt (feature text, build context, section file references, done/pending sibling items, project conventions). PATCH_022 required.', true, NULL, 'js/backlog_manager.js â€” blmState, blmLoad(), renderBacklogManager(), blmRenderList(), blmRenderSection(), blmRenderItem(), blmToggleDone(), blmToggleSection(), blmExpandAll(), blmCollapseAll(), blmToggleNotes(), blmSetFilter(), blmResetFilters(), blmOpenSeed(), blmCancelSeed(), blmConfirmSeed(), blmCopyPrompt(), _blmBuildPrompt(). _BLM_SECTION_FILES maps all 30 section_ids to relevant JS files for prompt context. Seed: paste backlog.json into textarea, upserts in batches of 50 (merge-duplicates). AI prompt includes: item text + notes, section file map, done/pending siblings, full project architecture conventions, numbered build instructions. Nav item ''backlog'' added to g_settings in config.js. Render route in app.js loads blmLoad() on first visit. Script tag before app.js in index.html. sql/SUPABASE_PATCH_022.sql creates backlog_items table with platform_admin-only RLS. Session 47. BUG FIX (session 48): all showToast() calls replaced with toast(msg, col) â€” this app uses toast() not showToast(); ReferenceError was silently aborting all button actions. Also added Map-based dedup of rows by id before batch upsert to handle duplicate ids in backlog.json (ai1/ai2/ai7 appear in multiple sections).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth16', 'auth', 'Authentication & User Management', 1, 15, 'Self-service password reset â€” allow users to reset their own password from the login screen (Supabase Auth email reset flow) or from their profile in-app. Reduces admin burden for password management.', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('auth17', 'auth', 'Authentication & User Management', 1, 16, 'Dedicated Audit Log Viewer (Platform Admin) â€” standalone page in Platform Admin nav showing platform-wide activity from audit_log table. Login events captured at auth time. Filterable by event type, date range, and actor email. Color-coded event badges, day-grouped rows, click-to-expand details JSON. Stats strip: total events, logins, unique actors, deletes.', true, 'High', 'Session 74: js/audit_log.js â€” alState, alLoad() (sb.auditLog.getRecent()), renderAuditLog(), alRenderStats(), alRenderTable(), alSetFilter(), alResetFilters(), alRefresh(), alToggleExpand(). AL_EVENT_STYLES map for color-coded badges. _alOrgName() resolves org IDs from global orgList. auth.js: auditLog(''login'',''auth'', email, {role}) wired after authStartRefreshTimer() in loginSubmit(). config.js: audit_log nav item added to g_platform group. app.js: audit_log route added. index.html: script tag added. Audit log page is platform-admin gated.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('blm2', 'auth', 'Authentication & User Management', 1, 17, 'Backlog Manager status tabs â€” 4 lifecycle states (Add / Edit / Completed / Cancelled) replacing the binary done/pending toggle; per-status pill tabs with live counts, item rows styled by status, inline status select dropdown', true, NULL, 'Session 49: SUPABASE_PATCH_024 adds status text column (CHECK add/edit/completed/cancelled, DEFAULT add) to backlog_items; migrates existing done=true rows to status=completed, done=false to status=add. js/backlog_manager.js rewritten: BLM_STATUS const (4 states with label/icon/color/bg/border). _blmStatus(item) returns item.status or falls back to done boolean. Status pill tab bar (All + 4 per-status tabs with count badges). blmSetStatus(id, newStatus) PATCHes both status and done fields, re-renders full page so tab counts stay live. Item rows: styled <select> for status change (replaces checkbox). Completed/cancelled items rendered at opacity:.5 with strikethrough title. blmToggleDone() removed, replaced by blmSetStatus(). blmSetFilter() now re-renders full page (not just list) so tab badge counts stay in sync.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux1', 'auth', 'Authentication & User Management', 1, 18, 'American spelling standardization â€” all user-facing display text (labels, headings, nav, toasts) changed from Organisation to Organization throughout. JS variables, CSS classes, Supabase names unchanged.', true, NULL, 'replace_all across auth.js, app.js, home.js, orgs.js, users.js, cis.js, tabletop.js, company_profile.js, ai_hub.js, ai_tabletop.js, ma_cdd.js, config.js', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux2', 'auth', 'Authentication & User Management', 1, 19, 'Admin consolidation â€” removed Organization Manager and User Management from avatar dropdown; added both as nav items inside Settings sidebar section (platform admin gated). Settings is the single admin entry point.', true, NULL, 'auth.js: removed 3 lines from renderUserMenu(). config.js: g_settings items expanded. Sidebar Settings section now has: Org Manager, User Management, Module Management, Platform Settings, Feature Backlog, Pricing Schedule', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux3', 'auth', 'Authentication & User Management', 1, 20, 'Exercises hub â€” collapsed sidebar from 6 sub-items to single Exercises nav item. Clicking loads a card grid hub (same layout as Assessments). Cards: Exercise Hub, Tabletop Operational, Tabletop AI, Tabletop Executive/Vendor/BCDR (coming soon). Navigates to existing views.', true, NULL, 'config.js: g_exercises collapsed to single item. home.js: EXERCISE_CATALOG + renderExercisesHub(). app.js: renderMain route added for exercises. getModuleDot exclusion list updated.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux4', 'auth', 'Authentication & User Management', 1, 21, 'AI Readiness absorbed into Assessments hub â€” removed as standalone sidebar section. Added as a card in ASSESSMENT_CATALOG with AI badge. Hub button navigates to existing ai_readiness view. Internal sub-page routes unchanged.', true, NULL, 'config.js: g_ai_readiness removed. home.js: AI Readiness card added to ASSESSMENT_CATALOG with aiTag:true and aiBadge rendering. app.js: _GROUP_MODULE entry removed.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod1', 'auth', 'Authentication & User Management', 1, 22, 'Module Management â€” sellable feature package system. PATCH_032.sql creates modules, page_module_map, user_module_access tables. Admin page (Settings sidebar, platform admin only) with 2 tabs: (1) Modules CRUD table + Add/Edit modal, seed AI Readiness on first load; (2) Page Access tree with module dropdown per nav page, saves to page_module_map.', true, NULL, 'sql/SUPABASE_PATCH_032.sql â€” run manually. js/modules.js (new file): modState, modLoad(), renderModulesAdmin(), modOpenModal(), modSave(), modDelete(), modSavePageAccess(). config.js: modules nav item in g_settings. index.html: modModal div + script tag.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod2', 'auth', 'Authentication & User Management', 1, 23, 'Module access enforcement â€” nav hiding, page load guard, and hub card gating driven by page_module_map + user_module_access tables. Platform admin bypasses all checks. modAccessLoad() runs at boot and on view-as changes.', true, NULL, 'js/modules.js: modAccess state, modAccessLoad(), modAccessLoadGrants(), hasPageAccess(). app.js: modAccessLoad() in bootApp Promise.all, id added to viewAsState, modAccessLoadGrants() in viewAsUser and exitViewAs, hasPageAccess filter in buildNav visibleItems, page guard in renderMain. home.js: ASSESSMENT_CATALOG and EXERCISE_CATALOG filtered by hasPageAccess.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod3', 'auth', 'Authentication & User Management', 1, 24, 'Module access in Edit User modal â€” add Module Access section below role field. List all active modules as toggles (name, description, cost). Toggle reads from and writes to user_module_access on form save.', true, NULL, 'Edit User modal: added Add-on Modules section with toggles reading from user_module_access. submitEditUser() deletes all grants then re-inserts checked ones. _euActiveModules stores loaded modules. modAccessLoadGrants() reloads if editing the logged-in user.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux5', 'auth', 'Authentication & User Management', 1, 25, 'Getting Started banner â€” data-driven checklist on Dashboard: Organization Profile (employee_count_band populated) + Technology Stack (techstack assessment run). Amber left-border panel, disappears when both complete.', true, NULL, 'home.js: _renderGettingStartedBanner() checks orgProfiles + orgAssessments.techstack. Injected into renderHome() return before stat cards.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux6', 'auth', 'Authentication & User Management', 1, 26, 'Governance hub â€” replaced Risk & Vendors + Policies nav sections. Single Governance sidebar item loads card grid: Risk Register, Policy Library, Application Inventory (soon), Vendor Directory (soon). Note in code: Vendor Directory links to TPRA via vendor_directory_id FK on vendor_assessments.', true, NULL, 'config.js: g_risk + g_policies removed; g_governance added (single item). home.js: GOVERNANCE_CATALOG + renderGovernanceHub(). app.js: governance route in renderMain, getModuleDot exclusion, _GROUP_MODULE updated.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux7', 'auth', 'Authentication & User Management', 1, 27, 'TPRA moved to Assessments hub â€” card in ASSESSMENT_CATALOG with noScore:true flag (no score dot, shows View Assessments button). Start Here retired â€” company_profile moved to Settings sidebar as Organization Profile.', true, NULL, 'config.js: g_company_profile removed; company_profile added to g_settings. home.js: tpra added to ASSESSMENT_CATALOG with noScore:true; card render handles noScore flag. app.js: _ADMIN_PAGES updated with company_profile.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod4', 'auth', 'Authentication & User Management', 1, 28, 'page_module_map many-to-many â€” composite PK (page_key, module_id). A page can belong to multiple modules. PATCH_033 drops old single-PK table and recreates it.', true, NULL, 'modules.js: modAccess.pageMap is now {page_key: Set<module_id>}. hasPageAccess() loops the Set and grants if user holds ANY module. modState.pageMap is {page_key: {[module_id]: boolean}}. modTogglePageMap() replaces modSetPageMap(). _modRenderPageTab() rebuilt as column-per-module checkbox grid. modSavePageAccess() deletes all known-page rows then re-inserts desired pairs and reloads modAccessLoad().', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod5', 'auth', 'Authentication & User Management', 1, 29, 'Edit User â€” remove hardcoded Section Access; Module Access section driven by modules table. When a new module is added in Module Management it automatically appears as a toggle in Edit User. module_access JSON column on users always written as null to clear legacy restrictions.', true, NULL, 'users.js: removed euModuleCheck section and all references. editUserRoleChanged() simplified to org-access show/hide only. submitEditUser() always passes module_access: null. Label renamed from Add-on Modules to Module Access.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod6', 'auth', 'Authentication & User Management', 1, 30, 'PAGE_REGISTRY in modules.js â€” static list of all 21 routable pages grouped by section (Home, Assessments, AI Readiness, Governance, Exercises, Reports, M&A). modGetPages() returns PAGE_REGISTRY directly instead of deriving from NAV. Page Access tab now shows individual pages, not just hub-level items.', true, NULL, 'modules.js: PAGE_REGISTRY const added above modGetPages(). 21 pages across 7 groups. Keys match activeNav values used in renderMain(). Settings pages excluded (always platform-admin gated).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod7', 'auth', 'Authentication & User Management', 1, 31, 'Edit Module modal â€” widened from 480px to 620px; description textarea taller (4 rows, min-height 80px).', true, NULL, 'index.html: modModalBox max-width changed to 620px, width 95%. modules.js: modFldDesc rows=4, min-height:80px.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod8', 'auth', 'Authentication & User Management', 1, 32, 'hasPageAccess() whitelist mode â€” users with any module grants can ONLY access pages in their granted modules. Unassigned pages are blocked for grant-restricted users. Users with no grants are unrestricted. Org admins bypass module gating.', true, NULL, 'modules.js: hasPageAccess() now checks modAccess.grants.size > 0 to enter whitelist mode. Unassigned pages (no moduleIds) return false in whitelist mode. effectiveRole check bypasses gating for org_admin. Fixes test where module-restricted user could still see all unassigned pages.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod9', 'auth', 'Authentication & User Management', 1, 33, 'Platform Admin nav section â€” Module Management and Feature Backlog moved from Settings into a dedicated g_platform group (platformAdminOnly: true, no tierOnly items). Org admins at grandfather/father tiers can no longer access these via the pricing_schedule tierOnly loophole.', true, NULL, 'config.js: g_platform group added with modules and backlog items. Both removed from g_settings. app.js: backlog added to getModuleDot exclusion list and _ADMIN_PAGES.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod10', 'auth', 'Authentication & User Management', 1, 34, 'PAGE_REGISTRY â€” 21 routable pages listed by section (Home, Assessments, AI Readiness, Governance, Exercises, Reports, M&A). modGetPages() returns PAGE_REGISTRY instead of NAV items. Page Access tab now shows individual pages not just hub-level items.', true, NULL, 'modules.js: PAGE_REGISTRY const defined above modGetPages(). Covers all activeNav keys from renderMain(). Settings pages excluded (always platform-admin gated).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod11', 'auth', 'Authentication & User Management', 1, 35, 'Add/Edit Module modal padding â€” content was flush with modal edges. Added 1.5rem padding wrapper. Description textarea increased to 4 rows with min-height 80px. Modal widened from 480px to 620px.', true, NULL, 'modules.js: modOpenModal() wraps content in padding:1.5rem div. index.html: modModalBox max-width changed to 620px.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod12', 'auth', 'Authentication & User Management', 1, 36, 'hasPageAccess() â€” use PAGE_REGISTRY as module gate boundary. Pages not in PAGE_REGISTRY (Settings, admin tools) bypass module gating entirely and are controlled by adminOnly/platformAdminOnly flags only. Removed org_admin role bypass â€” org admins at client orgs are now module-restricted like all other users. Only platform_admin is fully exempt.', true, NULL, 'modules.js: hasPageAccess() checks PAGE_REGISTRY.some(p => p.id === pageKey) before applying whitelist logic. Pages outside the registry (orgs, users, company_profile, settings, pricing_schedule) return true immediately. Fixes org admins at client orgs seeing all features regardless of purchased modules.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mod13', 'auth', 'Authentication & User Management', 1, 37, 'ACL hardening â€” fix ''default on'' ACL holes: (1) _GROUP_MODULE key mismatch where g_governance used key ''governance'' but JSONB stores it as ''risk'' (unchecking Risk & Vendors never blocked Governance nav group); (2) pricing_schedule had no adminOnly flag and was not in PAGE_REGISTRY or _GROUP_MODULE, so it showed to any grandfather/father tier user regardless of module access; (3) Added Pricing Schedule checkbox (unchecked by default) to Create User modal.', true, NULL, 'app.js: _GROUP_MODULE[''g_governance''] fixed from ''governance'' to ''risk''; added g_settings:''pricing_schedule''. config.js: adminOnly:true added to pricing_schedule nav item. modules.js: pricing_schedule added to PAGE_REGISTRY under Settings group. users.js: Pricing Schedule checkbox added to Create User modal (unchecked by default); pricing_schedule key added to moduleAccess JSONB in submitCreateUser().', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux8', 'auth', 'Authentication & User Management', 1, 38, 'Exercises hub section grid â€” add bordered bucket layout above the stats strip, matching Governance hub design. Two buckets side by side: Cybersecurity Exercises (â†’ Cybersecurity Tabletop) and AI Governance Exercises (â†’ AI Governance Tabletop). History table gains a section label header. Empty history no longer shows a redundant empty-state card (sections always visible).', true, NULL, 'js/home.js: renderExercisesHub() merged with ex_hub data. Calls exHubEnsureOp() for async op session loading. Stats strip (total/cybersecurity/AI/breach) above grid. Two-column _govBucket grid (Cybersecurity + AI Governance, 4 items + 1 item). History table below grid with AAR buttons. ex_hub.js: exHubEnsureOp() re-renders on exercises nav too. Exercise Hub card removed from EXERCISE_CATALOG. Layout: header â†’ stats â†’ grid â†’ history.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux9', 'auth', 'Authentication & User Management', 1, 39, 'Dashboard widget module gating â€” widgets on the home dashboard are filtered by both hasPageAccess (grants table) AND hasModuleAccess (JSONB module_access). Fixes ''default on'' dashboard: users restricted to e.g. Assessments-only no longer see Risk Register, Gap Register, or Tabletop widgets. Customize panel also filtered.', true, NULL, 'js/home.js: added group field to each WIDGET_CATALOG entry mapping to nav group ID (g_assessments, g_governance, g_reporting, g_exercises â€” maturity widget has no group, always visible). renderDashWidget() now checks both hasPageAccess(def.nav) and hasModuleAccess(def.group). _renderCustomizePanel() available list filtered by same dual check.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ux10', 'auth', 'Authentication & User Management', 1, 40, 'Exercise scoring â€” Aâ€“F grade per completed exercise, performance trend sparkline at top of exercises page, tabletop dashboard widget upgraded from generic link card to score/grade/sparkline widget matching CIS/Insurance style.', true, NULL, 'js/home.js: exCalcScore(row) â€” op: severity declared (34) + breach decision (33) + log â‰¥3 entries (33); AI: inject notes (40) + discussion (30) + notif checklist (30). exGrade(score) â†’ {letter,color,bg}. renderExercisesHub() adds scored rows, performance trend card (grade letter + full-width sparkline canvas + grade legend A-F) above stats strip, Grade column in history table. _widgetTabletop(h) â€” new dashboard widget: latest grade letter big, score%, delta, 60Ã—24 sparkline, avg/count. WIDGET_CATALOG tabletop: type changed to ''tabletop'', nav to ''exercises''. drawExSparkline(canvasId) generic canvas draw via data-scores attribute. drawExPageCharts() called on exercises nav. drawHomeCharts() calls drawExSparkline(''wd-trend-tabletop''). exHubEnsureOp() re-renders on home so dashboard widget updates when op sessions arrive.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp1', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 0, 'Vendor intake: name, product, website, assessor, data categories with sensitivity labels, jurisdiction, data residency, provided docs', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp2', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 1, 'Vendor profile: company intelligence fields (legal entity, size, HQ, certifications, breach history, etc.) with Verified / Inferred / Unknown confidence labels', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp3', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 2, 'Risk findings: area, severity (Criticalâ€“Info), confidence, applies-to, detail, recommendation; vendor follow-up items list', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp4', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 3, 'Auto-suggested risk tier: data sensitivity Ã— vendor signals matrix â†’ Critical / High / Moderate / Low with manual override and rationale field', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp5', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 4, 'Review & publish: assessment summary, save as draft, complete, edit, delete from list', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp6', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 5, 'Supabase persistence: full CRUD against vendor_assessments table (PATCH_005)', true, NULL, 'Code complete. WARNING: vendor_assessments table is missing from the live DB â€” sql/SUPABASE_PATCH_005.sql needs to be re-run in the Supabase SQL Editor to restore it before TPRA saves will work.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp7', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 6, 'Copy report prompt for Claude: pre-filled prompt to generate a .docx vendor risk report', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp8', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 7, 'Push High/Critical findings to Risk Register as Third-Party risk entries on completion', false, NULL, 'Checkbox UI is already in place on Step 5. Blocked by Risk Register module (Phase 2). Wire up once risk_register_core is built.', '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp9', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 8, 'Native PDF export of completed vendor risk assessment (Abbott Cyber branded)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp10', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 9, 'Vendor register: filter and sort assessment list by tier, status, data sensitivity, or assessor', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp11', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 10, 'Technical OSINT Layer: structured sub-step for active public-surface checks â€” port/TLS exposure (Shodan/Censys), certificate hygiene (crt.sh), email security records (SPF/DKIM/DMARC DNS lookup), and credential leak history (HIBP). Makes technical findings independently defensible rather than reliant on vendor self-reporting.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp12', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 11, 'Structured CVE Pass: dedicated NVD/CVE search step against the product name, GitHub security advisories, and vendor changelog. Current skill catches CVEs opportunistically; a structured pass catches quieter vulnerabilities.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp13', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 12, 'Risk Rating Framework Anchor: add one methodology note anchoring the impact/likelihood matrix to NIST SP 800-30. No workflow change â€” purely a defensibility and audit-readiness addition.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp14', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 13, 'Data Taxonomy Expansion: add CUI, ITAR-controlled technical data, IP/source code, and OT/SCADA to the default data category checklist. Expands TAM to CMMC clients, defense-adjacent, and industrial verticals. ITAR and Canadian frameworks are currently absent from all competing platforms.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tp15', 'tpra', 'Third-Party Risk Assessment (TPRA)', 1, 14, 'Periodic Reassessment Tracking: add a next-review date field and documented re-trigger conditions (ownership change, breach disclosure, major version release) to the report output. Converts a point-in-time artifact into a recurring program item.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s30', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 0, 'Define three-tier org model: Grandfather (MSP/Franchisor) â†’ Father (Region/Group) â†’ Child (Site/Client)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s31', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 1, 'Grandfather tenant: full visibility across all Father and Child orgs', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s32', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 2, 'Father tenant: manages and reports across its own Child orgs only', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s33', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 3, 'Child tenant: self-contained org with own data, assessments, and users', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s34', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 4, 'Role-based access control enforced at each tier (no cross-tenant data leakage)', true, NULL, 'Complete at the app layer: auth roles (platform_admin/org_admin/analyst/viewer) gate all visibility via visibleOrgs() and the org switcher â€” no cross-tenant data leakage in the UI. DB-level RLS is additive hardening tracked separately under auth4 (PATCH_010).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s35', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 5, 'MSP use case: Grandfather = MSP, Father = MSP client group or vertical, Child = end client', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s36', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 6, 'Franchise use case: Grandfather = Franchisor HQ, Father = Regional operator, Child = individual location', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s37', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 7, 'Child orgs can be onboarded by Father or Grandfather with templated baseline configs', true, NULL, 'Complete for the current scope: any admin at Father or Grandfather tier can create child orgs via Org Manager. Templated baseline configs interpreted as the org profile, IG goal, and industry fields set at creation â€” no automated config propagation is planned in this phase.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s38', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 8, 'Grandfather can push policy baselines and compliance frameworks down to all tiers', true, NULL, 'Complete for the current scope: Grandfather-tier admins can run CIS, CMMC, Insurance, and Tech Stack assessments against any child org via the org switcher. Framework visibility and assessment access is scoped by tier. Automated push/propagation of baselines is a future Phase 3 feature if needed.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s39', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 9, 'Each tier can have its own branding (white-label support for MSP resellers)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s40', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 10, 'Audit log: track who accessed or modified data at each tier', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s41a', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 11, 'Org Manager â€” show unplaced organisations: orgs not rendered in the main hierarchy tree (wrong tier/parent combo) appear in an amber warning card with Edit access so they can be corrected', true, NULL, 'Session 39: renderOrgManager() in js/orgs.js refactored to track renderedIds Set during tree traversal. Any org not in renderedIds is collected into orphans[] and rendered in a separate amber-bordered card below the tree. Badge shows unplaced count in subtitle. Parent_id fragment shown as diagnostic. orgTreeActions() buttons (Edit/View/Delete) work normally from the unplaced card.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s42a', 'hierarchy', 'Org Hierarchy â€” Grandfather / Father / Child Model', 1, 12, 'Consolidated risk dashboard at father and grandfather tiers â€” when viewing as a father or grandfather org, the home dashboard shows aggregated scores across all child/grandchild entities instead of a single-org view. Per-entity score cards, worst performers, top gaps across the portfolio, with drill-down to individual org.', true, 'High', 'Complete. _portfolioScopeOrgs() in home.js detects father/grandfather tier and includes all children/grandchildren in scope. loadHomePortfolio() loads assessments for every scoped org and builds per-entity composite scores + risk counts. _homePortfolioBreakdown() renders per-entity score table (CIS/Insurance/Tech Stack columns) sorted by composite score. Stat cards show aggregated portfolio totals.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s41', 'grandfather_reporting', 'Grandfather â€” Consolidated Reporting', 2, 0, 'Grandfather dashboard: aggregate security score across all Father and Child orgs', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s42', 'grandfather_reporting', 'Grandfather â€” Consolidated Reporting', 2, 1, 'Heatmap view: which Child orgs are highest risk across the portfolio', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s43', 'grandfather_reporting', 'Grandfather â€” Consolidated Reporting', 2, 2, 'Cross-org trend line: portfolio-wide score over time', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s44', 'grandfather_reporting', 'Grandfather â€” Consolidated Reporting', 2, 3, 'Filter/slice by Father group, industry vertical, region, or framework', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s45', 'grandfather_reporting', 'Grandfather â€” Consolidated Reporting', 2, 4, 'Common control gap report: which CIS/NIST controls are failing most across children', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s46', 'grandfather_reporting', 'Grandfather â€” Consolidated Reporting', 2, 5, 'Portfolio-level PDF report: executive summary + per-org breakdown', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s47', 'grandfather_reporting', 'Grandfather â€” Consolidated Reporting', 2, 6, 'Flagged orgs report: Children with sustained low scores or critical open findings', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s48', 'grandfather_reporting', 'Grandfather â€” Consolidated Reporting', 2, 7, 'Remediation velocity tracking: how fast are Child orgs closing gaps', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s49', 'father_reporting', 'Father â€” Group Consolidated Reporting', 2, 0, 'Father dashboard: aggregate score across own Child orgs only', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s50', 'father_reporting', 'Father â€” Group Consolidated Reporting', 2, 1, 'Side-by-side Child org comparison: score, open findings, last assessment date', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s51', 'father_reporting', 'Father â€” Group Consolidated Reporting', 2, 2, 'Father-level gap analysis: common weaknesses shared across its children', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s52', 'father_reporting', 'Father â€” Group Consolidated Reporting', 2, 3, 'Group PDF report: exportable for Father-level client or regional review', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s53', 'father_reporting', 'Father â€” Group Consolidated Reporting', 2, 4, 'Escalation view: surface Children that need urgent attention to Father admins', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s54', 'father_reporting', 'Father â€” Group Consolidated Reporting', 2, 5, 'Father can submit consolidated report upward to Grandfather on demand', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s11', 'vuln_scan', 'Phase 2 â€” Vuln Scan Integration', 2, 0, 'Import Nessus / Qualys / OpenVAS XML/CSV output', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s12', 'vuln_scan', 'Phase 2 â€” Vuln Scan Integration', 2, 1, 'Map CVEs to CIS / NIST control families', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s13', 'vuln_scan', 'Phase 2 â€” Vuln Scan Integration', 2, 2, 'CVSS scoring overlay on posture score', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s14', 'vuln_scan', 'Phase 2 â€” Vuln Scan Integration', 2, 3, 'Trend tracking: score change over time', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s15', 'nist_expansion', 'Phase 3 â€” Framework Expansion (NIST)', 3, 0, 'Map CIS controls to NIST CSF 2.0 categories', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s16', 'nist_expansion', 'Phase 3 â€” Framework Expansion (NIST)', 3, 1, 'NIST CSF function dashboard: Govern / Identify / Protect / Detect / Respond / Recover', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s17', 'nist_expansion', 'Phase 3 â€” Framework Expansion (NIST)', 3, 2, 'Maturity tier scoring (Partial â†’ Adaptive)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s18', 'nist_expansion', 'Phase 3 â€” Framework Expansion (NIST)', 3, 3, 'Support for NIST SP 800-53 control families', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s19', 'nist_expansion', 'Phase 3 â€” Framework Expansion (NIST)', 3, 4, 'Optional: SOC 2 / ISO 27001 crosswalk', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s20', 'pentest', 'Pen Test Integration', 3, 0, 'Manual finding entry (severity, affected system, control)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s21', 'pentest', 'Pen Test Integration', 3, 1, 'Import from common pen test report formats', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s22', 'pentest', 'Pen Test Integration', 3, 2, 'Findings mapped to MITRE ATT&CK techniques', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s23', 'pentest', 'Pen Test Integration', 3, 3, 'Remediation tracking: open / in progress / closed', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s24', 'reporting', 'Reporting & Output', 2, 0, 'Executive dashboard: single score + risk summary', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s25', 'reporting', 'Reporting & Output', 2, 1, 'Technical drill-down per control / domain', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s26', 'reporting', 'Reporting & Output', 2, 2, 'Branded PDF report export (client-facing)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s27', 'reporting', 'Reporting & Output', 2, 3, 'Comparison view: current vs previous assessment', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('s28', 'reporting', 'Reporting & Output', 2, 4, 'Roadmap recommendations sorted by impact vs effort', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('vciso1', 'vciso_program', 'vCISO Program Record System', 2, 0, 'Client Record & Program History Store: per-client record holding all uploaded artifacts organized by month and type (monthly report, assessment, TPRA, policy, tabletop, meeting notes). Builds a program timeline automatically from ingestion date and document type. No data entry beyond the upload itself.', false, 'High', 'Foundational â€” all other vCISO program features depend on this store.', '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('vciso2', 'vciso_program', 'vCISO Program Record System', 2, 1, 'Monthly Report Ingestion & Signal Extraction: on upload of a monthly report (Word/PDF), extract key signals via AI â€” risk posture indicators, open action items, framework areas touched, deliverables referenced. Present extracted signals to the vCISO for a quick confirm/correct step before storing.', false, 'High', 'Core AI intelligence layer. Turns unstructured document into structured program data without requiring the vCISO to change their report format.', '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('vciso3', 'vciso_program', 'vCISO Program Record System', 2, 2, 'Hours Input â€” Lightweight, Not a Timesheet: single input per month per client â€” hours consumed, hours budgeted, optional activity tag. No timesheets, no per-task logging. The vCISO loads the number however they track it; the tool stores the result.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('vciso4', 'vciso_program', 'vCISO Program Record System', 2, 3, 'Client Health Dashboard (practitioner-facing): portfolio view showing all clients at a glance â€” burn rate vs. retainer, last activity date, open action items count, months of program history. Surfaces clients burning hot or going dark before it becomes a problem.', false, 'High', 'Built for the vCISO, not the client. Practitioner-facing only.', '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('vciso5', 'vciso_program', 'vCISO Program Record System', 2, 4, 'Client Portal â€” Program View (client-facing): thin read-only view for the client â€” program timeline, deliverables received, risk posture trend, open action items, document library. Derived entirely from ingested artifacts â€” no additional data entry to populate it. Answers ''what are we paying for?'' before it gets asked.', false, 'Low', 'Build after ingestion layer (vciso1, vciso2) is stable and trusted. Phase 3 candidate.', '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r1', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 0, 'Risk ID: auto-generated unique identifier per risk entry (e.g. RSK-0042)', true, NULL, 'PATCH_047: sequence risk_register_seq, column risk_id text UNIQUE, BEFORE INSERT trigger tg_risk_register_risk_id() sets RSK-NNNN (zero-padded to 4 digits). Backfill block assigns IDs to existing rows in created_at order. Trigger fires for both manual inserts and SECURITY DEFINER sync functions. js/risk_register.js: added ''ID'' column header + monospace RSK-NNNN cell to both normal and inline-edit row renderers. getForOrg() returns * so no supabase.js change needed.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r2', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 1, 'Risk Title: short descriptive name of the risk', true, NULL, 'Covered by risk_control_categories.control_name (e.g. ''Account Management''). One row per CIS Control.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r3', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 2, 'Risk Description: full narrative of what the risk is and how it arises', true, NULL, 'risk_control_categories.threat_scenario provides the risk narrative. Shown in Accept modal.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r4', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 3, 'Risk Category: dropdown (Operational / Technical / Compliance / Third-Party / Physical / Strategic)', false, NULL, 'Not in current architecture â€” CIS control group is the category. Could add asset_type column to UI.', '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r5', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 4, 'Affected Asset / System: what is exposed (server, app, process, data type)', true, NULL, 'risk_subcontrols.asset_type carries this per safeguard (Devices/Network/Data/Users/Applications/N/A).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r6', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 5, 'Threat Source: internal / external / natural / third-party', true, NULL, 'Built. SUPABASE_PATCH_039.sql adds threat_source text column (CHECK: Internal/External/Natural/Third-Party, nullable) to risk_register. Field added to Add, Edit Manual, and Edit Notes modals in js/risk_register.js via rrSelect(). All three submit handlers (rrSubmitAdd, rrSubmitEditNotes, rrSubmitEditManual) include threat_source in payload. Displayed as colour-coded chip under risk title in rrRow() â€” amber=Internal, blue=External, green=Natural, purple=Third-Party. No new column in table.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r7', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 6, 'Likelihood: scored 1â€“5 (Rare / Unlikely / Possible / Likely / Almost Certain)', true, NULL, 'Superseded. Replaced by inherent_risk_score (1â€“4) pre-seeded per CIS control group. No separate likelihood field required.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r8', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 7, 'Impact: scored 1â€“5 (Negligible / Minor / Moderate / Major / Critical)', true, NULL, 'Superseded. Replaced by inherent_risk_rating (Critical/High/Medium/Low) pre-seeded per CIS control group. No separate impact field required.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r9', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 8, 'Inherent Risk Score: auto-calculated Likelihood Ã— Impact (1â€“25)', true, NULL, 'risk_register.inherent_risk_score (1â€“4 scale) copied from risk_control_categories at row creation.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r10', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 9, 'Current Controls: describe existing mitigations in place', false, NULL, 'CIS safeguard answers (yes/no/partial) are the control evidence. No free-text control description field yet.', '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r11', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 10, 'Control Effectiveness: rated Low / Medium / High', true, NULL, 'Replaced by weighted pass rate from safeguard answers: yes=100%, partial=50%, no=0%.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r12', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 11, 'Residual Risk Score: adjusted score after control effectiveness applied', true, NULL, 'risk_register.residual_risk_rating (Critical/High/Medium/Low). Editable by user in Edit Notes modal (POAM rows) or Edit modal (manual rows). Not auto-calculated â€” requires practitioner judgement. PATCH_015.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r13', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 12, 'Risk Treatment: dropdown (Accept / Mitigate / Transfer / Avoid)', true, NULL, 'PATCH_015: risk_status = Open / In Progress / Accepted / Closed / Transferred. Accept via modal (accepted_by, rationale, review date) for manual risks. Transfer flows from POAM risk_decision=''transfer''. Manual risks can be edited to any status. POAM-sourced statuses sync from POAM â€” not changeable in risk register.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r14', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 13, 'Treatment Plan / Notes: free-text field for planned remediation actions', true, NULL, 'risk_register.treatment_notes. Editable in Edit Notes modal (POAM rows) and Edit modal (manual rows). PATCH_015.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r15', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 14, 'Risk Owner: person or role accountable for this risk', true, NULL, 'risk_register.risk_owner. Present for all risk types, editable in Edit Notes (POAM) and Edit (manual) modals. PATCH_015.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r16', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 15, 'Review Date: scheduled next review date', true, NULL, 'risk_register.acceptance_review_date. Set at acceptance time, default 1 year. Shown in table row sub-line.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r17', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 16, 'Date Identified: when the risk was first logged', true, NULL, 'risk_register.created_at â€” set when first CIS assessment triggers initialize_risk_register.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r18', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 17, 'Last Updated: timestamp of most recent edit', true, NULL, 'risk_register.updated_at + last_calculated_at. Shown in module header.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r19', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 18, 'Status: Open / In Remediation / Accepted / Closed', true, NULL, 'PATCH_015: risk_status = Open / In Progress / Accepted / Closed / Transferred. Filter tabs in UI. Accepted = won''t fix (formal risk acceptance). Closed = remediated. Transferred = cyber insurance or third-party.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r20', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 19, 'Framework Mapping: link risk to CIS control / NIST CSF function / ISO domain', true, NULL, 'risk_register.framework_id â†’ risk_frameworks (CIS_V8). Abstraction layer ready for NIST CSF / NIST AI RMF.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r21', 'risk_register_core', 'Risk Register â€” Core Structure & Columns', 2, 20, 'Org Tier: tag risk to Child / Father / Grandfather level (for hierarchy rollup)', true, NULL, 'risk_register.org_id â†’ organisations. Hierarchy is derived from the org. Rollup view is a future phase item.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r22', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 0, 'Inline editable rows â€” edit any field without opening a separate modal', true, NULL, 'rrStartEdit(id)/rrCancelEdit()/rrSaveInline(id)/rrInlineVal(id,field) in risk_register.js. rrRow() checks rrState.editingId â€” if match, renders inputs in-place (blue tinted row). POAM rows: editable = threat_source, residual, owner, due, treatment notes. Manual rows: all fields. Treatment notes textarea in actions cell. Edit/Edit Notes modal buttons replaced with single ''Edit'' inline trigger. Accept modal remains.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r23', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 1, 'Risk matrix heatmap view: plot all risks on a 5Ã—5 likelihood vs impact grid', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r24', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 2, 'Filter/sort by category, status, owner, residual score, or date', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r25', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 3, 'Bulk status update: mark multiple risks accepted or closed at once', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r26', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 4, 'Risk aging alert: flag risks not reviewed within defined period (e.g. 90 days)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r27', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 5, 'Auto-populate risks from assessment findings (vuln scan, pen test, survey gaps)', true, NULL, 'PATCH_015: sync_cis_poam_to_risk_register(p_org_id, p_assessment_id) DB function upserts one risk_register row per POAM item. Called from cisSavePoam() fire-and-forget after every POAM save. PATCH_017 (session 23d): redesigned to one row per CIS Control Group (18 max) rather than one per safeguard. Aggregates all gap safeguards into one risk entry per control â€” status uses worst-case logic (Open beats all), gap list embedded in risk_description. Stable key changed to UNIQUE(org_id, control_number). Ref column in UI shows ''CIS 04'' etc.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r28', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 6, 'Link risks to open remediation tasks or roadmap items', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r29', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 7, 'Grandfather/Father can view child org risk registers in read-only mode', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r30', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 8, 'Risk register change log: who changed what and when', true, NULL, 'ig_change_log and risk_acceptance_log tables in PATCH_014 capture all change events. No UI view yet.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rr_a', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 9, 'Overdue acceptance review alert â€” flag risk_register rows where acceptance_review_date < today with a warning badge in the table', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rr_b', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 10, 'CIS POAM deep-link from Risk Register control row â€” button to jump to the CIS POAM filtered to that control''s failing safeguards', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rr_c', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 11, 'TPRA push integration â€” wire the ''push to risk register'' checkbox on TPRA Step 5 now that risk_register table exists; push Critical/High TPRA findings as Control 15 risk entries', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rr_d', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 12, 'Nav score dot for Risk Register â€” red if any Critical residual rating, amber if any High, green if all Low or below', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rr_e', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 13, 'Risk register backfill button â€” ''Sync from latest POAM'' button in the Risk Register header that calls sync_cis_poam_to_risk_register for the org''s most recent CIS assessment. Needed because existing POAM data won''t appear until a POAM is re-saved after PATCH_015.', true, NULL, 'â†» Sync from POAM button added to risk register module header. rrSyncFromPoam() finds latest CIS assessment from orgAssessments[], calls sb.riskRegister.sync(), reloads rows, refreshes view. Also: sync errors in cisSavePoam() now show a red toast instead of being silently swallowed. PATCH_016 adds RLS policies + GRANT EXECUTE for sync function. Session 23 bug fix: rrSyncFromPoam() was calling .filter() on orgAssessments[orgId] (an object keyed by module, not an array) â€” silent TypeError before try/catch made button appear unresponsive. Fixed to orgAssessments[orgId][''cis''] || []. Also fixed sort field assessed_at â†’ date to match the stored property name. Session 23b bug fix: sync was only calling against latest assessment ID; if POAM was saved on an older assessment the function found 0 rows and inserted nothing. Fixed to iterate ALL CIS assessment IDs oldestâ†’newest so most recent POAM data wins on upsert conflicts. Session 23c: cisCollectPoamData() previously skipped rows where no POAM fields were filled in â€” this meant risk register stayed empty until each gap was manually assigned. Now ALL gaps (No/Partial safeguards) are saved to cis_poam_items on every POAM save; blank rows get risk_rationale = ''POAM not yet completed â€” assign owner, target date, and risk decision.'' as a placeholder.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rr_f', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 14, 'Risk register POAM deep-link improvement â€” the ''â†’ POAM'' button currently navigates to the CIS module root. Improve to open the specific assessment POAM directly (poam_assessment_id is already stored on each risk_register row; need app.js to route to it via cisOpenPoam).', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rr_g', 'risk_register_ux', 'Risk Register â€” UX & Workflow', 2, 15, 'AI POAM â†’ Risk Register: activate and verify end-to-end flow â€” PATCH_020 must be run in Supabase SQL Editor before this works. JS code is complete (session 26): _aiuBuildRrItems(), aiuSavePoam() fire-and-forget sync, sb.riskRegister.syncAi(), rrSyncFromAiPoam(), rrRow() AI Gov badge. After running the patch, test: (1) open AI Governance POAM, assign status/owner/date to a few gaps, save â€” confirm AI Gov rows appear in Risk Register; (2) ''â†» AI Gov'' sync button in Risk Register header; (3) Edit Notes modal shows correct AI Gov badge; (4) ''â†’ POAM'' button navigates to ai_unified.', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r31', 'risk_register_export', 'Risk Register â€” Excel Export', 2, 0, 'One-click export of full risk register to .xlsx', true, NULL, 'rrExportExcel() in risk_register.js â€” exports all rows sorted by inherent rating, 15 columns (Risk ID, Source, Ref, Risk Title, Description, Threat Source, Inherent/Residual Rating, Status, Owner, Due Date, Treatment Notes, Accepted By, Acceptance Rationale, Review Date). Filename: Risk_Register_[OrgName]_[date].xlsx. Button in module header.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r32', 'risk_register_export', 'Risk Register â€” Excel Export', 2, 1, 'All columns exported with correct data types (dates as dates, numbers as numbers)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r33', 'risk_register_export', 'Risk Register â€” Excel Export', 2, 2, 'Inherent and residual scores auto-colour coded in Excel (red / amber / green) via conditional formatting', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r34', 'risk_register_export', 'Risk Register â€” Excel Export', 2, 3, 'Risk matrix tab: 5Ã—5 heatmap generated as a second Excel sheet', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r35', 'risk_register_export', 'Risk Register â€” Excel Export', 2, 4, 'Summary tab: total risks by category, status, and treatment type', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r36', 'risk_register_export', 'Risk Register â€” Excel Export', 2, 5, 'Filter/sort preserved on export (export respects active filters)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r37', 'risk_register_export', 'Risk Register â€” Excel Export', 2, 6, 'Client-branded header row with org name, export date, and framework version', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r38', 'risk_register_export', 'Risk Register â€” Excel Export', 2, 7, 'Grandfather consolidated export: one workbook with one sheet per Child org', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('r39', 'risk_register_export', 'Risk Register â€” Excel Export', 2, 8, 'Export history log: record of who exported and when (audit trail)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t1', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 0, 'Tabletop exercise library: pre-built MITRE ATT&CK aligned scenarios (ransomware, BEC, insider, supply chain, DDoS, data breach)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t2', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 1, 'Operational track: IT/security team with vCISO facilitator console', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t2a', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 2, 'Executive track (C-suite/board)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t2b', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 3, 'Vendor/Third-Party track', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_engine', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 4, 'Reusable tabletop engine: shared JS module (tabletop_engine.js) handling scenario loading (DB + built-in fallback), branching inject navigation, inject path tracking, rubric scoring, and mode support (local/remote)', true, NULL, 'Session 86: js/tabletop_engine.js (new, 281 lines). tteState, tteNormalise(), tteLoadDbScenarios(), tteGetScenarioList(), tteLoadScenario(), tteInitEngine(), tteCurrentInject(), tteBranches(), tteHasMultipleBranches(), tteNavigate(branchId), ttePrev(), tteCanGoBack(), tteIsLastInject(), ttePathJson(), tteRestorePath(). Rubric: TTE_DEFAULT_RUBRIC (5 dims), tteRubricDimensions(), tteSetRubricScore(), tteRubricGrade(). UI: tteRenderBranchPanel(). PATCH_049: tabletop_scenarios table + mode/scenario_db_id/inject_path/rubric_scores on tabletop_sessions. tabletop.js updated: mode selector in setup, tteInitEngine() called at launch, _ttAdvance() shared helper, ttSaveAndBranch(), ttPrevInject() uses ttePrev(). All 7 built-in scenarios continue to work unchanged.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_engine_rubric_ui', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 5, 'AAR rubric scoring: post-exercise facilitator scores 5 dimensions Ã— 1â€“5, notes per dimension, saves to rubric_scores on tabletop_sessions, generates Aâ€“F grade that feeds the exercise trend line', true, 'High', 'Session 87: ttRenderRubricCard() in tabletop.js renders scoring form (5 dims Ã— 1â€“5 buttons + notes + live grade preview) at top of AAR. ttSetRubricDim(), ttSaveRubric(), ttEditRubric() manage state and Supabase save. History AAR shows saved rubric read-only. exCalcScore() in home.js updated to use rubric_scores first (overrides proxy completion score) â€” trend line and grade automatically reflect facilitator judgement once scored. Both op session row-building locations updated to pass rubric_scores.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t3', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 6, 'Scenario builder UI: create custom exercises with branching inject trees stored in tabletop_scenarios table; WYSIWYG inject editor with branch options, facilitator notes, role prompts, MITRE mapping', true, 'High', 'js/scenario_builder.js â€” full CRUD module. List view (custom + built-in read-only with Clone). Editor: metadata, Step 0 declaration, inject accordion (phase, MITRE, criticality, roles, prompts, branches). Save draft / Publish to tabletop_scenarios table. Published scenarios auto-appear in exercise runner via existing tteLoadDbScenarios(). SQL: SUPABASE_PATCH_050.sql. Nav: Platform Admin â†’ Scenario Builder. State: sbState in config.js.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t4', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 7, 'Scenario metadata: industry relevance tags, estimated duration, difficulty, required participants', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t5', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 8, 'Map each scenario to NIST IR phases and MITRE ATT&CK tactics/techniques', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t6', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 9, 'Exercise scheduling: set date, time, participants, and facilitator per exercise', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t7', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 10, 'Recurring schedule support: annual, semi-annual, or quarterly cadence per track', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t8', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 11, 'Exercise status tracking: Planned / In Progress / Completed / Overdue', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t9', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 12, 'Facilitator guide: inject sequence, facilitator notes, timing cues, correct criticality per inject', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t10', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 13, 'Participant invite system: send exercise brief and pre-read materials ahead of session', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t10a', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 14, 'Email delivery option for remote participants (notify by email instead of dashboard)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t10b', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 15, 'Scenario Library (platform-layer): pre-built scenarios by threat profile and vertical â€” ransomware, BEC/wire fraud, AiTM credential theft, supply chain compromise, regulatory audit surprise. Scenarios include timed injects, role mapping pre-populated from client onboarding data, and frequency tracking for compliance programs (HIPAA, CMMC, cyber insurance).', true, NULL, 'Session 91: js/scenario_library.js. renderScenarioLibrary() â€” filter bar (industry/threat/compliance/difficulty), card grid, compliance alert banner, last-run tracking, per-card role hints. TT_SCENARIO_LIBRARY_META, SL_COMPLIANCE. Two new TT_SCENARIOS: aitm_cred_theft, reg_audit_surprise. Session 92: Expanded to 20 scenarios total â€” PATCH_051 seeded 8 platform scenarios (BCDR/Executive/AI/PCI tracks), PATCH_054 added 6 more AI Governance scenarios (NIST AI RMF aligned: training data exposure, supply chain attack, excessive agency, chatbot data leak, AI phishing, rogue automation). Exercise Type added as first filter (SL_TRACK_LABELS). Scenario cards changed to horizontal scroll row. PATCH_052 fixed RLS policies on tabletop_scenarios. PATCH_053 fixed Commonwealth English in live DB data. Fixed double /rest/v1/ prefix bug in slEnsureData query. tabletop.js updated to fall back to tteState.scenario for DB scenarios (UUID ids).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('sl3', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 16, 'The exercises landing page shows performance stats but has no way to reach the completed exercise list or AAR views. Add a "View Exercise History" button or a compact recent-runs table at the bottom of the exercises page so facilitators can review past sessions without navigating elsewhere.', true, 'Low', 'Session 92: Past Exercises table added below horizontal scenario scroll row in scenario_library.js. Shows date, scenario, type, severity, breach outcome. Clickable rows navigate to read-only AAR via slViewAAR(sessionId) â€” loads session+responses+notifChecks from Supabase, reconstructs ttState, renders AAR with Back to Exercises button. tabletop.js updated to support ttState.readonly flag.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('sl4', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 17, 'The Scenario Builder track dropdown only offers Operational, Executive, Vendor. PATCH_051 introduced bcdr/ai/pci tracks for DB scenarios but the builder can''t set them. Add these options to the track selector in sb-track so custom scenarios can be assigned to any track.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('sl5', 'tabletop_core', 'Tabletop Program â€” Core Framework', 3, 18, 'The Past Exercises table shows date, scenario, type, severity, breach. Add a Score column (objective % from rubric or proxy) once rubric scoring is consistently populated â€” ties into the existing exCalcScore() function.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_ui_1', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 0, 'Inject card UI redesign: rebuilt ttRenderInject() with game-card layout â€” phase-coloured header band (detection/containment/eradication/recovery/post), MITRE tags, role pips with primary dimming, compact role response rows with colour-coded icons, criticality cycle button. New NIST dot tracker. All CSS in modules.css (tt-* classes), role/breach colour vars in core.css. Matching Cowork design spec exactly.', true, 'High', 'js/tabletop.js: ttRenderInject() rebuilt, helpers ttNewAppBar(), ttNewNistBar(), ttRenderGameCard(), ttRenderRoleRows(), ttCycleCrit() added. css/core.css: --role-ic/tl/cl/lc/es + breach vars. css/modules.css: full tt-* class block. Design refs: tabletop_design_spec.md, tabletop_sample_inject_screen.html.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t11', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 1, 'Scenarios: ransomware via phishing (built), BEC wire fraud (built), active directory compromise, cloud misconfiguration, credential theft', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t11a', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 2, 'Step 0 â€” TL Declaration: Technical Lead receives raw signal, assigns severity (P1â€“P4), recommends declare or monitor before IR plan activates', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t11b', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 3, 'vCISO commentary card: exercise briefing shown at launch explaining TL declaration flow and participant roles', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t11c', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 4, 'Three ingestion points: SOC alert, technician anomaly, PSA customer ticket', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t12', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 5, 'Role-filtered inject cards: each role sees situation-appropriate information per inject', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t12a', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 6, 'Roles: Incident Commander (vCISO), Technical Lead, Communications Lead, Legal/Compliance, Executive Sponsor (assumed by ops participant)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t12b', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 7, 'Executive Sponsor role card: displayed at breach declaration gate explaining assumed-role mindset and responsibilities', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t13', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 8, 'Playbook alignment: map exercise steps to existing IR / DR playbooks', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t14', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 9, 'Gap identification: note where playbook breaks down or team is unsure during exercise', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t15', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 10, 'Tool availability check: confirm which tools/systems would be available during a real incident', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t16', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 11, 'Escalation path practice: comms test baked into role-specific injects', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t17', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 12, 'Real-time response log: each role logs actions and decisions per inject', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t18', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 0, 'Scenarios: ransomware with ransom demand decision, regulatory breach notification, reputational crisis, M&A cyber due diligence failure, cyber insurance claim', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t19', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 1, 'Business impact framing: scenarios presented in revenue, reputation, and regulatory terms â€” not technical', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t20', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 2, 'Decision inject cards: executives presented with choices â€” pay/don''t pay, notify/delay, shut down/continue operations', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t21', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 3, 'Legal & regulatory prompts: when does GDPR/PIPEDA breach notification clock start, who is the regulator', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t22', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 4, 'Board communication exercise: draft a stakeholder communication under simulated pressure', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t23', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 5, 'Insurance review prompt: what does the policy cover, what are the exclusions', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t24', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 6, 'Executive debrief template: document decisions made, rationale, and what would be done differently', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t25', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 7, 'Cyber risk appetite discussion: use exercise outcome to calibrate exec risk tolerance', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t26', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 0, 'Scenarios: critical vendor ransomware impact, supply chain compromise (SolarWinds-style), vendor data breach exposing client data, vendor going dark during incident', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t27', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 1, 'Vendor notification drill: how and when does the vendor notify you, is it in the contract', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t28', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 2, 'Shared responsibility mapping: who owns what during a vendor-side incident', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t29', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 3, 'Vendor IR plan review: does the vendor have an IR plan, can you see it, does it meet your standards', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t30', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 4, 'Substitution/continuity exercise: if this vendor went offline for 72hrs, what is the fallback', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t31', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 5, 'Contractual gap identification: log SLA/notification gaps discovered during the exercise', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t32', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 6, 'Vendor scorecard update: findings from exercise feed back into vendor risk register', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t33', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 0, 'After Action Report (AAR): auto-generated from facilitator notes, response logs, and criticality ratings captured during exercise', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t34', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 1, 'AAR sections: summary metrics, TL declaration accuracy, MITRE mapping revealed, criticality accuracy by role, full event timeline, breach declaration record, IR plan comparison', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_aar_mitre_1', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 2, 'Static visual rendered at session end showing the full scenario branch tree with the path the team actually took highlighted. Taken nodes in cyan, avoided branches dimmed/dashed, unreached nodes grayed. Built from inject_path on tabletop_sessions and MITRE tactic/technique tags on each inject node.', true, 'High', 'Session 93: ttRenderMitrePath() in js/tabletop.js. Builds displayPath from tteState.injectPath â€” ordered sequence of inject indices visited, including final inject derived from last branch taken. Classifies each inject as taken/avoided/unreached. Renders horizontal scroll row of node cards (185px each, cyan border for taken, dashed for avoided, gray for unreached), with arrow connectors. Avoided branches stacked below their parent node. Unreached section appended if any nodes were never accessible. slViewAAR() in scenario_library.js updated to restore tteState.injectPath from session.inject_path after tteInitEngine() so readonly AAR shows correct path. Called from ttRenderAAR() after summary metrics.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_aar_mitre_2', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 3, 'Step-through replay of the session â€” each inject lights up on the MITRE tactic timeline in sequence. Facilitator or client steps forward and backward inject by inject during debrief. Shows inject delivered, branch taken, and MITRE technique triggered. Built entirely from existing session data.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t34a', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 4, 'IR plan comparison â€” automated: upload ratified IR plan document and auto-compare against exercise event log', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t35', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 5, 'Action items log: capture owners, due dates, and priority for each identified gap', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t36', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 6, 'Action items linked to risk register: gaps auto-create or update risk entries', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t37', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 7, 'Action item tracking: open / in progress / closed with due date alerts', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t38', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 8, 'Exercise history: full log of all exercises run per org with AAR attached', true, 'High', 'Session 18: js/ex_hub.js â€” Exercise Hub unified view combining Operational tabletop (from tabletop_sessions table via sb.tt.listCompletedForOrg) and AI Governance tabletop (from orgAssessments[id][''ai_tabletop'']). Stat strip (total/op/ai/breach count), sortable table with date/track badge/scenario/facilitator/outcome/activity/View AAR. exHubViewOpAAR() and exHubViewAiAAR() navigate to respective modules with history pre-loaded. Operational tabletop history also added inline below the New Exercise card in ttRenderSetup(). Nav item ex_hub added to g_exercises group in config.js.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t39', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 9, 'Trend view: which gaps recur across multiple exercises over time', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t40', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 10, 'Grandfather/Father visibility: view exercise completion status across Child orgs', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t41', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 11, 'Export AAR to PDF: branded, client-ready after action report (Anthropic API)', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t42', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 12, 'Export action items to Excel: same format as risk register for consistency', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t43', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 13, 'Compliance evidence: mark exercises as evidence for NIST / ISO / SOC 2 audit readiness', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t44', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 14, 'Vendor Breach Scenario Inject: post-TPRA, offer to generate a one-page tabletop scenario pre-populated from the assessment â€” data categories exposed, regulatory notification clock (jurisdiction already captured at intake), decision-maker identification, cyber insurance trigger, and DPA contractual rights. No manual prep required.', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t45', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 15, 'Findings-to-Remediation Loop: tabletop gaps (missing DPA, unknown notification timeline, no IR decision tree) output as structured action items in the same format as TPRA findings â€” feeding directly into the client''s risk register and remediation roadmap. Closes the loop no competing platform currently closes.', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp1', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 0, 'Session host: vCISO creates a session and receives a unique 6-character session code (e.g. CYBER4)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp2', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 1, 'Join link: participants navigate to a URL and enter the session code to join â€” no account or login required', true, NULL, 'mpShowCodeEntry() added to multiplayer.js â€” renders when ?join= param is present but empty. mpEnterCode() validates code via sb.tt.getSessionByCode(), updates URL via history.replaceState(), then calls mpShowJoinLobby(). Routed from bootApp() in app.js.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp3', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 2, 'Role selection screen: participant sees available roles for the session, selects one, enters their name â€” role is locked once taken', true, NULL, 'Already implemented as mpShowJoinLobby() in multiplayer.js â€” role grid with mpPickRole() selection, name input, and mpDoJoin() claim flow. Confirmed complete.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp4', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 3, 'Role capacity: each role can only be claimed by one participant â€” late joiners see remaining open roles only', true, NULL, 'Three fixes in multiplayer.js: (1) mpPickRole() now bails early if card has .taken class; (2) session full state added in mpShowJoinLobby() when all TT_ROLES are claimed â€” disables Join button with message; (3) DB-level UNIQUE constraint on (session_id, role_id) already enforced via PATCH_004.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp5', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 4, 'Waiting room: participants see who has joined and which roles are filled while facilitator prepares to launch', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp6', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 5, 'Facilitator lobby view: see all connected participants, their roles, and connection status before launching', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp7', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 6, 'Role-filtered inject delivery: when facilitator releases an inject, each participant sees only their role-specific information on their device', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp8', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 7, 'Participant response input: each role submits their response and criticality rating from their own device', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp9', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 8, 'Facilitator sees all responses in real time: dashboard shows which roles have responded and which are pending per inject', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp10', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 9, 'Facilitator-only view: facilitator notes and correct criticality are never shown on participant screens', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp11', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 10, 'Breach declaration: IC and Exec Sponsor co-sign from their own devices â€” both must confirm before breach is logged', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp12', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 11, 'Session persistence: if a participant disconnects and rejoins with the same code and role, their session state is restored', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp13', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 12, 'Session expiry: sessions auto-close after exercise completion or after a configurable idle period (e.g. 4 hours)', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp14', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 13, 'AAR available to all participants post-exercise: shareable read-only link to the After Action Report', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('mp15', 'tabletop_multiplayer', 'Tabletop â€” Multiplayer / Remote Participant Engine', 3, 14, 'Mobile-responsive participant view: join and participate fully from a phone or tablet', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_auto_1', 'tt_autonomous', 'Tabletop â€” Autonomous Mode (Jackbox-style, no facilitator)', 3, 0, 'Session creation: vCISO creates an autonomous session (mode = ''autonomous''), selects scenario and optional timer settings, shares the 6-character code â€” no facilitator role required', true, NULL, 'Minimal build: ''Autonomous (Jackbox-style)'' option added to mode selector in ttRenderSetup(). When selected, shows autonomous settings panel with lobby timer (5/10/15m), inject timer (5/10/15m), speed multiplier (1x/2x/5x). Setters: ttSetLobbyTimer(), ttSetInjectTimer(), ttSetTimerMult(). ttLaunchSession() skips facilitator name validation for autonomous mode, writes lobby_timer_minutes, lobby_started_at, inject_timer_minutes, timer_multiplier to session. Routes to auto_lobby_monitor view. SQL: PATCH_058.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_auto_2', 'tt_autonomous', 'Tabletop â€” Autonomous Mode (Jackbox-style, no facilitator)', 3, 1, 'Auto-lobby: waiting room shows connected participants and role fill status; game auto-launches after all critical roles filled OR a countdown timer expires (configurable: 5/10/15 min)', true, NULL, 'mpRenderAutoLobby() in multiplayer.js â€” async function renders all 5 role cards showing fill status + player names. Countdown timer pulls from session.lobby_started_at + lobby_timer_minutes. setInterval ticks the mpLobbyCountdown element every second. mpStartPoll() detects auto_lobby phase and calls mpUpdateAutoLobbyRoles() + checks launch conditions every 4s. Auto-launch fires when all roles filled OR timer expired: patches declaration_logged=true, inject_started_at=now. _mpAutoLaunching guard prevents double-fire. vCISO sees ttRenderAutoLobbyMonitor() with session code, live roster, countdown, Launch Now button, Copy Join Link button. PATCH_058.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_auto_3', 'tt_autonomous', 'Tabletop â€” Autonomous Mode (Jackbox-style, no facilitator)', 3, 2, 'Auto inject delivery: each inject is released immediately at game start (or on prior inject completion); the system waits for all active roles to submit, then auto-advances to the next inject', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_auto_4', 'tt_autonomous', 'Tabletop â€” Autonomous Mode (Jackbox-style, no facilitator)', 3, 3, 'Response timer per inject: optional per-inject countdown (e.g. 10 min); when timer expires the system advances regardless of pending responses â€” unanswered roles flagged in AAR', true, NULL, 'Timer bar injected in mpRenderInjectView() when session.mode===''autonomous'' and inject_timer_minutes>0. Computes injectSecsTotal = inject_timer_minutes*60/timer_multiplier (5x speed = 2min for 10min window). mpTimerBar HTML with mpInjectCountdown countdown and mpTimerFill progress bar. setInterval ticks every 1s, color-codes to amber at 60s and red at 30s. At 0: calls mpAutoAdvanceInject(session, idx) which patches current_inject+1 + inject_started_at=now. Last inject: patches status=complete. _mpAutoAdvancing guard prevents double-fire. mpStartPoll detects inject_started_at change (autonomous mode) to reset timer on auto-advance. PATCH_058.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_auto_5', 'tt_autonomous', 'Tabletop â€” Autonomous Mode (Jackbox-style, no facilitator)', 3, 4, 'AI facilitator commentary: after each inject closes, the system calls the AI API to generate role-specific feedback and the correct course of action â€” displayed to all participants before the next inject', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_auto_6', 'tt_autonomous', 'Tabletop â€” Autonomous Mode (Jackbox-style, no facilitator)', 3, 5, 'Autonomous breach gate: system evaluates TL responses against the scenario breach trigger criteria and auto-presents the breach declaration vote to IC and ES when threshold is met', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_auto_7', 'tt_autonomous', 'Tabletop â€” Autonomous Mode (Jackbox-style, no facilitator)', 3, 6, 'AI rubric scoring: at exercise end, AI evaluates all submitted responses across the 5 rubric dimensions and generates scores + written justification â€” no facilitator scoring needed', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_auto_8', 'tt_autonomous', 'Tabletop â€” Autonomous Mode (Jackbox-style, no facilitator)', 3, 7, 'Auto-generated AAR: full After Action Report built automatically from responses, breach record, notification checklist, AI scores, and AI narrative â€” available immediately at exercise end', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_auto_9', 'tt_autonomous', 'Tabletop â€” Autonomous Mode (Jackbox-style, no facilitator)', 3, 8, 'Shareable AAR link: read-only AAR URL sent to all participants at exercise end; accessible without login for 30 days', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_auto_10', 'tt_autonomous', 'Tabletop â€” Autonomous Mode (Jackbox-style, no facilitator)', 3, 9, 'Participant progress display: during the exercise each participant sees a live inject counter, role status indicators (who has responded), and a running exercise clock', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ata_ai_7', 'tt_autonomous', 'Tabletop â€” Autonomous Mode (Jackbox-style, no facilitator)', 3, 10, 'Critical miss consequence screen: when Haiku detects a major eradication or remediation failure (e.g. network not isolated, MFA not reset, backups not verified before restore), interrupt the inject flow with a full-screen red CONSEQUENCE ACTIVATED card before the next inject loads. Shows: what was missed, which role owned it, and the resulting escalation narrated in plain language. Holds 8â€“10 seconds or until dismissed. Designed to be uncomfortable.', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai1', 'ai_tools', 'AI Tools', 1, 0, 'AI Assessment tool â€” assess an organisation''s use of AI tools against risk, governance, and compliance criteria', false, NULL, 'In backlog, no timeline', '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai2', 'ai_tools', 'AI Tools', 1, 1, 'AI Tool inventory â€” catalogue the AI tools in use across an organisation (vendor, data inputs, risk tier, approved status)', false, NULL, 'In backlog, no timeline', '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tb1', 'tabletop_bcdr', 'Tabletop â€” BCDR Track', 3, 0, 'BCDR scenario library: datacenter outage, extended power failure, pandemic/key person loss, critical supplier failure, physical site loss', true, NULL, '5 BCDR scenarios added to TT_SCENARIOS in tabletop.js with track:''bcdr''. IDs: bcdr_dc_outage, bcdr_power_failure, bcdr_keyman, bcdr_supplier, bcdr_site_loss. Each has 4-5 injects, declaration block, NIST/ISO/BCI framework refs in mitre field. Reuses existing engine, roles, and AAR unchanged.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tb2', 'tabletop_bcdr', 'Tabletop â€” BCDR Track', 3, 1, 'RTO/RPO awareness injects: team must identify recovery time and recovery point objectives per affected system', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tb3', 'tabletop_bcdr', 'Tabletop â€” BCDR Track', 3, 2, 'Business impact analysis prompts: which processes fail first, what is the revenue/ops impact per hour of downtime', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tb4', 'tabletop_bcdr', 'Tabletop â€” BCDR Track', 3, 3, 'Activation decision: when does the BC Plan formally activate and who has authority', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tb5', 'tabletop_bcdr', 'Tabletop â€” BCDR Track', 3, 4, 'Communication tree drill: staff, customers, regulators, insurers â€” who is notified and in what order', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tb6', 'tabletop_bcdr', 'Tabletop â€” BCDR Track', 3, 5, 'Alternate site / failover exercise: where do staff go, what systems are available', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tb7', 'tabletop_bcdr', 'Tabletop â€” BCDR Track', 3, 6, 'AAR maps to BC Plan gaps same as cyber tabletop', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl1', 'policy_library', 'Policy Library', 1, 0, 'Policy Library module â€” catalog of policy templates organised by framework (NIST CSF 2.0 / NIST AI RMF) with filter tabs, framework badges, control mappings, and status indicators', true, NULL, 'Session 20: js/policy_lib.js â€” POLICY_TEMPLATES const (16 policies: 10 NIST CSF, 6 NIST AI RMF). renderPolicyLib() with All/NIST CSF/NIST AI RMF filter tabs. plibRenderCard() per policy. plibSetFilter() updates filter state. g_policies nav group added to config.js between g_exercises and g_reporting. Render route added to app.js.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl2', 'policy_library', 'Policy Library', 1, 1, 'CIS POAM backlinks â€” each POAM row shows a green policy chip for policies covering that CIS control group; clicking navigates to Policy Library and highlights the card', true, NULL, 'Session 20: plibForCisGroup(groupNum) maps CIS group numbers to POLICY_TEMPLATES entries via cisGroups arrays. plibOpenFromPoam(policyId) sets highlight state and calls setNav. Chip rendered inline in safeguard title cell in renderCISPoam() in cis.js.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai_poam_rem', 'policy_library', 'Policy Library', 1, 2, 'AI Governance POAM remediation grouping â€” add group-level header rows to the AI Unified POAM (same pattern as CIS POAM), replacing per-control inline suggestions with group-level Suggested Action + Suggested Tool headers.', true, 'Medium', 'Session 42b: AI_GROUP_REMEDIATION const added to js/ai_unified.js (9 entries keyed by g1â€“g9, each with action and tool strings). renderAiUnifiedPoam() gaps rendering wrapped in IIFE with lastGrp closure â€” each new group inserts a full-width <tr colspan=6> header using group color from AI_GROUP_META, with group icon/label, ðŸ’¡ Suggested Action (blue chip) and ðŸ”§ Suggested Tool (purple chip). Per-control AI_REMEDIATION inline removed from individual rows.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl3', 'policy_library', 'Policy Library', 1, 3, 'AI Unified POAM backlinks â€” same pattern as CIS POAM but mapping AI governance control groups to NIST AI RMF policy templates', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl4', 'policy_library', 'Policy Library', 1, 4, 'Policy template download â€” AI Governance Policy card wired to two downloadable Word docs (Comprehensive and SMB); plibRenderCard() extended to support downloads array with multiple labelled buttons and green Available badge', true, NULL, 'Session 38: Added downloads:[{label,url}] array to pol_aigov in POLICY_TEMPLATES. Updated plibRenderCard() in js/policy_lib.js to check p.downloads â€” renders side-by-side cyan download buttons when present; falls back to single p.url button or disabled In Development. Status badge switches from amber Placeholder to green Available automatically. Files placed in templates/ folder (ENT-Draft-POL-AI Governance-Comprehensive-6.26.docx, ENT-Draft-POL-AI Governance-SMB-6.26.docx). Simpler approach than Supabase Storage â€” files served statically alongside the app.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl5', 'policy_library', 'Policy Library', 1, 5, 'Policy request / notify â€” when a template is still a placeholder, allow users to flag which policies they need most urgently (stored as a simple counter or email notification to Mark)', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl6', 'policy_library', 'Policy Library', 1, 6, 'Policy version tracking â€” add version number and last-reviewed date to each template card; flag policies that haven''t been reviewed in 12+ months', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl7', 'policy_library', 'Policy Library', 1, 7, 'AI Acceptable Use Policy card â€” added pol_aiaup entry (NIST AI RMF / GOVERN, controls GV-1.1 GV-5.1 GV-6.1); currently Placeholder status, no Word doc yet', true, NULL, 'Session 38: Card added to POLICY_TEMPLATES in js/policy_lib.js after pol_aigov. Placeholder badge shown until a downloads entry is added. Word doc template to be produced separately.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl8', 'policy_library', 'Policy Library', 1, 8, 'AI Acceptable Use Policy Word doc â€” produce and add downloadable Comprehensive/SMB versions to the pol_aiaup card (same pattern as AI Governance)', true, NULL, 'Session 39: Mark added ENT-Draft-POL-AUP-Comprehensive-6.26.docx and ENT-Draft-POL-AUP-SMB-6.26.docx to templates/. downloads array added to pol_aiaup in js/policy_lib.js. Card now shows green Available badge with two download buttons.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl9', 'policy_library', 'Policy Library', 1, 9, 'All NIST AI RMF policy Word docs wired â€” Comprehensive and SMB downloads added to all 5 remaining cards: AI Risk Management, AI Use Case Inventory, AI Incident Response, AI Transparency & Accountability, AI Data Quality & Bias Management', true, NULL, 'Session 40: Mark added 10 Word docs to templates/. downloads arrays added to pol_airmp, pol_aiinv, pol_aiirp, pol_aitap, pol_aidqp in js/policy_lib.js. All 7 NIST AI RMF cards now show green Available badge. All 10 NIST CSF cards remain Placeholder.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl10', 'policy_library', 'Policy Library', 1, 10, 'All NIST CSF 2.0 policy Word docs wired â€” Comprehensive and SMB downloads added to all 10 NIST CSF 2.0 cards: Information Security, Risk Management, Access Control, Incident Response, Asset Management, Data Classification & Handling, Vulnerability Management, Third-Party & Vendor Risk, Security Awareness & Training, Business Continuity & DR', true, NULL, 'Session 43: Mark had added all 20 Word docs (10 policies Ã— Comprehensive + SMB) plus Vulnerability Management docs to templates/. downloads arrays added to pol_isp, pol_rmp, pol_acp, pol_irp, pol_amp, pol_dcp, pol_vmp, pol_tprp, pol_satp, pol_bcrp in js/policy_lib.js. All 17 policy cards (10 CSF + 7 AI RMF) now show green Available badge. Policy Library header subtitle updated to reflect full availability.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl11', 'policy_library', 'Policy Library', 1, 11, 'Policy Library â€” Insurance Readiness tab: 8 existing policies tagged insurance:true (isp, acp, irp, dcp, vmp, tprp, satp, bcrp); 4 new placeholder cards added (Email Security, Backup & Recovery, Privileged Access Management, Endpoint Security). Green accent colour for insurance-framework cards. Insurance badge shown on cross-framework cards when viewed in insurance tab.', true, NULL, 'Session 43b: js/policy_lib.js â€” added insurance:true flag to 8 NIST CSF policies; added 4 new framework:''insurance'' placeholder cards (pol_emsp, pol_brp, pol_pamp, pol_esp); renderPolicyLib() filter logic extended for insurance tab (shows p.insurance===true OR p.framework===''insurance''); tab count computed dynamically; plibRenderCard() updated with isIns branch (green accent #15803d, chipBorder #bbf7d0); insBadge shown on cross-framework cards when insurance tab is active.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl12', 'policy_library', 'Policy Library', 1, 12, 'Policy Library â€” Word doc templates for 4 insurance placeholder cards (Email Security & Anti-Phishing, Backup & Recovery, Privileged Access Management, Endpoint Security). Comprehensive + SMB variants (8 docs total). Generator tool at generate-insurance-policies.html.', true, NULL, 'Session 44: generate-insurance-policies.html â€” browser-based generator; open once locally, click Generate All, move 8 .doc files to templates/. js/policy_lib.js â€” downloads arrays wired to expected filenames for all 4 cards (pol_emsp, pol_brp, pol_pamp, pol_esp). Files: ENT-Draft-POL-Email Security and Anti-Phishing-[Tier]-6.26.docx, ENT-Draft-POL-Backup and Recovery-[Tier]-6.26.docx, ENT-Draft-POL-Privileged Access Management-[Tier]-6.26.docx, ENT-Draft-POL-Endpoint Security-[Tier]-6.26.docx.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('pl13', 'policy_library', 'Policy Library', 1, 13, 'Policy Library â€” native in-app policy doc generator: ''Generate Policy'' button on each card that produces the Word doc on the fly from template content defined in code, without needing to open a separate generator HTML file. Eliminates the external generate-insurance-policies.html dependency.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rp1', 'policy_library', 'Policy Library', 1, 14, 'Exec report trend chart in Word export for AI modules: AI Unified, NIST AI RMF, and ISO 42001 Word exports currently have no trend chart. Add equivalent score trend line chart (matching the CIS cisDrawTrendLine() approach) to all three AI module Word exports.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai1', 'ai_readiness', 'AI Readiness', 1, 0, 'NIST AI RMF v1.0 assessment â€” 68 sub-categories across GOVERN, MAP, MEASURE, MANAGE functions; dashboard, accordion form, gap report, exec report, AI prompt export', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai2', 'ai_readiness', 'AI Readiness', 1, 1, 'ISO/IEC 42001:2023 assessment â€” 53 items across clauses 4â€“10 and Annex A; dashboard, accordion form, gap report, exec report, AI prompt export', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai3', 'ai_readiness', 'AI Readiness', 1, 2, 'AI Readiness Hub â€” aggregated view of NIST AI RMF + ISO 42001 scores with combined score, per-framework score cards, clause/function bars, quick-start buttons', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai4', 'ai_readiness', 'AI Readiness', 1, 3, 'framework_notes table (PATCH_010) â€” generic org-scoped notes for AI framework controls; ai_rmf_profile column on organisation_profiles', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai5', 'ai_readiness', 'AI Readiness', 1, 4, 'Unified AI Governance Assessment â€” 44-question NIST AI RMF Ã— ISO 42001 cross-walk module; weighted gap prioritisation (weight Ã— deficit), top-5 gap view, POAM, exec report, framework toggles (NIST on/off, ISO on/off), AI prompt export; replaces separate NIST and ISO modules in nav', true, NULL, 'js/ai_unified.js (AI_UNIFIED_CONTROLS 44q, 9 groups, aiuCalcScore/aiuWeightedGaps/aiuCalcGroupScores, full render suite). ai_hub.js updated to read from ai_unified. Saves to assessments with module=ai_unified. POAM stored in answers._poam blob. Session 13: AI_REMEDIATION lookup added (all 44 controls); POAM rows now show ''ðŸ’¡ Suggested Action'' block with concrete remediation guidance inline under each gap. Session 31: visual equalisation to CIS pattern â€” assessment history table headers now framework-coloured (Overall=navy, NIST=#1d4ed8, ISO=#0f766e); action button inline size overrides removed (now use standard .btn-sm); history card toolbar now has âŠž Compare Matrix + ðŸ“‹ POAM + + New Assessment buttons; Compare Matrix view added (aiuOpenMatrix/renderAiUnifiedMatrix/aiuMatrixAnswer) â€” last 5 assessments side-by-side with 9-group filter, click-to-cycle answers (Yesâ†’Partialâ†’Noâ†’N/Aâ†’Clear), auto-save to Supabase; Word export added (aiuExportWord) â€” canvas gauge, canvas radar, domain table, top 5 gaps, commentary; exec report score card changed from white card to .score-hero-ins navy hero matching CIS style; Domain Coverage progress bars added below hero; radar draw now triggered in aiuOpenReport() setTimeout. Session 33: aiuExportWord() fully overhauled â€” now matches Abbott Executive Report template CSS (Arial, .page 2.5cm, h2 uppercase with navy border); fmtCommentary() parser added (KEY FINDINGS bullet table + PRIORITY RECOMMENDATIONS numbered table, identical to CIS pattern); score hero restructured (gauge left, metadata table right); Pyramid Maturity Table added (all 5 tiers Ã— 22 segments, NIST+ISO refs, status badges); top gaps expanded to 10 with Domain column; full 44-control assessment table added (9 group headers, framework badge, answer colour, weight); filename changed to AI_Exec_Report_[Client]_[Date].doc with BOM. Session 34: three Word export fixes â€” (1) off-screen radar canvas 280x260 increased to 420x380 so long labels no longer clip; (2) framework breakdown per-axis score legends replaced from flex chips to proper HTML tables (Word ignores flexbox); (3) Pyramid text table replaced with inline SVG graphic via new aiuBuildPyramidSvgStr(pyrState) function â€” mirrors initAiPyramid() geometry as a string builder, embedded at 520x222px with colour legend table. Session 35: AI Maturity Pyramid section removed from Word export entirely â€” report now goes Framework Breakdown â†’ Top Priority Gaps.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai6', 'ai_readiness', 'AI Readiness', 1, 5, 'Sidebar score dot for ai_unified â€” getModuleDot() currently skips ai_unified; wire it to show green/amber/red based on latest unified score', true, NULL, 'Already functional â€” ai_unified is not in the dot-none exclusion list and saves score as a number (scores.overall ?? 0). Backlog item was written before the module was stable; no code change needed.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai9', 'ai_readiness', 'AI Readiness', 1, 6, 'AI Governance Maturity Pyramid â€” interactive SVG pyramid in AI Readiness Hub; 22 NIST AI RMF segments across 5 tiers (Governingâ†’Optimizing); click-to-cycle status (Not Addressed/Partial/In Progress/Implemented); detail panel with NIST/ISO standard links; live score footer', true, NULL, 'Session 12 refactor: module-level AI_PYR_CATALOGUE (22 entries, each with commentary + remediation fields), AI_PYR_TIERS, AI_PYR_SEGS, AI_PYR_MAP. renderAiPyramidCard(idPrefix,editable) reusable HTML. initAiPyramid(idPrefix,editable,externalState,autoLoad) generic init â€” no click-to-cycle; click selects segment only; detail panel shows readonly status badge (hub) or 4 interactive buttons (rapid); ''How to Address This'' remediation section added to detail panel; returns live state ref. initAiMaturityPyramid() wrapper calls initAiPyramid(''aihub'',false,null,true). Hub pyramid is read-only display. Rapid Pre-Assessment is editable + saves to DB as module=rapid_pyramid. Session 13: Hub Domain Breakdown bar chart replaced with radar/spider chart (aihub-domain-radar canvas, aiuDrawRadar()). initAiReadinessHub() now calls both pyramid init and radar draw.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai12', 'ai_readiness', 'AI Readiness', 1, 7, 'AI Governance Executive Report â€” maturity pyramid (read-only, status derived from AIG answers) + 9-spoke domain radar chart replacing group breakdown bars; pyramid and radar both init from app.js setTimeout on report view load', true, NULL, 'Session 13: renderAiUnifiedExecReport() updated â€” Group Breakdown card replaced with aiurep-radar canvas (aiuDrawRadar()); renderAiPyramidCard(''aiurep'',false) inserted between radar and Top Priority Gaps. aiuBuildPyramidState(answers) maps AIG answers to pyramid statuses (yesâ†’green, partialâ†’yellow, noâ†’red) via AI_PYR_MAP. app.js setTimeout extended to draw radar + init pyramid when aiUnifiedState.view===''report''. Session 31: score card changed from white card to .score-hero-ins navy hero; Domain Coverage progress-bar section added; radar canvas moved into hero card right panel; domain breakdown white card removed; ðŸ“„ Export Word button added to report header toolbar. Session 32: Domain Coverage section replaced with Framework Breakdown card â€” two side-by-side framework-native radars replacing the confusing 9-domain breakdown; NIST AI RMF radar (4 spokes: Govern/Map/Measure/Manage, blue) + ISO 42001 radar (up to 8 spokes: clause groups 4â€“10 + Annex A, teal); helpers: aiuCalcNistFunctionScores(), aiuCalcIsoClauseScores(), aiuDrawFrameworkRadar(); aiuOpenReport() updated to draw both; aiuExportWord() updated with two off-screen radars side-by-side in Word doc. Session 33: Word export fully rebuilt to match Abbott template â€” see ai5 notes.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai10', 'ai_readiness', 'AI Readiness', 1, 8, 'AI Maturity Pyramid â€” persist segment statuses per org to Supabase so state is saved between sessions and can be used in reporting', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai11', 'ai_readiness', 'AI Readiness', 1, 9, 'Rapid Pre-Assessment â€” interactive pyramid, click segments to set maturity status, save to DB as module=rapid_pyramid, history with load/delete, no comments or evidence required', true, NULL, 'js/ai_hub.js: renderRapidPreAssessment(), initRapidPyramid(preloadRunId), doSaveRapidPyramid(), loadRapidRun(id), deleteRapidRun(id), calcPyramidPct(stateObj). Saves to assessments table with module=rapid_pyramid. History shows date, maturity%, assessor with load/delete actions. config.js: rapid_pyramid nav item added. app.js: render route added.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai7', 'ai_readiness', 'AI Readiness', 1, 10, 'EU AI Act assessment module â€” risk classification, prohibited uses, high-risk system obligations', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai7', 'ai_readiness', 'AI Readiness', 1, 11, 'AI Readiness Hub â€” consolidated visual dashboard with radar/spider chart across all AI frameworks', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai8', 'ai_readiness', 'AI Readiness', 1, 12, 'AI framework auto-scoping â€” cross-map ISO 42001 and NIST AI RMF findings to identify overlapping gaps and common remediation', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai13', 'ai_readiness', 'AI Readiness', 1, 13, 'AI governance control templates â€” for any AI governance control gap, provide a downloadable template (policy doc, register, tracking spreadsheet) so clients can immediately act on a finding. Could be in-app templates or generated Excel/Word artifacts. Long-term: build these trackers natively into the platform (e.g. AI inventory register, AI incident log, AI risk register).', true, 'High', 'Remediation Resources card added to renderAiUnifiedGapReport() in ai_unified.js. AI_TEMPLATE_MAP maps g1-g9 to Policy Library links (plibOpenFromPoam()) + Excel downloads. Policy links: pol_aigov/pol_aiaup/pol_aitap (g1), pol_airmp (g2/g6/g9), pol_aitap (g3), pol_aidqp (g4), pol_aiinv (g5), pol_aiirp (g7). Excel templates: AI Risk Register (g2), AI Data Register (g4), AI System Inventory (g5), AI Testing Log (g6), AI Incident Log (g7), ISO 42001 AIMS Checklist (g8). _aiuTemplatesCard() renders only groups with actual gaps. _aiuXlsxSave() shared helper; aiuDownloadTemplate() dispatcher. window.aiuDownloadTemplate exported.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai14', 'ai_readiness', 'AI Readiness', 1, 14, 'AI phishing and attack simulation â€” module or integration to run AI-specific attack scenarios: prompt injection tests, model manipulation attempts, AI-generated phishing campaigns targeting staff. Assesses practical AI security posture beyond governance controls.', true, NULL, 'Added 3 Attack Simulation Track scenarios to AITT_SCENARIOS in js/ai_tabletop.js: AI-11 (The Indirect Injection â€” hidden prompt injection in supplier doc exfiltrates pricing data via AI procurement assistant), AI-12 (Operation Spearpoint â€” AI-generated personalized phishing campaign, 40 staff targeted, MFA relay bypass), AI-13 (The Extraction â€” $600 API model extraction attack, replica listed for sale on private forum). Each has track:''attack'' flag. Setup screen reorganised into Governance Track / Attack Simulation Track sections with orange visual distinction. vCISO commentary updated to describe both tracks. No SQL needed.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai22', 'ai_readiness', 'AI Readiness', 1, 15, 'AI Simulation Tracker â€” lightweight module to record AI attack simulation campaigns (prompt injection tests, deepfake phishing, AI data exfiltration drills). Fields: scenario type, date run, facilitator, staff count tested, pass rate, outcome notes, remediation actions. Dashboard shows coverage map and history. Provides audit/insurance evidence that the org actively tests its AI defences.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai15', 'ai_readiness', 'AI Readiness', 1, 16, 'AI tabletop exercises â€” scenario track focused on AI-specific incidents: AI model producing harmful output, prompt injection leading to data exfiltration, AI vendor breach, AI-generated misinformation impacting operations. Complements the operational tabletop track with AI-specific injects and role considerations.', true, NULL, 'js/ai_tabletop.js: full discussion-based engine with 10 scenarios (AI-01 through AI-10). US data privacy law focus â€” CCPA/CPRA, FTC Act Â§5, state breach notification, HIPAA, SEC 8-K, FBI/IC3. 5-stage flow: Setup â†’ Briefing â†’ Injects â†’ Discussion â†’ US Regulatory â†’ AAR. AITT_SCENARIOS (10 scenarios with sequential injects), AITT_NOTIF_ITEMS (10-item US regulatory checklist), AITT_NIST_LABELS/AITT_ISO_LABELS reference maps. Per-inject + per-question note capture, toggle-to-confirm regulatory checklist, AAR with NIST AI RMF + ISO 42001 framework refs per scenario, ''Copy AAR prompt for Claude'' prompt builder. Saves to assessments table with module=ai_tabletop (no new SQL). Nav item tt_ai added to g_exercises in config.js. Render route + dot exclusion added in app.js. Script tag added to index.html.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai15a', 'ai_readiness', 'AI Readiness', 1, 17, 'AI tabletop exercise history â€” list view of completed exercises per org (scenario name, date, facilitator) with load/view and delete. Same pattern as TPRA list. Reads from assessments table where module=ai_tabletop.', true, 'Medium', 'History section added to aittRenderSetup() via aittRenderHistory(). Each row shows scenario badge, name, date, facilitator, note count, regulatory items checked. ''View AAR'' loads run into read-only AAR view (aittLoadRun). Delete via aittDeleteRun with confirm. AAR rebuilt as full report: 4-stat strip (injects/inject notes/discussion notes/regulatory%), report header with org+facilitator+date, inject recap (all injects shown, notes or ''no notes'' fallback), discussion outcomes (all questions shown), full regulatory checklist with check state, framework mapping. Historical AAR shows ''Back to history'' instead of ''Save & run another''.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai15b', 'ai_readiness', 'AI Readiness', 1, 18, 'AI tabletop PDF/Word export â€” export the AAR as a branded Word or PDF document directly from the AAR view, without requiring the user to paste into Claude. Same output as the Claude-generated report but produced natively.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai16', 'ai_readiness', 'AI Readiness', 1, 19, 'AI governance crosswalk with recommendations â€” map AI Governance Assessment gaps across NIST AI RMF, ISO 42001, EU AI Act, and PIPEDA/provincial AI obligations. For each gap, surface which frameworks require remediation and provide a prioritised recommendation. Builds on AI_REMEDIATION and existing framework mappings.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai17', 'ai_readiness', 'AI Readiness', 1, 20, 'AI Governance exec report Print / Save as PDF button â€” add a ''Print'' button on the exec report view that calls window.print() with @media print CSS. Same pattern as cis_report_print backlog item. Pyramid and radar charts already rendered as canvases so they will print correctly.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai18', 'ai_readiness', 'AI Readiness', 1, 21, 'Wire auditLog() into AI Governance assessment saves â€” aiuSave(), aiuSavePoam(), and aiuDeleteConfirm() currently have no audit trail. Pattern is identical to cis.js audit calls (session 17). Needed for full platform audit coverage.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai19', 'ai_readiness', 'AI Readiness', 1, 22, 'Update AI Governance ''Copy AI Prompt'' button to instruct Claude to output commentary with KEY FINDINGS and PRIORITY RECOMMENDATIONS as exact section headers on their own lines â€” so fmtCommentary() in the Word export automatically formats them as styled tables. Closes the prompt â†’ save â†’ export loop.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai20', 'ai_readiness', 'AI Readiness', 1, 23, 'Abbott Executive Report Template â€” ma-executive-report-generator skill created; template shell saved to templates/Abbott_Executive_Report_Template.doc. Future: build a native report generator view in the platform that pre-populates the template from live assessment data and allows one-click download without needing Claude.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai21', 'ai_readiness', 'AI Readiness', 1, 24, 'AI Security Assessment â€” dedicated assessment module covering the technical security posture of an organisation''s AI usage, distinct from the governance/compliance focus of NIST AI RMF and ISO 42001. Scope to cover: prompt injection controls, model access and API key management, data sent to AI providers (data leakage risk), AI output validation and human-in-the-loop controls, AI tool inventory and shadow AI, vendor security posture for AI providers, adversarial input handling, and AI-specific incident response. Likely a survey-based format similar to Insurance Readiness or Tech Stack, with scored output and gap report. Ties into TPRA for AI vendor assessment and the AI Tabletop track for incident readiness.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai_pyr_2', 'ai_readiness', 'AI Readiness', 1, 25, 'Add a colour key below the AI maturity pyramid showing all five statuses with their colours: Implemented (green), Partial (yellow), Compensating Control (amber), N/A (grey), Not Addressed (red). Especially needed now that CC and N/A are visually distinct â€” clients need to know what each colour means.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ai_pyr_3', 'ai_readiness', 'AI Readiness', 1, 26, 'Add a question in the AI Readiness setup or org profile: does this org build AI (developer/vendor) or use AI from third-party vendors? If "user", auto-mark Model Development, Training, and related build-side sections as N/A so they render grey instead of red on the pyramid. Prevents misrepresenting AI consumers as having gaps in controls that simply do not apply to them.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ma1', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 0, 'M&A Cyber Due Diligence core module â€” 28-question wizard across 4 scored categories (Governance, IAM/Endpoint, Data/Cloud, Incident History) with optional AI Exposure Screen (6q) and Cyber Insurance Review (4q) add-ons; risk-tolerance-adjusted scoring (Conservative/Moderate/Aggressive); deal-breaker detection with hard stops for undisclosed breaches and active regulatory action; cost-to-remediate with Labor + Tooling columns scaled by employee band; Cyber Discount Factor when deal value entered; POAM with owner/date/decision fields; Add Entity flow to create child org at close linked to assessment as founding baseline; AI prompt copy for deal memo generation', true, NULL, 'js/ma_cdd.js: full detail view rebuilt with 4 tabs. _renderMATabSummary() â€” category score grid + one-time vs recurring cost split + Cyber Discount Factor card. _renderMATabFindings() â€” expandable finding rows with q.note (WHY THIS MATTERS), editable Assessor Observation and Recommended Action textareas, maToggleFinding()/maFindingsSave(). _renderMAPoam() â€” updated: decisions now Remediate/Accept Risk/Transfer (Insurance)/Defer/Exclude with colour-coded select; observation preview shown inline in POAM row. _renderMATabPricing() â€” tooling assumptions table with per-tool toggle (maToggleTooling()), PAM manual-alt note, maPricingSave() persists _tooling_excludes back to Supabase. N/A answer option added (purple) â€” excluded from scoring denominator, cost calc, deal-breakers, findings. note field added to all 38 questions with practical assessor guidance, rendered as info box. MA_TOOLING recalibrated: H3 vuln scan ,500-,000/yr, I2 PAM 8-20/user/yr. maCalcCosts() returns laborLow/High and toolLow/High separately in each bucket. maSetDetailTab(), maState.detailTab + expandedFindings added. Window exports updated. | Session 51b: Added user_count + endpoint_count to framing (Step 1) â€” explicit headcount inputs replace band estimates for per-user/per-device tool pricing. maCalcCosts() resolves hc from explicit counts first, falls back to MA_HEADCOUNT band midpoint. hc.explicit flag drives green/amber indicator in pricing tab. Added 5-year cost schedule: schedule[] array in maCalcCosts() output â€” Pre-Close/Yr1/Yr2 carry one-time impl; Yr2-5 carry recurring licensing as tools come online in phases. _renderMATabPricing() rebuilt with 5-year table (period total + 5-year footer row) above tooling table. 5-Year Total added to Summary tab cost card. fiveYearLow/fiveYearHigh on costs object. | Session 51c: Pricing Schedule module built as general-purpose org-tier-aware tool catalog (js/pricing_schedule.js). PATCH_027: pricing_schedule table (org_id, name, vendor, sku, tool_type, model, rate_low, rate_high, notes, active). PATCH_026: ma_pricing JSONB on organisation_profiles (deprecated/transitional). psGetForType(toolType) is the public API â€” returns resolved entry (ownâ†’parentâ†’null). psLoad() fetches own+parent entries. CRUD UI: add/edit/delete grouped by tool type, auto-model default per type. Settings nav updated: platformAdminOnly group now shows to gf/father via tierOnly filter; Pricing Schedule item visible to grandfather/father only; Platform Settings + Backlog remain admin-only. MA_TOOL_TYPE_MAP in ma_cdd.js maps question IDs to type tags. maResolveTool() updated: 1. psGetForType() 2. legacy ma_pricing JSONB fallback 3. MA_TOOLING defaults. Old maNavToPricing/_renderMAPricingCatalog/maSavePricing/mapc_* removed from ma_cdd.js. buildNav() updated to handle tierOnly items in platformAdminOnly groups. | Session 51d: Pricing Schedule UI rebuilt as inline editable table â€” no separate form, all cells directly editable with oninput handlers; psAddRow()/psRowSet()/psRowAutoModel()/psRowDelete()/psSaveAll() replace old CRUD flow. 25 tool types added across 7 groups (Identity, Endpoint, Email, Network, Data, Training, Professional Services) â€” PATCH_028 expands DB CHECK constraint. Import/Export complete: psExportTemplate() downloads CSV with all 25 types as examples + header comments; psExportCurrent() exports own org entries; psImportFile() â†’ _parseCsvImport() â†’ _renderImportPreview() shows pass/fail per row; psImportConfirm() bulk upserts valid rows. Father org inherits parent rows shown read-only at bottom of table. | Session 51e: covers array + monthly rates + one-time costs. PATCH_029 adds covers text[], one_time_low/one_time_high to pricing_schedule. All PS rates now monthly â€” column headers updated (Mo Low/Mo High/One-time/OT High); PS_MODELS labels show /mo. covers[] field: chips in table cell + grouped + addâ€¦ select; psRowCoverPick()/psRowCoverRemove() do targeted DOM update (no full re-render). psGetForType() checks covers array alongside tool_type so bundle SKUs (e.g. Barracuda Premium Plus) resolve for any covered type. ma_cdd.js: maResolveTool() multiplies PS rates Ã— 12 (monthlyâ†’annual); adds oneTimeLow/oneTimeHigh from PS entry. maCalcCosts() mkBucket adds setupLow/setupHigh; accumulates per bucket. 5-year schedule adds Vendor setup column (purple); rowLow/rowHigh include setup in the period it occurs; colspan updated to 4. Tooling table shows âš¡ One-time note per tool when setup fee > 0; annual est cell shows monthly breakdown for PS-sourced tools. Template CSV updated with monthly rates and Barracuda tier examples showing covers usage.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ma2', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 1, 'M&A deal memo Word export â€” export full assessment as Abbott-branded .doc: score hero, deal-breaker table, category scores, findings list, cost-to-remediate breakdown, POAM summary. Same pattern as CIS/AI Unified Word exports.', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ma3', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 2, 'Tech stack prefill for M&A â€” auto-map existing Technology Stack survey answers to M&A control questions where derive_strategy applies (I1/MFA, I4/EDR, I6/VPN, I7/Email, D4/Backup). Show pre-filled indicator on answered questions so assessor knows the source.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ma4', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 3, 'M&A portfolio view â€” cross-org list of all M&A assessments visible to the current user (Group/Platform tier). Shows target name, deal type, risk rating, score, and linked entity status. Accessible from the Group/Platform dashboard.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ma5', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 4, 'Audit log for M&A â€” wire auditLog() into maSave() (create + complete), maDeleteAssessment(), and maConfirmAddEntity() to maintain full platform audit trail. Same pattern as CIS and AI Unified audit calls.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ps1', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 5, 'Pricing Schedule â†’ M&A cost resolution: expand MA_TOOL_TYPE_MAP in ma_cdd.js to cover the full 25 tool types (MDR device, MDR identity, MDR/SOC, SAT, NGFW, email variants, vuln external/internal, pen tests, vCISO, etc.) so psGetForType() resolves pricing for all M&A question buckets, not just the current 6.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ps2', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 6, 'Pricing Schedule cross-module use â€” surface psGetForType() resolved pricing in CIS POAM cost estimates and TPRA remediation cost fields. When a finding maps to a known tool type, show the MSP/org rate alongside the platform default so the assessor sees their actual pricing.', true, 'Low', 'Built as remediation_costs.js shared module. rcExtractCISGaps() + rcExtractTSGaps() map gaps to tool types; renderRemediationCosts() looks up psGetForType() for each and renders cost table. CIS: ''ðŸ’² Cost'' button per assessment row â†’ cisOpenCost() â†’ renderCISCostTab(). Tech Stack: ''ðŸ’² Cost to Remediate'' button on dashboard â†’ tsOpenCost() â†’ renderTechStackCostTab(). Headcount from orgProfiles (approx_user_count / approx_device_count / employee_count_band). Risk-accepted POAM items excluded from CIS cost total. Missing pricing types link to Pricing Schedule.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rc1', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 7, 'Insurance Readiness: Cost to Remediate tab â€” map insurance survey gaps (questions answered ''no'' that affect score) to tool types and surface pricing schedule estimates, same pattern as CIS and Tech Stack cost tabs.', true, 'Medium', 'Session 51f: RC_INS_TO_TOOL map (16 entries: q1â€“q3=mfa, q7=edr, q8a/b=mdm, q10=email, q11=sat, q12=tabletop, q14=vciso, q15/16=pam). rcExtractInsGaps() in remediation_costs.js â€” gap = answer < 1.0. insOpenCost() sets insState.view=''cost'' from latest run. renderInsuranceCostTab() in insurance.js calls rcExtractInsGaps then renderRemediationCosts(). ''ðŸ’² Cost to Remediate'' button on dashboard when latest run exists. Also fixed: insurance edit creating new entry (editId was null â€” now set to run.id; insSave() PATCHes when editId set), and delete (insDeleteAssessment() added, Delete button added to history table rows).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rc2', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 8, 'Remediation cost: 5-year schedule view â€” extend the Cost to Remediate tab with a 5-year cost projection (Year 1: setup + annual; Years 2â€“5: recurring only), same format as M&A CDD schedule. One-time setup fees appear only in the period the tool is deployed.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('rc3', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 9, 'Remediation cost: show ''also covers'' on matched rows â€” when psGetForType() returns a bundle SKU (covers[] array), note which additional gap types it satisfies on the cost row (e.g. ''Also satisfies: Email Backup, Email DLP'') so the assessor sees the full value of one purchase.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gr1', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 10, 'Gap Register â€” consolidated cross-module gap list under Reports nav. Merges CIS Controls, Insurance Readiness, and Tech Stack gaps by tool type into one unified view with pricing from the Pricing Schedule.', true, 'High', 'Session 52: js/gap_register.js (new file). grState tracks cisRun, cisPoamItems, insRun, orgId. grLoad() fetches latest CIS assessment + POAM items, latest Insurance run, ensures tsState is loaded. grBuildGapList() calls rcExtractCISGaps/rcExtractInsGaps/rcExtractTSGaps, merges by tool type against PS_ALL_TYPES, sorts by framework count then alphabetical. renderGapRegister() builds table: Tool type | Flagged by (CIS/Insurance/Tech Stack badges, hover shows specific IDs) | Pricing Schedule (from psGetForType) | Annual cost | One-time setup. Summary cards: total est. annual, total one-time, unpriced count. Yellow headcount banner when Company Profile missing. Refresh button. Handles no-assessment state. Config.js: gap_register item added to g_reporting (live:true). App.js: render route added. Index.html: script tag added between remediation_costs.js and app.js. Also fixed: rcExtractTSGaps() mapping bug â€” tool type now only flagged as missing if NO question mapped to it is answered ''yes''; partial/no on sub-features when a presence question is ''yes'' no longer creates a spurious gap (fixed EDR appearing as Tech Stack gap despite Sentinel One being deployed).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gr2', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 11, 'Tool Gap Register â€” three fixes: (1) rename from ''Gap Register'' to ''Tool Gap Register'' throughout, (2) child org pricing: two-level inheritance (child â†’ father â†’ grandfather) so child orgs see MSP pricing in the gap register, (3) tier banner visibility count shows org''s own tier scope rather than logged-in user''s full visibility', true, 'High', 'Session 53: (1) Rename: config.js nav label, gap_register.js page headers (replace_all), home.js button. (2) psEnsureData() in pricing_schedule.js â€” added ''child'' branch: loads father rows + grandfather rows (via allOrgs lookup), concatenates into psState.parentRows so psGetForType() finds them. cpSave() in company_profile.js now resets grState.loaded and psState.loaded so gap register re-fetches after profile update. (3) renderTierBanner() in app.js â€” replaces visibleOrgs().length with tier-appropriate count: platform=allOrgs.length, grandfather=1+fathers+grandchildren, father=1+children, child=1.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gr3', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 12, 'Tool Gap Register â€” clickable source links: CIS/Insurance/Tech Stack badges navigate to source assessment; CIS rows show specific safeguard IDs inline (e.g. 1.1 Â· 3.4 Â· 6.8) for back-checking; Insurance/TS show gap count', true, 'Medium', 'Session 56: gap_register.js tableRows map. cisBadge/insBadge/tsBadge converted from cursor:default spans to onclick setNav(''cis''/''insurance''/''techstack'') links. Added cisDetail showing r.cisS.join('' Â· '') in monospace below badge. insDetail and tsDetail show question counts. All detail lines colour-matched to badge colours.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gr4', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 13, 'Tool Gap Register â€” Tech Stack as source of truth for tool existence: if TS records any ''yes'' for a tool type, CIS and Insurance flags for that type are suppressed (they reflect config gaps, not absence). Prevents EDR appearing as missing when Sentinel One is deployed.', true, 'High', 'Session 57: remediation_costs.js rcExtractTSGaps() now also returns confirmedTypes (Set of tool type keys with at least one ''yes'' answer). gap_register.js grBuildGapList() destructures confirmedTypes, sets cisS=null and insS=null for any tool type in confirmedTypes before building rows. Tool types with no TS coverage still surface CIS/Insurance gaps as before.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gr5', 'ma_cdd', 'M&A Cyber Due Diligence', 1, 14, 'Tool Gap Register â€” CIS â†’ tool mapping corrected to safeguard level: only safeguards that literally require deploying a specific tool are mapped; process/config/policy safeguards excluded. RC_CIS_CTRL_MAP (control-level) replaced by RC_CIS_SF_MAP (safeguard-level). Key removals: 7.1/7.2/7.7 (VM process), 10.2-10.5 (OS configs), 8.1-8.8/8.10-8.12 (log config), 12.1-12.6/12.8 (network architecture), 17.1-17.6/17.8-17.9 (IR process), controls 5+15 removed entirely. New: 7.3/7.4â†’mdm, 13.2/13.7â†’edr, 2.5-2.7â†’edr, 16.13+18.5 added.', true, 'High', 'Session 58: remediation_costs.js â€” RC_CIS_CTRL_MAP deleted, RC_CIS_SF_MAP added (keyed by safeguard string like ''7.5''). rcExtractCISGaps() updated: uses RC_CIS_SF_MAP[s.sf] instead of RC_CIS_CTRL_MAP[parseInt(s.ctrl)]. Sources now push s.sf directly (already correct format). pii_scan and vciso removed from CIS (no safeguard names the tool explicitly).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('aig1', 'ai_governance', 'AI Governance', 1, 0, 'AI Risk Register â€” AI-prefixed risk IDs (AI-001, AI-002â€¦), columns: Category, AI System (dropdown from catalog), Data Classification, Human-in-Loop, Likelihood, Impact, Rating, Status. Expandable rows show NIST AI RMF and ISO 42001 control chips. Filter tabs for Rating and Status. Auto-calculates risk rating from likelihood Ã— impact matrix. Source field distinguishes manual vs ai_assessment entries.', true, 'High', 'Session 66: js/ai_risk_register.js. aiRRState with rows, orgId, loaded, view (list/form), filterRating, filterStatus, expandedIds. AIRR_CATEGORIES (12), AIRR_DATA_CLASSES (10), AIRR_NIST_CONTROLS, AIRR_ISO_CONTROLS lists. airrCalcRating() â€” score = LÃ—I, â‰¤2 Low, â‰¤5 Med, â‰¤8 High, â‰¥9 Critical. loadAiRiskRegister(orgId) fetches from ai_risk_register and also loads catalog. renderAiRiskRegister() â†’ _airrRenderList() or _airrRenderForm(). Expandable rows via airrToggleExpand(). Form has AI system dropdown (grouped by vendor, indented components) built from aitcForDropdown(). Control chip pickers: toggle selected controls stored in aiRRState.form.nist_controls / iso_controls. airrSave() â€” queries maxSeq for new risks. sb.aiRiskReg persistence layer in supabase.js. sql/SUPABASE_PATCH_036.sql creates ai_risk_register table â€” run in Supabase SQL Editor.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('aig2', 'ai_governance', 'AI Governance', 1, 1, 'AI Application Inventory â€” browse and manage the seeded AI tool reference catalog. Table view grouped by vendor, parent-child hierarchy (components shown indented). Compliance columns: DLP, SSO, Logs, DPA, SOC 2 (âœ“/â€” chips). EU AI Act classification, NIST AI RMF controls, ISO 42001 clauses. Approval status badge (Approved / Enterprise Only / Conditional / Not Approved / Under Review). Platform admin mode: edit seeded tool data, add/delete non-seeded tools. Seeded tools cannot be deleted.', true, 'High', 'Session 66: js/ai_tool_catalog.js. aiCatState with tools, components, loaded, adminMode, editId. AITC_STATUS_LABELS and AITC_STATUS_COLORS maps. loadAiToolCatalog() fetches ai_tool_catalog + ai_tool_components in parallel. aitcGrouped() builds parentâ†’children tree. aitcForDropdown() returns vendor-grouped flat list for risk register dropdown. _aitcTable() renders full compliance table with optional admin Edit column. Admin modal (aitcModalBox in index.html) for add/edit via aitcOpenAdd() / aitcOpenEdit() / aitcSave(). aitcRefresh() updates mainContent. sb.aiCatalog persistence layer in supabase.js. sql/SUPABASE_PATCH_035.sql creates ai_tool_catalog (17 seeded entries: OpenAI GPT-4o, ChatGPT Enterprise/Team/Free, Claude Enterprise/Free/Pro/Max/Team, claude.ai Web/Desktop/Cowork/Code, Google Gemini API/Workspace, Meta Llama, Mistral) + ai_tool_components (component relationships) â€” run in Supabase SQL Editor. GOVERNANCE_CATALOG in home.js has both new cards. PAGE_REGISTRY in modules.js has both new page IDs.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('aig3', 'ai_governance', 'AI Governance', 1, 2, 'Per-org AI tool inventory â€” org users mark which catalog tools they use, set org-specific approval status override, add custom tools not in catalog. Stored in ai_org_tools table (PATCH_037). Feeds a dashboard widget showing approved/conditional/not-approved tool breakdown.', true, 'Medium', 'Built in session 67. Two-tab UI: My AI Tools (Active / Shadow IT & Flagged sub-tabs) + Reference Catalog. Add from catalog, add custom tool, edit status/notes, remove. â†’ Risk button pre-fills AI Risk Register form from tool data. PATCH_037 required. loadAiInventory() in ai_tool_catalog.js.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('aig4', 'ai_governance', 'AI Governance', 1, 3, 'AI Risk Register auto-population from AI Assessment POAM â€” same pattern as CIS POAM feeding main risk register. Source = ''ai_assessment''. Sync button on AI Risk Register or auto-runs on AI Assessment completion.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('aig5', 'ai_governance', 'AI Governance', 1, 4, 'AI Tool Catalog admin interface â€” allow platform admins to manage component relationships (ai_tool_components) via the admin modal UI. Currently components are seeded-only; admin UI would allow adding/removing parentâ†’child links.', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('aig6', 'ai_governance', 'AI Governance', 1, 5, 'Dashboard AI tool breakdown widget â€” show approved / conditional / shadow IT tool counts on the home dashboard for orgs that have AI Governance module access. Small stat card or strip similar to the portfolio risk bar.', true, 'Low', 'Session 68: js/home.js. Added ai_risk_register (type: ''ai_risk'') and ai_tool_catalog (type: ''ai_tools'') to WIDGET_CATALOG. _homeAiRiskChicklet() â€” shows open AI risk count, Critical/High/Medium/Low breakdown chips, top-5 open risk rows sortable by rating. _homeAiToolsChicklet() â€” shows total tool count, status breakdown chips (Approved/Conditional/Not Approved/Shadow IT), top-4 tools by name. _homeBackgroundLoadAI() â€” called from renderHome(); fires background load of aiRRState and aiCatState when those widgets are in the layout and data is stale; re-renders home when load completes. Grid upgraded from 3â†’4 columns (repeat(4,1fr)), clamp updated (Math.min(4,...)), width buttons extended to 1Ã—/2Ã—/3Ã—/4Ã—.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('aig7', 'ai_governance', 'AI Governance', 1, 6, 'AI Governance Tabletop ACL â€” in Module Management, map ''AI Governance Tabletop'' (tt_ai) page to the AI Governance module column so AI Governance-only users can access it via the Exercises hub. Admin action: Settings â†’ Module Management â†’ AI Governance Tabletop row â†’ check AI Governance column â†’ Save.', false, 'Low', 'Code is ready â€” hub page ACL fix (hasPageAccess _HUB_SUBPAGES) was shipped in session 67. Only remaining step is the Module Management UI config by a platform admin.', '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('aig8', 'ai_governance', 'AI Governance', 1, 7, 'AI tool catalog â€” seeded tools: Copilot Free, Microsoft 365 Copilot, Azure AI Foundry + APIM (component), Ctrl AI (Expedient). PATCH_038 adds these. When adding a parent tool from catalog, all component children are auto-added at the same status.', true, 'Medium', 'Built session 67. PATCH_038.sql adds 5 tools. aitcSaveAddFromCatalog() auto-adds children via aitcChildIds(). Toast shows ''ParentName + N components added''.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov1', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 0, 'Application Inventory scaffold â€” list view of all business applications. Fields: app name, description, business owner, hosting type (SaaS/Cloud/On-Prem/Hybrid), status (Active/Decommissioned/Under Review), vendor/supplier, authentication method (MFA enforced, SSO), data classification (PII, payment, health, IP, confidential), date added, last reviewed.', true, NULL, 'PATCH_040: app_inventory table. js/app_inventory.js: loadAppInventory, renderAppInventory, appInvSubmitAdd/Edit/Delete, appInvToggleDC chip toggles. sb.appInventory helpers in supabase.js. app_inv added to _HUB_SUBPAGES.governance and PAGE_REGISTRY in modules.js. comingSoon removed from GOVERNANCE_CATALOG in home.js. Render routing in app.js.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov2', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 1, 'Application risk and criticality â€” criticality rating per app (Critical/High/Medium/Low) with rationale. Risk level derived from criticality + data classification. Regulatory scope flag. Displayed as sortable/filterable badges on list view.', true, NULL, 'PATCH_041: criticality, criticality_rationale, in_regulatory_scope columns on app_inventory. app_inventory.js: _ainvDeriveRisk() derives risk from criticality Ã— data classification, criticality filter chips in list view, Crit./Risk column in table, Risk & Criticality modal tab, regulatory scope badge.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov3', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 2, 'Application BCDR classification â€” per-app BCDR fields: recovery priority (Tier 1/2/3), RTO, RPO, backup method, dependencies (other apps or vendors), BCDR owner contact. Summary view of Tier 1 apps for exec reporting.', true, NULL, 'PATCH_041: bcdr_priority, bcdr_rto, bcdr_rpo, bcdr_backup_method, bcdr_dependencies, bcdr_owner columns on app_inventory. app_inventory.js: BCDR modal tab, _ainvBcdrView() exec summary (Tier 1/2/3 stat cards + Tier 1 app cards), BCDR Summary button in list header. appInvSetView() toggles between list and bcdr views.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov4', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 3, 'Application IR classification â€” per-app IR fields: in-scope for IR (yes/no), IR priority tier, key technical contact, vendor IR contact, escalation path, last incident date. IR priority auto-suggested from criticality + data classification. Used to pre-populate IR runbooks in tabletop exercises.', true, NULL, 'PATCH_041: ir_in_scope, ir_priority_tier, ir_tech_contact, ir_vendor_contact, ir_escalation_path, ir_last_incident_date columns on app_inventory. app_inventory.js: IR modal tab, _ainvSuggestIrTier() auto-suggestion (criticality Ã— data class), appInvIrAutoSuggest() button in modal, IR badge on app name in table.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov5', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 4, 'Vendor Directory scaffold â€” list view of all vendors. Fields: vendor name, product/service, website, category (Cloud Infrastructure/SaaS/Managed Services/Professional Services/Hardware/Telecom/Other), primary contact name and email, status (Active/Inactive/Under Review), date added, last reviewed.', true, NULL, 'PATCH_042: vendor_directory table. js/vendor_directory.js: full CRUD, category colour-coded chips (7 types), status badges, top-category summary line, status filter tabs. sb.vendorDir helpers in supabase.js. vendor_dir added to _HUB_SUBPAGES.governance and PAGE_REGISTRY in modules.js. comingSoon removed from GOVERNANCE_CATALOG in home.js. Render routing in app.js.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov6', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 5, 'Vendor criticality and risk tier â€” per-vendor: business criticality (Critical/High/Moderate/Low) with rationale, risk tier (mirrors TPRA), data access types (PII, payment, health, IP, infrastructure), jurisdiction, data residency. Certifications held (SOC 2 Type I/II, ISO 27001, ISO 42001, PCI DSS, HIPAA BAA, CSA STAR). Last TPRA assessment date with link to TPRA record if one exists.', true, NULL, 'PATCH_048: ALTER TABLE vendor_directory adds criticality, criticality_rationale, risk_tier, data_access jsonb, jurisdiction, data_residency, certifications jsonb. vendor_directory.js: modal gains 2 tabs (Basic Info / Risk & Criticality). Tab switching via vendorDirSetTab() toggles display:grid/none in-place â€” no re-render, no field-value loss. Chip toggles (data access + certifications) update _vdChips module var + button visuals only, also no re-render. Criticality filter pill row above table. TPRA lookup: loadVendorDirectory() fetches vendor_assessments (completed) in parallel, builds tpraMap keyed by normalised vendor_name â€” date+tier shown as purple chip under vendor name in table and read-only panel in Risk tab. critFilter state added. vendorDirSetCritFilter(), vendorDirToggleChip() exported.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov7', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 6, 'Vendor contract and compliance tracking â€” per-vendor: contract renewal date (90/30 day banner warnings), SLA terms summary, liability and insurance coverage notes, NDA in place, DPA in place, right to audit clause. Dashboard widget showing vendors with renewals in next 90 days.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov8', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 7, 'Vendor BCDR and IR contacts â€” per-vendor BCDR: in BCDR plan (yes/no), BCDR dependency tier, alternative vendor or workaround documented. Per-vendor IR: 24/7 IR contact name and phone, incident notification SLA (hours), breach notification clause in contract, last confirmed IR contact date. Used to pre-populate vendor notification checklist in tabletop exercises.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov9', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 8, 'Department field on Application Inventory and AI Tool Catalog â€” free-text department entry per app/tool that auto-populates a per-org department list. When adding or editing, the department field is a text input with autocomplete suggestions drawn from previously entered departments for that org. Departments are stored in a new org_departments table (or derived from existing entries). Displayed as a badge on each row.', true, NULL, 'PATCH_043: department text column on app_inventory and ai_org_tools. app_inventory.js: department field in General modal with native datalist autocomplete, department badge in _ainvRow(), field in _ainvBuildPayload(). ai_tool_catalog.js: _aitcDeptDatalist() helper, department field in AddFromCatalog/AddCustom/EditOrgTool modals, badge in org tools table, field in all three save functions.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov10', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 9, 'Shareable submission links with timeout for Application Inventory and AI Tool Catalog â€” platform admin or admin can generate a time-limited link (configurable: 24h / 7d / 30d) for a specific org. Anyone with the link can submit a new app or AI tool on behalf of their department without a login. Submissions land in a ''Pending Review'' status. Admin sees a pending queue and can approve (promote to Active) or reject. Link can be revoked early. Stored in a submission_tokens table with org_id, module (app_inventory / ai_tool_catalog), expires_at, and revoked flag.', true, NULL, 'PATCH_044: submission_tokens + pending_submissions tables. js/submission_portal.js: public form (bootSubmissionPortal, spSubmit, spToggleDc, spSetAiMode). Admin links modal in app_inventory.js (appInvOpenLinks, appInvGenerateLink, appInvRevokeToken, appInvApproveSubmission, appInvStartReject, appInvConfirmReject, _ainvLinksModal) and ai_tool_catalog.js (aitcOpenLinks, aitcGenerateLink, aitcRevokeToken, aitcApproveSubmission, aitcStartReject, aitcConfirmReject, _aitcLinksModal). sb.submissionTokens + sb.pendingSubmissions in supabase.js. _SUBMIT_TOKEN in config.js, portal intercept in startApp(). Submission form: submitter name/email, catalog-pick or custom tool name, website, department, data classification chips, purpose. No governance fields exposed to submitters.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov11', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 10, 'Regulatory scope tagging for Application Inventory and AI Tool Inventory â€” select which compliance frameworks apply (SOX, PCI-DSS, HIPAA, PIPEDA/Privacy) plus a freetext ''Other'' field. Show framework abbreviation badges in the table row. Governance hub reorganized into logical sub-groups: Inventories / Risk Registers / Other. IR Priority Tier (P1â€“P4) now visible alongside BCDR tier in the table.', true, NULL, 'PATCH_045: regulatory_scope jsonb + regulatory_scope_other text columns on app_inventory. home.js: GOVERNANCE_GROUPS replaces GOVERNANCE_CATALOG, renderGovernanceHub() renders sub-groups (Inventories/Risk Registers/Other) with _govCard() helper. app_inventory.js: Risk tab now has 4-checkbox framework grid (SOX/PCI-DSS/HIPAA/PIPEDA) + Other text input; table Crit./Risk cell shows actual framework abbreviation badges; table BCDR column renamed BCDR/IR and shows both BCDR priority + IR P-tier stacked. _appInvGetScopes() helper reads checkboxes. in_regulatory_scope derived from scope array length.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov12', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 11, 'AI Tool Inventory â†’ Application Inventory link â€” AI org tools can optionally reference an Application Inventory entry via app_inventory_id FK. When linked, BCDR priority, IR tier, and criticality are inherited from the linked app entry rather than stored separately. In the AI Tool edit modal, a ''Link to Application'' picker lets admin choose from the org''s app_inventory entries. BCDR/criticality treatment for AI Tools follows the linked app; unlinked AI tools keep a lighter risk tier (High/Medium/Low). Also add regulatory_scope to ai_org_tools table.', true, NULL, 'PATCH_046: app_inventory_id uuid FK + regulatory_scope jsonb + regulatory_scope_other text on ai_org_tools. ai_tool_catalog.js: appList/appListOrgId added to aiCatState; aitcLoadAppList() fetches app_inventory for current org and is called from loadAiInventory(); _aitcLinkedAppCard() renders inherited criticality/BCDR/IR badge strip; aitcRefreshLinkedApp() updates card on select change; edit modal (_aitcModalEditOrgTool) now has Linked Application select picker + live inherited-fields card + SOX/PCI-DSS/HIPAA/PIPEDA checkboxes + Other text field; aitcSaveEditOrgTool() writes app_inventory_id, regulatory_scope, regulatory_scope_other; table row shows ðŸ”— app name badge + regulatory scope colour-coded badges.', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('gov13', 'governance', 'Governance â€” Application Inventory and Vendor Directory', 2, 12, 'Email submission link â€” when a shareable link is sent to a client/contact via the submission portal (gov10), also send an email with the link. Reduces friction for clients who need to respond to a survey or form. Requires Supabase Edge Function or email provider integration.', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ex1', 'exercises_hub', 'Exercises Hub & Scoring', 3, 0, 'Tabletop scoring model â€” 0â€“100 score per completed session. Four dimensions: criticality accuracy (35%), breach declaration quality (30%), IR phase coverage (20%), insurer notification completeness (15%). Weighted average â†’ single score. Stored in tabletop_sessions.exercise_score. Computed at AAR render and written on session complete.', true, NULL, 'ttComputeExerciseScore() in tabletop.js returns {total, critScore, declScore, phaseScore, notifScore, ...}. ttScoreColor(score) helper for green/amber/red. ttRenderAAR() replaced inline formula with score card showing all 4 dimensions + color-banded total. ttFinalise() now writes exercise_score to Supabase. History list and history AAR both show score. PATCH_057 adds exercise_score column (IF NOT EXISTS).', '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ex2', 'exercises_hub', 'Exercises Hub & Scoring', 3, 1, 'Dashboard exercises chicklet with SVG dial â€” Replaces link-only Exercises widget. SVG dial arc (0â€“100) shows average exercise_score across all completed sessions. Colour-banded: green â‰¥70, amber 40â€“69, red <40, grey = no data. Sessions run count, last exercise date. ''Start New'' CTA.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('ex3', 'exercises_hub', 'Exercises Hub & Scoring', 3, 2, 'Exercises Hub â€” proper landing page replacing current card-grid stub. Stat strip (total sessions, sessions this year, last exercise date). Track cards (Operational, AI Governance, Executive, Vendor/BCDR) each showing last run date and score dial from exercise_score. Recent exercises table. ''Start New Exercise'' CTA per track.', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id    = EXCLUDED.section_id,
  section_title = EXCLUDED.section_title,
  section_phase = EXCLUDED.section_phase,
  sort_order    = EXCLUDED.sort_order,
  "text"        = EXCLUDED."text",
  done          = EXCLUDED.done,
  priority      = EXCLUDED.priority,
  notes         = EXCLUDED.notes,
  dependencies  = EXCLUDED.dependencies,
  status        = EXCLUDED.status,
  updated_at    = now();
