// ==========================================
// NOTIFICATION ENGINE
// ==========================================

function createNotificationCard(title, message, type) {
    return `
    <div class="notification ${type}">
        <h3 style="margin-bottom:8px;">${title}</h3>
        <p>${message}</p>
    </div>
    `;
}

async function generateNotifications() {
    const container = document.getElementById("notificationContainer");
    if(!container) return;

    const notifications = await apiGet("getNotifications");

    if(!notifications || notifications.length === 0) {
        container.innerHTML = `
        <div class="card">
            <h3>No Notifications</h3>
            <p style="color:#94a3b8; margin-top:10px;">You're all caught up.</p>
        </div>`;
        return;
    }

    container.innerHTML = notifications.map(n => createNotificationCard(n.title, n.text, n.type)).join("");
}

document.addEventListener("DOMContentLoaded", function(){
    checkAuth();
    generateNotifications();
});