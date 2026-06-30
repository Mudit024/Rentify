import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';

import connectDB from './config/db.js';
import passport from './config/passport.js';
import errorMiddleware from './middlewares/error.middleware.js';
import ApiError from './utils/ApiError.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import carRoutes from './routes/car.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import ownerRoutes from './routes/owner.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();

// ---------- Core middleware ----------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// express-session is required for passport.initialize() in this version,
// even though we don't rely on session-based auth (JWT cookie handles that).
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());

// ---------- Routes ----------
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'DriveEase API is running', data: { timestamp: new Date() } });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/admin', adminRoutes);

// ---------- 404 for unmatched API routes ----------
app.use('/api', (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

// ---------- Global error handler (always last) ----------
app.use(errorMiddleware);

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server is running`);
  });
};

startServer();
