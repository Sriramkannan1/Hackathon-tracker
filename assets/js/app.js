/* =====================================================
   HACKATHON COMMAND CENTER
   APP.JS
===================================================== */

/* =====================================================
   STORAGE KEYS
===================================================== */

const STORAGE_KEYS = {
    USERS: "hack_users",
    CURRENT_USER: "hack_current_user",
    HACKATHONS: "hackathons",
    TASKS: "hack_tasks"
};

/* =====================================================
   DEMO USER
===================================================== */

function initializeDemoUser() {

    const users = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.USERS)
    ) || [];

    if (users.length === 0) {

        users.push({
            email: "admin@gmail.com",
            password: "123456",
            role: "Admin"
        });

        localStorage.setItem(
            STORAGE_KEYS.USERS,
            JSON.stringify(users)
        );
    }
}

initializeDemoUser();

/* =====================================================
   UTILITIES
===================================================== */

function generateId(prefix = "ID") {

    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.floor(Math.random() * 9999)
    );
}

function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}

function getData(key) {

    return JSON.parse(
        localStorage.getItem(key)
    ) || [];
}

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

function daysBetween(date) {

    const today = new Date();

    const target = new Date(date);

    const diff =
        target.getTime() -
        today.getTime();

    return Math.ceil(
        diff /
        (1000 * 60 * 60 * 24)
    );
}

/* =====================================================
   AUTHENTICATION
===================================================== */

function loginUser(email, password) {

    const users = getData(
        STORAGE_KEYS.USERS
    );

    const user = users.find(
        u =>
            u.email === email &&
            u.password === password
    );

    if (!user) {

        alert(
            "Invalid Email or Password"
        );

        return false;
    }

    localStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(user)
    );

    window.location.href =
        "dashboard.html";

    return true;
}

function logoutUser() {

    localStorage.removeItem(
        STORAGE_KEYS.CURRENT_USER
    );

    window.location.href =
        "login.html";
}

function checkAuth() {

    const user = localStorage.getItem(
        STORAGE_KEYS.CURRENT_USER
    );

    if (!user) {

        window.location.href =
            "login.html";
    }
}

/* =====================================================
   LOGIN PAGE
===================================================== */

function initializeLoginPage() {

    const form =
        document.getElementById(
            "loginForm"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const email =
                document.getElementById(
                    "email"
                ).value;

            const password =
                document.getElementById(
                    "password"
                ).value;

            loginUser(
                email,
                password
            );
        }
    );
}

/* =====================================================
   DYNAMIC ROUND GENERATOR
===================================================== */

function generateRounds() {

    const roundCount =
        document.getElementById(
            "numberOfRounds"
        );

    const container =
        document.getElementById(
            "roundsContainer"
        );

    if (!roundCount ||
        !container) return;

    const count =
        parseInt(roundCount.value);

    container.innerHTML = "";

    for (
        let i = 1;
        i <= count;
        i++
    ) {

        const round = document.createElement(
            "div"
        );

        round.className =
            "round-card";

        round.innerHTML = `
            <div class="round-title">
                Round ${i}
            </div>

            <div class="form-grid">

                <div class="form-group">
                    <label>
                        Round Name
                    </label>

                    <input
                        type="text"
                        class="form-control"
                        id="roundName${i}"
                        required
                    >
                </div>

                <div class="form-group">
                    <label>
                        Round Date
                    </label>

                    <input
                        type="date"
                        class="form-control"
                        id="roundDate${i}"
                        required
                    >
                </div>

                <div class="form-group">
                    <label>
                        Round Time
                    </label>

                    <input
                        type="time"
                        class="form-control"
                        id="roundTime${i}"
                        required
                    >
                </div>

            </div>
        `;

        container.appendChild(
            round
        );
    }
}

/* =====================================================
   TASK GENERATION ENGINE
===================================================== */

function createTask(
    hackathonId,
    hackathonName,
    taskName,
    deadline
) {

    return {

        taskId:
            generateId("TASK"),

        hackathonId,

        hackathonName,

        taskName,

        deadline,

        status:
            "Pending"
    };
}

