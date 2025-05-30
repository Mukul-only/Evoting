// server/controllers/authController.js
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req, res, next) => {
  console.log("Register request body:", req.body);
  const { name, email, password, aadhaarId } = req.body;

  // Strict check for presence AND non-emptiness including trimmed check
  if (
    !name ||
    !email ||
    !password ||
    !aadhaarId ||
    String(aadhaarId).trim() === ""
  ) {
    res.status(400);
    return next(
      new Error(
        "Please provide all required fields: name, email, password, and a valid (non-empty) Aadhaar ID."
      )
    );
  }

  // Check for Aadhaar ID format specifically
  if (!/^\d{12}$/.test(String(aadhaarId).trim())) {
    res.status(400);
    return next(new Error("Aadhaar ID must be exactly 12 digits."));
  }

  const trimmedAadhaarId = String(aadhaarId).trim();
  const lowercasedEmail = String(email).toLowerCase().trim(); // Also trim email

  try {
    const userExists = await User.findOne({
      $or: [{ email: lowercasedEmail }, { aadhaarId: trimmedAadhaarId }],
    });
    if (userExists) {
      res.status(400);
      let conflictField = "";
      if (userExists.email === lowercasedEmail) conflictField = "Email";
      if (userExists.aadhaarId === trimmedAadhaarId)
        conflictField = "Aadhaar ID"; // This check becomes more reliable
      return next(
        new Error(
          `User already exists with this ${
            conflictField || "email or Aadhaar ID"
          }.`
        )
      );
    }

    // Construct the object that will be passed to User.create()
    const userDataToCreate = {
      name: String(name).trim(), // Trim name as well
      email: lowercasedEmail, // Use processed email
      password, // Password will be hashed by pre-save hook in the model
      aadhaarId: trimmedAadhaarId, // Use processed aadhaarId
      role: "voter",
      // isVerified and hasVoted will use schema defaults
    };

    // ⭐ MOST IMPORTANT LOGGING: Log the exact data being passed to User.create
    console.log(
      "Data being passed to User.create():",
      JSON.stringify(userDataToCreate, null, 2)
    );
    // Mongoose schema validation (defined in User.js) will run when User.create is called.
    // If validation fails, it will throw a ValidationError, caught by the catch block.

    const user = await User.create(userDataToCreate);

    // Log the aadhaarId from the successfully created user object from the database
    console.log(
      "User created successfully in DB:",
      user._id,
      "with Aadhaar:",
      user.aadhaarId,
      "and Email:",
      user.email
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      aadhaarId: user.aadhaarId,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("--- ERROR DURING REGISTRATION PROCESS ---");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack); // Full stack trace

    if (error.name === "ValidationError") {
      res.status(400);
      const messages = Object.values(error.errors).map((val) => val.message);
      return next(new Error(messages.join(", ")));
    }

    if (error.code === 11000) {
      // E11000: Duplicate key error
      res.status(400);
      let field = "provided value"; // Default
      // Try to determine which field caused the duplication from the error message or keyValue
      if (error.keyValue) {
        field = Object.keys(error.keyValue)[0];
        field = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize
      } else if (error.message.includes("email_1")) {
        // Fallback to parsing message for default index names
        field = "Email";
      } else if (error.message.includes("aadhaarId_1")) {
        field = "Aadhaar ID";
      }

      // Specifically check if the duplicate key error is for a null aadhaarId
      // This check might become less relevant if schema validation is very strict and DB is clean
      if (
        error.keyValue &&
        error.keyValue.aadhaarId === null &&
        (field === "Aadhaar ID" || field === "aadhaarId")
      ) {
        console.error(
          "Duplicate key error for aadhaarId: null. This indicates an existing record with aadhaarId: null in the DB."
        );
        return next(
          new Error(
            "A data conflict occurred with Aadhaar ID. Please ensure your Aadhaar ID is unique or contact support. An old record with no Aadhaar ID might exist."
          )
        );
      }
      return next(new Error(`${field} already exists.`));
    }
    // For other unhandled errors, pass them to the global error handler
    // The global error handler will default to 500 if no status is set on res yet
    return next(error);
  }
});

// --- 👇 YOUR loginUser and getUserProfile functions should be here 👇 ---

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
  console.log("Login request body:", req.body);
  const { aadhaarId, password } = req.body;

  if (!aadhaarId || !password) {
    res.status(400);
    return next(new Error("Please provide Aadhaar ID and password"));
  }

  const trimmedAadhaarId = String(aadhaarId).trim();

  try {
    const user = await User.findOne({ aadhaarId: trimmedAadhaarId });

    if (user && (await user.matchPassword(password))) {
      console.log("User logged in successfully:", user._id, user.role);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        aadhaarId: user.aadhaarId,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401); // Unauthorized
      return next(new Error("Invalid Aadhaar ID or password"));
    }
  } catch (error) {
    console.error("--- ERROR DURING LOGIN PROCESS ---", error);
    return next(error);
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile  (or /api/users/profile depending on your routes)
// @access  Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  if (req.user) {
    console.log("Fetching profile for user:", req.user._id);
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      aadhaarId: req.user.aadhaarId,
      role: req.user.role,
      hasVoted: req.user.hasVoted,
      isVerified: req.user.isVerified,
    });
  } else {
    res.status(404);
    return next(
      new Error("User not found. Token might be valid but user deleted.")
    );
  }
});

// --- End of functions ---

export { registerUser, loginUser, getUserProfile };
