import api from './api.js';

const adminService = {
  // ==========================
  // Dashboard
  // ==========================

  getDashboard: async () => {
    return await api.get('/admin/dashboard');
  },

  // ==========================
  // Cars
  // ==========================

  getAllCars: async () => {
    return await api.get('/admin/cars');
  },

  blockCar: async (carId) => {
    return await api.patch(`/admin/cars/${carId}/block`);
  },

  unblockCar: async (carId) => {
    return await api.patch(`/admin/cars/${carId}/unblock`);
  },

  deleteCar: async (carId) => {
    return await api.delete(`/admin/cars/${carId}`);
  },

  // ==========================
  // Users
  // ==========================

  getAllUsers: async (role = '') => {
    return await api.get('/admin/users', {
      params: role ? { role } : {},
    });
  },

  blockUser: async (userId) => {
    return await api.patch(`/admin/users/${userId}/block`);
  },

  unblockUser: async (userId) => {
    return await api.patch(`/admin/users/${userId}/unblock`);
  },

  updateUserRole: async (userId, role) => {
    return await api.patch(`/admin/users/${userId}/role`, {
      role,
    });
  },

  // ==========================
  // Bookings
  // ==========================

  getAllBookings: async () => {
    return await api.get('/admin/bookings');
  },
};

export default adminService;