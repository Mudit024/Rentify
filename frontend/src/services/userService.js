import api from './api.js';

export const userService = {
  getWishlist: async () => {
    return await api.get('/users/wishlist');
  },

  addToWishlist: async (carId) => {
    return await api.post(`/users/wishlist/${carId}`);
  },

  removeFromWishlist: async (carId) => {
    return await api.delete(`/users/wishlist/${carId}`);
  },
};

export default userService;