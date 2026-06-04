# Abbott Cyber Consulting — GRC Platform MVP
## Project Brief for Claude

---

### Who I Am

I am the founder of **Abbott Cyber Consulting**, a virtual CISO and CIO consulting firm based in Surrey, BC, Canada. I am not a developer. I work with Claude conversationally to build this tool — you build, I review, I approve or request changes.

My two client verticals are:
- **MSPs** — I serve as virtual CISO, assist with tool selection, and produce sales enablement materials
- **Direct clients** — primarily hospitality (hotels), with deep understanding of hotel technology, design, and scoping

My consulting philosophy is **risk-based and pragmatic** — find the highest-value areas, eliminate work that doesn't need doing, deliver the lowest cost solution that fits the client's actual risk profile.

**Brand:** Abbott Cyber Consulting | Tagline: *Prioritized risk approach*
**Brand colours:** Navy `#152168`, Cyan `#07B4D9`, Light cyan `#07D1F2`
**Font:** Kanit (700 for headings, 400 for body)

---

### What We Are Building

A **Security Scorecard / GRC Platform** — a web-based tool that lets organisations assess their cybersecurity posture, manage risk, run tabletop exercises, and report across a multi-tier org hierarchy.

This is an **artifact-first MVP**. We build it here in Claude as interactive artifacts. I use it with real clients. We iterate based on what works. No code deployment needed at this stage.

---

### Target Users

| User Type | Description |
|---|---|
| **Grandfather** | MSP or Franchisor HQ — sees everything across all orgs |
| **Father** | Regional operator or MSP client group — sees their own children |
| **Child** | Individual client site or franchise location — self-contained |

The platform must support both **MSP** (Grandfather = MSP, Father = client vertical, Child = end client) and **franchise** (Grandfather = HQ, Father = regional operator, Child = location) org structures.

---

### Build Approach

- Build **one section at a time**, working through the backlog.json file
- Each session: pick the next open section → build it as a working artifact → I review → I approve → mark items done
- When I say "next feature" or "continue the build", read the backlog and pick the next section with `"done": false`
- When I approve something, update the relevant items in backlog.json to `"done": true`
- Always ask before starting a new section if it's not obvious which one comes next

---

### Build Phases

**Phase 1 — Build first (MVP core):**
- Survey Engine (CIS Controls v8)
- Org Hierarchy (Grandfather / Father / Child)
- Core scoring and gap analysis

**Phase 2 — Build second:**
- Risk Register (full columns, heatmap, Excel export)
- Consolidated Reporting (Grandfather and Father dashboards)
- Executive dashboard and PDF export

**Phase 3 — Build third:**
- Vuln scan integration
- NIST CSF 2.0 framework expansion
- Pen test integration
- Tabletop exercise program (Operational, Executive, Vendor tracks)
- After Action Reports

---

### Design Principles

- **Clean, professional UI** — this is a client-facing tool, not an internal prototype
- **Navy and cyan colour palette** — match Abbott Cyber brand
- **Non-technical language at the executive layer** — score summaries in business terms, not control IDs
- **Risk-based prioritisation** — always surface highest-risk items first
- **Exportable outputs** — PDF for client reports, Excel for risk registers and action logs
- **Hierarchy-aware** — every feature must consider how it behaves at Grandfather, Father, and Child tier

---

### Backlog File

The file `backlog.json` in this project contains every feature broken into sections with IDs, phase numbers, and `done` flags. Use it as the source of truth for what's been built and what's next. Do not invent features outside the backlog without asking me first — but do suggest additions if you see a gap.

---

### How to Start Each Session

1. Read `backlog.json`
2. Identify the next incomplete section in Phase 1
3. Tell me what you're about to build and confirm before starting
4. Build it as an interactive artifact
5. Wait for my approval before marking done or moving to the next item

---

*Last updated: May 2026*
