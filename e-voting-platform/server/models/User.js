import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     aadhaarId: { type: String, required: true, unique: true }, // Should be encrypted in a real app
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["voter", "admin"], default: "voter" },
//     isVerified: { type: Boolean, default: false }, // For potential email verification
//     hasVoted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Election" }], // Elections user has voted in
//   },
//   { timestamps: true }
// );

const userSchema = new mongoose.Schema(
  {
    aadhaarId: {
      type: String,
      required: [true, "Aadhaar ID is required."], // Mongoose validation message
      unique: true,
      trim: true,
      match: [/^\d{12}$/, "Aadhaar ID must be exactly 12 digits."], // Add pattern match
    },
    name: { type: String, required: [true, "Name is required."], trim: true },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: { type: String, enum: ["voter", "admin"], default: "voter" },
    isVerified: { type: Boolean, default: false }, // For potential email verification
    hasVoted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Election" }], // Elections user has voted in
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
