
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

import {
    $,
    $$,
    DEFAULT_COLUMNS,
    esc,
    icon,
    renderIcons,
    toast,
    initials
} from "./utils.js";

import { renderDashboard } from "./pages/dashboard.js";
import { renderAnalytics } from "./pages/analytics.js";
import { renderCalendar } from "./pages/calendar.js";
import { renderSettings } from "./pages/settings.js";
import { renderCVBuilder, collectCVForm, renderATSDocument, openCVPrint } from "./pages/cv-builder.js";
import { exportCSV } from "./features/export-csv.js";


// ==========================================
// APPLICATION STATE
// ==========================================

const state = {
    user: null,
    userData: {},
    apps: [],
    activities: [],
    page: "dashboard",
    mode: "kanban",
    filter: "",
    query: "",
    sort: "recent",
    month: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    ),
    editing: null,
    cvData: {}
};

let auth;
let db;
let unsubs = [];
let authMode = "signin";
let registrationInProgress = false;


// ==========================================
// COLUMN MANAGEMENT
// ==========================================

const PINNED_COLUMNS = ["Offering", "Rejected"];

function getOrderedColumns(
    list = state.userData.columns || DEFAULT_COLUMNS
) {
    const normalColumns = list.filter(
        column => !PINNED_COLUMNS.includes(column)
    );

    const finalColumns = PINNED_COLUMNS.filter(
        column => list.includes(column)
    );

    return [...normalColumns, ...finalColumns];
}

const columns = () => getOrderedColumns();

const userRef = () => doc(
    db,
    "users",
    state.user.uid
);

const appsRef = () => collection(
    db,
    "users",
    state.user.uid,
    "applications"
);

const appRef = id => doc(
    db,
    "users",
    state.user.uid,
    "applications",
    id
);

const activityRef = () => collection(
    db,
    "users",
    state.user.uid,
    "activities"
);

const cvRef = () => doc(
    db,
    "users",
    state.user.uid,
    "cv",
    "profile"
);


// ==========================================
// THEME
// ==========================================

function theme(value, persist = true) {
    localStorage.setItem("jobtrack-theme", value);

    const actual = value === "system"
        ? (
            matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
        )
        : value;

    document.documentElement.dataset.theme = actual;

    if (persist && state.user) {
        updateDoc(userRef(), {
            "settings.theme": value
        }).catch(() => {});
    }

    const button = $("#theme-toggle");

    if (button) {
        button.innerHTML = icon(
            actual === "dark" ? "sun" : "moon"
        );
    }
}


// ==========================================
// ROUTING
// ==========================================

function pageFromHash() {
    const page = location.hash.replace("#", "");

    const validPages = [
        "dashboard",
        "analytics",
        "calendar",
        "cv",
        "settings"
    ];

    return validPages.includes(page)
        ? page
        : "dashboard";
}


// ==========================================
// RENDER APPLICATION
// ==========================================

function render() {
    if (!state.user) return;

    state.page = pageFromHash();

    $("#breadcrumb-page").textContent =
        state.page.charAt(0).toUpperCase() +
        state.page.slice(1);

    $$("[data-route]").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.route === state.page
        );
    });

    const content = $("#page-content");

    content.classList.remove("page-switch");

    void content.offsetWidth;

    content.classList.add("page-switch");

    const args = {
        user: state.user,
        apps: state.apps,
        activities: state.activities,
        columns: columns(),
        mode: state.mode,
        filter: {
            status: state.filter,
            query: state.query
        },
        sort: state.sort
    };

    switch (state.page) {
        case "dashboard":
            content.innerHTML = renderDashboard(args);
            break;

        case "analytics":
            content.innerHTML = renderAnalytics(
                state.apps,
                columns()
            );
            break;

        case "calendar":
            content.innerHTML = renderCalendar(
                state.apps,
                state.month
            );
            break;

        case "cv":
            content.innerHTML = renderCVBuilder(state.cvData);
            break;

        case "settings":
            content.innerHTML = renderSettings(
                state.user,
                localStorage.getItem("jobtrack-theme") || "light"
            );
            break;
    }

    renderIcons(content);

    // Enable dragging for Kanban columns.
    if (
        state.page === "dashboard" &&
        state.mode === "kanban"
    ) {
        $$(".kanban-column", content).forEach(column => {
            column.setAttribute("draggable", "true");
        });
    }

    $("#sidebar-name").textContent =
        state.user.displayName ||
        state.user.email?.split("@")[0] ||
        "Account";

    $("#sidebar-email").textContent =
        state.user.email || "";

    $("#sidebar-avatar").textContent = initials(
        state.user.displayName ||
        state.user.email ||
        "J"
    );

    $("#top-avatar").textContent = initials(
        state.user.displayName ||
        state.user.email ||
        "J"
    );

    if (state.page === "dashboard") {
        const statusFilter = $("#status-filter");
        const sortFilter = $("#sort-filter");

        if (statusFilter) {
            statusFilter.value = state.filter;
        }

        if (sortFilter) {
            sortFilter.value = state.sort;
        }
    }
}


