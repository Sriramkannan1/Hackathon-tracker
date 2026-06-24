// ==========================================
// CALENDAR ENGINE
// ==========================================

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

async function getCalendarEvents() {

    const hacks = await apiGet("getUserHackathons");

    let events = [];

    hacks.forEach(hack => {

        // PPT

        if(
            hack.pptRequired &&
            hack.pptDate
        ){

            events.push({
                date: hack.pptDate,
                title: `${hack.hackathonName} - PPT`,
                type: "ppt"
            });
        }

        // VIDEO

        if(
            hack.videoRequired &&
            hack.videoDate
        ){

            events.push({
                date: hack.videoDate,
                title: `${hack.hackathonName} - Video`,
                type: "video"
            });
        }

        // REPORT

        if(
            hack.reportRequired &&
            hack.reportDate
        ){

            events.push({
                date: hack.reportDate,
                title: `${hack.hackathonName} - Report`,
                type: "report"
            });
        }

        // ROUNDS

        if(
            hack.rounds &&
            hack.rounds.length > 0
        ){

            hack.rounds.forEach(round => {

                events.push({

                    date: round.date,

                    title:
                    `${hack.hackathonName} - ${round.name}`,

                    type: "round"
                });

            });
        }

    });

    return events;
}

async function renderCalendar() {

    const monthYear =
        document.getElementById(
            "monthYear"
        );

    const calendarDays =
        document.getElementById(
            "calendarDays"
        );

    if(
        !monthYear ||
        !calendarDays
    ) return;

    const events = await getCalendarEvents();

    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();

    const daysInMonth =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();

    const monthNames = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",

        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];

    monthYear.innerText =
        `${monthNames[currentMonth]} ${currentYear}`;

    calendarDays.innerHTML = "";

    for(
        let i = 0;
        i < firstDay;
        i++
    ){

        const blank =
            document.createElement(
                "div"
            );

        blank.className =
            "calendar-cell";

        calendarDays.appendChild(
            blank
        );
    }

    for(
        let day = 1;
        day <= daysInMonth;
        day++
    ){

        const dateString =
            `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

        const dayEvents =
            events.filter(
                e => e.date === dateString
            );

        const cell =
            document.createElement(
                "div"
            );

        cell.className =
            "calendar-cell";

        let eventHTML = "";

        dayEvents.forEach(event => {

            let color =
                "#38bdf8";

            if(event.type === "ppt")
                color = "#f59e0b";

            if(event.type === "video")
                color = "#22c55e";

            if(event.type === "report")
                color = "#ef4444";

            if(event.type === "round")
                color = "#8b5cf6";

            eventHTML += `
            
            <div
            style="
            background:${color};
            padding:4px 6px;
            border-radius:6px;
            font-size:10px;
            margin-top:4px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            ">
                ${event.title}
            </div>
            `;
        });

        cell.innerHTML = `
        
        <div
        style="
        font-weight:700;
        margin-bottom:8px;
        ">
            ${day}
        </div>

        ${eventHTML}
        `;

        calendarDays.appendChild(
            cell
        );
    }
}

function previousMonth() {

    currentMonth--;

    if(currentMonth < 0){

        currentMonth = 11;
        currentYear--;
    }

    renderCalendar();
}

function nextMonth() {

    currentMonth++;

    if(currentMonth > 11){

        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
}

document.addEventListener(
    "DOMContentLoaded",
    function(){

        checkAuth();

        renderCalendar();

    }
);