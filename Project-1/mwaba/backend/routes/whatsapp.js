import express from 'express';
import { sendWhatsApp, getThreads, gptAssistantReply, addReminder } from '../modules/gptHelpers.js';

const router = express.Router();

router.get('/threads/:contact', async (req, res) => {
  try {
    const threads = await getThreads(`whatsapp:${req.params.contact}`);
    res.json({ success: true, threads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/send', async (req, res) => {
  try {
    const { to, message } = req.body;
    const response = await sendWhatsApp(`whatsapp:${to}`, message);
    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/reply', async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await gptAssistantReply(message);
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/reminder', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await addReminder(text);
    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;  // ✅ FIXED EXPORT
