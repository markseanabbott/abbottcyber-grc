const CIS_SAFEGUARDS = [
  // CIS Controls v8 — complete 153-safeguard dataset

  // ──── Control 1: Inventory & Control of Enterprise Assets ────
  { ctrl: 1, ctrlName: 'Inventory & Control of Enterprise Assets', sf: '1.1', ig: 1,
    title: 'Establish & Maintain Detailed Enterprise Asset Inventory',
    sub: 'Maintain an accurate, detailed inventory of all enterprise assets with the potential to store or process data. Include end-user devices, network devices, non-computing/IoT devices, and servers.' },
  { ctrl: 1, ctrlName: 'Inventory & Control of Enterprise Assets', sf: '1.2', ig: 1,
    title: 'Address Unauthorised Assets',
    sub: 'Ensure that a process exists to address unauthorised assets on a weekly basis. The enterprise may choose to remove the asset from the network, deny the asset from connecting remotely, or quarantine the asset.' },
  { ctrl: 1, ctrlName: 'Inventory & Control of Enterprise Assets', sf: '1.3', ig: 2,
    title: 'Utilise an Active Discovery Tool',
    sub: 'Utilise an active discovery tool to identify assets connected to the enterprise\'s network. Review and use scans to update the asset inventory at least quarterly, or more frequently.' },
  { ctrl: 1, ctrlName: 'Inventory & Control of Enterprise Assets', sf: '1.4', ig: 2,
    title: 'Use DHCP Logging to Update Enterprise Asset Inventory',
    sub: 'Use Dynamic Host Configuration Protocol (DHCP) logging on all DHCP servers or IP address management tools to update the enterprise\'s asset inventory. Review and use scans to update the asset inventory at a minimum weekly, or more frequently.' },
  { ctrl: 1, ctrlName: 'Inventory & Control of Enterprise Assets', sf: '1.5', ig: 3,
    title: 'Use a Passive Asset Discovery Tool',
    sub: 'Use a passive discovery tool to identify assets connected to the enterprise\'s network. Review and use scans to update the asset inventory at a minimum weekly, or more frequently.' },

  // ──── Control 2: Inventory & Control of Software Assets ────
  { ctrl: 2, ctrlName: 'Inventory & Control of Software Assets', sf: '2.1', ig: 1,
    title: 'Establish & Maintain a Software Inventory',
    sub: 'Establish and maintain a detailed inventory of all licensed software installed on enterprise assets. Include title, publisher, initial install/use date, and business purpose.' },
  { ctrl: 2, ctrlName: 'Inventory & Control of Software Assets', sf: '2.2', ig: 1,
    title: 'Ensure Authorised Software is Currently Supported',
    sub: 'Ensure that only currently supported software is designated as authorised in the software inventory. Review the software list to verify software support at least monthly, or more frequently.' },
  { ctrl: 2, ctrlName: 'Inventory & Control of Software Assets', sf: '2.3', ig: 1,
    title: 'Address Unauthorised Software',
    sub: 'Ensure that unauthorised software is either removed from use on enterprise assets or receives a documented exception. Review monthly, or more frequently.' },
  { ctrl: 2, ctrlName: 'Inventory & Control of Software Assets', sf: '2.4', ig: 2,
    title: 'Utilise Automated Software Inventory Tools',
    sub: 'Utilise software inventory tools, when possible, throughout the enterprise to automate the discovery and documentation of installed software.' },
  { ctrl: 2, ctrlName: 'Inventory & Control of Software Assets', sf: '2.5', ig: 2,
    title: 'Allowlist Authorised Software',
    sub: 'Use technical controls, such as application allowlisting, to ensure that only authorised software can execute or be accessed. Reassess bi-annually, or more frequently.' },
  { ctrl: 2, ctrlName: 'Inventory & Control of Software Assets', sf: '2.6', ig: 2,
    title: 'Allowlist Authorised Libraries',
    sub: 'Use technical controls to ensure that only authorised software libraries, such as specific .dll, .ocx, .so files, are allowed to load into a system process. Block unauthorised libraries from loading. Reassess bi-annually, or more frequently.' },
  { ctrl: 2, ctrlName: 'Inventory & Control of Software Assets', sf: '2.7', ig: 3,
    title: 'Allowlist Authorised Scripts',
    sub: 'Use technical controls, such as digital signatures and version control, to ensure that only authorised scripts, such as .ps1 and .py files, are allowed to execute. Block unauthorised scripts from executing. Reassess bi-annually, or more frequently.' },

  // ──── Control 3: Data Protection ────
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.1', ig: 1,
    title: 'Establish & Maintain a Data Management Process',
    sub: 'Establish and maintain a data management process. In the process, address data sensitivity, data owner, handling of data, data retention limits, and disposal requirements based on sensitivity and retention standards.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.2', ig: 1,
    title: 'Establish & Maintain a Data Inventory',
    sub: 'Establish and maintain a data inventory, based on the enterprise\'s data management process. Inventory sensitive data, at a minimum. Review and update inventory annually, or more frequently.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.3', ig: 1,
    title: 'Configure Data Access Control Lists',
    sub: 'Configure data access control lists based on a user\'s need to know. Apply data access control lists, also known as access permissions, to local and remote file systems, databases, and applications.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.4', ig: 1,
    title: 'Enforce Data Retention',
    sub: 'Retain data according to the enterprise\'s data management process. Data retention must include both minimum and maximum timelines.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.5', ig: 1,
    title: 'Securely Dispose of Data',
    sub: 'Securely dispose of data as outlined in the enterprise\'s data management process. Ensure the disposal process and method are commensurate with the data sensitivity.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.6', ig: 2,
    title: 'Encrypt Data on End-User Devices',
    sub: 'Encrypt data on end-user devices containing sensitive data. Example implementations can include Windows BitLocker®, Apple FileVault®, and Linux® dm-crypt.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.7', ig: 2,
    title: 'Establish & Maintain a Data Classification Scheme',
    sub: 'Establish and maintain an overall data classification scheme for the enterprise. Enterprises may use labels such as \'Sensitive\', \'Confidential\', and \'Public\'. Encrypt data with higher sensitivity. Review and update the classification scheme annually, or when significant enterprise changes occur.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.8', ig: 2,
    title: 'Document Data Flows',
    sub: 'Document data flows. Data flow documentation includes service provider data flows and should be based on the enterprise\'s data management process. Review and update documentation annually, or when significant enterprise changes occur.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.9', ig: 2,
    title: 'Encrypt Data on Removable Media',
    sub: 'Encrypt data on removable media.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.10', ig: 2,
    title: 'Encrypt Sensitive Data in Transit',
    sub: 'Encrypt sensitive data in transit. Example implementations can include Transport Layer Security (TLS) and Open Secure Shell (OpenSSH).' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.11', ig: 2,
    title: 'Encrypt Sensitive Data at Rest',
    sub: 'Encrypt sensitive data at rest on servers, applications, and databases containing sensitive data. Storage-layer encryption, also known as server-side encryption, meets the minimum requirement of this safeguard.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.12', ig: 3,
    title: 'Segment Data Processing & Storage Based on Sensitivity',
    sub: 'Segment data processing and storage based on the sensitivity of the data. Do not process sensitive data on enterprise assets intended for lower sensitivity data.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.13', ig: 3,
    title: 'Deploy a Data Loss Prevention Solution',
    sub: 'Implement an automated tool, such as a host-based Data Loss Prevention (DLP) tool, to identify all sensitive data stored, processed, or transmitted through enterprise assets, including those located onsite or at a remote service provider, and update the enterprise\'s sensitive data inventory.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.14', ig: 3,
    title: 'Log Sensitive Data Access',
    sub: 'Log sensitive data access, including modification and disposal. Conduct this logging throughout the life of the data. Review logs periodically.' },

  // ──── Control 4: Secure Configuration of Enterprise Assets & Software ────
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.1', ig: 1,
    title: 'Establish & Maintain a Secure Configuration Process',
    sub: 'Establish and maintain a secure configuration process for enterprise assets (end-user devices, servers, network devices) and software. Review and update documentation annually, or when significant enterprise changes occur.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.2', ig: 1,
    title: 'Establish & Maintain a Secure Configuration Process for Network Infrastructure',
    sub: 'Establish and maintain a secure configuration process for network devices. Review and update documentation annually, or when significant enterprise changes occur that could impact this safeguard.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.3', ig: 1,
    title: 'Configure Automatic Session Locking on Enterprise Assets',
    sub: 'Configure automatic session locking on enterprise assets after a defined period of inactivity. For general purpose operating systems, the period must not exceed 15 minutes. For mobile end-user devices, the period must not exceed 2 minutes.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.4', ig: 1,
    title: 'Implement & Manage a Firewall on Servers',
    sub: 'Implement and manage a firewall on servers, where supported. Example implementations include a virtual firewall, operating system firewall, or a third-party firewall agent.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.5', ig: 1,
    title: 'Implement & Manage a Firewall on End-User Devices',
    sub: 'Implement and manage a host-based firewall or port-filtering tool on end-user devices, with a default-deny rule that drops all traffic except those services and ports that are explicitly allowed.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.6', ig: 2,
    title: 'Securely Manage Enterprise Assets & Software',
    sub: 'Securely manage enterprise assets and software. Example implementations include managing configuration through version-controlled infrastructure-as-code and accessing administrative interfaces over secure network protocols such as SSH and HTTPS. Do not use insecure protocols such as Telnet and HTTP.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.7', ig: 2,
    title: 'Manage Default Accounts on Enterprise Assets & Software',
    sub: 'Manage default accounts on enterprise assets and software, such as root, administrator, and other pre-configured vendor accounts. Example implementations can include disabling default accounts or making them unusable.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.8', ig: 2,
    title: 'Uninstall or Disable Unnecessary Services on Enterprise Assets & Software',
    sub: 'Uninstall or disable unnecessary services on enterprise assets and software, such as an unused file sharing service, web application module, or service function.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.9', ig: 2,
    title: 'Configure Trusted DNS Servers on Enterprise Assets',
    sub: 'Configure trusted DNS servers on enterprise assets. Example implementations include configuring assets to use enterprise-controlled DNS servers and/or reputable externally accessible DNS servers.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.10', ig: 2,
    title: 'Enforce Automatic Device Lockout on Portable End-User Devices',
    sub: 'Enforce automatic device lockout following a predetermined threshold of local failed authentication attempts on portable end-user devices, where supported. For laptops, do not allow more than 20 failed authentication attempts; for tablets and smartphones, no more than 10 failed attempts.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.11', ig: 2,
    title: 'Enforce Remote Wipe Capability on Portable End-User Devices',
    sub: 'Remotely wipe enterprise data from enterprise-owned portable end-user devices when deemed appropriate, such as lost or stolen devices or when an individual no longer supports the enterprise.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.12', ig: 3,
    title: 'Separate Enterprise Workspaces on Mobile End-User Devices',
    sub: 'Ensure separate enterprise workspaces are used on mobile end-user devices, where supported. Example implementations include using an Apple® Configuration Profile or Android™ Work Profile to separate enterprise applications and data from personal applications and data.' },

  // ──── Control 5: Account Management ────
  { ctrl: 5, ctrlName: 'Account Management', sf: '5.1', ig: 1,
    title: 'Establish & Maintain an Inventory of Accounts',
    sub: 'Establish and maintain an inventory of all accounts managed in the enterprise. The inventory must include both user and administrator accounts. Validate that all active accounts are authorised, on a recurring basis.' },
  { ctrl: 5, ctrlName: 'Account Management', sf: '5.2', ig: 1,
    title: 'Use Unique Passwords',
    sub: 'Use unique passwords for all enterprise assets. Best practice implementation includes, at minimum, an 8-character password for accounts using MFA and a 14-character password for accounts not using MFA.' },
  { ctrl: 5, ctrlName: 'Account Management', sf: '5.3', ig: 1,
    title: 'Disable Dormant Accounts',
    sub: 'Delete or disable any dormant accounts after a period of 45 days of inactivity, where supported.' },
  { ctrl: 5, ctrlName: 'Account Management', sf: '5.4', ig: 1,
    title: 'Restrict Administrator Privileges to Dedicated Admin Accounts',
    sub: 'Restrict administrator privileges to dedicated administrator accounts on enterprise assets. Conduct general computing activities, such as internet browsing, email, and productivity suite use, from the user\'s primary, non-privileged account.' },
  { ctrl: 5, ctrlName: 'Account Management', sf: '5.5', ig: 2,
    title: 'Establish & Maintain an Inventory of Service Accounts',
    sub: 'Establish and maintain an inventory of service accounts. The inventory, at a minimum, must contain department owner, review date, and purpose. Perform service account reviews to validate that all active accounts are authorised, on a recurring basis.' },
  { ctrl: 5, ctrlName: 'Account Management', sf: '5.6', ig: 3,
    title: 'Centralise Account Management',
    sub: 'Centralise account management through a directory or identity service.' },

  // ──── Control 6: Access Control Management ────
  { ctrl: 6, ctrlName: 'Access Control Management', sf: '6.1', ig: 1,
    title: 'Establish an Access Granting Process',
    sub: 'Establish and follow a process, preferably automated, for granting access to enterprise assets upon new hire, rights grant, or role change of a user.' },
  { ctrl: 6, ctrlName: 'Access Control Management', sf: '6.2', ig: 1,
    title: 'Establish an Access Revoking Process',
    sub: 'Establish and follow a process, preferably automated, for revoking access to enterprise assets, through disabling accounts immediately upon termination, rights revocation, or role change of a user.' },
  { ctrl: 6, ctrlName: 'Access Control Management', sf: '6.3', ig: 1,
    title: 'Require MFA for Externally-Exposed Applications',
    sub: 'Require all externally-exposed enterprise or third-party applications to enforce MFA, where supported. Enforcing MFA through a directory service or SSO provider is a satisfactory implementation of this safeguard.' },
  { ctrl: 6, ctrlName: 'Access Control Management', sf: '6.4', ig: 1,
    title: 'Require MFA for Remote Network Access',
    sub: 'Require MFA for remote network access. Enforcing MFA through a directory service or SSO provider is a satisfactory implementation of this safeguard.' },
  { ctrl: 6, ctrlName: 'Access Control Management', sf: '6.5', ig: 2,
    title: 'Require MFA for Administrative Access',
    sub: 'Require MFA for all administrative access accounts, where supported, on all enterprise assets, whether managed on-site or through a third-party provider.' },
  { ctrl: 6, ctrlName: 'Access Control Management', sf: '6.6', ig: 2,
    title: 'Establish & Maintain an Inventory of Authentication & Authorisation Systems',
    sub: 'Establish and maintain an inventory of the enterprise\'s authentication and authorisation systems, including those hosted on-site or at a remote service provider. Review and update the inventory, at a minimum, annually, or more frequently.' },
  { ctrl: 6, ctrlName: 'Access Control Management', sf: '6.7', ig: 2,
    title: 'Centralise Access Control',
    sub: 'Centralise access control for all enterprise assets through a directory service or SSO provider, where supported.' },
  { ctrl: 6, ctrlName: 'Access Control Management', sf: '6.8', ig: 3,
    title: 'Define & Maintain Role-Based Access Control',
    sub: 'Define and maintain role-based access control, through determining and documenting the access rights necessary for each role within the enterprise to successfully carry out its assigned duties. Perform access control reviews of enterprise assets to validate that all privileges are authorised, on a recurring schedule at a minimum annually, or more frequently.' },

  // ──── Control 7: Continuous Vulnerability Management ────
  { ctrl: 7, ctrlName: 'Continuous Vulnerability Management', sf: '7.1', ig: 2,
    title: 'Establish & Maintain a Vulnerability Management Process',
    sub: 'Establish and maintain a documented vulnerability management process for enterprise assets. Review and update documentation annually, or when significant enterprise changes occur that could impact this safeguard.' },
  { ctrl: 7, ctrlName: 'Continuous Vulnerability Management', sf: '7.2', ig: 2,
    title: 'Establish & Maintain a Remediation Process',
    sub: 'Establish and maintain a risk-based remediation strategy documented in a remediation process, with monthly, or more frequent, reviews.' },
  { ctrl: 7, ctrlName: 'Continuous Vulnerability Management', sf: '7.3', ig: 2,
    title: 'Perform Automated Operating System Patch Management',
    sub: 'Perform operating system updates on enterprise assets through automated patch management on a monthly, or more frequent, basis.' },
  { ctrl: 7, ctrlName: 'Continuous Vulnerability Management', sf: '7.4', ig: 2,
    title: 'Perform Automated Application Patch Management',
    sub: 'Perform application updates on enterprise assets through automated patch management on a monthly, or more frequent, basis.' },
  { ctrl: 7, ctrlName: 'Continuous Vulnerability Management', sf: '7.5', ig: 2,
    title: 'Perform Automated Vulnerability Scans of Internal Enterprise Assets',
    sub: 'Perform automated vulnerability scans of internal enterprise assets on a quarterly, or more frequent, basis. Conduct both authenticated and unauthenticated scans, using a SCAP-compliant vulnerability scanning tool.' },
  { ctrl: 7, ctrlName: 'Continuous Vulnerability Management', sf: '7.6', ig: 3,
    title: 'Perform Automated Vulnerability Scans of Externally-Exposed Enterprise Assets',
    sub: 'Perform automated vulnerability scans of externally-exposed enterprise assets using a SCAP-compliant vulnerability scanning tool. Perform scans on a monthly, or more frequent, basis.' },
  { ctrl: 7, ctrlName: 'Continuous Vulnerability Management', sf: '7.7', ig: 3,
    title: 'Remediate Detected Vulnerabilities',
    sub: 'Remediate detected vulnerabilities in software through processes and tooling on a monthly, or more frequent, basis, based on the remediation process.' },

  // ──── Control 8: Audit Log Management ────
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.1', ig: 1,
    title: 'Establish & Maintain an Audit Log Management Process',
    sub: 'Establish and maintain an audit log management process that defines the enterprise\'s logging requirements. At a minimum, address the collection, review, and retention of audit logs for enterprise assets.' },
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.2', ig: 1,
    title: 'Collect Audit Logs',
    sub: 'Collect audit logs. Ensure that logging is enabled, according to the enterprise\'s audit log management process, across enterprise assets.' },
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.3', ig: 2,
    title: 'Ensure Adequate Audit Log Storage',
    sub: 'Ensure that logging destinations maintain adequate storage to comply with the enterprise\'s audit log management process.' },
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.4', ig: 2,
    title: 'Standardise Time Synchronisation',
    sub: 'Standardise time synchronisation. Configure at least two synchronised time sources across enterprise assets, where supported.' },
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.5', ig: 2,
    title: 'Collect Detailed Audit Logs',
    sub: 'Configure detailed audit logging for enterprise assets containing sensitive data. Include event source, date, username, timestamp, source addresses, destination addresses, and other useful elements that could assist in a forensic investigation.' },
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.6', ig: 2,
    title: 'Collect DNS Query Audit Logs',
    sub: 'Collect DNS query audit logs on enterprise assets, where appropriate and supported.' },
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.7', ig: 2,
    title: 'Collect URL Request Audit Logs',
    sub: 'Collect URL request audit logs on enterprise assets, where appropriate and supported.' },
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.8', ig: 2,
    title: 'Collect Command-Line Audit Logs',
    sub: 'Collect command-line audit logs. Example implementations include collecting audit logs from PowerShell®, BASH™, and remote administrative terminals.' },
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.9', ig: 3,
    title: 'Centralise Audit Logs',
    sub: 'Centralise, to the extent possible, audit log collection and retention across enterprise assets. This is typically implemented using a SIEM or log management tool.' },
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.10', ig: 3,
    title: 'Retain Audit Logs',
    sub: 'Retain audit logs across enterprise assets for a minimum of 90 days.' },
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.11', ig: 3,
    title: 'Conduct Audit Log Reviews',
    sub: 'Conduct reviews of audit logs to detect anomalies or abnormal events that could indicate a potential threat. Conduct reviews on a weekly, or more frequent, basis.' },
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.12', ig: 3,
    title: 'Collect Service Provider Logs',
    sub: 'Collect service provider logs, where supported. Example implementations include collecting authentication and authorisation events, data creation and disposal events, and user management events.' },

  // ──── Control 9: Email & Web Browser Protections ────
  { ctrl: 9, ctrlName: 'Email & Web Browser Protections', sf: '9.1', ig: 1,
    title: 'Ensure Use of Only Fully Supported Browsers & Email Clients',
    sub: 'Ensure only fully supported browsers and email clients are allowed to execute in the enterprise, only using the latest version of browsers and email clients provided through the vendor.' },
  { ctrl: 9, ctrlName: 'Email & Web Browser Protections', sf: '9.2', ig: 1,
    title: 'Use DNS Filtering Services',
    sub: 'Use DNS filtering services on all enterprise assets to block access to known malicious domains.' },
  { ctrl: 9, ctrlName: 'Email & Web Browser Protections', sf: '9.3', ig: 2,
    title: 'Maintain & Enforce Network-Based URL Filters',
    sub: 'Enforce and update network-based URL filters to limit an enterprise asset from connecting to potentially malicious or unapproved websites. Example implementations include category-based filtering, reputation-based filtering, or through the use of block lists.' },
  { ctrl: 9, ctrlName: 'Email & Web Browser Protections', sf: '9.4', ig: 2,
    title: 'Restrict Use of Browser & Email Client Extensions',
    sub: 'Restrict, either through uninstalling or disabling, any unauthorised or unnecessary browser or email client plugins, extensions, and add-on applications.' },
  { ctrl: 9, ctrlName: 'Email & Web Browser Protections', sf: '9.5', ig: 2,
    title: 'Implement DMARC',
    sub: 'To lower the chance of spoofed or modified emails from valid domains, implement DMARC policy and verification, starting with implementing the Sender Policy Framework (SPF) and the DomainKeys Identified Mail (DKIM) standards.' },
  { ctrl: 9, ctrlName: 'Email & Web Browser Protections', sf: '9.6', ig: 3,
    title: 'Block Unnecessary File Types',
    sub: 'Block unnecessary file types attempting to enter the enterprise\'s email gateway.' },
  { ctrl: 9, ctrlName: 'Email & Web Browser Protections', sf: '9.7', ig: 3,
    title: 'Deploy & Maintain Email Server Anti-Malware Protections',
    sub: 'Deploy and maintain email server anti-malware protections, such as attachment scanning and/or sandboxing.' },

  // ──── Control 10: Malware Defenses ────
  { ctrl: 10, ctrlName: 'Malware Defenses', sf: '10.1', ig: 1,
    title: 'Deploy & Maintain Anti-Malware Software',
    sub: 'Deploy and maintain anti-malware software on all enterprise assets that support such technology, such as workstations, laptops, and servers. Example implementations include use of an Endpoint Detection and Response (EDR) client.' },
  { ctrl: 10, ctrlName: 'Malware Defenses', sf: '10.2', ig: 1,
    title: 'Configure Automatic Anti-Malware Signature Updates',
    sub: 'Configure automatic updates for anti-malware signature files on all enterprise assets.' },
  { ctrl: 10, ctrlName: 'Malware Defenses', sf: '10.3', ig: 2,
    title: 'Disable Autorun & Autoplay for Removable Media',
    sub: 'Disable autorun and autoplay auto-execute functionality for removable media.' },
  { ctrl: 10, ctrlName: 'Malware Defenses', sf: '10.4', ig: 2,
    title: 'Configure Automatic Anti-Malware Scanning of Removable Media',
    sub: 'Configure anti-malware software to automatically scan removable media.' },
  { ctrl: 10, ctrlName: 'Malware Defenses', sf: '10.5', ig: 2,
    title: 'Enable Anti-Exploitation Features',
    sub: 'Enable anti-exploitation features on enterprise assets and software, where possible, such as Microsoft® Data Execution Prevention (DEP), Windows® Defender Exploit Guard (WDEG), or Apple® System Integrity Protection (SIP) and Gatekeeper™.' },
  { ctrl: 10, ctrlName: 'Malware Defenses', sf: '10.6', ig: 3,
    title: 'Centrally Manage Anti-Malware Software',
    sub: 'Centrally manage anti-malware software.' },
  { ctrl: 10, ctrlName: 'Malware Defenses', sf: '10.7', ig: 3,
    title: 'Use Behaviour-Based Anti-Malware Software',
    sub: 'Use behaviour-based anti-malware software.' },

  // ──── Control 11: Data Recovery ────
  { ctrl: 11, ctrlName: 'Data Recovery', sf: '11.1', ig: 1,
    title: 'Establish & Maintain a Data Recovery Process',
    sub: 'Establish and maintain a data recovery process. In the process, address the scope of data recovery activities, recovery prioritisation, and the security of backup data. Review and update documentation annually.' },
  { ctrl: 11, ctrlName: 'Data Recovery', sf: '11.2', ig: 1,
    title: 'Perform Automated Backups',
    sub: 'Perform automated backups of in-scope enterprise assets. Run backups weekly, or more frequently, based on the sensitivity of the data.' },
  { ctrl: 11, ctrlName: 'Data Recovery', sf: '11.3', ig: 1,
    title: 'Protect Recovery Data',
    sub: 'Protect recovery data with equivalent controls to the original data. Reference encryption or data separation, based on requirements.' },
  { ctrl: 11, ctrlName: 'Data Recovery', sf: '11.4', ig: 2,
    title: 'Establish & Maintain an Isolated Instance of Recovery Data',
    sub: 'Establish and maintain an isolated instance of recovery data. Example implementations include version controlling backup destinations through offline backups or limiting access to backup repositories.' },
  { ctrl: 11, ctrlName: 'Data Recovery', sf: '11.5', ig: 3,
    title: 'Test Data Recovery',
    sub: 'Test backup recovery quarterly, or more frequently, for a sample of enterprise assets.' },

  // ──── Control 12: Network Infrastructure Management ────
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', sf: '12.1', ig: 2,
    title: 'Ensure Network Infrastructure is Up-to-Date',
    sub: 'Ensure network infrastructure is kept up-to-date. Example implementations include running the latest stable release of software and/or using currently supported network-as-a-service (NaaS) offerings. Review software monthly, or more frequently, to verify software support.' },
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', sf: '12.2', ig: 2,
    title: 'Establish & Maintain a Secure Network Architecture',
    sub: 'Establish and maintain a secure network architecture. A secure network architecture must address segmentation, least privilege, and availability, at a minimum.' },
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', sf: '12.3', ig: 2,
    title: 'Securely Manage Network Infrastructure',
    sub: 'Securely manage network infrastructure. Example implementations include version-controlled infrastructure-as-code, and the use of secure network protocols, such as SSH and HTTPS.' },
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', sf: '12.4', ig: 2,
    title: 'Establish & Maintain Architecture Diagram(s)',
    sub: 'Establish and maintain architecture diagram(s) and/or other network system documentation. Review and update documentation annually, or when significant enterprise changes occur that could impact this safeguard.' },
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', sf: '12.5', ig: 2,
    title: 'Centralise Network Authentication, Authorisation & Auditing (AAA)',
    sub: 'Centralise network AAA.' },
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', sf: '12.6', ig: 3,
    title: 'Use Secure Network Management & Communication Protocols',
    sub: 'Use secure network management and communication protocols (e.g., 802.1X, Wi-Fi Protected Access 2 (WPA2) Enterprise or greater).' },
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', sf: '12.7', ig: 3,
    title: 'Ensure Remote Devices Utilise a VPN & Connect to Enterprise AAA Infrastructure',
    sub: 'Require users to authenticate to enterprise-managed VPN and authentication infrastructure prior to accessing enterprise resources on end-user devices.' },
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', sf: '12.8', ig: 3,
    title: 'Establish & Maintain Dedicated Computing Resources for All Administrative Work',
    sub: 'Establish and maintain dedicated computing resources, either physically or logically separated, for all administrative tasks or tasks requiring administrative access. The computing resources should be segmented from the primary enterprise network and not be allowed internet access.' },

  // ──── Control 13: Network Monitoring & Defense ────
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.1', ig: 2,
    title: 'Centralise Security Event Alerting',
    sub: 'Centralise security event alerting across enterprise assets for log correlation and analysis. Best practice implementation requires the use of a SIEM, which includes vendor-defined event correlation alerts.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.2', ig: 2,
    title: 'Deploy a Host-Based Intrusion Detection Solution',
    sub: 'Deploy a host-based intrusion detection solution on enterprise assets, where appropriate and supported.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.3', ig: 2,
    title: 'Deploy a Network Intrusion Detection Solution',
    sub: 'Deploy a network intrusion detection solution on enterprise assets, where appropriate. Example implementations include the use of a Network Intrusion Detection System (NIDS) or equivalent cloud service provider (CSP) service.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.4', ig: 2,
    title: 'Perform Traffic Filtering Between Network Segments',
    sub: 'Perform traffic filtering between network segments, where appropriate.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.5', ig: 2,
    title: 'Manage Access Control for Remote Assets',
    sub: 'Manage access control for assets remotely connecting to enterprise resources. Determine amount of access based on: up-to-date anti-malware installed, configuration compliance with the enterprise\'s secure configuration process, and ensuring OS and applications are up-to-date.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.6', ig: 3,
    title: 'Collect Network Traffic Flow Logs',
    sub: 'Collect network traffic flow logs and/or network traffic to review and alert upon, from network devices.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.7', ig: 3,
    title: 'Deploy a Host-Based Intrusion Prevention Solution',
    sub: 'Deploy a host-based intrusion prevention solution on enterprise assets, where appropriate and supported. Example implementations include use of an Endpoint Detection and Response (EDR) client.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.8', ig: 3,
    title: 'Deploy a Network Intrusion Prevention Solution',
    sub: 'Deploy a network intrusion prevention solution, where appropriate. Example implementations include the use of a Network Intrusion Prevention System (NIPS) or equivalent CSP service.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.9', ig: 3,
    title: 'Deploy Port-Level Access Control',
    sub: 'Deploy port-level access control. Port-level access control utilises 802.1x, or similar network access control protocols, such as certificates, and may incorporate user and/or device authentication.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.10', ig: 3,
    title: 'Perform Application Layer Filtering',
    sub: 'Perform application layer filtering. Example implementations include a filtering proxy, application layer firewall, or gateway.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.11', ig: 3,
    title: 'Tune Security Event Alerting Thresholds',
    sub: 'Tune security event alerting thresholds monthly, or more frequently.' },

  // ──── Control 14: Security Awareness & Skills Training ────
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.1', ig: 1,
    title: 'Establish & Maintain a Security Awareness Program',
    sub: 'Establish and maintain a security awareness program. The purpose of a security awareness program is to educate the enterprise\'s workforce on how to interact with enterprise assets and data in a secure manner. Conduct training at hire and, at a minimum, annually.' },
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.2', ig: 1,
    title: 'Train Workforce Members to Recognise Social Engineering Attacks',
    sub: 'Train workforce members to recognise social engineering attacks, such as phishing, pre-texting, and tailgating. Evaluate skills through periodic testing, at a minimum annually.' },
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.3', ig: 1,
    title: 'Train Workforce Members on Authentication Best Practices',
    sub: 'Train workforce members on authentication best practices. Example topics include MFA, password composition, and credential management.' },
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.4', ig: 2,
    title: 'Train Workforce on Data Handling Best Practices',
    sub: 'Train workforce on data handling best practices, confidentiality of sensitive data, and the approved process for disposing of sensitive data, where applicable.' },
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.5', ig: 2,
    title: 'Train Workforce Members on Causes of Unintentional Data Exposure',
    sub: 'Train workforce members to be aware of causes for unintentional data exposure. Example topics include mis-delivery of sensitive data, losing a portable end-user device, or publishing data to unintended audiences.' },
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.6', ig: 2,
    title: 'Train Workforce Members on Recognising & Reporting Security Incidents',
    sub: 'Train workforce members to be able to recognise a potential incident and be able to report such an incident. Conduct this training at hire and, at a minimum, annually.' },
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.7', ig: 2,
    title: 'Train Workforce on Identifying & Reporting Missing Security Updates',
    sub: 'Train workforce to understand how to verify and report out-of-date software patches or any failures in automated processes and tools. Part of this training should include notifying IT staff of any failures in automated processes and tools.' },
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.8', ig: 2,
    title: 'Train Workforce on Dangers of Insecure Networks',
    sub: 'Train workforce members on the dangers of connecting to and transmitting data over insecure networks for enterprise activities. If the enterprise has remote workers, training must include guidance to ensure that all users securely lock their mobile end-user devices.' },
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.9', ig: 3,
    title: 'Conduct Role-Specific Security Awareness & Skills Training',
    sub: 'Conduct role-specific security awareness and skills training. Example implementations include secure system administration courses for IT professionals, developer training for software developers, and advanced social engineering awareness training for high-profile roles.' },

  // ──── Control 15: Service Provider Management ────
  { ctrl: 15, ctrlName: 'Service Provider Management', sf: '15.1', ig: 2,
    title: 'Establish & Maintain an Inventory of Service Providers',
    sub: 'Establish and maintain an inventory of service providers. The inventory is to list all known service providers, include classification(s), and designate an enterprise contact for each service provider. Review and update the inventory annually, or when significant enterprise changes occur.' },
  { ctrl: 15, ctrlName: 'Service Provider Management', sf: '15.2', ig: 2,
    title: 'Establish & Maintain a Policy to Classify Service Providers',
    sub: 'Establish and maintain a policy to classify service providers. The policy is to include classification criteria and a classification process based on the data processed, stored, or transmitted by the service provider or the functions they perform for the enterprise.' },
  { ctrl: 15, ctrlName: 'Service Provider Management', sf: '15.3', ig: 2,
    title: 'Classify Service Providers',
    sub: 'Classify service providers. Classification considerations may include data sensitivity, data volume, availability requirements, applicable regulations, inherent risk, and mitigated risk. Update and review classifications annually, or when significant enterprise changes occur.' },
  { ctrl: 15, ctrlName: 'Service Provider Management', sf: '15.4', ig: 2,
    title: 'Ensure Service Provider Contracts Include Security Requirements',
    sub: 'Ensure service provider contracts include security requirements. Example requirements may include minimum security program requirements, security incident and/or data breach notification and response requirements, data encryption requirements, and data disposal requirements.' },
  { ctrl: 15, ctrlName: 'Service Provider Management', sf: '15.5', ig: 2,
    title: 'Assess Service Providers',
    sub: 'Assess service providers consistent with the enterprise\'s service provider management policy. Assessment scope may vary based on classification, and may include review of SOC 2 and PCI Attestation of Compliance reports, or conducting assessments. Reassess service providers annually, at a minimum.' },
  { ctrl: 15, ctrlName: 'Service Provider Management', sf: '15.6', ig: 3,
    title: 'Monitor Service Providers',
    sub: 'Monitor service providers consistent with the enterprise\'s service provider management policy. Monitoring may include periodic reassessment of service provider classification, monitoring service provider release notes and security advisories, and monitoring dark web sources for data leakage.' },
  { ctrl: 15, ctrlName: 'Service Provider Management', sf: '15.7', ig: 3,
    title: 'Securely Decommission Service Providers',
    sub: 'Securely decommission service providers. Example implementations include removing enterprise access and the confirmation of secure disposal of enterprise data.' },

  // ──── Control 16: Application Software Security ────
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.1', ig: 2,
    title: 'Establish & Maintain a Secure Application Development Process',
    sub: 'Establish and maintain a secure application development process. In the process, address such items as: secure application design standards, secure coding practices, developer training, vulnerability management, security of third-party code, and application security testing procedures.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.2', ig: 2,
    title: 'Establish & Maintain a Process to Accept & Address Software Vulnerabilities',
    sub: 'Establish and maintain a process to accept and address reports of software vulnerabilities, including providing a means for external entities to report. The process is to include such items as a vulnerability handling policy that identifies reporting and patch timeframes.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.3', ig: 2,
    title: 'Perform Root Cause Analysis on Security Vulnerabilities',
    sub: 'Perform root cause analysis on security vulnerabilities. When reviewing vulnerabilities, root cause analysis is the task of evaluating underlying issues that create vulnerabilities in code, allowing development teams to move beyond just fixing individual vulnerabilities as they arise.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.4', ig: 2,
    title: 'Establish & Manage an Application Inventory',
    sub: 'Establish and manage an updated inventory of third-party software components used in development, often referred to as a bill of materials, as well as components the enterprise has developed internally. Use this inventory to identify necessary patches and validate that risk tolerances and authorisations have been met.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.5', ig: 2,
    title: 'Use Up-to-Date & Trusted Third-Party Software Components',
    sub: 'Use up-to-date and trusted third-party software components. When possible, choose established and proven frameworks and libraries that provide adequate security. Acquire these components from trusted sources, using a repeatable, documented process.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.6', ig: 2,
    title: 'Establish & Maintain a Severity Rating System for Application Vulnerabilities',
    sub: 'Establish and maintain a severity rating system and process for application vulnerabilities that facilitates prioritising the order in which discovered vulnerabilities are patched. The process includes setting a minimum level of security acceptability for releasing code or applications.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.7', ig: 2,
    title: 'Use Standard Hardening Configuration Templates for Application Infrastructure',
    sub: 'Use standard, industry-recommended hardening configuration templates for application infrastructure components. This includes underlying servers, databases, and web servers, and applies to cloud containers, Platform as a Service (PaaS) components, and SaaS components.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.8', ig: 3,
    title: 'Separate Production & Non-Production Systems',
    sub: 'Maintain separate environments for production and non-production systems.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.9', ig: 3,
    title: 'Train Developers in Application Security Concepts & Secure Coding',
    sub: 'Ensure that all software development personnel receive training in writing secure code for their specific development environment and responsibilities. Training can include general security principles and application security standard practices. Evaluate effectiveness of training at least annually.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.10', ig: 3,
    title: 'Apply Secure Design Principles in Application Architectures',
    sub: 'Apply secure design principles in application architectures. Example practices include an application processing, storing, or transmitting healthcare data being hosted on a secure, higher-trust network, with communication from a lower-trust network component being controlled.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.11', ig: 3,
    title: 'Leverage Vetted Modules or Services for Application Security Components',
    sub: 'Leverage vetted modules or services for application security components, such as identity management, encryption, and auditing and logging. Using platform features in critical security functions will reduce developers\' workload and minimise the likelihood of design or implementation errors.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.12', ig: 3,
    title: 'Implement Code-Level Security Checks',
    sub: 'Apply static and dynamic analysis tools within the application life cycle to verify that secure coding practices are being followed.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.13', ig: 3,
    title: 'Conduct Application Penetration Testing',
    sub: 'Conduct application penetration testing. For critical applications, authenticated penetration testing is better suited to finding business logic vulnerabilities than code scanning and may reveal the combined effect of multiple vulnerabilities.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.14', ig: 3,
    title: 'Conduct Threat Modelling',
    sub: 'Conduct threat modelling. Use a repeatable process to identify and prevent new vulnerabilities. Threat modelling is a structured approach to identifying flaws, helping teams understand issues and how they should be addressed.' },

  // ──── Control 17: Incident Response Management ────
  { ctrl: 17, ctrlName: 'Incident Response Management', sf: '17.1', ig: 2,
    title: 'Designate Personnel to Manage Incident Handling',
    sub: 'Designate one key person, and at least one backup, who will manage the enterprise\'s incident handling process. Management personnel are responsible for the coordination and documentation of incident response and recovery efforts and can consist of employees or contractors.' },
  { ctrl: 17, ctrlName: 'Incident Response Management', sf: '17.2', ig: 2,
    title: 'Establish & Maintain Contact Information for Reporting Security Incidents',
    sub: 'Establish and maintain contact information for parties that need to be informed of security incidents. Contacts to consider may include internal: IT staff, management, legal, communications; and external: insurance carriers, relevant government agencies, vendors, ISAC partner(s), and law enforcement.' },
  { ctrl: 17, ctrlName: 'Incident Response Management', sf: '17.3', ig: 2,
    title: 'Establish & Maintain an Enterprise Process for Reporting Incidents',
    sub: 'Establish and maintain an enterprise process for the workforce to report security incidents. The process includes reporting timeframe, personnel to report to, mechanism for reporting, and the minimum information to be reported. Ensure the process is publicly available to all of the workforce.' },
  { ctrl: 17, ctrlName: 'Incident Response Management', sf: '17.4', ig: 2,
    title: 'Establish & Maintain an Incident Response Process',
    sub: 'Establish and maintain a security incident response process that addresses roles and responsibilities, compliance requirements, and a communication plan. Review annually, or when significant enterprise changes occur that could impact this safeguard.' },
  { ctrl: 17, ctrlName: 'Incident Response Management', sf: '17.5', ig: 2,
    title: 'Assign Key Roles & Responsibilities',
    sub: 'Assign key roles and responsibilities for incident response, including staff from legal, human resources, management, IT, legal and communications.' },
  { ctrl: 17, ctrlName: 'Incident Response Management', sf: '17.6', ig: 2,
    title: 'Define Mechanisms for Communicating During Incident Response',
    sub: 'Determine the primary and secondary mechanisms to communicate and report during a security incident. Mechanisms can include phone calls, emails, or letters. Keep in mind that certain mechanisms, such as emails, can be affected during a cybersecurity incident. Review annually, or when significant enterprise changes occur.' },
  { ctrl: 17, ctrlName: 'Incident Response Management', sf: '17.7', ig: 3,
    title: 'Conduct Routine Incident Response Exercises',
    sub: 'Plan and conduct routine incident response exercises and scenarios for the workforce involved in the incident response process to prepare for responding to real-world incidents. Exercises need to test both the IRP and the communications plan.' },
  { ctrl: 17, ctrlName: 'Incident Response Management', sf: '17.8', ig: 3,
    title: 'Conduct Post-Incident Reviews',
    sub: 'Conduct post-incident reviews. Post-incident reviews help prevent incident recurrence through identifying lessons learned and follow-up action.' },
  { ctrl: 17, ctrlName: 'Incident Response Management', sf: '17.9', ig: 3,
    title: 'Establish & Maintain Security Incident Thresholds',
    sub: 'Establish and maintain security incident thresholds, including, at a minimum: differing thresholds for different types of incidents, factors in determining whether an incident meets the threshold, and factors for notifying external organisations such as regulators, law enforcement, etc.' },

  // ──── Control 18: Penetration Testing ────
  { ctrl: 18, ctrlName: 'Penetration Testing', sf: '18.1', ig: 3,
    title: 'Establish & Maintain a Penetration Testing Program',
    sub: 'Establish and maintain a penetration testing program appropriate to the size, complexity, and maturity of the enterprise. A penetration testing program includes a full scope of blended attacks, such as wireless, client-based, and web application attacks.' },
  { ctrl: 18, ctrlName: 'Penetration Testing', sf: '18.2', ig: 3,
    title: 'Perform Periodic External Penetration Tests',
    sub: 'Perform periodic external penetration tests based on program requirements, no less than annually. External penetration testing must include enterprise and environmental reconnaissance to detect exploitable information.' },
  { ctrl: 18, ctrlName: 'Penetration Testing', sf: '18.3', ig: 3,
    title: 'Remediate Penetration Test Findings',
    sub: 'Remediate penetration test findings based on the enterprise\'s policy for remediation scope and prioritisation.' },
  { ctrl: 18, ctrlName: 'Penetration Testing', sf: '18.4', ig: 3,
    title: 'Validate Security Measures',
    sub: 'Validate security measures after each penetration test. If deemed necessary, modify rulesets and capabilities to detect the techniques used during testing.' },
  { ctrl: 18, ctrlName: 'Penetration Testing', sf: '18.5', ig: 3,
    title: 'Perform Periodic Internal Penetration Tests',
    sub: 'Perform periodic internal penetration tests based on program requirements, no less than annually. The testing may be clear-box or opaque-box.' },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

