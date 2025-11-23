import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.resolve(__dirname, '../db/mwaba.db');

let db;
const SQLPromise = (async () => {
  const SQL = await initSqlJs();
  if (fs.existsSync(dbFile)) {
    const filebuffer = fs.readFileSync(dbFile);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
  }
})();

async function saveDB() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(dbFile, Buffer.from(data));
}

export async function sendWhatsApp(to, msg) {
  await SQLPromise;
  const stmt = `INSERT INTO whatsapp_threads (contact_number, role, message, created_at) VALUES ('${to}', 'assistant', '${msg}', strftime('%s','now'))`;
  db.run(stmt);
  await saveDB();
  console.log(`📤 Sent WhatsApp to ${to}: ${msg}`);
  return `Message sent to ${to}: ${msg}`;
}

export async function getThreads(contact) {
  await SQLPromise;
  const res = db.exec(`SELECT * FROM whatsapp_threads WHERE contact_number='${contact}' ORDER BY created_at ASC`);
  if (res.length === 0) return [];
  const columns = res[0].columns;
  const values = res[0].values;
  return values.map(row => {
    let obj = {};
    row.forEach((val, i) => obj[columns[i]] = val);
    return obj;
  });
}

export async function gptAssistantReply(msg) {
  return `🤖 Mwaba replies: "${msg}"`;
}

export async function addReminder(msg) {
  await SQLPromise;
  const stmt = `INSERT INTO reminders (message, remind_at, created_at) VALUES ('${msg}', strftime('%s','now'), strftime('%s','now'))`;
  db.run(stmt);
  await saveDB();
  return `⏰ Reminder set: ${msg}`;
}
