import express from 'express';
import {
  getOwnerDashboard,
  createCar,
  getOwnerCars,
  updateOwnerCar,
  deleteOwnerCar,
  getOwnerBookings,
  updateBookingStatus,
} from '../controllers/owner.controller.js';
import { carValidator } from '../validators/car.validators.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import ownerMiddleware from '../middlewares/owner.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(authMiddleware, ownerMiddleware);

router.get('/dashboard', getOwnerDashboard);

router.get('/cars', getOwnerCars);
router.post('/cars', upload.array('images', 8), carValidator, createCar);
router.put('/cars/:id', upload.array('images', 8), updateOwnerCar);
router.delete('/cars/:id', deleteOwnerCar);

router.get('/bookings', getOwnerBookings);
router.put('/bookings/:id', updateBookingStatus);

export default router;
