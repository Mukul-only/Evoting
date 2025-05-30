import asyncHandler from "express-async-handler";
import Vote from "../models/Vote.js";
import Election from "../models/Election.js";
import User from "../models/User.js";

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Private/Voter
const castVote = asyncHandler(async (req, res) => {
  const { electionId, candidateId } = req.body;
  const voterId = req.user._id;

  const election = await Election.findById(electionId);
  if (!election) {
    res.status(404);
    throw new Error("Election not found");
  }

  // Check if election is active
  const now = new Date();
  if (now < election.startTime || now > election.endTime) {
    res.status(400);
    throw new Error("Election is not currently active");
  }

  // Check if user has already voted in this election
  const existingVote = await Vote.findOne({
    voter: voterId,
    election: electionId,
  });
  if (existingVote) {
    res.status(400);
    throw new Error("You have already voted in this election");
  }
  // Alternative check using the User model's hasVoted array
  const user = await User.findById(voterId);
  if (user.hasVoted.includes(electionId)) {
    res.status(400);
    throw new Error(
      "You have already voted in this election (user record check)"
    );
  }

  const vote = new Vote({
    voter: voterId,
    election: electionId,
    candidate: candidateId,
  });
  await vote.save();

  // Mark user as voted for this election
  user.hasVoted.push(electionId);
  await user.save();

  res.status(201).json({ message: "Vote cast successfully" });
});

export { castVote };
