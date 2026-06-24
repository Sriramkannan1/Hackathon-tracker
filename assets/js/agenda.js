// ======================================
// AGENDA PAGE
// ======================================

function isToday(date) {
    const today = new Date();
    const d = new Date(date);
    return (d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear());
}

function isTomorrow(date) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const d = new Date(date);
    return (d.getDate() === tomorrow.getDate() && d.getMonth() === tomorrow.getMonth() && d.getFullYear() === tomorrow.getFullYear());
}

function isThisWeek(date) {
    const today = new Date();
    const d = new Date(date);
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 1 && diff <= 7;
}

function isFuture(date) {
    const today = new Date();
    const d = new Date(date);
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 7;
}

async function markTaskComplete(taskId) {
    const response = await apiPost({ action: "updateTask", taskId: taskId, status: "Completed" });
    if(response.success){
        loadAgenda();
    } else {
        alert("Failed to update task");
    }
}

function createTaskCard(task, color) {
    return `
    <div class="agenda-card" style="border-left:5px solid ${color};">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
                <h3>${task.hackathonName}</h3>
                <p style="color:#94a3b8; margin-top:5px;">${task.taskName}</p>
                <small style="color:#38bdf8;">${formatDate(task.deadline)}</small>
            </div>
            ${task.status !== "Completed" ? `<button class="btn btn-success" onclick="markTaskComplete('${task.taskId}')">Complete</button>` : `<span class="badge badge-success">Completed</span>`}
        </div>
    </div>
    `;
}

function renderSection(containerId, tasks, color) {
    const container = document.getElementById(containerId);
    if(!container) return;
    if(tasks.length === 0){
        container.innerHTML = `<div class="card">No Tasks</div>`;
        return;
    }
    container.innerHTML = tasks.map(task => createTaskCard(task, color)).join("");
}

async function loadAgenda() {
    const tasks = await apiGet("getAgenda");
    const today = tasks.filter(task => isToday(task.deadline));
    const tomorrow = tasks.filter(task => isTomorrow(task.deadline));
    const thisWeek = tasks.filter(task => isThisWeek(task.deadline));
    const future = tasks.filter(task => isFuture(task.deadline));

    renderSection("todayTasks", today, "#ef4444");
    renderSection("tomorrowTasks", tomorrow, "#f59e0b");
    renderSection("weekTasks", thisWeek, "#38bdf8");
    renderSection("futureTasks", future, "#22c55e");
}

document.addEventListener("DOMContentLoaded", function(){
    checkAuth();
    loadAgenda();
});