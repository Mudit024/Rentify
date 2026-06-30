import User from '../models/user.model.js';
import Car from '../models/car.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// @route   GET /api/users/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'title brand model pricePerDay images');
  return res.status(200).json(new ApiResponse(200, user.toSafeObject ? user.toSafeObject() : user, 'Profile fetched'));
});

// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;

  await user.save();

  return res.status(200).json(new ApiResponse(200, user.toSafeObject(), 'Profile updated'));
});

// @route   POST /api/users/wishlist/:carId
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  const car = await Car.findById(carId);
  if (!car) throw new ApiError(404, 'Car not found');

  const user = await User.findById(req.user._id);
  if (!user.wishlist.includes(carId)) {
    user.wishlist.push(carId);
    await user.save();
  }

  return res.status(200).json(new ApiResponse(200, user.wishlist, 'Added to wishlist'));
});

// @route   DELETE /api/users/wishlist/:carId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== carId);
  await user.save();

  return res.status(200).json(new ApiResponse(200, user.wishlist, 'Removed from wishlist'));
});
