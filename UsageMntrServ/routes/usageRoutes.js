import express from "express";
import { trackUsage, getTotalUsage } from "../controllers/usageController.js";

const router = express.Router();

// Route to track usage
router.post("/track", trackUsage);

// Route to get total usage data for the day
router.get("/total", getTotalUsage);

export default router;