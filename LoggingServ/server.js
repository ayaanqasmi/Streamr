import express from "express";
import { config as configDotenv } from "dotenv";
import connectDb from "./dbConnection.js";
import cors from "cors";
import Log from "./loggingModel.js"
configDotenv();
await connectDb();
const app = express();
app.use(express.json());
app.use(cors());


app.post("/api/logs", async (req, res) => {
    try {
      const logEntry = new Log({
        message: req.body.message,
      });
      await logEntry.save();
      res.status(201).json({ message: "Log entry created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating log entry" });
    }
  });
  app.get("/api/logs", async (req, res) => {
    try {
      // Extract the start and end time from query parameters
      const { startTime, endTime } = req.query;
  
      let logs;
  
      if (startTime && endTime) {
        // Validate and parse the provided timestamps
        const start = new Date(startTime);
        const end = new Date(endTime);
  
        if (isNaN(start) || isNaN(end)) {
          return res.status(400).json({ error: "Invalid date format for startTime or endTime" });
        }
        console.log(start,end)
        // Query the database for logs between the specified time periods
        logs = await Log.find({
          createdAt: {
            $gte: start,
            $lte: end,
          },
        });
      } else {
        // Fetch all logs if startTime or endTime is not provided
        logs = await Log.find();
      }
  
      // Return the logs
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ error: "An error occurred while fetching logs" });
    }
  });
  

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Logging Service running on port ${port}`);
});