const express = require('express');
const router = express.Router();
const { sendWhatsApp, getTodaysSchedule, makeCall, addReminder, gptAssistantReply } = require('../modules/gptHelpers');

router.post('/', async (req, res) => {
  const { command } = req.body;
  try {
    const text = command.toLowerCase();

    if(text.startsWith('send whatsapp')){
      const match = command.match(/send whatsapp to (.+?): (.+)/i);
      if(match){
        const to = match[1].trim();
        const msg = match[2].trim();
        const reply = await sendWhatsApp(to, msg);
        return res.json({ok:true, type:'whatsapp', reply});
      }
    }

    if(text.includes('schedule') || text.includes('meeting')){
      const schedule = await getTodaysSchedule();
      return res.json({ok:true, type:'schedule', reply:schedule});
    }

    if(text.startsWith('call ')){
      const match = command.match(/call (.+)/i);
      if(match){
        const numberOrName = match[1].trim();
        const callResult = await makeCall(numberOrName);
        return res.json({ok:true, type:'call', reply:callResult});
      }
    }

    if(text.startsWith('remind me')){
      const reminder = command.replace('remind me','').trim();
      await addReminder(reminder);
      return res.json({ok:true, type:'reminder', reply:`Reminder set: ${reminder}`});
    }

    const reply = await gptAssistantReply(command);
    return res.json({ok:true, type:'general', reply});
  } catch(err){
    console.error(err);
    return res.status(500).json({error:'failed'});
  }
});

module.exports = router;
