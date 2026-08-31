import axios from 'axios';

/**
 * Axios instance pointed at the API.
 * In dev, Vite proxies /api to the backend (see vite.config.ts).
 * In production set VITE_API_URL to your deployed backend URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT from localStorage to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear the stored session.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sb_token');
    }
    return Promise.reject(error);
  }
);

/** Extract a friendly message from an axios error. */
export function apiError(err: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || fallback;
  }
  return fallback;
}

export default api;
