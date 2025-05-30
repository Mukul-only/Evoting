import asyncHandler from "express-async-handler";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import User from "../models/User.js";
import Vote from "../models/Vote.js";

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const totalElections = await Election.countDocuments();
  const now = new Date();
  const activeElections = await Election.countDocuments({
    startTime: { $lte: now },
    endTime: { $gte: now },
  });
  const totalCandidates = await Candidate.countDocuments();
  const totalVoters = await User.countDocuments({ role: "voter" });

  res.json({
    totalElections,
    activeElections,
    totalCandidates,
    totalVoters,
  });
});

// @desc    Get all voters
// @route   GET /api/admin/voters
// @access  Private/Admin
const getAllVoters = asyncHandler(async (req, res) => {
  const voters = await User.find({ role: "voter" }).select("-password");
  res.json(voters);
});

// Add more admin-specific controllers:
// - Manage users (activate/deactivate)
// - Detailed election analytics (participation rate per election etc.)

export { getAdminStats, getAllVoters };
