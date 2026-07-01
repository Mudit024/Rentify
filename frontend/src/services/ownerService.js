import api from './api.js';

const toFormData = (carData) => {
  const formData = new FormData();
  Object.entries(carData).forEach(([key, value]) => {
    if (key === 'images' && Array.isArray(value)) {
      value.forEach((file) => formData.append('images', file));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};

export const ownerService = {
  getDashboard: () => api.get('/owner/dashboard'),
  getMyCars: () => api.get('/owner/cars'),
  createCar: (carData) =>
    api.post('/owner/cars', toFormData(carData), { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCar: (id, carData) =>
    api.put(`/owner/cars/${id}`, toFormData(carData), { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCar: (id) => api.delete(`/owner/cars/${id}`),
  getOwnerBookings: () => api.get('/owner/bookings'),
  updateBookingStatus: (id, payload) => api.put(`/owner/bookings/${id}`, payload),
};
