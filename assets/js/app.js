/* =====================================================
   HACKATHON COMMAND CENTER
   APP.JS
===================================================== */

const STORAGE_KEYS = {
    CURRENT_USER: "hack_current_user"
};

/* =====================================================
   UTILITIES
===================================================== */

function generateId(prefix = "ID") {
    return prefix + "_" + Date.now() + "_" + Math.floor(Math.random() * 9999);
}

function formatDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
    });
}

function daysBetween(date) {
    const today = new Date();
    const target = new Date(date);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* =====================================================
   AUTHENTICATION
===================================================== */

async function loginUser(email, password) {
    try {
        const result = await apiLogin(email, password);
        if (!result.success) {
            if (typeof showAlert === "function") showAlert("Invalid Login", "danger");
            else alert("Invalid Login");
            return;
        }

        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
            email: result.email,
            role: result.role || "User",
            token: result.token
        }));

        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Unable to connect to server");
        console.error(error);
    }
}

function logoutUser() {
    localStorage.clear();
    window.location.href = "login.html";
}

function checkAuth() {
    try {
        const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
        if (!user || !user.email) throw new Error("Invalid session");
    } catch {
        localStorage.clear();
        window.location.href = "login.html";
    }
}

/* =====================================================
   LOGIN / SIGNUP PAGE
===================================================== */

function initializeLoginPage() {
    const form = document.getElementById("loginForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        loginUser(email, password);
    });
}

function initializeSignupPage() {
    const form = document.getElementById("signupForm");
    if (!form) return;
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const name = document.getElementById("signupName").value.trim();
        const college = document.getElementById("college").value;
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            if (typeof showAlert === "function") showAlert("Passwords do not match", "danger");
            else alert("Passwords do not match");
            return;
        }

        try {
            const result = await apiRegister({ name, college, email, password });
            if (result.success) {
                if (typeof showAlert === "function") showAlert("Account Created Successfully", "success");
                else alert("Account Created Successfully");
                setTimeout(() => window.location.href = "login.html", 1500);
            } else {
                if (typeof showAlert === "function") showAlert(result.message || "Registration Failed", "danger");
                else alert(result.message || "Registration Failed");
            }
        } catch (error) {
            console.error(error);
            alert("Google Sheet connection failed");
        }
    });
}

/* =====================================================
   DYNAMIC ROUND GENERATOR
===================================================== */

function generateRounds() {
    const roundCount = document.getElementById("numberOfRounds");
    const container = document.getElementById("roundsContainer");
    if (!roundCount || !container) return;

    const count = parseInt(roundCount.value);
    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        const round = document.createElement("div");
        round.className = "round-card";
        round.innerHTML = `
            <div class="round-title">Round ${i}</div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Round Name</label>
                    <input type="text" class="form-control" id="roundName${i}" required>
                </div>
                <div class="form-group">
                    <label>Round Date</label>
                    <input type="date" class="form-control" id="roundDate${i}" required>
                </div>
                <div class="form-group">
                    <label>Round Time</label>
                    <input type="time" class="form-control" id="roundTime${i}" required>
                </div>
            </div>
        `;
        container.appendChild(round);
    }
}

/* =====================================================
   TASK GENERATION ENGINE
===================================================== */

function createTask(hackathonId, hackathonName, taskName, deadline) {
    return {
        taskId: generateId("TASK"),
        hackathonId,
        hackathonName,
        taskName,
        deadline,
        status: "Pending"
    };
}

function generateTasks(data) {
    const tasks = [];
    const hackId = data.id;
    const name = data.hackathonName;

    if (data.pptRequired && data.pptDate) {
        const ppt = new Date(data.pptDate);
        tasks.push(createTask(hackId, name, "Prepare PPT", new Date(ppt.getTime() - 2 * 86400000)));
        tasks.push(createTask(hackId, name, "Review PPT", new Date(ppt.getTime() - 86400000)));
        tasks.push(createTask(hackId, name, "Submit PPT", ppt));
    }

    if (data.videoRequired && data.videoDate) {
        const video = new Date(data.videoDate);
        tasks.push(createTask(hackId, name, "Record Demo", new Date(video.getTime() - 2 * 86400000)));
        tasks.push(createTask(hackId, name, "Edit Video", new Date(video.getTime() - 86400000)));
        tasks.push(createTask(hackId, name, "Upload Video", video));
    }

    if (data.reportRequired && data.reportDate) {
        const report = new Date(data.reportDate);
        tasks.push(createTask(hackId, name, "Draft Report", new Date(report.getTime() - 2 * 86400000)));
        tasks.push(createTask(hackId, name, "Review Report", new Date(report.getTime() - 86400000)));
        tasks.push(createTask(hackId, name, "Submit Report", report));
    }

    return tasks;
}

