// backend/setupSampleThreads.js
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbFile = path.resolve('./db/mwaba.db');

(async () => {
  const SQL = await initSqlJs();

  let db;
  if (fs.existsSync(dbFile)) {
    const filebuffer = fs.readFileSync(dbFile);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
  }

  const sampleThreads = [
    { contact: 'whatsapp:+260762335746', role: 'user', message: 'Hello Mwaba!' },
    { contact: 'whatsapp:+260762335746', role: 'assistant', message: 'Hey there! 😄 This is Mwaba demo mode!' },
    { contact: 'whatsapp:+2222222222', role: 'user', message: 'What\'s up?' },
    { contact: 'whatsapp:+2222222222', role: 'assistant', message: 'All good here! How can I help you today?' }
  ];

  for (const msg of sampleThreads) {
    const stmt = `INSERT INTO whatsapp_threads (contact_number, role, message, created_at) VALUES ('${msg.contact}', '${msg.role}', '${msg.message}', strftime('%s','now'))`;
    db.run(stmt);
  }

  // Save DB
  const data = db.export();
  fs.writeFileSync(dbFile, Buffer.from(data));

  console.log('✅ Sample threads populated with your contact!');
})();
