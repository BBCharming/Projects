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
    { contact:
