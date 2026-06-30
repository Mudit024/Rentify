import Car from '../models/car.model.js';
import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { deleteImageFromImageKit } from '../services/imagekit.service.js';

// @route   GET /api/admin/dashboard
// @access  Private (admin)
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalOwners, totalCustomers, totalCars, pendingCars, totalBookings, paidBookings] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'owner' }),
      User.countDocuments({ role: 'customer' }),
      Car.countDocuments(),
      Car.countDocuments({ approvalStatus: 'pending' }),
      Booking.countDocuments(),
      Booking.find({ paymentStatus: 'paid' }),
    ]);

  const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const pendingBookings = await Booking.countDocuments({ bookingStatus: 'pending' });
  const completedBookings = await Booking.countDocuments({ bookingStatus: 'completed' });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalOwners,
        totalCustomers,
        totalCars,
        pendingCars,
        totalBookings,
        pendingBookings,
        completedBookings,
        totalRevenue,
      },
      'Admin dashboard stats fetched'
    )
  );
});

// @route   GET /api/admin/cars/pending
// @access  Private (admin)
export const getPendingCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({ approvalStatus: 'pending' }).sort('-createdAt').populate('owner', 'name email phone');
  return res.status(200).json(new ApiResponse(200, cars, 'Pending listings fetched'));
});

// @route   PUT /api/admin/cars/:id/approve
// @access  Private (admin)
export const approveCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');

  car.approvalStatus = 'approved';
  car.rejectionReason = '';
  await car.save();

  return res.status(200).json(new ApiResponse(200, car, 'Car listing approved'));
});

// @route   PUT /api/admin/cars/:id/reject
// @access  Private (admin)
export const rejectCar = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;
  if (!rejectionReason || !rejectionReason.trim()) {
    throw new ApiError(400, 'A rejection reason is required');
  }

  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');

  car.approvalStatus = 'rejected';
  car.rejectionReason = rejectionReason.trim();
  await car.save();

  return res.status(200).json(new ApiResponse(200, car, 'Car listing rejected'));
});

// @route   DELETE /api/admin/cars/:id
// @access  Private (admin)
export const adminDeleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');

  await Promise.all(car.images.map((img) => deleteImageFromImageKit(img.fileId)));
  await car.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Car listing removed by admin'));
});

// @route   GET /api/admin/users
// @access  Private (admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).sort('-createdAt');
  return res.status(200).json(new ApiResponse(200, users, 'Users fetched'));
});

// @route   PUT /api/admin/users/:id/role
// @access  Private (admin)
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'owner', 'admin'].includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }

  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot change your own role');
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.role = role;
  await user.save();

  return res.status(200).json(new ApiResponse(200, user.toSafeObject(), `User role updated to ${role}`));
});

// @route   GET /api/admin/bookings
// @access  Private (admin)
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .sort('-createdAt')
    .populate('car', 'title brand model')
    .populate('user', 'name email')
    .populate('owner', 'name email');

  return res.status(200).json(new ApiResponse(200, bookings, 'All bookings fetched'));
});