/* =====================================================
   REGISTER & EDIT HACKATHON
===================================================== */

async function initializeRegisterPage() {
    const form = document.getElementById("hackathonForm");
    if (!form) return;

    // Check for Edit Mode
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');
    let isEditMode = false;

    if (editId) {
        isEditMode = true;
        document.querySelector(".page-title h1").innerText = "Update Hackathon";
        document.querySelector("button[type='submit']").innerHTML = '<i class="fas fa-save"></i> Update Hackathon';
        
        // Fetch existing data
        const response = await apiGet("getHackathon", "&id=" + editId);
        if (response.success && response.data) {
            const h = response.data;
            document.getElementById("hackathonName").value = h.hackathonName || "";
            document.getElementById("organizer").value = h.organizer || "";
            if (document.getElementById("mode")) document.getElementById("mode").value = h.mode || "";
            if (document.getElementById("website")) document.getElementById("website").value = h.website || "";
            
            if (h.registrationDate) document.getElementById("registrationDate").value = h.registrationDate.split('T')[0];
            if (h.registrationDeadline) document.getElementById("registrationDeadline").value = h.registrationDeadline.split('T')[0];
            
            document.getElementById("summary").value = h.summary || "";
            if (document.getElementById("teamCreated")) document.getElementById("teamCreated").value = h.teamCreated || "No";
            if (document.getElementById("teamLeader")) document.getElementById("teamLeader").value = h.teamLeader || "";
            if (document.getElementById("fees")) document.getElementById("fees").value = h.fees || "";
            if (document.getElementById("confirmationReceived")) document.getElementById("confirmationReceived").value = h.confirmationReceived || "No";
            if (document.getElementById("problemTheme")) document.getElementById("problemTheme").value = h.problemTheme || "";
            if (document.getElementById("problemStatement")) document.getElementById("problemStatement").value = h.problemStatement || "";
            
            document.getElementById("pptRequired").checked = h.pptRequired;
            if (h.pptDate) document.getElementById("pptDate").value = h.pptDate.split('T')[0];
            
            document.getElementById("videoRequired").checked = h.videoRequired;
            if (h.videoDate) document.getElementById("videoDate").value = h.videoDate.split('T')[0];
            
            document.getElementById("reportRequired").checked = h.reportRequired;
            if (h.reportDate) document.getElementById("reportDate").value = h.reportDate.split('T')[0];
            
            if (document.getElementById("selectedRound")) document.getElementById("selectedRound").value = h.selectedRound || "";
            if (document.getElementById("placeAchieved")) document.getElementById("placeAchieved").value = h.placeAchieved || "";

            if (h.numberOfRounds > 0) {
                document.getElementById("numberOfRounds").value = h.numberOfRounds;
                generateRounds();
                try {
                    const rounds = JSON.parse(h.rounds);
                    for (let i = 1; i <= rounds.length; i++) {
                        if (document.getElementById(`roundName${i}`)) document.getElementById(`roundName${i}`).value = rounds[i-1].name || "";
                        if (document.getElementById(`roundDate${i}`)) document.getElementById(`roundDate${i}`).value = rounds[i-1].date ? rounds[i-1].date.split('T')[0] : "";
                        if (document.getElementById(`roundTime${i}`)) document.getElementById(`roundTime${i}`).value = rounds[i-1].time || "";
                    }
                } catch(e) {}
            }
        }
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const count = parseInt(document.getElementById("numberOfRounds").value || 0);
        const rounds = [];
        for (let i = 1; i <= count; i++) {
            rounds.push({
                name: document.getElementById(`roundName${i}`).value,
                date: document.getElementById(`roundDate${i}`).value,
                time: document.getElementById(`roundTime${i}`).value
            });
        }

        const hackathonId = isEditMode ? editId : generateId("HACK");
        const hackathon = {
            id: hackathonId,
            hackathonName: document.getElementById("hackathonName").value,
            organizer: document.getElementById("organizer").value,
            summary: document.getElementById("summary").value,
            mode: document.getElementById("mode")?.value || "",
            website: document.getElementById("website")?.value || "",
            registrationDate: document.getElementById("registrationDate")?.value || "",
            registrationDeadline: document.getElementById("registrationDeadline")?.value || "",
            teamCreated: document.getElementById("teamCreated")?.value || "No",
            confirmationReceived: document.getElementById("confirmationReceived")?.value || "No",
            teamLeader: document.getElementById("teamLeader")?.value || "",
            fees: document.getElementById("fees")?.value || "",
            problemTheme: document.getElementById("problemTheme")?.value || "",
            problemStatement: document.getElementById("problemStatement")?.value || "",
            numberOfRounds: count,
            selectedRound: document.getElementById("selectedRound")?.value || "",
            placeAchieved: document.getElementById("placeAchieved")?.value || "",
            pptRequired: document.getElementById("pptRequired").checked,
            pptDate: document.getElementById("pptDate").value,
            videoRequired: document.getElementById("videoRequired").checked,
            videoDate: document.getElementById("videoDate").value,
            reportRequired: document.getElementById("reportRequired").checked,
            reportDate: document.getElementById("reportDate").value,
            rounds: JSON.stringify(rounds)
        };

        const response = await apiPost({
            action: isEditMode ? "updateHackathon" : "addHackathon",
            ...hackathon
        });

        if (!response.success) {
            alert("Failed to save hackathon");
            return;
        }

        if (!isEditMode) {
            const generatedTasks = generateTasks(hackathon);
            await Promise.all(generatedTasks.map(task => apiPost({
                action: "addTask",
                ...task
            })));
        }

        alert(isEditMode ? "Hackathon Updated Successfully!" : "Hackathon Registered Successfully!");
        window.location.href = "dashboard.html";
    });
}

