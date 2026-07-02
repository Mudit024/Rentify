import express from "express";

import {
  // Dashboard
  getOwnerDashboard,

  // Car Management
  createCar,
  getOwnerCars,
  getOwnerCarById,
  updateOwnerCar,
  toggleCarAvailability,
  deleteOwnerCar,

  // Booking Management
  getOwnerBookings,
  getOwnerBookingById,
  confirmBooking,
  cancelBooking,
  completeBooking,
} from "../controllers/owner.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import ownerMiddleware from "../middlewares/owner.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { carValidator } from "../validators/car.validators.js";

const router = express.Router();

// All owner routes require authentication
router.use(authMiddleware, ownerMiddleware);

// ======================================
// Dashboard
// ======================================

router.get("/dashboard", getOwnerDashboard);

// ======================================
// Car Management
// ======================================

// Add New Car
router.post("/cars", upload.array("images", 8), carValidator, createCar);

// Get All Owner Cars
router.get("/cars", getOwnerCars);

// Get Single Car
router.get("/cars/:id", getOwnerCarById);

// Update Car
router.put("/cars/:id", upload.array("images", 8), updateOwnerCar);

// Pause / Resume Listing
router.patch("/cars/:id/availability", toggleCarAvailability);

// Soft Delete Car
router.delete("/cars/:id", deleteOwnerCar);

// ======================================
// Booking Management
// ======================================

// Get All Booking Requests
router.get("/bookings", getOwnerBookings);

// Get Single Booking
router.get("/bookings/:id", getOwnerBookingById);

// Accept Booking
router.patch("/bookings/:id/confirm", confirmBooking);

// Cancel Booking
router.patch("/bookings/:id/cancel", cancelBooking);

// Complete Trip
router.patch("/bookings/:id/complete", completeBooking);

export default router;
