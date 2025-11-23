import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/ping', (req, res) => {
  res.send('🚀 Mwaba Backend is Running!');
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Mwaba AI Assistant',
    version: '1.0.0',
    endpoints: {
      health: '/ping',
      whatsapp: '/api/whatsapp/reply'
    }
  });
});

// WhatsApp reply endpoint
app.post('/api/whatsapp/reply', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'No message provided'
      });
    }

    console.log(`📨 Received message: ${message}`);

    // Simple AI response logic
    const lowerMessage = message.toLowerCase();
    let reply = '';

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      reply = 'Hello! I am Mwaba, your AI assistant. How can I help you today?';
    } else if (lowerMessage.includes('time')) {
      reply = `The current time is ${new Date().toLocaleTimeString()}`;
    } else if (lowerMessage.includes('name')) {
      reply = 'I am Mwaba, your personal AI assistant!';
    } else if (lowerMessage.includes('weather')) {
      reply = 'I cannot check weather yet, but I can help with messages and reminders!';
    } else if (lowerMessage.includes('thank')) {
      reply = 'You are welcome! Is there anything else I can help with?';
    } else {
      reply = `I understand you said: "${message}". How can I assist you further?`;
    }

    res.json({
      success: true,
      reply: reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/whatsapp/reply:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Test endpoint for voice commands
app.post('/api/voice/command', (req, res) => {
  const { command } = req.body;
  
  if (!command) {
    return res.status(400).json({
      success: false,
      error: 'No command provided'
    });
  }

  const response = `Executing command: ${command}`;
  
  res.json({
    success: true,
    response: response,
    action: 'command_received'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mwaba Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/ping`);
  console.log(`💬 API endpoint: http://localhost:${PORT}/api/whatsapp/reply`);
});
