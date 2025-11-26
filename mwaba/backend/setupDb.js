import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Setting up Mwaba database...');

// Create db directory if it doesn't exist
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Created db directory');
}

// Create a simple database file marker
const dbFile = path.join(dbDir, 'mwaba.db');
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, '');
  console.log('✅ Created database file');
}

console.log('🎉 Database setup complete!');
console.log('📁 Database location:', dbFile);
