import Car from '../models/car.model.js';
import Booking from '../models/booking.model.js';

import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

import {
  uploadMultipleImages,
} from '../services/imagekit.service.js';


// ===============================================
// @desc    Owner Dashboard
// @route   GET /api/owner/dashboard
// @access  Private (Owner)
// ===============================================

export const getOwnerDashboard = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const [
    totalCars,
    activeCars,
    pausedCars,
    bookings,
  ] = await Promise.all([
    Car.countDocuments({
      owner: ownerId,
      isDeleted: false,
    }),

    Car.countDocuments({
      owner: ownerId,
      isAvailable: true,
      isBlocked: false,
      isDeleted: false,
    }),

    Car.countDocuments({
      owner: ownerId,
      isAvailable: false,
      isDeleted: false,
    }),

    Booking.find({
      owner: ownerId,
    }),
  ]);

  const pendingBookings = bookings.filter(
    (booking) => booking.bookingStatus === 'pending'
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.bookingStatus === 'confirmed'
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.bookingStatus === 'completed'
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.bookingStatus === 'cancelled'
  ).length;

  const totalEarnings = bookings
    .filter((booking) => booking.bookingStatus === 'completed')
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalCars,
        activeCars,
        pausedCars,

        totalBookings: bookings.length,

        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,

        totalEarnings,
      },
      'Dashboard fetched successfully'
    )
  );
});



// ===============================================
// @desc    Create New Car
// @route   POST /api/owner/cars
// @access  Private (Owner)
// ===============================================

export const createCar = asyncHandler(async (req, res) => {

  if (!req.files || req.files.length === 0) {
    throw new ApiError(
      400,
      'At least one car image is required.'
    );
  }

  const images = await uploadMultipleImages(req.files);

  const car = await Car.create({

    title: req.body.title,
    brand: req.body.brand,
    model: req.body.model,
    year: req.body.year,

    fuelType: req.body.fuelType,
    transmission: req.body.transmission,

    seats: req.body.seats,
    mileage: req.body.mileage,

    color: req.body.color,

    pricePerDay: req.body.pricePerDay,

    location: req.body.location,

    description: req.body.description,

    images,

    owner: req.user._id,

    isAvailable: true,

  });

  return res.status(201).json(
    new ApiResponse(
      201,
      car,
      'Car listed successfully.'
    )
  );

});

// ===============================================
// @desc    Get All Owner Cars
// @route   GET /api/owner/cars
// @access  Private (Owner)
// ===============================================

export const getOwnerCars = asyncHandler(async (req, res) => {

  const cars = await Car.find({
    owner: req.user._id,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      cars,
      'Owner cars fetched successfully.'
    )
  );

});



// ===============================================
// @desc    Get Single Owner Car
// @route   GET /api/owner/cars/:id
// @access  Private (Owner)
// ===============================================

export const getOwnerCarById = asyncHandler(async (req, res) => {

  const car = await Car.findOne({
    _id: req.params.id,
    owner: req.user._id,
    isDeleted: false,
  });

  if (!car) {
    throw new ApiError(404, 'Car not found.');
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      car,
      'Car fetched successfully.'
    )
  );

});



// ===============================================
// @desc    Update Owner Car
// @route   PUT /api/owner/cars/:id
// @access  Private (Owner)
// ===============================================

export const updateOwnerCar = asyncHandler(async (req, res) => {

  const car = await Car.findOne({
    _id: req.params.id,
    owner: req.user._id,
    isDeleted: false,
  });

  if (!car) {
    throw new ApiError(404, 'Car not found.');
  }

  const editableFields = [
    'title',
    'brand',
    'model',
    'year',
    'fuelType',
    'transmission',
    'seats',
    'mileage',
    'color',
    'pricePerDay',
    'location',
    'description',
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      car[field] = req.body[field];
    }
  });

  // Upload New Images
  if (req.files && req.files.length > 0) {

    const uploadedImages = await uploadMultipleImages(req.files);

    car.images.push(...uploadedImages);

  }

  await car.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      car,
      'Car updated successfully.'
    )
  );

});

// ===============================================
// @desc    Toggle Car Availability
// @route   PATCH /api/owner/cars/:id/availability
// @access  Private (Owner)
// ===============================================