// Returns safeguards in scope for a given goal: ig1=IG1 only, ig2=IG1+IG2, ig3=all
function cisGetSafeguards(ig) {
  const max = ig === 'ig1' ? 1 : ig === 'ig2' ? 2 : 3;
  return CIS_SAFEGUARDS.filter(s => s.ig <= max);
}

function cisGetGoal() {
  return (orgProfiles[currentOrg?.id] || {}).cis_goal || null;
}

// Returns the index of the chronologically latest run (max assessed_at date), not insertion order
function cisLatestIdx(runs) {
  if (!runs.length) return -1;
  return runs.reduce((best, r, i) => ((r.date || '') > (runs[best].date || '') ? i : best), 0);
}

// ── QUICK CHECK DATA ──────────────────────────────────────────────────────────

const CIS_QUICK_QUESTIONS = [
  { ctrl: 1, ctrlName: 'Inventory and Control of Enterprise Assets', questions: [
    { id: 'qk1_1', text: 'Do you maintain an up-to-date inventory of all devices connected to your network (computers, servers, phones, printers, network gear)?' },
    { id: 'qk1_2', text: 'Are unauthorized or unrecognized devices automatically blocked or flagged when they connect to your network?' },
    { id: 'qk1_3', text: 'Is there a process to automatically discover and add new devices to your inventory when they join the network?' },
  ]},
  { ctrl: 2, ctrlName: 'Inventory and Control of Software Assets', questions: [
    { id: 'qk2_1', text: 'Do you maintain a list of approved software that is permitted to run on company devices?' },
    { id: 'qk2_2', text: 'Is unauthorized or unapproved software prevented from installing or running on company devices?' },
  ]},
  { ctrl: 3, ctrlName: 'Data Protection', questions: [
    { id: 'qk3_1', text: 'Do you know where your sensitive data (customer records, financial data, personal information) is stored and who can access it?' },
    { id: 'qk3_2', text: 'Is sensitive data encrypted when stored and when transmitted (e.g., HTTPS, encrypted email, encrypted drives)?' },
    { id: 'qk3_3', text: 'Do you have a data classification policy that labels data by sensitivity (e.g., public, internal, confidential)?' },
    { id: 'qk3_4', text: 'Do you have a defined data retention and secure disposal policy?' },
  ]},
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets and Software', questions: [
    { id: 'qk4_1', text: 'Are default passwords changed on all devices, applications, and systems before they are put into use?' },
    { id: 'qk4_2', text: 'Are devices configured to secure, hardened settings (e.g., auto-lock screens, disabling unused services) before deployment?' },
    { id: 'qk4_3', text: 'Are mobile devices (phones, tablets) enrolled in a Mobile Device Management (MDM) or equivalent solution?' },
  ]},
  { ctrl: 5, ctrlName: 'Account Management', questions: [
    { id: 'qk5_1', text: 'Do you have a formal process for creating, modifying, and disabling user accounts when staff join, change roles, or leave?' },
    { id: 'qk5_2', text: 'Are administrator accounts separate from day-to-day user accounts (staff do not use admin accounts for regular work)?' },
    { id: 'qk5_3', text: 'Is multi-factor authentication (MFA) enforced for all administrator and privileged accounts?' },
  ]},
  { ctrl: 6, ctrlName: 'Access Control Management', questions: [
    { id: 'qk6_1', text: 'Is access to systems and data limited to only what each person needs to do their job (least privilege principle)?' },
    { id: 'qk6_2', text: 'Do you conduct periodic reviews of who has access to critical systems and data (e.g., quarterly access reviews)?' },
    { id: 'qk6_3', text: 'Are shared or service accounts minimized, with usage monitored and documented?' },
  ]},
  { ctrl: 7, ctrlName: 'Continuous Vulnerability Management', questions: [
    { id: 'qk7_1', text: 'Are operating systems and software patched on a defined schedule (e.g., within 30 days of a patch release)?' },
    { id: 'qk7_2', text: 'Do you run regular vulnerability scans on your network, systems, or applications?' },
    { id: 'qk7_3', text: 'Is there a tracked process for remediating identified vulnerabilities within a defined timeframe?' },
  ]},
  { ctrl: 8, ctrlName: 'Audit Log Management', questions: [
    { id: 'qk8_1', text: 'Are logs collected from key systems such as servers, firewalls, and cloud services?' },
    { id: 'qk8_2', text: 'Are logs reviewed regularly (manually or with automated tools) for suspicious or anomalous activity?' },
    { id: 'qk8_3', text: 'Are log retention periods defined and enforced (e.g., logs retained for at least 90 days)?' },
  ]},
  { ctrl: 9, ctrlName: 'Email and Web Browser Protections', questions: [
    { id: 'qk9_1', text: 'Do you use email filtering or anti-phishing tools to block spam, malicious links, and dangerous attachments?' },
    { id: 'qk9_2', text: 'Is web browsing filtered or restricted to prevent access to known malicious or unauthorized websites?' },
  ]},
  { ctrl: 10, ctrlName: 'Malware Defenses', questions: [
    { id: 'qk10_1', text: 'Is endpoint protection software (antivirus or EDR) deployed on all workstations and servers?' },
    { id: 'qk10_2', text: 'Is endpoint protection updated automatically and monitored centrally for alerts?' },
  ]},
  { ctrl: 11, ctrlName: 'Data Recovery', questions: [
    { id: 'qk11_1', text: 'Do you take regular automated backups of all critical business data?' },
    { id: 'qk11_2', text: 'Are backups stored in a separate location or offline so they cannot be affected by a ransomware attack on primary systems?' },
    { id: 'qk11_3', text: 'Have backups been tested with a successful restoration exercise in the past 12 months?' },
  ]},
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', questions: [
    { id: 'qk12_1', text: 'Is your network segmented so that critical systems (servers, POS, finance) are separated from general staff devices?' },
    { id: 'qk12_2', text: 'Are network devices (firewalls, switches, routers) running current, supported firmware?' },
    { id: 'qk12_3', text: 'Are remote access connections (VPN, remote desktop) secured with multi-factor authentication?' },
  ]},
  { ctrl: 13, ctrlName: 'Network Monitoring and Defense', questions: [
    { id: 'qk13_1', text: 'Is network traffic monitored for unusual patterns, large data transfers, or suspicious connections?' },
    { id: 'qk13_2', text: 'Do you have intrusion detection or prevention tools (IDS/IPS or equivalent) in place?' },
    { id: 'qk13_3', text: 'Is there a defined escalation path when suspicious network activity is detected?' },
  ]},
  { ctrl: 14, ctrlName: 'Security Awareness and Skills Training', questions: [
    { id: 'qk14_1', text: 'Do all staff receive security awareness training at least once a year?' },
    { id: 'qk14_2', text: 'Are staff trained specifically to recognize and report phishing emails?' },
    { id: 'qk14_3', text: 'Is there a clear and simple process for staff to report a suspected security incident or suspicious activity?' },
  ]},
  { ctrl: 15, ctrlName: 'Service Provider Management', questions: [
    { id: 'qk15_1', text: 'Do you maintain a list of all third-party vendors and service providers who have access to your systems, network, or data?' },
    { id: 'qk15_2', text: 'Do you assess the security posture of critical vendors before giving them access to your environment?' },
    { id: 'qk15_3', text: 'Do vendor contracts include security requirements, data protection obligations, and breach notification terms?' },
  ]},
  { ctrl: 16, ctrlName: 'Application Software Security', questions: [
    { id: 'qk16_1', text: 'Are web-facing or customer-facing applications regularly scanned or tested for security vulnerabilities?' },
    { id: 'qk16_2', text: 'Is MFA enforced for staff accessing externally accessible applications (cloud apps, remote portals, webmail)?' },
  ]},
  { ctrl: 17, ctrlName: 'Incident Response Management', questions: [
    { id: 'qk17_1', text: 'Do you have a documented incident response plan that defines roles, steps, and contacts for a cyber incident?' },
    { id: 'qk17_2', text: 'Has the incident response plan been tested (tabletop exercise or live drill) in the past 12 months?' },
    { id: 'qk17_3', text: 'Do you have cyber insurance coverage, and do you know how and when to notify your insurer after an incident?' },
  ]},
  { ctrl: 18, ctrlName: 'Penetration Testing', questions: [
    { id: 'qk18_1', text: 'Has a penetration test or independent security assessment been conducted in the past 12–24 months?' },
    { id: 'qk18_2', text: 'Are findings from penetration tests and security assessments tracked, prioritized, and remediated?' },
  ]},
];

