import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned by default
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: ['customer', 'owner', 'admin'],
      default: 'customer',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows many docs with no googleId
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
      },
    ],
    isVerifiedOwner: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving, only if it was modified and exists
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    avatar: this.avatar,
    role: this.role,
    authProvider: this.authProvider,
    isVerifiedOwner: this.isVerifiedOwner,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);

export default User;
