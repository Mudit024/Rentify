import api from './api.js';

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  googleAuthUrl: (role = 'customer') => {
    const base = import.meta.env.VITE_GOOGLE_OAUTH_URL || 'http://localhost:5000/api/auth/google';
    return `${base}?role=${role}`;
  },
};

export default authService;
