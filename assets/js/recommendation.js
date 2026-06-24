// ======================================
// RECOMMENDATIONS ENGINE
// ======================================

function createRecommendationCard(title, text) {
    return `
    <div class="recommendation">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
            <h4>${title}</h4>
            <span class="badge badge-warning">Action Needed</span>
        </div>
        <p style="color:#6b7280;">${text}</p>
    </div>
    `;
}

async function generateRecommendations() {
    const container = document.getElementById("recommendationsContainer");
    if(!container) return;

    const recommendations = await apiGet("getRecommendations");

    if(!recommendations || recommendations.length === 0) {
        container.innerHTML = `
        <div class="card">
            <h3>No Active Recommendations</h3>
            <p style="margin-top:10px; color:#94a3b8;">Register a hackathon to receive smart recommendations.</p>
        </div>
        `;
        return;
    }

    container.innerHTML = recommendations.map(r => createRecommendationCard(r.title, r.text)).join("");
}

document.addEventListener("DOMContentLoaded", function(){
    checkAuth();
    generateRecommendations();
});