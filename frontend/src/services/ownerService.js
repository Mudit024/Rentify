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

const multipartConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

const ownerService = {
  // Dashboard
  getDashboard: async () => {
    return await api.get('/owner/dashboard');
  },

  // Cars
  getMyCars: async () => {
    return await api.get('/owner/cars');
  },

  createCar: async (carData) => {
    return await api.post(
      '/owner/cars',
      toFormData(carData),
      multipartConfig
    );
  },

  updateCar: async (carId, carData) => {
    return await api.put(
      `/owner/cars/${carId}`,
      toFormData(carData),
      multipartConfig
    );
  },

  deleteCar: async (carId) => {
    return await api.delete(`/owner/cars/${carId}`);
  },

  // Bookings
  getOwnerBookings: async () => {
    return await api.get('/owner/bookings');
  },

  updateBookingStatus: async (bookingId, payload) => {
    const { bookingStatus } = payload;
    if (bookingStatus === 'approved' || bookingStatus === 'confirmed') {
      return await api.patch(`/owner/bookings/${bookingId}/confirm`);
    }
    if (bookingStatus === 'rejected' || bookingStatus === 'cancelled') {
      return await api.patch(`/owner/bookings/${bookingId}/cancel`);
    }
    if (bookingStatus === 'completed') {
      return await api.patch(`/owner/bookings/${bookingId}/complete`);
    }
    return await api.patch(`/owner/bookings/${bookingId}/confirm`);
  },
};

export default ownerService;