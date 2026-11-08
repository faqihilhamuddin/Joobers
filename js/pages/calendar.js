import { STATUS, icon, esc } from "../utils.js";
export function renderCalendar(apps, month) {
  const y = month.getFullYear(),
    m = month.getMonth(),
    first = new Date(y, m, 1).getDay(),
    days = new Date(y, m + 1, 0).getDate(),
    today = new Date();
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let cells = names
    .map((n) => `<div class="calendar-day-name">${n}</div>`)
    .join("");
  for (let i = 0; i < first; i++)
    cells += `<div class="calendar-day muted-day"></div>`;
  for (let d = 1; d <= days; d++) {
    const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      events = apps.filter((a) => a.date === key);
    cells += `<div class="calendar-day ${today.getFullYear() === y && today.getMonth() === m && today.getDate() === d ? "today" : ""}"><span class="calendar-day-number">${d}</span>${events
      .slice(0, 2)
      .map(
        (a) =>
          `<button class="calendar-event" data-edit="${esc(a.id)}" style="--event-bg:${STATUS[a.status]?.bg || "#eeeaff"};--event-color:${STATUS[a.status]?.color || "#675cdb"}">${esc(a.company)}</button>`,
      )
      .join(
        "",
      )}${events.length > 2 ? `<small>+${events.length - 2} more</small>` : ""}</div>`;
  }
  const upcoming = apps
    .filter(
      (a) =>
        a.date &&
        new Date(a.date + "T00:00:00") >= new Date(today.toDateString()),
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);
  return `<div class="page-enter"><div class="page-heading"><div><span class="eyebrow">PLAN YOUR NEXT STEP</span><h1>Calendar</h1><p>Keep interviews, assessments, and follow-ups in sight.</p></div><button class="btn btn-primary" data-action="add">${icon("plus")} Add event</button></div><div class="calendar-layout"><section class="panel calendar-panel"><div class="calendar-toolbar"><button class="icon-btn" data-calendar="prev">${icon("chevron-left")}</button><h3>${month.toLocaleDateString("en", { month: "long", year: "numeric" })}</h3><button class="icon-btn" data-calendar="next">${icon("chevron-right")}</button><button class="btn btn-soft btn-small" data-calendar="today">Today</button></div><div class="calendar-grid">${cells}</div></section><aside class="panel agenda-panel"><span class="eyebrow">UPCOMING</span><h3>Agenda</h3>${
    upcoming
      .map((a) => {
        const d = new Date(a.date + "T00:00:00");
        return `<div class="agenda-item"><div class="agenda-date"><b>${d.getDate()}</b><small>${d.toLocaleDateString("en", { month: "short" }).toUpperCase()}</small></div><div><b>${esc(a.company)}</b><p>${esc(a.position)} · ${esc(a.status)}</p></div></div>`;
      })
      .join("") || `<div class="empty-state">No upcoming dates yet.</div>`
  }</aside></div></div>`;
}