const CIS_QUICK_TOTAL = CIS_QUICK_QUESTIONS.reduce((n, g) => n + g.questions.length, 0);

function cisQuickCalcScore(answers) {
  const all = CIS_QUICK_QUESTIONS.flatMap(g => g.questions);
  const answered = all.filter(q => answers[q.id] != null).length;
  const applicable = all.filter(q => answers[q.id] && answers[q.id] !== 'na');
  if (!applicable.length) return { score: 0, answered, total: all.length };
  const pts = applicable.reduce((s, q) => s + (answers[q.id] === 'yes' ? 1 : answers[q.id] === 'partial' ? 0.5 : 0), 0);
  return { score: Math.round(pts / applicable.length * 100), answered, total: all.length };
}

// ── SCORE ──────────────────────────────────────────────────────────────────────

// Calculate score against a given IG scope from a given answers object
function cisCalcScore(answers, ig) {
  const sfs = cisGetSafeguards(ig);
  if (!sfs.length) return { score: 0, yes: 0, partial: 0, answered: 0, total: 0 };
  const yes = sfs.filter(s => answers[s.sf] === 'yes').length;
  const partial = sfs.filter(s => answers[s.sf] === 'partial').length;
  const answered = sfs.filter(s => answers[s.sf] != null).length;
  const total = sfs.length;
  return { score: Math.round((yes + partial * 0.5) / total * 100), yes, partial, answered, total };
}

// Per-tier progress (each row = that tier's exclusive safeguards, not cumulative)
function cisIgProgress(answers) {
  return [1, 2, 3].map(n => {
    const sfs = CIS_SAFEGUARDS.filter(s => s.ig === n);
    const yes = sfs.filter(s => answers[s.sf] === 'yes').length;
    const partial = sfs.filter(s => answers[s.sf] === 'partial').length;
    const answered = sfs.filter(s => answers[s.sf] != null).length;
    return { n, yes, partial, answered, total: sfs.length };
  });
}

// Auto-detect the highest IG level where all safeguards are answered
function cisDetectLevel(answers) {
  const answered = s => answers[s.sf] != null;
  if (CIS_SAFEGUARDS.every(answered)) return 'ig3';
  if (CIS_SAFEGUARDS.filter(s => s.ig <= 2).every(answered)) return 'ig2';
  if (CIS_SAFEGUARDS.filter(s => s.ig === 1).every(answered)) return 'ig1';
  return null;
}

// Load last saved run into cisState when switching orgs; preserve view within same org
function cisHydrate() {
  if (cisState.orgId === currentOrg?.id) return;
  const runs = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
  const last = runs[cisLatestIdx(runs)] || null;
  const rawAnswers = last ? Object.assign({}, last.answers || {}) : {};
  const answers = Object.fromEntries(Object.entries(rawAnswers).filter(([k]) => !k.startsWith('_')));
  cisState = { answers, openPanels: {}, orgId: currentOrg?.id, view: 'dashboard', editId: null, notes: {}, openComments: {}, quickAnswers: {}, quickEditId: null, poamRun: null, poamItems: {}, poamNotes: {}, reportRun: null, reportCommentary: '' };
}

// ── GOAL ──────────────────────────────────────────────────────────────────────

async function cisSetGoal(goal) {
  if (!currentOrg) return;
  try {
    await sb.profiles.upsert({ org_id: currentOrg.id, cis_goal: goal });
    if (!orgProfiles[currentOrg.id]) orgProfiles[currentOrg.id] = {};
    orgProfiles[currentOrg.id].cis_goal = goal;
    const labels = { ig1: 'IG1', ig2: 'IG2', ig3: 'IG3' };
    toast(`✓ CIS goal set to ${labels[goal]}`, '#15803d');
    renderMain();
  } catch(e) {
    toast('Failed to save goal: ' + e.message, '#dc2626');
  }
}

