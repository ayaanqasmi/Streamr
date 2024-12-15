import express from "express";
import { trackUsage, getUsage } from "../controllers/usageController.js";

const router = express.Router();

// Route to track usage
router.post("/track", trackUsage);

// Route to get usage data for a user
router.get("/:userId", getUsage);

export default router;