/**
 * Shared Axios instance for all NourStep API calls.
 * Dev:  requests go to /api/... → Vite proxy forwards to https://api.lezz-app.com (no CORS)
 * Prod: requests go directly to https://api.lezz-app.com (server must allow the origin)
 * Auth token is injected automatically from localStorage on every request.
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : 'https://api.lezz-app.com',
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token on every request if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nourstep-auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
