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
  registrationDeadline:values[i][7]

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
