let spState = {
  status:     'loading',
  tokenData:  null,
  orgName:    '',
  catalog:    [],
  selectedDC: [],
  aiMode:     'catalog',
  errorMsg:   '',
};

function _spInjectStyles() {
  if (document.getElementById('sp-styles')) return;
  const s = document.createElement('style');
  s.id = 'sp-styles';
  s.textContent = `
    .sp-label { display:block; font-size:13px; font-weight:600; color:#1a2340; margin-bottom:5px; }
    .sp-fld   { margin-bottom:16px; }
    .sp-input {
      width:100%; box-sizing:border-box; padding:9px 12px;
      border:1.5px solid #dde3ef; border-radius:8px;
      font-size:14px; font-family:inherit; color:#1a2340;
      background:#f8fafc; outline:none; transition:border-color .15s;
    }
    .sp-input:focus { border-color:#07B4D9; background:#fff; }
    textarea.sp-input { resize:vertical; min-height:80px; }
    .sp-chip {
      display:inline-block; padding:5px 13px; border-radius:20px;
      font-size:12px; font-weight:600; cursor:pointer;
      border:1.5px solid #dde3ef; background:#f0f4fa; color:#5a6a8a;
      margin:3px 4px 3px 0; user-select:none; transition:all .12s;
    }
    .sp-chip.on { background:#152168; color:#fff; border-color:#152168; }
    .sp-divider { border:none; border-top:1px solid #dde3ef; margin:18px 0; }
    .sp-mode-btn {
      flex:1; padding:9px 0; border:1.5px solid #dde3ef; background:#f0f4fa;
      border-radius:8px; font-size:13px; font-weight:600; color:#5a6a8a;
      cursor:pointer; transition:all .12s; font-family:inherit;
    }
    .sp-mode-btn.on { background:#152168; color:#fff; border-color:#152168; }
    .sp-submit-btn {
      width:100%; padding:13px; border:none; border-radius:10px;
      background:linear-gradient(90deg,#152168 0%,#1a2a7a 100%);
      color:#fff; font-size:15px; font-weight:700; cursor:pointer;
      font-family:inherit; margin-top:8px; transition:opacity .15s;
    }
    .sp-submit-btn:disabled { opacity:.6; cursor:not-allowed; }
    .sp-err { color:#b91c1c; font-size:12px; margin-top:6px; min-height:16px; }
  `;
  document.head.appendChild(s);
}

async function bootSubmissionPortal(token) {
  _spInjectStyles();

  const shell = document.getElementById('appShell');
  if (shell) shell.style.display = 'none';

  let root = document.getElementById('spRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'spRoot';
    document.body.appendChild(root);
  }

  spState.status = 'loading';
  _spRender();

  let rows;
  try {
    rows = await sbFetch(`submission_tokens?token=eq.${encodeURIComponent(token)}&select=*`);
  } catch (e) {
    spState.status = 'invalid';
    spState.errorMsg = 'Could not reach the server. Please try again later.';
    _spRender();
    return;
  }

  if (!rows || rows.length === 0) {
    spState.status = 'invalid';
    spState.errorMsg = 'Link not found. Please check the URL and try again.';
    _spRender();
    return;
  }

  const tok = rows[0];

  if (tok.revoked) {
    spState.status = 'invalid';
    spState.errorMsg = 'This link has been revoked. Please contact your administrator for a new link.';
    _spRender();
    return;
  }

  if (new Date(tok.expires_at) < new Date()) {
    spState.status = 'invalid';
    spState.errorMsg = 'This link has expired. Please contact your administrator for a new link.';
    _spRender();
    return;
  }

  spState.tokenData = tok;

  try {
    const orgs = await sbFetch(`organisations?id=eq.${tok.org_id}&select=name`);
    spState.orgName = (orgs && orgs[0]) ? orgs[0].name : 'Your Organisation';
  } catch (e) {
    spState.orgName = 'Your Organisation';
  }

  if (tok.module === 'ai_tool_catalog') {
    try {
      const catalog = await sbFetch(`ai_tool_catalog?order=name.asc&select=id,name,vendor,category,is_component`);
      spState.catalog = (catalog || []).filter(r => !r.is_component);
    } catch (e) {
      spState.catalog = [];
    }
  }

  spState.status = 'form';
  _spRender();
}

