import express from "express";
const router = express.Router();
import { castVote } from "../controllers/voteController.js";
import { protect } from "../middleware/authMiddleware.js"; // Only authenticated users can vote

router.route("/").post(protect, castVote); // Ensure user is not admin in controller if needed

export default router;
