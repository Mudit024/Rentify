import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for admin seeding...');

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in .env');
    }

    let admin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() }).select('+password');

    if (admin) {
      admin.role = 'admin';
      admin.name = ADMIN_NAME;
      admin.password = ADMIN_PASSWORD; // re-hashed by the pre-save hook
      admin.authProvider = 'local';
      await admin.save();
      console.log(`Existing user upgraded to admin: ${ADMIN_EMAIL}`);
    } else {
      admin = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        authProvider: 'local',
      });
      console.log(`Admin account created: ${ADMIN_EMAIL}`);
    }

    console.log('Done. You can now log in with these credentials at /login');
    process.exit(0);
  } catch (err) {
    console.error(`Seed failed: ${err.message}`);
    process.exit(1);
  }
};

seedAdmin();
