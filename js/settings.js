// ============================================================
// PLATFORM SETTINGS — session timeout + password policy
// Platform admin only
// ============================================================

function renderSettings() {
  if (!isPlatformAdmin()) {
    return `<div class="card"><div style="font-size:13px;color:var(--muted)">Access restricted to Platform Admin.</div></div>`;
  }
  return `${renderTierBanner()}
  <div style="font-size:17px;font-weight:700;margin-bottom:0.85rem">⚙️ Platform Settings</div>
  <div id="settingsContent" style="min-height:200px">
    <div style="text-align:center;padding:3rem;color:var(--muted)">
      <div class="spinner" style="border-color:rgba(21,33,104,0.15);border-top-color:var(--navy);width:22px;height:22px;margin:0 auto 1rem"></div>
      <div style="font-size:12px">Loading settings…</div>
    </div>
  </div>`;
}

async function settingsLoad() {
  const el = document.getElementById('settingsContent');
  if (!el) return;
  try {
    const rows = await sb.settings.get();
    const d = rows?.[0] || {};
    el.innerHTML = settingsRenderForm(d);
  } catch (e) {
    el.innerHTML = `<div class="card"><div style="color:#dc2626;font-size:13px">Could not load settings: ${escH(e.message)}</div></div>`;
  }
}

function settingsRenderForm(d) {
  const timeout  = d.session_timeout_minutes  ?? platformSettings.session_timeout_minutes;
  const minLen   = d.password_min_length       ?? platformSettings.password_min_length;
  const reqUpper = d.password_require_upper    ?? platformSettings.password_require_upper;
  const reqNum   = d.password_require_number   ?? platformSettings.password_require_number;
  const reqSpec  = d.password_require_special  ?? platformSettings.password_require_special;

  const timeoutOpts = [
    { val: 15,  label: '15 min' },
    { val: 30,  label: '30 min' },
    { val: 60,  label: '1 hour' },
    { val: 120, label: '2 hours' },
  ];
  const lenOpts = [8, 10, 12, 16];

  return `
  <div class="card" style="margin-bottom:0.75rem">
    <div class="card-title">Session Security</div>
    <div class="field-lbl" style="margin-bottom:8px">Idle timeout — auto sign-out after inactivity</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      ${timeoutOpts.map(o => `
        <label style="display:flex;align-items:center;cursor:pointer;padding:7px 16px;border-radius:8px;
          border:2px solid ${timeout===o.val?'var(--cyan)':'var(--border)'};
          background:${timeout===o.val?'rgba(7,180,217,0.06)':'transparent'};transition:all 0.15s">
          <input type="radio" name="sTimeout" value="${o.val}" ${timeout===o.val?'checked':''}
            onchange="settingsRadioChange(this,'sTimeout')" style="display:none">
          <span style="font-size:13px;font-weight:${timeout===o.val?'700':'500'};
            color:${timeout===o.val?'var(--cyan)':'var(--text)'}">${o.label}</span>
        </label>`).join('')}
    </div>
    <div style="font-size:11px;color:var(--muted);line-height:1.5">A warning appears 2 minutes before sign-out. Any mouse, keyboard, or touch activity resets the timer.</div>
  </div>

  <div class="card" style="margin-bottom:0.75rem">
    <div class="card-title">Password Policy</div>
    <div class="field-lbl" style="margin-bottom:8px">Minimum password length</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      ${lenOpts.map(n => `
        <label style="display:flex;align-items:center;cursor:pointer;padding:7px 16px;border-radius:8px;
          border:2px solid ${minLen===n?'var(--cyan)':'var(--border)'};
          background:${minLen===n?'rgba(7,180,217,0.06)':'transparent'};transition:all 0.15s">
          <input type="radio" name="sPwdLen" value="${n}" ${minLen===n?'checked':''}
            onchange="settingsRadioChange(this,'sPwdLen')" style="display:none">
          <span style="font-size:13px;font-weight:${minLen===n?'700':'500'};
            color:${minLen===n?'var(--cyan)':'var(--text)'}">${n} characters</span>
        </label>`).join('')}
    </div>
    <div class="field-lbl" style="margin-bottom:10px">Complexity requirements</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${[
        { id: 'sReqUpper',   label: 'Require uppercase letter (A–Z)', val: reqUpper },
        { id: 'sReqNum',     label: 'Require number (0–9)',           val: reqNum   },
        { id: 'sReqSpecial', label: 'Require special character (!@#$%^&*)', val: reqSpec },
      ].map(opt => `
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer" onclick="settingsToggle('${opt.id}')">
          <div id="${opt.id}Chk" style="width:20px;height:20px;min-width:20px;border-radius:4px;
            border:2px solid ${opt.val?'var(--cyan)':'var(--border)'};
            background:${opt.val?'var(--cyan)':'transparent'};
            display:flex;align-items:center;justify-content:center;flex-shrink:0">
            ${opt.val?'<span style="color:#fff;font-size:11px;font-weight:700">✓</span>':''}
          </div>
          <input type="checkbox" id="${opt.id}" ${opt.val?'checked':''} style="display:none">
          <span style="font-size:13px;color:var(--text)">${opt.label}</span>
        </label>`).join('')}
    </div>
    <div style="font-size:11px;color:var(--muted);margin-top:12px;line-height:1.5">Policy is enforced when creating new users. Existing passwords are not affected until changed.</div>
  </div>

  <div style="display:flex;justify-content:flex-end">
    <button class="btn btn-primary" onclick="settingsSave()">Save settings</button>
  </div>`;
}

