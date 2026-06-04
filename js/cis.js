const CIS_SAFEGUARDS = [
  // ──── Control 1: Inventory & Control of Enterprise Assets ────
  { ctrl: 1, ctrlName: 'Inventory & Control of Enterprise Assets', sf: '1.1', ig: 1,
    title: 'Establish & Maintain an Enterprise Asset Inventory',
    sub: 'Maintain an accurate, detailed inventory of all enterprise assets with the potential to store or process data. Include end-user devices, network devices, non-computing/IoT devices, and servers.' },
  { ctrl: 1, ctrlName: 'Inventory & Control of Enterprise Assets', sf: '1.2', ig: 1,
    title: 'Address Unauthorised Assets',
    sub: 'Ensure that a process exists to address unauthorised assets on a weekly basis. The enterprise may choose to remove the asset from the network, deny the asset from connecting remotely, or quarantine the asset.' },
  { ctrl: 1, ctrlName: 'Inventory & Control of Enterprise Assets', sf: '1.3', ig: 2,
    title: 'Utilise an Active Discovery Tool',
    sub: `Utilise an active discovery tool to identify assets connected to the enterprise's network. Review and use scans to update the asset inventory at least quarterly, or more frequently.` },
  // ──── Control 2: Inventory & Control of Software Assets ────
  { ctrl: 2, ctrlName: 'Inventory & Control of Software Assets', sf: '2.1', ig: 1,
    title: 'Establish & Maintain a Software Inventory',
    sub: 'Establish and maintain a detailed inventory of all licensed software installed on enterprise assets. Include title, publisher, initial install/use date, and business purpose.' },
  { ctrl: 2, ctrlName: 'Inventory & Control of Software Assets', sf: '2.2', ig: 1,
    title: 'Ensure Authorised Software is Currently Supported',
    sub: 'Ensure that only currently supported software is designated as authorised in the software inventory. Review the software list to verify software support at least monthly, or more frequently.' },
  { ctrl: 2, ctrlName: 'Inventory & Control of Software Assets', sf: '2.3', ig: 2,
    title: 'Address Unauthorised Software',
    sub: 'Ensure that unauthorised software is either removed from use on enterprise assets or receives a documented exception. Review monthly, or more frequently.' },
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
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.11', ig: 2,
    title: 'Encrypt Sensitive Data at Rest',
    sub: 'Encrypt sensitive data at rest on servers, applications, and databases containing sensitive data. Storage-layer encryption, also known as server-side encryption, meets the minimum requirement of this safeguard.' },
  { ctrl: 3, ctrlName: 'Data Protection', sf: '3.14', ig: 3,
    title: 'Log Sensitive Data Access',
    sub: 'Log sensitive data access, including modification and disposal. Conduct this logging throughout the life of the data. Review logs periodically.' },
  // ──── Control 4: Secure Configuration ────
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.1', ig: 1,
    title: 'Establish & Maintain a Secure Configuration Process',
    sub: 'Establish and maintain a secure configuration process for enterprise assets (end-user devices, servers, network devices) and software. Review and update documentation annually, or when significant enterprise changes occur.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.2', ig: 1,
    title: 'Establish & Maintain a Secure Configuration Process for Network Infrastructure',
    sub: 'Establish and maintain a secure configuration process for network devices. Review and update documentation annually, or when significant enterprise changes occur that could impact this safeguard.' },
  { ctrl: 4, ctrlName: 'Secure Configuration of Enterprise Assets & Software', sf: '4.7', ig: 2,
    title: 'Manage Default Accounts on Enterprise Assets & Software',
    sub: 'Manage default accounts on enterprise assets and software, such as root, administrator, and other pre-configured vendor accounts. Example implementations can include disabling default accounts or making them unusable.' },
  // ──── Control 5: Account Management ────
  { ctrl: 5, ctrlName: 'Account Management', sf: '5.1', ig: 1,
    title: 'Establish & Maintain an Inventory of Accounts',
    sub: 'Establish and maintain an inventory of all accounts managed in the enterprise. The inventory must include both user and administrator accounts. Validate that all active accounts are authorised, on a recurring basis.' },
  { ctrl: 5, ctrlName: 'Account Management', sf: '5.2', ig: 1,
    title: 'Use Unique Passwords',
    sub: 'Use unique passwords for all enterprise assets. Best practice implementation includes, at minimum, an 8-character password for accounts using MFA and a 14-character password for accounts not using MFA.' },
  { ctrl: 5, ctrlName: 'Account Management', sf: '5.4', ig: 1,
    title: 'Restrict Administrator Privileges to Dedicated Admin Accounts',
    sub: 'Restrict administrator privileges to dedicated administrator accounts on enterprise assets. Conduct general computing activities, such as internet browsing, email, and productivity suite use, from the user\'s primary, non-privileged account.' },
  { ctrl: 5, ctrlName: 'Account Management', sf: '5.5', ig: 2,
    title: 'Establish & Maintain an Inventory of Service Accounts',
    sub: 'Establish and maintain an inventory of service accounts. The inventory, at a minimum, must contain department owner, review date, and purpose. Perform service account reviews to validate that all active accounts are authorised, on a recurring basis.' },
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
  // ──── Control 7: Continuous Vulnerability Management ────
  { ctrl: 7, ctrlName: 'Continuous Vulnerability Management', sf: '7.1', ig: 2,
    title: 'Establish & Maintain a Vulnerability Management Process',
    sub: 'Establish and maintain a documented vulnerability management process for enterprise assets. Review and update documentation annually, or when significant enterprise changes occur that could impact this safeguard.' },
  { ctrl: 7, ctrlName: 'Continuous Vulnerability Management', sf: '7.2', ig: 2,
    title: 'Establish & Maintain a Remediation Process',
    sub: 'Establish and maintain a risk-based remediation strategy documented in a remediation process, with monthly, or more frequent, reviews.' },
  { ctrl: 7, ctrlName: 'Continuous Vulnerability Management', sf: '7.5', ig: 2,
    title: 'Perform Automated Vulnerability Scans of Internal Enterprise Assets',
    sub: 'Perform automated vulnerability scans of internal enterprise assets on a quarterly, or more frequent, basis. Conduct both authenticated and unauthenticated scans, using a SCAP-compliant vulnerability scanning tool.' },
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
  { ctrl: 8, ctrlName: 'Audit Log Management', sf: '8.9', ig: 3,
    title: 'Centralise Audit Logs',
    sub: 'Centralise, to the extent possible, audit log collection and retention across enterprise assets. This is typically implemented using a SIEM or log management tool.' },
  // ──── Control 9: Email & Web Browser Protections ────
  { ctrl: 9, ctrlName: 'Email & Web Browser Protections', sf: '9.1', ig: 1,
    title: 'Ensure Use of Only Fully Supported Browsers & Email Clients',
    sub: 'Ensure only fully supported browsers and email clients are allowed to execute in the enterprise, only using the latest version of browsers and email clients provided through the vendor.' },
  { ctrl: 9, ctrlName: 'Email & Web Browser Protections', sf: '9.2', ig: 1,
    title: 'Use DNS Filtering Services',
    sub: 'Use DNS filtering services on all enterprise assets to block access to known malicious domains.' },
  { ctrl: 9, ctrlName: 'Email & Web Browser Protections', sf: '9.5', ig: 2,
    title: 'Implement DMARC',
    sub: 'To lower the chance of spoofed or modified emails from valid domains, implement DMARC policy and verification, starting with implementing the Sender Policy Framework (SPF) and the DomainKeys Identified Mail (DKIM) standards.' },
  // ──── Control 10: Malware Defenses ────
  { ctrl: 10, ctrlName: 'Malware Defenses', sf: '10.1', ig: 1,
    title: 'Deploy & Maintain Anti-Malware Software',
    sub: 'Deploy and maintain anti-malware software on all enterprise assets that support such technology, such as workstations, laptops, and servers. Example implementations include use of an Endpoint Detection and Response (EDR) client.' },
  { ctrl: 10, ctrlName: 'Malware Defenses', sf: '10.2', ig: 1,
    title: 'Configure Automatic Anti-Malware Signature Updates',
    sub: 'Configure automatic updates for anti-malware signature files on all enterprise assets.' },
  { ctrl: 10, ctrlName: 'Malware Defenses', sf: '10.5', ig: 2,
    title: 'Enable Anti-Exploitation Features',
    sub: 'Enable anti-exploitation features on enterprise assets and software, where possible, such as Microsoft® Data Execution Prevention (DEP), Windows® Defender Exploit Guard (WDEG), or Apple® System Integrity Protection (SIP) and Gatekeeper™.' },
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
  // ──── Control 12: Network Infrastructure Management ────
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', sf: '12.1', ig: 2,
    title: 'Ensure Network Infrastructure is Up-to-Date',
    sub: 'Ensure network infrastructure is kept up-to-date. Example implementations include running the latest stable release of software and/or using currently supported network-as-a-service (NaaS) offerings. Review software monthly, or more frequently, to verify software support.' },
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', sf: '12.2', ig: 2,
    title: 'Establish & Maintain a Secure Network Architecture',
    sub: 'Establish and maintain a secure network architecture. A secure network architecture must address segmentation, least privilege, and availability, at a minimum.' },
  { ctrl: 12, ctrlName: 'Network Infrastructure Management', sf: '12.4', ig: 2,
    title: 'Establish & Maintain Architecture Diagram(s)',
    sub: 'Establish and maintain architecture diagram(s) and/or other network system documentation. Review and update documentation annually, or when significant enterprise changes occur that could impact this safeguard.' },
  // ──── Control 13: Network Monitoring & Defense ────
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.1', ig: 2,
    title: 'Centralise Security Event Alerting',
    sub: 'Centralise security event alerting across enterprise assets for log correlation and analysis. Best practice implementation requires the use of a SIEM, which includes vendor-defined event correlation alerts. A log analytics platform configured with security-relevant correlation alerts also satisfies this safeguard.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.3', ig: 2,
    title: 'Deploy a Network Intrusion Detection Solution',
    sub: 'Deploy a network intrusion detection solution on enterprise assets, where appropriate. Example implementations include the use of a Network Intrusion Detection System (NIDS) or equivalent cloud service provider (CSP) service.' },
  { ctrl: 13, ctrlName: 'Network Monitoring & Defense', sf: '13.8', ig: 3,
    title: 'Deploy a Network Intrusion Prevention Solution',
    sub: 'Deploy a network intrusion prevention solution, where appropriate. Example implementations include the use of a Network Intrusion Prevention System (NIPS) or equivalent CSP service.' },
  // ──── Control 14: Security Awareness & Skills Training ────
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.1', ig: 1,
    title: 'Establish & Maintain a Security Awareness Program',
    sub: 'Establish and maintain a security awareness program. The purpose of a security awareness program is to educate the enterprise\'s workforce on how to interact with enterprise assets and data in a secure manner. Conduct training at hire and, at a minimum, annually.' },
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.2', ig: 1,
    title: 'Train Workforce Members to Recognise Social Engineering Attacks',
    sub: 'Train workforce members to recognise social engineering attacks, such as phishing, pre-texting, and tailgating. Evaluate skills through periodic testing, at a minimum annually.' },
  { ctrl: 14, ctrlName: 'Security Awareness & Skills Training', sf: '14.6', ig: 2,
    title: 'Train Workforce Members on Recognising & Reporting Security Incidents',
    sub: 'Train workforce members to be able to recognise a potential incident and be able to report such an incident. Conduct this training at hire and, at a minimum, annually.' },
  // ──── Control 15: Service Provider Management ────
  { ctrl: 15, ctrlName: 'Service Provider Management', sf: '15.1', ig: 2,
    title: 'Establish & Maintain an Inventory of Service Providers',
    sub: 'Establish and maintain an inventory of service providers. The inventory is to list all known service providers, include classification(s), and designate an enterprise contact for each service provider. Review and update the inventory annually, or when significant enterprise changes occur that could impact this safeguard.' },
  { ctrl: 15, ctrlName: 'Service Provider Management', sf: '15.2', ig: 2,
    title: 'Establish & Maintain a Policy to Classify Service Providers',
    sub: 'Establish and maintain a policy to classify service providers. The policy is to include classification criteria and a classification process based on the data processed, stored, or transmitted by the service provider or the functions they perform for the enterprise.' },
  // ──── Control 16: Application Software Security ────
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.1', ig: 2,
    title: 'Establish & Maintain a Secure Application Development Process',
    sub: 'Establish and maintain a secure application development process. In the process, address such items as: secure application design standards, secure coding practices, developer training, vulnerability management, security of third-party code, and application security testing procedures.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.2', ig: 2,
    title: 'Establish & Maintain a Process to Accept & Address Software Vulnerabilities',
    sub: 'Establish and maintain a process to accept and address reports of software vulnerabilities, including providing a means for external entities to report. The process is to include such items as a vulnerability handling policy that identifies reporting and patch timeframes.' },
  { ctrl: 16, ctrlName: 'Application Software Security', sf: '16.12', ig: 3,
    title: 'Implement Code-Level Security Checks',
    sub: 'Apply static and dynamic analysis tools within the application life cycle to verify that secure coding practices are being followed.' },
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
  { ctrl: 17, ctrlName: 'Incident Response Management', sf: '17.7', ig: 3,
    title: 'Conduct Routine Incident Response Exercises',
    sub: 'Plan and conduct routine incident response exercises and scenarios for the workforce involved in the incident response process to prepare for responding to real-world incidents. Exercises need to test both the IRP and the communications plan.' },
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
  { ctrl: 18, ctrlName: 'Penetration Testing', sf: '18.5', ig: 3,
    title: 'Perform Periodic Internal Penetration Tests',
    sub: 'Perform periodic internal penetration tests based on program requirements, no less than annually. The testing may be clear-box or opaque-box.' },
];

