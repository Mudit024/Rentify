import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data.data,

  (error) => {
    return Promise.reject({
      message:
        error.response?.data?.message ||
        'Something went wrong.',

      error:
        error.response?.data?.error,

      statusCode:
        error.response?.status,

      original: error,
    });
  }
);

export default api;