// ==========================================
// FIREBASE SESSION
// ==========================================

async function session(user) {
    unsubs.forEach(unsubscribe => unsubscribe());
    unsubs = [];

    state.user = user;

    const loading = $("#app-loading");

    if (loading) {
        loading.hidden = true;
    }

    $("#auth-screen").hidden = !!user;
    $("#app-shell").hidden = !user;

    if (!user) {
        state.userData = {};
        state.apps = [];
        state.activities = [];
        return;
    }

    try {
        const reference = userRef();

        let snapshot = await getDoc(reference);

        if (!snapshot.exists()) {
            await setDoc(reference, {
                displayName:
                    user.displayName ||
                    user.email.split("@")[0],

                email: user.email,

                columns: DEFAULT_COLUMNS,

                settings: {
                    theme:
                        localStorage.getItem("jobtrack-theme") ||
                        "light"
                },

                createdAt: serverTimestamp()
            });

            snapshot = await getDoc(reference);
        }

        state.userData = snapshot.data();

        const cvSnapshot = await getDoc(cvRef());
        state.cvData = cvSnapshot.exists() ? cvSnapshot.data() : {};

        if (state.userData.settings?.theme) {
            theme(state.userData.settings.theme, false);
        }

        if (!location.hash) {
            location.hash = "dashboard";
        }

        // Listen to user document.
        unsubs.push(
            onSnapshot(reference, snapshot => {
                if (snapshot.exists()) {
                    state.userData = snapshot.data();
                    render();
                }
            })
        );

        // Listen to applications.
        unsubs.push(
            onSnapshot(appsRef(), snapshot => {
                state.apps = snapshot.docs.map(document => ({
                    id: document.id,
                    ...document.data()
                }));

                render();
            })
        );

        // Listen to activities.
        unsubs.push(
            onSnapshot(
                query(
                    activityRef(),
                    orderBy("createdAt", "desc")
                ),
                snapshot => {
                    state.activities = snapshot.docs.map(
                        document => document.data()
                    );

                    render();
                }
            )
        );

        render();

    } catch (error) {
        toast(
            "Could not load workspace: " + error.message,
            "error"
        );

        console.error(error);
    }
}


// ==========================================
// AUTHENTICATION UI
// ==========================================

function showAuthError(message) {
    $("#auth-error").textContent = message;
}

function setAuthMode(mode) {
    authMode = mode;

    const isSignup = mode === "signup";
    const isForgot = mode === "forgot";

    $("#name-wrap").hidden = !isSignup;
    $("#confirm-password-wrap").hidden = !isSignup;
    $("#password-wrap").hidden = isForgot;

    $("#auth-name").required = isSignup;
    $("#auth-confirm-password").required = isSignup;
    $("#auth-password").required = !isForgot;

    $("#auth-title").textContent = isSignup
        ? "Create your account"
        : isForgot
            ? "Reset your password"
            : "Sign in to your workspace";

    $("#auth-subtitle").textContent = isSignup
        ? "Start organizing your next career move."
        : isForgot
            ? "We will send you a password reset link."
            : "Track your applications and keep your momentum.";

    $("#auth-submit").innerHTML =
        (
            isSignup
                ? "Create account"
                : isForgot
                    ? "Send reset link"
                    : "Sign in"
        ) + ' <span>→</span>';

    $("#auth-toggle").textContent = isSignup
        ? "Already have an account? Sign in"
        : "Create an account";

    $("#auth-toggle").hidden = isForgot;
    $("#forgot-link").hidden = mode !== "signin";
    $("#google-signin").hidden = mode !== "signin";

    $(".auth-heading .eyebrow").textContent = isSignup
        ? "GET STARTED"
        : isForgot
            ? "ACCOUNT RECOVERY"
            : "WELCOME BACK";

    showAuthError("");
}


