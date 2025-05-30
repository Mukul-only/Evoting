import asyncHandler from "express-async-handler";
import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import Vote from "../models/Vote.js";
// @desc    Add a candidate to an election
// @route   POST /api/elections/:electionId/candidates
// @access  Private/Admin
const addCandidate = asyncHandler(async (req, res) => {
  const { name, party, symbolUrl } = req.body;
  const { electionId } = req.params;

  const election = await Election.findById(electionId);
  if (!election) {
    res.status(404);
    throw new Error("Election not found");
  }
  if (election.status !== "pending") {
    res.status(400);
    throw new Error(
      "Cannot add candidates to an active or completed election."
    );
  }

  const candidate = new Candidate({
    name,
    party,
    symbolUrl,
    election: electionId,
  });
  const createdCandidate = await candidate.save();
  res.status(201).json(createdCandidate);
});

// @desc    Get a single candidate by ID
// @route   GET /api/elections/:electionId/candidates/:candidateId
// @access  Private/Admin
const getCandidateById = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.candidateId);
  if (candidate && candidate.election.toString() === req.params.electionId) {
    res.json(candidate);
  } else {
    res.status(404);
    throw new Error("Candidate not found for this election");
  }
});

// @desc    Update a candidate
// @route   PUT /api/elections/:electionId/candidates/:candidateId
// @access  Private/Admin
const updateCandidate = asyncHandler(async (req, res) => {
  const { name, party, symbolUrl } = req.body;
  const { electionId, candidateId } = req.params;

  const election = await Election.findById(electionId);
  if (!election) {
    res.status(404);
    throw new Error("Election not found");
  }
  if (election.status !== "pending") {
    res.status(400);
    throw new Error(
      "Cannot update candidates for an active or completed election."
    );
  }

  const candidate = await Candidate.findById(candidateId);
  if (!candidate || candidate.election.toString() !== electionId) {
    res.status(404);
    throw new Error("Candidate not found for this election");
  }

  candidate.name = name || candidate.name;
  candidate.party = party !== undefined ? party : candidate.party; // Allow empty string for party
  candidate.symbolUrl =
    symbolUrl !== undefined ? symbolUrl : candidate.symbolUrl;

  const updatedCandidate = await candidate.save();
  res.json(updatedCandidate);
});

// @desc    Delete a candidate
// @route   DELETE /api/elections/:electionId/candidates/:candidateId
// @access  Private/Admin
const deleteCandidate = asyncHandler(async (req, res) => {
  const { electionId, candidateId } = req.params;

  const election = await Election.findById(electionId);
  if (!election) {
    res.status(404);
    throw new Error("Election not found");
  }
  if (election.status !== "pending") {
    res.status(400);
    throw new Error(
      "Cannot delete candidates from an active or completed election."
    );
  }

  const candidate = await Candidate.findById(candidateId);
  if (!candidate || candidate.election.toString() !== electionId) {
    res.status(404);
    throw new Error("Candidate not found for this election");
  }

  await candidate.deleteOne();
  res.json({ message: "Candidate removed" });
});

// @desc    Get candidates for an election
// @route   GET /api/elections/:electionId/candidates
// @access  Private (Voters need this to see who to vote for)
const getCandidatesForElection = asyncHandler(async (req, res) => {
  const { electionId } = req.params;
  const election = await Election.findById(electionId);
  if (!election) {
    res.status(404);
    throw new Error("Election not found");
  }
  // Check if election is active for voters
  const now = new Date();
  if (election.startTime > now && req.user.role !== "admin") {
    res.status(403);
    throw new Error("This election has not started yet.");
  }
  if (election.endTime < now && req.user.role !== "admin") {
    res.status(403);
    throw new Error("This election has ended.");
  }

  const candidates = await Candidate.find({ election: electionId });
  res.json(candidates);
});

// TODO: Update Candidate, Delete Candidate (admin only)

export {
  addCandidate,
  getCandidatesForElection,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};