// ── RENDER ROUTER ─────────────────────────────────────────────────────────────

function renderCIS() {
  if (!currentOrg) return '';
  cisHydrate();
  if (cisState.view === 'form') return renderCISForm();
  if (cisState.view === 'quick') return renderCISQuick();
  if (cisState.view === 'poam') return renderCISPoam();
  if (cisState.view === 'report') return renderCISReport();
  return renderCISDashboard();
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

function renderCISDashboard() {
  const runs = (orgAssessments[currentOrg.id] || {})['cis'] || [];
  const goal = cisGetGoal();
  const goalN = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 0;
  const igColors = { 1: '#15803d', 2: '#1d4ed8', 3: '#6d28d9' };

  const latestIdx = cisLatestIdx(runs);
  const latest = latestIdx >= 0 ? runs[latestIdx] : null;
  const latestAnswers = latest
    ? Object.fromEntries(Object.entries(latest.answers || {}).filter(([k]) => !k.startsWith('_')))
    : {};
  const { score, answered, total } = latest && goal
    ? cisCalcScore(latestAnswers, goal)
    : { score: 0, answered: 0, total: 0 };

  const band = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const bandCol = score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : score >= 40 ? '#ea580c' : '#dc2626';

  const progress = latest ? cisIgProgress(latestAnswers) : [];

  // Goal picker
  const goalPicker = [1, 2, 3].map(n => {
    const l = `ig${n}`;
    const active = l === goal;
    const col = igColors[n];
    return `<button class="btn btn-sm" onclick="cisSetGoal('${l}')"
      style="padding:5px 14px;font-size:12px;font-weight:700;border-radius:20px;transition:all .15s;
      ${active ? `background:${col};color:#fff;border:2px solid ${col}` : 'background:rgba(255,255,255,.1);color:rgba(255,255,255,.7);border:2px solid rgba(255,255,255,.2)'}">
      IG${n}${active ? ' ✓' : ''}
    </button>`;
  }).join('');

  // Per-tier progress bars (latest run)
  const progressHtml = progress.map(t => {
    const inScope = t.n <= goalN;
    const pct = t.total > 0 ? Math.round((t.yes + t.partial * 0.5) / t.total * 100) : 0;
    const col = igColors[t.n];
    const isGoalTier = goal && `ig${t.n}` === goal;
    return `<div style="flex:1;min-width:110px">
      <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:3px">
        <span style="font-size:10px;font-weight:700;color:${inScope ? col : 'rgba(255,255,255,.25)'}">IG${t.n}</span>
        <span style="font-size:9px;color:${inScope ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.2)'}">+${t.total} safeguards${isGoalTier ? ' ← goal' : ''}</span>
        <span style="font-size:10px;color:${inScope ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.2)'};margin-left:auto">${t.answered}/${t.total}</span>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.12);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${inScope ? col : 'rgba(255,255,255,.1)'};border-radius:2px;transition:width .4s"></div>
      </div>
    </div>`;
  }).join('');

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">✅ CIS Controls v8</div>
      <div style="font-size:12px;color:var(--muted)">153 safeguards · 18 controls · set your target IG level, run assessments, track progress over time</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="setNav('assessments')">← Hub</button>
      <button class="btn btn-cyan btn-sm" onclick="cisStartNewAssessment()">+ New Assessment</button>
    </div>
  </div>

  <div class="score-hero-ins" style="margin-bottom:1.25rem">
    <div style="flex:1;display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap">
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">Latest Score</div>
          <div class="score-big" style="color:#fff">${latest && goal && answered > 0 ? score : '—'}<span style="font-size:18px">${latest && goal && answered > 0 ? '%' : ''}</span></div>
          ${latest && goal && answered > 0 ? `<div style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;display:inline-block;margin-top:6px;color:${bandCol};background:rgba(255,255,255,.08)">${band}</div>` : ''}
          ${!goal
            ? `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">Set a target IG level →</div>`
            : !latest
              ? `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">No assessments yet</div>`
              : `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">${answered}/${total} answered · ${latest.date}</div>`}
        </div>
        <div style="flex:1;min-width:280px">
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px">Target IG Level</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">${goalPicker}</div>
          ${progress.length > 0 ? `<div style="display:flex;gap:12px;flex-wrap:wrap">${progressHtml}</div>` : '<div style="font-size:11px;color:rgba(255,255,255,.3)">Run an assessment to see safeguard progress</div>'}
        </div>
      </div>
    </div>
    <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:8px">
      ${runs.length >= 2
        ? `<div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">Score Trend</div>
           <canvas id="cisTrendChart" width="200" height="60"></canvas>`
        : `<div style="font-size:11px;color:rgba(255,255,255,.3);text-align:right">${runs.length === 1 ? '1 run recorded<br>trend after 2nd save' : 'No assessments yet'}</div>`}
      <div style="font-size:10px;color:rgba(255,255,255,.35);text-align:right;margin-top:6px">
        ${runs.length} assessment${runs.length !== 1 ? 's' : ''} recorded
      </div>
    </div>
  </div>

  <div class="card" style="padding:1.25rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.1rem">
      <div style="font-size:14px;font-weight:700;color:var(--text)">Assessment History</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-outline btn-sm" onclick="cisExportExcel()">↓ Export Excel</button>
        <button class="btn btn-outline btn-sm" onclick="cisShowImportModal()">↑ Import Excel</button>
        <button class="btn btn-cyan btn-sm" onclick="cisStartNewAssessment()">+ New Assessment</button>
      </div>
    </div>`;

  if (runs.length === 0) {
    html += `<div style="text-align:center;padding:2.5rem 1rem;color:var(--muted)">
      <div style="font-size:32px;margin-bottom:0.75rem">📋</div>
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:6px">No assessments yet</div>
      <div style="font-size:12px;margin-bottom:1.25rem">Run your first CIS Controls v8 assessment to start tracking your posture.</div>
      <button class="btn btn-cyan btn-sm" onclick="cisStartNewAssessment()">+ Start First Assessment</button>
    </div>`;
  } else {
    html += `<table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="border-bottom:2px solid var(--border)">
          <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Date</th>
          <th style="text-align:center;padding:7px 8px;font-size:11px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:.05em">IG1</th>
          <th style="text-align:center;padding:7px 8px;font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.05em">IG2</th>
          <th style="text-align:center;padding:7px 8px;font-size:11px;font-weight:700;color:#6d28d9;text-transform:uppercase;letter-spacing:.05em">IG3</th>
          <th style="text-align:center;padding:7px 8px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Total</th>
          <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Goal</th>
          <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Conducted By</th>
          <th style="text-align:right;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Actions</th>
        </tr>
      </thead>
      <tbody>`;
    const igBadgeCols = { ig1: { bg: '#dcfce7', txt: '#15803d' }, ig2: { bg: '#dbeafe', txt: '#1d4ed8' }, ig3: { bg: '#ede9fe', txt: '#6d28d9' } };
    // Count cell: implemented (yes+partial) / total for that exclusive tier
    const countCell = (done, total, col) => {
      const pct = total > 0 ? done / total : 0;
      const c = pct >= 0.75 ? '#15803d' : pct >= 0.5 ? '#b45309' : '#dc2626';
      return `<span style="font-size:13px;font-weight:700;color:${c}">${done}</span><span style="font-size:11px;color:var(--muted)">/${total}</span>`;
    };
    runs.forEach((r, i) => {
      const cleanAns = Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_')));
      // cisIgProgress returns exclusive-tier counts: ig===1 only, ig===2 only, ig===3 only
      const prog = cisIgProgress(cleanAns);
      const p1 = prog[0], p2 = prog[1], p3 = prog[2];
      const d1 = p1.yes + p1.partial, d2 = p2.yes + p2.partial, d3 = p3.yes + p3.partial;
      const dTotal = d1 + d2 + d3, tTotal = p1.total + p2.total + p3.total;
      const pctTotal = tTotal > 0 ? dTotal / tTotal : 0;
      const totalCol = pctTotal >= 0.75 ? '#15803d' : pctTotal >= 0.5 ? '#b45309' : '#dc2626';
      const igGoal = (r.answers && r.answers._goal) || '';
      const igC = igBadgeCols[igGoal] || { bg: '#f1f5f9', txt: '#5a6a8a' };
      const by = r.conductedBy || '—';
      const isLatest = i === latestIdx;
      html += `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px;font-weight:${isLatest ? '700' : '400'};white-space:nowrap">
          ${r.date || '—'}
          ${isLatest ? '<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;background:#dbeafe;color:#1d4ed8;margin-left:6px">Latest</span>' : ''}
        </td>
        <td style="padding:8px 8px;text-align:center">${countCell(d1, p1.total)}</td>
        <td style="padding:8px 8px;text-align:center">${countCell(d2, p2.total)}</td>
        <td style="padding:8px 8px;text-align:center">${countCell(d3, p3.total)}</td>
        <td style="padding:8px 8px;text-align:center"><span style="font-size:13px;font-weight:700;color:${totalCol}">${dTotal}</span><span style="font-size:11px;color:var(--muted)">/${tTotal}</span></td>
        <td style="padding:8px 10px">${igGoal ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;background:${igC.bg};color:${igC.txt}">${igGoal.toUpperCase()}</span>` : '<span style="color:var(--muted)">—</span>'}</td>
        <td style="padding:8px 10px;color:var(--muted)">${by}</td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap">
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cisOpenReport(${i})">📊 Report</button>
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cisOpenPoam(${i})">📋 POAM</button>
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cisOpenAssessment(${i})">View / Edit</button>
          <button class="btn btn-red btn-sm" onclick="cisDeleteAssessment(${i})">Delete</button>
        </td>
      </tr>`;
    });
    html += `</tbody></table>`;
  }

  html += `</div>`;

  // Quick Check section
  const quickRuns = (orgAssessments[currentOrg.id] || {})['cis_quick'] || [];
  const latestQuick = quickRuns.length ? quickRuns[quickRuns.length - 1] : null;
  html += `
  <div class="card" style="padding:1.25rem;margin-top:1rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:${quickRuns.length ? '1rem' : '0.75rem'};flex-wrap:wrap;gap:8px">
      <div>
        <div style="font-size:14px;font-weight:700;color:var(--text)">⚡ CIS Quick Check</div>
        <div style="font-size:11px;color:var(--muted)">${CIS_QUICK_TOTAL} plain-language questions across all 18 control groups — fast posture read for client intake</div>
      </div>
      <button class="btn btn-cyan btn-sm" onclick="cisStartQuickCheck()">+ New Quick Check</button>
    </div>
    ${quickRuns.length === 0 ? `
      <div style="padding:1rem 0 0.25rem;color:var(--muted);text-align:center">
        <div style="font-size:11px;margin-bottom:0.75rem">Run a Quick Check first to get a fast posture read, then use the full 153-safeguard assessment above for evidence gathering.</div>
        <button class="btn btn-outline btn-sm" onclick="cisStartQuickCheck()">Start First Quick Check</button>
      </div>` : `
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="border-bottom:2px solid var(--border)">
            <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Date</th>
            <th style="text-align:center;padding:7px 8px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Score</th>
            <th style="text-align:center;padding:7px 8px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Answered</th>
            <th style="text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Conducted By</th>
            <th style="text-align:right;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${quickRuns.map((r, i) => {
            const col = r.score >= 75 ? '#15803d' : r.score >= 50 ? '#b45309' : '#dc2626';
            const ans = Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_')));
            const { answered, total } = cisQuickCalcScore(ans);
            return `<tr style="border-bottom:1px solid var(--border)">
              <td style="padding:8px 10px">${r.date || '—'}</td>
              <td style="padding:8px 8px;text-align:center"><span style="font-weight:700;color:${col}">${r.score}%</span></td>
              <td style="padding:8px 8px;text-align:center;font-size:12px;color:var(--muted)">${answered}/${total}</td>
              <td style="padding:8px 10px;color:var(--muted)">${r.conductedBy || '—'}</td>
              <td style="padding:8px 10px;text-align:right;white-space:nowrap">
                <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cisOpenQuickAssessment(${i})">View / Edit</button>
                <button class="btn btn-red btn-sm" onclick="cisDeleteQuickAssessment(${i})">Delete</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`}
  </div>`;

  return html;
}

// ── ASSESSMENT FORM ───────────────────────────────────────────────────────────

function renderCISForm() {
  const goal = cisGetGoal();
  const scoreIg = goal || 'ig1';
  const { score, answered, total } = cisCalcScore(cisState.answers, scoreIg);
  const progress = cisIgProgress(cisState.answers);
  const runs = (orgAssessments[currentOrg.id] || {})['cis'] || [];
  const goalN = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 0;
  const igColors = { 1: '#15803d', 2: '#1d4ed8', 3: '#6d28d9' };

  const band = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const bandCol = score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : score >= 40 ? '#ea580c' : '#dc2626';

  const controls = {};
  CIS_SAFEGUARDS.forEach(s => {
    if (!controls[s.ctrl]) controls[s.ctrl] = { name: s.ctrlName, safeguards: [] };
    controls[s.ctrl].safeguards.push(s);
  });

  const goalPicker = [1, 2, 3].map(n => {
    const l = `ig${n}`;
    const active = l === goal;
    const col = igColors[n];
    return `<button class="btn btn-sm" onclick="cisSetGoal('${l}')"
      style="padding:5px 14px;font-size:12px;font-weight:700;border-radius:20px;transition:all .15s;
      ${active ? `background:${col};color:#fff;border:2px solid ${col}` : 'background:rgba(255,255,255,.1);color:rgba(255,255,255,.7);border:2px solid rgba(255,255,255,.2)'}">
      IG${n}${active ? ' ✓' : ''}
    </button>`;
  }).join('');

  const progressHtml = progress.map(t => {
    const inScope = t.n <= goalN;
    const pct = t.total > 0 ? Math.round((t.yes + t.partial * 0.5) / t.total * 100) : 0;
    const col = igColors[t.n];
    const isGoalTier = goal && `ig${t.n}` === goal;
    return `<div style="flex:1;min-width:110px">
      <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:3px">
        <span style="font-size:10px;font-weight:700;color:${inScope ? col : 'rgba(255,255,255,.25)'}">IG${t.n}</span>
        <span style="font-size:9px;color:${inScope ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.2)'}">+${t.total} safeguards${isGoalTier ? ' ← goal' : ''}</span>
        <span style="font-size:10px;color:${inScope ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.2)'};margin-left:auto">${t.answered}/${t.total}</span>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.12);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${inScope ? col : 'rgba(255,255,255,.1)'};border-radius:2px;transition:width .4s"></div>
      </div>
    </div>`;
  }).join('');

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">✅ CIS Controls v8 — ${cisState.editId ? 'Edit Assessment' : 'New Assessment'}</div>
      <div style="font-size:12px;color:var(--muted)">${cisState.editId ? 'Editing an existing record — saving will update it in place' : 'Answer all safeguards in scope for your target IG level, then save to record this run'}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="cisNavToDashboard()">← Back to Dashboard</button>
      <button class="btn btn-outline btn-sm" onclick="cisExportExcel()">↓ Export Excel</button>
      <button class="btn btn-outline btn-sm" onclick="cisShowImportModal()">↑ Import Excel</button>
    </div>
  </div>

  <div class="score-hero-ins" style="margin-bottom:1.25rem">
    <div style="flex:1;display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap">
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px">Score vs goal</div>
          <div class="score-big" style="color:#fff">${goal && answered > 0 ? score : '—'}<span style="font-size:18px">${goal && answered > 0 ? '%' : ''}</span></div>
          ${goal && answered > 0 ? `<div style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;display:inline-block;margin-top:6px;color:${bandCol};background:rgba(255,255,255,.08)">${band}</div>` : ''}
          ${!goal ? `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">Set goal →</div>` : `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">${answered}/${total} answered</div>`}
        </div>
        <div style="flex:1;min-width:280px">
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px">Target IG Level</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">${goalPicker}</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">${progressHtml}</div>
        </div>
      </div>
    </div>
    <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:8px">
      ${runs.length >= 2
        ? `<div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">Trend</div>
           <canvas id="cisTrendChart" width="200" height="60"></canvas>`
        : `<div style="font-size:11px;color:rgba(255,255,255,.3);text-align:right">${runs.length === 1 ? '1 run recorded<br>trend after 2nd save' : 'No history yet'}</div>`}
      ${goal ? `
        <div style="display:flex;align-items:flex-end;gap:6px;margin-top:4px;flex-wrap:wrap">
          <div>
            <div style="font-size:9px;color:rgba(255,255,255,.4);margin-bottom:3px">Assessment date</div>
            <input type="date" id="cisSaveDate" value="${new Date().toISOString().split('T')[0]}"
              style="padding:5px 8px;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-family:Kanit,sans-serif;font-size:12px;color-scheme:dark">
          </div>
          <div>
            <div style="font-size:9px;color:rgba(255,255,255,.4);margin-bottom:3px">Conducted by</div>
            <input type="text" id="cisConductedBy" placeholder="Assessor name"
              style="padding:5px 8px;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-family:Kanit,sans-serif;font-size:12px;width:150px" autocomplete="off">
          </div>
          <button class="btn btn-cyan btn-sm" id="cisSaveBtn" onclick="cisSave()">${cisState.editId ? 'Update Assessment' : 'Save to Database'}</button>
        </div>` : ''}
    </div>
  </div>`;

  Object.entries(controls).forEach(([ctrlNum, ctrl]) => {
    const isOpen = cisState.openPanels[`ctrl_${ctrlNum}`];
    const scopedSfs = goal ? ctrl.safeguards.filter(s => s.ig <= goalN) : ctrl.safeguards;
    const answeredInScope = scopedSfs.filter(s => cisState.answers[s.sf] != null).length;
    const done = scopedSfs.length > 0 && answeredInScope === scopedSfs.length;
    const started = answeredInScope > 0 && !done;

    html += `
    <div class="survey-panel">
      <div class="sph" onclick="cisToggleCtrl(${ctrlNum})">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="cis-control-header" style="margin:0;padding:4px 8px">
            <div class="cis-ctrl-num">Control ${ctrlNum}</div>
          </div>
          <div>
            <div class="cis-ctrl-name" style="font-size:13px">${ctrl.name}</div>
            <div style="font-size:10px;color:var(--muted)">${ctrl.safeguards.length} safeguard${ctrl.safeguards.length !== 1 ? 's' : ''} · ${answeredInScope}/${scopedSfs.length}${goal ? ' in scope' : ''} answered</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge ${done ? 'b-green' : started ? 'b-amber' : 'b-gray'}">${done ? 'Done' : started ? 'In progress' : 'Not started'}</span>
          <span style="color:var(--muted);font-size:12px">${isOpen ? '▴' : '▾'}</span>
        </div>
      </div>
      <div class="spb${isOpen ? ' open' : ''}">
        ${ctrl.safeguards.map(s => {
          const ans = cisState.answers[s.sf];
          const inScope = !goal || s.ig <= goalN;
          const dimStyle = inScope ? '' : 'opacity:.4;';
          const hasNote = !!(cisState.notes && cisState.notes[s.sf]);
          const commentOpen = !!(cisState.openComments && cisState.openComments[s.sf]);
          const noteVal = escH((cisState.notes && cisState.notes[s.sf]) || '');
          return `<div class="cis-safeguard" style="${dimStyle}">
            <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:5px">
              <span class="cis-sf-id">${s.sf}</span>
              <span class="ig-badge ig${s.ig}-badge" style="flex-shrink:0;margin-top:1px">IG${s.ig}</span>
              <span class="cis-sf-text" style="margin:0">${s.title}</span>
              ${goal && !inScope ? `<span style="font-size:9px;color:var(--muted);margin-left:auto;flex-shrink:0;padding:2px 6px;border-radius:4px;background:var(--bg)">outside goal</span>` : ''}
            </div>
            <div class="cis-sf-sub">${s.sub}</div>
            <div class="cis-ans-row">
              ${['yes','partial','no','na'].map(v => {
                const labels = { yes: '✓ Yes', partial: '~ Partial', no: '✕ No', na: 'N/A' };
                return `<button class="cis-ans-btn${ans === v ? ' sel-'+v : ''}" onclick="cisAnswer('${s.sf}','${v}')">${labels[v]}</button>`;
              }).join('')}
              <button data-comment-btn="${s.sf}" onclick="cisCommentToggle('${s.sf}')" style="margin-left:auto;font-size:10px;font-weight:600;padding:3px 9px;border-radius:6px;border:1px dashed ${hasNote ? 'var(--navy)' : 'var(--border)'};background:transparent;color:${hasNote ? 'var(--navy)' : 'var(--muted)'};cursor:pointer" title="Assessor comment">💬${hasNote ? ' ✓' : ''} Comment</button>
              <button onclick="cisEvidencePlaceholder('${s.sf}')" style="font-size:10px;font-weight:600;padding:3px 9px;border-radius:6px;border:1px dashed var(--border);background:transparent;color:var(--muted);cursor:pointer" title="Upload evidence (coming soon)">📎 Evidence</button>
            </div>
            ${commentOpen ? `<textarea id="note-${s.sf}" rows="2"
              onblur="cisNoteBlur('${s.sf}', this.value)"
              placeholder="Assessor note for ${s.sf}…"
              style="width:100%;box-sizing:border-box;margin-top:6px;padding:6px 8px;border-radius:6px;border:1.5px solid var(--border);font-family:Kanit,sans-serif;font-size:12px;color:var(--text);resize:vertical;background:var(--bg)"
            >${noteVal}</textarea>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  });

  html += `<div style="margin-top:.75rem;display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" onclick="cisExpandAll(true)">Expand all</button>
    <button class="btn btn-outline btn-sm" onclick="cisExpandAll(false)">Collapse all</button>
    <button class="btn btn-outline btn-sm" onclick="cisNavToDashboard()">← Back to Dashboard</button>
    ${goal ? `<button class="btn btn-cyan btn-sm" onclick="cisSave()">Save to Database</button>` : ''}
  </div>`;

  return html;
}

// ── QUICK CHECK FORM ──────────────────────────────────────────────────────────

function renderCISQuick() {
  const { score, answered, total } = cisQuickCalcScore(cisState.quickAnswers);
  const pct = total > 0 ? Math.round(answered / total * 100) : 0;
  const isEdit = !!cisState.quickEditId;
  const today = new Date().toISOString().split('T')[0];

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">⚡ CIS Quick Check${isEdit ? ' — Edit' : ''}</div>
      <div style="font-size:12px;color:var(--muted)">${CIS_QUICK_TOTAL} plain-language questions across all 18 CIS control groups · no evidence required</div>
    </div>
    <button class="btn btn-outline btn-sm" onclick="cisNavToDashboard()">← Back to Dashboard</button>
  </div>

  <div class="score-hero-ins" style="margin-bottom:1rem;padding:14px 20px">
    <div style="flex:1">
      <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:2px">Score So Far</div>
          <div style="font-size:28px;font-weight:800;color:#fff">${answered > 0 ? score : '—'}<span style="font-size:14px">${answered > 0 ? '%' : ''}</span></div>
        </div>
        <div style="flex:1;min-width:200px">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
            <span style="font-size:10px;color:rgba(255,255,255,.5)">${answered} of ${total} answered</span>
            <span style="font-size:10px;color:rgba(255,255,255,.5)">${pct}%</span>
          </div>
          <div style="height:6px;background:rgba(255,255,255,.12);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--cyan);border-radius:3px;transition:width .3s"></div>
          </div>
        </div>
        <div style="display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap">
          <div style="display:flex;flex-direction:column;gap:3px">
            <label style="font-size:9px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em">Assessment Date</label>
            <input type="date" id="cisQuickDate" value="${today}"
              style="padding:5px 8px;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-family:Kanit,sans-serif;font-size:12px">
          </div>
          <div style="display:flex;flex-direction:column;gap:3px">
            <label style="font-size:9px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em">Conducted By</label>
            <input type="text" id="cisQuickConductedBy" placeholder="Assessor name" autocomplete="off"
              style="padding:5px 8px;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-family:Kanit,sans-serif;font-size:12px;width:140px">
          </div>
          <button class="btn btn-cyan btn-sm" id="cisQuickSaveBtn" onclick="cisSaveQuick()">${isEdit ? 'Update Quick Check' : 'Save Quick Check'}</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card" style="padding:0;overflow:hidden">`;

  CIS_QUICK_QUESTIONS.forEach(group => {
    const groupAnswered = group.questions.filter(q => cisState.quickAnswers[q.id] != null).length;
    html += `
    <div style="border-bottom:2px solid var(--border)">
      <div style="background:var(--bg);padding:9px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)">
        <span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:10px;background:var(--navy);color:#fff">Control ${group.ctrl}</span>
        <span style="font-size:13px;font-weight:700;color:var(--text)">${group.ctrlName}</span>
        <span style="margin-left:auto;font-size:10px;color:${groupAnswered === group.questions.length ? '#15803d' : 'var(--muted)'}">
          ${groupAnswered === group.questions.length ? '✓ ' : ''}${groupAnswered}/${group.questions.length}
        </span>
      </div>
      ${group.questions.map(q => {
        const ans = cisState.quickAnswers[q.id];
        return `<div style="padding:12px 16px;border-bottom:1px solid var(--border)">
          <div style="font-size:13px;color:var(--text);margin-bottom:8px;line-height:1.45">${q.text}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            ${['yes','partial','no','na'].map(v => {
              const labels = { yes: '✓ Yes', partial: '~ Partial', no: '✕ No', na: 'N/A' };
              return `<button class="cis-ans-btn${ans === v ? ' sel-'+v : ''}" onclick="cisQuickAnswer('${q.id}','${v}')">${labels[v]}</button>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
  });

  html += `</div>
  <div style="margin-top:.75rem;display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" onclick="cisNavToDashboard()">← Back to Dashboard</button>
    <button class="btn btn-cyan btn-sm" onclick="cisSaveQuick()">${isEdit ? 'Update Quick Check' : 'Save Quick Check'}</button>
  </div>`;

  return html;
}

// ── POAM VIEW ─────────────────────────────────────────────────────────────────

function renderCISPoam() {
  const run = cisState.poamRun;
  if (!run) return renderCISDashboard();

  const answers = Object.fromEntries(
    Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_'))
  );
  const goal = (run.answers || {})._goal || null;
  const goalN = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 3;
  const igBg  = ['','#dcfce7','#dbeafe','#ede9fe'];
  const igTxt = ['','#15803d','#1d4ed8','#6d28d9'];

  const gaps = CIS_SAFEGUARDS.filter(s =>
    (goal ? s.ig <= goalN : true) && (answers[s.sf] === 'no' || answers[s.sf] === 'partial')
  );

  const items = cisState.poamItems || {};
  const assigned   = gaps.filter(s => items[s.sf]?.assigned_to).length;
  const dated      = gaps.filter(s => items[s.sf]?.target_date).length;
  const accepted   = gaps.filter(s => items[s.sf]?.risk_decision === 'accept').length;
  const remediated = gaps.filter(s => items[s.sf]?.status === 'remediated').length;

  const inputSty = 'width:100%;padding:4px 6px;border-radius:5px;border:1px solid var(--border);font-family:Kanit,sans-serif;font-size:11px;color:var(--text);background:#fff;box-sizing:border-box';

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📋 Plan of Action &amp; Milestones</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''}${goal ? ' · Goal: ' + goal.toUpperCase() : ''}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="cisNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="cisExportPoam()">↓ Export Excel</button>
      <button class="btn btn-cyan btn-sm" id="cisPoamSaveBtn" onclick="cisSavePoam()">Save POAM</button>
    </div>
  </div>

  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem">
    ${[
      { label: 'Total Gaps',        val: gaps.length,            col: 'var(--navy)' },
      { label: 'Unassigned',        val: gaps.length - assigned, col: '#dc2626' },
      { label: 'Assigned',          val: assigned,               col: '#b45309' },
      { label: 'Target Dates Set',  val: dated,                  col: '#1d4ed8' },
      { label: 'Accepted Risks',    val: accepted,               col: '#7c3aed' },
      { label: 'Remediated',        val: remediated,             col: '#15803d' },
    ].map(s => `<div style="padding:8px 14px;border-radius:8px;background:var(--card);border:1px solid var(--border);text-align:center;min-width:82px">
      <div style="font-size:20px;font-weight:800;color:${s.col}">${s.val}</div>
      <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-top:1px">${s.label}</div>
    </div>`).join('')}
  </div>`;

  if (gaps.length === 0) {
    html += `<div class="card" style="text-align:center;padding:3rem 1rem">
      <div style="font-size:32px;margin-bottom:.75rem">🎉</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:4px">No gaps found</div>
      <div style="font-size:12px;color:var(--muted)">All in-scope safeguards are answered Yes or N/A for this assessment.</div>
    </div>`;
  } else {
    html += `<div style="overflow-x:auto">
    <table style="width:100%;min-width:1140px;border-collapse:collapse;font-size:12px">
      <thead>
        <tr style="background:var(--navy);color:#fff">
          <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;white-space:nowrap;letter-spacing:.05em">ID</th>
          <th style="padding:8px 6px;text-align:center;font-size:10px;font-weight:700;letter-spacing:.05em">IG</th>
          <th style="padding:8px 6px;text-align:center;font-size:10px;font-weight:700;letter-spacing:.05em">Gap</th>
          <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.05em">Safeguard Title &amp; Note</th>
          <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.05em;min-width:130px">Assigned To</th>
          <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.05em;min-width:130px">Target Date</th>
          <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.05em;min-width:140px">Decision</th>
          <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.05em;min-width:190px">Rationale / Notes</th>
          <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.05em;min-width:130px">Status</th>
        </tr>
      </thead>
      <tbody>
        ${gaps.map(s => {
          const ans  = answers[s.sf];
          const item = items[s.sf] || {};
          const note = (cisState.poamNotes || {})[s.sf] || '';
          const rowBg = ans === 'no' ? 'background:rgba(220,38,38,.03)' : 'background:rgba(180,83,9,.03)';
          const ansBadge = ans === 'no'
            ? '<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:#fee2e2;color:#dc2626">No</span>'
            : '<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:#fef3c7;color:#b45309">Partial</span>';
          return `<tr data-sf="${s.sf}" style="border-bottom:1px solid var(--border);${rowBg}">
            <td style="padding:8px 10px;font-weight:700;color:var(--navy);white-space:nowrap;vertical-align:top">${s.sf}</td>
            <td style="padding:8px 6px;text-align:center;vertical-align:top"><span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:${igBg[s.ig]};color:${igTxt[s.ig]}">IG${s.ig}</span></td>
            <td style="padding:8px 6px;text-align:center;vertical-align:top">${ansBadge}</td>
            <td style="padding:8px 10px;font-size:11px;line-height:1.4;color:var(--text);vertical-align:top">
              ${escH(s.title)}
              ${note ? `<div style="font-size:10px;color:var(--muted);margin-top:3px;font-style:italic">📝 ${escH(note)}</div>` : ''}
            </td>
            <td style="padding:6px 8px;vertical-align:top"><input class="poam-assigned" type="text" placeholder="Name or team…" value="${escH(item.assigned_to || '')}" style="${inputSty}"></td>
            <td style="padding:6px 8px;vertical-align:top"><input class="poam-date" type="date" value="${item.target_date || ''}" style="${inputSty}"></td>
            <td style="padding:6px 8px;vertical-align:top">
              <select class="poam-decision" style="${inputSty}">
                <option value="" ${!item.risk_decision ? 'selected' : ''}>— Open</option>
                <option value="remediate" ${item.risk_decision === 'remediate' ? 'selected' : ''}>Remediate</option>
                <option value="accept"    ${item.risk_decision === 'accept'    ? 'selected' : ''}>Accept Risk</option>
                <option value="transfer"  ${item.risk_decision === 'transfer'  ? 'selected' : ''}>Transfer / Insure</option>
              </select>
            </td>
            <td style="padding:6px 8px;vertical-align:top"><input class="poam-rationale" type="text" placeholder="Justification or notes…" value="${escH(item.risk_rationale || '')}" style="${inputSty}"></td>
            <td style="padding:6px 8px;vertical-align:top">
              <select class="poam-status" style="${inputSty}">
                <option value="open"        ${(item.status || 'open') === 'open'        ? 'selected' : ''}>Open</option>
                <option value="in_progress" ${item.status === 'in_progress'              ? 'selected' : ''}>In Progress</option>
                <option value="remediated"  ${item.status === 'remediated'               ? 'selected' : ''}>Remediated</option>
                <option value="accepted"    ${item.status === 'accepted'                 ? 'selected' : ''}>Risk Accepted</option>
              </select>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>
    <div style="margin-top:.75rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <span style="font-size:11px;color:var(--muted)">Edit fields above, then Save POAM to persist.</span>
      <button class="btn btn-outline btn-sm" onclick="cisNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="cisExportPoam()">↓ Export Excel</button>
      <button class="btn btn-cyan btn-sm" onclick="cisSavePoam()">Save POAM</button>
    </div>`;
  }

  return html;
}

async function cisOpenPoam(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
  const run = runs[idx];
  if (!run) return;
  cisState.poamRun   = run;
  cisState.poamItems = {};
  cisState.poamNotes = {};
  if (run.id) {
    try {
      const [poamRows, noteRows] = await Promise.all([
        sb.cisPoam.getForAssessment(run.id),
        sb.cisNotes.getForAssessment(run.id),
      ]);
      (poamRows || []).forEach(p => { cisState.poamItems[p.safeguard_id] = p; });
      (noteRows || []).forEach(n => { cisState.poamNotes[n.safeguard_id] = n.comment || ''; });
    } catch(e) { console.warn('POAM load failed', e); }
  }
  cisState.view = 'poam';
  renderMain();
}

function cisCollectPoamData() {
  const rows = document.querySelectorAll('tr[data-sf]');
  const out = [];
  rows.forEach(row => {
    const sf         = row.dataset.sf;
    const assigned   = (row.querySelector('.poam-assigned')?.value || '').trim() || null;
    const targetDate = row.querySelector('.poam-date')?.value || null;
    const decision   = row.querySelector('.poam-decision')?.value || null;
    const rationale  = (row.querySelector('.poam-rationale')?.value || '').trim() || null;
    const status     = row.querySelector('.poam-status')?.value || 'open';
    const isDefault  = !assigned && !targetDate && !decision && !rationale && status === 'open';
    if (!isDefault && cisState.poamRun?.id) {
      out.push({ assessment_id: cisState.poamRun.id, org_id: currentOrg?.id, safeguard_id: sf, assigned_to: assigned, target_date: targetDate, risk_decision: decision, risk_rationale: rationale, status });
    }
  });
  return out;
}

async function cisSavePoam() {
  const items = cisCollectPoamData();
  const btn = document.getElementById('cisPoamSaveBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Saving…'; }
  try {
    if (cisState.poamRun?.id) {
      await sb.cisPoam.deleteAllForAssessment(cisState.poamRun.id);
      if (items.length) await sb.cisPoam.upsertAll(items);
    }
    cisState.poamItems = {};
    items.forEach(it => { cisState.poamItems[it.safeguard_id] = it; });
    toast(`✓ POAM saved — ${items.length} item${items.length !== 1 ? 's' : ''}`, '#15803d');
    if (btn) { btn.disabled = false; btn.textContent = 'Save POAM'; }
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Save POAM'; }
  }
}

async function cisExportPoam() {
  const run = cisState.poamRun;
  if (!run) return;
  const items = cisCollectPoamData();
  const itemMap = {};
  items.forEach(it => { itemMap[it.safeguard_id] = it; });
  // Also include already-persisted items not changed in this session
  Object.entries(cisState.poamItems || {}).forEach(([sf, it]) => {
    if (!itemMap[sf]) itemMap[sf] = it;
  });

  const answers = Object.fromEntries(
    Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_'))
  );
  const goal  = (run.answers || {})._goal || null;
  const goalN = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 3;
  const gaps  = CIS_SAFEGUARDS.filter(s =>
    (goal ? s.ig <= goalN : true) && (answers[s.sf] === 'no' || answers[s.sf] === 'partial')
  );

  try {
    await cisLoadScript('js/xlsx.full.min.js');
    const wb   = XLSX.utils.book_new();
    const today = new Date().toISOString().split('T')[0];
    const decLabel    = { remediate: 'Remediate', accept: 'Accept Risk', transfer: 'Transfer / Insure' };
    const statusLabel = { open: 'Open', in_progress: 'In Progress', remediated: 'Remediated', accepted: 'Risk Accepted' };

    const aoa = [
      ['[Client logo — upload via Organisation Manager in a future release]', '', '', '', '', '', '', '', '', '', ''],
      ['PLAN OF ACTION & MILESTONES (POAM)', '', '', '', '', '', '', '', '', '', ''],
      ['Organisation:', currentOrg.name, '', 'Assessment Date:', run.date || '', '', 'IG Goal:', (goal || '—').toUpperCase(), '', '', ''],
      ['Conducted By:', run.conductedBy || '—', '', 'Generated:', today, '', 'Total Gaps:', gaps.length, '', '', ''],
      [],
      ['Safeguard ID', 'Control Group', 'IG Level', 'Safeguard Title', 'Gap Status', 'Assessor Note', 'Assigned To', 'Target Date', 'Decision', 'Rationale / Notes', 'POAM Status'],
    ];

    gaps.forEach(s => {
      const it   = itemMap[s.sf] || {};
      const note = (cisState.poamNotes || {})[s.sf] || '';
      aoa.push([
        s.sf,
        `Control ${s.ctrl} — ${s.ctrlName}`,
        `IG${s.ig}`,
        s.title,
        answers[s.sf] === 'no' ? 'No' : 'Partial',
        note,
        it.assigned_to   || '',
        it.target_date   || '',
        decLabel[it.risk_decision]      || 'Open',
        it.risk_rationale || '',
        statusLabel[it.status || 'open'] || 'Open',
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = [
      { wch: 14 }, { wch: 36 }, { wch: 8 }, { wch: 52 }, { wch: 10 },
      { wch: 32 }, { wch: 22 }, { wch: 14 }, { wch: 20 }, { wch: 36 }, { wch: 14 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'POAM');
    const slug = (currentOrg.name || 'org').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    XLSX.writeFile(wb, `POAM_${slug}_${run.date || today}.xlsx`);
    toast('✓ POAM exported', '#152168');
  } catch(e) { toast('Export failed: ' + e.message, '#dc2626'); }
}

// ── NAV HELPERS ───────────────────────────────────────────────────────────────

function cisStartNewAssessment() {
  cisState.answers = {};
  cisState.openPanels = {};
  cisState.notes = {};
  cisState.openComments = {};
  cisState.view = 'form';
  cisState.editId = null;
  renderMain();
}

function cisNavToDashboard() {
  cisState.view = 'dashboard';
  renderMain();
  setTimeout(() => { const c = document.getElementById('cisTrendChart'); if (c) cisTrendDraw(); }, 80);
}

function cisStartQuickCheck() {
  cisState.quickAnswers = {};
  cisState.quickEditId = null;
  cisState.view = 'quick';
  renderMain();
}

function cisOpenQuickAssessment(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['cis_quick'] || [];
  const run = runs[idx];
  if (!run) return;
  cisState.quickAnswers = Object.fromEntries(
    Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_'))
  );
  cisState.quickEditId = run.id || null;
  cisState.view = 'quick';
  renderMain();
  setTimeout(() => {
    const d = document.getElementById('cisQuickDate');
    if (d && run.date) d.value = run.date;
    const cb = document.getElementById('cisQuickConductedBy');
    if (cb && run.conductedBy) cb.value = run.conductedBy;
  }, 50);
}

async function cisDeleteQuickAssessment(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['cis_quick'] || [];
  const run = runs[idx];
  if (!run) return;
  if (!confirm(`Delete quick check from ${run.date || 'unknown date'}?`)) return;
  try {
    if (run.id) await sb.deleteAssessment(run.id);
    orgAssessments[currentOrg.id]['cis_quick'].splice(idx, 1);
    toast('✓ Quick check deleted', '#152168');
    renderMain();
  } catch(e) { toast('Delete failed: ' + e.message, '#dc2626'); }
}

async function cisOpenAssessment(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
  const run = runs[idx];
  if (!run) return;
  const rawAnswers = Object.assign({}, run.answers || {});
  cisState.answers = Object.fromEntries(Object.entries(rawAnswers).filter(([k]) => !k.startsWith('_')));
  cisState.openPanels = {};
  cisState.notes = {};
  cisState.openComments = {};
  cisState.view = 'form';
  cisState.editId = run.id || null;
  cisState.reportCommentary = (run.answers || {})._exec_commentary || '';
  if (run.id) {
    try {
      const rows = await sb.cisNotes.getForAssessment(run.id);
      (rows || []).forEach(n => { cisState.notes[n.safeguard_id] = n.comment || ''; });
    } catch(e) { console.warn('Failed to load CIS notes', e); }
  }
  renderMain();
  setTimeout(() => {
    const d = document.getElementById('cisSaveDate');
    if (d && run.date) d.value = run.date;
    const cb = document.getElementById('cisConductedBy');
    if (cb && run.conductedBy) cb.value = run.conductedBy;
  }, 50);
}

async function cisDeleteAssessment(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
  const run = runs[idx];
  if (!run) return;
  if (!run.id) {
    toast('Cannot delete — ID missing. Reload the page and try again.', '#dc2626');
    return;
  }
  if (!confirm(`Delete the assessment from ${run.date || 'this date'}? This cannot be undone.`)) return;
  try {
    await sb.deleteAssessment(run.id);
    orgAssessments[currentOrg.id]['cis'].splice(idx, 1);
    buildNav();
    renderMain();
    setTimeout(() => { const c = document.getElementById('cisTrendChart'); if (c) cisTrendDraw(); }, 80);
    toast('Assessment deleted', '#15803d');
  } catch(e) {
    toast('Delete failed: ' + e.message, '#dc2626');
  }
}

// Called by app.js after render to draw the trend chart
function cisTrendDraw() {
  const canvas = document.getElementById('cisTrendChart');
  if (!canvas) return;
  const rawRuns = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
  // Sort by date so trend always plots chronologically regardless of insertion order
  const runs = [...rawRuns].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  if (runs.length < 2) return;
  const goal = cisGetGoal();
  const goalN = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 1;
  const goalColor = { 1: '#15803d', 2: '#1d4ed8', 3: '#6d28d9' }[goalN] || '#152168';

  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 200; canvas.width = W; const H = 60;
  ctx.clearRect(0, 0, W, H);
  const scores = runs.map(r => r.score);
  const mn = Math.max(0, Math.min(...scores) - 10);
  const mx = Math.min(100, Math.max(...scores) + 10);
  const range = mx - mn || 1;
  const px = i => Math.round(i * (W - 20) / (runs.length - 1) + 10);
  const py = v => Math.round(H - 6 - (v - mn) / range * (H - 16));

  ctx.beginPath(); ctx.strokeStyle = goalColor; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  scores.forEach((s, i) => i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)));
  ctx.stroke();

  scores.forEach((s, i) => {
    ctx.beginPath(); ctx.arc(px(i), py(s), 4, 0, Math.PI * 2);
    ctx.fillStyle = s >= 75 ? '#15803d' : s >= 50 ? '#b45309' : '#b91c1c';
    ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 9px Kanit,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(s, px(i), py(s) - 7);
  });

  ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.font = '9px Kanit,sans-serif';
  runs.forEach((r, i) => { ctx.textAlign = 'center'; ctx.fillText(r.date.slice(5), px(i), H); });
}

// ── INTERACTIONS ──────────────────────────────────────────────────────────────

function cisToggleCtrl(n) {
  cisState.openPanels[`ctrl_${n}`] = !cisState.openPanels[`ctrl_${n}`];
  renderMain();
}

function cisAnswer(sf, val) {
  cisState.answers[sf] = val;
  renderMain();
}

function cisQuickAnswer(id, val) {
  cisState.quickAnswers[id] = val;
  renderMain();
}

function cisExpandAll(open) {
  [...new Set(CIS_SAFEGUARDS.map(s => s.ctrl))].forEach(c => {
    cisState.openPanels[`ctrl_${c}`] = open;
  });
  renderMain();
}

async function cisSaveQuick() {
  const { score } = cisQuickCalcScore(cisState.quickAnswers);
  const dateInput = document.getElementById('cisQuickDate');
  const date = (dateInput && dateInput.value) || new Date().toISOString().split('T')[0];
  const conductedBy = (document.getElementById('cisQuickConductedBy')?.value || '').trim();
  const answersToSave = Object.assign({}, cisState.quickAnswers);
  const btn = document.getElementById('cisQuickSaveBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Saving…'; }
  const editId = cisState.quickEditId;
  try {
    const payload = { score, answers: answersToSave, assessed_at: date, conducted_by: conductedBy || null };
    if (editId) {
      await sb.updateAssessment(editId, payload);
      const runs = (orgAssessments[currentOrg.id] || {})['cis_quick'] || [];
      const idx = runs.findIndex(r => r.id === editId);
      if (idx !== -1) runs[idx] = { ...runs[idx], date, score, answers: answersToSave, conductedBy };
    } else {
      const saved = await sb.saveAssessment({ org_id: currentOrg.id, module: 'cis_quick', ...payload });
      const record = Array.isArray(saved) ? saved[0] : saved;
      if (!orgAssessments[currentOrg.id]) orgAssessments[currentOrg.id] = {};
      if (!orgAssessments[currentOrg.id]['cis_quick']) orgAssessments[currentOrg.id]['cis_quick'] = [];
      orgAssessments[currentOrg.id]['cis_quick'].push({ id: record?.id, date, score, answers: answersToSave, conductedBy });
      orgAssessments[currentOrg.id]['cis_quick'].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    }
    cisState.quickAnswers = {};
    cisState.quickEditId = null;
    cisState.view = 'dashboard';
    toast(editId ? '✓ Quick check updated' : `✓ Quick check saved — score ${score}%`, '#15803d');
    renderMain();
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = editId ? 'Update Quick Check' : 'Save Quick Check'; }
  }
}

function cisCommentToggle(sf) {
  if (!cisState.openComments) cisState.openComments = {};
  cisState.openComments[sf] = !cisState.openComments[sf];
  renderMain();
}

function cisNoteBlur(sf, val) {
  if (!cisState.notes) cisState.notes = {};
  cisState.notes[sf] = val;
  // Update button appearance without a full re-render
  const btn = document.querySelector(`[data-comment-btn="${sf}"]`);
  if (btn) {
    const hasNote = val && val.trim();
    btn.style.borderColor = hasNote ? 'var(--navy)' : 'var(--border)';
    btn.style.color = hasNote ? 'var(--navy)' : 'var(--muted)';
    btn.innerHTML = `💬${hasNote ? ' ✓' : ''} Comment`;
  }
}

function cisEvidencePlaceholder(sf) {
  toast('📎 Evidence upload — coming soon', '#152168');
}

// ── SAVE ──────────────────────────────────────────────────────────────────────

async function cisSave() {
  // Capture any comment textareas still focused (user may not have blurred)
  document.querySelectorAll('[id^="note-"]').forEach(ta => {
    const sf = ta.id.slice(5);
    if (!cisState.notes) cisState.notes = {};
    cisState.notes[sf] = ta.value;
  });
  const goal = cisGetGoal();
  if (!goal) { toast('Set a CIS goal before saving', '#b45309'); return; }
  const { score } = cisCalcScore(cisState.answers, goal);
  const dateInput = document.getElementById('cisSaveDate');
  const date = (dateInput && dateInput.value) || new Date().toISOString().split('T')[0];
  const conductedBy = (document.getElementById('cisConductedBy')?.value || '').trim();
  const answersToSave = Object.assign({}, cisState.answers, {
    _goal: goal,
    _ig_level: cisDetectLevel(cisState.answers) || goal,
  });
  if (cisState.reportCommentary) answersToSave._exec_commentary = cisState.reportCommentary;
  const btn = document.getElementById('cisSaveBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Saving…'; }
  const editId = cisState.editId;
  try {
    const payload = { score, answers: answersToSave, assessed_at: date, conducted_by: conductedBy || null };
    let assessmentId = editId;
    if (editId) {
      await sb.updateAssessment(editId, payload);
      const runs = orgAssessments[currentOrg.id]['cis'] || [];
      const idx = runs.findIndex(r => r.id === editId);
      if (idx !== -1) runs[idx] = { ...runs[idx], date, score, answers: answersToSave, conductedBy };
    } else {
      const saved = await sb.saveAssessment({ org_id: currentOrg.id, module: 'cis', ...payload });
      const record = Array.isArray(saved) ? saved[0] : saved;
      assessmentId = record?.id;
      if (!orgAssessments[currentOrg.id]) orgAssessments[currentOrg.id] = {};
      if (!orgAssessments[currentOrg.id]['cis']) orgAssessments[currentOrg.id]['cis'] = [];
      orgAssessments[currentOrg.id]['cis'].push({ id: assessmentId, date, score, answers: answersToSave, conductedBy });
      orgAssessments[currentOrg.id]['cis'].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    }
    // Persist notes: replace all notes for this assessment with current state
    if (assessmentId) {
      const noteRows = Object.entries(cisState.notes || {})
        .filter(([, v]) => v && v.trim())
        .map(([sf, comment]) => ({ assessment_id: assessmentId, org_id: currentOrg.id, safeguard_id: sf, comment: comment.trim() }));
      await sb.cisNotes.deleteAllForAssessment(assessmentId);
      if (noteRows.length) await sb.cisNotes.upsertAll(noteRows);
    }
    cisState = { answers: {}, openPanels: {}, orgId: currentOrg.id, view: 'dashboard', editId: null, notes: {}, openComments: {}, quickAnswers: {}, quickEditId: null, poamRun: null, poamItems: {}, poamNotes: {}, reportRun: null, reportCommentary: '' };
    toast(editId ? `✓ Assessment updated` : `✓ CIS saved — score ${score} vs ${goal.toUpperCase()} goal`, '#15803d');
    buildNav(); renderMain();
    setTimeout(() => { const c = document.getElementById('cisTrendChart'); if (c) cisTrendDraw(); }, 80);
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Save to Database'; }
  }
}

// ── EXPORT ────────────────────────────────────────────────────────────────────

function cisLoadScript(src) {
  return new Promise((resolve, reject) => {
    // Already loaded successfully
    if (typeof XLSX !== 'undefined') { resolve(); return; }
    // Script tag exists but may still be loading — attach listeners to it
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', resolve);
      existing.addEventListener('error', () => reject(new Error('load failed')));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('load failed'));
    document.head.appendChild(s);
  });
}

async function cisEnsureXLSX() {
  if (typeof XLSX !== 'undefined') return;
  const cdns = [
    'https://cdn.jsdelivr.net/npm/xlsx@0.20.3/dist/xlsx.full.min.js',
    'https://unpkg.com/xlsx@0.20.3/dist/xlsx.full.min.js',
  ];
  for (const url of cdns) {
    try { await cisLoadScript(url); if (typeof XLSX !== 'undefined') return; } catch(e) {}
  }
  throw new Error('Could not load Excel library — check your internet connection');
}

async function cisExportExcel() {
  if (typeof XLSX === 'undefined') { toast('Excel library not loaded — reload the page', '#dc2626'); return; }
  const goal = cisGetGoal();
  const orgName = currentOrg?.name || 'Client';
  const today = new Date().toISOString().split('T')[0];
  const goalLabel = goal ? `Goal: ${goal.toUpperCase()}` : 'No goal set';

  const rows = [
    [`CIS Controls v8 Assessment — ${orgName}`],
    [`Generated: ${today}  |  ${goalLabel}  |  Valid answers: Yes / Partial / No / N/A`],
    [`All ${CIS_SAFEGUARDS.length} safeguards included. Column B = IG tier. Fill Column G only. Leave blank to skip.`],
    [],
    ['Safeguard', 'IG Level', 'Control #', 'Control Name', 'Safeguard Title', 'Description', 'Your Answer'],
  ];

  CIS_SAFEGUARDS.forEach(s => {
    const raw = cisState.answers[s.sf] || '';
    const ans = raw === 'na' ? 'N/A' : raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : '';
    rows.push([s.sf, `IG${s.ig}`, s.ctrl, s.ctrlName, s.title, s.sub, ans]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 10 }, { wch: 9 }, { wch: 10 }, { wch: 42 }, { wch: 55 }, { wch: 85 }, { wch: 14 }];
  ws['!views'] = [{ state: 'frozen', xSplit: 0, ySplit: 5 }];
  XLSX.utils.book_append_sheet(wb, ws, 'CIS Assessment');
  XLSX.writeFile(wb, `CIS_Assessment_${orgName.replace(/[^a-zA-Z0-9]/g, '_')}_${today}.xlsx`);
  toast('✓ Excel template downloaded');
}

// ── IMPORT ────────────────────────────────────────────────────────────────────

let cisImportParsed = null;

function cisShowImportModal() {
  const goal = cisGetGoal();
  const today = new Date().toISOString().split('T')[0];
  cisImportParsed = null;

  document.getElementById('cisImportModalBox').innerHTML = `
    <div style="padding:24px 28px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
        <div style="font-size:16px;font-weight:700;color:var(--navy)">Import CIS Assessment from Excel</div>
        <button onclick="closeCisModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted);line-height:1">✕</button>
      </div>
      <div style="font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:18px">
        Importing for: <strong style="color:var(--navy)">${escH(currentOrg?.name || '')}</strong><br>
        Use the exported template — Column A = Safeguard ID, Column G = Answer.
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Assessment Date</div>
          <input type="date" id="cisImportDate" value="${today}"
            style="width:100%;padding:8px 10px;border:1.5px solid var(--border);border-radius:6px;font-family:Kanit,sans-serif;font-size:13px;color:var(--text);box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Score Against</div>
          <div style="display:flex;gap:6px">
            ${['ig1','ig2','ig3'].map(l => {
              const n = l.replace('ig','');
              const checked = l === (goal || 'ig2') ? 'checked' : '';
              return `<label style="flex:1;display:flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;padding:7px;border:1.5px solid var(--border);border-radius:6px;font-size:12px;font-weight:700" id="cisIgLbl-${l}">
                <input type="radio" name="importIg" value="${l}" ${checked} onchange="cisImportIgChange()">
                IG${n}
              </label>`;
            }).join('')}
          </div>
        </div>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Excel File</div>
        <label style="cursor:pointer;background:var(--bg);border:1.5px dashed var(--border);color:var(--muted);display:inline-flex;align-items:center;gap:8px;font-size:13px;border-radius:8px;padding:10px 18px">
          📂 Choose .xlsx file
          <input type="file" accept=".xlsx,.xls" style="display:none" onchange="cisHandleImportFile(this)">
        </label>
        <span id="cisImportFileName" style="font-size:12px;color:var(--muted);margin-left:10px"></span>
      </div>

      <div id="cisImportPreview"></div>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:20px">
        <button class="btn btn-sm" onclick="closeCisModal()"
          style="background:var(--bg);border:1.5px solid var(--border);color:var(--muted)">Cancel</button>
        <button class="btn btn-cyan btn-sm" id="cisImportSaveBtn" onclick="cisImportSave()" style="display:none">Save to Database</button>
      </div>
    </div>`;

  document.getElementById('cisImportModal').style.display = 'flex';
}

function closeCisModal() {
  document.getElementById('cisImportModal').style.display = 'none';
  cisImportParsed = null;
}

function cisImportIgChange() {
  if (cisImportParsed) {
    const ig = document.querySelector('input[name="importIg"]:checked')?.value || 'ig1';
    cisRenderImportPreview(cisImportParsed, ig);
  }
}

async function cisHandleImportFile(input) {
  const file = input.files[0];
  if (!file) return;
  const nameEl = document.getElementById('cisImportFileName');
  if (nameEl) nameEl.textContent = file.name;
  const previewEl = document.getElementById('cisImportPreview');
  previewEl.innerHTML = `<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">
    <span class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;margin-right:8px;vertical-align:middle"></span>Parsing…
  </div>`;

  if (typeof XLSX === 'undefined') {
    previewEl.innerHTML = `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:12px 14px;font-size:13px;color:#b91c1c">Excel library not loaded — reload the page and try again.</div>`;
    return;
  }

  try {
    cisImportParsed = await cisParseImportFile(file);
    const ig = document.querySelector('input[name="importIg"]:checked')?.value || 'ig1';
    cisRenderImportPreview(cisImportParsed, ig);
  } catch(e) {
    previewEl.innerHTML = `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:12px 14px;font-size:13px;color:#b91c1c">${escH(e.message)}</div>`;
    cisImportParsed = null;
  }
}

function cisParseImportFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        if (!wb.SheetNames.length) { reject(new Error('Empty workbook')); return; }
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });

        // Detect format by finding the header row and checking column layout
        // Format A (our template): Col A = "Safeguard", Col G = answer
        // Format B (client format): Col A = "Response", Col B = "Control ID"
        let dataStart = -1;
        let fmt = 'A';
        for (let i = 0; i < rows.length; i++) {
          const a = String(rows[i][0] || '').toLowerCase().trim();
          const b = String(rows[i][1] || '').toLowerCase().trim();
          if (a === 'safeguard') { dataStart = i + 1; fmt = 'A'; break; }
          if (a === 'response' && b.includes('control')) { dataStart = i + 1; fmt = 'B'; break; }
        }
        if (dataStart === -1) {
          reject(new Error('Header row not found. Expected "Safeguard" in Column A (this tool\'s template) or "Response" / "Control ID" in Columns A–B (client format).'));
          return;
        }

        // Normalise any answer string to yes/partial/no/na
        function mapAnswer(raw) {
          const v = String(raw || '').toLowerCase().trim();
          if (!v) return null;
          if (v === 'yes' || v.startsWith('yes, f') || v.startsWith('yes, c') || v === 'implemented') return 'yes';
          if (v.startsWith('yes, p') || v.startsWith('partial') || v === 'in progress') return 'partial';
          if (v === 'no' || v.startsWith('no,') || v === 'not implemented') return 'no';
          if (v === 'n/a' || v === 'na' || v.startsWith('not app')) return 'na';
          return null;
        }

        const answers = {};
        const issues = [];
        let skippedIds = 0;

        for (let i = dataStart; i < rows.length; i++) {
          const row = rows[i];
          const sfRaw = fmt === 'B' ? String(row[1] || '').trim() : String(row[0] || '').trim();
          const sfId = sfRaw.replace(/^CIS/i, '');
          if (!sfId) continue;
          if (!CIS_SAFEGUARDS.find(s => s.sf === sfId)) {
            skippedIds++;
            continue;
          }
          const ansRaw = fmt === 'B' ? String(row[0] || '').trim() : String(row[6] || '').trim();
          if (!ansRaw) continue;
          const mapped = mapAnswer(ansRaw);
          if (!mapped) {
            issues.push(`Unrecognised answer "${ansRaw}" for ${sfId} — skipped`);
          } else {
            answers[sfId] = mapped;
          }
        }

        if (skippedIds > 0) {
          issues.push(`${skippedIds} safeguard${skippedIds !== 1 ? 's' : ''} in this file are not in the platform's current safeguard list and were skipped. Scoring is based on the ${CIS_SAFEGUARDS.length} safeguards tracked by this platform — results will be consistent across all imports.`);
        }

        resolve({ answers, issues });
      } catch(err) {
        reject(new Error('Could not parse file: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsBinaryString(file);
  });
}

function cisRenderImportPreview(parsed, ig) {
  const { score, yes, partial, answered, total } = cisCalcScore(parsed.answers, ig);
  const igN = ig.replace('ig', '');
  const band = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const bandCol = score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : score >= 40 ? '#ea580c' : '#dc2626';
  const missing = total - answered;
  const scopedSfs = cisGetSafeguards(ig);
  const answeredItems = scopedSfs.filter(s => parsed.answers[s.sf]);
  const preview = answeredItems.slice(0, 15);
  const ansColors = { yes: '#15803d', partial: '#b45309', no: '#b91c1c', na: '#5a6a8a' };

  let html = `<div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:8px">
    <div style="background:linear-gradient(135deg,var(--navy),var(--navy2));color:#fff;padding:12px 16px;display:flex;gap:20px;flex-wrap:wrap;align-items:center">
      <div><div style="font-size:22px;font-weight:700">${score}</div><div style="font-size:11px;opacity:.6">Score vs IG${igN}</div></div>
      <div><div style="font-size:22px;font-weight:700">${answered}/${total}</div><div style="font-size:11px;opacity:.6">Safeguards answered</div></div>
      <div style="margin-left:auto;text-align:right">
        <div style="font-size:13px;font-weight:700;color:${bandCol}">${band}</div>
        <div style="font-size:11px;opacity:.6">${missing > 0 ? `${missing} unanswered = scored as 0` : 'All in-scope safeguards answered ✓'}</div>
      </div>
    </div>`;

  const realIssues = parsed.issues.filter(i => !i.match(/^[0-9]+ safeguard/));
  const infoNote = parsed.issues.find(i => i.match(/^[0-9]+ safeguard/));
  if (infoNote) {
    html += `<div style="background:#eff6ff;padding:10px 14px;font-size:12px;color:#1e40af;border-bottom:1px solid #bfdbfe">
      ℹ️ ${escH(infoNote)}
    </div>`;
  }
  if (realIssues.length > 0) {
    html += `<div style="background:#fef2f2;padding:10px 14px;font-size:12px;color:#b91c1c;border-bottom:1px solid var(--border)">
      <strong>${realIssues.length} issue${realIssues.length !== 1 ? 's' : ''}:</strong>
      ${realIssues.map(i => `<div>• ${escH(i)}</div>`).join('')}
    </div>`;
  }

  if (preview.length > 0) {
    html += `<div style="max-height:220px;overflow-y:auto">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="background:var(--bg)">
          <th style="padding:6px 12px;text-align:left;border-bottom:1px solid var(--border);font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Safeguard</th>
          <th style="padding:6px 12px;text-align:left;border-bottom:1px solid var(--border);font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Title</th>
          <th style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Answer</th>
        </tr></thead><tbody>`;
    preview.forEach(s => {
      const ans = parsed.answers[s.sf];
      const col = ansColors[ans] || '#5a6a8a';
      const lbl = ans === 'na' ? 'N/A' : ans.charAt(0).toUpperCase() + ans.slice(1);
      html += `<tr style="border-bottom:1px solid #f0f4fa">
        <td style="padding:5px 12px;font-size:11px;font-weight:700;color:var(--muted)">${s.sf} <span style="font-weight:400;opacity:.6">IG${s.ig}</span></td>
        <td style="padding:5px 12px;color:var(--text)">${escH(s.title)}</td>
        <td style="padding:5px 12px;text-align:center;font-weight:700;font-size:12px;color:${col}">${lbl}</td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
    if (answeredItems.length > 15) {
      html += `<div style="padding:6px 12px;font-size:11px;color:var(--muted);background:var(--bg);border-top:1px solid var(--border)">… and ${answeredItems.length - 15} more answered safeguards</div>`;
    }
  } else {
    html += `<div style="padding:14px 16px;font-size:13px;color:var(--muted)">No answers found in Column G for the selected IG scope.</div>`;
  }

  html += `</div>`;

  const previewEl = document.getElementById('cisImportPreview');
  previewEl.innerHTML = html;
  const saveBtn = document.getElementById('cisImportSaveBtn');
  if (saveBtn) saveBtn.style.display = answered > 0 ? 'inline-block' : 'none';
}

async function cisImportSave() {
  if (!cisImportParsed) return;
  const ig = document.querySelector('input[name="importIg"]:checked')?.value || 'ig1';
  const date = document.getElementById('cisImportDate')?.value || new Date().toISOString().split('T')[0];
  const { score } = cisCalcScore(cisImportParsed.answers, ig);
  const btn = document.getElementById('cisImportSaveBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Saving…'; }

  const answersToSave = Object.assign({}, cisImportParsed.answers, {
    _goal: ig,
    _ig_level: cisDetectLevel(cisImportParsed.answers) || ig,
  });

  try {
    // Also save the goal to org profile if not already set
    if (!cisGetGoal()) {
      await sb.profiles.upsert({ org_id: currentOrg.id, cis_goal: ig });
      if (!orgProfiles[currentOrg.id]) orgProfiles[currentOrg.id] = {};
      orgProfiles[currentOrg.id].cis_goal = ig;
    }

    const saved = await sb.saveAssessment({ org_id: currentOrg.id, module: 'cis', score, answers: answersToSave, assessed_at: date });
    const record = Array.isArray(saved) ? saved[0] : saved;
    if (!orgAssessments[currentOrg.id]) orgAssessments[currentOrg.id] = {};
    if (!orgAssessments[currentOrg.id]['cis']) orgAssessments[currentOrg.id]['cis'] = [];
    orgAssessments[currentOrg.id]['cis'].push({ id: record?.id, date, score, answers: answersToSave, conductedBy: '' });
    // Keep runs sorted by date
    orgAssessments[currentOrg.id]['cis'].sort((a, b) => a.date.localeCompare(b.date));

    cisImportParsed = null;
    closeCisModal();
    cisState = { answers: {}, openPanels: {}, orgId: null, view: 'dashboard', editId: null, notes: {}, openComments: {}, quickAnswers: {}, quickEditId: null, poamRun: null, poamItems: {}, poamNotes: {}, reportRun: null, reportCommentary: '' };
    toast(`✓ CIS imported — score ${score} vs ${ig.toUpperCase()}, dated ${date}`, '#15803d');
    buildNav(); renderMain();
    setTimeout(() => { const c = document.getElementById('cisTrendChart'); if (c) cisTrendDraw(); }, 80);
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Save to Database'; }
  }
}

// ── EXECUTIVE REPORT ──────────────────────────────────────────────────────────

function cisOpenReport(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
  const run = runs[idx];
  if (!run) return;
  cisState.reportRun = run;
  cisState.reportCommentary = (run.answers || {})._exec_commentary || '';
  cisState.view = 'report';
  renderMain();
}

function renderCISReport() {
  const run = cisState.reportRun;
  if (!run) { cisState.view = 'dashboard'; return renderCISDashboard(); }

  const answers = Object.fromEntries(
    Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_'))
  );
  const goal = (run.answers || {})._goal || null;

  if (!goal) {
    return `${renderTierBanner()}<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">
      <div style="font-size:28px;margin-bottom:8px">📊</div>
      <div style="font-weight:700;color:var(--text)">No IG goal recorded for this assessment</div>
      <div style="font-size:12px;margin:8px 0 16px">This assessment was saved before a goal was set. Set an IG goal on the dashboard and re-save to generate a report.</div>
      <button class="btn btn-outline btn-sm" onclick="cisNavToDashboard()">← Back</button>
    </div>`;
  }

  const goalN = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 3;
  const { score, yes: yesN, partial: partN, answered, total } = cisCalcScore(answers, goal);
  const scopedSfs = cisGetSafeguards(goal);
  const noN      = scopedSfs.filter(s => answers[s.sf] === 'no').length;
  const fullImpl = Math.round(yesN / total * 100);
  const covBand  = fullImpl >= 75 ? 'Mature' : fullImpl >= 50 ? 'Good' : fullImpl >= 25 ? 'Partial' : 'Minimal';
  const band     = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const bandCol  = score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : score >= 40 ? '#ea580c' : '#dc2626';

  // Top gaps (No answers within IG scope)
  const topGaps = scopedSfs.filter(s => answers[s.sf] === 'no').slice(0, 10);

  const runs = (orgAssessments[currentOrg.id] || {})['cis'] || [];
  const commentary = cisState.reportCommentary || '';

  return `
  ${renderTierBanner()}

  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">📊 Executive Security Report</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · CIS Controls v8 · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="cisNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="cisExportReportWord()">📄 Export Word</button>
    </div>
  </div>

  <!-- Row 1: Score Gauge + Coverage Gauge + Summary Stats -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">

    <div class="card" style="padding:1.25rem;text-align:center">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Overall Score</div>
      <canvas id="cisReportGauge" width="220" height="130" style="max-width:100%"></canvas>
      <div style="font-size:10px;color:var(--muted);margin-top:6px">Weighted quality — Partial = 50% credit</div>
    </div>

    <div class="card" style="padding:1.25rem;text-align:center">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Fully Implemented</div>
      <canvas id="cisReportCoverage" width="220" height="130" style="max-width:100%"></canvas>
      <div style="font-size:10px;color:var(--muted);margin-top:6px">${yesN} of ${total} safeguards fully completed (Yes only)</div>
    </div>

    <div class="card" style="padding:1.25rem">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Assessment Summary</div>
      ${[
        { label: 'Score',       val: score + '%',         col: bandCol },
        { label: 'Risk Band',   val: band,                col: bandCol },
        { label: 'IG Goal',     val: goal.toUpperCase(),  col: 'var(--navy)' },
        { label: 'Fully Impl.', val: fullImpl + '%',      col: fullImpl >= 70 ? '#15803d' : fullImpl >= 40 ? '#b45309' : '#dc2626' },
        { label: 'Yes (full)',  val: yesN,                col: '#15803d' },
        { label: 'Partial',     val: partN,               col: '#b45309' },
        { label: 'Gaps (No)',   val: noN,                 col: noN > 0 ? '#dc2626' : '#15803d' },
        { label: 'Date',        val: run.date || '—',     col: 'var(--text)' },
      ].map(s => `
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:12px;color:var(--muted)">${s.label}</span>
          <span style="font-size:12px;font-weight:700;color:${s.col}">${s.val}</span>
        </div>`).join('')}
    </div>

  </div>

  <!-- Row 2: Trend + IG progress -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">

    <div class="card" style="padding:1.25rem">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Score Trend</div>
      ${runs.length >= 2
        ? `<canvas id="cisReportTrend" style="width:100%;height:80px;display:block"></canvas>`
        : `<div style="font-size:12px;color:var(--muted);padding:1.5rem 0;text-align:center">Trend visible after 2+ assessments</div>`}
    </div>

    <div class="card" style="padding:1.25rem">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">IG Tier Coverage</div>
      ${[1,2,3].map(n => {
        const sfs = CIS_SAFEGUARDS.filter(s => s.ig === n);
        const inScope = n <= goalN;
        const y = sfs.filter(s => answers[s.sf] === 'yes').length;
        const p = sfs.filter(s => answers[s.sf] === 'partial').length;
        const pct = Math.round((y + p * 0.5) / sfs.length * 100);
        const col = n === 1 ? '#15803d' : n === 2 ? '#1d4ed8' : '#6d28d9';
        return `<div style="margin-bottom:10px;${inScope ? '' : 'opacity:.32'}">
          <div style="display:flex;justify-content:space-between;margin-bottom:3px">
            <span style="font-size:12px;font-weight:700;color:${col}">IG${n}${inScope ? '' : ' — out of scope'}</span>
            <span style="font-size:12px;color:var(--muted)">${y+p}/${sfs.length} · ${pct}%</span>
          </div>
          <div style="height:8px;background:var(--bg);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${col};border-radius:4px"></div>
          </div>
        </div>`;
      }).join('')}
    </div>

  </div>

  <!-- Row 3: Top gaps -->
  ${topGaps.length ? `
  <div class="card" style="padding:1.25rem;margin-bottom:1rem">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">
      Priority Gaps — No Answers (${noN} total${noN > 10 ? ', first 10 shown' : ''})
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <tbody>
        ${topGaps.map(s => `
          <tr style="border-bottom:1px solid var(--border)">
            <td style="padding:6px 10px;font-weight:700;color:var(--navy);white-space:nowrap;width:48px">${s.sf}</td>
            <td style="padding:6px 6px;width:38px"><span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:8px;background:${['','#dcfce7','#dbeafe','#ede9fe'][s.ig]};color:${['','#15803d','#1d4ed8','#6d28d9'][s.ig]}">IG${s.ig}</span></td>
            <td style="padding:6px 10px;color:var(--text)">${escH(s.title)}</td>
            <td style="padding:6px 10px;color:var(--muted);font-size:11px;white-space:nowrap">C${s.ctrl}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>` : `
  <div class="card" style="padding:1.25rem;margin-bottom:1rem;text-align:center;color:#15803d">
    <div style="font-size:18px;margin-bottom:4px">✅</div>
    <div style="font-size:13px;font-weight:700">No gaps — all scoped safeguards are Yes or Partial</div>
  </div>`}

  <!-- Row 5: Commentary -->
  <div class="card" style="padding:1.25rem">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Executive Commentary</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">Written narrative for client presentation</div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-outline btn-sm" onclick="cisGenerateReportPrompt()" title="Generate a data-rich prompt to paste into Claude">✨ Generate AI Prompt</button>
        <button class="btn btn-cyan btn-sm" onclick="cisSaveCommentary()">Save Commentary</button>
      </div>
    </div>
    <textarea id="cisReportCommentary" rows="8"
      placeholder="Type your executive commentary here, or click ✨ Generate AI Prompt — paste the output into Claude, copy the response back here, then Save."
      style="width:100%;box-sizing:border-box;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border);font-family:Kanit,sans-serif;font-size:13px;color:var(--text);resize:vertical;line-height:1.7"
    >${escH(commentary)}</textarea>
    <div style="font-size:10px;color:var(--muted);margin-top:6px">
      💡 <strong>Generate AI Prompt</strong> copies a pre-filled prompt (org name, score, gaps, trend data) to your clipboard. Paste into Claude → get polished commentary → paste back above → Save.
    </div>
  </div>`;
}

// ── REPORT CHARTS ─────────────────────────────────────────────────────────────

function drawReportCharts() {
  const run = cisState.reportRun;
  if (!run || cisState.view !== 'report') return;

  const answers = Object.fromEntries(
    Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_'))
  );
  const goal = (run.answers || {})._goal;
  if (!goal) return;

  const { score, yes: yesN, partial: partN, total } = cisCalcScore(answers, goal);
  const fullImpl = Math.round(yesN / total * 100);
  const covBand  = fullImpl >= 75 ? 'Mature' : fullImpl >= 50 ? 'Good' : fullImpl >= 25 ? 'Partial' : 'Minimal';

  cisDrawGauge('cisReportGauge', score);
  cisDrawGauge('cisReportCoverage', fullImpl, covBand);

  const runs = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
  if (runs.length >= 2) cisDrawReportTrend('cisReportTrend', runs);
}

function cisDrawGauge(canvasId, score, bandOverride = null) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H * 0.72;
  const r  = Math.min(W, H) * 0.40;
  ctx.clearRect(0, 0, W, H);

  // Colored zone background arcs
  [
    { from: 0,  to: 40,  color: '#fecaca' },
    { from: 40, to: 70,  color: '#fde68a' },
    { from: 70, to: 100, color: '#bbf7d0' },
  ].forEach(z => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI + (z.from / 100) * Math.PI, Math.PI + (z.to / 100) * Math.PI);
    ctx.lineWidth = 16;
    ctx.strokeStyle = z.color;
    ctx.lineCap = 'butt';
    ctx.stroke();
  });

  // Score arc
  const scoreColor = score >= 70 ? '#15803d' : score >= 40 ? '#b45309' : '#dc2626';
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, Math.PI + (score / 100) * Math.PI);
  ctx.lineWidth = 16;
  ctx.strokeStyle = scoreColor;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Needle
  const ang = Math.PI + (score / 100) * Math.PI;
  const nx = cx + (r - 20) * Math.cos(ang);
  const ny = cy + (r - 20) * Math.sin(ang);
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny);
  ctx.lineWidth = 2.5; ctx.strokeStyle = scoreColor; ctx.lineCap = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fillStyle = scoreColor; ctx.fill();

  // Score text
  ctx.fillStyle = scoreColor;
  ctx.font = `bold ${Math.round(r * 0.38)}px Kanit, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(score + '%', cx, cy - r * 0.26);

  // Band label
  const band = bandOverride || (score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk');
  ctx.fillStyle = '#5a6a8a';
  ctx.font = `bold ${Math.round(r * 0.15)}px Kanit, sans-serif`;
  ctx.fillText(band, cx, cy - r * 0.02);

  // 0 / 100 axis labels
  ctx.font = `${Math.round(r * 0.13)}px Kanit, sans-serif`; ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'left';  ctx.fillText('0',   cx - r - 2, cy + 8);
  ctx.textAlign = 'right'; ctx.fillText('100', cx + r + 2, cy + 8);
}

function cisDrawDonut(canvasId, segments) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const total = segments.reduce((s, g) => s + g.value, 0);
  if (!total) return;

  const cy = H * 0.45;
  const cx = W / 2;
  const outerR = Math.min(W * 0.45, cy * 0.88);
  const innerR = outerR * 0.56;
  ctx.clearRect(0, 0, W, H);

  let angle = -Math.PI / 2;
  segments.forEach(seg => {
    const sweep = (seg.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, angle, angle + sweep);
    ctx.arc(cx, cy, innerR, angle + sweep, angle, true);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    angle += sweep;
  });

  // Legend
  const legY = cy + outerR + 12;
  const itemW = W / segments.length;
  segments.forEach((seg, i) => {
    const lx = i * itemW + 4;
    ctx.fillStyle = seg.color;
    ctx.fillRect(lx, legY, 9, 9);
    ctx.fillStyle = '#5a6a8a';
    ctx.font = '9px Kanit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${seg.label} (${seg.value})`, lx + 12, legY + 8);
  });
}

function cisDrawReportTrend(canvasId, runs) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const W = canvas.offsetWidth || 340;
  canvas.width = W; canvas.height = 80;
  const H = 80;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const scores = sorted.map(r => r.score);
  const mn = Math.max(0, Math.min(...scores) - 10);
  const mx = Math.min(100, Math.max(...scores) + 10);
  const range = mx - mn || 1;
  const px = i => Math.round(14 + i * (W - 28) / (scores.length - 1));
  const py = v => Math.round(H - 12 - (v - mn) / range * (H - 24));

  ctx.beginPath();
  scores.forEach((s, i) => i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)));
  ctx.lineTo(px(scores.length - 1), H); ctx.lineTo(px(0), H); ctx.closePath();
  ctx.fillStyle = 'rgba(7,180,217,.08)'; ctx.fill();

  ctx.beginPath(); ctx.strokeStyle = '#07B4D9'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  scores.forEach((s, i) => i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)));
  ctx.stroke();

  scores.forEach((s, i) => {
    const col = s >= 75 ? '#15803d' : s >= 50 ? '#b45309' : '#b91c1c';
    ctx.beginPath(); ctx.arc(px(i), py(s), 4, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
    ctx.fillStyle = col; ctx.font = 'bold 9px Kanit,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(s, px(i), py(s) - 6);
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px Kanit,sans-serif';
    ctx.fillText(sorted[i].date ? sorted[i].date.slice(5) : '', px(i), H);
  });
}

