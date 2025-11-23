import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import whatsappRouter from './routes/whatsapp.js';

const app = express();
app.use(express.json());
app.use('/api/whatsapp', whatsappRouter);

// ping endpoint
app.get('/ping', (req, res) => res.send('Mwaba backend is alive 🚀'));

// Serve frontend (optional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.listen(3000, () => console.log('🚀 Mwaba server running on http://localhost:3000'));
