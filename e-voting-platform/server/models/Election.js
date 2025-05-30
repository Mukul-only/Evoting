import mongoose from "mongoose";

const electionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual for status based on time (can be helper or pre-save hook)
electionSchema.pre("save", function (next) {
  const now = new Date();
  if (now < this.startTime) {
    this.status = "pending";
  } else if (now >= this.startTime && now <= this.endTime) {
    this.status = "active";
  } else {
    this.status = "completed";
  }
  next();
});
// You might need a cron job or regular task to update statuses if not done on read.

const Election = mongoose.model("Election", electionSchema);
export default Election;
