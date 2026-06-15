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

// ── CIS HINTS — asset type + security function per safeguard (CIS Controls v8) ──
// Asset types: Devices | Software | Network | Users | Data | Applications | N/A
// Security functions: Identify | Protect | Detect | Respond | Recover
const CIS_HINTS = {
  // Control 1 — Inventory & Control of Enterprise Assets
  '1.1':{ asset:'Devices',      fn:'Identify' },
  '1.2':{ asset:'Devices',      fn:'Respond'  },
  '1.3':{ asset:'Devices',      fn:'Identify' },
  '1.4':{ asset:'Devices',      fn:'Identify' },
  '1.5':{ asset:'Devices',      fn:'Identify' },
  // Control 2 — Inventory & Control of Software Assets
  '2.1':{ asset:'Software',     fn:'Identify' },
  '2.2':{ asset:'Software',     fn:'Identify' },
  '2.3':{ asset:'Software',     fn:'Respond'  },
  '2.4':{ asset:'Software',     fn:'Identify' },
  '2.5':{ asset:'Software',     fn:'Protect'  },
  '2.6':{ asset:'Software',     fn:'Protect'  },
  '2.7':{ asset:'Software',     fn:'Protect'  },
  // Control 3 — Data Protection
  '3.1':{ asset:'Data',         fn:'Identify' },
  '3.2':{ asset:'Data',         fn:'Identify' },
  '3.3':{ asset:'Data',         fn:'Protect'  },
  '3.4':{ asset:'Data',         fn:'Protect'  },
  '3.5':{ asset:'Data',         fn:'Protect'  },
  '3.6':{ asset:'Data',         fn:'Protect'  },
  '3.7':{ asset:'Data',         fn:'Identify' },
  '3.8':{ asset:'Data',         fn:'Identify' },
  '3.9':{ asset:'Data',         fn:'Protect'  },
  '3.10':{ asset:'Data',        fn:'Protect'  },
  '3.11':{ asset:'Data',        fn:'Protect'  },
  '3.12':{ asset:'Data',        fn:'Protect'  },
  '3.13':{ asset:'Data',        fn:'Detect'   },
  '3.14':{ asset:'Data',        fn:'Detect'   },
  // Control 4 — Secure Configuration of Enterprise Assets & Software
  '4.1':{ asset:'Devices',      fn:'Protect'  },
  '4.2':{ asset:'Network',      fn:'Protect'  },
  '4.3':{ asset:'Devices',      fn:'Protect'  },
  '4.4':{ asset:'Devices',      fn:'Protect'  },
  '4.5':{ asset:'Devices',      fn:'Protect'  },
  '4.6':{ asset:'Devices',      fn:'Protect'  },
  '4.7':{ asset:'Devices',      fn:'Protect'  },
  '4.8':{ asset:'Devices',      fn:'Protect'  },
  '4.9':{ asset:'Devices',      fn:'Protect'  },
  '4.10':{ asset:'Devices',     fn:'Protect'  },
  '4.11':{ asset:'Devices',     fn:'Protect'  },
  '4.12':{ asset:'Devices',     fn:'Protect'  },
  // Control 5 — Account Management
  '5.1':{ asset:'Users',        fn:'Identify' },
  '5.2':{ asset:'Users',        fn:'Protect'  },
  '5.3':{ asset:'Users',        fn:'Protect'  },
  '5.4':{ asset:'Users',        fn:'Protect'  },
  '5.5':{ asset:'Users',        fn:'Identify' },
  '5.6':{ asset:'Users',        fn:'Protect'  },
  // Control 6 — Access Control Management
  '6.1':{ asset:'Users',        fn:'Protect'  },
  '6.2':{ asset:'Users',        fn:'Protect'  },
  '6.3':{ asset:'Users',        fn:'Protect'  },
  '6.4':{ asset:'Users',        fn:'Protect'  },
  '6.5':{ asset:'Users',        fn:'Protect'  },
  '6.6':{ asset:'Users',        fn:'Identify' },
  '6.7':{ asset:'Users',        fn:'Protect'  },
  '6.8':{ asset:'Users',        fn:'Protect'  },
  // Control 7 — Continuous Vulnerability Management
  '7.1':{ asset:'N/A',          fn:'Identify' },
  '7.2':{ asset:'N/A',          fn:'Respond'  },
  '7.3':{ asset:'Devices',      fn:'Protect'  },
  '7.4':{ asset:'Software',     fn:'Protect'  },
  '7.5':{ asset:'Devices',      fn:'Detect'   },
  '7.6':{ asset:'Devices',      fn:'Detect'   },
  '7.7':{ asset:'Software',     fn:'Respond'  },
  // Control 8 — Audit Log Management
  '8.1':{ asset:'N/A',          fn:'Protect'  },
  '8.2':{ asset:'Devices',      fn:'Detect'   },
  '8.3':{ asset:'Devices',      fn:'Protect'  },
  '8.4':{ asset:'Devices',      fn:'Protect'  },
  '8.5':{ asset:'Devices',      fn:'Detect'   },
  '8.6':{ asset:'Network',      fn:'Detect'   },
  '8.7':{ asset:'Network',      fn:'Detect'   },
  '8.8':{ asset:'Devices',      fn:'Detect'   },
  '8.9':{ asset:'Devices',      fn:'Detect'   },
  '8.10':{ asset:'Devices',     fn:'Protect'  },
  '8.11':{ asset:'Devices',     fn:'Detect'   },
  '8.12':{ asset:'Devices',     fn:'Detect'   },
  // Control 9 — Email & Web Browser Protections
  '9.1':{ asset:'Devices',      fn:'Protect'  },
  '9.2':{ asset:'Network',      fn:'Protect'  },
  '9.3':{ asset:'Network',      fn:'Protect'  },
  '9.4':{ asset:'Software',     fn:'Protect'  },
  '9.5':{ asset:'Network',      fn:'Protect'  },
  '9.6':{ asset:'Network',      fn:'Protect'  },
  '9.7':{ asset:'Network',      fn:'Protect'  },
  // Control 10 — Malware Defenses
  '10.1':{ asset:'Devices',     fn:'Protect'  },
  '10.2':{ asset:'Devices',     fn:'Protect'  },
  '10.3':{ asset:'Devices',     fn:'Protect'  },
  '10.4':{ asset:'Devices',     fn:'Protect'  },
  '10.5':{ asset:'Devices',     fn:'Protect'  },
  '10.6':{ asset:'Devices',     fn:'Protect'  },
  '10.7':{ asset:'Devices',     fn:'Detect'   },
  // Control 11 — Data Recovery
  '11.1':{ asset:'Data',        fn:'Recover'  },
  '11.2':{ asset:'Data',        fn:'Recover'  },
  '11.3':{ asset:'Data',        fn:'Protect'  },
  '11.4':{ asset:'Data',        fn:'Protect'  },
  '11.5':{ asset:'Data',        fn:'Recover'  },
  // Control 12 — Network Infrastructure Management
  '12.1':{ asset:'Network',     fn:'Protect'  },
  '12.2':{ asset:'Network',     fn:'Protect'  },
  '12.3':{ asset:'Network',     fn:'Protect'  },
  '12.4':{ asset:'Network',     fn:'Identify' },
  '12.5':{ asset:'Network',     fn:'Protect'  },
  '12.6':{ asset:'Network',     fn:'Protect'  },
  '12.7':{ asset:'Network',     fn:'Protect'  },
  '12.8':{ asset:'Users',       fn:'Protect'  },
  // Control 13 — Network Monitoring & Defense
  '13.1':{ asset:'Network',     fn:'Detect'   },
  '13.2':{ asset:'Devices',     fn:'Detect'   },
  '13.3':{ asset:'Network',     fn:'Detect'   },
  '13.4':{ asset:'Network',     fn:'Protect'  },
  '13.5':{ asset:'Devices',     fn:'Protect'  },
  '13.6':{ asset:'Network',     fn:'Detect'   },
  '13.7':{ asset:'Devices',     fn:'Protect'  },
  '13.8':{ asset:'Network',     fn:'Protect'  },
  '13.9':{ asset:'Network',     fn:'Protect'  },
  '13.10':{ asset:'Network',    fn:'Protect'  },
  '13.11':{ asset:'N/A',        fn:'Detect'   },
  // Control 14 — Security Awareness & Skills Training
  '14.1':{ asset:'Users',       fn:'Protect'  },
  '14.2':{ asset:'Users',       fn:'Protect'  },
  '14.3':{ asset:'Users',       fn:'Protect'  },
  '14.4':{ asset:'Users',       fn:'Protect'  },
  '14.5':{ asset:'Users',       fn:'Protect'  },
  '14.6':{ asset:'Users',       fn:'Protect'  },
  '14.7':{ asset:'Users',       fn:'Protect'  },
  '14.8':{ asset:'Users',       fn:'Protect'  },
  '14.9':{ asset:'Users',       fn:'Protect'  },
  // Control 15 — Service Provider Management
  '15.1':{ asset:'N/A',         fn:'Identify' },
  '15.2':{ asset:'N/A',         fn:'Identify' },
  '15.3':{ asset:'N/A',         fn:'Identify' },
  '15.4':{ asset:'N/A',         fn:'Protect'  },
  '15.5':{ asset:'N/A',         fn:'Identify' },
  '15.6':{ asset:'N/A',         fn:'Detect'   },
  '15.7':{ asset:'N/A',         fn:'Protect'  },
  // Control 16 — Application Software Security
  '16.1':{ asset:'Applications', fn:'Protect' },
  '16.2':{ asset:'Applications', fn:'Respond' },
  '16.3':{ asset:'Applications', fn:'Respond' },
  '16.4':{ asset:'Applications', fn:'Protect' },
  '16.5':{ asset:'Applications', fn:'Protect' },
  '16.6':{ asset:'Applications', fn:'Protect' },
  '16.7':{ asset:'Applications', fn:'Protect' },
  '16.8':{ asset:'Applications', fn:'Protect' },
  '16.9':{ asset:'Applications', fn:'Protect' },
  '16.10':{ asset:'Applications',fn:'Protect' },
  '16.11':{ asset:'Applications',fn:'Protect' },
  '16.12':{ asset:'Applications',fn:'Protect' },
  '16.13':{ asset:'Applications',fn:'Protect' },
  '16.14':{ asset:'Applications',fn:'Protect' },
  // Control 17 — Incident Response Management
  '17.1':{ asset:'N/A',         fn:'Respond'  },
  '17.2':{ asset:'N/A',         fn:'Respond'  },
  '17.3':{ asset:'N/A',         fn:'Respond'  },
  '17.4':{ asset:'N/A',         fn:'Respond'  },
  '17.5':{ asset:'N/A',         fn:'Respond'  },
  '17.6':{ asset:'N/A',         fn:'Respond'  },
  '17.7':{ asset:'N/A',         fn:'Recover'  },
  '17.8':{ asset:'N/A',         fn:'Recover'  },
  '17.9':{ asset:'N/A',         fn:'Respond'  },
  // Control 18 — Penetration Testing
  '18.1':{ asset:'N/A',         fn:'Identify' },
  '18.2':{ asset:'N/A',         fn:'Identify' },
  '18.3':{ asset:'N/A',         fn:'Respond'  },
  '18.4':{ asset:'N/A',         fn:'Detect'   },
  '18.5':{ asset:'N/A',         fn:'Identify' },
};

