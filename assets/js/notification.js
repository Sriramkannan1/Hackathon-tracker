// ==========================================
// NOTIFICATION ENGINE
// ==========================================

function getDaysRemaining(date) {

    const today = new Date();

    today.setHours(0,0,0,0);

    const target = new Date(date);

    target.setHours(0,0,0,0);

    const diff =
        target.getTime() -
        today.getTime();

    return Math.ceil(
        diff /
        (1000 * 60 * 60 * 24)
    );
}

function createNotificationCard(
    title,
    message,
    type
) {

    return `
    
    <div class="notification ${type}">

        <h3 style="margin-bottom:8px;">
            ${title}
        </h3>

        <p>
            ${message}
        </p>

    </div>

    `;
}

function generateNotifications() {

    const container =
        document.getElementById(
            "notificationContainer"
        );

    if(!container) return;

    const hacks =
        getData(
            STORAGE_KEYS.HACKATHONS
        );

    let notifications = [];

    hacks.forEach(hack => {

        // =================================
        // PPT DEADLINES
        // =================================

        if(
            hack.pptRequired &&
            hack.pptDate
        ){

            const days =
                getDaysRemaining(
                    hack.pptDate
                );

            if(days === 0){

                notifications.push(
                    createNotificationCard(
                        "🚨 PPT Submission Today",
                        `${hack.hackathonName} PPT submission deadline is today.`,
                        "danger"
                    )
                );
            }

            else if(days === 1){

                notifications.push(
                    createNotificationCard(
                        "⚠ PPT Deadline Tomorrow",
                        `${hack.hackathonName} PPT submission deadline is tomorrow.`,
                        "warning"
                    )
                );
            }

            else if(days <= 3 && days > 1){

                notifications.push(
                    createNotificationCard(
                        "📄 PPT Deadline Approaching",
                        `${hack.hackathonName} PPT submission is within ${days} days.`,
                        "warning"
                    )
                );
            }

            else if(days < 0){

                notifications.push(
                    createNotificationCard(
                        "❌ PPT Deadline Missed",
                        `${hack.hackathonName} PPT deadline has already passed.`,
                        "danger"
                    )
                );
            }
        }

        // =================================
        // VIDEO DEADLINES
        // =================================

        if(
            hack.videoRequired &&
            hack.videoDate
        ){

            const days =
                getDaysRemaining(
                    hack.videoDate
                );

            if(days === 0){

                notifications.push(
                    createNotificationCard(
                        "🎥 Video Submission Today",
                        `${hack.hackathonName} video deadline is today.`,
                        "danger"
                    )
                );
            }

            else if(days <= 3 && days > 0){

                notifications.push(
                    createNotificationCard(
                        "🎥 Video Deadline Near",
                        `${hack.hackathonName} video submission due in ${days} day(s).`,
                        "warning"
                    )
                );
            }
        }

        // =================================
        // REPORT DEADLINES
        // =================================

        if(
            hack.reportRequired &&
            hack.reportDate
        ){

            const days =
                getDaysRemaining(
                    hack.reportDate
                );

            if(days === 0){

                notifications.push(
                    createNotificationCard(
                        "📚 Report Submission Today",
                        `${hack.hackathonName} report deadline is today.`,
                        "danger"
                    )
                );
            }

            else if(days <= 3 && days > 0){

                notifications.push(
                    createNotificationCard(
                        "📚 Report Deadline Near",
                        `${hack.hackathonName} report submission due in ${days} day(s).`,
                        "warning"
                    )
                );
            }
        }

        // =================================
        // ROUND NOTIFICATIONS
        // =================================

        if(
            hack.rounds &&
            hack.rounds.length > 0
        ){

            hack.rounds.forEach(round => {

                const days =
                    getDaysRemaining(
                        round.date
                    );

                if(days === 0){

                    notifications.push(
                        createNotificationCard(
                            "🏆 Round Today",
                            `${hack.hackathonName} - ${round.name} starts today at ${round.time}`,
                            "danger"
                        )
                    );
                }

                else if(days === 1){

                    notifications.push(
                        createNotificationCard(
                            "🏆 Round Tomorrow",
                            `${hack.hackathonName} - ${round.name} scheduled tomorrow.`,
                            "warning"
                        )
                    );
                }

                else if(days <= 3 && days > 1){

                    notifications.push(
                        createNotificationCard(
                            "🏆 Upcoming Round",
                            `${hack.hackathonName} - ${round.name} begins in ${days} days.`,
                            "success"
                        )
                    );
                }

            });
        }

    });

    if(notifications.length === 0){

        notifications.push(`

            <div class="card">

                <h3>
                    No Notifications
                </h3>

                <p style="
                color:#94a3b8;
                margin-top:10px;
                ">
                    You're all caught up.
                </p>

            </div>

        `);
    }

    container.innerHTML =
        notifications.join("");
}

document.addEventListener(
    "DOMContentLoaded",
    function(){

        checkAuth();

        generateNotifications();

    }
);