export const toggleCarAvailability = asyncHandler(async (req, res) => {

  const { isAvailable } = req.body;

  if (typeof isAvailable !== 'boolean') {
    throw new ApiError(
      400,
      'isAvailable must be true or false.'
    );
  }

  const car = await Car.findOne({
    _id: req.params.id,
    owner: req.user._id,
    isDeleted: false,
  });

  if (!car) {
    throw new ApiError(404, 'Car not found.');
  }

  car.isAvailable = isAvailable;

  await car.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      car,
      `Car has been ${
        isAvailable ? 'made available' : 'paused'
      } successfully.`
    )
  );

});



// ===============================================
// @desc    Soft Delete Owner Car
// @route   DELETE /api/owner/cars/:id
// @access  Private (Owner)
// ===============================================

export const deleteOwnerCar = asyncHandler(async (req, res) => {

  const car = await Car.findOne({
    _id: req.params.id,
    owner: req.user._id,
    isDeleted: false,
  });

  if (!car) {
    throw new ApiError(404, 'Car not found.');
  }

  // Prevent deletion if active bookings exist
  const activeBooking = await Booking.findOne({
    car: car._id,
    bookingStatus: {
      $in: ['pending', 'confirmed'],
    },
  });

  if (activeBooking) {
    throw new ApiError(
      400,
      'You cannot delete a car with active bookings.'
    );
  }

  // Soft Delete
  car.isDeleted = true;
  car.isAvailable = false;

  await car.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      'Car deleted successfully.'
    )
  );

});


// ===============================================
// @desc    Get All Owner Bookings
// @route   GET /api/owner/bookings
// @access  Private (Owner)
// ===============================================

export const getOwnerBookings = asyncHandler(async (req, res) => {

  const bookings = await Booking.find({
    owner: req.user._id,
  })
    .sort({ createdAt: -1 })
    .populate('user', 'name email phone avatar')
    .populate('car', 'title brand model images pricePerDay');

  return res.status(200).json(
    new ApiResponse(
      200,
      bookings,
      'Bookings fetched successfully.'
    )
  );

});



// ===============================================
// @desc    Get Single Booking
// @route   GET /api/owner/bookings/:id
// @access  Private (Owner)
// ===============================================

export const getOwnerBookingById = asyncHandler(async (req, res) => {

  const booking = await Booking.findOne({
    _id: req.params.id,
    owner: req.user._id,
  })
    .populate('user', 'name email phone avatar')
    .populate('car', 'title brand model images pricePerDay');

  if (!booking) {
    throw new ApiError(404, 'Booking not found.');
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      booking,
      'Booking fetched successfully.'
    )
  );

});



// ===============================================
// @desc    Confirm Booking
// @route   PATCH /api/owner/bookings/:id/confirm
// @access  Private (Owner)
// ===============================================

export const confirmBooking = asyncHandler(async (req, res) => {

  const booking = await Booking.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found.');
  }

  if (booking.bookingStatus !== 'pending') {
    throw new ApiError(
      400,
      'Only pending bookings can be confirmed.'
    );
  }

  booking.bookingStatus = 'confirmed';

  await booking.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      booking,
      'Booking confirmed successfully.'
    )
  );

});



// ===============================================
// @desc    Cancel Booking
// @route   PATCH /api/owner/bookings/:id/cancel
// @access  Private (Owner)
// ===============================================

export const cancelBooking = asyncHandler(async (req, res) => {

  const booking = await Booking.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found.');
  }

  if (booking.bookingStatus !== 'pending') {
    throw new ApiError(
      400,
      'Only pending bookings can be cancelled.'
    );
  }

  booking.bookingStatus = 'cancelled';

  await booking.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      booking,
      'Booking cancelled successfully.'
    )
  );

});



// ===============================================
// @desc    Complete Booking
// @route   PATCH /api/owner/bookings/:id/complete
// @access  Private (Owner)
// ===============================================

export const completeBooking = asyncHandler(async (req, res) => {

  const booking = await Booking.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found.');
  }

  if (booking.bookingStatus !== 'confirmed') {
    throw new ApiError(
      400,
      'Only confirmed bookings can be completed.'
    );
  }

  booking.bookingStatus = 'completed';

  await booking.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      booking,
      'Trip completed successfully.'
    )
  );

});