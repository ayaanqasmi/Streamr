import asyncHandler from "express-async-handler";
import Usage from "../models/usageModel.js";
import Log from "../models/logModel.js";

// Middleware to track usage
const trackUsage = asyncHandler(async (req, res, next) => {
  const { dataSize } = req.body; // dataSize in MB

  // Find today's usage record or create one
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  let usage = await Usage.findOne({
    date: { $gte: startOfDay, $lte: endOfDay },
  });
  if (!usage) {
    usage = await Usage.create({ totalDataUsed: 0 });
  }

  // Update the total data used
  const newTotal = usage.totalDataUsed + dataSize;

  // Log the usage before adding to usage, can move this after usage.save() too or run both in Promise.all for lower latency
  const logEntry = new Log({
    date: new Date(),
    dataSize: dataSize,
    totalDataUsed: newTotal,
  });
  await logEntry.save();

  // Check if the daily bandwidth threshold is exceeded
  if (newTotal > 100) { // 100MB threshold
    return res.status(403).json({ msg: "Daily bandwidth limit exceeded for all users." });
  }

  usage.totalDataUsed = newTotal;
  await usage.save();
  console.log(logEntry)
  res.status(200).json(({msg: `Added usage.`, totalDataUsed: usage.totalDataUsed}));
});

// Get total usage data for the day
const getTotalUsage = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const usage = await Usage.findOne({
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  res.status(200).json(usage || { totalDataUsed: 0 });
});

export { trackUsage, getTotalUsage };