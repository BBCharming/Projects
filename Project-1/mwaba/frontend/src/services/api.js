const BASE_URL = 'http://localhost:3000'; // or your actual backend IP if testing on phone

const api = {
  get: async (url) => {
//    const res = await fetch(BASE_URL + url);
    const res = await fetch(`http://10.24.8.163:3000${url}`);
    return res.json();
  },
  post: async (url, data) => {
//    const res = await fetch(BASE_URL + url, {
    const res = await fetch(`http://10.24.8.163:3000${url}`,{

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export default api;
