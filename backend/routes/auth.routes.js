import express from "express";
import passport from "passport";

import {
  register,
  login,
  logout,
  getMe,
  googleCallback,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validators.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// ======================================
// Local Authentication
// ======================================

// Register
router.post("/register", registerValidator, register);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Login
router.post("/login", loginValidator, login);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

// Logout
router.post("/logout", authMiddleware, logout);

// Current Logged-in User
router.get("/me", authMiddleware, getMe);

// ======================================
// Google OAuth
// ======================================

router.get("/google", (req, res, next) => {
  const role = ["customer", "owner"].includes(req.query.role)
    ? req.query.role
    : "customer";

  const state = encodeURIComponent(JSON.stringify({ role }));

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state,
  })(req, res, next);
});

router.get(
  "/google/callback",

  passport.authenticate("google", {
    session: false,
    failureRedirect: `${
      process.env.CLIENT_URL || "http://localhost:5173"
    }/login?error=google_auth_failed`,
  }),

  googleCallback,
);

export default router;
