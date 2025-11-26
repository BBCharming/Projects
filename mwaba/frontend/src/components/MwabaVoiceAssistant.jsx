import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const WAKE_WORDS = ["hey mwaba", "mwaba", "hello mwaba", "hello", "hi mwaba"];

export default function MwabaVoiceAssistant() {
    const [awake, setAwake] = useState(false);
    const [listening, setListening] = useState(false);
    const [lastCommand, setLastCommand] = useState('');
    const [response, setResponse] = useState('');
    const [textInput, setTextInput] = useState('');
    const [status, setStatus] = useState('Initializing...');
    const [voices, setVoices] = useState([]);
    
    const recognitionRef = useRef(null);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
                setStatus('Ready - Say "Hey Mwaba"');
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        
        // Test backend connection on component mount
        testBackendConnection();
    }, []);

    // Initialize voice recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            setStatus('Speech recognition not supported in this browser');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            console.log('🎤 Heard:', transcript);

            if (!awake) {
                // Check for wake words
                for (const word of WAKE_WORDS) {
                    if (transcript.includes(word)) {
                        console.log('✅ Wake word detected:', word);
                        setAwake(true);
                        setStatus('Awake and listening for command...');
                        speakMessage("Hello! I'm listening. What can I do for you?");
                        startListeningForCommand();
                        break;
                    }
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error !== 'no-speech') {
                setStatus(`Error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            if (!awake) {
                recognition.start();
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
        setStatus('Listening for wake words...');

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [awake]);

    const startListeningForCommand = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.lang = 'en-US';

        setListening(true);

        recognition.onresult = async (event) => {
            const command = event.results[0][0].transcript;
            console.log('🎯 Command received:', command);
            
            setLastCommand(command);
            setListening(false);
            setStatus('Processing command...');

            try {
                const result = await api.sendMessage(command);
                
                if (result.success) {
                    setResponse(result.reply);
                    speakMessage(result.reply);
                    setStatus('Command processed successfully');
                } else {
                    setResponse(`Error: ${result.error}`);
                    speakMessage("Sorry, I encountered an error. Please try again.");
                    setStatus('Failed to process command');
                }
            } catch (error) {
                setResponse('Failed to connect to Mwaba backend');
                speakMessage("I'm having trouble connecting to the server. Please check if the backend is running.");
                setStatus('Connection error');
            }

            // Return to wake word listening after a delay
            setTimeout(() => {
                setAwake(false);
                setStatus('Ready - Say "Hey Mwaba"');
            }, 5000);
        };

        recognition.onerror = (event) => {
            console.error('Command recognition error:', event.error);
            setListening(false);
            setAwake(false);
            setStatus('Recognition error - Ready for wake words');
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.start();
    };

    const speakMessage = (text) => {
        if (!window.speechSynthesis) {
            console.log('Text-to-speech not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;

        // Try to select a pleasant voice
        if (voices.length > 0) {
            // Prefer female voices for Mwaba
            const femaleVoice = voices.find(voice => 
                voice.name.toLowerCase().includes('female') ||
                voice.name.includes('Google UK Female') ||
                voice.name.includes('Samantha')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            } else {
                utterance.voice = voices[0];
            }
        }

        utterance.onend = () => {
            console.log('✅ Finished speaking');
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
        };

        window.speechSynthesis.speak(utterance);
    };

    const handleTextSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!textInput.trim()) return;

        setLastCommand(textInput);
        setStatus('Sending message...');

        try {
            const result = await api.sendMessage(textInput);
            
            if (result.success) {
                setResponse(result.reply);
                speakMessage(result.reply);
                setStatus('Message sent successfully');
            } else {
                setResponse(`Error: ${result.error}`);
                setStatus('Failed to send message');
            }
        } catch (error) {
            setResponse('Failed to connect to Mwaba backend');
            setStatus('Connection error');
        }

        setTextInput('');
    };

    const testBackendConnection = async () => {
        setStatus('Testing backend connection...');
        try {
            const result = await api.healthCheck();
            if (result) {
                setStatus('Backend connection successful!');
                speakMessage("Backend connection is working perfectly!");
            } else {
                setStatus('Backend connection failed');
                speakMessage("Backend connection failed. Please start the backend server.");
            }
        } catch (error) {
            setStatus('Backend connection failed');
        }
    };

    const testVoice = () => {
        speakMessage("Hello! I am Mwaba, your AI assistant. I'm working perfectly!");
        setStatus('Testing voice synthesis...');
    };

    return (
        <div style={{ 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h2 style={{ color: '#ff3366', textAlign: 'center' }}>Mwaba Voice Assistant</h2>
            
            <div style={{ 
                background: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '10px',
                marginBottom: '20px'
            }}>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Mode:</strong> {awake ? '🎯 Command Mode' : '💤 Sleep Mode'}</p>
                {listening && <p style={{ color: '#ff3366' }}>🎤 Listening for your command...</p>}
            </div>

            {lastCommand && (
                <div style={{ marginBottom: '15px' }}>
                    <p><strong>Your Command:</strong> {lastCommand}</p>
                </div>
            )}

            {response && (
                <div style={{ 
                    background: '#e8f5e8', 
                    padding: '15px', 
                    borderRadius: '10px',
                    marginBottom: '20px'
                }}>
                    <p><strong>Mwaba's Response:</strong> {response}</p>
                </div>
            )}

            <form onSubmit={handleTextSubmit} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Type your message here..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: '2px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '16px'
                        }}
                    />
                    <button 
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            background: '#ff3366',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Send
                    </button>
                </div>
            </form>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                    onClick={testBackendConnection}
                    style={{
                        padding: '8px 16px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Test Backend
                </button>
                
                <button 
                    onClick={testVoice}
                    style={{
                        padding: '8px 16px',
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Test Voice
                </button>
            </div>

            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p><strong>Wake Words:</strong> "Hey Mwaba", "Mwaba", "Hello Mwaba"</p>
                <p><strong>Try saying:</strong> "Hello", "What time is it?", "What's your name?"</p>
            </div>
        </div>
    );
}