const CIS_ASSET_STYLE = {
  Devices:      { bg:'#dbeafe', txt:'#1e40af', icon:'🖥' },
  Software:     { bg:'#ede9fe', txt:'#6d28d9', icon:'📦' },
  Network:      { bg:'#fef3c7', txt:'#92400e', icon:'🌐' },
  Users:        { bg:'#dcfce7', txt:'#166534', icon:'👤' },
  Data:         { bg:'#ccfbf1', txt:'#0f766e', icon:'🗄' },
  Applications: { bg:'#e0e7ff', txt:'#4338ca', icon:'⚙' },
  'N/A':        { bg:'#f1f5f9', txt:'#475569', icon:'📋' },
};

const CIS_FN_STYLE = {
  Identify: { bg:'#dbeafe', txt:'#1e40af' },
  Protect:  { bg:'#dcfce7', txt:'#166534' },
  Detect:   { bg:'#fef3c7', txt:'#92400e' },
  Respond:  { bg:'#fee2e2', txt:'#b91c1c' },
  Recover:  { bg:'#ccfbf1', txt:'#0f766e' },
};

function cisHintBadges(sf) {
  const h = CIS_HINTS[sf];
  if (!h) return '';
  const a = CIS_ASSET_STYLE[h.asset] || CIS_ASSET_STYLE['N/A'];
  const f = CIS_FN_STYLE[h.fn]   || CIS_FN_STYLE.Protect;
  return `<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;background:${a.bg};color:${a.txt};white-space:nowrap">${a.icon} ${h.asset}</span>`
       + `<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;background:${f.bg};color:${f.txt};white-space:nowrap">${h.fn}</span>`
       + `<a href="https://www.cisecurity.org/controls/v8" target="_blank" rel="noopener" style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;background:#f0f4ff;color:#152168;text-decoration:none;white-space:nowrap">CIS ↗</a>`;
}

// ── REPORT ACCORDION LAYER MAP ────────────────────────────────────────────────
// Maps the 6-layer security pyramid to CIS control numbers for the exec report accordion

const CIS_REPORT_LAYERS = [
  { id:'rfl1', label:'FOUNDATION',  sub:'Know What You Have',     color:'#0e7490', controls:[1,2,3,4] },
  { id:'rfl2', label:'CONTROL',     sub:'Control Access & Trust', color:'#1d4ed8', controls:[5,6] },
  { id:'rfl3', label:'HARDENING',   sub:'Reduce Exposure',        color:'#7c3aed', controls:[7,10] },
  { id:'rfl4', label:'VISIBILITY',  sub:'See What Is Happening',  color:'#0f766e', controls:[8,9,12,13] },
  { id:'rfl5', label:'RESILIENCE',  sub:'Respond & Recover',      color:'#b45309', controls:[11,17] },
  { id:'rfl6', label:'GOVERNANCE',  sub:'Manage Risk',            color:'#dc2626', controls:[14,15,16,18] },
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
  if (!sfs.length) return { score: 0, yes: 0, partial: 0, answered: 0, total: 0, na: 0 };
  const yes = sfs.filter(s => answers[s.sf] === 'yes').length;
  const partial = sfs.filter(s => answers[s.sf] === 'partial').length;
  const na = sfs.filter(s => answers[s.sf] === 'na').length;
  const answered = sfs.filter(s => answers[s.sf] != null).length;
  const total = sfs.length;
  const scoreable = total - na; // N/A excluded from denominator — neutral, not negative
  return { score: scoreable > 0 ? Math.round((yes + partial * 0.5) / scoreable * 100) : 0, yes, partial, na, answered, total, scoreable };
}

