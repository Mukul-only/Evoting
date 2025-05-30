import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    party: { type: String },
    symbolUrl: { type: String }, // URL to candidate symbol/photo
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    // votes: { type: Number, default: 0 } // Denormalized vote count, or calculate on demand
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
