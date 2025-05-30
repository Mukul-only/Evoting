import express from "express";
import cors from "cors";
import config from "./config/index.js";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js"; // This will be nested
import voteRoutes from "./routes/voteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import userRoutes from './routes/userRoutes.js'; // if you have specific user actions

connectDB(); // Connect to MongoDB

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

app.get("/", (req, res) => {
  res.send("E-Voting API is running...");
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
// Nest candidate routes under elections:
app.use("/api/elections/:electionId/candidates", candidateRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
// app.use('/api/users', userRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = config.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});
