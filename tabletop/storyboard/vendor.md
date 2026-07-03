# Archetype: Vendor Compromise

> See [../FLOWMAP_INDEX.md](../FLOWMAP_INDEX.md) for engine rules, NIST phase key, role key, and canonical phase mapping.
> **Card grids below are generated from `tt_inject_cards` — do not edit them by hand. Run `node tabletop/generate_grids.mjs` to refresh.**

**Track:** IR | **Stages:** 5 | **Cards:** 17 | **Roles:** IC / TL / CL / LC / ES

---

## Stage skeleton

| Stage | Label | ATT&CK | NIST phase |
|-------|-------|--------|------------|
| 1 | Vendor Compromise | TA0001 / T1195 / T1078 | Detect/Analyze |
| 2 | Vendor Reconnaissance | TA0007 / T1583 | Detect/Analyze |
| 3 | Client Pivot | TA0008 / T1199 | Contain |
| 4 | Client Discovery & Pre-Impact | TA0007 / TA0009 | Eradicate |
| 5 | Impact (terminal) | TA0040 | Eradicate |

---

## Card grids

<!-- AUTOGEN:cardgrid:vendor_compromise START -->

**Stage 1 — Vendor Compromise · Detect/Analyze**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| V1a | MSP management console accessed via credential stuffing on reused password | *(none)* | `vendor:compromised` · `vendor:msp_access` · `access:credential_stuffing` | 10 | Critical | 1 |
| V1b | MSP technician spear-phished - RAT installed on their workstation | *(none)* | `vendor:compromised` · `vendor:msp_access` · `access:phishing` | 10 | Critical | 1 |
| V1c | SaaS vendor API key exposed in a public GitHub repository | *(none)* | `vendor:compromised` · `vendor:api_access` · `access:credential_exposure` | 10 | High | 1 |
| V1d | Trojanized software update - backdoor inserted into signed patch pushed to all managed clients | *(none)* | `vendor:compromised` · `vendor:software_update` · `access:supply_chain` | 7 | Critical | 1 |

**Stage 2 — Vendor Reconnaissance · Detect/Analyze**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| V2a | Attacker maps all client orgs in MSP console - identifies clients with admin-level RMM agents | `vendor:msp_access` | `recon:complete` · `recon:client_list` · `trust:elevated` | 10 | High | 1 |
| V2b | API documentation and live traffic reviewed - accessible client endpoints and data understood | `vendor:api_access` | `recon:complete` · `recon:api_scope` | 10 | Medium | 1 |
| V2c | Update server analysis confirms which clients have auto-update enabled and next push schedule | `vendor:software_update` | `recon:complete` · `recon:update_targets` | 10 | High | 1 |

**Stage 3 — Client Pivot · Contain**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| V3a | RMM tool executes PowerShell across all managed clients - legitimate tool, no alerts triggered | `vendor:msp_access` · `recon:client_list` | `pivot:via_rmm` · `client:foothold` | 10 | Critical | 2 |
| V3b | API token used to pull live customer PII from client via existing trusted integration | `vendor:api_access` · `recon:api_scope` | `pivot:via_api` · `client:foothold` | 10 | High | 2 |
| V3c | Trojanized update auto-installs on 23 client endpoints - backdoor active in production | `vendor:software_update` · `recon:update_targets` | `pivot:via_update` · `client:foothold` | 10 | Critical | 2 |
| V3d | Attacker selects highest-value client from MSP console and pivots via privileged RMM agent | `trust:elevated` · `recon:client_list` | `pivot:via_rmm` · `client:foothold` · `client:targeted` | 7 | Critical | 2 |

**Stage 4 — Client Discovery & Pre-Impact · Eradicate**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| V4a | BloodHound-equivalent run via RMM - full AD map acquired, domain admin path confirmed | `pivot:via_rmm` | `client:admin_creds` · `impact:imminent` | 10 | Critical | 3 |
| V4b | API pivot exposes complete customer PII dataset - attacker begins staged exfiltration | `pivot:via_api` | `exfil:staging` · `impact:imminent` | 10 | High | 3 |
| V4c | Backdoor on 23 endpoints begins silent credential harvesting and lateral reconnaissance | `pivot:via_update` | `client:admin_creds` · `impact:imminent` | 10 | Critical | 3 |

