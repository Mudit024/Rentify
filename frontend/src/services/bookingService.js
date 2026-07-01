import api from './api.js';

export const bookingService = {
  createBooking: (payload) => api.post('/bookings', payload),
  getMyBookings: () => api.get('/bookings/my'),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};
