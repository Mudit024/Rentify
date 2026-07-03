import express from "express";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/booking.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import { createBookingValidator } from "../validators/booking.validators.js";

const router = express.Router();

router.use(authMiddleware);

// Create Booking
router.post("/", createBookingValidator, createBooking);

// My Bookings
router.get("/my", getMyBookings);

// Single Booking
router.get("/:id", getBookingById);

// Cancel Booking
router.patch("/:id/cancel", cancelBooking);

export default router;
