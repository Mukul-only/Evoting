import express from "express";
const router = express.Router();
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // For both voters and admins

// Note: /api/auth/profile might be duplicative if you implement /api/users/profile
// Decide on one canonical route for fetching the logged-in user's profile.
// For this example, we'll use /api/users/profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
