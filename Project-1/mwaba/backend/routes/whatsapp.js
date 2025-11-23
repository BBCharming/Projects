import express from 'express';
const router = express.Router();

// Example POST route (for testing Mwaba's replies)
router.post('/reply', (req, res) => {
  const { message } = req.body;
  res.json({
    success: true,
    reply: `🤖 Mwaba replies: "${message}"`
  });
});

// Optional: test GET route
router.get('/', (req, res) => {
  res.send('Mwaba WhatsApp API route active ✅');
});

export default router;


/*// backend/routes/whatsapp.js
const express = require('express');
const router = express.Router();
const {
  sendWhatsApp,
  getThreads,
  gptAssistantReply,
  addReminder
} = require('../modules/gptHelpers');

// 💬 Fetch all messages for a contact
router.get('/threads/:contact', async (req, res) => {
  try {
    const threads = await getThreads(`whatsapp:${req.params.contact}`);
    res.json({ success: true, threads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✉️ Send a WhatsApp message (simulated)
router.post('/send', async (req, res) => {
  try {
    const { to, message } = req.body;
    const response = await sendWhatsApp(`whatsapp:${to}`, message);
    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🧠 Generate assistant reply (demo)
router.post('/reply', async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await gptAssistantReply(message);
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ⏰ Add a reminder
router.post('/reminder', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await addReminder(text);
    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
*/
