import React, { useState, useEffect } from 'react';
import api from '../services/api';

const WAKE_WORDS = ["hey mwaba", "mwaba", "hello mwaba", "hello"];

export default function MwabaVoiceAssistant() {
  const [awake, setAwake] = useState(false);
  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [response, setResponse] = useState('');
  const [textInput, setTextInput] = useState('');

  // Voice recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('Heard:', transcript);

      if (!awake) {
        for (const word of WAKE_WORDS) {
          if (transcript.includes(word)) {
            setAwake(true);
            speakMessage("Hello! I'm awake and listening.");
            startListeningForCommand();
            break;
          }
        }
      }
    };

    recognition.onerror = (err) => console.error('Recognition error:', err);
    recognition.onend = () => recognition.start();
    
    recognition.start();

    return () => recognition.stop();
  }, [awake]);

  const startListeningForCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-US';
    recognition.start();
    
    setListening(true);

    recognition.onresult = async (event) => {
      const command = event.results[0][0].transcript;
      console.log('Command:', command);
      setLastCommand(command);
      setListening(false);

      try {
        const data = await api.post('/api/whatsapp/reply', { message: command });
        if (data.success) {
          setResponse(data.reply);
          speakMessage(data.reply);
        } else {
          setResponse('Error: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        setResponse('Failed to connect to backend');
      }

      setAwake(false);
    };

    recognition.onerror = (err) => {
      console.error('Command error:', err);
      setListening(false);
      setAwake(false);
    };
  };

  const speakMessage = (msg) => {
    if (!window.speechSynthesis) {
      console.log('Speech synthesis not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;

    // Try to find a female voice
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.lang.includes('en')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    speechSynthesis.speak(utterance);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    
    setLastCommand(textInput);
    try {
      const data = await api.post('/api/whatsapp/reply', { message: textInput });
      if (data.success) {
        setResponse(data.reply);
        speakMessage(data.reply);
      } else {
        setResponse('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setResponse('Failed to connect to backend');
    }
    setTextInput('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Mwaba Voice Assistant</h2>
      <p>Status: {awake ? '🔴 Awake & Listening' : '🟢 Sleeping'}</p>
      {listening && <p>🎤 Listening for your command...</p>}
      {lastCommand && <p><strong>Command:</strong> {lastCommand}</p>}
      {response && <p><strong>Response:</strong> {response}</p>}

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Type your command here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          style={{ width: '70%', padding: 8, marginRight: 10 }}
          onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
        />
        <button onClick={handleTextSubmit} style={{ padding: 8 }}>Send</button>
      </div>
    </div>
  );
}
