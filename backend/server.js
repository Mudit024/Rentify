import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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

const app = express();

// ===============================
// Core Middlewares
// ===============================

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

app.use(cookieParser());

app.use(passport.initialize());

// ===============================
// Health Check
// ===============================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rentify API is running.',
    data: {
      timestamp: new Date(),
    },
  });
});

// ===============================
// Routes
// ===============================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/admin', adminRoutes);

// ===============================
// 404 Handler
// ===============================

app.use('/api', (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

// ===============================
// Global Error Middleware
// ===============================

app.use(errorMiddleware);

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();