// Returns safeguards for a given IG level (ig1 = IG1 only; ig2 = IG1+IG2; ig3 = all)
function cisGetSafeguards(ig) {
  const maxIg = ig === 'ig1' ? 1 : ig === 'ig2' ? 2 : 3;
  return CIS_SAFEGUARDS.filter(s => s.ig <= maxIg);
}

function cisCalcScore(ig) {
  const sfs = cisGetSafeguards(ig);
  if (!sfs.length) return { score: 0, answered: 0, total: sfs.length };
  const answered = sfs.filter(s => cisState.answers[s.sf] !== undefined);
  const yes = sfs.filter(s => cisState.answers[s.sf] === 'yes').length;
  const partial = sfs.filter(s => cisState.answers[s.sf] === 'partial').length;
  const total = sfs.length;
  const raw = (yes + partial * 0.5) / total;
  return { score: Math.round(raw * 100), answered: answered.length, total };
}

function renderCIS(ig) {
  if (!currentOrg) return '';
  if (cisState.ig !== ig) {
    // Load from last saved run if available, otherwise fresh
    const h = orgAssessments[currentOrg.id] || {};
    const runs = h[`cis_${ig}`] || [];
    const last = runs.length ? runs[runs.length - 1] : null;
    cisState = { ig, answers: last ? Object.assign({}, last.answers || {}) : {}, openPanels: {} };
  }
  const igNums = { ig1: 1, ig2: 2, ig3: 3 };
  const igColors = { ig1: '#15803d', ig2: '#1d4ed8', ig3: '#6d28d9' };
  const igDescs = {
    ig1: 'Basic cyber hygiene — suitable for all organisations regardless of size or complexity.',
    ig2: 'Includes all IG1 safeguards plus additional controls for medium-complexity environments handling sensitive data.',
    ig3: 'Full control set — for mature security programs, critical infrastructure, or high-value targets.'
  };
  const sfs = cisGetSafeguards(ig);
  const { score, answered, total } = cisCalcScore(ig);
  const band = score >= 75 ? 'Strong Posture' : score >= 60 ? 'Moderate Risk' : score >= 40 ? 'Elevated Risk' : 'High Risk';
  const bandCls = score >= 75 ? 'band-high' : score >= 60 ? 'band-mid' : 'band-low';
  // Group by control number
  const controls = {};
  sfs.forEach(s => {
    if (!controls[s.ctrl]) controls[s.ctrl] = { name: s.ctrlName, safeguards: [] };
    controls[s.ctrl].safeguards.push(s);
  });
  const h = orgAssessments[currentOrg.id] || {};
  const runs = (h[`cis_${ig}`] || []);
  let html = `
  ${renderTierBanner()}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.85rem;flex-wrap:wrap;gap:8px">
    <div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <div style="font-size:17px;font-weight:700">✅ CIS Controls v8</div>
        <span class="ig-badge ig${igNums[ig]}-badge" style="font-size:11px;padding:3px 9px">Implementation Group ${igNums[ig]}</span>
      </div>
      <div style="font-size:12px;color:var(--muted);max-width:560px">${igDescs[ig]}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="setNav('assessments')">← All Assessments</button>
      ${['ig1','ig2','ig3'].map(l => l === ig ? '' : `<button class="btn btn-outline btn-sm" onclick="setNav('cis_${l}')">Switch to IG${igNums[l]}</button>`).join('')}
    </div>
  </div>
  <div class="score-hero-ins" style="margin-bottom:1rem">
    <div>
      <div style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:4px">CIS Controls v8 — IG${igNums[ig]}</div>
      <div class="score-big" style="color:#fff">${answered < total ? '—' : score}<span>${answered < total ? '' : '/100'}</span></div>
      ${answered >= total ? `<div class="score-band ${bandCls}" style="margin-top:6px">${band}</div>` : ''}
      <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:6px">${answered}/${total} safeguards answered</div>
    </div>
    <div style="text-align:right">
      ${runs.length >= 2 ? `<div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:4px">Trend</div><canvas id="trendChart" width="200" height="60"></canvas>` : (runs.length === 1 ? `<div style="font-size:11px;color:rgba(255,255,255,0.3)">1 run — trend<br>appears after 2nd save</div>` : `<div style="font-size:11px;color:rgba(255,255,255,0.3)">No history yet</div>`)}
      ${answered >= total ? `<div style="margin-top:10px"><button class="btn btn-cyan btn-sm" id="cisSaveBtn" onclick="cisSave('${ig}')">Save to Database</button></div>` : ''}
    </div>
  </div>`;

  // Render controls and safeguards
  Object.entries(controls).forEach(([ctrlNum, ctrl]) => {
    const ctrlAnswered = ctrl.safeguards.filter(s => cisState.answers[s.sf] !== undefined).length;
    const isOpen = cisState.openPanels[`ctrl_${ctrlNum}`];
    html += `
    <div class="survey-panel">
      <div class="sph" onclick="cisToggleCtrl(${ctrlNum})">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="cis-control-header" style="margin:0;padding:4px 8px">
            <div class="cis-ctrl-num">Control ${ctrlNum}</div>
          </div>
          <div>
            <div class="cis-ctrl-name" style="font-size:13px">${ctrl.name}</div>
            <div style="font-size:10px;color:var(--muted)">${ctrl.safeguards.length} safeguards · ${ctrlAnswered}/${ctrl.safeguards.length} answered</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge ${ctrlAnswered === ctrl.safeguards.length ? 'b-green' : ctrlAnswered > 0 ? 'b-amber' : 'b-gray'}">${ctrlAnswered === ctrl.safeguards.length ? 'Done' : ctrlAnswered > 0 ? 'In progress' : 'Not started'}</span>
          <span style="color:var(--muted);font-size:12px">${isOpen ? '▴' : '▾'}</span>
        </div>
      </div>
      <div class="spb${isOpen ? ' open' : ''}">
        ${ctrl.safeguards.map(s => {
          const ans = cisState.answers[s.sf];
          const igBadgeClass = `ig${s.ig}-badge`;
          return `<div class="cis-safeguard">
            <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:5px">
              <span class="cis-sf-id">${s.sf}</span>
              <span class="ig-badge ${igBadgeClass}" style="flex-shrink:0;margin-top:1px">IG${s.ig}</span>
              <span class="cis-sf-text" style="margin:0">${s.title}</span>
            </div>
            <div class="cis-sf-sub">${s.sub}</div>
            <div class="cis-ans-row">
              ${['yes','partial','no','na'].map(v => {
                const labels = { yes: '✓ Yes', partial: '~ Partial', no: '✕ No', na: 'N/A' };
                return `<button class="cis-ans-btn${ans === v ? ' sel-'+v : ''}" onclick="cisAnswer('${s.sf}','${v}','${ig}')">${labels[v]}</button>`;
              }).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  });

  html += `<div style="margin-top:0.75rem;display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" onclick="cisExpandAll('${ig}',true)">Expand all</button>
    <button class="btn btn-outline btn-sm" onclick="cisExpandAll('${ig}',false)">Collapse all</button>
    ${answered >= total ? `<button class="btn btn-cyan btn-sm" id="cisSaveBtn2" onclick="cisSave('${ig}')">Save to Database</button>` : ''}
  </div>`;

  // Draw trend for CIS if there's history
  if (runs.length >= 2) {
    setTimeout(() => {
      const canvas = document.getElementById('trendChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.offsetWidth || 200; canvas.width = W; const H = 60;
      ctx.clearRect(0, 0, W, H);
      const scores = runs.map(r => r.score);
      const mn = Math.max(0, Math.min(...scores) - 10), mx = Math.min(100, Math.max(...scores) + 10);
      const px = i => Math.round(i * (W - 20) / (runs.length - 1) + 10);
      const py = v => Math.round(H - 6 - (v - mn) / (mx - mn) * (H - 16));
      ctx.beginPath(); ctx.strokeStyle = igColors[ig]; ctx.lineWidth = 2; ctx.lineJoin = 'round';
      scores.forEach((s, i) => { i === 0 ? ctx.moveTo(px(i), py(s)) : ctx.lineTo(px(i), py(s)); }); ctx.stroke();
      scores.forEach((s, i) => {
        ctx.beginPath(); ctx.arc(px(i), py(s), 4, 0, Math.PI * 2);
        ctx.fillStyle = s >= 75 ? '#15803d' : s >= 50 ? '#b45309' : '#b91c1c'; ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 9px Kanit,sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(s, px(i), py(s) - 7);
      });
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '9px Kanit,sans-serif';
      runs.forEach((r, i) => { ctx.textAlign = 'center'; ctx.fillText(r.date.slice(5), px(i), H); });
    }, 80);
  }

  return html;
}

function cisToggleCtrl(ctrlNum) {
  cisState.openPanels[`ctrl_${ctrlNum}`] = !cisState.openPanels[`ctrl_${ctrlNum}`];
  renderMain();
}

function cisAnswer(sf, val, ig) {
  cisState.answers[sf] = val;
  const sf_obj = CIS_SAFEGUARDS.find(s => s.sf === sf);
  if (sf_obj && !cisState.openPanels[`ctrl_${sf_obj.ctrl}`]) {
    cisState.openPanels[`ctrl_${sf_obj.ctrl}`] = true;
  }
  renderMain();
}

function cisExpandAll(ig, open) {
  const sfs = cisGetSafeguards(ig);
  const ctrls = [...new Set(sfs.map(s => s.ctrl))];
  ctrls.forEach(c => { cisState.openPanels[`ctrl_${c}`] = open; });
  renderMain();
}

async function cisSave(ig) {
  const { score } = cisCalcScore(ig);
  const today = new Date().toISOString().split('T')[0];
  const moduleId = `cis_${ig}`;
  const btn = document.getElementById('cisSaveBtn') || document.getElementById('cisSaveBtn2');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Saving…'; }
  try {
    await sb.saveAssessment({ org_id: currentOrg.id, module: moduleId, score, answers: cisState.answers, assessed_at: today });
    if (!orgAssessments[currentOrg.id]) orgAssessments[currentOrg.id] = {};
    if (!orgAssessments[currentOrg.id][moduleId]) orgAssessments[currentOrg.id][moduleId] = [];
    orgAssessments[currentOrg.id][moduleId].push({ date: today, score, answers: cisState.answers });
    cisState = { ig, answers: {}, openPanels: {} };
    toast(`✓ CIS IG${ig.replace('ig','')} score saved for ${currentOrg.name}`, '#15803d');
    buildNav(); renderMain();
  } catch (e) {
    toast('Save failed: ' + e.message, '#dc2626');
    if (btn) { btn.disabled = false; btn.textContent = 'Save to Database'; }
  }
}
