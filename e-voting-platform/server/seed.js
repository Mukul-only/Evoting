// server/seed.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Only if you need to hash outside the model, model pre-save handles it
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Your DB connection function
import User from "./models/User.js"; // Your User model

dotenv.config({ path: "./.env" }); // Ensure environment variables are loaded

const seedAdmin = async () => {
  await connectDB(); // Connect to the database

  try {
    // Check if admin already exists to prevent duplicates
    const adminExists = await User.findOne({ email: "admin@example.com" }); // Or check by aadhaarId

    if (adminExists) {
      console.log("Admin user already exists.");
      process.exit();
    }

    // Define admin user details
    const adminData = {
      name: "Administrator",
      email: "admin@example.com", // Make sure this is unique
      aadhaarId: "101010101010", // Choose a unique Aadhaar ID for admin
      password: "123456", // Choose a strong password
      role: "admin",
      isVerified: true, // Admins are typically pre-verified
    };

    // The User model's pre-save hook will hash the password
    const newAdmin = new User(adminData);
    await newAdmin.save();

    console.log("Admin user created successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error seeding admin user: ${error.message}`);
    process.exit(1);
  }
};

// If you want to also have a function to destroy data (use with caution)
const destroyData = async () => {
  await connectDB();
  try {
    await User.deleteMany({ role: "admin", email: "admin@example.com" }); // Be specific
    console.log("Admin Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  // To run destroyData: node server/seed.js -d
  destroyData();
} else {
  seedAdmin();
}