// ---- Interaction helpers ----

function settingsRadioChange(radio, name) {
  document.querySelectorAll(`[name="${name}"]`).forEach(r => {
    const lbl = r.closest('label');
    if (!lbl) return;
    const sel = r.value === radio.value;
    lbl.style.borderColor = sel ? 'var(--cyan)' : 'var(--border)';
    lbl.style.background  = sel ? 'rgba(7,180,217,0.06)' : 'transparent';
    const sp = lbl.querySelector('span');
    if (sp) { sp.style.fontWeight = sel ? '700' : '500'; sp.style.color = sel ? 'var(--cyan)' : 'var(--text)'; }
  });
}

function settingsToggle(id) {
  const cb  = document.getElementById(id);
  const chk = document.getElementById(id + 'Chk');
  if (!cb || !chk) return;
  cb.checked = !cb.checked;
  chk.style.borderColor = cb.checked ? 'var(--cyan)' : 'var(--border)';
  chk.style.background  = cb.checked ? 'var(--cyan)'  : 'transparent';
  chk.innerHTML = cb.checked ? '<span style="color:#fff;font-size:11px;font-weight:700">✓</span>' : '';
}

// ---- Save ----

async function settingsSave() {
  const timeout = parseInt(document.querySelector('[name="sTimeout"]:checked')?.value  || '60');
  const minLen  = parseInt(document.querySelector('[name="sPwdLen"]:checked')?.value   || '8');
  const reqUpper  = !!document.getElementById('sReqUpper')?.checked;
  const reqNum    = !!document.getElementById('sReqNum')?.checked;
  const reqSpecial = !!document.getElementById('sReqSpecial')?.checked;

  const patch = {
    session_timeout_minutes:  timeout,
    password_min_length:      minLen,
    password_require_upper:   reqUpper,
    password_require_number:  reqNum,
    password_require_special: reqSpecial,
    updated_by: authState?.profile?.name || authState?.user?.email || 'unknown',
    updated_at: new Date().toISOString(),
  };

  try {
    await sb.settings.save(patch);
    Object.assign(platformSettings, patch);
    idleStop();
    idleStart();
    auditLog('settings_update', 'settings', 'platform_settings', patch);
    toast('Settings saved', '#16a34a');
  } catch (e) {
    toast('Save failed: ' + escH(e.message), '#dc2626');
  }
}

// ---- Password policy validator (used by users.js) ----

function validatePassword(password) {
  const p = platformSettings;
  const errors = [];
  if (password.length < p.password_min_length)   errors.push(`at least ${p.password_min_length} characters`);
  if (p.password_require_upper  && !/[A-Z]/.test(password)) errors.push('an uppercase letter');
  if (p.password_require_number && !/[0-9]/.test(password)) errors.push('a number');
  if (p.password_require_special && !/[^A-Za-z0-9]/.test(password)) errors.push('a special character');
  return errors; // empty array = valid
}
