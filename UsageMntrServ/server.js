import express from "express";
import { config as configDotenv } from "dotenv";
import usageRoutes from "./routes/usageRoutes.js";
import connectDb from "./config/dbConnection.js";
import cookieParser from "cookie-parser";
import cors from "cors";

configDotenv();
connectDb();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


// Use usage routes
app.use("/api/usage", usageRoutes);

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Usage Monitoring Service running on port ${port}`);
});