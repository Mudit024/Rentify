import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { sendTokenCookie, cookieOptions } from "../utils/generateToken.js";
import { validateEmail } from "../utils/emailValidator.js";
import { sendVerificationOtpEmail, sendPasswordResetOtpEmail } from "../services/email.service.js";

// ======================================================
// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
// ======================================================

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const isEmailValid = await validateEmail(normalizedEmail);
  if (!isEmailValid) {
    throw new ApiError(400, "The email address is invalid, disposable, or cannot receive messages.");
  }

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const allowedRoles = ["customer", "owner"];
  const userRole = allowedRoles.includes(role) ? role : "customer";

  // Generate 6-digit OTP code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: userRole,
    authProvider: "local",
    isVerified: false,
    verificationOtp: otp,
    verificationOtpExpiry: otpExpiry,
  });

  // Log OTP clearly in server terminal console logs for mock retrieval
  console.log("\n=========================================");
  console.log(`✉️  MOCK REGISTRATION EMAIL SENT TO: ${normalizedEmail}`);
  console.log(`🔑 VERIFICATION OTP CODE: ${otp}`);
  console.log("=========================================\n");

  // Send real email
  await sendVerificationOtpEmail({ to: normalizedEmail, otp });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        status: "PENDING_VERIFICATION",
        email: normalizedEmail,
      },
      "Registration successful. Verification code generated.",
    ),
  );
});

// ======================================================
// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
// ======================================================
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
    isVerified: false,
  });

  if (!user) {
    throw new ApiError(404, "User not found or already verified.");
  }

  // Check if OTP matches and is not expired
  if (user.verificationOtp !== otp || !user.verificationOtpExpiry || user.verificationOtpExpiry < new Date()) {
    throw new ApiError(400, "Invalid or expired verification code.");
  }

  // Mark as verified
  user.isVerified = true;
  user.verificationOtp = null;
  user.verificationOtpExpiry = null;
  await user.save();

  // Log in user
  sendTokenCookie(res, user._id, user.role);

  return res.status(200).json(
    new ApiResponse(
      200,
      user.toSafeObject(),
      "Email verified successfully. Welcome to Rentify!",
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

// ======================================================
// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
// ======================================================
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(404, "User with this email does not exist.");
  }

  if (user.authProvider === "google") {
    throw new ApiError(400, "Google users do not have a password. Please sign in with Google.");
  }

  // Generate 6-digit OTP code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpiry = otpExpiry;
  await user.save();

  // Log OTP clearly in server terminal console logs for mock retrieval
  console.log("\n=========================================");
  console.log(`✉️  MOCK PASSWORD RESET EMAIL SENT TO: ${normalizedEmail}`);
  console.log(`🔑 PASSWORD RESET OTP CODE: ${otp}`);
  console.log("=========================================\n");

  // Send real email
  await sendPasswordResetOtpEmail({ to: normalizedEmail, otp });

  return res.status(200).json(
    new ApiResponse(
      200,
      { email: normalizedEmail },
      "Password reset verification code sent to your email.",
    ),
  );
});

// ======================================================
// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
// ======================================================
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Check if OTP matches and is not expired
  if (user.resetPasswordOtp !== otp || !user.resetPasswordOtpExpiry || user.resetPasswordOtpExpiry < new Date()) {
    throw new ApiError(400, "Invalid or expired verification code.");
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordOtp = null;
  user.resetPasswordOtpExpiry = null;
  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Password has been reset successfully. You can now log in.",
    ),
  );
});