// ==========================================
// AUTHENTICATION ERROR
// ==========================================

function authError(error) {
    const messages = {
        "auth/invalid-credential":
            "Email or password is incorrect.",

        "auth/email-already-in-use":
            "This email is already registered.",

        "auth/weak-password":
            "Password must contain at least 6 characters.",

        "auth/popup-closed-by-user":
            "Google sign-in was cancelled.",

        "auth/invalid-email":
            "Please enter a valid email address.",

        "auth/network-request-failed":
            "Network error. Please check your connection.",

        "auth/too-many-requests":
            "Too many attempts. Please try again later."
    };

    showAuthError(
        messages[error.code] ||
        error.message ||
        "Something went wrong. Please try again."
    );
}


// ==========================================
// APPLICATION MODAL
// ==========================================

async function openModal(id = null, status = null) {
    state.editing = id;

    const form = $("#application-form");

    form.reset();

    form.elements.status.innerHTML = columns()
        .map(column => `
            <option value="${esc(column)}">
                ${esc(column)}
            </option>
        `)
        .join("");

    const application = state.apps.find(
        item => item.id === id
    );

    $("#dialog-title").textContent = application
        ? "Edit application"
        : "Add application";

    $("#delete-application").hidden = !application;

    if (application) {
        const fields = [
            "company",
            "position",
            "location",
            "status",
            "date",
            "url",
            "notes"
        ];

        fields.forEach(field => {
            form.elements[field].value =
                application[field] || "";
        });
    }

    if (status) {
        form.elements.status.value = status;
    }

    $("#application-dialog").showModal();

    renderIcons($("#application-dialog"));
}


// ==========================================
// ACTIVITY
// ==========================================

async function addActivity(text) {
    await addDoc(activityRef(), {
        text,
        createdAt: serverTimestamp()
    });
}


// ==========================================
// APPLICATION CRUD
// ==========================================

async function submitApp(event) {
    event.preventDefault();

    const data = Object.fromEntries(
        new FormData(event.currentTarget)
    );

    data.updatedAt = serverTimestamp();

    try {
        if (state.editing) {
            await updateDoc(
                appRef(state.editing),
                data
            );

            await addActivity(
                `Updated ${data.company} · ${data.status}`
            );

        } else {
            await addDoc(appsRef(), {
                ...data,
                createdAt: serverTimestamp()
            });

            await addActivity(
                `Added ${data.company} to ${data.status}`
            );
        }

        $("#application-dialog").close();

        toast("Application saved.");

    } catch (error) {
        toast(
            "Could not save: " + error.message,
            "error"
        );
    }
}


async function removeApp() {
    if (
        !state.editing ||
        !confirm("Delete this application?")
    ) {
        return;
    }

    const application = state.apps.find(
        item => item.id === state.editing
    );

    try {
        await deleteDoc(appRef(state.editing));

        if (application) {
            await addActivity(
                `Removed ${application.company}`
            );
        }

        $("#application-dialog").close();

        toast("Application deleted.");

    } catch (error) {
        toast(error.message, "error");
    }
}


async function moveApp(id, status) {
    const application = state.apps.find(
        item => item.id === id
    );

    if (!application || application.status === status) {
        return;
    }

    try {
        await updateDoc(appRef(id), {
            status,
            updatedAt: serverTimestamp()
        });

        await addActivity(
            `Moved ${application.company} from ${application.status} to ${status}`
        );

        toast(
            `${application.company} moved to ${status}`
        );

    } catch (error) {
        toast(error.message, "error");
    }
}


// ==========================================
// CUSTOM COLUMN MODAL
// ==========================================