function _spRender() {
  const root = document.getElementById('spRoot');
  if (!root) return;
  root.innerHTML = _spHtml();
}

function _spHtml() {
  const s = spState;

  let inner = '';
  if (s.status === 'loading') {
    inner = _spLoading();
  } else if (s.status === 'invalid') {
    inner = _spInvalid();
  } else if (s.status === 'done') {
    inner = _spDone();
  } else {
    inner = _spFormWrap();
  }

  return `
    <div style="position:fixed;inset:0;background:linear-gradient(135deg,#152168 0%,#1a3a8f 55%,#07B4D9 100%);overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;z-index:99999;padding:40px 16px 60px;">
      <div style="width:100%;max-width:520px;">
        ${inner}
      </div>
    </div>
  `;
}

function _spLoading() {
  return `
    <div style="background:#fff;border-radius:14px;padding:2rem;text-align:center;">
      <div style="font-size:32px;margin-bottom:12px;">⏳</div>
      <p style="color:#5a6a8a;font-size:14px;margin:0;">Validating link…</p>
    </div>
  `;
}

function _spInvalid() {
  return `
    <div style="background:#fff;border-radius:14px;padding:2rem;text-align:center;">
      <div style="font-size:40px;margin-bottom:12px;">🚫</div>
      <h2 style="font-size:18px;font-weight:700;color:#1a2340;margin:0 0 8px;">Link Unavailable</h2>
      <p style="color:#b91c1c;font-size:14px;margin:0;">${_spEsc(spState.errorMsg)}</p>
    </div>
  `;
}

function _spDone() {
  return `
    <div style="background:#fff;border-radius:14px;padding:2rem;text-align:center;">
      ${_spCardHeader()}
      <div style="font-size:44px;margin:16px 0 12px;">✅</div>
      <h2 style="font-size:20px;font-weight:700;color:#1a2340;margin:0 0 8px;">Submission Received</h2>
      <p style="color:#5a6a8a;font-size:14px;margin:0;">Thank you — your submission has been sent for review. You can close this window.</p>
    </div>
  `;
}

function _spFormWrap() {
  const tok = spState.tokenData;
  const isSubmitting = spState.status === 'submitting';
  const moduleLabel = tok.module === 'ai_tool_catalog' ? 'AI Tool Catalog' : 'Application Inventory';
  const formBody = tok.module === 'ai_tool_catalog' ? _spAiForm() : _spAppForm();

  return `
    <div style="background:#fff;border-radius:14px;padding:2rem;">
      ${_spCardHeader()}
      <div style="height:1px;background:#dde3ef;margin:16px 0 20px;"></div>
      ${formBody}
      <div id="sp-err" class="sp-err">${_spEsc(spState.errorMsg)}</div>
      <button class="sp-submit-btn" onclick="spSubmit()" ${isSubmitting ? 'disabled' : ''}>
        ${isSubmitting ? 'Submitting…' : 'Submit'}
      </button>
    </div>
  `;
}

function _spCardHeader() {
  const tok = spState.tokenData;
  const module = tok ? tok.module : '';
  const icon = module === 'ai_tool_catalog' ? '🤖' : '🖥️';
  const label = tok && tok.label ? tok.label : (module === 'ai_tool_catalog' ? 'AI Tool Catalog' : 'Application Inventory');
  const expiry = tok ? _spFmtDate(tok.expires_at) : '';

  return `
    <div style="text-align:center;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:12px;background:linear-gradient(135deg,#152168,#07B4D9);font-size:26px;margin-bottom:8px;">${icon}</div>
      <div style="font-size:11px;font-weight:700;color:#07B4D9;letter-spacing:.08em;text-transform:uppercase;margin-bottom:2px;">Abbott Cyber · GRC Platform</div>
      <h1 style="font-size:20px;font-weight:700;color:#1a2340;margin:0 0 4px;">${_spEsc(label)}</h1>
      <div style="font-size:13px;color:#5a6a8a;">${_spEsc(spState.orgName)}</div>
      ${expiry ? `<div style="font-size:11px;color:#9aaccc;margin-top:3px;">Expires ${expiry}</div>` : ''}
    </div>
  `;
}

