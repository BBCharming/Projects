import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function AdminWhatsAppPanel() {
  const [threads, setThreads] = useState([]);
  const CONTACT = '+260762335746'; // your WhatsApp contact

  useEffect(() => { fetchThreads(); }, []);

  const fetchThreads = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/threads/${CONTACT}`);
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>WhatsApp Auto-Reply Admin Panel</h2>
      <ul>
        {threads.map(msg => (
          <li key={msg.id}>
            [{msg.role}] {msg.contact_number}: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