function createColumnModal() {
    if ($("#column-dialog")) return;

    const dialog = document.createElement("dialog");

    dialog.id = "column-dialog";
    dialog.className = "app-dialog";

    dialog.innerHTML = `
        <form id="column-form">

            <div class="dialog-head">
                <div>
                    <span class="eyebrow">
                        WORKSPACE CUSTOMIZATION
                    </span>

                    <h2>Create new column</h2>
                </div>

                <button
                    type="button"
                    class="icon-btn"
                    id="column-close"
                    aria-label="Close"
                >
                    ${icon("x")}
                </button>
            </div>

            <div class="form-grid">

                <label class="field span-2">
                    <span>Column name *</span>

                    <input
                        type="text"
                        id="column-name"
                        placeholder="e.g. Medical Check Up"
                        maxlength="30"
                        required
                    >
                </label>

            </div>

            <p
                id="column-error"
                class="form-error"
                role="alert"
            ></p>

            <div class="dialog-actions">

                <span class="dialog-spacer"></span>

                <button
                    type="button"
                    class="btn btn-ghost"
                    id="column-cancel"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="btn btn-primary"
                >
                    Create column ${icon("arrow-right")}
                </button>

            </div>

        </form>
    `;

    document.body.appendChild(dialog);

    $("#column-form").addEventListener(
        "submit",
        submitColumn
    );

    $("#column-close").addEventListener(
        "click",
        () => dialog.close()
    );

    $("#column-cancel").addEventListener(
        "click",
        () => dialog.close()
    );

    renderIcons(dialog);
}


function newColumn() {
    createColumnModal();

    const dialog = $("#column-dialog");
    const form = $("#column-form");

    form.reset();

    $("#column-error").textContent = "";

    dialog.showModal();

    $("#column-name").focus();
}


// ==========================================
// REORDER KANBAN COLUMNS
// ==========================================

async function reorderColumn(draggedColumn, targetColumn) {
    if (!draggedColumn || !targetColumn) return;

    if (draggedColumn === targetColumn) return;

    const currentColumns = [...columns()];

    // Offering and Rejected cannot be moved.
    if (PINNED_COLUMNS.includes(draggedColumn)) {
        toast(
            "Offering and Rejected must stay at the end.",
            "error"
        );

        return;
    }

    const draggedIndex = currentColumns.indexOf(
        draggedColumn
    );

    const targetIndex = currentColumns.indexOf(
        targetColumn
    );

    if (draggedIndex === -1 || targetIndex === -1) {
        return;
    }

    // Remove dragged column.
    const updatedColumns = currentColumns.filter(
        column => column !== draggedColumn
    );

    // Insert before the target column.
    // If target is Offering or Rejected,
    // insert before the pinned columns.
    const insertIndex = PINNED_COLUMNS.includes(targetColumn)
        ? updatedColumns.findIndex(
            column => PINNED_COLUMNS.includes(column)
        )
        : updatedColumns.indexOf(targetColumn);

    updatedColumns.splice(
        insertIndex === -1
            ? updatedColumns.length
            : insertIndex,
        0,
        draggedColumn
    );

    const finalColumns = getOrderedColumns(
        updatedColumns
    );

    try {
        await updateDoc(userRef(), {
            columns: finalColumns
        });

        state.userData.columns = finalColumns;

        render();

        toast("Column order updated.");

    } catch (error) {
        toast(
            "Could not update column order: " + error.message,
            "error"
        );
    }
}


// ==========================================
// SUBMIT NEW COLUMN
// ==========================================

async function submitColumn(event) {
    event.preventDefault();

    const input = $("#column-name");
    const errorElement = $("#column-error");

    const name = input.value.trim();

    errorElement.textContent = "";

    if (!name) {
        errorElement.textContent =
            "Please enter a column name.";

        input.focus();

        return;
    }

    if (
        columns().some(
            column =>
                column.toLowerCase() === name.toLowerCase()
        )
    ) {
        errorElement.textContent =
            "This column already exists.";

        input.focus();

        return;
    }

    try {
        const currentColumns = columns();

        const finalColumns = [
            ...currentColumns.filter(
                column => !PINNED_COLUMNS.includes(column)
            ),

            name,

            ...currentColumns.filter(
                column => PINNED_COLUMNS.includes(column)
            )
        ];

        await updateDoc(userRef(), {
            columns: finalColumns
        });

        state.userData.columns = finalColumns;

        $("#column-dialog").close();

        render();

        toast("New column created.");

    } catch (error) {
        errorElement.textContent = error.message;
    }
}