function generateTasks(data) {

    const tasks = [];

    const hackId =
        data.id;

    const name =
        data.hackathonName;

    /* PPT */

    if (
        data.pptRequired &&
        data.pptDate
    ) {

        const ppt =
            new Date(data.pptDate);

        tasks.push(
            createTask(
                hackId,
                name,
                "Prepare PPT",
                new Date(
                    ppt.getTime() -
                    2 * 86400000
                )
            )
        );

        tasks.push(
            createTask(
                hackId,
                name,
                "Review PPT",
                new Date(
                    ppt.getTime() -
                    86400000
                )
            )
        );

        tasks.push(
            createTask(
                hackId,
                name,
                "Submit PPT",
                ppt
            )
        );
    }

    /* VIDEO */

    if (
        data.videoRequired &&
        data.videoDate
    ) {

        const video =
            new Date(data.videoDate);

        tasks.push(
            createTask(
                hackId,
                name,
                "Record Demo",
                new Date(
                    video.getTime() -
                    2 * 86400000
                )
            )
        );

        tasks.push(
            createTask(
                hackId,
                name,
                "Edit Video",
                new Date(
                    video.getTime() -
                    86400000
                )
            )
        );

        tasks.push(
            createTask(
                hackId,
                name,
                "Upload Video",
                video
            )
        );
    }

    /* REPORT */

    if (
        data.reportRequired &&
        data.reportDate
    ) {

        const report =
            new Date(
                data.reportDate
            );

        tasks.push(
            createTask(
                hackId,
                name,
                "Draft Report",
                new Date(
                    report.getTime() -
                    2 * 86400000
                )
            )
        );

        tasks.push(
            createTask(
                hackId,
                name,
                "Review Report",
                new Date(
                    report.getTime() -
                    86400000
                )
            )
        );

        tasks.push(
            createTask(
                hackId,
                name,
                "Submit Report",
                report
            )
        );
    }

    return tasks;
}

/* =====================================================
   REGISTER HACKATHON
===================================================== */

function initializeRegisterPage() {

    const form =
        document.getElementById(
            "hackathonForm"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const rounds = [];

            const count =
                parseInt(
                    document.getElementById(
                        "numberOfRounds"
                    ).value
                );

            for (
                let i = 1;
                i <= count;
                i++
            ) {

                rounds.push({
                    name:
                        document.getElementById(
                            `roundName${i}`
                        ).value,

                    date:
                        document.getElementById(
                            `roundDate${i}`
                        ).value,

                    time:
                        document.getElementById(
                            `roundTime${i}`
                        ).value
                });
            }

            const hackathon = {

    id: generateId("HACK"),

    /* BASIC DETAILS */

    hackathonName:
        document.getElementById(
            "hackathonName"
        ).value,

    organizer:
        document.getElementById(
            "organizer"
        ).value,

    summary:
        document.getElementById(
            "summary"
        ).value,

    mode:
        document.getElementById(
            "mode"
        )?.value || "",

    website:
        document.getElementById(
            "website"
        )?.value || "",

    registrationDate:
        document.getElementById(
            "registrationDate"
        )?.value || "",

    registrationDeadline:
        document.getElementById(
            "registrationDeadline"
        )?.value || "",

    teamCreated:
    document.getElementById(
        "teamCreated"
    )?.value || "No",

confirmationReceived:
    document.getElementById(
        "confirmationReceived"
    )?.value || "No",

    teamLeader:
        document.getElementById(
            "teamLeader"
        )?.value || "",

    fees:
        document.getElementById(
            "fees"
        )?.value || "",

    /* PROBLEM DETAILS */

    problemTheme:
        document.getElementById(
            "problemTheme"
        )?.value || "",

    problemStatement:
        document.getElementById(
            "problemStatement"
        )?.value || "",

    /* ROUND DETAILS */

    numberOfRounds: count,

    selectedRound:
        document.getElementById(
            "selectedRound"
        )?.value || "",

    placeAchieved:
        document.getElementById(
            "placeAchieved"
        )?.value || "",

    /* SUBMISSION REQUIREMENTS */

    pptRequired:
        document.getElementById(
            "pptRequired"
        ).checked,

    pptDate:
        document.getElementById(
            "pptDate"
        ).value,

    videoRequired:
        document.getElementById(
            "videoRequired"
        ).checked,

    videoDate:
        document.getElementById(
            "videoDate"
        ).value,

    reportRequired:
        document.getElementById(
            "reportRequired"
        ).checked,

    reportDate:
        document.getElementById(
            "reportDate"
        ).value,

    /* ROUNDS ARRAY */

    rounds,

    createdAt:
        new Date()
};

            const hacks =
                getData(
                    STORAGE_KEYS.HACKATHONS
                );

            hacks.push(
                hackathon
            );

            saveData(
                STORAGE_KEYS.HACKATHONS,
                hacks
            );

            const tasks =
                getData(
                    STORAGE_KEYS.TASKS
                );

            tasks.push(
                ...generateTasks(
                    hackathon
                )
            );

            saveData(
                STORAGE_KEYS.TASKS,
                tasks
            );

            alert(
                "Hackathon Registered Successfully!"
            );

            form.reset();

            document.getElementById(
                "roundsContainer"
            ).innerHTML = "";
        }
    );
}

