# Archetype: Insider Threat

> See [../FLOWMAP_INDEX.md](../FLOWMAP_INDEX.md) for engine rules, NIST phase key, role key, and canonical phase mapping.
> **Card grids below are generated from `tt_inject_cards` — do not edit them by hand. Run `node tabletop/generate_grids.mjs` to refresh.**

**Track:** IR | **Stages:** 5 | **Cards:** 19 | **Roles:** IC / TL / CL / LC / ES

---

## Stage skeleton

| Stage | Label | ATT&CK | NIST phase |
|-------|-------|--------|------------|
| 1 | Initial Act / Motivation | — (insider misuse) | Detect/Analyze |
| 2 | Reconnaissance & Data Mapping | TA0007 / T1083 | Detect/Analyze |
| 3 | Data Staging | TA0009 / T1005 / T1213 | Contain |
| 4 | Exfiltration | TA0010 / T1052 / T1567 | Eradicate |
| 5 | Impact (terminal) | — | Eradicate |

---

## Card grids

<!-- AUTOGEN:cardgrid:insider START -->

**Stage 1 — Initial Act / Motivation · Detect/Analyze**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| I1a | Disgruntled IT admin queries HR and finance records outside job scope after being passed over | *(none)* | `motive:grievance` · `access:privileged` · `insider:active` | 10 | High | 1 |
| I1b | Sales rep accepts position at competitor - begins archiving client contact and pricing data | *(none)* | `motive:competitive` · `access:standard` · `insider:active` | 10 | High | 1 |
| I1c | Finance analyst approached by external party and agrees to exfiltrate data for payment | *(none)* | `motive:financial` · `access:standard` · `insider:active` | 7 | Critical | 1 |
| I1d | Terminated employee AD account not disabled - remote access continues 48 hours post-termination | *(none)* | `motive:grievance` · `access:deprovision_missed` · `insider:active` | 7 | Critical | 1 |

**Stage 2 — Reconnaissance & Data Mapping · Detect/Analyze**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| I2a | Privileged user runs broad database queries - maps tables containing PII, financials, and IP | `access:privileged` | `recon:data_mapped` · `recon:db_queried` | 10 | High | 1 |
| I2b | Standard user browses file shares - identifies folders with insufficient access controls | `access:standard` | `recon:data_mapped` · `recon:share_browsed` | 10 | Medium | 1 |
| I2c | Insider tests DLP behavior with small transfers - confirms personal cloud storage is not scanned | `access:standard` | `recon:dlp_gap` · `recon:data_mapped` | 7 | High | 1 |
| I2d | Terminated employee uses stale VPN credentials to re-enter environment and navigate shared drives | `access:deprovision_missed` | `recon:data_mapped` · `recon:remote_access` | 10 | Critical | 1 |

**Stage 3 — Data Staging · Contain**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| I3a | Insider runs bulk export of customer database to local Downloads folder - 3.2 GB | `recon:data_mapped` | `data:staged_local` · `data:volume_high` · `data:ready` | 10 | High | 2 |
| I3b | Files copied to personal Dropbox via browser - DLP gap confirmed exploited | `recon:dlp_gap` | `data:staged_cloud` · `data:volume_moderate` · `data:ready` | 10 | High | 2 |
| I3c | USB device plugged in - 6 GB copied in 20 minutes; endpoint protection does not block USB | `recon:data_mapped` | `data:staged_usb` · `data:volume_high` · `data:ready` | 7 | High | 2 |
| I3d | Files emailed to personal Gmail in small batches over two weeks - under size threshold | `recon:data_mapped` | `data:staged_cloud` · `data:volume_moderate` · `data:ready` | 7 | High | 2 |

**Stage 4 — Exfiltration · Eradicate**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| I4a | Insider resigns and walks out with USB containing client database - discovered during exit interview | `data:staged_usb` | `impact:data_loss` | 10 | High | 3 |
| I4b | Cloud sync completes overnight - 4.7 GB confirmed downloaded to personal device | `data:staged_cloud` | `impact:data_loss` | 10 | High | 3 |
| I4c | IR team locates local staging file - but forensics confirms a prior USB copy was already made | `data:staged_local` | `impact:data_loss` | 10 | High | 3 |
| I4d | Insider transfers data directly to competitor via secure file transfer - large outbound transfer logged | `motive:competitive` · `data:ready` | `impact:data_loss` | 7 | Critical | 3 |

