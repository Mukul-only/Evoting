import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// @desc    Get user profile (already in authController, can be moved or kept separate)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email; // Add email uniqueness check if changed
    // Aadhaar ID should typically not be changeable by user

    if (req.body.password) {
      user.password = req.body.password; // Mongoose pre-save hook will hash it
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      aadhaarId: updatedUser.aadhaarId, // Send back for consistency
      role: updatedUser.role,
      // Do not send token here, it's for login/register
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
export { getUserProfile, updateUserProfile };
