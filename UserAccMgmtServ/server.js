import express from "express";
import { config as configDotenv } from "dotenv";  // Corrected import for dotenv
import connectDb from "./config/dbConnection.js"; // Assuming this is your database connection
import authRoutes from "./routes/authRoutes.js"; // Importing auth routes
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// Configure dotenv to load environment variables
configDotenv();

// Connect to the database
await connectDb();

// Create the Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Use auth routes for login and token validation
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
