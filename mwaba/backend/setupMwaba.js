// backend/setupMwaba.js
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbFile = path.resolve('./db/mwaba.db');
const dbDir = path.dirname(dbFile);

(async () => {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const SQL = await initSqlJs();

  let db;
  if (fs.existsSync(dbFile)) {
    const filebuffer = fs.readFileSync(dbFile);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables individually
  db.run(`
    CREATE TABLE IF NOT EXISTS pending_replies (
      id INTEGER PRIMARY KEY,
      from_number TEXT,
      to_number TEXT,
      incoming_text TEXT,
      suggested_reply TEXT,
      tone TEXT DEFAULT 'playful',
      sent INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS whatsapp_threads (
      id INTEGER PRIMARY KEY,
      contact_number TEXT,
      message TEXT,
      role TEXT,
      tone TEXT DEFAULT 'playful',
      created_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY,
      message TEXT,
      remind_at INTEGER,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);

  // Save DB
  const data = db.export();
  fs.writeFileSync(dbFile, Buffer.from(data));
  console.log('✅ Mwaba DB setup complete');
})();
