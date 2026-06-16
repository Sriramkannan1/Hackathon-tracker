const SHEET_ID =
"174N5QQ9w5ZtQzgWzoV8mvp8PyJkxUd8iof-fUbzS44Q";

/* =========================================
UTILITIES
========================================= */

function getSpreadsheet() {
return SpreadsheetApp.openById(SHEET_ID);
}

function json(data) {
return ContentService
.createTextOutput(
JSON.stringify(data)
)
.setMimeType(
ContentService.MimeType.JSON
);
}

/* =========================================
SHEET INITIALIZATION
========================================= */

function initializeSheets() {

const ss =
getSpreadsheet();

const requiredSheets = [
"Users",
"Hackathons",
"Tasks"
];

requiredSheets.forEach(name => {

 
let sheet =
  ss.getSheetByName(name);

if (!sheet) {

  sheet =
    ss.insertSheet(name);
}
 

});
}

/* =========================================
GET
========================================= */

function doGet(e) {

initializeSheets();

const action =
e.parameter.action;

switch(action){

 
case "login":
  return loginUser(
    e.parameter.email,
    e.parameter.password
  );

case "hackathons":
  return getHackathons();

case "tasks":
  return getTasks();

default:
  return json({
    success:false,
    message:"Invalid Action"
  });
 

}
}

/* =========================================
POST
========================================= */

function doPost(e) {

initializeSheets();

const data =
JSON.parse(
e.postData.contents
);

switch(data.action){

 
case "registerUser":
  return registerUser(data);

case "addHackathon":
  return addHackathon(data);

case "addTask":
  return addTask(data);

case "updateTask":
  return updateTask(data);

default:
  return json({
    success:false,
    message:"Unknown Action"
  });
 

}
}

/* =========================================
LOGIN
========================================= */

function loginUser(
email,
password
){

const sheet =
getSpreadsheet()
.getSheetByName("Users");

const data =
sheet.getDataRange()
.getValues();

for(let i=1;i<data.length;i++){

 
if(
  data[i][2] === email &&
  data[i][3] === password
){

  return json({
    success:true,
    name:data[i][0],
    college:data[i][1],
    email:data[i][2],
    role:data[i][4]
  });
}
 

}

return json({
success:false,
message:"Invalid Login"
});
}

/* =========================================
REGISTER USER
========================================= */

function registerUser(data){

const sheet =
getSpreadsheet()
.getSheetByName("Users");

const rows =
sheet.getDataRange()
.getValues();

const email =
data.email.toLowerCase();

for(let i=1;i<rows.length;i++){

 
if(
  rows[i][2]
  .toString()
  .toLowerCase() === email
){

  return json({
    success:false,
    message:"Email already exists"
  });
}
 

}

sheet.appendRow([

 
data.name,
data.college,
data.email,
data.password,
"User",
new Date()
 

]);

return json({
success:true
});
}

/* =========================================
HACKATHONS
========================================= */

function addHackathon(data){

const sheet =
getSpreadsheet()
.getSheetByName("Hackathons");

sheet.appendRow([

 
data.id,
data.hackathonName,
data.organizer,
data.summary,
data.mode,
data.website,
data.registrationDate,
data.registrationDeadline,
data.teamCreated || "No",
data.confirmationReceived || "No",
data.teamLeader || "",
data.fees || "",
data.problemTheme || "",
data.problemStatement || "",
data.numberOfRounds || 0,
data.selectedRound || "",
data.placeAchieved || "",
data.pptRequired ? "Yes" : "No",
data.pptDate || "",
data.videoRequired ? "Yes" : "No",
data.videoDate || "",
data.reportRequired ? "Yes" : "No",
data.reportDate || "",
JSON.stringify(data.rounds),
new Date()
 

]);

return json({
success:true
});
}

function getHackathons(){

const sheet =
getSpreadsheet()
.getSheetByName("Hackathons");

const values =
sheet.getDataRange()
.getValues();

const result = [];

for(let i=1;i<values.length;i++){

 
result.push({

  id:values[i][0],
  hackathonName:values[i][1],
  organizer:values[i][2],
  summary:values[i][3],
  mode:values[i][4],
  website:values[i][5],
  registrationDate:values[i][6],
  registrationDeadline:values[i][7],
  teamCreated:values[i][8],
  confirmationReceived:values[i][9],
  teamLeader:values[i][10],
  fees:values[i][11],
  problemTheme:values[i][12],
  problemStatement:values[i][13],
  numberOfRounds:values[i][14],
  selectedRound:values[i][15],
  placeAchieved:values[i][16],
  pptRequired:values[i][17] === "Yes",
  pptDate:values[i][18],
  videoRequired:values[i][19] === "Yes",
  videoDate:values[i][20],
  reportRequired:values[i][21] === "Yes",
  reportDate:values[i][22],
  rounds:JSON.parse(values[i][23]),
  createdAt:values[i][24]

});
 

}

return json(result);
}

/* =========================================
TASKS
========================================= */

function addTask(data){

const sheet =
getSpreadsheet()
.getSheetByName("Tasks");

sheet.appendRow([

 
data.taskId,
data.hackathonId,
data.hackathonName,
data.taskName,
data.deadline,
data.status,
new Date()
 

]);

return json({
success:true
});
}

function getTasks(){

const sheet =
getSpreadsheet()
.getSheetByName("Tasks");

const values =
sheet.getDataRange()
.getValues();

const result = [];

for(let i=1;i<values.length;i++){

 
result.push({

  taskId:values[i][0],
  hackathonId:values[i][1],
  hackathonName:values[i][2],
  taskName:values[i][3],
  deadline:values[i][4],
  status:values[i][5]

});
 

}

return json(result);
}

function updateTask(data){

const sheet =
getSpreadsheet()
.getSheetByName("Tasks");

const values =
sheet.getDataRange()
.getValues();

for(let i=1;i<values.length;i++){

 
if(values[i][0] === data.taskId){

  sheet
  .getRange(i+1,6)
  .setValue(
    data.status
  );

  break;
}
 

}

return json({
success:true
});
}
