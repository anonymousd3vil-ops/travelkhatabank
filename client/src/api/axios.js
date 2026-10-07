import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
  const saved = JSON.parse(localStorage.getItem('tkb') || 'null');
  if (saved?.token) config.headers.Authorization = `Bearer ${saved.token}`;
  return config;
});

export default api;
