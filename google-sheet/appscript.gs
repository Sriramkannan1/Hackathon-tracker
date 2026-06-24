const SHEET_ID = "174N5QQ9w5ZtQzgWzoV8mvp8PyJkxUd8iof-fUbzS44Q";

function getSpreadsheet() {
  return SpreadsheetApp.openById(SHEET_ID);
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function initializeSheets() {
  const ss = getSpreadsheet();
  const requiredSheets = ["Users", "Hackathons", "Tasks"];
  requiredSheets.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
  });
}

function doGet(e) {
  initializeSheets();
  const action = e.parameter.action;
  const email = e.parameter.email;

  switch(action) {
    case "getUserHackathons":
      return json(_getUserHackathons(email));
    case "getHackathon":
      return getHackathon(email, e.parameter.id);
    case "getTasks":
      return json(_getTasks(email));
    case "getDashboardStats":
      return getDashboardStats(email);
    case "getAgenda":
      return getAgenda(email);
    case "getNotifications":
      return getNotifications(email);
    case "getRecommendations":
      return getRecommendations(email);
    default:
      return json({ success: false, message: "Invalid Action" });
  }
}

function doPost(e) {
  initializeSheets();
  const data = JSON.parse(e.postData.contents);

  switch(data.action) {
    case "login":
      return loginUser(data.email, data.password);
    case "registerUser":
      return registerUser(data);
    case "addHackathon":
      return addHackathon(data);
    case "updateHackathon":
      return updateHackathon(data);
    case "deleteHackathon":
      return deleteHackathon(data);
    case "addTask":
      return addTask(data);
    case "updateTask":
      return updateTask(data);
    default:
      return json({ success: false, message: "Unknown Action" });
  }
}

function loginUser(email, password) {
  const sheet = getSpreadsheet().getSheetByName("Users");
  const data = sheet.getDataRange().getValues();
  for(let i=1; i<data.length; i++) {
    if(data[i][2].toString().toLowerCase() === email.toLowerCase() && data[i][3].toString() === password.toString()) {
      return json({
        success: true,
        name: data[i][0],
        college: data[i][1],
        email: data[i][2],
        role: data[i][4],
        token: Utilities.base64Encode(email + ":" + new Date().getTime())
      });
    }
  }
  return json({ success: false, message: "Invalid Login" });
}

function registerUser(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSpreadsheet().getSheetByName("Users");
    const rows = sheet.getDataRange().getValues();
    const email = data.email.toLowerCase();
    for(let i=1; i<rows.length; i++) {
      if(rows[i][2].toString().toLowerCase() === email) {
        return json({ success: false, message: "Email already exists" });
      }
    }
    sheet.appendRow([data.name, data.college, data.email, data.password, "User", new Date()]);
    return json({ success: true });
  } finally {
    lock.releaseLock();
  }
}

function addHackathon(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSpreadsheet().getSheetByName("Hackathons");
    sheet.appendRow([
      data.id, data.ownerEmail, data.hackathonName, data.organizer, data.summary, data.mode,
      data.website, data.registrationDate, data.registrationDeadline, data.teamCreated || "No",
      data.confirmationReceived || "No", data.problemTheme || "", data.problemStatement || "", 
      data.teamLeader || "", data.fees || "", data.numberOfRounds || 0,
      data.selectedRound || "", data.placeAchieved || "", data.pptRequired ? "Yes" : "No",
      data.pptDate || "", data.videoRequired ? "Yes" : "No", data.videoDate || "",
      data.reportRequired ? "Yes" : "No", data.reportDate || "", data.rounds || "[]",
      new Date(), new Date()
    ]);
    return json({ success: true });
  } finally {
    lock.releaseLock();
  }
}

function updateHackathon(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSpreadsheet().getSheetByName("Hackathons");
    const values = sheet.getDataRange().getValues();
    for(let i=1; i<values.length; i++) {
      if(values[i][0] === data.id && values[i][1] === data.ownerEmail) {
        const rowData = [
          data.id, data.ownerEmail, data.hackathonName, data.organizer, data.summary, data.mode,
          data.website, data.registrationDate, data.registrationDeadline, data.teamCreated || "No",
          data.confirmationReceived || "No", data.problemTheme || "", data.problemStatement || "", 
          data.teamLeader || "", data.fees || "", data.numberOfRounds || 0,
          data.selectedRound || "", data.placeAchieved || "", data.pptRequired ? "Yes" : "No",
          data.pptDate || "", data.videoRequired ? "Yes" : "No", data.videoDate || "",
          data.reportRequired ? "Yes" : "No", data.reportDate || "", data.rounds || "[]",
          values[i][25], new Date()
        ];
        sheet.getRange(i+1, 1, 1, rowData.length).setValues([rowData]);
        return json({ success: true });
      }
    }
    return json({ success: false, message: "Hackathon not found or unauthorized" });
  } finally {
    lock.releaseLock();
  }
}

function deleteHackathon(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSpreadsheet().getSheetByName("Hackathons");
    const values = sheet.getDataRange().getValues();
    for(let i=1; i<values.length; i++) {
      if(values[i][0] === data.id && values[i][1] === data.ownerEmail) {
        sheet.deleteRow(i+1);
        
        const tasksSheet = getSpreadsheet().getSheetByName("Tasks");
        const tasksValues = tasksSheet.getDataRange().getValues();
        for(let j=tasksValues.length-1; j>=1; j--) {
          if(tasksValues[j][2] === data.id && tasksValues[j][1] === data.ownerEmail) {
            tasksSheet.deleteRow(j+1);
          }
        }
        return json({ success: true });
      }
    }
    return json({ success: false, message: "Hackathon not found or unauthorized" });
  } finally {
    lock.releaseLock();
  }
}

