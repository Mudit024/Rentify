import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { sendTokenCookie, cookieOptions } from "../utils/generateToken.js";

// ======================================================
// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
// ======================================================

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const allowedRoles = ["customer", "owner"];

  const userRole = allowedRoles.includes(role) ? role : "customer";

  const user = await User.create({
    name: name.trim(),

    email: normalizedEmail,

    password,

    role: userRole,

    authProvider: "local",
  });

  sendTokenCookie(res, user._id, user.role);

  return res.status(201).json(
    new ApiResponse(
      201,

      user.toSafeObject(),

      "Registration successful.",
    ),
  );
});

// ======================================================
// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
// ======================================================

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new ApiError(
      401,

      "Invalid email or password.",
    );
  }

  if (user.authProvider === "google" && !user.password) {
    throw new ApiError(
      400,

      "Please continue with Google Sign-In.",
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(
      401,

      "Invalid email or password.",
    );
  }

  sendTokenCookie(res, user._id, user.role);

  return res.status(200).json(
    new ApiResponse(
      200,

      user.toSafeObject(),

      "Login successful.",
    ),
  );
});

// ======================================================
// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Private
// ======================================================

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(
    "token",

    {
      ...cookieOptions(),

      maxAge: 0,
    },
  );

  return res.status(200).json(
    new ApiResponse(
      200,

      null,

      "Logged out successfully.",
    ),
  );
});

// ======================================================
// @desc    Get Current User
// @route   GET /api/auth/me
// @access  Private
// ======================================================

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,

      req.user.toSafeObject(),

      "Current user fetched successfully.",
    ),
  );
});

// ======================================================
// @desc    Google OAuth Callback
// @route   GET /api/auth/google/callback
// @access  Public
// ======================================================

export const googleCallback = asyncHandler(async (req, res) => {
  const user = req.user;

  sendTokenCookie(
    res,

    user._id,

    user.role,
  );

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  return res.redirect(`${clientUrl}/auth/google/success`);
});
