export const $ = (s, root = document) => root.querySelector(s);
export const $$ = (s, root = document) => [...root.querySelectorAll(s)];
export const DEFAULT_COLUMNS = [
  "Saved",
  "Applied",
  "Psikotest",
  "Interview",
  "Rejected",
  "Offering",
];
export const STATUS = {
  Saved: { color: "#7d879d", bg: "rgba(125,135,157,.13)", soft: "#eef0f5" },
  Applied: { color: "#4c91e8", bg: "rgba(76,145,232,.13)", soft: "#eaf3ff" },
  Psikotest: { color: "#d99a36", bg: "rgba(217,154,54,.14)", soft: "#fff4df" },
  Interview: { color: "#8973e6", bg: "rgba(137,115,230,.14)", soft: "#f1edff" },
  Rejected: { color: "#df707a", bg: "rgba(223,112,122,.13)", soft: "#fff0f1" },
  Offering: { color: "#22a982", bg: "rgba(34,169,130,.13)", soft: "#e5f7f0" },
};
export function esc(v = "") {
  return String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
export function icon(name) {
  const paths = {
    "layout-dashboard":
      '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/>',
    "chart-no-axes-combined":
      '<path d="M3 3v18h18"/><path d="m7 14 4-4 4 3 6-8"/>',
    "calendar-days":
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
    "settings-2":
      '<path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M2 14h4m4-6h4m4 8h4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    moon: '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    "layout-grid":
      '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    filter: '<path d="M4 7h16M7 12h10m-7 5h4"/>',
    "arrow-down-wide-narrow":
      '<path d="m3 6 4 4 4-4M7 10V3m6 3h8m-8 6h5m-5 6h2"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "map-pin":
      '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',
    "arrow-up-right": '<path d="M7 17 17 7M7 7h10v10"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="m18 6-12 12M6 6l12 12"/>',
    "trash-2": '<path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6"/>',
    "arrow-right": '<path d="M5 12h14m-7-7 7 7-7 7"/>',
    "user-round":
      '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    palette:
      '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 22a10 10 0 1 1 10-10c0 2-1 3-3 3h-2a2 2 0 0 0-2 2c0 2-1 5-3 5Z"/>',
    database:
      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    download:
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"/>',
    "key-round":
      '<circle cx="8" cy="15" r="5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7"/>',
    "log-out":
      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9"/>',
    "check-circle": '<path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
    "briefcase-business":
      '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18m-11 0v2h4v-2"/>',
    "trending-up": '<path d="m3 17 6-6 4 4 8-8m-7 0h7v7"/>',
    grip: '<circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths["briefcase-business"]}</svg>`;
}
export function renderIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });
}
export function toast(message, kind = "success") {
  const root = $("#toast-region");
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `${icon(kind === "error" ? "x" : "check-circle")}<span>${esc(message)}</span>`;
  root.append(el);
  setTimeout(() => el.remove(), 3200);
}
export function formatDate(value) {
  if (!value) return "No date";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}
export function initials(name = "J") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((x) => x[0])
      .join("")
      .toUpperCase() || "J"
  );
}
export function relativeTime(ts) {
  if (!ts) return "Just now";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}
