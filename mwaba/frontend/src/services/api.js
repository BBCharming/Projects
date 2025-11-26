import { API_BASE_URL } from '../config.js';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/ping`);
            return response.ok;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }

    async sendMessage(message) {
        try {
            const response = await fetch(`${this.baseURL}/api/whatsapp/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            return {
                success: false,
                error: 'Failed to connect to Mwaba backend',
                reply: 'Sorry, I cannot connect to the server right now.'
            };
        }
    }

    async getThreads(contact) {
        try {
            const response = await fetch(`${this.baseURL}/threads/${contact}`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch threads:', error);
            return { success: false, threads: [] };
        }
    }

    async sendWhatsApp(to, message) {
        try {
            const response = await fetch(`${this.baseURL}/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to, message })
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to send WhatsApp:', error);
            return { success: false, error: error.message };
        }
    }
}

const api = new ApiService();
export default api;