/* =====================================================
   DASHBOARD
===================================================== */

function loadDashboard() {

    const totalHackathons =
        document.getElementById(
            "totalHackathons"
        );

    if (!totalHackathons)
        return;

    const hacks =
        getData(
            STORAGE_KEYS.HACKATHONS
        );

    const tasks =
        getData(
            STORAGE_KEYS.TASKS
        );

    const pending =
        tasks.filter(
            t =>
                t.status ===
                "Pending"
        );

    const completed =
        tasks.filter(
            t =>
                t.status ===
                "Completed"
        );

    const upcoming =
        pending.filter(
            task =>
                daysBetween(
                    task.deadline
                ) <= 7
        );

    totalHackathons.innerText =
        hacks.length;

    document.getElementById(
        "upcomingDeadlines"
    ).innerText =
        upcoming.length;

    document.getElementById(
        "pendingTasks"
    ).innerText =
        pending.length;

    document.getElementById(
        "completedTasks"
    ).innerText =
        completed.length;

    loadRecentHackathons(
        hacks
    );
}

/* =====================================================
   RECENT HACKATHONS
===================================================== */

function loadRecentHackathons(
    hacks
) {

    const table =
        document.getElementById(
            "recentHackathons"
        );

    if (!table)
        return;

    table.innerHTML = "";

    hacks
        .slice(-5)
        .reverse()
        .forEach(
            hack => {

                table.innerHTML += `
                <tr>
                    <td>
                        ${hack.hackathonName}
                    </td>

                    <td>
                        ${hack.organizer}
                    </td>

                    <td>
                        ${hack.numberOfRounds}
                    </td>

                    <td>
                        ${formatDate(
                            hack.createdAt
                        )}
                    </td>
                </tr>
            `;
            }
        );
}

/* =====================================================
   RECOMMENDATION ENGINE
===================================================== */

function getRecommendations() {

    const hacks =
        getData(
            STORAGE_KEYS.HACKATHONS
        );

    const recommendations =
        [];

    hacks.forEach(
        hack => {

            if (
                hack.pptRequired
            ) {

                const days =
                    daysBetween(
                        hack.pptDate
                    );

                if (
                    days <= 5 &&
                    days >= 0
                ) {

                    recommendations.push({

                        title:
                            hack.hackathonName,

                        text:
                            `PPT Submission in ${days} days`
                    });
                }
            }
        }
    );

    return recommendations;
}

/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeLoginPage();

        initializeRegisterPage();

        loadDashboard();

        const roundInput =
            document.getElementById(
                "numberOfRounds"
            );

        if (
            roundInput
        ) {

            roundInput.addEventListener(
                "change",
                generateRounds
            );
        }
    }
);