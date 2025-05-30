import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    // For enhanced security, consider storing a hash of voterId + electionId
    // to ensure uniqueness without directly linking to the voter in this specific record
    // if full anonymity is required (more complex).
    // For auditability, this direct link is simpler.
  },
  { timestamps: true }
);

// Ensure a voter can vote only once per election
voteSchema.index({ voter: 1, election: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