// ==========================================
// AUTHENTICATION SUBMIT
// ==========================================

async function handleAuthSubmit(event) {
    event.preventDefault();

    showAuthError("");

    const email = $("#auth-email").value.trim();

    const password = $("#auth-password").value;

    const fullName = $("#auth-name").value.trim();

    const confirmPassword =
        $("#auth-confirm-password").value;

    const submitButton = $("#auth-submit");

    submitButton.disabled = true;

    try {
        // Forgot password.
        if (authMode === "forgot") {
            await sendPasswordResetEmail(auth, email);

            toast("Reset link sent. Check your inbox.");

            setAuthMode("signin");

            return;
        }

        // Registration.
        if (authMode === "signup") {
            if (!fullName) {
                showAuthError(
                    "Please enter your full name."
                );

                return;
            }

            if (password.length < 6) {
                showAuthError(
                    "Password must contain at least 6 characters."
                );

                return;
            }

            if (password !== confirmPassword) {
                showAuthError(
                    "Password confirmation does not match."
                );

                return;
            }

            registrationInProgress = true;

            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            await updateProfile(credential.user, {
                displayName: fullName
            });

            // Return to login after registration.
            await signOut(auth);

            registrationInProgress = false;

            $("#auth-email").value = email;

            $("#auth-password").value = "";
            $("#auth-confirm-password").value = "";

            setAuthMode("signin");

            toast(
                "Account created successfully. Please sign in."
            );

            return;
        }

        // Normal login.
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    } catch (error) {
        registrationInProgress = false;

        authError(error);

    } finally {
        submitButton.disabled = false;
    }
}


// ==========================================
// EVENT LISTENERS
// ==========================================

