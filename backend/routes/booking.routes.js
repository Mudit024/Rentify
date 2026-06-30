import express from 'express';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/booking.controller.js';
import { createBookingValidator } from '../validators/booking.validators.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createBookingValidator, createBooking);
router.get('/my', getMyBookings);
router.delete('/:id', cancelBooking);

export default router;
