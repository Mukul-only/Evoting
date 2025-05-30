import asyncHandler from "express-async-handler";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Vote from "../models/Vote.js";

// @desc    Create a new election
// @route   POST /api/elections
// @access  Private/Admin
const createElection = asyncHandler(async (req, res) => {
  const { name, description, startTime, endTime } = req.body;
  const election = new Election({
    name,
    description,
    startTime,
    endTime,
    createdBy: req.user._id,
  });
  const createdElection = await election.save();
  res.status(201).json(createdElection);
});

// @desc    Get all elections (or active ones for voters)
// @route   GET /api/elections
// @access  Public (for active/upcoming), Private/Admin (for all)
const getElections = asyncHandler(async (req, res) => {
  const now = new Date();
  let query = {};
  if (req.user?.role !== "admin") {
    // Non-admins see only active or upcoming elections
    query = { endTime: { $gte: now } }; // Show elections that haven't ended
  }
  // For admins, show all elections or allow filtering via query params
  // if (req.user?.role === 'admin' && req.query.status) {
  //   query.status = req.query.status;
  // }

  const elections = await Election.find(query).sort({ startTime: 1 });
  res.json(elections);
});

// @desc    Get single election by ID
// @route   GET /api/elections/:id
// @access  Public (if active), Private (for details)
const getElectionById = asyncHandler(async (req, res) => {
  const election = await Election.findById(req.params.id);
  if (!election) {
    res.status(404);
    throw new Error("Election not found");
  }
  // Add candidates to the response
  const candidates = await Candidate.find({ election: election._id });
  res.json({ ...election.toObject(), candidates });
});

// @desc    Get election results
// @route   GET /api/elections/:id/results
// @access  Private/Admin (or public after election ends)
const getElectionResults = asyncHandler(async (req, res) => {
  const election = await Election.findById(req.params.id);
  if (!election) {
    res.status(404);
    throw new Error("Election not found");
  }

  // Only show results if election is completed, or if user is admin
  if (election.status !== "completed" && req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Results are not yet available for this election.");
  }

  const candidates = await Candidate.find({ election: req.params.id });
  const votes = await Vote.find({ election: req.params.id });

  const results = candidates.map((candidate) => {
    const candidateVotes = votes.filter(
      (vote) => vote.candidate.toString() === candidate._id.toString()
    ).length;
    return {
      _id: candidate._id,
      name: candidate.name,
      party: candidate.party,
      symbolUrl: candidate.symbolUrl,
      voteCount: candidateVotes,
    };
  });

  results.sort((a, b) => b.voteCount - a.voteCount); // Sort by most votes

  res.json({
    electionName: election.name,
    totalVotesCast: votes.length,
    results,
  });
});

// TODO: Update Election, Delete Election (admin only)

export { createElection, getElections, getElectionById, getElectionResults };
