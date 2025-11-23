import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/ping', (req, res) => {
  res.send('Mwaba backend is alive 🚀');
});

// Simple reply endpoint
app.post('/api/whatsapp/reply', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ success: false, reply: 'No message provided' });
  }

  let reply = '';
  const msg = message.toLowerCase();

  if (msg.includes('hello') || msg.includes('hi')) {
    reply = 'Hello! I am ready for your command.';
  } else if (msg.includes('time')) {
    reply = `The current time is ${new Date().toLocaleTimeString()}`;
  } else if (msg.includes('name')) {
    reply = 'I am Mwaba, your personal assistant!';
  } else {
    reply = `I heard: "${message}". How can I help you?`;
  }

  res.json({ 
    success: true, 
    reply: `🤖 Mwaba: "${reply}"`
  });
});

app.listen(PORT, () => {
  console.log('🚀 Mwaba backend running on http://localhost:3000');
});
