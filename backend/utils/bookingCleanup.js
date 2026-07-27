import Booking from '../models/booking.model.js';

/**
 * Automatically cancels any booking requests that are still 'pending'
 * but whose pickupDate is already in the past (before start of today).
 */
export const cleanupExpiredBookings = async () => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Auto-cancel pending bookings whose pickupDate has passed
    await Booking.updateMany(
      {
        bookingStatus: 'pending',
        pickupDate: { $lt: todayStart },
      },
      {
        $set: { bookingStatus: 'cancelled' },
      }
    );

    // Auto-complete confirmed bookings whose returnDate has passed
    await Booking.updateMany(
      {
        bookingStatus: { $in: ['confirmed', 'approved'] },
        returnDate: { $lt: todayStart },
      },
      {
        $set: { bookingStatus: 'completed' },
      }
    );
  } catch (error) {
    console.error('Failed to cleanup expired bookings:', error.message);
  }
};
