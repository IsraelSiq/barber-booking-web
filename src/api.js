const BASE_URL = 'https://web-production-e3626.up.railway.app';

async function fetchComTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') throw new Error('A API demorou demais para responder. Tente novamente.');
    throw new Error('Sem conexão com o servidor. Verifique sua internet.');
  }
}

export const api = {
  async post(path, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetchComTimeout(`${BASE_URL}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
      return res.json();
    } catch (err) {
      return { detail: err.message };
    }
  },

  async postForm(path, body) {
    const form = new URLSearchParams();
    Object.entries(body).forEach(([k, v]) => form.append(k, v));
    try {
      const res = await fetchComTimeout(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });
      return res.json();
    } catch (err) {
      return { detail: err.message };
    }
  },

  async get(path, token = null) {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetchComTimeout(`${BASE_URL}${path}`, { headers });
      return res.json();
    } catch (err) {
      return { detail: err.message };
    }
  },

  async put(path, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetchComTimeout(`${BASE_URL}${path}`, { method: 'PUT', headers, body: JSON.stringify(body) });
      return res.json();
    } catch (err) {
      return { detail: err.message };
    }
  },

  async delete(path, token) {
    try {
      const res = await fetchComTimeout(`${BASE_URL}${path}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return res.json();
    } catch (err) {
      return { detail: err.message };
    }
  }
};