/* =====================================================
   DASHBOARD & MANAGEMENT
===================================================== */

async function loadDashboard() {
    const totalHackathons = document.getElementById("totalHackathons");
    if (!totalHackathons) return;

    try {
        const stats = await apiGet("getDashboardStats");
        
        totalHackathons.innerText = stats.totalHackathons || 0;
        document.getElementById("upcomingDeadlines").innerText = stats.upcomingDeadlines || 0;
        document.getElementById("pendingTasks").innerText = stats.pendingTasks || 0;
        document.getElementById("completedTasks").innerText = stats.completedTasks || 0;

        loadRecentHackathons(stats.recent || []);

    } catch (error) {
        console.error(error);
        alert("Failed to load dashboard data.");
    }
}

function loadRecentHackathons(hacks) {
    const table = document.getElementById("recentHackathons");
    if (!table) return;

    table.innerHTML = "";

    hacks.forEach(hack => {
        table.innerHTML += `
        <tr>
            <td>${hack.hackathonName}</td>
            <td>${hack.organizer}</td>
            <td>${hack.numberOfRounds}</td>
            <td>${formatDate(hack.createdAt)}</td>
            <td style="text-align:center;">
                <a href="register.html?id=${hack.id}" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px; margin-right: 5px;">Edit</a>
                <button onclick="deleteHackathonHandler('${hack.id}')" class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;">Delete</button>
            </td>
        </tr>
        `;
    });
}

window.deleteHackathonHandler = async function(id) {
    if (confirm("Are you sure you want to delete this Hackathon and all its tasks?")) {
        const response = await apiPost({ action: "deleteHackathon", id: id });
        if (response.success) {
            alert("Deleted Successfully");
            loadDashboard(); // Refresh dashboard
        } else {
            alert("Failed to delete hackathon");
        }
    }
};

/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    initializeLoginPage();
    initializeSignupPage();
    initializeRegisterPage();
    loadDashboard();

    const roundInput = document.getElementById("numberOfRounds");
    if (roundInput) {
        roundInput.addEventListener("change", generateRounds);
    }
});