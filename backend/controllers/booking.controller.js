import Booking from '../models/booking.model.js';
import Car from '../models/car.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { sendBookingConfirmationEmail } from '../services/email.service.js';

// @route   POST /api/bookings
// @access  Private (customer)
export const createBooking = asyncHandler(async (req, res) => {
  const { car: carId, pickupDate, returnDate, pickupLocation } = req.body;

  const car = await Car.findById(carId);
  if (!car || car.approvalStatus !== 'approved') {
    throw new ApiError(404, 'Car not found');
  }
  if (!car.isAvailable) {
    throw new ApiError(400, 'This car is currently unavailable');
  }

  const pickup = new Date(pickupDate);
  const ret = new Date(returnDate);

  if (ret <= pickup) {
    throw new ApiError(400, 'Return date must be after pickup date');
  }
  if (pickup < new Date(new Date().toDateString())) {
    throw new ApiError(400, 'Pickup date cannot be in the past');
  }

  // Prevent double-booking: check overlapping active bookings for this car
  const overlapping = await Booking.findOne({
    car: carId,
    bookingStatus: { $in: ['pending', 'approved'] },
    $or: [{ pickupDate: { $lt: ret }, returnDate: { $gt: pickup } }],
  });
  if (overlapping) {
    throw new ApiError(409, 'This car is already booked for the selected dates');
  }

  const days = Math.ceil((ret - pickup) / (1000 * 60 * 60 * 24));
  const totalPrice = days * car.pricePerDay;

  const booking = await Booking.create({
    user: req.user._id,
    car: car._id,
    owner: car.owner,
    pickupDate: pickup,
    returnDate: ret,
    pickupLocation,
    totalPrice,
  });

  // Fire-and-forget — don't block the response on email delivery
  sendBookingConfirmationEmail({
    to: req.user.email,
    name: req.user.name,
    carTitle: car.title,
    pickupDate: pickup,
    returnDate: ret,
    totalPrice,
  });

  return res.status(201).json(new ApiResponse(201, booking, 'Booking created successfully'));
});

// @route   GET /api/bookings/my
// @access  Private (customer)
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .sort('-createdAt')
    .populate('car', 'title brand model images pricePerDay location')
    .populate('owner', 'name phone');

  return res.status(200).json(new ApiResponse(200, bookings, 'Bookings fetched'));
});

// @route   DELETE /api/bookings/:id
// @access  Private (customer, own booking only)
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only cancel your own bookings');
  }
  if (['completed', 'cancelled'].includes(booking.bookingStatus)) {
    throw new ApiError(400, `Booking is already ${booking.bookingStatus}`);
  }

  booking.bookingStatus = 'cancelled';
  await booking.save();

  return res.status(200).json(new ApiResponse(200, booking, 'Booking cancelled'));
});
