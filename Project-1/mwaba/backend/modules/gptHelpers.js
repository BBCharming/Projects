// backend/modules/gptHelpers.js
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbFile = path.resolve('./db/mwaba.db');

let db;
const SQLPromise = (async () => {
  const SQL = await initSqlJs();
  if (fs.existsSync(dbFile)) {
    const filebuffer = fs.readFileSync(dbFile);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
    console.log('⚠️ DB file not found, initialized empty DB');
  }
})();

async function saveDB() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(dbFile, Buffer.from(data));
}

// Simulate sending a WhatsApp message
async function sendWhatsApp(to, msg) {
  await SQLPromise;
  const stmt = `INSERT INTO whatsapp_threads (contact_number, role, message, created_at)
                VALUES ('${to}', 'assistant', '${msg}', strftime('%s','now'))`;
  db.run(stmt);
  await saveDB();
  console.log(`📤 Sent WhatsApp to ${to}: ${msg}`);
  return `Message sent to ${to}: ${msg}`;
}

// Get all messages for a contact
async function getThreads(contact) {
  await SQLPromise;
  const res = db.exec(`SELECT * FROM whatsapp_threads WHERE contact_number='${contact}' ORDER BY created_at ASC`);
  if (res.length === 0) return [];
  // convert sql.js format to JS array
  const columns = res[0].columns;
  const values = res[0].values;
  return values.map(row => {
    let obj = {};
    row.forEach((val, i) => obj[columns[i]] = val);
    return obj;
  });
}

// Example: GPT reply simulation
async function gptAssistantReply(msg) {
  // placeholder GPT response
  return `🤖 Mwaba replies: "${msg}"`;
}

// Schedule example
async function getTodaysSchedule() {
  return "🗓 You have a meeting at 2 PM and a dentist appointment at 5 PM.";
}

// Call example
async function makeCall(num) {
  return `📞 Calling ${num}...`;
}

// Add reminder example
async function addReminder(msg) {
  await SQLPromise;
  const stmt = `INSERT INTO reminders (message, remind_at, created_at)
                VALUES ('${msg}', strftime('%s','now'), strftime('%s','now'))`;
  db.run(stmt);
  await saveDB();
  return `⏰ Reminder set: ${msg}`;
}

module.exports = {
  sendWhatsApp,
  getThreads,
  gptAssistantReply,
  getTodaysSchedule,
  makeCall,
  addReminder
};
