import axios from 'axios';
import { tokenStorage } from './tokenStorage';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every outgoing request.
api.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// A 401 means the token is missing, invalid or expired - drop it and
// send the user back to login rather than leaving the app half-broken.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginRequest = error.config?.url?.includes('/users/login');

    if (status === 401 && !isLoginRequest) {
      tokenStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);