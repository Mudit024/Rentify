import express from 'express';

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/user.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// =====================================
// Authentication
// =====================================

router.use(authMiddleware);

// =====================================
// Wishlist
// =====================================

// Get user's wishlist
router.get('/wishlist', getWishlist);

// Add car to wishlist
router.post('/wishlist/:carId', addToWishlist);

// Remove car from wishlist
router.delete('/wishlist/:carId', removeFromWishlist);

export default router;