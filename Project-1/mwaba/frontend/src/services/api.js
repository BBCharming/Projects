const BASE_URL = 'http://localhost:3000';

const api = {
  get: async (url) => {
    const res = await fetch(`${BASE_URL}${url}`);
    return res.json();
  },
  post: async (url, data) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

export default api;
