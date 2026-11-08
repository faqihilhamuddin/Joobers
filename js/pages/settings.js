import { icon, esc } from "../utils.js";
export function renderSettings(user, theme) {
  return `<div class="page-enter"><div class="page-heading"><div><span class="eyebrow">MAKE JOBTRACK YOURS</span><h1>Settings</h1><p>Manage your profile, appearance, and workspace preferences.</p></div></div><div class="settings-layout"><section class="panel settings-card"><div class="section-heading"><div><span class="eyebrow">PERSONAL PROFILE</span><h3>Profile information</h3></div><div class="settings-icon">${icon("user-round")}</div></div><label class="field"><span>Display name</span><input id="settings-name" value="${esc(user.displayName || "")}"></label><label class="field"><span>Email address</span><input id="settings-email" value="${esc(user.email || "")}" disabled></label><div class="settings-actions"><button class="btn btn-primary" data-action="save-profile">Save changes</button></div></section><section class="panel settings-card"><div class="section-heading"><div><span class="eyebrow">APPEARANCE</span><h3>Theme preferences</h3></div><div class="settings-icon">${icon("palette")}</div></div><div class="theme-options">${[
    ["light", "Light", "Bright and clean"],
    ["dark", "Dark", "Easy on the eyes"],
    ["system", "System", "Follow device"],
  ]
    .map(
      (t) =>
        `<button class="${theme === t[0] ? "selected" : ""}" data-theme-choice="${t[0]}"><span class="theme-preview ${t[0]}-preview"></span><b>${t[1]}</b><small>${t[2]}</small></button>`,
    )
    .join(
      "",
    )}</div></section><section class="panel settings-card"><div class="section-heading"><div><span class="eyebrow">YOUR DATA</span><h3>Data & account</h3></div><div class="settings-icon">${icon("database")}</div></div><p class="muted-copy">Your applications are stored securely in your Firebase account.</p><div class="settings-actions wrap"><button class="btn btn-soft" data-action="export">${icon("download")} Export CSV</button><button class="btn btn-soft" data-action="reset-password">${icon("key-round")} Reset password</button><button class="btn btn-danger" data-action="signout">${icon("log-out")} Sign out</button></div></section></div></div>`;
}
