import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },
    returnDate: {
      type: Date,
      required: [true, 'Return date is required'],
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ owner: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ car: 1, pickupDate: 1, returnDate: 1 });

bookingSchema.pre('validate', function (next) {
  if (this.pickupDate && this.returnDate && this.returnDate <= this.pickupDate) {
    next(new Error('Return date must be after pickup date'));
  } else {
    next();
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
