import express from "express";
const router = express.Router();
import {
  createElection,
  getElections,
  getElectionById,
  getElectionResults,
} from "../controllers/electionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, admin, createElection)
  .get(protect, getElections); // protect for voters, admin for create
router.route("/:id").get(protect, getElectionById); // Voters need to see details to vote
router.route("/:id/results").get(protect, getElectionResults); // Protect, logic inside controller handles admin/timing

export default router;
