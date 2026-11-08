import { renderKanban } from "../components/kanban.js";
import { renderList } from "../components/list.js";

import {
    STATUS,
    icon,
    esc,
    relativeTime
} from "../utils.js";

export function renderDashboard({
    user,
    apps,
    activities,
    columns,
    mode,
    filter,
    sort
}) {
    const count = status =>
        apps.filter(app => app.status === status).length;

    let visible = apps.filter(app => {
        const matchesStatus =
            !filter.status || app.status === filter.status;

        const searchText = [
            app.company,
            app.position,
            app.notes,
            app.location
        ].join(" ").toLowerCase();

        const matchesSearch =
            !filter.query ||
            searchText.includes(filter.query.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    visible.sort((a, b) => {
        if (sort === "company") {
            return (a.company || "").localeCompare(
                b.company || ""
            );
        }

        if (sort === "oldest") {
            return (a.updatedAt?.seconds || 0) -
                (b.updatedAt?.seconds || 0);
        }

        return (b.updatedAt?.seconds || 0) -
            (a.updatedAt?.seconds || 0);
    });

    const stats = [
        [
            "Total applications",
            apps.length,
            "briefcase-business",
            "#eeeaff",
            "#675cdb",
            "+12%"
        ],
        [
            "Interviews",
            count("Interview"),
            "calendar-days",
            "#eaf3ff",
            "#4c91e8",
            "+8%"
        ],
        [
            "Offerings",
            count("Offering"),
            "check-circle",
            "#e5f7f0",
            "#22a982",
            "+2"
        ],
        [
            "Rejected",
            count("Rejected"),
            "x",
            "#fff0f1",
            "#df707a",
            "—"
        ]
    ];

    return `
        <div class="page-enter">

            <div class="page-heading dashboard-heading">
                <div>
                    <span class="eyebrow">
                        YOUR CAREER OVERVIEW
                    </span>

                    <h1>
                        Good ${
                            new Date().getHours() < 12
                                ? "morning"
                                : new Date().getHours() < 18
                                    ? "afternoon"
                                    : "evening"
                        },
                        ${esc(
                            user.displayName ||
                            user.email?.split("@")[0] ||
                            "there"
                        )}!
                    </h1>

                    <p>
                        Track your progress and make every opportunity count.
                    </p>
                </div>

                <button
                    class="btn btn-primary heading-add"
                    data-action="add"
                >
                    ${icon("plus")}
                    Add application
                </button>
            </div>

            <div class="stats-grid">
                ${stats.map(stat => `
                    <article class="stat-card">
                        <div class="stat-top">
                            <span
                                class="stat-icon"
                                style="
                                    background:${stat[3]};
                                    color:${stat[4]};
                                "
                            >
                                ${icon(stat[2])}
                            </span>

                            <span class="stat-trend">
                                ${stat[5]}
                            </span>
                        </div>

                        <div class="stat-value">
                            ${stat[1]}
                        </div>

                        <div class="stat-label">
                            ${stat[0]}
                        </div>
                    </article>
                `).join("")}
            </div>

            <div class="dashboard-toolbar">
                <div class="view-switch">
                    <button
                        class="${mode === "kanban" ? "active" : ""}"
                        data-mode="kanban"
                    >
                        ${icon("layout-grid")}
                        Kanban
                    </button>

                    <button
                        class="${mode === "list" ? "active" : ""}"
                        data-mode="list"
                    >
                        ${icon("list")}
                        List
                    </button>
                </div>

                <div class="toolbar-filters">
                    <label class="select-wrap">
                        ${icon("filter")}

                        <select id="status-filter">
                            <option value="">All statuses</option>

                            ${columns.map(column => `
                                <option
                                    value="${esc(column)}"
                                    ${filter.status === column ? "selected" : ""}
                                >
                                    ${esc(column)}
                                </option>
                            `).join("")}
                        </select>
                    </label>

                    <label class="select-wrap">
                        ${icon("arrow-down-wide-narrow")}

                        <select id="sort-filter">
                            <option
                                value="recent"
                                ${sort === "recent" ? "selected" : ""}
                            >
                                Sort: Recent
                            </option>

                            <option
                                value="company"
                                ${sort === "company" ? "selected" : ""}
                            >
                                Sort: Company
                            </option>

                            <option
                                value="oldest"
                                ${sort === "oldest" ? "selected" : ""}
                            >
                                Sort: Oldest
                            </option>
                        </select>
                    </label>

                    <button
                        class="btn btn-soft btn-small"
                        data-action="new-column"
                    >
                        ${icon("plus")}
                        New column
                    </button>
                </div>
            </div>

            ${
                mode === "kanban"
                    ? `
                        <p class="board-hint">
                            ${icon("grip-vertical")}
                            Drag the column header to rearrange your workflow.
                        </p>
                    `
                    : ""
            }

            <div id="board-area">
                ${
                    mode === "kanban"
                        ? renderKanban(visible, columns)
                        : renderList(visible)
                }
            </div>

            <div class="dashboard-bottom">

                <section class="custom-section">
                    <div class="section-heading">
                        <div>
                            <span class="eyebrow">
                                MAKE IT YOURS
                            </span>

                            <h3>Custom columns</h3>
                        </div>

                        <button
                            class="btn btn-soft btn-small"
                            data-action="new-column"
                        >
                            ${icon("plus")}
                            New column
                        </button>
                    </div>

                    <div class="custom-pills">
                        ${
                            columns
                                .filter(column =>
                                    !Object.hasOwn(STATUS, column)
                                )
                                .map(column => `
                                    <div class="custom-pill">
                                        ${esc(column)}
                                        <span>${count(column)}</span>
                                    </div>
                                `).join("")
                            ||
                            `
                                <span class="muted-copy">
                                    Add a custom stage to match your process.
                                </span>
                            `
                        }
                    </div>
                </section>

                <section class="activity-section">
                    <div class="section-heading">
                        <div>
                            <span class="eyebrow">
                                THE LATEST
                            </span>

                            <h3>Recent activity</h3>
                        </div>

                        <button
                            class="text-btn"
                            data-action="all-activity"
                        >
                            See all
                            ${icon("arrow-up-right")}
                        </button>
                    </div>

                    <div class="activity-list">
                        ${
                            activities.slice(0, 4).map(activity => `
                                <div class="activity-item">
                                    <span class="activity-bullet"></span>

                                    <div>
                                        <p>
                                            ${esc(
                                                activity.text ||
                                                "Updated an application"
                                            )}
                                        </p>

                                        <small>
                                            ${relativeTime(activity.createdAt)}
                                        </small>
                                    </div>
                                </div>
                            `).join("")
                            ||
                            `
                                <div class="empty-state">
                                    Your activity will show up here.
                                </div>
                            `
                        }
                    </div>
                </section>

            </div>
        </div>
    `;
}