// ── REPORT ACTIONS ────────────────────────────────────────────────────────────

function cisGenerateReportPrompt() {
  const run = cisState.reportRun;
  if (!run) return;

  const answers = Object.fromEntries(
    Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_'))
  );
  const goal = (run.answers || {})._goal;
  if (!goal) { toast('No IG goal recorded for this assessment', '#b45309'); return; }

  const { score, yes: yesN, partial: partN } = cisCalcScore(answers, goal);
  const noCount = cisGetSafeguards(goal).filter(s => answers[s.sf] === 'no').length;
  const band = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';

  const runs = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
  const trend = [...runs]
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .map(r => `${r.date}: ${r.score}%`)
    .join(' → ');

  const noGaps = cisGetSafeguards(goal)
    .filter(s => answers[s.sf] === 'no').slice(0, 10)
    .map(s => `- ${s.sf} [C${s.ctrl}: ${s.ctrlName}]: ${s.title}`)
    .join('\n');

  const partGaps = cisGetSafeguards(goal)
    .filter(s => answers[s.sf] === 'partial').slice(0, 6)
    .map(s => `- ${s.sf} [C${s.ctrl}: ${s.ctrlName}]: ${s.title}`)
    .join('\n');

  const prompt = `Please write a professional executive cybersecurity report summary. This will be presented to a non-technical CEO or board — avoid jargon, focus on business risk and practical outcomes.

ORGANISATION: ${currentOrg.name}
ASSESSMENT DATE: ${run.date || 'Unknown'}
ASSESSOR: ${run.conductedBy || 'Not specified'}
FRAMEWORK: CIS Controls v8 — ${goal.toUpperCase()} implementation group
OVERALL SCORE: ${score}% — Risk Band: ${band}
SAFEGUARDS ANSWERED: ${yesN} Yes, ${partN} Partial, ${noCount} No
SCORE TREND: ${trend || 'First assessment — no trend available'}

TOP CONTROL FAILURES (No answers — highest priority):
${noGaps || '— None —'}

PARTIALLY ADDRESSED CONTROLS:
${partGaps || '— None —'}

Please write:
1. EXECUTIVE SUMMARY (2–3 paragraphs): Overall security posture, what the ${score}% score means in plain business terms, and the key message for leadership. Note any positive trend if scores are improving.
2. KEY FINDINGS (3–4 bullets): The most significant risks, written as business exposure — what is the real-world impact if these gaps go unaddressed?
3. PRIORITY RECOMMENDATIONS (3 actions): Each with a one-sentence business rationale explaining why it matters now.

Keep the total to one printed page. Write in flowing professional prose under each heading — no labels like "Executive Summary:" in the output.`;

  navigator.clipboard.writeText(prompt)
    .then(() => toast('✓ AI prompt copied — paste into Claude to generate commentary', '#152168'))
    .catch(() => {
      const ta = document.getElementById('cisReportCommentary');
      if (ta) { ta.value = prompt; ta.select(); ta.scrollIntoView(); }
      toast('Clipboard blocked — prompt placed in commentary field', '#b45309');
    });
}