**Stage 5 — Impact (terminal) · Eradicate**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| V5a | Ransomware deployed across client environment via RMM - all managed clients encrypted simultaneously | `impact:imminent` | *(terminal)* | 10 | Critical | 3 |
| V5b | Complete customer PII exfiltrated silently via API - discovered weeks later via dark web alert | `exfil:staging` | *(terminal)* | 10 | Critical | 3 |
| V5c | Client admin credentials sold on dark web - multiple threat actors gain independent access | `client:admin_creds` | *(terminal)* | 7 | Critical | 3 |
<!-- AUTOGEN:cardgrid:vendor_compromise END -->

---

## Example paths

**Path 1 — MSP credential stuffing, mass RMM ransomware deploy** `V1a → V2a → V3a → V4a → V5a`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | V1a MSP console via credential stuffing | `vendor:compromised`, `vendor:msp_access`, `access:credential_stuffing` |
| 2 | V2a All client orgs mapped in console | `recon:complete`, `recon:client_list`, `trust:elevated` |
| 3 | V3a PowerShell via RMM — no alerts | `pivot:via_rmm`, `client:foothold` |
| 4 | V4a BloodHound via RMM — DA path confirmed | `client:admin_creds`, `impact:imminent` |
| 5 | V5a Ransomware across all managed clients | *(terminal)* |

Narrative: MSP console accessed via a reused password. Attacker maps every managed client and their RMM agent scope. Fires PowerShell across all clients via the legitimate RMM tool — no alerts. BloodHound equivalent acquires DA path. Ransomware deployed to all clients simultaneously via the same RMM channel.

Key discussion: Does your MSP enforce MFA on their management console? What is your contractual right to audit your MSP's security posture? If your MSP's RMM is the attack vector, how do you contain it without losing all managed access?

---

**Path 2 — API key on GitHub, silent PII theft** `V1c → V2b → V3b → V4b → V5b`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | V1c API key found on public GitHub | `vendor:compromised`, `vendor:api_access`, `access:credential_exposure` |
| 2 | V2b API docs and live traffic reviewed | `recon:complete`, `recon:api_scope` |
| 3 | V3b API token pulls live PII from client | `pivot:via_api`, `client:foothold` |
| 4 | V4b Full PII dataset exposed — exfil staged | `exfil:staging`, `impact:imminent` |
| 5 | V5b Silent exfil — dark web alert weeks later | *(terminal)* |

Narrative: SaaS vendor had an API key committed to a public GitHub repository months ago. Attacker finds it, reviews live API traffic, pulls complete customer PII via the trusted integration. Discovered weeks later via a dark web alert showing client records for sale.

Key discussion: Do you know which vendors have API integration access to your data? Do your vendor contracts require key rotation, secret scanning, and breach notification timelines? What is your dark web monitoring capability?

---

**Path 3 — Trojanized update, credential harvest, dark web sale** `V1d → V2c → V3c → V4c → V5c`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | V1d Backdoor in signed software update | `vendor:compromised`, `vendor:software_update`, `access:supply_chain` |
| 2 | V2c Auto-update clients and schedule confirmed | `recon:complete`, `recon:update_targets` |
| 3 | V3c Backdoor installs on 23 endpoints | `pivot:via_update`, `client:foothold` |
| 4 | V4c Silent credential harvest and recon | `client:admin_creds`, `impact:imminent` |
| 5 | V5c Creds sold — multiple actors gain access | *(terminal)* |

Narrative: Backdoor inserted into a signed software update. Auto-installs on 23 managed endpoints. Harvests credentials silently over two weeks. Admin credentials sold on a dark web forum — multiple independent threat actors purchase access. Attribution becomes impossible; multiple concurrent intrusions.

Key discussion: Do you verify software update integrity before deployment? What is your vendor's secure development and signing process? How do you respond when the same compromise is being exploited by multiple unrelated actors simultaneously?

---

*Card grids generated from `tt_inject_cards` via `tabletop/generate_grids.mjs`. Run the script to refresh after any DB change.*
