import api from './api.js';

export const carService = {
  getCars: (params) => api.get('/cars', { params }),
  getCarById: (id) => api.get(`/cars/${id}`),
};
