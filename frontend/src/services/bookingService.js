import api from './api.js';

const bookingService = {
  createBooking: async (payload) => {
    return await api.post('/bookings', payload);
  },

  getMyBookings: async () => {
    return await api.get('/bookings/my');
  },

  cancelBooking: async (bookingId) => {
    return await api.patch(`/bookings/${bookingId}/cancel`);
  },
};

export default bookingService;