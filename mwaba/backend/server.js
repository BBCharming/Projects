import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enhanced CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/ping', (req, res) => {
    res.json({ 
        status: 'healthy', 
        message: '🚀 Mwaba Backend is Running!',
        timestamp: new Date().toISOString()
    });
});

// API info endpoint
app.get('/api/whatsapp/reply', (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Mwaba AI Assistant",
        version: "1.0.0",
        endpoints: {
            health: "/ping",
            whatsapp: "/api/whatsapp/reply",
            threads: "/threads/:contact",
            send: "/send"
        }
    });
});

// Main reply endpoint - Enhanced with better error handling
app.post('/api/whatsapp/reply', (req, res) => {
    console.log('📨 Received message:', req.body);
    
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({
            success: false,
            error: "No message provided"
        });
    }

    // Enhanced AI response logic
    let reply = '';
    const msg = message.toLowerCase().trim();

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        reply = "Hello! I'm Mwaba, your AI assistant. How can I help you today?";
    } else if (msg.includes('time')) {
        reply = `The current time is ${new Date().toLocaleTimeString()}`;
    } else if (msg.includes('name')) {
        reply = "I'm Mwaba, your personal AI assistant! I'm here to make your life easier.";
    } else if (msg.includes('how are you')) {
        reply = "I'm doing great! Ready to help you with anything you need. What can I do for you?";
    } else if (msg.includes('thank')) {
        reply = "You're welcome! Is there anything else I can help with?";
    } else if (msg.includes('weather')) {
        reply = "I don't have access to weather data right now, but I can help with many other things!";
    } else if (msg.includes('joke')) {
        reply = "Why don't scientists trust atoms? Because they make up everything! 😄";
    } else {
        reply = "I heard you say: \"" + message + "\". I'm still learning, but I'm here to help with your questions!";
    }

    console.log('🤖 Sending reply:', reply);
    
    res.json({
        success: true,
        reply: `🤖 ${reply}`,
        timestamp: new Date().toISOString(),
        originalMessage: message
    });
});

// WhatsApp threads endpoint
app.get('/threads/:contact', async (req, res) => {
    try {
        const contact = req.params.contact;
        console.log('📋 Fetching threads for:', contact);
        
        // Simulated thread data
        const sampleThreads = [
            { id: 1, contact_number: contact, role: 'user', message: 'Hello Mwaba!', created_at: Date.now() },
            { id: 2, contact_number: contact, role: 'assistant', message: 'Hey there! 😄 How can I help you today?', created_at: Date.now() }
        ];
        
        res.json({ 
            success: true, 
            threads: sampleThreads,
            contact: contact
        });
    } catch (error) {
        console.error('Error fetching threads:', error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch threads" 
        });
    }
});

// Send message endpoint
app.post('/send', async (req, res) => {
    try {
        const { to, message } = req.body;
        console.log('📤 Sending message to:', to, 'Message:', message);
        
        // Simulate sending message
        res.json({ 
            success: true, 
            message: `Message sent to ${to}: ${message}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to send message" 
        });
    }
});

// Reminder endpoint
app.post('/reminder', async (req, res) => {
    try {
        const { text } = req.body;
        console.log('⏰ Setting reminder:', text);
        
        res.json({ 
            success: true, 
            message: `Reminder set: ${text}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error setting reminder:', error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to set reminder" 
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('🚨 Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Mwaba Backend Server running on http://localhost:3000');
    console.log('📊 Health check: http://localhost:3000/ping');
    console.log('💬 API endpoint: http://localhost:3000/api/whatsapp/reply');
    console.log('🌐 CORS enabled for frontend: http://localhost:5173');
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Mwaba backend gracefully...');
    process.exit(0);
});