function initEvents() {
    // CV Builder: save profile and export an ATS-friendly PDF.
    $("#page-content").addEventListener("submit", async event => {
        if (event.target.id !== "cv-form") return;
        event.preventDefault();
        const saveButton = event.target.querySelector('[type="submit"]');
        if (saveButton) { saveButton.disabled = true; saveButton.textContent = "Saving..."; }
        try {
            state.cvData = collectCVForm(event.target);
            await setDoc(cvRef(), { ...state.cvData, updatedAt: serverTimestamp() });
            toast("CV berhasil disimpan.", "success");
        } catch (error) {
            toast("Gagal menyimpan CV: " + error.message, "error");
        } finally {
            if (saveButton) { saveButton.disabled = false; saveButton.textContent = "Save CV"; }
        }
    });

    const updateCVPreview = event => {
        const form = event.target.closest("#cv-form");
        if (!form) return;
        const preview = $("#cv-live-preview");
        if (preview) preview.innerHTML = renderATSDocument(collectCVForm(form));
    };

    $("#page-content").addEventListener("input", updateCVPreview);
    $("#page-content").addEventListener("change", updateCVPreview);

    // Keep the text selection when clicking rich-text toolbar controls.
    $("#page-content").addEventListener("mousedown", event => {
        if (event.target.closest("[data-rich-command]")) event.preventDefault();
    });

    $("#page-content").addEventListener("click", event => {
        const commandButton = event.target.closest("[data-rich-command]");
        if (commandButton) {
            const editor = commandButton.closest(".cv-rich-editor")?.querySelector("[contenteditable='true']");
            if (!editor) return;
            editor.focus();
            document.execCommand(commandButton.dataset.richCommand, false, null);
            updateCVPreview({ target: editor });
            return;
        }

        const exportButton = event.target.closest("[data-export-cv]");
        if (!exportButton) return;
        const form = $("#cv-form");
        if (!form) return;
        const data = collectCVForm(form);
        state.cvData = data;
        openCVPrint(data);
    });


    // --------------------------------------
    // Authentication
    // --------------------------------------

    $("#auth-form").addEventListener(
        "submit",
        handleAuthSubmit
    );

    $("#auth-toggle").addEventListener(
        "click",
        event => {
            event.preventDefault();

            setAuthMode(
                authMode === "signup"
                    ? "signin"
                    : "signup"
            );
        }
    );

    $("#forgot-link").addEventListener(
        "click",
        event => {
            event.preventDefault();

            setAuthMode("forgot");
        }
    );

    $("#google-signin").addEventListener(
        "click",
        async () => {
            try {
                await signInWithPopup(
                    auth,
                    new GoogleAuthProvider()
                );

            } catch (error) {
                authError(error);
            }
        }
    );


    // --------------------------------------
    // Main navigation
    // --------------------------------------

    $("#main-nav").addEventListener(
        "click",
        event => {
            const link = event.target.closest(
                "[data-route]"
            );

            if (!link) return;

            event.preventDefault();

            location.hash = link.dataset.route;

            $("#sidebar").classList.remove("open");
        }
    );

    window.addEventListener(
        "hashchange",
        render
    );


    // --------------------------------------
    // Theme
    // --------------------------------------

    $("#theme-toggle").addEventListener(
        "click",
        () => {
            theme(
                document.documentElement.dataset.theme === "dark"
                    ? "light"
                    : "dark"
            );
        }
    );


    // --------------------------------------
    // Add application
    // --------------------------------------

    $("#top-add").addEventListener(
        "click",
        () => openModal()
    );


    // --------------------------------------
    // Page content interactions
    // --------------------------------------

    $("#page-content").addEventListener(
        "click",
        async event => {

            const edit = event.target.closest(
                "[data-edit]"
            );

            if (edit) {
                openModal(edit.dataset.edit);
                return;
            }

            const mode = event.target.closest(
                "[data-mode]"
            );

            if (mode) {
                state.mode = mode.dataset.mode;
                render();
                return;
            }

            const addStatus = event.target.closest(
                "[data-add-status]"
            );

            if (addStatus) {
                openModal(
                    null,
                    addStatus.dataset.addStatus
                );

                return;
            }

            const calendar = event.target.closest(
                "[data-calendar]"
            );

            if (calendar) {
                const value = calendar.dataset.calendar;

                state.month = value === "today"
                    ? new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                    )
                    : new Date(
                        state.month.getFullYear(),
                        state.month.getMonth() +
                        (value === "next" ? 1 : -1),
                        1
                    );

                render();

                return;
            }

            const themeChoice = event.target.closest(
                "[data-theme-choice]"
            );

            if (themeChoice) {
                theme(themeChoice.dataset.themeChoice);
                render();
                return;
            }

            const action = event.target.closest(
                "[data-action]"
            )?.dataset.action;

            if (!action) return;

            try {
                if (action === "add") {
                    openModal();
                }

                if (action === "new-column") {
                    newColumn();
                }

                if (action === "save-profile") {
                    const name = $("#settings-name").value.trim();

                    await updateProfile(state.user, {
                        displayName: name
                    });

                    await updateDoc(userRef(), {
                        displayName: name
                    });

                    toast("Profile updated.");

                    render();
                }

                if (action === "export") {
                    exportCSV(state.apps);

                    toast("CSV exported.");
                }

                if (action === "reset-password") {
                    await sendPasswordResetEmail(
                        auth,
                        state.user.email
                    );

                    toast("Password reset email sent.");
                }

                if (action === "signout") {
                    await signOut(auth);
                }

                if (action === "all-activity") {
                    toast(
                        "Showing your latest activity on the dashboard."
                    );
                }

            } catch (error) {
                toast(error.message, "error");
            }
        }
    );


    // --------------------------------------
    // Dashboard filters
    // --------------------------------------

    $("#page-content").addEventListener(
        "change",
        event => {

            if (event.target.id === "status-filter") {
                state.filter = event.target.value;
                render();
            }

            if (event.target.id === "sort-filter") {
                state.sort = event.target.value;
                render();
            }
        }
    );


    // --------------------------------------
    // Global search
    // --------------------------------------

    $("#global-search").addEventListener(
        "input",
        event => {
            state.query = event.target.value;

            if (state.page === "dashboard") {
                render();
            }
        }
    );


    // --------------------------------------
    // Application form
    // --------------------------------------

    $("#application-form").addEventListener(
        "submit",
        submitApp
    );

    $("#dialog-close").addEventListener(
        "click",
        () => $("#application-dialog").close()
    );

    $("#cancel-dialog").addEventListener(
        "click",
        () => $("#application-dialog").close()
    );

    $("#delete-application").addEventListener(
        "click",
        removeApp
    );


    // ======================================
    // KANBAN DRAG AND DROP
    // ======================================

    $("#page-content").addEventListener(
        "dragstart",
        event => {

            // Check card first so dragging a card
            // is not mistaken for dragging its column.
            const card = event.target.closest(".job-card");

            if (card) {
                event.dataTransfer.setData(
                    "application/kanban-card",
                    card.dataset.id
                );

                event.dataTransfer.effectAllowed = "move";

                card.classList.add("card-dragging");

                return;
            }

            // Drag column.
            const column = event.target.closest(
                ".kanban-column"
            );

            if (column) {
                draggedColumn = column.dataset.column;

                event.dataTransfer.setData(
                    "application/kanban-column",
                    draggedColumn
                );

                event.dataTransfer.effectAllowed = "move";

                column.classList.add("column-dragging");
            }
        }
    );


    $("#page-content").addEventListener(
        "dragend",
        () => {
            draggedColumn = null;

            $$(".kanban-column").forEach(column => {
                column.classList.remove(
                    "column-dragging",
                    "drag-over"
                );
            });

            $$(".job-card").forEach(card => {
                card.classList.remove("card-dragging");
            });
        }
    );


    $("#page-content").addEventListener(
        "dragover",
        event => {
            const column = event.target.closest(
                ".kanban-column"
            );

            if (!column) return;

            event.preventDefault();

            column.classList.add("drag-over");

            event.dataTransfer.dropEffect = "move";
        }
    );


    $("#page-content").addEventListener(
        "dragleave",
        event => {
            const column = event.target.closest(
                ".kanban-column"
            );

            if (
                column &&
                !column.contains(event.relatedTarget)
            ) {
                column.classList.remove("drag-over");
            }
        }
    );


    $("#page-content").addEventListener(
        "drop",
        async event => {
            const targetColumn = event.target.closest(
                ".kanban-column"
            );

            if (!targetColumn) return;

            event.preventDefault();

            targetColumn.classList.remove("drag-over");

            // Determine dragged item type.
            const columnData = event.dataTransfer.getData(
                "application/kanban-column"
            );

            // Reorder columns.
            if (columnData) {
                await reorderColumn(
                    columnData,
                    targetColumn.dataset.column
                );

                return;
            }

            // Move application card.
            const applicationId = event.dataTransfer.getData(
                "application/kanban-card"
            );

            if (applicationId) {
                moveApp(
                    applicationId,
                    targetColumn.dataset.column
                );
            }
        }
    );


    // --------------------------------------
    // Sidebar and profile
    // --------------------------------------

    $("#mobile-menu").addEventListener(
        "click",
        () => {
            $("#sidebar").classList.toggle("open");
        }
    );

    $("#sidebar-menu").addEventListener(
        "click",
        () => {
            location.hash = "settings";
        }
    );

    $("#profile-trigger").addEventListener(
        "click",
        () => {
            location.hash = "settings";
        }
    );


    // --------------------------------------
    // Notifications
    // --------------------------------------

    $("#notification-btn").addEventListener(
        "click",
        () => {
            toast(
                state.activities[0]?.text ||
                "You're all caught up."
            );
        }
    );


    // --------------------------------------
    // Keyboard shortcuts
    // --------------------------------------

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();

                $("#global-search").focus();
            }

            if (event.key === "Escape") {
                $("#sidebar").classList.remove("open");
            }
        }
    );
}


// ==========================================
// APPLICATION STARTUP
// ==========================================

function start() {
    renderIcons();

    const loading = $("#app-loading");

    if (loading) {
        loading.hidden = false;
    }

    $("#auth-screen").hidden = true;
    $("#app-shell").hidden = true;

    initEvents();

    setAuthMode("signin");

    theme(
        localStorage.getItem("jobtrack-theme") || "light",
        false
    );

    if (!firebaseConfig?.apiKey) {
        if (loading) {
            loading.hidden = true;
        }

        $("#auth-screen").hidden = false;

        showAuthError(
            "Firebase configuration is missing."
        );

        return;
    }

    const app = initializeApp(firebaseConfig);

    auth = getAuth(app);

    db = getFirestore(app);

    onAuthStateChanged(auth, user => {
        if (registrationInProgress) {
            return;
        }

        session(user);
    });
}


// ==========================================
// START APPLICATION
// ==========================================

let draggedColumn = null;

start();
