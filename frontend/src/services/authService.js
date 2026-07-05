import api from './api.js';

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  verifyOtp: (payload) => api.post('/auth/verify-otp', payload),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  selectRole: (payload) => api.post('/auth/select-role', payload),
  googleAuthUrl: (role = 'customer') => {
    const base = import.meta.env.VITE_GOOGLE_OAUTH_URL || 'http://localhost:5000/api/auth/google';
    return `${base}?role=${role}`;
  },
};

export default authService;
