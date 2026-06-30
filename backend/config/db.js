import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
  try {
    console.log("Connecting...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;