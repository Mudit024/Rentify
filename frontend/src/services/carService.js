import api from './api.js';

const carService = {
  getCars: async (params = {}) => {
    return await api.get('/cars', { params });
  },

  getCarById: async (carId) => {
    return await api.get(`/cars/${carId}`);
  },
};

export default carService;