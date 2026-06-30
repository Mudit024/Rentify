import Car from '../models/car.model.js';
import Booking from '../models/booking.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { uploadMultipleImages, deleteImageFromImageKit } from '../services/imagekit.service.js';

// @route   GET /api/owner/dashboard
// @access  Private (owner)
export const getOwnerDashboard = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const [totalCars, approvedCars, pendingCars, bookings] = await Promise.all([
    Car.countDocuments({ owner: ownerId }),
    Car.countDocuments({ owner: ownerId, approvalStatus: 'approved' }),
    Car.countDocuments({ owner: ownerId, approvalStatus: 'pending' }),
    Booking.find({ owner: ownerId }),
  ]);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.bookingStatus === 'pending').length;
  const completedBookings = bookings.filter((b) => b.bookingStatus === 'completed').length;
  const totalEarnings = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return res.status(200).json(
    new ApiResponse(
      200,
      { totalCars, approvedCars, pendingCars, totalBookings, pendingBookings, completedBookings, totalEarnings },
      'Owner dashboard stats fetched'
    )
  );
});

// @route   POST /api/owner/cars
// @access  Private (owner)
export const createCar = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'At least one car image is required');
  }

  const images = await uploadMultipleImages(req.files);

  const car = await Car.create({
    ...req.body,
    owner: req.user._id,
    images,
    approvalStatus: 'pending', // every new listing must be moderated
  });

  return res.status(201).json(new ApiResponse(201, car, 'Car listed successfully and is pending admin approval'));
});

// @route   GET /api/owner/cars
// @access  Private (owner)
export const getOwnerCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({ owner: req.user._id }).sort('-createdAt');
  return res.status(200).json(new ApiResponse(200, cars, 'Your cars fetched'));
});

// @route   PUT /api/owner/cars/:id
// @access  Private (owner, own car only)
export const updateOwnerCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  if (car.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only edit your own cars');
  }

  const editableFields = [
    'title', 'brand', 'model', 'year', 'fuelType', 'transmission',
    'seats', 'mileage', 'color', 'pricePerDay', 'location', 'description', 'isAvailable',
  ];
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) car[field] = req.body[field];
  });

  // New images appended (optional on update)
  if (req.files && req.files.length > 0) {
    const newImages = await uploadMultipleImages(req.files);
    car.images.push(...newImages);
  }

  // Any edit to a previously approved/rejected car sends it back for re-moderation
  car.approvalStatus = 'pending';
  car.rejectionReason = '';

  await car.save();

  return res.status(200).json(new ApiResponse(200, car, 'Car updated and resubmitted for approval'));
});

// @route   DELETE /api/owner/cars/:id
// @access  Private (owner, own car only)
export const deleteOwnerCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  if (car.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only delete your own cars');
  }

  const activeBooking = await Booking.findOne({ car: car._id, bookingStatus: { $in: ['pending', 'approved'] } });
  if (activeBooking) {
    throw new ApiError(400, 'Cannot delete a car with active bookings');
  }

  await Promise.all(car.images.map((img) => deleteImageFromImageKit(img.fileId)));
  await car.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Car deleted successfully'));
});

// @route   GET /api/owner/bookings
// @access  Private (owner)
export const getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ owner: req.user._id })
    .sort('-createdAt')
    .populate('car', 'title brand model images')
    .populate('user', 'name email phone');

  return res.status(200).json(new ApiResponse(200, bookings, 'Bookings on your cars fetched'));
});

// @route   PUT /api/owner/bookings/:id
// @access  Private (owner, own car's booking only)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingStatus, paymentStatus } = req.body;
  const allowedStatuses = ['approved', 'rejected', 'completed'];

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only manage bookings on your own cars');
  }

  if (bookingStatus) {
    if (!allowedStatuses.includes(bookingStatus)) {
      throw new ApiError(400, 'Invalid booking status');
    }
    booking.bookingStatus = bookingStatus;
  }
  if (paymentStatus) {
    if (!['unpaid', 'paid'].includes(paymentStatus)) {
      throw new ApiError(400, 'Invalid payment status');
    }
    booking.paymentStatus = paymentStatus;
  }

  await booking.save();

  return res.status(200).json(new ApiResponse(200, booking, 'Booking updated'));
});
