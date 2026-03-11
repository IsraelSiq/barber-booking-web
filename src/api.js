const BASE_URL = 'https://web-production-e3626.up.railway.app';

export const api = {
  async post(path, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return res.json();
  },

  async get(path, token = null) {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${path}`, { headers });
    return res.json();
  },

  async delete(path, token) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  }
};
