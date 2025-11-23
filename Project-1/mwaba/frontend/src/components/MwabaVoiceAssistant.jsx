// src/components/MwabaVoiceAssistant.jsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const WAKE_WORDS = ["hey mwaba", "mwaba", "hello mwaba", "hi mwaba", "hello"];

export default function MwabaVoiceAssistant() {
  const [awake, setAwake] = useState(false);
  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef(null);

  // --- Initialize SpeechRecognition ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Listen in English

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("Heard:", transcript);

      if (!awake) {
        for (const word of WAKE_WORDS) {
          if (transcript.includes(word)) {
            setAwake(true);
            speakMessage("Hola! I’m awake and listening, cariño. What can I do for you?");
            startListeningForCommand();
            break;
          }
        }
      }
    };

    recognition.onerror = (err) => console.error("Recognition error:", err);
    recognition.onend = () => recognition.start(); // Keep listening forever
    recognition.start();

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [awake]);

  // --- Handle spoken commands ---
  const startListeningForCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.start();
    setListening(true);

    recog.onresult = async (event) => {
      const command = event.results[0][0].transcript.trim();
      console.log("Command received:", command);
      setLastCommand(command);
      setListening(false);

      try {
        const res = await api.post('/api/whatsapp/reply', { message: command });
        const reply = res.reply || "⚠️ Could not get reply";
        setResponse(reply);
        speakMessage(reply);
      } catch (err) {
        console.error("Backend error:", err);
        setResponse("⚠️ Error contacting Mwaba backend");
        speakMessage("Ay! I’m having trouble reaching my brain, amor. Try again?");
      }

      setAwake(false);
    };

    recog.onerror = (err) => {
      console.error("Command recognition error:", err);
      setListening(false);
      setAwake(false);
    };
  };

  // --- Speak messages with Latina English accent ---
/*  const speakMessage = (msg) => {
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = 'en-US'; // Speak English
    const voices = speechSynthesis.getVoices();

    // Pick a voice with a Spanish accent but English language
    utterance.voice =
      voices.find(v => v.name.toLowerCase().includes('es') && v.lang.startsWith('en')) ||
      voices.find(v => v.lang.startsWith('es')) ||
      voices.find(v => v.lang.startsWith('en')) ||
      null;

    utterance.pitch = 1.1;
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  };
*/
   const speakMessage = (msg) => {
   const utterance = new SpeechSynthesisUtterance(msg);
   utterance.lang = 'en-US';
   utterance.pitch = 1;
   utterance.rate = 1.05;

   const voices = speechSynthesis.getVoices();
   // Pick the most natural English voice available
   utterance.voice =
     voices.find(v => v.lang === 'en-US' && v.name.includes('Female')) ||
     voices.find(v => v.lang === 'en-US') ||
     voices[0];

   speechSynthesis.speak(utterance);
 };

  // --- Handle typed commands ---
  const handleTextCommand = async () => {
    if (!lastCommand) return;
    try {
      const res = await api.post('/api/whatsapp/reply', { message: lastCommand });
      const reply = res.reply || "⚠️ Could not get reply";
      setResponse(reply);
      speakMessage(reply);
    } catch {
      setResponse("⚠️ Error contacting Mwaba backend");
      speakMessage("Ay! I can’t reach my backend right now, cariño.");
    }
    setLastCommand('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Mwaba Voice Assistant</h2>
      <p>Status: {awake ? 'Awake & Listening' : 'Sleeping'}</p>
      {listening && <p>Listening for your command...</p>}
      <p>
        <input
          type="text"
          placeholder="Type your command here..."
          value={lastCommand}
          onChange={e => setLastCommand(e.target.value)}
        />
        <button onClick={handleTextCommand}>Send</button>
      </p>
      {response && <p><strong>Response:</strong> {response}</p>}
    </div>
  );
}
