const BASE_URL = 'http://localhost:3000';

const api = {
  get: async (url) => {
    try {
      const res = await fetch(`${BASE_URL}${url}`);
      return await res.json();
    } catch (error) {
      console.error('API GET error:', error);
      return { success: false, error: 'Failed to connect to backend' };
    }
  },
  post: async (url, data) => {
    try {
      const res = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (error) {
      console.error('API POST error:', error);
      return { success: false, error: 'Failed to connect to backend' };
    }
  }
};

export default api;
