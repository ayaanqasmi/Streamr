import asyncHandler from "express-async-handler";
import Usage from "../models/usageModel.js";

// Middleware to track usage
const trackUsage = asyncHandler(async (req, res, next) => {
  const { userId, dataSize } = req.body; // dataSize in MB

  // Find today's usage record or create one
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  let usage = await Usage.findOne({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  if (!usage) {
    usage = await Usage.create({ userId, dataUsed: 0 });
  }

  // Update the data used
  usage.dataUsed += dataSize;
  await usage.save();

  // Check if the daily bandwidth threshold is exceeded
  if (usage.dataUsed > 100) { // 100MB threshold
    return res.status(403).json({ msg: "Daily bandwidth limit exceeded." });
  }

  next();
});

// Get usage data for a user
const getUsage = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const usage = await Usage.find({ userId }).sort({ date: -1 });
  res.status(200).json(usage);
});

export { trackUsage, getUsage };