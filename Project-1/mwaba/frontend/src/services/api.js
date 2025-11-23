const BASE_URL = 'http://localhost:3000';

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to connect to backend'
      };
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Specific API methods
  async sendMessage(message) {
    return this.post('/api/whatsapp/reply', { message });
  }

  async sendVoiceCommand(command) {
    return this.post('/api/voice/command', { command });
  }

  async healthCheck() {
    return this.get('/ping');
  }
}

// Create singleton instance
const api = new ApiService();
export default api;
