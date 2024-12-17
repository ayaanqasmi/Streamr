import express from "express";
import { login } from "../controllers/authController.js"; // Adjust path as necessary

const router = express.Router();

// Route for logging in a user and generating an access token
router.post("/login", login);

// Route for validating a token (for protected routes)
router.post("/validateToken");

export default router;
