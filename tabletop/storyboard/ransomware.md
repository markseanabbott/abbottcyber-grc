# Archetype: Ransomware

> See [../FLOWMAP_INDEX.md](../FLOWMAP_INDEX.md) for engine rules, NIST phase key, role key, and canonical phase mapping.
> **Card grids below are generated from `tt_inject_cards` — do not edit them by hand. Run `node tabletop/generate_grids.mjs` to refresh.**

**Track:** IR | **Stages:** 6 | **Cards:** 22 | **Roles:** IC / TL / CL / LC / ES

---

## Stage skeleton

| Stage | Label | ATT&CK | NIST phase |
|-------|-------|--------|------------|
| 1 | Initial Access | TA0001 | Detect/Analyze |
| 2 | Execution & C2 | TA0002 | Detect/Analyze |
| 3 | Credential Access | TA0006 | Contain |
| 4 | Privilege Escalation & Lateral Movement | TA0004 / TA0008 | Contain |
| 5 | Pre-Impact | TA0005 / TA0009 / TA0010 | Eradicate |
| 6 | Impact (terminal) | TA0040 | Eradicate |

---

## Card grids

<!-- AUTOGEN:cardgrid:ransomware START -->

**Stage 1 — Initial Access · Detect/Analyze**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R1a | Phishing attachment delivered to employee - macro enabled | *(none)* | `access:email` · `foothold:achieved` | 10 | High | 1 |
| R1b | VPN / edge appliance exploit on unpatched CVE | *(none)* | `access:web` · `foothold:achieved` | 10 | Critical | 1 |
| R1c | RDP brute force on externally exposed port | *(none)* | `access:interactive` · `foothold:achieved` | 10 | High | 1 |

**Stage 2 — Execution & C2 · Detect/Analyze**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R2a | Macro executes - Cobalt Strike beacon dropped in memory | `access:email` | `c2:established` · `c2:beaconing` | 10 | Critical | 1 |
| R2b | Web shell planted on compromised edge device | `access:web` | `c2:established` · `c2:webshell` | 10 | Critical | 1 |
| R2c | Attacker deploys tooling via live RDP session | `access:interactive` | `c2:established` · `c2:interactive` | 10 | Critical | 1 |
| R2d | LOTL - PowerShell scheduled task, no beacon | `foothold:achieved` | `c2:established` · `persistence:established` | 7 | High | 1 |

**Stage 3 — Credential Access · Contain**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R3a | LSASS dump via Mimikatz or equivalent | `c2:established` | `creds:domain_user` | 10 | Critical | 2 |
| R3b | Kerberoasting - service account TGS tickets cracked offline | `c2:established` | `creds:service_account` · `creds:domain_user` | 10 | Critical | 2 |
| R3c | NTLM hash stolen from local SAM - pass-the-hash prepared | `c2:established` | `creds:local_admin` | 10 | High | 2 |
| R3d | Browser credential harvest and stored password dump | `persistence:established` | `creds:domain_user` | 10 | High | 2 |

**Stage 4 — Privilege Escalation & Lateral Movement · Contain**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R4a | Service account pivots to domain controller | `creds:service_account` | `priv:domain_admin` · `lateral:complete` | 10 | Critical | 2 |
| R4b | Pass-the-hash to domain controller | `creds:domain_user` | `priv:domain_admin` · `lateral:complete` | 10 | Critical | 2 |
| R4c | Local admin relay - spreads to nearby hosts, stops short of DC | `creds:local_admin` | `lateral:partial` | 10 | High | 2 |

**Stage 5 — Pre-Impact · Eradicate**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R5a | Shadow copy deletion and backup agent disabled | `priv:domain_admin` | `backups:disabled` · `impact:imminent` | 10 | Critical | 3 |
| R5b | 80 GB data staged and exfiltrated - double extortion lever armed | `lateral:complete` | `exfil:complete` · `extortion:leverage` · `impact:imminent` | 10 | Critical | 3 |
| R5c | Ransomware payload pre-staged across all reachable hosts | `lateral:partial` | `payload:staged` · `impact:imminent` | 10 | Critical | 3 |
| R5d | EDR and AV disabled domain-wide via GPO | `priv:domain_admin` | `defense:blind` · `impact:imminent` | 10 | Critical | 3 |
| R5e | EDR silenced on reachable hosts (partial blind) | `lateral:partial` | `defense:blind` · `impact:imminent` | 10 | High | 3 |

