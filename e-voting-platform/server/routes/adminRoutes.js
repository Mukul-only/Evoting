import express from "express";
const router = express.Router();
import { getAdminStats, getAllVoters } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.get("/stats", protect, admin, getAdminStats);
router.get("/voters", protect, admin, getAllVoters);
// Add more admin routes here

export default router;
