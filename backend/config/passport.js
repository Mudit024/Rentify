import dotenv from "dotenv";
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('Google account has no public email'), null);
        }

        // 1. Existing Google user — log them in as-is, role never changes here
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2. Existing local user signing in with Google for the first time — link accounts
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          if (!user.avatar?.url && profile.photos?.[0]?.value) {
            user.avatar = { url: profile.photos[0].value, fileId: '' };
          }
          await user.save();
          return done(null, user);
        }

        // 3. Brand new user — role comes from the OAuth `state` param set on the frontend
        //    (defaults to 'customer' if missing/invalid, never allow 'admin' via this path)
        let requestedRole = 'customer';
        try {
          const state = JSON.parse(req.query.state || '{}');
          if (['customer', 'owner'].includes(state.role)) {
            requestedRole = state.role;
          }
        } catch (_) {
          // ignore malformed state, fall back to default
        }

        user = await User.create({
          name: profile.displayName || 'Google User',
          email,
          googleId: profile.id,
          authProvider: 'google',
          role: requestedRole,
          avatar: profile.photos?.[0]?.value
            ? { url: profile.photos[0].value, fileId: '' }
            : { url: '', fileId: '' },
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// We don't use persistent passport sessions (JWT cookie handles auth),
// but passport.initialize() still requires these to be defined.
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