async function cisSaveCommentary() {
  const run = cisState.reportRun;
  if (!run?.id) { toast('Cannot save — assessment ID missing', '#dc2626'); return; }
  const commentary = (document.getElementById('cisReportCommentary')?.value || '').trim();
  try {
    const updatedAnswers = { ...(run.answers || {}), _exec_commentary: commentary };
    await sb.updateAssessment(run.id, { answers: updatedAnswers });
    cisState.reportRun = { ...run, answers: updatedAnswers };
    cisState.reportCommentary = commentary;
    // Keep in-memory cache consistent so re-open doesn't lose commentary
    const runs = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
    const idx  = runs.findIndex(r => r.id === run.id);
    if (idx !== -1) runs[idx] = { ...runs[idx], answers: updatedAnswers };
    toast('✓ Commentary saved', '#15803d');
  } catch(e) {
    toast('Save failed: ' + e.message, '#dc2626');
  }
}

// ── WORD EXPORT ───────────────────────────────────────────────────────────────

function cisExportReportWord() {
  const run = cisState.reportRun;
  if (!run) return;

  const answers = Object.fromEntries(
    Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_'))
  );
  const goal = (run.answers || {})._goal;
  if (!goal) { toast('No IG goal on this assessment', '#b45309'); return; }

  const goalN = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 3;
  const { score, yes: yesN, partial: partN, answered, total } = cisCalcScore(answers, goal);
  const noN      = cisGetSafeguards(goal).filter(s => answers[s.sf] === 'no').length;
  const fullImpl = Math.round(yesN / total * 100);
  const band     = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const bandCol  = score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : score >= 40 ? '#ea580c' : '#dc2626';
  const topGaps  = cisGetSafeguards(goal).filter(s => answers[s.sf] === 'no').slice(0, 10);
  const commentary = cisState.reportCommentary || (run.answers || {})._exec_commentary || '';

  const runs = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  const igProg = [1, 2, 3].map(n => {
    const sfs = CIS_SAFEGUARDS.filter(s => s.ig === n);
    const y = sfs.filter(s => answers[s.sf] === 'yes').length;
    const p = sfs.filter(s => answers[s.sf] === 'partial').length;
    return { n, y, p, total: sfs.length, inScope: n <= goalN,
      score: Math.round((y + p * 0.5) / sfs.length * 100),
      cov:   Math.round((y + p) / sfs.length * 100) };
  });

  const prevRun = sorted.length >= 2 ? sorted[sorted.length - 2] : null;
  const scoreChange = prevRun ? score - prevRun.score : null;
  const changeStr = scoreChange === null ? 'First assessment' : (scoreChange > 0 ? '+' + scoreChange + '%' : scoreChange + '%');

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8">
<title>CIS Executive Report — ${escH(currentOrg.name)}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11pt; color: #1a2340; margin: 0; padding: 0; }
  .page { padding: 2.5cm; max-width: 19cm; margin: 0 auto; }
  h1 { font-size: 20pt; color: #152168; margin: 0 0 4pt 0; font-weight: bold; }
  h2 { font-size: 11pt; color: #152168; margin: 20pt 0 6pt 0; font-weight: bold;
       border-bottom: 1.5pt solid #152168; padding-bottom: 3pt;
       text-transform: uppercase; letter-spacing: .5pt; }
  .sub { font-size: 10pt; color: #5a6a8a; margin: 0 0 20pt 0; }
  .dial-row { display: flex; gap: 20pt; margin-bottom: 20pt; }
  .dial-box { flex: 1; border: 1pt solid #dde3ef; border-radius: 4pt; padding: 12pt 16pt; text-align: center; }
  .dial-label { font-size: 8pt; color: #5a6a8a; text-transform: uppercase; letter-spacing: .5pt; margin-bottom: 8pt; }
  .dial-score { font-size: 32pt; font-weight: bold; line-height: 1; margin-bottom: 4pt; }
  .dial-band  { font-size: 10pt; font-weight: bold; margin-bottom: 6pt; }
  .dial-sub   { font-size: 9pt; color: #5a6a8a; }
  .stats-box  { flex: 1.2; border: 1pt solid #dde3ef; border-radius: 4pt; padding: 12pt 16pt; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10pt; font-size: 10pt; }
  th { background: #152168; color: #fff; text-align: left; padding: 5pt 8pt;
       font-size: 9pt; text-transform: uppercase; letter-spacing: .4pt; }
  td { padding: 5pt 8pt; border-bottom: 1pt solid #e8ecf4; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .ig1 { background: #dcfce7; color: #15803d; padding: 1pt 6pt; border-radius: 8pt; font-size: 9pt; font-weight: bold; }
  .ig2 { background: #dbeafe; color: #1d4ed8; padding: 1pt 6pt; border-radius: 8pt; font-size: 9pt; font-weight: bold; }
  .ig3 { background: #ede9fe; color: #6d28d9; padding: 1pt 6pt; border-radius: 8pt; font-size: 9pt; font-weight: bold; }
  .footer { margin-top: 28pt; padding-top: 8pt; border-top: 1pt solid #dde3ef; font-size: 8pt; color: #94a3b8; }
</style>
</head>
<body>
<div class="page">

  <h1>Cybersecurity Executive Report</h1>
  <div class="sub">
    ${escH(currentOrg.name)} &nbsp;&middot;&nbsp; CIS Controls v8 &nbsp;&middot;&nbsp; ${run.date || '&mdash;'}
    ${run.conductedBy ? ' &nbsp;&middot;&nbsp; Assessed by: ' + escH(run.conductedBy) : ''}
  </div>

  <div class="dial-row">
    <div class="dial-box">
      <div class="dial-label">Overall Score</div>
      <div class="dial-score" style="color:${bandCol}">${score}%</div>
      <div class="dial-band" style="color:${bandCol}">${band}</div>
      <div class="dial-sub">Weighted quality measure<br>Partial = 50% credit</div>
    </div>
    <div class="dial-box">
      <div class="dial-label">Fully Implemented</div>
      <div class="dial-score" style="color:#152168">${fullImpl}%</div>
      <div class="dial-band" style="color:#152168">${fullImpl >= 75 ? 'Mature' : fullImpl >= 50 ? 'Good' : fullImpl >= 25 ? 'Partial' : 'Minimal'}</div>
      <div class="dial-sub">${yesN} of ${total} safeguards<br>fully completed (Yes only)</div>
    </div>
    <div class="stats-box">
      <table style="margin:0">
        ${[
          ['IG Goal',            goal.toUpperCase(),  '#152168'],
          ['Scoped safeguards',  total,               '#1a2340'],
          ['Fully implemented', yesN + ' (' + fullImpl + '%)', '#15803d'],
          ['Partial',            partN,               '#b45309'],
          ['Gaps (No)',          noN,                 noN > 0 ? '#dc2626' : '#15803d'],
          ['vs Prior run',       changeStr,           '#1a2340'],
          ['Date',               run.date || '—',     '#5a6a8a'],
        ].map(([l, v, c]) => `<tr>
          <td style="padding:3pt 8pt 3pt 0;border:none;color:#5a6a8a;font-size:9pt">${l}</td>
          <td style="padding:3pt 0;border:none;font-weight:bold;font-size:9pt;color:${c}">${v}</td>
        </tr>`).join('')}
      </table>
    </div>
  </div>

  ${sorted.length >= 2 ? `
  <h2>Score Trend</h2>
  <table>
    <thead><tr><th>Date</th><th>Score</th><th>Coverage</th><th>Change</th><th>Conducted By</th></tr></thead>
    <tbody>
      ${sorted.map((r, i) => {
        const rA = Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_')));
        const rG = (r.answers || {})._goal || goal;
        const { score: rS, yes: rY, partial: rP, total: rT } = cisCalcScore(rA, rG);
        const rCov = Math.round((rY + rP) / rT * 100);
        const rPrev = sorted[i - 1];
        const rChg = rPrev ? (rS - rPrev.score) : null;
        const rCol = rS >= 75 ? '#15803d' : rS >= 50 ? '#b45309' : '#dc2626';
        return `<tr>
          <td>${r.date || '—'}</td>
          <td style="font-weight:bold;color:${rCol}">${rS}%</td>
          <td>${rCov}%</td>
          <td>${rChg === null ? '—' : (rChg > 0 ? '+' + rChg + '%' : rChg + '%')}</td>
          <td style="color:#5a6a8a">${escH(r.conductedBy || '—')}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>` : ''}

  <h2>IG Tier Progress</h2>
  <table>
    <thead><tr><th>Tier</th><th>In Scope</th><th>Safeguards</th><th>Yes</th><th>Partial</th><th>No / Open</th><th>Score</th><th>Coverage</th></tr></thead>
    <tbody>
      ${igProg.map(t => `<tr style="${t.inScope ? '' : 'color:#94a3b8'}">
        <td><span class="ig${t.n}">IG${t.n}</span></td>
        <td>${t.inScope ? 'Yes' : 'No'}</td>
        <td>${t.total}</td>
        <td style="color:#15803d;font-weight:bold">${t.y}</td>
        <td style="color:#b45309;font-weight:bold">${t.p}</td>
        <td style="color:${(t.total - t.y - t.p) > 0 ? '#dc2626' : '#15803d'};font-weight:bold">${t.total - t.y - t.p}</td>
        <td style="font-weight:bold">${t.score}%</td>
        <td style="font-weight:bold">${t.cov}%</td>
      </tr>`).join('')}
    </tbody>
  </table>

  ${topGaps.length ? `
  <h2>Priority Gaps — No Answers (${noN} total${noN > 10 ? ', first 10 shown' : ''})</h2>
  <table>
    <thead><tr><th style="width:60pt">Safeguard</th><th style="width:36pt">IG</th><th style="width:36pt">Control</th><th>Title</th></tr></thead>
    <tbody>
      ${topGaps.map(s => `<tr>
        <td style="font-weight:bold;color:#152168">${s.sf}</td>
        <td><span class="ig${s.ig}">IG${s.ig}</span></td>
        <td style="color:#5a6a8a">C${s.ctrl}</td>
        <td>${escH(s.title)}</td>
      </tr>`).join('')}
    </tbody>
  </table>` : `<p style="color:#15803d;font-weight:bold">&#10003; No gaps &mdash; all scoped safeguards are Yes or Partial.</p>`}

  ${commentary ? `
  <h2>Executive Commentary</h2>
  ${commentary.split(/\n\n+/).map(p => `<p style="font-size:11pt;line-height:1.75;margin:0 0 10pt 0">${escH(p).replace(/\n/g, '<br>')}</p>`).join('')}` : ''}

  <div class="footer">
    Generated by Abbott Cyber Consulting GRC Platform &nbsp;&middot;&nbsp;
    CIS Controls v8 &nbsp;&middot;&nbsp; ${run.date || '—'}
  </div>

</div>
</body>
</html>`;

  const blob = new Blob(['﻿' + html], { type: 'application/msword' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `CIS_Exec_Report_${(currentOrg.name || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}_${run.date || 'Unknown'}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('✓ Word report downloaded', '#152168');
}
