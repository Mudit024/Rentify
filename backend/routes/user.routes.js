import express from 'express';
import { getProfile, updateProfile, addToWishlist, removeFromWishlist } from '../controllers/user.controller.js';
import { updateProfileValidator } from '../validators/user.validators.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfileValidator, updateProfile);
router.post('/wishlist/:carId', addToWishlist);
router.delete('/wishlist/:carId', removeFromWishlist);

export default router;
