import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { sendTokenCookie, cookieOptions } from '../utils/generateToken.js';

// @route   POST /api/auth/register
// @access  Public

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // role is whitelisted by the validator to only ever be 'customer' | 'owner'
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'customer',
    authProvider: 'local',
  });

  sendTokenCookie(res, user._id, user.role);

  return res.status(201).json(new ApiResponse(201, user.toSafeObject(), 'Registration successful'));
});

// @route   POST /api/auth/login
// @access  Public

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.authProvider === 'google' && !user.password) {
    throw new ApiError(400, 'This account uses Google Sign-In. Please continue with Google.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  sendTokenCookie(res, user._id, user.role);

  return res.status(200).json(new ApiResponse(200, user.toSafeObject(), 'Login successful'));
});

// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', { ...cookieOptions(), maxAge: 0 });
  return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by authMiddleware
  return res.status(200).json(new ApiResponse(200, req.user.toSafeObject(), 'Current user fetched'));
});

// @route   GET /api/auth/google/callback
// @access  Public (Passport handles the handshake)
export const googleCallback = asyncHandler(async (req, res) => {
  // req.user here is the Mongoose user doc set by Passport's verify callback
  const user = req.user;
  sendTokenCookie(res, user._id, user.role);

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return res.redirect(`${clientUrl}/auth/google/success`);
});
