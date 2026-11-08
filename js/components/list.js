
import { esc, STATUS, formatDate } from "../utils.js";

export function renderList(apps) {
    if (!apps.length) {
        return `<div class="panel empty-state">No applications match your filters.</div>`;
    }

    return `
        <div class="list-panel">
            <table>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Position</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Important date</th>
                    </tr>
                </thead>
                <tbody>
                    ${apps.map(a => {
                        const c = STATUS[a.status]?.color || "#8b83dc";

                        return `
                            <tr data-edit="${esc(a.id)}">
                                <td>
                                    <div class="company-cell">
                                        <span
                                            class="company-logo"
                                            style="--logo-bg:${c}20;--logo-color:${c}"
                                        >
                                            ${esc((a.company || "?")[0].toUpperCase())}
                                        </span>
                                        ${esc(a.company)}
                                    </div>
                                </td>
                                <td>${esc(a.position)}</td>
                                <td>${esc(a.location || "—")}</td>
                                <td>
                                    <span
                                        class="status-pill"
                                        style="--tag-bg:${c}20;--tag-color:${c}"
                                    >
                                        ${esc(a.status)}
                                    </span>
                                </td>
                                <td>${formatDate(a.date)}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}
