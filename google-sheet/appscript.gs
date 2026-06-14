const SHEET_ID =
"https://docs.google.com/spreadsheets/d/174N5QQ9w5ZtQzgWzoV8mvp8PyJkxUd8iof-fUbzS44Q/edit?usp=sharing";

function doGet(e) {

  const action =
  e.parameter.action;

  if(action === "hackathons")
    return getHackathons();

  if(action === "tasks")
    return getTasks();

  if(action === "login")
    return loginUser(
      e.parameter.email,
      e.parameter.password
    );

  return jsonResponse({
    success:false,
    message:"Invalid Action"
  });
}

function doPost(e){

  const data =
  JSON.parse(e.postData.contents);

  switch(data.action){

    case "addHackathon":
      return addHackathon(data);

    case "addTask":
      return addTask(data);

    case "updateTask":
      return updateTask(data);

    default:
      return jsonResponse({
        success:false
      });
  }
}

function loginUser(
  email,
  password
){

  const sheet =
  SpreadsheetApp
  .openById(SHEET_ID)
  .getSheetByName("Users");

  const data =
  sheet.getDataRange()
  .getValues();

  for(let i=1;i<data.length;i++){

    if(
      data[i][1]===email &&
      data[i][2]===password
    ){

      return jsonResponse({
        success:true,
        email
      });
    }
  }

  return jsonResponse({
    success:false
  });
}

function getHackathons(){

  const sheet =
  SpreadsheetApp
  .openById(SHEET_ID)
  .getSheetByName(
    "Hackathons"
  );

  const data =
  sheet.getDataRange()
  .getValues();

  return jsonResponse(data);
}

function getTasks(){

  const sheet =
  SpreadsheetApp
  .openById(SHEET_ID)
  .getSheetByName(
    "Tasks"
  );

  const data =
  sheet.getDataRange()
  .getValues();

  return jsonResponse(data);
}

function addHackathon(data){

  const sheet =
  SpreadsheetApp
  .openById(SHEET_ID)
  .getSheetByName(
    "Hackathons"
  );

  sheet.appendRow([

    data.id,
    data.hackathonName,
    data.organizer,
    data.mode,
    data.website,
    data.registrationDate,
    data.registrationDeadline,
    data.summary,
    data.problemTheme,
    data.problemStatement,
    data.teamLeader,
    data.fees,
    data.selectedRound,
    data.placeAchieved,
    data.pptRequired,
    data.pptDate,
    data.videoRequired,
    data.videoDate,
    data.reportRequired,
    data.reportDate,
    JSON.stringify(
      data.rounds
    ),
    new Date()

  ]);

  return jsonResponse({
    success:true
  });
}

function addTask(data){

  const sheet =
  SpreadsheetApp
  .openById(SHEET_ID)
  .getSheetByName(
    "Tasks"
  );

  sheet.appendRow([

    data.taskId,
    data.hackathonId,
    data.hackathonName,
    data.taskName,
    data.deadline,
    "Pending",
    new Date()

  ]);

  return jsonResponse({
    success:true
  });
}

function updateTask(data){

  const sheet =
  SpreadsheetApp
  .openById(SHEET_ID)
  .getSheetByName(
    "Tasks"
  );

  const values =
  sheet.getDataRange()
  .getValues();

  for(let i=1;i<values.length;i++){

    if(values[i][0]===data.taskId){

      sheet
      .getRange(i+1,6)
      .setValue(
        data.status
      );

      break;
    }
  }

  return jsonResponse({
    success:true
  });
}

function jsonResponse(data){

  return ContentService
  .createTextOutput(
    JSON.stringify(data)
  )
  .setMimeType(
    ContentService.MimeType.JSON
  );
}