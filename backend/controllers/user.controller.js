import User from '../models/user.model.js';
import Car from '../models/car.model.js';

import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// ======================================================
// @desc    Get Wishlist
// @route   GET /api/users/wishlist
// @access  Private
// ======================================================

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'wishlist',
    'title brand model images pricePerDay location isAvailable'
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      user.wishlist,
      'Wishlist fetched successfully.'
    )
  );
});

// ======================================================
// @desc    Add Car To Wishlist
// @route   POST /api/users/wishlist/:carId
// @access  Private
// ======================================================

export const addToWishlist = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  const car = await Car.findById(carId);

  if (!car) {
    throw new ApiError(404, 'Car not found.');
  }

  if (!car.isAvailable) {
    throw new ApiError(400, 'This car is currently unavailable.');
  }

  const user = await User.findById(req.user._id);

  const alreadyExists = user.wishlist.some(
    (id) => id.toString() === carId
  );

  if (alreadyExists) {
    throw new ApiError(400, 'Car already exists in wishlist.');
  }

  user.wishlist.push(carId);

  await user.save();

  const updatedUser = await User.findById(req.user._id).populate(
    'wishlist',
    'title brand model images pricePerDay location isAvailable'
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedUser.wishlist,
      'Car added to wishlist.'
    )
  );
});

// ======================================================
// @desc    Remove Car From Wishlist
// @route   DELETE /api/users/wishlist/:carId
// @access  Private
// ======================================================

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== carId
  );

  await user.save();

  const updatedUser = await User.findById(req.user._id).populate(
    'wishlist',
    'title brand model images pricePerDay location isAvailable'
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedUser.wishlist,
      'Car removed from wishlist.'
    )
  );
});