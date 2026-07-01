import api from './api.js';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getPendingCars: () => api.get('/admin/cars/pending'),
  approveCar: (id) => api.put(`/admin/cars/${id}/approve`),
  rejectCar: (id, rejectionReason) => api.put(`/admin/cars/${id}/reject`, { rejectionReason }),
  deleteCar: (id) => api.delete(`/admin/cars/${id}`),
  getAllUsers: (role) => api.get('/admin/users', { params: role ? { role } : {} }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getAllBookings: () => api.get('/admin/bookings'),
};