// Per-tier progress (each row = that tier's exclusive safeguards, not cumulative)
function cisIgProgress(answers) {
  return [1, 2, 3].map(n => {
    const sfs = CIS_SAFEGUARDS.filter(s => s.ig === n);
    const yes = sfs.filter(s => answers[s.sf] === 'yes').length;
    const partial = sfs.filter(s => answers[s.sf] === 'partial').length;
    const na = sfs.filter(s => answers[s.sf] === 'na').length;
    const answered = sfs.filter(s => answers[s.sf] != null).length;
    return { n, yes, partial, na, answered, total: sfs.length };
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
  cisState = { answers, openPanels: {}, orgId: currentOrg?.id, view: 'dashboard', editId: null, notes: {}, openComments: {}, quickAnswers: {}, quickEditId: null, poamRun: null, poamItems: {}, poamNotes: {}, reportRun: null, reportCommentary: '', gapRun: null };
}

// ── GOAL ──────────────────────────────────────────────────────────────────────

async function cisSetGoal(goal) {
  if (!currentOrg) return;
  const prev = cisGetGoal();
  // Optimistic update — render immediately so the button responds
  if (!orgProfiles[currentOrg.id]) orgProfiles[currentOrg.id] = {};
  orgProfiles[currentOrg.id].cis_goal = goal;
  renderMain();
  try {
    await sb.profiles.upsert({ org_id: currentOrg.id, cis_goal: goal });
    const labels = { ig1: 'IG1', ig2: 'IG2', ig3: 'IG3' };
    toast(`Goal updated to ${labels[goal]}`, '#15803d');
    if (typeof rrState !== 'undefined') rrState.orgId = null; // force risk register reload
  } catch(e) {
    // Revert local state if server rejected
    orgProfiles[currentOrg.id].cis_goal = prev;
    renderMain();
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
  if (cisState.view === 'gap') return renderCISGapReport();
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
  const { score, answered, total, na: latestNa, scoreable } = latest && goal
    ? cisCalcScore(latestAnswers, goal)
    : { score: 0, answered: 0, total: 0, na: 0, scoreable: 0 };

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
    const tScoreable = t.total - t.na;
    const pct = tScoreable > 0 ? Math.round((t.yes + t.partial * 0.5) / tScoreable * 100) : 0;
    const col = igColors[t.n];
    const isGoalTier = goal && `ig${t.n}` === goal;
    return `<div style="flex:1;min-width:110px">
      <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:3px">
        <span style="font-size:10px;font-weight:700;color:${inScope ? col : 'rgba(255,255,255,.25)'}">IG${t.n}</span>
        <span style="font-size:9px;color:${inScope ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.2)'}">+${t.total} safeguards${isGoalTier ? ' ← goal' : ''}</span>
        <span style="font-size:10px;color:${inScope ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.2)'};margin-left:auto">${t.answered - t.na}/${tScoreable}</span>
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
              : `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">${answered - latestNa}/${scoreable} answered · ${latest.date}</div>`}
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
    const pctCell = (done, scoreable) => {
      const pct = scoreable > 0 ? Math.round(done / scoreable * 100) : 0;
      const c = pct >= 75 ? '#15803d' : pct >= 50 ? '#b45309' : '#dc2626';
      return `<span style="font-size:13px;font-weight:700;color:${c}">${pct}%</span>`;
    };
    // Sort newest-first; preserve original index so action button handlers stay correct
    const sortedRuns = runs.map((r, origIdx) => ({ r, origIdx }))
      .sort((a, b) => (b.r.date || '').localeCompare(a.r.date || ''));
    sortedRuns.forEach(({ r, origIdx }) => {
      const cleanAns = Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_')));
      // cisIgProgress returns exclusive-tier counts: ig===1 only, ig===2 only, ig===3 only
      const prog = cisIgProgress(cleanAns);
      const p1 = prog[0], p2 = prog[1], p3 = prog[2];
      const d1 = p1.yes + p1.partial, d2 = p2.yes + p2.partial, d3 = p3.yes + p3.partial;
      const s1 = p1.total - p1.na, s2 = p2.total - p2.na, s3 = p3.total - p3.na;
      const dTotal = d1 + d2 + d3, tTotal = s1 + s2 + s3;
      const pctTotal = tTotal > 0 ? Math.round(dTotal / tTotal * 100) : 0;
      const totalCol = pctTotal >= 75 ? '#15803d' : pctTotal >= 50 ? '#b45309' : '#dc2626';
      const igGoal = (r.answers && r.answers._goal) || '';
      const igC = igBadgeCols[igGoal] || { bg: '#f1f5f9', txt: '#5a6a8a' };
      const by = r.conductedBy || '—';
      const isLatest = origIdx === latestIdx;
      html += `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px;font-weight:${isLatest ? '700' : '400'};white-space:nowrap">
          ${r.date || '—'}
          ${isLatest ? '<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;background:#dbeafe;color:#1d4ed8;margin-left:6px">Latest</span>' : ''}
        </td>
        <td style="padding:8px 8px;text-align:center">${pctCell(d1, s1)}</td>
        <td style="padding:8px 8px;text-align:center">${pctCell(d2, s2)}</td>
        <td style="padding:8px 8px;text-align:center">${pctCell(d3, s3)}</td>
        <td style="padding:8px 8px;text-align:center"><span style="font-size:13px;font-weight:700;color:${totalCol}">${pctTotal}%</span></td>
        <td style="padding:8px 10px">${igGoal ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;background:${igC.bg};color:${igC.txt}">${igGoal.toUpperCase()}</span>` : '<span style="color:var(--muted)">—</span>'}</td>
        <td style="padding:8px 10px;color:var(--muted)">${by}</td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap">
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cisOpenReport(${origIdx})">📊 Report</button>
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cisOpenGapReport(${origIdx})">🔍 Gaps</button>
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cisOpenPoam(${origIdx})">📋 POAM</button>
          <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="cisOpenAssessment(${origIdx})">View / Edit</button>
          <button class="btn btn-red btn-sm" onclick="cisDeleteAssessment(${origIdx})">Delete</button>
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
  const { score, answered, total, na: formNa, scoreable: formScoreable } = cisCalcScore(cisState.answers, scoreIg);
  const progress = cisIgProgress(cisState.answers);
  const runs = (orgAssessments[currentOrg.id] || {})['cis'] || [];
  const latestAssessor = cisState.editId
    ? ''
    : ([...runs].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0]?.conductedBy || '');
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
    const tScoreable = t.total - t.na;
    const pct = tScoreable > 0 ? Math.round((t.yes + t.partial * 0.5) / tScoreable * 100) : 0;
    const col = igColors[t.n];
    const isGoalTier = goal && `ig${t.n}` === goal;
    return `<div style="flex:1;min-width:110px">
      <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:3px">
        <span style="font-size:10px;font-weight:700;color:${inScope ? col : 'rgba(255,255,255,.25)'}">IG${t.n}</span>
        <span style="font-size:9px;color:${inScope ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.2)'}">+${t.total} safeguards${isGoalTier ? ' ← goal' : ''}</span>
        <span style="font-size:10px;color:${inScope ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.2)'};margin-left:auto">${t.answered - t.na}/${tScoreable}</span>
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
      ${!cisState.editId ? '<button class="btn btn-outline btn-sm" id="cisPrefillBtn" onclick="cisPrefillFromTS()" style="font-size:11px">&#8681; From Tech Stack</button>' : ''}
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
          ${!goal ? `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">Set goal →</div>` : `<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">${answered - formNa}/${formScoreable} answered</div>`}
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
              style="padding:5px 8px;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-family:Inter,sans-serif;font-size:12px;color-scheme:dark">
          </div>
          <div>
            <div style="font-size:9px;color:rgba(255,255,255,.4);margin-bottom:3px">Conducted by</div>
            <input type="text" id="cisConductedBy" placeholder="Assessor name" value="${escH(latestAssessor)}"
              style="padding:5px 8px;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-family:Inter,sans-serif;font-size:12px;width:150px" autocomplete="off">
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
            <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:4px">
              <span class="cis-sf-id">${s.sf}</span>
              <span class="ig-badge ig${s.ig}-badge" style="flex-shrink:0;margin-top:1px">IG${s.ig}</span>
              <span class="cis-sf-text" style="margin:0">${s.title}</span>
              ${goal && !inScope ? `<span style="font-size:9px;color:var(--muted);margin-left:auto;flex-shrink:0;padding:2px 6px;border-radius:4px;background:var(--bg)">outside goal</span>` : ''}
            </div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:5px">${cisHintBadges(s.sf)}</div>
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
              style="width:100%;box-sizing:border-box;margin-top:6px;padding:6px 8px;border-radius:6px;border:1.5px solid var(--border);font-family:Inter,sans-serif;font-size:12px;color:var(--text);resize:vertical;background:var(--bg)"
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
              style="padding:5px 8px;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-family:Inter,sans-serif;font-size:12px">
          </div>
          <div style="display:flex;flex-direction:column;gap:3px">
            <label style="font-size:9px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em">Conducted By</label>
            <input type="text" id="cisQuickConductedBy" placeholder="Assessor name" autocomplete="off"
              style="padding:5px 8px;border-radius:6px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-family:Inter,sans-serif;font-size:12px;width:140px">
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

  const inputSty = 'width:100%;padding:4px 6px;border-radius:5px;border:1px solid var(--border);font-family:Inter,sans-serif;font-size:11px;color:var(--text);background:#fff;box-sizing:border-box';

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
              <div style="font-weight:600;margin-bottom:3px">${escH(s.title)}</div>
              <div style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:${note?'3px':'0'}">${cisHintBadges(s.sf)}</div>
              ${note ? `<div style="font-size:10px;color:var(--muted);margin-top:2px;font-style:italic">&#x1F4DD; ${escH(note)}</div>` : ''}
              ${(() => { const grp = parseInt(s.sf); const policies = typeof plibForCisGroup !== 'undefined' ? plibForCisGroup(grp) : []; return policies.length ? `<div style="margin-top:4px;display:flex;gap:3px;flex-wrap:wrap">${policies.map(p => `<button onclick="plibOpenFromPoam('${p.id}')" style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:6px;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;cursor:pointer">&#x1F4C4; ${escH(p.name)}</button>`).join('')}</div>` : ''; })()}
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
    if (cisState.poamRun?.id) {
      const isBlank = !assigned && !targetDate && !decision && !rationale && status === 'open';
      out.push({
        assessment_id: cisState.poamRun.id,
        org_id:        currentOrg?.id,
        safeguard_id:  sf,
        assigned_to:   assigned,
        target_date:   targetDate,
        risk_decision: decision,
        risk_rationale: isBlank ? 'POAM not yet completed — assign owner, target date, and risk decision.' : rationale,
        status,
      });
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
    auditLog('poam_saved', 'poam', 'CIS POAM', { item_count: items.length });
    toast(`✓ POAM saved — ${items.length} item${items.length !== 1 ? 's' : ''}`, '#15803d');
    if (btn) { btn.disabled = false; btn.textContent = 'Save POAM'; }
    // Fire-and-forget: sync POAM items into risk register
    if (cisState.poamRun?.id && currentOrg?.id) {
      sb.riskRegister.sync(currentOrg.id, cisState.poamRun.id)
        .then(() => { if (typeof rrState !== 'undefined') rrState.orgId = null; })
        .catch(e => {
          console.error('Risk register sync failed:', e);
          toast('Risk Register sync failed: ' + e.message, '#dc2626');
        });
    }
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
    auditLog('assessment_deleted', 'assessment', 'CIS Controls v8', { date: run?.date || null });
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
  const runs = [...rawRuns].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  if (runs.length < 2) return;

  const W = canvas.offsetWidth || 200;
  const H = 82;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const n = runs.length;
  const padX = 6, padTop = 12, padBot = 13;
  const legendW = 34;
  const barMaxH = H - padTop - padBot;
  const sectionH = barMaxH / 3;
  const totalBarW = W - padX * 2 - legendW;
  const barW = Math.max(8, Math.floor((totalBarW - Math.max(2, n - 1) * 4) / n));
  const actualGap = n > 1 ? Math.floor((totalBarW - barW * n) / (n - 1)) : 0;

  // Lighter shades for dark navy background
  const tierColors = ['#4ade80', '#93c5fd', '#c4b5fd'];

  runs.forEach((r, i) => {
    const x = padX + i * (barW + actualGap);
    const cleanAns = Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_')));
    const prog = cisIgProgress(cleanAns);

    [0, 1, 2].forEach(ti => {
      const t = prog[ti];
      const sc = t.total - t.na;
      const score = sc > 0 ? (t.yes + t.partial * 0.5) / sc : 0;
      const segY = H - padBot - (ti + 1) * sectionH;

      // Track (background)
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fillRect(x, segY, barW, sectionH - 1);

      // Fill
      const fillH = score * (sectionH - 1);
      ctx.fillStyle = tierColors[ti];
      ctx.globalAlpha = 0.88;
      ctx.fillRect(x, segY + (sectionH - 1 - fillH), barW, fillH);
      ctx.globalAlpha = 1;
    });

    // Score label above bar
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = 'bold 8px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(r.score + '%', x + barW / 2, padTop - 1);

    // Date label below bar
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.font = '8px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((r.date || '').slice(5), x + barW / 2, H - 1);
  });

  // IG legend — top right
  const lgLabels = ['IG1', 'IG2', 'IG3'];
  ctx.textAlign = 'right';
  lgLabels.forEach((lbl, li) => {
    ctx.fillStyle = tierColors[li];
    ctx.globalAlpha = 0.88;
    ctx.fillRect(W - 28, 1 + li * 10, 7, 7);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '7px Inter,sans-serif';
    ctx.fillText(lbl, W - 3, 8 + li * 10);
  });
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
    auditLog(editId ? 'assessment_updated' : 'assessment_saved', 'assessment', 'CIS Controls v8', { score, goal });
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
            style="width:100%;padding:8px 10px;border:1.5px solid var(--border);border-radius:6px;font-family:Inter,sans-serif;font-size:13px;color:var(--text);box-sizing:border-box">
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

// ── GAP REPORT ────────────────────────────────────────────────────────────────

function cisOpenGapReport(idx) {
  const runs = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
  const run = runs[idx];
  if (!run) return;
  cisState.gapRun = run;
  cisState.view = 'gap';
  renderMain();
}

function cisGapPriority(ig, ans) {
  if (ig === 1 && ans === 'no')        return { label: 'Critical', col: '#dc2626', bg: '#fee2e2', order: 1 };
  if (ig === 1 && ans === 'partial')   return { label: 'High',     col: '#b45309', bg: '#fef3c7', order: 2 };
  if (ig === 1)                        return { label: 'High',     col: '#b45309', bg: '#fef3c7', order: 2 };
  if (ig === 2 && ans === 'no')        return { label: 'High',     col: '#b45309', bg: '#fef3c7', order: 2 };
  if (ig === 2 && ans === 'partial')   return { label: 'Medium',   col: '#0369a1', bg: '#e0f2fe', order: 3 };
  if (ig === 2)                        return { label: 'Medium',   col: '#0369a1', bg: '#e0f2fe', order: 3 };
  if (ig === 3 && ans === 'no')        return { label: 'Medium',   col: '#0369a1', bg: '#e0f2fe', order: 3 };
  return                                      { label: 'Low',      col: '#15803d', bg: '#dcfce7', order: 4 };
}

function cisGapGeneratePrompt(gaps, run, orgName, goal) {
  const lines = gaps.map(g =>
    `${g.sf} (IG${g.ig}, ${g.priority.label}): ${g.title} — ${g.ans === 'no' ? 'Not implemented' : g.ans === 'partial' ? 'Partially implemented' : 'Not assessed'}`
  ).join('\n');
  return `You are a cybersecurity advisor preparing a remediation roadmap for ${orgName}.

Assessment date: ${run.date || 'Unknown'}
CIS Controls v8 target level: ${goal ? goal.toUpperCase() : 'Not set'}
Conducted by: ${run.conductedBy || 'Unknown'}

The following safeguards are gaps (No, Partial, or Not Assessed) sorted by remediation priority:

${lines}

Please produce a concise remediation roadmap:
1. Group the Critical and High items into a 90-day sprint plan
2. Group Medium items into a 6-month plan
3. Group Low items into a 12-month plan
4. For each item, suggest a practical first step suited to a small-to-medium business
5. Identify any quick wins (low effort / high impact) that should be done immediately
6. Note any items that could be addressed together as a single project

Write in plain English suitable for a non-technical business owner.`;
}

function renderCISGapReport() {
  const run = cisState.gapRun;
  if (!run) return renderCISDashboard();

  const answers = Object.fromEntries(
    Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_'))
  );
  const goal  = (run.answers || {})._goal || null;
  const goalN = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 3;

  const igBg  = ['', '#dcfce7', '#dbeafe', '#ede9fe'];
  const igTxt = ['', '#15803d', '#1d4ed8', '#6d28d9'];

  // Build gap list: No, Partial, or unanswered within the IG scope
  const scope = CIS_SAFEGUARDS.filter(s => goal ? s.ig <= goalN : true);
  const gaps  = scope
    .filter(s => {
      const a = answers[s.sf];
      return !a || a === 'no' || a === 'partial';
    })
    .map(s => {
      const ans = answers[s.sf] || 'unanswered';
      return { ...s, ans, priority: cisGapPriority(s.ig, ans) };
    })
    .sort((a, b) => {
      if (a.ctrl !== b.ctrl) return a.ctrl - b.ctrl;
      return parseFloat(a.sf) - parseFloat(b.sf);
    });

  const critical = gaps.filter(g => g.priority.label === 'Critical').length;
  const high     = gaps.filter(g => g.priority.label === 'High').length;
  const medium   = gaps.filter(g => g.priority.label === 'Medium').length;
  const low      = gaps.filter(g => g.priority.label === 'Low').length;
  const noAns    = gaps.filter(g => g.ans === 'no').length;
  const partial  = gaps.filter(g => g.ans === 'partial').length;
  const unans    = gaps.filter(g => g.ans === 'unanswered').length;

  // Group by control for the table
  const byCtrl = {};
  gaps.forEach(g => {
    if (!byCtrl[g.ctrl]) byCtrl[g.ctrl] = { ctrl: g.ctrl, ctrlName: g.ctrlName, items: [] };
    byCtrl[g.ctrl].items.push(g);
  });

  const ansBadge = a =>
    a === 'no'         ? `<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:#fee2e2;color:#dc2626">No</span>`
    : a === 'partial'  ? `<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:#fef3c7;color:#b45309">Partial</span>`
                       : `<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:#f1f5f9;color:#5a6a8a">—</span>`;

  const priBadge = p =>
    `<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:${p.bg};color:${p.col}">${p.label}</span>`;

  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:700">🔍 CIS Gap Report</div>
      <div style="font-size:12px;color:var(--muted)">${escH(currentOrg.name)} · ${run.date || '—'}${run.conductedBy ? ' · ' + escH(run.conductedBy) : ''}${goal ? ' · Goal: ' + goal.toUpperCase() : ''}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="cisNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="cisGapCopyPrompt()">📋 Copy AI Prompt</button>
      <button class="btn btn-cyan btn-sm" onclick="cisOpenPoam(${(orgAssessments[currentOrg?.id] || {})['cis']?.indexOf(run) ?? -1})">Open POAM →</button>
    </div>
  </div>

  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem">
    ${[
      { label: 'Total Gaps',  val: gaps.length, col: 'var(--navy)' },
      { label: 'Critical',    val: critical,    col: '#dc2626'     },
      { label: 'High',        val: high,        col: '#b45309'     },
      { label: 'Medium',      val: medium,      col: '#0369a1'     },
      { label: 'Low',         val: low,         col: '#15803d'     },
      { label: 'No',          val: noAns,       col: '#dc2626'     },
      { label: 'Partial',     val: partial,     col: '#b45309'     },
      { label: 'Not Assessed',val: unans,       col: '#5a6a8a'     },
    ].map(s => `<div style="padding:8px 14px;border-radius:8px;background:var(--card);border:1px solid var(--border);text-align:center;min-width:72px">
      <div style="font-size:20px;font-weight:800;color:${s.col}">${s.val}</div>
      <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-top:1px">${s.label}</div>
    </div>`).join('')}
  </div>

  <div style="font-size:11px;color:var(--muted);margin-bottom:.75rem;padding:10px 14px;background:var(--card);border:1px solid var(--border);border-radius:8px">
    <strong style="color:var(--text)">Priority logic:</strong>&nbsp;
    IG1 gaps are highest priority (foundational baseline). No = stronger signal than Partial or Not Assessed.
    <span style="display:inline-flex;gap:6px;margin-left:8px;align-items:center">
      <span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:8px;background:#fee2e2;color:#dc2626">Critical</span> IG1 No ·
      <span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:8px;background:#fef3c7;color:#b45309">High</span> IG1 Partial/Unassessed · IG2 No ·
      <span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:8px;background:#e0f2fe;color:#0369a1">Medium</span> IG2 Partial/Unassessed · IG3 No ·
      <span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:8px;background:#dcfce7;color:#15803d">Low</span> IG3 Partial/Unassessed
    </span>
  </div>`;

  if (gaps.length === 0) {
    html += `<div class="card" style="text-align:center;padding:3rem 1rem">
      <div style="font-size:32px;margin-bottom:.75rem">🎉</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:4px">No gaps found</div>
      <div style="font-size:12px;color:var(--muted)">All in-scope safeguards are answered Yes or N/A for this assessment.</div>
    </div>`;
  } else {
    Object.values(byCtrl).forEach(group => {
      html += `
      <div class="card" style="margin-bottom:.75rem;padding:0;overflow:hidden">
        <div style="padding:10px 16px;background:linear-gradient(135deg,var(--navy),var(--navy2));display:flex;align-items:center;gap:10px">
          <span style="font-size:13px;font-weight:700;color:#fff">CIS ${group.ctrl}: ${escH(group.ctrlName)}</span>
          <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:rgba(255,255,255,.15);color:rgba(255,255,255,.8);margin-left:auto">${group.items.length} gap${group.items.length !== 1 ? 's' : ''}</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="border-bottom:1px solid var(--border);background:#f8fafc">
              <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;width:54px">ID</th>
              <th style="padding:7px 6px;text-align:center;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;width:44px">IG</th>
              <th style="padding:7px 6px;text-align:center;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;width:44px">Ans</th>
              <th style="padding:7px 6px;text-align:center;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;width:80px">Priority</th>
              <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Safeguard</th>
              <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Description</th>
            </tr>
          </thead>
          <tbody>
            ${group.items.map(g => {
              const rowBg = g.priority.label === 'Critical' ? 'background:rgba(220,38,38,.02)' :
                            g.priority.label === 'High'     ? 'background:rgba(180,83,9,.02)'   : '';
              return `<tr style="border-bottom:1px solid var(--border);${rowBg}">
                <td style="padding:8px 10px;font-weight:700;color:var(--navy);white-space:nowrap;vertical-align:top">${g.sf}</td>
                <td style="padding:8px 6px;text-align:center;vertical-align:top"><span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;background:${igBg[g.ig]};color:${igTxt[g.ig]}">IG${g.ig}</span></td>
                <td style="padding:8px 6px;text-align:center;vertical-align:top">${ansBadge(g.ans)}</td>
                <td style="padding:8px 6px;text-align:center;vertical-align:top">${priBadge(g.priority)}</td>
                <td style="padding:8px 10px;vertical-align:top;max-width:220px">
                  <div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:4px">${escH(g.title)}</div>
                  <div style="display:flex;gap:3px;flex-wrap:wrap">${cisHintBadges(g.sf)}</div>
                </td>
                <td style="padding:8px 10px;font-size:11px;color:var(--muted);vertical-align:top;line-height:1.4">${escH(g.sub)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
    });

    html += `
    <div style="margin-top:.75rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <span style="font-size:11px;color:var(--muted)">${gaps.length} gap${gaps.length !== 1 ? 's' : ''} across ${Object.keys(byCtrl).length} control group${Object.keys(byCtrl).length !== 1 ? 's' : ''}</span>
      <button class="btn btn-outline btn-sm" onclick="cisNavToDashboard()">← Back</button>
      <button class="btn btn-outline btn-sm" onclick="cisGapCopyPrompt()">📋 Copy AI Prompt</button>
      <button class="btn btn-cyan btn-sm" onclick="cisOpenPoam(${(orgAssessments[currentOrg?.id] || {})['cis']?.indexOf(run) ?? -1})">Open POAM →</button>
    </div>`;
  }

  return html;
}

function cisGapCopyPrompt() {
  const run = cisState.gapRun;
  if (!run) return;
  const answers = Object.fromEntries(
    Object.entries(run.answers || {}).filter(([k]) => !k.startsWith('_'))
  );
  const goal  = (run.answers || {})._goal || null;
  const goalN = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 3;
  const scope = CIS_SAFEGUARDS.filter(s => goal ? s.ig <= goalN : true);
  const gaps  = scope
    .filter(s => { const a = answers[s.sf]; return !a || a === 'no' || a === 'partial'; })
    .map(s => { const ans = answers[s.sf] || 'unanswered'; return { ...s, ans, priority: cisGapPriority(s.ig, ans) }; })
    .sort((a, b) => a.priority.order - b.priority.order || a.ctrl - b.ctrl || parseFloat(a.sf) - parseFloat(b.sf));
  const prompt = cisGapGeneratePrompt(gaps, run, currentOrg?.name || 'the organisation', goal);
  navigator.clipboard.writeText(prompt).then(
    () => toast('✓ Remediation roadmap prompt copied', '#15803d'),
    () => toast('Clipboard failed — try a different browser', '#dc2626')
  );
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
  const { score, yes: yesN, partial: partN, na: naN, answered, total, scoreable } = cisCalcScore(answers, goal);
  const scopedSfs = cisGetSafeguards(goal);
  const noN        = scopedSfs.filter(s => answers[s.sf] === 'no').length;
  const unanswered = scopedSfs.filter(s => !answers[s.sf]).length;
  const fullImpl   = scoreable > 0 ? Math.round(yesN / scoreable * 100) : 0;

  const band    = score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk';
  const bandCol = score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : score >= 40 ? '#ea580c' : '#dc2626';
  const fiCol   = fullImpl >= 70 ? '#15803d' : fullImpl >= 40 ? '#b45309' : '#dc2626';

  const runs = (orgAssessments[currentOrg.id] || {})['cis'] || [];
  const commentary = cisState.reportCommentary || '';
  const topGaps = scopedSfs.filter(s => answers[s.sf] === 'no');

  // Stacked bar proportions (out of all scoped safeguards)
  const barBase = scopedSfs.length;
  const yesPct  = barBase > 0 ? (yesN  / barBase * 100).toFixed(1) : 0;
  const partPct = barBase > 0 ? (partN / barBase * 100).toFixed(1) : 0;
  const noPct   = barBase > 0 ? (noN   / barBase * 100).toFixed(1) : 0;
  const naPct   = barBase > 0 ? (naN   / barBase * 100).toFixed(1) : 0;
  const unPct   = barBase > 0 ? (unanswered / barBase * 100).toFixed(1) : 0;

  return `
  ${renderTierBanner()}

  <!-- Header -->
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

  <!-- Score strip -->
  <div class="card" style="padding:.65rem 1.1rem;margin-bottom:1rem;display:flex;align-items:center;gap:0;flex-wrap:wrap">
    ${[
      { count: yesN,       label: 'Implemented', color: '#15803d' },
      { count: partN,      label: 'Partial',     color: '#d97706' },
      { count: noN,        label: 'Not Done',    color: '#dc2626' },
      { count: naN,        label: 'N/A',         color: '#94a3b8' },
      { count: unanswered, label: 'Unanswered',  color: '#d1d5db' },
    ].map(item => `
      <div style="display:flex;align-items:center;gap:6px;padding:4px 14px;border-right:1px solid var(--border);flex-shrink:0">
        <div style="width:8px;height:8px;border-radius:2px;background:${item.color}"></div>
        <div>
          <div style="font-size:16px;font-weight:700;color:${item.color};line-height:1;font-family:monospace">${item.count}</div>
          <div style="font-size:9px;color:var(--muted)">${item.label}</div>
        </div>
      </div>`).join('')}
    <div style="flex:1;min-width:140px;padding:4px 14px;border-right:1px solid var(--border)">
      <div style="font-size:9px;color:var(--muted);margin-bottom:3px;font-family:monospace">IG${goalN} COVERAGE</div>
      <div style="height:6px;background:var(--bg);border-radius:3px;overflow:hidden;display:flex">
        <div style="width:${yesPct}%;background:#15803d"></div>
        <div style="width:${partPct}%;background:#d97706"></div>
        <div style="width:${noPct}%;background:#dc2626"></div>
        <div style="width:${naPct}%;background:#cbd5e1"></div>
        <div style="width:${unPct}%;background:#f1f5f9"></div>
      </div>
    </div>
    <div style="padding:4px 14px;border-right:1px solid var(--border);flex-shrink:0;text-align:center">
      <div style="font-size:9px;color:var(--muted)">Maturity Score</div>
      <div style="font-size:20px;font-weight:800;color:${bandCol};font-family:monospace;line-height:1.1">${score}%</div>
      <div style="font-size:9px;color:var(--muted)">yes + partial credit</div>
    </div>
    <div style="padding:4px 14px;flex-shrink:0;text-align:center">
      <div style="font-size:9px;color:var(--muted)">Fully Implemented</div>
      <div style="font-size:20px;font-weight:800;color:${fiCol};font-family:monospace;line-height:1.1">${fullImpl}%</div>
      <div style="font-size:9px;color:var(--muted)">yes answers only</div>
    </div>
  </div>

  <!-- Row 1: Score breakdown + IG Coverage -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">

    <div class="card" style="padding:1.1rem">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Score Breakdown</div>
      <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:2px">
        <span style="font-size:38px;font-weight:800;color:${bandCol};font-family:monospace;line-height:1">${score}%</span>
        <span style="font-size:13px;font-weight:700;color:${bandCol}">${band}</span>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:10px">Maturity — partial safeguards earn 50% credit</div>
      <div style="height:10px;background:var(--bg);border-radius:5px;overflow:hidden;display:flex;margin-bottom:8px">
        <div style="width:${yesPct}%;background:#15803d"></div>
        <div style="width:${partPct}%;background:#d97706"></div>
        <div style="width:${noPct}%;background:#dc2626"></div>
        <div style="width:${naPct}%;background:#cbd5e1"></div>
        <div style="width:${unPct}%;background:#f1f5f9"></div>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px">
        ${[
          { label:'Yes', count:yesN, color:'#15803d' },
          { label:'Partial', count:partN, color:'#d97706' },
          { label:'No', count:noN, color:'#dc2626' },
          { label:'N/A', count:naN, color:'#94a3b8' },
        ].map(x => `<div style="display:flex;align-items:center;gap:4px">
          <div style="width:8px;height:8px;border-radius:2px;background:${x.color}"></div>
          <span style="font-size:12px;font-weight:700;color:${x.color}">${x.count}</span>
          <span style="font-size:10px;color:var(--muted)">${x.label}</span>
        </div>`).join('')}
      </div>
      <div style="padding:10px 12px;background:var(--bg);border-radius:7px;border-left:3px solid ${fiCol}">
        <div style="font-size:10px;color:var(--muted);margin-bottom:2px">Fully Implemented — yes answers only, no partial credit</div>
        <div style="display:flex;align-items:baseline;gap:6px">
          <span style="font-size:26px;font-weight:800;color:${fiCol};font-family:monospace;line-height:1">${fullImpl}%</span>
          <span style="font-size:11px;color:var(--muted)">${yesN} of ${scoreable} applicable safeguards complete</span>
        </div>
      </div>
    </div>

    <div class="card" style="padding:1.1rem">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">IG Tier Coverage</div>
      ${[1,2,3].map(n => {
        const sfs = CIS_SAFEGUARDS.filter(s => s.ig === n);
        const inSc = n <= goalN;
        const y = sfs.filter(s => answers[s.sf] === 'yes').length;
        const p = sfs.filter(s => answers[s.sf] === 'partial').length;
        const naT = sfs.filter(s => answers[s.sf] === 'na').length;
        const sc = sfs.length - naT;
        const pct = sc > 0 ? Math.round((y + p * 0.5) / sc * 100) : 0;
        const col = n === 1 ? '#15803d' : n === 2 ? '#1d4ed8' : '#6d28d9';
        const pctY = sc > 0 ? (y / sc * 100).toFixed(1) : 0;
        const pctP = sc > 0 ? (p / sc * 100).toFixed(1) : 0;
        return `<div style="margin-bottom:14px;${inSc ? '' : 'opacity:.32'}">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;align-items:baseline">
            <span style="font-size:12px;font-weight:700;color:${col}">IG${n}${inSc ? '' : ' — out of scope'}</span>
            <span style="font-size:14px;font-weight:800;color:${col};font-family:monospace">${pct}%</span>
          </div>
          <div style="height:8px;background:var(--bg);border-radius:4px;overflow:hidden;display:flex">
            <div style="width:${pctY}%;background:${col}"></div>
            <div style="width:${pctP}%;background:${col};opacity:.45"></div>
          </div>
          <div style="font-size:10px;color:var(--muted);margin-top:3px">${y} yes · ${p} partial · ${naT} n/a · ${sfs.length} safeguards in tier</div>
        </div>`;
      }).join('')}
      ${runs.length >= 2
        ? `<div style="margin-top:6px;padding-top:10px;border-top:1px solid var(--border)">
            <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">Score Trend</div>
            <canvas id="cisReportTrend" style="width:100%;display:block"></canvas>
           </div>`
        : ''}
    </div>

  </div>

  <!-- Maturity Radar -->
  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:6px">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--text)">🎯 Maturity Radar — CIS Controls 1–18</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">Score per control · green = implemented · amber = partial · red = gap · grey = out of IG${goalN} scope</div>
      </div>
    </div>
    <canvas id="cisReportRadar" width="700" height="400" style="width:100%;max-width:700px;display:block;margin:0 auto"></canvas>
  </div>

  <!-- Controls Accordion -->
  ${cisReportBuildAccordion(answers, goalN)}

  <!-- Priority Gaps -->
  ${topGaps.length ? `
  <div class="card" style="padding:1.1rem;margin-bottom:1rem">
    <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">
      Priority Gaps — Not Implemented (${noN} total)
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <tbody>
        ${topGaps.slice(0, 15).map(s => `
          <tr style="border-bottom:1px solid var(--border)">
            <td style="padding:6px 10px;font-weight:700;color:var(--navy);white-space:nowrap;width:48px">${s.sf}</td>
            <td style="padding:6px 6px;width:38px"><span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:8px;background:${['','#dcfce7','#dbeafe','#ede9fe'][s.ig]};color:${['','#15803d','#1d4ed8','#6d28d9'][s.ig]}">IG${s.ig}</span></td>
            <td style="padding:6px 10px;color:var(--text)">${escH(s.title)}</td>
            <td style="padding:6px 10px;color:var(--muted);font-size:11px;white-space:nowrap">C${s.ctrl}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    ${noN > 15 ? `<div style="font-size:11px;color:var(--muted);padding:8px 10px">+ ${noN - 15} more — open the Gap Report for the full list</div>` : ''}
  </div>` : `
  <div class="card" style="padding:1.1rem;margin-bottom:1rem;text-align:center;color:#15803d">
    <div style="font-size:18px;margin-bottom:4px">✅</div>
    <div style="font-size:13px;font-weight:700">No gaps — all scoped safeguards are Yes or Partial</div>
  </div>`}

  <!-- Commentary -->
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
      style="width:100%;box-sizing:border-box;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border);font-family:Inter,sans-serif;font-size:13px;color:var(--text);resize:vertical;line-height:1.7"
    >${escH(commentary)}</textarea>
    <div style="font-size:10px;color:var(--muted);margin-top:6px">
      💡 <strong>Generate AI Prompt</strong> copies a pre-filled prompt to your clipboard. Paste into Claude → get polished commentary → paste back above → Save.
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
  const goalN = { ig1: 1, ig2: 2, ig3: 3 }[goal] || 3;
  cisDrawRadar('cisReportRadar', answers, goalN);
  const runs = (orgAssessments[currentOrg?.id] || {})['cis'] || [];
  if (runs.length >= 2) cisDrawReportTrend('cisReportTrend', runs);
}

// ── REPORT ACCORDION ──────────────────────────────────────────────────────────

// Short display names for each CIS control number (used in accordion column headers and radar)
const CIS_CTRL_SHORT = {
  1:'Assets', 2:'Software', 3:'Data', 4:'Config',
  5:'Accounts', 6:'Access',
  7:'Vulns', 10:'Malware',
  8:'Logging', 9:'Email/Web', 12:'Network', 13:'Monitor',
  11:'Recovery', 17:'IR',
  14:'Awareness', 15:'Vendors', 16:'App Sec', 18:'Pen Test',
};

function cisReportBuildAccordion(answers, goalN) {
  const byCtrl = {};
  CIS_SAFEGUARDS.forEach(s => {
    if (!byCtrl[s.ctrl]) byCtrl[s.ctrl] = { name: s.ctrlName, safeguards: [] };
    byCtrl[s.ctrl].safeguards.push(s);
  });

  function sfSt(sf) {
    const a = answers[sf];
    if (a === 'yes')     return { color:'#15803d', bg:'#dcfce7', label:'Yes' };
    if (a === 'partial') return { color:'#d97706', bg:'#fef3c7', label:'Partial' };
    if (a === 'no')      return { color:'#dc2626', bg:'#fee2e2', label:'No' };
    if (a === 'na')      return { color:'#94a3b8', bg:'#f1f5f9', label:'N/A' };
    return { color:'#d1d5db', bg:'#f9fafb', label:'—' };
  }

  function ctrlPct(cn) {
    const sfs = (byCtrl[cn]?.safeguards || []).filter(s => s.ig <= goalN);
    const yes = sfs.filter(s => answers[s.sf] === 'yes').length;
    const part = sfs.filter(s => answers[s.sf] === 'partial').length;
    const na = sfs.filter(s => answers[s.sf] === 'na').length;
    const sc = sfs.length - na;
    return sc > 0 ? Math.round((yes + part * 0.5) / sc * 100) : null;
  }

  const igColors = { 1:'#15803d', 2:'#1d4ed8', 3:'#6d28d9' };
  const igBgs    = { 1:'#dcfce7', 2:'#dbeafe', 3:'#ede9fe' };

  let html = `<div class="card" style="padding:0;overflow:hidden;margin-bottom:1rem">
    <div style="padding:.75rem 1.1rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
      <div style="font-size:13px;font-weight:700;color:var(--text)">🛡️ CIS Controls Detail</div>
      <button class="btn btn-outline btn-sm" id="cisAccExpandBtn" onclick="cisReportExpandAll()">Expand All</button>
    </div>`;

  CIS_REPORT_LAYERS.forEach(layer => {
    const inScopeSfs = layer.controls.flatMap(cn => (byCtrl[cn]?.safeguards || []).filter(s => s.ig <= goalN));
    const yes  = inScopeSfs.filter(s => answers[s.sf] === 'yes').length;
    const part = inScopeSfs.filter(s => answers[s.sf] === 'partial').length;
    const naC  = inScopeSfs.filter(s => answers[s.sf] === 'na').length;
    const sc   = inScopeSfs.length - naC;
    const pct  = sc > 0 ? Math.round((yes + part * 0.5) / sc * 100) : 0;
    const pctCol = pct >= 75 ? '#15803d' : pct >= 50 ? '#b45309' : '#dc2626';

    // Per-control-group column dots
    const groupCols = layer.controls.map(cn => {
      const ctrl = byCtrl[cn];
      if (!ctrl) return '';
      const sfs = ctrl.safeguards;
      const inSc = sfs.filter(s => s.ig <= goalN);
      const oos  = sfs.filter(s => s.ig > goalN);
      const cp   = ctrlPct(cn);
      const cpCol = cp === null ? '#94a3b8' : cp >= 75 ? '#15803d' : cp >= 50 ? '#b45309' : '#dc2626';
      const dots  = inSc.map(s => {
        const st = sfSt(s.sf);
        return `<span style="display:inline-block;width:11px;height:11px;border-radius:2px;background:${st.color};margin:1px" title="${s.sf} — ${st.label}"></span>`;
      }).join('') + oos.map(s =>
        `<span style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#e5e7eb;margin:1px;opacity:.4" title="${s.sf} — out of scope"></span>`
      ).join('');
      return `<div style="flex:1;min-width:0;padding:7px 10px;border-right:1px solid var(--border);display:flex;flex-direction:column;gap:4px">
        <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${CIS_CTRL_SHORT[cn] || 'CIS '+cn}</div>
        <div style="font-size:8px;color:var(--muted);font-family:monospace">CIS ${cn}</div>
        <div style="display:flex;flex-wrap:wrap;gap:1px">${dots}</div>
        <div style="font-size:10px;font-weight:700;color:${cpCol};font-family:monospace">${cp !== null ? cp + '%' : '—'}</div>
      </div>`;
    }).join('');

    html += `<div style="border-bottom:1px solid var(--border)">
      <div style="display:flex;align-items:stretch;cursor:pointer;user-select:none" onclick="cisReportToggleLayer('${layer.id}')">
        <!-- Left label column -->
        <div style="width:130px;flex-shrink:0;display:flex;flex-direction:column;justify-content:center;padding:8px 10px;border-right:1px solid var(--border);gap:2px">
          <div style="width:3px;height:14px;border-radius:2px;background:${layer.color};margin-bottom:2px"></div>
          <div style="font-size:11px;font-weight:700;color:${layer.color};text-transform:uppercase;letter-spacing:.06em;line-height:1.1">${layer.label}</div>
          <div style="font-size:10px;color:var(--muted);line-height:1.3">${layer.sub}</div>
          <div style="font-size:12px;font-weight:800;color:${pctCol};font-family:monospace;margin-top:3px">${pct}%</div>
        </div>
        <!-- Group columns -->
        <div style="flex:1;display:flex;min-width:0;overflow:hidden">
          ${groupCols}
        </div>
        <!-- Chevron -->
        <div style="width:28px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--border)">
          <span id="cisAccChev-${layer.id}" style="font-size:13px;color:var(--muted);transition:transform .2s">›</span>
        </div>
      </div>
      <!-- Expanded panel -->
      <div id="cisAccPanel-${layer.id}" style="display:none;border-top:1px solid var(--border)">
        <div style="display:flex;gap:0">
          ${layer.controls.map(cn => {
            const ctrl = byCtrl[cn];
            if (!ctrl || !ctrl.safeguards.length) return '';
            return `<div style="flex:1;min-width:220px;padding:10px 12px;border-right:1px solid var(--border)">
              <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid var(--border)">CIS ${cn} — ${escH(ctrl.name)}</div>
              <div style="display:flex;flex-direction:column;gap:3px">
                ${ctrl.safeguards.map(s => {
                  const oos = s.ig > goalN;
                  const st  = sfSt(s.sf);
                  return `<div style="display:flex;align-items:center;gap:5px;padding:4px 6px;border-radius:4px;background:var(--bg);${oos ? 'opacity:.28' : ''}">
                    <div style="width:3px;align-self:stretch;border-radius:2px;background:${st.color};flex-shrink:0;min-height:18px"></div>
                    <div style="flex:1;min-width:0">
                      <div style="font-size:9px;color:var(--muted);font-family:monospace;line-height:1">${s.sf}</div>
                      <div style="font-size:11px;font-weight:600;color:var(--text);line-height:1.3;margin-top:1px">${escH(s.title)}</div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex-shrink:0">
                      <span style="font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;background:${igBgs[s.ig]||'#f1f5f9'};color:${igColors[s.ig]||'#6b7280'}">IG${s.ig}</span>
                      <span style="font-size:9px;font-weight:700;padding:1px 4px;border-radius:3px;background:${st.bg};color:${st.color}">${st.label}</span>
                    </div>
                  </div>`;
                }).join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  });

  html += `</div>`;
  return html;
}

function cisReportToggleLayer(id) {
  const panel = document.getElementById('cisAccPanel-' + id);
  const chev  = document.getElementById('cisAccChev-' + id);
  if (!panel) return;
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  if (chev) chev.style.transform = isOpen ? '' : 'rotate(90deg)';
}

function cisReportExpandAll() {
  const btn    = document.getElementById('cisAccExpandBtn');
  const panels = document.querySelectorAll('[id^="cisAccPanel-rfl"]');
  const chevs  = document.querySelectorAll('[id^="cisAccChev-rfl"]');
  const anyOpen = Array.from(panels).some(p => p.style.display !== 'none');
  panels.forEach(p => { p.style.display = anyOpen ? 'none' : 'block'; });
  chevs.forEach(c  => { c.style.transform = anyOpen ? '' : 'rotate(90deg)'; });
  if (btn) btn.textContent = anyOpen ? 'Expand All' : 'Collapse All';
}

function cisDrawRadar(canvasId, answers, goalN) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const N = 18;
  const cx = W / 2, cy = H / 2 + 10;
  const R = Math.min(W, H) * 0.34;
  const labelPad = 46;

  // Compute score (0–1) for each CIS control 1–18
  const scores = [];
  for (let i = 1; i <= 18; i++) {
    const sfs = CIS_SAFEGUARDS.filter(s => s.ctrl === i);
    const inSc = sfs.filter(s => s.ig <= goalN);
    if (!inSc.length) { scores.push(null); continue; }
    const yes  = inSc.filter(s => answers[s.sf] === 'yes').length;
    const part = inSc.filter(s => answers[s.sf] === 'partial').length;
    const na   = inSc.filter(s => answers[s.sf] === 'na').length;
    const sc   = inSc.length - na;
    scores.push(sc > 0 ? (yes + part * 0.5) / sc : 0);
  }

  function angle(i) { return (Math.PI * 2 * i / N) - Math.PI / 2; }
  function pt(i, val) {
    const r = (val ?? 0) * R;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  }
  function ptR(i, r) { return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))]; }

  // Grid rings at 25/50/75/100%
  const ringColors = ['#f3f4f6','#e5e7eb','#d1d5db','#9ca3af'];
  [0.25, 0.5, 0.75, 1].forEach((level, li) => {
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const p = ptR(i, level * R);
      i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
    }
    ctx.closePath();
    ctx.strokeStyle = level === 1 ? '#9ca3af' : '#e5e7eb';
    ctx.lineWidth = level === 1 ? 1.5 : 0.8;
    if (level === 1) { ctx.setLineDash([4, 3]); }
    ctx.stroke();
    ctx.setLineDash([]);
    // ring label
    if (level < 1) {
      const lp = ptR(0, level * R - 2);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(level * 100) + '%', lp[0] + 12, lp[1] + 3);
    }
  });

  // Spokes
  for (let i = 0; i < N; i++) {
    const op = ptR(i, R);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(op[0], op[1]);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Score polygon fill
  ctx.beginPath();
  scores.forEach((s, i) => {
    const p = pt(i, s ?? 0);
    i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(21,128,61,0.12)';
  ctx.fill();
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Score dots — coloured by dominant status in that control
  scores.forEach((s, i) => {
    if (s === null) return;
    const sfs = CIS_SAFEGUARDS.filter(sf => sf.ctrl === i + 1 && sf.ig <= goalN);
    const yes  = sfs.filter(sf => answers[sf.sf] === 'yes').length;
    const part = sfs.filter(sf => answers[sf.sf] === 'partial').length;
    const no   = sfs.filter(sf => answers[sf.sf] === 'no').length;
    const dotCol = yes >= part && yes >= no ? '#15803d'
      : part >= no ? '#d97706' : '#dc2626';
    const p = pt(i, s);
    ctx.beginPath();
    ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
    ctx.fillStyle = dotCol;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Spoke labels
  const labels = [
    'Assets','Software','Data','Config',
    'Accounts','Access',
    'Vulns','Logging',
    'Email/Web','Malware','Recovery','Network',
    'Monitor','Awareness','Vendors','App Sec','IR','Pen Test',
  ];
  ctx.setLineDash([]);
  for (let i = 0; i < N; i++) {
    const ang = angle(i);
    const lp  = [cx + (R + labelPad) * Math.cos(ang), cy + (R + labelPad) * Math.sin(ang)];
    const xOff = Math.cos(ang);
    ctx.textAlign = xOff > 0.15 ? 'left' : xOff < -0.15 ? 'right' : 'center';
    // CIS number
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('CIS ' + (i + 1), lp[0], lp[1] - 5);
    // Control name
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#1a2340';
    ctx.fillText(labels[i], lp[0], lp[1] + 7);
    // Score %
    if (scores[i] !== null) {
      const pct = Math.round(scores[i] * 100);
      const col = pct >= 75 ? '#15803d' : pct >= 50 ? '#d97706' : '#dc2626';
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = col;
      ctx.fillText(pct + '%', lp[0], lp[1] + 19);
    }
  }

  // Centre label
  ctx.textAlign = 'center';
  ctx.font = 'bold 18px monospace';
  const overall = scores.filter(s => s !== null);
  const avg = overall.length ? Math.round(overall.reduce((a, b) => a + b, 0) / overall.length * 100) : 0;
  const avgCol = avg >= 75 ? '#15803d' : avg >= 50 ? '#d97706' : '#dc2626';
  ctx.fillStyle = avgCol;
  ctx.fillText(avg + '%', cx, cy - 6);
  ctx.font = '11px Inter, sans-serif';
  ctx.fillStyle = '#5a6a8a';
  ctx.fillText('IG' + goalN + ' avg', cx, cy + 10);
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
  ctx.font = `bold ${Math.round(r * 0.38)}px Inter, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(score + '%', cx, cy - r * 0.26);

  // Band label
  const band = bandOverride || (score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Elevated' : 'High Risk');
  ctx.fillStyle = '#5a6a8a';
  ctx.font = `bold ${Math.round(r * 0.15)}px Inter, sans-serif`;
  ctx.fillText(band, cx, cy - r * 0.02);

  // 0 / 100 axis labels
  ctx.font = `${Math.round(r * 0.13)}px Inter, sans-serif`; ctx.fillStyle = '#94a3b8';
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
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${seg.label} (${seg.value})`, lx + 12, legY + 8);
  });
}

function cisDrawReportTrend(canvasId, runs) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const sorted = [...runs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const W = canvas.offsetWidth || 340;
  const H = 92;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const n = sorted.length;
  const padX = 10, padTop = 14, padBot = 14;
  const legendW = 36;
  const barMaxH = H - padTop - padBot;
  const sectionH = barMaxH / 3;
  const totalBarW = W - padX * 2 - legendW;
  const barW = Math.max(14, Math.floor((totalBarW - Math.max(4, n - 1) * 6) / n));
  const actualGap = n > 1 ? Math.floor((totalBarW - barW * n) / (n - 1)) : 0;

  const tierColors = ['#15803d', '#1d4ed8', '#6d28d9'];
  const tierLabels = ['IG1', 'IG2', 'IG3'];

  sorted.forEach((r, i) => {
    const x = padX + i * (barW + actualGap);
    const cleanAns = Object.fromEntries(Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_')));
    const prog = cisIgProgress(cleanAns);

    [0, 1, 2].forEach(ti => {
      const t = prog[ti];
      const sc = t.total - t.na;
      const score = sc > 0 ? (t.yes + t.partial * 0.5) / sc : 0;
      const segY = H - padBot - (ti + 1) * sectionH;

      // Track
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(x, segY, barW, sectionH - 1);

      // Fill
      const fillH = score * (sectionH - 1);
      ctx.fillStyle = tierColors[ti];
      ctx.globalAlpha = 0.88;
      ctx.fillRect(x, segY + (sectionH - 1 - fillH), barW, fillH);
      ctx.globalAlpha = 1;
    });

    // Overall score label above bar
    const col = r.score >= 75 ? '#15803d' : r.score >= 50 ? '#b45309' : '#dc2626';
    ctx.fillStyle = col;
    ctx.font = 'bold 9px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(r.score + '%', x + barW / 2, padTop - 2);

    // Date label below bar
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((r.date || '').slice(5), x + barW / 2, H - 1);
  });

  // IG legend — top right
  ctx.textAlign = 'right';
  tierLabels.forEach((lbl, li) => {
    ctx.fillStyle = tierColors[li];
    ctx.globalAlpha = 0.88;
    ctx.fillRect(W - 30, 1 + li * 11, 8, 8);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#6b7280';
    ctx.font = '8px Inter,sans-serif';
    ctx.fillText(lbl, W - 4, 9 + li * 11);
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
  const { score, yes: yesN, partial: partN, answered, total, scoreable: sc } = cisCalcScore(answers, goal);
  const noN      = cisGetSafeguards(goal).filter(s => answers[s.sf] === 'no').length;
  const fullImpl = sc > 0 ? Math.round(yesN / sc * 100) : 0;
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
