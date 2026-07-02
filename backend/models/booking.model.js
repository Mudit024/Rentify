import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // Customer who booked the car
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Car being booked
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },

    // Car owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Booking Dates
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },

    returnDate: {
      type: Date,
      required: [true, 'Return date is required'],
    },

    // Pickup location
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },

    // Snapshot of car price at booking time
    pricePerDay: {
      type: Number,
      required: true,
      min: [1, 'Price per day must be greater than 0'],
    },

    // Number of booked days
    totalDays: {
      type: Number,
      required: true,
      min: [1, 'Booking must be at least 1 day'],
    },

    // Total amount shown to customer
    totalPrice: {
      type: Number,
      required: true,
      min: [1, 'Total price must be greater than 0'],
    },

    // Booking Status
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// =====================
// INDEXES
// =====================

bookingSchema.index({ owner: 1 });

bookingSchema.index({ user: 1 });

bookingSchema.index({ car: 1 });

bookingSchema.index({ bookingStatus: 1 });

bookingSchema.index({
  car: 1,
  pickupDate: 1,
  returnDate: 1,
});

// =====================
// VALIDATIONS
// =====================

bookingSchema.pre('validate', function (next) {
  if (
    this.pickupDate &&
    this.returnDate &&
    this.returnDate <= this.pickupDate
  ) {
    return next(new Error('Return date must be after pickup date.'));
  }

  if (this.pickupDate && this.pickupDate < new Date()) {
    return next(new Error('Pickup date cannot be in the past.'));
  }

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;