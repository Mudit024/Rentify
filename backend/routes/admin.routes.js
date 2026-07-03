import express from "express";

import {
  getAdminDashboard,
  getAllCars,
  blockCar,
  unblockCar,
  adminDeleteCar,
  getAllUsers,
  blockUser,
  unblockUser,
  updateUserRole,
  getAllBookings,
} from "../controllers/admin.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

// Authentication
router.use(authMiddleware, adminMiddleware);

// =====================================
// Dashboard
// =====================================

router.get("/dashboard", getAdminDashboard);

// =====================================
// Cars
// =====================================

// Get all cars
router.get("/cars", getAllCars);

// Block Car
router.patch("/cars/:id/block", blockCar);

// Unblock Car
router.patch("/cars/:id/unblock", unblockCar);

// Soft Delete Car
router.delete("/cars/:id", adminDeleteCar);

// =====================================
// Users
// =====================================

// Get all users
router.get("/users", getAllUsers);

// Block User
router.patch("/users/:id/block", blockUser);

// Unblock User
router.patch("/users/:id/unblock", unblockUser);

// Change User Role
router.patch("/users/:id/role", updateUserRole);

// =====================================
// Bookings
// =====================================

// Get all bookings
router.get("/bookings", getAllBookings);

export default router;
