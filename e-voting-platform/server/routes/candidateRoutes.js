import express from "express";
const router = express.Router({ mergeParams: true }); // To get :electionId
import {
  addCandidate,
  getCandidatesForElection,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidateController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, admin, addCandidate)
  .get(protect, admin, getCandidatesForElection); // Or just 'protect' if voters can see candidates before voting page

router
  .route("/:candidateId")
  .get(protect, admin, getCandidateById)
  .put(protect, admin, updateCandidate)
  .delete(protect, admin, deleteCandidate);

export default router;
