import { STATUS, icon, esc } from "../utils.js";
export function renderAnalytics(apps, columns) {
  const total = apps.length,
    sent = apps.filter((a) => a.status !== "Saved").length,
    responses = apps.filter(
      (a) => !["Saved", "Applied"].includes(a.status),
    ).length,
    rate = sent ? Math.round((responses / sent) * 100) : 0;
  const interview = apps.filter((a) => a.status === "Interview").length,
    offers = apps.filter((a) => a.status === "Offering").length;
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 5 + i);
    return {
      label: d.toLocaleDateString("en", { month: "short" }),
      n: apps.filter((a) => {
        const x = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.date || 0);
        return (
          x.getMonth() === d.getMonth() && x.getFullYear() === d.getFullYear()
        );
      }).length,
    };
  });
  const max = Math.max(1, ...months.map((m) => m.n));
  return `<div class="page-enter"><div class="page-heading"><div><span class="eyebrow">INSIGHTS & PERFORMANCE</span><h1>Analytics</h1><p>Understand your job search and spot your next best move.</p></div><div class="date-chip">${icon("calendar-days")} All time</div></div><div class="stats-grid analytics-stats">${[
    ["Applications", total, "briefcase-business"],
    ["Responses", responses, "send"],
    ["Interviews", interview, "calendar-days"],
    ["Offers", offers, "check-circle"],
  ]
    .map(
      (x, i) =>
        `<article class="stat-card"><div class="stat-top"><span class="stat-icon" style="background:${["#eeeaff", "#eaf3ff", "#f1edff", "#e5f7f0"][i]};color:${["#675cdb", "#4c91e8", "#8973e6", "#22a982"][i]}">${icon(x[2])}</span></div><div class="stat-value">${x[1]}</div><div class="stat-label">${x[0]}</div></article>`,
    )
    .join(
      "",
    )}</div><div class="analytics-grid"><section class="panel chart-panel"><div class="section-heading"><div><span class="eyebrow">APPLICATION PIPELINE</span><h3>Applications by status</h3></div><span class="live-chip"><i></i> Live data</span></div><div class="chart-bars">${columns
    .map((s) => {
      const n = apps.filter((a) => a.status === s).length,
        c = STATUS[s]?.color || "#8973e6";
      return `<div class="chart-row"><span>${esc(s)}</span><div class="chart-track"><div class="chart-fill" style="--width:${total ? (n / total) * 100 : 0}%;--bar-color:${c}"></div></div><b>${n}</b></div>`;
    })
    .join(
      "",
    )}</div></section><section class="panel response-panel"><span class="eyebrow">RESPONSE RATE</span><h3>How often companies get back to you</h3><div class="response-ring" style="--progress:${rate}%"><div><b>${rate}%</b><small>response rate</small></div></div><p>${responses} responses from ${sent} submitted applications.</p></section><section class="panel wide-panel"><div class="section-heading"><div><span class="eyebrow">SEARCH MOMENTUM</span><h3>Applications over the last 6 months</h3></div></div><div class="trend-chart">${months.map((m) => `<div class="trend-bar-wrap"><div class="trend-bar" title="${m.n} applications" style="--height:${Math.max(4, (m.n / max) * 100)}%"></div></div>`).join("")}</div><div class="trend-labels">${months.map((m) => `<span>${m.label}</span>`).join("")}</div></section></div></div>`;
}
