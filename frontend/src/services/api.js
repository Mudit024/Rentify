import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // sends/receives the httpOnly JWT cookie
  headers: { 'Content-Type': 'application/json' },
});

// Centralized response unwrapping + error normalization.
// Every backend response is { success, message, data, error }; we surface `message` consistently.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject({ message, statusCode: error.response?.status, original: error });
  }
);

export default api;