**Stage 5 — Impact (terminal) · Eradicate**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| I5a | Competitor announces product matching stolen IP within 90 days - data confirmed used | `impact:data_loss` | *(terminal)* | 10 | High | 3 |
| I5b | Regulatory notification required - PII of 50,000+ individuals confirmed exfiltrated | `impact:data_loss` | *(terminal)* | 10 | Critical | 3 |
| I5c | Insider arrested at airport with USB - criminal referral filed, data partially recovered | `data:staged_usb` | *(terminal)* | 7 | High | 3 |
<!-- AUTOGEN:cardgrid:insider END -->

---

## Example paths

**Path 1 — Privileged admin, bulk export, discovered late** `I1a → I2a → I3a → I4c → I5b`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | I1a Disgruntled IT admin — out-of-scope queries | `motive:grievance`, `access:privileged`, `insider:active` |
| 2 | I2a Broad DB query — PII and finance tables mapped | `recon:data_mapped`, `recon:db_queried` |
| 3 | I3a Bulk 3.2 GB export to local Downloads | `data:staged_local`, `data:volume_high`, `data:ready` |
| 4 | I4c Local file found — but USB copy already made | `impact:data_loss` |
| 5 | I5b 50K+ PII records confirmed out — notification required | *(terminal)* |

Narrative: IT admin passed over for promotion starts probing HR and finance data. Bulk-exports 3.2 GB customer database. IR discovers the local staging file — but forensics reveals a USB copy was made days earlier. 50K+ PII records are confirmed out. Regulatory notification required.

Key discussion: What does your UEBA / DBA monitoring alert on? What is the threshold for notifying affected individuals under applicable US state law? Does your IR plan cover the insider vector specifically?

---

**Path 2 — Competitive departure, DLP gap exploited** `I1b → I2c → I3b → I4b → I5a`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | I1b Sales rep accepts competitor offer | `motive:competitive`, `access:standard`, `insider:active` |
| 2 | I2c DLP gap confirmed via small test transfers | `recon:dlp_gap`, `recon:data_mapped` |
| 3 | I3b Client list and pricing copied to Dropbox | `data:staged_cloud`, `data:volume_moderate`, `data:ready` |
| 4 | I4b Cloud sync completes overnight | `impact:data_loss` |
| 5 | I5a Competitor product launch in 90 days | *(terminal)* |

Narrative: Sales rep resigns and accepts a competitor offer. Tests DLP with small personal cloud transfers — finds a gap. Copies client contact list and pricing to personal Dropbox. Cloud sync runs overnight. Competitor launches a near-identical product in 90 days.

Key discussion: What does your DLP policy cover? Is personal cloud storage blocked or just monitored? What employment agreement provisions (non-compete, NDA) apply, and are they enforceable in your state?

---

**Path 3 — Terminated employee, stale access, USB, arrest** `I1d → I2d → I3c → I4a → I5c`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | I1d Terminated account not disabled — access continues | `motive:grievance`, `access:deprovision_missed`, `insider:active` |
| 2 | I2d Stale VPN used to navigate shared drives | `recon:data_mapped`, `recon:remote_access` |
| 3 | I3c 6 GB USB copy — endpoint doesn't block | `data:staged_usb`, `data:volume_high`, `data:ready` |
| 4 | I4a Walks out with USB — found at exit interview | `impact:data_loss` |
| 5 | I5c Arrested at airport — criminal referral filed | *(terminal)* |

Narrative: Terminated employee retains active VPN credentials for 48 hours. Re-enters via VPN, navigates file shares. Plugs in a USB — endpoint doesn't block it. Walks out. Discovered during airport security screening on departure flight. Criminal referral filed; partial recovery.

Key discussion: What is your offboarding checklist and SLA for account deprovisioning? How quickly are VPN credentials revoked? Does your endpoint policy block USB mass storage?

---

*Card grids generated from `tt_inject_cards` via `tabletop/generate_grids.mjs`. Run the script to refresh after any DB change.*
