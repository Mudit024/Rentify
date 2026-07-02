import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import { sendBookingConfirmationEmail } from "../services/email.service.js";

// ======================================================
// @desc    Create Booking
// @route   POST /api/bookings
// @access  Private (Customer)
// ======================================================

export const createBooking = asyncHandler(async (req, res) => {
  const { car: carId, pickupDate, returnDate, pickupLocation } = req.body;

  const car = await Car.findById(carId);

  if (!car || car.isDeleted || car.isBlocked || !car.isAvailable) {
    throw new ApiError(404, "Car is not available.");
  }

  const pickup = new Date(pickupDate);
  const drop = new Date(returnDate);

  // Return date validation
  if (drop <= pickup) {
    throw new ApiError(400, "Return date must be after pickup date.");
  }

  // Pickup cannot be in past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (pickup < today) {
    throw new ApiError(400, "Pickup date cannot be in the past.");
  }

  // Prevent overlapping bookings

  const overlappingBooking = await Booking.findOne({
    car: carId,

    bookingStatus: {
      $in: ["pending", "confirmed"],
    },

    pickupDate: {
      $lt: drop,
    },

    returnDate: {
      $gt: pickup,
    },
  });

  if (overlappingBooking) {
    throw new ApiError(409, "Car is already booked for selected dates.");
  }

  // Calculate Days

  const totalDays = Math.ceil((drop - pickup) / (1000 * 60 * 60 * 24));

  // Calculate Price

  const totalPrice = totalDays * car.pricePerDay;

  // Create Booking

  const booking = await Booking.create({
    user: req.user._id,

    owner: car.owner,

    car: car._id,

    pickupDate: pickup,

    returnDate: drop,

    pickupLocation,

    pricePerDay: car.pricePerDay,

    totalDays,

    totalPrice,

    bookingStatus: "pending",
  });

  // Email (Fire & Forget)

  sendBookingConfirmationEmail({
    to: req.user.email,

    name: req.user.name,

    carTitle: car.title,

    pickupDate: pickup,

    returnDate: drop,

    totalPrice,
  }).catch((err) => {
    console.error("Booking Email Failed:", err.message);
  });

  return res.status(201).json(
    new ApiResponse(
      201,

      booking,

      "Booking request sent successfully.",
    ),
  );
});

// ======================================================
// @desc    Get My Bookings
// @route   GET /api/bookings/my
// @access  Private (Customer)
// ======================================================

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
  })

    .sort({ createdAt: -1 })

    .populate("car", "title brand model images pricePerDay location")

    .populate("owner", "name phone avatar");

  return res.status(200).json(
    new ApiResponse(
      200,

      bookings,

      "Bookings fetched successfully.",
    ),
  );
});

// ======================================================
// @desc    Get Booking By Id
// @route   GET /api/bookings/:id
// @access  Private (Customer)
// ======================================================

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,

    user: req.user._id,
  })

    .populate("car", "title brand model images location pricePerDay")

    .populate("owner", "name phone email avatar");

  if (!booking) {
    throw new ApiError(404, "Booking not found.");
  }

  return res.status(200).json(
    new ApiResponse(
      200,

      booking,

      "Booking fetched successfully.",
    ),
  );
});

// ======================================================
// @desc    Cancel Booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (Customer)
// ======================================================

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,

    user: req.user._id,
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found.");
  }

  // Already Finished

  if (booking.bookingStatus === "completed") {
    throw new ApiError(
      400,

      "Completed bookings cannot be cancelled.",
    );
  }

  // Already Cancelled

  if (booking.bookingStatus === "cancelled") {
    throw new ApiError(
      400,

      "Booking is already cancelled.",
    );
  }

  // Customer can cancel only before completion

  booking.bookingStatus = "cancelled";

  await booking.save();

  return res.status(200).json(
    new ApiResponse(
      200,

      booking,

      "Booking cancelled successfully.",
    ),
  );
});
