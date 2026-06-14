// ======================================
// RECOMMENDATIONS ENGINE
// ======================================

function createRecommendationCard(
    title,
    priority,
    tasks
) {

    return `
    
    <div class="recommendation">

        <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:15px;
        flex-wrap:wrap;
        gap:10px;
        ">

            <h4>
                ${title}
            </h4>

            <span class="
            badge
            ${
                priority === "High"
                ? "badge-danger"
                : priority === "Medium"
                ? "badge-warning"
                : "badge-success"
            }
            ">
                ${priority} Priority
            </span>

        </div>

        <ul>

            ${tasks.map(task => `
                <li>${task}</li>
            `).join("")}

        </ul>

    </div>

    `;
}

function getDaysRemaining(date) {

    const today =
        new Date();

    const target =
        new Date(date);

    const diff =
        target.getTime() -
        today.getTime();

    return Math.ceil(
        diff /
        (1000 * 60 * 60 * 24)
    );
}

function generateRecommendations() {

    const container =
        document.getElementById(
            "recommendationsContainer"
        );

    if(!container) return;

    const hacks =
        getData(
            STORAGE_KEYS.HACKATHONS
        );

    let html = "";

    hacks.forEach(hack => {

        // ==================================
        // PPT RECOMMENDATIONS
        // ==================================

        if(
            hack.pptRequired &&
            hack.pptDate
        ) {

            const days =
                getDaysRemaining(
                    hack.pptDate
                );

            if(days >= 0){

                let priority =
                    "Low";

                if(days <= 2)
                    priority =
                    "High";

                else if(days <= 5)
                    priority =
                    "Medium";

                html +=
                createRecommendationCard(

                    `${hack.hackathonName} - PPT Submission (${days} Days Left)`,

                    priority,

                    [

                    "Finalize Problem Statement",

                    "Prepare Solution Architecture",

                    "Create Flow Diagram",

                    "Build Market Analysis",

                    "Prepare PPT Design",

                    "Review PPT Content",

                    "Practice Presentation",

                    "Submit PPT"

                    ]
                );
            }
        }

        // ==================================
        // VIDEO RECOMMENDATIONS
        // ==================================

        if(
            hack.videoRequired &&
            hack.videoDate
        ) {

            const days =
                getDaysRemaining(
                    hack.videoDate
                );

            if(days >= 0){

                let priority =
                    "Low";

                if(days <= 2)
                    priority =
                    "High";

                else if(days <= 5)
                    priority =
                    "Medium";

                html +=
                createRecommendationCard(

                    `${hack.hackathonName} - Video Submission (${days} Days Left)`,

                    priority,

                    [

                    "Prepare Demo Script",

                    "Record Product Demo",

                    "Capture Screens",

                    "Edit Video",

                    "Add Voiceover",

                    "Export Final Video",

                    "Upload Submission"

                    ]
                );
            }
        }

        // ==================================
        // REPORT RECOMMENDATIONS
        // ==================================

        if(
            hack.reportRequired &&
            hack.reportDate
        ) {

            const days =
                getDaysRemaining(
                    hack.reportDate
                );

            if(days >= 0){

                let priority =
                    "Low";

                if(days <= 2)
                    priority =
                    "High";

                else if(days <= 5)
                    priority =
                    "Medium";

                html +=
                createRecommendationCard(

                    `${hack.hackathonName} - Report Submission (${days} Days Left)`,

                    priority,

                    [

                    "Complete Documentation",

                    "Write Abstract",

                    "Add Architecture Diagram",

                    "Add Screenshots",

                    "Review Grammar",

                    "Generate PDF",

                    "Submit Report"

                    ]
                );
            }
        }

        // ==================================
        // ROUND PREPARATION
        // ==================================

        if(
            hack.rounds &&
            hack.rounds.length > 0
        ) {

            hack.rounds.forEach(round => {

                const days =
                    getDaysRemaining(
                        round.date
                    );

                if(
                    days >= 0 &&
                    days <= 7
                ) {

                    let priority =
                        "Medium";

                    if(days <= 2)
                        priority =
                        "High";

                    html +=
                    createRecommendationCard(

                        `${hack.hackathonName} - ${round.name} (${days} Days Left)`,

                        priority,

                        [

                        "Review Problem Statement",

                        "Practice Pitch",

                        "Prepare Demo",

                        "Test Application",

                        "Prepare Backup PPT",

                        "Check Internet Connection",

                        "Team Mock Presentation"

                        ]
                    );
                }
            });
        }

        // ==================================
        // GENERAL HACKATHON RECOMMENDATIONS
        // ==================================

        html +=
        createRecommendationCard(

            `${hack.hackathonName} - General Preparation`,

            "Low",

            [

            "Create Team WhatsApp Group",

            "Create Shared Drive",

            "Assign Roles",

            "Research Existing Solutions",

            "Build MVP",

            "Track Competitors",

            "Maintain Daily Progress"

            ]
        );
    });

    if(html === "") {

        html = `
        
        <div class="card">

            <h3>
                No Active Recommendations
            </h3>

            <p style="
            margin-top:10px;
            color:#94a3b8;
            ">
                Register a hackathon to
                receive smart recommendations.
            </p>

        </div>
        `;
    }

    container.innerHTML =
        html;
}

document.addEventListener(
    "DOMContentLoaded",
    function(){

        checkAuth();

        generateRecommendations();

    }
);