**Stage 6 — Impact (terminal) · Eradicate**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R6a | Ransomware deployed via GPO or remote execution script | `impact:imminent` | *(terminal)* | 10 | Critical | 3 |
| R6b | Encrypt and threaten public data leak (double extortion) | `exfil:complete` | *(terminal)* | 10 | Critical | 3 |
| R6c | Backup destruction first, then encrypt - no clean recovery path | `backups:disabled` | *(terminal)* | 10 | Critical | 3 |
<!-- AUTOGEN:cardgrid:ransomware END -->

---

## Example paths

**Path 1 — Classic phishing, no recovery path** `R1a → R2a → R3a → R4b → R5a → R6c`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | R1a Phishing attachment | `access:email`, `foothold:achieved` |
| 2 | R2a Cobalt Strike beacon | `c2:established`, `c2:beaconing` |
| 3 | R3a LSASS dump | `creds:domain_user` |
| 4 | R4b PTH to DC | `priv:domain_admin`, `lateral:complete` |
| 5 | R5a Shadow copy deletion | `backups:disabled`, `impact:imminent` |
| 6 | R6c Backup-first encrypt | *(terminal)* |

Narrative: Front-desk staff clicks a macro. Cobalt Strike beacon establishes quietly. Attacker dumps LSASS, moves laterally to DC via PTH, destroys shadow copies, then detonates with backup destruction first. No clean restore path.

Key discussion: What is your RTO with no backups? Is your backup provider's console on the same domain? Who calls cyber insurance?

---

**Path 2 — VPN exploit, double extortion** `R1b → R2b → R3b → R4a → R5b → R6b`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | R1b VPN CVE exploit | `access:web`, `foothold:achieved` |
| 2 | R2b Web shell on edge | `c2:established`, `c2:webshell` |
| 3 | R3b Kerberoasting | `creds:service_account`, `creds:domain_user` |
| 4 | R4a Service account to DC | `priv:domain_admin`, `lateral:complete` |
| 5 | R5b 80 GB exfiltrated | `exfil:complete`, `extortion:leverage`, `impact:imminent` |
| 6 | R6b Encrypt + data leak threat | *(terminal)* |

Narrative: Unpatched VPN CVE. Web shell persistence. Kerberoasting gets a service account. DA achieved. 80 GB of guest PII quietly exfiltrated before encryption fires. Two simultaneous ransom levers.

Key discussion: Can you negotiate without paying when data is already out? What is your notification obligation once exfil is confirmed regardless of whether you pay?

---

**Path 3 — RDP brute force, LOTL, quiet entry** `R1c → R2d → R3d → R4b → R5d → R6a`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | R1c RDP brute force | `access:interactive`, `foothold:achieved` |
| 2 | R2d LOTL scheduled task | `c2:established`, `persistence:established` |
| 3 | R3d Browser credential harvest | `creds:domain_user` |
| 4 | R4b PTH to DC | `priv:domain_admin`, `lateral:complete` |
| 5 | R5d EDR/AV disabled via GPO | `defense:blind`, `impact:imminent` |
| 6 | R6a Standard ransomware deploy | *(terminal)* |

Narrative: Exposed RDP port ground down, no C2 beacon, stays under EDR via LOTL. Browser credentials harvested, DA achieved via PTH, EDR killed via GPO, then standard deploy. No beacon ever fires — EDR has nothing to alert on.

Key discussion: What controls detect this without EDR? Does your RDP exposure exist? How does the org discover this attack happened at all?

---

*Card grids generated from `tt_inject_cards` via `tabletop/generate_grids.mjs`. Run the script to refresh after any DB change.*
