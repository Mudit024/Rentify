import Car from "../models/car.model.js";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { cleanupExpiredBookings } from "../utils/bookingCleanup.js";

// ======================================================
// @desc    Admin Dashboard
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
// ======================================================

export const getAdminDashboard = asyncHandler(async (req, res) => {
  await cleanupExpiredBookings();
  const [
    totalUsers,

    totalOwners,

    totalCustomers,

    totalCars,

    availableCars,

    blockedCars,

    deletedCars,

    bookings,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({
      role: "owner",
    }),

    User.countDocuments({
      role: "customer",
    }),

    Car.countDocuments(),

    Car.countDocuments({
      isAvailable: true,
      isDeleted: false,
      isBlocked: false,
    }),

    Car.countDocuments({
      isBlocked: true,
    }),

    Car.countDocuments({
      isDeleted: true,
    }),

    Booking.find(),
  ]);

  const pendingBookings = bookings.filter(
    (booking) => booking.bookingStatus === "pending",
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.bookingStatus === "confirmed",
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.bookingStatus === "completed",
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.bookingStatus === "cancelled",
  ).length;

  const totalRevenue = bookings

    .filter((booking) => booking.bookingStatus === "completed")

    .reduce(
      (sum, booking) => sum + booking.totalPrice,

      0,
    );

  return res.status(200).json(
    new ApiResponse(
      200,

      {
        totalUsers,

        totalOwners,

        totalCustomers,

        totalCars,

        availableCars,

        blockedCars,

        deletedCars,

        totalBookings: bookings.length,

        pendingBookings,

        confirmedBookings,

        completedBookings,

        cancelledBookings,

        totalRevenue,
      },

      "Dashboard fetched successfully.",
    ),
  );
});

// ======================================================
// @desc    Get All Cars
// @route   GET /api/admin/cars
// @access  Private (Admin)
// ======================================================

export const getAllCars = asyncHandler(async (req, res) => {
  const cars = await Car.find()

    .sort({
      createdAt: -1,
    })

    .populate(
      "owner",

      "name email phone",
    );

  return res.status(200).json(
    new ApiResponse(
      200,

      cars,

      "All cars fetched successfully.",
    ),
  );
});

// ======================================================
// @desc    Block Car
// @route   PATCH /api/admin/cars/:id/block
// @access  Private (Admin)
// ======================================================

export const blockCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    throw new ApiError(404, "Car not found.");
  }

  if (car.isDeleted) {
    throw new ApiError(400, "Deleted cars cannot be blocked.");
  }

  if (car.isBlocked) {
    throw new ApiError(400, "Car is already blocked.");
  }

  car.isBlocked = true;

  await car.save();

  return res.status(200).json(
    new ApiResponse(
      200,

      car,

      "Car blocked successfully.",
    ),
  );
});

// ======================================================
// @desc    Unblock Car
// @route   PATCH /api/admin/cars/:id/unblock
// @access  Private (Admin)
// ======================================================

export const unblockCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    throw new ApiError(404, "Car not found.");
  }

  if (car.isDeleted) {
    throw new ApiError(400, "Deleted cars cannot be unblocked.");
  }

  if (!car.isBlocked) {
    throw new ApiError(400, "Car is already active.");
  }

  car.isBlocked = false;

  await car.save();

  return res.status(200).json(
    new ApiResponse(
      200,

      car,

      "Car unblocked successfully.",
    ),
  );
});

// ======================================================
// @desc    Soft Delete Car
// @route   DELETE /api/admin/cars/:id
// @access  Private (Admin)
// ======================================================

export const adminDeleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    throw new ApiError(404, "Car not found.");
  }

  if (car.isDeleted) {
    throw new ApiError(400, "Car is already deleted.");
  }

  // Prevent deleting cars with active bookings

  const activeBooking = await Booking.findOne({
    car: car._id,

    bookingStatus: {
      $in: ["pending", "confirmed"],
    },
  });

  if (activeBooking) {
    throw new ApiError(
      400,

      "Cannot delete a car with active bookings.",
    );
  }

  car.isDeleted = true;

  car.isAvailable = false;

  car.isBlocked = true;

  await car.save();

  return res.status(200).json(
    new ApiResponse(
      200,

      null,

      "Car deleted successfully.",
    ),
  );
});

// ======================================================
// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private (Admin)
// ======================================================

export const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;

  const filter = {};

  if (role) {
    filter.role = role;
  }

  const users = await User.find(filter)

    .sort({
      createdAt: -1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,

      users,

      "Users fetched successfully.",
    ),
  );
});

// ======================================================
// @desc    Block User
// @route   PATCH /api/admin/users/:id/block
// @access  Private (Admin)
// ======================================================

export const blockUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(
      400,

      "You cannot block yourself.",
    );
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(
      404,

      "User not found.",
    );
  }

  if (user.isBlocked) {
    throw new ApiError(
      400,

      "User is already blocked.",
    );
  }

  user.isBlocked = true;

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,

      user.toSafeObject(),

      "User blocked successfully.",
    ),
  );
});

// ======================================================
// @desc    Unblock User
// @route   PATCH /api/admin/users/:id/unblock
// @access  Private (Admin)
// ======================================================

export const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(
      404,

      "User not found.",
    );
  }

  if (!user.isBlocked) {
    throw new ApiError(
      400,

      "User is already active.",
    );
  }

  user.isBlocked = false;

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,

      user.toSafeObject(),

      "User unblocked successfully.",
    ),
  );
});

// ======================================================
// @desc    Update User Role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin)
// ======================================================

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const allowedRoles = ["customer", "owner", "admin"];

  if (!allowedRoles.includes(role)) {
    throw new ApiError(
      400,

      "Invalid role.",
    );
  }

  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(
      400,

      "You cannot change your own role.",
    );
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(
      404,

      "User not found.",
    );
  }

  user.role = role;

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,

      user.toSafeObject(),

      `Role updated to ${role}.`,
    ),
  );
});

// ======================================================
// @desc    Get All Bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin)
// ======================================================

export const getAllBookings = asyncHandler(async (req, res) => {
  await cleanupExpiredBookings();

  const bookings = await Booking.find()

    .sort({
      createdAt: -1,
    })

    .populate("car", "title brand model images pricePerDay")

    .populate("user", "name email phone")

    .populate("owner", "name email phone");

  return res.status(200).json(
    new ApiResponse(
      200,

      bookings,

      "Bookings fetched successfully.",
    ),
  );
});
