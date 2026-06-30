import express from 'express';
import {
  getAdminDashboard,
  getPendingCars,
  approveCar,
  rejectCar,
  adminDeleteCar,
  getAllUsers,
  updateUserRole,
  getAllBookings,
} from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', getAdminDashboard);

router.get('/cars/pending', getPendingCars);
router.put('/cars/:id/approve', approveCar);
router.put('/cars/:id/reject', rejectCar);
router.delete('/cars/:id', adminDeleteCar);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

router.get('/bookings', getAllBookings);

export default router;
