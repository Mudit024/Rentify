import express from 'express';
import passport from 'passport';
import { register, login, logout, getMe, googleCallback } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validators.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// ---------- Local auth ----------
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);

// ---------- Google OAuth ----------
// Frontend sends ?role=customer|owner so the new-account role can be passed through
// Passport's `state` param survives the redirect round-trip to Google and back.
router.get('/google', (req, res, next) => {
  const role = ['customer', 'owner'].includes(req.query.role) ? req.query.role : 'customer';
  const state = encodeURIComponent(JSON.stringify({ role }));

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state,
  })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
  }),
  googleCallback
);

export default router;
