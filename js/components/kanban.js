import {
    esc,
    STATUS,
    formatDate,
    icon
} from "../utils.js";

export function renderKanban(apps, columns) {
    return `
        <div class="board-wrap">
            ${columns.map((status) => {
                const items = apps.filter(
                    app => app.status === status
                );

                const color =
                    STATUS[status]?.color || "#8b83dc";

                return `
                    <section
                        class="kanban-column"
                        data-column="${esc(status)}"
                        data-column-drag="${esc(status)}"
                        draggable="true"
                        style="--column-color:${color}"
                    >
                        <div class="column-head">
                            <span class="column-drag-handle" title="Drag column">
                                ${icon("grip-vertical")}
                            </span>

                            <span class="column-dot"></span>

                            <b>${esc(status)}</b>

                            <span class="column-count">
                                ${items.length}
                            </span>

                            <button
                                class="column-add"
                                data-add-status="${esc(status)}"
                                title="Add to ${esc(status)}"
                            >
                                ${icon("plus")}
                            </button>
                        </div>

                        <div class="column-cards">
                            ${
                                items.length
                                    ? items.map(app => `
                                        <article
                                            class="job-card"
                                            draggable="true"
                                            data-id="${esc(app.id)}"
                                            style="
                                                --column-color:${color};
                                                --logo-bg:${STATUS[status]?.bg || "#eee"};
                                                --logo-color:${color};
                                            "
                                        >
                                            <div class="job-card-top">
                                                <span class="company-logo">
                                                    ${esc(
                                                        (app.company || "?")
                                                            .slice(0, 1)
                                                            .toUpperCase()
                                                    )}
                                                </span>

                                                <button
                                                    class="job-menu"
                                                    data-edit="${esc(app.id)}"
                                                >
                                                    ···
                                                </button>
                                            </div>

                                            <h4>${esc(app.company)}</h4>

                                            <p>${esc(app.position)}</p>

                                            <div class="job-meta">
                                                <span>
                                                    ${icon("map-pin")}
                                                    ${esc(app.location || "Remote")}
                                                </span>

                                                <span>
                                                    ${icon("calendar-days")}
                                                    ${formatDate(app.date)}
                                                </span>
                                            </div>
                                        </article>
                                    `).join("")
                                    : `
                                        <div class="column-empty">
                                            No applications yet
                                            <br>
                                            Drop a card here
                                        </div>
                                    `
                            }
                        </div>

                        <button
                            class="column-footer"
                            data-add-status="${esc(status)}"
                        >
                            + Add card
                        </button>
                    </section>
                `;
            }).join("")}
        </div>
    `;
}