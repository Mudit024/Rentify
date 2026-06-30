import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1990, 'Year must be 1990 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    fuelType: {
      type: String,
      required: true,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    },
    transmission: {
      type: String,
      required: true,
      enum: ['Manual', 'Automatic'],
    },
    seats: {
      type: Number,
      required: true,
      min: [1, 'Seats must be at least 1'],
      max: [12, 'Seats cannot exceed 12'],
    },
    mileage: {
      type: Number,
      required: true,
      min: [0, 'Mileage cannot be negative'],
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [1, 'Price must be greater than 0'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true },
      },
    ],
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    ratingAvg: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

carSchema.index({ approvalStatus: 1, isAvailable: 1 });
carSchema.index({ brand: 1, location: 1 });
carSchema.index({ title: 'text', brand: 'text', model: 'text' });

const Car = mongoose.model('Car', carSchema);

export default Car;
