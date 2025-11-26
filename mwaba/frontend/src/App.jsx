import React from 'react';
import MwabaVoiceAssistant from './components/MwabaVoiceAssistant';
import AdminWhatsAppPanel from './components/AdminWhatsAppPanel';

export default function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Welcome to Mwaba AI Assistant</h1>
      <MwabaVoiceAssistant />
      <hr style={{ margin: '20px 0' }} />
      <AdminWhatsAppPanel />
    </div>
  );
}