function mapHackathon(row) {
  return {
    id: row[0], ownerEmail: row[1], hackathonName: row[2], organizer: row[3], summary: row[4],
    mode: row[5], website: row[6], registrationDate: row[7], registrationDeadline: row[8],
    teamCreated: row[9], confirmationReceived: row[10], problemTheme: row[11], problemStatement: row[12], 
    teamLeader: row[13], fees: row[14], numberOfRounds: row[15],
    selectedRound: row[16], placeAchieved: row[17], pptRequired: row[18] === "Yes",
    pptDate: row[19], videoRequired: row[20] === "Yes", videoDate: row[21],
    reportRequired: row[22] === "Yes", reportDate: row[23], 
    rounds: row[24], createdAt: row[25], updatedAt: row[26]
  };
}

function _getUserHackathons(email) {
  if (!email) return [];
  const sheet = getSpreadsheet().getSheetByName("Hackathons");
  const values = sheet.getDataRange().getValues();
  const result = [];
  for(let i=1; i<values.length; i++) {
    if(values[i][1] === email) {
      result.push(mapHackathon(values[i]));
    }
  }
  return result;
}

function getHackathon(email, id) {
  if (!email || !id) return json({ success: false, message: "Missing info" });
  const sheet = getSpreadsheet().getSheetByName("Hackathons");
  const values = sheet.getDataRange().getValues();
  for(let i=1; i<values.length; i++) {
    if(values[i][0] === id && values[i][1] === email) {
      return json({ success: true, data: mapHackathon(values[i]) });
    }
  }
  return json({ success: false, message: "Not found" });
}

function addTask(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSpreadsheet().getSheetByName("Tasks");
    sheet.appendRow([
      data.taskId, data.ownerEmail, data.hackathonId, data.hackathonName,
      data.taskName, data.deadline, data.status, new Date(), new Date()
    ]);
    return json({ success: true });
  } finally {
    lock.releaseLock();
  }
}

function _getTasks(email) {
  if (!email) return [];
  const sheet = getSpreadsheet().getSheetByName("Tasks");
  const values = sheet.getDataRange().getValues();
  const result = [];
  for(let i=1; i<values.length; i++) {
    if(values[i][1] === email) {
      result.push({
        taskId: values[i][0], ownerEmail: values[i][1], hackathonId: values[i][2],
        hackathonName: values[i][3], taskName: values[i][4], deadline: values[i][5],
        status: values[i][6], createdAt: values[i][7], updatedAt: values[i][8]
      });
    }
  }
  return result;
}

function updateTask(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSpreadsheet().getSheetByName("Tasks");
    const values = sheet.getDataRange().getValues();
    for(let i=1; i<values.length; i++) {
      if(values[i][0] === data.taskId && values[i][1] === data.ownerEmail) {
        sheet.getRange(i+1, 7).setValue(data.status); // Update status
        sheet.getRange(i+1, 9).setValue(new Date());  // Update updatedAt
        return json({ success: true });
      }
    }
    return json({ success: false, message: "Task not found" });
  } finally {
    lock.releaseLock();
  }
}

function getDashboardStats(email) {
  if (!email) return json({ totalHackathons: 0, upcomingDeadlines: 0, pendingTasks: 0, completedTasks: 0, recent: [] });
  
  const hacks = _getUserHackathons(email);
  const tasks = _getTasks(email);
  
  const pending = tasks.filter(t => t.status === "Pending");
  const completed = tasks.filter(t => t.status === "Completed");
  
  const today = new Date();
  const upcoming = pending.filter(t => {
    if (!t.deadline) return false;
    const diff = new Date(t.deadline).getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days <= 7 && days >= 0;
  });

  return json({
    totalHackathons: hacks.length,
    upcomingDeadlines: upcoming.length,
    pendingTasks: pending.length,
    completedTasks: completed.length,
    recent: hacks.slice(-5).reverse()
  });
}

function getAgenda(email) {
  if (!email) return json([]);
  const tasks = _getTasks(email);
  const pending = tasks.filter(t => t.status === "Pending");
  pending.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  return json(pending);
}

function getNotifications(email) {
  if (!email) return json([]);
  const tasks = _getTasks(email);
  
  const pending = tasks.filter(t => t.status === "Pending");
  const today = new Date();
  const notifications = [];
  
  pending.forEach(t => {
    if (!t.deadline) return;
    const diff = new Date(t.deadline).getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) {
      notifications.push({ type: "danger", title: "Overdue", text: `Task "${t.taskName}" for ${t.hackathonName} was due ${Math.abs(days)} days ago.` });
    } else if (days <= 2) {
      notifications.push({ type: "warning", title: "Approaching Deadline", text: `Task "${t.taskName}" for ${t.hackathonName} is due in ${days} days.` });
    }
  });
  
  return json(notifications);
}

function getRecommendations(email) {
  if (!email) return json([]);
  const hacks = _getUserHackathons(email);
  const recommendations = [];
  
  hacks.forEach(hack => {
    if (hack.pptRequired && hack.pptDate) {
      const diff = new Date(hack.pptDate).getTime() - new Date().getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days <= 5 && days >= 0) {
        recommendations.push({ title: hack.hackathonName, text: `PPT Submission in ${days} days` });
      }
    }
  });
  
  return json(recommendations);
}