function _spAppForm() {
  const dc = ['PII','Payment','Health','IP','Confidential','Internal'];
  return `
    <div class="sp-fld">
      <label class="sp-label">Submitter Name <span style="color:#b91c1c">*</span></label>
      <input id="sp-sub-name" class="sp-input" type="text" placeholder="Your full name" />
    </div>
    <div class="sp-fld">
      <label class="sp-label">Submitter Email</label>
      <input id="sp-sub-email" class="sp-input" type="email" placeholder="your@email.com" />
    </div>
    <hr class="sp-divider" />
    <div class="sp-fld">
      <label class="sp-label">Application / System Name <span style="color:#b91c1c">*</span></label>
      <input id="sp-app-name" class="sp-input" type="text" placeholder="e.g. Salesforce, QuickBooks" />
    </div>
    <div class="sp-fld">
      <label class="sp-label">Website / URL</label>
      <input id="sp-app-url" class="sp-input" type="url" placeholder="https://…" />
    </div>
    <div class="sp-fld">
      <label class="sp-label">Department</label>
      <input id="sp-app-dept" class="sp-input" type="text" placeholder="e.g. Finance, Operations" />
    </div>
    <div class="sp-fld">
      <label class="sp-label">Data this app handles</label>
      <div style="margin-top:4px;">
        ${dc.map(v => `<span class="sp-chip${spState.selectedDC.includes(v) ? ' on' : ''}" onclick="spToggleDc('${v}')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="sp-fld">
      <label class="sp-label">What is this app used for? <span style="color:#b91c1c">*</span></label>
      <textarea id="sp-app-purpose" class="sp-input" placeholder="Brief description of how and why your team uses this application"></textarea>
    </div>
  `;
}

function _spAiForm() {
  const dc = ['PII','Payment','Health','IP','Confidential','Internal'];
  const isCatalog = spState.aiMode === 'catalog';

  let toolPicker = '';
  if (isCatalog) {
    const opts = spState.catalog.map(t =>
      `<option value="${_spEsc(t.id)}">${_spEsc(t.name)} — ${_spEsc(t.vendor || '')}</option>`
    ).join('');
    toolPicker = `
      <div class="sp-fld">
        <label class="sp-label">Select a tool <span style="color:#b91c1c">*</span></label>
        <select id="sp-ai-catalog-pick" class="sp-input">
          <option value="">Select a tool…</option>
          ${opts}
        </select>
      </div>
    `;
  } else {
    toolPicker = `
      <div class="sp-fld">
        <label class="sp-label">Tool Name <span style="color:#b91c1c">*</span></label>
        <input id="sp-ai-custom-name" class="sp-input" type="text" placeholder="e.g. ChatGPT, Midjourney" />
      </div>
      <div class="sp-fld">
        <label class="sp-label">Vendor / Provider</label>
        <input id="sp-ai-custom-vendor" class="sp-input" type="text" placeholder="e.g. OpenAI, Anthropic" />
      </div>
    `;
  }

  return `
    <div class="sp-fld">
      <label class="sp-label">Submitter Name <span style="color:#b91c1c">*</span></label>
      <input id="sp-sub-name" class="sp-input" type="text" placeholder="Your full name" />
    </div>
    <div class="sp-fld">
      <label class="sp-label">Submitter Email</label>
      <input id="sp-sub-email" class="sp-input" type="email" placeholder="your@email.com" />
    </div>
    <hr class="sp-divider" />
    <div class="sp-fld">
      <label class="sp-label">How are you adding this tool?</label>
      <div style="display:flex;gap:8px;margin-top:6px;">
        <button class="sp-mode-btn${isCatalog ? ' on' : ''}" onclick="spSetAiMode('catalog')">Pick from known AI tools</button>
        <button class="sp-mode-btn${!isCatalog ? ' on' : ''}" onclick="spSetAiMode('custom')">Tool isn't listed</button>
      </div>
    </div>
    ${toolPicker}
    <div class="sp-fld">
      <label class="sp-label">Website / URL</label>
      <input id="sp-ai-url" class="sp-input" type="url" placeholder="https://…" />
    </div>
    <div class="sp-fld">
      <label class="sp-label">Department</label>
      <input id="sp-ai-dept" class="sp-input" type="text" placeholder="e.g. Finance, Operations" />
    </div>
    <div class="sp-fld">
      <label class="sp-label">Data this tool processes</label>
      <div style="margin-top:4px;">
        ${dc.map(v => `<span class="sp-chip${spState.selectedDC.includes(v) ? ' on' : ''}" onclick="spToggleDc('${v}')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="sp-fld">
      <label class="sp-label">Why does your team use this / what is it used for? <span style="color:#b91c1c">*</span></label>
      <textarea id="sp-ai-purpose" class="sp-input" placeholder="Brief description of how your team uses this AI tool"></textarea>
    </div>
  `;
}

function spToggleDc(val) {
  const idx = spState.selectedDC.indexOf(val);
  if (idx === -1) {
    spState.selectedDC.push(val);
  } else {
    spState.selectedDC.splice(idx, 1);
  }
  _spRender();
}

function spSetAiMode(mode) {
  spState.aiMode = mode;
  _spRender();
}

function _spVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

async function spSubmit() {
  const tok = spState.tokenData;
  spState.errorMsg = '';

  const submitterName = _spVal('sp-sub-name');
  if (!submitterName) {
    spState.errorMsg = 'Submitter name is required.';
    _spRender();
    return;
  }

  let payload = {};

  if (tok.module === 'app_inventory') {
    const appName = _spVal('sp-app-name');
    const purpose = _spVal('sp-app-purpose');
    if (!appName) { spState.errorMsg = 'Application name is required.'; _spRender(); return; }
    if (!purpose)  { spState.errorMsg = 'Purpose is required.';          _spRender(); return; }
    payload = {
      app_name:            appName,
      website:             _spVal('sp-app-url'),
      department:          _spVal('sp-app-dept'),
      data_classification: spState.selectedDC,
      purpose:             purpose,
    };
  } else {
    const purpose = _spVal('sp-ai-purpose');
    if (!purpose) { spState.errorMsg = 'Purpose is required.'; _spRender(); return; }

    if (spState.aiMode === 'catalog') {
      const catalogId = _spVal('sp-ai-catalog-pick');
      if (!catalogId) { spState.errorMsg = 'Please select a tool or switch to custom entry.'; _spRender(); return; }
      const catalogTool = spState.catalog.find(t => t.id === catalogId);
      payload = {
        is_catalog_pick:     true,
        catalog_tool_id:     catalogId,
        tool_name:           catalogTool ? catalogTool.name : '',
        vendor:              catalogTool ? (catalogTool.vendor || '') : '',
        website:             _spVal('sp-ai-url'),
        department:          _spVal('sp-ai-dept'),
        data_classification: spState.selectedDC,
        purpose:             purpose,
      };
    } else {
      const toolName = _spVal('sp-ai-custom-name');
      if (!toolName) { spState.errorMsg = 'Tool name is required.'; _spRender(); return; }
      payload = {
        is_catalog_pick:     false,
        catalog_tool_id:     null,
        tool_name:           toolName,
        vendor:              _spVal('sp-ai-custom-vendor'),
        website:             _spVal('sp-ai-url'),
        department:          _spVal('sp-ai-dept'),
        data_classification: spState.selectedDC,
        purpose:             purpose,
      };
    }
  }

  spState.status = 'submitting';
  _spRender();

  try {
    await sbFetch('pending_submissions', 'POST', {
      token_id:        tok.id,
      org_id:          tok.org_id,
      module:          tok.module,
      submitter_name:  submitterName,
      submitter_email: _spVal('sp-sub-email') || null,
      payload:         payload,
    });
    spState.status = 'done';
    _spRender();
  } catch (e) {
    spState.status = 'form';
    spState.errorMsg = 'Submission failed. Please try again or contact your administrator.';
    _spRender();
  }
}

function _spFmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-CA', { year:'numeric', month:'short', day:'numeric' });
}

function _spEsc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

window.bootSubmissionPortal = bootSubmissionPortal;
window.spSubmit             = spSubmit;
window.spToggleDc           = spToggleDc;
window.spSetAiMode          = spSetAiMode;
