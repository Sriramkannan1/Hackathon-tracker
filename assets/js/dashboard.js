async function loadDashboard(){

    const hacks =
    await apiGet(
        "hackathons"
    );

    const tasks =
    await apiGet(
        "tasks"
    );

    document
    .getElementById(
        "totalHackathons"
    ).innerText =
    hacks.length - 1;

    const pending =
    tasks.filter(
        t => t[5] ===
        "Pending"
    );

    document
    .getElementById(
        "pendingTasks"
    ).innerText =
    pending.length;
}

loadDashboard();